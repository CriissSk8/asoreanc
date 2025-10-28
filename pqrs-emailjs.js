// 🚀 Sistema PQRS con EmailJS - Código limpio y optimizado

// Inicializar EmailJS con manejo de errores
(function () {
    try {
        if (typeof emailjs === 'undefined') {
            console.error('❌ EmailJS SDK no está cargado');
            return;
        }
        
        if (typeof EMAILJS_CONFIG === 'undefined') {
            console.warn('⚠️ EMAILJS_CONFIG no está definido');
            return;
        }
        
        if (EMAILJS_CONFIG.publicKey === 'YOUR_PUBLIC_KEY') {
            console.warn('⚠️ EmailJS no configurado. Revisa emailjs-config.js');
            return;
        }
        
        emailjs.init(EMAILJS_CONFIG.publicKey);
        console.log('✅ EmailJS inicializado correctamente');
        console.log('📋 Configuración:', {
            serviceID: EMAILJS_CONFIG.serviceID,
            templateID: EMAILJS_CONFIG.templateID,
            destinationEmail: EMAILJS_CONFIG.destinationEmail
        });
        
    } catch (error) {
        console.error('❌ Error al inicializar EmailJS:', error);
    }
})();

// Prevenir envío tradicional del formulario
window.addEventListener('beforeunload', function (e) {
    // Esto ayuda a prevenir envíos accidentales
});

// Función global para manejar envío (backup)
window.handlePQRSSubmit = function (e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    console.log('🛡️ Envío interceptado - usando solo EmailJS');

    // Disparar el evento personalizado para el manejo con EmailJS
    const form = document.getElementById('pqrs-form');
    if (form) {
        const customEvent = new Event('submit', { bubbles: true, cancelable: true });
        form.dispatchEvent(customEvent);
    }

    return false;
};

document.addEventListener('DOMContentLoaded', function () {
    console.log('🚀 Sistema PQRS cargado - Solo EmailJS activo');

    // Contador de caracteres
    const messageTextarea = document.querySelector('textarea[name="mensaje"]');
    const charCount = document.getElementById('char-count');

    messageTextarea.addEventListener('input', function () {
        const count = this.value.length;
        charCount.textContent = count;
        if (count > 1000) {
            this.value = this.value.substring(0, 1000);
            charCount.textContent = '1000';
        }
    });

    // Manejar envío del formulario
    const form = document.getElementById('pqrs-form');
    if (form) {
        console.log('📝 Event listener de EmailJS registrado correctamente');
        
        // Remover cualquier event listener previo
        form.onsubmit = null;
        
        form.addEventListener('submit', async function (e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🚀 Formulario enviado - procesando con EmailJS SOLAMENTE');
            console.log('🔍 Event object:', e);

            const submitBtn = document.getElementById('submit-btn');
            const submitText = document.getElementById('submit-text');
            const submitIcon = document.getElementById('submit-icon');
            const loadingSpinner = document.getElementById('loading-spinner');

            // Estado de carga
            submitBtn.disabled = true;
            submitText.textContent = 'Enviando...';
            submitIcon.classList.add('hidden');
            loadingSpinner.classList.remove('hidden');

            try {
                // Recopilar datos
                const formData = new FormData(e.target);
                const pqrsData = {
                    nombre: formData.get('nombre'),
                    email: formData.get('email'),
                    telefono: formData.get('telefono') || 'No proporcionado',
                    tipo: formData.get('tipo'),
                    asunto: formData.get('asunto') || 'Sin asunto',
                    mensaje: formData.get('mensaje'),
                    fecha: new Date().toLocaleString('es-CO'),
                    id: generatePQRSId()
                };

                // Validaciones
                if (!pqrsData.nombre || !pqrsData.email || !pqrsData.tipo || !pqrsData.mensaje) {
                    throw new Error('Por favor completa todos los campos obligatorios');
                }
                if (pqrsData.mensaje.length < 20) {
                    throw new Error('El mensaje debe tener al menos 20 caracteres');
                }

                // Agregar pequeño delay para evitar rate limiting
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Enviar email
                await sendPQRSEmail(pqrsData);

                // Éxito
                showSuccessModal(pqrsData.id);
                e.target.reset();
                charCount.textContent = '0';

            } catch (error) {
                console.error('Error completo:', error);
                console.error('Tipo de error:', typeof error);
                console.error('Error message:', error.message);
                console.error('Error status:', error.status);
                
                let errorMessage = 'Error al enviar. Intenta nuevamente.';
                if (error && error.message) {
                    errorMessage = error.message;
                } else if (error && error.text) {
                    errorMessage = error.text;
                } else if (typeof error === 'string') {
                    errorMessage = error;
                }
                
                showNotification(errorMessage, 'error');
            } finally {
                // Restaurar botón
                submitBtn.disabled = false;
                submitText.textContent = 'Enviar PQRS';
                submitIcon.classList.remove('hidden');
                loadingSpinner.classList.add('hidden');
            }
        });
    } else {
        console.error('❌ Formulario PQRS no encontrado');
    }
});

