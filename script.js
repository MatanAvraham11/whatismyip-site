(async function () {
  const ipElement = document.getElementById('ip-address');
  const yearElement = document.getElementById('year');

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear().toString();
  }

  const copyButton = document.querySelector('.copy-domain');

  if (copyButton && ipElement) {
    copyButton.addEventListener('click', async () => {
      // Get the current IP value from the element
      const ipValue = ipElement.textContent?.trim() || '';
      
      // Check if IP is valid (not placeholder or error)
      if (!ipValue || ipValue === '—' || ipValue === 'לא זמין' || ipValue.length < 7) {
        console.warn('IP not available to copy');
        return;
      }

      try {
        // Use modern clipboard API
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(ipValue);
          copyButton.classList.add('success');
          setTimeout(() => copyButton.classList.remove('success'), 1500);
        } else {
          console.warn('Clipboard API not available');
          // Show user-friendly message if clipboard is not available
          alert('העתקה לא זמינה בדפדפן זה. אנא העתיקו ידנית: ' + ipValue);
        }
      } catch (err) {
        console.error('Copy failed', err);
        alert('שגיאה בהעתקה. אנא העתיקו ידנית: ' + ipValue);
      }
    });
  }

  if (!ipElement) return;

  // Device detection functions
  function detectDeviceType() {
    const ua = navigator.userAgent || '';
    
    if (/tablet|ipad|playbook|silk/i.test(ua)) {
      return 'טאבלט';
    }
    if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sphone|palm|iemobile|symbian|symbianos|fennec/i.test(ua)) {
      return 'נייד';
    }
    return 'מחשב';
  }

  function detectBrowser() {
    const ua = navigator.userAgent || '';
    
    if (ua.indexOf('Edg') > -1) {
      return 'Microsoft Edge';
    }
    if (ua.indexOf('Chrome') > -1 && ua.indexOf('Edg') === -1) {
      return 'Google Chrome';
    }
    if (ua.indexOf('Firefox') > -1) {
      return 'Mozilla Firefox';
    }
    if (ua.indexOf('Safari') > -1 && ua.indexOf('Chrome') === -1) {
      return 'Safari';
    }
    if (ua.indexOf('Opera') > -1 || ua.indexOf('OPR') > -1) {
      return 'Opera';
    }
    if (ua.indexOf('MSIE') > -1 || ua.indexOf('Trident') > -1) {
      return 'Internet Explorer';
    }
    return 'לא זוהה';
  }

  function detectOperatingSystem() {
    const ua = navigator.userAgent || '';
    
    if (ua.indexOf('Win') > -1) {
      if (ua.indexOf('Windows NT 10.0') > -1) return 'Windows 10/11';
      if (ua.indexOf('Windows NT 6.3') > -1) return 'Windows 8.1';
      if (ua.indexOf('Windows NT 6.2') > -1) return 'Windows 8';
      if (ua.indexOf('Windows NT 6.1') > -1) return 'Windows 7';
      return 'Windows';
    }
    if (ua.indexOf('Mac') > -1) {
      return 'macOS';
    }
    if (ua.indexOf('Linux') > -1) {
      return 'Linux';
    }
    if (ua.indexOf('Android') > -1) {
      return 'Android';
    }
    if (ua.indexOf('iOS') > -1 || /iPad|iPhone|iPod/.test(ua)) {
      return 'iOS';
    }
    if (ua.indexOf('X11') > -1) {
      return 'Unix';
    }
    return 'לא זוהה';
  }

  // Update device info immediately
  const deviceTypeElement = document.getElementById('device-type');
  const browserElement = document.getElementById('browser');
  const osElement = document.getElementById('operating-system');

  if (deviceTypeElement) {
    deviceTypeElement.textContent = detectDeviceType();
  }
  if (browserElement) {
    browserElement.textContent = detectBrowser();
  }
  if (osElement) {
    osElement.textContent = detectOperatingSystem();
  }

  try {
    const response = await fetch('https://api.ipify.org?format=json', {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('IP fetch failed');
    }

    const data = await response.json();
    ipElement.textContent = data.ip ?? 'לא זמין';
  } catch (error) {
    console.error(error);
    ipElement.textContent = 'לא זמין';
  }
})();
