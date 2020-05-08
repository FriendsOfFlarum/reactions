module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./admin.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./admin.js":
/*!******************!*\
  !*** ./admin.js ***!
  \******************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _src_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./src/common */ "./src/common/index.js");
/* harmony import */ var _src_common__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_src_common__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _src_common__WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _src_common__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var _src_admin__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./src/admin */ "./src/admin/index.js");
/* empty/unused harmony star reexport */


/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js":
/*!******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js ***!
  \******************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return _inheritsLoose; });
function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

/***/ }),

/***/ "./node_modules/simple-emoji-map/generated/emojis.json":
/*!*************************************************************!*\
  !*** ./node_modules/simple-emoji-map/generated/emojis.json ***!
  \*************************************************************/
/*! exports provided: 2614, 2615, 2648, 2649, 2650, 2651, 2652, 2653, 2693, 2705, 2728, 2753, 2754, 2755, 2757, 2795, 2796, 2797, 1f600, 1f603, 1f604, 1f601, 1f606, 1f605, 1f923, 1f602, 1f642, 1f643, 1f609, 1f60a, 1f607, 1f970, 1f60d, 1f929, 1f618, 1f617, 263a-fe0e, 1f61a, 1f619, 1f60b, 1f61b, 1f61c, 1f92a, 1f61d, 1f911, 1f917, 1f92d, 1f92b, 1f914, 1f910, 1f928, 1f610, 1f611, 1f636, 1f60f, 1f612, 1f644, 1f62c, 1f925, 1f60c, 1f614, 1f62a, 1f924, 1f634, 1f637, 1f912, 1f915, 1f922, 1f92e, 1f927, 1f975, 1f976, 1f974, 1f635, 1f92f, 1f920, 1f973, 1f60e, 1f913, 1f9d0, 1f615, 1f61f, 1f641, 2639-fe0e, 1f62e, 1f62f, 1f632, 1f633, 1f97a, 1f626, 1f627, 1f628, 1f630, 1f625, 1f622, 1f62d, 1f631, 1f616, 1f623, 1f61e, 1f613, 1f629, 1f62b, 1f971, 1f624, 1f621, 1f620, 1f92c, 1f608, 1f47f, 1f480, 2620-fe0e, 1f4a9, 1f921, 1f479, 1f47a, 1f47b, 1f47d, 1f47e, 1f916, 1f63a, 1f638, 1f639, 1f63b, 1f63c, 1f63d, 1f640, 1f63f, 1f63e, 1f648, 1f649, 1f64a, 1f48b, 1f48c, 1f498, 1f49d, 1f496, 1f497, 1f493, 1f49e, 1f495, 1f49f, 2763-fe0e, 1f494, 2764-fe0e, 1f9e1, 1f49b, 1f49a, 1f499, 1f49c, 1f90e, 1f5a4, 1f90d, 1f4af, 1f4a2, 1f4a5, 1f4ab, 1f4a6, 1f4a8, 1f573-fe0e, 1f4a3, 1f4ac, 1f441-200d-1f5e8, 1f5e8-fe0e, 1f5ef-fe0e, 1f4ad, 1f4a4, 1f44b, 1f91a, 1f590-fe0e, 270b, 1f596, 1f44c, 1f90f, 270c-fe0e, 1f91e, 1f91f, 1f918, 1f919, 1f448, 1f449, 1f446, 1f595, 1f447, 261d-fe0e, 1f44d, 1f44e, 270a, 1f44a, 1f91b, 1f91c, 1f44f, 1f64c, 1f450, 1f932, 1f91d, 1f64f, 270d-fe0e, 1f485, 1f933, 1f4aa, 1f9be, 1f9bf, 1f9b5, 1f9b6, 1f442, 1f9bb, 1f443, 1f9e0, 1f9b7, 1f9b4, 1f440, 1f441-fe0e, 1f445, 1f444, 1f476, 1f9d2, 1f466, 1f467, 1f9d1, 1f471, 1f468, 1f9d4, 1f468-200d-1f9b0, 1f468-200d-1f9b1, 1f468-200d-1f9b3, 1f468-200d-1f9b2, 1f469, 1f469-200d-1f9b0, 1f9d1-200d-1f9b0, 1f469-200d-1f9b1, 1f9d1-200d-1f9b1, 1f469-200d-1f9b3, 1f9d1-200d-1f9b3, 1f469-200d-1f9b2, 1f9d1-200d-1f9b2, 1f471-200d-2640-fe0f, 1f471-200d-2642-fe0f, 1f9d3, 1f474, 1f475, 1f64d, 1f64d-200d-2642-fe0f, 1f64d-200d-2640-fe0f, 1f64e, 1f64e-200d-2642-fe0f, 1f64e-200d-2640-fe0f, 1f645, 1f645-200d-2642-fe0f, 1f645-200d-2640-fe0f, 1f646, 1f646-200d-2642-fe0f, 1f646-200d-2640-fe0f, 1f481, 1f481-200d-2642-fe0f, 1f481-200d-2640-fe0f, 1f64b, 1f64b-200d-2642-fe0f, 1f64b-200d-2640-fe0f, 1f9cf, 1f9cf-200d-2642-fe0f, 1f9cf-200d-2640-fe0f, 1f647, 1f647-200d-2642-fe0f, 1f647-200d-2640-fe0f, 1f926, 1f926-200d-2642-fe0f, 1f926-200d-2640-fe0f, 1f937, 1f937-200d-2642-fe0f, 1f937-200d-2640-fe0f, 1f9d1-200d-2695-fe0f, 1f468-200d-2695-fe0f, 1f469-200d-2695-fe0f, 1f9d1-200d-1f393, 1f468-200d-1f393, 1f469-200d-1f393, 1f9d1-200d-1f3eb, 1f468-200d-1f3eb, 1f469-200d-1f3eb, 1f9d1-200d-2696-fe0f, 1f468-200d-2696-fe0f, 1f469-200d-2696-fe0f, 1f9d1-200d-1f33e, 1f468-200d-1f33e, 1f469-200d-1f33e, 1f9d1-200d-1f373, 1f468-200d-1f373, 1f469-200d-1f373, 1f9d1-200d-1f527, 1f468-200d-1f527, 1f469-200d-1f527, 1f9d1-200d-1f3ed, 1f468-200d-1f3ed, 1f469-200d-1f3ed, 1f9d1-200d-1f4bc, 1f468-200d-1f4bc, 1f469-200d-1f4bc, 1f9d1-200d-1f52c, 1f468-200d-1f52c, 1f469-200d-1f52c, 1f9d1-200d-1f4bb, 1f468-200d-1f4bb, 1f469-200d-1f4bb, 1f9d1-200d-1f3a4, 1f468-200d-1f3a4, 1f469-200d-1f3a4, 1f9d1-200d-1f3a8, 1f468-200d-1f3a8, 1f469-200d-1f3a8, 1f9d1-200d-2708-fe0f, 1f468-200d-2708-fe0f, 1f469-200d-2708-fe0f, 1f9d1-200d-1f680, 1f468-200d-1f680, 1f469-200d-1f680, 1f9d1-200d-1f692, 1f468-200d-1f692, 1f469-200d-1f692, 1f46e, 1f46e-200d-2642-fe0f, 1f46e-200d-2640-fe0f, 1f575-fe0e, 1f575-fe0f-200d-2642-fe0f, 1f575-fe0f-200d-2640-fe0f, 1f482, 1f482-200d-2642-fe0f, 1f482-200d-2640-fe0f, 1f477, 1f477-200d-2642-fe0f, 1f477-200d-2640-fe0f, 1f934, 1f478, 1f473, 1f473-200d-2642-fe0f, 1f473-200d-2640-fe0f, 1f472, 1f9d5, 1f935, 1f470, 1f930, 1f931, 1f47c, 1f385, 1f936, 1f9b8, 1f9b8-200d-2642-fe0f, 1f9b8-200d-2640-fe0f, 1f9b9, 1f9b9-200d-2642-fe0f, 1f9b9-200d-2640-fe0f, 1f9d9, 1f9d9-200d-2642-fe0f, 1f9d9-200d-2640-fe0f, 1f9da, 1f9da-200d-2642-fe0f, 1f9da-200d-2640-fe0f, 1f9db, 1f9db-200d-2642-fe0f, 1f9db-200d-2640-fe0f, 1f9dc, 1f9dc-200d-2642-fe0f, 1f9dc-200d-2640-fe0f, 1f9dd, 1f9dd-200d-2642-fe0f, 1f9dd-200d-2640-fe0f, 1f9de, 1f9de-200d-2642-fe0f, 1f9de-200d-2640-fe0f, 1f9df, 1f9df-200d-2642-fe0f, 1f9df-200d-2640-fe0f, 1f486, 1f486-200d-2642-fe0f, 1f486-200d-2640-fe0f, 1f487, 1f487-200d-2642-fe0f, 1f487-200d-2640-fe0f, 1f6b6, 1f6b6-200d-2642-fe0f, 1f6b6-200d-2640-fe0f, 1f9cd, 1f9cd-200d-2642-fe0f, 1f9cd-200d-2640-fe0f, 1f9ce, 1f9ce-200d-2642-fe0f, 1f9ce-200d-2640-fe0f, 1f9d1-200d-1f9af, 1f468-200d-1f9af, 1f469-200d-1f9af, 1f9d1-200d-1f9bc, 1f468-200d-1f9bc, 1f469-200d-1f9bc, 1f9d1-200d-1f9bd, 1f468-200d-1f9bd, 1f469-200d-1f9bd, 1f3c3, 1f3c3-200d-2642-fe0f, 1f3c3-200d-2640-fe0f, 1f483, 1f57a, 1f574-fe0e, 1f46f, 1f46f-200d-2642-fe0f, 1f46f-200d-2640-fe0f, 1f9d6, 1f9d6-200d-2642-fe0f, 1f9d6-200d-2640-fe0f, 1f9d7, 1f9d7-200d-2642-fe0f, 1f9d7-200d-2640-fe0f, 1f93a, 1f3c7, 26f7-fe0e, 1f3c2, 1f3cc-fe0e, 1f3cc-fe0f-200d-2642-fe0f, 1f3cc-fe0f-200d-2640-fe0f, 1f3c4, 1f3c4-200d-2642-fe0f, 1f3c4-200d-2640-fe0f, 1f6a3, 1f6a3-200d-2642-fe0f, 1f6a3-200d-2640-fe0f, 1f3ca, 1f3ca-200d-2642-fe0f, 1f3ca-200d-2640-fe0f, 26f9-fe0e, 26f9-fe0f-200d-2642-fe0f, 26f9-fe0f-200d-2640-fe0f, 1f3cb-fe0e, 1f3cb-fe0f-200d-2642-fe0f, 1f3cb-fe0f-200d-2640-fe0f, 1f6b4, 1f6b4-200d-2642-fe0f, 1f6b4-200d-2640-fe0f, 1f6b5, 1f6b5-200d-2642-fe0f, 1f6b5-200d-2640-fe0f, 1f938, 1f938-200d-2642-fe0f, 1f938-200d-2640-fe0f, 1f93c, 1f93c-200d-2642-fe0f, 1f93c-200d-2640-fe0f, 1f93d, 1f93d-200d-2642-fe0f, 1f93d-200d-2640-fe0f, 1f93e, 1f93e-200d-2642-fe0f, 1f93e-200d-2640-fe0f, 1f939, 1f939-200d-2642-fe0f, 1f939-200d-2640-fe0f, 1f9d8, 1f9d8-200d-2642-fe0f, 1f9d8-200d-2640-fe0f, 1f6c0, 1f6cc, 1f9d1-200d-1f91d-200d-1f9d1, 1f46d, 1f46b, 1f46c, 1f48f, 1f469-200d-2764-fe0f-200d-1f48b-200d-1f468, 1f468-200d-2764-fe0f-200d-1f48b-200d-1f468, 1f469-200d-2764-fe0f-200d-1f48b-200d-1f469, 1f491, 1f469-200d-2764-fe0f-200d-1f468, 1f468-200d-2764-fe0f-200d-1f468, 1f469-200d-2764-fe0f-200d-1f469, 1f46a, 1f468-200d-1f469-200d-1f466, 1f468-200d-1f469-200d-1f467, 1f468-200d-1f469-200d-1f467-200d-1f466, 1f468-200d-1f469-200d-1f466-200d-1f466, 1f468-200d-1f469-200d-1f467-200d-1f467, 1f468-200d-1f468-200d-1f466, 1f468-200d-1f468-200d-1f467, 1f468-200d-1f468-200d-1f467-200d-1f466, 1f468-200d-1f468-200d-1f466-200d-1f466, 1f468-200d-1f468-200d-1f467-200d-1f467, 1f469-200d-1f469-200d-1f466, 1f469-200d-1f469-200d-1f467, 1f469-200d-1f469-200d-1f467-200d-1f466, 1f469-200d-1f469-200d-1f466-200d-1f466, 1f469-200d-1f469-200d-1f467-200d-1f467, 1f468-200d-1f466, 1f468-200d-1f466-200d-1f466, 1f468-200d-1f467, 1f468-200d-1f467-200d-1f466, 1f468-200d-1f467-200d-1f467, 1f469-200d-1f466, 1f469-200d-1f466-200d-1f466, 1f469-200d-1f467, 1f469-200d-1f467-200d-1f466, 1f469-200d-1f467-200d-1f467, 1f5e3-fe0e, 1f464, 1f465, 1f463, 1f3fb, 1f3fc, 1f3fd, 1f3fe, 1f3ff, 1f9b0, 1f9b1, 1f9b3, 1f9b2, 1f435, 1f412, 1f98d, 1f9a7, 1f436, 1f415, 1f9ae, 1f415-200d-1f9ba, 1f429, 1f43a, 1f98a, 1f99d, 1f431, 1f408, 1f981, 1f42f, 1f405, 1f406, 1f434, 1f40e, 1f984, 1f993, 1f98c, 1f42e, 1f402, 1f403, 1f404, 1f437, 1f416, 1f417, 1f43d, 1f40f, 1f411, 1f410, 1f42a, 1f42b, 1f999, 1f992, 1f418, 1f98f, 1f99b, 1f42d, 1f401, 1f400, 1f439, 1f430, 1f407, 1f43f-fe0e, 1f994, 1f987, 1f43b, 1f428, 1f43c, 1f9a5, 1f9a6, 1f9a8, 1f998, 1f9a1, 1f43e, 1f983, 1f414, 1f413, 1f423, 1f424, 1f425, 1f426, 1f427, 1f54a-fe0e, 1f985, 1f986, 1f9a2, 1f989, 1f9a9, 1f99a, 1f99c, 1f438, 1f40a, 1f422, 1f98e, 1f40d, 1f432, 1f409, 1f995, 1f996, 1f433, 1f40b, 1f42c, 1f41f, 1f420, 1f421, 1f988, 1f419, 1f41a, 1f40c, 1f98b, 1f41b, 1f41c, 1f41d, 1f41e, 1f997, 1f577-fe0e, 1f578-fe0e, 1f982, 1f99f, 1f9a0, 1f490, 1f338, 1f4ae, 1f3f5-fe0e, 1f339, 1f940, 1f33a, 1f33b, 1f33c, 1f337, 1f331, 1f332, 1f333, 1f334, 1f335, 1f33e, 1f33f, 2618-fe0e, 1f340, 1f341, 1f342, 1f343, 1f347, 1f348, 1f349, 1f34a, 1f34b, 1f34c, 1f34d, 1f96d, 1f34e, 1f34f, 1f350, 1f351, 1f352, 1f353, 1f95d, 1f345, 1f965, 1f951, 1f346, 1f954, 1f955, 1f33d, 1f336-fe0e, 1f952, 1f96c, 1f966, 1f9c4, 1f9c5, 1f344, 1f95c, 1f330, 1f35e, 1f950, 1f956, 1f968, 1f96f, 1f95e, 1f9c7, 1f9c0, 1f356, 1f357, 1f969, 1f953, 1f354, 1f35f, 1f355, 1f32d, 1f96a, 1f32e, 1f32f, 1f959, 1f9c6, 1f95a, 1f373, 1f958, 1f372, 1f963, 1f957, 1f37f, 1f9c8, 1f9c2, 1f96b, 1f371, 1f358, 1f359, 1f35a, 1f35b, 1f35c, 1f35d, 1f360, 1f362, 1f363, 1f364, 1f365, 1f96e, 1f361, 1f95f, 1f960, 1f961, 1f980, 1f99e, 1f990, 1f991, 1f9aa, 1f366, 1f367, 1f368, 1f369, 1f36a, 1f382, 1f370, 1f9c1, 1f967, 1f36b, 1f36c, 1f36d, 1f36e, 1f36f, 1f37c, 1f95b, 1f375, 1f376, 1f37e, 1f377, 1f378, 1f379, 1f37a, 1f37b, 1f942, 1f943, 1f964, 1f9c3, 1f9c9, 1f9ca, 1f962, 1f37d-fe0e, 1f374, 1f944, 1f52a, 1f3fa, 1f30d, 1f30e, 1f30f, 1f310, 1f5fa-fe0e, 1f5fe, 1f9ed, 1f3d4-fe0e, 26f0-fe0e, 1f30b, 1f5fb, 1f3d5-fe0e, 1f3d6-fe0e, 1f3dc-fe0e, 1f3dd-fe0e, 1f3de-fe0e, 1f3df-fe0e, 1f3db-fe0e, 1f3d7-fe0e, 1f9f1, 1f3d8-fe0e, 1f3da-fe0e, 1f3e0, 1f3e1, 1f3e2, 1f3e3, 1f3e4, 1f3e5, 1f3e6, 1f3e8, 1f3e9, 1f3ea, 1f3eb, 1f3ec, 1f3ed, 1f3ef, 1f3f0, 1f492, 1f5fc, 1f5fd, 26ea, 1f54c, 1f6d5, 1f54d, 26e9-fe0e, 1f54b, 26f2, 26fa, 1f301, 1f303, 1f3d9-fe0e, 1f304, 1f305, 1f306, 1f307, 1f309, 2668-fe0e, 1f3a0, 1f3a1, 1f3a2, 1f488, 1f3aa, 1f682, 1f683, 1f684, 1f685, 1f686, 1f687, 1f688, 1f689, 1f68a, 1f69d, 1f69e, 1f68b, 1f68c, 1f68d, 1f68e, 1f690, 1f691, 1f692, 1f693, 1f694, 1f695, 1f696, 1f697, 1f698, 1f699, 1f69a, 1f69b, 1f69c, 1f3ce-fe0e, 1f3cd-fe0e, 1f6f5, 1f9bd, 1f9bc, 1f6fa, 1f6b2, 1f6f4, 1f6f9, 1f68f, 1f6e3-fe0e, 1f6e4-fe0e, 1f6e2-fe0e, 26fd, 1f6a8, 1f6a5, 1f6a6, 1f6d1, 1f6a7, 26f5, 1f6f6, 1f6a4, 1f6f3-fe0e, 26f4-fe0e, 1f6e5-fe0e, 1f6a2, 2708-fe0e, 1f6e9-fe0e, 1f6eb, 1f6ec, 1fa82, 1f4ba, 1f681, 1f69f, 1f6a0, 1f6a1, 1f6f0-fe0e, 1f680, 1f6f8, 1f6ce-fe0e, 1f9f3, 231b, 23f3, 231a, 23f0, 23f1-fe0e, 23f2-fe0e, 1f570-fe0e, 1f55b, 1f567, 1f550, 1f55c, 1f551, 1f55d, 1f552, 1f55e, 1f553, 1f55f, 1f554, 1f560, 1f555, 1f561, 1f556, 1f562, 1f557, 1f563, 1f558, 1f564, 1f559, 1f565, 1f55a, 1f566, 1f311, 1f312, 1f313, 1f314, 1f315, 1f316, 1f317, 1f318, 1f319, 1f31a, 1f31b, 1f31c, 1f321-fe0e, 2600-fe0e, 1f31d, 1f31e, 1fa90, 2b50, 1f31f, 1f320, 1f30c, 2601-fe0e, 26c5, 26c8-fe0e, 1f324-fe0e, 1f325-fe0e, 1f326-fe0e, 1f327-fe0e, 1f328-fe0e, 1f329-fe0e, 1f32a-fe0e, 1f32b-fe0e, 1f32c-fe0e, 1f300, 1f308, 1f302, 2602-fe0e, 26f1-fe0e, 26a1, 2744-fe0e, 2603-fe0e, 26c4, 2604-fe0e, 1f525, 1f4a7, 1f30a, 1f383, 1f384, 1f386, 1f387, 1f9e8, 1f388, 1f389, 1f38a, 1f38b, 1f38d, 1f38e, 1f38f, 1f390, 1f391, 1f9e7, 1f380, 1f381, 1f397-fe0e, 1f39f-fe0e, 1f3ab, 1f396-fe0e, 1f3c6, 1f3c5, 1f947, 1f948, 1f949, 26bd, 26be, 1f94e, 1f3c0, 1f3d0, 1f3c8, 1f3c9, 1f3be, 1f94f, 1f3b3, 1f3cf, 1f3d1, 1f3d2, 1f94d, 1f3d3, 1f3f8, 1f94a, 1f94b, 1f945, 26f3, 26f8-fe0e, 1f3a3, 1f93f, 1f3bd, 1f3bf, 1f6f7, 1f94c, 1f3af, 1fa80, 1fa81, 1f3b1, 1f52e, 1f9ff, 1f3ae, 1f579-fe0e, 1f3b0, 1f3b2, 1f9e9, 1f9f8, 2660-fe0e, 2665-fe0e, 2666-fe0e, 2663-fe0e, 265f-fe0e, 1f0cf, 1f004, 1f3b4, 1f3ad, 1f5bc-fe0e, 1f3a8, 1f9f5, 1f9f6, 1f453, 1f576-fe0e, 1f97d, 1f97c, 1f9ba, 1f454, 1f455, 1f456, 1f9e3, 1f9e4, 1f9e5, 1f9e6, 1f457, 1f458, 1f97b, 1fa71, 1fa72, 1fa73, 1f459, 1f45a, 1f45b, 1f45c, 1f45d, 1f6cd-fe0e, 1f392, 1f45e, 1f45f, 1f97e, 1f97f, 1f460, 1f461, 1fa70, 1f462, 1f451, 1f452, 1f3a9, 1f393, 1f9e2, 26d1-fe0e, 1f4ff, 1f484, 1f48d, 1f48e, 1f507, 1f508, 1f509, 1f50a, 1f4e2, 1f4e3, 1f4ef, 1f514, 1f515, 1f3bc, 1f3b5, 1f3b6, 1f399-fe0e, 1f39a-fe0e, 1f39b-fe0e, 1f3a4, 1f3a7, 1f4fb, 1f3b7, 1f3b8, 1f3b9, 1f3ba, 1f3bb, 1fa95, 1f941, 1f4f1, 1f4f2, 260e-fe0e, 1f4de, 1f4df, 1f4e0, 1f50b, 1f50c, 1f4bb, 1f5a5-fe0e, 1f5a8-fe0e, 2328-fe0e, 1f5b1-fe0e, 1f5b2-fe0e, 1f4bd, 1f4be, 1f4bf, 1f4c0, 1f9ee, 1f3a5, 1f39e-fe0e, 1f4fd-fe0e, 1f3ac, 1f4fa, 1f4f7, 1f4f8, 1f4f9, 1f4fc, 1f50d, 1f50e, 1f56f-fe0e, 1f4a1, 1f526, 1f3ee, 1fa94, 1f4d4, 1f4d5, 1f4d6, 1f4d7, 1f4d8, 1f4d9, 1f4da, 1f4d3, 1f4d2, 1f4c3, 1f4dc, 1f4c4, 1f4f0, 1f5de-fe0e, 1f4d1, 1f516, 1f3f7-fe0e, 1f4b0, 1f4b4, 1f4b5, 1f4b6, 1f4b7, 1f4b8, 1f4b3, 1f9fe, 1f4b9, 1f4b1, 1f4b2, 2709-fe0e, 1f4e7, 1f4e8, 1f4e9, 1f4e4, 1f4e5, 1f4e6, 1f4eb, 1f4ea, 1f4ec, 1f4ed, 1f4ee, 1f5f3-fe0e, 270f-fe0e, 2712-fe0e, 1f58b-fe0e, 1f58a-fe0e, 1f58c-fe0e, 1f58d-fe0e, 1f4dd, 1f4bc, 1f4c1, 1f4c2, 1f5c2-fe0e, 1f4c5, 1f4c6, 1f5d2-fe0e, 1f5d3-fe0e, 1f4c7, 1f4c8, 1f4c9, 1f4ca, 1f4cb, 1f4cc, 1f4cd, 1f4ce, 1f587-fe0e, 1f4cf, 1f4d0, 2702-fe0e, 1f5c3-fe0e, 1f5c4-fe0e, 1f5d1-fe0e, 1f512, 1f513, 1f50f, 1f510, 1f511, 1f5dd-fe0e, 1f528, 1fa93, 26cf-fe0e, 2692-fe0e, 1f6e0-fe0e, 1f5e1-fe0e, 2694-fe0e, 1f52b, 1f3f9, 1f6e1-fe0e, 1f527, 1f529, 2699-fe0e, 1f5dc-fe0e, 2696-fe0e, 1f9af, 1f517, 26d3-fe0e, 1f9f0, 1f9f2, 2697-fe0e, 1f9ea, 1f9eb, 1f9ec, 1f52c, 1f52d, 1f4e1, 1f489, 1fa78, 1f48a, 1fa79, 1fa7a, 1f6aa, 1f6cf-fe0e, 1f6cb-fe0e, 1fa91, 1f6bd, 1f6bf, 1f6c1, 1fa92, 1f9f4, 1f9f7, 1f9f9, 1f9fa, 1f9fb, 1f9fc, 1f9fd, 1f9ef, 1f6d2, 1f6ac, 26b0-fe0e, 26b1-fe0e, 1f5ff, 1f3e7, 1f6ae, 1f6b0, 267f, 1f6b9, 1f6ba, 1f6bb, 1f6bc, 1f6be, 1f6c2, 1f6c3, 1f6c4, 1f6c5, 26a0-fe0e, 1f6b8, 26d4, 1f6ab, 1f6b3, 1f6ad, 1f6af, 1f6b1, 1f6b7, 1f4f5, 1f51e, 2622-fe0e, 2623-fe0e, 2b06-fe0e, 2197-fe0e, 27a1-fe0e, 2198-fe0e, 2b07-fe0e, 2199-fe0e, 2b05-fe0e, 2196-fe0e, 2195-fe0e, 2194-fe0e, 21a9-fe0e, 21aa-fe0e, 2934-fe0e, 2935-fe0e, 1f503, 1f504, 1f519, 1f51a, 1f51b, 1f51c, 1f51d, 1f6d0, 269b-fe0e, 1f549-fe0e, 2721-fe0e, 2638-fe0e, 262f-fe0e, 271d-fe0e, 2626-fe0e, 262a-fe0e, 262e-fe0e, 1f54e, 1f52f, 264a, 264b, 264c, 264d, 264e, 264f, 26ce, 1f500, 1f501, 1f502, 25b6-fe0e, 23e9, 23ed-fe0e, 23ef-fe0e, 25c0-fe0e, 23ea, 23ee-fe0e, 1f53c, 23eb, 1f53d, 23ec, 23f8-fe0e, 23f9-fe0e, 23fa-fe0e, 23cf-fe0e, 1f3a6, 1f505, 1f506, 1f4f6, 1f4f3, 1f4f4, 2640-fe0e, 2642-fe0e, 2695-fe0e, 267e-fe0e, 267b-fe0e, 269c-fe0e, 1f531, 1f4db, 1f530, 2b55, 2611-fe0e, 2714-fe0e, 2716-fe0e, 274c, 274e, 27b0, 27bf, 303d-fe0e, 2733-fe0e, 2734-fe0e, 2747-fe0e, 203c-fe0e, 2049-fe0e, 3030-fe0e, a9-fe0e, ae-fe0e, 2122-fe0e, 23-20e3, 2a-20e3, 30-20e3, 31-20e3, 32-20e3, 33-20e3, 34-20e3, 35-20e3, 36-20e3, 37-20e3, 38-20e3, 39-20e3, 1f51f, 1f520, 1f521, 1f522, 1f523, 1f524, 1f170-fe0e, 1f18e, 1f171-fe0e, 1f191, 1f192, 1f193, 2139-fe0e, 1f194, 24c2-fe0e, 1f195, 1f196, 1f17e-fe0e, 1f197, 1f17f-fe0e, 1f198, 1f199, 1f19a, 1f201, 1f202-fe0e, 1f237-fe0e, 1f236, 1f22f, 1f250, 1f239, 1f21a, 1f232, 1f251, 1f238, 1f234, 1f233, 3297-fe0e, 3299-fe0e, 1f23a, 1f235, 1f534, 1f7e0, 1f7e1, 1f7e2, 1f535, 1f7e3, 1f7e4, 26ab, 26aa, 1f7e5, 1f7e7, 1f7e8, 1f7e9, 1f7e6, 1f7ea, 1f7eb, 2b1b, 2b1c, 25fc-fe0e, 25fb-fe0e, 25fe, 25fd, 25aa-fe0e, 25ab-fe0e, 1f536, 1f537, 1f538, 1f539, 1f53a, 1f53b, 1f4a0, 1f518, 1f533, 1f532, 1f3c1, 1f6a9, 1f38c, 1f3f4, 1f3f3-fe0e, 1f3f3-fe0f-200d-1f308, 1f3f4-200d-2620-fe0f, 1f1e6-1f1e8, 1f1e6-1f1e9, 1f1e6-1f1ea, 1f1e6-1f1eb, 1f1e6-1f1ec, 1f1e6-1f1ee, 1f1e6-1f1f1, 1f1e6-1f1f2, 1f1e6-1f1f4, 1f1e6-1f1f6, 1f1e6-1f1f7, 1f1e6-1f1f8, 1f1e6-1f1f9, 1f1e6-1f1fa, 1f1e6-1f1fc, 1f1e6-1f1fd, 1f1e6-1f1ff, 1f1e7-1f1e6, 1f1e7-1f1e7, 1f1e7-1f1e9, 1f1e7-1f1ea, 1f1e7-1f1eb, 1f1e7-1f1ec, 1f1e7-1f1ed, 1f1e7-1f1ee, 1f1e7-1f1ef, 1f1e7-1f1f1, 1f1e7-1f1f2, 1f1e7-1f1f3, 1f1e7-1f1f4, 1f1e7-1f1f6, 1f1e7-1f1f7, 1f1e7-1f1f8, 1f1e7-1f1f9, 1f1e7-1f1fb, 1f1e7-1f1fc, 1f1e7-1f1fe, 1f1e7-1f1ff, 1f1e8-1f1e6, 1f1e8-1f1e8, 1f1e8-1f1e9, 1f1e8-1f1eb, 1f1e8-1f1ec, 1f1e8-1f1ed, 1f1e8-1f1ee, 1f1e8-1f1f0, 1f1e8-1f1f1, 1f1e8-1f1f2, 1f1e8-1f1f3, 1f1e8-1f1f4, 1f1e8-1f1f5, 1f1e8-1f1f7, 1f1e8-1f1fa, 1f1e8-1f1fb, 1f1e8-1f1fc, 1f1e8-1f1fd, 1f1e8-1f1fe, 1f1e8-1f1ff, 1f1e9-1f1ea, 1f1e9-1f1ec, 1f1e9-1f1ef, 1f1e9-1f1f0, 1f1e9-1f1f2, 1f1e9-1f1f4, 1f1e9-1f1ff, 1f1ea-1f1e6, 1f1ea-1f1e8, 1f1ea-1f1ea, 1f1ea-1f1ec, 1f1ea-1f1ed, 1f1ea-1f1f7, 1f1ea-1f1f8, 1f1ea-1f1f9, 1f1ea-1f1fa, 1f1eb-1f1ee, 1f1eb-1f1ef, 1f1eb-1f1f0, 1f1eb-1f1f2, 1f1eb-1f1f4, 1f1eb-1f1f7, 1f1ec-1f1e6, 1f1ec-1f1e7, 1f1ec-1f1e9, 1f1ec-1f1ea, 1f1ec-1f1eb, 1f1ec-1f1ec, 1f1ec-1f1ed, 1f1ec-1f1ee, 1f1ec-1f1f1, 1f1ec-1f1f2, 1f1ec-1f1f3, 1f1ec-1f1f5, 1f1ec-1f1f6, 1f1ec-1f1f7, 1f1ec-1f1f8, 1f1ec-1f1f9, 1f1ec-1f1fa, 1f1ec-1f1fc, 1f1ec-1f1fe, 1f1ed-1f1f0, 1f1ed-1f1f2, 1f1ed-1f1f3, 1f1ed-1f1f7, 1f1ed-1f1f9, 1f1ed-1f1fa, 1f1ee-1f1e8, 1f1ee-1f1e9, 1f1ee-1f1ea, 1f1ee-1f1f1, 1f1ee-1f1f2, 1f1ee-1f1f3, 1f1ee-1f1f4, 1f1ee-1f1f6, 1f1ee-1f1f7, 1f1ee-1f1f8, 1f1ee-1f1f9, 1f1ef-1f1ea, 1f1ef-1f1f2, 1f1ef-1f1f4, 1f1ef-1f1f5, 1f1f0-1f1ea, 1f1f0-1f1ec, 1f1f0-1f1ed, 1f1f0-1f1ee, 1f1f0-1f1f2, 1f1f0-1f1f3, 1f1f0-1f1f5, 1f1f0-1f1f7, 1f1f0-1f1fc, 1f1f0-1f1fe, 1f1f0-1f1ff, 1f1f1-1f1e6, 1f1f1-1f1e7, 1f1f1-1f1e8, 1f1f1-1f1ee, 1f1f1-1f1f0, 1f1f1-1f1f7, 1f1f1-1f1f8, 1f1f1-1f1f9, 1f1f1-1f1fa, 1f1f1-1f1fb, 1f1f1-1f1fe, 1f1f2-1f1e6, 1f1f2-1f1e8, 1f1f2-1f1e9, 1f1f2-1f1ea, 1f1f2-1f1eb, 1f1f2-1f1ec, 1f1f2-1f1ed, 1f1f2-1f1f0, 1f1f2-1f1f1, 1f1f2-1f1f2, 1f1f2-1f1f3, 1f1f2-1f1f4, 1f1f2-1f1f5, 1f1f2-1f1f6, 1f1f2-1f1f7, 1f1f2-1f1f8, 1f1f2-1f1f9, 1f1f2-1f1fa, 1f1f2-1f1fb, 1f1f2-1f1fc, 1f1f2-1f1fd, 1f1f2-1f1fe, 1f1f2-1f1ff, 1f1f3-1f1e6, 1f1f3-1f1e8, 1f1f3-1f1ea, 1f1f3-1f1eb, 1f1f3-1f1ec, 1f1f3-1f1ee, 1f1f3-1f1f1, 1f1f3-1f1f4, 1f1f3-1f1f5, 1f1f3-1f1f7, 1f1f3-1f1fa, 1f1f3-1f1ff, 1f1f4-1f1f2, 1f1f5-1f1e6, 1f1f5-1f1ea, 1f1f5-1f1eb, 1f1f5-1f1ec, 1f1f5-1f1ed, 1f1f5-1f1f0, 1f1f5-1f1f1, 1f1f5-1f1f2, 1f1f5-1f1f3, 1f1f5-1f1f7, 1f1f5-1f1f8, 1f1f5-1f1f9, 1f1f5-1f1fc, 1f1f5-1f1fe, 1f1f6-1f1e6, 1f1f7-1f1ea, 1f1f7-1f1f4, 1f1f7-1f1f8, 1f1f7-1f1fa, 1f1f7-1f1fc, 1f1f8-1f1e6, 1f1f8-1f1e7, 1f1f8-1f1e8, 1f1f8-1f1e9, 1f1f8-1f1ea, 1f1f8-1f1ec, 1f1f8-1f1ed, 1f1f8-1f1ee, 1f1f8-1f1ef, 1f1f8-1f1f0, 1f1f8-1f1f1, 1f1f8-1f1f2, 1f1f8-1f1f3, 1f1f8-1f1f4, 1f1f8-1f1f7, 1f1f8-1f1f8, 1f1f8-1f1f9, 1f1f8-1f1fb, 1f1f8-1f1fd, 1f1f8-1f1fe, 1f1f8-1f1ff, 1f1f9-1f1e6, 1f1f9-1f1e8, 1f1f9-1f1e9, 1f1f9-1f1eb, 1f1f9-1f1ec, 1f1f9-1f1ed, 1f1f9-1f1ef, 1f1f9-1f1f0, 1f1f9-1f1f1, 1f1f9-1f1f2, 1f1f9-1f1f3, 1f1f9-1f1f4, 1f1f9-1f1f7, 1f1f9-1f1f9, 1f1f9-1f1fb, 1f1f9-1f1fc, 1f1f9-1f1ff, 1f1fa-1f1e6, 1f1fa-1f1ec, 1f1fa-1f1f2, 1f1fa-1f1f3, 1f1fa-1f1f8, 1f1fa-1f1fe, 1f1fa-1f1ff, 1f1fb-1f1e6, 1f1fb-1f1e8, 1f1fb-1f1ea, 1f1fb-1f1ec, 1f1fb-1f1ee, 1f1fb-1f1f3, 1f1fb-1f1fa, 1f1fc-1f1eb, 1f1fc-1f1f8, 1f1fd-1f1f0, 1f1fe-1f1ea, 1f1fe-1f1f9, 1f1ff-1f1e6, 1f1ff-1f1f2, 1f1ff-1f1fc, 1f3f4-e0067-e0062-e0065-e006e-e0067-e007f, 1f3f4-e0067-e0062-e0073-e0063-e0074-e007f, 1f3f4-e0067-e0062-e0077-e006c-e0073-e007f, default */
/***/ (function(module) {

module.exports = JSON.parse("{\"2614\":[\"umbrella_rain\"],\"2615\":[\"coffee\"],\"2648\":[\"aries\"],\"2649\":[\"taurus\"],\"2650\":[\"sagittarius\"],\"2651\":[\"capricorn\"],\"2652\":[\"aquarius\"],\"2653\":[\"pisces\"],\"2693\":[\"anchor\"],\"2705\":[\"white_check_mark\"],\"2728\":[\"sparkles\"],\"2753\":[\"question\"],\"2754\":[\"white_question\"],\"2755\":[\"white_exclamation\"],\"2757\":[\"exclamation\"],\"2795\":[\"plus\"],\"2796\":[\"minus\"],\"2797\":[\"division\"],\"1f600\":[\"gleeful\"],\"1f603\":[\"glad\",\"smile\"],\"1f604\":[\"happy\"],\"1f601\":[\"blissful\",\"grin\"],\"1f606\":[\"amused\",\"laugh\",\"lol\"],\"1f605\":[\"embarassed\",\"sweat_smile\"],\"1f923\":[\"entertained\",\"rofl\"],\"1f602\":[\"joyful\",\"haha\"],\"1f642\":[\"pleased\",\"slight_smile\"],\"1f643\":[\"ecstatic\",\"upside_down\"],\"1f609\":[\"coy\",\"wink\"],\"1f60a\":[\"blush\"],\"1f607\":[\"innocent\",\"halo\"],\"1f970\":[\"love\"],\"1f60d\":[\"lovestruck\"],\"1f929\":[\"starstruck\"],\"1f618\":[\"flirty\"],\"1f617\":[\"kiss\"],\"263a-fe0e\":[\"relaxed\"],\"1f61a\":[\"loving_kiss\"],\"1f619\":[\"happy_kiss\"],\"1f60b\":[\"yum\",\"savour\"],\"1f61b\":[\"playful\",\"tongue_out\"],\"1f61c\":[\"mischievous\"],\"1f92a\":[\"crazy\"],\"1f61d\":[\"facetious\",\"lmao\"],\"1f911\":[\"pretentious\",\"money_mouth\"],\"1f917\":[\"hugging\"],\"1f92d\":[\"gasp\"],\"1f92b\":[\"shushing\"],\"1f914\":[\"curious\",\"thinking\"],\"1f910\":[\"silenced\",\"zipper_mouth\"],\"1f928\":[\"contempt\"],\"1f610\":[\"indifferent\",\"neutral\"],\"1f611\":[\"apathetic\",\"expressionless\"],\"1f636\":[\"vacant\",\"no_mouth\"],\"1f60f\":[\"cocky\",\"smirk\"],\"1f612\":[\"unamused\"],\"1f644\":[\"disbelief\"],\"1f62c\":[\"grimaced\"],\"1f925\":[\"lying\"],\"1f60c\":[\"relieved\"],\"1f614\":[\"pensive\"],\"1f62a\":[\"sleepy\"],\"1f924\":[\"drooling\"],\"1f634\":[\"exhausted\",\"sleeping\"],\"1f637\":[\"ill\",\"mask\"],\"1f912\":[\"sick\"],\"1f915\":[\"injured\"],\"1f922\":[\"nauseated\"],\"1f92e\":[\"vomiting\"],\"1f927\":[\"sneezing\"],\"1f975\":[\"overheating\"],\"1f976\":[\"freezing\"],\"1f974\":[\"woozy\"],\"1f635\":[\"dizzy\"],\"1f92f\":[\"shocked\",\"exploding_head\"],\"1f920\":[\"cowboy\"],\"1f973\":[\"partying\",\"celebrating\"],\"1f60e\":[\"confident\"],\"1f913\":[\"nerd\"],\"1f9d0\":[\"monocle\"],\"1f615\":[\"confused\"],\"1f61f\":[\"worried\"],\"1f641\":[\"cheerless\",\"slight_frown\"],\"2639-fe0e\":[\"sad\",\"frowning\"],\"1f62e\":[\"surprised\"],\"1f62f\":[\"hushed\"],\"1f632\":[\"astonished\"],\"1f633\":[\"flushed\"],\"1f97a\":[\"pleading\"],\"1f626\":[\"bored\"],\"1f627\":[\"anguished\",\"wtf\"],\"1f628\":[\"fearful\"],\"1f630\":[\"cold_sweat\",\"anxious\",\"frustrated\"],\"1f625\":[\"hopeful\"],\"1f622\":[\"upset\",\"cry\"],\"1f62d\":[\"distressed\",\"sob\"],\"1f631\":[\"frightened\",\"scream\"],\"1f616\":[\"confounded\"],\"1f623\":[\"persevered\"],\"1f61e\":[\"disappointed\"],\"1f613\":[\"shamed\"],\"1f629\":[\"weary\"],\"1f62b\":[\"tired\"],\"1f971\":[\"yawn\"],\"1f624\":[\"annoyed\",\"hrmph\"],\"1f621\":[\"enraged\",\"pout\"],\"1f620\":[\"angry\"],\"1f92c\":[\"censored\"],\"1f608\":[\"imp\"],\"1f47f\":[\"angry_imp\"],\"1f480\":[\"skull\"],\"2620-fe0e\":[\"crossbones\"],\"1f4a9\":[\"poop\"],\"1f921\":[\"clown\"],\"1f479\":[\"ogre\"],\"1f47a\":[\"goblin\"],\"1f47b\":[\"ghost\"],\"1f47d\":[\"alien\"],\"1f47e\":[\"alien_monster\",\"space_invader\"],\"1f916\":[\"robot\"],\"1f63a\":[\"smiling_cat\"],\"1f638\":[\"grinning_cat\"],\"1f639\":[\"joyful_cat\"],\"1f63b\":[\"lovestruck_cat\"],\"1f63c\":[\"smirking_cat\"],\"1f63d\":[\"kissing_cat\"],\"1f640\":[\"weary_cat\"],\"1f63f\":[\"crying_cat\"],\"1f63e\":[\"pouting_cat\"],\"1f648\":[\"see_no_evil\"],\"1f649\":[\"hear_no_evil\"],\"1f64a\":[\"speak_no_evil\"],\"1f48b\":[\"kiss_lips\"],\"1f48c\":[\"love_letter\"],\"1f498\":[\"cupid\"],\"1f49d\":[\"heart_ribbon\"],\"1f496\":[\"sparkling_heart\"],\"1f497\":[\"heartpulse\"],\"1f493\":[\"heartbeat\"],\"1f49e\":[\"revolving_hearts\"],\"1f495\":[\"two_hearts\"],\"1f49f\":[\"heart_decoration\"],\"2763-fe0e\":[\"heart_exclamation\"],\"1f494\":[\"broken_heart\"],\"2764-fe0e\":[\"heart\"],\"1f9e1\":[\"orange_heart\"],\"1f49b\":[\"yellow_heart\"],\"1f49a\":[\"green_heart\"],\"1f499\":[\"blue_heart\"],\"1f49c\":[\"purple_heart\"],\"1f90e\":[\"brown_heart\"],\"1f5a4\":[\"black_heart\"],\"1f90d\":[\"white_heart\"],\"1f4af\":[\"100\"],\"1f4a2\":[\"anger\"],\"1f4a5\":[\"boom\",\"collision\"],\"1f4ab\":[\"dizzy_star\"],\"1f4a6\":[\"sweat_drops\"],\"1f4a8\":[\"dash\"],\"1f573-fe0e\":[\"hole\"],\"1f4a3\":[\"bomb\"],\"1f4ac\":[\"speech\"],\"1f441-200d-1f5e8\":[\"eye_bubble\"],\"1f5e8-fe0e\":[\"left_speech\"],\"1f5ef-fe0e\":[\"right_anger_speech\"],\"1f4ad\":[\"thought\"],\"1f4a4\":[\"zzz\"],\"1f44b\":[\"wave\"],\"1f91a\":[\"raised_backhand\"],\"1f590-fe0e\":[\"splayed_hand\"],\"270b\":[\"raised_hand\"],\"1f596\":[\"vulcan\"],\"1f44c\":[\"ok_hand\"],\"1f90f\":[\"pinch\"],\"270c-fe0e\":[\"victory\"],\"1f91e\":[\"fingers_crossed\"],\"1f91f\":[\"love_you_gesture\"],\"1f918\":[\"metal\"],\"1f919\":[\"call_me\"],\"1f448\":[\"point_left\"],\"1f449\":[\"point_right\"],\"1f446\":[\"backhand_point_up\"],\"1f595\":[\"middle_finger\"],\"1f447\":[\"point_down\"],\"261d-fe0e\":[\"point_up\"],\"1f44d\":[\"thumbsup\",\"+1\",\"yes\"],\"1f44e\":[\"thumbsdown\",\"-1\",\"no\"],\"270a\":[\"fist\"],\"1f44a\":[\"punch\"],\"1f91b\":[\"left_facing_fist\"],\"1f91c\":[\"right_facing_fist\"],\"1f44f\":[\"clap\"],\"1f64c\":[\"raised_hands\"],\"1f450\":[\"open_hands\"],\"1f932\":[\"palms_up\"],\"1f91d\":[\"handshake\"],\"1f64f\":[\"pray\"],\"270d-fe0e\":[\"writing_hand\"],\"1f485\":[\"nail_care\"],\"1f933\":[\"selfie\"],\"1f4aa\":[\"muscle\",\"right_bicep\"],\"1f9be\":[\"mech_arm\"],\"1f9bf\":[\"mech_leg\"],\"1f9b5\":[\"leg\"],\"1f9b6\":[\"foot\"],\"1f442\":[\"ear\"],\"1f9bb\":[\"hearing_aid\"],\"1f443\":[\"nose\"],\"1f9e0\":[\"brain\"],\"1f9b7\":[\"tooth\"],\"1f9b4\":[\"bone\"],\"1f440\":[\"eyes\"],\"1f441-fe0e\":[\"eye\"],\"1f445\":[\"tongue\"],\"1f444\":[\"lips\"],\"1f476\":[\"baby\"],\"1f9d2\":[\"child\"],\"1f466\":[\"boy\"],\"1f467\":[\"girl\"],\"1f9d1\":[\"adult\"],\"1f471\":[\"blond_person\"],\"1f468\":[\"man\"],\"1f9d4\":[\"bearded_person\"],\"1f468-200d-1f9b0\":[\"red_haired_man\"],\"1f468-200d-1f9b1\":[\"curly_haired_man\"],\"1f468-200d-1f9b3\":[\"white_haired_man\"],\"1f468-200d-1f9b2\":[\"bald_man\"],\"1f469\":[\"woman\"],\"1f469-200d-1f9b0\":[\"red_haired_woman\"],\"1f9d1-200d-1f9b0\":[\"red_haired_person\"],\"1f469-200d-1f9b1\":[\"curly_haired_woman\"],\"1f9d1-200d-1f9b1\":[\"curly_haired_person\"],\"1f469-200d-1f9b3\":[\"white_haired_woman\"],\"1f9d1-200d-1f9b3\":[\"white_haired_person\"],\"1f469-200d-1f9b2\":[\"bald_woman\"],\"1f9d1-200d-1f9b2\":[\"bald_person\"],\"1f471-200d-2640-fe0f\":[\"blond_woman\"],\"1f471-200d-2642-fe0f\":[\"blond_man\"],\"1f9d3\":[\"older_adult\"],\"1f474\":[\"older_man\"],\"1f475\":[\"older_woman\"],\"1f64d\":[\"person_frowning\"],\"1f64d-200d-2642-fe0f\":[\"man_frowning\"],\"1f64d-200d-2640-fe0f\":[\"woman_frowning\"],\"1f64e\":[\"person_pouting\"],\"1f64e-200d-2642-fe0f\":[\"man_pouting\"],\"1f64e-200d-2640-fe0f\":[\"woman_pouting\"],\"1f645\":[\"person_gesturing_no\"],\"1f645-200d-2642-fe0f\":[\"man_gesturing_no\"],\"1f645-200d-2640-fe0f\":[\"woman_gesturing_no\"],\"1f646\":[\"person_gesturing_ok\"],\"1f646-200d-2642-fe0f\":[\"man_gesturing_ok\"],\"1f646-200d-2640-fe0f\":[\"woman_gesturing_ok\"],\"1f481\":[\"person_tipping_hand\"],\"1f481-200d-2642-fe0f\":[\"man_tipping_hand\"],\"1f481-200d-2640-fe0f\":[\"woman_tipping_hand\"],\"1f64b\":[\"person_raising_hand\"],\"1f64b-200d-2642-fe0f\":[\"man_raising_hand\"],\"1f64b-200d-2640-fe0f\":[\"woman_raising_hand\"],\"1f9cf\":[\"person_deaf\"],\"1f9cf-200d-2642-fe0f\":[\"man_deaf\"],\"1f9cf-200d-2640-fe0f\":[\"woman_deaf\"],\"1f647\":[\"person_bowing\"],\"1f647-200d-2642-fe0f\":[\"man_bowing\"],\"1f647-200d-2640-fe0f\":[\"woman_bowing\"],\"1f926\":[\"person_facepalming\"],\"1f926-200d-2642-fe0f\":[\"man_facepalming\"],\"1f926-200d-2640-fe0f\":[\"woman_facepalming\"],\"1f937\":[\"person_shrugging\"],\"1f937-200d-2642-fe0f\":[\"man_shrugging\"],\"1f937-200d-2640-fe0f\":[\"woman_shrugging\"],\"1f9d1-200d-2695-fe0f\":[\"person_health_worker\"],\"1f468-200d-2695-fe0f\":[\"man_health_worker\"],\"1f469-200d-2695-fe0f\":[\"woman_health_worker\"],\"1f9d1-200d-1f393\":[\"person_student\"],\"1f468-200d-1f393\":[\"man_student\"],\"1f469-200d-1f393\":[\"woman_student\"],\"1f9d1-200d-1f3eb\":[\"person_teacher\"],\"1f468-200d-1f3eb\":[\"man_teacher\"],\"1f469-200d-1f3eb\":[\"woman_teacher\"],\"1f9d1-200d-2696-fe0f\":[\"person_judge\"],\"1f468-200d-2696-fe0f\":[\"man_judge\"],\"1f469-200d-2696-fe0f\":[\"woman_judge\"],\"1f9d1-200d-1f33e\":[\"person_farmer\"],\"1f468-200d-1f33e\":[\"man_farmer\"],\"1f469-200d-1f33e\":[\"woman_farmer\"],\"1f9d1-200d-1f373\":[\"person_cook\"],\"1f468-200d-1f373\":[\"man_cook\"],\"1f469-200d-1f373\":[\"woman_cook\"],\"1f9d1-200d-1f527\":[\"person_mechanic\"],\"1f468-200d-1f527\":[\"man_mechanic\"],\"1f469-200d-1f527\":[\"woman_mechanic\"],\"1f9d1-200d-1f3ed\":[\"person_factory_worker\"],\"1f468-200d-1f3ed\":[\"man_factory_worker\"],\"1f469-200d-1f3ed\":[\"woman_factory_worker\"],\"1f9d1-200d-1f4bc\":[\"person_office_worker\"],\"1f468-200d-1f4bc\":[\"man_office_worker\"],\"1f469-200d-1f4bc\":[\"woman_office_worker\"],\"1f9d1-200d-1f52c\":[\"person_scientist\"],\"1f468-200d-1f52c\":[\"man_scientist\"],\"1f469-200d-1f52c\":[\"woman_scientist\"],\"1f9d1-200d-1f4bb\":[\"person_technologist\"],\"1f468-200d-1f4bb\":[\"man_technologist\"],\"1f469-200d-1f4bb\":[\"woman_technologist\"],\"1f9d1-200d-1f3a4\":[\"person_singer\"],\"1f468-200d-1f3a4\":[\"man_singer\"],\"1f469-200d-1f3a4\":[\"woman_singer\"],\"1f9d1-200d-1f3a8\":[\"person_artist\"],\"1f468-200d-1f3a8\":[\"man_artist\"],\"1f469-200d-1f3a8\":[\"woman_artist\"],\"1f9d1-200d-2708-fe0f\":[\"person_pilot\"],\"1f468-200d-2708-fe0f\":[\"man_pilot\"],\"1f469-200d-2708-fe0f\":[\"woman_pilot\"],\"1f9d1-200d-1f680\":[\"person_astronaut\"],\"1f468-200d-1f680\":[\"man_astronaut\"],\"1f469-200d-1f680\":[\"woman_astronaut\"],\"1f9d1-200d-1f692\":[\"person_firefighter\"],\"1f468-200d-1f692\":[\"man_firefighter\"],\"1f469-200d-1f692\":[\"woman_firefighter\"],\"1f46e\":[\"police_officer\"],\"1f46e-200d-2642-fe0f\":[\"man_police_officer\"],\"1f46e-200d-2640-fe0f\":[\"woman_police_officer\"],\"1f575-fe0e\":[\"detective\"],\"1f575-fe0f-200d-2642-fe0f\":[\"man_detective\"],\"1f575-fe0f-200d-2640-fe0f\":[\"woman_detective\"],\"1f482\":[\"guard\"],\"1f482-200d-2642-fe0f\":[\"man_guard\"],\"1f482-200d-2640-fe0f\":[\"woman_guard\"],\"1f477\":[\"construction_worker\"],\"1f477-200d-2642-fe0f\":[\"man_construction_worker\"],\"1f477-200d-2640-fe0f\":[\"woman_construction_worker\"],\"1f934\":[\"prince\"],\"1f478\":[\"princess\"],\"1f473\":[\"person_turban\"],\"1f473-200d-2642-fe0f\":[\"man_turban\"],\"1f473-200d-2640-fe0f\":[\"woman_turban\"],\"1f472\":[\"man_chinese_cap\"],\"1f9d5\":[\"woman_headscarf\"],\"1f935\":[\"man_tuxedo\"],\"1f470\":[\"bride_veil\"],\"1f930\":[\"pregnant_woman\"],\"1f931\":[\"breast_feeding\"],\"1f47c\":[\"baby_angel\"],\"1f385\":[\"santa\"],\"1f936\":[\"mrs_claus\"],\"1f9b8\":[\"hero\",\"superhero\"],\"1f9b8-200d-2642-fe0f\":[\"man_hero\"],\"1f9b8-200d-2640-fe0f\":[\"woman_hero\"],\"1f9b9\":[\"villain\",\"supervillain\"],\"1f9b9-200d-2642-fe0f\":[\"man_villain\"],\"1f9b9-200d-2640-fe0f\":[\"woman_villain\"],\"1f9d9\":[\"mage\"],\"1f9d9-200d-2642-fe0f\":[\"man_mage\"],\"1f9d9-200d-2640-fe0f\":[\"woman_mage\"],\"1f9da\":[\"fairy\"],\"1f9da-200d-2642-fe0f\":[\"man_fairy\"],\"1f9da-200d-2640-fe0f\":[\"woman_fairy\"],\"1f9db\":[\"vampire\"],\"1f9db-200d-2642-fe0f\":[\"man_vampire\"],\"1f9db-200d-2640-fe0f\":[\"woman_vampire\"],\"1f9dc\":[\"merperson\"],\"1f9dc-200d-2642-fe0f\":[\"merman\"],\"1f9dc-200d-2640-fe0f\":[\"mermaid\"],\"1f9dd\":[\"elf\"],\"1f9dd-200d-2642-fe0f\":[\"man_elf\"],\"1f9dd-200d-2640-fe0f\":[\"woman_elf\"],\"1f9de\":[\"genie\"],\"1f9de-200d-2642-fe0f\":[\"man_genie\"],\"1f9de-200d-2640-fe0f\":[\"woman_genie\"],\"1f9df\":[\"zombie\"],\"1f9df-200d-2642-fe0f\":[\"man_zombie\"],\"1f9df-200d-2640-fe0f\":[\"woman_zombie\"],\"1f486\":[\"person_getting_massage\"],\"1f486-200d-2642-fe0f\":[\"man_getting_face_massage\"],\"1f486-200d-2640-fe0f\":[\"woman_getting_face_massage\"],\"1f487\":[\"person_getting_haircut\"],\"1f487-200d-2642-fe0f\":[\"man_getting_haircut\"],\"1f487-200d-2640-fe0f\":[\"woman_getting_haircut\"],\"1f6b6\":[\"person_walking\"],\"1f6b6-200d-2642-fe0f\":[\"man_walking\"],\"1f6b6-200d-2640-fe0f\":[\"woman_walking\"],\"1f9cd\":[\"person_standing\"],\"1f9cd-200d-2642-fe0f\":[\"man_standing\"],\"1f9cd-200d-2640-fe0f\":[\"woman_standing\"],\"1f9ce\":[\"person_kneeling\"],\"1f9ce-200d-2642-fe0f\":[\"man_kneeling\"],\"1f9ce-200d-2640-fe0f\":[\"woman_kneeling\"],\"1f9d1-200d-1f9af\":[\"person_probing_cane\"],\"1f468-200d-1f9af\":[\"man_probing_cane\"],\"1f469-200d-1f9af\":[\"woman_probing_cane\"],\"1f9d1-200d-1f9bc\":[\"person_motor_wheelchair\"],\"1f468-200d-1f9bc\":[\"man_motor_wheelchair\"],\"1f469-200d-1f9bc\":[\"woman_motor_wheelchair\"],\"1f9d1-200d-1f9bd\":[\"person_wheelchair\"],\"1f468-200d-1f9bd\":[\"man_wheelchair\"],\"1f469-200d-1f9bd\":[\"woman_wheelchair\"],\"1f3c3\":[\"person_running\"],\"1f3c3-200d-2642-fe0f\":[\"man_running\"],\"1f3c3-200d-2640-fe0f\":[\"woman_running\"],\"1f483\":[\"dancer\",\"woman_dancing\"],\"1f57a\":[\"man_dancing\"],\"1f574-fe0e\":[\"levitate\"],\"1f46f\":[\"people_bunny_ears_partying\"],\"1f46f-200d-2642-fe0f\":[\"men_bunny_ears_partying\"],\"1f46f-200d-2640-fe0f\":[\"women_bunny_ears_partying\"],\"1f9d6\":[\"person_steamy_room\"],\"1f9d6-200d-2642-fe0f\":[\"man_steamy_room\"],\"1f9d6-200d-2640-fe0f\":[\"woman_steamy_room\"],\"1f9d7\":[\"person_climbing\"],\"1f9d7-200d-2642-fe0f\":[\"man_climbing\"],\"1f9d7-200d-2640-fe0f\":[\"woman_climbing\"],\"1f93a\":[\"person_fencing\"],\"1f3c7\":[\"horse_racing\"],\"26f7-fe0e\":[\"skier\"],\"1f3c2\":[\"snowboarder\"],\"1f3cc-fe0e\":[\"person_golfing\"],\"1f3cc-fe0f-200d-2642-fe0f\":[\"man_golfing\"],\"1f3cc-fe0f-200d-2640-fe0f\":[\"woman_golfing\"],\"1f3c4\":[\"person_surfing\"],\"1f3c4-200d-2642-fe0f\":[\"man_surfing\"],\"1f3c4-200d-2640-fe0f\":[\"woman_surfing\"],\"1f6a3\":[\"person_rowing_boat\"],\"1f6a3-200d-2642-fe0f\":[\"man_rowing_boat\"],\"1f6a3-200d-2640-fe0f\":[\"woman_rowing_boat\"],\"1f3ca\":[\"person_swimming\"],\"1f3ca-200d-2642-fe0f\":[\"man_swimming\"],\"1f3ca-200d-2640-fe0f\":[\"woman_swimming\"],\"26f9-fe0e\":[\"person_bouncing_ball\"],\"26f9-fe0f-200d-2642-fe0f\":[\"man_bouncing_ball\"],\"26f9-fe0f-200d-2640-fe0f\":[\"woman_bouncing_ball\"],\"1f3cb-fe0e\":[\"person_lifting_weights\"],\"1f3cb-fe0f-200d-2642-fe0f\":[\"man_lifting_weights\"],\"1f3cb-fe0f-200d-2640-fe0f\":[\"woman_lifting_weights\"],\"1f6b4\":[\"person_biking\"],\"1f6b4-200d-2642-fe0f\":[\"man_biking\"],\"1f6b4-200d-2640-fe0f\":[\"woman_biking\"],\"1f6b5\":[\"person_mountain_biking\"],\"1f6b5-200d-2642-fe0f\":[\"man_mountain_biking\"],\"1f6b5-200d-2640-fe0f\":[\"woman_mountain_biking\"],\"1f938\":[\"person_cartwheel\"],\"1f938-200d-2642-fe0f\":[\"man_cartwheeling\"],\"1f938-200d-2640-fe0f\":[\"woman_cartwheeling\"],\"1f93c\":[\"people_wrestling\"],\"1f93c-200d-2642-fe0f\":[\"men_wrestling\"],\"1f93c-200d-2640-fe0f\":[\"women_wrestling\"],\"1f93d\":[\"person_water_polo\"],\"1f93d-200d-2642-fe0f\":[\"man_water_polo\"],\"1f93d-200d-2640-fe0f\":[\"woman_water_polo\"],\"1f93e\":[\"person_handball\"],\"1f93e-200d-2642-fe0f\":[\"man_handball\"],\"1f93e-200d-2640-fe0f\":[\"woman_handball\"],\"1f939\":[\"person_juggling\"],\"1f939-200d-2642-fe0f\":[\"man_juggling\"],\"1f939-200d-2640-fe0f\":[\"woman_juggling\"],\"1f9d8\":[\"person_lotus_position\"],\"1f9d8-200d-2642-fe0f\":[\"man_lotus_position\"],\"1f9d8-200d-2640-fe0f\":[\"woman_lotus_position\"],\"1f6c0\":[\"bath\"],\"1f6cc\":[\"in_bed\"],\"1f9d1-200d-1f91d-200d-1f9d1\":[\"holding_hands_people\"],\"1f46d\":[\"holding_hands_ww\"],\"1f46b\":[\"holding_hands_mw\",\"holding_hands_wm\"],\"1f46c\":[\"holding_hands_mm\"],\"1f48f\":[\"couple\"],\"1f469-200d-2764-fe0f-200d-1f48b-200d-1f468\":[\"kiss_mw\",\"kiss_wm\"],\"1f468-200d-2764-fe0f-200d-1f48b-200d-1f468\":[\"kiss_mm\"],\"1f469-200d-2764-fe0f-200d-1f48b-200d-1f469\":[\"kiss_ww\"],\"1f491\":[\"couple_heart\"],\"1f469-200d-2764-fe0f-200d-1f468\":[\"couple_mw\",\"couple_wm\"],\"1f468-200d-2764-fe0f-200d-1f468\":[\"couple_mm\"],\"1f469-200d-2764-fe0f-200d-1f469\":[\"couple_ww\"],\"1f46a\":[\"family\"],\"1f468-200d-1f469-200d-1f466\":[\"family_mwb\"],\"1f468-200d-1f469-200d-1f467\":[\"family_mwg\"],\"1f468-200d-1f469-200d-1f467-200d-1f466\":[\"family_mwgb\"],\"1f468-200d-1f469-200d-1f466-200d-1f466\":[\"family_mwbb\"],\"1f468-200d-1f469-200d-1f467-200d-1f467\":[\"family_mwgg\"],\"1f468-200d-1f468-200d-1f466\":[\"family_mmb\"],\"1f468-200d-1f468-200d-1f467\":[\"family_mmg\"],\"1f468-200d-1f468-200d-1f467-200d-1f466\":[\"family_mmgb\"],\"1f468-200d-1f468-200d-1f466-200d-1f466\":[\"family_mmbb\"],\"1f468-200d-1f468-200d-1f467-200d-1f467\":[\"family_mmgg\"],\"1f469-200d-1f469-200d-1f466\":[\"family_wwb\"],\"1f469-200d-1f469-200d-1f467\":[\"family_wwg\"],\"1f469-200d-1f469-200d-1f467-200d-1f466\":[\"family_wwgb\"],\"1f469-200d-1f469-200d-1f466-200d-1f466\":[\"family_wwbb\"],\"1f469-200d-1f469-200d-1f467-200d-1f467\":[\"family_wwgg\"],\"1f468-200d-1f466\":[\"family_mb\"],\"1f468-200d-1f466-200d-1f466\":[\"family_mbb\"],\"1f468-200d-1f467\":[\"family_mg\"],\"1f468-200d-1f467-200d-1f466\":[\"family_mgb\"],\"1f468-200d-1f467-200d-1f467\":[\"family_mgg\"],\"1f469-200d-1f466\":[\"family_wb\"],\"1f469-200d-1f466-200d-1f466\":[\"family_wbb\"],\"1f469-200d-1f467\":[\"family_wg\"],\"1f469-200d-1f467-200d-1f466\":[\"family_wgb\"],\"1f469-200d-1f467-200d-1f467\":[\"family_wgg\"],\"1f5e3-fe0e\":[\"speaking_head\"],\"1f464\":[\"bust_silhouette\"],\"1f465\":[\"busts_silhouette\"],\"1f463\":[\"footprints\"],\"1f3fb\":[\"tone_light\",\"tone1\"],\"1f3fc\":[\"tone_medium_light\",\"tone2\"],\"1f3fd\":[\"tone_medium\",\"tone3\"],\"1f3fe\":[\"tone_medium_dark\",\"tone4\"],\"1f3ff\":[\"tone_dark\",\"tone5\"],\"1f9b0\":[\"red_hair\"],\"1f9b1\":[\"curly_hair\"],\"1f9b3\":[\"white_hair\"],\"1f9b2\":[\"bald\"],\"1f435\":[\"monkey_face\"],\"1f412\":[\"monkey\"],\"1f98d\":[\"gorilla\"],\"1f9a7\":[\"orangutan\"],\"1f436\":[\"dog_face\"],\"1f415\":[\"dog\"],\"1f9ae\":[\"guide_dog\"],\"1f415-200d-1f9ba\":[\"service_dog\"],\"1f429\":[\"poodle\"],\"1f43a\":[\"wolf_face\"],\"1f98a\":[\"fox_face\"],\"1f99d\":[\"raccoon\"],\"1f431\":[\"cat_face\"],\"1f408\":[\"cat\"],\"1f981\":[\"lion_face\"],\"1f42f\":[\"tiger_face\"],\"1f405\":[\"tiger\"],\"1f406\":[\"leopard\"],\"1f434\":[\"horse_face\"],\"1f40e\":[\"horse\"],\"1f984\":[\"unicorn_face\"],\"1f993\":[\"zebra\"],\"1f98c\":[\"deer\"],\"1f42e\":[\"cow_face\"],\"1f402\":[\"ox\"],\"1f403\":[\"water_buffalo\"],\"1f404\":[\"cow\"],\"1f437\":[\"pig_face\"],\"1f416\":[\"pig\"],\"1f417\":[\"boar\"],\"1f43d\":[\"pig_nose\"],\"1f40f\":[\"ram\"],\"1f411\":[\"sheep\"],\"1f410\":[\"goat\"],\"1f42a\":[\"camel\"],\"1f42b\":[\"two_hump_camel\"],\"1f999\":[\"llama\"],\"1f992\":[\"giraffe\"],\"1f418\":[\"elephant\"],\"1f98f\":[\"rhino\"],\"1f99b\":[\"hippo\"],\"1f42d\":[\"mouse_face\"],\"1f401\":[\"mouse\"],\"1f400\":[\"rat\"],\"1f439\":[\"hamster_face\"],\"1f430\":[\"rabbit_face\"],\"1f407\":[\"rabbit\"],\"1f43f-fe0e\":[\"chipmunk\"],\"1f994\":[\"hedgehog\"],\"1f987\":[\"bat\"],\"1f43b\":[\"bear_face\"],\"1f428\":[\"koala_face\"],\"1f43c\":[\"panda_face\"],\"1f9a5\":[\"sloth\"],\"1f9a6\":[\"otter\"],\"1f9a8\":[\"skunk\"],\"1f998\":[\"kangaroo\"],\"1f9a1\":[\"badger\"],\"1f43e\":[\"feet\"],\"1f983\":[\"turkey\"],\"1f414\":[\"chicken\"],\"1f413\":[\"rooster\"],\"1f423\":[\"hatching_chick\"],\"1f424\":[\"baby_chick\"],\"1f425\":[\"hatched_chick\"],\"1f426\":[\"bird\"],\"1f427\":[\"penguin\"],\"1f54a-fe0e\":[\"dove\"],\"1f985\":[\"eagle\"],\"1f986\":[\"duck\"],\"1f9a2\":[\"swan\"],\"1f989\":[\"owl\"],\"1f9a9\":[\"flamingo\"],\"1f99a\":[\"peacock\"],\"1f99c\":[\"parrot\"],\"1f438\":[\"frog_face\"],\"1f40a\":[\"crocodile\"],\"1f422\":[\"turtle\"],\"1f98e\":[\"lizard\"],\"1f40d\":[\"snake\"],\"1f432\":[\"dragon_face\"],\"1f409\":[\"dragon\"],\"1f995\":[\"sauropod\"],\"1f996\":[\"trex\"],\"1f433\":[\"spouting_whale\"],\"1f40b\":[\"whale\"],\"1f42c\":[\"dolphin\"],\"1f41f\":[\"fish\"],\"1f420\":[\"tropical_fish\"],\"1f421\":[\"blowfish\"],\"1f988\":[\"shark\"],\"1f419\":[\"octopus\"],\"1f41a\":[\"shell\"],\"1f40c\":[\"snail\"],\"1f98b\":[\"butterfly\"],\"1f41b\":[\"bug\"],\"1f41c\":[\"ant\"],\"1f41d\":[\"bee\"],\"1f41e\":[\"beetle\"],\"1f997\":[\"cricket\"],\"1f577-fe0e\":[\"spider\"],\"1f578-fe0e\":[\"spider_web\"],\"1f982\":[\"scorpion\"],\"1f99f\":[\"mosquito\"],\"1f9a0\":[\"microbe\",\"germ\"],\"1f490\":[\"bouquet\"],\"1f338\":[\"cherry_blossom\"],\"1f4ae\":[\"white_flower\"],\"1f3f5-fe0e\":[\"rosette\"],\"1f339\":[\"rose\"],\"1f940\":[\"wilted_rose\"],\"1f33a\":[\"hibiscus\"],\"1f33b\":[\"sunflower\"],\"1f33c\":[\"blossom\"],\"1f337\":[\"tulip\"],\"1f331\":[\"seedling\"],\"1f332\":[\"evergreen_tree\"],\"1f333\":[\"deciduous_tree\"],\"1f334\":[\"palm_tree\"],\"1f335\":[\"cactus\"],\"1f33e\":[\"ear_of_rice\"],\"1f33f\":[\"herb\"],\"2618-fe0e\":[\"shamrock\"],\"1f340\":[\"four_leaf_clover\"],\"1f341\":[\"maple_leaf\"],\"1f342\":[\"fallen_leaf\"],\"1f343\":[\"leaves\"],\"1f347\":[\"grapes\"],\"1f348\":[\"melon\"],\"1f349\":[\"watermelon\"],\"1f34a\":[\"tangerine\"],\"1f34b\":[\"lemon\"],\"1f34c\":[\"banana\"],\"1f34d\":[\"pineapple\"],\"1f96d\":[\"mango\"],\"1f34e\":[\"apple\"],\"1f34f\":[\"green_apple\"],\"1f350\":[\"pear\"],\"1f351\":[\"peach\"],\"1f352\":[\"cherries\"],\"1f353\":[\"strawberry\"],\"1f95d\":[\"kiwi\"],\"1f345\":[\"tomato\"],\"1f965\":[\"coconut\"],\"1f951\":[\"avocado\"],\"1f346\":[\"eggplant\"],\"1f954\":[\"potato\"],\"1f955\":[\"carrot\"],\"1f33d\":[\"corn\"],\"1f336-fe0e\":[\"hot_pepper\"],\"1f952\":[\"cucumber\"],\"1f96c\":[\"leafy_green\"],\"1f966\":[\"broccoli\"],\"1f9c4\":[\"garlic\"],\"1f9c5\":[\"onion\"],\"1f344\":[\"mushroom\"],\"1f95c\":[\"peanuts\"],\"1f330\":[\"chestnut\"],\"1f35e\":[\"bread\"],\"1f950\":[\"croissant\"],\"1f956\":[\"french_bread\"],\"1f968\":[\"pretzel\"],\"1f96f\":[\"bagel\"],\"1f95e\":[\"pancakes\"],\"1f9c7\":[\"waffle\"],\"1f9c0\":[\"cheese\"],\"1f356\":[\"meat_on_bone\"],\"1f357\":[\"poultry_leg\"],\"1f969\":[\"cut_of_meat\"],\"1f953\":[\"bacon\"],\"1f354\":[\"hamburger\"],\"1f35f\":[\"fries\"],\"1f355\":[\"pizza\"],\"1f32d\":[\"hotdog\"],\"1f96a\":[\"sandwich\"],\"1f32e\":[\"taco\"],\"1f32f\":[\"burrito\"],\"1f959\":[\"stuffed_flatbread\"],\"1f9c6\":[\"falafel\"],\"1f95a\":[\"egg\"],\"1f373\":[\"cooking\"],\"1f958\":[\"shallow_pan_of_food\"],\"1f372\":[\"stew\"],\"1f963\":[\"bowl_spoon\"],\"1f957\":[\"salad\"],\"1f37f\":[\"popcorn\"],\"1f9c8\":[\"butter\"],\"1f9c2\":[\"salt\"],\"1f96b\":[\"canned_food\"],\"1f371\":[\"bento\"],\"1f358\":[\"rice_cracker\"],\"1f359\":[\"rice_ball\"],\"1f35a\":[\"rice\"],\"1f35b\":[\"curry\"],\"1f35c\":[\"ramen\"],\"1f35d\":[\"spaghetti\"],\"1f360\":[\"sweet_potato\"],\"1f362\":[\"oden\"],\"1f363\":[\"sushi\"],\"1f364\":[\"fried_shrimp\"],\"1f365\":[\"fish_cake\"],\"1f96e\":[\"moon_cake\"],\"1f361\":[\"dango\"],\"1f95f\":[\"dumpling\"],\"1f960\":[\"fortune_cookie\"],\"1f961\":[\"takeout_box\"],\"1f980\":[\"crab\"],\"1f99e\":[\"lobster\"],\"1f990\":[\"shrimp\"],\"1f991\":[\"squid\"],\"1f9aa\":[\"oyster\"],\"1f366\":[\"icecream\"],\"1f367\":[\"shaved_ice\"],\"1f368\":[\"ice_cream\"],\"1f369\":[\"doughnut\"],\"1f36a\":[\"cookie\"],\"1f382\":[\"birthday\"],\"1f370\":[\"cake\"],\"1f9c1\":[\"cupcake\"],\"1f967\":[\"pie\"],\"1f36b\":[\"chocolate_bar\"],\"1f36c\":[\"candy\"],\"1f36d\":[\"lollipop\"],\"1f36e\":[\"custard\"],\"1f36f\":[\"honey_pot\"],\"1f37c\":[\"baby_bottle\"],\"1f95b\":[\"milk\"],\"1f375\":[\"tea\"],\"1f376\":[\"sake\"],\"1f37e\":[\"champagne\"],\"1f377\":[\"wine_glass\"],\"1f378\":[\"cocktail\"],\"1f379\":[\"tropical_drink\"],\"1f37a\":[\"beer\"],\"1f37b\":[\"beers\"],\"1f942\":[\"champagne_glass\"],\"1f943\":[\"tumbler_glass\"],\"1f964\":[\"cup_straw\"],\"1f9c3\":[\"beverage_box\",\"juice_box\"],\"1f9c9\":[\"mate\",\"yerba_mate\"],\"1f9ca\":[\"ice\"],\"1f962\":[\"chopsticks\"],\"1f37d-fe0e\":[\"fork_knife_plate\"],\"1f374\":[\"utensils\"],\"1f944\":[\"spoon\"],\"1f52a\":[\"knife\"],\"1f3fa\":[\"amphora\"],\"1f30d\":[\"earth_africa\"],\"1f30e\":[\"earth_americas\"],\"1f30f\":[\"earth_asia\"],\"1f310\":[\"globe\"],\"1f5fa-fe0e\":[\"map\"],\"1f5fe\":[\"japan\"],\"1f9ed\":[\"compass\"],\"1f3d4-fe0e\":[\"snowy_mountain\"],\"26f0-fe0e\":[\"mountain\"],\"1f30b\":[\"volcano\"],\"1f5fb\":[\"mount_fuji\"],\"1f3d5-fe0e\":[\"camping\"],\"1f3d6-fe0e\":[\"beach\"],\"1f3dc-fe0e\":[\"desert\"],\"1f3dd-fe0e\":[\"island\"],\"1f3de-fe0e\":[\"park\"],\"1f3df-fe0e\":[\"stadium\"],\"1f3db-fe0e\":[\"classical_building\"],\"1f3d7-fe0e\":[\"construction_site\"],\"1f9f1\":[\"brick\"],\"1f3d8-fe0e\":[\"homes\"],\"1f3da-fe0e\":[\"house_abandoned\"],\"1f3e0\":[\"house\"],\"1f3e1\":[\"house_garden\"],\"1f3e2\":[\"office\"],\"1f3e3\":[\"ja_post_office\"],\"1f3e4\":[\"post_office\"],\"1f3e5\":[\"hospital\"],\"1f3e6\":[\"bank\"],\"1f3e8\":[\"hotel\"],\"1f3e9\":[\"love_hotel\"],\"1f3ea\":[\"convenience_store\"],\"1f3eb\":[\"school\"],\"1f3ec\":[\"department_store\"],\"1f3ed\":[\"factory\"],\"1f3ef\":[\"japanese_castle\"],\"1f3f0\":[\"castle\",\"european_castle\"],\"1f492\":[\"wedding\"],\"1f5fc\":[\"tokyo_tower\"],\"1f5fd\":[\"statue_of_liberty\"],\"26ea\":[\"church\"],\"1f54c\":[\"mosque\"],\"1f6d5\":[\"hindu_temple\"],\"1f54d\":[\"synagogue\"],\"26e9-fe0e\":[\"shinto_shrine\"],\"1f54b\":[\"kaaba\"],\"26f2\":[\"fountain\"],\"26fa\":[\"tent\"],\"1f301\":[\"foggy\"],\"1f303\":[\"night_stars\"],\"1f3d9-fe0e\":[\"cityscape\"],\"1f304\":[\"sunrise_over_mountains\"],\"1f305\":[\"sunrise\"],\"1f306\":[\"dusk\"],\"1f307\":[\"sunset\"],\"1f309\":[\"bridge_at_night\"],\"2668-fe0e\":[\"hotsprings\"],\"1f3a0\":[\"carousel_horse\"],\"1f3a1\":[\"ferris_wheel\"],\"1f3a2\":[\"roller_coaster\"],\"1f488\":[\"barber\"],\"1f3aa\":[\"circus_tent\"],\"1f682\":[\"steam_locomotive\"],\"1f683\":[\"railway_car\"],\"1f684\":[\"bullettrain_side\"],\"1f685\":[\"bullettrain\"],\"1f686\":[\"train\"],\"1f687\":[\"metro\"],\"1f688\":[\"light_rail\"],\"1f689\":[\"station\"],\"1f68a\":[\"tram\"],\"1f69d\":[\"monorail\"],\"1f69e\":[\"mountain_railway\"],\"1f68b\":[\"tram_car\"],\"1f68c\":[\"bus\"],\"1f68d\":[\"oncoming_bus\"],\"1f68e\":[\"trolleybus\"],\"1f690\":[\"minibus\"],\"1f691\":[\"ambulance\"],\"1f692\":[\"fire_engine\"],\"1f693\":[\"police_car\"],\"1f694\":[\"oncoming_police_car\"],\"1f695\":[\"taxi\"],\"1f696\":[\"oncoming_taxi\"],\"1f697\":[\"red_car\",\"car\"],\"1f698\":[\"oncoming_automobile\"],\"1f699\":[\"blue_car\"],\"1f69a\":[\"truck\"],\"1f69b\":[\"lorry\"],\"1f69c\":[\"tractor\"],\"1f3ce-fe0e\":[\"race_car\"],\"1f3cd-fe0e\":[\"motorcycle\"],\"1f6f5\":[\"motor_scooter\"],\"1f9bd\":[\"wheelchair\"],\"1f9bc\":[\"motor_wheelchair\"],\"1f6fa\":[\"auto_rickshaw\"],\"1f6b2\":[\"bike\"],\"1f6f4\":[\"scooter\"],\"1f6f9\":[\"skateboard\"],\"1f68f\":[\"bus_stop\"],\"1f6e3-fe0e\":[\"motorway\"],\"1f6e4-fe0e\":[\"railway_track\"],\"1f6e2-fe0e\":[\"oil_drum\"],\"26fd\":[\"fuel_pump\"],\"1f6a8\":[\"rotating_light\",\"police_light\"],\"1f6a5\":[\"traffic_light\"],\"1f6a6\":[\"vertical_traffic_light\"],\"1f6d1\":[\"stop_sign\",\"octagonal_sign\"],\"1f6a7\":[\"construction\"],\"26f5\":[\"sailboat\"],\"1f6f6\":[\"canoe\"],\"1f6a4\":[\"speedboat\"],\"1f6f3-fe0e\":[\"cruise_ship\"],\"26f4-fe0e\":[\"ferry\"],\"1f6e5-fe0e\":[\"motorboat\"],\"1f6a2\":[\"ship\"],\"2708-fe0e\":[\"airplane\"],\"1f6e9-fe0e\":[\"small_airplane\"],\"1f6eb\":[\"airplane_departure\"],\"1f6ec\":[\"airplane_arriving\"],\"1fa82\":[\"parachute\"],\"1f4ba\":[\"seat\"],\"1f681\":[\"helicopter\"],\"1f69f\":[\"suspension_railway\"],\"1f6a0\":[\"mountain_cableway\"],\"1f6a1\":[\"aerial_tramway\"],\"1f6f0-fe0e\":[\"satellite\"],\"1f680\":[\"rocket\"],\"1f6f8\":[\"flying_saucer\"],\"1f6ce-fe0e\":[\"bellhop\"],\"1f9f3\":[\"luggage\"],\"231b\":[\"hourglass\"],\"23f3\":[\"hourglass_flowing\"],\"231a\":[\"watch\"],\"23f0\":[\"alarm_clock\"],\"23f1-fe0e\":[\"stopwatch\"],\"23f2-fe0e\":[\"timer\"],\"1f570-fe0e\":[\"clock\"],\"1f55b\":[\"clock12\"],\"1f567\":[\"clock1230\"],\"1f550\":[\"clock1\"],\"1f55c\":[\"clock130\"],\"1f551\":[\"clock2\"],\"1f55d\":[\"clock230\"],\"1f552\":[\"clock3\"],\"1f55e\":[\"clock330\"],\"1f553\":[\"clock4\"],\"1f55f\":[\"clock430\"],\"1f554\":[\"clock5\"],\"1f560\":[\"clock530\"],\"1f555\":[\"clock6\"],\"1f561\":[\"clock630\"],\"1f556\":[\"clock7\"],\"1f562\":[\"clock730\"],\"1f557\":[\"clock8\"],\"1f563\":[\"clock830\"],\"1f558\":[\"clock9\"],\"1f564\":[\"clock930\"],\"1f559\":[\"clock10\"],\"1f565\":[\"clock1030\"],\"1f55a\":[\"clock11\"],\"1f566\":[\"clock1130\"],\"1f311\":[\"new_moon\"],\"1f312\":[\"waxing_crescent_moon\"],\"1f313\":[\"first_quarter_moon\"],\"1f314\":[\"waxing_gibbous_moon\"],\"1f315\":[\"full_moon\"],\"1f316\":[\"waning_gibbous_moon\"],\"1f317\":[\"last_quarter_moon\"],\"1f318\":[\"waning_crescent_moon\"],\"1f319\":[\"crescent_moon\"],\"1f31a\":[\"new_moon_face\"],\"1f31b\":[\"first_quarter_moon_face\"],\"1f31c\":[\"last_quarter_moon_face\"],\"1f321-fe0e\":[\"thermometer\"],\"2600-fe0e\":[\"sun\"],\"1f31d\":[\"full_moon_face\"],\"1f31e\":[\"sun_face\"],\"1fa90\":[\"ringed_planet\",\"saturn\"],\"2b50\":[\"star\"],\"1f31f\":[\"star2\",\"glowing_star\"],\"1f320\":[\"star3\",\"shooting_star\"],\"1f30c\":[\"milky_way\"],\"2601-fe0e\":[\"cloud\"],\"26c5\":[\"partly_sunny\"],\"26c8-fe0e\":[\"storm\"],\"1f324-fe0e\":[\"overcast\"],\"1f325-fe0e\":[\"cloudy\"],\"1f326-fe0e\":[\"sunshower\"],\"1f327-fe0e\":[\"rain\"],\"1f328-fe0e\":[\"snow\"],\"1f329-fe0e\":[\"lightning\"],\"1f32a-fe0e\":[\"tornado\"],\"1f32b-fe0e\":[\"fog\"],\"1f32c-fe0e\":[\"wind_face\"],\"1f300\":[\"cyclone\"],\"1f308\":[\"rainbow\"],\"1f302\":[\"closed_umbrella\"],\"2602-fe0e\":[\"umbrella\"],\"26f1-fe0e\":[\"beach_umbrella\"],\"26a1\":[\"zap\",\"high_voltage\"],\"2744-fe0e\":[\"snowflake\"],\"2603-fe0e\":[\"snowy_snowman\"],\"26c4\":[\"snowman\"],\"2604-fe0e\":[\"comet\"],\"1f525\":[\"fire\"],\"1f4a7\":[\"droplet\"],\"1f30a\":[\"ocean\"],\"1f383\":[\"jack_o_lantern\"],\"1f384\":[\"christmas_tree\",\"xmas_tree\"],\"1f386\":[\"fireworks\"],\"1f387\":[\"sparkler\"],\"1f9e8\":[\"firecracker\"],\"1f388\":[\"balloon\"],\"1f389\":[\"tada\",\"party\"],\"1f38a\":[\"confetti_ball\"],\"1f38b\":[\"tanabata_tree\"],\"1f38d\":[\"bamboo\",\"pine_decor\"],\"1f38e\":[\"dolls\"],\"1f38f\":[\"carp_streamer\"],\"1f390\":[\"wind_chime\"],\"1f391\":[\"moon_ceremony\",\"rice_scene\"],\"1f9e7\":[\"red_envelope\"],\"1f380\":[\"ribbon\"],\"1f381\":[\"gift\"],\"1f397-fe0e\":[\"reminder_ribbon\"],\"1f39f-fe0e\":[\"tickets\",\"admission\"],\"1f3ab\":[\"ticket\"],\"1f396-fe0e\":[\"military_medal\"],\"1f3c6\":[\"trophy\"],\"1f3c5\":[\"medal\"],\"1f947\":[\"first_place\"],\"1f948\":[\"second_place\"],\"1f949\":[\"third_place\"],\"26bd\":[\"soccer\"],\"26be\":[\"baseball\"],\"1f94e\":[\"softball\"],\"1f3c0\":[\"basketball\"],\"1f3d0\":[\"volleyball\"],\"1f3c8\":[\"football\"],\"1f3c9\":[\"rugby\"],\"1f3be\":[\"tennis\"],\"1f94f\":[\"flying_disc\"],\"1f3b3\":[\"bowling\"],\"1f3cf\":[\"cricket_game\"],\"1f3d1\":[\"field_hockey\"],\"1f3d2\":[\"hockey\"],\"1f94d\":[\"lacrosse\"],\"1f3d3\":[\"ping_pong\"],\"1f3f8\":[\"badminton\"],\"1f94a\":[\"boxing_glove\"],\"1f94b\":[\"gi\",\"martial_arts_uniform\"],\"1f945\":[\"goal\"],\"26f3\":[\"golf\"],\"26f8-fe0e\":[\"ice_skate\"],\"1f3a3\":[\"fishing_pole\"],\"1f93f\":[\"diving_mask\",\"scuba_mask\"],\"1f3bd\":[\"running_shirt\"],\"1f3bf\":[\"ski\"],\"1f6f7\":[\"sled\"],\"1f94c\":[\"curling_stone\"],\"1f3af\":[\"dart\"],\"1fa80\":[\"yoyo\"],\"1fa81\":[\"kite\"],\"1f3b1\":[\"8ball\"],\"1f52e\":[\"crystal_ball\"],\"1f9ff\":[\"nazar_amulet\"],\"1f3ae\":[\"video_game\"],\"1f579-fe0e\":[\"joystick\"],\"1f3b0\":[\"slot_machine\"],\"1f3b2\":[\"game_die\"],\"1f9e9\":[\"jigsaw\",\"puzzle_piece\"],\"1f9f8\":[\"teddy_bear\"],\"2660-fe0e\":[\"spades\"],\"2665-fe0e\":[\"hearts\"],\"2666-fe0e\":[\"diamonds\"],\"2663-fe0e\":[\"clubs\"],\"265f-fe0e\":[\"chess_pawn\"],\"1f0cf\":[\"black_joker\"],\"1f004\":[\"mahjong\"],\"1f3b4\":[\"flower_cards\"],\"1f3ad\":[\"performing_arts\"],\"1f5bc-fe0e\":[\"frame_photo\"],\"1f3a8\":[\"art\",\"palette\"],\"1f9f5\":[\"spool\"],\"1f9f6\":[\"yarn\"],\"1f453\":[\"glasses\"],\"1f576-fe0e\":[\"sunglasses\"],\"1f97d\":[\"goggles\"],\"1f97c\":[\"lab_coat\"],\"1f9ba\":[\"safety_vest\"],\"1f454\":[\"necktie\",\"tie\"],\"1f455\":[\"shirt\"],\"1f456\":[\"jeans\"],\"1f9e3\":[\"scarf\"],\"1f9e4\":[\"gloves\"],\"1f9e5\":[\"coat\"],\"1f9e6\":[\"socks\"],\"1f457\":[\"dress\"],\"1f458\":[\"kimono\"],\"1f97b\":[\"sari\"],\"1fa71\":[\"one_piece_swimsuit\"],\"1fa72\":[\"briefs\"],\"1fa73\":[\"shorts\"],\"1f459\":[\"bikini\"],\"1f45a\":[\"blouse\",\"womans_clothes\"],\"1f45b\":[\"purse\"],\"1f45c\":[\"handbag\"],\"1f45d\":[\"pouch\",\"clutch_bag\"],\"1f6cd-fe0e\":[\"shopping_bags\"],\"1f392\":[\"backpack\"],\"1f45e\":[\"dress_shoe\",\"mans_shoe\"],\"1f45f\":[\"sneaker\",\"athletic_shoe\"],\"1f97e\":[\"hiking_boot\"],\"1f97f\":[\"flat_shoe\"],\"1f460\":[\"high_heel\"],\"1f461\":[\"womans_sandal\"],\"1fa70\":[\"ballet_shoes\"],\"1f462\":[\"womans_boot\"],\"1f451\":[\"crown\"],\"1f452\":[\"womans_hat\"],\"1f3a9\":[\"top_hat\"],\"1f393\":[\"graduation_cap\"],\"1f9e2\":[\"billed_cap\"],\"26d1-fe0e\":[\"helmet_cross\"],\"1f4ff\":[\"prayer_beads\"],\"1f484\":[\"lipstick\"],\"1f48d\":[\"ring\"],\"1f48e\":[\"gem\"],\"1f507\":[\"mute\",\"no_sound\"],\"1f508\":[\"speaker\",\"low_sound\"],\"1f509\":[\"sound\"],\"1f50a\":[\"loud_sound\"],\"1f4e2\":[\"loudspeaker\"],\"1f4e3\":[\"megaphone\"],\"1f4ef\":[\"postal_horn\"],\"1f514\":[\"bell\"],\"1f515\":[\"no_bell\"],\"1f3bc\":[\"musical_score\"],\"1f3b5\":[\"musical_note\"],\"1f3b6\":[\"musical_notes\"],\"1f399-fe0e\":[\"studio_microphone\"],\"1f39a-fe0e\":[\"level_slider\"],\"1f39b-fe0e\":[\"control_knobs\"],\"1f3a4\":[\"microphone\"],\"1f3a7\":[\"headphones\"],\"1f4fb\":[\"radio\"],\"1f3b7\":[\"saxophone\"],\"1f3b8\":[\"guitar\"],\"1f3b9\":[\"musical_keyboard\"],\"1f3ba\":[\"trumpet\"],\"1f3bb\":[\"violin\"],\"1fa95\":[\"banjo\"],\"1f941\":[\"drum\"],\"1f4f1\":[\"mobile\",\"iphone\",\"android\"],\"1f4f2\":[\"mobile_calling\"],\"260e-fe0e\":[\"telephone\"],\"1f4de\":[\"telephone_receiver\"],\"1f4df\":[\"pager\"],\"1f4e0\":[\"fax\"],\"1f50b\":[\"battery\"],\"1f50c\":[\"electric_plug\"],\"1f4bb\":[\"laptop\"],\"1f5a5-fe0e\":[\"desktop\",\"computer\"],\"1f5a8-fe0e\":[\"printer\"],\"2328-fe0e\":[\"keyboard\"],\"1f5b1-fe0e\":[\"computer_mouse\"],\"1f5b2-fe0e\":[\"trackball\"],\"1f4bd\":[\"minidisc\"],\"1f4be\":[\"floppy_disk\"],\"1f4bf\":[\"cd\",\"disk\"],\"1f4c0\":[\"dvd\"],\"1f9ee\":[\"abacus\"],\"1f3a5\":[\"movie_camera\"],\"1f39e-fe0e\":[\"film_frames\"],\"1f4fd-fe0e\":[\"projector\"],\"1f3ac\":[\"clapper\"],\"1f4fa\":[\"tv\"],\"1f4f7\":[\"camera\"],\"1f4f8\":[\"camera_flash\"],\"1f4f9\":[\"video_camera\"],\"1f4fc\":[\"vhs\"],\"1f50d\":[\"mag\"],\"1f50e\":[\"mag_right\"],\"1f56f-fe0e\":[\"candle\"],\"1f4a1\":[\"bulb\",\"light_bulb\"],\"1f526\":[\"flashlight\"],\"1f3ee\":[\"red_lantern\"],\"1fa94\":[\"diya_lamp\"],\"1f4d4\":[\"decorative_notebook\"],\"1f4d5\":[\"closed_book\"],\"1f4d6\":[\"book\"],\"1f4d7\":[\"green_book\"],\"1f4d8\":[\"blue_book\"],\"1f4d9\":[\"orange_book\"],\"1f4da\":[\"books\"],\"1f4d3\":[\"notebook\"],\"1f4d2\":[\"ledger\"],\"1f4c3\":[\"page_curl\"],\"1f4dc\":[\"scroll\"],\"1f4c4\":[\"page_facing_up\"],\"1f4f0\":[\"newspaper\"],\"1f5de-fe0e\":[\"rolled_newspaper\"],\"1f4d1\":[\"bookmark_tabs\"],\"1f516\":[\"bookmark\"],\"1f3f7-fe0e\":[\"label\"],\"1f4b0\":[\"moneybag\"],\"1f4b4\":[\"yen\"],\"1f4b5\":[\"dollar\"],\"1f4b6\":[\"euro\"],\"1f4b7\":[\"pound\"],\"1f4b8\":[\"money_wings\"],\"1f4b3\":[\"credit_card\"],\"1f9fe\":[\"receipt\"],\"1f4b9\":[\"ja_chart\"],\"1f4b1\":[\"currency_exchange\"],\"1f4b2\":[\"dollar_sign\"],\"2709-fe0e\":[\"envelope\"],\"1f4e7\":[\"email\"],\"1f4e8\":[\"incoming_envelope\"],\"1f4e9\":[\"envelope_arrow\"],\"1f4e4\":[\"outbox_tray\"],\"1f4e5\":[\"inbox_tray\"],\"1f4e6\":[\"package\"],\"1f4eb\":[\"mailbox\"],\"1f4ea\":[\"mailbox_closed\"],\"1f4ec\":[\"mailbox_mail\"],\"1f4ed\":[\"mailbox_no_mail\"],\"1f4ee\":[\"postbox\"],\"1f5f3-fe0e\":[\"ballot_box\"],\"270f-fe0e\":[\"pencil\"],\"2712-fe0e\":[\"black_nib\"],\"1f58b-fe0e\":[\"fountain_pen\"],\"1f58a-fe0e\":[\"pen\"],\"1f58c-fe0e\":[\"paintbrush\"],\"1f58d-fe0e\":[\"crayon\"],\"1f4dd\":[\"memo\"],\"1f4bc\":[\"briefcase\"],\"1f4c1\":[\"file_folder\"],\"1f4c2\":[\"open_file_folder\"],\"1f5c2-fe0e\":[\"dividers\"],\"1f4c5\":[\"date\",\"calendar\"],\"1f4c6\":[\"torn_calendar\"],\"1f5d2-fe0e\":[\"notepad_spiral\"],\"1f5d3-fe0e\":[\"calendar_spiral\"],\"1f4c7\":[\"card_index\"],\"1f4c8\":[\"chart_up\"],\"1f4c9\":[\"chart_down\"],\"1f4ca\":[\"bar_chart\"],\"1f4cb\":[\"clipboard\"],\"1f4cc\":[\"pushpin\"],\"1f4cd\":[\"round_pushpin\"],\"1f4ce\":[\"paperclip\"],\"1f587-fe0e\":[\"paperclips\"],\"1f4cf\":[\"straight_ruler\"],\"1f4d0\":[\"triangular_ruler\"],\"2702-fe0e\":[\"scissors\"],\"1f5c3-fe0e\":[\"card_box\"],\"1f5c4-fe0e\":[\"file_cabinet\"],\"1f5d1-fe0e\":[\"trashcan\",\"wastebasket\"],\"1f512\":[\"lock\"],\"1f513\":[\"unlock\"],\"1f50f\":[\"locked_pen\"],\"1f510\":[\"locked_key\"],\"1f511\":[\"key\"],\"1f5dd-fe0e\":[\"old_key\"],\"1f528\":[\"hammer\"],\"1fa93\":[\"axe\"],\"26cf-fe0e\":[\"pick\"],\"2692-fe0e\":[\"hammer_pick\"],\"1f6e0-fe0e\":[\"tools\",\"hammer_wrench\"],\"1f5e1-fe0e\":[\"dagger\"],\"2694-fe0e\":[\"crossed_swords\"],\"1f52b\":[\"gun\",\"pistol\"],\"1f3f9\":[\"bow\"],\"1f6e1-fe0e\":[\"shield\"],\"1f527\":[\"wrench\"],\"1f529\":[\"nut_and_bolt\"],\"2699-fe0e\":[\"gear\"],\"1f5dc-fe0e\":[\"clamp\",\"compression\"],\"2696-fe0e\":[\"scales\"],\"1f9af\":[\"probing_cane\"],\"1f517\":[\"link\"],\"26d3-fe0e\":[\"chains\"],\"1f9f0\":[\"toolbox\"],\"1f9f2\":[\"magnet\"],\"2697-fe0e\":[\"alembic\"],\"1f9ea\":[\"test_tube\"],\"1f9eb\":[\"petri_dish\"],\"1f9ec\":[\"dna\",\"double_helix\"],\"1f52c\":[\"microscope\"],\"1f52d\":[\"telescope\"],\"1f4e1\":[\"satellite_antenna\"],\"1f489\":[\"syringe\"],\"1fa78\":[\"blood_drop\"],\"1f48a\":[\"pill\"],\"1fa79\":[\"bandaid\",\"adhesive_bandage\"],\"1fa7a\":[\"stethoscope\"],\"1f6aa\":[\"door\"],\"1f6cf-fe0e\":[\"bed\"],\"1f6cb-fe0e\":[\"couch\"],\"1fa91\":[\"chair\"],\"1f6bd\":[\"toilet\"],\"1f6bf\":[\"shower\"],\"1f6c1\":[\"bathtub\"],\"1fa92\":[\"razor\"],\"1f9f4\":[\"lotion\"],\"1f9f7\":[\"safety_pin\"],\"1f9f9\":[\"broom\"],\"1f9fa\":[\"basket\"],\"1f9fb\":[\"toilet_paper\"],\"1f9fc\":[\"soap\"],\"1f9fd\":[\"sponge\"],\"1f9ef\":[\"fire_extinguisher\"],\"1f6d2\":[\"shopping_cart\"],\"1f6ac\":[\"cigarette\",\"smoking\"],\"26b0-fe0e\":[\"coffin\"],\"26b1-fe0e\":[\"urn\"],\"1f5ff\":[\"moai\"],\"1f3e7\":[\"atm\"],\"1f6ae\":[\"litter_bin\"],\"1f6b0\":[\"potable_water\"],\"267f\":[\"handicapped\"],\"1f6b9\":[\"mens\"],\"1f6ba\":[\"womens\"],\"1f6bb\":[\"restroom\",\"bathroom\"],\"1f6bc\":[\"baby_symbol\"],\"1f6be\":[\"wc\"],\"1f6c2\":[\"passport_control\"],\"1f6c3\":[\"customs\"],\"1f6c4\":[\"baggage_claim\"],\"1f6c5\":[\"left_luggage\"],\"26a0-fe0e\":[\"warning\"],\"1f6b8\":[\"children_crossing\"],\"26d4\":[\"no_entry\"],\"1f6ab\":[\"no_entry_sign\"],\"1f6b3\":[\"no_bicycles\"],\"1f6ad\":[\"no_smoking\"],\"1f6af\":[\"do_not_litter\"],\"1f6b1\":[\"non_potable_water\"],\"1f6b7\":[\"no_pedestrians\"],\"1f4f5\":[\"no_mobile_phones\"],\"1f51e\":[\"underage\"],\"2622-fe0e\":[\"radioactive\"],\"2623-fe0e\":[\"biohazard\"],\"2b06-fe0e\":[\"arrow_up\"],\"2197-fe0e\":[\"arrow_upper_right\"],\"27a1-fe0e\":[\"arrow_right\"],\"2198-fe0e\":[\"arrow_lower_right\"],\"2b07-fe0e\":[\"arrow_down\"],\"2199-fe0e\":[\"arrow_lower_left\"],\"2b05-fe0e\":[\"arrow_left\"],\"2196-fe0e\":[\"arrow_upper_left\"],\"2195-fe0e\":[\"arrow_up_down\"],\"2194-fe0e\":[\"arrow_left_right\"],\"21a9-fe0e\":[\"arrow_left_hook\"],\"21aa-fe0e\":[\"arrow_right_hook\"],\"2934-fe0e\":[\"arrow_heading_up\"],\"2935-fe0e\":[\"arrow_heading_down\"],\"1f503\":[\"clockwise\"],\"1f504\":[\"counter_clockwise\"],\"1f519\":[\"back\"],\"1f51a\":[\"end\"],\"1f51b\":[\"on\"],\"1f51c\":[\"soon\"],\"1f51d\":[\"top\"],\"1f6d0\":[\"place_of_worship\"],\"269b-fe0e\":[\"atom\"],\"1f549-fe0e\":[\"om_symbol\"],\"2721-fe0e\":[\"star_of_david\"],\"2638-fe0e\":[\"wheel_of_dharma\"],\"262f-fe0e\":[\"yin_yang\"],\"271d-fe0e\":[\"cross\"],\"2626-fe0e\":[\"orthodox_cross\"],\"262a-fe0e\":[\"star_and_crescent\"],\"262e-fe0e\":[\"peace\"],\"1f54e\":[\"menorah\"],\"1f52f\":[\"six_pointed_star\"],\"264a\":[\"gemini\"],\"264b\":[\"cancer\"],\"264c\":[\"leo\"],\"264d\":[\"virgo\"],\"264e\":[\"libra\"],\"264f\":[\"scorpius\"],\"26ce\":[\"ophiuchus\"],\"1f500\":[\"shuffle\"],\"1f501\":[\"repeat\"],\"1f502\":[\"repeat_single\"],\"25b6-fe0e\":[\"play\"],\"23e9\":[\"fast_forward\"],\"23ed-fe0e\":[\"next_track\"],\"23ef-fe0e\":[\"play_pause\"],\"25c0-fe0e\":[\"reverse\"],\"23ea\":[\"rewind\"],\"23ee-fe0e\":[\"previous_track\"],\"1f53c\":[\"up_button\"],\"23eb\":[\"fast_up_button\"],\"1f53d\":[\"down_button\"],\"23ec\":[\"fast_down_button\"],\"23f8-fe0e\":[\"pause\"],\"23f9-fe0e\":[\"stop\"],\"23fa-fe0e\":[\"record\"],\"23cf-fe0e\":[\"eject\"],\"1f3a6\":[\"cinema\"],\"1f505\":[\"dim\",\"low_brightness\"],\"1f506\":[\"bright\",\"high_brightness\"],\"1f4f6\":[\"signal_strength\",\"antenna_bars\"],\"1f4f3\":[\"vibration_mode\"],\"1f4f4\":[\"mobile_phone_off\"],\"2640-fe0e\":[\"female\",\"female_sign\"],\"2642-fe0e\":[\"male\",\"male_sign\"],\"2695-fe0e\":[\"medical\"],\"267e-fe0e\":[\"infinity\"],\"267b-fe0e\":[\"recycle\"],\"269c-fe0e\":[\"fleur-de-lis\"],\"1f531\":[\"trident\"],\"1f4db\":[\"name_badge\"],\"1f530\":[\"ja_beginner\"],\"2b55\":[\"o\"],\"2611-fe0e\":[\"checked_ballot\"],\"2714-fe0e\":[\"check_mark\"],\"2716-fe0e\":[\"multiplication\"],\"274c\":[\"x\",\"cross_mark\"],\"274e\":[\"cross_mark_button\"],\"27b0\":[\"curly_loop\"],\"27bf\":[\"double_curly_loop\"],\"303d-fe0e\":[\"part_alternation_mark\"],\"2733-fe0e\":[\"eight_spoked_asterisk\"],\"2734-fe0e\":[\"eight_pointed_star\"],\"2747-fe0e\":[\"sparkle\"],\"203c-fe0e\":[\"bangbang\",\"double_exclamation\"],\"2049-fe0e\":[\"interrobang\",\"exclamation_question\"],\"3030-fe0e\":[\"wavy_dash\"],\"a9-fe0e\":[\"copyright\"],\"ae-fe0e\":[\"registered\"],\"2122-fe0e\":[\"tm\"],\"23-20e3\":[\"hash\"],\"2a-20e3\":[\"asterisk\"],\"30-20e3\":[\"zero\"],\"31-20e3\":[\"one\"],\"32-20e3\":[\"two\"],\"33-20e3\":[\"three\"],\"34-20e3\":[\"four\"],\"35-20e3\":[\"five\"],\"36-20e3\":[\"six\"],\"37-20e3\":[\"seven\"],\"38-20e3\":[\"eight\"],\"39-20e3\":[\"nine\"],\"1f51f\":[\"ten\"],\"1f520\":[\"upper_abcd\"],\"1f521\":[\"abcd\"],\"1f522\":[\"1234\"],\"1f523\":[\"symbols\"],\"1f524\":[\"abc\"],\"1f170-fe0e\":[\"a_blood\"],\"1f18e\":[\"ab_blood\"],\"1f171-fe0e\":[\"b_blood\"],\"1f191\":[\"cl\"],\"1f192\":[\"cool\"],\"1f193\":[\"free\"],\"2139-fe0e\":[\"info\"],\"1f194\":[\"id\"],\"24c2-fe0e\":[\"m\"],\"1f195\":[\"new\"],\"1f196\":[\"ng\"],\"1f17e-fe0e\":[\"o_blood\"],\"1f197\":[\"ok\"],\"1f17f-fe0e\":[\"p\"],\"1f198\":[\"sos\"],\"1f199\":[\"up\"],\"1f19a\":[\"vs\"],\"1f201\":[\"ja_here\",\"koko\"],\"1f202-fe0e\":[\"ja_service_charge\"],\"1f237-fe0e\":[\"ja_monthly_amount\"],\"1f236\":[\"ja_not_free_of_carge\"],\"1f22f\":[\"ja_reserved\"],\"1f250\":[\"ja_bargain\"],\"1f239\":[\"ja_discount\"],\"1f21a\":[\"ja_free_of_charge\"],\"1f232\":[\"ja_prohibited\"],\"1f251\":[\"ja_acceptable\"],\"1f238\":[\"ja_application\"],\"1f234\":[\"ja_passing_grade\"],\"1f233\":[\"ja_vacancy\"],\"3297-fe0e\":[\"ja_congratulations\"],\"3299-fe0e\":[\"ja_secret\"],\"1f23a\":[\"ja_open_for_business\"],\"1f235\":[\"ja_no_vacancy\"],\"1f534\":[\"red_circle\"],\"1f7e0\":[\"orange_circle\"],\"1f7e1\":[\"yellow_circle\"],\"1f7e2\":[\"green_circle\"],\"1f535\":[\"blue_circle\"],\"1f7e3\":[\"purple_circle\"],\"1f7e4\":[\"brown_circle\"],\"26ab\":[\"black_circle\"],\"26aa\":[\"white_circle\"],\"1f7e5\":[\"red_square\"],\"1f7e7\":[\"orange_square\"],\"1f7e8\":[\"yellow_square\"],\"1f7e9\":[\"green_square\"],\"1f7e6\":[\"blue_square\"],\"1f7ea\":[\"purple_square\"],\"1f7eb\":[\"brown_square\"],\"2b1b\":[\"large_black_square\"],\"2b1c\":[\"large_white_square\"],\"25fc-fe0e\":[\"medium_black_square\"],\"25fb-fe0e\":[\"medium_white_square\"],\"25fe\":[\"medium_small_black_square\"],\"25fd\":[\"medium_small_white_square\"],\"25aa-fe0e\":[\"small_black_square\"],\"25ab-fe0e\":[\"small_white_square\"],\"1f536\":[\"large_orange_diamond\"],\"1f537\":[\"large_blue_diamond\"],\"1f538\":[\"small_orange_diamond\"],\"1f539\":[\"small_blue_diamond\"],\"1f53a\":[\"up_red_triangle\"],\"1f53b\":[\"down_red_triangle\"],\"1f4a0\":[\"diamond_dot\"],\"1f518\":[\"radio_button\"],\"1f533\":[\"white_square_button\"],\"1f532\":[\"black_square_button\"],\"1f3c1\":[\"checkered_flag\"],\"1f6a9\":[\"triangle_flag\"],\"1f38c\":[\"crossed_flags\"],\"1f3f4\":[\"black_flag\"],\"1f3f3-fe0e\":[\"white_flag\"],\"1f3f3-fe0f-200d-1f308\":[\"rainbow_flag\"],\"1f3f4-200d-2620-fe0f\":[\"pirate_flag\",\"jolly_roger\"],\"1f1e6-1f1e8\":[\"flag_ac\"],\"1f1e6-1f1e9\":[\"flag_ad\"],\"1f1e6-1f1ea\":[\"flag_ae\"],\"1f1e6-1f1eb\":[\"flag_af\"],\"1f1e6-1f1ec\":[\"flag_ag\"],\"1f1e6-1f1ee\":[\"flag_ai\"],\"1f1e6-1f1f1\":[\"flag_al\"],\"1f1e6-1f1f2\":[\"flag_am\"],\"1f1e6-1f1f4\":[\"flag_ao\"],\"1f1e6-1f1f6\":[\"flag_aq\"],\"1f1e6-1f1f7\":[\"flag_ar\"],\"1f1e6-1f1f8\":[\"flag_as\"],\"1f1e6-1f1f9\":[\"flag_at\"],\"1f1e6-1f1fa\":[\"flag_au\"],\"1f1e6-1f1fc\":[\"flag_aw\"],\"1f1e6-1f1fd\":[\"flag_ax\"],\"1f1e6-1f1ff\":[\"flag_az\"],\"1f1e7-1f1e6\":[\"flag_ba\"],\"1f1e7-1f1e7\":[\"flag_bb\"],\"1f1e7-1f1e9\":[\"flag_bd\"],\"1f1e7-1f1ea\":[\"flag_be\"],\"1f1e7-1f1eb\":[\"flag_bf\"],\"1f1e7-1f1ec\":[\"flag_bg\"],\"1f1e7-1f1ed\":[\"flag_bh\"],\"1f1e7-1f1ee\":[\"flag_bi\"],\"1f1e7-1f1ef\":[\"flag_bj\"],\"1f1e7-1f1f1\":[\"flag_bl\"],\"1f1e7-1f1f2\":[\"flag_bm\"],\"1f1e7-1f1f3\":[\"flag_bn\"],\"1f1e7-1f1f4\":[\"flag_bo\"],\"1f1e7-1f1f6\":[\"flag_bq\"],\"1f1e7-1f1f7\":[\"flag_br\"],\"1f1e7-1f1f8\":[\"flag_bs\"],\"1f1e7-1f1f9\":[\"flag_bt\"],\"1f1e7-1f1fb\":[\"flag_bv\"],\"1f1e7-1f1fc\":[\"flag_bw\"],\"1f1e7-1f1fe\":[\"flag_by\"],\"1f1e7-1f1ff\":[\"flag_bz\"],\"1f1e8-1f1e6\":[\"flag_ca\"],\"1f1e8-1f1e8\":[\"flag_cc\"],\"1f1e8-1f1e9\":[\"flag_cd\"],\"1f1e8-1f1eb\":[\"flag_cf\"],\"1f1e8-1f1ec\":[\"flag_cg\"],\"1f1e8-1f1ed\":[\"flag_ch\"],\"1f1e8-1f1ee\":[\"flag_ci\"],\"1f1e8-1f1f0\":[\"flag_ck\"],\"1f1e8-1f1f1\":[\"flag_cl\"],\"1f1e8-1f1f2\":[\"flag_cm\"],\"1f1e8-1f1f3\":[\"flag_cn\"],\"1f1e8-1f1f4\":[\"flag_co\"],\"1f1e8-1f1f5\":[\"flag_cp\"],\"1f1e8-1f1f7\":[\"flag_cr\"],\"1f1e8-1f1fa\":[\"flag_cu\"],\"1f1e8-1f1fb\":[\"flag_cv\"],\"1f1e8-1f1fc\":[\"flag_cw\"],\"1f1e8-1f1fd\":[\"flag_cx\"],\"1f1e8-1f1fe\":[\"flag_cy\"],\"1f1e8-1f1ff\":[\"flag_cz\"],\"1f1e9-1f1ea\":[\"flag_de\"],\"1f1e9-1f1ec\":[\"flag_dg\"],\"1f1e9-1f1ef\":[\"flag_dj\"],\"1f1e9-1f1f0\":[\"flag_dk\"],\"1f1e9-1f1f2\":[\"flag_dm\"],\"1f1e9-1f1f4\":[\"flag_do\"],\"1f1e9-1f1ff\":[\"flag_dz\"],\"1f1ea-1f1e6\":[\"flag_ea\"],\"1f1ea-1f1e8\":[\"flag_ec\"],\"1f1ea-1f1ea\":[\"flag_ee\"],\"1f1ea-1f1ec\":[\"flag_eg\"],\"1f1ea-1f1ed\":[\"flag_eh\"],\"1f1ea-1f1f7\":[\"flag_er\"],\"1f1ea-1f1f8\":[\"flag_es\"],\"1f1ea-1f1f9\":[\"flag_et\"],\"1f1ea-1f1fa\":[\"flag_eu\"],\"1f1eb-1f1ee\":[\"flag_fi\"],\"1f1eb-1f1ef\":[\"flag_fj\"],\"1f1eb-1f1f0\":[\"flag_fk\"],\"1f1eb-1f1f2\":[\"flag_fm\"],\"1f1eb-1f1f4\":[\"flag_fo\"],\"1f1eb-1f1f7\":[\"flag_fr\"],\"1f1ec-1f1e6\":[\"flag_ga\"],\"1f1ec-1f1e7\":[\"flag_gb\"],\"1f1ec-1f1e9\":[\"flag_gd\"],\"1f1ec-1f1ea\":[\"flag_ge\"],\"1f1ec-1f1eb\":[\"flag_gf\"],\"1f1ec-1f1ec\":[\"flag_gg\"],\"1f1ec-1f1ed\":[\"flag_gh\"],\"1f1ec-1f1ee\":[\"flag_gi\"],\"1f1ec-1f1f1\":[\"flag_gl\"],\"1f1ec-1f1f2\":[\"flag_gm\"],\"1f1ec-1f1f3\":[\"flag_gn\"],\"1f1ec-1f1f5\":[\"flag_gp\"],\"1f1ec-1f1f6\":[\"flag_gq\"],\"1f1ec-1f1f7\":[\"flag_gr\"],\"1f1ec-1f1f8\":[\"flag_gs\"],\"1f1ec-1f1f9\":[\"flag_gt\"],\"1f1ec-1f1fa\":[\"flag_gu\"],\"1f1ec-1f1fc\":[\"flag_gw\"],\"1f1ec-1f1fe\":[\"flag_gy\"],\"1f1ed-1f1f0\":[\"flag_hk\"],\"1f1ed-1f1f2\":[\"flag_hm\"],\"1f1ed-1f1f3\":[\"flag_hn\"],\"1f1ed-1f1f7\":[\"flag_hr\"],\"1f1ed-1f1f9\":[\"flag_ht\"],\"1f1ed-1f1fa\":[\"flag_hu\"],\"1f1ee-1f1e8\":[\"flag_ic\"],\"1f1ee-1f1e9\":[\"flag_id\"],\"1f1ee-1f1ea\":[\"flag_ie\"],\"1f1ee-1f1f1\":[\"flag_il\"],\"1f1ee-1f1f2\":[\"flag_im\"],\"1f1ee-1f1f3\":[\"flag_in\"],\"1f1ee-1f1f4\":[\"flag_io\"],\"1f1ee-1f1f6\":[\"flag_iq\"],\"1f1ee-1f1f7\":[\"flag_ir\"],\"1f1ee-1f1f8\":[\"flag_is\"],\"1f1ee-1f1f9\":[\"flag_it\"],\"1f1ef-1f1ea\":[\"flag_je\"],\"1f1ef-1f1f2\":[\"flag_jm\"],\"1f1ef-1f1f4\":[\"flag_jo\"],\"1f1ef-1f1f5\":[\"flag_jp\"],\"1f1f0-1f1ea\":[\"flag_ke\"],\"1f1f0-1f1ec\":[\"flag_kg\"],\"1f1f0-1f1ed\":[\"flag_kh\"],\"1f1f0-1f1ee\":[\"flag_ki\"],\"1f1f0-1f1f2\":[\"flag_km\"],\"1f1f0-1f1f3\":[\"flag_kn\"],\"1f1f0-1f1f5\":[\"flag_kp\"],\"1f1f0-1f1f7\":[\"flag_kr\"],\"1f1f0-1f1fc\":[\"flag_kw\"],\"1f1f0-1f1fe\":[\"flag_ky\"],\"1f1f0-1f1ff\":[\"flag_kz\"],\"1f1f1-1f1e6\":[\"flag_la\"],\"1f1f1-1f1e7\":[\"flag_lb\"],\"1f1f1-1f1e8\":[\"flag_lc\"],\"1f1f1-1f1ee\":[\"flag_li\"],\"1f1f1-1f1f0\":[\"flag_lk\"],\"1f1f1-1f1f7\":[\"flag_lr\"],\"1f1f1-1f1f8\":[\"flag_ls\"],\"1f1f1-1f1f9\":[\"flag_lt\"],\"1f1f1-1f1fa\":[\"flag_lu\"],\"1f1f1-1f1fb\":[\"flag_lv\"],\"1f1f1-1f1fe\":[\"flag_ly\"],\"1f1f2-1f1e6\":[\"flag_ma\"],\"1f1f2-1f1e8\":[\"flag_mc\"],\"1f1f2-1f1e9\":[\"flag_md\"],\"1f1f2-1f1ea\":[\"flag_me\"],\"1f1f2-1f1eb\":[\"flag_mf\"],\"1f1f2-1f1ec\":[\"flag_mg\"],\"1f1f2-1f1ed\":[\"flag_mh\"],\"1f1f2-1f1f0\":[\"flag_mk\"],\"1f1f2-1f1f1\":[\"flag_ml\"],\"1f1f2-1f1f2\":[\"flag_mm\"],\"1f1f2-1f1f3\":[\"flag_mn\"],\"1f1f2-1f1f4\":[\"flag_mo\"],\"1f1f2-1f1f5\":[\"flag_mp\"],\"1f1f2-1f1f6\":[\"flag_mq\"],\"1f1f2-1f1f7\":[\"flag_mr\"],\"1f1f2-1f1f8\":[\"flag_ms\"],\"1f1f2-1f1f9\":[\"flag_mt\"],\"1f1f2-1f1fa\":[\"flag_mu\"],\"1f1f2-1f1fb\":[\"flag_mv\"],\"1f1f2-1f1fc\":[\"flag_mw\"],\"1f1f2-1f1fd\":[\"flag_mx\"],\"1f1f2-1f1fe\":[\"flag_my\"],\"1f1f2-1f1ff\":[\"flag_mz\"],\"1f1f3-1f1e6\":[\"flag_na\"],\"1f1f3-1f1e8\":[\"flag_nc\"],\"1f1f3-1f1ea\":[\"flag_ne\"],\"1f1f3-1f1eb\":[\"flag_nf\"],\"1f1f3-1f1ec\":[\"flag_ng\"],\"1f1f3-1f1ee\":[\"flag_ni\"],\"1f1f3-1f1f1\":[\"flag_nl\"],\"1f1f3-1f1f4\":[\"flag_no\"],\"1f1f3-1f1f5\":[\"flag_np\"],\"1f1f3-1f1f7\":[\"flag_nr\"],\"1f1f3-1f1fa\":[\"flag_nu\"],\"1f1f3-1f1ff\":[\"flag_nz\"],\"1f1f4-1f1f2\":[\"flag_om\"],\"1f1f5-1f1e6\":[\"flag_pa\"],\"1f1f5-1f1ea\":[\"flag_pe\"],\"1f1f5-1f1eb\":[\"flag_pf\"],\"1f1f5-1f1ec\":[\"flag_pg\"],\"1f1f5-1f1ed\":[\"flag_ph\"],\"1f1f5-1f1f0\":[\"flag_pk\"],\"1f1f5-1f1f1\":[\"flag_pl\"],\"1f1f5-1f1f2\":[\"flag_pm\"],\"1f1f5-1f1f3\":[\"flag_pn\"],\"1f1f5-1f1f7\":[\"flag_pr\"],\"1f1f5-1f1f8\":[\"flag_ps\"],\"1f1f5-1f1f9\":[\"flag_pt\"],\"1f1f5-1f1fc\":[\"flag_pw\"],\"1f1f5-1f1fe\":[\"flag_py\"],\"1f1f6-1f1e6\":[\"flag_qa\"],\"1f1f7-1f1ea\":[\"flag_re\"],\"1f1f7-1f1f4\":[\"flag_ro\"],\"1f1f7-1f1f8\":[\"flag_rs\"],\"1f1f7-1f1fa\":[\"flag_ru\"],\"1f1f7-1f1fc\":[\"flag_rw\"],\"1f1f8-1f1e6\":[\"flag_sa\"],\"1f1f8-1f1e7\":[\"flag_sb\"],\"1f1f8-1f1e8\":[\"flag_sc\"],\"1f1f8-1f1e9\":[\"flag_sd\"],\"1f1f8-1f1ea\":[\"flag_se\"],\"1f1f8-1f1ec\":[\"flag_sg\"],\"1f1f8-1f1ed\":[\"flag_sh\"],\"1f1f8-1f1ee\":[\"flag_si\"],\"1f1f8-1f1ef\":[\"flag_sj\"],\"1f1f8-1f1f0\":[\"flag_sk\"],\"1f1f8-1f1f1\":[\"flag_sl\"],\"1f1f8-1f1f2\":[\"flag_sm\"],\"1f1f8-1f1f3\":[\"flag_sn\"],\"1f1f8-1f1f4\":[\"flag_so\"],\"1f1f8-1f1f7\":[\"flag_sr\"],\"1f1f8-1f1f8\":[\"flag_ss\"],\"1f1f8-1f1f9\":[\"flag_st\"],\"1f1f8-1f1fb\":[\"flag_sv\"],\"1f1f8-1f1fd\":[\"flag_sx\"],\"1f1f8-1f1fe\":[\"flag_sy\"],\"1f1f8-1f1ff\":[\"flag_sz\"],\"1f1f9-1f1e6\":[\"flag_ta\"],\"1f1f9-1f1e8\":[\"flag_tc\"],\"1f1f9-1f1e9\":[\"flag_td\"],\"1f1f9-1f1eb\":[\"flag_tf\"],\"1f1f9-1f1ec\":[\"flag_tg\"],\"1f1f9-1f1ed\":[\"flag_th\"],\"1f1f9-1f1ef\":[\"flag_tj\"],\"1f1f9-1f1f0\":[\"flag_tk\"],\"1f1f9-1f1f1\":[\"flag_tl\"],\"1f1f9-1f1f2\":[\"flag_tm\"],\"1f1f9-1f1f3\":[\"flag_tn\"],\"1f1f9-1f1f4\":[\"flag_to\"],\"1f1f9-1f1f7\":[\"flag_tr\"],\"1f1f9-1f1f9\":[\"flag_tt\"],\"1f1f9-1f1fb\":[\"flag_tv\"],\"1f1f9-1f1fc\":[\"flag_tw\"],\"1f1f9-1f1ff\":[\"flag_tz\"],\"1f1fa-1f1e6\":[\"flag_ua\"],\"1f1fa-1f1ec\":[\"flag_ug\"],\"1f1fa-1f1f2\":[\"flag_um\"],\"1f1fa-1f1f3\":[\"flag_un\"],\"1f1fa-1f1f8\":[\"flag_us\",\"usa\"],\"1f1fa-1f1fe\":[\"flag_uy\"],\"1f1fa-1f1ff\":[\"flag_uz\"],\"1f1fb-1f1e6\":[\"flag_va\"],\"1f1fb-1f1e8\":[\"flag_vc\"],\"1f1fb-1f1ea\":[\"flag_ve\"],\"1f1fb-1f1ec\":[\"flag_vg\"],\"1f1fb-1f1ee\":[\"flag_vi\"],\"1f1fb-1f1f3\":[\"flag_vn\"],\"1f1fb-1f1fa\":[\"flag_vu\"],\"1f1fc-1f1eb\":[\"flag_wf\"],\"1f1fc-1f1f8\":[\"flag_ws\"],\"1f1fd-1f1f0\":[\"flag_xk\"],\"1f1fe-1f1ea\":[\"flag_ye\"],\"1f1fe-1f1f9\":[\"flag_yt\"],\"1f1ff-1f1e6\":[\"flag_za\"],\"1f1ff-1f1f2\":[\"flag_zm\"],\"1f1ff-1f1fc\":[\"flag_zw\"],\"1f3f4-e0067-e0062-e0065-e006e-e0067-e007f\":[\"flag_gbeng\",\"england\"],\"1f3f4-e0067-e0062-e0073-e0063-e0074-e007f\":[\"flag_gbsct\",\"scotland\"],\"1f3f4-e0067-e0062-e0077-e006c-e0073-e007f\":[\"flag_gbwls\",\"wales\"]}");

/***/ }),

