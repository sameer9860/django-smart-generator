import * as vscode from 'vscode';
import { showProjectWizard } from '../wizard/projectWizard';

export async function createProject() {
    const config = await showProjectWizard();

    if (config) {
        vscode.window.showInformationMessage(
            `Django Project: ${config.projectName} | App: ${config.appName} | Env: ${config.envName} | .env: ${config.createEnvFiles}`
        );
    } else {
        vscode.window.showWarningMessage('Django project creation cancelled.');
    }
}
