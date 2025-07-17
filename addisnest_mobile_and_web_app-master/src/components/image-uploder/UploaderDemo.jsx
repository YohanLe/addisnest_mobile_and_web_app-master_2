import React, { useState } from "react";
import { ImageUploaderCodemeg } from "./index";

/**
 * Demo component to showcase the ImageUploader functionality
 * This demonstrates both image and PDF uploading capabilities
 */
const UploaderDemo = () => {
  const [images, setImages] = useState([]);
  const [pdfFiles, setPdfFiles] = useState([]);
  const [activeTab, setActiveTab] = useState("image");

  const handleErrorCallback = (error) => {
    console.error("Uploader error:", error);
    // You could show a toast or notification here
  };

  return (
    <div className="uploader-demo-container">
      <h2 className="demo-title">File Uploader Demo</h2>
      
      <div className="uploader-tabs">
        <button 
          className={`tab-btn ${activeTab === "image" ? "active" : ""}`}
          onClick={() => setActiveTab("image")}
        >
          Image Uploader
        </button>
        <button 
          className={`tab-btn ${activeTab === "pdf" ? "active" : ""}`}
          onClick={() => setActiveTab("pdf")}
        >
          PDF Uploader
        </button>
      </div>
      
      <div className="uploader-content">
        {activeTab === "image" ? (
          <div className="uploader-section">
            <h3>Upload Images</h3>
            <p className="uploader-description">
              Drag and drop image files or click to browse. Supports PNG, JPEG, and JPG formats.
            </p>
            
            <ImageUploaderCodemeg
              type_for="IMG"
              files={images}
              setFiles={setImages}
              maxFiles={5}
              maxFileSize={2}
              recommendedSize="800x600px"
              onError={handleErrorCallback}
            />
            
            {images.length > 0 && (
              <div className="uploader-stats">
                <p>Total images: {images.length}</p>
                <button 
                  className="clear-btn"
                  onClick={() => setImages([])}
                >
                  Clear All
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="uploader-section">
            <h3>Upload PDF Documents</h3>
            <p className="uploader-description">
              Drag and drop PDF files or click to browse. Maximum file size: 5MB.
            </p>
            
            <ImageUploaderCodemeg
              type_for="PDF"
              files={pdfFiles}
              setFiles={setPdfFiles}
              maxFiles={3}
              maxFileSize={5}
              onError={handleErrorCallback}
            />
            
            {pdfFiles.length > 0 && (
              <div className="uploader-stats">
                <p>Total PDFs: {pdfFiles.length}</p>
                <button 
                  className="clear-btn"
                  onClick={() => setPdfFiles([])}
                >
                  Clear All
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="uploader-info">
        <h4>Component Features:</h4>
        <ul>
          <li>Drag and drop support</li>
          <li>File type validation</li>
          <li>File size validation</li>
          <li>Multiple file upload</li>
          <li>File preview</li>
          <li>Error handling</li>
          <li>Responsive design</li>
        </ul>
      </div>
    </div>
  );
};

export default UploaderDemo;