/***/ "./node_modules/simple-emoji-map/index.mjs":
/*!*************************************************!*\
  !*** ./node_modules/simple-emoji-map/index.mjs ***!
  \*************************************************/
/*! exports provided: default */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _generated_emojis_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./generated/emojis.json */ "./node_modules/simple-emoji-map/generated/emojis.json");
var _generated_emojis_json__WEBPACK_IMPORTED_MODULE_0___namespace = /*#__PURE__*/__webpack_require__.t(/*! ./generated/emojis.json */ "./node_modules/simple-emoji-map/generated/emojis.json", 1);
/* harmony reexport (default from named exports) */ __webpack_require__.d(__webpack_exports__, "default", function() { return _generated_emojis_json__WEBPACK_IMPORTED_MODULE_0__; });



/***/ }),

/***/ "./src/admin/addSettingsPage.js":
/*!**************************************!*\
  !*** ./src/admin/addSettingsPage.js ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var flarum_extend__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/extend */ "flarum/extend");
/* harmony import */ var flarum_extend__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_extend__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var flarum_components_AdminNav__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/components/AdminNav */ "flarum/components/AdminNav");
/* harmony import */ var flarum_components_AdminNav__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_components_AdminNav__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_components_AdminLinkButton__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/components/AdminLinkButton */ "flarum/components/AdminLinkButton");
/* harmony import */ var flarum_components_AdminLinkButton__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_components_AdminLinkButton__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _components_SettingsPage__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/SettingsPage */ "./src/admin/components/SettingsPage.js");




