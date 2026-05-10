import { readdir, stat, rename } from 'node:fs/promises'
import { join, extname, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..', 'public')
const EXTS = new Set(['.png', '.jpg', '.jpeg'])
const QUALITY = 80
const MAX_WIDTH = 1600

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) yield* walk(full)
    else yield full
  }
}

function fmt(bytes) {
  return (bytes / 1024).toFixed(1) + ' KB'
}

async function optimize(file) {
  const ext = extname(file).toLowerCase()
  if (!EXTS.has(ext)) return null

  const original = await stat(file)
  const out = file.replace(/\.(png|jpe?g)$/i, '.webp')

  const meta = await sharp(file).metadata()
  const pipeline = sharp(file)
  if (meta.width && meta.width > MAX_WIDTH) {
    pipeline.resize({ width: MAX_WIDTH })
  }
  await pipeline.webp({ quality: QUALITY }).toFile(out + '.tmp')
  await rename(out + '.tmp', out)

  const after = await stat(out)
  return {
    file,
    out,
    before: original.size,
    after: after.size,
    saved: original.size - after.size,
  }
}

const results = []
for await (const file of walk(ROOT)) {
  const r = await optimize(file)
  if (r) results.push(r)
}

if (!results.length) {
  console.log('Nenhuma imagem encontrada em public/')
  process.exit(0)
}

console.log('\nResultado:')
let totalBefore = 0
let totalAfter = 0
for (const r of results) {
  totalBefore += r.before
  totalAfter += r.after
  const pct = ((1 - r.after / r.before) * 100).toFixed(1)
  console.log(`  ${r.file.replace(ROOT, '')}: ${fmt(r.before)} -> ${fmt(r.after)} (-${pct}%)`)
}
const totalPct = ((1 - totalAfter / totalBefore) * 100).toFixed(1)
console.log(`\nTotal: ${fmt(totalBefore)} -> ${fmt(totalAfter)} (-${totalPct}%)`)
console.log('\nArquivos .webp gerados ao lado dos originais. Atualize as referencias no codigo e remova os PNG/JPG antigos.')
