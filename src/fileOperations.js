import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function copyFile(sourcePath, destinationPath) {
  const absoluteSource = path.resolve(__dirname, sourcePath);
  const absoluteDest = path.resolve(__dirname, destinationPath);

  console.log(`Copiando de: ${absoluteSource}`);
  console.log(`Para: ${absoluteDest}`);

  try {
    await fs.copyFile(absoluteSource, absoluteDest);
    console.log('✅ Arquivo copiado com sucesso!');
  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}
