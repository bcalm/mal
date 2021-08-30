const pr_str = require('./printer');
const read_str = require('./reader');
const { Nil, List, Str, Atom } = require('./types');
const { readFileSync } = require('fs');

const add = (a, b) => a + b;
const mul = (a, b) => a * b;
const sub = (a, b) => a - b;
const div = (a, b) => a / b;

const prn = (...args) => {
  if (args[0]) {
    console.log(pr_str(args[0]));
  }
  return new Nil();
};

const list = (...args) => {
  return new List(args);
};

const isList = (...args) => {
  return args[0] instanceof List;
};

const isEmpty = (...args) => {
  return args[0].isEmpty();
};

const count = (...args) => {
  return args[0] instanceof Nil ? 0 : args[0].length();
};

const equal = (...args) => args[0].toString() === args[1].toString();

const lt = (...args) => args[0] < args[1];

const le = (...args) => args[0] <= args[1];

const gt = (...args) => args[0] > args[1];

const ge = (...args) => args[0] >= args[1];

const str = (...args) => args.reduce((arg, string) => string + arg, '');

const printLine = (...args) => {
  const result = [];
  args.forEach((arg) => {
    result.push(pr_str(arg));
  });
  console.log(result.join(' '));
  return new Nil();
};

const printString = (...args) => {
  const result = [];
  args.forEach((arg) => {
    result.push(pr_str(arg));
  });
  return result.join(' ');
};

const readString = (str) => read_str(str.ast);

const slurp = (fileName) => new Str(readFileSync(fileName.ast, 'utf-8'));

const atom = (value) => new Atom(value);

const isAtom = (value) => value instanceof Atom;

const deref = (atom) => atom.value;

const resetAtom = (atom, value) => atom.set(value);

const swap = (atom, fn, ...value) => atom.swap(fn, value);

const core = {
  '+': add,
  '*': mul,
  '-': sub,
  '/': div,
  'pr-str': printString,
  str,
  prn: prn,
  println: printLine,
  list,
  'list?': isList,
  'empty?': isEmpty,
  count: count,
  '=': equal,
  '<': lt,
  '<=': le,
  '>': gt,
  '>=': ge,
  atom,
  'atom?': isAtom,
  deref,
  'reset!': resetAtom,
  'read-string': readString,
  slurp,
  'swap!': swap,
};

module.exports = core;
