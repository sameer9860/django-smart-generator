import * as path from 'path';
import { TerminalUtil } from '../utils/terminal';

export class EnvService {
    /**
     * Creates a virtual environment in the specified directory.
     */
    static async createVenv(cwd: string, envName: string): Promise<void> {
        // We'll try python3 first, then python
        try {
            await TerminalUtil.exec(`python3 -m venv ${envName}`, cwd);
        } catch (err) {
            // If python3 fails, try python
            await TerminalUtil.exec(`python -m venv ${envName}`, cwd);
        }
    }

    /**
     * Gets the activation command for the virtual environment based on OS.
     */
    static getActivationCommand(envName: string): string {
        const isWindows = process.platform === 'win32';
        if (isWindows) {
            return path.join(envName, 'Scripts', 'activate');
        } else {
            return `source ${path.join(envName, 'bin', 'activate')}`;
        }
    }

    /**
     * Gets the python path inside the virtual environment.
     */
    static getVenvPythonPath(envName: string): string {
        const isWindows = process.platform === 'win32';
        if (isWindows) {
            return path.join(envName, 'Scripts', 'python.exe');
        } else {
            return path.join(envName, 'bin', 'python');
        }
    }

    /**
     * Gets the pip path inside the virtual environment.
     */
    static getVenvPipPath(envName: string): string {
        const isWindows = process.platform === 'win32';
        if (isWindows) {
            return path.join(envName, 'Scripts', 'pip.exe');
        } else {
            return path.join(envName, 'bin', 'pip');
        }
    }
}
