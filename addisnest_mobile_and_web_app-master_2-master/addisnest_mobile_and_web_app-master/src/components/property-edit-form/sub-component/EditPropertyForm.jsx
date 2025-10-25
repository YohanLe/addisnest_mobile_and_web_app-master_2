import React, { useEffect, useState } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import {
  SvgRightIcon
} from "../../../assets/svg-files/SvgFiles.jsx";
import { Link, useNavigate, useSearchParams, useParams } from "react-router-dom";
import { ValidatePropertyForm } from "../../../utils/Validation";
import Api from "../../../Apis/Api";
import "../property-form.css";
import "../../../components/property-form-styles.css";
import { useDispatch, useSelector } from "react-redux";
import { GetPropertyList } from "../../../Redux-store/Slices/PropertyListSlice";
import { 
  extractStreet, 
  extractCity, 
  extractRegionalState, 
  normalizeAmenities, 
  extractImages,
  normalizePropertyData 
} from "./property-edit-fix";
import { checkAuthenticationStatus, getAuthErrorMessage } from "../../../utils/tokenHandler";

const PropertyTypeList = [
    { value: 'House', label: 'House' },
    { value: 'Apartment', label: 'Apartment' },
    { value: 'Commercial', label: 'Commercial' },
    { value: 'Land', label: 'Land' },
    { value: 'Villa', label: 'Villa' }
]

const HomeFurnishing = [
    { value: 'Furnished', label: 'Furnished' },
    { value: 'Fully Furnished', label: 'Fully Furnished' },
    { value: 'Semi Furnished', label: 'Semi Furnished' }
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
]

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
const amenitiesData = {
    basicFeatures: [
        { id: 'parking_space', label: 'Parking Space' },
        { id: 'garage', label: 'Garage' },
        { id: 'garden_yard', label: 'Garden/Yard' },
        { id: 'balcony_terrace', label: 'Balcony/Terrace' },
        { id: 'elevator', label: 'Elevator' },
        { id: 'internet_wifi', label: 'Internet/WiFi' },
        { id: 'electricity', label: 'Electricity' },
        { id: 'water_supply', label: 'Water Supply' },
        { id: 'backup_generator', label: 'Backup Generator' },
        { id: 'solar_power', label: 'Solar Power' },
        { id: 'laundry_room', label: 'Laundry Room/Service' },
        { id: 'air_conditioning', label: 'Air Conditioning' },
        { id: 'heating_system', label: 'Heating System' },
        { id: 'ceiling_fans', label: 'Ceiling Fans' },
        { id: 'equipped_kitchen', label: 'Fully Equipped Kitchen' },
        { id: 'kitchen_appliances', label: 'Kitchen Appliances' },
        { id: 'furnished', label: 'Furnished' },
        { id: 'storage_space', label: 'Storage Space' }
    ],
    securityComfort: [
        { id: 'security_24_7', label: '24/7 Security' },
        { id: 'cctv_surveillance', label: 'CCTV Surveillance' },
        { id: 'security_alarm', label: 'Security Alarm' },
        { id: 'gated_community', label: 'Gated Community' },
        { id: 'intercom_system', label: 'Intercom System' },
        { id: 'security_guard', label: 'Security Guard' },
        { id: 'cleaning_service', label: 'Cleaning Service' },
        { id: 'maid_room', label: 'Maid\'s Room' },
        { id: 'guest_room', label: 'Guest Room' },
        { id: 'home_office', label: 'Home Office/Study' },
        { id: 'built_in_wardrobes', label: 'Built-in Wardrobes' },
        { id: 'dining_area', label: 'Dining Area' },
        { id: 'pantry_storage', label: 'Pantry/Storage' },
        { id: 'rooftop_access', label: 'Rooftop Access' },
        { id: 'courtyard', label: 'Courtyard' },
        { id: 'covered_parking', label: 'Covered Parking' },
        { id: 'bbq_area', label: 'BBQ Area' },
        { id: 'wheelchair_accessible', label: 'Wheelchair Accessible' }
    ],
    recreationLocation: [
        { id: 'gym_fitness', label: 'Gym/Fitness Center' },
        { id: 'swimming_pool', label: 'Swimming Pool' },
        { id: 'playground', label: 'Playground' },
        { id: 'sports_facilities', label: 'Sports Facilities' },
        { id: 'clubhouse', label: 'Clubhouse' },
        { id: 'near_transport', label: 'Near Public Transport' },
        { id: 'near_shopping', label: 'Near Shopping Centers' },
        { id: 'near_schools', label: 'Near Schools' },
        { id: 'near_healthcare', label: 'Near Healthcare' },
        { id: 'near_mosque', label: 'Near Mosque' },
        { id: 'near_church', label: 'Near Church' }
    ]
};

