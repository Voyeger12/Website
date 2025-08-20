/**
 * Cookie-Banner Script für die Metrorealms Website
 * 
 * Dieses Script verwaltet die Cookie-Zustimmung des Benutzers.
 * Es zeigt das Banner nur an, wenn keine Zustimmung vorliegt.
 * 
 * Funktionen:
 * - Überprüfung der LocalStorage-Verfügbarkeit
 * - Anzeige des Cookie-Banners bei fehlender Zustimmung
 * - Speicherung der Benutzer-Zustimmung
 * - Ausblenden des Banners mit Übergangseffekt
 */

// Wartet, bis das gesamte HTML-Dokument geladen ist
document.addEventListener('DOMContentLoaded', function() {
    // Holt sich die HTML-Elemente
    const cookieBanner = document.querySelector('.cookie-banner');
    const acceptBtn = document.getElementById('cookieAcceptBtn');
    
    // Fehlerbehandlung: Überprüfung ob alle Elemente gefunden wurden
    if (!cookieBanner) {
        console.error("KRITISCHER FEHLER: Das Cookie-Banner Element '.cookie-banner' wurde nicht gefunden!");
        return;
    }
    
    if (!acceptBtn) {
        console.error("KRITISCHER FEHLER: Der Button mit der ID 'cookieAcceptBtn' wurde nicht gefunden!");
        return;
    }
    
    /**
     * Überprüft, ob LocalStorage verfügbar ist
     * @returns {boolean} True wenn LocalStorage verfügbar ist, false wenn nicht
     */
    function isLocalStorageAvailable() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            console.warn("LocalStorage ist nicht verfügbar:", e.message);
            return false;
        }
    }
    
    // Überprüfung der LocalStorage-Verfügbarkeit
    if (!isLocalStorageAvailable()) {
        console.warn("WARNUNG: LocalStorage ist in diesem Browser nicht verfügbar. Cookie-Banner wird immer angezeigt.");
        // Banner anzeigen, da wir keine Zustimmung speichern können
        showCookieBanner();
        return;
    }
    
    /**
     * Zeigt das Cookie-Banner an
     */
    function showCookieBanner() {
        console.log("Cookie-Banner wird angezeigt");
        cookieBanner.style.display = 'flex';
        cookieBanner.style.opacity = '1';
    }
    
    /**
     * Versteckt das Cookie-Banner mit Übergangseffekt
     */
    function hideCookieBanner() {
        console.log("Cookie-Banner wird versteckt");
        cookieBanner.style.transition = 'opacity 0.5s ease';
        cookieBanner.style.opacity = '0';
        
        // Nach dem Übergangseffekt komplett verstecken
        setTimeout(function() {
            cookieBanner.style.display = 'none';
        }, 500);
    }
    
    /**
     * Überprüft die bestehende Cookie-Zustimmung
     * @returns {boolean} True wenn Zustimmung vorhanden ist
     */
    function hasUserConsented() {
        try {
            const consent = localStorage.getItem('cookieConsentGiven');
            console.log("Gespeicherte Zustimmung gefunden:", consent);
            return consent === 'true';
        } catch (e) {
            console.warn("Fehler beim Lesen der Zustimmung:", e.message);
            return false;
        }
    }
    
    /**
     * Speichert die Cookie-Zustimmung des Benutzers
     */
    function saveUserConsent() {
        try {
            localStorage.setItem('cookieConsentGiven', 'true');
            console.log("Benutzer-Zustimmung wurde erfolgreich gespeichert");
            return true;
        } catch (e) {
            console.error("Fehler beim Speichern der Zustimmung:", e.message);
            return false;
        }
    }
    
    // Hauptlogik: Entscheiden ob Banner angezeigt werden soll
    if (hasUserConsented()) {
        console.log("Zustimmung bereits vorhanden - Banner bleibt versteckt");
        // Banner explizit verstecken (falls CSS-Konflikt vorliegt)
        cookieBanner.style.display = 'none';
    } else {
        console.log("Keine Zustimmung gefunden - Banner wird angezeigt");
        showCookieBanner();
    }
    
    // Event Listener für den Akzeptieren-Button
    acceptBtn.addEventListener('click', function(event) {
        // Verhindert Standard-Button-Verhalten
        event.preventDefault();
        
        console.log("Akzeptieren-Button wurde geklickt");
        
        // Zustimmung speichern
        if (saveUserConsent()) {
            // Banner verstecken
            hideCookieBanner();
        } else {
            console.error("Zustimmung konnte nicht gespeichert werden!");
            // Banner trotzdem verstecken für diese Sitzung
            hideCookieBanner();
        }
    });
    
    // Zusätzlicher Debug-Event: Überwacht LocalStorage-Änderungen
    window.addEventListener('storage', function(e) {
        if (e.key === 'cookieConsentGiven') {
            console.log("Cookie-Zustimmung wurde in anderem Tab geändert:", e.newValue);
        }
    });
    
    // Debug-Funktion: Zustimmung zurücksetzen (nur für Entwicklung)
    window.resetCookieConsent = function() {
        localStorage.removeItem('cookieConsentGiven');
        console.log("Cookie-Zustimmung wurde zurückgesetzt");
        location.reload(); // Seite neu laden
    };
    
    console.log("Cookie-Banner Script wurde erfolgreich initialisiert");
});