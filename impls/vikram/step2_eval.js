const readline = require('readline');
const pr_str = require('./printer');
const read_form = require('./reader');
const env = require('./env');
const { EVAL } = require('./eval');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const rep = (str) => pr_str(EVAL(read_form(str), env));

const loop = () => {
  rl.question('user> ', (str) => {
    try {
      console.log(rep(str));
    } catch (error) {
      console.log(error.message);
    } finally {
      loop();
    }
  });
};

loop();
