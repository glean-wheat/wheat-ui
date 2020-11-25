var wheatui;wheatui =
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_variables_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_variables_css__WEBPACK_IMPORTED_MODULE_1__.default, options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_variables_css__WEBPACK_IMPORTED_MODULE_1__.default.locals || {});

/***/ }),
/* 2 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var isOldIE = function isOldIE() {
  var memo;
  return function memorize() {
    if (typeof memo === 'undefined') {
      // Test for IE <= 9 as proposed by Browserhacks
      // @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
      // Tests for existence of standard globals is to allow style-loader
      // to operate correctly into non-standard environments
      // @see https://github.com/webpack-contrib/style-loader/issues/177
      memo = Boolean(window && document && document.all && !window.atob);
    }

    return memo;
  };
}();

var getTarget = function getTarget() {
  var memo = {};
  return function memorize(target) {
    if (typeof memo[target] === 'undefined') {
      var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

      if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
        try {
          // This will throw an exception if access to iframe is blocked
          // due to cross-origin restrictions
          styleTarget = styleTarget.contentDocument.head;
        } catch (e) {
          // istanbul ignore next
          styleTarget = null;
        }
      }

      memo[target] = styleTarget;
    }

    return memo[target];
  };
}();

var stylesInDom = [];

function getIndexByIdentifier(identifier) {
  var result = -1;

  for (var i = 0; i < stylesInDom.length; i++) {
    if (stylesInDom[i].identifier === identifier) {
      result = i;
      break;
    }
  }

  return result;
}

function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var index = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3]
    };

    if (index !== -1) {
      stylesInDom[index].references++;
      stylesInDom[index].updater(obj);
    } else {
      stylesInDom.push({
        identifier: identifier,
        updater: addStyle(obj, options),
        references: 1
      });
    }

    identifiers.push(identifier);
  }

  return identifiers;
}

function insertStyleElement(options) {
  var style = document.createElement('style');
  var attributes = options.attributes || {};

  if (typeof attributes.nonce === 'undefined') {
    var nonce =  true ? __webpack_require__.nc : 0;

    if (nonce) {
      attributes.nonce = nonce;
    }
  }

  Object.keys(attributes).forEach(function (key) {
    style.setAttribute(key, attributes[key]);
  });

  if (typeof options.insert === 'function') {
    options.insert(style);
  } else {
    var target = getTarget(options.insert || 'head');

    if (!target) {
      throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
    }

    target.appendChild(style);
  }

  return style;
}

function removeStyleElement(style) {
  // istanbul ignore if
  if (style.parentNode === null) {
    return false;
  }

  style.parentNode.removeChild(style);
}
/* istanbul ignore next  */


var replaceText = function replaceText() {
  var textStore = [];
  return function replace(index, replacement) {
    textStore[index] = replacement;
    return textStore.filter(Boolean).join('\n');
  };
}();

function applyToSingletonTag(style, index, remove, obj) {
  var css = remove ? '' : obj.media ? "@media ".concat(obj.media, " {").concat(obj.css, "}") : obj.css; // For old IE

  /* istanbul ignore if  */

  if (style.styleSheet) {
    style.styleSheet.cssText = replaceText(index, css);
  } else {
    var cssNode = document.createTextNode(css);
    var childNodes = style.childNodes;

    if (childNodes[index]) {
      style.removeChild(childNodes[index]);
    }

    if (childNodes.length) {
      style.insertBefore(cssNode, childNodes[index]);
    } else {
      style.appendChild(cssNode);
    }
  }
}

function applyToTag(style, options, obj) {
  var css = obj.css;
  var media = obj.media;
  var sourceMap = obj.sourceMap;

  if (media) {
    style.setAttribute('media', media);
  } else {
    style.removeAttribute('media');
  }

  if (sourceMap && typeof btoa !== 'undefined') {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    while (style.firstChild) {
      style.removeChild(style.firstChild);
    }

    style.appendChild(document.createTextNode(css));
  }
}

var singleton = null;
var singletonCounter = 0;

