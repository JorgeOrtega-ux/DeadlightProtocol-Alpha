(function() {
    try {
        const theme = localStorage.getItem('user-theme') || 'system';
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const applyDarkTheme = theme === 'dark' || (theme === 'system' && systemPrefersDark);
        document.documentElement.classList.add(applyDarkTheme ? 'dark-theme' : 'light-theme');
    } catch (e) {}
    try {
        const langDataString = localStorage.getItem('user-language-data');
        if (!langDataString) return;
        const langData = JSON.parse(langDataString);
        const currentLang = localStorage.getItem('user-language');
        if (langData && langData.code === currentLang) {
            const applyInitialTranslations = (translations) => {
                if (!translations || !translations.menu) return;
                const translateNode = (node) => {
                    if (node.nodeType === 1 && node.hasAttribute('data-translate')) {
                        const key = node.getAttribute('data-translate');
                        if (translations.menu[key]) {
                            node.textContent = translations.menu[key];
                        }
                    }
                };
                const observer = new MutationObserver((mutationsList) => {
                    for (const mutation of mutationsList) {
                        if (mutation.type === 'childList') {
                            mutation.addedNodes.forEach(node => {
                                translateNode(node);
                                if (node.querySelectorAll) {
                                    node.querySelectorAll('[data-translate]').forEach(translateNode);
                                }
                            });
                        }
                    }
                });
                observer.observe(document.documentElement, {
                    childList: true,
                    subtree: true
                });
                document.addEventListener('DOMContentLoaded', () => {
                    observer.disconnect();
                });
            };
            applyInitialTranslations(langData.translations);
        }
    } catch (e) {}
})();