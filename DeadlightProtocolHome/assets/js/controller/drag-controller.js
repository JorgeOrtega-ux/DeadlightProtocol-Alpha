import { closeAndReset, closeFooterModule } from './main-controller.js';
import { closeVideoOverlay, closeStudioModule } from './video-controller.js';

let isDragging = false;
let startY = 0;
let currentY = 0;
let initialTransform = 0;
let activeMenu = null;
const dragThreshold = 0.4;

function handleDragStart(e) {
    const dragTarget = e.target.closest('.pill-container');
    if (!dragTarget || window.innerWidth > 465) return;
    
    activeMenu = dragTarget.closest('.menu-options, .menu-overlay, .menu-studio');
    if (!activeMenu) return;

    const moduleWrapper = activeMenu.closest('.module-options, .module-footer, .module-overlay, .module-studio');
    if (!moduleWrapper || moduleWrapper.classList.contains('closing')) return;

    isDragging = true;
    activeMenu.classList.remove('animating-in');
    startY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;

    const transform = window.getComputedStyle(activeMenu).transform;
    initialTransform = (transform !== 'none') ? new DOMMatrix(transform).m42 : 0;

    activeMenu.style.transition = 'none';
    e.preventDefault();
}

function handleDragMove(e) {
    if (!isDragging || !activeMenu) return;

    currentY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
    let deltaY = currentY - startY;

    if (deltaY < 0) deltaY = 0;

    const newTransform = initialTransform + deltaY;
    activeMenu.style.transform = `translateY(${newTransform}px)`;
    e.preventDefault();
}

function handleDragEnd() {
    if (!isDragging || !activeMenu) return;

    isDragging = false;
    const deltaY = currentY - startY;
    const menuHeight = activeMenu.offsetHeight;
    const threshold = menuHeight * dragThreshold;

    // Guardamos una referencia local al menú activo.
    const menuToAnimate = activeMenu;

    if (deltaY > threshold) {
        const moduleWrapper = menuToAnimate.closest('.module-options, .module-footer, .module-overlay, .module-studio');
        
        if (moduleWrapper.classList.contains('module-options')) {
            closeAndReset();
        } else if (moduleWrapper.classList.contains('module-footer')) {
            closeFooterModule();
        } else if (moduleWrapper.classList.contains('module-overlay')) {
            closeVideoOverlay();
        } else if (moduleWrapper.classList.contains('module-studio')) {
            closeStudioModule();
        }

    } else {
        // Anima el menú para que vuelva a su posición original.
        menuToAnimate.style.transition = 'transform 0.3s ease';
        menuToAnimate.style.transform = 'translateY(0)';
        
        // === INICIO DE LA CORRECCIÓN ===
        // Se usa la referencia local (menuToAnimate) para asegurar que el
        // estilo se elimina del elemento correcto después de la animación.
        menuToAnimate.addEventListener('transitionend', () => {
            // Solo elimina el estilo si no se está arrastrando de nuevo.
            if (!isDragging) {
                menuToAnimate.removeAttribute('style');
            }
        }, { once: true }); // 'once: true' limpia el listener automáticamente.
        // === FIN DE LA CORRECCIÓN ===
    }

    // Limpiamos la variable global para el próximo arrastre.
    activeMenu = null;
}

function initDragController() {
    document.addEventListener('mousedown', handleDragStart);
    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);

    document.addEventListener('touchstart', handleDragStart, { passive: false });
    document.addEventListener('touchmove', handleDragMove, { passive: false });
    document.addEventListener('touchend', handleDragEnd);
}

export { initDragController };