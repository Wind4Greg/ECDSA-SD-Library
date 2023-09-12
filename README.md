# ECDSA-SD for VC Library

Selectively sign and disclose verifiable credentials with ECDSA signatures and JavaScript!

This library will become an independent implementation of the ECDSA-SD-2023 cryptosuite for verifiable credentials. Initially it will use some of the selective disclosure primitives from `@digitalbazaar/di-sd-primitives` while the library is being incrementally developed.

## High Level API Design

* **Add Base**: unsigned document, key pair, mandatory pointers; optional: proof configuration options, hmac key, proof key pair, stuff for JSON-LD document loading.
* **Verify Base**: signed base document, public key (rather than extracting it from document or web),; optional: stuff for JSON-LD document loading
* **Derive Proof**: signed base document, selective pointers; optional: stuff for JSON-LD document loading
* **Verify Derived**: signed derived document, public key; optional: stuff for JSON-LD document loading
