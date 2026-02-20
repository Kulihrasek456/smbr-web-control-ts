import { getProjectLicenses } from "generate-license-file";
import fs from "fs";

async function generateFullLicenseFile() {
    try {
        const outputFilePath = "./LICENSES.md";
        const paths = ["./package.json", "./client/package.json", "./server/package.json"];

        let output = "";
        output += "# MAIN PROJECT LICENSE\n\n";

        output += "This project is licensed under the GNU General Public License v3.0 (GPL-3.0).\n";
        output += "Please see the LICENSE file in the root directory for full details.\n\n\n";


        output += "# THIRD-PARTY SOFTWARE LICENSES\n\n";
        output += "The following information provides the licensing details for the\n";
        output += "dependencies used in the client and server applications.\n\n";

        const results = await Promise.all(paths.map(p => getProjectLicenses(p)));
        const allLicenses = results.flat();

        allLicenses.forEach((licenseGroup, index) => {
            output += `## LICENSE NO. ${index + 1}\n\n`;
            output += `USED BY:\n`;

            licenseGroup.dependencies.forEach(dep => {
                output += ` - ${dep}\n`;
            });

            output += `\nTEXT:\n`;
            output += `\`\`\`\`\`\n`;
            output += `${licenseGroup.content}\n`;
            output += `\`\`\`\`\`\n\n`;
        });

        fs.writeFileSync(outputFilePath, output);

        console.log("Success: " + outputFilePath + " has been generated.");
    } catch (error) {
        console.error("Error: Failed to generate license file:", error);
    }
}

generateFullLicenseFile();