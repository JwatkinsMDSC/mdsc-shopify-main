# Store-Specific Configurations

This directory contains configuration files for each franchise store in the Marine Detail Supply network.

## Directory Structure

```
config/stores/
├── headquarters/
│   ├── config.json
│   └── overrides/
│       ├── settings_data.json
│       └── snippets/
├── example-franchise/
│   ├── config.json
│   └── overrides/
└── README.md
```

## Creating a New Store Configuration

1. Create a new directory with your store name:
   ```bash
   mkdir config/stores/your-store-name
   ```

2. Create a `config.json` file with store details:
   ```json
   {
     "storeName": "your-store-name",
     "storeUrl": "your-store.myshopify.com",
     "displayName": "Your Store Display Name",
     "environment": "production"
   }
   ```

3. (Optional) Create an `overrides` directory for store-specific customizations:
   ```bash
   mkdir config/stores/your-store-name/overrides
   ```

## Store Configuration Fields

- **storeName**: Internal identifier for the store
- **storeUrl**: Shopify store URL (e.g., "store.myshopify.com")
- **displayName**: Human-readable store name
- **environment**: Deployment environment ("production", "staging", "development")
- **franchiseInfo**: Additional franchise details (optional)
- **settings**: Store-specific settings
- **features**: Feature flags for the store
- **customization**: Visual and functional customizations
- **contactInfo**: Store contact information

## Using Overrides

The `overrides` directory can contain:

- `settings_data.json`: Override theme settings
- `settings_schema.json`: Override settings schema
- `snippets/`: Store-specific snippet files
- `sections/`: Store-specific section files

Overrides are applied during deployment and take precedence over global theme files.

## Deploying to Stores

Deploy to a specific store:
```bash
npm run deploy -- --store=your-store-name
```

Deploy to all configured stores:
```bash
npm run deploy -- --all
```

Deploy without rebuilding:
```bash
npm run deploy -- --store=your-store-name --no-build
```

## Best Practices

1. **Keep configurations minimal**: Only override what's necessary
2. **Document customizations**: Add comments in config.json explaining custom settings
3. **Test before deploying**: Always test changes in a development environment first
4. **Version control**: Commit all store configurations to Git
5. **Consistent naming**: Use lowercase with hyphens for store names
