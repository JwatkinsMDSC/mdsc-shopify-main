# Multi-Store Management Guide

## Overview

The Marine Detail Supply theme is designed as a **single source of truth** system that powers multiple franchise stores from one codebase. This architecture enables:

- **Global updates** that propagate to all stores
- **Store-specific customizations** via overrides
- **Centralized maintenance** and version control
- **Consistent branding** across franchises
- **Efficient deployment** to multiple locations

## Architecture

### Single Source Repository

```
Global Theme Repository (Git)
    ↓
    ├── Headquarters Store
    ├── Franchise Store A
    ├── Franchise Store B
    ├── Franchise Store C
    └── Regional Stores...
```

**Key Principles:**

1. **One Codebase**: All stores share the same base theme
2. **Override System**: Stores can customize specific elements
3. **Version Control**: All changes tracked in Git
4. **Atomic Deployments**: Deploy to specific stores or all at once

## Store Configuration

### Directory Structure

```
config/stores/
├── headquarters/
│   ├── config.json
│   └── overrides/
│       ├── settings_data.json
│       └── snippets/
│           └── custom-footer.liquid
├── franchise-001/
│   ├── config.json
│   └── overrides/
└── franchise-002/
    ├── config.json
    └── overrides/
```

### Configuration File

Each store has a `config.json`:

```json
{
  "storeName": "franchise-001",
  "storeUrl": "franchise001.myshopify.com",
  "displayName": "Marine Detail Supply - Northeast",
  "environment": "production",
  "franchiseInfo": {
    "franchiseId": "FR-001",
    "region": "Northeast",
    "owner": "John Smith",
    "openDate": "2024-01-15"
  },
  "settings": {
    "locale": "en",
    "currency": "USD",
    "timezone": "America/New_York"
  },
  "features": {
    "multiCurrency": false,
    "giftCards": true,
    "customerAccounts": true,
    "productReviews": true,
    "localInventory": true
  },
  "customization": {
    "primaryColor": "#0097a7",
    "headerStyle": "default",
    "footerLayout": "simple",
    "showFranchiseInfo": true,
    "showLocalHours": true
  },
  "contactInfo": {
    "phone": "(555) 123-4567",
    "email": "northeast@marinedetail.com",
    "address": "123 Harbor Drive, Portland, ME 04101"
  }
}
```

## Store Overrides

### How Overrides Work

Overrides allow stores to customize specific elements without modifying the global theme:

1. **Base Theme**: Global files in repository
2. **Store Overrides**: Files in `config/stores/{store-name}/overrides/`
3. **Deployment**: Overrides are applied during deployment
4. **Priority**: Store overrides take precedence over global files

### What Can Be Overridden

#### Settings Data

Override theme settings:

`config/stores/franchise-001/overrides/settings_data.json`

```json
{
  "current": {
    "logo": "franchise-logo.png",
    "colors_accent_1": "#1890ff",
    "typography_primary_font": "Montserrat",
    "announcement_bar_text": "Free shipping on orders over $50!",
    "footer_copyright": "© 2024 Marine Detail Supply - Northeast Franchise"
  }
}
```

#### Snippets

Override or add custom snippets:

`config/stores/franchise-001/overrides/snippets/contact-info.liquid`

```liquid
<div class="franchise-contact">
  <p>📍 123 Harbor Drive, Portland, ME</p>
  <p>📞 (555) 123-4567</p>
  <p>📧 northeast@marinedetail.com</p>
  <p>🕒 Mon-Sat: 9AM-6PM, Sun: 10AM-4PM</p>
</div>
```

#### Sections

Override specific sections:

`config/stores/franchise-001/overrides/sections/header.liquid`

```liquid
<!-- Custom header with franchise branding -->
<header class="franchise-header">
  <!-- Franchise-specific header -->
</header>
```

#### Assets

Store-specific images or files:

```
config/stores/franchise-001/overrides/assets/
├── franchise-logo.png
├── store-banner.jpg
└── custom-icon.svg
```

### Creating Overrides

1. **Create override directory**
   ```bash
   mkdir -p config/stores/{store-name}/overrides
   ```

2. **Add override files**
   ```bash
   mkdir -p config/stores/{store-name}/overrides/snippets
   touch config/stores/{store-name}/overrides/snippets/custom-banner.liquid
   ```

3. **Edit override file**
   Match the structure of the global file you're overriding.

