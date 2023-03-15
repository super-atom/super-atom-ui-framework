const path = require('path');
const ROOT = process.cwd();
const PATH = {
  dist: path.join(ROOT, 'dist'),
  src: path.join(ROOT, 'src'),
};

module.exports = PATH;
