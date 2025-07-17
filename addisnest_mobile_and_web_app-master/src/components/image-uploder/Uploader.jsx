import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";

// Utility function to generate random string
const generateRandomString = (length = 8) => {
  const characters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};

const ImageUploader = ({
  type_for = "IMG",
  files = [],
  setFiles,
  maxFiles = 10,
  maxFileSize = 5, // in MB
  acceptedFormats = {
    IMG: "image/png, image/jpeg, image/jpg",
    PDF: "application/pdf"
  },
  recommendedSize = "400x400px",
  onError = null,
}) => {
  const [errors, setErrors] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const IdForComponent = generateRandomString();

  useEffect(() => {
    // Clear errors after 5 seconds
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors([]);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  const validateFile = (file) => {
    // Check file size
    const fileSizeInMB = file.size / (1024 * 1024);
    if (fileSizeInMB > maxFileSize) {
      setErrors(prev => [...prev, `File size exceeds ${maxFileSize}MB limit.`]);
      return false;
    }
    
    // Check file type
    const fileType = type_for === "PDF" ? "application/pdf" : 
      ["image/png", "image/jpeg", "image/jpg"];
    
    const isValidType = Array.isArray(fileType) 
      ? fileType.includes(file.type) 
      : file.type === fileType;
    
    if (!isValidType) {
      setErrors(prev => [...prev, `Invalid file type. Accepted: ${type_for === "PDF" ? "PDF" : "PNG, JPEG, JPG"}`]);
      return false;
    }
    
    // Check max files
    if (files.length >= maxFiles) {
      setErrors(prev => [...prev, `Maximum of ${maxFiles} files allowed.`]);
      return false;
    }
    
    return true;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (validateFile(file)) {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        setFiles((prevFiles) => [
          ...prevFiles,
          { 
            file, 
            url: event.target.result,
            id: generateRandomString(),
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: file.lastModified,
          },
        ]);
      };
      
      reader.onerror = () => {
        setErrors(prev => [...prev, "Error reading file."]);
        if (onError) onError("Error reading file.");
      };
      
      reader.readAsDataURL(file);
    } else {
      // If onError callback provided, call it with the latest error
      if (onError && errors.length > 0) {
        onError(errors[errors.length - 1]);
      }
    }
    
    // Clear the input value to allow uploading the same file again
    e.target.value = null;
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (!file) return;
    
    if (validateFile(file)) {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        setFiles((prevFiles) => [
          ...prevFiles,
          { 
            file, 
            url: event.target.result,
            id: generateRandomString(),
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: file.lastModified,
          },
        ]);
      };
      
      reader.readAsDataURL(file);
    }
  };

  const removeFile = (fileId) => {
    const filteredFiles = files.filter((item) => 
      item.id ? item.id !== fileId : item.url !== fileId
    );
    setFiles(filteredFiles);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const formatFileSize = (sizeInBytes) => {
    const sizeInKB = sizeInBytes / 1024;
    return sizeInKB >= 1024 
      ? `${(sizeInKB / 1024).toFixed(2)} MB` 
      : `${sizeInKB.toFixed(2)} KB`;
  };

  return (
    <div className="fileuploder-main">
      {/* Error messages */}
      {errors.length > 0 && (
        <div className="fileuploder-errors">
          {errors.map((error, index) => (
            <div key={index} className="fileuploder-error">
              <span className="error-icon">!</span>
              {error}
            </div>
          ))}
        </div>
      )}
      
      {/* Uploader */}
      <div 
        className={`fileuploder-imgemain ${isDragging ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div 
          className="fileuploder-label" 
          onClick={triggerFileInput}
        >
          <div className="fileuploder-label-inner">
            <span className="upload-icon">
              <svg
                width="16"
                height="15"
                viewBox="0 0 16 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.99967 0.833008V14.1663M14.6663 7.49967H1.33301"
                  stroke="#ED2024"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <p className="uploder-descrp">
              Upload {type_for !== "PDF" ? "Image" : "PDF"}
            </p>
            <p className="uploder-note">
              Recommend size: {recommendedSize}
            </p>
            {isDragging && (
              <p className="drop-indicator">Drop your file here</p>
            )}
          </div>
          <input
            ref={fileInputRef}
            accept={acceptedFormats[type_for]}
            onChange={handleFileChange}
            id={IdForComponent}
            type="file"
            className="hidden"
            aria-label={`Upload ${type_for === "PDF" ? "PDF" : "Image"}`}
          />
        </div>
      </div>
      
      {/* Preview for Images */}
      {type_for === "IMG" && files.length > 0 && (
        <div className="fileuplodr-list">
          {files.map((item, idx) => (
            <div className="filuploadr-image" key={item.id || idx}>
              <button
                type="button"
                onClick={() => removeFile(item.id || item.url)}
                className="fileclose-icon"
                aria-label="Remove image"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-x-lg"
                  viewBox="0 0 16 16"
                >
                  <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                </svg>
              </button>
              <div 
                className="image-preview"
                style={{ backgroundImage: `url(${item.url})` }}
                aria-label={`Preview of ${item.name || `Image ${idx + 1}`}`}
              ></div>
            </div>
          ))}
        </div>
      )}
      
      {/* Preview for PDFs */}
      {type_for === "PDF" && files.length > 0 && (
        <div className="fileuplodr-sheet-main">
          {files.map((item, idx) => (
            <div className="fileuplodr-sheet" key={item.id || idx}>
              <div className="pdffile-descrp">
                <div className="pdficon-img">
                  <span>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4.5 12V3.75C4.5 3.55109 4.57902 3.36032 4.71967 3.21967C4.86032 3.07902 5.05109 3 5.25 3H14.25L19.5 8.25V12"
                        stroke="#404040"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M14.25 3V8.25H19.5"
                        stroke="#404040"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M4.5 18.75H6C6.39782 18.75 6.77936 18.592 7.06066 18.3107C7.34196 18.0294 7.5 17.6478 7.5 17.25C7.5 16.8522 7.34196 16.4706 7.06066 16.1893C6.77936 15.908 6.39782 15.75 6 15.75H4.5V20.25"
                        stroke="#404040"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M20.25 15.75H17.625V20.25"
                        stroke="#404040"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M19.875 18.375H17.625"
                        stroke="#404040"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 20.25C12.5967 20.25 13.169 20.0129 13.591 19.591C14.0129 19.169 14.25 18.5967 14.25 18C14.25 17.4033 14.0129 16.831 13.591 16.409C13.169 15.9871 12.5967 15.75 12 15.75H10.6875V20.25H12Z"
                        stroke="#404040"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </div>
                <div className="pdf-file-info">
                  <p className="pdf-filename">{item.file.name}</p>
                  <p className="pdf-filesize">{formatFileSize(item.file.size)}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeFile(item.id || item.url)}
                className="remove-pdficon"
                aria-label="Remove PDF"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13 3.66699L12.5869 10.3504C12.4813 12.0579 12.4285 12.9117 12.0005 13.5256C11.7889 13.8291 11.5165 14.0852 11.2005 14.2777C10.5614 14.667 9.706 14.667 7.99513 14.667C6.28208 14.667 5.42553 14.667 4.78603 14.2769C4.46987 14.0841 4.19733 13.8275 3.98579 13.5235C3.55792 12.9087 3.5063 12.0537 3.40307 10.3438L3 3.66699"
                    stroke="#171717"
                    strokeWidth="1.125"
                    strokeLinecap="round"
                  />
                  <path
                    d="M6 7.82324H10"
                    stroke="#171717"
                    strokeWidth="1.125"
                    strokeLinecap="round"
                  />
                  <path
                    d="M7 10.4355H9"
                    stroke="#171717"
                    strokeWidth="1.125"
                    strokeLinecap="round"
                  />
                  <path
                    d="M2 3.66634H14M10.7037 3.66634L10.2486 2.72749C9.94627 2.10385 9.79507 1.79202 9.53433 1.59755C9.47653 1.55441 9.41527 1.51603 9.3512 1.48281C9.06247 1.33301 8.71593 1.33301 8.02287 1.33301C7.3124 1.33301 6.9572 1.33301 6.66366 1.48909C6.59861 1.52368 6.53653 1.56361 6.47807 1.60845C6.2143 1.81081 6.06696 2.13404 5.77228 2.78051L5.36849 3.66634"
                    stroke="#171717"
                    strokeWidth="1.125"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

ImageUploader.propTypes = {
  type_for: PropTypes.oneOf(["IMG", "PDF"]),
  files: PropTypes.array,
  setFiles: PropTypes.func.isRequired,
  maxFiles: PropTypes.number,
  maxFileSize: PropTypes.number,
  acceptedFormats: PropTypes.object,
  recommendedSize: PropTypes.string,
  onError: PropTypes.func
};

export default ImageUploader;
