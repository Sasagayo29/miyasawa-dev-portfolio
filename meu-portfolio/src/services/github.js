const GITHUB_USERNAME = 'Sasagayo29';
const CACHE_TTL = 15 * 60 * 1000; // 15 minutos
const MAX_PREVIEW_BYTES = 300 * 1024; // 300 KB

// Repositórios que não devem aparecer na vitrine
const IGNORED_REPOS = [GITHUB_USERNAME.toLowerCase()];

const IMAGE_EXTENSIONS = new Set(['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'ico', 'bmp']);
const BINARY_EXTENSIONS = new Set([
  'pdf', 'zip', 'rar', '7z', 'tar', 'gz', 'exe', 'dll', 'so', 'bin',
  'mp4', 'mov', 'avi', 'mp3', 'wav', 'woff', 'woff2', 'ttf', 'eot',
  'xlsx', 'xls', 'docx', 'doc', 'pptx', 'pyc', 'db', 'sqlite', 'sqlite3',
]);

function getCache(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const { timestamp, data } = JSON.parse(raw);
    if (Date.now() - timestamp > CACHE_TTL) {
      localStorage.removeItem(key);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

function setCache(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify({ timestamp: Date.now(), data }));
  } catch {
    // Ignora se o storage estiver indisponível
  }
}

function encodePath(path) {
  return path.split('/').map(encodeURIComponent).join('/');
}

export function getFileExtension(filename = '') {
  const parts = filename.toLowerCase().split('.');
  return parts.length > 1 ? parts.pop() : '';
}

export async function fetchGithubRepos() {
  const cacheKey = `gh_repos_v2_${GITHUB_USERNAME}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;

  const res = await fetch(
    `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`
  );

  if (!res.ok) {
    throw new Error(`GitHub API retornou status ${res.status}`);
  }

  const rawRepos = await res.json();

  const formatted = rawRepos
    .filter((repo) => !repo.fork && !IGNORED_REPOS.includes(repo.name.toLowerCase()))
    .map((repo) => ({
      id: `gh-${repo.id}`,
      isGithubRepo: true,
      repoName: repo.name,
      title: repo.name,
      description: repo.description?.trim() || '',
      category: repo.language || 'Outros',
      techStack: [
        ...(repo.language ? [repo.language] : []),
        ...(repo.topics || []).slice(0, 3),
      ],
      htmlUrl: repo.html_url,
      homepage: repo.homepage,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      defaultBranch: repo.default_branch || 'main',
      updatedAt: repo.updated_at,
    }));

  setCache(cacheKey, formatted);
  return formatted;
}

export async function fetchRepoReadme(repoName) {
  const cacheKey = `gh_readme_${GITHUB_USERNAME}_${repoName}`;
  const cached = getCache(cacheKey);
  if (cached !== null) return cached;

  const res = await fetch(
    `https://api.github.com/repos/${GITHUB_USERNAME}/${repoName}/readme`,
    { headers: { Accept: 'application/vnd.github.raw+json' } }
  );

  if (res.status === 404) {
    setCache(cacheKey, '');
    return '';
  }

  if (!res.ok) {
    throw new Error('Não foi possível carregar o README.');
  }

  const markdown = await res.text();
  setCache(cacheKey, markdown);
  return markdown;
}

export async function fetchRepoContents(repoName, path = '') {
  const cleanPath = path ? `/${encodePath(path)}` : '';
  const cacheKey = `gh_files_${GITHUB_USERNAME}_${repoName}_${path}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;

  const res = await fetch(
    `https://api.github.com/repos/${GITHUB_USERNAME}/${repoName}/contents${cleanPath}`
  );

  if (!res.ok) {
    throw new Error('Não foi possível carregar os arquivos do diretório.');
  }

  const items = await res.json();
  if (!Array.isArray(items)) return [];

  const sorted = items.sort((a, b) => {
    if (a.type === b.type) return a.name.localeCompare(b.name);
    return a.type === 'dir' ? -1 : 1;
  });

  setCache(cacheKey, sorted);
  return sorted;
}

export async function fetchFileContent(repoName, item) {
  const ext = getFileExtension(item.name);

  if (IMAGE_EXTENSIONS.has(ext) && item.download_url) {
    return { type: 'image', url: item.download_url };
  }

  if (BINARY_EXTENSIONS.has(ext)) {
    return {
      type: 'unsupported',
      reason: `Arquivo binário (.${ext}) não suportado para leitura direta no terminal.`,
    };
  }

  if (item.size > MAX_PREVIEW_BYTES) {
    return {
      type: 'unsupported',
      reason: `Arquivo grande demais para preview inline (${(item.size / 1024).toFixed(1)} KB).`,
    };
  }

  const cacheKey = `gh_file_raw_${GITHUB_USERNAME}_${repoName}_${item.path}`;
  const cached = getCache(cacheKey);
  if (cached !== null) {
    return { type: 'text', content: cached };
  }

  const res = await fetch(
    `https://api.github.com/repos/${GITHUB_USERNAME}/${repoName}/contents/${encodePath(item.path)}`,
    { headers: { Accept: 'application/vnd.github.raw+json' } }
  );

  if (!res.ok) {
    throw new Error('Não foi possível ler o conteúdo deste arquivo.');
  }

  const content = await res.text();
  setCache(cacheKey, content);
  return { type: 'text', content };
}

