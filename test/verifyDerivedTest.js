/* global describe, it */
import { assert } from 'chai'
/* Test the verifyDerived against test vectors in valid and invalid cases.
*/

import { readFile } from 'fs/promises'
import { localLoader } from './documentLoader.js'
import { verifyDerived } from '../lib/verifyDerived.js'
import { base58btc } from 'multiformats/bases/base58'

// Read input doc, keys, mandatory pointers from files
const signedDerived = JSON.parse(await readFile(new URL('./specTestVectors/derivedRevealDocument.json',
  import.meta.url)))
const keyMaterial = JSON.parse(await readFile(new URL('./specTestVectors/SDKeyMaterial.json',
  import.meta.url)))
const pubKey = base58btc.decode(keyMaterial.baseKeyPair.publicKeyMultibase).slice(2)

describe('verifyDerived', async function () {
  it('valid derived document', async function () {
    const result = await verifyDerived(signedDerived, pubKey, { documentLoader: localLoader })
    assert.isTrue(result)
  })
  it('invalid derived document changed sail number', async function () {
    const oldSailNo = signedDerived.credentialSubject.sailNumber
    signedDerived.credentialSubject.sailNumber = 'CA101'
    const result = await verifyDerived(signedDerived, pubKey, { documentLoader: localLoader })
    assert.isFalse(result)
    signedDerived.credentialSubject.sailNumber = oldSailNo
  })
})
