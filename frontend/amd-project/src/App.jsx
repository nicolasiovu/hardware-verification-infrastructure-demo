import React, { useState } from 'react';
import HomePage from './components/HomePage';
import NewBatchPage from './components/NewBatchPage';
import ExamineBatchesPage from './components/ExamineBatchesPage';
import BatchDetailPage from './components/BatchDetailPage';
import TestDetailPage from './components/TestDetailPage';
import './App.css';
import amdLogo from './assets/amd_logo.png'; // import the logo

export default function App() {
  const [page, setPage] = useState('home');
  const [currentBatchId, setCurrentBatchId] = useState(null);
  const [batches, setBatches] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);

  return (
    <div className="app">
      {/* Fixed header with logo */}
      <header className="app-header">
        <img src={amdLogo} alt="AMD Logo" className="app-logo" />
      </header>

      {/* Main content */}
      <main className="app-content">
        {page === 'home' && <HomePage setPage={setPage} setCurrentBatchId={setCurrentBatchId} />}
        {page === 'new-batch' && <NewBatchPage batchId={currentBatchId} setPage={setPage} />}
        {page === 'examine-batches' && <ExamineBatchesPage setPage={setPage} setBatches={setBatches} batches={batches} setCurrentBatchId={setCurrentBatchId} />}
        {page === 'batch-detail' && <BatchDetailPage batchId={currentBatchId} setPage={setPage} setSelectedTest={setSelectedTest} />}
        {page === 'test-detail' && <TestDetailPage test={selectedTest} setPage={setPage} />}
      </main>
    </div>
  );
}

