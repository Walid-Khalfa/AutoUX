#!/usr/bin/env node

// Script de vérification de sécurité pour AutoUX
// Vérifie les vulnérabilités courantes avant le déploiement

import { readFileSync, existsSync } from 'fs';
import { execSync } from 'child_process';

console.log('🔒 AutoUX Security Check\n');

let errors = 0;
let warnings = 0;

// 1. Vérifier que les fichiers .env ne sont pas trackés par Git
console.log('1️⃣  Checking .env files...');
const envFiles = ['backend/.env', 'frontend/.env', 'web3/.env', '.env'];

envFiles.forEach(file => {
  if (existsSync(file)) {
    try {
      const result = execSync(`git ls-files --error-unmatch ${file} 2>/dev/null`, { encoding: 'utf-8' });
      if (result) {
        console.log(`   ❌ CRITICAL: ${file} is tracked by Git!`);
        console.log(`      Run: git rm --cached ${file}`);
        errors++;
      }
    } catch (e) {
      console.log(`   ✅ ${file} is not tracked by Git`);
    }
  }
});

// 2. Vérifier que .gitignore contient .env
console.log('\n2️⃣  Checking .gitignore...');
if (existsSync('.gitignore')) {
  const gitignore = readFileSync('.gitignore', 'utf-8');
  if (gitignore.includes('.env')) {
    console.log('   ✅ .env is in .gitignore');
  } else {
    console.log('   ❌ CRITICAL: .env is NOT in .gitignore!');
    errors++;
  }
} else {
  console.log('   ⚠️  WARNING: .gitignore not found');
  warnings++;
}

// 3. Scanner les dépendances avec npm audit
console.log('\n3️⃣  Scanning dependencies...');
try {
  execSync('npm audit --audit-level=high', { stdio: 'inherit' });
  console.log('   ✅ No high/critical vulnerabilities found');
} catch (e) {
  console.log('   ⚠️  WARNING: Vulnerabilities found (see above)');
  warnings++;
}

// 4. Vérifier que les clés API ne sont pas hardcodées
console.log('\n4️⃣  Checking for hardcoded secrets...');
const patterns = [
  { pattern: /AIzaSy[a-zA-Z0-9_-]{33}/, name: 'Google API Key' },
  { pattern: /sk-or-v1-[a-zA-Z0-9]{64}/, name: 'OpenRouter API Key' },
  { pattern: /0x[a-fA-F0-9]{64}/, name: 'Ethereum Private Key' },
];

const filesToCheck = [
  'backend/src/**/*.js',
  'frontend/src/**/*.{js,jsx}',
];

let secretsFound = false;
filesToCheck.forEach(glob => {
  try {
    const files = execSync(`find ${glob.replace('**/', '')} -type f 2>/dev/null || true`, { encoding: 'utf-8' })
      .split('\n')
      .filter(f => f);
    
    files.forEach(file => {
      if (existsSync(file)) {
        const content = readFileSync(file, 'utf-8');
        patterns.forEach(({ pattern, name }) => {
          if (pattern.test(content)) {
            console.log(`   ❌ CRITICAL: ${name} found in ${file}!`);
            secretsFound = true;
            errors++;
          }
        });
      }
    });
  } catch (e) {
    // Ignore errors
  }
});

if (!secretsFound) {
  console.log('   ✅ No hardcoded secrets found');
}

// 5. Vérifier la configuration de sécurité
console.log('\n5️⃣  Checking security configuration...');

// Vérifier rate limiting
if (existsSync('backend/src/middleware/rateLimiter.js')) {
  console.log('   ✅ Rate limiter configured');
} else {
  console.log('   ⚠️  WARNING: Rate limiter not found');
  warnings++;
}

// Vérifier security headers
if (existsSync('backend/src/middleware/securityHeaders.js')) {
  console.log('   ✅ Security headers configured');
} else {
  console.log('   ⚠️  WARNING: Security headers not found');
  warnings++;
}

// 6. Vérifier les variables d'environnement requises
console.log('\n6️⃣  Checking environment variables...');
const requiredEnvVars = [
  { file: 'backend/.env', vars: ['GEMINI_API_KEY', 'AI_PROVIDER', 'CORS_ORIGIN'] },
  { file: 'frontend/.env', vars: ['VITE_API_BASE_URL'] },
];

requiredEnvVars.forEach(({ file, vars }) => {
  if (existsSync(file)) {
    const content = readFileSync(file, 'utf-8');
    vars.forEach(varName => {
      if (content.includes(`${varName}=`) && !content.includes(`${varName}=\n`)) {
        console.log(`   ✅ ${varName} is set in ${file}`);
      } else {
        console.log(`   ⚠️  WARNING: ${varName} is not set in ${file}`);
        warnings++;
      }
    });
  } else {
    console.log(`   ⚠️  WARNING: ${file} not found`);
    warnings++;
  }
});

// Résumé
console.log('\n' + '='.repeat(50));
console.log('📊 Security Check Summary\n');

if (errors === 0 && warnings === 0) {
  console.log('✅ All checks passed! Your application is secure.');
  process.exit(0);
} else {
  if (errors > 0) {
    console.log(`❌ ${errors} critical issue(s) found`);
  }
  if (warnings > 0) {
    console.log(`⚠️  ${warnings} warning(s) found`);
  }
  
  console.log('\n📚 See SECURITY.md for more information');
  
  if (errors > 0) {
    console.log('\n🚨 CRITICAL ISSUES MUST BE FIXED BEFORE DEPLOYMENT!');
    process.exit(1);
  } else {
    process.exit(0);
  }
}
