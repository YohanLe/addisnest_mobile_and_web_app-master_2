/**
 * src/utils/cameraHelper.js
 *
 * Reversible helper that lets the property-list / property-edit forms open
 * a real camera when the user taps "Take Photo" on mobile.
 *
 * Behaviour by environment:
 *   1. Capacitor native app (Android / iOS):
 *      → uses the @capacitor/camera plugin so the user gets the proper
 *        native camera UI with capture/retake/use buttons.
 *
 *   2. Web (mobile browser):
 *      → falls back to the existing hidden <input type="file" capture="environment">
 *        which triggers the device camera in a file-picker style flow.
 *
 *   3. Desktop:
 *      → also falls back to the file input (no camera).
 *
 * The result of `takePhoto()` is always a `File` object, so the callers
 * can treat it the same way they treat a file picked from the gallery —
 * they pass it through `materializeFile`, `normalizeImageFile`,
 * `compressImageIfNeeded`, etc.
 *
 * Toggle CAMERA_PLUGIN_ENABLED to `false` to fall back to the
 * pure-HTML behaviour everywhere (no native plugin call).
 */

export const CAMERA_PLUGIN_ENABLED = true;

/**
 * Detect a Capacitor runtime. We look for the global the WebView injects
 * (window.Capacitor) and, defensively, the older `__CAPACITOR__` flag.
 */
export const isCapacitorNative = () => {
    if (typeof window === 'undefined') return false;
    try {
        if (window.Capacitor && typeof window.Capacitor.isNativePlatform === 'function') {
            return window.Capacitor.isNativePlatform();
        }
        if (window.Capacitor && window.Capacitor.platform && window.Capacitor.platform !== 'web') {
            return true;
        }
        if (window.__CAPACITOR__) return true;
    } catch (_) {}
    return false;
};

/**
 * Convert a base64 string (no data: prefix) into a Blob.
 */
const base64ToBlob = (base64, mimeType = 'image/jpeg') => {
    const byteChars = atob(base64);
    const byteNumbers = new Array(byteChars.length);
    for (let i = 0; i < byteChars.length; i++) {
        byteNumbers[i] = byteChars.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
};

/**
 * Convert any data URL into a Blob (handles data:image/jpeg;base64,...).
 */
const dataUrlToBlob = async (dataUrl) => {
    try {
        const res = await fetch(dataUrl);
        return await res.blob();
    } catch (_) {
        // Fallback: parse manually
        const [header, body] = dataUrl.split(',');
        const mimeMatch = /data:([^;]+)/.exec(header || '') || [];
        const mime = mimeMatch[1] || 'image/jpeg';
        return base64ToBlob(body || '', mime);
    }
};

/**
 * Convert a webPath / blob:/file:/http URL returned by Capacitor Camera into
 * a Blob that we can wrap as a File for upload.
 */
const fetchAsBlob = async (url) => {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Camera fetch failed: ${res.status}`);
    return await res.blob();
};

/**
 * Open the native camera (or the in-browser fallback) and return a File
 * containing the captured photo.
 *
 * Returns `null` if the user cancels or the camera fails. Callers should
 * treat `null` as "user cancelled — do nothing" without showing an error.
 *
 * @param {object} [options]
 * @param {number} [options.quality=82]   JPEG quality (0–100) for native plugin.
 * @param {number} [options.maxWidth]     Max pixel width (native plugin only).
 * @param {number} [options.maxHeight]    Max pixel height (native plugin only).
 */
export const takePhoto = async (options = {}) => {
    if (!CAMERA_PLUGIN_ENABLED) return null;
    if (!isCapacitorNative()) return null;

    let CameraModule = null;
    try {
        // Dynamic import so the web bundle doesn't crash if the plugin
        // isn't present (e.g. running on a stripped-down web build).
        // eslint-disable-next-line import/no-unresolved
        CameraModule = await import('@capacitor/camera');
    } catch (err) {
        // eslint-disable-next-line no-console
        console.warn('[cameraHelper] @capacitor/camera not installed:', err);
        return null;
    }

    const { Camera, CameraResultType, CameraSource } = CameraModule;
    if (!Camera || typeof Camera.getPhoto !== 'function') {
        return null;
    }

    try {
        const photo = await Camera.getPhoto({
            quality: typeof options.quality === 'number' ? options.quality : 82,
            allowEditing: false,
            resultType: CameraResultType.Uri,
            source: CameraSource.Camera,
            saveToGallery: false,
            ...(options.maxWidth ? { width: options.maxWidth } : {}),
            ...(options.maxHeight ? { height: options.maxHeight } : {}),
            // Prefer JPEG for predictable upload size.
            // promptLabelHeader is only used when source is Prompt.
        });

        if (!photo) return null;

        // The plugin returns either webPath, path, or dataUrl depending on
        // the resultType + platform. Normalise into a Blob.
        let blob = null;
        let mime = 'image/' + (photo.format || 'jpeg').toLowerCase().replace('jpg', 'jpeg');

        if (photo.webPath) {
            try {
                blob = await fetchAsBlob(photo.webPath);
                if (blob && blob.type) mime = blob.type;
            } catch (e) {
                // fall through to dataUrl
            }
        }
        if (!blob && photo.dataUrl) {
            blob = await dataUrlToBlob(photo.dataUrl);
            if (blob && blob.type) mime = blob.type;
        }
        if (!blob && photo.base64String) {
            blob = base64ToBlob(photo.base64String, mime);
        }

        if (!blob) return null;

        const ext = (photo.format || 'jpg').toLowerCase().replace('jpeg', 'jpg');
        const fileName = `camera-${Date.now()}.${ext}`;

        try {
            return new File([blob], fileName, {
                type: mime,
                lastModified: Date.now()
            });
        } catch (_) {
            // Old WebView fallback — return the Blob with synthetic name.
            try { Object.defineProperty(blob, 'name', { value: fileName }); } catch (__) {}
            try { Object.defineProperty(blob, 'lastModified', { value: Date.now() }); } catch (__) {}
            return blob;
        }
    } catch (err) {
        // User cancelled the camera or denied permission.
        // Capacitor throws with messages like "User cancelled photos app"
        // or "User denied access to camera".
        const message = (err && err.message) ? err.message.toLowerCase() : '';
        if (
            message.includes('cancel') ||
            message.includes('denied') ||
            message.includes('permission')
        ) {
            // eslint-disable-next-line no-console
            console.info('[cameraHelper] camera not used:', err.message);
            return null;
        }
        // eslint-disable-next-line no-console
        console.warn('[cameraHelper] takePhoto failed:', err);
        return null;
    }
};

/**
 * Convenience: returns true when we should show the native camera button
 * (i.e. we are running inside the Capacitor app where the plugin works).
 */
export const isNativeCameraAvailable = () => CAMERA_PLUGIN_ENABLED && isCapacitorNative();
