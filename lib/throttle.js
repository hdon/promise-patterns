'use strict'

const pair = require('./shared/pair')

function throttle (input, maxSimulJobs) {
  return new Promise((resolve, reject) => {
    if (input.length == 0)
      resolve([]);
    let output = new Array(input.length);
    let head = 0;
    let completed = 0;
    let die = 0;
    let firstErr;

    let next = () => {
      if (die) {
        if (head == completed)
          reject(firstErr);
      } else {
        if (completed == input.length) {
          resolve(output[output.length-1]);
        } else if (head < input.length) {
          let cursor = head++;
          output[cursor] = input[cursor]().then(outputElem => {
            output[cursor] = outputElem;
            completed++;
            next();
          }).catch(err => {
            firstErr = output[cursor] = err;
            die = true;
            completed++;
            next();
          });
        }
      }
    };

    while (head < maxSimulJobs)
      next();
  });
}

module.exports = throttle;