// Enviar email con EmailJS (con retry para error 429)
async function sendPQRSEmail(pqrsData, retryCount = 0) {
    // Verificar configuración
    if (typeof EMAILJS_CONFIG === 'undefined' || EMAILJS_CONFIG.serviceID === 'YOUR_SERVICE_ID') {
        console.warn('📧 EmailJS no configurado - simulando envío');
        console.log('Datos PQRS:', pqrsData);
        await new Promise(resolve => setTimeout(resolve, 1500));
        return { status: 200, text: 'Simulado' };
    }

    try {
        // Preparar parámetros para EmailJS
        const templateParams = {
            from_name: pqrsData.nombre,
            from_email: pqrsData.email,
            from_phone: pqrsData.telefono,
            pqrs_type: pqrsData.tipo,
            pqrs_subject: pqrsData.asunto,
            pqrs_message: pqrsData.mensaje,
            pqrs_id: pqrsData.id,
            pqrs_date: pqrsData.fecha,
            to_email: EMAILJS_CONFIG.destinationEmail || 'contacto@asoreanc.org',
            website_name: 'ASOREANC',
            reply_to: pqrsData.email
        };

        // Debug: mostrar configuración y parámetros
        console.log('📧 Configuración EmailJS:', {
            serviceID: EMAILJS_CONFIG.serviceID,
            templateID: EMAILJS_CONFIG.templateID,
            publicKey: EMAILJS_CONFIG.publicKey ? 'Configurado' : 'No configurado'
        });
        console.log('📝 Parámetros del template:', templateParams);

        // Verificar que emailjs esté disponible
        if (typeof emailjs === 'undefined') {
            throw new Error('EmailJS no está cargado correctamente');
        }

        // Verificar configuración
        if (!EMAILJS_CONFIG.serviceID || EMAILJS_CONFIG.serviceID === 'YOUR_SERVICE_ID') {
            throw new Error('Service ID de EmailJS no configurado correctamente');
        }
        
        if (!EMAILJS_CONFIG.templateID || EMAILJS_CONFIG.templateID === 'YOUR_TEMPLATE_ID') {
            throw new Error('Template ID de EmailJS no configurado correctamente');
        }
        
        if (!EMAILJS_CONFIG.publicKey || EMAILJS_CONFIG.publicKey === 'YOUR_PUBLIC_KEY') {
            throw new Error('Public Key de EmailJS no configurado correctamente');
        }

        // Enviar con EmailJS
        console.log('🚀 Enviando email...');
        const response = await emailjs.send(
            EMAILJS_CONFIG.serviceID,
            EMAILJS_CONFIG.templateID,
            templateParams
        );

        console.log('✅ Email enviado exitosamente:', response);
        return response;

    } catch (error) {
        console.error('❌ Error al enviar email:', error);
        console.error('Detalles del error:', error.status, error.text);
        
        // Retry automático para error 429 (rate limit)
        if (error && error.status === 429 && retryCount < 2) {
            console.log(`🔄 Reintentando envío en 3 segundos... (intento ${retryCount + 1}/2)`);
            await new Promise(resolve => setTimeout(resolve, 3000));
            return sendPQRSEmail(pqrsData, retryCount + 1);
        }
        
        // Mostrar error más específico
        let errorMessage = 'No se pudo enviar el email. ';
        
        if (!error) {
            errorMessage += 'Error desconocido.';
        } else if (error.status) {
            // Error de EmailJS con status code
            switch (error.status) {
                case 400:
                    errorMessage += 'Error en el template o variables de EmailJS.';
                    break;
                case 401:
                    errorMessage += 'Credenciales de EmailJS incorrectas.';
                    break;
                case 402:
                    errorMessage += 'Límite de emails alcanzado en EmailJS.';
                    break;
                case 404:
                    errorMessage += 'Template o Service no encontrado en EmailJS.';
                    break;
                case 429:
                    errorMessage += 'Demasiadas solicitudes. Espera 30 segundos e intenta nuevamente.';
                    break;
                default:
                    errorMessage += `Error ${error.status}: ${error.text || 'Error del servidor'}`;
            }
        } else if (error.message) {
            // Error de JavaScript con mensaje
            if (error.message.includes('Failed to fetch')) {
                errorMessage += 'Error de conexión. Verifica tu conexión a internet o que EmailJS esté funcionando.';
            } else if (error.message.includes('CORS')) {
                errorMessage += 'Error de CORS. Verifica la configuración de EmailJS.';
            } else {
                errorMessage += error.message;
            }
        } else if (typeof error === 'string') {
            // Error como string
            if (error.includes('Failed to fetch')) {
                errorMessage += 'Error de conexión. Verifica tu conexión a internet.';
            } else {
                errorMessage += error;
            }
        } else {
            // Error desconocido
            errorMessage += 'Error inesperado. Por favor intenta nuevamente.';
        }
        
        const finalError = new Error(errorMessage);
        finalError.originalError = error;
        throw finalError;
    }
}

// Generar ID único de PQRS
function generatePQRSId() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `PQRS-${year}${month}${day}-${random}`;
}

// Modal de éxito
function showSuccessModal(radicadoId) {
    document.getElementById('radicado-number').textContent = radicadoId;
    document.getElementById('success-modal').classList.remove('hidden');
}

function closeSuccessModal() {
    document.getElementById('success-modal').classList.add('hidden');
}

// Notificaciones toast
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    const bgColor = type === 'error' ? 'bg-red-500' : 'bg-emerald-500';
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg max-w-sm ${bgColor} text-white transform transition-all duration-300 translate-x-full`;

    notification.innerHTML = `
    <div class="flex items-center justify-between">
      <span>${message}</span>
      <button onclick="this.parentElement.parentElement.remove()" class="ml-2 hover:text-gray-200">✕</button>
    </div>
  `;

    document.body.appendChild(notification);
    setTimeout(() => notification.classList.remove('translate-x-full'), 100);
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Event listeners para cerrar modal
document.addEventListener('click', e => {
    if (e.target.id === 'success-modal') closeSuccessModal();
});

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeSuccessModal();
});