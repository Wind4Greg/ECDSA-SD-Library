// context for "https://www.w3.org/ns/credentials/v2"

export const vcv2 = {
  '@context': {
    '@protected': true,
    '@vocab': 'https://www.w3.org/ns/credentials/issuer-dependent#',

    id: '@id',
    type: '@type',

    VerifiableCredential: {
      '@id': 'https://www.w3.org/2018/credentials#VerifiableCredential',
      '@context': {
        '@protected': true,

        id: '@id',
        type: '@type',

        credentialSchema: {
          '@id': 'https://www.w3.org/2018/credentials#credentialSchema',
          '@type': '@id'
        },
        credentialStatus: {
          '@id': 'https://www.w3.org/2018/credentials#credentialStatus',
          '@type': '@id'
        },
        credentialSubject: {
          '@id': 'https://www.w3.org/2018/credentials#credentialSubject',
          '@type': '@id'
        },
        description: {
          '@id': 'https://schema.org/description',
          '@type': 'http://www.w3.org/2001/XMLSchema#string'
        },
        evidence: {
          '@id': 'https://www.w3.org/2018/credentials#evidence',
          '@type': '@id'
        },
        holder: {
          '@id': 'https://www.w3.org/2018/credentials#holder',
          '@type': '@id'
        },
        validFrom: {
          '@id': 'https://www.w3.org/2018/credentials#validFrom',
          '@type': 'http://www.w3.org/2001/XMLSchema#dateTime'
        },
        validUntil: {
          '@id': 'https://www.w3.org/2018/credentials#validUntil',
          '@type': 'http://www.w3.org/2001/XMLSchema#dateTime'
        },
        issuer: {
          '@id': 'https://www.w3.org/2018/credentials#issuer',
          '@type': '@id'
        },
        name: {
          '@id': 'https://schema.org/name',
          '@type': 'http://www.w3.org/2001/XMLSchema#string'
        },
        proof: {
          '@id': 'https://w3id.org/security#proof',
          '@type': '@id',
          '@container': '@graph'
        },
        refreshService: {
          '@id': 'https://www.w3.org/2018/credentials#refreshService',
          '@type': '@id'
        },
        termsOfUse: {
          '@id': 'https://www.w3.org/2018/credentials#termsOfUse',
          '@type': '@id'
        }
      }
    },

    VerifiablePresentation: {
      '@id': 'https://www.w3.org/2018/credentials#VerifiablePresentation',
      '@context': {
        '@protected': true,

        id: '@id',
        type: '@type',
        holder: {
          '@id': 'https://www.w3.org/2018/credentials#holder',
          '@type': '@id'
        },
        proof: {
          '@id': 'https://w3id.org/security#proof',
          '@type': '@id',
          '@container': '@graph'
        },
        verifiableCredential: {
          '@id': 'https://www.w3.org/2018/credentials#verifiableCredential',
          '@type': '@id',
          '@container': '@graph'
        },
        termsOfUse: {
          '@id': 'https://www.w3.org/2018/credentials#termsOfUse',
          '@type': '@id'
        }
      }
    },

    DataIntegrityProof: {
      '@id': 'https://w3id.org/security#DataIntegrityProof',
      '@context': {
        '@protected': true,
        id: '@id',
        type: '@type',
        challenge: 'https://w3id.org/security#challenge',
        created: {
          '@id': 'http://purl.org/dc/terms/created',
          '@type': 'http://www.w3.org/2001/XMLSchema#dateTime'
        },
        domain: 'https://w3id.org/security#domain',
        expires: {
          '@id': 'https://w3id.org/security#expiration',
          '@type': 'http://www.w3.org/2001/XMLSchema#dateTime'
        },
        nonce: 'https://w3id.org/security#nonce',
        proofPurpose: {
          '@id': 'https://w3id.org/security#proofPurpose',
          '@type': '@vocab',
          '@context': {
            '@protected': true,
            id: '@id',
            type: '@type',
            assertionMethod: {
              '@id': 'https://w3id.org/security#assertionMethod',
              '@type': '@id',
              '@container': '@set'
            },
            authentication: {
              '@id': 'https://w3id.org/security#authenticationMethod',
              '@type': '@id',
              '@container': '@set'
            },
            capabilityInvocation: {
              '@id': 'https://w3id.org/security#capabilityInvocationMethod',
              '@type': '@id',
              '@container': '@set'
            },
            capabilityDelegation: {
              '@id': 'https://w3id.org/security#capabilityDelegationMethod',
              '@type': '@id',
              '@container': '@set'
            },
            keyAgreement: {
              '@id': 'https://w3id.org/security#keyAgreementMethod',
              '@type': '@id',
              '@container': '@set'
            }
          }
        },
        cryptosuite: 'https://w3id.org/security#cryptosuite',
        proofValue: {
          '@id': 'https://w3id.org/security#proofValue',
          '@type': 'https://w3id.org/security#multibase'
        },
        verificationMethod: {
          '@id': 'https://w3id.org/security#verificationMethod',
          '@type': '@id'
        }
      }
    }
  }
}
