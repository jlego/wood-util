/**
 * Wood Plugin Module.
 * 工具类
 * by jlego on 2018-11-18
 */
const Util = require('./src/util');

module.exports = (app, config = {}) => {
  app.Util = Util;
  return app.Util;
}
