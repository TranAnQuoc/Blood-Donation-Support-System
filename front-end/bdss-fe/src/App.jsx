import React from 'react';
import Layout from './layouts/Layout.jsx';
import HomePage from './pages/home/index.jsx';
import './index.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;
