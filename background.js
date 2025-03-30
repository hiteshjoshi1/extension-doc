chrome.action.onClicked.addListener(async (tab) => {
    // Check if we're on a DocSend page
    if (tab.url.includes('docsend.com/view')) {
      // Execute script in the tab
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content-script.js']
      });
    } else {
      // Show alert if not on DocSend page
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: () => {
          alert('Please navigate to a DocSend document first.');
        }
      });
    }
  });