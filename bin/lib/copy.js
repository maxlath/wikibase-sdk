var copy = require('copy-paste').copy
require('colors')

module.exports = function (text) {
  copy(text)
  process.stdout.write('copied to Clipboard: '.green + text + '\n')
  process.exit()
}
