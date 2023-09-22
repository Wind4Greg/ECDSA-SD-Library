/* Development code that will later be turned into a test */

import { mkdir, readFile, writeFile } from 'fs/promises'
import { localLoader } from './documentLoader.js'
import jsonld from 'jsonld'
import { skolemizeExpandedJsonLd } from '../lib/primitives.js'
import { skolemizeExpandedJsonLd as skej2 } from '@digitalbazaar/di-sd-primitives'

// Read input document from a file
const document = JSON.parse(
  await readFile(new URL('./input/windDoc.json', import.meta.url)))
const expanded = await jsonld.expand(document, { documentLoader: localLoader })
// console.log(JSON.stringify(expanded, null, 2))
await writeFile('tempExpanded.json', JSON.stringify(expanded, null, 2))
const skolemized = skolemizeExpandedJsonLd(expanded, { prefix: 'hi:there', randString: 'bLAh', count: 0 })
// console.log(JSON.stringify(skolemized, null, 2))
await writeFile('tempSkolemized.json', JSON.stringify(skolemized, null, 2))
const labeler = { prefix: 'hi:there', random: 'bLAh', count: 0 }
const skolemized2 = await skej2({expanded, labeler})
await writeFile('tempSkej2.json', JSON.stringify(skolemized2, null, 2))
