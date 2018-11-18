// 工具类
// by YuRonghui 2018-1-4
const crypto = require('crypto');
const moment = require('moment');
moment.locale('zh-cn');

// 捕获异常
module.catchErr = function(promise){
  return promise
    .then(data => ({ data }))
    .catch(err => ({ err }));
};

// md5
module.md5 = function(str) {
  let hash = crypto.createHash("md5");
  hash.update(str);
  str = hash.digest("hex");
  return str;
};

// 唯一码
module.uuid = function() {
  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }
  return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
};

// 生成表查询条件listkey
module.getListKey = function(req) {
  let data = Util.deepCopy(req.body);
  delete data.data.limit;
  delete data.data.page;
  let arr = [];
  for (let key in data) {
    arr.push(`${key}=${JSON.stringify(data[key])}`);
  }
  arr.push(`url=${req.url}`);
  arr.sort();
  return Util.md5(arr.join('&'));
};

// 深拷贝
module.deepCopy = function(obj){
  let str, newobj = Array.isArray(obj) ? [] : {};
  if(typeof obj !== 'object'){
    return;
  // } else if(window.JSON){
  //   newobj = JSON.parse(JSON.stringify(obj));
  } else {
    for(let i in obj){
      newobj[i] = typeof obj[i] === 'object' && !(obj[i] instanceof Date) ? Util.deepCopy(obj[i]) : obj[i];
    }
  }
  return newobj;
};

// 是否空对象
module.isEmpty = function(value){
  if(JSON.stringify(value) == '{}' || JSON.stringify(value) == '[]') return true;
  return false;
};

// 首字母小写
module.firstLowerCase = function(str, otherIsLower = true) {
  return str.replace(/\b(\w)(\w*)/g, function($0, $1, $2) {
    return $1.toLowerCase() + (otherIsLower ? $2.toLowerCase() : $2);
  });
};

// 首字母大写
module.firstUpperCase = function(str, otherIsLower = true) {
  return str.replace(/\b(\w)(\w*)/g, function($0, $1, $2) {
    return $1.toUpperCase() + (otherIsLower ? $2.toLowerCase() : $2);
  });
};

// 对象key大小写转换
module.objectKeyLowerUpper = function(obj, isLower, otherIsLower = true){
  if(typeof obj == 'object'){
    if(!Array.isArray(obj)){
      let newObj = {};
      for(let key in obj){
        let newKey = isLower ? Util.firstLowerCase(key, otherIsLower) : Util.firstUpperCase(key, otherIsLower);
        newObj[newKey] = obj[key];
      }
      return newObj;
    }
  }
  return obj;
};

module.respData = function(data, reqData){
  let status = 0,
    msg = '';
  if (!data && data !== false) data = WOOD.error_code.error_nodata;
  if (data.path && data.message && data.kind) { //返回错误
    status = WOOD.error_code.error_wrongdata.code;
    msg = WOOD.error_code.error_wrongdata.msg;
  } else if (data.name == 'ValidationError') {
    status = WOOD.error_code.error_validation.code;
    msg = WOOD.error_code.error_validation.msg;
  } else {
    status = !data.code ? WOOD.error_code.success.code : data.code;
    msg = !data.msg ? WOOD.error_code.success.msg : data.msg;
  }
  return {
    // seqno: reqData.seqno,
    cmd: reqData.cmd,
    status,
    msg,
    data: !data.code ? data : {}
  };
};

// 过滤html
module.filterHtml = function(str){
  return str ? str.replace(/<[^>]+>/g,"") : '';
}

module.moment = moment;

// 获取参数
module.getParams = function(req){
  if(req.method == 'GET'){
    return req.query;
  }else{
    return req.body;
  }
  return {};
};

// 返回错误
module.error = function(err) {
  let result = JSON.parse(JSON.stringify(WOOD.error_code.error));
  if (typeof err !== 'object') {
    if(typeof err == 'string') result.msg = err;
    result.error = err;
  }else if(typeof err == 'object'){
    if(err.message){
      result.msg = err.message;
      result.error = err;
    }else if(err.msg && err.code){
      result = err;
    }
  }
  return result;
};
