/* global describe, it */
import { assert } from 'chai'
/* Test derive (derived document creation) against test vector. Note that CBOR
  encoding is not unique so we need to CBOR parse the proof values and compare them.
*/

import { readFile } from 'fs/promises'
import { localLoader } from './documentLoader.js'
import { derive } from '../lib/derive.js'
import { base58btc } from 'multiformats/bases/base58'
import { hexToBytes } from '@noble/hashes/utils'
import { base64url } from 'multiformats/bases/base64'
import cbor from 'cbor'

// Read signed base doc and selective pointers from files
const selective = JSON.parse(await readFile(new URL('./specTestVectors/windSelective.json',
  import.meta.url)))
const signedBase = JSON.parse(await readFile(new URL('./specTestVectors/addSignedSDBase.json',
  import.meta.url)))
// Get output test vector
const derivedVector = JSON.parse(await readFile(new URL('./specTestVectors/derivedRevealDocument.json',
  import.meta.url)))

const options = { documentLoader: localLoader }
const derivedDoc = await derive(signedBase, selective, options)
// console.log(signedDoc)

function parseDerivedProofValue (proofValue) {
  const decodedProofValue = base64url.decode(proofValue)
  // check header bytes are: 0xd9, 0x5d, and 0x01
  if (decodedProofValue[0] !== 0xd9 || decodedProofValue[1] !== 0x5d || decodedProofValue[2] !== 0x01) {
    throw new Error('Invalid proofValue header')
  }
  const decodeThing = cbor.decode(decodedProofValue.slice(3))
  if (decodeThing.length !== 5) {
    throw new Error('Bad length of CBOR decoded proofValue data')
  }
  return decodeThing
}
// console.log('Created Derived Proof parsed:')
// console.log(parseDerivedProofValue(derivedDoc.proof.proofValue))
// console.log('Test vector Proof parsed:')
// console.log(parseDerivedProofValue(derivedVector.proof.proofValue))
describe('derive (from signed base)', async function () {
  it('equivalent to test vector', async function () {
    // CBOR isn't deterministic so check parsed version
    // assert.equal(derivedDoc.proof.proofValue, derivedVector.proof.proofValue)
    assert.deepEqual(parseDerivedProofValue(derivedDoc.proof.proofValue),
      parseDerivedProofValue(derivedVector.proof.proofValue))
  })
})
