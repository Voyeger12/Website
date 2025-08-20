// ========== KONTAKTFORMULAR LOGIK ==========

// Sucht nach dem Formular auf der aktuellen Seite.
const contactForm = document.getElementById('contact-form');

// Führt den Code nur aus, WENN das Formular auf der Seite existiert.
if (contactForm) {
  const successMessage = document.getElementById('success-message');

  // Fügt einen Event Listener für das "submit"-Ereignis hinzu.
  contactForm.addEventListener('submit', function(event) {
    
    // 1. Verhindert das Standard-Verhalten des Browsers (Seite neu laden).
    event.preventDefault();
    
    console.log("Formular abgeschickt (simuliert).");

    // 2. Versteckt das Formular.
    contactForm.style.display = 'none';
    
    // 3. Zeigt die Erfolgsmeldung an.
    successMessage.style.display = 'block';

  });
}