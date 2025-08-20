/**
 * News Filter & Pagination System für Metrorealms
 * Datei: news-filter.js
 * 
 * Diese Datei verwaltet die Filterung und Pagination für News, Reviews und Guides
 * Verwendung: <script src="news-filter.js" defer></script>
 */

class NewsFilterSystem {
    constructor() {
        // Konfiguration
        this.articlesPerPage = 8    ;
        this.currentPage = 1;
        
        // Prüfen ob die nötigen Elemente vorhanden sind
        if (!this.checkRequiredElements()) {
            console.log("Filter-System nicht geladen - keine Filter-Elemente gefunden");
            return;
        }
        
        // System initialisieren
        this.initializeElements();
        this.loadAllArticles();
        this.setupEventListeners();
        this.injectStyles();
        this.updateDisplay();
        
        console.log("🎮 News Filter System erfolgreich initialisiert");
    }
    
    /**
     * Prüft ob die benötigten HTML-Elemente vorhanden sind
     * @returns {boolean} True wenn Filter-Elemente gefunden wurden
     */
    checkRequiredElements() {
        return document.querySelector('.filter-sort-bar') && document.querySelector('.item-grid');
    }
    
    /**
     * Findet und speichert alle wichtigen HTML-Elemente
     */
    initializeElements() {
        this.itemGrid = document.querySelector('.item-grid');
        this.categoryFilter = document.getElementById('category-filter');
        this.sortBy = document.getElementById('sort-by');
        this.pagination = document.querySelector('.pagination');
        
        if (!this.itemGrid) {
            console.error("FEHLER: .item-grid Element nicht gefunden!");
            return;
        }
        
        console.log("📋 HTML-Elemente erfolgreich gefunden");
    }
    
    /**
     * Lädt alle Artikel aus dem DOM und konvertiert sie in JavaScript-Objekte
     */
    loadAllArticles() {
        const articleCards = this.itemGrid.querySelectorAll('.item-card');
        this.allArticles = [];
        
        articleCards.forEach((card, index) => {
            const img = card.querySelector('img');
            const title = card.querySelector('h4');
            const description = card.querySelector('p');
            const tag = card.querySelector('.tag');
            const link = card.getAttribute('href');
            
            // Artikel-Objekt erstellen
            const article = {
                id: index,
                title: title ? title.textContent.trim() : '',
                description: description ? description.textContent.trim() : '',
                category: tag ? tag.textContent.trim().toLowerCase() : 'news',
                image: img ? img.src : '',
                imageAlt: img ? img.alt : '',
                link: link || '#',
                // Zufälliges Datum für Demo (echte App würde Server-Daten nutzen)
                date: new Date(2025, 0, Math.floor(Math.random() * 30) + 1)
            };
            
            this.allArticles.push(article);
        });
        
        console.log(`📰 ${this.allArticles.length} Artikel erfolgreich geladen`);
    }
    
    /**
     * Fügt CSS-Styles für das Filter-System hinzu
     */
    injectStyles() {
        if (document.querySelector('#news-filter-styles')) return;
        
        const styleElement = document.createElement('style');
        styleElement.id = 'news-filter-styles';
        styleElement.textContent = `
            .no-results {
                grid-column: 1 / -1;
                text-align: center;
                padding: 4rem 2rem;
                background-color: var(--background-dark);
                border: 2px solid var(--border-subtle);
                border-radius: 1rem;
                color: var(--text-color);
            }
            .no-results h3 {
                color: white;
                margin-bottom: 1rem;
                font-size: 1.8rem;
            }
            .no-results p {
                font-size: 1.1rem;
                opacity: 0.8;
            }
            .pagination a {
                cursor: pointer;
                user-select: none;
            }
            .pagination a:hover {
                transform: translateY(-2px);
            }
            .filter-loading {
                grid-column: 1 / -1;
                text-align: center;
                padding: 2rem;
                color: var(--text-color);
            }
        `;
        document.head.appendChild(styleElement);
    }
    
