"use strict";
const util = require('util')

function colorize (color, text) {
  const codes = util.inspect.colors[color]
  return `\x1b[${codes[0]}m${text}\x1b[${codes[1]}m`
}

function colors () {
  let returnValue = {}
  Object.keys(util.inspect.colors).forEach((color) => {
    returnValue[color] = (text) => colorize(color, text)
  })
  return returnValue
}

module.exports = colors()