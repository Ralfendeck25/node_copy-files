import { test, expect } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import { faker } from '@faker-js/faker';
import { exec } from 'child_process';
import { promisify } from 'util';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const execAsync = promisify(exec);

describe('File Copy', () => {
  const baseCommand = 'node src/app.js';
  let sourceContent = '';
  const tempDir = path.join(__dirname, 'temp', faker.string.uuid());

  const sourceFile = path.join(tempDir, faker.system.commonFileName('txt'));
  const destinationFile = path.join(tempDir, faker.system.commonFileName('txt'));

  beforeEach(() => {
    try {
      fs.mkdirSync(tempDir, { recursive: true });
      sourceContent = faker.lorem.paragraphs();
      fs.writeFileSync(sourceFile, sourceContent);
    } catch (error) {
      console.error('Test setup failed:', error);
      throw error;
    }
  });

  afterEach(() => {
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch (error) {
      console.error('Test cleanup failed:', error);
    }
  });

  test('should copy file to new destination', async () => {
    console.log(`Testing copy from ${sourceFile} to ${destinationFile}`);

    const { stdout } = await execAsync(`"${baseCommand}" "${sourceFile}" "${destinationFile}"`);

    expect(stdout).toContain('Arquivo copiado com sucesso');
    expect(fs.existsSync(destinationFile)).toBe(true);

    const copiedContent = fs.readFileSync(destinationFile, 'utf-8');
    expect(copiedContent).toEqual(sourceContent);
  });

  test('should overwrite existing file', async () => {
    const differentContent = faker.lorem.paragraph();
    fs.writeFileSync(destinationFile, differentContent);

    const { stdout } = await execAsync(`"${baseCommand}" "${sourceFile}" "${destinationFile}"`);

    expect(stdout).toContain('Arquivo copiado com sucesso');
    expect(fs.readFileSync(destinationFile, 'utf-8')).toEqual(sourceContent);
  });

  test('should handle identical source and destination', async () => {
    const { stdout } = await execAsync(`"${baseCommand}" "${sourceFile}" "${sourceFile}"`);

    expect(stdout).toContain('Arquivos de origem e destino são iguais');
    expect(fs.readFileSync(sourceFile, 'utf-8')).toEqual(sourceContent);
  });

  test('should fail with missing arguments', async () => {
    await expect(execAsync(`"${baseCommand}"`))
      .rejects
      .toThrow();
  });

  test('should fail when source is directory', async () => {
    const dirPath = path.join(tempDir, 'subdir');
    fs.mkdirSync(dirPath);

    await expect(execAsync(`"${baseCommand}" "${dirPath}" "${destinationFile}"`))
      .rejects
      .toThrow();
  });

  test('should fail for non-existent source', async () => {
    const fakeFile = path.join(tempDir, 'nonexistent.txt');

    await expect(execAsync(`"${baseCommand}" "${fakeFile}" "${destinationFile}"`))
      .rejects
      .toThrow();
  });
});
