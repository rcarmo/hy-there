;(function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0].call(u.exports,function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){
var _ns_ = {
  "id": "wisp.engine.browser"
};
var wisp_runtime = require("./../runtime");
var str = wisp_runtime.str;;
var wisp_sequence = require("./../sequence");
var rest = wisp_sequence.rest;;
var wisp_reader = require("./../reader");
var read_ = wisp_reader.read_;
var readFromString = wisp_reader.readFromString;;
var wisp_compiler = require("./../compiler");
var compile_ = wisp_compiler.compile_;;;

var evaluate = function evaluate(code, url) {
  return eval(compile_(read_(code, url)));
};
exports.evaluate = evaluate;

var run = function run(code, url) {
  return (Function(compile_(read_(code, url))))();
};
exports.run = run;

var load = function load(url, callback) {
  var request = window.XMLHttpRequest ?
    new XMLHttpRequest() :
    new ActiveXObject("Microsoft.XMLHTTP");
  request.open("GET", url, true);
  request.overrideMimeType ?
    request.overrideMimeType("application/wisp") :
    void(0);
  request.onreadystatechange = function() {
    return request.readyState === 4 ?
      (request.status === 0) || (request.status === 200) ?
        callback(run(request.responseText, url)) :
        callback("Could not load") :
      void(0);
  };
  return request.send(null);
};
exports.load = load;

var runScripts = function runScripts() {
  var scripts = Array.prototype.filter.call(document.getElementsByTagName("script"), function(script) {
    return script.type === "application/wisp";
  });
  var next = function next() {
    return scripts.length ?
      (function() {
        var script = scripts.shift();
        return script.src ?
          load(script.src, next) :
          next(run(script.innerHTML));
      })() :
      void(0);
  };
  return next();
};
exports.runScripts = runScripts;

(document.readyState === "complete") || (document.readyState === "interactive") ?
  runScripts() :
window.addEventListener ?
  window.addEventListener("DOMContentLoaded", runScripts, false) :
  window.attachEvent("onload", runScripts)
},{"./../runtime":2,"./../sequence":3,"./../reader":4,"./../compiler":5}],2:[function(require,module,exports){
(function(){var _ns_ = {
  "id": "wisp.runtime",
  "doc": "Core primitives required for runtime"
};;

var identity = function identity(x) {
  return x;
};
exports.identity = identity;

var isOdd = function isOdd(n) {
  return n % 2 === 1;
};
exports.isOdd = isOdd;

var isEven = function isEven(n) {
  return n % 2 === 0;
};
exports.isEven = isEven;

var isDictionary = function isDictionary(form) {
  return (isObject(form)) && (isObject(Object.getPrototypeOf(form))) && (isNil(Object.getPrototypeOf(Object.getPrototypeOf(form))));
};
exports.isDictionary = isDictionary;

var dictionary = function dictionary() {
  return (function loop(keyValues, result) {
    var recur = loop;
    while (recur === loop) {
      recur = keyValues.length ?
      (function() {
        (result || 0)[(keyValues || 0)[0]] = (keyValues || 0)[1];
        return (keyValues = keyValues.slice(2), result = result, loop);
      })() :
      result;
    };
    return recur;
  })(Array.prototype.slice.call(arguments), {});
};
exports.dictionary = dictionary;

var keys = function keys(dictionary) {
  return Object.keys(dictionary);
};
exports.keys = keys;

var vals = function vals(dictionary) {
  return keys(dictionary).map(function(key) {
    return (dictionary || 0)[key];
  });
};
exports.vals = vals;

var keyValues = function keyValues(dictionary) {
  return keys(dictionary).map(function(key) {
    return [key, (dictionary || 0)[key]];
  });
};
exports.keyValues = keyValues;

var merge = function merge() {
  return Object.create(Object.prototype, Array.prototype.slice.call(arguments).reduce(function(descriptor, dictionary) {
    isObject(dictionary) ?
      Object.keys(dictionary).forEach(function(key) {
        return (descriptor || 0)[key] = Object.getOwnPropertyDescriptor(dictionary, key);
      }) :
      void(0);
    return descriptor;
  }, Object.create(Object.prototype)));
};
exports.merge = merge;

var isContainsVector = function isContainsVector(vector, element) {
  return vector.indexOf(element) >= 0;
};
exports.isContainsVector = isContainsVector;

var mapDictionary = function mapDictionary(source, f) {
  return Object.keys(source).reduce(function(target, key) {
    (target || 0)[key] = f((source || 0)[key]);
    return target;
  }, {});
};
exports.mapDictionary = mapDictionary;

var toString = Object.prototype.toString;
exports.toString = toString;

var isFn = typeof(/./) === "function" ?
  function isFn(x) {
    return toString.call(x) === "[object Function]";
  } :
  function isFn(x) {
    return typeof(x) === "function";
  };
exports.isFn = isFn;

var isString = function isString(x) {
  return (typeof(x) === "string") || (toString.call(x) === "[object String]");
};
exports.isString = isString;

var isNumber = function isNumber(x) {
  return (typeof(x) === "number") || (toString.call(x) === "[object Number]");
};
exports.isNumber = isNumber;

var isVector = isFn(Array.isArray) ?
  Array.isArray :
  function isVector(x) {
    return toString.call(x) === "[object Array]";
  };
exports.isVector = isVector;

var isDate = function isDate(x) {
  return toString.call(x) === "[object Date]";
};
exports.isDate = isDate;

var isBoolean = function isBoolean(x) {
  return (x === true) || (x === false) || (toString.call(x) === "[object Boolean]");
};
exports.isBoolean = isBoolean;

var isRePattern = function isRePattern(x) {
  return toString.call(x) === "[object RegExp]";
};
exports.isRePattern = isRePattern;

var isObject = function isObject(x) {
  return x && (typeof(x) === "object");
};
exports.isObject = isObject;

var isNil = function isNil(x) {
  return (x === void(0)) || (x === null);
};
exports.isNil = isNil;

var isTrue = function isTrue(x) {
  return x === true;
};
exports.isTrue = isTrue;

var isFalse = function isFalse(x) {
  return x === true;
};
exports.isFalse = isFalse;

var reFind = function reFind(re, s) {
  var matches = re.exec(s);
  return !(isNil(matches)) ?
    matches.length === 1 ?
      (matches || 0)[0] :
      matches :
    void(0);
};
exports.reFind = reFind;

var reMatches = function reMatches(pattern, source) {
  var matches = pattern.exec(source);
  return (!(isNil(matches))) && ((matches || 0)[0] === source) ?
    matches.length === 1 ?
      (matches || 0)[0] :
      matches :
    void(0);
};
exports.reMatches = reMatches;

var rePattern = function rePattern(s) {
  var match = reFind(/^(?:\(\?([idmsux]*)\))?(.*)/, s);
  return new RegExp((match || 0)[2], (match || 0)[1]);
};
exports.rePattern = rePattern;

var inc = function inc(x) {
  return x + 1;
};
exports.inc = inc;

var dec = function dec(x) {
  return x - 1;
};
exports.dec = dec;

var str = function str() {
  return String.prototype.concat.apply("", arguments);
};
exports.str = str;

var char = function char(code) {
  return String.fromCharCode(code);
};
exports.char = char;

var int = function int(x) {
  return isNumber(x) ?
    x >= 0 ?
      Math.floor(x) :
      Math.floor(x) :
    x.charCodeAt(0);
};
exports.int = int;

var subs = function subs(string, start, end) {
  return string.substring(start, end);
};
exports.subs = subs;

var isPatternEqual = function isPatternEqual(x, y) {
  return (isRePattern(x)) && (isRePattern(y)) && (x.source === y.source) && (x.global === y.global) && (x.multiline === y.multiline) && (x.ignoreCase === y.ignoreCase);
};

var isDateEqual = function isDateEqual(x, y) {
  return (isDate(x)) && (isDate(y)) && (Number(x) === Number(y));
};

var isDictionaryEqual = function isDictionaryEqual(x, y) {
  return (isObject(x)) && (isObject(y)) && ((function() {
    var xKeys = keys(x);
    var yKeys = keys(y);
    var xCount = xKeys.length;
    var yCount = yKeys.length;
    return (xCount === yCount) && ((function loop(index, count, keys) {
      var recur = loop;
      while (recur === loop) {
        recur = index < count ?
        isEquivalent((x || 0)[(keys || 0)[index]], (y || 0)[(keys || 0)[index]]) ?
          (index = inc(index), count = count, keys = keys, loop) :
          false :
        true;
      };
      return recur;
    })(0, xCount, xKeys));
  })());
};

var isVectorEqual = function isVectorEqual(x, y) {
  return (isVector(x)) && (isVector(y)) && (x.length === y.length) && ((function loop(xs, ys, index, count) {
    var recur = loop;
    while (recur === loop) {
      recur = index < count ?
      isEquivalent((xs || 0)[index], (ys || 0)[index]) ?
        (xs = xs, ys = ys, index = inc(index), count = count, loop) :
        false :
      true;
    };
    return recur;
  })(x, y, 0, x.length));
};

var isEquivalent = function isEquivalent(x, y) {
  switch (arguments.length) {
    case 1:
      return true;
    case 2:
      return (x === y) || (isNil(x) ?
        isNil(y) :
      isNil(y) ?
        isNil(x) :
      isString(x) ?
        false :
      isNumber(x) ?
        false :
      isFn(x) ?
        false :
      isBoolean(x) ?
        false :
      isDate(x) ?
        isDateEqual(x, y) :
      isVector(x) ?
        isVectorEqual(x, y, [], []) :
      isRePattern(x) ?
        isPatternEqual(x, y) :
      "else" ?
        isDictionaryEqual(x, y) :
        void(0));

    default:
      var more = Array.prototype.slice.call(arguments, 2);
      return (function loop(previous, current, index, count) {
        var recur = loop;
        while (recur === loop) {
          recur = (isEquivalent(previous, current)) && (index < count ?
          (previous = current, current = (more || 0)[index], index = inc(index), count = count, loop) :
          true);
        };
        return recur;
      })(x, y, 0, more.length);
  };
  return void(0);
};

var isEqual = isEquivalent;
exports.isEqual = isEqual;

var isStrictEqual = function isStrictEqual(x, y) {
  switch (arguments.length) {
    case 1:
      return true;
    case 2:
      return x === y;

    default:
      var more = Array.prototype.slice.call(arguments, 2);
      return (function loop(previous, current, index, count) {
        var recur = loop;
        while (recur === loop) {
          recur = (previous === current) && (index < count ?
          (previous = current, current = (more || 0)[index], index = inc(index), count = count, loop) :
          true);
        };
        return recur;
      })(x, y, 0, more.length);
  };
  return void(0);
};
exports.isStrictEqual = isStrictEqual;

var greaterThan = function greaterThan(x, y) {
  switch (arguments.length) {
    case 1:
      return true;
    case 2:
      return x > y;

    default:
      var more = Array.prototype.slice.call(arguments, 2);
      return (function loop(previous, current, index, count) {
        var recur = loop;
        while (recur === loop) {
          recur = (previous > current) && (index < count ?
          (previous = current, current = (more || 0)[index], index = inc(index), count = count, loop) :
          true);
        };
        return recur;
      })(x, y, 0, more.length);
  };
  return void(0);
};
exports.greaterThan = greaterThan;

var notLessThan = function notLessThan(x, y) {
  switch (arguments.length) {
    case 1:
      return true;
    case 2:
      return x >= y;

    default:
      var more = Array.prototype.slice.call(arguments, 2);
      return (function loop(previous, current, index, count) {
        var recur = loop;
        while (recur === loop) {
          recur = (previous >= current) && (index < count ?
          (previous = current, current = (more || 0)[index], index = inc(index), count = count, loop) :
          true);
        };
        return recur;
      })(x, y, 0, more.length);
  };
  return void(0);
};
exports.notLessThan = notLessThan;

var lessThan = function lessThan(x, y) {
  switch (arguments.length) {
    case 1:
      return true;
    case 2:
      return x < y;

    default:
      var more = Array.prototype.slice.call(arguments, 2);
      return (function loop(previous, current, index, count) {
        var recur = loop;
        while (recur === loop) {
          recur = (previous < current) && (index < count ?
          (previous = current, current = (more || 0)[index], index = inc(index), count = count, loop) :
          true);
        };
        return recur;
      })(x, y, 0, more.length);
  };
  return void(0);
};
exports.lessThan = lessThan;

var notGreaterThan = function notGreaterThan(x, y) {
  switch (arguments.length) {
    case 1:
      return true;
    case 2:
      return x <= y;

    default:
      var more = Array.prototype.slice.call(arguments, 2);
      return (function loop(previous, current, index, count) {
        var recur = loop;
        while (recur === loop) {
          recur = (previous <= current) && (index < count ?
          (previous = current, current = (more || 0)[index], index = inc(index), count = count, loop) :
          true);
        };
        return recur;
      })(x, y, 0, more.length);
  };
  return void(0);
};
exports.notGreaterThan = notGreaterThan;

var sum = function sum(a, b, c, d, e, f) {
  switch (arguments.length) {
    case 0:
      return 0;
    case 1:
      return a;
    case 2:
      return a + b;
    case 3:
      return a + b + c;
    case 4:
      return a + b + c + d;
    case 5:
      return a + b + c + d + e;
    case 6:
      return a + b + c + d + e + f;

    default:
      var more = Array.prototype.slice.call(arguments, 6);
      return (function loop(value, index, count) {
        var recur = loop;
        while (recur === loop) {
          recur = index < count ?
          (value = value + ((more || 0)[index]), index = inc(index), count = count, loop) :
          value;
        };
        return recur;
      })(a + b + c + d + e + f, 0, more.length);
  };
  return void(0);
};
exports.sum = sum;

var subtract = function subtract(a, b, c, d, e, f) {
  switch (arguments.length) {
    case 0:
      return (function() { throw TypeError("Wrong number of args passed to: -"); })();
    case 1:
      return 0 - a;
    case 2:
      return a - b;
    case 3:
      return a - b - c;
    case 4:
      return a - b - c - d;
    case 5:
      return a - b - c - d - e;
    case 6:
      return a - b - c - d - e - f;

    default:
      var more = Array.prototype.slice.call(arguments, 6);
      return (function loop(value, index, count) {
        var recur = loop;
        while (recur === loop) {
          recur = index < count ?
          (value = value - ((more || 0)[index]), index = inc(index), count = count, loop) :
          value;
        };
        return recur;
      })(a - b - c - d - e - f, 0, more.length);
  };
  return void(0);
};
exports.subtract = subtract;

var divide = function divide(a, b, c, d, e, f) {
  switch (arguments.length) {
    case 0:
      return (function() { throw TypeError("Wrong number of args passed to: /"); })();
    case 1:
      return 1 / a;
    case 2:
      return a / b;
    case 3:
      return a / b / c;
    case 4:
      return a / b / c / d;
    case 5:
      return a / b / c / d / e;
    case 6:
      return a / b / c / d / e / f;

    default:
      var more = Array.prototype.slice.call(arguments, 6);
      return (function loop(value, index, count) {
        var recur = loop;
        while (recur === loop) {
          recur = index < count ?
          (value = value / ((more || 0)[index]), index = inc(index), count = count, loop) :
          value;
        };
        return recur;
      })(a / b / c / d / e / f, 0, more.length);
  };
  return void(0);
};
exports.divide = divide;

var multiply = function multiply(a, b, c, d, e, f) {
  switch (arguments.length) {
    case 0:
      return 1;
    case 1:
      return a;
    case 2:
      return a * b;
    case 3:
      return a * b * c;
    case 4:
      return a * b * c * d;
    case 5:
      return a * b * c * d * e;
    case 6:
      return a * b * c * d * e * f;

    default:
      var more = Array.prototype.slice.call(arguments, 6);
      return (function loop(value, index, count) {
        var recur = loop;
        while (recur === loop) {
          recur = index < count ?
          (value = value * ((more || 0)[index]), index = inc(index), count = count, loop) :
          value;
        };
        return recur;
      })(a * b * c * d * e * f, 0, more.length);
  };
  return void(0);
};
exports.multiply = multiply;

var and = function and(a, b, c, d, e, f) {
  switch (arguments.length) {
    case 0:
      return true;
    case 1:
      return a;
    case 2:
      return a && b;
    case 3:
      return a && b && c;
    case 4:
      return a && b && c && d;
    case 5:
      return a && b && c && d && e;
    case 6:
      return a && b && c && d && e && f;

    default:
      var more = Array.prototype.slice.call(arguments, 6);
      return (function loop(value, index, count) {
        var recur = loop;
        while (recur === loop) {
          recur = index < count ?
          (value = value && ((more || 0)[index]), index = inc(index), count = count, loop) :
          value;
        };
        return recur;
      })(a && b && c && d && e && f, 0, more.length);
  };
  return void(0);
};
exports.and = and;

var or = function or(a, b, c, d, e, f) {
  switch (arguments.length) {
    case 0:
      return void(0);
    case 1:
      return a;
    case 2:
      return a || b;
    case 3:
      return a || b || c;
    case 4:
      return a || b || c || d;
    case 5:
      return a || b || c || d || e;
    case 6:
      return a || b || c || d || e || f;

    default:
      var more = Array.prototype.slice.call(arguments, 6);
      return (function loop(value, index, count) {
        var recur = loop;
        while (recur === loop) {
          recur = index < count ?
          (value = value || ((more || 0)[index]), index = inc(index), count = count, loop) :
          value;
        };
        return recur;
      })(a || b || c || d || e || f, 0, more.length);
  };
  return void(0);
};
exports.or = or;

var print = function print() {
  var more = Array.prototype.slice.call(arguments, 0);
  return console.log.apply(console.log, more);
};
exports.print = print
})()
},{}],3:[function(require,module,exports){
var _ns_ = {
  "id": "wisp.sequence"
};
var wisp_runtime = require("./runtime");
var isNil = wisp_runtime.isNil;
var isVector = wisp_runtime.isVector;
var isFn = wisp_runtime.isFn;
var isNumber = wisp_runtime.isNumber;
var isString = wisp_runtime.isString;
var isDictionary = wisp_runtime.isDictionary;
var keyValues = wisp_runtime.keyValues;
var str = wisp_runtime.str;
var dec = wisp_runtime.dec;
var inc = wisp_runtime.inc;
var merge = wisp_runtime.merge;
var dictionary = wisp_runtime.dictionary;;;

var List = function List(head, tail) {
  this.head = head;
  this.tail = tail || (list());
  this.length = inc(count(this.tail));
  return this;
};

List.prototype.length = 0;

List.type = "wisp.list";

List.prototype.type = List.type;

List.prototype.tail = Object.create(List.prototype);

List.prototype.toString = function() {
  return (function loop(result, list) {
    var recur = loop;
    while (recur === loop) {
      recur = isEmpty(list) ?
      "" + "(" + (result.substr(1)) + ")" :
      (result = "" + result + " " + (isVector(first(list)) ?
        "" + "[" + (first(list).join(" ")) + "]" :
      isNil(first(list)) ?
        "nil" :
      isString(first(list)) ?
        JSON.stringify(first(list)) :
      isNumber(first(list)) ?
        JSON.stringify(first(list)) :
        first(list)), list = rest(list), loop);
    };
    return recur;
  })("", this);
};

var lazySeqValue = function lazySeqValue(lazySeq) {
  return !(lazySeq.realized) ?
    (lazySeq.realized = true) && (lazySeq.x = lazySeq.x()) :
    lazySeq.x;
};

var LazySeq = function LazySeq(realized, x) {
  this.realized = realized || false;
  this.x = x;
  return this;
};

LazySeq.type = "wisp.lazy.seq";

LazySeq.prototype.type = LazySeq.type;

var lazySeq = function lazySeq(realized, body) {
  return new LazySeq(realized, body);
};
exports.lazySeq = lazySeq;

var isLazySeq = function isLazySeq(value) {
  return value && (LazySeq.type === value.type);
};
exports.isLazySeq = isLazySeq;

undefined;

var isList = function isList(value) {
  return value && (List.type === value.type);
};
exports.isList = isList;

var list = function list() {
  return arguments.length === 0 ?
    Object.create(List.prototype) :
    Array.prototype.slice.call(arguments).reduceRight(function(tail, head) {
      return cons(head, tail);
    }, list());
};
exports.list = list;

var cons = function cons(head, tail) {
  return new List(head, tail);
};
exports.cons = cons;

var reverseList = function reverseList(sequence) {
  return (function loop(items, source) {
    var recur = loop;
    while (recur === loop) {
      recur = isEmpty(source) ?
      list.apply(list, items) :
      (items = [first(source)].concat(items), source = rest(source), loop);
    };
    return recur;
  })([], sequence);
};

var isSequential = function isSequential(x) {
  return (isList(x)) || (isVector(x)) || (isLazySeq(x)) || (isDictionary(x)) || (isString(x));
};
exports.isSequential = isSequential;

var reverse = function reverse(sequence) {
  return isList(sequence) ?
    reverseList(sequence) :
  isVector(sequence) ?
    sequence.reverse() :
  isNil(sequence) ?
    list() :
  "else" ?
    reverse(seq(sequence)) :
    void(0);
};
exports.reverse = reverse;

var map = function map(f, sequence) {
  return isVector(sequence) ?
    sequence.map(f) :
  isList(sequence) ?
    mapList(f, sequence) :
  isNil(sequence) ?
    list() :
  "else" ?
    map(f, seq(sequence)) :
    void(0);
};
exports.map = map;

var mapList = function mapList(f, sequence) {
  return (function loop(result, items) {
    var recur = loop;
    while (recur === loop) {
      recur = isEmpty(items) ?
      reverse(result) :
      (result = cons(f(first(items)), result), items = rest(items), loop);
    };
    return recur;
  })(list(), sequence);
};

var filter = function filter(isF, sequence) {
  return isVector(sequence) ?
    sequence.filter(isF) :
  isList(sequence) ?
    filterList(isF, sequence) :
  isNil(sequence) ?
    list() :
  "else" ?
    filter(isF, seq(sequence)) :
    void(0);
};
exports.filter = filter;

var filterList = function filterList(isF, sequence) {
  return (function loop(result, items) {
    var recur = loop;
    while (recur === loop) {
      recur = isEmpty(items) ?
      reverse(result) :
      (result = isF(first(items)) ?
        cons(first(items), result) :
        result, items = rest(items), loop);
    };
    return recur;
  })(list(), sequence);
};

var reduce = function reduce(f) {
  var params = Array.prototype.slice.call(arguments, 1);
  return (function() {
    var hasInitial = count(params) >= 2;
    var initial = hasInitial ?
      first(params) :
      void(0);
    var sequence = hasInitial ?
      second(params) :
      first(params);
    return isNil(sequence) ?
      initial :
    isVector(sequence) ?
      hasInitial ?
        sequence.reduce(f, initial) :
        sequence.reduce(f) :
    isList(sequence) ?
      hasInitial ?
        reduceList(f, initial, sequence) :
        reduceList(f, first(sequence), rest(sequence)) :
    "else" ?
      reduce(f, initial, seq(sequence)) :
      void(0);
  })();
};
exports.reduce = reduce;

var reduceList = function reduceList(f, initial, sequence) {
  return (function loop(result, items) {
    var recur = loop;
    while (recur === loop) {
      recur = isEmpty(items) ?
      result :
      (result = f(result, first(items)), items = rest(items), loop);
    };
    return recur;
  })(initial, sequence);
};

var count = function count(sequence) {
  return isNil(sequence) ?
    0 :
    (seq(sequence)).length;
};
exports.count = count;

var isEmpty = function isEmpty(sequence) {
  return count(sequence) === 0;
};
exports.isEmpty = isEmpty;

var first = function first(sequence) {
  return isNil(sequence) ?
    void(0) :
  isList(sequence) ?
    sequence.head :
  (isVector(sequence)) || (isString(sequence)) ?
    (sequence || 0)[0] :
  isLazySeq(sequence) ?
    first(lazySeqValue(sequence)) :
  "else" ?
    first(seq(sequence)) :
    void(0);
};
exports.first = first;

var second = function second(sequence) {
  return isNil(sequence) ?
    void(0) :
  isList(sequence) ?
    first(rest(sequence)) :
  (isVector(sequence)) || (isString(sequence)) ?
    (sequence || 0)[1] :
  isLazySeq(sequence) ?
    second(lazySeqValue(sequence)) :
  "else" ?
    first(rest(seq(sequence))) :
    void(0);
};
exports.second = second;

var third = function third(sequence) {
  return isNil(sequence) ?
    void(0) :
  isList(sequence) ?
    first(rest(rest(sequence))) :
  (isVector(sequence)) || (isString(sequence)) ?
    (sequence || 0)[2] :
  isLazySeq(sequence) ?
    third(lazySeqValue(sequence)) :
  "else" ?
    second(rest(seq(sequence))) :
    void(0);
};
exports.third = third;

var rest = function rest(sequence) {
  return isNil(sequence) ?
    list() :
  isList(sequence) ?
    sequence.tail :
  (isVector(sequence)) || (isString(sequence)) ?
    sequence.slice(1) :
  isLazySeq(sequence) ?
    rest(lazySeqValue(sequence)) :
  "else" ?
    rest(seq(sequence)) :
    void(0);
};
exports.rest = rest;

var lastOfList = function lastOfList(list) {
  return (function loop(item, items) {
    var recur = loop;
    while (recur === loop) {
      recur = isEmpty(items) ?
      item :
      (item = first(items), items = rest(items), loop);
    };
    return recur;
  })(first(list), rest(list));
};

var last = function last(sequence) {
  return (isVector(sequence)) || (isString(sequence)) ?
    (sequence || 0)[dec(count(sequence))] :
  isList(sequence) ?
    lastOfList(sequence) :
  isNil(sequence) ?
    void(0) :
  isLazySeq(sequence) ?
    last(lazySeqValue(sequence)) :
  "else" ?
    last(seq(sequence)) :
    void(0);
};
exports.last = last;

var butlast = function butlast(sequence) {
  var items = isNil(sequence) ?
    void(0) :
  isString(sequence) ?
    subs(sequence, 0, dec(count(sequence))) :
  isVector(sequence) ?
    sequence.slice(0, dec(count(sequence))) :
  isList(sequence) ?
    list.apply(list, butlast(vec(sequence))) :
  isLazySeq(sequence) ?
    butlast(lazySeqValue(sequence)) :
  "else" ?
    butlast(seq(sequence)) :
    void(0);
  return !((isNil(items)) || (isEmpty(items))) ?
    items :
    void(0);
};
exports.butlast = butlast;

var take = function take(n, sequence) {
  return isNil(sequence) ?
    list() :
  isVector(sequence) ?
    takeFromVector(n, sequence) :
  isList(sequence) ?
    takeFromList(n, sequence) :
  isLazySeq(sequence) ?
    take(n, lazySeqValue(sequence)) :
  "else" ?
    take(n, seq(sequence)) :
    void(0);
};
exports.take = take;

var takeVectorWhile = function takeVectorWhile(predicate, vector) {
  return (function loop(result, tail, head) {
    var recur = loop;
    while (recur === loop) {
      recur = (!(isEmpty(tail))) && (predicate(head)) ?
      (result = conj(result, head), tail = rest(tail), head = first(tail), loop) :
      result;
    };
    return recur;
  })([], vector, first(vector));
};

var takeListWhile = function takeListWhile(predicate, items) {
  return (function loop(result, tail, head) {
    var recur = loop;
    while (recur === loop) {
      recur = (!(isEmpty(tail))) && (isPredicate(head)) ?
      (result = conj(result, head), tail = rest(tail), head = first(tail), loop) :
      list.apply(list, result);
    };
    return recur;
  })([], items, first(items));
};

var takeWhile = function takeWhile(predicate, sequence) {
  return isNil(sequence) ?
    list() :
  isVector(sequence) ?
    takeVectorWhile(predicate, sequence) :
  isList(sequence) ?
    takeVectorWhile(predicate, sequence) :
  "else" ?
    takeWhile(predicate, lazySeqValue(sequence)) :
    void(0);
};
exports.takeWhile = takeWhile;

var takeFromVector = function takeFromVector(n, vector) {
  return vector.slice(0, n);
};

var takeFromList = function takeFromList(n, sequence) {
  return (function loop(taken, items, n) {
    var recur = loop;
    while (recur === loop) {
      recur = (n === 0) || (isEmpty(items)) ?
      reverse(taken) :
      (taken = cons(first(items), taken), items = rest(items), n = dec(n), loop);
    };
    return recur;
  })(list(), sequence, n);
};

var dropFromList = function dropFromList(n, sequence) {
  return (function loop(left, items) {
    var recur = loop;
    while (recur === loop) {
      recur = (left < 1) || (isEmpty(items)) ?
      items :
      (left = dec(left), items = rest(items), loop);
    };
    return recur;
  })(n, sequence);
};

var drop = function drop(n, sequence) {
  return n <= 0 ?
    sequence :
  isString(sequence) ?
    sequence.substr(n) :
  isVector(sequence) ?
    sequence.slice(n) :
  isList(sequence) ?
    dropFromList(n, sequence) :
  isNil(sequence) ?
    list() :
  isLazySeq(sequence) ?
    drop(n, lazySeqValue(sequence)) :
  "else" ?
    drop(n, seq(sequence)) :
    void(0);
};
exports.drop = drop;

var conjList = function conjList(sequence, items) {
  return reduce(function(result, item) {
    return cons(item, result);
  }, sequence, items);
};

var conj = function conj(sequence) {
  var items = Array.prototype.slice.call(arguments, 1);
  return isVector(sequence) ?
    sequence.concat(items) :
  isString(sequence) ?
    "" + sequence + (str.apply(str, items)) :
  isNil(sequence) ?
    list.apply(list, reverse(items)) :
  (isList(sequence)) || (isLazySeq()) ?
    conjList(sequence, items) :
  isDictionary(sequence) ?
    merge(sequence, merge.apply(merge, items)) :
  "else" ?
    (function() { throw TypeError("" + "Type can't be conjoined " + sequence); })() :
    void(0);
};
exports.conj = conj;

var assoc = function assoc(source) {
  var keyValues = Array.prototype.slice.call(arguments, 1);
  return conj(source, dictionary.apply(dictionary, keyValues));
};
exports.assoc = assoc;

var concat = function concat() {
  var sequences = Array.prototype.slice.call(arguments, 0);
  return reverse(reduce(function(result, sequence) {
    return reduce(function(result, item) {
      return cons(item, result);
    }, result, seq(sequence));
  }, list(), sequences));
};
exports.concat = concat;

var seq = function seq(sequence) {
  return isNil(sequence) ?
    void(0) :
  (isVector(sequence)) || (isList(sequence)) || (isLazySeq(sequence)) ?
    sequence :
  isString(sequence) ?
    Array.prototype.slice.call(sequence) :
  isDictionary(sequence) ?
    keyValues(sequence) :
  "default" ?
    (function() { throw TypeError("" + "Can not seq " + sequence); })() :
    void(0);
};
exports.seq = seq;

var isSeq = function isSeq(sequence) {
  return (isList(sequence)) || (isLazySeq(sequence));
};
exports.isSeq = isSeq;

var listToVector = function listToVector(source) {
  return (function loop(result, list) {
    var recur = loop;
    while (recur === loop) {
      recur = isEmpty(list) ?
      result :
      (result = (function() {
        result.push(first(list));
        return result;
      })(), list = rest(list), loop);
    };
    return recur;
  })([], source);
};

var vec = function vec(sequence) {
  return isNil(sequence) ?
    [] :
  isVector(sequence) ?
    sequence :
  isList(sequence) ?
    listToVector(sequence) :
  "else" ?
    vec(seq(sequence)) :
    void(0);
};
exports.vec = vec;

var sort = function sort(f, items) {
  var hasComparator = isFn(f);
  var items = (!(hasComparator)) && (isNil(items)) ?
    f :
    items;
  var compare = hasComparator ?
    function(a, b) {
      return f(a, b) ?
        0 :
        1;
    } :
    void(0);
  return isNil(items) ?
    list() :
  isVector(items) ?
    items.sort(compare) :
  isList(items) ?
    list.apply(list, vec(items).sort(compare)) :
  isDictionary(items) ?
    seq(items).sort(compare) :
  "else" ?
    sort(f, seq(items)) :
    void(0);
};
exports.sort = sort;

var repeat = function repeat(n, x) {
  return (function loop(n, result) {
    var recur = loop;
    while (recur === loop) {
      recur = n <= 0 ?
      result :
      (n = dec(n), result = conj(result, x), loop);
    };
    return recur;
  })(n, []);
};
exports.repeat = repeat
},{"./runtime":2}],4:[function(require,module,exports){
var _ns_ = {
  "id": "wisp.reader",
  "doc": "Reader module provides functions for reading text input\n  as wisp data structures"
};
var wisp_sequence = require("./sequence");
var list = wisp_sequence.list;
var isList = wisp_sequence.isList;
var count = wisp_sequence.count;
var isEmpty = wisp_sequence.isEmpty;
var first = wisp_sequence.first;
var second = wisp_sequence.second;
var third = wisp_sequence.third;
var rest = wisp_sequence.rest;
var map = wisp_sequence.map;
var vec = wisp_sequence.vec;
var cons = wisp_sequence.cons;
var conj = wisp_sequence.conj;
var concat = wisp_sequence.concat;
var last = wisp_sequence.last;
var butlast = wisp_sequence.butlast;
var sort = wisp_sequence.sort;
var lazySeq = wisp_sequence.lazySeq;;
var wisp_runtime = require("./runtime");
var isOdd = wisp_runtime.isOdd;
var dictionary = wisp_runtime.dictionary;
var keys = wisp_runtime.keys;
var isNil = wisp_runtime.isNil;
var inc = wisp_runtime.inc;
var dec = wisp_runtime.dec;
var isVector = wisp_runtime.isVector;
var isString = wisp_runtime.isString;
var isNumber = wisp_runtime.isNumber;
var isBoolean = wisp_runtime.isBoolean;
var isObject = wisp_runtime.isObject;
var isDictionary = wisp_runtime.isDictionary;
var rePattern = wisp_runtime.rePattern;
var reMatches = wisp_runtime.reMatches;
var reFind = wisp_runtime.reFind;
var str = wisp_runtime.str;
var subs = wisp_runtime.subs;
var char = wisp_runtime.char;
var vals = wisp_runtime.vals;
var isEqual = wisp_runtime.isEqual;;
var wisp_ast = require("./ast");
var isSymbol = wisp_ast.isSymbol;
var symbol = wisp_ast.symbol;
var isKeyword = wisp_ast.isKeyword;
var keyword = wisp_ast.keyword;
var meta = wisp_ast.meta;
var withMeta = wisp_ast.withMeta;
var name = wisp_ast.name;
var gensym = wisp_ast.gensym;;
var wisp_string = require("./string");
var split = wisp_string.split;
var join = wisp_string.join;;;

var pushBackReader = function pushBackReader(source, uri) {
  return {
    "lines": split(source, "\n"),
    "buffer": "",
    "uri": uri,
    "column": -1,
    "line": 0
  };
};
exports.pushBackReader = pushBackReader;

var peekChar = function peekChar(reader) {
  var line = ((reader || 0)["lines"])[(reader || 0)["line"]];
  var column = inc((reader || 0)["column"]);
  return isNil(line) ?
    void(0) :
    (line[column]) || "\n";
};
exports.peekChar = peekChar;

var readChar = function readChar(reader) {
  var ch = peekChar(reader);
  isNewline(peekChar(reader)) ?
    (function() {
      (reader || 0)["line"] = inc((reader || 0)["line"]);
      return (reader || 0)["column"] = -1;
    })() :
    (reader || 0)["column"] = inc((reader || 0)["column"]);
  return ch;
};
exports.readChar = readChar;

var isNewline = function isNewline(ch) {
  return "\n" === ch;
};
exports.isNewline = isNewline;

var isBreakingWhitespace = function isBreakingWhitespace(ch) {
  return (ch === " ") || (ch === "\t") || (ch === "\n") || (ch === "\r");
};
exports.isBreakingWhitespace = isBreakingWhitespace;

var isWhitespace = function isWhitespace(ch) {
  return (isBreakingWhitespace(ch)) || ("," === ch);
};
exports.isWhitespace = isWhitespace;

var isNumeric = function isNumeric(ch) {
  return (ch === "0") || (ch === "1") || (ch === "2") || (ch === "3") || (ch === "4") || (ch === "5") || (ch === "6") || (ch === "7") || (ch === "8") || (ch === "9");
};
exports.isNumeric = isNumeric;

var isCommentPrefix = function isCommentPrefix(ch) {
  return ";" === ch;
};
exports.isCommentPrefix = isCommentPrefix;

var isNumberLiteral = function isNumberLiteral(reader, initch) {
  return (isNumeric(initch)) || ((("+" === initch) || ("-" === initch)) && (isNumeric(peekChar(reader))));
};
exports.isNumberLiteral = isNumberLiteral;

var readerError = function readerError(reader, message) {
  var text = "" + message + "\n" + "line:" + ((reader || 0)["line"]) + "\n" + "column:" + ((reader || 0)["column"]);
  var error = SyntaxError(text, (reader || 0)["uri"]);
  error.line = (reader || 0)["line"];
  error.column = (reader || 0)["column"];
  error.uri = (reader || 0)["uri"];
  return (function() { throw error; })();
};
exports.readerError = readerError;

var isMacroTerminating = function isMacroTerminating(ch) {
  return (!(ch === "#")) && (!(ch === "'")) && (!(ch === ":")) && (macros(ch));
};
exports.isMacroTerminating = isMacroTerminating;

var readToken = function readToken(reader, initch) {
  return (function loop(buffer, ch) {
    var recur = loop;
    while (recur === loop) {
      recur = (isNil(ch)) || (isWhitespace(ch)) || (isMacroTerminating(ch)) ?
      buffer :
      (buffer = "" + buffer + (readChar(reader)), ch = peekChar(reader), loop);
    };
    return recur;
  })(initch, peekChar(reader));
};
exports.readToken = readToken;

var skipLine = function skipLine(reader, _) {
  return (function loop() {
    var recur = loop;
    while (recur === loop) {
      recur = (function() {
      var ch = readChar(reader);
      return (ch === "\n") || (ch === "\r") || (isNil(ch)) ?
        reader :
        (loop);
    })();
    };
    return recur;
  })();
};
exports.skipLine = skipLine;

var intPattern = rePattern("^([-+]?)(?:(0)|([1-9][0-9]*)|0[xX]([0-9A-Fa-f]+)|0([0-7]+)|([1-9][0-9]?)[rR]([0-9A-Za-z]+)|0[0-9]+)(N)?$");
exports.intPattern = intPattern;

var ratioPattern = rePattern("([-+]?[0-9]+)/([0-9]+)");
exports.ratioPattern = ratioPattern;

var floatPattern = rePattern("([-+]?[0-9]+(\\.[0-9]*)?([eE][-+]?[0-9]+)?)(M)?");
exports.floatPattern = floatPattern;

var matchInt = function matchInt(s) {
  var groups = reFind(intPattern, s);
  var group3 = groups[2];
  return !((isNil(group3)) || (count(group3) < 1)) ?
    0 :
    (function() {
      var negate = "-" === groups[1] ?
        -1 :
        1;
      var a = groups[3] ?
        [groups[3], 10] :
      groups[4] ?
        [groups[4], 16] :
      groups[5] ?
        [groups[5], 8] :
      groups[7] ?
        [groups[7], parseInt(groups[7])] :
      "else" ?
        [void(0), void(0)] :
        void(0);
      var n = a[0];
      var radix = a[1];
      return isNil(n) ?
        void(0) :
        negate * (parseInt(n, radix));
    })();
};
exports.matchInt = matchInt;

var matchRatio = function matchRatio(s) {
  var groups = reFind(ratioPattern, s);
  var numinator = groups[1];
  var denominator = groups[2];
  return (parseInt(numinator)) / (parseInt(denominator));
};
exports.matchRatio = matchRatio;

var matchFloat = function matchFloat(s) {
  return parseFloat(s);
};
exports.matchFloat = matchFloat;

var matchNumber = function matchNumber(s) {
  return reMatches(intPattern, s) ?
    matchInt(s) :
  reMatches(ratioPattern, s) ?
    matchRatio(s) :
  reMatches(floatPattern, s) ?
    matchFloat(s) :
    void(0);
};
exports.matchNumber = matchNumber;

var escapeCharMap = function escapeCharMap(c) {
  return c === "t" ?
    "\t" :
  c === "r" ?
    "\r" :
  c === "n" ?
    "\n" :
  c === "\\" ?
    "\\" :
  c === "\"" ?
    "\"" :
  c === "b" ?
    "" :
  c === "f" ?
    "" :
  "else" ?
    void(0) :
    void(0);
};
exports.escapeCharMap = escapeCharMap;

var read2Chars = function read2Chars(reader) {
  return "" + (readChar(reader)) + (readChar(reader));
};
exports.read2Chars = read2Chars;

var read4Chars = function read4Chars(reader) {
  return "" + (readChar(reader)) + (readChar(reader)) + (readChar(reader)) + (readChar(reader));
};
exports.read4Chars = read4Chars;

var unicode2Pattern = rePattern("[0-9A-Fa-f]{2}");
exports.unicode2Pattern = unicode2Pattern;

var unicode4Pattern = rePattern("[0-9A-Fa-f]{4}");
exports.unicode4Pattern = unicode4Pattern;

var validateUnicodeEscape = function validateUnicodeEscape(unicodePattern, reader, escapeChar, unicodeStr) {
  return reMatches(unicodePattern, unicodeStr) ?
    unicodeStr :
    readerError(reader, "" + "Unexpected unicode escape " + "\\" + escapeChar + unicodeStr);
};
exports.validateUnicodeEscape = validateUnicodeEscape;

var makeUnicodeChar = function makeUnicodeChar(codeStr, base) {
  var base = base || 16;
  var code = parseInt(codeStr, base);
  return char(code);
};
exports.makeUnicodeChar = makeUnicodeChar;

var escapeChar = function escapeChar(buffer, reader) {
  var ch = readChar(reader);
  var mapresult = escapeCharMap(ch);
  return mapresult ?
    mapresult :
  ch === "x" ?
    makeUnicodeChar(validateUnicodeEscape(unicode2Pattern, reader, ch, read2Chars(reader))) :
  ch === "u" ?
    makeUnicodeChar(validateUnicodeEscape(unicode4Pattern, reader, ch, read4Chars(reader))) :
  isNumeric(ch) ?
    char(ch) :
  "else" ?
    readerError(reader, "" + "Unexpected unicode escape " + "\\" + ch) :
    void(0);
};
exports.escapeChar = escapeChar;

var readPast = function readPast(predicate, reader) {
  return (function loop(_) {
    var recur = loop;
    while (recur === loop) {
      recur = predicate(peekChar(reader)) ?
      (_ = readChar(reader), loop) :
      peekChar(reader);
    };
    return recur;
  })(void(0));
};
exports.readPast = readPast;

var readDelimitedList = function readDelimitedList(delim, reader, isRecursive) {
  return (function loop(form) {
    var recur = loop;
    while (recur === loop) {
      recur = (function() {
      var ch = readPast(isWhitespace, reader);
      !(ch) ?
        readerError(reader, "EOF") :
        void(0);
      return delim === ch ?
        (function() {
          readChar(reader);
          return form;
        })() :
        (function() {
          var macro = macros(ch);
          return macro ?
            (function() {
              var result = macro(reader, readChar(reader));
              return (form = result === reader ?
                form :
                conj(form, result), loop);
            })() :
            (function() {
              var o = read(reader, true, void(0), isRecursive);
              return (form = o === reader ?
                form :
                conj(form, o), loop);
            })();
        })();
    })();
    };
    return recur;
  })([]);
};
exports.readDelimitedList = readDelimitedList;

var notImplemented = function notImplemented(reader, ch) {
  return readerError(reader, "" + "Reader for " + ch + " not implemented yet");
};
exports.notImplemented = notImplemented;

var readDispatch = function readDispatch(reader, _) {
  var ch = readChar(reader);
  var dm = dispatchMacros(ch);
  return dm ?
    dm(reader, _) :
    (function() {
      var object = maybeReadTaggedType(reader, ch);
      return object ?
        object :
        readerError(reader, "No dispatch macro for ", ch);
    })();
};
exports.readDispatch = readDispatch;

var readUnmatchedDelimiter = function readUnmatchedDelimiter(rdr, ch) {
  return readerError(rdr, "Unmached delimiter ", ch);
};
exports.readUnmatchedDelimiter = readUnmatchedDelimiter;

var readList = function readList(reader, _) {
  var form = readDelimitedList(")", reader, true);
  return withMeta(list.apply(list, form), meta(form));
};
exports.readList = readList;

var readComment = function readComment(reader, _) {
  return (function loop(buffer, ch) {
    var recur = loop;
    while (recur === loop) {
      recur = (isNil(ch)) || ("\n" === ch) ?
      reader || (list(symbol(void(0), "comment"), buffer)) :
    ("\\" === ch) ?
      (buffer = "" + buffer + (escapeChar(buffer, reader)), ch = readChar(reader), loop) :
    "else" ?
      (buffer = "" + buffer + ch, ch = readChar(reader), loop) :
      void(0);
    };
    return recur;
  })("", readChar(reader));
};
exports.readComment = readComment;

var readVector = function readVector(reader) {
  return readDelimitedList("]", reader, true);
};
exports.readVector = readVector;

var readMap = function readMap(reader) {
  var form = readDelimitedList("}", reader, true);
  return isOdd(count(form)) ?
    readerError(reader, "Map literal must contain an even number of forms") :
    withMeta(dictionary.apply(dictionary, form), meta(form));
};
exports.readMap = readMap;

var readSet = function readSet(reader, _) {
  var form = readDelimitedList("}", reader, true);
  return withMeta(concat([symbol(void(0), "set")], form), meta(form));
};
exports.readSet = readSet;

var readNumber = function readNumber(reader, initch) {
  return (function loop(buffer, ch) {
    var recur = loop;
    while (recur === loop) {
      recur = (isNil(ch)) || (isWhitespace(ch)) || (macros(ch)) ?
      (function() {
        var match = matchNumber(buffer);
        return isNil(match) ?
          readerError(reader, "Invalid number format [", buffer, "]") :
          match;
      })() :
      (buffer = "" + buffer + (readChar(reader)), ch = peekChar(reader), loop);
    };
    return recur;
  })(initch, peekChar(reader));
};
exports.readNumber = readNumber;

var readString = function readString(reader) {
  return (function loop(buffer, ch) {
    var recur = loop;
    while (recur === loop) {
      recur = isNil(ch) ?
      readerError(reader, "EOF while reading string") :
    "\\" === ch ?
      (buffer = "" + buffer + (escapeChar(buffer, reader)), ch = readChar(reader), loop) :
    "\"" === ch ?
      buffer :
    "default" ?
      (buffer = "" + buffer + ch, ch = readChar(reader), loop) :
      void(0);
    };
    return recur;
  })("", readChar(reader));
};
exports.readString = readString;

var readUnquote = function readUnquote(reader) {
  var ch = peekChar(reader);
  return !(ch) ?
    readerError(reader, "EOF while reading character") :
  ch === "@" ?
    (function() {
      readChar(reader);
      return list(symbol(void(0), "unquote-splicing"), read(reader, true, void(0), true));
    })() :
    list(symbol(void(0), "unquote"), read(reader, true, void(0), true));
};
exports.readUnquote = readUnquote;

var specialSymbols = function specialSymbols(text, notFound) {
  return text === "nil" ?
    void(0) :
  text === "true" ?
    true :
  text === "false" ?
    false :
  "else" ?
    notFound :
    void(0);
};
exports.specialSymbols = specialSymbols;

var readSymbol = function readSymbol(reader, initch) {
  var token = readToken(reader, initch);
  var parts = split(token, "/");
  var hasNs = (count(parts) > 1) && (count(token) > 1);
  var ns = first(parts);
  var name = join("/", rest(parts));
  return hasNs ?
    symbol(ns, name) :
    specialSymbols(token, symbol(token));
};
exports.readSymbol = readSymbol;

var readKeyword = function readKeyword(reader, initch) {
  var token = readToken(reader, readChar(reader));
  var parts = split(token, "/");
  var name = last(parts);
  var ns = count(parts) > 1 ?
    join("/", butlast(parts)) :
    void(0);
  var issue = last(ns) === ":" ?
    "namespace can't ends with \":\"" :
  last(name) === ":" ?
    "name can't end with \":\"" :
  last(name) === "/" ?
    "name can't end with \"/\"" :
  count(split(token, "::")) > 1 ?
    "name can't contain \"::\"" :
    void(0);
  return issue ?
    readerError(reader, "Invalid token (", issue, "): ", token) :
  (!(ns)) && (first(name) === ":") ?
    keyword(rest(name)) :
    keyword(ns, name);
};
exports.readKeyword = readKeyword;

var desugarMeta = function desugarMeta(f) {
  return isKeyword(f) ?
    dictionary(name(f), true) :
  isSymbol(f) ?
    {
      "tag": f
    } :
  isString(f) ?
    {
      "tag": f
    } :
  "else" ?
    f :
    void(0);
};
exports.desugarMeta = desugarMeta;

var wrappingReader = function wrappingReader(prefix) {
  return function(reader) {
    return list(prefix, read(reader, true, void(0), true));
  };
};
exports.wrappingReader = wrappingReader;

var throwingReader = function throwingReader(msg) {
  return function(reader) {
    return readerError(reader, msg);
  };
};
exports.throwingReader = throwingReader;

var readMeta = function readMeta(reader, _) {
  var metadata = desugarMeta(read(reader, true, void(0), true));
  !(isDictionary(metadata)) ?
    readerError(reader, "Metadata must be Symbol, Keyword, String or Map") :
    void(0);
  return (function() {
    var form = read(reader, true, void(0), true);
    return isObject(form) ?
      withMeta(form, conj(metadata, meta(form))) :
      form;
  })();
};
exports.readMeta = readMeta;

var readRegex = function readRegex(reader) {
  return (function loop(buffer, ch) {
    var recur = loop;
    while (recur === loop) {
      recur = isNil(ch) ?
      readerError(reader, "EOF while reading string") :
    "\\" === ch ?
      (buffer = "" + buffer + ch + (readChar(reader)), ch = readChar(reader), loop) :
    "\"" === ch ?
      rePattern(buffer) :
    "default" ?
      (buffer = "" + buffer + ch, ch = readChar(reader), loop) :
      void(0);
    };
    return recur;
  })("", readChar(reader));
};
exports.readRegex = readRegex;

var readParam = function readParam(reader, initch) {
  var form = readSymbol(reader, initch);
  return isEqual(form, symbol("%")) ?
    symbol("%1") :
    form;
};
exports.readParam = readParam;

var isParam = function isParam(form) {
  return (isSymbol(form)) && ("%" === first(name(form)));
};
exports.isParam = isParam;

var lambdaParamsHash = function lambdaParamsHash(form) {
  return isParam(form) ?
    dictionary(form, form) :
  (isDictionary(form)) || (isVector(form)) || (isList(form)) ?
    conj.apply(conj, map(lambdaParamsHash, vec(form))) :
  "else" ?
    {} :
    void(0);
};
exports.lambdaParamsHash = lambdaParamsHash;

var lambdaParams = function lambdaParams(body) {
  var names = sort(vals(lambdaParamsHash(body)));
  var variadic = isEqual(first(names), symbol("%&"));
  var n = variadic && (count(names) === 1) ?
    0 :
    parseInt(rest(name(last(names))));
  var params = (function loop(names, i) {
    var recur = loop;
    while (recur === loop) {
      recur = i <= n ?
      (names = conj(names, symbol("" + "%" + i)), i = inc(i), loop) :
      names;
    };
    return recur;
  })([], 1);
  return variadic ?
    conj(params, symbol(void(0), "&"), symbol(void(0), "%&")) :
    names;
};
exports.lambdaParams = lambdaParams;

var readLambda = function readLambda(reader) {
  var body = readList(reader);
  return list(symbol(void(0), "fn"), lambdaParams(body), body);
};
exports.readLambda = readLambda;

var readDiscard = function readDiscard(reader, _) {
  read(reader, true, void(0), true);
  return reader;
};
exports.readDiscard = readDiscard;

var macros = function macros(c) {
  return c === "\"" ?
    readString :
  c === ":" ?
    readKeyword :
  c === ";" ?
    readComment :
  c === "'" ?
    wrappingReader(symbol(void(0), "quote")) :
  c === "@" ?
    wrappingReader(symbol(void(0), "deref")) :
  c === "^" ?
    readMeta :
  c === "`" ?
    wrappingReader(symbol(void(0), "syntax-quote")) :
  c === "~" ?
    readUnquote :
  c === "(" ?
    readList :
  c === ")" ?
    readUnmatchedDelimiter :
  c === "[" ?
    readVector :
  c === "]" ?
    readUnmatchedDelimiter :
  c === "{" ?
    readMap :
  c === "}" ?
    readUnmatchedDelimiter :
  c === "\\" ?
    readChar :
  c === "%" ?
    readParam :
  c === "#" ?
    readDispatch :
  "else" ?
    void(0) :
    void(0);
};
exports.macros = macros;

var dispatchMacros = function dispatchMacros(s) {
  return s === "{" ?
    readSet :
  s === "(" ?
    readLambda :
  s === "<" ?
    throwingReader("Unreadable form") :
  s === "\"" ?
    readRegex :
  s === "!" ?
    readComment :
  s === "_" ?
    readDiscard :
  "else" ?
    void(0) :
    void(0);
};
exports.dispatchMacros = dispatchMacros;

var readForm = function readForm(reader, ch) {
  var start = {
    "line": (reader || 0)["line"],
    "column": (reader || 0)["column"]
  };
  var readMacro = macros(ch);
  var form = readMacro ?
    readMacro(reader, ch) :
  isNumberLiteral(reader, ch) ?
    readNumber(reader, ch) :
  "else" ?
    readSymbol(reader, ch) :
    void(0);
  return form === reader ?
    form :
  !((isString(form)) || (isNumber(form)) || (isBoolean(form)) || (isNil(form)) || (isKeyword(form))) ?
    withMeta(form, conj({
      "start": start,
      "end": {
        "line": (reader || 0)["line"],
        "column": (reader || 0)["column"]
      }
    }, meta(form))) :
  "else" ?
    form :
    void(0);
};
exports.readForm = readForm;

var read = function read(reader, eofIsError, sentinel, isRecursive) {
  return (function loop() {
    var recur = loop;
    while (recur === loop) {
      recur = (function() {
      var ch = readChar(reader);
      var form = isNil(ch) ?
        eofIsError ?
          readerError(reader, "EOF") :
          sentinel :
      isWhitespace(ch) ?
        reader :
      isCommentPrefix(ch) ?
        read(readComment(reader, ch), eofIsError, sentinel, isRecursive) :
      "else" ?
        readForm(reader, ch) :
        void(0);
      return form === reader ?
        (loop) :
        form;
    })();
    };
    return recur;
  })();
};
exports.read = read;

var read_ = function read_(source, uri) {
  var reader = pushBackReader(source, uri);
  var eof = gensym();
  return (function loop(forms, form) {
    var recur = loop;
    while (recur === loop) {
      recur = form === eof ?
      forms :
      (forms = conj(forms, form), form = read(reader, false, eof, false), loop);
    };
    return recur;
  })([], read(reader, false, eof, false));
};
exports.read_ = read_;

var readFromString = function readFromString(source, uri) {
  var reader = pushBackReader(source, uri);
  return read(reader, true, void(0), false);
};
exports.readFromString = readFromString;

var readUuid = function readUuid(uuid) {
  return isString(uuid) ?
    list(symbol(void(0), "UUID."), uuid) :
    readerError(void(0), "UUID literal expects a string as its representation.");
};

var readQueue = function readQueue(items) {
  return isVector(items) ?
    list(symbol(void(0), "PersistentQueue."), items) :
    readerError(void(0), "Queue literal expects a vector for its elements.");
};

var __tagTable__ = dictionary("uuid", readUuid, "queue", readQueue);
exports.__tagTable__ = __tagTable__;

var maybeReadTaggedType = function maybeReadTaggedType(reader, initch) {
  var tag = readSymbol(reader, initch);
  var pfn = (__tagTable__ || 0)[name(tag)];
  return pfn ?
    pfn(read(reader, true, void(0), false)) :
    readerError(reader, "" + "Could not find tag parser for " + (name(tag)) + " in " + ("" + (keys(__tagTable__))));
};
exports.maybeReadTaggedType = maybeReadTaggedType
},{"./sequence":3,"./runtime":2,"./ast":6,"./string":7}],5:[function(require,module,exports){
var _ns_ = {
  "id": "wisp.compiler",
  "doc": "wisp language compiler"
};
var wisp_reader = require("./reader");
var readFromString = wisp_reader.readFromString;;
var wisp_ast = require("./ast");
var meta = wisp_ast.meta;
var withMeta = wisp_ast.withMeta;
var isSymbol = wisp_ast.isSymbol;
var symbol = wisp_ast.symbol;
var isKeyword = wisp_ast.isKeyword;
var keyword = wisp_ast.keyword;
var namespace = wisp_ast.namespace;
var isUnquote = wisp_ast.isUnquote;
var isUnquoteSplicing = wisp_ast.isUnquoteSplicing;
var isQuote = wisp_ast.isQuote;
var isSyntaxQuote = wisp_ast.isSyntaxQuote;
var name = wisp_ast.name;
var gensym = wisp_ast.gensym;
var prStr = wisp_ast.prStr;;
var wisp_sequence = require("./sequence");
var isEmpty = wisp_sequence.isEmpty;
var count = wisp_sequence.count;
var isList = wisp_sequence.isList;
var list = wisp_sequence.list;
var first = wisp_sequence.first;
var second = wisp_sequence.second;
var third = wisp_sequence.third;
var rest = wisp_sequence.rest;
var cons = wisp_sequence.cons;
var conj = wisp_sequence.conj;
var reverse = wisp_sequence.reverse;
var reduce = wisp_sequence.reduce;
var vec = wisp_sequence.vec;
var last = wisp_sequence.last;
var repeat = wisp_sequence.repeat;
var map = wisp_sequence.map;
var filter = wisp_sequence.filter;
var take = wisp_sequence.take;
var concat = wisp_sequence.concat;
var isSeq = wisp_sequence.isSeq;;
var wisp_runtime = require("./runtime");
var isOdd = wisp_runtime.isOdd;
var isDictionary = wisp_runtime.isDictionary;
var dictionary = wisp_runtime.dictionary;
var merge = wisp_runtime.merge;
var keys = wisp_runtime.keys;
var vals = wisp_runtime.vals;
var isContainsVector = wisp_runtime.isContainsVector;
var mapDictionary = wisp_runtime.mapDictionary;
var isString = wisp_runtime.isString;
var isNumber = wisp_runtime.isNumber;
var isVector = wisp_runtime.isVector;
var isBoolean = wisp_runtime.isBoolean;
var subs = wisp_runtime.subs;
var reFind = wisp_runtime.reFind;
var isTrue = wisp_runtime.isTrue;
var isFalse = wisp_runtime.isFalse;
var isNil = wisp_runtime.isNil;
var isRePattern = wisp_runtime.isRePattern;
var inc = wisp_runtime.inc;
var dec = wisp_runtime.dec;
var str = wisp_runtime.str;
var char = wisp_runtime.char;
var int = wisp_runtime.int;
var isEqual = wisp_runtime.isEqual;
var isStrictEqual = wisp_runtime.isStrictEqual;;
var wisp_string = require("./string");
var split = wisp_string.split;
var join = wisp_string.join;
var upperCase = wisp_string.upperCase;
var replace = wisp_string.replace;;
var wisp_backend_javascript_writer = require("./backend/javascript/writer");
var writeReference = wisp_backend_javascript_writer.writeReference;
var writeKeywordReference = wisp_backend_javascript_writer.writeKeywordReference;
var writeKeyword = wisp_backend_javascript_writer.writeKeyword;
var writeSymbol = wisp_backend_javascript_writer.writeSymbol;
var writeNil = wisp_backend_javascript_writer.writeNil;
var writeComment = wisp_backend_javascript_writer.writeComment;
var writeNumber = wisp_backend_javascript_writer.writeNumber;
var writeString = wisp_backend_javascript_writer.writeString;
var writeBoolean = wisp_backend_javascript_writer.writeBoolean;;;

var isSelfEvaluating = function isSelfEvaluating(form) {
  return (isNumber(form)) || ((isString(form)) && (!(isSymbol(form))) && (!(isKeyword(form)))) || (isBoolean(form)) || (isNil(form)) || (isRePattern(form));
};
exports.isSelfEvaluating = isSelfEvaluating;

var __macros__ = {};
exports.__macros__ = __macros__;

var executeMacro = function executeMacro(name, form) {
  return (__macros__ || 0)[name].apply((__macros__ || 0)[name], vec(form));
};
exports.executeMacro = executeMacro;

var installMacro = function installMacro(name, macroFn) {
  return (__macros__ || 0)[name] = macroFn;
};
exports.installMacro = installMacro;

var isMacro = function isMacro(name) {
  return (isSymbol(name)) && ((__macros__ || 0)[name]) && true;
};
exports.isMacro = isMacro;

var makeMacro = function makeMacro(pattern, body) {
  var macroFn = concat(list(symbol(void(0), "fn"), pattern), body);
  return eval("" + "(" + (compile(macroexpand(macroFn))) + ")");
};
exports.makeMacro = makeMacro;

installMacro(symbol(void(0), "defmacro"), function(name, signature) {
  var body = Array.prototype.slice.call(arguments, 2);
  return installMacro(name, makeMacro(signature, body));
});

var __specials__ = {};
exports.__specials__ = __specials__;

var installSpecial = function installSpecial(name, f, validator) {
  return (__specials__ || 0)[name] = function(form) {
    validator ?
      validator(form) :
      void(0);
    return f(withMeta(rest(form), meta(form)));
  };
};
exports.installSpecial = installSpecial;

var isSpecial = function isSpecial(name) {
  return (isSymbol(name)) && ((__specials__ || 0)[name]) && true;
};
exports.isSpecial = isSpecial;

var executeSpecial = function executeSpecial(name, form) {
  return ((__specials__ || 0)[name])(form);
};
exports.executeSpecial = executeSpecial;

var opt = function opt(argument, fallback) {
  return (isNil(argument)) || (isEmpty(argument)) ?
    fallback :
    first(argument);
};
exports.opt = opt;

var applyForm = function applyForm(fnName, form, isQuoted) {
  return cons(fnName, isQuoted ?
    map(function(e) {
      return list(symbol(void(0), "quote"), e);
    }, form) :
    form, form);
};
exports.applyForm = applyForm;

var applyUnquotedForm = function applyUnquotedForm(fnName, form) {
  return cons(fnName, map(function(e) {
    return isUnquote(e) ?
      second(e) :
    (isList(e)) && (isKeyword(first(e))) ?
      list(symbol(void(0), "syntax-quote"), second(e)) :
      list(symbol(void(0), "syntax-quote"), e);
  }, form));
};
exports.applyUnquotedForm = applyUnquotedForm;

var splitSplices = function splitSplices(form, fnName) {
  var makeSplice = function makeSplice(form) {
    return (isSelfEvaluating(form)) || (isSymbol(form)) ?
      applyUnquotedForm(fnName, list(form)) :
      applyUnquotedForm(fnName, form);
  };
  return (function loop(nodes, slices, acc) {
    var recur = loop;
    while (recur === loop) {
      recur = isEmpty(nodes) ?
      reverse(isEmpty(acc) ?
        slices :
        cons(makeSplice(reverse(acc)), slices)) :
      (function() {
        var node = first(nodes);
        return isUnquoteSplicing(node) ?
          (nodes = rest(nodes), slices = cons(second(node), isEmpty(acc) ?
            slices :
            cons(makeSplice(reverse(acc)), slices)), acc = list(), loop) :
          (nodes = rest(nodes), slices = slices, acc = cons(node, acc), loop);
      })();
    };
    return recur;
  })(form, list(), list());
};
exports.splitSplices = splitSplices;

var syntaxQuoteSplit = function syntaxQuoteSplit(appendName, fnName, form) {
  var slices = splitSplices(form, fnName);
  var n = count(slices);
  return n === 0 ?
    list(fnName) :
  n === 1 ?
    first(slices) :
  "default" ?
    applyForm(appendName, slices) :
    void(0);
};
exports.syntaxQuoteSplit = syntaxQuoteSplit;

var compileObject = function compileObject(form, isQuoted) {
  return isKeyword(form) ?
    writeKeyword(form) :
  isSymbol(form) ?
    writeSymbol(form) :
  isNumber(form) ?
    writeNumber(form) :
  isString(form) ?
    writeString(form) :
  isBoolean(form) ?
    writeBoolean(form) :
  isNil(form) ?
    writeNil(form) :
  isRePattern(form) ?
    compileRePattern(form) :
  isVector(form) ?
    compile(applyForm(symbol(void(0), "vector"), list.apply(list, form), isQuoted)) :
  isList(form) ?
    compile(applyForm(symbol(void(0), "list"), form, isQuoted)) :
  isDictionary(form) ?
    compileDictionary(isQuoted ?
      mapDictionary(form, function(x) {
        return list(symbol(void(0), "quote"), x);
      }) :
      form) :
    void(0);
};
exports.compileObject = compileObject;

var compileSyntaxQuotedVector = function compileSyntaxQuotedVector(form) {
  var concatForm = syntaxQuoteSplit(symbol(void(0), "concat"), symbol(void(0), "vector"), list.apply(list, form));
  return compile(count(concatForm) > 1 ?
    list(symbol(void(0), "vec"), concatForm) :
    concatForm);
};
exports.compileSyntaxQuotedVector = compileSyntaxQuotedVector;

var compileSyntaxQuoted = function compileSyntaxQuoted(form) {
  return isList(form) ?
    compile(syntaxQuoteSplit(symbol(void(0), "concat"), symbol(void(0), "list"), form)) :
  isVector(form) ?
    compileSyntaxQuotedVector(form) :
  "else" ?
    compileObject(form) :
    void(0);
};
exports.compileSyntaxQuoted = compileSyntaxQuoted;

var compile = function compile(form) {
  return isSelfEvaluating(form) ?
    compileObject(form) :
  isSymbol(form) ?
    writeReference(form) :
  isKeyword(form) ?
    writeKeywordReference(form) :
  isVector(form) ?
    compileObject(form) :
  isDictionary(form) ?
    compileObject(form) :
  isList(form) ?
    (function() {
      var head = first(form);
      return isEmpty(form) ?
        compileObject(form, true) :
      isQuote(form) ?
        compileObject(second(form), true) :
      isSyntaxQuote(form) ?
        compileSyntaxQuoted(second(form)) :
      isSpecial(head) ?
        executeSpecial(head, form) :
      isKeyword(head) ?
        compile(list(symbol(void(0), "get"), second(form), head)) :
      "else" ?
        (function() {
          return !((isSymbol(head)) || (isList(head))) ?
            (function() { throw compilerError(form, "" + "operator is not a procedure: " + head); })() :
            compileInvoke(form);
        })() :
        void(0);
    })() :
    void(0);
};
exports.compile = compile;

var compile_ = function compile_(forms) {
  return reduce(function(result, form) {
    return "" + result + (isEmpty(result) ?
      "" :
      ";\n\n") + (compile(isList(form) ?
      withMeta(macroexpand(form), conj({
        "top": true
      }, meta(form))) :
      form));
  }, "", forms);
};
exports.compile_ = compile_;

var compileProgram = function compileProgram(forms) {
  return reduce(function(result, form) {
    return "" + result + (isEmpty(result) ?
      "" :
      ";\n\n") + (compile(isList(form) ?
      withMeta(macroexpand(form), conj({
        "top": true
      }, meta(form))) :
      form));
  }, "", forms);
};
exports.compileProgram = compileProgram;

var macroexpand1 = function macroexpand1(form) {
  return isList(form) ?
    (function() {
      var op = first(form);
      var id = isSymbol(op) ?
        name(op) :
        void(0);
      return isSpecial(op) ?
        form :
      isMacro(op) ?
        executeMacro(op, rest(form)) :
      (isSymbol(op)) && (!(id === ".")) ?
        first(id) === "." ?
          count(form) < 2 ?
            (function() { throw Error("Malformed member expression, expecting (.member target ...)"); })() :
            cons(symbol(void(0), "."), cons(second(form), cons(symbol(subs(id, 1)), rest(rest(form))))) :
        last(id) === "." ?
          cons(symbol(void(0), "new"), cons(symbol(subs(id, 0, dec(count(id)))), rest(form))) :
          form :
      "else" ?
        form :
        void(0);
    })() :
    form;
};
exports.macroexpand1 = macroexpand1;

var macroexpand = function macroexpand(form) {
  return (function loop(original, expanded) {
    var recur = loop;
    while (recur === loop) {
      recur = original === expanded ?
      original :
      (original = expanded, expanded = macroexpand1(expanded), loop);
    };
    return recur;
  })(form, macroexpand1(form));
};
exports.macroexpand = macroexpand;

var _lineBreakPattern_ = /\n(?=[^\n])/m;
exports._lineBreakPattern_ = _lineBreakPattern_;

var indent = function indent(code, indentation) {
  return join(indentation, split(code, _lineBreakPattern_));
};
exports.indent = indent;

var compileTemplate = function compileTemplate(form) {
  var indentPattern = /\n *$/;
  var getIndentation = function(code) {
    return (reFind(indentPattern, code)) || "\n";
  };
  return (function loop(code, parts, values) {
    var recur = loop;
    while (recur === loop) {
      recur = count(parts) > 1 ?
      (code = "" + code + (first(parts)) + (indent("" + (first(values)), getIndentation(first(parts)))), parts = rest(parts), values = rest(values), loop) :
      "" + code + (first(parts));
    };
    return recur;
  })("", split(first(form), "~{}"), rest(form));
};
exports.compileTemplate = compileTemplate;

var compileDef = function compileDef(form) {
  var id = first(form);
  var isExport = ((((meta(form)) || {}) || 0)["top"]) && (!((((meta(id)) || {}) || 0)["private"]));
  var attribute = symbol(namespace(id), "" + "-" + (name(id)));
  return isExport ?
    compileTemplate(list("var ~{};\n~{}", compile(cons(symbol(void(0), "set!"), form)), compile(list(symbol(void(0), "set!"), list(symbol(void(0), "."), symbol(void(0), "exports"), attribute), id)))) :
    compileTemplate(list("var ~{}", compile(cons(symbol(void(0), "set!"), form))));
};
exports.compileDef = compileDef;

var compileIfElse = function compileIfElse(form) {
  var condition = macroexpand(first(form));
  var thenExpression = macroexpand(second(form));
  var elseExpression = macroexpand(third(form));
  return compileTemplate(list((isList(elseExpression)) && (isEqual(first(elseExpression), symbol(void(0), "if"))) ?
    "~{} ?\n  ~{} :\n~{}" :
    "~{} ?\n  ~{} :\n  ~{}", compile(condition), compile(thenExpression), compile(elseExpression)));
};
exports.compileIfElse = compileIfElse;

var compileDictionary = function compileDictionary(form) {
  var body = (function loop(body, names) {
    var recur = loop;
    while (recur === loop) {
      recur = isEmpty(names) ?
      body :
      (body = "" + (isNil(body) ?
        "" :
        "" + body + ",\n") + (compileTemplate(list("~{}: ~{}", compile(first(names)), compile(macroexpand((form || 0)[first(names)]))))), names = rest(names), loop);
    };
    return recur;
  })(void(0), keys(form));
  return isNil(body) ?
    "{}" :
    compileTemplate(list("{\n  ~{}\n}", body));
};
exports.compileDictionary = compileDictionary;

var desugarFnName = function desugarFnName(form) {
  return (isSymbol(first(form))) || (isNil(first(form))) ?
    form :
    cons(void(0), form);
};
exports.desugarFnName = desugarFnName;

var desugarFnDoc = function desugarFnDoc(form) {
  return (isString(second(form))) || (isNil(second(form))) ?
    form :
    cons(first(form), cons(void(0), rest(form)));
};
exports.desugarFnDoc = desugarFnDoc;

var desugarFnAttrs = function desugarFnAttrs(form) {
  return (isDictionary(third(form))) || (isNil(third(form))) ?
    form :
    cons(first(form), cons(second(form), cons(void(0), rest(rest(form)))));
};
exports.desugarFnAttrs = desugarFnAttrs;

var compileDesugaredFn = function compileDesugaredFn(name, doc, attrs, params, body) {
  return compileTemplate(isNil(name) ?
    list("function(~{}) {\n  ~{}\n}", join(", ", map(compile, (params || 0)["names"])), compileFnBody(map(macroexpand, body), params)) :
    list("function ~{}(~{}) {\n  ~{}\n}", compile(name), join(", ", map(compile, (params || 0)["names"])), compileFnBody(map(macroexpand, body), params)));
};
exports.compileDesugaredFn = compileDesugaredFn;

var compileStatements = function compileStatements(form, prefix) {
  return (function loop(result, expression, expressions) {
    var recur = loop;
    while (recur === loop) {
      recur = isEmpty(expressions) ?
      "" + result + (isNil(prefix) ?
        "" :
        prefix) + (compile(macroexpand(expression))) + ";" :
      (result = "" + result + (compile(macroexpand(expression))) + ";\n", expression = first(expressions), expressions = rest(expressions), loop);
    };
    return recur;
  })("", first(form), rest(form));
};
exports.compileStatements = compileStatements;

var compileFnBody = function compileFnBody(form, params) {
  return (isDictionary(params)) && ((params || 0)["rest"]) ?
    compileStatements(cons(list(symbol(void(0), "def"), (params || 0)["rest"], list(symbol(void(0), "Array.prototype.slice.call"), symbol(void(0), "arguments"), (params || 0)["arity"])), form), "return ") :
  (count(form) === 1) && (isList(first(form))) && (isEqual(first(first(form)), symbol(void(0), "do"))) ?
    compileFnBody(rest(first(form)), params) :
    compileStatements(form, "return ");
};
exports.compileFnBody = compileFnBody;

var desugarParams = function desugarParams(params) {
  return (function loop(names, params) {
    var recur = loop;
    while (recur === loop) {
      recur = isEmpty(params) ?
      {
        "names": names,
        "arity": count(names),
        "rest": void(0)
      } :
    isEqual(first(params), symbol(void(0), "&")) ?
      isEqual(count(params), 1) ?
        {
          "names": names,
          "arity": count(names),
          "rest": void(0)
        } :
      isEqual(count(params), 2) ?
        {
          "names": names,
          "arity": count(names),
          "rest": second(params)
        } :
      "else" ?
        (function() { throw TypeError("Unexpected number of parameters after &"); })() :
        void(0) :
    "else" ?
      (names = conj(names, first(params)), params = rest(params), loop) :
      void(0);
    };
    return recur;
  })([], params);
};
exports.desugarParams = desugarParams;

var analyzeOverloadedFn = function analyzeOverloadedFn(name, doc, attrs, overloads) {
  return map(function(overload) {
    var params = desugarParams(first(overload));
    return {
      "rest": (params || 0)["rest"],
      "names": (params || 0)["names"],
      "arity": (params || 0)["arity"],
      "body": rest(overload)
    };
  }, overloads);
};
exports.analyzeOverloadedFn = analyzeOverloadedFn;

var compileOverloadedFn = function compileOverloadedFn(name, doc, attrs, overloads) {
  var methods = analyzeOverloadedFn(name, doc, attrs, overloads);
  var fixedMethods = filter(function(method) {
    return !((method || 0)["rest"]);
  }, methods);
  var variadic = first(filter(function(method) {
    return (method || 0)["rest"];
  }, methods));
  var names = reduce(function(names, params) {
    return count(names) > (params || 0)["arity"] ?
      names :
      (params || 0)["names"];
  }, [], methods);
  return list(symbol(void(0), "fn"), name, doc, attrs, names, list(symbol(void(0), "raw*"), compileSwitch(symbol(void(0), "arguments.length"), map(function(method) {
    return cons((method || 0)["arity"], list(symbol(void(0), "raw*"), compileFnBody(concat(compileRebind(names, (method || 0)["names"]), (method || 0)["body"]))));
  }, fixedMethods), isNil(variadic) ?
    list(symbol(void(0), "throw"), list(symbol(void(0), "Error"), "Invalid arity")) :
    list(symbol(void(0), "raw*"), compileFnBody(concat(compileRebind(cons(list(symbol(void(0), "Array.prototype.slice.call"), symbol(void(0), "arguments"), (variadic || 0)["arity"]), names), cons((variadic || 0)["rest"], (variadic || 0)["names"])), (variadic || 0)["body"]))))), void(0));
};
exports.compileOverloadedFn = compileOverloadedFn;

var compileRebind = function compileRebind(bindings, names) {
  return (function loop(form, bindings, names) {
    var recur = loop;
    while (recur === loop) {
      recur = isEmpty(names) ?
      reverse(form) :
      (form = isEqual(first(names), first(bindings)) ?
        form :
        cons(list(symbol(void(0), "def"), first(names), first(bindings)), form), bindings = rest(bindings), names = rest(names), loop);
    };
    return recur;
  })(list(), bindings, names);
};
exports.compileRebind = compileRebind;

var compileSwitchCases = function compileSwitchCases(cases) {
  return reduce(function(form, caseExpression) {
    return "" + form + (compileTemplate(list("case ~{}:\n  ~{}\n", compile(macroexpand(first(caseExpression))), compile(macroexpand(rest(caseExpression))))));
  }, "", cases);
};
exports.compileSwitchCases = compileSwitchCases;

var compileSwitch = function compileSwitch(value, cases, defaultCase) {
  return compileTemplate(list("switch (~{}) {\n  ~{}\n  default:\n    ~{}\n}", compile(macroexpand(value)), compileSwitchCases(cases), compile(macroexpand(defaultCase))));
};
exports.compileSwitch = compileSwitch;

var compileFn = function compileFn(form) {
  var signature = desugarFnAttrs(desugarFnDoc(desugarFnName(form)));
  var name = first(signature);
  var doc = second(signature);
  var attrs = third(signature);
  return isVector(third(rest(signature))) ?
    compileDesugaredFn(name, doc, attrs, desugarParams(third(rest(signature))), rest(rest(rest(rest(signature))))) :
    compile(compileOverloadedFn(name, doc, attrs, rest(rest(rest(signature)))));
};
exports.compileFn = compileFn;

var compileInvoke = function compileInvoke(form) {
  return compileTemplate(list(isList(first(form)) ?
    "(~{})(~{})" :
    "~{}(~{})", compile(first(form)), compileGroup(rest(form))));
};
exports.compileInvoke = compileInvoke;

var compileGroup = function compileGroup(form, wrap) {
  return wrap ?
    "" + "(" + (compileGroup(form)) + ")" :
    join(", ", vec(map(compile, map(macroexpand, form))));
};
exports.compileGroup = compileGroup;

var compileDo = function compileDo(form) {
  return compile(list(cons(symbol(void(0), "fn"), cons([], form))));
};
exports.compileDo = compileDo;

var defineBindings = function defineBindings(form) {
  return (function loop(defs, bindings) {
    var recur = loop;
    while (recur === loop) {
      recur = count(bindings) === 0 ?
      reverse(defs) :
      (defs = cons(list(symbol(void(0), "def"), (bindings || 0)[0], (bindings || 0)[1]), defs), bindings = rest(rest(bindings)), loop);
    };
    return recur;
  })(list(), form);
};
exports.defineBindings = defineBindings;

var compileThrow = function compileThrow(form) {
  return compileTemplate(list("(function() { throw ~{}; })()", compile(macroexpand(first(form)))));
};
exports.compileThrow = compileThrow;

var compileSet = function compileSet(form) {
  return compileTemplate(list("~{} = ~{}", compile(macroexpand(first(form))), compile(macroexpand(second(form)))));
};
exports.compileSet = compileSet;

var compileVector = function compileVector(form) {
  return compileTemplate(list("[~{}]", compileGroup(form)));
};
exports.compileVector = compileVector;

var compileTry = function compileTry(form) {
  return (function loop(tryExprs, catchExprs, finallyExprs, exprs) {
    var recur = loop;
    while (recur === loop) {
      recur = isEmpty(exprs) ?
      isEmpty(catchExprs) ?
        compileTemplate(list("(function() {\ntry {\n  ~{}\n} finally {\n  ~{}\n}})()", compileFnBody(tryExprs), compileFnBody(finallyExprs))) :
      isEmpty(finallyExprs) ?
        compileTemplate(list("(function() {\ntry {\n  ~{}\n} catch (~{}) {\n  ~{}\n}})()", compileFnBody(tryExprs), compile(first(catchExprs)), compileFnBody(rest(catchExprs)))) :
        compileTemplate(list("(function() {\ntry {\n  ~{}\n} catch (~{}) {\n  ~{}\n} finally {\n  ~{}\n}})()", compileFnBody(tryExprs), compile(first(catchExprs)), compileFnBody(rest(catchExprs)), compileFnBody(finallyExprs))) :
    isEqual(first(first(exprs)), symbol(void(0), "catch")) ?
      (tryExprs = tryExprs, catchExprs = rest(first(exprs)), finallyExprs = finallyExprs, exprs = rest(exprs), loop) :
    isEqual(first(first(exprs)), symbol(void(0), "finally")) ?
      (tryExprs = tryExprs, catchExprs = catchExprs, finallyExprs = rest(first(exprs)), exprs = rest(exprs), loop) :
      (tryExprs = cons(first(exprs), tryExprs), catchExprs = catchExprs, finallyExprs = finallyExprs, exprs = rest(exprs), loop);
    };
    return recur;
  })(list(), list(), list(), reverse(form));
};
exports.compileTry = compileTry;

var compileProperty = function compileProperty(form) {
  return (name(second(form)))[0] === "-" ?
    compileTemplate(list(isList(first(form)) ?
      "(~{}).~{}" :
      "~{}.~{}", compile(macroexpand(first(form))), compile(macroexpand(symbol(subs(name(second(form)), 1)))))) :
    compileTemplate(list("~{}.~{}(~{})", compile(macroexpand(first(form))), compile(macroexpand(second(form))), compileGroup(rest(rest(form)))));
};
exports.compileProperty = compileProperty;

var compileApply = function compileApply(form) {
  return compile(list(symbol(void(0), "."), first(form), symbol(void(0), "apply"), first(form), second(form)));
};
exports.compileApply = compileApply;

var compileNew = function compileNew(form) {
  return compileTemplate(list("new ~{}", compile(form)));
};
exports.compileNew = compileNew;

var compileAget = function compileAget(form) {
  var target = macroexpand(first(form));
  var attribute = macroexpand(second(form));
  var notFound = third(form);
  var template = isList(target) ?
    "(~{})[~{}]" :
    "~{}[~{}]";
  return notFound ?
    compile(list(symbol(void(0), "or"), list(symbol(void(0), "get"), first(form), second(form)), macroexpand(notFound))) :
    compileTemplate(list(template, compile(target), compile(attribute)));
};
exports.compileAget = compileAget;

var compileGet = function compileGet(form) {
  return compileAget(cons(list(symbol(void(0), "or"), first(form), 0), rest(form)));
};
exports.compileGet = compileGet;

var compileInstance = function compileInstance(form) {
  return compileTemplate(list("~{} instanceof ~{}", compile(macroexpand(second(form))), compile(macroexpand(first(form)))));
};
exports.compileInstance = compileInstance;

var compileNot = function compileNot(form) {
  return compileTemplate(list("!(~{})", compile(macroexpand(first(form)))));
};
exports.compileNot = compileNot;

var compileLoop = function compileLoop(form) {
  var bindings = (function loop(names, values, tokens) {
    var recur = loop;
    while (recur === loop) {
      recur = isEmpty(tokens) ?
      {
        "names": names,
        "values": values
      } :
      (names = conj(names, first(tokens)), values = conj(values, second(tokens)), tokens = rest(rest(tokens)), loop);
    };
    return recur;
  })([], [], first(form));
  var names = (bindings || 0)["names"];
  var values = (bindings || 0)["values"];
  var body = rest(form);
  return compile(cons(cons(symbol(void(0), "fn"), cons(symbol(void(0), "loop"), cons(names, compileRecur(names, body)))), list.apply(list, values)));
};
exports.compileLoop = compileLoop;

var rebindBindings = function rebindBindings(names, values) {
  return (function loop(result, names, values) {
    var recur = loop;
    while (recur === loop) {
      recur = isEmpty(names) ?
      reverse(result) :
      (result = cons(list(symbol(void(0), "set!"), first(names), first(values)), result), names = rest(names), values = rest(values), loop);
    };
    return recur;
  })(list(), names, values);
};
exports.rebindBindings = rebindBindings;

var expandRecur = function expandRecur(names, body) {
  return map(function(form) {
    return isList(form) ?
      isEqual(first(form), symbol(void(0), "recur")) ?
        list(symbol(void(0), "raw*"), compileGroup(concat(rebindBindings(names, rest(form)), list(symbol(void(0), "loop"))), true)) :
        expandRecur(names, form) :
      form;
  }, body);
};
exports.expandRecur = expandRecur;

var compileRecur = function compileRecur(names, body) {
  return list(list(symbol(void(0), "raw*"), compileTemplate(list("var recur = loop;\nwhile (recur === loop) {\n  recur = ~{}\n}", compileStatements(expandRecur(names, body))))), symbol(void(0), "recur"));
};
exports.compileRecur = compileRecur;

var compileRaw = function compileRaw(form) {
  return first(form);
};
exports.compileRaw = compileRaw;

installSpecial(symbol(void(0), "set!"), compileSet);

installSpecial(symbol(void(0), "get"), compileGet);

installSpecial(symbol(void(0), "aget"), compileAget);

installSpecial(symbol(void(0), "def"), compileDef);

installSpecial(symbol(void(0), "if"), compileIfElse);

installSpecial(symbol(void(0), "do"), compileDo);

installSpecial(symbol(void(0), "do*"), compileStatements);

installSpecial(symbol(void(0), "fn"), compileFn);

installSpecial(symbol(void(0), "throw"), compileThrow);

installSpecial(symbol(void(0), "vector"), compileVector);

installSpecial(symbol(void(0), "try"), compileTry);

installSpecial(symbol(void(0), "."), compileProperty);

installSpecial(symbol(void(0), "apply"), compileApply);

installSpecial(symbol(void(0), "new"), compileNew);

installSpecial(symbol(void(0), "instance?"), compileInstance);

installSpecial(symbol(void(0), "not"), compileNot);

installSpecial(symbol(void(0), "loop"), compileLoop);

installSpecial(symbol(void(0), "raw*"), compileRaw);

installSpecial(symbol(void(0), "comment"), writeComment);

var compileRePattern = function compileRePattern(form) {
  return "" + form;
};
exports.compileRePattern = compileRePattern;

var installNative = function installNative(alias, operator, validator, fallback) {
  return installSpecial(alias, function(form) {
    return isEmpty(form) ?
      fallback :
      reduce(function(left, right) {
        return compileTemplate(list("~{} ~{} ~{}", left, name(operator), right));
      }, map(function(operand) {
        return compileTemplate(list(isList(operand) ?
          "(~{})" :
          "~{}", compile(macroexpand(operand))));
      }, form));
  }, validator);
};
exports.installNative = installNative;

var installOperator = function installOperator(alias, operator) {
  return installSpecial(alias, function(form) {
    return (function loop(result, left, right, operands) {
      var recur = loop;
      while (recur === loop) {
        recur = isEmpty(operands) ?
        "" + result + (compileTemplate(list("~{} ~{} ~{}", compile(macroexpand(left)), name(operator), compile(macroexpand(right))))) :
        (result = "" + result + (compileTemplate(list("~{} ~{} ~{} && ", compile(macroexpand(left)), name(operator), compile(macroexpand(right))))), left = right, right = first(operands), operands = rest(operands), loop);
      };
      return recur;
    })("", first(form), second(form), rest(rest(form)));
  }, verifyTwo);
};
exports.installOperator = installOperator;

var compilerError = function compilerError(form, message) {
  var error = Error("" + message);
  error.line = 1;
  return (function() { throw error; })();
};
exports.compilerError = compilerError;

var verifyTwo = function verifyTwo(form) {
  return (isEmpty(rest(form))) || (isEmpty(rest(rest(form)))) ?
    (function() { throw compilerError(form, "" + (first(form)) + " form requires at least two operands"); })() :
    void(0);
};
exports.verifyTwo = verifyTwo;

installNative(symbol(void(0), "+"), symbol(void(0), "+"), void(0), 0);

installNative(symbol(void(0), "-"), symbol(void(0), "-"), void(0), "NaN");

installNative(symbol(void(0), "*"), symbol(void(0), "*"), void(0), 1);

installNative(symbol(void(0), "/"), symbol(void(0), "/"), verifyTwo);

installNative(symbol(void(0), "mod"), symbol("%"), verifyTwo);

installNative(symbol(void(0), "and"), symbol(void(0), "&&"));

installNative(symbol(void(0), "or"), symbol(void(0), "||"));

installOperator(symbol(void(0), "not="), symbol(void(0), "!="));

installOperator(symbol(void(0), "=="), symbol(void(0), "==="));

installOperator(symbol(void(0), "identical?"), symbol(void(0), "==="));

installOperator(symbol(void(0), ">"), symbol(void(0), ">"));

installOperator(symbol(void(0), ">="), symbol(void(0), ">="));

installOperator(symbol(void(0), "<"), symbol(void(0), "<"));

installOperator(symbol(void(0), "<="), symbol(void(0), "<="));

installNative(symbol(void(0), "bit-and"), symbol(void(0), "&"), verifyTwo);

installNative(symbol(void(0), "bit-or"), symbol(void(0), "|"), verifyTwo);

installNative(symbol(void(0), "bit-xor"), symbol("^"));

installNative(symbol(void(0), "bit-not"), symbol("~"), verifyTwo);

installNative(symbol(void(0), "bit-shift-left"), symbol(void(0), "<<"), verifyTwo);

installNative(symbol(void(0), "bit-shift-right"), symbol(void(0), ">>"), verifyTwo);

installNative(symbol(void(0), "bit-shift-right-zero-fil"), symbol(void(0), ">>>"), verifyTwo);

installMacro(symbol(void(0), "str"), function str() {
  var forms = Array.prototype.slice.call(arguments, 0);
  return concat(list(symbol(void(0), "+"), ""), forms);
});

installMacro(symbol(void(0), "let"), function letMacro(bindings) {
  var body = Array.prototype.slice.call(arguments, 1);
  return cons(symbol(void(0), "do"), concat(defineBindings(bindings), body));
});

installMacro(symbol(void(0), "cond"), function cond() {
  var clauses = Array.prototype.slice.call(arguments, 0);
  return !(isEmpty(clauses)) ?
    list(symbol(void(0), "if"), first(clauses), isEmpty(rest(clauses)) ?
      (function() { throw Error("cond requires an even number of forms"); })() :
      second(clauses), cons(symbol(void(0), "cond"), rest(rest(clauses)))) :
    void(0);
});

installMacro(symbol(void(0), "defn"), function defn(name) {
  var body = Array.prototype.slice.call(arguments, 1);
  return list(symbol(void(0), "def"), name, concat(list(symbol(void(0), "fn"), name), body));
});

installMacro(symbol(void(0), "defn-"), function defn(name) {
  var body = Array.prototype.slice.call(arguments, 1);
  return concat(list(symbol(void(0), "defn"), withMeta(name, conj({
    "private": true
  }, meta(name)))), body);
});

installMacro(symbol(void(0), "assert"), function assert(x, message) {
  var title = message || "";
  var assertion = prStr(x);
  var uri = (x || 0)["uri"];
  var form = isList(x) ?
    second(x) :
    x;
  return list(symbol(void(0), "do"), list(symbol(void(0), "if"), list(symbol(void(0), "and"), list(symbol(void(0), "not"), list(symbol(void(0), "identical?"), list(symbol(void(0), "typeof"), symbol(void(0), "**verbose**")), "undefined")), symbol(void(0), "**verbose**")), list(symbol(void(0), ".log"), symbol(void(0), "console"), "Assert:", assertion)), list(symbol(void(0), "if"), list(symbol(void(0), "not"), x), list(symbol(void(0), "throw"), list(symbol(void(0), "Error."), list(symbol(void(0), "str"), "Assert failed: ", title, "\n\nAssertion:\n\n", assertion, "\n\nActual:\n\n", form, "\n--------------\n"), uri))));
});

var parseReferences = function parseReferences(forms) {
  return reduce(function(references, form) {
    isSeq(form) ?
      (references || 0)[name(first(form))] = vec(rest(form)) :
      void(0);
    return references;
  }, {}, forms);
};
exports.parseReferences = parseReferences;

var parseRequire = function parseRequire(form) {
  var requirement = isSymbol(form) ?
    [form] :
    vec(form);
  var id = first(requirement);
  var params = dictionary.apply(dictionary, rest(requirement));
  var imports = reduce(function(imports, name) {
    (imports || 0)[name] = ((imports || 0)[name]) || name;
    return imports;
  }, conj({}, (params || 0)["꞉rename"]), (params || 0)["꞉refer"]);
  return conj({
    "id": id,
    "imports": imports
  }, params);
};
exports.parseRequire = parseRequire;

var analyzeNs = function analyzeNs(form) {
  var id = first(form);
  var params = rest(form);
  var doc = isString(first(params)) ?
    first(params) :
    void(0);
  var references = parseReferences(doc ?
    rest(params) :
    params);
  return withMeta(form, {
    "id": id,
    "doc": doc,
    "require": (references || 0)["require"] ?
      map(parseRequire, (references || 0)["require"]) :
      void(0)
  });
};
exports.analyzeNs = analyzeNs;

var idToNs = function idToNs(id) {
  return symbol(void(0), join("*", split("" + id, ".")));
};
exports.idToNs = idToNs;

var nameToField = function nameToField(name) {
  return symbol(void(0), "" + "-" + name);
};
exports.nameToField = nameToField;

var compileImport = function compileImport(module) {
  return function(form) {
    return list(symbol(void(0), "def"), second(form), list(symbol(void(0), "."), module, nameToField(first(form))));
  };
};
exports.compileImport = compileImport;

var compileRequire = function compileRequire(requirer) {
  return function(form) {
    var id = (form || 0)["id"];
    var requirement = idToNs(((form || 0)["꞉as"]) || id);
    var path = resolve(requirer, id);
    var imports = (form || 0)["imports"];
    return concat([symbol(void(0), "do*"), list(symbol(void(0), "def"), requirement, list(symbol(void(0), "require"), path))], imports ?
      map(compileImport(requirement), imports) :
      void(0));
  };
};
exports.compileRequire = compileRequire;

var resolve = function resolve(from, to) {
  var requirer = split("" + from, ".");
  var requirement = split("" + to, ".");
  var isRelative = (!("" + from === "" + to)) && (first(requirer) === first(requirement));
  return isRelative ?
    (function loop(from, to) {
      var recur = loop;
      while (recur === loop) {
        recur = first(from) === first(to) ?
        (from = rest(from), to = rest(to), loop) :
        join("/", concat(["."], repeat(dec(count(from)), ".."), to));
      };
      return recur;
    })(requirer, requirement) :
    join("/", requirement);
};
exports.resolve = resolve;

var compileNs = function compileNs() {
  var form = Array.prototype.slice.call(arguments, 0);
  return (function() {
    var metadata = meta(analyzeNs(form));
    var id = "" + ((metadata || 0)["id"]);
    var doc = (metadata || 0)["doc"];
    var requirements = (metadata || 0)["require"];
    var ns = doc ?
      {
        "id": id,
        "doc": doc
      } :
      {
        "id": id
      };
    return concat([symbol(void(0), "do*"), list(symbol(void(0), "def"), symbol(void(0), "*ns*"), ns)], requirements ?
      map(compileRequire(id), requirements) :
      void(0));
  })();
};
exports.compileNs = compileNs;

installMacro(symbol(void(0), "ns"), compileNs);

installMacro(symbol(void(0), "print"), function() {
  var more = Array.prototype.slice.call(arguments, 0);
  "Prints the object(s) to the output for human consumption.";
  return concat(list(symbol(void(0), ".log"), symbol(void(0), "console")), more);
})
},{"./reader":4,"./ast":6,"./sequence":3,"./runtime":2,"./string":7,"./backend/javascript/writer":8}],6:[function(require,module,exports){
var _ns_ = {
  "id": "wisp.ast"
};
var wisp_sequence = require("./sequence");
var isList = wisp_sequence.isList;
var isSequential = wisp_sequence.isSequential;
var first = wisp_sequence.first;
var second = wisp_sequence.second;
var count = wisp_sequence.count;
var last = wisp_sequence.last;
var map = wisp_sequence.map;
var vec = wisp_sequence.vec;;
var wisp_string = require("./string");
var split = wisp_string.split;
var join = wisp_string.join;;
var wisp_runtime = require("./runtime");
var isNil = wisp_runtime.isNil;
var isVector = wisp_runtime.isVector;
var isNumber = wisp_runtime.isNumber;
var isString = wisp_runtime.isString;
var isBoolean = wisp_runtime.isBoolean;
var isObject = wisp_runtime.isObject;
var isDate = wisp_runtime.isDate;
var isRePattern = wisp_runtime.isRePattern;
var isDictionary = wisp_runtime.isDictionary;
var str = wisp_runtime.str;
var inc = wisp_runtime.inc;
var subs = wisp_runtime.subs;
var isEqual = wisp_runtime.isEqual;;;

var withMeta = function withMeta(value, metadata) {
  Object.defineProperty(value, "metadata", {
    "value": metadata,
    "configurable": true
  });
  return value;
};
exports.withMeta = withMeta;

var meta = function meta(value) {
  return isObject(value) ?
    value.metadata :
    void(0);
};
exports.meta = meta;

var __nsSeparator__ = "⁄";
exports.__nsSeparator__ = __nsSeparator__;

var Symbol = function Symbol(namespace, name) {
  this.namespace = namespace;
  this.name = name;
  return this;
};

Symbol.type = "wisp.symbol";

Symbol.prototype.type = Symbol.type;

Symbol.prototype.toString = function() {
  var ns = namespace(this);
  return ns ?
    "" + ns + "/" + (name(this)) :
    "" + (name(this));
};

var symbol = function symbol(ns, id) {
  return isSymbol(ns) ?
    ns :
  isKeyword(ns) ?
    new Symbol(namespace(ns), name(ns)) :
  isNil(id) ?
    new Symbol(void(0), ns) :
  "else" ?
    new Symbol(ns, id) :
    void(0);
};
exports.symbol = symbol;

var isSymbol = function isSymbol(x) {
  return x && (Symbol.type === x.type);
};
exports.isSymbol = isSymbol;

var isKeyword = function isKeyword(x) {
  return (isString(x)) && (count(x) > 1) && (first(x) === "꞉");
};
exports.isKeyword = isKeyword;

var keyword = function keyword(ns, id) {
  return isKeyword(ns) ?
    ns :
  isSymbol(ns) ?
    "" + "꞉" + (name(ns)) :
  isNil(id) ?
    "" + "꞉" + ns :
  isNil(ns) ?
    "" + "꞉" + id :
  "else" ?
    "" + "꞉" + ns + __nsSeparator__ + id :
    void(0);
};
exports.keyword = keyword;

var keywordName = function keywordName(value) {
  return last(split(subs(value, 1), __nsSeparator__));
};

var name = function name(value) {
  return isSymbol(value) ?
    value.name :
  isKeyword(value) ?
    keywordName(value) :
  isString(value) ?
    value :
  "else" ?
    (function() { throw new TypeError("" + "Doesn't support name: " + value); })() :
    void(0);
};
exports.name = name;

var keywordNamespace = function keywordNamespace(x) {
  var parts = split(subs(x, 1), __nsSeparator__);
  return count(parts) > 1 ?
    (parts || 0)[0] :
    void(0);
};

var namespace = function namespace(x) {
  return isSymbol(x) ?
    x.namespace :
  isKeyword(x) ?
    keywordNamespace(x) :
  "else" ?
    (function() { throw new TypeError("" + "Doesn't supports namespace: " + x); })() :
    void(0);
};
exports.namespace = namespace;

var gensym = function gensym(prefix) {
  return symbol("" + (isNil(prefix) ?
    "G__" :
    prefix) + (gensym.base = gensym.base + 1));
};
exports.gensym = gensym;

gensym.base = 0;

var isUnquote = function isUnquote(form) {
  return (isList(form)) && (isEqual(first(form), symbol(void(0), "unquote")));
};
exports.isUnquote = isUnquote;

var isUnquoteSplicing = function isUnquoteSplicing(form) {
  return (isList(form)) && (isEqual(first(form), symbol(void(0), "unquote-splicing")));
};
exports.isUnquoteSplicing = isUnquoteSplicing;

var isQuote = function isQuote(form) {
  return (isList(form)) && (isEqual(first(form), symbol(void(0), "quote")));
};
exports.isQuote = isQuote;

var isSyntaxQuote = function isSyntaxQuote(form) {
  return (isList(form)) && (isEqual(first(form), symbol(void(0), "syntax-quote")));
};
exports.isSyntaxQuote = isSyntaxQuote;

var normalize = function normalize(n, len) {
  return (function loop(ns) {
    var recur = loop;
    while (recur === loop) {
      recur = count(ns) < len ?
      (ns = "" + "0" + ns, loop) :
      ns;
    };
    return recur;
  })("" + n);
};

var quoteString = function quoteString(s) {
  s = join("\\\"", split(s, "\""));
  s = join("\\\\", split(s, "\\"));
  s = join("\\b", split(s, ""));
  s = join("\\f", split(s, ""));
  s = join("\\n", split(s, "\n"));
  s = join("\\r", split(s, "\r"));
  s = join("\\t", split(s, "\t"));
  return "" + "\"" + s + "\"";
};
exports.quoteString = quoteString;

var prStr = function prStr(x) {
  return isNil(x) ?
    "nil" :
  isKeyword(x) ?
    namespace(x) ?
      "" + ":" + (namespace(x)) + "/" + (name(x)) :
      "" + ":" + (name(x)) :
  isString(x) ?
    quoteString(x) :
  isDate(x) ?
    "" + "#inst \"" + (x.getUTCFullYear()) + "-" + (normalize(inc(x.getUTCMonth()), 2)) + "-" + (normalize(x.getUTCDate(), 2)) + "T" + (normalize(x.getUTCHours(), 2)) + ":" + (normalize(x.getUTCMinutes(), 2)) + ":" + (normalize(x.getUTCSeconds(), 2)) + "." + (normalize(x.getUTCMilliseconds(), 3)) + "-" + "00:00\"" :
  isVector(x) ?
    "" + "[" + (join(" ", map(prStr, vec(x)))) + "]" :
  isDictionary(x) ?
    "" + "{" + (join(", ", map(function(pair) {
      return "" + (prStr(first(pair))) + " " + (prStr(second(pair)));
    }, x))) + "}" :
  isSequential(x) ?
    "" + "(" + (join(" ", map(prStr, vec(x)))) + ")" :
  isRePattern(x) ?
    "" + "#\"" + (join("\\/", split(x.source, "/"))) + "\"" :
  "else" ?
    "" + x :
    void(0);
};
exports.prStr = prStr
},{"./sequence":3,"./string":7,"./runtime":2}],7:[function(require,module,exports){
var _ns_ = {
  "id": "wisp.string"
};
var wisp_runtime = require("./runtime");
var str = wisp_runtime.str;
var subs = wisp_runtime.subs;
var reMatches = wisp_runtime.reMatches;
var isNil = wisp_runtime.isNil;
var isString = wisp_runtime.isString;;
var wisp_sequence = require("./sequence");
var vec = wisp_sequence.vec;
var isEmpty = wisp_sequence.isEmpty;;;

var split = function split(string, pattern, limit) {
  return string.split(pattern, limit);
};
exports.split = split;

var join = function join(separator, coll) {
  switch (arguments.length) {
    case 1:
      var coll = separator;
      return str.apply(str, vec(coll));
    case 2:
      return vec(coll).join(separator);

    default:
      (function() { throw Error("Invalid arity"); })()
  };
  return void(0);
};
exports.join = join;

var upperCase = function upperCase(string) {
  return string.toUpperCase();
};
exports.upperCase = upperCase;

var upperCase = function upperCase(string) {
  return string.toUpperCase();
};
exports.upperCase = upperCase;

var lowerCase = function lowerCase(string) {
  return string.toLowerCase();
};
exports.lowerCase = lowerCase;

var capitalize = function capitalize(string) {
  return count(string) < 2 ?
    upperCase(string) :
    "" + (upperCase(subs(s, 0, 1))) + (lowerCase(subs(s, 1)));
};
exports.capitalize = capitalize;

var replace = function replace(string, match, replacement) {
  return string.replace(match, replacement);
};
exports.replace = replace;

var __LEFTSPACES__ = /^\s\s*/;
exports.__LEFTSPACES__ = __LEFTSPACES__;

var __RIGHTSPACES__ = /\s\s*$/;
exports.__RIGHTSPACES__ = __RIGHTSPACES__;

var __SPACES__ = /^\s\s*$/;
exports.__SPACES__ = __SPACES__;

var triml = isNil("".trimLeft) ?
  function(string) {
    return string.replace(__LEFTSPACES__, "");
  } :
  function triml(string) {
    return string.trimLeft();
  };
exports.triml = triml;

var trimr = isNil("".trimRight) ?
  function(string) {
    return string.replace(__RIGHTSPACES__, "");
  } :
  function trimr(string) {
    return string.trimRight();
  };
exports.trimr = trimr;

var trim = isNil("".trim) ?
  function(string) {
    return string.replace(__LEFTSPACES__).replace(__RIGHTSPACES__);
  } :
  function trim(string) {
    return string.trim();
  };
exports.trim = trim;

var isBlank = function isBlank(string) {
  return (isNil(string)) || (isEmpty(string)) || (reMatches(__SPACES__, string));
};
exports.isBlank = isBlank
},{"./runtime":2,"./sequence":3}],8:[function(require,module,exports){
var _ns_ = {
  "id": "wisp.backend.javascript.writer",
  "doc": "Compiler backend for for writing JS output"
};
var wisp_ast = require("./../../ast");
var name = wisp_ast.name;
var namespace = wisp_ast.namespace;
var symbol = wisp_ast.symbol;
var isSymbol = wisp_ast.isSymbol;
var isKeyword = wisp_ast.isKeyword;;
var wisp_sequence = require("./../../sequence");
var list = wisp_sequence.list;
var first = wisp_sequence.first;
var rest = wisp_sequence.rest;
var isList = wisp_sequence.isList;
var vec = wisp_sequence.vec;
var map = wisp_sequence.map;
var count = wisp_sequence.count;
var last = wisp_sequence.last;
var reduce = wisp_sequence.reduce;
var isEmpty = wisp_sequence.isEmpty;;
var wisp_runtime = require("./../../runtime");
var isTrue = wisp_runtime.isTrue;
var isNil = wisp_runtime.isNil;
var isString = wisp_runtime.isString;
var isNumber = wisp_runtime.isNumber;
var isVector = wisp_runtime.isVector;
var isDictionary = wisp_runtime.isDictionary;
var isBoolean = wisp_runtime.isBoolean;
var isRePattern = wisp_runtime.isRePattern;
var reFind = wisp_runtime.reFind;
var dec = wisp_runtime.dec;
var subs = wisp_runtime.subs;;
var wisp_string = require("./../../string");
var replace = wisp_string.replace;
var join = wisp_string.join;
var split = wisp_string.split;
var upperCase = wisp_string.upperCase;;;

var writeReference = function writeReference(form) {
  "Translates references from clojure convention to JS:\n\n  **macros**      __macros__\n  list->vector    listToVector\n  set!            set\n  foo_bar         foo_bar\n  number?         isNumber\n  create-server   createServer";
  return (function() {
    var id = name(form);
    id = id === "*" ?
      "multiply" :
    id === "/" ?
      "divide" :
    id === "+" ?
      "sum" :
    id === "-" ?
      "subtract" :
    id === "=" ?
      "equal?" :
    id === "==" ?
      "strict-equal?" :
    id === "<=" ?
      "not-greater-than" :
    id === ">=" ?
      "not-less-than" :
    id === ">" ?
      "greater-than" :
    id === "<" ?
      "less-than" :
    "else" ?
      id :
      void(0);
    id = join("_", split(id, "*"));
    id = join("-to-", split(id, "->"));
    id = join(split(id, "!"));
    id = join("$", split(id, "%"));
    id = join("-plus-", split(id, "+"));
    id = join("-and-", split(id, "&"));
    id = last(id) === "?" ?
      "" + "is-" + (subs(id, 0, dec(count(id)))) :
      id;
    id = reduce(function(result, key) {
      return "" + result + ((!(isEmpty(result))) && (!(isEmpty(key))) ?
        "" + (upperCase((key || 0)[0])) + (subs(key, 1)) :
        key);
    }, "", split(id, "-"));
    return id;
  })();
};
exports.writeReference = writeReference;

var writeKeywordReference = function writeKeywordReference(form) {
  return "" + "\"" + (name(form)) + "\"";
};
exports.writeKeywordReference = writeKeywordReference;

var writeKeyword = function writeKeyword(form) {
  return "" + "\"" + "꞉" + (name(form)) + "\"";
};
exports.writeKeyword = writeKeyword;

var writeSymbol = function writeSymbol(form) {
  return write(list(symbol(void(0), "symbol"), namespace(form), name(form)));
};
exports.writeSymbol = writeSymbol;

var writeNil = function writeNil(form) {
  return "void(0)";
};
exports.writeNil = writeNil;

var writeNumber = function writeNumber(form) {
  return form;
};
exports.writeNumber = writeNumber;

var writeBoolean = function writeBoolean(form) {
  return isTrue(form) ?
    "true" :
    "false";
};
exports.writeBoolean = writeBoolean;

var writeString = function writeString(form) {
  form = replace(form, RegExp("\\\\", "g"), "\\\\");
  form = replace(form, RegExp("\n", "g"), "\\n");
  form = replace(form, RegExp("\r", "g"), "\\r");
  form = replace(form, RegExp("\t", "g"), "\\t");
  form = replace(form, RegExp("\"", "g"), "\\\"");
  return "" + "\"" + form + "\"";
};
exports.writeString = writeString;

var writeTemplate = function writeTemplate() {
  var form = Array.prototype.slice.call(arguments, 0);
  return (function() {
    var indentPattern = /\n *$/;
    var lineBreakPatter = RegExp("\n", "g");
    var getIndentation = function(code) {
      return (reFind(indentPattern, code)) || "\n";
    };
    return (function loop(code, parts, values) {
      var recur = loop;
      while (recur === loop) {
        recur = count(parts) > 1 ?
        (code = "" + code + (first(parts)) + (replace("" + "" + (first(values)), lineBreakPatter, getIndentation(first(parts)))), parts = rest(parts), values = rest(values), loop) :
        "" + code + (first(parts));
      };
      return recur;
    })("", split(first(form), "~{}"), rest(form));
  })();
};
exports.writeTemplate = writeTemplate;

var writeGroup = function writeGroup() {
  var forms = Array.prototype.slice.call(arguments, 0);
  return join(", ", forms);
};
exports.writeGroup = writeGroup;

var writeInvoke = function writeInvoke(callee) {
  var params = Array.prototype.slice.call(arguments, 1);
  return writeTemplate("~{}(~{})", callee, writeGroup.apply(writeGroup, params));
};
exports.writeInvoke = writeInvoke;

var writeError = function writeError(message) {
  return function() {
    return (function() { throw Error(message); })();
  };
};
exports.writeError = writeError;

var writeVector = writeError("Vectors are not supported");
exports.writeVector = writeVector;

var writeDictionary = writeError("Dictionaries are not supported");
exports.writeDictionary = writeDictionary;

var writePattern = writeError("Regular expressions are not supported");
exports.writePattern = writePattern;

var compileComment = function compileComment(form) {
  return compileTemplate(list("//~{}\n", first(form)));
};
exports.compileComment = compileComment;

var writeDef = function writeDef(form) {
  var id = first(form);
  var isExport = ((((meta(form)) || {}) || 0)["top"]) && (!((((meta(id)) || {}) || 0)["private"]));
  var attribute = symbol(namespace(id), "" + "-" + (name(id)));
  return isExport ?
    compileTemplate(list("var ~{};\n~{}", compile(cons(symbol(void(0), "set!"), form)), compile(list(symbol(void(0), "set!"), list(symbol(void(0), "."), symbol(void(0), "exports"), attribute), id)))) :
    compileTemplate(list("var ~{}", compile(cons(symbol(void(0), "set!"), form))));
};
exports.writeDef = writeDef;

var write = function write(form) {
  return isNil(form) ?
    writeNil(form) :
  isSymbol(form) ?
    writeReference(form) :
  isKeyword(form) ?
    writeKeywordReference(form) :
  isString(form) ?
    writeString(form) :
  isNumber(form) ?
    writeNumber(form) :
  isBoolean(form) ?
    writeBoolean(form) :
  isRePattern(form) ?
    writePattern(form) :
  isVector(form) ?
    writeVector(form) :
  isDictionary(form) ?
    writeDictionary() :
  isList(form) ?
    writeInvoke.apply(writeInvoke, map(write, vec(form))) :
  "else" ?
    writeError("Unsupported form") :
    void(0);
};
exports.write = write
},{"./../../ast":6,"./../../sequence":3,"./../../runtime":2,"./../../string":7}]},{},[1])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvcmNhcm1vL0RldmVsb3BtZW50L2NvbS5naXRodWIucmNhcm1vLndpc3AvZW5naW5lL2Jyb3dzZXIuanMiLCIvVXNlcnMvcmNhcm1vL0RldmVsb3BtZW50L2NvbS5naXRodWIucmNhcm1vLndpc3AvcnVudGltZS5qcyIsIi9Vc2Vycy9yY2FybW8vRGV2ZWxvcG1lbnQvY29tLmdpdGh1Yi5yY2FybW8ud2lzcC9zZXF1ZW5jZS5qcyIsIi9Vc2Vycy9yY2FybW8vRGV2ZWxvcG1lbnQvY29tLmdpdGh1Yi5yY2FybW8ud2lzcC9yZWFkZXIuanMiLCIvVXNlcnMvcmNhcm1vL0RldmVsb3BtZW50L2NvbS5naXRodWIucmNhcm1vLndpc3AvY29tcGlsZXIuanMiLCIvVXNlcnMvcmNhcm1vL0RldmVsb3BtZW50L2NvbS5naXRodWIucmNhcm1vLndpc3AvYXN0LmpzIiwiL1VzZXJzL3JjYXJtby9EZXZlbG9wbWVudC9jb20uZ2l0aHViLnJjYXJtby53aXNwL3N0cmluZy5qcyIsIi9Vc2Vycy9yY2FybW8vRGV2ZWxvcG1lbnQvY29tLmdpdGh1Yi5yY2FybW8ud2lzcC9iYWNrZW5kL2phdmFzY3JpcHQvd3JpdGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdG1CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbmpCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ254QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDamhDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgX25zXyA9IHtcbiAgXCJpZFwiOiBcIndpc3AuZW5naW5lLmJyb3dzZXJcIlxufTtcbnZhciB3aXNwX3J1bnRpbWUgPSByZXF1aXJlKFwiLi8uLi9ydW50aW1lXCIpO1xudmFyIHN0ciA9IHdpc3BfcnVudGltZS5zdHI7O1xudmFyIHdpc3Bfc2VxdWVuY2UgPSByZXF1aXJlKFwiLi8uLi9zZXF1ZW5jZVwiKTtcbnZhciByZXN0ID0gd2lzcF9zZXF1ZW5jZS5yZXN0OztcbnZhciB3aXNwX3JlYWRlciA9IHJlcXVpcmUoXCIuLy4uL3JlYWRlclwiKTtcbnZhciByZWFkXyA9IHdpc3BfcmVhZGVyLnJlYWRfO1xudmFyIHJlYWRGcm9tU3RyaW5nID0gd2lzcF9yZWFkZXIucmVhZEZyb21TdHJpbmc7O1xudmFyIHdpc3BfY29tcGlsZXIgPSByZXF1aXJlKFwiLi8uLi9jb21waWxlclwiKTtcbnZhciBjb21waWxlXyA9IHdpc3BfY29tcGlsZXIuY29tcGlsZV87OztcblxudmFyIGV2YWx1YXRlID0gZnVuY3Rpb24gZXZhbHVhdGUoY29kZSwgdXJsKSB7XG4gIHJldHVybiBldmFsKGNvbXBpbGVfKHJlYWRfKGNvZGUsIHVybCkpKTtcbn07XG5leHBvcnRzLmV2YWx1YXRlID0gZXZhbHVhdGU7XG5cbnZhciBydW4gPSBmdW5jdGlvbiBydW4oY29kZSwgdXJsKSB7XG4gIHJldHVybiAoRnVuY3Rpb24oY29tcGlsZV8ocmVhZF8oY29kZSwgdXJsKSkpKSgpO1xufTtcbmV4cG9ydHMucnVuID0gcnVuO1xuXG52YXIgbG9hZCA9IGZ1bmN0aW9uIGxvYWQodXJsLCBjYWxsYmFjaykge1xuICB2YXIgcmVxdWVzdCA9IHdpbmRvdy5YTUxIdHRwUmVxdWVzdCA/XG4gICAgbmV3IFhNTEh0dHBSZXF1ZXN0KCkgOlxuICAgIG5ldyBBY3RpdmVYT2JqZWN0KFwiTWljcm9zb2Z0LlhNTEhUVFBcIik7XG4gIHJlcXVlc3Qub3BlbihcIkdFVFwiLCB1cmwsIHRydWUpO1xuICByZXF1ZXN0Lm92ZXJyaWRlTWltZVR5cGUgP1xuICAgIHJlcXVlc3Qub3ZlcnJpZGVNaW1lVHlwZShcImFwcGxpY2F0aW9uL3dpc3BcIikgOlxuICAgIHZvaWQoMCk7XG4gIHJlcXVlc3Qub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHJlcXVlc3QucmVhZHlTdGF0ZSA9PT0gNCA/XG4gICAgICAocmVxdWVzdC5zdGF0dXMgPT09IDApIHx8IChyZXF1ZXN0LnN0YXR1cyA9PT0gMjAwKSA/XG4gICAgICAgIGNhbGxiYWNrKHJ1bihyZXF1ZXN0LnJlc3BvbnNlVGV4dCwgdXJsKSkgOlxuICAgICAgICBjYWxsYmFjayhcIkNvdWxkIG5vdCBsb2FkXCIpIDpcbiAgICAgIHZvaWQoMCk7XG4gIH07XG4gIHJldHVybiByZXF1ZXN0LnNlbmQobnVsbCk7XG59O1xuZXhwb3J0cy5sb2FkID0gbG9hZDtcblxudmFyIHJ1blNjcmlwdHMgPSBmdW5jdGlvbiBydW5TY3JpcHRzKCkge1xuICB2YXIgc2NyaXB0cyA9IEFycmF5LnByb3RvdHlwZS5maWx0ZXIuY2FsbChkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcInNjcmlwdFwiKSwgZnVuY3Rpb24oc2NyaXB0KSB7XG4gICAgcmV0dXJuIHNjcmlwdC50eXBlID09PSBcImFwcGxpY2F0aW9uL3dpc3BcIjtcbiAgfSk7XG4gIHZhciBuZXh0ID0gZnVuY3Rpb24gbmV4dCgpIHtcbiAgICByZXR1cm4gc2NyaXB0cy5sZW5ndGggP1xuICAgICAgKGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgc2NyaXB0ID0gc2NyaXB0cy5zaGlmdCgpO1xuICAgICAgICByZXR1cm4gc2NyaXB0LnNyYyA/XG4gICAgICAgICAgbG9hZChzY3JpcHQuc3JjLCBuZXh0KSA6XG4gICAgICAgICAgbmV4dChydW4oc2NyaXB0LmlubmVySFRNTCkpO1xuICAgICAgfSkoKSA6XG4gICAgICB2b2lkKDApO1xuICB9O1xuICByZXR1cm4gbmV4dCgpO1xufTtcbmV4cG9ydHMucnVuU2NyaXB0cyA9IHJ1blNjcmlwdHM7XG5cbihkb2N1bWVudC5yZWFkeVN0YXRlID09PSBcImNvbXBsZXRlXCIpIHx8IChkb2N1bWVudC5yZWFkeVN0YXRlID09PSBcImludGVyYWN0aXZlXCIpID9cbiAgcnVuU2NyaXB0cygpIDpcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyID9cbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIHJ1blNjcmlwdHMsIGZhbHNlKSA6XG4gIHdpbmRvdy5hdHRhY2hFdmVudChcIm9ubG9hZFwiLCBydW5TY3JpcHRzKSIsIihmdW5jdGlvbigpe3ZhciBfbnNfID0ge1xuICBcImlkXCI6IFwid2lzcC5ydW50aW1lXCIsXG4gIFwiZG9jXCI6IFwiQ29yZSBwcmltaXRpdmVzIHJlcXVpcmVkIGZvciBydW50aW1lXCJcbn07O1xuXG52YXIgaWRlbnRpdHkgPSBmdW5jdGlvbiBpZGVudGl0eSh4KSB7XG4gIHJldHVybiB4O1xufTtcbmV4cG9ydHMuaWRlbnRpdHkgPSBpZGVudGl0eTtcblxudmFyIGlzT2RkID0gZnVuY3Rpb24gaXNPZGQobikge1xuICByZXR1cm4gbiAlIDIgPT09IDE7XG59O1xuZXhwb3J0cy5pc09kZCA9IGlzT2RkO1xuXG52YXIgaXNFdmVuID0gZnVuY3Rpb24gaXNFdmVuKG4pIHtcbiAgcmV0dXJuIG4gJSAyID09PSAwO1xufTtcbmV4cG9ydHMuaXNFdmVuID0gaXNFdmVuO1xuXG52YXIgaXNEaWN0aW9uYXJ5ID0gZnVuY3Rpb24gaXNEaWN0aW9uYXJ5KGZvcm0pIHtcbiAgcmV0dXJuIChpc09iamVjdChmb3JtKSkgJiYgKGlzT2JqZWN0KE9iamVjdC5nZXRQcm90b3R5cGVPZihmb3JtKSkpICYmIChpc05pbChPYmplY3QuZ2V0UHJvdG90eXBlT2YoT2JqZWN0LmdldFByb3RvdHlwZU9mKGZvcm0pKSkpO1xufTtcbmV4cG9ydHMuaXNEaWN0aW9uYXJ5ID0gaXNEaWN0aW9uYXJ5O1xuXG52YXIgZGljdGlvbmFyeSA9IGZ1bmN0aW9uIGRpY3Rpb25hcnkoKSB7XG4gIHJldHVybiAoZnVuY3Rpb24gbG9vcChrZXlWYWx1ZXMsIHJlc3VsdCkge1xuICAgIHZhciByZWN1ciA9IGxvb3A7XG4gICAgd2hpbGUgKHJlY3VyID09PSBsb29wKSB7XG4gICAgICByZWN1ciA9IGtleVZhbHVlcy5sZW5ndGggP1xuICAgICAgKGZ1bmN0aW9uKCkge1xuICAgICAgICAocmVzdWx0IHx8IDApWyhrZXlWYWx1ZXMgfHwgMClbMF1dID0gKGtleVZhbHVlcyB8fCAwKVsxXTtcbiAgICAgICAgcmV0dXJuIChrZXlWYWx1ZXMgPSBrZXlWYWx1ZXMuc2xpY2UoMiksIHJlc3VsdCA9IHJlc3VsdCwgbG9vcCk7XG4gICAgICB9KSgpIDpcbiAgICAgIHJlc3VsdDtcbiAgICB9O1xuICAgIHJldHVybiByZWN1cjtcbiAgfSkoQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKSwge30pO1xufTtcbmV4cG9ydHMuZGljdGlvbmFyeSA9IGRpY3Rpb25hcnk7XG5cbnZhciBrZXlzID0gZnVuY3Rpb24ga2V5cyhkaWN0aW9uYXJ5KSB7XG4gIHJldHVybiBPYmplY3Qua2V5cyhkaWN0aW9uYXJ5KTtcbn07XG5leHBvcnRzLmtleXMgPSBrZXlzO1xuXG52YXIgdmFscyA9IGZ1bmN0aW9uIHZhbHMoZGljdGlvbmFyeSkge1xuICByZXR1cm4ga2V5cyhkaWN0aW9uYXJ5KS5tYXAoZnVuY3Rpb24oa2V5KSB7XG4gICAgcmV0dXJuIChkaWN0aW9uYXJ5IHx8IDApW2tleV07XG4gIH0pO1xufTtcbmV4cG9ydHMudmFscyA9IHZhbHM7XG5cbnZhciBrZXlWYWx1ZXMgPSBmdW5jdGlvbiBrZXlWYWx1ZXMoZGljdGlvbmFyeSkge1xuICByZXR1cm4ga2V5cyhkaWN0aW9uYXJ5KS5tYXAoZnVuY3Rpb24oa2V5KSB7XG4gICAgcmV0dXJuIFtrZXksIChkaWN0aW9uYXJ5IHx8IDApW2tleV1dO1xuICB9KTtcbn07XG5leHBvcnRzLmtleVZhbHVlcyA9IGtleVZhbHVlcztcblxudmFyIG1lcmdlID0gZnVuY3Rpb24gbWVyZ2UoKSB7XG4gIHJldHVybiBPYmplY3QuY3JlYXRlKE9iamVjdC5wcm90b3R5cGUsIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cykucmVkdWNlKGZ1bmN0aW9uKGRlc2NyaXB0b3IsIGRpY3Rpb25hcnkpIHtcbiAgICBpc09iamVjdChkaWN0aW9uYXJ5KSA/XG4gICAgICBPYmplY3Qua2V5cyhkaWN0aW9uYXJ5KS5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgICAgICByZXR1cm4gKGRlc2NyaXB0b3IgfHwgMClba2V5XSA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoZGljdGlvbmFyeSwga2V5KTtcbiAgICAgIH0pIDpcbiAgICAgIHZvaWQoMCk7XG4gICAgcmV0dXJuIGRlc2NyaXB0b3I7XG4gIH0sIE9iamVjdC5jcmVhdGUoT2JqZWN0LnByb3RvdHlwZSkpKTtcbn07XG5leHBvcnRzLm1lcmdlID0gbWVyZ2U7XG5cbnZhciBpc0NvbnRhaW5zVmVjdG9yID0gZnVuY3Rpb24gaXNDb250YWluc1ZlY3Rvcih2ZWN0b3IsIGVsZW1lbnQpIHtcbiAgcmV0dXJuIHZlY3Rvci5pbmRleE9mKGVsZW1lbnQpID49IDA7XG59O1xuZXhwb3J0cy5pc0NvbnRhaW5zVmVjdG9yID0gaXNDb250YWluc1ZlY3RvcjtcblxudmFyIG1hcERpY3Rpb25hcnkgPSBmdW5jdGlvbiBtYXBEaWN0aW9uYXJ5KHNvdXJjZSwgZikge1xuICByZXR1cm4gT2JqZWN0LmtleXMoc291cmNlKS5yZWR1Y2UoZnVuY3Rpb24odGFyZ2V0LCBrZXkpIHtcbiAgICAodGFyZ2V0IHx8IDApW2tleV0gPSBmKChzb3VyY2UgfHwgMClba2V5XSk7XG4gICAgcmV0dXJuIHRhcmdldDtcbiAgfSwge30pO1xufTtcbmV4cG9ydHMubWFwRGljdGlvbmFyeSA9IG1hcERpY3Rpb25hcnk7XG5cbnZhciB0b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG5leHBvcnRzLnRvU3RyaW5nID0gdG9TdHJpbmc7XG5cbnZhciBpc0ZuID0gdHlwZW9mKC8uLykgPT09IFwiZnVuY3Rpb25cIiA/XG4gIGZ1bmN0aW9uIGlzRm4oeCkge1xuICAgIHJldHVybiB0b1N0cmluZy5jYWxsKHgpID09PSBcIltvYmplY3QgRnVuY3Rpb25dXCI7XG4gIH0gOlxuICBmdW5jdGlvbiBpc0ZuKHgpIHtcbiAgICByZXR1cm4gdHlwZW9mKHgpID09PSBcImZ1bmN0aW9uXCI7XG4gIH07XG5leHBvcnRzLmlzRm4gPSBpc0ZuO1xuXG52YXIgaXNTdHJpbmcgPSBmdW5jdGlvbiBpc1N0cmluZyh4KSB7XG4gIHJldHVybiAodHlwZW9mKHgpID09PSBcInN0cmluZ1wiKSB8fCAodG9TdHJpbmcuY2FsbCh4KSA9PT0gXCJbb2JqZWN0IFN0cmluZ11cIik7XG59O1xuZXhwb3J0cy5pc1N0cmluZyA9IGlzU3RyaW5nO1xuXG52YXIgaXNOdW1iZXIgPSBmdW5jdGlvbiBpc051bWJlcih4KSB7XG4gIHJldHVybiAodHlwZW9mKHgpID09PSBcIm51bWJlclwiKSB8fCAodG9TdHJpbmcuY2FsbCh4KSA9PT0gXCJbb2JqZWN0IE51bWJlcl1cIik7XG59O1xuZXhwb3J0cy5pc051bWJlciA9IGlzTnVtYmVyO1xuXG52YXIgaXNWZWN0b3IgPSBpc0ZuKEFycmF5LmlzQXJyYXkpID9cbiAgQXJyYXkuaXNBcnJheSA6XG4gIGZ1bmN0aW9uIGlzVmVjdG9yKHgpIHtcbiAgICByZXR1cm4gdG9TdHJpbmcuY2FsbCh4KSA9PT0gXCJbb2JqZWN0IEFycmF5XVwiO1xuICB9O1xuZXhwb3J0cy5pc1ZlY3RvciA9IGlzVmVjdG9yO1xuXG52YXIgaXNEYXRlID0gZnVuY3Rpb24gaXNEYXRlKHgpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwoeCkgPT09IFwiW29iamVjdCBEYXRlXVwiO1xufTtcbmV4cG9ydHMuaXNEYXRlID0gaXNEYXRlO1xuXG52YXIgaXNCb29sZWFuID0gZnVuY3Rpb24gaXNCb29sZWFuKHgpIHtcbiAgcmV0dXJuICh4ID09PSB0cnVlKSB8fCAoeCA9PT0gZmFsc2UpIHx8ICh0b1N0cmluZy5jYWxsKHgpID09PSBcIltvYmplY3QgQm9vbGVhbl1cIik7XG59O1xuZXhwb3J0cy5pc0Jvb2xlYW4gPSBpc0Jvb2xlYW47XG5cbnZhciBpc1JlUGF0dGVybiA9IGZ1bmN0aW9uIGlzUmVQYXR0ZXJuKHgpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwoeCkgPT09IFwiW29iamVjdCBSZWdFeHBdXCI7XG59O1xuZXhwb3J0cy5pc1JlUGF0dGVybiA9IGlzUmVQYXR0ZXJuO1xuXG52YXIgaXNPYmplY3QgPSBmdW5jdGlvbiBpc09iamVjdCh4KSB7XG4gIHJldHVybiB4ICYmICh0eXBlb2YoeCkgPT09IFwib2JqZWN0XCIpO1xufTtcbmV4cG9ydHMuaXNPYmplY3QgPSBpc09iamVjdDtcblxudmFyIGlzTmlsID0gZnVuY3Rpb24gaXNOaWwoeCkge1xuICByZXR1cm4gKHggPT09IHZvaWQoMCkpIHx8ICh4ID09PSBudWxsKTtcbn07XG5leHBvcnRzLmlzTmlsID0gaXNOaWw7XG5cbnZhciBpc1RydWUgPSBmdW5jdGlvbiBpc1RydWUoeCkge1xuICByZXR1cm4geCA9PT0gdHJ1ZTtcbn07XG5leHBvcnRzLmlzVHJ1ZSA9IGlzVHJ1ZTtcblxudmFyIGlzRmFsc2UgPSBmdW5jdGlvbiBpc0ZhbHNlKHgpIHtcbiAgcmV0dXJuIHggPT09IHRydWU7XG59O1xuZXhwb3J0cy5pc0ZhbHNlID0gaXNGYWxzZTtcblxudmFyIHJlRmluZCA9IGZ1bmN0aW9uIHJlRmluZChyZSwgcykge1xuICB2YXIgbWF0Y2hlcyA9IHJlLmV4ZWMocyk7XG4gIHJldHVybiAhKGlzTmlsKG1hdGNoZXMpKSA/XG4gICAgbWF0Y2hlcy5sZW5ndGggPT09IDEgP1xuICAgICAgKG1hdGNoZXMgfHwgMClbMF0gOlxuICAgICAgbWF0Y2hlcyA6XG4gICAgdm9pZCgwKTtcbn07XG5leHBvcnRzLnJlRmluZCA9IHJlRmluZDtcblxudmFyIHJlTWF0Y2hlcyA9IGZ1bmN0aW9uIHJlTWF0Y2hlcyhwYXR0ZXJuLCBzb3VyY2UpIHtcbiAgdmFyIG1hdGNoZXMgPSBwYXR0ZXJuLmV4ZWMoc291cmNlKTtcbiAgcmV0dXJuICghKGlzTmlsKG1hdGNoZXMpKSkgJiYgKChtYXRjaGVzIHx8IDApWzBdID09PSBzb3VyY2UpID9cbiAgICBtYXRjaGVzLmxlbmd0aCA9PT0gMSA/XG4gICAgICAobWF0Y2hlcyB8fCAwKVswXSA6XG4gICAgICBtYXRjaGVzIDpcbiAgICB2b2lkKDApO1xufTtcbmV4cG9ydHMucmVNYXRjaGVzID0gcmVNYXRjaGVzO1xuXG52YXIgcmVQYXR0ZXJuID0gZnVuY3Rpb24gcmVQYXR0ZXJuKHMpIHtcbiAgdmFyIG1hdGNoID0gcmVGaW5kKC9eKD86XFwoXFw/KFtpZG1zdXhdKilcXCkpPyguKikvLCBzKTtcbiAgcmV0dXJuIG5ldyBSZWdFeHAoKG1hdGNoIHx8IDApWzJdLCAobWF0Y2ggfHwgMClbMV0pO1xufTtcbmV4cG9ydHMucmVQYXR0ZXJuID0gcmVQYXR0ZXJuO1xuXG52YXIgaW5jID0gZnVuY3Rpb24gaW5jKHgpIHtcbiAgcmV0dXJuIHggKyAxO1xufTtcbmV4cG9ydHMuaW5jID0gaW5jO1xuXG52YXIgZGVjID0gZnVuY3Rpb24gZGVjKHgpIHtcbiAgcmV0dXJuIHggLSAxO1xufTtcbmV4cG9ydHMuZGVjID0gZGVjO1xuXG52YXIgc3RyID0gZnVuY3Rpb24gc3RyKCkge1xuICByZXR1cm4gU3RyaW5nLnByb3RvdHlwZS5jb25jYXQuYXBwbHkoXCJcIiwgYXJndW1lbnRzKTtcbn07XG5leHBvcnRzLnN0ciA9IHN0cjtcblxudmFyIGNoYXIgPSBmdW5jdGlvbiBjaGFyKGNvZGUpIHtcbiAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUoY29kZSk7XG59O1xuZXhwb3J0cy5jaGFyID0gY2hhcjtcblxudmFyIGludCA9IGZ1bmN0aW9uIGludCh4KSB7XG4gIHJldHVybiBpc051bWJlcih4KSA/XG4gICAgeCA+PSAwID9cbiAgICAgIE1hdGguZmxvb3IoeCkgOlxuICAgICAgTWF0aC5mbG9vcih4KSA6XG4gICAgeC5jaGFyQ29kZUF0KDApO1xufTtcbmV4cG9ydHMuaW50ID0gaW50O1xuXG52YXIgc3VicyA9IGZ1bmN0aW9uIHN1YnMoc3RyaW5nLCBzdGFydCwgZW5kKSB7XG4gIHJldHVybiBzdHJpbmcuc3Vic3RyaW5nKHN0YXJ0LCBlbmQpO1xufTtcbmV4cG9ydHMuc3VicyA9IHN1YnM7XG5cbnZhciBpc1BhdHRlcm5FcXVhbCA9IGZ1bmN0aW9uIGlzUGF0dGVybkVxdWFsKHgsIHkpIHtcbiAgcmV0dXJuIChpc1JlUGF0dGVybih4KSkgJiYgKGlzUmVQYXR0ZXJuKHkpKSAmJiAoeC5zb3VyY2UgPT09IHkuc291cmNlKSAmJiAoeC5nbG9iYWwgPT09IHkuZ2xvYmFsKSAmJiAoeC5tdWx0aWxpbmUgPT09IHkubXVsdGlsaW5lKSAmJiAoeC5pZ25vcmVDYXNlID09PSB5Lmlnbm9yZUNhc2UpO1xufTtcblxudmFyIGlzRGF0ZUVxdWFsID0gZnVuY3Rpb24gaXNEYXRlRXF1YWwoeCwgeSkge1xuICByZXR1cm4gKGlzRGF0ZSh4KSkgJiYgKGlzRGF0ZSh5KSkgJiYgKE51bWJlcih4KSA9PT0gTnVtYmVyKHkpKTtcbn07XG5cbnZhciBpc0RpY3Rpb25hcnlFcXVhbCA9IGZ1bmN0aW9uIGlzRGljdGlvbmFyeUVxdWFsKHgsIHkpIHtcbiAgcmV0dXJuIChpc09iamVjdCh4KSkgJiYgKGlzT2JqZWN0KHkpKSAmJiAoKGZ1bmN0aW9uKCkge1xuICAgIHZhciB4S2V5cyA9IGtleXMoeCk7XG4gICAgdmFyIHlLZXlzID0ga2V5cyh5KTtcbiAgICB2YXIgeENvdW50ID0geEtleXMubGVuZ3RoO1xuICAgIHZhciB5Q291bnQgPSB5S2V5cy5sZW5ndGg7XG4gICAgcmV0dXJuICh4Q291bnQgPT09IHlDb3VudCkgJiYgKChmdW5jdGlvbiBsb29wKGluZGV4LCBjb3VudCwga2V5cykge1xuICAgICAgdmFyIHJlY3VyID0gbG9vcDtcbiAgICAgIHdoaWxlIChyZWN1ciA9PT0gbG9vcCkge1xuICAgICAgICByZWN1ciA9IGluZGV4IDwgY291bnQgP1xuICAgICAgICBpc0VxdWl2YWxlbnQoKHggfHwgMClbKGtleXMgfHwgMClbaW5kZXhdXSwgKHkgfHwgMClbKGtleXMgfHwgMClbaW5kZXhdXSkgP1xuICAgICAgICAgIChpbmRleCA9IGluYyhpbmRleCksIGNvdW50ID0gY291bnQsIGtleXMgPSBrZXlzLCBsb29wKSA6XG4gICAgICAgICAgZmFsc2UgOlxuICAgICAgICB0cnVlO1xuICAgICAgfTtcbiAgICAgIHJldHVybiByZWN1cjtcbiAgICB9KSgwLCB4Q291bnQsIHhLZXlzKSk7XG4gIH0pKCkpO1xufTtcblxudmFyIGlzVmVjdG9yRXF1YWwgPSBmdW5jdGlvbiBpc1ZlY3RvckVxdWFsKHgsIHkpIHtcbiAgcmV0dXJuIChpc1ZlY3Rvcih4KSkgJiYgKGlzVmVjdG9yKHkpKSAmJiAoeC5sZW5ndGggPT09IHkubGVuZ3RoKSAmJiAoKGZ1bmN0aW9uIGxvb3AoeHMsIHlzLCBpbmRleCwgY291bnQpIHtcbiAgICB2YXIgcmVjdXIgPSBsb29wO1xuICAgIHdoaWxlIChyZWN1ciA9PT0gbG9vcCkge1xuICAgICAgcmVjdXIgPSBpbmRleCA8IGNvdW50ID9cbiAgICAgIGlzRXF1aXZhbGVudCgoeHMgfHwgMClbaW5kZXhdLCAoeXMgfHwgMClbaW5kZXhdKSA/XG4gICAgICAgICh4cyA9IHhzLCB5cyA9IHlzLCBpbmRleCA9IGluYyhpbmRleCksIGNvdW50ID0gY291bnQsIGxvb3ApIDpcbiAgICAgICAgZmFsc2UgOlxuICAgICAgdHJ1ZTtcbiAgICB9O1xuICAgIHJldHVybiByZWN1cjtcbiAgfSkoeCwgeSwgMCwgeC5sZW5ndGgpKTtcbn07XG5cbnZhciBpc0VxdWl2YWxlbnQgPSBmdW5jdGlvbiBpc0VxdWl2YWxlbnQoeCwgeSkge1xuICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICBjYXNlIDE6XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICBjYXNlIDI6XG4gICAgICByZXR1cm4gKHggPT09IHkpIHx8IChpc05pbCh4KSA/XG4gICAgICAgIGlzTmlsKHkpIDpcbiAgICAgIGlzTmlsKHkpID9cbiAgICAgICAgaXNOaWwoeCkgOlxuICAgICAgaXNTdHJpbmcoeCkgP1xuICAgICAgICBmYWxzZSA6XG4gICAgICBpc051bWJlcih4KSA/XG4gICAgICAgIGZhbHNlIDpcbiAgICAgIGlzRm4oeCkgP1xuICAgICAgICBmYWxzZSA6XG4gICAgICBpc0Jvb2xlYW4oeCkgP1xuICAgICAgICBmYWxzZSA6XG4gICAgICBpc0RhdGUoeCkgP1xuICAgICAgICBpc0RhdGVFcXVhbCh4LCB5KSA6XG4gICAgICBpc1ZlY3Rvcih4KSA/XG4gICAgICAgIGlzVmVjdG9yRXF1YWwoeCwgeSwgW10sIFtdKSA6XG4gICAgICBpc1JlUGF0dGVybih4KSA/XG4gICAgICAgIGlzUGF0dGVybkVxdWFsKHgsIHkpIDpcbiAgICAgIFwiZWxzZVwiID9cbiAgICAgICAgaXNEaWN0aW9uYXJ5RXF1YWwoeCwgeSkgOlxuICAgICAgICB2b2lkKDApKTtcblxuICAgIGRlZmF1bHQ6XG4gICAgICB2YXIgbW9yZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMik7XG4gICAgICByZXR1cm4gKGZ1bmN0aW9uIGxvb3AocHJldmlvdXMsIGN1cnJlbnQsIGluZGV4LCBjb3VudCkge1xuICAgICAgICB2YXIgcmVjdXIgPSBsb29wO1xuICAgICAgICB3aGlsZSAocmVjdXIgPT09IGxvb3ApIHtcbiAgICAgICAgICByZWN1ciA9IChpc0VxdWl2YWxlbnQocHJldmlvdXMsIGN1cnJlbnQpKSAmJiAoaW5kZXggPCBjb3VudCA/XG4gICAgICAgICAgKHByZXZpb3VzID0gY3VycmVudCwgY3VycmVudCA9IChtb3JlIHx8IDApW2luZGV4XSwgaW5kZXggPSBpbmMoaW5kZXgpLCBjb3VudCA9IGNvdW50LCBsb29wKSA6XG4gICAgICAgICAgdHJ1ZSk7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiByZWN1cjtcbiAgICAgIH0pKHgsIHksIDAsIG1vcmUubGVuZ3RoKTtcbiAgfTtcbiAgcmV0dXJuIHZvaWQoMCk7XG59O1xuXG52YXIgaXNFcXVhbCA9IGlzRXF1aXZhbGVudDtcbmV4cG9ydHMuaXNFcXVhbCA9IGlzRXF1YWw7XG5cbnZhciBpc1N0cmljdEVxdWFsID0gZnVuY3Rpb24gaXNTdHJpY3RFcXVhbCh4LCB5KSB7XG4gIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgIGNhc2UgMTpcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIGNhc2UgMjpcbiAgICAgIHJldHVybiB4ID09PSB5O1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIHZhciBtb3JlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAyKTtcbiAgICAgIHJldHVybiAoZnVuY3Rpb24gbG9vcChwcmV2aW91cywgY3VycmVudCwgaW5kZXgsIGNvdW50KSB7XG4gICAgICAgIHZhciByZWN1ciA9IGxvb3A7XG4gICAgICAgIHdoaWxlIChyZWN1ciA9PT0gbG9vcCkge1xuICAgICAgICAgIHJlY3VyID0gKHByZXZpb3VzID09PSBjdXJyZW50KSAmJiAoaW5kZXggPCBjb3VudCA/XG4gICAgICAgICAgKHByZXZpb3VzID0gY3VycmVudCwgY3VycmVudCA9IChtb3JlIHx8IDApW2luZGV4XSwgaW5kZXggPSBpbmMoaW5kZXgpLCBjb3VudCA9IGNvdW50LCBsb29wKSA6XG4gICAgICAgICAgdHJ1ZSk7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiByZWN1cjtcbiAgICAgIH0pKHgsIHksIDAsIG1vcmUubGVuZ3RoKTtcbiAgfTtcbiAgcmV0dXJuIHZvaWQoMCk7XG59O1xuZXhwb3J0cy5pc1N0cmljdEVxdWFsID0gaXNTdHJpY3RFcXVhbDtcblxudmFyIGdyZWF0ZXJUaGFuID0gZnVuY3Rpb24gZ3JlYXRlclRoYW4oeCwgeSkge1xuICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICBjYXNlIDE6XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICBjYXNlIDI6XG4gICAgICByZXR1cm4geCA+IHk7XG5cbiAgICBkZWZhdWx0OlxuICAgICAgdmFyIG1vcmUgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDIpO1xuICAgICAgcmV0dXJuIChmdW5jdGlvbiBsb29wKHByZXZpb3VzLCBjdXJyZW50LCBpbmRleCwgY291bnQpIHtcbiAgICAgICAgdmFyIHJlY3VyID0gbG9vcDtcbiAgICAgICAgd2hpbGUgKHJlY3VyID09PSBsb29wKSB7XG4gICAgICAgICAgcmVjdXIgPSAocHJldmlvdXMgPiBjdXJyZW50KSAmJiAoaW5kZXggPCBjb3VudCA/XG4gICAgICAgICAgKHByZXZpb3VzID0gY3VycmVudCwgY3VycmVudCA9IChtb3JlIHx8IDApW2luZGV4XSwgaW5kZXggPSBpbmMoaW5kZXgpLCBjb3VudCA9IGNvdW50LCBsb29wKSA6XG4gICAgICAgICAgdHJ1ZSk7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiByZWN1cjtcbiAgICAgIH0pKHgsIHksIDAsIG1vcmUubGVuZ3RoKTtcbiAgfTtcbiAgcmV0dXJuIHZvaWQoMCk7XG59O1xuZXhwb3J0cy5ncmVhdGVyVGhhbiA9IGdyZWF0ZXJUaGFuO1xuXG52YXIgbm90TGVzc1RoYW4gPSBmdW5jdGlvbiBub3RMZXNzVGhhbih4LCB5KSB7XG4gIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgIGNhc2UgMTpcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIGNhc2UgMjpcbiAgICAgIHJldHVybiB4ID49IHk7XG5cbiAgICBkZWZhdWx0OlxuICAgICAgdmFyIG1vcmUgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDIpO1xuICAgICAgcmV0dXJuIChmdW5jdGlvbiBsb29wKHByZXZpb3VzLCBjdXJyZW50LCBpbmRleCwgY291bnQpIHtcbiAgICAgICAgdmFyIHJlY3VyID0gbG9vcDtcbiAgICAgICAgd2hpbGUgKHJlY3VyID09PSBsb29wKSB7XG4gICAgICAgICAgcmVjdXIgPSAocHJldmlvdXMgPj0gY3VycmVudCkgJiYgKGluZGV4IDwgY291bnQgP1xuICAgICAgICAgIChwcmV2aW91cyA9IGN1cnJlbnQsIGN1cnJlbnQgPSAobW9yZSB8fCAwKVtpbmRleF0sIGluZGV4ID0gaW5jKGluZGV4KSwgY291bnQgPSBjb3VudCwgbG9vcCkgOlxuICAgICAgICAgIHRydWUpO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gcmVjdXI7XG4gICAgICB9KSh4LCB5LCAwLCBtb3JlLmxlbmd0aCk7XG4gIH07XG4gIHJldHVybiB2b2lkKDApO1xufTtcbmV4cG9ydHMubm90TGVzc1RoYW4gPSBub3RMZXNzVGhhbjtcblxudmFyIGxlc3NUaGFuID0gZnVuY3Rpb24gbGVzc1RoYW4oeCwgeSkge1xuICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICBjYXNlIDE6XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICBjYXNlIDI6XG4gICAgICByZXR1cm4geCA8IHk7XG5cbiAgICBkZWZhdWx0OlxuICAgICAgdmFyIG1vcmUgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDIpO1xuICAgICAgcmV0dXJuIChmdW5jdGlvbiBsb29wKHByZXZpb3VzLCBjdXJyZW50LCBpbmRleCwgY291bnQpIHtcbiAgICAgICAgdmFyIHJlY3VyID0gbG9vcDtcbiAgICAgICAgd2hpbGUgKHJlY3VyID09PSBsb29wKSB7XG4gICAgICAgICAgcmVjdXIgPSAocHJldmlvdXMgPCBjdXJyZW50KSAmJiAoaW5kZXggPCBjb3VudCA/XG4gICAgICAgICAgKHByZXZpb3VzID0gY3VycmVudCwgY3VycmVudCA9IChtb3JlIHx8IDApW2luZGV4XSwgaW5kZXggPSBpbmMoaW5kZXgpLCBjb3VudCA9IGNvdW50LCBsb29wKSA6XG4gICAgICAgICAgdHJ1ZSk7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiByZWN1cjtcbiAgICAgIH0pKHgsIHksIDAsIG1vcmUubGVuZ3RoKTtcbiAgfTtcbiAgcmV0dXJuIHZvaWQoMCk7XG59O1xuZXhwb3J0cy5sZXNzVGhhbiA9IGxlc3NUaGFuO1xuXG52YXIgbm90R3JlYXRlclRoYW4gPSBmdW5jdGlvbiBub3RHcmVhdGVyVGhhbih4LCB5KSB7XG4gIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgIGNhc2UgMTpcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIGNhc2UgMjpcbiAgICAgIHJldHVybiB4IDw9IHk7XG5cbiAgICBkZWZhdWx0OlxuICAgICAgdmFyIG1vcmUgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDIpO1xuICAgICAgcmV0dXJuIChmdW5jdGlvbiBsb29wKHByZXZpb3VzLCBjdXJyZW50LCBpbmRleCwgY291bnQpIHtcbiAgICAgICAgdmFyIHJlY3VyID0gbG9vcDtcbiAgICAgICAgd2hpbGUgKHJlY3VyID09PSBsb29wKSB7XG4gICAgICAgICAgcmVjdXIgPSAocHJldmlvdXMgPD0gY3VycmVudCkgJiYgKGluZGV4IDwgY291bnQgP1xuICAgICAgICAgIChwcmV2aW91cyA9IGN1cnJlbnQsIGN1cnJlbnQgPSAobW9yZSB8fCAwKVtpbmRleF0sIGluZGV4ID0gaW5jKGluZGV4KSwgY291bnQgPSBjb3VudCwgbG9vcCkgOlxuICAgICAgICAgIHRydWUpO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gcmVjdXI7XG4gICAgICB9KSh4LCB5LCAwLCBtb3JlLmxlbmd0aCk7XG4gIH07XG4gIHJldHVybiB2b2lkKDApO1xufTtcbmV4cG9ydHMubm90R3JlYXRlclRoYW4gPSBub3RHcmVhdGVyVGhhbjtcblxudmFyIHN1bSA9IGZ1bmN0aW9uIHN1bShhLCBiLCBjLCBkLCBlLCBmKSB7XG4gIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgIGNhc2UgMDpcbiAgICAgIHJldHVybiAwO1xuICAgIGNhc2UgMTpcbiAgICAgIHJldHVybiBhO1xuICAgIGNhc2UgMjpcbiAgICAgIHJldHVybiBhICsgYjtcbiAgICBjYXNlIDM6XG4gICAgICByZXR1cm4gYSArIGIgKyBjO1xuICAgIGNhc2UgNDpcbiAgICAgIHJldHVybiBhICsgYiArIGMgKyBkO1xuICAgIGNhc2UgNTpcbiAgICAgIHJldHVybiBhICsgYiArIGMgKyBkICsgZTtcbiAgICBjYXNlIDY6XG4gICAgICByZXR1cm4gYSArIGIgKyBjICsgZCArIGUgKyBmO1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIHZhciBtb3JlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCA2KTtcbiAgICAgIHJldHVybiAoZnVuY3Rpb24gbG9vcCh2YWx1ZSwgaW5kZXgsIGNvdW50KSB7XG4gICAgICAgIHZhciByZWN1ciA9IGxvb3A7XG4gICAgICAgIHdoaWxlIChyZWN1ciA9PT0gbG9vcCkge1xuICAgICAgICAgIHJlY3VyID0gaW5kZXggPCBjb3VudCA/XG4gICAgICAgICAgKHZhbHVlID0gdmFsdWUgKyAoKG1vcmUgfHwgMClbaW5kZXhdKSwgaW5kZXggPSBpbmMoaW5kZXgpLCBjb3VudCA9IGNvdW50LCBsb29wKSA6XG4gICAgICAgICAgdmFsdWU7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiByZWN1cjtcbiAgICAgIH0pKGEgKyBiICsgYyArIGQgKyBlICsgZiwgMCwgbW9yZS5sZW5ndGgpO1xuICB9O1xuICByZXR1cm4gdm9pZCgwKTtcbn07XG5leHBvcnRzLnN1bSA9IHN1bTtcblxudmFyIHN1YnRyYWN0ID0gZnVuY3Rpb24gc3VidHJhY3QoYSwgYiwgYywgZCwgZSwgZikge1xuICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICBjYXNlIDA6XG4gICAgICByZXR1cm4gKGZ1bmN0aW9uKCkgeyB0aHJvdyBUeXBlRXJyb3IoXCJXcm9uZyBudW1iZXIgb2YgYXJncyBwYXNzZWQgdG86IC1cIik7IH0pKCk7XG4gICAgY2FzZSAxOlxuICAgICAgcmV0dXJuIDAgLSBhO1xuICAgIGNhc2UgMjpcbiAgICAgIHJldHVybiBhIC0gYjtcbiAgICBjYXNlIDM6XG4gICAgICByZXR1cm4gYSAtIGIgLSBjO1xuICAgIGNhc2UgNDpcbiAgICAgIHJldHVybiBhIC0gYiAtIGMgLSBkO1xuICAgIGNhc2UgNTpcbiAgICAgIHJldHVybiBhIC0gYiAtIGMgLSBkIC0gZTtcbiAgICBjYXNlIDY6XG4gICAgICByZXR1cm4gYSAtIGIgLSBjIC0gZCAtIGUgLSBmO1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIHZhciBtb3JlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCA2KTtcbiAgICAgIHJldHVybiAoZnVuY3Rpb24gbG9vcCh2YWx1ZSwgaW5kZXgsIGNvdW50KSB7XG4gICAgICAgIHZhciByZWN1ciA9IGxvb3A7XG4gICAgICAgIHdoaWxlIChyZWN1ciA9PT0gbG9vcCkge1xuICAgICAgICAgIHJlY3VyID0gaW5kZXggPCBjb3VudCA/XG4gICAgICAgICAgKHZhbHVlID0gdmFsdWUgLSAoKG1vcmUgfHwgMClbaW5kZXhdKSwgaW5kZXggPSBpbmMoaW5kZXgpLCBjb3VudCA9IGNvdW50LCBsb29wKSA6XG4gICAgICAgICAgdmFsdWU7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiByZWN1cjtcbiAgICAgIH0pKGEgLSBiIC0gYyAtIGQgLSBlIC0gZiwgMCwgbW9yZS5sZW5ndGgpO1xuICB9O1xuICByZXR1cm4gdm9pZCgwKTtcbn07XG5leHBvcnRzLnN1YnRyYWN0ID0gc3VidHJhY3Q7XG5cbnZhciBkaXZpZGUgPSBmdW5jdGlvbiBkaXZpZGUoYSwgYiwgYywgZCwgZSwgZikge1xuICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICBjYXNlIDA6XG4gICAgICByZXR1cm4gKGZ1bmN0aW9uKCkgeyB0aHJvdyBUeXBlRXJyb3IoXCJXcm9uZyBudW1iZXIgb2YgYXJncyBwYXNzZWQgdG86IC9cIik7IH0pKCk7XG4gICAgY2FzZSAxOlxuICAgICAgcmV0dXJuIDEgLyBhO1xuICAgIGNhc2UgMjpcbiAgICAgIHJldHVybiBhIC8gYjtcbiAgICBjYXNlIDM6XG4gICAgICByZXR1cm4gYSAvIGIgLyBjO1xuICAgIGNhc2UgNDpcbiAgICAgIHJldHVybiBhIC8gYiAvIGMgLyBkO1xuICAgIGNhc2UgNTpcbiAgICAgIHJldHVybiBhIC8gYiAvIGMgLyBkIC8gZTtcbiAgICBjYXNlIDY6XG4gICAgICByZXR1cm4gYSAvIGIgLyBjIC8gZCAvIGUgLyBmO1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIHZhciBtb3JlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCA2KTtcbiAgICAgIHJldHVybiAoZnVuY3Rpb24gbG9vcCh2YWx1ZSwgaW5kZXgsIGNvdW50KSB7XG4gICAgICAgIHZhciByZWN1ciA9IGxvb3A7XG4gICAgICAgIHdoaWxlIChyZWN1ciA9PT0gbG9vcCkge1xuICAgICAgICAgIHJlY3VyID0gaW5kZXggPCBjb3VudCA/XG4gICAgICAgICAgKHZhbHVlID0gdmFsdWUgLyAoKG1vcmUgfHwgMClbaW5kZXhdKSwgaW5kZXggPSBpbmMoaW5kZXgpLCBjb3VudCA9IGNvdW50LCBsb29wKSA6XG4gICAgICAgICAgdmFsdWU7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiByZWN1cjtcbiAgICAgIH0pKGEgLyBiIC8gYyAvIGQgLyBlIC8gZiwgMCwgbW9yZS5sZW5ndGgpO1xuICB9O1xuICByZXR1cm4gdm9pZCgwKTtcbn07XG5leHBvcnRzLmRpdmlkZSA9IGRpdmlkZTtcblxudmFyIG11bHRpcGx5ID0gZnVuY3Rpb24gbXVsdGlwbHkoYSwgYiwgYywgZCwgZSwgZikge1xuICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICBjYXNlIDA6XG4gICAgICByZXR1cm4gMTtcbiAgICBjYXNlIDE6XG4gICAgICByZXR1cm4gYTtcbiAgICBjYXNlIDI6XG4gICAgICByZXR1cm4gYSAqIGI7XG4gICAgY2FzZSAzOlxuICAgICAgcmV0dXJuIGEgKiBiICogYztcbiAgICBjYXNlIDQ6XG4gICAgICByZXR1cm4gYSAqIGIgKiBjICogZDtcbiAgICBjYXNlIDU6XG4gICAgICByZXR1cm4gYSAqIGIgKiBjICogZCAqIGU7XG4gICAgY2FzZSA2OlxuICAgICAgcmV0dXJuIGEgKiBiICogYyAqIGQgKiBlICogZjtcblxuICAgIGRlZmF1bHQ6XG4gICAgICB2YXIgbW9yZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgNik7XG4gICAgICByZXR1cm4gKGZ1bmN0aW9uIGxvb3AodmFsdWUsIGluZGV4LCBjb3VudCkge1xuICAgICAgICB2YXIgcmVjdXIgPSBsb29wO1xuICAgICAgICB3aGlsZSAocmVjdXIgPT09IGxvb3ApIHtcbiAgICAgICAgICByZWN1ciA9IGluZGV4IDwgY291bnQgP1xuICAgICAgICAgICh2YWx1ZSA9IHZhbHVlICogKChtb3JlIHx8IDApW2luZGV4XSksIGluZGV4ID0gaW5jKGluZGV4KSwgY291bnQgPSBjb3VudCwgbG9vcCkgOlxuICAgICAgICAgIHZhbHVlO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gcmVjdXI7XG4gICAgICB9KShhICogYiAqIGMgKiBkICogZSAqIGYsIDAsIG1vcmUubGVuZ3RoKTtcbiAgfTtcbiAgcmV0dXJuIHZvaWQoMCk7XG59O1xuZXhwb3J0cy5tdWx0aXBseSA9IG11bHRpcGx5O1xuXG52YXIgYW5kID0gZnVuY3Rpb24gYW5kKGEsIGIsIGMsIGQsIGUsIGYpIHtcbiAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgY2FzZSAwOlxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgY2FzZSAxOlxuICAgICAgcmV0dXJuIGE7XG4gICAgY2FzZSAyOlxuICAgICAgcmV0dXJuIGEgJiYgYjtcbiAgICBjYXNlIDM6XG4gICAgICByZXR1cm4gYSAmJiBiICYmIGM7XG4gICAgY2FzZSA0OlxuICAgICAgcmV0dXJuIGEgJiYgYiAmJiBjICYmIGQ7XG4gICAgY2FzZSA1OlxuICAgICAgcmV0dXJuIGEgJiYgYiAmJiBjICYmIGQgJiYgZTtcbiAgICBjYXNlIDY6XG4gICAgICByZXR1cm4gYSAmJiBiICYmIGMgJiYgZCAmJiBlICYmIGY7XG5cbiAgICBkZWZhdWx0OlxuICAgICAgdmFyIG1vcmUgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDYpO1xuICAgICAgcmV0dXJuIChmdW5jdGlvbiBsb29wKHZhbHVlLCBpbmRleCwgY291bnQpIHtcbiAgICAgICAgdmFyIHJlY3VyID0gbG9vcDtcbiAgICAgICAgd2hpbGUgKHJlY3VyID09PSBsb29wKSB7XG4gICAgICAgICAgcmVjdXIgPSBpbmRleCA8IGNvdW50ID9cbiAgICAgICAgICAodmFsdWUgPSB2YWx1ZSAmJiAoKG1vcmUgfHwgMClbaW5kZXhdKSwgaW5kZXggPSBpbmMoaW5kZXgpLCBjb3VudCA9IGNvdW50LCBsb29wKSA6XG4gICAgICAgICAgdmFsdWU7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiByZWN1cjtcbiAgICAgIH0pKGEgJiYgYiAmJiBjICYmIGQgJiYgZSAmJiBmLCAwLCBtb3JlLmxlbmd0aCk7XG4gIH07XG4gIHJldHVybiB2b2lkKDApO1xufTtcbmV4cG9ydHMuYW5kID0gYW5kO1xuXG52YXIgb3IgPSBmdW5jdGlvbiBvcihhLCBiLCBjLCBkLCBlLCBmKSB7XG4gIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgIGNhc2UgMDpcbiAgICAgIHJldHVybiB2b2lkKDApO1xuICAgIGNhc2UgMTpcbiAgICAgIHJldHVybiBhO1xuICAgIGNhc2UgMjpcbiAgICAgIHJldHVybiBhIHx8IGI7XG4gICAgY2FzZSAzOlxuICAgICAgcmV0dXJuIGEgfHwgYiB8fCBjO1xuICAgIGNhc2UgNDpcbiAgICAgIHJldHVybiBhIHx8IGIgfHwgYyB8fCBkO1xuICAgIGNhc2UgNTpcbiAgICAgIHJldHVybiBhIHx8IGIgfHwgYyB8fCBkIHx8IGU7XG4gICAgY2FzZSA2OlxuICAgICAgcmV0dXJuIGEgfHwgYiB8fCBjIHx8IGQgfHwgZSB8fCBmO1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIHZhciBtb3JlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCA2KTtcbiAgICAgIHJldHVybiAoZnVuY3Rpb24gbG9vcCh2YWx1ZSwgaW5kZXgsIGNvdW50KSB7XG4gICAgICAgIHZhciByZWN1ciA9IGxvb3A7XG4gICAgICAgIHdoaWxlIChyZWN1ciA9PT0gbG9vcCkge1xuICAgICAgICAgIHJlY3VyID0gaW5kZXggPCBjb3VudCA/XG4gICAgICAgICAgKHZhbHVlID0gdmFsdWUgfHwgKChtb3JlIHx8IDApW2luZGV4XSksIGluZGV4ID0gaW5jKGluZGV4KSwgY291bnQgPSBjb3VudCwgbG9vcCkgOlxuICAgICAgICAgIHZhbHVlO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gcmVjdXI7XG4gICAgICB9KShhIHx8IGIgfHwgYyB8fCBkIHx8IGUgfHwgZiwgMCwgbW9yZS5sZW5ndGgpO1xuICB9O1xuICByZXR1cm4gdm9pZCgwKTtcbn07XG5leHBvcnRzLm9yID0gb3I7XG5cbnZhciBwcmludCA9IGZ1bmN0aW9uIHByaW50KCkge1xuICB2YXIgbW9yZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMCk7XG4gIHJldHVybiBjb25zb2xlLmxvZy5hcHBseShjb25zb2xlLmxvZywgbW9yZSk7XG59O1xuZXhwb3J0cy5wcmludCA9IHByaW50XG59KSgpIiwidmFyIF9uc18gPSB7XG4gIFwiaWRcIjogXCJ3aXNwLnNlcXVlbmNlXCJcbn07XG52YXIgd2lzcF9ydW50aW1lID0gcmVxdWlyZShcIi4vcnVudGltZVwiKTtcbnZhciBpc05pbCA9IHdpc3BfcnVudGltZS5pc05pbDtcbnZhciBpc1ZlY3RvciA9IHdpc3BfcnVudGltZS5pc1ZlY3RvcjtcbnZhciBpc0ZuID0gd2lzcF9ydW50aW1lLmlzRm47XG52YXIgaXNOdW1iZXIgPSB3aXNwX3J1bnRpbWUuaXNOdW1iZXI7XG52YXIgaXNTdHJpbmcgPSB3aXNwX3J1bnRpbWUuaXNTdHJpbmc7XG52YXIgaXNEaWN0aW9uYXJ5ID0gd2lzcF9ydW50aW1lLmlzRGljdGlvbmFyeTtcbnZhciBrZXlWYWx1ZXMgPSB3aXNwX3J1bnRpbWUua2V5VmFsdWVzO1xudmFyIHN0ciA9IHdpc3BfcnVudGltZS5zdHI7XG52YXIgZGVjID0gd2lzcF9ydW50aW1lLmRlYztcbnZhciBpbmMgPSB3aXNwX3J1bnRpbWUuaW5jO1xudmFyIG1lcmdlID0gd2lzcF9ydW50aW1lLm1lcmdlO1xudmFyIGRpY3Rpb25hcnkgPSB3aXNwX3J1bnRpbWUuZGljdGlvbmFyeTs7O1xuXG52YXIgTGlzdCA9IGZ1bmN0aW9uIExpc3QoaGVhZCwgdGFpbCkge1xuICB0aGlzLmhlYWQgPSBoZWFkO1xuICB0aGlzLnRhaWwgPSB0YWlsIHx8IChsaXN0KCkpO1xuICB0aGlzLmxlbmd0aCA9IGluYyhjb3VudCh0aGlzLnRhaWwpKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5MaXN0LnByb3RvdHlwZS5sZW5ndGggPSAwO1xuXG5MaXN0LnR5cGUgPSBcIndpc3AubGlzdFwiO1xuXG5MaXN0LnByb3RvdHlwZS50eXBlID0gTGlzdC50eXBlO1xuXG5MaXN0LnByb3RvdHlwZS50YWlsID0gT2JqZWN0LmNyZWF0ZShMaXN0LnByb3RvdHlwZSk7XG5cbkxpc3QucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiAoZnVuY3Rpb24gbG9vcChyZXN1bHQsIGxpc3QpIHtcbiAgICB2YXIgcmVjdXIgPSBsb29wO1xuICAgIHdoaWxlIChyZWN1ciA9PT0gbG9vcCkge1xuICAgICAgcmVjdXIgPSBpc0VtcHR5KGxpc3QpID9cbiAgICAgIFwiXCIgKyBcIihcIiArIChyZXN1bHQuc3Vic3RyKDEpKSArIFwiKVwiIDpcbiAgICAgIChyZXN1bHQgPSBcIlwiICsgcmVzdWx0ICsgXCIgXCIgKyAoaXNWZWN0b3IoZmlyc3QobGlzdCkpID9cbiAgICAgICAgXCJcIiArIFwiW1wiICsgKGZpcnN0KGxpc3QpLmpvaW4oXCIgXCIpKSArIFwiXVwiIDpcbiAgICAgIGlzTmlsKGZpcnN0KGxpc3QpKSA/XG4gICAgICAgIFwibmlsXCIgOlxuICAgICAgaXNTdHJpbmcoZmlyc3QobGlzdCkpID9cbiAgICAgICAgSlNPTi5zdHJpbmdpZnkoZmlyc3QobGlzdCkpIDpcbiAgICAgIGlzTnVtYmVyKGZpcnN0KGxpc3QpKSA/XG4gICAgICAgIEpTT04uc3RyaW5naWZ5KGZpcnN0KGxpc3QpKSA6XG4gICAgICAgIGZpcnN0KGxpc3QpKSwgbGlzdCA9IHJlc3QobGlzdCksIGxvb3ApO1xuICAgIH07XG4gICAgcmV0dXJuIHJlY3VyO1xuICB9KShcIlwiLCB0aGlzKTtcbn07XG5cbnZhciBsYXp5U2VxVmFsdWUgPSBmdW5jdGlvbiBsYXp5U2VxVmFsdWUobGF6eVNlcSkge1xuICByZXR1cm4gIShsYXp5U2VxLnJlYWxpemVkKSA/XG4gICAgKGxhenlTZXEucmVhbGl6ZWQgPSB0cnVlKSAmJiAobGF6eVNlcS54ID0gbGF6eVNlcS54KCkpIDpcbiAgICBsYXp5U2VxLng7XG59O1xuXG52YXIgTGF6eVNlcSA9IGZ1bmN0aW9uIExhenlTZXEocmVhbGl6ZWQsIHgpIHtcbiAgdGhpcy5yZWFsaXplZCA9IHJlYWxpemVkIHx8IGZhbHNlO1xuICB0aGlzLnggPSB4O1xuICByZXR1cm4gdGhpcztcbn07XG5cbkxhenlTZXEudHlwZSA9IFwid2lzcC5sYXp5LnNlcVwiO1xuXG5MYXp5U2VxLnByb3RvdHlwZS50eXBlID0gTGF6eVNlcS50eXBlO1xuXG52YXIgbGF6eVNlcSA9IGZ1bmN0aW9uIGxhenlTZXEocmVhbGl6ZWQsIGJvZHkpIHtcbiAgcmV0dXJuIG5ldyBMYXp5U2VxKHJlYWxpemVkLCBib2R5KTtcbn07XG5leHBvcnRzLmxhenlTZXEgPSBsYXp5U2VxO1xuXG52YXIgaXNMYXp5U2VxID0gZnVuY3Rpb24gaXNMYXp5U2VxKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAmJiAoTGF6eVNlcS50eXBlID09PSB2YWx1ZS50eXBlKTtcbn07XG5leHBvcnRzLmlzTGF6eVNlcSA9IGlzTGF6eVNlcTtcblxudW5kZWZpbmVkO1xuXG52YXIgaXNMaXN0ID0gZnVuY3Rpb24gaXNMaXN0KHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAmJiAoTGlzdC50eXBlID09PSB2YWx1ZS50eXBlKTtcbn07XG5leHBvcnRzLmlzTGlzdCA9IGlzTGlzdDtcblxudmFyIGxpc3QgPSBmdW5jdGlvbiBsaXN0KCkge1xuICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA9PT0gMCA/XG4gICAgT2JqZWN0LmNyZWF0ZShMaXN0LnByb3RvdHlwZSkgOlxuICAgIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cykucmVkdWNlUmlnaHQoZnVuY3Rpb24odGFpbCwgaGVhZCkge1xuICAgICAgcmV0dXJuIGNvbnMoaGVhZCwgdGFpbCk7XG4gICAgfSwgbGlzdCgpKTtcbn07XG5leHBvcnRzLmxpc3QgPSBsaXN0O1xuXG52YXIgY29ucyA9IGZ1bmN0aW9uIGNvbnMoaGVhZCwgdGFpbCkge1xuICByZXR1cm4gbmV3IExpc3QoaGVhZCwgdGFpbCk7XG59O1xuZXhwb3J0cy5jb25zID0gY29ucztcblxudmFyIHJldmVyc2VMaXN0ID0gZnVuY3Rpb24gcmV2ZXJzZUxpc3Qoc2VxdWVuY2UpIHtcbiAgcmV0dXJuIChmdW5jdGlvbiBsb29wKGl0ZW1zLCBzb3VyY2UpIHtcbiAgICB2YXIgcmVjdXIgPSBsb29wO1xuICAgIHdoaWxlIChyZWN1ciA9PT0gbG9vcCkge1xuICAgICAgcmVjdXIgPSBpc0VtcHR5KHNvdXJjZSkgP1xuICAgICAgbGlzdC5hcHBseShsaXN0LCBpdGVtcykgOlxuICAgICAgKGl0ZW1zID0gW2ZpcnN0KHNvdXJjZSldLmNvbmNhdChpdGVtcyksIHNvdXJjZSA9IHJlc3Qoc291cmNlKSwgbG9vcCk7XG4gICAgfTtcbiAgICByZXR1cm4gcmVjdXI7XG4gIH0pKFtdLCBzZXF1ZW5jZSk7XG59O1xuXG52YXIgaXNTZXF1ZW50aWFsID0gZnVuY3Rpb24gaXNTZXF1ZW50aWFsKHgpIHtcbiAgcmV0dXJuIChpc0xpc3QoeCkpIHx8IChpc1ZlY3Rvcih4KSkgfHwgKGlzTGF6eVNlcSh4KSkgfHwgKGlzRGljdGlvbmFyeSh4KSkgfHwgKGlzU3RyaW5nKHgpKTtcbn07XG5leHBvcnRzLmlzU2VxdWVudGlhbCA9IGlzU2VxdWVudGlhbDtcblxudmFyIHJldmVyc2UgPSBmdW5jdGlvbiByZXZlcnNlKHNlcXVlbmNlKSB7XG4gIHJldHVybiBpc0xpc3Qoc2VxdWVuY2UpID9cbiAgICByZXZlcnNlTGlzdChzZXF1ZW5jZSkgOlxuICBpc1ZlY3RvcihzZXF1ZW5jZSkgP1xuICAgIHNlcXVlbmNlLnJldmVyc2UoKSA6XG4gIGlzTmlsKHNlcXVlbmNlKSA/XG4gICAgbGlzdCgpIDpcbiAgXCJlbHNlXCIgP1xuICAgIHJldmVyc2Uoc2VxKHNlcXVlbmNlKSkgOlxuICAgIHZvaWQoMCk7XG59O1xuZXhwb3J0cy5yZXZlcnNlID0gcmV2ZXJzZTtcblxudmFyIG1hcCA9IGZ1bmN0aW9uIG1hcChmLCBzZXF1ZW5jZSkge1xuICByZXR1cm4gaXNWZWN0b3Ioc2VxdWVuY2UpID9cbiAgICBzZXF1ZW5jZS5tYXAoZikgOlxuICBpc0xpc3Qoc2VxdWVuY2UpID9cbiAgICBtYXBMaXN0KGYsIHNlcXVlbmNlKSA6XG4gIGlzTmlsKHNlcXVlbmNlKSA/XG4gICAgbGlzdCgpIDpcbiAgXCJlbHNlXCIgP1xuICAgIG1hcChmLCBzZXEoc2VxdWVuY2UpKSA6XG4gICAgdm9pZCgwKTtcbn07XG5leHBvcnRzLm1hcCA9IG1hcDtcblxudmFyIG1hcExpc3QgPSBmdW5jdGlvbiBtYXBMaXN0KGYsIHNlcXVlbmNlKSB7XG4gIHJldHVybiAoZnVuY3Rpb24gbG9vcChyZXN1bHQsIGl0ZW1zKSB7XG4gICAgdmFyIHJlY3VyID0gbG9vcDtcbiAgICB3aGlsZSAocmVjdXIgPT09IGxvb3ApIHtcbiAgICAgIHJlY3VyID0gaXNFbXB0eShpdGVtcykgP1xuICAgICAgcmV2ZXJzZShyZXN1bHQpIDpcbiAgICAgIChyZXN1bHQgPSBjb25zKGYoZmlyc3QoaXRlbXMpKSwgcmVzdWx0KSwgaXRlbXMgPSByZXN0KGl0ZW1zKSwgbG9vcCk7XG4gICAgfTtcbiAgICByZXR1cm4gcmVjdXI7XG4gIH0pKGxpc3QoKSwgc2VxdWVuY2UpO1xufTtcblxudmFyIGZpbHRlciA9IGZ1bmN0aW9uIGZpbHRlcihpc0YsIHNlcXVlbmNlKSB7XG4gIHJldHVybiBpc1ZlY3RvcihzZXF1ZW5jZSkgP1xuICAgIHNlcXVlbmNlLmZpbHRlcihpc0YpIDpcbiAgaXNMaXN0KHNlcXVlbmNlKSA/XG4gICAgZmlsdGVyTGlzdChpc0YsIHNlcXVlbmNlKSA6XG4gIGlzTmlsKHNlcXVlbmNlKSA/XG4gICAgbGlzdCgpIDpcbiAgXCJlbHNlXCIgP1xuICAgIGZpbHRlcihpc0YsIHNlcShzZXF1ZW5jZSkpIDpcbiAgICB2b2lkKDApO1xufTtcbmV4cG9ydHMuZmlsdGVyID0gZmlsdGVyO1xuXG52YXIgZmlsdGVyTGlzdCA9IGZ1bmN0aW9uIGZpbHRlckxpc3QoaXNGLCBzZXF1ZW5jZSkge1xuICByZXR1cm4gKGZ1bmN0aW9uIGxvb3AocmVzdWx0LCBpdGVtcykge1xuICAgIHZhciByZWN1ciA9IGxvb3A7XG4gICAgd2hpbGUgKHJlY3VyID09PSBsb29wKSB7XG4gICAgICByZWN1ciA9IGlzRW1wdHkoaXRlbXMpID9cbiAgICAgIHJldmVyc2UocmVzdWx0KSA6XG4gICAgICAocmVzdWx0ID0gaXNGKGZpcnN0KGl0ZW1zKSkgP1xuICAgICAgICBjb25zKGZpcnN0KGl0ZW1zKSwgcmVzdWx0KSA6XG4gICAgICAgIHJlc3VsdCwgaXRlbXMgPSByZXN0KGl0ZW1zKSwgbG9vcCk7XG4gICAgfTtcbiAgICByZXR1cm4gcmVjdXI7XG4gIH0pKGxpc3QoKSwgc2VxdWVuY2UpO1xufTtcblxudmFyIHJlZHVjZSA9IGZ1bmN0aW9uIHJlZHVjZShmKSB7XG4gIHZhciBwYXJhbXMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICByZXR1cm4gKGZ1bmN0aW9uKCkge1xuICAgIHZhciBoYXNJbml0aWFsID0gY291bnQocGFyYW1zKSA+PSAyO1xuICAgIHZhciBpbml0aWFsID0gaGFzSW5pdGlhbCA/XG4gICAgICBmaXJzdChwYXJhbXMpIDpcbiAgICAgIHZvaWQoMCk7XG4gICAgdmFyIHNlcXVlbmNlID0gaGFzSW5pdGlhbCA/XG4gICAgICBzZWNvbmQocGFyYW1zKSA6XG4gICAgICBmaXJzdChwYXJhbXMpO1xuICAgIHJldHVybiBpc05pbChzZXF1ZW5jZSkgP1xuICAgICAgaW5pdGlhbCA6XG4gICAgaXNWZWN0b3Ioc2VxdWVuY2UpID9cbiAgICAgIGhhc0luaXRpYWwgP1xuICAgICAgICBzZXF1ZW5jZS5yZWR1Y2UoZiwgaW5pdGlhbCkgOlxuICAgICAgICBzZXF1ZW5jZS5yZWR1Y2UoZikgOlxuICAgIGlzTGlzdChzZXF1ZW5jZSkgP1xuICAgICAgaGFzSW5pdGlhbCA/XG4gICAgICAgIHJlZHVjZUxpc3QoZiwgaW5pdGlhbCwgc2VxdWVuY2UpIDpcbiAgICAgICAgcmVkdWNlTGlzdChmLCBmaXJzdChzZXF1ZW5jZSksIHJlc3Qoc2VxdWVuY2UpKSA6XG4gICAgXCJlbHNlXCIgP1xuICAgICAgcmVkdWNlKGYsIGluaXRpYWwsIHNlcShzZXF1ZW5jZSkpIDpcbiAgICAgIHZvaWQoMCk7XG4gIH0pKCk7XG59O1xuZXhwb3J0cy5yZWR1Y2UgPSByZWR1Y2U7XG5cbnZhciByZWR1Y2VMaXN0ID0gZnVuY3Rpb24gcmVkdWNlTGlzdChmLCBpbml0aWFsLCBzZXF1ZW5jZSkge1xuICByZXR1cm4gKGZ1bmN0aW9uIGxvb3AocmVzdWx0LCBpdGVtcykge1xuICAgIHZhciByZWN1ciA9IGxvb3A7XG4gICAgd2hpbGUgKHJlY3VyID09PSBsb29wKSB7XG4gICAgICByZWN1ciA9IGlzRW1wdHkoaXRlbXMpID9cbiAgICAgIHJlc3VsdCA6XG4gICAgICAocmVzdWx0ID0gZihyZXN1bHQsIGZpcnN0KGl0ZW1zKSksIGl0ZW1zID0gcmVzdChpdGVtcyksIGxvb3ApO1xuICAgIH07XG4gICAgcmV0dXJuIHJlY3VyO1xuICB9KShpbml0aWFsLCBzZXF1ZW5jZSk7XG59O1xuXG52YXIgY291bnQgPSBmdW5jdGlvbiBjb3VudChzZXF1ZW5jZSkge1xuICByZXR1cm4gaXNOaWwoc2VxdWVuY2UpID9cbiAgICAwIDpcbiAgICAoc2VxKHNlcXVlbmNlKSkubGVuZ3RoO1xufTtcbmV4cG9ydHMuY291bnQgPSBjb3VudDtcblxudmFyIGlzRW1wdHkgPSBmdW5jdGlvbiBpc0VtcHR5KHNlcXVlbmNlKSB7XG4gIHJldHVybiBjb3VudChzZXF1ZW5jZSkgPT09IDA7XG59O1xuZXhwb3J0cy5pc0VtcHR5ID0gaXNFbXB0eTtcblxudmFyIGZpcnN0ID0gZnVuY3Rpb24gZmlyc3Qoc2VxdWVuY2UpIHtcbiAgcmV0dXJuIGlzTmlsKHNlcXVlbmNlKSA/XG4gICAgdm9pZCgwKSA6XG4gIGlzTGlzdChzZXF1ZW5jZSkgP1xuICAgIHNlcXVlbmNlLmhlYWQgOlxuICAoaXNWZWN0b3Ioc2VxdWVuY2UpKSB8fCAoaXNTdHJpbmcoc2VxdWVuY2UpKSA/XG4gICAgKHNlcXVlbmNlIHx8IDApWzBdIDpcbiAgaXNMYXp5U2VxKHNlcXVlbmNlKSA/XG4gICAgZmlyc3QobGF6eVNlcVZhbHVlKHNlcXVlbmNlKSkgOlxuICBcImVsc2VcIiA/XG4gICAgZmlyc3Qoc2VxKHNlcXVlbmNlKSkgOlxuICAgIHZvaWQoMCk7XG59O1xuZXhwb3J0cy5maXJzdCA9IGZpcnN0O1xuXG52YXIgc2Vjb25kID0gZnVuY3Rpb24gc2Vjb25kKHNlcXVlbmNlKSB7XG4gIHJldHVybiBpc05pbChzZXF1ZW5jZSkgP1xuICAgIHZvaWQoMCkgOlxuICBpc0xpc3Qoc2VxdWVuY2UpID9cbiAgICBmaXJzdChyZXN0KHNlcXVlbmNlKSkgOlxuICAoaXNWZWN0b3Ioc2VxdWVuY2UpKSB8fCAoaXNTdHJpbmcoc2VxdWVuY2UpKSA/XG4gICAgKHNlcXVlbmNlIHx8IDApWzFdIDpcbiAgaXNMYXp5U2VxKHNlcXVlbmNlKSA/XG4gICAgc2Vjb25kKGxhenlTZXFWYWx1ZShzZXF1ZW5jZSkpIDpcbiAgXCJlbHNlXCIgP1xuICAgIGZpcnN0KHJlc3Qoc2VxKHNlcXVlbmNlKSkpIDpcbiAgICB2b2lkKDApO1xufTtcbmV4cG9ydHMuc2Vjb25kID0gc2Vjb25kO1xuXG52YXIgdGhpcmQgPSBmdW5jdGlvbiB0aGlyZChzZXF1ZW5jZSkge1xuICByZXR1cm4gaXNOaWwoc2VxdWVuY2UpID9cbiAgICB2b2lkKDApIDpcbiAgaXNMaXN0KHNlcXVlbmNlKSA/XG4gICAgZmlyc3QocmVzdChyZXN0KHNlcXVlbmNlKSkpIDpcbiAgKGlzVmVjdG9yKHNlcXVlbmNlKSkgfHwgKGlzU3RyaW5nKHNlcXVlbmNlKSkgP1xuICAgIChzZXF1ZW5jZSB8fCAwKVsyXSA6XG4gIGlzTGF6eVNlcShzZXF1ZW5jZSkgP1xuICAgIHRoaXJkKGxhenlTZXFWYWx1ZShzZXF1ZW5jZSkpIDpcbiAgXCJlbHNlXCIgP1xuICAgIHNlY29uZChyZXN0KHNlcShzZXF1ZW5jZSkpKSA6XG4gICAgdm9pZCgwKTtcbn07XG5leHBvcnRzLnRoaXJkID0gdGhpcmQ7XG5cbnZhciByZXN0ID0gZnVuY3Rpb24gcmVzdChzZXF1ZW5jZSkge1xuICByZXR1cm4gaXNOaWwoc2VxdWVuY2UpID9cbiAgICBsaXN0KCkgOlxuICBpc0xpc3Qoc2VxdWVuY2UpID9cbiAgICBzZXF1ZW5jZS50YWlsIDpcbiAgKGlzVmVjdG9yKHNlcXVlbmNlKSkgfHwgKGlzU3RyaW5nKHNlcXVlbmNlKSkgP1xuICAgIHNlcXVlbmNlLnNsaWNlKDEpIDpcbiAgaXNMYXp5U2VxKHNlcXVlbmNlKSA/XG4gICAgcmVzdChsYXp5U2VxVmFsdWUoc2VxdWVuY2UpKSA6XG4gIFwiZWxzZVwiID9cbiAgICByZXN0KHNlcShzZXF1ZW5jZSkpIDpcbiAgICB2b2lkKDApO1xufTtcbmV4cG9ydHMucmVzdCA9IHJlc3Q7XG5cbnZhciBsYXN0T2ZMaXN0ID0gZnVuY3Rpb24gbGFzdE9mTGlzdChsaXN0KSB7XG4gIHJldHVybiAoZnVuY3Rpb24gbG9vcChpdGVtLCBpdGVtcykge1xuICAgIHZhciByZWN1ciA9IGxvb3A7XG4gICAgd2hpbGUgKHJlY3VyID09PSBsb29wKSB7XG4gICAgICByZWN1ciA9IGlzRW1wdHkoaXRlbXMpID9cbiAgICAgIGl0ZW0gOlxuICAgICAgKGl0ZW0gPSBmaXJzdChpdGVtcyksIGl0ZW1zID0gcmVzdChpdGVtcyksIGxvb3ApO1xuICAgIH07XG4gICAgcmV0dXJuIHJlY3VyO1xuICB9KShmaXJzdChsaXN0KSwgcmVzdChsaXN0KSk7XG59O1xuXG52YXIgbGFzdCA9IGZ1bmN0aW9uIGxhc3Qoc2VxdWVuY2UpIHtcbiAgcmV0dXJuIChpc1ZlY3RvcihzZXF1ZW5jZSkpIHx8IChpc1N0cmluZyhzZXF1ZW5jZSkpID9cbiAgICAoc2VxdWVuY2UgfHwgMClbZGVjKGNvdW50KHNlcXVlbmNlKSldIDpcbiAgaXNMaXN0KHNlcXVlbmNlKSA/XG4gICAgbGFzdE9mTGlzdChzZXF1ZW5jZSkgOlxuICBpc05pbChzZXF1ZW5jZSkgP1xuICAgIHZvaWQoMCkgOlxuICBpc0xhenlTZXEoc2VxdWVuY2UpID9cbiAgICBsYXN0KGxhenlTZXFWYWx1ZShzZXF1ZW5jZSkpIDpcbiAgXCJlbHNlXCIgP1xuICAgIGxhc3Qoc2VxKHNlcXVlbmNlKSkgOlxuICAgIHZvaWQoMCk7XG59O1xuZXhwb3J0cy5sYXN0ID0gbGFzdDtcblxudmFyIGJ1dGxhc3QgPSBmdW5jdGlvbiBidXRsYXN0KHNlcXVlbmNlKSB7XG4gIHZhciBpdGVtcyA9IGlzTmlsKHNlcXVlbmNlKSA/XG4gICAgdm9pZCgwKSA6XG4gIGlzU3RyaW5nKHNlcXVlbmNlKSA/XG4gICAgc3VicyhzZXF1ZW5jZSwgMCwgZGVjKGNvdW50KHNlcXVlbmNlKSkpIDpcbiAgaXNWZWN0b3Ioc2VxdWVuY2UpID9cbiAgICBzZXF1ZW5jZS5zbGljZSgwLCBkZWMoY291bnQoc2VxdWVuY2UpKSkgOlxuICBpc0xpc3Qoc2VxdWVuY2UpID9cbiAgICBsaXN0LmFwcGx5KGxpc3QsIGJ1dGxhc3QodmVjKHNlcXVlbmNlKSkpIDpcbiAgaXNMYXp5U2VxKHNlcXVlbmNlKSA/XG4gICAgYnV0bGFzdChsYXp5U2VxVmFsdWUoc2VxdWVuY2UpKSA6XG4gIFwiZWxzZVwiID9cbiAgICBidXRsYXN0KHNlcShzZXF1ZW5jZSkpIDpcbiAgICB2b2lkKDApO1xuICByZXR1cm4gISgoaXNOaWwoaXRlbXMpKSB8fCAoaXNFbXB0eShpdGVtcykpKSA/XG4gICAgaXRlbXMgOlxuICAgIHZvaWQoMCk7XG59O1xuZXhwb3J0cy5idXRsYXN0ID0gYnV0bGFzdDtcblxudmFyIHRha2UgPSBmdW5jdGlvbiB0YWtlKG4sIHNlcXVlbmNlKSB7XG4gIHJldHVybiBpc05pbChzZXF1ZW5jZSkgP1xuICAgIGxpc3QoKSA6XG4gIGlzVmVjdG9yKHNlcXVlbmNlKSA/XG4gICAgdGFrZUZyb21WZWN0b3Iobiwgc2VxdWVuY2UpIDpcbiAgaXNMaXN0KHNlcXVlbmNlKSA/XG4gICAgdGFrZUZyb21MaXN0KG4sIHNlcXVlbmNlKSA6XG4gIGlzTGF6eVNlcShzZXF1ZW5jZSkgP1xuICAgIHRha2UobiwgbGF6eVNlcVZhbHVlKHNlcXVlbmNlKSkgOlxuICBcImVsc2VcIiA/XG4gICAgdGFrZShuLCBzZXEoc2VxdWVuY2UpKSA6XG4gICAgdm9pZCgwKTtcbn07XG5leHBvcnRzLnRha2UgPSB0YWtlO1xuXG52YXIgdGFrZVZlY3RvcldoaWxlID0gZnVuY3Rpb24gdGFrZVZlY3RvcldoaWxlKHByZWRpY2F0ZSwgdmVjdG9yKSB7XG4gIHJldHVybiAoZnVuY3Rpb24gbG9vcChyZXN1bHQsIHRhaWwsIGhlYWQpIHtcbiAgICB2YXIgcmVjdXIgPSBsb29wO1xuICAgIHdoaWxlIChyZWN1ciA9PT0gbG9vcCkge1xuICAgICAgcmVjdXIgPSAoIShpc0VtcHR5KHRhaWwpKSkgJiYgKHByZWRpY2F0ZShoZWFkKSkgP1xuICAgICAgKHJlc3VsdCA9IGNvbmoocmVzdWx0LCBoZWFkKSwgdGFpbCA9IHJlc3QodGFpbCksIGhlYWQgPSBmaXJzdCh0YWlsKSwgbG9vcCkgOlxuICAgICAgcmVzdWx0O1xuICAgIH07XG4gICAgcmV0dXJuIHJlY3VyO1xuICB9KShbXSwgdmVjdG9yLCBmaXJzdCh2ZWN0b3IpKTtcbn07XG5cbnZhciB0YWtlTGlzdFdoaWxlID0gZnVuY3Rpb24gdGFrZUxpc3RXaGlsZShwcmVkaWNhdGUsIGl0ZW1zKSB7XG4gIHJldHVybiAoZnVuY3Rpb24gbG9vcChyZXN1bHQsIHRhaWwsIGhlYWQpIHtcbiAgICB2YXIgcmVjdXIgPSBsb29wO1xuICAgIHdoaWxlIChyZWN1ciA9PT0gbG9vcCkge1xuICAgICAgcmVjdXIgPSAoIShpc0VtcHR5KHRhaWwpKSkgJiYgKGlzUHJlZGljYXRlKGhlYWQpKSA/XG4gICAgICAocmVzdWx0ID0gY29uaihyZXN1bHQsIGhlYWQpLCB0YWlsID0gcmVzdCh0YWlsKSwgaGVhZCA9IGZpcnN0KHRhaWwpLCBsb29wKSA6XG4gICAgICBsaXN0LmFwcGx5KGxpc3QsIHJlc3VsdCk7XG4gICAgfTtcbiAgICByZXR1cm4gcmVjdXI7XG4gIH0pKFtdLCBpdGVtcywgZmlyc3QoaXRlbXMpKTtcbn07XG5cbnZhciB0YWtlV2hpbGUgPSBmdW5jdGlvbiB0YWtlV2hpbGUocHJlZGljYXRlLCBzZXF1ZW5jZSkge1xuICByZXR1cm4gaXNOaWwoc2VxdWVuY2UpID9cbiAgICBsaXN0KCkgOlxuICBpc1ZlY3RvcihzZXF1ZW5jZSkgP1xuICAgIHRha2VWZWN0b3JXaGlsZShwcmVkaWNhdGUsIHNlcXVlbmNlKSA6XG4gIGlzTGlzdChzZXF1ZW5jZSkgP1xuICAgIHRha2VWZWN0b3JXaGlsZShwcmVkaWNhdGUsIHNlcXVlbmNlKSA6XG4gIFwiZWxzZVwiID9cbiAgICB0YWtlV2hpbGUocHJlZGljYXRlLCBsYXp5U2VxVmFsdWUoc2VxdWVuY2UpKSA6XG4gICAgdm9pZCgwKTtcbn07XG5leHBvcnRzLnRha2VXaGlsZSA9IHRha2VXaGlsZTtcblxudmFyIHRha2VGcm9tVmVjdG9yID0gZnVuY3Rpb24gdGFrZUZyb21WZWN0b3IobiwgdmVjdG9yKSB7XG4gIHJldHVybiB2ZWN0b3Iuc2xpY2UoMCwgbik7XG59O1xuXG52YXIgdGFrZUZyb21MaXN0ID0gZnVuY3Rpb24gdGFrZUZyb21MaXN0KG4sIHNlcXVlbmNlKSB7XG4gIHJldHVybiAoZnVuY3Rpb24gbG9vcCh0YWtlbiwgaXRlbXMsIG4pIHtcbiAgICB2YXIgcmVjdXIgPSBsb29wO1xuICAgIHdoaWxlIChyZWN1ciA9PT0gbG9vcCkge1xuICAgICAgcmVjdXIgPSAobiA9PT0gMCkgfHwgKGlzRW1wdHkoaXRlbXMpKSA/XG4gICAgICByZXZlcnNlKHRha2VuKSA6XG4gICAgICAodGFrZW4gPSBjb25zKGZpcnN0KGl0ZW1zKSwgdGFrZW4pLCBpdGVtcyA9IHJlc3QoaXRlbXMpLCBuID0gZGVjKG4pLCBsb29wKTtcbiAgICB9O1xuICAgIHJldHVybiByZWN1cjtcbiAgfSkobGlzdCgpLCBzZXF1ZW5jZSwgbik7XG59O1xuXG52YXIgZHJvcEZyb21MaXN0ID0gZnVuY3Rpb24gZHJvcEZyb21MaXN0KG4sIHNlcXVlbmNlKSB7XG4gIHJldHVybiAoZnVuY3Rpb24gbG9vcChsZWZ0LCBpdGVtcykge1xuICAgIHZhciByZWN1ciA9IGxvb3A7XG4gICAgd2hpbGUgKHJlY3VyID09PSBsb29wKSB7XG4gICAgICByZWN1ciA9IChsZWZ0IDwgMSkgfHwgKGlzRW1wdHkoaXRlbXMpKSA/XG4gICAgICBpdGVtcyA6XG4gICAgICAobGVmdCA9IGRlYyhsZWZ0KSwgaXRlbXMgPSByZXN0KGl0ZW1zKSwgbG9vcCk7XG4gICAgfTtcbiAgICByZXR1cm4gcmVjdXI7XG4gIH0pKG4sIHNlcXVlbmNlKTtcbn07XG5cbnZhciBkcm9wID0gZnVuY3Rpb24gZHJvcChuLCBzZXF1ZW5jZSkge1xuICByZXR1cm4gbiA8PSAwID9cbiAgICBzZXF1ZW5jZSA6XG4gIGlzU3RyaW5nKHNlcXVlbmNlKSA/XG4gICAgc2VxdWVuY2Uuc3Vic3RyKG4pIDpcbiAgaXNWZWN0b3Ioc2VxdWVuY2UpID9cbiAgICBzZXF1ZW5jZS5zbGljZShuKSA6XG4gIGlzTGlzdChzZXF1ZW5jZSkgP1xuICAgIGRyb3BGcm9tTGlzdChuLCBzZXF1ZW5jZSkgOlxuICBpc05pbChzZXF1ZW5jZSkgP1xuICAgIGxpc3QoKSA6XG4gIGlzTGF6eVNlcShzZXF1ZW5jZSkgP1xuICAgIGRyb3AobiwgbGF6eVNlcVZhbHVlKHNlcXVlbmNlKSkgOlxuICBcImVsc2VcIiA/XG4gICAgZHJvcChuLCBzZXEoc2VxdWVuY2UpKSA6XG4gICAgdm9pZCgwKTtcbn07XG5leHBvcnRzLmRyb3AgPSBkcm9wO1xuXG52YXIgY29uakxpc3QgPSBmdW5jdGlvbiBjb25qTGlzdChzZXF1ZW5jZSwgaXRlbXMpIHtcbiAgcmV0dXJuIHJlZHVjZShmdW5jdGlvbihyZXN1bHQsIGl0ZW0pIHtcbiAgICByZXR1cm4gY29ucyhpdGVtLCByZXN1bHQpO1xuICB9LCBzZXF1ZW5jZSwgaXRlbXMpO1xufTtcblxudmFyIGNvbmogPSBmdW5jdGlvbiBjb25qKHNlcXVlbmNlKSB7XG4gIHZhciBpdGVtcyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gIHJldHVybiBpc1ZlY3RvcihzZXF1ZW5jZSkgP1xuICAgIHNlcXVlbmNlLmNvbmNhdChpdGVtcykgOlxuICBpc1N0cmluZyhzZXF1ZW5jZSkgP1xuICAgIFwiXCIgKyBzZXF1ZW5jZSArIChzdHIuYXBwbHkoc3RyLCBpdGVtcykpIDpcbiAgaXNOaWwoc2VxdWVuY2UpID9cbiAgICBsaXN0LmFwcGx5KGxpc3QsIHJldmVyc2UoaXRlbXMpKSA6XG4gIChpc0xpc3Qoc2VxdWVuY2UpKSB8fCAoaXNMYXp5U2VxKCkpID9cbiAgICBjb25qTGlzdChzZXF1ZW5jZSwgaXRlbXMpIDpcbiAgaXNEaWN0aW9uYXJ5KHNlcXVlbmNlKSA/XG4gICAgbWVyZ2Uoc2VxdWVuY2UsIG1lcmdlLmFwcGx5KG1lcmdlLCBpdGVtcykpIDpcbiAgXCJlbHNlXCIgP1xuICAgIChmdW5jdGlvbigpIHsgdGhyb3cgVHlwZUVycm9yKFwiXCIgKyBcIlR5cGUgY2FuJ3QgYmUgY29uam9pbmVkIFwiICsgc2VxdWVuY2UpOyB9KSgpIDpcbiAgICB2b2lkKDApO1xufTtcbmV4cG9ydHMuY29uaiA9IGNvbmo7XG5cbnZhciBhc3NvYyA9IGZ1bmN0aW9uIGFzc29jKHNvdXJjZSkge1xuICB2YXIga2V5VmFsdWVzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgcmV0dXJuIGNvbmooc291cmNlLCBkaWN0aW9uYXJ5LmFwcGx5KGRpY3Rpb25hcnksIGtleVZhbHVlcykpO1xufTtcbmV4cG9ydHMuYXNzb2MgPSBhc3NvYztcblxudmFyIGNvbmNhdCA9IGZ1bmN0aW9uIGNvbmNhdCgpIHtcbiAgdmFyIHNlcXVlbmNlcyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMCk7XG4gIHJldHVybiByZXZlcnNlKHJlZHVjZShmdW5jdGlvbihyZXN1bHQsIHNlcXVlbmNlKSB7XG4gICAgcmV0dXJuIHJlZHVjZShmdW5jdGlvbihyZXN1bHQsIGl0ZW0pIHtcbiAgICAgIHJldHVybiBjb25zKGl0ZW0sIHJlc3VsdCk7XG4gICAgfSwgcmVzdWx0LCBzZXEoc2VxdWVuY2UpKTtcbiAgfSwgbGlzdCgpLCBzZXF1ZW5jZXMpKTtcbn07XG5leHBvcnRzLmNvbmNhdCA9IGNvbmNhdDtcblxudmFyIHNlcSA9IGZ1bmN0aW9uIHNlcShzZXF1ZW5jZSkge1xuICByZXR1cm4gaXNOaWwoc2VxdWVuY2UpID9cbiAgICB2b2lkKDApIDpcbiAgKGlzVmVjdG9yKHNlcXVlbmNlKSkgfHwgKGlzTGlzdChzZXF1ZW5jZSkpIHx8IChpc0xhenlTZXEoc2VxdWVuY2UpKSA/XG4gICAgc2VxdWVuY2UgOlxuICBpc1N0cmluZyhzZXF1ZW5jZSkgP1xuICAgIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKHNlcXVlbmNlKSA6XG4gIGlzRGljdGlvbmFyeShzZXF1ZW5jZSkgP1xuICAgIGtleVZhbHVlcyhzZXF1ZW5jZSkgOlxuICBcImRlZmF1bHRcIiA/XG4gICAgKGZ1bmN0aW9uKCkgeyB0aHJvdyBUeXBlRXJyb3IoXCJcIiArIFwiQ2FuIG5vdCBzZXEgXCIgKyBzZXF1ZW5jZSk7IH0pKCkgOlxuICAgIHZvaWQoMCk7XG59O1xuZXhwb3J0cy5zZXEgPSBzZXE7XG5cbnZhciBpc1NlcSA9IGZ1bmN0aW9uIGlzU2VxKHNlcXVlbmNlKSB7XG4gIHJldHVybiAoaXNMaXN0KHNlcXVlbmNlKSkgfHwgKGlzTGF6eVNlcShzZXF1ZW5jZSkpO1xufTtcbmV4cG9ydHMuaXNTZXEgPSBpc1NlcTtcblxudmFyIGxpc3RUb1ZlY3RvciA9IGZ1bmN0aW9uIGxpc3RUb1ZlY3Rvcihzb3VyY2UpIHtcbiAgcmV0dXJuIChmdW5jdGlvbiBsb29wKHJlc3VsdCwgbGlzdCkge1xuICAgIHZhciByZWN1ciA9IGxvb3A7XG4gICAgd2hpbGUgKHJlY3VyID09PSBsb29wKSB7XG4gICAgICByZWN1ciA9IGlzRW1wdHkobGlzdCkgP1xuICAgICAgcmVzdWx0IDpcbiAgICAgIChyZXN1bHQgPSAoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJlc3VsdC5wdXNoKGZpcnN0KGxpc3QpKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH0pKCksIGxpc3QgPSByZXN0KGxpc3QpLCBsb29wKTtcbiAgICB9O1xuICAgIHJldHVybiByZWN1cjtcbiAgfSkoW10sIHNvdXJjZSk7XG59O1xuXG52YXIgdmVjID0gZnVuY3Rpb24gdmVjKHNlcXVlbmNlKSB7XG4gIHJldHVybiBpc05pbChzZXF1ZW5jZSkgP1xuICAgIFtdIDpcbiAgaXNWZWN0b3Ioc2VxdWVuY2UpID9cbiAgICBzZXF1ZW5jZSA6XG4gIGlzTGlzdChzZXF1ZW5jZSkgP1xuICAgIGxpc3RUb1ZlY3RvcihzZXF1ZW5jZSkgOlxuICBcImVsc2VcIiA/XG4gICAgdmVjKHNlcShzZXF1ZW5jZSkpIDpcbiAgICB2b2lkKDApO1xufTtcbmV4cG9ydHMudmVjID0gdmVjO1xuXG52YXIgc29ydCA9IGZ1bmN0aW9uIHNvcnQoZiwgaXRlbXMpIHtcbiAgdmFyIGhhc0NvbXBhcmF0b3IgPSBpc0ZuKGYpO1xuICB2YXIgaXRlbXMgPSAoIShoYXNDb21wYXJhdG9yKSkgJiYgKGlzTmlsKGl0ZW1zKSkgP1xuICAgIGYgOlxuICAgIGl0ZW1zO1xuICB2YXIgY29tcGFyZSA9IGhhc0NvbXBhcmF0b3IgP1xuICAgIGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgIHJldHVybiBmKGEsIGIpID9cbiAgICAgICAgMCA6XG4gICAgICAgIDE7XG4gICAgfSA6XG4gICAgdm9pZCgwKTtcbiAgcmV0dXJuIGlzTmlsKGl0ZW1zKSA/XG4gICAgbGlzdCgpIDpcbiAgaXNWZWN0b3IoaXRlbXMpID9cbiAgICBpdGVtcy5zb3J0KGNvbXBhcmUpIDpcbiAgaXNMaXN0KGl0ZW1zKSA/XG4gICAgbGlzdC5hcHBseShsaXN0LCB2ZWMoaXRlbXMpLnNvcnQoY29tcGFyZSkpIDpcbiAgaXNEaWN0aW9uYXJ5KGl0ZW1zKSA/XG4gICAgc2VxKGl0ZW1zKS5zb3J0KGNvbXBhcmUpIDpcbiAgXCJlbHNlXCIgP1xuICAgIHNvcnQoZiwgc2VxKGl0ZW1zKSkgOlxuICAgIHZvaWQoMCk7XG59O1xuZXhwb3J0cy5zb3J0ID0gc29ydDtcblxudmFyIHJlcGVhdCA9IGZ1bmN0aW9uIHJlcGVhdChuLCB4KSB7XG4gIHJldHVybiAoZnVuY3Rpb24gbG9vcChuLCByZXN1bHQpIHtcbiAgICB2YXIgcmVjdXIgPSBsb29wO1xuICAgIHdoaWxlIChyZWN1ciA9PT0gbG9vcCkge1xuICAgICAgcmVjdXIgPSBuIDw9IDAgP1xuICAgICAgcmVzdWx0IDpcbiAgICAgIChuID0gZGVjKG4pLCByZXN1bHQgPSBjb25qKHJlc3VsdCwgeCksIGxvb3ApO1xuICAgIH07XG4gICAgcmV0dXJuIHJlY3VyO1xuICB9KShuLCBbXSk7XG59O1xuZXhwb3J0cy5yZXBlYXQgPSByZXBlYXQiLCJ2YXIgX25zXyA9IHtcbiAgXCJpZFwiOiBcIndpc3AucmVhZGVyXCIsXG4gIFwiZG9jXCI6IFwiUmVhZGVyIG1vZHVsZSBwcm92aWRlcyBmdW5jdGlvbnMgZm9yIHJlYWRpbmcgdGV4dCBpbnB1dFxcbiAgYXMgd2lzcCBkYXRhIHN0cnVjdHVyZXNcIlxufTtcbnZhciB3aXNwX3NlcXVlbmNlID0gcmVxdWlyZShcIi4vc2VxdWVuY2VcIik7XG52YXIgbGlzdCA9IHdpc3Bfc2VxdWVuY2UubGlzdDtcbnZhciBpc0xpc3QgPSB3aXNwX3NlcXVlbmNlLmlzTGlzdDtcbnZhciBjb3VudCA9IHdpc3Bfc2VxdWVuY2UuY291bnQ7XG52YXIgaXNFbXB0eSA9IHdpc3Bfc2VxdWVuY2UuaXNFbXB0eTtcbnZhciBmaXJzdCA9IHdpc3Bfc2VxdWVuY2UuZmlyc3Q7XG52YXIgc2Vjb25kID0gd2lzcF9zZXF1ZW5jZS5zZWNvbmQ7XG52YXIgdGhpcmQgPSB3aXNwX3NlcXVlbmNlLnRoaXJkO1xudmFyIHJlc3QgPSB3aXNwX3NlcXVlbmNlLnJlc3Q7XG52YXIgbWFwID0gd2lzcF9zZXF1ZW5jZS5tYXA7XG52YXIgdmVjID0gd2lzcF9zZXF1ZW5jZS52ZWM7XG52YXIgY29ucyA9IHdpc3Bfc2VxdWVuY2UuY29ucztcbnZhciBjb25qID0gd2lzcF9zZXF1ZW5jZS5jb25qO1xudmFyIGNvbmNhdCA9IHdpc3Bfc2VxdWVuY2UuY29uY2F0O1xudmFyIGxhc3QgPSB3aXNwX3NlcXVlbmNlLmxhc3Q7XG52YXIgYnV0bGFzdCA9IHdpc3Bfc2VxdWVuY2UuYnV0bGFzdDtcbnZhciBzb3J0ID0gd2lzcF9zZXF1ZW5jZS5zb3J0O1xudmFyIGxhenlTZXEgPSB3aXNwX3NlcXVlbmNlLmxhenlTZXE7O1xudmFyIHdpc3BfcnVudGltZSA9IHJlcXVpcmUoXCIuL3J1bnRpbWVcIik7XG52YXIgaXNPZGQgPSB3aXNwX3J1bnRpbWUuaXNPZGQ7XG52YXIgZGljdGlvbmFyeSA9IHdpc3BfcnVudGltZS5kaWN0aW9uYXJ5O1xudmFyIGtleXMgPSB3aXNwX3J1bnRpbWUua2V5cztcbnZhciBpc05pbCA9IHdpc3BfcnVudGltZS5pc05pbDtcbnZhciBpbmMgPSB3aXNwX3J1bnRpbWUuaW5jO1xudmFyIGRlYyA9IHdpc3BfcnVudGltZS5kZWM7XG52YXIgaXNWZWN0b3IgPSB3aXNwX3J1bnRpbWUuaXNWZWN0b3I7XG52YXIgaXNTdHJpbmcgPSB3aXNwX3J1bnRpbWUuaXNTdHJpbmc7XG52YXIgaXNOdW1iZXIgPSB3aXNwX3J1bnRpbWUuaXNOdW1iZXI7XG52YXIgaXNCb29sZWFuID0gd2lzcF9ydW50aW1lLmlzQm9vbGVhbjtcbnZhciBpc09iamVjdCA9IHdpc3BfcnVudGltZS5pc09iamVjdDtcbnZhciBpc0RpY3Rpb25hcnkgPSB3aXNwX3J1bnRpbWUuaXNEaWN0aW9uYXJ5O1xudmFyIHJlUGF0dGVybiA9IHdpc3BfcnVudGltZS5yZVBhdHRlcm47XG52YXIgcmVNYXRjaGVzID0gd2lzcF9ydW50aW1lLnJlTWF0Y2hlcztcbnZhciByZUZpbmQgPSB3aXNwX3J1bnRpbWUucmVGaW5kO1xudmFyIHN0ciA9IHdpc3BfcnVudGltZS5zdHI7XG52YXIgc3VicyA9IHdpc3BfcnVudGltZS5zdWJzO1xudmFyIGNoYXIgPSB3aXNwX3J1bnRpbWUuY2hhcjtcbnZhciB2YWxzID0gd2lzcF9ydW50aW1lLnZhbHM7XG52YXIgaXNFcXVhbCA9IHdpc3BfcnVudGltZS5pc0VxdWFsOztcbnZhciB3aXNwX2FzdCA9IHJlcXVpcmUoXCIuL2FzdFwiKTtcbnZhciBpc1N5bWJvbCA9IHdpc3BfYXN0LmlzU3ltYm9sO1xudmFyIHN5bWJvbCA9IHdpc3BfYXN0LnN5bWJvbDtcbnZhciBpc0tleXdvcmQgPSB3aXNwX2FzdC5pc0tleXdvcmQ7XG52YXIga2V5d29yZCA9IHdpc3BfYXN0LmtleXdvcmQ7XG52YXIgbWV0YSA9IHdpc3BfYXN0Lm1ldGE7XG52YXIgd2l0aE1ldGEgPSB3aXNwX2FzdC53aXRoTWV0YTtcbnZhciBuYW1lID0gd2lzcF9hc3QubmFtZTtcbnZhciBnZW5zeW0gPSB3aXNwX2FzdC5nZW5zeW07O1xudmFyIHdpc3Bfc3RyaW5nID0gcmVxdWlyZShcIi4vc3RyaW5nXCIpO1xudmFyIHNwbGl0ID0gd2lzcF9zdHJpbmcuc3BsaXQ7XG52YXIgam9pbiA9IHdpc3Bfc3RyaW5nLmpvaW47OztcblxudmFyIHB1c2hCYWNrUmVhZGVyID0gZnVuY3Rpb24gcHVzaEJhY2tSZWFkZXIoc291cmNlLCB1cmkpIHtcbiAgcmV0dXJuIHtcbiAgICBcImxpbmVzXCI6IHNwbGl0KHNvdXJjZSwgXCJcXG5cIiksXG4gICAgXCJidWZmZXJcIjogXCJcIixcbiAgICBcInVyaVwiOiB1cmksXG4gICAgXCJjb2x1bW5cIjogLTEsXG4gICAgXCJsaW5lXCI6IDBcbiAgfTtcbn07XG5leHBvcnRzLnB1c2hCYWNrUmVhZGVyID0gcHVzaEJhY2tSZWFkZXI7XG5cbnZhciBwZWVrQ2hhciA9IGZ1bmN0aW9uIHBlZWtDaGFyKHJlYWRlcikge1xuICB2YXIgbGluZSA9ICgocmVhZGVyIHx8IDApW1wibGluZXNcIl0pWyhyZWFkZXIgfHwgMClbXCJsaW5lXCJdXTtcbiAgdmFyIGNvbHVtbiA9IGluYygocmVhZGVyIHx8IDApW1wiY29sdW1uXCJdKTtcbiAgcmV0dXJuIGlzTmlsKGxpbmUpID9cbiAgICB2b2lkKDApIDpcbiAgICAobGluZVtjb2x1bW5dKSB8fCBcIlxcblwiO1xufTtcbmV4cG9ydHMucGVla0NoYXIgPSBwZWVrQ2hhcjtcblxudmFyIHJlYWRDaGFyID0gZnVuY3Rpb24gcmVhZENoYXIocmVhZGVyKSB7XG4gIHZhciBjaCA9IHBlZWtDaGFyKHJlYWRlcik7XG4gIGlzTmV3bGluZShwZWVrQ2hhcihyZWFkZXIpKSA/XG4gICAgKGZ1bmN0aW9uKCkge1xuICAgICAgKHJlYWRlciB8fCAwKVtcImxpbmVcIl0gPSBpbmMoKHJlYWRlciB8fCAwKVtcImxpbmVcIl0pO1xuICAgICAgcmV0dXJuIChyZWFkZXIgfHwgMClbXCJjb2x1bW5cIl0gPSAtMTtcbiAgICB9KSgpIDpcbiAgICAocmVhZGVyIHx8IDApW1wiY29sdW1uXCJdID0gaW5jKChyZWFkZXIgfHwgMClbXCJjb2x1bW5cIl0pO1xuICByZXR1cm4gY2g7XG59O1xuZXhwb3J0cy5yZWFkQ2hhciA9IHJlYWRDaGFyO1xuXG52YXIgaXNOZXdsaW5lID0gZnVuY3Rpb24gaXNOZXdsaW5lKGNoKSB7XG4gIHJldHVybiBcIlxcblwiID09PSBjaDtcbn07XG5leHBvcnRzLmlzTmV3bGluZSA9IGlzTmV3bGluZTtcblxudmFyIGlzQnJlYWtpbmdXaGl0ZXNwYWNlID0gZnVuY3Rpb24gaXNCcmVha2luZ1doaXRlc3BhY2UoY2gpIHtcbiAgcmV0dXJuIChjaCA9PT0gXCIgXCIpIHx8IChjaCA9PT0gXCJcXHRcIikgfHwgKGNoID09PSBcIlxcblwiKSB8fCAoY2ggPT09IFwiXFxyXCIpO1xufTtcbmV4cG9ydHMuaXNCcmVha2luZ1doaXRlc3BhY2UgPSBpc0JyZWFraW5nV2hpdGVzcGFjZTtcblxudmFyIGlzV2hpdGVzcGFjZSA9IGZ1bmN0aW9uIGlzV2hpdGVzcGFjZShjaCkge1xuICByZXR1cm4gKGlzQnJlYWtpbmdXaGl0ZXNwYWNlKGNoKSkgfHwgKFwiLFwiID09PSBjaCk7XG59O1xuZXhwb3J0cy5pc1doaXRlc3BhY2UgPSBpc1doaXRlc3BhY2U7XG5cbnZhciBpc051bWVyaWMgPSBmdW5jdGlvbiBpc051bWVyaWMoY2gpIHtcbiAgcmV0dXJuIChjaCA9PT0gXCIwXCIpIHx8IChjaCA9PT0gXCIxXCIpIHx8IChjaCA9PT0gXCIyXCIpIHx8IChjaCA9PT0gXCIzXCIpIHx8IChjaCA9PT0gXCI0XCIpIHx8IChjaCA9PT0gXCI1XCIpIHx8IChjaCA9PT0gXCI2XCIpIHx8IChjaCA9PT0gXCI3XCIpIHx8IChjaCA9PT0gXCI4XCIpIHx8IChjaCA9PT0gXCI5XCIpO1xufTtcbmV4cG9ydHMuaXNOdW1lcmljID0gaXNOdW1lcmljO1xuXG52YXIgaXNDb21tZW50UHJlZml4ID0gZnVuY3Rpb24gaXNDb21tZW50UHJlZml4KGNoKSB7XG4gIHJldHVybiBcIjtcIiA9PT0gY2g7XG59O1xuZXhwb3J0cy5pc0NvbW1lbnRQcmVmaXggPSBpc0NvbW1lbnRQcmVmaXg7XG5cbnZhciBpc051bWJlckxpdGVyYWwgPSBmdW5jdGlvbiBpc051bWJlckxpdGVyYWwocmVhZGVyLCBpbml0Y2gpIHtcbiAgcmV0dXJuIChpc051bWVyaWMoaW5pdGNoKSkgfHwgKCgoXCIrXCIgPT09IGluaXRjaCkgfHwgKFwiLVwiID09PSBpbml0Y2gpKSAmJiAoaXNOdW1lcmljKHBlZWtDaGFyKHJlYWRlcikpKSk7XG59O1xuZXhwb3J0cy5pc051bWJlckxpdGVyYWwgPSBpc051bWJlckxpdGVyYWw7XG5cbnZhciByZWFkZXJFcnJvciA9IGZ1bmN0aW9uIHJlYWRlckVycm9yKHJlYWRlciwgbWVzc2FnZSkge1xuICB2YXIgdGV4dCA9IFwiXCIgKyBtZXNzYWdlICsgXCJcXG5cIiArIFwibGluZTpcIiArICgocmVhZGVyIHx8IDApW1wibGluZVwiXSkgKyBcIlxcblwiICsgXCJjb2x1bW46XCIgKyAoKHJlYWRlciB8fCAwKVtcImNvbHVtblwiXSk7XG4gIHZhciBlcnJvciA9IFN5bnRheEVycm9yKHRleHQsIChyZWFkZXIgfHwgMClbXCJ1cmlcIl0pO1xuICBlcnJvci5saW5lID0gKHJlYWRlciB8fCAwKVtcImxpbmVcIl07XG4gIGVycm9yLmNvbHVtbiA9IChyZWFkZXIgfHwgMClbXCJjb2x1bW5cIl07XG4gIGVycm9yLnVyaSA9IChyZWFkZXIgfHwgMClbXCJ1cmlcIl07XG4gIHJldHVybiAoZnVuY3Rpb24oKSB7IHRocm93IGVycm9yOyB9KSgpO1xufTtcbmV4cG9ydHMucmVhZGVyRXJyb3IgPSByZWFkZXJFcnJvcjtcblxudmFyIGlzTWFjcm9UZXJtaW5hdGluZyA9IGZ1bmN0aW9uIGlzTWFjcm9UZXJtaW5hdGluZyhjaCkge1xuICByZXR1cm4gKCEoY2ggPT09IFwiI1wiKSkgJiYgKCEoY2ggPT09IFwiJ1wiKSkgJiYgKCEoY2ggPT09IFwiOlwiKSkgJiYgKG1hY3JvcyhjaCkpO1xufTtcbmV4cG9ydHMuaXNNYWNyb1Rlcm1pbmF0aW5nID0gaXNNYWNyb1Rlcm1pbmF0aW5nO1xuXG52YXIgcmVhZFRva2VuID0gZnVuY3Rpb24gcmVhZFRva2VuKHJlYWRlciwgaW5pdGNoKSB7XG4gIHJldHVybiAoZnVuY3Rpb24gbG9vcChidWZmZXIsIGNoKSB7XG4gICAgdmFyIHJlY3VyID0gbG9vcDtcbiAgICB3aGlsZSAocmVjdXIgPT09IGxvb3ApIHtcbiAgICAgIHJlY3VyID0gKGlzTmlsKGNoKSkgfHwgKGlzV2hpdGVzcGFjZShjaCkpIHx8IChpc01hY3JvVGVybWluYXRpbmcoY2gpKSA/XG4gICAgICBidWZmZXIgOlxuICAgICAgKGJ1ZmZlciA9IFwiXCIgKyBidWZmZXIgKyAocmVhZENoYXIocmVhZGVyKSksIGNoID0gcGVla0NoYXIocmVhZGVyKSwgbG9vcCk7XG4gICAgfTtcbiAgICByZXR1cm4gcmVjdXI7XG4gIH0pKGluaXRjaCwgcGVla0NoYXIocmVhZGVyKSk7XG59O1xuZXhwb3J0cy5yZWFkVG9rZW4gPSByZWFkVG9rZW47XG5cbnZhciBza2lwTGluZSA9IGZ1bmN0aW9uIHNraXBMaW5lKHJlYWRlciwgXykge1xuICByZXR1cm4gKGZ1bmN0aW9uIGxvb3AoKSB7XG4gICAgdmFyIHJlY3VyID0gbG9vcDtcbiAgICB3aGlsZSAocmVjdXIgPT09IGxvb3ApIHtcbiAgICAgIHJlY3VyID0gKGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGNoID0gcmVhZENoYXIocmVhZGVyKTtcbiAgICAgIHJldHVybiAoY2ggPT09IFwiXFxuXCIpIHx8IChjaCA9PT0gXCJcXHJcIikgfHwgKGlzTmlsKGNoKSkgP1xuICAgICAgICByZWFkZXIgOlxuICAgICAgICAobG9vcCk7XG4gICAgfSkoKTtcbiAgICB9O1xuICAgIHJldHVybiByZWN1cjtcbiAgfSkoKTtcbn07XG5leHBvcnRzLnNraXBMaW5lID0gc2tpcExpbmU7XG5cbnZhciBpbnRQYXR0ZXJuID0gcmVQYXR0ZXJuKFwiXihbLStdPykoPzooMCl8KFsxLTldWzAtOV0qKXwwW3hYXShbMC05QS1GYS1mXSspfDAoWzAtN10rKXwoWzEtOV1bMC05XT8pW3JSXShbMC05QS1aYS16XSspfDBbMC05XSspKE4pPyRcIik7XG5leHBvcnRzLmludFBhdHRlcm4gPSBpbnRQYXR0ZXJuO1xuXG52YXIgcmF0aW9QYXR0ZXJuID0gcmVQYXR0ZXJuKFwiKFstK10/WzAtOV0rKS8oWzAtOV0rKVwiKTtcbmV4cG9ydHMucmF0aW9QYXR0ZXJuID0gcmF0aW9QYXR0ZXJuO1xuXG52YXIgZmxvYXRQYXR0ZXJuID0gcmVQYXR0ZXJuKFwiKFstK10/WzAtOV0rKFxcXFwuWzAtOV0qKT8oW2VFXVstK10/WzAtOV0rKT8pKE0pP1wiKTtcbmV4cG9ydHMuZmxvYXRQYXR0ZXJuID0gZmxvYXRQYXR0ZXJuO1xuXG52YXIgbWF0Y2hJbnQgPSBmdW5jdGlvbiBtYXRjaEludChzKSB7XG4gIHZhciBncm91cHMgPSByZUZpbmQoaW50UGF0dGVybiwgcyk7XG4gIHZhciBncm91cDMgPSBncm91cHNbMl07XG4gIHJldHVybiAhKChpc05pbChncm91cDMpKSB8fCAoY291bnQoZ3JvdXAzKSA8IDEpKSA/XG4gICAgMCA6XG4gICAgKGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIG5lZ2F0ZSA9IFwiLVwiID09PSBncm91cHNbMV0gP1xuICAgICAgICAtMSA6XG4gICAgICAgIDE7XG4gICAgICB2YXIgYSA9IGdyb3Vwc1szXSA/XG4gICAgICAgIFtncm91cHNbM10sIDEwXSA6XG4gICAgICBncm91cHNbNF0gP1xuICAgICAgICBbZ3JvdXBzWzRdLCAxNl0gOlxuICAgICAgZ3JvdXBzWzVdID9cbiAgICAgICAgW2dyb3Vwc1s1XSwgOF0gOlxuICAgICAgZ3JvdXBzWzddID9cbiAgICAgICAgW2dyb3Vwc1s3XSwgcGFyc2VJbnQoZ3JvdXBzWzddKV0gOlxuICAgICAgXCJlbHNlXCIgP1xuICAgICAgICBbdm9pZCgwKSwgdm9pZCgwKV0gOlxuICAgICAgICB2b2lkKDApO1xuICAgICAgdmFyIG4gPSBhWzBdO1xuICAgICAgdmFyIHJhZGl4ID0gYVsxXTtcbiAgICAgIHJldHVybiBpc05pbChuKSA/XG4gICAgICAgIHZvaWQoMCkgOlxuICAgICAgICBuZWdhdGUgKiAocGFyc2VJbnQobiwgcmFkaXgpKTtcbiAgICB9KSgpO1xufTtcbmV4cG9ydHMubWF0Y2hJbnQgPSBtYXRjaEludDtcblxudmFyIG1hdGNoUmF0aW8gPSBmdW5jdGlvbiBtYXRjaFJhdGlvKHMpIHtcbiAgdmFyIGdyb3VwcyA9IHJlRmluZChyYXRpb1BhdHRlcm4sIHMpO1xuICB2YXIgbnVtaW5hdG9yID0gZ3JvdXBzWzFdO1xuICB2YXIgZGVub21pbmF0b3IgPSBncm91cHNbMl07XG4gIHJldHVybiAocGFyc2VJbnQobnVtaW5hdG9yKSkgLyAocGFyc2VJbnQoZGVub21pbmF0b3IpKTtcbn07XG5leHBvcnRzLm1hdGNoUmF0aW8gPSBtYXRjaFJhdGlvO1xuXG52YXIgbWF0Y2hGbG9hdCA9IGZ1bmN0aW9uIG1hdGNoRmxvYXQocykge1xuICByZXR1cm4gcGFyc2VGbG9hdChzKTtcbn07XG5leHBvcnRzLm1hdGNoRmxvYXQgPSBtYXRjaEZsb2F0O1xuXG52YXIgbWF0Y2hOdW1iZXIgPSBmdW5jdGlvbiBtYXRjaE51bWJlcihzKSB7XG4gIHJldHVybiByZU1hdGNoZXMoaW50UGF0dGVybiwgcykgP1xuICAgIG1hdGNoSW50KHMpIDpcbiAgcmVNYXRjaGVzKHJhdGlvUGF0dGVybiwgcykgP1xuICAgIG1hdGNoUmF0aW8ocykgOlxuICByZU1hdGNoZXMoZmxvYXRQYXR0ZXJuLCBzKSA/XG4gICAgbWF0Y2hGbG9hdChzKSA6XG4gICAgdm9pZCgwKTtcbn07XG5leHBvcnRzLm1hdGNoTnVtYmVyID0gbWF0Y2hOdW1iZXI7XG5cbnZhciBlc2NhcGVDaGFyTWFwID0gZnVuY3Rpb24gZXNjYXBlQ2hhck1hcChjKSB7XG4gIHJldHVybiBjID09PSBcInRcIiA/XG4gICAgXCJcXHRcIiA6XG4gIGMgPT09IFwiclwiID9cbiAgICBcIlxcclwiIDpcbiAgYyA9PT0gXCJuXCIgP1xuICAgIFwiXFxuXCIgOlxuICBjID09PSBcIlxcXFxcIiA/XG4gICAgXCJcXFxcXCIgOlxuICBjID09PSBcIlxcXCJcIiA/XG4gICAgXCJcXFwiXCIgOlxuICBjID09PSBcImJcIiA/XG4gICAgXCJcYlwiIDpcbiAgYyA9PT0gXCJmXCIgP1xuICAgIFwiXGZcIiA6XG4gIFwiZWxzZVwiID9cbiAgICB2b2lkKDApIDpcbiAgICB2b2lkKDApO1xufTtcbmV4cG9ydHMuZXNjYXBlQ2hhck1hcCA9IGVzY2FwZUNoYXJNYXA7XG5cbnZhciByZWFkMkNoYXJzID0gZnVuY3Rpb24gcmVhZDJDaGFycyhyZWFkZXIpIHtcbiAgcmV0dXJuIFwiXCIgKyAocmVhZENoYXIocmVhZGVyKSkgKyAocmVhZENoYXIocmVhZGVyKSk7XG59O1xuZXhwb3J0cy5yZWFkMkNoYXJzID0gcmVhZDJDaGFycztcblxudmFyIHJlYWQ0Q2hhcnMgPSBmdW5jdGlvbiByZWFkNENoYXJzKHJlYWRlcikge1xuICByZXR1cm4gXCJcIiArIChyZWFkQ2hhcihyZWFkZXIpKSArIChyZWFkQ2hhcihyZWFkZXIpKSArIChyZWFkQ2hhcihyZWFkZXIpKSArIChyZWFkQ2hhcihyZWFkZXIpKTtcbn07XG5leHBvcnRzLnJlYWQ0Q2hhcnMgPSByZWFkNENoYXJzO1xuXG52YXIgdW5pY29kZTJQYXR0ZXJuID0gcmVQYXR0ZXJuKFwiWzAtOUEtRmEtZl17Mn1cIik7XG5leHBvcnRzLnVuaWNvZGUyUGF0dGVybiA9IHVuaWNvZGUyUGF0dGVybjtcblxudmFyIHVuaWNvZGU0UGF0dGVybiA9IHJlUGF0dGVybihcIlswLTlBLUZhLWZdezR9XCIpO1xuZXhwb3J0cy51bmljb2RlNFBhdHRlcm4gPSB1bmljb2RlNFBhdHRlcm47XG5cbnZhciB2YWxpZGF0ZVVuaWNvZGVFc2NhcGUgPSBmdW5jdGlvbiB2YWxpZGF0ZVVuaWNvZGVFc2NhcGUodW5pY29kZVBhdHRlcm4sIHJlYWRlciwgZXNjYXBlQ2hhciwgdW5pY29kZVN0cikge1xuICByZXR1cm4gcmVNYXRjaGVzKHVuaWNvZGVQYXR0ZXJuLCB1bmljb2RlU3RyKSA/XG4gICAgdW5pY29kZVN0ciA6XG4gICAgcmVhZGVyRXJyb3IocmVhZGVyLCBcIlwiICsgXCJVbmV4cGVjdGVkIHVuaWNvZGUgZXNjYXBlIFwiICsgXCJcXFxcXCIgKyBlc2NhcGVDaGFyICsgdW5pY29kZVN0cik7XG59O1xuZXhwb3J0cy52YWxpZGF0ZVVuaWNvZGVFc2NhcGUgPSB2YWxpZGF0ZVVuaWNvZGVFc2NhcGU7XG5cbnZhciBtYWtlVW5pY29kZUNoYXIgPSBmdW5jdGlvbiBtYWtlVW5pY29kZUNoYXIoY29kZVN0ciwgYmFzZSkge1xuICB2YXIgYmFzZSA9IGJhc2UgfHwgMTY7XG4gIHZhciBjb2RlID0gcGFyc2VJbnQoY29kZVN0ciwgYmFzZSk7XG4gIHJldHVybiBjaGFyKGNvZGUpO1xufTtcbmV4cG9ydHMubWFrZVVuaWNvZGVDaGFyID0gbWFrZVVuaWNvZGVDaGFyO1xuXG52YXIgZXNjYXBlQ2hhciA9IGZ1bmN0aW9uIGVzY2FwZUNoYXIoYnVmZmVyLCByZWFkZXIpIHtcbiAgdmFyIGNoID0gcmVhZENoYXIocmVhZGVyKTtcbiAgdmFyIG1hcHJlc3VsdCA9IGVzY2FwZUNoYXJNYXAoY2gpO1xuICByZXR1cm4gbWFwcmVzdWx0ID9cbiAgICBtYXByZXN1bHQgOlxuICBjaCA9PT0gXCJ4XCIgP1xuICAgIG1ha2VVbmljb2RlQ2hhcih2YWxpZGF0ZVVuaWNvZGVFc2NhcGUodW5pY29kZTJQYXR0ZXJuLCByZWFkZXIsIGNoLCByZWFkMkNoYXJzKHJlYWRlcikpKSA6XG4gIGNoID09PSBcInVcIiA/XG4gICAgbWFrZVVuaWNvZGVDaGFyKHZhbGlkYXRlVW5pY29kZUVzY2FwZSh1bmljb2RlNFBhdHRlcm4sIHJlYWRlciwgY2gsIHJlYWQ0Q2hhcnMocmVhZGVyKSkpIDpcbiAgaXNOdW1lcmljKGNoKSA/XG4gICAgY2hhcihjaCkgOlxuICBcImVsc2VcIiA/XG4gICAgcmVhZGVyRXJyb3IocmVhZGVyLCBcIlwiICsgXCJVbmV4cGVjdGVkIHVuaWNvZGUgZXNjYXBlIFwiICsgXCJcXFxcXCIgKyBjaCkgOlxuICAgIHZvaWQoMCk7XG59O1xuZXhwb3J0cy5lc2NhcGVDaGFyID0gZXNjYXBlQ2hhcjtcblxudmFyIHJlYWRQYXN0ID0gZnVuY3Rpb24gcmVhZFBhc3QocHJlZGljYXRlLCByZWFkZXIpIHtcbiAgcmV0dXJuIChmdW5jdGlvbiBsb29wKF8pIHtcbiAgICB2YXIgcmVjdXIgPSBsb29wO1xuICAgIHdoaWxlIChyZWN1ciA9PT0gbG9vcCkge1xuICAgICAgcmVjdXIgPSBwcmVkaWNhdGUocGVla0NoYXIocmVhZGVyKSkgP1xuICAgICAgKF8gPSByZWFkQ2hhcihyZWFkZXIpLCBsb29wKSA6XG4gICAgICBwZWVrQ2hhcihyZWFkZXIpO1xuICAgIH07XG4gICAgcmV0dXJuIHJlY3VyO1xuICB9KSh2b2lkKDApKTtcbn07XG5leHBvcnRzLnJlYWRQYXN0ID0gcmVhZFBhc3Q7XG5cbnZhciByZWFkRGVsaW1pdGVkTGlzdCA9IGZ1bmN0aW9uIHJlYWREZWxpbWl0ZWRMaXN0KGRlbGltLCByZWFkZXIsIGlzUmVjdXJzaXZlKSB7XG4gIHJldHVybiAoZnVuY3Rpb24gbG9vcChmb3JtKSB7XG4gICAgdmFyIHJlY3VyID0gbG9vcDtcbiAgICB3aGlsZSAocmVjdXIgPT09IGxvb3ApIHtcbiAgICAgIHJlY3VyID0gKGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGNoID0gcmVhZFBhc3QoaXNXaGl0ZXNwYWNlLCByZWFkZXIpO1xuICAgICAgIShjaCkgP1xuICAgICAgICByZWFkZXJFcnJvcihyZWFkZXIsIFwiRU9GXCIpIDpcbiAgICAgICAgdm9pZCgwKTtcbiAgICAgIHJldHVybiBkZWxpbSA9PT0gY2ggP1xuICAgICAgICAoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmVhZENoYXIocmVhZGVyKTtcbiAgICAgICAgICByZXR1cm4gZm9ybTtcbiAgICAgICAgfSkoKSA6XG4gICAgICAgIChmdW5jdGlvbigpIHtcbiAgICAgICAgICB2YXIgbWFjcm8gPSBtYWNyb3MoY2gpO1xuICAgICAgICAgIHJldHVybiBtYWNybyA/XG4gICAgICAgICAgICAoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHZhciByZXN1bHQgPSBtYWNybyhyZWFkZXIsIHJlYWRDaGFyKHJlYWRlcikpO1xuICAgICAgICAgICAgICByZXR1cm4gKGZvcm0gPSByZXN1bHQgPT09IHJlYWRlciA/XG4gICAgICAgICAgICAgICAgZm9ybSA6XG4gICAgICAgICAgICAgICAgY29uaihmb3JtLCByZXN1bHQpLCBsb29wKTtcbiAgICAgICAgICAgIH0pKCkgOlxuICAgICAgICAgICAgKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICB2YXIgbyA9IHJlYWQocmVhZGVyLCB0cnVlLCB2b2lkKDApLCBpc1JlY3Vyc2l2ZSk7XG4gICAgICAgICAgICAgIHJldHVybiAoZm9ybSA9IG8gPT09IHJlYWRlciA/XG4gICAgICAgICAgICAgICAgZm9ybSA6XG4gICAgICAgICAgICAgICAgY29uaihmb3JtLCBvKSwgbG9vcCk7XG4gICAgICAgICAgICB9KSgpO1xuICAgICAgICB9KSgpO1xuICAgIH0pKCk7XG4gICAgfTtcbiAgICByZXR1cm4gcmVjdXI7XG4gIH0pKFtdKTtcbn07XG5leHBvcnRzLnJlYWREZWxpbWl0ZWRMaXN0ID0gcmVhZERlbGltaXRlZExpc3Q7XG5cbnZhciBub3RJbXBsZW1lbnRlZCA9IGZ1bmN0aW9uIG5vdEltcGxlbWVudGVkKHJlYWRlciwgY2gpIHtcbiAgcmV0dXJuIHJlYWRlckVycm9yKHJlYWRlciwgXCJcIiArIFwiUmVhZGVyIGZvciBcIiArIGNoICsgXCIgbm90IGltcGxlbWVudGVkIHlldFwiKTtcbn07XG5leHBvcnRzLm5vdEltcGxlbWVudGVkID0gbm90SW1wbGVtZW50ZWQ7XG5cbnZhciByZWFkRGlzcGF0Y2ggPSBmdW5jdGlvbiByZWFkRGlzcGF0Y2gocmVhZGVyLCBfKSB7XG4gIHZhciBjaCA9IHJlYWRDaGFyKHJlYWRlcik7XG4gIHZhciBkbSA9IGRpc3BhdGNoTWFjcm9zKGNoKTtcbiAgcmV0dXJuIGRtID9cbiAgICBkbShyZWFkZXIsIF8pIDpcbiAgICAoZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgb2JqZWN0ID0gbWF5YmVSZWFkVGFnZ2VkVHlwZShyZWFkZXIsIGNoKTtcbiAgICAgIHJldHVybiBvYmplY3QgP1xuICAgICAgICBvYmplY3QgOlxuICAgICAgICByZWFkZXJFcnJvcihyZWFkZXIsIFwiTm8gZGlzcGF0Y2ggbWFjcm8gZm9yIFwiLCBjaCk7XG4gICAgfSkoKTtcbn07XG5leHBvcnRzLnJlYWREaXNwYXRjaCA9IHJlYWREaXNwYXRjaDtcblxudmFyIHJlYWRVbm1hdGNoZWREZWxpbWl0ZXIgPSBmdW5jdGlvbiByZWFkVW5tYXRjaGVkRGVsaW1pdGVyKHJkciwgY2gpIHtcbiAgcmV0dXJuIHJlYWRlckVycm9yKHJkciwgXCJVbm1hY2hlZCBkZWxpbWl0ZXIgXCIsIGNoKTtcbn07XG5leHBvcnRzLnJlYWRVbm1hdGNoZWREZWxpbWl0ZXIgPSByZWFkVW5tYXRjaGVkRGVsaW1pdGVyO1xuXG52YXIgcmVhZExpc3QgPSBmdW5jdGlvbiByZWFkTGlzdChyZWFkZXIsIF8pIHtcbiAgdmFyIGZvcm0gPSByZWFkRGVsaW1pdGVkTGlzdChcIilcIiwgcmVhZGVyLCB0cnVlKTtcbiAgcmV0dXJuIHdpdGhNZXRhKGxpc3QuYXBwbHkobGlzdCwgZm9ybSksIG1ldGEoZm9ybSkpO1xufTtcbmV4cG9ydHMucmVhZExpc3QgPSByZWFkTGlzdDtcblxudmFyIHJlYWRDb21tZW50ID0gZnVuY3Rpb24gcmVhZENvbW1lbnQocmVhZGVyLCBfKSB7XG4gIHJldHVybiAoZnVuY3Rpb24gbG9vcChidWZmZXIsIGNoKSB7XG4gICAgdmFyIHJlY3VyID0gbG9vcDtcbiAgICB3aGlsZSAocmVjdXIgPT09IGxvb3ApIHtcbiAgICAgIHJlY3VyID0gKGlzTmlsKGNoKSkgfHwgKFwiXFxuXCIgPT09IGNoKSA/XG4gICAgICByZWFkZXIgfHwgKGxpc3Qoc3ltYm9sKHZvaWQoMCksIFwiY29tbWVudFwiKSwgYnVmZmVyKSkgOlxuICAgIChcIlxcXFxcIiA9PT0gY2gpID9cbiAgICAgIChidWZmZXIgPSBcIlwiICsgYnVmZmVyICsgKGVzY2FwZUNoYXIoYnVmZmVyLCByZWFkZXIpKSwgY2ggPSByZWFkQ2hhcihyZWFkZXIpLCBsb29wKSA6XG4gICAgXCJlbHNlXCIgP1xuICAgICAgKGJ1ZmZlciA9IFwiXCIgKyBidWZmZXIgKyBjaCwgY2ggPSByZWFkQ2hhcihyZWFkZXIpLCBsb29wKSA6XG4gICAgICB2b2lkKDApO1xuICAgIH07XG4gICAgcmV0dXJuIHJlY3VyO1xuICB9KShcIlwiLCByZWFkQ2hhcihyZWFkZXIpKTtcbn07XG5leHBvcnRzLnJlYWRDb21tZW50ID0gcmVhZENvbW1lbnQ7XG5cbnZhciByZWFkVmVjdG9yID0gZnVuY3Rpb24gcmVhZFZlY3RvcihyZWFkZXIpIHtcbiAgcmV0dXJuIHJlYWREZWxpbWl0ZWRMaXN0KFwiXVwiLCByZWFkZXIsIHRydWUpO1xufTtcbmV4cG9ydHMucmVhZFZlY3RvciA9IHJlYWRWZWN0b3I7XG5cbnZhciByZWFkTWFwID0gZnVuY3Rpb24gcmVhZE1hcChyZWFkZXIpIHtcbiAgdmFyIGZvcm0gPSByZWFkRGVsaW1pdGVkTGlzdChcIn1cIiwgcmVhZGVyLCB0cnVlKTtcbiAgcmV0dXJuIGlzT2RkKGNvdW50KGZvcm0pKSA/XG4gICAgcmVhZGVyRXJyb3IocmVhZGVyLCBcIk1hcCBsaXRlcmFsIG11c3QgY29udGFpbiBhbiBldmVuIG51bWJlciBvZiBmb3Jtc1wiKSA6XG4gICAgd2l0aE1ldGEoZGljdGlvbmFyeS5hcHBseShkaWN0aW9uYXJ5LCBmb3JtKSwgbWV0YShmb3JtKSk7XG59O1xuZXhwb3J0cy5yZWFkTWFwID0gcmVhZE1hcDtcblxudmFyIHJlYWRTZXQgPSBmdW5jdGlvbiByZWFkU2V0KHJlYWRlciwgXykge1xuICB2YXIgZm9ybSA9IHJlYWREZWxpbWl0ZWRMaXN0KFwifVwiLCByZWFkZXIsIHRydWUpO1xuICByZXR1cm4gd2l0aE1ldGEoY29uY2F0KFtzeW1ib2wodm9pZCgwKSwgXCJzZXRcIildLCBmb3JtKSwgbWV0YShmb3JtKSk7XG59O1xuZXhwb3J0cy5yZWFkU2V0ID0gcmVhZFNldDtcblxudmFyIHJlYWROdW1iZXIgPSBmdW5jdGlvbiByZWFkTnVtYmVyKHJlYWRlciwgaW5pdGNoKSB7XG4gIHJldHVybiAoZnVuY3Rpb24gbG9vcChidWZmZXIsIGNoKSB7XG4gICAgdmFyIHJlY3VyID0gbG9vcDtcbiAgICB3aGlsZSAocmVjdXIgPT09IGxvb3ApIHtcbiAgICAgIHJlY3VyID0gKGlzTmlsKGNoKSkgfHwgKGlzV2hpdGVzcGFjZShjaCkpIHx8IChtYWNyb3MoY2gpKSA/XG4gICAgICAoZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBtYXRjaCA9IG1hdGNoTnVtYmVyKGJ1ZmZlcik7XG4gICAgICAgIHJldHVybiBpc05pbChtYXRjaCkgP1xuICAgICAgICAgIHJlYWRlckVycm9yKHJlYWRlciwgXCJJbnZhbGlkIG51bWJlciBmb3JtYXQgW1wiLCBidWZmZXIsIFwiXVwiKSA6XG4gICAgICAgICAgbWF0Y2g7XG4gICAgICB9KSgpIDpcbiAgICAgIChidWZmZXIgPSBcIlwiICsgYnVmZmVyICsgKHJlYWRDaGFyKHJlYWRlcikpLCBjaCA9IHBlZWtDaGFyKHJlYWRlciksIGxvb3ApO1xuICAgIH07XG4gICAgcmV0dXJuIHJlY3VyO1xuICB9KShpbml0Y2gsIHBlZWtDaGFyKHJlYWRlcikpO1xufTtcbmV4cG9ydHMucmVhZE51bWJlciA9IHJlYWROdW1iZXI7XG5cbnZhciByZWFkU3RyaW5nID0gZnVuY3Rpb24gcmVhZFN0cmluZyhyZWFkZXIpIHtcbiAgcmV0dXJuIChmdW5jdGlvbiBsb29wKGJ1ZmZlciwgY2gpIHtcbiAgICB2YXIgcmVjdXIgPSBsb29wO1xuICAgIHdoaWxlIChyZWN1ciA9PT0gbG9vcCkge1xuICAgICAgcmVjdXIgPSBpc05pbChjaCkgP1xuICAgICAgcmVhZGVyRXJyb3IocmVhZGVyLCBcIkVPRiB3aGlsZSByZWFkaW5nIHN0cmluZ1wiKSA6XG4gICAgXCJcXFxcXCIgPT09IGNoID9cbiAgICAgIChidWZmZXIgPSBcIlwiICsgYnVmZmVyICsgKGVzY2FwZUNoYXIoYnVmZmVyLCByZWFkZXIpKSwgY2ggPSByZWFkQ2hhcihyZWFkZXIpLCBsb29wKSA6XG4gICAgXCJcXFwiXCIgPT09IGNoID9cbiAgICAgIGJ1ZmZlciA6XG4gICAgXCJkZWZhdWx0XCIgP1xuICAgICAgKGJ1ZmZlciA9IFwiXCIgKyBidWZmZXIgKyBjaCwgY2ggPSByZWFkQ2hhcihyZWFkZXIpLCBsb29wKSA6XG4gICAgICB2b2lkKDApO1xuICAgIH07XG4gICAgcmV0dXJuIHJlY3VyO1xuICB9KShcIlwiLCByZWFkQ2hhcihyZWFkZXIpKTtcbn07XG5leHBvcnRzLnJlYWRTdHJpbmcgPSByZWFkU3RyaW5nO1xuXG52YXIgcmVhZFVucXVvdGUgPSBmdW5jdGlvbiByZWFkVW5xdW90ZShyZWFkZXIpIHtcbiAgdmFyIGNoID0gcGVla0NoYXIocmVhZGVyKTtcbiAgcmV0dXJuICEoY2gpID9cbiAgICByZWFkZXJFcnJvcihyZWFkZXIsIFwiRU9GIHdoaWxlIHJlYWRpbmcgY2hhcmFjdGVyXCIpIDpcbiAgY2ggPT09IFwiQFwiID9cbiAgICAoZnVuY3Rpb24oKSB7XG4gICAgICByZWFkQ2hhcihyZWFkZXIpO1xuICAgICAgcmV0dXJuIGxpc3Qoc3ltYm9sKHZvaWQoMCksIFwidW5xdW90ZS1zcGxpY2luZ1wiKSwgcmVhZChyZWFkZXIsIHRydWUsIHZvaWQoMCksIHRydWUpKTtcbiAgICB9KSgpIDpcbiAgICBsaXN0KHN5bWJvbCh2b2lkKDApLCBcInVucXVvdGVcIiksIHJlYWQocmVhZGVyLCB0cnVlLCB2b2lkKDApLCB0cnVlKSk7XG59O1xuZXhwb3J0cy5yZWFkVW5xdW90ZSA9IHJlYWRVbnF1b3RlO1xuXG52YXIgc3BlY2lhbFN5bWJvbHMgPSBmdW5jdGlvbiBzcGVjaWFsU3ltYm9scyh0ZXh0LCBub3RGb3VuZCkge1xuICByZXR1cm4gdGV4dCA9PT0gXCJuaWxcIiA/XG4gICAgdm9pZCgwKSA6XG4gIHRleHQgPT09IFwidHJ1ZVwiID9cbiAgICB0cnVlIDpcbiAgdGV4dCA9PT0gXCJmYWxzZVwiID9cbiAgICBmYWxzZSA6XG4gIFwiZWxzZVwiID9cbiAgICBub3RGb3VuZCA6XG4gICAgdm9pZCgwKTtcbn07XG5leHBvcnRzLnNwZWNpYWxTeW1ib2xzID0gc3BlY2lhbFN5bWJvbHM7XG5cbnZhciByZWFkU3ltYm9sID0gZnVuY3Rpb24gcmVhZFN5bWJvbChyZWFkZXIsIGluaXRjaCkge1xuICB2YXIgdG9rZW4gPSByZWFkVG9rZW4ocmVhZGVyLCBpbml0Y2gpO1xuICB2YXIgcGFydHMgPSBzcGxpdCh0b2tlbiwgXCIvXCIpO1xuICB2YXIgaGFzTnMgPSAoY291bnQocGFydHMpID4gMSkgJiYgKGNvdW50KHRva2VuKSA+IDEpO1xuICB2YXIgbnMgPSBmaXJzdChwYXJ0cyk7XG4gIHZhciBuYW1lID0gam9pbihcIi9cIiwgcmVzdChwYXJ0cykpO1xuICByZXR1cm4gaGFzTnMgP1xuICAgIHN5bWJvbChucywgbmFtZSkgOlxuICAgIHNwZWNpYWxTeW1ib2xzKHRva2VuLCBzeW1ib2wodG9rZW4pKTtcbn07XG5leHBvcnRzLnJlYWRTeW1ib2wgPSByZWFkU3ltYm9sO1xuXG52YXIgcmVhZEtleXdvcmQgPSBmdW5jdGlvbiByZWFkS2V5d29yZChyZWFkZXIsIGluaXRjaCkge1xuICB2YXIgdG9rZW4gPSByZWFkVG9rZW4ocmVhZGVyLCByZWFkQ2hhcihyZWFkZXIpKTtcbiAgdmFyIHBhcnRzID0gc3BsaXQodG9rZW4sIFwiL1wiKTtcbiAgdmFyIG5hbWUgPSBsYXN0KHBhcnRzKTtcbiAgdmFyIG5zID0gY291bnQocGFydHMpID4gMSA/XG4gICAgam9pbihcIi9cIiwgYnV0bGFzdChwYXJ0cykpIDpcbiAgICB2b2lkKDApO1xuICB2YXIgaXNzdWUgPSBsYXN0KG5zKSA9PT0gXCI6XCIgP1xuICAgIFwibmFtZXNwYWNlIGNhbid0IGVuZHMgd2l0aCBcXFwiOlxcXCJcIiA6XG4gIGxhc3QobmFtZSkgPT09IFwiOlwiID9cbiAgICBcIm5hbWUgY2FuJ3QgZW5kIHdpdGggXFxcIjpcXFwiXCIgOlxuICBsYXN0KG5hbWUpID09PSBcIi9cIiA/XG4gICAgXCJuYW1lIGNhbid0IGVuZCB3aXRoIFxcXCIvXFxcIlwiIDpcbiAgY291bnQoc3BsaXQodG9rZW4sIFwiOjpcIikpID4gMSA/XG4gICAgXCJuYW1lIGNhbid0IGNvbnRhaW4gXFxcIjo6XFxcIlwiIDpcbiAgICB2b2lkKDApO1xuICByZXR1cm4gaXNzdWUgP1xuICAgIHJlYWRlckVycm9yKHJlYWRlciwgXCJJbnZhbGlkIHRva2VuIChcIiwgaXNzdWUsIFwiKTogXCIsIHRva2VuKSA6XG4gICghKG5zKSkgJiYgKGZpcnN0KG5hbWUpID09PSBcIjpcIikgP1xuICAgIGtleXdvcmQocmVzdChuYW1lKSkgOlxuICAgIGtleXdvcmQobnMsIG5hbWUpO1xufTtcbmV4cG9ydHMucmVhZEtleXdvcmQgPSByZWFkS2V5d29yZDtcblxudmFyIGRlc3VnYXJNZXRhID0gZnVuY3Rpb24gZGVzdWdhck1ldGEoZikge1xuICByZXR1cm4gaXNLZXl3b3JkKGYpID9cbiAgICBkaWN0aW9uYXJ5KG5hbWUoZiksIHRydWUpIDpcbiAgaXNTeW1ib2woZikgP1xuICAgIHtcbiAgICAgIFwidGFnXCI6IGZcbiAgICB9IDpcbiAgaXNTdHJpbmcoZikgP1xuICAgIHtcbiAgICAgIFwidGFnXCI6IGZcbiAgICB9IDpcbiAgXCJlbHNlXCIgP1xuICAgIGYgOlxuICAgIHZvaWQoMCk7XG59O1xuZXhwb3J0cy5kZXN1Z2FyTWV0YSA9IGRlc3VnYXJNZXRhO1xuXG52YXIgd3JhcHBpbmdSZWFkZXIgPSBmdW5jdGlvbiB3cmFwcGluZ1JlYWRlcihwcmVmaXgpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKHJlYWRlcikge1xuICAgIHJldHVybiBsaXN0KHByZWZpeCwgcmVhZChyZWFkZXIsIHRydWUsIHZvaWQoMCksIHRydWUpKTtcbiAgfTtcbn07XG5leHBvcnRzLndyYXBwaW5nUmVhZGVyID0gd3JhcHBpbmdSZWFkZXI7XG5cbnZhciB0aHJvd2luZ1JlYWRlciA9IGZ1bmN0aW9uIHRocm93aW5nUmVhZGVyKG1zZykge1xuICByZXR1cm4gZnVuY3Rpb24ocmVhZGVyKSB7XG4gICAgcmV0dXJuIHJlYWRlckVycm9yKHJlYWRlciwgbXNnKTtcbiAgfTtcbn07XG5leHBvcnRzLnRocm93aW5nUmVhZGVyID0gdGhyb3dpbmdSZWFkZXI7XG5cbnZhciByZWFkTWV0YSA9IGZ1bmN0aW9uIHJlYWRNZXRhKHJlYWRlciwgXykge1xuICB2YXIgbWV0YWRhdGEgPSBkZXN1Z2FyTWV0YShyZWFkKHJlYWRlciwgdHJ1ZSwgdm9pZCgwKSwgdHJ1ZSkpO1xuICAhKGlzRGljdGlvbmFyeShtZXRhZGF0YSkpID9cbiAgICByZWFkZXJFcnJvcihyZWFkZXIsIFwiTWV0YWRhdGEgbXVzdCBiZSBTeW1ib2wsIEtleXdvcmQsIFN0cmluZyBvciBNYXBcIikgOlxuICAgIHZvaWQoMCk7XG4gIHJldHVybiAoZnVuY3Rpb24oKSB7XG4gICAgdmFyIGZvcm0gPSByZWFkKHJlYWRlciwgdHJ1ZSwgdm9pZCgwKSwgdHJ1ZSk7XG4gICAgcmV0dXJuIGlzT2JqZWN0KGZvcm0pID9cbiAgICAgIHdpdGhNZXRhKGZvcm0sIGNvbmoobWV0YWRhdGEsIG1ldGEoZm9ybSkpKSA6XG4gICAgICBmb3JtO1xuICB9KSgpO1xufTtcbmV4cG9ydHMucmVhZE1ldGEgPSByZWFkTWV0YTtcblxudmFyIHJlYWRSZWdleCA9IGZ1bmN0aW9uIHJlYWRSZWdleChyZWFkZXIpIHtcbiAgcmV0dXJuIChmdW5jdGlvbiBsb29wKGJ1ZmZlciwgY2gpIHtcbiAgICB2YXIgcmVjdXIgPSBsb29wO1xuICAgIHdoaWxlIChyZWN1ciA9PT0gbG9vcCkge1xuICAgICAgcmVjdXIgPSBpc05pbChjaCkgP1xuICAgICAgcmVhZGVyRXJyb3IocmVhZGVyLCBcIkVPRiB3aGlsZSByZWFkaW5nIHN0cmluZ1wiKSA6XG4gICAgXCJcXFxcXCIgPT09IGNoID9cbiAgICAgIChidWZmZXIgPSBcIlwiICsgYnVmZmVyICsgY2ggKyAocmVhZENoYXIocmVhZGVyKSksIGNoID0gcmVhZENoYXIocmVhZGVyKSwgbG9vcCkgOlxuICAgIFwiXFxcIlwiID09PSBjaCA/XG4gICAgICByZVBhdHRlcm4oYnVmZmVyKSA6XG4gICAgXCJkZWZhdWx0XCIgP1xuICAgICAgKGJ1ZmZlciA9IFwiXCIgKyBidWZmZXIgKyBjaCwgY2ggPSByZWFkQ2hhcihyZWFkZXIpLCBsb29wKSA6XG4gICAgICB2b2lkKDApO1xuICAgIH07XG4gICAgcmV0dXJuIHJlY3VyO1xuICB9KShcIlwiLCByZWFkQ2hhcihyZWFkZXIpKTtcbn07XG5leHBvcnRzLnJlYWRSZWdleCA9IHJlYWRSZWdleDtcblxudmFyIHJlYWRQYXJhbSA9IGZ1bmN0aW9uIHJlYWRQYXJhbShyZWFkZXIsIGluaXRjaCkge1xuICB2YXIgZm9ybSA9IHJlYWRTeW1ib2wocmVhZGVyLCBpbml0Y2gpO1xuICByZXR1cm4gaXNFcXVhbChmb3JtLCBzeW1ib2woXCIlXCIpKSA/XG4gICAgc3ltYm9sKFwiJTFcIikgOlxuICAgIGZvcm07XG59O1xuZXhwb3J0cy5yZWFkUGFyYW0gPSByZWFkUGFyYW07XG5cbnZhciBpc1BhcmFtID0gZnVuY3Rpb24gaXNQYXJhbShmb3JtKSB7XG4gIHJldHVybiAoaXNTeW1ib2woZm9ybSkpICYmIChcIiVcIiA9PT0gZmlyc3QobmFtZShmb3JtKSkpO1xufTtcbmV4cG9ydHMuaXNQYXJhbSA9IGlzUGFyYW07XG5cbnZhciBsYW1iZGFQYXJhbXNIYXNoID0gZnVuY3Rpb24gbGFtYmRhUGFyYW1zSGFzaChmb3JtKSB7XG4gIHJldHVybiBpc1BhcmFtKGZvcm0pID9cbiAgICBkaWN0aW9uYXJ5KGZvcm0sIGZvcm0pIDpcbiAgKGlzRGljdGlvbmFyeShmb3JtKSkgfHwgKGlzVmVjdG9yKGZvcm0pKSB8fCAoaXNMaXN0KGZvcm0pKSA/XG4gICAgY29uai5hcHBseShjb25qLCBtYXAobGFtYmRhUGFyYW1zSGFzaCwgdmVjKGZvcm0pKSkgOlxuICBcImVsc2VcIiA/XG4gICAge30gOlxuICAgIHZvaWQoMCk7XG59O1xuZXhwb3J0cy5sYW1iZGFQYXJhbXNIYXNoID0gbGFtYmRhUGFyYW1zSGFzaDtcblxudmFyIGxhbWJkYVBhcmFtcyA9IGZ1bmN0aW9uIGxhbWJkYVBhcmFtcyhib2R5KSB7XG4gIHZhciBuYW1lcyA9IHNvcnQodmFscyhsYW1iZGFQYXJhbXNIYXNoKGJvZHkpKSk7XG4gIHZhciB2YXJpYWRpYyA9IGlzRXF1YWwoZmlyc3QobmFtZXMpLCBzeW1ib2woXCIlJlwiKSk7XG4gIHZhciBuID0gdmFyaWFkaWMgJiYgKGNvdW50KG5hbWVzKSA9PT0gMSkgP1xuICAgIDAgOlxuICAgIHBhcnNlSW50KHJlc3QobmFtZShsYXN0KG5hbWVzKSkpKTtcbiAgdmFyIHBhcmFtcyA9IChmdW5jdGlvbiBsb29wKG5hbWVzLCBpKSB7XG4gICAgdmFyIHJlY3VyID0gbG9vcDtcbiAgICB3aGlsZSAocmVjdXIgPT09IGxvb3ApIHtcbiAgICAgIHJlY3VyID0gaSA8PSBuID9cbiAgICAgIChuYW1lcyA9IGNvbmoobmFtZXMsIHN5bWJvbChcIlwiICsgXCIlXCIgKyBpKSksIGkgPSBpbmMoaSksIGxvb3ApIDpcbiAgICAgIG5hbWVzO1xuICAgIH07XG4gICAgcmV0dXJuIHJlY3VyO1xuICB9KShbXSwgMSk7XG4gIHJldHVybiB2YXJpYWRpYyA/XG4gICAgY29uaihwYXJhbXMsIHN5bWJvbCh2b2lkKDApLCBcIiZcIiksIHN5bWJvbCh2b2lkKDApLCBcIiUmXCIpKSA6XG4gICAgbmFtZXM7XG59O1xuZXhwb3J0cy5sYW1iZGFQYXJhbXMgPSBsYW1iZGFQYXJhbXM7XG5cbnZhciByZWFkTGFtYmRhID0gZnVuY3Rpb24gcmVhZExhbWJkYShyZWFkZXIpIHtcbiAgdmFyIGJvZHkgPSByZWFkTGlzdChyZWFkZXIpO1xuICByZXR1cm4gbGlzdChzeW1ib2wodm9pZCgwKSwgXCJmblwiKSwgbGFtYmRhUGFyYW1zKGJvZHkpLCBib2R5KTtcbn07XG5leHBvcnRzLnJlYWRMYW1iZGEgPSByZWFkTGFtYmRhO1xuXG52YXIgcmVhZERpc2NhcmQgPSBmdW5jdGlvbiByZWFkRGlzY2FyZChyZWFkZXIsIF8pIHtcbiAgcmVhZChyZWFkZXIsIHRydWUsIHZvaWQoMCksIHRydWUpO1xuICByZXR1cm4gcmVhZGVyO1xufTtcbmV4cG9ydHMucmVhZERpc2NhcmQgPSByZWFkRGlzY2FyZDtcblxudmFyIG1hY3JvcyA9IGZ1bmN0aW9uIG1hY3JvcyhjKSB7XG4gIHJldHVybiBjID09PSBcIlxcXCJcIiA/XG4gICAgcmVhZFN0cmluZyA6XG4gIGMgPT09IFwiOlwiID9cbiAgICByZWFkS2V5d29yZCA6XG4gIGMgPT09IFwiO1wiID9cbiAgICByZWFkQ29tbWVudCA6XG4gIGMgPT09IFwiJ1wiID9cbiAgICB3cmFwcGluZ1JlYWRlcihzeW1ib2wodm9pZCgwKSwgXCJxdW90ZVwiKSkgOlxuICBjID09PSBcIkBcIiA/XG4gICAgd3JhcHBpbmdSZWFkZXIoc3ltYm9sKHZvaWQoMCksIFwiZGVyZWZcIikpIDpcbiAgYyA9PT0gXCJeXCIgP1xuICAgIHJlYWRNZXRhIDpcbiAgYyA9PT0gXCJgXCIgP1xuICAgIHdyYXBwaW5nUmVhZGVyKHN5bWJvbCh2b2lkKDApLCBcInN5bnRheC1xdW90ZVwiKSkgOlxuICBjID09PSBcIn5cIiA/XG4gICAgcmVhZFVucXVvdGUgOlxuICBjID09PSBcIihcIiA/XG4gICAgcmVhZExpc3QgOlxuICBjID09PSBcIilcIiA/XG4gICAgcmVhZFVubWF0Y2hlZERlbGltaXRlciA6XG4gIGMgPT09IFwiW1wiID9cbiAgICByZWFkVmVjdG9yIDpcbiAgYyA9PT0gXCJdXCIgP1xuICAgIHJlYWRVbm1hdGNoZWREZWxpbWl0ZXIgOlxuICBjID09PSBcIntcIiA/XG4gICAgcmVhZE1hcCA6XG4gIGMgPT09IFwifVwiID9cbiAgICByZWFkVW5tYXRjaGVkRGVsaW1pdGVyIDpcbiAgYyA9PT0gXCJcXFxcXCIgP1xuICAgIHJlYWRDaGFyIDpcbiAgYyA9PT0gXCIlXCIgP1xuICAgIHJlYWRQYXJhbSA6XG4gIGMgPT09IFwiI1wiID9cbiAgICByZWFkRGlzcGF0Y2ggOlxuICBcImVsc2VcIiA/XG4gICAgdm9pZCgwKSA6XG4gICAgdm9pZCgwKTtcbn07XG5leHBvcnRzLm1hY3JvcyA9IG1hY3JvcztcblxudmFyIGRpc3BhdGNoTWFjcm9zID0gZnVuY3Rpb24gZGlzcGF0Y2hNYWNyb3Mocykge1xuICByZXR1cm4gcyA9PT0gXCJ7XCIgP1xuICAgIHJlYWRTZXQgOlxuICBzID09PSBcIihcIiA/XG4gICAgcmVhZExhbWJkYSA6XG4gIHMgPT09IFwiPFwiID9cbiAgICB0aHJvd2luZ1JlYWRlcihcIlVucmVhZGFibGUgZm9ybVwiKSA6XG4gIHMgPT09IFwiXFxcIlwiID9cbiAgICByZWFkUmVnZXggOlxuICBzID09PSBcIiFcIiA/XG4gICAgcmVhZENvbW1lbnQgOlxuICBzID09PSBcIl9cIiA/XG4gICAgcmVhZERpc2NhcmQgOlxuICBcImVsc2VcIiA/XG4gICAgdm9pZCgwKSA6XG4gICAgdm9pZCgwKTtcbn07XG5leHBvcnRzLmRpc3BhdGNoTWFjcm9zID0gZGlzcGF0Y2hNYWNyb3M7XG5cbnZhciByZWFkRm9ybSA9IGZ1bmN0aW9uIHJlYWRGb3JtKHJlYWRlciwgY2gpIHtcbiAgdmFyIHN0YXJ0ID0ge1xuICAgIFwibGluZVwiOiAocmVhZGVyIHx8IDApW1wibGluZVwiXSxcbiAgICBcImNvbHVtblwiOiAocmVhZGVyIHx8IDApW1wiY29sdW1uXCJdXG4gIH07XG4gIHZhciByZWFkTWFjcm8gPSBtYWNyb3MoY2gpO1xuICB2YXIgZm9ybSA9IHJlYWRNYWNybyA/XG4gICAgcmVhZE1hY3JvKHJlYWRlciwgY2gpIDpcbiAgaXNOdW1iZXJMaXRlcmFsKHJlYWRlciwgY2gpID9cbiAgICByZWFkTnVtYmVyKHJlYWRlciwgY2gpIDpcbiAgXCJlbHNlXCIgP1xuICAgIHJlYWRTeW1ib2wocmVhZGVyLCBjaCkgOlxuICAgIHZvaWQoMCk7XG4gIHJldHVybiBmb3JtID09PSByZWFkZXIgP1xuICAgIGZvcm0gOlxuICAhKChpc1N0cmluZyhmb3JtKSkgfHwgKGlzTnVtYmVyKGZvcm0pKSB8fCAoaXNCb29sZWFuKGZvcm0pKSB8fCAoaXNOaWwoZm9ybSkpIHx8IChpc0tleXdvcmQoZm9ybSkpKSA/XG4gICAgd2l0aE1ldGEoZm9ybSwgY29uaih7XG4gICAgICBcInN0YXJ0XCI6IHN0YXJ0LFxuICAgICAgXCJlbmRcIjoge1xuICAgICAgICBcImxpbmVcIjogKHJlYWRlciB8fCAwKVtcImxpbmVcIl0sXG4gICAgICAgIFwiY29sdW1uXCI6IChyZWFkZXIgfHwgMClbXCJjb2x1bW5cIl1cbiAgICAgIH1cbiAgICB9LCBtZXRhKGZvcm0pKSkgOlxuICBcImVsc2VcIiA/XG4gICAgZm9ybSA6XG4gICAgdm9pZCgwKTtcbn07XG5leHBvcnRzLnJlYWRGb3JtID0gcmVhZEZvcm07XG5cbnZhciByZWFkID0gZnVuY3Rpb24gcmVhZChyZWFkZXIsIGVvZklzRXJyb3IsIHNlbnRpbmVsLCBpc1JlY3Vyc2l2ZSkge1xuICByZXR1cm4gKGZ1bmN0aW9uIGxvb3AoKSB7XG4gICAgdmFyIHJlY3VyID0gbG9vcDtcbiAgICB3aGlsZSAocmVjdXIgPT09IGxvb3ApIHtcbiAgICAgIHJlY3VyID0gKGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGNoID0gcmVhZENoYXIocmVhZGVyKTtcbiAgICAgIHZhciBmb3JtID0gaXNOaWwoY2gpID9cbiAgICAgICAgZW9mSXNFcnJvciA/XG4gICAgICAgICAgcmVhZGVyRXJyb3IocmVhZGVyLCBcIkVPRlwiKSA6XG4gICAgICAgICAgc2VudGluZWwgOlxuICAgICAgaXNXaGl0ZXNwYWNlKGNoKSA/XG4gICAgICAgIHJlYWRlciA6XG4gICAgICBpc0NvbW1lbnRQcmVmaXgoY2gpID9cbiAgICAgICAgcmVhZChyZWFkQ29tbWVudChyZWFkZXIsIGNoKSwgZW9mSXNFcnJvciwgc2VudGluZWwsIGlzUmVjdXJzaXZlKSA6XG4gICAgICBcImVsc2VcIiA/XG4gICAgICAgIHJlYWRGb3JtKHJlYWRlciwgY2gpIDpcbiAgICAgICAgdm9pZCgwKTtcbiAgICAgIHJldHVybiBmb3JtID09PSByZWFkZXIgP1xuICAgICAgICAobG9vcCkgOlxuICAgICAgICBmb3JtO1xuICAgIH0pKCk7XG4gICAgfTtcbiAgICByZXR1cm4gcmVjdXI7XG4gIH0pKCk7XG59O1xuZXhwb3J0cy5yZWFkID0gcmVhZDtcblxudmFyIHJlYWRfID0gZnVuY3Rpb24gcmVhZF8oc291cmNlLCB1cmkpIHtcbiAgdmFyIHJlYWRlciA9IHB1c2hCYWNrUmVhZGVyKHNvdXJjZSwgdXJpKTtcbiAgdmFyIGVvZiA9IGdlbnN5bSgpO1xuICByZXR1cm4gKGZ1bmN0aW9uIGxvb3AoZm9ybXMsIGZvcm0pIHtcbiAgICB2YXIgcmVjdXIgPSBsb29wO1xuICAgIHdoaWxlIChyZWN1ciA9PT0gbG9vcCkge1xuICAgICAgcmVjdXIgPSBmb3JtID09PSBlb2YgP1xuICAgICAgZm9ybXMgOlxuICAgICAgKGZvcm1zID0gY29uaihmb3JtcywgZm9ybSksIGZvcm0gPSByZWFkKHJlYWRlciwgZmFsc2UsIGVvZiwgZmFsc2UpLCBsb29wKTtcbiAgICB9O1xuICAgIHJldHVybiByZWN1cjtcbiAgfSkoW10sIHJlYWQocmVhZGVyLCBmYWxzZSwgZW9mLCBmYWxzZSkpO1xufTtcbmV4cG9ydHMucmVhZF8gPSByZWFkXztcblxudmFyIHJlYWRGcm9tU3RyaW5nID0gZnVuY3Rpb24gcmVhZEZyb21TdHJpbmcoc291cmNlLCB1cmkpIHtcbiAgdmFyIHJlYWRlciA9IHB1c2hCYWNrUmVhZGVyKHNvdXJjZSwgdXJpKTtcbiAgcmV0dXJuIHJlYWQocmVhZGVyLCB0cnVlLCB2b2lkKDApLCBmYWxzZSk7XG59O1xuZXhwb3J0cy5yZWFkRnJvbVN0cmluZyA9IHJlYWRGcm9tU3RyaW5nO1xuXG52YXIgcmVhZFV1aWQgPSBmdW5jdGlvbiByZWFkVXVpZCh1dWlkKSB7XG4gIHJldHVybiBpc1N0cmluZyh1dWlkKSA/XG4gICAgbGlzdChzeW1ib2wodm9pZCgwKSwgXCJVVUlELlwiKSwgdXVpZCkgOlxuICAgIHJlYWRlckVycm9yKHZvaWQoMCksIFwiVVVJRCBsaXRlcmFsIGV4cGVjdHMgYSBzdHJpbmcgYXMgaXRzIHJlcHJlc2VudGF0aW9uLlwiKTtcbn07XG5cbnZhciByZWFkUXVldWUgPSBmdW5jdGlvbiByZWFkUXVldWUoaXRlbXMpIHtcbiAgcmV0dXJuIGlzVmVjdG9yKGl0ZW1zKSA/XG4gICAgbGlzdChzeW1ib2wodm9pZCgwKSwgXCJQZXJzaXN0ZW50UXVldWUuXCIpLCBpdGVtcykgOlxuICAgIHJlYWRlckVycm9yKHZvaWQoMCksIFwiUXVldWUgbGl0ZXJhbCBleHBlY3RzIGEgdmVjdG9yIGZvciBpdHMgZWxlbWVudHMuXCIpO1xufTtcblxudmFyIF9fdGFnVGFibGVfXyA9IGRpY3Rpb25hcnkoXCJ1dWlkXCIsIHJlYWRVdWlkLCBcInF1ZXVlXCIsIHJlYWRRdWV1ZSk7XG5leHBvcnRzLl9fdGFnVGFibGVfXyA9IF9fdGFnVGFibGVfXztcblxudmFyIG1heWJlUmVhZFRhZ2dlZFR5cGUgPSBmdW5jdGlvbiBtYXliZVJlYWRUYWdnZWRUeXBlKHJlYWRlciwgaW5pdGNoKSB7XG4gIHZhciB0YWcgPSByZWFkU3ltYm9sKHJlYWRlciwgaW5pdGNoKTtcbiAgdmFyIHBmbiA9IChfX3RhZ1RhYmxlX18gfHwgMClbbmFtZSh0YWcpXTtcbiAgcmV0dXJuIHBmbiA/XG4gICAgcGZuKHJlYWQocmVhZGVyLCB0cnVlLCB2b2lkKDApLCBmYWxzZSkpIDpcbiAgICByZWFkZXJFcnJvcihyZWFkZXIsIFwiXCIgKyBcIkNvdWxkIG5vdCBmaW5kIHRhZyBwYXJzZXIgZm9yIFwiICsgKG5hbWUodGFnKSkgKyBcIiBpbiBcIiArIChcIlwiICsgKGtleXMoX190YWdUYWJsZV9fKSkpKTtcbn07XG5leHBvcnRzLm1heWJlUmVhZFRhZ2dlZFR5cGUgPSBtYXliZVJlYWRUYWdnZWRUeXBlIiwidmFyIF9uc18gPSB7XG4gIFwiaWRcIjogXCJ3aXNwLmNvbXBpbGVyXCIsXG4gIFwiZG9jXCI6IFwid2lzcCBsYW5ndWFnZSBjb21waWxlclwiXG59O1xudmFyIHdpc3BfcmVhZGVyID0gcmVxdWlyZShcIi4vcmVhZGVyXCIpO1xudmFyIHJlYWRGcm9tU3RyaW5nID0gd2lzcF9yZWFkZXIucmVhZEZyb21TdHJpbmc7O1xudmFyIHdpc3BfYXN0ID0gcmVxdWlyZShcIi4vYXN0XCIpO1xudmFyIG1ldGEgPSB3aXNwX2FzdC5tZXRhO1xudmFyIHdpdGhNZXRhID0gd2lzcF9hc3Qud2l0aE1ldGE7XG52YXIgaXNTeW1ib2wgPSB3aXNwX2FzdC5pc1N5bWJvbDtcbnZhciBzeW1ib2wgPSB3aXNwX2FzdC5zeW1ib2w7XG52YXIgaXNLZXl3b3JkID0gd2lzcF9hc3QuaXNLZXl3b3JkO1xudmFyIGtleXdvcmQgPSB3aXNwX2FzdC5rZXl3b3JkO1xudmFyIG5hbWVzcGFjZSA9IHdpc3BfYXN0Lm5hbWVzcGFjZTtcbnZhciBpc1VucXVvdGUgPSB3aXNwX2FzdC5pc1VucXVvdGU7XG52YXIgaXNVbnF1b3RlU3BsaWNpbmcgPSB3aXNwX2FzdC5pc1VucXVvdGVTcGxpY2luZztcbnZhciBpc1F1b3RlID0gd2lzcF9hc3QuaXNRdW90ZTtcbnZhciBpc1N5bnRheFF1b3RlID0gd2lzcF9hc3QuaXNTeW50YXhRdW90ZTtcbnZhciBuYW1lID0gd2lzcF9hc3QubmFtZTtcbnZhciBnZW5zeW0gPSB3aXNwX2FzdC5nZW5zeW07XG52YXIgcHJTdHIgPSB3aXNwX2FzdC5wclN0cjs7XG52YXIgd2lzcF9zZXF1ZW5jZSA9IHJlcXVpcmUoXCIuL3NlcXVlbmNlXCIpO1xudmFyIGlzRW1wdHkgPSB3aXNwX3NlcXVlbmNlLmlzRW1wdHk7XG52YXIgY291bnQgPSB3aXNwX3NlcXVlbmNlLmNvdW50O1xudmFyIGlzTGlzdCA9IHdpc3Bfc2VxdWVuY2UuaXNMaXN0O1xudmFyIGxpc3QgPSB3aXNwX3NlcXVlbmNlLmxpc3Q7XG52YXIgZmlyc3QgPSB3aXNwX3NlcXVlbmNlLmZpcnN0O1xudmFyIHNlY29uZCA9IHdpc3Bfc2VxdWVuY2Uuc2Vjb25kO1xudmFyIHRoaXJkID0gd2lzcF9zZXF1ZW5jZS50aGlyZDtcbnZhciByZXN0ID0gd2lzcF9zZXF1ZW5jZS5yZXN0O1xudmFyIGNvbnMgPSB3aXNwX3NlcXVlbmNlLmNvbnM7XG52YXIgY29uaiA9IHdpc3Bfc2VxdWVuY2UuY29uajtcbnZhciByZXZlcnNlID0gd2lzcF9zZXF1ZW5jZS5yZXZlcnNlO1xudmFyIHJlZHVjZSA9IHdpc3Bfc2VxdWVuY2UucmVkdWNlO1xudmFyIHZlYyA9IHdpc3Bfc2VxdWVuY2UudmVjO1xudmFyIGxhc3QgPSB3aXNwX3NlcXVlbmNlLmxhc3Q7XG52YXIgcmVwZWF0ID0gd2lzcF9zZXF1ZW5jZS5yZXBlYXQ7XG52YXIgbWFwID0gd2lzcF9zZXF1ZW5jZS5tYXA7XG52YXIgZmlsdGVyID0gd2lzcF9zZXF1ZW5jZS5maWx0ZXI7XG52YXIgdGFrZSA9IHdpc3Bfc2VxdWVuY2UudGFrZTtcbnZhciBjb25jYXQgPSB3aXNwX3NlcXVlbmNlLmNvbmNhdDtcbnZhciBpc1NlcSA9IHdpc3Bfc2VxdWVuY2UuaXNTZXE7O1xudmFyIHdpc3BfcnVudGltZSA9IHJlcXVpcmUoXCIuL3J1bnRpbWVcIik7XG52YXIgaXNPZGQgPSB3aXNwX3J1bnRpbWUuaXNPZGQ7XG52YXIgaXNEaWN0aW9uYXJ5ID0gd2lzcF9ydW50aW1lLmlzRGljdGlvbmFyeTtcbnZhciBkaWN0aW9uYXJ5ID0gd2lzcF9ydW50aW1lLmRpY3Rpb25hcnk7XG52YXIgbWVyZ2UgPSB3aXNwX3J1bnRpbWUubWVyZ2U7XG52YXIga2V5cyA9IHdpc3BfcnVudGltZS5rZXlzO1xudmFyIHZhbHMgPSB3aXNwX3J1bnRpbWUudmFscztcbnZhciBpc0NvbnRhaW5zVmVjdG9yID0gd2lzcF9ydW50aW1lLmlzQ29udGFpbnNWZWN0b3I7XG52YXIgbWFwRGljdGlvbmFyeSA9IHdpc3BfcnVudGltZS5tYXBEaWN0aW9uYXJ5O1xudmFyIGlzU3RyaW5nID0gd2lzcF9ydW50aW1lLmlzU3RyaW5nO1xudmFyIGlzTnVtYmVyID0gd2lzcF9ydW50aW1lLmlzTnVtYmVyO1xudmFyIGlzVmVjdG9yID0gd2lzcF9ydW50aW1lLmlzVmVjdG9yO1xudmFyIGlzQm9vbGVhbiA9IHdpc3BfcnVudGltZS5pc0Jvb2xlYW47XG52YXIgc3VicyA9IHdpc3BfcnVudGltZS5zdWJzO1xudmFyIHJlRmluZCA9IHdpc3BfcnVudGltZS5yZUZpbmQ7XG52YXIgaXNUcnVlID0gd2lzcF9ydW50aW1lLmlzVHJ1ZTtcbnZhciBpc0ZhbHNlID0gd2lzcF9ydW50aW1lLmlzRmFsc2U7XG52YXIgaXNOaWwgPSB3aXNwX3J1bnRpbWUuaXNOaWw7XG52YXIgaXNSZVBhdHRlcm4gPSB3aXNwX3J1bnRpbWUuaXNSZVBhdHRlcm47XG52YXIgaW5jID0gd2lzcF9ydW50aW1lLmluYztcbnZhciBkZWMgPSB3aXNwX3J1bnRpbWUuZGVjO1xudmFyIHN0ciA9IHdpc3BfcnVudGltZS5zdHI7XG52YXIgY2hhciA9IHdpc3BfcnVudGltZS5jaGFyO1xudmFyIGludCA9IHdpc3BfcnVudGltZS5pbnQ7XG52YXIgaXNFcXVhbCA9IHdpc3BfcnVudGltZS5pc0VxdWFsO1xudmFyIGlzU3RyaWN0RXF1YWwgPSB3aXNwX3J1bnRpbWUuaXNTdHJpY3RFcXVhbDs7XG52YXIgd2lzcF9zdHJpbmcgPSByZXF1aXJlKFwiLi9zdHJpbmdcIik7XG52YXIgc3BsaXQgPSB3aXNwX3N0cmluZy5zcGxpdDtcbnZhciBqb2luID0gd2lzcF9zdHJpbmcuam9pbjtcbnZhciB1cHBlckNhc2UgPSB3aXNwX3N0cmluZy51cHBlckNhc2U7XG52YXIgcmVwbGFjZSA9IHdpc3Bfc3RyaW5nLnJlcGxhY2U7O1xudmFyIHdpc3BfYmFja2VuZF9qYXZhc2NyaXB0X3dyaXRlciA9IHJlcXVpcmUoXCIuL2JhY2tlbmQvamF2YXNjcmlwdC93cml0ZXJcIik7XG52YXIgd3JpdGVSZWZlcmVuY2UgPSB3aXNwX2JhY2tlbmRfamF2YXNjcmlwdF93cml0ZXIud3JpdGVSZWZlcmVuY2U7XG52YXIgd3JpdGVLZXl3b3JkUmVmZXJlbmNlID0gd2lzcF9iYWNrZW5kX2phdmFzY3JpcHRfd3JpdGVyLndyaXRlS2V5d29yZFJlZmVyZW5jZTtcbnZhciB3cml0ZUtleXdvcmQgPSB3aXNwX2JhY2tlbmRfamF2YXNjcmlwdF93cml0ZXIud3JpdGVLZXl3b3JkO1xudmFyIHdyaXRlU3ltYm9sID0gd2lzcF9iYWNrZW5kX2phdmFzY3JpcHRfd3JpdGVyLndyaXRlU3ltYm9sO1xudmFyIHdyaXRlTmlsID0gd2lzcF9iYWNrZW5kX2phdmFzY3JpcHRfd3JpdGVyLndyaXRlTmlsO1xudmFyIHdyaXRlQ29tbWVudCA9IHdpc3BfYmFja2VuZF9qYXZhc2NyaXB0X3dyaXRlci53cml0ZUNvbW1lbnQ7XG52YXIgd3JpdGVOdW1iZXIgPSB3aXNwX2JhY2tlbmRfamF2YXNjcmlwdF93cml0ZXIud3JpdGVOdW1iZXI7XG52YXIgd3JpdGVTdHJpbmcgPSB3aXNwX2JhY2tlbmRfamF2YXNjcmlwdF93cml0ZXIud3JpdGVTdHJpbmc7XG52YXIgd3JpdGVCb29sZWFuID0gd2lzcF9iYWNrZW5kX2phdmFzY3JpcHRfd3JpdGVyLndyaXRlQm9vbGVhbjs7O1xuXG52YXIgaXNTZWxmRXZhbHVhdGluZyA9IGZ1bmN0aW9uIGlzU2VsZkV2YWx1YXRpbmcoZm9ybSkge1xuICByZXR1cm4gKGlzTnVtYmVyKGZvcm0pKSB8fCAoKGlzU3RyaW5nKGZvcm0pKSAmJiAoIShpc1N5bWJvbChmb3JtKSkpICYmICghKGlzS2V5d29yZChmb3JtKSkpKSB8fCAoaXNCb29sZWFuKGZvcm0pKSB8fCAoaXNOaWwoZm9ybSkpIHx8IChpc1JlUGF0dGVybihmb3JtKSk7XG59O1xuZXhwb3J0cy5pc1NlbGZFdmFsdWF0aW5nID0gaXNTZWxmRXZhbHVhdGluZztcblxudmFyIF9fbWFjcm9zX18gPSB7fTtcbmV4cG9ydHMuX19tYWNyb3NfXyA9IF9fbWFjcm9zX187XG5cbnZhciBleGVjdXRlTWFjcm8gPSBmdW5jdGlvbiBleGVjdXRlTWFjcm8obmFtZSwgZm9ybSkge1xuICByZXR1cm4gKF9fbWFjcm9zX18gfHwgMClbbmFtZV0uYXBwbHkoKF9fbWFjcm9zX18gfHwgMClbbmFtZV0sIHZlYyhmb3JtKSk7XG59O1xuZXhwb3J0cy5leGVjdXRlTWFjcm8gPSBleGVjdXRlTWFjcm87XG5cbnZhciBpbnN0YWxsTWFjcm8gPSBmdW5jdGlvbiBpbnN0YWxsTWFjcm8obmFtZSwgbWFjcm9Gbikge1xuICByZXR1cm4gKF9fbWFjcm9zX18gfHwgMClbbmFtZV0gPSBtYWNyb0ZuO1xufTtcbmV4cG9ydHMuaW5zdGFsbE1hY3JvID0gaW5zdGFsbE1hY3JvO1xuXG52YXIgaXNNYWNybyA9IGZ1bmN0aW9uIGlzTWFjcm8obmFtZSkge1xuICByZXR1cm4gKGlzU3ltYm9sKG5hbWUpKSAmJiAoKF9fbWFjcm9zX18gfHwgMClbbmFtZV0pICYmIHRydWU7XG59O1xuZXhwb3J0cy5pc01hY3JvID0gaXNNYWNybztcblxudmFyIG1ha2VNYWNybyA9IGZ1bmN0aW9uIG1ha2VNYWNybyhwYXR0ZXJuLCBib2R5KSB7XG4gIHZhciBtYWNyb0ZuID0gY29uY2F0KGxpc3Qoc3ltYm9sKHZvaWQoMCksIFwiZm5cIiksIHBhdHRlcm4pLCBib2R5KTtcbiAgcmV0dXJuIGV2YWwoXCJcIiArIFwiKFwiICsgKGNvbXBpbGUobWFjcm9leHBhbmQobWFjcm9GbikpKSArIFwiKVwiKTtcbn07XG5leHBvcnRzLm1ha2VNYWNybyA9IG1ha2VNYWNybztcblxuaW5zdGFsbE1hY3JvKHN5bWJvbCh2b2lkKDApLCBcImRlZm1hY3JvXCIpLCBmdW5jdGlvbihuYW1lLCBzaWduYXR1cmUpIHtcbiAgdmFyIGJvZHkgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDIpO1xuICByZXR1cm4gaW5zdGFsbE1hY3JvKG5hbWUsIG1ha2VNYWNybyhzaWduYXR1cmUsIGJvZHkpKTtcbn0pO1xuXG52YXIgX19zcGVjaWFsc19fID0ge307XG5leHBvcnRzLl9fc3BlY2lhbHNfXyA9IF9fc3BlY2lhbHNfXztcblxudmFyIGluc3RhbGxTcGVjaWFsID0gZnVuY3Rpb24gaW5zdGFsbFNwZWNpYWwobmFtZSwgZiwgdmFsaWRhdG9yKSB7XG4gIHJldHVybiAoX19zcGVjaWFsc19fIHx8IDApW25hbWVdID0gZnVuY3Rpb24oZm9ybSkge1xuICAgIHZhbGlkYXRvciA/XG4gICAgICB2YWxpZGF0b3IoZm9ybSkgOlxuICAgICAgdm9pZCgwKTtcbiAgICByZXR1cm4gZih3aXRoTWV0YShyZXN0KGZvcm0pLCBtZXRhKGZvcm0pKSk7XG4gIH07XG59O1xuZXhwb3J0cy5pbnN0YWxsU3BlY2lhbCA9IGluc3RhbGxTcGVjaWFsO1xuXG52YXIgaXNTcGVjaWFsID0gZnVuY3Rpb24gaXNTcGVjaWFsKG5hbWUpIHtcbiAgcmV0dXJuIChpc1N5bWJvbChuYW1lKSkgJiYgKChfX3NwZWNpYWxzX18gfHwgMClbbmFtZV0pICYmIHRydWU7XG59O1xuZXhwb3J0cy5pc1NwZWNpYWwgPSBpc1NwZWNpYWw7XG5cbnZhciBleGVjdXRlU3BlY2lhbCA9IGZ1bmN0aW9uIGV4ZWN1dGVTcGVjaWFsKG5hbWUsIGZvcm0pIHtcbiAgcmV0dXJuICgoX19zcGVjaWFsc19fIHx8IDApW25hbWVdKShmb3JtKTtcbn07XG5leHBvcnRzLmV4ZWN1dGVTcGVjaWFsID0gZXhlY3V0ZVNwZWNpYWw7XG5cbnZhciBvcHQgPSBmdW5jdGlvbiBvcHQoYXJndW1lbnQsIGZhbGxiYWNrKSB7XG4gIHJldHVybiAoaXNOaWwoYXJndW1lbnQpKSB8fCAoaXNFbXB0eShhcmd1bWVudCkpID9cbiAgICBmYWxsYmFjayA6XG4gICAgZmlyc3QoYXJndW1lbnQpO1xufTtcbmV4cG9ydHMub3B0ID0gb3B0O1xuXG52YXIgYXBwbHlGb3JtID0gZnVuY3Rpb24gYXBwbHlGb3JtKGZuTmFtZSwgZm9ybSwgaXNRdW90ZWQpIHtcbiAgcmV0dXJuIGNvbnMoZm5OYW1lLCBpc1F1b3RlZCA/XG4gICAgbWFwKGZ1bmN0aW9uKGUpIHtcbiAgICAgIHJldHVybiBsaXN0KHN5bWJvbCh2b2lkKDApLCBcInF1b3RlXCIpLCBlKTtcbiAgICB9LCBmb3JtKSA6XG4gICAgZm9ybSwgZm9ybSk7XG59O1xuZXhwb3J0cy5hcHBseUZvcm0gPSBhcHBseUZvcm07XG5cbnZhciBhcHBseVVucXVvdGVkRm9ybSA9IGZ1bmN0aW9uIGFwcGx5VW5xdW90ZWRGb3JtKGZuTmFtZSwgZm9ybSkge1xuICByZXR1cm4gY29ucyhmbk5hbWUsIG1hcChmdW5jdGlvbihlKSB7XG4gICAgcmV0dXJuIGlzVW5xdW90ZShlKSA/XG4gICAgICBzZWNvbmQoZSkgOlxuICAgIChpc0xpc3QoZSkpICYmIChpc0tleXdvcmQoZmlyc3QoZSkpKSA/XG4gICAgICBsaXN0KHN5bWJvbCh2b2lkKDApLCBcInN5bnRheC1xdW90ZVwiKSwgc2Vjb25kKGUpKSA6XG4gICAgICBsaXN0KHN5bWJvbCh2b2lkKDApLCBcInN5bnRheC1xdW90ZVwiKSwgZSk7XG4gIH0sIGZvcm0pKTtcbn07XG5leHBvcnRzLmFwcGx5VW5xdW90ZWRGb3JtID0gYXBwbHlVbnF1b3RlZEZvcm07XG5cbnZhciBzcGxpdFNwbGljZXMgPSBmdW5jdGlvbiBzcGxpdFNwbGljZXMoZm9ybSwgZm5OYW1lKSB7XG4gIHZhciBtYWtlU3BsaWNlID0gZnVuY3Rpb24gbWFrZVNwbGljZShmb3JtKSB7XG4gICAgcmV0dXJuIChpc1NlbGZFdmFsdWF0aW5nKGZvcm0pKSB8fCAoaXNTeW1ib2woZm9ybSkpID9cbiAgICAgIGFwcGx5VW5xdW90ZWRGb3JtKGZuTmFtZSwgbGlzdChmb3JtKSkgOlxuICAgICAgYXBwbHlVbnF1b3RlZEZvcm0oZm5OYW1lLCBmb3JtKTtcbiAgfTtcbiAgcmV0dXJuIChmdW5jdGlvbiBsb29wKG5vZGVzLCBzbGljZXMsIGFjYykge1xuICAgIHZhciByZWN1ciA9IGxvb3A7XG4gICAgd2hpbGUgKHJlY3VyID09PSBsb29wKSB7XG4gICAgICByZWN1ciA9IGlzRW1wdHkobm9kZXMpID9cbiAgICAgIHJldmVyc2UoaXNFbXB0eShhY2MpID9cbiAgICAgICAgc2xpY2VzIDpcbiAgICAgICAgY29ucyhtYWtlU3BsaWNlKHJldmVyc2UoYWNjKSksIHNsaWNlcykpIDpcbiAgICAgIChmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIG5vZGUgPSBmaXJzdChub2Rlcyk7XG4gICAgICAgIHJldHVybiBpc1VucXVvdGVTcGxpY2luZyhub2RlKSA/XG4gICAgICAgICAgKG5vZGVzID0gcmVzdChub2RlcyksIHNsaWNlcyA9IGNvbnMoc2Vjb25kKG5vZGUpLCBpc0VtcHR5KGFjYykgP1xuICAgICAgICAgICAgc2xpY2VzIDpcbiAgICAgICAgICAgIGNvbnMobWFrZVNwbGljZShyZXZlcnNlKGFjYykpLCBzbGljZXMpKSwgYWNjID0gbGlzdCgpLCBsb29wKSA6XG4gICAgICAgICAgKG5vZGVzID0gcmVzdChub2RlcyksIHNsaWNlcyA9IHNsaWNlcywgYWNjID0gY29ucyhub2RlLCBhY2MpLCBsb29wKTtcbiAgICAgIH0pKCk7XG4gICAgfTtcbiAgICByZXR1cm4gcmVjdXI7XG4gIH0pKGZvcm0sIGxpc3QoKSwgbGlzdCgpKTtcbn07XG5leHBvcnRzLnNwbGl0U3BsaWNlcyA9IHNwbGl0U3BsaWNlcztcblxudmFyIHN5bnRheFF1b3RlU3BsaXQgPSBmdW5jdGlvbiBzeW50YXhRdW90ZVNwbGl0KGFwcGVuZE5hbWUsIGZuTmFtZSwgZm9ybSkge1xuICB2YXIgc2xpY2VzID0gc3BsaXRTcGxpY2VzKGZvcm0sIGZuTmFtZSk7XG4gIHZhciBuID0gY291bnQoc2xpY2VzKTtcbiAgcmV0dXJuIG4gPT09IDAgP1xuICAgIGxpc3QoZm5OYW1lKSA6XG4gIG4gPT09IDEgP1xuICAgIGZpcnN0KHNsaWNlcykgOlxuICBcImRlZmF1bHRcIiA/XG4gICAgYXBwbHlGb3JtKGFwcGVuZE5hbWUsIHNsaWNlcykgOlxuICAgIHZvaWQoMCk7XG59O1xuZXhwb3J0cy5zeW50YXhRdW90ZVNwbGl0ID0gc3ludGF4UXVvdGVTcGxpdDtcblxudmFyIGNvbXBpbGVPYmplY3QgPSBmdW5jdGlvbiBjb21waWxlT2JqZWN0KGZvcm0sIGlzUXVvdGVkKSB7XG4gIHJldHVybiBpc0tleXdvcmQoZm9ybSkgP1xuICAgIHdyaXRlS2V5d29yZChmb3JtKSA6XG4gIGlzU3ltYm9sKGZvcm0pID9cbiAgICB3cml0ZVN5bWJvbChmb3JtKSA6XG4gIGlzTnVtYmVyKGZvcm0pID9cbiAgICB3cml0ZU51bWJlcihmb3JtKSA6XG4gIGlzU3RyaW5nKGZvcm0pID9cbiAgICB3cml0ZVN0cmluZyhmb3JtKSA6XG4gIGlzQm9vbGVhbihmb3JtKSA/XG4gICAgd3JpdGVCb29sZWFuKGZvcm0pIDpcbiAgaXNOaWwoZm9ybSkgP1xuICAgIHdyaXRlTmlsKGZvcm0pIDpcbiAgaXNSZVBhdHRlcm4oZm9ybSkgP1xuICAgIGNvbXBpbGVSZVBhdHRlcm4oZm9ybSkgOlxuICBpc1ZlY3Rvcihmb3JtKSA/XG4gICAgY29tcGlsZShhcHBseUZvcm0oc3ltYm9sKHZvaWQoMCksIFwidmVjdG9yXCIpLCBsaXN0LmFwcGx5KGxpc3QsIGZvcm0pLCBpc1F1b3RlZCkpIDpcbiAgaXNMaXN0KGZvcm0pID9cbiAgICBjb21waWxlKGFwcGx5Rm9ybShzeW1ib2wodm9pZCgwKSwgXCJsaXN0XCIpLCBmb3JtLCBpc1F1b3RlZCkpIDpcbiAgaXNEaWN0aW9uYXJ5KGZvcm0pID9cbiAgICBjb21waWxlRGljdGlvbmFyeShpc1F1b3RlZCA/XG4gICAgICBtYXBEaWN0aW9uYXJ5KGZvcm0sIGZ1bmN0aW9uKHgpIHtcbiAgICAgICAgcmV0dXJuIGxpc3Qoc3ltYm9sKHZvaWQoMCksIFwicXVvdGVcIiksIHgpO1xuICAgICAgfSkgOlxuICAgICAgZm9ybSkgOlxuICAgIHZvaWQoMCk7XG59O1xuZXhwb3J0cy5jb21waWxlT2JqZWN0ID0gY29tcGlsZU9iamVjdDtcblxudmFyIGNvbXBpbGVTeW50YXhRdW90ZWRWZWN0b3IgPSBmdW5jdGlvbiBjb21waWxlU3ludGF4UXVvdGVkVmVjdG9yKGZvcm0pIHtcbiAgdmFyIGNvbmNhdEZvcm0gPSBzeW50YXhRdW90ZVNwbGl0KHN5bWJvbCh2b2lkKDApLCBcImNvbmNhdFwiKSwgc3ltYm9sKHZvaWQoMCksIFwidmVjdG9yXCIpLCBsaXN0LmFwcGx5KGxpc3QsIGZvcm0pKTtcbiAgcmV0dXJuIGNvbXBpbGUoY291bnQoY29uY2F0Rm9ybSkgPiAxID9cbiAgICBsaXN0KHN5bWJvbCh2b2lkKDApLCBcInZlY1wiKSwgY29uY2F0Rm9ybSkgOlxuICAgIGNvbmNhdEZvcm0pO1xufTtcbmV4cG9ydHMuY29tcGlsZVN5bnRheFF1b3RlZFZlY3RvciA9IGNvbXBpbGVTeW50YXhRdW90ZWRWZWN0b3I7XG5cbnZhciBjb21waWxlU3ludGF4UXVvdGVkID0gZnVuY3Rpb24gY29tcGlsZVN5bnRheFF1b3RlZChmb3JtKSB7XG4gIHJldHVybiBpc0xpc3QoZm9ybSkgP1xuICAgIGNvbXBpbGUoc3ludGF4UXVvdGVTcGxpdChzeW1ib2wodm9pZCgwKSwgXCJjb25jYXRcIiksIHN5bWJvbCh2b2lkKDApLCBcImxpc3RcIiksIGZvcm0pKSA6XG4gIGlzVmVjdG9yKGZvcm0pID9cbiAgICBjb21waWxlU3ludGF4UXVvdGVkVmVjdG9yKGZvcm0pIDpcbiAgXCJlbHNlXCIgP1xuICAgIGNvbXBpbGVPYmplY3QoZm9ybSkgOlxuICAgIHZvaWQoMCk7XG59O1xuZXhwb3J0cy5jb21waWxlU3ludGF4UXVvdGVkID0gY29tcGlsZVN5bnRheFF1b3RlZDtcblxudmFyIGNvbXBpbGUgPSBmdW5jdGlvbiBjb21waWxlKGZvcm0pIHtcbiAgcmV0dXJuIGlzU2VsZkV2YWx1YXRpbmcoZm9ybSkgP1xuICAgIGNvbXBpbGVPYmplY3QoZm9ybSkgOlxuICBpc1N5bWJvbChmb3JtKSA/XG4gICAgd3JpdGVSZWZlcmVuY2UoZm9ybSkgOlxuICBpc0tleXdvcmQoZm9ybSkgP1xuICAgIHdyaXRlS2V5d29yZFJlZmVyZW5jZShmb3JtKSA6XG4gIGlzVmVjdG9yKGZvcm0pID9cbiAgICBjb21waWxlT2JqZWN0KGZvcm0pIDpcbiAgaXNEaWN0aW9uYXJ5KGZvcm0pID9cbiAgICBjb21waWxlT2JqZWN0KGZvcm0pIDpcbiAgaXNMaXN0KGZvcm0pID9cbiAgICAoZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgaGVhZCA9IGZpcnN0KGZvcm0pO1xuICAgICAgcmV0dXJuIGlzRW1wdHkoZm9ybSkgP1xuICAgICAgICBjb21waWxlT2JqZWN0KGZvcm0sIHRydWUpIDpcbiAgICAgIGlzUXVvdGUoZm9ybSkgP1xuICAgICAgICBjb21waWxlT2JqZWN0KHNlY29uZChmb3JtKSwgdHJ1ZSkgOlxuICAgICAgaXNTeW50YXhRdW90ZShmb3JtKSA/XG4gICAgICAgIGNvbXBpbGVTeW50YXhRdW90ZWQoc2Vjb25kKGZvcm0pKSA6XG4gICAgICBpc1NwZWNpYWwoaGVhZCkgP1xuICAgICAgICBleGVjdXRlU3BlY2lhbChoZWFkLCBmb3JtKSA6XG4gICAgICBpc0tleXdvcmQoaGVhZCkgP1xuICAgICAgICBjb21waWxlKGxpc3Qoc3ltYm9sKHZvaWQoMCksIFwiZ2V0XCIpLCBzZWNvbmQoZm9ybSksIGhlYWQpKSA6XG4gICAgICBcImVsc2VcIiA/XG4gICAgICAgIChmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gISgoaXNTeW1ib2woaGVhZCkpIHx8IChpc0xpc3QoaGVhZCkpKSA/XG4gICAgICAgICAgICAoZnVuY3Rpb24oKSB7IHRocm93IGNvbXBpbGVyRXJyb3IoZm9ybSwgXCJcIiArIFwib3BlcmF0b3IgaXMgbm90IGEgcHJvY2VkdXJlOiBcIiArIGhlYWQpOyB9KSgpIDpcbiAgICAgICAgICAgIGNvbXBpbGVJbnZva2UoZm9ybSk7XG4gICAgICAgIH0pKCkgOlxuICAgICAgICB2b2lkKDApO1xuICAgIH0pKCkgOlxuICAgIHZvaWQoMCk7XG59O1xuZXhwb3J0cy5jb21waWxlID0gY29tcGlsZTtcblxudmFyIGNvbXBpbGVfID0gZnVuY3Rpb24gY29tcGlsZV8oZm9ybXMpIHtcbiAgcmV0dXJuIHJlZHVjZShmdW5jdGlvbihyZXN1bHQsIGZvcm0pIHtcbiAgICByZXR1cm4gXCJcIiArIHJlc3VsdCArIChpc0VtcHR5KHJlc3VsdCkgP1xuICAgICAgXCJcIiA6XG4gICAgICBcIjtcXG5cXG5cIikgKyAoY29tcGlsZShpc0xpc3QoZm9ybSkgP1xuICAgICAgd2l0aE1ldGEobWFjcm9leHBhbmQoZm9ybSksIGNvbmooe1xuICAgICAgICBcInRvcFwiOiB0cnVlXG4gICAgICB9LCBtZXRhKGZvcm0pKSkgOlxuICAgICAgZm9ybSkpO1xuICB9LCBcIlwiLCBmb3Jtcyk7XG59O1xuZXhwb3J0cy5jb21waWxlXyA9IGNvbXBpbGVfO1xuXG52YXIgY29tcGlsZVByb2dyYW0gPSBmdW5jdGlvbiBjb21waWxlUHJvZ3JhbShmb3Jtcykge1xuICByZXR1cm4gcmVkdWNlKGZ1bmN0aW9uKHJlc3VsdCwgZm9ybSkge1xuICAgIHJldHVybiBcIlwiICsgcmVzdWx0ICsgKGlzRW1wdHkocmVzdWx0KSA/XG4gICAgICBcIlwiIDpcbiAgICAgIFwiO1xcblxcblwiKSArIChjb21waWxlKGlzTGlzdChmb3JtKSA/XG4gICAgICB3aXRoTWV0YShtYWNyb2V4cGFuZChmb3JtKSwgY29uaih7XG4gICAgICAgIFwidG9wXCI6IHRydWVcbiAgICAgIH0sIG1ldGEoZm9ybSkpKSA6XG4gICAgICBmb3JtKSk7XG4gIH0sIFwiXCIsIGZvcm1zKTtcbn07XG5leHBvcnRzLmNvbXBpbGVQcm9ncmFtID0gY29tcGlsZVByb2dyYW07XG5cbnZhciBtYWNyb2V4cGFuZDEgPSBmdW5jdGlvbiBtYWNyb2V4cGFuZDEoZm9ybSkge1xuICByZXR1cm4gaXNMaXN0KGZvcm0pID9cbiAgICAoZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgb3AgPSBmaXJzdChmb3JtKTtcbiAgICAgIHZhciBpZCA9IGlzU3ltYm9sKG9wKSA/XG4gICAgICAgIG5hbWUob3ApIDpcbiAgICAgICAgdm9pZCgwKTtcbiAgICAgIHJldHVybiBpc1NwZWNpYWwob3ApID9cbiAgICAgICAgZm9ybSA6XG4gICAgICBpc01hY3JvKG9wKSA/XG4gICAgICAgIGV4ZWN1dGVNYWNybyhvcCwgcmVzdChmb3JtKSkgOlxuICAgICAgKGlzU3ltYm9sKG9wKSkgJiYgKCEoaWQgPT09IFwiLlwiKSkgP1xuICAgICAgICBmaXJzdChpZCkgPT09IFwiLlwiID9cbiAgICAgICAgICBjb3VudChmb3JtKSA8IDIgP1xuICAgICAgICAgICAgKGZ1bmN0aW9uKCkgeyB0aHJvdyBFcnJvcihcIk1hbGZvcm1lZCBtZW1iZXIgZXhwcmVzc2lvbiwgZXhwZWN0aW5nICgubWVtYmVyIHRhcmdldCAuLi4pXCIpOyB9KSgpIDpcbiAgICAgICAgICAgIGNvbnMoc3ltYm9sKHZvaWQoMCksIFwiLlwiKSwgY29ucyhzZWNvbmQoZm9ybSksIGNvbnMoc3ltYm9sKHN1YnMoaWQsIDEpKSwgcmVzdChyZXN0KGZvcm0pKSkpKSA6XG4gICAgICAgIGxhc3QoaWQpID09PSBcIi5cIiA/XG4gICAgICAgICAgY29ucyhzeW1ib2wodm9pZCgwKSwgXCJuZXdcIiksIGNvbnMoc3ltYm9sKHN1YnMoaWQsIDAsIGRlYyhjb3VudChpZCkpKSksIHJlc3QoZm9ybSkpKSA6XG4gICAgICAgICAgZm9ybSA6XG4gICAgICBcImVsc2VcIiA/XG4gICAgICAgIGZvcm0gOlxuICAgICAgICB2b2lkKDApO1xuICAgIH0pKCkgOlxuICAgIGZvcm07XG59O1xuZXhwb3J0cy5tYWNyb2V4cGFuZDEgPSBtYWNyb2V4cGFuZDE7XG5cbnZhciBtYWNyb2V4cGFuZCA9IGZ1bmN0aW9uIG1hY3JvZXhwYW5kKGZvcm0pIHtcbiAgcmV0dXJuIChmdW5jdGlvbiBsb29wKG9yaWdpbmFsLCBleHBhbmRlZCkge1xuICAgIHZhciByZWN1ciA9IGxvb3A7XG4gICAgd2hpbGUgKHJlY3VyID09PSBsb29wKSB7XG4gICAgICByZWN1ciA9IG9yaWdpbmFsID09PSBleHBhbmRlZCA/XG4gICAgICBvcmlnaW5hbCA6XG4gICAgICAob3JpZ2luYWwgPSBleHBhbmRlZCwgZXhwYW5kZWQgPSBtYWNyb2V4cGFuZDEoZXhwYW5kZWQpLCBsb29wKTtcbiAgICB9O1xuICAgIHJldHVybiByZWN1cjtcbiAgfSkoZm9ybSwgbWFjcm9leHBhbmQxKGZvcm0pKTtcbn07XG5leHBvcnRzLm1hY3JvZXhwYW5kID0gbWFjcm9leHBhbmQ7XG5cbnZhciBfbGluZUJyZWFrUGF0dGVybl8gPSAvXFxuKD89W15cXG5dKS9tO1xuZXhwb3J0cy5fbGluZUJyZWFrUGF0dGVybl8gPSBfbGluZUJyZWFrUGF0dGVybl87XG5cbnZhciBpbmRlbnQgPSBmdW5jdGlvbiBpbmRlbnQoY29kZSwgaW5kZW50YXRpb24pIHtcbiAgcmV0dXJuIGpvaW4oaW5kZW50YXRpb24sIHNwbGl0KGNvZGUsIF9saW5lQnJlYWtQYXR0ZXJuXykpO1xufTtcbmV4cG9ydHMuaW5kZW50ID0gaW5kZW50O1xuXG52YXIgY29tcGlsZVRlbXBsYXRlID0gZnVuY3Rpb24gY29tcGlsZVRlbXBsYXRlKGZvcm0pIHtcbiAgdmFyIGluZGVudFBhdHRlcm4gPSAvXFxuICokLztcbiAgdmFyIGdldEluZGVudGF0aW9uID0gZnVuY3Rpb24oY29kZSkge1xuICAgIHJldHVybiAocmVGaW5kKGluZGVudFBhdHRlcm4sIGNvZGUpKSB8fCBcIlxcblwiO1xuICB9O1xuICByZXR1cm4gKGZ1bmN0aW9uIGxvb3AoY29kZSwgcGFydHMsIHZhbHVlcykge1xuICAgIHZhciByZWN1ciA9IGxvb3A7XG4gICAgd2hpbGUgKHJlY3VyID09PSBsb29wKSB7XG4gICAgICByZWN1ciA9IGNvdW50KHBhcnRzKSA+IDEgP1xuICAgICAgKGNvZGUgPSBcIlwiICsgY29kZSArIChmaXJzdChwYXJ0cykpICsgKGluZGVudChcIlwiICsgKGZpcnN0KHZhbHVlcykpLCBnZXRJbmRlbnRhdGlvbihmaXJzdChwYXJ0cykpKSksIHBhcnRzID0gcmVzdChwYXJ0cyksIHZhbHVlcyA9IHJlc3QodmFsdWVzKSwgbG9vcCkgOlxuICAgICAgXCJcIiArIGNvZGUgKyAoZmlyc3QocGFydHMpKTtcbiAgICB9O1xuICAgIHJldHVybiByZWN1cjtcbiAgfSkoXCJcIiwgc3BsaXQoZmlyc3QoZm9ybSksIFwifnt9XCIpLCByZXN0KGZvcm0pKTtcbn07XG5leHBvcnRzLmNvbXBpbGVUZW1wbGF0ZSA9IGNvbXBpbGVUZW1wbGF0ZTtcblxudmFyIGNvbXBpbGVEZWYgPSBmdW5jdGlvbiBjb21waWxlRGVmKGZvcm0pIHtcbiAgdmFyIGlkID0gZmlyc3QoZm9ybSk7XG4gIHZhciBpc0V4cG9ydCA9ICgoKChtZXRhKGZvcm0pKSB8fCB7fSkgfHwgMClbXCJ0b3BcIl0pICYmICghKCgoKG1ldGEoaWQpKSB8fCB7fSkgfHwgMClbXCJwcml2YXRlXCJdKSk7XG4gIHZhciBhdHRyaWJ1dGUgPSBzeW1ib2wobmFtZXNwYWNlKGlkKSwgXCJcIiArIFwiLVwiICsgKG5hbWUoaWQpKSk7XG4gIHJldHVybiBpc0V4cG9ydCA/XG4gICAgY29tcGlsZVRlbXBsYXRlKGxpc3QoXCJ2YXIgfnt9O1xcbn57fVwiLCBjb21waWxlKGNvbnMoc3ltYm9sKHZvaWQoMCksIFwic2V0IVwiKSwgZm9ybSkpLCBjb21waWxlKGxpc3Qoc3ltYm9sKHZvaWQoMCksIFwic2V0IVwiKSwgbGlzdChzeW1ib2wodm9pZCgwKSwgXCIuXCIpLCBzeW1ib2wodm9pZCgwKSwgXCJleHBvcnRzXCIpLCBhdHRyaWJ1dGUpLCBpZCkpKSkgOlxuICAgIGNvbXBpbGVUZW1wbGF0ZShsaXN0KFwidmFyIH57fVwiLCBjb21waWxlKGNvbnMoc3ltYm9sKHZvaWQoMCksIFwic2V0IVwiKSwgZm9ybSkpKSk7XG59O1xuZXhwb3J0cy5jb21waWxlRGVmID0gY29tcGlsZURlZjtcblxudmFyIGNvbXBpbGVJZkVsc2UgPSBmdW5jdGlvbiBjb21waWxlSWZFbHNlKGZvcm0pIHtcbiAgdmFyIGNvbmRpdGlvbiA9IG1hY3JvZXhwYW5kKGZpcnN0KGZvcm0pKTtcbiAgdmFyIHRoZW5FeHByZXNzaW9uID0gbWFjcm9leHBhbmQoc2Vjb25kKGZvcm0pKTtcbiAgdmFyIGVsc2VFeHByZXNzaW9uID0gbWFjcm9leHBhbmQodGhpcmQoZm9ybSkpO1xuICByZXR1cm4gY29tcGlsZVRlbXBsYXRlKGxpc3QoKGlzTGlzdChlbHNlRXhwcmVzc2lvbikpICYmIChpc0VxdWFsKGZpcnN0KGVsc2VFeHByZXNzaW9uKSwgc3ltYm9sKHZvaWQoMCksIFwiaWZcIikpKSA/XG4gICAgXCJ+e30gP1xcbiAgfnt9IDpcXG5+e31cIiA6XG4gICAgXCJ+e30gP1xcbiAgfnt9IDpcXG4gIH57fVwiLCBjb21waWxlKGNvbmRpdGlvbiksIGNvbXBpbGUodGhlbkV4cHJlc3Npb24pLCBjb21waWxlKGVsc2VFeHByZXNzaW9uKSkpO1xufTtcbmV4cG9ydHMuY29tcGlsZUlmRWxzZSA9IGNvbXBpbGVJZkVsc2U7XG5cbnZhciBjb21waWxlRGljdGlvbmFyeSA9IGZ1bmN0aW9uIGNvbXBpbGVEaWN0aW9uYXJ5KGZvcm0pIHtcbiAgdmFyIGJvZHkgPSAoZnVuY3Rpb24gbG9vcChib2R5LCBuYW1lcykge1xuICAgIHZhciByZWN1ciA9IGxvb3A7XG4gICAgd2hpbGUgKHJlY3VyID09PSBsb29wKSB7XG4gICAgICByZWN1ciA9IGlzRW1wdHkobmFtZXMpID9cbiAgICAgIGJvZHkgOlxuICAgICAgKGJvZHkgPSBcIlwiICsgKGlzTmlsKGJvZHkpID9cbiAgICAgICAgXCJcIiA6XG4gICAgICAgIFwiXCIgKyBib2R5ICsgXCIsXFxuXCIpICsgKGNvbXBpbGVUZW1wbGF0ZShsaXN0KFwifnt9OiB+e31cIiwgY29tcGlsZShmaXJzdChuYW1lcykpLCBjb21waWxlKG1hY3JvZXhwYW5kKChmb3JtIHx8IDApW2ZpcnN0KG5hbWVzKV0pKSkpKSwgbmFtZXMgPSByZXN0KG5hbWVzKSwgbG9vcCk7XG4gICAgfTtcbiAgICByZXR1cm4gcmVjdXI7XG4gIH0pKHZvaWQoMCksIGtleXMoZm9ybSkpO1xuICByZXR1cm4gaXNOaWwoYm9keSkgP1xuICAgIFwie31cIiA6XG4gICAgY29tcGlsZVRlbXBsYXRlKGxpc3QoXCJ7XFxuICB+e31cXG59XCIsIGJvZHkpKTtcbn07XG5leHBvcnRzLmNvbXBpbGVEaWN0aW9uYXJ5ID0gY29tcGlsZURpY3Rpb25hcnk7XG5cbnZhciBkZXN1Z2FyRm5OYW1lID0gZnVuY3Rpb24gZGVzdWdhckZuTmFtZShmb3JtKSB7XG4gIHJldHVybiAoaXNTeW1ib2woZmlyc3QoZm9ybSkpKSB8fCAoaXNOaWwoZmlyc3QoZm9ybSkpKSA/XG4gICAgZm9ybSA6XG4gICAgY29ucyh2b2lkKDApLCBmb3JtKTtcbn07XG5leHBvcnRzLmRlc3VnYXJGbk5hbWUgPSBkZXN1Z2FyRm5OYW1lO1xuXG52YXIgZGVzdWdhckZuRG9jID0gZnVuY3Rpb24gZGVzdWdhckZuRG9jKGZvcm0pIHtcbiAgcmV0dXJuIChpc1N0cmluZyhzZWNvbmQoZm9ybSkpKSB8fCAoaXNOaWwoc2Vjb25kKGZvcm0pKSkgP1xuICAgIGZvcm0gOlxuICAgIGNvbnMoZmlyc3QoZm9ybSksIGNvbnModm9pZCgwKSwgcmVzdChmb3JtKSkpO1xufTtcbmV4cG9ydHMuZGVzdWdhckZuRG9jID0gZGVzdWdhckZuRG9jO1xuXG52YXIgZGVzdWdhckZuQXR0cnMgPSBmdW5jdGlvbiBkZXN1Z2FyRm5BdHRycyhmb3JtKSB7XG4gIHJldHVybiAoaXNEaWN0aW9uYXJ5KHRoaXJkKGZvcm0pKSkgfHwgKGlzTmlsKHRoaXJkKGZvcm0pKSkgP1xuICAgIGZvcm0gOlxuICAgIGNvbnMoZmlyc3QoZm9ybSksIGNvbnMoc2Vjb25kKGZvcm0pLCBjb25zKHZvaWQoMCksIHJlc3QocmVzdChmb3JtKSkpKSk7XG59O1xuZXhwb3J0cy5kZXN1Z2FyRm5BdHRycyA9IGRlc3VnYXJGbkF0dHJzO1xuXG52YXIgY29tcGlsZURlc3VnYXJlZEZuID0gZnVuY3Rpb24gY29tcGlsZURlc3VnYXJlZEZuKG5hbWUsIGRvYywgYXR0cnMsIHBhcmFtcywgYm9keSkge1xuICByZXR1cm4gY29tcGlsZVRlbXBsYXRlKGlzTmlsKG5hbWUpID9cbiAgICBsaXN0KFwiZnVuY3Rpb24ofnt9KSB7XFxuICB+e31cXG59XCIsIGpvaW4oXCIsIFwiLCBtYXAoY29tcGlsZSwgKHBhcmFtcyB8fCAwKVtcIm5hbWVzXCJdKSksIGNvbXBpbGVGbkJvZHkobWFwKG1hY3JvZXhwYW5kLCBib2R5KSwgcGFyYW1zKSkgOlxuICAgIGxpc3QoXCJmdW5jdGlvbiB+e30ofnt9KSB7XFxuICB+e31cXG59XCIsIGNvbXBpbGUobmFtZSksIGpvaW4oXCIsIFwiLCBtYXAoY29tcGlsZSwgKHBhcmFtcyB8fCAwKVtcIm5hbWVzXCJdKSksIGNvbXBpbGVGbkJvZHkobWFwKG1hY3JvZXhwYW5kLCBib2R5KSwgcGFyYW1zKSkpO1xufTtcbmV4cG9ydHMuY29tcGlsZURlc3VnYXJlZEZuID0gY29tcGlsZURlc3VnYXJlZEZuO1xuXG52YXIgY29tcGlsZVN0YXRlbWVudHMgPSBmdW5jdGlvbiBjb21waWxlU3RhdGVtZW50cyhmb3JtLCBwcmVmaXgpIHtcbiAgcmV0dXJuIChmdW5jdGlvbiBsb29wKHJlc3VsdCwgZXhwcmVzc2lvbiwgZXhwcmVzc2lvbnMpIHtcbiAgICB2YXIgcmVjdXIgPSBsb29wO1xuICAgIHdoaWxlIChyZWN1ciA9PT0gbG9vcCkge1xuICAgICAgcmVjdXIgPSBpc0VtcHR5KGV4cHJlc3Npb25zKSA/XG4gICAgICBcIlwiICsgcmVzdWx0ICsgKGlzTmlsKHByZWZpeCkgP1xuICAgICAgICBcIlwiIDpcbiAgICAgICAgcHJlZml4KSArIChjb21waWxlKG1hY3JvZXhwYW5kKGV4cHJlc3Npb24pKSkgKyBcIjtcIiA6XG4gICAgICAocmVzdWx0ID0gXCJcIiArIHJlc3VsdCArIChjb21waWxlKG1hY3JvZXhwYW5kKGV4cHJlc3Npb24pKSkgKyBcIjtcXG5cIiwgZXhwcmVzc2lvbiA9IGZpcnN0KGV4cHJlc3Npb25zKSwgZXhwcmVzc2lvbnMgPSByZXN0KGV4cHJlc3Npb25zKSwgbG9vcCk7XG4gICAgfTtcbiAgICByZXR1cm4gcmVjdXI7XG4gIH0pKFwiXCIsIGZpcnN0KGZvcm0pLCByZXN0KGZvcm0pKTtcbn07XG5leHBvcnRzLmNvbXBpbGVTdGF0ZW1lbnRzID0gY29tcGlsZVN0YXRlbWVudHM7XG5cbnZhciBjb21waWxlRm5Cb2R5ID0gZnVuY3Rpb24gY29tcGlsZUZuQm9keShmb3JtLCBwYXJhbXMpIHtcbiAgcmV0dXJuIChpc0RpY3Rpb25hcnkocGFyYW1zKSkgJiYgKChwYXJhbXMgfHwgMClbXCJyZXN0XCJdKSA/XG4gICAgY29tcGlsZVN0YXRlbWVudHMoY29ucyhsaXN0KHN5bWJvbCh2b2lkKDApLCBcImRlZlwiKSwgKHBhcmFtcyB8fCAwKVtcInJlc3RcIl0sIGxpc3Qoc3ltYm9sKHZvaWQoMCksIFwiQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGxcIiksIHN5bWJvbCh2b2lkKDApLCBcImFyZ3VtZW50c1wiKSwgKHBhcmFtcyB8fCAwKVtcImFyaXR5XCJdKSksIGZvcm0pLCBcInJldHVybiBcIikgOlxuICAoY291bnQoZm9ybSkgPT09IDEpICYmIChpc0xpc3QoZmlyc3QoZm9ybSkpKSAmJiAoaXNFcXVhbChmaXJzdChmaXJzdChmb3JtKSksIHN5bWJvbCh2b2lkKDApLCBcImRvXCIpKSkgP1xuICAgIGNvbXBpbGVGbkJvZHkocmVzdChmaXJzdChmb3JtKSksIHBhcmFtcykgOlxuICAgIGNvbXBpbGVTdGF0ZW1lbnRzKGZvcm0sIFwicmV0dXJuIFwiKTtcbn07XG5leHBvcnRzLmNvbXBpbGVGbkJvZHkgPSBjb21waWxlRm5Cb2R5O1xuXG52YXIgZGVzdWdhclBhcmFtcyA9IGZ1bmN0aW9uIGRlc3VnYXJQYXJhbXMocGFyYW1zKSB7XG4gIHJldHVybiAoZnVuY3Rpb24gbG9vcChuYW1lcywgcGFyYW1zKSB7XG4gICAgdmFyIHJlY3VyID0gbG9vcDtcbiAgICB3aGlsZSAocmVjdXIgPT09IGxvb3ApIHtcbiAgICAgIHJlY3VyID0gaXNFbXB0eShwYXJhbXMpID9cbiAgICAgIHtcbiAgICAgICAgXCJuYW1lc1wiOiBuYW1lcyxcbiAgICAgICAgXCJhcml0eVwiOiBjb3VudChuYW1lcyksXG4gICAgICAgIFwicmVzdFwiOiB2b2lkKDApXG4gICAgICB9IDpcbiAgICBpc0VxdWFsKGZpcnN0KHBhcmFtcyksIHN5bWJvbCh2b2lkKDApLCBcIiZcIikpID9cbiAgICAgIGlzRXF1YWwoY291bnQocGFyYW1zKSwgMSkgP1xuICAgICAgICB7XG4gICAgICAgICAgXCJuYW1lc1wiOiBuYW1lcyxcbiAgICAgICAgICBcImFyaXR5XCI6IGNvdW50KG5hbWVzKSxcbiAgICAgICAgICBcInJlc3RcIjogdm9pZCgwKVxuICAgICAgICB9IDpcbiAgICAgIGlzRXF1YWwoY291bnQocGFyYW1zKSwgMikgP1xuICAgICAgICB7XG4gICAgICAgICAgXCJuYW1lc1wiOiBuYW1lcyxcbiAgICAgICAgICBcImFyaXR5XCI6IGNvdW50KG5hbWVzKSxcbiAgICAgICAgICBcInJlc3RcIjogc2Vjb25kKHBhcmFtcylcbiAgICAgICAgfSA6XG4gICAgICBcImVsc2VcIiA/XG4gICAgICAgIChmdW5jdGlvbigpIHsgdGhyb3cgVHlwZUVycm9yKFwiVW5leHBlY3RlZCBudW1iZXIgb2YgcGFyYW1ldGVycyBhZnRlciAmXCIpOyB9KSgpIDpcbiAgICAgICAgdm9pZCgwKSA6XG4gICAgXCJlbHNlXCIgP1xuICAgICAgKG5hbWVzID0gY29uaihuYW1lcywgZmlyc3QocGFyYW1zKSksIHBhcmFtcyA9IHJlc3QocGFyYW1zKSwgbG9vcCkgOlxuICAgICAgdm9pZCgwKTtcbiAgICB9O1xuICAgIHJldHVybiByZWN1cjtcbiAgfSkoW10sIHBhcmFtcyk7XG59O1xuZXhwb3J0cy5kZXN1Z2FyUGFyYW1zID0gZGVzdWdhclBhcmFtcztcblxudmFyIGFuYWx5emVPdmVybG9hZGVkRm4gPSBmdW5jdGlvbiBhbmFseXplT3ZlcmxvYWRlZEZuKG5hbWUsIGRvYywgYXR0cnMsIG92ZXJsb2Fkcykge1xuICByZXR1cm4gbWFwKGZ1bmN0aW9uKG92ZXJsb2FkKSB7XG4gICAgdmFyIHBhcmFtcyA9IGRlc3VnYXJQYXJhbXMoZmlyc3Qob3ZlcmxvYWQpKTtcbiAgICByZXR1cm4ge1xuICAgICAgXCJyZXN0XCI6IChwYXJhbXMgfHwgMClbXCJyZXN0XCJdLFxuICAgICAgXCJuYW1lc1wiOiAocGFyYW1zIHx8IDApW1wibmFtZXNcIl0sXG4gICAgICBcImFyaXR5XCI6IChwYXJhbXMgfHwgMClbXCJhcml0eVwiXSxcbiAgICAgIFwiYm9keVwiOiByZXN0KG92ZXJsb2FkKVxuICAgIH07XG4gIH0sIG92ZXJsb2Fkcyk7XG59O1xuZXhwb3J0cy5hbmFseXplT3ZlcmxvYWRlZEZuID0gYW5hbHl6ZU92ZXJsb2FkZWRGbjtcblxudmFyIGNvbXBpbGVPdmVybG9hZGVkRm4gPSBmdW5jdGlvbiBjb21waWxlT3ZlcmxvYWRlZEZuKG5hbWUsIGRvYywgYXR0cnMsIG92ZXJsb2Fkcykge1xuICB2YXIgbWV0aG9kcyA9IGFuYWx5emVPdmVybG9hZGVkRm4obmFtZSwgZG9jLCBhdHRycywgb3ZlcmxvYWRzKTtcbiAgdmFyIGZpeGVkTWV0aG9kcyA9IGZpbHRlcihmdW5jdGlvbihtZXRob2QpIHtcbiAgICByZXR1cm4gISgobWV0aG9kIHx8IDApW1wicmVzdFwiXSk7XG4gIH0sIG1ldGhvZHMpO1xuICB2YXIgdmFyaWFkaWMgPSBmaXJzdChmaWx0ZXIoZnVuY3Rpb24obWV0aG9kKSB7XG4gICAgcmV0dXJuIChtZXRob2QgfHwgMClbXCJyZXN0XCJdO1xuICB9LCBtZXRob2RzKSk7XG4gIHZhciBuYW1lcyA9IHJlZHVjZShmdW5jdGlvbihuYW1lcywgcGFyYW1zKSB7XG4gICAgcmV0dXJuIGNvdW50KG5hbWVzKSA+IChwYXJhbXMgfHwgMClbXCJhcml0eVwiXSA/XG4gICAgICBuYW1lcyA6XG4gICAgICAocGFyYW1zIHx8IDApW1wibmFtZXNcIl07XG4gIH0sIFtdLCBtZXRob2RzKTtcbiAgcmV0dXJuIGxpc3Qoc3ltYm9sKHZvaWQoMCksIFwiZm5cIiksIG5hbWUsIGRvYywgYXR0cnMsIG5hbWVzLCBsaXN0KHN5bWJvbCh2b2lkKDApLCBcInJhdypcIiksIGNvbXBpbGVTd2l0Y2goc3ltYm9sKHZvaWQoMCksIFwiYXJndW1lbnRzLmxlbmd0aFwiKSwgbWFwKGZ1bmN0aW9uKG1ldGhvZCkge1xuICAgIHJldHVybiBjb25zKChtZXRob2QgfHwgMClbXCJhcml0eVwiXSwgbGlzdChzeW1ib2wodm9pZCgwKSwgXCJyYXcqXCIpLCBjb21waWxlRm5Cb2R5KGNvbmNhdChjb21waWxlUmViaW5kKG5hbWVzLCAobWV0aG9kIHx8IDApW1wibmFtZXNcIl0pLCAobWV0aG9kIHx8IDApW1wiYm9keVwiXSkpKSk7XG4gIH0sIGZpeGVkTWV0aG9kcyksIGlzTmlsKHZhcmlhZGljKSA/XG4gICAgbGlzdChzeW1ib2wodm9pZCgwKSwgXCJ0aHJvd1wiKSwgbGlzdChzeW1ib2wodm9pZCgwKSwgXCJFcnJvclwiKSwgXCJJbnZhbGlkIGFyaXR5XCIpKSA6XG4gICAgbGlzdChzeW1ib2wodm9pZCgwKSwgXCJyYXcqXCIpLCBjb21waWxlRm5Cb2R5KGNvbmNhdChjb21waWxlUmViaW5kKGNvbnMobGlzdChzeW1ib2wodm9pZCgwKSwgXCJBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbFwiKSwgc3ltYm9sKHZvaWQoMCksIFwiYXJndW1lbnRzXCIpLCAodmFyaWFkaWMgfHwgMClbXCJhcml0eVwiXSksIG5hbWVzKSwgY29ucygodmFyaWFkaWMgfHwgMClbXCJyZXN0XCJdLCAodmFyaWFkaWMgfHwgMClbXCJuYW1lc1wiXSkpLCAodmFyaWFkaWMgfHwgMClbXCJib2R5XCJdKSkpKSksIHZvaWQoMCkpO1xufTtcbmV4cG9ydHMuY29tcGlsZU92ZXJsb2FkZWRGbiA9IGNvbXBpbGVPdmVybG9hZGVkRm47XG5cbnZhciBjb21waWxlUmViaW5kID0gZnVuY3Rpb24gY29tcGlsZVJlYmluZChiaW5kaW5ncywgbmFtZXMpIHtcbiAgcmV0dXJuIChmdW5jdGlvbiBsb29wKGZvcm0sIGJpbmRpbmdzLCBuYW1lcykge1xuICAgIHZhciByZWN1ciA9IGxvb3A7XG4gICAgd2hpbGUgKHJlY3VyID09PSBsb29wKSB7XG4gICAgICByZWN1ciA9IGlzRW1wdHkobmFtZXMpID9cbiAgICAgIHJldmVyc2UoZm9ybSkgOlxuICAgICAgKGZvcm0gPSBpc0VxdWFsKGZpcnN0KG5hbWVzKSwgZmlyc3QoYmluZGluZ3MpKSA/XG4gICAgICAgIGZvcm0gOlxuICAgICAgICBjb25zKGxpc3Qoc3ltYm9sKHZvaWQoMCksIFwiZGVmXCIpLCBmaXJzdChuYW1lcyksIGZpcnN0KGJpbmRpbmdzKSksIGZvcm0pLCBiaW5kaW5ncyA9IHJlc3QoYmluZGluZ3MpLCBuYW1lcyA9IHJlc3QobmFtZXMpLCBsb29wKTtcbiAgICB9O1xuICAgIHJldHVybiByZWN1cjtcbiAgfSkobGlzdCgpLCBiaW5kaW5ncywgbmFtZXMpO1xufTtcbmV4cG9ydHMuY29tcGlsZVJlYmluZCA9IGNvbXBpbGVSZWJpbmQ7XG5cbnZhciBjb21waWxlU3dpdGNoQ2FzZXMgPSBmdW5jdGlvbiBjb21waWxlU3dpdGNoQ2FzZXMoY2FzZXMpIHtcbiAgcmV0dXJuIHJlZHVjZShmdW5jdGlvbihmb3JtLCBjYXNlRXhwcmVzc2lvbikge1xuICAgIHJldHVybiBcIlwiICsgZm9ybSArIChjb21waWxlVGVtcGxhdGUobGlzdChcImNhc2Ugfnt9OlxcbiAgfnt9XFxuXCIsIGNvbXBpbGUobWFjcm9leHBhbmQoZmlyc3QoY2FzZUV4cHJlc3Npb24pKSksIGNvbXBpbGUobWFjcm9leHBhbmQocmVzdChjYXNlRXhwcmVzc2lvbikpKSkpKTtcbiAgfSwgXCJcIiwgY2FzZXMpO1xufTtcbmV4cG9ydHMuY29tcGlsZVN3aXRjaENhc2VzID0gY29tcGlsZVN3aXRjaENhc2VzO1xuXG52YXIgY29tcGlsZVN3aXRjaCA9IGZ1bmN0aW9uIGNvbXBpbGVTd2l0Y2godmFsdWUsIGNhc2VzLCBkZWZhdWx0Q2FzZSkge1xuICByZXR1cm4gY29tcGlsZVRlbXBsYXRlKGxpc3QoXCJzd2l0Y2ggKH57fSkge1xcbiAgfnt9XFxuICBkZWZhdWx0OlxcbiAgICB+e31cXG59XCIsIGNvbXBpbGUobWFjcm9leHBhbmQodmFsdWUpKSwgY29tcGlsZVN3aXRjaENhc2VzKGNhc2VzKSwgY29tcGlsZShtYWNyb2V4cGFuZChkZWZhdWx0Q2FzZSkpKSk7XG59O1xuZXhwb3J0cy5jb21waWxlU3dpdGNoID0gY29tcGlsZVN3aXRjaDtcblxudmFyIGNvbXBpbGVGbiA9IGZ1bmN0aW9uIGNvbXBpbGVGbihmb3JtKSB7XG4gIHZhciBzaWduYXR1cmUgPSBkZXN1Z2FyRm5BdHRycyhkZXN1Z2FyRm5Eb2MoZGVzdWdhckZuTmFtZShmb3JtKSkpO1xuICB2YXIgbmFtZSA9IGZpcnN0KHNpZ25hdHVyZSk7XG4gIHZhciBkb2MgPSBzZWNvbmQoc2lnbmF0dXJlKTtcbiAgdmFyIGF0dHJzID0gdGhpcmQoc2lnbmF0dXJlKTtcbiAgcmV0dXJuIGlzVmVjdG9yKHRoaXJkKHJlc3Qoc2lnbmF0dXJlKSkpID9cbiAgICBjb21waWxlRGVzdWdhcmVkRm4obmFtZSwgZG9jLCBhdHRycywgZGVzdWdhclBhcmFtcyh0aGlyZChyZXN0KHNpZ25hdHVyZSkpKSwgcmVzdChyZXN0KHJlc3QocmVzdChzaWduYXR1cmUpKSkpKSA6XG4gICAgY29tcGlsZShjb21waWxlT3ZlcmxvYWRlZEZuKG5hbWUsIGRvYywgYXR0cnMsIHJlc3QocmVzdChyZXN0KHNpZ25hdHVyZSkpKSkpO1xufTtcbmV4cG9ydHMuY29tcGlsZUZuID0gY29tcGlsZUZuO1xuXG52YXIgY29tcGlsZUludm9rZSA9IGZ1bmN0aW9uIGNvbXBpbGVJbnZva2UoZm9ybSkge1xuICByZXR1cm4gY29tcGlsZVRlbXBsYXRlKGxpc3QoaXNMaXN0KGZpcnN0KGZvcm0pKSA/XG4gICAgXCIofnt9KSh+e30pXCIgOlxuICAgIFwifnt9KH57fSlcIiwgY29tcGlsZShmaXJzdChmb3JtKSksIGNvbXBpbGVHcm91cChyZXN0KGZvcm0pKSkpO1xufTtcbmV4cG9ydHMuY29tcGlsZUludm9rZSA9IGNvbXBpbGVJbnZva2U7XG5cbnZhciBjb21waWxlR3JvdXAgPSBmdW5jdGlvbiBjb21waWxlR3JvdXAoZm9ybSwgd3JhcCkge1xuICByZXR1cm4gd3JhcCA/XG4gICAgXCJcIiArIFwiKFwiICsgKGNvbXBpbGVHcm91cChmb3JtKSkgKyBcIilcIiA6XG4gICAgam9pbihcIiwgXCIsIHZlYyhtYXAoY29tcGlsZSwgbWFwKG1hY3JvZXhwYW5kLCBmb3JtKSkpKTtcbn07XG5leHBvcnRzLmNvbXBpbGVHcm91cCA9IGNvbXBpbGVHcm91cDtcblxudmFyIGNvbXBpbGVEbyA9IGZ1bmN0aW9uIGNvbXBpbGVEbyhmb3JtKSB7XG4gIHJldHVybiBjb21waWxlKGxpc3QoY29ucyhzeW1ib2wodm9pZCgwKSwgXCJmblwiKSwgY29ucyhbXSwgZm9ybSkpKSk7XG59O1xuZXhwb3J0cy5jb21waWxlRG8gPSBjb21waWxlRG87XG5cbnZhciBkZWZpbmVCaW5kaW5ncyA9IGZ1bmN0aW9uIGRlZmluZUJpbmRpbmdzKGZvcm0pIHtcbiAgcmV0dXJuIChmdW5jdGlvbiBsb29wKGRlZnMsIGJpbmRpbmdzKSB7XG4gICAgdmFyIHJlY3VyID0gbG9vcDtcbiAgICB3aGlsZSAocmVjdXIgPT09IGxvb3ApIHtcbiAgICAgIHJlY3VyID0gY291bnQoYmluZGluZ3MpID09PSAwID9cbiAgICAgIHJldmVyc2UoZGVmcykgOlxuICAgICAgKGRlZnMgPSBjb25zKGxpc3Qoc3ltYm9sKHZvaWQoMCksIFwiZGVmXCIpLCAoYmluZGluZ3MgfHwgMClbMF0sIChiaW5kaW5ncyB8fCAwKVsxXSksIGRlZnMpLCBiaW5kaW5ncyA9IHJlc3QocmVzdChiaW5kaW5ncykpLCBsb29wKTtcbiAgICB9O1xuICAgIHJldHVybiByZWN1cjtcbiAgfSkobGlzdCgpLCBmb3JtKTtcbn07XG5leHBvcnRzLmRlZmluZUJpbmRpbmdzID0gZGVmaW5lQmluZGluZ3M7XG5cbnZhciBjb21waWxlVGhyb3cgPSBmdW5jdGlvbiBjb21waWxlVGhyb3coZm9ybSkge1xuICByZXR1cm4gY29tcGlsZVRlbXBsYXRlKGxpc3QoXCIoZnVuY3Rpb24oKSB7IHRocm93IH57fTsgfSkoKVwiLCBjb21waWxlKG1hY3JvZXhwYW5kKGZpcnN0KGZvcm0pKSkpKTtcbn07XG5leHBvcnRzLmNvbXBpbGVUaHJvdyA9IGNvbXBpbGVUaHJvdztcblxudmFyIGNvbXBpbGVTZXQgPSBmdW5jdGlvbiBjb21waWxlU2V0KGZvcm0pIHtcbiAgcmV0dXJuIGNvbXBpbGVUZW1wbGF0ZShsaXN0KFwifnt9ID0gfnt9XCIsIGNvbXBpbGUobWFjcm9leHBhbmQoZmlyc3QoZm9ybSkpKSwgY29tcGlsZShtYWNyb2V4cGFuZChzZWNvbmQoZm9ybSkpKSkpO1xufTtcbmV4cG9ydHMuY29tcGlsZVNldCA9IGNvbXBpbGVTZXQ7XG5cbnZhciBjb21waWxlVmVjdG9yID0gZnVuY3Rpb24gY29tcGlsZVZlY3Rvcihmb3JtKSB7XG4gIHJldHVybiBjb21waWxlVGVtcGxhdGUobGlzdChcIlt+e31dXCIsIGNvbXBpbGVHcm91cChmb3JtKSkpO1xufTtcbmV4cG9ydHMuY29tcGlsZVZlY3RvciA9IGNvbXBpbGVWZWN0b3I7XG5cbnZhciBjb21waWxlVHJ5ID0gZnVuY3Rpb24gY29tcGlsZVRyeShmb3JtKSB7XG4gIHJldHVybiAoZnVuY3Rpb24gbG9vcCh0cnlFeHBycywgY2F0Y2hFeHBycywgZmluYWxseUV4cHJzLCBleHBycykge1xuICAgIHZhciByZWN1ciA9IGxvb3A7XG4gICAgd2hpbGUgKHJlY3VyID09PSBsb29wKSB7XG4gICAgICByZWN1ciA9IGlzRW1wdHkoZXhwcnMpID9cbiAgICAgIGlzRW1wdHkoY2F0Y2hFeHBycykgP1xuICAgICAgICBjb21waWxlVGVtcGxhdGUobGlzdChcIihmdW5jdGlvbigpIHtcXG50cnkge1xcbiAgfnt9XFxufSBmaW5hbGx5IHtcXG4gIH57fVxcbn19KSgpXCIsIGNvbXBpbGVGbkJvZHkodHJ5RXhwcnMpLCBjb21waWxlRm5Cb2R5KGZpbmFsbHlFeHBycykpKSA6XG4gICAgICBpc0VtcHR5KGZpbmFsbHlFeHBycykgP1xuICAgICAgICBjb21waWxlVGVtcGxhdGUobGlzdChcIihmdW5jdGlvbigpIHtcXG50cnkge1xcbiAgfnt9XFxufSBjYXRjaCAofnt9KSB7XFxuICB+e31cXG59fSkoKVwiLCBjb21waWxlRm5Cb2R5KHRyeUV4cHJzKSwgY29tcGlsZShmaXJzdChjYXRjaEV4cHJzKSksIGNvbXBpbGVGbkJvZHkocmVzdChjYXRjaEV4cHJzKSkpKSA6XG4gICAgICAgIGNvbXBpbGVUZW1wbGF0ZShsaXN0KFwiKGZ1bmN0aW9uKCkge1xcbnRyeSB7XFxuICB+e31cXG59IGNhdGNoICh+e30pIHtcXG4gIH57fVxcbn0gZmluYWxseSB7XFxuICB+e31cXG59fSkoKVwiLCBjb21waWxlRm5Cb2R5KHRyeUV4cHJzKSwgY29tcGlsZShmaXJzdChjYXRjaEV4cHJzKSksIGNvbXBpbGVGbkJvZHkocmVzdChjYXRjaEV4cHJzKSksIGNvbXBpbGVGbkJvZHkoZmluYWxseUV4cHJzKSkpIDpcbiAgICBpc0VxdWFsKGZpcnN0KGZpcnN0KGV4cHJzKSksIHN5bWJvbCh2b2lkKDApLCBcImNhdGNoXCIpKSA/XG4gICAgICAodHJ5RXhwcnMgPSB0cnlFeHBycywgY2F0Y2hFeHBycyA9IHJlc3QoZmlyc3QoZXhwcnMpKSwgZmluYWxseUV4cHJzID0gZmluYWxseUV4cHJzLCBleHBycyA9IHJlc3QoZXhwcnMpLCBsb29wKSA6XG4gICAgaXNFcXVhbChmaXJzdChmaXJzdChleHBycykpLCBzeW1ib2wodm9pZCgwKSwgXCJmaW5hbGx5XCIpKSA/XG4gICAgICAodHJ5RXhwcnMgPSB0cnlFeHBycywgY2F0Y2hFeHBycyA9IGNhdGNoRXhwcnMsIGZpbmFsbHlFeHBycyA9IHJlc3QoZmlyc3QoZXhwcnMpKSwgZXhwcnMgPSByZXN0KGV4cHJzKSwgbG9vcCkgOlxuICAgICAgKHRyeUV4cHJzID0gY29ucyhmaXJzdChleHBycyksIHRyeUV4cHJzKSwgY2F0Y2hFeHBycyA9IGNhdGNoRXhwcnMsIGZpbmFsbHlFeHBycyA9IGZpbmFsbHlFeHBycywgZXhwcnMgPSByZXN0KGV4cHJzKSwgbG9vcCk7XG4gICAgfTtcbiAgICByZXR1cm4gcmVjdXI7XG4gIH0pKGxpc3QoKSwgbGlzdCgpLCBsaXN0KCksIHJldmVyc2UoZm9ybSkpO1xufTtcbmV4cG9ydHMuY29tcGlsZVRyeSA9IGNvbXBpbGVUcnk7XG5cbnZhciBjb21waWxlUHJvcGVydHkgPSBmdW5jdGlvbiBjb21waWxlUHJvcGVydHkoZm9ybSkge1xuICByZXR1cm4gKG5hbWUoc2Vjb25kKGZvcm0pKSlbMF0gPT09IFwiLVwiID9cbiAgICBjb21waWxlVGVtcGxhdGUobGlzdChpc0xpc3QoZmlyc3QoZm9ybSkpID9cbiAgICAgIFwiKH57fSkufnt9XCIgOlxuICAgICAgXCJ+e30ufnt9XCIsIGNvbXBpbGUobWFjcm9leHBhbmQoZmlyc3QoZm9ybSkpKSwgY29tcGlsZShtYWNyb2V4cGFuZChzeW1ib2woc3VicyhuYW1lKHNlY29uZChmb3JtKSksIDEpKSkpKSkgOlxuICAgIGNvbXBpbGVUZW1wbGF0ZShsaXN0KFwifnt9Ln57fSh+e30pXCIsIGNvbXBpbGUobWFjcm9leHBhbmQoZmlyc3QoZm9ybSkpKSwgY29tcGlsZShtYWNyb2V4cGFuZChzZWNvbmQoZm9ybSkpKSwgY29tcGlsZUdyb3VwKHJlc3QocmVzdChmb3JtKSkpKSk7XG59O1xuZXhwb3J0cy5jb21waWxlUHJvcGVydHkgPSBjb21waWxlUHJvcGVydHk7XG5cbnZhciBjb21waWxlQXBwbHkgPSBmdW5jdGlvbiBjb21waWxlQXBwbHkoZm9ybSkge1xuICByZXR1cm4gY29tcGlsZShsaXN0KHN5bWJvbCh2b2lkKDApLCBcIi5cIiksIGZpcnN0KGZvcm0pLCBzeW1ib2wodm9pZCgwKSwgXCJhcHBseVwiKSwgZmlyc3QoZm9ybSksIHNlY29uZChmb3JtKSkpO1xufTtcbmV4cG9ydHMuY29tcGlsZUFwcGx5ID0gY29tcGlsZUFwcGx5O1xuXG52YXIgY29tcGlsZU5ldyA9IGZ1bmN0aW9uIGNvbXBpbGVOZXcoZm9ybSkge1xuICByZXR1cm4gY29tcGlsZVRlbXBsYXRlKGxpc3QoXCJuZXcgfnt9XCIsIGNvbXBpbGUoZm9ybSkpKTtcbn07XG5leHBvcnRzLmNvbXBpbGVOZXcgPSBjb21waWxlTmV3O1xuXG52YXIgY29tcGlsZUFnZXQgPSBmdW5jdGlvbiBjb21waWxlQWdldChmb3JtKSB7XG4gIHZhciB0YXJnZXQgPSBtYWNyb2V4cGFuZChmaXJzdChmb3JtKSk7XG4gIHZhciBhdHRyaWJ1dGUgPSBtYWNyb2V4cGFuZChzZWNvbmQoZm9ybSkpO1xuICB2YXIgbm90Rm91bmQgPSB0aGlyZChmb3JtKTtcbiAgdmFyIHRlbXBsYXRlID0gaXNMaXN0KHRhcmdldCkgP1xuICAgIFwiKH57fSlbfnt9XVwiIDpcbiAgICBcIn57fVt+e31dXCI7XG4gIHJldHVybiBub3RGb3VuZCA/XG4gICAgY29tcGlsZShsaXN0KHN5bWJvbCh2b2lkKDApLCBcIm9yXCIpLCBsaXN0KHN5bWJvbCh2b2lkKDApLCBcImdldFwiKSwgZmlyc3QoZm9ybSksIHNlY29uZChmb3JtKSksIG1hY3JvZXhwYW5kKG5vdEZvdW5kKSkpIDpcbiAgICBjb21waWxlVGVtcGxhdGUobGlzdCh0ZW1wbGF0ZSwgY29tcGlsZSh0YXJnZXQpLCBjb21waWxlKGF0dHJpYnV0ZSkpKTtcbn07XG5leHBvcnRzLmNvbXBpbGVBZ2V0ID0gY29tcGlsZUFnZXQ7XG5cbnZhciBjb21waWxlR2V0ID0gZnVuY3Rpb24gY29tcGlsZUdldChmb3JtKSB7XG4gIHJldHVybiBjb21waWxlQWdldChjb25zKGxpc3Qoc3ltYm9sKHZvaWQoMCksIFwib3JcIiksIGZpcnN0KGZvcm0pLCAwKSwgcmVzdChmb3JtKSkpO1xufTtcbmV4cG9ydHMuY29tcGlsZUdldCA9IGNvbXBpbGVHZXQ7XG5cbnZhciBjb21waWxlSW5zdGFuY2UgPSBmdW5jdGlvbiBjb21waWxlSW5zdGFuY2UoZm9ybSkge1xuICByZXR1cm4gY29tcGlsZVRlbXBsYXRlKGxpc3QoXCJ+e30gaW5zdGFuY2VvZiB+e31cIiwgY29tcGlsZShtYWNyb2V4cGFuZChzZWNvbmQoZm9ybSkpKSwgY29tcGlsZShtYWNyb2V4cGFuZChmaXJzdChmb3JtKSkpKSk7XG59O1xuZXhwb3J0cy5jb21waWxlSW5zdGFuY2UgPSBjb21waWxlSW5zdGFuY2U7XG5cbnZhciBjb21waWxlTm90ID0gZnVuY3Rpb24gY29tcGlsZU5vdChmb3JtKSB7XG4gIHJldHVybiBjb21waWxlVGVtcGxhdGUobGlzdChcIiEofnt9KVwiLCBjb21waWxlKG1hY3JvZXhwYW5kKGZpcnN0KGZvcm0pKSkpKTtcbn07XG5leHBvcnRzLmNvbXBpbGVOb3QgPSBjb21waWxlTm90O1xuXG52YXIgY29tcGlsZUxvb3AgPSBmdW5jdGlvbiBjb21waWxlTG9vcChmb3JtKSB7XG4gIHZhciBiaW5kaW5ncyA9IChmdW5jdGlvbiBsb29wKG5hbWVzLCB2YWx1ZXMsIHRva2Vucykge1xuICAgIHZhciByZWN1ciA9IGxvb3A7XG4gICAgd2hpbGUgKHJlY3VyID09PSBsb29wKSB7XG4gICAgICByZWN1ciA9IGlzRW1wdHkodG9rZW5zKSA/XG4gICAgICB7XG4gICAgICAgIFwibmFtZXNcIjogbmFtZXMsXG4gICAgICAgIFwidmFsdWVzXCI6IHZhbHVlc1xuICAgICAgfSA6XG4gICAgICAobmFtZXMgPSBjb25qKG5hbWVzLCBmaXJzdCh0b2tlbnMpKSwgdmFsdWVzID0gY29uaih2YWx1ZXMsIHNlY29uZCh0b2tlbnMpKSwgdG9rZW5zID0gcmVzdChyZXN0KHRva2VucykpLCBsb29wKTtcbiAgICB9O1xuICAgIHJldHVybiByZWN1cjtcbiAgfSkoW10sIFtdLCBmaXJzdChmb3JtKSk7XG4gIHZhciBuYW1lcyA9IChiaW5kaW5ncyB8fCAwKVtcIm5hbWVzXCJdO1xuICB2YXIgdmFsdWVzID0gKGJpbmRpbmdzIHx8IDApW1widmFsdWVzXCJdO1xuICB2YXIgYm9keSA9IHJlc3QoZm9ybSk7XG4gIHJldHVybiBjb21waWxlKGNvbnMoY29ucyhzeW1ib2wodm9pZCgwKSwgXCJmblwiKSwgY29ucyhzeW1ib2wodm9pZCgwKSwgXCJsb29wXCIpLCBjb25zKG5hbWVzLCBjb21waWxlUmVjdXIobmFtZXMsIGJvZHkpKSkpLCBsaXN0LmFwcGx5KGxpc3QsIHZhbHVlcykpKTtcbn07XG5leHBvcnRzLmNvbXBpbGVMb29wID0gY29tcGlsZUxvb3A7XG5cbnZhciByZWJpbmRCaW5kaW5ncyA9IGZ1bmN0aW9uIHJlYmluZEJpbmRpbmdzKG5hbWVzLCB2YWx1ZXMpIHtcbiAgcmV0dXJuIChmdW5jdGlvbiBsb29wKHJlc3VsdCwgbmFtZXMsIHZhbHVlcykge1xuICAgIHZhciByZWN1ciA9IGxvb3A7XG4gICAgd2hpbGUgKHJlY3VyID09PSBsb29wKSB7XG4gICAgICByZWN1ciA9IGlzRW1wdHkobmFtZXMpID9cbiAgICAgIHJldmVyc2UocmVzdWx0KSA6XG4gICAgICAocmVzdWx0ID0gY29ucyhsaXN0KHN5bWJvbCh2b2lkKDApLCBcInNldCFcIiksIGZpcnN0KG5hbWVzKSwgZmlyc3QodmFsdWVzKSksIHJlc3VsdCksIG5hbWVzID0gcmVzdChuYW1lcyksIHZhbHVlcyA9IHJlc3QodmFsdWVzKSwgbG9vcCk7XG4gICAgfTtcbiAgICByZXR1cm4gcmVjdXI7XG4gIH0pKGxpc3QoKSwgbmFtZXMsIHZhbHVlcyk7XG59O1xuZXhwb3J0cy5yZWJpbmRCaW5kaW5ncyA9IHJlYmluZEJpbmRpbmdzO1xuXG52YXIgZXhwYW5kUmVjdXIgPSBmdW5jdGlvbiBleHBhbmRSZWN1cihuYW1lcywgYm9keSkge1xuICByZXR1cm4gbWFwKGZ1bmN0aW9uKGZvcm0pIHtcbiAgICByZXR1cm4gaXNMaXN0KGZvcm0pID9cbiAgICAgIGlzRXF1YWwoZmlyc3QoZm9ybSksIHN5bWJvbCh2b2lkKDApLCBcInJlY3VyXCIpKSA/XG4gICAgICAgIGxpc3Qoc3ltYm9sKHZvaWQoMCksIFwicmF3KlwiKSwgY29tcGlsZUdyb3VwKGNvbmNhdChyZWJpbmRCaW5kaW5ncyhuYW1lcywgcmVzdChmb3JtKSksIGxpc3Qoc3ltYm9sKHZvaWQoMCksIFwibG9vcFwiKSkpLCB0cnVlKSkgOlxuICAgICAgICBleHBhbmRSZWN1cihuYW1lcywgZm9ybSkgOlxuICAgICAgZm9ybTtcbiAgfSwgYm9keSk7XG59O1xuZXhwb3J0cy5leHBhbmRSZWN1ciA9IGV4cGFuZFJlY3VyO1xuXG52YXIgY29tcGlsZVJlY3VyID0gZnVuY3Rpb24gY29tcGlsZVJlY3VyKG5hbWVzLCBib2R5KSB7XG4gIHJldHVybiBsaXN0KGxpc3Qoc3ltYm9sKHZvaWQoMCksIFwicmF3KlwiKSwgY29tcGlsZVRlbXBsYXRlKGxpc3QoXCJ2YXIgcmVjdXIgPSBsb29wO1xcbndoaWxlIChyZWN1ciA9PT0gbG9vcCkge1xcbiAgcmVjdXIgPSB+e31cXG59XCIsIGNvbXBpbGVTdGF0ZW1lbnRzKGV4cGFuZFJlY3VyKG5hbWVzLCBib2R5KSkpKSksIHN5bWJvbCh2b2lkKDApLCBcInJlY3VyXCIpKTtcbn07XG5leHBvcnRzLmNvbXBpbGVSZWN1ciA9IGNvbXBpbGVSZWN1cjtcblxudmFyIGNvbXBpbGVSYXcgPSBmdW5jdGlvbiBjb21waWxlUmF3KGZvcm0pIHtcbiAgcmV0dXJuIGZpcnN0KGZvcm0pO1xufTtcbmV4cG9ydHMuY29tcGlsZVJhdyA9IGNvbXBpbGVSYXc7XG5cbmluc3RhbGxTcGVjaWFsKHN5bWJvbCh2b2lkKDApLCBcInNldCFcIiksIGNvbXBpbGVTZXQpO1xuXG5pbnN0YWxsU3BlY2lhbChzeW1ib2wodm9pZCgwKSwgXCJnZXRcIiksIGNvbXBpbGVHZXQpO1xuXG5pbnN0YWxsU3BlY2lhbChzeW1ib2wodm9pZCgwKSwgXCJhZ2V0XCIpLCBjb21waWxlQWdldCk7XG5cbmluc3RhbGxTcGVjaWFsKHN5bWJvbCh2b2lkKDApLCBcImRlZlwiKSwgY29tcGlsZURlZik7XG5cbmluc3RhbGxTcGVjaWFsKHN5bWJvbCh2b2lkKDApLCBcImlmXCIpLCBjb21waWxlSWZFbHNlKTtcblxuaW5zdGFsbFNwZWNpYWwoc3ltYm9sKHZvaWQoMCksIFwiZG9cIiksIGNvbXBpbGVEbyk7XG5cbmluc3RhbGxTcGVjaWFsKHN5bWJvbCh2b2lkKDApLCBcImRvKlwiKSwgY29tcGlsZVN0YXRlbWVudHMpO1xuXG5pbnN0YWxsU3BlY2lhbChzeW1ib2wodm9pZCgwKSwgXCJmblwiKSwgY29tcGlsZUZuKTtcblxuaW5zdGFsbFNwZWNpYWwoc3ltYm9sKHZvaWQoMCksIFwidGhyb3dcIiksIGNvbXBpbGVUaHJvdyk7XG5cbmluc3RhbGxTcGVjaWFsKHN5bWJvbCh2b2lkKDApLCBcInZlY3RvclwiKSwgY29tcGlsZVZlY3Rvcik7XG5cbmluc3RhbGxTcGVjaWFsKHN5bWJvbCh2b2lkKDApLCBcInRyeVwiKSwgY29tcGlsZVRyeSk7XG5cbmluc3RhbGxTcGVjaWFsKHN5bWJvbCh2b2lkKDApLCBcIi5cIiksIGNvbXBpbGVQcm9wZXJ0eSk7XG5cbmluc3RhbGxTcGVjaWFsKHN5bWJvbCh2b2lkKDApLCBcImFwcGx5XCIpLCBjb21waWxlQXBwbHkpO1xuXG5pbnN0YWxsU3BlY2lhbChzeW1ib2wodm9pZCgwKSwgXCJuZXdcIiksIGNvbXBpbGVOZXcpO1xuXG5pbnN0YWxsU3BlY2lhbChzeW1ib2wodm9pZCgwKSwgXCJpbnN0YW5jZT9cIiksIGNvbXBpbGVJbnN0YW5jZSk7XG5cbmluc3RhbGxTcGVjaWFsKHN5bWJvbCh2b2lkKDApLCBcIm5vdFwiKSwgY29tcGlsZU5vdCk7XG5cbmluc3RhbGxTcGVjaWFsKHN5bWJvbCh2b2lkKDApLCBcImxvb3BcIiksIGNvbXBpbGVMb29wKTtcblxuaW5zdGFsbFNwZWNpYWwoc3ltYm9sKHZvaWQoMCksIFwicmF3KlwiKSwgY29tcGlsZVJhdyk7XG5cbmluc3RhbGxTcGVjaWFsKHN5bWJvbCh2b2lkKDApLCBcImNvbW1lbnRcIiksIHdyaXRlQ29tbWVudCk7XG5cbnZhciBjb21waWxlUmVQYXR0ZXJuID0gZnVuY3Rpb24gY29tcGlsZVJlUGF0dGVybihmb3JtKSB7XG4gIHJldHVybiBcIlwiICsgZm9ybTtcbn07XG5leHBvcnRzLmNvbXBpbGVSZVBhdHRlcm4gPSBjb21waWxlUmVQYXR0ZXJuO1xuXG52YXIgaW5zdGFsbE5hdGl2ZSA9IGZ1bmN0aW9uIGluc3RhbGxOYXRpdmUoYWxpYXMsIG9wZXJhdG9yLCB2YWxpZGF0b3IsIGZhbGxiYWNrKSB7XG4gIHJldHVybiBpbnN0YWxsU3BlY2lhbChhbGlhcywgZnVuY3Rpb24oZm9ybSkge1xuICAgIHJldHVybiBpc0VtcHR5KGZvcm0pID9cbiAgICAgIGZhbGxiYWNrIDpcbiAgICAgIHJlZHVjZShmdW5jdGlvbihsZWZ0LCByaWdodCkge1xuICAgICAgICByZXR1cm4gY29tcGlsZVRlbXBsYXRlKGxpc3QoXCJ+e30gfnt9IH57fVwiLCBsZWZ0LCBuYW1lKG9wZXJhdG9yKSwgcmlnaHQpKTtcbiAgICAgIH0sIG1hcChmdW5jdGlvbihvcGVyYW5kKSB7XG4gICAgICAgIHJldHVybiBjb21waWxlVGVtcGxhdGUobGlzdChpc0xpc3Qob3BlcmFuZCkgP1xuICAgICAgICAgIFwiKH57fSlcIiA6XG4gICAgICAgICAgXCJ+e31cIiwgY29tcGlsZShtYWNyb2V4cGFuZChvcGVyYW5kKSkpKTtcbiAgICAgIH0sIGZvcm0pKTtcbiAgfSwgdmFsaWRhdG9yKTtcbn07XG5leHBvcnRzLmluc3RhbGxOYXRpdmUgPSBpbnN0YWxsTmF0aXZlO1xuXG52YXIgaW5zdGFsbE9wZXJhdG9yID0gZnVuY3Rpb24gaW5zdGFsbE9wZXJhdG9yKGFsaWFzLCBvcGVyYXRvcikge1xuICByZXR1cm4gaW5zdGFsbFNwZWNpYWwoYWxpYXMsIGZ1bmN0aW9uKGZvcm0pIHtcbiAgICByZXR1cm4gKGZ1bmN0aW9uIGxvb3AocmVzdWx0LCBsZWZ0LCByaWdodCwgb3BlcmFuZHMpIHtcbiAgICAgIHZhciByZWN1ciA9IGxvb3A7XG4gICAgICB3aGlsZSAocmVjdXIgPT09IGxvb3ApIHtcbiAgICAgICAgcmVjdXIgPSBpc0VtcHR5KG9wZXJhbmRzKSA/XG4gICAgICAgIFwiXCIgKyByZXN1bHQgKyAoY29tcGlsZVRlbXBsYXRlKGxpc3QoXCJ+e30gfnt9IH57fVwiLCBjb21waWxlKG1hY3JvZXhwYW5kKGxlZnQpKSwgbmFtZShvcGVyYXRvciksIGNvbXBpbGUobWFjcm9leHBhbmQocmlnaHQpKSkpKSA6XG4gICAgICAgIChyZXN1bHQgPSBcIlwiICsgcmVzdWx0ICsgKGNvbXBpbGVUZW1wbGF0ZShsaXN0KFwifnt9IH57fSB+e30gJiYgXCIsIGNvbXBpbGUobWFjcm9leHBhbmQobGVmdCkpLCBuYW1lKG9wZXJhdG9yKSwgY29tcGlsZShtYWNyb2V4cGFuZChyaWdodCkpKSkpLCBsZWZ0ID0gcmlnaHQsIHJpZ2h0ID0gZmlyc3Qob3BlcmFuZHMpLCBvcGVyYW5kcyA9IHJlc3Qob3BlcmFuZHMpLCBsb29wKTtcbiAgICAgIH07XG4gICAgICByZXR1cm4gcmVjdXI7XG4gICAgfSkoXCJcIiwgZmlyc3QoZm9ybSksIHNlY29uZChmb3JtKSwgcmVzdChyZXN0KGZvcm0pKSk7XG4gIH0sIHZlcmlmeVR3byk7XG59O1xuZXhwb3J0cy5pbnN0YWxsT3BlcmF0b3IgPSBpbnN0YWxsT3BlcmF0b3I7XG5cbnZhciBjb21waWxlckVycm9yID0gZnVuY3Rpb24gY29tcGlsZXJFcnJvcihmb3JtLCBtZXNzYWdlKSB7XG4gIHZhciBlcnJvciA9IEVycm9yKFwiXCIgKyBtZXNzYWdlKTtcbiAgZXJyb3IubGluZSA9IDE7XG4gIHJldHVybiAoZnVuY3Rpb24oKSB7IHRocm93IGVycm9yOyB9KSgpO1xufTtcbmV4cG9ydHMuY29tcGlsZXJFcnJvciA9IGNvbXBpbGVyRXJyb3I7XG5cbnZhciB2ZXJpZnlUd28gPSBmdW5jdGlvbiB2ZXJpZnlUd28oZm9ybSkge1xuICByZXR1cm4gKGlzRW1wdHkocmVzdChmb3JtKSkpIHx8IChpc0VtcHR5KHJlc3QocmVzdChmb3JtKSkpKSA/XG4gICAgKGZ1bmN0aW9uKCkgeyB0aHJvdyBjb21waWxlckVycm9yKGZvcm0sIFwiXCIgKyAoZmlyc3QoZm9ybSkpICsgXCIgZm9ybSByZXF1aXJlcyBhdCBsZWFzdCB0d28gb3BlcmFuZHNcIik7IH0pKCkgOlxuICAgIHZvaWQoMCk7XG59O1xuZXhwb3J0cy52ZXJpZnlUd28gPSB2ZXJpZnlUd287XG5cbmluc3RhbGxOYXRpdmUoc3ltYm9sKHZvaWQoMCksIFwiK1wiKSwgc3ltYm9sKHZvaWQoMCksIFwiK1wiKSwgdm9pZCgwKSwgMCk7XG5cbmluc3RhbGxOYXRpdmUoc3ltYm9sKHZvaWQoMCksIFwiLVwiKSwgc3ltYm9sKHZvaWQoMCksIFwiLVwiKSwgdm9pZCgwKSwgXCJOYU5cIik7XG5cbmluc3RhbGxOYXRpdmUoc3ltYm9sKHZvaWQoMCksIFwiKlwiKSwgc3ltYm9sKHZvaWQoMCksIFwiKlwiKSwgdm9pZCgwKSwgMSk7XG5cbmluc3RhbGxOYXRpdmUoc3ltYm9sKHZvaWQoMCksIFwiL1wiKSwgc3ltYm9sKHZvaWQoMCksIFwiL1wiKSwgdmVyaWZ5VHdvKTtcblxuaW5zdGFsbE5hdGl2ZShzeW1ib2wodm9pZCgwKSwgXCJtb2RcIiksIHN5bWJvbChcIiVcIiksIHZlcmlmeVR3byk7XG5cbmluc3RhbGxOYXRpdmUoc3ltYm9sKHZvaWQoMCksIFwiYW5kXCIpLCBzeW1ib2wodm9pZCgwKSwgXCImJlwiKSk7XG5cbmluc3RhbGxOYXRpdmUoc3ltYm9sKHZvaWQoMCksIFwib3JcIiksIHN5bWJvbCh2b2lkKDApLCBcInx8XCIpKTtcblxuaW5zdGFsbE9wZXJhdG9yKHN5bWJvbCh2b2lkKDApLCBcIm5vdD1cIiksIHN5bWJvbCh2b2lkKDApLCBcIiE9XCIpKTtcblxuaW5zdGFsbE9wZXJhdG9yKHN5bWJvbCh2b2lkKDApLCBcIj09XCIpLCBzeW1ib2wodm9pZCgwKSwgXCI9PT1cIikpO1xuXG5pbnN0YWxsT3BlcmF0b3Ioc3ltYm9sKHZvaWQoMCksIFwiaWRlbnRpY2FsP1wiKSwgc3ltYm9sKHZvaWQoMCksIFwiPT09XCIpKTtcblxuaW5zdGFsbE9wZXJhdG9yKHN5bWJvbCh2b2lkKDApLCBcIj5cIiksIHN5bWJvbCh2b2lkKDApLCBcIj5cIikpO1xuXG5pbnN0YWxsT3BlcmF0b3Ioc3ltYm9sKHZvaWQoMCksIFwiPj1cIiksIHN5bWJvbCh2b2lkKDApLCBcIj49XCIpKTtcblxuaW5zdGFsbE9wZXJhdG9yKHN5bWJvbCh2b2lkKDApLCBcIjxcIiksIHN5bWJvbCh2b2lkKDApLCBcIjxcIikpO1xuXG5pbnN0YWxsT3BlcmF0b3Ioc3ltYm9sKHZvaWQoMCksIFwiPD1cIiksIHN5bWJvbCh2b2lkKDApLCBcIjw9XCIpKTtcblxuaW5zdGFsbE5hdGl2ZShzeW1ib2wodm9pZCgwKSwgXCJiaXQtYW5kXCIpLCBzeW1ib2wodm9pZCgwKSwgXCImXCIpLCB2ZXJpZnlUd28pO1xuXG5pbnN0YWxsTmF0aXZlKHN5bWJvbCh2b2lkKDApLCBcImJpdC1vclwiKSwgc3ltYm9sKHZvaWQoMCksIFwifFwiKSwgdmVyaWZ5VHdvKTtcblxuaW5zdGFsbE5hdGl2ZShzeW1ib2wodm9pZCgwKSwgXCJiaXQteG9yXCIpLCBzeW1ib2woXCJeXCIpKTtcblxuaW5zdGFsbE5hdGl2ZShzeW1ib2wodm9pZCgwKSwgXCJiaXQtbm90XCIpLCBzeW1ib2woXCJ+XCIpLCB2ZXJpZnlUd28pO1xuXG5pbnN0YWxsTmF0aXZlKHN5bWJvbCh2b2lkKDApLCBcImJpdC1zaGlmdC1sZWZ0XCIpLCBzeW1ib2wodm9pZCgwKSwgXCI8PFwiKSwgdmVyaWZ5VHdvKTtcblxuaW5zdGFsbE5hdGl2ZShzeW1ib2wodm9pZCgwKSwgXCJiaXQtc2hpZnQtcmlnaHRcIiksIHN5bWJvbCh2b2lkKDApLCBcIj4+XCIpLCB2ZXJpZnlUd28pO1xuXG5pbnN0YWxsTmF0aXZlKHN5bWJvbCh2b2lkKDApLCBcImJpdC1zaGlmdC1yaWdodC16ZXJvLWZpbFwiKSwgc3ltYm9sKHZvaWQoMCksIFwiPj4+XCIpLCB2ZXJpZnlUd28pO1xuXG5pbnN0YWxsTWFjcm8oc3ltYm9sKHZvaWQoMCksIFwic3RyXCIpLCBmdW5jdGlvbiBzdHIoKSB7XG4gIHZhciBmb3JtcyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMCk7XG4gIHJldHVybiBjb25jYXQobGlzdChzeW1ib2wodm9pZCgwKSwgXCIrXCIpLCBcIlwiKSwgZm9ybXMpO1xufSk7XG5cbmluc3RhbGxNYWNybyhzeW1ib2wodm9pZCgwKSwgXCJsZXRcIiksIGZ1bmN0aW9uIGxldE1hY3JvKGJpbmRpbmdzKSB7XG4gIHZhciBib2R5ID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgcmV0dXJuIGNvbnMoc3ltYm9sKHZvaWQoMCksIFwiZG9cIiksIGNvbmNhdChkZWZpbmVCaW5kaW5ncyhiaW5kaW5ncyksIGJvZHkpKTtcbn0pO1xuXG5pbnN0YWxsTWFjcm8oc3ltYm9sKHZvaWQoMCksIFwiY29uZFwiKSwgZnVuY3Rpb24gY29uZCgpIHtcbiAgdmFyIGNsYXVzZXMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDApO1xuICByZXR1cm4gIShpc0VtcHR5KGNsYXVzZXMpKSA/XG4gICAgbGlzdChzeW1ib2wodm9pZCgwKSwgXCJpZlwiKSwgZmlyc3QoY2xhdXNlcyksIGlzRW1wdHkocmVzdChjbGF1c2VzKSkgP1xuICAgICAgKGZ1bmN0aW9uKCkgeyB0aHJvdyBFcnJvcihcImNvbmQgcmVxdWlyZXMgYW4gZXZlbiBudW1iZXIgb2YgZm9ybXNcIik7IH0pKCkgOlxuICAgICAgc2Vjb25kKGNsYXVzZXMpLCBjb25zKHN5bWJvbCh2b2lkKDApLCBcImNvbmRcIiksIHJlc3QocmVzdChjbGF1c2VzKSkpKSA6XG4gICAgdm9pZCgwKTtcbn0pO1xuXG5pbnN0YWxsTWFjcm8oc3ltYm9sKHZvaWQoMCksIFwiZGVmblwiKSwgZnVuY3Rpb24gZGVmbihuYW1lKSB7XG4gIHZhciBib2R5ID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgcmV0dXJuIGxpc3Qoc3ltYm9sKHZvaWQoMCksIFwiZGVmXCIpLCBuYW1lLCBjb25jYXQobGlzdChzeW1ib2wodm9pZCgwKSwgXCJmblwiKSwgbmFtZSksIGJvZHkpKTtcbn0pO1xuXG5pbnN0YWxsTWFjcm8oc3ltYm9sKHZvaWQoMCksIFwiZGVmbi1cIiksIGZ1bmN0aW9uIGRlZm4obmFtZSkge1xuICB2YXIgYm9keSA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gIHJldHVybiBjb25jYXQobGlzdChzeW1ib2wodm9pZCgwKSwgXCJkZWZuXCIpLCB3aXRoTWV0YShuYW1lLCBjb25qKHtcbiAgICBcInByaXZhdGVcIjogdHJ1ZVxuICB9LCBtZXRhKG5hbWUpKSkpLCBib2R5KTtcbn0pO1xuXG5pbnN0YWxsTWFjcm8oc3ltYm9sKHZvaWQoMCksIFwiYXNzZXJ0XCIpLCBmdW5jdGlvbiBhc3NlcnQoeCwgbWVzc2FnZSkge1xuICB2YXIgdGl0bGUgPSBtZXNzYWdlIHx8IFwiXCI7XG4gIHZhciBhc3NlcnRpb24gPSBwclN0cih4KTtcbiAgdmFyIHVyaSA9ICh4IHx8IDApW1widXJpXCJdO1xuICB2YXIgZm9ybSA9IGlzTGlzdCh4KSA/XG4gICAgc2Vjb25kKHgpIDpcbiAgICB4O1xuICByZXR1cm4gbGlzdChzeW1ib2wodm9pZCgwKSwgXCJkb1wiKSwgbGlzdChzeW1ib2wodm9pZCgwKSwgXCJpZlwiKSwgbGlzdChzeW1ib2wodm9pZCgwKSwgXCJhbmRcIiksIGxpc3Qoc3ltYm9sKHZvaWQoMCksIFwibm90XCIpLCBsaXN0KHN5bWJvbCh2b2lkKDApLCBcImlkZW50aWNhbD9cIiksIGxpc3Qoc3ltYm9sKHZvaWQoMCksIFwidHlwZW9mXCIpLCBzeW1ib2wodm9pZCgwKSwgXCIqKnZlcmJvc2UqKlwiKSksIFwidW5kZWZpbmVkXCIpKSwgc3ltYm9sKHZvaWQoMCksIFwiKip2ZXJib3NlKipcIikpLCBsaXN0KHN5bWJvbCh2b2lkKDApLCBcIi5sb2dcIiksIHN5bWJvbCh2b2lkKDApLCBcImNvbnNvbGVcIiksIFwiQXNzZXJ0OlwiLCBhc3NlcnRpb24pKSwgbGlzdChzeW1ib2wodm9pZCgwKSwgXCJpZlwiKSwgbGlzdChzeW1ib2wodm9pZCgwKSwgXCJub3RcIiksIHgpLCBsaXN0KHN5bWJvbCh2b2lkKDApLCBcInRocm93XCIpLCBsaXN0KHN5bWJvbCh2b2lkKDApLCBcIkVycm9yLlwiKSwgbGlzdChzeW1ib2wodm9pZCgwKSwgXCJzdHJcIiksIFwiQXNzZXJ0IGZhaWxlZDogXCIsIHRpdGxlLCBcIlxcblxcbkFzc2VydGlvbjpcXG5cXG5cIiwgYXNzZXJ0aW9uLCBcIlxcblxcbkFjdHVhbDpcXG5cXG5cIiwgZm9ybSwgXCJcXG4tLS0tLS0tLS0tLS0tLVxcblwiKSwgdXJpKSkpKTtcbn0pO1xuXG52YXIgcGFyc2VSZWZlcmVuY2VzID0gZnVuY3Rpb24gcGFyc2VSZWZlcmVuY2VzKGZvcm1zKSB7XG4gIHJldHVybiByZWR1Y2UoZnVuY3Rpb24ocmVmZXJlbmNlcywgZm9ybSkge1xuICAgIGlzU2VxKGZvcm0pID9cbiAgICAgIChyZWZlcmVuY2VzIHx8IDApW25hbWUoZmlyc3QoZm9ybSkpXSA9IHZlYyhyZXN0KGZvcm0pKSA6XG4gICAgICB2b2lkKDApO1xuICAgIHJldHVybiByZWZlcmVuY2VzO1xuICB9LCB7fSwgZm9ybXMpO1xufTtcbmV4cG9ydHMucGFyc2VSZWZlcmVuY2VzID0gcGFyc2VSZWZlcmVuY2VzO1xuXG52YXIgcGFyc2VSZXF1aXJlID0gZnVuY3Rpb24gcGFyc2VSZXF1aXJlKGZvcm0pIHtcbiAgdmFyIHJlcXVpcmVtZW50ID0gaXNTeW1ib2woZm9ybSkgP1xuICAgIFtmb3JtXSA6XG4gICAgdmVjKGZvcm0pO1xuICB2YXIgaWQgPSBmaXJzdChyZXF1aXJlbWVudCk7XG4gIHZhciBwYXJhbXMgPSBkaWN0aW9uYXJ5LmFwcGx5KGRpY3Rpb25hcnksIHJlc3QocmVxdWlyZW1lbnQpKTtcbiAgdmFyIGltcG9ydHMgPSByZWR1Y2UoZnVuY3Rpb24oaW1wb3J0cywgbmFtZSkge1xuICAgIChpbXBvcnRzIHx8IDApW25hbWVdID0gKChpbXBvcnRzIHx8IDApW25hbWVdKSB8fCBuYW1lO1xuICAgIHJldHVybiBpbXBvcnRzO1xuICB9LCBjb25qKHt9LCAocGFyYW1zIHx8IDApW1wi6p6JcmVuYW1lXCJdKSwgKHBhcmFtcyB8fCAwKVtcIuqeiXJlZmVyXCJdKTtcbiAgcmV0dXJuIGNvbmooe1xuICAgIFwiaWRcIjogaWQsXG4gICAgXCJpbXBvcnRzXCI6IGltcG9ydHNcbiAgfSwgcGFyYW1zKTtcbn07XG5leHBvcnRzLnBhcnNlUmVxdWlyZSA9IHBhcnNlUmVxdWlyZTtcblxudmFyIGFuYWx5emVOcyA9IGZ1bmN0aW9uIGFuYWx5emVOcyhmb3JtKSB7XG4gIHZhciBpZCA9IGZpcnN0KGZvcm0pO1xuICB2YXIgcGFyYW1zID0gcmVzdChmb3JtKTtcbiAgdmFyIGRvYyA9IGlzU3RyaW5nKGZpcnN0KHBhcmFtcykpID9cbiAgICBmaXJzdChwYXJhbXMpIDpcbiAgICB2b2lkKDApO1xuICB2YXIgcmVmZXJlbmNlcyA9IHBhcnNlUmVmZXJlbmNlcyhkb2MgP1xuICAgIHJlc3QocGFyYW1zKSA6XG4gICAgcGFyYW1zKTtcbiAgcmV0dXJuIHdpdGhNZXRhKGZvcm0sIHtcbiAgICBcImlkXCI6IGlkLFxuICAgIFwiZG9jXCI6IGRvYyxcbiAgICBcInJlcXVpcmVcIjogKHJlZmVyZW5jZXMgfHwgMClbXCJyZXF1aXJlXCJdID9cbiAgICAgIG1hcChwYXJzZVJlcXVpcmUsIChyZWZlcmVuY2VzIHx8IDApW1wicmVxdWlyZVwiXSkgOlxuICAgICAgdm9pZCgwKVxuICB9KTtcbn07XG5leHBvcnRzLmFuYWx5emVOcyA9IGFuYWx5emVOcztcblxudmFyIGlkVG9OcyA9IGZ1bmN0aW9uIGlkVG9OcyhpZCkge1xuICByZXR1cm4gc3ltYm9sKHZvaWQoMCksIGpvaW4oXCIqXCIsIHNwbGl0KFwiXCIgKyBpZCwgXCIuXCIpKSk7XG59O1xuZXhwb3J0cy5pZFRvTnMgPSBpZFRvTnM7XG5cbnZhciBuYW1lVG9GaWVsZCA9IGZ1bmN0aW9uIG5hbWVUb0ZpZWxkKG5hbWUpIHtcbiAgcmV0dXJuIHN5bWJvbCh2b2lkKDApLCBcIlwiICsgXCItXCIgKyBuYW1lKTtcbn07XG5leHBvcnRzLm5hbWVUb0ZpZWxkID0gbmFtZVRvRmllbGQ7XG5cbnZhciBjb21waWxlSW1wb3J0ID0gZnVuY3Rpb24gY29tcGlsZUltcG9ydChtb2R1bGUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGZvcm0pIHtcbiAgICByZXR1cm4gbGlzdChzeW1ib2wodm9pZCgwKSwgXCJkZWZcIiksIHNlY29uZChmb3JtKSwgbGlzdChzeW1ib2wodm9pZCgwKSwgXCIuXCIpLCBtb2R1bGUsIG5hbWVUb0ZpZWxkKGZpcnN0KGZvcm0pKSkpO1xuICB9O1xufTtcbmV4cG9ydHMuY29tcGlsZUltcG9ydCA9IGNvbXBpbGVJbXBvcnQ7XG5cbnZhciBjb21waWxlUmVxdWlyZSA9IGZ1bmN0aW9uIGNvbXBpbGVSZXF1aXJlKHJlcXVpcmVyKSB7XG4gIHJldHVybiBmdW5jdGlvbihmb3JtKSB7XG4gICAgdmFyIGlkID0gKGZvcm0gfHwgMClbXCJpZFwiXTtcbiAgICB2YXIgcmVxdWlyZW1lbnQgPSBpZFRvTnMoKChmb3JtIHx8IDApW1wi6p6JYXNcIl0pIHx8IGlkKTtcbiAgICB2YXIgcGF0aCA9IHJlc29sdmUocmVxdWlyZXIsIGlkKTtcbiAgICB2YXIgaW1wb3J0cyA9IChmb3JtIHx8IDApW1wiaW1wb3J0c1wiXTtcbiAgICByZXR1cm4gY29uY2F0KFtzeW1ib2wodm9pZCgwKSwgXCJkbypcIiksIGxpc3Qoc3ltYm9sKHZvaWQoMCksIFwiZGVmXCIpLCByZXF1aXJlbWVudCwgbGlzdChzeW1ib2wodm9pZCgwKSwgXCJyZXF1aXJlXCIpLCBwYXRoKSldLCBpbXBvcnRzID9cbiAgICAgIG1hcChjb21waWxlSW1wb3J0KHJlcXVpcmVtZW50KSwgaW1wb3J0cykgOlxuICAgICAgdm9pZCgwKSk7XG4gIH07XG59O1xuZXhwb3J0cy5jb21waWxlUmVxdWlyZSA9IGNvbXBpbGVSZXF1aXJlO1xuXG52YXIgcmVzb2x2ZSA9IGZ1bmN0aW9uIHJlc29sdmUoZnJvbSwgdG8pIHtcbiAgdmFyIHJlcXVpcmVyID0gc3BsaXQoXCJcIiArIGZyb20sIFwiLlwiKTtcbiAgdmFyIHJlcXVpcmVtZW50ID0gc3BsaXQoXCJcIiArIHRvLCBcIi5cIik7XG4gIHZhciBpc1JlbGF0aXZlID0gKCEoXCJcIiArIGZyb20gPT09IFwiXCIgKyB0bykpICYmIChmaXJzdChyZXF1aXJlcikgPT09IGZpcnN0KHJlcXVpcmVtZW50KSk7XG4gIHJldHVybiBpc1JlbGF0aXZlID9cbiAgICAoZnVuY3Rpb24gbG9vcChmcm9tLCB0bykge1xuICAgICAgdmFyIHJlY3VyID0gbG9vcDtcbiAgICAgIHdoaWxlIChyZWN1ciA9PT0gbG9vcCkge1xuICAgICAgICByZWN1ciA9IGZpcnN0KGZyb20pID09PSBmaXJzdCh0bykgP1xuICAgICAgICAoZnJvbSA9IHJlc3QoZnJvbSksIHRvID0gcmVzdCh0byksIGxvb3ApIDpcbiAgICAgICAgam9pbihcIi9cIiwgY29uY2F0KFtcIi5cIl0sIHJlcGVhdChkZWMoY291bnQoZnJvbSkpLCBcIi4uXCIpLCB0bykpO1xuICAgICAgfTtcbiAgICAgIHJldHVybiByZWN1cjtcbiAgICB9KShyZXF1aXJlciwgcmVxdWlyZW1lbnQpIDpcbiAgICBqb2luKFwiL1wiLCByZXF1aXJlbWVudCk7XG59O1xuZXhwb3J0cy5yZXNvbHZlID0gcmVzb2x2ZTtcblxudmFyIGNvbXBpbGVOcyA9IGZ1bmN0aW9uIGNvbXBpbGVOcygpIHtcbiAgdmFyIGZvcm0gPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDApO1xuICByZXR1cm4gKGZ1bmN0aW9uKCkge1xuICAgIHZhciBtZXRhZGF0YSA9IG1ldGEoYW5hbHl6ZU5zKGZvcm0pKTtcbiAgICB2YXIgaWQgPSBcIlwiICsgKChtZXRhZGF0YSB8fCAwKVtcImlkXCJdKTtcbiAgICB2YXIgZG9jID0gKG1ldGFkYXRhIHx8IDApW1wiZG9jXCJdO1xuICAgIHZhciByZXF1aXJlbWVudHMgPSAobWV0YWRhdGEgfHwgMClbXCJyZXF1aXJlXCJdO1xuICAgIHZhciBucyA9IGRvYyA/XG4gICAgICB7XG4gICAgICAgIFwiaWRcIjogaWQsXG4gICAgICAgIFwiZG9jXCI6IGRvY1xuICAgICAgfSA6XG4gICAgICB7XG4gICAgICAgIFwiaWRcIjogaWRcbiAgICAgIH07XG4gICAgcmV0dXJuIGNvbmNhdChbc3ltYm9sKHZvaWQoMCksIFwiZG8qXCIpLCBsaXN0KHN5bWJvbCh2b2lkKDApLCBcImRlZlwiKSwgc3ltYm9sKHZvaWQoMCksIFwiKm5zKlwiKSwgbnMpXSwgcmVxdWlyZW1lbnRzID9cbiAgICAgIG1hcChjb21waWxlUmVxdWlyZShpZCksIHJlcXVpcmVtZW50cykgOlxuICAgICAgdm9pZCgwKSk7XG4gIH0pKCk7XG59O1xuZXhwb3J0cy5jb21waWxlTnMgPSBjb21waWxlTnM7XG5cbmluc3RhbGxNYWNybyhzeW1ib2wodm9pZCgwKSwgXCJuc1wiKSwgY29tcGlsZU5zKTtcblxuaW5zdGFsbE1hY3JvKHN5bWJvbCh2b2lkKDApLCBcInByaW50XCIpLCBmdW5jdGlvbigpIHtcbiAgdmFyIG1vcmUgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDApO1xuICBcIlByaW50cyB0aGUgb2JqZWN0KHMpIHRvIHRoZSBvdXRwdXQgZm9yIGh1bWFuIGNvbnN1bXB0aW9uLlwiO1xuICByZXR1cm4gY29uY2F0KGxpc3Qoc3ltYm9sKHZvaWQoMCksIFwiLmxvZ1wiKSwgc3ltYm9sKHZvaWQoMCksIFwiY29uc29sZVwiKSksIG1vcmUpO1xufSkiLCJ2YXIgX25zXyA9IHtcbiAgXCJpZFwiOiBcIndpc3AuYXN0XCJcbn07XG52YXIgd2lzcF9zZXF1ZW5jZSA9IHJlcXVpcmUoXCIuL3NlcXVlbmNlXCIpO1xudmFyIGlzTGlzdCA9IHdpc3Bfc2VxdWVuY2UuaXNMaXN0O1xudmFyIGlzU2VxdWVudGlhbCA9IHdpc3Bfc2VxdWVuY2UuaXNTZXF1ZW50aWFsO1xudmFyIGZpcnN0ID0gd2lzcF9zZXF1ZW5jZS5maXJzdDtcbnZhciBzZWNvbmQgPSB3aXNwX3NlcXVlbmNlLnNlY29uZDtcbnZhciBjb3VudCA9IHdpc3Bfc2VxdWVuY2UuY291bnQ7XG52YXIgbGFzdCA9IHdpc3Bfc2VxdWVuY2UubGFzdDtcbnZhciBtYXAgPSB3aXNwX3NlcXVlbmNlLm1hcDtcbnZhciB2ZWMgPSB3aXNwX3NlcXVlbmNlLnZlYzs7XG52YXIgd2lzcF9zdHJpbmcgPSByZXF1aXJlKFwiLi9zdHJpbmdcIik7XG52YXIgc3BsaXQgPSB3aXNwX3N0cmluZy5zcGxpdDtcbnZhciBqb2luID0gd2lzcF9zdHJpbmcuam9pbjs7XG52YXIgd2lzcF9ydW50aW1lID0gcmVxdWlyZShcIi4vcnVudGltZVwiKTtcbnZhciBpc05pbCA9IHdpc3BfcnVudGltZS5pc05pbDtcbnZhciBpc1ZlY3RvciA9IHdpc3BfcnVudGltZS5pc1ZlY3RvcjtcbnZhciBpc051bWJlciA9IHdpc3BfcnVudGltZS5pc051bWJlcjtcbnZhciBpc1N0cmluZyA9IHdpc3BfcnVudGltZS5pc1N0cmluZztcbnZhciBpc0Jvb2xlYW4gPSB3aXNwX3J1bnRpbWUuaXNCb29sZWFuO1xudmFyIGlzT2JqZWN0ID0gd2lzcF9ydW50aW1lLmlzT2JqZWN0O1xudmFyIGlzRGF0ZSA9IHdpc3BfcnVudGltZS5pc0RhdGU7XG52YXIgaXNSZVBhdHRlcm4gPSB3aXNwX3J1bnRpbWUuaXNSZVBhdHRlcm47XG52YXIgaXNEaWN0aW9uYXJ5ID0gd2lzcF9ydW50aW1lLmlzRGljdGlvbmFyeTtcbnZhciBzdHIgPSB3aXNwX3J1bnRpbWUuc3RyO1xudmFyIGluYyA9IHdpc3BfcnVudGltZS5pbmM7XG52YXIgc3VicyA9IHdpc3BfcnVudGltZS5zdWJzO1xudmFyIGlzRXF1YWwgPSB3aXNwX3J1bnRpbWUuaXNFcXVhbDs7O1xuXG52YXIgd2l0aE1ldGEgPSBmdW5jdGlvbiB3aXRoTWV0YSh2YWx1ZSwgbWV0YWRhdGEpIHtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHZhbHVlLCBcIm1ldGFkYXRhXCIsIHtcbiAgICBcInZhbHVlXCI6IG1ldGFkYXRhLFxuICAgIFwiY29uZmlndXJhYmxlXCI6IHRydWVcbiAgfSk7XG4gIHJldHVybiB2YWx1ZTtcbn07XG5leHBvcnRzLndpdGhNZXRhID0gd2l0aE1ldGE7XG5cbnZhciBtZXRhID0gZnVuY3Rpb24gbWV0YSh2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3QodmFsdWUpID9cbiAgICB2YWx1ZS5tZXRhZGF0YSA6XG4gICAgdm9pZCgwKTtcbn07XG5leHBvcnRzLm1ldGEgPSBtZXRhO1xuXG52YXIgX19uc1NlcGFyYXRvcl9fID0gXCLigYRcIjtcbmV4cG9ydHMuX19uc1NlcGFyYXRvcl9fID0gX19uc1NlcGFyYXRvcl9fO1xuXG52YXIgU3ltYm9sID0gZnVuY3Rpb24gU3ltYm9sKG5hbWVzcGFjZSwgbmFtZSkge1xuICB0aGlzLm5hbWVzcGFjZSA9IG5hbWVzcGFjZTtcbiAgdGhpcy5uYW1lID0gbmFtZTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5TeW1ib2wudHlwZSA9IFwid2lzcC5zeW1ib2xcIjtcblxuU3ltYm9sLnByb3RvdHlwZS50eXBlID0gU3ltYm9sLnR5cGU7XG5cblN5bWJvbC5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgdmFyIG5zID0gbmFtZXNwYWNlKHRoaXMpO1xuICByZXR1cm4gbnMgP1xuICAgIFwiXCIgKyBucyArIFwiL1wiICsgKG5hbWUodGhpcykpIDpcbiAgICBcIlwiICsgKG5hbWUodGhpcykpO1xufTtcblxudmFyIHN5bWJvbCA9IGZ1bmN0aW9uIHN5bWJvbChucywgaWQpIHtcbiAgcmV0dXJuIGlzU3ltYm9sKG5zKSA/XG4gICAgbnMgOlxuICBpc0tleXdvcmQobnMpID9cbiAgICBuZXcgU3ltYm9sKG5hbWVzcGFjZShucyksIG5hbWUobnMpKSA6XG4gIGlzTmlsKGlkKSA/XG4gICAgbmV3IFN5bWJvbCh2b2lkKDApLCBucykgOlxuICBcImVsc2VcIiA/XG4gICAgbmV3IFN5bWJvbChucywgaWQpIDpcbiAgICB2b2lkKDApO1xufTtcbmV4cG9ydHMuc3ltYm9sID0gc3ltYm9sO1xuXG52YXIgaXNTeW1ib2wgPSBmdW5jdGlvbiBpc1N5bWJvbCh4KSB7XG4gIHJldHVybiB4ICYmIChTeW1ib2wudHlwZSA9PT0geC50eXBlKTtcbn07XG5leHBvcnRzLmlzU3ltYm9sID0gaXNTeW1ib2w7XG5cbnZhciBpc0tleXdvcmQgPSBmdW5jdGlvbiBpc0tleXdvcmQoeCkge1xuICByZXR1cm4gKGlzU3RyaW5nKHgpKSAmJiAoY291bnQoeCkgPiAxKSAmJiAoZmlyc3QoeCkgPT09IFwi6p6JXCIpO1xufTtcbmV4cG9ydHMuaXNLZXl3b3JkID0gaXNLZXl3b3JkO1xuXG52YXIga2V5d29yZCA9IGZ1bmN0aW9uIGtleXdvcmQobnMsIGlkKSB7XG4gIHJldHVybiBpc0tleXdvcmQobnMpID9cbiAgICBucyA6XG4gIGlzU3ltYm9sKG5zKSA/XG4gICAgXCJcIiArIFwi6p6JXCIgKyAobmFtZShucykpIDpcbiAgaXNOaWwoaWQpID9cbiAgICBcIlwiICsgXCLqnolcIiArIG5zIDpcbiAgaXNOaWwobnMpID9cbiAgICBcIlwiICsgXCLqnolcIiArIGlkIDpcbiAgXCJlbHNlXCIgP1xuICAgIFwiXCIgKyBcIuqeiVwiICsgbnMgKyBfX25zU2VwYXJhdG9yX18gKyBpZCA6XG4gICAgdm9pZCgwKTtcbn07XG5leHBvcnRzLmtleXdvcmQgPSBrZXl3b3JkO1xuXG52YXIga2V5d29yZE5hbWUgPSBmdW5jdGlvbiBrZXl3b3JkTmFtZSh2YWx1ZSkge1xuICByZXR1cm4gbGFzdChzcGxpdChzdWJzKHZhbHVlLCAxKSwgX19uc1NlcGFyYXRvcl9fKSk7XG59O1xuXG52YXIgbmFtZSA9IGZ1bmN0aW9uIG5hbWUodmFsdWUpIHtcbiAgcmV0dXJuIGlzU3ltYm9sKHZhbHVlKSA/XG4gICAgdmFsdWUubmFtZSA6XG4gIGlzS2V5d29yZCh2YWx1ZSkgP1xuICAgIGtleXdvcmROYW1lKHZhbHVlKSA6XG4gIGlzU3RyaW5nKHZhbHVlKSA/XG4gICAgdmFsdWUgOlxuICBcImVsc2VcIiA/XG4gICAgKGZ1bmN0aW9uKCkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiXCIgKyBcIkRvZXNuJ3Qgc3VwcG9ydCBuYW1lOiBcIiArIHZhbHVlKTsgfSkoKSA6XG4gICAgdm9pZCgwKTtcbn07XG5leHBvcnRzLm5hbWUgPSBuYW1lO1xuXG52YXIga2V5d29yZE5hbWVzcGFjZSA9IGZ1bmN0aW9uIGtleXdvcmROYW1lc3BhY2UoeCkge1xuICB2YXIgcGFydHMgPSBzcGxpdChzdWJzKHgsIDEpLCBfX25zU2VwYXJhdG9yX18pO1xuICByZXR1cm4gY291bnQocGFydHMpID4gMSA/XG4gICAgKHBhcnRzIHx8IDApWzBdIDpcbiAgICB2b2lkKDApO1xufTtcblxudmFyIG5hbWVzcGFjZSA9IGZ1bmN0aW9uIG5hbWVzcGFjZSh4KSB7XG4gIHJldHVybiBpc1N5bWJvbCh4KSA/XG4gICAgeC5uYW1lc3BhY2UgOlxuICBpc0tleXdvcmQoeCkgP1xuICAgIGtleXdvcmROYW1lc3BhY2UoeCkgOlxuICBcImVsc2VcIiA/XG4gICAgKGZ1bmN0aW9uKCkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiXCIgKyBcIkRvZXNuJ3Qgc3VwcG9ydHMgbmFtZXNwYWNlOiBcIiArIHgpOyB9KSgpIDpcbiAgICB2b2lkKDApO1xufTtcbmV4cG9ydHMubmFtZXNwYWNlID0gbmFtZXNwYWNlO1xuXG52YXIgZ2Vuc3ltID0gZnVuY3Rpb24gZ2Vuc3ltKHByZWZpeCkge1xuICByZXR1cm4gc3ltYm9sKFwiXCIgKyAoaXNOaWwocHJlZml4KSA/XG4gICAgXCJHX19cIiA6XG4gICAgcHJlZml4KSArIChnZW5zeW0uYmFzZSA9IGdlbnN5bS5iYXNlICsgMSkpO1xufTtcbmV4cG9ydHMuZ2Vuc3ltID0gZ2Vuc3ltO1xuXG5nZW5zeW0uYmFzZSA9IDA7XG5cbnZhciBpc1VucXVvdGUgPSBmdW5jdGlvbiBpc1VucXVvdGUoZm9ybSkge1xuICByZXR1cm4gKGlzTGlzdChmb3JtKSkgJiYgKGlzRXF1YWwoZmlyc3QoZm9ybSksIHN5bWJvbCh2b2lkKDApLCBcInVucXVvdGVcIikpKTtcbn07XG5leHBvcnRzLmlzVW5xdW90ZSA9IGlzVW5xdW90ZTtcblxudmFyIGlzVW5xdW90ZVNwbGljaW5nID0gZnVuY3Rpb24gaXNVbnF1b3RlU3BsaWNpbmcoZm9ybSkge1xuICByZXR1cm4gKGlzTGlzdChmb3JtKSkgJiYgKGlzRXF1YWwoZmlyc3QoZm9ybSksIHN5bWJvbCh2b2lkKDApLCBcInVucXVvdGUtc3BsaWNpbmdcIikpKTtcbn07XG5leHBvcnRzLmlzVW5xdW90ZVNwbGljaW5nID0gaXNVbnF1b3RlU3BsaWNpbmc7XG5cbnZhciBpc1F1b3RlID0gZnVuY3Rpb24gaXNRdW90ZShmb3JtKSB7XG4gIHJldHVybiAoaXNMaXN0KGZvcm0pKSAmJiAoaXNFcXVhbChmaXJzdChmb3JtKSwgc3ltYm9sKHZvaWQoMCksIFwicXVvdGVcIikpKTtcbn07XG5leHBvcnRzLmlzUXVvdGUgPSBpc1F1b3RlO1xuXG52YXIgaXNTeW50YXhRdW90ZSA9IGZ1bmN0aW9uIGlzU3ludGF4UXVvdGUoZm9ybSkge1xuICByZXR1cm4gKGlzTGlzdChmb3JtKSkgJiYgKGlzRXF1YWwoZmlyc3QoZm9ybSksIHN5bWJvbCh2b2lkKDApLCBcInN5bnRheC1xdW90ZVwiKSkpO1xufTtcbmV4cG9ydHMuaXNTeW50YXhRdW90ZSA9IGlzU3ludGF4UXVvdGU7XG5cbnZhciBub3JtYWxpemUgPSBmdW5jdGlvbiBub3JtYWxpemUobiwgbGVuKSB7XG4gIHJldHVybiAoZnVuY3Rpb24gbG9vcChucykge1xuICAgIHZhciByZWN1ciA9IGxvb3A7XG4gICAgd2hpbGUgKHJlY3VyID09PSBsb29wKSB7XG4gICAgICByZWN1ciA9IGNvdW50KG5zKSA8IGxlbiA/XG4gICAgICAobnMgPSBcIlwiICsgXCIwXCIgKyBucywgbG9vcCkgOlxuICAgICAgbnM7XG4gICAgfTtcbiAgICByZXR1cm4gcmVjdXI7XG4gIH0pKFwiXCIgKyBuKTtcbn07XG5cbnZhciBxdW90ZVN0cmluZyA9IGZ1bmN0aW9uIHF1b3RlU3RyaW5nKHMpIHtcbiAgcyA9IGpvaW4oXCJcXFxcXFxcIlwiLCBzcGxpdChzLCBcIlxcXCJcIikpO1xuICBzID0gam9pbihcIlxcXFxcXFxcXCIsIHNwbGl0KHMsIFwiXFxcXFwiKSk7XG4gIHMgPSBqb2luKFwiXFxcXGJcIiwgc3BsaXQocywgXCJcYlwiKSk7XG4gIHMgPSBqb2luKFwiXFxcXGZcIiwgc3BsaXQocywgXCJcZlwiKSk7XG4gIHMgPSBqb2luKFwiXFxcXG5cIiwgc3BsaXQocywgXCJcXG5cIikpO1xuICBzID0gam9pbihcIlxcXFxyXCIsIHNwbGl0KHMsIFwiXFxyXCIpKTtcbiAgcyA9IGpvaW4oXCJcXFxcdFwiLCBzcGxpdChzLCBcIlxcdFwiKSk7XG4gIHJldHVybiBcIlwiICsgXCJcXFwiXCIgKyBzICsgXCJcXFwiXCI7XG59O1xuZXhwb3J0cy5xdW90ZVN0cmluZyA9IHF1b3RlU3RyaW5nO1xuXG52YXIgcHJTdHIgPSBmdW5jdGlvbiBwclN0cih4KSB7XG4gIHJldHVybiBpc05pbCh4KSA/XG4gICAgXCJuaWxcIiA6XG4gIGlzS2V5d29yZCh4KSA/XG4gICAgbmFtZXNwYWNlKHgpID9cbiAgICAgIFwiXCIgKyBcIjpcIiArIChuYW1lc3BhY2UoeCkpICsgXCIvXCIgKyAobmFtZSh4KSkgOlxuICAgICAgXCJcIiArIFwiOlwiICsgKG5hbWUoeCkpIDpcbiAgaXNTdHJpbmcoeCkgP1xuICAgIHF1b3RlU3RyaW5nKHgpIDpcbiAgaXNEYXRlKHgpID9cbiAgICBcIlwiICsgXCIjaW5zdCBcXFwiXCIgKyAoeC5nZXRVVENGdWxsWWVhcigpKSArIFwiLVwiICsgKG5vcm1hbGl6ZShpbmMoeC5nZXRVVENNb250aCgpKSwgMikpICsgXCItXCIgKyAobm9ybWFsaXplKHguZ2V0VVRDRGF0ZSgpLCAyKSkgKyBcIlRcIiArIChub3JtYWxpemUoeC5nZXRVVENIb3VycygpLCAyKSkgKyBcIjpcIiArIChub3JtYWxpemUoeC5nZXRVVENNaW51dGVzKCksIDIpKSArIFwiOlwiICsgKG5vcm1hbGl6ZSh4LmdldFVUQ1NlY29uZHMoKSwgMikpICsgXCIuXCIgKyAobm9ybWFsaXplKHguZ2V0VVRDTWlsbGlzZWNvbmRzKCksIDMpKSArIFwiLVwiICsgXCIwMDowMFxcXCJcIiA6XG4gIGlzVmVjdG9yKHgpID9cbiAgICBcIlwiICsgXCJbXCIgKyAoam9pbihcIiBcIiwgbWFwKHByU3RyLCB2ZWMoeCkpKSkgKyBcIl1cIiA6XG4gIGlzRGljdGlvbmFyeSh4KSA/XG4gICAgXCJcIiArIFwie1wiICsgKGpvaW4oXCIsIFwiLCBtYXAoZnVuY3Rpb24ocGFpcikge1xuICAgICAgcmV0dXJuIFwiXCIgKyAocHJTdHIoZmlyc3QocGFpcikpKSArIFwiIFwiICsgKHByU3RyKHNlY29uZChwYWlyKSkpO1xuICAgIH0sIHgpKSkgKyBcIn1cIiA6XG4gIGlzU2VxdWVudGlhbCh4KSA/XG4gICAgXCJcIiArIFwiKFwiICsgKGpvaW4oXCIgXCIsIG1hcChwclN0ciwgdmVjKHgpKSkpICsgXCIpXCIgOlxuICBpc1JlUGF0dGVybih4KSA/XG4gICAgXCJcIiArIFwiI1xcXCJcIiArIChqb2luKFwiXFxcXC9cIiwgc3BsaXQoeC5zb3VyY2UsIFwiL1wiKSkpICsgXCJcXFwiXCIgOlxuICBcImVsc2VcIiA/XG4gICAgXCJcIiArIHggOlxuICAgIHZvaWQoMCk7XG59O1xuZXhwb3J0cy5wclN0ciA9IHByU3RyIiwidmFyIF9uc18gPSB7XG4gIFwiaWRcIjogXCJ3aXNwLnN0cmluZ1wiXG59O1xudmFyIHdpc3BfcnVudGltZSA9IHJlcXVpcmUoXCIuL3J1bnRpbWVcIik7XG52YXIgc3RyID0gd2lzcF9ydW50aW1lLnN0cjtcbnZhciBzdWJzID0gd2lzcF9ydW50aW1lLnN1YnM7XG52YXIgcmVNYXRjaGVzID0gd2lzcF9ydW50aW1lLnJlTWF0Y2hlcztcbnZhciBpc05pbCA9IHdpc3BfcnVudGltZS5pc05pbDtcbnZhciBpc1N0cmluZyA9IHdpc3BfcnVudGltZS5pc1N0cmluZzs7XG52YXIgd2lzcF9zZXF1ZW5jZSA9IHJlcXVpcmUoXCIuL3NlcXVlbmNlXCIpO1xudmFyIHZlYyA9IHdpc3Bfc2VxdWVuY2UudmVjO1xudmFyIGlzRW1wdHkgPSB3aXNwX3NlcXVlbmNlLmlzRW1wdHk7OztcblxudmFyIHNwbGl0ID0gZnVuY3Rpb24gc3BsaXQoc3RyaW5nLCBwYXR0ZXJuLCBsaW1pdCkge1xuICByZXR1cm4gc3RyaW5nLnNwbGl0KHBhdHRlcm4sIGxpbWl0KTtcbn07XG5leHBvcnRzLnNwbGl0ID0gc3BsaXQ7XG5cbnZhciBqb2luID0gZnVuY3Rpb24gam9pbihzZXBhcmF0b3IsIGNvbGwpIHtcbiAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgY2FzZSAxOlxuICAgICAgdmFyIGNvbGwgPSBzZXBhcmF0b3I7XG4gICAgICByZXR1cm4gc3RyLmFwcGx5KHN0ciwgdmVjKGNvbGwpKTtcbiAgICBjYXNlIDI6XG4gICAgICByZXR1cm4gdmVjKGNvbGwpLmpvaW4oc2VwYXJhdG9yKTtcblxuICAgIGRlZmF1bHQ6XG4gICAgICAoZnVuY3Rpb24oKSB7IHRocm93IEVycm9yKFwiSW52YWxpZCBhcml0eVwiKTsgfSkoKVxuICB9O1xuICByZXR1cm4gdm9pZCgwKTtcbn07XG5leHBvcnRzLmpvaW4gPSBqb2luO1xuXG52YXIgdXBwZXJDYXNlID0gZnVuY3Rpb24gdXBwZXJDYXNlKHN0cmluZykge1xuICByZXR1cm4gc3RyaW5nLnRvVXBwZXJDYXNlKCk7XG59O1xuZXhwb3J0cy51cHBlckNhc2UgPSB1cHBlckNhc2U7XG5cbnZhciB1cHBlckNhc2UgPSBmdW5jdGlvbiB1cHBlckNhc2Uoc3RyaW5nKSB7XG4gIHJldHVybiBzdHJpbmcudG9VcHBlckNhc2UoKTtcbn07XG5leHBvcnRzLnVwcGVyQ2FzZSA9IHVwcGVyQ2FzZTtcblxudmFyIGxvd2VyQ2FzZSA9IGZ1bmN0aW9uIGxvd2VyQ2FzZShzdHJpbmcpIHtcbiAgcmV0dXJuIHN0cmluZy50b0xvd2VyQ2FzZSgpO1xufTtcbmV4cG9ydHMubG93ZXJDYXNlID0gbG93ZXJDYXNlO1xuXG52YXIgY2FwaXRhbGl6ZSA9IGZ1bmN0aW9uIGNhcGl0YWxpemUoc3RyaW5nKSB7XG4gIHJldHVybiBjb3VudChzdHJpbmcpIDwgMiA/XG4gICAgdXBwZXJDYXNlKHN0cmluZykgOlxuICAgIFwiXCIgKyAodXBwZXJDYXNlKHN1YnMocywgMCwgMSkpKSArIChsb3dlckNhc2Uoc3VicyhzLCAxKSkpO1xufTtcbmV4cG9ydHMuY2FwaXRhbGl6ZSA9IGNhcGl0YWxpemU7XG5cbnZhciByZXBsYWNlID0gZnVuY3Rpb24gcmVwbGFjZShzdHJpbmcsIG1hdGNoLCByZXBsYWNlbWVudCkge1xuICByZXR1cm4gc3RyaW5nLnJlcGxhY2UobWF0Y2gsIHJlcGxhY2VtZW50KTtcbn07XG5leHBvcnRzLnJlcGxhY2UgPSByZXBsYWNlO1xuXG52YXIgX19MRUZUU1BBQ0VTX18gPSAvXlxcc1xccyovO1xuZXhwb3J0cy5fX0xFRlRTUEFDRVNfXyA9IF9fTEVGVFNQQUNFU19fO1xuXG52YXIgX19SSUdIVFNQQUNFU19fID0gL1xcc1xccyokLztcbmV4cG9ydHMuX19SSUdIVFNQQUNFU19fID0gX19SSUdIVFNQQUNFU19fO1xuXG52YXIgX19TUEFDRVNfXyA9IC9eXFxzXFxzKiQvO1xuZXhwb3J0cy5fX1NQQUNFU19fID0gX19TUEFDRVNfXztcblxudmFyIHRyaW1sID0gaXNOaWwoXCJcIi50cmltTGVmdCkgP1xuICBmdW5jdGlvbihzdHJpbmcpIHtcbiAgICByZXR1cm4gc3RyaW5nLnJlcGxhY2UoX19MRUZUU1BBQ0VTX18sIFwiXCIpO1xuICB9IDpcbiAgZnVuY3Rpb24gdHJpbWwoc3RyaW5nKSB7XG4gICAgcmV0dXJuIHN0cmluZy50cmltTGVmdCgpO1xuICB9O1xuZXhwb3J0cy50cmltbCA9IHRyaW1sO1xuXG52YXIgdHJpbXIgPSBpc05pbChcIlwiLnRyaW1SaWdodCkgP1xuICBmdW5jdGlvbihzdHJpbmcpIHtcbiAgICByZXR1cm4gc3RyaW5nLnJlcGxhY2UoX19SSUdIVFNQQUNFU19fLCBcIlwiKTtcbiAgfSA6XG4gIGZ1bmN0aW9uIHRyaW1yKHN0cmluZykge1xuICAgIHJldHVybiBzdHJpbmcudHJpbVJpZ2h0KCk7XG4gIH07XG5leHBvcnRzLnRyaW1yID0gdHJpbXI7XG5cbnZhciB0cmltID0gaXNOaWwoXCJcIi50cmltKSA/XG4gIGZ1bmN0aW9uKHN0cmluZykge1xuICAgIHJldHVybiBzdHJpbmcucmVwbGFjZShfX0xFRlRTUEFDRVNfXykucmVwbGFjZShfX1JJR0hUU1BBQ0VTX18pO1xuICB9IDpcbiAgZnVuY3Rpb24gdHJpbShzdHJpbmcpIHtcbiAgICByZXR1cm4gc3RyaW5nLnRyaW0oKTtcbiAgfTtcbmV4cG9ydHMudHJpbSA9IHRyaW07XG5cbnZhciBpc0JsYW5rID0gZnVuY3Rpb24gaXNCbGFuayhzdHJpbmcpIHtcbiAgcmV0dXJuIChpc05pbChzdHJpbmcpKSB8fCAoaXNFbXB0eShzdHJpbmcpKSB8fCAocmVNYXRjaGVzKF9fU1BBQ0VTX18sIHN0cmluZykpO1xufTtcbmV4cG9ydHMuaXNCbGFuayA9IGlzQmxhbmsiLCJ2YXIgX25zXyA9IHtcbiAgXCJpZFwiOiBcIndpc3AuYmFja2VuZC5qYXZhc2NyaXB0LndyaXRlclwiLFxuICBcImRvY1wiOiBcIkNvbXBpbGVyIGJhY2tlbmQgZm9yIGZvciB3cml0aW5nIEpTIG91dHB1dFwiXG59O1xudmFyIHdpc3BfYXN0ID0gcmVxdWlyZShcIi4vLi4vLi4vYXN0XCIpO1xudmFyIG5hbWUgPSB3aXNwX2FzdC5uYW1lO1xudmFyIG5hbWVzcGFjZSA9IHdpc3BfYXN0Lm5hbWVzcGFjZTtcbnZhciBzeW1ib2wgPSB3aXNwX2FzdC5zeW1ib2w7XG52YXIgaXNTeW1ib2wgPSB3aXNwX2FzdC5pc1N5bWJvbDtcbnZhciBpc0tleXdvcmQgPSB3aXNwX2FzdC5pc0tleXdvcmQ7O1xudmFyIHdpc3Bfc2VxdWVuY2UgPSByZXF1aXJlKFwiLi8uLi8uLi9zZXF1ZW5jZVwiKTtcbnZhciBsaXN0ID0gd2lzcF9zZXF1ZW5jZS5saXN0O1xudmFyIGZpcnN0ID0gd2lzcF9zZXF1ZW5jZS5maXJzdDtcbnZhciByZXN0ID0gd2lzcF9zZXF1ZW5jZS5yZXN0O1xudmFyIGlzTGlzdCA9IHdpc3Bfc2VxdWVuY2UuaXNMaXN0O1xudmFyIHZlYyA9IHdpc3Bfc2VxdWVuY2UudmVjO1xudmFyIG1hcCA9IHdpc3Bfc2VxdWVuY2UubWFwO1xudmFyIGNvdW50ID0gd2lzcF9zZXF1ZW5jZS5jb3VudDtcbnZhciBsYXN0ID0gd2lzcF9zZXF1ZW5jZS5sYXN0O1xudmFyIHJlZHVjZSA9IHdpc3Bfc2VxdWVuY2UucmVkdWNlO1xudmFyIGlzRW1wdHkgPSB3aXNwX3NlcXVlbmNlLmlzRW1wdHk7O1xudmFyIHdpc3BfcnVudGltZSA9IHJlcXVpcmUoXCIuLy4uLy4uL3J1bnRpbWVcIik7XG52YXIgaXNUcnVlID0gd2lzcF9ydW50aW1lLmlzVHJ1ZTtcbnZhciBpc05pbCA9IHdpc3BfcnVudGltZS5pc05pbDtcbnZhciBpc1N0cmluZyA9IHdpc3BfcnVudGltZS5pc1N0cmluZztcbnZhciBpc051bWJlciA9IHdpc3BfcnVudGltZS5pc051bWJlcjtcbnZhciBpc1ZlY3RvciA9IHdpc3BfcnVudGltZS5pc1ZlY3RvcjtcbnZhciBpc0RpY3Rpb25hcnkgPSB3aXNwX3J1bnRpbWUuaXNEaWN0aW9uYXJ5O1xudmFyIGlzQm9vbGVhbiA9IHdpc3BfcnVudGltZS5pc0Jvb2xlYW47XG52YXIgaXNSZVBhdHRlcm4gPSB3aXNwX3J1bnRpbWUuaXNSZVBhdHRlcm47XG52YXIgcmVGaW5kID0gd2lzcF9ydW50aW1lLnJlRmluZDtcbnZhciBkZWMgPSB3aXNwX3J1bnRpbWUuZGVjO1xudmFyIHN1YnMgPSB3aXNwX3J1bnRpbWUuc3Viczs7XG52YXIgd2lzcF9zdHJpbmcgPSByZXF1aXJlKFwiLi8uLi8uLi9zdHJpbmdcIik7XG52YXIgcmVwbGFjZSA9IHdpc3Bfc3RyaW5nLnJlcGxhY2U7XG52YXIgam9pbiA9IHdpc3Bfc3RyaW5nLmpvaW47XG52YXIgc3BsaXQgPSB3aXNwX3N0cmluZy5zcGxpdDtcbnZhciB1cHBlckNhc2UgPSB3aXNwX3N0cmluZy51cHBlckNhc2U7OztcblxudmFyIHdyaXRlUmVmZXJlbmNlID0gZnVuY3Rpb24gd3JpdGVSZWZlcmVuY2UoZm9ybSkge1xuICBcIlRyYW5zbGF0ZXMgcmVmZXJlbmNlcyBmcm9tIGNsb2p1cmUgY29udmVudGlvbiB0byBKUzpcXG5cXG4gICoqbWFjcm9zKiogICAgICBfX21hY3Jvc19fXFxuICBsaXN0LT52ZWN0b3IgICAgbGlzdFRvVmVjdG9yXFxuICBzZXQhICAgICAgICAgICAgc2V0XFxuICBmb29fYmFyICAgICAgICAgZm9vX2JhclxcbiAgbnVtYmVyPyAgICAgICAgIGlzTnVtYmVyXFxuICBjcmVhdGUtc2VydmVyICAgY3JlYXRlU2VydmVyXCI7XG4gIHJldHVybiAoZnVuY3Rpb24oKSB7XG4gICAgdmFyIGlkID0gbmFtZShmb3JtKTtcbiAgICBpZCA9IGlkID09PSBcIipcIiA/XG4gICAgICBcIm11bHRpcGx5XCIgOlxuICAgIGlkID09PSBcIi9cIiA/XG4gICAgICBcImRpdmlkZVwiIDpcbiAgICBpZCA9PT0gXCIrXCIgP1xuICAgICAgXCJzdW1cIiA6XG4gICAgaWQgPT09IFwiLVwiID9cbiAgICAgIFwic3VidHJhY3RcIiA6XG4gICAgaWQgPT09IFwiPVwiID9cbiAgICAgIFwiZXF1YWw/XCIgOlxuICAgIGlkID09PSBcIj09XCIgP1xuICAgICAgXCJzdHJpY3QtZXF1YWw/XCIgOlxuICAgIGlkID09PSBcIjw9XCIgP1xuICAgICAgXCJub3QtZ3JlYXRlci10aGFuXCIgOlxuICAgIGlkID09PSBcIj49XCIgP1xuICAgICAgXCJub3QtbGVzcy10aGFuXCIgOlxuICAgIGlkID09PSBcIj5cIiA/XG4gICAgICBcImdyZWF0ZXItdGhhblwiIDpcbiAgICBpZCA9PT0gXCI8XCIgP1xuICAgICAgXCJsZXNzLXRoYW5cIiA6XG4gICAgXCJlbHNlXCIgP1xuICAgICAgaWQgOlxuICAgICAgdm9pZCgwKTtcbiAgICBpZCA9IGpvaW4oXCJfXCIsIHNwbGl0KGlkLCBcIipcIikpO1xuICAgIGlkID0gam9pbihcIi10by1cIiwgc3BsaXQoaWQsIFwiLT5cIikpO1xuICAgIGlkID0gam9pbihzcGxpdChpZCwgXCIhXCIpKTtcbiAgICBpZCA9IGpvaW4oXCIkXCIsIHNwbGl0KGlkLCBcIiVcIikpO1xuICAgIGlkID0gam9pbihcIi1wbHVzLVwiLCBzcGxpdChpZCwgXCIrXCIpKTtcbiAgICBpZCA9IGpvaW4oXCItYW5kLVwiLCBzcGxpdChpZCwgXCImXCIpKTtcbiAgICBpZCA9IGxhc3QoaWQpID09PSBcIj9cIiA/XG4gICAgICBcIlwiICsgXCJpcy1cIiArIChzdWJzKGlkLCAwLCBkZWMoY291bnQoaWQpKSkpIDpcbiAgICAgIGlkO1xuICAgIGlkID0gcmVkdWNlKGZ1bmN0aW9uKHJlc3VsdCwga2V5KSB7XG4gICAgICByZXR1cm4gXCJcIiArIHJlc3VsdCArICgoIShpc0VtcHR5KHJlc3VsdCkpKSAmJiAoIShpc0VtcHR5KGtleSkpKSA/XG4gICAgICAgIFwiXCIgKyAodXBwZXJDYXNlKChrZXkgfHwgMClbMF0pKSArIChzdWJzKGtleSwgMSkpIDpcbiAgICAgICAga2V5KTtcbiAgICB9LCBcIlwiLCBzcGxpdChpZCwgXCItXCIpKTtcbiAgICByZXR1cm4gaWQ7XG4gIH0pKCk7XG59O1xuZXhwb3J0cy53cml0ZVJlZmVyZW5jZSA9IHdyaXRlUmVmZXJlbmNlO1xuXG52YXIgd3JpdGVLZXl3b3JkUmVmZXJlbmNlID0gZnVuY3Rpb24gd3JpdGVLZXl3b3JkUmVmZXJlbmNlKGZvcm0pIHtcbiAgcmV0dXJuIFwiXCIgKyBcIlxcXCJcIiArIChuYW1lKGZvcm0pKSArIFwiXFxcIlwiO1xufTtcbmV4cG9ydHMud3JpdGVLZXl3b3JkUmVmZXJlbmNlID0gd3JpdGVLZXl3b3JkUmVmZXJlbmNlO1xuXG52YXIgd3JpdGVLZXl3b3JkID0gZnVuY3Rpb24gd3JpdGVLZXl3b3JkKGZvcm0pIHtcbiAgcmV0dXJuIFwiXCIgKyBcIlxcXCJcIiArIFwi6p6JXCIgKyAobmFtZShmb3JtKSkgKyBcIlxcXCJcIjtcbn07XG5leHBvcnRzLndyaXRlS2V5d29yZCA9IHdyaXRlS2V5d29yZDtcblxudmFyIHdyaXRlU3ltYm9sID0gZnVuY3Rpb24gd3JpdGVTeW1ib2woZm9ybSkge1xuICByZXR1cm4gd3JpdGUobGlzdChzeW1ib2wodm9pZCgwKSwgXCJzeW1ib2xcIiksIG5hbWVzcGFjZShmb3JtKSwgbmFtZShmb3JtKSkpO1xufTtcbmV4cG9ydHMud3JpdGVTeW1ib2wgPSB3cml0ZVN5bWJvbDtcblxudmFyIHdyaXRlTmlsID0gZnVuY3Rpb24gd3JpdGVOaWwoZm9ybSkge1xuICByZXR1cm4gXCJ2b2lkKDApXCI7XG59O1xuZXhwb3J0cy53cml0ZU5pbCA9IHdyaXRlTmlsO1xuXG52YXIgd3JpdGVOdW1iZXIgPSBmdW5jdGlvbiB3cml0ZU51bWJlcihmb3JtKSB7XG4gIHJldHVybiBmb3JtO1xufTtcbmV4cG9ydHMud3JpdGVOdW1iZXIgPSB3cml0ZU51bWJlcjtcblxudmFyIHdyaXRlQm9vbGVhbiA9IGZ1bmN0aW9uIHdyaXRlQm9vbGVhbihmb3JtKSB7XG4gIHJldHVybiBpc1RydWUoZm9ybSkgP1xuICAgIFwidHJ1ZVwiIDpcbiAgICBcImZhbHNlXCI7XG59O1xuZXhwb3J0cy53cml0ZUJvb2xlYW4gPSB3cml0ZUJvb2xlYW47XG5cbnZhciB3cml0ZVN0cmluZyA9IGZ1bmN0aW9uIHdyaXRlU3RyaW5nKGZvcm0pIHtcbiAgZm9ybSA9IHJlcGxhY2UoZm9ybSwgUmVnRXhwKFwiXFxcXFxcXFxcIiwgXCJnXCIpLCBcIlxcXFxcXFxcXCIpO1xuICBmb3JtID0gcmVwbGFjZShmb3JtLCBSZWdFeHAoXCJcXG5cIiwgXCJnXCIpLCBcIlxcXFxuXCIpO1xuICBmb3JtID0gcmVwbGFjZShmb3JtLCBSZWdFeHAoXCJcXHJcIiwgXCJnXCIpLCBcIlxcXFxyXCIpO1xuICBmb3JtID0gcmVwbGFjZShmb3JtLCBSZWdFeHAoXCJcXHRcIiwgXCJnXCIpLCBcIlxcXFx0XCIpO1xuICBmb3JtID0gcmVwbGFjZShmb3JtLCBSZWdFeHAoXCJcXFwiXCIsIFwiZ1wiKSwgXCJcXFxcXFxcIlwiKTtcbiAgcmV0dXJuIFwiXCIgKyBcIlxcXCJcIiArIGZvcm0gKyBcIlxcXCJcIjtcbn07XG5leHBvcnRzLndyaXRlU3RyaW5nID0gd3JpdGVTdHJpbmc7XG5cbnZhciB3cml0ZVRlbXBsYXRlID0gZnVuY3Rpb24gd3JpdGVUZW1wbGF0ZSgpIHtcbiAgdmFyIGZvcm0gPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDApO1xuICByZXR1cm4gKGZ1bmN0aW9uKCkge1xuICAgIHZhciBpbmRlbnRQYXR0ZXJuID0gL1xcbiAqJC87XG4gICAgdmFyIGxpbmVCcmVha1BhdHRlciA9IFJlZ0V4cChcIlxcblwiLCBcImdcIik7XG4gICAgdmFyIGdldEluZGVudGF0aW9uID0gZnVuY3Rpb24oY29kZSkge1xuICAgICAgcmV0dXJuIChyZUZpbmQoaW5kZW50UGF0dGVybiwgY29kZSkpIHx8IFwiXFxuXCI7XG4gICAgfTtcbiAgICByZXR1cm4gKGZ1bmN0aW9uIGxvb3AoY29kZSwgcGFydHMsIHZhbHVlcykge1xuICAgICAgdmFyIHJlY3VyID0gbG9vcDtcbiAgICAgIHdoaWxlIChyZWN1ciA9PT0gbG9vcCkge1xuICAgICAgICByZWN1ciA9IGNvdW50KHBhcnRzKSA+IDEgP1xuICAgICAgICAoY29kZSA9IFwiXCIgKyBjb2RlICsgKGZpcnN0KHBhcnRzKSkgKyAocmVwbGFjZShcIlwiICsgXCJcIiArIChmaXJzdCh2YWx1ZXMpKSwgbGluZUJyZWFrUGF0dGVyLCBnZXRJbmRlbnRhdGlvbihmaXJzdChwYXJ0cykpKSksIHBhcnRzID0gcmVzdChwYXJ0cyksIHZhbHVlcyA9IHJlc3QodmFsdWVzKSwgbG9vcCkgOlxuICAgICAgICBcIlwiICsgY29kZSArIChmaXJzdChwYXJ0cykpO1xuICAgICAgfTtcbiAgICAgIHJldHVybiByZWN1cjtcbiAgICB9KShcIlwiLCBzcGxpdChmaXJzdChmb3JtKSwgXCJ+e31cIiksIHJlc3QoZm9ybSkpO1xuICB9KSgpO1xufTtcbmV4cG9ydHMud3JpdGVUZW1wbGF0ZSA9IHdyaXRlVGVtcGxhdGU7XG5cbnZhciB3cml0ZUdyb3VwID0gZnVuY3Rpb24gd3JpdGVHcm91cCgpIHtcbiAgdmFyIGZvcm1zID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKTtcbiAgcmV0dXJuIGpvaW4oXCIsIFwiLCBmb3Jtcyk7XG59O1xuZXhwb3J0cy53cml0ZUdyb3VwID0gd3JpdGVHcm91cDtcblxudmFyIHdyaXRlSW52b2tlID0gZnVuY3Rpb24gd3JpdGVJbnZva2UoY2FsbGVlKSB7XG4gIHZhciBwYXJhbXMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICByZXR1cm4gd3JpdGVUZW1wbGF0ZShcIn57fSh+e30pXCIsIGNhbGxlZSwgd3JpdGVHcm91cC5hcHBseSh3cml0ZUdyb3VwLCBwYXJhbXMpKTtcbn07XG5leHBvcnRzLndyaXRlSW52b2tlID0gd3JpdGVJbnZva2U7XG5cbnZhciB3cml0ZUVycm9yID0gZnVuY3Rpb24gd3JpdGVFcnJvcihtZXNzYWdlKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gKGZ1bmN0aW9uKCkgeyB0aHJvdyBFcnJvcihtZXNzYWdlKTsgfSkoKTtcbiAgfTtcbn07XG5leHBvcnRzLndyaXRlRXJyb3IgPSB3cml0ZUVycm9yO1xuXG52YXIgd3JpdGVWZWN0b3IgPSB3cml0ZUVycm9yKFwiVmVjdG9ycyBhcmUgbm90IHN1cHBvcnRlZFwiKTtcbmV4cG9ydHMud3JpdGVWZWN0b3IgPSB3cml0ZVZlY3RvcjtcblxudmFyIHdyaXRlRGljdGlvbmFyeSA9IHdyaXRlRXJyb3IoXCJEaWN0aW9uYXJpZXMgYXJlIG5vdCBzdXBwb3J0ZWRcIik7XG5leHBvcnRzLndyaXRlRGljdGlvbmFyeSA9IHdyaXRlRGljdGlvbmFyeTtcblxudmFyIHdyaXRlUGF0dGVybiA9IHdyaXRlRXJyb3IoXCJSZWd1bGFyIGV4cHJlc3Npb25zIGFyZSBub3Qgc3VwcG9ydGVkXCIpO1xuZXhwb3J0cy53cml0ZVBhdHRlcm4gPSB3cml0ZVBhdHRlcm47XG5cbnZhciBjb21waWxlQ29tbWVudCA9IGZ1bmN0aW9uIGNvbXBpbGVDb21tZW50KGZvcm0pIHtcbiAgcmV0dXJuIGNvbXBpbGVUZW1wbGF0ZShsaXN0KFwiLy9+e31cXG5cIiwgZmlyc3QoZm9ybSkpKTtcbn07XG5leHBvcnRzLmNvbXBpbGVDb21tZW50ID0gY29tcGlsZUNvbW1lbnQ7XG5cbnZhciB3cml0ZURlZiA9IGZ1bmN0aW9uIHdyaXRlRGVmKGZvcm0pIHtcbiAgdmFyIGlkID0gZmlyc3QoZm9ybSk7XG4gIHZhciBpc0V4cG9ydCA9ICgoKChtZXRhKGZvcm0pKSB8fCB7fSkgfHwgMClbXCJ0b3BcIl0pICYmICghKCgoKG1ldGEoaWQpKSB8fCB7fSkgfHwgMClbXCJwcml2YXRlXCJdKSk7XG4gIHZhciBhdHRyaWJ1dGUgPSBzeW1ib2wobmFtZXNwYWNlKGlkKSwgXCJcIiArIFwiLVwiICsgKG5hbWUoaWQpKSk7XG4gIHJldHVybiBpc0V4cG9ydCA/XG4gICAgY29tcGlsZVRlbXBsYXRlKGxpc3QoXCJ2YXIgfnt9O1xcbn57fVwiLCBjb21waWxlKGNvbnMoc3ltYm9sKHZvaWQoMCksIFwic2V0IVwiKSwgZm9ybSkpLCBjb21waWxlKGxpc3Qoc3ltYm9sKHZvaWQoMCksIFwic2V0IVwiKSwgbGlzdChzeW1ib2wodm9pZCgwKSwgXCIuXCIpLCBzeW1ib2wodm9pZCgwKSwgXCJleHBvcnRzXCIpLCBhdHRyaWJ1dGUpLCBpZCkpKSkgOlxuICAgIGNvbXBpbGVUZW1wbGF0ZShsaXN0KFwidmFyIH57fVwiLCBjb21waWxlKGNvbnMoc3ltYm9sKHZvaWQoMCksIFwic2V0IVwiKSwgZm9ybSkpKSk7XG59O1xuZXhwb3J0cy53cml0ZURlZiA9IHdyaXRlRGVmO1xuXG52YXIgd3JpdGUgPSBmdW5jdGlvbiB3cml0ZShmb3JtKSB7XG4gIHJldHVybiBpc05pbChmb3JtKSA/XG4gICAgd3JpdGVOaWwoZm9ybSkgOlxuICBpc1N5bWJvbChmb3JtKSA/XG4gICAgd3JpdGVSZWZlcmVuY2UoZm9ybSkgOlxuICBpc0tleXdvcmQoZm9ybSkgP1xuICAgIHdyaXRlS2V5d29yZFJlZmVyZW5jZShmb3JtKSA6XG4gIGlzU3RyaW5nKGZvcm0pID9cbiAgICB3cml0ZVN0cmluZyhmb3JtKSA6XG4gIGlzTnVtYmVyKGZvcm0pID9cbiAgICB3cml0ZU51bWJlcihmb3JtKSA6XG4gIGlzQm9vbGVhbihmb3JtKSA/XG4gICAgd3JpdGVCb29sZWFuKGZvcm0pIDpcbiAgaXNSZVBhdHRlcm4oZm9ybSkgP1xuICAgIHdyaXRlUGF0dGVybihmb3JtKSA6XG4gIGlzVmVjdG9yKGZvcm0pID9cbiAgICB3cml0ZVZlY3Rvcihmb3JtKSA6XG4gIGlzRGljdGlvbmFyeShmb3JtKSA/XG4gICAgd3JpdGVEaWN0aW9uYXJ5KCkgOlxuICBpc0xpc3QoZm9ybSkgP1xuICAgIHdyaXRlSW52b2tlLmFwcGx5KHdyaXRlSW52b2tlLCBtYXAod3JpdGUsIHZlYyhmb3JtKSkpIDpcbiAgXCJlbHNlXCIgP1xuICAgIHdyaXRlRXJyb3IoXCJVbnN1cHBvcnRlZCBmb3JtXCIpIDpcbiAgICB2b2lkKDApO1xufTtcbmV4cG9ydHMud3JpdGUgPSB3cml0ZSJdfQ==
;