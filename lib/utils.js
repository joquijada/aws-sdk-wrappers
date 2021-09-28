const { default: ow } = require('ow')
const convertContentToJSON = require('./convert-content-to-json')

module.exports = {
  isString: (argument) => ow.isValid(argument, ow.string),
  convertContentToJSON
}
