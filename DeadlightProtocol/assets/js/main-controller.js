import { cancelActiveChange } from './options-controller.js';

function initMainController() {
    const config = {
        allowEscToClose: true,
        allowMultipleActiveModules: false,
    };

    const moduleState = {
        isModuleSidebarActive: false,
        isModuleOptionsActive: false,
    };

    const sectionState = {
        isSectionHomeActive: true,
        isSectionCollectionActive: false,
        isSectionTrashActive: false,
    };

    const selectors = {
        actionButtons: document.querySelectorAll('[data-action="toggleModuleSidebar"], [data-action="toggleModuleOptions"]'),
        allModules: document.querySelectorAll('[data-module]'),
        sectionMenuLinks: document.querySelectorAll('.module-sidebar .menu-link[data-action^="toggleSection"]'),
        sections: document.querySelectorAll('.section-content[data-section]'),
        menuNavLinks: document.querySelectorAll('.module-options [data-action="navigateTo"]'),
    };

    function logStatus() {
        console.groupCollapsed('DeadlightProtocol - (Modules/Sections)');
        
        console.groupCollapsed('Module Status');
        for (const [key, value] of Object.entries(moduleState)) {
            console.log(`${key}: %c${value}`, 'font-weight: bold;');
        }
        console.groupEnd();

        console.groupCollapsed('Section Status');
        for (const [key, value] of Object.entries(sectionState)) {
            console.log(`${key}: %c${value}`, 'font-weight: bold;');
        }
        console.groupEnd();

        console.groupEnd();
    }
    
    function deactivateAllModules() {
        selectors.allModules.forEach(module => {
            deactivateModule(module);
        });
        logStatus();
    }

    function deactivateModule(module) {
        const moduleName = module.dataset.module;

        if (module.classList.contains('active') && moduleName === 'moduleOptions') {
            cancelActiveChange();
        }

        module.classList.remove('active');
        module.classList.add('disabled');
        
        if (moduleName === 'moduleSidebar') moduleState.isModuleSidebarActive = false;
        if (moduleName === 'moduleOptions') {
            moduleState.isModuleOptionsActive = false;
            const allSubMenus = module.querySelectorAll('[data-menu]');
            allSubMenus.forEach(menu => {
                menu.classList.remove('active');
                menu.classList.add('disabled');
            });
        }
    }

    function activateModule(module) {
        module.classList.remove('disabled');
        module.classList.add('active');
        
        const moduleName = module.dataset.module;
        if (moduleName === 'moduleSidebar') moduleState.isModuleSidebarActive = true;
        if (moduleName === 'moduleOptions') {
            moduleState.isModuleOptionsActive = true;
            const mainMenu = module.querySelector('[data-menu="main"]');
            if(mainMenu) {
                mainMenu.classList.add('active');
                mainMenu.classList.remove('disabled');
            }
        }
    }

    function handleModuleToggle(event) {
        event.stopPropagation();
        const action = this.getAttribute('data-action');
        const moduleNameRaw = action.replace('toggle', '');
        const moduleName = moduleNameRaw.charAt(0).toLowerCase() + moduleNameRaw.slice(1);
        const targetModule = document.querySelector(`[data-module="${moduleName}"]`);
        
        if (!targetModule) return;

        const isTargetModuleActive = targetModule.classList.contains('active');
        
        if (!config.allowMultipleActiveModules && !isTargetModuleActive) {
            deactivateAllModules();
        }

        if (isTargetModuleActive) {
            deactivateModule(targetModule);
        } else {
            activateModule(targetModule);
        }
        logStatus();
    }

    function handleSectionToggle() {
        if (this.classList.contains('active')) return;

        const action = this.getAttribute('data-action');
        const sectionNameRaw = action.replace('toggle', '');
        const targetSectionName = sectionNameRaw.charAt(0).toLowerCase() + sectionNameRaw.slice(1);
        const targetSection = document.querySelector(`.section-content[data-section="${targetSectionName}"]`);
        
        if (!targetSection) return;

        sectionState.isSectionHomeActive = (targetSectionName === 'sectionHome');
        sectionState.isSectionCollectionActive = (targetSectionName === 'sectionCollection');
        sectionState.isSectionTrashActive = (targetSectionName === 'sectionTrash');

        selectors.sectionMenuLinks.forEach(link => link.classList.remove('active'));
        this.classList.add('active');
        
        selectors.sections.forEach(section => {
            section.classList.remove('active');
            section.classList.add('disabled');
        });

        targetSection.classList.remove('disabled');
        targetSection.classList.add('active');
        logStatus();
    }

    function handleMenuNavigation(event) {
        event.stopPropagation();
        const targetMenuName = this.dataset.targetMenu;
        const parentModule = this.closest('[data-module]');
        
        if (!targetMenuName || !parentModule) return;

        const currentMenu = this.closest('[data-menu]');
        const targetMenu = parentModule.querySelector(`[data-menu="${targetMenuName}"]`);

        if (currentMenu) {
            currentMenu.classList.remove('active');
            currentMenu.classList.add('disabled');
        }
        if (targetMenu) {
            targetMenu.classList.add('active');
            targetMenu.classList.remove('disabled');
        }
    }
    
    // --- Asignación de Eventos ---
    selectors.actionButtons.forEach(button => button.addEventListener('click', handleModuleToggle));
    selectors.sectionMenuLinks.forEach(link => link.addEventListener('click', handleSectionToggle));
    selectors.menuNavLinks.forEach(link => link.addEventListener('click', handleMenuNavigation));

    document.addEventListener('click', (event) => {
        const activeModule = document.querySelector('[data-module].active');
        if (!activeModule) return;

        const isClickOnOverlay = event.target === activeModule;
        const isClickOutsideAllModules = !event.target.closest('[data-module]');

        if (isClickOnOverlay || isClickOutsideAllModules) {
            deactivateAllModules();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (config.allowEscToClose && event.key === 'Escape' && document.querySelector('[data-module].active')) {
            deactivateAllModules();
        }
    });

    logStatus();
}

export { initMainController };