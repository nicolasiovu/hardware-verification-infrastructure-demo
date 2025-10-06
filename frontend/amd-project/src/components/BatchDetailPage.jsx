import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, ArrowLeft, TrendingUp, Search } from 'lucide-react';
import './BatchDetailPage.css';

const API_BASE = 'http://localhost:8000';

export default function BatchDetailPage({ batchId, setPage, setSelectedTest, isNew }) {
  const [batchData, setBatchData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

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

  const handleTestClick = (test) => {
    setSelectedTest(test);
    setPage('test-detail');
  };

  if (loading || !batchData) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  const filteredTests = batchData.tests.filter(test => {
    const matchesSearch = test.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || test.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="batch-detail-page">
      <button onClick={() => setPage(isNew ? 'home' : 'examine-batches')} className="back-button">
        <ArrowLeft size={20} />
        {isNew ? 'Back to Home' : 'Back to Batches'}
      </button>
      
      <div className="batch-header">
        <div className="header-content">
          <div>
            <h1 className="batch-title">{batchData.batch.name}</h1>
            <p className="batch-date">{new Date(batchData.batch.date).toLocaleString()}</p>
          </div>
          <div>
            {batchData.is_complete ? (
              <span className="badge complete">Complete</span>
            ) : (
              <span className="badge running">
                <div className="spinner-small"></div>
                Running
              </span>
            )}
          </div>
        </div>
        
        <div className="stats-grid">
          <div className="stat-card blue">
            <div className="stat-header">
              <TrendingUp size={20} />
              <span>Total Tests</span>
            </div>
            <p className="stat-value">{batchData.total_tests}</p>
          </div>
          
          <div className="stat-card green">
            <div className="stat-header">
              <CheckCircle size={20} />
              <span>Passed</span>
            </div>
            <p className="stat-value passed">{batchData.passed_tests}</p>
          </div>
          
          <div className="stat-card red">
            <div className="stat-header">
              <XCircle size={20} />
              <span>Failed</span>
            </div>
            <p className="stat-value failed">{batchData.failed_tests}</p>
          </div>
          
          <div className="stat-card purple">
            <div className="stat-header">
              <AlertCircle size={20} />
              <span>Pass Rate</span>
            </div>
            <p className="stat-value">{batchData.pass_rate}%</p>
          </div>
        </div>
        
        {batchData.most_common_failure && (
          <div className="failure-notice">
            <p className="failure-label">Most Common Failure</p>
            <p className="failure-text">{batchData.most_common_failure}</p>
          </div>
        )}
      </div>
      
      <div className="tests-container">
        <div className="tests-header">
          <h2 className="tests-title">Test Results ({filteredTests.length})</h2>
          
          <div className="controls">
            <div className="search-box">
              <Search className="search-icon" size={18} />
              <input
                type="text"
                placeholder="Search tests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">All Tests</option>
              <option value="pass">Passed Only</option>
              <option value="fail">Failed Only</option>
            </select>
          </div>
        </div>
        
        <div className="tests-list">
          {filteredTests.map((test) => (
            <div
              key={test.id}
              onClick={() => handleTestClick(test)}
              className={`test-item ${test.status}`}
            >
              <div className="test-content">
                <div className="test-info">
                  {test.status === 'pass' ? (
                    <CheckCircle className="test-icon pass" size={20} />
                  ) : (
                    <XCircle className="test-icon fail" size={20} />
                  )}
                  <div>
                    <h3 className="test-name">{test.name}</h3>
                    <p className="test-time">{new Date(test.timestamp).toLocaleTimeString()}</p>
                  </div>
                </div>
                <div className="test-runtime">
                  <p className="runtime-label">Runtime</p>
                  <p className="runtime-value">{test.runtime.toFixed(2)}s</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
