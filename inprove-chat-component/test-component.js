// Simple test to verify the component builds correctly
console.log('Testing Chat Component...');

// Test the built files exist
const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, 'dist');
const files = fs.readdirSync(distPath);

console.log('Built files:', files);

// Check for required files
const requiredFiles = [
  'index.js',
  'index.d.ts',
  'ChatComponent.js',
  'ChatComponent.d.ts',
  'types.js',
  'types.d.ts'
];

const missingFiles = requiredFiles.filter(file => !files.includes(file));

if (missingFiles.length > 0) {
  console.error('❌ Missing required files:', missingFiles);
  process.exit(1);
} else {
  console.log('✅ All required files present');
}

// Test package.json
const packageJson = require('./package.json');
console.log('Package name:', packageJson.name);
console.log('Package version:', packageJson.version);
console.log('Main entry:', packageJson.main);
console.log('TypeScript types:', packageJson.types);

console.log('✅ Component test completed successfully!'); 