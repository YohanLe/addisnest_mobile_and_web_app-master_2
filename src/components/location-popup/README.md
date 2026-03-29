# Location Popup Component

A customizable location selector component with search functionality, filtering, and recent selections memory.

## Features

- **Search Functionality:** Real-time search for countries and states
- **Filtering Options:** Filter by location type (country, state, or both)
- **Recent Selections:** Automatically stores and displays recently selected locations
- **Keyboard Accessible:** Full keyboard navigation support for accessibility
- **Click Outside Detection:** Automatically closes when clicking outside the popup
- **Mobile Responsive:** Adapts to different screen sizes
- **Customizable:** Configurable appearance and behavior
- **Location Data:** Includes data for countries and US states
- **Sorted Results:** Search results are sorted by relevance

## Usage

### Basic Usage

```jsx
import React, { useState } from 'react';
import { LocationPopupMain } from './components/location-popup';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const [location, setLocation] = useState(null);
  
  const handleSelect = (selectedLocation) => {
    setLocation(selectedLocation);
    setIsOpen(false);
  };
  
  return (
    <div>
      <button onClick={() => setIsOpen(true)}>
        {location ? location.name : "Select Location"}
      </button>
      
      <LocationPopupMain
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSelect={handleSelect}
      />
    </div>
  );
}
```

### Advanced Usage with All Props

```jsx
import React, { useState } from 'react';
import { LocationPopupMain } from './components/location-popup';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const [location, setLocation] = useState(null);
  
  const handleSelect = (selectedLocation) => {
    setLocation(selectedLocation);
    setIsOpen(false);
  };
  
  // Custom locations example (optional)
  const customLocations = {
    countries: [
      { name: "Custom Country 1", code: "CC1" },
      { name: "Custom Country 2", code: "CC2" }
    ],
    states: [
      { name: "Custom State 1", code: "CS1" },
      { name: "Custom State 2", code: "CS2" }
    ]
  };
  
  return (
    <div>
      <button onClick={() => setIsOpen(true)}>
        {location ? location.name : "Select Location"}
      </button>
      
      <LocationPopupMain
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSelect={handleSelect}
        title="Choose Your Location"
        placeholder="Search for a location..."
        showRecent={true}
        maxRecentItems={5}
        defaultFilter="all"
        customLocations={customLocations}
      />
    </div>
  );
}
```

## Component Props

| Prop             | Type             | Default            | Description                                    |
|------------------|------------------|--------------------|------------------------------------------------|
| `isOpen`         | Boolean          | -                  | Controls visibility of the popup               |
| `onClose`        | Function         | -                  | Callback for when popup should close           |
| `onSelect`       | Function         | -                  | Callback for when a location is selected       |
| `title`          | String           | "Select Location"  | Title displayed at the top of the popup        |
| `placeholder`    | String           | "Search for location" | Placeholder text for search input           |
| `showRecent`     | Boolean          | true               | Whether to display recent selections           |
| `maxRecentItems` | Number           | 5                  | Maximum number of recent items to store        |
| `defaultFilter`  | String           | "all"              | Initial filter ("all", "country", or "state")  |
| `customLocations`| Object           | null               | Optional custom locations to use instead of defaults |

## Demo Component

The package includes a demo component that showcases the location popup's capabilities:

```jsx
import { LocationPopupDemo } from './components/location-popup';

function App() {
  return (
    <div>
      <h1>Location Selector Demo</h1>
      <LocationPopupDemo />
    </div>
  );
}
```

Visit `/location-popup-demo` route to see the demo in action.

## Implementation Details

The component is built with React and uses local storage to persist recent selections. It's designed to be lightweight, performant, and easy to integrate.

### Key Files

- `LocationPopupMain.jsx`: Main component implementation
- `locationData.js`: Data for countries and US states
- `LocationPopupDemo.jsx`: Demo component showcasing usage
- `location-popup.css`: Component-specific styles

### Integration

Make sure to import the required CSS file in your main entry point:

```jsx
import './assets/css/location-popup.css';
