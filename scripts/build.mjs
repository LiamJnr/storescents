import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const distDir = path.join(rootDir, "dist");
const publicDir = path.join(rootDir, "public");
const srcDir = path.join(rootDir, "src");

async function copyDir(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

async function build() {
  console.log("🌸 Building NOVEAU / Store Scents storefront into dist/...");
  
  // 1. Clean dist directory
  await fs.rm(distDir, { recursive: true, force: true });
  await fs.mkdir(distDir, { recursive: true });

  // 2. Copy public directory contents to dist
  try {
    await copyDir(publicDir, distDir);
    console.log("✓ Copied public assets to dist/");
  } catch (err) {
    console.warn("Notice: public dir copy", err.message);
  }

  // 3. Copy src directory to dist/src for ES modules
  const distSrc = path.join(distDir, "src");
  await copyDir(srcDir, distSrc);
  console.log("✓ Copied ES modules to dist/src/");

  console.log("✨ Build complete! Output directory: dist/");
}

build().catch(err => {
  console.error("Build failed:", err);
  process.exit(1);
});
