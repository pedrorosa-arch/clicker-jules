// Security & Anti-tampering helper functions
const SECRET_SALT = 'CookieClickerSecuritySalt_2025';

// Generates a simple checksum for string data
function generateChecksum(data) {
  let hash = 0;
  const str = data + SECRET_SALT;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return hash.toString(36);
}

// Encodes numeric count with a checksum to prevent simple cookie value editing
function encodeCookieValue(count) {
  const data = count.toString();
  const checksum = generateChecksum(data);
  const payload = JSON.stringify({ count: count, hash: checksum });
  return btoa(payload); // Base64 encode
}

// Decodes cookie value and validates checksum integrity
function decodeCookieValue(encodedVal) {
  if (!encodedVal) return 0;
  try {
    const jsonStr = atob(encodedVal);
    const parsed = JSON.parse(jsonStr);
    if (typeof parsed.count === 'number' && parsed.hash) {
      const expectedHash = generateChecksum(parsed.count.toString());
      if (parsed.hash === expectedHash && parsed.count >= 0) {
        return parsed.count;
      }
    }
  } catch (e) {
    // Tampered or invalid cookie value detected
    console.warn('Cookie tampering or invalid data detected. Resetting count.');
  }
  return 0; // Fallback to 0 if tampered or invalid
}

// Helper functions for browser cookies (document.cookie)
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop().split(';').shift();
  }
  return null;
}

function setCookie(name, value, days = 365) {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value}; ${expires}; path=/; SameSite=Lax`;
}

// Security: Prevent Right-Click Context Menu
document.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  return false;
});

// Security: Prevent Developer Tools Keyboard Shortcuts
document.addEventListener('keydown', (e) => {
  // F12 key
  if (e.key === 'F12' || e.keyCode === 123) {
    e.preventDefault();
    return false;
  }

  // Ctrl+Shift+I (Inspect), Ctrl+Shift+J (Console), Ctrl+Shift+C (Element picker)
  // Cmd+Option+I/J/C on Mac
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) {
    e.preventDefault();
    return false;
  }

  // Ctrl+U / Cmd+Option+U (View Source)
  if ((e.ctrlKey || e.metaKey) && (e.key === 'U' || e.key === 'u')) {
    e.preventDefault();
    return false;
  }

  // Ctrl+S / Cmd+S (Save page)
  if ((e.ctrlKey || e.metaKey) && (e.key === 'S' || e.key === 's')) {
    e.preventDefault();
    return false;
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const cookieBtn = document.getElementById('cookie-btn');
  const countDisplay = document.getElementById('count');
  const resetBtn = document.getElementById('reset-btn');

  // Load saved click count from browser cookie with checksum verification
  const rawCookie = getCookie('cookieClickData');
  let count = decodeCookieValue(rawCookie);
  countDisplay.textContent = count;

  cookieBtn.addEventListener('click', (e) => {
    count++;
    countDisplay.textContent = count;
    setCookie('cookieClickData', encodeCookieValue(count));

    // Bounce animation for count display
    countDisplay.style.transform = 'scale(1.2)';
    setTimeout(() => {
      countDisplay.style.transform = 'scale(1)';
    }, 100);

    // Create floating +1 text
    createFloatingText(e);
  });

  resetBtn.addEventListener('click', () => {
    count = 0;
    countDisplay.textContent = count;
    setCookie('cookieClickData', encodeCookieValue(count));
  });

  function createFloatingText(e) {
    const rect = cookieBtn.getBoundingClientRect();
    const x = e.clientX ? e.clientX - rect.left : rect.width / 2;
    const y = e.clientY ? e.clientY - rect.top : rect.height / 2;

    const floatEl = document.createElement('span');
    floatEl.className = 'floating-text';
    floatEl.textContent = '+1';
    floatEl.style.left = `${x}px`;
    floatEl.style.top = `${y}px`;

    cookieBtn.appendChild(floatEl);

    setTimeout(() => {
      floatEl.remove();
    }, 800);
  }
});
