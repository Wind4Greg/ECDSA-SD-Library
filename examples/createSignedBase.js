
import { mkdir, readFile, writeFile } from 'fs/promises'
import { localLoader } from './documentLoader.js'
import { base58btc } from 'multiformats/bases/base58'
import { signBase } from '../lib/signBase.js'
import { hexToBytes } from '@noble/hashes/utils'

// Read input document from a file
const document = JSON.parse(
  await readFile(new URL('./input/windDoc.json', import.meta.url)))
const mandatoryPointers = JSON.parse(
  await readFile(new URL('./input/windMandatory.json', import.meta.url)))
// Obtain key material and process into byte array format
const keyMaterial = JSON.parse(
  await readFile(new URL('./input/SDKeyMaterial.json', import.meta.url)))
// Sample long term issuer signing key
const keyPair = {}
keyPair.priv = base58btc.decode(keyMaterial.privateKeyMultibase).slice(2)
keyPair.pub = base58btc.decode(keyMaterial.publicKeyMultibase).slice(2)
// HMAC/PRF key material -- Shared between issuer and holder
const hmacKeyString = keyMaterial.hmacKeyString
const hmacKey = hexToBytes(hmacKeyString)
// proof specific key material. Used only for one proof, secret key is not kept
const proofKeyPair = {}
proofKeyPair.priv = base58btc.decode(keyMaterial.proofPrivateKeyMultibase).slice(2)
proofKeyPair.pub = base58btc.decode(keyMaterial.proofPublicKeyMultibase).slice(2)
const options = {
  hmacKey,
  proofKeyPair,
  documentLoader: localLoader
}


const proofConfig = {}
proofConfig.type = 'DataIntegrityProof'
proofConfig.cryptosuite = 'ecdsa-sd-2023'
proofConfig.created = '2023-08-15T23:36:38Z'
proofConfig.verificationMethod = 'did:key:' + keyMaterial.publicKeyMultibase + '#' + keyMaterial.publicKeyMultibase
proofConfig.proofPurpose = 'assertionMethod'
proofConfig['@context'] = document['@context']
console.log(document)
options.proofConfig = proofConfig
const signedDoc = await signBase(document, keyPair, mandatoryPointers, options)

console.log(signedDoc)
// Create output directory if you want
const baseDir = './output/'
const status = await mkdir(baseDir, { recursive: true })
writeFile(baseDir + 'signedBase.json', JSON.stringify(signedDoc, null, 2))
