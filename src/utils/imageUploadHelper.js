/**
 * src/utils/imageUploadHelper.js
 *
 * Helpers used by PropertyListForm / EditPropertyForm to make
 * image uploads work reliably on mobile (Capacitor Android / iOS) and slow
 * networks.
 */

// ── Reversal flag ─────────────────────────────────────────────────────────
export const IMAGE_UPLOAD_FIX_ENABLED = true;

// Stay safely under Netlify Functions' ~6 MB synchronous body limit.
const COMPRESS_THRESHOLD_BYTES = 3.5 * 1024 * 1024; // 3.5 MB

const TARGET_MAX_DIMENSION = 1920; // px (longest edge)
const TARGET_JPEG_QUALITY = 0.82;

/**
 * Inspect the first few bytes of a Blob/File and return a likely image MIME
 * type, or null if the bytes don't match a known image signature.
 */
const sniffImageMime = async (file) => {
    if (!file || typeof file.slice !== 'function') return null;

    try {
        const head = await file.slice(0, 16).arrayBuffer();
        const b = new Uint8Array(head);
        if (b.length < 4) return null;

        // JPEG
        if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return 'image/jpeg';
        // PNG
        if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47 &&
            b[4] === 0x0d && b[5] === 0x0a && b[6] === 0x1a && b[7] === 0x0a) return 'image/png';
        // GIF
        if (b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x38) return 'image/gif';
        // WEBP
        if (b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 &&
            b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50) return 'image/webp';
        // BMP
        if (b[0] === 0x42 && b[1] === 0x4d) return 'image/bmp';
        // HEIC/HEIF
        if (b.length >= 12 && b[4] === 0x66 && b[5] === 0x74 && b[6] === 0x79 && b[7] === 0x70) {
            const brand = String.fromCharCode(b[8], b[9], b[10], b[11]).toLowerCase();
            if (['heic','heix','hevc','hevx','mif1','msf1','heim','heis'].includes(brand)) return 'image/heic';
        }
        // TIFF
        if ((b[0] === 0x49 && b[1] === 0x49 && b[2] === 0x2a && b[3] === 0x00) ||
            (b[0] === 0x4d && b[1] === 0x4d && b[2] === 0x00 && b[3] === 0x2a)) return 'image/tiff';
    } catch (err) {
        console.warn('[imageUploadHelper] sniffImageMime failed:', err);
    }
    return null;
};

/**
 * Synchronous quick check — returns true when the file looks like an image
 * based on MIME type or filename extension.
 */