    /**
     * Registriert alle Event Listener für Interaktionen
     */
    setupEventListeners() {
        // Kategorie-Filter
        if (this.categoryFilter) {
            this.categoryFilter.addEventListener('change', () => {
                console.log("📂 Kategorie-Filter geändert:", this.categoryFilter.value);
                this.currentPage = 1;
                this.updateDisplay();
            });
        }
        
        // Sortier-Dropdown
        if (this.sortBy) {
            this.sortBy.addEventListener('change', () => {
                console.log("🔄 Sortierung geändert:", this.sortBy.value);
                this.currentPage = 1;
                this.updateDisplay();
            });
        }
        
        console.log("🎯 Event Listener erfolgreich registriert");
    }
    
    /**
     * Filtert Artikel basierend auf der gewählten Kategorie
     */
    filterArticles(articles) {
        if (!this.categoryFilter || this.categoryFilter.value === 'all') {
            return articles;
        }
        
        const selectedCategory = this.categoryFilter.value.toLowerCase();
        return articles.filter(article => {
            const articleCategory = article.category.toLowerCase();
            
            // Flexible Kategoriezuordnung
            const categoryMappings = {
                'hardware': ['hardware', 'technik'],
                'indie': ['indie'],
                'esports': ['e-sports', 'esports'],
                'retro': ['retro'],
                'mobile': ['mobile'],
                'event': ['event'],
                'review': ['review'],
                'guide': ['guide'],
                'news': ['news']
            };
            
            const mappedCategories = categoryMappings[selectedCategory] || [selectedCategory];
            return mappedCategories.includes(articleCategory);
        });
    }
    
    /**
     * Sortiert Artikel basierend auf der gewählten Sortierung
     */
    sortArticles(articles) {
        if (!this.sortBy) return articles;
        
        const sortValue = this.sortBy.value;
        
        switch(sortValue) {
            case 'date-desc':
                return [...articles].sort((a, b) => b.date - a.date);
            case 'date-asc':
                return [...articles].sort((a, b) => a.date - b.date);
            case 'title-asc':
                return [...articles].sort((a, b) => a.title.localeCompare(b.title));
            case 'title-desc':
                return [...articles].sort((a, b) => b.title.localeCompare(a.title));
            default:
                return articles;
        }
    }
    
    /**
     * Teilt Artikel in Seiten auf und gibt die aktuelle Seite zurück
     */
    paginateArticles(articles) {
        const startIndex = (this.currentPage - 1) * this.articlesPerPage;
        const endIndex = startIndex + this.articlesPerPage;
        return articles.slice(startIndex, endIndex);
    }
    
    /**
     * Erstellt HTML für einen einzelnen Artikel
     */
    createArticleHTML(article) {
        return `
            <a href="${article.link}" class="item-card">
                <img src="${article.image}" alt="${article.imageAlt}">
                <div class="item-card-content">
                    <h4>${article.title}</h4>
                    <p>${article.description}</p>
                    <span class="tag">${article.category.toUpperCase()}</span>
                </div>
            </a>
        `;
    }
    
    /**
     * Aktualisiert die Artikel-Anzeige im DOM
     */
    updateArticleDisplay(articles) {
        if (!this.itemGrid) return;
        
        // Lade-Animation anzeigen
        this.itemGrid.innerHTML = `
            <div class="filter-loading">
                <i class="fas fa-spinner fa-spin" style="font-size: 2rem; color: var(--accent-color);"></i>
                <p style="margin-top: 1rem;">Artikel werden geladen...</p>
            </div>
        `;
        
        // Kleine Verzögerung für bessere UX
        setTimeout(() => {
            if (articles.length === 0) {
                this.itemGrid.innerHTML = `
                    <div class="no-results">
                        <i class="fas fa-search" style="font-size: 3rem; color: var(--accent-color); margin-bottom: 1rem;"></i>
                        <h3>Keine Artikel gefunden</h3>
                        <p>Versuche andere Filter oder schaue später wieder vorbei.</p>
                    </div>
                `;
                return;
            }
            
            const articlesHTML = articles.map(article => this.createArticleHTML(article)).join('');
            this.itemGrid.innerHTML = articlesHTML;
            
            console.log(`✅ ${articles.length} Artikel angezeigt`);
        }, 200);
    }
    
