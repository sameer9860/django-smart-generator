import { FileWriter } from '../utils/fileWriter';
import * as path from 'path';

export class GitignoreService {
    private static standardGitignore: string = `
# Byte-compiled / optimized / DLL files
__pycache__/
*.py[cod]
*$py.class

# OS generated files
.DS_Store
Thumbs.db

# Virtual environments
venv/
env/
.venv

# Django
db.sqlite3
.env

# Media/Static
/static/
/media/
`;

    /**
     * Writes a standard Django .gitignore to the workspace.
     */
    static async writeGitignore(cwd: string): Promise<void> {
        const filePath = path.join(cwd, '.gitignore');
        await FileWriter.writeFile(filePath, this.standardGitignore.trim());
    }
}
