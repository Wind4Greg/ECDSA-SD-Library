/**
 * Primitives to enable selective disclosure processing of JSON-LD
 * based verifiable credentials. Algorithms from the draft W3C specification. See
 * https://w3c.github.io/vc-di-ecdsa/ for more descriptions and context.
 */

import { klona } from 'klona'
import { v4 as uuidv4 } from 'uuid'

/**
 * Replaces all blank node identifiers in an expanded JSON-LD document with custom-scheme
 * URNs. Nodes without and id or blank node identifier will be assigned one.
 * @param {Array} expanded - an expanded JSON-LD array/object
 * @param {Object} options - options to control the blank node labels assigned
 * @param {Object} options.bnPrefix - a custom blank node prefix
 * @param {Object} options.randString - a UUID string or other comparably random string
 * @param {Object} options.count - blank node id counter
 */
export function skolemizeExpandedJsonLd (expanded, options) {
  // Set up options
  if (options.bnPrefix === undefined) {
    options.bnPrefix = 'urn:bnid:'
  }
  if (options.randString === undefined) {
    options.randString = uuidv4()
  }
  if (options.count === uuidv4) {
    options.count = 0
  }
  const skolemizedExpandedDocument = []
  expanded.forEach(element => {
    // If either element is not an object or it contains the key @value, append a copy of element
    // to skolemizedExpandedDocument and continue to the next element.
    if (typeof element !== 'object' || element['@value'] !== undefined) {
      skolemizedExpandedDocument.push(klona(element))
    } else {
    // Otherwise, initialize skolemizedNode to an object, and for each property and
    // value in element:
    //   If value is an array, set the value of property in skolemizedNode to the
    //   result of calling this algorithm recursively passing value for expanded and
    //   keeping the other parameters the same.
    //   Otherwise, set the value of property in skolemizedNode to the first element
    //   in the array result of calling this algorithm recursively passing an array with
    //   value as its only element for expanded and keeping the other parameters the same.
      const skolemizedNode = {}
      for (const prop in element) {
        const value = element[prop]
        if (Array.isArray(value)) {
          skolemizedNode[prop] = skolemizeExpandedJsonLd(value, options)
        } else {
          skolemizedNode[prop] = skolemizeExpandedJsonLd([value], options)[0]
        }
      }
      // If skolemizedNode has no @id property, set the value of the @id property in skolemizedNode
      // to the concatenation of bnPrefix, "_", random, "_" and the value of count, incrementing
      // the value of count afterwards.
      if (skolemizedNode['@id'] === undefined) {
        skolemizedNode['@id'] = options.prefix + '_' + options.randString + '_' + options.count
        options.count++
      } else {
        // Otherwise, if the value of the @id property in skolemizedNode starts with "_:",
        // preserve the existing blank node identifier when skolemizing by setting the value
        // of the @id property in skolemizedNode to the concatenation of bnPrefix,
        // and the existing value of the @id property.
        skolemizedNode['@id'] = options.bnPrefix + '_' + skolemizedNode['@id']
      }
      // Append skolemizedNode to skolemizedExpandedDocument.
      skolemizedExpandedDocument.push(skolemizedNode)
    }
  })
  return skolemizedExpandedDocument
}

/**
 * Helper function for selectJsonLd
 * @param {Object} source - a JSON-LD object
 */
function createInitialSelection (source) {
  const selection = {}
  if (source.id && !source.id.startsWith('_:')) {
    selection.id = source.id
  }
  if (source.type !== undefined) {
    selection.type = source.type
  }
  return selection
}

/**
 * Helper function for selectionJsonLd.  Converts a JSON Pointer into an array
 * of paths in a JSON tree.
 * @param {String} pointer - a JSON pointer string per RFC6901
 * @returns {Array} paths
 */
export function jsonPointerToPaths (pointer) { // Exported for testing
  const validEscapes = ['~0', '~1']
  const paths = []
  const splitPath = pointer.split('/').slice(1)
  splitPath.forEach(path => {
    if (!path.includes('~')) {
      const num = parseInt(path) // check for integer
      if (isNaN(num)) {
        paths.push(path)
      } else {
        paths.push(num)
      }
    } else {
      // valid escape check
      const escapes = path.match(/~./g) // should produce array with '~0' and '~1' only otherwise error
      escapes.forEach(seq => {
        if (!validEscapes.includes(seq)) {
          throw new Error(`Invalid JSON Pointer escape sequence: ${seq}`)
        }
      })
      let unescaped = path
      if (unescaped.includes('~0')) { // '~0' unescapes to '~'
        unescaped = unescaped.replace(/~0/g, '~')
      }
      if (unescaped.includes('~1')) { // '~1' unescapes to '/'
        unescaped = unescaped.replace(/~1/g, '/')
      }
      paths.push(unescaped)
    }
  })
  return paths
}

