function initOptionsController() {
    // Selectores principales
    const themeLinks = document.querySelectorAll('[data-action="setTheme"]');
    const langLinks = document.querySelectorAll('[data-action="setLanguage"]');
    const html = document.documentElement;
    const locationListContainer = document.querySelector('[data-location-list]');

    // Selectores para los valores activos en el menú
    const appearanceValue = document.querySelector('[data-value-for="appearance"]');
    const languageValue = document.querySelector('[data-value-for="language"]');
    const locationValue = document.querySelector('[data-value-for="location"]');

    // --- LÓGICA DEL TEMA ---
    function applyTheme(theme) {
        html.classList.remove('dark-theme', 'light-theme');
        if (theme === 'dark') {
            html.classList.add('dark-theme');
        } else if (theme === 'light') {
            html.classList.add('light-theme');
        } else { // 'system'
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                html.classList.add('dark-theme');
            } else {
                html.classList.add('light-theme');
            }
        }
    }

    function setActiveTheme(theme) {
        themeLinks.forEach(link => {
            link.classList.remove('active');
            if (link.dataset.theme === theme) {
                link.classList.add('active');
                if (appearanceValue) {
                    appearanceValue.textContent = link.querySelector('.menu-link-text span').textContent;
                }
            }
        });
        applyTheme(theme);
        localStorage.setItem('userTheme', theme);
    }
    themeLinks.forEach(link => link.addEventListener('click', () => setActiveTheme(link.dataset.theme)));

    // --- LÓGICA DEL IDIOMA ---
    function setActiveLanguage(langCode) {
        let matched = false;
        let activeLangText = '';

        langLinks.forEach(link => {
            link.classList.remove('active');
            const linkLang = link.dataset.lang.toLowerCase();
            if (linkLang === langCode.toLowerCase()) {
                link.classList.add('active');
                activeLangText = link.querySelector('.menu-link-text span').textContent;
                matched = true;
            }
        });

        if (!matched) {
            const baseLang = langCode.split('-')[0].toLowerCase();
            for (const link of langLinks) {
                if (link.dataset.lang.toLowerCase().startsWith(baseLang)) {
                    link.classList.add('active');
                    activeLangText = link.querySelector('.menu-link-text span').textContent;
                    matched = true;
                    break;
                }
            }
        }
        
        if (!matched) {
            const defaultLangLink = document.querySelector('[data-lang="en-US"]');
            if (defaultLangLink) {
                defaultLangLink.classList.add('active');
                activeLangText = defaultLangLink.querySelector('.menu-link-text span').textContent;
            }
        }

        if (languageValue) {
            languageValue.textContent = activeLangText;
        }
        localStorage.setItem('userLanguage', langCode);
    }
    langLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.stopPropagation();
            setActiveLanguage(link.dataset.lang);
        });
    });

    // --- LÓGICA DE UBICACIÓN ---
    async function populateCountries() {
        try {
            const { countries } = await import('https://cdn.jsdelivr.net/npm/countries-list@3.1.1/+esm');
            
            locationListContainer.innerHTML = ''; 

            Object.entries(countries).forEach(([code, country]) => {
                const countryDiv = document.createElement('div');
                countryDiv.className = 'menu-link';
                countryDiv.dataset.action = 'setLocation';
                countryDiv.dataset.countryCode = code;
                
                countryDiv.innerHTML = `
                    <div class="menu-link-icon"><span class="material-symbols-rounded">globe_location_pin</span></div>
                    <div class="menu-link-text"><span>${country.name}</span></div>
                `;
                locationListContainer.appendChild(countryDiv);
            });
            
            document.querySelectorAll('[data-action="setLocation"]').forEach(link => {
                link.addEventListener('click', () => {
                    setActiveCountry(link.dataset.countryCode);
                });
            });

        } catch (error) {
            console.error("Error al cargar la lista de países:", error);
            locationListContainer.innerHTML = `<div class="menu-link-text" style="padding: 10px;">Error al cargar países.</div>`;
        }
    }

    function setActiveCountry(countryCode) {
        document.querySelectorAll('[data-action="setLocation"]').forEach(link => {
            link.classList.remove('active');
            if (link.dataset.countryCode.toUpperCase() === countryCode.toUpperCase()) {
                link.classList.add('active');
                if (locationValue) {
                    locationValue.textContent = link.querySelector('.menu-link-text span').textContent;
                }
            }
        });
        localStorage.setItem('userLocation', countryCode);
    }

    async function initializeLocation() {
        await populateCountries();
        
        const savedLocation = localStorage.getItem('userLocation');

        if (savedLocation) {
            setActiveCountry(savedLocation);
        } else {
            try {
                const response = await fetch('https://ipwho.is/');
                if (!response.ok) throw new Error('Respuesta de red no fue OK');
                
                const data = await response.json();
                if (data && data.country_code) {
                    setActiveCountry(data.country_code);
                }
            } catch (error) {
                console.error("Error al obtener la ubicación por IP:", error);
            }
        }
    }

    // --- INICIALIZACIÓN ---
    function initialize() {
        setActiveTheme(localStorage.getItem('userTheme') || 'system');
        setActiveLanguage(localStorage.getItem('userLanguage') || navigator.language);
        initializeLocation();
    }

    initialize();
}

export { initOptionsController };