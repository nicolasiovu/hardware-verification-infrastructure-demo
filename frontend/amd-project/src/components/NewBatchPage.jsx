import React, { useState, useEffect } from 'react';
import BatchDetailPage from './BatchDetailPage';

const API_BASE = 'http://localhost:8000';

export default function NewBatchPage({ batchId, setPage }) {
  const [batchData, setBatchData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBatchData = async () => {
      try {
        const response = await fetch(`${API_BASE}/get-tests-from-batch/${batchId}`);
        const data = await response.json();
        setBatchData(data);
        setLoading(false);
        
        if (!data.is_complete) {
          setTimeout(fetchBatchData, 500);
        }
      } catch (error) {
        console.error('Error fetching batch data:', error);
      }
    };

    if (batchId) {
      fetchBatchData();
    }
  }, [batchId]);

  if (loading || !batchData) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="spinner"></div>
          <p>Initializing batch...</p>
        </div>
      </div>
    );
  }

  return <BatchDetailPage batchId={batchId} setPage={setPage} isNew={true} />;
}
