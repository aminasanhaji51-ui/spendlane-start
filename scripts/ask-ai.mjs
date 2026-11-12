// Sends a file of instructions and one or more input files to an OpenAI model,
// then prints the answer. Usage: node scripts/ask-ai.mjs <instructions> <input> [more inputs]
import { readFile } from 'node:fs/promises';

const MAX_INPUT_CHARACTERS = 40000;
const [instructionsPath, ...inputPaths] = process.argv.slice(2);
const apiKey = process.env.OPENAI_API_KEY;
const model = process.env.OPENAI_MODEL || 'gpt-4.1-mini';

if (!instructionsPath || inputPaths.length === 0) {
  console.error('Usage: node scripts/ask-ai.mjs <instructions> <input> [more inputs]');
  process.exit(1);
}
if (!apiKey) {
  console.log('No OPENAI_API_KEY available: the AI step was skipped.');
  process.exit(0);
}

const instructions = await readFile(instructionsPath, 'utf8');
const files = await Promise.all(inputPaths.map(async (path) => `--- ${path} ---\n${await readFile(path, 'utf8')}`));
let input = files.join('\n\n');
if (input.length > MAX_INPUT_CHARACTERS) {
  input = `${input.slice(0, MAX_INPUT_CHARACTERS)}\n[input cut at ${MAX_INPUT_CHARACTERS} characters]`;
}

const response = await fetch('https://api.openai.com/v1/responses', {
  method: 'POST',
  headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({ model, instructions, input, temperature: 0.2, max_output_tokens: 1200 }),
});
const data = await response.json();
if (!response.ok) {
  console.error(`The model call failed: ${data.error?.message ?? response.status}`);
  process.exit(1);
}

const message = data.output.find((item) => item.type === 'message');
console.log(message.content.map((part) => part.text).join(''));
console.error(`${data.model}: ${data.usage.input_tokens} input tokens, ${data.usage.output_tokens} output tokens`);