4. **Deploy with overrides**
   ```bash
   npm run deploy -- --store={store-name}
   ```

## Global Updates

### Propagating Changes

When you make changes to the global theme, you can deploy to all stores:

#### Update Process

1. **Make changes** to global theme files
   ```bash
   git checkout dev
   # Edit files
   ```

2. **Commit changes**
   ```bash
   git add .
   git commit -m "Add new product carousel feature"
   ```

3. **Build theme**
   ```bash
   npm run build
   ```

4. **Test on one store**
   ```bash
   npm run deploy -- --store=headquarters
   ```

5. **Deploy to all stores**
   ```bash
   npm run deploy -- --all
   ```

### Selective Updates

Deploy to specific store groups:

```bash
# Headquarters only
npm run deploy -- --store=headquarters

# Specific franchises
npm run deploy -- --store=franchise-001
npm run deploy -- --store=franchise-002

# All at once
npm run deploy -- --all
```

### Update Strategy

**Rolling Deployment:**

```bash
# Phase 1: Test store
npm run deploy -- --store=headquarters

# Verify and wait 24 hours

# Phase 2: Pilot franchises
npm run deploy -- --store=franchise-001
npm run deploy -- --store=franchise-002

# Verify and wait 24 hours

# Phase 3: All remaining stores
npm run deploy -- --all
```

## Managing Franchise Stores

### Adding a New Franchise

1. **Create store configuration**
   ```bash
   mkdir -p config/stores/franchise-003
   touch config/stores/franchise-003/config.json
   ```

2. **Configure store details**
   ```json
   {
     "storeName": "franchise-003",
     "storeUrl": "franchise003.myshopify.com",
     "displayName": "Marine Detail Supply - Southwest",
     "environment": "production",
     "franchiseInfo": {
       "franchiseId": "FR-003",
       "region": "Southwest",
       "owner": "Jane Doe",
       "openDate": "2024-06-01"
     }
   }
   ```

3. **Add franchise-specific overrides** (if needed)
   ```bash
   mkdir -p config/stores/franchise-003/overrides
   ```

4. **Initial deployment**
   ```bash
   npm run build
   npm run deploy -- --store=franchise-003
   ```

5. **Document addition**
   ```bash
   echo "Added franchise-003 on $(date)" >> franchise-log.md
   git add .
   git commit -m "Add franchise-003 store configuration"
   ```

### Removing a Franchise

1. **Archive configuration**
   ```bash
   mkdir -p config/stores/_archived
   mv config/stores/franchise-old config/stores/_archived/
   ```

2. **Document removal**
   ```bash
   echo "Archived franchise-old on $(date)" >> franchise-log.md
   git add .
   git commit -m "Archive franchise-old store"
   ```

3. **Update deployment scripts** (if store-specific logic exists)

## Synchronization

### Keeping Stores in Sync

#### Version Tracking

Each store should run the same theme version:

```bash
# Tag a release
git tag -a v2.1.0 -m "Release v2.1.0 - New product filters"
git push origin v2.1.0

# Deploy tagged version to all stores
git checkout v2.1.0
npm run build
npm run deploy -- --all
```

#### Tracking Deployed Versions

Maintain a deployment log:

`deployment-status.md`
```markdown
# Deployment Status

| Store | Current Version | Deployed Date | Status |
|-------|----------------|---------------|---------|
| headquarters | v2.1.0 | 2024-01-15 | ✓ Active |
| franchise-001 | v2.1.0 | 2024-01-15 | ✓ Active |
| franchise-002 | v2.0.9 | 2024-01-10 | ⚠ Outdated |
| franchise-003 | v2.1.0 | 2024-01-15 | ✓ Active |
```

### Handling Version Drift

If stores get out of sync:

1. **Identify outdated stores**
   ```bash
   # Review deployment-status.md
   ```

2. **Checkout target version**
   ```bash
   git checkout v2.1.0
   ```

3. **Deploy to outdated stores**
   ```bash
   npm run build
   npm run deploy -- --store=franchise-002
   ```

4. **Update tracking**
   ```bash
   # Update deployment-status.md
   ```

## Store Groups

### Organizing Stores

Group stores by:
- **Region**: Northeast, Southwest, Midwest, etc.
- **Type**: Franchise, Corporate, Flagship
- **Size**: Small, Medium, Large
- **Features**: Full-service, Express, Mobile

### Configuration by Group

Create group-specific settings:

