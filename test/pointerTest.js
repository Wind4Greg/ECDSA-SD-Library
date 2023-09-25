/*
    Test various selection related functions. Development helper for now

    From RFC6901

    ""           // the whole document
    "/foo"       ["bar", "baz"]
    "/foo/0"     "bar"
    "/"          0
    "/a~1b"      1
    "/c%d"       2
    "/e^f"       3
    "/g|h"       4
    "/i\\j"      5
    "/k\"l"      6
    "/ "         7
    "/m~0n"      8

*/
import { jsonPointerToPaths } from '../lib/primitives.js'

const testCases = ['', '/foo', '/foo/0', '/', '/a~1b', '/c%d', '/e^f', '/g|h', '/i\\j',
  '/k\'l', '/ ', '/m~0n']

testCases.forEach(pointer => {
  console.log(`${pointer}, ${jsonPointerToPaths(pointer)}`)
})

console.log(jsonPointerToPaths('/c%d'))