/* harmony default export */ __webpack_exports__["default"] = (function () {
  app.routes['fof-reactions'] = {
    path: '/fof/reactions',
    component: _components_SettingsPage__WEBPACK_IMPORTED_MODULE_3__["default"].component()
  };

  app.extensionSettings['fof-reactions'] = function () {
    return m.route(app.route('fof-reactions'));
  };

  Object(flarum_extend__WEBPACK_IMPORTED_MODULE_0__["extend"])(flarum_components_AdminNav__WEBPACK_IMPORTED_MODULE_1___default.a.prototype, 'items', function (items) {
    items.add('fof-reactions', flarum_components_AdminLinkButton__WEBPACK_IMPORTED_MODULE_2___default.a.component({
      href: app.route('fof-reactions'),
      icon: 'fa fa-heart',
      children: 'Reactions',
      description: app.translator.trans('fof-reactions.admin.nav.desc')
    }));
  });
});

/***/ }),

/***/ "./src/admin/components/SettingsPage.js":
/*!**********************************************!*\
  !*** ./src/admin/components/SettingsPage.js ***!
  \**********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return SettingsPage; });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var flarum_components_Alert__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/components/Alert */ "flarum/components/Alert");
/* harmony import */ var flarum_components_Alert__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_components_Alert__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_components_Button__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/components/Button */ "flarum/components/Button");
/* harmony import */ var flarum_components_Button__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_components_Button__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _common_util_emoji__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../common/util/emoji */ "./src/common/util/emoji.js");
/* harmony import */ var flarum_components_Page__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! flarum/components/Page */ "flarum/components/Page");
/* harmony import */ var flarum_components_Page__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(flarum_components_Page__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var flarum_components_Select__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! flarum/components/Select */ "flarum/components/Select");
/* harmony import */ var flarum_components_Select__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(flarum_components_Select__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var flarum_utils_saveSettings__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! flarum/utils/saveSettings */ "flarum/utils/saveSettings");
/* harmony import */ var flarum_utils_saveSettings__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(flarum_utils_saveSettings__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var flarum_components_Switch__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! flarum/components/Switch */ "flarum/components/Switch");
/* harmony import */ var flarum_components_Switch__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(flarum_components_Switch__WEBPACK_IMPORTED_MODULE_7__);









