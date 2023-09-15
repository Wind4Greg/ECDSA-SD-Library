import { readFile } from 'fs/promises'
import { localLoader } from './documentLoader.js'
import { base58btc } from 'multiformats/bases/base58'
import { verifyBase } from '../lib/verifyBase.js'

// Read input document from a file
const document = JSON.parse(
  await readFile(new URL('./output/signedBase.json', import.meta.url)))
// Obtain key material and process into byte array format
const keyMaterial = JSON.parse(
  await readFile(new URL('./input/SDKeyMaterial.json', import.meta.url)))
// Sample long term issuer signing key
const pubKey = base58btc.decode(keyMaterial.publicKeyMultibase).slice(2)

const options = { documentLoader: localLoader }

const verified = await verifyBase(document, pubKey, options)
console.log(`Signed base document verified: ${verified}`)
