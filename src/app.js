const fs = require('fs/promises');
const path = require('path');

async function copyFile(sourcePath, destinationPath) {
  try {
    await fs.copyFile(sourcePath, destinationPath);
    console.log('✅ Arquivo copiado com sucesso!');
  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

// Cria arquivos iniciais
async function setupFiles() {
  try {
    await fs.mkdir('files', { recursive: true });
    await fs.writeFile('files/readCopy.txt', 'Conteúdo inicial');
  } catch (error) {
    console.error('❌ Erro na configuração:', error.message);
    process.exit(1);
  }
}

// Execução principal
async function main() {
  await setupFiles();
  await copyFile('files/readCopy.txt', 'files/readCopy2.txt');
}

main();
