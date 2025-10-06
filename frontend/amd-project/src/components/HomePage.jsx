import React from 'react';
import { Play, Clock } from 'lucide-react';
import './HomePage.css';

const API_BASE = 'http://localhost:8000';

export default function HomePage({ setPage, setCurrentBatchId }) {
  const handleRunNewBatch = async () => {
    try {
      const response = await fetch(`${API_BASE}/run-new-batch`, { method: 'POST' });
      const data = await response.json();
      setCurrentBatchId(data.batch_id);
      setPage('new-batch');
    } catch (error) {
      console.error('Error starting batch:', error);
      alert('Failed to start batch');
    }
  };

  return (
    <div className="home-page">
      <div className="home-container">
        <h1 className="home-title">Testbench Runner Dashboard</h1>
        <p className="home-subtitle">Manage and monitor your test batches</p>
        
        <div className="button-grid">
          <button onClick={handleRunNewBatch} className="action-button blue">
            <Play size={48} />
            <div>
              <h2>Run New Batch</h2>
              <p>Start a new test execution batch</p>
            </div>
          </button>
          
          <button onClick={() => setPage('examine-batches')} className="action-button green">
            <Clock size={48} />
            <div>
              <h2>Examine Batches</h2>
              <p>View history and results</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
