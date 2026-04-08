import * as cp from 'child_process';
import * as vscode from 'vscode';

export class TerminalUtil {
    private static outputChannel: vscode.OutputChannel = vscode.window.createOutputChannel('Django Generator');

    /**
     * Executes a shell command in the specified directory.
     */
    static exec(command: string, cwd: string): Promise<{ stdout: string; stderr: string }> {
        this.outputChannel.appendLine(`[Running]: ${command}`);
        
        return new Promise((resolve, reject) => {
            cp.exec(command, { cwd }, (error, stdout, stderr) => {
                if (stdout) {
                    this.outputChannel.append(stdout);
                }
                if (stderr) {
                    this.outputChannel.append(stderr);
                }

                if (error) {
                    this.outputChannel.appendLine(`[Error]: ${error.message}`);
                    reject({ error, stdout, stderr });
                } else {
                    this.outputChannel.appendLine(`[Success]: Command completed successfully.`);
                    resolve({ stdout, stderr });
                }
            });
        });
    }

    /**
     * Shows the output channel to the user.
     */
    static showOutput() {
        this.outputChannel.show();
    }
}
