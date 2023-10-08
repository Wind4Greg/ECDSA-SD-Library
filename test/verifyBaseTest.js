/* global describe, it */
import { assert } from 'chai'
/* Test the verifyBase against test vectors in valid and invalid cases.
*/

import { readFile } from 'fs/promises'
import { localLoader } from './documentLoader.js'
import { verifyBase } from '../lib/verifyBase.js'
import { base58btc } from 'multiformats/bases/base58'

// Read input doc, keys, mandatory pointers from files
const signedBase = JSON.parse(await readFile(new URL('./specTestVectors/addSignedSDBase.json',
  import.meta.url)))
const keyMaterial = JSON.parse(await readFile(new URL('./specTestVectors/SDKeyMaterial.json',
  import.meta.url)))
const pubKey = base58btc.decode(keyMaterial.baseKeyPair.publicKeyMultibase).slice(2)

describe('verifyBase', async function () {
  it('valid base document', async function () {
    const result = await verifyBase(signedBase, pubKey, { documentLoader: localLoader })
    assert.isTrue(result)
  })
  it('invalid base document changed sail number', async function () {
    const oldSailNo = signedBase.credentialSubject.sailNumber
    signedBase.credentialSubject.sailNumber = 'CA101'
    const result = await verifyBase(signedBase, pubKey, { documentLoader: localLoader })
    assert.isFalse(result)
    signedBase.credentialSubject.sailNumber = oldSailNo
  })
})
