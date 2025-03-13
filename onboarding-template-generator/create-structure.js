// create-structure.js
const fs = require('fs');
const path = require('path');

// Create directories if they don't exist
const directories = [
  'src/assets',
  'src/styles',
  'src/components',
  'src/data',
  'src/utils',
  'src/types'
];

directories.forEach(dir => {
  const dirPath = path.resolve(__dirname, dir);
  if (!fs.existsSync(dirPath)) {
    console.log(`Creating directory: ${dir}`);
    fs.mkdirSync(dirPath, { recursive: true });
  } else {
    console.log(`Directory already exists: ${dir}`);
  }
});

// Create empty CSS file if it doesn't exist
const cssFilePath = path.resolve(__dirname, 'src/styles/App.css');
if (!fs.existsSync(cssFilePath)) {
  console.log('Creating App.css file');
  fs.writeFileSync(cssFilePath, '/* Add your styles here */\n');
} else {
  console.log('App.css already exists');
}

console.log('Directory structure created successfully!');