// Message notification utility
// Using browser's native notification API instead of react-toastify to avoid dependency issues

class MessageNotificationService {
  constructor() {
    this.listeners = [];
    this.unreadCount = 0;
  }

  // Add listener for message count updates
  addListener(callback) {
    this.listeners.push(callback);
  }

  // Remove listener
  removeListener(callback) {
    this.listeners = this.listeners.filter(listener => listener !== callback);
  }

  // Notify all listeners of count change
  notifyListeners(count) {
    this.unreadCount = count;
    this.listeners.forEach(callback => callback(count));
  }

  // Show new message notification
  showNewMessageNotification(senderName, messagePreview) {
    // Try to use browser notification if permission is granted
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`New message from ${senderName}`, {
        body: messagePreview.length > 100 ? messagePreview.substring(0, 100) + '...' : messagePreview,
        icon: '/favicon.ico',
        tag: 'message-notification'
      });
    } else if ('Notification' in window && Notification.permission !== 'denied') {
      // Request permission for future notifications
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification(`New message from ${senderName}`, {
            body: messagePreview.length > 100 ? messagePreview.substring(0, 100) + '...' : messagePreview,
            icon: '/favicon.ico',
            tag: 'message-notification'
          });
        }
      });
    }
  }

  // Increment unread count
  incrementUnreadCount() {
    this.notifyListeners(this.unreadCount + 1);
  }

  // Set unread count
  setUnreadCount(count) {
    this.notifyListeners(count);
  }

  // Clear unread count
  clearUnreadCount() {
    this.notifyListeners(0);
  }

  // Get current unread count
  getUnreadCount() {
    return this.unreadCount;
  }

  // Simulate receiving a new message (for demo purposes)
  simulateNewMessage(senderName = "Agent", messagePreview = "Hello! I have some updates about your property inquiry.") {
    this.incrementUnreadCount();
    this.showNewMessageNotification(senderName, messagePreview);
  }
}

// Create singleton instance
const messageNotificationService = new MessageNotificationService();

export default messageNotificationService;
