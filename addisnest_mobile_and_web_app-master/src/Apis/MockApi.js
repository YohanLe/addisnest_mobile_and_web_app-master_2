// Mock API implementation for demo purposes
import mockProperties from './mockData/properties';
import mockAgents from './mockData/agents';
import mockUser from './mockData/user';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class MockApi {
  constructor() {
    this.properties = [...mockProperties];
    this.agents = [...mockAgents];
    this.user = {...mockUser};
    this.isAuthenticated = false;
    this.token = null;
  }

  // Auth methods
  async login(credentials) {
    await delay(800);
    if (credentials.email === 'demo@addinest.com' && credentials.password === 'demo123') {
      this.isAuthenticated = true;
      this.token = 'mock-jwt-token-for-demo-purposes';
      localStorage.setItem('addisnest_token', this.token);
      localStorage.setItem('isLogin', '1');
      return {
        success: true,
        token: this.token,
        user: this.user
      };
    }
    throw new Error('Invalid credentials');
  }

  async logout() {
    await delay(300);
    this.isAuthenticated = false;
    this.token = null;
    localStorage.removeItem('addisnest_token');
    localStorage.removeItem('isLogin');
    return { success: true };
  }

  // Property methods
  async getProperties(filters = {}) {
    await delay(600);
    let filteredProperties = [...this.properties];
    
    if (filters.type) {
      filteredProperties = filteredProperties.filter(p => p.propertyType === filters.type);
    }
    
    if (filters.minPrice) {
      filteredProperties = filteredProperties.filter(p => p.price >= filters.minPrice);
    }
    
    if (filters.maxPrice) {
      filteredProperties = filteredProperties.filter(p => p.price <= filters.maxPrice);
    }
    
    if (filters.location) {
      filteredProperties = filteredProperties.filter(p => 
        p.address.city.toLowerCase().includes(filters.location.toLowerCase()) ||
        p.address.state.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    
    return {
      success: true,
      data: filteredProperties,
      count: filteredProperties.length
    };
  }

  async getPropertyById(id) {
    await delay(500);
    const property = this.properties.find(p => p._id === id || p.id === id);
    
    if (!property) {
      throw new Error('Property not found');
    }
    
    return {
      success: true,
      data: property
    };
  }

  async getFeaturedProperties() {
    await delay(400);
    const featured = this.properties.filter(p => p.isFeatured);
    return {
      success: true,
      data: featured
    };
  }

  async submitProperty(propertyData) {
    await delay(1000);
    const newProperty = {
      ...propertyData,
      _id: 'mock-property-' + Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      owner: this.user._id
    };
    
    this.properties.push(newProperty);
    
    return {
      success: true,
      data: newProperty
    };
  }

  // Agent methods
  async getAgents(filters = {}) {
    await delay(500);
    let filteredAgents = [...this.agents];
    
    if (filters.region) {
      filteredAgents = filteredAgents.filter(a => 
        a.region.toLowerCase().includes(filters.region.toLowerCase())
      );
    }
    
    if (filters.specialization) {
      filteredAgents = filteredAgents.filter(a => 
        a.specialization.toLowerCase().includes(filters.specialization.toLowerCase())
      );
    }
    
    return {
      success: true,
      data: filteredAgents,
      count: filteredAgents.length
    };
  }

  async getAgentById(id) {
    await delay(400);
    const agent = this.agents.find(a => a._id === id || a.id === id);
    
    if (!agent) {
      throw new Error('Agent not found');
    }
    
    return {
      success: true,
      data: agent
    };
  }

  // User profile methods
  async getUserProfile() {
    await delay(300);
    if (!this.isAuthenticated) {
      throw new Error('Not authenticated');
    }
    
    return {
      success: true,
      data: this.user
    };
  }

  async updateUserProfile(userData) {
    await delay(600);
    if (!this.isAuthenticated) {
      throw new Error('Not authenticated');
    }
    
    this.user = {
      ...this.user,
      ...userData,
      updatedAt: new Date().toISOString()
    };
    
    return {
      success: true,
      data: this.user
    };
  }

  // Add convenience wrappers to match the API interface
  getPublic = async (endpoint) => {
    if (endpoint.includes('properties')) {
      return {
        data: await this.getProperties()
      };
    }
    if (endpoint.includes('agents')) {
      return {
        data: await this.getAgents()
      };
    }
    return { data: {} };
  }

  getWithtoken = async (endpoint) => {
    if (endpoint.includes('properties')) {
      const result = await this.getProperties();
      return result.data;
    }
    if (endpoint.includes('agents')) {
      const result = await this.getAgents();
      return result.data;
    }
    if (endpoint.includes('user/profile')) {
      const result = await this.getUserProfile();
      return result.data;
    }
    return {};
  }

  postWithtoken = async (endpoint, data) => {
    if (endpoint.includes('properties')) {
      const result = await this.submitProperty(data);
      return result.data;
    }
    if (endpoint.includes('user/profile')) {
      const result = await this.updateUserProfile(data);
      return result.data;
    }
    if (endpoint.includes('auth/login')) {
      return this.login(data);
    }
    if (endpoint.includes('auth/logout')) {
      return this.logout();
    }
    return {};
  }

  putWithtoken = async (endpoint, data) => {
    if (endpoint.includes('properties')) {
      // Mock updating a property
      await delay(700);
      return { success: true };
    }
    if (endpoint.includes('user/profile')) {
      const result = await this.updateUserProfile(data);
      return result.data;
    }
    return {};
  }

  deleteWithtoken = async (endpoint) => {
    await delay(500);
    return { success: true };
  }

  postFileWithtoken = async (endpoint, formData) => {
    await delay(1200);
    return { 
      success: true,
      fileUrl: 'https://picsum.photos/seed/addinest/800/600'
    };
  }
}

const mockApi = new MockApi();
export default mockApi;
