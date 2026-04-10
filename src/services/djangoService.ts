import * as vscode from 'vscode';
import * as path from 'path';
import { ProjectConfig } from '../types/projectConfig';
import { EnvService } from './envService';
import { TerminalUtil } from '../utils/terminal';
import { GitignoreService } from './gitignoreService';
import { TemplateService } from './templateService';
import { SecretKeyGenerator } from '../utils/secretKey';

export class DjangoService {
    /**
     * Executes the main project generation flow.
     */
    static async createProject(config: ProjectConfig, cwd: string, progress: vscode.Progress<{ message?: string; increment?: number }>): Promise<string> {
        let readmePath = '';
        
        // 1. Create Virtual Environment
        progress.report({ message: `Creating virtual environment (${config.envName})...`, increment: 10 });
        await EnvService.createVenv(cwd, config.envName);

        const pythonPath = EnvService.getVenvPythonPath(config.envName);
        const pipPath = EnvService.getVenvPipPath(config.envName);

        // 2. Install Dependencies
        progress.report({ message: 'Installing Django and python-dotenv...', increment: 30 });
        await TerminalUtil.exec(`${pipPath} install django python-dotenv`, cwd);

        // 3. Create Django Project
        progress.report({ message: `Creating Django project: ${config.projectName}...`, increment: 50 });
        await TerminalUtil.exec(`${pythonPath} -m django startproject ${config.projectName} .`, cwd);

        // 4. Create Initial App
        progress.report({ message: `Creating App: ${config.appName}...`, increment: 70 });
        await TerminalUtil.exec(`${pythonPath} manage.py startapp ${config.appName}`, cwd);

        // 5. Run Initial Migrations
        progress.report({ message: 'Running initial migrations...', increment: 80 });
        await TerminalUtil.exec(`${pythonPath} manage.py migrate`, cwd);

        // 6. Generate .gitignore
        progress.report({ message: 'Generating .gitignore...', increment: 85 });
        await GitignoreService.writeGitignore(cwd);

        // 7. Generate .env and .env.example
        if (config.createEnvFiles) {
            progress.report({ message: 'Generating .env files...', increment: 90 });
            const secretKey = SecretKeyGenerator.generate();
            const envContent = await TemplateService.getTemplateContent('env.txt');
            if (envContent) {
                const finalEnv = envContent.replace('{{SECRET_KEY}}', secretKey);
                await TemplateService.writeTemplate(cwd, '.env', finalEnv);
            }

            const envExampleContent = await TemplateService.getTemplateContent('env.example.txt');
            if (envExampleContent) {
                await TemplateService.writeTemplate(cwd, '.env.example', envExampleContent);
            }
        }

        // 8. Generate README.md
        progress.report({ message: 'Generating README.md...', increment: 95 });
        const readmeContent = await TemplateService.getTemplateContent('readme.md');
        if (readmeContent) {
            const activationCmd = EnvService.getActivationCommand(config.envName);
            const finalReadme = readmeContent
                .replace('{{PROJECT_NAME}}', config.projectName)
                .replace('{{VENV_ACTIVATE}}', activationCmd);
            readmePath = path.join(cwd, 'README.md');
            await TemplateService.writeTemplate(cwd, 'README.md', finalReadme);
        }

        progress.report({ message: 'Project generated successfully!', increment: 100 });
        return readmePath;
    }
}
