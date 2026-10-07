# Cookie Clicker Web Application

Una aplicación web interactiva de **Cookie Clicker** desarrollada con HTML5, CSS3 y JavaScript vanilla.

## Características

- 🍪 **Galleta interactiva en el centro**: Diseño responsivo y atractivo con efectos visuales y animación al hacer clic.
- 🔢 **Contador de Clics**: Muestra en tiempo real el número de clics con animación e indicador flotante `+1`.
- 🏆 **Sistema de Logros (Achievements)**:
  - **Primer Clic**: Presiona la galleta por primera vez (1 clic).
  - **Repostero Novato**: Haz clic 10 veces.
  - **Aficionado a las Galletas**: Haz clic 50 veces.
  - **Maestro Panadero**: Haz clic 100 veces.
  - **Leyenda Galletera**: Haz clic 500 veces.
  - Notificaciones en pantalla (toasts) al desbloquear cada logro.
- 🔄 **Reinicio del Contador**: Botón para reiniciar la cuenta y restablecer los logros.
- 🍪 **Persistencia con Cookies de Navegador (`document.cookie`)**: Guarda tanto el progreso de clics como los logros desbloqueados.

## Mejoras de Seguridad y Anti-Manipulación del Lado del Cliente

A petición del usuario, se incorporaron medidas de protección en el cliente:

1. **Deshabilitación de Menú Contextual (Clic Derecho)**: Se previene el menú contextual con `contextmenu.preventDefault()`.
2. **Bloqueo de Atajos de Herramientas de Desarrollador**:
   - `F12`
   - `Ctrl+Shift+I` / `Ctrl+Shift+J` / `Ctrl+Shift+C` (o `Cmd+Opt` en macOS)
   - `Ctrl+U` (Ver código fuente)
   - `Ctrl+S` (Guardar página)
3. **Validación de Integridad y Checksum en la Galleta**:
   - Los datos guardados en la cookie (`cookieClickData`) se codifican en Base64 junto a un **checksum/hash con sal secreta**.
   - Si un usuario edita manualmente la cookie sin conocer el algoritmo y la sal, el sistema detecta la alteración y restablece el contador de forma segura a `0`.

> **Nota de Seguridad**: Cualquier medida del lado del cliente puede ser sobrepasada por usuarios avanzados. Para seguridad absoluta se requiere backend con autenticación y almacenamiento en servidor.

## Estructura del Proyecto

- `index.html`: Estructura HTML, diseño CSS, panel de logros y toasts de notificación.
- `script.js`: Lógica del contador, sistema de logros, persistencia en cookie con checksum y bloqueos de seguridad.
- `README.md`: Documentación del proyecto.

## Uso

Abre `index.html` en cualquier navegador web moderno.
