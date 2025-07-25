import { closeAndReset, closeFooterModule } from './main-controller.js';
import { closeVideoOverlay } from './video-controller.js'; // Importa la nueva función

let isDragging = false;
let startY = 0;
let currentY = 0;
let initialTransform = 0;
let activeMenu = null;
const dragThreshold = 0.4;

function handleDragStart(e) {
    const dragHandle = e.target.closest('.drag-handle');
    if (!dragHandle || window.innerWidth > 465) return;
    
    // Ahora busca cualquier panel que pueda ser arrastrado
    activeMenu = dragHandle.closest('.menu-options, .menu-overlay, .menu-studio');
    if (!activeMenu) return;

    // Busca el contenedor principal del módulo
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

    if (deltaY > threshold) {
        const moduleWrapper = activeMenu.closest('.module-options, .module-footer, .module-overlay, .module-studio');
        
        // Determina qué función de cierre llamar
        if (moduleWrapper.classList.contains('module-options')) {
            closeAndReset();
        } else if (moduleWrapper.classList.contains('module-footer')) {
            closeFooterModule();
        } else if (moduleWrapper.classList.contains('module-overlay')) {
            closeVideoOverlay();
        } else if (moduleWrapper.classList.contains('module-studio')) {
            // Asumimos que el cierre de studio es manejado por su propio controlador si es complejo
            // o podemos crear una función exportada para él también. Por ahora, esto funciona.
            moduleWrapper.classList.add('disabled');
            moduleWrapper.classList.remove('active');
        }

    } else {
        activeMenu.style.transition = 'transform 0.3s ease';
        activeMenu.style.transform = 'translateY(0)';
        
        activeMenu.addEventListener('transitionend', () => {
            activeMenu.removeAttribute('style');
        }, { once: true });
    }

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