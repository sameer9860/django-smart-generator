import * as fs from 'fs';
import * as path from 'path';

export class FileWriter {
    /**
     * Writes content to a file, creating directories if they don't exist.
     */
    static async writeFile(filePath: string, content: string): Promise<void> {
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        return new Promise((resolve, reject) => {
            fs.writeFile(filePath, content, 'utf8', (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    /**
     * Checks if a file exists.
     */
    static exists(filePath: string): boolean {
        return fs.existsSync(filePath);
    }
}
