const readline = require('readline');

function readLines() {
  readline.createInterface({
    input: process.stdin
  });
}

exports.readLines = readLines();
