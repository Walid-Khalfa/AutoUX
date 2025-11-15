import express from "express";
import fs from "node:fs";
import path from "node:path";
import { readLogs } from "../services/logSource.js";
import { analyzeLogs } from "../services/issueAnalyzer.js";
import { FIXSPECS_DIR } from "../config/paths.js";

const router = express.Router();

// KIRO-AI: GET /api/issues - DÉSACTIVÉ (mode LLM uniquement)
// Les issues sont générées uniquement via POST /api/upload avec analyse LLM
// Cette route retourne un message indiquant qu'il faut uploader des fichiers
router.get("/issues", async (req, res) => {
  // KIRO-AI: Pas de chargement automatique de données mock
  // L'utilisateur doit uploader des fichiers pour générer un rapport LLM
  res.json({
    issues: [],
    count: 0,
    message: "Aucune donnée disponible. Uploadez des fichiers logs via POST /api/upload pour générer une analyse IA.",
  });
});

// KIRO-AI: GET /api/issues/:id - DÉSACTIVÉ (mode LLM uniquement)
// Les issues sont générées uniquement via POST /api/upload
router.get("/issues/:id", async (req, res) => {
  res.status(404).json({
    error: {
      message: "Issue not found. Uploadez des fichiers via POST /api/upload pour générer des issues.",
      code: "ISSUE_NOT_FOUND",
      timestamp: new Date().toISOString(),
    },
  });
});

// KIRO-AI: GET /api/fixspecs - List all generated fixspecs
// This endpoint reads all fixspec files from the data/fixspecs directory
// Returns: { fixspecs: Array<Fixspec>, count: number }
// Error codes: FIXSPECS_READ_FAILED
router.get("/fixspecs", async (req, res) => {
  try {
    // KIRO-AI: Check if fixspecs directory exists
    if (!fs.existsSync(FIXSPECS_DIR)) {
      // Return empty array if directory doesn't exist yet
      return res.json({
        fixspecs: [],
        count: 0,
      });
    }

    // KIRO-AI: Read all files from fixspecs directory
    const files = fs.readdirSync(FIXSPECS_DIR);

    // KIRO-AI: Filter for JSON files only (exclude .gitkeep and other non-JSON files)
    const jsonFiles = files.filter((file) => file.endsWith(".json"));

    // KIRO-AI: Read and parse each fixspec file
    const fixspecs = jsonFiles.map((file) => {
      const filepath = path.join(FIXSPECS_DIR, file);
      const content = fs.readFileSync(filepath, "utf-8");
      return JSON.parse(content);
    });

    // KIRO-AI: Return all fixspecs with count
    res.json({
      fixspecs,
      count: fixspecs.length,
    });
  } catch (error) {
    // KIRO-AI: Handle file system or parsing errors
    console.error("[KIRO-AI] ❌ Error reading fixspecs:", error);
    res.status(500).json({
      error: {
        message: "Failed to read fixspecs",
        code: "FIXSPECS_READ_FAILED",
        details: error.message,
        timestamp: new Date().toISOString(),
      },
    });
  }
});

export default router;
