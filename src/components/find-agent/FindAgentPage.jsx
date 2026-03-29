import React from 'react';
import { Route, Routes } from 'react-router-dom';
import SearchAgent from './search-agent/sub-component/SearchAgent';
import FindAgentList from './find-agent-list/sub-component/FindAgentList';
import './find-agent.css';

const FindAgentPage = () => {
  return (
    <div className="findagent-page-main">
      <Routes>
        <Route path="/" element={<SearchAgent />} />
        <Route path="/list" element={<FindAgentList />} />
      </Routes>
    </div>
  );
};

export default FindAgentPage;
