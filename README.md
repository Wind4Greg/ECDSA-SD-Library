# ECDSA-SD for VC Library

Sign, selectively disclose, and verify verifiable credentials/presentations with ECDSA signatures and JavaScript!

This library will become an independent implementation of the ECDSA-SD-2023 cryptosuite for verifiable credentials. Initially it will use some of the selective disclosure primitives from `@digitalbazaar/di-sd-primitives` while the library is being incrementally developed.

## High Level API Design

* **Add Base**: unsigned document, key pair, mandatory pointers; optional: proof configuration options, hmac key, proof key pair, stuff for JSON-LD document loading. Returns signed base document.
* **Verify Base**: signed base document, public key (rather than extracting it from document or web),; optional: stuff for JSON-LD document loading. Returns true/false.
* **Derive Proof**: signed base document, selective pointers; optional: stuff for JSON-LD document loading. Returns signed derived document.
* **Verify Derived**: signed derived document, public key; optional: stuff for JSON-LD document loading. Returns true/false.

Note: For verification functions the issuers public key as a `Uint8Array` without any multibase prefixes must be furnished. This library does not perform any external requests to obtain key material for verification.

## Examples

See the `examples` directory for usage examples including JSON-LD document (context) loading. Example inputs are in the `examples/input` directory.