    /**
     * Berechnet und erstellt die Pagination-Navigation
     */
    updatePagination(totalArticles) {
        if (!this.pagination) return;
        
        const totalPages = Math.ceil(totalArticles / this.articlesPerPage);
        
        if (totalPages <= 1) {
            this.pagination.innerHTML = '';
            return;
        }
        
        let paginationHTML = '';
        
        // Vorherige Seite
        if (this.currentPage > 1) {
            paginationHTML += `<a href="#" data-page="${this.currentPage - 1}" title="Vorherige Seite">&laquo;</a>`;
        }
        
        // Seitenzahlen (intelligente Anzeige)
        for (let i = 1; i <= totalPages; i++) {
            if (i === this.currentPage) {
                paginationHTML += `<span class="current">${i}</span>`;
            } else if (
                i === 1 || 
                i === totalPages || 
                (i >= this.currentPage - 1 && i <= this.currentPage + 1)
            ) {
                paginationHTML += `<a href="#" data-page="${i}" title="Seite ${i}">${i}</a>`;
            } else if (i === this.currentPage - 2 || i === this.currentPage + 2) {
                paginationHTML += `<span>...</span>`;
            }
        }
        
        // Nächste Seite
        if (this.currentPage < totalPages) {
            paginationHTML += `<a href="#" data-page="${this.currentPage + 1}" title="Nächste Seite">&raquo;</a>`;
        }
        
        this.pagination.innerHTML = paginationHTML;
        
        // Event Listener für Pagination-Links
        this.pagination.querySelectorAll('a[data-page]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const newPage = parseInt(e.target.getAttribute('data-page'));
                this.goToPage(newPage);
            });
        });
        
        console.log(`📄 Pagination aktualisiert - Seite ${this.currentPage} von ${totalPages}`);
    }
    
    /**
     * Wechselt zu einer bestimmten Seite
     */
    goToPage(pageNumber) {
        this.currentPage = pageNumber;
        this.updateDisplay();
        
        // Sanft nach oben scrollen
        const target = document.querySelector('.content-section') || document.querySelector('.page-header');
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
        
        console.log(`📄 Zu Seite ${pageNumber} gewechselt`);
    }
    
    /**
     * Hauptfunktion: Aktualisiert die gesamte Anzeige
     */
    updateDisplay() {
        // 1. Artikel filtern
        let filteredArticles = this.filterArticles(this.allArticles);
        
        // 2. Artikel sortieren
        filteredArticles = this.sortArticles(filteredArticles);
        
        // 3. Pagination aktualisieren
        this.updatePagination(filteredArticles.length);
        
        // 4. Artikel für aktuelle Seite holen
        const pageArticles = this.paginateArticles(filteredArticles);
        
        // 5. Artikel anzeigen
        this.updateArticleDisplay(pageArticles);
        
        // Debug-Info
        const filterValue = this.categoryFilter ? this.categoryFilter.value : 'keine';
        const sortValue = this.sortBy ? this.sortBy.value : 'keine';
        console.log(`🎯 Display Update: Filter=${filterValue}, Sort=${sortValue}, Seite=${this.currentPage}, Artikel=${pageArticles.length}/${filteredArticles.length}`);
    }
    
    /**
     * Öffentliche Methoden für externe Steuerung
     */
    resetFilters() {
        if (this.categoryFilter) this.categoryFilter.value = 'all';
        if (this.sortBy) this.sortBy.value = 'date-desc';
        this.currentPage = 1;
        this.updateDisplay();
        console.log("🔄 Filter wurden zurückgesetzt");
    }
    
    setArticlesPerPage(count) {
        this.articlesPerPage = Math.max(1, count);
        this.currentPage = 1;
        this.updateDisplay();
        console.log(`📰 Artikel pro Seite auf ${count} gesetzt`);
    }
}

// System automatisch initialisieren wenn DOM geladen ist
document.addEventListener('DOMContentLoaded', function() {
    // Prüfen ob Filter-Elemente vorhanden sind
    if (document.querySelector('.filter-sort-bar') && document.querySelector('.item-grid')) {
        // System initialisieren
        window.newsFilterSystem = new NewsFilterSystem();
        
        // Debug-Funktionen global verfügbar machen
        window.resetNewsFilters = () => {
            if (window.newsFilterSystem) {
                window.newsFilterSystem.resetFilters();
            }
        };
        
        window.setArticlesPerPage = (count) => {
            if (window.newsFilterSystem) {
                window.newsFilterSystem.setArticlesPerPage(count);
            }
        };
        
        console.log("🎮 Metrorealms Filter System bereit!");
        console.log("Debug: resetNewsFilters(), setArticlesPerPage(anzahl)");
    }
});