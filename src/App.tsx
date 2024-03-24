import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // SwitchをRoutesに変更
import Home from './pages/Home';
import Sidebar from './components/Sidebar';
import SubmissionPage from './pages/SubmissionPage';

const App: React.FC = () => {
  return (
    <Router>
      <div className="app">
        <Sidebar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/submission/:problemNum" element={<SubmissionPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
