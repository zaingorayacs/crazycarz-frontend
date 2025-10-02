// utils/authTest.js
// Utility to test authentication and debug auth issues

export const checkAuthStatus = () => {
  const adminToken = localStorage.getItem('adminToken');
  const adminData = localStorage.getItem('adminData');
  const adminRefreshToken = localStorage.getItem('adminRefreshToken');
  
  console.log('🔍 Authentication Status Check:');
  console.log('Token exists:', !!adminToken);
  console.log('User data exists:', !!adminData);
  console.log('Refresh token exists:', !!adminRefreshToken);
  
  if (adminToken) {
    console.log('Token preview:', adminToken.substring(0, 20) + '...');
  }
  
  if (adminData) {
    try {
      const userData = JSON.parse(adminData);
      console.log('User:', userData.firstName, userData.lastName, '(' + userData.email + ')');
    } catch (e) {
      console.error('Invalid user data in localStorage');
    }
  }
  
  return {
    hasToken: !!adminToken,
    hasUserData: !!adminData,
    hasRefreshToken: !!adminRefreshToken
  };
};

export const clearAuthData = () => {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminData');
  localStorage.removeItem('adminRefreshToken');
  console.log('🧹 Authentication data cleared');
};

export const setTestAuthData = () => {
  // For testing purposes - use the development bypass from the documentation
  const testToken = 'test-token-for-development';
  const testUserData = {
    firstName: 'Test',
    lastName: 'Admin',
    email: 'admin@test.com',
    role: 'admin'
  };
  
  localStorage.setItem('adminToken', testToken);
  localStorage.setItem('adminData', JSON.stringify(testUserData));
  localStorage.setItem('adminRefreshToken', 'test-refresh-token');
  
  console.log('🧪 Test authentication data set');
  console.log('You may need to refresh the page for changes to take effect');
};

// Make functions available in browser console for debugging
if (typeof window !== 'undefined') {
  window.authDebug = {
    checkAuthStatus,
    clearAuthData,
    setTestAuthData
  };
}
