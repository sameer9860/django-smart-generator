import * as path from 'path';
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
     * Placeholder for loading templates from the extension's resources.
     */
    static async getTemplateContent(templateName: string): Promise<string> {
        // This will be expanded in Phase 5
        return '';
    }
}