export const isImageFile = (file) => {
    if (!file) return false;

    if (!IMAGE_UPLOAD_FIX_ENABLED) {
        return typeof file.type === 'string' && file.type.startsWith('image/');
    }

    if (typeof file.type === 'string' && file.type.startsWith('image/')) return true;

    const name = (file.name || '').toLowerCase();
    if (/\.(jpe?g|png|gif|webp|bmp|heic|heif|tiff?)(?:[?#].*)?$/i.test(name)) return true;
    if (/\.(jpe?g|png|gif|webp|bmp|heic|heif|tiff?)\b/i.test(name)) return true;

    return false;
};

/**
 * Asynchronous, content-aware image check. Falls back to magic-byte sniffing
 * for files with no extension / generic MIME (common on Android).
 */
export const isImageFileAsync = async (file) => {
    if (!file) return false;
    if (!IMAGE_UPLOAD_FIX_ENABLED) {
        return typeof file.type === 'string' && file.type.startsWith('image/');
    }

    if (isImageFile(file)) return true;

    const sniffed = await sniffImageMime(file);
    return !!sniffed;
};

/**
 * Attempt to copy the file bytes into an in-memory File so the rest of
 * the pipeline is never broken by a revoked content:// URI.
 *
 * IMPORTANT: This function ALWAYS returns a usable file — either a fresh
 * in-memory copy (best case) or the original file reference (fallback).
 * It never returns null. If byte-reading fails (e.g. on the first Android
 * Photo Picker pick where the URI grant hasn't propagated yet), we return
 * the original file so the browser can stream it natively during the
 * multipart upload request.
 */
export const materializeFile = async (file) => {
    if (!file || !IMAGE_UPLOAD_FIX_ENABLED) return file;

    try {
        let buffer = null;

        // Strategy 1: file.arrayBuffer()
        if (!buffer && typeof file.arrayBuffer === 'function') {
            try {
                const buf = await Promise.race([
                    file.arrayBuffer(),
                    new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 4000))
                ]);
                if (buf && buf.byteLength > 0) buffer = buf;
            } catch (_) {}
        }

        // Strategy 2: FileReader.readAsArrayBuffer
        if (!buffer) {
            try {
                buffer = await new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = () => {
                        const r = reader.result;
                        resolve(r && r.byteLength > 0 ? r : null);
                    };
                    reader.onerror = () => resolve(null);
                    try { reader.readAsArrayBuffer(file); } catch (_) { resolve(null); }
                });
            } catch (_) {}
        }

        // Strategy 3: FileReader.readAsDataURL (different Android code path)
        if (!buffer) {
            try {
                buffer = await new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = () => {
                        const dataUrl = reader.result;
                        if (!dataUrl || typeof dataUrl !== 'string') { resolve(null); return; }
                        const commaIdx = dataUrl.indexOf(',');
                        if (commaIdx < 0) { resolve(null); return; }
                        try {
                            const base64 = dataUrl.slice(commaIdx + 1);
                            if (!base64) { resolve(null); return; }
                            const binary = atob(base64);
                            const bytes = new Uint8Array(binary.length);
                            for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
                            const buf = bytes.buffer;
                            resolve(buf && buf.byteLength > 0 ? buf : null);
                        } catch (_) { resolve(null); }
                    };
                    reader.onerror = () => resolve(null);
                    try { reader.readAsDataURL(file); } catch (_) { resolve(null); }
                });
            } catch (_) {}
        }

        // If we got bytes, wrap them in a fresh in-memory File.
        if (buffer && buffer.byteLength > 0) {
            const type = (typeof file.type === 'string' && file.type) || '';
            const name = (typeof file.name === 'string' && file.name) || `photo-${Date.now()}`;
            try {
                return new File([buffer], name, { type, lastModified: file.lastModified || Date.now() });
            } catch (_) {
                const blob = new Blob([buffer], { type });
                try { Object.defineProperty(blob, 'name', { value: name }); } catch (__) {}
                try { Object.defineProperty(blob, 'lastModified', { value: file.lastModified || Date.now() }); } catch (__) {}
                return blob;
            }
        }

        // Bytes couldn't be read (common on first Android gallery pick).
        // Return the original file — the browser can still stream the
        // content:// URI natively when it creates the multipart request.
        console.warn('[imageUploadHelper] materializeFile: could not read bytes, using original file reference');
        return file;

    } catch (_) {
        // Safety net — never block the upload pipeline.
        return file;
    }
};

/**
 * Upload with automatic retry on transient network errors.
 * Solves "first attempt fails, second works" on Android WebView.
 */
export const UPLOAD_RETRY_ENABLED = true;

// ── Android WebView fetch-hang fix ────────────────────────────────────────
// On Capacitor Android the very first `fetch` after a content:// URI has
// been read (or just after the WebView network bridge initialises) can hang
// indefinitely — it neither resolves nor rejects. Adding a per-attempt
// timeout via Promise.race guarantees that a hung request fails after
// `timeoutMs` milliseconds so the retry logic can kick in.
// Default timeout: 15 s per attempt. Reversal: remove the fetchWithTimeout
// wrapper and replace `fetchWithTimeout(url, options, timeoutMs)` with
// `fetch(url, options)`.
// `options.body` may be a function — when present, it is invoked per attempt to
// build a fresh body. This avoids the "first attempt succeeds, retries send 0
// bytes" footgun where a FormData/Blob body becomes unusable once fetch() has
// started consuming it on a previous attempt.
// Detect Capacitor native runtime (Android / iOS app shell).
const isCapacitorNative = () => {
    try {
        const cap = typeof window !== 'undefined' && window.Capacitor;
        return !!(cap && cap.isNativePlatform && cap.isNativePlatform());
    } catch (_) { return false; }
};