/**
 * Selects a portion of a compact JSON-LD document using paths parsed from a parsed JSON
 * Pointer. This is a helper function used within the algorithm selectJsonLd.
 * @param {Array} paths - array of paths parsed from a JSON pointer
 * @param {Object} document - a compact JSON-LD document
 * @param {Object} selectionDocument - a selection document to be populated
 * @param {Array} arrays - an array of arrays for tracking selected arrays
 */
function selectPaths (paths, document, selectionDocument, arrays) {
  // 1. Initialize parentValue to document.
  let parentValue = document
  // 2. Initialize value to parentValue.
  let value = parentValue
  // 3. Initialize selectedParent to selectionDocument.
  let selectedParent = selectionDocument
  // 4. Initialize selectedValue to selectedParent.
  let selectedValue = selectedParent
  // 5. For each path in paths:
  for (const path of paths) {
    // 1. Set selectedParent to selectedValue.
    selectedParent = selectedValue
    // 2. Set parentValue to value.
    parentValue = value
    // 3. Set value to parentValue[path]. If value is now undefined, throw an error indicating
    //    that the JSON pointer does not match the given document.
    value = parentValue[path]
    if (value === undefined) {
      throw new Error('JSON pointer does not match the given document')
    }
    // 4. Set selectedValue to selectedParent[path].
    selectedValue = selectedParent[path]
    // 5. If selectedValue is now undefined:
    if (selectedValue === undefined) {
      // 1. If value is an array, set selectedValue to an empty array and append
      //    selectedValue to arrays.
      if (Array.isArray(value)) {
        selectedValue = []
        arrays.push(selectedValue)
      } else {
      // 2. Otherwise, set selectedValue to an initial selection passing value as
      // source to the algorithm in createInitialSelection.
        selectedValue = createInitialSelection(value)
      }
      // 3. Set selectedParent[path] to selectedValue.
      selectedParent[path] = selectedValue
    }
  }
  // 6. Note: With path traversal complete at the target value, the selected value will now be computed.
  // 7. If value is a literal, set selectedValue to value.
  if (typeof value !== 'object') { // literal
    selectedValue = value
  } else {
    // 8. If value is an array, Set selectedValue to a copy of value.
    if (Array.isArray(value)) {
      selectedValue = klona(value)
    } else {
    // 9. In all other cases, set selectedValue to an object that merges a shallow copy
    //  of selectedValue with a deep copy of value, e.g., {...selectedValue, …deepCopy(value)}.
      selectedValue = { ...selectedValue, ...klona(value) }
    }
  }
  // 10. Get the last path, lastPath, from paths.
  const lastPath = paths.at(-1)
  // 11. Set selectedParent[lastPath] to selectedValue.
  selectedParent[lastPath] = selectedValue
}

/**
 * The following algorithm selects a portion of a compact JSON-LD document using an array
 * of JSON Pointers. The required inputs are an array of JSON Pointers (pointers) and a
 * compact JSON-LD document (document). The document is assumed to use a JSON-LD context
 * that aliases '@id' and '@type' to id and type, respectively, and to use only one '@context'
 * property at the top level of the document.
 * @param {Object} document
 * @param {Array} pointers
 * @returns A new JSON-LD document that represents a selection (selectionDocument) of the
 * original JSON-LD document is produced as output.
 */
export function selectJsonLd (document, pointers) {
  if (pointers.length === 0) { // Nothing selected
    return null
  }
  const arrays = []
  const selectionDocument = createInitialSelection(document)
  selectionDocument['@context'] = klona(document['@context'])
  pointers.forEach(pointer => {
    const paths = jsonPointerToPaths(pointer)
    // Use the algorithm selectPaths, passing document, paths, selectionDocument, and arrays.
    selectPaths(paths, document, selectionDocument, arrays)
  })
  // For each array in arrays: Make array dense by removing any undefined elements
  // between elements that are defined.
  for (const array of arrays) {
    let i = 0
    while (i < array.length) {
      if (array[i] === undefined) {
        array.splice(i, 1) // Removes 1 element at position i
        continue // Don't increment i yet, array length has changed
      }
      i++
    }
  }
  return selectionDocument
}