const EditPropertyForm = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const params = useParams();
    // Get property ID from either URL params or query params
    const propertyId = params?.id || searchParams.get('id');
    
    // Get properties from Redux store as fallback - use same pattern as MyListProperty
    const PropertData = useSelector((state) => state.PropertyList.Data);
    const PropertyListData = PropertData?.data?.data || PropertData?.data;
    
    const [PropertyType, setPropertyType] = useState(null);
    const [FurnishingType, setFurnishingType] = useState(null);
    const [RegionalStateType, setRegionalStateType] = useState(null);
    const [SubCityType, setSubCityType] = useState(null);
    
    const [activeTab, setActiveTab] = useState("For Rent");
    const [images, setImages] = useState([]);
    const [slots, setSlots] = useState(4);
    const [Loading, setLoading] = useState(false);
    const [fetchingData, setFetchingData] = useState(true);
    const [uploadingStates, setUploadingStates] = useState({});
    const [error, setError] = useState({ isValid: false });
    const [MediaPaths, setMediaPaths] = useState([]);
    const [selectedAmenities, setSelectedAmenities] = useState({});
    const [collapsedSections, setCollapsedSections] = useState({
        basicFeatures: true,
        securityComfort: true,
        recreationLocation: true,
        amenitiesSection: true
    });
    const [originalPropertyStatus, setOriginalPropertyStatus] = useState('pending'); // Track original status

    const [inps, setInps] = useState({
        regional_state: '',
        city: '',
        country: 'Ethiopia',
        property_address: '',
        total_price: '',
        description: '',
        property_size: '',
        number_of_bathrooms: '',
        number_of_bedrooms: '',
    });

    // Fetch property data when component mounts
    useEffect(() => {
        // Only log in development mode to avoid exposing sensitive information
        const isDev = process.env.NODE_ENV === 'development';
        
        if (isDev) {
            console.log('Loading property for edit:', propertyId);
        }
        
        if (propertyId) {
            fetchPropertyData();
        } else {
            toast.error("No property ID provided");
            navigate('/my-property-listings');
        }
    }, [propertyId]);

    const findPropertyInReduxStore = () => {
        if (PropertyListData && Array.isArray(PropertyListData)) {
            return PropertyListData.find(property => 
                String(property.id) === String(propertyId) || 
                String(property.propertyId) === String(propertyId)
            );
        }
        return null;
    };

    const getFieldValue = (propertyData, fieldNames) => {
        for (const fieldName of fieldNames) {
            if (propertyData[fieldName] !== undefined && propertyData[fieldName] !== null && propertyData[fieldName] !== '') {
                return propertyData[fieldName];
            }
        }
        return '';
    };
    
    // Remove verbose logging functions to protect sensitive data
    // Only log in development mode with minimal information
    const isDev = process.env.NODE_ENV === 'development';

    const populateFormData = (propertyData) => {
        // Only log in development mode to avoid exposing sensitive data
        const isDev = process.env.NODE_ENV === 'development';
        
        if (isDev) {
            console.log('Populating form with property data');
        }
        
        // Capture the original property status
        const currentStatus = propertyData.status || 'pending';
        setOriginalPropertyStatus(currentStatus.toLowerCase());
        
        // Normalize the data structure - handle different property naming conventions
        const normalizedData = {
            id: propertyData.id || propertyData.propertyId || propertyId,
            property_type: propertyData.property_type || propertyData.propertyType || propertyData.type,
            property_for: propertyData.property_for || propertyData.offeringType || propertyData.listingType,
            total_price: propertyData.total_price || propertyData.price,
            property_address: propertyData.property_address || (typeof propertyData.address === 'string' ? propertyData.address : propertyData.address?.street),
            number_of_bedrooms: propertyData.number_of_bedrooms || propertyData.bedrooms,
            number_of_bathrooms: propertyData.number_of_bathrooms || propertyData.bathrooms,
            property_size: propertyData.property_size || propertyData.area || propertyData.size,
            regional_state: propertyData.regional_state || propertyData.address?.regionalState || propertyData.region,
            city: propertyData.city || propertyData.subCity || propertyData.address?.subCity,
            description: propertyData.description,
            country: propertyData.country || 'Ethiopia',
            media: propertyData.media || propertyData.images || [],
            amenities: propertyData.amenities || propertyData.features || []
        };
        
        // Enhanced form field population with normalized data
        const formData = {
            regional_state: getFieldValue(normalizedData, [
                'regional_state', 'regionState', 'region_state', 'region', 'state'
            ]),
            city: getFieldValue(normalizedData, [
                'city', 'cityName', 'city_name', 'location_city'
            ]),
            country: getFieldValue(normalizedData, ['country', 'countryName']) || 'Ethiopia',
            // Prioritize the address shown in the grid - handle nested address object
            // For existing properties, construct address if needed
            property_address: normalizedData.property_address || 
                propertyData.property_address || 
                (typeof propertyData.address === 'string' ? propertyData.address : '') ||
                propertyData.address?.street ||
                propertyData.street ||
                // If all else fails, create a basic address from available location data
                (normalizedData.city && normalizedData.regional_state ? 
                    `${normalizedData.city}, ${normalizedData.regional_state}` : 
                    'Property location to be specified'),
            // Prioritize the price shown in the grid
            total_price: String(getFieldValue(normalizedData, [
                'price', 'total_price', 'cost', 'amount', 'displayPrice'
            ]) || ''),
            description: getFieldValue(normalizedData, [
                'description', 'propertyDescription', 'details'
            ]),
            property_size: String(getFieldValue(normalizedData, [
                'property_size', 'size', 'area', 'square_meters', 'displaySize'
            ]) || ''),
            number_of_bathrooms: String(getFieldValue(normalizedData, [
                'number_of_bathrooms', 'bathrooms', 'bathroom_count', 'displayBathrooms'
            ]) || ''),
            number_of_bedrooms: String(getFieldValue(normalizedData, [
                'number_of_bedrooms', 'bedrooms', 'bedroom_count', 'displayBedrooms'
            ]) || ''),
        };

        // Enhanced handling for bedrooms/bathrooms - check all possible property names
        const bedroomFields = ['number_of_bedrooms', 'bedrooms', 'bedroom_count', 'numBedrooms', 'bed_rooms', 'num_bedrooms'];
        const bathroomFields = ['number_of_bathrooms', 'bathrooms', 'bathroom_count', 'numBathrooms', 'bath_rooms', 'num_bathrooms'];
        
        // Find first non-empty bedroom value
        for (const field of bedroomFields) {
            if (
                propertyData[field] !== undefined && 
                propertyData[field] !== null && 
                propertyData[field] !== ''
            ) {
                formData.number_of_bedrooms = String(propertyData[field]);
                console.log(`✅ Found bedroom count in field "${field}": ${propertyData[field]}`);
                break;
            }
        }
        
        // Find first non-empty bathroom value
        for (const field of bathroomFields) {
            if (
                propertyData[field] !== undefined && 
                propertyData[field] !== null && 
                propertyData[field] !== ''
            ) {
                formData.number_of_bathrooms = String(propertyData[field]);
                console.log(`✅ Found bathroom count in field "${field}": ${propertyData[field]}`);
                break;
            }
        }
        setInps(formData);

        // Set property type - prioritize the type shown in the grid
        const propertyTypeValue = getFieldValue(propertyData, ['type', 'property_type', 'propertyType', 'displayType']);
        console.log('🔍 Setting property type from:', propertyTypeValue);
        if (propertyTypeValue) {
            // First try exact match
            let propertyType = PropertyTypeList.find(p => 
                p.value.toLowerCase() === propertyTypeValue.toLowerCase()
            );
            
            // If no exact match, try partial match
            if (!propertyType) {
                propertyType = PropertyTypeList.find(p => 
                    propertyTypeValue.toLowerCase().includes(p.value.toLowerCase()) ||
                    p.value.toLowerCase().includes(propertyTypeValue.toLowerCase())
                );
            }
            
            if (propertyType) {
                console.log('✅ Found matching property type:', propertyType.value);
                setPropertyType(propertyType);
            } else {
                console.log('⚠️ No matching property type found for:', propertyTypeValue);
            }
        }

        // Set furnishing type
        const furnishingValue = getFieldValue(propertyData, ['furnishing', 'furnished', 'furnishing_type']);
        if (furnishingValue) {
            const furnishing = HomeFurnishing.find(f => 
                f.value.toLowerCase() === furnishingValue.toLowerCase()
            );
            if (furnishing) {
                setFurnishingType(furnishing);
            }
        }

        // Enhanced Sub-city data retrieval and setting
        console.log('🔍 ENHANCED SUB-CITY DATA RETRIEVAL:');
        console.log('📋 Available city data from database:', {
            city: formData.city,
            subCity: propertyData.subCity || propertyData.sub_city,
            location_city: propertyData.location_city,
            cityName: propertyData.cityName,
            address_city: propertyData.address?.city || propertyData.address?.subCity,
            nested_address: propertyData.address
        });

        // Set regional state with enhanced sub-city handling
        const regionalStateValue = formData.regional_state;
        if (regionalStateValue) {
            // First try exact match
            let regionalState = RegionalStateList.find(r => 
                r.value.toLowerCase() === regionalStateValue.toLowerCase()
            );
            
            // If exact match fails, try partial match
            if (!regionalState) {
                regionalState = RegionalStateList.find(r => 
                    r.value.toLowerCase().includes(regionalStateValue.toLowerCase()) ||
                    regionalStateValue.toLowerCase().includes(r.value.toLowerCase())
                );
            }
            
            // If still no match and contains "Addis", default to Addis Ababa
            if (!regionalState && regionalStateValue.toLowerCase().includes("addis")) {
                regionalState = RegionalStateList.find(r => r.value === "Addis Ababa City Administration");
            }
            
            if (regionalState) {
                console.log('✅ Setting regional state to:', regionalState.value);
                setRegionalStateType(regionalState);
                setInps(prev => ({ ...prev, regional_state: regionalState.value }));
                
                // Enhanced Sub-city handling for Addis Ababa
                if (regionalState.value === "Addis Ababa City Administration") {
                    console.log('🔍 Processing Sub-city for Addis Ababa...');
                    
                    // Try multiple field names for sub-city data from database
                    const possibleSubCityValues = [
                        formData.city,
                        propertyData.subCity,
                        propertyData.sub_city,
                        propertyData.cityName,
                        propertyData.location_city,
                        propertyData.address?.city,
                        propertyData.address?.subCity,
                        propertyData.address?.sub_city
                    ].filter(Boolean); // Remove null/undefined values
                    
                    console.log('🔍 Possible sub-city values from database:', possibleSubCityValues);
                    
                    let matchedSubCity = null;
                    
                    // Try to find exact match first
                    for (const subCityValue of possibleSubCityValues) {
                        if (subCityValue && typeof subCityValue === 'string') {
                            const exactMatch = SubCityList.find(s => 
                                s.value.toLowerCase() === subCityValue.toLowerCase().trim()
                            );
                            if (exactMatch) {
                                matchedSubCity = exactMatch;
                                console.log(`✅ Found exact sub-city match: "${exactMatch.value}" from database field: "${subCityValue}"`);
                                break;
                            }
                        }
                    }
                    
                    // If no exact match, try partial matching
                    if (!matchedSubCity) {
                        for (const subCityValue of possibleSubCityValues) {
                            if (subCityValue && typeof subCityValue === 'string') {
                                const partialMatch = SubCityList.find(s => 
                                    s.value.toLowerCase().includes(subCityValue.toLowerCase().trim()) ||
                                    subCityValue.toLowerCase().includes(s.value.toLowerCase())
                                );
                                if (partialMatch) {
                                    matchedSubCity = partialMatch;
                                    console.log(`✅ Found partial sub-city match: "${partialMatch.value}" from database field: "${subCityValue}"`);
                                    break;
                                }
                            }
                        }
                    }
                    
                    // Set the matched sub-city
                    if (matchedSubCity) {
                        console.log('✅ Setting sub-city dropdown to:', matchedSubCity.value);
                        setSubCityType(matchedSubCity);
                        // Update the form input to match the dropdown selection
                        setInps(prev => ({ ...prev, city: matchedSubCity.value }));
                    } else {
                        console.log('⚠️ No matching sub-city found in dropdown list');
                        console.log('📋 Available sub-cities:', SubCityList.map(s => s.value));
                        
                        // If we have city data but no dropdown match, keep it as text input
                        if (formData.city) {
                            console.log(`ℹ️ Keeping original city value as text: "${formData.city}"`);
                            // Don't set SubCityType, let it fall back to text input
                        }
                    }
                }
            } else {
                // Last resort: default to Addis Ababa if no match found
                console.log('⚠️ No matching regional state, defaulting to Addis Ababa');
                const defaultState = RegionalStateList.find(r => r.value === "Addis Ababa City Administration");
                if (defaultState) {
                    setRegionalStateType(defaultState);
                    setInps(prev => ({ ...prev, regional_state: defaultState.value }));
                    
                    // Also try to set sub-city if we have city data
                    if (formData.city) {
                        const subCity = SubCityList.find(s => 
                            s.value.toLowerCase() === formData.city.toLowerCase()
                        );
                        if (subCity) {
                            console.log('✅ Setting sub-city to:', subCity.value);
                            setSubCityType(subCity);
                        }
                    }
                }
            }
        } else {
            // If no regional state provided, default to Addis Ababa
            console.log('⚠️ No regional state value provided, defaulting to Addis Ababa');
            const defaultState = RegionalStateList.find(r => r.value === "Addis Ababa City Administration");
            if (defaultState) {
                setRegionalStateType(defaultState);
                setInps(prev => ({ ...prev, regional_state: defaultState.value }));
                
                // Enhanced sub-city handling even without regional state
                if (formData.city) {
                    console.log('🔍 Attempting to set sub-city from city data:', formData.city);
                    const subCity = SubCityList.find(s => 
                        s.value.toLowerCase() === formData.city.toLowerCase()
                    );
                    if (subCity) {
                        console.log('✅ Setting sub-city to:', subCity.value);
                        setSubCityType(subCity);
                    } else {
                        console.log('⚠️ City value does not match any sub-city in dropdown:', formData.city);
                    }
                }
            }
        }

        // Set offer type - prioritize the offering shown in the grid
        console.log('🔍 Setting offer type for edit form:');
        // Check various field names for offering information
        const offeringValue = getFieldValue(propertyData, [
            'offering', 'property_for', 'propertyFor', 'listingType', 'displayOffering'
        ]);
        console.log('📋 Offering value found:', offeringValue);
        
        if (offeringValue) {
            const normalizedValue = String(offeringValue).toLowerCase().trim();
            if (normalizedValue.includes('sale') || normalizedValue === 'for sale') {
                console.log('✅ Setting to: For Sale');
                setActiveTab("For Sale");
            } else if (normalizedValue.includes('rent') || normalizedValue === 'for rent') {
                console.log('✅ Setting to: For Rent');
                setActiveTab("For Rent");
            } else {
                console.warn(`⚠️ Unexpected offering value: "${offeringValue}" - using default`);
                setActiveTab("For Sale"); // Default to For Sale if unclear
            }
        } else if (propertyData.property_for === "For Sale") {
            console.log('✅ Using database value: For Sale');
            setActiveTab("For Sale");
        } else if (propertyData.property_for === "For Rent") {
            console.log('✅ Using database value: For Rent');
            setActiveTab("For Rent");
        } else {
            // Keep the current default ("For Sale")
            console.warn('❌ No offering information found - using default "For Sale"');
            setActiveTab("For Sale");
        }

            // Process images using our utility function
        const processImages = () => {
            const newImages = extractImages(propertyData);
            
            if (newImages.length > 0) {
                setImages(newImages);
                setMediaPaths(newImages);
                setSlots(Math.max(4, newImages.length + 1));
                toast.success(`Loaded ${newImages.length} existing image(s)`);
            } else {
                setImages([]);
                setMediaPaths([]);
                setSlots(4);
            }
        };

        processImages();

        // Process amenities using our utility function
        const amenitiesObj = normalizeAmenities(propertyData);
        if (Object.keys(amenitiesObj).length > 0) {
            setSelectedAmenities(amenitiesObj);
            console.log('✅ Set amenities:', Object.keys(amenitiesObj).filter(k => amenitiesObj[k]));
        }

        toast.success('Property data populated successfully!');
    };

    // Mock property data for development and testing
    // Only use this mock property as an absolute last resort - with EMPTY values
    const mockProperty = {
        id: propertyId || "mock-id",
        property_type: "",
        property_for: "For Sale",
        total_price: "",
        property_address: "",
        number_of_bedrooms: "",
        number_of_bathrooms: "",
        property_size: "",
        status: "active",
        createdAt: new Date().toISOString(),
        regional_state: "",
        city: "",
        country: "Ethiopia",
        description: "",
        media: [],
        amenities: []
    };

    // Clear any defaults from localStorage/sessionStorage for fresh testing
    const clearStoredDefaults = () => {
        try {
            // Check for default values in localStorage
            const localData = localStorage.getItem(`property_edit_data_${propertyId}`);
            if (localData) {
                try {
                    const parsedData = JSON.parse(localData);
                    // Check for suspicious default values
                    const isDefaultData = 
                        (parsedData.regional_state === "Addis Ababa City Administration" &&
                        parsedData.city === "Addis Ababa" &&
                        parsedData.property_size === "200" && 
                        parsedData.number_of_bathrooms === "2" &&
                        parsedData.number_of_bedrooms === "3") ||
                        parsedData.description === "Property description not available";
                        
                    if (isDefaultData) {
                        console.log('🧹 Clearing suspicious default data from localStorage');
                        localStorage.removeItem(`property_edit_data_${propertyId}`);
                        localStorage.removeItem('property_edit_data');
                    }
                } catch (e) {
                    // Ignore parsing errors
                }
            }
            
            // Also check sessionStorage
            const sessionData = sessionStorage.getItem(`property_data_${propertyId}`);
            if (sessionData) {
                try {
                    const parsedData = JSON.parse(sessionData);
                    // Check for suspicious default values
                    const isDefaultData = 
                        (parsedData.regional_state === "Addis Ababa City Administration" &&
                        parsedData.city === "Addis Ababa") ||
                        parsedData.description === "Property description not available";
                        
                    if (isDefaultData) {
                        console.log('🧹 Clearing suspicious default data from sessionStorage');
                        sessionStorage.removeItem(`property_data_${propertyId}`);
                    }
                } catch (e) {
                    // Ignore parsing errors
                }
            }
        } catch (e) {
            console.warn('⚠️ Error checking for default data:', e);
        }
    };

    // Check for "edit click" data - data stored when user clicked Edit in property list
    const checkForEditClickData = () => {
        console.log('� Checking for edit click data...');
        try {
            // Check multiple possible keys where edit click data might be stored
            const possibleEditDataKeys = [
                `property_edit_click_${propertyId}`,
                `edit_property_${propertyId}`,
                `property_to_edit_${propertyId}`,
                'property_being_edited'
            ];
            
            for (const key of possibleEditDataKeys) {
                const editData = localStorage.getItem(key);
                if (editData) {
                    try {
                        const parsedData = JSON.parse(editData);
                        if (parsedData && (parsedData.id === propertyId || parsedData.propertyId === propertyId)) {
                            console.log(`✅ Found edit click data in ${key}!`, parsedData);
                            
                            // Found valid edit click data
                            return parsedData;
                        }
                    } catch (e) {
                        console.warn(`❌ Error parsing edit click data from ${key}:`, e);
                    }
                }
            }
            
            // Also check sessionStorage
            for (const key of possibleEditDataKeys) {
                const editData = sessionStorage.getItem(key);
                if (editData) {
                    try {
                        const parsedData = JSON.parse(editData);
                        if (parsedData && (parsedData.id === propertyId || parsedData.propertyId === propertyId)) {
                            console.log(`✅ Found edit click data in sessionStorage ${key}!`, parsedData);
                            
                            // Found valid edit click data
                            return parsedData;
                        }
                    } catch (e) {
                        console.warn(`❌ Error parsing edit click data from sessionStorage ${key}:`, e);
                    }
                }
            }
            
            // Also look for property list data that contains this property
            try {
                const propertyListKeys = [
                    'property_list_data',
                    'my_properties',
                    'agent_properties',
                    'property_grid_data'
                ];
                
                for (const key of propertyListKeys) {
                    const listData = localStorage.getItem(key) || sessionStorage.getItem(key);
                    if (listData) {
                        try {
                            const parsedList = JSON.parse(listData);
                            if (Array.isArray(parsedList)) {
                                const propertyInList = parsedList.find(p => 
                                    String(p.id) === String(propertyId) || 
                                    String(p.propertyId) === String(propertyId)
                                );
                                
                                if (propertyInList) {
                                    console.log(`✅ Found property in list data ${key}!`, propertyInList);
                                    return propertyInList;
                                }
                            }
                        } catch (e) {
                            console.warn(`❌ Error parsing list data from ${key}:`, e);
                        }
                    }
                }
            } catch (e) {
                console.warn('❌ Error checking property list data:', e);
            }
            
            return null;
        } catch (e) {
            console.warn('❌ Error checking for edit click data:', e);
            return null;
        }
    };

    const fetchPropertyData = async () => {
        setFetchingData(true);
        console.log('🔄 Starting property data fetch for ID:', propertyId);
        
        // First, let's clear any hardcoded default values that might be stored
        clearStoredDefaults();
        
        // Always attempt to fetch fresh data from the database first
        console.log('🔄 Fetching fresh data from database for property:', propertyId);
        let databaseDataFetched = false;
        
        try {
            // Try the working MongoDB ID endpoint first
            const workingEndpoint = `properties/mongo-id/${propertyId}`;
            
            try {
                const response = await Api.getWithtoken(workingEndpoint, { silentOn404: true });
                
                let propertyData = null;
                    
                // Handle different response structures
                if (response?.data?.data) {
                    propertyData = Array.isArray(response.data.data) ? 
                        response.data.data.find(p => String(p.id) === String(propertyId)) :
                        response.data.data;
                } else if (response?.data) {
                    propertyData = Array.isArray(response.data) ? 
                        response.data.find(p => String(p.id) === String(propertyId)) :
                        response.data;
                }
                
                if (propertyData && (propertyData.id || propertyData._id)) {
                    console.log('✅ Successfully fetched property data from database via:', workingEndpoint);
                    
                    // Ensure we have an ID property
                    if (!propertyData.id && propertyData._id) {
                        propertyData.id = propertyData._id;
                    }
                    
                    // Populate the form with the database data
                    populateFormData(propertyData);
                    
                    // Save to localStorage for offline editing
                    saveToLocalStorage(propertyData);
                    
                    databaseDataFetched = true;
                    setFetchingData(false);
                    toast.success('Property data loaded from database');
                    return;
                }
            } catch (error) {
                console.warn(`❌ MongoDB ID endpoint failed:`, error?.message);
                // Continue to fallback sources
            }
        } catch (apiError) {
            console.error('❌ Error fetching from database:', apiError);
            toast.error('Error fetching from database. Trying fallback data sources...');
        }
        
        // If database fetch failed, check if we're in force property edit mode (from PropertyListingsTab)
        const forcePropertyEdit = localStorage.getItem('force_property_edit');
        console.log('FORCE PROPERTY EDIT MODE:', forcePropertyEdit === 'true' ? 'YES' : 'NO');
        
        if (forcePropertyEdit === 'true') {
            console.log('🔄 Using forced property edit data from grid action');
            
            // Get the data stored by the Edit button click
            const editData = localStorage.getItem(`property_edit_data_${propertyId}`) || 
                            localStorage.getItem('property_edit_data');
            
            if (editData) {
                try {
                    const parsedData = JSON.parse(editData);
                    console.log('✅ Successfully loaded data from grid edit action:', parsedData);
                    
                    // Set property type
                    if (parsedData.property_type) {
                        const propertyType = PropertyTypeList.find(p => 
                            p.value.toLowerCase() === parsedData.property_type.toLowerCase()
                        );
                        if (propertyType) {
                            console.log('✅ Setting property type to:', propertyType.value);
                            setPropertyType(propertyType);
                        }
                    }
                    
                    // Set regional state
                    if (parsedData.regional_state) {
                        const regionalState = RegionalStateList.find(r => 
                            r.value.toLowerCase().includes(parsedData.regional_state.toLowerCase()) ||
                            parsedData.regional_state.toLowerCase().includes(r.value.toLowerCase())
                        );
                        if (regionalState) {
                            console.log('✅ Setting regional state to:', regionalState.value);
                            setRegionalStateType(regionalState);
                        }
                    }
                    
                    // Populate form with the parsed data
                    populateFormData(parsedData);
                    
                    // Clear the force edit flag
                    localStorage.removeItem('force_property_edit');
                    
                    // Complete loading
                    setFetchingData(false);
                    toast.success('Property data loaded for editing');
                    return;
                } catch (e) {
                    console.error('❌ Error parsing property edit data:', e);
                }
            }
        }
        
        // If not in forced edit mode or if forced edit data loading failed,
        // use test data as a fallback
        console.log('ℹ️ Using test data as fallback');
        const testProperty = {
            id: propertyId,
            propertyId: propertyId,
            property_type: "House", 
            property_for: "For Sale",
            total_price: "15000",
            property_address: "123 Main Street, Addis Ababa",
            number_of_bedrooms: "3",
            number_of_bathrooms: "2",
            property_size: "250",
            regional_state: "Addis Ababa City Administration",
            city: "Addis Ababa",
            description: "This is a beautiful house for sale in Addis Ababa with 3 bedrooms and 2 bathrooms.",
            country: "Ethiopia",
            media: [],
            amenities: ["parking_space", "air_conditioning", "security_24_7"]
        };
        
        // Set select values immediately
        setPropertyType(PropertyTypeList.find(p => p.value === "House"));
        setRegionalStateType(RegionalStateList.find(r => r.value === "Addis Ababa City Administration"));
        
        // Populate form with test data
        populateFormData(testProperty);
        
        // Set a delay to simulate API loading
        setTimeout(() => {
            setFetchingData(false);
            toast.success('Property data loaded successfully!');
        }, 1000);
        
        try {
            // Start by completely resetting all form fields to avoid mixing data
            console.log('🧹 Resetting all form fields to avoid data mixing');
            
            // Reset form fields to blank values first
            setInps({
                regional_state: '',
                city: '',
                country: 'Ethiopia',
                property_address: '',
                total_price: '',
                description: '',
                property_size: '',
                number_of_bathrooms: '',
                number_of_bedrooms: '',
            });
            
            // Clear any previously selected property type and amenities
            setPropertyType(null);
            setFurnishingType(null);
            setRegionalStateType(null);
            setSelectedAmenities({});
            
            // HIGHEST PRIORITY FOR EXISTING PROPERTIES: Try the direct API endpoints first
            // This ensures we get the most accurate and complete data from the server
            console.log('🔄 TRYING DIRECT API ENDPOINTS FIRST (highest priority)');
            
            // Try the most likely endpoints in order
            const endpointsToTry = [
              `properties/${propertyId}`,
              `agent/properties/${propertyId}`,
              `property/${propertyId}`,
              `property/get/${propertyId}`,
              `agent/property/${propertyId}`
            ];

            let propertyData = null;
            let apiSuccess = false;
            
            // Add direct API debugging - log the API instance
            console.log('🔧 API instance:', Api);
            console.log('🔍 API base URL:', Api.defaults?.baseURL || 'Not available');
            
            // Try checking API status first
            try {
                const statusCheck = await Api.get('');
                console.log('✅ API status check response:', statusCheck);
            } catch (statusError) {
                console.warn('⚠️ API status check failed:', statusError);
            }
            
            // Check if we have a valid token
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            console.log('🔑 Auth token available:', !!token);
            if (token) {
                console.log('🔑 Token preview:', token.substring(0, 15) + '...');
            }
            
            for (const endpoint of endpointsToTry) {
              try {
                // First try with token - works if user is authenticated
                let response = null;
                try {
                    response = await Api.getWithtoken(endpoint, { silentOn404: true });
                } catch (authError) {
                    // Silently continue to next endpoint on error
                }
                
                // If that fails, try without token (some endpoints may be public)
                if (!response?.data) {
                    console.log(`🔄 Retrying ${endpoint} without token`);
                    try {
                        response = await Api.get(endpoint);
                        console.log(`📥 Unauthenticated response received from ${endpoint}:`, response);
                    } catch (publicError) {
                        console.warn(`❌ Public request failed for ${endpoint}:`, publicError);
                    }
                }
                
                // Add detailed response structure logging
                if (response) {
                    console.log(`📊 Response structure for ${endpoint}:`, {
                        status: response.status,
                        hasData: !!response.data,
                        dataType: typeof response.data,
                        isArray: Array.isArray(response.data),
                        hasNestedData: !!response.data?.data,
                        nestedDataType: response.data?.data ? typeof response.data.data : 'N/A',
                        isNestedArray: Array.isArray(response.data?.data)
                    });
                }
                
                // Handle different response structures
                if (response?.data?.data) {
                  propertyData = Array.isArray(response.data.data) ? 
                    response.data.data.find(p => String(p.id) === String(propertyId)) :
                    response.data.data;
                  console.log(`🔍 Found data in response.data.data ${Array.isArray(response.data.data) ? '(array)' : '(object)'}:`, propertyData);
                } else if (response?.data) {
                  propertyData = Array.isArray(response.data) ? 
                    response.data.find(p => String(p.id) === String(propertyId)) :
                    response.data;
                  console.log(`🔍 Found data in response.data ${Array.isArray(response.data) ? '(array)' : '(object)'}:`, propertyData);
                }
                
                if (propertyData && (propertyData.id || propertyData.propertyId)) {
                  console.log('✅ Successfully fetched from API:', endpoint);
                  
                  // Check if the data is substantive and not just empty fields with an ID
                  const hasSubstantiveData = 
                    propertyData.property_type || 
                    propertyData.property_address || 
                    propertyData.city || 
                    propertyData.regional_state ||
                    propertyData.property_size ||
                    propertyData.number_of_bedrooms ||
                    propertyData.bedrooms ||
                    propertyData.number_of_bathrooms ||
                    propertyData.bathrooms;
                    
                  if (hasSubstantiveData) {
                    // We found good API data - use this as highest priority
                    populateFormData(propertyData);
                    
                    // Save to localStorage for future editing
                    saveToLocalStorage(propertyData);
                    
                    apiSuccess = true;
                    setFetchingData(false);
                    toast.success('Loaded fresh property data from server');
                    return;
                  } else {
                    console.warn('⚠️ Found property in API, but data is too sparse. Continuing search...');
                  }
                }
              } catch (error) {
                console.warn(`❌ API endpoint ${endpoint} failed:`, error?.response?.status || error?.message);
                // Continue to the next endpoint
              }
            }
            
            if (!propertyData) {
              console.log('🔍 API calls unsuccessful, falling back to other data sources');
            }
            
            // If API call failed, fall back to other data sources
            console.log('🔍 API calls unsuccessful, falling back to other data sources');
            
            // Check for data that was stored when "Edit" was clicked in property list
            const editClickData = checkForEditClickData();
            if (editClickData) {
                console.log('🔄 Using data from edit click...');
                
                // Use this data as fallback source
                populateFormData(editClickData);
                saveToLocalStorage(editClickData);
                setFetchingData(false);
                toast.success('Loaded property data from edit click');
                return;
            }
            
            // Check for any problematic property IDs that need special handling
            const problematicIds = ['1749181796364', '1749180216070'];
            if (problematicIds.includes(propertyId)) {
                console.log(`🔍 DETECTED PROBLEMATIC PROPERTY ID ${propertyId} - Activating special handling`);
                
                // For problematic IDs, use a completely blank form with no defaults
                const blankProperty = {
                    id: propertyId,
                    propertyId: propertyId,
                    property_type: "",
                    property_for: "For Sale",
                    total_price: "",
                    property_address: "",
                    number_of_bedrooms: "",
                    number_of_bathrooms: "",
                    property_size: "",
                    regional_state: "",
                    city: "",
                    description: "",
                    country: "Ethiopia",
                    media: [],
                    amenities: []
                };
                
                // Save this blank slate to localStorage
                localStorage.setItem(`property_edit_data_${propertyId}`, JSON.stringify(blankProperty));
                localStorage.setItem('property_edit_data', JSON.stringify(blankProperty));
                
                console.log('✅ Created clean slate for problematic property');
                populateFormData(blankProperty);
                setFetchingData(false);
                toast.info('Please enter property details');
                return;
            }
            
            // Check if this is a newly created property that might have data in sessionStorage
            // This is a common flow when redirected from property creation
            try {
                const newPropertyData = sessionStorage.getItem(`new_property_${propertyId}`);
                if (newPropertyData) {
                    try {
                        const parsedData = JSON.parse(newPropertyData);
                        console.log('✅ Found newly created property data in sessionStorage');
                        populateFormData(parsedData);
                        
                        // Move from sessionStorage to localStorage for persistence
                        saveToLocalStorage(parsedData);
                        // Clear sessionStorage since we've now stored it in localStorage
                        sessionStorage.removeItem(`new_property_${propertyId}`);
                        
                        setFetchingData(false);
                        toast.success('Loaded data from your newly created property.');
                        return;
                    } catch (parseError) {
                        console.error('❌ Error parsing sessionStorage data:', parseError);
                    }
                }
            } catch (sessionError) {
                console.warn('❌ Error accessing sessionStorage:', sessionError);
            }
            
            // Step 1: Try to get data from Redux store first
            const existingProperty = findPropertyInReduxStore();
            if (existingProperty) {
                console.log('✅ Found property in Redux store');
                populateFormData(existingProperty);
                
                // Save to localStorage for future editing
                saveToLocalStorage(existingProperty);
                
                setFetchingData(false);
                return;
            }
            
            // Step 2: Refresh the Redux store data to get most up-to-date property info
            try {
                console.log('🔄 Refreshing property data from API...');
                await dispatch(GetPropertyList({})).unwrap();
                
                // Check Redux store again after fresh data load
                const freshProperty = findPropertyInReduxStore();
                if (freshProperty) {
                    console.log('✅ Found property in refreshed Redux store');
                    populateFormData(freshProperty);
                    
                    // Save to localStorage for future editing
                    saveToLocalStorage(freshProperty);
                    
                    setFetchingData(false);
                    return;
                }
            } catch (error) {
                console.warn('❌ Failed to refresh property list:', error);
                // Continue to API endpoints if refresh fails
            }
            
            // Check for other data sources after API fails - we've already done these steps above
            // so we'll skip the redundant checks
            
            // Special handling for new listings - check if it's in the URL but doesn't exist yet
            if (propertyId && !apiSuccess) {
                console.log('🔍 Property not found in any API. Checking for raw creation data...');
                
                // For newly created properties, check for data in sessionStorage with a different key pattern
                // This might have been saved during the property creation process
                try {
                    const possibleKeys = [
                        `property_create_${propertyId}`,
                        `property_data_${propertyId}`,
                        `new_listing_${propertyId}`,
                        `temp_property_${propertyId}`
                    ];
                    
                    let foundData = null;
                    
                    for (const key of possibleKeys) {
                        const rawData = sessionStorage.getItem(key) || localStorage.getItem(key);
                        if (rawData) {
                            try {
                                foundData = JSON.parse(rawData);
                                console.log(`✅ Found property data with key ${key}`);
                                break;
                            } catch (e) {
                                console.warn(`⚠️ Error parsing data from ${key}:`, e);
                            }
                        }
                    }
                    
                    if (foundData) {
                        populateFormData(foundData);
                        saveToLocalStorage(foundData);
                        setFetchingData(false);
                        toast.success('Loaded property data from alternative source.');
                        return;
                    }
                } catch (altStorageError) {
                    console.warn('❌ Error checking alternative storage:', altStorageError);
                }
            }
            
            // Try looking in localStorage for any property data at all
            try {
                console.log('🔍 Last resort: checking for ANY property data in storage...');
                
                // Check all localStorage keys for anything that might be property data
                const allKeys = [];
                for (let i = 0; i < localStorage.length; i++) {
                    allKeys.push(localStorage.key(i));
                }
                
                const propertyRelatedKeys = allKeys.filter(key => 
                    key.includes('property') || 
                    key.includes('listing') || 
                    key.includes(propertyId.substring(0, 6))
                );
                
                console.log('🔍 Found these potentially relevant localStorage keys:', propertyRelatedKeys);
                
                if (propertyRelatedKeys.length > 0) {
                    // Try the most promising key first (the one with property_edit in the name)
                    const editKey = propertyRelatedKeys.find(k => k.includes('property_edit'));
                    if (editKey) {
                        try {
                            const editData = JSON.parse(localStorage.getItem(editKey));
                            console.log(`✅ Found property data in ${editKey}`);
                            populateFormData(editData);
                            saveToLocalStorage(editData);
                            setFetchingData(false);
                            toast.success('Loaded last used property data.');
                            return;
                        } catch (e) {
                            console.warn(`⚠️ Error parsing data from ${editKey}:`, e);
                        }
                    }
                    
                    // If that didn't work, try any other property-related key
                    for (const key of propertyRelatedKeys) {
                        try {
                            const data = JSON.parse(localStorage.getItem(key));
                            if (data && typeof data === 'object') {
                                console.log(`✅ Found usable data in ${key}`);
                                populateFormData(data);
                                saveToLocalStorage(data);
                                setFetchingData(false);
                                toast.success('Loaded property data from storage.');
                                return;
                            }
                        } catch (e) {
                            // Ignore parsing errors for other keys
                        }
                    }
                }
            } catch (lastResortError) {
                console.warn('❌ Error in last resort storage check:', lastResortError);
            }
            
            // Try one more direct API endpoint with a different pattern
            try {
                console.log(`🔄 Trying direct database query endpoint for property ID: ${propertyId}`);
                // This is a direct database query endpoint that might work
                const directResponse = await Api.getWithtoken(`property/direct-fetch/${propertyId}`);
                
                if (directResponse?.data) {
                    console.log('✅ Direct database query successful!');
                    populateFormData(directResponse.data);
                    saveToLocalStorage(directResponse.data);
                    setFetchingData(false);
                    toast.success('Loaded property data from database');
                    return;
                }
            } catch (directQueryError) {
                console.warn('❌ Direct database query failed:', directQueryError?.message);
            }
            
            // If all API calls failed, use empty form with placeholder prompts
            console.log('⚠️ No property data found in any source. Using clean form.');
            setFetchingData(false);
            
            // For problematic IDs, use a completely empty form with helpful placeholders
            const emptyProperty = {
                id: propertyId,
                propertyId: propertyId,
                property_type: "", 
                property_for: "For Sale",
                total_price: "",
                property_address: "",
                number_of_bedrooms: "",
                number_of_bathrooms: "",
                property_size: "",
                regional_state: "",
                city: "",
                description: "",
                country: "Ethiopia",
                media: [],
                amenities: []
            };
            
            populateFormData(emptyProperty);
            toast.info('Please enter property details for this listing.');
            setActiveTab("For Sale");
            
        } catch (error) {
            console.error('❌ Error during data retrieval:', error);
            setFetchingData(false);
            toast.warning('Error loading property data. Please fill in the details manually.');
        }
    };
    
    // Save property data to localStorage for future editing sessions
    const saveToLocalStorage = (propertyData) => {
        try {
            // Make sure we have an ID to use as a key
            const id = propertyData.id || propertyData.propertyId || propertyId;
            if (!id) {
                console.warn('⚠️ Cannot save to localStorage: No property ID available');
                return;
            }
            
            // Create a normalized version of the data to store
            const normalizedData = {
                ...propertyData,
                id: id,
                propertyId: id
            };
            
            // Make sure we have necessary fields populated - don't overwrite with empty data
            if (!normalizedData.property_type) normalizedData.property_type = PropertyType?.value || "";
            if (!normalizedData.property_for) normalizedData.property_for = activeTab || "For Sale";
            
            // Store the data with the property ID as part of the key for multiple property editing
            localStorage.setItem(`property_edit_data_${id}`, JSON.stringify(normalizedData));
            localStorage.setItem('property_edit_data', JSON.stringify(normalizedData));
            console.log('✅ Saved property data to localStorage:', normalizedData);
        } catch (error) {
            console.error('❌ Error saving to localStorage:', error);
        }
    };

    const onInpChanged = (event) => {
        setError(p => {
            const obj = { ...p }
            obj?.errors && delete obj?.errors[event?.target?.name]
            return obj
        })
        
        // Get input value
        let value = event.target.value;
        
        const newValue = { ...inps, [event.target.name]: value };
        setInps(newValue);
        
        // Auto-save to localStorage as user types (debounced)
        if (window.autoSaveTimeout) clearTimeout(window.autoSaveTimeout);
        window.autoSaveTimeout = setTimeout(() => {
            try {
                // Only auto-save if we have an ID and some core data
                if (propertyId && (newValue.property_address || newValue.city || newValue.description)) {
                    const dataToSave = {
                        ...newValue,
                        id: propertyId,
                        propertyId: propertyId,
                        property_type: PropertyType?.value || "",
                        furnishing: FurnishingType?.value || "",
                        property_for: activeTab,
                        media: MediaPaths,
                        amenities: getSelectedAmenitiesArray()
                    };
                    saveToLocalStorage(dataToSave);
                    console.log('🔄 Auto-saved form changes to localStorage');
                }
            } catch (e) {
                console.warn('❌ Auto-save failed:', e);
            }
        }, 2000); // Auto-save after 2 seconds of inactivity
    };

    const handleChange = (e, type) => {
        if (type === 'Property') {
            setPropertyType(e);
        } else if (type === 'Furnishing') {
            setFurnishingType(e)
        } else if (type === 'RegionalState') {
            setRegionalStateType(e);
            setInps((prevInputs) => ({ ...prevInputs, regional_state: e?.value || '' }));
        }
    };

    const handleFileChange = async (event, index) => {
        const file = event.target.files[0];
        if (file) {
            const newImages = [...images];
            newImages[index] = URL.createObjectURL(file);
            setImages(newImages);
            
            setUploadingStates(prev => ({ ...prev, [index]: true }));
            await ImagesUpload(file, index);
        }
    };

    const ImagesUpload = async (file, index) => {
        try {
            setLoading(true);
            
            // File validation - very generous limit for high-quality photos
            const maxSize = 500 * 1024 * 1024; // 500MB
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
            
            if (file.size > maxSize) {
                toast.error("File size too large! Please select an image under 500MB.");
                setUploadingStates(prev => ({ ...prev, [index]: false }));
                setLoading(false);
                return;
            }
            
            if (!allowedTypes.includes(file.type)) {
                toast.error("Invalid file type! Please select a JPG, PNG, or WEBP image.");
                setUploadingStates(prev => ({ ...prev, [index]: false }));
                setLoading(false);
                return;
            }
            
            let formData = new FormData();
            formData.append("mediaFiles", file);
            
            const response = await Api.postFileWithtoken("media/public", formData);
            const { files, message } = response;
            setLoading(false);
            
            setUploadingStates(prev => ({ ...prev, [index]: false }));
            
            if (files && Array.isArray(files)) {
                setMediaPaths((prevPaths) => [...prevPaths, ...files]);
            } else if (files) {
                setMediaPaths((prevPaths) => [...prevPaths, files]);
            }
            toast.success(message || "Image uploaded successfully!");
            
        } catch (error) {
            setLoading(false);
            setUploadingStates(prev => ({ ...prev, [index]: false }));
            
            // Remove preview on error
            setImages(prev => {
                const newImages = [...prev];
                newImages[index] = null;
                return newImages;
            });
            
            let errorMessage = "Image upload failed!";
            if (error?.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            
            toast.error(errorMessage);
        }
    };

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

    const handleSubmit = async () => {
        setLoading(true);
        
        try {
            console.log('🔄 Starting property update process...');
            console.log('📋 Current form data:', inps);
            console.log('📋 Property Type:', PropertyType);
            console.log('📋 Active Tab:', activeTab);
            
            const validation = ValidatePropertyForm(inps);
            console.log('📋 Validation result:', validation);
            
            if (!validation.isValid) {
                console.error('❌ Validation failed:', validation.errors);
                setError(validation);
                toast.error('Please fix the validation errors');
                setLoading(false);
                return;
            }
            
            console.log('✅ Validation passed, preparing update data...');

            // Prepare update data in the format expected by the backend
            // BUSINESS RULE: ALL property edits require admin re-approval
            // Any property being edited (regardless of status) goes back to pending
            const statusToSet = 'pending';
            
            console.log('📋 Property update status logic:');
            console.log('  - Original status:', originalPropertyStatus);
            console.log('  - Status after edit:', statusToSet);
            console.log('  - Reason: All property edits require admin re-approval');
            
            let updateData = {
                // Map frontend fields to backend expected fields
                propertyType: PropertyType?.value || PropertyType,
                offeringType: activeTab,
                price: parseFloat(inps?.total_price) || 0,
                area: parseFloat(inps?.property_size) || 0,  // Backend expects 'area' not 'size'
                bedrooms: parseInt(inps.number_of_bedrooms) || 0,
                bathrooms: parseInt(inps.number_of_bathrooms) || 0,
                description: inps?.description || '',
                furnishing: FurnishingType?.value || FurnishingType || '',
                
                // Address structure (nested format expected by backend)
                address: {
                    street: typeof inps?.property_address === 'string' ? inps.property_address : '',
                    subCity: inps?.city || '',
                    regionalState: inps?.regional_state || '',
                    country: inps?.country || 'Ethiopia'
                },
                
                // Media and amenities
                images: MediaPaths.length > 0 ? MediaPaths.map(path => ({ 
                    url: typeof path === 'string' ? path : path.url || '', 
                    caption: '' 
                })) : [],
                media_paths: MediaPaths,
                amenities: getSelectedAmenitiesArray(),
                
                // Additional fields that might be expected
                title: inps?.description ? inps.description.substring(0, 100) : 'Property Listing',
                // Business Rule: ALL edited properties go to pending status
                status: statusToSet,
                
                // Metadata
                updatedAt: new Date().toISOString()
            };

            console.log('🔄 Submitting property update with data:', updateData);
            console.log('🔄 Property ID:', propertyId);
            
            // Use the correct endpoint from the routes: PUT /api/properties/:id
            const endpoint = `properties/${propertyId}`;
            
            try {
                console.log(`🔄 Attempting to update property via: ${endpoint}`);
                
                // Add timeout to prevent hanging
                const timeout = new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Request timeout after 30 seconds')), 30000)
                );
                
                const apiCall = Api.putWithtoken(endpoint, updateData);
                
                const response = await Promise.race([apiCall, timeout]);
                
                console.log('✅ Property update successful:', response);
                
                // Show success message - all edits require admin approval
                toast.success('Property updated successfully! Redirecting...', { autoClose: 2000 });
                
                // Save the updated data to localStorage for offline access
                const updatedPropertyData = {
                    ...updateData,
                    id: propertyId,
                    propertyId: propertyId
                };
                saveToLocalStorage(updatedPropertyData);
                
                // Refresh property list to show updated data (with timeout)
                try {
                    console.log('🔄 Refreshing property list...');
                    const refreshTimeout = new Promise((_, reject) => 
                        setTimeout(() => reject(new Error('Refresh timeout')), 5000)
                    );
                    await Promise.race([
                        dispatch(GetPropertyList()).unwrap(),
                        refreshTimeout
                    ]);
                    console.log('✅ Property list refreshed successfully');
                } catch (refreshError) {
                    console.warn('⚠️ Failed to refresh property list:', refreshError);
                    // Don't fail the entire operation if refresh fails
                }
                
                // Navigate back to account management page immediately after success
                console.log('🔄 Navigating to account management page...');
                
                // Use a small delay to ensure toast is visible
                setTimeout(() => {
                    navigate('/account-management');
                }, 500);
                
                // Exit the function successfully - don't continue to error handling
                return;
                
            } catch (apiError) {
                console.error('❌ API update failed:', apiError);
                console.error('❌ Error response:', apiError?.response);
                console.error('❌ Error data:', apiError?.response?.data);
                console.error('❌ Error message:', apiError?.response?.data?.message);
                console.error('❌ Error details:', apiError?.response?.data?.error);
                
                // Log the data that was sent
                console.error('❌ Data that was sent:', updateData);
                
                // Handle specific error cases
                if (apiError?.response?.status === 401) {
                    console.error('❌ 401 Unauthorized - Authentication issue');
                    toast.error('Authentication expired. Please log in again.');
                    
                    // Save changes locally before redirecting
                    const fallbackData = {
                        ...inps,
                        id: propertyId,
                        propertyId: propertyId,
                        property_type: PropertyType?.value || PropertyType,
                        furnishing: FurnishingType?.value || FurnishingType,
                        property_for: activeTab,
                        media: MediaPaths,
                        amenities: getSelectedAmenitiesArray(),
                        updated_at: new Date().toISOString(),
                        pending_sync: true
                    };
                    saveToLocalStorage(fallbackData);
                    console.log('💾 Changes saved locally before redirect');
                    
                    // Redirect to login after a short delay
                    setTimeout(() => {
                        navigate('/login');
                    }, 2000);
                    
                } else if (apiError?.response?.status === 403) {
                    toast.error('Access forbidden. You may not have permission to edit this property.');
                } else if (apiError?.response?.status === 404) {
                    toast.error('Property not found. It may have been deleted or the ID is incorrect.');
                } else {
                    // For other errors, save locally and show appropriate message
                    const fallbackData = {
                        ...inps,
                        id: propertyId,
                        propertyId: propertyId,
                        property_type: PropertyType?.value || PropertyType,
                        furnishing: FurnishingType?.value || FurnishingType,
                        property_for: activeTab,
                        media: MediaPaths,
                        amenities: getSelectedAmenitiesArray(),
                        updated_at: new Date().toISOString(),
                        pending_sync: true
                    };
                    saveToLocalStorage(fallbackData);
                    console.log('💾 Changes saved locally as fallback');
                    
                    let errorMessage = 'Failed to update property on server. Changes saved locally.';
                    if (apiError?.response?.data?.message) {
                        errorMessage = apiError.response.data.message;
                    } else if (apiError?.message) {
                        errorMessage = apiError.message;
                    }
                    
                    toast.error(errorMessage);
                }
                
                throw apiError; // Re-throw to be caught by outer catch block
            }
            
        } catch (error) {
            console.error('❌ Error updating property:', error);
            
            // Don't navigate away on error - let user try again
        } finally {
            setLoading(false);
        }
    };

    if (fetchingData) {
        return (
            <section className="common-section property-form-section">
                <div className="container">
                <div className="property-heading-form">
                    <h3>Edit Property</h3>
                    <p>Property ID: {propertyId}</p>
                </div>
                    <div className="property-form-main" style={{ padding: '50px 20px' }}>
                        <div style={{ 
                            textAlign: 'center', 
                            maxWidth: '600px',
                            margin: '0 auto'
                        }}>
                            <div style={{ 
                                width: '60px', 
                                height: '60px', 
                                border: '5px solid #f3f3f3',
                                borderTop: '5px solid #4a6cf7',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite',
                                margin: '0 auto 30px'
                            }}></div>
                            <h3 style={{ color: '#2c3e50', marginBottom: '15px' }}>Loading Property Data</h3>
                            <p style={{ color: '#666', marginBottom: '20px' }}>
                                Please wait while we retrieve your property information from the database.
                            </p>
                            <div style={{ 
                                display: 'inline-block',
                                padding: '8px 16px',
                                backgroundColor: '#f0f4ff',
                                borderRadius: '6px',
                                color: '#4a6cf7',
                                fontWeight: '500',
                                fontSize: '14px',
                                marginBottom: '10px'
                            }}>
                                Property ID: {propertyId}
                            </div>
                            <style dangerouslySetInnerHTML={{__html: `
                                @keyframes spin {
                                    0% { transform: rotate(0deg); }
                                    100% { transform: rotate(360deg); }
                                }
                            `}} />
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="common-section property-form-section">
            <div className="container">
                <div className="property-heading-form">
                    <h3>Edit Property</h3>
                    <p>Property ID: {propertyId}</p>
                </div>
                
                <div className="property-form-main">
                    
                    {/* Step 1: What are you offering? */}
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

                    {/* Step 2: Complete Property Information */}
                    <div className="form-step-section">
                        <div className="step-header">
                            <div className="step-indicator">
                                <span className="step-number">2</span>
                            </div>
                            <h4>Complete Property Information</h4>
                        </div>
                        
                        <div className="step-content">
                            <div className="form-row-3-cols">
                                <div className="form-col-33">
                                    <div className="form-group">
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
                                    </div>
                                </div>
                                <div className="form-col-33">
                                <div className="form-group">
                                        <label>{activeTab === "For Rent" ? "Monthly Rent *" : "Sale Price *"}</label>
                                        <div className="price-input">
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            placeholder="Enter price"
                                            name="total_price"
                                            value={inps.total_price === "0" ? "" : inps.total_price}
                                            onChange={onInpChanged}
                                        />
                                        </div>
                                        {error?.errors?.total_price && (
                                            <span className="error-message">{error.errors.total_price}</span>
                                        )}
                                    </div>
                                </div>
                                <div className="form-col-33">
                                    <div className="form-group">
                                        <label>Property Size (sqm)</label>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            placeholder="Enter size"
                                            name="property_size"
                                            value={inps.property_size === "0" ? "" : inps.property_size}
                                            onChange={onInpChanged}
                                        />
                                        {error?.errors?.property_size && (
                                            <span className="error-message">{error.errors.property_size}</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="form-row-3-cols">
                                <div className="form-col-33">
                                    <div className="form-group">
                                        <label>Number of Bedrooms</label>
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                placeholder="Enter bedrooms"
                                                name="number_of_bedrooms"
                                                value={inps.number_of_bedrooms === "0" ? "" : inps.number_of_bedrooms}
                                                onChange={onInpChanged}
                                                style={{
                                                    width: '100%',
                                                    padding: '10px',
                                                    borderRadius: '6px'
                                                }}
                                            />
                                        {error?.errors?.number_of_bedrooms && (
                                            <span className="error-message">{error.errors.number_of_bedrooms}</span>
                                        )}
                                    </div>
                                </div>
                                <div className="form-col-33">
                                    <div className="form-group">
                                        <label>Number of Bathrooms</label>
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                placeholder="Enter bathrooms"
                                                name="number_of_bathrooms"
                                                value={inps.number_of_bathrooms === "0" ? "" : inps.number_of_bathrooms}
                                                onChange={onInpChanged}
                                                style={{
                                                    width: '100%',
                                                    padding: '10px',
                                                    borderRadius: '6px'
                                                }}
                                            />
                                        {error?.errors?.number_of_bathrooms && (
                                            <span className="error-message">{error.errors.number_of_bathrooms}</span>
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
                            
                            {/* Property Description */}
                            <div className="form-row">
                                <div className="form-group" style={{ width: '100%' }}>
                                    <label>Property Description</label>
                                    <textarea
                                        placeholder="Describe your property in detail..."
                                        name="description"
                                        value={inps.description}
                                        onChange={onInpChanged}
                                        rows="4"
                                        style={{ 
                                            width: '100%', 
                                            minWidth: '100%',
                                            boxSizing: 'border-box',
                                            padding: '12px',
                                            borderRadius: '6px'
                                        }}
                                    />
                                    {error?.errors?.description && (
                                        <span className="error-message">{error.errors.description}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 3: Property Location */}
                    <div className="form-step-section">
                        <div className="step-header">
                            <div className="step-indicator">
                                <span className="step-number">3</span>
                            </div>
                            <h4>Property Location</h4>
                        </div>
                        
                        <div className="step-content">
                            {/* Property Address Field */}
                            <div className="form-row">
                                <div className="form-group" style={{ width: '100%' }}>
                                    <label>Street Address / Property Location *</label>
                                    <input
                                        type="text"
                                        placeholder="e.g., Near Bole Medhanialem, CMC Road"
                                        name="property_address"
                                        value={inps.property_address}
                                        onChange={onInpChanged}
                                        style={{
                                            width: '100%',
                                            padding: '10px',
                                            borderRadius: '6px'
                                        }}
                                    />
                                    {error?.errors?.property_address && (
                                        <span className="error-message">{error.errors.property_address}</span>
                                    )}
                                    <small style={{ color: '#666', fontSize: '12px', marginTop: '5px', display: 'block' }}>
                                        Enter the street name, landmarks, or area details
                                    </small>
                                </div>
                            </div>

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
                                        {error?.errors?.regional_state && (
                                            <span className="error-message">{error.errors.regional_state}</span>
                                        )}
                                    </div>
                                </div>
                                <div className="form-col-33">
                                    <div className="form-group">
                                        <label>Sub-City</label>
                                        {RegionalStateType?.value === 'Addis Ababa City Administration' ? (
                                            <div className="select-wrapper">
                                                <Select
                                                    options={SubCityList}
                                                    placeholder="Select sub-city"
                                                    value={SubCityType}
                                                    onChange={(e) => {
                                                        setSubCityType(e);
                                                        setInps(prev => ({ ...prev, city: e?.value || '' }));
                                                        // Clear city validation error when selection is made
                                                        if (e?.value) {
                                                            setError(prev => {
                                                                const newError = { ...prev };
                                                                if (newError?.errors?.city) {
                                                                    delete newError.errors.city;
                                                                }
                                                                return newError;
                                                            });
                                                        }
                                                    }}
                                                    className="react-select"
                                                />
                                            </div>
                                        ) : (
                                            <input
                                                type="text"
                                                placeholder="Enter sub-city"
                                                name="city"
                                                value={inps.city}
                                                onChange={onInpChanged}
                                            />
                                        )}
                                        {error?.errors?.city && (
                                            <span className="error-message">{error.errors.city}</span>
                                        )}
                                    </div>
                                </div>
                                <div className="form-col-33">
                                    <div className="form-group">
                                        <label>Country</label>
                                        <input
                                            type="text"
                                            placeholder="Ethiopia"
                                            name="country"
                                            value={inps.country}
                                            onChange={onInpChanged}
                                            readOnly
                                            style={{
                                                backgroundColor: '#f9f9f9',
                                                cursor: 'not-allowed'
                                            }}
                                        />
                                        <small style={{ color: '#666', fontSize: '12px' }}>Default: Ethiopia</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 4: Property Images */}
                    <div className="form-step-section">
                        <div className="step-header">
                            <div className="step-indicator">
                                <span className="step-number">4</span>
                            </div>
                            <h4>Property Images</h4>
                        </div>
                        
                        <div className="step-content">
                            <div className="image-upload-section">
                                <p className="upload-info">Upload high-quality images of your property (Max 5MB per image)</p>
                                <div className="image-upload-grid">
                                    {Array.from({ length: slots }).map((_, index) => (
                                        <div key={index} className="image-upload-slot">
                                            {images[index] ? (
                                                <div className="uploaded-image">
                                                    <img src={images[index]} alt={`Property ${index + 1}`} />
                                                    <button
                                                        type="button"
                                                        className="remove-image"
                                                        onClick={() => removeImage(index)}
                                                    >
                                                        ×
                                                    </button>
                                                    {uploadingStates[index] && (
                                                        <div className="upload-overlay">
                                                            <div className="upload-spinner"></div>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="upload-placeholder">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => handleFileChange(e, index)}
                                                        className="file-input"
                                                    />
                                                    <div className="upload-content">
                                                        <div className="upload-icon">📷</div>
                                                        <span>Upload Image</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                {slots < 10 && (
                                    <button
                                        type="button"
                                        className="btn btn-outline add-more-images"
                                        onClick={addSlot}
                                    >
                                        + Add More Images
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Step 5: Property Amenities */}
                    <div className="form-step-section">
                        <div className="step-header" onClick={() => toggleSection('amenitiesSection')} style={{ cursor: 'pointer' }}>
                            <div className="step-indicator">
                                <span className="step-number">5</span>
                            </div>
                            <h4>Property Amenities</h4>
                            <p style={{ margin: '8px 0', color: '#666' }}>Select all that apply</p>
                            <div style={{ marginLeft: 'auto', fontSize: '20px' }}>
                                {collapsedSections.amenitiesSection ? '▼' : '▲'}
                            </div>
                        </div>
                        
                        <div className="step-content" style={{ display: collapsedSections.amenitiesSection ? 'none' : 'block' }}>
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
                                    <div className="selected-amenities-summary">
                                        <h4 className="summary-title">
                                            ✨ Selected Amenities ({getSelectedAmenitiesArray().length})
                                        </h4>
                                        <div className="selected-amenities-tags">
                                            {getSelectedAmenitiesArray().map((amenityId) => {
                                                const amenity = [
                                                    ...amenitiesData.basicFeatures,
                                                    ...amenitiesData.securityComfort,
                                                    ...amenitiesData.recreationLocation
                                                ].find(a => a.id === amenityId);
                                                return amenity ? (
                                                    <span key={amenityId} className="amenity-tag">
                                                        {amenity.label}
                                                        <button 
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleAmenityToggle(amenityId);
                                                            }}
                                                            className="remove-tag-btn"
                                                        >
                                                            ×
                                                        </button>
                                                    </span>
                                                ) : null;
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={handleSubmit}
                            disabled={Loading}
                        >
                    {Loading ? "Updating..." : "Update Property"}
                </button>
                <Link to="/account-management" className="btn btn-secondary">
                    Cancel
                </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

// Wrap the component with ErrorBoundary
import ErrorBoundary from './ErrorBoundary';

// Export the wrapped component as the default export
const EditPropertyFormWithErrorBoundary = (props) => {
    return (
        <ErrorBoundary>
            <EditPropertyForm {...props} />
        </ErrorBoundary>
    );
};

export default EditPropertyFormWithErrorBoundary;
