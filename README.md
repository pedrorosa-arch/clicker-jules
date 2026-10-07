# Cookie Clicker Web Application

A simple, responsive Cookie Clicker web application built with HTML, CSS, and JavaScript.

## Features

- **Interactive Cookie Clicker**: Click the central cookie image to increment your click count with interactive scaling animations and floating "+1" indicators.
- **Cookie Persistence**: Click count is stored in browser cookies (`document.cookie`) and persists across page refreshes.
- **Separated JS Architecture**: Logic is cleanly decoupled into an external `script.js` file.
- **Client-Side Anti-Tampering & Security**:
  - **Right-Click Prevention**: Context menu (`contextmenu`) is disabled to prevent easy inspection options.
  - **DevTools Shortcut Interception**: Common DevTools keyboard shortcuts (such as `F12`, `Ctrl+Shift+I`, `Ctrl+Shift+J`, `Ctrl+Shift+C`, `Ctrl+U`) are intercepted and blocked.
  - **Cookie Integrity Protection**: Cookie values are encoded with Base64 and validated using a salted checksum hash. If a user attempts to manually tamper with or edit the cookie value, the application detects the invalid checksum and resets safely to zero.
  - *Note*: As with all client-side applications, true security requires a backend server for authoritative state validation.
- **Reset Functionality**: Reset the counter back to zero anytime with the "Reset Counter" button.

## Project Structure

```
├── index.html   # Main HTML document and responsive styling
├── script.js    # Click handler, cookie storage, security, and animation logic
└── README.md    # Project documentation
```

## How to Run

1. Open `index.html` directly in any web browser, or serve it using a local development server (e.g., Live Server or `python3 -m http.server 8000`).
2. Click the cookie in the center of the screen to increase the score.
3. Refresh the page to verify that your score persists via browser cookies.
