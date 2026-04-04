#!/usr/bin/env node

import sharp from 'sharp';
import { readdir, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const CONFIG = {
  gallery: {
    input: 'public/assets/gallery',
    output: 'public/assets/gallery-optimized',
    sizes: {
      thumb: { width: 400, quality: 80 },   // 그리드용 썸네일
      full: { width: 1200, quality: 85 },   // 라이트박스용
    },
  },
};

async function ensureDir(dir) {
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
    console.log(`📁 Created: ${dir}`);
  }
}

async function optimizeImage(inputPath, outputDir, filename, sizeConfig) {
  const ext = path.extname(filename);
  const name = path.basename(filename, ext);

  const tasks = [];

  // WebP 변환 (메인)
  const webpPath = path.join(outputDir, `${name}.webp`);
  tasks.push(
    sharp(inputPath)
      .resize(sizeConfig.width, null, {
        withoutEnlargement: true,
        fit: 'inside',
      })
      .webp({ quality: sizeConfig.quality })
      .toFile(webpPath)
      .then(() => console.log(`  ✅ ${name}.webp (${sizeConfig.width}px)`))
  );

  // JPG 폴백 (구형 브라우저용)
  const jpgPath = path.join(outputDir, `${name}.jpg`);
  tasks.push(
    sharp(inputPath)
      .resize(sizeConfig.width, null, {
        withoutEnlargement: true,
        fit: 'inside',
      })
      .jpeg({ quality: sizeConfig.quality, progressive: true })
      .toFile(jpgPath)
      .then(() => console.log(`  ✅ ${name}.jpg (${sizeConfig.width}px)`))
  );

  await Promise.all(tasks);
}

async function processGallery() {
  console.log('\n🖼️  Gallery 이미지 최적화...\n');

  const { input, output, sizes } = CONFIG.gallery;

  if (!existsSync(input)) {
    console.log(`⏭️  ${input} 디렉토리 없음 — 건너뜀\n`);
    return;
  }

  // 썸네일, 풀사이즈 디렉토리 생성
  const thumbDir = path.join(output, 'thumb');
  const fullDir = path.join(output, 'full');
  await ensureDir(thumbDir);
  await ensureDir(fullDir);

  const files = await readdir(input);
  const imageFiles = files.filter(f => /\.(jpg|jpeg|png)$/i.test(f));

  console.log(`📷 ${imageFiles.length}개 이미지 발견\n`);

  for (const file of imageFiles) {
    const inputPath = path.join(input, file);
    console.log(`처리 중: ${file}`);

    await optimizeImage(inputPath, thumbDir, file, sizes.thumb);
    await optimizeImage(inputPath, fullDir, file, sizes.full);
    console.log('');
  }
}

async function main() {
  console.log('🚀 이미지 최적화 시작\n');
  console.log('=' .repeat(50));

  try {
    await processGallery();

    console.log('=' .repeat(50));
    console.log('\n✨ 완료!\n');
  } catch (error) {
    console.error('❌ 에러:', error.message);
    process.exit(1);
  }
}

main();
