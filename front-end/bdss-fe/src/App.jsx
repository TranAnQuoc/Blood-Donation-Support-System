import React from 'react';
import Layout from './layouts/Layout.jsx';
import HomePage from './pages/home/index.jsx';
import './index.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LayoutAdmin from './layouts/LayoutAdmin.jsx';

function App() {
    return (
        <Router>
            
                <Routes>
                    <Route path="/" element={<Layout />} />
                    <Route path="/admin" element={<LayoutAdmin />} />
                </Routes>
        </Router>
    );
}

export default App;
