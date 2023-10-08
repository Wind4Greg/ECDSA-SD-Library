# ECDSA-SD for VC Library

Sign, selectively disclose, and verify credentials/presentations with ECDSA signatures and JavaScript!

This library is an independent implementation of the `ecdsa-sd-2023` cryptosuite for verifiable credentials. The algorithms and functions are from sections 3.3-3.5 of [Data Integrity ECDSA Cryptosuites v1.0](https://w3c.github.io/vc-di-ecdsa) where they are specified and described.

## High Level API Design

* **Add Base**: unsigned document, key pair, mandatory pointers; optional: proof configuration options, hmac key, proof key pair, stuff for JSON-LD document loading. Returns signed base document.
* **Verify Base**: signed base document, public key (rather than extracting it from document or web),; optional: stuff for JSON-LD document loading. Returns true/false.
* **Derive Proof**: signed base document, selective pointers; optional: stuff for JSON-LD document loading. Returns signed derived document.
* **Verify Derived**: signed derived document, public key; optional: stuff for JSON-LD document loading. Returns true/false.

Note: For verification functions the issuers public key as a `Uint8Array` without any multibase prefixes must be furnished. This library does not perform any external requests to obtain key material for verification.

## Examples

See the `examples` directory for usage examples including JSON-LD document (context) loading. Example inputs are in the `examples/input` directory.

# Generated API from JSDoc

<!-- Generated with the command
    npx jsdoc2md lib/signBase.js lib/verifyBase.js lib/derive.js lib/verifyDerived.js > documentation/apiDoc.md
    and then copy and paste below.
-->

## Functions

<dl>
<dt><a href="#signBase">signBase(document, keyPair, mandatoryPointers, options)</a></dt>
<dd><p>sign a base document (credential) with ECDSA-SD procedures. This is done by an
issuer and permits the recipient, the holder, the freedom to selectively disclose
&quot;statements&quot; extracted from the document to a verifier within the constraints
of the mandatory disclosure requirements imposed by the issuer.</p>
</dd>
<dt><a href="#verifyBase">verifyBase(document, pubKey, options)</a></dt>
<dd><p>verify a signed selective disclosure base document (credential) with ECDSA-SD
procedures. This is done by an holder on receipt of the credential.</p>
</dd>
<dt><a href="#derive">derive(document, selectivePointers, options)</a></dt>
<dd><p>derive a selectively disclosed document (presentation) with ECDSA-SD procedures.
This is done by a holder, who has the option to selectively disclose non-mandatory
statements to a verifier.</p>
</dd>
<dt><a href="#verifyDerived">verifyDerived(document, pubKey, options)</a></dt>
<dd><p>verify a signed selective disclosure derived document (credential) with ECDSA-SD
procedures. This is done by a verifier on receipt of the credential.</p>
</dd>
</dl>

<a name="signBase"></a>

## signBase(document, keyPair, mandatoryPointers, options)
sign a base document (credential) with ECDSA-SD procedures. This is done by an
issuer and permits the recipient, the holder, the freedom to selectively disclose
"statements" extracted from the document to a verifier within the constraints
of the mandatory disclosure requirements imposed by the issuer.

**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| document | <code>Object</code> | The unsigned credential |
| keyPair | <code>Object</code> | The issuers private/public key pair |
| keyPair.priv | <code>Uint8Array</code> | Byte array for the P256 private key without multikey prefixes |
| keyPair.pub | <code>Uint8Array</code> | Byte array for the P256 public key without multikey prefixes |
| mandatoryPointers | <code>Array</code> | An array of mandatory pointers in JSON pointer format |
| options | <code>Object</code> | A variety of options to control signing and processing |
| options.proofConfig | <code>Object</code> | proof configuration options without `@context`  field. Optional. This will be generated with current date information and  did:key verification method otherwise. |
| options.hmacKey | <code>Uint8Array</code> | A byte array for the HMAC key. Optional. A   cryptographically secure random value will be generated if not specified. |
| options.proofKeyPair | <code>Object</code> | A proof specific P256 key pair. Must   be unique for each call to signBase. Optional. A unique key pair will be   generated if not specified. |
| options.documentLoader | <code>function</code> | A JSON-LD document loader to be   passed on to JSON-LD processing functions. Optional. |

<a name="verifyBase"></a>

## verifyBase(document, pubKey, options)
verify a signed selective disclosure base document (credential) with ECDSA-SD
procedures. This is done by an holder on receipt of the credential.

**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| document | <code>Object</code> | The signed SD base credential |
| pubKey | <code>Uint8Array</code> | Byte array for the issuers P256 public key without multikey prefixes |
| options | <code>Object</code> | A variety of options to control signing and processing |
| options.documentLoader | <code>function</code> | A JSON-LD document loader to be   passed on to JSON-LD processing functions. Optional. |

<a name="derive"></a>

## derive(document, selectivePointers, options)
derive a selectively disclosed document (presentation) with ECDSA-SD procedures.
This is done by a holder, who has the option to selectively disclose non-mandatory
statements to a verifier.

**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| document | <code>Object</code> | The signed base credential |
| selectivePointers | <code>Array</code> | An array of selective pointers in JSON pointer format |
| options | <code>Object</code> | A variety of options to control signing and processing |
| options.documentLoader | <code>function</code> | A JSON-LD document loader to be   passed on to JSON-LD processing functions. Optional. |

<a name="verifyDerived"></a>

## verifyDerived(document, pubKey, options)
verify a signed selective disclosure derived document (credential) with ECDSA-SD
procedures. This is done by a verifier on receipt of the credential.

**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| document | <code>Object</code> | The signed SD derived credential |
| pubKey | <code>Uint8Array</code> | Byte array for the issuers P256 public key without multikey prefixes |
| options | <code>Object</code> | A variety of options to control signing and processing |
| options.documentLoader | <code>function</code> | A JSON-LD document loader to be   passed on to JSON-LD processing functions. Optional. |

# Primitives Documentation from JSDoc

<!-- Generated with the command
    npx jsdoc2md lib/primitives.js  > documentation/primitivesDoc.md
    and then copy and paste here.
-->

## Functions

<dl>
<dt><a href="#skolemizeExpandedJsonLd">skolemizeExpandedJsonLd(expanded, options)</a></dt>
<dd><p>Replaces all blank node identifiers in an expanded JSON-LD document with custom-scheme
URNs. Nodes without and id or blank node identifier will be assigned one.</p>
</dd>
<dt><a href="#createInitialSelection">createInitialSelection(source)</a></dt>
<dd><p>Helper function for selectJsonLd</p>
</dd>
<dt><a href="#jsonPointerToPaths">jsonPointerToPaths(pointer)</a> ⇒ <code>Array</code></dt>
<dd><p>Helper function for selectionJsonLd.  Converts a JSON Pointer into an array
of paths in a JSON tree.</p>
</dd>
<dt><a href="#selectPaths">selectPaths(paths, document, selectionDocument, arrays)</a></dt>
<dd><p>Selects a portion of a compact JSON-LD document using paths parsed from a parsed JSON
Pointer. This is a helper function used within the algorithm selectJsonLd.</p>
</dd>
<dt><a href="#selectJsonLd">selectJsonLd(document, pointers)</a> ⇒</dt>
<dd><p>The following algorithm selects a portion of a compact JSON-LD document using an array
of JSON Pointers. The required inputs are an array of JSON Pointers (pointers) and a
compact JSON-LD document (document). The document is assumed to use a JSON-LD context
that aliases &#39;@id&#39; and &#39;@type&#39; to id and type, respectively, and to use only one &#39;@context&#39;
property at the top level of the document.</p>
</dd>
<dt><a href="#createHmacIdLabelMapFunction">createHmacIdLabelMapFunction(hmacFunc)</a> ⇒</dt>
<dd><p>The following algorithm creates a label map factory function that uses an HMAC to replace
canonical blank node identifiers with their encoded HMAC digests. The required input is an
HMAC (previously initialized with a secret key), HMAC. A function, labelMapFactoryFunction,
is produced as output.</p>
</dd>
<dt><a href="#selectCanonicalNQuads">selectCanonicalNQuads(pointers, skolemizedCompactDocument, labelMap, options)</a> ⇒</dt>
<dd><p>The following algorithm selects a portion of a skolemized compact JSON-LD document
using an array of JSON Pointers, and outputs the resulting canonical N-Quads with any
blank node labels replaced using the given label map</p>
</dd>
<dt><a href="#canonicalizeAndGroup">canonicalizeAndGroup(document, labelMapFactoryFunction, groupDefinitions, options)</a> ⇒</dt>
<dd><p>The following algorithm is used to output canonical N-Quad strings that match custom
selections of a compact JSON-LD document. It does this by canonicalizing a compact
JSON-LD document (replacing any blank node identifiers using a label map) and grouping
the resulting canonical N-Quad strings according to the selection associated with each
group. Each group will be defined using an assigned name and array of JSON pointers.
The JSON pointers will be used to select portions of the skolemized document, such
that the output can be converted to canonical N-Quads to perform group matching.</p>
</dd>
<dt><a href="#createLabelMapFunction">createLabelMapFunction(labelMap)</a> ⇒</dt>
<dd><p>The following algorithm creates a label map factory function that uses an input label map
to replace canonical blank node identifiers with another value.</p>
</dd>
<dt><a href="#labelReplacementCanonicalizeJsonLd">labelReplacementCanonicalizeJsonLd(document, labelMapFactoryFunction, options)</a> ⇒</dt>
<dd><p>The following algorithm canonicalizes a JSON-LD document and replaces any blank node
identifiers in the canonicalized result using a label map factory function,
labelMapFactoryFunction.</p>
</dd>
</dl>

<a name="skolemizeExpandedJsonLd"></a>

## skolemizeExpandedJsonLd(expanded, options)
Replaces all blank node identifiers in an expanded JSON-LD document with custom-scheme
URNs. Nodes without and id or blank node identifier will be assigned one.

**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| expanded | <code>Array</code> | an expanded JSON-LD array/object |
| options | <code>Object</code> | options to control the blank node labels assigned |
| options.bnPrefix | <code>Object</code> | a custom blank node prefix |
| options.randString | <code>Object</code> | a UUID string or other comparably random string |
| options.count | <code>Object</code> | blank node id counter |

<a name="createInitialSelection"></a>

## createInitialSelection(source)
Helper function for selectJsonLd

**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| source | <code>Object</code> | a JSON-LD object |

<a name="jsonPointerToPaths"></a>

## jsonPointerToPaths(pointer) ⇒ <code>Array</code>
Helper function for selectionJsonLd.  Converts a JSON Pointer into an array
of paths in a JSON tree.

**Kind**: global function
**Returns**: <code>Array</code> - paths

| Param | Type | Description |
| --- | --- | --- |
| pointer | <code>String</code> | a JSON pointer string per RFC6901 |

<a name="selectPaths"></a>

## selectPaths(paths, document, selectionDocument, arrays)
Selects a portion of a compact JSON-LD document using paths parsed from a parsed JSON
Pointer. This is a helper function used within the algorithm selectJsonLd.

**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| paths | <code>Array</code> | array of paths parsed from a JSON pointer |
| document | <code>Object</code> | a compact JSON-LD document |
| selectionDocument | <code>Object</code> | a selection document to be populated |
| arrays | <code>Array</code> | an array of arrays for tracking selected arrays |

<a name="selectJsonLd"></a>

## selectJsonLd(document, pointers) ⇒
The following algorithm selects a portion of a compact JSON-LD document using an array
of JSON Pointers. The required inputs are an array of JSON Pointers (pointers) and a
compact JSON-LD document (document). The document is assumed to use a JSON-LD context
that aliases '@id' and '@type' to id and type, respectively, and to use only one '@context'
property at the top level of the document.

**Kind**: global function
**Returns**: A new JSON-LD document that represents a selection (selectionDocument) of the
original JSON-LD document is produced as output.

| Param | Type |
| --- | --- |
| document | <code>Object</code> |
| pointers | <code>Array</code> |

<a name="createHmacIdLabelMapFunction"></a>

## createHmacIdLabelMapFunction(hmacFunc) ⇒
The following algorithm creates a label map factory function that uses an HMAC to replace
canonical blank node identifiers with their encoded HMAC digests. The required input is an
HMAC (previously initialized with a secret key), HMAC. A function, labelMapFactoryFunction,
is produced as output.

**Kind**: global function
**Returns**: a labelMapFactoryFunction

| Param | Type | Description |
| --- | --- | --- |
| hmacFunc | <code>function</code> | an initialized (with key) function to compute HMACs |

<a name="selectCanonicalNQuads"></a>

## selectCanonicalNQuads(pointers, skolemizedCompactDocument, labelMap, options) ⇒
The following algorithm selects a portion of a skolemized compact JSON-LD document
using an array of JSON Pointers, and outputs the resulting canonical N-Quads with any
blank node labels replaced using the given label map

**Kind**: global function
**Returns**: An object containing the new JSON-LD document that represents a selection of
the original JSON-LD document (selectionDocument), an array of deskolemized N-Quad strings
(deskolemizedNQuads), and an array of canonical N-Quads with replacement blank node
labels (nquads).

| Param | Type | Description |
| --- | --- | --- |
| pointers | <code>Array</code> | an array of JSON Pointers |
| skolemizedCompactDocument | <code>Object</code> | a skolemized compact JSON-LD document |
| labelMap | <code>Map</code> | a blank node label map |
| options | <code>\*</code> |  |
| options.documentLoader | <code>function</code> | A JSON-LD document loader to be   passed on to JSON-LD processing functions. Optional. |

<a name="canonicalizeAndGroup"></a>

## canonicalizeAndGroup(document, labelMapFactoryFunction, groupDefinitions, options) ⇒
The following algorithm is used to output canonical N-Quad strings that match custom
selections of a compact JSON-LD document. It does this by canonicalizing a compact
JSON-LD document (replacing any blank node identifiers using a label map) and grouping
the resulting canonical N-Quad strings according to the selection associated with each
group. Each group will be defined using an assigned name and array of JSON pointers.
The JSON pointers will be used to select portions of the skolemized document, such
that the output can be converted to canonical N-Quads to perform group matching.

**Kind**: global function
**Returns**: An object containing the created groups (groups), the skolemized compact
JSON-LD document (skolemizedCompactDocument), the skolemized expanded JSON-LD document
(skolemizedExpandedDocument), the deskolemized N-Quad strings (deskolemizedNQuads),
the blank node label map (labelMap), and the canonical N-Quad strings nquads.

| Param | Type | Description |
| --- | --- | --- |
| document | <code>Object</code> | a compact JSON-LD document. The document is assumed to use a JSON-LD context that aliases "@id" and "@type" to id and type, respectively, and to use only one "@context" property at the top level of the document. |
| labelMapFactoryFunction | <code>function</code> | a function that maps blank node ids to a "urn:" scheme |
| groupDefinitions | <code>Object</code> | a map of group names to corresponding arrays of JSON pointers |
| options | <code>Object</code> |  |
| options.documentLoader | <code>function</code> | A JSON-LD document loader to be   passed on to JSON-LD processing functions. Optional. |

<a name="createLabelMapFunction"></a>

## createLabelMapFunction(labelMap) ⇒
The following algorithm creates a label map factory function that uses an input label map
to replace canonical blank node identifiers with another value.

**Kind**: global function
**Returns**: A function, labelMapFactoryFunction

| Param | Type |
| --- | --- |
| labelMap | <code>Map</code> |

<a name="labelReplacementCanonicalizeJsonLd"></a>

## labelReplacementCanonicalizeJsonLd(document, labelMapFactoryFunction, options) ⇒
The following algorithm canonicalizes a JSON-LD document and replaces any blank node
identifiers in the canonicalized result using a label map factory function,
labelMapFactoryFunction.

**Kind**: global function
**Returns**: An N-Quads representation of the canonicalNQuads as an array of N-Quad strings,
with the replaced blank node labels, and a map from the old blank node IDs to the new blank
node IDs, labelMap.

| Param | Type | Description |
| --- | --- | --- |
| document | <code>Object</code> | a JSON-LD document |
| labelMapFactoryFunction | <code>function</code> | a label map factory function |
| options | <code>Object</code> |  |
| options.documentLoader | <code>function</code> | A JSON-LD document loader to be   passed on to JSON-LD processing functions. Optional. |


