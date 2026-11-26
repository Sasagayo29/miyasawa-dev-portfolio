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
  const cacheKey = `gh_repos_${GITHUB_USERNAME}`;
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
      description: repo.description || 'Repositório público sem descrição cadastrada no GitHub.',
      category: repo.language || 'Outros',
      techStack: [
        ...(repo.language ? [repo.language] : []),
        ...(repo.topics || []).slice(0, 4),
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