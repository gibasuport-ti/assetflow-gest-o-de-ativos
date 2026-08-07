
import fs from 'fs';
import path from 'path';

const OUTPUT_FILE = 'project-bundle.md';
const INCLUDE_DIRS = ['components', 'services'];
const INCLUDE_FILES = [
  'App.tsx',
  'types.ts',
  'constants.ts',
  'index.tsx',
  'index.html',
  'package.json',
  'tsconfig.json',
  'vite.config.ts',
  'metadata.json'
];

const EXCLUDE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.pdf'];

function getFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getFiles(filePath, fileList);
    } else {
      const ext = path.extname(file).toLowerCase();
      if (!EXCLUDE_EXTENSIONS.includes(ext)) {
        fileList.push(filePath);
      }
    }
  });
  return fileList;
}

async function bundle() {
  let bundleContent = '# AssetFlow Project Bundle\n\nGenerated on: ' + new Date().toLocaleString() + '\n\n';
  
  const allFiles = [];
  
  // Add root files
  INCLUDE_FILES.forEach(file => {
    if (fs.existsSync(file)) {
      allFiles.push(file);
    }
  });
  
  // Add directory files
  INCLUDE_DIRS.forEach(dir => {
    if (fs.existsSync(dir)) {
      getFiles(dir, allFiles);
    }
  });

  for (const filePath of allFiles) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const relativePath = filePath;
      const ext = path.extname(filePath).substring(1) || 'text';
      
      bundleContent += `## File: ${relativePath}\n\n`;
      bundleContent += '```' + (ext === 'tsx' || ext === 'ts' ? 'typescript' : ext) + '\n';
      bundleContent += content;
      bundleContent += '\n```\n\n---\n\n';
      
      console.log(`Added: ${relativePath}`);
    } catch (err) {
      console.error(`Error reading ${filePath}:`, err);
    }
  }

  fs.writeFileSync(OUTPUT_FILE, bundleContent);
  console.log(`\nSuccess! Project bundled into ${OUTPUT_FILE}`);
}

bundle();
