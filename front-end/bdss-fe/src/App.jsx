import React from 'react';
import Layout from './components/Layout/Layout';
import HomePage from './pages/HomePage/HomePage';
import './index.css'; // Import global CSS for basic styling if needed

function App() {
    return (
        <Layout>
            <HomePage />
        </Layout>
    );
}

export default App;