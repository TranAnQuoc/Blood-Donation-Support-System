import React from 'react';
import './index.css';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './redux/store';
import { RouterProvider } from 'react-router-dom';
import router from './router/router';
import { WebSocketProvider } from './hooks/useWebSocket';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

function App() {
    return (
        <Provider store={store}>
            <PersistGate loading={<div>Loading application...</div>} persistor={persistor}>
                <WebSocketProvider>
                    <RouterProvider router={router} />
                    {/* <ToastContainer /> */}
                </WebSocketProvider>
            </PersistGate>
        </Provider>
    );
}

export default App;
