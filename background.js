// Background service worker for Easy Download extension
// Handles download requests from content script

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'download') {
    // Use Chrome Downloads API to download file
    chrome.downloads.download({
      url: request.url,
      filename: request.filename,
      saveAs: false // Auto-download without prompting
    }, (downloadId) => {
      if (chrome.runtime.lastError) {
        console.error('Download failed:', chrome.runtime.lastError);
        sendResponse({ error: chrome.runtime.lastError.message });
      } else {
        console.log('Download started:', downloadId);
        sendResponse({ success: true, downloadId: downloadId });
      }
    });
    
    // Return true to indicate async response
    return true;
  }
});
