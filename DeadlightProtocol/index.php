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
                        
                        <div class="module-options body-title disabled" data-module="moduleOptions">
                            <div class="menu-content disabled" data-menu="main">
                                <div class="menu-list">
                                    <div class="menu-link" data-action="navigateTo" data-target-menu="settings">
                                        <div class="menu-link-icon"><span class="material-symbols-rounded">settings</span></div>
                                        <div class="menu-link-text"><span>Configuración</span></div>
                                        <div class="menu-link-icon"><span class="material-symbols-rounded">chevron_right</span></div>
                                    </div>
                                    <div class="menu-link" data-action="navigateTo" data-target-menu="help">
                                        <div class="menu-link-icon"><span class="material-symbols-rounded">help</span></div>
                                        <div class="menu-link-text"><span>Ayuda y recursos</span></div>
                                        <div class="menu-link-icon"><span class="material-symbols-rounded">chevron_right</span></div>
                                    </div>
                                </div>
                            </div>

                            <div class="menu-content disabled" data-menu="settings">
                                <div class="menu-list">
                                    <div class="menu-link" data-action="navigateTo" data-target-menu="appearance">
                                        <div class="menu-link-icon"><span class="material-symbols-rounded">palette</span></div>
                                        <div class="menu-link-text"><span>Aspecto</span></div>
                                        <div class="menu-link-icon"><span class="material-symbols-rounded">chevron_right</span></div>
                                    </div>
                                    <div class="menu-link" data-action="navigateTo" data-target-menu="language">
                                        <div class="menu-link-icon"><span class="material-symbols-rounded">language</span></div>
                                        <div class="menu-link-text"><span>Lenguaje</span></div>
                                        <div class="menu-link-icon"><span class="material-symbols-rounded">chevron_right</span></div>
                                    </div>
                                    <div class="menu-link">
                                        <div class="menu-link-icon"><span class="material-symbols-rounded">location_on</span></div>
                                        <div class="menu-link-text"><span>Ubicación</span></div>
                                    </div>
                                </div>
                            </div>

                            <div class="menu-content disabled" data-menu="appearance">
                                <div class="menu-list">
                                    <div class="menu-link">
                                        <div class="menu-link-icon"><span class="material-symbols-rounded">brightness_auto</span></div>
                                        <div class="menu-link-text"><span>Sincronizar con el sistema</span></div>
                                    </div>
                                    <div class="menu-link">
                                        <div class="menu-link-icon"><span class="material-symbols-rounded">dark_mode</span></div>
                                        <div class="menu-link-text"><span>Tema oscuro</span></div>
                                    </div>
                                    <div class="menu-link">
                                        <div class="menu-link-icon"><span class="material-symbols-rounded">light_mode</span></div>
                                        <div class="menu-link-text"><span>Tema claro</span></div>
                                    </div>
                                </div>
                            </div>

                            <div class="menu-content disabled" data-menu="language">
                                <div class="menu-list">
                                    <div class="menu-link">
                                        <div class="menu-link-icon"><span class="material-symbols-rounded">language</span></div>
                                        <div class="menu-link-text"><span>English (United States)</span></div>
                                    </div>
                                    <div class="menu-link">
                                        <div class="menu-link-icon"><span class="material-symbols-rounded">language</span></div>
                                        <div class="menu-link-text"><span>Español (Mexico)</span></div>
                                    </div>
                                    <div class="menu-link">
                                        <div class="menu-link-icon"><span class="material-symbols-rounded">language</span></div>
                                        <div class="menu-link-text"><span>Français (France)</span></div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="menu-content disabled" data-menu="help">
                                <div class="menu-list">
                                    <div class="menu-link">
                                        <div class="menu-link-icon"><span class="material-symbols-rounded">gavel</span></div>
                                        <div class="menu-link-text"><span>Política de privacidad</span></div>
                                    </div>
                                    <div class="menu-link">
                                        <div class="menu-link-icon"><span class="material-symbols-rounded">description</span></div>
                                        <div class="menu-link-text"><span>Términos y condiciones</span></div>
                                    </div>
                                    <div class="menu-link">
                                        <div class="menu-link-icon"><span class="material-symbols-rounded">cookie</span></div>
                                        <div class="menu-link-text"><span>Política de cookies</span></div>
                                    </div>
                                    <div class="menu-link">
                                        <div class="menu-link-icon"><span class="material-symbols-rounded">feedback</span></div>
                                        <div class="menu-link-text"><span>Enviar comentarios</span></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="general-content-bottom">
                    <div class="module-sidebar body-title disabled" data-module="moduleSidebar">
                        <div class="menu-content">
                            <div class="menu-list">
                                <div class="menu-link active" data-action="toggleSectionHome">
                                    <div class="menu-link-icon"><span class="material-symbols-rounded">home</span></div>
                                    <div class="menu-link-text"><span>Pagina principal</span></div>
                                </div>
                                <div class="menu-link" data-action="toggleSectionCollection">
                                    <div class="menu-link-icon"><span class="material-symbols-rounded">folder_open</span></div>
                                    <div class="menu-link-text"><span>Colección Personal</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="general-content-scrolleable">
                        <div class="section-wrapper">
                            <div class="section-content active" data-section="sectionHome">pagina principal</div>
                            <div class="section-content disabled" data-section="sectionCollection">coleccion Personal</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script type="module" src="assets/js/app-init.js"></script>
</body>

</html>