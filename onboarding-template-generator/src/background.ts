// Background script - Can be used for other extension tasks if needed.
// MSAL authentication logic has been moved back to the UI context (via authService and useAuth hook).

console.log("Background script running.");

// Example: Listener for other potential messages (unrelated to auth)
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   if (request.type === 'someOtherAction') {
//     console.log("Handling someOtherAction");
//     // Perform action
//     sendResponse({ success: true });
//   }
//   // Return true if sendResponse will be called asynchronously
//   // return true;
// });
