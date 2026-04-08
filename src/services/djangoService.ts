import * as vscode from 'vscode';
import * as path from 'path';
import { ProjectConfig } from '../types/projectConfig';
import { EnvService } from './envService';
import { TerminalUtil } from '../utils/terminal';
import { GitignoreService } from './gitignoreService';

export class DjangoService {
    /**
     * Executes the main project generation flow.
     */
    static async createProject(config: ProjectConfig, cwd: string, progress: vscode.Progress<{ message?: string; increment?: number }>): Promise<void> {
        
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

        // 6. Generate .gitignore (from Phase 4 requirements)
        progress.report({ message: 'Generating .gitignore...', increment: 90 });
        await GitignoreService.writeGitignore(cwd);

        progress.report({ message: 'Project generated successfully!', increment: 100 });
    }
}
