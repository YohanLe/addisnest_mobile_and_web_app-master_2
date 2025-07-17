# Mobile Chat Interface

A two-column chat interface for mobile devices that provides a modern messaging experience, integrated with the account management page.

## Features

- Two-column layout for mobile devices
- Initially shows only the chat list
- On tap, slides to a full message view with the conversation list collapsed to the side
- Message panel includes contact's avatar, name, role, and timestamp
- Chat messages displayed in chat bubbles, aligned left or right based on sender
- Date separators between messages from different days
- 'Accept' and 'Decline' buttons for actionable messages

## Implementation

The mobile chat interface consists of the following components:

1. `MobileChatInterface.jsx` - The main React component that implements the chat interface
2. `mobile-chat-interface.css` - The CSS styles for the chat interface
3. `MobileChatDemo.jsx` - A simple demo component that renders the chat interface
4. `mobile-chat-demo.html` - A standalone HTML demo that showcases the chat interface

## Integration with Account Management

The mobile chat interface is integrated with the existing Messages component in the account management page. The integration works as follows:

1. The `Messages.jsx` component now conditionally renders either:
   - The original desktop chat interface for non-mobile views
   - The new `MobileChatInterface` component for mobile views (screen width <= 767px)

2. Both interfaces use the same conversation data structure, ensuring consistency between desktop and mobile views.

3. The mobile interface is automatically displayed when a user accesses the Messages tab in the account management page on a mobile device.

## Usage

### React Component

To use the mobile chat interface in your React application:

```jsx
import MobileChatInterface from './path/to/MobileChatInterface';

function YourComponent() {
  return (
    <div>
      <MobileChatInterface />
    </div>
  );
}
```

### HTML Demo

The HTML demo (`mobile-chat-demo.html`) provides a standalone example of the chat interface that can be opened directly in a browser. It includes all the necessary HTML, CSS, and JavaScript to demonstrate the functionality.

## Design Details

### Layout

- The interface uses a responsive two-column layout
- On mobile devices, the conversation list initially takes up the full width
- When a conversation is selected, the list collapses to 30% width and the message view appears
- The header adapts to show either the conversation list header or the selected conversation details

### Styling

- Chat bubbles use different colors and alignments based on the sender
- Received messages are aligned left with a light background
- Sent messages are aligned right with a blue background
- Date separators provide clear visual breaks between messages from different days
- Action buttons for actionable messages are clearly separated and styled distinctly

### Interaction

- Tapping a conversation in the list selects it and shows the message view
- The back button returns to the full conversation list view
- Accept and Decline buttons are available for actionable messages
- After accepting a conversation, a message input appears for sending new messages

## Customization

The interface can be customized by modifying the CSS variables or directly editing the CSS classes. Key areas for customization include:

- Color scheme
- Font sizes and families
- Spacing and layout dimensions
- Animation timings

## Browser Compatibility

The interface is designed to work on modern browsers and has been tested on:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Mobile Responsiveness

The interface is fully responsive and optimized for mobile devices. It includes specific adjustments for smaller screens (under 480px width) to ensure usability on all device sizes.
