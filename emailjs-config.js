// Configuración de EmailJS para el sistema PQRS de ASOREANC
// 
// INSTRUCCIONES DE CONFIGURACIÓN:
// 1. Ve a https://www.emailjs.com/ y crea una cuenta gratuita
// 2. Configura Gmail como servicio de email
// 3. Crea un template con las variables especificadas abajo
// 4. Reemplaza los valores YOUR_* con tus credenciales reales

const EMAILJS_CONFIG = {
  // Reemplaza con tu Service ID de EmailJS (ej: 'service_abc123')
  serviceID: 'service_toxwr7j',

  // Reemplaza con tu Template ID de EmailJS (ej: 'template_xyz789')
  templateID: 'template_e17k6gi',

  // Reemplaza con tu Public Key de EmailJS (ej: 'user_abcdef123456')
  publicKey: 'LeDpi2sk_feso3Coi',

  // Email de destino donde llegan las PQRS (cambiar por tu email real)
  destinationEmail: 'crisnegocios25@gmail.com'
};

// TEMPLATE PARA EMAILJS - Copia esto exactamente:
/*
CONFIGURACIÓN DEL TEMPLATE EN EMAILJS:

1. Ve a https://dashboard.emailjs.com/admin/templates
2. Edita tu template (template_e17k6gi)
3. Configura así:

SUBJECT:
Nueva PQRS {{pqrs_type}} - {{pqrs_id}} - ASOREANC

CONTENT:
NUEVA PQRS RECIBIDA - ASOREANC
================================

Número de Radicado: {{pqrs_id}}
Fecha: {{pqrs_date}}
Tipo: {{pqrs_type}}

DATOS DEL SOLICITANTE:
----------------------
Nombre: {{from_name}}
Email: {{from_email}}
Teléfono: {{from_phone}}

SOLICITUD:
----------
Asunto: {{pqrs_subject}}

Mensaje:
{{pqrs_message}}

================================
Este mensaje fue enviado desde el sistema PQRS de ASOREANC
Para responder, contacta directamente al solicitante: {{from_email}}

SETTINGS:
- To Email: {{to_email}}
- Reply To: {{reply_to}}
- From Name: ASOREANC Sistema PQRS

VARIABLES REQUERIDAS (asegúrate de que estén en el template):
✓ {{pqrs_id}}
✓ {{pqrs_date}}
✓ {{pqrs_type}}
✓ {{from_name}}
✓ {{from_email}}
✓ {{from_phone}}
✓ {{pqrs_subject}}
✓ {{pqrs_message}}
✓ {{to_email}}
✓ {{reply_to}}
*/