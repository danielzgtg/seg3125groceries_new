import OfflinePluginRuntime from 'offline-plugin/runtime';

export default function install(): void {
    if (navigator.serviceWorker) {
        OfflinePluginRuntime.install({
            onUpdateReady: OfflinePluginRuntime.applyUpdate,
        });
    }
}
