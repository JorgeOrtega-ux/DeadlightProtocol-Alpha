import { deactivateAllModules } from './main-controller.js';

let isDragging = false;
let startY = 0;
let isEnabled = false;
let activeMenu = null;
const DRAG_THRESHOLD_PERCENTAGE = 0.4;

/**
 * Cierra el módulo de opciones con una animación de deslizamiento.
 * Usado por manejadores externos como el clic fuera o la tecla Esc.
 */
export function closeOptionsModuleWithAnimation() {
    const module = document.querySelector('.module-options.active');
    if (!module) return;

    const currentActiveMenu = module.querySelector('.menu-content:not(.disabled)');
    if (!currentActiveMenu) {
        deactivateAllModules();
        return;
    }

    currentActiveMenu.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    currentActiveMenu.style.transform = `translateY(${currentActiveMenu.offsetHeight}px)`;

    currentActiveMenu.addEventListener('transitionend', () => {
        deactivateAllModules();
        currentActiveMenu.style.removeProperty('transform');
        currentActiveMenu.style.removeProperty('transition');
    }, { once: true });
}

function initializeMobileDragController() {
    setupResizeListener();
    if (window.innerWidth <= 468) {
        enableDrag();
    }
}

function enableDrag() {
    if (isEnabled) return;
    document.addEventListener('click', handleOutsideClick);
    document.addEventListener('touchstart', handleDragStart, { passive: false });
    document.addEventListener('touchmove', handleDragMove, { passive: false });
    document.addEventListener('touchend', handleDragEnd);
    isEnabled = true;
}

function disableDrag() {
    if (!isEnabled) return;
    document.removeEventListener('click', handleOutsideClick);
    document.removeEventListener('touchstart', handleDragStart, { passive: false });
    document.removeEventListener('touchmove', handleDragMove, { passive: false });
    document.removeEventListener('touchend', handleDragEnd);
    isEnabled = false;
}

function setupResizeListener() {
    window.addEventListener('resize', () => {
        window.innerWidth > 468 ? disableDrag() : enableDrag();
    });
}

function handleOutsideClick(e) {
    if (e.target.classList.contains('module-options')) {
        closeOptionsModuleWithAnimation();
    }
}

function handleDragStart(e) {
    const dragTarget = e.target.closest('.drag-handle');
    if (!dragTarget) return;

    const module = dragTarget.closest('.module-options.active');
    if (!module) return;
    
    activeMenu = module.querySelector('.menu-content:not(.disabled)');
    if (!activeMenu) return;

    activeMenu.style.transition = 'none';
    isDragging = true;
    startY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
    e.preventDefault();
}

function handleDragMove(e) {
    if (!isDragging) return;
    e.preventDefault();

    const currentY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
    let deltaY = currentY - startY;

    if (deltaY < 0) deltaY = 0;
    activeMenu.style.transform = `translateY(${deltaY}px)`;
}

/**
 * Finaliza el arrastre y decide si cerrar o devolver el menú.
 * --- ESTA ES LA FUNCIÓN CORREGIDA ---
 */
function handleDragEnd() {
    if (!isDragging || !activeMenu) return;

    const deltaY = parseFloat(activeMenu.style.transform.replace('translateY(', '')) || 0;
    const threshold = activeMenu.offsetHeight * DRAG_THRESHOLD_PERCENTAGE;
    
    isDragging = false;
    
    if (deltaY > threshold) {
        // En lugar de llamar a una función externa, manejamos la animación aquí mismo.
        // Esto asegura que la animación comience desde la posición actual del arrastre.
        const menuToClose = activeMenu;
        
        menuToClose.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        menuToClose.style.transform = `translateY(${menuToClose.offsetHeight}px)`;

        menuToClose.addEventListener('transitionend', () => {
            deactivateAllModules();
            menuToClose.style.removeProperty('transform');
            menuToClose.style.removeProperty('transition');
        }, { once: true });

    } else {
        returnToOriginalPosition();
    }
    
    activeMenu = null;
}

function returnToOriginalPosition() {
    const menuToReturn = activeMenu;
    if (!menuToReturn) return;
    
    menuToReturn.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    menuToReturn.style.transform = 'translateY(0)';

    menuToReturn.addEventListener('transitionend', () => {
        menuToReturn.style.removeProperty('transform');
        menuToReturn.style.removeProperty('transition');
    }, { once: true });
}

export { initializeMobileDragController };