var SettingsPage = /*#__PURE__*/function (_Page) {
  Object(_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(SettingsPage, _Page);

  function SettingsPage() {
    return _Page.apply(this, arguments) || this;
  }

  var _proto = SettingsPage.prototype;

  _proto.init = function init() {
    var _this = this;

    this.fields = ['convertToUpvote', 'convertToDownvote', 'convertToLike'];
    this.values = {};
    this.reactions = app.forum.reactions();
    this.settingsPrefix = 'fof-reactions';
    var settings = app.data.settings;
    this.newReaction = {
      identifier: m.prop(''),
      type: m.prop('emoji')
    };
    this.fields.forEach(function (key) {
      return _this.values[key] = m.prop(settings[_this.addPrefix(key)]);
    });
  }
  /**
   * @returns {*}
   */
  ;

  _proto.view = function view() {
    var _this2 = this;

    return m("div", {
      className: "SettingsPage--reactions"
    }, m("div", {
      className: "container"
    }, m("form", {
      onsubmit: this.onsubmit.bind(this)
    }, m("fieldset", null, m("legend", null, app.translator.trans('fof-reactions.admin.page.reactions.title')), m("label", null, app.translator.trans('fof-reactions.admin.page.reactions.reactions')), m("div", {
      style: "margin-bottom: -10px",
      className: "helpText"
    }, app.translator.trans('fof-reactions.admin.page.reactions.Helptext')), m("br", null), m("div", {
      className: "Reactions--Container"
    }, this.reactions.map(function (reaction) {
      var spanClass = reaction.type() === 'icon' && "fa fa-" + reaction.identifier() + " Reactions-demo";
      var data = Object(_common_util_emoji__WEBPACK_IMPORTED_MODULE_3__["default"])(reaction.identifier());
      var demos = [];

      if (reaction.type() === 'icon') {
        demos.push(m("i", {
          className: spanClass,
          "aria-hidden": true
        }, "\xA0"));
      }

      if (reaction.type === 'emoji' && data.uc || data.uc) {
        demos.push(m("img", {
          alt: reaction.identifier(),
          className: "Reactions-demo",
          draggable: "false",
          style: reaction.type() !== 'emoji' && 'opacity: 0.5;',
          src: data.url,
          width: "30px"
        }));
      }

      return [m("div", {
        className: "Reactions--item"
      }, m("input", {
        className: "FormControl Reactions-input",
        value: reaction.display() || '',
        placeholder: app.translator.trans('fof-reactions.admin.page.reactions.help.display'),
        oninput: m.withAttr('value', function (val) {
          return _this2.update(reaction, 'display', val);
        })
      }), m("input", {
        className: "FormControl Reactions-input",
        type: "text",
        value: reaction.identifier(),
        placeholder: app.translator.trans('fof-reactions.admin.page.reactions.help.identifier'),
        oninput: m.withAttr('value', function (val) {
          return _this2.update(reaction, 'identifier', val);
        })
      }), flarum_components_Select__WEBPACK_IMPORTED_MODULE_5___default.a.component({
        options: {
          emoji: 'emoji',
          icon: 'icon'
        },
        value: reaction.type(),
        onchange: function onchange(val) {
          return _this2.update(reaction, 'type', val);
        }
      }), flarum_components_Switch__WEBPACK_IMPORTED_MODULE_7___default.a.component({
        className: 'Reactions-switch',
        state: reaction.enabled(),
        onchange: function onchange(val) {
          return _this2.update(reaction, 'enabled', val);
        }
      }), flarum_components_Button__WEBPACK_IMPORTED_MODULE_2___default.a.component({
        type: 'button',
        className: 'Button Button--warning Reactions-button',
        icon: 'fa fa-times',
        onclick: _this2.deleteReaction.bind(_this2, reaction)
      }), m("div", {
        className: "Reactions-demo"
      }, demos))];
    }), m("br", null), m("div", {
      className: "Reactions--item"
    }, m("input", {
      className: "FormControl Reactions-input",
      type: "text",
      placeholder: app.translator.trans('fof-reactions.admin.page.reactions.help.identifier'),
      oninput: m.withAttr('value', this.newReaction.identifier)
    }), flarum_components_Select__WEBPACK_IMPORTED_MODULE_5___default.a.component({
      options: {
        emoji: 'emoji',
        icon: 'icon'
      },
      value: this.newReaction.type(),
      onchange: this.newReaction.type
    }), flarum_components_Button__WEBPACK_IMPORTED_MODULE_2___default.a.component({
      type: 'button',
      className: 'Button Button--warning Reactions-button',
      icon: 'fa fa-plus',
      onclick: this.addReaction.bind(this)
    }), this.newReaction.type() === 'icon' ? m("i", {
      className: this.newReaction.type() === 'icon' && "fa fa-" + this.newReaction.identifier() + " Reactions-demo",
      "aria-hidden": true
    }, "\xA0") : '', Object(_common_util_emoji__WEBPACK_IMPORTED_MODULE_3__["default"])(this.newReaction.identifier()).uc ? m("img", {
      alt: this.newReaction.identifier(),
      className: "Reactions-demo",
      draggable: "false",
      style: this.newReaction.type() !== 'emoji' && 'opacity: 0.5;',
      src: Object(_common_util_emoji__WEBPACK_IMPORTED_MODULE_3__["default"])(this.newReaction.identifier()).url,
      width: "30px"
    }) : ''))), m("fieldset", null, m("div", {
      className: "Reaction-settings"
    }, this.isEnabled('fof-gamification') || this.isEnabled('flarum-likes') ? m("legend", null, app.translator.trans('fof-reactions.admin.page.settings.integrations.legend')) : '', this.isEnabled('fof-gamification') ? m("div", null, m("legend", null, app.translator.trans('fof-reactions.admin.page.settings.integrations.gamification.legend')), m("label", null, app.translator.trans('fof-reactions.admin.page.settings.integrations.gamification.upvoteLabel')), m("div", {
      className: "helpText"
    }, app.translator.trans('fof-reactions.admin.page.settings.integrations.gamification.upvoteHelptext')), m("input", {
      className: "FormControl reactions-settings-input",
      value: this.values.convertToUpvote() || '',
      placeholder: "thumbsup",
      oninput: m.withAttr('value', this.values.convertToUpvote)
    }), m("label", null, app.translator.trans('fof-reactions.admin.page.settings.integrations.gamification.downvoteLabel')), m("div", {
      className: "helpText"
    }, app.translator.trans('fof-reactions.admin.page.settings.integrations.gamification.downvoteHelptext')), m("input", {
      className: "FormControl reactions-settings-input",
      value: this.values.convertToDownvote() || '',
      placeholder: "thumbsdown",
      oninput: m.withAttr('value', this.values.convertToDownvote)
    })) : '', this.isEnabled('flarum-likes') ? m("div", null, m("legend", null, app.translator.trans('fof-reactions.admin.page.settings.integrations.likes.legend')), m("label", null, app.translator.trans('fof-reactions.admin.page.settings.integrations.likes.Label')), m("div", {
      className: "helpText"
    }, app.translator.trans('fof-reactions.admin.page.settings.integrations.likes.Helptext')), m("input", {
      className: "FormControl reactions-settings-input",
      value: this.values.convertToLike() || '',
      placeholder: "thumbsup",
      oninput: m.withAttr('value', this.values.convertToLike)
    })) : ''), this.values.convertToUpvote() && this.values.convertToLike() ? m("h3", {
      className: "Reactions-warning"
    }, app.translator.trans('fof-reactions.admin.page.settings.integrations.warning')) : '', flarum_components_Button__WEBPACK_IMPORTED_MODULE_2___default.a.component({
      type: 'submit',
      className: 'Button Button--primary',
      children: app.translator.trans('fof-reactions.admin.page.settings.save_settings', {
        strong: m("strong", null)
      }),
      loading: this.loading,
      disabled: !this.changed()
    })))));
  }
  /**
   * @returns boolean
   */
  ;

  _proto.changed = function changed() {
    var _this3 = this;

    var fieldsCheck = this.fields.some(function (key) {
      return _this3.values[key]() !== app.data.settings[_this3.addPrefix(key)];
    });
    return fieldsCheck;
  };

  _proto.addReaction = function addReaction() {
    var reaction = app.store.createRecord('reactions');
    reaction.save({
      identifier: this.newReaction.identifier(),
      type: this.newReaction.type()
    });
    this.reactions.push(reaction);
    this.newReaction.identifier('');
    this.newReaction.type('icon');
  };

  _proto.update = function update(reaction, key, value) {
    var _data;

    app.request({
      method: 'PATCH',
      url: app.forum.attribute('apiUrl') + "/reactions/" + reaction.id(),
      data: (_data = {}, _data[key] = value, _data)
    });
    this.reactions.some(function (r, i) {
      if (r.id() === reaction.id()) {
        reaction[key] = m.prop(value);
        return true;
      }
    });
  };

  _proto.deleteReaction = function deleteReaction(reactionToDelete) {
    var _this4 = this;

    app.request({
      method: 'DELETE',
      url: app.forum.attribute('apiUrl') + "/reactions/" + reactionToDelete.id()
    });
    this.reactions.some(function (reaction, i) {
      if (reaction.id() === reactionToDelete.id()) {
        _this4.reactions.splice(i, 1);

        return true;
      }
    });
  };

  _proto.onsubmit = function onsubmit(e) {
    var _this5 = this;

    // prevent the usual form submit behaviour
    e.preventDefault(); // if the page is already saving, do nothing

    if (this.loading) return; // prevents multiple savings

    this.loading = true; // remove previous success popup

    app.alerts.dismiss(this.successAlert);
    var settings = {}; // gets all the values from the form

    this.fields.forEach(function (key) {
      return settings[_this5.addPrefix(key)] = _this5.values[key]();
    }); // actually saves everything in the database

    flarum_utils_saveSettings__WEBPACK_IMPORTED_MODULE_6___default()(settings).then(function () {
      // on success, show popup
      app.alerts.show(_this5.successAlert = new flarum_components_Alert__WEBPACK_IMPORTED_MODULE_1___default.a({
        type: 'success',
        children: app.translator.trans('core.admin.basics.saved_message')
      }));
    })["catch"](function () {}).then(function () {
      // return to the initial state and redraw the page
      _this5.loading = false;
      m.redraw();
    });
  };

  _proto.isEnabled = function isEnabled(name) {
    var enabled = JSON.parse(app.data.settings.extensions_enabled);
    return enabled.indexOf(name) !== -1;
  }
  /**
   * @returns string
   */
  ;

  _proto.addPrefix = function addPrefix(key) {
    return this.settingsPrefix + "." + key;
  };

  return SettingsPage;
}(flarum_components_Page__WEBPACK_IMPORTED_MODULE_4___default.a);



/***/ }),

