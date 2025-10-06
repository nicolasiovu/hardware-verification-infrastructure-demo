import React from 'react';
import { CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import './TestDetailPage.css';

export default function TestDetailPage({ test, setPage }) {
  if (!test) return null;

  return (
    <div className="test-detail-page">
      <button onClick={() => setPage('batch-detail')} className="back-button">
        <ArrowLeft size={20} />
        Back to Batch
      </button>
      
      <div className="test-detail-card">
        <div className="test-header">
          {test.status === 'pass' ? (
            <CheckCircle className="test-icon-large pass" size={48} />
          ) : (
            <XCircle className="test-icon-large fail" size={48} />
          )}
          <div>
            <h1 className="test-title">{test.name}</h1>
            <p className="test-id">Test ID: {test.id}</p>
          </div>
        </div>
        
        <div className="detail-grid">
          <div className="detail-item">
            <p className="detail-label">Status</p>
            <p className={`detail-value ${test.status}`}>{test.status.toUpperCase()}</p>
          </div>
          
          <div className="detail-item">
            <p className="detail-label">Runtime</p>
            <p className="detail-value">{test.runtime.toFixed(3)} seconds</p>
          </div>
          
          <div className="detail-item">
            <p className="detail-label">Timestamp</p>
            <p className="detail-value">{new Date(test.timestamp).toLocaleString()}</p>
          </div>
          
          <div className="detail-item">
            <p className="detail-label">Batch ID</p>
            <p className="detail-value">{test.batch_id}</p>
          </div>
        </div>
        
        {test.failure_reason && (
          <div className="failure-box">
            <h3 className="failure-title">Failure Reason</h3>
            <p className="failure-text">{test.failure_reason}</p>
          </div>
        )}
      </div>
    </div>
  );
}
