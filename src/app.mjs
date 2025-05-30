import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function copyFile(sourcePath, destinationPath) {
  try {
    const absoluteSource = path.resolve(sourcePath);
    const absoluteDest = path.resolve(destinationPath);

    if (absoluteSource === absoluteDest) {
      return {
        success: false,
        message: 'Arquivos de origem e destino são iguais. Operação cancelada.',
      };
    }

    const sourceStats = await fs.stat(absoluteSource);
    if (!sourceStats.isFile()) {
      throw new Error('O caminho de origem não é um arquivo válido');
    }

    await fs.mkdir(path.dirname(absoluteDest), { recursive: true });
    await fs.copyFile(absoluteSource, absoluteDest);

    return {
      success: true,
      message: 'Arquivo copiado com sucesso',
      source: absoluteSource,
      destination: absoluteDest,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      error: error,
    };
  }
}

async function runCLI() {
  if (process.argv.length !== 4) {
    console.error('Uso: node src/app.js <arquivo-origem> <arquivo-destino>');
    process.exit(1);
  }

  const result = await copyFile(process.argv[2], process.argv[3]);

  if (result.success) {
    console.log(result.message);
  } else {
    console.error(`Erro: ${result.message}`);
    process.exit(1);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runCLI();
}