/***/ "./src/admin/index.js":
/*!****************************!*\
  !*** ./src/admin/index.js ***!
  \****************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var flarum_extend__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/extend */ "flarum/extend");
/* harmony import */ var flarum_extend__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_extend__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var flarum_app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/app */ "flarum/app");
/* harmony import */ var flarum_app__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_app__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_models_Forum__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/models/Forum */ "flarum/models/Forum");
/* harmony import */ var flarum_models_Forum__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_models_Forum__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_Model__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/Model */ "flarum/Model");
/* harmony import */ var flarum_Model__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_Model__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var flarum_components_PermissionGrid__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! flarum/components/PermissionGrid */ "flarum/components/PermissionGrid");
/* harmony import */ var flarum_components_PermissionGrid__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(flarum_components_PermissionGrid__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _addSettingsPage__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./addSettingsPage */ "./src/admin/addSettingsPage.js");
/* harmony import */ var _common_models_Reaction__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../common/models/Reaction */ "./src/common/models/Reaction.js");







flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.initializers.add('fof/reactions', function () {
  flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.store.models.reactions = _common_models_Reaction__WEBPACK_IMPORTED_MODULE_6__["default"];
  flarum_models_Forum__WEBPACK_IMPORTED_MODULE_2___default.a.prototype.reactions = flarum_Model__WEBPACK_IMPORTED_MODULE_3___default.a.hasMany('reactions');
  Object(flarum_extend__WEBPACK_IMPORTED_MODULE_0__["extend"])(flarum_components_PermissionGrid__WEBPACK_IMPORTED_MODULE_4___default.a.prototype, 'replyItems', function (items) {
    items.add('reactPosts', {
      icon: 'far fa-thumbs-up',
      label: flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.translator.trans('fof-reactions.admin.permissions.react_posts_label'),
      permission: 'discussion.reactPosts'
    });
  });
  Object(flarum_extend__WEBPACK_IMPORTED_MODULE_0__["extend"])(flarum_components_PermissionGrid__WEBPACK_IMPORTED_MODULE_4___default.a.prototype, 'viewItems', function (items) {
    items.add('canSeeReactions', {
      icon: 'fas fa-info-circle',
      label: flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.translator.trans('fof-reactions.admin.permissions.see_reactions_label'),
      permission: 'post.canSeeReactions'
    });
  });
  Object(_addSettingsPage__WEBPACK_IMPORTED_MODULE_5__["default"])();
});

