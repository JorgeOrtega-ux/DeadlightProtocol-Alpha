// Ámbito del módulo: estas variables son privadas pero persistentes para este módulo.
let activeChangeProcess = null;

/**
 * Cancela cualquier proceso de cambio de configuración que esté en curso.
 * Esta función se exporta para que otros módulos puedan llamarla.
 */
export function cancelActiveChange() {
    if (!activeChangeProcess) return;

    console.log("Cambio cancelado por cierre del módulo.");
    clearTimeout(activeChangeProcess.timeoutId);

    // Revierte la UI a su estado original usando la información guardada
    activeChangeProcess.allLinks.forEach(link => link.classList.remove('disabled-interactive'));
    activeChangeProcess.clickedLink.classList.remove('preview-active');
    
    const loader = activeChangeProcess.clickedLink.querySelector('.loader-container');
    if (loader) loader.remove();

    if (activeChangeProcess.rightIcon) {
        activeChangeProcess.rightIcon.style.display = activeChangeProcess.originalRightIconDisplay || '';
    }

    if (activeChangeProcess.previouslyActiveLink) {
        activeChangeProcess.previouslyActiveLink.classList.add('active');
    }

    activeChangeProcess = null; // Limpia el proceso activo
}

/**
 * Inicializa toda la funcionalidad del menú de opciones.
 */
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
    
    function handleSettingChange(clickedLink, allLinks, applyChangeCallback) {
        if (clickedLink.classList.contains('active') || clickedLink.classList.contains('disabled-interactive')) {
            return;
        }

        const previouslyActiveLink = Array.from(allLinks).find(link => link.classList.contains('active'));

        if (previouslyActiveLink) {
            previouslyActiveLink.classList.remove('active');
        }
        
        allLinks.forEach(link => link.classList.add('disabled-interactive'));
        clickedLink.classList.add('preview-active');

        const rightIcon = clickedLink.querySelector('.menu-link-icon:last-child');
        let originalRightIconDisplay = '';
        if (rightIcon && !rightIcon.querySelector('.loader-spinner')) {
             originalRightIconDisplay = window.getComputedStyle(rightIcon).display;
             rightIcon.style.display = 'none';
        }
        
        const spinnerContainer = document.createElement('div');
        spinnerContainer.className = 'menu-link-icon loader-container';
        spinnerContainer.innerHTML = `<div class="loader-spinner"></div>`;
        clickedLink.appendChild(spinnerContainer);

        const timeoutId = setTimeout(() => {
            try {
                const isSuccess = true;
                if (isSuccess) {
                    clickedLink.classList.add('active');
                    applyChangeCallback();
                } else {
                    throw new Error("Simulación de error al aplicar el cambio.");
                }
            } catch (error) {
                console.error(error.message);
                if (previouslyActiveLink) {
                    previouslyActiveLink.classList.add('active');
                }
            } finally {
                allLinks.forEach(link => link.classList.remove('disabled-interactive'));
                clickedLink.classList.remove('preview-active');
                
                const loader = clickedLink.querySelector('.loader-container');
                if(loader) loader.remove();

                if (rightIcon) {
                    rightIcon.style.display = originalRightIconDisplay || '';
                }
                activeChangeProcess = null; // Finaliza el proceso
            }
        }, 2000);

        // Almacena la información en la variable del módulo
        activeChangeProcess = {
            timeoutId,
            clickedLink,
            allLinks,
            previouslyActiveLink,
            rightIcon,
            originalRightIconDisplay
        };
    }

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
            if (link.dataset.theme === theme) {
                if (appearanceValue) {
                    appearanceValue.textContent = link.querySelector('.menu-link-text span').textContent;
                }
            }
        });
        applyTheme(theme);
    }
    
    themeLinks.forEach(link => link.addEventListener('click', () => {
        handleSettingChange(link, themeLinks, () => {
            const theme = link.dataset.theme;
            setActiveTheme(theme);
            localStorage.setItem('userTheme', theme);
        });
    }));

    function setActiveLanguage(langCode) {
        let matched = false;
        let activeLangText = '';

        langLinks.forEach(link => link.classList.remove('active'));

        for (const link of langLinks) {
            if (link.dataset.lang.toLowerCase() === langCode.toLowerCase()) {
                link.classList.add('active');
                activeLangText = link.querySelector('.menu-link-text span').textContent;
                matched = true;
                break;
            }
        }
        
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
    }

    langLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.stopPropagation();
            handleSettingChange(link, langLinks, () => {
                const lang = link.dataset.lang;
                if (languageValue) {
                    languageValue.textContent = link.querySelector('.menu-link-text span').textContent;
                }
                localStorage.setItem('userLanguage', lang);
            });
        });
    });

    function setActiveCountry(countryCode) {
        const allLocationLinks = document.querySelectorAll('[data-action="setLocation"]');
        let applied = false;
        allLocationLinks.forEach(link => {
            if (link.dataset.countryCode.toUpperCase() === countryCode.toUpperCase()) {
                if (locationValue) {
                    locationValue.textContent = link.querySelector('.menu-link-text span').textContent;
                }
                applied = true;
            }
        });
        return applied;
    }

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
                    <div class="menu-link-icon"><span class="material-symbols-rounded">public</span></div>
                    <div class="menu-link-text"><span>${country.name}</span></div>
                    <div class="menu-link-icon"></div>
                `;
                locationListContainer.appendChild(countryDiv);
            });

            document.querySelectorAll('[data-action="setLocation"]').forEach(link => {
                link.addEventListener('click', () => {
                    const allLocationLinks = document.querySelectorAll('[data-action="setLocation"]');
                    handleSettingChange(link, allLocationLinks, () => {
                        const countryCode = link.dataset.countryCode;
                        setActiveCountry(countryCode);
                        localStorage.setItem('userLocation', countryCode);
                    });
                });
            });

        } catch (error) {
            console.error("Error al cargar la lista de países:", error);
            locationListContainer.innerHTML = `<div class="menu-link-text" style="padding: 10px;">Error al cargar países.</div>`;
        }
    }

    async function initializeLocation() {
        await populateCountries();
        const allLocationLinks = document.querySelectorAll('[data-action="setLocation"]');
        const savedLocation = localStorage.getItem('userLocation');
        let locationSet = false;

        if (savedLocation) {
            for (const link of allLocationLinks) {
                if (link.dataset.countryCode.toUpperCase() === savedLocation.toUpperCase()) {
                    link.classList.add('active');
                    setActiveCountry(savedLocation);
                    locationSet = true;
                    break;
                }
            }
        }
        
        if(!locationSet) {
            try {
                const response = await fetch('https://ipwho.is/');
                if (!response.ok) throw new Error('Respuesta de red no fue OK');
                const data = await response.json();
                if (data && data.country_code) {
                     for (const link of allLocationLinks) {
                        if (link.dataset.countryCode.toUpperCase() === data.country_code.toUpperCase()) {
                            link.classList.add('active');
                            setActiveCountry(data.country_code);
                            locationSet = true;
                            break;
                        }
                    }
                }
            } catch (error) {
                console.error("Error al obtener la ubicación por IP, se aplicará un valor por defecto.", error);
            }
        }

        if(!locationSet) {
            const defaultLocation = allLocationLinks[0]; 
            if(defaultLocation) {
                defaultLocation.classList.add('active');
                setActiveCountry(defaultLocation.dataset.countryCode);
            }
        }
    }

    // --- INICIALIZACIÓN ---
    function initialize() {
        const initialTheme = localStorage.getItem('userTheme') || 'system';
        document.querySelector(`[data-action="setTheme"][data-theme="${initialTheme}"]`).classList.add('active');
        setActiveTheme(initialTheme);
        
        const initialLang = localStorage.getItem('userLanguage') || navigator.language;
        setActiveLanguage(initialLang);

        initializeLocation();
    }

    initialize();
}

// Exporta la función de inicialización principal
export { initOptionsController };