/* Development code that will later be turned into a test */

import { readFile, writeFile } from 'fs/promises'
import { localLoader } from './documentLoader.js'
import { canonicalizeAndGroup, createHmacIdLabelMapFunction, createHmac } from '../lib/primitives.js'
import { bytesToHex, concatBytes, hexToBytes } from '@noble/hashes/utils'

// For serialization of JavaScript Map via JSON
function replacerMap (key, value) { // See https://stackoverflow.com/questions/29085197/how-do-you-json-stringify-an-es6-map
  if (value instanceof Map) {
    return {
      dataType: 'Map',
      value: Array.from(value.entries()) // or with spread: value: [...value]
    }
  } else {
    return value
  }
}

// Read input document from a file
const document = JSON.parse(await readFile(new URL('./input/windDoc.json', import.meta.url)))
const keyMaterial = JSON.parse(await readFile(new URL('./input/SDKeyMaterial.json', import.meta.url)))
const mandatory = JSON.parse(await readFile(new URL('./input/windMandatory.json', import.meta.url)))
const hmacKey = hexToBytes(keyMaterial.hmacKeyString)
const labelMapFactoryFunction = createHmacIdLabelMapFunction(createHmac(hmacKey))
const groupDefinitions = { mandatory }
const groupOutput = await canonicalizeAndGroup(document, labelMapFactoryFunction,
  groupDefinitions, { documentLoader: localLoader })
// console.log(JSON.stringify(groupOutput, replacerMap, 2))
await writeFile('canonGroupOut.json', JSON.stringify(groupOutput, replacerMap, 2))

