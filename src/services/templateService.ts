import * as path from 'path';
import * as fs from 'fs';
import { FileWriter } from '../utils/fileWriter';

export class TemplateService {
    /**
     * Writes a template file to the workspace.
     */
    static async writeTemplate(cwd: string, fileName: string, content: string): Promise<void> {
        const filePath = path.join(cwd, fileName);
        await FileWriter.writeFile(filePath, content);
    }

    /**
     * Loads a template from the extension's resources.
     */
    static async getTemplateContent(templateName: string): Promise<string> {
        // Templates are copied to dist/templates/ by esbuild.js alongside dist/extension.js
        const templatePath = path.join(__dirname, 'templates', templateName);
        
        try {
            if (fs.existsSync(templatePath)) {
                return fs.readFileSync(templatePath, 'utf8');
            }
            console.error(`Template not found: ${templatePath}`);
            return '';
        } catch (err) {
            console.error(`Error reading template ${templateName}:`, err);
            return '';
        }
    }
}
