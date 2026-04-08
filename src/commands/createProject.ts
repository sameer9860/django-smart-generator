import * as vscode from 'vscode';
import { showProjectWizard } from '../wizard/projectWizard';
import { DjangoService } from '../services/djangoService';
import { TerminalUtil } from '../utils/terminal';

export async function createProject() {
    const config = await showProjectWizard();

    if (config) {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            vscode.window.showErrorMessage('Please open a folder to generate the Django project.');
            return;
        }

        const cwd = workspaceFolders[0].uri.fsPath;

        try {
            await vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: "Generating Django Project",
                cancellable: false
            }, async (progress) => {
                await DjangoService.createProject(config, cwd, progress);
            });

            vscode.window.showInformationMessage(`Successfully created Django project: ${config.projectName}`);
        } catch (error: any) {
            TerminalUtil.showOutput();
            vscode.window.showErrorMessage(`Failed to create Django project. Check the output for details. Error: ${error?.message || error}`);
        }
    } else {
        vscode.window.showWarningMessage('Django project creation cancelled.');
    }
}
