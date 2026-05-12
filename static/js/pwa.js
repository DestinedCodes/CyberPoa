(() => {
    const DISMISSED_KEY = 'meneja360InstallPromptDismissedAt';
    const DISMISS_TTL = 7 * 24 * 60 * 60 * 1000;
    let deferredInstallPrompt = null;
    let promptElement = null;

    function isStandalone() {
        return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    }

    function wasRecentlyDismissed() {
        const dismissedAt = Number(localStorage.getItem(DISMISSED_KEY) || 0);
        return dismissedAt && Date.now() - dismissedAt < DISMISS_TTL;
    }

    function markDismissed() {
        localStorage.setItem(DISMISSED_KEY, String(Date.now()));
    }

    function createPromptElement(mode = 'browser') {
        if (promptElement) {
            return promptElement;
        }

        promptElement = document.createElement('section');
        promptElement.className = 'pwa-install-prompt';
        promptElement.setAttribute('aria-live', 'polite');

        const message = mode === 'ios'
            ? 'Install Meneja360 from your browser menu for faster access from your home screen.'
            : 'Install Meneja360 for faster access from your device.';
        const actionText = mode === 'ios' ? 'Got it' : 'Install';

        promptElement.innerHTML = `
            <div class="pwa-install-prompt__copy">
                <strong>Install Meneja360</strong>
                <span>${message}</span>
            </div>
            <div class="pwa-install-prompt__actions">
                <button type="button" class="pwa-install-prompt__button" data-pwa-install-action>${actionText}</button>
                <button type="button" class="pwa-install-prompt__dismiss" data-pwa-install-dismiss aria-label="Dismiss install prompt">&times;</button>
            </div>
        `;

        promptElement.querySelector('[data-pwa-install-dismiss]').addEventListener('click', () => {
            markDismissed();
            hidePrompt();
        });

        promptElement.querySelector('[data-pwa-install-action]').addEventListener('click', async () => {
            if (mode === 'ios') {
                markDismissed();
                hidePrompt();
                return;
            }

            if (!deferredInstallPrompt) {
                return;
            }

            deferredInstallPrompt.prompt();
            const choice = await deferredInstallPrompt.userChoice;
            if (choice.outcome !== 'accepted') {
                markDismissed();
            }
            deferredInstallPrompt = null;
            hidePrompt();
        });

        document.body.appendChild(promptElement);
        return promptElement;
    }

    function showPrompt(mode = 'browser') {
        if (isStandalone() || wasRecentlyDismissed()) {
            return;
        }

        const element = createPromptElement(mode);
        requestAnimationFrame(() => element.classList.add('pwa-install-prompt--visible'));
    }

    function hidePrompt() {
        if (promptElement) {
            promptElement.classList.remove('pwa-install-prompt--visible');
        }
    }

    function shouldShowIosHelp() {
        const userAgent = window.navigator.userAgent.toLowerCase();
        const isIos = /iphone|ipad|ipod/.test(userAgent);
        const isSafari = /safari/.test(userAgent) && !/crios|fxios|edgios/.test(userAgent);
        return isIos && isSafari;
    }

    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/service-worker.js').catch((error) => {
                console.warn('Service worker registration failed:', error);
            });
        });
    }

    window.addEventListener('beforeinstallprompt', (event) => {
        event.preventDefault();
        deferredInstallPrompt = event;
        showPrompt('browser');
    });

    window.addEventListener('appinstalled', () => {
        deferredInstallPrompt = null;
        hidePrompt();
        localStorage.removeItem(DISMISSED_KEY);
    });

    window.addEventListener('load', () => {
        if (!deferredInstallPrompt && shouldShowIosHelp()) {
            window.setTimeout(() => showPrompt('ios'), 1200);
        }
    });
})();