/***/ }),

/***/ "./src/common/index.js":
/*!*****************************!*\
  !*** ./src/common/index.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {



/***/ }),

/***/ "./src/common/models/Reaction.js":
/*!***************************************!*\
  !*** ./src/common/models/Reaction.js ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Reaction; });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var flarum_Model__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/Model */ "flarum/Model");
/* harmony import */ var flarum_Model__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_Model__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_utils_mixin__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/utils/mixin */ "flarum/utils/mixin");
/* harmony import */ var flarum_utils_mixin__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_utils_mixin__WEBPACK_IMPORTED_MODULE_2__);




var Reaction = /*#__PURE__*/function (_mixin) {
  Object(_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(Reaction, _mixin);

  function Reaction() {
    return _mixin.apply(this, arguments) || this;
  }

  return Reaction;
}(flarum_utils_mixin__WEBPACK_IMPORTED_MODULE_2___default()(flarum_Model__WEBPACK_IMPORTED_MODULE_1___default.a, {
  identifier: flarum_Model__WEBPACK_IMPORTED_MODULE_1___default.a.attribute('identifier'),
  display: flarum_Model__WEBPACK_IMPORTED_MODULE_1___default.a.attribute('display'),
  type: flarum_Model__WEBPACK_IMPORTED_MODULE_1___default.a.attribute('type'),
  user_id: flarum_Model__WEBPACK_IMPORTED_MODULE_1___default.a.attribute('user_id'),
  post_id: flarum_Model__WEBPACK_IMPORTED_MODULE_1___default.a.attribute('post_id'),
  enabled: flarum_Model__WEBPACK_IMPORTED_MODULE_1___default.a.attribute('enabled')
}));



/***/ }),

