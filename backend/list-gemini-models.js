// Script to list available Gemini models
import 'dotenv/config';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

console.log('=== Listing Available Gemini Models ===\n');

if (!GEMINI_API_KEY) {
  console.error('❌ GEMINI_API_KEY not found');
  process.exit(1);
}

console.log(`Using API Key: ${GEMINI_API_KEY.substring(0, 20)}...\n`);

// Try both v1 and v1beta
const versions = ['v1', 'v1beta'];

for (const version of versions) {
  console.log(`\n--- API Version: ${version} ---`);
  const url = `https://generativelanguage.googleapis.com/${version}/models?key=${GEMINI_API_KEY}`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error(`❌ Error ${response.status}:`, errorData.error?.message);
      continue;
    }
    
    const data = await response.json();
    const models = data.models || [];
    
    console.log(`✓ Found ${models.length} models:\n`);
    
    models.forEach(model => {
      const name = model.name.replace('models/', '');
      const supportedMethods = model.supportedGenerationMethods || [];
      const supportsGenerate = supportedMethods.includes('generateContent');
      
      console.log(`  ${supportsGenerate ? '✓' : '✗'} ${name}`);
      console.log(`    Methods: ${supportedMethods.join(', ')}`);
      console.log(`    Display Name: ${model.displayName || 'N/A'}`);
      console.log('');
    });
    
  } catch (error) {
    console.error(`❌ Failed to fetch models:`, error.message);
  }
}

console.log('\n=== Recommended Models for generateContent ===');
console.log('Look for models with ✓ above that support generateContent method');
