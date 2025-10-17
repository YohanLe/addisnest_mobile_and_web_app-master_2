import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import App from './App';
import './assets/css/style.css';
import './assets/css/image-uploader.css';
import './assets/css/uploader-demo.css';
import './assets/css/location-popup.css';
import './assets/css/mortgage-calculator.css';
import './assets/css/favorite.css';
import './assets/css/chat.css';
import './assets/css/notification.css';
import './assets/css/mobile-property-cards.css';
import './components/admin/admin.css';
import { store as Store, persistedStore } from './Redux-store/Store';

// Create root element for React to render into
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the App with Router and Redux providers
root.render(
  <React.StrictMode>
    <Provider store={Store}>
      <PersistGate loading={null} persistor={persistedStore}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
