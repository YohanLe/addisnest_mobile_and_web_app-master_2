import React, { useEffect, useState } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import {
  SvgRightIcon
} from "../../../assets/svg-files/SvgFiles.jsx";
import { Link, useNavigate, useLocation } from "react-router-dom";
// ValidatePropertyForm is not exported from Validation.js
import Api from "../../../Apis/Api";
import "../property-list-form.css";
import "../mobile-property-list-form.css"; // Import mobile-specific styles
import "../../../components/property-form-styles.css";

const PropertyTypeList = [
    { value: 'House', label: 'House' },
    { value: 'Apartment', label: 'Apartment' },
    { value: 'Commercial', label: 'Commercial' },
    { value: 'Land', label: 'Land' },
    { value: 'Villa', label: 'Villa' }
]

const HomeFurnishing = [
    { value: "Furnished", label: "Furnished" },
    { value: "Unfurnished", label: "Unfurnished" },
    { value: "Semi-Furnished", label: "Semi-Furnished" },
]

const RegionalStateList = [
    { value: 'Addis Ababa City Administration', label: 'Addis Ababa City Administration' },
    { value: 'Afar Region', label: 'Afar Region' },
    { value: 'Amhara Region', label: 'Amhara Region' },
    { value: 'Benishangul-Gumuz Region', label: 'Benishangul-Gumuz Region' },
    { value: 'Dire Dawa City Administration', label: 'Dire Dawa City Administration' },
    { value: 'Gambela Region', label: 'Gambela Region' },
    { value: 'Harari Region', label: 'Harari Region' },
    { value: 'Oromia Region', label: 'Oromia Region' },
    { value: 'Sidama Region', label: 'Sidama Region' },
    { value: 'Somali Region', label: 'Somali Region' },
    { value: 'South Ethiopia Region', label: 'South Ethiopia Region' },
    { value: 'South West Ethiopia Peoples\' Region', label: 'South West Ethiopia Peoples\' Region' },
    { value: 'Tigray Region', label: 'Tigray Region' },
    { value: 'Central Ethiopia Region', label: 'Central Ethiopia Region' }
];

const SubCityList = [
    { value: 'Addis Ketema', label: 'Addis Ketema' },
    { value: 'Akaki Kality', label: 'Akaki Kality' },
    { value: 'Arada', label: 'Arada' },
    { value: 'Bole', label: 'Bole' },
    { value: 'Gulele', label: 'Gulele' },
    { value: 'Kirkos', label: 'Kirkos' },
    { value: 'Kolfe Keranio', label: 'Kolfe Keranio' },
    { value: 'Lideta', label: 'Lideta' },
    { value: 'Nifas Silk-Lafto', label: 'Nifas Silk-Lafto' },
    { value: 'Yeka', label: 'Yeka' },
    { value: 'Lemi Kura', label: 'Lemi Kura' }
];

// Property Amenities Data (organized in three categories for 3-column layout)
// IDs updated to use hyphens to match backend schema enum for features.amenities
const amenitiesData = {
    basicFeatures: [
        { id: 'parking-space', label: 'Parking Space' },
        { id: 'garage', label: 'Garage' },
        { id: 'garden-yard', label: 'Garden/Yard' },
        { id: 'balcony-terrace', label: 'Balcony/Terrace' },
        { id: 'elevator', label: 'Elevator' },
        { id: 'internet', label: 'Internet/WiFi' }, // Matched to schema: 'internet'
        { id: 'electricity', label: 'Electricity' }, // Not directly in schema amenities, but in features.utilities
        { id: 'water-supply', label: 'Water Supply' }, // Not directly in schema amenities
        { id: 'backup-generator', label: 'Backup Generator' }, // Not in schema
        { id: 'solar-panels', label: 'Solar Power' }, // Matched to schema: 'solar-panels'
        { id: 'laundry', label: 'Laundry Room/Service' }, // Matched to schema: 'laundry'
        { id: 'air-conditioning', label: 'Air Conditioning' },
        { id: 'heating', label: 'Heating System' }, // Matched to schema: 'heating'
        { id: 'ceiling-fans', label: 'Ceiling Fans' }, // Not in schema
        { id: 'equipped-kitchen', label: 'Fully Equipped Kitchen' }, // Not in schema
        { id: 'kitchen-appliances', label: 'Kitchen Appliances' }, // Not in schema
        { id: 'furnished', label: 'Furnished' }, // This is also a top-level property 'furnishingStatus'
        { id: 'storage', label: 'Storage Space' } // Matched to schema: 'storage'
    ],
    securityComfort: [
        { id: '24-7-security', label: '24/7 Security' },
        { id: 'cctv-surveillance', label: 'CCTV Surveillance' },
        { id: 'security-alarm', label: 'Security Alarm' },
        { id: 'gated-community', label: 'Gated Community' },
        { id: 'intercom-system', label: 'Intercom System' },
        { id: 'security-guard', label: 'Security Guard' }, // Not in schema
        { id: 'cleaning-service', label: 'Cleaning Service' }, // Not in schema
        { id: 'maid-room', label: 'Maid\'s Room' }, // Not in schema
        { id: 'guest-room', label: 'Guest Room' }, // Not in schema
        { id: 'home-office', label: 'Home Office/Study' }, // Not in schema
        { id: 'built-in-wardrobes', label: 'Built-in Wardrobes' }, // Not in schema
        { id: 'dining-area', label: 'Dining Area' }, // Not in schema
        { id: 'pantry-storage', label: 'Pantry/Storage' }, // Not in schema
        { id: 'rooftop-access', label: 'Rooftop Access' }, // Not in schema
        { id: 'courtyard', label: 'Courtyard' }, // Not in schema
        { id: 'covered-parking', label: 'Covered Parking' }, // Not in schema (parking-space is)
        { id: 'bbq-area', label: 'BBQ Area' }, // Not in schema
        { id: 'wheelchair-accessible', label: 'Wheelchair Accessible' }
    ],
    recreationLocation: [
        { id: 'gym-fitness-center', label: 'Gym/Fitness Center' },
        { id: 'swimming-pool', label: 'Swimming Pool' },
        { id: 'playground', label: 'Playground' },
        { id: 'sports-facilities', label: 'Sports Facilities' },
        { id: 'clubhouse', label: 'Clubhouse' },
        { id: 'near-transport', label: 'Near Public Transport' }, // Not in schema as amenity
        { id: 'near-shopping', label: 'Near Shopping Centers' }, // Not in schema as amenity
        { id: 'near-schools', label: 'Near Schools' }, // Not in schema as amenity
        { id: 'near-healthcare', label: 'Near Healthcare' }, // Not in schema as amenity
        { id: 'near-mosque', label: 'Near Mosque' }, // Not in schema as amenity
        { id: 'near-church', label: 'Near Church' } // Not in schema as amenity
    ]
};

const PropertyListForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [PropertyType, setPropertyType] = useState(null);
    const [FurnishingType, setFurnishingType] = useState(null);
    const [RegionalStateType, setRegionalStateType] = useState(RegionalStateList[0]);
    
    // Default to "For Sale" when coming from Sell button in header
    const [activeTab, setActiveTab] = useState("For Sale");
    const [images, setImages] = useState([]);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);
    const [slots, setSlots] = useState(isMobile ? 3 : 4); // 3 slots for mobile (1 main + 2 regular), 4 for desktop
    const [Loading, setLoading] = useState(false);
    const [uploadingStates, setUploadingStates] = useState({});
    const [uploadProgress, setUploadProgress] = useState({});
    const [uploadStatus, setUploadStatus] = useState({}); // 'uploading', 'success', 'error'
    const [uploadErrors, setUploadErrors] = useState({});
    const [error, setError] = useState({ isValid: false });
    const [validationErrors, setValidationErrors] = useState({});
    const [MediaPaths, setMediaPaths] = useState([]);
    const [networkStatus, setNetworkStatus] = useState('online');
    const [selectedAmenities, setSelectedAmenities] = useState({});
    const [testMode, setTestMode] = useState(false);
    const [collapsedSections, setCollapsedSections] = useState({
        basicFeatures: false,
        securityComfort: false,
        recreationLocation: false,
        propertyAmenities: true
    });

    const [inps, setInps] = useState({
        title: '',
        regional_state: 'Addis Ababa City Administration',
        subCity: '',
        country: 'Ethiopia',
        total_price: '',
        description: '',
        property_size: '',
        number_of_bathrooms: '',
        number_of_bedrooms: '',
    });
    
    // Network status monitoring
    useEffect(() => {
        const updateNetworkStatus = () => {
            setNetworkStatus(navigator.onLine ? 'online' : 'offline');
        };

        updateNetworkStatus();
        window.addEventListener('online', updateNetworkStatus);
        window.addEventListener('offline', updateNetworkStatus);

        return () => {
            window.removeEventListener('online', updateNetworkStatus);
            window.removeEventListener('offline', updateNetworkStatus);
        };
    }, []);
    
    // Mobile detection for responsive UI adjustments
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth <= 767;
            setIsMobile(mobile);
            
            // Update slots count when switching between mobile and desktop
            // Only reduce slots if we're switching to mobile and have more than 3 slots
            if (mobile && slots > 3) {
                setSlots(3); // 1 main + 2 additional for mobile
            } else if (!mobile && slots < 4) {
                setSlots(4); // 1 main + 3 additional for desktop
            }
        };
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [slots]);

    useEffect(() => {
        if (networkStatus === 'offline') {
            toast.warning('You are offline. Image uploads will fail until your connection is restored.', {
                autoClose: false,
                closeButton: true
            });
        }
    }, [networkStatus]);

    const onInpChanged = (event) => {
        setError(p => {
            const obj = { ...p }
            obj?.errors && delete obj?.errors[event?.target?.name]
            return obj
        })
        
        // Clear validation error when user starts typing
        if (validationErrors[event.target.name]) {
            setValidationErrors(prev => {
                const updated = { ...prev };
                delete updated[event.target.name];
                return updated;
            });
        }
        
        setInps((prevInputs) => ({ ...prevInputs, [event.target.name]: event.target.value }));
    };

    const handleFileChange = (e, index) => {
        const file = e.target.files[0];
        
        // Basic validation
        if (!file) return;
        
        if (file.size > 5 * 1024 * 1024) {
            toast.error('File too large (max 5MB)');
            return;
        }
        
        if (!['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(file.type)) {
            toast.error('Only JPG, PNG, or WEBP allowed');
            return;
        }

        // Clear validation error
        if (validationErrors.images) {
            setValidationErrors(prev => {
                const updated = { ...prev };
                delete updated.images;
                return updated;
            });
        }

        // Create preview
        const preview = URL.createObjectURL(file);
        const newImages = [...images];
        newImages[index] = preview;
        setImages(newImages);
        
        // Show upload state
        setUploadingStates(prev => ({ ...prev, [index]: true }));
        
        // Upload the image
        ImagesUpload(file, index);
    };

    const ImagesUpload = async (file, index) => {
        try {
            // Initialize upload states
            setUploadingStates(prev => ({ ...prev, [index]: true }));
            setUploadProgress(prev => ({ ...prev, [index]: 0 }));
            setUploadStatus(prev => ({ ...prev, [index]: 'uploading' }));
            setUploadErrors(prev => ({ ...prev, [index]: null }));
            
            const formData = new FormData();
            formData.append('mediaFiles', file, file.name);
            
            console.log('=== UPLOAD DEBUG ===');
            console.log('Starting image upload process...');
            console.log('File details:', {
                name: file.name,
                size: file.size,
                type: file.type,
                lastModified: file.lastModified
            });
            console.log('FormData entries:');
            for (let [key, value] of formData.entries()) {
                console.log(key, value);
            }
            console.log('=== END UPLOAD DEBUG ===');
            
            console.log('Uploading image file:', file.name, 'size:', file.size);
            
            // Use fetch API instead of XMLHttpRequest for better compatibility
            const uploadUrl = `/api/media/upload`; // Use relative URL to leverage Vite proxy
            console.log('Upload URL:', uploadUrl);
            
            // Don't set Content-Type header - let the browser set it with boundary
            const headers = {};
            
            console.log('Upload headers:', headers);
            
            const response = await fetch(uploadUrl, {
                method: 'POST',
                body: formData // Don't set headers, let browser handle multipart boundary
            });
            
            console.log('Upload response status:', response.status);
            console.log('Upload response headers:', response.headers);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Upload failed with response:', errorText);
                throw new Error(`Upload failed with status: ${response.status} - ${errorText}`);
            }
            
            const responseData = await response.json();
            console.log('Upload response data:', responseData);
            
            if (responseData && responseData.files && responseData.files.length > 0) {
                const newImage = responseData.files[0];
                console.log('Uploaded image details:', newImage);
                
                // Make sure we have all required fields
                if (!newImage.url) {
                    throw new Error("Invalid image response - missing URL");
                }
                
                // Create a properly formatted image object
                const formattedImage = {
                    url: newImage.url,
                    caption: newImage.originalName || file.name || 'Uploaded image',
                    _id: newImage.filename || newImage._id || `img-${Date.now()}-${index}`
                };
                
                console.log('Formatted image object:', formattedImage);
                
                // Update MediaPaths state with the new image
                setMediaPaths(prevPaths => {
                    const newPaths = [...prevPaths, formattedImage];
                    console.log('Updated MediaPaths:', newPaths);
                    return newPaths;
                });
                
                // Set success status
                setUploadStatus(prev => ({ ...prev, [index]: 'success' }));
                setUploadProgress(prev => ({ ...prev, [index]: 100 }));
                
                toast.success('Image uploaded successfully!');
            } else {
                console.error('Invalid response structure from media upload:', response);
                throw new Error("Invalid response from server");
            }
        } catch (err) {
            console.error('Upload failed:', err);
            console.error('Error details:', err.response?.data || err.message);
            
            // Set error status
            setUploadStatus(prev => ({ ...prev, [index]: 'error' }));
            
            // Handle different types of errors
            let errorMessage = 'Upload failed';
            if (err.message === 'Authentication required') {
                errorMessage = 'Authentication required. Please login again.';
            } else if (err.message.includes('Network error')) {
                errorMessage = 'Network error. Please check your connection.';
            } else if (err.message.includes('timeout')) {
                errorMessage = 'Upload timeout. Please try again.';
            } else if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err.message) {
                errorMessage = err.message;
            }
            
            setUploadErrors(prev => ({ ...prev, [index]: errorMessage }));
            
            // Clear the image preview on error
            setImages(prev => {
                const newImages = [...prev];
                newImages[index] = null;
                return newImages;
            });
            
            // Show user-friendly error message
            toast.error(errorMessage, {
                position: "top-center",
                autoClose: 5000
            });
        } finally {
            setUploadingStates(prev => ({ ...prev, [index]: false }));
        }
    };

    // Function to retry failed upload
    const retryUpload = (index) => {
        const fileInput = document.getElementById(`file-input-${index}`);
        if (fileInput && fileInput.files && fileInput.files[0]) {
            ImagesUpload(fileInput.files[0], index);
        }
    };

    // Check if any uploads are in progress
    const hasUploadsInProgress = () => {
        return Object.values(uploadingStates).some(isUploading => isUploading);
    };

    useEffect(() => {
        console.log("MediaPaths state changed:", MediaPaths);
    }, [MediaPaths]);

    const addSlot = () => {
        setSlots(slots + 1);
    };

    const removeImage = (index) => {
        const newImages = [...images];
        newImages[index] = null;
        setImages(newImages);
        
        if (MediaPaths.length > index) {
            const newMediaPaths = [...MediaPaths];
            newMediaPaths.splice(index, 1);
            setMediaPaths(newMediaPaths);
        }
        
        toast.info("Image removed successfully");
    };
    
    const handleChange = (e, type) => {
        if (type === 'Property') {
            setPropertyType(e);
            // Clear validation error when user selects a property type
            if (validationErrors.property_type) {
                setValidationErrors(prev => {
                    const updated = { ...prev };
                    delete updated.property_type;
                    return updated;
                });
            }
        } else if (type === 'Furnishing') {
            setFurnishingType(e)
        } else if (type === 'RegionalState') {
            setRegionalStateType(e);
            setInps((prevInputs) => ({ ...prevInputs, regional_state: e?.value || '', subCity: '' })); // Reset subCity on region change
        } else if (type === 'SubCity') {
            setInps((prevInputs) => ({ ...prevInputs, subCity: e?.value || '' }));
        }
    };

    // Amenities handling
    const handleAmenityToggle = (amenityId) => {
        setSelectedAmenities(prev => ({
            ...prev,
            [amenityId]: !prev[amenityId]
        }));
    };

    const getSelectedAmenitiesArray = () => {
        return Object.keys(selectedAmenities).filter(key => selectedAmenities[key]);
    };

    const toggleSection = (sectionName) => {
        setCollapsedSections(prev => ({
            ...prev,
            [sectionName]: !prev[sectionName]
        }));
    };

    const validateForm = () => {
        // Skip validation if test mode is enabled
        if (testMode) {
            return { errors: {}, errorMessages: [] };
        }
        
        const errors = {};
        const errorMessages = [];
        
        // Validate Title
        if (!inps?.title || inps.title.trim() === '') {
            errors.title = true;
            errorMessages.push('Title is required - Please enter a title for your property');
        }

        // Validate Property Type
        if (!PropertyType) {
            errors.property_type = true;
            errorMessages.push('Property Type is required - Please select the type of property you are offering');
        }

        // Validate Regional State
        if (!RegionalStateType || !inps?.regional_state) {
            errors.regional_state = true; // Use a consistent key for highlighting if needed
            errorMessages.push('Regional State is required - Please select the regional state for the property');
        }
        
        // Validate Total Price
        if (!inps?.total_price || inps.total_price.trim() === '') {
            const priceLabel = activeTab === "For Rent" ? "Monthly Rent" : "Sale Price";
            errors.total_price = true;
            errorMessages.push(`${priceLabel} is required - Please enter the ${priceLabel.toLowerCase()} for your property`);
        }
        
        // Validate Description
        if (!inps?.description || inps.description.trim() === '') {
            errors.description = true;
            errorMessages.push('Description is required - Please provide a description for your property');
        }

        // Validate Bedrooms
        if (!inps?.number_of_bedrooms || inps.number_of_bedrooms.trim() === '') {
            errors.number_of_bedrooms = true;
            errorMessages.push('Number of bedrooms is required');
        }

        // Validate Bathrooms
        if (!inps?.number_of_bathrooms || inps.number_of_bathrooms.trim() === '') {
            errors.number_of_bathrooms = true;
            errorMessages.push('Number of bathrooms is required');
        }

        // Validate Property Size/Area
        if (!inps?.property_size || inps.property_size.trim() === '') {
            errors.property_size = true;
            errorMessages.push('Property size is required');
        }

        // Require at least one image
        // if (!MediaPaths || MediaPaths.length === 0) {
        //     errors.images = true;
        //     errorMessages.push('At least one property image is required - Please upload at least one image.');
        // }

        return { errors, errorMessages };
    };

    const NextPage = async () => {
        // Check if any uploads are in progress
        if (hasUploadsInProgress()) {
            toast.warning('Please wait for all image uploads to complete before continuing.', {
                position: "top-center",
                autoClose: 4000
            });
            return;
        }

        // Debug: log all required fields and MediaPaths before validation
        console.log("NextPage called. Current form state:");
        console.log("title:", inps?.title);
        console.log("regional_state:", inps?.regional_state);
        console.log("subCity:", inps?.subCity);
        console.log("country:", inps?.country);
        console.log("number_of_bathrooms:", inps.number_of_bathrooms);
        console.log("number_of_bedrooms:", inps.number_of_bedrooms);
        console.log("property_size:", inps?.property_size);
        console.log("total_price:", inps?.total_price);
        console.log("description:", inps?.description);
        console.log("property_for:", activeTab);
        console.log("property_type:", PropertyType?.value || PropertyType);
        console.log("furnishing:", FurnishingType?.value || FurnishingType);
        console.log("media_paths (MediaPaths):", MediaPaths);
        console.log("mediaPathsDetailed:", JSON.stringify(MediaPaths, null, 2));
        console.log("amenities:", getSelectedAmenitiesArray());

        const { errors, errorMessages } = validateForm();
        
        // Set validation errors to highlight fields in red
        setValidationErrors(errors);
        
        if (errorMessages.length > 0) {
            // Display a prominent error alert at the top of the form
            const errorAlert = document.createElement('div');
            errorAlert.className = 'property-form-error-alert';
            errorAlert.innerHTML = `
                <div class="error-icon">⚠️</div>
                <div class="error-content">
                    <h3>Property data is missing. Please ensure the property form was completed.</h3>
                    <p>Please fill in the required fields marked with * to continue.</p>
                </div>
            `;
            
            // Add styles for the error alert
            const styleElement = document.createElement('style');
            styleElement.textContent = `
                .property-form-error-alert {
                    display: flex;
                    align-items: center;
                    background-color: #ffebee;
                    color: #d32f2f;
                    padding: 15px 20px;
                    border-radius: 8px;
                    margin: 0 auto 20px;
                    max-width: 100%;
                    border: 1px solid #ef9a9a;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                    animation: fadeIn 0.3s ease-in-out;
                    font-weight: bold;
                }
                .error-icon {
                    font-size: 28px;
                    margin-right: 15px;
                }
                .error-content h3 {
                    margin: 0 0 5px 0;
                    font-size: 18px;
                }
                .error-content p {
                    margin: 0;
                    font-size: 14px;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `;
            document.head.appendChild(styleElement);
            
            // Find the form element and insert the error alert at the top
            const formElement = document.querySelector('.property-form-main');
            if (formElement && !document.querySelector('.property-form-error-alert')) {
                formElement.insertBefore(errorAlert, formElement.firstChild);
                
                // Scroll to the error alert
                errorAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            
            // Also show detailed toast message
            const errorMessage = `Please complete the following required fields:\n\n${errorMessages.map((error, index) => `${index + 1}. ${error}`).join('\n')}`;
            
            toast.error(errorMessage, {
                autoClose: 8000,
                hideProgressBar: false,
                style: {
                    whiteSpace: 'pre-line',
                    textAlign: 'left'
                }
            });
            
            // Scroll to first error field if no alert was added
            if (!document.querySelector('.property-form-error-alert')) {
                setTimeout(() => {
                    const firstErrorElement = document.querySelector('.form-group.has-error, .form-step-section.has-error');
                    if (firstErrorElement) {
                        firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }, 100);
            }
            
            return;
        }
    
    // Get current user information from localStorage
    const token = localStorage.getItem('access_token');
    const userDataString = localStorage.getItem('user');
    let userData = null;
    let ownerName = '';
    
    try {
        if (userDataString) {
            userData = JSON.parse(userDataString);
            ownerName = userData.firstName && userData.lastName 
                ? `${userData.firstName} ${userData.lastName}`
                : userData.firstName || userData.email || 'Unknown';
            console.log('Current user data:', userData);
        }
    } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
    }
    
    let data = {
        title: inps?.title || (testMode ? 'Test Property' : ''),
        description: inps?.description || (testMode ? 'This is a test property listing created using test mode.' : ''),
        price: inps?.total_price || (testMode ? '5000000' : ''),
        offeringType: activeTab, // "For Sale" or "For Rent"
        propertyType: PropertyType?.value || (testMode ? 'House' : ''),
        furnishingStatus: FurnishingType?.value || (testMode ? 'Furnished' : ''),
        
        // Add owner name to property data
        ownerName: ownerName,
        
        // Use nested address structure
        address: {
            subCity: inps?.subCity || (testMode ? 'Addis Ababa' : ''),
            regionalState: RegionalStateType?.value || (testMode ? 'Addis Ababa City Administration' : ''),
            country: inps?.country || 'Ethiopia',
            city: inps?.subCity || (testMode ? 'Addis Ababa' : '')
        },
        
        
        bedrooms: inps.number_of_bedrooms || (testMode ? '3' : ''),
        bathrooms: inps.number_of_bathrooms || (testMode ? '2' : ''),
        area: inps?.property_size || (testMode ? '150' : ''),
        // Pass MediaPaths directly as the media_paths field for ChoosePropmotion to process
        media_paths: MediaPaths,
        // Also include images field with same data for redundancy
        images: MediaPaths.length > 0 ? MediaPaths : (testMode ? [{
            url: '/uploads/test-property-image-1749260861596-438465535.jpg',
            caption: 'Test Property Image',
            _id: 'test-image-id'
        }] : []),
        amenities: getSelectedAmenitiesArray()
    };
    
    // Log the final data structure being passed to ChoosePropmotion
    console.log("FINAL DATA STRUCTURE BEING PASSED:", JSON.stringify(data, null, 2));

        try {
            // Remove any existing error alert before proceeding
            const existingAlert = document.querySelector('.property-form-error-alert');
            if (existingAlert) {
                existingAlert.remove();
            }
            
            // Show loading toast to indicate navigation is in progress
            toast.info("Proceeding to promotion selection...", {
                autoClose: 2000,
                position: "top-center"
            });
            
            // Scroll to the top of the page before navigation
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            // Add a small delay to allow the toast to be visible and scrolling to complete
            setTimeout(() => {
                navigate('/payment-method/choose-promotion', { 
                    state: { AllData: data },
                    replace: true // Use replace to prevent going back to form accidentally
                });
            }, 500);
        } catch (error) {
            console.error("Navigation error:", error);
            toast.error("Failed to proceed to promotion page. Please try again.");
        }
    };

    return (
        <section className="common-section property-form-section">
            <div className="container">
                <div className="property-heading-form">
                    <h3>Property Listing Form</h3>
                </div>
                <div className="property-form-main">
                    
                    <div className="form-step-section">
                        <div className="step-header">
                            <div className="step-indicator">
                                <span className="step-number">1</span>
                            </div>
                            <h4>What are you offering?</h4>
                        </div>
                        
                        <div className="offering-options">
                            <div 
                                className={`offering-card ${activeTab === "For Sale" ? "selected" : ""}`}
                                onClick={() => setActiveTab("For Sale")}
                            >
                                <div className="card-icon">
                                    <div className="icon-circle green">🏠</div>
                                </div>
                                <h5>For Sale</h5>
                                <p>Sell your property</p>
                            </div>
                            
                            <div 
                                className={`offering-card ${activeTab === "For Rent" ? "selected" : ""}`}
                                onClick={() => setActiveTab("For Rent")}
                            >
                                <div className="card-icon">
                                    <div className="icon-circle blue">🔑</div>
                                </div>
                                <h5>For Rent</h5>
                                <p>Rent out your property</p>
                            </div>
                        </div>
                    </div>

                    <div className={`form-step-section ${validationErrors.property_type || validationErrors.total_price ? 'has-error' : ''}`}>
                        <div className="step-header">
                            <div className="step-indicator">
                                <span className="step-number">2</span>
                            </div>
                            <h4>Complete Property Information</h4>
                        </div>
                        
                        <div className="step-content">
                            <div className="form-row-3-cols">
                                <div className="form-col-33">
                                    <div className={`form-group required ${validationErrors.property_type ? 'has-error' : ''}`}>
                                        <label>Property Type *</label>
                                        <div className="select-wrapper">
                                            <Select
                                                options={PropertyTypeList}
                                                placeholder="Select type"
                                                value={PropertyType}
                                                onChange={(e) => handleChange(e, "Property")}
                                                className="react-select"
                                            />
                                        </div>
                                        {validationErrors.property_type && (
                                            <span className="error-msg">Property type is required</span>
                                        )}
                                    </div>
                                </div>
                                <div className="form-col-33">
                                    <div className={`form-group required ${validationErrors.title ? 'has-error' : ''}`}>
                                        <label>Title *</label>
                                        <input
                                            type="text"
                                            placeholder="Enter property title"
                                            name="title"
                                            onChange={onInpChanged}
                                            value={inps?.title}
                                        />
                                        {validationErrors.title && (
                                            <span className="error-msg">Title is required</span>
                                        )}
                                    </div>
                                </div>
                                <div className="form-col-33">
                                    <div className={`form-group required ${validationErrors.total_price ? 'has-error' : ''}`}>
                                        <label>{activeTab === "For Rent" ? "Monthly Rent *" : "Sale Price (ETB) *"}</label>
                                        <div className="price-input" style={{ position: 'relative' }}>
                                                <input
                                                    type="text"
                                                    inputMode="numeric"
                                                    pattern="[0-9]*"
                                                    placeholder="0"
                                                    name="total_price"
                                                    onChange={(e) => {
                                                        // Only allow numeric values
                                                        const numericValue = e.target.value.replace(/[^0-9]/g, '');
                                                        // Create a synthetic event with the cleaned value
                                                        const syntheticEvent = {
                                                            target: {
                                                                name: e.target.name,
                                                                value: numericValue
                                                            }
                                                        };
                                                        onInpChanged(syntheticEvent);
                                                    }}
                                                    value={inps?.total_price}
                                                    style={{ paddingLeft: '10px' }}
                                                />
                                                {/* Remove any ETB text that might be added by CSS or JS */}
                                                <style>
                                                    {`
                                                    .price-input::before,
                                                    .price-input::after,
                                                    .price-input *::before,
                                                    .price-input *::after {
                                                        content: none !important;
                                                    }
                                                    `}
                                                </style>
                                        </div>
                                        {validationErrors.total_price && (
                                            <span className="error-msg">
                                                {activeTab === "For Rent" ? "Monthly rent" : "Sale price"} is required
                                            </span>
                                        )}
                                        {error.errors?.total_price && <p className="error-msg">{error.errors?.total_price}</p>}
                                    </div>
                                </div>
                            </div>

                            <div className="form-row-3-cols">
                                <div className="form-col-33">
                                    <div className={`form-group required ${validationErrors.number_of_bedrooms ? 'has-error' : ''}`}>
                                        <label>Number of Bedrooms *</label>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            placeholder="0"
                                            name="number_of_bedrooms"
                                            onChange={onInpChanged}
                                            value={inps?.number_of_bedrooms}
                                        />
                                        {validationErrors.number_of_bedrooms && (
                                            <span className="error-msg">Number of bedrooms is required</span>
                                        )}
                                    </div>
                                </div>
                                <div className="form-col-33">
                                    <div className={`form-group required ${validationErrors.number_of_bathrooms ? 'has-error' : ''}`}>
                                        <label>Number of Bathrooms *</label>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            placeholder="0"
                                            name="number_of_bathrooms"
                                            onChange={onInpChanged}
                                            value={inps?.number_of_bathrooms}
                                        />
                                        {validationErrors.number_of_bathrooms && (
                                            <span className="error-msg">Number of bathrooms is required</span>
                                        )}
                                    </div>
                                </div>
                                <div className="form-col-33">
                                    <div className="form-group">
                                        <label>Furnishing</label>
                                        <div className="select-wrapper">
                                            <Select
                                                options={HomeFurnishing}
                                                placeholder="Select furnishing"
                                                value={FurnishingType}
                                                onChange={(e) => handleChange(e, "Furnishing")}
                                                className="react-select"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="form-row-3-cols">
                                <div className="form-col-33">
                                    <div className={`form-group required ${validationErrors.property_size ? 'has-error' : ''}`}>
                                        <label>Property Size (sq ft) *</label>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            placeholder="0"
                                            name="property_size"
                                            onChange={onInpChanged}
                                            value={inps?.property_size}
                                        />
                                        {validationErrors.property_size && (
                                            <span className="error-msg">Property size is required</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-col-100">
                                    <div className={`form-group required ${validationErrors.description ? 'has-error' : ''}`}>
                                        <label>Property Description *</label>
                                        <textarea
                                            name="description"
                                            placeholder="Describe your property in detail..."
                                            rows="3"
                                            onChange={onInpChanged}
                                            value={inps?.description}
                                        />
                                        {validationErrors.description && (
                                            <span className="error-msg">Description is required</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={`form-step-section`}>
                        <div className="step-header">
                            <div className="step-indicator">
                                <span className="step-number">3</span>
                            </div>
                            <h4>Property Location</h4>
                        </div>
                        
                        <div className="step-content">
                            <div className="form-row-3-cols">
                                <div className="form-col-33">
                                    <div className="form-group">
                                        <label>Regional State</label>
                                        <div className="select-wrapper">
                                            <Select
                                                options={RegionalStateList}
                                                placeholder="Select regional state"
                                                value={RegionalStateType}
                                                onChange={(e) => handleChange(e, "RegionalState")}
                                                className="react-select"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="form-col-33">
                                    <div className="form-group">
                                        {RegionalStateType?.value === 'Addis Ababa City Administration' ? (
                                            <>
                                                <label>Sub-City</label>
                                                <div className="select-wrapper">
                                                    <Select
                                                        options={SubCityList}
                                                        placeholder="Select sub-city"
                                                        value={SubCityList.find(c => c.value === inps.subCity)}
                                                        onChange={(e) => handleChange(e, "SubCity")}
                                                        className="react-select"
                                                    />
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <label>City/Sub-City</label>
                                                <input
                                                    type="text"
                                                    placeholder="Enter city or sub-city"
                                                    name="subCity"
                                                    onChange={onInpChanged}
                                                    value={inps?.subCity}
                                                />
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="form-col-33">
                                    <div className="form-group">
                                        <label>Country</label>
                                        <input
                                            type="text"
                                            placeholder="Country"
                                            name="country"
                                            value={inps?.country || "Ethiopia"}
                                            disabled
                                            style={{
                                                backgroundColor: '#f9f9f9',
                                                cursor: 'not-allowed'
                                            }}
                                        />
                                        <small style={{ 
                                            display: 'block', 
                                            marginTop: '5px', 
                                            color: '#666',
                                            fontSize: '12px' 
                                        }}>
                                            Default: Ethiopia
                                        </small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="form-step-section image-upload-section">
                        <div className="step-header">
                            <div className="step-indicator">
                                <span className="step-number">4</span>
                            </div>
                            <h4>Property Images</h4>
                            <p className="step-description">Add photos of your property. The first image will be your main property photo.</p>
                        </div>
                        
                        <div className="step-content">
                            <div className="upload-tips-box" style={{ 
                                padding: '12px', 
                                backgroundColor: '#f1f9f1', 
                                border: '1px solid #28a745', 
                                borderRadius: '6px', 
                                marginBottom: '20px' 
                            }}>
                                <div style={{ 
                                    fontSize: '14px', 
                                    fontWeight: 'bold', 
                                    color: '#28a745',
                                    marginBottom: '6px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                }}>
                                    <span>💡</span> Upload Tips:
                                </div>
                                <p style={{ fontSize: '13px', margin: '0', color: '#333' }}>
                                    Adding photos helps your property get more attention. For best results, upload clear photos showing key features of your property.
                                </p>
                            </div>
                            <div className="image-upload-grid-horizontal">
                                {[...Array(slots)].map((_, index) => (
                                    <div key={index} className={`image-upload-slot ${index === 0 ? 'main-photo-slot' : ''}`}>
                                        {!images[index] && (
                                            <div className="upload-placeholder">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handleFileChange(e, index)}
                                                    style={{ display: 'none' }}
                                                    id={`file-input-${index}`}
                                                />
                                                <div 
                                                    className="upload-drop-zone"
                                                    onClick={() => document.getElementById(`file-input-${index}`).click()}
                                                >
                                                    <div className="upload-icon">
                                                        {index === 0 ? '🏠' : '📷'}
                                                    </div>
                                                    <p>{index === 0 ? 'Main Photo' : 'Choose Image'}</p>
                                                    <span>Click to upload</span>
                                                    {index === 0 && <small>This will be your featured image</small>}
                                                </div>
                                            </div>
                                        )}

                                        {images[index] && (
                                            <div className="image-preview">
                                                {index === 0 && (
                                                    <div className="main-photo-badge">
                                                        <span>📍 Main Photo</span>
                                                    </div>
                                                )}
                                                <img src={images[index]} alt={`Preview ${index + 1}`} />
                                                
                                                {/* Enhanced Upload Progress Overlay */}
                                                {uploadingStates[index] && (
                                                    <div className="upload-overlay" style={{
                                                        position: 'absolute',
                                                        top: 0,
                                                        left: 0,
                                                        right: 0,
                                                        bottom: 0,
                                                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        color: 'white',
                                                        borderRadius: '8px'
                                                    }}>
                                                        <div className="upload-spinner" style={{
                                                            fontSize: '24px',
                                                            marginBottom: '10px',
                                                            animation: 'spin 1s linear infinite'
                                                        }}>⏳</div>
                                                        <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>
                                                            Uploading...
                                                        </div>
                                                        <div className="progress-bar" style={{
                                                            width: '80%',
                                                            height: '6px',
                                                            backgroundColor: 'rgba(255, 255, 255, 0.3)',
                                                            borderRadius: '3px',
                                                            overflow: 'hidden',
                                                            marginBottom: '5px'
                                                        }}>
                                                            <div style={{
                                                                width: `${uploadProgress[index] || 0}%`,
                                                                height: '100%',
                                                                backgroundColor: '#4CAF50',
                                                                transition: 'width 0.3s ease',
                                                                borderRadius: '3px'
                                                            }}></div>
                                                        </div>
                                                        <div style={{ fontSize: '12px' }}>
                                                            {uploadProgress[index] || 0}% uploaded
                                                        </div>
                                                        <style dangerouslySetInnerHTML={{__html: `
                                                            @keyframes spin {
                                                                0% { transform: rotate(0deg); }
                                                                100% { transform: rotate(360deg); }
                                                            }
                                                        `}} />
                                                    </div>
                                                )}

                                                {/* Success Status Indicator */}
                                                {uploadStatus[index] === 'success' && (
                                                    <div className="upload-success-badge" style={{
                                                        position: 'absolute',
                                                        top: '8px',
                                                        right: '8px',
                                                        backgroundColor: '#4CAF50',
                                                        color: 'white',
                                                        borderRadius: '50%',
                                                        width: '24px',
                                                        height: '24px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: '14px',
                                                        fontWeight: 'bold',
                                                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                                    }}>
                                                        ✓
                                                    </div>
                                                )}

                                                {/* Error Status Indicator */}
                                                {uploadStatus[index] === 'error' && (
                                                    <div className="upload-error-overlay" style={{
                                                        position: 'absolute',
                                                        top: 0,
                                                        left: 0,
                                                        right: 0,
                                                        bottom: 0,
                                                        backgroundColor: 'rgba(244, 67, 54, 0.9)',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        color: 'white',
                                                        borderRadius: '8px',
                                                        padding: '10px'
                                                    }}>
                                                        <div style={{ fontSize: '24px', marginBottom: '8px' }}>❌</div>
                                                        <div style={{ fontSize: '12px', textAlign: 'center', marginBottom: '8px' }}>
                                                            Upload Failed
                                                        </div>
                                                        <div style={{ fontSize: '10px', textAlign: 'center', marginBottom: '10px', opacity: 0.8 }}>
                                                            {uploadErrors[index] || 'Unknown error'}
                                                        </div>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                retryUpload(index);
                                                            }}
                                                            style={{
                                                                backgroundColor: 'white',
                                                                color: '#f44336',
                                                                border: 'none',
                                                                padding: '4px 8px',
                                                                borderRadius: '4px',
                                                                fontSize: '10px',
                                                                cursor: 'pointer',
                                                                fontWeight: 'bold'
                                                            }}
                                                        >
                                                            🔄 Retry
                                                        </button>
                                                    </div>
                                                )}

                                                <div className="image-actions">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImage(index)}
                                                        className="remove-btn"
                                                        title="Remove Image"
                                                    >
                                                        ✕
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => document.getElementById(`file-input-${index}`).click()}
                                                        className="replace-btn"
                                                        title="Replace Image"
                                                    >
                                                        🔄
                                                    </button>
                                                </div>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handleFileChange(e, index)}
                                                    style={{ display: 'none' }}
                                                    id={`file-input-${index}`}
                                                />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                            
                            <div className="add-more-section">
                                <a 
                                    href="#" 
                                    onClick={(e) => {
                                        e.preventDefault();
                                        addSlot();
                                    }}
                                    className="add-more-btn"
                                    style={{
                                        display: 'inline-block',
                                        textDecoration: 'none',
                                        color: '#9b59b6',
                                        fontWeight: 'bold',
                                        padding: '12px 25px',
                                        border: '2px dashed #9b59b6',
                                        borderRadius: '30px',
                                        background: 'rgba(155, 89, 182, 0.05)',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    ➕ Add More Photos
                                </a>
                                <p>Upload additional photos to showcase your property better (recommended)</p>
                            </div>
                        </div>
                    </div>

                    {/* Step 5: Property Amenities */}
                    <div className="form-step-section">
                        <div 
                            className="step-header collapsible-header" 
                            onClick={() => toggleSection('propertyAmenities')}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="step-indicator">
                                <span className="step-number">5</span>
                            </div>
                            <div className="header-content">
                                <h4>Property Amenities</h4>
                                <p className="step-description">Select all that apply</p>
                            </div>
                            <div className="collapse-toggle">
                                <span className={`toggle-icon ${collapsedSections.propertyAmenities ? 'collapsed' : 'expanded'}`}>
                                    {collapsedSections.propertyAmenities ? '▼' : '▲'}
                                </span>
                            </div>
                        </div>
                        
                        <div className={`step-content ${collapsedSections.propertyAmenities ? 'collapsed' : ''}`}>
                            <div className="amenities-container">
                                <div className="amenities-row">
                                    
                                    {/* Basic Features Column */}
                                    <div className="amenities-column">
                                        <h3 className="amenities-category-title">
                                            🏠 Basic Features
                                        </h3>
                                        <div className="amenities-grid">
                                            {amenitiesData.basicFeatures.map((amenity) => (
                                                <div 
                                                    key={amenity.id} 
                                                    className={`amenity-card ${selectedAmenities[amenity.id] ? 'selected' : ''}`}
                                                    onClick={() => handleAmenityToggle(amenity.id)}
                                                >
                                                    <div className="amenity-checkbox">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedAmenities[amenity.id] || false}
                                                            onChange={() => handleAmenityToggle(amenity.id)}
                                                            readOnly
                                                        />
                                                    </div>
                                                    <span className="amenity-label">{amenity.label}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Security & Comfort Column */}
                                    <div className="amenities-column">
                                        <h3 className="amenities-category-title">
                                            🛡️ Security & Comfort
                                        </h3>
                                        <div className="amenities-grid">
                                            {amenitiesData.securityComfort.map((amenity) => (
                                                <div 
                                                    key={amenity.id} 
                                                    className={`amenity-card ${selectedAmenities[amenity.id] ? 'selected' : ''}`}
                                                    onClick={() => handleAmenityToggle(amenity.id)}
                                                >
                                                    <div className="amenity-checkbox">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedAmenities[amenity.id] || false}
                                                            onChange={() => handleAmenityToggle(amenity.id)}
                                                            readOnly
                                                        />
                                                    </div>
                                                    <span className="amenity-label">{amenity.label}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Recreation & Location Column */}
                                    <div className="amenities-column">
                                        <h3 className="amenities-category-title">
                                            🏖️ Recreation & Location
                                        </h3>
                                        <div className="amenities-grid">
                                            {amenitiesData.recreationLocation.map((amenity) => (
                                                <div 
                                                    key={amenity.id} 
                                                    className={`amenity-card ${selectedAmenities[amenity.id] ? 'selected' : ''}`}
                                                    onClick={() => handleAmenityToggle(amenity.id)}
                                                >
                                                    <div className="amenity-checkbox">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedAmenities[amenity.id] || false}
                                                            onChange={() => handleAmenityToggle(amenity.id)}
                                                            readOnly
                                                        />
                                                    </div>
                                                    <span className="amenity-label">{amenity.label}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Selected Amenities Summary */}
                                {getSelectedAmenitiesArray().length > 0 && (
                                    <div className="selected-amenities-summary" style={{ 
                                        marginTop: '32px', 
                                        padding: '20px', 
                                        background: 'linear-gradient(135deg, #f0f4ff 0%, #e8f5e8 100%)', 
                                        borderRadius: '12px',
                                        border: '1px solid #4a6cf7'
                                    }}>
                                        <h4 style={{ 
                    marginBottom: '16px', 
                    fontSize: '16px', 
                    fontWeight: '600',
                    color: '#4a6cf7',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        }}>
                                            ✨ Selected Amenities ({getSelectedAmenitiesArray().length})
                                        </h4>
                                        <div className="selected-tags" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                            {getSelectedAmenitiesArray().map((amenityId) => {
                                                const amenity = [
                                                    ...amenitiesData.basicFeatures,
                                                    ...amenitiesData.securityComfort,
                                                    ...amenitiesData.recreationLocation
                                                ].find(a => a.id === amenityId);
                                                return amenity ? (
                                                    <span key={amenityId} className="amenity-tag" style={{ 
                                                        display: 'inline-flex', 
                                                        alignItems: 'center', 
                                                        backgroundColor: '#4a6cf7', 
                                                        color: 'white', 
                                                        padding: '6px 12px', 
                                                        borderRadius: '20px', 
                                                        fontSize: '13px',
                                                        fontWeight: '500',
                                                        boxShadow: '0 2px 4px rgba(74, 108, 247, 0.2)'
                                                    }}>
                                                        {amenity.label}
                                                        <button 
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleAmenityToggle(amenityId);
                                                            }}
                                                            className="remove-tag"
                                                            style={{ 
                                                                marginLeft: '8px', 
                                                                background: 'rgba(255, 255, 255, 0.2)', 
                                                                border: 'none', 
                                                                color: 'white', 
                                                                cursor: 'pointer', 
                                                                fontSize: '16px',
                                                                borderRadius: '50%',
                                                                width: '20px',
                                                                height: '20px',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                transition: 'background 0.2s'
                                                            }}
                                                            onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
                                                            onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
                                                        >
                                                            ×
                                                        </button>
                                                    </span>
                                                ) : null;
                                            })}
                                        </div>
                                        <div style={{ 
                                            marginTop: '12px', 
                                            fontSize: '13px', 
                                            color: '#666',
                                            fontStyle: 'italic'
                                        }}>
                                            💡 These amenities will help potential tenants/buyers find your property
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="form-submit-section">
                        <div className="submit-actions">
                            <Link to="/property-list" className="back-btn">
                                ← Back to Properties
                            </Link>
                            <button
                                type="button"
                                onClick={NextPage}
                                className={`${testMode ? 'test-mode-active' : ''} ${hasUploadsInProgress() ? 'uploads-in-progress' : ''}`}
                                style={{
                                    ...(testMode ? {
                                        backgroundColor: '#4CAF50',
                                        borderColor: '#2E7D32',
                                        position: 'relative'
                                    } : {}),
                                    ...(hasUploadsInProgress() ? {
                                        backgroundColor: '#ffc107',
                                        borderColor: '#e0a800',
                                        cursor: 'not-allowed'
                                    } : {})
                                }}
                                disabled={Loading || hasUploadsInProgress()}
                                title={
                                    hasUploadsInProgress() ? "Please wait for all image uploads to complete" :
                                    testMode ? "Test Mode Enabled - Form validation will be bypassed" : ""
                                }
                            >
                                {Loading ? (
                                    <>
                                        <span className="loading-spinner">⏳</span>
                                        Processing...
                                    </>
                                ) : hasUploadsInProgress() ? (
                                    <>
                                        <span className="loading-spinner">📤</span>
                                        Uploading Images...
                                    </>
                                ) : (
                                    <>
                                        Continue to Promotion
                                        <SvgRightIcon />
                                    </>
                                )}
                            </button>
                        </div>
                        
                        <div className="form-progress">
                            <p>Step 5 of 6 - Choose your property promotion package next</p>
                        </div>
                        
                        {/* Test Mode Switch */}
                        <div className="test-mode-container" style={{ 
                            position: 'fixed', 
                            bottom: '20px', 
                            right: '20px',
                            backgroundColor: testMode ? '#e8f5e9' : '#f1f1f1',
                            padding: '10px 15px',
                            borderRadius: '8px',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                            zIndex: 1000,
                            border: testMode ? '1px solid #4CAF50' : '1px solid #ddd'
                        }}>
                            <div style={{ 
                                fontWeight: 'bold', 
                                marginBottom: '5px',
                                color: testMode ? '#2E7D32' : '#333'
                            }}>
                                Test Mode {testMode && '✅'}
                            </div>
                            <button 
                                onClick={() => {
                                    const newTestMode = !testMode;
                                    console.log("Setting test mode to:", newTestMode);
                                    setTestMode(newTestMode);
                                    if (newTestMode) {
                                        toast.success('Test Mode enabled! Form validation will be bypassed.', {
                                            position: "top-center",
                                            autoClose: 3000
                                        });
                                    } else {
                                        toast.info('Test Mode disabled. Normal validation resumed.', {
                                            position: "top-center"
                                        });
                                    }
                                    // Force a re-render to ensure UI updates
                                    setTimeout(() => {
                                        setInps({...inps});
                                    }, 50);
                                }} 
                                style={{
                                    backgroundColor: testMode ? '#4CAF50' : '#ddd',
                                    color: testMode ? 'white' : '#333',
                                    border: 'none',
                                    padding: '8px 15px',
                                    borderRadius: '20px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                {testMode ? 'Enabled' : 'Enable Test Mode'}
                            </button>
                            {testMode && (
                                <div style={{ 
                                    fontSize: '11px', 
                                    marginTop: '8px', 
                                    color: '#4CAF50',
                                    fontStyle: 'italic'
                                }}>
                                    Validation bypassed. Test data will be used.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PropertyListForm;
