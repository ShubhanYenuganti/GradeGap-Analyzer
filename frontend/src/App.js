import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import CreateClassPage from './pages/CreateClassPage';
import UploadPage from './pages/UploadPage';
import InsightsPage from './pages/InsightsPage';
import Login from './pages/Login';
import Signup from './pages/Signup';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateClassPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/insights" element={<InsightsPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;