const pr_str = require('./printer');
const read_str = require('./reader');
const { Nil, List, Str, Atom, equals, Vector } = require('./types');
const { readFileSync } = require('fs');

const add = (a, b) => a + b;

const mul = (a, b) => a * b;

const sub = (a, b) => a - b;

const div = (a, b) => a / b;

const list = (...args) => new List(args);

const isList = (...args) => args[0] instanceof List;

const isEmpty = (...args) => args[0].isEmpty();

const count = (...args) => (args[0] instanceof Nil ? 0 : args[0].length());

const lt = (...args) => args[0] < args[1];

const le = (...args) => args[0] <= args[1];

const gt = (...args) => args[0] > args[1];

const ge = (...args) => args[0] >= args[1];

const readString = (str) => read_str(str.ast);

const slurp = (fileName) => new Str(readFileSync(fileName.ast, 'utf-8'));

const atom = (value) => new Atom(value);

const isAtom = (value) => value instanceof Atom;

const deref = (atom) => atom.get();

const resetAtom = (atom, value) => atom.set(value);

const cons = (value, list) => list.cons(value);

const concat = (...lists) =>
  lists.reduce(
    (list, concattedList) => list.concat(concattedList),
    new List([])
  );

const str = (...args) =>
  new Str(args.reduce((arg, string) => arg + pr_str(string), ''));

const vec = (list) => new Vector([...list.ast]);

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
    result.push(pr_str(arg, true));
  });
  return result.join(' ');
};

const swap = (atom, func, ...args) => {
  func = func.fn || func;
  return atom.set(func(atom.get(), ...args));
};

const prn = (...args) => {
  if (args[0]) {
    console.log(pr_str(args[0], true));
  }
  return new Nil();
};

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
  '=': equals,
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
  cons,
  concat,
  vec,
};

module.exports = core;
