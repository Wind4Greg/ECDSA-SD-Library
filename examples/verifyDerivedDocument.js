import { readFile } from 'fs/promises'
import { localLoader } from './documentLoader.js'
import { base58btc } from 'multiformats/bases/base58'
import { verifyDerived } from '../lib/verifyDerived.js'

// Read input document from a file
const document = JSON.parse(
  await readFile(new URL('./output/derivedDocument.json', import.meta.url)))
// Obtain key material and process into byte array format
const keyMaterial = JSON.parse(
  await readFile(new URL('./input/SDKeyMaterial.json', import.meta.url)))
// issuer signing key
const pubKey = base58btc.decode(keyMaterial.publicKeyMultibase).slice(2)

const options = { documentLoader: localLoader }

const verified = await verifyDerived(document, pubKey, options)
console.log(`Signed derived document verified: ${verified}`)
