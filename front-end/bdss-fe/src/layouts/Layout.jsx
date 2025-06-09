import React from 'react';
import Header from '../components/header/index.jsx';
import Footer from '../components/footer/index.jsx';
import styles from './layout.module.css';

const Layout = ({ children }) => {
    return (
        <div className={styles.layout}>
            <Header />
            <main className={styles.mainContent}>
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;