<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded">
    <link rel="stylesheet" type="text/css" href="assets/css/styles.css">
    <title>OperationSentinel - Home</title>
</head>

<body>
    <div class="page-wrapper">
        <div class="main-content">
            <div class="general-content">
                <div class="general-content-top">
                    <div class="header">
                        <div class="header-left">
                            <div class="header-item" data-action="toggleModuleSidebar">
                                <div class="header-button">
                                    <span class="material-symbols-rounded">menu</span>
                                </div>
                            </div>
                        </div>
                        <div class="header-right">
                            <div class="header-item">
                                <div class="header-button" data-action="toggleModuleOptions">
                                    <span class="material-symbols-rounded">settings</span>
                                </div>
                            </div>
                        </div>
                        <div class="module-options disabled" data-module="moduleOptions">
                            <div class="menu-content">
                                <div class="menu-list">
                                    <div class="menu-link">
                                        <div class="menu-link-icon">
                                            <span class="material-symbols-rounded">settings</span>
                                        </div>
                                        <div class="menu-link-text">
                                            <span>Configuracion</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="general-content-bottom">
                    <div class="module-sidebar disabled" data-module="moduleSidebar">
                        <div class="menu-content">
                            <div class="menu-list">
                                <div class="menu-link">
                                    <div class="menu-link-icon">
                                        <span class="material-symbols-rounded">home</span>
                                    </div>
                                    <div class="menu-link-text">
                                        <span>Pagina principal</span>
                                    </div>
                                </div>
                                <div class="menu-link">
                                    <div class="menu-link-icon">
                                        <span class="material-symbols-rounded">
                                            folder_open
                                        </span>
                                    </div>
                                    <div class="menu-link-text">
                                        <span>Colección Personal</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="general-content-scrolleable">
                        <div class="section-wrapper">
                            <div class="section-content active">pagina principal</div>
                            <div class="section-content disabled">coleccion Personal</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // --- Variables de configuración ---
            let allowEscToClose = true;
            let allowMultipleActiveModules = false;

            // --- NUEVO: Variables de estado para cada módulo ---
            let isActiveModuleSidebar = false;
            let isActiveModuleOptions = false;

            // --- Selectores específicos ---
            const actionButtons = document.querySelectorAll('[data-action="toggleModuleSidebar"], [data-action="toggleModuleOptions"]');
            const allModules = document.querySelectorAll('[data-module="moduleSidebar"], [data-module="moduleOptions"]');

            // --- NUEVO: Función para mostrar el estado en consola ---
            function logModuleStatus() {
                console.groupCollapsed('DeadlightProtocol - (Modules)');
                console.log(`allowEscToClose: %c${allowEscToClose}`, 'font-weight: bold;');
                console.log(`allowMultipleActiveModules: %c${allowMultipleActiveModules}`, 'font-weight: bold;');
                console.log(`isActiveModuleSidebar: %c${isActiveModuleSidebar}`, 'font-weight: bold;');
                console.log(`isActiveModuleOptions: %c${isActiveModuleOptions}`, 'font-weight: bold;');
                console.groupEnd();
            }

            // Función para desactivar un módulo (actualiza clases y estado)
            function deactivateModule(module) {
                module.classList.remove('active');
                module.classList.add('disabled');
                if (module.dataset.module === 'moduleSidebar') isActiveModuleSidebar = false;
                if (module.dataset.module === 'moduleOptions') isActiveModuleOptions = false;
            }

            // Función para activar un módulo (actualiza clases y estado)
            function activateModule(module) {
                module.classList.remove('disabled');
                module.classList.add('active');
                if (module.dataset.module === 'moduleSidebar') isActiveModuleSidebar = true;
                if (module.dataset.module === 'moduleOptions') isActiveModuleOptions = true;
            }

            // Función para desactivar TODOS los módulos
            function deactivateAllModules() {
                allModules.forEach(deactivateModule);
            }

            // Manejador de clics en los botones de acción
            actionButtons.forEach(button => {
                button.addEventListener('click', function(event) {
                    event.stopPropagation();

                    const action = this.getAttribute('data-action');
                    const moduleNameRaw = action.replace('toggle', '');
                    const moduleName = moduleNameRaw.charAt(0).toLowerCase() + moduleNameRaw.slice(1);
                    const targetModule = document.querySelector(`[data-module="${moduleName}"]`);

                    if (!targetModule) return;

                    const isTargetModuleActive = targetModule.classList.contains('active');

                    if (!allowMultipleActiveModules) {
                        deactivateAllModules();
                    }

                    if (isTargetModuleActive) {
                        deactivateModule(targetModule);
                    } else {
                        activateModule(targetModule);
                    }

                    logModuleStatus(); // Genera un log después de cada acción de un botón
                });
            });

            // --- Manejadores para cerrar los módulos ---

            // 1. Cerrar al hacer clic fuera
            document.addEventListener('click', function(event) {
                const isClickInsideModule = event.target.closest('[data-module]');
                const isClickOnButton = event.target.closest('[data-action]');

                // Solo actúa si hay módulos activos
                const activeModules = document.querySelector('[data-module].active');

                if (!isClickInsideModule && !isClickOnButton && activeModules) {
                    deactivateAllModules();
                    logModuleStatus(); // Genera log si se cerraron módulos
                }
            });

            // 2. Cerrar al presionar la tecla 'Escape'
            document.addEventListener('keydown', function(event) {
                const activeModules = document.querySelector('[data-module].active');

                if (allowEscToClose && event.key === 'Escape' && activeModules) {
                    deactivateAllModules();
                    logModuleStatus(); // Genera log si se cerraron módulos
                }
            });

            // --- Log inicial al cargar la página ---
            logModuleStatus();
        });
    </script>

</body>

</html>