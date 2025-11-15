// Quick test script to verify Gemini API connection
import 'dotenv/config';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash-exp';

console.log('=== Testing Gemini API Connection ===\n');

if (!GEMINI_API_KEY) {
  console.error('❌ GEMINI_API_KEY not found in environment variables');
  console.log('Please add it to backend/.env file');
  process.exit(1);
}

console.log(`✓ API Key found: ${GEMINI_API_KEY.substring(0, 20)}...`);
console.log(`✓ Model: ${GEMINI_MODEL}\n`);

console.log('Testing API connection...\n');

const url = `https://generativelanguage.googleapis.com/v1/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

const testPrompt = 'Respond with a JSON object containing: {"status": "ok", "message": "Gemini is working"}';

try {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: testPrompt
        }]
      }],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 100,
      }
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('❌ API Error:', response.status);
    console.error('Details:', JSON.stringify(errorData, null, 2));
    process.exit(1);
  }

  const data = await response.json();
  const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

  console.log('✅ Connection successful!\n');
  console.log('Response from Gemini:');
  console.log(responseText);
  console.log('\n=== Test completed successfully ===');
  
} catch (error) {
  console.error('❌ Connection failed:', error.message);
  console.log('\nPossible issues:');
  console.log('1. Invalid API key');
  console.log('2. Network connectivity problem');
  console.log('3. API quota exceeded');
  console.log('\nGet your API key at: https://aistudio.google.com/app/apikey');
  process.exit(1);
}
