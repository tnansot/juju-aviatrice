// Copie le catalogue Markdown (src/content) vers dist/content après compilation.
// tsc ne copie pas les fichiers non-TS : le loader (ADR-015) résout son contenu
// via import.meta.url (../content), donc dist/contenu/loader.js a besoin de
// dist/content en production (le stage prod du Dockerfile ne copie que dist/).
import { cpSync, rmSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const src = resolve(here, "../src/content");
const dest = resolve(here, "../dist/content");

rmSync(dest, { recursive: true, force: true });
cpSync(src, dest, { recursive: true });

console.log(`[copy-content] ${src} → ${dest}`);
