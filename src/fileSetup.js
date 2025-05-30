import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function createInitialFiles() {
  const filesDir = path.join(__dirname, 'files');
  try {
    await fs.mkdir(filesDir, { recursive: true });
    await fs.writeFile(
      path.join(filesDir, 'readCopy.txt'),
      'Conteúdo inicial do arquivo'
    );
  } catch (error) {
    console.error('❌ Erro ao criar arquivos:', error.message);
    process.exit(1);
  }
}
