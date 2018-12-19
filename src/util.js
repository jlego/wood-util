// 工具类
// by YuRonghui 2018-1-4
const crypto = require('crypto');
const moment = require('moment');
const _request = require('request-promise');
moment.locale('zh-cn');

exports.moment = moment;

// md5
exports.md5 = function(str) {
  let hash = crypto.createHash("md5");
  hash.update(str);
  str = hash.digest("hex");
  return str;
};

// 唯一码
exports.uuid = function() {
  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }
  return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
};

// utf8转b64
exports.utf8_to_b64 = function( str ) {
  return window.btoa(unescape(encodeURIComponent( str )));
}

// b64转utf8
exports.b64_to_utf8 = function( str ) {
  return decodeURIComponent(escape(window.atob( str )));
}

// 生成表查询条件listkey
exports.getListKey = function(req) {
  let data = exports.deepCopy(req.body);
  delete data.data.limit;
  delete data.data.page;
  let arr = [];
  for (let key in data) {
    arr.push(`${key}=${JSON.stringify(data[key])}`);
  }
  arr.push(`url=${req.url}`);
  arr.sort();
  return exports.md5(arr.join('&'));
};
exports.getReqKey = function(req) {
  return exports.getListKey(req);
}

// 深拷贝
exports.deepCopy = function(obj){
  let str, newobj = Array.isArray(obj) ? [] : {};
  if(typeof obj !== 'object'){
    return;
  // } else if(window.JSON){
  //   newobj = JSON.parse(JSON.stringify(obj));
  } else {
    for(let i in obj){
      newobj[i] = typeof obj[i] === 'object' && !(obj[i] instanceof Date) ? exports.deepCopy(obj[i]) : obj[i];
    }
  }
  return newobj;
};

// 是否空对象
exports.isEmpty = function(value){
  if(JSON.stringify(value) == '{}' || JSON.stringify(value) == '[]') return true;
  return false;
};

// 首字母小写
exports.firstLowerCase = function(str, otherIsLower = true) {
  return str.replace(/\b(\w)(\w*)/g, function($0, $1, $2) {
    return $1.toLowerCase() + (otherIsLower ? $2.toLowerCase() : $2);
  });
};

// 首字母大写
exports.firstUpperCase = function(str, otherIsLower = true) {
  return str.replace(/\b(\w)(\w*)/g, function($0, $1, $2) {
    return $1.toUpperCase() + (otherIsLower ? $2.toLowerCase() : $2);
  });
};

// 对象key大小写转换
exports.objectKeyLowerUpper = function(obj, isLower, otherIsLower = true){
  if(typeof obj == 'object'){
    if(!Array.isArray(obj)){
      let newObj = {};
      for(let key in obj){
        let newKey = isLower ? exports.firstLowerCase(key, otherIsLower) : exports.firstUpperCase(key, otherIsLower);
        newObj[newKey] = obj[key];
      }
      return newObj;
    }
  }
  return obj;
};

// 过滤html
exports.filterHtml = function(str){
  return str ? str.replace(/<[^>]+>/g,"") : '';
}

// 获取参数
exports.getParams = function(req){
  if(req.method == 'GET'){
    return req.query;
  }else{
    return req.body;
  }
  return {};
};

// http请求方法
async function sendhttp(url, method, opts = {}){
  let { catchErr, error } = WOOD;
  let result = await catchErr(_request[method](url, opts));
  if(result.err) throw error(result.err);
  if(typeof result.data === 'string'){
    try{
      return JSON.parse(result.data);
    }catch(err){
      throw error(err);
    }
  }else{
    return result.data;
  }
}
exports.request = {
  async get(url, opts = {}){
    return await sendhttp(url, 'get', opts);
  },
  async post(url, opts = {}){
    return await sendhttp(url, 'post', opts);
  },
  async put(url, opts = {}){
    return await sendhttp(url, 'put', opts);
  },
  async delete(url, opts = {}){
    return await sendhttp(url, 'delete', opts);
  }
};