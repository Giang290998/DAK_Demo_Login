import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <GoogleOAuthProvider clientId="1044709976489-n4u9i0dgqb612pclr8mq588hon0lukas.apps.googleusercontent.com"> 
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </GoogleOAuthProvider>
);
