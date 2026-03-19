import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

class ThemeBuilder {
  constructor() {
    this.assetsDir = path.join(rootDir, 'assets');
  }

  log(message, type = 'info') {
    const colors = {
      info: '\x1b[36m',
      success: '\x1b[32m',
      warning: '\x1b[33m',
      error: '\x1b[31m',
      reset: '\x1b[0m'
    };

    const prefix = {
      info: 'ℹ',
      success: '✓',
      warning: '⚠',
      error: '✗'
    };

    console.log(`${colors[type]}${prefix[type]} ${message}${colors.reset}`);
  }

  exec(command) {
    try {
      execSync(command, { stdio: 'inherit', cwd: rootDir });
      return true;
    } catch (error) {
      return false;
    }
  }

  cleanAssets() {
    this.log('Cleaning compiled assets...', 'info');
    
    const filesToKeep = [
      'critical.css',
      'icon-account.svg',
      'icon-cart.svg',
      'shoppy-x-ray.svg'
    ];

    if (fs.existsSync(this.assetsDir)) {
      const files = fs.readdirSync(this.assetsDir);
      
      files.forEach(file => {
        if (!filesToKeep.includes(file)) {
          const filePath = path.join(this.assetsDir, file);
          try {
            fs.unlinkSync(filePath);
          } catch (error) {
            this.log(`Could not delete ${file}: ${error.message}`, 'warning');
          }
        }
      });
    }

    this.log('Assets cleaned', 'success');
  }

  build() {
    console.log('\n🔨 Building Marine Detail Supply Theme\n');
    
    this.cleanAssets();
    
    this.log('Running Vite build...', 'info');
    const success = this.exec('vite build');
    
    if (success) {
      this.log('\n✓ Build completed successfully!', 'success');
      this.showBuildInfo();
      return true;
    } else {
      this.log('\n✗ Build failed', 'error');
      return false;
    }
  }

  showBuildInfo() {
    if (!fs.existsSync(this.assetsDir)) {
      return;
    }

    const files = fs.readdirSync(this.assetsDir);
    const builtFiles = files.filter(f => 
      f.endsWith('.js') || f.endsWith('.css')
    );

    console.log('\nBuilt files:');
    builtFiles.forEach(file => {
      const filePath = path.join(this.assetsDir, file);
      const stats = fs.statSync(filePath);
      const size = (stats.size / 1024).toFixed(2);
      console.log(`  - ${file} (${size} KB)`);
    });
    console.log('');
  }
}

const builder = new ThemeBuilder();
const success = builder.build();
process.exit(success ? 0 : 1);
