require=(function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0].call(u.exports,function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({"wisp/sequence":[function(require,module,exports){
module.exports=require('wSrw64');
},{}],"wSrw64":[function(require,module,exports){
var _ns_ = "wisp.sequence";
module.namespace = _ns_;
var isNil = (require("./runtime")).isNil;
var isVector = (require("./runtime")).isVector;
var isFn = (require("./runtime")).isFn;
var isNumber = (require("./runtime")).isNumber;
var isString = (require("./runtime")).isString;
var isDictionary = (require("./runtime")).isDictionary;
var keyValues = (require("./runtime")).keyValues;
var str = (require("./runtime")).str;
var dec = (require("./runtime")).dec;
var inc = (require("./runtime")).inc;
var merge = (require("./runtime")).merge;
var dictionary = (require("./runtime")).dictionary;;

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

},{"./runtime":1}],"wisp/string":[function(require,module,exports){
module.exports=require('WjNYv/');
},{}],"WjNYv/":[function(require,module,exports){
var _ns_ = "wisp.string";
module.namespace = _ns_;
var str = (require("./runtime")).str;
var subs = (require("./runtime")).subs;
var reMatches = (require("./runtime")).reMatches;
var isNil = (require("./runtime")).isNil;
var isString = (require("./runtime")).isString;
var vec = (require("./sequence")).vec;
var isEmpty = (require("./sequence")).isEmpty;;

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

},{"./runtime":1,"./sequence":"wSrw64"}],2:[function(require,module,exports){
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
},{"./../runtime":3,"./../sequence":4,"./../reader":5,"./../compiler":6}],1:[function(require,module,exports){
(function(){var _ns_ = "wisp.runtime";
module.namespace = _ns_;
module.description = "Core primitives required for runtime";;

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
},{}],4:[function(require,module,exports){
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
},{"./runtime":3}],5:[function(require,module,exports){
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
},{"./sequence":4,"./runtime":3,"./ast":7,"./string":8}],6:[function(require,module,exports){
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
},{"./reader":5,"./ast":7,"./sequence":4,"./runtime":3,"./string":8,"./backend/javascript/writer":9}],7:[function(require,module,exports){
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
},{"./sequence":4,"./string":8,"./runtime":3}],8:[function(require,module,exports){
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
},{"./runtime":3,"./sequence":4}],9:[function(require,module,exports){
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
},{"./../../ast":7,"./../../sequence":4,"./../../runtime":3,"./../../string":8}]},{},[2])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvcmNhcm1vL0RldmVsb3BtZW50L2NvbS5naXRodWIucmNhcm1vLndpc3Avbm9kZV9tb2R1bGVzL3dpc3Avc2VxdWVuY2UuanMiLCIvVXNlcnMvcmNhcm1vL0RldmVsb3BtZW50L2NvbS5naXRodWIucmNhcm1vLndpc3Avbm9kZV9tb2R1bGVzL3dpc3Avc3RyaW5nLmpzIiwiL1VzZXJzL3JjYXJtby9EZXZlbG9wbWVudC9jb20uZ2l0aHViLnJjYXJtby53aXNwL2VuZ2luZS9icm93c2VyLmpzIiwiL1VzZXJzL3JjYXJtby9EZXZlbG9wbWVudC9jb20uZ2l0aHViLnJjYXJtby53aXNwL25vZGVfbW9kdWxlcy93aXNwL3J1bnRpbWUuanMiLCIvVXNlcnMvcmNhcm1vL0RldmVsb3BtZW50L2NvbS5naXRodWIucmNhcm1vLndpc3AvcnVudGltZS5qcyIsIi9Vc2Vycy9yY2FybW8vRGV2ZWxvcG1lbnQvY29tLmdpdGh1Yi5yY2FybW8ud2lzcC9zZXF1ZW5jZS5qcyIsIi9Vc2Vycy9yY2FybW8vRGV2ZWxvcG1lbnQvY29tLmdpdGh1Yi5yY2FybW8ud2lzcC9yZWFkZXIuanMiLCIvVXNlcnMvcmNhcm1vL0RldmVsb3BtZW50L2NvbS5naXRodWIucmNhcm1vLndpc3AvY29tcGlsZXIuanMiLCIvVXNlcnMvcmNhcm1vL0RldmVsb3BtZW50L2NvbS5naXRodWIucmNhcm1vLndpc3AvYXN0LmpzIiwiL1VzZXJzL3JjYXJtby9EZXZlbG9wbWVudC9jb20uZ2l0aHViLnJjYXJtby53aXNwL3N0cmluZy5qcyIsIi9Vc2Vycy9yY2FybW8vRGV2ZWxvcG1lbnQvY29tLmdpdGh1Yi5yY2FybW8ud2lzcC9iYWNrZW5kL2phdmFzY3JpcHQvd3JpdGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNsakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0bUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0bUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbnhCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDek5BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25HQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbInZhciBfbnNfID0gXCJ3aXNwLnNlcXVlbmNlXCI7XG5tb2R1bGUubmFtZXNwYWNlID0gX25zXztcbnZhciBpc05pbCA9IChyZXF1aXJlKFwiLi9ydW50aW1lXCIpKS5pc05pbDtcbnZhciBpc1ZlY3RvciA9IChyZXF1aXJlKFwiLi9ydW50aW1lXCIpKS5pc1ZlY3RvcjtcbnZhciBpc0ZuID0gKHJlcXVpcmUoXCIuL3J1bnRpbWVcIikpLmlzRm47XG52YXIgaXNOdW1iZXIgPSAocmVxdWlyZShcIi4vcnVudGltZVwiKSkuaXNOdW1iZXI7XG52YXIgaXNTdHJpbmcgPSAocmVxdWlyZShcIi4vcnVudGltZVwiKSkuaXNTdHJpbmc7XG52YXIgaXNEaWN0aW9uYXJ5ID0gKHJlcXVpcmUoXCIuL3J1bnRpbWVcIikpLmlzRGljdGlvbmFyeTtcbnZhciBrZXlWYWx1ZXMgPSAocmVxdWlyZShcIi4vcnVudGltZVwiKSkua2V5VmFsdWVzO1xudmFyIHN0ciA9IChyZXF1aXJlKFwiLi9ydW50aW1lXCIpKS5zdHI7XG52YXIgZGVjID0gKHJlcXVpcmUoXCIuL3J1bnRpbWVcIikpLmRlYztcbnZhciBpbmMgPSAocmVxdWlyZShcIi4vcnVudGltZVwiKSkuaW5jO1xudmFyIG1lcmdlID0gKHJlcXVpcmUoXCIuL3J1bnRpbWVcIikpLm1lcmdlO1xudmFyIGRpY3Rpb25hcnkgPSAocmVxdWlyZShcIi4vcnVudGltZVwiKSkuZGljdGlvbmFyeTs7XG5cbnZhciBMaXN0ID0gZnVuY3Rpb24gTGlzdChoZWFkLCB0YWlsKSB7XG4gIHRoaXMuaGVhZCA9IGhlYWQ7XG4gIHRoaXMudGFpbCA9IHRhaWwgfHwgKGxpc3QoKSk7XG4gIHRoaXMubGVuZ3RoID0gaW5jKGNvdW50KHRoaXMudGFpbCkpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbkxpc3QucHJvdG90eXBlLmxlbmd0aCA9IDA7XG5cbkxpc3QudHlwZSA9IFwid2lzcC5saXN0XCI7XG5cbkxpc3QucHJvdG90eXBlLnR5cGUgPSBMaXN0LnR5cGU7XG5cbkxpc3QucHJvdG90eXBlLnRhaWwgPSBPYmplY3QuY3JlYXRlKExpc3QucHJvdG90eXBlKTtcblxuTGlzdC5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIChmdW5jdGlvbiBsb29wKHJlc3VsdCwgbGlzdCkge1xuICAgIHZhciByZWN1ciA9IGxvb3A7XG4gICAgd2hpbGUgKHJlY3VyID09PSBsb29wKSB7XG4gICAgICByZWN1ciA9IGlzRW1wdHkobGlzdCkgP1xuICAgICAgXCJcIiArIFwiKFwiICsgKHJlc3VsdC5zdWJzdHIoMSkpICsgXCIpXCIgOlxuICAgICAgKHJlc3VsdCA9IFwiXCIgKyByZXN1bHQgKyBcIiBcIiArIChpc1ZlY3RvcihmaXJzdChsaXN0KSkgP1xuICAgICAgICBcIlwiICsgXCJbXCIgKyAoZmlyc3QobGlzdCkuam9pbihcIiBcIikpICsgXCJdXCIgOlxuICAgICAgaXNOaWwoZmlyc3QobGlzdCkpID9cbiAgICAgICAgXCJuaWxcIiA6XG4gICAgICBpc1N0cmluZyhmaXJzdChsaXN0KSkgP1xuICAgICAgICBKU09OLnN0cmluZ2lmeShmaXJzdChsaXN0KSkgOlxuICAgICAgaXNOdW1iZXIoZmlyc3QobGlzdCkpID9cbiAgICAgICAgSlNPTi5zdHJpbmdpZnkoZmlyc3QobGlzdCkpIDpcbiAgICAgICAgZmlyc3QobGlzdCkpLCBsaXN0ID0gcmVzdChsaXN0KSwgbG9vcCk7XG4gICAgfTtcbiAgICByZXR1cm4gcmVjdXI7XG4gIH0pKFwiXCIsIHRoaXMpO1xufTtcblxudmFyIGxhenlTZXFWYWx1ZSA9IGZ1bmN0aW9uIGxhenlTZXFWYWx1ZShsYXp5U2VxKSB7XG4gIHJldHVybiAhKGxhenlTZXEucmVhbGl6ZWQpID9cbiAgICAobGF6eVNlcS5yZWFsaXplZCA9IHRydWUpICYmIChsYXp5U2VxLnggPSBsYXp5U2VxLngoKSkgOlxuICAgIGxhenlTZXEueDtcbn07XG5cbnZhciBMYXp5U2VxID0gZnVuY3Rpb24gTGF6eVNlcShyZWFsaXplZCwgeCkge1xuICB0aGlzLnJlYWxpemVkID0gcmVhbGl6ZWQgfHwgZmFsc2U7XG4gIHRoaXMueCA9IHg7XG4gIHJldHVybiB0aGlzO1xufTtcblxuTGF6eVNlcS50eXBlID0gXCJ3aXNwLmxhenkuc2VxXCI7XG5cbkxhenlTZXEucHJvdG90eXBlLnR5cGUgPSBMYXp5U2VxLnR5cGU7XG5cbnZhciBsYXp5U2VxID0gZnVuY3Rpb24gbGF6eVNlcShyZWFsaXplZCwgYm9keSkge1xuICByZXR1cm4gbmV3IExhenlTZXEocmVhbGl6ZWQsIGJvZHkpO1xufTtcbmV4cG9ydHMubGF6eVNlcSA9IGxhenlTZXE7XG5cbnZhciBpc0xhenlTZXEgPSBmdW5jdGlvbiBpc0xhenlTZXEodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlICYmIChMYXp5U2VxLnR5cGUgPT09IHZhbHVlLnR5cGUpO1xufTtcbmV4cG9ydHMuaXNMYXp5U2VxID0gaXNMYXp5U2VxO1xuXG51bmRlZmluZWQ7XG5cbnZhciBpc0xpc3QgPSBmdW5jdGlvbiBpc0xpc3QodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlICYmIChMaXN0LnR5cGUgPT09IHZhbHVlLnR5cGUpO1xufTtcbmV4cG9ydHMuaXNMaXN0ID0gaXNMaXN0O1xuXG52YXIgbGlzdCA9IGZ1bmN0aW9uIGxpc3QoKSB7XG4gIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID09PSAwID9cbiAgICBPYmplY3QuY3JlYXRlKExpc3QucHJvdG90eXBlKSA6XG4gICAgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKS5yZWR1Y2VSaWdodChmdW5jdGlvbih0YWlsLCBoZWFkKSB7XG4gICAgICByZXR1cm4gY29ucyhoZWFkLCB0YWlsKTtcbiAgICB9LCBsaXN0KCkpO1xufTtcbmV4cG9ydHMubGlzdCA9IGxpc3Q7XG5cbnZhciBjb25zID0gZnVuY3Rpb24gY29ucyhoZWFkLCB0YWlsKSB7XG4gIHJldHVybiBuZXcgTGlzdChoZWFkLCB0YWlsKTtcbn07XG5leHBvcnRzLmNvbnMgPSBjb25zO1xuXG52YXIgcmV2ZXJzZUxpc3QgPSBmdW5jdGlvbiByZXZlcnNlTGlzdChzZXF1ZW5jZSkge1xuICByZXR1cm4gKGZ1bmN0aW9uIGxvb3AoaXRlbXMsIHNvdXJjZSkge1xuICAgIHZhciByZWN1ciA9IGxvb3A7XG4gICAgd2hpbGUgKHJlY3VyID09PSBsb29wKSB7XG4gICAgICByZWN1ciA9IGlzRW1wdHkoc291cmNlKSA/XG4gICAgICBsaXN0LmFwcGx5KGxpc3QsIGl0ZW1zKSA6XG4gICAgICAoaXRlbXMgPSBbZmlyc3Qoc291cmNlKV0uY29uY2F0KGl0ZW1zKSwgc291cmNlID0gcmVzdChzb3VyY2UpLCBsb29wKTtcbiAgICB9O1xuICAgIHJldHVybiByZWN1cjtcbiAgfSkoW10sIHNlcXVlbmNlKTtcbn07XG5cbnZhciBpc1NlcXVlbnRpYWwgPSBmdW5jdGlvbiBpc1NlcXVlbnRpYWwoeCkge1xuICByZXR1cm4gKGlzTGlzdCh4KSkgfHwgKGlzVmVjdG9yKHgpKSB8fCAoaXNMYXp5U2VxKHgpKSB8fCAoaXNEaWN0aW9uYXJ5KHgpKSB8fCAoaXNTdHJpbmcoeCkpO1xufTtcbmV4cG9ydHMuaXNTZXF1ZW50aWFsID0gaXNTZXF1ZW50aWFsO1xuXG52YXIgcmV2ZXJzZSA9IGZ1bmN0aW9uIHJldmVyc2Uoc2VxdWVuY2UpIHtcbiAgcmV0dXJuIGlzTGlzdChzZXF1ZW5jZSkgP1xuICAgIHJldmVyc2VMaXN0KHNlcXVlbmNlKSA6XG4gIGlzVmVjdG9yKHNlcXVlbmNlKSA/XG4gICAgc2VxdWVuY2UucmV2ZXJzZSgpIDpcbiAgaXNOaWwoc2VxdWVuY2UpID9cbiAgICBsaXN0KCkgOlxuICBcImVsc2VcIiA/XG4gICAgcmV2ZXJzZShzZXEoc2VxdWVuY2UpKSA6XG4gICAgdm9pZCgwKTtcbn07XG5leHBvcnRzLnJldmVyc2UgPSByZXZlcnNlO1xuXG52YXIgbWFwID0gZnVuY3Rpb24gbWFwKGYsIHNlcXVlbmNlKSB7XG4gIHJldHVybiBpc1ZlY3RvcihzZXF1ZW5jZSkgP1xuICAgIHNlcXVlbmNlLm1hcChmKSA6XG4gIGlzTGlzdChzZXF1ZW5jZSkgP1xuICAgIG1hcExpc3QoZiwgc2VxdWVuY2UpIDpcbiAgaXNOaWwoc2VxdWVuY2UpID9cbiAgICBsaXN0KCkgOlxuICBcImVsc2VcIiA/XG4gICAgbWFwKGYsIHNlcShzZXF1ZW5jZSkpIDpcbiAgICB2b2lkKDApO1xufTtcbmV4cG9ydHMubWFwID0gbWFwO1xuXG52YXIgbWFwTGlzdCA9IGZ1bmN0aW9uIG1hcExpc3QoZiwgc2VxdWVuY2UpIHtcbiAgcmV0dXJuIChmdW5jdGlvbiBsb29wKHJlc3VsdCwgaXRlbXMpIHtcbiAgICB2YXIgcmVjdXIgPSBsb29wO1xuICAgIHdoaWxlIChyZWN1ciA9PT0gbG9vcCkge1xuICAgICAgcmVjdXIgPSBpc0VtcHR5KGl0ZW1zKSA/XG4gICAgICByZXZlcnNlKHJlc3VsdCkgOlxuICAgICAgKHJlc3VsdCA9IGNvbnMoZihmaXJzdChpdGVtcykpLCByZXN1bHQpLCBpdGVtcyA9IHJlc3QoaXRlbXMpLCBsb29wKTtcbiAgICB9O1xuICAgIHJldHVybiByZWN1cjtcbiAgfSkobGlzdCgpLCBzZXF1ZW5jZSk7XG59O1xuXG52YXIgZmlsdGVyID0gZnVuY3Rpb24gZmlsdGVyKGlzRiwgc2VxdWVuY2UpIHtcbiAgcmV0dXJuIGlzVmVjdG9yKHNlcXVlbmNlKSA/XG4gICAgc2VxdWVuY2UuZmlsdGVyKGlzRikgOlxuICBpc0xpc3Qoc2VxdWVuY2UpID9cbiAgICBmaWx0ZXJMaXN0KGlzRiwgc2VxdWVuY2UpIDpcbiAgaXNOaWwoc2VxdWVuY2UpID9cbiAgICBsaXN0KCkgOlxuICBcImVsc2VcIiA/XG4gICAgZmlsdGVyKGlzRiwgc2VxKHNlcXVlbmNlKSkgOlxuICAgIHZvaWQoMCk7XG59O1xuZXhwb3J0cy5maWx0ZXIgPSBmaWx0ZXI7XG5cbnZhciBmaWx0ZXJMaXN0ID0gZnVuY3Rpb24gZmlsdGVyTGlzdChpc0YsIHNlcXVlbmNlKSB7XG4gIHJldHVybiAoZnVuY3Rpb24gbG9vcChyZXN1bHQsIGl0ZW1zKSB7XG4gICAgdmFyIHJlY3VyID0gbG9vcDtcbiAgICB3aGlsZSAocmVjdXIgPT09IGxvb3ApIHtcbiAgICAgIHJlY3VyID0gaXNFbXB0eShpdGVtcykgP1xuICAgICAgcmV2ZXJzZShyZXN1bHQpIDpcbiAgICAgIChyZXN1bHQgPSBpc0YoZmlyc3QoaXRlbXMpKSA/XG4gICAgICAgIGNvbnMoZmlyc3QoaXRlbXMpLCByZXN1bHQpIDpcbiAgICAgICAgcmVzdWx0LCBpdGVtcyA9IHJlc3QoaXRlbXMpLCBsb29wKTtcbiAgICB9O1xuICAgIHJldHVybiByZWN1cjtcbiAgfSkobGlzdCgpLCBzZXF1ZW5jZSk7XG59O1xuXG52YXIgcmVkdWNlID0gZnVuY3Rpb24gcmVkdWNlKGYpIHtcbiAgdmFyIHBhcmFtcyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gIHJldHVybiAoZnVuY3Rpb24oKSB7XG4gICAgdmFyIGhhc0luaXRpYWwgPSBjb3VudChwYXJhbXMpID49IDI7XG4gICAgdmFyIGluaXRpYWwgPSBoYXNJbml0aWFsID9cbiAgICAgIGZpcnN0KHBhcmFtcykgOlxuICAgICAgdm9pZCgwKTtcbiAgICB2YXIgc2VxdWVuY2UgPSBoYXNJbml0aWFsID9cbiAgICAgIHNlY29uZChwYXJhbXMpIDpcbiAgICAgIGZpcnN0KHBhcmFtcyk7XG4gICAgcmV0dXJuIGlzTmlsKHNlcXVlbmNlKSA/XG4gICAgICBpbml0aWFsIDpcbiAgICBpc1ZlY3RvcihzZXF1ZW5jZSkgP1xuICAgICAgaGFzSW5pdGlhbCA/XG4gICAgICAgIHNlcXVlbmNlLnJlZHVjZShmLCBpbml0aWFsKSA6XG4gICAgICAgIHNlcXVlbmNlLnJlZHVjZShmKSA6XG4gICAgaXNMaXN0KHNlcXVlbmNlKSA/XG4gICAgICBoYXNJbml0aWFsID9cbiAgICAgICAgcmVkdWNlTGlzdChmLCBpbml0aWFsLCBzZXF1ZW5jZSkgOlxuICAgICAgICByZWR1Y2VMaXN0KGYsIGZpcnN0KHNlcXVlbmNlKSwgcmVzdChzZXF1ZW5jZSkpIDpcbiAgICBcImVsc2VcIiA/XG4gICAgICByZWR1Y2UoZiwgaW5pdGlhbCwgc2VxKHNlcXVlbmNlKSkgOlxuICAgICAgdm9pZCgwKTtcbiAgfSkoKTtcbn07XG5leHBvcnRzLnJlZHVjZSA9IHJlZHVjZTtcblxudmFyIHJlZHVjZUxpc3QgPSBmdW5jdGlvbiByZWR1Y2VMaXN0KGYsIGluaXRpYWwsIHNlcXVlbmNlKSB7XG4gIHJldHVybiAoZnVuY3Rpb24gbG9vcChyZXN1bHQsIGl0ZW1zKSB7XG4gICAgdmFyIHJlY3VyID0gbG9vcDtcbiAgICB3aGlsZSAocmVjdXIgPT09IGxvb3ApIHtcbiAgICAgIHJlY3VyID0gaXNFbXB0eShpdGVtcykgP1xuICAgICAgcmVzdWx0IDpcbiAgICAgIChyZXN1bHQgPSBmKHJlc3VsdCwgZmlyc3QoaXRlbXMpKSwgaXRlbXMgPSByZXN0KGl0ZW1zKSwgbG9vcCk7XG4gICAgfTtcbiAgICByZXR1cm4gcmVjdXI7XG4gIH0pKGluaXRpYWwsIHNlcXVlbmNlKTtcbn07XG5cbnZhciBjb3VudCA9IGZ1bmN0aW9uIGNvdW50KHNlcXVlbmNlKSB7XG4gIHJldHVybiBpc05pbChzZXF1ZW5jZSkgP1xuICAgIDAgOlxuICAgIChzZXEoc2VxdWVuY2UpKS5sZW5ndGg7XG59O1xuZXhwb3J0cy5jb3VudCA9IGNvdW50O1xuXG52YXIgaXNFbXB0eSA9IGZ1bmN0aW9uIGlzRW1wdHkoc2VxdWVuY2UpIHtcbiAgcmV0dXJuIGNvdW50KHNlcXVlbmNlKSA9PT0gMDtcbn07XG5leHBvcnRzLmlzRW1wdHkgPSBpc0VtcHR5O1xuXG52YXIgZmlyc3QgPSBmdW5jdGlvbiBmaXJzdChzZXF1ZW5jZSkge1xuICByZXR1cm4gaXNOaWwoc2VxdWVuY2UpID9cbiAgICB2b2lkKDApIDpcbiAgaXNMaXN0KHNlcXVlbmNlKSA/XG4gICAgc2VxdWVuY2UuaGVhZCA6XG4gIChpc1ZlY3RvcihzZXF1ZW5jZSkpIHx8IChpc1N0cmluZyhzZXF1ZW5jZSkpID9cbiAgICAoc2VxdWVuY2UgfHwgMClbMF0gOlxuICBpc0xhenlTZXEoc2VxdWVuY2UpID9cbiAgICBmaXJzdChsYXp5U2VxVmFsdWUoc2VxdWVuY2UpKSA6XG4gIFwiZWxzZVwiID9cbiAgICBmaXJzdChzZXEoc2VxdWVuY2UpKSA6XG4gICAgdm9pZCgwKTtcbn07XG5leHBvcnRzLmZpcnN0ID0gZmlyc3Q7XG5cbnZhciBzZWNvbmQgPSBmdW5jdGlvbiBzZWNvbmQoc2VxdWVuY2UpIHtcbiAgcmV0dXJuIGlzTmlsKHNlcXVlbmNlKSA/XG4gICAgdm9pZCgwKSA6XG4gIGlzTGlzdChzZXF1ZW5jZSkgP1xuICAgIGZpcnN0KHJlc3Qoc2VxdWVuY2UpKSA6XG4gIChpc1ZlY3RvcihzZXF1ZW5jZSkpIHx8IChpc1N0cmluZyhzZXF1ZW5jZSkpID9cbiAgICAoc2VxdWVuY2UgfHwgMClbMV0gOlxuICBpc0xhenlTZXEoc2VxdWVuY2UpID9cbiAgICBzZWNvbmQobGF6eVNlcVZhbHVlKHNlcXVlbmNlKSkgOlxuICBcImVsc2VcIiA/XG4gICAgZmlyc3QocmVzdChzZXEoc2VxdWVuY2UpKSkgOlxuICAgIHZvaWQoMCk7XG59O1xuZXhwb3J0cy5zZWNvbmQgPSBzZWNvbmQ7XG5cbnZhciB0aGlyZCA9IGZ1bmN0aW9uIHRoaXJkKHNlcXVlbmNlKSB7XG4gIHJldHVybiBpc05pbChzZXF1ZW5jZSkgP1xuICAgIHZvaWQoMCkgOlxuICBpc0xpc3Qoc2VxdWVuY2UpID9cbiAgICBmaXJzdChyZXN0KHJlc3Qoc2VxdWVuY2UpKSkgOlxuICAoaXNWZWN0b3Ioc2VxdWVuY2UpKSB8fCAoaXNTdHJpbmcoc2VxdWVuY2UpKSA/XG4gICAgKHNlcXVlbmNlIHx8IDApWzJdIDpcbiAgaXNMYXp5U2VxKHNlcXVlbmNlKSA/XG4gICAgdGhpcmQobGF6eVNlcVZhbHVlKHNlcXVlbmNlKSkgOlxuICBcImVsc2VcIiA/XG4gICAgc2Vjb25kKHJlc3Qoc2VxKHNlcXVlbmNlKSkpIDpcbiAgICB2b2lkKDApO1xufTtcbmV4cG9ydHMudGhpcmQgPSB0aGlyZDtcblxudmFyIHJlc3QgPSBmdW5jdGlvbiByZXN0KHNlcXVlbmNlKSB7XG4gIHJldHVybiBpc05pbChzZXF1ZW5jZSkgP1xuICAgIGxpc3QoKSA6XG4gIGlzTGlzdChzZXF1ZW5jZSkgP1xuICAgIHNlcXVlbmNlLnRhaWwgOlxuICAoaXNWZWN0b3Ioc2VxdWVuY2UpKSB8fCAoaXNTdHJpbmcoc2VxdWVuY2UpKSA/XG4gICAgc2VxdWVuY2Uuc2xpY2UoMSkgOlxuICBpc0xhenlTZXEoc2VxdWVuY2UpID9cbiAgICByZXN0KGxhenlTZXFWYWx1ZShzZXF1ZW5jZSkpIDpcbiAgXCJlbHNlXCIgP1xuICAgIHJlc3Qoc2VxKHNlcXVlbmNlKSkgOlxuICAgIHZvaWQoMCk7XG59O1xuZXhwb3J0cy5yZXN0ID0gcmVzdDtcblxudmFyIGxhc3RPZkxpc3QgPSBmdW5jdGlvbiBsYXN0T2ZMaXN0KGxpc3QpIHtcbiAgcmV0dXJuIChmdW5jdGlvbiBsb29wKGl0ZW0sIGl0ZW1zKSB7XG4gICAgdmFyIHJlY3VyID0gbG9vcDtcbiAgICB3aGlsZSAocmVjdXIgPT09IGxvb3ApIHtcbiAgICAgIHJlY3VyID0gaXNFbXB0eShpdGVtcykgP1xuICAgICAgaXRlbSA6XG4gICAgICAoaXRlbSA9IGZpcnN0KGl0ZW1zKSwgaXRlbXMgPSByZXN0KGl0ZW1zKSwgbG9vcCk7XG4gICAgfTtcbiAgICByZXR1cm4gcmVjdXI7XG4gIH0pKGZpcnN0KGxpc3QpLCByZXN0KGxpc3QpKTtcbn07XG5cbnZhciBsYXN0ID0gZnVuY3Rpb24gbGFzdChzZXF1ZW5jZSkge1xuICByZXR1cm4gKGlzVmVjdG9yKHNlcXVlbmNlKSkgfHwgKGlzU3RyaW5nKHNlcXVlbmNlKSkgP1xuICAgIChzZXF1ZW5jZSB8fCAwKVtkZWMoY291bnQoc2VxdWVuY2UpKV0gOlxuICBpc0xpc3Qoc2VxdWVuY2UpID9cbiAgICBsYXN0T2ZMaXN0KHNlcXVlbmNlKSA6XG4gIGlzTmlsKHNlcXVlbmNlKSA/XG4gICAgdm9pZCgwKSA6XG4gIGlzTGF6eVNlcShzZXF1ZW5jZSkgP1xuICAgIGxhc3QobGF6eVNlcVZhbHVlKHNlcXVlbmNlKSkgOlxuICBcImVsc2VcIiA/XG4gICAgbGFzdChzZXEoc2VxdWVuY2UpKSA6XG4gICAgdm9pZCgwKTtcbn07XG5leHBvcnRzLmxhc3QgPSBsYXN0O1xuXG52YXIgYnV0bGFzdCA9IGZ1bmN0aW9uIGJ1dGxhc3Qoc2VxdWVuY2UpIHtcbiAgdmFyIGl0ZW1zID0gaXNOaWwoc2VxdWVuY2UpID9cbiAgICB2b2lkKDApIDpcbiAgaXNTdHJpbmcoc2VxdWVuY2UpID9cbiAgICBzdWJzKHNlcXVlbmNlLCAwLCBkZWMoY291bnQoc2VxdWVuY2UpKSkgOlxuICBpc1ZlY3RvcihzZXF1ZW5jZSkgP1xuICAgIHNlcXVlbmNlLnNsaWNlKDAsIGRlYyhjb3VudChzZXF1ZW5jZSkpKSA6XG4gIGlzTGlzdChzZXF1ZW5jZSkgP1xuICAgIGxpc3QuYXBwbHkobGlzdCwgYnV0bGFzdCh2ZWMoc2VxdWVuY2UpKSkgOlxuICBpc0xhenlTZXEoc2VxdWVuY2UpID9cbiAgICBidXRsYXN0KGxhenlTZXFWYWx1ZShzZXF1ZW5jZSkpIDpcbiAgXCJlbHNlXCIgP1xuICAgIGJ1dGxhc3Qoc2VxKHNlcXVlbmNlKSkgOlxuICAgIHZvaWQoMCk7XG4gIHJldHVybiAhKChpc05pbChpdGVtcykpIHx8IChpc0VtcHR5KGl0ZW1zKSkpID9cbiAgICBpdGVtcyA6XG4gICAgdm9pZCgwKTtcbn07XG5leHBvcnRzLmJ1dGxhc3QgPSBidXRsYXN0O1xuXG52YXIgdGFrZSA9IGZ1bmN0aW9uIHRha2Uobiwgc2VxdWVuY2UpIHtcbiAgcmV0dXJuIGlzTmlsKHNlcXVlbmNlKSA/XG4gICAgbGlzdCgpIDpcbiAgaXNWZWN0b3Ioc2VxdWVuY2UpID9cbiAgICB0YWtlRnJvbVZlY3RvcihuLCBzZXF1ZW5jZSkgOlxuICBpc0xpc3Qoc2VxdWVuY2UpID9cbiAgICB0YWtlRnJvbUxpc3Qobiwgc2VxdWVuY2UpIDpcbiAgaXNMYXp5U2VxKHNlcXVlbmNlKSA/XG4gICAgdGFrZShuLCBsYXp5U2VxVmFsdWUoc2VxdWVuY2UpKSA6XG4gIFwiZWxzZVwiID9cbiAgICB0YWtlKG4sIHNlcShzZXF1ZW5jZSkpIDpcbiAgICB2b2lkKDApO1xufTtcbmV4cG9ydHMudGFrZSA9IHRha2U7XG5cbnZhciB0YWtlVmVjdG9yV2hpbGUgPSBmdW5jdGlvbiB0YWtlVmVjdG9yV2hpbGUocHJlZGljYXRlLCB2ZWN0b3IpIHtcbiAgcmV0dXJuIChmdW5jdGlvbiBsb29wKHJlc3VsdCwgdGFpbCwgaGVhZCkge1xuICAgIHZhciByZWN1ciA9IGxvb3A7XG4gICAgd2hpbGUgKHJlY3VyID09PSBsb29wKSB7XG4gICAgICByZWN1ciA9ICghKGlzRW1wdHkodGFpbCkpKSAmJiAocHJlZGljYXRlKGhlYWQpKSA/XG4gICAgICAocmVzdWx0ID0gY29uaihyZXN1bHQsIGhlYWQpLCB0YWlsID0gcmVzdCh0YWlsKSwgaGVhZCA9IGZpcnN0KHRhaWwpLCBsb29wKSA6XG4gICAgICByZXN1bHQ7XG4gICAgfTtcbiAgICByZXR1cm4gcmVjdXI7XG4gIH0pKFtdLCB2ZWN0b3IsIGZpcnN0KHZlY3RvcikpO1xufTtcblxudmFyIHRha2VMaXN0V2hpbGUgPSBmdW5jdGlvbiB0YWtlTGlzdFdoaWxlKHByZWRpY2F0ZSwgaXRlbXMpIHtcbiAgcmV0dXJuIChmdW5jdGlvbiBsb29wKHJlc3VsdCwgdGFpbCwgaGVhZCkge1xuICAgIHZhciByZWN1ciA9IGxvb3A7XG4gICAgd2hpbGUgKHJlY3VyID09PSBsb29wKSB7XG4gICAgICByZWN1ciA9ICghKGlzRW1wdHkodGFpbCkpKSAmJiAoaXNQcmVkaWNhdGUoaGVhZCkpID9cbiAgICAgIChyZXN1bHQgPSBjb25qKHJlc3VsdCwgaGVhZCksIHRhaWwgPSByZXN0KHRhaWwpLCBoZWFkID0gZmlyc3QodGFpbCksIGxvb3ApIDpcbiAgICAgIGxpc3QuYXBwbHkobGlzdCwgcmVzdWx0KTtcbiAgICB9O1xuICAgIHJldHVybiByZWN1cjtcbiAgfSkoW10sIGl0ZW1zLCBmaXJzdChpdGVtcykpO1xufTtcblxudmFyIHRha2VXaGlsZSA9IGZ1bmN0aW9uIHRha2VXaGlsZShwcmVkaWNhdGUsIHNlcXVlbmNlKSB7XG4gIHJldHVybiBpc05pbChzZXF1ZW5jZSkgP1xuICAgIGxpc3QoKSA6XG4gIGlzVmVjdG9yKHNlcXVlbmNlKSA/XG4gICAgdGFrZVZlY3RvcldoaWxlKHByZWRpY2F0ZSwgc2VxdWVuY2UpIDpcbiAgaXNMaXN0KHNlcXVlbmNlKSA/XG4gICAgdGFrZVZlY3RvcldoaWxlKHByZWRpY2F0ZSwgc2VxdWVuY2UpIDpcbiAgXCJlbHNlXCIgP1xuICAgIHRha2VXaGlsZShwcmVkaWNhdGUsIGxhenlTZXFWYWx1ZShzZXF1ZW5jZSkpIDpcbiAgICB2b2lkKDApO1xufTtcbmV4cG9ydHMudGFrZVdoaWxlID0gdGFrZVdoaWxlO1xuXG52YXIgdGFrZUZyb21WZWN0b3IgPSBmdW5jdGlvbiB0YWtlRnJvbVZlY3RvcihuLCB2ZWN0b3IpIHtcbiAgcmV0dXJuIHZlY3Rvci5zbGljZSgwLCBuKTtcbn07XG5cbnZhciB0YWtlRnJvbUxpc3QgPSBmdW5jdGlvbiB0YWtlRnJvbUxpc3Qobiwgc2VxdWVuY2UpIHtcbiAgcmV0dXJuIChmdW5jdGlvbiBsb29wKHRha2VuLCBpdGVtcywgbikge1xuICAgIHZhciByZWN1ciA9IGxvb3A7XG4gICAgd2hpbGUgKHJlY3VyID09PSBsb29wKSB7XG4gICAgICByZWN1ciA9IChuID09PSAwKSB8fCAoaXNFbXB0eShpdGVtcykpID9cbiAgICAgIHJldmVyc2UodGFrZW4pIDpcbiAgICAgICh0YWtlbiA9IGNvbnMoZmlyc3QoaXRlbXMpLCB0YWtlbiksIGl0ZW1zID0gcmVzdChpdGVtcyksIG4gPSBkZWMobiksIGxvb3ApO1xuICAgIH07XG4gICAgcmV0dXJuIHJlY3VyO1xuICB9KShsaXN0KCksIHNlcXVlbmNlLCBuKTtcbn07XG5cbnZhciBkcm9wRnJvbUxpc3QgPSBmdW5jdGlvbiBkcm9wRnJvbUxpc3Qobiwgc2VxdWVuY2UpIHtcbiAgcmV0dXJuIChmdW5jdGlvbiBsb29wKGxlZnQsIGl0ZW1zKSB7XG4gICAgdmFyIHJlY3VyID0gbG9vcDtcbiAgICB3aGlsZSAocmVjdXIgPT09IGxvb3ApIHtcbiAgICAgIHJlY3VyID0gKGxlZnQgPCAxKSB8fCAoaXNFbXB0eShpdGVtcykpID9cbiAgICAgIGl0ZW1zIDpcbiAgICAgIChsZWZ0ID0gZGVjKGxlZnQpLCBpdGVtcyA9IHJlc3QoaXRlbXMpLCBsb29wKTtcbiAgICB9O1xuICAgIHJldHVybiByZWN1cjtcbiAgfSkobiwgc2VxdWVuY2UpO1xufTtcblxudmFyIGRyb3AgPSBmdW5jdGlvbiBkcm9wKG4sIHNlcXVlbmNlKSB7XG4gIHJldHVybiBuIDw9IDAgP1xuICAgIHNlcXVlbmNlIDpcbiAgaXNTdHJpbmcoc2VxdWVuY2UpID9cbiAgICBzZXF1ZW5jZS5zdWJzdHIobikgOlxuICBpc1ZlY3RvcihzZXF1ZW5jZSkgP1xuICAgIHNlcXVlbmNlLnNsaWNlKG4pIDpcbiAgaXNMaXN0KHNlcXVlbmNlKSA/XG4gICAgZHJvcEZyb21MaXN0KG4sIHNlcXVlbmNlKSA6XG4gIGlzTmlsKHNlcXVlbmNlKSA/XG4gICAgbGlzdCgpIDpcbiAgaXNMYXp5U2VxKHNlcXVlbmNlKSA/XG4gICAgZHJvcChuLCBsYXp5U2VxVmFsdWUoc2VxdWVuY2UpKSA6XG4gIFwiZWxzZVwiID9cbiAgICBkcm9wKG4sIHNlcShzZXF1ZW5jZSkpIDpcbiAgICB2b2lkKDApO1xufTtcbmV4cG9ydHMuZHJvcCA9IGRyb3A7XG5cbnZhciBjb25qTGlzdCA9IGZ1bmN0aW9uIGNvbmpMaXN0KHNlcXVlbmNlLCBpdGVtcykge1xuICByZXR1cm4gcmVkdWNlKGZ1bmN0aW9uKHJlc3VsdCwgaXRlbSkge1xuICAgIHJldHVybiBjb25zKGl0ZW0sIHJlc3VsdCk7XG4gIH0sIHNlcXVlbmNlLCBpdGVtcyk7XG59O1xuXG52YXIgY29uaiA9IGZ1bmN0aW9uIGNvbmooc2VxdWVuY2UpIHtcbiAgdmFyIGl0ZW1zID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgcmV0dXJuIGlzVmVjdG9yKHNlcXVlbmNlKSA/XG4gICAgc2VxdWVuY2UuY29uY2F0KGl0ZW1zKSA6XG4gIGlzU3RyaW5nKHNlcXVlbmNlKSA/XG4gICAgXCJcIiArIHNlcXVlbmNlICsgKHN0ci5hcHBseShzdHIsIGl0ZW1zKSkgOlxuICBpc05pbChzZXF1ZW5jZSkgP1xuICAgIGxpc3QuYXBwbHkobGlzdCwgcmV2ZXJzZShpdGVtcykpIDpcbiAgKGlzTGlzdChzZXF1ZW5jZSkpIHx8IChpc0xhenlTZXEoKSkgP1xuICAgIGNvbmpMaXN0KHNlcXVlbmNlLCBpdGVtcykgOlxuICBpc0RpY3Rpb25hcnkoc2VxdWVuY2UpID9cbiAgICBtZXJnZShzZXF1ZW5jZSwgbWVyZ2UuYXBwbHkobWVyZ2UsIGl0ZW1zKSkgOlxuICBcImVsc2VcIiA/XG4gICAgKGZ1bmN0aW9uKCkgeyB0aHJvdyBUeXBlRXJyb3IoXCJcIiArIFwiVHlwZSBjYW4ndCBiZSBjb25qb2luZWQgXCIgKyBzZXF1ZW5jZSk7IH0pKCkgOlxuICAgIHZvaWQoMCk7XG59O1xuZXhwb3J0cy5jb25qID0gY29uajtcblxudmFyIGFzc29jID0gZnVuY3Rpb24gYXNzb2Moc291cmNlKSB7XG4gIHZhciBrZXlWYWx1ZXMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICByZXR1cm4gY29uaihzb3VyY2UsIGRpY3Rpb25hcnkuYXBwbHkoZGljdGlvbmFyeSwga2V5VmFsdWVzKSk7XG59O1xuZXhwb3J0cy5hc3NvYyA9IGFzc29jO1xuXG52YXIgY29uY2F0ID0gZnVuY3Rpb24gY29uY2F0KCkge1xuICB2YXIgc2VxdWVuY2VzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKTtcbiAgcmV0dXJuIHJldmVyc2UocmVkdWNlKGZ1bmN0aW9uKHJlc3VsdCwgc2VxdWVuY2UpIHtcbiAgICByZXR1cm4gcmVkdWNlKGZ1bmN0aW9uKHJlc3VsdCwgaXRlbSkge1xuICAgICAgcmV0dXJuIGNvbnMoaXRlbSwgcmVzdWx0KTtcbiAgICB9LCByZXN1bHQsIHNlcShzZXF1ZW5jZSkpO1xuICB9LCBsaXN0KCksIHNlcXVlbmNlcykpO1xufTtcbmV4cG9ydHMuY29uY2F0ID0gY29uY2F0O1xuXG52YXIgc2VxID0gZnVuY3Rpb24gc2VxKHNlcXVlbmNlKSB7XG4gIHJldHVybiBpc05pbChzZXF1ZW5jZSkgP1xuICAgIHZvaWQoMCkgOlxuICAoaXNWZWN0b3Ioc2VxdWVuY2UpKSB8fCAoaXNMaXN0KHNlcXVlbmNlKSkgfHwgKGlzTGF6eVNlcShzZXF1ZW5jZSkpID9cbiAgICBzZXF1ZW5jZSA6XG4gIGlzU3RyaW5nKHNlcXVlbmNlKSA/XG4gICAgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoc2VxdWVuY2UpIDpcbiAgaXNEaWN0aW9uYXJ5KHNlcXVlbmNlKSA/XG4gICAga2V5VmFsdWVzKHNlcXVlbmNlKSA6XG4gIFwiZGVmYXVsdFwiID9cbiAgICAoZnVuY3Rpb24oKSB7IHRocm93IFR5cGVFcnJvcihcIlwiICsgXCJDYW4gbm90IHNlcSBcIiArIHNlcXVlbmNlKTsgfSkoKSA6XG4gICAgdm9pZCgwKTtcbn07XG5leHBvcnRzLnNlcSA9IHNlcTtcblxudmFyIGlzU2VxID0gZnVuY3Rpb24gaXNTZXEoc2VxdWVuY2UpIHtcbiAgcmV0dXJuIChpc0xpc3Qoc2VxdWVuY2UpKSB8fCAoaXNMYXp5U2VxKHNlcXVlbmNlKSk7XG59O1xuZXhwb3J0cy5pc1NlcSA9IGlzU2VxO1xuXG52YXIgbGlzdFRvVmVjdG9yID0gZnVuY3Rpb24gbGlzdFRvVmVjdG9yKHNvdXJjZSkge1xuICByZXR1cm4gKGZ1bmN0aW9uIGxvb3AocmVzdWx0LCBsaXN0KSB7XG4gICAgdmFyIHJlY3VyID0gbG9vcDtcbiAgICB3aGlsZSAocmVjdXIgPT09IGxvb3ApIHtcbiAgICAgIHJlY3VyID0gaXNFbXB0eShsaXN0KSA/XG4gICAgICByZXN1bHQgOlxuICAgICAgKHJlc3VsdCA9IChmdW5jdGlvbigpIHtcbiAgICAgICAgcmVzdWx0LnB1c2goZmlyc3QobGlzdCkpO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfSkoKSwgbGlzdCA9IHJlc3QobGlzdCksIGxvb3ApO1xuICAgIH07XG4gICAgcmV0dXJuIHJlY3VyO1xuICB9KShbXSwgc291cmNlKTtcbn07XG5cbnZhciB2ZWMgPSBmdW5jdGlvbiB2ZWMoc2VxdWVuY2UpIHtcbiAgcmV0dXJuIGlzTmlsKHNlcXVlbmNlKSA/XG4gICAgW10gOlxuICBpc1ZlY3RvcihzZXF1ZW5jZSkgP1xuICAgIHNlcXVlbmNlIDpcbiAgaXNMaXN0KHNlcXVlbmNlKSA/XG4gICAgbGlzdFRvVmVjdG9yKHNlcXVlbmNlKSA6XG4gIFwiZWxzZVwiID9cbiAgICB2ZWMoc2VxKHNlcXVlbmNlKSkgOlxuICAgIHZvaWQoMCk7XG59O1xuZXhwb3J0cy52ZWMgPSB2ZWM7XG5cbnZhciBzb3J0ID0gZnVuY3Rpb24gc29ydChmLCBpdGVtcykge1xuICB2YXIgaGFzQ29tcGFyYXRvciA9IGlzRm4oZik7XG4gIHZhciBpdGVtcyA9ICghKGhhc0NvbXBhcmF0b3IpKSAmJiAoaXNOaWwoaXRlbXMpKSA/XG4gICAgZiA6XG4gICAgaXRlbXM7XG4gIHZhciBjb21wYXJlID0gaGFzQ29tcGFyYXRvciA/XG4gICAgZnVuY3Rpb24oYSwgYikge1xuICAgICAgcmV0dXJuIGYoYSwgYikgP1xuICAgICAgICAwIDpcbiAgICAgICAgMTtcbiAgICB9IDpcbiAgICB2b2lkKDApO1xuICByZXR1cm4gaXNOaWwoaXRlbXMpID9cbiAgICBsaXN0KCkgOlxuICBpc1ZlY3RvcihpdGVtcykgP1xuICAgIGl0ZW1zLnNvcnQoY29tcGFyZSkgOlxuICBpc0xpc3QoaXRlbXMpID9cbiAgICBsaXN0LmFwcGx5KGxpc3QsIHZlYyhpdGVtcykuc29ydChjb21wYXJlKSkgOlxuICBpc0RpY3Rpb25hcnkoaXRlbXMpID9cbiAgICBzZXEoaXRlbXMpLnNvcnQoY29tcGFyZSkgOlxuICBcImVsc2VcIiA/XG4gICAgc29ydChmLCBzZXEoaXRlbXMpKSA6XG4gICAgdm9pZCgwKTtcbn07XG5leHBvcnRzLnNvcnQgPSBzb3J0O1xuXG52YXIgcmVwZWF0ID0gZnVuY3Rpb24gcmVwZWF0KG4sIHgpIHtcbiAgcmV0dXJuIChmdW5jdGlvbiBsb29wKG4sIHJlc3VsdCkge1xuICAgIHZhciByZWN1ciA9IGxvb3A7XG4gICAgd2hpbGUgKHJlY3VyID09PSBsb29wKSB7XG4gICAgICByZWN1ciA9IG4gPD0gMCA/XG4gICAgICByZXN1bHQgOlxuICAgICAgKG4gPSBkZWMobiksIHJlc3VsdCA9IGNvbmoocmVzdWx0LCB4KSwgbG9vcCk7XG4gICAgfTtcbiAgICByZXR1cm4gcmVjdXI7XG4gIH0pKG4sIFtdKTtcbn07XG5leHBvcnRzLnJlcGVhdCA9IHJlcGVhdFxuIiwidmFyIF9uc18gPSBcIndpc3Auc3RyaW5nXCI7XG5tb2R1bGUubmFtZXNwYWNlID0gX25zXztcbnZhciBzdHIgPSAocmVxdWlyZShcIi4vcnVudGltZVwiKSkuc3RyO1xudmFyIHN1YnMgPSAocmVxdWlyZShcIi4vcnVudGltZVwiKSkuc3VicztcbnZhciByZU1hdGNoZXMgPSAocmVxdWlyZShcIi4vcnVudGltZVwiKSkucmVNYXRjaGVzO1xudmFyIGlzTmlsID0gKHJlcXVpcmUoXCIuL3J1bnRpbWVcIikpLmlzTmlsO1xudmFyIGlzU3RyaW5nID0gKHJlcXVpcmUoXCIuL3J1bnRpbWVcIikpLmlzU3RyaW5nO1xudmFyIHZlYyA9IChyZXF1aXJlKFwiLi9zZXF1ZW5jZVwiKSkudmVjO1xudmFyIGlzRW1wdHkgPSAocmVxdWlyZShcIi4vc2VxdWVuY2VcIikpLmlzRW1wdHk7O1xuXG52YXIgc3BsaXQgPSBmdW5jdGlvbiBzcGxpdChzdHJpbmcsIHBhdHRlcm4sIGxpbWl0KSB7XG4gIHJldHVybiBzdHJpbmcuc3BsaXQocGF0dGVybiwgbGltaXQpO1xufTtcbmV4cG9ydHMuc3BsaXQgPSBzcGxpdDtcblxudmFyIGpvaW4gPSBmdW5jdGlvbiBqb2luKHNlcGFyYXRvciwgY29sbCkge1xuICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICBjYXNlIDE6XG4gICAgICB2YXIgY29sbCA9IHNlcGFyYXRvcjtcbiAgICAgIHJldHVybiBzdHIuYXBwbHkoc3RyLCB2ZWMoY29sbCkpO1xuICAgIGNhc2UgMjpcbiAgICAgIHJldHVybiB2ZWMoY29sbCkuam9pbihzZXBhcmF0b3IpO1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIChmdW5jdGlvbigpIHsgdGhyb3cgRXJyb3IoXCJJbnZhbGlkIGFyaXR5XCIpOyB9KSgpXG4gIH07XG4gIHJldHVybiB2b2lkKDApO1xufTtcbmV4cG9ydHMuam9pbiA9IGpvaW47XG5cbnZhciB1cHBlckNhc2UgPSBmdW5jdGlvbiB1cHBlckNhc2Uoc3RyaW5nKSB7XG4gIHJldHVybiBzdHJpbmcudG9VcHBlckNhc2UoKTtcbn07XG5leHBvcnRzLnVwcGVyQ2FzZSA9IHVwcGVyQ2FzZTtcblxudmFyIHVwcGVyQ2FzZSA9IGZ1bmN0aW9uIHVwcGVyQ2FzZShzdHJpbmcpIHtcbiAgcmV0dXJuIHN0cmluZy50b1VwcGVyQ2FzZSgpO1xufTtcbmV4cG9ydHMudXBwZXJDYXNlID0gdXBwZXJDYXNlO1xuXG52YXIgbG93ZXJDYXNlID0gZnVuY3Rpb24gbG93ZXJDYXNlKHN0cmluZykge1xuICByZXR1cm4gc3RyaW5nLnRvTG93ZXJDYXNlKCk7XG59O1xuZXhwb3J0cy5sb3dlckNhc2UgPSBsb3dlckNhc2U7XG5cbnZhciBjYXBpdGFsaXplID0gZnVuY3Rpb24gY2FwaXRhbGl6ZShzdHJpbmcpIHtcbiAgcmV0dXJuIGNvdW50KHN0cmluZykgPCAyID9cbiAgICB1cHBlckNhc2Uoc3RyaW5nKSA6XG4gICAgXCJcIiArICh1cHBlckNhc2Uoc3VicyhzLCAwLCAxKSkpICsgKGxvd2VyQ2FzZShzdWJzKHMsIDEpKSk7XG59O1xuZXhwb3J0cy5jYXBpdGFsaXplID0gY2FwaXRhbGl6ZTtcblxudmFyIHJlcGxhY2UgPSBmdW5jdGlvbiByZXBsYWNlKHN0cmluZywgbWF0Y2gsIHJlcGxhY2VtZW50KSB7XG4gIHJldHVybiBzdHJpbmcucmVwbGFjZShtYXRjaCwgcmVwbGFjZW1lbnQpO1xufTtcbmV4cG9ydHMucmVwbGFjZSA9IHJlcGxhY2U7XG5cbnZhciBfX0xFRlRTUEFDRVNfXyA9IC9eXFxzXFxzKi87XG5leHBvcnRzLl9fTEVGVFNQQUNFU19fID0gX19MRUZUU1BBQ0VTX187XG5cbnZhciBfX1JJR0hUU1BBQ0VTX18gPSAvXFxzXFxzKiQvO1xuZXhwb3J0cy5fX1JJR0hUU1BBQ0VTX18gPSBfX1JJR0hUU1BBQ0VTX187XG5cbnZhciBfX1NQQUNFU19fID0gL15cXHNcXHMqJC87XG5leHBvcnRzLl9fU1BBQ0VTX18gPSBfX1NQQUNFU19fO1xuXG52YXIgdHJpbWwgPSBpc05pbChcIlwiLnRyaW1MZWZ0KSA/XG4gIGZ1bmN0aW9uKHN0cmluZykge1xuICAgIHJldHVybiBzdHJpbmcucmVwbGFjZShfX0xFRlRTUEFDRVNfXywgXCJcIik7XG4gIH0gOlxuICBmdW5jdGlvbiB0cmltbChzdHJpbmcpIHtcbiAgICByZXR1cm4gc3RyaW5nLnRyaW1MZWZ0KCk7XG4gIH07XG5leHBvcnRzLnRyaW1sID0gdHJpbWw7XG5cbnZhciB0cmltciA9IGlzTmlsKFwiXCIudHJpbVJpZ2h0KSA/XG4gIGZ1bmN0aW9uKHN0cmluZykge1xuICAgIHJldHVybiBzdHJpbmcucmVwbGFjZShfX1JJR0hUU1BBQ0VTX18sIFwiXCIpO1xuICB9IDpcbiAgZnVuY3Rpb24gdHJpbXIoc3RyaW5nKSB7XG4gICAgcmV0dXJuIHN0cmluZy50cmltUmlnaHQoKTtcbiAgfTtcbmV4cG9ydHMudHJpbXIgPSB0cmltcjtcblxudmFyIHRyaW0gPSBpc05pbChcIlwiLnRyaW0pID9cbiAgZnVuY3Rpb24oc3RyaW5nKSB7XG4gICAgcmV0dXJuIHN0cmluZy5yZXBsYWNlKF9fTEVGVFNQQUNFU19fKS5yZXBsYWNlKF9fUklHSFRTUEFDRVNfXyk7XG4gIH0gOlxuICBmdW5jdGlvbiB0cmltKHN0cmluZykge1xuICAgIHJldHVybiBzdHJpbmcudHJpbSgpO1xuICB9O1xuZXhwb3J0cy50cmltID0gdHJpbTtcblxudmFyIGlzQmxhbmsgPSBmdW5jdGlvbiBpc0JsYW5rKHN0cmluZykge1xuICByZXR1cm4gKGlzTmlsKHN0cmluZykpIHx8IChpc0VtcHR5KHN0cmluZykpIHx8IChyZU1hdGNoZXMoX19TUEFDRVNfXywgc3RyaW5nKSk7XG59O1xuZXhwb3J0cy5pc0JsYW5rID0gaXNCbGFua1xuIiwidmFyIF9uc18gPSB7XG4gIFwiaWRcIjogXCJ3aXNwLmVuZ2luZS5icm93c2VyXCJcbn07XG52YXIgd2lzcF9ydW50aW1lID0gcmVxdWlyZShcIi4vLi4vcnVudGltZVwiKTtcbnZhciBzdHIgPSB3aXNwX3J1bnRpbWUuc3RyOztcbnZhciB3aXNwX3NlcXVlbmNlID0gcmVxdWlyZShcIi4vLi4vc2VxdWVuY2VcIik7XG52YXIgcmVzdCA9IHdpc3Bfc2VxdWVuY2UucmVzdDs7XG52YXIgd2lzcF9yZWFkZXIgPSByZXF1aXJlKFwiLi8uLi9yZWFkZXJcIik7XG52YXIgcmVhZF8gPSB3aXNwX3JlYWRlci5yZWFkXztcbnZhciByZWFkRnJvbVN0cmluZyA9IHdpc3BfcmVhZGVyLnJlYWRGcm9tU3RyaW5nOztcbnZhciB3aXNwX2NvbXBpbGVyID0gcmVxdWlyZShcIi4vLi4vY29tcGlsZXJcIik7XG52YXIgY29tcGlsZV8gPSB3aXNwX2NvbXBpbGVyLmNvbXBpbGVfOzs7XG5cbnZhciBldmFsdWF0ZSA9IGZ1bmN0aW9uIGV2YWx1YXRlKGNvZGUsIHVybCkge1xuICByZXR1cm4gZXZhbChjb21waWxlXyhyZWFkXyhjb2RlLCB1cmwpKSk7XG59O1xuZXhwb3J0cy5ldmFsdWF0ZSA9IGV2YWx1YXRlO1xuXG52YXIgcnVuID0gZnVuY3Rpb24gcnVuKGNvZGUsIHVybCkge1xuICByZXR1cm4gKEZ1bmN0aW9uKGNvbXBpbGVfKHJlYWRfKGNvZGUsIHVybCkpKSkoKTtcbn07XG5leHBvcnRzLnJ1biA9IHJ1bjtcblxudmFyIGxvYWQgPSBmdW5jdGlvbiBsb2FkKHVybCwgY2FsbGJhY2spIHtcbiAgdmFyIHJlcXVlc3QgPSB3aW5kb3cuWE1MSHR0cFJlcXVlc3QgP1xuICAgIG5ldyBYTUxIdHRwUmVxdWVzdCgpIDpcbiAgICBuZXcgQWN0aXZlWE9iamVjdChcIk1pY3Jvc29mdC5YTUxIVFRQXCIpO1xuICByZXF1ZXN0Lm9wZW4oXCJHRVRcIiwgdXJsLCB0cnVlKTtcbiAgcmVxdWVzdC5vdmVycmlkZU1pbWVUeXBlID9cbiAgICByZXF1ZXN0Lm92ZXJyaWRlTWltZVR5cGUoXCJhcHBsaWNhdGlvbi93aXNwXCIpIDpcbiAgICB2b2lkKDApO1xuICByZXF1ZXN0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiByZXF1ZXN0LnJlYWR5U3RhdGUgPT09IDQgP1xuICAgICAgKHJlcXVlc3Quc3RhdHVzID09PSAwKSB8fCAocmVxdWVzdC5zdGF0dXMgPT09IDIwMCkgP1xuICAgICAgICBjYWxsYmFjayhydW4ocmVxdWVzdC5yZXNwb25zZVRleHQsIHVybCkpIDpcbiAgICAgICAgY2FsbGJhY2soXCJDb3VsZCBub3QgbG9hZFwiKSA6XG4gICAgICB2b2lkKDApO1xuICB9O1xuICByZXR1cm4gcmVxdWVzdC5zZW5kKG51bGwpO1xufTtcbmV4cG9ydHMubG9hZCA9IGxvYWQ7XG5cbnZhciBydW5TY3JpcHRzID0gZnVuY3Rpb24gcnVuU2NyaXB0cygpIHtcbiAgdmFyIHNjcmlwdHMgPSBBcnJheS5wcm90b3R5cGUuZmlsdGVyLmNhbGwoZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJzY3JpcHRcIiksIGZ1bmN0aW9uKHNjcmlwdCkge1xuICAgIHJldHVybiBzY3JpcHQudHlwZSA9PT0gXCJhcHBsaWNhdGlvbi93aXNwXCI7XG4gIH0pO1xuICB2YXIgbmV4dCA9IGZ1bmN0aW9uIG5leHQoKSB7XG4gICAgcmV0dXJuIHNjcmlwdHMubGVuZ3RoID9cbiAgICAgIChmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHNjcmlwdCA9IHNjcmlwdHMuc2hpZnQoKTtcbiAgICAgICAgcmV0dXJuIHNjcmlwdC5zcmMgP1xuICAgICAgICAgIGxvYWQoc2NyaXB0LnNyYywgbmV4dCkgOlxuICAgICAgICAgIG5leHQocnVuKHNjcmlwdC5pbm5lckhUTUwpKTtcbiAgICAgIH0pKCkgOlxuICAgICAgdm9pZCgwKTtcbiAgfTtcbiAgcmV0dXJuIG5leHQoKTtcbn07XG5leHBvcnRzLnJ1blNjcmlwdHMgPSBydW5TY3JpcHRzO1xuXG4oZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gXCJjb21wbGV0ZVwiKSB8fCAoZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gXCJpbnRlcmFjdGl2ZVwiKSA/XG4gIHJ1blNjcmlwdHMoKSA6XG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciA/XG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBydW5TY3JpcHRzLCBmYWxzZSkgOlxuICB3aW5kb3cuYXR0YWNoRXZlbnQoXCJvbmxvYWRcIiwgcnVuU2NyaXB0cykiLCIoZnVuY3Rpb24oKXt2YXIgX25zXyA9IFwid2lzcC5ydW50aW1lXCI7XG5tb2R1bGUubmFtZXNwYWNlID0gX25zXztcbm1vZHVsZS5kZXNjcmlwdGlvbiA9IFwiQ29yZSBwcmltaXRpdmVzIHJlcXVpcmVkIGZvciBydW50aW1lXCI7O1xuXG52YXIgaWRlbnRpdHkgPSBmdW5jdGlvbiBpZGVudGl0eSh4KSB7XG4gIHJldHVybiB4O1xufTtcbmV4cG9ydHMuaWRlbnRpdHkgPSBpZGVudGl0eTtcblxudmFyIGlzT2RkID0gZnVuY3Rpb24gaXNPZGQobikge1xuICByZXR1cm4gbiAlIDIgPT09IDE7XG59O1xuZXhwb3J0cy5pc09kZCA9IGlzT2RkO1xuXG52YXIgaXNFdmVuID0gZnVuY3Rpb24gaXNFdmVuKG4pIHtcbiAgcmV0dXJuIG4gJSAyID09PSAwO1xufTtcbmV4cG9ydHMuaXNFdmVuID0gaXNFdmVuO1xuXG52YXIgaXNEaWN0aW9uYXJ5ID0gZnVuY3Rpb24gaXNEaWN0aW9uYXJ5KGZvcm0pIHtcbiAgcmV0dXJuIChpc09iamVjdChmb3JtKSkgJiYgKGlzT2JqZWN0KE9iamVjdC5nZXRQcm90b3R5cGVPZihmb3JtKSkpICYmIChpc05pbChPYmplY3QuZ2V0UHJvdG90eXBlT2YoT2JqZWN0LmdldFByb3RvdHlwZU9mKGZvcm0pKSkpO1xufTtcbmV4cG9ydHMuaXNEaWN0aW9uYXJ5ID0gaXNEaWN0aW9uYXJ5O1xuXG52YXIgZGljdGlvbmFyeSA9IGZ1bmN0aW9uIGRpY3Rpb25hcnkoKSB7XG4gIHJldHVybiAoZnVuY3Rpb24gbG9vcChrZXlWYWx1ZXMsIHJlc3VsdCkge1xuICAgIHZhciByZWN1ciA9IGxvb3A7XG4gICAgd2hpbGUgKHJlY3VyID09PSBsb29wKSB7XG4gICAgICByZWN1ciA9IGtleVZhbHVlcy5sZW5ndGggP1xuICAgICAgKGZ1bmN0aW9uKCkge1xuICAgICAgICAocmVzdWx0IHx8IDApWyhrZXlWYWx1ZXMgfHwgMClbMF1dID0gKGtleVZhbHVlcyB8fCAwKVsxXTtcbiAgICAgICAgcmV0dXJuIChrZXlWYWx1ZXMgPSBrZXlWYWx1ZXMuc2xpY2UoMiksIHJlc3VsdCA9IHJlc3VsdCwgbG9vcCk7XG4gICAgICB9KSgpIDpcbiAgICAgIHJlc3VsdDtcbiAgICB9O1xuICAgIHJldHVybiByZWN1cjtcbiAgfSkoQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKSwge30pO1xufTtcbmV4cG9ydHMuZGljdGlvbmFyeSA9IGRpY3Rpb25hcnk7XG5cbnZhciBrZXlzID0gZnVuY3Rpb24ga2V5cyhkaWN0aW9uYXJ5KSB7XG4gIHJldHVybiBPYmplY3Qua2V5cyhkaWN0aW9uYXJ5KTtcbn07XG5leHBvcnRzLmtleXMgPSBrZXlzO1xuXG52YXIgdmFscyA9IGZ1bmN0aW9uIHZhbHMoZGljdGlvbmFyeSkge1xuICByZXR1cm4ga2V5cyhkaWN0aW9uYXJ5KS5tYXAoZnVuY3Rpb24oa2V5KSB7XG4gICAgcmV0dXJuIChkaWN0aW9uYXJ5IHx8IDApW2tleV07XG4gIH0pO1xufTtcbmV4cG9ydHMudmFscyA9IHZhbHM7XG5cbnZhciBrZXlWYWx1ZXMgPSBmdW5jdGlvbiBrZXlWYWx1ZXMoZGljdGlvbmFyeSkge1xuICByZXR1cm4ga2V5cyhkaWN0aW9uYXJ5KS5tYXAoZnVuY3Rpb24oa2V5KSB7XG4gICAgcmV0dXJuIFtrZXksIChkaWN0aW9uYXJ5IHx8IDApW2tleV1dO1xuICB9KTtcbn07XG5leHBvcnRzLmtleVZhbHVlcyA9IGtleVZhbHVlcztcblxudmFyIG1lcmdlID0gZnVuY3Rpb24gbWVyZ2UoKSB7XG4gIHJldHVybiBPYmplY3QuY3JlYXRlKE9iamVjdC5wcm90b3R5cGUsIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cykucmVkdWNlKGZ1bmN0aW9uKGRlc2NyaXB0b3IsIGRpY3Rpb25hcnkpIHtcbiAgICBpc09iamVjdChkaWN0aW9uYXJ5KSA/XG4gICAgICBPYmplY3Qua2V5cyhkaWN0aW9uYXJ5KS5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgICAgICByZXR1cm4gKGRlc2NyaXB0b3IgfHwgMClba2V5XSA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoZGljdGlvbmFyeSwga2V5KTtcbiAgICAgIH0pIDpcbiAgICAgIHZvaWQoMCk7XG4gICAgcmV0dXJuIGRlc2NyaXB0b3I7XG4gIH0sIE9iamVjdC5jcmVhdGUoT2JqZWN0LnByb3RvdHlwZSkpKTtcbn07XG5leHBvcnRzLm1lcmdlID0gbWVyZ2U7XG5cbnZhciBpc0NvbnRhaW5zVmVjdG9yID0gZnVuY3Rpb24gaXNDb250YWluc1ZlY3Rvcih2ZWN0b3IsIGVsZW1lbnQpIHtcbiAgcmV0dXJuIHZlY3Rvci5pbmRleE9mKGVsZW1lbnQpID49IDA7XG59O1xuZXhwb3J0cy5pc0NvbnRhaW5zVmVjdG9yID0gaXNDb250YWluc1ZlY3RvcjtcblxudmFyIG1hcERpY3Rpb25hcnkgPSBmdW5jdGlvbiBtYXBEaWN0aW9uYXJ5KHNvdXJjZSwgZikge1xuICByZXR1cm4gT2JqZWN0LmtleXMoc291cmNlKS5yZWR1Y2UoZnVuY3Rpb24odGFyZ2V0LCBrZXkpIHtcbiAgICAodGFyZ2V0IHx8IDApW2tleV0gPSBmKChzb3VyY2UgfHwgMClba2V5XSk7XG4gICAgcmV0dXJuIHRhcmdldDtcbiAgfSwge30pO1xufTtcbmV4cG9ydHMubWFwRGljdGlvbmFyeSA9IG1hcERpY3Rpb25hcnk7XG5cbnZhciB0b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG5leHBvcnRzLnRvU3RyaW5nID0gdG9TdHJpbmc7XG5cbnZhciBpc0ZuID0gdHlwZW9mKC8uLykgPT09IFwiZnVuY3Rpb25cIiA/XG4gIGZ1bmN0aW9uIGlzRm4oeCkge1xuICAgIHJldHVybiB0b1N0cmluZy5jYWxsKHgpID09PSBcIltvYmplY3QgRnVuY3Rpb25dXCI7XG4gIH0gOlxuICBmdW5jdGlvbiBpc0ZuKHgpIHtcbiAgICByZXR1cm4gdHlwZW9mKHgpID09PSBcImZ1bmN0aW9uXCI7XG4gIH07XG5leHBvcnRzLmlzRm4gPSBpc0ZuO1xuXG52YXIgaXNTdHJpbmcgPSBmdW5jdGlvbiBpc1N0cmluZyh4KSB7XG4gIHJldHVybiAodHlwZW9mKHgpID09PSBcInN0cmluZ1wiKSB8fCAodG9TdHJpbmcuY2FsbCh4KSA9PT0gXCJbb2JqZWN0IFN0cmluZ11cIik7XG59O1xuZXhwb3J0cy5pc1N0cmluZyA9IGlzU3RyaW5nO1xuXG52YXIgaXNOdW1iZXIgPSBmdW5jdGlvbiBpc051bWJlcih4KSB7XG4gIHJldHVybiAodHlwZW9mKHgpID09PSBcIm51bWJlclwiKSB8fCAodG9TdHJpbmcuY2FsbCh4KSA9PT0gXCJbb2JqZWN0IE51bWJlcl1cIik7XG59O1xuZXhwb3J0cy5pc051bWJlciA9IGlzTnVtYmVyO1xuXG52YXIgaXNWZWN0b3IgPSBpc0ZuKEFycmF5LmlzQXJyYXkpID9cbiAgQXJyYXkuaXNBcnJheSA6XG4gIGZ1bmN0aW9uIGlzVmVjdG9yKHgpIHtcbiAgICByZXR1cm4gdG9TdHJpbmcuY2FsbCh4KSA9PT0gXCJbb2JqZWN0IEFycmF5XVwiO1xuICB9O1xuZXhwb3J0cy5pc1ZlY3RvciA9IGlzVmVjdG9yO1xuXG52YXIgaXNEYXRlID0gZnVuY3Rpb24gaXNEYXRlKHgpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwoeCkgPT09IFwiW29iamVjdCBEYXRlXVwiO1xufTtcbmV4cG9ydHMuaXNEYXRlID0gaXNEYXRlO1xuXG52YXIgaXNCb29sZWFuID0gZnVuY3Rpb24gaXNCb29sZWFuKHgpIHtcbiAgcmV0dXJuICh4ID09PSB0cnVlKSB8fCAoeCA9PT0gZmFsc2UpIHx8ICh0b1N0cmluZy5jYWxsKHgpID09PSBcIltvYmplY3QgQm9vbGVhbl1cIik7XG59O1xuZXhwb3J0cy5pc0Jvb2xlYW4gPSBpc0Jvb2xlYW47XG5cbnZhciBpc1JlUGF0dGVybiA9IGZ1bmN0aW9uIGlzUmVQYXR0ZXJuKHgpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwoeCkgPT09IFwiW29iamVjdCBSZWdFeHBdXCI7XG59O1xuZXhwb3J0cy5pc1JlUGF0dGVybiA9IGlzUmVQYXR0ZXJuO1xuXG52YXIgaXNPYmplY3QgPSBmdW5jdGlvbiBpc09iamVjdCh4KSB7XG4gIHJldHVybiB4ICYmICh0eXBlb2YoeCkgPT09IFwib2JqZWN0XCIpO1xufTtcbmV4cG9ydHMuaXNPYmplY3QgPSBpc09iamVjdDtcblxudmFyIGlzTmlsID0gZnVuY3Rpb24gaXNOaWwoeCkge1xuICByZXR1cm4gKHggPT09IHZvaWQoMCkpIHx8ICh4ID09PSBudWxsKTtcbn07XG5leHBvcnRzLmlzTmlsID0gaXNOaWw7XG5cbnZhciBpc1RydWUgPSBmdW5jdGlvbiBpc1RydWUoeCkge1xuICByZXR1cm4geCA9PT0gdHJ1ZTtcbn07XG5leHBvcnRzLmlzVHJ1ZSA9IGlzVHJ1ZTtcblxudmFyIGlzRmFsc2UgPSBmdW5jdGlvbiBpc0ZhbHNlKHgpIHtcbiAgcmV0dXJuIHggPT09IHRydWU7XG59O1xuZXhwb3J0cy5pc0ZhbHNlID0gaXNGYWxzZTtcblxudmFyIHJlRmluZCA9IGZ1bmN0aW9uIHJlRmluZChyZSwgcykge1xuICB2YXIgbWF0Y2hlcyA9IHJlLmV4ZWMocyk7XG4gIHJldHVybiAhKGlzTmlsKG1hdGNoZXMpKSA/XG4gICAgbWF0Y2hlcy5sZW5ndGggPT09IDEgP1xuICAgICAgKG1hdGNoZXMgfHwgMClbMF0gOlxuICAgICAgbWF0Y2hlcyA6XG4gICAgdm9pZCgwKTtcbn07XG5leHBvcnRzLnJlRmluZCA9IHJlRmluZDtcblxudmFyIHJlTWF0Y2hlcyA9IGZ1bmN0aW9uIHJlTWF0Y2hlcyhwYXR0ZXJuLCBzb3VyY2UpIHtcbiAgdmFyIG1hdGNoZXMgPSBwYXR0ZXJuLmV4ZWMoc291cmNlKTtcbiAgcmV0dXJuICghKGlzTmlsKG1hdGNoZXMpKSkgJiYgKChtYXRjaGVzIHx8IDApWzBdID09PSBzb3VyY2UpID9cbiAgICBtYXRjaGVzLmxlbmd0aCA9PT0gMSA/XG4gICAgICAobWF0Y2hlcyB8fCAwKVswXSA6XG4gICAgICBtYXRjaGVzIDpcbiAgICB2b2lkKDApO1xufTtcbmV4cG9ydHMucmVNYXRjaGVzID0gcmVNYXRjaGVzO1xuXG52YXIgcmVQYXR0ZXJuID0gZnVuY3Rpb24gcmVQYXR0ZXJuKHMpIHtcbiAgdmFyIG1hdGNoID0gcmVGaW5kKC9eKD86XFwoXFw/KFtpZG1zdXhdKilcXCkpPyguKikvLCBzKTtcbiAgcmV0dXJuIG5ldyBSZWdFeHAoKG1hdGNoIHx8IDApWzJdLCAobWF0Y2ggfHwgMClbMV0pO1xufTtcbmV4cG9ydHMucmVQYXR0ZXJuID0gcmVQYXR0ZXJuO1xuXG52YXIgaW5jID0gZnVuY3Rpb24gaW5jKHgpIHtcbiAgcmV0dXJuIHggKyAxO1xufTtcbmV4cG9ydHMuaW5jID0gaW5jO1xuXG52YXIgZGVjID0gZnVuY3Rpb24gZGVjKHgpIHtcbiAgcmV0dXJuIHggLSAxO1xufTtcbmV4cG9ydHMuZGVjID0gZGVjO1xuXG52YXIgc3RyID0gZnVuY3Rpb24gc3RyKCkge1xuICByZXR1cm4gU3RyaW5nLnByb3RvdHlwZS5jb25jYXQuYXBwbHkoXCJcIiwgYXJndW1lbnRzKTtcbn07XG5leHBvcnRzLnN0ciA9IHN0cjtcblxudmFyIGNoYXIgPSBmdW5jdGlvbiBjaGFyKGNvZGUpIHtcbiAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUoY29kZSk7XG59O1xuZXhwb3J0cy5jaGFyID0gY2hhcjtcblxudmFyIGludCA9IGZ1bmN0aW9uIGludCh4KSB7XG4gIHJldHVybiBpc051bWJlcih4KSA/XG4gICAgeCA+PSAwID9cbiAgICAgIE1hdGguZmxvb3IoeCkgOlxuICAgICAgTWF0aC5mbG9vcih4KSA6XG4gICAgeC5jaGFyQ29kZUF0KDApO1xufTtcbmV4cG9ydHMuaW50ID0gaW50O1xuXG52YXIgc3VicyA9IGZ1bmN0aW9uIHN1YnMoc3RyaW5nLCBzdGFydCwgZW5kKSB7XG4gIHJldHVybiBzdHJpbmcuc3Vic3RyaW5nKHN0YXJ0LCBlbmQpO1xufTtcbmV4cG9ydHMuc3VicyA9IHN1YnM7XG5cbnZhciBpc1BhdHRlcm5FcXVhbCA9IGZ1bmN0aW9uIGlzUGF0dGVybkVxdWFsKHgsIHkpIHtcbiAgcmV0dXJuIChpc1JlUGF0dGVybih4KSkgJiYgKGlzUmVQYXR0ZXJuKHkpKSAmJiAoeC5zb3VyY2UgPT09IHkuc291cmNlKSAmJiAoeC5nbG9iYWwgPT09IHkuZ2xvYmFsKSAmJiAoeC5tdWx0aWxpbmUgPT09IHkubXVsdGlsaW5lKSAmJiAoeC5pZ25vcmVDYXNlID09PSB5Lmlnbm9yZUNhc2UpO1xufTtcblxudmFyIGlzRGF0ZUVxdWFsID0gZnVuY3Rpb24gaXNEYXRlRXF1YWwoeCwgeSkge1xuICByZXR1cm4gKGlzRGF0ZSh4KSkgJiYgKGlzRGF0ZSh5KSkgJiYgKE51bWJlcih4KSA9PT0gTnVtYmVyKHkpKTtcbn07XG5cbnZhciBpc0RpY3Rpb25hcnlFcXVhbCA9IGZ1bmN0aW9uIGlzRGljdGlvbmFyeUVxdWFsKHgsIHkpIHtcbiAgcmV0dXJuIChpc09iamVjdCh4KSkgJiYgKGlzT2JqZWN0KHkpKSAmJiAoKGZ1bmN0aW9uKCkge1xuICAgIHZhciB4S2V5cyA9IGtleXMoeCk7XG4gICAgdmFyIHlLZXlzID0ga2V5cyh5KTtcbiAgICB2YXIgeENvdW50ID0geEtleXMubGVuZ3RoO1xuICAgIHZhciB5Q291bnQgPSB5S2V5cy5sZW5ndGg7XG4gICAgcmV0dXJuICh4Q291bnQgPT09IHlDb3VudCkgJiYgKChmdW5jdGlvbiBsb29wKGluZGV4LCBjb3VudCwga2V5cykge1xuICAgICAgdmFyIHJlY3VyID0gbG9vcDtcbiAgICAgIHdoaWxlIChyZWN1ciA9PT0gbG9vcCkge1xuICAgICAgICByZWN1ciA9IGluZGV4IDwgY291bnQgP1xuICAgICAgICBpc0VxdWl2YWxlbnQoKHggfHwgMClbKGtleXMgfHwgMClbaW5kZXhdXSwgKHkgfHwgMClbKGtleXMgfHwgMClbaW5kZXhdXSkgP1xuICAgICAgICAgIChpbmRleCA9IGluYyhpbmRleCksIGNvdW50ID0gY291bnQsIGtleXMgPSBrZXlzLCBsb29wKSA6XG4gICAgICAgICAgZmFsc2UgOlxuICAgICAgICB0cnVlO1xuICAgICAgfTtcbiAgICAgIHJldHVybiByZWN1cjtcbiAgICB9KSgwLCB4Q291bnQsIHhLZXlzKSk7XG4gIH0pKCkpO1xufTtcblxudmFyIGlzVmVjdG9yRXF1YWwgPSBmdW5jdGlvbiBpc1ZlY3RvckVxdWFsKHgsIHkpIHtcbiAgcmV0dXJuIChpc1ZlY3Rvcih4KSkgJiYgKGlzVmVjdG9yKHkpKSAmJiAoeC5sZW5ndGggPT09IHkubGVuZ3RoKSAmJiAoKGZ1bmN0aW9uIGxvb3AoeHMsIHlzLCBpbmRleCwgY291bnQpIHtcbiAgICB2YXIgcmVjdXIgPSBsb29wO1xuICAgIHdoaWxlIChyZWN1ciA9PT0gbG9vcCkge1xuICAgICAgcmVjdXIgPSBpbmRleCA8IGNvdW50ID9cbiAgICAgIGlzRXF1aXZhbGVudCgoeHMgfHwgMClbaW5kZXhdLCAoeXMgfHwgMClbaW5kZXhdKSA/XG4gICAgICAgICh4cyA9IHhzLCB5cyA9IHlzLCBpbmRleCA9IGluYyhpbmRleCksIGNvdW50ID0gY291bnQsIGxvb3ApIDpcbiAgICAgICAgZmFsc2UgOlxuICAgICAgdHJ1ZTtcbiAgICB9O1xuICAgIHJldHVybiByZWN1cjtcbiAgfSkoeCwgeSwgMCwgeC5sZW5ndGgpKTtcbn07XG5cbnZhciBpc0VxdWl2YWxlbnQgPSBmdW5jdGlvbiBpc0VxdWl2YWxlbnQoeCwgeSkge1xuICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICBjYXNlIDE6XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICBjYXNlIDI6XG4gICAgICByZXR1cm4gKHggPT09IHkpIHx8IChpc05pbCh4KSA/XG4gICAgICAgIGlzTmlsKHkpIDpcbiAgICAgIGlzTmlsKHkpID9cbiAgICAgICAgaXNOaWwoeCkgOlxuICAgICAgaXNTdHJpbmcoeCkgP1xuICAgICAgICBmYWxzZSA6XG4gICAgICBpc051bWJlcih4KSA/XG4gICAgICAgIGZhbHNlIDpcbiAgICAgIGlzRm4oeCkgP1xuICAgICAgICBmYWxzZSA6XG4gICAgICBpc0Jvb2xlYW4oeCkgP1xuICAgICAgICBmYWxzZSA6XG4gICAgICBpc0RhdGUoeCkgP1xuICAgICAgICBpc0RhdGVFcXVhbCh4LCB5KSA6XG4gICAgICBpc1ZlY3Rvcih4KSA/XG4gICAgICAgIGlzVmVjdG9yRXF1YWwoeCwgeSwgW10sIFtdKSA6XG4gICAgICBpc1JlUGF0dGVybih4KSA/XG4gICAgICAgIGlzUGF0dGVybkVxdWFsKHgsIHkpIDpcbiAgICAgIFwiZWxzZVwiID9cbiAgICAgICAgaXNEaWN0aW9uYXJ5RXF1YWwoeCwgeSkgOlxuICAgICAgICB2b2lkKDApKTtcblxuICAgIGRlZmF1bHQ6XG4gICAgICB2YXIgbW9yZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMik7XG4gICAgICByZXR1cm4gKGZ1bmN0aW9uIGxvb3AocHJldmlvdXMsIGN1cnJlbnQsIGluZGV4LCBjb3VudCkge1xuICAgICAgICB2YXIgcmVjdXIgPSBsb29wO1xuICAgICAgICB3aGlsZSAocmVjdXIgPT09IGxvb3ApIHtcbiAgICAgICAgICByZWN1ciA9IChpc0VxdWl2YWxlbnQocHJldmlvdXMsIGN1cnJlbnQpKSAmJiAoaW5kZXggPCBjb3VudCA/XG4gICAgICAgICAgKHByZXZpb3VzID0gY3VycmVudCwgY3VycmVudCA9IChtb3JlIHx8IDApW2luZGV4XSwgaW5kZXggPSBpbmMoaW5kZXgpLCBjb3VudCA9IGNvdW50LCBsb29wKSA6XG4gICAgICAgICAgdHJ1ZSk7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiByZWN1cjtcbiAgICAgIH0pKHgsIHksIDAsIG1vcmUubGVuZ3RoKTtcbiAgfTtcbiAgcmV0dXJuIHZvaWQoMCk7XG59O1xuXG52YXIgaXNFcXVhbCA9IGlzRXF1aXZhbGVudDtcbmV4cG9ydHMuaXNFcXVhbCA9IGlzRXF1YWw7XG5cbnZhciBpc1N0cmljdEVxdWFsID0gZnVuY3Rpb24gaXNTdHJpY3RFcXVhbCh4LCB5KSB7XG4gIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgIGNhc2UgMTpcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIGNhc2UgMjpcbiAgICAgIHJldHVybiB4ID09PSB5O1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIHZhciBtb3JlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAyKTtcbiAgICAgIHJldHVybiAoZnVuY3Rpb24gbG9vcChwcmV2aW91cywgY3VycmVudCwgaW5kZXgsIGNvdW50KSB7XG4gICAgICAgIHZhciByZWN1ciA9IGxvb3A7XG4gICAgICAgIHdoaWxlIChyZWN1ciA9PT0gbG9vcCkge1xuICAgICAgICAgIHJlY3VyID0gKHByZXZpb3VzID09PSBjdXJyZW50KSAmJiAoaW5kZXggPCBjb3VudCA/XG4gICAgICAgICAgKHByZXZpb3VzID0gY3VycmVudCwgY3VycmVudCA9IChtb3JlIHx8IDApW2luZGV4XSwgaW5kZXggPSBpbmMoaW5kZXgpLCBjb3VudCA9IGNvdW50LCBsb29wKSA6XG4gICAgICAgICAgdHJ1ZSk7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiByZWN1cjtcbiAgICAgIH0pKHgsIHksIDAsIG1vcmUubGVuZ3RoKTtcbiAgfTtcbiAgcmV0dXJuIHZvaWQoMCk7XG59O1xuZXhwb3J0cy5pc1N0cmljdEVxdWFsID0gaXNTdHJpY3RFcXVhbDtcblxudmFyIGdyZWF0ZXJUaGFuID0gZnVuY3Rpb24gZ3JlYXRlclRoYW4oeCwgeSkge1xuICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICBjYXNlIDE6XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICBjYXNlIDI6XG4gICAgICByZXR1cm4geCA+IHk7XG5cbiAgICBkZWZhdWx0OlxuICAgICAgdmFyIG1vcmUgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDIpO1xuICAgICAgcmV0dXJuIChmdW5jdGlvbiBsb29wKHByZXZpb3VzLCBjdXJyZW50LCBpbmRleCwgY291bnQpIHtcbiAgICAgICAgdmFyIHJlY3VyID0gbG9vcDtcbiAgICAgICAgd2hpbGUgKHJlY3VyID09PSBsb29wKSB7XG4gICAgICAgICAgcmVjdXIgPSAocHJldmlvdXMgPiBjdXJyZW50KSAmJiAoaW5kZXggPCBjb3VudCA/XG4gICAgICAgICAgKHByZXZpb3VzID0gY3VycmVudCwgY3VycmVudCA9IChtb3JlIHx8IDApW2luZGV4XSwgaW5kZXggPSBpbmMoaW5kZXgpLCBjb3VudCA9IGNvdW50LCBsb29wKSA6XG4gICAgICAgICAgdHJ1ZSk7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiByZWN1cjtcbiAgICAgIH0pKHgsIHksIDAsIG1vcmUubGVuZ3RoKTtcbiAgfTtcbiAgcmV0dXJuIHZvaWQoMCk7XG59O1xuZXhwb3J0cy5ncmVhdGVyVGhhbiA9IGdyZWF0ZXJUaGFuO1xuXG52YXIgbm90TGVzc1RoYW4gPSBmdW5jdGlvbiBub3RMZXNzVGhhbih4LCB5KSB7XG4gIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgIGNhc2UgMTpcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIGNhc2UgMjpcbiAgICAgIHJldHVybiB4ID49IHk7XG5cbiAgICBkZWZhdWx0OlxuICAgICAgdmFyIG1vcmUgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDIpO1xuICAgICAgcmV0dXJuIChmdW5jdGlvbiBsb29wKHByZXZpb3VzLCBjdXJyZW50LCBpbmRleCwgY291bnQpIHtcbiAgICAgICAgdmFyIHJlY3VyID0gbG9vcDtcbiAgICAgICAgd2hpbGUgKHJlY3VyID09PSBsb29wKSB7XG4gICAgICAgICAgcmVjdXIgPSAocHJldmlvdXMgPj0gY3VycmVudCkgJiYgKGluZGV4IDwgY291bnQgP1xuICAgICAgICAgIChwcmV2aW91cyA9IGN1cnJlbnQsIGN1cnJlbnQgPSAobW9yZSB8fCAwKVtpbmRleF0sIGluZGV4ID0gaW5jKGluZGV4KSwgY291bnQgPSBjb3VudCwgbG9vcCkgOlxuICAgICAgICAgIHRydWUpO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gcmVjdXI7XG4gICAgICB9KSh4LCB5LCAwLCBtb3JlLmxlbmd0aCk7XG4gIH07XG4gIHJldHVybiB2b2lkKDApO1xufTtcbmV4cG9ydHMubm90TGVzc1RoYW4gPSBub3RMZXNzVGhhbjtcblxudmFyIGxlc3NUaGFuID0gZnVuY3Rpb24gbGVzc1RoYW4oeCwgeSkge1xuICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICBjYXNlIDE6XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICBjYXNlIDI6XG4gICAgICByZXR1cm4geCA8IHk7XG5cbiAgICBkZWZhdWx0OlxuICAgICAgdmFyIG1vcmUgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDIpO1xuICAgICAgcmV0dXJuIChmdW5jdGlvbiBsb29wKHByZXZpb3VzLCBjdXJyZW50LCBpbmRleCwgY291bnQpIHtcbiAgICAgICAgdmFyIHJlY3VyID0gbG9vcDtcbiAgICAgICAgd2hpbGUgKHJlY3VyID09PSBsb29wKSB7XG4gICAgICAgICAgcmVjdXIgPSAocHJldmlvdXMgPCBjdXJyZW50KSAmJiAoaW5kZXggPCBjb3VudCA/XG4gICAgICAgICAgKHByZXZpb3VzID0gY3VycmVudCwgY3VycmVudCA9IChtb3JlIHx8IDApW2luZGV4XSwgaW5kZXggPSBpbmMoaW5kZXgpLCBjb3VudCA9IGNvdW50LCBsb29wKSA6XG4gICAgICAgICAgdHJ1ZSk7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiByZWN1cjtcbiAgICAgIH0pKHgsIHksIDAsIG1vcmUubGVuZ3RoKTtcbiAgfTtcbiAgcmV0dXJuIHZvaWQoMCk7XG59O1xuZXhwb3J0cy5sZXNzVGhhbiA9IGxlc3NUaGFuO1xuXG52YXIgbm90R3JlYXRlclRoYW4gPSBmdW5jdGlvbiBub3RHcmVhdGVyVGhhbih4LCB5KSB7XG4gIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgIGNhc2UgMTpcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIGNhc2UgMjpcbiAgICAgIHJldHVybiB4IDw9IHk7XG5cbiAgICBkZWZhdWx0OlxuICAgICAgdmFyIG1vcmUgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDIpO1xuICAgICAgcmV0dXJuIChmdW5jdGlvbiBsb29wKHByZXZpb3VzLCBjdXJyZW50LCBpbmRleCwgY291bnQpIHtcbiAgICAgICAgdmFyIHJlY3VyID0gbG9vcDtcbiAgICAgICAgd2hpbGUgKHJlY3VyID09PSBsb29wKSB7XG4gICAgICAgICAgcmVjdXIgPSAocHJldmlvdXMgPD0gY3VycmVudCkgJiYgKGluZGV4IDwgY291bnQgP1xuICAgICAgICAgIChwcmV2aW91cyA9IGN1cnJlbnQsIGN1cnJlbnQgPSAobW9yZSB8fCAwKVtpbmRleF0sIGluZGV4ID0gaW5jKGluZGV4KSwgY291bnQgPSBjb3VudCwgbG9vcCkgOlxuICAgICAgICAgIHRydWUpO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gcmVjdXI7XG4gICAgICB9KSh4LCB5LCAwLCBtb3JlLmxlbmd0aCk7XG4gIH07XG4gIHJldHVybiB2b2lkKDApO1xufTtcbmV4cG9ydHMubm90R3JlYXRlclRoYW4gPSBub3RHcmVhdGVyVGhhbjtcblxudmFyIHN1bSA9IGZ1bmN0aW9uIHN1bShhLCBiLCBjLCBkLCBlLCBmKSB7XG4gIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgIGNhc2UgMDpcbiAgICAgIHJldHVybiAwO1xuICAgIGNhc2UgMTpcbiAgICAgIHJldHVybiBhO1xuICAgIGNhc2UgMjpcbiAgICAgIHJldHVybiBhICsgYjtcbiAgICBjYXNlIDM6XG4gICAgICByZXR1cm4gYSArIGIgKyBjO1xuICAgIGNhc2UgNDpcbiAgICAgIHJldHVybiBhICsgYiArIGMgKyBkO1xuICAgIGNhc2UgNTpcbiAgICAgIHJldHVybiBhICsgYiArIGMgKyBkICsgZTtcbiAgICBjYXNlIDY6XG4gICAgICByZXR1cm4gYSArIGIgKyBjICsgZCArIGUgKyBmO1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIHZhciBtb3JlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCA2KTtcbiAgICAgIHJldHVybiAoZnVuY3Rpb24gbG9vcCh2YWx1ZSwgaW5kZXgsIGNvdW50KSB7XG4gICAgICAgIHZhciByZWN1ciA9IGxvb3A7XG4gICAgICAgIHdoaWxlIChyZWN1ciA9PT0gbG9vcCkge1xuICAgICAgICAgIHJlY3VyID0gaW5kZXggPCBjb3VudCA/XG4gICAgICAgICAgKHZhbHVlID0gdmFsdWUgKyAoKG1vcmUgfHwgMClbaW5kZXhdKSwgaW5kZXggPSBpbmMoaW5kZXgpLCBjb3VudCA9IGNvdW50LCBsb29wKSA6XG4gICAgICAgICAgdmFsdWU7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiByZWN1cjtcbiAgICAgIH0pKGEgKyBiICsgYyArIGQgKyBlICsgZiwgMCwgbW9yZS5sZW5ndGgpO1xuICB9O1xuICByZXR1cm4gdm9pZCgwKTtcbn07XG5leHBvcnRzLnN1bSA9IHN1bTtcblxudmFyIHN1YnRyYWN0ID0gZnVuY3Rpb24gc3VidHJhY3QoYSwgYiwgYywgZCwgZSwgZikge1xuICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICBjYXNlIDA6XG4gICAgICByZXR1cm4gKGZ1bmN0aW9uKCkgeyB0aHJvdyBUeXBlRXJyb3IoXCJXcm9uZyBudW1iZXIgb2YgYXJncyBwYXNzZWQgdG86IC1cIik7IH0pKCk7XG4gICAgY2FzZSAxOlxuICAgICAgcmV0dXJuIDAgLSBhO1xuICAgIGNhc2UgMjpcbiAgICAgIHJldHVybiBhIC0gYjtcbiAgICBjYXNlIDM6XG4gICAgICByZXR1cm4gYSAtIGIgLSBjO1xuICAgIGNhc2UgNDpcbiAgICAgIHJldHVybiBhIC0gYiAtIGMgLSBkO1xuICAgIGNhc2UgNTpcbiAgICAgIHJldHVybiBhIC0gYiAtIGMgLSBkIC0gZTtcbiAgICBjYXNlIDY6XG4gICAgICByZXR1cm4gYSAtIGIgLSBjIC0gZCAtIGUgLSBmO1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIHZhciBtb3JlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCA2KTtcbiAgICAgIHJldHVybiAoZnVuY3Rpb24gbG9vcCh2YWx1ZSwgaW5kZXgsIGNvdW50KSB7XG4gICAgICAgIHZhciByZWN1ciA9IGxvb3A7XG4gICAgICAgIHdoaWxlIChyZWN1ciA9PT0gbG9vcCkge1xuICAgICAgICAgIHJlY3VyID0gaW5kZXggPCBjb3VudCA/XG4gICAgICAgICAgKHZhbHVlID0gdmFsdWUgLSAoKG1vcmUgfHwgMClbaW5kZXhdKSwgaW5kZXggPSBpbmMoaW5kZXgpLCBjb3VudCA9IGNvdW50LCBsb29wKSA6XG4gICAgICAgICAgdmFsdWU7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiByZWN1cjtcbiAgICAgIH0pKGEgLSBiIC0gYyAtIGQgLSBlIC0gZiwgMCwgbW9yZS5sZW5ndGgpO1xuICB9O1xuICByZXR1cm4gdm9pZCgwKTtcbn07XG5leHBvcnRzLnN1YnRyYWN0ID0gc3VidHJhY3Q7XG5cbnZhciBkaXZpZGUgPSBmdW5jdGlvbiBkaXZpZGUoYSwgYiwgYywgZCwgZSwgZikge1xuICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICBjYXNlIDA6XG4gICAgICByZXR1cm4gKGZ1bmN0aW9uKCkgeyB0aHJvdyBUeXBlRXJyb3IoXCJXcm9uZyBudW1iZXIgb2YgYXJncyBwYXNzZWQgdG86IC9cIik7IH0pKCk7XG4gICAgY2FzZSAxOlxuICAgICAgcmV0dXJuIDEgLyBhO1xuICAgIGNhc2UgMjpcbiAgICAgIHJldHVybiBhIC8gYjtcbiAgICBjYXNlIDM6XG4gICAgICByZXR1cm4gYSAvIGIgLyBjO1xuICAgIGNhc2UgNDpcbiAgICAgIHJldHVybiBhIC8gYiAvIGMgLyBkO1xuICAgIGNhc2UgNTpcbiAgICAgIHJldHVybiBhIC8gYiAvIGMgLyBkIC8gZTtcbiAgICBjYXNlIDY6XG4gICAgICByZXR1cm4gYSAvIGIgLyBjIC8gZCAvIGUgLyBmO1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIHZhciBtb3JlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCA2KTtcbiAgICAgIHJldHVybiAoZnVuY3Rpb24gbG9vcCh2YWx1ZSwgaW5kZXgsIGNvdW50KSB7XG4gICAgICAgIHZhciByZWN1ciA9IGxvb3A7XG4gICAgICAgIHdoaWxlIChyZWN1ciA9PT0gbG9vcCkge1xuICAgICAgICAgIHJlY3VyID0gaW5kZXggPCBjb3VudCA/XG4gICAgICAgICAgKHZhbHVlID0gdmFsdWUgLyAoKG1vcmUgfHwgMClbaW5kZXhdKSwgaW5kZXggPSBpbmMoaW5kZXgpLCBjb3VudCA9IGNvdW50LCBsb29wKSA6XG4gICAgICAgICAgdmFsdWU7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiByZWN1cjtcbiAgICAgIH0pKGEgLyBiIC8gYyAvIGQgLyBlIC8gZiwgMCwgbW9yZS5sZW5ndGgpO1xuICB9O1xuICByZXR1cm4gdm9pZCgwKTtcbn07XG5leHBvcnRzLmRpdmlkZSA9IGRpdmlkZTtcblxudmFyIG11bHRpcGx5ID0gZnVuY3Rpb24gbXVsdGlwbHkoYSwgYiwgYywgZCwgZSwgZikge1xuICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICBjYXNlIDA6XG4gICAgICByZXR1cm4gMTtcbiAgICBjYXNlIDE6XG4gICAgICByZXR1cm4gYTtcbiAgICBjYXNlIDI6XG4gICAgICByZXR1cm4gYSAqIGI7XG4gICAgY2FzZSAzOlxuICAgICAgcmV0dXJuIGEgKiBiICogYztcbiAgICBjYXNlIDQ6XG4gICAgICByZXR1cm4gYSAqIGIgKiBjICogZDtcbiAgICBjYXNlIDU6XG4gICAgICByZXR1cm4gYSAqIGIgKiBjICogZCAqIGU7XG4gICAgY2FzZSA2OlxuICAgICAgcmV0dXJuIGEgKiBiICogYyAqIGQgKiBlICogZjtcblxuICAgIGRlZmF1bHQ6XG4gICAgICB2YXIgbW9yZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgNik7XG4gICAgICByZXR1cm4gKGZ1bmN0aW9uIGxvb3AodmFsdWUsIGluZGV4LCBjb3VudCkge1xuICAgICAgICB2YXIgcmVjdXIgPSBsb29wO1xuICAgICAgICB3aGlsZSAocmVjdXIgPT09IGxvb3ApIHtcbiAgICAgICAgICByZWN1ciA9IGluZGV4IDwgY291bnQgP1xuICAgICAgICAgICh2YWx1ZSA9IHZhbHVlICogKChtb3JlIHx8IDApW2luZGV4XSksIGluZGV4ID0gaW5jKGluZGV4KSwgY291bnQgPSBjb3VudCwgbG9vcCkgOlxuICAgICAgICAgIHZhbHVlO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gcmVjdXI7XG4gICAgICB9KShhICogYiAqIGMgKiBkICogZSAqIGYsIDAsIG1vcmUubGVuZ3RoKTtcbiAgfTtcbiAgcmV0dXJuIHZvaWQoMCk7XG59O1xuZXhwb3J0cy5tdWx0aXBseSA9IG11bHRpcGx5O1xuXG52YXIgYW5kID0gZnVuY3Rpb24gYW5kKGEsIGIsIGMsIGQsIGUsIGYpIHtcbiAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgY2FzZSAwOlxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgY2FzZSAxOlxuICAgICAgcmV0dXJuIGE7XG4gICAgY2FzZSAyOlxuICAgICAgcmV0dXJuIGEgJiYgYjtcbiAgICBjYXNlIDM6XG4gICAgICByZXR1cm4gYSAmJiBiICYmIGM7XG4gICAgY2FzZSA0OlxuICAgICAgcmV0dXJuIGEgJiYgYiAmJiBjICYmIGQ7XG4gICAgY2FzZSA1OlxuICAgICAgcmV0dXJuIGEgJiYgYiAmJiBjICYmIGQgJiYgZTtcbiAgICBjYXNlIDY6XG4gICAgICByZXR1cm4gYSAmJiBiICYmIGMgJiYgZCAmJiBlICYmIGY7XG5cbiAgICBkZWZhdWx0OlxuICAgICAgdmFyIG1vcmUgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDYpO1xuICAgICAgcmV0dXJuIChmdW5jdGlvbiBsb29wKHZhbHVlLCBpbmRleCwgY291bnQpIHtcbiAgICAgICAgdmFyIHJlY3VyID0gbG9vcDtcbiAgICAgICAgd2hpbGUgKHJlY3VyID09PSBsb29wKSB7XG4gICAgICAgICAgcmVjdXIgPSBpbmRleCA8IGNvdW50ID9cbiAgICAgICAgICAodmFsdWUgPSB2YWx1ZSAmJiAoKG1vcmUgfHwgMClbaW5kZXhdKSwgaW5kZXggPSBpbmMoaW5kZXgpLCBjb3VudCA9IGNvdW50LCBsb29wKSA6XG4gICAgICAgICAgdmFsdWU7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiByZWN1cjtcbiAgICAgIH0pKGEgJiYgYiAmJiBjICYmIGQgJiYgZSAmJiBmLCAwLCBtb3JlLmxlbmd0aCk7XG4gIH07XG4gIHJldHVybiB2b2lkKDApO1xufTtcbmV4cG9ydHMuYW5kID0gYW5kO1xuXG52YXIgb3IgPSBmdW5jdGlvbiBvcihhLCBiLCBjLCBkLCBlLCBmKSB7XG4gIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgIGNhc2UgMDpcbiAgICAgIHJldHVybiB2b2lkKDApO1xuICAgIGNhc2UgMTpcbiAgICAgIHJldHVybiBhO1xuICAgIGNhc2UgMjpcbiAgICAgIHJldHVybiBhIHx8IGI7XG4gICAgY2FzZSAzOlxuICAgICAgcmV0dXJuIGEgfHwgYiB8fCBjO1xuICAgIGNhc2UgNDpcbiAgICAgIHJldHVybiBhIHx8IGIgfHwgYyB8fCBkO1xuICAgIGNhc2UgNTpcbiAgICAgIHJldHVybiBhIHx8IGIgfHwgYyB8fCBkIHx8IGU7XG4gICAgY2FzZSA2OlxuICAgICAgcmV0dXJuIGEgfHwgYiB8fCBjIHx8IGQgfHwgZSB8fCBmO1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIHZhciBtb3JlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCA2KTtcbiAgICAgIHJldHVybiAoZnVuY3Rpb24gbG9vcCh2YWx1ZSwgaW5kZXgsIGNvdW50KSB7XG4gICAgICAgIHZhciByZWN1ciA9IGxvb3A7XG4gICAgICAgIHdoaWxlIChyZWN1ciA9PT0gbG9vcCkge1xuICAgICAgICAgIHJlY3VyID0gaW5kZXggPCBjb3VudCA/XG4gICAgICAgICAgKHZhbHVlID0gdmFsdWUgfHwgKChtb3JlIHx8IDApW2luZGV4XSksIGluZGV4ID0gaW5jKGluZGV4KSwgY291bnQgPSBjb3VudCwgbG9vcCkgOlxuICAgICAgICAgIHZhbHVlO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gcmVjdXI7XG4gICAgICB9KShhIHx8IGIgfHwgYyB8fCBkIHx8IGUgfHwgZiwgMCwgbW9yZS5sZW5ndGgpO1xuICB9O1xuICByZXR1cm4gdm9pZCgwKTtcbn07XG5leHBvcnRzLm9yID0gb3I7XG5cbnZhciBwcmludCA9IGZ1bmN0aW9uIHByaW50KCkge1xuICB2YXIgbW9yZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMCk7XG4gIHJldHVybiBjb25zb2xlLmxvZy5hcHBseShjb25zb2xlLmxvZywgbW9yZSk7XG59O1xuZXhwb3J0cy5wcmludCA9IHByaW50XG5cbn0pKCkiLCIoZnVuY3Rpb24oKXt2YXIgX25zXyA9IHtcbiAgXCJpZFwiOiBcIndpc3AucnVudGltZVwiLFxuICBcImRvY1wiOiBcIkNvcmUgcHJpbWl0aXZlcyByZXF1aXJlZCBmb3IgcnVudGltZVwiXG59OztcblxudmFyIGlkZW50aXR5ID0gZnVuY3Rpb24gaWRlbnRpdHkoeCkge1xuICByZXR1cm4geDtcbn07XG5leHBvcnRzLmlkZW50aXR5ID0gaWRlbnRpdHk7XG5cbnZhciBpc09kZCA9IGZ1bmN0aW9uIGlzT2RkKG4pIHtcbiAgcmV0dXJuIG4gJSAyID09PSAxO1xufTtcbmV4cG9ydHMuaXNPZGQgPSBpc09kZDtcblxudmFyIGlzRXZlbiA9IGZ1bmN0aW9uIGlzRXZlbihuKSB7XG4gIHJldHVybiBuICUgMiA9PT0gMDtcbn07XG5leHBvcnRzLmlzRXZlbiA9IGlzRXZlbjtcblxudmFyIGlzRGljdGlvbmFyeSA9IGZ1bmN0aW9uIGlzRGljdGlvbmFyeShmb3JtKSB7XG4gIHJldHVybiAoaXNPYmplY3QoZm9ybSkpICYmIChpc09iamVjdChPYmplY3QuZ2V0UHJvdG90eXBlT2YoZm9ybSkpKSAmJiAoaXNOaWwoT2JqZWN0LmdldFByb3RvdHlwZU9mKE9iamVjdC5nZXRQcm90b3R5cGVPZihmb3JtKSkpKTtcbn07XG5leHBvcnRzLmlzRGljdGlvbmFyeSA9IGlzRGljdGlvbmFyeTtcblxudmFyIGRpY3Rpb25hcnkgPSBmdW5jdGlvbiBkaWN0aW9uYXJ5KCkge1xuICByZXR1cm4gKGZ1bmN0aW9uIGxvb3Aoa2V5VmFsdWVzLCByZXN1bHQpIHtcbiAgICB2YXIgcmVjdXIgPSBsb29wO1xuICAgIHdoaWxlIChyZWN1ciA9PT0gbG9vcCkge1xuICAgICAgcmVjdXIgPSBrZXlWYWx1ZXMubGVuZ3RoID9cbiAgICAgIChmdW5jdGlvbigpIHtcbiAgICAgICAgKHJlc3VsdCB8fCAwKVsoa2V5VmFsdWVzIHx8IDApWzBdXSA9IChrZXlWYWx1ZXMgfHwgMClbMV07XG4gICAgICAgIHJldHVybiAoa2V5VmFsdWVzID0ga2V5VmFsdWVzLnNsaWNlKDIpLCByZXN1bHQgPSByZXN1bHQsIGxvb3ApO1xuICAgICAgfSkoKSA6XG4gICAgICByZXN1bHQ7XG4gICAgfTtcbiAgICByZXR1cm4gcmVjdXI7XG4gIH0pKEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyksIHt9KTtcbn07XG5leHBvcnRzLmRpY3Rpb25hcnkgPSBkaWN0aW9uYXJ5O1xuXG52YXIga2V5cyA9IGZ1bmN0aW9uIGtleXMoZGljdGlvbmFyeSkge1xuICByZXR1cm4gT2JqZWN0LmtleXMoZGljdGlvbmFyeSk7XG59O1xuZXhwb3J0cy5rZXlzID0ga2V5cztcblxudmFyIHZhbHMgPSBmdW5jdGlvbiB2YWxzKGRpY3Rpb25hcnkpIHtcbiAgcmV0dXJuIGtleXMoZGljdGlvbmFyeSkubWFwKGZ1bmN0aW9uKGtleSkge1xuICAgIHJldHVybiAoZGljdGlvbmFyeSB8fCAwKVtrZXldO1xuICB9KTtcbn07XG5leHBvcnRzLnZhbHMgPSB2YWxzO1xuXG52YXIga2V5VmFsdWVzID0gZnVuY3Rpb24ga2V5VmFsdWVzKGRpY3Rpb25hcnkpIHtcbiAgcmV0dXJuIGtleXMoZGljdGlvbmFyeSkubWFwKGZ1bmN0aW9uKGtleSkge1xuICAgIHJldHVybiBba2V5LCAoZGljdGlvbmFyeSB8fCAwKVtrZXldXTtcbiAgfSk7XG59O1xuZXhwb3J0cy5rZXlWYWx1ZXMgPSBrZXlWYWx1ZXM7XG5cbnZhciBtZXJnZSA9IGZ1bmN0aW9uIG1lcmdlKCkge1xuICByZXR1cm4gT2JqZWN0LmNyZWF0ZShPYmplY3QucHJvdG90eXBlLCBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpLnJlZHVjZShmdW5jdGlvbihkZXNjcmlwdG9yLCBkaWN0aW9uYXJ5KSB7XG4gICAgaXNPYmplY3QoZGljdGlvbmFyeSkgP1xuICAgICAgT2JqZWN0LmtleXMoZGljdGlvbmFyeSkuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgcmV0dXJuIChkZXNjcmlwdG9yIHx8IDApW2tleV0gPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGRpY3Rpb25hcnksIGtleSk7XG4gICAgICB9KSA6XG4gICAgICB2b2lkKDApO1xuICAgIHJldHVybiBkZXNjcmlwdG9yO1xuICB9LCBPYmplY3QuY3JlYXRlKE9iamVjdC5wcm90b3R5cGUpKSk7XG59O1xuZXhwb3J0cy5tZXJnZSA9IG1lcmdlO1xuXG52YXIgaXNDb250YWluc1ZlY3RvciA9IGZ1bmN0aW9uIGlzQ29udGFpbnNWZWN0b3IodmVjdG9yLCBlbGVtZW50KSB7XG4gIHJldHVybiB2ZWN0b3IuaW5kZXhPZihlbGVtZW50KSA+PSAwO1xufTtcbmV4cG9ydHMuaXNDb250YWluc1ZlY3RvciA9IGlzQ29udGFpbnNWZWN0b3I7XG5cbnZhciBtYXBEaWN0aW9uYXJ5ID0gZnVuY3Rpb24gbWFwRGljdGlvbmFyeShzb3VyY2UsIGYpIHtcbiAgcmV0dXJuIE9iamVjdC5rZXlzKHNvdXJjZSkucmVkdWNlKGZ1bmN0aW9uKHRhcmdldCwga2V5KSB7XG4gICAgKHRhcmdldCB8fCAwKVtrZXldID0gZigoc291cmNlIHx8IDApW2tleV0pO1xuICAgIHJldHVybiB0YXJnZXQ7XG4gIH0sIHt9KTtcbn07XG5leHBvcnRzLm1hcERpY3Rpb25hcnkgPSBtYXBEaWN0aW9uYXJ5O1xuXG52YXIgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuZXhwb3J0cy50b1N0cmluZyA9IHRvU3RyaW5nO1xuXG52YXIgaXNGbiA9IHR5cGVvZigvLi8pID09PSBcImZ1bmN0aW9uXCIgP1xuICBmdW5jdGlvbiBpc0ZuKHgpIHtcbiAgICByZXR1cm4gdG9TdHJpbmcuY2FsbCh4KSA9PT0gXCJbb2JqZWN0IEZ1bmN0aW9uXVwiO1xuICB9IDpcbiAgZnVuY3Rpb24gaXNGbih4KSB7XG4gICAgcmV0dXJuIHR5cGVvZih4KSA9PT0gXCJmdW5jdGlvblwiO1xuICB9O1xuZXhwb3J0cy5pc0ZuID0gaXNGbjtcblxudmFyIGlzU3RyaW5nID0gZnVuY3Rpb24gaXNTdHJpbmcoeCkge1xuICByZXR1cm4gKHR5cGVvZih4KSA9PT0gXCJzdHJpbmdcIikgfHwgKHRvU3RyaW5nLmNhbGwoeCkgPT09IFwiW29iamVjdCBTdHJpbmddXCIpO1xufTtcbmV4cG9ydHMuaXNTdHJpbmcgPSBpc1N0cmluZztcblxudmFyIGlzTnVtYmVyID0gZnVuY3Rpb24gaXNOdW1iZXIoeCkge1xuICByZXR1cm4gKHR5cGVvZih4KSA9PT0gXCJudW1iZXJcIikgfHwgKHRvU3RyaW5nLmNhbGwoeCkgPT09IFwiW29iamVjdCBOdW1iZXJdXCIpO1xufTtcbmV4cG9ydHMuaXNOdW1iZXIgPSBpc051bWJlcjtcblxudmFyIGlzVmVjdG9yID0gaXNGbihBcnJheS5pc0FycmF5KSA/XG4gIEFycmF5LmlzQXJyYXkgOlxuICBmdW5jdGlvbiBpc1ZlY3Rvcih4KSB7XG4gICAgcmV0dXJuIHRvU3RyaW5nLmNhbGwoeCkgPT09IFwiW29iamVjdCBBcnJheV1cIjtcbiAgfTtcbmV4cG9ydHMuaXNWZWN0b3IgPSBpc1ZlY3RvcjtcblxudmFyIGlzRGF0ZSA9IGZ1bmN0aW9uIGlzRGF0ZSh4KSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKHgpID09PSBcIltvYmplY3QgRGF0ZV1cIjtcbn07XG5leHBvcnRzLmlzRGF0ZSA9IGlzRGF0ZTtcblxudmFyIGlzQm9vbGVhbiA9IGZ1bmN0aW9uIGlzQm9vbGVhbih4KSB7XG4gIHJldHVybiAoeCA9PT0gdHJ1ZSkgfHwgKHggPT09IGZhbHNlKSB8fCAodG9TdHJpbmcuY2FsbCh4KSA9PT0gXCJbb2JqZWN0IEJvb2xlYW5dXCIpO1xufTtcbmV4cG9ydHMuaXNCb29sZWFuID0gaXNCb29sZWFuO1xuXG52YXIgaXNSZVBhdHRlcm4gPSBmdW5jdGlvbiBpc1JlUGF0dGVybih4KSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKHgpID09PSBcIltvYmplY3QgUmVnRXhwXVwiO1xufTtcbmV4cG9ydHMuaXNSZVBhdHRlcm4gPSBpc1JlUGF0dGVybjtcblxudmFyIGlzT2JqZWN0ID0gZnVuY3Rpb24gaXNPYmplY3QoeCkge1xuICByZXR1cm4geCAmJiAodHlwZW9mKHgpID09PSBcIm9iamVjdFwiKTtcbn07XG5leHBvcnRzLmlzT2JqZWN0ID0gaXNPYmplY3Q7XG5cbnZhciBpc05pbCA9IGZ1bmN0aW9uIGlzTmlsKHgpIHtcbiAgcmV0dXJuICh4ID09PSB2b2lkKDApKSB8fCAoeCA9PT0gbnVsbCk7XG59O1xuZXhwb3J0cy5pc05pbCA9IGlzTmlsO1xuXG52YXIgaXNUcnVlID0gZnVuY3Rpb24gaXNUcnVlKHgpIHtcbiAgcmV0dXJuIHggPT09IHRydWU7XG59O1xuZXhwb3J0cy5pc1RydWUgPSBpc1RydWU7XG5cbnZhciBpc0ZhbHNlID0gZnVuY3Rpb24gaXNGYWxzZSh4KSB7XG4gIHJldHVybiB4ID09PSB0cnVlO1xufTtcbmV4cG9ydHMuaXNGYWxzZSA9IGlzRmFsc2U7XG5cbnZhciByZUZpbmQgPSBmdW5jdGlvbiByZUZpbmQocmUsIHMpIHtcbiAgdmFyIG1hdGNoZXMgPSByZS5leGVjKHMpO1xuICByZXR1cm4gIShpc05pbChtYXRjaGVzKSkgP1xuICAgIG1hdGNoZXMubGVuZ3RoID09PSAxID9cbiAgICAgIChtYXRjaGVzIHx8IDApWzBdIDpcbiAgICAgIG1hdGNoZXMgOlxuICAgIHZvaWQoMCk7XG59O1xuZXhwb3J0cy5yZUZpbmQgPSByZUZpbmQ7XG5cbnZhciByZU1hdGNoZXMgPSBmdW5jdGlvbiByZU1hdGNoZXMocGF0dGVybiwgc291cmNlKSB7XG4gIHZhciBtYXRjaGVzID0gcGF0dGVybi5leGVjKHNvdXJjZSk7XG4gIHJldHVybiAoIShpc05pbChtYXRjaGVzKSkpICYmICgobWF0Y2hlcyB8fCAwKVswXSA9PT0gc291cmNlKSA/XG4gICAgbWF0Y2hlcy5sZW5ndGggPT09IDEgP1xuICAgICAgKG1hdGNoZXMgfHwgMClbMF0gOlxuICAgICAgbWF0Y2hlcyA6XG4gICAgdm9pZCgwKTtcbn07XG5leHBvcnRzLnJlTWF0Y2hlcyA9IHJlTWF0Y2hlcztcblxudmFyIHJlUGF0dGVybiA9IGZ1bmN0aW9uIHJlUGF0dGVybihzKSB7XG4gIHZhciBtYXRjaCA9IHJlRmluZCgvXig/OlxcKFxcPyhbaWRtc3V4XSopXFwpKT8oLiopLywgcyk7XG4gIHJldHVybiBuZXcgUmVnRXhwKChtYXRjaCB8fCAwKVsyXSwgKG1hdGNoIHx8IDApWzFdKTtcbn07XG5leHBvcnRzLnJlUGF0dGVybiA9IHJlUGF0dGVybjtcblxudmFyIGluYyA9IGZ1bmN0aW9uIGluYyh4KSB7XG4gIHJldHVybiB4ICsgMTtcbn07XG5leHBvcnRzLmluYyA9IGluYztcblxudmFyIGRlYyA9IGZ1bmN0aW9uIGRlYyh4KSB7XG4gIHJldHVybiB4IC0gMTtcbn07XG5leHBvcnRzLmRlYyA9IGRlYztcblxudmFyIHN0ciA9IGZ1bmN0aW9uIHN0cigpIHtcbiAgcmV0dXJuIFN0cmluZy5wcm90b3R5cGUuY29uY2F0LmFwcGx5KFwiXCIsIGFyZ3VtZW50cyk7XG59O1xuZXhwb3J0cy5zdHIgPSBzdHI7XG5cbnZhciBjaGFyID0gZnVuY3Rpb24gY2hhcihjb2RlKSB7XG4gIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKGNvZGUpO1xufTtcbmV4cG9ydHMuY2hhciA9IGNoYXI7XG5cbnZhciBpbnQgPSBmdW5jdGlvbiBpbnQoeCkge1xuICByZXR1cm4gaXNOdW1iZXIoeCkgP1xuICAgIHggPj0gMCA/XG4gICAgICBNYXRoLmZsb29yKHgpIDpcbiAgICAgIE1hdGguZmxvb3IoeCkgOlxuICAgIHguY2hhckNvZGVBdCgwKTtcbn07XG5leHBvcnRzLmludCA9IGludDtcblxudmFyIHN1YnMgPSBmdW5jdGlvbiBzdWJzKHN0cmluZywgc3RhcnQsIGVuZCkge1xuICByZXR1cm4gc3RyaW5nLnN1YnN0cmluZyhzdGFydCwgZW5kKTtcbn07XG5leHBvcnRzLnN1YnMgPSBzdWJzO1xuXG52YXIgaXNQYXR0ZXJuRXF1YWwgPSBmdW5jdGlvbiBpc1BhdHRlcm5FcXVhbCh4LCB5KSB7XG4gIHJldHVybiAoaXNSZVBhdHRlcm4oeCkpICYmIChpc1JlUGF0dGVybih5KSkgJiYgKHguc291cmNlID09PSB5LnNvdXJjZSkgJiYgKHguZ2xvYmFsID09PSB5Lmdsb2JhbCkgJiYgKHgubXVsdGlsaW5lID09PSB5Lm11bHRpbGluZSkgJiYgKHguaWdub3JlQ2FzZSA9PT0geS5pZ25vcmVDYXNlKTtcbn07XG5cbnZhciBpc0RhdGVFcXVhbCA9IGZ1bmN0aW9uIGlzRGF0ZUVxdWFsKHgsIHkpIHtcbiAgcmV0dXJuIChpc0RhdGUoeCkpICYmIChpc0RhdGUoeSkpICYmIChOdW1iZXIoeCkgPT09IE51bWJlcih5KSk7XG59O1xuXG52YXIgaXNEaWN0aW9uYXJ5RXF1YWwgPSBmdW5jdGlvbiBpc0RpY3Rpb25hcnlFcXVhbCh4LCB5KSB7XG4gIHJldHVybiAoaXNPYmplY3QoeCkpICYmIChpc09iamVjdCh5KSkgJiYgKChmdW5jdGlvbigpIHtcbiAgICB2YXIgeEtleXMgPSBrZXlzKHgpO1xuICAgIHZhciB5S2V5cyA9IGtleXMoeSk7XG4gICAgdmFyIHhDb3VudCA9IHhLZXlzLmxlbmd0aDtcbiAgICB2YXIgeUNvdW50ID0geUtleXMubGVuZ3RoO1xuICAgIHJldHVybiAoeENvdW50ID09PSB5Q291bnQpICYmICgoZnVuY3Rpb24gbG9vcChpbmRleCwgY291bnQsIGtleXMpIHtcbiAgICAgIHZhciByZWN1ciA9IGxvb3A7XG4gICAgICB3aGlsZSAocmVjdXIgPT09IGxvb3ApIHtcbiAgICAgICAgcmVjdXIgPSBpbmRleCA8IGNvdW50ID9cbiAgICAgICAgaXNFcXVpdmFsZW50KCh4IHx8IDApWyhrZXlzIHx8IDApW2luZGV4XV0sICh5IHx8IDApWyhrZXlzIHx8IDApW2luZGV4XV0pID9cbiAgICAgICAgICAoaW5kZXggPSBpbmMoaW5kZXgpLCBjb3VudCA9IGNvdW50LCBrZXlzID0ga2V5cywgbG9vcCkgOlxuICAgICAgICAgIGZhbHNlIDpcbiAgICAgICAgdHJ1ZTtcbiAgICAgIH07XG4gICAgICByZXR1cm4gcmVjdXI7XG4gICAgfSkoMCwgeENvdW50LCB4S2V5cykpO1xuICB9KSgpKTtcbn07XG5cbnZhciBpc1ZlY3RvckVxdWFsID0gZnVuY3Rpb24gaXNWZWN0b3JFcXVhbCh4LCB5KSB7XG4gIHJldHVybiAoaXNWZWN0b3IoeCkpICYmIChpc1ZlY3Rvcih5KSkgJiYgKHgubGVuZ3RoID09PSB5Lmxlbmd0aCkgJiYgKChmdW5jdGlvbiBsb29wKHhzLCB5cywgaW5kZXgsIGNvdW50KSB7XG4gICAgdmFyIHJlY3VyID0gbG9vcDtcbiAgICB3aGlsZSAocmVjdXIgPT09IGxvb3ApIHtcbiAgICAgIHJlY3VyID0gaW5kZXggPCBjb3VudCA/XG4gICAgICBpc0VxdWl2YWxlbnQoKHhzIHx8IDApW2luZGV4XSwgKHlzIHx8IDApW2luZGV4XSkgP1xuICAgICAgICAoeHMgPSB4cywgeXMgPSB5cywgaW5kZXggPSBpbmMoaW5kZXgpLCBjb3VudCA9IGNvdW50LCBsb29wKSA6XG4gICAgICAgIGZhbHNlIDpcbiAgICAgIHRydWU7XG4gICAgfTtcbiAgICByZXR1cm4gcmVjdXI7XG4gIH0pKHgsIHksIDAsIHgubGVuZ3RoKSk7XG59O1xuXG52YXIgaXNFcXVpdmFsZW50ID0gZnVuY3Rpb24gaXNFcXVpdmFsZW50KHgsIHkpIHtcbiAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgY2FzZSAxOlxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgY2FzZSAyOlxuICAgICAgcmV0dXJuICh4ID09PSB5KSB8fCAoaXNOaWwoeCkgP1xuICAgICAgICBpc05pbCh5KSA6XG4gICAgICBpc05pbCh5KSA/XG4gICAgICAgIGlzTmlsKHgpIDpcbiAgICAgIGlzU3RyaW5nKHgpID9cbiAgICAgICAgZmFsc2UgOlxuICAgICAgaXNOdW1iZXIoeCkgP1xuICAgICAgICBmYWxzZSA6XG4gICAgICBpc0ZuKHgpID9cbiAgICAgICAgZmFsc2UgOlxuICAgICAgaXNCb29sZWFuKHgpID9cbiAgICAgICAgZmFsc2UgOlxuICAgICAgaXNEYXRlKHgpID9cbiAgICAgICAgaXNEYXRlRXF1YWwoeCwgeSkgOlxuICAgICAgaXNWZWN0b3IoeCkgP1xuICAgICAgICBpc1ZlY3RvckVxdWFsKHgsIHksIFtdLCBbXSkgOlxuICAgICAgaXNSZVBhdHRlcm4oeCkgP1xuICAgICAgICBpc1BhdHRlcm5FcXVhbCh4LCB5KSA6XG4gICAgICBcImVsc2VcIiA/XG4gICAgICAgIGlzRGljdGlvbmFyeUVxdWFsKHgsIHkpIDpcbiAgICAgICAgdm9pZCgwKSk7XG5cbiAgICBkZWZhdWx0OlxuICAgICAgdmFyIG1vcmUgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDIpO1xuICAgICAgcmV0dXJuIChmdW5jdGlvbiBsb29wKHByZXZpb3VzLCBjdXJyZW50LCBpbmRleCwgY291bnQpIHtcbiAgICAgICAgdmFyIHJlY3VyID0gbG9vcDtcbiAgICAgICAgd2hpbGUgKHJlY3VyID09PSBsb29wKSB7XG4gICAgICAgICAgcmVjdXIgPSAoaXNFcXVpdmFsZW50KHByZXZpb3VzLCBjdXJyZW50KSkgJiYgKGluZGV4IDwgY291bnQgP1xuICAgICAgICAgIChwcmV2aW91cyA9IGN1cnJlbnQsIGN1cnJlbnQgPSAobW9yZSB8fCAwKVtpbmRleF0sIGluZGV4ID0gaW5jKGluZGV4KSwgY291bnQgPSBjb3VudCwgbG9vcCkgOlxuICAgICAgICAgIHRydWUpO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gcmVjdXI7XG4gICAgICB9KSh4LCB5LCAwLCBtb3JlLmxlbmd0aCk7XG4gIH07XG4gIHJldHVybiB2b2lkKDApO1xufTtcblxudmFyIGlzRXF1YWwgPSBpc0VxdWl2YWxlbnQ7XG5leHBvcnRzLmlzRXF1YWwgPSBpc0VxdWFsO1xuXG52YXIgaXNTdHJpY3RFcXVhbCA9IGZ1bmN0aW9uIGlzU3RyaWN0RXF1YWwoeCwgeSkge1xuICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICBjYXNlIDE6XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICBjYXNlIDI6XG4gICAgICByZXR1cm4geCA9PT0geTtcblxuICAgIGRlZmF1bHQ6XG4gICAgICB2YXIgbW9yZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMik7XG4gICAgICByZXR1cm4gKGZ1bmN0aW9uIGxvb3AocHJldmlvdXMsIGN1cnJlbnQsIGluZGV4LCBjb3VudCkge1xuICAgICAgICB2YXIgcmVjdXIgPSBsb29wO1xuICAgICAgICB3aGlsZSAocmVjdXIgPT09IGxvb3ApIHtcbiAgICAgICAgICByZWN1ciA9IChwcmV2aW91cyA9PT0gY3VycmVudCkgJiYgKGluZGV4IDwgY291bnQgP1xuICAgICAgICAgIChwcmV2aW91cyA9IGN1cnJlbnQsIGN1cnJlbnQgPSAobW9yZSB8fCAwKVtpbmRleF0sIGluZGV4ID0gaW5jKGluZGV4KSwgY291bnQgPSBjb3VudCwgbG9vcCkgOlxuICAgICAgICAgIHRydWUpO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gcmVjdXI7XG4gICAgICB9KSh4LCB5LCAwLCBtb3JlLmxlbmd0aCk7XG4gIH07XG4gIHJldHVybiB2b2lkKDApO1xufTtcbmV4cG9ydHMuaXNTdHJpY3RFcXVhbCA9IGlzU3RyaWN0RXF1YWw7XG5cbnZhciBncmVhdGVyVGhhbiA9IGZ1bmN0aW9uIGdyZWF0ZXJUaGFuKHgsIHkpIHtcbiAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgY2FzZSAxOlxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgY2FzZSAyOlxuICAgICAgcmV0dXJuIHggPiB5O1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIHZhciBtb3JlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAyKTtcbiAgICAgIHJldHVybiAoZnVuY3Rpb24gbG9vcChwcmV2aW91cywgY3VycmVudCwgaW5kZXgsIGNvdW50KSB7XG4gICAgICAgIHZhciByZWN1ciA9IGxvb3A7XG4gICAgICAgIHdoaWxlIChyZWN1ciA9PT0gbG9vcCkge1xuICAgICAgICAgIHJlY3VyID0gKHByZXZpb3VzID4gY3VycmVudCkgJiYgKGluZGV4IDwgY291bnQgP1xuICAgICAgICAgIChwcmV2aW91cyA9IGN1cnJlbnQsIGN1cnJlbnQgPSAobW9yZSB8fCAwKVtpbmRleF0sIGluZGV4ID0gaW5jKGluZGV4KSwgY291bnQgPSBjb3VudCwgbG9vcCkgOlxuICAgICAgICAgIHRydWUpO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gcmVjdXI7XG4gICAgICB9KSh4LCB5LCAwLCBtb3JlLmxlbmd0aCk7XG4gIH07XG4gIHJldHVybiB2b2lkKDApO1xufTtcbmV4cG9ydHMuZ3JlYXRlclRoYW4gPSBncmVhdGVyVGhhbjtcblxudmFyIG5vdExlc3NUaGFuID0gZnVuY3Rpb24gbm90TGVzc1RoYW4oeCwgeSkge1xuICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICBjYXNlIDE6XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICBjYXNlIDI6XG4gICAgICByZXR1cm4geCA+PSB5O1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIHZhciBtb3JlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAyKTtcbiAgICAgIHJldHVybiAoZnVuY3Rpb24gbG9vcChwcmV2aW91cywgY3VycmVudCwgaW5kZXgsIGNvdW50KSB7XG4gICAgICAgIHZhciByZWN1ciA9IGxvb3A7XG4gICAgICAgIHdoaWxlIChyZWN1ciA9PT0gbG9vcCkge1xuICAgICAgICAgIHJlY3VyID0gKHByZXZpb3VzID49IGN1cnJlbnQpICYmIChpbmRleCA8IGNvdW50ID9cbiAgICAgICAgICAocHJldmlvdXMgPSBjdXJyZW50LCBjdXJyZW50ID0gKG1vcmUgfHwgMClbaW5kZXhdLCBpbmRleCA9IGluYyhpbmRleCksIGNvdW50ID0gY291bnQsIGxvb3ApIDpcbiAgICAgICAgICB0cnVlKTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIHJlY3VyO1xuICAgICAgfSkoeCwgeSwgMCwgbW9yZS5sZW5ndGgpO1xuICB9O1xuICByZXR1cm4gdm9pZCgwKTtcbn07XG5leHBvcnRzLm5vdExlc3NUaGFuID0gbm90TGVzc1RoYW47XG5cbnZhciBsZXNzVGhhbiA9IGZ1bmN0aW9uIGxlc3NUaGFuKHgsIHkpIHtcbiAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgY2FzZSAxOlxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgY2FzZSAyOlxuICAgICAgcmV0dXJuIHggPCB5O1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIHZhciBtb3JlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAyKTtcbiAgICAgIHJldHVybiAoZnVuY3Rpb24gbG9vcChwcmV2aW91cywgY3VycmVudCwgaW5kZXgsIGNvdW50KSB7XG4gICAgICAgIHZhciByZWN1ciA9IGxvb3A7XG4gICAgICAgIHdoaWxlIChyZWN1ciA9PT0gbG9vcCkge1xuICAgICAgICAgIHJlY3VyID0gKHByZXZpb3VzIDwgY3VycmVudCkgJiYgKGluZGV4IDwgY291bnQgP1xuICAgICAgICAgIChwcmV2aW91cyA9IGN1cnJlbnQsIGN1cnJlbnQgPSAobW9yZSB8fCAwKVtpbmRleF0sIGluZGV4ID0gaW5jKGluZGV4KSwgY291bnQgPSBjb3VudCwgbG9vcCkgOlxuICAgICAgICAgIHRydWUpO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gcmVjdXI7XG4gICAgICB9KSh4LCB5LCAwLCBtb3JlLmxlbmd0aCk7XG4gIH07XG4gIHJldHVybiB2b2lkKDApO1xufTtcbmV4cG9ydHMubGVzc1RoYW4gPSBsZXNzVGhhbjtcblxudmFyIG5vdEdyZWF0ZXJUaGFuID0gZnVuY3Rpb24gbm90R3JlYXRlclRoYW4oeCwgeSkge1xuICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICBjYXNlIDE6XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICBjYXNlIDI6XG4gICAgICByZXR1cm4geCA8PSB5O1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIHZhciBtb3JlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAyKTtcbiAgICAgIHJldHVybiAoZnVuY3Rpb24gbG9vcChwcmV2aW91cywgY3VycmVudCwgaW5kZXgsIGNvdW50KSB7XG4gICAgICAgIHZhciByZWN1ciA9IGxvb3A7XG4gICAgICAgIHdoaWxlIChyZWN1ciA9PT0gbG9vcCkge1xuICAgICAgICAgIHJlY3VyID0gKHByZXZpb3VzIDw9IGN1cnJlbnQpICYmIChpbmRleCA8IGNvdW50ID9cbiAgICAgICAgICAocHJldmlvdXMgPSBjdXJyZW50LCBjdXJyZW50ID0gKG1vcmUgfHwgMClbaW5kZXhdLCBpbmRleCA9IGluYyhpbmRleCksIGNvdW50ID0gY291bnQsIGxvb3ApIDpcbiAgICAgICAgICB0cnVlKTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIHJlY3VyO1xuICAgICAgfSkoeCwgeSwgMCwgbW9yZS5sZW5ndGgpO1xuICB9O1xuICByZXR1cm4gdm9pZCgwKTtcbn07XG5leHBvcnRzLm5vdEdyZWF0ZXJUaGFuID0gbm90R3JlYXRlclRoYW47XG5cbnZhciBzdW0gPSBmdW5jdGlvbiBzdW0oYSwgYiwgYywgZCwgZSwgZikge1xuICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICBjYXNlIDA6XG4gICAgICByZXR1cm4gMDtcbiAgICBjYXNlIDE6XG4gICAgICByZXR1cm4gYTtcbiAgICBjYXNlIDI6XG4gICAgICByZXR1cm4gYSArIGI7XG4gICAgY2FzZSAzOlxuICAgICAgcmV0dXJuIGEgKyBiICsgYztcbiAgICBjYXNlIDQ6XG4gICAgICByZXR1cm4gYSArIGIgKyBjICsgZDtcbiAgICBjYXNlIDU6XG4gICAgICByZXR1cm4gYSArIGIgKyBjICsgZCArIGU7XG4gICAgY2FzZSA2OlxuICAgICAgcmV0dXJuIGEgKyBiICsgYyArIGQgKyBlICsgZjtcblxuICAgIGRlZmF1bHQ6XG4gICAgICB2YXIgbW9yZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgNik7XG4gICAgICByZXR1cm4gKGZ1bmN0aW9uIGxvb3AodmFsdWUsIGluZGV4LCBjb3VudCkge1xuICAgICAgICB2YXIgcmVjdXIgPSBsb29wO1xuICAgICAgICB3aGlsZSAocmVjdXIgPT09IGxvb3ApIHtcbiAgICAgICAgICByZWN1ciA9IGluZGV4IDwgY291bnQgP1xuICAgICAgICAgICh2YWx1ZSA9IHZhbHVlICsgKChtb3JlIHx8IDApW2luZGV4XSksIGluZGV4ID0gaW5jKGluZGV4KSwgY291bnQgPSBjb3VudCwgbG9vcCkgOlxuICAgICAgICAgIHZhbHVlO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gcmVjdXI7XG4gICAgICB9KShhICsgYiArIGMgKyBkICsgZSArIGYsIDAsIG1vcmUubGVuZ3RoKTtcbiAgfTtcbiAgcmV0dXJuIHZvaWQoMCk7XG59O1xuZXhwb3J0cy5zdW0gPSBzdW07XG5cbnZhciBzdWJ0cmFjdCA9IGZ1bmN0aW9uIHN1YnRyYWN0KGEsIGIsIGMsIGQsIGUsIGYpIHtcbiAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgY2FzZSAwOlxuICAgICAgcmV0dXJuIChmdW5jdGlvbigpIHsgdGhyb3cgVHlwZUVycm9yKFwiV3JvbmcgbnVtYmVyIG9mIGFyZ3MgcGFzc2VkIHRvOiAtXCIpOyB9KSgpO1xuICAgIGNhc2UgMTpcbiAgICAgIHJldHVybiAwIC0gYTtcbiAgICBjYXNlIDI6XG4gICAgICByZXR1cm4gYSAtIGI7XG4gICAgY2FzZSAzOlxuICAgICAgcmV0dXJuIGEgLSBiIC0gYztcbiAgICBjYXNlIDQ6XG4gICAgICByZXR1cm4gYSAtIGIgLSBjIC0gZDtcbiAgICBjYXNlIDU6XG4gICAgICByZXR1cm4gYSAtIGIgLSBjIC0gZCAtIGU7XG4gICAgY2FzZSA2OlxuICAgICAgcmV0dXJuIGEgLSBiIC0gYyAtIGQgLSBlIC0gZjtcblxuICAgIGRlZmF1bHQ6XG4gICAgICB2YXIgbW9yZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgNik7XG4gICAgICByZXR1cm4gKGZ1bmN0aW9uIGxvb3AodmFsdWUsIGluZGV4LCBjb3VudCkge1xuICAgICAgICB2YXIgcmVjdXIgPSBsb29wO1xuICAgICAgICB3aGlsZSAocmVjdXIgPT09IGxvb3ApIHtcbiAgICAgICAgICByZWN1ciA9IGluZGV4IDwgY291bnQgP1xuICAgICAgICAgICh2YWx1ZSA9IHZhbHVlIC0gKChtb3JlIHx8IDApW2luZGV4XSksIGluZGV4ID0gaW5jKGluZGV4KSwgY291bnQgPSBjb3VudCwgbG9vcCkgOlxuICAgICAgICAgIHZhbHVlO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gcmVjdXI7XG4gICAgICB9KShhIC0gYiAtIGMgLSBkIC0gZSAtIGYsIDAsIG1vcmUubGVuZ3RoKTtcbiAgfTtcbiAgcmV0dXJuIHZvaWQoMCk7XG59O1xuZXhwb3J0cy5zdWJ0cmFjdCA9IHN1YnRyYWN0O1xuXG52YXIgZGl2aWRlID0gZnVuY3Rpb24gZGl2aWRlKGEsIGIsIGMsIGQsIGUsIGYpIHtcbiAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgY2FzZSAwOlxuICAgICAgcmV0dXJuIChmdW5jdGlvbigpIHsgdGhyb3cgVHlwZUVycm9yKFwiV3JvbmcgbnVtYmVyIG9mIGFyZ3MgcGFzc2VkIHRvOiAvXCIpOyB9KSgpO1xuICAgIGNhc2UgMTpcbiAgICAgIHJldHVybiAxIC8gYTtcbiAgICBjYXNlIDI6XG4gICAgICByZXR1cm4gYSAvIGI7XG4gICAgY2FzZSAzOlxuICAgICAgcmV0dXJuIGEgLyBiIC8gYztcbiAgICBjYXNlIDQ6XG4gICAgICByZXR1cm4gYSAvIGIgLyBjIC8gZDtcbiAgICBjYXNlIDU6XG4gICAgICByZXR1cm4gYSAvIGIgLyBjIC8gZCAvIGU7XG4gICAgY2FzZSA2OlxuICAgICAgcmV0dXJuIGEgLyBiIC8gYyAvIGQgLyBlIC8gZjtcblxuICAgIGRlZmF1bHQ6XG4gICAgICB2YXIgbW9yZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgNik7XG4gICAgICByZXR1cm4gKGZ1bmN0aW9uIGxvb3AodmFsdWUsIGluZGV4LCBjb3VudCkge1xuICAgICAgICB2YXIgcmVjdXIgPSBsb29wO1xuICAgICAgICB3aGlsZSAocmVjdXIgPT09IGxvb3ApIHtcbiAgICAgICAgICByZWN1ciA9IGluZGV4IDwgY291bnQgP1xuICAgICAgICAgICh2YWx1ZSA9IHZhbHVlIC8gKChtb3JlIHx8IDApW2luZGV4XSksIGluZGV4ID0gaW5jKGluZGV4KSwgY291bnQgPSBjb3VudCwgbG9vcCkgOlxuICAgICAgICAgIHZhbHVlO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gcmVjdXI7XG4gICAgICB9KShhIC8gYiAvIGMgLyBkIC8gZSAvIGYsIDAsIG1vcmUubGVuZ3RoKTtcbiAgfTtcbiAgcmV0dXJuIHZvaWQoMCk7XG59O1xuZXhwb3J0cy5kaXZpZGUgPSBkaXZpZGU7XG5cbnZhciBtdWx0aXBseSA9IGZ1bmN0aW9uIG11bHRpcGx5KGEsIGIsIGMsIGQsIGUsIGYpIHtcbiAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgY2FzZSAwOlxuICAgICAgcmV0dXJuIDE7XG4gICAgY2FzZSAxOlxuICAgICAgcmV0dXJuIGE7XG4gICAgY2FzZSAyOlxuICAgICAgcmV0dXJuIGEgKiBiO1xuICAgIGNhc2UgMzpcbiAgICAgIHJldHVybiBhICogYiAqIGM7XG4gICAgY2FzZSA0OlxuICAgICAgcmV0dXJuIGEgKiBiICogYyAqIGQ7XG4gICAgY2FzZSA1OlxuICAgICAgcmV0dXJuIGEgKiBiICogYyAqIGQgKiBlO1xuICAgIGNhc2UgNjpcbiAgICAgIHJldHVybiBhICogYiAqIGMgKiBkICogZSAqIGY7XG5cbiAgICBkZWZhdWx0OlxuICAgICAgdmFyIG1vcmUgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDYpO1xuICAgICAgcmV0dXJuIChmdW5jdGlvbiBsb29wKHZhbHVlLCBpbmRleCwgY291bnQpIHtcbiAgICAgICAgdmFyIHJlY3VyID0gbG9vcDtcbiAgICAgICAgd2hpbGUgKHJlY3VyID09PSBsb29wKSB7XG4gICAgICAgICAgcmVjdXIgPSBpbmRleCA8IGNvdW50ID9cbiAgICAgICAgICAodmFsdWUgPSB2YWx1ZSAqICgobW9yZSB8fCAwKVtpbmRleF0pLCBpbmRleCA9IGluYyhpbmRleCksIGNvdW50ID0gY291bnQsIGxvb3ApIDpcbiAgICAgICAgICB2YWx1ZTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIHJlY3VyO1xuICAgICAgfSkoYSAqIGIgKiBjICogZCAqIGUgKiBmLCAwLCBtb3JlLmxlbmd0aCk7XG4gIH07XG4gIHJldHVybiB2b2lkKDApO1xufTtcbmV4cG9ydHMubXVsdGlwbHkgPSBtdWx0aXBseTtcblxudmFyIGFuZCA9IGZ1bmN0aW9uIGFuZChhLCBiLCBjLCBkLCBlLCBmKSB7XG4gIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgIGNhc2UgMDpcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIGNhc2UgMTpcbiAgICAgIHJldHVybiBhO1xuICAgIGNhc2UgMjpcbiAgICAgIHJldHVybiBhICYmIGI7XG4gICAgY2FzZSAzOlxuICAgICAgcmV0dXJuIGEgJiYgYiAmJiBjO1xuICAgIGNhc2UgNDpcbiAgICAgIHJldHVybiBhICYmIGIgJiYgYyAmJiBkO1xuICAgIGNhc2UgNTpcbiAgICAgIHJldHVybiBhICYmIGIgJiYgYyAmJiBkICYmIGU7XG4gICAgY2FzZSA2OlxuICAgICAgcmV0dXJuIGEgJiYgYiAmJiBjICYmIGQgJiYgZSAmJiBmO1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIHZhciBtb3JlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCA2KTtcbiAgICAgIHJldHVybiAoZnVuY3Rpb24gbG9vcCh2YWx1ZSwgaW5kZXgsIGNvdW50KSB7XG4gICAgICAgIHZhciByZWN1ciA9IGxvb3A7XG4gICAgICAgIHdoaWxlIChyZWN1ciA9PT0gbG9vcCkge1xuICAgICAgICAgIHJlY3VyID0gaW5kZXggPCBjb3VudCA/XG4gICAgICAgICAgKHZhbHVlID0gdmFsdWUgJiYgKChtb3JlIHx8IDApW2luZGV4XSksIGluZGV4ID0gaW5jKGluZGV4KSwgY291bnQgPSBjb3VudCwgbG9vcCkgOlxuICAgICAgICAgIHZhbHVlO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gcmVjdXI7XG4gICAgICB9KShhICYmIGIgJiYgYyAmJiBkICYmIGUgJiYgZiwgMCwgbW9yZS5sZW5ndGgpO1xuICB9O1xuICByZXR1cm4gdm9pZCgwKTtcbn07XG5leHBvcnRzLmFuZCA9IGFuZDtcblxudmFyIG9yID0gZnVuY3Rpb24gb3IoYSwgYiwgYywgZCwgZSwgZikge1xuICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICBjYXNlIDA6XG4gICAgICByZXR1cm4gdm9pZCgwKTtcbiAgICBjYXNlIDE6XG4gICAgICByZXR1cm4gYTtcbiAgICBjYXNlIDI6XG4gICAgICByZXR1cm4gYSB8fCBiO1xuICAgIGNhc2UgMzpcbiAgICAgIHJldHVybiBhIHx8IGIgfHwgYztcbiAgICBjYXNlIDQ6XG4gICAgICByZXR1cm4gYSB8fCBiIHx8IGMgfHwgZDtcbiAgICBjYXNlIDU6XG4gICAgICByZXR1cm4gYSB8fCBiIHx8IGMgfHwgZCB8fCBlO1xuICAgIGNhc2UgNjpcbiAgICAgIHJldHVybiBhIHx8IGIgfHwgYyB8fCBkIHx8IGUgfHwgZjtcblxuICAgIGRlZmF1bHQ6XG4gICAgICB2YXIgbW9yZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgNik7XG4gICAgICByZXR1cm4gKGZ1bmN0aW9uIGxvb3AodmFsdWUsIGluZGV4LCBjb3VudCkge1xuICAgICAgICB2YXIgcmVjdXIgPSBsb29wO1xuICAgICAgICB3aGlsZSAocmVjdXIgPT09IGxvb3ApIHtcbiAgICAgICAgICByZWN1ciA9IGluZGV4IDwgY291bnQgP1xuICAgICAgICAgICh2YWx1ZSA9IHZhbHVlIHx8ICgobW9yZSB8fCAwKVtpbmRleF0pLCBpbmRleCA9IGluYyhpbmRleCksIGNvdW50ID0gY291bnQsIGxvb3ApIDpcbiAgICAgICAgICB2YWx1ZTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIHJlY3VyO1xuICAgICAgfSkoYSB8fCBiIHx8IGMgfHwgZCB8fCBlIHx8IGYsIDAsIG1vcmUubGVuZ3RoKTtcbiAgfTtcbiAgcmV0dXJuIHZvaWQoMCk7XG59O1xuZXhwb3J0cy5vciA9IG9yO1xuXG52YXIgcHJpbnQgPSBmdW5jdGlvbiBwcmludCgpIHtcbiAgdmFyIG1vcmUgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDApO1xuICByZXR1cm4gY29uc29sZS5sb2cuYXBwbHkoY29uc29sZS5sb2csIG1vcmUpO1xufTtcbmV4cG9ydHMucHJpbnQgPSBwcmludFxufSkoKSIsInZhciBfbnNfID0ge1xuICBcImlkXCI6IFwid2lzcC5zZXF1ZW5jZVwiXG59O1xudmFyIHdpc3BfcnVudGltZSA9IHJlcXVpcmUoXCIuL3J1bnRpbWVcIik7XG52YXIgaXNOaWwgPSB3aXNwX3J1bnRpbWUuaXNOaWw7XG52YXIgaXNWZWN0b3IgPSB3aXNwX3J1bnRpbWUuaXNWZWN0b3I7XG52YXIgaXNGbiA9IHdpc3BfcnVudGltZS5pc0ZuO1xudmFyIGlzTnVtYmVyID0gd2lzcF9ydW50aW1lLmlzTnVtYmVyO1xudmFyIGlzU3RyaW5nID0gd2lzcF9ydW50aW1lLmlzU3RyaW5nO1xudmFyIGlzRGljdGlvbmFyeSA9IHdpc3BfcnVudGltZS5pc0RpY3Rpb25hcnk7XG52YXIga2V5VmFsdWVzID0gd2lzcF9ydW50aW1lLmtleVZhbHVlcztcbnZhciBzdHIgPSB3aXNwX3J1bnRpbWUuc3RyO1xudmFyIGRlYyA9IHdpc3BfcnVudGltZS5kZWM7XG52YXIgaW5jID0gd2lzcF9ydW50aW1lLmluYztcbnZhciBtZXJnZSA9IHdpc3BfcnVudGltZS5tZXJnZTtcbnZhciBkaWN0aW9uYXJ5ID0gd2lzcF9ydW50aW1lLmRpY3Rpb25hcnk7OztcblxudmFyIExpc3QgPSBmdW5jdGlvbiBMaXN0KGhlYWQsIHRhaWwpIHtcbiAgdGhpcy5oZWFkID0gaGVhZDtcbiAgdGhpcy50YWlsID0gdGFpbCB8fCAobGlzdCgpKTtcbiAgdGhpcy5sZW5ndGggPSBpbmMoY291bnQodGhpcy50YWlsKSk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuTGlzdC5wcm90b3R5cGUubGVuZ3RoID0gMDtcblxuTGlzdC50eXBlID0gXCJ3aXNwLmxpc3RcIjtcblxuTGlzdC5wcm90b3R5cGUudHlwZSA9IExpc3QudHlwZTtcblxuTGlzdC5wcm90b3R5cGUudGFpbCA9IE9iamVjdC5jcmVhdGUoTGlzdC5wcm90b3R5cGUpO1xuXG5MaXN0LnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gKGZ1bmN0aW9uIGxvb3AocmVzdWx0LCBsaXN0KSB7XG4gICAgdmFyIHJlY3VyID0gbG9vcDtcbiAgICB3aGlsZSAocmVjdXIgPT09IGxvb3ApIHtcbiAgICAgIHJlY3VyID0gaXNFbXB0eShsaXN0KSA/XG4gICAgICBcIlwiICsgXCIoXCIgKyAocmVzdWx0LnN1YnN0cigxKSkgKyBcIilcIiA6XG4gICAgICAocmVzdWx0ID0gXCJcIiArIHJlc3VsdCArIFwiIFwiICsgKGlzVmVjdG9yKGZpcnN0KGxpc3QpKSA/XG4gICAgICAgIFwiXCIgKyBcIltcIiArIChmaXJzdChsaXN0KS5qb2luKFwiIFwiKSkgKyBcIl1cIiA6XG4gICAgICBpc05pbChmaXJzdChsaXN0KSkgP1xuICAgICAgICBcIm5pbFwiIDpcbiAgICAgIGlzU3RyaW5nKGZpcnN0KGxpc3QpKSA/XG4gICAgICAgIEpTT04uc3RyaW5naWZ5KGZpcnN0KGxpc3QpKSA6XG4gICAgICBpc051bWJlcihmaXJzdChsaXN0KSkgP1xuICAgICAgICBKU09OLnN0cmluZ2lmeShmaXJzdChsaXN0KSkgOlxuICAgICAgICBmaXJzdChsaXN0KSksIGxpc3QgPSByZXN0KGxpc3QpLCBsb29wKTtcbiAgICB9O1xuICAgIHJldHVybiByZWN1cjtcbiAgfSkoXCJcIiwgdGhpcyk7XG59O1xuXG52YXIgbGF6eVNlcVZhbHVlID0gZnVuY3Rpb24gbGF6eVNlcVZhbHVlKGxhenlTZXEpIHtcbiAgcmV0dXJuICEobGF6eVNlcS5yZWFsaXplZCkgP1xuICAgIChsYXp5U2VxLnJlYWxpemVkID0gdHJ1ZSkgJiYgKGxhenlTZXEueCA9IGxhenlTZXEueCgpKSA6XG4gICAgbGF6eVNlcS54O1xufTtcblxudmFyIExhenlTZXEgPSBmdW5jdGlvbiBMYXp5U2VxKHJlYWxpemVkLCB4KSB7XG4gIHRoaXMucmVhbGl6ZWQgPSByZWFsaXplZCB8fCBmYWxzZTtcbiAgdGhpcy54ID0geDtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5MYXp5U2VxLnR5cGUgPSBcIndpc3AubGF6eS5zZXFcIjtcblxuTGF6eVNlcS5wcm90b3R5cGUudHlwZSA9IExhenlTZXEudHlwZTtcblxudmFyIGxhenlTZXEgPSBmdW5jdGlvbiBsYXp5U2VxKHJlYWxpemVkLCBib2R5KSB7XG4gIHJldHVybiBuZXcgTGF6eVNlcShyZWFsaXplZCwgYm9keSk7XG59O1xuZXhwb3J0cy5sYXp5U2VxID0gbGF6eVNlcTtcblxudmFyIGlzTGF6eVNlcSA9IGZ1bmN0aW9uIGlzTGF6eVNlcSh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgJiYgKExhenlTZXEudHlwZSA9PT0gdmFsdWUudHlwZSk7XG59O1xuZXhwb3J0cy5pc0xhenlTZXEgPSBpc0xhenlTZXE7XG5cbnVuZGVmaW5lZDtcblxudmFyIGlzTGlzdCA9IGZ1bmN0aW9uIGlzTGlzdCh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgJiYgKExpc3QudHlwZSA9PT0gdmFsdWUudHlwZSk7XG59O1xuZXhwb3J0cy5pc0xpc3QgPSBpc0xpc3Q7XG5cbnZhciBsaXN0ID0gZnVuY3Rpb24gbGlzdCgpIHtcbiAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPT09IDAgP1xuICAgIE9iamVjdC5jcmVhdGUoTGlzdC5wcm90b3R5cGUpIDpcbiAgICBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpLnJlZHVjZVJpZ2h0KGZ1bmN0aW9uKHRhaWwsIGhlYWQpIHtcbiAgICAgIHJldHVybiBjb25zKGhlYWQsIHRhaWwpO1xuICAgIH0sIGxpc3QoKSk7XG59O1xuZXhwb3J0cy5saXN0ID0gbGlzdDtcblxudmFyIGNvbnMgPSBmdW5jdGlvbiBjb25zKGhlYWQsIHRhaWwpIHtcbiAgcmV0dXJuIG5ldyBMaXN0KGhlYWQsIHRhaWwpO1xufTtcbmV4cG9ydHMuY29ucyA9IGNvbnM7XG5cbnZhciByZXZlcnNlTGlzdCA9IGZ1bmN0aW9uIHJldmVyc2VMaXN0KHNlcXVlbmNlKSB7XG4gIHJldHVybiAoZnVuY3Rpb24gbG9vcChpdGVtcywgc291cmNlKSB7XG4gICAgdmFyIHJlY3VyID0gbG9vcDtcbiAgICB3aGlsZSAocmVjdXIgPT09IGxvb3ApIHtcbiAgICAgIHJlY3VyID0gaXNFbXB0eShzb3VyY2UpID9cbiAgICAgIGxpc3QuYXBwbHkobGlzdCwgaXRlbXMpIDpcbiAgICAgIChpdGVtcyA9IFtmaXJzdChzb3VyY2UpXS5jb25jYXQoaXRlbXMpLCBzb3VyY2UgPSByZXN0KHNvdXJjZSksIGxvb3ApO1xuICAgIH07XG4gICAgcmV0dXJuIHJlY3VyO1xuICB9KShbXSwgc2VxdWVuY2UpO1xufTtcblxudmFyIGlzU2VxdWVudGlhbCA9IGZ1bmN0aW9uIGlzU2VxdWVudGlhbCh4KSB7XG4gIHJldHVybiAoaXNMaXN0KHgpKSB8fCAoaXNWZWN0b3IoeCkpIHx8IChpc0xhenlTZXEoeCkpIHx8IChpc0RpY3Rpb25hcnkoeCkpIHx8IChpc1N0cmluZyh4KSk7XG59O1xuZXhwb3J0cy5pc1NlcXVlbnRpYWwgPSBpc1NlcXVlbnRpYWw7XG5cbnZhciByZXZlcnNlID0gZnVuY3Rpb24gcmV2ZXJzZShzZXF1ZW5jZSkge1xuICByZXR1cm4gaXNMaXN0KHNlcXVlbmNlKSA/XG4gICAgcmV2ZXJzZUxpc3Qoc2VxdWVuY2UpIDpcbiAgaXNWZWN0b3Ioc2VxdWVuY2UpID9cbiAgICBzZXF1ZW5jZS5yZXZlcnNlKCkgOlxuICBpc05pbChzZXF1ZW5jZSkgP1xuICAgIGxpc3QoKSA6XG4gIFwiZWxzZVwiID9cbiAgICByZXZlcnNlKHNlcShzZXF1ZW5jZSkpIDpcbiAgICB2b2lkKDApO1xufTtcbmV4cG9ydHMucmV2ZXJzZSA9IHJldmVyc2U7XG5cbnZhciBtYXAgPSBmdW5jdGlvbiBtYXAoZiwgc2VxdWVuY2UpIHtcbiAgcmV0dXJuIGlzVmVjdG9yKHNlcXVlbmNlKSA/XG4gICAgc2VxdWVuY2UubWFwKGYpIDpcbiAgaXNMaXN0KHNlcXVlbmNlKSA/XG4gICAgbWFwTGlzdChmLCBzZXF1ZW5jZSkgOlxuICBpc05pbChzZXF1ZW5jZSkgP1xuICAgIGxpc3QoKSA6XG4gIFwiZWxzZVwiID9cbiAgICBtYXAoZiwgc2VxKHNlcXVlbmNlKSkgOlxuICAgIHZvaWQoMCk7XG59O1xuZXhwb3J0cy5tYXAgPSBtYXA7XG5cbnZhciBtYXBMaXN0ID0gZnVuY3Rpb24gbWFwTGlzdChmLCBzZXF1ZW5jZSkge1xuICByZXR1cm4gKGZ1bmN0aW9uIGxvb3AocmVzdWx0LCBpdGVtcykge1xuICAgIHZhciByZWN1ciA9IGxvb3A7XG4gICAgd2hpbGUgKHJlY3VyID09PSBsb29wKSB7XG4gICAgICByZWN1ciA9IGlzRW1wdHkoaXRlbXMpID9cbiAgICAgIHJldmVyc2UocmVzdWx0KSA6XG4gICAgICAocmVzdWx0ID0gY29ucyhmKGZpcnN0KGl0ZW1zKSksIHJlc3VsdCksIGl0ZW1zID0gcmVzdChpdGVtcyksIGxvb3ApO1xuICAgIH07XG4gICAgcmV0dXJuIHJlY3VyO1xuICB9KShsaXN0KCksIHNlcXVlbmNlKTtcbn07XG5cbnZhciBmaWx0ZXIgPSBmdW5jdGlvbiBmaWx0ZXIoaXNGLCBzZXF1ZW5jZSkge1xuICByZXR1cm4gaXNWZWN0b3Ioc2VxdWVuY2UpID9cbiAgICBzZXF1ZW5jZS5maWx0ZXIoaXNGKSA6XG4gIGlzTGlzdChzZXF1ZW5jZSkgP1xuICAgIGZpbHRlckxpc3QoaXNGLCBzZXF1ZW5jZSkgOlxuICBpc05pbChzZXF1ZW5jZSkgP1xuICAgIGxpc3QoKSA6XG4gIFwiZWxzZVwiID9cbiAgICBmaWx0ZXIoaXNGLCBzZXEoc2VxdWVuY2UpKSA6XG4gICAgdm9pZCgwKTtcbn07XG5leHBvcnRzLmZpbHRlciA9IGZpbHRlcjtcblxudmFyIGZpbHRlckxpc3QgPSBmdW5jdGlvbiBmaWx0ZXJMaXN0KGlzRiwgc2VxdWVuY2UpIHtcbiAgcmV0dXJuIChmdW5jdGlvbiBsb29wKHJlc3VsdCwgaXRlbXMpIHtcbiAgICB2YXIgcmVjdXIgPSBsb29wO1xuICAgIHdoaWxlIChyZWN1ciA9PT0gbG9vcCkge1xuICAgICAgcmVjdXIgPSBpc0VtcHR5KGl0ZW1zKSA/XG4gICAgICByZXZlcnNlKHJlc3VsdCkgOlxuICAgICAgKHJlc3VsdCA9IGlzRihmaXJzdChpdGVtcykpID9cbiAgICAgICAgY29ucyhmaXJzdChpdGVtcyksIHJlc3VsdCkgOlxuICAgICAgICByZXN1bHQsIGl0ZW1zID0gcmVzdChpdGVtcyksIGxvb3ApO1xuICAgIH07XG4gICAgcmV0dXJuIHJlY3VyO1xuICB9KShsaXN0KCksIHNlcXVlbmNlKTtcbn07XG5cbnZhciByZWR1Y2UgPSBmdW5jdGlvbiByZWR1Y2UoZikge1xuICB2YXIgcGFyYW1zID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgcmV0dXJuIChmdW5jdGlvbigpIHtcbiAgICB2YXIgaGFzSW5pdGlhbCA9IGNvdW50KHBhcmFtcykgPj0gMjtcbiAgICB2YXIgaW5pdGlhbCA9IGhhc0luaXRpYWwgP1xuICAgICAgZmlyc3QocGFyYW1zKSA6XG4gICAgICB2b2lkKDApO1xuICAgIHZhciBzZXF1ZW5jZSA9IGhhc0luaXRpYWwgP1xuICAgICAgc2Vjb25kKHBhcmFtcykgOlxuICAgICAgZmlyc3QocGFyYW1zKTtcbiAgICByZXR1cm4gaXNOaWwoc2VxdWVuY2UpID9cbiAgICAgIGluaXRpYWwgOlxuICAgIGlzVmVjdG9yKHNlcXVlbmNlKSA/XG4gICAgICBoYXNJbml0aWFsID9cbiAgICAgICAgc2VxdWVuY2UucmVkdWNlKGYsIGluaXRpYWwpIDpcbiAgICAgICAgc2VxdWVuY2UucmVkdWNlKGYpIDpcbiAgICBpc0xpc3Qoc2VxdWVuY2UpID9cbiAgICAgIGhhc0luaXRpYWwgP1xuICAgICAgICByZWR1Y2VMaXN0KGYsIGluaXRpYWwsIHNlcXVlbmNlKSA6XG4gICAgICAgIHJlZHVjZUxpc3QoZiwgZmlyc3Qoc2VxdWVuY2UpLCByZXN0KHNlcXVlbmNlKSkgOlxuICAgIFwiZWxzZVwiID9cbiAgICAgIHJlZHVjZShmLCBpbml0aWFsLCBzZXEoc2VxdWVuY2UpKSA6XG4gICAgICB2b2lkKDApO1xuICB9KSgpO1xufTtcbmV4cG9ydHMucmVkdWNlID0gcmVkdWNlO1xuXG52YXIgcmVkdWNlTGlzdCA9IGZ1bmN0aW9uIHJlZHVjZUxpc3QoZiwgaW5pdGlhbCwgc2VxdWVuY2UpIHtcbiAgcmV0dXJuIChmdW5jdGlvbiBsb29wKHJlc3VsdCwgaXRlbXMpIHtcbiAgICB2YXIgcmVjdXIgPSBsb29wO1xuICAgIHdoaWxlIChyZWN1ciA9PT0gbG9vcCkge1xuICAgICAgcmVjdXIgPSBpc0VtcHR5KGl0ZW1zKSA/XG4gICAgICByZXN1bHQgOlxuICAgICAgKHJlc3VsdCA9IGYocmVzdWx0LCBmaXJzdChpdGVtcykpLCBpdGVtcyA9IHJlc3QoaXRlbXMpLCBsb29wKTtcbiAgICB9O1xuICAgIHJldHVybiByZWN1cjtcbiAgfSkoaW5pdGlhbCwgc2VxdWVuY2UpO1xufTtcblxudmFyIGNvdW50ID0gZnVuY3Rpb24gY291bnQoc2VxdWVuY2UpIHtcbiAgcmV0dXJuIGlzTmlsKHNlcXVlbmNlKSA/XG4gICAgMCA6XG4gICAgKHNlcShzZXF1ZW5jZSkpLmxlbmd0aDtcbn07XG5leHBvcnRzLmNvdW50ID0gY291bnQ7XG5cbnZhciBpc0VtcHR5ID0gZnVuY3Rpb24gaXNFbXB0eShzZXF1ZW5jZSkge1xuICByZXR1cm4gY291bnQoc2VxdWVuY2UpID09PSAwO1xufTtcbmV4cG9ydHMuaXNFbXB0eSA9IGlzRW1wdHk7XG5cbnZhciBmaXJzdCA9IGZ1bmN0aW9uIGZpcnN0KHNlcXVlbmNlKSB7XG4gIHJldHVybiBpc05pbChzZXF1ZW5jZSkgP1xuICAgIHZvaWQoMCkgOlxuICBpc0xpc3Qoc2VxdWVuY2UpID9cbiAgICBzZXF1ZW5jZS5oZWFkIDpcbiAgKGlzVmVjdG9yKHNlcXVlbmNlKSkgfHwgKGlzU3RyaW5nKHNlcXVlbmNlKSkgP1xuICAgIChzZXF1ZW5jZSB8fCAwKVswXSA6XG4gIGlzTGF6eVNlcShzZXF1ZW5jZSkgP1xuICAgIGZpcnN0KGxhenlTZXFWYWx1ZShzZXF1ZW5jZSkpIDpcbiAgXCJlbHNlXCIgP1xuICAgIGZpcnN0KHNlcShzZXF1ZW5jZSkpIDpcbiAgICB2b2lkKDApO1xufTtcbmV4cG9ydHMuZmlyc3QgPSBmaXJzdDtcblxudmFyIHNlY29uZCA9IGZ1bmN0aW9uIHNlY29uZChzZXF1ZW5jZSkge1xuICByZXR1cm4gaXNOaWwoc2VxdWVuY2UpID9cbiAgICB2b2lkKDApIDpcbiAgaXNMaXN0KHNlcXVlbmNlKSA/XG4gICAgZmlyc3QocmVzdChzZXF1ZW5jZSkpIDpcbiAgKGlzVmVjdG9yKHNlcXVlbmNlKSkgfHwgKGlzU3RyaW5nKHNlcXVlbmNlKSkgP1xuICAgIChzZXF1ZW5jZSB8fCAwKVsxXSA6XG4gIGlzTGF6eVNlcShzZXF1ZW5jZSkgP1xuICAgIHNlY29uZChsYXp5U2VxVmFsdWUoc2VxdWVuY2UpKSA6XG4gIFwiZWxzZVwiID9cbiAgICBmaXJzdChyZXN0KHNlcShzZXF1ZW5jZSkpKSA6XG4gICAgdm9pZCgwKTtcbn07XG5leHBvcnRzLnNlY29uZCA9IHNlY29uZDtcblxudmFyIHRoaXJkID0gZnVuY3Rpb24gdGhpcmQoc2VxdWVuY2UpIHtcbiAgcmV0dXJuIGlzTmlsKHNlcXVlbmNlKSA/XG4gICAgdm9pZCgwKSA6XG4gIGlzTGlzdChzZXF1ZW5jZSkgP1xuICAgIGZpcnN0KHJlc3QocmVzdChzZXF1ZW5jZSkpKSA6XG4gIChpc1ZlY3RvcihzZXF1ZW5jZSkpIHx8IChpc1N0cmluZyhzZXF1ZW5jZSkpID9cbiAgICAoc2VxdWVuY2UgfHwgMClbMl0gOlxuICBpc0xhenlTZXEoc2VxdWVuY2UpID9cbiAgICB0aGlyZChsYXp5U2VxVmFsdWUoc2VxdWVuY2UpKSA6XG4gIFwiZWxzZVwiID9cbiAgICBzZWNvbmQocmVzdChzZXEoc2VxdWVuY2UpKSkgOlxuICAgIHZvaWQoMCk7XG59O1xuZXhwb3J0cy50aGlyZCA9IHRoaXJkO1xuXG52YXIgcmVzdCA9IGZ1bmN0aW9uIHJlc3Qoc2VxdWVuY2UpIHtcbiAgcmV0dXJuIGlzTmlsKHNlcXVlbmNlKSA/XG4gICAgbGlzdCgpIDpcbiAgaXNMaXN0KHNlcXVlbmNlKSA/XG4gICAgc2VxdWVuY2UudGFpbCA6XG4gIChpc1ZlY3RvcihzZXF1ZW5jZSkpIHx8IChpc1N0cmluZyhzZXF1ZW5jZSkpID9cbiAgICBzZXF1ZW5jZS5zbGljZSgxKSA6XG4gIGlzTGF6eVNlcShzZXF1ZW5jZSkgP1xuICAgIHJlc3QobGF6eVNlcVZhbHVlKHNlcXVlbmNlKSkgOlxuICBcImVsc2VcIiA/XG4gICAgcmVzdChzZXEoc2VxdWVuY2UpKSA6XG4gICAgdm9pZCgwKTtcbn07XG5leHBvcnRzLnJlc3QgPSByZXN0O1xuXG52YXIgbGFzdE9mTGlzdCA9IGZ1bmN0aW9uIGxhc3RPZkxpc3QobGlzdCkge1xuICByZXR1cm4gKGZ1bmN0aW9uIGxvb3AoaXRlbSwgaXRlbXMpIHtcbiAgICB2YXIgcmVjdXIgPSBsb29wO1xuICAgIHdoaWxlIChyZWN1ciA9PT0gbG9vcCkge1xuICAgICAgcmVjdXIgPSBpc0VtcHR5KGl0ZW1zKSA/XG4gICAgICBpdGVtIDpcbiAgICAgIChpdGVtID0gZmlyc3QoaXRlbXMpLCBpdGVtcyA9IHJlc3QoaXRlbXMpLCBsb29wKTtcbiAgICB9O1xuICAgIHJldHVybiByZWN1cjtcbiAgfSkoZmlyc3QobGlzdCksIHJlc3QobGlzdCkpO1xufTtcblxudmFyIGxhc3QgPSBmdW5jdGlvbiBsYXN0KHNlcXVlbmNlKSB7XG4gIHJldHVybiAoaXNWZWN0b3Ioc2VxdWVuY2UpKSB8fCAoaXNTdHJpbmcoc2VxdWVuY2UpKSA/XG4gICAgKHNlcXVlbmNlIHx8IDApW2RlYyhjb3VudChzZXF1ZW5jZSkpXSA6XG4gIGlzTGlzdChzZXF1ZW5jZSkgP1xuICAgIGxhc3RPZkxpc3Qoc2VxdWVuY2UpIDpcbiAgaXNOaWwoc2VxdWVuY2UpID9cbiAgICB2b2lkKDApIDpcbiAgaXNMYXp5U2VxKHNlcXVlbmNlKSA/XG4gICAgbGFzdChsYXp5U2VxVmFsdWUoc2VxdWVuY2UpKSA6XG4gIFwiZWxzZVwiID9cbiAgICBsYXN0KHNlcShzZXF1ZW5jZSkpIDpcbiAgICB2b2lkKDApO1xufTtcbmV4cG9ydHMubGFzdCA9IGxhc3Q7XG5cbnZhciBidXRsYXN0ID0gZnVuY3Rpb24gYnV0bGFzdChzZXF1ZW5jZSkge1xuICB2YXIgaXRlbXMgPSBpc05pbChzZXF1ZW5jZSkgP1xuICAgIHZvaWQoMCkgOlxuICBpc1N0cmluZyhzZXF1ZW5jZSkgP1xuICAgIHN1YnMoc2VxdWVuY2UsIDAsIGRlYyhjb3VudChzZXF1ZW5jZSkpKSA6XG4gIGlzVmVjdG9yKHNlcXVlbmNlKSA/XG4gICAgc2VxdWVuY2Uuc2xpY2UoMCwgZGVjKGNvdW50KHNlcXVlbmNlKSkpIDpcbiAgaXNMaXN0KHNlcXVlbmNlKSA/XG4gICAgbGlzdC5hcHBseShsaXN0LCBidXRsYXN0KHZlYyhzZXF1ZW5jZSkpKSA6XG4gIGlzTGF6eVNlcShzZXF1ZW5jZSkgP1xuICAgIGJ1dGxhc3QobGF6eVNlcVZhbHVlKHNlcXVlbmNlKSkgOlxuICBcImVsc2VcIiA/XG4gICAgYnV0bGFzdChzZXEoc2VxdWVuY2UpKSA6XG4gICAgdm9pZCgwKTtcbiAgcmV0dXJuICEoKGlzTmlsKGl0ZW1zKSkgfHwgKGlzRW1wdHkoaXRlbXMpKSkgP1xuICAgIGl0ZW1zIDpcbiAgICB2b2lkKDApO1xufTtcbmV4cG9ydHMuYnV0bGFzdCA9IGJ1dGxhc3Q7XG5cbnZhciB0YWtlID0gZnVuY3Rpb24gdGFrZShuLCBzZXF1ZW5jZSkge1xuICByZXR1cm4gaXNOaWwoc2VxdWVuY2UpID9cbiAgICBsaXN0KCkgOlxuICBpc1ZlY3RvcihzZXF1ZW5jZSkgP1xuICAgIHRha2VGcm9tVmVjdG9yKG4sIHNlcXVlbmNlKSA6XG4gIGlzTGlzdChzZXF1ZW5jZSkgP1xuICAgIHRha2VGcm9tTGlzdChuLCBzZXF1ZW5jZSkgOlxuICBpc0xhenlTZXEoc2VxdWVuY2UpID9cbiAgICB0YWtlKG4sIGxhenlTZXFWYWx1ZShzZXF1ZW5jZSkpIDpcbiAgXCJlbHNlXCIgP1xuICAgIHRha2Uobiwgc2VxKHNlcXVlbmNlKSkgOlxuICAgIHZvaWQoMCk7XG59O1xuZXhwb3J0cy50YWtlID0gdGFrZTtcblxudmFyIHRha2VWZWN0b3JXaGlsZSA9IGZ1bmN0aW9uIHRha2VWZWN0b3JXaGlsZShwcmVkaWNhdGUsIHZlY3Rvcikge1xuICByZXR1cm4gKGZ1bmN0aW9uIGxvb3AocmVzdWx0LCB0YWlsLCBoZWFkKSB7XG4gICAgdmFyIHJlY3VyID0gbG9vcDtcbiAgICB3aGlsZSAocmVjdXIgPT09IGxvb3ApIHtcbiAgICAgIHJlY3VyID0gKCEoaXNFbXB0eSh0YWlsKSkpICYmIChwcmVkaWNhdGUoaGVhZCkpID9cbiAgICAgIChyZXN1bHQgPSBjb25qKHJlc3VsdCwgaGVhZCksIHRhaWwgPSByZXN0KHRhaWwpLCBoZWFkID0gZmlyc3QodGFpbCksIGxvb3ApIDpcbiAgICAgIHJlc3VsdDtcbiAgICB9O1xuICAgIHJldHVybiByZWN1cjtcbiAgfSkoW10sIHZlY3RvciwgZmlyc3QodmVjdG9yKSk7XG59O1xuXG52YXIgdGFrZUxpc3RXaGlsZSA9IGZ1bmN0aW9uIHRha2VMaXN0V2hpbGUocHJlZGljYXRlLCBpdGVtcykge1xuICByZXR1cm4gKGZ1bmN0aW9uIGxvb3AocmVzdWx0LCB0YWlsLCBoZWFkKSB7XG4gICAgdmFyIHJlY3VyID0gbG9vcDtcbiAgICB3aGlsZSAocmVjdXIgPT09IGxvb3ApIHtcbiAgICAgIHJlY3VyID0gKCEoaXNFbXB0eSh0YWlsKSkpICYmIChpc1ByZWRpY2F0ZShoZWFkKSkgP1xuICAgICAgKHJlc3VsdCA9IGNvbmoocmVzdWx0LCBoZWFkKSwgdGFpbCA9IHJlc3QodGFpbCksIGhlYWQgPSBmaXJzdCh0YWlsKSwgbG9vcCkgOlxuICAgICAgbGlzdC5hcHBseShsaXN0LCByZXN1bHQpO1xuICAgIH07XG4gICAgcmV0dXJuIHJlY3VyO1xuICB9KShbXSwgaXRlbXMsIGZpcnN0KGl0ZW1zKSk7XG59O1xuXG52YXIgdGFrZVdoaWxlID0gZnVuY3Rpb24gdGFrZVdoaWxlKHByZWRpY2F0ZSwgc2VxdWVuY2UpIHtcbiAgcmV0dXJuIGlzTmlsKHNlcXVlbmNlKSA/XG4gICAgbGlzdCgpIDpcbiAgaXNWZWN0b3Ioc2VxdWVuY2UpID9cbiAgICB0YWtlVmVjdG9yV2hpbGUocHJlZGljYXRlLCBzZXF1ZW5jZSkgOlxuICBpc0xpc3Qoc2VxdWVuY2UpID9cbiAgICB0YWtlVmVjdG9yV2hpbGUocHJlZGljYXRlLCBzZXF1ZW5jZSkgOlxuICBcImVsc2VcIiA/XG4gICAgdGFrZVdoaWxlKHByZWRpY2F0ZSwgbGF6eVNlcVZhbHVlKHNlcXVlbmNlKSkgOlxuICAgIHZvaWQoMCk7XG59O1xuZXhwb3J0cy50YWtlV2hpbGUgPSB0YWtlV2hpbGU7XG5cbnZhciB0YWtlRnJvbVZlY3RvciA9IGZ1bmN0aW9uIHRha2VGcm9tVmVjdG9yKG4sIHZlY3Rvcikge1xuICByZXR1cm4gdmVjdG9yLnNsaWNlKDAsIG4pO1xufTtcblxudmFyIHRha2VGcm9tTGlzdCA9IGZ1bmN0aW9uIHRha2VGcm9tTGlzdChuLCBzZXF1ZW5jZSkge1xuICByZXR1cm4gKGZ1bmN0aW9uIGxvb3AodGFrZW4sIGl0ZW1zLCBuKSB7XG4gICAgdmFyIHJlY3VyID0gbG9vcDtcbiAgICB3aGlsZSAocmVjdXIgPT09IGxvb3ApIHtcbiAgICAgIHJlY3VyID0gKG4gPT09IDApIHx8IChpc0VtcHR5KGl0ZW1zKSkgP1xuICAgICAgcmV2ZXJzZSh0YWtlbikgOlxuICAgICAgKHRha2VuID0gY29ucyhmaXJzdChpdGVtcyksIHRha2VuKSwgaXRlbXMgPSByZXN0KGl0ZW1zKSwgbiA9IGRlYyhuKSwgbG9vcCk7XG4gICAgfTtcbiAgICByZXR1cm4gcmVjdXI7XG4gIH0pKGxpc3QoKSwgc2VxdWVuY2UsIG4pO1xufTtcblxudmFyIGRyb3BGcm9tTGlzdCA9IGZ1bmN0aW9uIGRyb3BGcm9tTGlzdChuLCBzZXF1ZW5jZSkge1xuICByZXR1cm4gKGZ1bmN0aW9uIGxvb3AobGVmdCwgaXRlbXMpIHtcbiAgICB2YXIgcmVjdXIgPSBsb29wO1xuICAgIHdoaWxlIChyZWN1ciA9PT0gbG9vcCkge1xuICAgICAgcmVjdXIgPSAobGVmdCA8IDEpIHx8IChpc0VtcHR5KGl0ZW1zKSkgP1xuICAgICAgaXRlbXMgOlxuICAgICAgKGxlZnQgPSBkZWMobGVmdCksIGl0ZW1zID0gcmVzdChpdGVtcyksIGxvb3ApO1xuICAgIH07XG4gICAgcmV0dXJuIHJlY3VyO1xuICB9KShuLCBzZXF1ZW5jZSk7XG59O1xuXG52YXIgZHJvcCA9IGZ1bmN0aW9uIGRyb3Aobiwgc2VxdWVuY2UpIHtcbiAgcmV0dXJuIG4gPD0gMCA/XG4gICAgc2VxdWVuY2UgOlxuICBpc1N0cmluZyhzZXF1ZW5jZSkgP1xuICAgIHNlcXVlbmNlLnN1YnN0cihuKSA6XG4gIGlzVmVjdG9yKHNlcXVlbmNlKSA/XG4gICAgc2VxdWVuY2Uuc2xpY2UobikgOlxuICBpc0xpc3Qoc2VxdWVuY2UpID9cbiAgICBkcm9wRnJvbUxpc3Qobiwgc2VxdWVuY2UpIDpcbiAgaXNOaWwoc2VxdWVuY2UpID9cbiAgICBsaXN0KCkgOlxuICBpc0xhenlTZXEoc2VxdWVuY2UpID9cbiAgICBkcm9wKG4sIGxhenlTZXFWYWx1ZShzZXF1ZW5jZSkpIDpcbiAgXCJlbHNlXCIgP1xuICAgIGRyb3Aobiwgc2VxKHNlcXVlbmNlKSkgOlxuICAgIHZvaWQoMCk7XG59O1xuZXhwb3J0cy5kcm9wID0gZHJvcDtcblxudmFyIGNvbmpMaXN0ID0gZnVuY3Rpb24gY29uakxpc3Qoc2VxdWVuY2UsIGl0ZW1zKSB7XG4gIHJldHVybiByZWR1Y2UoZnVuY3Rpb24ocmVzdWx0LCBpdGVtKSB7XG4gICAgcmV0dXJuIGNvbnMoaXRlbSwgcmVzdWx0KTtcbiAgfSwgc2VxdWVuY2UsIGl0ZW1zKTtcbn07XG5cbnZhciBjb25qID0gZnVuY3Rpb24gY29uaihzZXF1ZW5jZSkge1xuICB2YXIgaXRlbXMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICByZXR1cm4gaXNWZWN0b3Ioc2VxdWVuY2UpID9cbiAgICBzZXF1ZW5jZS5jb25jYXQoaXRlbXMpIDpcbiAgaXNTdHJpbmcoc2VxdWVuY2UpID9cbiAgICBcIlwiICsgc2VxdWVuY2UgKyAoc3RyLmFwcGx5KHN0ciwgaXRlbXMpKSA6XG4gIGlzTmlsKHNlcXVlbmNlKSA/XG4gICAgbGlzdC5hcHBseShsaXN0LCByZXZlcnNlKGl0ZW1zKSkgOlxuICAoaXNMaXN0KHNlcXVlbmNlKSkgfHwgKGlzTGF6eVNlcSgpKSA/XG4gICAgY29uakxpc3Qoc2VxdWVuY2UsIGl0ZW1zKSA6XG4gIGlzRGljdGlvbmFyeShzZXF1ZW5jZSkgP1xuICAgIG1lcmdlKHNlcXVlbmNlLCBtZXJnZS5hcHBseShtZXJnZSwgaXRlbXMpKSA6XG4gIFwiZWxzZVwiID9cbiAgICAoZnVuY3Rpb24oKSB7IHRocm93IFR5cGVFcnJvcihcIlwiICsgXCJUeXBlIGNhbid0IGJlIGNvbmpvaW5lZCBcIiArIHNlcXVlbmNlKTsgfSkoKSA6XG4gICAgdm9pZCgwKTtcbn07XG5leHBvcnRzLmNvbmogPSBjb25qO1xuXG52YXIgYXNzb2MgPSBmdW5jdGlvbiBhc3NvYyhzb3VyY2UpIHtcbiAgdmFyIGtleVZhbHVlcyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gIHJldHVybiBjb25qKHNvdXJjZSwgZGljdGlvbmFyeS5hcHBseShkaWN0aW9uYXJ5LCBrZXlWYWx1ZXMpKTtcbn07XG5leHBvcnRzLmFzc29jID0gYXNzb2M7XG5cbnZhciBjb25jYXQgPSBmdW5jdGlvbiBjb25jYXQoKSB7XG4gIHZhciBzZXF1ZW5jZXMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDApO1xuICByZXR1cm4gcmV2ZXJzZShyZWR1Y2UoZnVuY3Rpb24ocmVzdWx0LCBzZXF1ZW5jZSkge1xuICAgIHJldHVybiByZWR1Y2UoZnVuY3Rpb24ocmVzdWx0LCBpdGVtKSB7XG4gICAgICByZXR1cm4gY29ucyhpdGVtLCByZXN1bHQpO1xuICAgIH0sIHJlc3VsdCwgc2VxKHNlcXVlbmNlKSk7XG4gIH0sIGxpc3QoKSwgc2VxdWVuY2VzKSk7XG59O1xuZXhwb3J0cy5jb25jYXQgPSBjb25jYXQ7XG5cbnZhciBzZXEgPSBmdW5jdGlvbiBzZXEoc2VxdWVuY2UpIHtcbiAgcmV0dXJuIGlzTmlsKHNlcXVlbmNlKSA/XG4gICAgdm9pZCgwKSA6XG4gIChpc1ZlY3RvcihzZXF1ZW5jZSkpIHx8IChpc0xpc3Qoc2VxdWVuY2UpKSB8fCAoaXNMYXp5U2VxKHNlcXVlbmNlKSkgP1xuICAgIHNlcXVlbmNlIDpcbiAgaXNTdHJpbmcoc2VxdWVuY2UpID9cbiAgICBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChzZXF1ZW5jZSkgOlxuICBpc0RpY3Rpb25hcnkoc2VxdWVuY2UpID9cbiAgICBrZXlWYWx1ZXMoc2VxdWVuY2UpIDpcbiAgXCJkZWZhdWx0XCIgP1xuICAgIChmdW5jdGlvbigpIHsgdGhyb3cgVHlwZUVycm9yKFwiXCIgKyBcIkNhbiBub3Qgc2VxIFwiICsgc2VxdWVuY2UpOyB9KSgpIDpcbiAgICB2b2lkKDApO1xufTtcbmV4cG9ydHMuc2VxID0gc2VxO1xuXG52YXIgaXNTZXEgPSBmdW5jdGlvbiBpc1NlcShzZXF1ZW5jZSkge1xuICByZXR1cm4gKGlzTGlzdChzZXF1ZW5jZSkpIHx8IChpc0xhenlTZXEoc2VxdWVuY2UpKTtcbn07XG5leHBvcnRzLmlzU2VxID0gaXNTZXE7XG5cbnZhciBsaXN0VG9WZWN0b3IgPSBmdW5jdGlvbiBsaXN0VG9WZWN0b3Ioc291cmNlKSB7XG4gIHJldHVybiAoZnVuY3Rpb24gbG9vcChyZXN1bHQsIGxpc3QpIHtcbiAgICB2YXIgcmVjdXIgPSBsb29wO1xuICAgIHdoaWxlIChyZWN1ciA9PT0gbG9vcCkge1xuICAgICAgcmVjdXIgPSBpc0VtcHR5KGxpc3QpID9cbiAgICAgIHJlc3VsdCA6XG4gICAgICAocmVzdWx0ID0gKGZ1bmN0aW9uKCkge1xuICAgICAgICByZXN1bHQucHVzaChmaXJzdChsaXN0KSk7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9KSgpLCBsaXN0ID0gcmVzdChsaXN0KSwgbG9vcCk7XG4gICAgfTtcbiAgICByZXR1cm4gcmVjdXI7XG4gIH0pKFtdLCBzb3VyY2UpO1xufTtcblxudmFyIHZlYyA9IGZ1bmN0aW9uIHZlYyhzZXF1ZW5jZSkge1xuICByZXR1cm4gaXNOaWwoc2VxdWVuY2UpID9cbiAgICBbXSA6XG4gIGlzVmVjdG9yKHNlcXVlbmNlKSA/XG4gICAgc2VxdWVuY2UgOlxuICBpc0xpc3Qoc2VxdWVuY2UpID9cbiAgICBsaXN0VG9WZWN0b3Ioc2VxdWVuY2UpIDpcbiAgXCJlbHNlXCIgP1xuICAgIHZlYyhzZXEoc2VxdWVuY2UpKSA6XG4gICAgdm9pZCgwKTtcbn07XG5leHBvcnRzLnZlYyA9IHZlYztcblxudmFyIHNvcnQgPSBmdW5jdGlvbiBzb3J0KGYsIGl0ZW1zKSB7XG4gIHZhciBoYXNDb21wYXJhdG9yID0gaXNGbihmKTtcbiAgdmFyIGl0ZW1zID0gKCEoaGFzQ29tcGFyYXRvcikpICYmIChpc05pbChpdGVtcykpID9cbiAgICBmIDpcbiAgICBpdGVtcztcbiAgdmFyIGNvbXBhcmUgPSBoYXNDb21wYXJhdG9yID9cbiAgICBmdW5jdGlvbihhLCBiKSB7XG4gICAgICByZXR1cm4gZihhLCBiKSA/XG4gICAgICAgIDAgOlxuICAgICAgICAxO1xuICAgIH0gOlxuICAgIHZvaWQoMCk7XG4gIHJldHVybiBpc05pbChpdGVtcykgP1xuICAgIGxpc3QoKSA6XG4gIGlzVmVjdG9yKGl0ZW1zKSA/XG4gICAgaXRlbXMuc29ydChjb21wYXJlKSA6XG4gIGlzTGlzdChpdGVtcykgP1xuICAgIGxpc3QuYXBwbHkobGlzdCwgdmVjKGl0ZW1zKS5zb3J0KGNvbXBhcmUpKSA6XG4gIGlzRGljdGlvbmFyeShpdGVtcykgP1xuICAgIHNlcShpdGVtcykuc29ydChjb21wYXJlKSA6XG4gIFwiZWxzZVwiID9cbiAgICBzb3J0KGYsIHNlcShpdGVtcykpIDpcbiAgICB2b2lkKDApO1xufTtcbmV4cG9ydHMuc29ydCA9IHNvcnQ7XG5cbnZhciByZXBlYXQgPSBmdW5jdGlvbiByZXBlYXQobiwgeCkge1xuICByZXR1cm4gKGZ1bmN0aW9uIGxvb3AobiwgcmVzdWx0KSB7XG4gICAgdmFyIHJlY3VyID0gbG9vcDtcbiAgICB3aGlsZSAocmVjdXIgPT09IGxvb3ApIHtcbiAgICAgIHJlY3VyID0gbiA8PSAwID9cbiAgICAgIHJlc3VsdCA6XG4gICAgICAobiA9IGRlYyhuKSwgcmVzdWx0ID0gY29uaihyZXN1bHQsIHgpLCBsb29wKTtcbiAgICB9O1xuICAgIHJldHVybiByZWN1cjtcbiAgfSkobiwgW10pO1xufTtcbmV4cG9ydHMucmVwZWF0ID0gcmVwZWF0IiwidmFyIF9uc18gPSB7XG4gIFwiaWRcIjogXCJ3aXNwLnJlYWRlclwiLFxuICBcImRvY1wiOiBcIlJlYWRlciBtb2R1bGUgcHJvdmlkZXMgZnVuY3Rpb25zIGZvciByZWFkaW5nIHRleHQgaW5wdXRcXG4gIGFzIHdpc3AgZGF0YSBzdHJ1Y3R1cmVzXCJcbn07XG52YXIgd2lzcF9zZXF1ZW5jZSA9IHJlcXVpcmUoXCIuL3NlcXVlbmNlXCIpO1xudmFyIGxpc3QgPSB3aXNwX3NlcXVlbmNlLmxpc3Q7XG52YXIgaXNMaXN0ID0gd2lzcF9zZXF1ZW5jZS5pc0xpc3Q7XG52YXIgY291bnQgPSB3aXNwX3NlcXVlbmNlLmNvdW50O1xudmFyIGlzRW1wdHkgPSB3aXNwX3NlcXVlbmNlLmlzRW1wdHk7XG52YXIgZmlyc3QgPSB3aXNwX3NlcXVlbmNlLmZpcnN0O1xudmFyIHNlY29uZCA9IHdpc3Bfc2VxdWVuY2Uuc2Vjb25kO1xudmFyIHRoaXJkID0gd2lzcF9zZXF1ZW5jZS50aGlyZDtcbnZhciByZXN0ID0gd2lzcF9zZXF1ZW5jZS5yZXN0O1xudmFyIG1hcCA9IHdpc3Bfc2VxdWVuY2UubWFwO1xudmFyIHZlYyA9IHdpc3Bfc2VxdWVuY2UudmVjO1xudmFyIGNvbnMgPSB3aXNwX3NlcXVlbmNlLmNvbnM7XG52YXIgY29uaiA9IHdpc3Bfc2VxdWVuY2UuY29uajtcbnZhciBjb25jYXQgPSB3aXNwX3NlcXVlbmNlLmNvbmNhdDtcbnZhciBsYXN0ID0gd2lzcF9zZXF1ZW5jZS5sYXN0O1xudmFyIGJ1dGxhc3QgPSB3aXNwX3NlcXVlbmNlLmJ1dGxhc3Q7XG52YXIgc29ydCA9IHdpc3Bfc2VxdWVuY2Uuc29ydDtcbnZhciBsYXp5U2VxID0gd2lzcF9zZXF1ZW5jZS5sYXp5U2VxOztcbnZhciB3aXNwX3J1bnRpbWUgPSByZXF1aXJlKFwiLi9ydW50aW1lXCIpO1xudmFyIGlzT2RkID0gd2lzcF9ydW50aW1lLmlzT2RkO1xudmFyIGRpY3Rpb25hcnkgPSB3aXNwX3J1bnRpbWUuZGljdGlvbmFyeTtcbnZhciBrZXlzID0gd2lzcF9ydW50aW1lLmtleXM7XG52YXIgaXNOaWwgPSB3aXNwX3J1bnRpbWUuaXNOaWw7XG52YXIgaW5jID0gd2lzcF9ydW50aW1lLmluYztcbnZhciBkZWMgPSB3aXNwX3J1bnRpbWUuZGVjO1xudmFyIGlzVmVjdG9yID0gd2lzcF9ydW50aW1lLmlzVmVjdG9yO1xudmFyIGlzU3RyaW5nID0gd2lzcF9ydW50aW1lLmlzU3RyaW5nO1xudmFyIGlzTnVtYmVyID0gd2lzcF9ydW50aW1lLmlzTnVtYmVyO1xudmFyIGlzQm9vbGVhbiA9IHdpc3BfcnVudGltZS5pc0Jvb2xlYW47XG52YXIgaXNPYmplY3QgPSB3aXNwX3J1bnRpbWUuaXNPYmplY3Q7XG52YXIgaXNEaWN0aW9uYXJ5ID0gd2lzcF9ydW50aW1lLmlzRGljdGlvbmFyeTtcbnZhciByZVBhdHRlcm4gPSB3aXNwX3J1bnRpbWUucmVQYXR0ZXJuO1xudmFyIHJlTWF0Y2hlcyA9IHdpc3BfcnVudGltZS5yZU1hdGNoZXM7XG52YXIgcmVGaW5kID0gd2lzcF9ydW50aW1lLnJlRmluZDtcbnZhciBzdHIgPSB3aXNwX3J1bnRpbWUuc3RyO1xudmFyIHN1YnMgPSB3aXNwX3J1bnRpbWUuc3VicztcbnZhciBjaGFyID0gd2lzcF9ydW50aW1lLmNoYXI7XG52YXIgdmFscyA9IHdpc3BfcnVudGltZS52YWxzO1xudmFyIGlzRXF1YWwgPSB3aXNwX3J1bnRpbWUuaXNFcXVhbDs7XG52YXIgd2lzcF9hc3QgPSByZXF1aXJlKFwiLi9hc3RcIik7XG52YXIgaXNTeW1ib2wgPSB3aXNwX2FzdC5pc1N5bWJvbDtcbnZhciBzeW1ib2wgPSB3aXNwX2FzdC5zeW1ib2w7XG52YXIgaXNLZXl3b3JkID0gd2lzcF9hc3QuaXNLZXl3b3JkO1xudmFyIGtleXdvcmQgPSB3aXNwX2FzdC5rZXl3b3JkO1xudmFyIG1ldGEgPSB3aXNwX2FzdC5tZXRhO1xudmFyIHdpdGhNZXRhID0gd2lzcF9hc3Qud2l0aE1ldGE7XG52YXIgbmFtZSA9IHdpc3BfYXN0Lm5hbWU7XG52YXIgZ2Vuc3ltID0gd2lzcF9hc3QuZ2Vuc3ltOztcbnZhciB3aXNwX3N0cmluZyA9IHJlcXVpcmUoXCIuL3N0cmluZ1wiKTtcbnZhciBzcGxpdCA9IHdpc3Bfc3RyaW5nLnNwbGl0O1xudmFyIGpvaW4gPSB3aXNwX3N0cmluZy5qb2luOzs7XG5cbnZhciBwdXNoQmFja1JlYWRlciA9IGZ1bmN0aW9uIHB1c2hCYWNrUmVhZGVyKHNvdXJjZSwgdXJpKSB7XG4gIHJldHVybiB7XG4gICAgXCJsaW5lc1wiOiBzcGxpdChzb3VyY2UsIFwiXFxuXCIpLFxuICAgIFwiYnVmZmVyXCI6IFwiXCIsXG4gICAgXCJ1cmlcIjogdXJpLFxuICAgIFwiY29sdW1uXCI6IC0xLFxuICAgIFwibGluZVwiOiAwXG4gIH07XG59O1xuZXhwb3J0cy5wdXNoQmFja1JlYWRlciA9IHB1c2hCYWNrUmVhZGVyO1xuXG52YXIgcGVla0NoYXIgPSBmdW5jdGlvbiBwZWVrQ2hhcihyZWFkZXIpIHtcbiAgdmFyIGxpbmUgPSAoKHJlYWRlciB8fCAwKVtcImxpbmVzXCJdKVsocmVhZGVyIHx8IDApW1wibGluZVwiXV07XG4gIHZhciBjb2x1bW4gPSBpbmMoKHJlYWRlciB8fCAwKVtcImNvbHVtblwiXSk7XG4gIHJldHVybiBpc05pbChsaW5lKSA/XG4gICAgdm9pZCgwKSA6XG4gICAgKGxpbmVbY29sdW1uXSkgfHwgXCJcXG5cIjtcbn07XG5leHBvcnRzLnBlZWtDaGFyID0gcGVla0NoYXI7XG5cbnZhciByZWFkQ2hhciA9IGZ1bmN0aW9uIHJlYWRDaGFyKHJlYWRlcikge1xuICB2YXIgY2ggPSBwZWVrQ2hhcihyZWFkZXIpO1xuICBpc05ld2xpbmUocGVla0NoYXIocmVhZGVyKSkgP1xuICAgIChmdW5jdGlvbigpIHtcbiAgICAgIChyZWFkZXIgfHwgMClbXCJsaW5lXCJdID0gaW5jKChyZWFkZXIgfHwgMClbXCJsaW5lXCJdKTtcbiAgICAgIHJldHVybiAocmVhZGVyIHx8IDApW1wiY29sdW1uXCJdID0gLTE7XG4gICAgfSkoKSA6XG4gICAgKHJlYWRlciB8fCAwKVtcImNvbHVtblwiXSA9IGluYygocmVhZGVyIHx8IDApW1wiY29sdW1uXCJdKTtcbiAgcmV0dXJuIGNoO1xufTtcbmV4cG9ydHMucmVhZENoYXIgPSByZWFkQ2hhcjtcblxudmFyIGlzTmV3bGluZSA9IGZ1bmN0aW9uIGlzTmV3bGluZShjaCkge1xuICByZXR1cm4gXCJcXG5cIiA9PT0gY2g7XG59O1xuZXhwb3J0cy5pc05ld2xpbmUgPSBpc05ld2xpbmU7XG5cbnZhciBpc0JyZWFraW5nV2hpdGVzcGFjZSA9IGZ1bmN0aW9uIGlzQnJlYWtpbmdXaGl0ZXNwYWNlKGNoKSB7XG4gIHJldHVybiAoY2ggPT09IFwiIFwiKSB8fCAoY2ggPT09IFwiXFx0XCIpIHx8IChjaCA9PT0gXCJcXG5cIikgfHwgKGNoID09PSBcIlxcclwiKTtcbn07XG5leHBvcnRzLmlzQnJlYWtpbmdXaGl0ZXNwYWNlID0gaXNCcmVha2luZ1doaXRlc3BhY2U7XG5cbnZhciBpc1doaXRlc3BhY2UgPSBmdW5jdGlvbiBpc1doaXRlc3BhY2UoY2gpIHtcbiAgcmV0dXJuIChpc0JyZWFraW5nV2hpdGVzcGFjZShjaCkpIHx8IChcIixcIiA9PT0gY2gpO1xufTtcbmV4cG9ydHMuaXNXaGl0ZXNwYWNlID0gaXNXaGl0ZXNwYWNlO1xuXG52YXIgaXNOdW1lcmljID0gZnVuY3Rpb24gaXNOdW1lcmljKGNoKSB7XG4gIHJldHVybiAoY2ggPT09IFwiMFwiKSB8fCAoY2ggPT09IFwiMVwiKSB8fCAoY2ggPT09IFwiMlwiKSB8fCAoY2ggPT09IFwiM1wiKSB8fCAoY2ggPT09IFwiNFwiKSB8fCAoY2ggPT09IFwiNVwiKSB8fCAoY2ggPT09IFwiNlwiKSB8fCAoY2ggPT09IFwiN1wiKSB8fCAoY2ggPT09IFwiOFwiKSB8fCAoY2ggPT09IFwiOVwiKTtcbn07XG5leHBvcnRzLmlzTnVtZXJpYyA9IGlzTnVtZXJpYztcblxudmFyIGlzQ29tbWVudFByZWZpeCA9IGZ1bmN0aW9uIGlzQ29tbWVudFByZWZpeChjaCkge1xuICByZXR1cm4gXCI7XCIgPT09IGNoO1xufTtcbmV4cG9ydHMuaXNDb21tZW50UHJlZml4ID0gaXNDb21tZW50UHJlZml4O1xuXG52YXIgaXNOdW1iZXJMaXRlcmFsID0gZnVuY3Rpb24gaXNOdW1iZXJMaXRlcmFsKHJlYWRlciwgaW5pdGNoKSB7XG4gIHJldHVybiAoaXNOdW1lcmljKGluaXRjaCkpIHx8ICgoKFwiK1wiID09PSBpbml0Y2gpIHx8IChcIi1cIiA9PT0gaW5pdGNoKSkgJiYgKGlzTnVtZXJpYyhwZWVrQ2hhcihyZWFkZXIpKSkpO1xufTtcbmV4cG9ydHMuaXNOdW1iZXJMaXRlcmFsID0gaXNOdW1iZXJMaXRlcmFsO1xuXG52YXIgcmVhZGVyRXJyb3IgPSBmdW5jdGlvbiByZWFkZXJFcnJvcihyZWFkZXIsIG1lc3NhZ2UpIHtcbiAgdmFyIHRleHQgPSBcIlwiICsgbWVzc2FnZSArIFwiXFxuXCIgKyBcImxpbmU6XCIgKyAoKHJlYWRlciB8fCAwKVtcImxpbmVcIl0pICsgXCJcXG5cIiArIFwiY29sdW1uOlwiICsgKChyZWFkZXIgfHwgMClbXCJjb2x1bW5cIl0pO1xuICB2YXIgZXJyb3IgPSBTeW50YXhFcnJvcih0ZXh0LCAocmVhZGVyIHx8IDApW1widXJpXCJdKTtcbiAgZXJyb3IubGluZSA9IChyZWFkZXIgfHwgMClbXCJsaW5lXCJdO1xuICBlcnJvci5jb2x1bW4gPSAocmVhZGVyIHx8IDApW1wiY29sdW1uXCJdO1xuICBlcnJvci51cmkgPSAocmVhZGVyIHx8IDApW1widXJpXCJdO1xuICByZXR1cm4gKGZ1bmN0aW9uKCkgeyB0aHJvdyBlcnJvcjsgfSkoKTtcbn07XG5leHBvcnRzLnJlYWRlckVycm9yID0gcmVhZGVyRXJyb3I7XG5cbnZhciBpc01hY3JvVGVybWluYXRpbmcgPSBmdW5jdGlvbiBpc01hY3JvVGVybWluYXRpbmcoY2gpIHtcbiAgcmV0dXJuICghKGNoID09PSBcIiNcIikpICYmICghKGNoID09PSBcIidcIikpICYmICghKGNoID09PSBcIjpcIikpICYmIChtYWNyb3MoY2gpKTtcbn07XG5leHBvcnRzLmlzTWFjcm9UZXJtaW5hdGluZyA9IGlzTWFjcm9UZXJtaW5hdGluZztcblxudmFyIHJlYWRUb2tlbiA9IGZ1bmN0aW9uIHJlYWRUb2tlbihyZWFkZXIsIGluaXRjaCkge1xuICByZXR1cm4gKGZ1bmN0aW9uIGxvb3AoYnVmZmVyLCBjaCkge1xuICAgIHZhciByZWN1ciA9IGxvb3A7XG4gICAgd2hpbGUgKHJlY3VyID09PSBsb29wKSB7XG4gICAgICByZWN1ciA9IChpc05pbChjaCkpIHx8IChpc1doaXRlc3BhY2UoY2gpKSB8fCAoaXNNYWNyb1Rlcm1pbmF0aW5nKGNoKSkgP1xuICAgICAgYnVmZmVyIDpcbiAgICAgIChidWZmZXIgPSBcIlwiICsgYnVmZmVyICsgKHJlYWRDaGFyKHJlYWRlcikpLCBjaCA9IHBlZWtDaGFyKHJlYWRlciksIGxvb3ApO1xuICAgIH07XG4gICAgcmV0dXJuIHJlY3VyO1xuICB9KShpbml0Y2gsIHBlZWtDaGFyKHJlYWRlcikpO1xufTtcbmV4cG9ydHMucmVhZFRva2VuID0gcmVhZFRva2VuO1xuXG52YXIgc2tpcExpbmUgPSBmdW5jdGlvbiBza2lwTGluZShyZWFkZXIsIF8pIHtcbiAgcmV0dXJuIChmdW5jdGlvbiBsb29wKCkge1xuICAgIHZhciByZWN1ciA9IGxvb3A7XG4gICAgd2hpbGUgKHJlY3VyID09PSBsb29wKSB7XG4gICAgICByZWN1ciA9IChmdW5jdGlvbigpIHtcbiAgICAgIHZhciBjaCA9IHJlYWRDaGFyKHJlYWRlcik7XG4gICAgICByZXR1cm4gKGNoID09PSBcIlxcblwiKSB8fCAoY2ggPT09IFwiXFxyXCIpIHx8IChpc05pbChjaCkpID9cbiAgICAgICAgcmVhZGVyIDpcbiAgICAgICAgKGxvb3ApO1xuICAgIH0pKCk7XG4gICAgfTtcbiAgICByZXR1cm4gcmVjdXI7XG4gIH0pKCk7XG59O1xuZXhwb3J0cy5za2lwTGluZSA9IHNraXBMaW5lO1xuXG52YXIgaW50UGF0dGVybiA9IHJlUGF0dGVybihcIl4oWy0rXT8pKD86KDApfChbMS05XVswLTldKil8MFt4WF0oWzAtOUEtRmEtZl0rKXwwKFswLTddKyl8KFsxLTldWzAtOV0/KVtyUl0oWzAtOUEtWmEtel0rKXwwWzAtOV0rKShOKT8kXCIpO1xuZXhwb3J0cy5pbnRQYXR0ZXJuID0gaW50UGF0dGVybjtcblxudmFyIHJhdGlvUGF0dGVybiA9IHJlUGF0dGVybihcIihbLStdP1swLTldKykvKFswLTldKylcIik7XG5leHBvcnRzLnJhdGlvUGF0dGVybiA9IHJhdGlvUGF0dGVybjtcblxudmFyIGZsb2F0UGF0dGVybiA9IHJlUGF0dGVybihcIihbLStdP1swLTldKyhcXFxcLlswLTldKik/KFtlRV1bLStdP1swLTldKyk/KShNKT9cIik7XG5leHBvcnRzLmZsb2F0UGF0dGVybiA9IGZsb2F0UGF0dGVybjtcblxudmFyIG1hdGNoSW50ID0gZnVuY3Rpb24gbWF0Y2hJbnQocykge1xuICB2YXIgZ3JvdXBzID0gcmVGaW5kKGludFBhdHRlcm4sIHMpO1xuICB2YXIgZ3JvdXAzID0gZ3JvdXBzWzJdO1xuICByZXR1cm4gISgoaXNOaWwoZ3JvdXAzKSkgfHwgKGNvdW50KGdyb3VwMykgPCAxKSkgP1xuICAgIDAgOlxuICAgIChmdW5jdGlvbigpIHtcbiAgICAgIHZhciBuZWdhdGUgPSBcIi1cIiA9PT0gZ3JvdXBzWzFdID9cbiAgICAgICAgLTEgOlxuICAgICAgICAxO1xuICAgICAgdmFyIGEgPSBncm91cHNbM10gP1xuICAgICAgICBbZ3JvdXBzWzNdLCAxMF0gOlxuICAgICAgZ3JvdXBzWzRdID9cbiAgICAgICAgW2dyb3Vwc1s0XSwgMTZdIDpcbiAgICAgIGdyb3Vwc1s1XSA/XG4gICAgICAgIFtncm91cHNbNV0sIDhdIDpcbiAgICAgIGdyb3Vwc1s3XSA/XG4gICAgICAgIFtncm91cHNbN10sIHBhcnNlSW50KGdyb3Vwc1s3XSldIDpcbiAgICAgIFwiZWxzZVwiID9cbiAgICAgICAgW3ZvaWQoMCksIHZvaWQoMCldIDpcbiAgICAgICAgdm9pZCgwKTtcbiAgICAgIHZhciBuID0gYVswXTtcbiAgICAgIHZhciByYWRpeCA9IGFbMV07XG4gICAgICByZXR1cm4gaXNOaWwobikgP1xuICAgICAgICB2b2lkKDApIDpcbiAgICAgICAgbmVnYXRlICogKHBhcnNlSW50KG4sIHJhZGl4KSk7XG4gICAgfSkoKTtcbn07XG5leHBvcnRzLm1hdGNoSW50ID0gbWF0Y2hJbnQ7XG5cbnZhciBtYXRjaFJhdGlvID0gZnVuY3Rpb24gbWF0Y2hSYXRpbyhzKSB7XG4gIHZhciBncm91cHMgPSByZUZpbmQocmF0aW9QYXR0ZXJuLCBzKTtcbiAgdmFyIG51bWluYXRvciA9IGdyb3Vwc1sxXTtcbiAgdmFyIGRlbm9taW5hdG9yID0gZ3JvdXBzWzJdO1xuICByZXR1cm4gKHBhcnNlSW50KG51bWluYXRvcikpIC8gKHBhcnNlSW50KGRlbm9taW5hdG9yKSk7XG59O1xuZXhwb3J0cy5tYXRjaFJhdGlvID0gbWF0Y2hSYXRpbztcblxudmFyIG1hdGNoRmxvYXQgPSBmdW5jdGlvbiBtYXRjaEZsb2F0KHMpIHtcbiAgcmV0dXJuIHBhcnNlRmxvYXQocyk7XG59O1xuZXhwb3J0cy5tYXRjaEZsb2F0ID0gbWF0Y2hGbG9hdDtcblxudmFyIG1hdGNoTnVtYmVyID0gZnVuY3Rpb24gbWF0Y2hOdW1iZXIocykge1xuICByZXR1cm4gcmVNYXRjaGVzKGludFBhdHRlcm4sIHMpID9cbiAgICBtYXRjaEludChzKSA6XG4gIHJlTWF0Y2hlcyhyYXRpb1BhdHRlcm4sIHMpID9cbiAgICBtYXRjaFJhdGlvKHMpIDpcbiAgcmVNYXRjaGVzKGZsb2F0UGF0dGVybiwgcykgP1xuICAgIG1hdGNoRmxvYXQocykgOlxuICAgIHZvaWQoMCk7XG59O1xuZXhwb3J0cy5tYXRjaE51bWJlciA9IG1hdGNoTnVtYmVyO1xuXG52YXIgZXNjYXBlQ2hhck1hcCA9IGZ1bmN0aW9uIGVzY2FwZUNoYXJNYXAoYykge1xuICByZXR1cm4gYyA9PT0gXCJ0XCIgP1xuICAgIFwiXFx0XCIgOlxuICBjID09PSBcInJcIiA/XG4gICAgXCJcXHJcIiA6XG4gIGMgPT09IFwiblwiID9cbiAgICBcIlxcblwiIDpcbiAgYyA9PT0gXCJcXFxcXCIgP1xuICAgIFwiXFxcXFwiIDpcbiAgYyA9PT0gXCJcXFwiXCIgP1xuICAgIFwiXFxcIlwiIDpcbiAgYyA9PT0gXCJiXCIgP1xuICAgIFwiXGJcIiA6XG4gIGMgPT09IFwiZlwiID9cbiAgICBcIlxmXCIgOlxuICBcImVsc2VcIiA/XG4gICAgdm9pZCgwKSA6XG4gICAgdm9pZCgwKTtcbn07XG5leHBvcnRzLmVzY2FwZUNoYXJNYXAgPSBlc2NhcGVDaGFyTWFwO1xuXG52YXIgcmVhZDJDaGFycyA9IGZ1bmN0aW9uIHJlYWQyQ2hhcnMocmVhZGVyKSB7XG4gIHJldHVybiBcIlwiICsgKHJlYWRDaGFyKHJlYWRlcikpICsgKHJlYWRDaGFyKHJlYWRlcikpO1xufTtcbmV4cG9ydHMucmVhZDJDaGFycyA9IHJlYWQyQ2hhcnM7XG5cbnZhciByZWFkNENoYXJzID0gZnVuY3Rpb24gcmVhZDRDaGFycyhyZWFkZXIpIHtcbiAgcmV0dXJuIFwiXCIgKyAocmVhZENoYXIocmVhZGVyKSkgKyAocmVhZENoYXIocmVhZGVyKSkgKyAocmVhZENoYXIocmVhZGVyKSkgKyAocmVhZENoYXIocmVhZGVyKSk7XG59O1xuZXhwb3J0cy5yZWFkNENoYXJzID0gcmVhZDRDaGFycztcblxudmFyIHVuaWNvZGUyUGF0dGVybiA9IHJlUGF0dGVybihcIlswLTlBLUZhLWZdezJ9XCIpO1xuZXhwb3J0cy51bmljb2RlMlBhdHRlcm4gPSB1bmljb2RlMlBhdHRlcm47XG5cbnZhciB1bmljb2RlNFBhdHRlcm4gPSByZVBhdHRlcm4oXCJbMC05QS1GYS1mXXs0fVwiKTtcbmV4cG9ydHMudW5pY29kZTRQYXR0ZXJuID0gdW5pY29kZTRQYXR0ZXJuO1xuXG52YXIgdmFsaWRhdGVVbmljb2RlRXNjYXBlID0gZnVuY3Rpb24gdmFsaWRhdGVVbmljb2RlRXNjYXBlKHVuaWNvZGVQYXR0ZXJuLCByZWFkZXIsIGVzY2FwZUNoYXIsIHVuaWNvZGVTdHIpIHtcbiAgcmV0dXJuIHJlTWF0Y2hlcyh1bmljb2RlUGF0dGVybiwgdW5pY29kZVN0cikgP1xuICAgIHVuaWNvZGVTdHIgOlxuICAgIHJlYWRlckVycm9yKHJlYWRlciwgXCJcIiArIFwiVW5leHBlY3RlZCB1bmljb2RlIGVzY2FwZSBcIiArIFwiXFxcXFwiICsgZXNjYXBlQ2hhciArIHVuaWNvZGVTdHIpO1xufTtcbmV4cG9ydHMudmFsaWRhdGVVbmljb2RlRXNjYXBlID0gdmFsaWRhdGVVbmljb2RlRXNjYXBlO1xuXG52YXIgbWFrZVVuaWNvZGVDaGFyID0gZnVuY3Rpb24gbWFrZVVuaWNvZGVDaGFyKGNvZGVTdHIsIGJhc2UpIHtcbiAgdmFyIGJhc2UgPSBiYXNlIHx8IDE2O1xuICB2YXIgY29kZSA9IHBhcnNlSW50KGNvZGVTdHIsIGJhc2UpO1xuICByZXR1cm4gY2hhcihjb2RlKTtcbn07XG5leHBvcnRzLm1ha2VVbmljb2RlQ2hhciA9IG1ha2VVbmljb2RlQ2hhcjtcblxudmFyIGVzY2FwZUNoYXIgPSBmdW5jdGlvbiBlc2NhcGVDaGFyKGJ1ZmZlciwgcmVhZGVyKSB7XG4gIHZhciBjaCA9IHJlYWRDaGFyKHJlYWRlcik7XG4gIHZhciBtYXByZXN1bHQgPSBlc2NhcGVDaGFyTWFwKGNoKTtcbiAgcmV0dXJuIG1hcHJlc3VsdCA/XG4gICAgbWFwcmVzdWx0IDpcbiAgY2ggPT09IFwieFwiID9cbiAgICBtYWtlVW5pY29kZUNoYXIodmFsaWRhdGVVbmljb2RlRXNjYXBlKHVuaWNvZGUyUGF0dGVybiwgcmVhZGVyLCBjaCwgcmVhZDJDaGFycyhyZWFkZXIpKSkgOlxuICBjaCA9PT0gXCJ1XCIgP1xuICAgIG1ha2VVbmljb2RlQ2hhcih2YWxpZGF0ZVVuaWNvZGVFc2NhcGUodW5pY29kZTRQYXR0ZXJuLCByZWFkZXIsIGNoLCByZWFkNENoYXJzKHJlYWRlcikpKSA6XG4gIGlzTnVtZXJpYyhjaCkgP1xuICAgIGNoYXIoY2gpIDpcbiAgXCJlbHNlXCIgP1xuICAgIHJlYWRlckVycm9yKHJlYWRlciwgXCJcIiArIFwiVW5leHBlY3RlZCB1bmljb2RlIGVzY2FwZSBcIiArIFwiXFxcXFwiICsgY2gpIDpcbiAgICB2b2lkKDApO1xufTtcbmV4cG9ydHMuZXNjYXBlQ2hhciA9IGVzY2FwZUNoYXI7XG5cbnZhciByZWFkUGFzdCA9IGZ1bmN0aW9uIHJlYWRQYXN0KHByZWRpY2F0ZSwgcmVhZGVyKSB7XG4gIHJldHVybiAoZnVuY3Rpb24gbG9vcChfKSB7XG4gICAgdmFyIHJlY3VyID0gbG9vcDtcbiAgICB3aGlsZSAocmVjdXIgPT09IGxvb3ApIHtcbiAgICAgIHJlY3VyID0gcHJlZGljYXRlKHBlZWtDaGFyKHJlYWRlcikpID9cbiAgICAgIChfID0gcmVhZENoYXIocmVhZGVyKSwgbG9vcCkgOlxuICAgICAgcGVla0NoYXIocmVhZGVyKTtcbiAgICB9O1xuICAgIHJldHVybiByZWN1cjtcbiAgfSkodm9pZCgwKSk7XG59O1xuZXhwb3J0cy5yZWFkUGFzdCA9IHJlYWRQYXN0O1xuXG52YXIgcmVhZERlbGltaXRlZExpc3QgPSBmdW5jdGlvbiByZWFkRGVsaW1pdGVkTGlzdChkZWxpbSwgcmVhZGVyLCBpc1JlY3Vyc2l2ZSkge1xuICByZXR1cm4gKGZ1bmN0aW9uIGxvb3AoZm9ybSkge1xuICAgIHZhciByZWN1ciA9IGxvb3A7XG4gICAgd2hpbGUgKHJlY3VyID09PSBsb29wKSB7XG4gICAgICByZWN1ciA9IChmdW5jdGlvbigpIHtcbiAgICAgIHZhciBjaCA9IHJlYWRQYXN0KGlzV2hpdGVzcGFjZSwgcmVhZGVyKTtcbiAgICAgICEoY2gpID9cbiAgICAgICAgcmVhZGVyRXJyb3IocmVhZGVyLCBcIkVPRlwiKSA6XG4gICAgICAgIHZvaWQoMCk7XG4gICAgICByZXR1cm4gZGVsaW0gPT09IGNoID9cbiAgICAgICAgKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJlYWRDaGFyKHJlYWRlcik7XG4gICAgICAgICAgcmV0dXJuIGZvcm07XG4gICAgICAgIH0pKCkgOlxuICAgICAgICAoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIG1hY3JvID0gbWFjcm9zKGNoKTtcbiAgICAgICAgICByZXR1cm4gbWFjcm8gP1xuICAgICAgICAgICAgKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gbWFjcm8ocmVhZGVyLCByZWFkQ2hhcihyZWFkZXIpKTtcbiAgICAgICAgICAgICAgcmV0dXJuIChmb3JtID0gcmVzdWx0ID09PSByZWFkZXIgP1xuICAgICAgICAgICAgICAgIGZvcm0gOlxuICAgICAgICAgICAgICAgIGNvbmooZm9ybSwgcmVzdWx0KSwgbG9vcCk7XG4gICAgICAgICAgICB9KSgpIDpcbiAgICAgICAgICAgIChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgdmFyIG8gPSByZWFkKHJlYWRlciwgdHJ1ZSwgdm9pZCgwKSwgaXNSZWN1cnNpdmUpO1xuICAgICAgICAgICAgICByZXR1cm4gKGZvcm0gPSBvID09PSByZWFkZXIgP1xuICAgICAgICAgICAgICAgIGZvcm0gOlxuICAgICAgICAgICAgICAgIGNvbmooZm9ybSwgbyksIGxvb3ApO1xuICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgfSkoKTtcbiAgICB9KSgpO1xuICAgIH07XG4gICAgcmV0dXJuIHJlY3VyO1xuICB9KShbXSk7XG59O1xuZXhwb3J0cy5yZWFkRGVsaW1pdGVkTGlzdCA9IHJlYWREZWxpbWl0ZWRMaXN0O1xuXG52YXIgbm90SW1wbGVtZW50ZWQgPSBmdW5jdGlvbiBub3RJbXBsZW1lbnRlZChyZWFkZXIsIGNoKSB7XG4gIHJldHVybiByZWFkZXJFcnJvcihyZWFkZXIsIFwiXCIgKyBcIlJlYWRlciBmb3IgXCIgKyBjaCArIFwiIG5vdCBpbXBsZW1lbnRlZCB5ZXRcIik7XG59O1xuZXhwb3J0cy5ub3RJbXBsZW1lbnRlZCA9IG5vdEltcGxlbWVudGVkO1xuXG52YXIgcmVhZERpc3BhdGNoID0gZnVuY3Rpb24gcmVhZERpc3BhdGNoKHJlYWRlciwgXykge1xuICB2YXIgY2ggPSByZWFkQ2hhcihyZWFkZXIpO1xuICB2YXIgZG0gPSBkaXNwYXRjaE1hY3JvcyhjaCk7XG4gIHJldHVybiBkbSA/XG4gICAgZG0ocmVhZGVyLCBfKSA6XG4gICAgKGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIG9iamVjdCA9IG1heWJlUmVhZFRhZ2dlZFR5cGUocmVhZGVyLCBjaCk7XG4gICAgICByZXR1cm4gb2JqZWN0ID9cbiAgICAgICAgb2JqZWN0IDpcbiAgICAgICAgcmVhZGVyRXJyb3IocmVhZGVyLCBcIk5vIGRpc3BhdGNoIG1hY3JvIGZvciBcIiwgY2gpO1xuICAgIH0pKCk7XG59O1xuZXhwb3J0cy5yZWFkRGlzcGF0Y2ggPSByZWFkRGlzcGF0Y2g7XG5cbnZhciByZWFkVW5tYXRjaGVkRGVsaW1pdGVyID0gZnVuY3Rpb24gcmVhZFVubWF0Y2hlZERlbGltaXRlcihyZHIsIGNoKSB7XG4gIHJldHVybiByZWFkZXJFcnJvcihyZHIsIFwiVW5tYWNoZWQgZGVsaW1pdGVyIFwiLCBjaCk7XG59O1xuZXhwb3J0cy5yZWFkVW5tYXRjaGVkRGVsaW1pdGVyID0gcmVhZFVubWF0Y2hlZERlbGltaXRlcjtcblxudmFyIHJlYWRMaXN0ID0gZnVuY3Rpb24gcmVhZExpc3QocmVhZGVyLCBfKSB7XG4gIHZhciBmb3JtID0gcmVhZERlbGltaXRlZExpc3QoXCIpXCIsIHJlYWRlciwgdHJ1ZSk7XG4gIHJldHVybiB3aXRoTWV0YShsaXN0LmFwcGx5KGxpc3QsIGZvcm0pLCBtZXRhKGZvcm0pKTtcbn07XG5leHBvcnRzLnJlYWRMaXN0ID0gcmVhZExpc3Q7XG5cbnZhciByZWFkQ29tbWVudCA9IGZ1bmN0aW9uIHJlYWRDb21tZW50KHJlYWRlciwgXykge1xuICByZXR1cm4gKGZ1bmN0aW9uIGxvb3AoYnVmZmVyLCBjaCkge1xuICAgIHZhciByZWN1ciA9IGxvb3A7XG4gICAgd2hpbGUgKHJlY3VyID09PSBsb29wKSB7XG4gICAgICByZWN1ciA9IChpc05pbChjaCkpIHx8IChcIlxcblwiID09PSBjaCkgP1xuICAgICAgcmVhZGVyIHx8IChsaXN0KHN5bWJvbCh2b2lkKDApLCBcImNvbW1lbnRcIiksIGJ1ZmZlcikpIDpcbiAgICAoXCJcXFxcXCIgPT09IGNoKSA/XG4gICAgICAoYnVmZmVyID0gXCJcIiArIGJ1ZmZlciArIChlc2NhcGVDaGFyKGJ1ZmZlciwgcmVhZGVyKSksIGNoID0gcmVhZENoYXIocmVhZGVyKSwgbG9vcCkgOlxuICAgIFwiZWxzZVwiID9cbiAgICAgIChidWZmZXIgPSBcIlwiICsgYnVmZmVyICsgY2gsIGNoID0gcmVhZENoYXIocmVhZGVyKSwgbG9vcCkgOlxuICAgICAgdm9pZCgwKTtcbiAgICB9O1xuICAgIHJldHVybiByZWN1cjtcbiAgfSkoXCJcIiwgcmVhZENoYXIocmVhZGVyKSk7XG59O1xuZXhwb3J0cy5yZWFkQ29tbWVudCA9IHJlYWRDb21tZW50O1xuXG52YXIgcmVhZFZlY3RvciA9IGZ1bmN0aW9uIHJlYWRWZWN0b3IocmVhZGVyKSB7XG4gIHJldHVybiByZWFkRGVsaW1pdGVkTGlzdChcIl1cIiwgcmVhZGVyLCB0cnVlKTtcbn07XG5leHBvcnRzLnJlYWRWZWN0b3IgPSByZWFkVmVjdG9yO1xuXG52YXIgcmVhZE1hcCA9IGZ1bmN0aW9uIHJlYWRNYXAocmVhZGVyKSB7XG4gIHZhciBmb3JtID0gcmVhZERlbGltaXRlZExpc3QoXCJ9XCIsIHJlYWRlciwgdHJ1ZSk7XG4gIHJldHVybiBpc09kZChjb3VudChmb3JtKSkgP1xuICAgIHJlYWRlckVycm9yKHJlYWRlciwgXCJNYXAgbGl0ZXJhbCBtdXN0IGNvbnRhaW4gYW4gZXZlbiBudW1iZXIgb2YgZm9ybXNcIikgOlxuICAgIHdpdGhNZXRhKGRpY3Rpb25hcnkuYXBwbHkoZGljdGlvbmFyeSwgZm9ybSksIG1ldGEoZm9ybSkpO1xufTtcbmV4cG9ydHMucmVhZE1hcCA9IHJlYWRNYXA7XG5cbnZhciByZWFkU2V0ID0gZnVuY3Rpb24gcmVhZFNldChyZWFkZXIsIF8pIHtcbiAgdmFyIGZvcm0gPSByZWFkRGVsaW1pdGVkTGlzdChcIn1cIiwgcmVhZGVyLCB0cnVlKTtcbiAgcmV0dXJuIHdpdGhNZXRhKGNvbmNhdChbc3ltYm9sKHZvaWQoMCksIFwic2V0XCIpXSwgZm9ybSksIG1ldGEoZm9ybSkpO1xufTtcbmV4cG9ydHMucmVhZFNldCA9IHJlYWRTZXQ7XG5cbnZhciByZWFkTnVtYmVyID0gZnVuY3Rpb24gcmVhZE51bWJlcihyZWFkZXIsIGluaXRjaCkge1xuICByZXR1cm4gKGZ1bmN0aW9uIGxvb3AoYnVmZmVyLCBjaCkge1xuICAgIHZhciByZWN1ciA9IGxvb3A7XG4gICAgd2hpbGUgKHJlY3VyID09PSBsb29wKSB7XG4gICAgICByZWN1ciA9IChpc05pbChjaCkpIHx8IChpc1doaXRlc3BhY2UoY2gpKSB8fCAobWFjcm9zKGNoKSkgP1xuICAgICAgKGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgbWF0Y2ggPSBtYXRjaE51bWJlcihidWZmZXIpO1xuICAgICAgICByZXR1cm4gaXNOaWwobWF0Y2gpID9cbiAgICAgICAgICByZWFkZXJFcnJvcihyZWFkZXIsIFwiSW52YWxpZCBudW1iZXIgZm9ybWF0IFtcIiwgYnVmZmVyLCBcIl1cIikgOlxuICAgICAgICAgIG1hdGNoO1xuICAgICAgfSkoKSA6XG4gICAgICAoYnVmZmVyID0gXCJcIiArIGJ1ZmZlciArIChyZWFkQ2hhcihyZWFkZXIpKSwgY2ggPSBwZWVrQ2hhcihyZWFkZXIpLCBsb29wKTtcbiAgICB9O1xuICAgIHJldHVybiByZWN1cjtcbiAgfSkoaW5pdGNoLCBwZWVrQ2hhcihyZWFkZXIpKTtcbn07XG5leHBvcnRzLnJlYWROdW1iZXIgPSByZWFkTnVtYmVyO1xuXG52YXIgcmVhZFN0cmluZyA9IGZ1bmN0aW9uIHJlYWRTdHJpbmcocmVhZGVyKSB7XG4gIHJldHVybiAoZnVuY3Rpb24gbG9vcChidWZmZXIsIGNoKSB7XG4gICAgdmFyIHJlY3VyID0gbG9vcDtcbiAgICB3aGlsZSAocmVjdXIgPT09IGxvb3ApIHtcbiAgICAgIHJlY3VyID0gaXNOaWwoY2gpID9cbiAgICAgIHJlYWRlckVycm9yKHJlYWRlciwgXCJFT0Ygd2hpbGUgcmVhZGluZyBzdHJpbmdcIikgOlxuICAgIFwiXFxcXFwiID09PSBjaCA/XG4gICAgICAoYnVmZmVyID0gXCJcIiArIGJ1ZmZlciArIChlc2NhcGVDaGFyKGJ1ZmZlciwgcmVhZGVyKSksIGNoID0gcmVhZENoYXIocmVhZGVyKSwgbG9vcCkgOlxuICAgIFwiXFxcIlwiID09PSBjaCA/XG4gICAgICBidWZmZXIgOlxuICAgIFwiZGVmYXVsdFwiID9cbiAgICAgIChidWZmZXIgPSBcIlwiICsgYnVmZmVyICsgY2gsIGNoID0gcmVhZENoYXIocmVhZGVyKSwgbG9vcCkgOlxuICAgICAgdm9pZCgwKTtcbiAgICB9O1xuICAgIHJldHVybiByZWN1cjtcbiAgfSkoXCJcIiwgcmVhZENoYXIocmVhZGVyKSk7XG59O1xuZXhwb3J0cy5yZWFkU3RyaW5nID0gcmVhZFN0cmluZztcblxudmFyIHJlYWRVbnF1b3RlID0gZnVuY3Rpb24gcmVhZFVucXVvdGUocmVhZGVyKSB7XG4gIHZhciBjaCA9IHBlZWtDaGFyKHJlYWRlcik7XG4gIHJldHVybiAhKGNoKSA/XG4gICAgcmVhZGVyRXJyb3IocmVhZGVyLCBcIkVPRiB3aGlsZSByZWFkaW5nIGNoYXJhY3RlclwiKSA6XG4gIGNoID09PSBcIkBcIiA/XG4gICAgKGZ1bmN0aW9uKCkge1xuICAgICAgcmVhZENoYXIocmVhZGVyKTtcbiAgICAgIHJldHVybiBsaXN0KHN5bWJvbCh2b2lkKDApLCBcInVucXVvdGUtc3BsaWNpbmdcIiksIHJlYWQocmVhZGVyLCB0cnVlLCB2b2lkKDApLCB0cnVlKSk7XG4gICAgfSkoKSA6XG4gICAgbGlzdChzeW1ib2wodm9pZCgwKSwgXCJ1bnF1b3RlXCIpLCByZWFkKHJlYWRlciwgdHJ1ZSwgdm9pZCgwKSwgdHJ1ZSkpO1xufTtcbmV4cG9ydHMucmVhZFVucXVvdGUgPSByZWFkVW5xdW90ZTtcblxudmFyIHNwZWNpYWxTeW1ib2xzID0gZnVuY3Rpb24gc3BlY2lhbFN5bWJvbHModGV4dCwgbm90Rm91bmQpIHtcbiAgcmV0dXJuIHRleHQgPT09IFwibmlsXCIgP1xuICAgIHZvaWQoMCkgOlxuICB0ZXh0ID09PSBcInRydWVcIiA/XG4gICAgdHJ1ZSA6XG4gIHRleHQgPT09IFwiZmFsc2VcIiA/XG4gICAgZmFsc2UgOlxuICBcImVsc2VcIiA/XG4gICAgbm90Rm91bmQgOlxuICAgIHZvaWQoMCk7XG59O1xuZXhwb3J0cy5zcGVjaWFsU3ltYm9scyA9IHNwZWNpYWxTeW1ib2xzO1xuXG52YXIgcmVhZFN5bWJvbCA9IGZ1bmN0aW9uIHJlYWRTeW1ib2wocmVhZGVyLCBpbml0Y2gpIHtcbiAgdmFyIHRva2VuID0gcmVhZFRva2VuKHJlYWRlciwgaW5pdGNoKTtcbiAgdmFyIHBhcnRzID0gc3BsaXQodG9rZW4sIFwiL1wiKTtcbiAgdmFyIGhhc05zID0gKGNvdW50KHBhcnRzKSA+IDEpICYmIChjb3VudCh0b2tlbikgPiAxKTtcbiAgdmFyIG5zID0gZmlyc3QocGFydHMpO1xuICB2YXIgbmFtZSA9IGpvaW4oXCIvXCIsIHJlc3QocGFydHMpKTtcbiAgcmV0dXJuIGhhc05zID9cbiAgICBzeW1ib2wobnMsIG5hbWUpIDpcbiAgICBzcGVjaWFsU3ltYm9scyh0b2tlbiwgc3ltYm9sKHRva2VuKSk7XG59O1xuZXhwb3J0cy5yZWFkU3ltYm9sID0gcmVhZFN5bWJvbDtcblxudmFyIHJlYWRLZXl3b3JkID0gZnVuY3Rpb24gcmVhZEtleXdvcmQocmVhZGVyLCBpbml0Y2gpIHtcbiAgdmFyIHRva2VuID0gcmVhZFRva2VuKHJlYWRlciwgcmVhZENoYXIocmVhZGVyKSk7XG4gIHZhciBwYXJ0cyA9IHNwbGl0KHRva2VuLCBcIi9cIik7XG4gIHZhciBuYW1lID0gbGFzdChwYXJ0cyk7XG4gIHZhciBucyA9IGNvdW50KHBhcnRzKSA+IDEgP1xuICAgIGpvaW4oXCIvXCIsIGJ1dGxhc3QocGFydHMpKSA6XG4gICAgdm9pZCgwKTtcbiAgdmFyIGlzc3VlID0gbGFzdChucykgPT09IFwiOlwiID9cbiAgICBcIm5hbWVzcGFjZSBjYW4ndCBlbmRzIHdpdGggXFxcIjpcXFwiXCIgOlxuICBsYXN0KG5hbWUpID09PSBcIjpcIiA/XG4gICAgXCJuYW1lIGNhbid0IGVuZCB3aXRoIFxcXCI6XFxcIlwiIDpcbiAgbGFzdChuYW1lKSA9PT0gXCIvXCIgP1xuICAgIFwibmFtZSBjYW4ndCBlbmQgd2l0aCBcXFwiL1xcXCJcIiA6XG4gIGNvdW50KHNwbGl0KHRva2VuLCBcIjo6XCIpKSA+IDEgP1xuICAgIFwibmFtZSBjYW4ndCBjb250YWluIFxcXCI6OlxcXCJcIiA6XG4gICAgdm9pZCgwKTtcbiAgcmV0dXJuIGlzc3VlID9cbiAgICByZWFkZXJFcnJvcihyZWFkZXIsIFwiSW52YWxpZCB0b2tlbiAoXCIsIGlzc3VlLCBcIik6IFwiLCB0b2tlbikgOlxuICAoIShucykpICYmIChmaXJzdChuYW1lKSA9PT0gXCI6XCIpID9cbiAgICBrZXl3b3JkKHJlc3QobmFtZSkpIDpcbiAgICBrZXl3b3JkKG5zLCBuYW1lKTtcbn07XG5leHBvcnRzLnJlYWRLZXl3b3JkID0gcmVhZEtleXdvcmQ7XG5cbnZhciBkZXN1Z2FyTWV0YSA9IGZ1bmN0aW9uIGRlc3VnYXJNZXRhKGYpIHtcbiAgcmV0dXJuIGlzS2V5d29yZChmKSA/XG4gICAgZGljdGlvbmFyeShuYW1lKGYpLCB0cnVlKSA6XG4gIGlzU3ltYm9sKGYpID9cbiAgICB7XG4gICAgICBcInRhZ1wiOiBmXG4gICAgfSA6XG4gIGlzU3RyaW5nKGYpID9cbiAgICB7XG4gICAgICBcInRhZ1wiOiBmXG4gICAgfSA6XG4gIFwiZWxzZVwiID9cbiAgICBmIDpcbiAgICB2b2lkKDApO1xufTtcbmV4cG9ydHMuZGVzdWdhck1ldGEgPSBkZXN1Z2FyTWV0YTtcblxudmFyIHdyYXBwaW5nUmVhZGVyID0gZnVuY3Rpb24gd3JhcHBpbmdSZWFkZXIocHJlZml4KSB7XG4gIHJldHVybiBmdW5jdGlvbihyZWFkZXIpIHtcbiAgICByZXR1cm4gbGlzdChwcmVmaXgsIHJlYWQocmVhZGVyLCB0cnVlLCB2b2lkKDApLCB0cnVlKSk7XG4gIH07XG59O1xuZXhwb3J0cy53cmFwcGluZ1JlYWRlciA9IHdyYXBwaW5nUmVhZGVyO1xuXG52YXIgdGhyb3dpbmdSZWFkZXIgPSBmdW5jdGlvbiB0aHJvd2luZ1JlYWRlcihtc2cpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKHJlYWRlcikge1xuICAgIHJldHVybiByZWFkZXJFcnJvcihyZWFkZXIsIG1zZyk7XG4gIH07XG59O1xuZXhwb3J0cy50aHJvd2luZ1JlYWRlciA9IHRocm93aW5nUmVhZGVyO1xuXG52YXIgcmVhZE1ldGEgPSBmdW5jdGlvbiByZWFkTWV0YShyZWFkZXIsIF8pIHtcbiAgdmFyIG1ldGFkYXRhID0gZGVzdWdhck1ldGEocmVhZChyZWFkZXIsIHRydWUsIHZvaWQoMCksIHRydWUpKTtcbiAgIShpc0RpY3Rpb25hcnkobWV0YWRhdGEpKSA/XG4gICAgcmVhZGVyRXJyb3IocmVhZGVyLCBcIk1ldGFkYXRhIG11c3QgYmUgU3ltYm9sLCBLZXl3b3JkLCBTdHJpbmcgb3IgTWFwXCIpIDpcbiAgICB2b2lkKDApO1xuICByZXR1cm4gKGZ1bmN0aW9uKCkge1xuICAgIHZhciBmb3JtID0gcmVhZChyZWFkZXIsIHRydWUsIHZvaWQoMCksIHRydWUpO1xuICAgIHJldHVybiBpc09iamVjdChmb3JtKSA/XG4gICAgICB3aXRoTWV0YShmb3JtLCBjb25qKG1ldGFkYXRhLCBtZXRhKGZvcm0pKSkgOlxuICAgICAgZm9ybTtcbiAgfSkoKTtcbn07XG5leHBvcnRzLnJlYWRNZXRhID0gcmVhZE1ldGE7XG5cbnZhciByZWFkUmVnZXggPSBmdW5jdGlvbiByZWFkUmVnZXgocmVhZGVyKSB7XG4gIHJldHVybiAoZnVuY3Rpb24gbG9vcChidWZmZXIsIGNoKSB7XG4gICAgdmFyIHJlY3VyID0gbG9vcDtcbiAgICB3aGlsZSAocmVjdXIgPT09IGxvb3ApIHtcbiAgICAgIHJlY3VyID0gaXNOaWwoY2gpID9cbiAgICAgIHJlYWRlckVycm9yKHJlYWRlciwgXCJFT0Ygd2hpbGUgcmVhZGluZyBzdHJpbmdcIikgOlxuICAgIFwiXFxcXFwiID09PSBjaCA/XG4gICAgICAoYnVmZmVyID0gXCJcIiArIGJ1ZmZlciArIGNoICsgKHJlYWRDaGFyKHJlYWRlcikpLCBjaCA9IHJlYWRDaGFyKHJlYWRlciksIGxvb3ApIDpcbiAgICBcIlxcXCJcIiA9PT0gY2ggP1xuICAgICAgcmVQYXR0ZXJuKGJ1ZmZlcikgOlxuICAgIFwiZGVmYXVsdFwiID9cbiAgICAgIChidWZmZXIgPSBcIlwiICsgYnVmZmVyICsgY2gsIGNoID0gcmVhZENoYXIocmVhZGVyKSwgbG9vcCkgOlxuICAgICAgdm9pZCgwKTtcbiAgICB9O1xuICAgIHJldHVybiByZWN1cjtcbiAgfSkoXCJcIiwgcmVhZENoYXIocmVhZGVyKSk7XG59O1xuZXhwb3J0cy5yZWFkUmVnZXggPSByZWFkUmVnZXg7XG5cbnZhciByZWFkUGFyYW0gPSBmdW5jdGlvbiByZWFkUGFyYW0ocmVhZGVyLCBpbml0Y2gpIHtcbiAgdmFyIGZvcm0gPSByZWFkU3ltYm9sKHJlYWRlciwgaW5pdGNoKTtcbiAgcmV0dXJuIGlzRXF1YWwoZm9ybSwgc3ltYm9sKFwiJVwiKSkgP1xuICAgIHN5bWJvbChcIiUxXCIpIDpcbiAgICBmb3JtO1xufTtcbmV4cG9ydHMucmVhZFBhcmFtID0gcmVhZFBhcmFtO1xuXG52YXIgaXNQYXJhbSA9IGZ1bmN0aW9uIGlzUGFyYW0oZm9ybSkge1xuICByZXR1cm4gKGlzU3ltYm9sKGZvcm0pKSAmJiAoXCIlXCIgPT09IGZpcnN0KG5hbWUoZm9ybSkpKTtcbn07XG5leHBvcnRzLmlzUGFyYW0gPSBpc1BhcmFtO1xuXG52YXIgbGFtYmRhUGFyYW1zSGFzaCA9IGZ1bmN0aW9uIGxhbWJkYVBhcmFtc0hhc2goZm9ybSkge1xuICByZXR1cm4gaXNQYXJhbShmb3JtKSA/XG4gICAgZGljdGlvbmFyeShmb3JtLCBmb3JtKSA6XG4gIChpc0RpY3Rpb25hcnkoZm9ybSkpIHx8IChpc1ZlY3Rvcihmb3JtKSkgfHwgKGlzTGlzdChmb3JtKSkgP1xuICAgIGNvbmouYXBwbHkoY29uaiwgbWFwKGxhbWJkYVBhcmFtc0hhc2gsIHZlYyhmb3JtKSkpIDpcbiAgXCJlbHNlXCIgP1xuICAgIHt9IDpcbiAgICB2b2lkKDApO1xufTtcbmV4cG9ydHMubGFtYmRhUGFyYW1zSGFzaCA9IGxhbWJkYVBhcmFtc0hhc2g7XG5cbnZhciBsYW1iZGFQYXJhbXMgPSBmdW5jdGlvbiBsYW1iZGFQYXJhbXMoYm9keSkge1xuICB2YXIgbmFtZXMgPSBzb3J0KHZhbHMobGFtYmRhUGFyYW1zSGFzaChib2R5KSkpO1xuICB2YXIgdmFyaWFkaWMgPSBpc0VxdWFsKGZpcnN0KG5hbWVzKSwgc3ltYm9sKFwiJSZcIikpO1xuICB2YXIgbiA9IHZhcmlhZGljICYmIChjb3VudChuYW1lcykgPT09IDEpID9cbiAgICAwIDpcbiAgICBwYXJzZUludChyZXN0KG5hbWUobGFzdChuYW1lcykpKSk7XG4gIHZhciBwYXJhbXMgPSAoZnVuY3Rpb24gbG9vcChuYW1lcywgaSkge1xuICAgIHZhciByZWN1ciA9IGxvb3A7XG4gICAgd2hpbGUgKHJlY3VyID09PSBsb29wKSB7XG4gICAgICByZWN1ciA9IGkgPD0gbiA/XG4gICAgICAobmFtZXMgPSBjb25qKG5hbWVzLCBzeW1ib2woXCJcIiArIFwiJVwiICsgaSkpLCBpID0gaW5jKGkpLCBsb29wKSA6XG4gICAgICBuYW1lcztcbiAgICB9O1xuICAgIHJldHVybiByZWN1cjtcbiAgfSkoW10sIDEpO1xuICByZXR1cm4gdmFyaWFkaWMgP1xuICAgIGNvbmoocGFyYW1zLCBzeW1ib2wodm9pZCgwKSwgXCImXCIpLCBzeW1ib2wodm9pZCgwKSwgXCIlJlwiKSkgOlxuICAgIG5hbWVzO1xufTtcbmV4cG9ydHMubGFtYmRhUGFyYW1zID0gbGFtYmRhUGFyYW1zO1xuXG52YXIgcmVhZExhbWJkYSA9IGZ1bmN0aW9uIHJlYWRMYW1iZGEocmVhZGVyKSB7XG4gIHZhciBib2R5ID0gcmVhZExpc3QocmVhZGVyKTtcbiAgcmV0dXJuIGxpc3Qoc3ltYm9sKHZvaWQoMCksIFwiZm5cIiksIGxhbWJkYVBhcmFtcyhib2R5KSwgYm9keSk7XG59O1xuZXhwb3J0cy5yZWFkTGFtYmRhID0gcmVhZExhbWJkYTtcblxudmFyIHJlYWREaXNjYXJkID0gZnVuY3Rpb24gcmVhZERpc2NhcmQocmVhZGVyLCBfKSB7XG4gIHJlYWQocmVhZGVyLCB0cnVlLCB2b2lkKDApLCB0cnVlKTtcbiAgcmV0dXJuIHJlYWRlcjtcbn07XG5leHBvcnRzLnJlYWREaXNjYXJkID0gcmVhZERpc2NhcmQ7XG5cbnZhciBtYWNyb3MgPSBmdW5jdGlvbiBtYWNyb3MoYykge1xuICByZXR1cm4gYyA9PT0gXCJcXFwiXCIgP1xuICAgIHJlYWRTdHJpbmcgOlxuICBjID09PSBcIjpcIiA/XG4gICAgcmVhZEtleXdvcmQgOlxuICBjID09PSBcIjtcIiA/XG4gICAgcmVhZENvbW1lbnQgOlxuICBjID09PSBcIidcIiA/XG4gICAgd3JhcHBpbmdSZWFkZXIoc3ltYm9sKHZvaWQoMCksIFwicXVvdGVcIikpIDpcbiAgYyA9PT0gXCJAXCIgP1xuICAgIHdyYXBwaW5nUmVhZGVyKHN5bWJvbCh2b2lkKDApLCBcImRlcmVmXCIpKSA6XG4gIGMgPT09IFwiXlwiID9cbiAgICByZWFkTWV0YSA6XG4gIGMgPT09IFwiYFwiID9cbiAgICB3cmFwcGluZ1JlYWRlcihzeW1ib2wodm9pZCgwKSwgXCJzeW50YXgtcXVvdGVcIikpIDpcbiAgYyA9PT0gXCJ+XCIgP1xuICAgIHJlYWRVbnF1b3RlIDpcbiAgYyA9PT0gXCIoXCIgP1xuICAgIHJlYWRMaXN0IDpcbiAgYyA9PT0gXCIpXCIgP1xuICAgIHJlYWRVbm1hdGNoZWREZWxpbWl0ZXIgOlxuICBjID09PSBcIltcIiA/XG4gICAgcmVhZFZlY3RvciA6XG4gIGMgPT09IFwiXVwiID9cbiAgICByZWFkVW5tYXRjaGVkRGVsaW1pdGVyIDpcbiAgYyA9PT0gXCJ7XCIgP1xuICAgIHJlYWRNYXAgOlxuICBjID09PSBcIn1cIiA/XG4gICAgcmVhZFVubWF0Y2hlZERlbGltaXRlciA6XG4gIGMgPT09IFwiXFxcXFwiID9cbiAgICByZWFkQ2hhciA6XG4gIGMgPT09IFwiJVwiID9cbiAgICByZWFkUGFyYW0gOlxuICBjID09PSBcIiNcIiA/XG4gICAgcmVhZERpc3BhdGNoIDpcbiAgXCJlbHNlXCIgP1xuICAgIHZvaWQoMCkgOlxuICAgIHZvaWQoMCk7XG59O1xuZXhwb3J0cy5tYWNyb3MgPSBtYWNyb3M7XG5cbnZhciBkaXNwYXRjaE1hY3JvcyA9IGZ1bmN0aW9uIGRpc3BhdGNoTWFjcm9zKHMpIHtcbiAgcmV0dXJuIHMgPT09IFwie1wiID9cbiAgICByZWFkU2V0IDpcbiAgcyA9PT0gXCIoXCIgP1xuICAgIHJlYWRMYW1iZGEgOlxuICBzID09PSBcIjxcIiA/XG4gICAgdGhyb3dpbmdSZWFkZXIoXCJVbnJlYWRhYmxlIGZvcm1cIikgOlxuICBzID09PSBcIlxcXCJcIiA/XG4gICAgcmVhZFJlZ2V4IDpcbiAgcyA9PT0gXCIhXCIgP1xuICAgIHJlYWRDb21tZW50IDpcbiAgcyA9PT0gXCJfXCIgP1xuICAgIHJlYWREaXNjYXJkIDpcbiAgXCJlbHNlXCIgP1xuICAgIHZvaWQoMCkgOlxuICAgIHZvaWQoMCk7XG59O1xuZXhwb3J0cy5kaXNwYXRjaE1hY3JvcyA9IGRpc3BhdGNoTWFjcm9zO1xuXG52YXIgcmVhZEZvcm0gPSBmdW5jdGlvbiByZWFkRm9ybShyZWFkZXIsIGNoKSB7XG4gIHZhciBzdGFydCA9IHtcbiAgICBcImxpbmVcIjogKHJlYWRlciB8fCAwKVtcImxpbmVcIl0sXG4gICAgXCJjb2x1bW5cIjogKHJlYWRlciB8fCAwKVtcImNvbHVtblwiXVxuICB9O1xuICB2YXIgcmVhZE1hY3JvID0gbWFjcm9zKGNoKTtcbiAgdmFyIGZvcm0gPSByZWFkTWFjcm8gP1xuICAgIHJlYWRNYWNybyhyZWFkZXIsIGNoKSA6XG4gIGlzTnVtYmVyTGl0ZXJhbChyZWFkZXIsIGNoKSA/XG4gICAgcmVhZE51bWJlcihyZWFkZXIsIGNoKSA6XG4gIFwiZWxzZVwiID9cbiAgICByZWFkU3ltYm9sKHJlYWRlciwgY2gpIDpcbiAgICB2b2lkKDApO1xuICByZXR1cm4gZm9ybSA9PT0gcmVhZGVyID9cbiAgICBmb3JtIDpcbiAgISgoaXNTdHJpbmcoZm9ybSkpIHx8IChpc051bWJlcihmb3JtKSkgfHwgKGlzQm9vbGVhbihmb3JtKSkgfHwgKGlzTmlsKGZvcm0pKSB8fCAoaXNLZXl3b3JkKGZvcm0pKSkgP1xuICAgIHdpdGhNZXRhKGZvcm0sIGNvbmooe1xuICAgICAgXCJzdGFydFwiOiBzdGFydCxcbiAgICAgIFwiZW5kXCI6IHtcbiAgICAgICAgXCJsaW5lXCI6IChyZWFkZXIgfHwgMClbXCJsaW5lXCJdLFxuICAgICAgICBcImNvbHVtblwiOiAocmVhZGVyIHx8IDApW1wiY29sdW1uXCJdXG4gICAgICB9XG4gICAgfSwgbWV0YShmb3JtKSkpIDpcbiAgXCJlbHNlXCIgP1xuICAgIGZvcm0gOlxuICAgIHZvaWQoMCk7XG59O1xuZXhwb3J0cy5yZWFkRm9ybSA9IHJlYWRGb3JtO1xuXG52YXIgcmVhZCA9IGZ1bmN0aW9uIHJlYWQocmVhZGVyLCBlb2ZJc0Vycm9yLCBzZW50aW5lbCwgaXNSZWN1cnNpdmUpIHtcbiAgcmV0dXJuIChmdW5jdGlvbiBsb29wKCkge1xuICAgIHZhciByZWN1ciA9IGxvb3A7XG4gICAgd2hpbGUgKHJlY3VyID09PSBsb29wKSB7XG4gICAgICByZWN1ciA9IChmdW5jdGlvbigpIHtcbiAgICAgIHZhciBjaCA9IHJlYWRDaGFyKHJlYWRlcik7XG4gICAgICB2YXIgZm9ybSA9IGlzTmlsKGNoKSA/XG4gICAgICAgIGVvZklzRXJyb3IgP1xuICAgICAgICAgIHJlYWRlckVycm9yKHJlYWRlciwgXCJFT0ZcIikgOlxuICAgICAgICAgIHNlbnRpbmVsIDpcbiAgICAgIGlzV2hpdGVzcGFjZShjaCkgP1xuICAgICAgICByZWFkZXIgOlxuICAgICAgaXNDb21tZW50UHJlZml4KGNoKSA/XG4gICAgICAgIHJlYWQocmVhZENvbW1lbnQocmVhZGVyLCBjaCksIGVvZklzRXJyb3IsIHNlbnRpbmVsLCBpc1JlY3Vyc2l2ZSkgOlxuICAgICAgXCJlbHNlXCIgP1xuICAgICAgICByZWFkRm9ybShyZWFkZXIsIGNoKSA6XG4gICAgICAgIHZvaWQoMCk7XG4gICAgICByZXR1cm4gZm9ybSA9PT0gcmVhZGVyID9cbiAgICAgICAgKGxvb3ApIDpcbiAgICAgICAgZm9ybTtcbiAgICB9KSgpO1xuICAgIH07XG4gICAgcmV0dXJuIHJlY3VyO1xuICB9KSgpO1xufTtcbmV4cG9ydHMucmVhZCA9IHJlYWQ7XG5cbnZhciByZWFkXyA9IGZ1bmN0aW9uIHJlYWRfKHNvdXJjZSwgdXJpKSB7XG4gIHZhciByZWFkZXIgPSBwdXNoQmFja1JlYWRlcihzb3VyY2UsIHVyaSk7XG4gIHZhciBlb2YgPSBnZW5zeW0oKTtcbiAgcmV0dXJuIChmdW5jdGlvbiBsb29wKGZvcm1zLCBmb3JtKSB7XG4gICAgdmFyIHJlY3VyID0gbG9vcDtcbiAgICB3aGlsZSAocmVjdXIgPT09IGxvb3ApIHtcbiAgICAgIHJlY3VyID0gZm9ybSA9PT0gZW9mID9cbiAgICAgIGZvcm1zIDpcbiAgICAgIChmb3JtcyA9IGNvbmooZm9ybXMsIGZvcm0pLCBmb3JtID0gcmVhZChyZWFkZXIsIGZhbHNlLCBlb2YsIGZhbHNlKSwgbG9vcCk7XG4gICAgfTtcbiAgICByZXR1cm4gcmVjdXI7XG4gIH0pKFtdLCByZWFkKHJlYWRlciwgZmFsc2UsIGVvZiwgZmFsc2UpKTtcbn07XG5leHBvcnRzLnJlYWRfID0gcmVhZF87XG5cbnZhciByZWFkRnJvbVN0cmluZyA9IGZ1bmN0aW9uIHJlYWRGcm9tU3RyaW5nKHNvdXJjZSwgdXJpKSB7XG4gIHZhciByZWFkZXIgPSBwdXNoQmFja1JlYWRlcihzb3VyY2UsIHVyaSk7XG4gIHJldHVybiByZWFkKHJlYWRlciwgdHJ1ZSwgdm9pZCgwKSwgZmFsc2UpO1xufTtcbmV4cG9ydHMucmVhZEZyb21TdHJpbmcgPSByZWFkRnJvbVN0cmluZztcblxudmFyIHJlYWRVdWlkID0gZnVuY3Rpb24gcmVhZFV1aWQodXVpZCkge1xuICByZXR1cm4gaXNTdHJpbmcodXVpZCkgP1xuICAgIGxpc3Qoc3ltYm9sKHZvaWQoMCksIFwiVVVJRC5cIiksIHV1aWQpIDpcbiAgICByZWFkZXJFcnJvcih2b2lkKDApLCBcIlVVSUQgbGl0ZXJhbCBleHBlY3RzIGEgc3RyaW5nIGFzIGl0cyByZXByZXNlbnRhdGlvbi5cIik7XG59O1xuXG52YXIgcmVhZFF1ZXVlID0gZnVuY3Rpb24gcmVhZFF1ZXVlKGl0ZW1zKSB7XG4gIHJldHVybiBpc1ZlY3RvcihpdGVtcykgP1xuICAgIGxpc3Qoc3ltYm9sKHZvaWQoMCksIFwiUGVyc2lzdGVudFF1ZXVlLlwiKSwgaXRlbXMpIDpcbiAgICByZWFkZXJFcnJvcih2b2lkKDApLCBcIlF1ZXVlIGxpdGVyYWwgZXhwZWN0cyBhIHZlY3RvciBmb3IgaXRzIGVsZW1lbnRzLlwiKTtcbn07XG5cbnZhciBfX3RhZ1RhYmxlX18gPSBkaWN0aW9uYXJ5KFwidXVpZFwiLCByZWFkVXVpZCwgXCJxdWV1ZVwiLCByZWFkUXVldWUpO1xuZXhwb3J0cy5fX3RhZ1RhYmxlX18gPSBfX3RhZ1RhYmxlX187XG5cbnZhciBtYXliZVJlYWRUYWdnZWRUeXBlID0gZnVuY3Rpb24gbWF5YmVSZWFkVGFnZ2VkVHlwZShyZWFkZXIsIGluaXRjaCkge1xuICB2YXIgdGFnID0gcmVhZFN5bWJvbChyZWFkZXIsIGluaXRjaCk7XG4gIHZhciBwZm4gPSAoX190YWdUYWJsZV9fIHx8IDApW25hbWUodGFnKV07XG4gIHJldHVybiBwZm4gP1xuICAgIHBmbihyZWFkKHJlYWRlciwgdHJ1ZSwgdm9pZCgwKSwgZmFsc2UpKSA6XG4gICAgcmVhZGVyRXJyb3IocmVhZGVyLCBcIlwiICsgXCJDb3VsZCBub3QgZmluZCB0YWcgcGFyc2VyIGZvciBcIiArIChuYW1lKHRhZykpICsgXCIgaW4gXCIgKyAoXCJcIiArIChrZXlzKF9fdGFnVGFibGVfXykpKSk7XG59O1xuZXhwb3J0cy5tYXliZVJlYWRUYWdnZWRUeXBlID0gbWF5YmVSZWFkVGFnZ2VkVHlwZSIsInZhciBfbnNfID0ge1xuICBcImlkXCI6IFwid2lzcC5jb21waWxlclwiLFxuICBcImRvY1wiOiBcIndpc3AgbGFuZ3VhZ2UgY29tcGlsZXJcIlxufTtcbnZhciB3aXNwX3JlYWRlciA9IHJlcXVpcmUoXCIuL3JlYWRlclwiKTtcbnZhciByZWFkRnJvbVN0cmluZyA9IHdpc3BfcmVhZGVyLnJlYWRGcm9tU3RyaW5nOztcbnZhciB3aXNwX2FzdCA9IHJlcXVpcmUoXCIuL2FzdFwiKTtcbnZhciBtZXRhID0gd2lzcF9hc3QubWV0YTtcbnZhciB3aXRoTWV0YSA9IHdpc3BfYXN0LndpdGhNZXRhO1xudmFyIGlzU3ltYm9sID0gd2lzcF9hc3QuaXNTeW1ib2w7XG52YXIgc3ltYm9sID0gd2lzcF9hc3Quc3ltYm9sO1xudmFyIGlzS2V5d29yZCA9IHdpc3BfYXN0LmlzS2V5d29yZDtcbnZhciBrZXl3b3JkID0gd2lzcF9hc3Qua2V5d29yZDtcbnZhciBuYW1lc3BhY2UgPSB3aXNwX2FzdC5uYW1lc3BhY2U7XG52YXIgaXNVbnF1b3RlID0gd2lzcF9hc3QuaXNVbnF1b3RlO1xudmFyIGlzVW5xdW90ZVNwbGljaW5nID0gd2lzcF9hc3QuaXNVbnF1b3RlU3BsaWNpbmc7XG52YXIgaXNRdW90ZSA9IHdpc3BfYXN0LmlzUXVvdGU7XG52YXIgaXNTeW50YXhRdW90ZSA9IHdpc3BfYXN0LmlzU3ludGF4UXVvdGU7XG52YXIgbmFtZSA9IHdpc3BfYXN0Lm5hbWU7XG52YXIgZ2Vuc3ltID0gd2lzcF9hc3QuZ2Vuc3ltO1xudmFyIHByU3RyID0gd2lzcF9hc3QucHJTdHI7O1xudmFyIHdpc3Bfc2VxdWVuY2UgPSByZXF1aXJlKFwiLi9zZXF1ZW5jZVwiKTtcbnZhciBpc0VtcHR5ID0gd2lzcF9zZXF1ZW5jZS5pc0VtcHR5O1xudmFyIGNvdW50ID0gd2lzcF9zZXF1ZW5jZS5jb3VudDtcbnZhciBpc0xpc3QgPSB3aXNwX3NlcXVlbmNlLmlzTGlzdDtcbnZhciBsaXN0ID0gd2lzcF9zZXF1ZW5jZS5saXN0O1xudmFyIGZpcnN0ID0gd2lzcF9zZXF1ZW5jZS5maXJzdDtcbnZhciBzZWNvbmQgPSB3aXNwX3NlcXVlbmNlLnNlY29uZDtcbnZhciB0aGlyZCA9IHdpc3Bfc2VxdWVuY2UudGhpcmQ7XG52YXIgcmVzdCA9IHdpc3Bfc2VxdWVuY2UucmVzdDtcbnZhciBjb25zID0gd2lzcF9zZXF1ZW5jZS5jb25zO1xudmFyIGNvbmogPSB3aXNwX3NlcXVlbmNlLmNvbmo7XG52YXIgcmV2ZXJzZSA9IHdpc3Bfc2VxdWVuY2UucmV2ZXJzZTtcbnZhciByZWR1Y2UgPSB3aXNwX3NlcXVlbmNlLnJlZHVjZTtcbnZhciB2ZWMgPSB3aXNwX3NlcXVlbmNlLnZlYztcbnZhciBsYXN0ID0gd2lzcF9zZXF1ZW5jZS5sYXN0O1xudmFyIHJlcGVhdCA9IHdpc3Bfc2VxdWVuY2UucmVwZWF0O1xudmFyIG1hcCA9IHdpc3Bfc2VxdWVuY2UubWFwO1xudmFyIGZpbHRlciA9IHdpc3Bfc2VxdWVuY2UuZmlsdGVyO1xudmFyIHRha2UgPSB3aXNwX3NlcXVlbmNlLnRha2U7XG52YXIgY29uY2F0ID0gd2lzcF9zZXF1ZW5jZS5jb25jYXQ7XG52YXIgaXNTZXEgPSB3aXNwX3NlcXVlbmNlLmlzU2VxOztcbnZhciB3aXNwX3J1bnRpbWUgPSByZXF1aXJlKFwiLi9ydW50aW1lXCIpO1xudmFyIGlzT2RkID0gd2lzcF9ydW50aW1lLmlzT2RkO1xudmFyIGlzRGljdGlvbmFyeSA9IHdpc3BfcnVudGltZS5pc0RpY3Rpb25hcnk7XG52YXIgZGljdGlvbmFyeSA9IHdpc3BfcnVudGltZS5kaWN0aW9uYXJ5O1xudmFyIG1lcmdlID0gd2lzcF9ydW50aW1lLm1lcmdlO1xudmFyIGtleXMgPSB3aXNwX3J1bnRpbWUua2V5cztcbnZhciB2YWxzID0gd2lzcF9ydW50aW1lLnZhbHM7XG52YXIgaXNDb250YWluc1ZlY3RvciA9IHdpc3BfcnVudGltZS5pc0NvbnRhaW5zVmVjdG9yO1xudmFyIG1hcERpY3Rpb25hcnkgPSB3aXNwX3J1bnRpbWUubWFwRGljdGlvbmFyeTtcbnZhciBpc1N0cmluZyA9IHdpc3BfcnVudGltZS5pc1N0cmluZztcbnZhciBpc051bWJlciA9IHdpc3BfcnVudGltZS5pc051bWJlcjtcbnZhciBpc1ZlY3RvciA9IHdpc3BfcnVudGltZS5pc1ZlY3RvcjtcbnZhciBpc0Jvb2xlYW4gPSB3aXNwX3J1bnRpbWUuaXNCb29sZWFuO1xudmFyIHN1YnMgPSB3aXNwX3J1bnRpbWUuc3VicztcbnZhciByZUZpbmQgPSB3aXNwX3J1bnRpbWUucmVGaW5kO1xudmFyIGlzVHJ1ZSA9IHdpc3BfcnVudGltZS5pc1RydWU7XG52YXIgaXNGYWxzZSA9IHdpc3BfcnVudGltZS5pc0ZhbHNlO1xudmFyIGlzTmlsID0gd2lzcF9ydW50aW1lLmlzTmlsO1xudmFyIGlzUmVQYXR0ZXJuID0gd2lzcF9ydW50aW1lLmlzUmVQYXR0ZXJuO1xudmFyIGluYyA9IHdpc3BfcnVudGltZS5pbmM7XG52YXIgZGVjID0gd2lzcF9ydW50aW1lLmRlYztcbnZhciBzdHIgPSB3aXNwX3J1bnRpbWUuc3RyO1xudmFyIGNoYXIgPSB3aXNwX3J1bnRpbWUuY2hhcjtcbnZhciBpbnQgPSB3aXNwX3J1bnRpbWUuaW50O1xudmFyIGlzRXF1YWwgPSB3aXNwX3J1bnRpbWUuaXNFcXVhbDtcbnZhciBpc1N0cmljdEVxdWFsID0gd2lzcF9ydW50aW1lLmlzU3RyaWN0RXF1YWw7O1xudmFyIHdpc3Bfc3RyaW5nID0gcmVxdWlyZShcIi4vc3RyaW5nXCIpO1xudmFyIHNwbGl0ID0gd2lzcF9zdHJpbmcuc3BsaXQ7XG52YXIgam9pbiA9IHdpc3Bfc3RyaW5nLmpvaW47XG52YXIgdXBwZXJDYXNlID0gd2lzcF9zdHJpbmcudXBwZXJDYXNlO1xudmFyIHJlcGxhY2UgPSB3aXNwX3N0cmluZy5yZXBsYWNlOztcbnZhciB3aXNwX2JhY2tlbmRfamF2YXNjcmlwdF93cml0ZXIgPSByZXF1aXJlKFwiLi9iYWNrZW5kL2phdmFzY3JpcHQvd3JpdGVyXCIpO1xudmFyIHdyaXRlUmVmZXJlbmNlID0gd2lzcF9iYWNrZW5kX2phdmFzY3JpcHRfd3JpdGVyLndyaXRlUmVmZXJlbmNlO1xudmFyIHdyaXRlS2V5d29yZFJlZmVyZW5jZSA9IHdpc3BfYmFja2VuZF9qYXZhc2NyaXB0X3dyaXRlci53cml0ZUtleXdvcmRSZWZlcmVuY2U7XG52YXIgd3JpdGVLZXl3b3JkID0gd2lzcF9iYWNrZW5kX2phdmFzY3JpcHRfd3JpdGVyLndyaXRlS2V5d29yZDtcbnZhciB3cml0ZVN5bWJvbCA9IHdpc3BfYmFja2VuZF9qYXZhc2NyaXB0X3dyaXRlci53cml0ZVN5bWJvbDtcbnZhciB3cml0ZU5pbCA9IHdpc3BfYmFja2VuZF9qYXZhc2NyaXB0X3dyaXRlci53cml0ZU5pbDtcbnZhciB3cml0ZUNvbW1lbnQgPSB3aXNwX2JhY2tlbmRfamF2YXNjcmlwdF93cml0ZXIud3JpdGVDb21tZW50O1xudmFyIHdyaXRlTnVtYmVyID0gd2lzcF9iYWNrZW5kX2phdmFzY3JpcHRfd3JpdGVyLndyaXRlTnVtYmVyO1xudmFyIHdyaXRlU3RyaW5nID0gd2lzcF9iYWNrZW5kX2phdmFzY3JpcHRfd3JpdGVyLndyaXRlU3RyaW5nO1xudmFyIHdyaXRlQm9vbGVhbiA9IHdpc3BfYmFja2VuZF9qYXZhc2NyaXB0X3dyaXRlci53cml0ZUJvb2xlYW47OztcblxudmFyIGlzU2VsZkV2YWx1YXRpbmcgPSBmdW5jdGlvbiBpc1NlbGZFdmFsdWF0aW5nKGZvcm0pIHtcbiAgcmV0dXJuIChpc051bWJlcihmb3JtKSkgfHwgKChpc1N0cmluZyhmb3JtKSkgJiYgKCEoaXNTeW1ib2woZm9ybSkpKSAmJiAoIShpc0tleXdvcmQoZm9ybSkpKSkgfHwgKGlzQm9vbGVhbihmb3JtKSkgfHwgKGlzTmlsKGZvcm0pKSB8fCAoaXNSZVBhdHRlcm4oZm9ybSkpO1xufTtcbmV4cG9ydHMuaXNTZWxmRXZhbHVhdGluZyA9IGlzU2VsZkV2YWx1YXRpbmc7XG5cbnZhciBfX21hY3Jvc19fID0ge307XG5leHBvcnRzLl9fbWFjcm9zX18gPSBfX21hY3Jvc19fO1xuXG52YXIgZXhlY3V0ZU1hY3JvID0gZnVuY3Rpb24gZXhlY3V0ZU1hY3JvKG5hbWUsIGZvcm0pIHtcbiAgcmV0dXJuIChfX21hY3Jvc19fIHx8IDApW25hbWVdLmFwcGx5KChfX21hY3Jvc19fIHx8IDApW25hbWVdLCB2ZWMoZm9ybSkpO1xufTtcbmV4cG9ydHMuZXhlY3V0ZU1hY3JvID0gZXhlY3V0ZU1hY3JvO1xuXG52YXIgaW5zdGFsbE1hY3JvID0gZnVuY3Rpb24gaW5zdGFsbE1hY3JvKG5hbWUsIG1hY3JvRm4pIHtcbiAgcmV0dXJuIChfX21hY3Jvc19fIHx8IDApW25hbWVdID0gbWFjcm9Gbjtcbn07XG5leHBvcnRzLmluc3RhbGxNYWNybyA9IGluc3RhbGxNYWNybztcblxudmFyIGlzTWFjcm8gPSBmdW5jdGlvbiBpc01hY3JvKG5hbWUpIHtcbiAgcmV0dXJuIChpc1N5bWJvbChuYW1lKSkgJiYgKChfX21hY3Jvc19fIHx8IDApW25hbWVdKSAmJiB0cnVlO1xufTtcbmV4cG9ydHMuaXNNYWNybyA9IGlzTWFjcm87XG5cbnZhciBtYWtlTWFjcm8gPSBmdW5jdGlvbiBtYWtlTWFjcm8ocGF0dGVybiwgYm9keSkge1xuICB2YXIgbWFjcm9GbiA9IGNvbmNhdChsaXN0KHN5bWJvbCh2b2lkKDApLCBcImZuXCIpLCBwYXR0ZXJuKSwgYm9keSk7XG4gIHJldHVybiBldmFsKFwiXCIgKyBcIihcIiArIChjb21waWxlKG1hY3JvZXhwYW5kKG1hY3JvRm4pKSkgKyBcIilcIik7XG59O1xuZXhwb3J0cy5tYWtlTWFjcm8gPSBtYWtlTWFjcm87XG5cbmluc3RhbGxNYWNybyhzeW1ib2wodm9pZCgwKSwgXCJkZWZtYWNyb1wiKSwgZnVuY3Rpb24obmFtZSwgc2lnbmF0dXJlKSB7XG4gIHZhciBib2R5ID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAyKTtcbiAgcmV0dXJuIGluc3RhbGxNYWNybyhuYW1lLCBtYWtlTWFjcm8oc2lnbmF0dXJlLCBib2R5KSk7XG59KTtcblxudmFyIF9fc3BlY2lhbHNfXyA9IHt9O1xuZXhwb3J0cy5fX3NwZWNpYWxzX18gPSBfX3NwZWNpYWxzX187XG5cbnZhciBpbnN0YWxsU3BlY2lhbCA9IGZ1bmN0aW9uIGluc3RhbGxTcGVjaWFsKG5hbWUsIGYsIHZhbGlkYXRvcikge1xuICByZXR1cm4gKF9fc3BlY2lhbHNfXyB8fCAwKVtuYW1lXSA9IGZ1bmN0aW9uKGZvcm0pIHtcbiAgICB2YWxpZGF0b3IgP1xuICAgICAgdmFsaWRhdG9yKGZvcm0pIDpcbiAgICAgIHZvaWQoMCk7XG4gICAgcmV0dXJuIGYod2l0aE1ldGEocmVzdChmb3JtKSwgbWV0YShmb3JtKSkpO1xuICB9O1xufTtcbmV4cG9ydHMuaW5zdGFsbFNwZWNpYWwgPSBpbnN0YWxsU3BlY2lhbDtcblxudmFyIGlzU3BlY2lhbCA9IGZ1bmN0aW9uIGlzU3BlY2lhbChuYW1lKSB7XG4gIHJldHVybiAoaXNTeW1ib2wobmFtZSkpICYmICgoX19zcGVjaWFsc19fIHx8IDApW25hbWVdKSAmJiB0cnVlO1xufTtcbmV4cG9ydHMuaXNTcGVjaWFsID0gaXNTcGVjaWFsO1xuXG52YXIgZXhlY3V0ZVNwZWNpYWwgPSBmdW5jdGlvbiBleGVjdXRlU3BlY2lhbChuYW1lLCBmb3JtKSB7XG4gIHJldHVybiAoKF9fc3BlY2lhbHNfXyB8fCAwKVtuYW1lXSkoZm9ybSk7XG59O1xuZXhwb3J0cy5leGVjdXRlU3BlY2lhbCA9IGV4ZWN1dGVTcGVjaWFsO1xuXG52YXIgb3B0ID0gZnVuY3Rpb24gb3B0KGFyZ3VtZW50LCBmYWxsYmFjaykge1xuICByZXR1cm4gKGlzTmlsKGFyZ3VtZW50KSkgfHwgKGlzRW1wdHkoYXJndW1lbnQpKSA/XG4gICAgZmFsbGJhY2sgOlxuICAgIGZpcnN0KGFyZ3VtZW50KTtcbn07XG5leHBvcnRzLm9wdCA9IG9wdDtcblxudmFyIGFwcGx5Rm9ybSA9IGZ1bmN0aW9uIGFwcGx5Rm9ybShmbk5hbWUsIGZvcm0sIGlzUXVvdGVkKSB7XG4gIHJldHVybiBjb25zKGZuTmFtZSwgaXNRdW90ZWQgP1xuICAgIG1hcChmdW5jdGlvbihlKSB7XG4gICAgICByZXR1cm4gbGlzdChzeW1ib2wodm9pZCgwKSwgXCJxdW90ZVwiKSwgZSk7XG4gICAgfSwgZm9ybSkgOlxuICAgIGZvcm0sIGZvcm0pO1xufTtcbmV4cG9ydHMuYXBwbHlGb3JtID0gYXBwbHlGb3JtO1xuXG52YXIgYXBwbHlVbnF1b3RlZEZvcm0gPSBmdW5jdGlvbiBhcHBseVVucXVvdGVkRm9ybShmbk5hbWUsIGZvcm0pIHtcbiAgcmV0dXJuIGNvbnMoZm5OYW1lLCBtYXAoZnVuY3Rpb24oZSkge1xuICAgIHJldHVybiBpc1VucXVvdGUoZSkgP1xuICAgICAgc2Vjb25kKGUpIDpcbiAgICAoaXNMaXN0KGUpKSAmJiAoaXNLZXl3b3JkKGZpcnN0KGUpKSkgP1xuICAgICAgbGlzdChzeW1ib2wodm9pZCgwKSwgXCJzeW50YXgtcXVvdGVcIiksIHNlY29uZChlKSkgOlxuICAgICAgbGlzdChzeW1ib2wodm9pZCgwKSwgXCJzeW50YXgtcXVvdGVcIiksIGUpO1xuICB9LCBmb3JtKSk7XG59O1xuZXhwb3J0cy5hcHBseVVucXVvdGVkRm9ybSA9IGFwcGx5VW5xdW90ZWRGb3JtO1xuXG52YXIgc3BsaXRTcGxpY2VzID0gZnVuY3Rpb24gc3BsaXRTcGxpY2VzKGZvcm0sIGZuTmFtZSkge1xuICB2YXIgbWFrZVNwbGljZSA9IGZ1bmN0aW9uIG1ha2VTcGxpY2UoZm9ybSkge1xuICAgIHJldHVybiAoaXNTZWxmRXZhbHVhdGluZyhmb3JtKSkgfHwgKGlzU3ltYm9sKGZvcm0pKSA/XG4gICAgICBhcHBseVVucXVvdGVkRm9ybShmbk5hbWUsIGxpc3QoZm9ybSkpIDpcbiAgICAgIGFwcGx5VW5xdW90ZWRGb3JtKGZuTmFtZSwgZm9ybSk7XG4gIH07XG4gIHJldHVybiAoZnVuY3Rpb24gbG9vcChub2Rlcywgc2xpY2VzLCBhY2MpIHtcbiAgICB2YXIgcmVjdXIgPSBsb29wO1xuICAgIHdoaWxlIChyZWN1ciA9PT0gbG9vcCkge1xuICAgICAgcmVjdXIgPSBpc0VtcHR5KG5vZGVzKSA/XG4gICAgICByZXZlcnNlKGlzRW1wdHkoYWNjKSA/XG4gICAgICAgIHNsaWNlcyA6XG4gICAgICAgIGNvbnMobWFrZVNwbGljZShyZXZlcnNlKGFjYykpLCBzbGljZXMpKSA6XG4gICAgICAoZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBub2RlID0gZmlyc3Qobm9kZXMpO1xuICAgICAgICByZXR1cm4gaXNVbnF1b3RlU3BsaWNpbmcobm9kZSkgP1xuICAgICAgICAgIChub2RlcyA9IHJlc3Qobm9kZXMpLCBzbGljZXMgPSBjb25zKHNlY29uZChub2RlKSwgaXNFbXB0eShhY2MpID9cbiAgICAgICAgICAgIHNsaWNlcyA6XG4gICAgICAgICAgICBjb25zKG1ha2VTcGxpY2UocmV2ZXJzZShhY2MpKSwgc2xpY2VzKSksIGFjYyA9IGxpc3QoKSwgbG9vcCkgOlxuICAgICAgICAgIChub2RlcyA9IHJlc3Qobm9kZXMpLCBzbGljZXMgPSBzbGljZXMsIGFjYyA9IGNvbnMobm9kZSwgYWNjKSwgbG9vcCk7XG4gICAgICB9KSgpO1xuICAgIH07XG4gICAgcmV0dXJuIHJlY3VyO1xuICB9KShmb3JtLCBsaXN0KCksIGxpc3QoKSk7XG59O1xuZXhwb3J0cy5zcGxpdFNwbGljZXMgPSBzcGxpdFNwbGljZXM7XG5cbnZhciBzeW50YXhRdW90ZVNwbGl0ID0gZnVuY3Rpb24gc3ludGF4UXVvdGVTcGxpdChhcHBlbmROYW1lLCBmbk5hbWUsIGZvcm0pIHtcbiAgdmFyIHNsaWNlcyA9IHNwbGl0U3BsaWNlcyhmb3JtLCBmbk5hbWUpO1xuICB2YXIgbiA9IGNvdW50KHNsaWNlcyk7XG4gIHJldHVybiBuID09PSAwID9cbiAgICBsaXN0KGZuTmFtZSkgOlxuICBuID09PSAxID9cbiAgICBmaXJzdChzbGljZXMpIDpcbiAgXCJkZWZhdWx0XCIgP1xuICAgIGFwcGx5Rm9ybShhcHBlbmROYW1lLCBzbGljZXMpIDpcbiAgICB2b2lkKDApO1xufTtcbmV4cG9ydHMuc3ludGF4UXVvdGVTcGxpdCA9IHN5bnRheFF1b3RlU3BsaXQ7XG5cbnZhciBjb21waWxlT2JqZWN0ID0gZnVuY3Rpb24gY29tcGlsZU9iamVjdChmb3JtLCBpc1F1b3RlZCkge1xuICByZXR1cm4gaXNLZXl3b3JkKGZvcm0pID9cbiAgICB3cml0ZUtleXdvcmQoZm9ybSkgOlxuICBpc1N5bWJvbChmb3JtKSA/XG4gICAgd3JpdGVTeW1ib2woZm9ybSkgOlxuICBpc051bWJlcihmb3JtKSA/XG4gICAgd3JpdGVOdW1iZXIoZm9ybSkgOlxuICBpc1N0cmluZyhmb3JtKSA/XG4gICAgd3JpdGVTdHJpbmcoZm9ybSkgOlxuICBpc0Jvb2xlYW4oZm9ybSkgP1xuICAgIHdyaXRlQm9vbGVhbihmb3JtKSA6XG4gIGlzTmlsKGZvcm0pID9cbiAgICB3cml0ZU5pbChmb3JtKSA6XG4gIGlzUmVQYXR0ZXJuKGZvcm0pID9cbiAgICBjb21waWxlUmVQYXR0ZXJuKGZvcm0pIDpcbiAgaXNWZWN0b3IoZm9ybSkgP1xuICAgIGNvbXBpbGUoYXBwbHlGb3JtKHN5bWJvbCh2b2lkKDApLCBcInZlY3RvclwiKSwgbGlzdC5hcHBseShsaXN0LCBmb3JtKSwgaXNRdW90ZWQpKSA6XG4gIGlzTGlzdChmb3JtKSA/XG4gICAgY29tcGlsZShhcHBseUZvcm0oc3ltYm9sKHZvaWQoMCksIFwibGlzdFwiKSwgZm9ybSwgaXNRdW90ZWQpKSA6XG4gIGlzRGljdGlvbmFyeShmb3JtKSA/XG4gICAgY29tcGlsZURpY3Rpb25hcnkoaXNRdW90ZWQgP1xuICAgICAgbWFwRGljdGlvbmFyeShmb3JtLCBmdW5jdGlvbih4KSB7XG4gICAgICAgIHJldHVybiBsaXN0KHN5bWJvbCh2b2lkKDApLCBcInF1b3RlXCIpLCB4KTtcbiAgICAgIH0pIDpcbiAgICAgIGZvcm0pIDpcbiAgICB2b2lkKDApO1xufTtcbmV4cG9ydHMuY29tcGlsZU9iamVjdCA9IGNvbXBpbGVPYmplY3Q7XG5cbnZhciBjb21waWxlU3ludGF4UXVvdGVkVmVjdG9yID0gZnVuY3Rpb24gY29tcGlsZVN5bnRheFF1b3RlZFZlY3Rvcihmb3JtKSB7XG4gIHZhciBjb25jYXRGb3JtID0gc3ludGF4UXVvdGVTcGxpdChzeW1ib2wodm9pZCgwKSwgXCJjb25jYXRcIiksIHN5bWJvbCh2b2lkKDApLCBcInZlY3RvclwiKSwgbGlzdC5hcHBseShsaXN0LCBmb3JtKSk7XG4gIHJldHVybiBjb21waWxlKGNvdW50KGNvbmNhdEZvcm0pID4gMSA/XG4gICAgbGlzdChzeW1ib2wodm9pZCgwKSwgXCJ2ZWNcIiksIGNvbmNhdEZvcm0pIDpcbiAgICBjb25jYXRGb3JtKTtcbn07XG5leHBvcnRzLmNvbXBpbGVTeW50YXhRdW90ZWRWZWN0b3IgPSBjb21waWxlU3ludGF4UXVvdGVkVmVjdG9yO1xuXG52YXIgY29tcGlsZVN5bnRheFF1b3RlZCA9IGZ1bmN0aW9uIGNvbXBpbGVTeW50YXhRdW90ZWQoZm9ybSkge1xuICByZXR1cm4gaXNMaXN0KGZvcm0pID9cbiAgICBjb21waWxlKHN5bnRheFF1b3RlU3BsaXQoc3ltYm9sKHZvaWQoMCksIFwiY29uY2F0XCIpLCBzeW1ib2wodm9pZCgwKSwgXCJsaXN0XCIpLCBmb3JtKSkgOlxuICBpc1ZlY3Rvcihmb3JtKSA/XG4gICAgY29tcGlsZVN5bnRheFF1b3RlZFZlY3Rvcihmb3JtKSA6XG4gIFwiZWxzZVwiID9cbiAgICBjb21waWxlT2JqZWN0KGZvcm0pIDpcbiAgICB2b2lkKDApO1xufTtcbmV4cG9ydHMuY29tcGlsZVN5bnRheFF1b3RlZCA9IGNvbXBpbGVTeW50YXhRdW90ZWQ7XG5cbnZhciBjb21waWxlID0gZnVuY3Rpb24gY29tcGlsZShmb3JtKSB7XG4gIHJldHVybiBpc1NlbGZFdmFsdWF0aW5nKGZvcm0pID9cbiAgICBjb21waWxlT2JqZWN0KGZvcm0pIDpcbiAgaXNTeW1ib2woZm9ybSkgP1xuICAgIHdyaXRlUmVmZXJlbmNlKGZvcm0pIDpcbiAgaXNLZXl3b3JkKGZvcm0pID9cbiAgICB3cml0ZUtleXdvcmRSZWZlcmVuY2UoZm9ybSkgOlxuICBpc1ZlY3Rvcihmb3JtKSA/XG4gICAgY29tcGlsZU9iamVjdChmb3JtKSA6XG4gIGlzRGljdGlvbmFyeShmb3JtKSA/XG4gICAgY29tcGlsZU9iamVjdChmb3JtKSA6XG4gIGlzTGlzdChmb3JtKSA/XG4gICAgKGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGhlYWQgPSBmaXJzdChmb3JtKTtcbiAgICAgIHJldHVybiBpc0VtcHR5KGZvcm0pID9cbiAgICAgICAgY29tcGlsZU9iamVjdChmb3JtLCB0cnVlKSA6XG4gICAgICBpc1F1b3RlKGZvcm0pID9cbiAgICAgICAgY29tcGlsZU9iamVjdChzZWNvbmQoZm9ybSksIHRydWUpIDpcbiAgICAgIGlzU3ludGF4UXVvdGUoZm9ybSkgP1xuICAgICAgICBjb21waWxlU3ludGF4UXVvdGVkKHNlY29uZChmb3JtKSkgOlxuICAgICAgaXNTcGVjaWFsKGhlYWQpID9cbiAgICAgICAgZXhlY3V0ZVNwZWNpYWwoaGVhZCwgZm9ybSkgOlxuICAgICAgaXNLZXl3b3JkKGhlYWQpID9cbiAgICAgICAgY29tcGlsZShsaXN0KHN5bWJvbCh2b2lkKDApLCBcImdldFwiKSwgc2Vjb25kKGZvcm0pLCBoZWFkKSkgOlxuICAgICAgXCJlbHNlXCIgP1xuICAgICAgICAoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuICEoKGlzU3ltYm9sKGhlYWQpKSB8fCAoaXNMaXN0KGhlYWQpKSkgP1xuICAgICAgICAgICAgKGZ1bmN0aW9uKCkgeyB0aHJvdyBjb21waWxlckVycm9yKGZvcm0sIFwiXCIgKyBcIm9wZXJhdG9yIGlzIG5vdCBhIHByb2NlZHVyZTogXCIgKyBoZWFkKTsgfSkoKSA6XG4gICAgICAgICAgICBjb21waWxlSW52b2tlKGZvcm0pO1xuICAgICAgICB9KSgpIDpcbiAgICAgICAgdm9pZCgwKTtcbiAgICB9KSgpIDpcbiAgICB2b2lkKDApO1xufTtcbmV4cG9ydHMuY29tcGlsZSA9IGNvbXBpbGU7XG5cbnZhciBjb21waWxlXyA9IGZ1bmN0aW9uIGNvbXBpbGVfKGZvcm1zKSB7XG4gIHJldHVybiByZWR1Y2UoZnVuY3Rpb24ocmVzdWx0LCBmb3JtKSB7XG4gICAgcmV0dXJuIFwiXCIgKyByZXN1bHQgKyAoaXNFbXB0eShyZXN1bHQpID9cbiAgICAgIFwiXCIgOlxuICAgICAgXCI7XFxuXFxuXCIpICsgKGNvbXBpbGUoaXNMaXN0KGZvcm0pID9cbiAgICAgIHdpdGhNZXRhKG1hY3JvZXhwYW5kKGZvcm0pLCBjb25qKHtcbiAgICAgICAgXCJ0b3BcIjogdHJ1ZVxuICAgICAgfSwgbWV0YShmb3JtKSkpIDpcbiAgICAgIGZvcm0pKTtcbiAgfSwgXCJcIiwgZm9ybXMpO1xufTtcbmV4cG9ydHMuY29tcGlsZV8gPSBjb21waWxlXztcblxudmFyIGNvbXBpbGVQcm9ncmFtID0gZnVuY3Rpb24gY29tcGlsZVByb2dyYW0oZm9ybXMpIHtcbiAgcmV0dXJuIHJlZHVjZShmdW5jdGlvbihyZXN1bHQsIGZvcm0pIHtcbiAgICByZXR1cm4gXCJcIiArIHJlc3VsdCArIChpc0VtcHR5KHJlc3VsdCkgP1xuICAgICAgXCJcIiA6XG4gICAgICBcIjtcXG5cXG5cIikgKyAoY29tcGlsZShpc0xpc3QoZm9ybSkgP1xuICAgICAgd2l0aE1ldGEobWFjcm9leHBhbmQoZm9ybSksIGNvbmooe1xuICAgICAgICBcInRvcFwiOiB0cnVlXG4gICAgICB9LCBtZXRhKGZvcm0pKSkgOlxuICAgICAgZm9ybSkpO1xuICB9LCBcIlwiLCBmb3Jtcyk7XG59O1xuZXhwb3J0cy5jb21waWxlUHJvZ3JhbSA9IGNvbXBpbGVQcm9ncmFtO1xuXG52YXIgbWFjcm9leHBhbmQxID0gZnVuY3Rpb24gbWFjcm9leHBhbmQxKGZvcm0pIHtcbiAgcmV0dXJuIGlzTGlzdChmb3JtKSA/XG4gICAgKGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIG9wID0gZmlyc3QoZm9ybSk7XG4gICAgICB2YXIgaWQgPSBpc1N5bWJvbChvcCkgP1xuICAgICAgICBuYW1lKG9wKSA6XG4gICAgICAgIHZvaWQoMCk7XG4gICAgICByZXR1cm4gaXNTcGVjaWFsKG9wKSA/XG4gICAgICAgIGZvcm0gOlxuICAgICAgaXNNYWNybyhvcCkgP1xuICAgICAgICBleGVjdXRlTWFjcm8ob3AsIHJlc3QoZm9ybSkpIDpcbiAgICAgIChpc1N5bWJvbChvcCkpICYmICghKGlkID09PSBcIi5cIikpID9cbiAgICAgICAgZmlyc3QoaWQpID09PSBcIi5cIiA/XG4gICAgICAgICAgY291bnQoZm9ybSkgPCAyID9cbiAgICAgICAgICAgIChmdW5jdGlvbigpIHsgdGhyb3cgRXJyb3IoXCJNYWxmb3JtZWQgbWVtYmVyIGV4cHJlc3Npb24sIGV4cGVjdGluZyAoLm1lbWJlciB0YXJnZXQgLi4uKVwiKTsgfSkoKSA6XG4gICAgICAgICAgICBjb25zKHN5bWJvbCh2b2lkKDApLCBcIi5cIiksIGNvbnMoc2Vjb25kKGZvcm0pLCBjb25zKHN5bWJvbChzdWJzKGlkLCAxKSksIHJlc3QocmVzdChmb3JtKSkpKSkgOlxuICAgICAgICBsYXN0KGlkKSA9PT0gXCIuXCIgP1xuICAgICAgICAgIGNvbnMoc3ltYm9sKHZvaWQoMCksIFwibmV3XCIpLCBjb25zKHN5bWJvbChzdWJzKGlkLCAwLCBkZWMoY291bnQoaWQpKSkpLCByZXN0KGZvcm0pKSkgOlxuICAgICAgICAgIGZvcm0gOlxuICAgICAgXCJlbHNlXCIgP1xuICAgICAgICBmb3JtIDpcbiAgICAgICAgdm9pZCgwKTtcbiAgICB9KSgpIDpcbiAgICBmb3JtO1xufTtcbmV4cG9ydHMubWFjcm9leHBhbmQxID0gbWFjcm9leHBhbmQxO1xuXG52YXIgbWFjcm9leHBhbmQgPSBmdW5jdGlvbiBtYWNyb2V4cGFuZChmb3JtKSB7XG4gIHJldHVybiAoZnVuY3Rpb24gbG9vcChvcmlnaW5hbCwgZXhwYW5kZWQpIHtcbiAgICB2YXIgcmVjdXIgPSBsb29wO1xuICAgIHdoaWxlIChyZWN1ciA9PT0gbG9vcCkge1xuICAgICAgcmVjdXIgPSBvcmlnaW5hbCA9PT0gZXhwYW5kZWQgP1xuICAgICAgb3JpZ2luYWwgOlxuICAgICAgKG9yaWdpbmFsID0gZXhwYW5kZWQsIGV4cGFuZGVkID0gbWFjcm9leHBhbmQxKGV4cGFuZGVkKSwgbG9vcCk7XG4gICAgfTtcbiAgICByZXR1cm4gcmVjdXI7XG4gIH0pKGZvcm0sIG1hY3JvZXhwYW5kMShmb3JtKSk7XG59O1xuZXhwb3J0cy5tYWNyb2V4cGFuZCA9IG1hY3JvZXhwYW5kO1xuXG52YXIgX2xpbmVCcmVha1BhdHRlcm5fID0gL1xcbig/PVteXFxuXSkvbTtcbmV4cG9ydHMuX2xpbmVCcmVha1BhdHRlcm5fID0gX2xpbmVCcmVha1BhdHRlcm5fO1xuXG52YXIgaW5kZW50ID0gZnVuY3Rpb24gaW5kZW50KGNvZGUsIGluZGVudGF0aW9uKSB7XG4gIHJldHVybiBqb2luKGluZGVudGF0aW9uLCBzcGxpdChjb2RlLCBfbGluZUJyZWFrUGF0dGVybl8pKTtcbn07XG5leHBvcnRzLmluZGVudCA9IGluZGVudDtcblxudmFyIGNvbXBpbGVUZW1wbGF0ZSA9IGZ1bmN0aW9uIGNvbXBpbGVUZW1wbGF0ZShmb3JtKSB7XG4gIHZhciBpbmRlbnRQYXR0ZXJuID0gL1xcbiAqJC87XG4gIHZhciBnZXRJbmRlbnRhdGlvbiA9IGZ1bmN0aW9uKGNvZGUpIHtcbiAgICByZXR1cm4gKHJlRmluZChpbmRlbnRQYXR0ZXJuLCBjb2RlKSkgfHwgXCJcXG5cIjtcbiAgfTtcbiAgcmV0dXJuIChmdW5jdGlvbiBsb29wKGNvZGUsIHBhcnRzLCB2YWx1ZXMpIHtcbiAgICB2YXIgcmVjdXIgPSBsb29wO1xuICAgIHdoaWxlIChyZWN1ciA9PT0gbG9vcCkge1xuICAgICAgcmVjdXIgPSBjb3VudChwYXJ0cykgPiAxID9cbiAgICAgIChjb2RlID0gXCJcIiArIGNvZGUgKyAoZmlyc3QocGFydHMpKSArIChpbmRlbnQoXCJcIiArIChmaXJzdCh2YWx1ZXMpKSwgZ2V0SW5kZW50YXRpb24oZmlyc3QocGFydHMpKSkpLCBwYXJ0cyA9IHJlc3QocGFydHMpLCB2YWx1ZXMgPSByZXN0KHZhbHVlcyksIGxvb3ApIDpcbiAgICAgIFwiXCIgKyBjb2RlICsgKGZpcnN0KHBhcnRzKSk7XG4gICAgfTtcbiAgICByZXR1cm4gcmVjdXI7XG4gIH0pKFwiXCIsIHNwbGl0KGZpcnN0KGZvcm0pLCBcIn57fVwiKSwgcmVzdChmb3JtKSk7XG59O1xuZXhwb3J0cy5jb21waWxlVGVtcGxhdGUgPSBjb21waWxlVGVtcGxhdGU7XG5cbnZhciBjb21waWxlRGVmID0gZnVuY3Rpb24gY29tcGlsZURlZihmb3JtKSB7XG4gIHZhciBpZCA9IGZpcnN0KGZvcm0pO1xuICB2YXIgaXNFeHBvcnQgPSAoKCgobWV0YShmb3JtKSkgfHwge30pIHx8IDApW1widG9wXCJdKSAmJiAoISgoKChtZXRhKGlkKSkgfHwge30pIHx8IDApW1wicHJpdmF0ZVwiXSkpO1xuICB2YXIgYXR0cmlidXRlID0gc3ltYm9sKG5hbWVzcGFjZShpZCksIFwiXCIgKyBcIi1cIiArIChuYW1lKGlkKSkpO1xuICByZXR1cm4gaXNFeHBvcnQgP1xuICAgIGNvbXBpbGVUZW1wbGF0ZShsaXN0KFwidmFyIH57fTtcXG5+e31cIiwgY29tcGlsZShjb25zKHN5bWJvbCh2b2lkKDApLCBcInNldCFcIiksIGZvcm0pKSwgY29tcGlsZShsaXN0KHN5bWJvbCh2b2lkKDApLCBcInNldCFcIiksIGxpc3Qoc3ltYm9sKHZvaWQoMCksIFwiLlwiKSwgc3ltYm9sKHZvaWQoMCksIFwiZXhwb3J0c1wiKSwgYXR0cmlidXRlKSwgaWQpKSkpIDpcbiAgICBjb21waWxlVGVtcGxhdGUobGlzdChcInZhciB+e31cIiwgY29tcGlsZShjb25zKHN5bWJvbCh2b2lkKDApLCBcInNldCFcIiksIGZvcm0pKSkpO1xufTtcbmV4cG9ydHMuY29tcGlsZURlZiA9IGNvbXBpbGVEZWY7XG5cbnZhciBjb21waWxlSWZFbHNlID0gZnVuY3Rpb24gY29tcGlsZUlmRWxzZShmb3JtKSB7XG4gIHZhciBjb25kaXRpb24gPSBtYWNyb2V4cGFuZChmaXJzdChmb3JtKSk7XG4gIHZhciB0aGVuRXhwcmVzc2lvbiA9IG1hY3JvZXhwYW5kKHNlY29uZChmb3JtKSk7XG4gIHZhciBlbHNlRXhwcmVzc2lvbiA9IG1hY3JvZXhwYW5kKHRoaXJkKGZvcm0pKTtcbiAgcmV0dXJuIGNvbXBpbGVUZW1wbGF0ZShsaXN0KChpc0xpc3QoZWxzZUV4cHJlc3Npb24pKSAmJiAoaXNFcXVhbChmaXJzdChlbHNlRXhwcmVzc2lvbiksIHN5bWJvbCh2b2lkKDApLCBcImlmXCIpKSkgP1xuICAgIFwifnt9ID9cXG4gIH57fSA6XFxufnt9XCIgOlxuICAgIFwifnt9ID9cXG4gIH57fSA6XFxuICB+e31cIiwgY29tcGlsZShjb25kaXRpb24pLCBjb21waWxlKHRoZW5FeHByZXNzaW9uKSwgY29tcGlsZShlbHNlRXhwcmVzc2lvbikpKTtcbn07XG5leHBvcnRzLmNvbXBpbGVJZkVsc2UgPSBjb21waWxlSWZFbHNlO1xuXG52YXIgY29tcGlsZURpY3Rpb25hcnkgPSBmdW5jdGlvbiBjb21waWxlRGljdGlvbmFyeShmb3JtKSB7XG4gIHZhciBib2R5ID0gKGZ1bmN0aW9uIGxvb3AoYm9keSwgbmFtZXMpIHtcbiAgICB2YXIgcmVjdXIgPSBsb29wO1xuICAgIHdoaWxlIChyZWN1ciA9PT0gbG9vcCkge1xuICAgICAgcmVjdXIgPSBpc0VtcHR5KG5hbWVzKSA/XG4gICAgICBib2R5IDpcbiAgICAgIChib2R5ID0gXCJcIiArIChpc05pbChib2R5KSA/XG4gICAgICAgIFwiXCIgOlxuICAgICAgICBcIlwiICsgYm9keSArIFwiLFxcblwiKSArIChjb21waWxlVGVtcGxhdGUobGlzdChcIn57fTogfnt9XCIsIGNvbXBpbGUoZmlyc3QobmFtZXMpKSwgY29tcGlsZShtYWNyb2V4cGFuZCgoZm9ybSB8fCAwKVtmaXJzdChuYW1lcyldKSkpKSksIG5hbWVzID0gcmVzdChuYW1lcyksIGxvb3ApO1xuICAgIH07XG4gICAgcmV0dXJuIHJlY3VyO1xuICB9KSh2b2lkKDApLCBrZXlzKGZvcm0pKTtcbiAgcmV0dXJuIGlzTmlsKGJvZHkpID9cbiAgICBcInt9XCIgOlxuICAgIGNvbXBpbGVUZW1wbGF0ZShsaXN0KFwie1xcbiAgfnt9XFxufVwiLCBib2R5KSk7XG59O1xuZXhwb3J0cy5jb21waWxlRGljdGlvbmFyeSA9IGNvbXBpbGVEaWN0aW9uYXJ5O1xuXG52YXIgZGVzdWdhckZuTmFtZSA9IGZ1bmN0aW9uIGRlc3VnYXJGbk5hbWUoZm9ybSkge1xuICByZXR1cm4gKGlzU3ltYm9sKGZpcnN0KGZvcm0pKSkgfHwgKGlzTmlsKGZpcnN0KGZvcm0pKSkgP1xuICAgIGZvcm0gOlxuICAgIGNvbnModm9pZCgwKSwgZm9ybSk7XG59O1xuZXhwb3J0cy5kZXN1Z2FyRm5OYW1lID0gZGVzdWdhckZuTmFtZTtcblxudmFyIGRlc3VnYXJGbkRvYyA9IGZ1bmN0aW9uIGRlc3VnYXJGbkRvYyhmb3JtKSB7XG4gIHJldHVybiAoaXNTdHJpbmcoc2Vjb25kKGZvcm0pKSkgfHwgKGlzTmlsKHNlY29uZChmb3JtKSkpID9cbiAgICBmb3JtIDpcbiAgICBjb25zKGZpcnN0KGZvcm0pLCBjb25zKHZvaWQoMCksIHJlc3QoZm9ybSkpKTtcbn07XG5leHBvcnRzLmRlc3VnYXJGbkRvYyA9IGRlc3VnYXJGbkRvYztcblxudmFyIGRlc3VnYXJGbkF0dHJzID0gZnVuY3Rpb24gZGVzdWdhckZuQXR0cnMoZm9ybSkge1xuICByZXR1cm4gKGlzRGljdGlvbmFyeSh0aGlyZChmb3JtKSkpIHx8IChpc05pbCh0aGlyZChmb3JtKSkpID9cbiAgICBmb3JtIDpcbiAgICBjb25zKGZpcnN0KGZvcm0pLCBjb25zKHNlY29uZChmb3JtKSwgY29ucyh2b2lkKDApLCByZXN0KHJlc3QoZm9ybSkpKSkpO1xufTtcbmV4cG9ydHMuZGVzdWdhckZuQXR0cnMgPSBkZXN1Z2FyRm5BdHRycztcblxudmFyIGNvbXBpbGVEZXN1Z2FyZWRGbiA9IGZ1bmN0aW9uIGNvbXBpbGVEZXN1Z2FyZWRGbihuYW1lLCBkb2MsIGF0dHJzLCBwYXJhbXMsIGJvZHkpIHtcbiAgcmV0dXJuIGNvbXBpbGVUZW1wbGF0ZShpc05pbChuYW1lKSA/XG4gICAgbGlzdChcImZ1bmN0aW9uKH57fSkge1xcbiAgfnt9XFxufVwiLCBqb2luKFwiLCBcIiwgbWFwKGNvbXBpbGUsIChwYXJhbXMgfHwgMClbXCJuYW1lc1wiXSkpLCBjb21waWxlRm5Cb2R5KG1hcChtYWNyb2V4cGFuZCwgYm9keSksIHBhcmFtcykpIDpcbiAgICBsaXN0KFwiZnVuY3Rpb24gfnt9KH57fSkge1xcbiAgfnt9XFxufVwiLCBjb21waWxlKG5hbWUpLCBqb2luKFwiLCBcIiwgbWFwKGNvbXBpbGUsIChwYXJhbXMgfHwgMClbXCJuYW1lc1wiXSkpLCBjb21waWxlRm5Cb2R5KG1hcChtYWNyb2V4cGFuZCwgYm9keSksIHBhcmFtcykpKTtcbn07XG5leHBvcnRzLmNvbXBpbGVEZXN1Z2FyZWRGbiA9IGNvbXBpbGVEZXN1Z2FyZWRGbjtcblxudmFyIGNvbXBpbGVTdGF0ZW1lbnRzID0gZnVuY3Rpb24gY29tcGlsZVN0YXRlbWVudHMoZm9ybSwgcHJlZml4KSB7XG4gIHJldHVybiAoZnVuY3Rpb24gbG9vcChyZXN1bHQsIGV4cHJlc3Npb24sIGV4cHJlc3Npb25zKSB7XG4gICAgdmFyIHJlY3VyID0gbG9vcDtcbiAgICB3aGlsZSAocmVjdXIgPT09IGxvb3ApIHtcbiAgICAgIHJlY3VyID0gaXNFbXB0eShleHByZXNzaW9ucykgP1xuICAgICAgXCJcIiArIHJlc3VsdCArIChpc05pbChwcmVmaXgpID9cbiAgICAgICAgXCJcIiA6XG4gICAgICAgIHByZWZpeCkgKyAoY29tcGlsZShtYWNyb2V4cGFuZChleHByZXNzaW9uKSkpICsgXCI7XCIgOlxuICAgICAgKHJlc3VsdCA9IFwiXCIgKyByZXN1bHQgKyAoY29tcGlsZShtYWNyb2V4cGFuZChleHByZXNzaW9uKSkpICsgXCI7XFxuXCIsIGV4cHJlc3Npb24gPSBmaXJzdChleHByZXNzaW9ucyksIGV4cHJlc3Npb25zID0gcmVzdChleHByZXNzaW9ucyksIGxvb3ApO1xuICAgIH07XG4gICAgcmV0dXJuIHJlY3VyO1xuICB9KShcIlwiLCBmaXJzdChmb3JtKSwgcmVzdChmb3JtKSk7XG59O1xuZXhwb3J0cy5jb21waWxlU3RhdGVtZW50cyA9IGNvbXBpbGVTdGF0ZW1lbnRzO1xuXG52YXIgY29tcGlsZUZuQm9keSA9IGZ1bmN0aW9uIGNvbXBpbGVGbkJvZHkoZm9ybSwgcGFyYW1zKSB7XG4gIHJldHVybiAoaXNEaWN0aW9uYXJ5KHBhcmFtcykpICYmICgocGFyYW1zIHx8IDApW1wicmVzdFwiXSkgP1xuICAgIGNvbXBpbGVTdGF0ZW1lbnRzKGNvbnMobGlzdChzeW1ib2wodm9pZCgwKSwgXCJkZWZcIiksIChwYXJhbXMgfHwgMClbXCJyZXN0XCJdLCBsaXN0KHN5bWJvbCh2b2lkKDApLCBcIkFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsXCIpLCBzeW1ib2wodm9pZCgwKSwgXCJhcmd1bWVudHNcIiksIChwYXJhbXMgfHwgMClbXCJhcml0eVwiXSkpLCBmb3JtKSwgXCJyZXR1cm4gXCIpIDpcbiAgKGNvdW50KGZvcm0pID09PSAxKSAmJiAoaXNMaXN0KGZpcnN0KGZvcm0pKSkgJiYgKGlzRXF1YWwoZmlyc3QoZmlyc3QoZm9ybSkpLCBzeW1ib2wodm9pZCgwKSwgXCJkb1wiKSkpID9cbiAgICBjb21waWxlRm5Cb2R5KHJlc3QoZmlyc3QoZm9ybSkpLCBwYXJhbXMpIDpcbiAgICBjb21waWxlU3RhdGVtZW50cyhmb3JtLCBcInJldHVybiBcIik7XG59O1xuZXhwb3J0cy5jb21waWxlRm5Cb2R5ID0gY29tcGlsZUZuQm9keTtcblxudmFyIGRlc3VnYXJQYXJhbXMgPSBmdW5jdGlvbiBkZXN1Z2FyUGFyYW1zKHBhcmFtcykge1xuICByZXR1cm4gKGZ1bmN0aW9uIGxvb3AobmFtZXMsIHBhcmFtcykge1xuICAgIHZhciByZWN1ciA9IGxvb3A7XG4gICAgd2hpbGUgKHJlY3VyID09PSBsb29wKSB7XG4gICAgICByZWN1ciA9IGlzRW1wdHkocGFyYW1zKSA/XG4gICAgICB7XG4gICAgICAgIFwibmFtZXNcIjogbmFtZXMsXG4gICAgICAgIFwiYXJpdHlcIjogY291bnQobmFtZXMpLFxuICAgICAgICBcInJlc3RcIjogdm9pZCgwKVxuICAgICAgfSA6XG4gICAgaXNFcXVhbChmaXJzdChwYXJhbXMpLCBzeW1ib2wodm9pZCgwKSwgXCImXCIpKSA/XG4gICAgICBpc0VxdWFsKGNvdW50KHBhcmFtcyksIDEpID9cbiAgICAgICAge1xuICAgICAgICAgIFwibmFtZXNcIjogbmFtZXMsXG4gICAgICAgICAgXCJhcml0eVwiOiBjb3VudChuYW1lcyksXG4gICAgICAgICAgXCJyZXN0XCI6IHZvaWQoMClcbiAgICAgICAgfSA6XG4gICAgICBpc0VxdWFsKGNvdW50KHBhcmFtcyksIDIpID9cbiAgICAgICAge1xuICAgICAgICAgIFwibmFtZXNcIjogbmFtZXMsXG4gICAgICAgICAgXCJhcml0eVwiOiBjb3VudChuYW1lcyksXG4gICAgICAgICAgXCJyZXN0XCI6IHNlY29uZChwYXJhbXMpXG4gICAgICAgIH0gOlxuICAgICAgXCJlbHNlXCIgP1xuICAgICAgICAoZnVuY3Rpb24oKSB7IHRocm93IFR5cGVFcnJvcihcIlVuZXhwZWN0ZWQgbnVtYmVyIG9mIHBhcmFtZXRlcnMgYWZ0ZXIgJlwiKTsgfSkoKSA6XG4gICAgICAgIHZvaWQoMCkgOlxuICAgIFwiZWxzZVwiID9cbiAgICAgIChuYW1lcyA9IGNvbmoobmFtZXMsIGZpcnN0KHBhcmFtcykpLCBwYXJhbXMgPSByZXN0KHBhcmFtcyksIGxvb3ApIDpcbiAgICAgIHZvaWQoMCk7XG4gICAgfTtcbiAgICByZXR1cm4gcmVjdXI7XG4gIH0pKFtdLCBwYXJhbXMpO1xufTtcbmV4cG9ydHMuZGVzdWdhclBhcmFtcyA9IGRlc3VnYXJQYXJhbXM7XG5cbnZhciBhbmFseXplT3ZlcmxvYWRlZEZuID0gZnVuY3Rpb24gYW5hbHl6ZU92ZXJsb2FkZWRGbihuYW1lLCBkb2MsIGF0dHJzLCBvdmVybG9hZHMpIHtcbiAgcmV0dXJuIG1hcChmdW5jdGlvbihvdmVybG9hZCkge1xuICAgIHZhciBwYXJhbXMgPSBkZXN1Z2FyUGFyYW1zKGZpcnN0KG92ZXJsb2FkKSk7XG4gICAgcmV0dXJuIHtcbiAgICAgIFwicmVzdFwiOiAocGFyYW1zIHx8IDApW1wicmVzdFwiXSxcbiAgICAgIFwibmFtZXNcIjogKHBhcmFtcyB8fCAwKVtcIm5hbWVzXCJdLFxuICAgICAgXCJhcml0eVwiOiAocGFyYW1zIHx8IDApW1wiYXJpdHlcIl0sXG4gICAgICBcImJvZHlcIjogcmVzdChvdmVybG9hZClcbiAgICB9O1xuICB9LCBvdmVybG9hZHMpO1xufTtcbmV4cG9ydHMuYW5hbHl6ZU92ZXJsb2FkZWRGbiA9IGFuYWx5emVPdmVybG9hZGVkRm47XG5cbnZhciBjb21waWxlT3ZlcmxvYWRlZEZuID0gZnVuY3Rpb24gY29tcGlsZU92ZXJsb2FkZWRGbihuYW1lLCBkb2MsIGF0dHJzLCBvdmVybG9hZHMpIHtcbiAgdmFyIG1ldGhvZHMgPSBhbmFseXplT3ZlcmxvYWRlZEZuKG5hbWUsIGRvYywgYXR0cnMsIG92ZXJsb2Fkcyk7XG4gIHZhciBmaXhlZE1ldGhvZHMgPSBmaWx0ZXIoZnVuY3Rpb24obWV0aG9kKSB7XG4gICAgcmV0dXJuICEoKG1ldGhvZCB8fCAwKVtcInJlc3RcIl0pO1xuICB9LCBtZXRob2RzKTtcbiAgdmFyIHZhcmlhZGljID0gZmlyc3QoZmlsdGVyKGZ1bmN0aW9uKG1ldGhvZCkge1xuICAgIHJldHVybiAobWV0aG9kIHx8IDApW1wicmVzdFwiXTtcbiAgfSwgbWV0aG9kcykpO1xuICB2YXIgbmFtZXMgPSByZWR1Y2UoZnVuY3Rpb24obmFtZXMsIHBhcmFtcykge1xuICAgIHJldHVybiBjb3VudChuYW1lcykgPiAocGFyYW1zIHx8IDApW1wiYXJpdHlcIl0gP1xuICAgICAgbmFtZXMgOlxuICAgICAgKHBhcmFtcyB8fCAwKVtcIm5hbWVzXCJdO1xuICB9LCBbXSwgbWV0aG9kcyk7XG4gIHJldHVybiBsaXN0KHN5bWJvbCh2b2lkKDApLCBcImZuXCIpLCBuYW1lLCBkb2MsIGF0dHJzLCBuYW1lcywgbGlzdChzeW1ib2wodm9pZCgwKSwgXCJyYXcqXCIpLCBjb21waWxlU3dpdGNoKHN5bWJvbCh2b2lkKDApLCBcImFyZ3VtZW50cy5sZW5ndGhcIiksIG1hcChmdW5jdGlvbihtZXRob2QpIHtcbiAgICByZXR1cm4gY29ucygobWV0aG9kIHx8IDApW1wiYXJpdHlcIl0sIGxpc3Qoc3ltYm9sKHZvaWQoMCksIFwicmF3KlwiKSwgY29tcGlsZUZuQm9keShjb25jYXQoY29tcGlsZVJlYmluZChuYW1lcywgKG1ldGhvZCB8fCAwKVtcIm5hbWVzXCJdKSwgKG1ldGhvZCB8fCAwKVtcImJvZHlcIl0pKSkpO1xuICB9LCBmaXhlZE1ldGhvZHMpLCBpc05pbCh2YXJpYWRpYykgP1xuICAgIGxpc3Qoc3ltYm9sKHZvaWQoMCksIFwidGhyb3dcIiksIGxpc3Qoc3ltYm9sKHZvaWQoMCksIFwiRXJyb3JcIiksIFwiSW52YWxpZCBhcml0eVwiKSkgOlxuICAgIGxpc3Qoc3ltYm9sKHZvaWQoMCksIFwicmF3KlwiKSwgY29tcGlsZUZuQm9keShjb25jYXQoY29tcGlsZVJlYmluZChjb25zKGxpc3Qoc3ltYm9sKHZvaWQoMCksIFwiQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGxcIiksIHN5bWJvbCh2b2lkKDApLCBcImFyZ3VtZW50c1wiKSwgKHZhcmlhZGljIHx8IDApW1wiYXJpdHlcIl0pLCBuYW1lcyksIGNvbnMoKHZhcmlhZGljIHx8IDApW1wicmVzdFwiXSwgKHZhcmlhZGljIHx8IDApW1wibmFtZXNcIl0pKSwgKHZhcmlhZGljIHx8IDApW1wiYm9keVwiXSkpKSkpLCB2b2lkKDApKTtcbn07XG5leHBvcnRzLmNvbXBpbGVPdmVybG9hZGVkRm4gPSBjb21waWxlT3ZlcmxvYWRlZEZuO1xuXG52YXIgY29tcGlsZVJlYmluZCA9IGZ1bmN0aW9uIGNvbXBpbGVSZWJpbmQoYmluZGluZ3MsIG5hbWVzKSB7XG4gIHJldHVybiAoZnVuY3Rpb24gbG9vcChmb3JtLCBiaW5kaW5ncywgbmFtZXMpIHtcbiAgICB2YXIgcmVjdXIgPSBsb29wO1xuICAgIHdoaWxlIChyZWN1ciA9PT0gbG9vcCkge1xuICAgICAgcmVjdXIgPSBpc0VtcHR5KG5hbWVzKSA/XG4gICAgICByZXZlcnNlKGZvcm0pIDpcbiAgICAgIChmb3JtID0gaXNFcXVhbChmaXJzdChuYW1lcyksIGZpcnN0KGJpbmRpbmdzKSkgP1xuICAgICAgICBmb3JtIDpcbiAgICAgICAgY29ucyhsaXN0KHN5bWJvbCh2b2lkKDApLCBcImRlZlwiKSwgZmlyc3QobmFtZXMpLCBmaXJzdChiaW5kaW5ncykpLCBmb3JtKSwgYmluZGluZ3MgPSByZXN0KGJpbmRpbmdzKSwgbmFtZXMgPSByZXN0KG5hbWVzKSwgbG9vcCk7XG4gICAgfTtcbiAgICByZXR1cm4gcmVjdXI7XG4gIH0pKGxpc3QoKSwgYmluZGluZ3MsIG5hbWVzKTtcbn07XG5leHBvcnRzLmNvbXBpbGVSZWJpbmQgPSBjb21waWxlUmViaW5kO1xuXG52YXIgY29tcGlsZVN3aXRjaENhc2VzID0gZnVuY3Rpb24gY29tcGlsZVN3aXRjaENhc2VzKGNhc2VzKSB7XG4gIHJldHVybiByZWR1Y2UoZnVuY3Rpb24oZm9ybSwgY2FzZUV4cHJlc3Npb24pIHtcbiAgICByZXR1cm4gXCJcIiArIGZvcm0gKyAoY29tcGlsZVRlbXBsYXRlKGxpc3QoXCJjYXNlIH57fTpcXG4gIH57fVxcblwiLCBjb21waWxlKG1hY3JvZXhwYW5kKGZpcnN0KGNhc2VFeHByZXNzaW9uKSkpLCBjb21waWxlKG1hY3JvZXhwYW5kKHJlc3QoY2FzZUV4cHJlc3Npb24pKSkpKSk7XG4gIH0sIFwiXCIsIGNhc2VzKTtcbn07XG5leHBvcnRzLmNvbXBpbGVTd2l0Y2hDYXNlcyA9IGNvbXBpbGVTd2l0Y2hDYXNlcztcblxudmFyIGNvbXBpbGVTd2l0Y2ggPSBmdW5jdGlvbiBjb21waWxlU3dpdGNoKHZhbHVlLCBjYXNlcywgZGVmYXVsdENhc2UpIHtcbiAgcmV0dXJuIGNvbXBpbGVUZW1wbGF0ZShsaXN0KFwic3dpdGNoICh+e30pIHtcXG4gIH57fVxcbiAgZGVmYXVsdDpcXG4gICAgfnt9XFxufVwiLCBjb21waWxlKG1hY3JvZXhwYW5kKHZhbHVlKSksIGNvbXBpbGVTd2l0Y2hDYXNlcyhjYXNlcyksIGNvbXBpbGUobWFjcm9leHBhbmQoZGVmYXVsdENhc2UpKSkpO1xufTtcbmV4cG9ydHMuY29tcGlsZVN3aXRjaCA9IGNvbXBpbGVTd2l0Y2g7XG5cbnZhciBjb21waWxlRm4gPSBmdW5jdGlvbiBjb21waWxlRm4oZm9ybSkge1xuICB2YXIgc2lnbmF0dXJlID0gZGVzdWdhckZuQXR0cnMoZGVzdWdhckZuRG9jKGRlc3VnYXJGbk5hbWUoZm9ybSkpKTtcbiAgdmFyIG5hbWUgPSBmaXJzdChzaWduYXR1cmUpO1xuICB2YXIgZG9jID0gc2Vjb25kKHNpZ25hdHVyZSk7XG4gIHZhciBhdHRycyA9IHRoaXJkKHNpZ25hdHVyZSk7XG4gIHJldHVybiBpc1ZlY3Rvcih0aGlyZChyZXN0KHNpZ25hdHVyZSkpKSA/XG4gICAgY29tcGlsZURlc3VnYXJlZEZuKG5hbWUsIGRvYywgYXR0cnMsIGRlc3VnYXJQYXJhbXModGhpcmQocmVzdChzaWduYXR1cmUpKSksIHJlc3QocmVzdChyZXN0KHJlc3Qoc2lnbmF0dXJlKSkpKSkgOlxuICAgIGNvbXBpbGUoY29tcGlsZU92ZXJsb2FkZWRGbihuYW1lLCBkb2MsIGF0dHJzLCByZXN0KHJlc3QocmVzdChzaWduYXR1cmUpKSkpKTtcbn07XG5leHBvcnRzLmNvbXBpbGVGbiA9IGNvbXBpbGVGbjtcblxudmFyIGNvbXBpbGVJbnZva2UgPSBmdW5jdGlvbiBjb21waWxlSW52b2tlKGZvcm0pIHtcbiAgcmV0dXJuIGNvbXBpbGVUZW1wbGF0ZShsaXN0KGlzTGlzdChmaXJzdChmb3JtKSkgP1xuICAgIFwiKH57fSkofnt9KVwiIDpcbiAgICBcIn57fSh+e30pXCIsIGNvbXBpbGUoZmlyc3QoZm9ybSkpLCBjb21waWxlR3JvdXAocmVzdChmb3JtKSkpKTtcbn07XG5leHBvcnRzLmNvbXBpbGVJbnZva2UgPSBjb21waWxlSW52b2tlO1xuXG52YXIgY29tcGlsZUdyb3VwID0gZnVuY3Rpb24gY29tcGlsZUdyb3VwKGZvcm0sIHdyYXApIHtcbiAgcmV0dXJuIHdyYXAgP1xuICAgIFwiXCIgKyBcIihcIiArIChjb21waWxlR3JvdXAoZm9ybSkpICsgXCIpXCIgOlxuICAgIGpvaW4oXCIsIFwiLCB2ZWMobWFwKGNvbXBpbGUsIG1hcChtYWNyb2V4cGFuZCwgZm9ybSkpKSk7XG59O1xuZXhwb3J0cy5jb21waWxlR3JvdXAgPSBjb21waWxlR3JvdXA7XG5cbnZhciBjb21waWxlRG8gPSBmdW5jdGlvbiBjb21waWxlRG8oZm9ybSkge1xuICByZXR1cm4gY29tcGlsZShsaXN0KGNvbnMoc3ltYm9sKHZvaWQoMCksIFwiZm5cIiksIGNvbnMoW10sIGZvcm0pKSkpO1xufTtcbmV4cG9ydHMuY29tcGlsZURvID0gY29tcGlsZURvO1xuXG52YXIgZGVmaW5lQmluZGluZ3MgPSBmdW5jdGlvbiBkZWZpbmVCaW5kaW5ncyhmb3JtKSB7XG4gIHJldHVybiAoZnVuY3Rpb24gbG9vcChkZWZzLCBiaW5kaW5ncykge1xuICAgIHZhciByZWN1ciA9IGxvb3A7XG4gICAgd2hpbGUgKHJlY3VyID09PSBsb29wKSB7XG4gICAgICByZWN1ciA9IGNvdW50KGJpbmRpbmdzKSA9PT0gMCA/XG4gICAgICByZXZlcnNlKGRlZnMpIDpcbiAgICAgIChkZWZzID0gY29ucyhsaXN0KHN5bWJvbCh2b2lkKDApLCBcImRlZlwiKSwgKGJpbmRpbmdzIHx8IDApWzBdLCAoYmluZGluZ3MgfHwgMClbMV0pLCBkZWZzKSwgYmluZGluZ3MgPSByZXN0KHJlc3QoYmluZGluZ3MpKSwgbG9vcCk7XG4gICAgfTtcbiAgICByZXR1cm4gcmVjdXI7XG4gIH0pKGxpc3QoKSwgZm9ybSk7XG59O1xuZXhwb3J0cy5kZWZpbmVCaW5kaW5ncyA9IGRlZmluZUJpbmRpbmdzO1xuXG52YXIgY29tcGlsZVRocm93ID0gZnVuY3Rpb24gY29tcGlsZVRocm93KGZvcm0pIHtcbiAgcmV0dXJuIGNvbXBpbGVUZW1wbGF0ZShsaXN0KFwiKGZ1bmN0aW9uKCkgeyB0aHJvdyB+e307IH0pKClcIiwgY29tcGlsZShtYWNyb2V4cGFuZChmaXJzdChmb3JtKSkpKSk7XG59O1xuZXhwb3J0cy5jb21waWxlVGhyb3cgPSBjb21waWxlVGhyb3c7XG5cbnZhciBjb21waWxlU2V0ID0gZnVuY3Rpb24gY29tcGlsZVNldChmb3JtKSB7XG4gIHJldHVybiBjb21waWxlVGVtcGxhdGUobGlzdChcIn57fSA9IH57fVwiLCBjb21waWxlKG1hY3JvZXhwYW5kKGZpcnN0KGZvcm0pKSksIGNvbXBpbGUobWFjcm9leHBhbmQoc2Vjb25kKGZvcm0pKSkpKTtcbn07XG5leHBvcnRzLmNvbXBpbGVTZXQgPSBjb21waWxlU2V0O1xuXG52YXIgY29tcGlsZVZlY3RvciA9IGZ1bmN0aW9uIGNvbXBpbGVWZWN0b3IoZm9ybSkge1xuICByZXR1cm4gY29tcGlsZVRlbXBsYXRlKGxpc3QoXCJbfnt9XVwiLCBjb21waWxlR3JvdXAoZm9ybSkpKTtcbn07XG5leHBvcnRzLmNvbXBpbGVWZWN0b3IgPSBjb21waWxlVmVjdG9yO1xuXG52YXIgY29tcGlsZVRyeSA9IGZ1bmN0aW9uIGNvbXBpbGVUcnkoZm9ybSkge1xuICByZXR1cm4gKGZ1bmN0aW9uIGxvb3AodHJ5RXhwcnMsIGNhdGNoRXhwcnMsIGZpbmFsbHlFeHBycywgZXhwcnMpIHtcbiAgICB2YXIgcmVjdXIgPSBsb29wO1xuICAgIHdoaWxlIChyZWN1ciA9PT0gbG9vcCkge1xuICAgICAgcmVjdXIgPSBpc0VtcHR5KGV4cHJzKSA/XG4gICAgICBpc0VtcHR5KGNhdGNoRXhwcnMpID9cbiAgICAgICAgY29tcGlsZVRlbXBsYXRlKGxpc3QoXCIoZnVuY3Rpb24oKSB7XFxudHJ5IHtcXG4gIH57fVxcbn0gZmluYWxseSB7XFxuICB+e31cXG59fSkoKVwiLCBjb21waWxlRm5Cb2R5KHRyeUV4cHJzKSwgY29tcGlsZUZuQm9keShmaW5hbGx5RXhwcnMpKSkgOlxuICAgICAgaXNFbXB0eShmaW5hbGx5RXhwcnMpID9cbiAgICAgICAgY29tcGlsZVRlbXBsYXRlKGxpc3QoXCIoZnVuY3Rpb24oKSB7XFxudHJ5IHtcXG4gIH57fVxcbn0gY2F0Y2ggKH57fSkge1xcbiAgfnt9XFxufX0pKClcIiwgY29tcGlsZUZuQm9keSh0cnlFeHBycyksIGNvbXBpbGUoZmlyc3QoY2F0Y2hFeHBycykpLCBjb21waWxlRm5Cb2R5KHJlc3QoY2F0Y2hFeHBycykpKSkgOlxuICAgICAgICBjb21waWxlVGVtcGxhdGUobGlzdChcIihmdW5jdGlvbigpIHtcXG50cnkge1xcbiAgfnt9XFxufSBjYXRjaCAofnt9KSB7XFxuICB+e31cXG59IGZpbmFsbHkge1xcbiAgfnt9XFxufX0pKClcIiwgY29tcGlsZUZuQm9keSh0cnlFeHBycyksIGNvbXBpbGUoZmlyc3QoY2F0Y2hFeHBycykpLCBjb21waWxlRm5Cb2R5KHJlc3QoY2F0Y2hFeHBycykpLCBjb21waWxlRm5Cb2R5KGZpbmFsbHlFeHBycykpKSA6XG4gICAgaXNFcXVhbChmaXJzdChmaXJzdChleHBycykpLCBzeW1ib2wodm9pZCgwKSwgXCJjYXRjaFwiKSkgP1xuICAgICAgKHRyeUV4cHJzID0gdHJ5RXhwcnMsIGNhdGNoRXhwcnMgPSByZXN0KGZpcnN0KGV4cHJzKSksIGZpbmFsbHlFeHBycyA9IGZpbmFsbHlFeHBycywgZXhwcnMgPSByZXN0KGV4cHJzKSwgbG9vcCkgOlxuICAgIGlzRXF1YWwoZmlyc3QoZmlyc3QoZXhwcnMpKSwgc3ltYm9sKHZvaWQoMCksIFwiZmluYWxseVwiKSkgP1xuICAgICAgKHRyeUV4cHJzID0gdHJ5RXhwcnMsIGNhdGNoRXhwcnMgPSBjYXRjaEV4cHJzLCBmaW5hbGx5RXhwcnMgPSByZXN0KGZpcnN0KGV4cHJzKSksIGV4cHJzID0gcmVzdChleHBycyksIGxvb3ApIDpcbiAgICAgICh0cnlFeHBycyA9IGNvbnMoZmlyc3QoZXhwcnMpLCB0cnlFeHBycyksIGNhdGNoRXhwcnMgPSBjYXRjaEV4cHJzLCBmaW5hbGx5RXhwcnMgPSBmaW5hbGx5RXhwcnMsIGV4cHJzID0gcmVzdChleHBycyksIGxvb3ApO1xuICAgIH07XG4gICAgcmV0dXJuIHJlY3VyO1xuICB9KShsaXN0KCksIGxpc3QoKSwgbGlzdCgpLCByZXZlcnNlKGZvcm0pKTtcbn07XG5leHBvcnRzLmNvbXBpbGVUcnkgPSBjb21waWxlVHJ5O1xuXG52YXIgY29tcGlsZVByb3BlcnR5ID0gZnVuY3Rpb24gY29tcGlsZVByb3BlcnR5KGZvcm0pIHtcbiAgcmV0dXJuIChuYW1lKHNlY29uZChmb3JtKSkpWzBdID09PSBcIi1cIiA/XG4gICAgY29tcGlsZVRlbXBsYXRlKGxpc3QoaXNMaXN0KGZpcnN0KGZvcm0pKSA/XG4gICAgICBcIih+e30pLn57fVwiIDpcbiAgICAgIFwifnt9Ln57fVwiLCBjb21waWxlKG1hY3JvZXhwYW5kKGZpcnN0KGZvcm0pKSksIGNvbXBpbGUobWFjcm9leHBhbmQoc3ltYm9sKHN1YnMobmFtZShzZWNvbmQoZm9ybSkpLCAxKSkpKSkpIDpcbiAgICBjb21waWxlVGVtcGxhdGUobGlzdChcIn57fS5+e30ofnt9KVwiLCBjb21waWxlKG1hY3JvZXhwYW5kKGZpcnN0KGZvcm0pKSksIGNvbXBpbGUobWFjcm9leHBhbmQoc2Vjb25kKGZvcm0pKSksIGNvbXBpbGVHcm91cChyZXN0KHJlc3QoZm9ybSkpKSkpO1xufTtcbmV4cG9ydHMuY29tcGlsZVByb3BlcnR5ID0gY29tcGlsZVByb3BlcnR5O1xuXG52YXIgY29tcGlsZUFwcGx5ID0gZnVuY3Rpb24gY29tcGlsZUFwcGx5KGZvcm0pIHtcbiAgcmV0dXJuIGNvbXBpbGUobGlzdChzeW1ib2wodm9pZCgwKSwgXCIuXCIpLCBmaXJzdChmb3JtKSwgc3ltYm9sKHZvaWQoMCksIFwiYXBwbHlcIiksIGZpcnN0KGZvcm0pLCBzZWNvbmQoZm9ybSkpKTtcbn07XG5leHBvcnRzLmNvbXBpbGVBcHBseSA9IGNvbXBpbGVBcHBseTtcblxudmFyIGNvbXBpbGVOZXcgPSBmdW5jdGlvbiBjb21waWxlTmV3KGZvcm0pIHtcbiAgcmV0dXJuIGNvbXBpbGVUZW1wbGF0ZShsaXN0KFwibmV3IH57fVwiLCBjb21waWxlKGZvcm0pKSk7XG59O1xuZXhwb3J0cy5jb21waWxlTmV3ID0gY29tcGlsZU5ldztcblxudmFyIGNvbXBpbGVBZ2V0ID0gZnVuY3Rpb24gY29tcGlsZUFnZXQoZm9ybSkge1xuICB2YXIgdGFyZ2V0ID0gbWFjcm9leHBhbmQoZmlyc3QoZm9ybSkpO1xuICB2YXIgYXR0cmlidXRlID0gbWFjcm9leHBhbmQoc2Vjb25kKGZvcm0pKTtcbiAgdmFyIG5vdEZvdW5kID0gdGhpcmQoZm9ybSk7XG4gIHZhciB0ZW1wbGF0ZSA9IGlzTGlzdCh0YXJnZXQpID9cbiAgICBcIih+e30pW357fV1cIiA6XG4gICAgXCJ+e31bfnt9XVwiO1xuICByZXR1cm4gbm90Rm91bmQgP1xuICAgIGNvbXBpbGUobGlzdChzeW1ib2wodm9pZCgwKSwgXCJvclwiKSwgbGlzdChzeW1ib2wodm9pZCgwKSwgXCJnZXRcIiksIGZpcnN0KGZvcm0pLCBzZWNvbmQoZm9ybSkpLCBtYWNyb2V4cGFuZChub3RGb3VuZCkpKSA6XG4gICAgY29tcGlsZVRlbXBsYXRlKGxpc3QodGVtcGxhdGUsIGNvbXBpbGUodGFyZ2V0KSwgY29tcGlsZShhdHRyaWJ1dGUpKSk7XG59O1xuZXhwb3J0cy5jb21waWxlQWdldCA9IGNvbXBpbGVBZ2V0O1xuXG52YXIgY29tcGlsZUdldCA9IGZ1bmN0aW9uIGNvbXBpbGVHZXQoZm9ybSkge1xuICByZXR1cm4gY29tcGlsZUFnZXQoY29ucyhsaXN0KHN5bWJvbCh2b2lkKDApLCBcIm9yXCIpLCBmaXJzdChmb3JtKSwgMCksIHJlc3QoZm9ybSkpKTtcbn07XG5leHBvcnRzLmNvbXBpbGVHZXQgPSBjb21waWxlR2V0O1xuXG52YXIgY29tcGlsZUluc3RhbmNlID0gZnVuY3Rpb24gY29tcGlsZUluc3RhbmNlKGZvcm0pIHtcbiAgcmV0dXJuIGNvbXBpbGVUZW1wbGF0ZShsaXN0KFwifnt9IGluc3RhbmNlb2Ygfnt9XCIsIGNvbXBpbGUobWFjcm9leHBhbmQoc2Vjb25kKGZvcm0pKSksIGNvbXBpbGUobWFjcm9leHBhbmQoZmlyc3QoZm9ybSkpKSkpO1xufTtcbmV4cG9ydHMuY29tcGlsZUluc3RhbmNlID0gY29tcGlsZUluc3RhbmNlO1xuXG52YXIgY29tcGlsZU5vdCA9IGZ1bmN0aW9uIGNvbXBpbGVOb3QoZm9ybSkge1xuICByZXR1cm4gY29tcGlsZVRlbXBsYXRlKGxpc3QoXCIhKH57fSlcIiwgY29tcGlsZShtYWNyb2V4cGFuZChmaXJzdChmb3JtKSkpKSk7XG59O1xuZXhwb3J0cy5jb21waWxlTm90ID0gY29tcGlsZU5vdDtcblxudmFyIGNvbXBpbGVMb29wID0gZnVuY3Rpb24gY29tcGlsZUxvb3AoZm9ybSkge1xuICB2YXIgYmluZGluZ3MgPSAoZnVuY3Rpb24gbG9vcChuYW1lcywgdmFsdWVzLCB0b2tlbnMpIHtcbiAgICB2YXIgcmVjdXIgPSBsb29wO1xuICAgIHdoaWxlIChyZWN1ciA9PT0gbG9vcCkge1xuICAgICAgcmVjdXIgPSBpc0VtcHR5KHRva2VucykgP1xuICAgICAge1xuICAgICAgICBcIm5hbWVzXCI6IG5hbWVzLFxuICAgICAgICBcInZhbHVlc1wiOiB2YWx1ZXNcbiAgICAgIH0gOlxuICAgICAgKG5hbWVzID0gY29uaihuYW1lcywgZmlyc3QodG9rZW5zKSksIHZhbHVlcyA9IGNvbmoodmFsdWVzLCBzZWNvbmQodG9rZW5zKSksIHRva2VucyA9IHJlc3QocmVzdCh0b2tlbnMpKSwgbG9vcCk7XG4gICAgfTtcbiAgICByZXR1cm4gcmVjdXI7XG4gIH0pKFtdLCBbXSwgZmlyc3QoZm9ybSkpO1xuICB2YXIgbmFtZXMgPSAoYmluZGluZ3MgfHwgMClbXCJuYW1lc1wiXTtcbiAgdmFyIHZhbHVlcyA9IChiaW5kaW5ncyB8fCAwKVtcInZhbHVlc1wiXTtcbiAgdmFyIGJvZHkgPSByZXN0KGZvcm0pO1xuICByZXR1cm4gY29tcGlsZShjb25zKGNvbnMoc3ltYm9sKHZvaWQoMCksIFwiZm5cIiksIGNvbnMoc3ltYm9sKHZvaWQoMCksIFwibG9vcFwiKSwgY29ucyhuYW1lcywgY29tcGlsZVJlY3VyKG5hbWVzLCBib2R5KSkpKSwgbGlzdC5hcHBseShsaXN0LCB2YWx1ZXMpKSk7XG59O1xuZXhwb3J0cy5jb21waWxlTG9vcCA9IGNvbXBpbGVMb29wO1xuXG52YXIgcmViaW5kQmluZGluZ3MgPSBmdW5jdGlvbiByZWJpbmRCaW5kaW5ncyhuYW1lcywgdmFsdWVzKSB7XG4gIHJldHVybiAoZnVuY3Rpb24gbG9vcChyZXN1bHQsIG5hbWVzLCB2YWx1ZXMpIHtcbiAgICB2YXIgcmVjdXIgPSBsb29wO1xuICAgIHdoaWxlIChyZWN1ciA9PT0gbG9vcCkge1xuICAgICAgcmVjdXIgPSBpc0VtcHR5KG5hbWVzKSA/XG4gICAgICByZXZlcnNlKHJlc3VsdCkgOlxuICAgICAgKHJlc3VsdCA9IGNvbnMobGlzdChzeW1ib2wodm9pZCgwKSwgXCJzZXQhXCIpLCBmaXJzdChuYW1lcyksIGZpcnN0KHZhbHVlcykpLCByZXN1bHQpLCBuYW1lcyA9IHJlc3QobmFtZXMpLCB2YWx1ZXMgPSByZXN0KHZhbHVlcyksIGxvb3ApO1xuICAgIH07XG4gICAgcmV0dXJuIHJlY3VyO1xuICB9KShsaXN0KCksIG5hbWVzLCB2YWx1ZXMpO1xufTtcbmV4cG9ydHMucmViaW5kQmluZGluZ3MgPSByZWJpbmRCaW5kaW5ncztcblxudmFyIGV4cGFuZFJlY3VyID0gZnVuY3Rpb24gZXhwYW5kUmVjdXIobmFtZXMsIGJvZHkpIHtcbiAgcmV0dXJuIG1hcChmdW5jdGlvbihmb3JtKSB7XG4gICAgcmV0dXJuIGlzTGlzdChmb3JtKSA/XG4gICAgICBpc0VxdWFsKGZpcnN0KGZvcm0pLCBzeW1ib2wodm9pZCgwKSwgXCJyZWN1clwiKSkgP1xuICAgICAgICBsaXN0KHN5bWJvbCh2b2lkKDApLCBcInJhdypcIiksIGNvbXBpbGVHcm91cChjb25jYXQocmViaW5kQmluZGluZ3MobmFtZXMsIHJlc3QoZm9ybSkpLCBsaXN0KHN5bWJvbCh2b2lkKDApLCBcImxvb3BcIikpKSwgdHJ1ZSkpIDpcbiAgICAgICAgZXhwYW5kUmVjdXIobmFtZXMsIGZvcm0pIDpcbiAgICAgIGZvcm07XG4gIH0sIGJvZHkpO1xufTtcbmV4cG9ydHMuZXhwYW5kUmVjdXIgPSBleHBhbmRSZWN1cjtcblxudmFyIGNvbXBpbGVSZWN1ciA9IGZ1bmN0aW9uIGNvbXBpbGVSZWN1cihuYW1lcywgYm9keSkge1xuICByZXR1cm4gbGlzdChsaXN0KHN5bWJvbCh2b2lkKDApLCBcInJhdypcIiksIGNvbXBpbGVUZW1wbGF0ZShsaXN0KFwidmFyIHJlY3VyID0gbG9vcDtcXG53aGlsZSAocmVjdXIgPT09IGxvb3ApIHtcXG4gIHJlY3VyID0gfnt9XFxufVwiLCBjb21waWxlU3RhdGVtZW50cyhleHBhbmRSZWN1cihuYW1lcywgYm9keSkpKSkpLCBzeW1ib2wodm9pZCgwKSwgXCJyZWN1clwiKSk7XG59O1xuZXhwb3J0cy5jb21waWxlUmVjdXIgPSBjb21waWxlUmVjdXI7XG5cbnZhciBjb21waWxlUmF3ID0gZnVuY3Rpb24gY29tcGlsZVJhdyhmb3JtKSB7XG4gIHJldHVybiBmaXJzdChmb3JtKTtcbn07XG5leHBvcnRzLmNvbXBpbGVSYXcgPSBjb21waWxlUmF3O1xuXG5pbnN0YWxsU3BlY2lhbChzeW1ib2wodm9pZCgwKSwgXCJzZXQhXCIpLCBjb21waWxlU2V0KTtcblxuaW5zdGFsbFNwZWNpYWwoc3ltYm9sKHZvaWQoMCksIFwiZ2V0XCIpLCBjb21waWxlR2V0KTtcblxuaW5zdGFsbFNwZWNpYWwoc3ltYm9sKHZvaWQoMCksIFwiYWdldFwiKSwgY29tcGlsZUFnZXQpO1xuXG5pbnN0YWxsU3BlY2lhbChzeW1ib2wodm9pZCgwKSwgXCJkZWZcIiksIGNvbXBpbGVEZWYpO1xuXG5pbnN0YWxsU3BlY2lhbChzeW1ib2wodm9pZCgwKSwgXCJpZlwiKSwgY29tcGlsZUlmRWxzZSk7XG5cbmluc3RhbGxTcGVjaWFsKHN5bWJvbCh2b2lkKDApLCBcImRvXCIpLCBjb21waWxlRG8pO1xuXG5pbnN0YWxsU3BlY2lhbChzeW1ib2wodm9pZCgwKSwgXCJkbypcIiksIGNvbXBpbGVTdGF0ZW1lbnRzKTtcblxuaW5zdGFsbFNwZWNpYWwoc3ltYm9sKHZvaWQoMCksIFwiZm5cIiksIGNvbXBpbGVGbik7XG5cbmluc3RhbGxTcGVjaWFsKHN5bWJvbCh2b2lkKDApLCBcInRocm93XCIpLCBjb21waWxlVGhyb3cpO1xuXG5pbnN0YWxsU3BlY2lhbChzeW1ib2wodm9pZCgwKSwgXCJ2ZWN0b3JcIiksIGNvbXBpbGVWZWN0b3IpO1xuXG5pbnN0YWxsU3BlY2lhbChzeW1ib2wodm9pZCgwKSwgXCJ0cnlcIiksIGNvbXBpbGVUcnkpO1xuXG5pbnN0YWxsU3BlY2lhbChzeW1ib2wodm9pZCgwKSwgXCIuXCIpLCBjb21waWxlUHJvcGVydHkpO1xuXG5pbnN0YWxsU3BlY2lhbChzeW1ib2wodm9pZCgwKSwgXCJhcHBseVwiKSwgY29tcGlsZUFwcGx5KTtcblxuaW5zdGFsbFNwZWNpYWwoc3ltYm9sKHZvaWQoMCksIFwibmV3XCIpLCBjb21waWxlTmV3KTtcblxuaW5zdGFsbFNwZWNpYWwoc3ltYm9sKHZvaWQoMCksIFwiaW5zdGFuY2U/XCIpLCBjb21waWxlSW5zdGFuY2UpO1xuXG5pbnN0YWxsU3BlY2lhbChzeW1ib2wodm9pZCgwKSwgXCJub3RcIiksIGNvbXBpbGVOb3QpO1xuXG5pbnN0YWxsU3BlY2lhbChzeW1ib2wodm9pZCgwKSwgXCJsb29wXCIpLCBjb21waWxlTG9vcCk7XG5cbmluc3RhbGxTcGVjaWFsKHN5bWJvbCh2b2lkKDApLCBcInJhdypcIiksIGNvbXBpbGVSYXcpO1xuXG5pbnN0YWxsU3BlY2lhbChzeW1ib2wodm9pZCgwKSwgXCJjb21tZW50XCIpLCB3cml0ZUNvbW1lbnQpO1xuXG52YXIgY29tcGlsZVJlUGF0dGVybiA9IGZ1bmN0aW9uIGNvbXBpbGVSZVBhdHRlcm4oZm9ybSkge1xuICByZXR1cm4gXCJcIiArIGZvcm07XG59O1xuZXhwb3J0cy5jb21waWxlUmVQYXR0ZXJuID0gY29tcGlsZVJlUGF0dGVybjtcblxudmFyIGluc3RhbGxOYXRpdmUgPSBmdW5jdGlvbiBpbnN0YWxsTmF0aXZlKGFsaWFzLCBvcGVyYXRvciwgdmFsaWRhdG9yLCBmYWxsYmFjaykge1xuICByZXR1cm4gaW5zdGFsbFNwZWNpYWwoYWxpYXMsIGZ1bmN0aW9uKGZvcm0pIHtcbiAgICByZXR1cm4gaXNFbXB0eShmb3JtKSA/XG4gICAgICBmYWxsYmFjayA6XG4gICAgICByZWR1Y2UoZnVuY3Rpb24obGVmdCwgcmlnaHQpIHtcbiAgICAgICAgcmV0dXJuIGNvbXBpbGVUZW1wbGF0ZShsaXN0KFwifnt9IH57fSB+e31cIiwgbGVmdCwgbmFtZShvcGVyYXRvciksIHJpZ2h0KSk7XG4gICAgICB9LCBtYXAoZnVuY3Rpb24ob3BlcmFuZCkge1xuICAgICAgICByZXR1cm4gY29tcGlsZVRlbXBsYXRlKGxpc3QoaXNMaXN0KG9wZXJhbmQpID9cbiAgICAgICAgICBcIih+e30pXCIgOlxuICAgICAgICAgIFwifnt9XCIsIGNvbXBpbGUobWFjcm9leHBhbmQob3BlcmFuZCkpKSk7XG4gICAgICB9LCBmb3JtKSk7XG4gIH0sIHZhbGlkYXRvcik7XG59O1xuZXhwb3J0cy5pbnN0YWxsTmF0aXZlID0gaW5zdGFsbE5hdGl2ZTtcblxudmFyIGluc3RhbGxPcGVyYXRvciA9IGZ1bmN0aW9uIGluc3RhbGxPcGVyYXRvcihhbGlhcywgb3BlcmF0b3IpIHtcbiAgcmV0dXJuIGluc3RhbGxTcGVjaWFsKGFsaWFzLCBmdW5jdGlvbihmb3JtKSB7XG4gICAgcmV0dXJuIChmdW5jdGlvbiBsb29wKHJlc3VsdCwgbGVmdCwgcmlnaHQsIG9wZXJhbmRzKSB7XG4gICAgICB2YXIgcmVjdXIgPSBsb29wO1xuICAgICAgd2hpbGUgKHJlY3VyID09PSBsb29wKSB7XG4gICAgICAgIHJlY3VyID0gaXNFbXB0eShvcGVyYW5kcykgP1xuICAgICAgICBcIlwiICsgcmVzdWx0ICsgKGNvbXBpbGVUZW1wbGF0ZShsaXN0KFwifnt9IH57fSB+e31cIiwgY29tcGlsZShtYWNyb2V4cGFuZChsZWZ0KSksIG5hbWUob3BlcmF0b3IpLCBjb21waWxlKG1hY3JvZXhwYW5kKHJpZ2h0KSkpKSkgOlxuICAgICAgICAocmVzdWx0ID0gXCJcIiArIHJlc3VsdCArIChjb21waWxlVGVtcGxhdGUobGlzdChcIn57fSB+e30gfnt9ICYmIFwiLCBjb21waWxlKG1hY3JvZXhwYW5kKGxlZnQpKSwgbmFtZShvcGVyYXRvciksIGNvbXBpbGUobWFjcm9leHBhbmQocmlnaHQpKSkpKSwgbGVmdCA9IHJpZ2h0LCByaWdodCA9IGZpcnN0KG9wZXJhbmRzKSwgb3BlcmFuZHMgPSByZXN0KG9wZXJhbmRzKSwgbG9vcCk7XG4gICAgICB9O1xuICAgICAgcmV0dXJuIHJlY3VyO1xuICAgIH0pKFwiXCIsIGZpcnN0KGZvcm0pLCBzZWNvbmQoZm9ybSksIHJlc3QocmVzdChmb3JtKSkpO1xuICB9LCB2ZXJpZnlUd28pO1xufTtcbmV4cG9ydHMuaW5zdGFsbE9wZXJhdG9yID0gaW5zdGFsbE9wZXJhdG9yO1xuXG52YXIgY29tcGlsZXJFcnJvciA9IGZ1bmN0aW9uIGNvbXBpbGVyRXJyb3IoZm9ybSwgbWVzc2FnZSkge1xuICB2YXIgZXJyb3IgPSBFcnJvcihcIlwiICsgbWVzc2FnZSk7XG4gIGVycm9yLmxpbmUgPSAxO1xuICByZXR1cm4gKGZ1bmN0aW9uKCkgeyB0aHJvdyBlcnJvcjsgfSkoKTtcbn07XG5leHBvcnRzLmNvbXBpbGVyRXJyb3IgPSBjb21waWxlckVycm9yO1xuXG52YXIgdmVyaWZ5VHdvID0gZnVuY3Rpb24gdmVyaWZ5VHdvKGZvcm0pIHtcbiAgcmV0dXJuIChpc0VtcHR5KHJlc3QoZm9ybSkpKSB8fCAoaXNFbXB0eShyZXN0KHJlc3QoZm9ybSkpKSkgP1xuICAgIChmdW5jdGlvbigpIHsgdGhyb3cgY29tcGlsZXJFcnJvcihmb3JtLCBcIlwiICsgKGZpcnN0KGZvcm0pKSArIFwiIGZvcm0gcmVxdWlyZXMgYXQgbGVhc3QgdHdvIG9wZXJhbmRzXCIpOyB9KSgpIDpcbiAgICB2b2lkKDApO1xufTtcbmV4cG9ydHMudmVyaWZ5VHdvID0gdmVyaWZ5VHdvO1xuXG5pbnN0YWxsTmF0aXZlKHN5bWJvbCh2b2lkKDApLCBcIitcIiksIHN5bWJvbCh2b2lkKDApLCBcIitcIiksIHZvaWQoMCksIDApO1xuXG5pbnN0YWxsTmF0aXZlKHN5bWJvbCh2b2lkKDApLCBcIi1cIiksIHN5bWJvbCh2b2lkKDApLCBcIi1cIiksIHZvaWQoMCksIFwiTmFOXCIpO1xuXG5pbnN0YWxsTmF0aXZlKHN5bWJvbCh2b2lkKDApLCBcIipcIiksIHN5bWJvbCh2b2lkKDApLCBcIipcIiksIHZvaWQoMCksIDEpO1xuXG5pbnN0YWxsTmF0aXZlKHN5bWJvbCh2b2lkKDApLCBcIi9cIiksIHN5bWJvbCh2b2lkKDApLCBcIi9cIiksIHZlcmlmeVR3byk7XG5cbmluc3RhbGxOYXRpdmUoc3ltYm9sKHZvaWQoMCksIFwibW9kXCIpLCBzeW1ib2woXCIlXCIpLCB2ZXJpZnlUd28pO1xuXG5pbnN0YWxsTmF0aXZlKHN5bWJvbCh2b2lkKDApLCBcImFuZFwiKSwgc3ltYm9sKHZvaWQoMCksIFwiJiZcIikpO1xuXG5pbnN0YWxsTmF0aXZlKHN5bWJvbCh2b2lkKDApLCBcIm9yXCIpLCBzeW1ib2wodm9pZCgwKSwgXCJ8fFwiKSk7XG5cbmluc3RhbGxPcGVyYXRvcihzeW1ib2wodm9pZCgwKSwgXCJub3Q9XCIpLCBzeW1ib2wodm9pZCgwKSwgXCIhPVwiKSk7XG5cbmluc3RhbGxPcGVyYXRvcihzeW1ib2wodm9pZCgwKSwgXCI9PVwiKSwgc3ltYm9sKHZvaWQoMCksIFwiPT09XCIpKTtcblxuaW5zdGFsbE9wZXJhdG9yKHN5bWJvbCh2b2lkKDApLCBcImlkZW50aWNhbD9cIiksIHN5bWJvbCh2b2lkKDApLCBcIj09PVwiKSk7XG5cbmluc3RhbGxPcGVyYXRvcihzeW1ib2wodm9pZCgwKSwgXCI+XCIpLCBzeW1ib2wodm9pZCgwKSwgXCI+XCIpKTtcblxuaW5zdGFsbE9wZXJhdG9yKHN5bWJvbCh2b2lkKDApLCBcIj49XCIpLCBzeW1ib2wodm9pZCgwKSwgXCI+PVwiKSk7XG5cbmluc3RhbGxPcGVyYXRvcihzeW1ib2wodm9pZCgwKSwgXCI8XCIpLCBzeW1ib2wodm9pZCgwKSwgXCI8XCIpKTtcblxuaW5zdGFsbE9wZXJhdG9yKHN5bWJvbCh2b2lkKDApLCBcIjw9XCIpLCBzeW1ib2wodm9pZCgwKSwgXCI8PVwiKSk7XG5cbmluc3RhbGxOYXRpdmUoc3ltYm9sKHZvaWQoMCksIFwiYml0LWFuZFwiKSwgc3ltYm9sKHZvaWQoMCksIFwiJlwiKSwgdmVyaWZ5VHdvKTtcblxuaW5zdGFsbE5hdGl2ZShzeW1ib2wodm9pZCgwKSwgXCJiaXQtb3JcIiksIHN5bWJvbCh2b2lkKDApLCBcInxcIiksIHZlcmlmeVR3byk7XG5cbmluc3RhbGxOYXRpdmUoc3ltYm9sKHZvaWQoMCksIFwiYml0LXhvclwiKSwgc3ltYm9sKFwiXlwiKSk7XG5cbmluc3RhbGxOYXRpdmUoc3ltYm9sKHZvaWQoMCksIFwiYml0LW5vdFwiKSwgc3ltYm9sKFwiflwiKSwgdmVyaWZ5VHdvKTtcblxuaW5zdGFsbE5hdGl2ZShzeW1ib2wodm9pZCgwKSwgXCJiaXQtc2hpZnQtbGVmdFwiKSwgc3ltYm9sKHZvaWQoMCksIFwiPDxcIiksIHZlcmlmeVR3byk7XG5cbmluc3RhbGxOYXRpdmUoc3ltYm9sKHZvaWQoMCksIFwiYml0LXNoaWZ0LXJpZ2h0XCIpLCBzeW1ib2wodm9pZCgwKSwgXCI+PlwiKSwgdmVyaWZ5VHdvKTtcblxuaW5zdGFsbE5hdGl2ZShzeW1ib2wodm9pZCgwKSwgXCJiaXQtc2hpZnQtcmlnaHQtemVyby1maWxcIiksIHN5bWJvbCh2b2lkKDApLCBcIj4+PlwiKSwgdmVyaWZ5VHdvKTtcblxuaW5zdGFsbE1hY3JvKHN5bWJvbCh2b2lkKDApLCBcInN0clwiKSwgZnVuY3Rpb24gc3RyKCkge1xuICB2YXIgZm9ybXMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDApO1xuICByZXR1cm4gY29uY2F0KGxpc3Qoc3ltYm9sKHZvaWQoMCksIFwiK1wiKSwgXCJcIiksIGZvcm1zKTtcbn0pO1xuXG5pbnN0YWxsTWFjcm8oc3ltYm9sKHZvaWQoMCksIFwibGV0XCIpLCBmdW5jdGlvbiBsZXRNYWNybyhiaW5kaW5ncykge1xuICB2YXIgYm9keSA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gIHJldHVybiBjb25zKHN5bWJvbCh2b2lkKDApLCBcImRvXCIpLCBjb25jYXQoZGVmaW5lQmluZGluZ3MoYmluZGluZ3MpLCBib2R5KSk7XG59KTtcblxuaW5zdGFsbE1hY3JvKHN5bWJvbCh2b2lkKDApLCBcImNvbmRcIiksIGZ1bmN0aW9uIGNvbmQoKSB7XG4gIHZhciBjbGF1c2VzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKTtcbiAgcmV0dXJuICEoaXNFbXB0eShjbGF1c2VzKSkgP1xuICAgIGxpc3Qoc3ltYm9sKHZvaWQoMCksIFwiaWZcIiksIGZpcnN0KGNsYXVzZXMpLCBpc0VtcHR5KHJlc3QoY2xhdXNlcykpID9cbiAgICAgIChmdW5jdGlvbigpIHsgdGhyb3cgRXJyb3IoXCJjb25kIHJlcXVpcmVzIGFuIGV2ZW4gbnVtYmVyIG9mIGZvcm1zXCIpOyB9KSgpIDpcbiAgICAgIHNlY29uZChjbGF1c2VzKSwgY29ucyhzeW1ib2wodm9pZCgwKSwgXCJjb25kXCIpLCByZXN0KHJlc3QoY2xhdXNlcykpKSkgOlxuICAgIHZvaWQoMCk7XG59KTtcblxuaW5zdGFsbE1hY3JvKHN5bWJvbCh2b2lkKDApLCBcImRlZm5cIiksIGZ1bmN0aW9uIGRlZm4obmFtZSkge1xuICB2YXIgYm9keSA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gIHJldHVybiBsaXN0KHN5bWJvbCh2b2lkKDApLCBcImRlZlwiKSwgbmFtZSwgY29uY2F0KGxpc3Qoc3ltYm9sKHZvaWQoMCksIFwiZm5cIiksIG5hbWUpLCBib2R5KSk7XG59KTtcblxuaW5zdGFsbE1hY3JvKHN5bWJvbCh2b2lkKDApLCBcImRlZm4tXCIpLCBmdW5jdGlvbiBkZWZuKG5hbWUpIHtcbiAgdmFyIGJvZHkgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICByZXR1cm4gY29uY2F0KGxpc3Qoc3ltYm9sKHZvaWQoMCksIFwiZGVmblwiKSwgd2l0aE1ldGEobmFtZSwgY29uaih7XG4gICAgXCJwcml2YXRlXCI6IHRydWVcbiAgfSwgbWV0YShuYW1lKSkpKSwgYm9keSk7XG59KTtcblxuaW5zdGFsbE1hY3JvKHN5bWJvbCh2b2lkKDApLCBcImFzc2VydFwiKSwgZnVuY3Rpb24gYXNzZXJ0KHgsIG1lc3NhZ2UpIHtcbiAgdmFyIHRpdGxlID0gbWVzc2FnZSB8fCBcIlwiO1xuICB2YXIgYXNzZXJ0aW9uID0gcHJTdHIoeCk7XG4gIHZhciB1cmkgPSAoeCB8fCAwKVtcInVyaVwiXTtcbiAgdmFyIGZvcm0gPSBpc0xpc3QoeCkgP1xuICAgIHNlY29uZCh4KSA6XG4gICAgeDtcbiAgcmV0dXJuIGxpc3Qoc3ltYm9sKHZvaWQoMCksIFwiZG9cIiksIGxpc3Qoc3ltYm9sKHZvaWQoMCksIFwiaWZcIiksIGxpc3Qoc3ltYm9sKHZvaWQoMCksIFwiYW5kXCIpLCBsaXN0KHN5bWJvbCh2b2lkKDApLCBcIm5vdFwiKSwgbGlzdChzeW1ib2wodm9pZCgwKSwgXCJpZGVudGljYWw/XCIpLCBsaXN0KHN5bWJvbCh2b2lkKDApLCBcInR5cGVvZlwiKSwgc3ltYm9sKHZvaWQoMCksIFwiKip2ZXJib3NlKipcIikpLCBcInVuZGVmaW5lZFwiKSksIHN5bWJvbCh2b2lkKDApLCBcIioqdmVyYm9zZSoqXCIpKSwgbGlzdChzeW1ib2wodm9pZCgwKSwgXCIubG9nXCIpLCBzeW1ib2wodm9pZCgwKSwgXCJjb25zb2xlXCIpLCBcIkFzc2VydDpcIiwgYXNzZXJ0aW9uKSksIGxpc3Qoc3ltYm9sKHZvaWQoMCksIFwiaWZcIiksIGxpc3Qoc3ltYm9sKHZvaWQoMCksIFwibm90XCIpLCB4KSwgbGlzdChzeW1ib2wodm9pZCgwKSwgXCJ0aHJvd1wiKSwgbGlzdChzeW1ib2wodm9pZCgwKSwgXCJFcnJvci5cIiksIGxpc3Qoc3ltYm9sKHZvaWQoMCksIFwic3RyXCIpLCBcIkFzc2VydCBmYWlsZWQ6IFwiLCB0aXRsZSwgXCJcXG5cXG5Bc3NlcnRpb246XFxuXFxuXCIsIGFzc2VydGlvbiwgXCJcXG5cXG5BY3R1YWw6XFxuXFxuXCIsIGZvcm0sIFwiXFxuLS0tLS0tLS0tLS0tLS1cXG5cIiksIHVyaSkpKSk7XG59KTtcblxudmFyIHBhcnNlUmVmZXJlbmNlcyA9IGZ1bmN0aW9uIHBhcnNlUmVmZXJlbmNlcyhmb3Jtcykge1xuICByZXR1cm4gcmVkdWNlKGZ1bmN0aW9uKHJlZmVyZW5jZXMsIGZvcm0pIHtcbiAgICBpc1NlcShmb3JtKSA/XG4gICAgICAocmVmZXJlbmNlcyB8fCAwKVtuYW1lKGZpcnN0KGZvcm0pKV0gPSB2ZWMocmVzdChmb3JtKSkgOlxuICAgICAgdm9pZCgwKTtcbiAgICByZXR1cm4gcmVmZXJlbmNlcztcbiAgfSwge30sIGZvcm1zKTtcbn07XG5leHBvcnRzLnBhcnNlUmVmZXJlbmNlcyA9IHBhcnNlUmVmZXJlbmNlcztcblxudmFyIHBhcnNlUmVxdWlyZSA9IGZ1bmN0aW9uIHBhcnNlUmVxdWlyZShmb3JtKSB7XG4gIHZhciByZXF1aXJlbWVudCA9IGlzU3ltYm9sKGZvcm0pID9cbiAgICBbZm9ybV0gOlxuICAgIHZlYyhmb3JtKTtcbiAgdmFyIGlkID0gZmlyc3QocmVxdWlyZW1lbnQpO1xuICB2YXIgcGFyYW1zID0gZGljdGlvbmFyeS5hcHBseShkaWN0aW9uYXJ5LCByZXN0KHJlcXVpcmVtZW50KSk7XG4gIHZhciBpbXBvcnRzID0gcmVkdWNlKGZ1bmN0aW9uKGltcG9ydHMsIG5hbWUpIHtcbiAgICAoaW1wb3J0cyB8fCAwKVtuYW1lXSA9ICgoaW1wb3J0cyB8fCAwKVtuYW1lXSkgfHwgbmFtZTtcbiAgICByZXR1cm4gaW1wb3J0cztcbiAgfSwgY29uaih7fSwgKHBhcmFtcyB8fCAwKVtcIuqeiXJlbmFtZVwiXSksIChwYXJhbXMgfHwgMClbXCLqnolyZWZlclwiXSk7XG4gIHJldHVybiBjb25qKHtcbiAgICBcImlkXCI6IGlkLFxuICAgIFwiaW1wb3J0c1wiOiBpbXBvcnRzXG4gIH0sIHBhcmFtcyk7XG59O1xuZXhwb3J0cy5wYXJzZVJlcXVpcmUgPSBwYXJzZVJlcXVpcmU7XG5cbnZhciBhbmFseXplTnMgPSBmdW5jdGlvbiBhbmFseXplTnMoZm9ybSkge1xuICB2YXIgaWQgPSBmaXJzdChmb3JtKTtcbiAgdmFyIHBhcmFtcyA9IHJlc3QoZm9ybSk7XG4gIHZhciBkb2MgPSBpc1N0cmluZyhmaXJzdChwYXJhbXMpKSA/XG4gICAgZmlyc3QocGFyYW1zKSA6XG4gICAgdm9pZCgwKTtcbiAgdmFyIHJlZmVyZW5jZXMgPSBwYXJzZVJlZmVyZW5jZXMoZG9jID9cbiAgICByZXN0KHBhcmFtcykgOlxuICAgIHBhcmFtcyk7XG4gIHJldHVybiB3aXRoTWV0YShmb3JtLCB7XG4gICAgXCJpZFwiOiBpZCxcbiAgICBcImRvY1wiOiBkb2MsXG4gICAgXCJyZXF1aXJlXCI6IChyZWZlcmVuY2VzIHx8IDApW1wicmVxdWlyZVwiXSA/XG4gICAgICBtYXAocGFyc2VSZXF1aXJlLCAocmVmZXJlbmNlcyB8fCAwKVtcInJlcXVpcmVcIl0pIDpcbiAgICAgIHZvaWQoMClcbiAgfSk7XG59O1xuZXhwb3J0cy5hbmFseXplTnMgPSBhbmFseXplTnM7XG5cbnZhciBpZFRvTnMgPSBmdW5jdGlvbiBpZFRvTnMoaWQpIHtcbiAgcmV0dXJuIHN5bWJvbCh2b2lkKDApLCBqb2luKFwiKlwiLCBzcGxpdChcIlwiICsgaWQsIFwiLlwiKSkpO1xufTtcbmV4cG9ydHMuaWRUb05zID0gaWRUb05zO1xuXG52YXIgbmFtZVRvRmllbGQgPSBmdW5jdGlvbiBuYW1lVG9GaWVsZChuYW1lKSB7XG4gIHJldHVybiBzeW1ib2wodm9pZCgwKSwgXCJcIiArIFwiLVwiICsgbmFtZSk7XG59O1xuZXhwb3J0cy5uYW1lVG9GaWVsZCA9IG5hbWVUb0ZpZWxkO1xuXG52YXIgY29tcGlsZUltcG9ydCA9IGZ1bmN0aW9uIGNvbXBpbGVJbXBvcnQobW9kdWxlKSB7XG4gIHJldHVybiBmdW5jdGlvbihmb3JtKSB7XG4gICAgcmV0dXJuIGxpc3Qoc3ltYm9sKHZvaWQoMCksIFwiZGVmXCIpLCBzZWNvbmQoZm9ybSksIGxpc3Qoc3ltYm9sKHZvaWQoMCksIFwiLlwiKSwgbW9kdWxlLCBuYW1lVG9GaWVsZChmaXJzdChmb3JtKSkpKTtcbiAgfTtcbn07XG5leHBvcnRzLmNvbXBpbGVJbXBvcnQgPSBjb21waWxlSW1wb3J0O1xuXG52YXIgY29tcGlsZVJlcXVpcmUgPSBmdW5jdGlvbiBjb21waWxlUmVxdWlyZShyZXF1aXJlcikge1xuICByZXR1cm4gZnVuY3Rpb24oZm9ybSkge1xuICAgIHZhciBpZCA9IChmb3JtIHx8IDApW1wiaWRcIl07XG4gICAgdmFyIHJlcXVpcmVtZW50ID0gaWRUb05zKCgoZm9ybSB8fCAwKVtcIuqeiWFzXCJdKSB8fCBpZCk7XG4gICAgdmFyIHBhdGggPSByZXNvbHZlKHJlcXVpcmVyLCBpZCk7XG4gICAgdmFyIGltcG9ydHMgPSAoZm9ybSB8fCAwKVtcImltcG9ydHNcIl07XG4gICAgcmV0dXJuIGNvbmNhdChbc3ltYm9sKHZvaWQoMCksIFwiZG8qXCIpLCBsaXN0KHN5bWJvbCh2b2lkKDApLCBcImRlZlwiKSwgcmVxdWlyZW1lbnQsIGxpc3Qoc3ltYm9sKHZvaWQoMCksIFwicmVxdWlyZVwiKSwgcGF0aCkpXSwgaW1wb3J0cyA/XG4gICAgICBtYXAoY29tcGlsZUltcG9ydChyZXF1aXJlbWVudCksIGltcG9ydHMpIDpcbiAgICAgIHZvaWQoMCkpO1xuICB9O1xufTtcbmV4cG9ydHMuY29tcGlsZVJlcXVpcmUgPSBjb21waWxlUmVxdWlyZTtcblxudmFyIHJlc29sdmUgPSBmdW5jdGlvbiByZXNvbHZlKGZyb20sIHRvKSB7XG4gIHZhciByZXF1aXJlciA9IHNwbGl0KFwiXCIgKyBmcm9tLCBcIi5cIik7XG4gIHZhciByZXF1aXJlbWVudCA9IHNwbGl0KFwiXCIgKyB0bywgXCIuXCIpO1xuICB2YXIgaXNSZWxhdGl2ZSA9ICghKFwiXCIgKyBmcm9tID09PSBcIlwiICsgdG8pKSAmJiAoZmlyc3QocmVxdWlyZXIpID09PSBmaXJzdChyZXF1aXJlbWVudCkpO1xuICByZXR1cm4gaXNSZWxhdGl2ZSA/XG4gICAgKGZ1bmN0aW9uIGxvb3AoZnJvbSwgdG8pIHtcbiAgICAgIHZhciByZWN1ciA9IGxvb3A7XG4gICAgICB3aGlsZSAocmVjdXIgPT09IGxvb3ApIHtcbiAgICAgICAgcmVjdXIgPSBmaXJzdChmcm9tKSA9PT0gZmlyc3QodG8pID9cbiAgICAgICAgKGZyb20gPSByZXN0KGZyb20pLCB0byA9IHJlc3QodG8pLCBsb29wKSA6XG4gICAgICAgIGpvaW4oXCIvXCIsIGNvbmNhdChbXCIuXCJdLCByZXBlYXQoZGVjKGNvdW50KGZyb20pKSwgXCIuLlwiKSwgdG8pKTtcbiAgICAgIH07XG4gICAgICByZXR1cm4gcmVjdXI7XG4gICAgfSkocmVxdWlyZXIsIHJlcXVpcmVtZW50KSA6XG4gICAgam9pbihcIi9cIiwgcmVxdWlyZW1lbnQpO1xufTtcbmV4cG9ydHMucmVzb2x2ZSA9IHJlc29sdmU7XG5cbnZhciBjb21waWxlTnMgPSBmdW5jdGlvbiBjb21waWxlTnMoKSB7XG4gIHZhciBmb3JtID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKTtcbiAgcmV0dXJuIChmdW5jdGlvbigpIHtcbiAgICB2YXIgbWV0YWRhdGEgPSBtZXRhKGFuYWx5emVOcyhmb3JtKSk7XG4gICAgdmFyIGlkID0gXCJcIiArICgobWV0YWRhdGEgfHwgMClbXCJpZFwiXSk7XG4gICAgdmFyIGRvYyA9IChtZXRhZGF0YSB8fCAwKVtcImRvY1wiXTtcbiAgICB2YXIgcmVxdWlyZW1lbnRzID0gKG1ldGFkYXRhIHx8IDApW1wicmVxdWlyZVwiXTtcbiAgICB2YXIgbnMgPSBkb2MgP1xuICAgICAge1xuICAgICAgICBcImlkXCI6IGlkLFxuICAgICAgICBcImRvY1wiOiBkb2NcbiAgICAgIH0gOlxuICAgICAge1xuICAgICAgICBcImlkXCI6IGlkXG4gICAgICB9O1xuICAgIHJldHVybiBjb25jYXQoW3N5bWJvbCh2b2lkKDApLCBcImRvKlwiKSwgbGlzdChzeW1ib2wodm9pZCgwKSwgXCJkZWZcIiksIHN5bWJvbCh2b2lkKDApLCBcIipucypcIiksIG5zKV0sIHJlcXVpcmVtZW50cyA/XG4gICAgICBtYXAoY29tcGlsZVJlcXVpcmUoaWQpLCByZXF1aXJlbWVudHMpIDpcbiAgICAgIHZvaWQoMCkpO1xuICB9KSgpO1xufTtcbmV4cG9ydHMuY29tcGlsZU5zID0gY29tcGlsZU5zO1xuXG5pbnN0YWxsTWFjcm8oc3ltYm9sKHZvaWQoMCksIFwibnNcIiksIGNvbXBpbGVOcyk7XG5cbmluc3RhbGxNYWNybyhzeW1ib2wodm9pZCgwKSwgXCJwcmludFwiKSwgZnVuY3Rpb24oKSB7XG4gIHZhciBtb3JlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKTtcbiAgXCJQcmludHMgdGhlIG9iamVjdChzKSB0byB0aGUgb3V0cHV0IGZvciBodW1hbiBjb25zdW1wdGlvbi5cIjtcbiAgcmV0dXJuIGNvbmNhdChsaXN0KHN5bWJvbCh2b2lkKDApLCBcIi5sb2dcIiksIHN5bWJvbCh2b2lkKDApLCBcImNvbnNvbGVcIikpLCBtb3JlKTtcbn0pIiwidmFyIF9uc18gPSB7XG4gIFwiaWRcIjogXCJ3aXNwLmFzdFwiXG59O1xudmFyIHdpc3Bfc2VxdWVuY2UgPSByZXF1aXJlKFwiLi9zZXF1ZW5jZVwiKTtcbnZhciBpc0xpc3QgPSB3aXNwX3NlcXVlbmNlLmlzTGlzdDtcbnZhciBpc1NlcXVlbnRpYWwgPSB3aXNwX3NlcXVlbmNlLmlzU2VxdWVudGlhbDtcbnZhciBmaXJzdCA9IHdpc3Bfc2VxdWVuY2UuZmlyc3Q7XG52YXIgc2Vjb25kID0gd2lzcF9zZXF1ZW5jZS5zZWNvbmQ7XG52YXIgY291bnQgPSB3aXNwX3NlcXVlbmNlLmNvdW50O1xudmFyIGxhc3QgPSB3aXNwX3NlcXVlbmNlLmxhc3Q7XG52YXIgbWFwID0gd2lzcF9zZXF1ZW5jZS5tYXA7XG52YXIgdmVjID0gd2lzcF9zZXF1ZW5jZS52ZWM7O1xudmFyIHdpc3Bfc3RyaW5nID0gcmVxdWlyZShcIi4vc3RyaW5nXCIpO1xudmFyIHNwbGl0ID0gd2lzcF9zdHJpbmcuc3BsaXQ7XG52YXIgam9pbiA9IHdpc3Bfc3RyaW5nLmpvaW47O1xudmFyIHdpc3BfcnVudGltZSA9IHJlcXVpcmUoXCIuL3J1bnRpbWVcIik7XG52YXIgaXNOaWwgPSB3aXNwX3J1bnRpbWUuaXNOaWw7XG52YXIgaXNWZWN0b3IgPSB3aXNwX3J1bnRpbWUuaXNWZWN0b3I7XG52YXIgaXNOdW1iZXIgPSB3aXNwX3J1bnRpbWUuaXNOdW1iZXI7XG52YXIgaXNTdHJpbmcgPSB3aXNwX3J1bnRpbWUuaXNTdHJpbmc7XG52YXIgaXNCb29sZWFuID0gd2lzcF9ydW50aW1lLmlzQm9vbGVhbjtcbnZhciBpc09iamVjdCA9IHdpc3BfcnVudGltZS5pc09iamVjdDtcbnZhciBpc0RhdGUgPSB3aXNwX3J1bnRpbWUuaXNEYXRlO1xudmFyIGlzUmVQYXR0ZXJuID0gd2lzcF9ydW50aW1lLmlzUmVQYXR0ZXJuO1xudmFyIGlzRGljdGlvbmFyeSA9IHdpc3BfcnVudGltZS5pc0RpY3Rpb25hcnk7XG52YXIgc3RyID0gd2lzcF9ydW50aW1lLnN0cjtcbnZhciBpbmMgPSB3aXNwX3J1bnRpbWUuaW5jO1xudmFyIHN1YnMgPSB3aXNwX3J1bnRpbWUuc3VicztcbnZhciBpc0VxdWFsID0gd2lzcF9ydW50aW1lLmlzRXF1YWw7OztcblxudmFyIHdpdGhNZXRhID0gZnVuY3Rpb24gd2l0aE1ldGEodmFsdWUsIG1ldGFkYXRhKSB7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh2YWx1ZSwgXCJtZXRhZGF0YVwiLCB7XG4gICAgXCJ2YWx1ZVwiOiBtZXRhZGF0YSxcbiAgICBcImNvbmZpZ3VyYWJsZVwiOiB0cnVlXG4gIH0pO1xuICByZXR1cm4gdmFsdWU7XG59O1xuZXhwb3J0cy53aXRoTWV0YSA9IHdpdGhNZXRhO1xuXG52YXIgbWV0YSA9IGZ1bmN0aW9uIG1ldGEodmFsdWUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0KHZhbHVlKSA/XG4gICAgdmFsdWUubWV0YWRhdGEgOlxuICAgIHZvaWQoMCk7XG59O1xuZXhwb3J0cy5tZXRhID0gbWV0YTtcblxudmFyIF9fbnNTZXBhcmF0b3JfXyA9IFwi4oGEXCI7XG5leHBvcnRzLl9fbnNTZXBhcmF0b3JfXyA9IF9fbnNTZXBhcmF0b3JfXztcblxudmFyIFN5bWJvbCA9IGZ1bmN0aW9uIFN5bWJvbChuYW1lc3BhY2UsIG5hbWUpIHtcbiAgdGhpcy5uYW1lc3BhY2UgPSBuYW1lc3BhY2U7XG4gIHRoaXMubmFtZSA9IG5hbWU7XG4gIHJldHVybiB0aGlzO1xufTtcblxuU3ltYm9sLnR5cGUgPSBcIndpc3Auc3ltYm9sXCI7XG5cblN5bWJvbC5wcm90b3R5cGUudHlwZSA9IFN5bWJvbC50eXBlO1xuXG5TeW1ib2wucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gIHZhciBucyA9IG5hbWVzcGFjZSh0aGlzKTtcbiAgcmV0dXJuIG5zID9cbiAgICBcIlwiICsgbnMgKyBcIi9cIiArIChuYW1lKHRoaXMpKSA6XG4gICAgXCJcIiArIChuYW1lKHRoaXMpKTtcbn07XG5cbnZhciBzeW1ib2wgPSBmdW5jdGlvbiBzeW1ib2wobnMsIGlkKSB7XG4gIHJldHVybiBpc1N5bWJvbChucykgP1xuICAgIG5zIDpcbiAgaXNLZXl3b3JkKG5zKSA/XG4gICAgbmV3IFN5bWJvbChuYW1lc3BhY2UobnMpLCBuYW1lKG5zKSkgOlxuICBpc05pbChpZCkgP1xuICAgIG5ldyBTeW1ib2wodm9pZCgwKSwgbnMpIDpcbiAgXCJlbHNlXCIgP1xuICAgIG5ldyBTeW1ib2wobnMsIGlkKSA6XG4gICAgdm9pZCgwKTtcbn07XG5leHBvcnRzLnN5bWJvbCA9IHN5bWJvbDtcblxudmFyIGlzU3ltYm9sID0gZnVuY3Rpb24gaXNTeW1ib2woeCkge1xuICByZXR1cm4geCAmJiAoU3ltYm9sLnR5cGUgPT09IHgudHlwZSk7XG59O1xuZXhwb3J0cy5pc1N5bWJvbCA9IGlzU3ltYm9sO1xuXG52YXIgaXNLZXl3b3JkID0gZnVuY3Rpb24gaXNLZXl3b3JkKHgpIHtcbiAgcmV0dXJuIChpc1N0cmluZyh4KSkgJiYgKGNvdW50KHgpID4gMSkgJiYgKGZpcnN0KHgpID09PSBcIuqeiVwiKTtcbn07XG5leHBvcnRzLmlzS2V5d29yZCA9IGlzS2V5d29yZDtcblxudmFyIGtleXdvcmQgPSBmdW5jdGlvbiBrZXl3b3JkKG5zLCBpZCkge1xuICByZXR1cm4gaXNLZXl3b3JkKG5zKSA/XG4gICAgbnMgOlxuICBpc1N5bWJvbChucykgP1xuICAgIFwiXCIgKyBcIuqeiVwiICsgKG5hbWUobnMpKSA6XG4gIGlzTmlsKGlkKSA/XG4gICAgXCJcIiArIFwi6p6JXCIgKyBucyA6XG4gIGlzTmlsKG5zKSA/XG4gICAgXCJcIiArIFwi6p6JXCIgKyBpZCA6XG4gIFwiZWxzZVwiID9cbiAgICBcIlwiICsgXCLqnolcIiArIG5zICsgX19uc1NlcGFyYXRvcl9fICsgaWQgOlxuICAgIHZvaWQoMCk7XG59O1xuZXhwb3J0cy5rZXl3b3JkID0ga2V5d29yZDtcblxudmFyIGtleXdvcmROYW1lID0gZnVuY3Rpb24ga2V5d29yZE5hbWUodmFsdWUpIHtcbiAgcmV0dXJuIGxhc3Qoc3BsaXQoc3Vicyh2YWx1ZSwgMSksIF9fbnNTZXBhcmF0b3JfXykpO1xufTtcblxudmFyIG5hbWUgPSBmdW5jdGlvbiBuYW1lKHZhbHVlKSB7XG4gIHJldHVybiBpc1N5bWJvbCh2YWx1ZSkgP1xuICAgIHZhbHVlLm5hbWUgOlxuICBpc0tleXdvcmQodmFsdWUpID9cbiAgICBrZXl3b3JkTmFtZSh2YWx1ZSkgOlxuICBpc1N0cmluZyh2YWx1ZSkgP1xuICAgIHZhbHVlIDpcbiAgXCJlbHNlXCIgP1xuICAgIChmdW5jdGlvbigpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlwiICsgXCJEb2Vzbid0IHN1cHBvcnQgbmFtZTogXCIgKyB2YWx1ZSk7IH0pKCkgOlxuICAgIHZvaWQoMCk7XG59O1xuZXhwb3J0cy5uYW1lID0gbmFtZTtcblxudmFyIGtleXdvcmROYW1lc3BhY2UgPSBmdW5jdGlvbiBrZXl3b3JkTmFtZXNwYWNlKHgpIHtcbiAgdmFyIHBhcnRzID0gc3BsaXQoc3Vicyh4LCAxKSwgX19uc1NlcGFyYXRvcl9fKTtcbiAgcmV0dXJuIGNvdW50KHBhcnRzKSA+IDEgP1xuICAgIChwYXJ0cyB8fCAwKVswXSA6XG4gICAgdm9pZCgwKTtcbn07XG5cbnZhciBuYW1lc3BhY2UgPSBmdW5jdGlvbiBuYW1lc3BhY2UoeCkge1xuICByZXR1cm4gaXNTeW1ib2woeCkgP1xuICAgIHgubmFtZXNwYWNlIDpcbiAgaXNLZXl3b3JkKHgpID9cbiAgICBrZXl3b3JkTmFtZXNwYWNlKHgpIDpcbiAgXCJlbHNlXCIgP1xuICAgIChmdW5jdGlvbigpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlwiICsgXCJEb2Vzbid0IHN1cHBvcnRzIG5hbWVzcGFjZTogXCIgKyB4KTsgfSkoKSA6XG4gICAgdm9pZCgwKTtcbn07XG5leHBvcnRzLm5hbWVzcGFjZSA9IG5hbWVzcGFjZTtcblxudmFyIGdlbnN5bSA9IGZ1bmN0aW9uIGdlbnN5bShwcmVmaXgpIHtcbiAgcmV0dXJuIHN5bWJvbChcIlwiICsgKGlzTmlsKHByZWZpeCkgP1xuICAgIFwiR19fXCIgOlxuICAgIHByZWZpeCkgKyAoZ2Vuc3ltLmJhc2UgPSBnZW5zeW0uYmFzZSArIDEpKTtcbn07XG5leHBvcnRzLmdlbnN5bSA9IGdlbnN5bTtcblxuZ2Vuc3ltLmJhc2UgPSAwO1xuXG52YXIgaXNVbnF1b3RlID0gZnVuY3Rpb24gaXNVbnF1b3RlKGZvcm0pIHtcbiAgcmV0dXJuIChpc0xpc3QoZm9ybSkpICYmIChpc0VxdWFsKGZpcnN0KGZvcm0pLCBzeW1ib2wodm9pZCgwKSwgXCJ1bnF1b3RlXCIpKSk7XG59O1xuZXhwb3J0cy5pc1VucXVvdGUgPSBpc1VucXVvdGU7XG5cbnZhciBpc1VucXVvdGVTcGxpY2luZyA9IGZ1bmN0aW9uIGlzVW5xdW90ZVNwbGljaW5nKGZvcm0pIHtcbiAgcmV0dXJuIChpc0xpc3QoZm9ybSkpICYmIChpc0VxdWFsKGZpcnN0KGZvcm0pLCBzeW1ib2wodm9pZCgwKSwgXCJ1bnF1b3RlLXNwbGljaW5nXCIpKSk7XG59O1xuZXhwb3J0cy5pc1VucXVvdGVTcGxpY2luZyA9IGlzVW5xdW90ZVNwbGljaW5nO1xuXG52YXIgaXNRdW90ZSA9IGZ1bmN0aW9uIGlzUXVvdGUoZm9ybSkge1xuICByZXR1cm4gKGlzTGlzdChmb3JtKSkgJiYgKGlzRXF1YWwoZmlyc3QoZm9ybSksIHN5bWJvbCh2b2lkKDApLCBcInF1b3RlXCIpKSk7XG59O1xuZXhwb3J0cy5pc1F1b3RlID0gaXNRdW90ZTtcblxudmFyIGlzU3ludGF4UXVvdGUgPSBmdW5jdGlvbiBpc1N5bnRheFF1b3RlKGZvcm0pIHtcbiAgcmV0dXJuIChpc0xpc3QoZm9ybSkpICYmIChpc0VxdWFsKGZpcnN0KGZvcm0pLCBzeW1ib2wodm9pZCgwKSwgXCJzeW50YXgtcXVvdGVcIikpKTtcbn07XG5leHBvcnRzLmlzU3ludGF4UXVvdGUgPSBpc1N5bnRheFF1b3RlO1xuXG52YXIgbm9ybWFsaXplID0gZnVuY3Rpb24gbm9ybWFsaXplKG4sIGxlbikge1xuICByZXR1cm4gKGZ1bmN0aW9uIGxvb3AobnMpIHtcbiAgICB2YXIgcmVjdXIgPSBsb29wO1xuICAgIHdoaWxlIChyZWN1ciA9PT0gbG9vcCkge1xuICAgICAgcmVjdXIgPSBjb3VudChucykgPCBsZW4gP1xuICAgICAgKG5zID0gXCJcIiArIFwiMFwiICsgbnMsIGxvb3ApIDpcbiAgICAgIG5zO1xuICAgIH07XG4gICAgcmV0dXJuIHJlY3VyO1xuICB9KShcIlwiICsgbik7XG59O1xuXG52YXIgcXVvdGVTdHJpbmcgPSBmdW5jdGlvbiBxdW90ZVN0cmluZyhzKSB7XG4gIHMgPSBqb2luKFwiXFxcXFxcXCJcIiwgc3BsaXQocywgXCJcXFwiXCIpKTtcbiAgcyA9IGpvaW4oXCJcXFxcXFxcXFwiLCBzcGxpdChzLCBcIlxcXFxcIikpO1xuICBzID0gam9pbihcIlxcXFxiXCIsIHNwbGl0KHMsIFwiXGJcIikpO1xuICBzID0gam9pbihcIlxcXFxmXCIsIHNwbGl0KHMsIFwiXGZcIikpO1xuICBzID0gam9pbihcIlxcXFxuXCIsIHNwbGl0KHMsIFwiXFxuXCIpKTtcbiAgcyA9IGpvaW4oXCJcXFxcclwiLCBzcGxpdChzLCBcIlxcclwiKSk7XG4gIHMgPSBqb2luKFwiXFxcXHRcIiwgc3BsaXQocywgXCJcXHRcIikpO1xuICByZXR1cm4gXCJcIiArIFwiXFxcIlwiICsgcyArIFwiXFxcIlwiO1xufTtcbmV4cG9ydHMucXVvdGVTdHJpbmcgPSBxdW90ZVN0cmluZztcblxudmFyIHByU3RyID0gZnVuY3Rpb24gcHJTdHIoeCkge1xuICByZXR1cm4gaXNOaWwoeCkgP1xuICAgIFwibmlsXCIgOlxuICBpc0tleXdvcmQoeCkgP1xuICAgIG5hbWVzcGFjZSh4KSA/XG4gICAgICBcIlwiICsgXCI6XCIgKyAobmFtZXNwYWNlKHgpKSArIFwiL1wiICsgKG5hbWUoeCkpIDpcbiAgICAgIFwiXCIgKyBcIjpcIiArIChuYW1lKHgpKSA6XG4gIGlzU3RyaW5nKHgpID9cbiAgICBxdW90ZVN0cmluZyh4KSA6XG4gIGlzRGF0ZSh4KSA/XG4gICAgXCJcIiArIFwiI2luc3QgXFxcIlwiICsgKHguZ2V0VVRDRnVsbFllYXIoKSkgKyBcIi1cIiArIChub3JtYWxpemUoaW5jKHguZ2V0VVRDTW9udGgoKSksIDIpKSArIFwiLVwiICsgKG5vcm1hbGl6ZSh4LmdldFVUQ0RhdGUoKSwgMikpICsgXCJUXCIgKyAobm9ybWFsaXplKHguZ2V0VVRDSG91cnMoKSwgMikpICsgXCI6XCIgKyAobm9ybWFsaXplKHguZ2V0VVRDTWludXRlcygpLCAyKSkgKyBcIjpcIiArIChub3JtYWxpemUoeC5nZXRVVENTZWNvbmRzKCksIDIpKSArIFwiLlwiICsgKG5vcm1hbGl6ZSh4LmdldFVUQ01pbGxpc2Vjb25kcygpLCAzKSkgKyBcIi1cIiArIFwiMDA6MDBcXFwiXCIgOlxuICBpc1ZlY3Rvcih4KSA/XG4gICAgXCJcIiArIFwiW1wiICsgKGpvaW4oXCIgXCIsIG1hcChwclN0ciwgdmVjKHgpKSkpICsgXCJdXCIgOlxuICBpc0RpY3Rpb25hcnkoeCkgP1xuICAgIFwiXCIgKyBcIntcIiArIChqb2luKFwiLCBcIiwgbWFwKGZ1bmN0aW9uKHBhaXIpIHtcbiAgICAgIHJldHVybiBcIlwiICsgKHByU3RyKGZpcnN0KHBhaXIpKSkgKyBcIiBcIiArIChwclN0cihzZWNvbmQocGFpcikpKTtcbiAgICB9LCB4KSkpICsgXCJ9XCIgOlxuICBpc1NlcXVlbnRpYWwoeCkgP1xuICAgIFwiXCIgKyBcIihcIiArIChqb2luKFwiIFwiLCBtYXAocHJTdHIsIHZlYyh4KSkpKSArIFwiKVwiIDpcbiAgaXNSZVBhdHRlcm4oeCkgP1xuICAgIFwiXCIgKyBcIiNcXFwiXCIgKyAoam9pbihcIlxcXFwvXCIsIHNwbGl0KHguc291cmNlLCBcIi9cIikpKSArIFwiXFxcIlwiIDpcbiAgXCJlbHNlXCIgP1xuICAgIFwiXCIgKyB4IDpcbiAgICB2b2lkKDApO1xufTtcbmV4cG9ydHMucHJTdHIgPSBwclN0ciIsInZhciBfbnNfID0ge1xuICBcImlkXCI6IFwid2lzcC5zdHJpbmdcIlxufTtcbnZhciB3aXNwX3J1bnRpbWUgPSByZXF1aXJlKFwiLi9ydW50aW1lXCIpO1xudmFyIHN0ciA9IHdpc3BfcnVudGltZS5zdHI7XG52YXIgc3VicyA9IHdpc3BfcnVudGltZS5zdWJzO1xudmFyIHJlTWF0Y2hlcyA9IHdpc3BfcnVudGltZS5yZU1hdGNoZXM7XG52YXIgaXNOaWwgPSB3aXNwX3J1bnRpbWUuaXNOaWw7XG52YXIgaXNTdHJpbmcgPSB3aXNwX3J1bnRpbWUuaXNTdHJpbmc7O1xudmFyIHdpc3Bfc2VxdWVuY2UgPSByZXF1aXJlKFwiLi9zZXF1ZW5jZVwiKTtcbnZhciB2ZWMgPSB3aXNwX3NlcXVlbmNlLnZlYztcbnZhciBpc0VtcHR5ID0gd2lzcF9zZXF1ZW5jZS5pc0VtcHR5Ozs7XG5cbnZhciBzcGxpdCA9IGZ1bmN0aW9uIHNwbGl0KHN0cmluZywgcGF0dGVybiwgbGltaXQpIHtcbiAgcmV0dXJuIHN0cmluZy5zcGxpdChwYXR0ZXJuLCBsaW1pdCk7XG59O1xuZXhwb3J0cy5zcGxpdCA9IHNwbGl0O1xuXG52YXIgam9pbiA9IGZ1bmN0aW9uIGpvaW4oc2VwYXJhdG9yLCBjb2xsKSB7XG4gIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgIGNhc2UgMTpcbiAgICAgIHZhciBjb2xsID0gc2VwYXJhdG9yO1xuICAgICAgcmV0dXJuIHN0ci5hcHBseShzdHIsIHZlYyhjb2xsKSk7XG4gICAgY2FzZSAyOlxuICAgICAgcmV0dXJuIHZlYyhjb2xsKS5qb2luKHNlcGFyYXRvcik7XG5cbiAgICBkZWZhdWx0OlxuICAgICAgKGZ1bmN0aW9uKCkgeyB0aHJvdyBFcnJvcihcIkludmFsaWQgYXJpdHlcIik7IH0pKClcbiAgfTtcbiAgcmV0dXJuIHZvaWQoMCk7XG59O1xuZXhwb3J0cy5qb2luID0gam9pbjtcblxudmFyIHVwcGVyQ2FzZSA9IGZ1bmN0aW9uIHVwcGVyQ2FzZShzdHJpbmcpIHtcbiAgcmV0dXJuIHN0cmluZy50b1VwcGVyQ2FzZSgpO1xufTtcbmV4cG9ydHMudXBwZXJDYXNlID0gdXBwZXJDYXNlO1xuXG52YXIgdXBwZXJDYXNlID0gZnVuY3Rpb24gdXBwZXJDYXNlKHN0cmluZykge1xuICByZXR1cm4gc3RyaW5nLnRvVXBwZXJDYXNlKCk7XG59O1xuZXhwb3J0cy51cHBlckNhc2UgPSB1cHBlckNhc2U7XG5cbnZhciBsb3dlckNhc2UgPSBmdW5jdGlvbiBsb3dlckNhc2Uoc3RyaW5nKSB7XG4gIHJldHVybiBzdHJpbmcudG9Mb3dlckNhc2UoKTtcbn07XG5leHBvcnRzLmxvd2VyQ2FzZSA9IGxvd2VyQ2FzZTtcblxudmFyIGNhcGl0YWxpemUgPSBmdW5jdGlvbiBjYXBpdGFsaXplKHN0cmluZykge1xuICByZXR1cm4gY291bnQoc3RyaW5nKSA8IDIgP1xuICAgIHVwcGVyQ2FzZShzdHJpbmcpIDpcbiAgICBcIlwiICsgKHVwcGVyQ2FzZShzdWJzKHMsIDAsIDEpKSkgKyAobG93ZXJDYXNlKHN1YnMocywgMSkpKTtcbn07XG5leHBvcnRzLmNhcGl0YWxpemUgPSBjYXBpdGFsaXplO1xuXG52YXIgcmVwbGFjZSA9IGZ1bmN0aW9uIHJlcGxhY2Uoc3RyaW5nLCBtYXRjaCwgcmVwbGFjZW1lbnQpIHtcbiAgcmV0dXJuIHN0cmluZy5yZXBsYWNlKG1hdGNoLCByZXBsYWNlbWVudCk7XG59O1xuZXhwb3J0cy5yZXBsYWNlID0gcmVwbGFjZTtcblxudmFyIF9fTEVGVFNQQUNFU19fID0gL15cXHNcXHMqLztcbmV4cG9ydHMuX19MRUZUU1BBQ0VTX18gPSBfX0xFRlRTUEFDRVNfXztcblxudmFyIF9fUklHSFRTUEFDRVNfXyA9IC9cXHNcXHMqJC87XG5leHBvcnRzLl9fUklHSFRTUEFDRVNfXyA9IF9fUklHSFRTUEFDRVNfXztcblxudmFyIF9fU1BBQ0VTX18gPSAvXlxcc1xccyokLztcbmV4cG9ydHMuX19TUEFDRVNfXyA9IF9fU1BBQ0VTX187XG5cbnZhciB0cmltbCA9IGlzTmlsKFwiXCIudHJpbUxlZnQpID9cbiAgZnVuY3Rpb24oc3RyaW5nKSB7XG4gICAgcmV0dXJuIHN0cmluZy5yZXBsYWNlKF9fTEVGVFNQQUNFU19fLCBcIlwiKTtcbiAgfSA6XG4gIGZ1bmN0aW9uIHRyaW1sKHN0cmluZykge1xuICAgIHJldHVybiBzdHJpbmcudHJpbUxlZnQoKTtcbiAgfTtcbmV4cG9ydHMudHJpbWwgPSB0cmltbDtcblxudmFyIHRyaW1yID0gaXNOaWwoXCJcIi50cmltUmlnaHQpID9cbiAgZnVuY3Rpb24oc3RyaW5nKSB7XG4gICAgcmV0dXJuIHN0cmluZy5yZXBsYWNlKF9fUklHSFRTUEFDRVNfXywgXCJcIik7XG4gIH0gOlxuICBmdW5jdGlvbiB0cmltcihzdHJpbmcpIHtcbiAgICByZXR1cm4gc3RyaW5nLnRyaW1SaWdodCgpO1xuICB9O1xuZXhwb3J0cy50cmltciA9IHRyaW1yO1xuXG52YXIgdHJpbSA9IGlzTmlsKFwiXCIudHJpbSkgP1xuICBmdW5jdGlvbihzdHJpbmcpIHtcbiAgICByZXR1cm4gc3RyaW5nLnJlcGxhY2UoX19MRUZUU1BBQ0VTX18pLnJlcGxhY2UoX19SSUdIVFNQQUNFU19fKTtcbiAgfSA6XG4gIGZ1bmN0aW9uIHRyaW0oc3RyaW5nKSB7XG4gICAgcmV0dXJuIHN0cmluZy50cmltKCk7XG4gIH07XG5leHBvcnRzLnRyaW0gPSB0cmltO1xuXG52YXIgaXNCbGFuayA9IGZ1bmN0aW9uIGlzQmxhbmsoc3RyaW5nKSB7XG4gIHJldHVybiAoaXNOaWwoc3RyaW5nKSkgfHwgKGlzRW1wdHkoc3RyaW5nKSkgfHwgKHJlTWF0Y2hlcyhfX1NQQUNFU19fLCBzdHJpbmcpKTtcbn07XG5leHBvcnRzLmlzQmxhbmsgPSBpc0JsYW5rIiwidmFyIF9uc18gPSB7XG4gIFwiaWRcIjogXCJ3aXNwLmJhY2tlbmQuamF2YXNjcmlwdC53cml0ZXJcIixcbiAgXCJkb2NcIjogXCJDb21waWxlciBiYWNrZW5kIGZvciBmb3Igd3JpdGluZyBKUyBvdXRwdXRcIlxufTtcbnZhciB3aXNwX2FzdCA9IHJlcXVpcmUoXCIuLy4uLy4uL2FzdFwiKTtcbnZhciBuYW1lID0gd2lzcF9hc3QubmFtZTtcbnZhciBuYW1lc3BhY2UgPSB3aXNwX2FzdC5uYW1lc3BhY2U7XG52YXIgc3ltYm9sID0gd2lzcF9hc3Quc3ltYm9sO1xudmFyIGlzU3ltYm9sID0gd2lzcF9hc3QuaXNTeW1ib2w7XG52YXIgaXNLZXl3b3JkID0gd2lzcF9hc3QuaXNLZXl3b3JkOztcbnZhciB3aXNwX3NlcXVlbmNlID0gcmVxdWlyZShcIi4vLi4vLi4vc2VxdWVuY2VcIik7XG52YXIgbGlzdCA9IHdpc3Bfc2VxdWVuY2UubGlzdDtcbnZhciBmaXJzdCA9IHdpc3Bfc2VxdWVuY2UuZmlyc3Q7XG52YXIgcmVzdCA9IHdpc3Bfc2VxdWVuY2UucmVzdDtcbnZhciBpc0xpc3QgPSB3aXNwX3NlcXVlbmNlLmlzTGlzdDtcbnZhciB2ZWMgPSB3aXNwX3NlcXVlbmNlLnZlYztcbnZhciBtYXAgPSB3aXNwX3NlcXVlbmNlLm1hcDtcbnZhciBjb3VudCA9IHdpc3Bfc2VxdWVuY2UuY291bnQ7XG52YXIgbGFzdCA9IHdpc3Bfc2VxdWVuY2UubGFzdDtcbnZhciByZWR1Y2UgPSB3aXNwX3NlcXVlbmNlLnJlZHVjZTtcbnZhciBpc0VtcHR5ID0gd2lzcF9zZXF1ZW5jZS5pc0VtcHR5OztcbnZhciB3aXNwX3J1bnRpbWUgPSByZXF1aXJlKFwiLi8uLi8uLi9ydW50aW1lXCIpO1xudmFyIGlzVHJ1ZSA9IHdpc3BfcnVudGltZS5pc1RydWU7XG52YXIgaXNOaWwgPSB3aXNwX3J1bnRpbWUuaXNOaWw7XG52YXIgaXNTdHJpbmcgPSB3aXNwX3J1bnRpbWUuaXNTdHJpbmc7XG52YXIgaXNOdW1iZXIgPSB3aXNwX3J1bnRpbWUuaXNOdW1iZXI7XG52YXIgaXNWZWN0b3IgPSB3aXNwX3J1bnRpbWUuaXNWZWN0b3I7XG52YXIgaXNEaWN0aW9uYXJ5ID0gd2lzcF9ydW50aW1lLmlzRGljdGlvbmFyeTtcbnZhciBpc0Jvb2xlYW4gPSB3aXNwX3J1bnRpbWUuaXNCb29sZWFuO1xudmFyIGlzUmVQYXR0ZXJuID0gd2lzcF9ydW50aW1lLmlzUmVQYXR0ZXJuO1xudmFyIHJlRmluZCA9IHdpc3BfcnVudGltZS5yZUZpbmQ7XG52YXIgZGVjID0gd2lzcF9ydW50aW1lLmRlYztcbnZhciBzdWJzID0gd2lzcF9ydW50aW1lLnN1YnM7O1xudmFyIHdpc3Bfc3RyaW5nID0gcmVxdWlyZShcIi4vLi4vLi4vc3RyaW5nXCIpO1xudmFyIHJlcGxhY2UgPSB3aXNwX3N0cmluZy5yZXBsYWNlO1xudmFyIGpvaW4gPSB3aXNwX3N0cmluZy5qb2luO1xudmFyIHNwbGl0ID0gd2lzcF9zdHJpbmcuc3BsaXQ7XG52YXIgdXBwZXJDYXNlID0gd2lzcF9zdHJpbmcudXBwZXJDYXNlOzs7XG5cbnZhciB3cml0ZVJlZmVyZW5jZSA9IGZ1bmN0aW9uIHdyaXRlUmVmZXJlbmNlKGZvcm0pIHtcbiAgXCJUcmFuc2xhdGVzIHJlZmVyZW5jZXMgZnJvbSBjbG9qdXJlIGNvbnZlbnRpb24gdG8gSlM6XFxuXFxuICAqKm1hY3JvcyoqICAgICAgX19tYWNyb3NfX1xcbiAgbGlzdC0+dmVjdG9yICAgIGxpc3RUb1ZlY3RvclxcbiAgc2V0ISAgICAgICAgICAgIHNldFxcbiAgZm9vX2JhciAgICAgICAgIGZvb19iYXJcXG4gIG51bWJlcj8gICAgICAgICBpc051bWJlclxcbiAgY3JlYXRlLXNlcnZlciAgIGNyZWF0ZVNlcnZlclwiO1xuICByZXR1cm4gKGZ1bmN0aW9uKCkge1xuICAgIHZhciBpZCA9IG5hbWUoZm9ybSk7XG4gICAgaWQgPSBpZCA9PT0gXCIqXCIgP1xuICAgICAgXCJtdWx0aXBseVwiIDpcbiAgICBpZCA9PT0gXCIvXCIgP1xuICAgICAgXCJkaXZpZGVcIiA6XG4gICAgaWQgPT09IFwiK1wiID9cbiAgICAgIFwic3VtXCIgOlxuICAgIGlkID09PSBcIi1cIiA/XG4gICAgICBcInN1YnRyYWN0XCIgOlxuICAgIGlkID09PSBcIj1cIiA/XG4gICAgICBcImVxdWFsP1wiIDpcbiAgICBpZCA9PT0gXCI9PVwiID9cbiAgICAgIFwic3RyaWN0LWVxdWFsP1wiIDpcbiAgICBpZCA9PT0gXCI8PVwiID9cbiAgICAgIFwibm90LWdyZWF0ZXItdGhhblwiIDpcbiAgICBpZCA9PT0gXCI+PVwiID9cbiAgICAgIFwibm90LWxlc3MtdGhhblwiIDpcbiAgICBpZCA9PT0gXCI+XCIgP1xuICAgICAgXCJncmVhdGVyLXRoYW5cIiA6XG4gICAgaWQgPT09IFwiPFwiID9cbiAgICAgIFwibGVzcy10aGFuXCIgOlxuICAgIFwiZWxzZVwiID9cbiAgICAgIGlkIDpcbiAgICAgIHZvaWQoMCk7XG4gICAgaWQgPSBqb2luKFwiX1wiLCBzcGxpdChpZCwgXCIqXCIpKTtcbiAgICBpZCA9IGpvaW4oXCItdG8tXCIsIHNwbGl0KGlkLCBcIi0+XCIpKTtcbiAgICBpZCA9IGpvaW4oc3BsaXQoaWQsIFwiIVwiKSk7XG4gICAgaWQgPSBqb2luKFwiJFwiLCBzcGxpdChpZCwgXCIlXCIpKTtcbiAgICBpZCA9IGpvaW4oXCItcGx1cy1cIiwgc3BsaXQoaWQsIFwiK1wiKSk7XG4gICAgaWQgPSBqb2luKFwiLWFuZC1cIiwgc3BsaXQoaWQsIFwiJlwiKSk7XG4gICAgaWQgPSBsYXN0KGlkKSA9PT0gXCI/XCIgP1xuICAgICAgXCJcIiArIFwiaXMtXCIgKyAoc3VicyhpZCwgMCwgZGVjKGNvdW50KGlkKSkpKSA6XG4gICAgICBpZDtcbiAgICBpZCA9IHJlZHVjZShmdW5jdGlvbihyZXN1bHQsIGtleSkge1xuICAgICAgcmV0dXJuIFwiXCIgKyByZXN1bHQgKyAoKCEoaXNFbXB0eShyZXN1bHQpKSkgJiYgKCEoaXNFbXB0eShrZXkpKSkgP1xuICAgICAgICBcIlwiICsgKHVwcGVyQ2FzZSgoa2V5IHx8IDApWzBdKSkgKyAoc3VicyhrZXksIDEpKSA6XG4gICAgICAgIGtleSk7XG4gICAgfSwgXCJcIiwgc3BsaXQoaWQsIFwiLVwiKSk7XG4gICAgcmV0dXJuIGlkO1xuICB9KSgpO1xufTtcbmV4cG9ydHMud3JpdGVSZWZlcmVuY2UgPSB3cml0ZVJlZmVyZW5jZTtcblxudmFyIHdyaXRlS2V5d29yZFJlZmVyZW5jZSA9IGZ1bmN0aW9uIHdyaXRlS2V5d29yZFJlZmVyZW5jZShmb3JtKSB7XG4gIHJldHVybiBcIlwiICsgXCJcXFwiXCIgKyAobmFtZShmb3JtKSkgKyBcIlxcXCJcIjtcbn07XG5leHBvcnRzLndyaXRlS2V5d29yZFJlZmVyZW5jZSA9IHdyaXRlS2V5d29yZFJlZmVyZW5jZTtcblxudmFyIHdyaXRlS2V5d29yZCA9IGZ1bmN0aW9uIHdyaXRlS2V5d29yZChmb3JtKSB7XG4gIHJldHVybiBcIlwiICsgXCJcXFwiXCIgKyBcIuqeiVwiICsgKG5hbWUoZm9ybSkpICsgXCJcXFwiXCI7XG59O1xuZXhwb3J0cy53cml0ZUtleXdvcmQgPSB3cml0ZUtleXdvcmQ7XG5cbnZhciB3cml0ZVN5bWJvbCA9IGZ1bmN0aW9uIHdyaXRlU3ltYm9sKGZvcm0pIHtcbiAgcmV0dXJuIHdyaXRlKGxpc3Qoc3ltYm9sKHZvaWQoMCksIFwic3ltYm9sXCIpLCBuYW1lc3BhY2UoZm9ybSksIG5hbWUoZm9ybSkpKTtcbn07XG5leHBvcnRzLndyaXRlU3ltYm9sID0gd3JpdGVTeW1ib2w7XG5cbnZhciB3cml0ZU5pbCA9IGZ1bmN0aW9uIHdyaXRlTmlsKGZvcm0pIHtcbiAgcmV0dXJuIFwidm9pZCgwKVwiO1xufTtcbmV4cG9ydHMud3JpdGVOaWwgPSB3cml0ZU5pbDtcblxudmFyIHdyaXRlTnVtYmVyID0gZnVuY3Rpb24gd3JpdGVOdW1iZXIoZm9ybSkge1xuICByZXR1cm4gZm9ybTtcbn07XG5leHBvcnRzLndyaXRlTnVtYmVyID0gd3JpdGVOdW1iZXI7XG5cbnZhciB3cml0ZUJvb2xlYW4gPSBmdW5jdGlvbiB3cml0ZUJvb2xlYW4oZm9ybSkge1xuICByZXR1cm4gaXNUcnVlKGZvcm0pID9cbiAgICBcInRydWVcIiA6XG4gICAgXCJmYWxzZVwiO1xufTtcbmV4cG9ydHMud3JpdGVCb29sZWFuID0gd3JpdGVCb29sZWFuO1xuXG52YXIgd3JpdGVTdHJpbmcgPSBmdW5jdGlvbiB3cml0ZVN0cmluZyhmb3JtKSB7XG4gIGZvcm0gPSByZXBsYWNlKGZvcm0sIFJlZ0V4cChcIlxcXFxcXFxcXCIsIFwiZ1wiKSwgXCJcXFxcXFxcXFwiKTtcbiAgZm9ybSA9IHJlcGxhY2UoZm9ybSwgUmVnRXhwKFwiXFxuXCIsIFwiZ1wiKSwgXCJcXFxcblwiKTtcbiAgZm9ybSA9IHJlcGxhY2UoZm9ybSwgUmVnRXhwKFwiXFxyXCIsIFwiZ1wiKSwgXCJcXFxcclwiKTtcbiAgZm9ybSA9IHJlcGxhY2UoZm9ybSwgUmVnRXhwKFwiXFx0XCIsIFwiZ1wiKSwgXCJcXFxcdFwiKTtcbiAgZm9ybSA9IHJlcGxhY2UoZm9ybSwgUmVnRXhwKFwiXFxcIlwiLCBcImdcIiksIFwiXFxcXFxcXCJcIik7XG4gIHJldHVybiBcIlwiICsgXCJcXFwiXCIgKyBmb3JtICsgXCJcXFwiXCI7XG59O1xuZXhwb3J0cy53cml0ZVN0cmluZyA9IHdyaXRlU3RyaW5nO1xuXG52YXIgd3JpdGVUZW1wbGF0ZSA9IGZ1bmN0aW9uIHdyaXRlVGVtcGxhdGUoKSB7XG4gIHZhciBmb3JtID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKTtcbiAgcmV0dXJuIChmdW5jdGlvbigpIHtcbiAgICB2YXIgaW5kZW50UGF0dGVybiA9IC9cXG4gKiQvO1xuICAgIHZhciBsaW5lQnJlYWtQYXR0ZXIgPSBSZWdFeHAoXCJcXG5cIiwgXCJnXCIpO1xuICAgIHZhciBnZXRJbmRlbnRhdGlvbiA9IGZ1bmN0aW9uKGNvZGUpIHtcbiAgICAgIHJldHVybiAocmVGaW5kKGluZGVudFBhdHRlcm4sIGNvZGUpKSB8fCBcIlxcblwiO1xuICAgIH07XG4gICAgcmV0dXJuIChmdW5jdGlvbiBsb29wKGNvZGUsIHBhcnRzLCB2YWx1ZXMpIHtcbiAgICAgIHZhciByZWN1ciA9IGxvb3A7XG4gICAgICB3aGlsZSAocmVjdXIgPT09IGxvb3ApIHtcbiAgICAgICAgcmVjdXIgPSBjb3VudChwYXJ0cykgPiAxID9cbiAgICAgICAgKGNvZGUgPSBcIlwiICsgY29kZSArIChmaXJzdChwYXJ0cykpICsgKHJlcGxhY2UoXCJcIiArIFwiXCIgKyAoZmlyc3QodmFsdWVzKSksIGxpbmVCcmVha1BhdHRlciwgZ2V0SW5kZW50YXRpb24oZmlyc3QocGFydHMpKSkpLCBwYXJ0cyA9IHJlc3QocGFydHMpLCB2YWx1ZXMgPSByZXN0KHZhbHVlcyksIGxvb3ApIDpcbiAgICAgICAgXCJcIiArIGNvZGUgKyAoZmlyc3QocGFydHMpKTtcbiAgICAgIH07XG4gICAgICByZXR1cm4gcmVjdXI7XG4gICAgfSkoXCJcIiwgc3BsaXQoZmlyc3QoZm9ybSksIFwifnt9XCIpLCByZXN0KGZvcm0pKTtcbiAgfSkoKTtcbn07XG5leHBvcnRzLndyaXRlVGVtcGxhdGUgPSB3cml0ZVRlbXBsYXRlO1xuXG52YXIgd3JpdGVHcm91cCA9IGZ1bmN0aW9uIHdyaXRlR3JvdXAoKSB7XG4gIHZhciBmb3JtcyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMCk7XG4gIHJldHVybiBqb2luKFwiLCBcIiwgZm9ybXMpO1xufTtcbmV4cG9ydHMud3JpdGVHcm91cCA9IHdyaXRlR3JvdXA7XG5cbnZhciB3cml0ZUludm9rZSA9IGZ1bmN0aW9uIHdyaXRlSW52b2tlKGNhbGxlZSkge1xuICB2YXIgcGFyYW1zID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgcmV0dXJuIHdyaXRlVGVtcGxhdGUoXCJ+e30ofnt9KVwiLCBjYWxsZWUsIHdyaXRlR3JvdXAuYXBwbHkod3JpdGVHcm91cCwgcGFyYW1zKSk7XG59O1xuZXhwb3J0cy53cml0ZUludm9rZSA9IHdyaXRlSW52b2tlO1xuXG52YXIgd3JpdGVFcnJvciA9IGZ1bmN0aW9uIHdyaXRlRXJyb3IobWVzc2FnZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIChmdW5jdGlvbigpIHsgdGhyb3cgRXJyb3IobWVzc2FnZSk7IH0pKCk7XG4gIH07XG59O1xuZXhwb3J0cy53cml0ZUVycm9yID0gd3JpdGVFcnJvcjtcblxudmFyIHdyaXRlVmVjdG9yID0gd3JpdGVFcnJvcihcIlZlY3RvcnMgYXJlIG5vdCBzdXBwb3J0ZWRcIik7XG5leHBvcnRzLndyaXRlVmVjdG9yID0gd3JpdGVWZWN0b3I7XG5cbnZhciB3cml0ZURpY3Rpb25hcnkgPSB3cml0ZUVycm9yKFwiRGljdGlvbmFyaWVzIGFyZSBub3Qgc3VwcG9ydGVkXCIpO1xuZXhwb3J0cy53cml0ZURpY3Rpb25hcnkgPSB3cml0ZURpY3Rpb25hcnk7XG5cbnZhciB3cml0ZVBhdHRlcm4gPSB3cml0ZUVycm9yKFwiUmVndWxhciBleHByZXNzaW9ucyBhcmUgbm90IHN1cHBvcnRlZFwiKTtcbmV4cG9ydHMud3JpdGVQYXR0ZXJuID0gd3JpdGVQYXR0ZXJuO1xuXG52YXIgY29tcGlsZUNvbW1lbnQgPSBmdW5jdGlvbiBjb21waWxlQ29tbWVudChmb3JtKSB7XG4gIHJldHVybiBjb21waWxlVGVtcGxhdGUobGlzdChcIi8vfnt9XFxuXCIsIGZpcnN0KGZvcm0pKSk7XG59O1xuZXhwb3J0cy5jb21waWxlQ29tbWVudCA9IGNvbXBpbGVDb21tZW50O1xuXG52YXIgd3JpdGVEZWYgPSBmdW5jdGlvbiB3cml0ZURlZihmb3JtKSB7XG4gIHZhciBpZCA9IGZpcnN0KGZvcm0pO1xuICB2YXIgaXNFeHBvcnQgPSAoKCgobWV0YShmb3JtKSkgfHwge30pIHx8IDApW1widG9wXCJdKSAmJiAoISgoKChtZXRhKGlkKSkgfHwge30pIHx8IDApW1wicHJpdmF0ZVwiXSkpO1xuICB2YXIgYXR0cmlidXRlID0gc3ltYm9sKG5hbWVzcGFjZShpZCksIFwiXCIgKyBcIi1cIiArIChuYW1lKGlkKSkpO1xuICByZXR1cm4gaXNFeHBvcnQgP1xuICAgIGNvbXBpbGVUZW1wbGF0ZShsaXN0KFwidmFyIH57fTtcXG5+e31cIiwgY29tcGlsZShjb25zKHN5bWJvbCh2b2lkKDApLCBcInNldCFcIiksIGZvcm0pKSwgY29tcGlsZShsaXN0KHN5bWJvbCh2b2lkKDApLCBcInNldCFcIiksIGxpc3Qoc3ltYm9sKHZvaWQoMCksIFwiLlwiKSwgc3ltYm9sKHZvaWQoMCksIFwiZXhwb3J0c1wiKSwgYXR0cmlidXRlKSwgaWQpKSkpIDpcbiAgICBjb21waWxlVGVtcGxhdGUobGlzdChcInZhciB+e31cIiwgY29tcGlsZShjb25zKHN5bWJvbCh2b2lkKDApLCBcInNldCFcIiksIGZvcm0pKSkpO1xufTtcbmV4cG9ydHMud3JpdGVEZWYgPSB3cml0ZURlZjtcblxudmFyIHdyaXRlID0gZnVuY3Rpb24gd3JpdGUoZm9ybSkge1xuICByZXR1cm4gaXNOaWwoZm9ybSkgP1xuICAgIHdyaXRlTmlsKGZvcm0pIDpcbiAgaXNTeW1ib2woZm9ybSkgP1xuICAgIHdyaXRlUmVmZXJlbmNlKGZvcm0pIDpcbiAgaXNLZXl3b3JkKGZvcm0pID9cbiAgICB3cml0ZUtleXdvcmRSZWZlcmVuY2UoZm9ybSkgOlxuICBpc1N0cmluZyhmb3JtKSA/XG4gICAgd3JpdGVTdHJpbmcoZm9ybSkgOlxuICBpc051bWJlcihmb3JtKSA/XG4gICAgd3JpdGVOdW1iZXIoZm9ybSkgOlxuICBpc0Jvb2xlYW4oZm9ybSkgP1xuICAgIHdyaXRlQm9vbGVhbihmb3JtKSA6XG4gIGlzUmVQYXR0ZXJuKGZvcm0pID9cbiAgICB3cml0ZVBhdHRlcm4oZm9ybSkgOlxuICBpc1ZlY3Rvcihmb3JtKSA/XG4gICAgd3JpdGVWZWN0b3IoZm9ybSkgOlxuICBpc0RpY3Rpb25hcnkoZm9ybSkgP1xuICAgIHdyaXRlRGljdGlvbmFyeSgpIDpcbiAgaXNMaXN0KGZvcm0pID9cbiAgICB3cml0ZUludm9rZS5hcHBseSh3cml0ZUludm9rZSwgbWFwKHdyaXRlLCB2ZWMoZm9ybSkpKSA6XG4gIFwiZWxzZVwiID9cbiAgICB3cml0ZUVycm9yKFwiVW5zdXBwb3J0ZWQgZm9ybVwiKSA6XG4gICAgdm9pZCgwKTtcbn07XG5leHBvcnRzLndyaXRlID0gd3JpdGUiXX0=
;