import React from "react";
import { Route, Routes } from "react-router-dom";
import SearchAgentPage from "./search-agent";
import FindAgentListPage from "./find-agent-list";

const FindAgentPage = () => {
  return (
    <Routes>
      <Route path="/" element={<SearchAgentPage />} />
      <Route path="/list" element={<FindAgentListPage />} />
    </Routes>
  );
};

export default FindAgentPage;
