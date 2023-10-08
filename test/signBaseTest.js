/* global describe, it */
import { assert } from 'chai'
/* Test signBase against test vector. Note that CBOR encoding is not unique
  so we need to CBOR parse the proof values and compare them.
*/

import { readFile } from 'fs/promises'
import { localLoader } from './documentLoader.js'
import { signBase } from '../lib/signBase.js'
import { base58btc } from 'multiformats/bases/base58'
import { hexToBytes } from '@noble/hashes/utils'
import { base64url } from 'multiformats/bases/base64'
import cbor from 'cbor'

// Read input doc and mandatory pointers from files
const document = JSON.parse(await readFile(new URL('./specTestVectors/windDoc.json',
  import.meta.url)))
const mandatory = JSON.parse(await readFile(new URL('./specTestVectors/windMandatory.json',
  import.meta.url)))
// Get (output) Test Vector
const signedBase = JSON.parse(await readFile(new URL('./specTestVectors/addSignedSDBase.json',
  import.meta.url)))
// Get and process key material
const keyMaterial = JSON.parse(await readFile(new URL('./specTestVectors/SDKeyMaterial.json',
  import.meta.url)))
// console.log(keyMaterial)
const keyPair = {}
keyPair.priv = base58btc.decode(keyMaterial.baseKeyPair.secretKeyMultibase).slice(2)
keyPair.pub = base58btc.decode(keyMaterial.baseKeyPair.publicKeyMultibase).slice(2)
// HMAC/PRF key material -- Shared between issuer and holder
const hmacKeyString = keyMaterial.hmacKeyString
const hmacKey = hexToBytes(hmacKeyString)
// proof specific key material. Used only for one proof, secret key is not kept
const proofKeyPair = {}
proofKeyPair.priv = base58btc.decode(keyMaterial.proofKeyPair.secretKeyMultibase).slice(2)
proofKeyPair.pub = base58btc.decode(keyMaterial.proofKeyPair.publicKeyMultibase).slice(2)

const options = {
  hmacKey,
  proofKeyPair,
  documentLoader: localLoader
}

// This has to match what was used to generate the test vector
const proofConfig = {}
proofConfig.type = 'DataIntegrityProof'
proofConfig.cryptosuite = 'ecdsa-sd-2023'
proofConfig.created = signedBase.proof.created
proofConfig.verificationMethod = signedBase.proof.verificationMethod
proofConfig.proofPurpose = signedBase.proof.proofPurpose
proofConfig['@context'] = signedBase['@context']
options.proofConfig = proofConfig
const signedDoc = await signBase(document, keyPair, mandatory, options)
// console.log(signedDoc)

function parseProofValue (proofValue) {
  const proofValueBytes = base64url.decode(proofValue)
  if (proofValueBytes[0] !== 0xd9 || proofValueBytes[1] !== 0x5d || proofValueBytes[2] !== 0x00) {
    throw new Error('Invalid proofValue header')
  }
  const decodeThing = cbor.decode(proofValueBytes.slice(3))
  if (decodeThing.length !== 5) {
    throw new Error('Bad length of CBOR decoded proofValue data')
  }
  // const [baseSignature, proofPublicKey, hmacKey, signatures, mandatoryPointers] = decodeThing
  return decodeThing
}

// console.log('Created Based Proof parsed:')
// console.log(parseProofValue(signedDoc.proof.proofValue))
// console.log('Signed Base Test vector Proof parsed:')
// console.log(parseProofValue(signedBase.proof.proofValue))

describe('signBase', async function () {
  it('equivalent to test vector', async function () {
    // CBOR isn't deterministic so check parsed version
    // assert.equal(signedDoc.proof.proofValue, signedBase.proof.proofValue)
    assert.deepEqual(parseProofValue(signedDoc.proof.proofValue),
      parseProofValue(signedBase.proof.proofValue))
  })
})
