import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuração para obter __dirname em ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function copyFile(sourcePath, destinationPath) {
    try {
        // Resolve caminhos relativos à pasta do arquivo app.js
        const absoluteSource = path.resolve(__dirname, sourcePath);
        const absoluteDest = path.resolve(__dirname, destinationPath);

        console.log(`Copiando de: ${absoluteSource}`);
        console.log(`Para: ${absoluteDest}`);

        // Verifica se são o mesmo arquivo
        if (absoluteSource === absoluteDest) {
            console.log('Origem e destino são iguais. Nenhuma ação necessária.');
            return;
        }

        // Verifica se a origem existe e é arquivo
        const sourceStats = await fs.stat(absoluteSource);
        if (!sourceStats.isFile()) {
            throw new Error('A origem deve ser um arquivo, não um diretório');
        }

        // Cria diretório de destino se não existir
        const destDir = path.dirname(absoluteDest);
        await fs.mkdir(destDir, { recursive: true });

        // Executa a cópia
        await fs.copyFile(absoluteSource, absoluteDest);
        console.log('✅ Arquivo copiado com sucesso!');
    } catch (error) {
        console.error('❌ Erro:', error.message);
        process.exit(1);
    }
}

// Validação dos argumentos
if (process.argv.length !== 4) {
    console.error('Uso correto: node src/app.js <arquivo-origem> <arquivo-destino>');
    console.error('Exemplo: node src/app.js files/readCopy.txt files/readCopy2.txt');
    process.exit(1);
}

const [, , source, destination] = process.argv;
copyFile(source, destination);
