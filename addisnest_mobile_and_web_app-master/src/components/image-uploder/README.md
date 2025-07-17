# Image Uploader Component

An enhanced image and PDF file uploader component with drag and drop functionality, preview capabilities, and validation features.

## Features

- **File Type Support:** Handles both image files (PNG, JPEG, JPG) and PDF documents
- **Drag and Drop:** Intuitive drag and drop interface for easy file uploading
- **File Validation:**
  - File type validation (images vs PDFs)
  - File size validation with customizable limits
  - Maximum number of files validation
- **Preview Capabilities:**
  - Image thumbnails with background image display
  - PDF file information display with icon
- **Error Handling:**
  - Visual error feedback with automatic dismissal
  - Optional error callback for integration with notification systems
- **Accessibility:**
  - Proper ARIA labels and semantic HTML
  - Keyboard navigation support
- **Responsive Design:** Adapts to different screen sizes
- **Customizable:**
  - Configurable file size limits
  - Customizable recommended image dimensions
  - Adjustable maximum file count

## Usage

### Basic Usage

```jsx
import { useState } from 'react';
import { ImageUploaderCodemeg } from './components/image-uploder';

function MyComponent() {
  const [images, setImages] = useState([]);
  
  return (
    <ImageUploaderCodemeg
      type_for="IMG"
      files={images}
      setFiles={setImages}
    />
  );
}
```

### Advanced Usage with All Props

```jsx
import { useState } from 'react';
import { ImageUploaderCodemeg } from './components/image-uploder';

function MyComponent() {
  const [images, setImages] = useState([]);
  
  const handleError = (errorMessage) => {
    console.error('Upload error:', errorMessage);
    // You could trigger a toast notification here
  };
  
  return (
    <ImageUploaderCodemeg
      type_for="IMG"  // "IMG" for images, "PDF" for PDF files
      files={images}
      setFiles={setImages}
      maxFiles={5}    // Maximum number of files allowed
      maxFileSize={2} // Maximum file size in MB
      acceptedFormats={{
        IMG: "image/png, image/jpeg, image/jpg",
        PDF: "application/pdf"
      }}
      recommendedSize="800x600px"
      onError={handleError}
    />
  );
}
```

## Component Props

| Prop             | Type             | Default            | Description                                    |
|------------------|------------------|--------------------|------------------------------------------------|
| `type_for`       | String           | "IMG"              | Type of files to upload: "IMG" or "PDF"        |
| `files`          | Array            | []                 | Array of file objects with url and file properties |
| `setFiles`       | Function         | -                  | Callback function to update files state        |
| `maxFiles`       | Number           | 10                 | Maximum number of files allowed                |
| `maxFileSize`    | Number           | 5                  | Maximum file size in MB                        |
| `acceptedFormats`| Object           | {IMG: "image/png, image/jpeg, image/jpg", PDF: "application/pdf"} | Accepted file types |
| `recommendedSize`| String           | "400x400px"        | Recommended image dimensions                   |
| `onError`        | Function         | null               | Callback for error handling                    |

## Demo Component

The package includes a demo component that showcases both image and PDF uploading capabilities:

```jsx
import { UploaderDemo } from './components/image-uploder';

function App() {
  return (
    <div>
      <h1>File Uploader Demo</h1>
      <UploaderDemo />
    </div>
  );
}
```

Visit `/image-uploader-demo` route to see the demo in action.

## Implementation Details

The component uses React's state management to handle file uploads, previews, and error states. It leverages the FileReader API to read files and generate data URLs for preview capabilities.

### Key Files

- `Uploader.jsx`: Main component implementation
- `UploaderDemo.jsx`: Demo component showcasing usage
- `image-uploader.css`: Component-specific styles
- `uploader-demo.css`: Demo-specific styles

### Integration

Make sure to import the required CSS files in your main entry point:

```jsx
import './assets/css/image-uploader.css';
import './assets/css/uploader-demo.css'; // Only if using the demo
