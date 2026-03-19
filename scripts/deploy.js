import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

class MultiStoreDeployer {
  constructor() {
    this.args = this.parseArgs();
    this.storeConfigPath = path.join(rootDir, 'config', 'stores');
  }

  parseArgs() {
    const args = process.argv.slice(2);
    const parsed = {
      store: null,
      all: false,
      build: true,
      skipConfirmation: false,
      environment: 'production'
    };

    args.forEach(arg => {
      if (arg.startsWith('--store=')) {
        parsed.store = arg.split('=')[1];
      } else if (arg === '--all') {
        parsed.all = true;
      } else if (arg === '--no-build') {
        parsed.build = false;
      } else if (arg === '--yes' || arg === '-y') {
        parsed.skipConfirmation = true;
      } else if (arg.startsWith('--env=')) {
        parsed.environment = arg.split('=')[1];
      }
    });

    return parsed;
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

  exec(command, options = {}) {
    try {
      return execSync(command, {
        stdio: 'inherit',
        cwd: rootDir,
        ...options
      });
    } catch (error) {
      this.log(`Command failed: ${command}`, 'error');
      throw error;
    }
  }

  async build() {
    this.log('Building theme assets...', 'info');
    try {
      this.exec('npm run build');
      this.log('Build completed successfully', 'success');
      return true;
    } catch (error) {
      this.log('Build failed', 'error');
      return false;
    }
  }

  getStoreConfig(storeName) {
    const configPath = path.join(this.storeConfigPath, storeName, 'config.json');
    
    if (!fs.existsSync(configPath)) {
      return null;
    }

    try {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      return config;
    } catch (error) {
      this.log(`Error reading store config for ${storeName}: ${error.message}`, 'error');
      return null;
    }
  }

  getAllStores() {
    if (!fs.existsSync(this.storeConfigPath)) {
      this.log('No store configurations found', 'warning');
      return [];
    }

    return fs.readdirSync(this.storeConfigPath)
      .filter(dir => {
        const configPath = path.join(this.storeConfigPath, dir, 'config.json');
        return fs.existsSync(configPath);
      });
  }

  applyStoreOverrides(storeName) {
    const overridesPath = path.join(this.storeConfigPath, storeName, 'overrides');
    
    if (!fs.existsSync(overridesPath)) {
      return;
    }

    this.log(`Applying overrides for ${storeName}...`, 'info');

  }

  async deployToStore(storeName) {
    this.log(`\n${'='.repeat(60)}`, 'info');
    this.log(`Deploying to: ${storeName}`, 'info');
    this.log('='.repeat(60), 'info');

    const config = this.getStoreConfig(storeName);
    
    if (!config) {
      this.log(`Store configuration not found for: ${storeName}`, 'error');
      this.log(`Create config at: config/stores/${storeName}/config.json`, 'warning');
      return false;
    }

    const storeUrl = config.storeUrl || config.store;
    
    if (!storeUrl) {
      this.log('Store URL not found in config', 'error');
      return false;
    }

    try {
      this.applyStoreOverrides(storeName);

      this.log(`Pushing theme to ${storeUrl}...`, 'info');
      this.exec(`shopify theme push --store=${storeUrl} --path=${rootDir}`);
      
      this.log(`Successfully deployed to ${storeName}`, 'success');
      return true;
    } catch (error) {
      this.log(`Failed to deploy to ${storeName}`, 'error');
      return false;
    }
  }

  async run() {
    console.log('\n🚢 Marine Detail Supply - Multi-Store Deployer\n');

    if (this.args.build) {
      const buildSuccess = await this.build();
      if (!buildSuccess) {
        this.log('Build failed. Deployment aborted.', 'error');
        process.exit(1);
      }
    } else {
      this.log('Skipping build (--no-build flag)', 'warning');
    }

    let stores = [];

    if (this.args.all) {
      stores = this.getAllStores();
      if (stores.length === 0) {
        this.log('No stores found to deploy to', 'error');
        process.exit(1);
      }
      this.log(`Found ${stores.length} stores to deploy to`, 'info');
    } else if (this.args.store) {
      stores = [this.args.store];
    } else {
      this.log('Please specify a store with --store=<store-name> or use --all', 'error');
      this.log('\nUsage:', 'info');
      this.log('  npm run deploy -- --store=storeA', 'info');
      this.log('  npm run deploy -- --all', 'info');
      this.log('  npm run deploy -- --store=storeA --no-build', 'info');
      process.exit(1);
    }

    if (!this.args.skipConfirmation) {
      this.log(`\nYou are about to deploy to: ${stores.join(', ')}`, 'warning');
      this.log('Press Ctrl+C to cancel or wait 5 seconds to continue...', 'warning');
      await new Promise(resolve => setTimeout(resolve, 5000));
    }

    let successCount = 0;
    let failCount = 0;

    for (const store of stores) {
      const success = await this.deployToStore(store);
      if (success) {
        successCount++;
      } else {
        failCount++;
      }
    }

    console.log('\n' + '='.repeat(60));
    this.log(`Deployment complete: ${successCount} succeeded, ${failCount} failed`, 
      failCount === 0 ? 'success' : 'warning');
    console.log('='.repeat(60) + '\n');

    process.exit(failCount > 0 ? 1 : 0);
  }
}

const deployer = new MultiStoreDeployer();
deployer.run().catch(error => {
  console.error('Deployment error:', error);
  process.exit(1);
});
