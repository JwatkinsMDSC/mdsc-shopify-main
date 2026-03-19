#!/usr/bin/env node

/**
 * Animation Contract Regression Guard
 * ====================================
 * 
 * Checks for violations of the unified animate-presence contract.
 * 
 * Run: npm run check:animations
 */

import { readFileSync, readdirSync } from 'fs';
import { join, relative } from 'path';

const UI_DIR = 'src/scripts/core/ui';
const EXCLUDED_FILES = ['slider.js', 'marquee.js', 'animate-presence.js'];

// Forbidden patterns and their explanations
const FORBIDDEN_PATTERNS = [
  {
    pattern: /animateIn\s*\([^,)]+,/,
    message: 'animateIn() must NOT accept options. Remove timing/config parameters.',
    severity: 'error'
  },
  {
    pattern: /animateOut\s*\([^,)]+,/,
    message: 'animateOut() must NOT accept options. Remove timing/config parameters.',
    severity: 'error'
  },
  {
    pattern: /\.style\.setProperty\s*\(\s*['"`]--ui-closed-transform['"`]/,
    message: 'Never set --ui-closed-transform via JavaScript. Use CSS helper classes.',
    severity: 'error'
  },
  {
    pattern: /\.style\.transform\s*=/,
    message: 'Never set style.transform directly (except during live gestures).',
    severity: 'warning',
    exception: 'Allowed only in gesture handlers (onPointerMove, etc.)'
  },
  {
    pattern: /\.style\.transition\s*=\s*['"][^'"]*\d+[ms|s]/,
    message: 'Never set style.transition with timing values. Use CSS only.',
    severity: 'error',
    exception: 'Only "none" or "" (empty string) allowed to disable/reset transitions'
  },
  {
    pattern: /\.style\.opacity\s*=/,
    message: 'Never set style.opacity for animations. Use CSS only.',
    severity: 'warning'
  },
  {
    pattern: /\.animate\s*\(/,
    message: 'Never use Web Animations API (WAAPI) for enter/leave animations.',
    severity: 'error'
  }
];

function scanFile(filePath) {
  const content = readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const violations = [];

  FORBIDDEN_PATTERNS.forEach(({ pattern, message, severity, exception }) => {
    lines.forEach((line, index) => {
      if (pattern.test(line)) {
        violations.push({
          file: relative(process.cwd(), filePath),
          line: index + 1,
          content: line.trim(),
          message,
          severity,
          exception
        });
      }
    });
  });

  return violations;
}

function getAllJSFiles(dir) {
  const files = [];
  const entries = readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    
    if (entry.isDirectory()) {
      files.push(...getAllJSFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.js')) {
      if (!EXCLUDED_FILES.includes(entry.name)) {
        files.push(fullPath);
      }
    }
  }

  return files;
}

function main() {
  console.log('🔍 Checking animation contract...\n');

  const files = getAllJSFiles(UI_DIR);
  let totalViolations = 0;
  let errors = 0;
  let warnings = 0;

  files.forEach(file => {
    const violations = scanFile(file);
    
    if (violations.length > 0) {
      console.log(`\n❌ ${relative(process.cwd(), file)}`);
      
      violations.forEach(v => {
        const icon = v.severity === 'error' ? '  🚫' : '  ⚠️';
        console.log(`${icon} Line ${v.line}: ${v.message}`);
        console.log(`     ${v.content}`);
        if (v.exception) {
          console.log(`     Note: ${v.exception}`);
        }
        
        if (v.severity === 'error') errors++;
        else warnings++;
      });
      
      totalViolations += violations.length;
    }
  });

  console.log('\n' + '='.repeat(60));
  
  if (totalViolations === 0) {
    console.log('✅ No animation contract violations found!');
    console.log(`   Scanned ${files.length} files in ${UI_DIR}/`);
    process.exit(0);
  } else {
    console.log(`Found ${totalViolations} violation(s):`);
    console.log(`  - ${errors} error(s)`);
    console.log(`  - ${warnings} warning(s)`);
    console.log('\nSee animate-presence.md for the complete contract.');
    process.exit(errors > 0 ? 1 : 0);
  }
}

main();
