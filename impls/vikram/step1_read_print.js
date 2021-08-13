const readline = require('readline');
const pr_str = require('./printer');
const read_form = require('./reader');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const EVAL = (str) => str;

const rep = (str) => pr_str(EVAL(read_form(str)));

const loop = () => {
  rl.question('user> ', (str) => {
    try {
      console.log(rep(str));
    } catch (error) {
      console.log(error);
    } finally {
      loop();
    }
  });
};

loop();
