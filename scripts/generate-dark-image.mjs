#!/usr/bin/env node

import sharp from 'sharp';

async function main() {
  console.log('Generating dark mode main image...');

  await sharp('public/assets/main.png')
    .negate({ alpha: false })
    .toFile('public/assets/main.dark.png');

  console.log('Done: public/assets/main.dark.png');
}

main().catch(console.error);