export const uploadWithRetry = async (url, options = {}, config = {}) => {
    // Native Android needs more headroom: each gallery pick is a separate
    // Activity, and the WebView's fetch bridge takes a moment to settle
    // when the picker dismisses. Larger budget + longer first backoff
    // covers the "subsequent picks fail" symptom.
    const onNative = isCapacitorNative();
    const {
        maxAttempts = onNative ? 5 : 3,
        backoffsMs  = onNative ? [400, 800, 1500, 2500] : [600, 1500],
        timeoutMs   = 15000,
        settleMs    = onNative ? 350 : 0, // brief wait before the FIRST attempt
    } = config;

    const buildOptions = () => {
        if (typeof options.body === 'function') {
            return { ...options, body: options.body() };
        }
        return options;
    };

    if (!UPLOAD_RETRY_ENABLED) {
        return await fetch(url, buildOptions());
    }

    // Let the Android WebView network bridge settle after a picker Activity.
    if (settleMs > 0) {
        await new Promise((r) => setTimeout(r, settleMs));
    }

    // Per-attempt timeout backed by AbortController — when the deadline fires
    // we cancel the in-flight fetch so it cannot keep running in the background
    // and race the next retry attempt.
    const fetchWithTimeout = (u, opts, ms) => {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), ms);
        return fetch(u, { ...opts, signal: controller.signal })
            .then((res) => { clearTimeout(timer); return res; })
            .catch((err) => {
                clearTimeout(timer);
                if (err && err.name === 'AbortError') {
                    throw new Error(`Upload timed out after ${ms / 1000}s — check your connection and try again`);
                }
                throw err;
            });
    };

    let lastError = null;
    let lastResponse = null;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            const response = await fetchWithTimeout(url, buildOptions(), timeoutMs);

            if (response.status >= 500 && response.status < 600 && attempt < maxAttempts) {
                lastResponse = response;
                try { await response.text(); } catch (_) {}
                const wait = backoffsMs[Math.min(attempt - 1, backoffsMs.length - 1)] || 1000;
                console.warn(`[imageUploadHelper] upload attempt ${attempt} got ${response.status}, retrying in ${wait}ms`);
                await new Promise((r) => setTimeout(r, wait));
                continue;
            }

            return response;
        } catch (err) {
            lastError = err;
            if (attempt < maxAttempts) {
                const wait = backoffsMs[Math.min(attempt - 1, backoffsMs.length - 1)] || 1000;
                console.warn(`[imageUploadHelper] upload attempt ${attempt} failed (${err && err.message}), retrying in ${wait}ms`);
                await new Promise((r) => setTimeout(r, wait));
                continue;
            }
        }
    }

    if (lastError) throw lastError;
    return lastResponse;
};

/**
 * Ensure the File has a sensible MIME type and filename.
 * Returns the same file if nothing needs to change.
 */
export const normalizeImageFile = async (file) => {
    if (!file || !IMAGE_UPLOAD_FIX_ENABLED) return file;

    const hasGoodType = typeof file.type === 'string' && file.type.startsWith('image/');
    const hasGoodName = typeof file.name === 'string' && /\.[a-z0-9]{2,5}$/i.test(file.name);
    if (hasGoodType && hasGoodName) return file;

    const sniffed = await sniffImageMime(file);
    if (!sniffed) return file;

    const extByMime = {
        'image/jpeg': 'jpg', 'image/png': 'png', 'image/gif': 'gif',
        'image/webp': 'webp', 'image/bmp': 'bmp', 'image/heic': 'heic', 'image/tiff': 'tiff'
    };
    const ext = extByMime[sniffed] || 'jpg';
    const baseName = (file.name || '').replace(/[?#].*$/, '').replace(/\.[^.]+$/, '');
    const newName = (baseName || `image-${Date.now()}`) + '.' + ext;

    try {
        return new File([file], newName, { type: sniffed, lastModified: file.lastModified || Date.now() });
    } catch (err) {
        console.warn('[imageUploadHelper] normalizeImageFile: File constructor failed', err);
        return file;
    }
};

const readFileAsDataUrl = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error || new Error('FileReader failed'));
    reader.readAsDataURL(file);
});

const loadImage = (src) => new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Could not decode image'));
    img.src = src;
});

