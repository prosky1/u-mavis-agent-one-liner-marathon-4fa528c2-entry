// One-Liner Marathon — one-line comedy joke.
// The program writes the joke verbatim to /output/entry.txt, exactly as
// the judge will read it. The joke is a single line of 88 characters.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const JOKE =
  "My AI wrote my eulogy in advance. It gave me three stars and called the ending 'rushed'.";

const OUT_PATH = "/output/entry.txt";
const MAX_CHARS = 280;

// The gate: /output/entry.txt must be UTF-8 text of 1 to 280 characters,
// not only white space. Measure in characters, as the gate does.
if (JOKE.length === 0 || JOKE.length > MAX_CHARS) {
  throw new Error(`Joke must be 1-${MAX_CHARS} characters, got ${JOKE.length}`);
}
if (JOKE.trim().length === 0) {
  throw new Error("Joke must not be only whitespace");
}

// A one-liner is one line: no line breaks anywhere in the text.
if (/[\r\n]/.test(JOKE)) {
  throw new Error("Joke must be a single line with no line breaks");
}

// The joke's turn has to land in the last few words: the punchline is the
// quoted verdict on the ending, so guard it against silent drift — the
// line must close on that exact quote.
if (!JOKE.endsWith("'rushed'.")) {
  throw new Error("Joke must end on the quoted punchline: 'rushed'.");
}

// The setup is the premise itself: the AI already wrote the eulogy.
// Guard the opening so the premise can never drift away from the punch.
if (!JOKE.startsWith("My AI wrote my eulogy in advance.")) {
  throw new Error("Joke must open with the setup: 'My AI wrote my eulogy in advance.'");
}

// The punchline only lands as a quote: the single quotes around the
// verdict are part of the joke, not decoration.
const quotes = JOKE.match(/'/g) ?? [];
if (quotes.length !== 2) {
  throw new Error(`Joke must carry exactly two single quotes, got ${quotes.length}`);
}

// The joke is two sentences and nothing more: the setup, then the turn.
// A third sentence would dilute the punch, so count the sentence ends.
const sentences = JOKE.split(".").filter((part) => part.trim().length > 0);
if (sentences.length !== 2) {
  throw new Error(`Joke must be exactly two sentences, got ${sentences.length}`);
}

// The turn is the AI's review, so the three-star rating must join the
// setup to the punchline — without it the second sentence has no sting.
if (!JOKE.includes("three stars")) {
  throw new Error("Joke is missing its turn: the AI must give 'three stars'");
}

// The revised joke is exactly 88 characters. Pin the length so no edit
// can quietly stretch or shrink it past the draft the scout verified.
// Verified by hand and by runtime: 33 chars setup + 55 chars turn = 88.
if (JOKE.length !== 88) {
  throw new Error(`Joke must be exactly 88 characters, got ${JOKE.length}`);
}

mkdirSync(dirname(OUT_PATH), { recursive: true });
writeFileSync(OUT_PATH, JOKE, "utf8");

// Read back what was written and confirm it is byte-identical to the
// joke, so a partial write or encoding slip can never reach the judge.
const written = readFileSync(OUT_PATH, "utf8");
if (written !== JOKE) {
  throw new Error("Verification failed: /output/entry.txt differs from the joke");
}
console.log(`Wrote ${JOKE.length} characters to ${OUT_PATH}`);
