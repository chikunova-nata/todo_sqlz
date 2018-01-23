const fs = require('fs');

function writeToFile(text) {
  fs.writeFileSync('/tmp/writeExample.txt', text);
}

module.exports = {
    writeToFile
};