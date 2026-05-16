/**
 * generate-android-icons.js
 * --------------------------
 * Generates all required Android launcher icon sizes from a single
 * high-resolution source image (assets/icon.png, ideally 1024×1024).
 *
 * Usage:
 *   1. Place your AddisNest logo as:  assets/icon.png  (1024×1024 px, PNG)
 *   2. Run:  npm run generate-icons
 *
 * The script writes directly into the Capacitor android resource folders.
 */

const sharp = require('sharp');
const path  = require('path');
const fs    = require('fs');

// ─── Source image ────────────────────────────────────────────────────────────
// Accepts icon.png, icon.jpg, or icon.jpeg (whichever exists first)
const ASSETS_DIR = path.resolve(__dirname, '../assets');
const CANDIDATES = ['icon.png', 'icon.jpg', 'icon.jpeg'];

let SOURCE = null;
for (const name of CANDIDATES) {
  const candidate = path.join(ASSETS_DIR, name);
  if (fs.existsSync(candidate)) {
    SOURCE = candidate;
    console.log(`\n📁  Found source image: assets/${name}`);
    break;
  }
}

if (!SOURCE) {
  console.error(
    '\n❌  Source image not found!\n' +
    '    Please save your AddisNest logo into the assets/ folder as one of:\n' +
    '      assets/icon.png   ← preferred\n' +
    '      assets/icon.jpg\n' +
    '      assets/icon.jpeg\n' +
    '    The image should ideally be 1024×1024 px.\n'
  );
  process.exit(1);
}

// ─── Android res root ────────────────────────────────────────────────────────
const RES = path.resolve(
  __dirname,
  '../android/app/src/main/res'
);

// ─── Icon size definitions ────────────────────────────────────────────────────
// Standard launcher icons (ic_launcher + ic_launcher_round)
const LAUNCHER_SIZES = [
  { dir: 'mipmap-mdpi',    size: 48  },
  { dir: 'mipmap-hdpi',    size: 72  },
  { dir: 'mipmap-xhdpi',   size: 96  },
  { dir: 'mipmap-xxhdpi',  size: 144 },
  { dir: 'mipmap-xxxhdpi', size: 192 },
];

// Foreground layer for adaptive icons (Android 8.0+)
// The full canvas is 108dp; the safe zone is the centre 72dp.
// We resize the logo to fill ~66 % of the canvas (give some padding).
const FOREGROUND_SIZES = [
  { dir: 'mipmap-mdpi',    canvas: 108, logo: 72  },
  { dir: 'mipmap-hdpi',    canvas: 162, logo: 108 },
  { dir: 'mipmap-xhdpi',   canvas: 216, logo: 144 },
  { dir: 'mipmap-xxhdpi',  canvas: 324, logo: 216 },
  { dir: 'mipmap-xxxhdpi', canvas: 432, logo: 288 },
];

// Background colour that matches the AddisNest logo dark-navy background
// Same value is set in values/ic_launcher_background.xml
const BG_COLOUR = { r: 26, g: 39, b: 68, alpha: 1 }; // #1A2744

// ─── Helpers ─────────────────────────────────────────────────────────────────
async function ensureDir(dir) {
  await fs.promises.mkdir(dir, { recursive: true });
}

/**
 * Create a square icon with a solid background + the logo centred.
 */
async function makeIcon(outputPath, totalSize) {
  const src = sharp(SOURCE).resize(totalSize, totalSize, {
    fit: 'contain',
    background: BG_COLOUR,
  });
  await src.toFile(outputPath);
}

/**
 * Create a round icon (circle-clipped via SVG mask).
 */
async function makeRoundIcon(outputPath, totalSize) {
  const r     = totalSize / 2;
  const mask  = Buffer.from(
    `<svg><circle cx="${r}" cy="${r}" r="${r}" /></svg>`
  );

  const resized = await sharp(SOURCE)
    .resize(totalSize, totalSize, {
      fit: 'contain',
      background: BG_COLOUR,
    })
    .png()
    .toBuffer();

  await sharp(resized)
    .composite([{ input: mask, blend: 'dest-in' }])
    .png()
    .toFile(outputPath);
}

/**
 * Create the adaptive-icon foreground layer:
 * transparent canvas (canvasSize×canvasSize) with the logo centred.
 */
async function makeForeground(outputPath, canvasSize, logoSize) {
  const logoBuffer = await sharp(SOURCE)
    .resize(logoSize, logoSize, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();

  const offset = Math.round((canvasSize - logoSize) / 2);

  await sharp({
    create: {
      width:      canvasSize,
      height:     canvasSize,
      channels:   4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: logoBuffer, top: offset, left: offset }])
    .png()
    .toFile(outputPath);
}

// ─── Main ────────────────────────────────────────────────────────────────────
(async () => {
  console.log('\n🚀  Generating Android launcher icons…\n');

  // 1. Standard launcher icons
  for (const { dir, size } of LAUNCHER_SIZES) {
    const folder = path.join(RES, dir);
    await ensureDir(folder);

    const regular = path.join(folder, 'ic_launcher.png');
    const round   = path.join(folder, 'ic_launcher_round.png');

    await makeIcon(regular, size);
    await makeRoundIcon(round, size);

    console.log(`  ✅  ${dir} — ic_launcher.png (${size}×${size}), ic_launcher_round.png`);
  }

  // 2. Adaptive-icon foreground layers
  for (const { dir, canvas, logo } of FOREGROUND_SIZES) {
    const folder = path.join(RES, dir);
    await ensureDir(folder);

    const fg = path.join(folder, 'ic_launcher_foreground.png');
    await makeForeground(fg, canvas, logo);

    console.log(`  ✅  ${dir} — ic_launcher_foreground.png (${canvas}×${canvas} canvas, ${logo}×${logo} logo)`);
  }

  console.log('\n✅  All icons generated successfully!');
  console.log('\nNext steps:');
  console.log('  1.  npx cap sync android');
  console.log('  2.  npx cap run android   (or rebuild in Android Studio)\n');
})();
