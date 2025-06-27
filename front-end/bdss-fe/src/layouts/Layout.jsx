import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/header/index.jsx';
import Footer from '../components/footer/index.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './layout.module.css';

const Layout = () => {
    return (
        <div className={styles.layout}>
            <Header />
            <main className={styles.mainContent}>
                <Outlet />
            </main>
            <Footer />
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </div>
    );
};

export default Layout;