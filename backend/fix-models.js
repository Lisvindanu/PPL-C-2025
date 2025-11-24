const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Find all model files
const modelFiles = glob.sync('src/**/models/*Model.js', { cwd: __dirname });

console.log(`Found ${modelFiles.length} model files\n`);

let fixedCount = 0;

modelFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;

  // Replace CHAR(36) with UUID
  content = content.replace(/DataTypes\.CHAR\(36\)/g, 'DataTypes.UUID');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed: ${file}`);
    fixedCount++;
  }
});

console.log(`\n✅ Fixed ${fixedCount} model files`);
console.log('Nodemon should auto-restart the server now');
