async function testAskMitra() {
  const prompts = [
    'I have one day in Hyderabad and ₹1000.',
    'Tell me about Golconda Fort.',
    'Suggest food near Charminar.',
    'What experience can I book?'
  ];

  for (const q of prompts) {
    console.log(`\n--- PROMPT: "${q}" ---`);
    const res = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: q }),
    });
    console.log('Status:', res.status);
    const json = await res.json();
    console.log('Response excerpt:', (json.reply || json.text || JSON.stringify(json)).slice(0, 200) + '...');
    console.log('Used Groq:', json.usedGroq);
    console.log('Suggestions:', json.suggestions);
  }
}

testAskMitra().catch(console.error);
