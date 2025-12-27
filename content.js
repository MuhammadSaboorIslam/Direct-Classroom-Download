// Easy Download for Google Classroom
// Adds download buttons to all classroom attachments

(function() {
  'use strict';

  // SVG icon for download button
  const downloadIconSVG = `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="download-icon">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 15 17 10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
  `;

  // SVG for loading spinner
  const loadingSpinnerSVG = `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="loading-spinner">
      <circle cx="12" cy="12" r="10"></circle>
    </svg>
  `;

  // Extract file ID from Google Drive URL
  function extractFileId(url) {
    if (!url) return null;
    
    // Match pattern: /file/d/{FILE_ID}/
    const match = url.match(/\/file\/d\/([^\/]+)\//);
    return match ? match[1] : null;
  }

  // Convert view URL to download URL
  function createDownloadUrl(fileId) {
    return `https://drive.usercontent.google.com/u/0/uc?id=${fileId}&export=download`;
  }

  // Download file directly using Chrome Downloads API
  async function downloadFile(url, fileName, button) {
    try {
      // Show loading state
      button.classList.add('downloading');
      button.disabled = true;
      button.innerHTML = loadingSpinnerSVG;

      // Use Chrome Downloads API to download without opening new tab
      chrome.runtime.sendMessage({
        action: 'download',
        url: url,
        filename: fileName
      }, (response) => {
        // Reset button state
        button.classList.remove('downloading');
        button.disabled = false;
        button.innerHTML = downloadIconSVG;
        
        if (response && response.error) {
          console.error('Download error:', response.error);
          // Fallback to opening in new tab
          window.open(url, '_blank');
        }
      });
      
    } catch (error) {
      console.error('Download error:', error);
      
      // Reset button state on error
      button.classList.remove('downloading');
      button.disabled = false;
      button.innerHTML = downloadIconSVG;
      
      // Fallback to opening in new tab
      window.open(url, '_blank');
    }
  }

  // Create download button element
  function createDownloadButton(downloadUrl, fileName) {
    const button = document.createElement('button');
    button.className = 'easy-download-btn';
    button.setAttribute('aria-label', `Download ${fileName}`);
    button.title = 'Download file';
    button.innerHTML = downloadIconSVG;
    
    // Add click handler for direct download
    button.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (!button.disabled) {
        downloadFile(downloadUrl, fileName, button);
      }
    });
    
    return button;
  }

  // Process all attachment elements
  function addDownloadButtons() {
    const attachments = document.getElementsByClassName('t2wIBc');
    
    if (attachments.length === 0) {
      return;
    }

    Array.from(attachments).forEach((attachment) => {
      // Skip if already processed
      if (attachment.querySelector('.easy-download-btn')) {
        return;
      }

      // Find the anchor tag with the file link
      const linkElement = attachment.querySelector('a.vwNuXe[href*="drive.google.com/file"]');
      
      if (!linkElement) {
        return;
      }

      const viewUrl = linkElement.href;
      const fileName = linkElement.title || 'file';
      const fileId = extractFileId(viewUrl);

      if (!fileId) {
        console.warn('Could not extract file ID from:', viewUrl);
        return;
      }

      const downloadUrl = createDownloadUrl(fileId);
      const downloadButton = createDownloadButton(downloadUrl, fileName);

      // Find the best place to insert the button
      // Insert it in the top-right corner of the attachment card
      const cardContainer = attachment.querySelector('.r0VQac');
      
      if (cardContainer) {
        // Create a wrapper for positioning
        const buttonWrapper = document.createElement('div');
        buttonWrapper.className = 'easy-download-wrapper';
        buttonWrapper.appendChild(downloadButton);
        
        cardContainer.style.position = 'relative';
        cardContainer.appendChild(buttonWrapper);
      }
    });
  }

  // Debounce function to avoid excessive processing
  let debounceTimer = null;
  function debounceAddButtons() {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    debounceTimer = setTimeout(() => {
      addDownloadButtons();
    }, 300);
  }

  // Initial run
  addDownloadButtons();

  // Watch for URL changes (SPA navigation)
  let lastUrl = location.href;
  const urlObserver = new MutationObserver(() => {
    const currentUrl = location.href;
    if (currentUrl !== lastUrl) {
      lastUrl = currentUrl;
      console.log('Easy Download: URL changed, re-scanning for attachments');
      // Give the page time to load new content
      setTimeout(() => {
        addDownloadButtons();
      }, 500);
    }
  });

  urlObserver.observe(document.body, {
    childList: true,
    subtree: true
  });

  // Watch for dynamically loaded content
  const observer = new MutationObserver((mutations) => {
    let shouldProcess = false;
    
    mutations.forEach((mutation) => {
      // Check if any added nodes contain or are attachment elements
      if (mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Check if the node itself or its children have the attachment class
            if (node.classList?.contains('t2wIBc') || 
                node.querySelector?.('.t2wIBc')) {
              shouldProcess = true;
            }
          }
        });
      }
      
      // Also check if attributes changed on attachment elements
      if (mutation.type === 'attributes' && 
          mutation.target.classList?.contains('t2wIBc')) {
        shouldProcess = true;
      }
    });
    
    if (shouldProcess) {
      debounceAddButtons();
    }
  });

  // Start observing with more comprehensive options
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class', 'href']
  });

  console.log('Easy Download for Google Classroom: Extension loaded');
})();
