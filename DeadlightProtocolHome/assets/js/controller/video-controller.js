import { allTranslations } from './main-controller.js';

// Exporta la función de cierre para que drag-controller pueda usarla
export function closeVideoOverlay() {
    const moduleOverlay = document.querySelector('.module-overlay');
    if (!moduleOverlay || !moduleOverlay.classList.contains('active')) return;

    const menuPanel = moduleOverlay.querySelector('.menu-overlay');

    const finishClosing = () => {
        moduleOverlay.classList.add('disabled');
        moduleOverlay.classList.remove('active', 'closing');
        if (menuPanel) {
            menuPanel.classList.remove('animating-in');
            menuPanel.removeAttribute('style');
        }
    };

    if (window.innerWidth <= 465 && menuPanel) {
        moduleOverlay.classList.add('closing');
        menuPanel.addEventListener('animationend', finishClosing, { once: true });
    } else {
        finishClosing();
    }
}


export function initVideoController() {
    const toolCards = document.querySelectorAll('.tool-card');
    const moduleOverlay = document.querySelector('.module-overlay');
    const videoUrlInput = document.getElementById('video-url-input');
    const badgets = document.querySelectorAll('.badget[data-platform]');
    
    const qualitySelector = document.querySelector('[data-action="toggleStudio"]');
    const studioModule = document.querySelector('.module-studio');
    const menuOverlay = moduleOverlay?.querySelector('.menu-overlay');
    const menuStudio = studioModule?.querySelector('.menu-studio');

    if (!moduleOverlay) return;
    
    let activePlatformKey = null;

    // --- MANEJADORES DE CIERRE ---
    const closeStudioModule = () => {
        if (!studioModule || studioModule.classList.contains('disabled')) return;

        const finishClosing = () => {
            studioModule.classList.add('disabled');
            studioModule.classList.remove('active', 'closing');
            if (menuStudio) {
                menuStudio.classList.remove('animating-in');
                menuStudio.removeAttribute('style');
            }
            document.removeEventListener('click', handleOutsideStudioClick);
        };

        if (window.innerWidth <= 465 && menuStudio) {
            studioModule.classList.add('closing');
            menuStudio.addEventListener('animationend', finishClosing, { once: true });
        } else {
            finishClosing();
        }
    };

    // **LÓGICA CORREGIDA AQUÍ**
    const handleOutsideClick = (event) => {
        // Si el menú de calidades está abierto, no hagas nada.
        // Deja que handleOutsideStudioClick se encargue.
        if (studioModule && studioModule.classList.contains('active')) {
            return;
        }

        if (menuOverlay && !menuOverlay.contains(event.target) && !event.target.closest('.tool-card')) {
            closeVideoOverlay();
        }
    };
    
    const handleOutsideStudioClick = (event) => {
        if (menuStudio && !menuStudio.contains(event.target) && !event.target.closest('[data-action="toggleStudio"]')) {
            closeStudioModule();
        }
    };

    const handleEscKey = (event) => {
        if (event.key === 'Escape') {
            if (studioModule && studioModule.classList.contains('active')) {
                closeStudioModule();
            } else {
                closeVideoOverlay();
            }
        }
    };

    // --- FUNCIONES DE APERTURA / CIERRE ---
    const openOverlay = (platformKey) => {
        window.dispatchEvent(new CustomEvent('module-opening', { detail: { moduleToKeepOpen: 'video' } }));
        
        activePlatformKey = platformKey;
        updateActivePlatform(platformKey);

        const wasAlreadyActive = moduleOverlay.classList.contains('active');
        moduleOverlay.classList.add('active');
        moduleOverlay.classList.remove('disabled');

        if (window.innerWidth <= 465 && menuOverlay) {
            menuOverlay.classList.add('animating-in');
        }

        if (!wasAlreadyActive) {
            setTimeout(() => {
                document.addEventListener('click', handleOutsideClick);
                document.addEventListener('keydown', handleEscKey);
            }, 0);
        }
    };

    // --- LÓGICA DE CLICS ---
    toolCards.forEach(card => {
        card.addEventListener('click', (event) => {
            event.stopPropagation();
            const titleElement = card.querySelector('title');
            if (!titleElement) return;

            const platform = titleElement.textContent.trim();
            let clickedPlatformKey = 'youtube';
            if (platform.includes('Shorts')) clickedPlatformKey = 'youtube-shorts';
            else if (platform.includes('Music')) clickedPlatformKey = 'youtube-music';
            else if (platform.includes('Facebook')) clickedPlatformKey = 'facebook';
            else if (platform.includes('Vimeo')) clickedPlatformKey = 'vimeo';
            else if (platform.includes('X')) clickedPlatformKey = 'x';

            if (moduleOverlay.classList.contains('active') && activePlatformKey === clickedPlatformKey) {
                closeVideoOverlay();
            } else {
                openOverlay(clickedPlatformKey);
            }
        });
    });

    if (qualitySelector && studioModule) {
        qualitySelector.addEventListener('click', (event) => {
            event.stopPropagation();
            const isStudioDisabled = studioModule.classList.contains('disabled');
            
            studioModule.classList.toggle('disabled');
            studioModule.classList.toggle('active');

            if (isStudioDisabled) {
                if(window.innerWidth <= 465 && menuStudio) menuStudio.classList.add('animating-in');
                setTimeout(() => document.addEventListener('click', handleOutsideStudioClick), 0);
            } else {
                document.removeEventListener('click', handleOutsideStudioClick);
            }
        });
    }

    window.addEventListener('module-opening', (event) => {
        if (event.detail.moduleToKeepOpen !== 'video') {
            closeVideoOverlay();
        }
    });

    const updateActivePlatform = (platformKey) => {
        let placeholderKey = 'youtube_placeholder';
        switch (platformKey) {
            case 'youtube': placeholderKey = 'youtube_placeholder'; break;
            case 'youtube-shorts': placeholderKey = 'shorts_placeholder'; break;
            case 'youtube-music': placeholderKey = 'music_placeholder'; break;
            case 'facebook': placeholderKey = 'facebook_placeholder'; break;
            case 'vimeo': placeholderKey = 'vimeo_placeholder'; break;
            case 'x': placeholderKey = 'x_placeholder'; break;
        }
        if (videoUrlInput) {
            videoUrlInput.setAttribute('data-translate', placeholderKey);
            const currentLang = localStorage.getItem('user-language') || 'en-US';
            const translations = allTranslations[currentLang];
            if (translations?.menu?.[placeholderKey]) {
                videoUrlInput.placeholder = translations.menu[placeholderKey];
            }
        }
        badgets.forEach(b => {
            b.classList.toggle('active', b.dataset.platform === platformKey);
        });
    };

    badgets.forEach(badge => {
        badge.addEventListener('click', () => {
            const platformKey = badge.dataset.platform;
            openOverlay(platformKey);
        });
    });
}