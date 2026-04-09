import { TemplateService } from './templateService';

export class GitignoreService {
    /**
     * Writes a standard Django .gitignore to the workspace.
     */
    static async writeGitignore(cwd: string): Promise<void> {
        const content = await TemplateService.getTemplateContent('gitignore.txt');
        if (content) {
            await TemplateService.writeTemplate(cwd, '.gitignore', content);
        }
    }
}
