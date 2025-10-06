import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import './ExamineBatchesPage.css';

const API_BASE = 'http://localhost:8000';

export default function ExamineBatchesPage({ setPage, batches, setBatches, setCurrentBatchId }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const response = await fetch(`${API_BASE}/get-all-batches`);
        const data = await response.json();
        setBatches(data.batches);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching batches:', error);
      }
    };

    fetchBatches();
  }, [setBatches]);

  const handleBatchClick = (batchId) => {
    setCurrentBatchId(batchId);
    setPage('batch-detail');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="examine-page">
      <button onClick={() => setPage('home')} className="back-button">
        <ArrowLeft size={20} />
        Back to Home
      </button>
      
      <h1 className="page-title">Test Batch History</h1>
      
      <div className="batches-list">
        {batches.map((batch) => (
          <div key={batch.id} onClick={() => handleBatchClick(batch.id)} className="batch-card">
            <div className="batch-info">
              <div>
                <h3 className="batch-name">{batch.name}</h3>
                <p className="batch-date">{new Date(batch.date).toLocaleString()}</p>
              </div>
              <div>
                {batch.is_complete ? (
                  <span className="badge complete">Complete</span>
                ) : (
                  <span className="badge running">Running</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
