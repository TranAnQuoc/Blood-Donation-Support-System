import React from 'react';
import { Outlet } from 'react-router-dom'; // Import Outlet
import Header from '../components/header/index.jsx';
import Footer from '../components/footer/index.jsx';
import { ToastContainer } from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import CSS của react-toastify
import styles from './layout.module.css';

// Layout không nhận 'children' prop từ router, mà dùng Outlet
const Layout = () => {
    return (
        <div className={styles.layout}>
            <Header />
            <main className={styles.mainContent}>
                <Outlet /> {/* Nơi các component con của route sẽ được render */}
            </main>
            <Footer />
            {/* ToastContainer sẽ hiển thị thông báo trên mọi trang dùng Layout này */}
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