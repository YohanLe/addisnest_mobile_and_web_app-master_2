import React, { useEffect, useState } from "react";
import { Agent1, Agent1 as DefaultProfileImg } from "../../../../assets/images";
import Select from "react-select";

// Regional states in Ethiopia
const regionalStates = [
    { value: "", label: "Select Regional State" },
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
import { AuthUserDetails } from "../../../../Redux-store/Slices/AuthSlice";
import { useDispatch, useSelector } from "react-redux";
import Api from "../../../../Apis/Api";
import { ValidateUserCusProfileUpdate } from "../../../../utils/Validation";
import { toast } from "react-toastify";
import axios from "axios";

// Get API base URL for image paths
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:7002';

// Helper function to get full image URL
const getImageUrl = (imagePath) => {
    if (!imagePath || imagePath === 'None' || imagePath === '') {
        return DefaultProfileImg;
    }
    // If it's already a full URL, return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
    }
    // If it's a relative path starting with /uploads, prepend the API base URL
    if (imagePath.startsWith('/uploads/')) {
        return `${API_BASE_URL}${imagePath}`;
    }
    // If it's just a filename, prepend the full uploads path
    return `${API_BASE_URL}/uploads/${imagePath}`;
};

const MyProfileTab = () => {
    const dispatch = useDispatch();
    const [profileImage, setProfileImage] = useState(DefaultProfileImg); // Default image
    const SelectClient = [{ value: "Select", label: "Select" }];

    const [Loading, setLoading] = useState(false);
    const [error, setError] = useState({ isValid: false });
    const ProfileDetail = useSelector((state) => state.Auth.Details);
    const profiledata = ProfileDetail?.data;
    // Remove console log to prevent multiple profile objects in console
    
    const [MediaPaths, setMediaPaths] = useState(profiledata?.profile_img || '');
    const [image, setImage] = useState({ uri: profiledata?.profile_img || DefaultProfileImg, file: '' });
    
    // Update MediaPaths when profile data changes
    useEffect(() => {
        if (profiledata?.profile_img) {
            setMediaPaths(profiledata.profile_img);
        }
    }, [profiledata]);
    
    // Update image when profile data changes
    useEffect(() => {
        if (profiledata?.profile_img) {
            setImage({ uri: getImageUrl(profiledata.profile_img), file: '' });
        }
    }, [profiledata]);

    const [inps, setInps] = useState({
        email: '',
        name: '',
        firstName: '',
        lastName: '',
        phone: '',
        state: '',
        city: '',
        about: '',
        role: '',
        experience: '',
        specialties: [],
        languagesSpoken: [],
        licenseNumber: '',
        agency: ''
    })

    useEffect(() => {
        setInps({
            email: profiledata?.email || '',
            name: profiledata?.name || (profiledata?.firstName && profiledata?.lastName ? 
                `${profiledata.firstName} ${profiledata.lastName}` : ''),
            firstName: profiledata?.firstName || '',
            lastName: profiledata?.lastName || '',
            phone: profiledata?.phone || '',
            state: profiledata?.state || profiledata?.address?.state || '',
            city: profiledata?.city || profiledata?.address?.city || '',
            about: profiledata?.about || '',
            role: profiledata?.role || '',
            experience: profiledata?.experience || '',
            specialties: profiledata?.specialties || [],
            languagesSpoken: profiledata?.languagesSpoken || [],
            licenseNumber: profiledata?.licenseNumber || '',
            agency: profiledata?.agency || ''
        })
    }, [profiledata])
    const onInpChanged = (event) => {
        setError(p => {
            const obj = { ...p }
            obj?.errors && delete obj?.errors[event?.target?.name]
            return obj
        })
        setInps((prevInputs) => ({ ...prevInputs, [event.target.name]: event.target.value }));
    };
    useEffect(() => {
        dispatch(AuthUserDetails());
        fetchUserProfile();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    // Fetch detailed user profile from API
    const fetchUserProfile = async () => {
        try {
            setLoading(true);
            console.log("Fetching user profile from database...");
            
            // Get token from localStorage or tokenHandler
            const token = localStorage.getItem('addisnest_token');
            
            if (!token) {
                console.error("No authentication token found");
                toast.error("Please log in again to view your profile");
                setLoading(false);
                return;
            }
            
            // Make API request to get comprehensive user profile
            const response = await Api.getWithtoken("auth/profile");
            console.log("User profile API response:", response);
            
            // Handle different response formats
            let userData = {};
            if (response && response.result) {
                userData = response.result;
            } else if (response && response.data) {
                userData = response.data;
            } else if (response) {
                userData = response;
            }
            
            console.log("Processed user data:", userData);
            
            // Format the about text with user details if available
            let aboutText = userData.about || '';
            
            // If about text is empty but we have other details, create a formatted about text
            if (!aboutText && (userData.experience || userData.averageRating || 
                (userData.languagesSpoken && userData.languagesSpoken.length) || 
                (userData.specialties && userData.specialties.length))) {
                
                const experiencePart = userData.experience ? `Experience: ${userData.experience} years\n` : '';
                const ratingPart = userData.averageRating ? `Rating: ${userData.averageRating} ⭐\n` : '';
                const languagesPart = userData.languagesSpoken && userData.languagesSpoken.length ? 
                    `Languages: ${userData.languagesSpoken.join(', ')}\n` : '';
                const specialtiesPart = userData.specialties && userData.specialties.length ? 
                    `Specialties: ${userData.specialties.join(', ')}` : '';
                
                aboutText = `${experiencePart}${ratingPart}${languagesPart}${specialtiesPart}`.trim();
            }
            
            // Set comprehensive form data with user profile information
            setInps({
                email: userData.email || '',
                name: userData.firstName && userData.lastName ? 
                    `${userData.firstName} ${userData.lastName}` : 
                    userData.name || '',
                firstName: userData.firstName || '',
                lastName: userData.lastName || '',
                phone: userData.phone || '',
                state: userData.address?.state || userData.regionalState || '',
                city: userData.address?.city || '',
                about: aboutText || userData.about || '',
                role: userData.role || '',
                experience: userData.experience || '',
                specialties: userData.specialties || [],
                languagesSpoken: userData.languagesSpoken || [],
                licenseNumber: userData.licenseNumber || '',
                agency: userData.agency || ''
            });
            
            console.log("Profile form data populated successfully");
            
            // Set profile image if available - check both fields and handle 'None' string
            const profileImageUrl = userData.profileImage || userData.profile_img;
            if (profileImageUrl && profileImageUrl !== 'None' && profileImageUrl !== '') {
                console.log("Setting profile image from database:", profileImageUrl);
                const fullImageUrl = getImageUrl(profileImageUrl);
                console.log("Full image URL:", fullImageUrl);
                setImage({ uri: fullImageUrl, file: '' });
                setMediaPaths(profileImageUrl); // Keep storing the relative path in MediaPaths
            } else {
                console.log("No profile image in database");
                // Don't override if we already have an uploaded image in MediaPaths
                // This prevents losing the uploaded image during refresh
            }
            
            setLoading(false);
            // Only show success message if this isn't the initial load
            if (userData.email) {
                console.log("Profile data loaded from database");
            }
        } catch (error) {
            console.error("Error fetching user profile:", error);
            toast.error("Failed to load profile data from database. Using cached data instead.");
            setLoading(false);
            
            // Fall back to using the basic profile data from Redux
            setInps({
                email: profiledata?.email || '',
                name: profiledata?.name || (profiledata?.firstName && profiledata?.lastName ? 
                    `${profiledata.firstName} ${profiledata.lastName}` : ''),
                firstName: profiledata?.firstName || '',
                lastName: profiledata?.lastName || '',
                phone: profiledata?.phone || '',
                state: profiledata?.state || profiledata?.address?.state || '',
                city: profiledata?.city || profiledata?.address?.city || '',
                about: profiledata?.about || '',
                role: profiledata?.role || '',
                experience: profiledata?.experience || '',
                specialties: profiledata?.specialties || [],
                languagesSpoken: profiledata?.languagesSpoken || [],
                licenseNumber: profiledata?.licenseNumber || '',
                agency: profiledata?.agency || ''
            });
            
            // If we have profile image in Redux data, use that
            if (profiledata?.profile_img) {
                setImage({ uri: getImageUrl(profiledata.profile_img), file: '' });
                setMediaPaths(profiledata.profile_img);
            }
        }
    };

    const handleFileChange = async (event) => {
        console.log("File selection triggered");
        const file = event.target.files[0];
        if (file) {
            console.log("File selected:", file.name, file.size, file.type);
            
            // Validate file size (3MB = 3 * 1024 * 1024 bytes)
            if (file.size > 3 * 1024 * 1024) {
                toast.error("File size must be less than 3MB");
                return;
            }
            
            // Validate file type
            if (!file.type.startsWith('image/')) {
                toast.error("Please select an image file");
                return;
            }
            
            const reader = new FileReader();
            reader.onloadend = () => {
                console.log("File read completed, showing preview");
                const data = { 
                    uri: reader.result,
                    file 
                };
                setImage(data);
            };
            reader.readAsDataURL(file);
            
            // Upload the file
            await ImagesUpload(file);
        } else {
            console.log("No file selected");
        }
    };

    const ImagesUpload = async (file) => {
        console.log("Starting image upload process...");
        try {
            setLoading(true);
            toast.info("Uploading image...");
            
            let formData = new FormData();
            formData.append("mediaFiles", file);
            
            console.log("Calling upload API...");
            // Use postFileWithtoken for file uploads (handles multipart/form-data correctly)
            const response = await Api.postFileWithtoken("api/media/public", formData);
            console.log("Upload API response:", response);
            
            setLoading(false);
            
            // Handle different response formats
            let imageUrl = '';
            if (response && response.files) {
                const { files } = response;
                
                // Files is an array of objects, each with url/path property
                if (Array.isArray(files) && files.length > 0) {
                    // Extract the URL from the first file object
                    const fileObj = files[0];
                    imageUrl = fileObj.url || fileObj.path || fileObj;
                } else if (typeof files === 'string') {
                    // Fallback if files is returned as a string
                    imageUrl = files;
                }
                
                if (imageUrl) {
                    console.log("Image uploaded successfully:", imageUrl);
                    setMediaPaths(imageUrl);
                    toast.success("Image uploaded successfully!");
                } else {
                    throw new Error("No image URL returned from server");
                }
            } else if (response && response.data && response.data.files) {
                // Handle nested response format
                const files = response.data.files;
                if (Array.isArray(files) && files.length > 0) {
                    const fileObj = files[0];
                    imageUrl = fileObj.url || fileObj.path || fileObj;
                    console.log("Image uploaded successfully:", imageUrl);
                    setMediaPaths(imageUrl);
                    toast.success("Image uploaded successfully!");
                } else {
                    throw new Error("No image URL returned from server");
                }
            } else {
                throw new Error("Invalid response format from server");
            }
        } catch (error) {
            setLoading(false);
            console.error("Upload Error Details:", error);
            console.error("Error response:", error?.response);
            console.error("Error message:", error?.message);
            
            const errorMessage = error?.response?.data?.message || 
                                error?.response?.data?.error ||
                                error?.message || 
                                "Image upload failed! Please try again.";
            
            toast.error(errorMessage);
        }
    };

    const UpdateProfile = async () => {
        console.log('==== UpdateProfile function called ====');
        console.log('Current form data:', inps);
        
        const errorMessage = ValidateUserCusProfileUpdate(inps);
        console.log('Validation result:', errorMessage);
        
        if (!errorMessage.isValid) {
            console.log('❌ Validation FAILED:', errorMessage.errors);
            setError(errorMessage);
            toast.error("Please fix the errors in the form");
            return;
        }
        
        console.log('✅ Validation PASSED, starting update process...');
        
        try {
            setLoading(true);
            console.log('Loading set to true');
            
            // Get the current user ID from localStorage or Redux state
            const token = localStorage.getItem('addisnest_token');
            if (!token) {
                toast.error("Authentication token not found. Please log in again.");
                setLoading(false);
                return;
            }
            
            // Split name into firstName and lastName
            const nameParts = inps.name.trim().split(' ');
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';
            
            // Prepare the body for the API request
            let body = {
                email: inps.email.trim(),
                firstName: firstName,
                lastName: lastName,
                phone: inps.phone.trim(),
                address: {
                    state: inps.state,
                    city: inps.city || ''
                },
                about: inps.about || '',
                profile_img: MediaPaths || '',
                profileImage: MediaPaths || ''
            };
            
            console.log("Update Profile - MediaPaths value:", MediaPaths);
            console.log("Update Profile - Request body:", body);
            
            // Add agent-specific fields if user is an agent
            if (inps.role === 'agent') {
                if (inps.experience) body.experience = parseInt(inps.experience) || 0;
                if (inps.licenseNumber) body.licenseNumber = inps.licenseNumber.trim();
                if (inps.agency) body.agency = inps.agency.trim();
            }
            
            // For backward compatibility, also include the name field
            body.name = inps.name;
            
            // Send the update request
            toast.info("Updating profile...");
            const response = await Api.postWithtoken("auth/updateProfile", body);
            const { message } = response;
            
            setLoading(false);
            
            // Show success message
            toast.success(message || "Profile updated successfully!");
            
            // Refresh Redux store with updated user data
            await dispatch(AuthUserDetails());
            
            // Fetch fresh data from database to display updated values
            setTimeout(async () => {
                toast.info("Refreshing profile data...");
                await fetchUserProfile();
                toast.success("Profile data refreshed!");
            }, 1000);
            
        } catch (error) {
            setLoading(false);
            toast.error(error?.response?.data?.message || "Failed to update profile");
            console.error("Update profile error:", error);
        }
    };
    
    return (
        <>
            <div className="myprofile-main-section">
                <div className="card-body">
                    <div className="profile-header" style={{
                        marginBottom: "30px",
                        textAlign: "center"
                    }}>
                        <h2 style={{
                            fontSize: "22px",
                            fontWeight: "600",
                            color: "#333",
                            marginBottom: "15px"
                        }}>Personal Information</h2>
                        <p style={{
                            fontSize: "15px",
                            color: "#666",
                            maxWidth: "600px",
                            margin: "0 auto"
                        }}>
                            Update your personal details and profile picture to help others recognize you
                        </p>
                    </div>
                    
                    <div className="imgupl-reslt" style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        marginBottom: "30px"
                    }}>
                        {/* Image Upload Section */}
                        <label htmlFor="imageInput" className="camera-icon" style={{
                            cursor: "pointer",
                            position: "relative",
                            display: "block",
                            width: "120px",
                            height: "120px",
                            borderRadius: "50%",
                            overflow: "hidden",
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                            marginBottom: "15px"
                        }}>
                            <div className="pancil-icon" style={{
                                position: "absolute",
                                bottom: "0",
                                right: "0",
                                backgroundColor: "#4a6cf7",
                                width: "32px",
                                height: "32px",
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                zIndex: "2"
                            }}>
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <g clipPath="url(#clip0_2226_5057)">
                                        <path
                                            d="M12.0003 6.66671L9.33368 4.00004M1.66699 14.3334L3.92324 14.0827C4.1989 14.0521 4.33673 14.0367 4.46556 13.995C4.57985 13.958 4.68862 13.9058 4.78892 13.8396C4.90196 13.7651 5.00002 13.667 5.19614 13.4709L14.0003 4.66671C14.7367 3.93033 14.7367 2.73642 14.0003 2.00004C13.264 1.26366 12.0701 1.26366 11.3337 2.00004L2.52948 10.8042C2.33336 11.0003 2.2353 11.0984 2.16075 11.2114C2.09461 11.3117 2.04234 11.4205 2.00533 11.5348C1.96363 11.6636 1.94831 11.8015 1.91769 12.0771L1.66699 14.3334Z"
                                            stroke="#FAFAFA"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_2226_5057">
                                            <rect width="16" height="16" fill="white" />
                                        </clipPath>
                                    </defs>
                                </svg>
                            </div>
                            <input
                                type="file"
                                id="imageInput"
                                accept="image/*"
                                style={{ display: "none" }}
                                onChange={handleFileChange}
                            />
                            <div id="imagePreview" style={{ width: "100%", height: "100%" }}>
                                <div className="uplinr-pic" style={{ width: "100%", height: "100%" }}>
                                    <span
                                        style={{
                                            backgroundImage: `url(${image?.uri})`,
                                            backgroundSize: "cover",
                                            backgroundPosition: "center",
                                            display: "block",
                                            width: "100%",
                                            height: "100%"
                                        }}
                                    ></span>
                                </div>
                            </div>
                        </label>
                        <div className="img-uploader" style={{
                            textAlign: "center"
                        }}>
                            <h3 style={{
                                fontSize: "16px",
                                fontWeight: "600",
                                color: "#333",
                                marginBottom: "5px"
                            }}>Upload Profile Picture</h3>
                            <p style={{
                                fontSize: "14px",
                                color: "#888",
                                marginBottom: "10px"
                            }}>Size: less than 3MB</p>
                            {(MediaPaths && MediaPaths !== 'None' && MediaPaths !== DefaultProfileImg) && (
                                <button
                                    onClick={() => {
                                        if (window.confirm("Are you sure you want to remove your profile picture?")) {
                                            setImage({ uri: DefaultProfileImg, file: '' });
                                            setMediaPaths('');
                                            toast.success("Profile picture removed. Click 'Update Profile' to save changes.");
                                        }
                                    }}
                                    style={{
                                        padding: "8px 16px",
                                        backgroundColor: "#ff4d4f",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "6px",
                                        fontSize: "14px",
                                        fontWeight: "500",
                                        cursor: "pointer",
                                        transition: "all 0.3s ease",
                                        marginTop: "5px"
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.backgroundColor = "#d9363e";
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.backgroundColor = "#ff4d4f";
                                    }}
                                >
                                    Remove Picture
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="form-flex" style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "20px",
                        marginBottom: "30px"
                    }}>
                        <div className="form-inner-flex-100" style={{ width: "100%" }}>
                            <div className="single-input">
                                <label style={{
                                    display: "block",
                                    marginBottom: "8px",
                                    fontSize: "15px",
                                    fontWeight: "600",
                                    color: "#444"
                                }}>Full Name</label>
                                <input 
                                type="text" 
                                name="name"
                                placeholder="Enter your full name" 
                                onChange={onInpChanged}
                                value={inps?.name}
                                className={`${error.errors?.name ? "alert-input" : ""}`}
                                style={{
                                    width: "100%",
                                    padding: "12px 16px",
                                    fontSize: "15px",
                                    border: error.errors?.name ? "1px solid #ff4d4f" : "1px solid #e1e1e1",
                                    borderRadius: "8px",
                                    transition: "all 0.3s ease"
                                }}
                                />
                                {error.errors?.name && <p style={{
                                    color: "#ff4d4f",
                                    fontSize: "13px",
                                    marginTop: "5px"
                                }}>{error.errors?.name}</p>}
                            </div>
                        </div>
                        <div className="form-inner-flex-50" style={{ width: "calc(50% - 10px)" }}>
                            <div className="single-input">
                                <label style={{
                                    display: "block",
                                    marginBottom: "8px",
                                    fontSize: "15px",
                                    fontWeight: "600",
                                    color: "#444"
                                }}>Email Address</label>
                                <input 
                                type="email" 
                                name="email"
                                placeholder="Enter your email" 
                                onChange={onInpChanged}
                                value={inps?.email}
                                className={`${error.errors?.email ? "alert-input" : ""}`}
                                style={{
                                    width: "100%",
                                    padding: "12px 16px",
                                    fontSize: "15px",
                                    border: error.errors?.email ? "1px solid #ff4d4f" : "1px solid #e1e1e1",
                                    borderRadius: "8px",
                                    transition: "all 0.3s ease"
                                }}
                                />
                                {error.errors?.email && <p style={{
                                    color: "#ff4d4f",
                                    fontSize: "13px",
                                    marginTop: "5px"
                                }}>{error.errors?.email}</p>}
                            </div>
                        </div>
                        <div className="form-inner-flex-50" style={{ width: "calc(50% - 10px)" }}>
                            <div className="single-input">
                                <label style={{
                                    display: "block",
                                    marginBottom: "8px",
                                    fontSize: "15px",
                                    fontWeight: "600",
                                    color: "#444"
                                }}>Phone Number</label>
                                <input 
                                type="tel" 
                                name="phone"
                                placeholder="Enter your phone number" 
                                onChange={onInpChanged}
                                value={inps?.phone}
                                className={`${error.errors?.phone ? "alert-input" : ""}`}
                                style={{
                                    width: "100%",
                                    padding: "12px 16px",
                                    fontSize: "15px",
                                    border: error.errors?.phone ? "1px solid #ff4d4f" : "1px solid #e1e1e1",
                                    borderRadius: "8px",
                                    transition: "all 0.3s ease"
                                }}
                                />
                                {error.errors?.phone && <p style={{
                                    color: "#ff4d4f",
                                    fontSize: "13px",
                                    marginTop: "5px"
                                }}>{error.errors?.phone}</p>}
                            </div>
                        </div>
                        <div className="form-inner-flex-50" style={{ width: "calc(50% - 10px)" }}>
                            <div className="single-input">
                                <label style={{
                                    display: "block",
                                    marginBottom: "8px",
                                    fontSize: "15px",
                                    fontWeight: "600",
                                    color: "#444"
                                }}>Regional State</label>
                                <Select
                                    options={regionalStates}
                                    value={regionalStates.find(option => option.value === inps?.state) || regionalStates[0]}
                                    onChange={(selectedOption) => {
                                        setInps((prevInputs) => ({ ...prevInputs, state: selectedOption.value }));
                                        setError(p => {
                                            const obj = { ...p };
                                            obj?.errors && delete obj?.errors.state;
                                            return obj;
                                        });
                                    }}
                                    className={`${error.errors?.state ? "alert-input" : ""}`}
                                    styles={{
                                        control: (provided, state) => ({
                                            ...provided,
                                            padding: "6px 8px",
                                            fontSize: "15px",
                                            border: error.errors?.state ? "1px solid #ff4d4f" : "1px solid #e1e1e1",
                                            borderRadius: "8px",
                                            boxShadow: "none",
                                            "&:hover": {
                                                border: error.errors?.state ? "1px solid #ff4d4f" : "1px solid #4a6cf7"
                                            }
                                        })
                                    }}
                                />
                                {error.errors?.state && <p style={{
                                    color: "#ff4d4f",
                                    fontSize: "13px",
                                    marginTop: "5px"
                                }}>{error.errors?.state}</p>}
                            </div>
                        </div>
                        <div className="form-inner-flex-50" style={{ width: "calc(50% - 10px)" }}>
                            <div className="single-input">
                                <label style={{
                                    display: "block",
                                    marginBottom: "8px",
                                    fontSize: "15px",
                                    fontWeight: "600",
                                    color: "#444"
                                }}>Role</label>
                                <input 
                                type="text" 
                                name="role"
                                placeholder="Your role" 
                                value={inps?.role ? inps.role.charAt(0).toUpperCase() + inps.role.slice(1) : ''}
                                readOnly
                                style={{
                                    width: "100%",
                                    padding: "12px 16px",
                                    fontSize: "15px",
                                    border: "1px solid #e1e1e1",
                                    borderRadius: "8px",
                                    backgroundColor: "#f8f9fa",
                                    color: "#666",
                                    cursor: "not-allowed"
                                }}
                                />
                            </div>
                        </div>
                        {inps?.role === 'agent' && (
                            <>
                                <div className="form-inner-flex-50" style={{ width: "calc(50% - 10px)" }}>
                                    <div className="single-input">
                                        <label style={{
                                            display: "block",
                                            marginBottom: "8px",
                                            fontSize: "15px",
                                            fontWeight: "600",
                                            color: "#444"
                                        }}>Experience (Years)</label>
                                        <input 
                                        type="number" 
                                        name="experience"
                                        placeholder="Years of experience" 
                                        onChange={onInpChanged}
                                        value={inps?.experience}
                                        style={{
                                            width: "100%",
                                            padding: "12px 16px",
                                            fontSize: "15px",
                                            border: "1px solid #e1e1e1",
                                            borderRadius: "8px",
                                            transition: "all 0.3s ease"
                                        }}
                                        />
                                    </div>
                                </div>
                                <div className="form-inner-flex-50" style={{ width: "calc(50% - 10px)" }}>
                                    <div className="single-input">
                                        <label style={{
                                            display: "block",
                                            marginBottom: "8px",
                                            fontSize: "15px",
                                            fontWeight: "600",
                                            color: "#444"
                                        }}>License Number</label>
                                        <input 
                                        type="text" 
                                        name="licenseNumber"
                                        placeholder="Professional license number" 
                                        onChange={onInpChanged}
                                        value={inps?.licenseNumber}
                                        style={{
                                            width: "100%",
                                            padding: "12px 16px",
                                            fontSize: "15px",
                                            border: "1px solid #e1e1e1",
                                            borderRadius: "8px",
                                            transition: "all 0.3s ease"
                                        }}
                                        />
                                    </div>
                                </div>
                                <div className="form-inner-flex-100" style={{ width: "100%" }}>
                                    <div className="single-input">
                                        <label style={{
                                            display: "block",
                                            marginBottom: "8px",
                                            fontSize: "15px",
                                            fontWeight: "600",
                                            color: "#444"
                                        }}>Agency</label>
                                        <input 
                                        type="text" 
                                        name="agency"
                                        placeholder="Agency or company name" 
                                        onChange={onInpChanged}
                                        value={inps?.agency}
                                        style={{
                                            width: "100%",
                                            padding: "12px 16px",
                                            fontSize: "15px",
                                            border: "1px solid #e1e1e1",
                                            borderRadius: "8px",
                                            transition: "all 0.3s ease"
                                        }}
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                        <div className="form-inner-flex-100" style={{ width: "100%" }}>
                            <div className="single-input">
                                <label style={{
                                    display: "block",
                                    marginBottom: "8px",
                                    fontSize: "15px",
                                    fontWeight: "600",
                                    color: "#444"
                                }}>About</label>
                                <textarea
                                    cols={5}
                                    rows={5}
                                    type="text"
                                    placeholder="Enter your description"
                                    name="about"
                                    onChange={onInpChanged}
                                    value={inps?.about}
                                    className={`${error.errors?.about ? "alert-input" : ""}`}
                                    style={{
                                        width: "100%",
                                        padding: "12px 16px",
                                        fontSize: "15px",
                                        border: error.errors?.about ? "1px solid #ff4d4f" : "1px solid #e1e1e1",
                                        borderRadius: "8px",
                                        transition: "all 0.3s ease",
                                        minHeight: "120px",
                                        resize: "vertical"
                                    }}
                                />
                                {error.errors?.about && <p style={{
                                    color: "#ff4d4f",
                                    fontSize: "13px",
                                    marginTop: "5px"
                                }}>{error.errors?.about}</p>}
                            </div>
                        </div>
                    </div>
                    <div className="myprofile-btn" style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: "15px",
                        marginTop: "20px"
                    }}>
                        <button 
                            className="btn btn-secondary"
                            onClick={() => {
                                // Reset form to original values from database
                                fetchUserProfile();
                                toast.info("Form reset to original values");
                            }}
                            style={{
                                padding: "12px 24px",
                                backgroundColor: "#f5f5f5",
                                color: "#666",
                                border: "1px solid #e1e1e1",
                                borderRadius: "8px",
                                fontSize: "15px",
                                fontWeight: "600",
                                cursor: "pointer",
                                transition: "all 0.3s ease"
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.backgroundColor = "#e9e9e9";
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.backgroundColor = "#f5f5f5";
                            }}
                        >
                            Reset
                        </button>
                        <button 
                            onClick={UpdateProfile} 
                            className="btn btn-primary"
                            disabled={Loading}
                            style={{
                                padding: "12px 24px",
                                backgroundColor: "#4a6cf7",
                                color: "white",
                                border: "none",
                                borderRadius: "8px",
                                fontSize: "15px",
                                fontWeight: "600",
                                cursor: "pointer",
                                transition: "all 0.3s ease",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px"
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.backgroundColor = "#3a5ce5";
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.backgroundColor = "#4a6cf7";
                            }}
                        >
                            {Loading ? (
                                <span className="spinner" style={{
                                    display: "inline-block",
                                    width: "16px",
                                    height: "16px",
                                    border: "2px solid rgba(255,255,255,0.3)",
                                    borderRadius: "50%",
                                    borderTopColor: "white",
                                    animation: "spin 1s linear infinite"
                                }}></span>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"/>
                                </svg>
                            )}
                            {Loading ? "Updating..." : "Update Profile"}
                        </button>
                    </div>
                    <style>
                        {`
                            @keyframes spin {
                                to { transform: rotate(360deg); }
                            }
                        `}
                    </style>
                </div>
            </div>
        </>
    );
};

export default MyProfileTab;
