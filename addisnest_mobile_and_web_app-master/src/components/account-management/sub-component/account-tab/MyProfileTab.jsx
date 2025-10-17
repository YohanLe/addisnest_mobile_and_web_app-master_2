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
            setImage({ uri: profiledata.profile_img, file: '' });
        }
    }, [profiledata]);

    const [inps, setInps] = useState({
        email: '',
        name:'',
        state:'',
        about:''
    })

    useEffect(()=>{
      setInps({
            email: profiledata?.email || '',
            name: profiledata?.name || '',
            state: profiledata?.state || '',
            about: profiledata?.about || ''
        })
    },[profiledata])
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
    }, []);
    
    // Fetch detailed user profile from API
    const fetchUserProfile = async () => {
        try {
            setLoading(true);
            // Fetch user profile data
            // Get token from localStorage
            const token = localStorage.getItem('addisnest_token');
            
            if (!token) {
                console.error("No authentication token found");
                setLoading(false);
                return;
            }
            
            // Make API request to get user profile
            const response = await Api.getWithtoken("auth/profile");
            
            const userData = response.data || {};
            // User profile data retrieved
            
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
            
            // Set form data with user profile information
            setInps({
                email: userData.email || '',
                name: userData.firstName && userData.lastName ? 
                    `${userData.firstName} ${userData.lastName}` : 
                    userData.name || '',
                state: userData.address?.state || '',
                about: aboutText || ''
            });
            
            // Profile form data set successfully
            
            // Set profile image if available
            if (userData.profileImage || userData.profile_img) {
                const profileImageUrl = userData.profileImage || userData.profile_img;
                setImage({ uri: profileImageUrl, file: '' });
                setMediaPaths(profileImageUrl);
                // Profile image set
            }
            
            setLoading(false);
        } catch (error) {
            console.error("Error fetching user profile:", error);
            toast.error("Failed to load profile data. Using cached data instead.");
            setLoading(false);
            
            // Fall back to using the basic profile data from Redux
            setInps({
                email: profiledata?.email || '',
                name: profiledata?.name || '',
                state: profiledata?.state || '',
                about: profiledata?.about || ''
            });
            
            // If we have profile image in Redux data, use that
            if (profiledata?.profile_img) {
                setImage({ uri: profiledata.profile_img, file: '' });
                setMediaPaths(profiledata.profile_img);
            }
        }
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const data = { 
                    uri: reader.result,
                    file 
                };
                setImage(data);
               
            };
            reader.readAsDataURL(file);
            await ImagesUpload(file);
        }
    };

    const ImagesUpload = async (file) => {
        try {
            setLoading(true);
            let formData = new FormData();
            formData.append("mediaFiles", file);
            
            const response = await Api.postWithtoken("media/public", formData);
            const { files, message } = response;
            setLoading(false);
    
            if (files && typeof files === 'string') {
                setMediaPaths(files);
            } else if (files && Array.isArray(files) && files.length > 0) {
                setMediaPaths(files[0]);
            } else {
                throw new Error("Invalid response from server");
            }
    
            toast.success(message);
        } catch (error) {
            setLoading(false);
            console.error("Upload Error:", error);
            toast.error(error?.response?.data?.message || "Image upload failed!");
        }
    };

    const UpdateProfile = async () => {
        const errorMessage = ValidateUserCusProfileUpdate(inps);
        if (errorMessage.isValid == false) {
            setError(errorMessage);
            toast.error("Please fix the errors in the form");
        } else {
            try {
                setLoading(true);
                toast.info("Retrieving user information from database...");
                
                // Get the current user ID from localStorage or Redux state
                const token = localStorage.getItem('addisnest_token');
                if (!token) {
                    toast.error("Authentication token not found. Please log in again.");
                    setLoading(false);
                    return;
                }
                
                // First, get the latest user data from the database
                try {
                    const userResponse = await Api.getWithtoken("auth/profile");
                    if (!userResponse || !userResponse.data) {
                        toast.error("Could not retrieve user information from database");
                        setLoading(false);
                        return;
                    }
                    toast.info("User information retrieved successfully");
                } catch (error) {
                    console.error("Error retrieving user data:", error);
                    toast.warning("Could not retrieve latest user data. Proceeding with update using current form data.");
                }
                
                // Split name into firstName and lastName
                const nameParts = inps.name.split(' ');
                const firstName = nameParts[0] || '';
                const lastName = nameParts.slice(1).join(' ') || '';
                
                // Extract experience, rating, languages, and specialties from about field if available
                let experience = '';
                let averageRating = '';
                let languagesSpoken = [];
                let specialties = [];
                
                // Try to parse the about text to extract structured data
                const aboutText = inps.about || '';
                if (aboutText.includes('Experience:')) {
                    const expMatch = aboutText.match(/Experience: (\d+) years/);
                    if (expMatch && expMatch[1]) {
                        experience = expMatch[1];
                    }
                    
                    const ratingMatch = aboutText.match(/Rating: ([\d.]+)/);
                    if (ratingMatch && ratingMatch[1]) {
                        averageRating = ratingMatch[1];
                    }
                    
                    const langMatch = aboutText.match(/Languages: ([^\n]+)/);
                    if (langMatch && langMatch[1]) {
                        languagesSpoken = langMatch[1].split(', ').map(lang => lang.trim());
                    }
                    
                    const specMatch = aboutText.match(/Specialties: ([^\n]+)/);
                    if (specMatch && specMatch[1]) {
                        specialties = specMatch[1].split(', ').map(spec => spec.trim());
                    }
                }
                
                // Prepare the body for the API request
                let body = {
                    email: inps.email,
                    firstName: firstName,
                    lastName: lastName,
                    address: {
                        state: inps.state
                    },
                    lat: '',
                    lng: '',
                    about: inps.about,
                    profile_img: MediaPaths,
                    profileImage: MediaPaths
                };
                
                // Add additional fields if they were extracted from the about text
                if (experience) body.experience = experience;
                if (averageRating) body.averageRating = averageRating;
                if (languagesSpoken.length > 0) body.languagesSpoken = languagesSpoken;
                if (specialties.length > 0) body.specialties = specialties;
                
                // For backward compatibility, also include the name field
                body.name = inps.name;
                
                // Send the update request
                toast.info("Updating profile in database...");
                const response = await Api.postWithtoken("auth/updateProfile", body);
                const { data, message } = response;
                
                // Profile updated successfully
                toast.success(message || "Profile updated successfully");
                
                // Refresh user data in Redux store
                dispatch(AuthUserDetails());
                
                // Also refresh the detailed profile data from the database
                setTimeout(() => {
                    toast.info("Refreshing profile data from database...");
                    fetchUserProfile();
                }, 800); // Small delay to ensure backend has processed the update
                
                setLoading(false);
            } catch (error) {
                setLoading(false);
                toast.error(error?.response?.data?.message || "Failed to update profile");
                console.error("Update profile error:", error);
            }
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
                                color: "#888"
                            }}>Size: less than 3MB</p>
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
                                type="text" 
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
                            onClick={() => {
                                if (window.confirm("Are you sure you want to update your profile?")) {
                                    UpdateProfile();
                                }
                            }} 
                            className="btn btn-primary"
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
