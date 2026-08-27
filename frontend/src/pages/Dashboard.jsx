import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { api } from '../api';

const COLORS_PIE = ['#169B62', '#D14343', '#D58A00'];

export default function Dashboard({ BrandLogo }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sectorFilter, setSectorFilter] = useState('');

  const load = async (setor) => {
    setLoading(true);
    try {
      const d = await api.getDashboard(setor || undefined);
      setData(d);
    } catch (e) {
      setError('Erro ao carregar dados. Verifique a conexão com a API.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  if (loading) return (
    <div style={styles.loadingPage}>
      <div style={styles.spinner} />
      <div style={{ color: '#fff', marginTop: 16, fontSize: 15 }}>Carregando dashboard...</div>
    </div>
  );

  if (error) return (
    <div style={styles.loadingPage}>
      <div style={{ color: '#fff', marginTop: 16, fontSize: 15, textAlign: 'center', maxWidth: 340 }}>{error}</div>
    </div>
  );

  const t = data?.totais || {};
  const totalQuestions = data?.por_pergunta?.length || 0;
  const taxaConclusao = t.total_participantes > 0
    ? Math.round((t.total_concluidos / t.total_participantes) * 100)
    : 0;

  const pieData = [
    { name: 'Acertos', value: parseFloat(t.media_acertos) || 0 },
    { name: 'Erros', value: parseFloat(t.media_erros) || 0 },
    { name: 'Não resp.', value: parseFloat(t.media_nao_respondidas) || 0 }
  ];

  const perPerguntaData = (data?.por_pergunta || []).map(q => ({
    name: `Q${q.ordem}`,
    fullName: q.enunciado.substring(0, 50) + '...',
    acertos: parseInt(q.acertos) || 0,
    erros: parseInt(q.erros) || 0,
    'Não resp.': parseInt(q.tempo_esgotado) || 0
  }));

  const setorData = (data?.por_setor || []).map(s => ({
    setor: s.setor.length > 12 ? s.setor.substring(0, 12) + '.' : s.setor,
    fullSetor: s.setor,
    'Média Acertos': parseFloat(s.media_acertos) || 0,
    participantes: parseInt(s.participantes) || 0
  }));

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <div style={styles.headerBadge}>Dashboard administrativo</div>
            <h1 style={styles.headerTitle}>Blitz da CIPAA</h1>
            <div style={styles.headerSub}>CIPAA 2026 · Segurança, saúde e respeito no trabalho</div>
          </div>
          <BrandLogo className="dashboard-logo" />
        </div>

        {/* Filter */}
        <div style={styles.filterBar}>
          <label style={styles.filterLabel}>Filtrar por setor:</label>
          <select
            style={styles.filterSelect}
            value={sectorFilter}
            onChange={e => { setSectorFilter(e.target.value); load(e.target.value); }}
          >
            <option value="">Todos os setores</option>
            {(data?.setores || []).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <button style={styles.refreshBtn} onClick={() => load(sectorFilter)}>Atualizar</button>
        </div>

        {/* KPI Cards */}
        <div style={styles.kpiGrid}>
          <KpiCard label="Participantes" value={t.total_participantes || 0} color="#0F5E41" bg="#F0F6EE" border="#D4E6D6" />
          <KpiCard label="Quizzes concluídos" value={t.total_concluidos || 0} color="#169B62" bg="#E8F6EE" border="#B9E0C9" />
          <KpiCard label="Taxa de conclusão" value={`${taxaConclusao}%`} color="#A86A00" bg="#FFF7DF" border="#F1D78D" />
          <KpiCard label="Média de acertos" value={`${parseFloat(t.media_acertos || 0).toFixed(1)}/${totalQuestions}`} color="#0F5E41" bg="#F0F6EE" border="#D4E6D6" />
          <KpiCard label="Média de erros" value={`${parseFloat(t.media_erros || 0).toFixed(1)}/${totalQuestions}`} color="#D14343" bg="#FFF0F0" border="#F3C3C3" />
          <KpiCard label="Tempo médio/pergunta" value={data?.tempo_medio ? `${data.tempo_medio}s` : '--'} color="#4B5D50" bg="#F4F6F3" border="#DDE5DC" />
        </div>

        {/* Charts row */}
        <div style={styles.chartsRow}>
          {/* Pie */}
          <div style={styles.chartCard}>
            <div style={styles.chartTitle}>Distribuição média de respostas</div>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS_PIE[i]} />)}
                </Pie>
                <Tooltip formatter={(v) => v.toFixed(1)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar - per question */}
          <div style={{ ...styles.chartCard, flex: 2 }}>
            <div style={styles.chartTitle}>Desempenho por pergunta</div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={perPerguntaData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 12, fill: '#64748B' }} />
                <Tooltip
                  labelFormatter={(_, payload) => payload?.[0]?.payload?.fullName || ''}
                  formatter={(v, name) => [v, name]}
                />
                <Bar dataKey="acertos" fill="#169B62" radius={[4, 4, 0, 0]} name="Acertos" />
                <Bar dataKey="erros" fill="#D14343" radius={[4, 4, 0, 0]} name="Erros" />
                <Bar dataKey="Não resp." fill="#D58A00" radius={[4, 4, 0, 0]} />
                <Legend />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sector ranking */}
        {setorData.length > 0 && (
          <div style={styles.chartCard}>
            <div style={styles.chartTitle}>Ranking de setores por acertos</div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={setorData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" horizontal={false} />
                <XAxis type="number" domain={[0, Math.max(totalQuestions, 1)]} tick={{ fontSize: 12, fill: '#64748B' }} />
                <YAxis dataKey="setor" type="category" tick={{ fontSize: 11, fill: '#334155' }} width={80} />
                <Tooltip
                  labelFormatter={(_, p) => p?.[0]?.payload?.fullSetor || ''}
                  formatter={(v) => [v.toFixed(1), 'Média de acertos']}
                />
                <Bar dataKey="Média Acertos" fill="#169B62" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Error table */}
        {data?.por_pergunta?.length > 0 && (
          <div style={styles.chartCard}>
            <div style={styles.chartTitle}>Perguntas com maior índice de erro</div>
            <div style={{ overflowX: 'auto' }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>#</th>
                    <th style={styles.th}>Pergunta</th>
                    <th style={{ ...styles.th, textAlign: 'center' }}>Acertos</th>
                    <th style={{ ...styles.th, textAlign: 'center' }}>Erros</th>
                    <th style={{ ...styles.th, textAlign: 'center' }}>Taxa de Erro</th>
                  </tr>
                </thead>
                <tbody>
                  {[...data.por_pergunta].sort((a, b) => b.taxa_erro - a.taxa_erro).map(q => (
                    <tr key={q.ordem} style={styles.tr}>
                      <td style={styles.td}><strong>Q{q.ordem}</strong></td>
                      <td style={{ ...styles.td, maxWidth: 280 }}>{q.enunciado}</td>
                      <td style={{ ...styles.td, textAlign: 'center', color: '#169B62', fontWeight: 700 }}>{q.acertos}</td>
                      <td style={{ ...styles.td, textAlign: 'center', color: '#D14343', fontWeight: 700 }}>{q.erros}</td>
                      <td style={{ ...styles.td, textAlign: 'center' }}>
                        <span style={{
                          background: q.taxa_erro > 50 ? '#FFF0F0' : '#E8F6EE',
                          color: q.taxa_erro > 50 ? '#D14343' : '#0F5E41',
                          padding: '3px 10px', borderRadius: 12, fontSize: 12, fontWeight: 700
                        }}>
                          {q.taxa_erro || 0}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div style={styles.footer}>
          Blitz da CIPAA · CIPAA 2026
        </div>
      </div>
    </div>
  );
}

function KpiCard({ label, value, color, bg, border }) {
  return (
    <div style={{ background: bg, border: `1.5px solid ${border}`, borderRadius: 16, padding: '20px 18px' }}>
      <div style={{ fontSize: 28, fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 12, color: '#64748B', fontWeight: 600, marginTop: 6 }}>{label}</div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', padding: '32px 16px' },
  container: { maxWidth: 1100, margin: '0 auto' },
  loadingPage: {
    minHeight: '100vh', display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center'
  },
  spinner: {
    width: 40, height: 40, border: '4px solid rgba(255,255,255,0.2)',
    borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite'
  },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
    background: '#fff', borderRadius: 20, padding: '28px 32px', marginBottom: 20,
    boxShadow: '0 4px 20px rgba(15,94,65,0.14)'
  },
  headerBadge: {
    fontSize: 11, fontWeight: 700, color: '#0F5E41', textTransform: 'uppercase',
    letterSpacing: '1px', background: '#E8F6EE', padding: '4px 12px',
    borderRadius: 20, border: '1px solid #B9E0C9', display: 'inline-block', marginBottom: 10
  },
  headerTitle: { fontSize: 28, fontWeight: 800, color: '#102219', marginBottom: 4 },
  headerSub: { fontSize: 13, color: '#64748B', fontWeight: 500 },
  headerBrand: { width: 48, height: 48, borderRadius: '50%', background: '#0F5E41', color: '#C5F25A', display: 'grid', placeItems: 'center', fontSize: 24, fontWeight: 800 },
  filterBar: {
    display: 'flex', alignItems: 'center', gap: 12, background: '#fff',
    borderRadius: 14, padding: '16px 20px', marginBottom: 20,
    boxShadow: '0 2px 10px rgba(15,94,65,0.10)', flexWrap: 'wrap'
  },
  filterLabel: { fontSize: 13, fontWeight: 700, color: '#334155' },
  filterSelect: {
    border: '1.5px solid #E2E8F0', borderRadius: 8, padding: '8px 14px',
    fontSize: 14, color: '#1E293B', background: '#F8FAFC', cursor: 'pointer'
  },
  refreshBtn: {
    background: '#E8F6EE', color: '#0F5E41', border: '1.5px solid #B9E0C9',
    borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer'
  },
  kpiGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: 16, marginBottom: 20
  },
  chartsRow: { display: 'flex', gap: 16, marginBottom: 28, flexWrap: 'wrap' },
  chartCard: {
    background: '#fff', borderRadius: 16, padding: '24px 20px', flex: 1, minWidth: 280,
    boxShadow: '0 2px 12px rgba(15,94,65,0.10)', marginBottom: 28
  },
  chartTitle: { fontSize: 14, fontWeight: 700, color: '#071A4A', marginBottom: 18 },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 13 },
  th: {
    background: '#F8FAFC', padding: '10px 14px', textAlign: 'left',
    fontWeight: 700, color: '#334155', borderBottom: '2px solid #E2E8F0', fontSize: 12
  },
  td: { padding: '12px 14px', borderBottom: '1px solid #F1F5F9', color: '#1E293B', verticalAlign: 'top' },
  tr: { transition: 'background 0.15s' },
  footer: {
    textAlign: 'center', padding: '24px', fontSize: 12,
    color: 'rgba(255,255,255,0.55)', fontWeight: 500
  }
};
