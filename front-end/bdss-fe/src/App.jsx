import React from 'react';
import './index.css';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './redux/store';
import { RouterProvider } from 'react-router-dom';
import router from './router/router'; 

function App() {
    return (
        <Provider store={store}>
            <PersistGate loading={<div>Loading application...</div>} persistor={persistor}>
                <RouterProvider router={router} />
            </PersistGate>
        </Provider>
    );
}

export default App;