function addStyle(obj, options) {
  var style;
  var update;
  var remove;

  if (options.singleton) {
    var styleIndex = singletonCounter++;
    style = singleton || (singleton = insertStyleElement(options));
    update = applyToSingletonTag.bind(null, style, styleIndex, false);
    remove = applyToSingletonTag.bind(null, style, styleIndex, true);
  } else {
    style = insertStyleElement(options);
    update = applyToTag.bind(null, style, options);

    remove = function remove() {
      removeStyleElement(style);
    };
  }

  update(obj);
  return function updateStyle(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap) {
        return;
      }

      update(obj = newObj);
    } else {
      remove();
    }
  };
}

module.exports = function (list, options) {
  options = options || {}; // Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
  // tags it will allow on a page

  if (!options.singleton && typeof options.singleton !== 'boolean') {
    options.singleton = isOldIE();
  }

  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];

    if (Object.prototype.toString.call(newList) !== '[object Array]') {
      return;
    }

    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDom[index].references--;
    }

    var newLastIdentifiers = modulesToDom(newList, options);

    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];

      var _index = getIndexByIdentifier(_identifier);

      if (stylesInDom[_index].references === 0) {
        stylesInDom[_index].updater();

        stylesInDom.splice(_index, 1);
      }
    }

    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),
/* 3 */
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.id, ":root {\n  --color-primary: #4387f4;\n  --color-primary-h: 217deg;\n  --color-primary-s: 89%;\n  --color-primary-l: 61%;\n  --color-primary-10: #f7faff;\n  --color-primary-20: #f0f5fe;\n  --color-primary-30: #d2e2fc;\n  --color-primary-40: #b4cffb;\n  --color-primary-50: #7babf7;\n  --color-primary-60: #3c79dc;\n  --color-primary-70: #2f5eab;\n  --color-primary-80: #285192;\n  --color-primary-90: #22437a;\n  --color-success: #1da553;\n  --color-success-20: #edf8f1;\n  --color-success-30: #c9e9d6;\n  --color-success-40: #a5dbba;\n  --color-success-50: #61c087;\n  --color-success-60: #1a944b;\n  --color-warning: #ffb31a;\n  --color-warning-20: #fff9ed;\n  --color-warning-30: #ffedc8;\n  --color-warning-40: #ffe0a3;\n  --color-warning-50: #ffc95e;\n  --color-warning-60: #e6a117;\n  --color-danger: #f44343;\n  --color-danger-20: #fef0f0;\n  --color-danger-30: #fcd2d2;\n  --color-danger-40: #fbb4b4;\n  --color-danger-50: #f77b7b;\n  --color-danger-60: #dc3c3c;\n  --color-black: #333;\n  --color-gray-80: #666;\n  --color-gray-70: #999;\n  --color-gray-50: #ccc;\n  --color-gray-30: #d9d9d9;\n  --color-gray-20: #e6e6e6;\n  --color-gray-10: #f2f2f2;\n  --color-white: #fff;\n}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),
/* 4 */
/***/ ((module) => {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
// eslint-disable-next-line func-names
module.exports = function (cssWithMappingToString) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = cssWithMappingToString(item);

      if (item[2]) {
        return "@media ".concat(item[2], " {").concat(content, "}");
      }

      return content;
    }).join('');
  }; // import a list of modules into the list
  // eslint-disable-next-line func-names


  list.i = function (modules, mediaQuery, dedupe) {
    if (typeof modules === 'string') {
      // eslint-disable-next-line no-param-reassign
      modules = [[null, modules, '']];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var i = 0; i < this.length; i++) {
        // eslint-disable-next-line prefer-destructuring
        var id = this[i][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _i = 0; _i < modules.length; _i++) {
      var item = [].concat(modules[_i]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        // eslint-disable-next-line no-continue
        continue;
      }

      if (mediaQuery) {
        if (!item[2]) {
          item[2] = mediaQuery;
        } else {
          item[2] = "".concat(mediaQuery, " and ").concat(item[2]);
        }
      }

      list.push(item);
    }
  };

  return list;
};

