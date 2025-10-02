// utils/setTestAuth.js
// Script to set test authentication data in localStorage
// Run this in the browser console to authenticate for testing

export const setTestAuthData = () => {
  const testToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OGRlZDI3Yjc0ZTM3Y2I0Mzk0Yjk0YTIiLCJlbWFpbCI6ImFkbWluQHRlc3QuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzU5NDMzMzg0LCJleHAiOjE3NTk1MTk3ODR9.iINVAeXUdmYQwJO50hEXXKEoMD_ywms1OoxSj1VxUqA";
  const testRefreshToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OGRlZDI3Yjc0ZTM3Y2I0Mzk0Yjk0YTIiLCJpYXQiOjE3NTk0MzMzODQsImV4cCI6MTc2MDI5NzM4NH0.0EuwI5Bi4NjSODvC3c9oV8tMsB76WNBPgNmvmporYqc";
  const testUserData = {
    "_id": "68ded27b74e37cb4394b94a2",
    "email": "admin@test.com",
    "firstName": "Test",
    "lastName": "Admin",
    "role": "admin",
    "orderHistory": [],
    "createdAt": "2025-10-02T19:28:59.168Z",
    "updatedAt": "2025-10-02T19:29:44.041Z",
    "__v": 0,
    "otp": null
  };
  
  localStorage.setItem('adminToken', testToken);
  localStorage.setItem('adminRefreshToken', testRefreshToken);
  localStorage.setItem('adminData', JSON.stringify(testUserData));
  
  console.log('✅ Test authentication data set successfully!');
  console.log('🔄 Please refresh the page to see the changes');
  
  return { testToken, testRefreshToken, testUserData };
};

// Make it available globally for browser console
if (typeof window !== 'undefined') {
  window.setTestAuth = setTestAuthData;
}

// Auto-run if this script is imported directly
if (typeof window !== 'undefined' && window.location.pathname.includes('/admin')) {
  console.log('🧪 Test auth utility loaded. Run setTestAuth() in console to authenticate.');
}
