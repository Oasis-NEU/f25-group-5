/*

D O   N O T   M O D I F Y   T H I S   F I L E
=============================================
IF YOU MODIFY THIS FILE
YOU MAY BREAK THE CORE MODULE LOADING SYSTEM

=============================================
*/

const fs = require("fs");
const path = require("path");

const fileName = "scripts/" + process.argv[2];
if (!fileName) {
    console.error("provide a valid module name.");
    process.exit(1);
}

const scriptFilePath = path.resolve("./scripts/start.js");
const scriptFileContent = fs.readFileSync(scriptFilePath, "utf-8");
const manifestFile = path.resolve("manifest.json");
const manifest = JSON.parse(fs.readFileSync(manifestFile, "utf8"));

if (scriptFileContent.indexOf(fileName) > -1) {
    console.error("module already imported, no further action needed.");
    process.exit(1);
}

const arrayRegex = /const script_paths = \[\s*([\s\S]*?)\s*\];/m;

const newArrayContent = scriptFileContent.replace(arrayRegex, (match, p1) => {
    // Add new module to array
    const trimmed = p1.trim();
    const newEntry = trimmed ? `${trimmed},\n    "${fileName}"` : `"${fileName}"`;
    return `const script_paths = [\n    ${newEntry}\n];`;
});

fs.writeFileSync(scriptFilePath, newArrayContent, "utf8");
console.info(`Added ${fileName} to script_paths`);

// Add module to web_accessible_resources if not already there
if (!manifest.web_accessible_resources) {
    manifest.web_accessible_resources = [];
}

let resourceEntry = manifest.web_accessible_resources.find(r => r.resources.includes(fileName));

if (!resourceEntry) {
    // Add new entry
    manifest.web_accessible_resources.push({
        resources: [`${fileName}`],
        matches: ["<all_urls>"]
    });
    fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 2), "utf8");
    console.log(`Added ${fileName} to manifest.json`);
} else {
    console.log(`${fileName} already exists in manifest.json`);
}