// Security & Anti-tampering helper functions
const SECRET_SALT = 'CookieClickerSecuritySalt_2025';

const ACHIEVEMENTS = [
  { id: 'first_click', icon: '🍪', name: 'Primer Clic', desc: 'Presiona la galleta por primera vez', target: 1 },
  { id: 'novice', icon: '🥐', name: 'Repostero Novato', desc: 'Haz clic 10 veces', target: 10 },
  { id: 'enthusiast', icon: '🍩', name: 'Aficionado a las Galletas', desc: 'Haz clic 50 veces', target: 50 },
  { id: 'bakery_master', icon: '🍰', name: 'Maestro Panadero', desc: 'Haz clic 100 veces', target: 100 },
  { id: 'cookie_legend', icon: '👑', name: 'Leyenda Galletera', desc: 'Haz clic 500 veces', target: 500 }
];

// Generates a simple checksum for string data
function generateChecksum(count, unlocked) {
  let hash = 0;
  const sortedUnlocked = Array.isArray(unlocked) ? [...unlocked].sort().join(',') : '';
  const str = `${count}|${sortedUnlocked}|${SECRET_SALT}`;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return hash.toString(36);
}

// Encodes numeric count and unlocked achievements with a checksum to prevent simple cookie value editing
function encodeCookieValue(count, unlocked) {
  const safeUnlocked = Array.isArray(unlocked) ? unlocked : [];
  const checksum = generateChecksum(count, safeUnlocked);
  const payload = JSON.stringify({ count: count, unlocked: safeUnlocked, hash: checksum });
  return btoa(payload); // Base64 encode
}

// Decodes cookie value and validates checksum integrity
function decodeCookieValue(encodedVal) {
  const defaultResult = { count: 0, unlocked: [] };
  if (!encodedVal) return defaultResult;
  try {
    const jsonStr = atob(encodedVal);
    const parsed = JSON.parse(jsonStr);
    if (typeof parsed.count === 'number' && Array.isArray(parsed.unlocked) && parsed.hash) {
      const expectedHash = generateChecksum(parsed.count, parsed.unlocked);
      if (parsed.hash === expectedHash && parsed.count >= 0) {
        return { count: parsed.count, unlocked: parsed.unlocked };
      }
    }
  } catch (e) {
    // Tampered or invalid cookie value detected
    console.warn('Cookie tampering or invalid data detected. Resetting count and achievements.');
  }
  return defaultResult; // Fallback if tampered or invalid
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
  const achievementsListEl = document.getElementById('achievements-list');
  const achievementsProgressEl = document.getElementById('achievements-progress');
  const toastContainer = document.getElementById('toast-container');

  // Load saved click count and achievements from browser cookie with checksum verification
  const rawCookie = getCookie('cookieClickData');
  const savedData = decodeCookieValue(rawCookie);
  let count = savedData.count;
  let unlockedAchievements = new Set(savedData.unlocked);

  countDisplay.textContent = count;
  renderAchievements();

  cookieBtn.addEventListener('click', (e) => {
    count++;
    countDisplay.textContent = count;

    // Check for newly unlocked achievements
    checkAchievements();

    // Save updated count and achievements
    saveState();

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
    unlockedAchievements.clear();
    countDisplay.textContent = count;
    saveState();
    renderAchievements();
  });

  function saveState() {
    const unlockedArray = Array.from(unlockedAchievements);
    setCookie('cookieClickData', encodeCookieValue(count, unlockedArray));
  }

  function checkAchievements() {
    ACHIEVEMENTS.forEach((ach) => {
      if (!unlockedAchievements.has(ach.id) && count >= ach.target) {
        unlockedAchievements.add(ach.id);
        showToast(ach);
        renderAchievements();
      }
    });
  }

  function renderAchievements() {
    achievementsListEl.innerHTML = '';
    let unlockedCount = 0;

    ACHIEVEMENTS.forEach((ach) => {
      const isUnlocked = unlockedAchievements.has(ach.id);
      if (isUnlocked) unlockedCount++;

      const card = document.createElement('div');
      card.className = `achievement-card ${isUnlocked ? 'unlocked' : ''}`;
      card.innerHTML = `
        <div class="achievement-icon">${ach.icon}</div>
        <div class="achievement-info">
          <div class="achievement-name">${ach.name}</div>
          <div class="achievement-desc">${ach.desc}</div>
        </div>
        ${isUnlocked ? '<div class="achievement-badge">✓</div>' : ''}
      `;
      achievementsListEl.appendChild(card);
    });

    achievementsProgressEl.textContent = `${unlockedCount} / ${ACHIEVEMENTS.length}`;
  }

  function showToast(achievement) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <div class="toast-icon">${achievement.icon}</div>
      <div>
        <div class="toast-title">¡Logro Desbloqueado!</div>
        <div class="toast-desc">${achievement.name} - ${achievement.desc}</div>
      </div>
    `;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 4000);
  }

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
