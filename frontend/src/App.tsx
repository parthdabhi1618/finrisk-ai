import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Landmark, UserCheck, BarChart3 } from 'lucide-react';
import PublicPrediction from './components/PublicPrediction';
import CustomPrediction from './components/CustomPrediction';
import ModelInfo from './components/ModelInfo';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState<'public' | 'custom' | 'info'>('public');

  return (
    <div className="app-container">
      <nav>
        <div className="logo">
          <Activity size={28} />
          <span>FinRisk AI</span>
        </div>
        <div className="nav-links">
          <button 
            className={`nav-link ${activeTab === 'public' ? 'active' : ''}`}
            onClick={() => setActiveTab('public')}
            style={{ background: 'transparent', border: 'none' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Landmark size={18} /> Public Companies
            </div>
          </button>
          <button 
            className={`nav-link ${activeTab === 'custom' ? 'active' : ''}`}
            onClick={() => setActiveTab('custom')}
            style={{ background: 'transparent', border: 'none' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <UserCheck size={18} /> Custom Entry
            </div>
          </button>
          <button 
            className={`nav-link ${activeTab === 'info' ? 'active' : ''}`}
            onClick={() => setActiveTab('info')}
            style={{ background: 'transparent', border: 'none' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BarChart3 size={18} /> Model Specs
            </div>
          </button>
        </div>
      </nav>

      <main className="main-content">
        <AnimatePresence mode="wait">
          {activeTab === 'public' && (
            <motion.div
              key="public"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <PublicPrediction />
            </motion.div>
          )}
          {activeTab === 'custom' && (
            <motion.div
              key="custom"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <CustomPrediction />
            </motion.div>
          )}
          {activeTab === 'info' && (
            <motion.div
              key="info"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <ModelInfo />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
        &copy; 2026 FinRisk Analytics. Powered by Advanced ML.
      </footer>
    </div>
  );
}

export default App;
