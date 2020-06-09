/**
 * Detects errors.
 */
export default class CrashHandler {
    constructor(overlay: HTMLElement) {
        const descElement = overlay.querySelector('pre');
        if (!descElement) {
            throw new TypeError;
        }
        window.addEventListener('error', err => {
            overlay.hidden = false;
            const { colno, error, filename, lineno, message } = err;
            descElement.innerText = JSON.stringify({
                colno,
                stack: error.stack,
                filename,
                lineno,
                message,
            }, null, 4).replace(/\\n/g, '\n    ');
        });
    }
}
