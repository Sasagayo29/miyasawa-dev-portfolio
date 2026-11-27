import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  FolderGit2,
  Flame,
  GitCommit,
  Code2,
  ExternalLink,
  Calendar,
  RefreshCw,
} from 'lucide-react';
import { fetchGithubStats } from '../services/github';

const LEVEL_COLORS = [
  'bg-[#161b22] border border-white/5',
  'bg-[#0e4429]',
  'bg-[#006d32]',
  'bg-[#26a641]',
  'bg-[#39d353] shadow-[0_0_6px_rgba(57,211,83,0.45)]',
];

const LANG_COLORS = [
  'bg-terminal-green',
  'bg-cyan-400',
  'bg-emerald-400',
  'bg-blue-400',
  'bg-yellow-400',
  'bg-purple-400',
];

const MAX_BAR_PX = 128;

export default function GithubStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [graphMode, setGraphMode] = useState('heatmap');

  const loadStats = async (force = false) => {
    if (force) setRefreshing(true);
    else setLoading(true);

    try {
      const data = await fetchGithubStats(force);
      setStats(data);
      // Se as APIs de contribuições estiverem fora, cai automaticamente no Pacman Graph do seu GitHub
      if (!data.hasContributionData) {
        setGraphMode('pacman');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadStats(false);
  }, []);

  const maxMonthly = stats?.monthlyActivity?.length
    ? Math.max(...stats.monthlyActivity.map((m) => m.count), 1)
    : 1;

  const kpis = stats
    ? [
        {
          label: 'Contribuições (12m)',
          value: stats.hasContributionData
            ? stats.totalContributions.toLocaleString('pt-BR')
            : '--',
          sub: `Desde ${stats.joinedYear} no GitHub`,
          icon: <Activity size={18} className="text-terminal-green" />,
        },
        {
          label: 'Repositórios Públicos',
          value: stats.publicRepos,
          sub: `${stats.totalStars} stars • ${stats.totalForks} forks`,
          icon: <FolderGit2 size={18} className="text-cyan-400" />,
        },
        {
          label: 'Dias Ativos no Ano',
          value: stats.hasContributionData ? stats.activeDays : '--',
          sub: stats.hasContributionData
            ? `${Math.round((stats.activeDays / 365) * 100)}% do calendário`
            : 'Aguardando sincronização',
          icon: <GitCommit size={18} className="text-emerald-400" />,
        },
        {
          label: 'Maior Sequência',
          value: stats.hasContributionData ? `${stats.longestStreak} dias` : '--',
          sub: 'Streak consecutivo',
          icon: <Flame size={18} className="text-terminal-yellow" />,
        },
      ]
    : [];

  return (
    <section
      id="stats"
      className="py-20 bg-transparent text-gray-300 font-mono border-t border-gray-800 relative z-10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho */}
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl text-white font-bold flex items-center gap-3">
              <span className="text-terminal-green">&gt;</span>
              <span>gh stats --user=Sasagayo29</span>
            </h2>
            <p className="text-gray-500 mt-2 text-xs sm:text-sm">
              Telemetria pública sincronizada em tempo real com o perfil do GitHub.
            </p>
          </motion.div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => loadStats(true)}
              disabled={refreshing}
              className="inline-flex items-center gap-1.5 text-xs px-3 py-2 rounded bg-surface border border-gray-700 hover:border-terminal-green text-gray-300 hover:text-terminal-green transition-colors disabled:opacity-50"
            >
              <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
              <span>{refreshing ? 'Sincronizando...' : 'Atualizar'}</span>
            </button>

            <a
              href="https://github.com/Sasagayo29"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs px-3.5 py-2 rounded bg-surface border border-gray-700 hover:border-terminal-green text-gray-300 hover:text-terminal-green transition-colors"
            >
              <span>github.com/Sasagayo29</span>
              <ExternalLink size={13} />
            </a>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-28 bg-surface/80 border border-gray-800 rounded-lg" />
            ))}
          </div>
        ) : stats ? (
          <div className="space-y-6">
            {/* Linha 1: 4 KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {kpis.map((kpi, idx) => (
                <motion.div
                  key={kpi.label}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                  className="bg-surface/80 backdrop-blur-sm border border-gray-800 hover:border-terminal-green/40 rounded-lg p-4 sm:p-5 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] sm:text-xs text-gray-400">{kpi.label}</span>
                    {kpi.icon}
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-white">{kpi.value}</div>
                  <div className="text-[11px] text-gray-500 mt-1">{kpi.sub}</div>
                </motion.div>
              ))}
            </div>

            {/* Linha 2: Atividade Mensal + Top Linguagens */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Gráfico de Barras Mensal (altura em pixels para não colapsar) */}
              <div className="lg:col-span-7 bg-surface/80 backdrop-blur-sm border border-gray-800 rounded-lg p-5 sm:p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Calendar size={16} className="text-terminal-green" />
                    Contribuições por Mês (Último Ano)
                  </h3>
                  {stats.hasContributionData && (
                    <span className="text-[11px] text-gray-500">
                      Pico: {maxMonthly} contrib.
                    </span>
                  )}
                </div>

                {stats.monthlyActivity.length > 0 ? (
                  <div className="grid grid-cols-12 gap-1.5 sm:gap-2.5 items-end pt-2">
                    {stats.monthlyActivity.map((month) => {
                      const barHeightPx =
                        month.count > 0
                          ? Math.max(Math.round((month.count / maxMonthly) * MAX_BAR_PX), 8)
                          : 4;
                      return (
                        <div
                          key={month.key}
                          className="flex flex-col items-center justify-end group"
                        >
                          <span className="text-[10px] text-terminal-green mb-1 opacity-75 group-hover:opacity-100 transition-opacity">
                            {month.count}
                          </span>
                          <div
                            className="w-full flex items-end justify-center"
                            style={{ height: `${MAX_BAR_PX}px` }}
                          >
                            <div
                              title={`${month.label}: ${month.count} contribuições`}
                              style={{ height: `${barHeightPx}px` }}
                              className={`w-full rounded-t transition-all ${
                                month.count > 0
                                  ? 'bg-[#2ea043]/50 border-t-2 border-[#39d353] group-hover:bg-[#39d353]/80'
                                  : 'bg-gray-800/60'
                              }`}
                            />
                          </div>
                          <span className="text-[10px] text-gray-500 mt-2 truncate">
                            {month.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="h-40 flex flex-col items-center justify-center text-center gap-3 text-xs text-gray-500">
                    <p>Serviço público de contribuições indisponível no momento.</p>
                    <button
                      type="button"
                      onClick={() => loadStats(true)}
                      className="px-3 py-1.5 rounded border border-terminal-green/50 text-terminal-green hover:bg-terminal-green/10 transition-colors"
                    >
                      Tentar novamente
                    </button>
                  </div>
                )}
              </div>

              {/* Distribuição de Linguagens */}
              <div className="lg:col-span-5 bg-surface/80 backdrop-blur-sm border border-gray-800 rounded-lg p-5 sm:p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-5">
                    <Code2 size={16} className="text-cyan-400" />
                    Top Linguagens (por Repositório)
                  </h3>

                  <div className="h-3 w-full rounded-full overflow-hidden flex gap-0.5 mb-6 bg-gray-900">
                    {stats.topLanguages.map((lang, i) => (
                      <div
                        key={lang.name}
                        style={{ width: `${lang.percent}%` }}
                        title={`${lang.name}: ${lang.percent}%`}
                        className={LANG_COLORS[i % LANG_COLORS.length]}
                      />
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {stats.topLanguages.map((lang, i) => (
                      <div
                        key={lang.name}
                        className="flex items-center justify-between bg-[#0d1117]/70 border border-gray-800/80 rounded px-3 py-2 text-xs"
                      >
                        <span className="flex items-center gap-2 text-gray-300 truncate">
                          <span
                            className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                              LANG_COLORS[i % LANG_COLORS.length]
                            }`}
                          />
                          <span className="truncate">{lang.name}</span>
                        </span>
                        <span className="text-gray-500 shrink-0 ml-2">
                          {lang.count} ({lang.percent}%)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Linha 3: Heatmap Real + Toggle Pacman Graph */}
            <div className="bg-surface/80 backdrop-blur-sm border border-gray-800 rounded-lg p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-terminal-green animate-pulse" />
                  Calendário de Contribuições
                </h3>

                <div className="flex gap-2 text-xs">
                  <button
                    onClick={() => setGraphMode('heatmap')}
                    className={`px-3 py-1 rounded border transition-colors ${
                      graphMode === 'heatmap'
                        ? 'bg-terminal-green/15 border-terminal-green/50 text-terminal-green'
                        : 'border-gray-800 text-gray-400 hover:text-white'
                    }`}
                  >
                    Heatmap Live
                  </button>
                  <button
                    onClick={() => setGraphMode('pacman')}
                    className={`px-3 py-1 rounded border transition-colors ${
                      graphMode === 'pacman'
                        ? 'bg-terminal-green/15 border-terminal-green/50 text-terminal-green'
                        : 'border-gray-800 text-gray-400 hover:text-white'
                    }`}
                  >
                    Pacman Graph
                  </button>
                </div>
              </div>

              {graphMode === 'heatmap' && stats.contributions.length > 0 ? (
                <div className="overflow-x-auto pb-2">
                  <div
                    className="inline-grid grid-flow-col gap-1 min-w-max"
                    style={{ gridTemplateRows: 'repeat(7, minmax(0, 1fr))' }}
                  >
                    {stats.contributions.map((day) => (
                      <div
                        key={day.date}
                        title={`${day.date}: ${day.count} contribuições`}
                        className={`w-3 h-3 rounded-[2px] transition-transform hover:scale-125 ${
                          LEVEL_COLORS[day.level] || LEVEL_COLORS[0]
                        }`}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto flex justify-center py-2">
                  <img
                    src="https://raw.githubusercontent.com/Sasagayo29/Sasagayo29/output/pacman-contribution-graph-dark.svg"
                    alt="Pacman contribution graph"
                    className="max-w-full h-auto"
                    loading="lazy"
                  />
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}