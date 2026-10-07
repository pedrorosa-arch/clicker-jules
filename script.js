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

document.addEventListener('DOMContentLoaded', () => {
  const cookieBtn = document.getElementById('cookie-btn');
  const countDisplay = document.getElementById('count');
  const resetBtn = document.getElementById('reset-btn');

  // Load saved click count from browser cookie or default to 0
  let count = parseInt(getCookie('cookieClickCount'), 10) || 0;
  countDisplay.textContent = count;

  cookieBtn.addEventListener('click', (e) => {
    count++;
    countDisplay.textContent = count;
    setCookie('cookieClickCount', count);

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
    setCookie('cookieClickCount', count);
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
