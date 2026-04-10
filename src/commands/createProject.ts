import * as vscode from 'vscode';
import { showProjectWizard } from '../wizard/projectWizard';
import { DjangoService } from '../services/djangoService';
import { TerminalUtil } from '../utils/terminal';

export async function createProject() {
    const config = await showProjectWizard();

    if (!config) {
        vscode.window.showWarningMessage('Django project creation cancelled.');
        return;
    }

    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        vscode.window.showErrorMessage('Please open a folder to generate the Django project.');
        return;
    }

    const cwd = workspaceFolders[0].uri.fsPath;

    try {
        let readmePath = '';

        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: `Django Smart Generator`,
            cancellable: false
        }, async (progress) => {
            readmePath = await DjangoService.createProject(config, cwd, progress);
        });

        // Open README.md automatically in the editor
        if (readmePath) {
            const doc = await vscode.workspace.openTextDocument(vscode.Uri.file(readmePath));
            await vscode.window.showTextDocument(doc, { preview: false });
        }

        // Show success notification with "Open Folder" action
        const action = await vscode.window.showInformationMessage(
            `✅ Django project "${config.projectName}" is ready!`,
            'Open Folder'
        );

        if (action === 'Open Folder') {
            await vscode.commands.executeCommand(
                'vscode.openFolder',
                vscode.Uri.file(cwd),
                false
            );
        }

    } catch (error: any) {
        TerminalUtil.showOutput();
        vscode.window.showErrorMessage(
            `❌ Failed to create project "${config.projectName}". Check the Output panel for details.`
        );
    }
}
