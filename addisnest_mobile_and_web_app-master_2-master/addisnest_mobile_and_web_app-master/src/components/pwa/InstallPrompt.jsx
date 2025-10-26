import React, { useState, useEffect } from 'react';
import './InstallPrompt.css';

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      // Show the install prompt
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowPrompt(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return;
    }

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    console.log(`User response to the install prompt: ${outcome}`);

    // Clear the deferredPrompt for reuse
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Store dismissal in localStorage to not show for 7 days
    localStorage.setItem('pwa-prompt-dismissed', Date.now().toString());
  };

  // Check if prompt was dismissed recently
  useEffect(() => {
    const dismissed = localStorage.getItem('pwa-prompt-dismissed');
    if (dismissed) {
      const dismissedTime = parseInt(dismissed);
      const sevenDays = 7 * 24 * 60 * 60 * 1000;
      if (Date.now() - dismissedTime < sevenDays) {
        setShowPrompt(false);
      }
    }
  }, []);

  if (!showPrompt) {
    return null;
  }

  return (
    <div className="install-prompt-overlay">
      <div className="install-prompt">
        <button className="install-prompt-close" onClick={handleDismiss}>
          ✕
        </button>
        <div className="install-prompt-icon">
          📱
        </div>
        <h3 className="install-prompt-title">Install AddisNest App</h3>
        <p className="install-prompt-description">
          Install AddisNest on your device for a better experience. Quick access, offline browsing, and instant property updates!
        </p>
        <div className="install-prompt-features">
          <div className="feature-item">
            <span className="feature-icon">⚡</span>
            <span>Fast Access</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">📴</span>
            <span>Offline Mode</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🔔</span>
            <span>Push Notifications</span>
          </div>
        </div>
        <div className="install-prompt-buttons">
          <button className="install-btn install-btn-primary" onClick={handleInstallClick}>
            Install Now
          </button>
          <button className="install-btn install-btn-secondary" onClick={handleDismiss}>
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallPrompt;