/***/ }),
/* 5 */,
/* 6 */,
/* 7 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _base_css_variables_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _button__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8);
/* harmony import */ var _button__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_button__WEBPACK_IMPORTED_MODULE_1__);




/***/ }),
/* 8 */
/***/ (() => {

const template = document.createElement('template')
const templateTagA = document.createElement('template')
const styles = `
<style>
    .wheat-button-container {
      padding: 8px;
    }
    .wheat-button {
      position: relative;
      display: inline-block;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      margin: 0;
      height: 32px;
      padding: 4px 15px;
      border: 1px solid transparent;
      border-radius: 2px;
      font-size: 14px;
      font-weight: 400;
      line-height: 22px;
      text-align: center;
      text-decoration: none;
      vertical-align: middle;
      white-space: nowrap;
      -ms-touch-action: manipulation;
      touch-action: manipulation;
      cursor: pointer;
      -webkit-transition: background-color 0.3s ease-in, border-color 0.3s ease-in,
        color 0.3s ease-in, -webkit-box-shadow 0.15s ease-in;
      transition: background-color 0.3s ease-in, border-color 0.3s ease-in,
        color 0.3s ease-in, -webkit-box-shadow 0.15s ease-in;
      transition: background-color 0.3s ease-in, border-color 0.3s ease-in,
        box-shadow 0.15s ease-in, color 0.3s ease-in;
      transition: background-color 0.3s ease-in, border-color 0.3s ease-in,
        box-shadow 0.15s ease-in, color 0.3s ease-in,
        -webkit-box-shadow 0.15s ease-in;
    }
    .wheat-button.wheat-button--appearance--link {
      background-color: transparent !important;
      border: none !important;
      -webkit-box-shadow: none !important;
      box-shadow: none !important;
    }
    .wheat-button--type--primary {
      background-color: var(--color-primary);
      color: var(--color-white);
    }
    .wheat-button--type--primary:not(.wheat-button--disabled):focus {
      -webkit-box-shadow: 0 0 0 2px var(--color-primary-30);
      box-shadow: 0 0 0 2px var(--color-primary-30);
    }
    .wheat-button--type--primary:not(.wheat-button--disabled):hover {
      background-color: var(--color-primary-60);
      color: var(--color-white);
    }
    .wheat-button--type--primary:not(.wheat-button--disabled):active {
      background-color: var(--color-primary-70);
      color: var(--color-white);
    }
    .wheat-button--type--primary.wheat-button--disabled:not(.wheat-button--loading),
    .wheat-button--type--primary[disabled]:not(.wheat-button--loading) {
      background-color: var(--color-primary-30);
      color: var(--color-white);
    }
    .wheat-button--type--primary.wheat-button--appearance--link {
      color: var(--color-primary);
    }
    .wheat-button--type--primary.wheat-button--appearance--link:not(.wheat-button--disabled):hover {
      color: var(--color-primary-70);
    }
    .wheat-button--type--primary.wheat-button--appearance--link.wheat-button--disabled,
    .wheat-button--type--primary.wheat-button--appearance--link[disabled] {
      color: var(--color-primary);
      opacity: 0.54;
    }
    .wheat-button--type--line {
      background-color: var(--color-primary-20);
      border-color: var(--color-primary-40);
      color: var(--color-primary);
    }
    .wheat-button--type--line:not(.wheat-button--disabled):focus {
      -webkit-box-shadow: 0 0 0 2px var(--color-primary-30);
      box-shadow: 0 0 0 2px var(--color-primary-30);
    }
    .wheat-button--type--line:not(.wheat-button--disabled):hover {
      border-color: rgba(var(--color-primary), 0.8);
      color: var(--color-primary);
    }
    .wheat-button--type--line:not(.wheat-button--disabled):active {
      background-color: rgba(var(--color-primary), 0.15);
      color: var(--color-primary);
    }
    .wheat-button--type--line.wheat-button--disabled:not(.wheat-button--loading),
    .wheat-button--type--line[disabled]:not(.wheat-button--loading) {
      border-color: var(--color-primary-30);
      color: var(--color-primary-40);
    }
    .wheat-button--type--line.wheat-button--appearance--link {
      color: var(--color-primary);
    }
    .wheat-button--type--line.wheat-button--appearance--link:not(.wheat-button--disabled):hover {
      color: var(--color-primary-50);
    }
    .wheat-button--type--line.wheat-button--appearance--link.wheat-button--disabled,
    .wheat-button--type--line.wheat-button--appearance--link[disabled] {
      background-color: transparent;
      border-color: transparent;
      color: var(--color-primary);
      opacity: 0.54;
    }
    .wheat-button--type--default:not(.wheat-button--disabled):focus {
      -webkit-box-shadow: 0 0 0 2px var(--color-primary-30);
      box-shadow: 0 0 0 2px var(--color-primary-30);
    }
    .wheat-button:focus {
      outline: 0;
      z-index: 1;
    }
    .wheat-button + .wheat-button {
      margin-left: 8px;
    }
    .wheat-button .hi-icon {
      margin-right: 4px;
    }
    .wheat-button--size--large {
      height: 54px;
      padding: 13px 60px;
      font-size: 18px;
      line-height: 26px;
    }
    .wheat-button--size--large.wheat-button--icon {
      padding-left: 17px;
      padding-right: 17px;
    }
    .wheat-button--size--large .hi-icon {
      margin-right: 4px;
    }
    .wheat-button--size--small {
      height: 22px;
      padding: 1px 11px;
      font-size: 12px;
      line-height: 18px;
    }
    .wheat-button--size--small.wheat-button--icon {
      padding-left: 5px;
      padding-right: 5px;
    }
    .wheat-button--size--small .hi-icon {
      margin-right: 2px;
    }
    .wheat-button--icon {
      padding-left: 8px;
      padding-right: 8px;
    }
    .wheat-button--icon .hi-icon {
      margin-right: 0;
    }
    .wheat-button--type--default,
    .wheat-button--type--info {
      background-color: var(--color-white);
      border-color: var(--color-gray-30);
      color: var(--color-black);
    }
    .wheat-button--type--default:not(.wheat-button--disabled):hover,
    .wheat-button--type--info:not(.wheat-button--disabled):hover {
      border-color: var(--color-gray-50);
      color: var(--color-black);
    }
    .wheat-button--type--default:not(.wheat-button--disabled):active,
    .wheat-button--type--info:not(.wheat-button--disabled):active {
      background-color: var(--color-gray-20);
      color: var(--color-black);
    }
    .wheat-button--type--default.wheat-button--disabled,
    .wheat-button--type--default[disabled],
    .wheat-button--type--info.wheat-button--disabled,
    .wheat-button--type--info[disabled] {
      background-color: var(--color-gray-20);
      border-color: var(--color-gray-30);
      color: var(--color-gray-50);
    }
    .wheat-button--type--default.wheat-button--appearance--link:not(.wheat-button--disabled):hover,
    .wheat-button--type--info.wheat-button--appearance--link:not(.wheat-button--disabled):hover {
      color: var(--color-gray-70);
    }
    .wheat-button--type--default.wheat-button--appearance--link:not(.wheat-button--disabled):active,
    .wheat-button--type--info.wheat-button--appearance--link:not(.wheat-button--disabled):active {
      color: var(--color-black);
    }
    .wheat-button--type--default.wheat-button--appearance--link.wheat-button--disabled,
    .wheat-button--type--default.wheat-button--appearance--link[disabled],
    .wheat-button--type--info.wheat-button--appearance--link.wheat-button--disabled,
    .wheat-button--type--info.wheat-button--appearance--link[disabled] {
      color: var(--color-black);
      opacity: 0.54;
    }
    .wheat-button--type--success {
      background-color: var(--color-success-20);
      border-color: var(--color-success-40);
      color: var(--color-success);
    }
    .wheat-button--type--success:not(.wheat-button--disabled):focus {
      -webkit-box-shadow: 0 0 0 2px var(--color-success-30);
      box-shadow: 0 0 0 2px var(--color-success-30);
    }
    .wheat-button--type--success:not(.wheat-button--disabled):hover {
      border-color: rgba(var(--color-success), 0.8);
      color: var(--color-success);
    }
    .wheat-button--type--success:not(.wheat-button--disabled):active {
      background-color: rgba(var(--color-success), 0.15);
      color: var(--color-success);
    }
    .wheat-button--type--success.wheat-button--disabled:not(.wheat-button--loading),
    .wheat-button--type--success[disabled]:not(.wheat-button--loading) {
      border-color: var(--color-success-30);
      color: var(--color-success-40);
    }
    .wheat-button--type--success.wheat-button--appearance--link {
      color: var(--color-success);
    }
    .wheat-button--type--success.wheat-button--appearance--link:not(.wheat-button--disabled):hover {
      color: var(--color-success-50);
    }
    .wheat-button--type--success.wheat-button--appearance--link.wheat-button--disabled,
    .wheat-button--type--success.wheat-button--appearance--link[disabled] {
      background-color: transparent;
      border-color: transparent;
      color: var(--color-success);
      opacity: 0.54;
    }
    .wheat-button--type--danger {
      background-color: var(--color-danger-20);
      border-color: var(--color-danger-40);
      color: var(--color-danger);
    }
    .wheat-button--type--danger:not(.wheat-button--disabled):focus {
      -webkit-box-shadow: 0 0 0 2px var(--color-danger-30);
      box-shadow: 0 0 0 2px var(--color-danger-30);
    }
    .wheat-button--type--danger:not(.wheat-button--disabled):hover {
      border-color: rgba(var(--color-danger), 0.8);
      color: var(--color-danger);
    }
    .wheat-button--type--danger:not(.wheat-button--disabled):active {
      background-color: rgba(var(--color-danger), 0.15);
      color: var(--color-danger);
    }
    .wheat-button--type--danger.wheat-button--disabled:not(.wheat-button--loading),
    .wheat-button--type--danger[disabled]:not(.wheat-button--loading) {
      border-color: var(--color-danger-30);
      color: var(--color-danger-40);
    }
    .wheat-button--type--danger.wheat-button--appearance--link {
      color: var(--color-danger);
    }
    .wheat-button--type--danger.wheat-button--appearance--link:not(.wheat-button--disabled):hover {
      color: var(--color-danger-50);
    }
    .wheat-button--type--danger.wheat-button--appearance--link.wheat-button--disabled,
    .wheat-button--type--danger.wheat-button--appearance--link[disabled] {
      background-color: transparent;
      border-color: transparent;
      color: var(--color-danger);
      opacity: 0.54;
    }
    .wheat-button--type--warning {
      background-color: var(--color-warning-20);
      border-color: var(--color-warning-40);
      color: var(--color-warning);
    }
    .wheat-button--type--warning:not(.wheat-button--disabled):focus {
      -webkit-box-shadow: 0 0 0 2px var(--color-warning-30);
      box-shadow: 0 0 0 2px var(--color-warning-30);
    }
    .wheat-button--type--warning:not(.wheat-button--disabled):hover {
      border-color: rgba(var(--color-warning), 0.8);
      color: var(--color-warning);
    }
    .wheat-button--type--warning:not(.wheat-button--disabled):active {
      background-color: rgba(var(--color-warning), 0.15);
      color: var(--color-warning);
    }
    .wheat-button--type--warning.wheat-button--disabled:not(.wheat-button--loading),
    .wheat-button--type--warning[disabled]:not(.wheat-button--loading) {
      border-color: var(--color-warning-30);
      color: var(--color-warning-40);
    }
    .wheat-button--type--warning.wheat-button--appearance--link {
      color: var(--color-warning);
    }
    .wheat-button--type--warning.wheat-button--appearance--link:not(.wheat-button--disabled):hover {
      color: var(--color-warning-50);
    }
    .wheat-button--type--warning.wheat-button--appearance--link.wheat-button--disabled,
    .wheat-button--type--warning.wheat-button--appearance--link[disabled] {
      background-color: transparent;
      border-color: transparent;
      color: var(--color-warning);
      opacity: 0.54;
    }
    .wheat-button--loading {
      position: relative;
    }
    .wheat-button--loading::before {
      position: absolute;
      top: -1px;
      bottom: -1px;
      left: -1px;
      right: -1px;
      content: '';
      background-color: var(--color-white);
      cursor: default;
      opacity: 0.4;
    }
    .wheat-button--loading--icon {
      display: inline-block;
      width: 1em;
      height: 1em;
      cursor: default;
    }
    .wheat-button--loading--icon svg {
      -webkit-animation: rotate 1s linear infinite;
      animation: rotate 1s linear infinite;
    }
    @-webkit-keyframes rotate {
      to {
        -webkit-transform: rotate(360deg);
        transform: rotate(360deg);
      }
    }
    @keyframes rotate {
      to {
        -webkit-transform: rotate(360deg);
        transform: rotate(360deg);
      }
    }
    .wheat-button--disabled,
    .wheat-button[disabled]:not(.wheat-button--loading) {
      cursor: not-allowed;
    }
    .wheat-button--block {
      display: block;
      width: 100%;
    }
    .wheat-button--block + .wheat-button--block {
      margin-top: 4px;
    }
    .wheat-button-group {
      display: inline-block;
    }
    .wheat-button-group > .wheat-button {
      margin-left: 0;
      margin-right: 0;
    }
    .wheat-button-group > .wheat-button:hover {
      z-index: 1;
    }
    .wheat-button-group > .wheat-button:not(:first-child) {
      margin-left: -1px;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
    .wheat-button-group > .wheat-button:not(:last-child) {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }
    
  </style>`

template.innerHTML = `
  ${styles}
  <div class="wheat-button-container">
    <button class='wheat-button'>
      <slot name='icon'/>
      Label
    </button>
  </div>
`
templateTagA.innerHTML = `
  ${styles}
  <div class="wheat-button-container">
    <a class='wheat-button'><slot name='icon'/>链接</a>
  </div>
`

class WheatButton extends HTMLElement {
  constructor() {
    super()
    this.href = this.getAttribute('href')
    this.render()
    this.$button = this._shadowRoot.querySelector('.wheat-button')
  }
  static get observedAttributes() {
    return ['disabled', 'href']
  }
  attributeChangedCallback(name, oldVal, newVal) {
    name === 'disabled' && this.setDisabled(name, oldVal, newVal)
    name === 'href' && this.$button.setAttribute(name, newVal)
  }
  setDisabled(name, oldVal, newVal) {
    if (name === 'disabled') {
      this.$button.setAttribute(name, newVal)
      newVal === 'false' && this.$button.removeAttribute(name)
    }
  }

  initBtnStyle() {
    const prefixclassType = 'wheat-button--type--'
    const prefixclassAppearance = 'wheat-button--appearance--'
    const prefixSizeClass = 'wheat-button--size--'
    const size = prefixSizeClass + (this.getAttribute('size') || 'default')
    const type = prefixclassType + (this.getAttribute('type') || 'primary')
    const appearance =
      prefixclassAppearance + (this.getAttribute('appearance') || 'button')
    this.$button.classList.add(type, appearance, size)
  }

  connectedCallback() {
    this.initBtnStyle()
    this.$button.innerHTML = this.innerHTML
  }
  render() {
    this._shadowRoot = this.attachShadow({ mode: 'open' })
    this._shadowRoot.appendChild(
      this.href
        ? templateTagA.content.cloneNode(true)
        : template.content.cloneNode(true)
    )
    // Apply external styles to the shadow dom
  }
}

window.customElements.define('wheat-button', WheatButton)


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => module['default'] :
/******/ 				() => module;
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(7);
/******/ })()
;