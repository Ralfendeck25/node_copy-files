import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Copies a file from source to destination with validation and error handling
 * @param {string} sourcePath Relative or absolute path to source file
 * @param {string} destinationPath Relative or absolute path to destination file
 * @returns {Promise<{success: boolean, message: string, source: string, destination: string}>}
 */
async function copyFile(sourcePath, destinationPath) {
    try {
        // Resolve and normalize paths
        const absoluteSource = path.resolve(__dirname, sourcePath);
        const absoluteDest = path.resolve(__dirname, destinationPath);

        // Validate paths
        if (absoluteSource === absoluteDest) {
            return {
                success: false,
                message: 'Source and destination paths are identical',
                source: absoluteSource,
                destination: absoluteDest
            };
        }

        // Verify source exists and is a file
        let sourceStats;
        try {
            sourceStats = await fs.stat(absoluteSource);
        } catch (err) {
            if (err.code === 'ENOENT') {
                throw new Error(`Source file does not exist: ${absoluteSource}`);
            }
            throw err;
        }

        if (!sourceStats.isFile()) {
            throw new Error(`Source is not a regular file: ${absoluteSource}`);
        }

        // Create destination directory if needed
        const destDir = path.dirname(absoluteDest);
        try {
            await fs.mkdir(destDir, { recursive: true });
        } catch (err) {
            if (err.code !== 'EEXIST') {
                throw new Error(`Failed to create destination directory: ${destDir}`);
            }
        }

        // Perform the copy operation
        await fs.copyFile(absoluteSource, absoluteDest);

        return {
            success: true,
            message: 'File copied successfully',
            source: absoluteSource,
            destination: absoluteDest
        };
    } catch (error) {
        return {
            success: false,
            message: error.message,
            source: sourcePath,
            destination: destinationPath
        };
    }
}

/**
 * Command Line Interface handler
 */
async function runCLI() {
    if (process.argv.length !== 4) {
        console.error('Usage: node src/app.js <source-file> <destination-file>');
        console.error('Example: node src/app.js files/input.txt files/output.txt');
        process.exit(1);
    }

    const [, , source, destination] = process.argv;
    const result = await copyFile(source, destination);

    if (!result.success) {
        console.error(`Error: ${result.message}`);
        process.exit(1);
    }

    console.log(result.message);
    console.log(`Source: ${result.source}`);
    console.log(`Destination: ${result.destination}`);
}

// Run CLI only if executed directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    runCLI();
}

export { copyFile };
