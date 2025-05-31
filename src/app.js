'use strict';

const fs = require('node:fs');
const path = require('node:path');

const source = process.argv[2];
const destination = process.argv[3];
const extraContent = process.argv[4]; // Conteúdo adicional opcional

function app(src, dest) {
  try {
    // Verificações iniciais
    if (!src || !dest) {
      throw new Error('Please provide source and destination paths');
    }

    // Verifica se o source existe
    if (!fs.existsSync(src)) {
      throw new Error('Source file does not exist');
    }

    // Verifica se o source é um arquivo
    const srcStats = fs.statSync(src);
    if (srcStats.isDirectory()) {
      throw new Error('Source is a directory');
    }

    // Verifica se o destino é um diretório
    if (fs.existsSync(dest)) {
      const destStats = fs.statSync(dest);
      if (destStats.isDirectory()) {
        throw new Error('Destination is a directory');
      }
      console.log('Warning: Destination file will be overwritten');
    }

    // Copia o arquivo
    fs.copyFileSync(src, dest);
    console.log('File copied successfully');

    // Adiciona conteúdo extra se fornecido
    if (extraContent) {
      fs.appendFileSync(dest, extraContent);
      console.log('Extra content added to destination file');
    }
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

app(source, destination);
