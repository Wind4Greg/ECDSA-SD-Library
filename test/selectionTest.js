/* Development code that will later be turned into a test */

import { readFile } from 'fs/promises'
import { selectJsonLd } from '../lib/primitives.js'

// Read input document from a file
const document = JSON.parse(
  await readFile(new URL('./input/windDoc.json', import.meta.url)))
const mandatoryPointers = JSON.parse(
  await readFile(new URL('./input/windMandatory.json', import.meta.url)))
const selectivePointers = JSON.parse(
  await readFile(new URL('./input/windSelective.json', import.meta.url)))
const mandDoc = selectJsonLd(document, mandatoryPointers)
console.log(JSON.stringify(mandDoc, null, 2))
const selDoc = selectJsonLd(document, mandatoryPointers.concat(selectivePointers))
console.log(JSON.stringify(selDoc, null, 2))
