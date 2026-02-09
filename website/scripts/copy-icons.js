const fs = require('fs');
const path = require('path');

// Read the SVG
const svgPath = path.join(__dirname, '../src/app/icon.svg');
const svgContent = fs.readFileSync(svgPath, 'utf8');

// For now, just copy the SVG to public
const publicSvgPath = path.join(__dirname, '../public/icon.svg');
fs.copyFileSync(svgPath, publicSvgPath);

console.log('✓ Copied icon.svg to public/');
console.log('Note: For PNG icons (192x192, 512x512), please use an online SVG to PNG converter');
console.log('Or install sharp: npm install sharp');
