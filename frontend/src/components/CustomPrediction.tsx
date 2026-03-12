import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, RefreshCcw, Settings2, Info, ChevronDown, ChevronUp, Database, Target, AlertTriangle, ShieldAlert, ShieldCheck, Scale, ActivitySquare, Banknote } from 'lucide-react';
import type { ModelInfo, CustomPredictionResponse } from '../types';
import RiskMeter from './RiskMeter';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const DEMO_DATA: Record<string, number> = {
  year: 2024,
  X1: 1500.50, // Current Assets
  X2: 800.20,  // COGS
  X3: 50.00,   // Dep
  X4: 300.00,  // EBITDA
  X5: 200.00,  // Inventory
  X6: 120.00,  // Net Income
  X7: 400.00,  // Receivables
  X8: 5000.00, // Market Cap
  X9: 2500.00, // Sales
  X10: 4500.00,// Assets
  X11: 600.00, // LT Debt
  X12: 250.00, // EBIT
  X13: 1700.00,// Gross Profit
  X14: 900.00, // Current Liab
  X15: 1200.00,// Ret Earnings
  X16: 2500.00,// Revenue
  X17: 2000.00,// Liab
  X18: 2200.00 // Op Exp
};

const CustomPrediction: React.FC = () => {
  const [modelInfo, setModelInfo] = useState<ModelInfo | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [formData, setFormData] = useState<Record<string, number>>({
    year: new Date().getFullYear(),
    X1: 0, X2: 0, X3: 0, X4: 0, X5: 0, X6: 0, X7: 0, X8: 0, X9: 0,
    X10: 0, X11: 0, X12: 0, X13: 0, X14: 0, X15: 0, X16: 0, X17: 0, X18: 0
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CustomPredictionResponse | null>(null);

  useEffect(() => {
    axios.get('http://localhost:8000/info').then(res => setModelInfo(res.data));
  }, []);

  const loadDemoData = () => {
    setFormData(DEMO_DATA);
    setResult(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/predict/custom', formData);
      setResult(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getInsightIcon = (type: string) => {
    switch(type) {
      case 'critical': return <ShieldAlert color="var(--danger)" size={20} />;
      case 'warning': return <AlertTriangle color="var(--danger)" size={20} />;
      case 'success': return <ShieldCheck color="var(--success)" size={20} />;
      default: return <Info color="var(--primary)" size={20} />;
    }
  };

  if (!modelInfo) return <div style={{ textAlign: 'center', padding: '5rem' }}><Loader2 className="spinner" size={48} /></div>;

  const topFeatures = modelInfo.top_features;
  const otherFeatures = Object.keys(modelInfo.features).filter(k => !topFeatures.includes(k));

  return (
    <div className="page-container">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Settings2 /> Business Simulator</h2>
            <p style={{ color: 'var(--text-muted)' }}>Input financial figures in <strong>₹ Crores</strong> to test risk scenarios.</p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={loadDemoData} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Database size={16} /> Load Demo
            </button>
            <button onClick={() => setResult(null)} style={{ background: 'transparent', border: '1px solid var(--border)' }}>
              <RefreshCcw size={16} />
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: result ? '1fr 500px' : '1fr', gap: '2rem', transition: 'all 0.3s' }}>
          <form onSubmit={handleSubmit} className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>
              <Info size={18} />
              <span style={{ fontWeight: 600 }}>Primary Indicators (Amount in ₹ Cr)</span>
            </div>
            
            <div className="grid">
              <div className="feature-field">
                <label>Fiscal Year</label>
                <input type="number" value={formData.year} onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})}/>
              </div>
              {topFeatures.map((key: string) => (
                <div key={key} className="feature-field">
                  <label>{modelInfo.features[key]}</label>
                  <input 
                    type="number" 
                    step="any"
                    value={formData[key]} 
                    onChange={(e) => setFormData({...formData, [key]: parseFloat(e.target.value) || 0})}
                    placeholder="0.00"
                  />
                </div>
              ))}
            </div>

            <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
              <div 
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--text-muted)' }}
                onClick={() => setShowAdvanced(!showAdvanced)}
              >
                {showAdvanced ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                <span>Secondary Parameters (Amount in ₹ Cr)</span>
              </div>
              
              <AnimatePresence>
                {showAdvanced && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{ overflow: 'hidden', marginTop: '1.5rem' }}
                  >
                    <div className="grid">
                      {otherFeatures.map(key => (
                        <div key={key} className="feature-field">
                          <label style={{ fontSize: '0.75rem' }}>{modelInfo.features[key]}</label>
                          <input 
                            type="number" 
                            step="any"
                            value={formData[key]} 
                            onChange={(e) => setFormData({...formData, [key]: parseFloat(e.target.value) || 0})}
                            style={{ height: '2.5rem', fontSize: '0.9rem' }}
                          />
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div style={{ marginTop: '2rem' }}>
              <button type="submit" disabled={loading} style={{ width: '100%', height: '3.5rem', fontSize: '1.1rem' }}>
                {loading ? <Loader2 className="spinner" /> : 'Run Risk Simulation'}
              </button>
            </div>
          </form>

          {result && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="card" style={{ height: 'fit-content' }}>
              <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Simulation Dashboard</h3>
              
              <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '1.5rem', gap: '0.5rem' }}>
                 <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.5rem', borderRadius: '0.5rem', textAlign: 'center' }}>
                   <div style={{ color: 'var(--primary)', fontSize: '0.75rem' }}><Scale size={14}/> Liquidity</div>
                   <div style={{ fontWeight: 700 }}>{result.prediction.ratios.current_ratio}</div>
                 </div>
                 <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.5rem', borderRadius: '0.5rem', textAlign: 'center' }}>
                   <div style={{ color: 'var(--text-main)', fontSize: '0.75rem' }}><Banknote size={14}/> Solvency</div>
                   <div style={{ fontWeight: 700 }}>{result.prediction.ratios.debt_to_asset}</div>
                 </div>
                 <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.5rem', borderRadius: '0.5rem', textAlign: 'center' }}>
                   <div style={{ color: 'var(--success)', fontSize: '0.75rem' }}><ActivitySquare size={14}/> Margin</div>
                   <div style={{ fontWeight: 700 }}>{result.prediction.ratios.net_margin_pct}%</div>
                 </div>
              </div>

              <RiskMeter probability={result.prediction.probability} />
              
              <div style={{ marginTop: '1rem' }}>
                <h4 style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Strategic AI Insights:</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '250px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                  {result.prediction.insights.map((insight, idx) => (
                    <div key={idx} style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '0.5rem', borderLeft: `3px solid ${insight.type === 'success' ? 'var(--success)' : insight.type === 'info' ? 'var(--primary)' : 'var(--danger)'}` }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', fontWeight: 600, fontSize: '0.875rem' }}>
                         {getInsightIcon(insight.type)} {insight.title}
                       </div>
                       <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                         {insight.desc}
                       </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>
                   <Target size={16} color="var(--primary)" /> Top AI Risk Drivers
                 </div>
                 <div style={{ height: '120px' }}>
                   <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={result.prediction.analysis} layout="vertical">
                       <XAxis type="number" hide />
                       <YAxis dataKey="name" type="category" width={80} style={{ fontSize: '0.65rem', fill: 'var(--text-muted)' }} />
                       <Tooltip contentStyle={{ background: 'var(--bg-card)', border: 'none', borderRadius: '8px' }} />
                       <Bar dataKey="importance" radius={[0, 4, 4, 0]} fill="var(--primary)" />
                     </BarChart>
                   </ResponsiveContainer>
                 </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default CustomPrediction;
