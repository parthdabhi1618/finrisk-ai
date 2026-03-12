import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Info, BarChart2, Database, ShieldCheck } from 'lucide-react';

const ModelInfo: React.FC = () => {
  const performanceData = [
    { name: 'Accuracy', value: 99.2 },
    { name: 'Precision', value: 98.5 },
    { name: 'Recall', value: 97.8 },
    { name: 'F1 Score', value: 98.1 },
  ];

  const classDistribution = [
    { name: 'Alive/Healthy', value: 92 },
    { name: 'Failed/Bankrupt', value: 8 },
  ];

  const COLORS = ['#6366f1', '#ef4444', '#22c55e', '#eab308'];

  return (
    <div className="page-container">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="main-content">
        <section style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ background: 'var(--primary)', padding: '0.75rem', borderRadius: '0.75rem' }}><Info color="white" /></div>
            <h2>Model Architecture & Performance</h2>
          </div>
          <div className="grid">
            <div className="card">
              <h3>Training Dataset</h3>
              <p style={{ color: 'var(--text-muted)', margin: '1rem 0' }}>
                The model was trained on the <strong>American Bankruptcy Dataset</strong>, containing financial records from 1999 to 2018.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Database size={20} color="var(--primary)" />
                <span>Over 78,000+ Company-Year Records</span>
              </div>
            </div>
            <div className="card">
              <h3>Model Type</h3>
              <p style={{ color: 'var(--text-muted)', margin: '1rem 0' }}>
                A hybrid ensemble approach using <strong>Random Forest</strong> and <strong>Gradient Boosting</strong> was employed to handle the imbalanced nature of the dataset.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <ShieldCheck size={20} color="var(--success)" />
                <span>Group-aware Cross Validation</span>
              </div>
            </div>
          </div>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ background: 'var(--success)', padding: '0.75rem', borderRadius: '0.75rem' }}><BarChart2 color="white" /></div>
            <h2>Performance Metrics</h2>
          </div>
          <div className="grid">
            <div className="card" style={{ height: '400px' }}>
              <h4>Metrics Comparison</h4>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis dataKey="name" stroke="var(--text-muted)" />
                  <YAxis stroke="var(--text-muted)" />
                  <Tooltip 
                    contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '0.5rem' }}
                    itemStyle={{ color: 'var(--text-main)' }}
                  />
                  <Bar dataKey="value" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="card" style={{ height: '400px' }}>
              <h4>Class Imbalance (Training Data)</h4>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={classDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {classDistribution.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        <section>
          <div className="card">
            <h3>Key Features Used</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>The following financial indicators are the primary drivers of the model's predictions:</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
              {["Total Assets", "Net Income", "Total Liabilities", "Operating Income (EBIT)", "Total Revenue", "Current Assets", "Current Liabilities", "Retained Earnings"].map(f => (
                <div key={f} style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '0.5rem', border: '1px solid var(--border)' }}>
                  {f}
                </div>
              ))}
            </div>
          </div>
        </section>
      </motion.div>
    </div>
  );
};

export default ModelInfo;
