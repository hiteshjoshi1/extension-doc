(function() {
    console.log('DocSend Downloader script started');
    
    // First, try to directly download using URL modification
    if (window.location.href.includes('blob:https://docsend.com/')) {
      try {
        // For blob-based DocSend URLs, we can modify the URL to force download
        const originalURL = window.location.href;
        console.log('Detected blob URL, attempting direct download:', originalURL);
        
        // Extract the document ID from the URL
        const match = originalURL.match(/blob:https:\/\/docsend\.com\/([a-zA-Z0-9-]+)/);
        if (match && match[1]) {
          const docID = match[1];
          
          // Create a status overlay to show progress
          const overlay = document.createElement('div');
          overlay.style.position = 'fixed';
          overlay.style.top = '0';
          overlay.style.left = '0';
          overlay.style.width = '100%';
          overlay.style.height = '100%';
          overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
          overlay.style.zIndex = '9999999';
          overlay.style.display = 'flex';
          overlay.style.flexDirection = 'column';
          overlay.style.justifyContent = 'center';
          overlay.style.alignItems = 'center';
          overlay.style.color = 'white';
          overlay.style.fontFamily = 'Arial, sans-serif';
          overlay.style.fontSize = '16px';
          
          const message = document.createElement('h2');
          message.textContent = 'DocSend PDF Downloader';
          message.style.marginBottom = '20px';
          
          const status = document.createElement('div');
          status.textContent = 'Attempting download...';
          status.style.marginBottom = '20px';
          
          const closeButton = document.createElement('button');
          closeButton.textContent = 'Cancel';
          closeButton.style.padding = '10px 20px';
          closeButton.style.backgroundColor = '#f44336';
          closeButton.style.color = 'white';
          closeButton.style.border = 'none';
          closeButton.style.borderRadius = '4px';
          closeButton.style.cursor = 'pointer';
          closeButton.onclick = () => overlay.remove();
          
          overlay.appendChild(message);
          overlay.appendChild(status);
          overlay.appendChild(closeButton);
          document.body.appendChild(overlay);
          
          // First try: Click the native save button
          status.textContent = 'Looking for Save as PDF button...';
          
          // Try to find the button in different ways
          const pdfButtons = [
            ...document.querySelectorAll('button[aria-label="Save as PDF"]'),
            ...document.querySelectorAll('.save-pdf-button'),
            ...Array.from(document.querySelectorAll('button')).filter(btn => 
              (btn.textContent || '').trim().toLowerCase() === 'save as pdf'
            ),
            ...document.querySelectorAll('a.pdf-download-button')
          ];
          
          if (pdfButtons.length > 0) {
            status.textContent = 'Found PDF button. Clicking...';
            
            // Try clicking the button
            setTimeout(() => {
              try {
                pdfButtons[0].click();
                status.textContent = 'PDF download triggered! You may close this or wait for download.';
                
                // Check if download started (approximate)
                setTimeout(() => {
                  const downloadLinks = document.createElement('div');
                  downloadLinks.style.marginTop = '20px';
                  downloadLinks.style.textAlign = 'center';
                  
                  // Add manual download options
                  downloadLinks.innerHTML = `
                    <p>If download didn't start automatically, try one of these options:</p>
                    <div style="margin-top: 15px;">
                      <button id="manual-download" style="padding: 10px 20px; background-color: #4CAF50; color: white; border: none; border-radius: 4px; margin-right: 10px; cursor: pointer;">
                        Try Alternative Download
                      </button>
                      <button id="capture-doc" style="padding: 10px 20px; background-color: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer;">
                        Capture Document
                      </button>
                    </div>
                  `;
                  
                  overlay.appendChild(downloadLinks);
                  
                  // Setup alternative download
                  document.getElementById('manual-download').onclick = () => {
                    // Try to use the direct download endpoint
                    status.textContent = 'Attempting alternative download...';
                    
                    // Try to get a direct download URL for this document
                    const downloadURL = `https://docsend.com/view/${docID}/pdf`;
                    window.open(downloadURL, '_blank');
                    
                    status.textContent = 'Alternative download attempted. Check downloads folder.';
                  };
                  
                  // Setup document capture option
                  document.getElementById('capture-doc').onclick = () => {
                    overlay.remove();
                    captureDocument();
                  };
                  
                }, 3000);
                
              } catch (error) {
                console.error('Error clicking PDF button:', error);
                status.textContent = 'Error clicking PDF button. Trying alternative methods...';
                
                // Try alternative download methods
                setTimeout(() => {
                  // Method 1: Try to find and use download attribute
                  const links = document.querySelectorAll('a[download]');
                  if (links.length > 0) {
                    links[0].click();
                    status.textContent = 'Alternative download triggered!';
                  } else {
                    status.textContent = 'Could not trigger PDF download. Switching to capture mode...';
                    
                    // Show capture button
                    const captureButton = document.createElement('button');
                    captureButton.textContent = 'Capture Document';
                    captureButton.style.padding = '10px 20px';
                    captureButton.style.backgroundColor = '#4CAF50';
                    captureButton.style.color = 'white';
                    captureButton.style.border = 'none';
                    captureButton.style.borderRadius = '4px';
                    captureButton.style.marginTop = '20px';
                    captureButton.style.cursor = 'pointer';
                    captureButton.onclick = () => {
                      overlay.remove();
                      captureDocument();
                    };
                    
                    overlay.appendChild(captureButton);
                  }
                }, 1000);
              }
            }, 1000);
          } else {
            status.textContent = 'No PDF button found. Switching to capture mode...';
            
            // Show capture button
            const captureButton = document.createElement('button');
            captureButton.textContent = 'Capture Document';
            captureButton.style.padding = '10px 20px';
            captureButton.style.backgroundColor = '#4CAF50';
            captureButton.style.color = 'white';
            captureButton.style.border = 'none';
            captureButton.style.borderRadius = '4px';
            captureButton.style.marginTop = '20px';
            captureButton.style.cursor = 'pointer';
            captureButton.onclick = () => {
              overlay.remove();
              captureDocument();
            };
            
            overlay.appendChild(captureButton);
          }
          
          return; // Exit early since we're handling with the overlay
        }
      } catch (error) {
        console.error('Error with direct download:', error);
        // Continue to regular capture approach
      }
    }
    
    // Otherwise, proceed with regular capture UI
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
    overlay.style.zIndex = '9999999';
    overlay.style.display = 'flex';
    overlay.style.flexDirection = 'column';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.color = 'white';
    overlay.style.fontFamily = 'Arial, sans-serif';
    overlay.style.fontSize = '16px';
    
    const message = document.createElement('h2');
    message.textContent = 'DocSend Downloader';
    message.style.marginBottom = '20px';
    
    const details = document.createElement('div');
    details.textContent = 'Choose download method';
    details.style.marginBottom = '30px';
    
    // Try direct download first
    const directButton = document.createElement('button');
    directButton.textContent = 'Click Save as PDF Button';
    directButton.style.padding = '12px 24px';
    directButton.style.backgroundColor = '#4CAF50';
    directButton.style.color = 'white';
    directButton.style.border = 'none';
    directButton.style.borderRadius = '4px';
    directButton.style.cursor = 'pointer';
    directButton.style.fontWeight = 'bold';
    directButton.style.fontSize = '16px';
    directButton.style.marginBottom = '15px';
    directButton.style.width = '250px';
    directButton.onclick = () => {
      // Try clicking the save as pdf button
      const pdfButtons = [
        ...document.querySelectorAll('button[aria-label="Save as PDF"]'),
        ...document.querySelectorAll('.save-pdf-button'),
        ...Array.from(document.querySelectorAll('button')).filter(btn => 
          (btn.textContent || '').trim().toLowerCase() === 'save as pdf'
        ),
        ...document.querySelectorAll('a.pdf-download-button')
      ];
      
      if (pdfButtons.length > 0) {
        details.textContent = 'Clicking Save as PDF button...';
        try {
          pdfButtons[0].click();
          details.textContent = 'PDF download triggered!';
          setTimeout(() => {
            overlay.remove();
          }, 2000);
        } catch (error) {
          details.textContent = 'Error clicking button. Try capture method instead.';
          console.error('Error clicking PDF button:', error);
        }
      } else {
        details.textContent = 'No Save as PDF button found. Try capture method instead.';
      }
    };
    
    // Main button for capture
    const captureButton = document.createElement('button');
    captureButton.textContent = 'Capture Document';
    captureButton.style.padding = '12px 24px';
    captureButton.style.backgroundColor = '#2196F3';
    captureButton.style.color = 'white';
    captureButton.style.border = 'none';
    captureButton.style.borderRadius = '4px';
    captureButton.style.cursor = 'pointer';
    captureButton.style.fontWeight = 'bold';
    captureButton.style.fontSize = '16px';
    captureButton.style.marginBottom = '15px';
    captureButton.style.width = '250px';
    captureButton.onclick = () => {
      overlay.remove();
      captureDocument();
    };
    
    // Cancel Button
    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';
    cancelButton.style.padding = '8px 16px';
    cancelButton.style.backgroundColor = '#f44336';
    cancelButton.style.color = 'white';
    cancelButton.style.border = 'none';
    cancelButton.style.borderRadius = '4px';
    cancelButton.style.cursor = 'pointer';
    cancelButton.style.width = '250px';
    cancelButton.onclick = () => {
      overlay.remove();
    };
    
    overlay.appendChild(message);
    overlay.appendChild(details);
    overlay.appendChild(directButton);
    overlay.appendChild(captureButton);
    overlay.appendChild(cancelButton);
    document.body.appendChild(overlay);
    
    // Function to capture document through slides
    async function captureDocument() {
      // Create a new overlay for capture process
      const captureOverlay = document.createElement('div');
      captureOverlay.style.position = 'fixed';
      captureOverlay.style.top = '0';
      captureOverlay.style.left = '0';
      captureOverlay.style.width = '100%';
      captureOverlay.style.height = '100%';
      captureOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
      captureOverlay.style.zIndex = '9999999';
      captureOverlay.style.display = 'flex';
      captureOverlay.style.flexDirection = 'column';
      captureOverlay.style.justifyContent = 'center';
      captureOverlay.style.alignItems = 'center';
      captureOverlay.style.color = 'white';
      captureOverlay.style.fontFamily = 'Arial, sans-serif';
      captureOverlay.style.fontSize = '16px';
      
      const captureMessage = document.createElement('h2');
      captureMessage.textContent = 'Capturing Document';
      captureMessage.style.marginBottom = '20px';
      
      const captureDetails = document.createElement('div');
      captureDetails.textContent = 'Preparing to capture...';
      captureDetails.style.marginBottom = '20px';
      
      // Add progress bar
      const progressContainer = document.createElement('div');
      progressContainer.style.width = '80%';
      progressContainer.style.maxWidth = '300px';
      progressContainer.style.backgroundColor = '#333';
      progressContainer.style.borderRadius = '10px';
      progressContainer.style.overflow = 'hidden';
      progressContainer.style.marginBottom = '20px';
      
      const progressBar = document.createElement('div');
      progressBar.style.height = '20px';
      progressBar.style.width = '0%';
      progressBar.style.backgroundColor = '#4285F4';
      progressBar.style.transition = 'width 0.3s';
      
      progressContainer.appendChild(progressBar);
      
      // Cancel button
      const captureCancelButton = document.createElement('button');
      captureCancelButton.textContent = 'Cancel';
      captureCancelButton.style.padding = '8px 16px';
      captureCancelButton.style.backgroundColor = '#f44336';
      captureCancelButton.style.color = 'white';
      captureCancelButton.style.border = 'none';
      captureCancelButton.style.borderRadius = '4px';
      captureCancelButton.style.cursor = 'pointer';
      captureCancelButton.onclick = () => {
        captureOverlay.remove();
      };
      
      captureOverlay.appendChild(captureMessage);
      captureOverlay.appendChild(captureDetails);
      captureOverlay.appendChild(progressContainer);
      captureOverlay.appendChild(captureCancelButton);
      document.body.appendChild(captureOverlay);
      
      function updateStatus(msg, progress = null) {
        captureDetails.textContent = msg;
        if (progress !== null) progressBar.style.width = `${progress}%`;
        console.log(`Status: ${msg}`);
      }
      
      try {
        // Detect number of slides
        let totalSlides = 13; // Default
        
        // Try to find total slides from UI
        const pageIndicators = [
          ...document.querySelectorAll('[class*="pageIndicator"]'),
          ...document.querySelectorAll('[class*="slideIndicator"]'),
          ...document.querySelectorAll('[class*="pageCounter"]')
        ];
        
        for (const indicator of pageIndicators) {
          const text = indicator.textContent || '';
          const match = text.match(/\d+\s*(?:\/|of)\s*(\d+)/i);
          if (match && match[1]) {
            totalSlides = parseInt(match[1], 10);
            break;
          }
        }
        
        updateStatus(`Detected ${totalSlides} slides, preparing to capture...`, 5);
        
        // Array to store slide content
        const slideContents = [];
        let currentSlide = 1;
        
        // Capture first slide
        updateStatus(`Capturing slide ${currentSlide} of ${totalSlides}...`, 10);
        
        // Wait for slide to load
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Capture visible content
        slideContents.push({
          index: currentSlide,
          content: captureVisibleContent()
        });
        
        // Function to capture the visible content
        function captureVisibleContent() {
          try {
            // Find the most likely content container
            const containers = [
              '.document-content',
              '.slide-content',
              '.viewer-content',
              '[class*="slide"]',
              '[class*="page"]',
              '[role="presentation"]',
              'main',
              'article'
            ];
            
            let contentElement = null;
            
            // Try to find a content container
            for (const selector of containers) {
              const elements = document.querySelectorAll(selector);
              if (elements.length > 0) {
                // Find the largest element that's likely to be the main content
                let largest = null;
                let largestArea = 0;
                
                for (const el of elements) {
                  const rect = el.getBoundingClientRect();
                  const area = rect.width * rect.height;
                  if (area > largestArea) {
                    largestArea = area;
                    largest = el;
                  }
                }
                
                if (largest) {
                  contentElement = largest;
                  break;
                }
              }
            }
            
            // If no container found, use the document body
            if (!contentElement) {
              contentElement = document.body;
            }
            
            // Clone the content to manipulate it
            const clone = contentElement.cloneNode(true);
            
            // Remove scripts
            const scripts = clone.querySelectorAll('script');
            scripts.forEach(script => script.remove());
            
            // Remove navigation elements
            const navElements = clone.querySelectorAll('[class*="nav"], [class*="button"], [class*="control"]');
            navElements.forEach(el => {
              // Only remove if it's small enough to likely be a UI element
              const rect = el.getBoundingClientRect();
              if (rect.width < 200 && rect.height < 200) {
                el.remove();
              }
            });
            
            return clone.outerHTML;
          } catch (error) {
            console.error('Error capturing content:', error);
            // Fallback: return the current HTML
            return document.documentElement.outerHTML;
          }
        }
        
        // Navigate to next slide
        function goToNextSlide() {
          try {
            // Try to find and click next button
            const nextSelectors = [
              '[aria-label="Next page"]',
              '[aria-label="Next slide"]',
              '[class*="nextButton"]',
              '[class*="next-button"]',
              'button[class*="next"]',
              '.right-arrow',
              '.arrow-right'
            ];
            
            for (const selector of nextSelectors) {
              const elements = document.querySelectorAll(selector);
              for (const el of elements) {
                if (el && !el.disabled && el.offsetParent !== null) {
                  el.click();
                  return true;
                }
              }
            }
            
            // Fallback: try keyboard navigation
            document.dispatchEvent(new KeyboardEvent('keydown', {
              key: 'ArrowRight',
              code: 'ArrowRight',
              keyCode: 39,
              which: 39,
              bubbles: true
            }));
            
            return true;
          } catch (error) {
            console.error('Error navigating:', error);
            return false;
          }
        }
        
        // Capture remaining slides
        while (currentSlide < totalSlides) {
          // Navigate to next slide
          goToNextSlide();
          
          // Wait for slide to load and transition to complete
          await new Promise(resolve => setTimeout(resolve, 1200));
          
          // Increment counter
          currentSlide++;
          
          // Update status
          const progress = 10 + (currentSlide / totalSlides) * 70;
          updateStatus(`Capturing slide ${currentSlide} of ${totalSlides}...`, progress);
          
          // Capture content
          slideContents.push({
            index: currentSlide,
            content: captureVisibleContent()
          });
        }
        
        // Create document with captured slides
        updateStatus('Building document...', 85);
        
        // Get title
        const title = document.title.replace(' | DocSend', '').trim() || 'DocSend Document';
        
        // Create HTML document
        let html = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <title>${title}</title>
            <style>
              body {
                margin: 0;
                padding: 0;
                font-family: Arial, sans-serif;
                background-color: #f0f0f0;
              }
              .header {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                background-color: #4285F4;
                color: white;
                padding: 16px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                z-index: 1000;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
              }
              .header h1 {
                margin: 0;
                font-size: 20px;
                font-weight: bold;
              }
              .print-button {
                background-color: white;
                color: #4285F4;
                border: none;
                border-radius: 4px;
                padding: 8px 16px;
                font-weight: bold;
                cursor: pointer;
              }
              .content {
                margin-top: 80px;
                padding: 20px;
              }
              .slide {
                background-color: white;
                margin-bottom: 30px;
                border: 1px solid #ddd;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                page-break-after: always;
              }
              .slide-header {
                padding: 10px;
                background-color: #f5f5f5;
                border-bottom: 1px solid #ddd;
                font-weight: bold;
              }
              .slide-content {
                padding: 20px;
              }
              @media print {
                .header {
                  display: none;
                }
                .content {
                  margin-top: 0;
                }
                .slide {
                  break-after: page;
                  border: none;
                  box-shadow: none;
                  margin-bottom: 0;
                }
                .slide-header {
                  display: none;
                }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>${title}</h1>
              <button class="print-button" onclick="window.print()">Save as PDF</button>
            </div>
            <div class="content">
        `;
        
        // Add each slide
        slideContents.forEach(slide => {
          html += `
            <div class="slide">
              <div class="slide-header">Slide ${slide.index} of ${totalSlides}</div>
              <div class="slide-content">
                ${slide.content}
              </div>
            </div>
          `;
        });
        
        // Close HTML
        html += `
            </div>
          </body>
          </html>
        `;
        
        // Open in new tab
        updateStatus('Opening document...', 95);
        
        // Create blob and open
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        
        // Open in new tab
        const newTab = window.open(url, '_blank');
        
        if (!newTab || newTab.closed || typeof newTab.closed === 'undefined') {
          updateStatus('Popup blocked! Please allow popups and try again.', 100);
        } else {
          updateStatus('Document opened in new tab! Click "Save as PDF" button.', 100);
          
          // Show close button
          const closeButton = document.createElement('button');
          closeButton.textContent = 'Close';
          closeButton.style.padding = '10px 20px';
          closeButton.style.backgroundColor = '#4CAF50';
          closeButton.style.color = 'white';
          closeButton.style.border = 'none';
          closeButton.style.borderRadius = '4px';
          closeButton.style.marginTop = '20px';
          closeButton.style.cursor = 'pointer';
          closeButton.onclick = () => {
            captureOverlay.remove();
          };
          
          captureOverlay.appendChild(closeButton);
        }
        
      } catch (error) {
        // Handle any errors
        updateStatus(`Error: ${error.message}`, 0);
        console.error('DocSend Downloader Error:', error);
      }
    }
  })();