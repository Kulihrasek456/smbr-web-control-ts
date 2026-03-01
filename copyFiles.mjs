import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("copying licenses");
fs.cpSync(
    path.join(__dirname,"LICENSE"),
    path.join(__dirname,"dist","LICENSE")
);
fs.cpSync(
    path.join(__dirname,"LICENSES.md"),
    path.join(__dirname,"dist","LICENSES.md")
);

console.log("copying files from client");
fs.cpSync(
    path.join(__dirname,"client","dist"),
    path.join(__dirname,"dist","client"),
    {recursive: true}
);

console.log("copying files from server");
fs.cpSync(
    path.join(__dirname,"server","dist"),
    path.join(__dirname,"dist","dist"),
    {recursive: true}
);

console.log("copying package.json and package-lock.json");
fs.cpSync(
    path.join(__dirname,"server","package.json"),
    path.join(__dirname,"dist","package.json")
);
fs.cpSync(
    path.join(__dirname,"server","package-lock.json"),
    path.join(__dirname,"dist","package-lock.json")
);
