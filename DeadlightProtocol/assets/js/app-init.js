import { initMainController } from './main-controller.js';
import { initOptionsController } from './options-controller.js';
// 1. Importa el nuevo controlador de arrastre móvil.
import { initializeMobileDragController } from './mobile-drag-controller.js';

document.addEventListener('DOMContentLoaded', () => {
    initOptionsController();
    initMainController();
    // 2. Llama a la función de inicialización del controlador de arrastre.
    initializeMobileDragController();
});