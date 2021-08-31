const { MalVal } = require('./types');

const pr_str = (value, print_readably = false) => {
  if (value instanceof MalVal) {
    return value.prn_str(print_readably);
  }
  return value.toString();
};

module.exports = pr_str;