/***/ "./src/common/util/emoji.js":
/*!**********************************!*\
  !*** ./src/common/util/emoji.js ***!
  \**********************************/
/*! exports provided: Match, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Match", function() { return Match; });
/* harmony import */ var simple_emoji_map__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! simple-emoji-map */ "./node_modules/simple-emoji-map/index.mjs");


var flatten = function flatten(arr, depth) {
  if (depth === void 0) {
    depth = 1;
  }

  return arr.reduce(function (a, v) {
    return a.concat(depth > 1 && Array.isArray(v) ? flatten(v, depth - 1) : v);
  }, []);
};

var shortnames = flatten(Object.values(simple_emoji_map__WEBPACK_IMPORTED_MODULE_0__["default"]));
var entries = Object.entries(simple_emoji_map__WEBPACK_IMPORTED_MODULE_0__["default"]);

var getEmoji = function getEmoji(identifier) {
  return entries.find(function (_ref) {
    var value = _ref[1];
    return value.includes(identifier);
  });
};

var toUnicodeEmoji = function toUnicodeEmoji(codePoint) {
  return String.fromCodePoint.apply(String, codePoint.split('-').map(function (e) {
    return "0x" + e;
  }));
};

var Match =
/**
 * Match
 * Creates a new `Match` instance.
 *
 * It contains the following properties:
 *
 *  - `input` (String): The input string.
 *  - `score` (Number): A number between `0` and `1`. The closer to `1` it is, the better match it is.
 *  - `emoji` (Object): The emoji object.
 *  - `emoji_name` (String): The emoji name.
 *
 * @name Match
 * @function
 * @param {String} input The input string (just a word).
 */
