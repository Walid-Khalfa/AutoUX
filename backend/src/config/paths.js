import path from "node:path";
import { fileURLToPath } from "node:url";

// KIRO-AI: Resolve absolute paths for data directories
// This ensures consistent file access regardless of where the process is started from
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const ROOT = path.resolve(__dirname, "..", "..", "..");
export const DATA_DIR = path.join(ROOT, "data");
export const LOGS_PATH = path.join(DATA_DIR, "logs.json");
export const FIXSPECS_DIR = path.join(DATA_DIR, "fixspecs");
export const SPECS_DIR = path.join(ROOT, "specs");
