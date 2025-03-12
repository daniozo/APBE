// Initialisation des animations AOS
AOS.init({
  duration: 1000,
  once: true,
  offset: 100
});

// Gestion de la navbar au scroll
window.addEventListener('scroll', function () {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Gestion du formulaire d'inscription
document.getElementById('inscriptionForm').addEventListener('submit', function (e) {
  e.preventDefault();

  // Validation des champs requis
  const requiredFields = ['nom_prenom', 'telephone', 'email'];
  for (let field of requiredFields) {
    if (!this.elements[field].value.trim()) {
      showNotification(`Le champ ${field.replace('_', ' ')} est requis`, 'error');
      return;
    }
  }

  // Validation du format email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(this.elements['email'].value)) {
    showNotification("Format d'email invalide", 'error');
    return;
  }

  const formData = new FormData(this);
  const submitButton = this.querySelector('button[type="submit"]');

  // Désactiver le bouton pendant l'envoi
  submitButton.disabled = true;
  submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Envoi en cours...';

  // Envoi du formulaire
  fetch(this.action, {
    method: 'POST',
    body: formData
  })
    .then(response => response.json())
    .then(data => {
      if (data.status === "success") {
        showNotification('Inscription réussie !', 'success');
        this.reset();
        bootstrap.Modal.getInstance(document.getElementById('inscriptionModal')).hide();
      } else {
        throw new Error(data.message || "Erreur lors de l'envoi");
      }
    })
    .catch(error => {
      showNotification("Erreur : " + error.message, 'error');
    })
    .finally(() => {
      submitButton.disabled = false;
      submitButton.textContent = "S'inscrire";
    });
});

// Fonction pour afficher les notifications
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `alert alert-${type === 'error' ? 'danger' : 'success'} notification`;
  notification.role = 'alert';
  notification.textContent = message;

  document.body.appendChild(notification);

  // Animation d'entrée
  setTimeout(() => notification.classList.add('show'), 100);

  // Suppression automatique après 5 secondes
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 5000);
}

// Smooth scroll pour les liens d'ancrage
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

// Animation des compteurs pour les statistiques
function animateCounter(element) {
  const target = parseInt(element.getAttribute('data-target'));
  const duration = 2000; // 2 secondes
  const step = target / (duration / 16); // 60 FPS
  let current = 0;

  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      element.textContent = target;
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current);
    }
  }, 16);
}

// Observer pour déclencher les animations au scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      if (entry.target.classList.contains('counter')) {
        animateCounter(entry.target);
      }
      entry.target.classList.add('animate');
    }
  });
}, {
  threshold: 0.5
});

// Observer les éléments avec animation
document.querySelectorAll('.animate-on-scroll').forEach(element => {
  observer.observe(element);
}); 