// create-icons.js
const fs = require('fs');
const path = require('path');

// Create a very basic SVG icon for placeholder purposes
function createBasicIcon(size) {
  return `
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#0078D4" rx="${size/8}"/>
  <text x="${size/2}" y="${size/2 + size/16}" font-family="Arial" font-size="${size/3}" fill="white" text-anchor="middle">MS</text>
</svg>
  `.trim();
}

// Ensure the assets directory exists
const assetsDir = path.resolve(__dirname, 'src/assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// Create icons for different sizes
const iconSizes = [16, 48, 128];

iconSizes.forEach(size => {
  const iconPath = path.resolve(assetsDir, `icon${size}.svg`);
  console.log(`Creating ${size}x${size} icon at: ${iconPath}`);
  fs.writeFileSync(iconPath, createBasicIcon(size));
});

console.log('Icons created successfully!');
console.log('Note: For a production extension, replace these with proper PNG icons.');