function Match(input) {
  var r = simple_emoji_map__WEBPACK_IMPORTED_MODULE_0__["default"][input],
      finalScore = -1,
      emojiName = null;

  if (r) {
    finalScore = 1;
    emojiName = input;
  } else {
    Object.entries(simple_emoji_map__WEBPACK_IMPORTED_MODULE_0__["default"]).forEach(function (_ref2) {
      var n = _ref2[0],
          e = _ref2[1];

      for (var i = 0; i <= e.length; ++i) {
        var c = e[i] || n,
            equals = c === input,
            indexF = c.indexOf(input),
            indexS = input.indexOf(c),
            score = equals && input.length ? 1 : indexF === 0 || indexS === 0 && c.length > 1 ? 1 : indexF > 0 || indexS > 0 ? 0 : -1;

        if (score > finalScore) {
          emojiName = n;
          finalScore = score;

          if (score === 1) {
            return false;
          }
        }
      }
    });
  }

  this.score = finalScore;
  this.emoji = emojiName;
};
var emojiCache = new Map();
/* harmony default export */ __webpack_exports__["default"] = (function (reactionOrIdentifier) {
  if (!reactionOrIdentifier) return {};
  var identifier = reactionOrIdentifier.identifier || reactionOrIdentifier;
  var codePoint;
  if (emojiCache.has(identifier)) return emojiCache.get(identifier);

  if (shortnames.includes(identifier)) {
    var emoji = getEmoji(identifier);
    codePoint = emoji && emoji[0];
  } else {
    var match = new Match(identifier);
    if (match.score) codePoint = match.emoji;
  }

  if (codePoint) {
    codePoint = codePoint.split('-')[0];
  }

  var output = codePoint ? {
    identifier: identifier,
    uc: toUnicodeEmoji(codePoint),
    url: "//cdn.jsdelivr.net/gh/twitter/twemoji@12/assets/72x72/" + codePoint + ".png",
    type: 'emoji'
  } : {};
  emojiCache.set(reactionOrIdentifier, output);
  return output || {};
});

/***/ }),

/***/ "flarum/Model":
/*!**********************************************!*\
  !*** external "flarum.core.compat['Model']" ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['Model'];

/***/ }),

/***/ "flarum/app":
/*!********************************************!*\
  !*** external "flarum.core.compat['app']" ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['app'];

/***/ }),

/***/ "flarum/components/AdminLinkButton":
/*!*******************************************************************!*\
  !*** external "flarum.core.compat['components/AdminLinkButton']" ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['components/AdminLinkButton'];

/***/ }),

/***/ "flarum/components/AdminNav":
/*!************************************************************!*\
  !*** external "flarum.core.compat['components/AdminNav']" ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['components/AdminNav'];

/***/ }),

/***/ "flarum/components/Alert":
/*!*********************************************************!*\
  !*** external "flarum.core.compat['components/Alert']" ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['components/Alert'];

/***/ }),

/***/ "flarum/components/Button":
/*!**********************************************************!*\
  !*** external "flarum.core.compat['components/Button']" ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['components/Button'];

/***/ }),

/***/ "flarum/components/Page":
/*!********************************************************!*\
  !*** external "flarum.core.compat['components/Page']" ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['components/Page'];

/***/ }),

/***/ "flarum/components/PermissionGrid":
/*!******************************************************************!*\
  !*** external "flarum.core.compat['components/PermissionGrid']" ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['components/PermissionGrid'];

/***/ }),

/***/ "flarum/components/Select":
/*!**********************************************************!*\
  !*** external "flarum.core.compat['components/Select']" ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['components/Select'];

/***/ }),

/***/ "flarum/components/Switch":
/*!**********************************************************!*\
  !*** external "flarum.core.compat['components/Switch']" ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['components/Switch'];

/***/ }),

/***/ "flarum/extend":
/*!***********************************************!*\
  !*** external "flarum.core.compat['extend']" ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['extend'];

/***/ }),

/***/ "flarum/models/Forum":
/*!*****************************************************!*\
  !*** external "flarum.core.compat['models/Forum']" ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['models/Forum'];

/***/ }),

/***/ "flarum/utils/mixin":
/*!****************************************************!*\
  !*** external "flarum.core.compat['utils/mixin']" ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['utils/mixin'];

/***/ }),

/***/ "flarum/utils/saveSettings":
/*!***********************************************************!*\
  !*** external "flarum.core.compat['utils/saveSettings']" ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['utils/saveSettings'];

/***/ })

/******/ });
//# sourceMappingURL=admin.js.map