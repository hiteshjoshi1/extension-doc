(function() {
    console.log('DocSend Downloader script started');
    
    // Main code: Display capture button UI
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
    details.textContent = 'Click button below to capture the document';
    details.style.marginBottom = '30px';
    
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
        
        // Array to store slide content - this time we'll just capture text and simplified content
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
        
        // Function to capture the visible content with simplified approach
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
            
            // Remove scripts and styles
            clone.querySelectorAll('script, style').forEach(el => el.remove());
            
            // Remove navigation elements
            clone.querySelectorAll('[class*="nav"], [class*="button"], [class*="control"]').forEach(el => {
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
        
        // Simplified HTML that can be easily downloaded - removed download options section
        const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>${title}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              background: #f8f9fa;
              color: #333;
              padding: 20px;
              margin: 0;
            }
            .container {
              max-width: 800px;
              margin: 0 auto;
              background: white;
              padding: 30px;
              box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            }
            h1 {
              text-align: center;
              margin-bottom: 30px;
              color: #1a73e8;
            }
            .slide {
              margin-bottom: 40px;
              page-break-after: always;
              border: 1px solid #ddd;
              background: white;
              padding: 20px;
            }
            .slide-header {
              padding: 10px;
              background: #f5f5f5;
              border-bottom: 1px solid #ddd;
              margin-bottom: 15px;
            }
            img {
              max-width: 100%;
              height: auto;
              margin: 10px 0;
            }
            @media print {
              body {
                background: white;
                padding: 0;
              }
              .container {
                box-shadow: none;
                padding: 0;
                max-width: 100%;
              }
              .slide {
                border: none;
                page-break-after: always;
                page-break-inside: avoid;
                margin-bottom: 0;
                padding: 0;
              }
              .slide-header {
                background: none;
                border: none;
                padding: 5px 0;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>${title}</h1>
            
            ${slideContents.map(slide => `
              <div class="slide">
                <div class="slide-header">Slide ${slide.index} of ${totalSlides}</div>
                <div class="slide-content">
                  ${slide.content}
                </div>
              </div>
            `).join('')}
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
          updateStatus('Document opened in new tab! Use Cmd+P to save as PDF.', 100);
          
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