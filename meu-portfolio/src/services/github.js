const GITHUB_USERNAME = 'Sasagayo29';
const CACHE_TTL = 15 * 60 * 1000; // 15 minutos

// Repositórios que você não quer listar na vitrine (ex: README do perfil ou o próprio portfólio)
const IGNORED_REPOS = [GITHUB_USERNAME.toLowerCase()];

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
    // Ignora caso o storage esteja cheio ou bloqueado
  }
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
      defaultBranch: repo.default_branch,
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
    {
      headers: { Accept: 'application/vnd.github.raw+json' },
    }
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
  const cleanPath = path ? `/${path}` : '';
  const cacheKey = `gh_files_${GITHUB_USERNAME}_${repoName}_${path}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;

  const res = await fetch(
    `https://api.github.com/repos/${GITHUB_USERNAME}/${repoName}/contents${cleanPath}`
  );

  if (!res.ok) {
    throw new Error('Não foi possível carregar os arquivos.');
  }

  const items = await res.json();
  if (!Array.isArray(items)) return [];

  // Ordena pastas primeiro, depois arquivos em ordem alfabética
  const sorted = items.sort((a, b) => {
    if (a.type === b.type) return a.name.localeCompare(b.name);
    return a.type === 'dir' ? -1 : 1;
  });

  setCache(cacheKey, sorted);
  return sorted;
}