`config/groups/northeast.json`
```json
{
  "region": "Northeast",
  "timezone": "America/New_York",
  "currency": "USD",
  "shippingRegion": "US-NE",
  "stores": [
    "franchise-001",
    "franchise-004",
    "franchise-007"
  ]
}
```

### Deploying to Groups

Create a group deployment script:

`scripts/deploy-group.js`
```javascript
import fs from 'fs';
import { execSync } from 'child_process';

const group = process.argv[2];
const groupConfig = JSON.parse(
  fs.readFileSync(`config/groups/${group}.json`, 'utf8')
);

groupConfig.stores.forEach(store => {
  console.log(`Deploying to ${store}...`);
  execSync(`npm run deploy -- --store=${store}`, { stdio: 'inherit' });
});
```

Usage:
```bash
node scripts/deploy-group.js northeast
```

## Best Practices

### Global Theme Changes

1. **Test extensively** before global deployment
2. **Use feature flags** for experimental features
3. **Document changes** in changelog
4. **Communicate updates** to franchise owners
5. **Schedule deployments** during low-traffic periods

### Store Overrides

1. **Minimize overrides**: Keep stores as consistent as possible
2. **Document overrides**: Explain why each override is needed
3. **Review regularly**: Remove obsolete overrides
4. **Test overrides**: Ensure they work with global updates
5. **Version control**: Commit all override changes

### Communication

1. **Notify franchise owners** before major updates
2. **Provide training** on new features
3. **Document changes** in release notes
4. **Offer support** during transition
5. **Gather feedback** after deployment

### Maintenance

1. **Regular audits**: Review all store configurations quarterly
2. **Performance monitoring**: Track site speed across stores
3. **Update schedule**: Plan regular update cycles
4. **Backup strategy**: Maintain theme backups
5. **Rollback plan**: Be ready to revert if needed

## Troubleshooting

### Store Not Updating

**Problem:** Changes not appearing after deployment

**Solutions:**
1. Clear browser cache
2. Verify theme is published in Shopify Admin
3. Check override files aren't conflicting
4. Review deployment logs for errors

### Overrides Not Working

**Problem:** Store overrides not being applied

**Solutions:**
1. Check file paths match exactly
2. Verify override directory structure
3. Ensure files are valid Liquid/JSON
4. Check deployment script logs

### Version Conflicts

**Problem:** Different stores running incompatible versions

**Solutions:**
1. Identify all store versions
2. Choose target version
3. Deploy systematically to all stores
4. Update tracking documentation

## Monitoring

### Store Health Checks

Regular monitoring:

```bash
# Check all stores are accessible
for store in config/stores/*/; do
  store_name=$(basename $store)
  echo "Checking $store_name..."
  curl -I "https://${store_name}.myshopify.com"
done
```

### Performance Monitoring

Track metrics:
- Page load times
- Time to First Byte (TTFB)
- Largest Contentful Paint (LCP)
- Cumulative Layout Shift (CLS)

Use Shopify Analytics or external tools like:
- Google PageSpeed Insights
- WebPageTest
- Lighthouse

## Advanced Topics

### Dynamic Store Configuration

Use Liquid to access store config:

```liquid
{% comment %}
  Store-specific settings can be added via metafields
  or theme settings per store
{% endcomment %}

{% if shop.metafields.franchise.region == 'Northeast' %}
  <div class="regional-banner">
    Serving the Northeast Region
  </div>
{% endif %}
```

### A/B Testing

Test features on specific stores:

```liquid
{% if shop.url contains 'franchise-001' or shop.url contains 'franchise-002' %}
  <!-- New experimental feature -->
  {% render 'new-product-grid' %}
{% else %}
  <!-- Standard feature -->
  {% render 'product-grid' %}
{% endif %}
```

### Automated Deployments

Set up CI/CD for automatic deployments:

`.github/workflows/deploy-all-stores.yml`
```yaml
name: Deploy to All Stores

on:
  push:
    tags:
      - 'v*'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - run: npm run deploy -- --all --yes
        env:
          SHOPIFY_CLI_TOKEN: ${{ secrets.SHOPIFY_CLI_TOKEN }}
```

## Resources

- [Shopify Multi-Store](https://www.shopify.com/enterprise/multi-store)
- [Theme Architecture](./development.md)
- [Deployment Guide](./deployment.md)

## Support

For multi-store questions:
1. Review this documentation
2. Check store configuration files
3. Review deployment logs
4. Contact theme administrator
