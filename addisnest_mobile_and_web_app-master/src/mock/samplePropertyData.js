// Sample property data with "About Place" fields for testing
export const sampleProperty = {
  _id: "65f3b2c8e1e5f23a4c98d7b6",
  title: "ETB 5626262",
  description: "This beautiful apartment offers modern living with stunning views of the city. The open floor plan provides ample natural light throughout the day. The kitchen is equipped with stainless steel appliances and granite countertops. The master bedroom includes a spacious walk-in closet and en-suite bathroom. The property is conveniently located near shopping centers, restaurants, and public transportation.",
  address: "106250 Meredith dr Apt#8",
  status: "active",
  is_paid: true,
  propertyType: "apartment",
  propertyFor: "sale",
  price: {
    amount: 5626262,
    currency: "ETB",
    period: "one-time"
  },
  location: {
    address: "106250 Meredith dr Apt#8",
    city: "Addis Ababa",
    state: "Central",
    country: "Ethiopia",
    coordinates: {
      latitude: 9.0222,
      longitude: 38.7468
    },
    neighborhood: "Bole"
  },
  specifications: {
    bedrooms: 3,
    bathrooms: 2,
    area: {
      size: 120,
      unit: "sqm"
    },
    lotSize: {
      size: 250,
      unit: "sqm"
    },
    yearBuilt: 2019,
    floors: 1,
    parking: 1
  },
  // New fields for About Place section
  lot_size: 250,
  price_per_sqm: 46885,
  year_built: 2019,
  has_heating: true,
  has_parking: true,
  payment_id: "65f3b2d9e1e5f23a4c98d7b7",
  posted_date: "2023-12-15T08:30:00.000Z",
  // Other existing fields
  features: {
    amenities: [
      "parking-space", 
      "balcony-terrace", 
      "air-conditioning", 
      "heating"
    ],
    utilities: {
      electricity: true,
      water: true,
      gas: false,
      internet: true,
      cable: true
    },
    condition: "excellent",
    furnishingStatus: "semi-furnished"
  },
  media: [
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1470&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1470&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1470&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=1470&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1576941089067-2de3c901e126?q=80&w=1578&auto=format&fit=crop"
  ],
  agent: {
    _id: "65f3b2a8e1e5f23a4c98d7b5",
    firstName: "Samuel",
    lastName: "Tekle",
    email: "samuel.tekle@example.com",
    phone: "+251912345678",
    avatar: "https://randomuser.me/api/portraits/men/22.jpg"
  },
  views: 42,
  createdAt: "2023-12-15T08:30:00.000Z",
  updatedAt: "2023-12-16T10:15:00.000Z"
};

// Sample for a property that shouldn't show the About Place section
export const unpaidProperty = {
  ...sampleProperty,
  _id: "65f3b2c8e1e5f23a4c98d7b7",
  is_paid: false,
  status: "draft"
};

export default sampleProperty;
