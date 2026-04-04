#!/usr/bin/env node

import sharp from 'sharp';

// neutral-900 = #171717 = rgb(23, 23, 23)
const BG_OFFSET = 23;
const MULTIPLIER = (255 - BG_OFFSET) / 255;

async function main() {
  console.log('Generating dark mode main image...');

  // Two-step: sharp pipelines negate+linear in wrong order when chained
  const negated = await sharp('public/assets/main.png')
    .negate({ alpha: false })
    .toBuffer();

  await sharp(negated)
    .linear(MULTIPLIER, BG_OFFSET)
    .toFile('public/assets/main.dark.png');

  console.log('Done: public/assets/main.dark.png');
}

main().catch(console.error);
