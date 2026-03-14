import { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, Target, Building2, ArrowRight, ShieldAlert, ShieldCheck, Info, Scale, ActivitySquare, Banknote, AlertTriangle } from 'lucide-react';
import type { PublicPredictionResponse } from '../types';
import RiskMeter from './RiskMeter';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const FEATURED_COMPANIES = [
  { name: 'Reliance Industries', symbol: 'RELIANCE' },
  { name: 'TCS', symbol: 'TCS' },
  { name: 'Zomato', symbol: 'ZOMATO' },
  { name: 'Adani Enterprises', symbol: 'ADANIENT' },
  { name: 'Yes Bank', symbol: 'YESBANK' },
  { name: 'Suzlon Energy', symbol: 'SUZLON' },
];

const PublicPrediction: React.FC = () => {
  const [symbol, setSymbol] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PublicPredictionResponse | null>(null);

  const fetchPrediction = async (ticker: string) => {
    setLoading(true);
    setResult(null);

    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/predict/public/${ticker}`);
      setResult(response.data);
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to fetch company data. Ensure it is a valid Indian ticker (e.g. RELIANCE, TCS).');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (symbol) fetchPrediction(symbol);
  };

  const getInsightIcon = (type: string) => {
    switch(type) {
      case 'critical': return <ShieldAlert color="var(--danger)" size={20} />;
      case 'warning': return <AlertTriangle color="var(--danger)" size={20} />;
      case 'success': return <ShieldCheck color="var(--success)" size={20} />;
      default: return <Info color="var(--primary)" size={20} />;
    }
  };

  return (
    <div className="page-container">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
        <div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card">
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Building2 color="var(--primary)" /> Corporate Financial Health</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}> Search Indian equities for a comprehensive ML-driven solvency and risk assessment. </p>

            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={20} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  placeholder="Ticker Symbol (e.g. TATAMOTORS)" 
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                  style={{ paddingLeft: '2.5rem', height: '3.5rem', fontSize: '1.1rem' }}
                />
              </div>
              <button type="submit" disabled={loading} style={{ height: '3.5rem', padding: '0 2rem' }}>
                {loading ? <Loader2 className="spinner" /> : 'Run Assessment'}
              </button>
            </form>
          </motion.div>

          <AnimatePresence>
            {result && (
              <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} style={{ marginTop: '2rem' }}>
                <div className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.5rem' }}>{result.company_name} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>| {result.symbol}</span></h3>
                      <div className={`prediction-badge ${result.prediction.prediction === 1 ? 'badge-failed' : 'badge-alive'}`} style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}>
                        Model Classification: {result.prediction.status}
                      </div>
                    </div>
                  </div>

                  {/* Financial Ratios Dashboard */}
                  <h4 style={{ color: 'var(--text-muted)', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Fundamental Ratios</h4>
                  <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '2rem' }}>
                     <div className="card" style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem' }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                         <Scale size={16} /> Liquidity (Current Ratio)
                       </div>
                       <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>{result.prediction.ratios.current_ratio}</div>
                     </div>
                     <div className="card" style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem' }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                         <Banknote size={16} /> Solvency (Debt/Asset)
                       </div>
                       <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>{result.prediction.ratios.debt_to_asset}</div>
                     </div>
                     <div className="card" style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem' }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                         <ActivitySquare size={16} /> Profitability (Net Margin)
                       </div>
                       <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>{result.prediction.ratios.net_margin_pct}%</div>
                     </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    {/* Insights & Recommendations */}
                    <div>
                      <h4 style={{ color: 'var(--text-muted)', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Strategic Insights</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {result.prediction.insights.map((insight, idx) => (
                          <div key={idx} style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.5rem', borderLeft: `4px solid ${insight.type === 'success' ? 'var(--success)' : insight.type === 'info' ? 'var(--primary)' : 'var(--danger)'}` }}>
                             <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', fontWeight: 600 }}>
                               {getInsightIcon(insight.type)} {insight.title}
                             </div>
                             <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                               {insight.desc}
                             </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* ML Model Details */}
                    <div>
                      <h4 style={{ color: 'var(--text-muted)', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>AI Model Analysis</h4>
                      <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center', marginBottom: '1rem' }}>
                          <RiskMeter probability={result.prediction.probability} />
                        </div>
                        <div style={{ marginTop: '1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>
                            <Target size={16} color="var(--primary)" /> Top Risk Drivers
                          </div>
                          <div style={{ height: '150px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={result.prediction.analysis} layout="vertical">
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={100} style={{ fontSize: '0.7rem', fill: 'var(--text-muted)' }} />
                                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: 'none', borderRadius: '8px' }} />
                                <Bar dataKey="importance" radius={[0, 4, 4, 0]} fill="var(--primary)" />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="sidebar">
          <h4 style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>Quick Analysis</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {FEATURED_COMPANIES.map(comp => (
              <div 
                key={comp.symbol} 
                className="card" 
                style={{ padding: '1rem', cursor: 'pointer', border: '1px solid transparent', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                onClick={() => fetchPrediction(comp.symbol)}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
              >
                <div>
                  <div style={{ fontWeight: 700 }}>{comp.symbol}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{comp.name}</div>
                </div>
                <ArrowRight size={16} color="var(--text-muted)" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicPrediction;
