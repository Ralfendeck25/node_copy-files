import fs from 'fs/promises';

const source = process.argv[2];
const destination = process.argv[3];

async function app(src, dest) {
  console.log('source', src);

  if (!src || !dest) {
    console.error('Please provide source and destination paths');
    return;
  }

  try {
    const srcStats = await fs.stat(src);
    if (srcStats.isDirectory()) {
      console.error('Source is a directory');
      return;
    }

    try {
      const destStats = await fs.stat(dest);
      if (destStats.isDirectory()) {
        console.error('Destination is a directory');
        return;
      }
      console.log('Destination file exists and will be overwritten');
    } catch (err) {
      // Destination doesn't exist (okay)
    }

    await fs.copyFile(src, dest);
    console.log('File copied successfully');
  } catch (err) {
    console.error('Error:', err.message);
  }
}

app(source, destination);
