import 'dotenv/config';

// KIRO-AI: Script de test pour valider la configuration OpenRouter
// Vérifie que les variables d'environnement sont bien chargées

console.log('\n🔍 Vérification de la configuration OpenRouter...\n');

const checks = [
  {
    name: 'OPENROUTER_API_KEY',
    value: process.env.OPENROUTER_API_KEY,
    required: true,
  },
  {
    name: 'OPENROUTER_BASE_URL',
    value: process.env.OPENROUTER_BASE_URL,
    required: false,
    default: 'https://openrouter.ai/api/v1',
  },
  {
    name: 'OPENROUTER_MODEL',
    value: process.env.OPENROUTER_MODEL,
    required: false,
    default: 'kwaipilot/kat-coder-pro:free',
  },
  {
    name: 'CORS_ORIGIN',
    value: process.env.CORS_ORIGIN,
    required: false,
    default: 'http://localhost:5173',
  },
];

let allGood = true;

checks.forEach(check => {
  const status = check.value ? '✅' : (check.required ? '❌' : '⚠️');
  const displayValue = check.value 
    ? (check.name.includes('KEY') ? check.value.substring(0, 20) + '...' : check.value)
    : (check.default ? `(défaut: ${check.default})` : 'NON DÉFINI');
  
  console.log(`${status} ${check.name}: ${displayValue}`);
  
  if (check.required && !check.value) {
    allGood = false;
  }
});

console.log('\n' + '='.repeat(60));

if (allGood) {
  console.log('✅ Configuration valide ! Le backend peut démarrer.\n');
  process.exit(0);
} else {
  console.log('❌ Configuration incomplète !');
  console.log('   Créez un fichier backend/.env avec :');
  console.log('   OPENROUTER_API_KEY=sk-or-v1-...\n');
  process.exit(1);
}
