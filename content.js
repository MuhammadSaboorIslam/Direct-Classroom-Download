// Easy Download for Google Classroom
// Adds download buttons to all classroom attachments


(function() {
  'use strict';
  
  const IDENTIFIERS = ['r0VQac','pOf0gc','Aopndd']

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
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="loading-spinner">
      <path d="M12 2 A10 10 0 0 1 22 12" opacity="1"></path>
      <path d="M22 12 A10 10 0 0 1 12 22" opacity="0.3"></path>
      <path d="M12 22 A10 10 0 0 1 2 12" opacity="0.1"></path>
    </svg>
  `;

  function extractFileId(url) {
    if (!url) return null;
    
    const match = url.match(/\/file\/d\/([^\/]+)\//);
    return match ? match[1] : null;
  }

  function createDownloadUrl(fileId) {
    return `https://drive.usercontent.google.com/u/0/uc?id=${fileId}&export=download`;
  }

  async function downloadFile(url, fileName, button) {
    try {
      button.classList.add('downloading');
      button.disabled = true;
      button.innerHTML = loadingSpinnerSVG;

      chrome.runtime.sendMessage({
        action: 'download',
        url: url,
        filename: fileName
      }, (response) => {
        setTimeout(() => {
          button.classList.remove('downloading');
          button.disabled = false;
          button.innerHTML = downloadIconSVG;
        }, 800);
        
        if (response && response.error) {
          console.error('Download error:', response.error);
          button.style.background = '#ea4335';
          setTimeout(() => {
            button.style.background = '';
          }, 2000);
        } else if (response && response.success) {
          button.style.background = '#34a853';
          setTimeout(() => {
            button.style.background = '';
          }, 1500);
        }
      });
      
    } catch (error) {
      console.error('Download error:', error);
      
      button.classList.remove('downloading');
      button.disabled = false;
      button.innerHTML = downloadIconSVG;
      button.style.background = '#ea4335';
      setTimeout(() => {
        button.style.background = '';
      }, 2000);
    }
  }

  function createDownloadButton(downloadUrl, fileName) {
    const button = document.createElement('button');
    button.className = 'easy-download-btn';
    button.setAttribute('aria-label', `Download ${fileName}`);
    button.title = 'Download file';
    button.innerHTML = downloadIconSVG;
    
    button.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (!button.disabled) {
        downloadFile(downloadUrl, fileName, button);
      }
    });
    
    return button;
  }

  function addDownloadButtons() {
    // Get all attachments using the IDENTIFIERS array
    let attachments = [];
    IDENTIFIERS.forEach(identifier => {
      const elements = document.getElementsByClassName(identifier);
      attachments = attachments.concat(Array.from(elements));
    });
    
    let processedCount = 0;

    attachments.forEach((attachment) => {
      // Check if already processed and button still exists
      if (attachment.dataset.easyDownloadProcessed === 'true') {
        const existingButton = attachment.querySelector('.easy-download-btn');
        if (existingButton) {
          return; // Button exists, skip
        } else {
          // Button was removed, reprocess
          attachment.dataset.easyDownloadProcessed = 'false';
        }
      }

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

      
      const buttonWrapper = document.createElement('div');
      buttonWrapper.className = 'easy-download-wrapper';
      buttonWrapper.appendChild(downloadButton);
      
      attachment.style.position = 'relative';
      attachment.appendChild(buttonWrapper);
      
      attachment.dataset.easyDownloadProcessed = 'true';
      processedCount++;
    });
    
  }

  let debounceTimer = null;
  function debounceAddButtons() {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    debounceTimer = setTimeout(() => {
      addDownloadButtons();
    }, 300);
  }

  addDownloadButtons();

  let lastUrl = location.href;
  const urlObserver = new MutationObserver(() => {
    const currentUrl = location.href;
    if (currentUrl !== lastUrl) {
      lastUrl = currentUrl;
      setTimeout(() => {
        addDownloadButtons();
      }, 500);
    }
  });

  urlObserver.observe(document.body, {
    childList: true,
    subtree: true
  });

  const observer = new MutationObserver((mutations) => {
    let shouldProcess = false;
    
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.classList?.contains('easy-download-wrapper') || 
                node.classList?.contains('easy-download-btn')) {
              return;
            }
            
            // Check if node matches any identifier or contains any identifier
            const matchesIdentifier = IDENTIFIERS.some(identifier => 
              node.classList?.contains(identifier) || node.querySelector?.(`.${identifier}`)
            );
            
            if (matchesIdentifier) {
              shouldProcess = true;
            }
          }
        });
      }
      
      // Check if mutation target matches any identifier
      if (mutation.type === 'attributes' && 
          !mutation.target.classList?.contains('easy-download-wrapper') &&
          !mutation.target.classList?.contains('easy-download-btn') &&
          mutation.attributeName !== 'data-easy-download-processed') {
        
        const targetMatchesIdentifier = IDENTIFIERS.some(identifier => 
          mutation.target.classList?.contains(identifier)
        );
        
        if (targetMatchesIdentifier) {
          shouldProcess = true;
        }
      }
    });
    
    if (shouldProcess) {
      debounceAddButtons();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class', 'href']
  });

})();
