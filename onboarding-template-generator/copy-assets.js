const fs = require('fs');
const path = require('path');

// Create dist directory structure
const distPath = path.join(__dirname, 'dist');
const distAssetsPath = path.join(distPath, 'assets');

// Ensure directories exist
if (!fs.existsSync(distPath)) fs.mkdirSync(distPath);
if (!fs.existsSync(distAssetsPath)) fs.mkdirSync(distAssetsPath);

// Copy built files from Vite output
const viteOutputPath = path.join(__dirname, 'dist');
const filesToCopy = [
  'popup.html',
  'options.html',
  'assets/popup.js',
  'assets/options.js',
  'assets/tailwind.css'
];

filesToCopy.forEach(file => {
  const src = path.join(viteOutputPath, file);
  const dest = path.join(distPath, file);
  
  if (fs.existsSync(src)) {
    // Ensure destination directory exists
    const destDir = path.dirname(dest);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    
    fs.copyFileSync(src, dest);
  }
});

// Copy manifest and static assets
fs.copyFileSync(
  path.join(__dirname, 'src', 'manifest.json'),
  path.join(distPath, 'manifest.json')
);

const srcAssetsPath = path.join(__dirname, 'src', 'assets');
if (fs.existsSync(srcAssetsPath)) {
  fs.readdirSync(srcAssetsPath).forEach(file => {
    fs.copyFileSync(
      path.join(srcAssetsPath, file),
      path.join(distAssetsPath, file)
    );
  });
}

console.log('All files copied successfully');
