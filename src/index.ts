#!/usr/bin/env node

import path from "path";
import fs from "fs-extra";
import { fileURLToPath } from "url";
import {
  cancel,
  intro,
  isCancel,
  outro,
  select,
  spinner,
  text,
} from "@clack/prompts";
import color from "picocolors";

// Setup paths for local templates
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const templateRoot = path.resolve(__dirname, "../templates");

intro(color.bgCyan(color.black(" create-aunty ")));

// Ask for project directory
const directory = await text({
  message: "Where should we create your new project?",
  placeholder: "./my-new-project",
  initialValue: "my-new-project",
  validate(value) {
    if (value.length === 0) return `Directory name is required!`;
  },
});

// Handle ctrl+c (cancel)
if (isCancel(directory)) {
  cancel("Operation cancelled.");
  process.exit(0);
}

// Ask for project type (maps to folder names in /templates)
const projectType = await select({
  message: "Pick a template.",
  options: [{ value: "svelte", label: "Svelte" }],
});

if (isCancel(projectType)) {
  cancel("Operation cancelled.");
  process.exit(0);
}

const spin = spinner();
spin.start(`Creating project in ${color.cyan(directory as string)}...`);

const targetDir = path.resolve(process.cwd(), directory as string);
const sourceDir = path.join(templateRoot, projectType as string);

if (!fs.existsSync(sourceDir)) {
  spin.stop("Failed.");
  cancel(`Template "${projectType}" not found in ${sourceDir}`);
  process.exit(1);
}

try {
  await fs.copy(sourceDir, targetDir);

  // Rename _gitignore -> .gitignore
  const gitignore = path.join(targetDir, "_gitignore");
  if (fs.existsSync(gitignore)) {
    await fs.rename(gitignore, path.join(targetDir, ".gitignore"));
  }

  // Update package.json name
  const pkgPath = path.join(targetDir, "package.json");
  if (fs.existsSync(pkgPath)) {
    const pkg = await fs.readJson(pkgPath);
    pkg.name = path.basename(targetDir);
    await fs.writeJson(pkgPath, pkg, { spaces: 2 });
  }

  // Replace {{PROJECT_DIR}} in vite.config.ts
  const viteConfigPath = path.join(targetDir, "vite.config.ts");
  if (fs.existsSync(viteConfigPath)) {
    let viteConfig = await fs.readFile(viteConfigPath, "utf-8");
    // Use the directory name (without path) as the project slug
    const projectSlug = path.basename(targetDir);
    viteConfig = viteConfig.replace(/\{\{PROJECT_DIR\}\}/g, projectSlug);
    await fs.writeFile(viteConfigPath, viteConfig);
  }

  spin.stop(`Created project in ${color.cyan(directory as string)}`);

  outro(
    `You're all set! \n\nRun:\n  cd ${directory}\n  npm install\n  npm start`
  );
} catch (error) {
  spin.stop("Failed.");
  cancel("Error creating project: " + (error as Error).message);
  process.exit(1);
}
