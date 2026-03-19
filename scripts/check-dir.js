import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// The expected project root should contain package.json with the correct name
const projectRoot = path.resolve(__dirname, '..');
const packageJsonPath = path.join(projectRoot, 'package.json');

try {
  if (!fs.existsSync(packageJsonPath)) {
    console.error('\x1b[31m%s\x1b[0m', 'Error: package.json not found. You must run this command from the project root directory.');
    process.exit(1);
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  if (packageJson.name !== 'marine-detail-supply-theme') {
    console.error('\x1b[31m%s\x1b[0m', 'Error: Incorrect project directory. Please run from the root of marine-detail-supply-theme.');
    process.exit(1);
  }

  // Check if we are actually in the project root by comparing CWD
  const currentDir = process.cwd();
  const relativePath = path.relative(projectRoot, currentDir);
  
  if (relativePath !== '' && relativePath !== '.') {
     // Allow running if we are inside the project but warn if not at root, 
     // OR strictly enforce root. The user asked "unless we are in the correct directory".
     // Usually npm scripts run from where package.json is if run via `npm run`, 
     // but if they manually run node scripts or if npm is run from a subdir it might differ.
     // However, `npm run` usually sets CWD to the package root.
     // If the user ran `cd src/styles && npm run build`, npm looks up the tree for package.json.
     // But `npm run` executes the script with CWD set to where package.json is located.
     // Wait, actually `npm run` sets the CWD to the directory containing package.json 
     // UNLESS it's a workspace.
     
     // If the user is in `src/styles` and types `npm run build`, npm will find the package.json in root
     // and execute the script. The CWD of the script execution IS the root.
     // So `process.cwd()` will be the root.
     
     // The user's issue "playerreplay@DESKTOP-DJKGDF4:~/projects/mdsc-shopify-theme/src/styles$ cd ../.."
     // implies they moved OUT of the project root to `~/projects/mdsc-shopify-theme` (which IS the root).
     // Wait, `cd ../..` from `src/styles` goes to `mdsc-shopify-theme`.
     // The prompt shows:
     // playerreplay@DESKTOP-DJKGDF4:~/projects/mdsc-shopify-theme/src/styles$ cd ../..
     // playerreplay@DESKTOP-DJKGDF4:~/projects/mdsc-shopify-theme$ npm run build
     
     // This looks like they ARE in the root.
     // "we shouldn't be able to run npm run build / anything unless we are in the correct directory"
     
     // Maybe they meant if they run it from a WRONG directory?
     // If I am in `~/projects` and run `npm run build`, it won't work because no package.json.
     
     // If they meant "I want to ensure I am in the root of THIS specific project", 
     // checking for specific file existence (like layout/theme.liquid) is a good check.
     
     if (!fs.existsSync(path.join(currentDir, 'layout', 'theme.liquid'))) {
         console.error('\x1b[31m%s\x1b[0m', 'Error: You must run this command from the project root directory (containing layout/theme.liquid).');
         process.exit(1);
     }
  }

} catch (error) {
  console.error('\x1b[31m%s\x1b[0m', 'Error verifying directory:', error.message);
  process.exit(1);
}
