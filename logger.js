/*
 * Logger
 */
const INFO = "INFO";
const ERROR = "ERROR";

const Clear = '\x1b[0m';
const Bright = '\x1b[1m';
const FgRed = '\x1b[31m';

const log = (name, level, ...args) => {
  console.log(`${Bright}[${name}] ${level === ERROR ? FgRed : ''}${level}${Clear}${Bright}:${Clear}`, ...args);
};

class Logger {
  constructor(name) {
    this.name = name;
  }

  info(...args) {
    log(this.name, INFO, ...args);
  }

  error(...args) {
    log(this.name, ERROR, ...args);
  }
}

module.exports = Logger;
