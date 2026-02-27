import fs from 'fs';
import path from 'path';

function fixFiles(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      fixFiles(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js') || fullPath.endsWith('.css')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('Ã') || content.includes('Â')) {
        try {
          const fixed = Buffer.from(content, 'latin1').toString('utf8');
          fs.writeFileSync(fullPath, fixed, 'utf8');
          console.log('Fixed', fullPath);
        } catch(e) { }
      }
    }
  }
}
fixFiles('c:/Users/gavoc/PIX-CAMARAS/frontend/src');
