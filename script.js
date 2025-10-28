
// Funcionalidades principales de ASOREANC
document.addEventListener("DOMContentLoaded", () => {
  initSlideshow();
  initMobileMenu();
  initScrollAnimations();
  // initPQRSSystem(); // Deshabilitado - usando pqrs-emailjs.js
  initNotifications();
});

// Sistema de slideshow mejorado
function initSlideshow() {
  const slides = [
    document.getElementById('slide1'),
    document.getElementById('slide2'),
    document.getElementById('slide3')
  ];

  if (!slides[0]) return; // Si no hay slides, salir

  let currentSlide = 0;
  let isPlaying = true;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      if (slide) {
        slide.classList.toggle('opacity-100', i === index);
        slide.classList.toggle('opacity-0', i !== index);
      }
    });
  }

  function nextSlide() {
    if (isPlaying) {
      currentSlide = (currentSlide + 1) % slides.length;
      showSlide(currentSlide);
    }
  }

  function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
  }

  // Controles del slideshow
  const slideshowContainer = document.querySelector('.slideshow-container');
  if (slideshowContainer) {
    slideshowContainer.addEventListener('mouseenter', () => isPlaying = false);
    slideshowContainer.addEventListener('mouseleave', () => isPlaying = true);
  }

  showSlide(currentSlide);
  setInterval(nextSlide, 5000);
}

// Función eliminada - ya no es necesaria con el nuevo sistema

// Menú móvil
function initMobileMenu() {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
  const closeMobileMenu = document.getElementById('close-mobile-menu');

  function openMenu() {
    if (mobileMenu) {
      mobileMenu.classList.remove('hidden');
      mobileMenu.classList.add('open');
      // Forzar estilos para la sidebar - asegurar que esté por encima de todo y ocupe toda la altura
      mobileMenu.style.backgroundColor = '#ffffff';
      mobileMenu.style.background = '#ffffff';
      mobileMenu.style.filter = 'none !important';
      mobileMenu.style.webkitFilter = 'none !important';
      mobileMenu.style.zIndex = '10000';
      mobileMenu.style.opacity = '1';
      mobileMenu.style.position = 'fixed';
      mobileMenu.style.top = '0';
      mobileMenu.style.bottom = '0';
      mobileMenu.style.height = '100vh';
      mobileMenu.style.minHeight = '100vh';
      
      // Forzar que todos los elementos hijos tampoco tengan blur
      const allElements = mobileMenu.querySelectorAll('*');
      allElements.forEach(element => {
        element.style.filter = 'none';
        element.style.webkitFilter = 'none';
      });
      
      // Función para mantener la sidebar sin efectos
      const keepSidebarClear = () => {
        if (mobileMenu && mobileMenu.classList.contains('open')) {
          mobileMenu.style.filter = 'none !important';
          mobileMenu.style.webkitFilter = 'none !important';
          mobileMenu.style.opacity = '1 !important';
          mobileMenu.style.zIndex = '10000';
          mobileMenu.style.backgroundColor = '#ffffff';
          
          allElements.forEach(element => {
            element.style.filter = 'none !important';
            element.style.webkitFilter = 'none !important';
            element.style.opacity = '1';
          });
          requestAnimationFrame(keepSidebarClear);
        }
      };
      keepSidebarClear();
    }
    
    // Agregar clase al body para efectos adicionales
    document.body.classList.add('menu-open');
    document.body.style.overflow = 'hidden';
    
    // Mostrar overlay con efecto de oscurecimiento
    if (mobileMenuOverlay) {
      mobileMenuOverlay.classList.add('show');
      // Forzar la opacidad inmediatamente
      setTimeout(() => {
        mobileMenuOverlay.style.opacity = '1';
      }, 50);
    }
    
    console.log('Menu opened - body class added:', document.body.classList.contains('menu-open'));
  }

  function closeMenu() {
    // Remover efectos del body primero
    document.body.classList.remove('menu-open');
    document.body.style.overflow = 'auto';
    
    // Remover efectos del overlay
    if (mobileMenuOverlay) {
      mobileMenuOverlay.classList.remove('show');
      mobileMenuOverlay.style.opacity = '0';
    }
    
    // Cerrar sidebar
    if (mobileMenu) {
      mobileMenu.classList.add('hidden');
      mobileMenu.classList.remove('open');
    }
    
    console.log('Menu closed - body class removed:', !document.body.classList.contains('menu-open'));
  }

  // Función global para toggle (para compatibilidad con archivos existentes)
  window.toggleMobileMenu = function() {
    if (mobileMenu && mobileMenu.classList.contains('hidden')) {
      openMenu();
    } else {
      closeMenu();
    }
  };

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', openMenu);

    if (closeMobileMenu) {
      closeMobileMenu.addEventListener('click', closeMenu);
    }

    // Cerrar menú al hacer click en el overlay
    if (mobileMenuOverlay) {
      mobileMenuOverlay.addEventListener('click', closeMenu);
    }

    // Cerrar menú al hacer click en un enlace
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', closeMenu);
    });
  }
}

// Animaciones al hacer scroll
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fadeInUp');
      }
    });
  }, observerOptions);

  // Observar elementos con la clase 'animate-on-scroll'
  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
  });
}

// Sistema PQRS DESHABILITADO - Ahora usamos pqrs-emailjs.js
function initPQRSSystem() {
  // Esta función está deshabilitada para evitar conflictos con EmailJS
  console.log('⚠️ Sistema PQRS del script.js deshabilitado - usando EmailJS');
  return; // Salir inmediatamente sin hacer nada
  
  /*
  const pqrsForm = document.getElementById('pqrs-form');
  if (!pqrsForm) return;
  // ... resto del código comentado
  */
}

function savePQRS(pqrsData) {
  let pqrsList = JSON.parse(localStorage.getItem('pqrs-asoreanc') || '[]');
  pqrsList.push(pqrsData);
  localStorage.setItem('pqrs-asoreanc', JSON.stringify(pqrsList));
}

// Función FormSubmit eliminada - Solo usamos EmailJS ahora

// Sistema de notificaciones
function initNotifications() {
  // Crear contenedor de notificaciones si no existe
  if (!document.getElementById('notifications-container')) {
    const container = document.createElement('div');
    container.id = 'notifications-container';
    container.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 1000;';
    document.body.appendChild(container);
  }
}

function showNotification(message, type = 'success') {
  const container = document.getElementById('notifications-container');
  const notification = document.createElement('div');

  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <div class="flex items-center">
      <span>${message}</span>
      <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-white hover:text-gray-200">
        ✕
      </button>
    </div>
  `;

  container.appendChild(notification);

  // Mostrar notificación
  setTimeout(() => notification.classList.add('show'), 100);

  // Auto-remover después de 5 segundos
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 5000);
}

// Función para ver PQRS guardados (para administradores)
function viewPQRS() {
  const pqrsList = JSON.parse(localStorage.getItem('pqrs-asoreanc') || '[]');
  console.table(pqrsList);
  return pqrsList;
}

// Función para limpiar PQRS (para administradores)
function clearPQRS() {
  if (confirm('¿Estás seguro de que quieres eliminar todos los PQRS?')) {
    localStorage.removeItem('pqrs-asoreanc');
    showNotification('PQRS eliminados correctamente', 'success');
  }
}

// Smooth scroll para enlaces internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Efecto parallax suave
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const parallaxElements = document.querySelectorAll('.parallax-element');

  parallaxElements.forEach(element => {
    const speed = element.dataset.speed || 0.5;
    element.style.transform = `translateY(${scrolled * speed}px)`;
  });
});