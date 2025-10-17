import React, { useState, useEffect } from 'react';
import Api from '../../Apis/Api';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [availableLocations, setAvailableLocations] = useState([
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
  ]);
  const [editingUser, setEditingUser] = useState(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'user',
    isVerified: false
  });

  useEffect(() => {
    fetchUsers();
  }, [currentPage, filter, locationFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Fetch users from the API
      const response = await Api.getWithtoken('users');
      
      console.log('API Response:', response);
      
      // Check if we have users data
      if (response) {
        // MongoDB returns the data directly, not nested in a data property
        let allUsers = Array.isArray(response) ? response : [];
        
        console.log('All users:', allUsers);
        
        // Apply role filter
        let filteredUsers = allUsers;
        if (filter !== 'all') {
          filteredUsers = allUsers.filter(user => 
            user.role && user.role.toLowerCase() === filter.toLowerCase()
          );
        }
        
        // Apply location filter if selected
        if (locationFilter !== 'all') {
          filteredUsers = filteredUsers.filter(user => 
            user.region === locationFilter
          );
        }
        
        // Apply search filter if present
        if (searchTerm) {
          const searchLower = searchTerm.toLowerCase();
          filteredUsers = filteredUsers.filter(user => 
            (user.firstName && user.firstName.toLowerCase().includes(searchLower)) ||
            (user.lastName && user.lastName.toLowerCase().includes(searchLower)) ||
            (user.email && user.email.toLowerCase().includes(searchLower))
          );
        }
        
        // Simple pagination
        const itemsPerPage = 10;
        const totalItems = filteredUsers.length;
        const calculatedTotalPages = Math.ceil(totalItems / itemsPerPage);
        
        setTotalPages(calculatedTotalPages || 1);
        
        // Get current page items
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
        
        setUsers(paginatedUsers);
      } else {
        // If no data is returned, set empty array
        setUsers([]);
        setTotalPages(1);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
      
      // Show error in UI instead of using mock data
      alert('Failed to fetch users. Please try again later.');
      setUsers([]);
      setTotalPages(1);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
    fetchUsers();
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    setCurrentPage(1); // Reset to first page when changing filter
  };

  const handleLocationFilterChange = (e) => {
    setLocationFilter(e.target.value);
    setCurrentPage(1); // Reset to first page when changing location filter
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await Api.putWithtoken(`users/${userId}`, { role: newRole });
      
      // Update the user in the state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user._id === userId ? { ...user, role: newRole } : user
        )
      );
      
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('Failed to update user role. Please try again.');
    }
  };

  const handleVerificationToggle = async (userId, currentStatus) => {
    try {
      await Api.putWithtoken(`users/${userId}`, { isVerified: !currentStatus });
      
      // Update the user in the state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user._id === userId ? { ...user, isVerified: !currentStatus } : user
        )
      );
      
    } catch (error) {
      console.error('Error toggling user verification:', error);
      alert('Failed to update user verification status. Please try again.');
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await Api.deleteWithtoken(`users/${userId}`);
        
        // Remove the user from the state
        setUsers(prevUsers => 
          prevUsers.filter(user => user._id !== userId)
        );
        
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user. Please try again.');
      }
    }
  };

  const startEditingUser = (user) => {
    setEditingUser({
      ...user,
      password: '' // Don't include current password
    });
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingUser(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleNewUserInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleNewUserCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setNewUser(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const saveUserChanges = async () => {
    try {
      // Create update object (only include fields that should be updated)
      const updateData = {
        firstName: editingUser.firstName,
        lastName: editingUser.lastName,
        email: editingUser.email,
        role: editingUser.role,
        region: editingUser.region
      };
      
      // Only include password if it was changed
      if (editingUser.password) {
        updateData.password = editingUser.password;
      }
      
      await Api.putWithtoken(`users/${editingUser._id}`, updateData);
      
      // Update the user in the state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user._id === editingUser._id ? { ...user, ...updateData } : user
        )
      );
      
      // Close the edit form
      setEditingUser(null);
      
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update user. Please try again.');
    }
  };
  
  const addNewUser = async () => {
    try {
      // Validate required fields
      if (!newUser.firstName || !newUser.lastName || !newUser.email || !newUser.password) {
        alert('Please fill in all required fields.');
        return;
      }
      
      // Create the user using the admin endpoint
      const response = await Api.postWithtoken('users', newUser);
      
      console.log('User created:', response);
      
      // Add the new user to the state
      if (response && response._id) {
        setUsers(prevUsers => [response, ...prevUsers]);
      }
      
      // Close the modal and reset the form
      setShowAddUserModal(false);
      setNewUser({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'user',
        isVerified: false
      });
      
      // Refresh the user list
      fetchUsers();
      
    } catch (error) {
      console.error('Error creating user:', error);
      alert(`Failed to create user: ${error.response?.data?.error || error.message}`);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getRoleBadgeClass = (role) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'admin';
      case 'agent':
        return 'agent';
      default:
        return 'user';
    }
  };

  return (
    <div className="admin-users">
      <div className="admin-dashboard-header">
        <h1>Manage Users</h1>
        <p>View, edit, and manage all users and agents.</p>
        <button 
          className="admin-btn admin-btn-primary" 
          onClick={() => setShowAddUserModal(true)}
          style={{ marginTop: '10px' }}
        >
          Add New User
        </button>
      </div>
      
      <div className="admin-card">
        <div className="admin-filters">
          <div className="admin-search-form">
            <form onSubmit={handleSearch}>
              <input 
                type="text" 
                placeholder="Search users..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit" className="admin-btn admin-btn-primary">Search</button>
            </form>
          </div>
          
          <div className="admin-filter-select">
            <select value={filter} onChange={handleFilterChange}>
              <option value="all">All Users</option>
              <option value="admin">Admins</option>
              <option value="agent">Agents</option>
              <option value="user">Customers</option>
            </select>
            
            <select value={locationFilter} onChange={handleLocationFilterChange} className="location-filter">
              <option value="all">All Locations</option>
              {availableLocations.map(location => (
                <option key={location.value} value={location.value}>{location.label}</option>
              ))}
            </select>
          </div>
        </div>
        
        {loading ? (
          <div className="admin-loading">
            <div className="spinner"></div>
            <p>Loading users...</p>
          </div>
        ) : (
          <>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Region</th>
                  <th>Verified</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map(user => (
                    <tr key={user._id}>
                      <td>{user.firstName} {user.lastName}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`status ${getRoleBadgeClass(user.role)}`}>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase()}
                        </span>
                      </td>
                      <td>{user.region || '-'}</td>
                      <td>
                        <span className={`status ${user.isVerified ? 'published' : 'pending'}`}>
                          {user.isVerified ? 'Verified' : 'Unverified'}
                        </span>
                      </td>
                      <td>{formatDate(user.createdAt)}</td>
                      <td className="actions">
                        <button 
                          className="edit" 
                          onClick={() => startEditingUser(user)}
                          title="Edit"
                        >
                          <i className="fa-solid fa-edit"></i>
                        </button>
                        
                        <button 
                          className="edit" 
                          onClick={() => handleVerificationToggle(user._id, user.isVerified)}
                          title={user.isVerified ? 'Revoke Verification' : 'Verify User'}
                        >
                          <i className={`fa-solid ${user.isVerified ? 'fa-user-times' : 'fa-user-check'}`}></i>
                        </button>
                        
                        {user.role !== 'admin' && (
                          <button 
                            className="edit" 
                            onClick={() => handleRoleChange(user._id, 'admin')}
                            title="Make Admin"
                          >
                            <i className="fa-solid fa-user-shield"></i>
                          </button>
                        )}
                        
                        {user.role !== 'agent' && (
                          <button 
                            className="edit" 
                            onClick={() => handleRoleChange(user._id, 'agent')}
                            title="Make Agent"
                          >
                            <i className="fa-solid fa-user-tie"></i>
                          </button>
                        )}
                        
                        {user.role !== 'user' && (
                          <button 
                            className="edit" 
                            onClick={() => handleRoleChange(user._id, 'user')}
                            title="Make Regular User"
                          >
                            <i className="fa-solid fa-user"></i>
                          </button>
                        )}
                        
                        <button 
                          className="delete" 
                          onClick={() => handleDelete(user._id)}
                          title="Delete"
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center' }}>No users found</td>
                  </tr>
                )}
              </tbody>
            </table>
            
            {totalPages > 1 && (
              <div className="admin-pagination">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="admin-btn"
                >
                  Previous
                </button>
                
                <span className="admin-page-info">
                  Page {currentPage} of {totalPages}
                </span>
                
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="admin-btn"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Edit User Modal */}
      {editingUser && (
        <div className="admin-modal">
          <div className="admin-modal-content">
            <div className="admin-modal-header">
              <h2>Edit User</h2>
              <button className="admin-modal-close" onClick={() => setEditingUser(null)}>×</button>
            </div>
            <div className="admin-modal-body">
              <div className="admin-form-group">
                <label>First Name</label>
                <input 
                  type="text" 
                  name="firstName" 
                  value={editingUser.firstName} 
                  onChange={handleEditInputChange}
                />
              </div>
              <div className="admin-form-group">
                <label>Last Name</label>
                <input 
                  type="text" 
                  name="lastName" 
                  value={editingUser.lastName} 
                  onChange={handleEditInputChange}
                />
              </div>
              <div className="admin-form-group">
                <label>Email</label>
                <input 
                  type="email" 
                  name="email" 
                  value={editingUser.email} 
                  onChange={handleEditInputChange}
                />
              </div>
              <div className="admin-form-group">
                <label>Role</label>
                <select 
                  name="role" 
                  value={editingUser.role} 
                  onChange={handleEditInputChange}
                >
                  <option value="user">User</option>
                  <option value="agent">Agent</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="admin-form-group">
                <label>New Password (leave blank to keep current)</label>
                <input 
                  type="password" 
                  name="password" 
                  value={editingUser.password} 
                  onChange={handleEditInputChange}
                  placeholder="Enter new password"
                />
              </div>
              <div className="admin-form-group">
                <label>Region</label>
                <select 
                  name="region" 
                  value={editingUser.region || ''} 
                  onChange={handleEditInputChange}
                >
                  <option value="">Select Region</option>
                  {availableLocations.map(location => (
                    <option key={location.value} value={location.value}>{location.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="admin-modal-footer">
              <button className="admin-btn admin-btn-secondary" onClick={() => setEditingUser(null)}>
                Cancel
              </button>
              <button className="admin-btn admin-btn-primary" onClick={saveUserChanges}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Add New User Modal */}
      {showAddUserModal && (
        <div className="admin-modal">
          <div className="admin-modal-content">
            <div className="admin-modal-header">
              <h2>Add New User</h2>
              <button className="admin-modal-close" onClick={() => setShowAddUserModal(false)}>×</button>
            </div>
            <div className="admin-modal-body">
              <div className="admin-form-group">
                <label>First Name *</label>
                <input 
                  type="text" 
                  name="firstName" 
                  value={newUser.firstName} 
                  onChange={handleNewUserInputChange}
                  required
                />
              </div>
              <div className="admin-form-group">
                <label>Last Name *</label>
                <input 
                  type="text" 
                  name="lastName" 
                  value={newUser.lastName} 
                  onChange={handleNewUserInputChange}
                  required
                />
              </div>
              <div className="admin-form-group">
                <label>Email *</label>
                <input 
                  type="email" 
                  name="email" 
                  value={newUser.email} 
                  onChange={handleNewUserInputChange}
                  required
                />
              </div>
              <div className="admin-form-group">
                <label>Password *</label>
                <input 
                  type="password" 
                  name="password" 
                  value={newUser.password} 
                  onChange={handleNewUserInputChange}
                  placeholder="Enter password"
                  required
                />
              </div>
              <div className="admin-form-group">
                <label>Role</label>
                <select 
                  name="role" 
                  value={newUser.role} 
                  onChange={handleNewUserInputChange}
                >
                  <option value="user">User</option>
                  <option value="agent">Agent</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="admin-form-group">
                <label>
                  <input 
                    type="checkbox" 
                    name="isVerified" 
                    checked={newUser.isVerified} 
                    onChange={handleNewUserCheckboxChange}
                  />
                  Verified User
                </label>
              </div>
              <div className="admin-form-group">
                <label>Region</label>
                <select 
                  name="region" 
                  value={newUser.region || ''} 
                  onChange={handleNewUserInputChange}
                >
                  <option value="">Select Region</option>
                  {availableLocations.map(location => (
                    <option key={location.value} value={location.value}>{location.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="admin-modal-footer">
              <button className="admin-btn admin-btn-secondary" onClick={() => setShowAddUserModal(false)}>
                Cancel
              </button>
              <button className="admin-btn admin-btn-primary" onClick={addNewUser}>
                Create User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
