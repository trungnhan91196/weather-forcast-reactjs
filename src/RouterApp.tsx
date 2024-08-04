import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './pages/main';
import SearchHistory from 'pages/searchHistory';


const RouterApp: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={"/"} element={<HomePage />} />
        <Route path={"/:locale"} element={<HomePage />} />
        <Route path="/search-history" element={<SearchHistory />} />
      </Routes>
    </BrowserRouter>
  )
};
export default RouterApp;