var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/jquery/dist/jquery.js
var require_jquery = __commonJS({
  "node_modules/jquery/dist/jquery.js"(exports, module) {
    "use strict";
    (function(global, factory) {
      "use strict";
      if (typeof module === "object" && typeof module.exports === "object") {
        module.exports = global.document ? factory(global, true) : function(w) {
          if (!w.document) {
            throw new Error("jQuery requires a window with a document");
          }
          return factory(w);
        };
      } else {
        factory(global);
      }
    })(typeof window !== "undefined" ? window : exports, function(window2, noGlobal) {
      "use strict";
      var arr = [];
      var getProto = Object.getPrototypeOf;
      var slice = arr.slice;
      var flat = arr.flat ? function(array) {
        return arr.flat.call(array);
      } : function(array) {
        return arr.concat.apply([], array);
      };
      var push = arr.push;
      var indexOf = arr.indexOf;
      var class2type = {};
      var toString = class2type.toString;
      var hasOwn = class2type.hasOwnProperty;
      var fnToString = hasOwn.toString;
      var ObjectFunctionString = fnToString.call(Object);
      var support = {};
      var isFunction = function isFunction2(obj) {
        return typeof obj === "function" && typeof obj.nodeType !== "number" && typeof obj.item !== "function";
      };
      var isWindow = function isWindow2(obj) {
        return obj != null && obj === obj.window;
      };
      var document2 = window2.document;
      var preservedScriptAttributes = {
        type: true,
        src: true,
        nonce: true,
        noModule: true
      };
      function DOMEval(code, node, doc) {
        doc = doc || document2;
        var i, val, script = doc.createElement("script");
        script.text = code;
        if (node) {
          for (i in preservedScriptAttributes) {
            val = node[i] || node.getAttribute && node.getAttribute(i);
            if (val) {
              script.setAttribute(i, val);
            }
          }
        }
        doc.head.appendChild(script).parentNode.removeChild(script);
      }
      function toType(obj) {
        if (obj == null) {
          return obj + "";
        }
        return typeof obj === "object" || typeof obj === "function" ? class2type[toString.call(obj)] || "object" : typeof obj;
      }
      var version2 = "3.7.1", rhtmlSuffix = /HTML$/i, jQuery = function(selector, context2) {
        return new jQuery.fn.init(selector, context2);
      };
      jQuery.fn = jQuery.prototype = {
        // The current version of jQuery being used
        jquery: version2,
        constructor: jQuery,
        // The default length of a jQuery object is 0
        length: 0,
        toArray: function() {
          return slice.call(this);
        },
        // Get the Nth element in the matched element set OR
        // Get the whole matched element set as a clean array
        get: function(num) {
          if (num == null) {
            return slice.call(this);
          }
          return num < 0 ? this[num + this.length] : this[num];
        },
        // Take an array of elements and push it onto the stack
        // (returning the new matched element set)
        pushStack: function(elems) {
          var ret = jQuery.merge(this.constructor(), elems);
          ret.prevObject = this;
          return ret;
        },
        // Execute a callback for every element in the matched set.
        each: function(callback) {
          return jQuery.each(this, callback);
        },
        map: function(callback) {
          return this.pushStack(jQuery.map(this, function(elem, i) {
            return callback.call(elem, i, elem);
          }));
        },
        slice: function() {
          return this.pushStack(slice.apply(this, arguments));
        },
        first: function() {
          return this.eq(0);
        },
        last: function() {
          return this.eq(-1);
        },
        even: function() {
          return this.pushStack(jQuery.grep(this, function(_elem, i) {
            return (i + 1) % 2;
          }));
        },
        odd: function() {
          return this.pushStack(jQuery.grep(this, function(_elem, i) {
            return i % 2;
          }));
        },
        eq: function(i) {
          var len = this.length, j = +i + (i < 0 ? len : 0);
          return this.pushStack(j >= 0 && j < len ? [this[j]] : []);
        },
        end: function() {
          return this.prevObject || this.constructor();
        },
        // For internal use only.
        // Behaves like an Array's method, not like a jQuery method.
        push,
        sort: arr.sort,
        splice: arr.splice
      };
      jQuery.extend = jQuery.fn.extend = function() {
        var options, name, src, copy, copyIsArray, clone, target = arguments[0] || {}, i = 1, length = arguments.length, deep = false;
        if (typeof target === "boolean") {
          deep = target;
          target = arguments[i] || {};
          i++;
        }
        if (typeof target !== "object" && !isFunction(target)) {
          target = {};
        }
        if (i === length) {
          target = this;
          i--;
        }
        for (; i < length; i++) {
          if ((options = arguments[i]) != null) {
            for (name in options) {
              copy = options[name];
              if (name === "__proto__" || target === copy) {
                continue;
              }
              if (deep && copy && (jQuery.isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {
                src = target[name];
                if (copyIsArray && !Array.isArray(src)) {
                  clone = [];
                } else if (!copyIsArray && !jQuery.isPlainObject(src)) {
                  clone = {};
                } else {
                  clone = src;
                }
                copyIsArray = false;
                target[name] = jQuery.extend(deep, clone, copy);
              } else if (copy !== void 0) {
                target[name] = copy;
              }
            }
          }
        }
        return target;
      };
      jQuery.extend({
        // Unique for each copy of jQuery on the page
        expando: "jQuery" + (version2 + Math.random()).replace(/\D/g, ""),
        // Assume jQuery is ready without the ready module
        isReady: true,
        error: function(msg) {
          throw new Error(msg);
        },
        noop: function() {
        },
        isPlainObject: function(obj) {
          var proto, Ctor;
          if (!obj || toString.call(obj) !== "[object Object]") {
            return false;
          }
          proto = getProto(obj);
          if (!proto) {
            return true;
          }
          Ctor = hasOwn.call(proto, "constructor") && proto.constructor;
          return typeof Ctor === "function" && fnToString.call(Ctor) === ObjectFunctionString;
        },
        isEmptyObject: function(obj) {
          var name;
          for (name in obj) {
            return false;
          }
          return true;
        },
        // Evaluates a script in a provided context; falls back to the global one
        // if not specified.
        globalEval: function(code, options, doc) {
          DOMEval(code, { nonce: options && options.nonce }, doc);
        },
        each: function(obj, callback) {
          var length, i = 0;
          if (isArrayLike(obj)) {
            length = obj.length;
            for (; i < length; i++) {
              if (callback.call(obj[i], i, obj[i]) === false) {
                break;
              }
            }
          } else {
            for (i in obj) {
              if (callback.call(obj[i], i, obj[i]) === false) {
                break;
              }
            }
          }
          return obj;
        },
        // Retrieve the text value of an array of DOM nodes
        text: function(elem) {
          var node, ret = "", i = 0, nodeType = elem.nodeType;
          if (!nodeType) {
            while (node = elem[i++]) {
              ret += jQuery.text(node);
            }
          }
          if (nodeType === 1 || nodeType === 11) {
            return elem.textContent;
          }
          if (nodeType === 9) {
            return elem.documentElement.textContent;
          }
          if (nodeType === 3 || nodeType === 4) {
            return elem.nodeValue;
          }
          return ret;
        },
        // results is for internal usage only
        makeArray: function(arr2, results) {
          var ret = results || [];
          if (arr2 != null) {
            if (isArrayLike(Object(arr2))) {
              jQuery.merge(
                ret,
                typeof arr2 === "string" ? [arr2] : arr2
              );
            } else {
              push.call(ret, arr2);
            }
          }
          return ret;
        },
        inArray: function(elem, arr2, i) {
          return arr2 == null ? -1 : indexOf.call(arr2, elem, i);
        },
        isXMLDoc: function(elem) {
          var namespace = elem && elem.namespaceURI, docElem = elem && (elem.ownerDocument || elem).documentElement;
          return !rhtmlSuffix.test(namespace || docElem && docElem.nodeName || "HTML");
        },
        // Support: Android <=4.0 only, PhantomJS 1 only
        // push.apply(_, arraylike) throws on ancient WebKit
        merge: function(first, second) {
          var len = +second.length, j = 0, i = first.length;
          for (; j < len; j++) {
            first[i++] = second[j];
          }
          first.length = i;
          return first;
        },
        grep: function(elems, callback, invert) {
          var callbackInverse, matches = [], i = 0, length = elems.length, callbackExpect = !invert;
          for (; i < length; i++) {
            callbackInverse = !callback(elems[i], i);
            if (callbackInverse !== callbackExpect) {
              matches.push(elems[i]);
            }
          }
          return matches;
        },
        // arg is for internal usage only
        map: function(elems, callback, arg) {
          var length, value, i = 0, ret = [];
          if (isArrayLike(elems)) {
            length = elems.length;
            for (; i < length; i++) {
              value = callback(elems[i], i, arg);
              if (value != null) {
                ret.push(value);
              }
            }
          } else {
            for (i in elems) {
              value = callback(elems[i], i, arg);
              if (value != null) {
                ret.push(value);
              }
            }
          }
          return flat(ret);
        },
        // A global GUID counter for objects
        guid: 1,
        // jQuery.support is not used in Core but other projects attach their
        // properties to it so it needs to exist.
        support
      });
      if (typeof Symbol === "function") {
        jQuery.fn[Symbol.iterator] = arr[Symbol.iterator];
      }
      jQuery.each(
        "Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "),
        function(_i, name) {
          class2type["[object " + name + "]"] = name.toLowerCase();
        }
      );
      function isArrayLike(obj) {
        var length = !!obj && "length" in obj && obj.length, type = toType(obj);
        if (isFunction(obj) || isWindow(obj)) {
          return false;
        }
        return type === "array" || length === 0 || typeof length === "number" && length > 0 && length - 1 in obj;
      }
      function nodeName(elem, name) {
        return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
      }
      var pop = arr.pop;
      var sort = arr.sort;
      var splice = arr.splice;
      var whitespace = "[\\x20\\t\\r\\n\\f]";
      var rtrimCSS = new RegExp(
        "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$",
        "g"
      );
      jQuery.contains = function(a, b) {
        var bup = b && b.parentNode;
        return a === bup || !!(bup && bup.nodeType === 1 && // Support: IE 9 - 11+
        // IE doesn't have `contains` on SVG.
        (a.contains ? a.contains(bup) : a.compareDocumentPosition && a.compareDocumentPosition(bup) & 16));
      };
      var rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\x80-\uFFFF\w-]/g;
      function fcssescape(ch, asCodePoint) {
        if (asCodePoint) {
          if (ch === "\0") {
            return "\uFFFD";
          }
          return ch.slice(0, -1) + "\\" + ch.charCodeAt(ch.length - 1).toString(16) + " ";
        }
        return "\\" + ch;
      }
      jQuery.escapeSelector = function(sel) {
        return (sel + "").replace(rcssescape, fcssescape);
      };
      var preferredDoc = document2, pushNative = push;
      (function() {
        var i, Expr, outermostContext, sortInput, hasDuplicate, push2 = pushNative, document3, documentElement2, documentIsHTML, rbuggyQSA, matches, expando = jQuery.expando, dirruns = 0, done = 0, classCache = createCache(), tokenCache = createCache(), compilerCache = createCache(), nonnativeSelectorCache = createCache(), sortOrder = function(a, b) {
          if (a === b) {
            hasDuplicate = true;
          }
          return 0;
        }, booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped", identifier = "(?:\\\\[\\da-fA-F]{1,6}" + whitespace + "?|\\\\[^\\r\\n\\f]|[\\w-]|[^\0-\\x7f])+", attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace + // Operator (capture 2)
        "*([*^$|!~]?=)" + whitespace + // "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
        `*(?:'((?:\\\\.|[^\\\\'])*)'|"((?:\\\\.|[^\\\\"])*)"|(` + identifier + "))|)" + whitespace + "*\\]", pseudos = ":(" + identifier + `)(?:\\((('((?:\\\\.|[^\\\\'])*)'|"((?:\\\\.|[^\\\\"])*)")|((?:\\\\.|[^\\\\()[\\]]|` + attributes + ")*)|.*)\\)|)", rwhitespace = new RegExp(whitespace + "+", "g"), rcomma = new RegExp("^" + whitespace + "*," + whitespace + "*"), rleadingCombinator = new RegExp("^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*"), rdescend = new RegExp(whitespace + "|>"), rpseudo = new RegExp(pseudos), ridentifier = new RegExp("^" + identifier + "$"), matchExpr = {
          ID: new RegExp("^#(" + identifier + ")"),
          CLASS: new RegExp("^\\.(" + identifier + ")"),
          TAG: new RegExp("^(" + identifier + "|[*])"),
          ATTR: new RegExp("^" + attributes),
          PSEUDO: new RegExp("^" + pseudos),
          CHILD: new RegExp(
            "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace + "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace + "*(\\d+)|))" + whitespace + "*\\)|)",
            "i"
          ),
          bool: new RegExp("^(?:" + booleans + ")$", "i"),
          // For use in libraries implementing .is()
          // We use this for POS matching in `select`
          needsContext: new RegExp("^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i")
        }, rinputs = /^(?:input|select|textarea|button)$/i, rheader = /^h\d$/i, rquickExpr2 = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, rsibling = /[+~]/, runescape = new RegExp("\\\\[\\da-fA-F]{1,6}" + whitespace + "?|\\\\([^\\r\\n\\f])", "g"), funescape = function(escape, nonHex) {
          var high = "0x" + escape.slice(1) - 65536;
          if (nonHex) {
            return nonHex;
          }
          return high < 0 ? String.fromCharCode(high + 65536) : String.fromCharCode(high >> 10 | 55296, high & 1023 | 56320);
        }, unloadHandler = function() {
          setDocument();
        }, inDisabledFieldset = addCombinator(
          function(elem) {
            return elem.disabled === true && nodeName(elem, "fieldset");
          },
          { dir: "parentNode", next: "legend" }
        );
        function safeActiveElement() {
          try {
            return document3.activeElement;
          } catch (err) {
          }
        }
        try {
          push2.apply(
            arr = slice.call(preferredDoc.childNodes),
            preferredDoc.childNodes
          );
          arr[preferredDoc.childNodes.length].nodeType;
        } catch (e) {
          push2 = {
            apply: function(target, els) {
              pushNative.apply(target, slice.call(els));
            },
            call: function(target) {
              pushNative.apply(target, slice.call(arguments, 1));
            }
          };
        }
        function find(selector, context2, results, seed) {
          var m, i2, elem, nid, match, groups, newSelector, newContext = context2 && context2.ownerDocument, nodeType = context2 ? context2.nodeType : 9;
          results = results || [];
          if (typeof selector !== "string" || !selector || nodeType !== 1 && nodeType !== 9 && nodeType !== 11) {
            return results;
          }
          if (!seed) {
            setDocument(context2);
            context2 = context2 || document3;
            if (documentIsHTML) {
              if (nodeType !== 11 && (match = rquickExpr2.exec(selector))) {
                if (m = match[1]) {
                  if (nodeType === 9) {
                    if (elem = context2.getElementById(m)) {
                      if (elem.id === m) {
                        push2.call(results, elem);
                        return results;
                      }
                    } else {
                      return results;
                    }
                  } else {
                    if (newContext && (elem = newContext.getElementById(m)) && find.contains(context2, elem) && elem.id === m) {
                      push2.call(results, elem);
                      return results;
                    }
                  }
                } else if (match[2]) {
                  push2.apply(results, context2.getElementsByTagName(selector));
                  return results;
                } else if ((m = match[3]) && context2.getElementsByClassName) {
                  push2.apply(results, context2.getElementsByClassName(m));
                  return results;
                }
              }
              if (!nonnativeSelectorCache[selector + " "] && (!rbuggyQSA || !rbuggyQSA.test(selector))) {
                newSelector = selector;
                newContext = context2;
                if (nodeType === 1 && (rdescend.test(selector) || rleadingCombinator.test(selector))) {
                  newContext = rsibling.test(selector) && testContext(context2.parentNode) || context2;
                  if (newContext != context2 || !support.scope) {
                    if (nid = context2.getAttribute("id")) {
                      nid = jQuery.escapeSelector(nid);
                    } else {
                      context2.setAttribute("id", nid = expando);
                    }
                  }
                  groups = tokenize(selector);
                  i2 = groups.length;
                  while (i2--) {
                    groups[i2] = (nid ? "#" + nid : ":scope") + " " + toSelector(groups[i2]);
                  }
                  newSelector = groups.join(",");
                }
                try {
                  push2.apply(
                    results,
                    newContext.querySelectorAll(newSelector)
                  );
                  return results;
                } catch (qsaError) {
                  nonnativeSelectorCache(selector, true);
                } finally {
                  if (nid === expando) {
                    context2.removeAttribute("id");
                  }
                }
              }
            }
          }
          return select(selector.replace(rtrimCSS, "$1"), context2, results, seed);
        }
        function createCache() {
          var keys = [];
          function cache(key, value) {
            if (keys.push(key + " ") > Expr.cacheLength) {
              delete cache[keys.shift()];
            }
            return cache[key + " "] = value;
          }
          return cache;
        }
        function markFunction(fn) {
          fn[expando] = true;
          return fn;
        }
        function assert(fn) {
          var el = document3.createElement("fieldset");
          try {
            return !!fn(el);
          } catch (e) {
            return false;
          } finally {
            if (el.parentNode) {
              el.parentNode.removeChild(el);
            }
            el = null;
          }
        }
        function createInputPseudo(type) {
          return function(elem) {
            return nodeName(elem, "input") && elem.type === type;
          };
        }
        function createButtonPseudo(type) {
          return function(elem) {
            return (nodeName(elem, "input") || nodeName(elem, "button")) && elem.type === type;
          };
        }
        function createDisabledPseudo(disabled) {
          return function(elem) {
            if ("form" in elem) {
              if (elem.parentNode && elem.disabled === false) {
                if ("label" in elem) {
                  if ("label" in elem.parentNode) {
                    return elem.parentNode.disabled === disabled;
                  } else {
                    return elem.disabled === disabled;
                  }
                }
                return elem.isDisabled === disabled || // Where there is no isDisabled, check manually
                elem.isDisabled !== !disabled && inDisabledFieldset(elem) === disabled;
              }
              return elem.disabled === disabled;
            } else if ("label" in elem) {
              return elem.disabled === disabled;
            }
            return false;
          };
        }
        function createPositionalPseudo(fn) {
          return markFunction(function(argument) {
            argument = +argument;
            return markFunction(function(seed, matches2) {
              var j, matchIndexes = fn([], seed.length, argument), i2 = matchIndexes.length;
              while (i2--) {
                if (seed[j = matchIndexes[i2]]) {
                  seed[j] = !(matches2[j] = seed[j]);
                }
              }
            });
          });
        }
        function testContext(context2) {
          return context2 && typeof context2.getElementsByTagName !== "undefined" && context2;
        }
        function setDocument(node) {
          var subWindow, doc = node ? node.ownerDocument || node : preferredDoc;
          if (doc == document3 || doc.nodeType !== 9 || !doc.documentElement) {
            return document3;
          }
          document3 = doc;
          documentElement2 = document3.documentElement;
          documentIsHTML = !jQuery.isXMLDoc(document3);
          matches = documentElement2.matches || documentElement2.webkitMatchesSelector || documentElement2.msMatchesSelector;
          if (documentElement2.msMatchesSelector && // Support: IE 11+, Edge 17 - 18+
          // IE/Edge sometimes throw a "Permission denied" error when strict-comparing
          // two documents; shallow comparisons work.
          // eslint-disable-next-line eqeqeq
          preferredDoc != document3 && (subWindow = document3.defaultView) && subWindow.top !== subWindow) {
            subWindow.addEventListener("unload", unloadHandler);
          }
          support.getById = assert(function(el) {
            documentElement2.appendChild(el).id = jQuery.expando;
            return !document3.getElementsByName || !document3.getElementsByName(jQuery.expando).length;
          });
          support.disconnectedMatch = assert(function(el) {
            return matches.call(el, "*");
          });
          support.scope = assert(function() {
            return document3.querySelectorAll(":scope");
          });
          support.cssHas = assert(function() {
            try {
              document3.querySelector(":has(*,:jqfake)");
              return false;
            } catch (e) {
              return true;
            }
          });
          if (support.getById) {
            Expr.filter.ID = function(id) {
              var attrId = id.replace(runescape, funescape);
              return function(elem) {
                return elem.getAttribute("id") === attrId;
              };
            };
            Expr.find.ID = function(id, context2) {
              if (typeof context2.getElementById !== "undefined" && documentIsHTML) {
                var elem = context2.getElementById(id);
                return elem ? [elem] : [];
              }
            };
          } else {
            Expr.filter.ID = function(id) {
              var attrId = id.replace(runescape, funescape);
              return function(elem) {
                var node2 = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");
                return node2 && node2.value === attrId;
              };
            };
            Expr.find.ID = function(id, context2) {
              if (typeof context2.getElementById !== "undefined" && documentIsHTML) {
                var node2, i2, elems, elem = context2.getElementById(id);
                if (elem) {
                  node2 = elem.getAttributeNode("id");
                  if (node2 && node2.value === id) {
                    return [elem];
                  }
                  elems = context2.getElementsByName(id);
                  i2 = 0;
                  while (elem = elems[i2++]) {
                    node2 = elem.getAttributeNode("id");
                    if (node2 && node2.value === id) {
                      return [elem];
                    }
                  }
                }
                return [];
              }
            };
          }
          Expr.find.TAG = function(tag, context2) {
            if (typeof context2.getElementsByTagName !== "undefined") {
              return context2.getElementsByTagName(tag);
            } else {
              return context2.querySelectorAll(tag);
            }
          };
          Expr.find.CLASS = function(className, context2) {
            if (typeof context2.getElementsByClassName !== "undefined" && documentIsHTML) {
              return context2.getElementsByClassName(className);
            }
          };
          rbuggyQSA = [];
          assert(function(el) {
            var input;
            documentElement2.appendChild(el).innerHTML = "<a id='" + expando + "' href='' disabled='disabled'></a><select id='" + expando + "-\r\\' disabled='disabled'><option selected=''></option></select>";
            if (!el.querySelectorAll("[selected]").length) {
              rbuggyQSA.push("\\[" + whitespace + "*(?:value|" + booleans + ")");
            }
            if (!el.querySelectorAll("[id~=" + expando + "-]").length) {
              rbuggyQSA.push("~=");
            }
            if (!el.querySelectorAll("a#" + expando + "+*").length) {
              rbuggyQSA.push(".#.+[+~]");
            }
            if (!el.querySelectorAll(":checked").length) {
              rbuggyQSA.push(":checked");
            }
            input = document3.createElement("input");
            input.setAttribute("type", "hidden");
            el.appendChild(input).setAttribute("name", "D");
            documentElement2.appendChild(el).disabled = true;
            if (el.querySelectorAll(":disabled").length !== 2) {
              rbuggyQSA.push(":enabled", ":disabled");
            }
            input = document3.createElement("input");
            input.setAttribute("name", "");
            el.appendChild(input);
            if (!el.querySelectorAll("[name='']").length) {
              rbuggyQSA.push("\\[" + whitespace + "*name" + whitespace + "*=" + whitespace + `*(?:''|"")`);
            }
          });
          if (!support.cssHas) {
            rbuggyQSA.push(":has");
          }
          rbuggyQSA = rbuggyQSA.length && new RegExp(rbuggyQSA.join("|"));
          sortOrder = function(a, b) {
            if (a === b) {
              hasDuplicate = true;
              return 0;
            }
            var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
            if (compare) {
              return compare;
            }
            compare = (a.ownerDocument || a) == (b.ownerDocument || b) ? a.compareDocumentPosition(b) : (
              // Otherwise we know they are disconnected
              1
            );
            if (compare & 1 || !support.sortDetached && b.compareDocumentPosition(a) === compare) {
              if (a === document3 || a.ownerDocument == preferredDoc && find.contains(preferredDoc, a)) {
                return -1;
              }
              if (b === document3 || b.ownerDocument == preferredDoc && find.contains(preferredDoc, b)) {
                return 1;
              }
              return sortInput ? indexOf.call(sortInput, a) - indexOf.call(sortInput, b) : 0;
            }
            return compare & 4 ? -1 : 1;
          };
          return document3;
        }
        find.matches = function(expr, elements) {
          return find(expr, null, null, elements);
        };
        find.matchesSelector = function(elem, expr) {
          setDocument(elem);
          if (documentIsHTML && !nonnativeSelectorCache[expr + " "] && (!rbuggyQSA || !rbuggyQSA.test(expr))) {
            try {
              var ret = matches.call(elem, expr);
              if (ret || support.disconnectedMatch || // As well, disconnected nodes are said to be in a document
              // fragment in IE 9
              elem.document && elem.document.nodeType !== 11) {
                return ret;
              }
            } catch (e) {
              nonnativeSelectorCache(expr, true);
            }
          }
          return find(expr, document3, null, [elem]).length > 0;
        };
        find.contains = function(context2, elem) {
          if ((context2.ownerDocument || context2) != document3) {
            setDocument(context2);
          }
          return jQuery.contains(context2, elem);
        };
        find.attr = function(elem, name) {
          if ((elem.ownerDocument || elem) != document3) {
            setDocument(elem);
          }
          var fn = Expr.attrHandle[name.toLowerCase()], val = fn && hasOwn.call(Expr.attrHandle, name.toLowerCase()) ? fn(elem, name, !documentIsHTML) : void 0;
          if (val !== void 0) {
            return val;
          }
          return elem.getAttribute(name);
        };
        find.error = function(msg) {
          throw new Error("Syntax error, unrecognized expression: " + msg);
        };
        jQuery.uniqueSort = function(results) {
          var elem, duplicates = [], j = 0, i2 = 0;
          hasDuplicate = !support.sortStable;
          sortInput = !support.sortStable && slice.call(results, 0);
          sort.call(results, sortOrder);
          if (hasDuplicate) {
            while (elem = results[i2++]) {
              if (elem === results[i2]) {
                j = duplicates.push(i2);
              }
            }
            while (j--) {
              splice.call(results, duplicates[j], 1);
            }
          }
          sortInput = null;
          return results;
        };
        jQuery.fn.uniqueSort = function() {
          return this.pushStack(jQuery.uniqueSort(slice.apply(this)));
        };
        Expr = jQuery.expr = {
          // Can be adjusted by the user
          cacheLength: 50,
          createPseudo: markFunction,
          match: matchExpr,
          attrHandle: {},
          find: {},
          relative: {
            ">": { dir: "parentNode", first: true },
            " ": { dir: "parentNode" },
            "+": { dir: "previousSibling", first: true },
            "~": { dir: "previousSibling" }
          },
          preFilter: {
            ATTR: function(match) {
              match[1] = match[1].replace(runescape, funescape);
              match[3] = (match[3] || match[4] || match[5] || "").replace(runescape, funescape);
              if (match[2] === "~=") {
                match[3] = " " + match[3] + " ";
              }
              return match.slice(0, 4);
            },
            CHILD: function(match) {
              match[1] = match[1].toLowerCase();
              if (match[1].slice(0, 3) === "nth") {
                if (!match[3]) {
                  find.error(match[0]);
                }
                match[4] = +(match[4] ? match[5] + (match[6] || 1) : 2 * (match[3] === "even" || match[3] === "odd"));
                match[5] = +(match[7] + match[8] || match[3] === "odd");
              } else if (match[3]) {
                find.error(match[0]);
              }
              return match;
            },
            PSEUDO: function(match) {
              var excess, unquoted = !match[6] && match[2];
              if (matchExpr.CHILD.test(match[0])) {
                return null;
              }
              if (match[3]) {
                match[2] = match[4] || match[5] || "";
              } else if (unquoted && rpseudo.test(unquoted) && // Get excess from tokenize (recursively)
              (excess = tokenize(unquoted, true)) && // advance to the next closing parenthesis
              (excess = unquoted.indexOf(")", unquoted.length - excess) - unquoted.length)) {
                match[0] = match[0].slice(0, excess);
                match[2] = unquoted.slice(0, excess);
              }
              return match.slice(0, 3);
            }
          },
          filter: {
            TAG: function(nodeNameSelector) {
              var expectedNodeName = nodeNameSelector.replace(runescape, funescape).toLowerCase();
              return nodeNameSelector === "*" ? function() {
                return true;
              } : function(elem) {
                return nodeName(elem, expectedNodeName);
              };
            },
            CLASS: function(className) {
              var pattern = classCache[className + " "];
              return pattern || (pattern = new RegExp("(^|" + whitespace + ")" + className + "(" + whitespace + "|$)")) && classCache(className, function(elem) {
                return pattern.test(
                  typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || ""
                );
              });
            },
            ATTR: function(name, operator, check) {
              return function(elem) {
                var result = find.attr(elem, name);
                if (result == null) {
                  return operator === "!=";
                }
                if (!operator) {
                  return true;
                }
                result += "";
                if (operator === "=") {
                  return result === check;
                }
                if (operator === "!=") {
                  return result !== check;
                }
                if (operator === "^=") {
                  return check && result.indexOf(check) === 0;
                }
                if (operator === "*=") {
                  return check && result.indexOf(check) > -1;
                }
                if (operator === "$=") {
                  return check && result.slice(-check.length) === check;
                }
                if (operator === "~=") {
                  return (" " + result.replace(rwhitespace, " ") + " ").indexOf(check) > -1;
                }
                if (operator === "|=") {
                  return result === check || result.slice(0, check.length + 1) === check + "-";
                }
                return false;
              };
            },
            CHILD: function(type, what, _argument, first, last) {
              var simple = type.slice(0, 3) !== "nth", forward = type.slice(-4) !== "last", ofType = what === "of-type";
              return first === 1 && last === 0 ? (
                // Shortcut for :nth-*(n)
                function(elem) {
                  return !!elem.parentNode;
                }
              ) : function(elem, _context, xml) {
                var cache, outerCache, node, nodeIndex, start, dir2 = simple !== forward ? "nextSibling" : "previousSibling", parent = elem.parentNode, name = ofType && elem.nodeName.toLowerCase(), useCache = !xml && !ofType, diff = false;
                if (parent) {
                  if (simple) {
                    while (dir2) {
                      node = elem;
                      while (node = node[dir2]) {
                        if (ofType ? nodeName(node, name) : node.nodeType === 1) {
                          return false;
                        }
                      }
                      start = dir2 = type === "only" && !start && "nextSibling";
                    }
                    return true;
                  }
                  start = [forward ? parent.firstChild : parent.lastChild];
                  if (forward && useCache) {
                    outerCache = parent[expando] || (parent[expando] = {});
                    cache = outerCache[type] || [];
                    nodeIndex = cache[0] === dirruns && cache[1];
                    diff = nodeIndex && cache[2];
                    node = nodeIndex && parent.childNodes[nodeIndex];
                    while (node = ++nodeIndex && node && node[dir2] || // Fallback to seeking `elem` from the start
                    (diff = nodeIndex = 0) || start.pop()) {
                      if (node.nodeType === 1 && ++diff && node === elem) {
                        outerCache[type] = [dirruns, nodeIndex, diff];
                        break;
                      }
                    }
                  } else {
                    if (useCache) {
                      outerCache = elem[expando] || (elem[expando] = {});
                      cache = outerCache[type] || [];
                      nodeIndex = cache[0] === dirruns && cache[1];
                      diff = nodeIndex;
                    }
                    if (diff === false) {
                      while (node = ++nodeIndex && node && node[dir2] || (diff = nodeIndex = 0) || start.pop()) {
                        if ((ofType ? nodeName(node, name) : node.nodeType === 1) && ++diff) {
                          if (useCache) {
                            outerCache = node[expando] || (node[expando] = {});
                            outerCache[type] = [dirruns, diff];
                          }
                          if (node === elem) {
                            break;
                          }
                        }
                      }
                    }
                  }
                  diff -= last;
                  return diff === first || diff % first === 0 && diff / first >= 0;
                }
              };
            },
            PSEUDO: function(pseudo, argument) {
              var args, fn = Expr.pseudos[pseudo] || Expr.setFilters[pseudo.toLowerCase()] || find.error("unsupported pseudo: " + pseudo);
              if (fn[expando]) {
                return fn(argument);
              }
              if (fn.length > 1) {
                args = [pseudo, pseudo, "", argument];
                return Expr.setFilters.hasOwnProperty(pseudo.toLowerCase()) ? markFunction(function(seed, matches2) {
                  var idx, matched = fn(seed, argument), i2 = matched.length;
                  while (i2--) {
                    idx = indexOf.call(seed, matched[i2]);
                    seed[idx] = !(matches2[idx] = matched[i2]);
                  }
                }) : function(elem) {
                  return fn(elem, 0, args);
                };
              }
              return fn;
            }
          },
          pseudos: {
            // Potentially complex pseudos
            not: markFunction(function(selector) {
              var input = [], results = [], matcher = compile(selector.replace(rtrimCSS, "$1"));
              return matcher[expando] ? markFunction(function(seed, matches2, _context, xml) {
                var elem, unmatched = matcher(seed, null, xml, []), i2 = seed.length;
                while (i2--) {
                  if (elem = unmatched[i2]) {
                    seed[i2] = !(matches2[i2] = elem);
                  }
                }
              }) : function(elem, _context, xml) {
                input[0] = elem;
                matcher(input, null, xml, results);
                input[0] = null;
                return !results.pop();
              };
            }),
            has: markFunction(function(selector) {
              return function(elem) {
                return find(selector, elem).length > 0;
              };
            }),
            contains: markFunction(function(text) {
              text = text.replace(runescape, funescape);
              return function(elem) {
                return (elem.textContent || jQuery.text(elem)).indexOf(text) > -1;
              };
            }),
            // "Whether an element is represented by a :lang() selector
            // is based solely on the element's language value
            // being equal to the identifier C,
            // or beginning with the identifier C immediately followed by "-".
            // The matching of C against the element's language value is performed case-insensitively.
            // The identifier C does not have to be a valid language name."
            // https://www.w3.org/TR/selectors/#lang-pseudo
            lang: markFunction(function(lang) {
              if (!ridentifier.test(lang || "")) {
                find.error("unsupported lang: " + lang);
              }
              lang = lang.replace(runescape, funescape).toLowerCase();
              return function(elem) {
                var elemLang;
                do {
                  if (elemLang = documentIsHTML ? elem.lang : elem.getAttribute("xml:lang") || elem.getAttribute("lang")) {
                    elemLang = elemLang.toLowerCase();
                    return elemLang === lang || elemLang.indexOf(lang + "-") === 0;
                  }
                } while ((elem = elem.parentNode) && elem.nodeType === 1);
                return false;
              };
            }),
            // Miscellaneous
            target: function(elem) {
              var hash = window2.location && window2.location.hash;
              return hash && hash.slice(1) === elem.id;
            },
            root: function(elem) {
              return elem === documentElement2;
            },
            focus: function(elem) {
              return elem === safeActiveElement() && document3.hasFocus() && !!(elem.type || elem.href || ~elem.tabIndex);
            },
            // Boolean properties
            enabled: createDisabledPseudo(false),
            disabled: createDisabledPseudo(true),
            checked: function(elem) {
              return nodeName(elem, "input") && !!elem.checked || nodeName(elem, "option") && !!elem.selected;
            },
            selected: function(elem) {
              if (elem.parentNode) {
                elem.parentNode.selectedIndex;
              }
              return elem.selected === true;
            },
            // Contents
            empty: function(elem) {
              for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
                if (elem.nodeType < 6) {
                  return false;
                }
              }
              return true;
            },
            parent: function(elem) {
              return !Expr.pseudos.empty(elem);
            },
            // Element/input types
            header: function(elem) {
              return rheader.test(elem.nodeName);
            },
            input: function(elem) {
              return rinputs.test(elem.nodeName);
            },
            button: function(elem) {
              return nodeName(elem, "input") && elem.type === "button" || nodeName(elem, "button");
            },
            text: function(elem) {
              var attr;
              return nodeName(elem, "input") && elem.type === "text" && // Support: IE <10 only
              // New HTML5 attribute values (e.g., "search") appear
              // with elem.type === "text"
              ((attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text");
            },
            // Position-in-collection
            first: createPositionalPseudo(function() {
              return [0];
            }),
            last: createPositionalPseudo(function(_matchIndexes, length) {
              return [length - 1];
            }),
            eq: createPositionalPseudo(function(_matchIndexes, length, argument) {
              return [argument < 0 ? argument + length : argument];
            }),
            even: createPositionalPseudo(function(matchIndexes, length) {
              var i2 = 0;
              for (; i2 < length; i2 += 2) {
                matchIndexes.push(i2);
              }
              return matchIndexes;
            }),
            odd: createPositionalPseudo(function(matchIndexes, length) {
              var i2 = 1;
              for (; i2 < length; i2 += 2) {
                matchIndexes.push(i2);
              }
              return matchIndexes;
            }),
            lt: createPositionalPseudo(function(matchIndexes, length, argument) {
              var i2;
              if (argument < 0) {
                i2 = argument + length;
              } else if (argument > length) {
                i2 = length;
              } else {
                i2 = argument;
              }
              for (; --i2 >= 0; ) {
                matchIndexes.push(i2);
              }
              return matchIndexes;
            }),
            gt: createPositionalPseudo(function(matchIndexes, length, argument) {
              var i2 = argument < 0 ? argument + length : argument;
              for (; ++i2 < length; ) {
                matchIndexes.push(i2);
              }
              return matchIndexes;
            })
          }
        };
        Expr.pseudos.nth = Expr.pseudos.eq;
        for (i in { radio: true, checkbox: true, file: true, password: true, image: true }) {
          Expr.pseudos[i] = createInputPseudo(i);
        }
        for (i in { submit: true, reset: true }) {
          Expr.pseudos[i] = createButtonPseudo(i);
        }
        function setFilters() {
        }
        setFilters.prototype = Expr.filters = Expr.pseudos;
        Expr.setFilters = new setFilters();
        function tokenize(selector, parseOnly) {
          var matched, match, tokens, type, soFar, groups, preFilters, cached = tokenCache[selector + " "];
          if (cached) {
            return parseOnly ? 0 : cached.slice(0);
          }
          soFar = selector;
          groups = [];
          preFilters = Expr.preFilter;
          while (soFar) {
            if (!matched || (match = rcomma.exec(soFar))) {
              if (match) {
                soFar = soFar.slice(match[0].length) || soFar;
              }
              groups.push(tokens = []);
            }
            matched = false;
            if (match = rleadingCombinator.exec(soFar)) {
              matched = match.shift();
              tokens.push({
                value: matched,
                // Cast descendant combinators to space
                type: match[0].replace(rtrimCSS, " ")
              });
              soFar = soFar.slice(matched.length);
            }
            for (type in Expr.filter) {
              if ((match = matchExpr[type].exec(soFar)) && (!preFilters[type] || (match = preFilters[type](match)))) {
                matched = match.shift();
                tokens.push({
                  value: matched,
                  type,
                  matches: match
                });
                soFar = soFar.slice(matched.length);
              }
            }
            if (!matched) {
              break;
            }
          }
          if (parseOnly) {
            return soFar.length;
          }
          return soFar ? find.error(selector) : (
            // Cache the tokens
            tokenCache(selector, groups).slice(0)
          );
        }
        function toSelector(tokens) {
          var i2 = 0, len = tokens.length, selector = "";
          for (; i2 < len; i2++) {
            selector += tokens[i2].value;
          }
          return selector;
        }
        function addCombinator(matcher, combinator, base) {
          var dir2 = combinator.dir, skip = combinator.next, key = skip || dir2, checkNonElements = base && key === "parentNode", doneName = done++;
          return combinator.first ? (
            // Check against closest ancestor/preceding element
            function(elem, context2, xml) {
              while (elem = elem[dir2]) {
                if (elem.nodeType === 1 || checkNonElements) {
                  return matcher(elem, context2, xml);
                }
              }
              return false;
            }
          ) : (
            // Check against all ancestor/preceding elements
            function(elem, context2, xml) {
              var oldCache, outerCache, newCache = [dirruns, doneName];
              if (xml) {
                while (elem = elem[dir2]) {
                  if (elem.nodeType === 1 || checkNonElements) {
                    if (matcher(elem, context2, xml)) {
                      return true;
                    }
                  }
                }
              } else {
                while (elem = elem[dir2]) {
                  if (elem.nodeType === 1 || checkNonElements) {
                    outerCache = elem[expando] || (elem[expando] = {});
                    if (skip && nodeName(elem, skip)) {
                      elem = elem[dir2] || elem;
                    } else if ((oldCache = outerCache[key]) && oldCache[0] === dirruns && oldCache[1] === doneName) {
                      return newCache[2] = oldCache[2];
                    } else {
                      outerCache[key] = newCache;
                      if (newCache[2] = matcher(elem, context2, xml)) {
                        return true;
                      }
                    }
                  }
                }
              }
              return false;
            }
          );
        }
        function elementMatcher(matchers) {
          return matchers.length > 1 ? function(elem, context2, xml) {
            var i2 = matchers.length;
            while (i2--) {
              if (!matchers[i2](elem, context2, xml)) {
                return false;
              }
            }
            return true;
          } : matchers[0];
        }
        function multipleContexts(selector, contexts, results) {
          var i2 = 0, len = contexts.length;
          for (; i2 < len; i2++) {
            find(selector, contexts[i2], results);
          }
          return results;
        }
        function condense(unmatched, map, filter, context2, xml) {
          var elem, newUnmatched = [], i2 = 0, len = unmatched.length, mapped = map != null;
          for (; i2 < len; i2++) {
            if (elem = unmatched[i2]) {
              if (!filter || filter(elem, context2, xml)) {
                newUnmatched.push(elem);
                if (mapped) {
                  map.push(i2);
                }
              }
            }
          }
          return newUnmatched;
        }
        function setMatcher(preFilter, selector, matcher, postFilter, postFinder, postSelector) {
          if (postFilter && !postFilter[expando]) {
            postFilter = setMatcher(postFilter);
          }
          if (postFinder && !postFinder[expando]) {
            postFinder = setMatcher(postFinder, postSelector);
          }
          return markFunction(function(seed, results, context2, xml) {
            var temp, i2, elem, matcherOut, preMap = [], postMap = [], preexisting = results.length, elems = seed || multipleContexts(
              selector || "*",
              context2.nodeType ? [context2] : context2,
              []
            ), matcherIn = preFilter && (seed || !selector) ? condense(elems, preMap, preFilter, context2, xml) : elems;
            if (matcher) {
              matcherOut = postFinder || (seed ? preFilter : preexisting || postFilter) ? (
                // ...intermediate processing is necessary
                []
              ) : (
                // ...otherwise use results directly
                results
              );
              matcher(matcherIn, matcherOut, context2, xml);
            } else {
              matcherOut = matcherIn;
            }
            if (postFilter) {
              temp = condense(matcherOut, postMap);
              postFilter(temp, [], context2, xml);
              i2 = temp.length;
              while (i2--) {
                if (elem = temp[i2]) {
                  matcherOut[postMap[i2]] = !(matcherIn[postMap[i2]] = elem);
                }
              }
            }
            if (seed) {
              if (postFinder || preFilter) {
                if (postFinder) {
                  temp = [];
                  i2 = matcherOut.length;
                  while (i2--) {
                    if (elem = matcherOut[i2]) {
                      temp.push(matcherIn[i2] = elem);
                    }
                  }
                  postFinder(null, matcherOut = [], temp, xml);
                }
                i2 = matcherOut.length;
                while (i2--) {
                  if ((elem = matcherOut[i2]) && (temp = postFinder ? indexOf.call(seed, elem) : preMap[i2]) > -1) {
                    seed[temp] = !(results[temp] = elem);
                  }
                }
              }
            } else {
              matcherOut = condense(
                matcherOut === results ? matcherOut.splice(preexisting, matcherOut.length) : matcherOut
              );
              if (postFinder) {
                postFinder(null, results, matcherOut, xml);
              } else {
                push2.apply(results, matcherOut);
              }
            }
          });
        }
        function matcherFromTokens(tokens) {
          var checkContext, matcher, j, len = tokens.length, leadingRelative = Expr.relative[tokens[0].type], implicitRelative = leadingRelative || Expr.relative[" "], i2 = leadingRelative ? 1 : 0, matchContext = addCombinator(function(elem) {
            return elem === checkContext;
          }, implicitRelative, true), matchAnyContext = addCombinator(function(elem) {
            return indexOf.call(checkContext, elem) > -1;
          }, implicitRelative, true), matchers = [function(elem, context2, xml) {
            var ret = !leadingRelative && (xml || context2 != outermostContext) || ((checkContext = context2).nodeType ? matchContext(elem, context2, xml) : matchAnyContext(elem, context2, xml));
            checkContext = null;
            return ret;
          }];
          for (; i2 < len; i2++) {
            if (matcher = Expr.relative[tokens[i2].type]) {
              matchers = [addCombinator(elementMatcher(matchers), matcher)];
            } else {
              matcher = Expr.filter[tokens[i2].type].apply(null, tokens[i2].matches);
              if (matcher[expando]) {
                j = ++i2;
                for (; j < len; j++) {
                  if (Expr.relative[tokens[j].type]) {
                    break;
                  }
                }
                return setMatcher(
                  i2 > 1 && elementMatcher(matchers),
                  i2 > 1 && toSelector(
                    // If the preceding token was a descendant combinator, insert an implicit any-element `*`
                    tokens.slice(0, i2 - 1).concat({ value: tokens[i2 - 2].type === " " ? "*" : "" })
                  ).replace(rtrimCSS, "$1"),
                  matcher,
                  i2 < j && matcherFromTokens(tokens.slice(i2, j)),
                  j < len && matcherFromTokens(tokens = tokens.slice(j)),
                  j < len && toSelector(tokens)
                );
              }
              matchers.push(matcher);
            }
          }
          return elementMatcher(matchers);
        }
        function matcherFromGroupMatchers(elementMatchers, setMatchers) {
          var bySet = setMatchers.length > 0, byElement = elementMatchers.length > 0, superMatcher = function(seed, context2, xml, results, outermost) {
            var elem, j, matcher, matchedCount = 0, i2 = "0", unmatched = seed && [], setMatched = [], contextBackup = outermostContext, elems = seed || byElement && Expr.find.TAG("*", outermost), dirrunsUnique = dirruns += contextBackup == null ? 1 : Math.random() || 0.1, len = elems.length;
            if (outermost) {
              outermostContext = context2 == document3 || context2 || outermost;
            }
            for (; i2 !== len && (elem = elems[i2]) != null; i2++) {
              if (byElement && elem) {
                j = 0;
                if (!context2 && elem.ownerDocument != document3) {
                  setDocument(elem);
                  xml = !documentIsHTML;
                }
                while (matcher = elementMatchers[j++]) {
                  if (matcher(elem, context2 || document3, xml)) {
                    push2.call(results, elem);
                    break;
                  }
                }
                if (outermost) {
                  dirruns = dirrunsUnique;
                }
              }
              if (bySet) {
                if (elem = !matcher && elem) {
                  matchedCount--;
                }
                if (seed) {
                  unmatched.push(elem);
                }
              }
            }
            matchedCount += i2;
            if (bySet && i2 !== matchedCount) {
              j = 0;
              while (matcher = setMatchers[j++]) {
                matcher(unmatched, setMatched, context2, xml);
              }
              if (seed) {
                if (matchedCount > 0) {
                  while (i2--) {
                    if (!(unmatched[i2] || setMatched[i2])) {
                      setMatched[i2] = pop.call(results);
                    }
                  }
                }
                setMatched = condense(setMatched);
              }
              push2.apply(results, setMatched);
              if (outermost && !seed && setMatched.length > 0 && matchedCount + setMatchers.length > 1) {
                jQuery.uniqueSort(results);
              }
            }
            if (outermost) {
              dirruns = dirrunsUnique;
              outermostContext = contextBackup;
            }
            return unmatched;
          };
          return bySet ? markFunction(superMatcher) : superMatcher;
        }
        function compile(selector, match) {
          var i2, setMatchers = [], elementMatchers = [], cached = compilerCache[selector + " "];
          if (!cached) {
            if (!match) {
              match = tokenize(selector);
            }
            i2 = match.length;
            while (i2--) {
              cached = matcherFromTokens(match[i2]);
              if (cached[expando]) {
                setMatchers.push(cached);
              } else {
                elementMatchers.push(cached);
              }
            }
            cached = compilerCache(
              selector,
              matcherFromGroupMatchers(elementMatchers, setMatchers)
            );
            cached.selector = selector;
          }
          return cached;
        }
        function select(selector, context2, results, seed) {
          var i2, tokens, token, type, find2, compiled = typeof selector === "function" && selector, match = !seed && tokenize(selector = compiled.selector || selector);
          results = results || [];
          if (match.length === 1) {
            tokens = match[0] = match[0].slice(0);
            if (tokens.length > 2 && (token = tokens[0]).type === "ID" && context2.nodeType === 9 && documentIsHTML && Expr.relative[tokens[1].type]) {
              context2 = (Expr.find.ID(
                token.matches[0].replace(runescape, funescape),
                context2
              ) || [])[0];
              if (!context2) {
                return results;
              } else if (compiled) {
                context2 = context2.parentNode;
              }
              selector = selector.slice(tokens.shift().value.length);
            }
            i2 = matchExpr.needsContext.test(selector) ? 0 : tokens.length;
            while (i2--) {
              token = tokens[i2];
              if (Expr.relative[type = token.type]) {
                break;
              }
              if (find2 = Expr.find[type]) {
                if (seed = find2(
                  token.matches[0].replace(runescape, funescape),
                  rsibling.test(tokens[0].type) && testContext(context2.parentNode) || context2
                )) {
                  tokens.splice(i2, 1);
                  selector = seed.length && toSelector(tokens);
                  if (!selector) {
                    push2.apply(results, seed);
                    return results;
                  }
                  break;
                }
              }
            }
          }
          (compiled || compile(selector, match))(
            seed,
            context2,
            !documentIsHTML,
            results,
            !context2 || rsibling.test(selector) && testContext(context2.parentNode) || context2
          );
          return results;
        }
        support.sortStable = expando.split("").sort(sortOrder).join("") === expando;
        setDocument();
        support.sortDetached = assert(function(el) {
          return el.compareDocumentPosition(document3.createElement("fieldset")) & 1;
        });
        jQuery.find = find;
        jQuery.expr[":"] = jQuery.expr.pseudos;
        jQuery.unique = jQuery.uniqueSort;
        find.compile = compile;
        find.select = select;
        find.setDocument = setDocument;
        find.tokenize = tokenize;
        find.escape = jQuery.escapeSelector;
        find.getText = jQuery.text;
        find.isXML = jQuery.isXMLDoc;
        find.selectors = jQuery.expr;
        find.support = jQuery.support;
        find.uniqueSort = jQuery.uniqueSort;
      })();
      var dir = function(elem, dir2, until) {
        var matched = [], truncate = until !== void 0;
        while ((elem = elem[dir2]) && elem.nodeType !== 9) {
          if (elem.nodeType === 1) {
            if (truncate && jQuery(elem).is(until)) {
              break;
            }
            matched.push(elem);
          }
        }
        return matched;
      };
      var siblings = function(n, elem) {
        var matched = [];
        for (; n; n = n.nextSibling) {
          if (n.nodeType === 1 && n !== elem) {
            matched.push(n);
          }
        }
        return matched;
      };
      var rneedsContext = jQuery.expr.match.needsContext;
      var rsingleTag = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;
      function winnow(elements, qualifier, not) {
        if (isFunction(qualifier)) {
          return jQuery.grep(elements, function(elem, i) {
            return !!qualifier.call(elem, i, elem) !== not;
          });
        }
        if (qualifier.nodeType) {
          return jQuery.grep(elements, function(elem) {
            return elem === qualifier !== not;
          });
        }
        if (typeof qualifier !== "string") {
          return jQuery.grep(elements, function(elem) {
            return indexOf.call(qualifier, elem) > -1 !== not;
          });
        }
        return jQuery.filter(qualifier, elements, not);
      }
      jQuery.filter = function(expr, elems, not) {
        var elem = elems[0];
        if (not) {
          expr = ":not(" + expr + ")";
        }
        if (elems.length === 1 && elem.nodeType === 1) {
          return jQuery.find.matchesSelector(elem, expr) ? [elem] : [];
        }
        return jQuery.find.matches(expr, jQuery.grep(elems, function(elem2) {
          return elem2.nodeType === 1;
        }));
      };
      jQuery.fn.extend({
        find: function(selector) {
          var i, ret, len = this.length, self = this;
          if (typeof selector !== "string") {
            return this.pushStack(jQuery(selector).filter(function() {
              for (i = 0; i < len; i++) {
                if (jQuery.contains(self[i], this)) {
                  return true;
                }
              }
            }));
          }
          ret = this.pushStack([]);
          for (i = 0; i < len; i++) {
            jQuery.find(selector, self[i], ret);
          }
          return len > 1 ? jQuery.uniqueSort(ret) : ret;
        },
        filter: function(selector) {
          return this.pushStack(winnow(this, selector || [], false));
        },
        not: function(selector) {
          return this.pushStack(winnow(this, selector || [], true));
        },
        is: function(selector) {
          return !!winnow(
            this,
            // If this is a positional/relative selector, check membership in the returned set
            // so $("p:first").is("p:last") won't return true for a doc with two "p".
            typeof selector === "string" && rneedsContext.test(selector) ? jQuery(selector) : selector || [],
            false
          ).length;
        }
      });
      var rootjQuery, rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/, init2 = jQuery.fn.init = function(selector, context2, root) {
        var match, elem;
        if (!selector) {
          return this;
        }
        root = root || rootjQuery;
        if (typeof selector === "string") {
          if (selector[0] === "<" && selector[selector.length - 1] === ">" && selector.length >= 3) {
            match = [null, selector, null];
          } else {
            match = rquickExpr.exec(selector);
          }
          if (match && (match[1] || !context2)) {
            if (match[1]) {
              context2 = context2 instanceof jQuery ? context2[0] : context2;
              jQuery.merge(this, jQuery.parseHTML(
                match[1],
                context2 && context2.nodeType ? context2.ownerDocument || context2 : document2,
                true
              ));
              if (rsingleTag.test(match[1]) && jQuery.isPlainObject(context2)) {
                for (match in context2) {
                  if (isFunction(this[match])) {
                    this[match](context2[match]);
                  } else {
                    this.attr(match, context2[match]);
                  }
                }
              }
              return this;
            } else {
              elem = document2.getElementById(match[2]);
              if (elem) {
                this[0] = elem;
                this.length = 1;
              }
              return this;
            }
          } else if (!context2 || context2.jquery) {
            return (context2 || root).find(selector);
          } else {
            return this.constructor(context2).find(selector);
          }
        } else if (selector.nodeType) {
          this[0] = selector;
          this.length = 1;
          return this;
        } else if (isFunction(selector)) {
          return root.ready !== void 0 ? root.ready(selector) : (
            // Execute immediately if ready is not present
            selector(jQuery)
          );
        }
        return jQuery.makeArray(selector, this);
      };
      init2.prototype = jQuery.fn;
      rootjQuery = jQuery(document2);
      var rparentsprev = /^(?:parents|prev(?:Until|All))/, guaranteedUnique = {
        children: true,
        contents: true,
        next: true,
        prev: true
      };
      jQuery.fn.extend({
        has: function(target) {
          var targets = jQuery(target, this), l = targets.length;
          return this.filter(function() {
            var i = 0;
            for (; i < l; i++) {
              if (jQuery.contains(this, targets[i])) {
                return true;
              }
            }
          });
        },
        closest: function(selectors, context2) {
          var cur, i = 0, l = this.length, matched = [], targets = typeof selectors !== "string" && jQuery(selectors);
          if (!rneedsContext.test(selectors)) {
            for (; i < l; i++) {
              for (cur = this[i]; cur && cur !== context2; cur = cur.parentNode) {
                if (cur.nodeType < 11 && (targets ? targets.index(cur) > -1 : (
                  // Don't pass non-elements to jQuery#find
                  cur.nodeType === 1 && jQuery.find.matchesSelector(cur, selectors)
                ))) {
                  matched.push(cur);
                  break;
                }
              }
            }
          }
          return this.pushStack(matched.length > 1 ? jQuery.uniqueSort(matched) : matched);
        },
        // Determine the position of an element within the set
        index: function(elem) {
          if (!elem) {
            return this[0] && this[0].parentNode ? this.first().prevAll().length : -1;
          }
          if (typeof elem === "string") {
            return indexOf.call(jQuery(elem), this[0]);
          }
          return indexOf.call(
            this,
            // If it receives a jQuery object, the first element is used
            elem.jquery ? elem[0] : elem
          );
        },
        add: function(selector, context2) {
          return this.pushStack(
            jQuery.uniqueSort(
              jQuery.merge(this.get(), jQuery(selector, context2))
            )
          );
        },
        addBack: function(selector) {
          return this.add(
            selector == null ? this.prevObject : this.prevObject.filter(selector)
          );
        }
      });
      function sibling(cur, dir2) {
        while ((cur = cur[dir2]) && cur.nodeType !== 1) {
        }
        return cur;
      }
      jQuery.each({
        parent: function(elem) {
          var parent = elem.parentNode;
          return parent && parent.nodeType !== 11 ? parent : null;
        },
        parents: function(elem) {
          return dir(elem, "parentNode");
        },
        parentsUntil: function(elem, _i, until) {
          return dir(elem, "parentNode", until);
        },
        next: function(elem) {
          return sibling(elem, "nextSibling");
        },
        prev: function(elem) {
          return sibling(elem, "previousSibling");
        },
        nextAll: function(elem) {
          return dir(elem, "nextSibling");
        },
        prevAll: function(elem) {
          return dir(elem, "previousSibling");
        },
        nextUntil: function(elem, _i, until) {
          return dir(elem, "nextSibling", until);
        },
        prevUntil: function(elem, _i, until) {
          return dir(elem, "previousSibling", until);
        },
        siblings: function(elem) {
          return siblings((elem.parentNode || {}).firstChild, elem);
        },
        children: function(elem) {
          return siblings(elem.firstChild);
        },
        contents: function(elem) {
          if (elem.contentDocument != null && // Support: IE 11+
          // <object> elements with no `data` attribute has an object
          // `contentDocument` with a `null` prototype.
          getProto(elem.contentDocument)) {
            return elem.contentDocument;
          }
          if (nodeName(elem, "template")) {
            elem = elem.content || elem;
          }
          return jQuery.merge([], elem.childNodes);
        }
      }, function(name, fn) {
        jQuery.fn[name] = function(until, selector) {
          var matched = jQuery.map(this, fn, until);
          if (name.slice(-5) !== "Until") {
            selector = until;
          }
          if (selector && typeof selector === "string") {
            matched = jQuery.filter(selector, matched);
          }
          if (this.length > 1) {
            if (!guaranteedUnique[name]) {
              jQuery.uniqueSort(matched);
            }
            if (rparentsprev.test(name)) {
              matched.reverse();
            }
          }
          return this.pushStack(matched);
        };
      });
      var rnothtmlwhite = /[^\x20\t\r\n\f]+/g;
      function createOptions(options) {
        var object = {};
        jQuery.each(options.match(rnothtmlwhite) || [], function(_, flag) {
          object[flag] = true;
        });
        return object;
      }
      jQuery.Callbacks = function(options) {
        options = typeof options === "string" ? createOptions(options) : jQuery.extend({}, options);
        var firing, memory, fired, locked, list = [], queue = [], firingIndex = -1, fire = function() {
          locked = locked || options.once;
          fired = firing = true;
          for (; queue.length; firingIndex = -1) {
            memory = queue.shift();
            while (++firingIndex < list.length) {
              if (list[firingIndex].apply(memory[0], memory[1]) === false && options.stopOnFalse) {
                firingIndex = list.length;
                memory = false;
              }
            }
          }
          if (!options.memory) {
            memory = false;
          }
          firing = false;
          if (locked) {
            if (memory) {
              list = [];
            } else {
              list = "";
            }
          }
        }, self = {
          // Add a callback or a collection of callbacks to the list
          add: function() {
            if (list) {
              if (memory && !firing) {
                firingIndex = list.length - 1;
                queue.push(memory);
              }
              (function add(args) {
                jQuery.each(args, function(_, arg) {
                  if (isFunction(arg)) {
                    if (!options.unique || !self.has(arg)) {
                      list.push(arg);
                    }
                  } else if (arg && arg.length && toType(arg) !== "string") {
                    add(arg);
                  }
                });
              })(arguments);
              if (memory && !firing) {
                fire();
              }
            }
            return this;
          },
          // Remove a callback from the list
          remove: function() {
            jQuery.each(arguments, function(_, arg) {
              var index;
              while ((index = jQuery.inArray(arg, list, index)) > -1) {
                list.splice(index, 1);
                if (index <= firingIndex) {
                  firingIndex--;
                }
              }
            });
            return this;
          },
          // Check if a given callback is in the list.
          // If no argument is given, return whether or not list has callbacks attached.
          has: function(fn) {
            return fn ? jQuery.inArray(fn, list) > -1 : list.length > 0;
          },
          // Remove all callbacks from the list
          empty: function() {
            if (list) {
              list = [];
            }
            return this;
          },
          // Disable .fire and .add
          // Abort any current/pending executions
          // Clear all callbacks and values
          disable: function() {
            locked = queue = [];
            list = memory = "";
            return this;
          },
          disabled: function() {
            return !list;
          },
          // Disable .fire
          // Also disable .add unless we have memory (since it would have no effect)
          // Abort any pending executions
          lock: function() {
            locked = queue = [];
            if (!memory && !firing) {
              list = memory = "";
            }
            return this;
          },
          locked: function() {
            return !!locked;
          },
          // Call all callbacks with the given context and arguments
          fireWith: function(context2, args) {
            if (!locked) {
              args = args || [];
              args = [context2, args.slice ? args.slice() : args];
              queue.push(args);
              if (!firing) {
                fire();
              }
            }
            return this;
          },
          // Call all the callbacks with the given arguments
          fire: function() {
            self.fireWith(this, arguments);
            return this;
          },
          // To know if the callbacks have already been called at least once
          fired: function() {
            return !!fired;
          }
        };
        return self;
      };
      function Identity(v) {
        return v;
      }
      function Thrower(ex) {
        throw ex;
      }
      function adoptValue(value, resolve, reject, noValue) {
        var method;
        try {
          if (value && isFunction(method = value.promise)) {
            method.call(value).done(resolve).fail(reject);
          } else if (value && isFunction(method = value.then)) {
            method.call(value, resolve, reject);
          } else {
            resolve.apply(void 0, [value].slice(noValue));
          }
        } catch (value2) {
          reject.apply(void 0, [value2]);
        }
      }
      jQuery.extend({
        Deferred: function(func) {
          var tuples = [
            // action, add listener, callbacks,
            // ... .then handlers, argument index, [final state]
            [
              "notify",
              "progress",
              jQuery.Callbacks("memory"),
              jQuery.Callbacks("memory"),
              2
            ],
            [
              "resolve",
              "done",
              jQuery.Callbacks("once memory"),
              jQuery.Callbacks("once memory"),
              0,
              "resolved"
            ],
            [
              "reject",
              "fail",
              jQuery.Callbacks("once memory"),
              jQuery.Callbacks("once memory"),
              1,
              "rejected"
            ]
          ], state2 = "pending", promise = {
            state: function() {
              return state2;
            },
            always: function() {
              deferred.done(arguments).fail(arguments);
              return this;
            },
            "catch": function(fn) {
              return promise.then(null, fn);
            },
            // Keep pipe for back-compat
            pipe: function() {
              var fns = arguments;
              return jQuery.Deferred(function(newDefer) {
                jQuery.each(tuples, function(_i, tuple) {
                  var fn = isFunction(fns[tuple[4]]) && fns[tuple[4]];
                  deferred[tuple[1]](function() {
                    var returned = fn && fn.apply(this, arguments);
                    if (returned && isFunction(returned.promise)) {
                      returned.promise().progress(newDefer.notify).done(newDefer.resolve).fail(newDefer.reject);
                    } else {
                      newDefer[tuple[0] + "With"](
                        this,
                        fn ? [returned] : arguments
                      );
                    }
                  });
                });
                fns = null;
              }).promise();
            },
            then: function(onFulfilled, onRejected, onProgress) {
              var maxDepth = 0;
              function resolve(depth, deferred2, handler, special) {
                return function() {
                  var that = this, args = arguments, mightThrow = function() {
                    var returned, then;
                    if (depth < maxDepth) {
                      return;
                    }
                    returned = handler.apply(that, args);
                    if (returned === deferred2.promise()) {
                      throw new TypeError("Thenable self-resolution");
                    }
                    then = returned && // Support: Promises/A+ section 2.3.4
                    // https://promisesaplus.com/#point-64
                    // Only check objects and functions for thenability
                    (typeof returned === "object" || typeof returned === "function") && returned.then;
                    if (isFunction(then)) {
                      if (special) {
                        then.call(
                          returned,
                          resolve(maxDepth, deferred2, Identity, special),
                          resolve(maxDepth, deferred2, Thrower, special)
                        );
                      } else {
                        maxDepth++;
                        then.call(
                          returned,
                          resolve(maxDepth, deferred2, Identity, special),
                          resolve(maxDepth, deferred2, Thrower, special),
                          resolve(
                            maxDepth,
                            deferred2,
                            Identity,
                            deferred2.notifyWith
                          )
                        );
                      }
                    } else {
                      if (handler !== Identity) {
                        that = void 0;
                        args = [returned];
                      }
                      (special || deferred2.resolveWith)(that, args);
                    }
                  }, process2 = special ? mightThrow : function() {
                    try {
                      mightThrow();
                    } catch (e) {
                      if (jQuery.Deferred.exceptionHook) {
                        jQuery.Deferred.exceptionHook(
                          e,
                          process2.error
                        );
                      }
                      if (depth + 1 >= maxDepth) {
                        if (handler !== Thrower) {
                          that = void 0;
                          args = [e];
                        }
                        deferred2.rejectWith(that, args);
                      }
                    }
                  };
                  if (depth) {
                    process2();
                  } else {
                    if (jQuery.Deferred.getErrorHook) {
                      process2.error = jQuery.Deferred.getErrorHook();
                    } else if (jQuery.Deferred.getStackHook) {
                      process2.error = jQuery.Deferred.getStackHook();
                    }
                    window2.setTimeout(process2);
                  }
                };
              }
              return jQuery.Deferred(function(newDefer) {
                tuples[0][3].add(
                  resolve(
                    0,
                    newDefer,
                    isFunction(onProgress) ? onProgress : Identity,
                    newDefer.notifyWith
                  )
                );
                tuples[1][3].add(
                  resolve(
                    0,
                    newDefer,
                    isFunction(onFulfilled) ? onFulfilled : Identity
                  )
                );
                tuples[2][3].add(
                  resolve(
                    0,
                    newDefer,
                    isFunction(onRejected) ? onRejected : Thrower
                  )
                );
              }).promise();
            },
            // Get a promise for this deferred
            // If obj is provided, the promise aspect is added to the object
            promise: function(obj) {
              return obj != null ? jQuery.extend(obj, promise) : promise;
            }
          }, deferred = {};
          jQuery.each(tuples, function(i, tuple) {
            var list = tuple[2], stateString = tuple[5];
            promise[tuple[1]] = list.add;
            if (stateString) {
              list.add(
                function() {
                  state2 = stateString;
                },
                // rejected_callbacks.disable
                // fulfilled_callbacks.disable
                tuples[3 - i][2].disable,
                // rejected_handlers.disable
                // fulfilled_handlers.disable
                tuples[3 - i][3].disable,
                // progress_callbacks.lock
                tuples[0][2].lock,
                // progress_handlers.lock
                tuples[0][3].lock
              );
            }
            list.add(tuple[3].fire);
            deferred[tuple[0]] = function() {
              deferred[tuple[0] + "With"](this === deferred ? void 0 : this, arguments);
              return this;
            };
            deferred[tuple[0] + "With"] = list.fireWith;
          });
          promise.promise(deferred);
          if (func) {
            func.call(deferred, deferred);
          }
          return deferred;
        },
        // Deferred helper
        when: function(singleValue) {
          var remaining = arguments.length, i = remaining, resolveContexts = Array(i), resolveValues = slice.call(arguments), primary = jQuery.Deferred(), updateFunc = function(i2) {
            return function(value) {
              resolveContexts[i2] = this;
              resolveValues[i2] = arguments.length > 1 ? slice.call(arguments) : value;
              if (!--remaining) {
                primary.resolveWith(resolveContexts, resolveValues);
              }
            };
          };
          if (remaining <= 1) {
            adoptValue(
              singleValue,
              primary.done(updateFunc(i)).resolve,
              primary.reject,
              !remaining
            );
            if (primary.state() === "pending" || isFunction(resolveValues[i] && resolveValues[i].then)) {
              return primary.then();
            }
          }
          while (i--) {
            adoptValue(resolveValues[i], updateFunc(i), primary.reject);
          }
          return primary.promise();
        }
      });
      var rerrorNames = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;
      jQuery.Deferred.exceptionHook = function(error, asyncError) {
        if (window2.console && window2.console.warn && error && rerrorNames.test(error.name)) {
          window2.console.warn(
            "jQuery.Deferred exception: " + error.message,
            error.stack,
            asyncError
          );
        }
      };
      jQuery.readyException = function(error) {
        window2.setTimeout(function() {
          throw error;
        });
      };
      var readyList = jQuery.Deferred();
      jQuery.fn.ready = function(fn) {
        readyList.then(fn).catch(function(error) {
          jQuery.readyException(error);
        });
        return this;
      };
      jQuery.extend({
        // Is the DOM ready to be used? Set to true once it occurs.
        isReady: false,
        // A counter to track how many items to wait for before
        // the ready event fires. See trac-6781
        readyWait: 1,
        // Handle when the DOM is ready
        ready: function(wait) {
          if (wait === true ? --jQuery.readyWait : jQuery.isReady) {
            return;
          }
          jQuery.isReady = true;
          if (wait !== true && --jQuery.readyWait > 0) {
            return;
          }
          readyList.resolveWith(document2, [jQuery]);
        }
      });
      jQuery.ready.then = readyList.then;
      function completed() {
        document2.removeEventListener("DOMContentLoaded", completed);
        window2.removeEventListener("load", completed);
        jQuery.ready();
      }
      if (document2.readyState === "complete" || document2.readyState !== "loading" && !document2.documentElement.doScroll) {
        window2.setTimeout(jQuery.ready);
      } else {
        document2.addEventListener("DOMContentLoaded", completed);
        window2.addEventListener("load", completed);
      }
      var access = function(elems, fn, key, value, chainable, emptyGet, raw) {
        var i = 0, len = elems.length, bulk = key == null;
        if (toType(key) === "object") {
          chainable = true;
          for (i in key) {
            access(elems, fn, i, key[i], true, emptyGet, raw);
          }
        } else if (value !== void 0) {
          chainable = true;
          if (!isFunction(value)) {
            raw = true;
          }
          if (bulk) {
            if (raw) {
              fn.call(elems, value);
              fn = null;
            } else {
              bulk = fn;
              fn = function(elem, _key, value2) {
                return bulk.call(jQuery(elem), value2);
              };
            }
          }
          if (fn) {
            for (; i < len; i++) {
              fn(
                elems[i],
                key,
                raw ? value : value.call(elems[i], i, fn(elems[i], key))
              );
            }
          }
        }
        if (chainable) {
          return elems;
        }
        if (bulk) {
          return fn.call(elems);
        }
        return len ? fn(elems[0], key) : emptyGet;
      };
      var rmsPrefix = /^-ms-/, rdashAlpha = /-([a-z])/g;
      function fcamelCase(_all, letter) {
        return letter.toUpperCase();
      }
      function camelCase(string) {
        return string.replace(rmsPrefix, "ms-").replace(rdashAlpha, fcamelCase);
      }
      var acceptData = function(owner) {
        return owner.nodeType === 1 || owner.nodeType === 9 || !+owner.nodeType;
      };
      function Data() {
        this.expando = jQuery.expando + Data.uid++;
      }
      Data.uid = 1;
      Data.prototype = {
        cache: function(owner) {
          var value = owner[this.expando];
          if (!value) {
            value = {};
            if (acceptData(owner)) {
              if (owner.nodeType) {
                owner[this.expando] = value;
              } else {
                Object.defineProperty(owner, this.expando, {
                  value,
                  configurable: true
                });
              }
            }
          }
          return value;
        },
        set: function(owner, data2, value) {
          var prop, cache = this.cache(owner);
          if (typeof data2 === "string") {
            cache[camelCase(data2)] = value;
          } else {
            for (prop in data2) {
              cache[camelCase(prop)] = data2[prop];
            }
          }
          return cache;
        },
        get: function(owner, key) {
          return key === void 0 ? this.cache(owner) : (
            // Always use camelCase key (gh-2257)
            owner[this.expando] && owner[this.expando][camelCase(key)]
          );
        },
        access: function(owner, key, value) {
          if (key === void 0 || key && typeof key === "string" && value === void 0) {
            return this.get(owner, key);
          }
          this.set(owner, key, value);
          return value !== void 0 ? value : key;
        },
        remove: function(owner, key) {
          var i, cache = owner[this.expando];
          if (cache === void 0) {
            return;
          }
          if (key !== void 0) {
            if (Array.isArray(key)) {
              key = key.map(camelCase);
            } else {
              key = camelCase(key);
              key = key in cache ? [key] : key.match(rnothtmlwhite) || [];
            }
            i = key.length;
            while (i--) {
              delete cache[key[i]];
            }
          }
          if (key === void 0 || jQuery.isEmptyObject(cache)) {
            if (owner.nodeType) {
              owner[this.expando] = void 0;
            } else {
              delete owner[this.expando];
            }
          }
        },
        hasData: function(owner) {
          var cache = owner[this.expando];
          return cache !== void 0 && !jQuery.isEmptyObject(cache);
        }
      };
      var dataPriv = new Data();
      var dataUser = new Data();
      var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/, rmultiDash = /[A-Z]/g;
      function getData(data2) {
        if (data2 === "true") {
          return true;
        }
        if (data2 === "false") {
          return false;
        }
        if (data2 === "null") {
          return null;
        }
        if (data2 === +data2 + "") {
          return +data2;
        }
        if (rbrace.test(data2)) {
          return JSON.parse(data2);
        }
        return data2;
      }
      function dataAttr(elem, key, data2) {
        var name;
        if (data2 === void 0 && elem.nodeType === 1) {
          name = "data-" + key.replace(rmultiDash, "-$&").toLowerCase();
          data2 = elem.getAttribute(name);
          if (typeof data2 === "string") {
            try {
              data2 = getData(data2);
            } catch (e) {
            }
            dataUser.set(elem, key, data2);
          } else {
            data2 = void 0;
          }
        }
        return data2;
      }
      jQuery.extend({
        hasData: function(elem) {
          return dataUser.hasData(elem) || dataPriv.hasData(elem);
        },
        data: function(elem, name, data2) {
          return dataUser.access(elem, name, data2);
        },
        removeData: function(elem, name) {
          dataUser.remove(elem, name);
        },
        // TODO: Now that all calls to _data and _removeData have been replaced
        // with direct calls to dataPriv methods, these can be deprecated.
        _data: function(elem, name, data2) {
          return dataPriv.access(elem, name, data2);
        },
        _removeData: function(elem, name) {
          dataPriv.remove(elem, name);
        }
      });
      jQuery.fn.extend({
        data: function(key, value) {
          var i, name, data2, elem = this[0], attrs = elem && elem.attributes;
          if (key === void 0) {
            if (this.length) {
              data2 = dataUser.get(elem);
              if (elem.nodeType === 1 && !dataPriv.get(elem, "hasDataAttrs")) {
                i = attrs.length;
                while (i--) {
                  if (attrs[i]) {
                    name = attrs[i].name;
                    if (name.indexOf("data-") === 0) {
                      name = camelCase(name.slice(5));
                      dataAttr(elem, name, data2[name]);
                    }
                  }
                }
                dataPriv.set(elem, "hasDataAttrs", true);
              }
            }
            return data2;
          }
          if (typeof key === "object") {
            return this.each(function() {
              dataUser.set(this, key);
            });
          }
          return access(this, function(value2) {
            var data3;
            if (elem && value2 === void 0) {
              data3 = dataUser.get(elem, key);
              if (data3 !== void 0) {
                return data3;
              }
              data3 = dataAttr(elem, key);
              if (data3 !== void 0) {
                return data3;
              }
              return;
            }
            this.each(function() {
              dataUser.set(this, key, value2);
            });
          }, null, value, arguments.length > 1, null, true);
        },
        removeData: function(key) {
          return this.each(function() {
            dataUser.remove(this, key);
          });
        }
      });
      jQuery.extend({
        queue: function(elem, type, data2) {
          var queue;
          if (elem) {
            type = (type || "fx") + "queue";
            queue = dataPriv.get(elem, type);
            if (data2) {
              if (!queue || Array.isArray(data2)) {
                queue = dataPriv.access(elem, type, jQuery.makeArray(data2));
              } else {
                queue.push(data2);
              }
            }
            return queue || [];
          }
        },
        dequeue: function(elem, type) {
          type = type || "fx";
          var queue = jQuery.queue(elem, type), startLength = queue.length, fn = queue.shift(), hooks = jQuery._queueHooks(elem, type), next = function() {
            jQuery.dequeue(elem, type);
          };
          if (fn === "inprogress") {
            fn = queue.shift();
            startLength--;
          }
          if (fn) {
            if (type === "fx") {
              queue.unshift("inprogress");
            }
            delete hooks.stop;
            fn.call(elem, next, hooks);
          }
          if (!startLength && hooks) {
            hooks.empty.fire();
          }
        },
        // Not public - generate a queueHooks object, or return the current one
        _queueHooks: function(elem, type) {
          var key = type + "queueHooks";
          return dataPriv.get(elem, key) || dataPriv.access(elem, key, {
            empty: jQuery.Callbacks("once memory").add(function() {
              dataPriv.remove(elem, [type + "queue", key]);
            })
          });
        }
      });
      jQuery.fn.extend({
        queue: function(type, data2) {
          var setter = 2;
          if (typeof type !== "string") {
            data2 = type;
            type = "fx";
            setter--;
          }
          if (arguments.length < setter) {
            return jQuery.queue(this[0], type);
          }
          return data2 === void 0 ? this : this.each(function() {
            var queue = jQuery.queue(this, type, data2);
            jQuery._queueHooks(this, type);
            if (type === "fx" && queue[0] !== "inprogress") {
              jQuery.dequeue(this, type);
            }
          });
        },
        dequeue: function(type) {
          return this.each(function() {
            jQuery.dequeue(this, type);
          });
        },
        clearQueue: function(type) {
          return this.queue(type || "fx", []);
        },
        // Get a promise resolved when queues of a certain type
        // are emptied (fx is the type by default)
        promise: function(type, obj) {
          var tmp, count = 1, defer = jQuery.Deferred(), elements = this, i = this.length, resolve = function() {
            if (!--count) {
              defer.resolveWith(elements, [elements]);
            }
          };
          if (typeof type !== "string") {
            obj = type;
            type = void 0;
          }
          type = type || "fx";
          while (i--) {
            tmp = dataPriv.get(elements[i], type + "queueHooks");
            if (tmp && tmp.empty) {
              count++;
              tmp.empty.add(resolve);
            }
          }
          resolve();
          return defer.promise(obj);
        }
      });
      var pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source;
      var rcssNum = new RegExp("^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i");
      var cssExpand = ["Top", "Right", "Bottom", "Left"];
      var documentElement = document2.documentElement;
      var isAttached = function(elem) {
        return jQuery.contains(elem.ownerDocument, elem);
      }, composed = { composed: true };
      if (documentElement.getRootNode) {
        isAttached = function(elem) {
          return jQuery.contains(elem.ownerDocument, elem) || elem.getRootNode(composed) === elem.ownerDocument;
        };
      }
      var isHiddenWithinTree = function(elem, el) {
        elem = el || elem;
        return elem.style.display === "none" || elem.style.display === "" && // Otherwise, check computed style
        // Support: Firefox <=43 - 45
        // Disconnected elements can have computed display: none, so first confirm that elem is
        // in the document.
        isAttached(elem) && jQuery.css(elem, "display") === "none";
      };
      function adjustCSS(elem, prop, valueParts, tween) {
        var adjusted, scale, maxIterations = 20, currentValue = tween ? function() {
          return tween.cur();
        } : function() {
          return jQuery.css(elem, prop, "");
        }, initial = currentValue(), unit = valueParts && valueParts[3] || (jQuery.cssNumber[prop] ? "" : "px"), initialInUnit = elem.nodeType && (jQuery.cssNumber[prop] || unit !== "px" && +initial) && rcssNum.exec(jQuery.css(elem, prop));
        if (initialInUnit && initialInUnit[3] !== unit) {
          initial = initial / 2;
          unit = unit || initialInUnit[3];
          initialInUnit = +initial || 1;
          while (maxIterations--) {
            jQuery.style(elem, prop, initialInUnit + unit);
            if ((1 - scale) * (1 - (scale = currentValue() / initial || 0.5)) <= 0) {
              maxIterations = 0;
            }
            initialInUnit = initialInUnit / scale;
          }
          initialInUnit = initialInUnit * 2;
          jQuery.style(elem, prop, initialInUnit + unit);
          valueParts = valueParts || [];
        }
        if (valueParts) {
          initialInUnit = +initialInUnit || +initial || 0;
          adjusted = valueParts[1] ? initialInUnit + (valueParts[1] + 1) * valueParts[2] : +valueParts[2];
          if (tween) {
            tween.unit = unit;
            tween.start = initialInUnit;
            tween.end = adjusted;
          }
        }
        return adjusted;
      }
      var defaultDisplayMap = {};
      function getDefaultDisplay(elem) {
        var temp, doc = elem.ownerDocument, nodeName2 = elem.nodeName, display = defaultDisplayMap[nodeName2];
        if (display) {
          return display;
        }
        temp = doc.body.appendChild(doc.createElement(nodeName2));
        display = jQuery.css(temp, "display");
        temp.parentNode.removeChild(temp);
        if (display === "none") {
          display = "block";
        }
        defaultDisplayMap[nodeName2] = display;
        return display;
      }
      function showHide(elements, show) {
        var display, elem, values = [], index = 0, length = elements.length;
        for (; index < length; index++) {
          elem = elements[index];
          if (!elem.style) {
            continue;
          }
          display = elem.style.display;
          if (show) {
            if (display === "none") {
              values[index] = dataPriv.get(elem, "display") || null;
              if (!values[index]) {
                elem.style.display = "";
              }
            }
            if (elem.style.display === "" && isHiddenWithinTree(elem)) {
              values[index] = getDefaultDisplay(elem);
            }
          } else {
            if (display !== "none") {
              values[index] = "none";
              dataPriv.set(elem, "display", display);
            }
          }
        }
        for (index = 0; index < length; index++) {
          if (values[index] != null) {
            elements[index].style.display = values[index];
          }
        }
        return elements;
      }
      jQuery.fn.extend({
        show: function() {
          return showHide(this, true);
        },
        hide: function() {
          return showHide(this);
        },
        toggle: function(state2) {
          if (typeof state2 === "boolean") {
            return state2 ? this.show() : this.hide();
          }
          return this.each(function() {
            if (isHiddenWithinTree(this)) {
              jQuery(this).show();
            } else {
              jQuery(this).hide();
            }
          });
        }
      });
      var rcheckableType = /^(?:checkbox|radio)$/i;
      var rtagName = /<([a-z][^\/\0>\x20\t\r\n\f]*)/i;
      var rscriptType = /^$|^module$|\/(?:java|ecma)script/i;
      (function() {
        var fragment = document2.createDocumentFragment(), div = fragment.appendChild(document2.createElement("div")), input = document2.createElement("input");
        input.setAttribute("type", "radio");
        input.setAttribute("checked", "checked");
        input.setAttribute("name", "t");
        div.appendChild(input);
        support.checkClone = div.cloneNode(true).cloneNode(true).lastChild.checked;
        div.innerHTML = "<textarea>x</textarea>";
        support.noCloneChecked = !!div.cloneNode(true).lastChild.defaultValue;
        div.innerHTML = "<option></option>";
        support.option = !!div.lastChild;
      })();
      var wrapMap = {
        // XHTML parsers do not magically insert elements in the
        // same way that tag soup parsers do. So we cannot shorten
        // this by omitting <tbody> or other required elements.
        thead: [1, "<table>", "</table>"],
        col: [2, "<table><colgroup>", "</colgroup></table>"],
        tr: [2, "<table><tbody>", "</tbody></table>"],
        td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
        _default: [0, "", ""]
      };
      wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
      wrapMap.th = wrapMap.td;
      if (!support.option) {
        wrapMap.optgroup = wrapMap.option = [1, "<select multiple='multiple'>", "</select>"];
      }
      function getAll(context2, tag) {
        var ret;
        if (typeof context2.getElementsByTagName !== "undefined") {
          ret = context2.getElementsByTagName(tag || "*");
        } else if (typeof context2.querySelectorAll !== "undefined") {
          ret = context2.querySelectorAll(tag || "*");
        } else {
          ret = [];
        }
        if (tag === void 0 || tag && nodeName(context2, tag)) {
          return jQuery.merge([context2], ret);
        }
        return ret;
      }
      function setGlobalEval(elems, refElements) {
        var i = 0, l = elems.length;
        for (; i < l; i++) {
          dataPriv.set(
            elems[i],
            "globalEval",
            !refElements || dataPriv.get(refElements[i], "globalEval")
          );
        }
      }
      var rhtml = /<|&#?\w+;/;
      function buildFragment(elems, context2, scripts, selection, ignored) {
        var elem, tmp, tag, wrap, attached, j, fragment = context2.createDocumentFragment(), nodes = [], i = 0, l = elems.length;
        for (; i < l; i++) {
          elem = elems[i];
          if (elem || elem === 0) {
            if (toType(elem) === "object") {
              jQuery.merge(nodes, elem.nodeType ? [elem] : elem);
            } else if (!rhtml.test(elem)) {
              nodes.push(context2.createTextNode(elem));
            } else {
              tmp = tmp || fragment.appendChild(context2.createElement("div"));
              tag = (rtagName.exec(elem) || ["", ""])[1].toLowerCase();
              wrap = wrapMap[tag] || wrapMap._default;
              tmp.innerHTML = wrap[1] + jQuery.htmlPrefilter(elem) + wrap[2];
              j = wrap[0];
              while (j--) {
                tmp = tmp.lastChild;
              }
              jQuery.merge(nodes, tmp.childNodes);
              tmp = fragment.firstChild;
              tmp.textContent = "";
            }
          }
        }
        fragment.textContent = "";
        i = 0;
        while (elem = nodes[i++]) {
          if (selection && jQuery.inArray(elem, selection) > -1) {
            if (ignored) {
              ignored.push(elem);
            }
            continue;
          }
          attached = isAttached(elem);
          tmp = getAll(fragment.appendChild(elem), "script");
          if (attached) {
            setGlobalEval(tmp);
          }
          if (scripts) {
            j = 0;
            while (elem = tmp[j++]) {
              if (rscriptType.test(elem.type || "")) {
                scripts.push(elem);
              }
            }
          }
        }
        return fragment;
      }
      var rtypenamespace = /^([^.]*)(?:\.(.+)|)/;
      function returnTrue() {
        return true;
      }
      function returnFalse() {
        return false;
      }
      function on(elem, types, selector, data2, fn, one) {
        var origFn, type;
        if (typeof types === "object") {
          if (typeof selector !== "string") {
            data2 = data2 || selector;
            selector = void 0;
          }
          for (type in types) {
            on(elem, type, selector, data2, types[type], one);
          }
          return elem;
        }
        if (data2 == null && fn == null) {
          fn = selector;
          data2 = selector = void 0;
        } else if (fn == null) {
          if (typeof selector === "string") {
            fn = data2;
            data2 = void 0;
          } else {
            fn = data2;
            data2 = selector;
            selector = void 0;
          }
        }
        if (fn === false) {
          fn = returnFalse;
        } else if (!fn) {
          return elem;
        }
        if (one === 1) {
          origFn = fn;
          fn = function(event) {
            jQuery().off(event);
            return origFn.apply(this, arguments);
          };
          fn.guid = origFn.guid || (origFn.guid = jQuery.guid++);
        }
        return elem.each(function() {
          jQuery.event.add(this, types, fn, data2, selector);
        });
      }
      jQuery.event = {
        global: {},
        add: function(elem, types, handler, data2, selector) {
          var handleObjIn, eventHandle, tmp, events, t, handleObj, special, handlers, type, namespaces, origType, elemData = dataPriv.get(elem);
          if (!acceptData(elem)) {
            return;
          }
          if (handler.handler) {
            handleObjIn = handler;
            handler = handleObjIn.handler;
            selector = handleObjIn.selector;
          }
          if (selector) {
            jQuery.find.matchesSelector(documentElement, selector);
          }
          if (!handler.guid) {
            handler.guid = jQuery.guid++;
          }
          if (!(events = elemData.events)) {
            events = elemData.events = /* @__PURE__ */ Object.create(null);
          }
          if (!(eventHandle = elemData.handle)) {
            eventHandle = elemData.handle = function(e) {
              return typeof jQuery !== "undefined" && jQuery.event.triggered !== e.type ? jQuery.event.dispatch.apply(elem, arguments) : void 0;
            };
          }
          types = (types || "").match(rnothtmlwhite) || [""];
          t = types.length;
          while (t--) {
            tmp = rtypenamespace.exec(types[t]) || [];
            type = origType = tmp[1];
            namespaces = (tmp[2] || "").split(".").sort();
            if (!type) {
              continue;
            }
            special = jQuery.event.special[type] || {};
            type = (selector ? special.delegateType : special.bindType) || type;
            special = jQuery.event.special[type] || {};
            handleObj = jQuery.extend({
              type,
              origType,
              data: data2,
              handler,
              guid: handler.guid,
              selector,
              needsContext: selector && jQuery.expr.match.needsContext.test(selector),
              namespace: namespaces.join(".")
            }, handleObjIn);
            if (!(handlers = events[type])) {
              handlers = events[type] = [];
              handlers.delegateCount = 0;
              if (!special.setup || special.setup.call(elem, data2, namespaces, eventHandle) === false) {
                if (elem.addEventListener) {
                  elem.addEventListener(type, eventHandle);
                }
              }
            }
            if (special.add) {
              special.add.call(elem, handleObj);
              if (!handleObj.handler.guid) {
                handleObj.handler.guid = handler.guid;
              }
            }
            if (selector) {
              handlers.splice(handlers.delegateCount++, 0, handleObj);
            } else {
              handlers.push(handleObj);
            }
            jQuery.event.global[type] = true;
          }
        },
        // Detach an event or set of events from an element
        remove: function(elem, types, handler, selector, mappedTypes) {
          var j, origCount, tmp, events, t, handleObj, special, handlers, type, namespaces, origType, elemData = dataPriv.hasData(elem) && dataPriv.get(elem);
          if (!elemData || !(events = elemData.events)) {
            return;
          }
          types = (types || "").match(rnothtmlwhite) || [""];
          t = types.length;
          while (t--) {
            tmp = rtypenamespace.exec(types[t]) || [];
            type = origType = tmp[1];
            namespaces = (tmp[2] || "").split(".").sort();
            if (!type) {
              for (type in events) {
                jQuery.event.remove(elem, type + types[t], handler, selector, true);
              }
              continue;
            }
            special = jQuery.event.special[type] || {};
            type = (selector ? special.delegateType : special.bindType) || type;
            handlers = events[type] || [];
            tmp = tmp[2] && new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)");
            origCount = j = handlers.length;
            while (j--) {
              handleObj = handlers[j];
              if ((mappedTypes || origType === handleObj.origType) && (!handler || handler.guid === handleObj.guid) && (!tmp || tmp.test(handleObj.namespace)) && (!selector || selector === handleObj.selector || selector === "**" && handleObj.selector)) {
                handlers.splice(j, 1);
                if (handleObj.selector) {
                  handlers.delegateCount--;
                }
                if (special.remove) {
                  special.remove.call(elem, handleObj);
                }
              }
            }
            if (origCount && !handlers.length) {
              if (!special.teardown || special.teardown.call(elem, namespaces, elemData.handle) === false) {
                jQuery.removeEvent(elem, type, elemData.handle);
              }
              delete events[type];
            }
          }
          if (jQuery.isEmptyObject(events)) {
            dataPriv.remove(elem, "handle events");
          }
        },
        dispatch: function(nativeEvent) {
          var i, j, ret, matched, handleObj, handlerQueue, args = new Array(arguments.length), event = jQuery.event.fix(nativeEvent), handlers = (dataPriv.get(this, "events") || /* @__PURE__ */ Object.create(null))[event.type] || [], special = jQuery.event.special[event.type] || {};
          args[0] = event;
          for (i = 1; i < arguments.length; i++) {
            args[i] = arguments[i];
          }
          event.delegateTarget = this;
          if (special.preDispatch && special.preDispatch.call(this, event) === false) {
            return;
          }
          handlerQueue = jQuery.event.handlers.call(this, event, handlers);
          i = 0;
          while ((matched = handlerQueue[i++]) && !event.isPropagationStopped()) {
            event.currentTarget = matched.elem;
            j = 0;
            while ((handleObj = matched.handlers[j++]) && !event.isImmediatePropagationStopped()) {
              if (!event.rnamespace || handleObj.namespace === false || event.rnamespace.test(handleObj.namespace)) {
                event.handleObj = handleObj;
                event.data = handleObj.data;
                ret = ((jQuery.event.special[handleObj.origType] || {}).handle || handleObj.handler).apply(matched.elem, args);
                if (ret !== void 0) {
                  if ((event.result = ret) === false) {
                    event.preventDefault();
                    event.stopPropagation();
                  }
                }
              }
            }
          }
          if (special.postDispatch) {
            special.postDispatch.call(this, event);
          }
          return event.result;
        },
        handlers: function(event, handlers) {
          var i, handleObj, sel, matchedHandlers, matchedSelectors, handlerQueue = [], delegateCount = handlers.delegateCount, cur = event.target;
          if (delegateCount && // Support: IE <=9
          // Black-hole SVG <use> instance trees (trac-13180)
          cur.nodeType && // Support: Firefox <=42
          // Suppress spec-violating clicks indicating a non-primary pointer button (trac-3861)
          // https://www.w3.org/TR/DOM-Level-3-Events/#event-type-click
          // Support: IE 11 only
          // ...but not arrow key "clicks" of radio inputs, which can have `button` -1 (gh-2343)
          !(event.type === "click" && event.button >= 1)) {
            for (; cur !== this; cur = cur.parentNode || this) {
              if (cur.nodeType === 1 && !(event.type === "click" && cur.disabled === true)) {
                matchedHandlers = [];
                matchedSelectors = {};
                for (i = 0; i < delegateCount; i++) {
                  handleObj = handlers[i];
                  sel = handleObj.selector + " ";
                  if (matchedSelectors[sel] === void 0) {
                    matchedSelectors[sel] = handleObj.needsContext ? jQuery(sel, this).index(cur) > -1 : jQuery.find(sel, this, null, [cur]).length;
                  }
                  if (matchedSelectors[sel]) {
                    matchedHandlers.push(handleObj);
                  }
                }
                if (matchedHandlers.length) {
                  handlerQueue.push({ elem: cur, handlers: matchedHandlers });
                }
              }
            }
          }
          cur = this;
          if (delegateCount < handlers.length) {
            handlerQueue.push({ elem: cur, handlers: handlers.slice(delegateCount) });
          }
          return handlerQueue;
        },
        addProp: function(name, hook) {
          Object.defineProperty(jQuery.Event.prototype, name, {
            enumerable: true,
            configurable: true,
            get: isFunction(hook) ? function() {
              if (this.originalEvent) {
                return hook(this.originalEvent);
              }
            } : function() {
              if (this.originalEvent) {
                return this.originalEvent[name];
              }
            },
            set: function(value) {
              Object.defineProperty(this, name, {
                enumerable: true,
                configurable: true,
                writable: true,
                value
              });
            }
          });
        },
        fix: function(originalEvent) {
          return originalEvent[jQuery.expando] ? originalEvent : new jQuery.Event(originalEvent);
        },
        special: {
          load: {
            // Prevent triggered image.load events from bubbling to window.load
            noBubble: true
          },
          click: {
            // Utilize native event to ensure correct state for checkable inputs
            setup: function(data2) {
              var el = this || data2;
              if (rcheckableType.test(el.type) && el.click && nodeName(el, "input")) {
                leverageNative(el, "click", true);
              }
              return false;
            },
            trigger: function(data2) {
              var el = this || data2;
              if (rcheckableType.test(el.type) && el.click && nodeName(el, "input")) {
                leverageNative(el, "click");
              }
              return true;
            },
            // For cross-browser consistency, suppress native .click() on links
            // Also prevent it if we're currently inside a leveraged native-event stack
            _default: function(event) {
              var target = event.target;
              return rcheckableType.test(target.type) && target.click && nodeName(target, "input") && dataPriv.get(target, "click") || nodeName(target, "a");
            }
          },
          beforeunload: {
            postDispatch: function(event) {
              if (event.result !== void 0 && event.originalEvent) {
                event.originalEvent.returnValue = event.result;
              }
            }
          }
        }
      };
      function leverageNative(el, type, isSetup) {
        if (!isSetup) {
          if (dataPriv.get(el, type) === void 0) {
            jQuery.event.add(el, type, returnTrue);
          }
          return;
        }
        dataPriv.set(el, type, false);
        jQuery.event.add(el, type, {
          namespace: false,
          handler: function(event) {
            var result, saved = dataPriv.get(this, type);
            if (event.isTrigger & 1 && this[type]) {
              if (!saved) {
                saved = slice.call(arguments);
                dataPriv.set(this, type, saved);
                this[type]();
                result = dataPriv.get(this, type);
                dataPriv.set(this, type, false);
                if (saved !== result) {
                  event.stopImmediatePropagation();
                  event.preventDefault();
                  return result;
                }
              } else if ((jQuery.event.special[type] || {}).delegateType) {
                event.stopPropagation();
              }
            } else if (saved) {
              dataPriv.set(this, type, jQuery.event.trigger(
                saved[0],
                saved.slice(1),
                this
              ));
              event.stopPropagation();
              event.isImmediatePropagationStopped = returnTrue;
            }
          }
        });
      }
      jQuery.removeEvent = function(elem, type, handle) {
        if (elem.removeEventListener) {
          elem.removeEventListener(type, handle);
        }
      };
      jQuery.Event = function(src, props) {
        if (!(this instanceof jQuery.Event)) {
          return new jQuery.Event(src, props);
        }
        if (src && src.type) {
          this.originalEvent = src;
          this.type = src.type;
          this.isDefaultPrevented = src.defaultPrevented || src.defaultPrevented === void 0 && // Support: Android <=2.3 only
          src.returnValue === false ? returnTrue : returnFalse;
          this.target = src.target && src.target.nodeType === 3 ? src.target.parentNode : src.target;
          this.currentTarget = src.currentTarget;
          this.relatedTarget = src.relatedTarget;
        } else {
          this.type = src;
        }
        if (props) {
          jQuery.extend(this, props);
        }
        this.timeStamp = src && src.timeStamp || Date.now();
        this[jQuery.expando] = true;
      };
      jQuery.Event.prototype = {
        constructor: jQuery.Event,
        isDefaultPrevented: returnFalse,
        isPropagationStopped: returnFalse,
        isImmediatePropagationStopped: returnFalse,
        isSimulated: false,
        preventDefault: function() {
          var e = this.originalEvent;
          this.isDefaultPrevented = returnTrue;
          if (e && !this.isSimulated) {
            e.preventDefault();
          }
        },
        stopPropagation: function() {
          var e = this.originalEvent;
          this.isPropagationStopped = returnTrue;
          if (e && !this.isSimulated) {
            e.stopPropagation();
          }
        },
        stopImmediatePropagation: function() {
          var e = this.originalEvent;
          this.isImmediatePropagationStopped = returnTrue;
          if (e && !this.isSimulated) {
            e.stopImmediatePropagation();
          }
          this.stopPropagation();
        }
      };
      jQuery.each({
        altKey: true,
        bubbles: true,
        cancelable: true,
        changedTouches: true,
        ctrlKey: true,
        detail: true,
        eventPhase: true,
        metaKey: true,
        pageX: true,
        pageY: true,
        shiftKey: true,
        view: true,
        "char": true,
        code: true,
        charCode: true,
        key: true,
        keyCode: true,
        button: true,
        buttons: true,
        clientX: true,
        clientY: true,
        offsetX: true,
        offsetY: true,
        pointerId: true,
        pointerType: true,
        screenX: true,
        screenY: true,
        targetTouches: true,
        toElement: true,
        touches: true,
        which: true
      }, jQuery.event.addProp);
      jQuery.each({ focus: "focusin", blur: "focusout" }, function(type, delegateType) {
        function focusMappedHandler(nativeEvent) {
          if (document2.documentMode) {
            var handle = dataPriv.get(this, "handle"), event = jQuery.event.fix(nativeEvent);
            event.type = nativeEvent.type === "focusin" ? "focus" : "blur";
            event.isSimulated = true;
            handle(nativeEvent);
            if (event.target === event.currentTarget) {
              handle(event);
            }
          } else {
            jQuery.event.simulate(
              delegateType,
              nativeEvent.target,
              jQuery.event.fix(nativeEvent)
            );
          }
        }
        jQuery.event.special[type] = {
          // Utilize native event if possible so blur/focus sequence is correct
          setup: function() {
            var attaches;
            leverageNative(this, type, true);
            if (document2.documentMode) {
              attaches = dataPriv.get(this, delegateType);
              if (!attaches) {
                this.addEventListener(delegateType, focusMappedHandler);
              }
              dataPriv.set(this, delegateType, (attaches || 0) + 1);
            } else {
              return false;
            }
          },
          trigger: function() {
            leverageNative(this, type);
            return true;
          },
          teardown: function() {
            var attaches;
            if (document2.documentMode) {
              attaches = dataPriv.get(this, delegateType) - 1;
              if (!attaches) {
                this.removeEventListener(delegateType, focusMappedHandler);
                dataPriv.remove(this, delegateType);
              } else {
                dataPriv.set(this, delegateType, attaches);
              }
            } else {
              return false;
            }
          },
          // Suppress native focus or blur if we're currently inside
          // a leveraged native-event stack
          _default: function(event) {
            return dataPriv.get(event.target, type);
          },
          delegateType
        };
        jQuery.event.special[delegateType] = {
          setup: function() {
            var doc = this.ownerDocument || this.document || this, dataHolder = document2.documentMode ? this : doc, attaches = dataPriv.get(dataHolder, delegateType);
            if (!attaches) {
              if (document2.documentMode) {
                this.addEventListener(delegateType, focusMappedHandler);
              } else {
                doc.addEventListener(type, focusMappedHandler, true);
              }
            }
            dataPriv.set(dataHolder, delegateType, (attaches || 0) + 1);
          },
          teardown: function() {
            var doc = this.ownerDocument || this.document || this, dataHolder = document2.documentMode ? this : doc, attaches = dataPriv.get(dataHolder, delegateType) - 1;
            if (!attaches) {
              if (document2.documentMode) {
                this.removeEventListener(delegateType, focusMappedHandler);
              } else {
                doc.removeEventListener(type, focusMappedHandler, true);
              }
              dataPriv.remove(dataHolder, delegateType);
            } else {
              dataPriv.set(dataHolder, delegateType, attaches);
            }
          }
        };
      });
      jQuery.each({
        mouseenter: "mouseover",
        mouseleave: "mouseout",
        pointerenter: "pointerover",
        pointerleave: "pointerout"
      }, function(orig, fix) {
        jQuery.event.special[orig] = {
          delegateType: fix,
          bindType: fix,
          handle: function(event) {
            var ret, target = this, related = event.relatedTarget, handleObj = event.handleObj;
            if (!related || related !== target && !jQuery.contains(target, related)) {
              event.type = handleObj.origType;
              ret = handleObj.handler.apply(this, arguments);
              event.type = fix;
            }
            return ret;
          }
        };
      });
      jQuery.fn.extend({
        on: function(types, selector, data2, fn) {
          return on(this, types, selector, data2, fn);
        },
        one: function(types, selector, data2, fn) {
          return on(this, types, selector, data2, fn, 1);
        },
        off: function(types, selector, fn) {
          var handleObj, type;
          if (types && types.preventDefault && types.handleObj) {
            handleObj = types.handleObj;
            jQuery(types.delegateTarget).off(
              handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
              handleObj.selector,
              handleObj.handler
            );
            return this;
          }
          if (typeof types === "object") {
            for (type in types) {
              this.off(type, selector, types[type]);
            }
            return this;
          }
          if (selector === false || typeof selector === "function") {
            fn = selector;
            selector = void 0;
          }
          if (fn === false) {
            fn = returnFalse;
          }
          return this.each(function() {
            jQuery.event.remove(this, types, fn, selector);
          });
        }
      });
      var rnoInnerhtml = /<script|<style|<link/i, rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i, rcleanScript = /^\s*<!\[CDATA\[|\]\]>\s*$/g;
      function manipulationTarget(elem, content) {
        if (nodeName(elem, "table") && nodeName(content.nodeType !== 11 ? content : content.firstChild, "tr")) {
          return jQuery(elem).children("tbody")[0] || elem;
        }
        return elem;
      }
      function disableScript(elem) {
        elem.type = (elem.getAttribute("type") !== null) + "/" + elem.type;
        return elem;
      }
      function restoreScript(elem) {
        if ((elem.type || "").slice(0, 5) === "true/") {
          elem.type = elem.type.slice(5);
        } else {
          elem.removeAttribute("type");
        }
        return elem;
      }
      function cloneCopyEvent(src, dest) {
        var i, l, type, pdataOld, udataOld, udataCur, events;
        if (dest.nodeType !== 1) {
          return;
        }
        if (dataPriv.hasData(src)) {
          pdataOld = dataPriv.get(src);
          events = pdataOld.events;
          if (events) {
            dataPriv.remove(dest, "handle events");
            for (type in events) {
              for (i = 0, l = events[type].length; i < l; i++) {
                jQuery.event.add(dest, type, events[type][i]);
              }
            }
          }
        }
        if (dataUser.hasData(src)) {
          udataOld = dataUser.access(src);
          udataCur = jQuery.extend({}, udataOld);
          dataUser.set(dest, udataCur);
        }
      }
      function fixInput(src, dest) {
        var nodeName2 = dest.nodeName.toLowerCase();
        if (nodeName2 === "input" && rcheckableType.test(src.type)) {
          dest.checked = src.checked;
        } else if (nodeName2 === "input" || nodeName2 === "textarea") {
          dest.defaultValue = src.defaultValue;
        }
      }
      function domManip(collection, args, callback, ignored) {
        args = flat(args);
        var fragment, first, scripts, hasScripts, node, doc, i = 0, l = collection.length, iNoClone = l - 1, value = args[0], valueIsFunction = isFunction(value);
        if (valueIsFunction || l > 1 && typeof value === "string" && !support.checkClone && rchecked.test(value)) {
          return collection.each(function(index) {
            var self = collection.eq(index);
            if (valueIsFunction) {
              args[0] = value.call(this, index, self.html());
            }
            domManip(self, args, callback, ignored);
          });
        }
        if (l) {
          fragment = buildFragment(args, collection[0].ownerDocument, false, collection, ignored);
          first = fragment.firstChild;
          if (fragment.childNodes.length === 1) {
            fragment = first;
          }
          if (first || ignored) {
            scripts = jQuery.map(getAll(fragment, "script"), disableScript);
            hasScripts = scripts.length;
            for (; i < l; i++) {
              node = fragment;
              if (i !== iNoClone) {
                node = jQuery.clone(node, true, true);
                if (hasScripts) {
                  jQuery.merge(scripts, getAll(node, "script"));
                }
              }
              callback.call(collection[i], node, i);
            }
            if (hasScripts) {
              doc = scripts[scripts.length - 1].ownerDocument;
              jQuery.map(scripts, restoreScript);
              for (i = 0; i < hasScripts; i++) {
                node = scripts[i];
                if (rscriptType.test(node.type || "") && !dataPriv.access(node, "globalEval") && jQuery.contains(doc, node)) {
                  if (node.src && (node.type || "").toLowerCase() !== "module") {
                    if (jQuery._evalUrl && !node.noModule) {
                      jQuery._evalUrl(node.src, {
                        nonce: node.nonce || node.getAttribute("nonce")
                      }, doc);
                    }
                  } else {
                    DOMEval(node.textContent.replace(rcleanScript, ""), node, doc);
                  }
                }
              }
            }
          }
        }
        return collection;
      }
      function remove(elem, selector, keepData) {
        var node, nodes = selector ? jQuery.filter(selector, elem) : elem, i = 0;
        for (; (node = nodes[i]) != null; i++) {
          if (!keepData && node.nodeType === 1) {
            jQuery.cleanData(getAll(node));
          }
          if (node.parentNode) {
            if (keepData && isAttached(node)) {
              setGlobalEval(getAll(node, "script"));
            }
            node.parentNode.removeChild(node);
          }
        }
        return elem;
      }
      jQuery.extend({
        htmlPrefilter: function(html) {
          return html;
        },
        clone: function(elem, dataAndEvents, deepDataAndEvents) {
          var i, l, srcElements, destElements, clone = elem.cloneNode(true), inPage = isAttached(elem);
          if (!support.noCloneChecked && (elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem)) {
            destElements = getAll(clone);
            srcElements = getAll(elem);
            for (i = 0, l = srcElements.length; i < l; i++) {
              fixInput(srcElements[i], destElements[i]);
            }
          }
          if (dataAndEvents) {
            if (deepDataAndEvents) {
              srcElements = srcElements || getAll(elem);
              destElements = destElements || getAll(clone);
              for (i = 0, l = srcElements.length; i < l; i++) {
                cloneCopyEvent(srcElements[i], destElements[i]);
              }
            } else {
              cloneCopyEvent(elem, clone);
            }
          }
          destElements = getAll(clone, "script");
          if (destElements.length > 0) {
            setGlobalEval(destElements, !inPage && getAll(elem, "script"));
          }
          return clone;
        },
        cleanData: function(elems) {
          var data2, elem, type, special = jQuery.event.special, i = 0;
          for (; (elem = elems[i]) !== void 0; i++) {
            if (acceptData(elem)) {
              if (data2 = elem[dataPriv.expando]) {
                if (data2.events) {
                  for (type in data2.events) {
                    if (special[type]) {
                      jQuery.event.remove(elem, type);
                    } else {
                      jQuery.removeEvent(elem, type, data2.handle);
                    }
                  }
                }
                elem[dataPriv.expando] = void 0;
              }
              if (elem[dataUser.expando]) {
                elem[dataUser.expando] = void 0;
              }
            }
          }
        }
      });
      jQuery.fn.extend({
        detach: function(selector) {
          return remove(this, selector, true);
        },
        remove: function(selector) {
          return remove(this, selector);
        },
        text: function(value) {
          return access(this, function(value2) {
            return value2 === void 0 ? jQuery.text(this) : this.empty().each(function() {
              if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
                this.textContent = value2;
              }
            });
          }, null, value, arguments.length);
        },
        append: function() {
          return domManip(this, arguments, function(elem) {
            if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
              var target = manipulationTarget(this, elem);
              target.appendChild(elem);
            }
          });
        },
        prepend: function() {
          return domManip(this, arguments, function(elem) {
            if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
              var target = manipulationTarget(this, elem);
              target.insertBefore(elem, target.firstChild);
            }
          });
        },
        before: function() {
          return domManip(this, arguments, function(elem) {
            if (this.parentNode) {
              this.parentNode.insertBefore(elem, this);
            }
          });
        },
        after: function() {
          return domManip(this, arguments, function(elem) {
            if (this.parentNode) {
              this.parentNode.insertBefore(elem, this.nextSibling);
            }
          });
        },
        empty: function() {
          var elem, i = 0;
          for (; (elem = this[i]) != null; i++) {
            if (elem.nodeType === 1) {
              jQuery.cleanData(getAll(elem, false));
              elem.textContent = "";
            }
          }
          return this;
        },
        clone: function(dataAndEvents, deepDataAndEvents) {
          dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
          deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;
          return this.map(function() {
            return jQuery.clone(this, dataAndEvents, deepDataAndEvents);
          });
        },
        html: function(value) {
          return access(this, function(value2) {
            var elem = this[0] || {}, i = 0, l = this.length;
            if (value2 === void 0 && elem.nodeType === 1) {
              return elem.innerHTML;
            }
            if (typeof value2 === "string" && !rnoInnerhtml.test(value2) && !wrapMap[(rtagName.exec(value2) || ["", ""])[1].toLowerCase()]) {
              value2 = jQuery.htmlPrefilter(value2);
              try {
                for (; i < l; i++) {
                  elem = this[i] || {};
                  if (elem.nodeType === 1) {
                    jQuery.cleanData(getAll(elem, false));
                    elem.innerHTML = value2;
                  }
                }
                elem = 0;
              } catch (e) {
              }
            }
            if (elem) {
              this.empty().append(value2);
            }
          }, null, value, arguments.length);
        },
        replaceWith: function() {
          var ignored = [];
          return domManip(this, arguments, function(elem) {
            var parent = this.parentNode;
            if (jQuery.inArray(this, ignored) < 0) {
              jQuery.cleanData(getAll(this));
              if (parent) {
                parent.replaceChild(elem, this);
              }
            }
          }, ignored);
        }
      });
      jQuery.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
      }, function(name, original) {
        jQuery.fn[name] = function(selector) {
          var elems, ret = [], insert = jQuery(selector), last = insert.length - 1, i = 0;
          for (; i <= last; i++) {
            elems = i === last ? this : this.clone(true);
            jQuery(insert[i])[original](elems);
            push.apply(ret, elems.get());
          }
          return this.pushStack(ret);
        };
      });
      var rnumnonpx = new RegExp("^(" + pnum + ")(?!px)[a-z%]+$", "i");
      var rcustomProp = /^--/;
      var getStyles = function(elem) {
        var view = elem.ownerDocument.defaultView;
        if (!view || !view.opener) {
          view = window2;
        }
        return view.getComputedStyle(elem);
      };
      var swap = function(elem, options, callback) {
        var ret, name, old = {};
        for (name in options) {
          old[name] = elem.style[name];
          elem.style[name] = options[name];
        }
        ret = callback.call(elem);
        for (name in options) {
          elem.style[name] = old[name];
        }
        return ret;
      };
      var rboxStyle = new RegExp(cssExpand.join("|"), "i");
      (function() {
        function computeStyleTests() {
          if (!div) {
            return;
          }
          container.style.cssText = "position:absolute;left:-11111px;width:60px;margin-top:1px;padding:0;border:0";
          div.style.cssText = "position:relative;display:block;box-sizing:border-box;overflow:scroll;margin:auto;border:1px;padding:1px;width:60%;top:1%";
          documentElement.appendChild(container).appendChild(div);
          var divStyle = window2.getComputedStyle(div);
          pixelPositionVal = divStyle.top !== "1%";
          reliableMarginLeftVal = roundPixelMeasures(divStyle.marginLeft) === 12;
          div.style.right = "60%";
          pixelBoxStylesVal = roundPixelMeasures(divStyle.right) === 36;
          boxSizingReliableVal = roundPixelMeasures(divStyle.width) === 36;
          div.style.position = "absolute";
          scrollboxSizeVal = roundPixelMeasures(div.offsetWidth / 3) === 12;
          documentElement.removeChild(container);
          div = null;
        }
        function roundPixelMeasures(measure) {
          return Math.round(parseFloat(measure));
        }
        var pixelPositionVal, boxSizingReliableVal, scrollboxSizeVal, pixelBoxStylesVal, reliableTrDimensionsVal, reliableMarginLeftVal, container = document2.createElement("div"), div = document2.createElement("div");
        if (!div.style) {
          return;
        }
        div.style.backgroundClip = "content-box";
        div.cloneNode(true).style.backgroundClip = "";
        support.clearCloneStyle = div.style.backgroundClip === "content-box";
        jQuery.extend(support, {
          boxSizingReliable: function() {
            computeStyleTests();
            return boxSizingReliableVal;
          },
          pixelBoxStyles: function() {
            computeStyleTests();
            return pixelBoxStylesVal;
          },
          pixelPosition: function() {
            computeStyleTests();
            return pixelPositionVal;
          },
          reliableMarginLeft: function() {
            computeStyleTests();
            return reliableMarginLeftVal;
          },
          scrollboxSize: function() {
            computeStyleTests();
            return scrollboxSizeVal;
          },
          // Support: IE 9 - 11+, Edge 15 - 18+
          // IE/Edge misreport `getComputedStyle` of table rows with width/height
          // set in CSS while `offset*` properties report correct values.
          // Behavior in IE 9 is more subtle than in newer versions & it passes
          // some versions of this test; make sure not to make it pass there!
          //
          // Support: Firefox 70+
          // Only Firefox includes border widths
          // in computed dimensions. (gh-4529)
          reliableTrDimensions: function() {
            var table, tr, trChild, trStyle;
            if (reliableTrDimensionsVal == null) {
              table = document2.createElement("table");
              tr = document2.createElement("tr");
              trChild = document2.createElement("div");
              table.style.cssText = "position:absolute;left:-11111px;border-collapse:separate";
              tr.style.cssText = "box-sizing:content-box;border:1px solid";
              tr.style.height = "1px";
              trChild.style.height = "9px";
              trChild.style.display = "block";
              documentElement.appendChild(table).appendChild(tr).appendChild(trChild);
              trStyle = window2.getComputedStyle(tr);
              reliableTrDimensionsVal = parseInt(trStyle.height, 10) + parseInt(trStyle.borderTopWidth, 10) + parseInt(trStyle.borderBottomWidth, 10) === tr.offsetHeight;
              documentElement.removeChild(table);
            }
            return reliableTrDimensionsVal;
          }
        });
      })();
      function curCSS(elem, name, computed) {
        var width, minWidth, maxWidth, ret, isCustomProp = rcustomProp.test(name), style = elem.style;
        computed = computed || getStyles(elem);
        if (computed) {
          ret = computed.getPropertyValue(name) || computed[name];
          if (isCustomProp && ret) {
            ret = ret.replace(rtrimCSS, "$1") || void 0;
          }
          if (ret === "" && !isAttached(elem)) {
            ret = jQuery.style(elem, name);
          }
          if (!support.pixelBoxStyles() && rnumnonpx.test(ret) && rboxStyle.test(name)) {
            width = style.width;
            minWidth = style.minWidth;
            maxWidth = style.maxWidth;
            style.minWidth = style.maxWidth = style.width = ret;
            ret = computed.width;
            style.width = width;
            style.minWidth = minWidth;
            style.maxWidth = maxWidth;
          }
        }
        return ret !== void 0 ? (
          // Support: IE <=9 - 11 only
          // IE returns zIndex value as an integer.
          ret + ""
        ) : ret;
      }
      function addGetHookIf(conditionFn, hookFn) {
        return {
          get: function() {
            if (conditionFn()) {
              delete this.get;
              return;
            }
            return (this.get = hookFn).apply(this, arguments);
          }
        };
      }
      var cssPrefixes = ["Webkit", "Moz", "ms"], emptyStyle = document2.createElement("div").style, vendorProps = {};
      function vendorPropName(name) {
        var capName = name[0].toUpperCase() + name.slice(1), i = cssPrefixes.length;
        while (i--) {
          name = cssPrefixes[i] + capName;
          if (name in emptyStyle) {
            return name;
          }
        }
      }
      function finalPropName(name) {
        var final = jQuery.cssProps[name] || vendorProps[name];
        if (final) {
          return final;
        }
        if (name in emptyStyle) {
          return name;
        }
        return vendorProps[name] = vendorPropName(name) || name;
      }
      var rdisplayswap = /^(none|table(?!-c[ea]).+)/, cssShow = { position: "absolute", visibility: "hidden", display: "block" }, cssNormalTransform = {
        letterSpacing: "0",
        fontWeight: "400"
      };
      function setPositiveNumber(_elem, value, subtract) {
        var matches = rcssNum.exec(value);
        return matches ? (
          // Guard against undefined "subtract", e.g., when used as in cssHooks
          Math.max(0, matches[2] - (subtract || 0)) + (matches[3] || "px")
        ) : value;
      }
      function boxModelAdjustment(elem, dimension, box, isBorderBox, styles, computedVal) {
        var i = dimension === "width" ? 1 : 0, extra = 0, delta = 0, marginDelta = 0;
        if (box === (isBorderBox ? "border" : "content")) {
          return 0;
        }
        for (; i < 4; i += 2) {
          if (box === "margin") {
            marginDelta += jQuery.css(elem, box + cssExpand[i], true, styles);
          }
          if (!isBorderBox) {
            delta += jQuery.css(elem, "padding" + cssExpand[i], true, styles);
            if (box !== "padding") {
              delta += jQuery.css(elem, "border" + cssExpand[i] + "Width", true, styles);
            } else {
              extra += jQuery.css(elem, "border" + cssExpand[i] + "Width", true, styles);
            }
          } else {
            if (box === "content") {
              delta -= jQuery.css(elem, "padding" + cssExpand[i], true, styles);
            }
            if (box !== "margin") {
              delta -= jQuery.css(elem, "border" + cssExpand[i] + "Width", true, styles);
            }
          }
        }
        if (!isBorderBox && computedVal >= 0) {
          delta += Math.max(0, Math.ceil(
            elem["offset" + dimension[0].toUpperCase() + dimension.slice(1)] - computedVal - delta - extra - 0.5
            // If offsetWidth/offsetHeight is unknown, then we can't determine content-box scroll gutter
            // Use an explicit zero to avoid NaN (gh-3964)
          )) || 0;
        }
        return delta + marginDelta;
      }
      function getWidthOrHeight(elem, dimension, extra) {
        var styles = getStyles(elem), boxSizingNeeded = !support.boxSizingReliable() || extra, isBorderBox = boxSizingNeeded && jQuery.css(elem, "boxSizing", false, styles) === "border-box", valueIsBorderBox = isBorderBox, val = curCSS(elem, dimension, styles), offsetProp = "offset" + dimension[0].toUpperCase() + dimension.slice(1);
        if (rnumnonpx.test(val)) {
          if (!extra) {
            return val;
          }
          val = "auto";
        }
        if ((!support.boxSizingReliable() && isBorderBox || // Support: IE 10 - 11+, Edge 15 - 18+
        // IE/Edge misreport `getComputedStyle` of table rows with width/height
        // set in CSS while `offset*` properties report correct values.
        // Interestingly, in some cases IE 9 doesn't suffer from this issue.
        !support.reliableTrDimensions() && nodeName(elem, "tr") || // Fall back to offsetWidth/offsetHeight when value is "auto"
        // This happens for inline elements with no explicit setting (gh-3571)
        val === "auto" || // Support: Android <=4.1 - 4.3 only
        // Also use offsetWidth/offsetHeight for misreported inline dimensions (gh-3602)
        !parseFloat(val) && jQuery.css(elem, "display", false, styles) === "inline") && // Make sure the element is visible & connected
        elem.getClientRects().length) {
          isBorderBox = jQuery.css(elem, "boxSizing", false, styles) === "border-box";
          valueIsBorderBox = offsetProp in elem;
          if (valueIsBorderBox) {
            val = elem[offsetProp];
          }
        }
        val = parseFloat(val) || 0;
        return val + boxModelAdjustment(
          elem,
          dimension,
          extra || (isBorderBox ? "border" : "content"),
          valueIsBorderBox,
          styles,
          // Provide the current computed size to request scroll gutter calculation (gh-3589)
          val
        ) + "px";
      }
      jQuery.extend({
        // Add in style property hooks for overriding the default
        // behavior of getting and setting a style property
        cssHooks: {
          opacity: {
            get: function(elem, computed) {
              if (computed) {
                var ret = curCSS(elem, "opacity");
                return ret === "" ? "1" : ret;
              }
            }
          }
        },
        // Don't automatically add "px" to these possibly-unitless properties
        cssNumber: {
          animationIterationCount: true,
          aspectRatio: true,
          borderImageSlice: true,
          columnCount: true,
          flexGrow: true,
          flexShrink: true,
          fontWeight: true,
          gridArea: true,
          gridColumn: true,
          gridColumnEnd: true,
          gridColumnStart: true,
          gridRow: true,
          gridRowEnd: true,
          gridRowStart: true,
          lineHeight: true,
          opacity: true,
          order: true,
          orphans: true,
          scale: true,
          widows: true,
          zIndex: true,
          zoom: true,
          // SVG-related
          fillOpacity: true,
          floodOpacity: true,
          stopOpacity: true,
          strokeMiterlimit: true,
          strokeOpacity: true
        },
        // Add in properties whose names you wish to fix before
        // setting or getting the value
        cssProps: {},
        // Get and set the style property on a DOM Node
        style: function(elem, name, value, extra) {
          if (!elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style) {
            return;
          }
          var ret, type, hooks, origName = camelCase(name), isCustomProp = rcustomProp.test(name), style = elem.style;
          if (!isCustomProp) {
            name = finalPropName(origName);
          }
          hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName];
          if (value !== void 0) {
            type = typeof value;
            if (type === "string" && (ret = rcssNum.exec(value)) && ret[1]) {
              value = adjustCSS(elem, name, ret);
              type = "number";
            }
            if (value == null || value !== value) {
              return;
            }
            if (type === "number" && !isCustomProp) {
              value += ret && ret[3] || (jQuery.cssNumber[origName] ? "" : "px");
            }
            if (!support.clearCloneStyle && value === "" && name.indexOf("background") === 0) {
              style[name] = "inherit";
            }
            if (!hooks || !("set" in hooks) || (value = hooks.set(elem, value, extra)) !== void 0) {
              if (isCustomProp) {
                style.setProperty(name, value);
              } else {
                style[name] = value;
              }
            }
          } else {
            if (hooks && "get" in hooks && (ret = hooks.get(elem, false, extra)) !== void 0) {
              return ret;
            }
            return style[name];
          }
        },
        css: function(elem, name, extra, styles) {
          var val, num, hooks, origName = camelCase(name), isCustomProp = rcustomProp.test(name);
          if (!isCustomProp) {
            name = finalPropName(origName);
          }
          hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName];
          if (hooks && "get" in hooks) {
            val = hooks.get(elem, true, extra);
          }
          if (val === void 0) {
            val = curCSS(elem, name, styles);
          }
          if (val === "normal" && name in cssNormalTransform) {
            val = cssNormalTransform[name];
          }
          if (extra === "" || extra) {
            num = parseFloat(val);
            return extra === true || isFinite(num) ? num || 0 : val;
          }
          return val;
        }
      });
      jQuery.each(["height", "width"], function(_i, dimension) {
        jQuery.cssHooks[dimension] = {
          get: function(elem, computed, extra) {
            if (computed) {
              return rdisplayswap.test(jQuery.css(elem, "display")) && // Support: Safari 8+
              // Table columns in Safari have non-zero offsetWidth & zero
              // getBoundingClientRect().width unless display is changed.
              // Support: IE <=11 only
              // Running getBoundingClientRect on a disconnected node
              // in IE throws an error.
              (!elem.getClientRects().length || !elem.getBoundingClientRect().width) ? swap(elem, cssShow, function() {
                return getWidthOrHeight(elem, dimension, extra);
              }) : getWidthOrHeight(elem, dimension, extra);
            }
          },
          set: function(elem, value, extra) {
            var matches, styles = getStyles(elem), scrollboxSizeBuggy = !support.scrollboxSize() && styles.position === "absolute", boxSizingNeeded = scrollboxSizeBuggy || extra, isBorderBox = boxSizingNeeded && jQuery.css(elem, "boxSizing", false, styles) === "border-box", subtract = extra ? boxModelAdjustment(
              elem,
              dimension,
              extra,
              isBorderBox,
              styles
            ) : 0;
            if (isBorderBox && scrollboxSizeBuggy) {
              subtract -= Math.ceil(
                elem["offset" + dimension[0].toUpperCase() + dimension.slice(1)] - parseFloat(styles[dimension]) - boxModelAdjustment(elem, dimension, "border", false, styles) - 0.5
              );
            }
            if (subtract && (matches = rcssNum.exec(value)) && (matches[3] || "px") !== "px") {
              elem.style[dimension] = value;
              value = jQuery.css(elem, dimension);
            }
            return setPositiveNumber(elem, value, subtract);
          }
        };
      });
      jQuery.cssHooks.marginLeft = addGetHookIf(
        support.reliableMarginLeft,
        function(elem, computed) {
          if (computed) {
            return (parseFloat(curCSS(elem, "marginLeft")) || elem.getBoundingClientRect().left - swap(elem, { marginLeft: 0 }, function() {
              return elem.getBoundingClientRect().left;
            })) + "px";
          }
        }
      );
      jQuery.each({
        margin: "",
        padding: "",
        border: "Width"
      }, function(prefix, suffix) {
        jQuery.cssHooks[prefix + suffix] = {
          expand: function(value) {
            var i = 0, expanded = {}, parts = typeof value === "string" ? value.split(" ") : [value];
            for (; i < 4; i++) {
              expanded[prefix + cssExpand[i] + suffix] = parts[i] || parts[i - 2] || parts[0];
            }
            return expanded;
          }
        };
        if (prefix !== "margin") {
          jQuery.cssHooks[prefix + suffix].set = setPositiveNumber;
        }
      });
      jQuery.fn.extend({
        css: function(name, value) {
          return access(this, function(elem, name2, value2) {
            var styles, len, map = {}, i = 0;
            if (Array.isArray(name2)) {
              styles = getStyles(elem);
              len = name2.length;
              for (; i < len; i++) {
                map[name2[i]] = jQuery.css(elem, name2[i], false, styles);
              }
              return map;
            }
            return value2 !== void 0 ? jQuery.style(elem, name2, value2) : jQuery.css(elem, name2);
          }, name, value, arguments.length > 1);
        }
      });
      function Tween(elem, options, prop, end, easing) {
        return new Tween.prototype.init(elem, options, prop, end, easing);
      }
      jQuery.Tween = Tween;
      Tween.prototype = {
        constructor: Tween,
        init: function(elem, options, prop, end, easing, unit) {
          this.elem = elem;
          this.prop = prop;
          this.easing = easing || jQuery.easing._default;
          this.options = options;
          this.start = this.now = this.cur();
          this.end = end;
          this.unit = unit || (jQuery.cssNumber[prop] ? "" : "px");
        },
        cur: function() {
          var hooks = Tween.propHooks[this.prop];
          return hooks && hooks.get ? hooks.get(this) : Tween.propHooks._default.get(this);
        },
        run: function(percent) {
          var eased, hooks = Tween.propHooks[this.prop];
          if (this.options.duration) {
            this.pos = eased = jQuery.easing[this.easing](
              percent,
              this.options.duration * percent,
              0,
              1,
              this.options.duration
            );
          } else {
            this.pos = eased = percent;
          }
          this.now = (this.end - this.start) * eased + this.start;
          if (this.options.step) {
            this.options.step.call(this.elem, this.now, this);
          }
          if (hooks && hooks.set) {
            hooks.set(this);
          } else {
            Tween.propHooks._default.set(this);
          }
          return this;
        }
      };
      Tween.prototype.init.prototype = Tween.prototype;
      Tween.propHooks = {
        _default: {
          get: function(tween) {
            var result;
            if (tween.elem.nodeType !== 1 || tween.elem[tween.prop] != null && tween.elem.style[tween.prop] == null) {
              return tween.elem[tween.prop];
            }
            result = jQuery.css(tween.elem, tween.prop, "");
            return !result || result === "auto" ? 0 : result;
          },
          set: function(tween) {
            if (jQuery.fx.step[tween.prop]) {
              jQuery.fx.step[tween.prop](tween);
            } else if (tween.elem.nodeType === 1 && (jQuery.cssHooks[tween.prop] || tween.elem.style[finalPropName(tween.prop)] != null)) {
              jQuery.style(tween.elem, tween.prop, tween.now + tween.unit);
            } else {
              tween.elem[tween.prop] = tween.now;
            }
          }
        }
      };
      Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
        set: function(tween) {
          if (tween.elem.nodeType && tween.elem.parentNode) {
            tween.elem[tween.prop] = tween.now;
          }
        }
      };
      jQuery.easing = {
        linear: function(p) {
          return p;
        },
        swing: function(p) {
          return 0.5 - Math.cos(p * Math.PI) / 2;
        },
        _default: "swing"
      };
      jQuery.fx = Tween.prototype.init;
      jQuery.fx.step = {};
      var fxNow, inProgress, rfxtypes = /^(?:toggle|show|hide)$/, rrun = /queueHooks$/;
      function schedule() {
        if (inProgress) {
          if (document2.hidden === false && window2.requestAnimationFrame) {
            window2.requestAnimationFrame(schedule);
          } else {
            window2.setTimeout(schedule, jQuery.fx.interval);
          }
          jQuery.fx.tick();
        }
      }
      function createFxNow() {
        window2.setTimeout(function() {
          fxNow = void 0;
        });
        return fxNow = Date.now();
      }
      function genFx(type, includeWidth) {
        var which, i = 0, attrs = { height: type };
        includeWidth = includeWidth ? 1 : 0;
        for (; i < 4; i += 2 - includeWidth) {
          which = cssExpand[i];
          attrs["margin" + which] = attrs["padding" + which] = type;
        }
        if (includeWidth) {
          attrs.opacity = attrs.width = type;
        }
        return attrs;
      }
      function createTween(value, prop, animation) {
        var tween, collection = (Animation.tweeners[prop] || []).concat(Animation.tweeners["*"]), index = 0, length = collection.length;
        for (; index < length; index++) {
          if (tween = collection[index].call(animation, prop, value)) {
            return tween;
          }
        }
      }
      function defaultPrefilter(elem, props, opts) {
        var prop, value, toggle, hooks, oldfire, propTween, restoreDisplay, display, isBox = "width" in props || "height" in props, anim = this, orig = {}, style = elem.style, hidden = elem.nodeType && isHiddenWithinTree(elem), dataShow = dataPriv.get(elem, "fxshow");
        if (!opts.queue) {
          hooks = jQuery._queueHooks(elem, "fx");
          if (hooks.unqueued == null) {
            hooks.unqueued = 0;
            oldfire = hooks.empty.fire;
            hooks.empty.fire = function() {
              if (!hooks.unqueued) {
                oldfire();
              }
            };
          }
          hooks.unqueued++;
          anim.always(function() {
            anim.always(function() {
              hooks.unqueued--;
              if (!jQuery.queue(elem, "fx").length) {
                hooks.empty.fire();
              }
            });
          });
        }
        for (prop in props) {
          value = props[prop];
          if (rfxtypes.test(value)) {
            delete props[prop];
            toggle = toggle || value === "toggle";
            if (value === (hidden ? "hide" : "show")) {
              if (value === "show" && dataShow && dataShow[prop] !== void 0) {
                hidden = true;
              } else {
                continue;
              }
            }
            orig[prop] = dataShow && dataShow[prop] || jQuery.style(elem, prop);
          }
        }
        propTween = !jQuery.isEmptyObject(props);
        if (!propTween && jQuery.isEmptyObject(orig)) {
          return;
        }
        if (isBox && elem.nodeType === 1) {
          opts.overflow = [style.overflow, style.overflowX, style.overflowY];
          restoreDisplay = dataShow && dataShow.display;
          if (restoreDisplay == null) {
            restoreDisplay = dataPriv.get(elem, "display");
          }
          display = jQuery.css(elem, "display");
          if (display === "none") {
            if (restoreDisplay) {
              display = restoreDisplay;
            } else {
              showHide([elem], true);
              restoreDisplay = elem.style.display || restoreDisplay;
              display = jQuery.css(elem, "display");
              showHide([elem]);
            }
          }
          if (display === "inline" || display === "inline-block" && restoreDisplay != null) {
            if (jQuery.css(elem, "float") === "none") {
              if (!propTween) {
                anim.done(function() {
                  style.display = restoreDisplay;
                });
                if (restoreDisplay == null) {
                  display = style.display;
                  restoreDisplay = display === "none" ? "" : display;
                }
              }
              style.display = "inline-block";
            }
          }
        }
        if (opts.overflow) {
          style.overflow = "hidden";
          anim.always(function() {
            style.overflow = opts.overflow[0];
            style.overflowX = opts.overflow[1];
            style.overflowY = opts.overflow[2];
          });
        }
        propTween = false;
        for (prop in orig) {
          if (!propTween) {
            if (dataShow) {
              if ("hidden" in dataShow) {
                hidden = dataShow.hidden;
              }
            } else {
              dataShow = dataPriv.access(elem, "fxshow", { display: restoreDisplay });
            }
            if (toggle) {
              dataShow.hidden = !hidden;
            }
            if (hidden) {
              showHide([elem], true);
            }
            anim.done(function() {
              if (!hidden) {
                showHide([elem]);
              }
              dataPriv.remove(elem, "fxshow");
              for (prop in orig) {
                jQuery.style(elem, prop, orig[prop]);
              }
            });
          }
          propTween = createTween(hidden ? dataShow[prop] : 0, prop, anim);
          if (!(prop in dataShow)) {
            dataShow[prop] = propTween.start;
            if (hidden) {
              propTween.end = propTween.start;
              propTween.start = 0;
            }
          }
        }
      }
      function propFilter(props, specialEasing) {
        var index, name, easing, value, hooks;
        for (index in props) {
          name = camelCase(index);
          easing = specialEasing[name];
          value = props[index];
          if (Array.isArray(value)) {
            easing = value[1];
            value = props[index] = value[0];
          }
          if (index !== name) {
            props[name] = value;
            delete props[index];
          }
          hooks = jQuery.cssHooks[name];
          if (hooks && "expand" in hooks) {
            value = hooks.expand(value);
            delete props[name];
            for (index in value) {
              if (!(index in props)) {
                props[index] = value[index];
                specialEasing[index] = easing;
              }
            }
          } else {
            specialEasing[name] = easing;
          }
        }
      }
      function Animation(elem, properties, options) {
        var result, stopped, index = 0, length = Animation.prefilters.length, deferred = jQuery.Deferred().always(function() {
          delete tick.elem;
        }), tick = function() {
          if (stopped) {
            return false;
          }
          var currentTime2 = fxNow || createFxNow(), remaining = Math.max(0, animation.startTime + animation.duration - currentTime2), temp = remaining / animation.duration || 0, percent = 1 - temp, index2 = 0, length2 = animation.tweens.length;
          for (; index2 < length2; index2++) {
            animation.tweens[index2].run(percent);
          }
          deferred.notifyWith(elem, [animation, percent, remaining]);
          if (percent < 1 && length2) {
            return remaining;
          }
          if (!length2) {
            deferred.notifyWith(elem, [animation, 1, 0]);
          }
          deferred.resolveWith(elem, [animation]);
          return false;
        }, animation = deferred.promise({
          elem,
          props: jQuery.extend({}, properties),
          opts: jQuery.extend(true, {
            specialEasing: {},
            easing: jQuery.easing._default
          }, options),
          originalProperties: properties,
          originalOptions: options,
          startTime: fxNow || createFxNow(),
          duration: options.duration,
          tweens: [],
          createTween: function(prop, end) {
            var tween = jQuery.Tween(
              elem,
              animation.opts,
              prop,
              end,
              animation.opts.specialEasing[prop] || animation.opts.easing
            );
            animation.tweens.push(tween);
            return tween;
          },
          stop: function(gotoEnd) {
            var index2 = 0, length2 = gotoEnd ? animation.tweens.length : 0;
            if (stopped) {
              return this;
            }
            stopped = true;
            for (; index2 < length2; index2++) {
              animation.tweens[index2].run(1);
            }
            if (gotoEnd) {
              deferred.notifyWith(elem, [animation, 1, 0]);
              deferred.resolveWith(elem, [animation, gotoEnd]);
            } else {
              deferred.rejectWith(elem, [animation, gotoEnd]);
            }
            return this;
          }
        }), props = animation.props;
        propFilter(props, animation.opts.specialEasing);
        for (; index < length; index++) {
          result = Animation.prefilters[index].call(animation, elem, props, animation.opts);
          if (result) {
            if (isFunction(result.stop)) {
              jQuery._queueHooks(animation.elem, animation.opts.queue).stop = result.stop.bind(result);
            }
            return result;
          }
        }
        jQuery.map(props, createTween, animation);
        if (isFunction(animation.opts.start)) {
          animation.opts.start.call(elem, animation);
        }
        animation.progress(animation.opts.progress).done(animation.opts.done, animation.opts.complete).fail(animation.opts.fail).always(animation.opts.always);
        jQuery.fx.timer(
          jQuery.extend(tick, {
            elem,
            anim: animation,
            queue: animation.opts.queue
          })
        );
        return animation;
      }
      jQuery.Animation = jQuery.extend(Animation, {
        tweeners: {
          "*": [function(prop, value) {
            var tween = this.createTween(prop, value);
            adjustCSS(tween.elem, prop, rcssNum.exec(value), tween);
            return tween;
          }]
        },
        tweener: function(props, callback) {
          if (isFunction(props)) {
            callback = props;
            props = ["*"];
          } else {
            props = props.match(rnothtmlwhite);
          }
          var prop, index = 0, length = props.length;
          for (; index < length; index++) {
            prop = props[index];
            Animation.tweeners[prop] = Animation.tweeners[prop] || [];
            Animation.tweeners[prop].unshift(callback);
          }
        },
        prefilters: [defaultPrefilter],
        prefilter: function(callback, prepend) {
          if (prepend) {
            Animation.prefilters.unshift(callback);
          } else {
            Animation.prefilters.push(callback);
          }
        }
      });
      jQuery.speed = function(speed, easing, fn) {
        var opt = speed && typeof speed === "object" ? jQuery.extend({}, speed) : {
          complete: fn || !fn && easing || isFunction(speed) && speed,
          duration: speed,
          easing: fn && easing || easing && !isFunction(easing) && easing
        };
        if (jQuery.fx.off) {
          opt.duration = 0;
        } else {
          if (typeof opt.duration !== "number") {
            if (opt.duration in jQuery.fx.speeds) {
              opt.duration = jQuery.fx.speeds[opt.duration];
            } else {
              opt.duration = jQuery.fx.speeds._default;
            }
          }
        }
        if (opt.queue == null || opt.queue === true) {
          opt.queue = "fx";
        }
        opt.old = opt.complete;
        opt.complete = function() {
          if (isFunction(opt.old)) {
            opt.old.call(this);
          }
          if (opt.queue) {
            jQuery.dequeue(this, opt.queue);
          }
        };
        return opt;
      };
      jQuery.fn.extend({
        fadeTo: function(speed, to, easing, callback) {
          return this.filter(isHiddenWithinTree).css("opacity", 0).show().end().animate({ opacity: to }, speed, easing, callback);
        },
        animate: function(prop, speed, easing, callback) {
          var empty = jQuery.isEmptyObject(prop), optall = jQuery.speed(speed, easing, callback), doAnimation = function() {
            var anim = Animation(this, jQuery.extend({}, prop), optall);
            if (empty || dataPriv.get(this, "finish")) {
              anim.stop(true);
            }
          };
          doAnimation.finish = doAnimation;
          return empty || optall.queue === false ? this.each(doAnimation) : this.queue(optall.queue, doAnimation);
        },
        stop: function(type, clearQueue, gotoEnd) {
          var stopQueue = function(hooks) {
            var stop = hooks.stop;
            delete hooks.stop;
            stop(gotoEnd);
          };
          if (typeof type !== "string") {
            gotoEnd = clearQueue;
            clearQueue = type;
            type = void 0;
          }
          if (clearQueue) {
            this.queue(type || "fx", []);
          }
          return this.each(function() {
            var dequeue = true, index = type != null && type + "queueHooks", timers = jQuery.timers, data2 = dataPriv.get(this);
            if (index) {
              if (data2[index] && data2[index].stop) {
                stopQueue(data2[index]);
              }
            } else {
              for (index in data2) {
                if (data2[index] && data2[index].stop && rrun.test(index)) {
                  stopQueue(data2[index]);
                }
              }
            }
            for (index = timers.length; index--; ) {
              if (timers[index].elem === this && (type == null || timers[index].queue === type)) {
                timers[index].anim.stop(gotoEnd);
                dequeue = false;
                timers.splice(index, 1);
              }
            }
            if (dequeue || !gotoEnd) {
              jQuery.dequeue(this, type);
            }
          });
        },
        finish: function(type) {
          if (type !== false) {
            type = type || "fx";
          }
          return this.each(function() {
            var index, data2 = dataPriv.get(this), queue = data2[type + "queue"], hooks = data2[type + "queueHooks"], timers = jQuery.timers, length = queue ? queue.length : 0;
            data2.finish = true;
            jQuery.queue(this, type, []);
            if (hooks && hooks.stop) {
              hooks.stop.call(this, true);
            }
            for (index = timers.length; index--; ) {
              if (timers[index].elem === this && timers[index].queue === type) {
                timers[index].anim.stop(true);
                timers.splice(index, 1);
              }
            }
            for (index = 0; index < length; index++) {
              if (queue[index] && queue[index].finish) {
                queue[index].finish.call(this);
              }
            }
            delete data2.finish;
          });
        }
      });
      jQuery.each(["toggle", "show", "hide"], function(_i, name) {
        var cssFn = jQuery.fn[name];
        jQuery.fn[name] = function(speed, easing, callback) {
          return speed == null || typeof speed === "boolean" ? cssFn.apply(this, arguments) : this.animate(genFx(name, true), speed, easing, callback);
        };
      });
      jQuery.each({
        slideDown: genFx("show"),
        slideUp: genFx("hide"),
        slideToggle: genFx("toggle"),
        fadeIn: { opacity: "show" },
        fadeOut: { opacity: "hide" },
        fadeToggle: { opacity: "toggle" }
      }, function(name, props) {
        jQuery.fn[name] = function(speed, easing, callback) {
          return this.animate(props, speed, easing, callback);
        };
      });
      jQuery.timers = [];
      jQuery.fx.tick = function() {
        var timer, i = 0, timers = jQuery.timers;
        fxNow = Date.now();
        for (; i < timers.length; i++) {
          timer = timers[i];
          if (!timer() && timers[i] === timer) {
            timers.splice(i--, 1);
          }
        }
        if (!timers.length) {
          jQuery.fx.stop();
        }
        fxNow = void 0;
      };
      jQuery.fx.timer = function(timer) {
        jQuery.timers.push(timer);
        jQuery.fx.start();
      };
      jQuery.fx.interval = 13;
      jQuery.fx.start = function() {
        if (inProgress) {
          return;
        }
        inProgress = true;
        schedule();
      };
      jQuery.fx.stop = function() {
        inProgress = null;
      };
      jQuery.fx.speeds = {
        slow: 600,
        fast: 200,
        // Default speed
        _default: 400
      };
      jQuery.fn.delay = function(time, type) {
        time = jQuery.fx ? jQuery.fx.speeds[time] || time : time;
        type = type || "fx";
        return this.queue(type, function(next, hooks) {
          var timeout = window2.setTimeout(next, time);
          hooks.stop = function() {
            window2.clearTimeout(timeout);
          };
        });
      };
      (function() {
        var input = document2.createElement("input"), select = document2.createElement("select"), opt = select.appendChild(document2.createElement("option"));
        input.type = "checkbox";
        support.checkOn = input.value !== "";
        support.optSelected = opt.selected;
        input = document2.createElement("input");
        input.value = "t";
        input.type = "radio";
        support.radioValue = input.value === "t";
      })();
      var boolHook, attrHandle = jQuery.expr.attrHandle;
      jQuery.fn.extend({
        attr: function(name, value) {
          return access(this, jQuery.attr, name, value, arguments.length > 1);
        },
        removeAttr: function(name) {
          return this.each(function() {
            jQuery.removeAttr(this, name);
          });
        }
      });
      jQuery.extend({
        attr: function(elem, name, value) {
          var ret, hooks, nType = elem.nodeType;
          if (nType === 3 || nType === 8 || nType === 2) {
            return;
          }
          if (typeof elem.getAttribute === "undefined") {
            return jQuery.prop(elem, name, value);
          }
          if (nType !== 1 || !jQuery.isXMLDoc(elem)) {
            hooks = jQuery.attrHooks[name.toLowerCase()] || (jQuery.expr.match.bool.test(name) ? boolHook : void 0);
          }
          if (value !== void 0) {
            if (value === null) {
              jQuery.removeAttr(elem, name);
              return;
            }
            if (hooks && "set" in hooks && (ret = hooks.set(elem, value, name)) !== void 0) {
              return ret;
            }
            elem.setAttribute(name, value + "");
            return value;
          }
          if (hooks && "get" in hooks && (ret = hooks.get(elem, name)) !== null) {
            return ret;
          }
          ret = jQuery.find.attr(elem, name);
          return ret == null ? void 0 : ret;
        },
        attrHooks: {
          type: {
            set: function(elem, value) {
              if (!support.radioValue && value === "radio" && nodeName(elem, "input")) {
                var val = elem.value;
                elem.setAttribute("type", value);
                if (val) {
                  elem.value = val;
                }
                return value;
              }
            }
          }
        },
        removeAttr: function(elem, value) {
          var name, i = 0, attrNames = value && value.match(rnothtmlwhite);
          if (attrNames && elem.nodeType === 1) {
            while (name = attrNames[i++]) {
              elem.removeAttribute(name);
            }
          }
        }
      });
      boolHook = {
        set: function(elem, value, name) {
          if (value === false) {
            jQuery.removeAttr(elem, name);
          } else {
            elem.setAttribute(name, name);
          }
          return name;
        }
      };
      jQuery.each(jQuery.expr.match.bool.source.match(/\w+/g), function(_i, name) {
        var getter = attrHandle[name] || jQuery.find.attr;
        attrHandle[name] = function(elem, name2, isXML) {
          var ret, handle, lowercaseName = name2.toLowerCase();
          if (!isXML) {
            handle = attrHandle[lowercaseName];
            attrHandle[lowercaseName] = ret;
            ret = getter(elem, name2, isXML) != null ? lowercaseName : null;
            attrHandle[lowercaseName] = handle;
          }
          return ret;
        };
      });
      var rfocusable = /^(?:input|select|textarea|button)$/i, rclickable = /^(?:a|area)$/i;
      jQuery.fn.extend({
        prop: function(name, value) {
          return access(this, jQuery.prop, name, value, arguments.length > 1);
        },
        removeProp: function(name) {
          return this.each(function() {
            delete this[jQuery.propFix[name] || name];
          });
        }
      });
      jQuery.extend({
        prop: function(elem, name, value) {
          var ret, hooks, nType = elem.nodeType;
          if (nType === 3 || nType === 8 || nType === 2) {
            return;
          }
          if (nType !== 1 || !jQuery.isXMLDoc(elem)) {
            name = jQuery.propFix[name] || name;
            hooks = jQuery.propHooks[name];
          }
          if (value !== void 0) {
            if (hooks && "set" in hooks && (ret = hooks.set(elem, value, name)) !== void 0) {
              return ret;
            }
            return elem[name] = value;
          }
          if (hooks && "get" in hooks && (ret = hooks.get(elem, name)) !== null) {
            return ret;
          }
          return elem[name];
        },
        propHooks: {
          tabIndex: {
            get: function(elem) {
              var tabindex = jQuery.find.attr(elem, "tabindex");
              if (tabindex) {
                return parseInt(tabindex, 10);
              }
              if (rfocusable.test(elem.nodeName) || rclickable.test(elem.nodeName) && elem.href) {
                return 0;
              }
              return -1;
            }
          }
        },
        propFix: {
          "for": "htmlFor",
          "class": "className"
        }
      });
      if (!support.optSelected) {
        jQuery.propHooks.selected = {
          get: function(elem) {
            var parent = elem.parentNode;
            if (parent && parent.parentNode) {
              parent.parentNode.selectedIndex;
            }
            return null;
          },
          set: function(elem) {
            var parent = elem.parentNode;
            if (parent) {
              parent.selectedIndex;
              if (parent.parentNode) {
                parent.parentNode.selectedIndex;
              }
            }
          }
        };
      }
      jQuery.each([
        "tabIndex",
        "readOnly",
        "maxLength",
        "cellSpacing",
        "cellPadding",
        "rowSpan",
        "colSpan",
        "useMap",
        "frameBorder",
        "contentEditable"
      ], function() {
        jQuery.propFix[this.toLowerCase()] = this;
      });
      function stripAndCollapse(value) {
        var tokens = value.match(rnothtmlwhite) || [];
        return tokens.join(" ");
      }
      function getClass(elem) {
        return elem.getAttribute && elem.getAttribute("class") || "";
      }
      function classesToArray(value) {
        if (Array.isArray(value)) {
          return value;
        }
        if (typeof value === "string") {
          return value.match(rnothtmlwhite) || [];
        }
        return [];
      }
      jQuery.fn.extend({
        addClass: function(value) {
          var classNames, cur, curValue, className, i, finalValue;
          if (isFunction(value)) {
            return this.each(function(j) {
              jQuery(this).addClass(value.call(this, j, getClass(this)));
            });
          }
          classNames = classesToArray(value);
          if (classNames.length) {
            return this.each(function() {
              curValue = getClass(this);
              cur = this.nodeType === 1 && " " + stripAndCollapse(curValue) + " ";
              if (cur) {
                for (i = 0; i < classNames.length; i++) {
                  className = classNames[i];
                  if (cur.indexOf(" " + className + " ") < 0) {
                    cur += className + " ";
                  }
                }
                finalValue = stripAndCollapse(cur);
                if (curValue !== finalValue) {
                  this.setAttribute("class", finalValue);
                }
              }
            });
          }
          return this;
        },
        removeClass: function(value) {
          var classNames, cur, curValue, className, i, finalValue;
          if (isFunction(value)) {
            return this.each(function(j) {
              jQuery(this).removeClass(value.call(this, j, getClass(this)));
            });
          }
          if (!arguments.length) {
            return this.attr("class", "");
          }
          classNames = classesToArray(value);
          if (classNames.length) {
            return this.each(function() {
              curValue = getClass(this);
              cur = this.nodeType === 1 && " " + stripAndCollapse(curValue) + " ";
              if (cur) {
                for (i = 0; i < classNames.length; i++) {
                  className = classNames[i];
                  while (cur.indexOf(" " + className + " ") > -1) {
                    cur = cur.replace(" " + className + " ", " ");
                  }
                }
                finalValue = stripAndCollapse(cur);
                if (curValue !== finalValue) {
                  this.setAttribute("class", finalValue);
                }
              }
            });
          }
          return this;
        },
        toggleClass: function(value, stateVal) {
          var classNames, className, i, self, type = typeof value, isValidValue = type === "string" || Array.isArray(value);
          if (isFunction(value)) {
            return this.each(function(i2) {
              jQuery(this).toggleClass(
                value.call(this, i2, getClass(this), stateVal),
                stateVal
              );
            });
          }
          if (typeof stateVal === "boolean" && isValidValue) {
            return stateVal ? this.addClass(value) : this.removeClass(value);
          }
          classNames = classesToArray(value);
          return this.each(function() {
            if (isValidValue) {
              self = jQuery(this);
              for (i = 0; i < classNames.length; i++) {
                className = classNames[i];
                if (self.hasClass(className)) {
                  self.removeClass(className);
                } else {
                  self.addClass(className);
                }
              }
            } else if (value === void 0 || type === "boolean") {
              className = getClass(this);
              if (className) {
                dataPriv.set(this, "__className__", className);
              }
              if (this.setAttribute) {
                this.setAttribute(
                  "class",
                  className || value === false ? "" : dataPriv.get(this, "__className__") || ""
                );
              }
            }
          });
        },
        hasClass: function(selector) {
          var className, elem, i = 0;
          className = " " + selector + " ";
          while (elem = this[i++]) {
            if (elem.nodeType === 1 && (" " + stripAndCollapse(getClass(elem)) + " ").indexOf(className) > -1) {
              return true;
            }
          }
          return false;
        }
      });
      var rreturn = /\r/g;
      jQuery.fn.extend({
        val: function(value) {
          var hooks, ret, valueIsFunction, elem = this[0];
          if (!arguments.length) {
            if (elem) {
              hooks = jQuery.valHooks[elem.type] || jQuery.valHooks[elem.nodeName.toLowerCase()];
              if (hooks && "get" in hooks && (ret = hooks.get(elem, "value")) !== void 0) {
                return ret;
              }
              ret = elem.value;
              if (typeof ret === "string") {
                return ret.replace(rreturn, "");
              }
              return ret == null ? "" : ret;
            }
            return;
          }
          valueIsFunction = isFunction(value);
          return this.each(function(i) {
            var val;
            if (this.nodeType !== 1) {
              return;
            }
            if (valueIsFunction) {
              val = value.call(this, i, jQuery(this).val());
            } else {
              val = value;
            }
            if (val == null) {
              val = "";
            } else if (typeof val === "number") {
              val += "";
            } else if (Array.isArray(val)) {
              val = jQuery.map(val, function(value2) {
                return value2 == null ? "" : value2 + "";
              });
            }
            hooks = jQuery.valHooks[this.type] || jQuery.valHooks[this.nodeName.toLowerCase()];
            if (!hooks || !("set" in hooks) || hooks.set(this, val, "value") === void 0) {
              this.value = val;
            }
          });
        }
      });
      jQuery.extend({
        valHooks: {
          option: {
            get: function(elem) {
              var val = jQuery.find.attr(elem, "value");
              return val != null ? val : (
                // Support: IE <=10 - 11 only
                // option.text throws exceptions (trac-14686, trac-14858)
                // Strip and collapse whitespace
                // https://html.spec.whatwg.org/#strip-and-collapse-whitespace
                stripAndCollapse(jQuery.text(elem))
              );
            }
          },
          select: {
            get: function(elem) {
              var value, option, i, options = elem.options, index = elem.selectedIndex, one = elem.type === "select-one", values = one ? null : [], max = one ? index + 1 : options.length;
              if (index < 0) {
                i = max;
              } else {
                i = one ? index : 0;
              }
              for (; i < max; i++) {
                option = options[i];
                if ((option.selected || i === index) && // Don't return options that are disabled or in a disabled optgroup
                !option.disabled && (!option.parentNode.disabled || !nodeName(option.parentNode, "optgroup"))) {
                  value = jQuery(option).val();
                  if (one) {
                    return value;
                  }
                  values.push(value);
                }
              }
              return values;
            },
            set: function(elem, value) {
              var optionSet, option, options = elem.options, values = jQuery.makeArray(value), i = options.length;
              while (i--) {
                option = options[i];
                if (option.selected = jQuery.inArray(jQuery.valHooks.option.get(option), values) > -1) {
                  optionSet = true;
                }
              }
              if (!optionSet) {
                elem.selectedIndex = -1;
              }
              return values;
            }
          }
        }
      });
      jQuery.each(["radio", "checkbox"], function() {
        jQuery.valHooks[this] = {
          set: function(elem, value) {
            if (Array.isArray(value)) {
              return elem.checked = jQuery.inArray(jQuery(elem).val(), value) > -1;
            }
          }
        };
        if (!support.checkOn) {
          jQuery.valHooks[this].get = function(elem) {
            return elem.getAttribute("value") === null ? "on" : elem.value;
          };
        }
      });
      var location2 = window2.location;
      var nonce = { guid: Date.now() };
      var rquery = /\?/;
      jQuery.parseXML = function(data2) {
        var xml, parserErrorElem;
        if (!data2 || typeof data2 !== "string") {
          return null;
        }
        try {
          xml = new window2.DOMParser().parseFromString(data2, "text/xml");
        } catch (e) {
        }
        parserErrorElem = xml && xml.getElementsByTagName("parsererror")[0];
        if (!xml || parserErrorElem) {
          jQuery.error("Invalid XML: " + (parserErrorElem ? jQuery.map(parserErrorElem.childNodes, function(el) {
            return el.textContent;
          }).join("\n") : data2));
        }
        return xml;
      };
      var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/, stopPropagationCallback = function(e) {
        e.stopPropagation();
      };
      jQuery.extend(jQuery.event, {
        trigger: function(event, data2, elem, onlyHandlers) {
          var i, cur, tmp, bubbleType, ontype, handle, special, lastElement, eventPath = [elem || document2], type = hasOwn.call(event, "type") ? event.type : event, namespaces = hasOwn.call(event, "namespace") ? event.namespace.split(".") : [];
          cur = lastElement = tmp = elem = elem || document2;
          if (elem.nodeType === 3 || elem.nodeType === 8) {
            return;
          }
          if (rfocusMorph.test(type + jQuery.event.triggered)) {
            return;
          }
          if (type.indexOf(".") > -1) {
            namespaces = type.split(".");
            type = namespaces.shift();
            namespaces.sort();
          }
          ontype = type.indexOf(":") < 0 && "on" + type;
          event = event[jQuery.expando] ? event : new jQuery.Event(type, typeof event === "object" && event);
          event.isTrigger = onlyHandlers ? 2 : 3;
          event.namespace = namespaces.join(".");
          event.rnamespace = event.namespace ? new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)") : null;
          event.result = void 0;
          if (!event.target) {
            event.target = elem;
          }
          data2 = data2 == null ? [event] : jQuery.makeArray(data2, [event]);
          special = jQuery.event.special[type] || {};
          if (!onlyHandlers && special.trigger && special.trigger.apply(elem, data2) === false) {
            return;
          }
          if (!onlyHandlers && !special.noBubble && !isWindow(elem)) {
            bubbleType = special.delegateType || type;
            if (!rfocusMorph.test(bubbleType + type)) {
              cur = cur.parentNode;
            }
            for (; cur; cur = cur.parentNode) {
              eventPath.push(cur);
              tmp = cur;
            }
            if (tmp === (elem.ownerDocument || document2)) {
              eventPath.push(tmp.defaultView || tmp.parentWindow || window2);
            }
          }
          i = 0;
          while ((cur = eventPath[i++]) && !event.isPropagationStopped()) {
            lastElement = cur;
            event.type = i > 1 ? bubbleType : special.bindType || type;
            handle = (dataPriv.get(cur, "events") || /* @__PURE__ */ Object.create(null))[event.type] && dataPriv.get(cur, "handle");
            if (handle) {
              handle.apply(cur, data2);
            }
            handle = ontype && cur[ontype];
            if (handle && handle.apply && acceptData(cur)) {
              event.result = handle.apply(cur, data2);
              if (event.result === false) {
                event.preventDefault();
              }
            }
          }
          event.type = type;
          if (!onlyHandlers && !event.isDefaultPrevented()) {
            if ((!special._default || special._default.apply(eventPath.pop(), data2) === false) && acceptData(elem)) {
              if (ontype && isFunction(elem[type]) && !isWindow(elem)) {
                tmp = elem[ontype];
                if (tmp) {
                  elem[ontype] = null;
                }
                jQuery.event.triggered = type;
                if (event.isPropagationStopped()) {
                  lastElement.addEventListener(type, stopPropagationCallback);
                }
                elem[type]();
                if (event.isPropagationStopped()) {
                  lastElement.removeEventListener(type, stopPropagationCallback);
                }
                jQuery.event.triggered = void 0;
                if (tmp) {
                  elem[ontype] = tmp;
                }
              }
            }
          }
          return event.result;
        },
        // Piggyback on a donor event to simulate a different one
        // Used only for `focus(in | out)` events
        simulate: function(type, elem, event) {
          var e = jQuery.extend(
            new jQuery.Event(),
            event,
            {
              type,
              isSimulated: true
            }
          );
          jQuery.event.trigger(e, null, elem);
        }
      });
      jQuery.fn.extend({
        trigger: function(type, data2) {
          return this.each(function() {
            jQuery.event.trigger(type, data2, this);
          });
        },
        triggerHandler: function(type, data2) {
          var elem = this[0];
          if (elem) {
            return jQuery.event.trigger(type, data2, elem, true);
          }
        }
      });
      var rbracket = /\[\]$/, rCRLF = /\r?\n/g, rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i, rsubmittable = /^(?:input|select|textarea|keygen)/i;
      function buildParams(prefix, obj, traditional, add) {
        var name;
        if (Array.isArray(obj)) {
          jQuery.each(obj, function(i, v) {
            if (traditional || rbracket.test(prefix)) {
              add(prefix, v);
            } else {
              buildParams(
                prefix + "[" + (typeof v === "object" && v != null ? i : "") + "]",
                v,
                traditional,
                add
              );
            }
          });
        } else if (!traditional && toType(obj) === "object") {
          for (name in obj) {
            buildParams(prefix + "[" + name + "]", obj[name], traditional, add);
          }
        } else {
          add(prefix, obj);
        }
      }
      jQuery.param = function(a, traditional) {
        var prefix, s = [], add = function(key, valueOrFunction) {
          var value = isFunction(valueOrFunction) ? valueOrFunction() : valueOrFunction;
          s[s.length] = encodeURIComponent(key) + "=" + encodeURIComponent(value == null ? "" : value);
        };
        if (a == null) {
          return "";
        }
        if (Array.isArray(a) || a.jquery && !jQuery.isPlainObject(a)) {
          jQuery.each(a, function() {
            add(this.name, this.value);
          });
        } else {
          for (prefix in a) {
            buildParams(prefix, a[prefix], traditional, add);
          }
        }
        return s.join("&");
      };
      jQuery.fn.extend({
        serialize: function() {
          return jQuery.param(this.serializeArray());
        },
        serializeArray: function() {
          return this.map(function() {
            var elements = jQuery.prop(this, "elements");
            return elements ? jQuery.makeArray(elements) : this;
          }).filter(function() {
            var type = this.type;
            return this.name && !jQuery(this).is(":disabled") && rsubmittable.test(this.nodeName) && !rsubmitterTypes.test(type) && (this.checked || !rcheckableType.test(type));
          }).map(function(_i, elem) {
            var val = jQuery(this).val();
            if (val == null) {
              return null;
            }
            if (Array.isArray(val)) {
              return jQuery.map(val, function(val2) {
                return { name: elem.name, value: val2.replace(rCRLF, "\r\n") };
              });
            }
            return { name: elem.name, value: val.replace(rCRLF, "\r\n") };
          }).get();
        }
      });
      var r20 = /%20/g, rhash = /#.*$/, rantiCache = /([?&])_=[^&]*/, rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg, rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/, rnoContent = /^(?:GET|HEAD)$/, rprotocol = /^\/\//, prefilters = {}, transports = {}, allTypes = "*/".concat("*"), originAnchor = document2.createElement("a");
      originAnchor.href = location2.href;
      function addToPrefiltersOrTransports(structure) {
        return function(dataTypeExpression, func) {
          if (typeof dataTypeExpression !== "string") {
            func = dataTypeExpression;
            dataTypeExpression = "*";
          }
          var dataType, i = 0, dataTypes = dataTypeExpression.toLowerCase().match(rnothtmlwhite) || [];
          if (isFunction(func)) {
            while (dataType = dataTypes[i++]) {
              if (dataType[0] === "+") {
                dataType = dataType.slice(1) || "*";
                (structure[dataType] = structure[dataType] || []).unshift(func);
              } else {
                (structure[dataType] = structure[dataType] || []).push(func);
              }
            }
          }
        };
      }
      function inspectPrefiltersOrTransports(structure, options, originalOptions, jqXHR) {
        var inspected = {}, seekingTransport = structure === transports;
        function inspect(dataType) {
          var selected;
          inspected[dataType] = true;
          jQuery.each(structure[dataType] || [], function(_, prefilterOrFactory) {
            var dataTypeOrTransport = prefilterOrFactory(options, originalOptions, jqXHR);
            if (typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[dataTypeOrTransport]) {
              options.dataTypes.unshift(dataTypeOrTransport);
              inspect(dataTypeOrTransport);
              return false;
            } else if (seekingTransport) {
              return !(selected = dataTypeOrTransport);
            }
          });
          return selected;
        }
        return inspect(options.dataTypes[0]) || !inspected["*"] && inspect("*");
      }
      function ajaxExtend(target, src) {
        var key, deep, flatOptions = jQuery.ajaxSettings.flatOptions || {};
        for (key in src) {
          if (src[key] !== void 0) {
            (flatOptions[key] ? target : deep || (deep = {}))[key] = src[key];
          }
        }
        if (deep) {
          jQuery.extend(true, target, deep);
        }
        return target;
      }
      function ajaxHandleResponses(s, jqXHR, responses) {
        var ct, type, finalDataType, firstDataType, contents = s.contents, dataTypes = s.dataTypes;
        while (dataTypes[0] === "*") {
          dataTypes.shift();
          if (ct === void 0) {
            ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
          }
        }
        if (ct) {
          for (type in contents) {
            if (contents[type] && contents[type].test(ct)) {
              dataTypes.unshift(type);
              break;
            }
          }
        }
        if (dataTypes[0] in responses) {
          finalDataType = dataTypes[0];
        } else {
          for (type in responses) {
            if (!dataTypes[0] || s.converters[type + " " + dataTypes[0]]) {
              finalDataType = type;
              break;
            }
            if (!firstDataType) {
              firstDataType = type;
            }
          }
          finalDataType = finalDataType || firstDataType;
        }
        if (finalDataType) {
          if (finalDataType !== dataTypes[0]) {
            dataTypes.unshift(finalDataType);
          }
          return responses[finalDataType];
        }
      }
      function ajaxConvert(s, response, jqXHR, isSuccess) {
        var conv2, current, conv, tmp, prev, converters = {}, dataTypes = s.dataTypes.slice();
        if (dataTypes[1]) {
          for (conv in s.converters) {
            converters[conv.toLowerCase()] = s.converters[conv];
          }
        }
        current = dataTypes.shift();
        while (current) {
          if (s.responseFields[current]) {
            jqXHR[s.responseFields[current]] = response;
          }
          if (!prev && isSuccess && s.dataFilter) {
            response = s.dataFilter(response, s.dataType);
          }
          prev = current;
          current = dataTypes.shift();
          if (current) {
            if (current === "*") {
              current = prev;
            } else if (prev !== "*" && prev !== current) {
              conv = converters[prev + " " + current] || converters["* " + current];
              if (!conv) {
                for (conv2 in converters) {
                  tmp = conv2.split(" ");
                  if (tmp[1] === current) {
                    conv = converters[prev + " " + tmp[0]] || converters["* " + tmp[0]];
                    if (conv) {
                      if (conv === true) {
                        conv = converters[conv2];
                      } else if (converters[conv2] !== true) {
                        current = tmp[0];
                        dataTypes.unshift(tmp[1]);
                      }
                      break;
                    }
                  }
                }
              }
              if (conv !== true) {
                if (conv && s.throws) {
                  response = conv(response);
                } else {
                  try {
                    response = conv(response);
                  } catch (e) {
                    return {
                      state: "parsererror",
                      error: conv ? e : "No conversion from " + prev + " to " + current
                    };
                  }
                }
              }
            }
          }
        }
        return { state: "success", data: response };
      }
      jQuery.extend({
        // Counter for holding the number of active queries
        active: 0,
        // Last-Modified header cache for next request
        lastModified: {},
        etag: {},
        ajaxSettings: {
          url: location2.href,
          type: "GET",
          isLocal: rlocalProtocol.test(location2.protocol),
          global: true,
          processData: true,
          async: true,
          contentType: "application/x-www-form-urlencoded; charset=UTF-8",
          /*
          timeout: 0,
          data: null,
          dataType: null,
          username: null,
          password: null,
          cache: null,
          throws: false,
          traditional: false,
          headers: {},
          */
          accepts: {
            "*": allTypes,
            text: "text/plain",
            html: "text/html",
            xml: "application/xml, text/xml",
            json: "application/json, text/javascript"
          },
          contents: {
            xml: /\bxml\b/,
            html: /\bhtml/,
            json: /\bjson\b/
          },
          responseFields: {
            xml: "responseXML",
            text: "responseText",
            json: "responseJSON"
          },
          // Data converters
          // Keys separate source (or catchall "*") and destination types with a single space
          converters: {
            // Convert anything to text
            "* text": String,
            // Text to html (true = no transformation)
            "text html": true,
            // Evaluate text as a json expression
            "text json": JSON.parse,
            // Parse text as xml
            "text xml": jQuery.parseXML
          },
          // For options that shouldn't be deep extended:
          // you can add your own custom options here if
          // and when you create one that shouldn't be
          // deep extended (see ajaxExtend)
          flatOptions: {
            url: true,
            context: true
          }
        },
        // Creates a full fledged settings object into target
        // with both ajaxSettings and settings fields.
        // If target is omitted, writes into ajaxSettings.
        ajaxSetup: function(target, settings) {
          return settings ? (
            // Building a settings object
            ajaxExtend(ajaxExtend(target, jQuery.ajaxSettings), settings)
          ) : (
            // Extending ajaxSettings
            ajaxExtend(jQuery.ajaxSettings, target)
          );
        },
        ajaxPrefilter: addToPrefiltersOrTransports(prefilters),
        ajaxTransport: addToPrefiltersOrTransports(transports),
        // Main method
        ajax: function(url, options) {
          if (typeof url === "object") {
            options = url;
            url = void 0;
          }
          options = options || {};
          var transport, cacheURL, responseHeadersString, responseHeaders, timeoutTimer, urlAnchor, completed2, fireGlobals, i, uncached, s = jQuery.ajaxSetup({}, options), callbackContext = s.context || s, globalEventContext = s.context && (callbackContext.nodeType || callbackContext.jquery) ? jQuery(callbackContext) : jQuery.event, deferred = jQuery.Deferred(), completeDeferred = jQuery.Callbacks("once memory"), statusCode = s.statusCode || {}, requestHeaders = {}, requestHeadersNames = {}, strAbort = "canceled", jqXHR = {
            readyState: 0,
            // Builds headers hashtable if needed
            getResponseHeader: function(key) {
              var match;
              if (completed2) {
                if (!responseHeaders) {
                  responseHeaders = {};
                  while (match = rheaders.exec(responseHeadersString)) {
                    responseHeaders[match[1].toLowerCase() + " "] = (responseHeaders[match[1].toLowerCase() + " "] || []).concat(match[2]);
                  }
                }
                match = responseHeaders[key.toLowerCase() + " "];
              }
              return match == null ? null : match.join(", ");
            },
            // Raw string
            getAllResponseHeaders: function() {
              return completed2 ? responseHeadersString : null;
            },
            // Caches the header
            setRequestHeader: function(name, value) {
              if (completed2 == null) {
                name = requestHeadersNames[name.toLowerCase()] = requestHeadersNames[name.toLowerCase()] || name;
                requestHeaders[name] = value;
              }
              return this;
            },
            // Overrides response content-type header
            overrideMimeType: function(type) {
              if (completed2 == null) {
                s.mimeType = type;
              }
              return this;
            },
            // Status-dependent callbacks
            statusCode: function(map) {
              var code;
              if (map) {
                if (completed2) {
                  jqXHR.always(map[jqXHR.status]);
                } else {
                  for (code in map) {
                    statusCode[code] = [statusCode[code], map[code]];
                  }
                }
              }
              return this;
            },
            // Cancel the request
            abort: function(statusText) {
              var finalText = statusText || strAbort;
              if (transport) {
                transport.abort(finalText);
              }
              done(0, finalText);
              return this;
            }
          };
          deferred.promise(jqXHR);
          s.url = ((url || s.url || location2.href) + "").replace(rprotocol, location2.protocol + "//");
          s.type = options.method || options.type || s.method || s.type;
          s.dataTypes = (s.dataType || "*").toLowerCase().match(rnothtmlwhite) || [""];
          if (s.crossDomain == null) {
            urlAnchor = document2.createElement("a");
            try {
              urlAnchor.href = s.url;
              urlAnchor.href = urlAnchor.href;
              s.crossDomain = originAnchor.protocol + "//" + originAnchor.host !== urlAnchor.protocol + "//" + urlAnchor.host;
            } catch (e) {
              s.crossDomain = true;
            }
          }
          if (s.data && s.processData && typeof s.data !== "string") {
            s.data = jQuery.param(s.data, s.traditional);
          }
          inspectPrefiltersOrTransports(prefilters, s, options, jqXHR);
          if (completed2) {
            return jqXHR;
          }
          fireGlobals = jQuery.event && s.global;
          if (fireGlobals && jQuery.active++ === 0) {
            jQuery.event.trigger("ajaxStart");
          }
          s.type = s.type.toUpperCase();
          s.hasContent = !rnoContent.test(s.type);
          cacheURL = s.url.replace(rhash, "");
          if (!s.hasContent) {
            uncached = s.url.slice(cacheURL.length);
            if (s.data && (s.processData || typeof s.data === "string")) {
              cacheURL += (rquery.test(cacheURL) ? "&" : "?") + s.data;
              delete s.data;
            }
            if (s.cache === false) {
              cacheURL = cacheURL.replace(rantiCache, "$1");
              uncached = (rquery.test(cacheURL) ? "&" : "?") + "_=" + nonce.guid++ + uncached;
            }
            s.url = cacheURL + uncached;
          } else if (s.data && s.processData && (s.contentType || "").indexOf("application/x-www-form-urlencoded") === 0) {
            s.data = s.data.replace(r20, "+");
          }
          if (s.ifModified) {
            if (jQuery.lastModified[cacheURL]) {
              jqXHR.setRequestHeader("If-Modified-Since", jQuery.lastModified[cacheURL]);
            }
            if (jQuery.etag[cacheURL]) {
              jqXHR.setRequestHeader("If-None-Match", jQuery.etag[cacheURL]);
            }
          }
          if (s.data && s.hasContent && s.contentType !== false || options.contentType) {
            jqXHR.setRequestHeader("Content-Type", s.contentType);
          }
          jqXHR.setRequestHeader(
            "Accept",
            s.dataTypes[0] && s.accepts[s.dataTypes[0]] ? s.accepts[s.dataTypes[0]] + (s.dataTypes[0] !== "*" ? ", " + allTypes + "; q=0.01" : "") : s.accepts["*"]
          );
          for (i in s.headers) {
            jqXHR.setRequestHeader(i, s.headers[i]);
          }
          if (s.beforeSend && (s.beforeSend.call(callbackContext, jqXHR, s) === false || completed2)) {
            return jqXHR.abort();
          }
          strAbort = "abort";
          completeDeferred.add(s.complete);
          jqXHR.done(s.success);
          jqXHR.fail(s.error);
          transport = inspectPrefiltersOrTransports(transports, s, options, jqXHR);
          if (!transport) {
            done(-1, "No Transport");
          } else {
            jqXHR.readyState = 1;
            if (fireGlobals) {
              globalEventContext.trigger("ajaxSend", [jqXHR, s]);
            }
            if (completed2) {
              return jqXHR;
            }
            if (s.async && s.timeout > 0) {
              timeoutTimer = window2.setTimeout(function() {
                jqXHR.abort("timeout");
              }, s.timeout);
            }
            try {
              completed2 = false;
              transport.send(requestHeaders, done);
            } catch (e) {
              if (completed2) {
                throw e;
              }
              done(-1, e);
            }
          }
          function done(status, nativeStatusText, responses, headers) {
            var isSuccess, success, error, response, modified, statusText = nativeStatusText;
            if (completed2) {
              return;
            }
            completed2 = true;
            if (timeoutTimer) {
              window2.clearTimeout(timeoutTimer);
            }
            transport = void 0;
            responseHeadersString = headers || "";
            jqXHR.readyState = status > 0 ? 4 : 0;
            isSuccess = status >= 200 && status < 300 || status === 304;
            if (responses) {
              response = ajaxHandleResponses(s, jqXHR, responses);
            }
            if (!isSuccess && jQuery.inArray("script", s.dataTypes) > -1 && jQuery.inArray("json", s.dataTypes) < 0) {
              s.converters["text script"] = function() {
              };
            }
            response = ajaxConvert(s, response, jqXHR, isSuccess);
            if (isSuccess) {
              if (s.ifModified) {
                modified = jqXHR.getResponseHeader("Last-Modified");
                if (modified) {
                  jQuery.lastModified[cacheURL] = modified;
                }
                modified = jqXHR.getResponseHeader("etag");
                if (modified) {
                  jQuery.etag[cacheURL] = modified;
                }
              }
              if (status === 204 || s.type === "HEAD") {
                statusText = "nocontent";
              } else if (status === 304) {
                statusText = "notmodified";
              } else {
                statusText = response.state;
                success = response.data;
                error = response.error;
                isSuccess = !error;
              }
            } else {
              error = statusText;
              if (status || !statusText) {
                statusText = "error";
                if (status < 0) {
                  status = 0;
                }
              }
            }
            jqXHR.status = status;
            jqXHR.statusText = (nativeStatusText || statusText) + "";
            if (isSuccess) {
              deferred.resolveWith(callbackContext, [success, statusText, jqXHR]);
            } else {
              deferred.rejectWith(callbackContext, [jqXHR, statusText, error]);
            }
            jqXHR.statusCode(statusCode);
            statusCode = void 0;
            if (fireGlobals) {
              globalEventContext.trigger(
                isSuccess ? "ajaxSuccess" : "ajaxError",
                [jqXHR, s, isSuccess ? success : error]
              );
            }
            completeDeferred.fireWith(callbackContext, [jqXHR, statusText]);
            if (fireGlobals) {
              globalEventContext.trigger("ajaxComplete", [jqXHR, s]);
              if (!--jQuery.active) {
                jQuery.event.trigger("ajaxStop");
              }
            }
          }
          return jqXHR;
        },
        getJSON: function(url, data2, callback) {
          return jQuery.get(url, data2, callback, "json");
        },
        getScript: function(url, callback) {
          return jQuery.get(url, void 0, callback, "script");
        }
      });
      jQuery.each(["get", "post"], function(_i, method) {
        jQuery[method] = function(url, data2, callback, type) {
          if (isFunction(data2)) {
            type = type || callback;
            callback = data2;
            data2 = void 0;
          }
          return jQuery.ajax(jQuery.extend({
            url,
            type: method,
            dataType: type,
            data: data2,
            success: callback
          }, jQuery.isPlainObject(url) && url));
        };
      });
      jQuery.ajaxPrefilter(function(s) {
        var i;
        for (i in s.headers) {
          if (i.toLowerCase() === "content-type") {
            s.contentType = s.headers[i] || "";
          }
        }
      });
      jQuery._evalUrl = function(url, options, doc) {
        return jQuery.ajax({
          url,
          // Make this explicit, since user can override this through ajaxSetup (trac-11264)
          type: "GET",
          dataType: "script",
          cache: true,
          async: false,
          global: false,
          // Only evaluate the response if it is successful (gh-4126)
          // dataFilter is not invoked for failure responses, so using it instead
          // of the default converter is kludgy but it works.
          converters: {
            "text script": function() {
            }
          },
          dataFilter: function(response) {
            jQuery.globalEval(response, options, doc);
          }
        });
      };
      jQuery.fn.extend({
        wrapAll: function(html) {
          var wrap;
          if (this[0]) {
            if (isFunction(html)) {
              html = html.call(this[0]);
            }
            wrap = jQuery(html, this[0].ownerDocument).eq(0).clone(true);
            if (this[0].parentNode) {
              wrap.insertBefore(this[0]);
            }
            wrap.map(function() {
              var elem = this;
              while (elem.firstElementChild) {
                elem = elem.firstElementChild;
              }
              return elem;
            }).append(this);
          }
          return this;
        },
        wrapInner: function(html) {
          if (isFunction(html)) {
            return this.each(function(i) {
              jQuery(this).wrapInner(html.call(this, i));
            });
          }
          return this.each(function() {
            var self = jQuery(this), contents = self.contents();
            if (contents.length) {
              contents.wrapAll(html);
            } else {
              self.append(html);
            }
          });
        },
        wrap: function(html) {
          var htmlIsFunction = isFunction(html);
          return this.each(function(i) {
            jQuery(this).wrapAll(htmlIsFunction ? html.call(this, i) : html);
          });
        },
        unwrap: function(selector) {
          this.parent(selector).not("body").each(function() {
            jQuery(this).replaceWith(this.childNodes);
          });
          return this;
        }
      });
      jQuery.expr.pseudos.hidden = function(elem) {
        return !jQuery.expr.pseudos.visible(elem);
      };
      jQuery.expr.pseudos.visible = function(elem) {
        return !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length);
      };
      jQuery.ajaxSettings.xhr = function() {
        try {
          return new window2.XMLHttpRequest();
        } catch (e) {
        }
      };
      var xhrSuccessStatus = {
        // File protocol always yields status code 0, assume 200
        0: 200,
        // Support: IE <=9 only
        // trac-1450: sometimes IE returns 1223 when it should be 204
        1223: 204
      }, xhrSupported = jQuery.ajaxSettings.xhr();
      support.cors = !!xhrSupported && "withCredentials" in xhrSupported;
      support.ajax = xhrSupported = !!xhrSupported;
      jQuery.ajaxTransport(function(options) {
        var callback, errorCallback;
        if (support.cors || xhrSupported && !options.crossDomain) {
          return {
            send: function(headers, complete) {
              var i, xhr = options.xhr();
              xhr.open(
                options.type,
                options.url,
                options.async,
                options.username,
                options.password
              );
              if (options.xhrFields) {
                for (i in options.xhrFields) {
                  xhr[i] = options.xhrFields[i];
                }
              }
              if (options.mimeType && xhr.overrideMimeType) {
                xhr.overrideMimeType(options.mimeType);
              }
              if (!options.crossDomain && !headers["X-Requested-With"]) {
                headers["X-Requested-With"] = "XMLHttpRequest";
              }
              for (i in headers) {
                xhr.setRequestHeader(i, headers[i]);
              }
              callback = function(type) {
                return function() {
                  if (callback) {
                    callback = errorCallback = xhr.onload = xhr.onerror = xhr.onabort = xhr.ontimeout = xhr.onreadystatechange = null;
                    if (type === "abort") {
                      xhr.abort();
                    } else if (type === "error") {
                      if (typeof xhr.status !== "number") {
                        complete(0, "error");
                      } else {
                        complete(
                          // File: protocol always yields status 0; see trac-8605, trac-14207
                          xhr.status,
                          xhr.statusText
                        );
                      }
                    } else {
                      complete(
                        xhrSuccessStatus[xhr.status] || xhr.status,
                        xhr.statusText,
                        // Support: IE <=9 only
                        // IE9 has no XHR2 but throws on binary (trac-11426)
                        // For XHR2 non-text, let the caller handle it (gh-2498)
                        (xhr.responseType || "text") !== "text" || typeof xhr.responseText !== "string" ? { binary: xhr.response } : { text: xhr.responseText },
                        xhr.getAllResponseHeaders()
                      );
                    }
                  }
                };
              };
              xhr.onload = callback();
              errorCallback = xhr.onerror = xhr.ontimeout = callback("error");
              if (xhr.onabort !== void 0) {
                xhr.onabort = errorCallback;
              } else {
                xhr.onreadystatechange = function() {
                  if (xhr.readyState === 4) {
                    window2.setTimeout(function() {
                      if (callback) {
                        errorCallback();
                      }
                    });
                  }
                };
              }
              callback = callback("abort");
              try {
                xhr.send(options.hasContent && options.data || null);
              } catch (e) {
                if (callback) {
                  throw e;
                }
              }
            },
            abort: function() {
              if (callback) {
                callback();
              }
            }
          };
        }
      });
      jQuery.ajaxPrefilter(function(s) {
        if (s.crossDomain) {
          s.contents.script = false;
        }
      });
      jQuery.ajaxSetup({
        accepts: {
          script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
        },
        contents: {
          script: /\b(?:java|ecma)script\b/
        },
        converters: {
          "text script": function(text) {
            jQuery.globalEval(text);
            return text;
          }
        }
      });
      jQuery.ajaxPrefilter("script", function(s) {
        if (s.cache === void 0) {
          s.cache = false;
        }
        if (s.crossDomain) {
          s.type = "GET";
        }
      });
      jQuery.ajaxTransport("script", function(s) {
        if (s.crossDomain || s.scriptAttrs) {
          var script, callback;
          return {
            send: function(_, complete) {
              script = jQuery("<script>").attr(s.scriptAttrs || {}).prop({ charset: s.scriptCharset, src: s.url }).on("load error", callback = function(evt) {
                script.remove();
                callback = null;
                if (evt) {
                  complete(evt.type === "error" ? 404 : 200, evt.type);
                }
              });
              document2.head.appendChild(script[0]);
            },
            abort: function() {
              if (callback) {
                callback();
              }
            }
          };
        }
      });
      var oldCallbacks = [], rjsonp = /(=)\?(?=&|$)|\?\?/;
      jQuery.ajaxSetup({
        jsonp: "callback",
        jsonpCallback: function() {
          var callback = oldCallbacks.pop() || jQuery.expando + "_" + nonce.guid++;
          this[callback] = true;
          return callback;
        }
      });
      jQuery.ajaxPrefilter("json jsonp", function(s, originalSettings, jqXHR) {
        var callbackName, overwritten, responseContainer, jsonProp = s.jsonp !== false && (rjsonp.test(s.url) ? "url" : typeof s.data === "string" && (s.contentType || "").indexOf("application/x-www-form-urlencoded") === 0 && rjsonp.test(s.data) && "data");
        if (jsonProp || s.dataTypes[0] === "jsonp") {
          callbackName = s.jsonpCallback = isFunction(s.jsonpCallback) ? s.jsonpCallback() : s.jsonpCallback;
          if (jsonProp) {
            s[jsonProp] = s[jsonProp].replace(rjsonp, "$1" + callbackName);
          } else if (s.jsonp !== false) {
            s.url += (rquery.test(s.url) ? "&" : "?") + s.jsonp + "=" + callbackName;
          }
          s.converters["script json"] = function() {
            if (!responseContainer) {
              jQuery.error(callbackName + " was not called");
            }
            return responseContainer[0];
          };
          s.dataTypes[0] = "json";
          overwritten = window2[callbackName];
          window2[callbackName] = function() {
            responseContainer = arguments;
          };
          jqXHR.always(function() {
            if (overwritten === void 0) {
              jQuery(window2).removeProp(callbackName);
            } else {
              window2[callbackName] = overwritten;
            }
            if (s[callbackName]) {
              s.jsonpCallback = originalSettings.jsonpCallback;
              oldCallbacks.push(callbackName);
            }
            if (responseContainer && isFunction(overwritten)) {
              overwritten(responseContainer[0]);
            }
            responseContainer = overwritten = void 0;
          });
          return "script";
        }
      });
      support.createHTMLDocument = (function() {
        var body = document2.implementation.createHTMLDocument("").body;
        body.innerHTML = "<form></form><form></form>";
        return body.childNodes.length === 2;
      })();
      jQuery.parseHTML = function(data2, context2, keepScripts) {
        if (typeof data2 !== "string") {
          return [];
        }
        if (typeof context2 === "boolean") {
          keepScripts = context2;
          context2 = false;
        }
        var base, parsed, scripts;
        if (!context2) {
          if (support.createHTMLDocument) {
            context2 = document2.implementation.createHTMLDocument("");
            base = context2.createElement("base");
            base.href = document2.location.href;
            context2.head.appendChild(base);
          } else {
            context2 = document2;
          }
        }
        parsed = rsingleTag.exec(data2);
        scripts = !keepScripts && [];
        if (parsed) {
          return [context2.createElement(parsed[1])];
        }
        parsed = buildFragment([data2], context2, scripts);
        if (scripts && scripts.length) {
          jQuery(scripts).remove();
        }
        return jQuery.merge([], parsed.childNodes);
      };
      jQuery.fn.load = function(url, params, callback) {
        var selector, type, response, self = this, off = url.indexOf(" ");
        if (off > -1) {
          selector = stripAndCollapse(url.slice(off));
          url = url.slice(0, off);
        }
        if (isFunction(params)) {
          callback = params;
          params = void 0;
        } else if (params && typeof params === "object") {
          type = "POST";
        }
        if (self.length > 0) {
          jQuery.ajax({
            url,
            // If "type" variable is undefined, then "GET" method will be used.
            // Make value of this field explicit since
            // user can override it through ajaxSetup method
            type: type || "GET",
            dataType: "html",
            data: params
          }).done(function(responseText) {
            response = arguments;
            self.html(selector ? (
              // If a selector was specified, locate the right elements in a dummy div
              // Exclude scripts to avoid IE 'Permission Denied' errors
              jQuery("<div>").append(jQuery.parseHTML(responseText)).find(selector)
            ) : (
              // Otherwise use the full result
              responseText
            ));
          }).always(callback && function(jqXHR, status) {
            self.each(function() {
              callback.apply(this, response || [jqXHR.responseText, status, jqXHR]);
            });
          });
        }
        return this;
      };
      jQuery.expr.pseudos.animated = function(elem) {
        return jQuery.grep(jQuery.timers, function(fn) {
          return elem === fn.elem;
        }).length;
      };
      jQuery.offset = {
        setOffset: function(elem, options, i) {
          var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition, position = jQuery.css(elem, "position"), curElem = jQuery(elem), props = {};
          if (position === "static") {
            elem.style.position = "relative";
          }
          curOffset = curElem.offset();
          curCSSTop = jQuery.css(elem, "top");
          curCSSLeft = jQuery.css(elem, "left");
          calculatePosition = (position === "absolute" || position === "fixed") && (curCSSTop + curCSSLeft).indexOf("auto") > -1;
          if (calculatePosition) {
            curPosition = curElem.position();
            curTop = curPosition.top;
            curLeft = curPosition.left;
          } else {
            curTop = parseFloat(curCSSTop) || 0;
            curLeft = parseFloat(curCSSLeft) || 0;
          }
          if (isFunction(options)) {
            options = options.call(elem, i, jQuery.extend({}, curOffset));
          }
          if (options.top != null) {
            props.top = options.top - curOffset.top + curTop;
          }
          if (options.left != null) {
            props.left = options.left - curOffset.left + curLeft;
          }
          if ("using" in options) {
            options.using.call(elem, props);
          } else {
            curElem.css(props);
          }
        }
      };
      jQuery.fn.extend({
        // offset() relates an element's border box to the document origin
        offset: function(options) {
          if (arguments.length) {
            return options === void 0 ? this : this.each(function(i) {
              jQuery.offset.setOffset(this, options, i);
            });
          }
          var rect, win, elem = this[0];
          if (!elem) {
            return;
          }
          if (!elem.getClientRects().length) {
            return { top: 0, left: 0 };
          }
          rect = elem.getBoundingClientRect();
          win = elem.ownerDocument.defaultView;
          return {
            top: rect.top + win.pageYOffset,
            left: rect.left + win.pageXOffset
          };
        },
        // position() relates an element's margin box to its offset parent's padding box
        // This corresponds to the behavior of CSS absolute positioning
        position: function() {
          if (!this[0]) {
            return;
          }
          var offsetParent, offset, doc, elem = this[0], parentOffset = { top: 0, left: 0 };
          if (jQuery.css(elem, "position") === "fixed") {
            offset = elem.getBoundingClientRect();
          } else {
            offset = this.offset();
            doc = elem.ownerDocument;
            offsetParent = elem.offsetParent || doc.documentElement;
            while (offsetParent && (offsetParent === doc.body || offsetParent === doc.documentElement) && jQuery.css(offsetParent, "position") === "static") {
              offsetParent = offsetParent.parentNode;
            }
            if (offsetParent && offsetParent !== elem && offsetParent.nodeType === 1) {
              parentOffset = jQuery(offsetParent).offset();
              parentOffset.top += jQuery.css(offsetParent, "borderTopWidth", true);
              parentOffset.left += jQuery.css(offsetParent, "borderLeftWidth", true);
            }
          }
          return {
            top: offset.top - parentOffset.top - jQuery.css(elem, "marginTop", true),
            left: offset.left - parentOffset.left - jQuery.css(elem, "marginLeft", true)
          };
        },
        // This method will return documentElement in the following cases:
        // 1) For the element inside the iframe without offsetParent, this method will return
        //    documentElement of the parent window
        // 2) For the hidden or detached element
        // 3) For body or html element, i.e. in case of the html node - it will return itself
        //
        // but those exceptions were never presented as a real life use-cases
        // and might be considered as more preferable results.
        //
        // This logic, however, is not guaranteed and can change at any point in the future
        offsetParent: function() {
          return this.map(function() {
            var offsetParent = this.offsetParent;
            while (offsetParent && jQuery.css(offsetParent, "position") === "static") {
              offsetParent = offsetParent.offsetParent;
            }
            return offsetParent || documentElement;
          });
        }
      });
      jQuery.each({ scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function(method, prop) {
        var top = "pageYOffset" === prop;
        jQuery.fn[method] = function(val) {
          return access(this, function(elem, method2, val2) {
            var win;
            if (isWindow(elem)) {
              win = elem;
            } else if (elem.nodeType === 9) {
              win = elem.defaultView;
            }
            if (val2 === void 0) {
              return win ? win[prop] : elem[method2];
            }
            if (win) {
              win.scrollTo(
                !top ? val2 : win.pageXOffset,
                top ? val2 : win.pageYOffset
              );
            } else {
              elem[method2] = val2;
            }
          }, method, val, arguments.length);
        };
      });
      jQuery.each(["top", "left"], function(_i, prop) {
        jQuery.cssHooks[prop] = addGetHookIf(
          support.pixelPosition,
          function(elem, computed) {
            if (computed) {
              computed = curCSS(elem, prop);
              return rnumnonpx.test(computed) ? jQuery(elem).position()[prop] + "px" : computed;
            }
          }
        );
      });
      jQuery.each({ Height: "height", Width: "width" }, function(name, type) {
        jQuery.each({
          padding: "inner" + name,
          content: type,
          "": "outer" + name
        }, function(defaultExtra, funcName) {
          jQuery.fn[funcName] = function(margin, value) {
            var chainable = arguments.length && (defaultExtra || typeof margin !== "boolean"), extra = defaultExtra || (margin === true || value === true ? "margin" : "border");
            return access(this, function(elem, type2, value2) {
              var doc;
              if (isWindow(elem)) {
                return funcName.indexOf("outer") === 0 ? elem["inner" + name] : elem.document.documentElement["client" + name];
              }
              if (elem.nodeType === 9) {
                doc = elem.documentElement;
                return Math.max(
                  elem.body["scroll" + name],
                  doc["scroll" + name],
                  elem.body["offset" + name],
                  doc["offset" + name],
                  doc["client" + name]
                );
              }
              return value2 === void 0 ? (
                // Get width or height on the element, requesting but not forcing parseFloat
                jQuery.css(elem, type2, extra)
              ) : (
                // Set width or height on the element
                jQuery.style(elem, type2, value2, extra)
              );
            }, type, chainable ? margin : void 0, chainable);
          };
        });
      });
      jQuery.each([
        "ajaxStart",
        "ajaxStop",
        "ajaxComplete",
        "ajaxError",
        "ajaxSuccess",
        "ajaxSend"
      ], function(_i, type) {
        jQuery.fn[type] = function(fn) {
          return this.on(type, fn);
        };
      });
      jQuery.fn.extend({
        bind: function(types, data2, fn) {
          return this.on(types, null, data2, fn);
        },
        unbind: function(types, fn) {
          return this.off(types, null, fn);
        },
        delegate: function(selector, types, data2, fn) {
          return this.on(types, selector, data2, fn);
        },
        undelegate: function(selector, types, fn) {
          return arguments.length === 1 ? this.off(selector, "**") : this.off(types, selector || "**", fn);
        },
        hover: function(fnOver, fnOut) {
          return this.on("mouseenter", fnOver).on("mouseleave", fnOut || fnOver);
        }
      });
      jQuery.each(
        "blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(" "),
        function(_i, name) {
          jQuery.fn[name] = function(data2, fn) {
            return arguments.length > 0 ? this.on(name, null, data2, fn) : this.trigger(name);
          };
        }
      );
      var rtrim = /^[\s\uFEFF\xA0]+|([^\s\uFEFF\xA0])[\s\uFEFF\xA0]+$/g;
      jQuery.proxy = function(fn, context2) {
        var tmp, args, proxy;
        if (typeof context2 === "string") {
          tmp = fn[context2];
          context2 = fn;
          fn = tmp;
        }
        if (!isFunction(fn)) {
          return void 0;
        }
        args = slice.call(arguments, 2);
        proxy = function() {
          return fn.apply(context2 || this, args.concat(slice.call(arguments)));
        };
        proxy.guid = fn.guid = fn.guid || jQuery.guid++;
        return proxy;
      };
      jQuery.holdReady = function(hold) {
        if (hold) {
          jQuery.readyWait++;
        } else {
          jQuery.ready(true);
        }
      };
      jQuery.isArray = Array.isArray;
      jQuery.parseJSON = JSON.parse;
      jQuery.nodeName = nodeName;
      jQuery.isFunction = isFunction;
      jQuery.isWindow = isWindow;
      jQuery.camelCase = camelCase;
      jQuery.type = toType;
      jQuery.now = Date.now;
      jQuery.isNumeric = function(obj) {
        var type = jQuery.type(obj);
        return (type === "number" || type === "string") && // parseFloat NaNs numeric-cast false positives ("")
        // ...but misinterprets leading-number strings, particularly hex literals ("0x...")
        // subtraction forces infinities to NaN
        !isNaN(obj - parseFloat(obj));
      };
      jQuery.trim = function(text) {
        return text == null ? "" : (text + "").replace(rtrim, "$1");
      };
      if (typeof define === "function" && define.amd) {
        define("jquery", [], function() {
          return jQuery;
        });
      }
      var _jQuery = window2.jQuery, _$ = window2.$;
      jQuery.noConflict = function(deep) {
        if (window2.$ === jQuery) {
          window2.$ = _$;
        }
        if (deep && window2.jQuery === jQuery) {
          window2.jQuery = _jQuery;
        }
        return jQuery;
      };
      if (typeof noGlobal === "undefined") {
        window2.jQuery = window2.$ = jQuery;
      }
      return jQuery;
    });
  }
});

// <stdin>
var import_jquery15 = __toESM(require_jquery());

// ns-hugo-imp:/home/runner/work/docs-v2/docs-v2/assets/js/tabbed-content.js
var import_jquery2 = __toESM(require_jquery());

// ns-hugo-imp:/home/runner/work/docs-v2/docs-v2/assets/js/content-interactions.js
var import_jquery = __toESM(require_jquery());
function makeHeadersLinkable() {
  var headingWhiteList = (0, import_jquery.default)(
    "  .article--content h2,   .article--content h3,   .article--content h4,   .article--content h5,   .article--content h6 "
  );
  var headingBlackList = "  .influxdbu-banner h4 ";
  const headingElements = headingWhiteList.not(headingBlackList);
  headingElements.each(function() {
    var $heading = (0, import_jquery.default)(this);
    var id = $heading.attr("id");
    if (!id) return;
    $heading.wrapInner('<a href="#' + id + '"></a>');
  });
}
function smoothScroll() {
  var elementWhiteList = [
    ".tabs p a",
    ".code-tabs p a",
    ".children-links a",
    ".list-links a",
    "a.url-trigger",
    "a.fullscreen-close"
  ];
  (0, import_jquery.default)('.article a[href^="#"]:not(' + elementWhiteList + ")").click(function(e) {
    e.preventDefault();
    scrollToAnchor(this.hash);
  });
}
function scrollToAnchor(target) {
  var id = typeof target === "string" && target.charAt(0) === "#" ? target.slice(1) : target;
  var el = id ? document.getElementById(id) : null;
  var $target = el ? (0, import_jquery.default)(el) : (0, import_jquery.default)();
  if ($target && $target.length > 0) {
    (0, import_jquery.default)("html, body").stop().animate(
      {
        scrollTop: $target.offset().top
      },
      400,
      "swing",
      function() {
        window.location.hash = target;
      }
    );
    if ($target.hasClass("expand")) {
      if ((0, import_jquery.default)(target + " .expand-label .expand-toggle").hasClass("open")) {
      } else {
        (0, import_jquery.default)(target + "> .expand-label").trigger("click");
      }
    }
  }
}
function leftNavInteractions() {
  (0, import_jquery.default)(".children-toggle").click(function(e) {
    e.preventDefault();
    (0, import_jquery.default)(this).toggleClass("open");
    (0, import_jquery.default)(this).siblings(".children").toggleClass("open");
  });
}
function mobileContentsToggle() {
  (0, import_jquery.default)("#contents-toggle-btn").click(function(e) {
    e.preventDefault();
    (0, import_jquery.default)(this).toggleClass("open");
    (0, import_jquery.default)("#nav-tree").toggleClass("open");
  });
}
function truncateContent() {
  (0, import_jquery.default)(".truncate-toggle").click(function(e) {
    e.preventDefault();
    var truncateParent = (0, import_jquery.default)(this).closest(".truncate");
    var truncateParentID = (0, import_jquery.default)(this).closest(".truncate")[0].id;
    if (truncateParent.hasClass("closed")) {
      (0, import_jquery.default)(this)[0].href = `#${truncateParentID}`;
    } else {
      (0, import_jquery.default)(this)[0].href = "#";
    }
    truncateParent.toggleClass("closed");
    truncateParent.find(".truncate-content").toggleClass("closed");
  });
}
function expandAccordions() {
  (0, import_jquery.default)(".expand-label").click(function() {
    (0, import_jquery.default)(this).children(".expand-toggle").toggleClass("open");
    (0, import_jquery.default)(this).next(".expand-content").slideToggle(200);
  });
  function openAccordionByHash() {
    var hash = window.location.hash.split("?")[0];
    if (!hash || hash === "#") return;
    var id = hash.slice(1);
    var el = document.getElementById(id);
    if (!el) return;
    var $anchor = (0, import_jquery.default)(el);
    function expandElement() {
      if ($anchor.parents(".expand").length > 0) {
        return $anchor.closest(".expand").children(".expand-label");
      } else if ($anchor.hasClass("expand")) {
        return $anchor.children(".expand-label");
      }
    }
    var $expand = expandElement();
    if ($expand != null) {
      if ($expand.children(".expand-toggle").hasClass("open")) {
      } else {
        $expand.children(".expand-toggle").trigger("click");
      }
    }
  }
  openAccordionByHash();
}
function injectTooltips() {
  (0, import_jquery.default)(".tooltip").each(function() {
    const $toolTipText = (0, import_jquery.default)("<div/>").addClass("tooltip-text").text((0, import_jquery.default)(this).attr("data-tooltip-text"));
    const $toolTipElement = (0, import_jquery.default)("<div/>").addClass("tooltip-container").append($toolTipText);
    (0, import_jquery.default)(this).prepend($toolTipElement);
  });
}
function styleTimeCells() {
  (0, import_jquery.default)(".article--content table").each(function() {
    var table = (0, import_jquery.default)(this);
    table.find("td").each(function() {
      let cellContent = (0, import_jquery.default)(this)[0].innerText;
      if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.*Z/.test(cellContent)) {
        (0, import_jquery.default)(this).addClass("nowrap");
      }
    });
  });
}
function openExternalLinks() {
  (0, import_jquery.default)(".article--content a").each(function() {
    var currentHost = location.host;
    if (!(0, import_jquery.default)(this)[0].href.includes(currentHost)) {
      (0, import_jquery.default)(this).attr("target", "_blank");
    }
  });
}
function initialize() {
  makeHeadersLinkable();
  smoothScroll();
  leftNavInteractions();
  mobileContentsToggle();
  truncateContent();
  expandAccordions();
  injectTooltips();
  styleTimeCells();
  openExternalLinks();
}

// ns-hugo-imp:/home/runner/work/docs-v2/docs-v2/assets/js/tabbed-content.js
function tabbedContent(container, tab, content) {
  (0, import_jquery2.default)(container).each(function() {
    (0, import_jquery2.default)(tab, this).removeClass("is-active");
    (0, import_jquery2.default)(tab + ":first", this).addClass("is-active");
  });
  (0, import_jquery2.default)(tab).on("click", function(e) {
    e.preventDefault();
    (0, import_jquery2.default)(this).addClass("is-active").siblings().removeClass("is-active");
    const activeIndex = (0, import_jquery2.default)(tab).index(this);
    (0, import_jquery2.default)(content).each(function(i) {
      if (i === activeIndex) {
        (0, import_jquery2.default)(this).show();
        (0, import_jquery2.default)(this).siblings(content).hide();
      }
    });
  });
}
function getTabQueryParam() {
  const queryParams = new URLSearchParams(window.location.search);
  return (0, import_jquery2.default)("<textarea />").html(queryParams.get("t")).text();
}
function updateBtnURLs(tabId, op = "update") {
  (0, import_jquery2.default)("a.keep-tab").each(function() {
    var link = (0, import_jquery2.default)(this)[0].href;
    var tabStr = tabId.replace(/ /, "+");
    if (op === "delete") {
      (0, import_jquery2.default)(this)[0].href = link.replace(/\?t.*$/, "");
    } else {
      (0, import_jquery2.default)(this)[0].href = link.replace(/($)|(\?t=.*$)/, `?t=${tabStr}`);
    }
  });
}
function activateTabs(selector, tab) {
  var anchor = window.location.hash;
  if (tab !== "") {
    let targetTab = (0, import_jquery2.default)(`${selector} a:contains("${tab}")`);
    if (!targetTab.length) {
      targetTab = Array.from(document.querySelectorAll(`${selector} a`)).find(
        function(el) {
          let targetText = el.text && el.text.toLowerCase().replace(/[^a-z0-9]/, "");
          return targetText && tab.includes(targetText);
        }
      );
    }
    if (targetTab) {
      (0, import_jquery2.default)(targetTab).click();
      scrollToAnchor(anchor);
    }
  }
}
function initialize2() {
  tabbedContent(".code-tabs-wrapper", ".code-tabs p a", ".code-tab-content");
  tabbedContent(".tabs-wrapper", ".tabs p a", ".tab-content");
  (0, import_jquery2.default)(`.tabs p a, .code-tabs p a`).click(function() {
    var queryParams = new URLSearchParams(window.location.search);
    var anchor = window.location.hash;
    if ((0, import_jquery2.default)(this).is(':not(":first-child")')) {
      queryParams.set("t", (0, import_jquery2.default)(this).html());
      window.history.replaceState(
        {},
        "",
        `${location.pathname}?${queryParams}${anchor}`
      );
      updateBtnURLs((0, import_jquery2.default)(this).html());
    } else {
      queryParams.delete("t");
      window.history.replaceState({}, "", `${location.pathname}${anchor}`);
      updateBtnURLs((0, import_jquery2.default)(this).html(), "delete");
    }
  });
  const tab = getTabQueryParam();
  [".tabs", ".code-tabs"].forEach(
    (selector) => activateTabs(selector, tab),
    updateBtnURLs(tab)
  );
}

// ns-hugo-imp:/home/runner/work/docs-v2/docs-v2/assets/js/services/local-storage.js
var local_storage_exports = {};
__export(local_storage_exports, {
  DEFAULT_STORAGE_URLS: () => DEFAULT_STORAGE_URLS,
  defaultUrls: () => defaultUrls,
  getInfluxDBUrl: () => getInfluxDBUrl,
  getInfluxDBUrls: () => getInfluxDBUrls,
  getNotifications: () => getNotifications,
  getPreference: () => getPreference,
  getPreferences: () => getPreferences,
  initializeStorageItem: () => initializeStorageItem,
  notificationIsRead: () => notificationIsRead,
  removeInfluxDBUrl: () => removeInfluxDBUrl,
  setInfluxDBUrls: () => setInfluxDBUrls,
  setNotificationAsRead: () => setNotificationAsRead,
  setPreference: () => setPreference
});

// ns-hugo-params:/home/runner/work/docs-v2/docs-v2/assets/js/services/influxdb-urls.js
var influxdb_urls = { cloud: { product: "InfluxDB Cloud", providers: [{ iox: true, name: "Amazon Web Services", regions: [{ clusters: [{ name: "us-west-2-1", url: "https://us-west-2-1.aws.cloud2.influxdata.com" }, { name: "us-west-2-2", url: "https://us-west-2-2.aws.cloud2.influxdata.com" }], location: "Oregon, USA", name: "US West (Oregon)", url: "https://us-west-2-1.aws.cloud2.influxdata.com" }, { iox: true, location: "Virginia, USA", name: "US East (Virginia)", url: "https://us-east-1-1.aws.cloud2.influxdata.com" }, { iox: true, location: "Frankfurt, Germany", name: "EU Frankfurt", url: "https://eu-central-1-1.aws.cloud2.influxdata.com" }], short_name: "AWS" }, { name: "Google Cloud Platform", regions: [{ location: "Iowa, USA", name: "US Central (Iowa)", url: "https://us-central1-1.gcp.cloud2.influxdata.com" }], short_name: "GCP" }, { name: "Microsoft Azure", regions: [{ location: "Amsterdam, Netherlands", name: "West Europe (Amsterdam)", url: "https://westeurope-1.azure.cloud2.influxdata.com" }, { location: "Virginia, USA", name: "East US (Virginia)", url: "https://eastus-1.azure.cloud2.influxdata.com" }], short_name: "Azure" }] }, cloud_dedicated: { product: "InfluxDB Cloud Dedicated", providers: [{ name: "Default", regions: [{ name: "cluster-id.a.influxdb.io", url: "https://cluster-id.a.influxdb.io" }] }, { name: "Custom", url: "http://example.com:8080" }] }, clustered: { providers: [{ name: "Default", regions: [{ name: "cluster-host.com", url: "https://cluster-host.com" }] }, { name: "Custom", url: "http://example.com:8080" }] }, core: { product: "InfluxDB 3 Core", providers: [{ name: "Default", regions: [{ name: "localhost:8181", url: "http://localhost:8181" }] }, { name: "Custom", url: "http://example.com:8080" }] }, enterprise: { product: "InfluxDB 3 Enterprise", providers: [{ name: "Default", regions: [{ name: "localhost:8181", url: "http://localhost:8181" }] }, { name: "Custom", url: "http://example.com:8080" }] }, oss: { product: "InfluxDB OSS", providers: [{ name: "Default", regions: [{ name: "localhost:8086", url: "http://localhost:8086" }] }, { name: "Custom", url: "http://example.com:8080" }] }, serverless: { product: "InfluxDB Cloud", providers: [{ iox: true, name: "Amazon Web Services", regions: [{ iox: true, location: "Virginia, USA", name: "US East (Virginia)", url: "https://us-east-1-1.aws.cloud2.influxdata.com" }, { iox: true, location: "Frankfurt, Germany", name: "EU Frankfurt", url: "https://eu-central-1-1.aws.cloud2.influxdata.com" }], short_name: "AWS" }] } };

// ns-hugo-imp:/home/runner/work/docs-v2/docs-v2/assets/js/services/influxdb-urls.js
var influxdbUrls = influxdb_urls || {};

// ns-hugo-imp:/home/runner/work/docs-v2/docs-v2/assets/js/services/local-storage.js
var storagePrefix = "influxdata_docs_";
function initializeStorageItem(storageKey, defaultValue) {
  const fullStorageKey = storagePrefix + storageKey;
  if (localStorage.getItem(fullStorageKey) === null) {
    localStorage.setItem(fullStorageKey, defaultValue);
  }
}
var prefStorageKey = storagePrefix + "preferences";
var defaultPrefObj = {
  api_lib: null,
  influxdb_url: "cloud",
  sidebar_state: "open",
  theme: "light",
  sample_get_started_date: null,
  v3_wayfinding_show: true
};
function getPreference(prefName) {
  if (localStorage.getItem(prefStorageKey) === null) {
    initializeStorageItem("preferences", JSON.stringify(defaultPrefObj));
  }
  const prefString = localStorage.getItem(prefStorageKey);
  const prefObj = JSON.parse(prefString);
  return prefObj[prefName];
}
function setPreference(prefID2, prefValue) {
  const prefString = localStorage.getItem(prefStorageKey);
  const prefObj = JSON.parse(prefString);
  prefObj[prefID2] = prefValue;
  localStorage.setItem(prefStorageKey, JSON.stringify(prefObj));
}
function getPreferences() {
  return JSON.parse(localStorage.getItem(prefStorageKey));
}
var defaultUrls = {};
Object.entries(influxdbUrls).forEach(([product2, { providers }]) => {
  defaultUrls[product2] = providers.filter((provider) => provider.name === "Default")[0]?.regions[0]?.url || "https://cloud2.influxdata.com";
});
var DEFAULT_STORAGE_URLS = {
  oss: defaultUrls.oss,
  cloud: defaultUrls.cloud,
  serverless: defaultUrls.serverless,
  core: defaultUrls.core,
  enterprise: defaultUrls.enterprise,
  dedicated: defaultUrls.cloud_dedicated,
  clustered: defaultUrls.clustered,
  prev_oss: defaultUrls.oss,
  prev_cloud: defaultUrls.cloud,
  prev_core: defaultUrls.core,
  prev_enterprise: defaultUrls.enterprise,
  prev_serverless: defaultUrls.serverless,
  prev_dedicated: defaultUrls.cloud_dedicated,
  prev_clustered: defaultUrls.clustered,
  custom: ""
};
var urlStorageKey = storagePrefix + "urls";
function getInfluxDBUrls() {
  if (localStorage.getItem(urlStorageKey) === null) {
    initializeStorageItem("urls", JSON.stringify(DEFAULT_STORAGE_URLS));
  }
  const storedUrls = JSON.parse(localStorage.getItem(urlStorageKey));
  return { ...DEFAULT_STORAGE_URLS, ...storedUrls };
}
function getInfluxDBUrl(product2) {
  if (localStorage.getItem(urlStorageKey) === null) {
    initializeStorageItem("urls", JSON.stringify(DEFAULT_STORAGE_URLS));
  }
  const urlsString = localStorage.getItem(urlStorageKey);
  const urlsObj = JSON.parse(urlsString);
  return urlsObj[product2] ?? DEFAULT_STORAGE_URLS[product2];
}
function setInfluxDBUrls(updatedUrlsObj) {
  const urlsString = localStorage.getItem(urlStorageKey);
  const urlsObj = JSON.parse(urlsString);
  const newUrlsObj = { ...urlsObj, ...updatedUrlsObj };
  localStorage.setItem(urlStorageKey, JSON.stringify(newUrlsObj));
}
function removeInfluxDBUrl(product2) {
  const urlsString = localStorage.getItem(urlStorageKey);
  const urlsObj = JSON.parse(urlsString);
  urlsObj[product2] = "";
  localStorage.setItem(urlStorageKey, JSON.stringify(urlsObj));
}
var notificationStorageKey = storagePrefix + "notifications";
var defaultNotificationsObj = {
  messages: [],
  callouts: []
};
function getNotifications() {
  if (localStorage.getItem(notificationStorageKey) === null) {
    initializeStorageItem(
      "notifications",
      JSON.stringify(defaultNotificationsObj)
    );
  }
  const notificationString = localStorage.getItem(notificationStorageKey);
  const notificationObj = JSON.parse(notificationString);
  return notificationObj;
}
function notificationIsRead(notificationID2, notificationType) {
  const notificationsObj = getNotifications();
  const readNotifications = notificationsObj[`${notificationType}s`];
  return readNotifications.includes(notificationID2);
}
function setNotificationAsRead(notificationID2, notificationType) {
  const notificationsObj = getNotifications();
  const readNotifications = notificationsObj[`${notificationType}s`];
  readNotifications.push(notificationID2);
  notificationsObj[notificationType + "s"] = readNotifications;
  localStorage.setItem(
    notificationStorageKey,
    JSON.stringify(notificationsObj)
  );
}

// ns-hugo-imp:/home/runner/work/docs-v2/docs-v2/assets/js/api-libs.js
function getVisitedApiLib() {
  const path2 = window.location.pathname.match(
    /client-libraries\/((?:v[0-9]|flight)\/)?([a-zA-Z0-9]*)/
  );
  return path2 && path2.length && path2[2];
}
function isApiLib() {
  return /\/client-libraries\//.test(window.location.pathname);
}
function getApiLibPreference() {
  return getPreference("api_lib") || "";
}
function initialize3() {
  if (isApiLib()) {
    var selectedApiLib = getVisitedApiLib();
    setPreference("api_lib", selectedApiLib);
  }
  const tab = getApiLibPreference();
  [".tabs, .code-tabs"].forEach(
    (selector) => activateTabs(selector, tab),
    updateBtnURLs(tab)
  );
}

// ns-hugo-imp:/home/runner/work/docs-v2/docs-v2/assets/js/code-controls.js
var import_jquery3 = __toESM(require_jquery());

// ns-hugo-imp:/home/runner/work/docs-v2/docs-v2/assets/js/page-context.ts
var page_context_exports = {};
__export(page_context_exports, {
  context: () => context,
  host: () => host,
  hostname: () => hostname,
  path: () => path,
  product: () => product,
  productData: () => productData,
  protocol: () => protocol,
  referrer: () => referrer,
  referrerHost: () => referrerHost,
  version: () => version
});

// ns-hugo-params:/home/runner/work/docs-v2/docs-v2/assets/js/services/influxdata-products.js
var products = { chronograf: { ai_input_placeholder: "Ask questions about Chronograf and InfluxDB", ai_sample_questions: ["How do I configure Chronograf for InfluxDB v1?", "How do I create a dashboard in Chronograf?", "How do I use Grafana to visualize data stored in InfluxDB 3?"], content_path: "chronograf", label_group: "chronograf", latest: "v1.11", latest_patches: { v1: "1.11.4" }, list_order: 7, menu_category: "other", name: "Chronograf", namespace: "chronograf", oss_repo: { branch: "master", name: "chronograf" }, product_issue_url: "https://github.com/influxdata/chronograf/issues/new/choose/", schema: { application_category: "BusinessApplication", offers: { price: "0", price_currency: "USD" }, operating_system: "Linux, macOS, Windows, Docker" }, versions: ["v1"] }, enterprise_influxdb: { ai_input_placeholder: 'Specify your version and product ("Enterprise v1", "InfluxDB 3 Enterprise", "Core") for better results', ai_sample_questions: ["What's my InfluxDB version?", "How can I configure InfluxDB Enterprise v1?", "How do I replicate data from OSS to InfluxDB Enterprise v1?"], ai_source_group_ids: "d809f67b-867d-4f17-95f0-c33dbadbf15f", content_path: "enterprise_influxdb", detector_config: { characteristics: ["Paid", "Self-hosted", "InfluxQL/Flux", "Username/Password", "Databases"], detection: { ping_headers: { "x-influxdb-build": "Enterprise" } }, query_languages: { Flux: { optional_params: [], required_params: ["URL", "User", "Password", "Default database"] }, InfluxQL: { optional_params: [], required_params: ["URL", "Database", "User", "Password"] } } }, label_group: "v1-enterprise", latest: "v1.12", latest_patches: { v1: "1.12.4" }, list_order: 5, menu_category: "self-managed", name: "InfluxDB Enterprise v1", namespace: "enterprise_influxdb", schema: { application_category: "DatabaseApplication", operating_system: "Linux, Docker" }, versions: ["v1"] }, flux: { ai_input_placeholder: "Ask questions about Flux and InfluxDB", ai_sample_questions: ["How do I query with Flux?", "How do I transform data with Flux?", "How do I join data with Flux?"], ai_source_group_ids: "d809f67b-867d-4f17-95f0-c33dbadbf15f,3e905caa-dd6f-464b-abf9-c3880e09f128", content_path: "flux", label_group: "flux", latest: "v0", list_order: 8, menu_category: "languages", name: "Flux", namespace: "flux", oss_repo: { branch: "master", name: "flux" }, product_issue_url: "https://github.com/influxdata/flux/issues/new/choose/", schema: { application_category: "DeveloperApplication", offers: { price: "0", price_currency: "USD" }, operating_system: "Linux, macOS, Windows, Docker" }, version_label: "0.x", versions: ["v0"] }, influxdb: { ai_input_placeholder: 'Specify your version and product ("InfluxDB OSS v2", "InfluxDB v1", "InfluxDB 3 Core") for better results', ai_sample_questions: ["What's my InfluxDB version?", "How do I write and query data using InfluxDB OSS v2?", "How can I migrate from InfluxDB OSS v2 to InfluxDB 3?"], ai_sample_questions__v1: ["What's my InfluxDB version?", "How do I query data with InfluxQL using InfluxDB OSS v1?", "How do I set up continuous queries in InfluxDB OSS v1?"], ai_source_group_ids: "3e905caa-dd6f-464b-abf9-c3880e09f128", ai_source_group_ids__v1: "d809f67b-867d-4f17-95f0-c33dbadbf15f", altname: "InfluxDB OSS", content_path: { v1: "influxdb/v1", v2: "influxdb/v2" }, detector_config: { characteristics: ["Free", "Self-hosted", "InfluxQL/Flux", "Token or Username/Password", "Buckets"], detection: { ping_headers: { "x-influxdb-build": "OSS", "x-influxdb-version": "^(1|2)\\." }, url_contains: ["localhost:8086"] }, query_languages: { Flux: { optional_params: [], required_params: ["URL", "Token", "Default bucket"] }, InfluxQL: { optional_params: [], required_params: ["URL", "Database", "Auth Type (Basic or Token)"] } } }, label_group: { v1: "v1", v2: "v2" }, latest: "v2.9", latest_cli: { v2: "2.8.0" }, latest_patches: { v1: "1.12.4", v2: "2.9.1" }, list_order: 1, menu_category: "self-managed", name: "InfluxDB", name__v1: "InfluxDB OSS v1", name__v2: "InfluxDB OSS v2", namespace: "influxdb", oss_repo: { branch: { v1: "master-1.x", v2: "main-2.x" }, name: "influxdb" }, placeholder_host: "localhost:8086", product_issue_url: "https://github.com/influxdata/influxdb/issues/new/choose/", schema: { application_category: "DatabaseApplication", offers: { price: "0", price_currency: "USD" }, operating_system: "Linux, macOS, Windows, Docker" }, succeeded_by: "influxdb3_core", versions: ["v2", "v1"] }, influxdb3_cloud_dedicated: { ai_input_placeholder: 'Specify your version and product ("InfluxDB Cloud Dedicated", "InfluxDB 3 Enterprise", "Core") for better results', ai_sample_questions: ["What's my InfluxDB version?", "How do I migrate from InfluxDB v1 to Cloud Dedicated?", "How do I use SQL and parameterized queries with InfluxDB Cloud Dedicated?"], ai_source_group_ids: "b650cf0b-4b52-42e8-bde7-a02738f27262", altname: "InfluxDB Cloud", content_path: "influxdb3/cloud-dedicated", detector_config: { characteristics: ["Paid", "Cloud", "SQL/InfluxQL", "Token", "Databases"], detection: { url_contains: ["influxdb.io"] }, query_languages: { InfluxQL: { optional_params: [], required_params: ["Host", "Database", "Token"] }, SQL: { optional_params: [], required_params: ["Host", "Database", "Token"] } } }, distributed_architecture: true, label_group: "v3-distributed", latest: "cloud-dedicated", latest_cli: "2.12.1", link: "https://www.influxdata.com/contact-sales-cloud-dedicated/", list_order: 3, menu_category: "managed", name: "InfluxDB Cloud Dedicated", namespace: "influxdb", placeholder_host: "cluster-id.a.influxdb.io", schema: { application_category: "DatabaseApplication", operating_system: "Any" }, version_label: "Cloud Dedicated", versions: ["cloud-dedicated"] }, influxdb3_cloud_serverless: { ai_input_placeholder: 'Specify your version and product ("InfluxDB Cloud Serverless", "InfluxDB 3 Enterprise", "Core") for better results', ai_sample_questions: ["What's my InfluxDB version?", "How do I migrate from Cloud (TSM) to Cloud Serverless?", "What tools can I use to write data to InfluxDB Cloud Serverless?"], ai_source_group_ids: "b650cf0b-4b52-42e8-bde7-a02738f27262", altname: "InfluxDB Cloud", content_path: "influxdb3/cloud-serverless", detector_config: { characteristics: ["Paid/Free", "Cloud", "All languages", "Token", "Buckets"], detection: { url_contains: ["us-east-1-1.aws.cloud2.influxdata.com", "eu-central-1-1.aws.cloud2.influxdata.com"] }, query_languages: { Flux: { optional_params: [], required_params: ["Host", "Organization", "Token", "Default bucket"] }, InfluxQL: { optional_params: [], required_params: ["Host", "Bucket", "Token"] }, SQL: { optional_params: [], required_params: ["Host", "Bucket", "Token"] } } }, distributed_architecture: true, label_group: "v3-distributed", latest: "cloud-serverless", list_order: 2, menu_category: "managed", name: "InfluxDB Cloud Serverless", namespace: "influxdb", placeholder_host: "cloud2.influxdata.com", schema: { application_category: "DatabaseApplication", operating_system: "Any" }, version_label: "Cloud Serverless", versions: ["cloud-serverless"] }, influxdb3_clustered: { ai_input_placeholder: 'Specify your version and product ("InfluxDB Clustered", "InfluxDB 3 Enterprise", "Core") for better results', ai_sample_questions: ["What's my InfluxDB version?", "How do I use a Helm chart to configure InfluxDB Clustered?", "How do I use SQL and parameterized queries with InfluxDB Clustered?"], ai_source_group_ids: "b650cf0b-4b52-42e8-bde7-a02738f27262", altname: "InfluxDB Clustered", content_path: "influxdb3/clustered", detector_config: { characteristics: ["Paid", "Self-hosted", "SQL/InfluxQL", "Token", "Databases"], detection: { ping_headers: { "x-influxdb-version": "influxqlbridged-development" } }, query_languages: { InfluxQL: { optional_params: [], required_params: ["URL", "Database", "Token"] }, SQL: { optional_params: [], required_params: ["Host", "Database", "Token"] } } }, distributed_architecture: true, label_group: "v3-distributed", latest: "clustered", link: "https://www.influxdata.com/contact-sales-influxdb-clustered/", list_order: 3, menu_category: "self-managed", name: "InfluxDB Clustered", namespace: "influxdb", placeholder_host: "cluster-host.com", schema: { application_category: "DatabaseApplication", operating_system: "Kubernetes" }, version_label: "Clustered", versions: ["clustered"] }, influxdb3_core: { ai_input_placeholder: 'Specify your version and product ("Core", "InfluxDB 3 Enterprise", "OSS v1") for better results', ai_sample_questions: ["What's my InfluxDB version?", "How do I install and run InfluxDB 3 Core?", "Help me write a plugin for the Python Processing engine using InfluxDB 3 Core"], ai_source_group_ids: "b650cf0b-4b52-42e8-bde7-a02738f27262", altname: "InfluxDB 3 Core", content_path: "influxdb3/core", detector_config: { characteristics: ["Free", "Self-hosted", "SQL/InfluxQL", "No auth required", "Databases"], detection: { ping_headers: { "x-influxdb-build": "Core", "x-influxdb-version": "^3\\." }, url_contains: ["localhost:8181"] }, query_languages: { InfluxQL: { optional_params: [], required_params: ["Host", "Database"] }, SQL: { optional_params: [], required_params: ["Host", "Database"] } } }, label_group: "v3-monolith", latest: "core", latest_patch: "3.10.0", limits: { column: 500, database: 5, table: 2e3 }, list_order: 2, menu_category: "self-managed", name: "InfluxDB 3 Core", namespace: "influxdb3", oss_repo: { branch: "main", name: "influxdb" }, placeholder_host: "localhost:8181", product_issue_url: "https://github.com/influxdata/influxdb/issues/new/choose/", schema: { application_category: "DatabaseApplication", offers: { price: "0", price_currency: "USD" }, operating_system: "Linux, macOS, Windows, Docker" }, versions: ["core"] }, influxdb3_enterprise: { ai_input_placeholder: 'Specify your version and product ("InfluxDB 3 Enterprise", "Core", "Enterprise v1") for better results', ai_sample_questions: ["What's my InfluxDB version?", "How do I install and run InfluxDB 3 Enterprise?", "How do I start a read replica node using InfluxDB 3 Enterprise?"], ai_source_group_ids: "b650cf0b-4b52-42e8-bde7-a02738f27262", altname: "InfluxDB 3 Enterprise", content_path: "influxdb3/enterprise", detector_config: { characteristics: ["Paid", "Self-hosted", "SQL/InfluxQL", "Token", "Databases"], detection: { ping_headers: { "x-influxdb-build": "Enterprise", "x-influxdb-version": "^3\\." }, url_contains: ["localhost:8181"] }, query_languages: { InfluxQL: { optional_params: [], required_params: ["Host", "Database", "Token"] }, SQL: { optional_params: [], required_params: ["Host", "Database", "Token"] } } }, label_group: "v3-monolith", latest: "enterprise", latest_patch: "3.10.0", limits: { column: 500, database: 100, table: 1e4 }, list_order: 2, menu_category: "self-managed", name: "InfluxDB 3 Enterprise", namespace: "influxdb3", placeholder_host: "localhost:8181", schema: { application_category: "DatabaseApplication", operating_system: "Linux, macOS, Windows, Docker" }, versions: ["enterprise"] }, influxdb3_explorer: { ai_input_placeholder: 'Specify your version and product ("InfluxDB 3 Explorer and Enterprise", "InfluxDB 3 Explorer and Core") for better results', ai_sample_questions: ["How do I install and run Explorer?", "How do I query data using Explorer?", "How do I visualize data using Explorer?"], ai_source_group_ids: "b650cf0b-4b52-42e8-bde7-a02738f27262", altname: "Explorer", content_path: "influxdb3/explorer", label_group: "explorer", latest: "explorer", latest_patch: "1.9.0", list_order: 1, menu_category: "tools", name: "InfluxDB 3 Explorer", namespace: "influxdb3_explorer", placeholder_host: "localhost:8080", product_issue_url: "https://github.com/influxdata/influxdb/issues/new/choose/", schema: { application_category: "BusinessApplication", offers: { price: "0", price_currency: "USD" }, operating_system: "Linux, macOS, Windows, Docker" } }, influxdb_cloud: { ai_input_placeholder: 'Specify your version and product ("InfluxDB Cloud (TSM)", "InfluxDB 3 Enterprise", "Core") for better results', ai_sample_questions: ["What's my InfluxDB version?", "How do I write and query data using InfluxDB Cloud (TSM)?", "How is Cloud (TSM) different from Cloud Serverless?"], ai_source_group_ids: "3e905caa-dd6f-464b-abf9-c3880e09f128", altname: "InfluxDB Cloud", content_path: "influxdb/cloud", detector_config: { characteristics: ["Paid/Free", "Cloud", "InfluxQL/Flux", "Token", "Databases/Buckets"], detection: { url_contains: ["us-west-2-1.aws.cloud2.influxdata.com", "us-west-2-2.aws.cloud2.influxdata.com", "us-east-1-1.aws.cloud2.influxdata.com", "eu-central-1-1.aws.cloud2.influxdata.com", "us-central1-1.gcp.cloud2.influxdata.com", "westeurope-1.azure.cloud2.influxdata.com", "eastus-1.azure.cloud2.influxdata.com"] }, query_languages: { Flux: { optional_params: [], required_params: ["URL", "Organization", "Token", "Default bucket"] }, InfluxQL: { optional_params: [], required_params: ["URL", "Database", "Token"] } } }, label_group: "v2-cloud", latest: "cloud", list_order: 1, menu_category: "managed", name: "InfluxDB Cloud (TSM)", name__vcloud: "InfluxDB Cloud (TSM)", namespace: "influxdb", placeholder_host: "cloud2.influxdata.com", schema: { application_category: "DatabaseApplication", operating_system: "Any" }, version_label: "Cloud", versions: ["cloud"] }, influxdb_cloud1: { ai_input_placeholder: 'Specify your version and product ("InfluxDB Cloud 1", "Enterprise v1", "InfluxDB 3 Enterprise") for better results', ai_sample_questions: ["What's my InfluxDB version?", "How do I migrate from InfluxDB Cloud 1 to InfluxDB 3?", "Where can I find documentation for InfluxDB Cloud 1?"], ai_source_group_ids: "d809f67b-867d-4f17-95f0-c33dbadbf15f", altname: "InfluxCloud 1.x", detector_config: { characteristics: ["Paid", "Cloud", "InfluxQL", "Username/Password", "Databases"], detection: { url_contains: ["cloud.influxdata.com"] }, query_languages: { InfluxQL: { optional_params: [], required_params: ["URL", "Database", "User", "Password"] } } }, latest: "v1", list_order: 6, menu_category: "managed", name: "InfluxDB Cloud 1", namespace: "influxcloud", placeholder_host: "cloud.influxdata.com", schema: { application_category: "DatabaseApplication", operating_system: "Any" }, versions: ["v1"] }, kapacitor: { ai_input_placeholder: "Ask questions about Kapacitor", ai_sample_questions: ["How do I configure Kapacitor for InfluxDB v1?", "How do I write a custom task for Kapacitor?", "How do I create tasks using InfluxDB 3 Core?"], content_path: "kapacitor", label_group: "kapacitor", latest: "v1.8", latest_patches: { v1: "1.8.6" }, list_order: 7, menu_category: "other", name: "Kapacitor", namespace: "kapacitor", oss_repo: { branch: "master", name: "kapacitor" }, product_issue_url: "https://github.com/influxdata/kapacitor/issues/new/choose/", schema: { application_category: "DeveloperApplication", offers: { price: "0", price_currency: "USD" }, operating_system: "Linux, macOS, Windows, Docker" }, versions: ["v1"] }, telegraf: { ai_input_placeholder: "Ask questions about Telegraf and InfluxDB", ai_sample_questions: ["How do I configure Telegraf for InfluxDB 3?", "How do I write a custom Telegraf plugin?", "How do I use Telegraf for MQTT?"], content_path: "telegraf", label_group: "telegraf", latest: "v1.39", latest_patches: { v1: "1.39.0" }, link: "https://influxdata.com/contact-sales-telegraf-enterprise/?utm_source=website&utm_medium=direct&utm_campaign=Telegraf-Enterprise", list_order: 6, menu_category: "other", name: "Telegraf", namespace: "telegraf", oss_repo: { branch: "master", name: "telegraf" }, product_issue_url: "https://github.com/influxdata/telegraf/issues/new/choose/", schema: { application_category: "DeveloperApplication", offers: { price: "0", price_currency: "USD" }, operating_system: "Linux, macOS, Windows, FreeBSD, Docker" }, versions: ["v1"] }, telegraf_controller: { altname: "Controller", latest: 1, latest_patch: "1.0.0", link: "https://influxdata.com/contact-sales-telegraf-enterprise/?utm_source=website&utm_medium=direct&utm_campaign=Telegraf-Enterprise", menu_category: "other", name: "Telegraf Controller", namespace: "telegraf", schema: { application_category: "DeveloperApplication", operating_system: "Docker" }, versions: ["v1"] }, telegraf_enterprise: { altname: "Telegraf Enterprise", latest: 1, latest_patch: "1.0.0", link: "https://influxdata.com/contact-sales-telegraf-enterprise/?utm_source=website&utm_medium=direct&utm_campaign=Telegraf-Enterprise", menu_category: "other", name: "Telegraf Enterprise", namespace: "telegraf", schema: { application_category: "BusinessApplication", operating_system: "Linux, macOS, Windows, Docker" }, versions: ["v1"] } };

// ns-hugo-imp:/home/runner/work/docs-v2/docs-v2/assets/js/services/influxdata-products.js
var products2 = products || {};

// ns-hugo-imp:/home/runner/work/docs-v2/docs-v2/assets/js/utils/node-shim.ts
var isNode = typeof process !== "undefined" && process.versions != null && process.versions.node != null;

// ns-hugo-imp:/home/runner/work/docs-v2/docs-v2/assets/js/utils/product-mappings.ts
var URL_PATTERN_MAP = {
  "/influxdb3/core/": "influxdb3_core",
  "/influxdb3/enterprise/": "influxdb3_enterprise",
  "/influxdb3/cloud-dedicated/": "influxdb3_cloud_dedicated",
  "/influxdb3/cloud-serverless/": "influxdb3_cloud_serverless",
  "/influxdb3/clustered/": "influxdb3_clustered",
  "/influxdb3/explorer/": "influxdb3_explorer",
  "/influxdb/cloud/": "influxdb_cloud",
  "/influxdb/v2": "influxdb",
  "/influxdb/v1": "influxdb",
  "/enterprise_influxdb/": "enterprise_influxdb",
  "/telegraf/": "telegraf",
  "/telegraf/controller/": "telegraf_controller",
  "/chronograf/": "chronograf",
  "/kapacitor/": "kapacitor",
  "/flux/": "flux"
};
function getProductKeyFromPath(path2) {
  for (const [pattern, key] of Object.entries(URL_PATTERN_MAP)) {
    if (path2.includes(pattern)) {
      return key;
    }
  }
  return null;
}

// ns-hugo-imp:/home/runner/work/docs-v2/docs-v2/assets/js/page-context.ts
function getCurrentProductData() {
  const path2 = window.location.pathname;
  const mappings = [
    {
      pattern: /\/influxdb\/cloud\//,
      product: products2.influxdb_cloud,
      urls: influxdbUrls.influxdb_cloud
    },
    {
      pattern: /\/influxdb3\/core/,
      product: products2.influxdb3_core,
      urls: influxdbUrls.core
    },
    {
      pattern: /\/influxdb3\/enterprise/,
      product: products2.influxdb3_enterprise,
      urls: influxdbUrls.enterprise
    },
    {
      pattern: /\/influxdb3\/cloud-serverless/,
      product: products2.influxdb3_cloud_serverless,
      urls: influxdbUrls.cloud
    },
    {
      pattern: /\/influxdb3\/cloud-dedicated/,
      product: products2.influxdb3_cloud_dedicated,
      urls: influxdbUrls.dedicated
    },
    {
      pattern: /\/influxdb3\/clustered/,
      product: products2.influxdb3_clustered,
      urls: influxdbUrls.clustered
    },
    {
      pattern: /\/influxdb3\/explorer/,
      product: products2.influxdb3_explorer,
      urls: influxdbUrls.core
    },
    {
      pattern: /\/enterprise_influxdb\//,
      product: products2.enterprise_influxdb,
      urls: influxdbUrls.oss
    },
    {
      pattern: /\/influxdb.*v1\//,
      product: products2.influxdb,
      urls: influxdbUrls.oss
    },
    {
      pattern: /\/influxdb.*v2\//,
      product: products2.influxdb,
      urls: influxdbUrls.oss
    },
    {
      pattern: /\/kapacitor\//,
      product: products2.kapacitor,
      urls: influxdbUrls.oss
    },
    {
      pattern: /\/telegraf\//,
      product: products2.telegraf,
      urls: influxdbUrls.oss
    },
    {
      pattern: /\/chronograf\//,
      product: products2.chronograf,
      urls: influxdbUrls.oss
    },
    { pattern: /\/flux\//, product: products2.flux, urls: influxdbUrls.oss }
  ];
  for (const { pattern, product: product2, urls } of mappings) {
    if (pattern.test(path2)) {
      return {
        product: product2 || "unknown",
        urls: urls || {}
      };
    }
  }
  return { product: "other", urls: {} };
}
function getContext() {
  const productKey = getProductKeyFromPath(window.location.pathname);
  const contextMap = {
    influxdb_cloud: "cloud",
    influxdb3_core: "core",
    influxdb3_enterprise: "enterprise",
    influxdb3_cloud_serverless: "serverless",
    influxdb3_cloud_dedicated: "dedicated",
    influxdb3_clustered: "clustered",
    enterprise_influxdb: "oss/enterprise",
    influxdb: "oss/enterprise"
  };
  return contextMap[productKey || ""] || "other";
}
var currentPageHost = window.location.href.match(/^(?:[^/]*\/){2}[^/]+/g)?.[0] || "";
function getReferrerHost() {
  const referrerMatch = document.referrer.match(/^(?:[^/]*\/){2}[^/]+/g);
  return referrerMatch ? referrerMatch[0] : "";
}
var context = getContext();
var host = currentPageHost;
var hostname = location.hostname;
var path = location.pathname;
var pathArr = location.pathname.split("/").slice(1, -1);
var product = pathArr[0];
var productData = getCurrentProductData();
var protocol = location.protocol;
var referrer = document.referrer === "" ? "direct" : document.referrer;
var referrerHost = getReferrerHost();
var version = /^v\d/.test(pathArr[1]) || pathArr[1]?.includes("cloud") ? pathArr[1].replace(/^v/, "") : "n/a";

// ns-hugo-imp:/home/runner/work/docs-v2/docs-v2/assets/js/code-controls.js
function initialize4() {
  var codeBlockSelector = ".article--content pre";
  var $codeBlocks = (0, import_jquery3.default)(codeBlockSelector);
  var appendHTML = `
<div class="code-controls">
  <button class="code-controls-toggle" aria-label="Code block options" aria-expanded="false"><span class='cf-icon More'></span></button>
  <ul class="code-control-options" role="menu">
    <li role="none"><button role="menuitem" class='copy-code'><span class='cf-icon Duplicate_New'></span> <span class="message">Copy</span></button></li>
    <li role="none"><button role="menuitem" class='ask-ai-code'><span class='cf-icon Chat'></span> Ask AI</button></li>
    <li role="none"><button role="menuitem" class='fullscreen-toggle'><span class='cf-icon ExpandB'></span> Fill window</button></li>
  </ul>
</div>
`;
  $codeBlocks.each(function() {
    (0, import_jquery3.default)(this).wrap("<div class='codeblock'></div>");
  });
  (0, import_jquery3.default)(".codeblock").append(appendHTML);
  (0, import_jquery3.default)(document).click(function() {
    (0, import_jquery3.default)(".code-controls.open").each(function() {
      (0, import_jquery3.default)(this).removeClass("open");
      (0, import_jquery3.default)(this).find(".code-controls-toggle").attr("aria-expanded", "false");
    });
  });
  (0, import_jquery3.default)(".code-controls-toggle").click(function() {
    var $controls = (0, import_jquery3.default)(this).parent(".code-controls");
    var isOpen = $controls.toggleClass("open").hasClass("open");
    (0, import_jquery3.default)(this).attr("aria-expanded", String(isOpen));
  });
  (0, import_jquery3.default)(".code-controls").click(function(e) {
    e.stopPropagation();
  });
  function updateText(element, currentText, newText) {
    let inner = element[0].innerHTML;
    inner = inner.replace(currentText, newText);
    element[0].innerHTML = inner;
  }
  function copyLifeCycle(element, state2) {
    let stateData = state2 === "success" ? { state: "success", message: "Copied!" } : { state: "failed", message: "Copy failed!" };
    updateText(element, "Copy", stateData.message);
    element.addClass(stateData.state);
    setTimeout(function() {
      updateText(element, stateData.message, "Copy");
      element.removeClass(stateData.state);
    }, 2500);
  }
  (0, import_jquery3.default)(".copy-code").click(function() {
    let codeElement = (0, import_jquery3.default)(this).closest(".code-controls").prevAll("pre:has(code)")[0];
    let text = codeElement.innerText;
    const codeBlockInfo = extractCodeBlockInfo(codeElement);
    const currentUrl = new URL(window.location.href);
    switch (context) {
      case "cloud":
        currentUrl.searchParams.set("dl", "cloud");
        break;
      case "core":
        currentUrl.searchParams.set("dl", "oss3");
        break;
      case "enterprise":
        currentUrl.searchParams.set("dl", "enterprise");
        break;
      case "serverless":
        currentUrl.searchParams.set("dl", "serverless");
        break;
      case "dedicated":
        currentUrl.searchParams.set("dl", "dedicated");
        break;
      case "clustered":
        currentUrl.searchParams.set("dl", "clustered");
        break;
      case "oss/enterprise":
        currentUrl.searchParams.set("dl", "oss");
        break;
      case "other":
      default:
        break;
    }
    if (codeBlockInfo.language) {
      currentUrl.searchParams.set("code_lang", codeBlockInfo.language);
    }
    if (codeBlockInfo.lineCount) {
      currentUrl.searchParams.set("code_lines", codeBlockInfo.lineCount);
    }
    if (codeBlockInfo.hasPlaceholders) {
      currentUrl.searchParams.set("has_placeholders", "true");
    }
    if (codeBlockInfo.blockType) {
      currentUrl.searchParams.set("code_type", codeBlockInfo.blockType);
    }
    if (codeBlockInfo.sectionTitle) {
      currentUrl.searchParams.set(
        "section",
        encodeURIComponent(codeBlockInfo.sectionTitle)
      );
    }
    if (codeBlockInfo.firstLine) {
      currentUrl.searchParams.set(
        "first_line",
        encodeURIComponent(codeBlockInfo.firstLine.substring(0, 100))
      );
    }
    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, "", currentUrl.toString());
    }
    if (typeof window.gtag !== "undefined") {
      window.gtag("event", "code_copy", {
        language: codeBlockInfo.language,
        line_count: codeBlockInfo.lineCount,
        has_placeholders: codeBlockInfo.hasPlaceholders,
        dl: codeBlockInfo.dl || null,
        section_title: codeBlockInfo.sectionTitle,
        first_line: codeBlockInfo.firstLine ? codeBlockInfo.firstLine.substring(0, 100) : null,
        product: context
      });
    }
    const copyContent = async () => {
      try {
        await navigator.clipboard.writeText(text);
        copyLifeCycle((0, import_jquery3.default)(this), "success");
      } catch {
        copyLifeCycle((0, import_jquery3.default)(this), "failed");
      }
    };
    copyContent();
  });
  function extractCodeBlockInfo(codeElement) {
    const codeTag = codeElement.querySelector("code");
    const info = {
      language: null,
      lineCount: 0,
      hasPlaceholders: false,
      blockType: "code",
      dl: null,
      // Download script type
      sectionTitle: null,
      firstLine: null
    };
    if (codeTag && codeTag.className) {
      const langMatch = codeTag.className.match(
        /language-(\w+)|hljs-(\w+)|(\w+)/
      );
      if (langMatch) {
        info.language = langMatch[1] || langMatch[2] || langMatch[3];
      }
    }
    const text = codeElement.innerText || "";
    const lines = text.split("\n");
    info.lineCount = lines.length;
    info.firstLine = lines.find((line) => line.trim() !== "") || null;
    info.hasPlaceholders = /\b[A-Z_]{2,}\b|\{\{[^}]+\}\}|\$\{[^}]+\}|<[^>]+>/.test(text);
    if (text.includes("https://www.influxdata.com/d/install_influxdb3.sh")) {
      if (text.includes("install_influxdb3.sh enterprise")) {
        info.dl = "enterprise";
      } else {
        info.dl = "oss3";
      }
    } else if (text.includes("docker pull influxdb:3-enterprise")) {
      info.dl = "enterprise";
    } else if (text.includes("docker pull influxdb:3-core")) {
      info.dl = "oss3";
    }
    let element = codeElement;
    while (element && element !== document.body) {
      element = element.previousElementSibling || element.parentElement;
      if (element && element.tagName && /^H[1-6]$/.test(element.tagName)) {
        info.sectionTitle = element.textContent.trim();
        break;
      }
    }
    return info;
  }
  (0, import_jquery3.default)(".ask-ai-code").click(function() {
    var codeElement = (0, import_jquery3.default)(this).closest(".code-controls").prevAll("pre:has(code)")[0];
    if (!codeElement) return;
    var code = codeElement.innerText.trim();
    var query = (0, import_jquery3.default)(codeElement).attr("data-ask-ai-query") || "Explain this code:\n```\n" + code.substring(0, 500) + "\n```";
    var triggerEl = document.createElement("a");
    triggerEl.className = "ask-ai-open";
    triggerEl.dataset.query = query;
    document.body.appendChild(triggerEl);
    triggerEl.click();
    triggerEl.remove();
  });
  (0, import_jquery3.default)(".fullscreen-toggle").click(function() {
    var code = (0, import_jquery3.default)(this).closest(".code-controls").prevAll("pre:has(code)").clone();
    (0, import_jquery3.default)("#fullscreen-code-placeholder").replaceWith(code[0]);
    (0, import_jquery3.default)("body").css("overflow", "hidden");
    (0, import_jquery3.default)("body > div:not(.fullscreen-code)").css("user-select", "none");
    (0, import_jquery3.default)(".fullscreen-code").fadeIn();
  });
  (0, import_jquery3.default)(".fullscreen-close").click(function() {
    (0, import_jquery3.default)("body").css("overflow", "auto");
    (0, import_jquery3.default)("body > div:not(.fullscreen-code)").css("user-select", "");
    (0, import_jquery3.default)(".fullscreen-code").fadeOut();
    (0, import_jquery3.default)(".fullscreen-code pre").replaceWith(
      '<div id="fullscreen-code-placeholder"></div>'
    );
  });
}

// ns-hugo-imp:/home/runner/work/docs-v2/docs-v2/assets/js/datetime.js
var import_jquery4 = __toESM(require_jquery());
var date = /* @__PURE__ */ new Date();
var currentTimestamp = date.toISOString().replace(/^(.*)(\.\d+)(Z)/, "$1$3");
var MICROSECOND_OFFSET = "084216";
var currentTime = date.toISOString().replace(/(^.*T)(.*)(Z)/, "$2") + MICROSECOND_OFFSET;
function currentDate(offset = 0, trimTime = false) {
  let outputDate = new Date(date);
  outputDate.setDate(outputDate.getDate() + offset);
  if (trimTime) {
    return outputDate.toISOString().replace(/T.*$/, "");
  } else {
    return outputDate.toISOString().replace(/T.*$/, "T00:00:00Z");
  }
}
function enterpriseEOLDate() {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  var inTwoYears = new Date(date);
  inTwoYears.setFullYear(inTwoYears.getFullYear() + 2);
  let earliestEOL = new Date(inTwoYears);
  return `${monthNames[earliestEOL.getMonth()]} ${earliestEOL.getDate()}, ${earliestEOL.getFullYear()}`;
}
function initialize5() {
  (0, import_jquery4.default)("span.current-timestamp").text(currentTimestamp);
  (0, import_jquery4.default)("span.current-time").text(currentTime);
  (0, import_jquery4.default)("span.enterprise-eol-date").text(enterpriseEOLDate());
  (0, import_jquery4.default)("span.current-date").each(function() {
    var dayOffset = parseInt((0, import_jquery4.default)(this).attr("offset"));
    var trimTime = (0, import_jquery4.default)(this).attr("trim-time") === "true";
    (0, import_jquery4.default)(this).text(currentDate(dayOffset, trimTime));
  });
}

// ns-hugo-imp:/home/runner/work/docs-v2/docs-v2/assets/js/helpers.js
function delay(fn, ms) {
  let timer = 0;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(fn.bind(this, ...args), ms || 0);
  };
}

// ns-hugo-imp:/home/runner/work/docs-v2/docs-v2/assets/js/influxdb-url.js
var import_jquery6 = __toESM(require_jquery());

// ns-hugo-imp:/home/runner/work/docs-v2/docs-v2/assets/js/modals.js
var import_jquery5 = __toESM(require_jquery());
function handleModalClick() {
  (0, import_jquery5.default)(".modal-trigger").click(function(e) {
    e.preventDefault();
    toggleModal();
  });
  (0, import_jquery5.default)("#modal-close, .modal-overlay").click(function(e) {
    e.preventDefault();
    toggleModal();
    const queryParams = new URLSearchParams(window.location.search);
    const anchor = window.location.hash;
    if (queryParams.get("view") !== null) {
      queryParams.delete("view");
      window.history.replaceState({}, "", `${location.pathname}${anchor}`);
    }
  });
}
function toggleModal(modalID = "") {
  if ((0, import_jquery5.default)(".modal").hasClass("open")) {
    (0, import_jquery5.default)(".modal").fadeOut(200).removeClass("open");
    (0, import_jquery5.default)(".modal-content").delay(400).hide(0);
  } else {
    (0, import_jquery5.default)(".modal").fadeIn(200).addClass("open");
    (0, import_jquery5.default)(`${modalID}.modal-content`).show();
  }
}
function initialize6() {
  handleModalClick();
}

// ns-hugo-imp:/home/runner/work/docs-v2/docs-v2/assets/js/influxdb-url.js
var CLOUD_URLS = [];
if (influxdbUrls?.cloud) {
  CLOUD_URLS = Object.values(influxdbUrls.cloud.providers).flatMap(
    (provider) => provider.regions?.map((region) => region.url)
  );
}
function InfluxDBUrl() {
  const UNIQUE_URL_PRODUCTS = ["dedicated", "clustered"];
  const IS_UNIQUE_URL_PRODUCT = UNIQUE_URL_PRODUCTS.includes(context);
  const elementSelector = ".article--content pre:not(.preserve)";
  function getURLPreference() {
    return getPreference("influxdb_url");
  }
  function setURLPreference(preference) {
    setPreference("influxdb_url", preference);
  }
  function storeUrl(context2, newUrl, prevUrl) {
    let urlsObj = {};
    urlsObj["prev_" + context2] = prevUrl;
    urlsObj[context2] = newUrl;
    setInfluxDBUrls(urlsObj);
  }
  function storeCustomUrl(customUrl) {
    setInfluxDBUrls({ custom: customUrl });
    (0, import_jquery6.default)("input#custom[type=radio]").val(customUrl);
  }
  function removeCustomUrl() {
    removeInfluxDBUrl("custom");
  }
  function storeProductUrl(product2, productUrl) {
    let urlsObj = {};
    urlsObj[product2] = productUrl;
    setInfluxDBUrls(urlsObj);
    (0, import_jquery6.default)(`input#${product2}-url-field`).val(productUrl);
  }
  function removeProductUrl(product2) {
    removeInfluxDBUrl(product2);
  }
  function addPreserve() {
    (0, import_jquery6.default)(".keep-url").each(function() {
      (0, import_jquery6.default)(this).next("pre").addClass("preserve");
      (0, import_jquery6.default)(this).next("a").find("pre").addClass("preserve");
      (0, import_jquery6.default)(this).next(".highlight").find("pre").addClass("preserve");
      (0, import_jquery6.default)(this).find("pre").addClass("preserve");
    });
  }
  function getUrls() {
    const { cloud: cloud2, oss: oss2, core: core2, enterprise: enterprise2, serverless: serverless2, dedicated: dedicated2, clustered: clustered2 } = getInfluxDBUrls();
    return { oss: oss2, cloud: cloud2, core: core2, enterprise: enterprise2, serverless: serverless2, dedicated: dedicated2, clustered: clustered2 };
  }
  function getPrevUrls() {
    const {
      prev_cloud: cloud2,
      prev_oss: oss2,
      prev_core: core2,
      prev_enterprise: enterprise2,
      prev_serverless: serverless2,
      prev_dedicated: dedicated2,
      prev_clustered: clustered2
    } = getInfluxDBUrls();
    return { oss: oss2, cloud: cloud2, core: core2, enterprise: enterprise2, serverless: serverless2, dedicated: dedicated2, clustered: clustered2 };
  }
  function updateUrls(prevUrls, newUrls) {
    var prevUrlsParsed = {
      oss: {},
      cloud: {},
      core: {},
      enterprise: {},
      serverless: {},
      dedicated: {},
      clustered: {}
    };
    var newUrlsParsed = {
      oss: {},
      cloud: {},
      core: {},
      enterprise: {},
      serverless: {},
      dedicated: {},
      clustered: {}
    };
    Object.keys(prevUrls).forEach(function(k) {
      try {
        prevUrlsParsed[k] = new URL(prevUrls[k]);
      } catch {
        prevUrlsParsed[k] = { origin: prevUrls[k], host: prevUrls[k] };
      }
    });
    Object.keys(newUrls).forEach(function(k) {
      try {
        newUrlsParsed[k] = new URL(newUrls[k]);
      } catch {
        newUrlsParsed[k] = { origin: newUrls[k], host: newUrls[k] };
      }
    });
    var ossReplacements = [
      { replace: prevUrlsParsed.cloud, with: newUrlsParsed.cloud },
      { replace: prevUrlsParsed.oss, with: newUrlsParsed.oss }
    ];
    var cloudReplacements = [
      { replace: prevUrlsParsed.cloud, with: newUrlsParsed.cloud },
      { replace: prevUrlsParsed.oss, with: newUrlsParsed.cloud }
    ];
    var serverlessReplacements = [
      { replace: prevUrlsParsed.serverless, with: newUrlsParsed.serverless },
      { replace: prevUrlsParsed.oss, with: newUrlsParsed.serverless }
    ];
    var coreReplacements = [
      { replace: prevUrlsParsed.core, with: newUrlsParsed.core }
    ];
    var enterpriseReplacements = [
      { replace: prevUrlsParsed.enterprise, with: newUrlsParsed.enterprise }
    ];
    var dedicatedReplacements = [
      { replace: prevUrlsParsed.dedicated, with: newUrlsParsed.dedicated }
    ];
    var clusteredReplacements = [
      { replace: prevUrlsParsed.clustered, with: newUrlsParsed.clustered }
    ];
    var replacements;
    switch (context) {
      case "cloud":
        replacements = cloudReplacements;
        break;
      case "core":
        replacements = coreReplacements;
        break;
      case "enterprise":
        replacements = enterpriseReplacements;
        break;
      case "serverless":
        replacements = serverlessReplacements;
        break;
      case "dedicated":
        replacements = dedicatedReplacements;
        break;
      case "clustered":
        replacements = clusteredReplacements;
        break;
      case "oss/enterprise":
        replacements = ossReplacements;
        break;
      default:
        if (getURLPreference() === "cloud") {
          replacements = cloudReplacements;
        } else {
          replacements = ossReplacements;
        }
        break;
    }
    replacements.forEach(function(o) {
      if (o.replace.origin != o.with.origin) {
        var fuzzyOrigin = new RegExp(
          o.replace.origin + "(:(^443)|[0-9]+)?",
          "g"
        );
        (0, import_jquery6.default)(elementSelector).each(function() {
          (0, import_jquery6.default)(this).html(
            (0, import_jquery6.default)(this).html().replace(fuzzyOrigin, function(m) {
              return o.with.origin || m;
            })
          );
        });
      }
    });
    function replaceWholename(startStr, endStr, replacement) {
      var startsWithSeparator = new RegExp("[/.]");
      var endsWithSeparator = new RegExp("[-.:]");
      if (!startsWithSeparator.test(startStr) && !endsWithSeparator.test(endStr)) {
        var newHost = startStr + replacement + endStr;
        return newHost;
      }
    }
    replacements.map(function(o) {
      return { replace: o.replace.host, with: o.with.host };
    }).forEach(function(o) {
      if (o.replace != o.with) {
        var fuzzyHost = new RegExp("(.?)" + o.replace + "(.?)", "g");
        (0, import_jquery6.default)(elementSelector).each(function() {
          (0, import_jquery6.default)(this).html(
            (0, import_jquery6.default)(this).html().replace(fuzzyHost, function(m, p1, p2) {
              var r = replaceWholename(p1, p2, o.with) || m;
              return r;
            })
          );
        });
      }
    });
  }
  function appendUrlSelector(urls = {
    cloud: "",
    oss: "",
    core: "",
    enterprise: "",
    serverless: "",
    dedicated: "",
    clustered: ""
  }) {
    const appendToUrls = Object.values(urls);
    const getBtnText = (context2) => {
      const contextText = {
        "oss/enterprise": "Change InfluxDB URL",
        cloud: "InfluxDB Cloud Region",
        core: "Change InfluxDB URL",
        enterprise: "Change InfluxDB URL",
        serverless: "InfluxDB Cloud Region",
        dedicated: "Set Cloud Dedicated cluster URL",
        clustered: "Set InfluxDB cluster URL",
        other: "InfluxDB Cloud or OSS?"
      };
      return contextText[context2];
    };
    (0, import_jquery6.default)(elementSelector).each(function() {
      var code = (0, import_jquery6.default)(this).html();
      var $codeBlock = (0, import_jquery6.default)(this);
      var containsUrl = appendToUrls.some(function(url) {
        return url && code.includes(url);
      });
      if (containsUrl && !$codeBlock.next(".select-url").length) {
        $codeBlock.after(
          "<div class='select-url'><a class='url-trigger' href='#'>" + getBtnText(context) + "</a></div>"
        );
      }
    });
    (0, import_jquery6.default)(".select-url").fadeIn(400);
  }
  addPreserve();
  const { cloud, oss, core, enterprise, serverless, dedicated, clustered } = DEFAULT_STORAGE_URLS;
  appendUrlSelector({
    cloud,
    oss,
    core,
    enterprise,
    serverless,
    dedicated,
    clustered
  });
  updateUrls(
    { cloud, oss, core, enterprise, serverless, dedicated, clustered },
    getUrls()
  );
  setRadioButtons(getUrls());
  (0, import_jquery6.default)(".url-trigger").click(function(e) {
    e.preventDefault();
    toggleModal("#influxdb-url-list");
  });
  function setRadioButtons() {
    const currentUrls = getUrls();
    (0, import_jquery6.default)(
      'input[name="influxdb-cloud-url"][value="' + currentUrls.cloud + '"]'
    ).prop("checked", true);
    (0, import_jquery6.default)(
      'input[name="influxdb-serverless-url"][value="' + currentUrls.serverless + '"]'
    ).prop("checked", true);
    (0, import_jquery6.default)('input[name="influxdb-oss-url"][value="' + currentUrls.oss + '"]').prop(
      "checked",
      true
    );
    (0, import_jquery6.default)('input[name="influxdb-core-url"][value="' + currentUrls.core + '"]').prop(
      "checked",
      true
    );
    (0, import_jquery6.default)(
      'input[name="influxdb-enterprise-url"][value="' + currentUrls.enterprise + '"]'
    ).prop("checked", true);
  }
  if ((0, import_jquery6.default)("ul.clusters label input").is(":checked")) {
    var group = (0, import_jquery6.default)("ul.clusters label input:checked").parent().parent().parent().siblings();
    (0, import_jquery6.default)(".fake-radio", group).addClass("checked");
  }
  (0, import_jquery6.default)("p.region").click(function() {
    if (!(0, import_jquery6.default)(".fake-radio", this).hasClass("checked")) {
      (0, import_jquery6.default)(".fake-radio", this).addClass("checked");
      (0, import_jquery6.default)("+ ul.clusters li:first label", this).trigger("click");
    }
  });
  (0, import_jquery6.default)(".region-group").click(function() {
    if (!(0, import_jquery6.default)(".fake-radio", this).hasClass("checked")) {
      (0, import_jquery6.default)(".fake-radio", !this).removeClass("checked");
      (0, import_jquery6.default)(".fake-radio", this).addClass("checked");
    }
  });
  (0, import_jquery6.default)('input[name="influxdb-oss-url"]').change(function() {
    var newUrl = (0, import_jquery6.default)(this).val();
    storeUrl("oss", newUrl, getUrls().oss);
    updateUrls(getPrevUrls(), getUrls());
    setURLPreference("oss");
  });
  (0, import_jquery6.default)('input[name="influxdb-oss-url"]').click(function() {
    setURLPreference("oss");
  });
  (0, import_jquery6.default)('input[name="influxdb-cloud-url"]').change(function() {
    var newUrl = (0, import_jquery6.default)(this).val();
    storeUrl("cloud", newUrl, getUrls().cloud);
    updateUrls(getPrevUrls(), getUrls());
  });
  (0, import_jquery6.default)('input[name="influxdb-cloud-url"]').click(function() {
    setURLPreference("cloud");
  });
  (0, import_jquery6.default)('input[name="influxdb-core-url"]').change(function() {
    var newUrl = (0, import_jquery6.default)(this).val();
    storeUrl("core", newUrl, getUrls().core);
    updateUrls(getPrevUrls(), getUrls());
  });
  (0, import_jquery6.default)('input[name="influxdb-enterprise-url"]').change(function() {
    var newUrl = (0, import_jquery6.default)(this).val();
    storeUrl("enterprise", newUrl, getUrls().enterprise);
    updateUrls(getPrevUrls(), getUrls());
  });
  (0, import_jquery6.default)('input[name="influxdb-serverless-url"]').change(function() {
    var newUrl = (0, import_jquery6.default)(this).val();
    storeUrl("serverless", newUrl, getUrls().serverless);
    updateUrls(getPrevUrls(), getUrls());
  });
  (0, import_jquery6.default)('input[name="influxdb-dedicated-url"]').change(function() {
    var newUrl = (0, import_jquery6.default)(this).val();
    storeUrl("dedicated", newUrl, getUrls().dedicated);
    updateUrls(getPrevUrls(), getUrls());
  });
  (0, import_jquery6.default)('input[name="influxdb-clustered-url"]').change(function() {
    var newUrl = (0, import_jquery6.default)(this).val();
    storeUrl("clustered", newUrl, getUrls().clustered);
    updateUrls(getPrevUrls(), getUrls());
  });
  UNIQUE_URL_PRODUCTS.forEach(function(productEl) {
    let productUrlCookie = getInfluxDBUrl(productEl);
    (0, import_jquery6.default)(`input#${productEl}-url-field`).val(productUrlCookie);
    (0, import_jquery6.default)(`#${productEl}-url-field`).val(productUrlCookie);
  });
  function togglePrefBtns(el) {
    const preference = el.length ? el.attr("id").replace("pref-", "") : "cloud";
    const prefUrls = (0, import_jquery6.default)("#" + preference + "-urls");
    el.addClass("active");
    el.siblings().removeClass("active");
    prefUrls.addClass("active").removeClass("inactive");
    prefUrls.siblings().addClass("inactive").removeClass("active");
    setURLPreference(preference);
  }
  (0, import_jquery6.default)("#pref-tabs .pref-tab").click(function() {
    togglePrefBtns((0, import_jquery6.default)(this));
  });
  function showPreference() {
    const preference = getPreference("influxdb_url");
    const prefTab = (0, import_jquery6.default)("#pref-" + preference);
    togglePrefBtns(prefTab);
  }
  showPreference();
  function validateUrl(url) {
    const validDomain = new RegExp(
      `([a-z0-9-._~%]+|[[a-f0-9:.]+]|[v[a-f0-9][a-z0-9-._~%!$&'()*+,;=:]+])(:[0-9]+)?`
    );
    if (!IS_UNIQUE_URL_PRODUCT) {
      const validProtocol = /^http(s?)/;
      const protocol2 = url.match(/http(s?):\/\//) ? url.match(/http(s?):\/\//)[0] : "";
      const domain = url.replace(protocol2, "");
      if (validProtocol.test(protocol2) == false) {
        return { valid: false, error: "Invalid protocol, use http[s]" };
      } else if (validDomain.test(domain) == false) {
        return { valid: false, error: "Invalid domain" };
      } else {
        try {
          new URL(url);
          return { valid: true, error: "" };
        } catch (e) {
          if (e instanceof TypeError) {
            return { valid: false, error: "Invalid URL" };
          }
        }
      }
    } else {
      const includesProtocol = /^.*:\/\//;
      const protocol2 = url.match(/^.*:\/\//) ? url.match(/^.*:\/\//)[0] : "";
      const domain = url.replace(protocol2, "");
      if (url.length === 0) {
        return { valid: true, error: "" };
      } else if (includesProtocol.test(protocol2) == true) {
        return { valid: false, error: "Do not include the protocol" };
      } else if (validDomain.test(domain) == false) {
        return { valid: false, error: "Invalid domain" };
      } else {
        return { valid: true, error: "" };
      }
    }
  }
  function showValidationMessage(validation) {
    (0, import_jquery6.default)("#custom-url").addClass("error");
    (0, import_jquery6.default)("#custom-url").attr("data-message", validation.error);
  }
  function hideValidationMessage() {
    (0, import_jquery6.default)("#custom-url").removeClass("error").attr("data-message", "");
  }
  function applyCustomUrl() {
    var custUrl = (0, import_jquery6.default)("#custom-url-field").val();
    let urlValidation = validateUrl(custUrl);
    if (custUrl.length > 0) {
      if (urlValidation.valid) {
        hideValidationMessage();
        storeCustomUrl(custUrl);
        storeUrl(context, custUrl, getUrls()[context]);
        updateUrls(getPrevUrls(), getUrls());
      } else {
        showValidationMessage(urlValidation);
      }
    } else {
      removeCustomUrl();
      hideValidationMessage();
      (0, import_jquery6.default)(
        `input[name="influxdb-${context}-url"][value="` + DEFAULT_STORAGE_URLS[context] + '"]'
      ).trigger("click");
    }
  }
  function applyProductUrl(product2) {
    var productUrl = (0, import_jquery6.default)(`#${product2}-url-field`).val();
    let urlValidation = validateUrl(productUrl);
    if (productUrl.length > 0) {
      if (urlValidation.valid) {
        hideValidationMessage();
        storeProductUrl(product2, productUrl);
        storeUrl(product2, productUrl, getUrls()[product2]);
        updateUrls(getPrevUrls(), getUrls());
      } else {
        showValidationMessage(urlValidation);
      }
    } else {
      removeProductUrl(product2);
      hideValidationMessage();
    }
  }
  (0, import_jquery6.default)("input#custom-url-field").focus(function() {
    (0, import_jquery6.default)('input#custom[type="radio"]').trigger("click");
  });
  (0, import_jquery6.default)("#custom-url").submit(function(e) {
    e.preventDefault();
    let url = (0, import_jquery6.default)("#custom-url-field").val() || "";
    if (["dedicated", "clustered"].includes(context)) {
      url = (0, import_jquery6.default)(`#${context}-url-field`).val() || "";
    }
    const urlValidation = validateUrl(url);
    if (url === "" || urlValidation.valid) {
      if (!["dedicated", "clustered"].includes(context)) {
        applyCustomUrl();
      } else {
        applyProductUrl(context);
      }
      (0, import_jquery6.default)("#modal-close").trigger("click");
    } else {
      showValidationMessage(urlValidation);
    }
  });
  var urlValueElements = [
    "#custom-url-field",
    "#dedicated-url-field",
    "#clustered-url-field"
  ].join();
  (0, import_jquery6.default)(urlValueElements).blur(function() {
    !["dedicated", "clustered"].includes(context) ? applyCustomUrl() : applyProductUrl(context);
  });
  function handleUrlValidation() {
    let url = (0, import_jquery6.default)(urlValueElements).val();
    let urlValidation = validateUrl(url);
    if (urlValidation.valid) {
      hideValidationMessage();
    } else {
      showValidationMessage(urlValidation);
    }
  }
  (0, import_jquery6.default)(document).on("keyup", urlValueElements, delay(handleUrlValidation, 500));
  var customUrlOnLoad = getInfluxDBUrl("custom");
  if (customUrlOnLoad != "") {
    (0, import_jquery6.default)("input#custom").val(customUrlOnLoad);
    (0, import_jquery6.default)("#custom-url-field").val(customUrlOnLoad);
  }
  var productsWithUniqueURLs = ["dedicated", "clustered"];
  productsWithUniqueURLs.forEach(function(productEl) {
    const productUrlCookie = getInfluxDBUrl(productEl);
    (0, import_jquery6.default)(`input#${productEl}-url-field`).val(productUrlCookie);
    (0, import_jquery6.default)(`#${productEl}-url-field`).val(productUrlCookie);
  });
  if (CLOUD_URLS.includes(referrerHost)) {
    storeUrl("cloud", referrerHost, getUrls().cloud);
    updateUrls(getPrevUrls(), getUrls());
    setRadioButtons();
    setURLPreference("cloud");
    showPreference();
  }
}

// ns-hugo-imp:/home/runner/work/docs-v2/docs-v2/assets/js/notifications.js
var import_jquery7 = __toESM(require_jquery());
function notificationID(el) {
  return (0, import_jquery7.default)(el).attr("id");
}
function showNotifications() {
  (0, import_jquery7.default)("#docs-notifications > .notification").each(function() {
    function inScope(path2, scope2) {
      for (let i = 0; i < scope2.length; i++) {
        if (path2.includes(scope2[i])) {
          return true;
        }
      }
      return false;
    }
    function excludePage(path2, exclude2) {
      if (exclude2[0].length > 0) {
        for (let i = 0; i < exclude2.length; i++) {
          if (path2.includes(exclude2[i])) {
            return true;
          }
        }
      }
      return false;
    }
    var scope = (0, import_jquery7.default)(this).data("scope").split(",");
    var exclude = (0, import_jquery7.default)(this).data("exclude").split(",");
    var pageInScope = inScope(window.location.pathname, scope);
    var pageExcluded = excludePage(window.location.pathname, exclude);
    var notificationRead = window.LocalStorageAPI.notificationIsRead(
      notificationID(this),
      "message"
    );
    if (pageInScope && !pageExcluded && !notificationRead) {
      (0, import_jquery7.default)(this).show().animate({ right: 0, opacity: 1 }, 200, "swing");
    }
  });
}
function hideNotification(el) {
  (0, import_jquery7.default)(el).closest(".notification").animate({ height: 0, opacity: 0 }, 200, "swing", function() {
    (0, import_jquery7.default)(this).hide();
    window.LocalStorageAPI.setNotificationAsRead(
      notificationID(this),
      "message"
    );
  });
}
function initialize7() {
  showNotifications();
  (0, import_jquery7.default)(".close-notification").click(function(e) {
    e.preventDefault();
    hideNotification(this);
  });
  (0, import_jquery7.default)(".notification .show").click(function() {
    (0, import_jquery7.default)(this).closest(".notification").toggleClass("min");
  });
  const notificationsInitialPosition = parseInt(
    (0, import_jquery7.default)("#docs-notifications").css("top"),
    10
  );
  (0, import_jquery7.default)(window).scroll(function() {
    var notificationPosition = notificationsInitialPosition - scrollY > 10 ? notificationsInitialPosition - scrollY : 10;
    (0, import_jquery7.default)("#docs-notifications").css("top", notificationPosition);
  });
}

// ns-hugo-imp:/home/runner/work/docs-v2/docs-v2/assets/js/page-feedback.js
var import_jquery8 = __toESM(require_jquery());
function submitLifeCycle() {
  (0, import_jquery8.default)(".helpful .loader-wrapper").fadeIn(200);
  (0, import_jquery8.default)(".helpful #thank-you").delay(800).fadeIn(200);
  (0, import_jquery8.default)(".helpful .loader-wrapper").delay(1e3).hide(0);
}
function initialize8() {
  (0, import_jquery8.default)("#pagefeedback input[type=radio]").change(function() {
    (0, import_jquery8.default)("form#pagefeedback").submit();
    submitLifeCycle();
  });
  (0, import_jquery8.default)("#pagefeedback #not-helpful input[type=radio]").click(function() {
    setTimeout(function() {
      toggleModal("#page-feedback");
    }, 400);
  });
  (0, import_jquery8.default)(".modal #no-thanks").click(function() {
    toggleModal();
  });
}

// ns-hugo-imp:/home/runner/work/docs-v2/docs-v2/assets/js/v3-wayfinding.js
var cloudUrls = CLOUD_URLS || [];
var referrerWhitelist = cloudUrls.concat(host);
var wayfindingPrefCookie = "v3_wayfinding_show";
function toggleWayfinding() {
  var wayfindingModal = document.getElementById("v3-wayfinding-modal");
  wayfindingModal.classList.toggle("open");
}
function toggleWayfindingPreference() {
  if (getPreference(wayfindingPrefCookie) === true) {
    setPreference(wayfindingPrefCookie, false);
  } else {
    setPreference(wayfindingPrefCookie, true);
  }
}
function slideDown(elem) {
  elem.style.height = `${elem.scrollHeight}px`;
  elem.style.opacity = 1;
}
function slideUp(elem) {
  elem.style.height = 0;
  elem.style.opacity = 0;
}
function shouldOpenWayfinding() {
  const isExternalReferrer = !referrerWhitelist.includes(referrerHost);
  const preferToShow = getPreference(wayfindingPrefCookie);
  return isExternalReferrer && preferToShow;
}
function setWayfindingInputState() {
  const preferToShow = getPreference(wayfindingPrefCookie);
  const wayfindingOptOutInput = document.getElementById(
    "v3-wayfinding-opt-out-input"
  );
  if (preferToShow === false) {
    wayfindingOptOutInput.checked = true;
  }
}
function submitWayfindingData(engine, action) {
  const lp = `ioxwayfinding,host=${hostname},path=${path},referrer=${referrer},engine=${engine} action="${action}"`;
  const xhr = new XMLHttpRequest();
  xhr.open(
    "POST",
    "https://j32dswat7l.execute-api.us-east-1.amazonaws.com/prod/wayfinding"
  );
  xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
  xhr.setRequestHeader("Access-Control-Allow-Origin", `${protocol}//${host}`);
  xhr.setRequestHeader("Content-Type", "text/plain; charset=utf-8");
  xhr.setRequestHeader("Accept", "application/json");
  xhr.send(lp);
  return false;
}
function initialize9() {
  const wayfindingVersions = ["serverless", "cloud"];
  if (!wayfindingVersions.includes(context)) {
    return;
  }
  var wayfindingStay = document.getElementById("v3-wayfinding-stay");
  wayfindingStay.onclick = function(event) {
    var engine = wayfindingStay.dataset.engine;
    var action = "stay";
    event.preventDefault();
    submitWayfindingData(engine, action);
    toggleWayfinding();
  };
  var wayfindingSwitch = document.getElementById("v3-wayfinding-switch");
  wayfindingSwitch.onclick = function() {
    var engine = wayfindingSwitch.dataset.engine;
    var action = "switch";
    submitWayfindingData(engine, action);
  };
  var wayfindingClose = document.getElementById("v3-wayfinding-close");
  wayfindingClose.onclick = function() {
    toggleWayfinding();
  };
  var wayfindingOptOut = document.getElementById("v3-wayfinding-opt-out");
  wayfindingOptOut.onclick = function() {
    toggleWayfindingPreference();
  };
  var wayfindingFindOutToggle = document.getElementById("find-out-toggle");
  wayfindingFindOutToggle.onclick = function(event) {
    event.preventDefault();
    var wayfindingFindOutInstructions = document.getElementById(
      "find-out-instructions"
    );
    if (wayfindingFindOutInstructions.classList.contains("open")) {
      slideUp(wayfindingFindOutInstructions);
      wayfindingFindOutInstructions.classList.remove("open");
    } else {
      slideDown(wayfindingFindOutInstructions);
      wayfindingFindOutInstructions.classList.add("open");
    }
  };
  setWayfindingInputState();
  if (shouldOpenWayfinding()) {
    toggleWayfinding();
  }
}

// ns-hugo-imp:/home/runner/work/docs-v2/docs-v2/assets/js/tc-downloads.js
var STORAGE_KEY = "influxdata_docs_tc_dl";
var QUERY_PARAM = "ref";
var QUERY_VALUE = "tc";
function setDownloadKey() {
  localStorage.setItem(STORAGE_KEY, "true");
}
function hasDownloadKey() {
  return localStorage.getItem(STORAGE_KEY) === "true";
}
function hasRefParam() {
  const params = new URLSearchParams(window.location.search);
  if (params.get(QUERY_PARAM) === QUERY_VALUE) return true;
  const hash = window.location.hash;
  const qIndex = hash.indexOf("?");
  if (qIndex !== -1) {
    const hashParams = new URLSearchParams(hash.substring(qIndex));
    if (hashParams.get(QUERY_PARAM) === QUERY_VALUE) return true;
  }
  return false;
}
function stripRefParam() {
  const url = new URL(window.location.href);
  url.searchParams.delete(QUERY_PARAM);
  let hash = url.hash;
  const qIndex = hash.indexOf("?");
  if (qIndex !== -1) {
    const hashBase = hash.substring(0, qIndex);
    const hashParams = new URLSearchParams(hash.substring(qIndex));
    hashParams.delete(QUERY_PARAM);
    const remaining = hashParams.toString();
    hash = remaining ? `${hashBase}?${remaining}` : hashBase;
  }
  window.history.replaceState({}, "", url.pathname + url.search + hash);
}
function renderDownloadLinks(container, data2) {
  const version2 = data2.version;
  const platforms = data2.platforms;
  let html = '<div class="tc-downloads-container">';
  platforms.forEach((platform) => {
    html += `<h3>${platform.name}</h3>`;
    html += `<p class="tc-version"><em>Telegraf Controller v${version2}</em></p>`;
    html += '<div class="tc-build-table">';
    platform.builds.forEach((build) => {
      const link = `<a href="${build.url}" class="btn tc-download-link download" download>${platform.name} (${build.arch})</a>`;
      const sha = `<code>sha256:${build.sha256}</code><button class="tc-copy-sha" data-sha="${build.sha256}">&#59693;</button>`;
      html += `<div class="tc-build-row"><div class="tc-build-download">${link}</div><div class="tc-build-sha">${sha}</div></div>`;
    });
    html += "</div>";
  });
  container.innerHTML = html;
}
function copyToClipboard(sha, button) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(sha).then(() => {
      showCopiedFeedback(button);
    });
  } else {
    const textArea = document.createElement("textarea");
    textArea.value = sha;
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    showCopiedFeedback(button);
  }
}
function showCopiedFeedback(button) {
  const original = button.innerHTML;
  button.innerHTML = "&#59671;";
  setTimeout(() => {
    button.innerHTML = original;
  }, 2e3);
}
function initMarketoForm() {
  if (typeof MktoForms2 === "undefined") {
    console.error("tc-downloads: MktoForms2 not loaded");
    return;
  }
  MktoForms2.loadForm(
    "https://get.influxdata.com",
    "972-GDU-533",
    2756,
    function(form) {
      form.addHiddenFields({ mkto_content_name: "Telegraf Enterprise" });
      form.onSuccess(function() {
        setDownloadKey();
        toggleModal();
        const url = new URL(window.location.href);
        url.searchParams.set(QUERY_PARAM, QUERY_VALUE);
        window.location.href = url.toString();
        return false;
      });
    }
  );
}
function showDownloads(area) {
  const btn = area.querySelector("#tc-download-btn");
  const linksContainer = area.querySelector("#tc-downloads-links");
  if (!linksContainer) return;
  const rawData = linksContainer.getAttribute("data-downloads");
  if (!rawData) return;
  let data2;
  try {
    data2 = JSON.parse(atob(rawData));
  } catch (e) {
    console.error("tc-downloads: failed to parse download data", e);
    return;
  }
  if (btn) btn.style.display = "none";
  renderDownloadLinks(linksContainer, data2);
  linksContainer.style.display = "block";
}
function initialize10() {
  if (hasRefParam()) {
    setDownloadKey();
    stripRefParam();
  }
  const area = document.getElementById("tc-downloads-area");
  if (!area) return;
  if (hasDownloadKey()) {
    showDownloads(area);
  }
  initMarketoForm();
  area.addEventListener("click", function(e) {
    const copyBtn = e.target.closest(".tc-copy-sha");
    if (copyBtn) {
      const sha = copyBtn.getAttribute("data-sha");
      if (sha) copyToClipboard(sha, copyBtn);
    }
  });
}

// ns-hugo-imp:/home/runner/work/docs-v2/docs-v2/assets/js/ask-ai.ts
(function() {
  const k = window.Kapa;
  if (!k) {
    const i = function(...args) {
      if (i.c) {
        i.c(args);
      }
    };
    i.q = [];
    i.c = function(args) {
      if (i.q) {
        i.q.push(args);
      }
    };
    window.Kapa = i;
  }
})();
function setUser(userid, email) {
  const NAMESPACE = "kapaSettings";
  window[NAMESPACE] = {
    user: {
      uniqueClientId: userid,
      ...email && { email }
    }
  };
}
function initializeChat({
  onChatLoad,
  chatAttributes
}) {
  const requiredAttributes = {
    websiteId: "a02bca75-1dd3-411e-95c0-79ee1139be4d",
    projectName: "InfluxDB",
    projectColor: "#020a47",
    projectLogo: "/img/influx-logo-cubo-white.png"
  };
  const optionalAttributes = {
    modalDisclaimer: chatAttributes.modalDisclaimer || "This AI can access [documentation for InfluxDB, clients, and related tools](https://docs.influxdata.com). Information you submit is used in accordance with our [Privacy Policy](https://www.influxdata.com/legal/privacy-policy/).",
    modalExampleQuestions: "Use Python to write data to InfluxDB 3,How do I query using SQL?,How do I use MQTT with Telegraf?",
    buttonHide: "true",
    exampleQuestionButtonWidth: "auto",
    modalOpenOnCommandK: "true",
    modalExampleQuestionsColSpan: "8",
    modalFullScreenOnMobile: "true",
    modalHeaderPadding: ".5rem",
    modalInnerPositionRight: "0",
    modalInnerPositionLeft: "",
    modalLockScroll: "false",
    modalOverrideOpenClassAskAi: "ask-ai-open",
    modalSize: "640px",
    modalWithOverlay: "false",
    modalYOffset: "10vh",
    userAnalyticsFingerprintEnabled: "true",
    fontFamily: "Proxima Nova, sans-serif",
    modalHeaderBgColor: "linear-gradient(90deg, #d30971 0%, #9b2aff 100%)",
    modalHeaderBorderBottom: "none",
    modalTitleColor: "#fff",
    modalTitleFontSize: "1.25rem",
    // MCP server integration - enables "Use MCP" dropdown in widget header
    // See: https://docs.kapa.ai/integrations/website-widget/configuration#mcp-install-menu
    mcpEnabled: "true",
    mcpServerUrl: "https://influxdb-docs.mcp.kapa.ai"
  };
  const scriptUrl = "https://widget.kapa.ai/kapa-widget.bundle.js";
  const script = document.createElement("script");
  script.async = true;
  script.src = scriptUrl;
  script.onload = function() {
    onChatLoad();
    window.influxdatadocs.AskAI = AskAI;
  };
  script.onerror = function() {
    console.error("Error loading AI chat widget script");
  };
  const dataset = {
    ...requiredAttributes,
    ...optionalAttributes,
    ...chatAttributes
  };
  Object.keys(dataset).forEach((key) => {
    const value = dataset[key];
    if (value !== void 0) {
      script.dataset[key] = value;
    }
  });
  const oldScript = document.querySelector(`script[src="${scriptUrl}"]`);
  if (oldScript) {
    oldScript.remove();
  }
  document.head.appendChild(script);
}
function getVersionSpecificConfig(configKey) {
  if (version && version !== "n/a") {
    const versionKey = `${configKey}__v${version}`;
    const product3 = productData?.product;
    if (product3 && typeof product3 === "object" && !Array.isArray(product3)) {
      const versionConfig = product3[versionKey];
      if (versionConfig) {
        return versionConfig;
      }
    }
  }
  const product2 = productData?.product;
  if (product2 && typeof product2 === "object" && !Array.isArray(product2)) {
    return product2[configKey];
  }
  return void 0;
}
function getProductExampleQuestions() {
  const questions = getVersionSpecificConfig("ai_sample_questions");
  if (!questions || questions.length === 0) {
    return "";
  }
  return questions.join(",");
}
function getProductSourceGroupIds() {
  const sourceGroupIds = getVersionSpecificConfig("ai_source_group_ids");
  return sourceGroupIds || "";
}
function getProductInputPlaceholder() {
  const placeholder = getVersionSpecificConfig("ai_input_placeholder");
  return placeholder || "Ask questions about InfluxDB. Specify your product and version for better results";
}
function getProductDisclaimer() {
  const customNote = getVersionSpecificConfig("ai_disclaimer_note");
  const noteContent = customNote ? `${customNote}

` : "";
  const baseDisclaimer = "This AI can access [documentation for InfluxDB, clients, and related tools](https://docs.influxdata.com). Information you submit is used in accordance with our [Privacy Policy](https://www.influxdata.com/legal/privacy-policy/).";
  return `${noteContent}${baseDisclaimer}`;
}
function AskAI({
  userid,
  email,
  onChatLoad,
  ...chatParams
}) {
  const modalExampleQuestions = getProductExampleQuestions();
  const modalAskAiInputPlaceholder = getProductInputPlaceholder();
  const modalDisclaimer = getProductDisclaimer();
  const sourceGroupIds = getProductSourceGroupIds();
  const chatAttributes = {
    ...modalExampleQuestions && { modalExampleQuestions },
    ...modalAskAiInputPlaceholder && { modalAskAiInputPlaceholder },
    ...modalDisclaimer && { modalDisclaimer },
    ...sourceGroupIds && { sourceGroupIdsInclude: sourceGroupIds },
    ...chatParams
  };
  const wrappedOnChatLoad = () => {
    if (onChatLoad) {
      onChatLoad();
    }
  };
  initializeChat({ onChatLoad: wrappedOnChatLoad, chatAttributes });
  if (userid) {
    setUser(userid, email);
  }
}

// ns-hugo-imp:/home/runner/work/docs-v2/docs-v2/assets/js/ask-ai-trigger.js
var state = {
  kapaInitialized: false,
  linksListenerInitialized: false
};
function initializeKapa() {
  if (!state.kapaInitialized) {
    AskAI();
    state.kapaInitialized = true;
    window.influxdatadocs = window.influxdatadocs || {};
    window.influxdatadocs.kapaInitialized = true;
  }
}
function showTrigger(element) {
  if (element) {
    element.removeAttribute("style");
  }
}
function AskAITrigger({ component }) {
  const kapaContainer = document.querySelector("#kapa-widget-container");
  if (!component && !kapaContainer) {
    return;
  }
  if (!kapaContainer) {
    AskAI({ onChatLoad: () => showTrigger(component) });
    state.kapaInitialized = true;
    window.influxdatadocs = window.influxdatadocs || {};
    window.influxdatadocs.kapaInitialized = true;
  } else {
    showTrigger(component);
  }
}
function handleAskAILinks() {
  if (state.linksListenerInitialized) {
    return;
  }
  state.linksListenerInitialized = true;
  window.influxdatadocs = window.influxdatadocs || {};
  window.influxdatadocs.askAILinksInitialized = true;
  document.addEventListener(
    "click",
    (event) => {
      const link = event.target.closest(".ask-ai-open");
      if (!link) return;
      const query = link.getAttribute("data-query");
      const sourceGroupIds = link.getAttribute("data-source-group-ids");
      if (!state.kapaInitialized) {
        initializeKapa();
        if (query && window.Kapa?.open) {
          setTimeout(() => {
            if (window.Kapa?.open) {
              const openOptions = {
                mode: "ai",
                query
              };
              if (sourceGroupIds) {
                openOptions.sourceGroupIdsInclude = sourceGroupIds;
              }
              window.Kapa.open(openOptions);
            }
          }, 100);
        }
      } else {
        if (query && window.Kapa?.open) {
          const openOptions = {
            mode: "ai",
            query
          };
          if (sourceGroupIds) {
            openOptions.sourceGroupIdsInclude = sourceGroupIds;
          }
          window.Kapa.open(openOptions);
        }
      }
    },
    { passive: true }
  );
}
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", handleAskAILinks);
} else {
  handleAskAILinks();
}

// ns-hugo-imp:/home/runner/work/docs-v2/docs-v2/assets/js/code-placeholders.js
var import_jquery9 = __toESM(require_jquery());
var placeholderElement = "var.code-placeholder";
var editIcon = "<span class='code-placeholder-edit-icon cf-icon Pencil'></span>";
function handleClick($element) {
  const $placeholder = (0, import_jquery9.default)($element).find(placeholderElement);
  $placeholder.on("click", function() {
    var placeholderData = (0, import_jquery9.default)(this)[0].dataset;
    var placeholderID = placeholderData.codeVarEscaped;
    var placeholderValue = placeholderData.codeVarValue;
    const placeholderInput = document.createElement("input");
    placeholderInput.setAttribute("class", "placeholder-edit");
    placeholderInput.setAttribute("data-id", placeholderID);
    placeholderInput.setAttribute("data-code-var-escaped", placeholderID);
    placeholderInput.setAttribute("value", placeholderValue);
    placeholderInput.setAttribute("spellcheck", "false");
    placeholderInput.addEventListener(
      "blur",
      function() {
        submitPlaceholder((0, import_jquery9.default)(this));
      }
    );
    placeholderInput.addEventListener(
      "input",
      function() {
        updateInputWidth((0, import_jquery9.default)(this));
      }
    );
    placeholderInput.addEventListener(
      "keydown",
      function(event) {
        closeOnEnter((0, import_jquery9.default)(this)[0], event);
      }
    );
    const placeholderInputWrapper = (0, import_jquery9.default)('<div class="code-input-wrapper"></div>');
    $placeholder.before(placeholderInputWrapper);
    $placeholder.siblings(".code-input-wrapper").append(placeholderInput);
    (0, import_jquery9.default)(`input[data-code-var-escaped="${placeholderID}"]`).width(`${placeholderValue.length}ch`);
    document.querySelector(`input[data-code-var-escaped="${placeholderID}"]`).focus();
    document.querySelector(`input[data-code-var-escaped="${placeholderID}"]`).select();
    $placeholder.css("opacity", 0);
  });
}
function submitPlaceholder(placeholderInput) {
  var placeholderID = placeholderInput.attr("data-code-var-escaped");
  var placeholderValue = placeholderInput[0].value;
  placeholderInput = (0, import_jquery9.default)(`input.placeholder-edit[data-id="${placeholderID}"]`);
  (0, import_jquery9.default)(`*[data-code-var="${placeholderID}"]`).each(function() {
    (0, import_jquery9.default)(this).attr("data-code-var-value", placeholderValue);
    (0, import_jquery9.default)(this).html(placeholderValue + editIcon);
    (0, import_jquery9.default)(this).css("opacity", 1);
  });
  placeholderInput.parent().remove();
}
function updateInputWidth(placeholderInput) {
  var placeholderLength = placeholderInput[0].value.length;
  placeholderInput.width(`${placeholderLength}ch`);
}
function closeOnEnter(input, event) {
  if (event.which == 13) {
    input.blur();
  }
}
function CodePlaceholder({ component }) {
  const $component = (0, import_jquery9.default)(component);
  handleClick($component);
}

// ns-hugo-imp:/home/runner/work/docs-v2/docs-v2/assets/js/custom-timestamps.js
var import_jquery10 = __toESM(require_jquery());

// ns-hugo-imp:/home/runner/work/docs-v2/docs-v2/node_modules/vanillajs-datepicker/js/lib/utils.js
function lastItemOf(arr) {
  return arr[arr.length - 1];
}
function pushUnique(arr, ...items) {
  items.forEach((item) => {
    if (arr.includes(item)) {
      return;
    }
    arr.push(item);
  });
  return arr;
}
function stringToArray(str, separator) {
  return str ? str.split(separator) : [];
}
function isInRange(testVal, min, max) {
  const minOK = min === void 0 || testVal >= min;
  const maxOK = max === void 0 || testVal <= max;
  return minOK && maxOK;
}
function limitToRange(val, min, max) {
  if (val < min) {
    return min;
  }
  if (val > max) {
    return max;
  }
  return val;
}
function createTagRepeat(tagName, repeat, attributes = {}, index = 0, html = "") {
  const openTagSrc = Object.keys(attributes).reduce((src, attr) => {
    let val = attributes[attr];
    if (typeof val === "function") {
      val = val(index);
    }
    return `${src} ${attr}="${val}"`;
  }, tagName);
  html += `<${openTagSrc}></${tagName}>`;
  const next = index + 1;
  return next < repeat ? createTagRepeat(tagName, repeat, attributes, next, html) : html;
}
function optimizeTemplateHTML(html) {
  return html.replace(/>\s+/g, ">").replace(/\s+</, "<");
}

// ns-hugo-imp:/home/runner/work/docs-v2/docs-v2/node_modules/vanillajs-datepicker/js/lib/date.js
function stripTime(timeValue) {
  return new Date(timeValue).setHours(0, 0, 0, 0);
}
function today() {
  return (/* @__PURE__ */ new Date()).setHours(0, 0, 0, 0);
}
function dateValue(...args) {
  switch (args.length) {
    case 0:
      return today();
    case 1:
      return stripTime(args[0]);
  }
  const newDate = /* @__PURE__ */ new Date(0);
  newDate.setFullYear(...args);
  return newDate.setHours(0, 0, 0, 0);
}
function addDays(date2, amount) {
  const newDate = new Date(date2);
  return newDate.setDate(newDate.getDate() + amount);
}
function addWeeks(date2, amount) {
  return addDays(date2, amount * 7);
}
function addMonths(date2, amount) {
  const newDate = new Date(date2);
  const monthsToSet = newDate.getMonth() + amount;
  let expectedMonth = monthsToSet % 12;
  if (expectedMonth < 0) {
    expectedMonth += 12;
  }
  const time = newDate.setMonth(monthsToSet);
  return newDate.getMonth() !== expectedMonth ? newDate.setDate(0) : time;
}
function addYears(date2, amount) {
  const newDate = new Date(date2);
  const expectedMonth = newDate.getMonth();
  const time = newDate.setFullYear(newDate.getFullYear() + amount);
  return expectedMonth === 1 && newDate.getMonth() === 2 ? newDate.setDate(0) : time;
}
function dayDiff(day, from) {
  return (day - from + 7) % 7;
}
function dayOfTheWeekOf(baseDate, dayOfWeek, weekStart = 0) {
  const baseDay = new Date(baseDate).getDay();
  return addDays(baseDate, dayDiff(dayOfWeek, weekStart) - dayDiff(baseDay, weekStart));
}
function calcWeekNum(dayOfTheWeek, sameDayOfFirstWeek) {
  return Math.round((dayOfTheWeek - sameDayOfFirstWeek) / 6048e5) + 1;
}
function getIsoWeek(date2) {
  const thuOfTheWeek = dayOfTheWeekOf(date2, 4, 1);
  const firstThu = dayOfTheWeekOf(new Date(thuOfTheWeek).setMonth(0, 4), 4, 1);
  return calcWeekNum(thuOfTheWeek, firstThu);
}
function calcTraditionalWeekNumber(date2, weekStart) {
  const startOfFirstWeek = dayOfTheWeekOf(new Date(date2).setMonth(0, 1), weekStart, weekStart);
  const startOfTheWeek = dayOfTheWeekOf(date2, weekStart, weekStart);
  const weekNum = calcWeekNum(startOfTheWeek, startOfFirstWeek);
  if (weekNum < 53) {
    return weekNum;
  }
  const weekOneOfNextYear = dayOfTheWeekOf(new Date(date2).setDate(32), weekStart, weekStart);
  return startOfTheWeek === weekOneOfNextYear ? 1 : weekNum;
}
function getWesternTradWeek(date2) {
  return calcTraditionalWeekNumber(date2, 0);
}
function getMidEasternWeek(date2) {
  return calcTraditionalWeekNumber(date2, 6);
}
function startOfYearPeriod(date2, years) {
  const year = new Date(date2).getFullYear();
  return Math.floor(year / years) * years;
}
function regularizeDate(date2, timeSpan, useLastDate) {
  if (timeSpan !== 1 && timeSpan !== 2) {
    return date2;
  }
  const newDate = new Date(date2);
  if (timeSpan === 1) {
    useLastDate ? newDate.setMonth(newDate.getMonth() + 1, 0) : newDate.setDate(1);
  } else {
    useLastDate ? newDate.setFullYear(newDate.getFullYear() + 1, 0, 0) : newDate.setMonth(0, 1);
  }
  return newDate.setHours(0, 0, 0, 0);
}

// ns-hugo-imp:/home/runner/work/docs-v2/docs-v2/node_modules/vanillajs-datepicker/js/lib/date-format.js
var reFormatTokens = /dd?|DD?|mm?|MM?|yy?(?:yy)?/;
var reNonDateParts = /[\s!-/:-@[-`{-~年月日]+/;
var knownFormats = {};
var parseFns = {
  y(date2, year) {
    return new Date(date2).setFullYear(parseInt(year, 10));
  },
  m(date2, month, locale) {
    const newDate = new Date(date2);
    let monthIndex = parseInt(month, 10) - 1;
    if (isNaN(monthIndex)) {
      if (!month) {
        return NaN;
      }
      const monthName = month.toLowerCase();
      const compareNames = (name) => name.toLowerCase().startsWith(monthName);
      monthIndex = locale.monthsShort.findIndex(compareNames);
      if (monthIndex < 0) {
        monthIndex = locale.months.findIndex(compareNames);
      }
      if (monthIndex < 0) {
        return NaN;
      }
    }
    newDate.setMonth(monthIndex);
    return newDate.getMonth() !== normalizeMonth(monthIndex) ? newDate.setDate(0) : newDate.getTime();
  },
  d(date2, day) {
    return new Date(date2).setDate(parseInt(day, 10));
  }
};
var formatFns = {
  d(date2) {
    return date2.getDate();
  },
  dd(date2) {
    return padZero(date2.getDate(), 2);
  },
  D(date2, locale) {
    return locale.daysShort[date2.getDay()];
  },
  DD(date2, locale) {
    return locale.days[date2.getDay()];
  },
  m(date2) {
    return date2.getMonth() + 1;
  },
  mm(date2) {
    return padZero(date2.getMonth() + 1, 2);
  },
  M(date2, locale) {
    return locale.monthsShort[date2.getMonth()];
  },
  MM(date2, locale) {
    return locale.months[date2.getMonth()];
  },
  y(date2) {
    return date2.getFullYear();
  },
  yy(date2) {
    return padZero(date2.getFullYear(), 2).slice(-2);
  },
  yyyy(date2) {
    return padZero(date2.getFullYear(), 4);
  }
};
function normalizeMonth(monthIndex) {
  return monthIndex > -1 ? monthIndex % 12 : normalizeMonth(monthIndex + 12);
}
function padZero(num, length) {
  return num.toString().padStart(length, "0");
}
function parseFormatString(format) {
  if (typeof format !== "string") {
    throw new Error("Invalid date format.");
  }
  if (format in knownFormats) {
    return knownFormats[format];
  }
  const separators = format.split(reFormatTokens);
  const parts = format.match(new RegExp(reFormatTokens, "g"));
  if (separators.length === 0 || !parts) {
    throw new Error("Invalid date format.");
  }
  const partFormatters = parts.map((token) => formatFns[token]);
  const partParserKeys = Object.keys(parseFns).reduce((keys, key) => {
    const token = parts.find((part) => part[0] !== "D" && part[0].toLowerCase() === key);
    if (token) {
      keys.push(key);
    }
    return keys;
  }, []);
  return knownFormats[format] = {
    parser(dateStr, locale) {
      const dateParts = dateStr.split(reNonDateParts).reduce((dtParts, part, index) => {
        if (part.length > 0 && parts[index]) {
          const token = parts[index][0];
          if (token === "M") {
            dtParts.m = part;
          } else if (token !== "D") {
            dtParts[token] = part;
          }
        }
        return dtParts;
      }, {});
      return partParserKeys.reduce((origDate, key) => {
        const newDate = parseFns[key](origDate, dateParts[key], locale);
        return isNaN(newDate) ? origDate : newDate;
      }, today());
    },
    formatter(date2, locale) {
      let dateStr = partFormatters.reduce((str, fn, index) => {
        return str += `${separators[index]}${fn(date2, locale)}`;
      }, "");
      return dateStr += lastItemOf(separators);
    }
  };
}
function parseDate(dateStr, format, locale) {
  if (dateStr instanceof Date || typeof dateStr === "number") {
    const date2 = stripTime(dateStr);
    return isNaN(date2) ? void 0 : date2;
  }
  if (!dateStr) {
    return void 0;
  }
  if (dateStr === "today") {
    return today();
  }
  if (format && format.toValue) {
    const date2 = format.toValue(dateStr, format, locale);
    return isNaN(date2) ? void 0 : stripTime(date2);
  }
  return parseFormatString(format).parser(dateStr, locale);
}
function formatDate(date2, format, locale) {
  if (isNaN(date2) || !date2 && date2 !== 0) {
    return "";
  }
  const dateObj = typeof date2 === "number" ? new Date(date2) : date2;
  if (format.toDisplay) {
    return format.toDisplay(dateObj, format, locale);
  }
  return parseFormatString(format).formatter(dateObj, locale);
}

// ns-hugo-imp:/home/runner/work/docs-v2/docs-v2/node_modules/vanillajs-datepicker/js/lib/dom.js
var range = document.createRange();
function parseHTML(html) {
  return range.createContextualFragment(html);
}
function getParent(el) {
  return el.parentElement || (el.parentNode instanceof ShadowRoot ? el.parentNode.host : void 0);
}
function isActiveElement(el) {
  return el.getRootNode().activeElement === el;
}
function hideElement(el) {
  if (el.style.display === "none") {
    return;
  }
  if (el.style.display) {
    el.dataset.styleDisplay = el.style.display;
  }
  el.style.display = "none";
}
function showElement(el) {
  if (el.style.display !== "none") {
    return;
  }
  if (el.dataset.styleDisplay) {
    el.style.display = el.dataset.styleDisplay;
    delete el.dataset.styleDisplay;
  } else {
    el.style.display = "";
  }
}
function emptyChildNodes(el) {
  if (el.firstChild) {
    el.removeChild(el.firstChild);
    emptyChildNodes(el);
  }
}
function replaceChildNodes(el, newChildNodes) {
  emptyChildNodes(el);
  if (newChildNodes instanceof DocumentFragment) {
    el.appendChild(newChildNodes);
  } else if (typeof newChildNodes === "string") {
    el.appendChild(parseHTML(newChildNodes));
  } else if (typeof newChildNodes.forEach === "function") {
    newChildNodes.forEach((node) => {
      el.appendChild(node);
    });
  }
}

// ns-hugo-imp:/home/runner/work/docs-v2/docs-v2/node_modules/vanillajs-datepicker/js/lib/event.js
var listenerRegistry = /* @__PURE__ */ new WeakMap();
var { addEventListener, removeEventListener } = EventTarget.prototype;
function registerListeners(keyObj, listeners) {
  let registered = listenerRegistry.get(keyObj);
  if (!registered) {
    registered = [];
    listenerRegistry.set(keyObj, registered);
  }
  listeners.forEach((listener) => {
    addEventListener.call(...listener);
    registered.push(listener);
  });
}
function unregisterListeners(keyObj) {
  let listeners = listenerRegistry.get(keyObj);
  if (!listeners) {
    return;
  }
  listeners.forEach((listener) => {
    removeEventListener.call(...listener);
  });
  listenerRegistry.delete(keyObj);
}
if (!Event.prototype.composedPath) {
  const getComposedPath = (node, path2 = []) => {
    path2.push(node);
    let parent;
    if (node.parentNode) {
      parent = node.parentNode;
    } else if (node.host) {
      parent = node.host;
    } else if (node.defaultView) {
      parent = node.defaultView;
    }
    return parent ? getComposedPath(parent, path2) : path2;
  };
  Event.prototype.composedPath = function() {
    return getComposedPath(this.target);
  };
}
function findFromPath(path2, criteria, currentTarget) {
  const [node, ...rest] = path2;
  if (criteria(node)) {
    return node;
  }
  if (node === currentTarget || node.tagName === "HTML" || rest.length === 0) {
    return;
  }
  return findFromPath(rest, criteria, currentTarget);
}
function findElementInEventPath(ev, selector) {
  const criteria = typeof selector === "function" ? selector : (el) => el instanceof Element && el.matches(selector);
  return findFromPath(ev.composedPath(), criteria, ev.currentTarget);
}

// ns-hugo-imp:/home/runner/work/docs-v2/docs-v2/node_modules/vanillajs-datepicker/js/i18n/base-locales.js
var base_locales_default = {
  en: {
    days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    today: "Today",
    clear: "Clear",
    titleFormat: "MM y"
  }
};

// ns-hugo-imp:/home/runner/work/docs-v2/docs-v2/node_modules/vanillajs-datepicker/js/options/defaultOptions.js
var defaultOptions_default = {
  autohide: false,
  beforeShowDay: null,
  beforeShowDecade: null,
  beforeShowMonth: null,
  beforeShowYear: null,
  clearButton: false,
  dateDelimiter: ",",
  datesDisabled: [],
  daysOfWeekDisabled: [],
  daysOfWeekHighlighted: [],
  defaultViewDate: void 0,
  // placeholder, defaults to today() by the program
  disableTouchKeyboard: false,
  enableOnReadonly: true,
  format: "mm/dd/yyyy",
  language: "en",
  maxDate: null,
  maxNumberOfDates: 1,
  maxView: 3,
  minDate: null,
  nextArrow: "\xBB",
  orientation: "auto",
  pickLevel: 0,
  prevArrow: "\xAB",
  showDaysOfWeek: true,
  showOnClick: true,
  showOnFocus: true,
  startView: 0,
  title: "",
  todayButton: false,
  todayButtonMode: 0,
  todayHighlight: false,
  updateOnBlur: true,
  weekNumbers: 0,
  weekStart: 0
};

// ns-hugo-imp:/home/runner/work/docs-v2/docs-v2/node_modules/vanillajs-datepicker/js/options/processOptions.js
var {
  language: defaultLang,
  format: defaultFormat,
  weekStart: defaultWeekStart
} = defaultOptions_default;
function sanitizeDOW(dow, day) {
  return dow.length < 6 && day >= 0 && day < 7 ? pushUnique(dow, day) : dow;
}
function determineGetWeekMethod(numberingMode, weekStart) {
  const methodId = numberingMode === 4 ? weekStart === 6 ? 3 : !weekStart + 1 : numberingMode;
  switch (methodId) {
    case 1:
      return getIsoWeek;
    case 2:
      return getWesternTradWeek;
    case 3:
      return getMidEasternWeek;
  }
}
function updateWeekStart(newValue, config, weekNumbers) {
  config.weekStart = newValue;
  config.weekEnd = (newValue + 6) % 7;
  if (weekNumbers === 4) {
    config.getWeekNumber = determineGetWeekMethod(4, newValue);
  }
  return newValue;
}
function validateDate(value, format, locale, origValue) {
  const date2 = parseDate(value, format, locale);
  return date2 !== void 0 ? date2 : origValue;
}
function validateViewId(value, origValue, max = 3) {
  const viewId = parseInt(value, 10);
  return viewId >= 0 && viewId <= max ? viewId : origValue;
}
function replaceOptions(options, from, to, convert = void 0) {
  if (from in options) {
    if (!(to in options)) {
      options[to] = convert ? convert(options[from]) : options[from];
    }
    delete options[from];
  }
}
function processOptions(options, datepicker) {
  const inOpts = Object.assign({}, options);
  const config = {};
  const locales = datepicker.constructor.locales;
  const rangeEnd = !!datepicker.rangeSideIndex;
  let {
    datesDisabled,
    format,
    language,
    locale,
    maxDate,
    maxView,
    minDate,
    pickLevel,
    startView,
    weekNumbers,
    weekStart
  } = datepicker.config || {};
  replaceOptions(inOpts, "calendarWeeks", "weekNumbers", (val) => val ? 1 : 0);
  replaceOptions(inOpts, "clearBtn", "clearButton");
  replaceOptions(inOpts, "todayBtn", "todayButton");
  replaceOptions(inOpts, "todayBtnMode", "todayButtonMode");
  if (inOpts.language) {
    let lang;
    if (inOpts.language !== language) {
      if (locales[inOpts.language]) {
        lang = inOpts.language;
      } else {
        lang = inOpts.language.split("-")[0];
        if (!locales[lang]) {
          lang = false;
        }
      }
    }
    delete inOpts.language;
    if (lang) {
      language = config.language = lang;
      const origLocale = locale || locales[defaultLang];
      locale = Object.assign({
        format: defaultFormat,
        weekStart: defaultWeekStart
      }, locales[defaultLang]);
      if (language !== defaultLang) {
        Object.assign(locale, locales[language]);
      }
      config.locale = locale;
      if (format === origLocale.format) {
        format = config.format = locale.format;
      }
      if (weekStart === origLocale.weekStart) {
        weekStart = updateWeekStart(locale.weekStart, config, weekNumbers);
      }
    }
  }
  if (inOpts.format) {
    const hasToDisplay = typeof inOpts.format.toDisplay === "function";
    const hasToValue = typeof inOpts.format.toValue === "function";
    const validFormatString = reFormatTokens.test(inOpts.format);
    if (hasToDisplay && hasToValue || validFormatString) {
      format = config.format = inOpts.format;
    }
    delete inOpts.format;
  }
  let newPickLevel = pickLevel;
  if ("pickLevel" in inOpts) {
    newPickLevel = validateViewId(inOpts.pickLevel, pickLevel, 2);
    delete inOpts.pickLevel;
  }
  if (newPickLevel !== pickLevel) {
    if (newPickLevel > pickLevel) {
      if (!("minDate" in inOpts)) {
        inOpts.minDate = minDate;
      }
      if (!("maxDate" in inOpts)) {
        inOpts.maxDate = maxDate;
      }
    }
    if (datesDisabled && !inOpts.datesDisabled) {
      inOpts.datesDisabled = [];
    }
    pickLevel = config.pickLevel = newPickLevel;
  }
  let minDt = minDate;
  let maxDt = maxDate;
  if ("minDate" in inOpts) {
    const defaultMinDt = dateValue(0, 0, 1);
    minDt = inOpts.minDate === null ? defaultMinDt : validateDate(inOpts.minDate, format, locale, minDt);
    if (minDt !== defaultMinDt) {
      minDt = regularizeDate(minDt, pickLevel, false);
    }
    delete inOpts.minDate;
  }
  if ("maxDate" in inOpts) {
    maxDt = inOpts.maxDate === null ? void 0 : validateDate(inOpts.maxDate, format, locale, maxDt);
    if (maxDt !== void 0) {
      maxDt = regularizeDate(maxDt, pickLevel, true);
    }
    delete inOpts.maxDate;
  }
  if (maxDt < minDt) {
    minDate = config.minDate = maxDt;
    maxDate = config.maxDate = minDt;
  } else {
    if (minDate !== minDt) {
      minDate = config.minDate = minDt;
    }
    if (maxDate !== maxDt) {
      maxDate = config.maxDate = maxDt;
    }
  }
  if (inOpts.datesDisabled) {
    const dtsDisabled = inOpts.datesDisabled;
    if (typeof dtsDisabled === "function") {
      config.datesDisabled = null;
      config.checkDisabled = (timeValue, viewId) => dtsDisabled(
        new Date(timeValue),
        viewId,
        rangeEnd
      );
    } else {
      const disabled = config.datesDisabled = dtsDisabled.reduce((dates, dt) => {
        const date2 = parseDate(dt, format, locale);
        return date2 !== void 0 ? pushUnique(dates, regularizeDate(date2, pickLevel, rangeEnd)) : dates;
      }, []);
      config.checkDisabled = (timeValue) => disabled.includes(timeValue);
    }
    delete inOpts.datesDisabled;
  }
  if ("defaultViewDate" in inOpts) {
    const viewDate = parseDate(inOpts.defaultViewDate, format, locale);
    if (viewDate !== void 0) {
      config.defaultViewDate = viewDate;
    }
    delete inOpts.defaultViewDate;
  }
  if ("weekStart" in inOpts) {
    const wkStart = Number(inOpts.weekStart) % 7;
    if (!isNaN(wkStart)) {
      weekStart = updateWeekStart(wkStart, config, weekNumbers);
    }
    delete inOpts.weekStart;
  }
  if (inOpts.daysOfWeekDisabled) {
    config.daysOfWeekDisabled = inOpts.daysOfWeekDisabled.reduce(sanitizeDOW, []);
    delete inOpts.daysOfWeekDisabled;
  }
  if (inOpts.daysOfWeekHighlighted) {
    config.daysOfWeekHighlighted = inOpts.daysOfWeekHighlighted.reduce(sanitizeDOW, []);
    delete inOpts.daysOfWeekHighlighted;
  }
  if ("weekNumbers" in inOpts) {
    let method = inOpts.weekNumbers;
    if (method) {
      const getWeekNumber = typeof method === "function" ? (timeValue, startOfWeek) => method(new Date(timeValue), startOfWeek) : determineGetWeekMethod(method = parseInt(method, 10), weekStart);
      if (getWeekNumber) {
        weekNumbers = config.weekNumbers = method;
        config.getWeekNumber = getWeekNumber;
      }
    } else {
      weekNumbers = config.weekNumbers = 0;
      config.getWeekNumber = null;
    }
    delete inOpts.weekNumbers;
  }
  if ("maxNumberOfDates" in inOpts) {
    const maxNumberOfDates = parseInt(inOpts.maxNumberOfDates, 10);
    if (maxNumberOfDates >= 0) {
      config.maxNumberOfDates = maxNumberOfDates;
      config.multidate = maxNumberOfDates !== 1;
    }
    delete inOpts.maxNumberOfDates;
  }
  if (inOpts.dateDelimiter) {
    config.dateDelimiter = String(inOpts.dateDelimiter);
    delete inOpts.dateDelimiter;
  }
  let newMaxView = maxView;
  if ("maxView" in inOpts) {
    newMaxView = validateViewId(inOpts.maxView, maxView);
    delete inOpts.maxView;
  }
  newMaxView = pickLevel > newMaxView ? pickLevel : newMaxView;
  if (newMaxView !== maxView) {
    maxView = config.maxView = newMaxView;
  }
  let newStartView = startView;
  if ("startView" in inOpts) {
    newStartView = validateViewId(inOpts.startView, newStartView);
    delete inOpts.startView;
  }
  if (newStartView < pickLevel) {
    newStartView = pickLevel;
  } else if (newStartView > maxView) {
    newStartView = maxView;
  }
  if (newStartView !== startView) {
    config.startView = newStartView;
  }
  if (inOpts.prevArrow) {
    const prevArrow = parseHTML(inOpts.prevArrow);
    if (prevArrow.childNodes.length > 0) {
      config.prevArrow = prevArrow.childNodes;
    }
    delete inOpts.prevArrow;
  }
  if (inOpts.nextArrow) {
    const nextArrow = parseHTML(inOpts.nextArrow);
    if (nextArrow.childNodes.length > 0) {
      config.nextArrow = nextArrow.childNodes;
    }
    delete inOpts.nextArrow;
  }
  if ("disableTouchKeyboard" in inOpts) {
    config.disableTouchKeyboard = "ontouchstart" in document && !!inOpts.disableTouchKeyboard;
    delete inOpts.disableTouchKeyboard;
  }
  if (inOpts.orientation) {
    const orientation = inOpts.orientation.toLowerCase().split(/\s+/g);
    config.orientation = {
      x: orientation.find((x) => x === "left" || x === "right") || "auto",
      y: orientation.find((y) => y === "top" || y === "bottom") || "auto"
    };
    delete inOpts.orientation;
  }
  if ("todayButtonMode" in inOpts) {
    switch (inOpts.todayButtonMode) {
      case 0:
      case 1:
        config.todayButtonMode = inOpts.todayButtonMode;
    }
    delete inOpts.todayButtonMode;
  }
  Object.entries(inOpts).forEach(([key, value]) => {
    if (value !== void 0 && key in defaultOptions_default) {
      config[key] = value;
    }
  });
  return config;
}

// ns-hugo-imp:/home/runner/work/docs-v2/docs-v2/node_modules/vanillajs-datepicker/js/options/shortcutKeys.js
var defaultShortcutKeys = {
  show: { key: "ArrowDown" },
  hide: null,
  toggle: { key: "Escape" },
  prevButton: { key: "ArrowLeft", ctrlOrMetaKey: true },
  nextButton: { key: "ArrowRight", ctrlOrMetaKey: true },
  viewSwitch: { key: "ArrowUp", ctrlOrMetaKey: true },
  clearButton: { key: "Backspace", ctrlOrMetaKey: true },
  todayButton: { key: ".", ctrlOrMetaKey: true },
  exitEditMode: { key: "ArrowDown", ctrlOrMetaKey: true }
};
function createShortcutKeyConfig(options) {
  return Object.keys(defaultShortcutKeys).reduce((keyDefs, shortcut) => {
    const keyDef = options[shortcut] === void 0 ? defaultShortcutKeys[shortcut] : options[shortcut];
    const key = keyDef && keyDef.key;
    if (!key || typeof key !== "string") {
      return keyDefs;
    }
    const normalizedDef = {
      key,
      ctrlOrMetaKey: !!(keyDef.ctrlOrMetaKey || keyDef.ctrlKey || keyDef.metaKey)
    };
    if (key.length > 1) {
      normalizedDef.altKey = !!keyDef.altKey;
      normalizedDef.shiftKey = !!keyDef.shiftKey;
    }
    keyDefs[shortcut] = normalizedDef;
    return keyDefs;
  }, {});
}

// ns-hugo-imp:/home/runner/work/docs-v2/docs-v2/node_modules/vanillajs-datepicker/js/picker/templates/pickerTemplate.js
var getButtons = (buttonList) => buttonList.map((classes) => `<button type="button" class="%buttonClass% ${classes}" tabindex="-1"></button>`).join("");
var pickerTemplate_default = optimizeTemplateHTML(`<div class="datepicker">
  <div class="datepicker-picker">
    <div class="datepicker-header">
      <div class="datepicker-title"></div>
      <div class="datepicker-controls">
        ${getButtons([
  "prev-button prev-btn",
  "view-switch",
  "next-button next-btn"
])}
      </div>
    </div>
    <div class="datepicker-main"></div>
    <div class="datepicker-footer">
      <div class="datepicker-controls">
        ${getButtons([
  "today-button today-btn",
  "clear-button clear-btn"
])}
      </div>
    </div>
  </div>
</div>`);

// ns-hugo-imp:/home/runner/work/docs-v2/docs-v2/node_modules/vanillajs-datepicker/js/picker/templates/daysTemplate.js
var daysTemplate_default = optimizeTemplateHTML(`<div class="days">
  <div class="days-of-week">${createTagRepeat("span", 7, { class: "dow" })}</div>
  <div class="datepicker-grid">${createTagRepeat("span", 42)}</div>
</div>`);

// ns-hugo-imp:/home/runner/work/docs-v2/docs-v2/node_modules/vanillajs-datepicker/js/picker/templates/weekNumbersTemplate.js
var weekNumbersTemplate_default = optimizeTemplateHTML(`<div class="week-numbers calendar-weeks">
  <div class="days-of-week"><span class="dow"></span></div>
  <div class="weeks">${createTagRepeat("span", 6, { class: "week" })}</div>
</div>`);

// ns-hugo-imp:/home/runner/work/docs-v2/docs-v2/node_modules/vanillajs-datepicker/js/picker/views/View.js
var View = class {
  constructor(picker, config) {
    Object.assign(this, config, {
      picker,
      element: parseHTML(`<div class="datepicker-view"></div>`).firstChild,
      selected: [],
      isRangeEnd: !!picker.datepicker.rangeSideIndex
    });
    this.init(this.picker.datepicker.config);
  }
  init(options) {
    if ("pickLevel" in options) {
      this.isMinView = this.id === options.pickLevel;
    }
    this.setOptions(options);
    this.updateFocus();
    this.updateSelection();
  }
  prepareForRender(switchLabel, prevButtonDisabled, nextButtonDisabled) {
    this.disabled = [];
    const picker = this.picker;
    picker.setViewSwitchLabel(switchLabel);
    picker.setPrevButtonDisabled(prevButtonDisabled);
    picker.setNextButtonDisabled(nextButtonDisabled);
  }
  setDisabled(date2, classList) {
    classList.add("disabled");
    pushUnique(this.disabled, date2);
  }
  // Execute beforeShow() callback and apply the result to the element
  // args:
  performBeforeHook(el, timeValue) {
    let result = this.beforeShow(new Date(timeValue));
    switch (typeof result) {
      case "boolean":
        result = { enabled: result };
        break;
      case "string":
        result = { classes: result };
    }
    if (result) {
      const classList = el.classList;
      if (result.enabled === false) {
        this.setDisabled(timeValue, classList);
      }
      if (result.classes) {
        const extraClasses = result.classes.split(/\s+/);
        classList.add(...extraClasses);
        if (extraClasses.includes("disabled")) {
          this.setDisabled(timeValue, classList);
        }
      }
      if (result.content) {
        replaceChildNodes(el, result.content);
      }
    }
  }
  renderCell(el, content, cellVal, date2, { selected, range: range2 }, outOfScope, extraClasses = []) {
    el.textContent = content;
    if (this.isMinView) {
      el.dataset.date = date2;
    }
    const classList = el.classList;
    el.className = `datepicker-cell ${this.cellClass}`;
    if (cellVal < this.first) {
      classList.add("prev");
    } else if (cellVal > this.last) {
      classList.add("next");
    }
    classList.add(...extraClasses);
    if (outOfScope || this.checkDisabled(date2, this.id)) {
      this.setDisabled(date2, classList);
    }
    if (range2) {
      const [rangeStart, rangeEnd] = range2;
      if (cellVal > rangeStart && cellVal < rangeEnd) {
        classList.add("range");
      }
      if (cellVal === rangeStart) {
        classList.add("range-start");
      }
      if (cellVal === rangeEnd) {
        classList.add("range-end");
      }
    }
    if (selected.includes(cellVal)) {
      classList.add("selected");
    }
    if (cellVal === this.focused) {
      classList.add("focused");
    }
    if (this.beforeShow) {
      this.performBeforeHook(el, date2);
    }
  }
  refreshCell(el, cellVal, selected, [rangeStart, rangeEnd]) {
    const classList = el.classList;
    classList.remove("range", "range-start", "range-end", "selected", "focused");
    if (cellVal > rangeStart && cellVal < rangeEnd) {
      classList.add("range");
    }
    if (cellVal === rangeStart) {
      classList.add("range-start");
    }
    if (cellVal === rangeEnd) {
      classList.add("range-end");
    }
    if (selected.includes(cellVal)) {
      classList.add("selected");
    }
    if (cellVal === this.focused) {
      classList.add("focused");
    }
  }
  changeFocusedCell(cellIndex) {
    this.grid.querySelectorAll(".focused").forEach((el) => {
      el.classList.remove("focused");
    });
    this.grid.children[cellIndex].classList.add("focused");
  }
};

// ns-hugo-imp:/home/runner/work/docs-v2/docs-v2/node_modules/vanillajs-datepicker/js/picker/views/DaysView.js
var DaysView = class extends View {
  constructor(picker) {
    super(picker, {
      id: 0,
      name: "days",
      cellClass: "day"
    });
  }
  init(options, onConstruction = true) {
    if (onConstruction) {
      const inner = parseHTML(daysTemplate_default).firstChild;
      this.dow = inner.firstChild;
      this.grid = inner.lastChild;
      this.element.appendChild(inner);
    }
    super.init(options);
  }
  setOptions(options) {
    let updateDOW;
    if ("minDate" in options) {
      this.minDate = options.minDate;
    }
    if ("maxDate" in options) {
      this.maxDate = options.maxDate;
    }
    if (options.checkDisabled) {
      this.checkDisabled = options.checkDisabled;
    }
    if (options.daysOfWeekDisabled) {
      this.daysOfWeekDisabled = options.daysOfWeekDisabled;
      updateDOW = true;
    }
    if (options.daysOfWeekHighlighted) {
      this.daysOfWeekHighlighted = options.daysOfWeekHighlighted;
    }
    if ("todayHighlight" in options) {
      this.todayHighlight = options.todayHighlight;
    }
    if ("weekStart" in options) {
      this.weekStart = options.weekStart;
      this.weekEnd = options.weekEnd;
      updateDOW = true;
    }
    if (options.locale) {
      const locale = this.locale = options.locale;
      this.dayNames = locale.daysMin;
      this.switchLabelFormat = locale.titleFormat;
      updateDOW = true;
    }
    if ("beforeShowDay" in options) {
      this.beforeShow = typeof options.beforeShowDay === "function" ? options.beforeShowDay : void 0;
    }
    if ("weekNumbers" in options) {
      if (options.weekNumbers && !this.weekNumbers) {
        const weeksElem = parseHTML(weekNumbersTemplate_default).firstChild;
        this.weekNumbers = {
          element: weeksElem,
          dow: weeksElem.firstChild,
          weeks: weeksElem.lastChild
        };
        this.element.insertBefore(weeksElem, this.element.firstChild);
      } else if (this.weekNumbers && !options.weekNumbers) {
        this.element.removeChild(this.weekNumbers.element);
        this.weekNumbers = null;
      }
    }
    if ("getWeekNumber" in options) {
      this.getWeekNumber = options.getWeekNumber;
    }
    if ("showDaysOfWeek" in options) {
      if (options.showDaysOfWeek) {
        showElement(this.dow);
        if (this.weekNumbers) {
          showElement(this.weekNumbers.dow);
        }
      } else {
        hideElement(this.dow);
        if (this.weekNumbers) {
          hideElement(this.weekNumbers.dow);
        }
      }
    }
    if (updateDOW) {
      Array.from(this.dow.children).forEach((el, index) => {
        const dow = (this.weekStart + index) % 7;
        el.textContent = this.dayNames[dow];
        el.className = this.daysOfWeekDisabled.includes(dow) ? "dow disabled" : "dow";
      });
    }
  }
  // Apply update on the focused date to view's settings
  updateFocus() {
    const viewDate = new Date(this.picker.viewDate);
    const viewYear = viewDate.getFullYear();
    const viewMonth = viewDate.getMonth();
    const firstOfMonth = dateValue(viewYear, viewMonth, 1);
    const start = dayOfTheWeekOf(firstOfMonth, this.weekStart, this.weekStart);
    this.first = firstOfMonth;
    this.last = dateValue(viewYear, viewMonth + 1, 0);
    this.start = start;
    this.focused = this.picker.viewDate;
  }
  // Apply update on the selected dates to view's settings
  updateSelection() {
    const { dates, rangepicker } = this.picker.datepicker;
    this.selected = dates;
    if (rangepicker) {
      this.range = rangepicker.dates;
    }
  }
  // Update the entire view UI
  render() {
    this.today = this.todayHighlight ? today() : void 0;
    this.prepareForRender(
      formatDate(this.focused, this.switchLabelFormat, this.locale),
      this.first <= this.minDate,
      this.last >= this.maxDate
    );
    if (this.weekNumbers) {
      const weekStart = this.weekStart;
      const startOfWeek = dayOfTheWeekOf(this.first, weekStart, weekStart);
      Array.from(this.weekNumbers.weeks.children).forEach((el, index) => {
        const dateOfWeekStart = addWeeks(startOfWeek, index);
        el.textContent = this.getWeekNumber(dateOfWeekStart, weekStart);
        if (index > 3) {
          el.classList[dateOfWeekStart > this.last ? "add" : "remove"]("next");
        }
      });
    }
    Array.from(this.grid.children).forEach((el, index) => {
      const current = addDays(this.start, index);
      const dateObj = new Date(current);
      const day = dateObj.getDay();
      const extraClasses = [];
      if (this.today === current) {
        extraClasses.push("today");
      }
      if (this.daysOfWeekHighlighted.includes(day)) {
        extraClasses.push("highlighted");
      }
      this.renderCell(
        el,
        dateObj.getDate(),
        current,
        current,
        this,
        current < this.minDate || current > this.maxDate || this.daysOfWeekDisabled.includes(day),
        extraClasses
      );
    });
  }
  // Update the view UI by applying the changes of selected and focused items
  refresh() {
    const range2 = this.range || [];
    Array.from(this.grid.children).forEach((el) => {
      this.refreshCell(el, Number(el.dataset.date), this.selected, range2);
    });
  }
  // Update the view UI by applying the change of focused item
  refreshFocus() {
    this.changeFocusedCell(Math.round((this.focused - this.start) / 864e5));
  }
};

// ns-hugo-imp:/home/runner/work/docs-v2/docs-v2/node_modules/vanillajs-datepicker/js/picker/views/MonthsView.js
function computeMonthRange(range2, thisYear) {
  if (!range2 || !range2[0] || !range2[1]) {
    return;
  }
  const [[startY, startM], [endY, endM]] = range2;
  if (startY > thisYear || endY < thisYear) {
    return;
  }
  return [
    startY === thisYear ? startM : -1,
    endY === thisYear ? endM : 12
  ];
}
var MonthsView = class extends View {
  constructor(picker) {
    super(picker, {
      id: 1,
      name: "months",
      cellClass: "month"
    });
  }
  init(options, onConstruction = true) {
    if (onConstruction) {
      this.grid = this.element;
      this.element.classList.add("months", "datepicker-grid");
      this.grid.appendChild(parseHTML(createTagRepeat("span", 12, { "data-month": (ix) => ix })));
      this.first = 0;
      this.last = 11;
    }
    super.init(options);
  }
  setOptions(options) {
    if (options.locale) {
      this.monthNames = options.locale.monthsShort;
    }
    if ("minDate" in options) {
      if (options.minDate === void 0) {
        this.minYear = this.minMonth = this.minDate = void 0;
      } else {
        const minDateObj = new Date(options.minDate);
        this.minYear = minDateObj.getFullYear();
        this.minMonth = minDateObj.getMonth();
        this.minDate = minDateObj.setDate(1);
      }
    }
    if ("maxDate" in options) {
      if (options.maxDate === void 0) {
        this.maxYear = this.maxMonth = this.maxDate = void 0;
      } else {
        const maxDateObj = new Date(options.maxDate);
        this.maxYear = maxDateObj.getFullYear();
        this.maxMonth = maxDateObj.getMonth();
        this.maxDate = dateValue(this.maxYear, this.maxMonth + 1, 0);
      }
    }
    if (options.checkDisabled) {
      this.checkDisabled = this.isMinView || options.datesDisabled === null ? options.checkDisabled : () => false;
    }
    if ("beforeShowMonth" in options) {
      this.beforeShow = typeof options.beforeShowMonth === "function" ? options.beforeShowMonth : void 0;
    }
  }
  // Update view's settings to reflect the viewDate set on the picker
  updateFocus() {
    const viewDate = new Date(this.picker.viewDate);
    this.year = viewDate.getFullYear();
    this.focused = viewDate.getMonth();
  }
  // Update view's settings to reflect the selected dates
  updateSelection() {
    const { dates, rangepicker } = this.picker.datepicker;
    this.selected = dates.reduce((selected, timeValue) => {
      const date2 = new Date(timeValue);
      const year = date2.getFullYear();
      const month = date2.getMonth();
      if (selected[year] === void 0) {
        selected[year] = [month];
      } else {
        pushUnique(selected[year], month);
      }
      return selected;
    }, {});
    if (rangepicker && rangepicker.dates) {
      this.range = rangepicker.dates.map((timeValue) => {
        const date2 = new Date(timeValue);
        return isNaN(date2) ? void 0 : [date2.getFullYear(), date2.getMonth()];
      });
    }
  }
  // Update the entire view UI
  render() {
    this.prepareForRender(
      this.year,
      this.year <= this.minYear,
      this.year >= this.maxYear
    );
    const selected = this.selected[this.year] || [];
    const yrOutOfRange = this.year < this.minYear || this.year > this.maxYear;
    const isMinYear = this.year === this.minYear;
    const isMaxYear = this.year === this.maxYear;
    const range2 = computeMonthRange(this.range, this.year);
    Array.from(this.grid.children).forEach((el, index) => {
      const date2 = regularizeDate(new Date(this.year, index, 1), 1, this.isRangeEnd);
      this.renderCell(
        el,
        this.monthNames[index],
        index,
        date2,
        { selected, range: range2 },
        yrOutOfRange || isMinYear && index < this.minMonth || isMaxYear && index > this.maxMonth
      );
    });
  }
  // Update the view UI by applying the changes of selected and focused items
  refresh() {
    const selected = this.selected[this.year] || [];
    const range2 = computeMonthRange(this.range, this.year) || [];
    Array.from(this.grid.children).forEach((el, index) => {
      this.refreshCell(el, index, selected, range2);
    });
  }
  // Update the view UI by applying the change of focused item
  refreshFocus() {
    this.changeFocusedCell(this.focused);
  }
};

// ns-hugo-imp:/home/runner/work/docs-v2/docs-v2/node_modules/vanillajs-datepicker/js/picker/views/YearsView.js
function toTitleCase(word) {
  return [...word].reduce((str, ch, ix) => str += ix ? ch : ch.toUpperCase(), "");
}
var YearsView = class extends View {
  constructor(picker, config) {
    super(picker, config);
  }
  init(options, onConstruction = true) {
    if (onConstruction) {
      this.navStep = this.step * 10;
      this.beforeShowOption = `beforeShow${toTitleCase(this.cellClass)}`;
      this.grid = this.element;
      this.element.classList.add(this.name, "datepicker-grid");
      this.grid.appendChild(parseHTML(createTagRepeat("span", 12)));
    }
    super.init(options);
  }
  setOptions(options) {
    if ("minDate" in options) {
      if (options.minDate === void 0) {
        this.minYear = this.minDate = void 0;
      } else {
        this.minYear = startOfYearPeriod(options.minDate, this.step);
        this.minDate = dateValue(this.minYear, 0, 1);
      }
    }
    if ("maxDate" in options) {
      if (options.maxDate === void 0) {
        this.maxYear = this.maxDate = void 0;
      } else {
        this.maxYear = startOfYearPeriod(options.maxDate, this.step);
        this.maxDate = dateValue(this.maxYear, 11, 31);
      }
    }
    if (options.checkDisabled) {
      this.checkDisabled = this.isMinView || options.datesDisabled === null ? options.checkDisabled : () => false;
    }
    if (this.beforeShowOption in options) {
      const beforeShow = options[this.beforeShowOption];
      this.beforeShow = typeof beforeShow === "function" ? beforeShow : void 0;
    }
  }
  // Update view's settings to reflect the viewDate set on the picker
  updateFocus() {
    const viewDate = new Date(this.picker.viewDate);
    const first = startOfYearPeriod(viewDate, this.navStep);
    const last = first + 9 * this.step;
    this.first = first;
    this.last = last;
    this.start = first - this.step;
    this.focused = startOfYearPeriod(viewDate, this.step);
  }
  // Update view's settings to reflect the selected dates
  updateSelection() {
    const { dates, rangepicker } = this.picker.datepicker;
    this.selected = dates.reduce((years, timeValue) => {
      return pushUnique(years, startOfYearPeriod(timeValue, this.step));
    }, []);
    if (rangepicker && rangepicker.dates) {
      this.range = rangepicker.dates.map((timeValue) => {
        if (timeValue !== void 0) {
          return startOfYearPeriod(timeValue, this.step);
        }
      });
    }
  }
  // Update the entire view UI
  render() {
    this.prepareForRender(
      `${this.first}-${this.last}`,
      this.first <= this.minYear,
      this.last >= this.maxYear
    );
    Array.from(this.grid.children).forEach((el, index) => {
      const current = this.start + index * this.step;
      const date2 = regularizeDate(new Date(current, 0, 1), 2, this.isRangeEnd);
      el.dataset.year = current;
      this.renderCell(
        el,
        current,
        current,
        date2,
        this,
        current < this.minYear || current > this.maxYear
      );
    });
  }
  // Update the view UI by applying the changes of selected and focused items
  refresh() {
    const range2 = this.range || [];
    Array.from(this.grid.children).forEach((el) => {
      this.refreshCell(el, Number(el.textContent), this.selected, range2);
    });
  }
  // Update the view UI by applying the change of focused item
  refreshFocus() {
    this.changeFocusedCell(Math.round((this.focused - this.start) / this.step));
  }
};

// ns-hugo-imp:/home/runner/work/docs-v2/docs-v2/node_modules/vanillajs-datepicker/js/events/functions.js
function triggerDatepickerEvent(datepicker, type) {
  const options = {
    bubbles: true,
    cancelable: true,
    detail: {
      date: datepicker.getDate(),
      viewDate: new Date(datepicker.picker.viewDate),
      viewId: datepicker.picker.currentView.id,
      datepicker
    }
  };
  datepicker.element.dispatchEvent(new CustomEvent(type, options));
}
function goToPrevOrNext(datepicker, direction) {
  const { config, picker } = datepicker;
  const { currentView, viewDate } = picker;
  let newViewDate;
  switch (currentView.id) {
    case 0:
      newViewDate = addMonths(viewDate, direction);
      break;
    case 1:
      newViewDate = addYears(viewDate, direction);
      break;
    default:
      newViewDate = addYears(viewDate, direction * currentView.navStep);
  }
  newViewDate = limitToRange(newViewDate, config.minDate, config.maxDate);
  picker.changeFocus(newViewDate).render();
}
function switchView(datepicker) {
  const viewId = datepicker.picker.currentView.id;
  if (viewId === datepicker.config.maxView) {
    return;
  }
  datepicker.picker.changeView(viewId + 1).render();
}
function clearSelection(datepicker) {
  datepicker.setDate({ clear: true });
}
function goToOrSelectToday(datepicker) {
  const currentDate2 = today();
  if (datepicker.config.todayButtonMode === 1) {
    datepicker.setDate(currentDate2, { forceRefresh: true, viewDate: currentDate2 });
  } else {
    datepicker.setFocusedDate(currentDate2, true);
  }
}
function unfocus(datepicker) {
  const onBlur = () => {
    if (datepicker.config.updateOnBlur) {
      datepicker.update({ revert: true });
    } else {
      datepicker.refresh("input");
    }
    datepicker.hide();
  };
  const element = datepicker.element;
  if (isActiveElement(element)) {
    element.addEventListener("blur", onBlur, { once: true });
  } else {
    onBlur();
  }
}

// ns-hugo-imp:/home/runner/work/docs-v2/docs-v2/node_modules/vanillajs-datepicker/js/events/pickerListeners.js
function goToSelectedMonthOrYear(datepicker, selection) {
  const picker = datepicker.picker;
  const viewDate = new Date(picker.viewDate);
  const viewId = picker.currentView.id;
  const newDate = viewId === 1 ? addMonths(viewDate, selection - viewDate.getMonth()) : addYears(viewDate, selection - viewDate.getFullYear());
  picker.changeFocus(newDate).changeView(viewId - 1).render();
}
function onClickViewSwitch(datepicker) {
  switchView(datepicker);
}
function onClickPrevButton(datepicker) {
  goToPrevOrNext(datepicker, -1);
}
function onClickNextButton(datepicker) {
  goToPrevOrNext(datepicker, 1);
}
function onClickView(datepicker, ev) {
  const target = findElementInEventPath(ev, ".datepicker-cell");
  if (!target || target.classList.contains("disabled")) {
    return;
  }
  const { id, isMinView } = datepicker.picker.currentView;
  const data2 = target.dataset;
  if (isMinView) {
    datepicker.setDate(Number(data2.date));
  } else if (id === 1) {
    goToSelectedMonthOrYear(datepicker, Number(data2.month));
  } else {
    goToSelectedMonthOrYear(datepicker, Number(data2.year));
  }
}
function onMousedownPicker(ev) {
  ev.preventDefault();
}

// ns-hugo-imp:/home/runner/work/docs-v2/docs-v2/node_modules/vanillajs-datepicker/js/picker/Picker.js
var orientClasses = ["left", "top", "right", "bottom"].reduce((obj, key) => {
  obj[key] = `datepicker-orient-${key}`;
  return obj;
}, {});
var toPx = (num) => num ? `${num}px` : num;
function processPickerOptions(picker, options) {
  if ("title" in options) {
    if (options.title) {
      picker.controls.title.textContent = options.title;
      showElement(picker.controls.title);
    } else {
      picker.controls.title.textContent = "";
      hideElement(picker.controls.title);
    }
  }
  if (options.prevArrow) {
    const prevButton = picker.controls.prevButton;
    emptyChildNodes(prevButton);
    options.prevArrow.forEach((node) => {
      prevButton.appendChild(node.cloneNode(true));
    });
  }
  if (options.nextArrow) {
    const nextButton = picker.controls.nextButton;
    emptyChildNodes(nextButton);
    options.nextArrow.forEach((node) => {
      nextButton.appendChild(node.cloneNode(true));
    });
  }
  if (options.locale) {
    picker.controls.todayButton.textContent = options.locale.today;
    picker.controls.clearButton.textContent = options.locale.clear;
  }
  if ("todayButton" in options) {
    if (options.todayButton) {
      showElement(picker.controls.todayButton);
    } else {
      hideElement(picker.controls.todayButton);
    }
  }
  if ("minDate" in options || "maxDate" in options) {
    const { minDate, maxDate } = picker.datepicker.config;
    picker.controls.todayButton.disabled = !isInRange(today(), minDate, maxDate);
  }
  if ("clearButton" in options) {
    if (options.clearButton) {
      showElement(picker.controls.clearButton);
    } else {
      hideElement(picker.controls.clearButton);
    }
  }
}
function computeResetViewDate(datepicker) {
  const { dates, config, rangeSideIndex } = datepicker;
  const viewDate = dates.length > 0 ? lastItemOf(dates) : regularizeDate(config.defaultViewDate, config.pickLevel, rangeSideIndex);
  return limitToRange(viewDate, config.minDate, config.maxDate);
}
function setViewDate(picker, newDate) {
  if (!("_oldViewDate" in picker) && newDate !== picker.viewDate) {
    picker._oldViewDate = picker.viewDate;
  }
  picker.viewDate = newDate;
  const { id, year, first, last } = picker.currentView;
  const viewYear = new Date(newDate).getFullYear();
  switch (id) {
    case 0:
      return newDate < first || newDate > last;
    case 1:
      return viewYear !== year;
    default:
      return viewYear < first || viewYear > last;
  }
}
function getTextDirection(el) {
  return window.getComputedStyle(el).direction;
}
function findScrollParents(el) {
  const parent = getParent(el);
  if (parent === document.body || !parent) {
    return;
  }
  return window.getComputedStyle(parent).overflow !== "visible" ? parent : findScrollParents(parent);
}
var Picker = class {
  constructor(datepicker) {
    const { config, inputField } = this.datepicker = datepicker;
    const template = pickerTemplate_default.replace(/%buttonClass%/g, config.buttonClass);
    const element = this.element = parseHTML(template).firstChild;
    const [header, main, footer] = element.firstChild.children;
    const title = header.firstElementChild;
    const [prevButton, viewSwitch, nextButton] = header.lastElementChild.children;
    const [todayButton, clearButton] = footer.firstChild.children;
    const controls = {
      title,
      prevButton,
      viewSwitch,
      nextButton,
      todayButton,
      clearButton
    };
    this.main = main;
    this.controls = controls;
    const elementClass = inputField ? "dropdown" : "inline";
    element.classList.add(`datepicker-${elementClass}`);
    processPickerOptions(this, config);
    this.viewDate = computeResetViewDate(datepicker);
    registerListeners(datepicker, [
      [element, "mousedown", onMousedownPicker],
      [main, "click", onClickView.bind(null, datepicker)],
      [controls.viewSwitch, "click", onClickViewSwitch.bind(null, datepicker)],
      [controls.prevButton, "click", onClickPrevButton.bind(null, datepicker)],
      [controls.nextButton, "click", onClickNextButton.bind(null, datepicker)],
      [controls.todayButton, "click", goToOrSelectToday.bind(null, datepicker)],
      [controls.clearButton, "click", clearSelection.bind(null, datepicker)]
    ]);
    this.views = [
      new DaysView(this),
      new MonthsView(this),
      new YearsView(this, { id: 2, name: "years", cellClass: "year", step: 1 }),
      new YearsView(this, { id: 3, name: "decades", cellClass: "decade", step: 10 })
    ];
    this.currentView = this.views[config.startView];
    this.currentView.render();
    this.main.appendChild(this.currentView.element);
    if (config.container) {
      config.container.appendChild(this.element);
    } else {
      inputField.after(this.element);
    }
  }
  setOptions(options) {
    processPickerOptions(this, options);
    this.views.forEach((view) => {
      view.init(options, false);
    });
    this.currentView.render();
  }
  detach() {
    this.element.remove();
  }
  show() {
    if (this.active) {
      return;
    }
    const { datepicker, element } = this;
    const inputField = datepicker.inputField;
    if (inputField) {
      const inputDirection = getTextDirection(inputField);
      if (inputDirection !== getTextDirection(getParent(element))) {
        element.dir = inputDirection;
      } else if (element.dir) {
        element.removeAttribute("dir");
      }
      this.place();
      element.classList.add("active");
      if (datepicker.config.disableTouchKeyboard) {
        inputField.blur();
      }
    } else {
      element.classList.add("active");
    }
    this.active = true;
    triggerDatepickerEvent(datepicker, "show");
  }
  hide() {
    if (!this.active) {
      return;
    }
    this.datepicker.exitEditMode();
    this.element.classList.remove("active");
    this.active = false;
    triggerDatepickerEvent(this.datepicker, "hide");
  }
  place() {
    const { classList, style } = this.element;
    style.display = "block";
    const {
      width: calendarWidth,
      height: calendarHeight
    } = this.element.getBoundingClientRect();
    const offsetParent = this.element.offsetParent;
    style.display = "";
    const { config, inputField } = this.datepicker;
    const {
      left: inputLeft,
      top: inputTop,
      right: inputRight,
      bottom: inputBottom,
      width: inputWidth,
      height: inputHeight
    } = inputField.getBoundingClientRect();
    let { x: orientX, y: orientY } = config.orientation;
    let left = inputLeft;
    let top = inputTop;
    if (offsetParent === document.body || !offsetParent) {
      left += window.scrollX;
      top += window.scrollY;
    } else {
      const offsetParentRect = offsetParent.getBoundingClientRect();
      left -= offsetParentRect.left - offsetParent.scrollLeft;
      top -= offsetParentRect.top - offsetParent.scrollTop;
    }
    const scrollParent = findScrollParents(inputField);
    let scrollAreaLeft = 0;
    let scrollAreaTop = 0;
    let {
      clientWidth: scrollAreaRight,
      clientHeight: scrollAreaBottom
    } = document.documentElement;
    if (scrollParent) {
      const scrollParentRect = scrollParent.getBoundingClientRect();
      if (scrollParentRect.top > 0) {
        scrollAreaTop = scrollParentRect.top;
      }
      if (scrollParentRect.left > 0) {
        scrollAreaLeft = scrollParentRect.left;
      }
      if (scrollParentRect.right < scrollAreaRight) {
        scrollAreaRight = scrollParentRect.right;
      }
      if (scrollParentRect.bottom < scrollAreaBottom) {
        scrollAreaBottom = scrollParentRect.bottom;
      }
    }
    let adjustment = 0;
    if (orientX === "auto") {
      if (inputLeft < scrollAreaLeft) {
        orientX = "left";
        adjustment = scrollAreaLeft - inputLeft;
      } else if (inputLeft + calendarWidth > scrollAreaRight) {
        orientX = "right";
        if (scrollAreaRight < inputRight) {
          adjustment = scrollAreaRight - inputRight;
        }
      } else if (getTextDirection(inputField) === "rtl") {
        orientX = inputRight - calendarWidth < scrollAreaLeft ? "left" : "right";
      } else {
        orientX = "left";
      }
    }
    if (orientX === "right") {
      left += inputWidth - calendarWidth;
    }
    left += adjustment;
    if (orientY === "auto") {
      if (inputTop - calendarHeight > scrollAreaTop) {
        orientY = inputBottom + calendarHeight > scrollAreaBottom ? "top" : "bottom";
      } else {
        orientY = "bottom";
      }
    }
    if (orientY === "top") {
      top -= calendarHeight;
    } else {
      top += inputHeight;
    }
    classList.remove(...Object.values(orientClasses));
    classList.add(orientClasses[orientX], orientClasses[orientY]);
    style.left = toPx(left);
    style.top = toPx(top);
  }
  setViewSwitchLabel(labelText) {
    this.controls.viewSwitch.textContent = labelText;
  }
  setPrevButtonDisabled(disabled) {
    this.controls.prevButton.disabled = disabled;
  }
  setNextButtonDisabled(disabled) {
    this.controls.nextButton.disabled = disabled;
  }
  changeView(viewId) {
    const currentView = this.currentView;
    if (viewId !== currentView.id) {
      if (!this._oldView) {
        this._oldView = currentView;
      }
      this.currentView = this.views[viewId];
      this._renderMethod = "render";
    }
    return this;
  }
  // Change the focused date (view date)
  changeFocus(newViewDate) {
    this._renderMethod = setViewDate(this, newViewDate) ? "render" : "refreshFocus";
    this.views.forEach((view) => {
      view.updateFocus();
    });
    return this;
  }
  // Apply the change of the selected dates
  update(viewDate = void 0) {
    const newViewDate = viewDate === void 0 ? computeResetViewDate(this.datepicker) : viewDate;
    this._renderMethod = setViewDate(this, newViewDate) ? "render" : "refresh";
    this.views.forEach((view) => {
      view.updateFocus();
      view.updateSelection();
    });
    return this;
  }
  // Refresh the picker UI
  render(quickRender = true) {
    const { currentView, datepicker, _oldView: oldView } = this;
    const oldViewDate = new Date(this._oldViewDate);
    const renderMethod = quickRender && this._renderMethod || "render";
    delete this._oldView;
    delete this._oldViewDate;
    delete this._renderMethod;
    currentView[renderMethod]();
    if (oldView) {
      this.main.replaceChild(currentView.element, oldView.element);
      triggerDatepickerEvent(datepicker, "changeView");
    }
    if (!isNaN(oldViewDate)) {
      const newViewDate = new Date(this.viewDate);
      if (newViewDate.getFullYear() !== oldViewDate.getFullYear()) {
        triggerDatepickerEvent(datepicker, "changeYear");
      }
      if (newViewDate.getMonth() !== oldViewDate.getMonth()) {
        triggerDatepickerEvent(datepicker, "changeMonth");
      }
    }
  }
};

// ns-hugo-imp:/home/runner/work/docs-v2/docs-v2/node_modules/vanillajs-datepicker/js/events/elementListeners.js
function findNextAvailableOne(date2, addFn, increase, testFn, min, max) {
  if (!isInRange(date2, min, max)) {
    return;
  }
  if (testFn(date2)) {
    const newDate = addFn(date2, increase);
    return findNextAvailableOne(newDate, addFn, increase, testFn, min, max);
  }
  return date2;
}
function moveByArrowKey(datepicker, direction, vertical) {
  const picker = datepicker.picker;
  const currentView = picker.currentView;
  const step = currentView.step || 1;
  let viewDate = picker.viewDate;
  let addFn;
  switch (currentView.id) {
    case 0:
      viewDate = addDays(viewDate, vertical ? direction * 7 : direction);
      addFn = addDays;
      break;
    case 1:
      viewDate = addMonths(viewDate, vertical ? direction * 4 : direction);
      addFn = addMonths;
      break;
    default:
      viewDate = addYears(viewDate, direction * (vertical ? 4 : 1) * step);
      addFn = addYears;
  }
  viewDate = findNextAvailableOne(
    viewDate,
    addFn,
    direction < 0 ? -step : step,
    (date2) => currentView.disabled.includes(date2),
    currentView.minDate,
    currentView.maxDate
  );
  if (viewDate !== void 0) {
    picker.changeFocus(viewDate).render();
  }
}
function onKeydown(datepicker, ev) {
  const { config, picker, editMode } = datepicker;
  const active = picker.active;
  const { key, altKey, shiftKey } = ev;
  const ctrlOrMetaKey = ev.ctrlKey || ev.metaKey;
  const cancelEvent = () => {
    ev.preventDefault();
    ev.stopPropagation();
  };
  if (key === "Tab") {
    unfocus(datepicker);
    return;
  }
  if (key === "Enter") {
    if (!active) {
      datepicker.update();
    } else if (editMode) {
      datepicker.exitEditMode({ update: true, autohide: config.autohide });
    } else {
      const currentView = picker.currentView;
      if (currentView.isMinView) {
        datepicker.setDate(picker.viewDate);
      } else {
        picker.changeView(currentView.id - 1).render();
        cancelEvent();
      }
    }
    return;
  }
  const shortcutKeys = config.shortcutKeys;
  const keyInfo = { key, ctrlOrMetaKey, altKey, shiftKey };
  const shortcut = Object.keys(shortcutKeys).find((item) => {
    const keyDef = shortcutKeys[item];
    return !Object.keys(keyDef).find((prop) => keyDef[prop] !== keyInfo[prop]);
  });
  if (shortcut) {
    let action;
    if (shortcut === "toggle") {
      action = shortcut;
    } else if (editMode) {
      if (shortcut === "exitEditMode") {
        action = shortcut;
      }
    } else if (active) {
      if (shortcut === "hide") {
        action = shortcut;
      } else if (shortcut === "prevButton") {
        action = [goToPrevOrNext, [datepicker, -1]];
      } else if (shortcut === "nextButton") {
        action = [goToPrevOrNext, [datepicker, 1]];
      } else if (shortcut === "viewSwitch") {
        action = [switchView, [datepicker]];
      } else if (config.clearButton && shortcut === "clearButton") {
        action = [clearSelection, [datepicker]];
      } else if (config.todayButton && shortcut === "todayButton") {
        action = [goToOrSelectToday, [datepicker]];
      }
    } else if (shortcut === "show") {
      action = shortcut;
    }
    if (action) {
      if (Array.isArray(action)) {
        action[0].apply(null, action[1]);
      } else {
        datepicker[action]();
      }
      cancelEvent();
      return;
    }
  }
  if (!active || editMode) {
    return;
  }
  const handleArrowKeyPress = (direction, vertical) => {
    if (shiftKey || ctrlOrMetaKey || altKey) {
      datepicker.enterEditMode();
    } else {
      moveByArrowKey(datepicker, direction, vertical);
      ev.preventDefault();
    }
  };
  if (key === "ArrowLeft") {
    handleArrowKeyPress(-1, false);
  } else if (key === "ArrowRight") {
    handleArrowKeyPress(1, false);
  } else if (key === "ArrowUp") {
    handleArrowKeyPress(-1, true);
  } else if (key === "ArrowDown") {
    handleArrowKeyPress(1, true);
  } else if (key === "Backspace" || key === "Delete" || key && key.length === 1 && !ctrlOrMetaKey) {
    datepicker.enterEditMode();
  }
}
function onFocus(datepicker) {
  if (datepicker.config.showOnFocus && !datepicker._showing) {
    datepicker.show();
  }
}
function onMousedown(datepicker, ev) {
  const el = ev.target;
  if (datepicker.picker.active || datepicker.config.showOnClick) {
    el._active = isActiveElement(el);
    el._clicking = setTimeout(() => {
      delete el._active;
      delete el._clicking;
    }, 2e3);
  }
}
function onClickInput(datepicker, ev) {
  const el = ev.target;
  if (!el._clicking) {
    return;
  }
  clearTimeout(el._clicking);
  delete el._clicking;
  if (el._active) {
    datepicker.enterEditMode();
  }
  delete el._active;
  if (datepicker.config.showOnClick) {
    datepicker.show();
  }
}
function onPaste(datepicker, ev) {
  if (ev.clipboardData.types.includes("text/plain")) {
    datepicker.enterEditMode();
  }
}

// ns-hugo-imp:/home/runner/work/docs-v2/docs-v2/node_modules/vanillajs-datepicker/js/events/otherListeners.js
function onClickOutside(datepicker, ev) {
  const { element, picker } = datepicker;
  if (!picker.active && !isActiveElement(element)) {
    return;
  }
  const pickerElem = picker.element;
  if (findElementInEventPath(ev, (el) => el === element || el === pickerElem)) {
    return;
  }
  unfocus(datepicker);
}

// ns-hugo-imp:/home/runner/work/docs-v2/docs-v2/node_modules/vanillajs-datepicker/js/Datepicker.js
function stringifyDates(dates, config) {
  return dates.map((dt) => formatDate(dt, config.format, config.locale)).join(config.dateDelimiter);
}
function processInputDates(datepicker, inputDates, clear = false) {
  if (inputDates.length === 0) {
    return clear ? [] : void 0;
  }
  const { config, dates: origDates, rangeSideIndex } = datepicker;
  const { pickLevel, maxNumberOfDates } = config;
  let newDates = inputDates.reduce((dates, dt) => {
    let date2 = parseDate(dt, config.format, config.locale);
    if (date2 === void 0) {
      return dates;
    }
    date2 = regularizeDate(date2, pickLevel, rangeSideIndex);
    if (isInRange(date2, config.minDate, config.maxDate) && !dates.includes(date2) && !config.checkDisabled(date2, pickLevel) && (pickLevel > 0 || !config.daysOfWeekDisabled.includes(new Date(date2).getDay()))) {
      dates.push(date2);
    }
    return dates;
  }, []);
  if (newDates.length === 0) {
    return;
  }
  if (config.multidate && !clear) {
    newDates = newDates.reduce((dates, date2) => {
      if (!origDates.includes(date2)) {
        dates.push(date2);
      }
      return dates;
    }, origDates.filter((date2) => !newDates.includes(date2)));
  }
  return maxNumberOfDates && newDates.length > maxNumberOfDates ? newDates.slice(maxNumberOfDates * -1) : newDates;
}
function refreshUI(datepicker, mode = 3, quickRender = true, viewDate = void 0) {
  const { config, picker, inputField } = datepicker;
  if (mode & 2) {
    const newView = picker.active ? config.pickLevel : config.startView;
    picker.update(viewDate).changeView(newView).render(quickRender);
  }
  if (mode & 1 && inputField) {
    inputField.value = stringifyDates(datepicker.dates, config);
  }
}
function setDate(datepicker, inputDates, options) {
  const config = datepicker.config;
  let { clear, render, autohide, revert, forceRefresh, viewDate } = options;
  if (render === void 0) {
    render = true;
  }
  if (!render) {
    autohide = forceRefresh = false;
  } else if (autohide === void 0) {
    autohide = config.autohide;
  }
  viewDate = parseDate(viewDate, config.format, config.locale);
  const newDates = processInputDates(datepicker, inputDates, clear);
  if (!newDates && !revert) {
    return;
  }
  if (newDates && newDates.toString() !== datepicker.dates.toString()) {
    datepicker.dates = newDates;
    refreshUI(datepicker, render ? 3 : 1, true, viewDate);
    triggerDatepickerEvent(datepicker, "changeDate");
  } else {
    refreshUI(datepicker, forceRefresh ? 3 : 1, true, viewDate);
  }
  if (autohide) {
    datepicker.hide();
  }
}
function getOutputConverter(datepicker, format) {
  return format ? (date2) => formatDate(date2, format, datepicker.config.locale) : (date2) => new Date(date2);
}
var Datepicker = class {
  /**
   * Create a date picker
   * @param  {Element} element - element to bind a date picker
   * @param  {Object} [options] - config options
   * @param  {DateRangePicker} [rangepicker] - DateRangePicker instance the
   * date picker belongs to. Use this only when creating date picker as a part
   * of date range picker
   */
  constructor(element, options = {}, rangepicker = void 0) {
    element.datepicker = this;
    this.element = element;
    this.dates = [];
    const config = this.config = Object.assign({
      buttonClass: options.buttonClass && String(options.buttonClass) || "button",
      container: null,
      defaultViewDate: today(),
      maxDate: void 0,
      minDate: void 0
    }, processOptions(defaultOptions_default, this));
    let inputField;
    if (element.tagName === "INPUT") {
      inputField = this.inputField = element;
      inputField.classList.add("datepicker-input");
      if (options.container) {
        config.container = options.container instanceof HTMLElement ? options.container : document.querySelector(options.container);
      }
    } else {
      config.container = element;
    }
    if (rangepicker) {
      const index = rangepicker.inputs.indexOf(inputField);
      const datepickers = rangepicker.datepickers;
      if (index < 0 || index > 1 || !Array.isArray(datepickers)) {
        throw Error("Invalid rangepicker object.");
      }
      datepickers[index] = this;
      this.rangepicker = rangepicker;
      this.rangeSideIndex = index;
    }
    this._options = options;
    Object.assign(config, processOptions(options, this));
    config.shortcutKeys = createShortcutKeyConfig(options.shortcutKeys || {});
    const initialDates = stringToArray(
      element.value || element.dataset.date,
      config.dateDelimiter
    );
    delete element.dataset.date;
    const inputDateValues = processInputDates(this, initialDates);
    if (inputDateValues && inputDateValues.length > 0) {
      this.dates = inputDateValues;
    }
    if (inputField) {
      inputField.value = stringifyDates(this.dates, config);
    }
    const picker = this.picker = new Picker(this);
    const keydownListener = [element, "keydown", onKeydown.bind(null, this)];
    if (inputField) {
      registerListeners(this, [
        keydownListener,
        [inputField, "focus", onFocus.bind(null, this)],
        [inputField, "mousedown", onMousedown.bind(null, this)],
        [inputField, "click", onClickInput.bind(null, this)],
        [inputField, "paste", onPaste.bind(null, this)],
        // To detect a click on outside, just listening to mousedown is enough,
        // no need to listen to touchstart.
        // Actually, listening to touchstart can be a problem because, while
        // mousedown is fired only on tapping but not on swiping/pinching,
        // touchstart is fired on swiping/pinching as well.
        // (issue #95)
        [document, "mousedown", onClickOutside.bind(null, this)],
        [window, "resize", picker.place.bind(picker)]
      ]);
    } else {
      registerListeners(this, [keydownListener]);
      this.show();
    }
  }
  /**
   * Format Date object or time value in given format and language
   * @param  {Date|Number} date - date or time value to format
   * @param  {String|Object} format - format string or object that contains
   * toDisplay() custom formatter, whose signature is
   * - args:
   *   - date: {Date} - Date instance of the date passed to the method
   *   - format: {Object} - the format object passed to the method
   *   - locale: {Object} - locale for the language specified by `lang`
   * - return:
   *     {String} formatted date
   * @param  {String} [lang=en] - language code for the locale to use
   * @return {String} formatted date
   */
  static formatDate(date2, format, lang) {
    return formatDate(date2, format, lang && base_locales_default[lang] || base_locales_default.en);
  }
  /**
   * Parse date string
   * @param  {String|Date|Number} dateStr - date string, Date object or time
   * value to parse
   * @param  {String|Object} format - format string or object that contains
   * toValue() custom parser, whose signature is
   * - args:
   *   - dateStr: {String|Date|Number} - the dateStr passed to the method
   *   - format: {Object} - the format object passed to the method
   *   - locale: {Object} - locale for the language specified by `lang`
   * - return:
   *     {Date|Number} parsed date or its time value
   * @param  {String} [lang=en] - language code for the locale to use
   * @return {Number} time value of parsed date
   */
  static parseDate(dateStr, format, lang) {
    return parseDate(dateStr, format, lang && base_locales_default[lang] || base_locales_default.en);
  }
  /**
   * @type {Object} - Installed locales in `[languageCode]: localeObject` format
   * en`:_English (US)_ is pre-installed.
   */
  static get locales() {
    return base_locales_default;
  }
  /**
   * @type {Boolean} - Whether the picker element is shown. `true` whne shown
   */
  get active() {
    return !!(this.picker && this.picker.active);
  }
  /**
   * @type {HTMLDivElement} - DOM object of picker element
   */
  get pickerElement() {
    return this.picker ? this.picker.element : void 0;
  }
  /**
   * Set new values to the config options
   * @param {Object} options - config options to update
   */
  setOptions(options) {
    const newOptions = processOptions(options, this);
    Object.assign(this._options, options);
    Object.assign(this.config, newOptions);
    this.picker.setOptions(newOptions);
    refreshUI(this, 3);
  }
  /**
   * Show the picker element
   */
  show() {
    if (this.inputField) {
      const { config, inputField } = this;
      if (inputField.disabled || inputField.readOnly && !config.enableOnReadonly) {
        return;
      }
      if (!isActiveElement(inputField) && !config.disableTouchKeyboard) {
        this._showing = true;
        inputField.focus();
        delete this._showing;
      }
    }
    this.picker.show();
  }
  /**
   * Hide the picker element
   * Not available on inline picker
   */
  hide() {
    if (!this.inputField) {
      return;
    }
    this.picker.hide();
    this.picker.update().changeView(this.config.startView).render();
  }
  /**
   * Toggle the display of the picker element
   * Not available on inline picker
   *
   * Unlike hide(), the picker does not return to the start view when hiding.
   */
  toggle() {
    if (!this.picker.active) {
      this.show();
    } else if (this.inputField) {
      this.picker.hide();
    }
  }
  /**
   * Destroy the Datepicker instance
   * @return {Detepicker} - the instance destroyed
   */
  destroy() {
    this.hide();
    unregisterListeners(this);
    this.picker.detach();
    const element = this.element;
    element.classList.remove("datepicker-input");
    delete element.datepicker;
    return this;
  }
  /**
   * Get the selected date(s)
   *
   * The method returns a Date object of selected date by default, and returns
   * an array of selected dates in multidate mode. If format string is passed,
   * it returns date string(s) formatted in given format.
   *
   * @param  {String} [format] - format string to stringify the date(s)
   * @return {Date|String|Date[]|String[]} - selected date(s), or if none is
   * selected, empty array in multidate mode and undefined in sigledate mode
   */
  getDate(format = void 0) {
    const callback = getOutputConverter(this, format);
    if (this.config.multidate) {
      return this.dates.map(callback);
    }
    if (this.dates.length > 0) {
      return callback(this.dates[0]);
    }
  }
  /**
   * Set selected date(s)
   *
   * In multidate mode, you can pass multiple dates as a series of arguments
   * or an array. (Since each date is parsed individually, the type of the
   * dates doesn't have to be the same.)
   * The given dates are used to toggle the select status of each date. The
   * number of selected dates is kept from exceeding the length set to
   * maxNumberOfDates.
   *
   * With clear: true option, the method can be used to clear the selection
   * and to replace the selection instead of toggling in multidate mode.
   * If the option is passed with no date arguments or an empty dates array,
   * it works as "clear" (clear the selection then set nothing), and if the
   * option is passed with new dates to select, it works as "replace" (clear
   * the selection then set the given dates)
   *
   * When render: false option is used, the method omits re-rendering the
   * picker element. In this case, you need to call refresh() method later in
   * order for the picker element to reflect the changes. The input field is
   * refreshed always regardless of this option.
   *
   * When invalid (unparsable, repeated, disabled or out-of-range) dates are
   * passed, the method ignores them and applies only valid ones. In the case
   * that all the given dates are invalid, which is distinguished from passing
   * no dates, the method considers it as an error and leaves the selection
   * untouched. (The input field also remains untouched unless revert: true
   * option is used.)
   * Replacing the selection with the same date(s) also causes a similar
   * situation. In both cases, the method does not refresh the picker element
   * unless forceRefresh: true option is used.
   *
   * If viewDate option is used, the method changes the focused date to the
   * specified date instead of the last item of the selection.
   *
   * @param {...(Date|Number|String)|Array} [dates] - Date strings, Date
   * objects, time values or mix of those for new selection
   * @param {Object} [options] - function options
   * - clear: {boolean} - Whether to clear the existing selection
   *     defualt: false
   * - render: {boolean} - Whether to re-render the picker element
   *     default: true
   * - autohide: {boolean} - Whether to hide the picker element after re-render
   *     Ignored when used with render: false
   *     default: config.autohide
   * - revert: {boolean} - Whether to refresh the input field when all the
   *     passed dates are invalid
   *     default: false
   * - forceRefresh: {boolean} - Whether to refresh the picker element when
   *     passed dates don't change the existing selection
   *     default: false
   * - viewDate: {Date|Number|String} - Date to be focused after setiing date(s)
   *     default: The last item of the resulting selection, or defaultViewDate
   *     config option if none is selected
   */
  setDate(...args) {
    const dates = [...args];
    const opts = {};
    const lastArg = lastItemOf(args);
    if (lastArg && typeof lastArg === "object" && !Array.isArray(lastArg) && !(lastArg instanceof Date)) {
      Object.assign(opts, dates.pop());
    }
    const inputDates = Array.isArray(dates[0]) ? dates[0] : dates;
    setDate(this, inputDates, opts);
  }
  /**
   * Update the selected date(s) with input field's value
   * Not available on inline picker
   *
   * The input field will be refreshed with properly formatted date string.
   *
   * In the case that all the entered dates are invalid (unparsable, repeated,
   * disabled or out-of-range), which is distinguished from empty input field,
   * the method leaves the input field untouched as well as the selection by
   * default. If revert: true option is used in this case, the input field is
   * refreshed with the existing selection.
   * The method also doesn't refresh the picker element in this case and when
   * the entered dates are the same as the existing selection. If
   * forceRefresh: true option is used, the picker element is refreshed in
   * these cases too.
   *
   * @param  {Object} [options] - function options
   * - autohide: {boolean} - whether to hide the picker element after refresh
   *     default: false
   * - revert: {boolean} - Whether to refresh the input field when all the
   *     passed dates are invalid
   *     default: false
   * - forceRefresh: {boolean} - Whether to refresh the picer element when
   *     input field's value doesn't change the existing selection
   *     default: false
   */
  update(options = void 0) {
    if (!this.inputField) {
      return;
    }
    const opts = Object.assign(options || {}, { clear: true, render: true, viewDate: void 0 });
    const inputDates = stringToArray(this.inputField.value, this.config.dateDelimiter);
    setDate(this, inputDates, opts);
  }
  /**
   * Get the focused date
   *
   * The method returns a Date object of focused date by default. If format
   * string is passed, it returns date string formatted in given format.
   *
   * @param  {String} [format] - format string to stringify the date
   * @return {Date|String} - focused date (viewDate)
   */
  getFocusedDate(format = void 0) {
    return getOutputConverter(this, format)(this.picker.viewDate);
  }
  /**
   * Set focused date
   *
   * By default, the method updates the focus on the view shown at the time,
   * or the one set to the startView config option if the picker is hidden.
   * When resetView: true is passed, the view displayed is changed to the
   * pickLevel config option's if the picker is shown.
   *
   * @param {Date|Number|String} viewDate - date string, Date object, time
   * values of the date to focus
   * @param {Boolean} [resetView] - whether to change the view to pickLevel
   * config option's when the picker is shown. Ignored when the picker is
   * hidden
   */
  setFocusedDate(viewDate, resetView = false) {
    const { config, picker, active, rangeSideIndex } = this;
    const pickLevel = config.pickLevel;
    const newViewDate = parseDate(viewDate, config.format, config.locale);
    if (newViewDate === void 0) {
      return;
    }
    picker.changeFocus(regularizeDate(newViewDate, pickLevel, rangeSideIndex));
    if (active && resetView) {
      picker.changeView(pickLevel);
    }
    picker.render();
  }
  /**
   * Refresh the picker element and the associated input field
   * @param {String} [target] - target item when refreshing one item only
   * 'picker' or 'input'
   * @param {Boolean} [forceRender] - whether to re-render the picker element
   * regardless of its state instead of optimized refresh
   */
  refresh(target = void 0, forceRender = false) {
    if (target && typeof target !== "string") {
      forceRender = target;
      target = void 0;
    }
    let mode;
    if (target === "picker") {
      mode = 2;
    } else if (target === "input") {
      mode = 1;
    } else {
      mode = 3;
    }
    refreshUI(this, mode, !forceRender);
  }
  /**
   * Enter edit mode
   * Not available on inline picker or when the picker element is hidden
   */
  enterEditMode() {
    const inputField = this.inputField;
    if (!inputField || inputField.readOnly || !this.picker.active || this.editMode) {
      return;
    }
    this.editMode = true;
    inputField.classList.add("in-edit");
  }
  /**
   * Exit from edit mode
   * Not available on inline picker
   * @param  {Object} [options] - function options
   * - update: {boolean} - whether to call update() after exiting
   *     If false, input field is revert to the existing selection
   *     default: false
   */
  exitEditMode(options = void 0) {
    if (!this.inputField || !this.editMode) {
      return;
    }
    const opts = Object.assign({ update: false }, options);
    delete this.editMode;
    this.inputField.classList.remove("in-edit");
    if (opts.update) {
      this.update(opts);
    }
  }
};

// ns-hugo-imp:/home/runner/work/docs-v2/docs-v2/assets/js/custom-timestamps.js
var defaultStartDate = "2022-01-01";
function formatDate2(dateObj) {
  return dateObj.toISOString().replace(/T.*$/, "");
}
function yesterday() {
  const yesterday2 = /* @__PURE__ */ new Date();
  yesterday2.setDate(yesterday2.getDate() - 1);
  return formatDate2(yesterday2);
}
function datePart(date2) {
  const datePartRegex = /(\d{4})-(\d{2})-(\d{2})/;
  const year = date2.replace(datePartRegex, "$1");
  const month = date2.replace(datePartRegex, "$2");
  const day = date2.replace(datePartRegex, "$3");
  return { year, month, day };
}
var prefID = "sample_get_started_date";
function setStartDate(setDate2) {
  setPreference(prefID, setDate2);
}
function getStartDate() {
  return getPreference(prefID);
}
var startDate = getStartDate() || yesterday();
function timeToUnixSeconds(time) {
  const unixSeconds = new Date(time).getTime() / 1e3;
  return unixSeconds;
}
var defaultTimes = [
  {
    rfc3339: `${defaultStartDate}T08:00:00Z`,
    unix: timeToUnixSeconds(`${defaultStartDate}T08:00:00Z`)
  },
  // 1641024000
  {
    rfc3339: `${defaultStartDate}T09:00:00Z`,
    unix: timeToUnixSeconds(`${defaultStartDate}T09:00:00Z`)
  },
  // 1641027600
  {
    rfc3339: `${defaultStartDate}T10:00:00Z`,
    unix: timeToUnixSeconds(`${defaultStartDate}T10:00:00Z`)
  },
  // 1641031200
  {
    rfc3339: `${defaultStartDate}T11:00:00Z`,
    unix: timeToUnixSeconds(`${defaultStartDate}T11:00:00Z`)
  },
  // 1641034800
  {
    rfc3339: `${defaultStartDate}T12:00:00Z`,
    unix: timeToUnixSeconds(`${defaultStartDate}T12:00:00Z`)
  },
  // 1641038400
  {
    rfc3339: `${defaultStartDate}T13:00:00Z`,
    unix: timeToUnixSeconds(`${defaultStartDate}T13:00:00Z`)
  },
  // 1641042000
  {
    rfc3339: `${defaultStartDate}T14:00:00Z`,
    unix: timeToUnixSeconds(`${defaultStartDate}T14:00:00Z`)
  },
  // 1641045600
  {
    rfc3339: `${defaultStartDate}T15:00:00Z`,
    unix: timeToUnixSeconds(`${defaultStartDate}T15:00:00Z`)
  },
  // 1641049200
  {
    rfc3339: `${defaultStartDate}T16:00:00Z`,
    unix: timeToUnixSeconds(`${defaultStartDate}T16:00:00Z`)
  },
  // 1641052800
  {
    rfc3339: `${defaultStartDate}T17:00:00Z`,
    unix: timeToUnixSeconds(`${defaultStartDate}T17:00:00Z`)
  },
  // 1641056400
  {
    rfc3339: `${defaultStartDate}T18:00:00Z`,
    unix: timeToUnixSeconds(`${defaultStartDate}T18:00:00Z`)
  },
  // 1641060000
  {
    rfc3339: `${defaultStartDate}T19:00:00Z`,
    unix: timeToUnixSeconds(`${defaultStartDate}T19:00:00Z`)
  },
  // 1641063600
  {
    rfc3339: `${defaultStartDate}T20:00:00Z`,
    unix: timeToUnixSeconds(`${defaultStartDate}T20:00:00Z`)
  }
  // 1641067200
];
function updateTextNode(node, times) {
  if (node.nodeType === Node.TEXT_NODE) {
    let text = node.textContent;
    times.forEach(function(x) {
      const oldDatePart = datePart(x.rfc3339.replace(/T.*$/, ""));
      const newDatePart = datePart(x.rfc3339_new.replace(/T.*$/, ""));
      const rfc3339Regex = new RegExp(
        `${oldDatePart.year}(.*?)${oldDatePart.month}(.*?)${oldDatePart.day}`,
        "g"
      );
      const rfc3339Repl = `${newDatePart.year}$1${newDatePart.month}$2${newDatePart.day}`;
      text = text.replaceAll(x.unix, x.unix_new).replace(rfc3339Regex, rfc3339Repl);
    });
    node.textContent = text;
  }
}
function updateTimestampsInElement(element, times) {
  if (element.classList && element.classList.contains("code-placeholder")) {
    return;
  }
  if (element.hasAttribute && element.hasAttribute("data-component")) {
    return;
  }
  const childNodes = Array.from(element.childNodes);
  childNodes.forEach((child) => {
    if (child.nodeType === Node.TEXT_NODE) {
      updateTextNode(child, times);
    } else if (child.nodeType === Node.ELEMENT_NODE) {
      updateTimestampsInElement(child, times);
    }
  });
}
function updateTimestamps(newStartDate, seedTimes = defaultTimes) {
  const times = seedTimes.map((x) => {
    var newStartTimestamp = x.rfc3339.replace(/^.*T/, newStartDate + "T");
    return {
      rfc3339: x.rfc3339,
      unix: x.unix,
      rfc3339_new: newStartTimestamp,
      unix_new: timeToUnixSeconds(newStartTimestamp)
    };
  });
  var updateBlockElWhitelist = [
    ".custom-timestamps pre",
    ".custom-timestamps li",
    ".custom-timestamps p",
    ".custom-timestamps table"
  ];
  (0, import_jquery10.default)(updateBlockElWhitelist.join()).each(function() {
    updateTimestampsInElement(this, times);
  });
  (0, import_jquery10.default)("span.custom-timestamps").each(function() {
    updateTimestampsInElement(this, times);
  });
  return times.map((x) => {
    var newStartTimestamp = x.rfc3339.replace(/^.*T/, newStartDate + "T");
    return {
      rfc3339: newStartTimestamp,
      unix: timeToUnixSeconds(newStartTimestamp)
    };
  });
}
function CustomTimeTrigger({ component }) {
  const $component = (0, import_jquery10.default)(component);
  $component.find('a[data-action="open"]:first').on("click", () => toggleModal("#influxdb-gs-date-select"));
  var datePickerEl = (0, import_jquery10.default)("#custom-date-selector");
  const elem = datePickerEl[0];
  const datepicker = new Datepicker(elem, {
    defaultViewDate: startDate,
    format: "yyyy-mm-dd",
    nextArrow: ">",
    prevArrow: "<"
  });
  let updatedTimes = updateTimestamps(startDate, defaultTimes);
  if (startDate === yesterday()) {
    setStartDate(startDate);
  }
  (0, import_jquery10.default)("#submit-custom-date").click(function() {
    let newDate = datepicker.getDate();
    if (newDate != void 0) {
      newDate = formatDate2(newDate);
      updatedTimes = updateTimestamps(newDate, updatedTimes);
      setStartDate(newDate);
      toggleModal("#influxdb-gs-date-select");
    } else {
      toggleModal("#influxdb-gs-date-select");
    }
  });
}

// ns-hugo-params:/home/runner/work/docs-v2/docs-v2/assets/js/components/diagram.js
var diagramRendererModuleUrl = "/docs-v2/pr-preview/pr-7424/js/diagram-renderer.js";

// ns-hugo-imp:/home/runner/work/docs-v2/docs-v2/assets/js/components/diagram.js
var rendererPromise = null;
function Diagram({ component }) {
  if (!rendererPromise) {
    if (!diagramRendererModuleUrl) {
      console.error("Diagram renderer module URL is not configured.");
      return;
    }
    rendererPromise = import(diagramRendererModuleUrl);
  }
  rendererPromise.then(({ default: renderer }) => {
    renderer.initialize({
      startOnLoad: false,
      // We'll manually call run()
      theme: document.body.classList.contains("dark-theme") ? "dark" : "default",
      themeVariables: {
        fontFamily: "Proxima Nova",
        fontSize: "16px",
        lineColor: "#22ADF6",
        primaryColor: "#22ADF6",
        primaryTextColor: "#545454",
        secondaryColor: "#05CE78",
        tertiaryColor: "#f4f5f5"
      },
      securityLevel: "loose",
      // Required for interactive diagrams
      logLevel: "error"
    });
    try {
      renderer.run({ nodes: [component] });
    } catch (error) {
      console.error("Diagram rendering error:", error);
    }
    if (!window.diagramRendererInstances) {
      window.diagramRendererInstances = /* @__PURE__ */ new Map();
    }
    window.diagramRendererInstances.set(component, renderer);
  }).catch((error) => {
    console.error("Failed to load Mermaid library:", error);
  });
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === "class" && document.body.classList.contains("dark-theme") !== window.isDarkTheme) {
        window.isDarkTheme = document.body.classList.contains("dark-theme");
        if (window.diagramRendererInstances?.has(component)) {
          const renderer = window.diagramRendererInstances.get(component);
          renderer.initialize({
            theme: window.isDarkTheme ? "dark" : "default"
          });
          renderer.run({ nodes: [component] });
        }
      }
    });
  });
  observer.observe(document.body, { attributes: true });
  return () => {
    observer.disconnect();
    if (window.diagramRendererInstances?.has(component)) {
      window.diagramRendererInstances.delete(component);
    }
  };
}

// ns-hugo-imp:/home/runner/work/docs-v2/docs-v2/assets/js/components/doc-search.js
var debug = false;
function DocSearch({ component }) {
  const config = {
    apiKey: component.getAttribute("data-api-key"),
    appId: component.getAttribute("data-app-id"),
    indexName: component.getAttribute("data-index-name"),
    inputSelector: component.getAttribute("data-input-selector"),
    searchTag: component.getAttribute("data-search-tag"),
    includeFlux: component.getAttribute("data-include-flux") === "true",
    includeResources: component.getAttribute("data-include-resources") === "true",
    debug: component.getAttribute("data-debug") === "true"
  };
  window.InfluxDocs = window.InfluxDocs || {};
  window.InfluxDocs.search = {
    initialized: false,
    options: config
  };
  function loadDocSearch() {
    if (debug) {
      console.log("Loading DocSearch script...");
    }
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/docsearch.js@2/dist/cdn/docsearch.min.js";
    script.async = true;
    script.onload = initializeDocSearch;
    document.body.appendChild(script);
  }
  function initializeDocSearch() {
    if (debug) {
      console.log("Initializing DocSearch...");
    }
    const multiVersion = ["influxdb"];
    const versionDisplayNames = {
      cloud: "Cloud (TSM)",
      core: "Core",
      enterprise: "Enterprise",
      "cloud-serverless": "Cloud Serverless",
      "cloud-dedicated": "Cloud Dedicated",
      clustered: "Clustered",
      explorer: "Explorer",
      controller: "Controller"
    };
    const productDisplayNames = {
      influxdb: "InfluxDB",
      influxdb3: "InfluxDB 3",
      explorer: "InfluxDB 3 Explorer",
      enterprise_influxdb: "InfluxDB Enterprise",
      flux: "Flux",
      telegraf: "Telegraf",
      controller: "Telegraf Controller",
      chronograf: "Chronograf",
      kapacitor: "Kapacitor",
      platform: "InfluxData Platform",
      resources: "Additional Resources"
    };
    window.docsearch({
      apiKey: config.apiKey,
      appId: config.appId,
      indexName: config.indexName,
      inputSelector: config.inputSelector,
      debug: config.debug,
      transformData: function(hits) {
        function fmtVersion(version2, productKey) {
          if (version2 == null) {
            return "";
          } else if (versionDisplayNames[version2]) {
            return versionDisplayNames[version2];
          } else if (multiVersion.includes(productKey)) {
            return version2;
          } else {
            return "";
          }
        }
        hits.map((hit) => {
          const pathData = new URL(hit.url).pathname.split("/").filter((n) => n);
          const product2 = productDisplayNames[pathData[0]] || pathData[0];
          const version2 = fmtVersion(pathData[1], pathData[0]);
          hit.product = product2;
          hit.version = version2;
          hit.hierarchy.lvl0 = hit.hierarchy.lvl0 + ` <span class="search-product-version">${product2} ${version2}</span>`;
          hit._highlightResult.hierarchy.lvl0.value = hit._highlightResult.hierarchy.lvl0.value + ` <span class="search-product-version">${product2} ${version2}</span>`;
        });
        return hits;
      },
      algoliaOptions: {
        hitsPerPage: 10,
        facetFilters: buildFacetFilters(config)
      },
      autocompleteOptions: {
        templates: {
          header: '<div class="search-all-content"><a href="https://support.influxdata.com" target="_blank">Search all InfluxData content <span class="icon-arrow-up-right"></span></a>',
          empty: `<div class="search-no-results"><p>Not finding what you're looking for?</p> <a href="https://support.influxdata.com" target="_blank">Search all InfluxData content <span class="icon-arrow-up-right"></span></a></div>`
        }
      }
    });
    window.InfluxDocs.search.initialized = true;
    window.dispatchEvent(new CustomEvent("docsearch-initialized"));
  }
  function buildFacetFilters(config2) {
    if (!config2.searchTag) {
      return ["latest:true"];
    } else if (config2.includeFlux) {
      return [
        [
          "searchTag: " + config2.searchTag,
          "flux:true",
          "resources: " + config2.includeResources
        ]
      ];
    } else {
      return [
        [
          "searchTag: " + config2.searchTag,
          "resources: " + config2.includeResources
        ]
      ];
    }
  }
  if ("requestIdleCallback" in window) {
    requestIdleCallback(loadDocSearch);
  } else {
    setTimeout(loadDocSearch, 500);
  }
  return function cleanup() {
    if (debug) {
      console.log("DocSearch component cleanup");
    }
  };
}

// ns-hugo-imp:/home/runner/work/docs-v2/docs-v2/assets/js/components/download-external.ts
function filenameFromUrl(url) {
  try {
    const { pathname } = new URL(url, window.location.href);
    const base = pathname.split("/").pop();
    return base || "download";
  } catch {
    return "download";
  }
}
async function downloadAsFile(url, filename) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(objectUrl), 1e3);
}
function DownloadExternal({ component }) {
  if (!(component instanceof HTMLAnchorElement)) {
    console.warn(
      "download-external: expected an <a> element, got",
      component.tagName
    );
    return;
  }
  const anchor = component;
  anchor.addEventListener("click", async (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    const url = anchor.href;
    if (!url) return;
    const filename = anchor.dataset.filename || anchor.getAttribute("download") || filenameFromUrl(url);
    event.preventDefault();
    try {
      await downloadAsFile(url, filename);
    } catch (error) {
      console.warn(
        "download-external: fetch failed, falling back to navigation",
        error
      );
      window.location.href = url;
    }
  });
  return { element: anchor };
}

// ns-hugo-imp:/home/runner/work/docs-v2/docs-v2/assets/js/feature-callouts.js
var import_jquery11 = __toESM(require_jquery());
function getCalloutID(el) {
  return (0, import_jquery11.default)(el).attr("id");
}
function FeatureCallout({ component }) {
  const calloutID = getCalloutID((0, import_jquery11.default)(component));
  if (!notificationIsRead(calloutID, "callout")) {
    (0, import_jquery11.default)(`#${calloutID}.feature-callout`).fadeIn(300).removeClass("start-position");
  }
}

// ns-hugo-imp:/home/runner/work/docs-v2/docs-v2/assets/js/flux-group-keys.js
var import_jquery12 = __toESM(require_jquery());
var data = [
  [
    {
      _time: "2021-01-01T00:00:00Z",
      _measurement: "example",
      loc: "rm1",
      sensorID: "A123",
      _field: "temp",
      _value: 110.3
    },
    {
      _time: "2021-01-01T00:01:00Z",
      _measurement: "example",
      loc: "rm1",
      sensorID: "A123",
      _field: "temp",
      _value: 112.5
    },
    {
      _time: "2021-01-01T00:02:00Z",
      _measurement: "example",
      loc: "rm1",
      sensorID: "A123",
      _field: "temp",
      _value: 111.9
    }
  ],
  [
    {
      _time: "2021-01-01T00:00:00Z",
      _measurement: "example",
      loc: "rm1",
      sensorID: "A123",
      _field: "hum",
      _value: 73.4
    },
    {
      _time: "2021-01-01T00:01:00Z",
      _measurement: "example",
      loc: "rm1",
      sensorID: "A123",
      _field: "hum",
      _value: 73.7
    },
    {
      _time: "2021-01-01T00:02:00Z",
      _measurement: "example",
      loc: "rm1",
      sensorID: "A123",
      _field: "hum",
      _value: 75.1
    }
  ],
  [
    {
      _time: "2021-01-01T00:00:00Z",
      _measurement: "example",
      loc: "rm2",
      sensorID: "B456",
      _field: "temp",
      _value: 108.2
    },
    {
      _time: "2021-01-01T00:01:00Z",
      _measurement: "example",
      loc: "rm2",
      sensorID: "B456",
      _field: "temp",
      _value: 108.5
    },
    {
      _time: "2021-01-01T00:02:00Z",
      _measurement: "example",
      loc: "rm2",
      sensorID: "B456",
      _field: "temp",
      _value: 109.6
    }
  ],
  [
    {
      _time: "2021-01-01T00:00:00Z",
      _measurement: "example",
      loc: "rm2",
      sensorID: "B456",
      _field: "hum",
      _value: 71.8
    },
    {
      _time: "2021-01-01T00:01:00Z",
      _measurement: "example",
      loc: "rm2",
      sensorID: "B456",
      _field: "hum",
      _value: 72.3
    },
    {
      _time: "2021-01-01T00:02:00Z",
      _measurement: "example",
      loc: "rm2",
      sensorID: "B456",
      _field: "hum",
      _value: 72.1
    }
  ]
];
var groupKey = ["_measurement", "loc", "sensorID", "_field"];
function FluxGroupKeysDemo({ component }) {
  (0, import_jquery12.default)(".column-list label").click(function() {
    toggleCheckbox((0, import_jquery12.default)(this));
    groupKey = getChecked(component);
    groupData();
    buildGroupExample(component);
  });
  groupData();
}
function buildTable(inputData) {
  function wrapString(column, value) {
    var stringColumns = ["_measurement", "loc", "sensorID", "_field"];
    if (stringColumns.includes(column)) {
      return '"' + value + '"';
    } else {
      return value;
    }
  }
  var groupKeyString = "Group key instance = [" + groupKey.map((column) => column + ": " + wrapString(column, inputData[0][column])).join(", ") + "]";
  var groupKeyLabel = document.createElement("p");
  groupKeyLabel.className = "table-group-key";
  groupKeyLabel.innerHTML = groupKeyString;
  var columns = [];
  for (var i = 0; i < inputData.length; i++) {
    for (var key in inputData[i]) {
      if (columns.indexOf(key) === -1) {
        columns.push(key);
      }
    }
  }
  const table = document.createElement("table");
  for (let i2 = 0; i2 < columns.length; i2++) {
    var header = table.createTHead();
    var th = document.createElement("th");
    th.innerHTML = columns[i2];
    if (groupKey.includes(columns[i2])) {
      th.className = "grouped-by";
    }
    header.appendChild(th);
  }
  for (let i2 = 0; i2 < inputData.length; i2++) {
    let tr = table.insertRow(-1);
    for (let j = 0; j < columns.length; j++) {
      var td = tr.insertCell(-1);
      td.innerHTML = inputData[i2][columns[j]];
      if (groupKey.includes(columns[j])) {
        td.className = "grouped-by";
      }
    }
  }
  var tableGroup = document.createElement("div");
  tableGroup.innerHTML += groupKeyLabel.outerHTML + table.outerHTML;
  return tableGroup;
}
function buildTables(data2) {
  let tablesElement = (0, import_jquery12.default)("#flux-group-keys-demo #grouped-tables");
  let existingTables = tablesElement[0];
  while (existingTables.firstChild) {
    existingTables.removeChild(existingTables.firstChild);
  }
  for (let i = 0; i < data2.length; i++) {
    var table = buildTable(data2[i]);
    tablesElement.append(table);
  }
}
function groupData() {
  let groupedData = data.flat();
  function groupBy(array, f) {
    var groups = {};
    array.forEach(function(o) {
      var group = JSON.stringify(f(o));
      groups[group] = groups[group] || [];
      groups[group].push(o);
    });
    return Object.keys(groups).map(function(group) {
      return groups[group];
    });
  }
  groupedData = groupBy(groupedData, function(r) {
    return groupKey.map((v) => r[v]);
  });
  buildTables(groupedData);
}
function getChecked(component) {
  var checkboxes = (0, import_jquery12.default)(component).find("input[type=checkbox]");
  var checked = [];
  for (var i = 0; i < checkboxes.length; i++) {
    var checkbox = checkboxes[i];
    if (checkbox.checked) checked.push(checkbox.name);
  }
  return checked;
}
function toggleCheckbox(element) {
  element.checked = !element.checked;
}
function buildGroupExample(component) {
  var columnCollection = getChecked(component).map((i) => '<span class="s2">"' + i + '"</span>').join(", ");
  (0, import_jquery12.default)("pre#group-by-example")[0].innerHTML = "data\n  <span class='nx'>|></span> group(columns<span class='nx'>:</span> [" + columnCollection + "])";
}

// ns-hugo-imp:/home/runner/work/docs-v2/docs-v2/assets/js/components/flux-influxdb-versions.ts
var FLUX_MODAL_SELECTOR = ".modal-content#flux-influxdb-versions";
var FLUX_MODAL_ID = "#flux-influxdb-versions";
function keysPresent() {
  const list = $(`${FLUX_MODAL_SELECTOR} .version-list`);
  return {
    pending: list.find(".pending").length !== 0,
    deprecated: list.find(".deprecated").length !== 0,
    supported: list.find(".supported").length !== 0
  };
}
function openFluxVersionModal(queryParams) {
  const anchor = window.location.hash;
  toggleModal(FLUX_MODAL_ID);
  queryParams.set("view", "influxdb-support");
  window.history.replaceState(
    {},
    "",
    `${location.pathname}?${queryParams}${anchor}`
  );
}
function FluxInfluxDBVersionsTrigger({
  component
}) {
  const pageType = document.title.includes("package") ? "package" : "function";
  if ($(FLUX_MODAL_SELECTOR).length > 0) {
    const presentKeys = keysPresent();
    if (!presentKeys.pending) {
      $(`${FLUX_MODAL_SELECTOR} .color-key #pending-key`).remove();
    }
    if (!presentKeys.deprecated) {
      $(`${FLUX_MODAL_SELECTOR} .color-key #deprecated-key`).remove();
    }
    if (!presentKeys.pending && !presentKeys.deprecated) {
      $(`${FLUX_MODAL_SELECTOR} .color-key`).remove();
    }
    if (Object.values(presentKeys).every((v) => !v)) {
      $(
        `${FLUX_MODAL_SELECTOR} .influxdb-versions > :not(".more-info")`
      ).remove();
      $(`${FLUX_MODAL_SELECTOR} .influxdb-versions`).prepend(
        `<p class="no-support">No versions of InfluxDB currently support this ${pageType}.</p>`
      );
    }
  }
  const queryParams = new URLSearchParams(window.location.search);
  if (queryParams.get("view") !== null) {
    openFluxVersionModal(queryParams);
  }
  const trigger = component.dataset.action === "open" ? component : component.querySelector('[data-action="open"]');
  trigger?.addEventListener("click", () => openFluxVersionModal(queryParams));
}

// ns-hugo-imp:/home/runner/work/docs-v2/docs-v2/assets/js/components/format-selector.ts
function FormatSelector(options) {
  const { component } = options;
  let isOpen = false;
  let config = {
    pageType: "leaf",
    markdownUrl: "",
    pageTitle: "",
    pageUrl: "",
    chatGptUrl: "",
    claudeUrl: ""
  };
  const button = component.querySelector("button");
  const dropdownMenu = component.querySelector(
    "[data-dropdown-menu]"
  );
  if (!button || !dropdownMenu) {
    console.error("Format selector: Missing required elements");
    return;
  }
  const INTENT_EVENT_MAP = {
    "open-chatgpt": "open_chatgpt",
    "open-claude": "open_claude",
    "connect-mcp-docs": "connect_mcp"
  };
  function emitFormatEvent(action, extras = {}) {
    if (typeof window.gtag === "undefined") return;
    const pagePath = window.location.pathname;
    window.gtag("event", "ai_format_action", {
      action,
      page_type: config.pageType,
      page_path: pagePath,
      product: getProductKeyFromPath(pagePath) ?? null,
      ...extras
    });
  }
  function initConfig() {
    const currentUrl = window.location.href;
    const currentPath = window.location.pathname;
    const childCount = parseInt(component.dataset.childCount || "0", 10);
    const pageType = childCount > 0 ? "branch" : "leaf";
    let markdownUrl = currentPath;
    if (!markdownUrl.endsWith(".md")) {
      if (!markdownUrl.endsWith("/")) {
        markdownUrl += "/";
      }
      markdownUrl += "index.md";
    }
    let sectionMarkdownUrl;
    if (pageType === "branch") {
      sectionMarkdownUrl = markdownUrl.replace("index.md", "index.section.md");
    }
    const pageTitle = document.querySelector('meta[property="og:title"]')?.getAttribute("content") || document.querySelector("h1")?.textContent || document.title;
    config = {
      pageType,
      markdownUrl,
      sectionMarkdownUrl,
      pageTitle,
      pageUrl: currentUrl,
      childPageCount: childCount,
      estimatedTokens: parseInt(component.dataset.estimatedTokens || "0", 10),
      sectionDownloadUrl: component.dataset.sectionDownloadUrl,
      // AI integration URLs
      chatGptUrl: generateChatGPTUrl(pageTitle, currentUrl, markdownUrl),
      claudeUrl: generateClaudeUrl(pageTitle, currentUrl, markdownUrl),
      // Documentation MCP server link
      mcpDocsUrl: component.dataset.mcpDocsUrl
    };
    updateButtonLabel();
  }
  function updateButtonLabel() {
    const label = config.pageType === "leaf" ? "Copy page for AI" : "Copy section for AI";
    const buttonText = button.querySelector("[data-button-text]");
    if (buttonText) {
      buttonText.textContent = label;
    }
  }
  function generateChatGPTUrl(title, pageUrl, markdownUrl) {
    const baseUrl = "https://chatgpt.com";
    const markdownFullUrl = `${window.location.origin}${markdownUrl}`;
    const prompt = `Read from ${markdownFullUrl} so I can ask questions about it.`;
    return `${baseUrl}/?q=${encodeURIComponent(prompt)}`;
  }
  function generateClaudeUrl(title, pageUrl, markdownUrl) {
    const baseUrl = "https://claude.ai/new";
    const markdownFullUrl = `${window.location.origin}${markdownUrl}`;
    const prompt = `Read from ${markdownFullUrl} so I can ask questions about it.`;
    return `${baseUrl}?q=${encodeURIComponent(prompt)}`;
  }
  async function fetchMarkdownContent() {
    try {
      const response = await fetch(config.markdownUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch Markdown: ${response.statusText}`);
      }
      return await response.text();
    } catch (error) {
      console.error("Error fetching Markdown content:", error);
      throw error;
    }
  }
  async function copyToClipboard2(text) {
    try {
      await navigator.clipboard.writeText(text);
      showNotification("Copied to clipboard!", "success");
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      showNotification("Failed to copy to clipboard", "error");
      throw error;
    }
  }
  function showNotification(message, type) {
    console.log(`[${type.toUpperCase()}] ${message}`);
    const notification = document.createElement("div");
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      padding: 12px 20px;
      background: ${type === "success" ? "#10b981" : "#ef4444"};
      color: white;
      border-radius: 6px;
      z-index: 10000;
      font-size: 14px;
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3e3);
  }
  async function handleCopyPage() {
    try {
      const markdown = await fetchMarkdownContent();
      await copyToClipboard2(markdown);
      emitFormatEvent("copy_page_md");
      closeDropdown();
    } catch (error) {
      console.error("Failed to copy page:", error);
      emitFormatEvent("copy_failed", { action_target: "copy_page_md" });
    }
  }
  async function handleCopySection() {
    try {
      const url = config.sectionMarkdownUrl || config.markdownUrl;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch section markdown: ${response.statusText}`
        );
      }
      const markdown = await response.text();
      await copyToClipboard2(markdown);
      emitFormatEvent("copy_section_md");
      showNotification("Section copied to clipboard", "success");
      closeDropdown();
    } catch (error) {
      console.error("Failed to copy section:", error);
      emitFormatEvent("copy_failed", { action_target: "copy_section_md" });
      showNotification("Failed to copy section", "error");
    }
  }
  function handleExternalLink(url) {
    window.open(url, "_blank", "noopener,noreferrer");
    closeDropdown();
  }
  function buildOptions() {
    const options2 = [];
    if (config.pageType === "leaf") {
      options2.push({
        label: "Copy page for AI",
        sublabel: "Clean Markdown optimized for AI assistants",
        icon: "document",
        action: handleCopyPage,
        external: false,
        visible: true,
        dataAttribute: "copy-page"
      });
    } else {
      options2.push({
        label: "Copy section for AI",
        sublabel: `${config.childPageCount} pages combined as clean Markdown for AI assistants`,
        icon: "document",
        action: handleCopySection,
        external: false,
        visible: true,
        dataAttribute: "copy-section"
      });
    }
    options2.push({
      label: "Open in ChatGPT",
      sublabel: "Ask questions about this page",
      icon: "chatgpt",
      action: () => handleExternalLink(config.chatGptUrl),
      href: config.chatGptUrl,
      target: "_blank",
      external: true,
      visible: true,
      dataAttribute: "open-chatgpt"
    });
    options2.push({
      label: "Open in Claude",
      sublabel: "Ask questions about this page",
      icon: "claude",
      action: () => handleExternalLink(config.claudeUrl),
      href: config.claudeUrl,
      target: "_blank",
      external: true,
      visible: true,
      dataAttribute: "open-claude"
    });
    if (config.mcpDocsUrl) {
      options2.push({
        label: "Connect to documentation MCP",
        sublabel: "Query docs from your IDE with AI agents",
        icon: "mcp",
        action: () => handleExternalLink(config.mcpDocsUrl),
        href: config.mcpDocsUrl,
        target: "_blank",
        external: true,
        visible: true,
        dataAttribute: "connect-mcp-docs"
      });
    }
    return options2.filter((opt) => opt.visible);
  }
  function getIconSVG(iconName) {
    const icons = {
      document: `<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 2C4.89543 2 4 2.89543 4 4V16C4 17.1046 4.89543 18 6 18H14C15.1046 18 16 17.1046 16 16V7L11 2H6Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M11 2V7H16" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`,
      chatgpt: `<svg viewBox="0 0 721 721" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_chatgpt)">
          <path d="M304.246 294.611V249.028C304.246 245.189 305.687 242.309 309.044 240.392L400.692 187.612C413.167 180.415 428.042 177.058 443.394 177.058C500.971 177.058 537.44 221.682 537.44 269.182C537.44 272.54 537.44 276.379 536.959 280.218L441.954 224.558C436.197 221.201 430.437 221.201 424.68 224.558L304.246 294.611ZM518.245 472.145V363.224C518.245 356.505 515.364 351.707 509.608 348.349L389.174 278.296L428.519 255.743C431.877 253.826 434.757 253.826 438.115 255.743L529.762 308.523C556.154 323.879 573.905 356.505 573.905 388.171C573.905 424.636 552.315 458.225 518.245 472.141V472.145ZM275.937 376.182L236.592 353.152C233.235 351.235 231.794 348.354 231.794 344.515V238.956C231.794 187.617 271.139 148.749 324.4 148.749C344.555 148.749 363.264 155.468 379.102 167.463L284.578 222.164C278.822 225.521 275.942 230.319 275.942 237.039V376.186L275.937 376.182ZM360.626 425.122L304.246 393.455V326.283L360.626 294.616L417.002 326.283V393.455L360.626 425.122ZM396.852 570.989C376.698 570.989 357.989 564.27 342.151 552.276L436.674 497.574C442.431 494.217 445.311 489.419 445.311 482.699V343.552L485.138 366.582C488.495 368.499 489.936 371.379 489.936 375.219V480.778C489.936 532.117 450.109 570.985 396.852 570.985V570.989ZM283.134 463.99L191.486 411.211C165.094 395.854 147.343 363.229 147.343 331.562C147.343 294.616 169.415 261.509 203.48 247.593V356.991C203.48 363.71 206.361 368.508 212.117 371.866L332.074 441.437L292.729 463.99C289.372 465.907 286.491 465.907 283.134 463.99ZM277.859 542.68C223.639 542.68 183.813 501.895 183.813 451.514C183.813 447.675 184.294 443.836 184.771 439.997L279.295 494.698C285.051 498.056 290.812 498.056 296.568 494.698L417.002 425.127V470.71C417.002 474.549 415.562 477.429 412.204 479.346L320.557 532.126C308.081 539.323 293.206 542.68 277.854 542.68H277.859ZM396.852 599.776C454.911 599.776 503.37 558.513 514.41 503.812C568.149 489.896 602.696 439.515 602.696 388.176C602.696 354.587 588.303 321.962 562.392 298.45C564.791 288.373 566.231 278.296 566.231 268.224C566.231 199.611 510.571 148.267 446.274 148.267C433.322 148.267 420.846 150.184 408.37 154.505C386.775 133.392 357.026 119.958 324.4 119.958C266.342 119.958 217.883 161.22 206.843 215.921C153.104 229.837 118.557 280.218 118.557 331.557C118.557 365.146 132.95 397.771 158.861 421.283C156.462 431.36 155.022 441.437 155.022 451.51C155.022 520.123 210.682 571.466 274.978 571.466C287.931 571.466 300.407 569.549 312.883 565.228C334.473 586.341 364.222 599.776 396.852 599.776Z" fill="currentColor"/>
        </g>
        <defs>
          <clipPath id="clip0_chatgpt">
            <rect width="720" height="720" fill="white" transform="translate(0.607 0.1)"/>
          </clipPath>
        </defs>
      </svg>`,
      claude: `<svg viewBox="0 0 250 251" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M49.0541 166.749L98.2432 139.166L99.0541 136.75L98.2432 135.405H95.8108L87.5676 134.903L59.4595 134.151L35.1351 133.148L11.4865 131.894L5.54054 130.64L0 123.243L0.540541 119.607L5.54054 116.222L12.7027 116.849L28.5135 117.977L52.2973 119.607L69.4595 120.61L95 123.243H99.0541L99.5946 121.613L98.2432 120.61L97.1622 119.607L72.5676 102.932L45.9459 85.3796L32.027 75.2242L24.5946 70.0837L20.8108 65.3195L19.1892 54.7879L25.9459 47.2653L35.1351 47.8922L37.4324 48.5191L46.7568 55.6655L66.6216 71.0868L92.5676 90.1439L96.3514 93.2783L97.875 92.25L98.1081 91.5231L96.3514 88.6394L82.2973 63.1881L67.2973 37.2352L60.5405 26.4529L58.7838 20.0587C58.1033 17.3753 57.7027 15.1553 57.7027 12.4107L65.4054 1.87914L69.7297 0.5L80.1351 1.87914L84.4595 5.64042L90.9459 20.4348L101.351 43.6294L117.568 75.2242L122.297 84.6274L124.865 93.2783L125.811 95.9112H127.432V94.4067L128.784 76.6033L131.216 54.7879L133.649 26.7036L134.459 18.8049L138.378 9.27633L146.216 4.13591L152.297 7.01956L157.297 14.166L156.622 18.8049L153.649 38.1128L147.838 68.3285L144.054 88.6394H146.216L148.784 86.0065L159.054 72.4659L176.216 50.9012L183.784 42.3756L192.703 32.9724L198.378 28.4589H209.189L217.027 40.2442L213.514 52.4057L202.432 66.4478L193.243 78.3586L180.068 96.011L171.892 110.204L172.625 111.375L174.595 111.207L204.324 104.813L220.405 101.929L239.595 98.6695L248.243 102.682L249.189 106.819L245.811 115.219L225.27 120.234L201.216 125.124L165.397 133.556L165 133.875L165.468 134.569L181.622 136.032L188.514 136.408H205.405L236.892 138.79L245.135 144.181L250 150.826L249.189 155.966L236.486 162.361L219.459 158.349L179.595 148.82L165.946 145.435H164.054V146.563L175.405 157.722L196.351 176.528L222.432 200.851L223.784 206.869L220.405 211.633L216.892 211.132L193.919 193.83L185 186.057L165 169.131H163.649V170.886L168.243 177.656L192.703 214.392L193.919 225.676L192.162 229.311L185.811 231.568L178.919 230.314L164.459 210.129L149.73 187.561L137.838 167.25L136.402 168.157L129.324 243.73L126.081 247.616L118.514 250.5L112.162 245.736L108.784 237.962L112.162 222.541L116.216 202.481L119.459 186.558L122.432 166.749L124.248 160.131L124.088 159.688L122.637 159.932L107.703 180.415L85 211.132L67.027 230.314L62.7027 232.07L55.2703 228.183L55.9459 221.287L60.1351 215.144L85 183.549L100 163.865L109.668 152.566L109.573 150.932L109.04 150.886L42.973 193.955L31.2162 195.46L26.0811 190.696L26.7568 182.922L29.1892 180.415L49.0541 166.749Z" fill="currentColor"/>
      </svg>`,
      download: `<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 3V13M10 13L14 9M10 13L6 9" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M3 15V16C3 16.5523 3.44772 17 4 17H16C16.5523 17 17 16.5523 17 16V15" stroke-width="1.5" stroke-linecap="round"/>
      </svg>`,
      cursor: `<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 3L17 10L10 12L8 17L3 3Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`,
      vscode: `<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 3L6 10L3 7L14 3Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M14 17L6 10L3 13L14 17Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M14 3V17" stroke-width="1.5" stroke-linecap="round"/>
      </svg>`,
      mcp: `<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 2L3 6V14L10 18L17 14V6L10 2Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M10 18V10" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M17 6L10 10L3 6" stroke-width="1.5" stroke-linecap="round"/>
      </svg>`
    };
    return icons[iconName] || icons.document;
  }
  function renderOptions() {
    const options2 = buildOptions();
    dropdownMenu.innerHTML = "";
    options2.forEach((option) => {
      const optionEl = document.createElement(option.href ? "a" : "button");
      optionEl.classList.add("format-selector__option");
      optionEl.setAttribute("data-option", option.dataAttribute);
      if (option.href) {
        optionEl.href = option.href;
        if (option.target) {
          optionEl.target = option.target;
          optionEl.rel = "noopener noreferrer";
        }
      }
      optionEl.innerHTML = `
        <span class="format-selector__icon">
          ${getIconSVG(option.icon)}
        </span>
        <span class="format-selector__label-group">
          <span class="format-selector__label">
            ${option.label}
            ${option.external ? '<span class="format-selector__external">\u2197</span>' : ""}
          </span>
          <span class="format-selector__sublabel">${option.sublabel}</span>
        </span>
      `;
      optionEl.addEventListener("click", (e) => {
        const intentEvent = INTENT_EVENT_MAP[option.dataAttribute];
        if (intentEvent) {
          emitFormatEvent(intentEvent);
        }
        if (!option.href) {
          e.preventDefault();
          option.action();
        }
      });
      dropdownMenu.appendChild(optionEl);
    });
  }
  function positionDropdown() {
    const buttonRect = button.getBoundingClientRect();
    const dropdownWidth = dropdownMenu.offsetWidth;
    const viewportWidth = window.innerWidth;
    const padding = 8;
    dropdownMenu.style.top = `${buttonRect.bottom + 8}px`;
    let leftPos = buttonRect.right - dropdownWidth;
    if (leftPos < padding) {
      leftPos = padding;
    }
    if (leftPos + dropdownWidth > viewportWidth - padding) {
      leftPos = viewportWidth - dropdownWidth - padding;
    }
    dropdownMenu.style.left = `${leftPos}px`;
  }
  function handleResize() {
    if (isOpen) {
      positionDropdown();
    }
  }
  function openDropdown() {
    isOpen = true;
    dropdownMenu.classList.add("is-open");
    button.setAttribute("aria-expanded", "true");
    positionDropdown();
    setTimeout(() => {
      document.addEventListener("click", handleClickOutside);
    }, 0);
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleResize, true);
  }
  function closeDropdown() {
    isOpen = false;
    dropdownMenu.classList.remove("is-open");
    button.setAttribute("aria-expanded", "false");
    document.removeEventListener("click", handleClickOutside);
    window.removeEventListener("resize", handleResize);
    window.removeEventListener("scroll", handleResize, true);
  }
  function toggleDropdown() {
    if (isOpen) {
      closeDropdown();
    } else {
      openDropdown();
    }
  }
  function handleClickOutside(event) {
    if (!component.contains(event.target)) {
      closeDropdown();
    }
  }
  function handleButtonClick(event) {
    event.preventDefault();
    event.stopPropagation();
    toggleDropdown();
  }
  function handleKeyDown(event) {
    if (event.key === "Escape" && isOpen) {
      closeDropdown();
      button.focus();
    }
  }
  function init2() {
    initConfig();
    renderOptions();
    button.addEventListener("click", handleButtonClick);
    document.addEventListener("keydown", handleKeyDown);
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-haspopup", "true");
    dropdownMenu.setAttribute("role", "menu");
  }
  init2();
  return {
    get config() {
      return config;
    },
    openDropdown,
    closeDropdown,
    renderOptions
  };
}

// ns-hugo-imp:/home/runner/work/docs-v2/docs-v2/assets/js/influxdb-version-detector.ts
var InfluxDBVersionDetector = class _InfluxDBVersionDetector {
  constructor(options) {
    this.answers = {};
    this.initialized = false;
    this.questionFlow = [];
    this.currentQuestionIndex = 0;
    this.questionHistory = [];
    // Track question history for back navigation
    this.progressBar = null;
    this.resultDiv = null;
    this.restartBtn = null;
    this.currentContext = "questionnaire";
    this.pageContext = null;
    this.container = options.component;
    const { products: products3, influxdbUrls: influxdbUrls2 } = this.parseComponentData();
    this.products = products3;
    this.influxdbUrls = influxdbUrls2;
    this.parsePageContext();
    const modal = this.container.closest(".modal-content");
    if (modal) {
      this.initializeForModal();
    } else {
      this.init();
    }
  }
  static {
    // Context from page (e.g., "grafana")
    /** Example host URLs for each product type */
    this.HOST_EXAMPLES = {
      influxdb3_core: "http://localhost:8181",
      influxdb3_enterprise: "http://localhost:8181",
      influxdb3_cloud_serverless: "https://cloud2.influxdata.com",
      influxdb3_cloud_dedicated: "https://cluster-id.a.influxdb.io",
      influxdb3_clustered: "https://cluster-host.com",
      influxdb_v1: "http://localhost:8086",
      influxdb_v2: "http://localhost:8086"
    };
  }
  static {
    /** Default host URL (InfluxDB v2 localhost) */
    this.DEFAULT_HOST = _InfluxDBVersionDetector.HOST_EXAMPLES.influxdb_v2;
  }
  static {
    /** Default host:port without protocol (for curl examples) */
    this.DEFAULT_HOST_PORT = "localhost:8086";
  }
  /**
   * Parse page context from modal trigger button
   */
  parsePageContext() {
    const trigger = document.querySelector(
      ".influxdb-detector-trigger[data-context]"
    );
    if (trigger) {
      this.pageContext = trigger.getAttribute("data-context");
    }
  }
  parseComponentData() {
    let products3 = {};
    let influxdbUrls2 = {};
    const productsData = this.container.getAttribute("data-products");
    if (productsData) {
      try {
        products3 = JSON.parse(productsData);
      } catch (error) {
        console.warn("Failed to parse products data:", error);
      }
    }
    const influxdbUrlsData = this.container.getAttribute("data-influxdb-urls");
    if (influxdbUrlsData && influxdbUrlsData !== "#ZgotmplZ") {
      try {
        influxdbUrls2 = JSON.parse(influxdbUrlsData);
      } catch (error) {
        console.warn("Failed to parse influxdb_urls data:", error);
        influxdbUrls2 = {};
      }
    } else {
      console.debug(
        "InfluxDB URLs data not available or blocked by template security. This is expected when Hugo data is unavailable."
      );
      influxdbUrls2 = {};
    }
    return { products: products3, influxdbUrls: influxdbUrls2 };
  }
  init() {
    this.render();
    this.setupPlaceholders();
    this.attachEventListeners();
    this.showQuestion("q-url-known");
    this.initialized = true;
    this.trackAnalyticsEvent({
      interaction_type: "modal_opened",
      section: this.getCurrentPageSection()
    });
  }
  setupPlaceholders() {
  }
  setupPingHeadersPlaceholder() {
    const pingHeaders = this.container.querySelector("#ping-headers");
    if (pingHeaders) {
      const exampleContent = [
        "# Replace this with your actual response headers",
        "# Example formats:",
        "",
        "# InfluxDB 3 Core:",
        "HTTP/1.1 200 OK",
        "x-influxdb-build: core",
        "x-influxdb-version: 3.1.0",
        "",
        "# InfluxDB 3 Enterprise:",
        "HTTP/1.1 200 OK",
        "x-influxdb-build: enterprise",
        "x-influxdb-version: 3.1.0",
        "",
        "# InfluxDB v2 OSS:",
        "HTTP/1.1 204 No Content",
        "X-Influxdb-Build: OSS",
        "X-Influxdb-Version: 2.7.8",
        "",
        "# InfluxDB v1:",
        "HTTP/1.1 204 No Content",
        "X-Influxdb-Version: 1.8.10"
      ].join("\n");
      pingHeaders.value = exampleContent;
      pingHeaders.addEventListener("focus", () => {
        pingHeaders.select();
      });
    }
  }
  setupDockerOutputPlaceholder() {
    const dockerOutput = this.container.querySelector("#docker-output");
    if (dockerOutput) {
      const exampleContent = [
        "# Replace this with your actual command output",
        "# Example formats:",
        "",
        "# Version command output:",
        "InfluxDB 3.1.0 (git: abc123def)",
        "or",
        "InfluxDB v2.7.8 (git: 407fa622e)",
        "",
        "# Ping headers from curl -I:",
        "HTTP/1.1 200 OK",
        "x-influxdb-build: core",
        "x-influxdb-version: 3.1.0",
        "",
        "# Startup logs:",
        "2024-01-01T00:00:00.000Z  info  InfluxDB starting",
        "2024-01-01T00:00:00.000Z  info  InfluxDB 3.1.0 (git: abc123)"
      ].join("\n");
      dockerOutput.value = exampleContent;
      dockerOutput.addEventListener("focus", () => {
        dockerOutput.select();
      });
    }
  }
  getCurrentPageSection() {
    const path2 = window.location.pathname;
    const pathSegments = path2.split("/").filter((segment) => segment);
    if (pathSegments.length >= 3) {
      return pathSegments.slice(0, 3).join("/");
    } else if (pathSegments.length >= 2) {
      return pathSegments.slice(0, 2).join("/");
    }
    return path2 || "unknown";
  }
  trackAnalyticsEvent(eventData) {
    try {
      const currentUrl = new URL(window.location.href);
      const path2 = window.location.pathname;
      let pageContext = "other";
      if (/\/influxdb\/cloud\//.test(path2)) {
        pageContext = "cloud";
      } else if (/\/influxdb3\/core/.test(path2)) {
        pageContext = "core";
      } else if (/\/influxdb3\/enterprise/.test(path2)) {
        pageContext = "enterprise";
      } else if (/\/influxdb3\/cloud-serverless/.test(path2)) {
        pageContext = "serverless";
      } else if (/\/influxdb3\/cloud-dedicated/.test(path2)) {
        pageContext = "dedicated";
      } else if (/\/influxdb3\/clustered/.test(path2)) {
        pageContext = "clustered";
      } else if (/\/(enterprise_|influxdb).*\/v[1-2]\//.test(path2)) {
        pageContext = "oss/enterprise";
      }
      if (eventData.detected_product) {
        switch (eventData.detected_product) {
          case "core":
            currentUrl.searchParams.set("dl", "oss3");
            break;
          case "enterprise":
            currentUrl.searchParams.set("dl", "enterprise");
            break;
          case "cloud":
          case "cloud-v1":
          case "cloud-v2-tsm":
            currentUrl.searchParams.set("dl", "cloud");
            break;
          case "serverless":
            currentUrl.searchParams.set("dl", "serverless");
            break;
          case "dedicated":
            currentUrl.searchParams.set("dl", "dedicated");
            break;
          case "clustered":
            currentUrl.searchParams.set("dl", "clustered");
            break;
          case "oss":
          case "oss-v1":
          case "oss-v2":
            currentUrl.searchParams.set("dl", "oss");
            break;
        }
      }
      if (eventData.detection_method) {
        currentUrl.searchParams.set(
          "detection_method",
          eventData.detection_method
        );
      }
      if (eventData.completion_status) {
        currentUrl.searchParams.set("completion", eventData.completion_status);
      }
      if (eventData.section) {
        currentUrl.searchParams.set(
          "section",
          encodeURIComponent(eventData.section)
        );
      }
      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, "", currentUrl.toString());
      }
      if (typeof window.gtag !== "undefined") {
        window.gtag("event", "influxdb_version_detector", {
          interaction_type: eventData.interaction_type,
          detected_product: eventData.detected_product,
          detection_method: eventData.detection_method,
          completion_status: eventData.completion_status,
          question_id: eventData.question_id,
          answer_value: eventData.answer_value,
          section: eventData.section,
          page_context: pageContext,
          custom_map: {
            dimension1: eventData.detected_product,
            dimension2: eventData.detection_method,
            dimension3: pageContext
          }
        });
      }
    } catch (error) {
      console.debug("Analytics tracking error:", error);
    }
  }
  initializeForModal() {
    const modalContent = this.container.closest(".modal-content");
    if (!modalContent) return;
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes" && mutation.attributeName === "style") {
          const target = mutation.target;
          const isVisible = target.style.display !== "none" && target.style.display !== "";
          if (isVisible && !this.initialized) {
            this.init();
            observer.disconnect();
          }
        }
      });
    });
    observer.observe(modalContent, {
      attributes: true,
      attributeFilter: ["style"]
    });
    const computedStyle = window.getComputedStyle(modalContent);
    if (computedStyle.display !== "none" && !this.initialized) {
      this.init();
      observer.disconnect();
    }
  }
  getBasicUrlSuggestion() {
    return "https://your-influxdb-host.com:8086";
  }
  getProductDisplayName(product2) {
    const displayNames = {
      // Simplified product keys (used in detection results)
      "oss-v1": "InfluxDB OSS v1.x",
      "oss-v2": "InfluxDB OSS v2.x",
      oss: "InfluxDB OSS (version unknown)",
      cloud: "InfluxDB Cloud",
      "cloud-v1": "InfluxDB Cloud v1",
      "cloud-v2-tsm": "InfluxDB Cloud v2 (TSM)",
      serverless: "InfluxDB Cloud Serverless",
      core: "InfluxDB 3 Core",
      enterprise: "InfluxDB 3 Enterprise",
      dedicated: "InfluxDB Cloud Dedicated",
      clustered: "InfluxDB Clustered",
      custom: "Custom URL",
      // Raw product keys from products.yml (used in scoring)
      influxdb3_core: "InfluxDB 3 Core",
      influxdb3_enterprise: "InfluxDB 3 Enterprise",
      influxdb3_cloud_serverless: "InfluxDB Cloud Serverless",
      influxdb3_cloud_dedicated: "InfluxDB Cloud Dedicated",
      influxdb3_clustered: "InfluxDB Clustered",
      influxdb_v1: "InfluxDB OSS v1.x",
      influxdb_v2: "InfluxDB OSS v2.x",
      enterprise_influxdb: "InfluxDB Enterprise v1.x",
      influxdb: "InfluxDB OSS v2.x"
    };
    displayNames["core or enterprise"] = `${displayNames.core} or ${displayNames.enterprise}`;
    return displayNames[product2] || product2;
  }
  generateConfigurationGuidance(productKey) {
    const productMapping = {
      core: "influxdb3_core",
      enterprise: "influxdb3_enterprise",
      serverless: "influxdb3_cloud_serverless",
      dedicated: "influxdb3_cloud_dedicated",
      clustered: "influxdb3_clustered",
      "oss-v1": "influxdb_v1",
      "oss-v2": "influxdb_v2"
    };
    const dataKey = productMapping[productKey];
    if (!dataKey || !this.products[dataKey]) {
      return "";
    }
    const productConfig = this.products[dataKey];
    const productName = this.getProductDisplayName(productKey);
    if (!productConfig.query_languages || Object.keys(productConfig.query_languages).length === 0) {
      return "";
    }
    let html = `
      <div class="configuration-guidance" style="margin-top: 1.5rem; padding: 1rem; background: rgba(var(--article-link-rgb, 59, 130, 246), 0.1); border-left: 4px solid var(--article-link, #3b82f6);">
        <h4 style="margin: 0 0 0.75rem 0; color: var(--article-link, #3b82f6);">Configuration Parameter Meanings for ${productName}</h4>
        <p style="margin: 0 0 1rem 0; font-size: 0.9em;">When configuring Grafana or other tools to connect to your ${productName} instance, these parameters mean:</p>
    `;
    const hostExample = this.getHostExample(dataKey);
    html += `
      <div style="margin-bottom: 0.75rem;">
        <strong>HOST/URL:</strong> The network address where your ${productName} instance is running<br>
        <span style="font-size: 0.85em; color: var(--article-text-secondary, #6b7280);">
          For your setup, this would typically be: <code style="background: rgba(0,0,0,0.1); padding: 0.125rem 0.25rem; border-radius: 3px;">${hostExample}</code>
        </span>
      </div>
    `;
    const usesDatabase = this.usesDatabaseTerminology(productConfig);
    if (usesDatabase) {
      html += `
        <div style="margin-bottom: 0.75rem;">
          <strong>DATABASE:</strong> The named collection where your data is stored<br>
          <span style="font-size: 0.85em; color: var(--article-text-secondary, #6b7280);">
            ${productName} uses "database" terminology for organizing your time series data
          </span>
        </div>
      `;
    } else {
      html += `
        <div style="margin-bottom: 0.75rem;">
          <strong>BUCKET:</strong> The named collection where your data is stored<br>
          <span style="font-size: 0.85em; color: var(--article-text-secondary, #6b7280);">
            ${productName} uses "bucket" terminology for organizing your time series data
          </span>
        </div>
      `;
    }
    const authInfo = this.getAuthenticationInfo(productConfig);
    html += `
      <div style="margin-bottom: 0.75rem;">
        <strong>AUTHENTICATION:</strong> ${authInfo.description}<br>
        <span style="font-size: 0.85em; color: var(--article-text-secondary, #6b7280);">
          ${authInfo.details}
        </span>
      </div>
    `;
    const languages = Object.keys(productConfig.query_languages).join(", ");
    html += `
      <div style="margin-bottom: 0;">
        <strong>QUERY LANGUAGE:</strong> The syntax used to retrieve your data<br>
        <span style="font-size: 0.85em; color: var(--article-text-secondary, #6b7280);">
          ${productName} supports: ${languages}
        </span>
      </div>
    `;
    html += "</div>";
    return html;
  }
  getHostExample(productDataKey) {
    const productData2 = this.products[productDataKey];
    if (productData2?.placeholder_host) {
      const host2 = productData2.placeholder_host;
      if (host2.startsWith("http://") || host2.startsWith("https://")) {
        return host2;
      } else {
        return host2.includes("localhost") ? `http://${host2}` : `https://${host2}`;
      }
    }
    return _InfluxDBVersionDetector.HOST_EXAMPLES[productDataKey] || _InfluxDBVersionDetector.DEFAULT_HOST;
  }
  usesDatabaseTerminology(productConfig) {
    for (const language of Object.values(productConfig.query_languages)) {
      if (language.required_params.includes("Database")) {
        return true;
      }
    }
    return false;
  }
  getAuthenticationInfo(productConfig) {
    const requiresToken = Object.values(productConfig.query_languages).some(
      (lang) => lang.required_params.includes("Token")
    );
    const usesDatabaseTerm = this.usesDatabaseTerminology(productConfig);
    const resourceName = usesDatabaseTerm ? "database" : "bucket";
    if (requiresToken) {
      return {
        description: "Token-based authentication required",
        details: `You need a valid API token with appropriate permissions for your ${resourceName}`
      };
    } else {
      return {
        description: "No authentication required by default",
        details: "This instance typically runs without authentication, though it may be optionally configured"
      };
    }
  }
  detectEnterpriseFeatures() {
    return null;
  }
  analyzeUrlPatterns(url) {
    if (!url || !this.influxdbUrls) {
      return { likelyProduct: null, confidence: 0 };
    }
    const urlLower = url.toLowerCase();
    if (urlLower.includes("influxdb.io")) {
      return { likelyProduct: "dedicated", confidence: 1 };
    }
    if (urlLower.includes("cloud2.influxdata.com")) {
      const serverlessRegions = [
        "us-east-1-1.aws.cloud2.influxdata.com",
        "eu-central-1-1.aws.cloud2.influxdata.com"
      ];
      for (const region of serverlessRegions) {
        if (urlLower.includes(region.toLowerCase())) {
          return { likelyProduct: "serverless", confidence: 1 };
        }
      }
      return { likelyProduct: "cloud-v2-tsm", confidence: 0.9 };
    }
    if (urlLower.includes("influxcloud.net")) {
      return { likelyProduct: "cloud-v1", confidence: 1 };
    }
    if (urlLower.includes("localhost") || urlLower.includes("127.0.0.1")) {
      if (urlLower.includes(":8086")) {
        return {
          likelyProduct: "oss",
          confidence: 0.8,
          suggestion: "version-check"
        };
      }
      if (urlLower.includes(":8181")) {
        const enterpriseResult = this.detectEnterpriseFeatures();
        if (enterpriseResult) {
          return enterpriseResult;
        }
        return {
          likelyProduct: "core or enterprise",
          confidence: 0.7,
          suggestion: "ping-test"
        };
      }
    }
    const isLocalhost = urlLower.includes("localhost") || urlLower.includes("127.0.0.1");
    if (!isLocalhost) {
      for (const [productKey, productData2] of Object.entries(
        this.influxdbUrls
      )) {
        if (!productData2 || typeof productData2 !== "object") continue;
        const providers = productData2.providers;
        if (!Array.isArray(providers)) continue;
        for (const provider of providers) {
          if (!provider.regions) continue;
          for (const region of provider.regions) {
            if (region.url) {
              const patternUrl = region.url.toLowerCase();
              if (urlLower === patternUrl) {
                return { likelyProduct: productKey, confidence: 1 };
              }
              if (productKey === "cloud" && urlLower.includes("cloud2.influxdata.com")) {
                return { likelyProduct: "cloud", confidence: 0.9 };
              }
            }
          }
        }
      }
    }
    if (!isLocalhost) {
      if (urlLower.match(/cloud\s*[v]?2/)) {
        return { likelyProduct: "cloud", confidence: 0.8 };
      }
      if (urlLower.includes("cloud") || urlLower.includes("aws") || urlLower.includes("azure") || urlLower.includes("gcp")) {
        return { likelyProduct: "cloud", confidence: 0.6 };
      }
    }
    if (urlLower.includes(":8086")) {
      return {
        likelyProduct: "oss-port",
        confidence: 0.4,
        suggestion: "multiple-candidates-8086"
      };
    }
    if (urlLower.includes(":8181")) {
      return {
        likelyProduct: "v3-port",
        confidence: 0.4,
        suggestion: "multiple-candidates-8181"
      };
    }
    return { likelyProduct: null, confidence: 0 };
  }
  render() {
    this.container.innerHTML = `
      <div class="influxdb-version-detector">
        <h2 id="detector-title" class="detector-title" tabindex="-1">
          InfluxDB product detector
        </h2>
        <p class="detector-subtitle">
          Answer a few questions to identify which InfluxDB product you're using
        </p>

        <div class="progress">
          <div class="progress-bar" id="progress-bar" style="width: 0%"></div>
        </div>

        <div class="question-container">
          <!-- Question: Do you know URL -->
          <div class="question active" id="q-url-known">
            <div class="question-text">
              Do you know the URL of your InfluxDB server?
            </div>
            <button class="option-button"
                    data-action="url-known"
                    data-value="true">
              Yes, I know the URL
            </button>
            <button class="option-button"
                    data-action="url-known"
                    data-value="false">
              No, I don't know the URL
            </button>
            <button class="option-button"
                    data-action="url-known"
                    data-value="airgapped">
              Yes, but it's in an airgapped environment
            </button>
            <button class="option-button"
                    data-action="url-known"
                    data-value="docker">
              Yes, but it's running in Docker/Kubernetes
            </button>
          </div>

          <!-- Question: Enter URL -->
          <div class="question" id="q-url-input">
            <div class="question-text">
              Please enter your InfluxDB server URL:
            </div>
            <div class="input-group">
              <input type="url" id="url-input"
                     placeholder="for example, https://us-east-1-1.aws.cloud2.influxdata.com or ${_InfluxDBVersionDetector.DEFAULT_HOST}">
            </div>
            <button class="back-button" data-action="go-back">Back</button>
            <button class="submit-button"
                    data-action="detect-url">Detect Version</button>
          </div>

          <!-- Question: Manual ping test -->
          <div class="question" id="q-ping-manual">
            <div class="question-text">
              For airgapped environments, run this command from a machine that can
              access your InfluxDB:
            </div>
            <div class="code-block">curl -I http://your-influxdb-url:8086/ping</div>
            <div class="question-text question-text-spaced">
              Then paste the response headers here:
            </div>
            <textarea id="ping-headers">
            </textarea>
            <div class="question-options">
              <button class="back-button" data-action="go-back">Back</button>
              <button class="submit-button"
                      data-action="analyze-headers">Analyze Headers</button>
            </div>
          </div>

          <!-- Question: Docker commands -->
          <div class="question" id="q-docker-manual">
            <div class="question-text">
              For Docker/Kubernetes environments, run these commands to identify your InfluxDB version:
            </div>
            <div class="question-text question-text-spaced">
              First, find your container:
            </div>
            <div class="code-block">docker ps | grep influx</div>
            <div class="question-text question-text-spaced">
              Then run one of these commands (replace &lt;container&gt; with your container name/ID):
            </div>
            <div class="code-block"># Get version info:
docker exec &lt;container&gt; influxd version

# Get ping headers:
docker exec &lt;container&gt; curl -I ${_InfluxDBVersionDetector.DEFAULT_HOST_PORT}/ping

# Or check startup logs:
docker logs &lt;container&gt; 2>&amp;1 | head -20</div>
            <div class="question-text question-text-spaced">
              Paste the output here:
            </div>
            <textarea id="docker-output">
            </textarea>
            <div class="question-options">
              <button class="back-button" data-action="go-back">Back</button>
              <button class="submit-button"
                      data-action="analyze-docker">Analyze Output</button>
            </div>
          </div>

          <!-- Question: Paid vs Free -->
          <div class="question" id="q-paid">
            <div class="question-text">
              Which type of InfluxDB license do you have?
            </div>
            <button class="option-button"
                    data-action="answer"
                    data-category="paid"
                    data-value="paid">
              Paid/Commercial License
            </button>
            <button class="option-button"
                    data-action="answer"
                    data-category="paid"
                    data-value="free">
              Free/Open Source (including free cloud tiers)
            </button>
            <button class="option-button"
                    data-action="answer"
                    data-category="paid"
                    data-value="unknown">
              I'm not sure
            </button>
            <button class="back-button" data-action="go-back">Back</button>
          </div>

          <!-- Question: Cloud vs Self-hosted -->
          <div class="question" id="q-hosted">
            <div class="question-text">
              Is your InfluxDB instance hosted by InfluxData (cloud) or
              self-hosted?
            </div>
            <button class="option-button"
                    data-action="answer"
                    data-category="hosted"
                    data-value="cloud">
              Cloud service (hosted by InfluxData)
            </button>
            <button class="option-button"
                    data-action="answer"
                    data-category="hosted"
                    data-value="self">
              Self-hosted (on your own servers)
            </button>
            <button class="option-button"
                    data-action="answer"
                    data-category="hosted"
                    data-value="unknown">
              I'm not sure
            </button>
            <button class="back-button" data-action="go-back">Back</button>
          </div>

          <!-- Question: Server Age -->
          <div class="question" id="q-age">
            <div class="question-text">How long has your InfluxDB server been in place?</div>
            <button class="option-button" data-action="answer" data-category="age" data-value="recent">
              Recently installed (less than 1 year)
            </button>
            <button class="option-button" data-action="answer" data-category="age" data-value="1-5">
              1-5 years
            </button>
            <button class="option-button" data-action="answer" data-category="age" data-value="5+">
              More than 5 years
            </button>
            <button class="option-button" data-action="answer" data-category="age" data-value="unknown">
              I'm not sure
            </button>
            <button class="back-button" data-action="go-back">Back</button>
          </div>

          <!-- Question: Query Language -->
          <div class="question" id="q-language">
            <div class="question-text">Which query language(s) do you use with InfluxDB?</div>
            <button class="option-button" data-action="answer" data-category="language" data-value="sql">
              SQL
            </button>
            <button class="option-button" data-action="answer" data-category="language" data-value="influxql">
              InfluxQL
            </button>
            <button class="option-button" data-action="answer" data-category="language" data-value="flux">
              Flux
            </button>
            <button class="option-button" data-action="answer" data-category="language" data-value="multiple">
              Multiple languages
            </button>
            <button class="option-button" data-action="answer" data-category="language" data-value="unknown">
              I'm not sure
            </button>
            <button class="back-button" data-action="go-back">Back</button>
          </div>
        </div>

        <div id="result" class="result"></div>

        <button class="submit-button restart-button" data-action="restart" style="display: none;" id="restart-btn">
          Start Over
        </button>
      </div>
    `;
    this.progressBar = this.container.querySelector("#progress-bar");
    this.resultDiv = this.container.querySelector("#result");
    this.restartBtn = this.container.querySelector("#restart-btn");
  }
  attachEventListeners() {
    this.container.addEventListener("click", (e) => {
      const target = e.target;
      if (target.classList.contains("option-button") || target.classList.contains("submit-button") || target.classList.contains("back-button")) {
        const action = target.dataset.action;
        switch (action) {
          case "url-known":
            this.trackAnalyticsEvent({
              interaction_type: "question_answered",
              question_id: "url-known",
              answer_value: target.dataset.value || "",
              section: this.getCurrentPageSection()
            });
            this.handleUrlKnown(target.dataset.value);
            break;
          case "go-back":
            this.trackAnalyticsEvent({
              interaction_type: "navigation",
              section: this.getCurrentPageSection()
            });
            this.goBack();
            break;
          case "detect-url":
            this.trackAnalyticsEvent({
              interaction_type: "url_detection_attempt",
              detection_method: "url_analysis",
              section: this.getCurrentPageSection()
            });
            this.detectByUrl();
            break;
          case "analyze-headers":
            this.trackAnalyticsEvent({
              interaction_type: "manual_analysis",
              detection_method: "ping_headers",
              section: this.getCurrentPageSection()
            });
            this.analyzePingHeaders();
            break;
          case "analyze-docker":
            this.trackAnalyticsEvent({
              interaction_type: "manual_analysis",
              detection_method: "docker_output",
              section: this.getCurrentPageSection()
            });
            this.analyzeDockerOutput();
            break;
          case "answer":
            this.trackAnalyticsEvent({
              interaction_type: "question_answered",
              question_id: target.dataset.category || "",
              answer_value: target.dataset.value || "",
              section: this.getCurrentPageSection()
            });
            this.answerQuestion(
              target.dataset.category,
              target.dataset.value
            );
            break;
          case "auth-help-answer":
            this.trackAnalyticsEvent({
              interaction_type: "auth_help_response",
              question_id: target.dataset.category || "",
              answer_value: target.dataset.value || "",
              section: this.getCurrentPageSection()
            });
            this.handleAuthorizationHelp(
              target.dataset.category,
              target.dataset.value
            );
            break;
          case "restart":
            this.trackAnalyticsEvent({
              interaction_type: "restart",
              section: this.getCurrentPageSection()
            });
            this.restart();
            break;
          case "start-questionnaire": {
            this.trackAnalyticsEvent({
              interaction_type: "start_questionnaire",
              section: this.getCurrentPageSection()
            });
            if (this.resultDiv) {
              this.resultDiv.classList.remove("show");
            }
            if (this.restartBtn) {
              this.restartBtn.style.display = "none";
            }
            this.startQuestionnaire(target.dataset.context || null);
            const heading = document.getElementById("detector-title");
            if (heading) {
              heading.focus();
              heading.scrollIntoView({ behavior: "smooth", block: "start" });
            }
            break;
          }
        }
      }
    });
  }
  updateProgress() {
    const totalQuestions = this.questionFlow.length || 5;
    const progress = (this.currentQuestionIndex + 1) / totalQuestions * 100;
    if (this.progressBar) {
      this.progressBar.style.width = `${progress}%`;
    }
  }
  showQuestion(questionId, addToHistory = true) {
    const questions = this.container.querySelectorAll(".question");
    questions.forEach((q) => q.classList.remove("active"));
    const activeQuestion = this.container.querySelector(`#${questionId}`);
    if (activeQuestion) {
      activeQuestion.classList.add("active");
      if (questionId === "q-url-input") {
        this.enhanceUrlInputWithSuggestions();
      }
    }
    if (addToHistory) {
      this.questionHistory.push(questionId);
    }
    this.updateProgress();
  }
  enhanceUrlInputWithSuggestions() {
    const urlInputQuestion = this.container.querySelector("#q-url-input");
    if (!urlInputQuestion) return;
    const urlInput = urlInputQuestion.querySelector(
      "#url-input"
    );
    if (!urlInput) return;
    const storedUrls = getInfluxDBUrls();
    const currentProduct = this.getCurrentProduct();
    const storedUrl = storedUrls[currentProduct] || storedUrls.custom;
    if (storedUrl && storedUrl !== _InfluxDBVersionDetector.DEFAULT_HOST) {
      urlInput.value = storedUrl;
      const existingIndicator = urlInput.parentElement?.querySelector(
        ".url-prefilled-indicator"
      );
      if (!existingIndicator) {
        const indicator = document.createElement("div");
        indicator.className = "url-prefilled-indicator";
        indicator.textContent = "Using previously saved URL";
        urlInput.parentElement?.insertBefore(indicator, urlInput);
        const originalValue = urlInput.value;
        urlInput.addEventListener("input", () => {
          if (urlInput.value !== originalValue) {
            indicator.style.display = "none";
          }
        });
      }
    } else {
      const suggestedUrl = this.getBasicUrlSuggestion();
      urlInput.placeholder = `for example, ${suggestedUrl}`;
    }
  }
  getCurrentProduct() {
    return "core";
  }
  handleUrlKnown(value) {
    this.currentQuestionIndex++;
    if (value === "true") {
      this.showQuestion("q-url-input");
    } else if (value === "airgapped") {
      this.showQuestion("q-ping-manual");
      setTimeout(() => this.setupPingHeadersPlaceholder(), 0);
    } else if (value === "docker") {
      this.answers.isDocker = true;
      this.showQuestion("q-docker-manual");
      setTimeout(() => this.setupDockerOutputPlaceholder(), 0);
    } else {
      this.answers = {};
      this.questionFlow = ["q-paid", "q-hosted", "q-age", "q-language"];
      this.currentQuestionIndex = 0;
      this.showQuestion("q-paid");
    }
  }
  goBack() {
    if (this.questionHistory.length > 0) {
      this.questionHistory.pop();
    }
    if (this.questionHistory.length > 0) {
      const previousQuestion = this.questionHistory[this.questionHistory.length - 1];
      this.questionHistory.pop();
      if (this.currentQuestionIndex > 0) {
        this.currentQuestionIndex--;
      }
      this.showQuestion(previousQuestion);
    } else {
      this.currentQuestionIndex = 0;
      this.showQuestion("q-url-known");
    }
  }
  async detectByUrl() {
    const urlInput = this.container.querySelector("#url-input")?.value.trim();
    if (!urlInput) {
      this.showResult("error", "Please enter a valid URL");
      return;
    }
    const analysisResult = this.analyzeUrlPatterns(urlInput);
    if (analysisResult.likelyProduct && analysisResult.likelyProduct !== null) {
      this.answers.detectedProduct = analysisResult.likelyProduct;
      this.answers.detectedConfidence = analysisResult.confidence.toString();
    }
    if (analysisResult.likelyProduct && analysisResult.likelyProduct !== null) {
      if (analysisResult.suggestion === "ping-test") {
        this.showPingTestSuggestion(urlInput, analysisResult.likelyProduct);
        return;
      } else if (analysisResult.suggestion === "version-check") {
        this.showOSSVersionCheckSuggestion(urlInput);
        return;
      } else if (analysisResult.suggestion === "multiple-candidates-8086") {
        this.showMultipleCandidatesSuggestion(urlInput, "8086");
        return;
      } else if (analysisResult.suggestion === "multiple-candidates-8181") {
        this.showMultipleCandidatesSuggestion(urlInput, "8181");
        return;
      } else {
        this.showDetectedVersion(analysisResult.likelyProduct);
        return;
      }
    }
    this.showResult("info", "Analyzing your InfluxDB server...");
    const contextResult = this.detectContext(urlInput);
    if (contextResult.likelyProduct === "cloud") {
      setTimeout(() => {
        this.startQuestionnaireWithCloudContext();
      }, 2e3);
    } else {
      setTimeout(() => {
        this.startQuestionnaire("manual", this.detectPortFromUrl(urlInput));
      }, 2e3);
    }
  }
  detectContext(urlInput) {
    const input = urlInput.toLowerCase();
    if (input.includes("cloud") || input.includes("influxdata.com")) {
      return { likelyProduct: "cloud" };
    }
    if (/cloud\s*[v]?2/.test(input)) {
      return { likelyProduct: "cloud" };
    }
    return {};
  }
  detectPortFromUrl(urlString) {
    try {
      const url = new URL(urlString);
      const port = url.port || (url.protocol === "https:" ? "443" : "80");
      if (port === "8181") {
        return "v3";
      } else if (port === "8086") {
        return "legacy";
      }
    } catch {
    }
    return null;
  }
  startQuestionnaire(context2 = null, portClue = null) {
    this.answers = {};
    this.answers.context = context2;
    this.answers.portClue = portClue;
    this.answers.isCloud = false;
    this.questionFlow = ["q-paid", "q-age", "q-language"];
    this.currentQuestionIndex = 0;
    this.showQuestion("q-paid");
  }
  startQuestionnaireWithCloudContext() {
    this.answers = {};
    this.answers.context = "cloud";
    this.answers.hosted = "cloud";
    this.answers.isCloud = true;
    this.questionFlow = ["q-paid", "q-age", "q-language"];
    this.currentQuestionIndex = 0;
    this.showQuestion("q-paid");
  }
  answerQuestion(category, answer) {
    this.answers[category] = answer;
    if (category === "paid") {
      if (!this.answers.context) {
        this.currentQuestionIndex = 1;
        this.showQuestion("q-hosted");
      } else {
        this.currentQuestionIndex = 1;
        this.showQuestion("q-age");
      }
    } else if (category === "hosted") {
      this.currentQuestionIndex = 2;
      this.showQuestion("q-age");
    } else if (category === "age") {
      this.currentQuestionIndex = 3;
      this.showQuestion("q-language");
    } else if (category === "language") {
      this.showRankedResults();
    }
  }
  handleAuthorizationHelp(category, answer) {
    this.answers[category] = answer;
    const currentUrl = this.container.querySelector("#url-input")?.value?.toLowerCase() || "";
    const isLocalhost8181 = (currentUrl.includes("localhost") || currentUrl.includes("127.0.0.1")) && currentUrl.includes(":8181");
    if (isLocalhost8181) {
      if (answer === "free") {
        const html = `
          <strong>Based on your localhost:8181 server and free license:</strong><br><br>
          ${this.generateProductResult("core", true, "High", false)}
          <div class="action-section" style="margin-top: 1.5rem;">
            <strong>Want to confirm this result?</strong>
            <button class="option-button" data-action="start-questionnaire" data-context="v3-port-detected">
              Use guided questions instead
            </button>
          </div>
        `;
        this.showResult("success", html);
      } else if (answer === "paid") {
        const html = `
          <strong>Based on your localhost:8181 server and paid license:</strong><br><br>
          ${this.generateProductResult("enterprise", true, "High", false)}
          <div class="action-section" style="margin-top: 1.5rem;">
            <strong>Want to confirm this result?</strong>
            <button class="option-button" data-action="start-questionnaire" data-context="v3-port-detected">
              Use guided questions instead
            </button>
          </div>
        `;
        this.showResult("success", html);
      }
    } else {
      const resultDiv = this.container.querySelector("#result");
      if (resultDiv) {
        const licenseGuidance = document.createElement("div");
        licenseGuidance.className = "license-guidance";
        licenseGuidance.style.marginTop = "1rem";
        licenseGuidance.style.padding = "0.75rem";
        licenseGuidance.style.backgroundColor = "rgba(var(--article-link-rgb, 0, 163, 255), 0.1)";
        licenseGuidance.style.borderLeft = "4px solid var(--article-link, #00A3FF)";
        licenseGuidance.style.borderRadius = "4px";
        if (answer === "free") {
          const freeProducts = [
            "InfluxDB 3 Core",
            "InfluxDB OSS 2.x",
            "InfluxDB OSS 1.x"
          ];
          let freeLinks = "";
          if (this.pageContext === "grafana") {
            freeLinks = freeProducts.map((product2) => {
              const link = this.getGrafanaLink(product2);
              return link ? `<li><a href="${link}" target="_blank" class="doc-link">Configure Grafana for ${product2}</a></li>` : "";
            }).filter(Boolean).join("\n              ");
          } else {
            freeLinks = freeProducts.map((product2) => {
              const link = this.getDocumentationUrl(product2);
              return link ? `<li><a href="${link}" target="_blank" class="doc-link">View ${product2} documentation</a></li>` : "";
            }).filter(Boolean).join("\n              ");
          }
          licenseGuidance.innerHTML = `
            <strong>Free/Open Source License:</strong>
            <p>This suggests you're using InfluxDB 3 Core or InfluxDB OSS.</p>
            <ul>
              ${freeLinks}
            </ul>
          `;
        } else if (answer === "paid") {
          const paidProducts = [
            "InfluxDB 3 Enterprise",
            "InfluxDB Cloud Dedicated",
            "InfluxDB Cloud Serverless"
          ];
          let paidLinks = "";
          if (this.pageContext === "grafana") {
            paidLinks = paidProducts.map((product2) => {
              const link = this.getGrafanaLink(product2);
              return link ? `<li><a href="${link}" target="_blank" class="doc-link">Configure Grafana for ${product2}</a></li>` : "";
            }).filter(Boolean).join("\n              ");
          } else {
            paidLinks = paidProducts.map((product2) => {
              const link = this.getDocumentationUrl(product2);
              return link ? `<li><a href="${link}" target="_blank" class="doc-link">View ${product2} documentation</a></li>` : "";
            }).filter(Boolean).join("\n              ");
          }
          licenseGuidance.innerHTML = `
            <strong>Paid/Commercial License:</strong>
            <p>This suggests you're using InfluxDB 3 Enterprise or a paid cloud service.</p>
            <ul>
              ${paidLinks}
            </ul>
          `;
        }
        const existingGuidance = resultDiv.querySelector(".license-guidance");
        if (existingGuidance) {
          existingGuidance.remove();
        }
        resultDiv.appendChild(licenseGuidance);
        licenseGuidance.focus();
      }
    }
  }
  showRankedResults() {
    const scores = {};
    Object.entries(this.products).forEach(([key, config]) => {
      const fullName = config.name || key;
      scores[fullName] = 0;
    });
    this.applyScoring(scores);
    const allUnknown = (!this.answers.paid || this.answers.paid === "unknown") && (!this.answers.hosted || this.answers.hosted === "unknown") && (!this.answers.age || this.answers.age === "unknown") && (!this.answers.language || this.answers.language === "unknown");
    const ranked = Object.entries(scores).filter(([product2, score]) => {
      if (score <= -50) return false;
      if (product2 === "InfluxDB") return false;
      return true;
    }).sort((a, b) => b[1] - a[1]).slice(0, 5);
    this.displayRankedResults(ranked, allUnknown);
  }
  /**
   * Gets the Grafana documentation link for a given product
   * Builds on the documentation URL by appending the visualize-data/grafana path
   */
  getGrafanaLink(productName) {
    const docUrl = this.getDocumentationUrl(productName);
    if (!docUrl) return null;
    return `${docUrl}visualize-data/grafana/`;
  }
  /**
   * Gets the documentation URL for a given product
   */
  getDocumentationUrl(productName) {
    const DOC_LINKS = {
      "InfluxDB 3 Core": "/influxdb3/core/",
      "InfluxDB 3 Enterprise": "/influxdb3/enterprise/",
      "InfluxDB Cloud Dedicated": "/influxdb3/cloud-dedicated/",
      "InfluxDB Cloud Serverless": "/influxdb3/cloud-serverless/",
      "InfluxDB OSS 1.x": "/influxdb/v1/",
      "InfluxDB OSS 2.x": "/influxdb/v2/",
      "InfluxDB Enterprise": "/enterprise_influxdb/v1/",
      "InfluxDB Clustered": "/influxdb3/clustered/",
      "InfluxDB Cloud (TSM)": "/influxdb/cloud/",
      "InfluxDB Cloud v1": "/enterprise_influxdb/v1/"
    };
    return DOC_LINKS[productName] || null;
  }
  /**
   * Gets the Ask AI context/product identifier for a given product
   */
  getAskAIContext(productName) {
    const AI_CONTEXTS = {
      "InfluxDB 3 Core": "InfluxDB 3 Core",
      "InfluxDB 3 Enterprise": "InfluxDB 3 Enterprise",
      "InfluxDB Cloud Dedicated": "InfluxDB Cloud Dedicated",
      "InfluxDB Cloud Serverless": "InfluxDB Cloud Serverless",
      "InfluxDB OSS 1.x": "InfluxDB OSS v1",
      "InfluxDB OSS 2.x": "InfluxDB OSS v2",
      "InfluxDB Enterprise": "InfluxDB Enterprise v1",
      "InfluxDB Clustered": "InfluxDB Clustered",
      "InfluxDB Cloud (TSM)": "InfluxDB Cloud (TSM)",
      "InfluxDB Cloud v1": "InfluxDB Cloud v1"
    };
    return AI_CONTEXTS[productName] || null;
  }
  /**
   * Gets the AI source group IDs for a given product
   * Maps display names to product keys to look up source group IDs
   */
  getAISourceGroupIds(productName) {
    const PRODUCT_KEY_MAP = {
      "InfluxDB 3 Core": "influxdb3_core",
      "InfluxDB 3 Enterprise": "influxdb3_enterprise",
      "InfluxDB Cloud Dedicated": "influxdb3_cloud_dedicated",
      "InfluxDB Cloud Serverless": "influxdb3_cloud_serverless",
      "InfluxDB OSS 1.x": "influxdb",
      "InfluxDB OSS 2.x": "influxdb",
      "InfluxDB Enterprise": "enterprise_influxdb",
      "InfluxDB Clustered": "influxdb3_clustered",
      "InfluxDB Cloud (TSM)": "influxdb_cloud",
      "InfluxDB Cloud v1": "enterprise_influxdb"
    };
    const productKey = PRODUCT_KEY_MAP[productName];
    if (!productKey || !this.products[productKey]) return null;
    if (productName === "InfluxDB OSS 1.x") {
      const v1SourceGroupIds = this.products[productKey].ai_source_group_ids__v1;
      if (typeof v1SourceGroupIds === "string") {
        return v1SourceGroupIds;
      }
    }
    const sourceGroupIds = this.products[productKey].ai_source_group_ids;
    if (typeof sourceGroupIds === "string") {
      return sourceGroupIds;
    }
    return null;
  }
  /**
   * Generates a unified product result block with characteristics and Grafana link
   */
  generateProductResult(productName, isTopResult = false, confidence, showRanking) {
    const displayName = this.getProductDisplayName(productName) || productName;
    const resultClass = isTopResult ? "product-ranking top-result" : "product-ranking";
    const characteristics = this.products[productName]?.characteristics;
    let html = `<div class="${resultClass}">`;
    if (showRanking) {
      html += `<div class="product-title">${displayName}</div>`;
      if (isTopResult) {
        html += '<span class="most-likely-label">Most Likely</span>';
      }
    } else {
      html += `<div class="product-title">${displayName}</div>`;
      if (isTopResult) {
        html += '<span class="most-likely-label">Detected</span>';
      }
    }
    const details = [];
    if (confidence) details.push(`Confidence: ${confidence}`);
    if (characteristics) {
      details.push(characteristics.slice(0, 3).join(", "));
    }
    if (details.length > 0) {
      html += `<div class="product-details">${details.join(" \u2022 ")}</div>`;
    }
    if (this.pageContext === "grafana") {
      const grafanaLink = this.getGrafanaLink(displayName);
      if (grafanaLink) {
        html += `
          <div class="product-details" style="margin-top: 0.5rem;">
            <a href="${grafanaLink}" target="_blank" class="doc-link">
              Configure Grafana for ${displayName} \u2192
            </a>
          </div>
        `;
      }
    } else {
      const docLink = this.getDocumentationUrl(displayName);
      const aiContext = this.getAskAIContext(displayName);
      if (docLink || aiContext) {
        html += '<div class="product-details" style="margin-top: 0.5rem;">';
        if (docLink) {
          html += `
            <a href="${docLink}" target="_blank" class="doc-link" style="margin-right: 1rem;">
              View ${displayName} documentation \u2192
            </a>
          `;
        }
        if (aiContext) {
          const sourceGroupIds = this.getAISourceGroupIds(displayName);
          html += `
            <a href="#" class="ask-ai-open" data-query="Help me with ${aiContext}"${sourceGroupIds ? ` data-source-group-ids="${sourceGroupIds}"` : ""}>
              Ask AI about ${displayName} \u2192
            </a>
          `;
        }
        html += "</div>";
      }
    }
    html += "</div>";
    if (isTopResult) {
      const configGuidance = this.generateConfigurationGuidance(productName);
      if (configGuidance) {
        html += configGuidance;
      }
    }
    return html;
  }
  /**
   * Maps simple product keys (used in URL detection) to full product names (used in scoring)
   */
  mapProductKeyToFullName(productKey) {
    const KEY_TO_FULL_NAME_MAP = {
      core: "InfluxDB 3 Core",
      enterprise: "InfluxDB 3 Enterprise",
      serverless: "InfluxDB Cloud Serverless",
      dedicated: "InfluxDB Cloud Dedicated",
      clustered: "InfluxDB Clustered",
      "cloud-v2-tsm": "InfluxDB Cloud (TSM)",
      "cloud-v1": "InfluxDB Cloud v1",
      oss: "InfluxDB OSS 2.x",
      "oss-1x": "InfluxDB OSS 1.x",
      "enterprise-1x": "InfluxDB Enterprise"
    };
    return KEY_TO_FULL_NAME_MAP[productKey] || null;
  }
  applyScoring(scores) {
    const PRODUCT_RELEASE_DATES = {
      "InfluxDB 3 Core": /* @__PURE__ */ new Date("2025-01-01"),
      "InfluxDB 3 Enterprise": /* @__PURE__ */ new Date("2025-01-01"),
      "InfluxDB Cloud Serverless": /* @__PURE__ */ new Date("2024-01-01"),
      "InfluxDB Cloud Dedicated": /* @__PURE__ */ new Date("2024-01-01"),
      "InfluxDB Clustered": /* @__PURE__ */ new Date("2024-01-01"),
      "InfluxDB OSS 2.x": /* @__PURE__ */ new Date("2020-11-01"),
      "InfluxDB Cloud (TSM)": /* @__PURE__ */ new Date("2020-11-01"),
      "InfluxDB OSS 1.x": /* @__PURE__ */ new Date("2016-09-01"),
      "InfluxDB Enterprise": /* @__PURE__ */ new Date("2016-09-01")
    };
    const currentDate2 = /* @__PURE__ */ new Date();
    if (this.answers.detectedProduct && this.answers.detectedConfidence) {
      const detectedProduct = this.answers.detectedProduct;
      const confidence = typeof this.answers.detectedConfidence === "number" ? this.answers.detectedConfidence : parseFloat(this.answers.detectedConfidence);
      let boostValue = 0;
      if (confidence >= 1) {
        boostValue = 100;
      } else if (confidence >= 0.9) {
        boostValue = 80;
      } else if (confidence >= 0.7) {
        boostValue = 60;
      } else if (confidence >= 0.5) {
        boostValue = 40;
      }
      if (detectedProduct === "core or enterprise") {
        scores["InfluxDB 3 Core"] += boostValue;
        scores["InfluxDB 3 Enterprise"] += boostValue;
      } else {
        const fullProductName = this.mapProductKeyToFullName(detectedProduct);
        if (fullProductName && scores[fullProductName] !== void 0) {
          scores[fullProductName] += boostValue;
        }
      }
    }
    if (this.answers.hosted === "cloud") {
      scores["InfluxDB 3 Core"] = -1e3;
      scores["InfluxDB 3 Enterprise"] = -1e3;
      scores["InfluxDB OSS 1.x"] = -1e3;
      scores["InfluxDB OSS 2.x"] = -1e3;
      scores["InfluxDB Enterprise"] = -1e3;
      scores["InfluxDB Clustered"] = -1e3;
    } else if (this.answers.hosted === "self" || !this.answers.isCloud) {
      scores["InfluxDB Cloud Dedicated"] = -1e3;
      scores["InfluxDB Cloud Serverless"] = -1e3;
      scores["InfluxDB Cloud (TSM)"] = -1e3;
    }
    if (this.answers.paid === "free") {
      scores["InfluxDB 3 Core"] += 25;
      scores["InfluxDB OSS 1.x"] += 25;
      scores["InfluxDB OSS 2.x"] += 25;
      scores["InfluxDB"] += 25;
      scores["InfluxDB Cloud Serverless"] += 10;
      scores["InfluxDB Cloud (TSM)"] += 10;
      scores["InfluxDB 3 Enterprise"] = -1e3;
      scores["InfluxDB Enterprise"] = -1e3;
      scores["InfluxDB Clustered"] = -1e3;
      scores["InfluxDB Cloud Dedicated"] = -1e3;
    } else if (this.answers.paid === "paid") {
      scores["InfluxDB 3 Enterprise"] += 25;
      scores["InfluxDB Enterprise"] += 20;
      scores["InfluxDB Clustered"] += 15;
      scores["InfluxDB Cloud Dedicated"] += 20;
      scores["InfluxDB Cloud Serverless"] += 15;
      scores["InfluxDB Cloud (TSM)"] += 15;
      scores["InfluxDB 3 Core"] = -1e3;
      scores["InfluxDB OSS 1.x"] = -1e3;
      scores["InfluxDB OSS 2.x"] = -1e3;
      scores["InfluxDB"] = -1e3;
    }
    Object.entries(scores).forEach(([product2]) => {
      const releaseDate = PRODUCT_RELEASE_DATES[product2];
      if (!releaseDate) return;
      const yearsSinceRelease = (currentDate2.getTime() - releaseDate.getTime()) / (365.25 * 24 * 60 * 60 * 1e3);
      if (this.answers.age === "recent") {
        if (yearsSinceRelease < 1) {
          scores[product2] += 40;
        } else if (yearsSinceRelease < 3) {
          scores[product2] += 25;
        }
      } else if (this.answers.age === "1-5") {
        if (yearsSinceRelease >= 1 && yearsSinceRelease <= 5) {
          scores[product2] += 25;
        } else if (yearsSinceRelease < 1) {
          scores[product2] -= 30;
        }
      } else if (this.answers.age === "5+") {
        if (yearsSinceRelease < 5) {
          scores[product2] -= 100;
        } else {
          scores[product2] += 30;
        }
      }
    });
    if (this.answers.language === "sql") {
      scores["InfluxDB 3 Core"] += 40;
      scores["InfluxDB 3 Enterprise"] += 40;
      scores["InfluxDB Cloud Dedicated"] += 30;
      scores["InfluxDB Cloud Serverless"] += 30;
      scores["InfluxDB Clustered"] += 30;
      scores["InfluxDB OSS 1.x"] = -1e3;
      scores["InfluxDB OSS 2.x"] = -1e3;
      scores["InfluxDB"] = -1e3;
      scores["InfluxDB Enterprise"] = -1e3;
      scores["InfluxDB Cloud (TSM)"] = -1e3;
    } else if (this.answers.language === "flux") {
      scores["InfluxDB OSS 2.x"] += 30;
      scores["InfluxDB"] += 30;
      scores["InfluxDB Cloud (TSM)"] += 40;
      scores["InfluxDB Cloud Serverless"] += 20;
      scores["InfluxDB Enterprise"] += 20;
      scores["InfluxDB OSS 1.x"] = -1e3;
      scores["InfluxDB 3 Core"] = -1e3;
      scores["InfluxDB 3 Enterprise"] = -1e3;
      scores["InfluxDB Cloud Dedicated"] = -1e3;
      scores["InfluxDB Clustered"] = -1e3;
    } else if (this.answers.language === "influxql") {
      scores["InfluxDB OSS 1.x"] += 30;
      scores["InfluxDB Enterprise"] += 30;
      scores["InfluxDB OSS 2.x"] += 20;
      scores["InfluxDB"] += 20;
      scores["InfluxDB Cloud (TSM)"] += 20;
      scores["InfluxDB 3 Core"] += 25;
      scores["InfluxDB 3 Enterprise"] += 25;
      scores["InfluxDB Cloud Dedicated"] += 25;
      scores["InfluxDB Cloud Serverless"] += 25;
      scores["InfluxDB Clustered"] += 25;
    }
  }
  displayRankedResults(ranked, allUnknown = false) {
    const topScore = ranked[0]?.[1] || 0;
    const secondScore = ranked[1]?.[1] || 0;
    const hasStandout = topScore > 30 && topScore - secondScore >= 15;
    let html = "";
    if (allUnknown) {
      html = `<strong>Unable to determine your InfluxDB product</strong><br><br><p>Since you answered "I'm not sure" to all questions, we don't have enough information to identify your InfluxDB product.</p><p>Please check the <strong>InfluxDB version quick reference</strong> table below to identify your product based on its characteristics.</p><br>`;
    } else {
      html = "<strong>Based on your answers, here are the most likely InfluxDB products:</strong><br><br>";
    }
    if (!allUnknown) {
      ranked.forEach(([product2, score], index) => {
        const confidence = score > 60 ? "High" : score > 30 ? "Medium" : "Low";
        const isTopResult = index === 0 && hasStandout;
        let productHtml = this.generateProductResult(
          product2,
          isTopResult,
          confidence,
          true
        );
        productHtml = productHtml.replace(
          '<div class="product-title">',
          `<div class="product-title">${index + 1}. `
        );
        html += productHtml;
      });
    }
    html += `
      <div class="quick-reference">
        <details${allUnknown ? " open" : ""}>
          <summary class="reference-summary">
            InfluxDB version quick reference
          </summary>
          <table class="reference-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>License</th>
                <th>Hosting</th>
                <th>Port</th>
                <th>Ping requires auth</th>
                <th>Query languages</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="product-name"><a href="/influxdb3/enterprise/">InfluxDB 3 Enterprise</a></td>
                <td>Paid only</td>
                <td>Self-hosted</td>
                <td>8181</td>
                <td>Yes (opt-out)</td>
                <td>SQL, InfluxQL</td>
              </tr>
              <tr>
                <td class="product-name"><a href="/influxdb3/core/">InfluxDB 3 Core</a></td>
                <td>Free only</td>
                <td>Self-hosted</td>
                <td>8181</td>
                <td>Yes (opt-out)</td>
                <td>SQL, InfluxQL</td>
              </tr>
              <tr>
                <td class="product-name"><a href="/enterprise_influxdb/v1/">InfluxDB Enterprise</a></td>
                <td>Paid only</td>
                <td>Self-hosted</td>
                <td>8086</td>
                <td>Yes (required)</td>
                <td>InfluxQL, Flux</td>
              </tr>
              <tr>
                <td class="product-name"><a href="/influxdb3/clustered/">InfluxDB Clustered</a></td>
                <td>Paid only</td>
                <td>Self-hosted</td>
                <td>Varies</td>
                <td>No</td>
                <td>SQL, InfluxQL</td>
              </tr>
              <tr>
                <td class="product-name"><a href="/influxdb/v1/">InfluxDB OSS 1.x</a></td>
                <td>Free only</td>
                <td>Self-hosted</td>
                <td>8086</td>
                <td>No (optional)</td>
                <td>InfluxQL</td>
              </tr>
              <tr>
                <td class="product-name"><a href="/influxdb/v2/">InfluxDB OSS 2.x</a></td>
                <td>Free only</td>
                <td>Self-hosted</td>
                <td>8086</td>
                <td>No</td>
                <td>InfluxQL, Flux</td>
              </tr>
              <tr>
                <td class="product-name"><a href="/influxdb3/cloud-dedicated/">InfluxDB Cloud Dedicated</a></td>
                <td>Paid only</td>
                <td>Cloud</td>
                <td>N/A</td>
                <td>No</td>
                <td>SQL, InfluxQL</td>
              </tr>
              <tr>
                <td class="product-name"><a href="/influxdb3/cloud-serverless/">InfluxDB Cloud Serverless</a></td>
                <td>Free + Paid</td>
                <td>Cloud</td>
                <td>N/A</td>
                <td>N/A</td>
                <td>SQL, InfluxQL, Flux</td>
              </tr>
              <tr>
                <td class="product-name"><a href="/influxdb/cloud/">InfluxDB Cloud (TSM)</a></td>
                <td>Free + Paid</td>
                <td>Cloud</td>
                <td>N/A</td>
                <td>N/A</td>
                <td>InfluxQL, Flux</td>
              </tr>
            </tbody>
          </table>
        </details>
      </div>
    `;
    this.showResult("success", html);
  }
  analyzePingHeaders() {
    const headersText = this.container.querySelector("#ping-headers")?.value.trim();
    if (!headersText) {
      this.showResult("error", "Please paste the ping response headers");
      return;
    }
    if (headersText.includes(
      "# Replace this with your actual response headers"
    ) || headersText.includes("# Example formats:")) {
      this.showResult(
        "error",
        "Please replace the example content with your actual ping response headers"
      );
      return;
    }
    if (headersText.includes("401") || headersText.includes("403")) {
      this.showResult(
        "info",
        `
        <strong>Authentication Required Detected</strong><br><br>
        The ping endpoint requires authentication, which indicates you're likely using one of:<br><br>
        <div class="expected-results">
          <div class="manual-output">
            <strong>InfluxDB 3 Enterprise</strong> - Requires auth by default (opt-out possible)
          </div>
          <div class="manual-output">
            <strong>InfluxDB 3 Core</strong> - Requires auth by default (opt-out possible)
          </div>
        </div>
        Please use the guided questions to narrow down your specific version.
      `
      );
      return;
    }
    const headers = {};
    headersText.split("\n").forEach((line) => {
      const colonIndex = line.indexOf(":");
      if (colonIndex > -1) {
        const key = line.substring(0, colonIndex).trim().toLowerCase();
        const value = line.substring(colonIndex + 1).trim();
        headers[key] = value;
      }
    });
    const buildHeader = headers["x-influxdb-build"];
    if (buildHeader) {
      if (buildHeader.toLowerCase().includes("enterprise")) {
        this.showDetectedVersion("InfluxDB 3 Enterprise");
        return;
      } else if (buildHeader.toLowerCase().includes("core")) {
        this.showDetectedVersion("InfluxDB 3 Core");
        return;
      }
    }
    let detectedProduct = null;
    for (const [productName, config] of Object.entries(this.products)) {
      if (config.detection?.ping_headers) {
        let matches = true;
        for (const [header, pattern] of Object.entries(
          config.detection.ping_headers
        )) {
          const regex = new RegExp(pattern);
          if (!headers[header] || !regex.test(headers[header])) {
            matches = false;
            break;
          }
        }
        if (matches) {
          detectedProduct = productName;
          break;
        }
      }
    }
    if (detectedProduct) {
      this.showDetectedVersion(detectedProduct);
    } else {
      this.showResult(
        "warning",
        "Unable to determine version from headers. Consider using the guided questions instead."
      );
    }
  }
  showResult(type, message) {
    if (this.resultDiv) {
      this.resultDiv.className = `result ${type} show`;
      this.resultDiv.innerHTML = message;
    }
    if (this.restartBtn) {
      this.restartBtn.style.display = "block";
    }
  }
  analyzeDockerOutput() {
    const dockerOutput = this.container.querySelector("#docker-output")?.value.trim();
    if (!dockerOutput) {
      this.showResult("error", "Please paste the Docker command output");
      return;
    }
    if (dockerOutput.includes("# Replace this with your actual command output") || dockerOutput.includes("# Example formats:")) {
      this.showResult(
        "error",
        "Please replace the example content with your actual Docker command output"
      );
      return;
    }
    let detectedProduct = null;
    if (dockerOutput.includes("InfluxDB 3 Core")) {
      detectedProduct = "InfluxDB 3 Core";
    } else if (dockerOutput.includes("InfluxDB 3 Enterprise")) {
      detectedProduct = "InfluxDB 3 Enterprise";
    } else if (dockerOutput.includes("InfluxDB v3")) {
      detectedProduct = "InfluxDB 3 Core or Enterprise";
    } else if (dockerOutput.includes("InfluxDB v2") || dockerOutput.includes("InfluxDB 2.")) {
      detectedProduct = "InfluxDB OSS 2.x";
    } else if (dockerOutput.includes("InfluxDB v1") || dockerOutput.includes("InfluxDB 1.")) {
      if (dockerOutput.includes("Enterprise")) {
        detectedProduct = "InfluxDB Enterprise";
      } else {
        detectedProduct = "InfluxDB OSS 1.x";
      }
    }
    if (!detectedProduct) {
      const buildMatch = dockerOutput.match(/x-influxdb-build:\s*(\w+)/i);
      if (buildMatch) {
        const build = buildMatch[1].toLowerCase();
        if (build === "enterprise") {
          detectedProduct = "InfluxDB 3 Enterprise";
        } else if (build === "core") {
          detectedProduct = "InfluxDB 3 Core";
        }
      }
      if (!detectedProduct) {
        const versionMatch = dockerOutput.match(
          /x-influxdb-version:\s*([\d.]+)/i
        );
        if (versionMatch) {
          const version2 = versionMatch[1];
          if (version2.startsWith("3.")) {
            detectedProduct = "InfluxDB 3 Core or InfluxDB 3Enterprise";
          } else if (version2.startsWith("2.")) {
            detectedProduct = "InfluxDB OSS 2.x";
          } else if (version2.startsWith("1.")) {
            detectedProduct = dockerOutput.includes("Enterprise") ? "InfluxDB Enterprise" : "InfluxDB OSS 1.x";
          }
        }
      }
    }
    if (detectedProduct) {
      this.showDetectedVersion(detectedProduct);
    } else {
      this.showResult(
        "warning",
        "Unable to determine version from Docker output. Consider using the guided questions instead."
      );
    }
  }
  showPingTestSuggestion(url, productName) {
    const displayName = this.getProductDisplayName(productName) || productName;
    const html = `
      <strong>Port 8181 detected - likely ${displayName}</strong><br><br>

      <p>To distinguish between InfluxDB 3 Core and Enterprise, run one of these commands:</p>

      <div class="code-block">
# Direct API call:
curl -I ${url}/ping
      </div>

      <details style="margin: 1rem 0;">
        <summary class="expandable-summary">
          View Docker/Container Commands
        </summary>
        <div class="code-block" style="margin-top: 0.5rem;">
# With Docker Compose:
docker compose exec influxdb3 curl -I http://localhost:8181/ping

# With Docker (replace &lt;container&gt; with your container name):
docker exec &lt;container&gt; curl -I localhost:8181/ping
        </div>
      </details>

      <div class="expected-results">
        <div class="results-title">Expected results from command:</div>
        \u2022 Response header <strong>X-Influxdb-Build: Enterprise</strong> \u2192 InfluxDB 3 Enterprise (definitive)<br>
        \u2022 Response header <strong>X-Influxdb-Build: Core</strong> \u2192 InfluxDB 3 Core (definitive)<br>
        \u2022 Status code <strong>401 Unauthorized</strong> \u2192 Use the license information below
      </div>

      <div class="authorization-help">
        <div class="results-title">If you get 401 Unauthorized:</div>
        <p><strong>What type of license do you have?</strong></p>
        <button class="option-button compact"
                data-action="auth-help-answer"
                data-category="paid"
                data-value="free">
          Free / Open Source
        </button>
        <button class="option-button compact"
                data-action="auth-help-answer"
                data-category="paid"
                data-value="paid">
          Paid / Commercial
        </button>
      </div>

      <div class="action-section">
        <strong>Can't run the command?</strong>
        <button class="option-button" data-action="start-questionnaire" data-context="v3-port-detected">
          Use guided questions instead
        </button>
      </div>
    `;
    this.showResult("success", html);
  }
  showOSSVersionCheckSuggestion(url) {
    const html = `
      <strong>Port 8086 detected - likely InfluxDB OSS</strong><br><br>

      <p>To determine if this is InfluxDB OSS v1.x or v2.x, run one of these commands:</p>

      <div class="code-block">
# Check version directly:
influxd version

# Or check via API:
curl -I ${url}/ping
      </div>

      <div class="expected-results">
        <div class="results-title">Look for version pattern:</div>
        \u2022 <strong>v1.x.x</strong> (for example, v1.8.10) \u2192 ${this.getProductDisplayName("oss-v1")}<br>
        \u2022 <strong>v2.x.x</strong> (for example, v2.7.4) \u2192 ${this.getProductDisplayName("oss-v2")}<br>
        <p style="font-size: 0.9em; margin-top: 0.5rem; opacity: 0.8;">
          From <code>influxd version</code> command output or <code>X-Influxdb-Version</code> response header
        </p>
      </div>

      <details style="margin: 1rem 0;">
        <summary class="expandable-summary">
          Docker/Container Commands
        </summary>
        <div class="code-block" style="margin-top: 0.5rem;">
# Get version info:
docker exec &lt;container&gt; influxd version

# Get ping headers:
docker exec &lt;container&gt; curl -I ${_InfluxDBVersionDetector.DEFAULT_HOST_PORT}/ping

# Or check startup logs:
docker logs &lt;container&gt; 2>&1 | head -20
        </div>
        <p style="margin-top: 0.5rem; font-size: 0.9em; opacity: 0.8;">
          Replace &lt;container&gt; with your actual container name or ID.
        </p>
      </details>

      <div class="action-section">
        <strong>Can't run these commands?</strong>
        <button class="option-button" data-action="start-questionnaire" data-context="oss-port-detected">
          Use guided questions instead
        </button>
      </div>
    `;
    this.showResult("success", html);
  }
  showMultipleCandidatesSuggestion(url, port) {
    let candidates = [];
    let portDescription = "";
    if (port === "8086") {
      candidates = [
        "InfluxDB OSS 1.x",
        "InfluxDB OSS 2.x",
        "InfluxDB Enterprise"
      ];
      portDescription = "Port 8086 is used by InfluxDB OSS v1.x, OSS v2.x, and Enterprise v1.x";
    } else if (port === "8181") {
      candidates = ["InfluxDB 3 Core", "InfluxDB 3 Enterprise"];
      portDescription = "Port 8181 is used by InfluxDB 3 Core and Enterprise";
    }
    const candidatesList = candidates.map(
      (product2) => this.generateProductResult(product2, false, "Medium", false)
    ).join("");
    const html = `
      <strong>Based on the port pattern in your URL, here are the possible products:</strong><br><br>

      <p style="margin: 1rem 0;">${portDescription}. Without additional information, we cannot determine which specific version you're using.</p>

      <div class="product-candidates" style="margin: 1rem 0;">
        <strong>Possible products:</strong><br>
        ${candidatesList}
      </div>

      <div class="action-section">
        <strong>To narrow this down:</strong>
        <button class="option-button" data-action="start-questionnaire" data-context="port-detected">
          Answer a few questions
        </button>
      </div>
    `;
    this.showResult("info", html);
  }
  showDetectedVersion(productName) {
    this.trackAnalyticsEvent({
      interaction_type: "product_detected",
      detected_product: productName.toLowerCase().replace(/\s+/g, "_"),
      completion_status: "success",
      section: this.getCurrentPageSection()
    });
    const html = `
      <strong>Based on your input, we believe the InfluxDB product you are using is most likely:</strong><br><br>
      ${this.generateProductResult(productName, true, "High", false)}
    `;
    this.showResult("success", html);
  }
  restart() {
    this.answers = {};
    this.questionFlow = [];
    this.currentQuestionIndex = 0;
    this.questionHistory = [];
    const urlInput = this.container.querySelector(
      "#url-input"
    );
    const pingHeaders = this.container.querySelector(
      "#ping-headers"
    );
    const dockerOutput = this.container.querySelector(
      "#docker-output"
    );
    if (urlInput) urlInput.value = "";
    if (pingHeaders) pingHeaders.value = "";
    if (dockerOutput) dockerOutput.value = "";
    const indicator = this.container.querySelector(".url-prefilled-indicator");
    if (indicator) {
      indicator.remove();
    }
    if (this.resultDiv) {
      this.resultDiv.classList.remove("show");
    }
    if (this.restartBtn) {
      this.restartBtn.style.display = "none";
    }
    this.showQuestion("q-url-known");
    if (this.progressBar) {
      this.progressBar.style.width = "0%";
    }
  }
};
function initInfluxDBVersionDetector(options) {
  return new InfluxDBVersionDetector(options);
}

// ns-hugo-imp:/home/runner/work/docs-v2/docs-v2/assets/js/utils/user-agent-platform.js
function getPlatform() {
  if (navigator.userAgentData && navigator.userAgentData.platform) {
    const platform = navigator.userAgentData.platform.toLowerCase();
    if (platform.includes("mac")) return "osx";
    if (platform.includes("win")) return "win";
    if (platform.includes("linux")) return "linux";
  }
  const userAgent = navigator.userAgent.toLowerCase();
  if (userAgent.includes("mac") || userAgent.includes("iphone") || userAgent.includes("ipad"))
    return "osx";
  if (userAgent.includes("win")) return "win";
  if (userAgent.includes("linux") || userAgent.includes("android"))
    return "linux";
  return "other";
}

// ns-hugo-imp:/home/runner/work/docs-v2/docs-v2/assets/js/keybindings.js
var import_jquery13 = __toESM(require_jquery());
function addOSClass(osClass, { $component }) {
  $component.addClass(osClass);
}
function updateKeyBindings({ $component, platform }) {
  const osx = $component.data("osx");
  const linux = $component.data("linux");
  const win = $component.data("win");
  let keybind;
  if (platform === "other") {
    if (win !== linux) {
      keybind = `<code class="osx">${osx}</code> for macOS, <code>${linux}</code> for Linux, and <code>${win}</code> for Windows`;
    } else {
      keybind = `<code>${linux}</code> for Linux and Windows and <code class="osx">${osx}</code> for macOS`;
    }
  } else {
    keybind = `<code>${$component.data(platform)}</code>`;
  }
  $component.html(keybind);
}
function KeyBinding({ component }) {
  const platform = getPlatform();
  const $component = (0, import_jquery13.default)(component);
  addOSClass(platform, { $component });
  updateKeyBindings({ $component, platform });
}

// ns-hugo-imp:/home/runner/work/docs-v2/docs-v2/assets/js/list-filters.js
var import_jquery14 = __toESM(require_jquery());
function countTag(tag) {
  return (0, import_jquery14.default)(".visible[data-tags*='" + tag + "']").length;
}
function getFilterCounts($labels) {
  $labels.each(function() {
    var tagName = (0, import_jquery14.default)("input", this).attr("name").replace(/[\W/]+/, "-");
    var tagCount = countTag(tagName);
    (0, import_jquery14.default)(this).attr("data-count", "(" + tagCount + ")");
    if (tagCount <= 0) {
      (0, import_jquery14.default)(this).fadeTo(200, 0.25);
    } else {
      (0, import_jquery14.default)(this).fadeTo(400, 1);
    }
  });
}
function ListFilters({ component }) {
  const $component = (0, import_jquery14.default)(component);
  const $labels = $component.find("label");
  const $inputs = $component.find("input");
  getFilterCounts($labels);
  $inputs.click(function() {
    var tagArray = $component.find("input:checkbox:checked").map(function() {
      return (0, import_jquery14.default)(this).attr("name").replace(/[\W]+/, "-");
    }).get();
    var restoreArray = $component.find("input:checkbox:not(:checked)").map(function() {
      return (0, import_jquery14.default)(this).attr("name").replace(/[\W]+/, "-");
    }).get();
    if ((0, import_jquery14.default)(this).is(":checked")) {
      import_jquery14.default.each(tagArray, function(index, value) {
        (0, import_jquery14.default)(".filter-item.visible:not([data-tags~='" + value + "'])").removeClass("visible").fadeOut();
      });
    } else {
      import_jquery14.default.each(restoreArray, function(index, value) {
        (0, import_jquery14.default)(".filter-item:not(.visible)[data-tags~='" + value + "']").addClass("visible").fadeIn();
      });
      import_jquery14.default.each(tagArray, function(index, value) {
        (0, import_jquery14.default)(".filter-item.visible:not([data-tags~='" + value + "'])").removeClass("visible").hide();
      });
    }
    getFilterCounts($labels);
  });
}

// ns-hugo-imp:/home/runner/work/docs-v2/docs-v2/assets/js/version-selector.js
function ProductSelector({ component }) {
  const productDropdown = component.querySelector("#product-dropdown");
  const dropdownItems = component.querySelector("#dropdown-items");
  if (productDropdown) {
    productDropdown.addEventListener("click", function() {
      productDropdown.classList.toggle("open");
      dropdownItems.classList.toggle("open");
    });
  }
  document.addEventListener("click", function(e) {
    if (!e.target.closest(".product-list")) {
      dropdownItems.classList.remove("open");
    }
  });
}

// ns-hugo-imp:/home/runner/work/docs-v2/docs-v2/assets/js/release-toc.js
function ReleaseToc({ component }) {
  const releases = Array.from(document.querySelectorAll("h2")).filter(
    (el) => !el.id.match(/checkpoint-releases/)
  );
  const releaseData = releases.map((el) => ({
    name: el.textContent,
    id: el.id,
    class: el.getAttribute("class"),
    date: el.getAttribute("date")
  }));
  const releaseTocUl = component.querySelector("#release-toc ul");
  releaseData.forEach((release) => {
    releaseTocUl.appendChild(getReleaseItem(release));
  });
  const showMoreBtn = component.querySelector(".show-more");
  if (showMoreBtn) {
    showMoreBtn.addEventListener("click", function() {
      const itemHeight = 1.885;
      const releaseNum = releaseData.length;
      const maxHeight = releaseNum * itemHeight;
      const releaseList = document.getElementById("release-list");
      const releaseIncrement = Number(releaseList.getAttribute("show"));
      const currentHeightMatch = releaseList.style.height.match(/\d+\.?\d+/);
      const currentHeight = currentHeightMatch ? Number(currentHeightMatch[0]) : 0;
      const potentialHeight = currentHeight + releaseIncrement * itemHeight;
      const newHeight = potentialHeight > maxHeight ? maxHeight : potentialHeight;
      releaseList.style.height = `${newHeight}rem`;
      if (newHeight >= maxHeight) {
        showMoreBtn.style.transition = "opacity 0.1s";
        showMoreBtn.style.opacity = 0;
        setTimeout(() => {
          showMoreBtn.style.display = "none";
        }, 100);
      }
    });
  }
}
function getReleaseItem(releaseData) {
  const li = document.createElement("li");
  if (releaseData.class !== null) {
    li.className = releaseData.class;
  }
  li.innerHTML = `<a href="#${releaseData.id}">${releaseData.name}</a>`;
  li.setAttribute("date", releaseData.date);
  return li;
}

// ns-hugo-imp:/home/runner/work/docs-v2/docs-v2/assets/js/sidebar-toggle.js
var sidebar_state_preference_name = "sidebar_state";
function toggleSidebar(toggle_state) {
  var i, link_tag;
  for (i = 0, link_tag = document.getElementsByTagName("link"); i < link_tag.length; i++) {
    if (link_tag[i].rel.indexOf("stylesheet") != -1 && link_tag[i].title.includes("sidebar")) {
      link_tag[i].disabled = true;
      if (link_tag[i].title == toggle_state) {
        link_tag[i].disabled = false;
      }
    }
    setPreference(
      sidebar_state_preference_name,
      toggle_state.replace(/sidebar-/, "")
    );
  }
}
function setSidebarState() {
  var toggle_state = `sidebar-${getPreference(sidebar_state_preference_name)}`;
  if (toggle_state !== void 0) {
    toggleSidebar(toggle_state);
  }
}
function SidebarToggle({ component }) {
  const current_state = component.getAttribute("data-state");
  component.querySelector('[data-action="toggle"]').addEventListener("click", () => {
    toggleSidebar(`sidebar-${current_state}`);
    return false;
  });
  setSidebarState();
}

// ns-hugo-imp:/home/runner/work/docs-v2/docs-v2/assets/js/search-button.js
function SearchButton({ component }) {
  component.querySelector('[data-action="toggle"]').addEventListener("click", () => {
    toggleSidebar("sidebar-open");
    document.getElementById("algolia-search-input").focus();
    return false;
  });
}

// ns-hugo-imp:/home/runner/work/docs-v2/docs-v2/assets/js/utils/search-interactions.js
function SearchInteractions({ searchInput }) {
  const contentWrapper = document.querySelector(".content-wrapper");
  let observer = null;
  let dropdownObserver = null;
  let dropdownMenu = null;
  const debug2 = false;
  function handleFocus() {
    contentWrapper.style.opacity = "0.35";
    contentWrapper.style.transition = "opacity 300ms";
  }
  function handleBlur(event) {
    const relatedTarget = event.relatedTarget;
    if (relatedTarget && (relatedTarget.closest(".algolia-autocomplete") || relatedTarget.closest(".ds-dropdown-menu"))) {
      return;
    }
    contentWrapper.style.opacity = "1";
    contentWrapper.style.transition = "opacity 200ms";
    if (dropdownMenu) {
      dropdownMenu.style.display = "none";
    }
  }
  searchInput.addEventListener("focus", handleFocus);
  searchInput.addEventListener("blur", handleBlur);
  observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === "childList") {
        const newDropdown = document.querySelector(
          ".ds-dropdown-menu:not([data-monitored])"
        );
        if (newDropdown) {
          dropdownMenu = newDropdown;
          newDropdown.setAttribute("data-monitored", "true");
          dropdownObserver = new MutationObserver((dropdownMutations) => {
            for (const dropdownMutation of dropdownMutations) {
              if (debug2) {
                if (dropdownMutation.type === "attributes" && dropdownMutation.attributeName === "style") {
                  console.log(
                    "Dropdown style changed:",
                    dropdownMenu.style.display
                  );
                }
              }
            }
          });
          dropdownObserver.observe(dropdownMenu, {
            attributes: true,
            attributeFilter: ["style"]
          });
          dropdownMenu.addEventListener("mousedown", (e) => {
            e.preventDefault();
          });
        }
      }
    }
  });
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  return function cleanup() {
    searchInput.removeEventListener("focus", handleFocus);
    searchInput.removeEventListener("blur", handleBlur);
    if (observer) {
      observer.disconnect();
    }
    if (dropdownObserver) {
      dropdownObserver.disconnect();
    }
  };
}

// ns-hugo-imp:/home/runner/work/docs-v2/docs-v2/assets/js/components/sidebar-search.js
function SidebarSearch({ component }) {
  const searchInput = component.querySelector(".sidebar--search-field");
  SearchInteractions({ searchInput });
}

// ns-hugo-imp:/home/runner/work/docs-v2/docs-v2/assets/js/components/tc-dynamic-values.js
var PATTERNS = [
  { regex: /&\{[^}]+\}/g, className: "param" },
  { regex: /\$\{[^}]+\}/g, className: "env" },
  { regex: /@\{[^:]+:[^}]+\}/g, className: "secret" }
];
function highlightDynamicValues(codeEl) {
  const walker = document.createTreeWalker(codeEl, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  while (walker.nextNode()) {
    textNodes.push(walker.currentNode);
  }
  for (const node of textNodes) {
    const text = node.textContent;
    let hasMatch = false;
    for (const { regex } of PATTERNS) {
      regex.lastIndex = 0;
      if (regex.test(text)) {
        hasMatch = true;
        break;
      }
    }
    if (!hasMatch) continue;
    const fragment = document.createDocumentFragment();
    let remaining = text;
    while (remaining.length > 0) {
      let earliestMatch = null;
      let earliestIndex = remaining.length;
      let matchedPattern = null;
      for (const pattern of PATTERNS) {
        pattern.regex.lastIndex = 0;
        const match = pattern.regex.exec(remaining);
        if (match && match.index < earliestIndex) {
          earliestMatch = match;
          earliestIndex = match.index;
          matchedPattern = pattern;
        }
      }
      if (!earliestMatch) {
        fragment.appendChild(document.createTextNode(remaining));
        break;
      }
      if (earliestIndex > 0) {
        fragment.appendChild(
          document.createTextNode(remaining.slice(0, earliestIndex))
        );
      }
      const span = document.createElement("span");
      span.className = `tc-dynamic-value ${matchedPattern.className}`;
      span.textContent = earliestMatch[0];
      fragment.appendChild(span);
      remaining = remaining.slice(earliestIndex + earliestMatch[0].length);
    }
    node.parentNode.replaceChild(fragment, node);
  }
}
function TcDynamicValues({ component }) {
  const codeEl = component.querySelector("code");
  if (codeEl) {
    highlightDynamicValues(codeEl);
  }
}

// ns-hugo-imp:/home/runner/work/docs-v2/docs-v2/assets/js/theme.js
var PROPS = {
  style_preference_name: "theme",
  style_cookie_duration: 30,
  // number of days
  style_domain: "docs.influxdata.com"
};
function getPreferredTheme() {
  return `${getPreference(PROPS.style_preference_name)}-theme`;
}
function switchStyle({ styles_element, css_title }) {
  styles_element.querySelectorAll('link[rel*="stylesheet"][title*="theme"]').forEach(function(link2) {
    link2.disabled = true;
  });
  const link = styles_element.querySelector(
    `link[rel*="stylesheet"][title="${css_title}"]`
  );
  link && (link.disabled = false);
  setPreference(PROPS.style_preference_name, css_title.replace(/-theme/, ""));
}
function setVisibility(component) {
  component.style.visibility = "visible";
}
function Theme({ component, style }) {
  if (style == void 0) {
    style = getPreferredTheme();
  }
  style && switchStyle({ styles_element: document, css_title: style });
  if (component.dataset?.themeCallback === "setVisibility") {
    setVisibility(component);
  }
}

// ns-hugo-imp:/home/runner/work/docs-v2/docs-v2/assets/js/theme-switch.js
function ThemeSwitch({ component }) {
  if (component === void 0) {
    component = document;
  }
  component.querySelectorAll(".theme-switch-light").forEach((button) => {
    button.addEventListener("click", function(event) {
      event.preventDefault();
      Theme({ component, style: "light-theme" });
    });
  });
  component.querySelectorAll(".theme-switch-dark").forEach((button) => {
    button.addEventListener("click", function(event) {
      event.preventDefault();
      Theme({ component, style: "dark-theme" });
    });
  });
}

// ns-hugo-imp:/home/runner/work/docs-v2/docs-v2/assets/js/components/api-toc.ts
function getVisibleHeadings(maxLevel = 2) {
  const activePanel = document.querySelector(
    '.tab-content:not([style*="display: none"]), [data-tab-panel]:not([style*="display: none"]), .article--content'
  );
  if (!activePanel) {
    return [];
  }
  const selectors = [];
  for (let level = 2; level <= maxLevel; level++) {
    selectors.push(`h${level}`);
  }
  const headings = activePanel.querySelectorAll(selectors.join(", "));
  const entries = [];
  headings.forEach((heading) => {
    if (!heading.id) {
      return;
    }
    const rect = heading.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) {
      return;
    }
    const level = parseInt(heading.tagName.charAt(1), 10);
    entries.push({
      id: heading.id,
      text: heading.textContent?.trim() || "",
      level
    });
  });
  return entries;
}
function buildTocHtml(entries) {
  if (entries.length === 0) {
    return "";
  }
  let html = '<ul class="api-toc-list">';
  entries.forEach((entry) => {
    const indent = entry.level === 3 ? " api-toc-item--nested" : "";
    html += `
      <li class="api-toc-item${indent}">
        <a href="#${entry.id}" class="api-toc-link">${entry.text}</a>
      </li>
    `;
  });
  html += "</ul>";
  return html;
}
function getMethodClass(method) {
  const m = method.toLowerCase();
  switch (m) {
    case "get":
      return "api-method--get";
    case "post":
      return "api-method--post";
    case "put":
      return "api-method--put";
    case "patch":
      return "api-method--patch";
    case "delete":
      return "api-method--delete";
    default:
      return "";
  }
}
function buildOperationsTocHtml(operations) {
  if (operations.length === 0) {
    return '<p class="api-toc-empty">No operations on this page.</p>';
  }
  let html = '<ul class="api-toc-list api-toc-list--operations">';
  operations.forEach((op) => {
    const anchorId = `operation/${op.operationId}`;
    const methodClass = getMethodClass(op.method);
    html += `
      <li class="api-toc-item api-toc-item--operation">
        <a href="#${anchorId}" class="api-toc-link api-toc-link--operation">
          <span class="api-method ${methodClass}">${op.method.toUpperCase()}</span>
          <span class="api-path">${op.path}</span>
        </a>
      </li>
    `;
  });
  html += "</ul>";
  return html;
}
function parseOperationsData(component) {
  const dataAttr = component.getAttribute("data-operations");
  if (!dataAttr) {
    return null;
  }
  try {
    const operations = JSON.parse(dataAttr);
    return Array.isArray(operations) ? operations : null;
  } catch (e) {
    console.warn("[API TOC] Failed to parse operations data:", e);
    return null;
  }
}
function setupScrollHighlighting(container, entries) {
  if (entries.length === 0) {
    return null;
  }
  const headingIds = entries.map((e) => e.id);
  const links = container.querySelectorAll(".api-toc-link");
  const linkMap = /* @__PURE__ */ new Map();
  links.forEach((link) => {
    const href = link.getAttribute("href");
    if (href?.startsWith("#")) {
      linkMap.set(href.slice(1), link);
    }
  });
  const visibleHeadings = /* @__PURE__ */ new Set();
  const observer = new IntersectionObserver(
    (observerEntries) => {
      observerEntries.forEach((entry) => {
        const id = entry.target.id;
        if (entry.isIntersecting) {
          visibleHeadings.add(id);
        } else {
          visibleHeadings.delete(id);
        }
      });
      let activeId = null;
      for (const id of headingIds) {
        if (visibleHeadings.has(id)) {
          activeId = id;
          break;
        }
      }
      if (!activeId && visibleHeadings.size === 0) {
        const scrollY2 = window.scrollY;
        for (let i = headingIds.length - 1; i >= 0; i--) {
          const heading = document.getElementById(headingIds[i]);
          if (heading && heading.offsetTop < scrollY2 + 100) {
            activeId = headingIds[i];
            break;
          }
        }
      }
      links.forEach((link) => {
        link.classList.remove("is-active");
      });
      if (activeId) {
        const activeLink = linkMap.get(activeId);
        activeLink?.classList.add("is-active");
      }
    },
    {
      rootMargin: "-80px 0px -70% 0px",
      threshold: 0
    }
  );
  headingIds.forEach((id) => {
    const heading = document.getElementById(id);
    if (heading) {
      observer.observe(heading);
    }
  });
  return observer;
}
function setupSmoothScroll(container) {
  container.addEventListener("click", (event) => {
    const target = event.target;
    const link = target.closest(".api-toc-link");
    if (!link) {
      return;
    }
    const href = link.getAttribute("href");
    if (!href?.startsWith("#")) {
      return;
    }
    const targetElement = document.getElementById(href.slice(1));
    if (!targetElement) {
      return;
    }
    event.preventDefault();
    const headerOffset = 80;
    const elementPosition = targetElement.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.scrollY - headerOffset;
    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth"
    });
    history.pushState(null, "", href);
  });
}
function updateTocVisibility(container) {
  const operationsPanel = document.querySelector(
    '[data-tab-panel="operations"]'
  );
  const isOperationsVisible = operationsPanel && !operationsPanel.getAttribute("style")?.includes("display: none");
  if (isOperationsVisible) {
    container.classList.add("is-hidden");
  } else {
    container.classList.remove("is-hidden");
  }
}
function watchTabChanges(container, rebuild) {
  const tabPanels = document.querySelector(".api-tab-panels");
  if (!tabPanels) {
    return new MutationObserver(() => {
    });
  }
  const observer = new MutationObserver((mutations) => {
    const hasVisibilityChange = mutations.some((mutation) => {
      return mutation.type === "attributes" && (mutation.attributeName === "style" || mutation.attributeName === "class");
    });
    if (hasVisibilityChange) {
      updateTocVisibility(container);
      setTimeout(rebuild, 100);
    }
  });
  observer.observe(tabPanels, {
    attributes: true,
    subtree: true,
    attributeFilter: ["style", "class"]
  });
  return observer;
}
function ApiToc({ component }) {
  const nav = component.querySelector(".api-toc-nav");
  if (!nav) {
    console.warn("[API TOC] No .api-toc-nav element found");
    return;
  }
  const hasServerRenderedToc = nav.querySelectorAll(".api-toc-link").length > 0;
  if (hasServerRenderedToc) {
    component.classList.remove("is-hidden");
    setupSmoothScroll(component);
    const preRenderedLinks = nav.querySelectorAll(".api-toc-link");
    const preRenderedEntries = [];
    preRenderedLinks.forEach((link) => {
      const href = link.getAttribute("href");
      if (href?.startsWith("#")) {
        preRenderedEntries.push({
          id: href.slice(1),
          text: link.textContent?.trim() || "",
          level: 2
        });
      }
    });
    if (preRenderedEntries.length > 0) {
      setupScrollHighlighting(component, preRenderedEntries);
    }
    return;
  }
  const operations = parseOperationsData(component);
  let observer = null;
  const maxHeadingLevel = parseInt(
    component.getAttribute("data-toc-depth") || "2",
    10
  );
  function rebuild() {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
    if (operations && operations.length > 0) {
      if (nav) {
        nav.innerHTML = buildOperationsTocHtml(operations);
      }
      component.classList.remove("is-hidden");
      return;
    }
    const entries = getVisibleHeadings(maxHeadingLevel);
    if (nav) {
      nav.innerHTML = buildTocHtml(entries);
    }
    if (entries.length === 0) {
      component.classList.add("is-hidden");
    } else {
      component.classList.remove("is-hidden");
      observer = setupScrollHighlighting(component, entries);
    }
  }
  if (!operations || operations.length === 0) {
    updateTocVisibility(component);
  }
  rebuild();
  setupSmoothScroll(component);
  if (!operations || operations.length === 0) {
    watchTabChanges(component, rebuild);
  }
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = window.setTimeout(rebuild, 250);
  });
}

// <stdin>
var componentRegistry = {
  "ask-ai-trigger": AskAITrigger,
  "code-placeholder": CodePlaceholder,
  "custom-time-trigger": CustomTimeTrigger,
  diagram: Diagram,
  "doc-search": DocSearch,
  "download-external": DownloadExternal,
  "feature-callout": FeatureCallout,
  "flux-group-keys-demo": FluxGroupKeysDemo,
  "flux-influxdb-versions-trigger": FluxInfluxDBVersionsTrigger,
  "format-selector": FormatSelector,
  "influxdb-version-detector": initInfluxDBVersionDetector,
  keybinding: KeyBinding,
  "list-filters": ListFilters,
  "product-selector": ProductSelector,
  "release-toc": ReleaseToc,
  "search-button": SearchButton,
  "sidebar-search": SidebarSearch,
  "sidebar-toggle": SidebarToggle,
  "tc-dynamic-values": TcDynamicValues,
  theme: Theme,
  "theme-switch": ThemeSwitch,
  "api-toc": ApiToc
};
function initGlobals() {
  if (typeof window.influxdatadocs === "undefined") {
    window.influxdatadocs = {};
  }
  window.influxdatadocs.delay = delay;
  window.influxdatadocs.localStorage = window.LocalStorageAPI = local_storage_exports;
  window.influxdatadocs.pageContext = page_context_exports;
  window.influxdatadocs.toggleModal = toggleModal;
  window.influxdatadocs.componentRegistry = componentRegistry;
  if (typeof window.jQuery === "undefined") {
    window.jQuery = window.$ = import_jquery15.default;
  }
  return window.influxdatadocs;
}
function initComponents(globals) {
  const components = document.querySelectorAll("[data-component]");
  components.forEach((component) => {
    const componentName = component.getAttribute("data-component");
    const ComponentConstructor = componentRegistry[componentName];
    if (ComponentConstructor) {
      try {
        const options = { component };
        const instance = ComponentConstructor(options);
        globals[componentName] = ComponentConstructor;
        if (!globals.instances) {
          globals.instances = {};
        }
        if (!globals.instances[componentName]) {
          globals.instances[componentName] = [];
        }
        globals.instances[componentName].push({
          element: component,
          instance
        });
      } catch (error) {
        console.error(
          `Error initializing component "${componentName}":`,
          error
        );
      }
    } else {
      console.warn(`Unknown component: "${componentName}"`);
    }
  });
}
function initModules() {
  initialize6();
  initialize3();
  initialize4();
  initialize();
  initialize5();
  InfluxDBUrl();
  initialize7();
  initialize8();
  initialize2();
  initialize9();
  initialize10();
}
function init() {
  const globals = initGlobals();
  initModules();
  initComponents(globals);
}
document.addEventListener("DOMContentLoaded", init);
export {
  componentRegistry,
  initGlobals
};
/*! Bundled license information:

jquery/dist/jquery.js:
  (*!
   * jQuery JavaScript Library v3.7.1
   * https://jquery.com/
   *
   * Copyright OpenJS Foundation and other contributors
   * Released under the MIT license
   * https://jquery.org/license
   *
   * Date: 2023-08-28T13:37Z
   *)
*/
