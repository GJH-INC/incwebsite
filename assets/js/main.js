// Mobile menu toggle
document.getElementById('menu-button').addEventListener('click', function() {
  var menu = document.getElementById('mobile-menu');
  menu.classList.toggle('hidden');
});

// Contact form validation
(function() {
  var form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    var name = document.getElementById('contact-name');
    var email = document.getElementById('contact-email');
    var message = document.getElementById('contact-message');
    var valid = true;

    // Clear previous errors
    [name, email, message].forEach(function(el) {
      el.classList.remove('border-red-500');
      var err = el.parentNode.querySelector('.error-msg');
      if (err) err.remove();
    });

    // Validate name
    if (!name.value.trim() || name.value.trim().length < 2) {
      showError(name, 'Please enter your full name');
      valid = false;
    }

    // Validate email
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.value.trim())) {
      showError(email, 'Please enter a valid email address');
      valid = false;
    }

    // Validate message
    if (!message.value.trim() || message.value.trim().length < 10) {
      showError(message, 'Please enter a message (at least 10 characters)');
      valid = false;
    }

    if (!valid) {
      e.preventDefault();
    }
  });

  function showError(el, msg) {
    el.classList.add('border-red-500');
    var span = document.createElement('span');
    span.className = 'error-msg text-red-500 text-sm mt-1 block';
    span.textContent = msg;
    el.parentNode.appendChild(span);
  }
})();