export function resolveGithubImageUrl(src, repoName, branch = 'main') {
  if (!src || /^https?:\/\//i.test(src) || src.startsWith('data:')) {
    return src;
  }
  const cleanSrc = src.replace(/^\.?\//, '');
  return `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${repoName}/${branch}/${cleanSrc}`;
}

const LEVEL_MAP = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

function computeLevel(count) {
  if (!count || count <= 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 9) return 3;
  return 4;
}

async function fetchContributionsWithFallback() {
  // 1ª tentativa: API primária (jogruber)
  try {
    const res = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME.toLowerCase()}?y=last`
    );
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data?.contributions) && data.contributions.length > 0) {
        const contributions = data.contributions.map((d) => ({
          date: d.date,
          count: Number(d.count) || 0,
          level: typeof d.level === 'number' ? d.level : computeLevel(d.count),
        }));
        const total =
          data?.total?.lastYear ??
          contributions.reduce((acc, day) => acc + day.count, 0);
        return { contributions, total };
      }
    }
  } catch {
    // Segue para o fallback
  }

  // 2ª tentativa: API secundária (Deno)
  try {
    const res = await fetch(
      `https://github-contributions-api.deno.dev/${GITHUB_USERNAME}.json`
    );
    if (res.ok) {
      const data = await res.json();
      const flat = Array.isArray(data?.contributions)
        ? data.contributions.flat()
        : [];
      if (flat.length > 0) {
        const contributions = flat
          .filter((d) => d?.date)
          .map((d) => {
            const count = Number(d.contributionCount ?? d.count) || 0;
            const mappedLevel =
              typeof d.level === 'number'
                ? d.level
                : LEVEL_MAP[d.contributionLevel] ?? computeLevel(count);
            return { date: d.date, count, level: mappedLevel };
          })
          .sort((a, b) => a.date.localeCompare(b.date));

        const total =
          Number(data?.totalContributions) ||
          contributions.reduce((acc, day) => acc + day.count, 0);
        return { contributions, total };
      }
    }
  } catch {
    // Ambas indisponíveis no momento
  }

  return { contributions: [], total: 0 };
}

let inFlightStatsPromise = null;

export async function fetchGithubStats(forceRefresh = false) {
  const cacheKey = `gh_stats_v2_${GITHUB_USERNAME}`;

  if (!forceRefresh) {
    const cached = getCache(cacheKey);
    if (cached && cached.hasContributionData) return cached;
  }

  if (inFlightStatsPromise && !forceRefresh) {
    return inFlightStatsPromise;
  }

  inFlightStatsPromise = (async () => {
    const [userRes, reposRes, contribData] = await Promise.all([
      fetch(`https://api.github.com/users/${GITHUB_USERNAME}`)
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null),
      fetchGithubRepos().catch(() => []),
      fetchContributionsWithFallback(),
    ]);

    const { contributions, total: totalContributions } = contribData;
    const hasContributionData = contributions.length > 0;

    let activeDays = 0;
    let longestStreak = 0;
    let currentStreak = 0;

    for (const day of contributions) {
      if (day.count > 0) {
        activeDays += 1;
        currentStreak += 1;
        if (currentStreak > longestStreak) longestStreak = currentStreak;
      } else {
        currentStreak = 0;
      }
    }

    const monthMap = new Map();
    const monthFormatter = new Intl.DateTimeFormat('pt-BR', { month: 'short' });

    for (const day of contributions) {
      const key = day.date.slice(0, 7);
      monthMap.set(key, (monthMap.get(key) || 0) + day.count);
    }

    const monthlyActivity = Array.from(monthMap.entries())
      .slice(-12)
      .map(([key, count]) => {
        const [year, month] = key.split('-');
        const label = monthFormatter
          .format(new Date(Number(year), Number(month) - 1, 1))
          .replace('.', '');
        return {
          key,
          label: label.charAt(0).toUpperCase() + label.slice(1),
          count,
        };
      });

    const langCounts = {};
    for (const repo of reposRes) {
      if (repo.category && repo.category !== 'Outros') {
        langCounts[repo.category] = (langCounts[repo.category] || 0) + 1;
      }
    }

    const totalCategorized =
      Object.values(langCounts).reduce((a, b) => a + b, 0) || 1;

    const topLanguages = Object.entries(langCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, count]) => ({
        name,
        count,
        percent: Math.round((count / totalCategorized) * 100),
      }));

    const stats = {
      username: GITHUB_USERNAME,
      hasContributionData,
      publicRepos: userRes?.public_repos ?? reposRes.length,
      followers: userRes?.followers ?? 0,
      joinedYear: userRes?.created_at
        ? new Date(userRes.created_at).getFullYear()
        : 2023,
      totalContributions,
      activeDays,
      longestStreak,
      totalStars: reposRes.reduce((acc, r) => acc + (r.stars || 0), 0),
      totalForks: reposRes.reduce((acc, r) => acc + (r.forks || 0), 0),
      topLanguages,
      monthlyActivity,
      contributions,
    };

    // Só grava no cache se as contribuições tiverem vindo preenchidas
    if (hasContributionData) {
      setCache(cacheKey, stats);
    }

    return stats;
  })();

  try {
    return await inFlightStatsPromise;
  } finally {
    inFlightStatsPromise = null;
  }
}