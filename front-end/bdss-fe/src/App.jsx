import React from 'react';
import Layout from './layouts/Layout.jsx';
import HomePage from './pages/home/index.jsx';
import './index.css';
import { BrowserRouter as Router, Route, Routes, createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import LayoutAdmin from './layouts/LayoutAdmin.jsx';
import { persistor, store } from './redux/store'
import LoginForm from './components/authen-form/LoginForm.jsx'
import RegisterForm from './components/authen-form/RegisterForm.jsx';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

function App() {
    const router = createBrowserRouter([
        {
            path: "/",
            element: (
                <>
                    <Layout>
                    <Outlet />
                    </Layout>
                </>
            ),
            children: [
                {
                    path: "/login",
                    element: <LoginForm />
                },
                {
                    path: "/register",
                    element: <RegisterForm />
                }
            ]
        }
        
    ]);
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <RouterProvider router={router} />
            </PersistGate>
        </Provider>
    );
}

export default App;
