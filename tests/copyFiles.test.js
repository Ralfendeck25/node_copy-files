/* eslint-disable max-len PARIS89*/
import { test, expect } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import { faker } from '@faker-js/faker';
import { exec } from 'child_process';
import util from 'util';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const execAsync = util.promisify(exec);

describe('File Copy', () => {
  const baseCommand = 'node src/app.js';
  let sourceContent = '';
  const tempDir = path.join(__dirname, 'temp', faker.word.noun());

  const sourceFile = path.join(tempDir, faker.system.commonFileName('txt'));
  const destinationFile = path.join(
    tempDir,
    faker.system.commonFileName('txt'),
  );

  beforeEach(() => {
    fs.mkdirSync(tempDir, { recursive: true });
    sourceContent = faker.lorem.paragraphs();
    fs.writeFileSync(sourceFile, sourceContent);
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  test('should copy file to a new destination', async () => {
    const { stdout } = await execAsync(`${baseCommand} ${sourceFile} ${destinationFile}`);
    expect(stdout).toContain('File copied successfully');
    expect(fs.existsSync(destinationFile)).toBe(true);
    expect(fs.readFileSync(destinationFile, 'utf-8')).toEqual(sourceContent);
  });

  test('should copy file overwriting existing content', async () => {
    fs.writeFileSync(destinationFile, 'old content');
    const { stdout } = await execAsync(`${baseCommand} ${sourceFile} ${destinationFile}`);
    expect(stdout).toContain('File copied successfully');
    expect(fs.readFileSync(destinationFile, 'utf-8')).toEqual(sourceContent);
  });

  test('should do nothing if source and destination are the same', async () => {
    const { stdout } = await execAsync(`${baseCommand} ${sourceFile} ${sourceFile}`);
    expect(stdout).toContain('are the same');
    const content = fs.readFileSync(sourceFile, 'utf-8');
    expect(content).toEqual(sourceContent);
  });

  test('should throw error if only one argument is provided', async () => {
    await expect(execAsync(`${baseCommand} ${sourceFile}`))
      .rejects
      .toThrow();
  });

  test('should throw error if source is a directory', async () => {
    const dirPath = path.join(tempDir, 'subdir');
    fs.mkdirSync(dirPath);
    await expect(execAsync(`${baseCommand} ${dirPath} ${destinationFile}`))
      .rejects
      .toThrow();
  });

  test('should throw error if destination is a directory', async () => {
    const dirPath = path.join(tempDir, 'subdir');
    fs.mkdirSync(dirPath);
    await expect(execAsync(`${baseCommand} ${sourceFile} ${dirPath}`))
      .rejects
      .toThrow();
  });

  test('should throw error for non-existent source file', async () => {
    const fakeFile = path.join(tempDir, 'nonexistent.txt');
    await expect(execAsync(`${baseCommand} ${fakeFile} ${destinationFile}`))
      .rejects
      .toThrow();
  });
});