const canvasToBlob = (canvas, mimeType, quality) => new Promise((resolve, reject) => {
    if (canvas.toBlob) {
        canvas.toBlob(
            (blob) => (blob ? resolve(blob) : reject(new Error('Canvas toBlob returned null'))),
            mimeType,
            quality
        );
    } else {
        try {
            const dataUrl = canvas.toDataURL(mimeType, quality);
            const [, base64] = dataUrl.split(',');
            const binary = atob(base64);
            const bytes = new Uint8Array(binary.length);
            for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
            resolve(new Blob([bytes], { type: mimeType }));
        } catch (err) {
            reject(err);
        }
    }
});

/**
 * Compress the file via canvas if it exceeds COMPRESS_THRESHOLD_BYTES.
 * Returns compressed File or the original if compression failed / not needed.
 */
export const compressImageIfNeeded = async (file) => {
    if (!IMAGE_UPLOAD_FIX_ENABLED) return file;
    if (!file || typeof file.size !== 'number') return file;
    if (file.size <= COMPRESS_THRESHOLD_BYTES) return file;

    const lower = (file.name || '').toLowerCase();
    if (/\.(heic|heif)$/i.test(lower) || file.type === 'image/heic' || file.type === 'image/heif') {
        return file;
    }

    try {
        const dataUrl = await readFileAsDataUrl(file);
        const img = await loadImage(dataUrl);

        let { width, height } = img;
        const longest = Math.max(width, height);
        if (longest > TARGET_MAX_DIMENSION) {
            const scale = TARGET_MAX_DIMENSION / longest;
            width = Math.round(width * scale);
            height = Math.round(height * scale);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return file;
        ctx.drawImage(img, 0, 0, width, height);

        const blob = await canvasToBlob(canvas, 'image/jpeg', TARGET_JPEG_QUALITY);
        if (!blob || blob.size === 0) return file;
        if (blob.size >= file.size) return file;

        const newName = (file.name || 'photo.jpg').replace(/\.[^.]+$/, '') + '.jpg';
        return new File([blob], newName, { type: 'image/jpeg', lastModified: Date.now() });
    } catch (err) {
        console.warn('[imageUploadHelper] Compression skipped:', err);
        return file;
    }
};

/**
 * Wrap the given File/Blob in a fresh Blob with a guaranteed image MIME type.
 * Final safety net before FormData.append().
 */
export const toUploadableBlob = async (file) => {
    if (!file) return { blob: file, name: 'upload' };

    let mime = (typeof file.type === 'string' && file.type.startsWith('image/')) ? file.type : null;
    if (!mime) {
        const sniffed = await sniffImageMime(file);
        mime = sniffed || 'image/jpeg';
    }

    const extByMime = {
        'image/jpeg': 'jpg', 'image/png': 'png', 'image/gif': 'gif',
        'image/webp': 'webp', 'image/bmp': 'bmp', 'image/heic': 'heic',
        'image/heif': 'heif', 'image/tiff': 'tiff'
    };
    const wantedExt = extByMime[mime] || 'jpg';
    const rawName = (file.name || '').replace(/[?#].*$/, '');
    const hasGoodName = /\.[a-z0-9]{2,5}$/i.test(rawName);
    const baseName = hasGoodName ? rawName.replace(/\.[^.]+$/, '') : (rawName || `photo-${Date.now()}`);
    const name = `${baseName}.${wantedExt}`;

    try {
        const blob = new Blob([file], { type: mime });
        return { blob, name };
    } catch (err) {
        console.warn('[imageUploadHelper] toUploadableBlob: Blob() failed, sending original', err);
        return { blob: file, name: file.name || name };
    }
};

/**
 * Detects whether the current runtime is a mobile device or Capacitor WebView.
 */
export const isMobileDevice = () => {
    if (typeof window === 'undefined') return false;
    if (window.Capacitor || window.__CAPACITOR__) return true;
    const ua = (typeof navigator !== 'undefined' && navigator.userAgent) || '';
    if (/android|iphone|ipad|ipod|mobile/i.test(ua)) return true;
    try {
        if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) {
            return window.innerWidth <= 900;
        }
    } catch (_) {}
    return false;
};

/**
 * Friendly human-readable size for log/toast messages.
 */
export const formatBytes = (bytes) => {
    if (!Number.isFinite(bytes)) return '—';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};
