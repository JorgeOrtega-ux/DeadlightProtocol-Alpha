// assets/js/app-init.js

import { initMainController } from './main-controller.js';

// Espera a que el contenido del DOM esté completamente cargado y parseado
document.addEventListener('DOMContentLoaded', () => {
    // Inicia toda la lógica de la aplicación
    initMainController();
});