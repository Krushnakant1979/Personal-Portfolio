const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      if (f !== 'node_modules' && f !== '.next') {
        walkDir(dirPath, callback);
      }
    } else {
      if (f.endsWith('.js') || f.endsWith('.jsx')) {
        callback(dirPath);
      }
    }
  });
}

walkDir('c:/Krushna portfolio/client', (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('process.env.NEXT_PUBLIC_API_URL')) {
    // Replace incorrectly closed single quotes with backticks
    content = content.replace(/\$\{process\.env\.NEXT_PUBLIC_API_URL\}([^']*?)'\)/g, "$${process.env.NEXT_PUBLIC_API_URL}$1`)");
    content = content.replace(/\$\{process\.env\.NEXT_PUBLIC_API_URL\}([^']*?)', \{/g, "$${process.env.NEXT_PUBLIC_API_URL}$1`, {");
    content = content.replace(/\$\{process\.env\.NEXT_PUBLIC_API_URL\}([^']*?)';/g, "$${process.env.NEXT_PUBLIC_API_URL}$1`;");
    
    fs.writeFileSync(filePath, content);
    console.log('Fixed', filePath);
  }
});
