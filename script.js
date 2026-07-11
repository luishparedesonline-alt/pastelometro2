document.addEventListener('DOMContentLoaded', function() {
    // Protección F12 y deshabilitación de herramientas de desarrollo (solo en desktop)
    (function() {
        // Detectar si es dispositivo móvil
        function isMobileDevice() {
            return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                   window.innerWidth <= 768;
        }
        
        // Si es móvil, no activar la protección F12
        if (isMobileDevice()) {
            console.log('Modo móvil detectado - Protección F12 desactivada');
            return;
        }

        // Manejar acceso no autorizado
        function handleUnauthorizedAccess() {
            // Limpiar localStorage y sessionStorage
            localStorage.clear();
            sessionStorage.clear();
            
            // Mostrar mensaje de advertencia
            document.body.innerHTML = `
                <div style="
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: #1a1a1a;
                    color: white;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    font-family: Arial, sans-serif;
                    z-index: 9999;
                    text-align: center;
                    padding: 20px;
                ">
                    <h1 style="color: #e74c3c; margin-bottom: 20px;">⚠️ ACCESO NO AUTORIZADO</h1>
                    <p style="margin-bottom: 15px; font-size: 18px;">Las herramientas de desarrollo están deshabilitadas por seguridad.</p>
                    <p style="margin-bottom: 25px; color: #bdc3c7;">Esta acción ha sido registrada por el sistema de protección.</p>
                    <button onclick="window.location.reload()" style="
                        background: #3498db;
                        color: white;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 5px;
                        cursor: pointer;
                        font-size: 16px;
                    ">Continuar</button>
                </div>
            `;
            
            // Prevenir que se cierre el mensaje
            document.addEventListener('keydown', function(e) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            });
            
            document.addEventListener('contextmenu', function(e) {
                e.preventDefault();
                return false;
            });
        }

        // SOLO detectar teclas específicas - NO detección automática
        document.addEventListener('keydown', function(e) {
            // F12
            if (e.keyCode === 123) {
                e.preventDefault();
                handleUnauthorizedAccess();
                return false;
            }
            
            // Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C
            if (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) {
                e.preventDefault();
                handleUnauthorizedAccess();
                return false;
            }
            
            // Ctrl+U (view source)
            if (e.ctrlKey && e.keyCode === 85) {
                e.preventDefault();
                handleUnauthorizedAccess();
                return false;
            }
        });

        // Prevenir clic derecho (opcional - puedes comentar esto si no lo necesitas)
        document.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            return false;
        });

    })();

    // ========== CÓDIGO ORIGINAL (SIN MODIFICACIONES) ==========
    
    // Elementos del DOM
    const accessCodeInput = document.getElementById('access-code');
    const loginBtn = document.getElementById('login-btn');
    const errorMessage = document.getElementById('error-message');
    const successMessage = document.getElementById('success-message');
    const loginSection = document.getElementById('login-section');
    const loadingSection = document.getElementById('loading-section');
    
    // Configuración
    const CODE_PREFIX = 'PAST-';
    const CODE_REGEX = /^PAST-[A-Z0-9]{4}$/;
    const MAX_ATTEMPTS = 5;
    const BLOCK_TIME = 30000; // 30 segundos
    const MAX_DEVICES = 3;
    
    // Nuevos códigos válidos (formato simplificado PAST-XXXX) - SIN YU6L
    const VALID_CODES = [
        "PAST-0A2D", "PAST-1W3E", "PAST-2R4T", "PAST-3E5Y", "PAST-4T6U",
        "PAST-5Y7I", "PAST-6U8O", "PAST-7I9P", "PAST-8O0A", "PAST-9P1S",
        "PAST-AS1B", "PAST-AS3B", "PAST-AS5B", "PAST-AS7B", "PAST-AS9B",
        "PAST-BN0A", "PAST-BN2A", "PAST-BN4A", "PAST-BN6A", "PAST-BN8A",
        "PAST-CV0O", "PAST-CV2O", "PAST-CV4O", "PAST-CV6O", "PAST-CV8O",
        "PAST-DF1M", "PAST-DF3M", "PAST-DF5M", "PAST-DF7M", "PAST-DF9M",
        "PAST-ER1H", "PAST-ER3H", "PAST-ER5H", "PAST-ER7H", "PAST-ER9H",
        "PAST-FG0Q", "PAST-FG2Q", "PAST-FG4Q", "PAST-FG6Q", "PAST-FG8Q",
        "PAST-GH1W", "PAST-GH3W", "PAST-GH5W", "PAST-GH7W", "PAST-GH9W",
        "PAST-HJ0E", "PAST-HJ2E", "PAST-HJ4E", "PAST-HJ6E", "PAST-HJ8E",
        "PAST-IO0X", "PAST-IO2X", "PAST-IO4X", "PAST-IO6X", "PAST-IO8X",
        "PAST-JK1R", "PAST-JK3R", "PAST-JK5R", "PAST-JK7R", "PAST-JK9R",
        "PAST-KL0T", "PAST-KL2T", "PAST-KL4T", "PAST-KL6T", "PAST-KL8T",
        "PAST-LZ1Y", "PAST-LZ3Y", "PAST-LZ5Y", "PAST-LZ7Y", "PAST-LZ9Y",
        "PAST-MQ0D", "PAST-MQ2D", "PAST-MQ4D", "PAST-MQ6D", "PAST-MQ8D",
        "PAST-NM1S", "PAST-NM3S", "PAST-NM5S", "PAST-NM7S", "PAST-NM9S",
        "PAST-OP1C", "PAST-OP3C", "PAST-OP5C", "PAST-OP7C", "PAST-OP9C",
        "PAST-PA0V", "PAST-PA2V", "PAST-PA4V", "PAST-PA6V", "PAST-PA8V",
        "PAST-QW1F", "PAST-QW3F", "PAST-QW5F", "PAST-QW7F", "PAST-QW9F",
        "PAST-RT0J", "PAST-RT2J", "PAST-RT4J", "PAST-RT6J", "PAST-RT8J",
        "PAST-SD0N", "PAST-SD2N", "PAST-SD4N", "PAST-SD6N", "PAST-SD8N",
        "PAST-TY1K", "PAST-TY3K", "PAST-TY5K", "PAST-TY7K", "PAST-TY9K",
        "PAST-UI1Z", "PAST-UI3Z", "PAST-UI5Z", "PAST-UI7Z", "PAST-UI9Z",
        "PAST-VB1P", "PAST-VB3P", "PAST-VB5P", "PAST-VB7P", "PAST-VB9P",
        "PAST-WE0G", "PAST-WE2G", "PAST-WE4G", "PAST-WE6G", "PAST-WE8G",
        "PAST-XC1I", "PAST-XC3I", "PAST-XC5I", "PAST-XC7I", "PAST-XC9I",
        "PAST-YU0L", "PAST-YU2L", "PAST-YU4L", "PAST-YU8L", "PAST-ZX0U",
        "PAST-ZX2U", "PAST-ZX4U", "PAST-ZX6U", "PAST-ZX8U"
    ];

    // Variables de estado
    let attempts = 0;
    let accessData = JSON.parse(localStorage.getItem('pastelometroAccessData')) || {};

    // Generar ID de dispositivo único
    function getDeviceId() {
        let deviceId = localStorage.getItem('pastelometroDeviceId');
        if (!deviceId) {
            deviceId = 'device-' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('pastelometroDeviceId', deviceId);
        }
        return deviceId;
    }

    // Verificar bloqueo por intentos fallidos
    function checkBlockStatus() {
        if (accessData.blockedUntil && Date.now() < accessData.blockedUntil) {
            const remainingTime = Math.ceil((accessData.blockedUntil - Date.now()) / 1000);
            errorMessage.textContent = `Demasiados intentos fallidos. Por favor espere ${remainingTime} segundos antes de intentar nuevamente.`;
            errorMessage.classList.remove('hidden');
            loginBtn.disabled = true;
            
            setTimeout(() => {
                loginBtn.disabled = false;
                errorMessage.classList.add('hidden');
            }, accessData.blockedUntil - Date.now());
            
            return true;
        }
        return false;
    }

    // Formatear código de entrada
    function formatCodeInput(value) {
        value = value.toUpperCase().replace(/[^A-Z0-9-]/g, '');
        
        if (!value.startsWith(CODE_PREFIX) && value.length > 0) {
            value = CODE_PREFIX + value.replace(/^PAST-?/, '');
        }
        
        // Limitar a 4 caracteres después del prefijo
        if (value.length > CODE_PREFIX.length) {
            const mainPart = value.substring(CODE_PREFIX.length).replace(/-/g, '');
            value = CODE_PREFIX + mainPart.substring(0, 4);
        }
        
        return value;
    }

    // Validar código y manejar acceso
    function validateAndLogin(code) {
        const deviceId = getDeviceId();
        
        if (!CODE_REGEX.test(code)) {
            showError('Formato de código inválido. Use el formato: PAST-XXXX');
            return;
        }
        
        if (VALID_CODES.includes(code)) {
            handleValidCode(code, deviceId);
        } else {
            handleInvalidCode();
        }
    }

    function handleValidCode(code, deviceId) {
        // Inicializar datos para este código si no existen
        if (!accessData[code]) {
            accessData[code] = {
                devices: {},
                lastAccess: Date.now()
            };
        }
        
        // Registrar dispositivo
        accessData[code].devices[deviceId] = Date.now();
        
        // Verificar límite de dispositivos
        const deviceCount = Object.keys(accessData[code].devices).length;
        if (deviceCount > MAX_DEVICES) {
            showError(`Este código ya ha sido utilizado en el máximo de dispositivos permitidos (${MAX_DEVICES}).`);
            return;
        }
        
        // Actualizar datos
        accessData.lastUsedCode = code;
        accessData[code].lastAccess = Date.now();
        localStorage.setItem('pastelometroAccessData', JSON.stringify(accessData));
        
        // Redirigir
        loginSection.classList.add('hidden');
        loadingSection.classList.remove('hidden');
        setTimeout(() => {
            window.location.href = 'https://luishparedesonline-alt.github.io/pastelometro3/';
        }, 2000);
    }

    function handleInvalidCode() {
        attempts++;
        
        if (attempts >= MAX_ATTEMPTS) {
            accessData.blockedUntil = Date.now() + BLOCK_TIME;
            localStorage.setItem('pastelometroAccessData', JSON.stringify(accessData));
            
            showError(`Demasiados intentos fallidos. Por favor espere ${BLOCK_TIME/1000} segundos antes de intentar nuevamente.`);
            loginBtn.disabled = true;
            
            setTimeout(() => {
                loginBtn.disabled = false;
                errorMessage.classList.add('hidden');
                attempts = 0;
            }, BLOCK_TIME);
        } else {
            showError(`Código inválido. Intentos restantes: ${MAX_ATTEMPTS - attempts}`, attempts >= MAX_ATTEMPTS - 2);
        }
    }

    function showError(message, isWarning = false) {
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
        if (isWarning) errorMessage.classList.add('attempts-warning');
        successMessage.classList.add('hidden');
    }

    // Inicialización
    if (accessData.lastUsedCode) {
        accessCodeInput.value = accessData.lastUsedCode;
    }
    
    checkBlockStatus();

    // Event Listeners
    accessCodeInput.addEventListener('input', function(e) {
        e.target.value = formatCodeInput(e.target.value);
    });
    
    loginBtn.addEventListener('click', function() {
        validateAndLogin(accessCodeInput.value.trim());
    });
    
    accessCodeInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') loginBtn.click();
    });
});
