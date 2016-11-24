(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
//! moment.js
//! version : 2.16.0
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com

;(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    global.moment = factory()
}(this, (function () { 'use strict';

var hookCallback;

function hooks () {
    return hookCallback.apply(null, arguments);
}

// This is done to register the method called with moment()
// without creating circular dependencies.
function setHookCallback (callback) {
    hookCallback = callback;
}

function isArray(input) {
    return input instanceof Array || Object.prototype.toString.call(input) === '[object Array]';
}

function isObject(input) {
    // IE8 will treat undefined and null as object if it wasn't for
    // input != null
    return input != null && Object.prototype.toString.call(input) === '[object Object]';
}

function isObjectEmpty(obj) {
    var k;
    for (k in obj) {
        // even if its not own property I'd still call it non-empty
        return false;
    }
    return true;
}

function isNumber(input) {
    return typeof value === 'number' || Object.prototype.toString.call(input) === '[object Number]';
}

function isDate(input) {
    return input instanceof Date || Object.prototype.toString.call(input) === '[object Date]';
}

function map(arr, fn) {
    var res = [], i;
    for (i = 0; i < arr.length; ++i) {
        res.push(fn(arr[i], i));
    }
    return res;
}

function hasOwnProp(a, b) {
    return Object.prototype.hasOwnProperty.call(a, b);
}

function extend(a, b) {
    for (var i in b) {
        if (hasOwnProp(b, i)) {
            a[i] = b[i];
        }
    }

    if (hasOwnProp(b, 'toString')) {
        a.toString = b.toString;
    }

    if (hasOwnProp(b, 'valueOf')) {
        a.valueOf = b.valueOf;
    }

    return a;
}

function createUTC (input, format, locale, strict) {
    return createLocalOrUTC(input, format, locale, strict, true).utc();
}

function defaultParsingFlags() {
    // We need to deep clone this object.
    return {
        empty           : false,
        unusedTokens    : [],
        unusedInput     : [],
        overflow        : -2,
        charsLeftOver   : 0,
        nullInput       : false,
        invalidMonth    : null,
        invalidFormat   : false,
        userInvalidated : false,
        iso             : false,
        parsedDateParts : [],
        meridiem        : null
    };
}

function getParsingFlags(m) {
    if (m._pf == null) {
        m._pf = defaultParsingFlags();
    }
    return m._pf;
}

var some;
if (Array.prototype.some) {
    some = Array.prototype.some;
} else {
    some = function (fun) {
        var t = Object(this);
        var len = t.length >>> 0;

        for (var i = 0; i < len; i++) {
            if (i in t && fun.call(this, t[i], i, t)) {
                return true;
            }
        }

        return false;
    };
}

var some$1 = some;

function isValid(m) {
    if (m._isValid == null) {
        var flags = getParsingFlags(m);
        var parsedParts = some$1.call(flags.parsedDateParts, function (i) {
            return i != null;
        });
        var isNowValid = !isNaN(m._d.getTime()) &&
            flags.overflow < 0 &&
            !flags.empty &&
            !flags.invalidMonth &&
            !flags.invalidWeekday &&
            !flags.nullInput &&
            !flags.invalidFormat &&
            !flags.userInvalidated &&
            (!flags.meridiem || (flags.meridiem && parsedParts));

        if (m._strict) {
            isNowValid = isNowValid &&
                flags.charsLeftOver === 0 &&
                flags.unusedTokens.length === 0 &&
                flags.bigHour === undefined;
        }

        if (Object.isFrozen == null || !Object.isFrozen(m)) {
            m._isValid = isNowValid;
        }
        else {
            return isNowValid;
        }
    }
    return m._isValid;
}

function createInvalid (flags) {
    var m = createUTC(NaN);
    if (flags != null) {
        extend(getParsingFlags(m), flags);
    }
    else {
        getParsingFlags(m).userInvalidated = true;
    }

    return m;
}

function isUndefined(input) {
    return input === void 0;
}

// Plugins that add properties should also add the key here (null value),
// so we can properly clone ourselves.
var momentProperties = hooks.momentProperties = [];

function copyConfig(to, from) {
    var i, prop, val;

    if (!isUndefined(from._isAMomentObject)) {
        to._isAMomentObject = from._isAMomentObject;
    }
    if (!isUndefined(from._i)) {
        to._i = from._i;
    }
    if (!isUndefined(from._f)) {
        to._f = from._f;
    }
    if (!isUndefined(from._l)) {
        to._l = from._l;
    }
    if (!isUndefined(from._strict)) {
        to._strict = from._strict;
    }
    if (!isUndefined(from._tzm)) {
        to._tzm = from._tzm;
    }
    if (!isUndefined(from._isUTC)) {
        to._isUTC = from._isUTC;
    }
    if (!isUndefined(from._offset)) {
        to._offset = from._offset;
    }
    if (!isUndefined(from._pf)) {
        to._pf = getParsingFlags(from);
    }
    if (!isUndefined(from._locale)) {
        to._locale = from._locale;
    }

    if (momentProperties.length > 0) {
        for (i in momentProperties) {
            prop = momentProperties[i];
            val = from[prop];
            if (!isUndefined(val)) {
                to[prop] = val;
            }
        }
    }

    return to;
}

var updateInProgress = false;

// Moment prototype object
function Moment(config) {
    copyConfig(this, config);
    this._d = new Date(config._d != null ? config._d.getTime() : NaN);
    // Prevent infinite loop in case updateOffset creates new moment
    // objects.
    if (updateInProgress === false) {
        updateInProgress = true;
        hooks.updateOffset(this);
        updateInProgress = false;
    }
}

function isMoment (obj) {
    return obj instanceof Moment || (obj != null && obj._isAMomentObject != null);
}

function absFloor (number) {
    if (number < 0) {
        // -0 -> 0
        return Math.ceil(number) || 0;
    } else {
        return Math.floor(number);
    }
}

function toInt(argumentForCoercion) {
    var coercedNumber = +argumentForCoercion,
        value = 0;

    if (coercedNumber !== 0 && isFinite(coercedNumber)) {
        value = absFloor(coercedNumber);
    }

    return value;
}

// compare two arrays, return the number of differences
function compareArrays(array1, array2, dontConvert) {
    var len = Math.min(array1.length, array2.length),
        lengthDiff = Math.abs(array1.length - array2.length),
        diffs = 0,
        i;
    for (i = 0; i < len; i++) {
        if ((dontConvert && array1[i] !== array2[i]) ||
            (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))) {
            diffs++;
        }
    }
    return diffs + lengthDiff;
}

function warn(msg) {
    if (hooks.suppressDeprecationWarnings === false &&
            (typeof console !==  'undefined') && console.warn) {
        console.warn('Deprecation warning: ' + msg);
    }
}

function deprecate(msg, fn) {
    var firstTime = true;

    return extend(function () {
        if (hooks.deprecationHandler != null) {
            hooks.deprecationHandler(null, msg);
        }
        if (firstTime) {
            var args = [];
            var arg;
            for (var i = 0; i < arguments.length; i++) {
                arg = '';
                if (typeof arguments[i] === 'object') {
                    arg += '\n[' + i + '] ';
                    for (var key in arguments[0]) {
                        arg += key + ': ' + arguments[0][key] + ', ';
                    }
                    arg = arg.slice(0, -2); // Remove trailing comma and space
                } else {
                    arg = arguments[i];
                }
                args.push(arg);
            }
            warn(msg + '\nArguments: ' + Array.prototype.slice.call(args).join('') + '\n' + (new Error()).stack);
            firstTime = false;
        }
        return fn.apply(this, arguments);
    }, fn);
}

var deprecations = {};

function deprecateSimple(name, msg) {
    if (hooks.deprecationHandler != null) {
        hooks.deprecationHandler(name, msg);
    }
    if (!deprecations[name]) {
        warn(msg);
        deprecations[name] = true;
    }
}

hooks.suppressDeprecationWarnings = false;
hooks.deprecationHandler = null;

function isFunction(input) {
    return input instanceof Function || Object.prototype.toString.call(input) === '[object Function]';
}

function set (config) {
    var prop, i;
    for (i in config) {
        prop = config[i];
        if (isFunction(prop)) {
            this[i] = prop;
        } else {
            this['_' + i] = prop;
        }
    }
    this._config = config;
    // Lenient ordinal parsing accepts just a number in addition to
    // number + (possibly) stuff coming from _ordinalParseLenient.
    this._ordinalParseLenient = new RegExp(this._ordinalParse.source + '|' + (/\d{1,2}/).source);
}

function mergeConfigs(parentConfig, childConfig) {
    var res = extend({}, parentConfig), prop;
    for (prop in childConfig) {
        if (hasOwnProp(childConfig, prop)) {
            if (isObject(parentConfig[prop]) && isObject(childConfig[prop])) {
                res[prop] = {};
                extend(res[prop], parentConfig[prop]);
                extend(res[prop], childConfig[prop]);
            } else if (childConfig[prop] != null) {
                res[prop] = childConfig[prop];
            } else {
                delete res[prop];
            }
        }
    }
    for (prop in parentConfig) {
        if (hasOwnProp(parentConfig, prop) &&
                !hasOwnProp(childConfig, prop) &&
                isObject(parentConfig[prop])) {
            // make sure changes to properties don't modify parent config
            res[prop] = extend({}, res[prop]);
        }
    }
    return res;
}

function Locale(config) {
    if (config != null) {
        this.set(config);
    }
}

var keys;

if (Object.keys) {
    keys = Object.keys;
} else {
    keys = function (obj) {
        var i, res = [];
        for (i in obj) {
            if (hasOwnProp(obj, i)) {
                res.push(i);
            }
        }
        return res;
    };
}

var keys$1 = keys;

var defaultCalendar = {
    sameDay : '[Today at] LT',
    nextDay : '[Tomorrow at] LT',
    nextWeek : 'dddd [at] LT',
    lastDay : '[Yesterday at] LT',
    lastWeek : '[Last] dddd [at] LT',
    sameElse : 'L'
};

function calendar (key, mom, now) {
    var output = this._calendar[key] || this._calendar['sameElse'];
    return isFunction(output) ? output.call(mom, now) : output;
}

var defaultLongDateFormat = {
    LTS  : 'h:mm:ss A',
    LT   : 'h:mm A',
    L    : 'MM/DD/YYYY',
    LL   : 'MMMM D, YYYY',
    LLL  : 'MMMM D, YYYY h:mm A',
    LLLL : 'dddd, MMMM D, YYYY h:mm A'
};

function longDateFormat (key) {
    var format = this._longDateFormat[key],
        formatUpper = this._longDateFormat[key.toUpperCase()];

    if (format || !formatUpper) {
        return format;
    }

    this._longDateFormat[key] = formatUpper.replace(/MMMM|MM|DD|dddd/g, function (val) {
        return val.slice(1);
    });

    return this._longDateFormat[key];
}

var defaultInvalidDate = 'Invalid date';

function invalidDate () {
    return this._invalidDate;
}

var defaultOrdinal = '%d';
var defaultOrdinalParse = /\d{1,2}/;

function ordinal (number) {
    return this._ordinal.replace('%d', number);
}

var defaultRelativeTime = {
    future : 'in %s',
    past   : '%s ago',
    s  : 'a few seconds',
    m  : 'a minute',
    mm : '%d minutes',
    h  : 'an hour',
    hh : '%d hours',
    d  : 'a day',
    dd : '%d days',
    M  : 'a month',
    MM : '%d months',
    y  : 'a year',
    yy : '%d years'
};

function relativeTime (number, withoutSuffix, string, isFuture) {
    var output = this._relativeTime[string];
    return (isFunction(output)) ?
        output(number, withoutSuffix, string, isFuture) :
        output.replace(/%d/i, number);
}

function pastFuture (diff, output) {
    var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
    return isFunction(format) ? format(output) : format.replace(/%s/i, output);
}

var aliases = {};

function addUnitAlias (unit, shorthand) {
    var lowerCase = unit.toLowerCase();
    aliases[lowerCase] = aliases[lowerCase + 's'] = aliases[shorthand] = unit;
}

function normalizeUnits(units) {
    return typeof units === 'string' ? aliases[units] || aliases[units.toLowerCase()] : undefined;
}

function normalizeObjectUnits(inputObject) {
    var normalizedInput = {},
        normalizedProp,
        prop;

    for (prop in inputObject) {
        if (hasOwnProp(inputObject, prop)) {
            normalizedProp = normalizeUnits(prop);
            if (normalizedProp) {
                normalizedInput[normalizedProp] = inputObject[prop];
            }
        }
    }

    return normalizedInput;
}

var priorities = {};

function addUnitPriority(unit, priority) {
    priorities[unit] = priority;
}

function getPrioritizedUnits(unitsObj) {
    var units = [];
    for (var u in unitsObj) {
        units.push({unit: u, priority: priorities[u]});
    }
    units.sort(function (a, b) {
        return a.priority - b.priority;
    });
    return units;
}

function makeGetSet (unit, keepTime) {
    return function (value) {
        if (value != null) {
            set$1(this, unit, value);
            hooks.updateOffset(this, keepTime);
            return this;
        } else {
            return get(this, unit);
        }
    };
}

function get (mom, unit) {
    return mom.isValid() ?
        mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]() : NaN;
}

function set$1 (mom, unit, value) {
    if (mom.isValid()) {
        mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);
    }
}

// MOMENTS

function stringGet (units) {
    units = normalizeUnits(units);
    if (isFunction(this[units])) {
        return this[units]();
    }
    return this;
}


function stringSet (units, value) {
    if (typeof units === 'object') {
        units = normalizeObjectUnits(units);
        var prioritized = getPrioritizedUnits(units);
        for (var i = 0; i < prioritized.length; i++) {
            this[prioritized[i].unit](units[prioritized[i].unit]);
        }
    } else {
        units = normalizeUnits(units);
        if (isFunction(this[units])) {
            return this[units](value);
        }
    }
    return this;
}

function zeroFill(number, targetLength, forceSign) {
    var absNumber = '' + Math.abs(number),
        zerosToFill = targetLength - absNumber.length,
        sign = number >= 0;
    return (sign ? (forceSign ? '+' : '') : '-') +
        Math.pow(10, Math.max(0, zerosToFill)).toString().substr(1) + absNumber;
}

var formattingTokens = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g;

var localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g;

var formatFunctions = {};

var formatTokenFunctions = {};

// token:    'M'
// padded:   ['MM', 2]
// ordinal:  'Mo'
// callback: function () { this.month() + 1 }
function addFormatToken (token, padded, ordinal, callback) {
    var func = callback;
    if (typeof callback === 'string') {
        func = function () {
            return this[callback]();
        };
    }
    if (token) {
        formatTokenFunctions[token] = func;
    }
    if (padded) {
        formatTokenFunctions[padded[0]] = function () {
            return zeroFill(func.apply(this, arguments), padded[1], padded[2]);
        };
    }
    if (ordinal) {
        formatTokenFunctions[ordinal] = function () {
            return this.localeData().ordinal(func.apply(this, arguments), token);
        };
    }
}

function removeFormattingTokens(input) {
    if (input.match(/\[[\s\S]/)) {
        return input.replace(/^\[|\]$/g, '');
    }
    return input.replace(/\\/g, '');
}

function makeFormatFunction(format) {
    var array = format.match(formattingTokens), i, length;

    for (i = 0, length = array.length; i < length; i++) {
        if (formatTokenFunctions[array[i]]) {
            array[i] = formatTokenFunctions[array[i]];
        } else {
            array[i] = removeFormattingTokens(array[i]);
        }
    }

    return function (mom) {
        var output = '', i;
        for (i = 0; i < length; i++) {
            output += array[i] instanceof Function ? array[i].call(mom, format) : array[i];
        }
        return output;
    };
}

// format date using native date object
function formatMoment(m, format) {
    if (!m.isValid()) {
        return m.localeData().invalidDate();
    }

    format = expandFormat(format, m.localeData());
    formatFunctions[format] = formatFunctions[format] || makeFormatFunction(format);

    return formatFunctions[format](m);
}

function expandFormat(format, locale) {
    var i = 5;

    function replaceLongDateFormatTokens(input) {
        return locale.longDateFormat(input) || input;
    }

    localFormattingTokens.lastIndex = 0;
    while (i >= 0 && localFormattingTokens.test(format)) {
        format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
        localFormattingTokens.lastIndex = 0;
        i -= 1;
    }

    return format;
}

var match1         = /\d/;            //       0 - 9
var match2         = /\d\d/;          //      00 - 99
var match3         = /\d{3}/;         //     000 - 999
var match4         = /\d{4}/;         //    0000 - 9999
var match6         = /[+-]?\d{6}/;    // -999999 - 999999
var match1to2      = /\d\d?/;         //       0 - 99
var match3to4      = /\d\d\d\d?/;     //     999 - 9999
var match5to6      = /\d\d\d\d\d\d?/; //   99999 - 999999
var match1to3      = /\d{1,3}/;       //       0 - 999
var match1to4      = /\d{1,4}/;       //       0 - 9999
var match1to6      = /[+-]?\d{1,6}/;  // -999999 - 999999

var matchUnsigned  = /\d+/;           //       0 - inf
var matchSigned    = /[+-]?\d+/;      //    -inf - inf

var matchOffset    = /Z|[+-]\d\d:?\d\d/gi; // +00:00 -00:00 +0000 -0000 or Z
var matchShortOffset = /Z|[+-]\d\d(?::?\d\d)?/gi; // +00 -00 +00:00 -00:00 +0000 -0000 or Z

var matchTimestamp = /[+-]?\d+(\.\d{1,3})?/; // 123456789 123456789.123

// any word (or two) characters or numbers including two/three word month in arabic.
// includes scottish gaelic two word and hyphenated months
var matchWord = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i;


var regexes = {};

function addRegexToken (token, regex, strictRegex) {
    regexes[token] = isFunction(regex) ? regex : function (isStrict, localeData) {
        return (isStrict && strictRegex) ? strictRegex : regex;
    };
}

function getParseRegexForToken (token, config) {
    if (!hasOwnProp(regexes, token)) {
        return new RegExp(unescapeFormat(token));
    }

    return regexes[token](config._strict, config._locale);
}

// Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
function unescapeFormat(s) {
    return regexEscape(s.replace('\\', '').replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (matched, p1, p2, p3, p4) {
        return p1 || p2 || p3 || p4;
    }));
}

function regexEscape(s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

var tokens = {};

function addParseToken (token, callback) {
    var i, func = callback;
    if (typeof token === 'string') {
        token = [token];
    }
    if (isNumber(callback)) {
        func = function (input, array) {
            array[callback] = toInt(input);
        };
    }
    for (i = 0; i < token.length; i++) {
        tokens[token[i]] = func;
    }
}

function addWeekParseToken (token, callback) {
    addParseToken(token, function (input, array, config, token) {
        config._w = config._w || {};
        callback(input, config._w, config, token);
    });
}

function addTimeToArrayFromToken(token, input, config) {
    if (input != null && hasOwnProp(tokens, token)) {
        tokens[token](input, config._a, config, token);
    }
}

var YEAR = 0;
var MONTH = 1;
var DATE = 2;
var HOUR = 3;
var MINUTE = 4;
var SECOND = 5;
var MILLISECOND = 6;
var WEEK = 7;
var WEEKDAY = 8;

var indexOf;

if (Array.prototype.indexOf) {
    indexOf = Array.prototype.indexOf;
} else {
    indexOf = function (o) {
        // I know
        var i;
        for (i = 0; i < this.length; ++i) {
            if (this[i] === o) {
                return i;
            }
        }
        return -1;
    };
}

var indexOf$1 = indexOf;

function daysInMonth(year, month) {
    return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
}

// FORMATTING

addFormatToken('M', ['MM', 2], 'Mo', function () {
    return this.month() + 1;
});

addFormatToken('MMM', 0, 0, function (format) {
    return this.localeData().monthsShort(this, format);
});

addFormatToken('MMMM', 0, 0, function (format) {
    return this.localeData().months(this, format);
});

// ALIASES

addUnitAlias('month', 'M');

// PRIORITY

addUnitPriority('month', 8);

// PARSING

addRegexToken('M',    match1to2);
addRegexToken('MM',   match1to2, match2);
addRegexToken('MMM',  function (isStrict, locale) {
    return locale.monthsShortRegex(isStrict);
});
addRegexToken('MMMM', function (isStrict, locale) {
    return locale.monthsRegex(isStrict);
});

addParseToken(['M', 'MM'], function (input, array) {
    array[MONTH] = toInt(input) - 1;
});

addParseToken(['MMM', 'MMMM'], function (input, array, config, token) {
    var month = config._locale.monthsParse(input, token, config._strict);
    // if we didn't find a month name, mark the date as invalid.
    if (month != null) {
        array[MONTH] = month;
    } else {
        getParsingFlags(config).invalidMonth = input;
    }
});

// LOCALES

var MONTHS_IN_FORMAT = /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/;
var defaultLocaleMonths = 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_');
function localeMonths (m, format) {
    if (!m) {
        return this._months;
    }
    return isArray(this._months) ? this._months[m.month()] :
        this._months[(this._months.isFormat || MONTHS_IN_FORMAT).test(format) ? 'format' : 'standalone'][m.month()];
}

var defaultLocaleMonthsShort = 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_');
function localeMonthsShort (m, format) {
    if (!m) {
        return this._monthsShort;
    }
    return isArray(this._monthsShort) ? this._monthsShort[m.month()] :
        this._monthsShort[MONTHS_IN_FORMAT.test(format) ? 'format' : 'standalone'][m.month()];
}

function handleStrictParse(monthName, format, strict) {
    var i, ii, mom, llc = monthName.toLocaleLowerCase();
    if (!this._monthsParse) {
        // this is not used
        this._monthsParse = [];
        this._longMonthsParse = [];
        this._shortMonthsParse = [];
        for (i = 0; i < 12; ++i) {
            mom = createUTC([2000, i]);
            this._shortMonthsParse[i] = this.monthsShort(mom, '').toLocaleLowerCase();
            this._longMonthsParse[i] = this.months(mom, '').toLocaleLowerCase();
        }
    }

    if (strict) {
        if (format === 'MMM') {
            ii = indexOf$1.call(this._shortMonthsParse, llc);
            return ii !== -1 ? ii : null;
        } else {
            ii = indexOf$1.call(this._longMonthsParse, llc);
            return ii !== -1 ? ii : null;
        }
    } else {
        if (format === 'MMM') {
            ii = indexOf$1.call(this._shortMonthsParse, llc);
            if (ii !== -1) {
                return ii;
            }
            ii = indexOf$1.call(this._longMonthsParse, llc);
            return ii !== -1 ? ii : null;
        } else {
            ii = indexOf$1.call(this._longMonthsParse, llc);
            if (ii !== -1) {
                return ii;
            }
            ii = indexOf$1.call(this._shortMonthsParse, llc);
            return ii !== -1 ? ii : null;
        }
    }
}

function localeMonthsParse (monthName, format, strict) {
    var i, mom, regex;

    if (this._monthsParseExact) {
        return handleStrictParse.call(this, monthName, format, strict);
    }

    if (!this._monthsParse) {
        this._monthsParse = [];
        this._longMonthsParse = [];
        this._shortMonthsParse = [];
    }

    // TODO: add sorting
    // Sorting makes sure if one month (or abbr) is a prefix of another
    // see sorting in computeMonthsParse
    for (i = 0; i < 12; i++) {
        // make the regex if we don't have it already
        mom = createUTC([2000, i]);
        if (strict && !this._longMonthsParse[i]) {
            this._longMonthsParse[i] = new RegExp('^' + this.months(mom, '').replace('.', '') + '$', 'i');
            this._shortMonthsParse[i] = new RegExp('^' + this.monthsShort(mom, '').replace('.', '') + '$', 'i');
        }
        if (!strict && !this._monthsParse[i]) {
            regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
            this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
        }
        // test the regex
        if (strict && format === 'MMMM' && this._longMonthsParse[i].test(monthName)) {
            return i;
        } else if (strict && format === 'MMM' && this._shortMonthsParse[i].test(monthName)) {
            return i;
        } else if (!strict && this._monthsParse[i].test(monthName)) {
            return i;
        }
    }
}

// MOMENTS

function setMonth (mom, value) {
    var dayOfMonth;

    if (!mom.isValid()) {
        // No op
        return mom;
    }

    if (typeof value === 'string') {
        if (/^\d+$/.test(value)) {
            value = toInt(value);
        } else {
            value = mom.localeData().monthsParse(value);
            // TODO: Another silent failure?
            if (!isNumber(value)) {
                return mom;
            }
        }
    }

    dayOfMonth = Math.min(mom.date(), daysInMonth(mom.year(), value));
    mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);
    return mom;
}

function getSetMonth (value) {
    if (value != null) {
        setMonth(this, value);
        hooks.updateOffset(this, true);
        return this;
    } else {
        return get(this, 'Month');
    }
}

function getDaysInMonth () {
    return daysInMonth(this.year(), this.month());
}

var defaultMonthsShortRegex = matchWord;
function monthsShortRegex (isStrict) {
    if (this._monthsParseExact) {
        if (!hasOwnProp(this, '_monthsRegex')) {
            computeMonthsParse.call(this);
        }
        if (isStrict) {
            return this._monthsShortStrictRegex;
        } else {
            return this._monthsShortRegex;
        }
    } else {
        if (!hasOwnProp(this, '_monthsShortRegex')) {
            this._monthsShortRegex = defaultMonthsShortRegex;
        }
        return this._monthsShortStrictRegex && isStrict ?
            this._monthsShortStrictRegex : this._monthsShortRegex;
    }
}

var defaultMonthsRegex = matchWord;
function monthsRegex (isStrict) {
    if (this._monthsParseExact) {
        if (!hasOwnProp(this, '_monthsRegex')) {
            computeMonthsParse.call(this);
        }
        if (isStrict) {
            return this._monthsStrictRegex;
        } else {
            return this._monthsRegex;
        }
    } else {
        if (!hasOwnProp(this, '_monthsRegex')) {
            this._monthsRegex = defaultMonthsRegex;
        }
        return this._monthsStrictRegex && isStrict ?
            this._monthsStrictRegex : this._monthsRegex;
    }
}

function computeMonthsParse () {
    function cmpLenRev(a, b) {
        return b.length - a.length;
    }

    var shortPieces = [], longPieces = [], mixedPieces = [],
        i, mom;
    for (i = 0; i < 12; i++) {
        // make the regex if we don't have it already
        mom = createUTC([2000, i]);
        shortPieces.push(this.monthsShort(mom, ''));
        longPieces.push(this.months(mom, ''));
        mixedPieces.push(this.months(mom, ''));
        mixedPieces.push(this.monthsShort(mom, ''));
    }
    // Sorting makes sure if one month (or abbr) is a prefix of another it
    // will match the longer piece.
    shortPieces.sort(cmpLenRev);
    longPieces.sort(cmpLenRev);
    mixedPieces.sort(cmpLenRev);
    for (i = 0; i < 12; i++) {
        shortPieces[i] = regexEscape(shortPieces[i]);
        longPieces[i] = regexEscape(longPieces[i]);
    }
    for (i = 0; i < 24; i++) {
        mixedPieces[i] = regexEscape(mixedPieces[i]);
    }

    this._monthsRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
    this._monthsShortRegex = this._monthsRegex;
    this._monthsStrictRegex = new RegExp('^(' + longPieces.join('|') + ')', 'i');
    this._monthsShortStrictRegex = new RegExp('^(' + shortPieces.join('|') + ')', 'i');
}

// FORMATTING

addFormatToken('Y', 0, 0, function () {
    var y = this.year();
    return y <= 9999 ? '' + y : '+' + y;
});

addFormatToken(0, ['YY', 2], 0, function () {
    return this.year() % 100;
});

addFormatToken(0, ['YYYY',   4],       0, 'year');
addFormatToken(0, ['YYYYY',  5],       0, 'year');
addFormatToken(0, ['YYYYYY', 6, true], 0, 'year');

// ALIASES

addUnitAlias('year', 'y');

// PRIORITIES

addUnitPriority('year', 1);

// PARSING

addRegexToken('Y',      matchSigned);
addRegexToken('YY',     match1to2, match2);
addRegexToken('YYYY',   match1to4, match4);
addRegexToken('YYYYY',  match1to6, match6);
addRegexToken('YYYYYY', match1to6, match6);

addParseToken(['YYYYY', 'YYYYYY'], YEAR);
addParseToken('YYYY', function (input, array) {
    array[YEAR] = input.length === 2 ? hooks.parseTwoDigitYear(input) : toInt(input);
});
addParseToken('YY', function (input, array) {
    array[YEAR] = hooks.parseTwoDigitYear(input);
});
addParseToken('Y', function (input, array) {
    array[YEAR] = parseInt(input, 10);
});

// HELPERS

function daysInYear(year) {
    return isLeapYear(year) ? 366 : 365;
}

function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

// HOOKS

hooks.parseTwoDigitYear = function (input) {
    return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
};

// MOMENTS

var getSetYear = makeGetSet('FullYear', true);

function getIsLeapYear () {
    return isLeapYear(this.year());
}

function createDate (y, m, d, h, M, s, ms) {
    //can't just apply() to create a date:
    //http://stackoverflow.com/questions/181348/instantiating-a-javascript-object-by-calling-prototype-constructor-apply
    var date = new Date(y, m, d, h, M, s, ms);

    //the date constructor remaps years 0-99 to 1900-1999
    if (y < 100 && y >= 0 && isFinite(date.getFullYear())) {
        date.setFullYear(y);
    }
    return date;
}

function createUTCDate (y) {
    var date = new Date(Date.UTC.apply(null, arguments));

    //the Date.UTC function remaps years 0-99 to 1900-1999
    if (y < 100 && y >= 0 && isFinite(date.getUTCFullYear())) {
        date.setUTCFullYear(y);
    }
    return date;
}

// start-of-first-week - start-of-year
function firstWeekOffset(year, dow, doy) {
    var // first-week day -- which january is always in the first week (4 for iso, 1 for other)
        fwd = 7 + dow - doy,
        // first-week day local weekday -- which local weekday is fwd
        fwdlw = (7 + createUTCDate(year, 0, fwd).getUTCDay() - dow) % 7;

    return -fwdlw + fwd - 1;
}

//http://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
function dayOfYearFromWeeks(year, week, weekday, dow, doy) {
    var localWeekday = (7 + weekday - dow) % 7,
        weekOffset = firstWeekOffset(year, dow, doy),
        dayOfYear = 1 + 7 * (week - 1) + localWeekday + weekOffset,
        resYear, resDayOfYear;

    if (dayOfYear <= 0) {
        resYear = year - 1;
        resDayOfYear = daysInYear(resYear) + dayOfYear;
    } else if (dayOfYear > daysInYear(year)) {
        resYear = year + 1;
        resDayOfYear = dayOfYear - daysInYear(year);
    } else {
        resYear = year;
        resDayOfYear = dayOfYear;
    }

    return {
        year: resYear,
        dayOfYear: resDayOfYear
    };
}

function weekOfYear(mom, dow, doy) {
    var weekOffset = firstWeekOffset(mom.year(), dow, doy),
        week = Math.floor((mom.dayOfYear() - weekOffset - 1) / 7) + 1,
        resWeek, resYear;

    if (week < 1) {
        resYear = mom.year() - 1;
        resWeek = week + weeksInYear(resYear, dow, doy);
    } else if (week > weeksInYear(mom.year(), dow, doy)) {
        resWeek = week - weeksInYear(mom.year(), dow, doy);
        resYear = mom.year() + 1;
    } else {
        resYear = mom.year();
        resWeek = week;
    }

    return {
        week: resWeek,
        year: resYear
    };
}

function weeksInYear(year, dow, doy) {
    var weekOffset = firstWeekOffset(year, dow, doy),
        weekOffsetNext = firstWeekOffset(year + 1, dow, doy);
    return (daysInYear(year) - weekOffset + weekOffsetNext) / 7;
}

// FORMATTING

addFormatToken('w', ['ww', 2], 'wo', 'week');
addFormatToken('W', ['WW', 2], 'Wo', 'isoWeek');

// ALIASES

addUnitAlias('week', 'w');
addUnitAlias('isoWeek', 'W');

// PRIORITIES

addUnitPriority('week', 5);
addUnitPriority('isoWeek', 5);

// PARSING

addRegexToken('w',  match1to2);
addRegexToken('ww', match1to2, match2);
addRegexToken('W',  match1to2);
addRegexToken('WW', match1to2, match2);

addWeekParseToken(['w', 'ww', 'W', 'WW'], function (input, week, config, token) {
    week[token.substr(0, 1)] = toInt(input);
});

// HELPERS

// LOCALES

function localeWeek (mom) {
    return weekOfYear(mom, this._week.dow, this._week.doy).week;
}

var defaultLocaleWeek = {
    dow : 0, // Sunday is the first day of the week.
    doy : 6  // The week that contains Jan 1st is the first week of the year.
};

function localeFirstDayOfWeek () {
    return this._week.dow;
}

function localeFirstDayOfYear () {
    return this._week.doy;
}

// MOMENTS

function getSetWeek (input) {
    var week = this.localeData().week(this);
    return input == null ? week : this.add((input - week) * 7, 'd');
}

function getSetISOWeek (input) {
    var week = weekOfYear(this, 1, 4).week;
    return input == null ? week : this.add((input - week) * 7, 'd');
}

// FORMATTING

addFormatToken('d', 0, 'do', 'day');

addFormatToken('dd', 0, 0, function (format) {
    return this.localeData().weekdaysMin(this, format);
});

addFormatToken('ddd', 0, 0, function (format) {
    return this.localeData().weekdaysShort(this, format);
});

addFormatToken('dddd', 0, 0, function (format) {
    return this.localeData().weekdays(this, format);
});

addFormatToken('e', 0, 0, 'weekday');
addFormatToken('E', 0, 0, 'isoWeekday');

// ALIASES

addUnitAlias('day', 'd');
addUnitAlias('weekday', 'e');
addUnitAlias('isoWeekday', 'E');

// PRIORITY
addUnitPriority('day', 11);
addUnitPriority('weekday', 11);
addUnitPriority('isoWeekday', 11);

// PARSING

addRegexToken('d',    match1to2);
addRegexToken('e',    match1to2);
addRegexToken('E',    match1to2);
addRegexToken('dd',   function (isStrict, locale) {
    return locale.weekdaysMinRegex(isStrict);
});
addRegexToken('ddd',   function (isStrict, locale) {
    return locale.weekdaysShortRegex(isStrict);
});
addRegexToken('dddd',   function (isStrict, locale) {
    return locale.weekdaysRegex(isStrict);
});

addWeekParseToken(['dd', 'ddd', 'dddd'], function (input, week, config, token) {
    var weekday = config._locale.weekdaysParse(input, token, config._strict);
    // if we didn't get a weekday name, mark the date as invalid
    if (weekday != null) {
        week.d = weekday;
    } else {
        getParsingFlags(config).invalidWeekday = input;
    }
});

addWeekParseToken(['d', 'e', 'E'], function (input, week, config, token) {
    week[token] = toInt(input);
});

// HELPERS

function parseWeekday(input, locale) {
    if (typeof input !== 'string') {
        return input;
    }

    if (!isNaN(input)) {
        return parseInt(input, 10);
    }

    input = locale.weekdaysParse(input);
    if (typeof input === 'number') {
        return input;
    }

    return null;
}

function parseIsoWeekday(input, locale) {
    if (typeof input === 'string') {
        return locale.weekdaysParse(input) % 7 || 7;
    }
    return isNaN(input) ? null : input;
}

// LOCALES

var defaultLocaleWeekdays = 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_');
function localeWeekdays (m, format) {
    if (!m) {
        return this._weekdays;
    }
    return isArray(this._weekdays) ? this._weekdays[m.day()] :
        this._weekdays[this._weekdays.isFormat.test(format) ? 'format' : 'standalone'][m.day()];
}

var defaultLocaleWeekdaysShort = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_');
function localeWeekdaysShort (m) {
    return (m) ? this._weekdaysShort[m.day()] : this._weekdaysShort;
}

var defaultLocaleWeekdaysMin = 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_');
function localeWeekdaysMin (m) {
    return (m) ? this._weekdaysMin[m.day()] : this._weekdaysMin;
}

function handleStrictParse$1(weekdayName, format, strict) {
    var i, ii, mom, llc = weekdayName.toLocaleLowerCase();
    if (!this._weekdaysParse) {
        this._weekdaysParse = [];
        this._shortWeekdaysParse = [];
        this._minWeekdaysParse = [];

        for (i = 0; i < 7; ++i) {
            mom = createUTC([2000, 1]).day(i);
            this._minWeekdaysParse[i] = this.weekdaysMin(mom, '').toLocaleLowerCase();
            this._shortWeekdaysParse[i] = this.weekdaysShort(mom, '').toLocaleLowerCase();
            this._weekdaysParse[i] = this.weekdays(mom, '').toLocaleLowerCase();
        }
    }

    if (strict) {
        if (format === 'dddd') {
            ii = indexOf$1.call(this._weekdaysParse, llc);
            return ii !== -1 ? ii : null;
        } else if (format === 'ddd') {
            ii = indexOf$1.call(this._shortWeekdaysParse, llc);
            return ii !== -1 ? ii : null;
        } else {
            ii = indexOf$1.call(this._minWeekdaysParse, llc);
            return ii !== -1 ? ii : null;
        }
    } else {
        if (format === 'dddd') {
            ii = indexOf$1.call(this._weekdaysParse, llc);
            if (ii !== -1) {
                return ii;
            }
            ii = indexOf$1.call(this._shortWeekdaysParse, llc);
            if (ii !== -1) {
                return ii;
            }
            ii = indexOf$1.call(this._minWeekdaysParse, llc);
            return ii !== -1 ? ii : null;
        } else if (format === 'ddd') {
            ii = indexOf$1.call(this._shortWeekdaysParse, llc);
            if (ii !== -1) {
                return ii;
            }
            ii = indexOf$1.call(this._weekdaysParse, llc);
            if (ii !== -1) {
                return ii;
            }
            ii = indexOf$1.call(this._minWeekdaysParse, llc);
            return ii !== -1 ? ii : null;
        } else {
            ii = indexOf$1.call(this._minWeekdaysParse, llc);
            if (ii !== -1) {
                return ii;
            }
            ii = indexOf$1.call(this._weekdaysParse, llc);
            if (ii !== -1) {
                return ii;
            }
            ii = indexOf$1.call(this._shortWeekdaysParse, llc);
            return ii !== -1 ? ii : null;
        }
    }
}

function localeWeekdaysParse (weekdayName, format, strict) {
    var i, mom, regex;

    if (this._weekdaysParseExact) {
        return handleStrictParse$1.call(this, weekdayName, format, strict);
    }

    if (!this._weekdaysParse) {
        this._weekdaysParse = [];
        this._minWeekdaysParse = [];
        this._shortWeekdaysParse = [];
        this._fullWeekdaysParse = [];
    }

    for (i = 0; i < 7; i++) {
        // make the regex if we don't have it already

        mom = createUTC([2000, 1]).day(i);
        if (strict && !this._fullWeekdaysParse[i]) {
            this._fullWeekdaysParse[i] = new RegExp('^' + this.weekdays(mom, '').replace('.', '\.?') + '$', 'i');
            this._shortWeekdaysParse[i] = new RegExp('^' + this.weekdaysShort(mom, '').replace('.', '\.?') + '$', 'i');
            this._minWeekdaysParse[i] = new RegExp('^' + this.weekdaysMin(mom, '').replace('.', '\.?') + '$', 'i');
        }
        if (!this._weekdaysParse[i]) {
            regex = '^' + this.weekdays(mom, '') + '|^' + this.weekdaysShort(mom, '') + '|^' + this.weekdaysMin(mom, '');
            this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
        }
        // test the regex
        if (strict && format === 'dddd' && this._fullWeekdaysParse[i].test(weekdayName)) {
            return i;
        } else if (strict && format === 'ddd' && this._shortWeekdaysParse[i].test(weekdayName)) {
            return i;
        } else if (strict && format === 'dd' && this._minWeekdaysParse[i].test(weekdayName)) {
            return i;
        } else if (!strict && this._weekdaysParse[i].test(weekdayName)) {
            return i;
        }
    }
}

// MOMENTS

function getSetDayOfWeek (input) {
    if (!this.isValid()) {
        return input != null ? this : NaN;
    }
    var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
    if (input != null) {
        input = parseWeekday(input, this.localeData());
        return this.add(input - day, 'd');
    } else {
        return day;
    }
}

function getSetLocaleDayOfWeek (input) {
    if (!this.isValid()) {
        return input != null ? this : NaN;
    }
    var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
    return input == null ? weekday : this.add(input - weekday, 'd');
}

function getSetISODayOfWeek (input) {
    if (!this.isValid()) {
        return input != null ? this : NaN;
    }

    // behaves the same as moment#day except
    // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
    // as a setter, sunday should belong to the previous week.

    if (input != null) {
        var weekday = parseIsoWeekday(input, this.localeData());
        return this.day(this.day() % 7 ? weekday : weekday - 7);
    } else {
        return this.day() || 7;
    }
}

var defaultWeekdaysRegex = matchWord;
function weekdaysRegex (isStrict) {
    if (this._weekdaysParseExact) {
        if (!hasOwnProp(this, '_weekdaysRegex')) {
            computeWeekdaysParse.call(this);
        }
        if (isStrict) {
            return this._weekdaysStrictRegex;
        } else {
            return this._weekdaysRegex;
        }
    } else {
        if (!hasOwnProp(this, '_weekdaysRegex')) {
            this._weekdaysRegex = defaultWeekdaysRegex;
        }
        return this._weekdaysStrictRegex && isStrict ?
            this._weekdaysStrictRegex : this._weekdaysRegex;
    }
}

var defaultWeekdaysShortRegex = matchWord;
function weekdaysShortRegex (isStrict) {
    if (this._weekdaysParseExact) {
        if (!hasOwnProp(this, '_weekdaysRegex')) {
            computeWeekdaysParse.call(this);
        }
        if (isStrict) {
            return this._weekdaysShortStrictRegex;
        } else {
            return this._weekdaysShortRegex;
        }
    } else {
        if (!hasOwnProp(this, '_weekdaysShortRegex')) {
            this._weekdaysShortRegex = defaultWeekdaysShortRegex;
        }
        return this._weekdaysShortStrictRegex && isStrict ?
            this._weekdaysShortStrictRegex : this._weekdaysShortRegex;
    }
}

var defaultWeekdaysMinRegex = matchWord;
function weekdaysMinRegex (isStrict) {
    if (this._weekdaysParseExact) {
        if (!hasOwnProp(this, '_weekdaysRegex')) {
            computeWeekdaysParse.call(this);
        }
        if (isStrict) {
            return this._weekdaysMinStrictRegex;
        } else {
            return this._weekdaysMinRegex;
        }
    } else {
        if (!hasOwnProp(this, '_weekdaysMinRegex')) {
            this._weekdaysMinRegex = defaultWeekdaysMinRegex;
        }
        return this._weekdaysMinStrictRegex && isStrict ?
            this._weekdaysMinStrictRegex : this._weekdaysMinRegex;
    }
}


function computeWeekdaysParse () {
    function cmpLenRev(a, b) {
        return b.length - a.length;
    }

    var minPieces = [], shortPieces = [], longPieces = [], mixedPieces = [],
        i, mom, minp, shortp, longp;
    for (i = 0; i < 7; i++) {
        // make the regex if we don't have it already
        mom = createUTC([2000, 1]).day(i);
        minp = this.weekdaysMin(mom, '');
        shortp = this.weekdaysShort(mom, '');
        longp = this.weekdays(mom, '');
        minPieces.push(minp);
        shortPieces.push(shortp);
        longPieces.push(longp);
        mixedPieces.push(minp);
        mixedPieces.push(shortp);
        mixedPieces.push(longp);
    }
    // Sorting makes sure if one weekday (or abbr) is a prefix of another it
    // will match the longer piece.
    minPieces.sort(cmpLenRev);
    shortPieces.sort(cmpLenRev);
    longPieces.sort(cmpLenRev);
    mixedPieces.sort(cmpLenRev);
    for (i = 0; i < 7; i++) {
        shortPieces[i] = regexEscape(shortPieces[i]);
        longPieces[i] = regexEscape(longPieces[i]);
        mixedPieces[i] = regexEscape(mixedPieces[i]);
    }

    this._weekdaysRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
    this._weekdaysShortRegex = this._weekdaysRegex;
    this._weekdaysMinRegex = this._weekdaysRegex;

    this._weekdaysStrictRegex = new RegExp('^(' + longPieces.join('|') + ')', 'i');
    this._weekdaysShortStrictRegex = new RegExp('^(' + shortPieces.join('|') + ')', 'i');
    this._weekdaysMinStrictRegex = new RegExp('^(' + minPieces.join('|') + ')', 'i');
}

// FORMATTING

function hFormat() {
    return this.hours() % 12 || 12;
}

function kFormat() {
    return this.hours() || 24;
}

addFormatToken('H', ['HH', 2], 0, 'hour');
addFormatToken('h', ['hh', 2], 0, hFormat);
addFormatToken('k', ['kk', 2], 0, kFormat);

addFormatToken('hmm', 0, 0, function () {
    return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2);
});

addFormatToken('hmmss', 0, 0, function () {
    return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2) +
        zeroFill(this.seconds(), 2);
});

addFormatToken('Hmm', 0, 0, function () {
    return '' + this.hours() + zeroFill(this.minutes(), 2);
});

addFormatToken('Hmmss', 0, 0, function () {
    return '' + this.hours() + zeroFill(this.minutes(), 2) +
        zeroFill(this.seconds(), 2);
});

function meridiem (token, lowercase) {
    addFormatToken(token, 0, 0, function () {
        return this.localeData().meridiem(this.hours(), this.minutes(), lowercase);
    });
}

meridiem('a', true);
meridiem('A', false);

// ALIASES

addUnitAlias('hour', 'h');

// PRIORITY
addUnitPriority('hour', 13);

// PARSING

function matchMeridiem (isStrict, locale) {
    return locale._meridiemParse;
}

addRegexToken('a',  matchMeridiem);
addRegexToken('A',  matchMeridiem);
addRegexToken('H',  match1to2);
addRegexToken('h',  match1to2);
addRegexToken('HH', match1to2, match2);
addRegexToken('hh', match1to2, match2);

addRegexToken('hmm', match3to4);
addRegexToken('hmmss', match5to6);
addRegexToken('Hmm', match3to4);
addRegexToken('Hmmss', match5to6);

addParseToken(['H', 'HH'], HOUR);
addParseToken(['a', 'A'], function (input, array, config) {
    config._isPm = config._locale.isPM(input);
    config._meridiem = input;
});
addParseToken(['h', 'hh'], function (input, array, config) {
    array[HOUR] = toInt(input);
    getParsingFlags(config).bigHour = true;
});
addParseToken('hmm', function (input, array, config) {
    var pos = input.length - 2;
    array[HOUR] = toInt(input.substr(0, pos));
    array[MINUTE] = toInt(input.substr(pos));
    getParsingFlags(config).bigHour = true;
});
addParseToken('hmmss', function (input, array, config) {
    var pos1 = input.length - 4;
    var pos2 = input.length - 2;
    array[HOUR] = toInt(input.substr(0, pos1));
    array[MINUTE] = toInt(input.substr(pos1, 2));
    array[SECOND] = toInt(input.substr(pos2));
    getParsingFlags(config).bigHour = true;
});
addParseToken('Hmm', function (input, array, config) {
    var pos = input.length - 2;
    array[HOUR] = toInt(input.substr(0, pos));
    array[MINUTE] = toInt(input.substr(pos));
});
addParseToken('Hmmss', function (input, array, config) {
    var pos1 = input.length - 4;
    var pos2 = input.length - 2;
    array[HOUR] = toInt(input.substr(0, pos1));
    array[MINUTE] = toInt(input.substr(pos1, 2));
    array[SECOND] = toInt(input.substr(pos2));
});

// LOCALES

function localeIsPM (input) {
    // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
    // Using charAt should be more compatible.
    return ((input + '').toLowerCase().charAt(0) === 'p');
}

var defaultLocaleMeridiemParse = /[ap]\.?m?\.?/i;
function localeMeridiem (hours, minutes, isLower) {
    if (hours > 11) {
        return isLower ? 'pm' : 'PM';
    } else {
        return isLower ? 'am' : 'AM';
    }
}


// MOMENTS

// Setting the hour should keep the time, because the user explicitly
// specified which hour he wants. So trying to maintain the same hour (in
// a new timezone) makes sense. Adding/subtracting hours does not follow
// this rule.
var getSetHour = makeGetSet('Hours', true);

// months
// week
// weekdays
// meridiem
var baseConfig = {
    calendar: defaultCalendar,
    longDateFormat: defaultLongDateFormat,
    invalidDate: defaultInvalidDate,
    ordinal: defaultOrdinal,
    ordinalParse: defaultOrdinalParse,
    relativeTime: defaultRelativeTime,

    months: defaultLocaleMonths,
    monthsShort: defaultLocaleMonthsShort,

    week: defaultLocaleWeek,

    weekdays: defaultLocaleWeekdays,
    weekdaysMin: defaultLocaleWeekdaysMin,
    weekdaysShort: defaultLocaleWeekdaysShort,

    meridiemParse: defaultLocaleMeridiemParse
};

// internal storage for locale config files
var locales = {};
var localeFamilies = {};
var globalLocale;

function normalizeLocale(key) {
    return key ? key.toLowerCase().replace('_', '-') : key;
}

// pick the locale from the array
// try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
// substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
function chooseLocale(names) {
    var i = 0, j, next, locale, split;

    while (i < names.length) {
        split = normalizeLocale(names[i]).split('-');
        j = split.length;
        next = normalizeLocale(names[i + 1]);
        next = next ? next.split('-') : null;
        while (j > 0) {
            locale = loadLocale(split.slice(0, j).join('-'));
            if (locale) {
                return locale;
            }
            if (next && next.length >= j && compareArrays(split, next, true) >= j - 1) {
                //the next array item is better than a shallower substring of this one
                break;
            }
            j--;
        }
        i++;
    }
    return null;
}

function loadLocale(name) {
    var oldLocale = null;
    // TODO: Find a better way to register and load all the locales in Node
    if (!locales[name] && (typeof module !== 'undefined') &&
            module && module.exports) {
        try {
            oldLocale = globalLocale._abbr;
            require('./locale/' + name);
            // because defineLocale currently also sets the global locale, we
            // want to undo that for lazy loaded locales
            getSetGlobalLocale(oldLocale);
        } catch (e) { }
    }
    return locales[name];
}

// This function will load locale and then set the global locale.  If
// no arguments are passed in, it will simply return the current global
// locale key.
function getSetGlobalLocale (key, values) {
    var data;
    if (key) {
        if (isUndefined(values)) {
            data = getLocale(key);
        }
        else {
            data = defineLocale(key, values);
        }

        if (data) {
            // moment.duration._locale = moment._locale = data;
            globalLocale = data;
        }
    }

    return globalLocale._abbr;
}

function defineLocale (name, config) {
    if (config !== null) {
        var parentConfig = baseConfig;
        config.abbr = name;
        if (locales[name] != null) {
            deprecateSimple('defineLocaleOverride',
                    'use moment.updateLocale(localeName, config) to change ' +
                    'an existing locale. moment.defineLocale(localeName, ' +
                    'config) should only be used for creating a new locale ' +
                    'See http://momentjs.com/guides/#/warnings/define-locale/ for more info.');
            parentConfig = locales[name]._config;
        } else if (config.parentLocale != null) {
            if (locales[config.parentLocale] != null) {
                parentConfig = locales[config.parentLocale]._config;
            } else {
                if (!localeFamilies[config.parentLocale]) {
                    localeFamilies[config.parentLocale] = [];
                }
                localeFamilies[config.parentLocale].push({
                    name: name,
                    config: config
                });
                return null;
            }
        }
        locales[name] = new Locale(mergeConfigs(parentConfig, config));

        if (localeFamilies[name]) {
            localeFamilies[name].forEach(function (x) {
                defineLocale(x.name, x.config);
            });
        }

        // backwards compat for now: also set the locale
        // make sure we set the locale AFTER all child locales have been
        // created, so we won't end up with the child locale set.
        getSetGlobalLocale(name);


        return locales[name];
    } else {
        // useful for testing
        delete locales[name];
        return null;
    }
}

function updateLocale(name, config) {
    if (config != null) {
        var locale, parentConfig = baseConfig;
        // MERGE
        if (locales[name] != null) {
            parentConfig = locales[name]._config;
        }
        config = mergeConfigs(parentConfig, config);
        locale = new Locale(config);
        locale.parentLocale = locales[name];
        locales[name] = locale;

        // backwards compat for now: also set the locale
        getSetGlobalLocale(name);
    } else {
        // pass null for config to unupdate, useful for tests
        if (locales[name] != null) {
            if (locales[name].parentLocale != null) {
                locales[name] = locales[name].parentLocale;
            } else if (locales[name] != null) {
                delete locales[name];
            }
        }
    }
    return locales[name];
}

// returns locale data
function getLocale (key) {
    var locale;

    if (key && key._locale && key._locale._abbr) {
        key = key._locale._abbr;
    }

    if (!key) {
        return globalLocale;
    }

    if (!isArray(key)) {
        //short-circuit everything else
        locale = loadLocale(key);
        if (locale) {
            return locale;
        }
        key = [key];
    }

    return chooseLocale(key);
}

function listLocales() {
    return keys$1(locales);
}

function checkOverflow (m) {
    var overflow;
    var a = m._a;

    if (a && getParsingFlags(m).overflow === -2) {
        overflow =
            a[MONTH]       < 0 || a[MONTH]       > 11  ? MONTH :
            a[DATE]        < 1 || a[DATE]        > daysInMonth(a[YEAR], a[MONTH]) ? DATE :
            a[HOUR]        < 0 || a[HOUR]        > 24 || (a[HOUR] === 24 && (a[MINUTE] !== 0 || a[SECOND] !== 0 || a[MILLISECOND] !== 0)) ? HOUR :
            a[MINUTE]      < 0 || a[MINUTE]      > 59  ? MINUTE :
            a[SECOND]      < 0 || a[SECOND]      > 59  ? SECOND :
            a[MILLISECOND] < 0 || a[MILLISECOND] > 999 ? MILLISECOND :
            -1;

        if (getParsingFlags(m)._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {
            overflow = DATE;
        }
        if (getParsingFlags(m)._overflowWeeks && overflow === -1) {
            overflow = WEEK;
        }
        if (getParsingFlags(m)._overflowWeekday && overflow === -1) {
            overflow = WEEKDAY;
        }

        getParsingFlags(m).overflow = overflow;
    }

    return m;
}

// iso 8601 regex
// 0000-00-00 0000-W00 or 0000-W00-0 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000 or +00)
var extendedIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/;
var basicIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/;

var tzRegex = /Z|[+-]\d\d(?::?\d\d)?/;

var isoDates = [
    ['YYYYYY-MM-DD', /[+-]\d{6}-\d\d-\d\d/],
    ['YYYY-MM-DD', /\d{4}-\d\d-\d\d/],
    ['GGGG-[W]WW-E', /\d{4}-W\d\d-\d/],
    ['GGGG-[W]WW', /\d{4}-W\d\d/, false],
    ['YYYY-DDD', /\d{4}-\d{3}/],
    ['YYYY-MM', /\d{4}-\d\d/, false],
    ['YYYYYYMMDD', /[+-]\d{10}/],
    ['YYYYMMDD', /\d{8}/],
    // YYYYMM is NOT allowed by the standard
    ['GGGG[W]WWE', /\d{4}W\d{3}/],
    ['GGGG[W]WW', /\d{4}W\d{2}/, false],
    ['YYYYDDD', /\d{7}/]
];

// iso time formats and regexes
var isoTimes = [
    ['HH:mm:ss.SSSS', /\d\d:\d\d:\d\d\.\d+/],
    ['HH:mm:ss,SSSS', /\d\d:\d\d:\d\d,\d+/],
    ['HH:mm:ss', /\d\d:\d\d:\d\d/],
    ['HH:mm', /\d\d:\d\d/],
    ['HHmmss.SSSS', /\d\d\d\d\d\d\.\d+/],
    ['HHmmss,SSSS', /\d\d\d\d\d\d,\d+/],
    ['HHmmss', /\d\d\d\d\d\d/],
    ['HHmm', /\d\d\d\d/],
    ['HH', /\d\d/]
];

var aspNetJsonRegex = /^\/?Date\((\-?\d+)/i;

// date from iso format
function configFromISO(config) {
    var i, l,
        string = config._i,
        match = extendedIsoRegex.exec(string) || basicIsoRegex.exec(string),
        allowTime, dateFormat, timeFormat, tzFormat;

    if (match) {
        getParsingFlags(config).iso = true;

        for (i = 0, l = isoDates.length; i < l; i++) {
            if (isoDates[i][1].exec(match[1])) {
                dateFormat = isoDates[i][0];
                allowTime = isoDates[i][2] !== false;
                break;
            }
        }
        if (dateFormat == null) {
            config._isValid = false;
            return;
        }
        if (match[3]) {
            for (i = 0, l = isoTimes.length; i < l; i++) {
                if (isoTimes[i][1].exec(match[3])) {
                    // match[2] should be 'T' or space
                    timeFormat = (match[2] || ' ') + isoTimes[i][0];
                    break;
                }
            }
            if (timeFormat == null) {
                config._isValid = false;
                return;
            }
        }
        if (!allowTime && timeFormat != null) {
            config._isValid = false;
            return;
        }
        if (match[4]) {
            if (tzRegex.exec(match[4])) {
                tzFormat = 'Z';
            } else {
                config._isValid = false;
                return;
            }
        }
        config._f = dateFormat + (timeFormat || '') + (tzFormat || '');
        configFromStringAndFormat(config);
    } else {
        config._isValid = false;
    }
}

// date from iso format or fallback
function configFromString(config) {
    var matched = aspNetJsonRegex.exec(config._i);

    if (matched !== null) {
        config._d = new Date(+matched[1]);
        return;
    }

    configFromISO(config);
    if (config._isValid === false) {
        delete config._isValid;
        hooks.createFromInputFallback(config);
    }
}

hooks.createFromInputFallback = deprecate(
    'value provided is not in a recognized ISO format. moment construction falls back to js Date(), ' +
    'which is not reliable across all browsers and versions. Non ISO date formats are ' +
    'discouraged and will be removed in an upcoming major release. Please refer to ' +
    'http://momentjs.com/guides/#/warnings/js-date/ for more info.',
    function (config) {
        config._d = new Date(config._i + (config._useUTC ? ' UTC' : ''));
    }
);

// Pick the first defined of two or three arguments.
function defaults(a, b, c) {
    if (a != null) {
        return a;
    }
    if (b != null) {
        return b;
    }
    return c;
}

function currentDateArray(config) {
    // hooks is actually the exported moment object
    var nowValue = new Date(hooks.now());
    if (config._useUTC) {
        return [nowValue.getUTCFullYear(), nowValue.getUTCMonth(), nowValue.getUTCDate()];
    }
    return [nowValue.getFullYear(), nowValue.getMonth(), nowValue.getDate()];
}

// convert an array to a date.
// the array should mirror the parameters below
// note: all values past the year are optional and will default to the lowest possible value.
// [year, month, day , hour, minute, second, millisecond]
function configFromArray (config) {
    var i, date, input = [], currentDate, yearToUse;

    if (config._d) {
        return;
    }

    currentDate = currentDateArray(config);

    //compute day of the year from weeks and weekdays
    if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
        dayOfYearFromWeekInfo(config);
    }

    //if the day of the year is set, figure out what it is
    if (config._dayOfYear) {
        yearToUse = defaults(config._a[YEAR], currentDate[YEAR]);

        if (config._dayOfYear > daysInYear(yearToUse)) {
            getParsingFlags(config)._overflowDayOfYear = true;
        }

        date = createUTCDate(yearToUse, 0, config._dayOfYear);
        config._a[MONTH] = date.getUTCMonth();
        config._a[DATE] = date.getUTCDate();
    }

    // Default to current date.
    // * if no year, month, day of month are given, default to today
    // * if day of month is given, default month and year
    // * if month is given, default only year
    // * if year is given, don't default anything
    for (i = 0; i < 3 && config._a[i] == null; ++i) {
        config._a[i] = input[i] = currentDate[i];
    }

    // Zero out whatever was not defaulted, including time
    for (; i < 7; i++) {
        config._a[i] = input[i] = (config._a[i] == null) ? (i === 2 ? 1 : 0) : config._a[i];
    }

    // Check for 24:00:00.000
    if (config._a[HOUR] === 24 &&
            config._a[MINUTE] === 0 &&
            config._a[SECOND] === 0 &&
            config._a[MILLISECOND] === 0) {
        config._nextDay = true;
        config._a[HOUR] = 0;
    }

    config._d = (config._useUTC ? createUTCDate : createDate).apply(null, input);
    // Apply timezone offset from input. The actual utcOffset can be changed
    // with parseZone.
    if (config._tzm != null) {
        config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
    }

    if (config._nextDay) {
        config._a[HOUR] = 24;
    }
}

function dayOfYearFromWeekInfo(config) {
    var w, weekYear, week, weekday, dow, doy, temp, weekdayOverflow;

    w = config._w;
    if (w.GG != null || w.W != null || w.E != null) {
        dow = 1;
        doy = 4;

        // TODO: We need to take the current isoWeekYear, but that depends on
        // how we interpret now (local, utc, fixed offset). So create
        // a now version of current config (take local/utc/offset flags, and
        // create now).
        weekYear = defaults(w.GG, config._a[YEAR], weekOfYear(createLocal(), 1, 4).year);
        week = defaults(w.W, 1);
        weekday = defaults(w.E, 1);
        if (weekday < 1 || weekday > 7) {
            weekdayOverflow = true;
        }
    } else {
        dow = config._locale._week.dow;
        doy = config._locale._week.doy;

        var curWeek = weekOfYear(createLocal(), dow, doy);

        weekYear = defaults(w.gg, config._a[YEAR], curWeek.year);

        // Default to current week.
        week = defaults(w.w, curWeek.week);

        if (w.d != null) {
            // weekday -- low day numbers are considered next week
            weekday = w.d;
            if (weekday < 0 || weekday > 6) {
                weekdayOverflow = true;
            }
        } else if (w.e != null) {
            // local weekday -- counting starts from begining of week
            weekday = w.e + dow;
            if (w.e < 0 || w.e > 6) {
                weekdayOverflow = true;
            }
        } else {
            // default to begining of week
            weekday = dow;
        }
    }
    if (week < 1 || week > weeksInYear(weekYear, dow, doy)) {
        getParsingFlags(config)._overflowWeeks = true;
    } else if (weekdayOverflow != null) {
        getParsingFlags(config)._overflowWeekday = true;
    } else {
        temp = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy);
        config._a[YEAR] = temp.year;
        config._dayOfYear = temp.dayOfYear;
    }
}

// constant that refers to the ISO standard
hooks.ISO_8601 = function () {};

// date from string and format string
function configFromStringAndFormat(config) {
    // TODO: Move this to another part of the creation flow to prevent circular deps
    if (config._f === hooks.ISO_8601) {
        configFromISO(config);
        return;
    }

    config._a = [];
    getParsingFlags(config).empty = true;

    // This array is used to make a Date, either with `new Date` or `Date.UTC`
    var string = '' + config._i,
        i, parsedInput, tokens, token, skipped,
        stringLength = string.length,
        totalParsedInputLength = 0;

    tokens = expandFormat(config._f, config._locale).match(formattingTokens) || [];

    for (i = 0; i < tokens.length; i++) {
        token = tokens[i];
        parsedInput = (string.match(getParseRegexForToken(token, config)) || [])[0];
        // console.log('token', token, 'parsedInput', parsedInput,
        //         'regex', getParseRegexForToken(token, config));
        if (parsedInput) {
            skipped = string.substr(0, string.indexOf(parsedInput));
            if (skipped.length > 0) {
                getParsingFlags(config).unusedInput.push(skipped);
            }
            string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
            totalParsedInputLength += parsedInput.length;
        }
        // don't parse if it's not a known token
        if (formatTokenFunctions[token]) {
            if (parsedInput) {
                getParsingFlags(config).empty = false;
            }
            else {
                getParsingFlags(config).unusedTokens.push(token);
            }
            addTimeToArrayFromToken(token, parsedInput, config);
        }
        else if (config._strict && !parsedInput) {
            getParsingFlags(config).unusedTokens.push(token);
        }
    }

    // add remaining unparsed input length to the string
    getParsingFlags(config).charsLeftOver = stringLength - totalParsedInputLength;
    if (string.length > 0) {
        getParsingFlags(config).unusedInput.push(string);
    }

    // clear _12h flag if hour is <= 12
    if (config._a[HOUR] <= 12 &&
        getParsingFlags(config).bigHour === true &&
        config._a[HOUR] > 0) {
        getParsingFlags(config).bigHour = undefined;
    }

    getParsingFlags(config).parsedDateParts = config._a.slice(0);
    getParsingFlags(config).meridiem = config._meridiem;
    // handle meridiem
    config._a[HOUR] = meridiemFixWrap(config._locale, config._a[HOUR], config._meridiem);

    configFromArray(config);
    checkOverflow(config);
}


function meridiemFixWrap (locale, hour, meridiem) {
    var isPm;

    if (meridiem == null) {
        // nothing to do
        return hour;
    }
    if (locale.meridiemHour != null) {
        return locale.meridiemHour(hour, meridiem);
    } else if (locale.isPM != null) {
        // Fallback
        isPm = locale.isPM(meridiem);
        if (isPm && hour < 12) {
            hour += 12;
        }
        if (!isPm && hour === 12) {
            hour = 0;
        }
        return hour;
    } else {
        // this is not supposed to happen
        return hour;
    }
}

// date from string and array of format strings
function configFromStringAndArray(config) {
    var tempConfig,
        bestMoment,

        scoreToBeat,
        i,
        currentScore;

    if (config._f.length === 0) {
        getParsingFlags(config).invalidFormat = true;
        config._d = new Date(NaN);
        return;
    }

    for (i = 0; i < config._f.length; i++) {
        currentScore = 0;
        tempConfig = copyConfig({}, config);
        if (config._useUTC != null) {
            tempConfig._useUTC = config._useUTC;
        }
        tempConfig._f = config._f[i];
        configFromStringAndFormat(tempConfig);

        if (!isValid(tempConfig)) {
            continue;
        }

        // if there is any input that was not parsed add a penalty for that format
        currentScore += getParsingFlags(tempConfig).charsLeftOver;

        //or tokens
        currentScore += getParsingFlags(tempConfig).unusedTokens.length * 10;

        getParsingFlags(tempConfig).score = currentScore;

        if (scoreToBeat == null || currentScore < scoreToBeat) {
            scoreToBeat = currentScore;
            bestMoment = tempConfig;
        }
    }

    extend(config, bestMoment || tempConfig);
}

function configFromObject(config) {
    if (config._d) {
        return;
    }

    var i = normalizeObjectUnits(config._i);
    config._a = map([i.year, i.month, i.day || i.date, i.hour, i.minute, i.second, i.millisecond], function (obj) {
        return obj && parseInt(obj, 10);
    });

    configFromArray(config);
}

function createFromConfig (config) {
    var res = new Moment(checkOverflow(prepareConfig(config)));
    if (res._nextDay) {
        // Adding is smart enough around DST
        res.add(1, 'd');
        res._nextDay = undefined;
    }

    return res;
}

function prepareConfig (config) {
    var input = config._i,
        format = config._f;

    config._locale = config._locale || getLocale(config._l);

    if (input === null || (format === undefined && input === '')) {
        return createInvalid({nullInput: true});
    }

    if (typeof input === 'string') {
        config._i = input = config._locale.preparse(input);
    }

    if (isMoment(input)) {
        return new Moment(checkOverflow(input));
    } else if (isDate(input)) {
        config._d = input;
    } else if (isArray(format)) {
        configFromStringAndArray(config);
    } else if (format) {
        configFromStringAndFormat(config);
    }  else {
        configFromInput(config);
    }

    if (!isValid(config)) {
        config._d = null;
    }

    return config;
}

function configFromInput(config) {
    var input = config._i;
    if (input === undefined) {
        config._d = new Date(hooks.now());
    } else if (isDate(input)) {
        config._d = new Date(input.valueOf());
    } else if (typeof input === 'string') {
        configFromString(config);
    } else if (isArray(input)) {
        config._a = map(input.slice(0), function (obj) {
            return parseInt(obj, 10);
        });
        configFromArray(config);
    } else if (typeof(input) === 'object') {
        configFromObject(config);
    } else if (isNumber(input)) {
        // from milliseconds
        config._d = new Date(input);
    } else {
        hooks.createFromInputFallback(config);
    }
}

function createLocalOrUTC (input, format, locale, strict, isUTC) {
    var c = {};

    if (locale === true || locale === false) {
        strict = locale;
        locale = undefined;
    }

    if ((isObject(input) && isObjectEmpty(input)) ||
            (isArray(input) && input.length === 0)) {
        input = undefined;
    }
    // object construction must be done this way.
    // https://github.com/moment/moment/issues/1423
    c._isAMomentObject = true;
    c._useUTC = c._isUTC = isUTC;
    c._l = locale;
    c._i = input;
    c._f = format;
    c._strict = strict;

    return createFromConfig(c);
}

function createLocal (input, format, locale, strict) {
    return createLocalOrUTC(input, format, locale, strict, false);
}

var prototypeMin = deprecate(
    'moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/',
    function () {
        var other = createLocal.apply(null, arguments);
        if (this.isValid() && other.isValid()) {
            return other < this ? this : other;
        } else {
            return createInvalid();
        }
    }
);

var prototypeMax = deprecate(
    'moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/',
    function () {
        var other = createLocal.apply(null, arguments);
        if (this.isValid() && other.isValid()) {
            return other > this ? this : other;
        } else {
            return createInvalid();
        }
    }
);

// Pick a moment m from moments so that m[fn](other) is true for all
// other. This relies on the function fn to be transitive.
//
// moments should either be an array of moment objects or an array, whose
// first element is an array of moment objects.
function pickBy(fn, moments) {
    var res, i;
    if (moments.length === 1 && isArray(moments[0])) {
        moments = moments[0];
    }
    if (!moments.length) {
        return createLocal();
    }
    res = moments[0];
    for (i = 1; i < moments.length; ++i) {
        if (!moments[i].isValid() || moments[i][fn](res)) {
            res = moments[i];
        }
    }
    return res;
}

// TODO: Use [].sort instead?
function min () {
    var args = [].slice.call(arguments, 0);

    return pickBy('isBefore', args);
}

function max () {
    var args = [].slice.call(arguments, 0);

    return pickBy('isAfter', args);
}

var now = function () {
    return Date.now ? Date.now() : +(new Date());
};

function Duration (duration) {
    var normalizedInput = normalizeObjectUnits(duration),
        years = normalizedInput.year || 0,
        quarters = normalizedInput.quarter || 0,
        months = normalizedInput.month || 0,
        weeks = normalizedInput.week || 0,
        days = normalizedInput.day || 0,
        hours = normalizedInput.hour || 0,
        minutes = normalizedInput.minute || 0,
        seconds = normalizedInput.second || 0,
        milliseconds = normalizedInput.millisecond || 0;

    // representation for dateAddRemove
    this._milliseconds = +milliseconds +
        seconds * 1e3 + // 1000
        minutes * 6e4 + // 1000 * 60
        hours * 1000 * 60 * 60; //using 1000 * 60 * 60 instead of 36e5 to avoid floating point rounding errors https://github.com/moment/moment/issues/2978
    // Because of dateAddRemove treats 24 hours as different from a
    // day when working around DST, we need to store them separately
    this._days = +days +
        weeks * 7;
    // It is impossible translate months into days without knowing
    // which months you are are talking about, so we have to store
    // it separately.
    this._months = +months +
        quarters * 3 +
        years * 12;

    this._data = {};

    this._locale = getLocale();

    this._bubble();
}

function isDuration (obj) {
    return obj instanceof Duration;
}

function absRound (number) {
    if (number < 0) {
        return Math.round(-1 * number) * -1;
    } else {
        return Math.round(number);
    }
}

// FORMATTING

function offset (token, separator) {
    addFormatToken(token, 0, 0, function () {
        var offset = this.utcOffset();
        var sign = '+';
        if (offset < 0) {
            offset = -offset;
            sign = '-';
        }
        return sign + zeroFill(~~(offset / 60), 2) + separator + zeroFill(~~(offset) % 60, 2);
    });
}

offset('Z', ':');
offset('ZZ', '');

// PARSING

addRegexToken('Z',  matchShortOffset);
addRegexToken('ZZ', matchShortOffset);
addParseToken(['Z', 'ZZ'], function (input, array, config) {
    config._useUTC = true;
    config._tzm = offsetFromString(matchShortOffset, input);
});

// HELPERS

// timezone chunker
// '+10:00' > ['10',  '00']
// '-1530'  > ['-15', '30']
var chunkOffset = /([\+\-]|\d\d)/gi;

function offsetFromString(matcher, string) {
    var matches = (string || '').match(matcher);

    if (matches === null) {
        return null;
    }

    var chunk   = matches[matches.length - 1] || [];
    var parts   = (chunk + '').match(chunkOffset) || ['-', 0, 0];
    var minutes = +(parts[1] * 60) + toInt(parts[2]);

    return minutes === 0 ?
      0 :
      parts[0] === '+' ? minutes : -minutes;
}

// Return a moment from input, that is local/utc/zone equivalent to model.
function cloneWithOffset(input, model) {
    var res, diff;
    if (model._isUTC) {
        res = model.clone();
        diff = (isMoment(input) || isDate(input) ? input.valueOf() : createLocal(input).valueOf()) - res.valueOf();
        // Use low-level api, because this fn is low-level api.
        res._d.setTime(res._d.valueOf() + diff);
        hooks.updateOffset(res, false);
        return res;
    } else {
        return createLocal(input).local();
    }
}

function getDateOffset (m) {
    // On Firefox.24 Date#getTimezoneOffset returns a floating point.
    // https://github.com/moment/moment/pull/1871
    return -Math.round(m._d.getTimezoneOffset() / 15) * 15;
}

// HOOKS

// This function will be called whenever a moment is mutated.
// It is intended to keep the offset in sync with the timezone.
hooks.updateOffset = function () {};

// MOMENTS

// keepLocalTime = true means only change the timezone, without
// affecting the local hour. So 5:31:26 +0300 --[utcOffset(2, true)]-->
// 5:31:26 +0200 It is possible that 5:31:26 doesn't exist with offset
// +0200, so we adjust the time as needed, to be valid.
//
// Keeping the time actually adds/subtracts (one hour)
// from the actual represented time. That is why we call updateOffset
// a second time. In case it wants us to change the offset again
// _changeInProgress == true case, then we have to adjust, because
// there is no such time in the given timezone.
function getSetOffset (input, keepLocalTime) {
    var offset = this._offset || 0,
        localAdjust;
    if (!this.isValid()) {
        return input != null ? this : NaN;
    }
    if (input != null) {
        if (typeof input === 'string') {
            input = offsetFromString(matchShortOffset, input);
            if (input === null) {
                return this;
            }
        } else if (Math.abs(input) < 16) {
            input = input * 60;
        }
        if (!this._isUTC && keepLocalTime) {
            localAdjust = getDateOffset(this);
        }
        this._offset = input;
        this._isUTC = true;
        if (localAdjust != null) {
            this.add(localAdjust, 'm');
        }
        if (offset !== input) {
            if (!keepLocalTime || this._changeInProgress) {
                addSubtract(this, createDuration(input - offset, 'm'), 1, false);
            } else if (!this._changeInProgress) {
                this._changeInProgress = true;
                hooks.updateOffset(this, true);
                this._changeInProgress = null;
            }
        }
        return this;
    } else {
        return this._isUTC ? offset : getDateOffset(this);
    }
}

function getSetZone (input, keepLocalTime) {
    if (input != null) {
        if (typeof input !== 'string') {
            input = -input;
        }

        this.utcOffset(input, keepLocalTime);

        return this;
    } else {
        return -this.utcOffset();
    }
}

function setOffsetToUTC (keepLocalTime) {
    return this.utcOffset(0, keepLocalTime);
}

function setOffsetToLocal (keepLocalTime) {
    if (this._isUTC) {
        this.utcOffset(0, keepLocalTime);
        this._isUTC = false;

        if (keepLocalTime) {
            this.subtract(getDateOffset(this), 'm');
        }
    }
    return this;
}

function setOffsetToParsedOffset () {
    if (this._tzm != null) {
        this.utcOffset(this._tzm);
    } else if (typeof this._i === 'string') {
        var tZone = offsetFromString(matchOffset, this._i);
        if (tZone != null) {
            this.utcOffset(tZone);
        }
        else {
            this.utcOffset(0, true);
        }
    }
    return this;
}

function hasAlignedHourOffset (input) {
    if (!this.isValid()) {
        return false;
    }
    input = input ? createLocal(input).utcOffset() : 0;

    return (this.utcOffset() - input) % 60 === 0;
}

function isDaylightSavingTime () {
    return (
        this.utcOffset() > this.clone().month(0).utcOffset() ||
        this.utcOffset() > this.clone().month(5).utcOffset()
    );
}

function isDaylightSavingTimeShifted () {
    if (!isUndefined(this._isDSTShifted)) {
        return this._isDSTShifted;
    }

    var c = {};

    copyConfig(c, this);
    c = prepareConfig(c);

    if (c._a) {
        var other = c._isUTC ? createUTC(c._a) : createLocal(c._a);
        this._isDSTShifted = this.isValid() &&
            compareArrays(c._a, other.toArray()) > 0;
    } else {
        this._isDSTShifted = false;
    }

    return this._isDSTShifted;
}

function isLocal () {
    return this.isValid() ? !this._isUTC : false;
}

function isUtcOffset () {
    return this.isValid() ? this._isUTC : false;
}

function isUtc () {
    return this.isValid() ? this._isUTC && this._offset === 0 : false;
}

// ASP.NET json date format regex
var aspNetRegex = /^(\-)?(?:(\d*)[. ])?(\d+)\:(\d+)(?:\:(\d+)(\.\d*)?)?$/;

// from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
// somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
// and further modified to allow for strings containing both week and day
var isoRegex = /^(-)?P(?:(-?[0-9,.]*)Y)?(?:(-?[0-9,.]*)M)?(?:(-?[0-9,.]*)W)?(?:(-?[0-9,.]*)D)?(?:T(?:(-?[0-9,.]*)H)?(?:(-?[0-9,.]*)M)?(?:(-?[0-9,.]*)S)?)?$/;

function createDuration (input, key) {
    var duration = input,
        // matching against regexp is expensive, do it on demand
        match = null,
        sign,
        ret,
        diffRes;

    if (isDuration(input)) {
        duration = {
            ms : input._milliseconds,
            d  : input._days,
            M  : input._months
        };
    } else if (isNumber(input)) {
        duration = {};
        if (key) {
            duration[key] = input;
        } else {
            duration.milliseconds = input;
        }
    } else if (!!(match = aspNetRegex.exec(input))) {
        sign = (match[1] === '-') ? -1 : 1;
        duration = {
            y  : 0,
            d  : toInt(match[DATE])                         * sign,
            h  : toInt(match[HOUR])                         * sign,
            m  : toInt(match[MINUTE])                       * sign,
            s  : toInt(match[SECOND])                       * sign,
            ms : toInt(absRound(match[MILLISECOND] * 1000)) * sign // the millisecond decimal point is included in the match
        };
    } else if (!!(match = isoRegex.exec(input))) {
        sign = (match[1] === '-') ? -1 : 1;
        duration = {
            y : parseIso(match[2], sign),
            M : parseIso(match[3], sign),
            w : parseIso(match[4], sign),
            d : parseIso(match[5], sign),
            h : parseIso(match[6], sign),
            m : parseIso(match[7], sign),
            s : parseIso(match[8], sign)
        };
    } else if (duration == null) {// checks for null or undefined
        duration = {};
    } else if (typeof duration === 'object' && ('from' in duration || 'to' in duration)) {
        diffRes = momentsDifference(createLocal(duration.from), createLocal(duration.to));

        duration = {};
        duration.ms = diffRes.milliseconds;
        duration.M = diffRes.months;
    }

    ret = new Duration(duration);

    if (isDuration(input) && hasOwnProp(input, '_locale')) {
        ret._locale = input._locale;
    }

    return ret;
}

createDuration.fn = Duration.prototype;

function parseIso (inp, sign) {
    // We'd normally use ~~inp for this, but unfortunately it also
    // converts floats to ints.
    // inp may be undefined, so careful calling replace on it.
    var res = inp && parseFloat(inp.replace(',', '.'));
    // apply sign while we're at it
    return (isNaN(res) ? 0 : res) * sign;
}

function positiveMomentsDifference(base, other) {
    var res = {milliseconds: 0, months: 0};

    res.months = other.month() - base.month() +
        (other.year() - base.year()) * 12;
    if (base.clone().add(res.months, 'M').isAfter(other)) {
        --res.months;
    }

    res.milliseconds = +other - +(base.clone().add(res.months, 'M'));

    return res;
}

function momentsDifference(base, other) {
    var res;
    if (!(base.isValid() && other.isValid())) {
        return {milliseconds: 0, months: 0};
    }

    other = cloneWithOffset(other, base);
    if (base.isBefore(other)) {
        res = positiveMomentsDifference(base, other);
    } else {
        res = positiveMomentsDifference(other, base);
        res.milliseconds = -res.milliseconds;
        res.months = -res.months;
    }

    return res;
}

// TODO: remove 'name' arg after deprecation is removed
function createAdder(direction, name) {
    return function (val, period) {
        var dur, tmp;
        //invert the arguments, but complain about it
        if (period !== null && !isNaN(+period)) {
            deprecateSimple(name, 'moment().' + name  + '(period, number) is deprecated. Please use moment().' + name + '(number, period). ' +
            'See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info.');
            tmp = val; val = period; period = tmp;
        }

        val = typeof val === 'string' ? +val : val;
        dur = createDuration(val, period);
        addSubtract(this, dur, direction);
        return this;
    };
}

function addSubtract (mom, duration, isAdding, updateOffset) {
    var milliseconds = duration._milliseconds,
        days = absRound(duration._days),
        months = absRound(duration._months);

    if (!mom.isValid()) {
        // No op
        return;
    }

    updateOffset = updateOffset == null ? true : updateOffset;

    if (milliseconds) {
        mom._d.setTime(mom._d.valueOf() + milliseconds * isAdding);
    }
    if (days) {
        set$1(mom, 'Date', get(mom, 'Date') + days * isAdding);
    }
    if (months) {
        setMonth(mom, get(mom, 'Month') + months * isAdding);
    }
    if (updateOffset) {
        hooks.updateOffset(mom, days || months);
    }
}

var add      = createAdder(1, 'add');
var subtract = createAdder(-1, 'subtract');

function getCalendarFormat(myMoment, now) {
    var diff = myMoment.diff(now, 'days', true);
    return diff < -6 ? 'sameElse' :
            diff < -1 ? 'lastWeek' :
            diff < 0 ? 'lastDay' :
            diff < 1 ? 'sameDay' :
            diff < 2 ? 'nextDay' :
            diff < 7 ? 'nextWeek' : 'sameElse';
}

function calendar$1 (time, formats) {
    // We want to compare the start of today, vs this.
    // Getting start-of-today depends on whether we're local/utc/offset or not.
    var now = time || createLocal(),
        sod = cloneWithOffset(now, this).startOf('day'),
        format = hooks.calendarFormat(this, sod) || 'sameElse';

    var output = formats && (isFunction(formats[format]) ? formats[format].call(this, now) : formats[format]);

    return this.format(output || this.localeData().calendar(format, this, createLocal(now)));
}

function clone () {
    return new Moment(this);
}

function isAfter (input, units) {
    var localInput = isMoment(input) ? input : createLocal(input);
    if (!(this.isValid() && localInput.isValid())) {
        return false;
    }
    units = normalizeUnits(!isUndefined(units) ? units : 'millisecond');
    if (units === 'millisecond') {
        return this.valueOf() > localInput.valueOf();
    } else {
        return localInput.valueOf() < this.clone().startOf(units).valueOf();
    }
}

function isBefore (input, units) {
    var localInput = isMoment(input) ? input : createLocal(input);
    if (!(this.isValid() && localInput.isValid())) {
        return false;
    }
    units = normalizeUnits(!isUndefined(units) ? units : 'millisecond');
    if (units === 'millisecond') {
        return this.valueOf() < localInput.valueOf();
    } else {
        return this.clone().endOf(units).valueOf() < localInput.valueOf();
    }
}

function isBetween (from, to, units, inclusivity) {
    inclusivity = inclusivity || '()';
    return (inclusivity[0] === '(' ? this.isAfter(from, units) : !this.isBefore(from, units)) &&
        (inclusivity[1] === ')' ? this.isBefore(to, units) : !this.isAfter(to, units));
}

function isSame (input, units) {
    var localInput = isMoment(input) ? input : createLocal(input),
        inputMs;
    if (!(this.isValid() && localInput.isValid())) {
        return false;
    }
    units = normalizeUnits(units || 'millisecond');
    if (units === 'millisecond') {
        return this.valueOf() === localInput.valueOf();
    } else {
        inputMs = localInput.valueOf();
        return this.clone().startOf(units).valueOf() <= inputMs && inputMs <= this.clone().endOf(units).valueOf();
    }
}

function isSameOrAfter (input, units) {
    return this.isSame(input, units) || this.isAfter(input,units);
}

function isSameOrBefore (input, units) {
    return this.isSame(input, units) || this.isBefore(input,units);
}

function diff (input, units, asFloat) {
    var that,
        zoneDelta,
        delta, output;

    if (!this.isValid()) {
        return NaN;
    }

    that = cloneWithOffset(input, this);

    if (!that.isValid()) {
        return NaN;
    }

    zoneDelta = (that.utcOffset() - this.utcOffset()) * 6e4;

    units = normalizeUnits(units);

    if (units === 'year' || units === 'month' || units === 'quarter') {
        output = monthDiff(this, that);
        if (units === 'quarter') {
            output = output / 3;
        } else if (units === 'year') {
            output = output / 12;
        }
    } else {
        delta = this - that;
        output = units === 'second' ? delta / 1e3 : // 1000
            units === 'minute' ? delta / 6e4 : // 1000 * 60
            units === 'hour' ? delta / 36e5 : // 1000 * 60 * 60
            units === 'day' ? (delta - zoneDelta) / 864e5 : // 1000 * 60 * 60 * 24, negate dst
            units === 'week' ? (delta - zoneDelta) / 6048e5 : // 1000 * 60 * 60 * 24 * 7, negate dst
            delta;
    }
    return asFloat ? output : absFloor(output);
}

function monthDiff (a, b) {
    // difference in months
    var wholeMonthDiff = ((b.year() - a.year()) * 12) + (b.month() - a.month()),
        // b is in (anchor - 1 month, anchor + 1 month)
        anchor = a.clone().add(wholeMonthDiff, 'months'),
        anchor2, adjust;

    if (b - anchor < 0) {
        anchor2 = a.clone().add(wholeMonthDiff - 1, 'months');
        // linear across the month
        adjust = (b - anchor) / (anchor - anchor2);
    } else {
        anchor2 = a.clone().add(wholeMonthDiff + 1, 'months');
        // linear across the month
        adjust = (b - anchor) / (anchor2 - anchor);
    }

    //check for negative zero, return zero if negative zero
    return -(wholeMonthDiff + adjust) || 0;
}

hooks.defaultFormat = 'YYYY-MM-DDTHH:mm:ssZ';
hooks.defaultFormatUtc = 'YYYY-MM-DDTHH:mm:ss[Z]';

function toString () {
    return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
}

function toISOString () {
    var m = this.clone().utc();
    if (0 < m.year() && m.year() <= 9999) {
        if (isFunction(Date.prototype.toISOString)) {
            // native implementation is ~50x faster, use it when we can
            return this.toDate().toISOString();
        } else {
            return formatMoment(m, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
        }
    } else {
        return formatMoment(m, 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
    }
}

/**
 * Return a human readable representation of a moment that can
 * also be evaluated to get a new moment which is the same
 *
 * @link https://nodejs.org/dist/latest/docs/api/util.html#util_custom_inspect_function_on_objects
 */
function inspect () {
    if (!this.isValid()) {
        return 'moment.invalid(/* ' + this._i + ' */)';
    }
    var func = 'moment';
    var zone = '';
    if (!this.isLocal()) {
        func = this.utcOffset() === 0 ? 'moment.utc' : 'moment.parseZone';
        zone = 'Z';
    }
    var prefix = '[' + func + '("]';
    var year = (0 < this.year() && this.year() <= 9999) ? 'YYYY' : 'YYYYYY';
    var datetime = '-MM-DD[T]HH:mm:ss.SSS';
    var suffix = zone + '[")]';

    return this.format(prefix + year + datetime + suffix);
}

function format (inputString) {
    if (!inputString) {
        inputString = this.isUtc() ? hooks.defaultFormatUtc : hooks.defaultFormat;
    }
    var output = formatMoment(this, inputString);
    return this.localeData().postformat(output);
}

function from (time, withoutSuffix) {
    if (this.isValid() &&
            ((isMoment(time) && time.isValid()) ||
             createLocal(time).isValid())) {
        return createDuration({to: this, from: time}).locale(this.locale()).humanize(!withoutSuffix);
    } else {
        return this.localeData().invalidDate();
    }
}

function fromNow (withoutSuffix) {
    return this.from(createLocal(), withoutSuffix);
}

function to (time, withoutSuffix) {
    if (this.isValid() &&
            ((isMoment(time) && time.isValid()) ||
             createLocal(time).isValid())) {
        return createDuration({from: this, to: time}).locale(this.locale()).humanize(!withoutSuffix);
    } else {
        return this.localeData().invalidDate();
    }
}

function toNow (withoutSuffix) {
    return this.to(createLocal(), withoutSuffix);
}

// If passed a locale key, it will set the locale for this
// instance.  Otherwise, it will return the locale configuration
// variables for this instance.
function locale (key) {
    var newLocaleData;

    if (key === undefined) {
        return this._locale._abbr;
    } else {
        newLocaleData = getLocale(key);
        if (newLocaleData != null) {
            this._locale = newLocaleData;
        }
        return this;
    }
}

var lang = deprecate(
    'moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.',
    function (key) {
        if (key === undefined) {
            return this.localeData();
        } else {
            return this.locale(key);
        }
    }
);

function localeData () {
    return this._locale;
}

function startOf (units) {
    units = normalizeUnits(units);
    // the following switch intentionally omits break keywords
    // to utilize falling through the cases.
    switch (units) {
        case 'year':
            this.month(0);
            /* falls through */
        case 'quarter':
        case 'month':
            this.date(1);
            /* falls through */
        case 'week':
        case 'isoWeek':
        case 'day':
        case 'date':
            this.hours(0);
            /* falls through */
        case 'hour':
            this.minutes(0);
            /* falls through */
        case 'minute':
            this.seconds(0);
            /* falls through */
        case 'second':
            this.milliseconds(0);
    }

    // weeks are a special case
    if (units === 'week') {
        this.weekday(0);
    }
    if (units === 'isoWeek') {
        this.isoWeekday(1);
    }

    // quarters are also special
    if (units === 'quarter') {
        this.month(Math.floor(this.month() / 3) * 3);
    }

    return this;
}

function endOf (units) {
    units = normalizeUnits(units);
    if (units === undefined || units === 'millisecond') {
        return this;
    }

    // 'date' is an alias for 'day', so it should be considered as such.
    if (units === 'date') {
        units = 'day';
    }

    return this.startOf(units).add(1, (units === 'isoWeek' ? 'week' : units)).subtract(1, 'ms');
}

function valueOf () {
    return this._d.valueOf() - ((this._offset || 0) * 60000);
}

function unix () {
    return Math.floor(this.valueOf() / 1000);
}

function toDate () {
    return new Date(this.valueOf());
}

function toArray () {
    var m = this;
    return [m.year(), m.month(), m.date(), m.hour(), m.minute(), m.second(), m.millisecond()];
}

function toObject () {
    var m = this;
    return {
        years: m.year(),
        months: m.month(),
        date: m.date(),
        hours: m.hours(),
        minutes: m.minutes(),
        seconds: m.seconds(),
        milliseconds: m.milliseconds()
    };
}

function toJSON () {
    // new Date(NaN).toJSON() === null
    return this.isValid() ? this.toISOString() : null;
}

function isValid$1 () {
    return isValid(this);
}

function parsingFlags () {
    return extend({}, getParsingFlags(this));
}

function invalidAt () {
    return getParsingFlags(this).overflow;
}

function creationData() {
    return {
        input: this._i,
        format: this._f,
        locale: this._locale,
        isUTC: this._isUTC,
        strict: this._strict
    };
}

// FORMATTING

addFormatToken(0, ['gg', 2], 0, function () {
    return this.weekYear() % 100;
});

addFormatToken(0, ['GG', 2], 0, function () {
    return this.isoWeekYear() % 100;
});

function addWeekYearFormatToken (token, getter) {
    addFormatToken(0, [token, token.length], 0, getter);
}

addWeekYearFormatToken('gggg',     'weekYear');
addWeekYearFormatToken('ggggg',    'weekYear');
addWeekYearFormatToken('GGGG',  'isoWeekYear');
addWeekYearFormatToken('GGGGG', 'isoWeekYear');

// ALIASES

addUnitAlias('weekYear', 'gg');
addUnitAlias('isoWeekYear', 'GG');

// PRIORITY

addUnitPriority('weekYear', 1);
addUnitPriority('isoWeekYear', 1);


// PARSING

addRegexToken('G',      matchSigned);
addRegexToken('g',      matchSigned);
addRegexToken('GG',     match1to2, match2);
addRegexToken('gg',     match1to2, match2);
addRegexToken('GGGG',   match1to4, match4);
addRegexToken('gggg',   match1to4, match4);
addRegexToken('GGGGG',  match1to6, match6);
addRegexToken('ggggg',  match1to6, match6);

addWeekParseToken(['gggg', 'ggggg', 'GGGG', 'GGGGG'], function (input, week, config, token) {
    week[token.substr(0, 2)] = toInt(input);
});

addWeekParseToken(['gg', 'GG'], function (input, week, config, token) {
    week[token] = hooks.parseTwoDigitYear(input);
});

// MOMENTS

function getSetWeekYear (input) {
    return getSetWeekYearHelper.call(this,
            input,
            this.week(),
            this.weekday(),
            this.localeData()._week.dow,
            this.localeData()._week.doy);
}

function getSetISOWeekYear (input) {
    return getSetWeekYearHelper.call(this,
            input, this.isoWeek(), this.isoWeekday(), 1, 4);
}

function getISOWeeksInYear () {
    return weeksInYear(this.year(), 1, 4);
}

function getWeeksInYear () {
    var weekInfo = this.localeData()._week;
    return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
}

function getSetWeekYearHelper(input, week, weekday, dow, doy) {
    var weeksTarget;
    if (input == null) {
        return weekOfYear(this, dow, doy).year;
    } else {
        weeksTarget = weeksInYear(input, dow, doy);
        if (week > weeksTarget) {
            week = weeksTarget;
        }
        return setWeekAll.call(this, input, week, weekday, dow, doy);
    }
}

function setWeekAll(weekYear, week, weekday, dow, doy) {
    var dayOfYearData = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy),
        date = createUTCDate(dayOfYearData.year, 0, dayOfYearData.dayOfYear);

    this.year(date.getUTCFullYear());
    this.month(date.getUTCMonth());
    this.date(date.getUTCDate());
    return this;
}

// FORMATTING

addFormatToken('Q', 0, 'Qo', 'quarter');

// ALIASES

addUnitAlias('quarter', 'Q');

// PRIORITY

addUnitPriority('quarter', 7);

// PARSING

addRegexToken('Q', match1);
addParseToken('Q', function (input, array) {
    array[MONTH] = (toInt(input) - 1) * 3;
});

// MOMENTS

function getSetQuarter (input) {
    return input == null ? Math.ceil((this.month() + 1) / 3) : this.month((input - 1) * 3 + this.month() % 3);
}

// FORMATTING

addFormatToken('D', ['DD', 2], 'Do', 'date');

// ALIASES

addUnitAlias('date', 'D');

// PRIOROITY
addUnitPriority('date', 9);

// PARSING

addRegexToken('D',  match1to2);
addRegexToken('DD', match1to2, match2);
addRegexToken('Do', function (isStrict, locale) {
    return isStrict ? locale._ordinalParse : locale._ordinalParseLenient;
});

addParseToken(['D', 'DD'], DATE);
addParseToken('Do', function (input, array) {
    array[DATE] = toInt(input.match(match1to2)[0], 10);
});

// MOMENTS

var getSetDayOfMonth = makeGetSet('Date', true);

// FORMATTING

addFormatToken('DDD', ['DDDD', 3], 'DDDo', 'dayOfYear');

// ALIASES

addUnitAlias('dayOfYear', 'DDD');

// PRIORITY
addUnitPriority('dayOfYear', 4);

// PARSING

addRegexToken('DDD',  match1to3);
addRegexToken('DDDD', match3);
addParseToken(['DDD', 'DDDD'], function (input, array, config) {
    config._dayOfYear = toInt(input);
});

// HELPERS

// MOMENTS

function getSetDayOfYear (input) {
    var dayOfYear = Math.round((this.clone().startOf('day') - this.clone().startOf('year')) / 864e5) + 1;
    return input == null ? dayOfYear : this.add((input - dayOfYear), 'd');
}

// FORMATTING

addFormatToken('m', ['mm', 2], 0, 'minute');

// ALIASES

addUnitAlias('minute', 'm');

// PRIORITY

addUnitPriority('minute', 14);

// PARSING

addRegexToken('m',  match1to2);
addRegexToken('mm', match1to2, match2);
addParseToken(['m', 'mm'], MINUTE);

// MOMENTS

var getSetMinute = makeGetSet('Minutes', false);

// FORMATTING

addFormatToken('s', ['ss', 2], 0, 'second');

// ALIASES

addUnitAlias('second', 's');

// PRIORITY

addUnitPriority('second', 15);

// PARSING

addRegexToken('s',  match1to2);
addRegexToken('ss', match1to2, match2);
addParseToken(['s', 'ss'], SECOND);

// MOMENTS

var getSetSecond = makeGetSet('Seconds', false);

// FORMATTING

addFormatToken('S', 0, 0, function () {
    return ~~(this.millisecond() / 100);
});

addFormatToken(0, ['SS', 2], 0, function () {
    return ~~(this.millisecond() / 10);
});

addFormatToken(0, ['SSS', 3], 0, 'millisecond');
addFormatToken(0, ['SSSS', 4], 0, function () {
    return this.millisecond() * 10;
});
addFormatToken(0, ['SSSSS', 5], 0, function () {
    return this.millisecond() * 100;
});
addFormatToken(0, ['SSSSSS', 6], 0, function () {
    return this.millisecond() * 1000;
});
addFormatToken(0, ['SSSSSSS', 7], 0, function () {
    return this.millisecond() * 10000;
});
addFormatToken(0, ['SSSSSSSS', 8], 0, function () {
    return this.millisecond() * 100000;
});
addFormatToken(0, ['SSSSSSSSS', 9], 0, function () {
    return this.millisecond() * 1000000;
});


// ALIASES

addUnitAlias('millisecond', 'ms');

// PRIORITY

addUnitPriority('millisecond', 16);

// PARSING

addRegexToken('S',    match1to3, match1);
addRegexToken('SS',   match1to3, match2);
addRegexToken('SSS',  match1to3, match3);

var token;
for (token = 'SSSS'; token.length <= 9; token += 'S') {
    addRegexToken(token, matchUnsigned);
}

function parseMs(input, array) {
    array[MILLISECOND] = toInt(('0.' + input) * 1000);
}

for (token = 'S'; token.length <= 9; token += 'S') {
    addParseToken(token, parseMs);
}
// MOMENTS

var getSetMillisecond = makeGetSet('Milliseconds', false);

// FORMATTING

addFormatToken('z',  0, 0, 'zoneAbbr');
addFormatToken('zz', 0, 0, 'zoneName');

// MOMENTS

function getZoneAbbr () {
    return this._isUTC ? 'UTC' : '';
}

function getZoneName () {
    return this._isUTC ? 'Coordinated Universal Time' : '';
}

var proto = Moment.prototype;

proto.add               = add;
proto.calendar          = calendar$1;
proto.clone             = clone;
proto.diff              = diff;
proto.endOf             = endOf;
proto.format            = format;
proto.from              = from;
proto.fromNow           = fromNow;
proto.to                = to;
proto.toNow             = toNow;
proto.get               = stringGet;
proto.invalidAt         = invalidAt;
proto.isAfter           = isAfter;
proto.isBefore          = isBefore;
proto.isBetween         = isBetween;
proto.isSame            = isSame;
proto.isSameOrAfter     = isSameOrAfter;
proto.isSameOrBefore    = isSameOrBefore;
proto.isValid           = isValid$1;
proto.lang              = lang;
proto.locale            = locale;
proto.localeData        = localeData;
proto.max               = prototypeMax;
proto.min               = prototypeMin;
proto.parsingFlags      = parsingFlags;
proto.set               = stringSet;
proto.startOf           = startOf;
proto.subtract          = subtract;
proto.toArray           = toArray;
proto.toObject          = toObject;
proto.toDate            = toDate;
proto.toISOString       = toISOString;
proto.inspect           = inspect;
proto.toJSON            = toJSON;
proto.toString          = toString;
proto.unix              = unix;
proto.valueOf           = valueOf;
proto.creationData      = creationData;

// Year
proto.year       = getSetYear;
proto.isLeapYear = getIsLeapYear;

// Week Year
proto.weekYear    = getSetWeekYear;
proto.isoWeekYear = getSetISOWeekYear;

// Quarter
proto.quarter = proto.quarters = getSetQuarter;

// Month
proto.month       = getSetMonth;
proto.daysInMonth = getDaysInMonth;

// Week
proto.week           = proto.weeks        = getSetWeek;
proto.isoWeek        = proto.isoWeeks     = getSetISOWeek;
proto.weeksInYear    = getWeeksInYear;
proto.isoWeeksInYear = getISOWeeksInYear;

// Day
proto.date       = getSetDayOfMonth;
proto.day        = proto.days             = getSetDayOfWeek;
proto.weekday    = getSetLocaleDayOfWeek;
proto.isoWeekday = getSetISODayOfWeek;
proto.dayOfYear  = getSetDayOfYear;

// Hour
proto.hour = proto.hours = getSetHour;

// Minute
proto.minute = proto.minutes = getSetMinute;

// Second
proto.second = proto.seconds = getSetSecond;

// Millisecond
proto.millisecond = proto.milliseconds = getSetMillisecond;

// Offset
proto.utcOffset            = getSetOffset;
proto.utc                  = setOffsetToUTC;
proto.local                = setOffsetToLocal;
proto.parseZone            = setOffsetToParsedOffset;
proto.hasAlignedHourOffset = hasAlignedHourOffset;
proto.isDST                = isDaylightSavingTime;
proto.isLocal              = isLocal;
proto.isUtcOffset          = isUtcOffset;
proto.isUtc                = isUtc;
proto.isUTC                = isUtc;

// Timezone
proto.zoneAbbr = getZoneAbbr;
proto.zoneName = getZoneName;

// Deprecations
proto.dates  = deprecate('dates accessor is deprecated. Use date instead.', getSetDayOfMonth);
proto.months = deprecate('months accessor is deprecated. Use month instead', getSetMonth);
proto.years  = deprecate('years accessor is deprecated. Use year instead', getSetYear);
proto.zone   = deprecate('moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/', getSetZone);
proto.isDSTShifted = deprecate('isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information', isDaylightSavingTimeShifted);

function createUnix (input) {
    return createLocal(input * 1000);
}

function createInZone () {
    return createLocal.apply(null, arguments).parseZone();
}

function preParsePostFormat (string) {
    return string;
}

var proto$1 = Locale.prototype;

proto$1.calendar        = calendar;
proto$1.longDateFormat  = longDateFormat;
proto$1.invalidDate     = invalidDate;
proto$1.ordinal         = ordinal;
proto$1.preparse        = preParsePostFormat;
proto$1.postformat      = preParsePostFormat;
proto$1.relativeTime    = relativeTime;
proto$1.pastFuture      = pastFuture;
proto$1.set             = set;

// Month
proto$1.months            =        localeMonths;
proto$1.monthsShort       =        localeMonthsShort;
proto$1.monthsParse       =        localeMonthsParse;
proto$1.monthsRegex       = monthsRegex;
proto$1.monthsShortRegex  = monthsShortRegex;

// Week
proto$1.week = localeWeek;
proto$1.firstDayOfYear = localeFirstDayOfYear;
proto$1.firstDayOfWeek = localeFirstDayOfWeek;

// Day of Week
proto$1.weekdays       =        localeWeekdays;
proto$1.weekdaysMin    =        localeWeekdaysMin;
proto$1.weekdaysShort  =        localeWeekdaysShort;
proto$1.weekdaysParse  =        localeWeekdaysParse;

proto$1.weekdaysRegex       =        weekdaysRegex;
proto$1.weekdaysShortRegex  =        weekdaysShortRegex;
proto$1.weekdaysMinRegex    =        weekdaysMinRegex;

// Hours
proto$1.isPM = localeIsPM;
proto$1.meridiem = localeMeridiem;

function get$1 (format, index, field, setter) {
    var locale = getLocale();
    var utc = createUTC().set(setter, index);
    return locale[field](utc, format);
}

function listMonthsImpl (format, index, field) {
    if (isNumber(format)) {
        index = format;
        format = undefined;
    }

    format = format || '';

    if (index != null) {
        return get$1(format, index, field, 'month');
    }

    var i;
    var out = [];
    for (i = 0; i < 12; i++) {
        out[i] = get$1(format, i, field, 'month');
    }
    return out;
}

// ()
// (5)
// (fmt, 5)
// (fmt)
// (true)
// (true, 5)
// (true, fmt, 5)
// (true, fmt)
function listWeekdaysImpl (localeSorted, format, index, field) {
    if (typeof localeSorted === 'boolean') {
        if (isNumber(format)) {
            index = format;
            format = undefined;
        }

        format = format || '';
    } else {
        format = localeSorted;
        index = format;
        localeSorted = false;

        if (isNumber(format)) {
            index = format;
            format = undefined;
        }

        format = format || '';
    }

    var locale = getLocale(),
        shift = localeSorted ? locale._week.dow : 0;

    if (index != null) {
        return get$1(format, (index + shift) % 7, field, 'day');
    }

    var i;
    var out = [];
    for (i = 0; i < 7; i++) {
        out[i] = get$1(format, (i + shift) % 7, field, 'day');
    }
    return out;
}

function listMonths (format, index) {
    return listMonthsImpl(format, index, 'months');
}

function listMonthsShort (format, index) {
    return listMonthsImpl(format, index, 'monthsShort');
}

function listWeekdays (localeSorted, format, index) {
    return listWeekdaysImpl(localeSorted, format, index, 'weekdays');
}

function listWeekdaysShort (localeSorted, format, index) {
    return listWeekdaysImpl(localeSorted, format, index, 'weekdaysShort');
}

function listWeekdaysMin (localeSorted, format, index) {
    return listWeekdaysImpl(localeSorted, format, index, 'weekdaysMin');
}

getSetGlobalLocale('en', {
    ordinalParse: /\d{1,2}(th|st|nd|rd)/,
    ordinal : function (number) {
        var b = number % 10,
            output = (toInt(number % 100 / 10) === 1) ? 'th' :
            (b === 1) ? 'st' :
            (b === 2) ? 'nd' :
            (b === 3) ? 'rd' : 'th';
        return number + output;
    }
});

// Side effect imports
hooks.lang = deprecate('moment.lang is deprecated. Use moment.locale instead.', getSetGlobalLocale);
hooks.langData = deprecate('moment.langData is deprecated. Use moment.localeData instead.', getLocale);

var mathAbs = Math.abs;

function abs () {
    var data           = this._data;

    this._milliseconds = mathAbs(this._milliseconds);
    this._days         = mathAbs(this._days);
    this._months       = mathAbs(this._months);

    data.milliseconds  = mathAbs(data.milliseconds);
    data.seconds       = mathAbs(data.seconds);
    data.minutes       = mathAbs(data.minutes);
    data.hours         = mathAbs(data.hours);
    data.months        = mathAbs(data.months);
    data.years         = mathAbs(data.years);

    return this;
}

function addSubtract$1 (duration, input, value, direction) {
    var other = createDuration(input, value);

    duration._milliseconds += direction * other._milliseconds;
    duration._days         += direction * other._days;
    duration._months       += direction * other._months;

    return duration._bubble();
}

// supports only 2.0-style add(1, 's') or add(duration)
function add$1 (input, value) {
    return addSubtract$1(this, input, value, 1);
}

// supports only 2.0-style subtract(1, 's') or subtract(duration)
function subtract$1 (input, value) {
    return addSubtract$1(this, input, value, -1);
}

function absCeil (number) {
    if (number < 0) {
        return Math.floor(number);
    } else {
        return Math.ceil(number);
    }
}

function bubble () {
    var milliseconds = this._milliseconds;
    var days         = this._days;
    var months       = this._months;
    var data         = this._data;
    var seconds, minutes, hours, years, monthsFromDays;

    // if we have a mix of positive and negative values, bubble down first
    // check: https://github.com/moment/moment/issues/2166
    if (!((milliseconds >= 0 && days >= 0 && months >= 0) ||
            (milliseconds <= 0 && days <= 0 && months <= 0))) {
        milliseconds += absCeil(monthsToDays(months) + days) * 864e5;
        days = 0;
        months = 0;
    }

    // The following code bubbles up values, see the tests for
    // examples of what that means.
    data.milliseconds = milliseconds % 1000;

    seconds           = absFloor(milliseconds / 1000);
    data.seconds      = seconds % 60;

    minutes           = absFloor(seconds / 60);
    data.minutes      = minutes % 60;

    hours             = absFloor(minutes / 60);
    data.hours        = hours % 24;

    days += absFloor(hours / 24);

    // convert days to months
    monthsFromDays = absFloor(daysToMonths(days));
    months += monthsFromDays;
    days -= absCeil(monthsToDays(monthsFromDays));

    // 12 months -> 1 year
    years = absFloor(months / 12);
    months %= 12;

    data.days   = days;
    data.months = months;
    data.years  = years;

    return this;
}

function daysToMonths (days) {
    // 400 years have 146097 days (taking into account leap year rules)
    // 400 years have 12 months === 4800
    return days * 4800 / 146097;
}

function monthsToDays (months) {
    // the reverse of daysToMonths
    return months * 146097 / 4800;
}

function as (units) {
    var days;
    var months;
    var milliseconds = this._milliseconds;

    units = normalizeUnits(units);

    if (units === 'month' || units === 'year') {
        days   = this._days   + milliseconds / 864e5;
        months = this._months + daysToMonths(days);
        return units === 'month' ? months : months / 12;
    } else {
        // handle milliseconds separately because of floating point math errors (issue #1867)
        days = this._days + Math.round(monthsToDays(this._months));
        switch (units) {
            case 'week'   : return days / 7     + milliseconds / 6048e5;
            case 'day'    : return days         + milliseconds / 864e5;
            case 'hour'   : return days * 24    + milliseconds / 36e5;
            case 'minute' : return days * 1440  + milliseconds / 6e4;
            case 'second' : return days * 86400 + milliseconds / 1000;
            // Math.floor prevents floating point math errors here
            case 'millisecond': return Math.floor(days * 864e5) + milliseconds;
            default: throw new Error('Unknown unit ' + units);
        }
    }
}

// TODO: Use this.as('ms')?
function valueOf$1 () {
    return (
        this._milliseconds +
        this._days * 864e5 +
        (this._months % 12) * 2592e6 +
        toInt(this._months / 12) * 31536e6
    );
}

function makeAs (alias) {
    return function () {
        return this.as(alias);
    };
}

var asMilliseconds = makeAs('ms');
var asSeconds      = makeAs('s');
var asMinutes      = makeAs('m');
var asHours        = makeAs('h');
var asDays         = makeAs('d');
var asWeeks        = makeAs('w');
var asMonths       = makeAs('M');
var asYears        = makeAs('y');

function get$2 (units) {
    units = normalizeUnits(units);
    return this[units + 's']();
}

function makeGetter(name) {
    return function () {
        return this._data[name];
    };
}

var milliseconds = makeGetter('milliseconds');
var seconds      = makeGetter('seconds');
var minutes      = makeGetter('minutes');
var hours        = makeGetter('hours');
var days         = makeGetter('days');
var months       = makeGetter('months');
var years        = makeGetter('years');

function weeks () {
    return absFloor(this.days() / 7);
}

var round = Math.round;
var thresholds = {
    s: 45,  // seconds to minute
    m: 45,  // minutes to hour
    h: 22,  // hours to day
    d: 26,  // days to month
    M: 11   // months to year
};

// helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
    return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
}

function relativeTime$1 (posNegDuration, withoutSuffix, locale) {
    var duration = createDuration(posNegDuration).abs();
    var seconds  = round(duration.as('s'));
    var minutes  = round(duration.as('m'));
    var hours    = round(duration.as('h'));
    var days     = round(duration.as('d'));
    var months   = round(duration.as('M'));
    var years    = round(duration.as('y'));

    var a = seconds < thresholds.s && ['s', seconds]  ||
            minutes <= 1           && ['m']           ||
            minutes < thresholds.m && ['mm', minutes] ||
            hours   <= 1           && ['h']           ||
            hours   < thresholds.h && ['hh', hours]   ||
            days    <= 1           && ['d']           ||
            days    < thresholds.d && ['dd', days]    ||
            months  <= 1           && ['M']           ||
            months  < thresholds.M && ['MM', months]  ||
            years   <= 1           && ['y']           || ['yy', years];

    a[2] = withoutSuffix;
    a[3] = +posNegDuration > 0;
    a[4] = locale;
    return substituteTimeAgo.apply(null, a);
}

// This function allows you to set the rounding function for relative time strings
function getSetRelativeTimeRounding (roundingFunction) {
    if (roundingFunction === undefined) {
        return round;
    }
    if (typeof(roundingFunction) === 'function') {
        round = roundingFunction;
        return true;
    }
    return false;
}

// This function allows you to set a threshold for relative time strings
function getSetRelativeTimeThreshold (threshold, limit) {
    if (thresholds[threshold] === undefined) {
        return false;
    }
    if (limit === undefined) {
        return thresholds[threshold];
    }
    thresholds[threshold] = limit;
    return true;
}

function humanize (withSuffix) {
    var locale = this.localeData();
    var output = relativeTime$1(this, !withSuffix, locale);

    if (withSuffix) {
        output = locale.pastFuture(+this, output);
    }

    return locale.postformat(output);
}

var abs$1 = Math.abs;

function toISOString$1() {
    // for ISO strings we do not use the normal bubbling rules:
    //  * milliseconds bubble up until they become hours
    //  * days do not bubble at all
    //  * months bubble up until they become years
    // This is because there is no context-free conversion between hours and days
    // (think of clock changes)
    // and also not between days and months (28-31 days per month)
    var seconds = abs$1(this._milliseconds) / 1000;
    var days         = abs$1(this._days);
    var months       = abs$1(this._months);
    var minutes, hours, years;

    // 3600 seconds -> 60 minutes -> 1 hour
    minutes           = absFloor(seconds / 60);
    hours             = absFloor(minutes / 60);
    seconds %= 60;
    minutes %= 60;

    // 12 months -> 1 year
    years  = absFloor(months / 12);
    months %= 12;


    // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
    var Y = years;
    var M = months;
    var D = days;
    var h = hours;
    var m = minutes;
    var s = seconds;
    var total = this.asSeconds();

    if (!total) {
        // this is the same as C#'s (Noda) and python (isodate)...
        // but not other JS (goog.date)
        return 'P0D';
    }

    return (total < 0 ? '-' : '') +
        'P' +
        (Y ? Y + 'Y' : '') +
        (M ? M + 'M' : '') +
        (D ? D + 'D' : '') +
        ((h || m || s) ? 'T' : '') +
        (h ? h + 'H' : '') +
        (m ? m + 'M' : '') +
        (s ? s + 'S' : '');
}

var proto$2 = Duration.prototype;

proto$2.abs            = abs;
proto$2.add            = add$1;
proto$2.subtract       = subtract$1;
proto$2.as             = as;
proto$2.asMilliseconds = asMilliseconds;
proto$2.asSeconds      = asSeconds;
proto$2.asMinutes      = asMinutes;
proto$2.asHours        = asHours;
proto$2.asDays         = asDays;
proto$2.asWeeks        = asWeeks;
proto$2.asMonths       = asMonths;
proto$2.asYears        = asYears;
proto$2.valueOf        = valueOf$1;
proto$2._bubble        = bubble;
proto$2.get            = get$2;
proto$2.milliseconds   = milliseconds;
proto$2.seconds        = seconds;
proto$2.minutes        = minutes;
proto$2.hours          = hours;
proto$2.days           = days;
proto$2.weeks          = weeks;
proto$2.months         = months;
proto$2.years          = years;
proto$2.humanize       = humanize;
proto$2.toISOString    = toISOString$1;
proto$2.toString       = toISOString$1;
proto$2.toJSON         = toISOString$1;
proto$2.locale         = locale;
proto$2.localeData     = localeData;

// Deprecations
proto$2.toIsoString = deprecate('toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)', toISOString$1);
proto$2.lang = lang;

// Side effect imports

// FORMATTING

addFormatToken('X', 0, 0, 'unix');
addFormatToken('x', 0, 0, 'valueOf');

// PARSING

addRegexToken('x', matchSigned);
addRegexToken('X', matchTimestamp);
addParseToken('X', function (input, array, config) {
    config._d = new Date(parseFloat(input, 10) * 1000);
});
addParseToken('x', function (input, array, config) {
    config._d = new Date(toInt(input));
});

// Side effect imports


hooks.version = '2.16.0';

setHookCallback(createLocal);

hooks.fn                    = proto;
hooks.min                   = min;
hooks.max                   = max;
hooks.now                   = now;
hooks.utc                   = createUTC;
hooks.unix                  = createUnix;
hooks.months                = listMonths;
hooks.isDate                = isDate;
hooks.locale                = getSetGlobalLocale;
hooks.invalid               = createInvalid;
hooks.duration              = createDuration;
hooks.isMoment              = isMoment;
hooks.weekdays              = listWeekdays;
hooks.parseZone             = createInZone;
hooks.localeData            = getLocale;
hooks.isDuration            = isDuration;
hooks.monthsShort           = listMonthsShort;
hooks.weekdaysMin           = listWeekdaysMin;
hooks.defineLocale          = defineLocale;
hooks.updateLocale          = updateLocale;
hooks.locales               = listLocales;
hooks.weekdaysShort         = listWeekdaysShort;
hooks.normalizeUnits        = normalizeUnits;
hooks.relativeTimeRounding = getSetRelativeTimeRounding;
hooks.relativeTimeThreshold = getSetRelativeTimeThreshold;
hooks.calendarFormat        = getCalendarFormat;
hooks.prototype             = proto;

return hooks;

})));

},{}],2:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],3:[function(require,module,exports){
var Vue // late bind
var map = window.__VUE_HOT_MAP__ = Object.create(null)
var installed = false
var isBrowserify = false
var initHookName = 'beforeCreate'

exports.install = function (vue, browserify) {
  if (installed) return
  installed = true

  Vue = vue
  isBrowserify = browserify

  // compat with < 2.0.0-alpha.7
  if (Vue.config._lifecycleHooks.indexOf('init') > -1) {
    initHookName = 'init'
  }

  exports.compatible = Number(Vue.version.split('.')[0]) >= 2
  if (!exports.compatible) {
    console.warn(
      '[HMR] You are using a version of vue-hot-reload-api that is ' +
      'only compatible with Vue.js core ^2.0.0.'
    )
    return
  }
}

/**
 * Create a record for a hot module, which keeps track of its constructor
 * and instances
 *
 * @param {String} id
 * @param {Object} options
 */

exports.createRecord = function (id, options) {
  var Ctor = null
  if (typeof options === 'function') {
    Ctor = options
    options = Ctor.options
  }
  makeOptionsHot(id, options)
  map[id] = {
    Ctor: Vue.extend(options),
    instances: []
  }
}

/**
 * Make a Component options object hot.
 *
 * @param {String} id
 * @param {Object} options
 */

function makeOptionsHot (id, options) {
  injectHook(options, initHookName, function () {
    map[id].instances.push(this)
  })
  injectHook(options, 'beforeDestroy', function () {
    var instances = map[id].instances
    instances.splice(instances.indexOf(this), 1)
  })
}

/**
 * Inject a hook to a hot reloadable component so that
 * we can keep track of it.
 *
 * @param {Object} options
 * @param {String} name
 * @param {Function} hook
 */

function injectHook (options, name, hook) {
  var existing = options[name]
  options[name] = existing
    ? Array.isArray(existing)
      ? existing.concat(hook)
      : [existing, hook]
    : [hook]
}

function tryWrap (fn) {
  return function (id, arg) {
    try { fn(id, arg) } catch (e) {
      console.error(e)
      console.warn('Something went wrong during Vue component hot-reload. Full reload required.')
    }
  }
}

exports.rerender = tryWrap(function (id, fns) {
  var record = map[id]
  record.Ctor.options.render = fns.render
  record.Ctor.options.staticRenderFns = fns.staticRenderFns
  record.instances.slice().forEach(function (instance) {
    instance.$options.render = fns.render
    instance.$options.staticRenderFns = fns.staticRenderFns
    instance._staticTrees = [] // reset static trees
    instance.$forceUpdate()
  })
})

exports.reload = tryWrap(function (id, options) {
  makeOptionsHot(id, options)
  var record = map[id]
  record.Ctor.extendOptions = options
  var newCtor = Vue.extend(options)
  record.Ctor.options = newCtor.options
  record.Ctor.cid = newCtor.cid
  if (newCtor.release) {
    // temporary global mixin strategy used in < 2.0.0-alpha.6
    newCtor.release()
  }
  record.instances.slice().forEach(function (instance) {
    if (instance.$parent) {
      instance.$parent.$forceUpdate()
    } else {
      console.warn('Root or manually mounted instance modified. Full reload required.')
    }
  })
})

},{}],4:[function(require,module,exports){
(function (process){
/*!
 * Vue.js v2.0.7
 * (c) 2014-2016 Evan You
 * Released under the MIT License.
 */
'use strict';

/*  */

/**
 * Convert a value to a string that is actually rendered.
 */
function _toString (val) {
  return val == null
    ? ''
    : typeof val === 'object'
      ? JSON.stringify(val, null, 2)
      : String(val)
}

/**
 * Convert a input value to a number for persistence.
 * If the conversion fails, return original string.
 */
function toNumber (val) {
  var n = parseFloat(val, 10);
  return (n || n === 0) ? n : val
}

/**
 * Make a map and return a function for checking if a key
 * is in that map.
 */
function makeMap (
  str,
  expectsLowerCase
) {
  var map = Object.create(null);
  var list = str.split(',');
  for (var i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase
    ? function (val) { return map[val.toLowerCase()]; }
    : function (val) { return map[val]; }
}

/**
 * Check if a tag is a built-in tag.
 */
var isBuiltInTag = makeMap('slot,component', true);

/**
 * Remove an item from an array
 */
function remove$1 (arr, item) {
  if (arr.length) {
    var index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

/**
 * Check whether the object has the property.
 */
var hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn (obj, key) {
  return hasOwnProperty.call(obj, key)
}

/**
 * Check if value is primitive
 */
function isPrimitive (value) {
  return typeof value === 'string' || typeof value === 'number'
}

/**
 * Create a cached version of a pure function.
 */
function cached (fn) {
  var cache = Object.create(null);
  return function cachedFn (str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str))
  }
}

/**
 * Camelize a hyphen-delmited string.
 */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) { return c ? c.toUpperCase() : ''; })
});

/**
 * Capitalize a string.
 */
var capitalize = cached(function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
});

/**
 * Hyphenate a camelCase string.
 */
var hyphenateRE = /([^-])([A-Z])/g;
var hyphenate = cached(function (str) {
  return str
    .replace(hyphenateRE, '$1-$2')
    .replace(hyphenateRE, '$1-$2')
    .toLowerCase()
});

/**
 * Simple bind, faster than native
 */
function bind$1 (fn, ctx) {
  function boundFn (a) {
    var l = arguments.length;
    return l
      ? l > 1
        ? fn.apply(ctx, arguments)
        : fn.call(ctx, a)
      : fn.call(ctx)
  }
  // record original fn length
  boundFn._length = fn.length;
  return boundFn
}

/**
 * Convert an Array-like object to a real Array.
 */
function toArray (list, start) {
  start = start || 0;
  var i = list.length - start;
  var ret = new Array(i);
  while (i--) {
    ret[i] = list[i + start];
  }
  return ret
}

/**
 * Mix properties into target object.
 */
function extend (to, _from) {
  for (var key in _from) {
    to[key] = _from[key];
  }
  return to
}

/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 */
function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
var toString = Object.prototype.toString;
var OBJECT_STRING = '[object Object]';
function isPlainObject (obj) {
  return toString.call(obj) === OBJECT_STRING
}

/**
 * Merge an Array of Objects into a single Object.
 */
function toObject (arr) {
  var res = {};
  for (var i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i]);
    }
  }
  return res
}

/**
 * Perform no operation.
 */
function noop () {}

/**
 * Always return false.
 */
var no = function () { return false; };

/**
 * Generate a static keys string from compiler modules.
 */
function genStaticKeys (modules) {
  return modules.reduce(function (keys, m) {
    return keys.concat(m.staticKeys || [])
  }, []).join(',')
}

/**
 * Check if two values are loosely equal - that is,
 * if they are plain objects, do they have the same shape?
 */
function looseEqual (a, b) {
  /* eslint-disable eqeqeq */
  return a == b || (
    isObject(a) && isObject(b)
      ? JSON.stringify(a) === JSON.stringify(b)
      : false
  )
  /* eslint-enable eqeqeq */
}

function looseIndexOf (arr, val) {
  for (var i = 0; i < arr.length; i++) {
    if (looseEqual(arr[i], val)) { return i }
  }
  return -1
}

/*  */

var config = {
  /**
   * Option merge strategies (used in core/util/options)
   */
  optionMergeStrategies: Object.create(null),

  /**
   * Whether to suppress warnings.
   */
  silent: false,

  /**
   * Whether to enable devtools
   */
  devtools: process.env.NODE_ENV !== 'production',

  /**
   * Error handler for watcher errors
   */
  errorHandler: null,

  /**
   * Ignore certain custom elements
   */
  ignoredElements: null,

  /**
   * Custom user key aliases for v-on
   */
  keyCodes: Object.create(null),

  /**
   * Check if a tag is reserved so that it cannot be registered as a
   * component. This is platform-dependent and may be overwritten.
   */
  isReservedTag: no,

  /**
   * Check if a tag is an unknown element.
   * Platform-dependent.
   */
  isUnknownElement: no,

  /**
   * Get the namespace of an element
   */
  getTagNamespace: noop,

  /**
   * Check if an attribute must be bound using property, e.g. value
   * Platform-dependent.
   */
  mustUseProp: no,

  /**
   * List of asset types that a component can own.
   */
  _assetTypes: [
    'component',
    'directive',
    'filter'
  ],

  /**
   * List of lifecycle hooks.
   */
  _lifecycleHooks: [
    'beforeCreate',
    'created',
    'beforeMount',
    'mounted',
    'beforeUpdate',
    'updated',
    'beforeDestroy',
    'destroyed',
    'activated',
    'deactivated'
  ],

  /**
   * Max circular updates allowed in a scheduler flush cycle.
   */
  _maxUpdateCount: 100,

  /**
   * Server rendering?
   */
  _isServer: process.env.VUE_ENV === 'server'
};

/*  */

/**
 * Check if a string starts with $ or _
 */
function isReserved (str) {
  var c = (str + '').charCodeAt(0);
  return c === 0x24 || c === 0x5F
}

/**
 * Define a property.
 */
function def (obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}

/**
 * Parse simple path.
 */
var bailRE = /[^\w.$]/;
function parsePath (path) {
  if (bailRE.test(path)) {
    return
  } else {
    var segments = path.split('.');
    return function (obj) {
      for (var i = 0; i < segments.length; i++) {
        if (!obj) { return }
        obj = obj[segments[i]];
      }
      return obj
    }
  }
}

/*  */
/* globals MutationObserver */

// can we use __proto__?
var hasProto = '__proto__' in {};

// Browser environment sniffing
var inBrowser =
  typeof window !== 'undefined' &&
  Object.prototype.toString.call(window) !== '[object Object]';

var UA = inBrowser && window.navigator.userAgent.toLowerCase();
var isIE = UA && /msie|trident/.test(UA);
var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
var isEdge = UA && UA.indexOf('edge/') > 0;
var isAndroid = UA && UA.indexOf('android') > 0;
var isIOS = UA && /iphone|ipad|ipod|ios/.test(UA);

// detect devtools
var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

/* istanbul ignore next */
function isNative (Ctor) {
  return /native code/.test(Ctor.toString())
}

/**
 * Defer a task to execute it asynchronously.
 */
var nextTick = (function () {
  var callbacks = [];
  var pending = false;
  var timerFunc;

  function nextTickHandler () {
    pending = false;
    var copies = callbacks.slice(0);
    callbacks.length = 0;
    for (var i = 0; i < copies.length; i++) {
      copies[i]();
    }
  }

  // the nextTick behavior leverages the microtask queue, which can be accessed
  // via either native Promise.then or MutationObserver.
  // MutationObserver has wider support, however it is seriously bugged in
  // UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It
  // completely stops working after triggering a few times... so, if native
  // Promise is available, we will use it:
  /* istanbul ignore if */
  if (typeof Promise !== 'undefined' && isNative(Promise)) {
    var p = Promise.resolve();
    timerFunc = function () {
      p.then(nextTickHandler);
      // in problematic UIWebViews, Promise.then doesn't completely break, but
      // it can get stuck in a weird state where callbacks are pushed into the
      // microtask queue but the queue isn't being flushed, until the browser
      // needs to do some other work, e.g. handle a timer. Therefore we can
      // "force" the microtask queue to be flushed by adding an empty timer.
      if (isIOS) { setTimeout(noop); }
    };
  } else if (typeof MutationObserver !== 'undefined' && (
    isNative(MutationObserver) ||
    // PhantomJS and iOS 7.x
    MutationObserver.toString() === '[object MutationObserverConstructor]'
  )) {
    // use MutationObserver where native Promise is not available,
    // e.g. PhantomJS IE11, iOS7, Android 4.4
    var counter = 1;
    var observer = new MutationObserver(nextTickHandler);
    var textNode = document.createTextNode(String(counter));
    observer.observe(textNode, {
      characterData: true
    });
    timerFunc = function () {
      counter = (counter + 1) % 2;
      textNode.data = String(counter);
    };
  } else {
    // fallback to setTimeout
    /* istanbul ignore next */
    timerFunc = function () {
      setTimeout(nextTickHandler, 0);
    };
  }

  return function queueNextTick (cb, ctx) {
    var func = ctx
      ? function () { cb.call(ctx); }
      : cb;
    callbacks.push(func);
    if (!pending) {
      pending = true;
      timerFunc();
    }
  }
})();

var _Set;
/* istanbul ignore if */
if (typeof Set !== 'undefined' && isNative(Set)) {
  // use native Set when available.
  _Set = Set;
} else {
  // a non-standard Set polyfill that only works with primitive keys.
  _Set = (function () {
    function Set () {
      this.set = Object.create(null);
    }
    Set.prototype.has = function has (key) {
      return this.set[key] !== undefined
    };
    Set.prototype.add = function add (key) {
      this.set[key] = 1;
    };
    Set.prototype.clear = function clear () {
      this.set = Object.create(null);
    };

    return Set;
  }());
}

/* not type checking this file because flow doesn't play well with Proxy */

var hasProxy;
var proxyHandlers;
var initProxy;

if (process.env.NODE_ENV !== 'production') {
  var allowedGlobals = makeMap(
    'Infinity,undefined,NaN,isFinite,isNaN,' +
    'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
    'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' +
    'require' // for Webpack/Browserify
  );

  hasProxy =
    typeof Proxy !== 'undefined' &&
    Proxy.toString().match(/native code/);

  proxyHandlers = {
    has: function has (target, key) {
      var has = key in target;
      var isAllowed = allowedGlobals(key) || key.charAt(0) === '_';
      if (!has && !isAllowed) {
        warn(
          "Property or method \"" + key + "\" is not defined on the instance but " +
          "referenced during render. Make sure to declare reactive data " +
          "properties in the data option.",
          target
        );
      }
      return has || !isAllowed
    }
  };

  initProxy = function initProxy (vm) {
    if (hasProxy) {
      vm._renderProxy = new Proxy(vm, proxyHandlers);
    } else {
      vm._renderProxy = vm;
    }
  };
}

/*  */


var uid$2 = 0;

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
var Dep = function Dep () {
  this.id = uid$2++;
  this.subs = [];
};

Dep.prototype.addSub = function addSub (sub) {
  this.subs.push(sub);
};

Dep.prototype.removeSub = function removeSub (sub) {
  remove$1(this.subs, sub);
};

Dep.prototype.depend = function depend () {
  if (Dep.target) {
    Dep.target.addDep(this);
  }
};

Dep.prototype.notify = function notify () {
  // stablize the subscriber list first
  var subs = this.subs.slice();
  for (var i = 0, l = subs.length; i < l; i++) {
    subs[i].update();
  }
};

// the current target watcher being evaluated.
// this is globally unique because there could be only one
// watcher being evaluated at any time.
Dep.target = null;
var targetStack = [];

function pushTarget (_target) {
  if (Dep.target) { targetStack.push(Dep.target); }
  Dep.target = _target;
}

function popTarget () {
  Dep.target = targetStack.pop();
}

/*  */


var queue = [];
var has$1 = {};
var circular = {};
var waiting = false;
var flushing = false;
var index = 0;

/**
 * Reset the scheduler's state.
 */
function resetSchedulerState () {
  queue.length = 0;
  has$1 = {};
  if (process.env.NODE_ENV !== 'production') {
    circular = {};
  }
  waiting = flushing = false;
}

/**
 * Flush both queues and run the watchers.
 */
function flushSchedulerQueue () {
  flushing = true;

  // Sort queue before flush.
  // This ensures that:
  // 1. Components are updated from parent to child. (because parent is always
  //    created before the child)
  // 2. A component's user watchers are run before its render watcher (because
  //    user watchers are created before the render watcher)
  // 3. If a component is destroyed during a parent component's watcher run,
  //    its watchers can be skipped.
  queue.sort(function (a, b) { return a.id - b.id; });

  // do not cache length because more watchers might be pushed
  // as we run existing watchers
  for (index = 0; index < queue.length; index++) {
    var watcher = queue[index];
    var id = watcher.id;
    has$1[id] = null;
    watcher.run();
    // in dev build, check and stop circular updates.
    if (process.env.NODE_ENV !== 'production' && has$1[id] != null) {
      circular[id] = (circular[id] || 0) + 1;
      if (circular[id] > config._maxUpdateCount) {
        warn(
          'You may have an infinite update loop ' + (
            watcher.user
              ? ("in watcher with expression \"" + (watcher.expression) + "\"")
              : "in a component render function."
          ),
          watcher.vm
        );
        break
      }
    }
  }

  // devtool hook
  /* istanbul ignore if */
  if (devtools && config.devtools) {
    devtools.emit('flush');
  }

  resetSchedulerState();
}

/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 */
function queueWatcher (watcher) {
  var id = watcher.id;
  if (has$1[id] == null) {
    has$1[id] = true;
    if (!flushing) {
      queue.push(watcher);
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      var i = queue.length - 1;
      while (i >= 0 && queue[i].id > watcher.id) {
        i--;
      }
      queue.splice(Math.max(i, index) + 1, 0, watcher);
    }
    // queue the flush
    if (!waiting) {
      waiting = true;
      nextTick(flushSchedulerQueue);
    }
  }
}

/*  */

var uid$1 = 0;

/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 */
var Watcher = function Watcher (
  vm,
  expOrFn,
  cb,
  options
) {
  if ( options === void 0 ) options = {};

  this.vm = vm;
  vm._watchers.push(this);
  // options
  this.deep = !!options.deep;
  this.user = !!options.user;
  this.lazy = !!options.lazy;
  this.sync = !!options.sync;
  this.expression = expOrFn.toString();
  this.cb = cb;
  this.id = ++uid$1; // uid for batching
  this.active = true;
  this.dirty = this.lazy; // for lazy watchers
  this.deps = [];
  this.newDeps = [];
  this.depIds = new _Set();
  this.newDepIds = new _Set();
  // parse expression for getter
  if (typeof expOrFn === 'function') {
    this.getter = expOrFn;
  } else {
    this.getter = parsePath(expOrFn);
    if (!this.getter) {
      this.getter = function () {};
      process.env.NODE_ENV !== 'production' && warn(
        "Failed watching path: \"" + expOrFn + "\" " +
        'Watcher only accepts simple dot-delimited paths. ' +
        'For full control, use a function instead.',
        vm
      );
    }
  }
  this.value = this.lazy
    ? undefined
    : this.get();
};

/**
 * Evaluate the getter, and re-collect dependencies.
 */
Watcher.prototype.get = function get () {
  pushTarget(this);
  var value = this.getter.call(this.vm, this.vm);
  // "touch" every property so they are all tracked as
  // dependencies for deep watching
  if (this.deep) {
    traverse(value);
  }
  popTarget();
  this.cleanupDeps();
  return value
};

/**
 * Add a dependency to this directive.
 */
Watcher.prototype.addDep = function addDep (dep) {
  var id = dep.id;
  if (!this.newDepIds.has(id)) {
    this.newDepIds.add(id);
    this.newDeps.push(dep);
    if (!this.depIds.has(id)) {
      dep.addSub(this);
    }
  }
};

/**
 * Clean up for dependency collection.
 */
Watcher.prototype.cleanupDeps = function cleanupDeps () {
    var this$1 = this;

  var i = this.deps.length;
  while (i--) {
    var dep = this$1.deps[i];
    if (!this$1.newDepIds.has(dep.id)) {
      dep.removeSub(this$1);
    }
  }
  var tmp = this.depIds;
  this.depIds = this.newDepIds;
  this.newDepIds = tmp;
  this.newDepIds.clear();
  tmp = this.deps;
  this.deps = this.newDeps;
  this.newDeps = tmp;
  this.newDeps.length = 0;
};

/**
 * Subscriber interface.
 * Will be called when a dependency changes.
 */
Watcher.prototype.update = function update () {
  /* istanbul ignore else */
  if (this.lazy) {
    this.dirty = true;
  } else if (this.sync) {
    this.run();
  } else {
    queueWatcher(this);
  }
};

/**
 * Scheduler job interface.
 * Will be called by the scheduler.
 */
Watcher.prototype.run = function run () {
  if (this.active) {
    var value = this.get();
      if (
        value !== this.value ||
      // Deep watchers and watchers on Object/Arrays should fire even
      // when the value is the same, because the value may
      // have mutated.
      isObject(value) ||
      this.deep
    ) {
      // set new value
      var oldValue = this.value;
      this.value = value;
      if (this.user) {
        try {
          this.cb.call(this.vm, value, oldValue);
        } catch (e) {
          process.env.NODE_ENV !== 'production' && warn(
            ("Error in watcher \"" + (this.expression) + "\""),
            this.vm
          );
          /* istanbul ignore else */
          if (config.errorHandler) {
            config.errorHandler.call(null, e, this.vm);
          } else {
            throw e
          }
        }
      } else {
        this.cb.call(this.vm, value, oldValue);
      }
    }
  }
};

/**
 * Evaluate the value of the watcher.
 * This only gets called for lazy watchers.
 */
Watcher.prototype.evaluate = function evaluate () {
  this.value = this.get();
  this.dirty = false;
};

/**
 * Depend on all deps collected by this watcher.
 */
Watcher.prototype.depend = function depend () {
    var this$1 = this;

  var i = this.deps.length;
  while (i--) {
    this$1.deps[i].depend();
  }
};

/**
 * Remove self from all dependencies' subscriber list.
 */
Watcher.prototype.teardown = function teardown () {
    var this$1 = this;

  if (this.active) {
    // remove self from vm's watcher list
    // this is a somewhat expensive operation so we skip it
    // if the vm is being destroyed or is performing a v-for
    // re-render (the watcher list is then filtered by v-for).
    if (!this.vm._isBeingDestroyed && !this.vm._vForRemoving) {
      remove$1(this.vm._watchers, this);
    }
    var i = this.deps.length;
    while (i--) {
      this$1.deps[i].removeSub(this$1);
    }
    this.active = false;
  }
};

/**
 * Recursively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 */
var seenObjects = new _Set();
function traverse (val) {
  seenObjects.clear();
  _traverse(val, seenObjects);
}

function _traverse (val, seen) {
  var i, keys;
  var isA = Array.isArray(val);
  if ((!isA && !isObject(val)) || !Object.isExtensible(val)) {
    return
  }
  if (val.__ob__) {
    var depId = val.__ob__.dep.id;
    if (seen.has(depId)) {
      return
    }
    seen.add(depId);
  }
  if (isA) {
    i = val.length;
    while (i--) { _traverse(val[i], seen); }
  } else {
    keys = Object.keys(val);
    i = keys.length;
    while (i--) { _traverse(val[keys[i]], seen); }
  }
}

/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

var arrayProto = Array.prototype;
var arrayMethods = Object.create(arrayProto);[
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]
.forEach(function (method) {
  // cache original method
  var original = arrayProto[method];
  def(arrayMethods, method, function mutator () {
    var arguments$1 = arguments;

    // avoid leaking arguments:
    // http://jsperf.com/closure-with-arguments
    var i = arguments.length;
    var args = new Array(i);
    while (i--) {
      args[i] = arguments$1[i];
    }
    var result = original.apply(this, args);
    var ob = this.__ob__;
    var inserted;
    switch (method) {
      case 'push':
        inserted = args;
        break
      case 'unshift':
        inserted = args;
        break
      case 'splice':
        inserted = args.slice(2);
        break
    }
    if (inserted) { ob.observeArray(inserted); }
    // notify change
    ob.dep.notify();
    return result
  });
});

/*  */

var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

/**
 * By default, when a reactive property is set, the new value is
 * also converted to become reactive. However when passing down props,
 * we don't want to force conversion because the value may be a nested value
 * under a frozen data structure. Converting it would defeat the optimization.
 */
var observerState = {
  shouldConvert: true,
  isSettingProps: false
};

/**
 * Observer class that are attached to each observed
 * object. Once attached, the observer converts target
 * object's property keys into getter/setters that
 * collect dependencies and dispatches updates.
 */
var Observer = function Observer (value) {
  this.value = value;
  this.dep = new Dep();
  this.vmCount = 0;
  def(value, '__ob__', this);
  if (Array.isArray(value)) {
    var augment = hasProto
      ? protoAugment
      : copyAugment;
    augment(value, arrayMethods, arrayKeys);
    this.observeArray(value);
  } else {
    this.walk(value);
  }
};

/**
 * Walk through each property and convert them into
 * getter/setters. This method should only be called when
 * value type is Object.
 */
Observer.prototype.walk = function walk (obj) {
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    defineReactive$$1(obj, keys[i], obj[keys[i]]);
  }
};

/**
 * Observe a list of Array items.
 */
Observer.prototype.observeArray = function observeArray (items) {
  for (var i = 0, l = items.length; i < l; i++) {
    observe(items[i]);
  }
};

// helpers

/**
 * Augment an target Object or Array by intercepting
 * the prototype chain using __proto__
 */
function protoAugment (target, src) {
  /* eslint-disable no-proto */
  target.__proto__ = src;
  /* eslint-enable no-proto */
}

/**
 * Augment an target Object or Array by defining
 * hidden properties.
 *
 * istanbul ignore next
 */
function copyAugment (target, src, keys) {
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    def(target, key, src[key]);
  }
}

/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
function observe (value) {
  if (!isObject(value)) {
    return
  }
  var ob;
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else if (
    observerState.shouldConvert &&
    !config._isServer &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value);
  }
  return ob
}

/**
 * Define a reactive property on an Object.
 */
function defineReactive$$1 (
  obj,
  key,
  val,
  customSetter
) {
  var dep = new Dep();

  var property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  var getter = property && property.get;
  var setter = property && property.set;

  var childOb = observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      var value = getter ? getter.call(obj) : val;
      if (Dep.target) {
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
        }
        if (Array.isArray(value)) {
          dependArray(value);
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      var value = getter ? getter.call(obj) : val;
      if (newVal === value) {
        return
      }
      if (process.env.NODE_ENV !== 'production' && customSetter) {
        customSetter();
      }
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      childOb = observe(newVal);
      dep.notify();
    }
  });
}

/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 */
function set (obj, key, val) {
  if (Array.isArray(obj)) {
    obj.length = Math.max(obj.length, key);
    obj.splice(key, 1, val);
    return val
  }
  if (hasOwn(obj, key)) {
    obj[key] = val;
    return
  }
  var ob = obj.__ob__;
  if (obj._isVue || (ob && ob.vmCount)) {
    process.env.NODE_ENV !== 'production' && warn(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
      'at runtime - declare it upfront in the data option.'
    );
    return
  }
  if (!ob) {
    obj[key] = val;
    return
  }
  defineReactive$$1(ob.value, key, val);
  ob.dep.notify();
  return val
}

/**
 * Delete a property and trigger change if necessary.
 */
function del (obj, key) {
  var ob = obj.__ob__;
  if (obj._isVue || (ob && ob.vmCount)) {
    process.env.NODE_ENV !== 'production' && warn(
      'Avoid deleting properties on a Vue instance or its root $data ' +
      '- just set it to null.'
    );
    return
  }
  if (!hasOwn(obj, key)) {
    return
  }
  delete obj[key];
  if (!ob) {
    return
  }
  ob.dep.notify();
}

/**
 * Collect dependencies on array elements when the array is touched, since
 * we cannot intercept array element access like property getters.
 */
function dependArray (value) {
  for (var e = (void 0), i = 0, l = value.length; i < l; i++) {
    e = value[i];
    e && e.__ob__ && e.__ob__.dep.depend();
    if (Array.isArray(e)) {
      dependArray(e);
    }
  }
}

/*  */

function initState (vm) {
  vm._watchers = [];
  initProps(vm);
  initData(vm);
  initComputed(vm);
  initMethods(vm);
  initWatch(vm);
}

function initProps (vm) {
  var props = vm.$options.props;
  if (props) {
    var propsData = vm.$options.propsData || {};
    var keys = vm.$options._propKeys = Object.keys(props);
    var isRoot = !vm.$parent;
    // root instance props should be converted
    observerState.shouldConvert = isRoot;
    var loop = function ( i ) {
      var key = keys[i];
      /* istanbul ignore else */
      if (process.env.NODE_ENV !== 'production') {
        defineReactive$$1(vm, key, validateProp(key, props, propsData, vm), function () {
          if (vm.$parent && !observerState.isSettingProps) {
            warn(
              "Avoid mutating a prop directly since the value will be " +
              "overwritten whenever the parent component re-renders. " +
              "Instead, use a data or computed property based on the prop's " +
              "value. Prop being mutated: \"" + key + "\"",
              vm
            );
          }
        });
      } else {
        defineReactive$$1(vm, key, validateProp(key, props, propsData, vm));
      }
    };

    for (var i = 0; i < keys.length; i++) loop( i );
    observerState.shouldConvert = true;
  }
}

function initData (vm) {
  var data = vm.$options.data;
  data = vm._data = typeof data === 'function'
    ? data.call(vm)
    : data || {};
  if (!isPlainObject(data)) {
    data = {};
    process.env.NODE_ENV !== 'production' && warn(
      'data functions should return an object.',
      vm
    );
  }
  // proxy data on instance
  var keys = Object.keys(data);
  var props = vm.$options.props;
  var i = keys.length;
  while (i--) {
    if (props && hasOwn(props, keys[i])) {
      process.env.NODE_ENV !== 'production' && warn(
        "The data property \"" + (keys[i]) + "\" is already declared as a prop. " +
        "Use prop default value instead.",
        vm
      );
    } else {
      proxy(vm, keys[i]);
    }
  }
  // observe data
  observe(data);
  data.__ob__ && data.__ob__.vmCount++;
}

var computedSharedDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
};

function initComputed (vm) {
  var computed = vm.$options.computed;
  if (computed) {
    for (var key in computed) {
      var userDef = computed[key];
      if (typeof userDef === 'function') {
        computedSharedDefinition.get = makeComputedGetter(userDef, vm);
        computedSharedDefinition.set = noop;
      } else {
        computedSharedDefinition.get = userDef.get
          ? userDef.cache !== false
            ? makeComputedGetter(userDef.get, vm)
            : bind$1(userDef.get, vm)
          : noop;
        computedSharedDefinition.set = userDef.set
          ? bind$1(userDef.set, vm)
          : noop;
      }
      Object.defineProperty(vm, key, computedSharedDefinition);
    }
  }
}

function makeComputedGetter (getter, owner) {
  var watcher = new Watcher(owner, getter, noop, {
    lazy: true
  });
  return function computedGetter () {
    if (watcher.dirty) {
      watcher.evaluate();
    }
    if (Dep.target) {
      watcher.depend();
    }
    return watcher.value
  }
}

function initMethods (vm) {
  var methods = vm.$options.methods;
  if (methods) {
    for (var key in methods) {
      vm[key] = methods[key] == null ? noop : bind$1(methods[key], vm);
      if (process.env.NODE_ENV !== 'production' && methods[key] == null) {
        warn(
          "method \"" + key + "\" has an undefined value in the component definition. " +
          "Did you reference the function correctly?",
          vm
        );
      }
    }
  }
}

function initWatch (vm) {
  var watch = vm.$options.watch;
  if (watch) {
    for (var key in watch) {
      var handler = watch[key];
      if (Array.isArray(handler)) {
        for (var i = 0; i < handler.length; i++) {
          createWatcher(vm, key, handler[i]);
        }
      } else {
        createWatcher(vm, key, handler);
      }
    }
  }
}

function createWatcher (vm, key, handler) {
  var options;
  if (isPlainObject(handler)) {
    options = handler;
    handler = handler.handler;
  }
  if (typeof handler === 'string') {
    handler = vm[handler];
  }
  vm.$watch(key, handler, options);
}

function stateMixin (Vue) {
  // flow somehow has problems with directly declared definition object
  // when using Object.defineProperty, so we have to procedurally build up
  // the object here.
  var dataDef = {};
  dataDef.get = function () {
    return this._data
  };
  if (process.env.NODE_ENV !== 'production') {
    dataDef.set = function (newData) {
      warn(
        'Avoid replacing instance root $data. ' +
        'Use nested data properties instead.',
        this
      );
    };
  }
  Object.defineProperty(Vue.prototype, '$data', dataDef);

  Vue.prototype.$set = set;
  Vue.prototype.$delete = del;

  Vue.prototype.$watch = function (
    expOrFn,
    cb,
    options
  ) {
    var vm = this;
    options = options || {};
    options.user = true;
    var watcher = new Watcher(vm, expOrFn, cb, options);
    if (options.immediate) {
      cb.call(vm, watcher.value);
    }
    return function unwatchFn () {
      watcher.teardown();
    }
  };
}

function proxy (vm, key) {
  if (!isReserved(key)) {
    Object.defineProperty(vm, key, {
      configurable: true,
      enumerable: true,
      get: function proxyGetter () {
        return vm._data[key]
      },
      set: function proxySetter (val) {
        vm._data[key] = val;
      }
    });
  }
}

/*  */

var VNode = function VNode (
  tag,
  data,
  children,
  text,
  elm,
  ns,
  context,
  componentOptions
) {
  this.tag = tag;
  this.data = data;
  this.children = children;
  this.text = text;
  this.elm = elm;
  this.ns = ns;
  this.context = context;
  this.functionalContext = undefined;
  this.key = data && data.key;
  this.componentOptions = componentOptions;
  this.child = undefined;
  this.parent = undefined;
  this.raw = false;
  this.isStatic = false;
  this.isRootInsert = true;
  this.isComment = false;
  this.isCloned = false;
  this.isOnce = false;
};

var emptyVNode = function () {
  var node = new VNode();
  node.text = '';
  node.isComment = true;
  return node
};

// optimized shallow clone
// used for static nodes and slot nodes because they may be reused across
// multiple renders, cloning them avoids errors when DOM manipulations rely
// on their elm reference.
function cloneVNode (vnode) {
  var cloned = new VNode(
    vnode.tag,
    vnode.data,
    vnode.children,
    vnode.text,
    vnode.elm,
    vnode.ns,
    vnode.context,
    vnode.componentOptions
  );
  cloned.isStatic = vnode.isStatic;
  cloned.key = vnode.key;
  cloned.isCloned = true;
  return cloned
}

function cloneVNodes (vnodes) {
  var res = new Array(vnodes.length);
  for (var i = 0; i < vnodes.length; i++) {
    res[i] = cloneVNode(vnodes[i]);
  }
  return res
}

/*  */

function mergeVNodeHook (def, hookKey, hook, key) {
  key = key + hookKey;
  var injectedHash = def.__injected || (def.__injected = {});
  if (!injectedHash[key]) {
    injectedHash[key] = true;
    var oldHook = def[hookKey];
    if (oldHook) {
      def[hookKey] = function () {
        oldHook.apply(this, arguments);
        hook.apply(this, arguments);
      };
    } else {
      def[hookKey] = hook;
    }
  }
}

/*  */

function updateListeners (
  on,
  oldOn,
  add,
  remove$$1,
  vm
) {
  var name, cur, old, fn, event, capture;
  for (name in on) {
    cur = on[name];
    old = oldOn[name];
    if (!cur) {
      process.env.NODE_ENV !== 'production' && warn(
        "Invalid handler for event \"" + name + "\": got " + String(cur),
        vm
      );
    } else if (!old) {
      capture = name.charAt(0) === '!';
      event = capture ? name.slice(1) : name;
      if (Array.isArray(cur)) {
        add(event, (cur.invoker = arrInvoker(cur)), capture);
      } else {
        if (!cur.invoker) {
          fn = cur;
          cur = on[name] = {};
          cur.fn = fn;
          cur.invoker = fnInvoker(cur);
        }
        add(event, cur.invoker, capture);
      }
    } else if (cur !== old) {
      if (Array.isArray(old)) {
        old.length = cur.length;
        for (var i = 0; i < old.length; i++) { old[i] = cur[i]; }
        on[name] = old;
      } else {
        old.fn = cur;
        on[name] = old;
      }
    }
  }
  for (name in oldOn) {
    if (!on[name]) {
      event = name.charAt(0) === '!' ? name.slice(1) : name;
      remove$$1(event, oldOn[name].invoker);
    }
  }
}

function arrInvoker (arr) {
  return function (ev) {
    var arguments$1 = arguments;

    var single = arguments.length === 1;
    for (var i = 0; i < arr.length; i++) {
      single ? arr[i](ev) : arr[i].apply(null, arguments$1);
    }
  }
}

function fnInvoker (o) {
  return function (ev) {
    var single = arguments.length === 1;
    single ? o.fn(ev) : o.fn.apply(null, arguments);
  }
}

/*  */

function normalizeChildren (
  children,
  ns,
  nestedIndex
) {
  if (isPrimitive(children)) {
    return [createTextVNode(children)]
  }
  if (Array.isArray(children)) {
    var res = [];
    for (var i = 0, l = children.length; i < l; i++) {
      var c = children[i];
      var last = res[res.length - 1];
      //  nested
      if (Array.isArray(c)) {
        res.push.apply(res, normalizeChildren(c, ns, ((nestedIndex || '') + "_" + i)));
      } else if (isPrimitive(c)) {
        if (last && last.text) {
          last.text += String(c);
        } else if (c !== '') {
          // convert primitive to vnode
          res.push(createTextVNode(c));
        }
      } else if (c instanceof VNode) {
        if (c.text && last && last.text) {
          if (!last.isCloned) {
            last.text += c.text;
          }
        } else {
          // inherit parent namespace
          if (ns) {
            applyNS(c, ns);
          }
          // default key for nested array children (likely generated by v-for)
          if (c.tag && c.key == null && nestedIndex != null) {
            c.key = "__vlist" + nestedIndex + "_" + i + "__";
          }
          res.push(c);
        }
      }
    }
    return res
  }
}

function createTextVNode (val) {
  return new VNode(undefined, undefined, undefined, String(val))
}

function applyNS (vnode, ns) {
  if (vnode.tag && !vnode.ns) {
    vnode.ns = ns;
    if (vnode.children) {
      for (var i = 0, l = vnode.children.length; i < l; i++) {
        applyNS(vnode.children[i], ns);
      }
    }
  }
}

/*  */

function getFirstComponentChild (children) {
  return children && children.filter(function (c) { return c && c.componentOptions; })[0]
}

/*  */

var activeInstance = null;

function initLifecycle (vm) {
  var options = vm.$options;

  // locate first non-abstract parent
  var parent = options.parent;
  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent;
    }
    parent.$children.push(vm);
  }

  vm.$parent = parent;
  vm.$root = parent ? parent.$root : vm;

  vm.$children = [];
  vm.$refs = {};

  vm._watcher = null;
  vm._inactive = false;
  vm._isMounted = false;
  vm._isDestroyed = false;
  vm._isBeingDestroyed = false;
}

function lifecycleMixin (Vue) {
  Vue.prototype._mount = function (
    el,
    hydrating
  ) {
    var vm = this;
    vm.$el = el;
    if (!vm.$options.render) {
      vm.$options.render = emptyVNode;
      if (process.env.NODE_ENV !== 'production') {
        /* istanbul ignore if */
        if (vm.$options.template && vm.$options.template.charAt(0) !== '#') {
          warn(
            'You are using the runtime-only build of Vue where the template ' +
            'option is not available. Either pre-compile the templates into ' +
            'render functions, or use the compiler-included build.',
            vm
          );
        } else {
          warn(
            'Failed to mount component: template or render function not defined.',
            vm
          );
        }
      }
    }
    callHook(vm, 'beforeMount');
    vm._watcher = new Watcher(vm, function () {
      vm._update(vm._render(), hydrating);
    }, noop);
    hydrating = false;
    // manually mounted instance, call mounted on self
    // mounted is called for render-created child components in its inserted hook
    if (vm.$vnode == null) {
      vm._isMounted = true;
      callHook(vm, 'mounted');
    }
    return vm
  };

  Vue.prototype._update = function (vnode, hydrating) {
    var vm = this;
    if (vm._isMounted) {
      callHook(vm, 'beforeUpdate');
    }
    var prevEl = vm.$el;
    var prevActiveInstance = activeInstance;
    activeInstance = vm;
    var prevVnode = vm._vnode;
    vm._vnode = vnode;
    if (!prevVnode) {
      // Vue.prototype.__patch__ is injected in entry points
      // based on the rendering backend used.
      vm.$el = vm.__patch__(vm.$el, vnode, hydrating);
    } else {
      vm.$el = vm.__patch__(prevVnode, vnode);
    }
    activeInstance = prevActiveInstance;
    // update __vue__ reference
    if (prevEl) {
      prevEl.__vue__ = null;
    }
    if (vm.$el) {
      vm.$el.__vue__ = vm;
    }
    // if parent is an HOC, update its $el as well
    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el;
    }
    if (vm._isMounted) {
      callHook(vm, 'updated');
    }
  };

  Vue.prototype._updateFromParent = function (
    propsData,
    listeners,
    parentVnode,
    renderChildren
  ) {
    var vm = this;
    var hasChildren = !!(vm.$options._renderChildren || renderChildren);
    vm.$options._parentVnode = parentVnode;
    vm.$options._renderChildren = renderChildren;
    // update props
    if (propsData && vm.$options.props) {
      observerState.shouldConvert = false;
      if (process.env.NODE_ENV !== 'production') {
        observerState.isSettingProps = true;
      }
      var propKeys = vm.$options._propKeys || [];
      for (var i = 0; i < propKeys.length; i++) {
        var key = propKeys[i];
        vm[key] = validateProp(key, vm.$options.props, propsData, vm);
      }
      observerState.shouldConvert = true;
      if (process.env.NODE_ENV !== 'production') {
        observerState.isSettingProps = false;
      }
      vm.$options.propsData = propsData;
    }
    // update listeners
    if (listeners) {
      var oldListeners = vm.$options._parentListeners;
      vm.$options._parentListeners = listeners;
      vm._updateListeners(listeners, oldListeners);
    }
    // resolve slots + force update if has children
    if (hasChildren) {
      vm.$slots = resolveSlots(renderChildren, vm._renderContext);
      vm.$forceUpdate();
    }
  };

  Vue.prototype.$forceUpdate = function () {
    var vm = this;
    if (vm._watcher) {
      vm._watcher.update();
    }
  };

  Vue.prototype.$destroy = function () {
    var vm = this;
    if (vm._isBeingDestroyed) {
      return
    }
    callHook(vm, 'beforeDestroy');
    vm._isBeingDestroyed = true;
    // remove self from parent
    var parent = vm.$parent;
    if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
      remove$1(parent.$children, vm);
    }
    // teardown watchers
    if (vm._watcher) {
      vm._watcher.teardown();
    }
    var i = vm._watchers.length;
    while (i--) {
      vm._watchers[i].teardown();
    }
    // remove reference from data ob
    // frozen object may not have observer.
    if (vm._data.__ob__) {
      vm._data.__ob__.vmCount--;
    }
    // call the last hook...
    vm._isDestroyed = true;
    callHook(vm, 'destroyed');
    // turn off all instance listeners.
    vm.$off();
    // remove __vue__ reference
    if (vm.$el) {
      vm.$el.__vue__ = null;
    }
    // invoke destroy hooks on current rendered tree
    vm.__patch__(vm._vnode, null);
  };
}

function callHook (vm, hook) {
  var handlers = vm.$options[hook];
  if (handlers) {
    for (var i = 0, j = handlers.length; i < j; i++) {
      handlers[i].call(vm);
    }
  }
  vm.$emit('hook:' + hook);
}

/*  */

var hooks = { init: init, prepatch: prepatch, insert: insert, destroy: destroy$1 };
var hooksToMerge = Object.keys(hooks);

function createComponent (
  Ctor,
  data,
  context,
  children,
  tag
) {
  if (!Ctor) {
    return
  }

  var baseCtor = context.$options._base;
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor);
  }

  if (typeof Ctor !== 'function') {
    if (process.env.NODE_ENV !== 'production') {
      warn(("Invalid Component definition: " + (String(Ctor))), context);
    }
    return
  }

  // async component
  if (!Ctor.cid) {
    if (Ctor.resolved) {
      Ctor = Ctor.resolved;
    } else {
      Ctor = resolveAsyncComponent(Ctor, baseCtor, function () {
        // it's ok to queue this on every render because
        // $forceUpdate is buffered by the scheduler.
        context.$forceUpdate();
      });
      if (!Ctor) {
        // return nothing if this is indeed an async component
        // wait for the callback to trigger parent update.
        return
      }
    }
  }

  // resolve constructor options in case global mixins are applied after
  // component constructor creation
  resolveConstructorOptions(Ctor);

  data = data || {};

  // extract props
  var propsData = extractProps(data, Ctor);

  // functional component
  if (Ctor.options.functional) {
    return createFunctionalComponent(Ctor, propsData, data, context, children)
  }

  // extract listeners, since these needs to be treated as
  // child component listeners instead of DOM listeners
  var listeners = data.on;
  // replace with listeners with .native modifier
  data.on = data.nativeOn;

  if (Ctor.options.abstract) {
    // abstract components do not keep anything
    // other than props & listeners
    data = {};
  }

  // merge component management hooks onto the placeholder node
  mergeHooks(data);

  // return a placeholder vnode
  var name = Ctor.options.name || tag;
  var vnode = new VNode(
    ("vue-component-" + (Ctor.cid) + (name ? ("-" + name) : '')),
    data, undefined, undefined, undefined, undefined, context,
    { Ctor: Ctor, propsData: propsData, listeners: listeners, tag: tag, children: children }
  );
  return vnode
}

function createFunctionalComponent (
  Ctor,
  propsData,
  data,
  context,
  children
) {
  var props = {};
  var propOptions = Ctor.options.props;
  if (propOptions) {
    for (var key in propOptions) {
      props[key] = validateProp(key, propOptions, propsData);
    }
  }
  var vnode = Ctor.options.render.call(
    null,
    // ensure the createElement function in functional components
    // gets a unique context - this is necessary for correct named slot check
    bind$1(createElement, { _self: Object.create(context) }),
    {
      props: props,
      data: data,
      parent: context,
      children: normalizeChildren(children),
      slots: function () { return resolveSlots(children, context); }
    }
  );
  if (vnode instanceof VNode) {
    vnode.functionalContext = context;
    if (data.slot) {
      (vnode.data || (vnode.data = {})).slot = data.slot;
    }
  }
  return vnode
}

function createComponentInstanceForVnode (
  vnode, // we know it's MountedComponentVNode but flow doesn't
  parent // activeInstance in lifecycle state
) {
  var vnodeComponentOptions = vnode.componentOptions;
  var options = {
    _isComponent: true,
    parent: parent,
    propsData: vnodeComponentOptions.propsData,
    _componentTag: vnodeComponentOptions.tag,
    _parentVnode: vnode,
    _parentListeners: vnodeComponentOptions.listeners,
    _renderChildren: vnodeComponentOptions.children
  };
  // check inline-template render functions
  var inlineTemplate = vnode.data.inlineTemplate;
  if (inlineTemplate) {
    options.render = inlineTemplate.render;
    options.staticRenderFns = inlineTemplate.staticRenderFns;
  }
  return new vnodeComponentOptions.Ctor(options)
}

function init (vnode, hydrating) {
  if (!vnode.child || vnode.child._isDestroyed) {
    var child = vnode.child = createComponentInstanceForVnode(vnode, activeInstance);
    child.$mount(hydrating ? vnode.elm : undefined, hydrating);
  }
}

function prepatch (
  oldVnode,
  vnode
) {
  var options = vnode.componentOptions;
  var child = vnode.child = oldVnode.child;
  child._updateFromParent(
    options.propsData, // updated props
    options.listeners, // updated listeners
    vnode, // new parent vnode
    options.children // new children
  );
}

function insert (vnode) {
  if (!vnode.child._isMounted) {
    vnode.child._isMounted = true;
    callHook(vnode.child, 'mounted');
  }
  if (vnode.data.keepAlive) {
    vnode.child._inactive = false;
    callHook(vnode.child, 'activated');
  }
}

function destroy$1 (vnode) {
  if (!vnode.child._isDestroyed) {
    if (!vnode.data.keepAlive) {
      vnode.child.$destroy();
    } else {
      vnode.child._inactive = true;
      callHook(vnode.child, 'deactivated');
    }
  }
}

function resolveAsyncComponent (
  factory,
  baseCtor,
  cb
) {
  if (factory.requested) {
    // pool callbacks
    factory.pendingCallbacks.push(cb);
  } else {
    factory.requested = true;
    var cbs = factory.pendingCallbacks = [cb];
    var sync = true;

    var resolve = function (res) {
      if (isObject(res)) {
        res = baseCtor.extend(res);
      }
      // cache resolved
      factory.resolved = res;
      // invoke callbacks only if this is not a synchronous resolve
      // (async resolves are shimmed as synchronous during SSR)
      if (!sync) {
        for (var i = 0, l = cbs.length; i < l; i++) {
          cbs[i](res);
        }
      }
    };

    var reject = function (reason) {
      process.env.NODE_ENV !== 'production' && warn(
        "Failed to resolve async component: " + (String(factory)) +
        (reason ? ("\nReason: " + reason) : '')
      );
    };

    var res = factory(resolve, reject);

    // handle promise
    if (res && typeof res.then === 'function' && !factory.resolved) {
      res.then(resolve, reject);
    }

    sync = false;
    // return in case resolved synchronously
    return factory.resolved
  }
}

function extractProps (data, Ctor) {
  // we are only extracting raw values here.
  // validation and default values are handled in the child
  // component itself.
  var propOptions = Ctor.options.props;
  if (!propOptions) {
    return
  }
  var res = {};
  var attrs = data.attrs;
  var props = data.props;
  var domProps = data.domProps;
  if (attrs || props || domProps) {
    for (var key in propOptions) {
      var altKey = hyphenate(key);
      checkProp(res, props, key, altKey, true) ||
      checkProp(res, attrs, key, altKey) ||
      checkProp(res, domProps, key, altKey);
    }
  }
  return res
}

function checkProp (
  res,
  hash,
  key,
  altKey,
  preserve
) {
  if (hash) {
    if (hasOwn(hash, key)) {
      res[key] = hash[key];
      if (!preserve) {
        delete hash[key];
      }
      return true
    } else if (hasOwn(hash, altKey)) {
      res[key] = hash[altKey];
      if (!preserve) {
        delete hash[altKey];
      }
      return true
    }
  }
  return false
}

function mergeHooks (data) {
  if (!data.hook) {
    data.hook = {};
  }
  for (var i = 0; i < hooksToMerge.length; i++) {
    var key = hooksToMerge[i];
    var fromParent = data.hook[key];
    var ours = hooks[key];
    data.hook[key] = fromParent ? mergeHook$1(ours, fromParent) : ours;
  }
}

function mergeHook$1 (a, b) {
  // since all hooks have at most two args, use fixed args
  // to avoid having to use fn.apply().
  return function (_, __) {
    a(_, __);
    b(_, __);
  }
}

/*  */

// wrapper function for providing a more flexible interface
// without getting yelled at by flow
function createElement (
  tag,
  data,
  children
) {
  if (data && (Array.isArray(data) || typeof data !== 'object')) {
    children = data;
    data = undefined;
  }
  // make sure to use real instance instead of proxy as context
  return _createElement(this._self, tag, data, children)
}

function _createElement (
  context,
  tag,
  data,
  children
) {
  if (data && data.__ob__) {
    process.env.NODE_ENV !== 'production' && warn(
      "Avoid using observed data object as vnode data: " + (JSON.stringify(data)) + "\n" +
      'Always create fresh vnode data objects in each render!',
      context
    );
    return
  }
  if (!tag) {
    // in case of component :is set to falsy value
    return emptyVNode()
  }
  if (typeof tag === 'string') {
    var Ctor;
    var ns = config.getTagNamespace(tag);
    if (config.isReservedTag(tag)) {
      // platform built-in elements
      return new VNode(
        tag, data, normalizeChildren(children, ns),
        undefined, undefined, ns, context
      )
    } else if ((Ctor = resolveAsset(context.$options, 'components', tag))) {
      // component
      return createComponent(Ctor, data, context, children, tag)
    } else {
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      var childNs = tag === 'foreignObject' ? 'xhtml' : ns;
      return new VNode(
        tag, data, normalizeChildren(children, childNs),
        undefined, undefined, ns, context
      )
    }
  } else {
    // direct component options / constructor
    return createComponent(tag, data, context, children)
  }
}

/*  */

function initRender (vm) {
  vm.$vnode = null; // the placeholder node in parent tree
  vm._vnode = null; // the root of the child tree
  vm._staticTrees = null;
  vm._renderContext = vm.$options._parentVnode && vm.$options._parentVnode.context;
  vm.$slots = resolveSlots(vm.$options._renderChildren, vm._renderContext);
  // bind the public createElement fn to this instance
  // so that we get proper render context inside it.
  vm.$createElement = bind$1(createElement, vm);
  if (vm.$options.el) {
    vm.$mount(vm.$options.el);
  }
}

function renderMixin (Vue) {
  Vue.prototype.$nextTick = function (fn) {
    nextTick(fn, this);
  };

  Vue.prototype._render = function () {
    var vm = this;
    var ref = vm.$options;
    var render = ref.render;
    var staticRenderFns = ref.staticRenderFns;
    var _parentVnode = ref._parentVnode;

    if (vm._isMounted) {
      // clone slot nodes on re-renders
      for (var key in vm.$slots) {
        vm.$slots[key] = cloneVNodes(vm.$slots[key]);
      }
    }

    if (staticRenderFns && !vm._staticTrees) {
      vm._staticTrees = [];
    }
    // set parent vnode. this allows render functions to have access
    // to the data on the placeholder node.
    vm.$vnode = _parentVnode;
    // render self
    var vnode;
    try {
      vnode = render.call(vm._renderProxy, vm.$createElement);
    } catch (e) {
      if (process.env.NODE_ENV !== 'production') {
        warn(("Error when rendering " + (formatComponentName(vm)) + ":"));
      }
      /* istanbul ignore else */
      if (config.errorHandler) {
        config.errorHandler.call(null, e, vm);
      } else {
        if (config._isServer) {
          throw e
        } else {
          console.error(e);
        }
      }
      // return previous vnode to prevent render error causing blank component
      vnode = vm._vnode;
    }
    // return empty vnode in case the render function errored out
    if (!(vnode instanceof VNode)) {
      if (process.env.NODE_ENV !== 'production' && Array.isArray(vnode)) {
        warn(
          'Multiple root nodes returned from render function. Render function ' +
          'should return a single root node.',
          vm
        );
      }
      vnode = emptyVNode();
    }
    // set parent
    vnode.parent = _parentVnode;
    return vnode
  };

  // shorthands used in render functions
  Vue.prototype._h = createElement;
  // toString for mustaches
  Vue.prototype._s = _toString;
  // number conversion
  Vue.prototype._n = toNumber;
  // empty vnode
  Vue.prototype._e = emptyVNode;
  // loose equal
  Vue.prototype._q = looseEqual;
  // loose indexOf
  Vue.prototype._i = looseIndexOf;

  // render static tree by index
  Vue.prototype._m = function renderStatic (
    index,
    isInFor
  ) {
    var tree = this._staticTrees[index];
    // if has already-rendered static tree and not inside v-for,
    // we can reuse the same tree by doing a shallow clone.
    if (tree && !isInFor) {
      return Array.isArray(tree)
        ? cloneVNodes(tree)
        : cloneVNode(tree)
    }
    // otherwise, render a fresh tree.
    tree = this._staticTrees[index] = this.$options.staticRenderFns[index].call(this._renderProxy);
    markStatic(tree, ("__static__" + index), false);
    return tree
  };

  // mark node as static (v-once)
  Vue.prototype._o = function markOnce (
    tree,
    index,
    key
  ) {
    markStatic(tree, ("__once__" + index + (key ? ("_" + key) : "")), true);
    return tree
  };

  function markStatic (tree, key, isOnce) {
    if (Array.isArray(tree)) {
      for (var i = 0; i < tree.length; i++) {
        if (tree[i] && typeof tree[i] !== 'string') {
          markStaticNode(tree[i], (key + "_" + i), isOnce);
        }
      }
    } else {
      markStaticNode(tree, key, isOnce);
    }
  }

  function markStaticNode (node, key, isOnce) {
    node.isStatic = true;
    node.key = key;
    node.isOnce = isOnce;
  }

  // filter resolution helper
  var identity = function (_) { return _; };
  Vue.prototype._f = function resolveFilter (id) {
    return resolveAsset(this.$options, 'filters', id, true) || identity
  };

  // render v-for
  Vue.prototype._l = function renderList (
    val,
    render
  ) {
    var ret, i, l, keys, key;
    if (Array.isArray(val)) {
      ret = new Array(val.length);
      for (i = 0, l = val.length; i < l; i++) {
        ret[i] = render(val[i], i);
      }
    } else if (typeof val === 'number') {
      ret = new Array(val);
      for (i = 0; i < val; i++) {
        ret[i] = render(i + 1, i);
      }
    } else if (isObject(val)) {
      keys = Object.keys(val);
      ret = new Array(keys.length);
      for (i = 0, l = keys.length; i < l; i++) {
        key = keys[i];
        ret[i] = render(val[key], key, i);
      }
    }
    return ret
  };

  // renderSlot
  Vue.prototype._t = function (
    name,
    fallback
  ) {
    var slotNodes = this.$slots[name];
    // warn duplicate slot usage
    if (slotNodes && process.env.NODE_ENV !== 'production') {
      slotNodes._rendered && warn(
        "Duplicate presence of slot \"" + name + "\" found in the same render tree " +
        "- this will likely cause render errors.",
        this
      );
      slotNodes._rendered = true;
    }
    return slotNodes || fallback
  };

  // apply v-bind object
  Vue.prototype._b = function bindProps (
    data,
    value,
    asProp
  ) {
    if (value) {
      if (!isObject(value)) {
        process.env.NODE_ENV !== 'production' && warn(
          'v-bind without argument expects an Object or Array value',
          this
        );
      } else {
        if (Array.isArray(value)) {
          value = toObject(value);
        }
        for (var key in value) {
          if (key === 'class' || key === 'style') {
            data[key] = value[key];
          } else {
            var hash = asProp || config.mustUseProp(key)
              ? data.domProps || (data.domProps = {})
              : data.attrs || (data.attrs = {});
            hash[key] = value[key];
          }
        }
      }
    }
    return data
  };

  // expose v-on keyCodes
  Vue.prototype._k = function getKeyCodes (key) {
    return config.keyCodes[key]
  };
}

function resolveSlots (
  renderChildren,
  context
) {
  var slots = {};
  if (!renderChildren) {
    return slots
  }
  var children = normalizeChildren(renderChildren) || [];
  var defaultSlot = [];
  var name, child;
  for (var i = 0, l = children.length; i < l; i++) {
    child = children[i];
    // named slots should only be respected if the vnode was rendered in the
    // same context.
    if ((child.context === context || child.functionalContext === context) &&
        child.data && (name = child.data.slot)) {
      var slot = (slots[name] || (slots[name] = []));
      if (child.tag === 'template') {
        slot.push.apply(slot, child.children);
      } else {
        slot.push(child);
      }
    } else {
      defaultSlot.push(child);
    }
  }
  // ignore single whitespace
  if (defaultSlot.length && !(
    defaultSlot.length === 1 &&
    (defaultSlot[0].text === ' ' || defaultSlot[0].isComment)
  )) {
    slots.default = defaultSlot;
  }
  return slots
}

/*  */

function initEvents (vm) {
  vm._events = Object.create(null);
  // init parent attached events
  var listeners = vm.$options._parentListeners;
  var on = bind$1(vm.$on, vm);
  var off = bind$1(vm.$off, vm);
  vm._updateListeners = function (listeners, oldListeners) {
    updateListeners(listeners, oldListeners || {}, on, off, vm);
  };
  if (listeners) {
    vm._updateListeners(listeners);
  }
}

function eventsMixin (Vue) {
  Vue.prototype.$on = function (event, fn) {
    var vm = this;(vm._events[event] || (vm._events[event] = [])).push(fn);
    return vm
  };

  Vue.prototype.$once = function (event, fn) {
    var vm = this;
    function on () {
      vm.$off(event, on);
      fn.apply(vm, arguments);
    }
    on.fn = fn;
    vm.$on(event, on);
    return vm
  };

  Vue.prototype.$off = function (event, fn) {
    var vm = this;
    // all
    if (!arguments.length) {
      vm._events = Object.create(null);
      return vm
    }
    // specific event
    var cbs = vm._events[event];
    if (!cbs) {
      return vm
    }
    if (arguments.length === 1) {
      vm._events[event] = null;
      return vm
    }
    // specific handler
    var cb;
    var i = cbs.length;
    while (i--) {
      cb = cbs[i];
      if (cb === fn || cb.fn === fn) {
        cbs.splice(i, 1);
        break
      }
    }
    return vm
  };

  Vue.prototype.$emit = function (event) {
    var vm = this;
    var cbs = vm._events[event];
    if (cbs) {
      cbs = cbs.length > 1 ? toArray(cbs) : cbs;
      var args = toArray(arguments, 1);
      for (var i = 0, l = cbs.length; i < l; i++) {
        cbs[i].apply(vm, args);
      }
    }
    return vm
  };
}

/*  */

var uid = 0;

function initMixin (Vue) {
  Vue.prototype._init = function (options) {
    var vm = this;
    // a uid
    vm._uid = uid++;
    // a flag to avoid this being observed
    vm._isVue = true;
    // merge options
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options);
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      );
    }
    /* istanbul ignore else */
    if (process.env.NODE_ENV !== 'production') {
      initProxy(vm);
    } else {
      vm._renderProxy = vm;
    }
    // expose real self
    vm._self = vm;
    initLifecycle(vm);
    initEvents(vm);
    callHook(vm, 'beforeCreate');
    initState(vm);
    callHook(vm, 'created');
    initRender(vm);
  };
}

function initInternalComponent (vm, options) {
  var opts = vm.$options = Object.create(vm.constructor.options);
  // doing this because it's faster than dynamic enumeration.
  opts.parent = options.parent;
  opts.propsData = options.propsData;
  opts._parentVnode = options._parentVnode;
  opts._parentListeners = options._parentListeners;
  opts._renderChildren = options._renderChildren;
  opts._componentTag = options._componentTag;
  if (options.render) {
    opts.render = options.render;
    opts.staticRenderFns = options.staticRenderFns;
  }
}

function resolveConstructorOptions (Ctor) {
  var options = Ctor.options;
  if (Ctor.super) {
    var superOptions = Ctor.super.options;
    var cachedSuperOptions = Ctor.superOptions;
    var extendOptions = Ctor.extendOptions;
    if (superOptions !== cachedSuperOptions) {
      // super option changed
      Ctor.superOptions = superOptions;
      extendOptions.render = options.render;
      extendOptions.staticRenderFns = options.staticRenderFns;
      options = Ctor.options = mergeOptions(superOptions, extendOptions);
      if (options.name) {
        options.components[options.name] = Ctor;
      }
    }
  }
  return options
}

function Vue$2 (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue$2)) {
    warn('Vue is a constructor and should be called with the `new` keyword');
  }
  this._init(options);
}

initMixin(Vue$2);
stateMixin(Vue$2);
eventsMixin(Vue$2);
lifecycleMixin(Vue$2);
renderMixin(Vue$2);

var warn = noop;
var formatComponentName;

if (process.env.NODE_ENV !== 'production') {
  var hasConsole = typeof console !== 'undefined';

  warn = function (msg, vm) {
    if (hasConsole && (!config.silent)) {
      console.error("[Vue warn]: " + msg + " " + (
        vm ? formatLocation(formatComponentName(vm)) : ''
      ));
    }
  };

  formatComponentName = function (vm) {
    if (vm.$root === vm) {
      return 'root instance'
    }
    var name = vm._isVue
      ? vm.$options.name || vm.$options._componentTag
      : vm.name;
    return (
      (name ? ("component <" + name + ">") : "anonymous component") +
      (vm._isVue && vm.$options.__file ? (" at " + (vm.$options.__file)) : '')
    )
  };

  var formatLocation = function (str) {
    if (str === 'anonymous component') {
      str += " - use the \"name\" option for better debugging messages.";
    }
    return ("\n(found in " + str + ")")
  };
}

/*  */

/**
 * Option overwriting strategies are functions that handle
 * how to merge a parent option value and a child option
 * value into the final value.
 */
var strats = config.optionMergeStrategies;

/**
 * Options with restrictions
 */
if (process.env.NODE_ENV !== 'production') {
  strats.el = strats.propsData = function (parent, child, vm, key) {
    if (!vm) {
      warn(
        "option \"" + key + "\" can only be used during instance " +
        'creation with the `new` keyword.'
      );
    }
    return defaultStrat(parent, child)
  };
}

/**
 * Helper that recursively merges two data objects together.
 */
function mergeData (to, from) {
  if (!from) { return to }
  var key, toVal, fromVal;
  var keys = Object.keys(from);
  for (var i = 0; i < keys.length; i++) {
    key = keys[i];
    toVal = to[key];
    fromVal = from[key];
    if (!hasOwn(to, key)) {
      set(to, key, fromVal);
    } else if (isPlainObject(toVal) && isPlainObject(fromVal)) {
      mergeData(toVal, fromVal);
    }
  }
  return to
}

/**
 * Data
 */
strats.data = function (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    // in a Vue.extend merge, both should be functions
    if (!childVal) {
      return parentVal
    }
    if (typeof childVal !== 'function') {
      process.env.NODE_ENV !== 'production' && warn(
        'The "data" option should be a function ' +
        'that returns a per-instance value in component ' +
        'definitions.',
        vm
      );
      return parentVal
    }
    if (!parentVal) {
      return childVal
    }
    // when parentVal & childVal are both present,
    // we need to return a function that returns the
    // merged result of both functions... no need to
    // check if parentVal is a function here because
    // it has to be a function to pass previous merges.
    return function mergedDataFn () {
      return mergeData(
        childVal.call(this),
        parentVal.call(this)
      )
    }
  } else if (parentVal || childVal) {
    return function mergedInstanceDataFn () {
      // instance merge
      var instanceData = typeof childVal === 'function'
        ? childVal.call(vm)
        : childVal;
      var defaultData = typeof parentVal === 'function'
        ? parentVal.call(vm)
        : undefined;
      if (instanceData) {
        return mergeData(instanceData, defaultData)
      } else {
        return defaultData
      }
    }
  }
};

/**
 * Hooks and param attributes are merged as arrays.
 */
function mergeHook (
  parentVal,
  childVal
) {
  return childVal
    ? parentVal
      ? parentVal.concat(childVal)
      : Array.isArray(childVal)
        ? childVal
        : [childVal]
    : parentVal
}

config._lifecycleHooks.forEach(function (hook) {
  strats[hook] = mergeHook;
});

/**
 * Assets
 *
 * When a vm is present (instance creation), we need to do
 * a three-way merge between constructor options, instance
 * options and parent options.
 */
function mergeAssets (parentVal, childVal) {
  var res = Object.create(parentVal || null);
  return childVal
    ? extend(res, childVal)
    : res
}

config._assetTypes.forEach(function (type) {
  strats[type + 's'] = mergeAssets;
});

/**
 * Watchers.
 *
 * Watchers hashes should not overwrite one
 * another, so we merge them as arrays.
 */
strats.watch = function (parentVal, childVal) {
  /* istanbul ignore if */
  if (!childVal) { return parentVal }
  if (!parentVal) { return childVal }
  var ret = {};
  extend(ret, parentVal);
  for (var key in childVal) {
    var parent = ret[key];
    var child = childVal[key];
    if (parent && !Array.isArray(parent)) {
      parent = [parent];
    }
    ret[key] = parent
      ? parent.concat(child)
      : [child];
  }
  return ret
};

/**
 * Other object hashes.
 */
strats.props =
strats.methods =
strats.computed = function (parentVal, childVal) {
  if (!childVal) { return parentVal }
  if (!parentVal) { return childVal }
  var ret = Object.create(null);
  extend(ret, parentVal);
  extend(ret, childVal);
  return ret
};

/**
 * Default strategy.
 */
var defaultStrat = function (parentVal, childVal) {
  return childVal === undefined
    ? parentVal
    : childVal
};

/**
 * Validate component names
 */
function checkComponents (options) {
  for (var key in options.components) {
    var lower = key.toLowerCase();
    if (isBuiltInTag(lower) || config.isReservedTag(lower)) {
      warn(
        'Do not use built-in or reserved HTML elements as component ' +
        'id: ' + key
      );
    }
  }
}

/**
 * Ensure all props option syntax are normalized into the
 * Object-based format.
 */
function normalizeProps (options) {
  var props = options.props;
  if (!props) { return }
  var res = {};
  var i, val, name;
  if (Array.isArray(props)) {
    i = props.length;
    while (i--) {
      val = props[i];
      if (typeof val === 'string') {
        name = camelize(val);
        res[name] = { type: null };
      } else if (process.env.NODE_ENV !== 'production') {
        warn('props must be strings when using array syntax.');
      }
    }
  } else if (isPlainObject(props)) {
    for (var key in props) {
      val = props[key];
      name = camelize(key);
      res[name] = isPlainObject(val)
        ? val
        : { type: val };
    }
  }
  options.props = res;
}

/**
 * Normalize raw function directives into object format.
 */
function normalizeDirectives (options) {
  var dirs = options.directives;
  if (dirs) {
    for (var key in dirs) {
      var def = dirs[key];
      if (typeof def === 'function') {
        dirs[key] = { bind: def, update: def };
      }
    }
  }
}

/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 */
function mergeOptions (
  parent,
  child,
  vm
) {
  if (process.env.NODE_ENV !== 'production') {
    checkComponents(child);
  }
  normalizeProps(child);
  normalizeDirectives(child);
  var extendsFrom = child.extends;
  if (extendsFrom) {
    parent = typeof extendsFrom === 'function'
      ? mergeOptions(parent, extendsFrom.options, vm)
      : mergeOptions(parent, extendsFrom, vm);
  }
  if (child.mixins) {
    for (var i = 0, l = child.mixins.length; i < l; i++) {
      var mixin = child.mixins[i];
      if (mixin.prototype instanceof Vue$2) {
        mixin = mixin.options;
      }
      parent = mergeOptions(parent, mixin, vm);
    }
  }
  var options = {};
  var key;
  for (key in parent) {
    mergeField(key);
  }
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key);
    }
  }
  function mergeField (key) {
    var strat = strats[key] || defaultStrat;
    options[key] = strat(parent[key], child[key], vm, key);
  }
  return options
}

/**
 * Resolve an asset.
 * This function is used because child instances need access
 * to assets defined in its ancestor chain.
 */
function resolveAsset (
  options,
  type,
  id,
  warnMissing
) {
  /* istanbul ignore if */
  if (typeof id !== 'string') {
    return
  }
  var assets = options[type];
  var res = assets[id] ||
    // camelCase ID
    assets[camelize(id)] ||
    // Pascal Case ID
    assets[capitalize(camelize(id))];
  if (process.env.NODE_ENV !== 'production' && warnMissing && !res) {
    warn(
      'Failed to resolve ' + type.slice(0, -1) + ': ' + id,
      options
    );
  }
  return res
}

/*  */

function validateProp (
  key,
  propOptions,
  propsData,
  vm
) {
  var prop = propOptions[key];
  var absent = !hasOwn(propsData, key);
  var value = propsData[key];
  // handle boolean props
  if (isBooleanType(prop.type)) {
    if (absent && !hasOwn(prop, 'default')) {
      value = false;
    } else if (value === '' || value === hyphenate(key)) {
      value = true;
    }
  }
  // check default value
  if (value === undefined) {
    value = getPropDefaultValue(vm, prop, key);
    // since the default value is a fresh copy,
    // make sure to observe it.
    var prevShouldConvert = observerState.shouldConvert;
    observerState.shouldConvert = true;
    observe(value);
    observerState.shouldConvert = prevShouldConvert;
  }
  if (process.env.NODE_ENV !== 'production') {
    assertProp(prop, key, value, vm, absent);
  }
  return value
}

/**
 * Get the default value of a prop.
 */
function getPropDefaultValue (vm, prop, key) {
  // no default, return undefined
  if (!hasOwn(prop, 'default')) {
    return undefined
  }
  var def = prop.default;
  // warn against non-factory defaults for Object & Array
  if (isObject(def)) {
    process.env.NODE_ENV !== 'production' && warn(
      'Invalid default value for prop "' + key + '": ' +
      'Props with type Object/Array must use a factory function ' +
      'to return the default value.',
      vm
    );
  }
  // the raw prop value was also undefined from previous render,
  // return previous default value to avoid unnecessary watcher trigger
  if (vm && vm.$options.propsData &&
    vm.$options.propsData[key] === undefined &&
    vm[key] !== undefined) {
    return vm[key]
  }
  // call factory function for non-Function types
  return typeof def === 'function' && prop.type !== Function
    ? def.call(vm)
    : def
}

/**
 * Assert whether a prop is valid.
 */
function assertProp (
  prop,
  name,
  value,
  vm,
  absent
) {
  if (prop.required && absent) {
    warn(
      'Missing required prop: "' + name + '"',
      vm
    );
    return
  }
  if (value == null && !prop.required) {
    return
  }
  var type = prop.type;
  var valid = !type || type === true;
  var expectedTypes = [];
  if (type) {
    if (!Array.isArray(type)) {
      type = [type];
    }
    for (var i = 0; i < type.length && !valid; i++) {
      var assertedType = assertType(value, type[i]);
      expectedTypes.push(assertedType.expectedType);
      valid = assertedType.valid;
    }
  }
  if (!valid) {
    warn(
      'Invalid prop: type check failed for prop "' + name + '".' +
      ' Expected ' + expectedTypes.map(capitalize).join(', ') +
      ', got ' + Object.prototype.toString.call(value).slice(8, -1) + '.',
      vm
    );
    return
  }
  var validator = prop.validator;
  if (validator) {
    if (!validator(value)) {
      warn(
        'Invalid prop: custom validator check failed for prop "' + name + '".',
        vm
      );
    }
  }
}

/**
 * Assert the type of a value
 */
function assertType (value, type) {
  var valid;
  var expectedType = getType(type);
  if (expectedType === 'String') {
    valid = typeof value === (expectedType = 'string');
  } else if (expectedType === 'Number') {
    valid = typeof value === (expectedType = 'number');
  } else if (expectedType === 'Boolean') {
    valid = typeof value === (expectedType = 'boolean');
  } else if (expectedType === 'Function') {
    valid = typeof value === (expectedType = 'function');
  } else if (expectedType === 'Object') {
    valid = isPlainObject(value);
  } else if (expectedType === 'Array') {
    valid = Array.isArray(value);
  } else {
    valid = value instanceof type;
  }
  return {
    valid: valid,
    expectedType: expectedType
  }
}

/**
 * Use function string name to check built-in types,
 * because a simple equality check will fail when running
 * across different vms / iframes.
 */
function getType (fn) {
  var match = fn && fn.toString().match(/^\s*function (\w+)/);
  return match && match[1]
}

function isBooleanType (fn) {
  if (!Array.isArray(fn)) {
    return getType(fn) === 'Boolean'
  }
  for (var i = 0, len = fn.length; i < len; i++) {
    if (getType(fn[i]) === 'Boolean') {
      return true
    }
  }
  /* istanbul ignore next */
  return false
}



var util = Object.freeze({
	defineReactive: defineReactive$$1,
	_toString: _toString,
	toNumber: toNumber,
	makeMap: makeMap,
	isBuiltInTag: isBuiltInTag,
	remove: remove$1,
	hasOwn: hasOwn,
	isPrimitive: isPrimitive,
	cached: cached,
	camelize: camelize,
	capitalize: capitalize,
	hyphenate: hyphenate,
	bind: bind$1,
	toArray: toArray,
	extend: extend,
	isObject: isObject,
	isPlainObject: isPlainObject,
	toObject: toObject,
	noop: noop,
	no: no,
	genStaticKeys: genStaticKeys,
	looseEqual: looseEqual,
	looseIndexOf: looseIndexOf,
	isReserved: isReserved,
	def: def,
	parsePath: parsePath,
	hasProto: hasProto,
	inBrowser: inBrowser,
	UA: UA,
	isIE: isIE,
	isIE9: isIE9,
	isEdge: isEdge,
	isAndroid: isAndroid,
	isIOS: isIOS,
	devtools: devtools,
	nextTick: nextTick,
	get _Set () { return _Set; },
	mergeOptions: mergeOptions,
	resolveAsset: resolveAsset,
	get warn () { return warn; },
	get formatComponentName () { return formatComponentName; },
	validateProp: validateProp
});

/*  */

function initUse (Vue) {
  Vue.use = function (plugin) {
    /* istanbul ignore if */
    if (plugin.installed) {
      return
    }
    // additional parameters
    var args = toArray(arguments, 1);
    args.unshift(this);
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args);
    } else {
      plugin.apply(null, args);
    }
    plugin.installed = true;
    return this
  };
}

/*  */

function initMixin$1 (Vue) {
  Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin);
  };
}

/*  */

function initExtend (Vue) {
  /**
   * Each instance constructor, including Vue, has a unique
   * cid. This enables us to create wrapped "child
   * constructors" for prototypal inheritance and cache them.
   */
  Vue.cid = 0;
  var cid = 1;

  /**
   * Class inheritance
   */
  Vue.extend = function (extendOptions) {
    extendOptions = extendOptions || {};
    var Super = this;
    var SuperId = Super.cid;
    var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
    if (cachedCtors[SuperId]) {
      return cachedCtors[SuperId]
    }
    var name = extendOptions.name || Super.options.name;
    if (process.env.NODE_ENV !== 'production') {
      if (!/^[a-zA-Z][\w-]*$/.test(name)) {
        warn(
          'Invalid component name: "' + name + '". Component names ' +
          'can only contain alphanumeric characaters and the hyphen.'
        );
      }
    }
    var Sub = function VueComponent (options) {
      this._init(options);
    };
    Sub.prototype = Object.create(Super.prototype);
    Sub.prototype.constructor = Sub;
    Sub.cid = cid++;
    Sub.options = mergeOptions(
      Super.options,
      extendOptions
    );
    Sub['super'] = Super;
    // allow further extension/mixin/plugin usage
    Sub.extend = Super.extend;
    Sub.mixin = Super.mixin;
    Sub.use = Super.use;
    // create asset registers, so extended classes
    // can have their private assets too.
    config._assetTypes.forEach(function (type) {
      Sub[type] = Super[type];
    });
    // enable recursive self-lookup
    if (name) {
      Sub.options.components[name] = Sub;
    }
    // keep a reference to the super options at extension time.
    // later at instantiation we can check if Super's options have
    // been updated.
    Sub.superOptions = Super.options;
    Sub.extendOptions = extendOptions;
    // cache constructor
    cachedCtors[SuperId] = Sub;
    return Sub
  };
}

/*  */

function initAssetRegisters (Vue) {
  /**
   * Create asset registration methods.
   */
  config._assetTypes.forEach(function (type) {
    Vue[type] = function (
      id,
      definition
    ) {
      if (!definition) {
        return this.options[type + 's'][id]
      } else {
        /* istanbul ignore if */
        if (process.env.NODE_ENV !== 'production') {
          if (type === 'component' && config.isReservedTag(id)) {
            warn(
              'Do not use built-in or reserved HTML elements as component ' +
              'id: ' + id
            );
          }
        }
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id;
          definition = this.options._base.extend(definition);
        }
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition };
        }
        this.options[type + 's'][id] = definition;
        return definition
      }
    };
  });
}

var KeepAlive = {
  name: 'keep-alive',
  abstract: true,
  created: function created () {
    this.cache = Object.create(null);
  },
  render: function render () {
    var vnode = getFirstComponentChild(this.$slots.default);
    if (vnode && vnode.componentOptions) {
      var opts = vnode.componentOptions;
      var key = vnode.key == null
        // same constructor may get registered as different local components
        // so cid alone is not enough (#3269)
        ? opts.Ctor.cid + '::' + opts.tag
        : vnode.key;
      if (this.cache[key]) {
        vnode.child = this.cache[key].child;
      } else {
        this.cache[key] = vnode;
      }
      vnode.data.keepAlive = true;
    }
    return vnode
  },
  destroyed: function destroyed () {
    var this$1 = this;

    for (var key in this.cache) {
      var vnode = this$1.cache[key];
      callHook(vnode.child, 'deactivated');
      vnode.child.$destroy();
    }
  }
};

var builtInComponents = {
  KeepAlive: KeepAlive
};

/*  */

function initGlobalAPI (Vue) {
  // config
  var configDef = {};
  configDef.get = function () { return config; };
  if (process.env.NODE_ENV !== 'production') {
    configDef.set = function () {
      warn(
        'Do not replace the Vue.config object, set individual fields instead.'
      );
    };
  }
  Object.defineProperty(Vue, 'config', configDef);
  Vue.util = util;
  Vue.set = set;
  Vue.delete = del;
  Vue.nextTick = nextTick;

  Vue.options = Object.create(null);
  config._assetTypes.forEach(function (type) {
    Vue.options[type + 's'] = Object.create(null);
  });

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue;

  extend(Vue.options.components, builtInComponents);

  initUse(Vue);
  initMixin$1(Vue);
  initExtend(Vue);
  initAssetRegisters(Vue);
}

initGlobalAPI(Vue$2);

Object.defineProperty(Vue$2.prototype, '$isServer', {
  get: function () { return config._isServer; }
});

Vue$2.version = '2.0.7';

/*  */

// attributes that should be using props for binding
var mustUseProp = makeMap('value,selected,checked,muted');

var isEnumeratedAttr = makeMap('contenteditable,draggable,spellcheck');

var isBooleanAttr = makeMap(
  'allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,' +
  'default,defaultchecked,defaultmuted,defaultselected,defer,disabled,' +
  'enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,' +
  'muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,' +
  'required,reversed,scoped,seamless,selected,sortable,translate,' +
  'truespeed,typemustmatch,visible'
);

var isAttr = makeMap(
  'accept,accept-charset,accesskey,action,align,alt,async,autocomplete,' +
  'autofocus,autoplay,autosave,bgcolor,border,buffered,challenge,charset,' +
  'checked,cite,class,code,codebase,color,cols,colspan,content,http-equiv,' +
  'name,contenteditable,contextmenu,controls,coords,data,datetime,default,' +
  'defer,dir,dirname,disabled,download,draggable,dropzone,enctype,method,for,' +
  'form,formaction,headers,<th>,height,hidden,high,href,hreflang,http-equiv,' +
  'icon,id,ismap,itemprop,keytype,kind,label,lang,language,list,loop,low,' +
  'manifest,max,maxlength,media,method,GET,POST,min,multiple,email,file,' +
  'muted,name,novalidate,open,optimum,pattern,ping,placeholder,poster,' +
  'preload,radiogroup,readonly,rel,required,reversed,rows,rowspan,sandbox,' +
  'scope,scoped,seamless,selected,shape,size,type,text,password,sizes,span,' +
  'spellcheck,src,srcdoc,srclang,srcset,start,step,style,summary,tabindex,' +
  'target,title,type,usemap,value,width,wrap'
);



var xlinkNS = 'http://www.w3.org/1999/xlink';

var isXlink = function (name) {
  return name.charAt(5) === ':' && name.slice(0, 5) === 'xlink'
};

var getXlinkProp = function (name) {
  return isXlink(name) ? name.slice(6, name.length) : ''
};

var isFalsyAttrValue = function (val) {
  return val == null || val === false
};

/*  */

function genClassForVnode (vnode) {
  var data = vnode.data;
  var parentNode = vnode;
  var childNode = vnode;
  while (childNode.child) {
    childNode = childNode.child._vnode;
    if (childNode.data) {
      data = mergeClassData(childNode.data, data);
    }
  }
  while ((parentNode = parentNode.parent)) {
    if (parentNode.data) {
      data = mergeClassData(data, parentNode.data);
    }
  }
  return genClassFromData(data)
}

function mergeClassData (child, parent) {
  return {
    staticClass: concat(child.staticClass, parent.staticClass),
    class: child.class
      ? [child.class, parent.class]
      : parent.class
  }
}

function genClassFromData (data) {
  var dynamicClass = data.class;
  var staticClass = data.staticClass;
  if (staticClass || dynamicClass) {
    return concat(staticClass, stringifyClass(dynamicClass))
  }
  /* istanbul ignore next */
  return ''
}

function concat (a, b) {
  return a ? b ? (a + ' ' + b) : a : (b || '')
}

function stringifyClass (value) {
  var res = '';
  if (!value) {
    return res
  }
  if (typeof value === 'string') {
    return value
  }
  if (Array.isArray(value)) {
    var stringified;
    for (var i = 0, l = value.length; i < l; i++) {
      if (value[i]) {
        if ((stringified = stringifyClass(value[i]))) {
          res += stringified + ' ';
        }
      }
    }
    return res.slice(0, -1)
  }
  if (isObject(value)) {
    for (var key in value) {
      if (value[key]) { res += key + ' '; }
    }
    return res.slice(0, -1)
  }
  /* istanbul ignore next */
  return res
}

/*  */

var namespaceMap = {
  svg: 'http://www.w3.org/2000/svg',
  math: 'http://www.w3.org/1998/Math/MathML',
  xhtml: 'http://www.w3.org/1999/xhtml'
};

var isHTMLTag = makeMap(
  'html,body,base,head,link,meta,style,title,' +
  'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' +
  'div,dd,dl,dt,figcaption,figure,hr,img,li,main,ol,p,pre,ul,' +
  'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' +
  's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' +
  'embed,object,param,source,canvas,script,noscript,del,ins,' +
  'caption,col,colgroup,table,thead,tbody,td,th,tr,' +
  'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' +
  'output,progress,select,textarea,' +
  'details,dialog,menu,menuitem,summary,' +
  'content,element,shadow,template'
);

var isUnaryTag = makeMap(
  'area,base,br,col,embed,frame,hr,img,input,isindex,keygen,' +
  'link,meta,param,source,track,wbr',
  true
);

// Elements that you can, intentionally, leave open
// (and which close themselves)
var canBeLeftOpenTag = makeMap(
  'colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr,source',
  true
);

// HTML5 tags https://html.spec.whatwg.org/multipage/indices.html#elements-3
// Phrasing Content https://html.spec.whatwg.org/multipage/dom.html#phrasing-content
var isNonPhrasingTag = makeMap(
  'address,article,aside,base,blockquote,body,caption,col,colgroup,dd,' +
  'details,dialog,div,dl,dt,fieldset,figcaption,figure,footer,form,' +
  'h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,legend,li,menuitem,meta,' +
  'optgroup,option,param,rp,rt,source,style,summary,tbody,td,tfoot,th,thead,' +
  'title,tr,track',
  true
);

// this map is intentionally selective, only covering SVG elements that may
// contain child elements.
var isSVG = makeMap(
  'svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font,' +
  'font-face,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,' +
  'polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view',
  true
);



var isReservedTag = function (tag) {
  return isHTMLTag(tag) || isSVG(tag)
};

function getTagNamespace (tag) {
  if (isSVG(tag)) {
    return 'svg'
  }
  // basic support for MathML
  // note it doesn't support other MathML elements being component roots
  if (tag === 'math') {
    return 'math'
  }
}

var unknownElementCache = Object.create(null);
function isUnknownElement (tag) {
  /* istanbul ignore if */
  if (!inBrowser) {
    return true
  }
  if (isReservedTag(tag)) {
    return false
  }
  tag = tag.toLowerCase();
  /* istanbul ignore if */
  if (unknownElementCache[tag] != null) {
    return unknownElementCache[tag]
  }
  var el = document.createElement(tag);
  if (tag.indexOf('-') > -1) {
    // http://stackoverflow.com/a/28210364/1070244
    return (unknownElementCache[tag] = (
      el.constructor === window.HTMLUnknownElement ||
      el.constructor === window.HTMLElement
    ))
  } else {
    return (unknownElementCache[tag] = /HTMLUnknownElement/.test(el.toString()))
  }
}

/*  */

/**
 * Query an element selector if it's not an element already.
 */
function query (el) {
  if (typeof el === 'string') {
    var selector = el;
    el = document.querySelector(el);
    if (!el) {
      process.env.NODE_ENV !== 'production' && warn(
        'Cannot find element: ' + selector
      );
      return document.createElement('div')
    }
  }
  return el
}

/*  */

function createElement$1 (tagName, vnode) {
  var elm = document.createElement(tagName);
  if (tagName !== 'select') {
    return elm
  }
  if (vnode.data && vnode.data.attrs && 'multiple' in vnode.data.attrs) {
    elm.setAttribute('multiple', 'multiple');
  }
  return elm
}

function createElementNS (namespace, tagName) {
  return document.createElementNS(namespaceMap[namespace], tagName)
}

function createTextNode (text) {
  return document.createTextNode(text)
}

function createComment (text) {
  return document.createComment(text)
}

function insertBefore (parentNode, newNode, referenceNode) {
  parentNode.insertBefore(newNode, referenceNode);
}

function removeChild (node, child) {
  node.removeChild(child);
}

function appendChild (node, child) {
  node.appendChild(child);
}

function parentNode (node) {
  return node.parentNode
}

function nextSibling (node) {
  return node.nextSibling
}

function tagName (node) {
  return node.tagName
}

function setTextContent (node, text) {
  node.textContent = text;
}

function childNodes (node) {
  return node.childNodes
}

function setAttribute (node, key, val) {
  node.setAttribute(key, val);
}


var nodeOps = Object.freeze({
	createElement: createElement$1,
	createElementNS: createElementNS,
	createTextNode: createTextNode,
	createComment: createComment,
	insertBefore: insertBefore,
	removeChild: removeChild,
	appendChild: appendChild,
	parentNode: parentNode,
	nextSibling: nextSibling,
	tagName: tagName,
	setTextContent: setTextContent,
	childNodes: childNodes,
	setAttribute: setAttribute
});

/*  */

var ref = {
  create: function create (_, vnode) {
    registerRef(vnode);
  },
  update: function update (oldVnode, vnode) {
    if (oldVnode.data.ref !== vnode.data.ref) {
      registerRef(oldVnode, true);
      registerRef(vnode);
    }
  },
  destroy: function destroy (vnode) {
    registerRef(vnode, true);
  }
};

function registerRef (vnode, isRemoval) {
  var key = vnode.data.ref;
  if (!key) { return }

  var vm = vnode.context;
  var ref = vnode.child || vnode.elm;
  var refs = vm.$refs;
  if (isRemoval) {
    if (Array.isArray(refs[key])) {
      remove$1(refs[key], ref);
    } else if (refs[key] === ref) {
      refs[key] = undefined;
    }
  } else {
    if (vnode.data.refInFor) {
      if (Array.isArray(refs[key])) {
        refs[key].push(ref);
      } else {
        refs[key] = [ref];
      }
    } else {
      refs[key] = ref;
    }
  }
}

/**
 * Virtual DOM patching algorithm based on Snabbdom by
 * Simon Friis Vindum (@paldepind)
 * Licensed under the MIT License
 * https://github.com/paldepind/snabbdom/blob/master/LICENSE
 *
 * modified by Evan You (@yyx990803)
 *

/*
 * Not type-checking this because this file is perf-critical and the cost
 * of making flow understand it is not worth it.
 */

var emptyNode = new VNode('', {}, []);

var hooks$1 = ['create', 'update', 'remove', 'destroy'];

function isUndef (s) {
  return s == null
}

function isDef (s) {
  return s != null
}

function sameVnode (vnode1, vnode2) {
  return (
    vnode1.key === vnode2.key &&
    vnode1.tag === vnode2.tag &&
    vnode1.isComment === vnode2.isComment &&
    !vnode1.data === !vnode2.data
  )
}

function createKeyToOldIdx (children, beginIdx, endIdx) {
  var i, key;
  var map = {};
  for (i = beginIdx; i <= endIdx; ++i) {
    key = children[i].key;
    if (isDef(key)) { map[key] = i; }
  }
  return map
}

function createPatchFunction (backend) {
  var i, j;
  var cbs = {};

  var modules = backend.modules;
  var nodeOps = backend.nodeOps;

  for (i = 0; i < hooks$1.length; ++i) {
    cbs[hooks$1[i]] = [];
    for (j = 0; j < modules.length; ++j) {
      if (modules[j][hooks$1[i]] !== undefined) { cbs[hooks$1[i]].push(modules[j][hooks$1[i]]); }
    }
  }

  function emptyNodeAt (elm) {
    return new VNode(nodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm)
  }

  function createRmCb (childElm, listeners) {
    function remove$$1 () {
      if (--remove$$1.listeners === 0) {
        removeElement(childElm);
      }
    }
    remove$$1.listeners = listeners;
    return remove$$1
  }

  function removeElement (el) {
    var parent = nodeOps.parentNode(el);
    // element may have already been removed due to v-html
    if (parent) {
      nodeOps.removeChild(parent, el);
    }
  }

  function createElm (vnode, insertedVnodeQueue, nested) {
    var i;
    var data = vnode.data;
    vnode.isRootInsert = !nested;
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.init)) { i(vnode); }
      // after calling the init hook, if the vnode is a child component
      // it should've created a child instance and mounted it. the child
      // component also has set the placeholder vnode's elm.
      // in that case we can just return the element and be done.
      if (isDef(i = vnode.child)) {
        initComponent(vnode, insertedVnodeQueue);
        return vnode.elm
      }
    }
    var children = vnode.children;
    var tag = vnode.tag;
    if (isDef(tag)) {
      if (process.env.NODE_ENV !== 'production') {
        if (
          !vnode.ns &&
          !(config.ignoredElements && config.ignoredElements.indexOf(tag) > -1) &&
          config.isUnknownElement(tag)
        ) {
          warn(
            'Unknown custom element: <' + tag + '> - did you ' +
            'register the component correctly? For recursive components, ' +
            'make sure to provide the "name" option.',
            vnode.context
          );
        }
      }
      vnode.elm = vnode.ns
        ? nodeOps.createElementNS(vnode.ns, tag)
        : nodeOps.createElement(tag, vnode);
      setScope(vnode);
      createChildren(vnode, children, insertedVnodeQueue);
      if (isDef(data)) {
        invokeCreateHooks(vnode, insertedVnodeQueue);
      }
    } else if (vnode.isComment) {
      vnode.elm = nodeOps.createComment(vnode.text);
    } else {
      vnode.elm = nodeOps.createTextNode(vnode.text);
    }
    return vnode.elm
  }

  function createChildren (vnode, children, insertedVnodeQueue) {
    if (Array.isArray(children)) {
      for (var i = 0; i < children.length; ++i) {
        nodeOps.appendChild(vnode.elm, createElm(children[i], insertedVnodeQueue, true));
      }
    } else if (isPrimitive(vnode.text)) {
      nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(vnode.text));
    }
  }

  function isPatchable (vnode) {
    while (vnode.child) {
      vnode = vnode.child._vnode;
    }
    return isDef(vnode.tag)
  }

  function invokeCreateHooks (vnode, insertedVnodeQueue) {
    for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
      cbs.create[i$1](emptyNode, vnode);
    }
    i = vnode.data.hook; // Reuse variable
    if (isDef(i)) {
      if (i.create) { i.create(emptyNode, vnode); }
      if (i.insert) { insertedVnodeQueue.push(vnode); }
    }
  }

  function initComponent (vnode, insertedVnodeQueue) {
    if (vnode.data.pendingInsert) {
      insertedVnodeQueue.push.apply(insertedVnodeQueue, vnode.data.pendingInsert);
    }
    vnode.elm = vnode.child.$el;
    if (isPatchable(vnode)) {
      invokeCreateHooks(vnode, insertedVnodeQueue);
      setScope(vnode);
    } else {
      // empty component root.
      // skip all element-related modules except for ref (#3455)
      registerRef(vnode);
      // make sure to invoke the insert hook
      insertedVnodeQueue.push(vnode);
    }
  }

  // set scope id attribute for scoped CSS.
  // this is implemented as a special case to avoid the overhead
  // of going through the normal attribute patching process.
  function setScope (vnode) {
    var i;
    if (isDef(i = vnode.context) && isDef(i = i.$options._scopeId)) {
      nodeOps.setAttribute(vnode.elm, i, '');
    }
    if (isDef(i = activeInstance) &&
        i !== vnode.context &&
        isDef(i = i.$options._scopeId)) {
      nodeOps.setAttribute(vnode.elm, i, '');
    }
  }

  function addVnodes (parentElm, before, vnodes, startIdx, endIdx, insertedVnodeQueue) {
    for (; startIdx <= endIdx; ++startIdx) {
      nodeOps.insertBefore(parentElm, createElm(vnodes[startIdx], insertedVnodeQueue), before);
    }
  }

  function invokeDestroyHook (vnode) {
    var i, j;
    var data = vnode.data;
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.destroy)) { i(vnode); }
      for (i = 0; i < cbs.destroy.length; ++i) { cbs.destroy[i](vnode); }
    }
    if (isDef(i = vnode.children)) {
      for (j = 0; j < vnode.children.length; ++j) {
        invokeDestroyHook(vnode.children[j]);
      }
    }
  }

  function removeVnodes (parentElm, vnodes, startIdx, endIdx) {
    for (; startIdx <= endIdx; ++startIdx) {
      var ch = vnodes[startIdx];
      if (isDef(ch)) {
        if (isDef(ch.tag)) {
          removeAndInvokeRemoveHook(ch);
          invokeDestroyHook(ch);
        } else { // Text node
          nodeOps.removeChild(parentElm, ch.elm);
        }
      }
    }
  }

  function removeAndInvokeRemoveHook (vnode, rm) {
    if (rm || isDef(vnode.data)) {
      var listeners = cbs.remove.length + 1;
      if (!rm) {
        // directly removing
        rm = createRmCb(vnode.elm, listeners);
      } else {
        // we have a recursively passed down rm callback
        // increase the listeners count
        rm.listeners += listeners;
      }
      // recursively invoke hooks on child component root node
      if (isDef(i = vnode.child) && isDef(i = i._vnode) && isDef(i.data)) {
        removeAndInvokeRemoveHook(i, rm);
      }
      for (i = 0; i < cbs.remove.length; ++i) {
        cbs.remove[i](vnode, rm);
      }
      if (isDef(i = vnode.data.hook) && isDef(i = i.remove)) {
        i(vnode, rm);
      } else {
        rm();
      }
    } else {
      removeElement(vnode.elm);
    }
  }

  function updateChildren (parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
    var oldStartIdx = 0;
    var newStartIdx = 0;
    var oldEndIdx = oldCh.length - 1;
    var oldStartVnode = oldCh[0];
    var oldEndVnode = oldCh[oldEndIdx];
    var newEndIdx = newCh.length - 1;
    var newStartVnode = newCh[0];
    var newEndVnode = newCh[newEndIdx];
    var oldKeyToIdx, idxInOld, elmToMove, before;

    // removeOnly is a special flag used only by <transition-group>
    // to ensure removed elements stay in correct relative positions
    // during leaving transitions
    var canMove = !removeOnly;

    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (isUndef(oldStartVnode)) {
        oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
      } else if (isUndef(oldEndVnode)) {
        oldEndVnode = oldCh[--oldEndIdx];
      } else if (sameVnode(oldStartVnode, newStartVnode)) {
        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
        oldStartVnode = oldCh[++oldStartIdx];
        newStartVnode = newCh[++newStartIdx];
      } else if (sameVnode(oldEndVnode, newEndVnode)) {
        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
        oldEndVnode = oldCh[--oldEndIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
        canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm));
        oldStartVnode = oldCh[++oldStartIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
        canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
        oldEndVnode = oldCh[--oldEndIdx];
        newStartVnode = newCh[++newStartIdx];
      } else {
        if (isUndef(oldKeyToIdx)) { oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx); }
        idxInOld = isDef(newStartVnode.key) ? oldKeyToIdx[newStartVnode.key] : null;
        if (isUndef(idxInOld)) { // New element
          nodeOps.insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm);
          newStartVnode = newCh[++newStartIdx];
        } else {
          elmToMove = oldCh[idxInOld];
          /* istanbul ignore if */
          if (process.env.NODE_ENV !== 'production' && !elmToMove) {
            warn(
              'It seems there are duplicate keys that is causing an update error. ' +
              'Make sure each v-for item has a unique key.'
            );
          }
          if (elmToMove.tag !== newStartVnode.tag) {
            // same key but different element. treat as new element
            nodeOps.insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm);
            newStartVnode = newCh[++newStartIdx];
          } else {
            patchVnode(elmToMove, newStartVnode, insertedVnodeQueue);
            oldCh[idxInOld] = undefined;
            canMove && nodeOps.insertBefore(parentElm, newStartVnode.elm, oldStartVnode.elm);
            newStartVnode = newCh[++newStartIdx];
          }
        }
      }
    }
    if (oldStartIdx > oldEndIdx) {
      before = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm;
      addVnodes(parentElm, before, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
    } else if (newStartIdx > newEndIdx) {
      removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
    }
  }

  function patchVnode (oldVnode, vnode, insertedVnodeQueue, removeOnly) {
    if (oldVnode === vnode) {
      return
    }
    // reuse element for static trees.
    // note we only do this if the vnode is cloned -
    // if the new node is not cloned it means the render functions have been
    // reset by the hot-reload-api and we need to do a proper re-render.
    if (vnode.isStatic &&
        oldVnode.isStatic &&
        vnode.key === oldVnode.key &&
        (vnode.isCloned || vnode.isOnce)) {
      vnode.elm = oldVnode.elm;
      return
    }
    var i;
    var data = vnode.data;
    var hasData = isDef(data);
    if (hasData && isDef(i = data.hook) && isDef(i = i.prepatch)) {
      i(oldVnode, vnode);
    }
    var elm = vnode.elm = oldVnode.elm;
    var oldCh = oldVnode.children;
    var ch = vnode.children;
    if (hasData && isPatchable(vnode)) {
      for (i = 0; i < cbs.update.length; ++i) { cbs.update[i](oldVnode, vnode); }
      if (isDef(i = data.hook) && isDef(i = i.update)) { i(oldVnode, vnode); }
    }
    if (isUndef(vnode.text)) {
      if (isDef(oldCh) && isDef(ch)) {
        if (oldCh !== ch) { updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly); }
      } else if (isDef(ch)) {
        if (isDef(oldVnode.text)) { nodeOps.setTextContent(elm, ''); }
        addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
      } else if (isDef(oldCh)) {
        removeVnodes(elm, oldCh, 0, oldCh.length - 1);
      } else if (isDef(oldVnode.text)) {
        nodeOps.setTextContent(elm, '');
      }
    } else if (oldVnode.text !== vnode.text) {
      nodeOps.setTextContent(elm, vnode.text);
    }
    if (hasData) {
      if (isDef(i = data.hook) && isDef(i = i.postpatch)) { i(oldVnode, vnode); }
    }
  }

  function invokeInsertHook (vnode, queue, initial) {
    // delay insert hooks for component root nodes, invoke them after the
    // element is really inserted
    if (initial && vnode.parent) {
      vnode.parent.data.pendingInsert = queue;
    } else {
      for (var i = 0; i < queue.length; ++i) {
        queue[i].data.hook.insert(queue[i]);
      }
    }
  }

  var bailed = false;
  function hydrate (elm, vnode, insertedVnodeQueue) {
    if (process.env.NODE_ENV !== 'production') {
      if (!assertNodeMatch(elm, vnode)) {
        return false
      }
    }
    vnode.elm = elm;
    var tag = vnode.tag;
    var data = vnode.data;
    var children = vnode.children;
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.init)) { i(vnode, true /* hydrating */); }
      if (isDef(i = vnode.child)) {
        // child component. it should have hydrated its own tree.
        initComponent(vnode, insertedVnodeQueue);
        return true
      }
    }
    if (isDef(tag)) {
      if (isDef(children)) {
        var childNodes = nodeOps.childNodes(elm);
        // empty element, allow client to pick up and populate children
        if (!childNodes.length) {
          createChildren(vnode, children, insertedVnodeQueue);
        } else {
          var childrenMatch = true;
          if (childNodes.length !== children.length) {
            childrenMatch = false;
          } else {
            for (var i$1 = 0; i$1 < children.length; i$1++) {
              if (!hydrate(childNodes[i$1], children[i$1], insertedVnodeQueue)) {
                childrenMatch = false;
                break
              }
            }
          }
          if (!childrenMatch) {
            if (process.env.NODE_ENV !== 'production' &&
                typeof console !== 'undefined' &&
                !bailed) {
              bailed = true;
              console.warn('Parent: ', elm);
              console.warn('Mismatching childNodes vs. VNodes: ', childNodes, children);
            }
            return false
          }
        }
      }
      if (isDef(data)) {
        invokeCreateHooks(vnode, insertedVnodeQueue);
      }
    }
    return true
  }

  function assertNodeMatch (node, vnode) {
    if (vnode.tag) {
      return (
        vnode.tag.indexOf('vue-component') === 0 ||
        vnode.tag.toLowerCase() === nodeOps.tagName(node).toLowerCase()
      )
    } else {
      return _toString(vnode.text) === node.data
    }
  }

  return function patch (oldVnode, vnode, hydrating, removeOnly) {
    if (!vnode) {
      if (oldVnode) { invokeDestroyHook(oldVnode); }
      return
    }

    var elm, parent;
    var isInitialPatch = false;
    var insertedVnodeQueue = [];

    if (!oldVnode) {
      // empty mount, create new root element
      isInitialPatch = true;
      createElm(vnode, insertedVnodeQueue);
    } else {
      var isRealElement = isDef(oldVnode.nodeType);
      if (!isRealElement && sameVnode(oldVnode, vnode)) {
        patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly);
      } else {
        if (isRealElement) {
          // mounting to a real element
          // check if this is server-rendered content and if we can perform
          // a successful hydration.
          if (oldVnode.nodeType === 1 && oldVnode.hasAttribute('server-rendered')) {
            oldVnode.removeAttribute('server-rendered');
            hydrating = true;
          }
          if (hydrating) {
            if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
              invokeInsertHook(vnode, insertedVnodeQueue, true);
              return oldVnode
            } else if (process.env.NODE_ENV !== 'production') {
              warn(
                'The client-side rendered virtual DOM tree is not matching ' +
                'server-rendered content. This is likely caused by incorrect ' +
                'HTML markup, for example nesting block-level elements inside ' +
                '<p>, or missing <tbody>. Bailing hydration and performing ' +
                'full client-side render.'
              );
            }
          }
          // either not server-rendered, or hydration failed.
          // create an empty node and replace it
          oldVnode = emptyNodeAt(oldVnode);
        }
        elm = oldVnode.elm;
        parent = nodeOps.parentNode(elm);

        createElm(vnode, insertedVnodeQueue);

        // component root element replaced.
        // update parent placeholder node element.
        if (vnode.parent) {
          vnode.parent.elm = vnode.elm;
          if (isPatchable(vnode)) {
            for (var i = 0; i < cbs.create.length; ++i) {
              cbs.create[i](emptyNode, vnode.parent);
            }
          }
        }

        if (parent !== null) {
          nodeOps.insertBefore(parent, vnode.elm, nodeOps.nextSibling(elm));
          removeVnodes(parent, [oldVnode], 0, 0);
        } else if (isDef(oldVnode.tag)) {
          invokeDestroyHook(oldVnode);
        }
      }
    }

    invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch);
    return vnode.elm
  }
}

/*  */

var directives = {
  create: updateDirectives,
  update: updateDirectives,
  destroy: function unbindDirectives (vnode) {
    updateDirectives(vnode, emptyNode);
  }
};

function updateDirectives (
  oldVnode,
  vnode
) {
  if (!oldVnode.data.directives && !vnode.data.directives) {
    return
  }
  var isCreate = oldVnode === emptyNode;
  var oldDirs = normalizeDirectives$1(oldVnode.data.directives, oldVnode.context);
  var newDirs = normalizeDirectives$1(vnode.data.directives, vnode.context);

  var dirsWithInsert = [];
  var dirsWithPostpatch = [];

  var key, oldDir, dir;
  for (key in newDirs) {
    oldDir = oldDirs[key];
    dir = newDirs[key];
    if (!oldDir) {
      // new directive, bind
      callHook$1(dir, 'bind', vnode, oldVnode);
      if (dir.def && dir.def.inserted) {
        dirsWithInsert.push(dir);
      }
    } else {
      // existing directive, update
      dir.oldValue = oldDir.value;
      callHook$1(dir, 'update', vnode, oldVnode);
      if (dir.def && dir.def.componentUpdated) {
        dirsWithPostpatch.push(dir);
      }
    }
  }

  if (dirsWithInsert.length) {
    var callInsert = function () {
      dirsWithInsert.forEach(function (dir) {
        callHook$1(dir, 'inserted', vnode, oldVnode);
      });
    };
    if (isCreate) {
      mergeVNodeHook(vnode.data.hook || (vnode.data.hook = {}), 'insert', callInsert, 'dir-insert');
    } else {
      callInsert();
    }
  }

  if (dirsWithPostpatch.length) {
    mergeVNodeHook(vnode.data.hook || (vnode.data.hook = {}), 'postpatch', function () {
      dirsWithPostpatch.forEach(function (dir) {
        callHook$1(dir, 'componentUpdated', vnode, oldVnode);
      });
    }, 'dir-postpatch');
  }

  if (!isCreate) {
    for (key in oldDirs) {
      if (!newDirs[key]) {
        // no longer present, unbind
        callHook$1(oldDirs[key], 'unbind', oldVnode);
      }
    }
  }
}

var emptyModifiers = Object.create(null);

function normalizeDirectives$1 (
  dirs,
  vm
) {
  var res = Object.create(null);
  if (!dirs) {
    return res
  }
  var i, dir;
  for (i = 0; i < dirs.length; i++) {
    dir = dirs[i];
    if (!dir.modifiers) {
      dir.modifiers = emptyModifiers;
    }
    res[getRawDirName(dir)] = dir;
    dir.def = resolveAsset(vm.$options, 'directives', dir.name, true);
  }
  return res
}

function getRawDirName (dir) {
  return dir.rawName || ((dir.name) + "." + (Object.keys(dir.modifiers || {}).join('.')))
}

function callHook$1 (dir, hook, vnode, oldVnode) {
  var fn = dir.def && dir.def[hook];
  if (fn) {
    fn(vnode.elm, dir, vnode, oldVnode);
  }
}

var baseModules = [
  ref,
  directives
];

/*  */

function updateAttrs (oldVnode, vnode) {
  if (!oldVnode.data.attrs && !vnode.data.attrs) {
    return
  }
  var key, cur, old;
  var elm = vnode.elm;
  var oldAttrs = oldVnode.data.attrs || {};
  var attrs = vnode.data.attrs || {};
  // clone observed objects, as the user probably wants to mutate it
  if (attrs.__ob__) {
    attrs = vnode.data.attrs = extend({}, attrs);
  }

  for (key in attrs) {
    cur = attrs[key];
    old = oldAttrs[key];
    if (old !== cur) {
      setAttr(elm, key, cur);
    }
  }
  for (key in oldAttrs) {
    if (attrs[key] == null) {
      if (isXlink(key)) {
        elm.removeAttributeNS(xlinkNS, getXlinkProp(key));
      } else if (!isEnumeratedAttr(key)) {
        elm.removeAttribute(key);
      }
    }
  }
}

function setAttr (el, key, value) {
  if (isBooleanAttr(key)) {
    // set attribute for blank value
    // e.g. <option disabled>Select one</option>
    if (isFalsyAttrValue(value)) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, key);
    }
  } else if (isEnumeratedAttr(key)) {
    el.setAttribute(key, isFalsyAttrValue(value) || value === 'false' ? 'false' : 'true');
  } else if (isXlink(key)) {
    if (isFalsyAttrValue(value)) {
      el.removeAttributeNS(xlinkNS, getXlinkProp(key));
    } else {
      el.setAttributeNS(xlinkNS, key, value);
    }
  } else {
    if (isFalsyAttrValue(value)) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, value);
    }
  }
}

var attrs = {
  create: updateAttrs,
  update: updateAttrs
};

/*  */

function updateClass (oldVnode, vnode) {
  var el = vnode.elm;
  var data = vnode.data;
  var oldData = oldVnode.data;
  if (!data.staticClass && !data.class &&
      (!oldData || (!oldData.staticClass && !oldData.class))) {
    return
  }

  var cls = genClassForVnode(vnode);

  // handle transition classes
  var transitionClass = el._transitionClasses;
  if (transitionClass) {
    cls = concat(cls, stringifyClass(transitionClass));
  }

  // set the class
  if (cls !== el._prevClass) {
    el.setAttribute('class', cls);
    el._prevClass = cls;
  }
}

var klass = {
  create: updateClass,
  update: updateClass
};

// skip type checking this file because we need to attach private properties
// to elements

function updateDOMListeners (oldVnode, vnode) {
  if (!oldVnode.data.on && !vnode.data.on) {
    return
  }
  var on = vnode.data.on || {};
  var oldOn = oldVnode.data.on || {};
  var add = vnode.elm._v_add || (vnode.elm._v_add = function (event, handler, capture) {
    vnode.elm.addEventListener(event, handler, capture);
  });
  var remove = vnode.elm._v_remove || (vnode.elm._v_remove = function (event, handler) {
    vnode.elm.removeEventListener(event, handler);
  });
  updateListeners(on, oldOn, add, remove, vnode.context);
}

var events = {
  create: updateDOMListeners,
  update: updateDOMListeners
};

/*  */

function updateDOMProps (oldVnode, vnode) {
  if (!oldVnode.data.domProps && !vnode.data.domProps) {
    return
  }
  var key, cur;
  var elm = vnode.elm;
  var oldProps = oldVnode.data.domProps || {};
  var props = vnode.data.domProps || {};
  // clone observed objects, as the user probably wants to mutate it
  if (props.__ob__) {
    props = vnode.data.domProps = extend({}, props);
  }

  for (key in oldProps) {
    if (props[key] == null) {
      elm[key] = '';
    }
  }
  for (key in props) {
    // ignore children if the node has textContent or innerHTML,
    // as these will throw away existing DOM nodes and cause removal errors
    // on subsequent patches (#3360)
    if ((key === 'textContent' || key === 'innerHTML') && vnode.children) {
      vnode.children.length = 0;
    }
    cur = props[key];
    if (key === 'value') {
      // store value as _value as well since
      // non-string values will be stringified
      elm._value = cur;
      // avoid resetting cursor position when value is the same
      var strCur = cur == null ? '' : String(cur);
      if (elm.value !== strCur && !elm.composing) {
        elm.value = strCur;
      }
    } else {
      elm[key] = cur;
    }
  }
}

var domProps = {
  create: updateDOMProps,
  update: updateDOMProps
};

/*  */

var parseStyleText = cached(function (cssText) {
  var res = {};
  var hasBackground = cssText.indexOf('background') >= 0;
  // maybe with background-image: url(http://xxx) or base64 img
  var listDelimiter = hasBackground ? /;(?![^(]*\))/g : ';';
  var propertyDelimiter = hasBackground ? /:(.+)/ : ':';
  cssText.split(listDelimiter).forEach(function (item) {
    if (item) {
      var tmp = item.split(propertyDelimiter);
      tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return res
});

// merge static and dynamic style data on the same vnode
function normalizeStyleData (data) {
  var style = normalizeStyleBinding(data.style);
  // static style is pre-processed into an object during compilation
  // and is always a fresh object, so it's safe to merge into it
  return data.staticStyle
    ? extend(data.staticStyle, style)
    : style
}

// normalize possible array / string values into Object
function normalizeStyleBinding (bindingStyle) {
  if (Array.isArray(bindingStyle)) {
    return toObject(bindingStyle)
  }
  if (typeof bindingStyle === 'string') {
    return parseStyleText(bindingStyle)
  }
  return bindingStyle
}

/**
 * parent component style should be after child's
 * so that parent component's style could override it
 */
function getStyle (vnode, checkChild) {
  var res = {};
  var styleData;

  if (checkChild) {
    var childNode = vnode;
    while (childNode.child) {
      childNode = childNode.child._vnode;
      if (childNode.data && (styleData = normalizeStyleData(childNode.data))) {
        extend(res, styleData);
      }
    }
  }

  if ((styleData = normalizeStyleData(vnode.data))) {
    extend(res, styleData);
  }

  var parentNode = vnode;
  while ((parentNode = parentNode.parent)) {
    if (parentNode.data && (styleData = normalizeStyleData(parentNode.data))) {
      extend(res, styleData);
    }
  }
  return res
}

/*  */

var cssVarRE = /^--/;
var setProp = function (el, name, val) {
  /* istanbul ignore if */
  if (cssVarRE.test(name)) {
    el.style.setProperty(name, val);
  } else {
    el.style[normalize(name)] = val;
  }
};

var prefixes = ['Webkit', 'Moz', 'ms'];

var testEl;
var normalize = cached(function (prop) {
  testEl = testEl || document.createElement('div');
  prop = camelize(prop);
  if (prop !== 'filter' && (prop in testEl.style)) {
    return prop
  }
  var upper = prop.charAt(0).toUpperCase() + prop.slice(1);
  for (var i = 0; i < prefixes.length; i++) {
    var prefixed = prefixes[i] + upper;
    if (prefixed in testEl.style) {
      return prefixed
    }
  }
});

function updateStyle (oldVnode, vnode) {
  var data = vnode.data;
  var oldData = oldVnode.data;

  if (!data.staticStyle && !data.style &&
      !oldData.staticStyle && !oldData.style) {
    return
  }

  var cur, name;
  var el = vnode.elm;
  var oldStyle = oldVnode.data.style || {};
  var style = normalizeStyleBinding(vnode.data.style) || {};

  vnode.data.style = style.__ob__ ? extend({}, style) : style;

  var newStyle = getStyle(vnode, true);

  for (name in oldStyle) {
    if (newStyle[name] == null) {
      setProp(el, name, '');
    }
  }
  for (name in newStyle) {
    cur = newStyle[name];
    if (cur !== oldStyle[name]) {
      // ie9 setting to null has no effect, must use empty string
      setProp(el, name, cur == null ? '' : cur);
    }
  }
}

var style = {
  create: updateStyle,
  update: updateStyle
};

/*  */

/**
 * Add class with compatibility for SVG since classList is not supported on
 * SVG elements in IE
 */
function addClass (el, cls) {
  /* istanbul ignore if */
  if (!cls || !cls.trim()) {
    return
  }

  /* istanbul ignore else */
  if (el.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(/\s+/).forEach(function (c) { return el.classList.add(c); });
    } else {
      el.classList.add(cls);
    }
  } else {
    var cur = ' ' + el.getAttribute('class') + ' ';
    if (cur.indexOf(' ' + cls + ' ') < 0) {
      el.setAttribute('class', (cur + cls).trim());
    }
  }
}

/**
 * Remove class with compatibility for SVG since classList is not supported on
 * SVG elements in IE
 */
function removeClass (el, cls) {
  /* istanbul ignore if */
  if (!cls || !cls.trim()) {
    return
  }

  /* istanbul ignore else */
  if (el.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(/\s+/).forEach(function (c) { return el.classList.remove(c); });
    } else {
      el.classList.remove(cls);
    }
  } else {
    var cur = ' ' + el.getAttribute('class') + ' ';
    var tar = ' ' + cls + ' ';
    while (cur.indexOf(tar) >= 0) {
      cur = cur.replace(tar, ' ');
    }
    el.setAttribute('class', cur.trim());
  }
}

/*  */

var hasTransition = inBrowser && !isIE9;
var TRANSITION = 'transition';
var ANIMATION = 'animation';

// Transition property/event sniffing
var transitionProp = 'transition';
var transitionEndEvent = 'transitionend';
var animationProp = 'animation';
var animationEndEvent = 'animationend';
if (hasTransition) {
  /* istanbul ignore if */
  if (window.ontransitionend === undefined &&
    window.onwebkittransitionend !== undefined) {
    transitionProp = 'WebkitTransition';
    transitionEndEvent = 'webkitTransitionEnd';
  }
  if (window.onanimationend === undefined &&
    window.onwebkitanimationend !== undefined) {
    animationProp = 'WebkitAnimation';
    animationEndEvent = 'webkitAnimationEnd';
  }
}

var raf = (inBrowser && window.requestAnimationFrame) || setTimeout;
function nextFrame (fn) {
  raf(function () {
    raf(fn);
  });
}

function addTransitionClass (el, cls) {
  (el._transitionClasses || (el._transitionClasses = [])).push(cls);
  addClass(el, cls);
}

function removeTransitionClass (el, cls) {
  if (el._transitionClasses) {
    remove$1(el._transitionClasses, cls);
  }
  removeClass(el, cls);
}

function whenTransitionEnds (
  el,
  expectedType,
  cb
) {
  var ref = getTransitionInfo(el, expectedType);
  var type = ref.type;
  var timeout = ref.timeout;
  var propCount = ref.propCount;
  if (!type) { return cb() }
  var event = type === TRANSITION ? transitionEndEvent : animationEndEvent;
  var ended = 0;
  var end = function () {
    el.removeEventListener(event, onEnd);
    cb();
  };
  var onEnd = function (e) {
    if (e.target === el) {
      if (++ended >= propCount) {
        end();
      }
    }
  };
  setTimeout(function () {
    if (ended < propCount) {
      end();
    }
  }, timeout + 1);
  el.addEventListener(event, onEnd);
}

var transformRE = /\b(transform|all)(,|$)/;

function getTransitionInfo (el, expectedType) {
  var styles = window.getComputedStyle(el);
  var transitioneDelays = styles[transitionProp + 'Delay'].split(', ');
  var transitionDurations = styles[transitionProp + 'Duration'].split(', ');
  var transitionTimeout = getTimeout(transitioneDelays, transitionDurations);
  var animationDelays = styles[animationProp + 'Delay'].split(', ');
  var animationDurations = styles[animationProp + 'Duration'].split(', ');
  var animationTimeout = getTimeout(animationDelays, animationDurations);

  var type;
  var timeout = 0;
  var propCount = 0;
  /* istanbul ignore if */
  if (expectedType === TRANSITION) {
    if (transitionTimeout > 0) {
      type = TRANSITION;
      timeout = transitionTimeout;
      propCount = transitionDurations.length;
    }
  } else if (expectedType === ANIMATION) {
    if (animationTimeout > 0) {
      type = ANIMATION;
      timeout = animationTimeout;
      propCount = animationDurations.length;
    }
  } else {
    timeout = Math.max(transitionTimeout, animationTimeout);
    type = timeout > 0
      ? transitionTimeout > animationTimeout
        ? TRANSITION
        : ANIMATION
      : null;
    propCount = type
      ? type === TRANSITION
        ? transitionDurations.length
        : animationDurations.length
      : 0;
  }
  var hasTransform =
    type === TRANSITION &&
    transformRE.test(styles[transitionProp + 'Property']);
  return {
    type: type,
    timeout: timeout,
    propCount: propCount,
    hasTransform: hasTransform
  }
}

function getTimeout (delays, durations) {
  /* istanbul ignore next */
  while (delays.length < durations.length) {
    delays = delays.concat(delays);
  }

  return Math.max.apply(null, durations.map(function (d, i) {
    return toMs(d) + toMs(delays[i])
  }))
}

function toMs (s) {
  return Number(s.slice(0, -1)) * 1000
}

/*  */

function enter (vnode) {
  var el = vnode.elm;

  // call leave callback now
  if (el._leaveCb) {
    el._leaveCb.cancelled = true;
    el._leaveCb();
  }

  var data = resolveTransition(vnode.data.transition);
  if (!data) {
    return
  }

  /* istanbul ignore if */
  if (el._enterCb || el.nodeType !== 1) {
    return
  }

  var css = data.css;
  var type = data.type;
  var enterClass = data.enterClass;
  var enterActiveClass = data.enterActiveClass;
  var appearClass = data.appearClass;
  var appearActiveClass = data.appearActiveClass;
  var beforeEnter = data.beforeEnter;
  var enter = data.enter;
  var afterEnter = data.afterEnter;
  var enterCancelled = data.enterCancelled;
  var beforeAppear = data.beforeAppear;
  var appear = data.appear;
  var afterAppear = data.afterAppear;
  var appearCancelled = data.appearCancelled;

  // activeInstance will always be the <transition> component managing this
  // transition. One edge case to check is when the <transition> is placed
  // as the root node of a child component. In that case we need to check
  // <transition>'s parent for appear check.
  var transitionNode = activeInstance.$vnode;
  var context = transitionNode && transitionNode.parent
    ? transitionNode.parent.context
    : activeInstance;

  var isAppear = !context._isMounted || !vnode.isRootInsert;

  if (isAppear && !appear && appear !== '') {
    return
  }

  var startClass = isAppear ? appearClass : enterClass;
  var activeClass = isAppear ? appearActiveClass : enterActiveClass;
  var beforeEnterHook = isAppear ? (beforeAppear || beforeEnter) : beforeEnter;
  var enterHook = isAppear ? (typeof appear === 'function' ? appear : enter) : enter;
  var afterEnterHook = isAppear ? (afterAppear || afterEnter) : afterEnter;
  var enterCancelledHook = isAppear ? (appearCancelled || enterCancelled) : enterCancelled;

  var expectsCSS = css !== false && !isIE9;
  var userWantsControl =
    enterHook &&
    // enterHook may be a bound method which exposes
    // the length of original fn as _length
    (enterHook._length || enterHook.length) > 1;

  var cb = el._enterCb = once(function () {
    if (expectsCSS) {
      removeTransitionClass(el, activeClass);
    }
    if (cb.cancelled) {
      if (expectsCSS) {
        removeTransitionClass(el, startClass);
      }
      enterCancelledHook && enterCancelledHook(el);
    } else {
      afterEnterHook && afterEnterHook(el);
    }
    el._enterCb = null;
  });

  if (!vnode.data.show) {
    // remove pending leave element on enter by injecting an insert hook
    mergeVNodeHook(vnode.data.hook || (vnode.data.hook = {}), 'insert', function () {
      var parent = el.parentNode;
      var pendingNode = parent && parent._pending && parent._pending[vnode.key];
      if (pendingNode && pendingNode.tag === vnode.tag && pendingNode.elm._leaveCb) {
        pendingNode.elm._leaveCb();
      }
      enterHook && enterHook(el, cb);
    }, 'transition-insert');
  }

  // start enter transition
  beforeEnterHook && beforeEnterHook(el);
  if (expectsCSS) {
    addTransitionClass(el, startClass);
    addTransitionClass(el, activeClass);
    nextFrame(function () {
      removeTransitionClass(el, startClass);
      if (!cb.cancelled && !userWantsControl) {
        whenTransitionEnds(el, type, cb);
      }
    });
  }

  if (vnode.data.show) {
    enterHook && enterHook(el, cb);
  }

  if (!expectsCSS && !userWantsControl) {
    cb();
  }
}

function leave (vnode, rm) {
  var el = vnode.elm;

  // call enter callback now
  if (el._enterCb) {
    el._enterCb.cancelled = true;
    el._enterCb();
  }

  var data = resolveTransition(vnode.data.transition);
  if (!data) {
    return rm()
  }

  /* istanbul ignore if */
  if (el._leaveCb || el.nodeType !== 1) {
    return
  }

  var css = data.css;
  var type = data.type;
  var leaveClass = data.leaveClass;
  var leaveActiveClass = data.leaveActiveClass;
  var beforeLeave = data.beforeLeave;
  var leave = data.leave;
  var afterLeave = data.afterLeave;
  var leaveCancelled = data.leaveCancelled;
  var delayLeave = data.delayLeave;

  var expectsCSS = css !== false && !isIE9;
  var userWantsControl =
    leave &&
    // leave hook may be a bound method which exposes
    // the length of original fn as _length
    (leave._length || leave.length) > 1;

  var cb = el._leaveCb = once(function () {
    if (el.parentNode && el.parentNode._pending) {
      el.parentNode._pending[vnode.key] = null;
    }
    if (expectsCSS) {
      removeTransitionClass(el, leaveActiveClass);
    }
    if (cb.cancelled) {
      if (expectsCSS) {
        removeTransitionClass(el, leaveClass);
      }
      leaveCancelled && leaveCancelled(el);
    } else {
      rm();
      afterLeave && afterLeave(el);
    }
    el._leaveCb = null;
  });

  if (delayLeave) {
    delayLeave(performLeave);
  } else {
    performLeave();
  }

  function performLeave () {
    // the delayed leave may have already been cancelled
    if (cb.cancelled) {
      return
    }
    // record leaving element
    if (!vnode.data.show) {
      (el.parentNode._pending || (el.parentNode._pending = {}))[vnode.key] = vnode;
    }
    beforeLeave && beforeLeave(el);
    if (expectsCSS) {
      addTransitionClass(el, leaveClass);
      addTransitionClass(el, leaveActiveClass);
      nextFrame(function () {
        removeTransitionClass(el, leaveClass);
        if (!cb.cancelled && !userWantsControl) {
          whenTransitionEnds(el, type, cb);
        }
      });
    }
    leave && leave(el, cb);
    if (!expectsCSS && !userWantsControl) {
      cb();
    }
  }
}

function resolveTransition (def$$1) {
  if (!def$$1) {
    return
  }
  /* istanbul ignore else */
  if (typeof def$$1 === 'object') {
    var res = {};
    if (def$$1.css !== false) {
      extend(res, autoCssTransition(def$$1.name || 'v'));
    }
    extend(res, def$$1);
    return res
  } else if (typeof def$$1 === 'string') {
    return autoCssTransition(def$$1)
  }
}

var autoCssTransition = cached(function (name) {
  return {
    enterClass: (name + "-enter"),
    leaveClass: (name + "-leave"),
    appearClass: (name + "-enter"),
    enterActiveClass: (name + "-enter-active"),
    leaveActiveClass: (name + "-leave-active"),
    appearActiveClass: (name + "-enter-active")
  }
});

function once (fn) {
  var called = false;
  return function () {
    if (!called) {
      called = true;
      fn();
    }
  }
}

var transition = inBrowser ? {
  create: function create (_, vnode) {
    if (!vnode.data.show) {
      enter(vnode);
    }
  },
  remove: function remove (vnode, rm) {
    /* istanbul ignore else */
    if (!vnode.data.show) {
      leave(vnode, rm);
    } else {
      rm();
    }
  }
} : {};

var platformModules = [
  attrs,
  klass,
  events,
  domProps,
  style,
  transition
];

/*  */

// the directive module should be applied last, after all
// built-in modules have been applied.
var modules = platformModules.concat(baseModules);

var patch$1 = createPatchFunction({ nodeOps: nodeOps, modules: modules });

/**
 * Not type checking this file because flow doesn't like attaching
 * properties to Elements.
 */

var modelableTagRE = /^input|select|textarea|vue-component-[0-9]+(-[0-9a-zA-Z_-]*)?$/;

/* istanbul ignore if */
if (isIE9) {
  // http://www.matts411.com/post/internet-explorer-9-oninput/
  document.addEventListener('selectionchange', function () {
    var el = document.activeElement;
    if (el && el.vmodel) {
      trigger(el, 'input');
    }
  });
}

var model = {
  inserted: function inserted (el, binding, vnode) {
    if (process.env.NODE_ENV !== 'production') {
      if (!modelableTagRE.test(vnode.tag)) {
        warn(
          "v-model is not supported on element type: <" + (vnode.tag) + ">. " +
          'If you are working with contenteditable, it\'s recommended to ' +
          'wrap a library dedicated for that purpose inside a custom component.',
          vnode.context
        );
      }
    }
    if (vnode.tag === 'select') {
      var cb = function () {
        setSelected(el, binding, vnode.context);
      };
      cb();
      /* istanbul ignore if */
      if (isIE || isEdge) {
        setTimeout(cb, 0);
      }
    } else if (
      (vnode.tag === 'textarea' || el.type === 'text') &&
      !binding.modifiers.lazy
    ) {
      if (!isAndroid) {
        el.addEventListener('compositionstart', onCompositionStart);
        el.addEventListener('compositionend', onCompositionEnd);
      }
      /* istanbul ignore if */
      if (isIE9) {
        el.vmodel = true;
      }
    }
  },
  componentUpdated: function componentUpdated (el, binding, vnode) {
    if (vnode.tag === 'select') {
      setSelected(el, binding, vnode.context);
      // in case the options rendered by v-for have changed,
      // it's possible that the value is out-of-sync with the rendered options.
      // detect such cases and filter out values that no longer has a matching
      // option in the DOM.
      var needReset = el.multiple
        ? binding.value.some(function (v) { return hasNoMatchingOption(v, el.options); })
        : binding.value !== binding.oldValue && hasNoMatchingOption(binding.value, el.options);
      if (needReset) {
        trigger(el, 'change');
      }
    }
  }
};

function setSelected (el, binding, vm) {
  var value = binding.value;
  var isMultiple = el.multiple;
  if (isMultiple && !Array.isArray(value)) {
    process.env.NODE_ENV !== 'production' && warn(
      "<select multiple v-model=\"" + (binding.expression) + "\"> " +
      "expects an Array value for its binding, but got " + (Object.prototype.toString.call(value).slice(8, -1)),
      vm
    );
    return
  }
  var selected, option;
  for (var i = 0, l = el.options.length; i < l; i++) {
    option = el.options[i];
    if (isMultiple) {
      selected = looseIndexOf(value, getValue(option)) > -1;
      if (option.selected !== selected) {
        option.selected = selected;
      }
    } else {
      if (looseEqual(getValue(option), value)) {
        if (el.selectedIndex !== i) {
          el.selectedIndex = i;
        }
        return
      }
    }
  }
  if (!isMultiple) {
    el.selectedIndex = -1;
  }
}

function hasNoMatchingOption (value, options) {
  for (var i = 0, l = options.length; i < l; i++) {
    if (looseEqual(getValue(options[i]), value)) {
      return false
    }
  }
  return true
}

function getValue (option) {
  return '_value' in option
    ? option._value
    : option.value
}

function onCompositionStart (e) {
  e.target.composing = true;
}

function onCompositionEnd (e) {
  e.target.composing = false;
  trigger(e.target, 'input');
}

function trigger (el, type) {
  var e = document.createEvent('HTMLEvents');
  e.initEvent(type, true, true);
  el.dispatchEvent(e);
}

/*  */

// recursively search for possible transition defined inside the component root
function locateNode (vnode) {
  return vnode.child && (!vnode.data || !vnode.data.transition)
    ? locateNode(vnode.child._vnode)
    : vnode
}

var show = {
  bind: function bind (el, ref, vnode) {
    var value = ref.value;

    vnode = locateNode(vnode);
    var transition = vnode.data && vnode.data.transition;
    if (value && transition && !isIE9) {
      enter(vnode);
    }
    var originalDisplay = el.style.display === 'none' ? '' : el.style.display;
    el.style.display = value ? originalDisplay : 'none';
    el.__vOriginalDisplay = originalDisplay;
  },
  update: function update (el, ref, vnode) {
    var value = ref.value;
    var oldValue = ref.oldValue;

    /* istanbul ignore if */
    if (value === oldValue) { return }
    vnode = locateNode(vnode);
    var transition = vnode.data && vnode.data.transition;
    if (transition && !isIE9) {
      if (value) {
        enter(vnode);
        el.style.display = el.__vOriginalDisplay;
      } else {
        leave(vnode, function () {
          el.style.display = 'none';
        });
      }
    } else {
      el.style.display = value ? el.__vOriginalDisplay : 'none';
    }
  }
};

var platformDirectives = {
  model: model,
  show: show
};

/*  */

// Provides transition support for a single element/component.
// supports transition mode (out-in / in-out)

var transitionProps = {
  name: String,
  appear: Boolean,
  css: Boolean,
  mode: String,
  type: String,
  enterClass: String,
  leaveClass: String,
  enterActiveClass: String,
  leaveActiveClass: String,
  appearClass: String,
  appearActiveClass: String
};

// in case the child is also an abstract component, e.g. <keep-alive>
// we want to recursively retrieve the real component to be rendered
function getRealChild (vnode) {
  var compOptions = vnode && vnode.componentOptions;
  if (compOptions && compOptions.Ctor.options.abstract) {
    return getRealChild(getFirstComponentChild(compOptions.children))
  } else {
    return vnode
  }
}

function extractTransitionData (comp) {
  var data = {};
  var options = comp.$options;
  // props
  for (var key in options.propsData) {
    data[key] = comp[key];
  }
  // events.
  // extract listeners and pass them directly to the transition methods
  var listeners = options._parentListeners;
  for (var key$1 in listeners) {
    data[camelize(key$1)] = listeners[key$1].fn;
  }
  return data
}

function placeholder (h, rawChild) {
  return /\d-keep-alive$/.test(rawChild.tag)
    ? h('keep-alive')
    : null
}

function hasParentTransition (vnode) {
  while ((vnode = vnode.parent)) {
    if (vnode.data.transition) {
      return true
    }
  }
}

var Transition = {
  name: 'transition',
  props: transitionProps,
  abstract: true,
  render: function render (h) {
    var this$1 = this;

    var children = this.$slots.default;
    if (!children) {
      return
    }

    // filter out text nodes (possible whitespaces)
    children = children.filter(function (c) { return c.tag; });
    /* istanbul ignore if */
    if (!children.length) {
      return
    }

    // warn multiple elements
    if (process.env.NODE_ENV !== 'production' && children.length > 1) {
      warn(
        '<transition> can only be used on a single element. Use ' +
        '<transition-group> for lists.',
        this.$parent
      );
    }

    var mode = this.mode;

    // warn invalid mode
    if (process.env.NODE_ENV !== 'production' &&
        mode && mode !== 'in-out' && mode !== 'out-in') {
      warn(
        'invalid <transition> mode: ' + mode,
        this.$parent
      );
    }

    var rawChild = children[0];

    // if this is a component root node and the component's
    // parent container node also has transition, skip.
    if (hasParentTransition(this.$vnode)) {
      return rawChild
    }

    // apply transition data to child
    // use getRealChild() to ignore abstract components e.g. keep-alive
    var child = getRealChild(rawChild);
    /* istanbul ignore if */
    if (!child) {
      return rawChild
    }

    if (this._leaving) {
      return placeholder(h, rawChild)
    }

    var key = child.key = child.key == null || child.isStatic
      ? ("__v" + (child.tag + this._uid) + "__")
      : child.key;
    var data = (child.data || (child.data = {})).transition = extractTransitionData(this);
    var oldRawChild = this._vnode;
    var oldChild = getRealChild(oldRawChild);

    // mark v-show
    // so that the transition module can hand over the control to the directive
    if (child.data.directives && child.data.directives.some(function (d) { return d.name === 'show'; })) {
      child.data.show = true;
    }

    if (oldChild && oldChild.data && oldChild.key !== key) {
      // replace old child transition data with fresh one
      // important for dynamic transitions!
      var oldData = oldChild.data.transition = extend({}, data);

      // handle transition mode
      if (mode === 'out-in') {
        // return placeholder node and queue update when leave finishes
        this._leaving = true;
        mergeVNodeHook(oldData, 'afterLeave', function () {
          this$1._leaving = false;
          this$1.$forceUpdate();
        }, key);
        return placeholder(h, rawChild)
      } else if (mode === 'in-out') {
        var delayedLeave;
        var performLeave = function () { delayedLeave(); };
        mergeVNodeHook(data, 'afterEnter', performLeave, key);
        mergeVNodeHook(data, 'enterCancelled', performLeave, key);
        mergeVNodeHook(oldData, 'delayLeave', function (leave) {
          delayedLeave = leave;
        }, key);
      }
    }

    return rawChild
  }
};

/*  */

// Provides transition support for list items.
// supports move transitions using the FLIP technique.

// Because the vdom's children update algorithm is "unstable" - i.e.
// it doesn't guarantee the relative positioning of removed elements,
// we force transition-group to update its children into two passes:
// in the first pass, we remove all nodes that need to be removed,
// triggering their leaving transition; in the second pass, we insert/move
// into the final disired state. This way in the second pass removed
// nodes will remain where they should be.

var props = extend({
  tag: String,
  moveClass: String
}, transitionProps);

delete props.mode;

var TransitionGroup = {
  props: props,

  render: function render (h) {
    var tag = this.tag || this.$vnode.data.tag || 'span';
    var map = Object.create(null);
    var prevChildren = this.prevChildren = this.children;
    var rawChildren = this.$slots.default || [];
    var children = this.children = [];
    var transitionData = extractTransitionData(this);

    for (var i = 0; i < rawChildren.length; i++) {
      var c = rawChildren[i];
      if (c.tag) {
        if (c.key != null && String(c.key).indexOf('__vlist') !== 0) {
          children.push(c);
          map[c.key] = c
          ;(c.data || (c.data = {})).transition = transitionData;
        } else if (process.env.NODE_ENV !== 'production') {
          var opts = c.componentOptions;
          var name = opts
            ? (opts.Ctor.options.name || opts.tag)
            : c.tag;
          warn(("<transition-group> children must be keyed: <" + name + ">"));
        }
      }
    }

    if (prevChildren) {
      var kept = [];
      var removed = [];
      for (var i$1 = 0; i$1 < prevChildren.length; i$1++) {
        var c$1 = prevChildren[i$1];
        c$1.data.transition = transitionData;
        c$1.data.pos = c$1.elm.getBoundingClientRect();
        if (map[c$1.key]) {
          kept.push(c$1);
        } else {
          removed.push(c$1);
        }
      }
      this.kept = h(tag, null, kept);
      this.removed = removed;
    }

    return h(tag, null, children)
  },

  beforeUpdate: function beforeUpdate () {
    // force removing pass
    this.__patch__(
      this._vnode,
      this.kept,
      false, // hydrating
      true // removeOnly (!important, avoids unnecessary moves)
    );
    this._vnode = this.kept;
  },

  updated: function updated () {
    var children = this.prevChildren;
    var moveClass = this.moveClass || (this.name + '-move');
    if (!children.length || !this.hasMove(children[0].elm, moveClass)) {
      return
    }

    // we divide the work into three loops to avoid mixing DOM reads and writes
    // in each iteration - which helps prevent layout thrashing.
    children.forEach(callPendingCbs);
    children.forEach(recordPosition);
    children.forEach(applyTranslation);

    // force reflow to put everything in position
    var f = document.body.offsetHeight; // eslint-disable-line

    children.forEach(function (c) {
      if (c.data.moved) {
        var el = c.elm;
        var s = el.style;
        addTransitionClass(el, moveClass);
        s.transform = s.WebkitTransform = s.transitionDuration = '';
        el.addEventListener(transitionEndEvent, el._moveCb = function cb (e) {
          if (!e || /transform$/.test(e.propertyName)) {
            el.removeEventListener(transitionEndEvent, cb);
            el._moveCb = null;
            removeTransitionClass(el, moveClass);
          }
        });
      }
    });
  },

  methods: {
    hasMove: function hasMove (el, moveClass) {
      /* istanbul ignore if */
      if (!hasTransition) {
        return false
      }
      if (this._hasMove != null) {
        return this._hasMove
      }
      addTransitionClass(el, moveClass);
      var info = getTransitionInfo(el);
      removeTransitionClass(el, moveClass);
      return (this._hasMove = info.hasTransform)
    }
  }
};

function callPendingCbs (c) {
  /* istanbul ignore if */
  if (c.elm._moveCb) {
    c.elm._moveCb();
  }
  /* istanbul ignore if */
  if (c.elm._enterCb) {
    c.elm._enterCb();
  }
}

function recordPosition (c) {
  c.data.newPos = c.elm.getBoundingClientRect();
}

function applyTranslation (c) {
  var oldPos = c.data.pos;
  var newPos = c.data.newPos;
  var dx = oldPos.left - newPos.left;
  var dy = oldPos.top - newPos.top;
  if (dx || dy) {
    c.data.moved = true;
    var s = c.elm.style;
    s.transform = s.WebkitTransform = "translate(" + dx + "px," + dy + "px)";
    s.transitionDuration = '0s';
  }
}

var platformComponents = {
  Transition: Transition,
  TransitionGroup: TransitionGroup
};

/*  */

// install platform specific utils
Vue$2.config.isUnknownElement = isUnknownElement;
Vue$2.config.isReservedTag = isReservedTag;
Vue$2.config.getTagNamespace = getTagNamespace;
Vue$2.config.mustUseProp = mustUseProp;

// install platform runtime directives & components
extend(Vue$2.options.directives, platformDirectives);
extend(Vue$2.options.components, platformComponents);

// install platform patch function
Vue$2.prototype.__patch__ = config._isServer ? noop : patch$1;

// wrap mount
Vue$2.prototype.$mount = function (
  el,
  hydrating
) {
  el = el && !config._isServer ? query(el) : undefined;
  return this._mount(el, hydrating)
};

// devtools global hook
/* istanbul ignore next */
setTimeout(function () {
  if (config.devtools) {
    if (devtools) {
      devtools.emit('init', Vue$2);
    } else if (
      process.env.NODE_ENV !== 'production' &&
      inBrowser && /Chrome\/\d+/.test(window.navigator.userAgent)
    ) {
      console.log(
        'Download the Vue Devtools for a better development experience:\n' +
        'https://github.com/vuejs/vue-devtools'
      );
    }
  }
}, 0);

module.exports = Vue$2;

}).call(this,require('_process'))

},{"_process":2}],5:[function(require,module,exports){
var inserted = exports.cache = {}

function noop () {}

exports.insert = function (css) {
  if (inserted[css]) return noop
  inserted[css] = true

  var elem = document.createElement('style')
  elem.setAttribute('type', 'text/css')

  if ('textContent' in elem) {
    elem.textContent = css
  } else {
    elem.styleSheet.cssText = css
  }

  document.getElementsByTagName('head')[0].appendChild(elem)
  return function () {
    document.getElementsByTagName('head')[0].removeChild(elem)
    inserted[css] = false
  }
}

},{}],6:[function(require,module,exports){
/**
 * vuex v2.0.0
 * (c) 2016 Evan You
 * @license MIT
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.Vuex = factory());
}(this, (function () { 'use strict';

var devtoolHook =
  typeof window !== 'undefined' &&
  window.__VUE_DEVTOOLS_GLOBAL_HOOK__

function devtoolPlugin (store) {
  if (!devtoolHook) { return }

  store._devtoolHook = devtoolHook

  devtoolHook.emit('vuex:init', store)

  devtoolHook.on('vuex:travel-to-state', function (targetState) {
    store.replaceState(targetState)
  })

  store.subscribe(function (mutation, state) {
    devtoolHook.emit('vuex:mutation', mutation, state)
  })
}

function applyMixin (Vue) {
  var version = Number(Vue.version.split('.')[0])

  if (version >= 2) {
    var usesInit = Vue.config._lifecycleHooks.indexOf('init') > -1
    Vue.mixin(usesInit ? { init: vuexInit } : { beforeCreate: vuexInit })
  } else {
    // override init and inject vuex init procedure
    // for 1.x backwards compatibility.
    var _init = Vue.prototype._init
    Vue.prototype._init = function (options) {
      if ( options === void 0 ) options = {};

      options.init = options.init
        ? [vuexInit].concat(options.init)
        : vuexInit
      _init.call(this, options)
    }
  }

  /**
   * Vuex init hook, injected into each instances init hooks list.
   */

  function vuexInit () {
    var options = this.$options
    // store injection
    if (options.store) {
      this.$store = options.store
    } else if (options.parent && options.parent.$store) {
      this.$store = options.parent.$store
    }
  }
}

function mapState (states) {
  var res = {}
  normalizeMap(states).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedState () {
      return typeof val === 'function'
        ? val.call(this, this.$store.state, this.$store.getters)
        : this.$store.state[val]
    }
  })
  return res
}

function mapMutations (mutations) {
  var res = {}
  normalizeMap(mutations).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedMutation () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      return this.$store.commit.apply(this.$store, [val].concat(args))
    }
  })
  return res
}

function mapGetters (getters) {
  var res = {}
  normalizeMap(getters).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedGetter () {
      if (!(val in this.$store.getters)) {
        console.error(("[vuex] unknown getter: " + val))
      }
      return this.$store.getters[val]
    }
  })
  return res
}

function mapActions (actions) {
  var res = {}
  normalizeMap(actions).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedAction () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      return this.$store.dispatch.apply(this.$store, [val].concat(args))
    }
  })
  return res
}

function normalizeMap (map) {
  return Array.isArray(map)
    ? map.map(function (key) { return ({ key: key, val: key }); })
    : Object.keys(map).map(function (key) { return ({ key: key, val: map[key] }); })
}

function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

function isPromise (val) {
  return val && typeof val.then === 'function'
}

function assert (condition, msg) {
  if (!condition) { throw new Error(("[vuex] " + msg)) }
}

var Vue // bind on install

var Store = function Store (options) {
  var this$1 = this;
  if ( options === void 0 ) options = {};

  assert(Vue, "must call Vue.use(Vuex) before creating a store instance.")
  assert(typeof Promise !== 'undefined', "vuex requires a Promise polyfill in this browser.")

  var state = options.state; if ( state === void 0 ) state = {};
  var plugins = options.plugins; if ( plugins === void 0 ) plugins = [];
  var strict = options.strict; if ( strict === void 0 ) strict = false;

  // store internal state
  this._options = options
  this._committing = false
  this._actions = Object.create(null)
  this._mutations = Object.create(null)
  this._wrappedGetters = Object.create(null)
  this._runtimeModules = Object.create(null)
  this._subscribers = []
  this._watcherVM = new Vue()

    // bind commit and dispatch to self
  var store = this
  var ref = this;
  var dispatch = ref.dispatch;
  var commit = ref.commit;
  this.dispatch = function boundDispatch (type, payload) {
    return dispatch.call(store, type, payload)
    }
    this.commit = function boundCommit (type, payload, options) {
    return commit.call(store, type, payload, options)
  }

  // strict mode
  this.strict = strict

  // init root module.
  // this also recursively registers all sub-modules
  // and collects all module getters inside this._wrappedGetters
  installModule(this, state, [], options)

  // initialize the store vm, which is responsible for the reactivity
  // (also registers _wrappedGetters as computed properties)
  resetStoreVM(this, state)

  // apply plugins
  plugins.concat(devtoolPlugin).forEach(function (plugin) { return plugin(this$1); })
};

var prototypeAccessors = { state: {} };

prototypeAccessors.state.get = function () {
  return this._vm.state
};

prototypeAccessors.state.set = function (v) {
  assert(false, "Use store.replaceState() to explicit replace store state.")
};

Store.prototype.commit = function commit (type, payload, options) {
    var this$1 = this;

  // check object-style commit
  if (isObject(type) && type.type) {
    options = payload
    payload = type
    type = type.type
  }
  var mutation = { type: type, payload: payload }
  var entry = this._mutations[type]
  if (!entry) {
    console.error(("[vuex] unknown mutation type: " + type))
    return
  }
  this._withCommit(function () {
    entry.forEach(function commitIterator (handler) {
      handler(payload)
    })
  })
  if (!options || !options.silent) {
    this._subscribers.forEach(function (sub) { return sub(mutation, this$1.state); })
  }
};

Store.prototype.dispatch = function dispatch (type, payload) {
  // check object-style dispatch
  if (isObject(type) && type.type) {
    payload = type
    type = type.type
  }
  var entry = this._actions[type]
  if (!entry) {
    console.error(("[vuex] unknown action type: " + type))
    return
  }
  return entry.length > 1
    ? Promise.all(entry.map(function (handler) { return handler(payload); }))
    : entry[0](payload)
};

Store.prototype.subscribe = function subscribe (fn) {
  var subs = this._subscribers
  if (subs.indexOf(fn) < 0) {
    subs.push(fn)
  }
  return function () {
    var i = subs.indexOf(fn)
    if (i > -1) {
      subs.splice(i, 1)
    }
  }
};

Store.prototype.watch = function watch (getter, cb, options) {
    var this$1 = this;

  assert(typeof getter === 'function', "store.watch only accepts a function.")
  return this._watcherVM.$watch(function () { return getter(this$1.state); }, cb, options)
};

Store.prototype.replaceState = function replaceState (state) {
    var this$1 = this;

  this._withCommit(function () {
    this$1._vm.state = state
  })
};

Store.prototype.registerModule = function registerModule (path, module) {
  if (typeof path === 'string') { path = [path] }
  assert(Array.isArray(path), "module path must be a string or an Array.")
  this._runtimeModules[path.join('.')] = module
  installModule(this, this.state, path, module)
  // reset store to update getters...
  resetStoreVM(this, this.state)
};

Store.prototype.unregisterModule = function unregisterModule (path) {
    var this$1 = this;

  if (typeof path === 'string') { path = [path] }
  assert(Array.isArray(path), "module path must be a string or an Array.")
    delete this._runtimeModules[path.join('.')]
  this._withCommit(function () {
    var parentState = getNestedState(this$1.state, path.slice(0, -1))
    Vue.delete(parentState, path[path.length - 1])
  })
  resetStore(this)
};

Store.prototype.hotUpdate = function hotUpdate (newOptions) {
  updateModule(this._options, newOptions)
  resetStore(this)
};

Store.prototype._withCommit = function _withCommit (fn) {
  var committing = this._committing
  this._committing = true
  fn()
  this._committing = committing
};

Object.defineProperties( Store.prototype, prototypeAccessors );

function updateModule (targetModule, newModule) {
  if (newModule.actions) {
    targetModule.actions = newModule.actions
  }
  if (newModule.mutations) {
    targetModule.mutations = newModule.mutations
  }
  if (newModule.getters) {
    targetModule.getters = newModule.getters
  }
  if (newModule.modules) {
    for (var key in newModule.modules) {
      if (!(targetModule.modules && targetModule.modules[key])) {
        console.warn(
          "[vuex] trying to add a new module '" + key + "' on hot reloading, " +
          'manual reload is needed'
        )
        return
      }
      updateModule(targetModule.modules[key], newModule.modules[key])
    }
  }
}

function resetStore (store) {
  store._actions = Object.create(null)
  store._mutations = Object.create(null)
  store._wrappedGetters = Object.create(null)
  var state = store.state
  // init root module
  installModule(store, state, [], store._options, true)
  // init all runtime modules
  Object.keys(store._runtimeModules).forEach(function (key) {
    installModule(store, state, key.split('.'), store._runtimeModules[key], true)
  })
  // reset vm
  resetStoreVM(store, state)
}

function resetStoreVM (store, state) {
  var oldVm = store._vm

  // bind store public getters
  store.getters = {}
  var wrappedGetters = store._wrappedGetters
  var computed = {}
  Object.keys(wrappedGetters).forEach(function (key) {
    var fn = wrappedGetters[key]
    // use computed to leverage its lazy-caching mechanism
    computed[key] = function () { return fn(store); }
    Object.defineProperty(store.getters, key, {
      get: function () { return store._vm[key]; }
    })
  })

  // use a Vue instance to store the state tree
  // suppress warnings just in case the user has added
  // some funky global mixins
  var silent = Vue.config.silent
  Vue.config.silent = true
  store._vm = new Vue({
    data: { state: state },
    computed: computed
  })
  Vue.config.silent = silent

  // enable strict mode for new vm
  if (store.strict) {
    enableStrictMode(store)
  }

  if (oldVm) {
    // dispatch changes in all subscribed watchers
    // to force getter re-evaluation.
    store._withCommit(function () {
      oldVm.state = null
    })
    Vue.nextTick(function () { return oldVm.$destroy(); })
  }
}

function installModule (store, rootState, path, module, hot) {
  var isRoot = !path.length
  var state = module.state;
  var actions = module.actions;
  var mutations = module.mutations;
  var getters = module.getters;
  var modules = module.modules;

  // set state
  if (!isRoot && !hot) {
    var parentState = getNestedState(rootState, path.slice(0, -1))
    var moduleName = path[path.length - 1]
    store._withCommit(function () {
      Vue.set(parentState, moduleName, state || {})
    })
  }

  if (mutations) {
    Object.keys(mutations).forEach(function (key) {
      registerMutation(store, key, mutations[key], path)
    })
  }

  if (actions) {
    Object.keys(actions).forEach(function (key) {
      registerAction(store, key, actions[key], path)
    })
  }

  if (getters) {
    wrapGetters(store, getters, path)
  }

  if (modules) {
    Object.keys(modules).forEach(function (key) {
      installModule(store, rootState, path.concat(key), modules[key], hot)
    })
  }
}

function registerMutation (store, type, handler, path) {
  if ( path === void 0 ) path = [];

  var entry = store._mutations[type] || (store._mutations[type] = [])
  entry.push(function wrappedMutationHandler (payload) {
    handler(getNestedState(store.state, path), payload)
  })
}

function registerAction (store, type, handler, path) {
  if ( path === void 0 ) path = [];

  var entry = store._actions[type] || (store._actions[type] = [])
  var dispatch = store.dispatch;
  var commit = store.commit;
  entry.push(function wrappedActionHandler (payload, cb) {
    var res = handler({
      dispatch: dispatch,
      commit: commit,
      getters: store.getters,
      state: getNestedState(store.state, path),
      rootState: store.state
    }, payload, cb)
    if (!isPromise(res)) {
      res = Promise.resolve(res)
    }
    if (store._devtoolHook) {
      return res.catch(function (err) {
        store._devtoolHook.emit('vuex:error', err)
        throw err
      })
    } else {
      return res
    }
  })
}

function wrapGetters (store, moduleGetters, modulePath) {
  Object.keys(moduleGetters).forEach(function (getterKey) {
    var rawGetter = moduleGetters[getterKey]
    if (store._wrappedGetters[getterKey]) {
      console.error(("[vuex] duplicate getter key: " + getterKey))
      return
    }
    store._wrappedGetters[getterKey] = function wrappedGetter (store) {
      return rawGetter(
        getNestedState(store.state, modulePath), // local state
        store.getters, // getters
        store.state // root state
      )
    }
  })
}

function enableStrictMode (store) {
  store._vm.$watch('state', function () {
    assert(store._committing, "Do not mutate vuex store state outside mutation handlers.")
  }, { deep: true, sync: true })
}

function getNestedState (state, path) {
  return path.length
    ? path.reduce(function (state, key) { return state[key]; }, state)
    : state
}

function install (_Vue) {
  if (Vue) {
    console.error(
      '[vuex] already installed. Vue.use(Vuex) should be called only once.'
    )
    return
  }
  Vue = _Vue
  applyMixin(Vue)
}

// auto install in dist mode
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

var index = {
  Store: Store,
  install: install,
  mapState: mapState,
  mapMutations: mapMutations,
  mapGetters: mapGetters,
  mapActions: mapActions
}

return index;

})));
},{}],7:[function(require,module,exports){
'use strict';

var _vue = require('vue');

var _vue2 = _interopRequireDefault(_vue);

var _vuex = require('vuex');

var _vuex2 = _interopRequireDefault(_vuex);

var _store = require('./store/store');

var _store2 = _interopRequireDefault(_store);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Main = require('../vue/main.vue');

new _vue2.default({
    el: '#Main',

    store: _store2.default,

    render: function render(createElement) {
        return createElement(Main);
    }
});

// update virtual time
setInterval(function () {
    return _store2.default.dispatch('updateTime');
}, 100);

// discharge batteries
setInterval(function () {
    return _store2.default.commit('BATTERY_DISCHARGE', { amount: 1 });
}, 1000);

},{"../vue/main.vue":18,"./store/store":13,"vue":4,"vuex":6}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.updateTime = exports.craft = undefined;

var _utils = require('../utils');

var validateRequirements = function validateRequirements(state, requirements) {
    if (requirements.energy && requirements.energy > state.battery.energy) {
        return false;
    }

    if (requirements.resources) {
        for (var type in requirements.resources) {
            if (requirements.resources[type] > state.inventory[type]) {
                return false;
            }
        }
    }

    return true;
};

var craft = exports.craft = function craft(_ref, resource) {
    var commit = _ref.commit,
        state = _ref.state;

    if (!validateRequirements(state, resource.requires)) {
        return false;
    }

    if (resource.requires.energy) {
        commit('BATTERY_DISCHARGE', {
            amount: resource.requires.energy
        });
    }

    if (resource.requires.resources) {
        for (var type in resource.requires.resources) {
            commit('INVENTORY_REMOVE', {
                type: type,
                amount: resource.requires.resources[type]
            });
        }
    }

    commit('INVENTORY_ADD', {
        type: resource.type,
        amount: 1
    });
};

var updateTime = exports.updateTime = function updateTime(_ref2) {
    var commit = _ref2.commit,
        state = _ref2.state;

    var time = (0, _utils.gameTime)(55);
    if (time !== state.time) {
        commit('SET_TIME', { time: time });
    }
};

},{"../utils":14}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var INVENTORY_ADD = exports.INVENTORY_ADD = function INVENTORY_ADD(state, data) {
    var amount = data.amount || 1;
    if (state.inventory[data.type]) {
        state.inventory[data.type] += amount;
    } else {
        state.inventory = _extends({}, state.inventory, _defineProperty({}, data.type, amount));
    }
};

var INVENTORY_REMOVE = exports.INVENTORY_REMOVE = function INVENTORY_REMOVE(state, data) {
    var amount = data.amount || 1;
    if (state.inventory[data.type]) {
        state.inventory[data.type] = Math.max(0, state.inventory[data.type] -= amount);
    }
};

var BATTERY_CHARGE = exports.BATTERY_CHARGE = function BATTERY_CHARGE(state, data) {
    var amount = data.amount || 1;
    state.battery.energy = Math.min(state.battery.capacity, state.battery.energy + amount);
};

var BATTERY_DISCHARGE = exports.BATTERY_DISCHARGE = function BATTERY_DISCHARGE(state, data) {
    var amount = data.amount || 1;
    state.battery.energy = Math.max(0, state.battery.energy - amount);
};

var SET_TIME = exports.SET_TIME = function SET_TIME(state, data) {
    state.time = data.time;
};

},{}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    energy: 0,
    capacity: 100
};

},{}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {};

},{}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = [{
    type: 'iron',
    label: 'Iron',
    icon: 'src/icons/iron.svg',
    requires: {
        energy: 10
    }
}, {
    type: 'copper',
    label: 'Copper',
    icon: 'src/icons/copper.svg',
    requires: {
        energy: 20
    }
}, {
    type: 'silicon',
    label: 'Silicon',
    icon: 'src/icons/silicon.svg',
    requires: {
        energy: 25
    }
}, {
    type: 'solar-panel',
    label: 'Solar Panel',
    icon: 'src/icons/solar-panel.svg',
    requires: {
        energy: 60,
        resources: {
            iron: 5,
            copper: 5,
            silicon: 5
        }
    }
}];

},{}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _vue = require('vue');

var _vue2 = _interopRequireDefault(_vue);

var _vuex = require('vuex');

var _vuex2 = _interopRequireDefault(_vuex);

var _resources = require('./state/resources');

var _resources2 = _interopRequireDefault(_resources);

var _inventory = require('./state/inventory');

var _inventory2 = _interopRequireDefault(_inventory);

var _battery = require('./state/battery');

var _battery2 = _interopRequireDefault(_battery);

var _mutations = require('./mutations');

var mutations = _interopRequireWildcard(_mutations);

var _actions = require('./actions');

var actions = _interopRequireWildcard(_actions);

var _utils = require('../utils');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_vue2.default.use(_vuex2.default);

var savedData = localStorage.getItem('CLICKER');
var state = savedData ? JSON.parse(savedData) : {
    inventory: _inventory2.default,
    battery: _battery2.default
};

var state = _extends({}, state, {
    resources: _resources2.default,
    inventory: _inventory2.default // reset inventory for testing
});

var store = new _vuex2.default.Store({
    state: state,
    mutations: mutations,
    actions: actions
});

exports.default = store;


var save = function save() {
    return localStorage.setItem('CLICKER', JSON.stringify(store.state));
};
// save every minute
setInterval(save, 60000);
// add on unload
window.onunload = save;

},{"../utils":14,"./actions":8,"./mutations":9,"./state/battery":10,"./state/inventory":11,"./state/resources":12,"vue":4,"vuex":6}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var realDurationInMs = 24 * 60 * 60 * 1000;

var gameTime = exports.gameTime = function gameTime(durationInMinutes) {
    var gameDurationInMs = durationInMinutes * 60 * 1000;
    var currentTimeInMs = Date.now() % gameDurationInMs / gameDurationInMs * realDurationInMs;
    return Math.round(currentTimeInMs / (1000 * 60));
};

},{}],15:[function(require,module,exports){
var __vueify_style_dispose__ = require("vueify/lib/insert-css").insert(".battery {\n    border: 1px solid #000;\n    height: 50px;\n    width: 100%;\n    position: relative;\n    line-height: 50px;\n    text-align: center;\n}\n\n.battery .energy {\n    position: absolute;\n    height: 100%;\n    top: 0px;\n    left: 0px;\n    background-color: green;\n    transition: background-color 1s linear, width 1s linear;\n    z-index: -1;\n}\n\n.battery .energy.medium {\n    background-color: yellow;\n}\n\n.battery .energy.low {\n    background-color: red;\n}")
;(function(){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {

    computed: {
        energy: function energy() {
            return this.$store.state.battery.energy;
        },
        capacity: function capacity() {
            return this.$store.state.battery.capacity;
        },
        percentage: function percentage() {
            return Math.round(this.energy / this.capacity * 100);
        },
        classes: function classes() {
            return {
                energy: true,
                low: this.percentage <= 20,
                medium: this.percentage > 20 && this.percentage <= 50
            };
        },
        style: function style() {
            return 'width: ' + this.percentage + '%';
        }
    }
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;return _vm._h('div',[_vm._h('div',{staticClass:"battery"},[_vm._h('div',{class:_vm.classes,style:(_vm.style)})," ",_vm._h('span',[_vm._s(_vm.energy)+" / "+_vm._s(_vm.capacity)])])])}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  module.hot.dispose(__vueify_style_dispose__)
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-2", __vue__options__)
  } else {
    hotAPI.rerender("data-v-2", __vue__options__)
  }
})()}

},{"vue":4,"vue-hot-reload-api":3,"vueify/lib/insert-css":5}],16:[function(require,module,exports){
var __vueify_style_dispose__ = require("vueify/lib/insert-css").insert(".craft-box .icon {\n    height: 2em;\n}\n\n.craft-box .requirements {\n    float: right;\n}\n\n.craft-box .requirement {\n    display: inline-block;\n}\n\n.craft-box .requirement:not(:first-child) {\n    margin-left: 1em;\n}")
;(function(){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _vuex = require('vuex');

exports.default = {

    computed: {
        resources: function resources() {
            return this.$store.state.resources;
        }
    },

    methods: _extends({}, (0, _vuex.mapActions)(['craft']), {

        icon: function icon(type) {
            return this.$store.state.resources.find(function (resource) {
                return resource.type === type;
            }).icon;
        }
    })

};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;return _vm._h('div',{staticClass:"container-fluid"},[_vm._l((_vm.resources),function(resource){return _vm._h('div',{staticClass:"card card-block craft-box"},[_vm._h('span',{staticClass:"requirements"},[(resource.requires.energy)?_vm._h('span',{staticClass:"requirement"},[_vm._m(0,true)," x "+_vm._s(resource.requires.energy)+"\n            "]):_vm._e()," ",_vm._l((resource.requires.resources),function(amount,type){return _vm._h('span',{staticClass:"requirement"},[_vm._h('img',{staticClass:"icon",attrs:{"src":_vm.icon(type)}})," x "+_vm._s(amount)+"\n            "])})])," ",_vm._h('h3',{staticClass:"card-title"},["\n            "+_vm._s(resource.label)+"\n        "])," ",_vm._h('a',{staticClass:"btn btn-primary",attrs:{"href":"#"},on:{"click":function($event){_vm.craft(resource)}}},["Craft"])])})])}
__vue__options__.staticRenderFns = [function render () {var _vm=this;return _vm._h('img',{staticClass:"icon",attrs:{"src":"src/icons/energy.svg"}})}]
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  module.hot.dispose(__vueify_style_dispose__)
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-4", __vue__options__)
  } else {
    hotAPI.rerender("data-v-4", __vue__options__)
  }
})()}

},{"vue":4,"vue-hot-reload-api":3,"vueify/lib/insert-css":5,"vuex":6}],17:[function(require,module,exports){
var __vueify_style_dispose__ = require("vueify/lib/insert-css").insert(".icon {\n    height: 2em;\n}")
;(function(){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    computed: {
        inventory: function inventory() {
            return this.$store.state.inventory;
        }
    },

    methods: {
        icon: function icon(type) {
            var resource = this.$store.state.resources.find(function (resource) {
                return resource.type === type;
            });
            if (!resource) {
                return null;
            }
            return resource.icon;
        },
        label: function label(type) {
            var resource = this.$store.state.resources.find(function (resource) {
                return resource.type === type;
            });
            if (!resource) {
                return null;
            }
            return resource.label;
        }
    }
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;return _vm._h('table',{staticClass:"table table-sm"},[_vm._l((_vm.inventory),function(count,type){return _vm._h('tr',[_vm._h('td',[(_vm.icon(type))?_vm._h('img',{staticClass:"icon",attrs:{"src":_vm.icon(type)}}):_vm._e()," ",(_vm.label(type))?_vm._h('span',[_vm._s(_vm.label(type))]):_vm._h('span',["Unknown"])," "])," ",_vm._h('td',[_vm._s(count)])])})])}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  module.hot.dispose(__vueify_style_dispose__)
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-3", __vue__options__)
  } else {
    hotAPI.rerender("data-v-3", __vue__options__)
  }
})()}

},{"vue":4,"vue-hot-reload-api":3,"vueify/lib/insert-css":5}],18:[function(require,module,exports){
var __vueify_style_dispose__ = require("vueify/lib/insert-css").insert("/*!\n * Bootstrap v4.0.0-alpha.5 (https://getbootstrap.com)\n * Copyright 2011-2016 The Bootstrap Authors\n * Copyright 2011-2016 Twitter, Inc.\n * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)\n */\n/*! normalize.css v4.2.0 | MIT License | github.com/necolas/normalize.css */\n/* line 9, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_normalize.scss */\nhtml {\n  font-family: sans-serif;\n  line-height: 1.15;\n  -ms-text-size-adjust: 100%;\n  -webkit-text-size-adjust: 100%; }\n\n/* line 20, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_normalize.scss */\nbody {\n  margin: 0; }\n\n/* line 33, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_normalize.scss */\narticle,\naside,\ndetails,\nfigcaption,\nfigure,\nfooter,\nheader,\nmain,\nmenu,\nnav,\nsection,\nsummary {\n  display: block; }\n\n/* line 52, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_normalize.scss */\naudio,\ncanvas,\nprogress,\nvideo {\n  display: inline-block; }\n\n/* line 63, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_normalize.scss */\naudio:not([controls]) {\n  display: none;\n  height: 0; }\n\n/* line 72, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_normalize.scss */\nprogress {\n  vertical-align: baseline; }\n\n/* line 81, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_normalize.scss */\ntemplate,\n[hidden] {\n  display: none; }\n\n/* line 94, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_normalize.scss */\na {\n  background-color: transparent;\n  -webkit-text-decoration-skip: objects; }\n\n/* line 104, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_normalize.scss */\na:active,\na:hover {\n  outline-width: 0; }\n\n/* line 117, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_normalize.scss */\nabbr[title] {\n  border-bottom: none;\n  text-decoration: underline;\n  text-decoration: underline dotted; }\n\n/* line 127, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_normalize.scss */\nb,\nstrong {\n  font-weight: inherit; }\n\n/* line 136, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_normalize.scss */\nb,\nstrong {\n  font-weight: bolder; }\n\n/* line 145, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_normalize.scss */\ndfn {\n  font-style: italic; }\n\n/* line 154, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_normalize.scss */\nh1 {\n  font-size: 2em;\n  margin: 0.67em 0; }\n\n/* line 163, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_normalize.scss */\nmark {\n  background-color: #ff0;\n  color: #000; }\n\n/* line 172, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_normalize.scss */\nsmall {\n  font-size: 80%; }\n\n/* line 181, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_normalize.scss */\nsub,\nsup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: baseline; }\n\n/* line 189, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_normalize.scss */\nsub {\n  bottom: -0.25em; }\n\n/* line 193, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_normalize.scss */\nsup {\n  top: -0.5em; }\n\n/* line 204, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_normalize.scss */\nimg {\n  border-style: none; }\n\n/* line 212, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_normalize.scss */\nsvg:not(:root) {\n  overflow: hidden; }\n\n/* line 224, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_normalize.scss */\ncode,\nkbd,\npre,\nsamp {\n  font-family: monospace, monospace;\n  font-size: 1em; }\n\n/* line 236, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_normalize.scss */\nfigure {\n  margin: 1em 40px; }\n\n/* line 245, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_normalize.scss */\nhr {\n  box-sizing: content-box;\n  height: 0;\n  overflow: visible; }\n\n/* line 259, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_normalize.scss */\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  font: inherit;\n  margin: 0; }\n\n/* line 272, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_normalize.scss */\noptgroup {\n  font-weight: bold; }\n\n/* line 281, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_normalize.scss */\nbutton,\ninput {\n  overflow: visible; }\n\n/* line 291, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_normalize.scss */\nbutton,\nselect {\n  text-transform: none; }\n\n/* line 302, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_normalize.scss */\nbutton,\nhtml [type=\"button\"],\n[type=\"reset\"],\n[type=\"submit\"] {\n  -webkit-appearance: button; }\n\n/* line 313, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_normalize.scss */\nbutton::-moz-focus-inner,\n[type=\"button\"]::-moz-focus-inner,\n[type=\"reset\"]::-moz-focus-inner,\n[type=\"submit\"]::-moz-focus-inner {\n  border-style: none;\n  padding: 0; }\n\n/* line 325, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_normalize.scss */\nbutton:-moz-focusring,\n[type=\"button\"]:-moz-focusring,\n[type=\"reset\"]:-moz-focusring,\n[type=\"submit\"]:-moz-focusring {\n  outline: 1px dotted ButtonText; }\n\n/* line 336, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_normalize.scss */\nfieldset {\n  border: 1px solid #c0c0c0;\n  margin: 0 2px;\n  padding: 0.35em 0.625em 0.75em; }\n\n/* line 349, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_normalize.scss */\nlegend {\n  box-sizing: border-box;\n  color: inherit;\n  display: table;\n  max-width: 100%;\n  padding: 0;\n  white-space: normal; }\n\n/* line 362, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_normalize.scss */\ntextarea {\n  overflow: auto; }\n\n/* line 371, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_normalize.scss */\n[type=\"checkbox\"],\n[type=\"radio\"] {\n  box-sizing: border-box;\n  padding: 0; }\n\n/* line 381, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_normalize.scss */\n[type=\"number\"]::-webkit-inner-spin-button,\n[type=\"number\"]::-webkit-outer-spin-button {\n  height: auto; }\n\n/* line 391, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_normalize.scss */\n[type=\"search\"] {\n  -webkit-appearance: textfield;\n  outline-offset: -2px; }\n\n/* line 400, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_normalize.scss */\n[type=\"search\"]::-webkit-search-cancel-button,\n[type=\"search\"]::-webkit-search-decoration {\n  -webkit-appearance: none; }\n\n/* line 409, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_normalize.scss */\n::-webkit-input-placeholder {\n  color: inherit;\n  opacity: 0.54; }\n\n/* line 419, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_normalize.scss */\n::-webkit-file-upload-button {\n  -webkit-appearance: button;\n  font: inherit; }\n\n@media print {\n  /* line 13, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_print.scss */\n  *,\n  *::before,\n  *::after,\n  *::first-letter,\n  p::first-line,\n  div::first-line,\n  blockquote::first-line,\n  li::first-line {\n    text-shadow: none !important;\n    box-shadow: none !important; }\n  /* line 29, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_print.scss */\n  a,\n  a:visited {\n    text-decoration: underline; }\n  /* line 39, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_print.scss */\n  abbr[title]::after {\n    content: \" (\" attr(title) \")\"; }\n  /* line 54, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_print.scss */\n  pre {\n    white-space: pre-wrap !important; }\n  /* line 57, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_print.scss */\n  pre,\n  blockquote {\n    border: 1px solid #999;\n    page-break-inside: avoid; }\n  /* line 68, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_print.scss */\n  thead {\n    display: table-header-group; }\n  /* line 72, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_print.scss */\n  tr,\n  img {\n    page-break-inside: avoid; }\n  /* line 77, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_print.scss */\n  p,\n  h2,\n  h3 {\n    orphans: 3;\n    widows: 3; }\n  /* line 84, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_print.scss */\n  h2,\n  h3 {\n    page-break-after: avoid; }\n  /* line 92, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_print.scss */\n  .navbar {\n    display: none; }\n  /* line 97, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_print.scss */\n  .btn > .caret,\n  .dropup > .btn > .caret {\n    border-top-color: #000 !important; }\n  /* line 101, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_print.scss */\n  .tag {\n    border: 1px solid #000; }\n  /* line 105, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_print.scss */\n  .table {\n    border-collapse: collapse !important; }\n    /* line 108, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_print.scss */\n    .table td,\n    .table th {\n      background-color: #fff !important; }\n  /* line 114, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_print.scss */\n  .table-bordered th,\n  .table-bordered td {\n    border: 1px solid #ddd !important; } }\n\n/* line 22, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_reboot.scss */\nhtml {\n  box-sizing: border-box; }\n\n/* line 26, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_reboot.scss */\n*,\n*::before,\n*::after {\n  box-sizing: inherit; }\n\n@-ms-viewport {\n  width: device-width; }\n\n/* line 57, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_reboot.scss */\nhtml {\n  font-size: 16px;\n  -ms-overflow-style: scrollbar;\n  -webkit-tap-highlight-color: transparent; }\n\n/* line 71, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_reboot.scss */\nbody {\n  font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif;\n  font-size: 1rem;\n  line-height: 1.5;\n  color: #373a3c;\n  background-color: #fff; }\n\n/* line 87, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_reboot.scss */\n[tabindex=\"-1\"]:focus {\n  outline: none !important; }\n\n/* line 100, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_reboot.scss */\nh1, h2, h3, h4, h5, h6 {\n  margin-top: 0;\n  margin-bottom: .5rem; }\n\n/* line 109, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_reboot.scss */\np {\n  margin-top: 0;\n  margin-bottom: 1rem; }\n\n/* line 115, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_reboot.scss */\nabbr[title],\nabbr[data-original-title] {\n  cursor: help;\n  border-bottom: 1px dotted #818a91; }\n\n/* line 122, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_reboot.scss */\naddress {\n  margin-bottom: 1rem;\n  font-style: normal;\n  line-height: inherit; }\n\n/* line 128, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_reboot.scss */\nol,\nul,\ndl {\n  margin-top: 0;\n  margin-bottom: 1rem; }\n\n/* line 135, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_reboot.scss */\nol ol,\nul ul,\nol ul,\nul ol {\n  margin-bottom: 0; }\n\n/* line 142, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_reboot.scss */\ndt {\n  font-weight: bold; }\n\n/* line 146, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_reboot.scss */\ndd {\n  margin-bottom: .5rem;\n  margin-left: 0; }\n\n/* line 151, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_reboot.scss */\nblockquote {\n  margin: 0 0 1rem; }\n\n/* line 160, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_reboot.scss */\na {\n  color: #0275d8;\n  text-decoration: none; }\n  /* line 21, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_hover.scss */\n  a:focus, a:hover {\n    color: #014c8c;\n    text-decoration: underline; }\n  /* line 169, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_reboot.scss */\n  a:focus {\n    outline: 5px auto -webkit-focus-ring-color;\n    outline-offset: -2px; }\n\n/* line 180, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_reboot.scss */\na:not([href]):not([tabindex]) {\n  color: inherit;\n  text-decoration: none; }\n  /* line 21, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_hover.scss */\n  a:not([href]):not([tabindex]):focus, a:not([href]):not([tabindex]):hover {\n    color: inherit;\n    text-decoration: none; }\n  /* line 189, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_reboot.scss */\n  a:not([href]):not([tabindex]):focus {\n    outline: none; }\n\n/* line 199, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_reboot.scss */\npre {\n  margin-top: 0;\n  margin-bottom: 1rem;\n  overflow: auto; }\n\n/* line 213, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_reboot.scss */\nfigure {\n  margin: 0 0 1rem; }\n\n/* line 224, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_reboot.scss */\nimg {\n  vertical-align: middle; }\n\n/* line 239, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_reboot.scss */\n[role=\"button\"] {\n  cursor: pointer; }\n\n/* line 254, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_reboot.scss */\na,\narea,\nbutton,\n[role=\"button\"],\ninput,\nlabel,\nselect,\nsummary,\ntextarea {\n  touch-action: manipulation; }\n\n/* line 271, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_reboot.scss */\ntable {\n  border-collapse: collapse;\n  background-color: transparent; }\n\n/* line 278, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_reboot.scss */\ncaption {\n  padding-top: 0.75rem;\n  padding-bottom: 0.75rem;\n  color: #818a91;\n  text-align: left;\n  caption-side: bottom; }\n\n/* line 286, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_reboot.scss */\nth {\n  text-align: left; }\n\n/* line 296, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_reboot.scss */\nlabel {\n  display: inline-block;\n  margin-bottom: .5rem; }\n\n/* line 306, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_reboot.scss */\nbutton:focus {\n  outline: 1px dotted;\n  outline: 5px auto -webkit-focus-ring-color; }\n\n/* line 311, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_reboot.scss */\ninput,\nbutton,\nselect,\ntextarea {\n  line-height: inherit; }\n\n/* line 325, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_reboot.scss */\ninput[type=\"radio\"]:disabled,\ninput[type=\"checkbox\"]:disabled {\n  cursor: not-allowed; }\n\n/* line 331, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_reboot.scss */\ninput[type=\"date\"],\ninput[type=\"time\"],\ninput[type=\"datetime-local\"],\ninput[type=\"month\"] {\n  -webkit-appearance: listbox; }\n\n/* line 343, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_reboot.scss */\ntextarea {\n  resize: vertical; }\n\n/* line 348, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_reboot.scss */\nfieldset {\n  min-width: 0;\n  padding: 0;\n  margin: 0;\n  border: 0; }\n\n/* line 359, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_reboot.scss */\nlegend {\n  display: block;\n  width: 100%;\n  padding: 0;\n  margin-bottom: .5rem;\n  font-size: 1.5rem;\n  line-height: inherit; }\n\n/* line 369, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_reboot.scss */\ninput[type=\"search\"] {\n  -webkit-appearance: none; }\n\n/* line 378, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_reboot.scss */\noutput {\n  display: inline-block; }\n\n/* line 386, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_reboot.scss */\n[hidden] {\n  display: none !important; }\n\n/* line 5, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_type.scss */\nh1, h2, h3, h4, h5, h6,\n.h1, .h2, .h3, .h4, .h5, .h6 {\n  margin-bottom: 0.5rem;\n  font-family: inherit;\n  font-weight: 500;\n  line-height: 1.1;\n  color: inherit; }\n\n/* line 14, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_type.scss */\nh1, .h1 {\n  font-size: 2.5rem; }\n\n/* line 15, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_type.scss */\nh2, .h2 {\n  font-size: 2rem; }\n\n/* line 16, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_type.scss */\nh3, .h3 {\n  font-size: 1.75rem; }\n\n/* line 17, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_type.scss */\nh4, .h4 {\n  font-size: 1.5rem; }\n\n/* line 18, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_type.scss */\nh5, .h5 {\n  font-size: 1.25rem; }\n\n/* line 19, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_type.scss */\nh6, .h6 {\n  font-size: 1rem; }\n\n/* line 21, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_type.scss */\n.lead {\n  font-size: 1.25rem;\n  font-weight: 300; }\n\n/* line 27, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_type.scss */\n.display-1 {\n  font-size: 6rem;\n  font-weight: 300; }\n\n/* line 31, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_type.scss */\n.display-2 {\n  font-size: 5.5rem;\n  font-weight: 300; }\n\n/* line 35, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_type.scss */\n.display-3 {\n  font-size: 4.5rem;\n  font-weight: 300; }\n\n/* line 39, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_type.scss */\n.display-4 {\n  font-size: 3.5rem;\n  font-weight: 300; }\n\n/* line 49, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_type.scss */\nhr {\n  margin-top: 1rem;\n  margin-bottom: 1rem;\n  border: 0;\n  border-top: 1px solid rgba(0, 0, 0, 0.1); }\n\n/* line 61, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_type.scss */\nsmall,\n.small {\n  font-size: 80%;\n  font-weight: normal; }\n\n/* line 67, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_type.scss */\nmark,\n.mark {\n  padding: 0.2em;\n  background-color: #fcf8e3; }\n\n/* line 78, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_type.scss */\n.list-unstyled {\n  padding-left: 0;\n  list-style: none; }\n\n/* line 83, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_type.scss */\n.list-inline {\n  padding-left: 0;\n  list-style: none; }\n\n/* line 86, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_type.scss */\n.list-inline-item {\n  display: inline-block; }\n  /* line 89, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_type.scss */\n  .list-inline-item:not(:last-child) {\n    margin-right: 5px; }\n\n/* line 100, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_type.scss */\n.initialism {\n  font-size: 90%;\n  text-transform: uppercase; }\n\n/* line 106, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_type.scss */\n.blockquote {\n  padding: 0.5rem 1rem;\n  margin-bottom: 1rem;\n  font-size: 1.25rem;\n  border-left: 0.25rem solid #eceeef; }\n\n/* line 113, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_type.scss */\n.blockquote-footer {\n  display: block;\n  font-size: 80%;\n  color: #818a91; }\n  /* line 118, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_type.scss */\n  .blockquote-footer::before {\n    content: \"\\2014 \\00A0\"; }\n\n/* line 124, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_type.scss */\n.blockquote-reverse {\n  padding-right: 1rem;\n  padding-left: 0;\n  text-align: right;\n  border-right: 0.25rem solid #eceeef;\n  border-left: 0; }\n\n/* line 133, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_type.scss */\n.blockquote-reverse .blockquote-footer::before {\n  content: \"\"; }\n\n/* line 136, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_type.scss */\n.blockquote-reverse .blockquote-footer::after {\n  content: \"\\00A0 \\2014\"; }\n\n/* line 145, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_type.scss */\ndl.row > dd + dt {\n  clear: left; }\n\n/* line 8, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_images.scss */\n.img-fluid, .carousel-inner > .carousel-item > img,\n.carousel-inner > .carousel-item > a > img {\n  max-width: 100%;\n  height: auto; }\n\n/* line 14, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_images.scss */\n.img-thumbnail {\n  padding: 0.25rem;\n  background-color: #fff;\n  border: 1px solid #ddd;\n  border-radius: 0.25rem;\n  transition: all .2s ease-in-out;\n  max-width: 100%;\n  height: auto; }\n\n/* line 30, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_images.scss */\n.figure {\n  display: inline-block; }\n\n/* line 35, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_images.scss */\n.figure-img {\n  margin-bottom: 0.5rem;\n  line-height: 1; }\n\n/* line 40, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_images.scss */\n.figure-caption {\n  font-size: 90%;\n  color: #818a91; }\n\n/* line 2, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_code.scss */\ncode,\nkbd,\npre,\nsamp {\n  font-family: Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace; }\n\n/* line 10, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_code.scss */\ncode {\n  padding: 0.2rem 0.4rem;\n  font-size: 90%;\n  color: #bd4147;\n  background-color: #f7f7f9;\n  border-radius: 0.25rem; }\n\n/* line 19, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_code.scss */\nkbd {\n  padding: 0.2rem 0.4rem;\n  font-size: 90%;\n  color: #fff;\n  background-color: #333;\n  border-radius: 0.2rem; }\n  /* line 27, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_code.scss */\n  kbd kbd {\n    padding: 0;\n    font-size: 100%;\n    font-weight: bold; }\n\n/* line 36, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_code.scss */\npre {\n  display: block;\n  margin-top: 0;\n  margin-bottom: 1rem;\n  font-size: 90%;\n  color: #373a3c; }\n  /* line 44, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_code.scss */\n  pre code {\n    padding: 0;\n    font-size: inherit;\n    color: inherit;\n    background-color: transparent;\n    border-radius: 0; }\n\n/* line 54, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_code.scss */\n.pre-scrollable {\n  max-height: 340px;\n  overflow-y: scroll; }\n\n/* line 6, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_grid.scss */\n.container {\n  margin-left: auto;\n  margin-right: auto;\n  padding-left: 15px;\n  padding-right: 15px; }\n  /* line 2, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_clearfix.scss */\n  .container::after {\n    content: \"\";\n    display: table;\n    clear: both; }\n  @media (min-width: 576px) {\n    /* line 6, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_grid.scss */\n    .container {\n      width: 540px;\n      max-width: 100%; } }\n  @media (min-width: 768px) {\n    /* line 6, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_grid.scss */\n    .container {\n      width: 720px;\n      max-width: 100%; } }\n  @media (min-width: 992px) {\n    /* line 6, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_grid.scss */\n    .container {\n      width: 960px;\n      max-width: 100%; } }\n  @media (min-width: 1200px) {\n    /* line 6, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_grid.scss */\n    .container {\n      width: 1140px;\n      max-width: 100%; } }\n\n/* line 18, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_grid.scss */\n.container-fluid {\n  margin-left: auto;\n  margin-right: auto;\n  padding-left: 15px;\n  padding-right: 15px; }\n  /* line 2, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_clearfix.scss */\n  .container-fluid::after {\n    content: \"\";\n    display: table;\n    clear: both; }\n\n/* line 28, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_grid.scss */\n.row {\n  margin-right: -15px;\n  margin-left: -15px; }\n  /* line 2, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_clearfix.scss */\n  .row::after {\n    content: \"\";\n    display: table;\n    clear: both; }\n  @media (min-width: 576px) {\n    /* line 28, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_grid.scss */\n    .row {\n      margin-right: -15px;\n      margin-left: -15px; } }\n  @media (min-width: 768px) {\n    /* line 28, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_grid.scss */\n    .row {\n      margin-right: -15px;\n      margin-left: -15px; } }\n  @media (min-width: 992px) {\n    /* line 28, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_grid.scss */\n    .row {\n      margin-right: -15px;\n      margin-left: -15px; } }\n  @media (min-width: 1200px) {\n    /* line 28, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_grid.scss */\n    .row {\n      margin-right: -15px;\n      margin-left: -15px; } }\n\n/* line 8, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n.col-xs, .col-xs-1, .col-xs-2, .col-xs-3, .col-xs-4, .col-xs-5, .col-xs-6, .col-xs-7, .col-xs-8, .col-xs-9, .col-xs-10, .col-xs-11, .col-xs-12, .col-sm, .col-sm-1, .col-sm-2, .col-sm-3, .col-sm-4, .col-sm-5, .col-sm-6, .col-sm-7, .col-sm-8, .col-sm-9, .col-sm-10, .col-sm-11, .col-sm-12, .col-md, .col-md-1, .col-md-2, .col-md-3, .col-md-4, .col-md-5, .col-md-6, .col-md-7, .col-md-8, .col-md-9, .col-md-10, .col-md-11, .col-md-12, .col-lg, .col-lg-1, .col-lg-2, .col-lg-3, .col-lg-4, .col-lg-5, .col-lg-6, .col-lg-7, .col-lg-8, .col-lg-9, .col-lg-10, .col-lg-11, .col-lg-12, .col-xl, .col-xl-1, .col-xl-2, .col-xl-3, .col-xl-4, .col-xl-5, .col-xl-6, .col-xl-7, .col-xl-8, .col-xl-9, .col-xl-10, .col-xl-11, .col-xl-12 {\n  position: relative;\n  min-height: 1px;\n  padding-right: 15px;\n  padding-left: 15px; }\n  @media (min-width: 576px) {\n    /* line 8, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n    .col-xs, .col-xs-1, .col-xs-2, .col-xs-3, .col-xs-4, .col-xs-5, .col-xs-6, .col-xs-7, .col-xs-8, .col-xs-9, .col-xs-10, .col-xs-11, .col-xs-12, .col-sm, .col-sm-1, .col-sm-2, .col-sm-3, .col-sm-4, .col-sm-5, .col-sm-6, .col-sm-7, .col-sm-8, .col-sm-9, .col-sm-10, .col-sm-11, .col-sm-12, .col-md, .col-md-1, .col-md-2, .col-md-3, .col-md-4, .col-md-5, .col-md-6, .col-md-7, .col-md-8, .col-md-9, .col-md-10, .col-md-11, .col-md-12, .col-lg, .col-lg-1, .col-lg-2, .col-lg-3, .col-lg-4, .col-lg-5, .col-lg-6, .col-lg-7, .col-lg-8, .col-lg-9, .col-lg-10, .col-lg-11, .col-lg-12, .col-xl, .col-xl-1, .col-xl-2, .col-xl-3, .col-xl-4, .col-xl-5, .col-xl-6, .col-xl-7, .col-xl-8, .col-xl-9, .col-xl-10, .col-xl-11, .col-xl-12 {\n      padding-right: 15px;\n      padding-left: 15px; } }\n  @media (min-width: 768px) {\n    /* line 8, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n    .col-xs, .col-xs-1, .col-xs-2, .col-xs-3, .col-xs-4, .col-xs-5, .col-xs-6, .col-xs-7, .col-xs-8, .col-xs-9, .col-xs-10, .col-xs-11, .col-xs-12, .col-sm, .col-sm-1, .col-sm-2, .col-sm-3, .col-sm-4, .col-sm-5, .col-sm-6, .col-sm-7, .col-sm-8, .col-sm-9, .col-sm-10, .col-sm-11, .col-sm-12, .col-md, .col-md-1, .col-md-2, .col-md-3, .col-md-4, .col-md-5, .col-md-6, .col-md-7, .col-md-8, .col-md-9, .col-md-10, .col-md-11, .col-md-12, .col-lg, .col-lg-1, .col-lg-2, .col-lg-3, .col-lg-4, .col-lg-5, .col-lg-6, .col-lg-7, .col-lg-8, .col-lg-9, .col-lg-10, .col-lg-11, .col-lg-12, .col-xl, .col-xl-1, .col-xl-2, .col-xl-3, .col-xl-4, .col-xl-5, .col-xl-6, .col-xl-7, .col-xl-8, .col-xl-9, .col-xl-10, .col-xl-11, .col-xl-12 {\n      padding-right: 15px;\n      padding-left: 15px; } }\n  @media (min-width: 992px) {\n    /* line 8, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n    .col-xs, .col-xs-1, .col-xs-2, .col-xs-3, .col-xs-4, .col-xs-5, .col-xs-6, .col-xs-7, .col-xs-8, .col-xs-9, .col-xs-10, .col-xs-11, .col-xs-12, .col-sm, .col-sm-1, .col-sm-2, .col-sm-3, .col-sm-4, .col-sm-5, .col-sm-6, .col-sm-7, .col-sm-8, .col-sm-9, .col-sm-10, .col-sm-11, .col-sm-12, .col-md, .col-md-1, .col-md-2, .col-md-3, .col-md-4, .col-md-5, .col-md-6, .col-md-7, .col-md-8, .col-md-9, .col-md-10, .col-md-11, .col-md-12, .col-lg, .col-lg-1, .col-lg-2, .col-lg-3, .col-lg-4, .col-lg-5, .col-lg-6, .col-lg-7, .col-lg-8, .col-lg-9, .col-lg-10, .col-lg-11, .col-lg-12, .col-xl, .col-xl-1, .col-xl-2, .col-xl-3, .col-xl-4, .col-xl-5, .col-xl-6, .col-xl-7, .col-xl-8, .col-xl-9, .col-xl-10, .col-xl-11, .col-xl-12 {\n      padding-right: 15px;\n      padding-left: 15px; } }\n  @media (min-width: 1200px) {\n    /* line 8, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n    .col-xs, .col-xs-1, .col-xs-2, .col-xs-3, .col-xs-4, .col-xs-5, .col-xs-6, .col-xs-7, .col-xs-8, .col-xs-9, .col-xs-10, .col-xs-11, .col-xs-12, .col-sm, .col-sm-1, .col-sm-2, .col-sm-3, .col-sm-4, .col-sm-5, .col-sm-6, .col-sm-7, .col-sm-8, .col-sm-9, .col-sm-10, .col-sm-11, .col-sm-12, .col-md, .col-md-1, .col-md-2, .col-md-3, .col-md-4, .col-md-5, .col-md-6, .col-md-7, .col-md-8, .col-md-9, .col-md-10, .col-md-11, .col-md-12, .col-lg, .col-lg-1, .col-lg-2, .col-lg-3, .col-lg-4, .col-lg-5, .col-lg-6, .col-lg-7, .col-lg-8, .col-lg-9, .col-lg-10, .col-lg-11, .col-lg-12, .col-xl, .col-xl-1, .col-xl-2, .col-xl-3, .col-xl-4, .col-xl-5, .col-xl-6, .col-xl-7, .col-xl-8, .col-xl-9, .col-xl-10, .col-xl-11, .col-xl-12 {\n      padding-right: 15px;\n      padding-left: 15px; } }\n\n/* line 46, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n.col-xs-1 {\n  float: left;\n  width: 8.33333%; }\n\n/* line 46, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n.col-xs-2 {\n  float: left;\n  width: 16.66667%; }\n\n/* line 46, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n.col-xs-3 {\n  float: left;\n  width: 25%; }\n\n/* line 46, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n.col-xs-4 {\n  float: left;\n  width: 33.33333%; }\n\n/* line 46, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n.col-xs-5 {\n  float: left;\n  width: 41.66667%; }\n\n/* line 46, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n.col-xs-6 {\n  float: left;\n  width: 50%; }\n\n/* line 46, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n.col-xs-7 {\n  float: left;\n  width: 58.33333%; }\n\n/* line 46, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n.col-xs-8 {\n  float: left;\n  width: 66.66667%; }\n\n/* line 46, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n.col-xs-9 {\n  float: left;\n  width: 75%; }\n\n/* line 46, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n.col-xs-10 {\n  float: left;\n  width: 83.33333%; }\n\n/* line 46, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n.col-xs-11 {\n  float: left;\n  width: 91.66667%; }\n\n/* line 46, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n.col-xs-12 {\n  float: left;\n  width: 100%; }\n\n/* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n.pull-xs-0 {\n  right: auto; }\n\n/* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n.pull-xs-1 {\n  right: 8.33333%; }\n\n/* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n.pull-xs-2 {\n  right: 16.66667%; }\n\n/* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n.pull-xs-3 {\n  right: 25%; }\n\n/* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n.pull-xs-4 {\n  right: 33.33333%; }\n\n/* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n.pull-xs-5 {\n  right: 41.66667%; }\n\n/* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n.pull-xs-6 {\n  right: 50%; }\n\n/* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n.pull-xs-7 {\n  right: 58.33333%; }\n\n/* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n.pull-xs-8 {\n  right: 66.66667%; }\n\n/* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n.pull-xs-9 {\n  right: 75%; }\n\n/* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n.pull-xs-10 {\n  right: 83.33333%; }\n\n/* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n.pull-xs-11 {\n  right: 91.66667%; }\n\n/* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n.pull-xs-12 {\n  right: 100%; }\n\n/* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n.push-xs-0 {\n  left: auto; }\n\n/* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n.push-xs-1 {\n  left: 8.33333%; }\n\n/* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n.push-xs-2 {\n  left: 16.66667%; }\n\n/* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n.push-xs-3 {\n  left: 25%; }\n\n/* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n.push-xs-4 {\n  left: 33.33333%; }\n\n/* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n.push-xs-5 {\n  left: 41.66667%; }\n\n/* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n.push-xs-6 {\n  left: 50%; }\n\n/* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n.push-xs-7 {\n  left: 58.33333%; }\n\n/* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n.push-xs-8 {\n  left: 66.66667%; }\n\n/* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n.push-xs-9 {\n  left: 75%; }\n\n/* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n.push-xs-10 {\n  left: 83.33333%; }\n\n/* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n.push-xs-11 {\n  left: 91.66667%; }\n\n/* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n.push-xs-12 {\n  left: 100%; }\n\n/* line 62, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n.offset-xs-1 {\n  margin-left: 8.33333%; }\n\n/* line 62, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n.offset-xs-2 {\n  margin-left: 16.66667%; }\n\n/* line 62, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n.offset-xs-3 {\n  margin-left: 25%; }\n\n/* line 62, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n.offset-xs-4 {\n  margin-left: 33.33333%; }\n\n/* line 62, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n.offset-xs-5 {\n  margin-left: 41.66667%; }\n\n/* line 62, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n.offset-xs-6 {\n  margin-left: 50%; }\n\n/* line 62, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n.offset-xs-7 {\n  margin-left: 58.33333%; }\n\n/* line 62, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n.offset-xs-8 {\n  margin-left: 66.66667%; }\n\n/* line 62, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n.offset-xs-9 {\n  margin-left: 75%; }\n\n/* line 62, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n.offset-xs-10 {\n  margin-left: 83.33333%; }\n\n/* line 62, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n.offset-xs-11 {\n  margin-left: 91.66667%; }\n\n@media (min-width: 576px) {\n  /* line 46, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .col-sm-1 {\n    float: left;\n    width: 8.33333%; }\n  /* line 46, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .col-sm-2 {\n    float: left;\n    width: 16.66667%; }\n  /* line 46, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .col-sm-3 {\n    float: left;\n    width: 25%; }\n  /* line 46, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .col-sm-4 {\n    float: left;\n    width: 33.33333%; }\n  /* line 46, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .col-sm-5 {\n    float: left;\n    width: 41.66667%; }\n  /* line 46, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .col-sm-6 {\n    float: left;\n    width: 50%; }\n  /* line 46, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .col-sm-7 {\n    float: left;\n    width: 58.33333%; }\n  /* line 46, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .col-sm-8 {\n    float: left;\n    width: 66.66667%; }\n  /* line 46, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .col-sm-9 {\n    float: left;\n    width: 75%; }\n  /* line 46, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .col-sm-10 {\n    float: left;\n    width: 83.33333%; }\n  /* line 46, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .col-sm-11 {\n    float: left;\n    width: 91.66667%; }\n  /* line 46, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .col-sm-12 {\n    float: left;\n    width: 100%; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .pull-sm-0 {\n    right: auto; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .pull-sm-1 {\n    right: 8.33333%; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .pull-sm-2 {\n    right: 16.66667%; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .pull-sm-3 {\n    right: 25%; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .pull-sm-4 {\n    right: 33.33333%; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .pull-sm-5 {\n    right: 41.66667%; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .pull-sm-6 {\n    right: 50%; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .pull-sm-7 {\n    right: 58.33333%; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .pull-sm-8 {\n    right: 66.66667%; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .pull-sm-9 {\n    right: 75%; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .pull-sm-10 {\n    right: 83.33333%; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .pull-sm-11 {\n    right: 91.66667%; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .pull-sm-12 {\n    right: 100%; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .push-sm-0 {\n    left: auto; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .push-sm-1 {\n    left: 8.33333%; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .push-sm-2 {\n    left: 16.66667%; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .push-sm-3 {\n    left: 25%; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .push-sm-4 {\n    left: 33.33333%; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .push-sm-5 {\n    left: 41.66667%; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .push-sm-6 {\n    left: 50%; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .push-sm-7 {\n    left: 58.33333%; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .push-sm-8 {\n    left: 66.66667%; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .push-sm-9 {\n    left: 75%; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .push-sm-10 {\n    left: 83.33333%; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .push-sm-11 {\n    left: 91.66667%; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .push-sm-12 {\n    left: 100%; }\n  /* line 62, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .offset-sm-0 {\n    margin-left: 0%; }\n  /* line 62, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .offset-sm-1 {\n    margin-left: 8.33333%; }\n  /* line 62, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .offset-sm-2 {\n    margin-left: 16.66667%; }\n  /* line 62, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .offset-sm-3 {\n    margin-left: 25%; }\n  /* line 62, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .offset-sm-4 {\n    margin-left: 33.33333%; }\n  /* line 62, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .offset-sm-5 {\n    margin-left: 41.66667%; }\n  /* line 62, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .offset-sm-6 {\n    margin-left: 50%; }\n  /* line 62, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .offset-sm-7 {\n    margin-left: 58.33333%; }\n  /* line 62, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .offset-sm-8 {\n    margin-left: 66.66667%; }\n  /* line 62, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .offset-sm-9 {\n    margin-left: 75%; }\n  /* line 62, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .offset-sm-10 {\n    margin-left: 83.33333%; }\n  /* line 62, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .offset-sm-11 {\n    margin-left: 91.66667%; } }\n\n@media (min-width: 768px) {\n  /* line 46, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .col-md-1 {\n    float: left;\n    width: 8.33333%; }\n  /* line 46, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .col-md-2 {\n    float: left;\n    width: 16.66667%; }\n  /* line 46, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .col-md-3 {\n    float: left;\n    width: 25%; }\n  /* line 46, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .col-md-4 {\n    float: left;\n    width: 33.33333%; }\n  /* line 46, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .col-md-5 {\n    float: left;\n    width: 41.66667%; }\n  /* line 46, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .col-md-6 {\n    float: left;\n    width: 50%; }\n  /* line 46, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .col-md-7 {\n    float: left;\n    width: 58.33333%; }\n  /* line 46, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .col-md-8 {\n    float: left;\n    width: 66.66667%; }\n  /* line 46, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .col-md-9 {\n    float: left;\n    width: 75%; }\n  /* line 46, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .col-md-10 {\n    float: left;\n    width: 83.33333%; }\n  /* line 46, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .col-md-11 {\n    float: left;\n    width: 91.66667%; }\n  /* line 46, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .col-md-12 {\n    float: left;\n    width: 100%; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .pull-md-0 {\n    right: auto; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .pull-md-1 {\n    right: 8.33333%; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .pull-md-2 {\n    right: 16.66667%; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .pull-md-3 {\n    right: 25%; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .pull-md-4 {\n    right: 33.33333%; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .pull-md-5 {\n    right: 41.66667%; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .pull-md-6 {\n    right: 50%; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .pull-md-7 {\n    right: 58.33333%; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .pull-md-8 {\n    right: 66.66667%; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .pull-md-9 {\n    right: 75%; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .pull-md-10 {\n    right: 83.33333%; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .pull-md-11 {\n    right: 91.66667%; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .pull-md-12 {\n    right: 100%; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .push-md-0 {\n    left: auto; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .push-md-1 {\n    left: 8.33333%; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .push-md-2 {\n    left: 16.66667%; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .push-md-3 {\n    left: 25%; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .push-md-4 {\n    left: 33.33333%; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .push-md-5 {\n    left: 41.66667%; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .push-md-6 {\n    left: 50%; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .push-md-7 {\n    left: 58.33333%; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .push-md-8 {\n    left: 66.66667%; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .push-md-9 {\n    left: 75%; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .push-md-10 {\n    left: 83.33333%; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .push-md-11 {\n    left: 91.66667%; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .push-md-12 {\n    left: 100%; }\n  /* line 62, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .offset-md-0 {\n    margin-left: 0%; }\n  /* line 62, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .offset-md-1 {\n    margin-left: 8.33333%; }\n  /* line 62, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .offset-md-2 {\n    margin-left: 16.66667%; }\n  /* line 62, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .offset-md-3 {\n    margin-left: 25%; }\n  /* line 62, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .offset-md-4 {\n    margin-left: 33.33333%; }\n  /* line 62, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .offset-md-5 {\n    margin-left: 41.66667%; }\n  /* line 62, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .offset-md-6 {\n    margin-left: 50%; }\n  /* line 62, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .offset-md-7 {\n    margin-left: 58.33333%; }\n  /* line 62, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .offset-md-8 {\n    margin-left: 66.66667%; }\n  /* line 62, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .offset-md-9 {\n    margin-left: 75%; }\n  /* line 62, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .offset-md-10 {\n    margin-left: 83.33333%; }\n  /* line 62, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .offset-md-11 {\n    margin-left: 91.66667%; } }\n\n@media (min-width: 992px) {\n  /* line 46, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .col-lg-1 {\n    float: left;\n    width: 8.33333%; }\n  /* line 46, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .col-lg-2 {\n    float: left;\n    width: 16.66667%; }\n  /* line 46, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .col-lg-3 {\n    float: left;\n    width: 25%; }\n  /* line 46, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .col-lg-4 {\n    float: left;\n    width: 33.33333%; }\n  /* line 46, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .col-lg-5 {\n    float: left;\n    width: 41.66667%; }\n  /* line 46, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .col-lg-6 {\n    float: left;\n    width: 50%; }\n  /* line 46, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .col-lg-7 {\n    float: left;\n    width: 58.33333%; }\n  /* line 46, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .col-lg-8 {\n    float: left;\n    width: 66.66667%; }\n  /* line 46, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .col-lg-9 {\n    float: left;\n    width: 75%; }\n  /* line 46, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .col-lg-10 {\n    float: left;\n    width: 83.33333%; }\n  /* line 46, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .col-lg-11 {\n    float: left;\n    width: 91.66667%; }\n  /* line 46, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .col-lg-12 {\n    float: left;\n    width: 100%; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .pull-lg-0 {\n    right: auto; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .pull-lg-1 {\n    right: 8.33333%; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .pull-lg-2 {\n    right: 16.66667%; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .pull-lg-3 {\n    right: 25%; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .pull-lg-4 {\n    right: 33.33333%; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .pull-lg-5 {\n    right: 41.66667%; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .pull-lg-6 {\n    right: 50%; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .pull-lg-7 {\n    right: 58.33333%; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .pull-lg-8 {\n    right: 66.66667%; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .pull-lg-9 {\n    right: 75%; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .pull-lg-10 {\n    right: 83.33333%; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .pull-lg-11 {\n    right: 91.66667%; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .pull-lg-12 {\n    right: 100%; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .push-lg-0 {\n    left: auto; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .push-lg-1 {\n    left: 8.33333%; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .push-lg-2 {\n    left: 16.66667%; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .push-lg-3 {\n    left: 25%; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .push-lg-4 {\n    left: 33.33333%; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .push-lg-5 {\n    left: 41.66667%; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .push-lg-6 {\n    left: 50%; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .push-lg-7 {\n    left: 58.33333%; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .push-lg-8 {\n    left: 66.66667%; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .push-lg-9 {\n    left: 75%; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .push-lg-10 {\n    left: 83.33333%; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .push-lg-11 {\n    left: 91.66667%; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .push-lg-12 {\n    left: 100%; }\n  /* line 62, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .offset-lg-0 {\n    margin-left: 0%; }\n  /* line 62, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .offset-lg-1 {\n    margin-left: 8.33333%; }\n  /* line 62, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .offset-lg-2 {\n    margin-left: 16.66667%; }\n  /* line 62, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .offset-lg-3 {\n    margin-left: 25%; }\n  /* line 62, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .offset-lg-4 {\n    margin-left: 33.33333%; }\n  /* line 62, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .offset-lg-5 {\n    margin-left: 41.66667%; }\n  /* line 62, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .offset-lg-6 {\n    margin-left: 50%; }\n  /* line 62, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .offset-lg-7 {\n    margin-left: 58.33333%; }\n  /* line 62, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .offset-lg-8 {\n    margin-left: 66.66667%; }\n  /* line 62, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .offset-lg-9 {\n    margin-left: 75%; }\n  /* line 62, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .offset-lg-10 {\n    margin-left: 83.33333%; }\n  /* line 62, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .offset-lg-11 {\n    margin-left: 91.66667%; } }\n\n@media (min-width: 1200px) {\n  /* line 46, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .col-xl-1 {\n    float: left;\n    width: 8.33333%; }\n  /* line 46, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .col-xl-2 {\n    float: left;\n    width: 16.66667%; }\n  /* line 46, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .col-xl-3 {\n    float: left;\n    width: 25%; }\n  /* line 46, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .col-xl-4 {\n    float: left;\n    width: 33.33333%; }\n  /* line 46, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .col-xl-5 {\n    float: left;\n    width: 41.66667%; }\n  /* line 46, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .col-xl-6 {\n    float: left;\n    width: 50%; }\n  /* line 46, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .col-xl-7 {\n    float: left;\n    width: 58.33333%; }\n  /* line 46, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .col-xl-8 {\n    float: left;\n    width: 66.66667%; }\n  /* line 46, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .col-xl-9 {\n    float: left;\n    width: 75%; }\n  /* line 46, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .col-xl-10 {\n    float: left;\n    width: 83.33333%; }\n  /* line 46, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .col-xl-11 {\n    float: left;\n    width: 91.66667%; }\n  /* line 46, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .col-xl-12 {\n    float: left;\n    width: 100%; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .pull-xl-0 {\n    right: auto; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .pull-xl-1 {\n    right: 8.33333%; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .pull-xl-2 {\n    right: 16.66667%; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .pull-xl-3 {\n    right: 25%; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .pull-xl-4 {\n    right: 33.33333%; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .pull-xl-5 {\n    right: 41.66667%; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .pull-xl-6 {\n    right: 50%; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .pull-xl-7 {\n    right: 58.33333%; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .pull-xl-8 {\n    right: 66.66667%; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .pull-xl-9 {\n    right: 75%; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .pull-xl-10 {\n    right: 83.33333%; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .pull-xl-11 {\n    right: 91.66667%; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .pull-xl-12 {\n    right: 100%; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .push-xl-0 {\n    left: auto; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .push-xl-1 {\n    left: 8.33333%; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .push-xl-2 {\n    left: 16.66667%; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .push-xl-3 {\n    left: 25%; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .push-xl-4 {\n    left: 33.33333%; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .push-xl-5 {\n    left: 41.66667%; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .push-xl-6 {\n    left: 50%; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .push-xl-7 {\n    left: 58.33333%; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .push-xl-8 {\n    left: 66.66667%; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .push-xl-9 {\n    left: 75%; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .push-xl-10 {\n    left: 83.33333%; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .push-xl-11 {\n    left: 91.66667%; }\n  /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .push-xl-12 {\n    left: 100%; }\n  /* line 62, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .offset-xl-0 {\n    margin-left: 0%; }\n  /* line 62, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .offset-xl-1 {\n    margin-left: 8.33333%; }\n  /* line 62, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .offset-xl-2 {\n    margin-left: 16.66667%; }\n  /* line 62, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .offset-xl-3 {\n    margin-left: 25%; }\n  /* line 62, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .offset-xl-4 {\n    margin-left: 33.33333%; }\n  /* line 62, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .offset-xl-5 {\n    margin-left: 41.66667%; }\n  /* line 62, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .offset-xl-6 {\n    margin-left: 50%; }\n  /* line 62, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .offset-xl-7 {\n    margin-left: 58.33333%; }\n  /* line 62, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .offset-xl-8 {\n    margin-left: 66.66667%; }\n  /* line 62, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .offset-xl-9 {\n    margin-left: 75%; }\n  /* line 62, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .offset-xl-10 {\n    margin-left: 83.33333%; }\n  /* line 62, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_grid-framework.scss */\n  .offset-xl-11 {\n    margin-left: 91.66667%; } }\n\n/* line 5, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_tables.scss */\n.table {\n  width: 100%;\n  max-width: 100%;\n  margin-bottom: 1rem; }\n  /* line 10, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_tables.scss */\n  .table th,\n  .table td {\n    padding: 0.75rem;\n    vertical-align: top;\n    border-top: 1px solid #eceeef; }\n  /* line 17, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_tables.scss */\n  .table thead th {\n    vertical-align: bottom;\n    border-bottom: 2px solid #eceeef; }\n  /* line 22, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_tables.scss */\n  .table tbody + tbody {\n    border-top: 2px solid #eceeef; }\n  /* line 26, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_tables.scss */\n  .table .table {\n    background-color: #fff; }\n\n/* line 37, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_tables.scss */\n.table-sm th,\n.table-sm td {\n  padding: 0.3rem; }\n\n/* line 48, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_tables.scss */\n.table-bordered {\n  border: 1px solid #eceeef; }\n  /* line 51, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_tables.scss */\n  .table-bordered th,\n  .table-bordered td {\n    border: 1px solid #eceeef; }\n  /* line 57, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_tables.scss */\n  .table-bordered thead th,\n  .table-bordered thead td {\n    border-bottom-width: 2px; }\n\n/* line 70, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_tables.scss */\n.table-striped tbody tr:nth-of-type(odd) {\n  background-color: rgba(0, 0, 0, 0.05); }\n\n/* line 11, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_hover.scss */\n.table-hover tbody tr:hover {\n  background-color: rgba(0, 0, 0, 0.075); }\n\n/* line 7, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_table-row.scss */\n.table-active,\n.table-active > th,\n.table-active > td {\n  background-color: rgba(0, 0, 0, 0.075); }\n\n/* line 11, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_hover.scss */\n.table-hover .table-active:hover {\n  background-color: rgba(0, 0, 0, 0.075); }\n  /* line 23, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_table-row.scss */\n  .table-hover .table-active:hover > td,\n  .table-hover .table-active:hover > th {\n    background-color: rgba(0, 0, 0, 0.075); }\n\n/* line 7, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_table-row.scss */\n.table-success,\n.table-success > th,\n.table-success > td {\n  background-color: #dff0d8; }\n\n/* line 11, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_hover.scss */\n.table-hover .table-success:hover {\n  background-color: #d0e9c6; }\n  /* line 23, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_table-row.scss */\n  .table-hover .table-success:hover > td,\n  .table-hover .table-success:hover > th {\n    background-color: #d0e9c6; }\n\n/* line 7, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_table-row.scss */\n.table-info,\n.table-info > th,\n.table-info > td {\n  background-color: #d9edf7; }\n\n/* line 11, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_hover.scss */\n.table-hover .table-info:hover {\n  background-color: #c4e3f3; }\n  /* line 23, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_table-row.scss */\n  .table-hover .table-info:hover > td,\n  .table-hover .table-info:hover > th {\n    background-color: #c4e3f3; }\n\n/* line 7, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_table-row.scss */\n.table-warning,\n.table-warning > th,\n.table-warning > td {\n  background-color: #fcf8e3; }\n\n/* line 11, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_hover.scss */\n.table-hover .table-warning:hover {\n  background-color: #faf2cc; }\n  /* line 23, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_table-row.scss */\n  .table-hover .table-warning:hover > td,\n  .table-hover .table-warning:hover > th {\n    background-color: #faf2cc; }\n\n/* line 7, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_table-row.scss */\n.table-danger,\n.table-danger > th,\n.table-danger > td {\n  background-color: #f2dede; }\n\n/* line 11, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_hover.scss */\n.table-hover .table-danger:hover {\n  background-color: #ebcccc; }\n  /* line 23, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_table-row.scss */\n  .table-hover .table-danger:hover > td,\n  .table-hover .table-danger:hover > th {\n    background-color: #ebcccc; }\n\n/* line 107, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_tables.scss */\n.thead-inverse th {\n  color: #fff;\n  background-color: #373a3c; }\n\n/* line 114, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_tables.scss */\n.thead-default th {\n  color: #55595c;\n  background-color: #eceeef; }\n\n/* line 120, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_tables.scss */\n.table-inverse {\n  color: #eceeef;\n  background-color: #373a3c; }\n  /* line 124, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_tables.scss */\n  .table-inverse th,\n  .table-inverse td,\n  .table-inverse thead th {\n    border-color: #55595c; }\n  /* line 130, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_tables.scss */\n  .table-inverse.table-bordered {\n    border: 0; }\n\n/* line 143, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_tables.scss */\n.table-responsive {\n  display: block;\n  width: 100%;\n  min-height: 0%;\n  overflow-x: auto; }\n\n/* line 157, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_tables.scss */\n.table-reflow thead {\n  float: left; }\n\n/* line 161, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_tables.scss */\n.table-reflow tbody {\n  display: block;\n  white-space: nowrap; }\n\n/* line 166, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_tables.scss */\n.table-reflow th,\n.table-reflow td {\n  border-top: 1px solid #eceeef;\n  border-left: 1px solid #eceeef; }\n  /* line 171, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_tables.scss */\n  .table-reflow th:last-child,\n  .table-reflow td:last-child {\n    border-right: 1px solid #eceeef; }\n\n/* line 180, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_tables.scss */\n.table-reflow thead:last-child tr:last-child th,\n.table-reflow thead:last-child tr:last-child td,\n.table-reflow tbody:last-child tr:last-child th,\n.table-reflow tbody:last-child tr:last-child td,\n.table-reflow tfoot:last-child tr:last-child th,\n.table-reflow tfoot:last-child tr:last-child td {\n  border-bottom: 1px solid #eceeef; }\n\n/* line 187, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_tables.scss */\n.table-reflow tr {\n  float: left; }\n  /* line 190, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_tables.scss */\n  .table-reflow tr th,\n  .table-reflow tr td {\n    display: block !important;\n    border: 1px solid #eceeef; }\n\n/* line 7, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_forms.scss */\n.form-control {\n  display: block;\n  width: 100%;\n  padding: 0.5rem 0.75rem;\n  font-size: 1rem;\n  line-height: 1.25;\n  color: #55595c;\n  background-color: #fff;\n  background-image: none;\n  background-clip: padding-box;\n  border: 1px solid rgba(0, 0, 0, 0.15);\n  border-radius: 0.25rem; }\n  /* line 35, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_forms.scss */\n  .form-control::-ms-expand {\n    background-color: transparent;\n    border: 0; }\n  /* line 48, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_forms.scss */\n  .form-control:focus {\n    color: #55595c;\n    background-color: #fff;\n    border-color: #66afe9;\n    outline: none; }\n  /* line 44, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_forms.scss */\n  .form-control::placeholder {\n    color: #999;\n    opacity: 1; }\n  /* line 55, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_forms.scss */\n  .form-control:disabled, .form-control[readonly] {\n    background-color: #eceeef;\n    opacity: 1; }\n  /* line 62, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_forms.scss */\n  .form-control:disabled {\n    cursor: not-allowed; }\n\n/* line 68, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_forms.scss */\nselect.form-control:not([size]):not([multiple]) {\n  height: calc(2.5rem - 2px); }\n\n/* line 73, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_forms.scss */\nselect.form-control:focus::-ms-value {\n  color: #55595c;\n  background-color: #fff; }\n\n/* line 85, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_forms.scss */\n.form-control-file,\n.form-control-range {\n  display: block; }\n\n/* line 97, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_forms.scss */\n.col-form-label {\n  padding-top: 0.5rem;\n  padding-bottom: 0.5rem;\n  margin-bottom: 0; }\n\n/* line 103, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_forms.scss */\n.col-form-label-lg {\n  padding-top: 0.75rem;\n  padding-bottom: 0.75rem;\n  font-size: 1.25rem; }\n\n/* line 109, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_forms.scss */\n.col-form-label-sm {\n  padding-top: 0.25rem;\n  padding-bottom: 0.25rem;\n  font-size: 0.875rem; }\n\n/* line 122, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_forms.scss */\n.col-form-legend {\n  padding-top: 0.5rem;\n  padding-bottom: 0.5rem;\n  margin-bottom: 0;\n  font-size: 1rem; }\n\n/* line 135, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_forms.scss */\n.form-control-static {\n  padding-top: 0.5rem;\n  padding-bottom: 0.5rem;\n  line-height: 1.25;\n  border: solid transparent;\n  border-width: 1px 0; }\n  /* line 142, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_forms.scss */\n  .form-control-static.form-control-sm, .input-group-sm > .form-control-static.form-control,\n  .input-group-sm > .form-control-static.input-group-addon,\n  .input-group-sm > .input-group-btn > .form-control-static.btn, .form-control-static.form-control-lg, .input-group-lg > .form-control-static.form-control,\n  .input-group-lg > .form-control-static.input-group-addon,\n  .input-group-lg > .input-group-btn > .form-control-static.btn {\n    padding-right: 0;\n    padding-left: 0; }\n\n/* line 158, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_forms.scss */\n.form-control-sm, .input-group-sm > .form-control,\n.input-group-sm > .input-group-addon,\n.input-group-sm > .input-group-btn > .btn {\n  padding: 0.25rem 0.5rem;\n  font-size: 0.875rem;\n  border-radius: 0.2rem; }\n\n/* line 165, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_forms.scss */\nselect.form-control-sm:not([size]):not([multiple]), .input-group-sm > select.form-control:not([size]):not([multiple]),\n.input-group-sm > select.input-group-addon:not([size]):not([multiple]),\n.input-group-sm > .input-group-btn > select.btn:not([size]):not([multiple]) {\n  height: 1.8125rem; }\n\n/* line 170, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_forms.scss */\n.form-control-lg, .input-group-lg > .form-control,\n.input-group-lg > .input-group-addon,\n.input-group-lg > .input-group-btn > .btn {\n  padding: 0.75rem 1.5rem;\n  font-size: 1.25rem;\n  border-radius: 0.3rem; }\n\n/* line 177, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_forms.scss */\nselect.form-control-lg:not([size]):not([multiple]), .input-group-lg > select.form-control:not([size]):not([multiple]),\n.input-group-lg > select.input-group-addon:not([size]):not([multiple]),\n.input-group-lg > .input-group-btn > select.btn:not([size]):not([multiple]) {\n  height: 3.16667rem; }\n\n/* line 188, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_forms.scss */\n.form-group {\n  margin-bottom: 1rem; }\n\n/* line 192, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_forms.scss */\n.form-text {\n  display: block;\n  margin-top: 0.25rem; }\n\n/* line 202, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_forms.scss */\n.form-check {\n  position: relative;\n  display: block;\n  margin-bottom: 0.75rem; }\n  /* line 208, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_forms.scss */\n  .form-check + .form-check {\n    margin-top: -.25rem; }\n  /* line 213, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_forms.scss */\n  .form-check.disabled .form-check-label {\n    color: #818a91;\n    cursor: not-allowed; }\n\n/* line 220, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_forms.scss */\n.form-check-label {\n  padding-left: 1.25rem;\n  margin-bottom: 0;\n  cursor: pointer; }\n\n/* line 226, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_forms.scss */\n.form-check-input {\n  position: absolute;\n  margin-top: .25rem;\n  margin-left: -1.25rem; }\n  /* line 231, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_forms.scss */\n  .form-check-input:only-child {\n    position: static; }\n\n/* line 237, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_forms.scss */\n.form-check-inline {\n  position: relative;\n  display: inline-block;\n  padding-left: 1.25rem;\n  margin-bottom: 0;\n  vertical-align: middle;\n  cursor: pointer; }\n  /* line 245, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_forms.scss */\n  .form-check-inline + .form-check-inline {\n    margin-left: .75rem; }\n  /* line 249, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_forms.scss */\n  .form-check-inline.disabled {\n    color: #818a91;\n    cursor: not-allowed; }\n\n/* line 260, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_forms.scss */\n.form-control-feedback {\n  margin-top: 0.25rem; }\n\n/* line 264, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_forms.scss */\n.form-control-success,\n.form-control-warning,\n.form-control-danger {\n  padding-right: 2.25rem;\n  background-repeat: no-repeat;\n  background-position: center right 0.625rem;\n  background-size: 1.25rem 1.25rem; }\n\n/* line 8, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_forms.scss */\n.has-success .form-control-feedback,\n.has-success .form-control-label,\n.has-success .form-check-label,\n.has-success .form-check-inline,\n.has-success .custom-control {\n  color: #5cb85c; }\n\n/* line 17, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_forms.scss */\n.has-success .form-control {\n  border-color: #5cb85c; }\n  /* line 21, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_forms.scss */\n  .has-success .form-control:focus {\n    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 6px #a3d7a3; }\n\n/* line 28, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_forms.scss */\n.has-success .input-group-addon {\n  color: #5cb85c;\n  border-color: #5cb85c;\n  background-color: #eaf6ea; }\n\n/* line 277, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_forms.scss */\n.has-success .form-control-success {\n  background-image: url(\"data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Cpath fill='#5cb85c' d='M2.3 6.73L.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z'/%3E%3C/svg%3E\"); }\n\n/* line 8, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_forms.scss */\n.has-warning .form-control-feedback,\n.has-warning .form-control-label,\n.has-warning .form-check-label,\n.has-warning .form-check-inline,\n.has-warning .custom-control {\n  color: #f0ad4e; }\n\n/* line 17, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_forms.scss */\n.has-warning .form-control {\n  border-color: #f0ad4e; }\n  /* line 21, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_forms.scss */\n  .has-warning .form-control:focus {\n    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 6px #f8d9ac; }\n\n/* line 28, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_forms.scss */\n.has-warning .input-group-addon {\n  color: #f0ad4e;\n  border-color: #f0ad4e;\n  background-color: white; }\n\n/* line 285, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_forms.scss */\n.has-warning .form-control-warning {\n  background-image: url(\"data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Cpath fill='#f0ad4e' d='M4.4 5.324h-.8v-2.46h.8zm0 1.42h-.8V5.89h.8zM3.76.63L.04 7.075c-.115.2.016.425.26.426h7.397c.242 0 .372-.226.258-.426C6.726 4.924 5.47 2.79 4.253.63c-.113-.174-.39-.174-.494 0z'/%3E%3C/svg%3E\"); }\n\n/* line 8, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_forms.scss */\n.has-danger .form-control-feedback,\n.has-danger .form-control-label,\n.has-danger .form-check-label,\n.has-danger .form-check-inline,\n.has-danger .custom-control {\n  color: #d9534f; }\n\n/* line 17, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_forms.scss */\n.has-danger .form-control {\n  border-color: #d9534f; }\n  /* line 21, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_forms.scss */\n  .has-danger .form-control:focus {\n    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 6px #eba5a3; }\n\n/* line 28, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_forms.scss */\n.has-danger .input-group-addon {\n  color: #d9534f;\n  border-color: #d9534f;\n  background-color: #fdf7f7; }\n\n/* line 293, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_forms.scss */\n.has-danger .form-control-danger {\n  background-image: url(\"data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='#d9534f' viewBox='-2 -2 7 7'%3E%3Cpath stroke='%23d9534f' d='M0 0l3 3m0-3L0 3'/%3E%3Ccircle r='.5'/%3E%3Ccircle cx='3' r='.5'/%3E%3Ccircle cy='3' r='.5'/%3E%3Ccircle cx='3' cy='3' r='.5'/%3E%3C/svg%3E\"); }\n\n@media (min-width: 576px) {\n  /* line 313, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_forms.scss */\n  .form-inline .form-group {\n    display: inline-block;\n    margin-bottom: 0;\n    vertical-align: middle; }\n  /* line 320, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_forms.scss */\n  .form-inline .form-control {\n    display: inline-block;\n    width: auto;\n    vertical-align: middle; }\n  /* line 327, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_forms.scss */\n  .form-inline .form-control-static {\n    display: inline-block; }\n  /* line 331, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_forms.scss */\n  .form-inline .input-group {\n    display: inline-table;\n    width: auto;\n    vertical-align: middle; }\n    /* line 336, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_forms.scss */\n    .form-inline .input-group .input-group-addon,\n    .form-inline .input-group .input-group-btn,\n    .form-inline .input-group .form-control {\n      width: auto; }\n  /* line 344, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_forms.scss */\n  .form-inline .input-group > .form-control {\n    width: 100%; }\n  /* line 348, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_forms.scss */\n  .form-inline .form-control-label {\n    margin-bottom: 0;\n    vertical-align: middle; }\n  /* line 355, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_forms.scss */\n  .form-inline .form-check {\n    display: inline-block;\n    margin-top: 0;\n    margin-bottom: 0;\n    vertical-align: middle; }\n  /* line 361, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_forms.scss */\n  .form-inline .form-check-label {\n    padding-left: 0; }\n  /* line 364, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_forms.scss */\n  .form-inline .form-check-input {\n    position: relative;\n    margin-left: 0; }\n  /* line 370, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_forms.scss */\n  .form-inline .has-feedback .form-control-feedback {\n    top: 0; } }\n\n/* line 7, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_buttons.scss */\n.btn {\n  display: inline-block;\n  font-weight: normal;\n  line-height: 1.25;\n  text-align: center;\n  white-space: nowrap;\n  vertical-align: middle;\n  cursor: pointer;\n  user-select: none;\n  border: 1px solid transparent;\n  padding: 0.5rem 1rem;\n  font-size: 1rem;\n  border-radius: 0.25rem; }\n  /* line 23, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_buttons.scss */\n  .btn:focus, .btn.focus, .btn:active:focus, .btn:active.focus, .btn.active:focus, .btn.active.focus {\n    outline: 5px auto -webkit-focus-ring-color;\n    outline-offset: -2px; }\n  /* line 21, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_hover.scss */\n  .btn:focus, .btn:hover {\n    text-decoration: none; }\n  /* line 32, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_buttons.scss */\n  .btn.focus {\n    text-decoration: none; }\n  /* line 36, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_buttons.scss */\n  .btn:active, .btn.active {\n    background-image: none;\n    outline: 0; }\n  /* line 43, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_buttons.scss */\n  .btn.disabled, .btn:disabled {\n    cursor: not-allowed;\n    opacity: .65; }\n\n/* line 52, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_buttons.scss */\na.btn.disabled,\nfieldset[disabled] a.btn {\n  pointer-events: none; }\n\n/* line 62, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_buttons.scss */\n.btn-primary {\n  color: #fff;\n  background-color: #0275d8;\n  border-color: #0275d8; }\n  /* line 11, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_hover.scss */\n  .btn-primary:hover {\n    color: #fff;\n    background-color: #025aa5;\n    border-color: #01549b; }\n  /* line 21, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_buttons.scss */\n  .btn-primary:focus, .btn-primary.focus {\n    color: #fff;\n    background-color: #025aa5;\n    border-color: #01549b; }\n  /* line 28, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_buttons.scss */\n  .btn-primary:active, .btn-primary.active,\n  .open > .btn-primary.dropdown-toggle {\n    color: #fff;\n    background-color: #025aa5;\n    border-color: #01549b;\n    background-image: none; }\n    /* line 38, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_buttons.scss */\n    .btn-primary:active:hover, .btn-primary:active:focus, .btn-primary:active.focus, .btn-primary.active:hover, .btn-primary.active:focus, .btn-primary.active.focus,\n    .open > .btn-primary.dropdown-toggle:hover,\n    .open > .btn-primary.dropdown-toggle:focus,\n    .open > .btn-primary.dropdown-toggle.focus {\n      color: #fff;\n      background-color: #014682;\n      border-color: #01315a; }\n  /* line 49, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_buttons.scss */\n  .btn-primary.disabled:focus, .btn-primary.disabled.focus, .btn-primary:disabled:focus, .btn-primary:disabled.focus {\n    background-color: #0275d8;\n    border-color: #0275d8; }\n  /* line 11, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_hover.scss */\n  .btn-primary.disabled:hover, .btn-primary:disabled:hover {\n    background-color: #0275d8;\n    border-color: #0275d8; }\n\n/* line 65, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_buttons.scss */\n.btn-secondary {\n  color: #373a3c;\n  background-color: #fff;\n  border-color: #ccc; }\n  /* line 11, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_hover.scss */\n  .btn-secondary:hover {\n    color: #373a3c;\n    background-color: #e6e6e6;\n    border-color: #adadad; }\n  /* line 21, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_buttons.scss */\n  .btn-secondary:focus, .btn-secondary.focus {\n    color: #373a3c;\n    background-color: #e6e6e6;\n    border-color: #adadad; }\n  /* line 28, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_buttons.scss */\n  .btn-secondary:active, .btn-secondary.active,\n  .open > .btn-secondary.dropdown-toggle {\n    color: #373a3c;\n    background-color: #e6e6e6;\n    border-color: #adadad;\n    background-image: none; }\n    /* line 38, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_buttons.scss */\n    .btn-secondary:active:hover, .btn-secondary:active:focus, .btn-secondary:active.focus, .btn-secondary.active:hover, .btn-secondary.active:focus, .btn-secondary.active.focus,\n    .open > .btn-secondary.dropdown-toggle:hover,\n    .open > .btn-secondary.dropdown-toggle:focus,\n    .open > .btn-secondary.dropdown-toggle.focus {\n      color: #373a3c;\n      background-color: #d4d4d4;\n      border-color: #8c8c8c; }\n  /* line 49, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_buttons.scss */\n  .btn-secondary.disabled:focus, .btn-secondary.disabled.focus, .btn-secondary:disabled:focus, .btn-secondary:disabled.focus {\n    background-color: #fff;\n    border-color: #ccc; }\n  /* line 11, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_hover.scss */\n  .btn-secondary.disabled:hover, .btn-secondary:disabled:hover {\n    background-color: #fff;\n    border-color: #ccc; }\n\n/* line 68, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_buttons.scss */\n.btn-info {\n  color: #fff;\n  background-color: #5bc0de;\n  border-color: #5bc0de; }\n  /* line 11, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_hover.scss */\n  .btn-info:hover {\n    color: #fff;\n    background-color: #31b0d5;\n    border-color: #2aabd2; }\n  /* line 21, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_buttons.scss */\n  .btn-info:focus, .btn-info.focus {\n    color: #fff;\n    background-color: #31b0d5;\n    border-color: #2aabd2; }\n  /* line 28, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_buttons.scss */\n  .btn-info:active, .btn-info.active,\n  .open > .btn-info.dropdown-toggle {\n    color: #fff;\n    background-color: #31b0d5;\n    border-color: #2aabd2;\n    background-image: none; }\n    /* line 38, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_buttons.scss */\n    .btn-info:active:hover, .btn-info:active:focus, .btn-info:active.focus, .btn-info.active:hover, .btn-info.active:focus, .btn-info.active.focus,\n    .open > .btn-info.dropdown-toggle:hover,\n    .open > .btn-info.dropdown-toggle:focus,\n    .open > .btn-info.dropdown-toggle.focus {\n      color: #fff;\n      background-color: #269abc;\n      border-color: #1f7e9a; }\n  /* line 49, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_buttons.scss */\n  .btn-info.disabled:focus, .btn-info.disabled.focus, .btn-info:disabled:focus, .btn-info:disabled.focus {\n    background-color: #5bc0de;\n    border-color: #5bc0de; }\n  /* line 11, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_hover.scss */\n  .btn-info.disabled:hover, .btn-info:disabled:hover {\n    background-color: #5bc0de;\n    border-color: #5bc0de; }\n\n/* line 71, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_buttons.scss */\n.btn-success {\n  color: #fff;\n  background-color: #5cb85c;\n  border-color: #5cb85c; }\n  /* line 11, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_hover.scss */\n  .btn-success:hover {\n    color: #fff;\n    background-color: #449d44;\n    border-color: #419641; }\n  /* line 21, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_buttons.scss */\n  .btn-success:focus, .btn-success.focus {\n    color: #fff;\n    background-color: #449d44;\n    border-color: #419641; }\n  /* line 28, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_buttons.scss */\n  .btn-success:active, .btn-success.active,\n  .open > .btn-success.dropdown-toggle {\n    color: #fff;\n    background-color: #449d44;\n    border-color: #419641;\n    background-image: none; }\n    /* line 38, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_buttons.scss */\n    .btn-success:active:hover, .btn-success:active:focus, .btn-success:active.focus, .btn-success.active:hover, .btn-success.active:focus, .btn-success.active.focus,\n    .open > .btn-success.dropdown-toggle:hover,\n    .open > .btn-success.dropdown-toggle:focus,\n    .open > .btn-success.dropdown-toggle.focus {\n      color: #fff;\n      background-color: #398439;\n      border-color: #2d672d; }\n  /* line 49, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_buttons.scss */\n  .btn-success.disabled:focus, .btn-success.disabled.focus, .btn-success:disabled:focus, .btn-success:disabled.focus {\n    background-color: #5cb85c;\n    border-color: #5cb85c; }\n  /* line 11, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_hover.scss */\n  .btn-success.disabled:hover, .btn-success:disabled:hover {\n    background-color: #5cb85c;\n    border-color: #5cb85c; }\n\n/* line 74, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_buttons.scss */\n.btn-warning {\n  color: #fff;\n  background-color: #f0ad4e;\n  border-color: #f0ad4e; }\n  /* line 11, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_hover.scss */\n  .btn-warning:hover {\n    color: #fff;\n    background-color: #ec971f;\n    border-color: #eb9316; }\n  /* line 21, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_buttons.scss */\n  .btn-warning:focus, .btn-warning.focus {\n    color: #fff;\n    background-color: #ec971f;\n    border-color: #eb9316; }\n  /* line 28, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_buttons.scss */\n  .btn-warning:active, .btn-warning.active,\n  .open > .btn-warning.dropdown-toggle {\n    color: #fff;\n    background-color: #ec971f;\n    border-color: #eb9316;\n    background-image: none; }\n    /* line 38, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_buttons.scss */\n    .btn-warning:active:hover, .btn-warning:active:focus, .btn-warning:active.focus, .btn-warning.active:hover, .btn-warning.active:focus, .btn-warning.active.focus,\n    .open > .btn-warning.dropdown-toggle:hover,\n    .open > .btn-warning.dropdown-toggle:focus,\n    .open > .btn-warning.dropdown-toggle.focus {\n      color: #fff;\n      background-color: #d58512;\n      border-color: #b06d0f; }\n  /* line 49, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_buttons.scss */\n  .btn-warning.disabled:focus, .btn-warning.disabled.focus, .btn-warning:disabled:focus, .btn-warning:disabled.focus {\n    background-color: #f0ad4e;\n    border-color: #f0ad4e; }\n  /* line 11, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_hover.scss */\n  .btn-warning.disabled:hover, .btn-warning:disabled:hover {\n    background-color: #f0ad4e;\n    border-color: #f0ad4e; }\n\n/* line 77, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_buttons.scss */\n.btn-danger {\n  color: #fff;\n  background-color: #d9534f;\n  border-color: #d9534f; }\n  /* line 11, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_hover.scss */\n  .btn-danger:hover {\n    color: #fff;\n    background-color: #c9302c;\n    border-color: #c12e2a; }\n  /* line 21, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_buttons.scss */\n  .btn-danger:focus, .btn-danger.focus {\n    color: #fff;\n    background-color: #c9302c;\n    border-color: #c12e2a; }\n  /* line 28, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_buttons.scss */\n  .btn-danger:active, .btn-danger.active,\n  .open > .btn-danger.dropdown-toggle {\n    color: #fff;\n    background-color: #c9302c;\n    border-color: #c12e2a;\n    background-image: none; }\n    /* line 38, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_buttons.scss */\n    .btn-danger:active:hover, .btn-danger:active:focus, .btn-danger:active.focus, .btn-danger.active:hover, .btn-danger.active:focus, .btn-danger.active.focus,\n    .open > .btn-danger.dropdown-toggle:hover,\n    .open > .btn-danger.dropdown-toggle:focus,\n    .open > .btn-danger.dropdown-toggle.focus {\n      color: #fff;\n      background-color: #ac2925;\n      border-color: #8b211e; }\n  /* line 49, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_buttons.scss */\n  .btn-danger.disabled:focus, .btn-danger.disabled.focus, .btn-danger:disabled:focus, .btn-danger:disabled.focus {\n    background-color: #d9534f;\n    border-color: #d9534f; }\n  /* line 11, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_hover.scss */\n  .btn-danger.disabled:hover, .btn-danger:disabled:hover {\n    background-color: #d9534f;\n    border-color: #d9534f; }\n\n/* line 82, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_buttons.scss */\n.btn-outline-primary {\n  color: #0275d8;\n  background-image: none;\n  background-color: transparent;\n  border-color: #0275d8; }\n  /* line 11, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_hover.scss */\n  .btn-outline-primary:hover {\n    color: #fff;\n    background-color: #0275d8;\n    border-color: #0275d8; }\n  /* line 73, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_buttons.scss */\n  .btn-outline-primary:focus, .btn-outline-primary.focus {\n    color: #fff;\n    background-color: #0275d8;\n    border-color: #0275d8; }\n  /* line 80, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_buttons.scss */\n  .btn-outline-primary:active, .btn-outline-primary.active,\n  .open > .btn-outline-primary.dropdown-toggle {\n    color: #fff;\n    background-color: #0275d8;\n    border-color: #0275d8; }\n    /* line 87, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_buttons.scss */\n    .btn-outline-primary:active:hover, .btn-outline-primary:active:focus, .btn-outline-primary:active.focus, .btn-outline-primary.active:hover, .btn-outline-primary.active:focus, .btn-outline-primary.active.focus,\n    .open > .btn-outline-primary.dropdown-toggle:hover,\n    .open > .btn-outline-primary.dropdown-toggle:focus,\n    .open > .btn-outline-primary.dropdown-toggle.focus {\n      color: #fff;\n      background-color: #014682;\n      border-color: #01315a; }\n  /* line 98, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_buttons.scss */\n  .btn-outline-primary.disabled:focus, .btn-outline-primary.disabled.focus, .btn-outline-primary:disabled:focus, .btn-outline-primary:disabled.focus {\n    border-color: #43a7fd; }\n  /* line 11, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_hover.scss */\n  .btn-outline-primary.disabled:hover, .btn-outline-primary:disabled:hover {\n    border-color: #43a7fd; }\n\n/* line 85, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_buttons.scss */\n.btn-outline-secondary {\n  color: #ccc;\n  background-image: none;\n  background-color: transparent;\n  border-color: #ccc; }\n  /* line 11, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_hover.scss */\n  .btn-outline-secondary:hover {\n    color: #fff;\n    background-color: #ccc;\n    border-color: #ccc; }\n  /* line 73, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_buttons.scss */\n  .btn-outline-secondary:focus, .btn-outline-secondary.focus {\n    color: #fff;\n    background-color: #ccc;\n    border-color: #ccc; }\n  /* line 80, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_buttons.scss */\n  .btn-outline-secondary:active, .btn-outline-secondary.active,\n  .open > .btn-outline-secondary.dropdown-toggle {\n    color: #fff;\n    background-color: #ccc;\n    border-color: #ccc; }\n    /* line 87, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_buttons.scss */\n    .btn-outline-secondary:active:hover, .btn-outline-secondary:active:focus, .btn-outline-secondary:active.focus, .btn-outline-secondary.active:hover, .btn-outline-secondary.active:focus, .btn-outline-secondary.active.focus,\n    .open > .btn-outline-secondary.dropdown-toggle:hover,\n    .open > .btn-outline-secondary.dropdown-toggle:focus,\n    .open > .btn-outline-secondary.dropdown-toggle.focus {\n      color: #fff;\n      background-color: #a1a1a1;\n      border-color: #8c8c8c; }\n  /* line 98, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_buttons.scss */\n  .btn-outline-secondary.disabled:focus, .btn-outline-secondary.disabled.focus, .btn-outline-secondary:disabled:focus, .btn-outline-secondary:disabled.focus {\n    border-color: white; }\n  /* line 11, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_hover.scss */\n  .btn-outline-secondary.disabled:hover, .btn-outline-secondary:disabled:hover {\n    border-color: white; }\n\n/* line 88, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_buttons.scss */\n.btn-outline-info {\n  color: #5bc0de;\n  background-image: none;\n  background-color: transparent;\n  border-color: #5bc0de; }\n  /* line 11, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_hover.scss */\n  .btn-outline-info:hover {\n    color: #fff;\n    background-color: #5bc0de;\n    border-color: #5bc0de; }\n  /* line 73, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_buttons.scss */\n  .btn-outline-info:focus, .btn-outline-info.focus {\n    color: #fff;\n    background-color: #5bc0de;\n    border-color: #5bc0de; }\n  /* line 80, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_buttons.scss */\n  .btn-outline-info:active, .btn-outline-info.active,\n  .open > .btn-outline-info.dropdown-toggle {\n    color: #fff;\n    background-color: #5bc0de;\n    border-color: #5bc0de; }\n    /* line 87, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_buttons.scss */\n    .btn-outline-info:active:hover, .btn-outline-info:active:focus, .btn-outline-info:active.focus, .btn-outline-info.active:hover, .btn-outline-info.active:focus, .btn-outline-info.active.focus,\n    .open > .btn-outline-info.dropdown-toggle:hover,\n    .open > .btn-outline-info.dropdown-toggle:focus,\n    .open > .btn-outline-info.dropdown-toggle.focus {\n      color: #fff;\n      background-color: #269abc;\n      border-color: #1f7e9a; }\n  /* line 98, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_buttons.scss */\n  .btn-outline-info.disabled:focus, .btn-outline-info.disabled.focus, .btn-outline-info:disabled:focus, .btn-outline-info:disabled.focus {\n    border-color: #b0e1ef; }\n  /* line 11, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_hover.scss */\n  .btn-outline-info.disabled:hover, .btn-outline-info:disabled:hover {\n    border-color: #b0e1ef; }\n\n/* line 91, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_buttons.scss */\n.btn-outline-success {\n  color: #5cb85c;\n  background-image: none;\n  background-color: transparent;\n  border-color: #5cb85c; }\n  /* line 11, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_hover.scss */\n  .btn-outline-success:hover {\n    color: #fff;\n    background-color: #5cb85c;\n    border-color: #5cb85c; }\n  /* line 73, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_buttons.scss */\n  .btn-outline-success:focus, .btn-outline-success.focus {\n    color: #fff;\n    background-color: #5cb85c;\n    border-color: #5cb85c; }\n  /* line 80, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_buttons.scss */\n  .btn-outline-success:active, .btn-outline-success.active,\n  .open > .btn-outline-success.dropdown-toggle {\n    color: #fff;\n    background-color: #5cb85c;\n    border-color: #5cb85c; }\n    /* line 87, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_buttons.scss */\n    .btn-outline-success:active:hover, .btn-outline-success:active:focus, .btn-outline-success:active.focus, .btn-outline-success.active:hover, .btn-outline-success.active:focus, .btn-outline-success.active.focus,\n    .open > .btn-outline-success.dropdown-toggle:hover,\n    .open > .btn-outline-success.dropdown-toggle:focus,\n    .open > .btn-outline-success.dropdown-toggle.focus {\n      color: #fff;\n      background-color: #398439;\n      border-color: #2d672d; }\n  /* line 98, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_buttons.scss */\n  .btn-outline-success.disabled:focus, .btn-outline-success.disabled.focus, .btn-outline-success:disabled:focus, .btn-outline-success:disabled.focus {\n    border-color: #a3d7a3; }\n  /* line 11, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_hover.scss */\n  .btn-outline-success.disabled:hover, .btn-outline-success:disabled:hover {\n    border-color: #a3d7a3; }\n\n/* line 94, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_buttons.scss */\n.btn-outline-warning {\n  color: #f0ad4e;\n  background-image: none;\n  background-color: transparent;\n  border-color: #f0ad4e; }\n  /* line 11, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_hover.scss */\n  .btn-outline-warning:hover {\n    color: #fff;\n    background-color: #f0ad4e;\n    border-color: #f0ad4e; }\n  /* line 73, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_buttons.scss */\n  .btn-outline-warning:focus, .btn-outline-warning.focus {\n    color: #fff;\n    background-color: #f0ad4e;\n    border-color: #f0ad4e; }\n  /* line 80, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_buttons.scss */\n  .btn-outline-warning:active, .btn-outline-warning.active,\n  .open > .btn-outline-warning.dropdown-toggle {\n    color: #fff;\n    background-color: #f0ad4e;\n    border-color: #f0ad4e; }\n    /* line 87, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_buttons.scss */\n    .btn-outline-warning:active:hover, .btn-outline-warning:active:focus, .btn-outline-warning:active.focus, .btn-outline-warning.active:hover, .btn-outline-warning.active:focus, .btn-outline-warning.active.focus,\n    .open > .btn-outline-warning.dropdown-toggle:hover,\n    .open > .btn-outline-warning.dropdown-toggle:focus,\n    .open > .btn-outline-warning.dropdown-toggle.focus {\n      color: #fff;\n      background-color: #d58512;\n      border-color: #b06d0f; }\n  /* line 98, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_buttons.scss */\n  .btn-outline-warning.disabled:focus, .btn-outline-warning.disabled.focus, .btn-outline-warning:disabled:focus, .btn-outline-warning:disabled.focus {\n    border-color: #f8d9ac; }\n  /* line 11, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_hover.scss */\n  .btn-outline-warning.disabled:hover, .btn-outline-warning:disabled:hover {\n    border-color: #f8d9ac; }\n\n/* line 97, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_buttons.scss */\n.btn-outline-danger {\n  color: #d9534f;\n  background-image: none;\n  background-color: transparent;\n  border-color: #d9534f; }\n  /* line 11, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_hover.scss */\n  .btn-outline-danger:hover {\n    color: #fff;\n    background-color: #d9534f;\n    border-color: #d9534f; }\n  /* line 73, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_buttons.scss */\n  .btn-outline-danger:focus, .btn-outline-danger.focus {\n    color: #fff;\n    background-color: #d9534f;\n    border-color: #d9534f; }\n  /* line 80, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_buttons.scss */\n  .btn-outline-danger:active, .btn-outline-danger.active,\n  .open > .btn-outline-danger.dropdown-toggle {\n    color: #fff;\n    background-color: #d9534f;\n    border-color: #d9534f; }\n    /* line 87, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_buttons.scss */\n    .btn-outline-danger:active:hover, .btn-outline-danger:active:focus, .btn-outline-danger:active.focus, .btn-outline-danger.active:hover, .btn-outline-danger.active:focus, .btn-outline-danger.active.focus,\n    .open > .btn-outline-danger.dropdown-toggle:hover,\n    .open > .btn-outline-danger.dropdown-toggle:focus,\n    .open > .btn-outline-danger.dropdown-toggle.focus {\n      color: #fff;\n      background-color: #ac2925;\n      border-color: #8b211e; }\n  /* line 98, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_buttons.scss */\n  .btn-outline-danger.disabled:focus, .btn-outline-danger.disabled.focus, .btn-outline-danger:disabled:focus, .btn-outline-danger:disabled.focus {\n    border-color: #eba5a3; }\n  /* line 11, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_hover.scss */\n  .btn-outline-danger.disabled:hover, .btn-outline-danger:disabled:hover {\n    border-color: #eba5a3; }\n\n/* line 107, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_buttons.scss */\n.btn-link {\n  font-weight: normal;\n  color: #0275d8;\n  border-radius: 0; }\n  /* line 112, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_buttons.scss */\n  .btn-link, .btn-link:active, .btn-link.active, .btn-link:disabled {\n    background-color: transparent; }\n  /* line 119, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_buttons.scss */\n  .btn-link, .btn-link:focus, .btn-link:active {\n    border-color: transparent; }\n  /* line 11, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_hover.scss */\n  .btn-link:hover {\n    border-color: transparent; }\n  /* line 21, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_hover.scss */\n  .btn-link:focus, .btn-link:hover {\n    color: #014c8c;\n    text-decoration: underline;\n    background-color: transparent; }\n  /* line 21, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_hover.scss */\n  .btn-link:disabled:focus, .btn-link:disabled:hover {\n    color: #818a91;\n    text-decoration: none; }\n\n/* line 145, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_buttons.scss */\n.btn-lg, .btn-group-lg > .btn {\n  padding: 0.75rem 1.5rem;\n  font-size: 1.25rem;\n  border-radius: 0.3rem; }\n\n/* line 149, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_buttons.scss */\n.btn-sm, .btn-group-sm > .btn {\n  padding: 0.25rem 0.5rem;\n  font-size: 0.875rem;\n  border-radius: 0.2rem; }\n\n/* line 159, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_buttons.scss */\n.btn-block {\n  display: block;\n  width: 100%; }\n\n/* line 165, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_buttons.scss */\n.btn-block + .btn-block {\n  margin-top: 0.5rem; }\n\n/* line 173, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_buttons.scss */\ninput[type=\"submit\"].btn-block,\ninput[type=\"reset\"].btn-block,\ninput[type=\"button\"].btn-block {\n  width: 100%; }\n\n/* line 1, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_animation.scss */\n.fade {\n  opacity: 0;\n  transition: opacity .15s linear; }\n  /* line 5, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_animation.scss */\n  .fade.in {\n    opacity: 1; }\n\n/* line 10, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_animation.scss */\n.collapse {\n  display: none; }\n  /* line 12, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_animation.scss */\n  .collapse.in {\n    display: block; }\n\n/* line 18, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_animation.scss */\ntr.collapse.in {\n  display: table-row; }\n\n/* line 24, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_animation.scss */\ntbody.collapse.in {\n  display: table-row-group; }\n\n/* line 29, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_animation.scss */\n.collapsing {\n  position: relative;\n  height: 0;\n  overflow: hidden;\n  transition-timing-function: ease;\n  transition-duration: .35s;\n  transition-property: height; }\n\n/* line 2, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_dropdown.scss */\n.dropup,\n.dropdown {\n  position: relative; }\n\n/* line 9, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_dropdown.scss */\n.dropdown-toggle::after {\n  display: inline-block;\n  width: 0;\n  height: 0;\n  margin-left: 0.3em;\n  vertical-align: middle;\n  content: \"\";\n  border-top: 0.3em solid;\n  border-right: 0.3em solid transparent;\n  border-left: 0.3em solid transparent; }\n\n/* line 22, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_dropdown.scss */\n.dropdown-toggle:focus {\n  outline: 0; }\n\n/* line 29, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_dropdown.scss */\n.dropup .dropdown-toggle::after {\n  border-top: 0;\n  border-bottom: 0.3em solid; }\n\n/* line 37, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_dropdown.scss */\n.dropdown-menu {\n  position: absolute;\n  top: 100%;\n  left: 0;\n  z-index: 1000;\n  display: none;\n  float: left;\n  min-width: 10rem;\n  padding: 0.5rem 0;\n  margin: 0.125rem 0 0;\n  font-size: 1rem;\n  color: #373a3c;\n  text-align: left;\n  list-style: none;\n  background-color: #fff;\n  background-clip: padding-box;\n  border: 1px solid rgba(0, 0, 0, 0.15);\n  border-radius: 0.25rem; }\n\n/* line 59, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_dropdown.scss */\n.dropdown-divider {\n  height: 1px;\n  margin: 0.5rem 0;\n  overflow: hidden;\n  background-color: #e5e5e5; }\n\n/* line 66, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_dropdown.scss */\n.dropdown-item {\n  display: block;\n  width: 100%;\n  padding: 3px 1.5rem;\n  clear: both;\n  font-weight: normal;\n  color: #373a3c;\n  text-align: inherit;\n  white-space: nowrap;\n  background: none;\n  border: 0; }\n  /* line 21, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_hover.scss */\n  .dropdown-item:focus, .dropdown-item:hover {\n    color: #2b2d2f;\n    text-decoration: none;\n    background-color: #f5f5f5; }\n  /* line 37, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_hover.scss */\n  .dropdown-item.active, .dropdown-item.active:focus, .dropdown-item.active:hover {\n    color: #fff;\n    text-decoration: none;\n    background-color: #0275d8;\n    outline: 0; }\n  /* line 37, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_hover.scss */\n  .dropdown-item.disabled, .dropdown-item.disabled:focus, .dropdown-item.disabled:hover {\n    color: #818a91; }\n  /* line 21, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_hover.scss */\n  .dropdown-item.disabled:focus, .dropdown-item.disabled:hover {\n    text-decoration: none;\n    cursor: not-allowed;\n    background-color: transparent;\n    background-image: none;\n    filter: \"progid:DXImageTransform.Microsoft.gradient(enabled = false)\"; }\n\n/* line 116, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_dropdown.scss */\n.open > .dropdown-menu {\n  display: block; }\n\n/* line 121, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_dropdown.scss */\n.open > a {\n  outline: 0; }\n\n/* line 130, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_dropdown.scss */\n.dropdown-menu-right {\n  right: 0;\n  left: auto; }\n\n/* line 135, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_dropdown.scss */\n.dropdown-menu-left {\n  right: auto;\n  left: 0; }\n\n/* line 141, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_dropdown.scss */\n.dropdown-header {\n  display: block;\n  padding: 0.5rem 1.5rem;\n  margin-bottom: 0;\n  font-size: 0.875rem;\n  color: #818a91;\n  white-space: nowrap; }\n\n/* line 151, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_dropdown.scss */\n.dropdown-backdrop {\n  position: fixed;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  z-index: 990; }\n\n/* line 168, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_dropdown.scss */\n.dropup .caret,\n.navbar-fixed-bottom .dropdown .caret {\n  content: \"\";\n  border-top: 0;\n  border-bottom: 0.3em solid; }\n\n/* line 175, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_dropdown.scss */\n.dropup .dropdown-menu,\n.navbar-fixed-bottom .dropdown .dropdown-menu {\n  top: auto;\n  bottom: 100%;\n  margin-bottom: 0.125rem; }\n\n/* line 4, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_button-group.scss */\n.btn-group,\n.btn-group-vertical {\n  position: relative;\n  display: inline-block;\n  vertical-align: middle; }\n  /* line 10, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_button-group.scss */\n  .btn-group > .btn,\n  .btn-group-vertical > .btn {\n    position: relative;\n    float: left;\n    margin-bottom: 0; }\n    /* line 16, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_button-group.scss */\n    .btn-group > .btn:focus, .btn-group > .btn:active, .btn-group > .btn.active,\n    .btn-group-vertical > .btn:focus,\n    .btn-group-vertical > .btn:active,\n    .btn-group-vertical > .btn.active {\n      z-index: 2; }\n    /* line 11, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_hover.scss */\n    .btn-group > .btn:hover,\n    .btn-group-vertical > .btn:hover {\n      z-index: 2; }\n\n/* line 29, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_button-group.scss */\n.btn-group .btn + .btn,\n.btn-group .btn + .btn-group,\n.btn-group .btn-group + .btn,\n.btn-group .btn-group + .btn-group {\n  margin-left: -1px; }\n\n/* line 38, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_button-group.scss */\n.btn-toolbar {\n  margin-left: -0.5rem; }\n  /* line 2, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_clearfix.scss */\n  .btn-toolbar::after {\n    content: \"\";\n    display: table;\n    clear: both; }\n  /* line 42, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_button-group.scss */\n  .btn-toolbar .btn-group,\n  .btn-toolbar .input-group {\n    float: left; }\n  /* line 47, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_button-group.scss */\n  .btn-toolbar > .btn,\n  .btn-toolbar > .btn-group,\n  .btn-toolbar > .input-group {\n    margin-left: 0.5rem; }\n\n/* line 54, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_button-group.scss */\n.btn-group > .btn:not(:first-child):not(:last-child):not(.dropdown-toggle) {\n  border-radius: 0; }\n\n/* line 59, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_button-group.scss */\n.btn-group > .btn:first-child {\n  margin-left: 0; }\n  /* line 62, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_button-group.scss */\n  .btn-group > .btn:first-child:not(:last-child):not(.dropdown-toggle) {\n    border-bottom-right-radius: 0;\n    border-top-right-radius: 0; }\n\n/* line 67, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_button-group.scss */\n.btn-group > .btn:last-child:not(:first-child),\n.btn-group > .dropdown-toggle:not(:first-child) {\n  border-bottom-left-radius: 0;\n  border-top-left-radius: 0; }\n\n/* line 73, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_button-group.scss */\n.btn-group > .btn-group {\n  float: left; }\n\n/* line 76, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_button-group.scss */\n.btn-group > .btn-group:not(:first-child):not(:last-child) > .btn {\n  border-radius: 0; }\n\n/* line 80, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_button-group.scss */\n.btn-group > .btn-group:first-child:not(:last-child) > .btn:last-child,\n.btn-group > .btn-group:first-child:not(:last-child) > .dropdown-toggle {\n  border-bottom-right-radius: 0;\n  border-top-right-radius: 0; }\n\n/* line 85, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_button-group.scss */\n.btn-group > .btn-group:last-child:not(:first-child) > .btn:first-child {\n  border-bottom-left-radius: 0;\n  border-top-left-radius: 0; }\n\n/* line 90, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_button-group.scss */\n.btn-group .dropdown-toggle:active,\n.btn-group.open .dropdown-toggle {\n  outline: 0; }\n\n/* line 108, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_button-group.scss */\n.btn + .dropdown-toggle-split {\n  padding-right: 0.75rem;\n  padding-left: 0.75rem; }\n  /* line 112, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_button-group.scss */\n  .btn + .dropdown-toggle-split::after {\n    margin-left: 0; }\n\n/* line 117, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_button-group.scss */\n.btn-sm + .dropdown-toggle-split, .btn-group-sm > .btn + .dropdown-toggle-split {\n  padding-right: 0.375rem;\n  padding-left: 0.375rem; }\n\n/* line 122, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_button-group.scss */\n.btn-lg + .dropdown-toggle-split, .btn-group-lg > .btn + .dropdown-toggle-split {\n  padding-right: 1.125rem;\n  padding-left: 1.125rem; }\n\n/* line 141, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_button-group.scss */\n.btn .caret {\n  margin-left: 0; }\n\n/* line 145, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_button-group.scss */\n.btn-lg .caret, .btn-group-lg > .btn .caret {\n  border-width: 0.3em 0.3em 0;\n  border-bottom-width: 0; }\n\n/* line 150, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_button-group.scss */\n.dropup .btn-lg .caret, .dropup .btn-group-lg > .btn .caret {\n  border-width: 0 0.3em 0.3em; }\n\n/* line 161, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_button-group.scss */\n.btn-group-vertical > .btn,\n.btn-group-vertical > .btn-group,\n.btn-group-vertical > .btn-group > .btn {\n  display: block;\n  float: none;\n  width: 100%;\n  max-width: 100%; }\n\n/* line 2, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_clearfix.scss */\n.btn-group-vertical > .btn-group::after {\n  content: \"\";\n  display: table;\n  clear: both; }\n\n/* line 174, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_button-group.scss */\n.btn-group-vertical > .btn-group > .btn {\n  float: none; }\n\n/* line 179, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_button-group.scss */\n.btn-group-vertical > .btn + .btn,\n.btn-group-vertical > .btn + .btn-group,\n.btn-group-vertical > .btn-group + .btn,\n.btn-group-vertical > .btn-group + .btn-group {\n  margin-top: -1px;\n  margin-left: 0; }\n\n/* line 189, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_button-group.scss */\n.btn-group-vertical > .btn:not(:first-child):not(:last-child) {\n  border-radius: 0; }\n\n/* line 192, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_button-group.scss */\n.btn-group-vertical > .btn:first-child:not(:last-child) {\n  border-bottom-right-radius: 0;\n  border-bottom-left-radius: 0; }\n\n/* line 195, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_button-group.scss */\n.btn-group-vertical > .btn:last-child:not(:first-child) {\n  border-top-right-radius: 0;\n  border-top-left-radius: 0; }\n\n/* line 199, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_button-group.scss */\n.btn-group-vertical > .btn-group:not(:first-child):not(:last-child) > .btn {\n  border-radius: 0; }\n\n/* line 203, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_button-group.scss */\n.btn-group-vertical > .btn-group:first-child:not(:last-child) > .btn:last-child,\n.btn-group-vertical > .btn-group:first-child:not(:last-child) > .dropdown-toggle {\n  border-bottom-right-radius: 0;\n  border-bottom-left-radius: 0; }\n\n/* line 208, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_button-group.scss */\n.btn-group-vertical > .btn-group:last-child:not(:first-child) > .btn:first-child {\n  border-top-right-radius: 0;\n  border-top-left-radius: 0; }\n\n/* line 228, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_button-group.scss */\n[data-toggle=\"buttons\"] > .btn input[type=\"radio\"],\n[data-toggle=\"buttons\"] > .btn input[type=\"checkbox\"],\n[data-toggle=\"buttons\"] > .btn-group > .btn input[type=\"radio\"],\n[data-toggle=\"buttons\"] > .btn-group > .btn input[type=\"checkbox\"] {\n  position: absolute;\n  clip: rect(0, 0, 0, 0);\n  pointer-events: none; }\n\n/* line 5, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_input-group.scss */\n.input-group {\n  position: relative;\n  width: 100%;\n  display: table;\n  border-collapse: separate; }\n  /* line 18, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_input-group.scss */\n  .input-group .form-control {\n    position: relative;\n    z-index: 2;\n    float: left;\n    width: 100%;\n    margin-bottom: 0; }\n    /* line 54, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_hover.scss */\n    .input-group .form-control:focus, .input-group .form-control:active, .input-group .form-control:hover {\n      z-index: 3; }\n\n/* line 40, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_input-group.scss */\n.input-group-addon,\n.input-group-btn,\n.input-group .form-control {\n  display: table-cell; }\n  /* line 47, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_input-group.scss */\n  .input-group-addon:not(:first-child):not(:last-child),\n  .input-group-btn:not(:first-child):not(:last-child),\n  .input-group .form-control:not(:first-child):not(:last-child) {\n    border-radius: 0; }\n\n/* line 52, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_input-group.scss */\n.input-group-addon,\n.input-group-btn {\n  width: 1%;\n  white-space: nowrap;\n  vertical-align: middle; }\n\n/* line 83, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_input-group.scss */\n.input-group-addon {\n  padding: 0.5rem 0.75rem;\n  margin-bottom: 0;\n  font-size: 1rem;\n  font-weight: normal;\n  line-height: 1.25;\n  color: #55595c;\n  text-align: center;\n  background-color: #eceeef;\n  border: 1px solid rgba(0, 0, 0, 0.15);\n  border-radius: 0.25rem; }\n  /* line 96, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_input-group.scss */\n  .input-group-addon.form-control-sm,\n  .input-group-sm > .input-group-addon,\n  .input-group-sm > .input-group-btn > .input-group-addon.btn {\n    padding: 0.25rem 0.5rem;\n    font-size: 0.875rem;\n    border-radius: 0.2rem; }\n  /* line 101, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_input-group.scss */\n  .input-group-addon.form-control-lg,\n  .input-group-lg > .input-group-addon,\n  .input-group-lg > .input-group-btn > .input-group-addon.btn {\n    padding: 0.75rem 1.5rem;\n    font-size: 1.25rem;\n    border-radius: 0.3rem; }\n  /* line 109, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_input-group.scss */\n  .input-group-addon input[type=\"radio\"],\n  .input-group-addon input[type=\"checkbox\"] {\n    margin-top: 0; }\n\n/* line 121, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_input-group.scss */\n.input-group .form-control:not(:last-child),\n.input-group-addon:not(:last-child),\n.input-group-btn:not(:last-child) > .btn,\n.input-group-btn:not(:last-child) > .btn-group > .btn,\n.input-group-btn:not(:last-child) > .dropdown-toggle,\n.input-group-btn:not(:first-child) > .btn:not(:last-child):not(.dropdown-toggle),\n.input-group-btn:not(:first-child) > .btn-group:not(:last-child) > .btn {\n  border-bottom-right-radius: 0;\n  border-top-right-radius: 0; }\n\n/* line 130, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_input-group.scss */\n.input-group-addon:not(:last-child) {\n  border-right: 0; }\n\n/* line 133, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_input-group.scss */\n.input-group .form-control:not(:first-child),\n.input-group-addon:not(:first-child),\n.input-group-btn:not(:first-child) > .btn,\n.input-group-btn:not(:first-child) > .btn-group > .btn,\n.input-group-btn:not(:first-child) > .dropdown-toggle,\n.input-group-btn:not(:last-child) > .btn:not(:first-child),\n.input-group-btn:not(:last-child) > .btn-group:not(:first-child) > .btn {\n  border-bottom-left-radius: 0;\n  border-top-left-radius: 0; }\n\n/* line 142, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_input-group.scss */\n.form-control + .input-group-addon:not(:first-child) {\n  border-left: 0; }\n\n/* line 150, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_input-group.scss */\n.input-group-btn {\n  position: relative;\n  font-size: 0;\n  white-space: nowrap; }\n  /* line 159, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_input-group.scss */\n  .input-group-btn > .btn {\n    position: relative; }\n    /* line 161, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_input-group.scss */\n    .input-group-btn > .btn + .btn {\n      margin-left: -1px; }\n    /* line 54, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_hover.scss */\n    .input-group-btn > .btn:focus, .input-group-btn > .btn:active, .input-group-btn > .btn:hover {\n      z-index: 3; }\n  /* line 172, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_input-group.scss */\n  .input-group-btn:not(:last-child) > .btn,\n  .input-group-btn:not(:last-child) > .btn-group {\n    margin-right: -1px; }\n  /* line 178, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_input-group.scss */\n  .input-group-btn:not(:first-child) > .btn,\n  .input-group-btn:not(:first-child) > .btn-group {\n    z-index: 2;\n    margin-left: -1px; }\n    /* line 54, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_hover.scss */\n    .input-group-btn:not(:first-child) > .btn:focus, .input-group-btn:not(:first-child) > .btn:active, .input-group-btn:not(:first-child) > .btn:hover,\n    .input-group-btn:not(:first-child) > .btn-group:focus,\n    .input-group-btn:not(:first-child) > .btn-group:active,\n    .input-group-btn:not(:first-child) > .btn-group:hover {\n      z-index: 3; }\n\n/* line 12, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_custom-forms.scss */\n.custom-control {\n  position: relative;\n  display: inline-block;\n  padding-left: 1.5rem;\n  cursor: pointer; }\n  /* line 18, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_custom-forms.scss */\n  .custom-control + .custom-control {\n    margin-left: 1rem; }\n\n/* line 23, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_custom-forms.scss */\n.custom-control-input {\n  position: absolute;\n  z-index: -1;\n  opacity: 0; }\n  /* line 28, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_custom-forms.scss */\n  .custom-control-input:checked ~ .custom-control-indicator {\n    color: #fff;\n    background-color: #0074d9; }\n  /* line 34, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_custom-forms.scss */\n  .custom-control-input:focus ~ .custom-control-indicator {\n    box-shadow: 0 0 0 0.075rem #fff, 0 0 0 0.2rem #0074d9; }\n  /* line 39, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_custom-forms.scss */\n  .custom-control-input:active ~ .custom-control-indicator {\n    color: #fff;\n    background-color: #84c6ff; }\n  /* line 46, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_custom-forms.scss */\n  .custom-control-input:disabled ~ .custom-control-indicator {\n    cursor: not-allowed;\n    background-color: #eee; }\n  /* line 51, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_custom-forms.scss */\n  .custom-control-input:disabled ~ .custom-control-description {\n    color: #767676;\n    cursor: not-allowed; }\n\n/* line 62, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_custom-forms.scss */\n.custom-control-indicator {\n  position: absolute;\n  top: .25rem;\n  left: 0;\n  display: block;\n  width: 1rem;\n  height: 1rem;\n  pointer-events: none;\n  user-select: none;\n  background-color: #ddd;\n  background-repeat: no-repeat;\n  background-position: center center;\n  background-size: 50% 50%; }\n\n/* line 83, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_custom-forms.scss */\n.custom-checkbox .custom-control-indicator {\n  border-radius: 0.25rem; }\n\n/* line 87, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_custom-forms.scss */\n.custom-checkbox .custom-control-input:checked ~ .custom-control-indicator {\n  background-image: url(\"data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Cpath fill='#fff' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3E%3C/svg%3E\"); }\n\n/* line 91, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_custom-forms.scss */\n.custom-checkbox .custom-control-input:indeterminate ~ .custom-control-indicator {\n  background-color: #0074d9;\n  background-image: url(\"data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 4'%3E%3Cpath stroke='#fff' d='M0 2h4'/%3E%3C/svg%3E\"); }\n\n/* line 103, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_custom-forms.scss */\n.custom-radio .custom-control-indicator {\n  border-radius: 50%; }\n\n/* line 107, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_custom-forms.scss */\n.custom-radio .custom-control-input:checked ~ .custom-control-indicator {\n  background-image: url(\"data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3E%3Ccircle r='3' fill='#fff'/%3E%3C/svg%3E\"); }\n\n/* line 119, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_custom-forms.scss */\n.custom-controls-stacked .custom-control {\n  float: left;\n  clear: left; }\n  /* line 123, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_custom-forms.scss */\n  .custom-controls-stacked .custom-control + .custom-control {\n    margin-left: 0; }\n\n/* line 137, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_custom-forms.scss */\n.custom-select {\n  display: inline-block;\n  max-width: 100%;\n  height: calc(2.5rem - 2px);\n  padding: 0.375rem 1.75rem 0.375rem 0.75rem;\n  padding-right: 0.75rem \\9;\n  color: #55595c;\n  vertical-align: middle;\n  background: #fff url(\"data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 5'%3E%3Cpath fill='#333' d='M2 0L0 2h4zm0 5L0 3h4z'/%3E%3C/svg%3E\") no-repeat right 0.75rem center;\n  background-image: none \\9;\n  background-size: 8px 10px;\n  border: 1px solid rgba(0, 0, 0, 0.15);\n  border-radius: 0.25rem;\n  -moz-appearance: none;\n  -webkit-appearance: none; }\n  /* line 155, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_custom-forms.scss */\n  .custom-select:focus {\n    border-color: #51a7e8;\n    outline: none; }\n    /* line 160, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_custom-forms.scss */\n    .custom-select:focus::-ms-value {\n      color: #55595c;\n      background-color: #fff; }\n  /* line 171, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_custom-forms.scss */\n  .custom-select:disabled {\n    color: #818a91;\n    cursor: not-allowed;\n    background-color: #eceeef; }\n  /* line 178, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_custom-forms.scss */\n  .custom-select::-ms-expand {\n    opacity: 0; }\n\n/* line 183, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_custom-forms.scss */\n.custom-select-sm {\n  padding-top: 0.375rem;\n  padding-bottom: 0.375rem;\n  font-size: 75%; }\n\n/* line 199, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_custom-forms.scss */\n.custom-file {\n  position: relative;\n  display: inline-block;\n  max-width: 100%;\n  height: 2.5rem;\n  cursor: pointer; }\n\n/* line 207, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_custom-forms.scss */\n.custom-file-input {\n  min-width: 14rem;\n  max-width: 100%;\n  margin: 0;\n  filter: alpha(opacity=0);\n  opacity: 0; }\n\n/* line 219, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_custom-forms.scss */\n.custom-file-control {\n  position: absolute;\n  top: 0;\n  right: 0;\n  left: 0;\n  z-index: 5;\n  height: 2.5rem;\n  padding: 0.5rem 1rem;\n  line-height: 1.5;\n  color: #555;\n  user-select: none;\n  background-color: #fff;\n  border: 1px solid #ddd;\n  border-radius: 0.25rem; }\n  /* line 236, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_custom-forms.scss */\n  .custom-file-control:lang(en)::after {\n    content: \"Choose file...\"; }\n  /* line 241, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_custom-forms.scss */\n  .custom-file-control::before {\n    position: absolute;\n    top: -1px;\n    right: -1px;\n    bottom: -1px;\n    z-index: 6;\n    display: block;\n    height: 2.5rem;\n    padding: 0.5rem 1rem;\n    line-height: 1.5;\n    color: #555;\n    background-color: #eee;\n    border: 1px solid #ddd;\n    border-radius: 0 0.25rem 0.25rem 0; }\n  /* line 258, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_custom-forms.scss */\n  .custom-file-control:lang(en)::before {\n    content: \"Browse\"; }\n\n/* line 6, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_nav.scss */\n.nav {\n  padding-left: 0;\n  margin-bottom: 0;\n  list-style: none; }\n\n/* line 12, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_nav.scss */\n.nav-link {\n  display: inline-block; }\n  /* line 21, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_hover.scss */\n  .nav-link:focus, .nav-link:hover {\n    text-decoration: none; }\n  /* line 20, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_nav.scss */\n  .nav-link.disabled {\n    color: #818a91; }\n    /* line 37, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_hover.scss */\n    .nav-link.disabled, .nav-link.disabled:focus, .nav-link.disabled:hover {\n      color: #818a91;\n      cursor: not-allowed;\n      background-color: transparent; }\n\n/* line 35, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_nav.scss */\n.nav-inline .nav-item {\n  display: inline-block; }\n\n/* line 39, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_nav.scss */\n.nav-inline .nav-item + .nav-item,\n.nav-inline .nav-link + .nav-link {\n  margin-left: 1rem; }\n\n/* line 50, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_nav.scss */\n.nav-tabs {\n  border-bottom: 1px solid #ddd; }\n  /* line 2, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_clearfix.scss */\n  .nav-tabs::after {\n    content: \"\";\n    display: table;\n    clear: both; }\n  /* line 54, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_nav.scss */\n  .nav-tabs .nav-item {\n    float: left;\n    margin-bottom: -1px; }\n    /* line 59, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_nav.scss */\n    .nav-tabs .nav-item + .nav-item {\n      margin-left: 0.2rem; }\n  /* line 64, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_nav.scss */\n  .nav-tabs .nav-link {\n    display: block;\n    padding: 0.5em 1em;\n    border: 1px solid transparent;\n    border-top-right-radius: 0.25rem;\n    border-top-left-radius: 0.25rem; }\n    /* line 21, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_hover.scss */\n    .nav-tabs .nav-link:focus, .nav-tabs .nav-link:hover {\n      border-color: #eceeef #eceeef #ddd; }\n    /* line 37, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_hover.scss */\n    .nav-tabs .nav-link.disabled, .nav-tabs .nav-link.disabled:focus, .nav-tabs .nav-link.disabled:hover {\n      color: #818a91;\n      background-color: transparent;\n      border-color: transparent; }\n  /* line 37, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_hover.scss */\n  .nav-tabs .nav-link.active, .nav-tabs .nav-link.active:focus, .nav-tabs .nav-link.active:hover,\n  .nav-tabs .nav-item.open .nav-link,\n  .nav-tabs .nav-item.open .nav-link:focus,\n  .nav-tabs .nav-item.open .nav-link:hover {\n    color: #55595c;\n    background-color: #fff;\n    border-color: #ddd #ddd transparent; }\n  /* line 92, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_nav.scss */\n  .nav-tabs .dropdown-menu {\n    margin-top: -1px;\n    border-top-right-radius: 0;\n    border-top-left-radius: 0; }\n\n/* line 2, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_clearfix.scss */\n.nav-pills::after {\n  content: \"\";\n  display: table;\n  clear: both; }\n\n/* line 108, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_nav.scss */\n.nav-pills .nav-item {\n  float: left; }\n  /* line 111, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_nav.scss */\n  .nav-pills .nav-item + .nav-item {\n    margin-left: 0.2rem; }\n\n/* line 116, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_nav.scss */\n.nav-pills .nav-link {\n  display: block;\n  padding: 0.5em 1em;\n  border-radius: 0.25rem; }\n\n/* line 37, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_hover.scss */\n.nav-pills .nav-link.active, .nav-pills .nav-link.active:focus, .nav-pills .nav-link.active:hover,\n.nav-pills .nav-item.open .nav-link,\n.nav-pills .nav-item.open .nav-link:focus,\n.nav-pills .nav-item.open .nav-link:hover {\n  color: #fff;\n  cursor: default;\n  background-color: #0275d8; }\n\n/* line 133, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_nav.scss */\n.nav-stacked .nav-item {\n  display: block;\n  float: none; }\n  /* line 137, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_nav.scss */\n  .nav-stacked .nav-item + .nav-item {\n    margin-top: 0.2rem;\n    margin-left: 0; }\n\n/* line 151, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_nav.scss */\n.tab-content > .tab-pane {\n  display: none; }\n\n/* line 154, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_nav.scss */\n.tab-content > .active {\n  display: block; }\n\n/* line 6, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_navbar.scss */\n.navbar {\n  position: relative;\n  padding: 0.5rem 1rem; }\n  /* line 2, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_clearfix.scss */\n  .navbar::after {\n    content: \"\";\n    display: table;\n    clear: both; }\n  @media (min-width: 576px) {\n    /* line 6, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_navbar.scss */\n    .navbar {\n      border-radius: 0.25rem; } }\n\n/* line 23, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_navbar.scss */\n.navbar-full {\n  z-index: 1000; }\n  @media (min-width: 576px) {\n    /* line 23, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_navbar.scss */\n    .navbar-full {\n      border-radius: 0; } }\n\n/* line 32, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_navbar.scss */\n.navbar-fixed-top,\n.navbar-fixed-bottom {\n  position: fixed;\n  right: 0;\n  left: 0;\n  z-index: 1030; }\n  @media (min-width: 576px) {\n    /* line 32, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_navbar.scss */\n    .navbar-fixed-top,\n    .navbar-fixed-bottom {\n      border-radius: 0; } }\n\n/* line 45, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_navbar.scss */\n.navbar-fixed-top {\n  top: 0; }\n\n/* line 49, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_navbar.scss */\n.navbar-fixed-bottom {\n  bottom: 0; }\n\n/* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_navbar.scss */\n.navbar-sticky-top {\n  position: sticky;\n  top: 0;\n  z-index: 1030;\n  width: 100%; }\n  @media (min-width: 576px) {\n    /* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_navbar.scss */\n    .navbar-sticky-top {\n      border-radius: 0; } }\n\n/* line 70, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_navbar.scss */\n.navbar-brand {\n  float: left;\n  padding-top: 0.25rem;\n  padding-bottom: 0.25rem;\n  margin-right: 1rem;\n  font-size: 1.25rem;\n  line-height: inherit; }\n  /* line 21, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_hover.scss */\n  .navbar-brand:focus, .navbar-brand:hover {\n    text-decoration: none; }\n\n/* line 84, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_navbar.scss */\n.navbar-divider {\n  float: left;\n  width: 1px;\n  padding-top: 0.425rem;\n  padding-bottom: 0.425rem;\n  margin-right: 1rem;\n  margin-left: 1rem;\n  overflow: hidden; }\n  /* line 93, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_navbar.scss */\n  .navbar-divider::before {\n    content: \"\\00a0\"; }\n\n/* line 103, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_navbar.scss */\n.navbar-text {\n  display: inline-block;\n  padding-top: .425rem;\n  padding-bottom: .425rem; }\n\n/* line 115, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_navbar.scss */\n.navbar-toggler {\n  width: 2.5em;\n  height: 2em;\n  padding: 0.5rem 0.75rem;\n  font-size: 1.25rem;\n  line-height: 1;\n  background: transparent no-repeat center center;\n  background-size: 24px 24px;\n  border: 1px solid transparent;\n  border-radius: 0.25rem; }\n  /* line 21, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_hover.scss */\n  .navbar-toggler:focus, .navbar-toggler:hover {\n    text-decoration: none; }\n\n/* line 2, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_clearfix.scss */\n.navbar-toggleable-xs::after {\n  content: \"\";\n  display: table;\n  clear: both; }\n\n@media (max-width: 575px) {\n  /* line 140, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_navbar.scss */\n  .navbar-toggleable-xs .navbar-brand {\n    display: block;\n    float: none;\n    margin-top: .5rem;\n    margin-right: 0; }\n  /* line 147, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_navbar.scss */\n  .navbar-toggleable-xs .navbar-nav {\n    margin-top: .5rem;\n    margin-bottom: .5rem; }\n    /* line 151, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_navbar.scss */\n    .navbar-toggleable-xs .navbar-nav .dropdown-menu {\n      position: static;\n      float: none; } }\n\n@media (min-width: 576px) {\n  /* line 136, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_navbar.scss */\n  .navbar-toggleable-xs {\n    display: block; } }\n\n/* line 2, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_clearfix.scss */\n.navbar-toggleable-sm::after {\n  content: \"\";\n  display: table;\n  clear: both; }\n\n@media (max-width: 767px) {\n  /* line 140, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_navbar.scss */\n  .navbar-toggleable-sm .navbar-brand {\n    display: block;\n    float: none;\n    margin-top: .5rem;\n    margin-right: 0; }\n  /* line 147, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_navbar.scss */\n  .navbar-toggleable-sm .navbar-nav {\n    margin-top: .5rem;\n    margin-bottom: .5rem; }\n    /* line 151, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_navbar.scss */\n    .navbar-toggleable-sm .navbar-nav .dropdown-menu {\n      position: static;\n      float: none; } }\n\n@media (min-width: 768px) {\n  /* line 136, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_navbar.scss */\n  .navbar-toggleable-sm {\n    display: block; } }\n\n/* line 2, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_clearfix.scss */\n.navbar-toggleable-md::after {\n  content: \"\";\n  display: table;\n  clear: both; }\n\n@media (max-width: 991px) {\n  /* line 140, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_navbar.scss */\n  .navbar-toggleable-md .navbar-brand {\n    display: block;\n    float: none;\n    margin-top: .5rem;\n    margin-right: 0; }\n  /* line 147, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_navbar.scss */\n  .navbar-toggleable-md .navbar-nav {\n    margin-top: .5rem;\n    margin-bottom: .5rem; }\n    /* line 151, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_navbar.scss */\n    .navbar-toggleable-md .navbar-nav .dropdown-menu {\n      position: static;\n      float: none; } }\n\n@media (min-width: 992px) {\n  /* line 136, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_navbar.scss */\n  .navbar-toggleable-md {\n    display: block; } }\n\n/* line 2, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_clearfix.scss */\n.navbar-toggleable-lg::after {\n  content: \"\";\n  display: table;\n  clear: both; }\n\n@media (max-width: 1199px) {\n  /* line 140, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_navbar.scss */\n  .navbar-toggleable-lg .navbar-brand {\n    display: block;\n    float: none;\n    margin-top: .5rem;\n    margin-right: 0; }\n  /* line 147, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_navbar.scss */\n  .navbar-toggleable-lg .navbar-nav {\n    margin-top: .5rem;\n    margin-bottom: .5rem; }\n    /* line 151, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_navbar.scss */\n    .navbar-toggleable-lg .navbar-nav .dropdown-menu {\n      position: static;\n      float: none; } }\n\n@media (min-width: 1200px) {\n  /* line 136, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_navbar.scss */\n  .navbar-toggleable-lg {\n    display: block; } }\n\n/* line 136, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_navbar.scss */\n.navbar-toggleable-xl {\n  display: block; }\n  /* line 2, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_clearfix.scss */\n  .navbar-toggleable-xl::after {\n    content: \"\";\n    display: table;\n    clear: both; }\n  /* line 140, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_navbar.scss */\n  .navbar-toggleable-xl .navbar-brand {\n    display: block;\n    float: none;\n    margin-top: .5rem;\n    margin-right: 0; }\n  /* line 147, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_navbar.scss */\n  .navbar-toggleable-xl .navbar-nav {\n    margin-top: .5rem;\n    margin-bottom: .5rem; }\n    /* line 151, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_navbar.scss */\n    .navbar-toggleable-xl .navbar-nav .dropdown-menu {\n      position: static;\n      float: none; }\n\n/* line 172, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_navbar.scss */\n.navbar-nav .nav-item {\n  float: left; }\n\n/* line 176, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_navbar.scss */\n.navbar-nav .nav-link {\n  display: block;\n  padding-top: .425rem;\n  padding-bottom: .425rem; }\n  /* line 181, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_navbar.scss */\n  .navbar-nav .nav-link + .nav-link {\n    margin-left: 1rem; }\n\n/* line 186, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_navbar.scss */\n.navbar-nav .nav-item + .nav-item {\n  margin-left: 1rem; }\n\n/* line 193, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_navbar.scss */\n.navbar-light .navbar-brand,\n.navbar-light .navbar-toggler {\n  color: rgba(0, 0, 0, 0.9); }\n  /* line 21, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_hover.scss */\n  .navbar-light .navbar-brand:focus, .navbar-light .navbar-brand:hover,\n  .navbar-light .navbar-toggler:focus,\n  .navbar-light .navbar-toggler:hover {\n    color: rgba(0, 0, 0, 0.9); }\n\n/* line 203, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_navbar.scss */\n.navbar-light .navbar-nav .nav-link {\n  color: rgba(0, 0, 0, 0.5); }\n  /* line 21, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_hover.scss */\n  .navbar-light .navbar-nav .nav-link:focus, .navbar-light .navbar-nav .nav-link:hover {\n    color: rgba(0, 0, 0, 0.7); }\n\n/* line 37, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_hover.scss */\n.navbar-light .navbar-nav .open > .nav-link, .navbar-light .navbar-nav .open > .nav-link:focus, .navbar-light .navbar-nav .open > .nav-link:hover,\n.navbar-light .navbar-nav .active > .nav-link,\n.navbar-light .navbar-nav .active > .nav-link:focus,\n.navbar-light .navbar-nav .active > .nav-link:hover,\n.navbar-light .navbar-nav .nav-link.open,\n.navbar-light .navbar-nav .nav-link.open:focus,\n.navbar-light .navbar-nav .nav-link.open:hover,\n.navbar-light .navbar-nav .nav-link.active,\n.navbar-light .navbar-nav .nav-link.active:focus,\n.navbar-light .navbar-nav .nav-link.active:hover {\n  color: rgba(0, 0, 0, 0.9); }\n\n/* line 221, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_navbar.scss */\n.navbar-light .navbar-toggler {\n  background-image: url(\"data:image/svg+xml;charset=utf8,%3Csvg viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath stroke='rgba(0, 0, 0, 0.5)' stroke-width='2' stroke-linecap='round' stroke-miterlimit='10' d='M4 8h24M4 16h24M4 24h24'/%3E%3C/svg%3E\");\n  border-color: rgba(0, 0, 0, 0.1); }\n\n/* line 226, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_navbar.scss */\n.navbar-light .navbar-divider {\n  background-color: rgba(0, 0, 0, 0.075); }\n\n/* line 233, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_navbar.scss */\n.navbar-dark .navbar-brand,\n.navbar-dark .navbar-toggler {\n  color: white; }\n  /* line 21, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_hover.scss */\n  .navbar-dark .navbar-brand:focus, .navbar-dark .navbar-brand:hover,\n  .navbar-dark .navbar-toggler:focus,\n  .navbar-dark .navbar-toggler:hover {\n    color: white; }\n\n/* line 243, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_navbar.scss */\n.navbar-dark .navbar-nav .nav-link {\n  color: rgba(255, 255, 255, 0.5); }\n  /* line 21, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_hover.scss */\n  .navbar-dark .navbar-nav .nav-link:focus, .navbar-dark .navbar-nav .nav-link:hover {\n    color: rgba(255, 255, 255, 0.75); }\n\n/* line 37, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_hover.scss */\n.navbar-dark .navbar-nav .open > .nav-link, .navbar-dark .navbar-nav .open > .nav-link:focus, .navbar-dark .navbar-nav .open > .nav-link:hover,\n.navbar-dark .navbar-nav .active > .nav-link,\n.navbar-dark .navbar-nav .active > .nav-link:focus,\n.navbar-dark .navbar-nav .active > .nav-link:hover,\n.navbar-dark .navbar-nav .nav-link.open,\n.navbar-dark .navbar-nav .nav-link.open:focus,\n.navbar-dark .navbar-nav .nav-link.open:hover,\n.navbar-dark .navbar-nav .nav-link.active,\n.navbar-dark .navbar-nav .nav-link.active:focus,\n.navbar-dark .navbar-nav .nav-link.active:hover {\n  color: white; }\n\n/* line 261, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_navbar.scss */\n.navbar-dark .navbar-toggler {\n  background-image: url(\"data:image/svg+xml;charset=utf8,%3Csvg viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath stroke='rgba(255, 255, 255, 0.5)' stroke-width='2' stroke-linecap='round' stroke-miterlimit='10' d='M4 8h24M4 16h24M4 24h24'/%3E%3C/svg%3E\");\n  border-color: rgba(255, 255, 255, 0.1); }\n\n/* line 266, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_navbar.scss */\n.navbar-dark .navbar-divider {\n  background-color: rgba(255, 255, 255, 0.075); }\n\n/* line 2, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_clearfix.scss */\n.navbar-toggleable-xs::after {\n  content: \"\";\n  display: table;\n  clear: both; }\n\n@media (max-width: 575px) {\n  /* line 280, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_navbar.scss */\n  .navbar-toggleable-xs .navbar-nav .nav-item {\n    float: none;\n    margin-left: 0; } }\n\n@media (min-width: 576px) {\n  /* line 277, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_navbar.scss */\n  .navbar-toggleable-xs {\n    display: block !important; } }\n\n/* line 2, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_clearfix.scss */\n.navbar-toggleable-sm::after {\n  content: \"\";\n  display: table;\n  clear: both; }\n\n@media (max-width: 767px) {\n  /* line 293, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_navbar.scss */\n  .navbar-toggleable-sm .navbar-nav .nav-item {\n    float: none;\n    margin-left: 0; } }\n\n@media (min-width: 768px) {\n  /* line 290, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_navbar.scss */\n  .navbar-toggleable-sm {\n    display: block !important; } }\n\n/* line 2, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_clearfix.scss */\n.navbar-toggleable-md::after {\n  content: \"\";\n  display: table;\n  clear: both; }\n\n@media (max-width: 991px) {\n  /* line 306, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_navbar.scss */\n  .navbar-toggleable-md .navbar-nav .nav-item {\n    float: none;\n    margin-left: 0; } }\n\n@media (min-width: 992px) {\n  /* line 303, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_navbar.scss */\n  .navbar-toggleable-md {\n    display: block !important; } }\n\n/* line 5, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_card.scss */\n.card {\n  position: relative;\n  display: block;\n  margin-bottom: 0.75rem;\n  background-color: #fff;\n  border-radius: 0.25rem;\n  border: 1px solid rgba(0, 0, 0, 0.125); }\n\n/* line 15, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_card.scss */\n.card-block {\n  padding: 1.25rem; }\n  /* line 2, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_clearfix.scss */\n  .card-block::after {\n    content: \"\";\n    display: table;\n    clear: both; }\n\n/* line 20, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_card.scss */\n.card-title {\n  margin-bottom: 0.75rem; }\n\n/* line 24, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_card.scss */\n.card-subtitle {\n  margin-top: -0.375rem;\n  margin-bottom: 0; }\n\n/* line 29, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_card.scss */\n.card-text:last-child {\n  margin-bottom: 0; }\n\n/* line 11, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_hover.scss */\n.card-link:hover {\n  text-decoration: none; }\n\n/* line 46, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_card.scss */\n.card-link + .card-link {\n  margin-left: 1.25rem; }\n\n/* line 53, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_card.scss */\n.card > .list-group:first-child .list-group-item:first-child {\n  border-top-right-radius: 0.25rem;\n  border-top-left-radius: 0.25rem; }\n\n/* line 59, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_card.scss */\n.card > .list-group:last-child .list-group-item:last-child {\n  border-bottom-right-radius: 0.25rem;\n  border-bottom-left-radius: 0.25rem; }\n\n/* line 70, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_card.scss */\n.card-header {\n  padding: 0.75rem 1.25rem;\n  margin-bottom: 0;\n  background-color: #f5f5f5;\n  border-bottom: 1px solid rgba(0, 0, 0, 0.125); }\n  /* line 2, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_clearfix.scss */\n  .card-header::after {\n    content: \"\";\n    display: table;\n    clear: both; }\n  /* line 77, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_card.scss */\n  .card-header:first-child {\n    border-radius: calc(0.25rem - 1px) calc(0.25rem - 1px) 0 0; }\n\n/* line 82, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_card.scss */\n.card-footer {\n  padding: 0.75rem 1.25rem;\n  background-color: #f5f5f5;\n  border-top: 1px solid rgba(0, 0, 0, 0.125); }\n  /* line 2, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_clearfix.scss */\n  .card-footer::after {\n    content: \"\";\n    display: table;\n    clear: both; }\n  /* line 88, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_card.scss */\n  .card-footer:last-child {\n    border-radius: 0 0 calc(0.25rem - 1px) calc(0.25rem - 1px); }\n\n/* line 98, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_card.scss */\n.card-header-tabs {\n  margin-right: -0.625rem;\n  margin-bottom: -0.75rem;\n  margin-left: -0.625rem;\n  border-bottom: 0; }\n\n/* line 105, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_card.scss */\n.card-header-pills {\n  margin-right: -0.625rem;\n  margin-left: -0.625rem; }\n\n/* line 115, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_card.scss */\n.card-primary {\n  background-color: #0275d8;\n  border-color: #0275d8; }\n  /* line 7, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_cards.scss */\n  .card-primary .card-header,\n  .card-primary .card-footer {\n    background-color: transparent; }\n\n/* line 118, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_card.scss */\n.card-success {\n  background-color: #5cb85c;\n  border-color: #5cb85c; }\n  /* line 7, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_cards.scss */\n  .card-success .card-header,\n  .card-success .card-footer {\n    background-color: transparent; }\n\n/* line 121, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_card.scss */\n.card-info {\n  background-color: #5bc0de;\n  border-color: #5bc0de; }\n  /* line 7, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_cards.scss */\n  .card-info .card-header,\n  .card-info .card-footer {\n    background-color: transparent; }\n\n/* line 124, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_card.scss */\n.card-warning {\n  background-color: #f0ad4e;\n  border-color: #f0ad4e; }\n  /* line 7, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_cards.scss */\n  .card-warning .card-header,\n  .card-warning .card-footer {\n    background-color: transparent; }\n\n/* line 127, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_card.scss */\n.card-danger {\n  background-color: #d9534f;\n  border-color: #d9534f; }\n  /* line 7, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_cards.scss */\n  .card-danger .card-header,\n  .card-danger .card-footer {\n    background-color: transparent; }\n\n/* line 132, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_card.scss */\n.card-outline-primary {\n  background-color: transparent;\n  border-color: #0275d8; }\n\n/* line 135, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_card.scss */\n.card-outline-secondary {\n  background-color: transparent;\n  border-color: #ccc; }\n\n/* line 138, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_card.scss */\n.card-outline-info {\n  background-color: transparent;\n  border-color: #5bc0de; }\n\n/* line 141, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_card.scss */\n.card-outline-success {\n  background-color: transparent;\n  border-color: #5cb85c; }\n\n/* line 144, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_card.scss */\n.card-outline-warning {\n  background-color: transparent;\n  border-color: #f0ad4e; }\n\n/* line 147, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_card.scss */\n.card-outline-danger {\n  background-color: transparent;\n  border-color: #d9534f; }\n\n/* line 23, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_cards.scss */\n.card-inverse .card-header,\n.card-inverse .card-footer {\n  border-color: rgba(255, 255, 255, 0.2); }\n\n/* line 27, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_cards.scss */\n.card-inverse .card-header,\n.card-inverse .card-footer,\n.card-inverse .card-title,\n.card-inverse .card-blockquote {\n  color: #fff; }\n\n/* line 33, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_cards.scss */\n.card-inverse .card-link,\n.card-inverse .card-text,\n.card-inverse .card-subtitle,\n.card-inverse .card-blockquote .blockquote-footer {\n  color: rgba(255, 255, 255, 0.65); }\n\n/* line 21, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_hover.scss */\n.card-inverse .card-link:focus, .card-inverse .card-link:hover {\n  color: #fff; }\n\n/* line 163, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_card.scss */\n.card-blockquote {\n  padding: 0;\n  margin-bottom: 0;\n  border-left: 0; }\n\n/* line 170, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_card.scss */\n.card-img {\n  border-radius: calc(0.25rem - 1px); }\n\n/* line 174, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_card.scss */\n.card-img-overlay {\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  padding: 1.25rem; }\n\n/* line 186, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_card.scss */\n.card-img-top {\n  border-top-right-radius: calc(0.25rem - 1px);\n  border-top-left-radius: calc(0.25rem - 1px); }\n\n/* line 189, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_card.scss */\n.card-img-bottom {\n  border-bottom-right-radius: calc(0.25rem - 1px);\n  border-bottom-left-radius: calc(0.25rem - 1px); }\n\n@media (min-width: 576px) {\n  /* line 223, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_card.scss */\n  .card-deck {\n    display: table;\n    width: 100%;\n    margin-bottom: 0.75rem;\n    table-layout: fixed;\n    border-spacing: 1.25rem 0; }\n    /* line 230, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_card.scss */\n    .card-deck .card {\n      display: table-cell;\n      margin-bottom: 0;\n      vertical-align: top; }\n  /* line 236, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_card.scss */\n  .card-deck-wrapper {\n    margin-right: -1.25rem;\n    margin-left: -1.25rem; } }\n\n@media (min-width: 576px) {\n  /* line 248, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_card.scss */\n  .card-group {\n    display: table;\n    width: 100%;\n    table-layout: fixed; }\n    /* line 258, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_card.scss */\n    .card-group .card {\n      display: table-cell;\n      vertical-align: top; }\n      /* line 266, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_card.scss */\n      .card-group .card + .card {\n        margin-left: 0;\n        border-left: 0; }\n      /* line 273, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_card.scss */\n      .card-group .card:first-child {\n        border-bottom-right-radius: 0;\n        border-top-right-radius: 0; }\n        /* line 276, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_card.scss */\n        .card-group .card:first-child .card-img-top {\n          border-top-right-radius: 0; }\n        /* line 279, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_card.scss */\n        .card-group .card:first-child .card-img-bottom {\n          border-bottom-right-radius: 0; }\n      /* line 283, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_card.scss */\n      .card-group .card:last-child {\n        border-bottom-left-radius: 0;\n        border-top-left-radius: 0; }\n        /* line 286, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_card.scss */\n        .card-group .card:last-child .card-img-top {\n          border-top-left-radius: 0; }\n        /* line 289, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_card.scss */\n        .card-group .card:last-child .card-img-bottom {\n          border-bottom-left-radius: 0; }\n      /* line 294, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_card.scss */\n      .card-group .card:not(:first-child):not(:last-child) {\n        border-radius: 0; }\n        /* line 297, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_card.scss */\n        .card-group .card:not(:first-child):not(:last-child) .card-img-top,\n        .card-group .card:not(:first-child):not(:last-child) .card-img-bottom {\n          border-radius: 0; } }\n\n@media (min-width: 576px) {\n  /* line 313, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_card.scss */\n  .card-columns {\n    column-count: 3;\n    column-gap: 1.25rem; }\n    /* line 317, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_card.scss */\n    .card-columns .card {\n      display: inline-block;\n      width: 100%; } }\n\n/* line 1, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_breadcrumb.scss */\n.breadcrumb {\n  padding: 0.75rem 1rem;\n  margin-bottom: 1rem;\n  list-style: none;\n  background-color: #eceeef;\n  border-radius: 0.25rem; }\n  /* line 2, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_clearfix.scss */\n  .breadcrumb::after {\n    content: \"\";\n    display: table;\n    clear: both; }\n\n/* line 10, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_breadcrumb.scss */\n.breadcrumb-item {\n  float: left; }\n  /* line 14, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_breadcrumb.scss */\n  .breadcrumb-item + .breadcrumb-item::before {\n    display: inline-block;\n    padding-right: 0.5rem;\n    padding-left: 0.5rem;\n    color: #818a91;\n    content: \"/\"; }\n  /* line 28, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_breadcrumb.scss */\n  .breadcrumb-item + .breadcrumb-item:hover::before {\n    text-decoration: underline; }\n  /* line 31, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_breadcrumb.scss */\n  .breadcrumb-item + .breadcrumb-item:hover::before {\n    text-decoration: none; }\n  /* line 35, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_breadcrumb.scss */\n  .breadcrumb-item.active {\n    color: #818a91; }\n\n/* line 1, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_pagination.scss */\n.pagination {\n  display: inline-block;\n  padding-left: 0;\n  margin-top: 1rem;\n  margin-bottom: 1rem;\n  border-radius: 0.25rem; }\n\n/* line 9, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_pagination.scss */\n.page-item {\n  display: inline; }\n  /* line 13, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_pagination.scss */\n  .page-item:first-child .page-link {\n    margin-left: 0;\n    border-bottom-left-radius: 0.25rem;\n    border-top-left-radius: 0.25rem; }\n  /* line 19, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_pagination.scss */\n  .page-item:last-child .page-link {\n    border-bottom-right-radius: 0.25rem;\n    border-top-right-radius: 0.25rem; }\n  /* line 37, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_hover.scss */\n  .page-item.active .page-link, .page-item.active .page-link:focus, .page-item.active .page-link:hover {\n    z-index: 2;\n    color: #fff;\n    cursor: default;\n    background-color: #0275d8;\n    border-color: #0275d8; }\n  /* line 37, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_hover.scss */\n  .page-item.disabled .page-link, .page-item.disabled .page-link:focus, .page-item.disabled .page-link:hover {\n    color: #818a91;\n    pointer-events: none;\n    cursor: not-allowed;\n    background-color: #fff;\n    border-color: #ddd; }\n\n/* line 45, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_pagination.scss */\n.page-link {\n  position: relative;\n  float: left;\n  padding: 0.5rem 0.75rem;\n  margin-left: -1px;\n  color: #0275d8;\n  text-decoration: none;\n  background-color: #fff;\n  border: 1px solid #ddd; }\n  /* line 21, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_hover.scss */\n  .page-link:focus, .page-link:hover {\n    color: #014c8c;\n    background-color: #eceeef;\n    border-color: #ddd; }\n\n/* line 4, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_pagination.scss */\n.pagination-lg .page-link {\n  padding: 0.75rem 1.5rem;\n  font-size: 1.25rem; }\n\n/* line 11, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_pagination.scss */\n.pagination-lg .page-item:first-child .page-link {\n  border-bottom-left-radius: 0.3rem;\n  border-top-left-radius: 0.3rem; }\n\n/* line 16, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_pagination.scss */\n.pagination-lg .page-item:last-child .page-link {\n  border-bottom-right-radius: 0.3rem;\n  border-top-right-radius: 0.3rem; }\n\n/* line 4, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_pagination.scss */\n.pagination-sm .page-link {\n  padding: 0.275rem 0.75rem;\n  font-size: 0.875rem; }\n\n/* line 11, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_pagination.scss */\n.pagination-sm .page-item:first-child .page-link {\n  border-bottom-left-radius: 0.2rem;\n  border-top-left-radius: 0.2rem; }\n\n/* line 16, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_pagination.scss */\n.pagination-sm .page-item:last-child .page-link {\n  border-bottom-right-radius: 0.2rem;\n  border-top-right-radius: 0.2rem; }\n\n/* line 6, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_tags.scss */\n.tag {\n  display: inline-block;\n  padding: 0.25em 0.4em;\n  font-size: 75%;\n  font-weight: bold;\n  line-height: 1;\n  color: #fff;\n  text-align: center;\n  white-space: nowrap;\n  vertical-align: baseline;\n  border-radius: 0.25rem; }\n  /* line 19, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_tags.scss */\n  .tag:empty {\n    display: none; }\n\n/* line 25, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_tags.scss */\n.btn .tag {\n  position: relative;\n  top: -1px; }\n\n/* line 21, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_hover.scss */\na.tag:focus, a.tag:hover {\n  color: #fff;\n  text-decoration: none;\n  cursor: pointer; }\n\n/* line 45, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_tags.scss */\n.tag-pill {\n  padding-right: 0.6em;\n  padding-left: 0.6em;\n  border-radius: 10rem; }\n\n/* line 55, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_tags.scss */\n.tag-default {\n  background-color: #818a91; }\n  /* line 21, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_hover.scss */\n  .tag-default[href]:focus, .tag-default[href]:hover {\n    background-color: #687077; }\n\n/* line 59, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_tags.scss */\n.tag-primary {\n  background-color: #0275d8; }\n  /* line 21, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_hover.scss */\n  .tag-primary[href]:focus, .tag-primary[href]:hover {\n    background-color: #025aa5; }\n\n/* line 63, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_tags.scss */\n.tag-success {\n  background-color: #5cb85c; }\n  /* line 21, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_hover.scss */\n  .tag-success[href]:focus, .tag-success[href]:hover {\n    background-color: #449d44; }\n\n/* line 67, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_tags.scss */\n.tag-info {\n  background-color: #5bc0de; }\n  /* line 21, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_hover.scss */\n  .tag-info[href]:focus, .tag-info[href]:hover {\n    background-color: #31b0d5; }\n\n/* line 71, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_tags.scss */\n.tag-warning {\n  background-color: #f0ad4e; }\n  /* line 21, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_hover.scss */\n  .tag-warning[href]:focus, .tag-warning[href]:hover {\n    background-color: #ec971f; }\n\n/* line 75, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_tags.scss */\n.tag-danger {\n  background-color: #d9534f; }\n  /* line 21, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_hover.scss */\n  .tag-danger[href]:focus, .tag-danger[href]:hover {\n    background-color: #c9302c; }\n\n/* line 1, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_jumbotron.scss */\n.jumbotron {\n  padding: 2rem 1rem;\n  margin-bottom: 2rem;\n  background-color: #eceeef;\n  border-radius: 0.3rem; }\n  @media (min-width: 576px) {\n    /* line 1, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_jumbotron.scss */\n    .jumbotron {\n      padding: 4rem 2rem; } }\n\n/* line 12, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_jumbotron.scss */\n.jumbotron-hr {\n  border-top-color: #d0d5d8; }\n\n/* line 16, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_jumbotron.scss */\n.jumbotron-fluid {\n  padding-right: 0;\n  padding-left: 0;\n  border-radius: 0; }\n\n/* line 5, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_alert.scss */\n.alert {\n  padding: 0.75rem 1.25rem;\n  margin-bottom: 1rem;\n  border: 1px solid transparent;\n  border-radius: 0.25rem; }\n\n/* line 13, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_alert.scss */\n.alert-heading {\n  color: inherit; }\n\n/* line 19, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_alert.scss */\n.alert-link {\n  font-weight: bold; }\n\n/* line 28, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_alert.scss */\n.alert-dismissible {\n  padding-right: 2.5rem; }\n  /* line 32, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_alert.scss */\n  .alert-dismissible .close {\n    position: relative;\n    top: -.125rem;\n    right: -1.25rem;\n    color: inherit; }\n\n/* line 45, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_alert.scss */\n.alert-success {\n  background-color: #dff0d8;\n  border-color: #d0e9c6;\n  color: #3c763d; }\n  /* line 8, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_alert.scss */\n  .alert-success hr {\n    border-top-color: #c1e2b3; }\n  /* line 11, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_alert.scss */\n  .alert-success .alert-link {\n    color: #2b542c; }\n\n/* line 48, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_alert.scss */\n.alert-info {\n  background-color: #d9edf7;\n  border-color: #bcdff1;\n  color: #31708f; }\n  /* line 8, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_alert.scss */\n  .alert-info hr {\n    border-top-color: #a6d5ec; }\n  /* line 11, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_alert.scss */\n  .alert-info .alert-link {\n    color: #245269; }\n\n/* line 51, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_alert.scss */\n.alert-warning {\n  background-color: #fcf8e3;\n  border-color: #faf2cc;\n  color: #8a6d3b; }\n  /* line 8, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_alert.scss */\n  .alert-warning hr {\n    border-top-color: #f7ecb5; }\n  /* line 11, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_alert.scss */\n  .alert-warning .alert-link {\n    color: #66512c; }\n\n/* line 54, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_alert.scss */\n.alert-danger {\n  background-color: #f2dede;\n  border-color: #ebcccc;\n  color: #a94442; }\n  /* line 8, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_alert.scss */\n  .alert-danger hr {\n    border-top-color: #e4b9b9; }\n  /* line 11, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_alert.scss */\n  .alert-danger .alert-link {\n    color: #843534; }\n\n@keyframes progress-bar-stripes {\n  from {\n    background-position: 1rem 0; }\n  to {\n    background-position: 0 0; } }\n\n/* line 15, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_progress.scss */\n.progress {\n  display: block;\n  width: 100%;\n  height: 1rem;\n  margin-bottom: 1rem; }\n\n/* line 21, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_progress.scss */\n.progress[value] {\n  background-color: #eee;\n  border: 0;\n  appearance: none;\n  border-radius: 0.25rem; }\n\n/* line 33, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_progress.scss */\n.progress[value]::-ms-fill {\n  background-color: #0074d9;\n  border: 0; }\n\n/* line 38, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_progress.scss */\n.progress[value]::-moz-progress-bar {\n  background-color: #0074d9;\n  border-bottom-left-radius: 0.25rem;\n  border-top-left-radius: 0.25rem; }\n\n/* line 42, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_progress.scss */\n.progress[value]::-webkit-progress-value {\n  background-color: #0074d9;\n  border-bottom-left-radius: 0.25rem;\n  border-top-left-radius: 0.25rem; }\n\n/* line 47, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_progress.scss */\n.progress[value=\"100\"]::-moz-progress-bar {\n  border-bottom-right-radius: 0.25rem;\n  border-top-right-radius: 0.25rem; }\n\n/* line 50, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_progress.scss */\n.progress[value=\"100\"]::-webkit-progress-value {\n  border-bottom-right-radius: 0.25rem;\n  border-top-right-radius: 0.25rem; }\n\n/* line 55, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_progress.scss */\n.progress[value]::-webkit-progress-bar {\n  background-color: #eee;\n  border-radius: 0.25rem; }\n\n/* line 60, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_progress.scss */\nbase::-moz-progress-bar,\n.progress[value] {\n  background-color: #eee;\n  border-radius: 0.25rem; }\n\n@media screen and (min-width: 0\\0) {\n  /* line 69, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_progress.scss */\n  .progress {\n    background-color: #eee;\n    border-radius: 0.25rem; }\n  /* line 74, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_progress.scss */\n  .progress-bar {\n    display: inline-block;\n    height: 1rem;\n    text-indent: -999rem;\n    background-color: #0074d9;\n    border-bottom-left-radius: 0.25rem;\n    border-top-left-radius: 0.25rem; }\n  /* line 81, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_progress.scss */\n  .progress[width=\"100%\"] {\n    border-bottom-right-radius: 0.25rem;\n    border-top-right-radius: 0.25rem; } }\n\n/* line 91, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_progress.scss */\n.progress-striped[value]::-webkit-progress-value {\n  background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);\n  background-size: 1rem 1rem; }\n\n/* line 95, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_progress.scss */\n.progress-striped[value]::-moz-progress-bar {\n  background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);\n  background-size: 1rem 1rem; }\n\n/* line 99, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_progress.scss */\n.progress-striped[value]::-ms-fill {\n  background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);\n  background-size: 1rem 1rem; }\n\n@media screen and (min-width: 0\\0) {\n  /* line 105, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_progress.scss */\n  .progress-bar-striped {\n    background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);\n    background-size: 1rem 1rem; } }\n\n/* line 116, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_progress.scss */\n.progress-animated[value]::-webkit-progress-value {\n  animation: progress-bar-stripes 2s linear infinite; }\n\n/* line 119, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_progress.scss */\n.progress-animated[value]::-moz-progress-bar {\n  animation: progress-bar-stripes 2s linear infinite; }\n\n@media screen and (min-width: 0\\0) {\n  /* line 124, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_progress.scss */\n  .progress-animated .progress-bar-striped {\n    animation: progress-bar-stripes 2s linear infinite; } }\n\n/* line 4, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_progress.scss */\n.progress-success[value]::-webkit-progress-value {\n  background-color: #5cb85c; }\n\n/* line 8, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_progress.scss */\n.progress-success[value]::-moz-progress-bar {\n  background-color: #5cb85c; }\n\n/* line 13, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_progress.scss */\n.progress-success[value]::-ms-fill {\n  background-color: #5cb85c; }\n\n@media screen and (min-width: 0\\0) {\n  /* line 19, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_progress.scss */\n  .progress-success .progress-bar {\n    background-color: #5cb85c; } }\n\n/* line 4, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_progress.scss */\n.progress-info[value]::-webkit-progress-value {\n  background-color: #5bc0de; }\n\n/* line 8, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_progress.scss */\n.progress-info[value]::-moz-progress-bar {\n  background-color: #5bc0de; }\n\n/* line 13, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_progress.scss */\n.progress-info[value]::-ms-fill {\n  background-color: #5bc0de; }\n\n@media screen and (min-width: 0\\0) {\n  /* line 19, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_progress.scss */\n  .progress-info .progress-bar {\n    background-color: #5bc0de; } }\n\n/* line 4, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_progress.scss */\n.progress-warning[value]::-webkit-progress-value {\n  background-color: #f0ad4e; }\n\n/* line 8, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_progress.scss */\n.progress-warning[value]::-moz-progress-bar {\n  background-color: #f0ad4e; }\n\n/* line 13, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_progress.scss */\n.progress-warning[value]::-ms-fill {\n  background-color: #f0ad4e; }\n\n@media screen and (min-width: 0\\0) {\n  /* line 19, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_progress.scss */\n  .progress-warning .progress-bar {\n    background-color: #f0ad4e; } }\n\n/* line 4, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_progress.scss */\n.progress-danger[value]::-webkit-progress-value {\n  background-color: #d9534f; }\n\n/* line 8, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_progress.scss */\n.progress-danger[value]::-moz-progress-bar {\n  background-color: #d9534f; }\n\n/* line 13, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_progress.scss */\n.progress-danger[value]::-ms-fill {\n  background-color: #d9534f; }\n\n@media screen and (min-width: 0\\0) {\n  /* line 19, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_progress.scss */\n  .progress-danger .progress-bar {\n    background-color: #d9534f; } }\n\n/* line 15, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_media.scss */\n.media,\n.media-body {\n  overflow: hidden; }\n\n/* line 19, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_media.scss */\n.media-body {\n  width: 10000px; }\n\n/* line 22, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_media.scss */\n.media-left,\n.media-right,\n.media-body {\n  display: table-cell;\n  vertical-align: top; }\n\n/* line 28, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_media.scss */\n.media-middle {\n  vertical-align: middle; }\n\n/* line 31, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_media.scss */\n.media-bottom {\n  vertical-align: bottom; }\n\n/* line 41, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_media.scss */\n.media-object {\n  display: block; }\n  /* line 45, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_media.scss */\n  .media-object.img-thumbnail {\n    max-width: none; }\n\n/* line 55, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_media.scss */\n.media-right {\n  padding-left: 10px; }\n\n/* line 59, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_media.scss */\n.media-left {\n  padding-right: 10px; }\n\n/* line 68, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_media.scss */\n.media-heading {\n  margin-top: 0;\n  margin-bottom: 5px; }\n\n/* line 78, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_media.scss */\n.media-list {\n  padding-left: 0;\n  list-style: none; }\n\n/* line 5, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_list-group.scss */\n.list-group {\n  padding-left: 0;\n  margin-bottom: 0; }\n\n/* line 16, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_list-group.scss */\n.list-group-item {\n  position: relative;\n  display: block;\n  padding: 0.75rem 1.25rem;\n  margin-bottom: -1px;\n  background-color: #fff;\n  border: 1px solid #ddd; }\n  /* line 25, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_list-group.scss */\n  .list-group-item:first-child {\n    border-top-right-radius: 0.25rem;\n    border-top-left-radius: 0.25rem; }\n  /* line 29, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_list-group.scss */\n  .list-group-item:last-child {\n    margin-bottom: 0;\n    border-bottom-right-radius: 0.25rem;\n    border-bottom-left-radius: 0.25rem; }\n  /* line 37, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_hover.scss */\n  .list-group-item.disabled, .list-group-item.disabled:focus, .list-group-item.disabled:hover {\n    color: #818a91;\n    cursor: not-allowed;\n    background-color: #eceeef; }\n    /* line 41, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_list-group.scss */\n    .list-group-item.disabled .list-group-item-heading, .list-group-item.disabled:focus .list-group-item-heading, .list-group-item.disabled:hover .list-group-item-heading {\n      color: inherit; }\n    /* line 44, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_list-group.scss */\n    .list-group-item.disabled .list-group-item-text, .list-group-item.disabled:focus .list-group-item-text, .list-group-item.disabled:hover .list-group-item-text {\n      color: #818a91; }\n  /* line 37, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_hover.scss */\n  .list-group-item.active, .list-group-item.active:focus, .list-group-item.active:hover {\n    z-index: 2;\n    color: #fff;\n    text-decoration: none;\n    background-color: #0275d8;\n    border-color: #0275d8; }\n    /* line 59, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_list-group.scss */\n    .list-group-item.active .list-group-item-heading,\n    .list-group-item.active .list-group-item-heading > small,\n    .list-group-item.active .list-group-item-heading > .small, .list-group-item.active:focus .list-group-item-heading,\n    .list-group-item.active:focus .list-group-item-heading > small,\n    .list-group-item.active:focus .list-group-item-heading > .small, .list-group-item.active:hover .list-group-item-heading,\n    .list-group-item.active:hover .list-group-item-heading > small,\n    .list-group-item.active:hover .list-group-item-heading > .small {\n      color: inherit; }\n    /* line 64, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_list-group.scss */\n    .list-group-item.active .list-group-item-text, .list-group-item.active:focus .list-group-item-text, .list-group-item.active:hover .list-group-item-text {\n      color: #a8d6fe; }\n\n/* line 72, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_list-group.scss */\n.list-group-flush .list-group-item {\n  border-right: 0;\n  border-left: 0;\n  border-radius: 0; }\n\n/* line 85, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_list-group.scss */\n.list-group-item-action {\n  width: 100%;\n  color: #555;\n  text-align: inherit; }\n  /* line 90, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_list-group.scss */\n  .list-group-item-action .list-group-item-heading {\n    color: #333; }\n  /* line 21, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_hover.scss */\n  .list-group-item-action:focus, .list-group-item-action:hover {\n    color: #555;\n    text-decoration: none;\n    background-color: #f5f5f5; }\n\n/* line 4, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_list-group.scss */\n.list-group-item-success {\n  color: #3c763d;\n  background-color: #dff0d8; }\n\n/* line 9, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_list-group.scss */\na.list-group-item-success,\nbutton.list-group-item-success {\n  color: #3c763d; }\n  /* line 12, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_list-group.scss */\n  a.list-group-item-success .list-group-item-heading,\n  button.list-group-item-success .list-group-item-heading {\n    color: inherit; }\n  /* line 21, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_hover.scss */\n  a.list-group-item-success:focus, a.list-group-item-success:hover,\n  button.list-group-item-success:focus,\n  button.list-group-item-success:hover {\n    color: #3c763d;\n    background-color: #d0e9c6; }\n  /* line 37, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_hover.scss */\n  a.list-group-item-success.active, a.list-group-item-success.active:focus, a.list-group-item-success.active:hover,\n  button.list-group-item-success.active,\n  button.list-group-item-success.active:focus,\n  button.list-group-item-success.active:hover {\n    color: #fff;\n    background-color: #3c763d;\n    border-color: #3c763d; }\n\n/* line 4, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_list-group.scss */\n.list-group-item-info {\n  color: #31708f;\n  background-color: #d9edf7; }\n\n/* line 9, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_list-group.scss */\na.list-group-item-info,\nbutton.list-group-item-info {\n  color: #31708f; }\n  /* line 12, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_list-group.scss */\n  a.list-group-item-info .list-group-item-heading,\n  button.list-group-item-info .list-group-item-heading {\n    color: inherit; }\n  /* line 21, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_hover.scss */\n  a.list-group-item-info:focus, a.list-group-item-info:hover,\n  button.list-group-item-info:focus,\n  button.list-group-item-info:hover {\n    color: #31708f;\n    background-color: #c4e3f3; }\n  /* line 37, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_hover.scss */\n  a.list-group-item-info.active, a.list-group-item-info.active:focus, a.list-group-item-info.active:hover,\n  button.list-group-item-info.active,\n  button.list-group-item-info.active:focus,\n  button.list-group-item-info.active:hover {\n    color: #fff;\n    background-color: #31708f;\n    border-color: #31708f; }\n\n/* line 4, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_list-group.scss */\n.list-group-item-warning {\n  color: #8a6d3b;\n  background-color: #fcf8e3; }\n\n/* line 9, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_list-group.scss */\na.list-group-item-warning,\nbutton.list-group-item-warning {\n  color: #8a6d3b; }\n  /* line 12, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_list-group.scss */\n  a.list-group-item-warning .list-group-item-heading,\n  button.list-group-item-warning .list-group-item-heading {\n    color: inherit; }\n  /* line 21, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_hover.scss */\n  a.list-group-item-warning:focus, a.list-group-item-warning:hover,\n  button.list-group-item-warning:focus,\n  button.list-group-item-warning:hover {\n    color: #8a6d3b;\n    background-color: #faf2cc; }\n  /* line 37, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_hover.scss */\n  a.list-group-item-warning.active, a.list-group-item-warning.active:focus, a.list-group-item-warning.active:hover,\n  button.list-group-item-warning.active,\n  button.list-group-item-warning.active:focus,\n  button.list-group-item-warning.active:hover {\n    color: #fff;\n    background-color: #8a6d3b;\n    border-color: #8a6d3b; }\n\n/* line 4, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_list-group.scss */\n.list-group-item-danger {\n  color: #a94442;\n  background-color: #f2dede; }\n\n/* line 9, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_list-group.scss */\na.list-group-item-danger,\nbutton.list-group-item-danger {\n  color: #a94442; }\n  /* line 12, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_list-group.scss */\n  a.list-group-item-danger .list-group-item-heading,\n  button.list-group-item-danger .list-group-item-heading {\n    color: inherit; }\n  /* line 21, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_hover.scss */\n  a.list-group-item-danger:focus, a.list-group-item-danger:hover,\n  button.list-group-item-danger:focus,\n  button.list-group-item-danger:hover {\n    color: #a94442;\n    background-color: #ebcccc; }\n  /* line 37, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_hover.scss */\n  a.list-group-item-danger.active, a.list-group-item-danger.active:focus, a.list-group-item-danger.active:hover,\n  button.list-group-item-danger.active,\n  button.list-group-item-danger.active:focus,\n  button.list-group-item-danger.active:hover {\n    color: #fff;\n    background-color: #a94442;\n    border-color: #a94442; }\n\n/* line 118, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_list-group.scss */\n.list-group-item-heading {\n  margin-top: 0;\n  margin-bottom: 5px; }\n\n/* line 122, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_list-group.scss */\n.list-group-item-text {\n  margin-bottom: 0;\n  line-height: 1.3; }\n\n/* line 3, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_responsive-embed.scss */\n.embed-responsive {\n  position: relative;\n  display: block;\n  height: 0;\n  padding: 0;\n  overflow: hidden; }\n  /* line 10, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_responsive-embed.scss */\n  .embed-responsive .embed-responsive-item,\n  .embed-responsive iframe,\n  .embed-responsive embed,\n  .embed-responsive object,\n  .embed-responsive video {\n    position: absolute;\n    top: 0;\n    bottom: 0;\n    left: 0;\n    width: 100%;\n    height: 100%;\n    border: 0; }\n\n/* line 25, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_responsive-embed.scss */\n.embed-responsive-21by9 {\n  padding-bottom: 42.85714%; }\n\n/* line 29, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_responsive-embed.scss */\n.embed-responsive-16by9 {\n  padding-bottom: 56.25%; }\n\n/* line 33, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_responsive-embed.scss */\n.embed-responsive-4by3 {\n  padding-bottom: 75%; }\n\n/* line 37, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_responsive-embed.scss */\n.embed-responsive-1by1 {\n  padding-bottom: 100%; }\n\n/* line 1, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_close.scss */\n.close {\n  float: right;\n  font-size: 1.5rem;\n  font-weight: bold;\n  line-height: 1;\n  color: #000;\n  text-shadow: 0 1px 0 #fff;\n  opacity: .2; }\n  /* line 21, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_hover.scss */\n  .close:focus, .close:hover {\n    color: #000;\n    text-decoration: none;\n    cursor: pointer;\n    opacity: .5; }\n\n/* line 24, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_close.scss */\nbutton.close {\n  padding: 0;\n  cursor: pointer;\n  background: transparent;\n  border: 0;\n  -webkit-appearance: none; }\n\n/* line 8, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_modal.scss */\n.modal-open {\n  overflow: hidden; }\n\n/* line 13, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_modal.scss */\n.modal {\n  position: fixed;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  z-index: 1050;\n  display: none;\n  overflow: hidden;\n  outline: 0; }\n  /* line 30, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_modal.scss */\n  .modal.fade .modal-dialog {\n    transition: transform .3s ease-out;\n    transform: translate(0, -25%); }\n  /* line 34, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_modal.scss */\n  .modal.in .modal-dialog {\n    transform: translate(0, 0); }\n\n/* line 36, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_modal.scss */\n.modal-open .modal {\n  overflow-x: hidden;\n  overflow-y: auto; }\n\n/* line 42, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_modal.scss */\n.modal-dialog {\n  position: relative;\n  width: auto;\n  margin: 10px; }\n\n/* line 49, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_modal.scss */\n.modal-content {\n  position: relative;\n  background-color: #fff;\n  background-clip: padding-box;\n  border: 1px solid rgba(0, 0, 0, 0.2);\n  border-radius: 0.3rem;\n  outline: 0; }\n\n/* line 61, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_modal.scss */\n.modal-backdrop {\n  position: fixed;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  z-index: 1040;\n  background-color: #000; }\n  /* line 71, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_modal.scss */\n  .modal-backdrop.fade {\n    opacity: 0; }\n  /* line 72, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_modal.scss */\n  .modal-backdrop.in {\n    opacity: 0.5; }\n\n/* line 77, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_modal.scss */\n.modal-header {\n  padding: 15px;\n  border-bottom: 1px solid #e5e5e5; }\n  /* line 2, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_clearfix.scss */\n  .modal-header::after {\n    content: \"\";\n    display: table;\n    clear: both; }\n\n/* line 83, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_modal.scss */\n.modal-header .close {\n  margin-top: -2px; }\n\n/* line 88, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_modal.scss */\n.modal-title {\n  margin: 0;\n  line-height: 1.5; }\n\n/* line 95, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_modal.scss */\n.modal-body {\n  position: relative;\n  padding: 15px; }\n\n/* line 101, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_modal.scss */\n.modal-footer {\n  padding: 15px;\n  text-align: right;\n  border-top: 1px solid #e5e5e5; }\n  /* line 2, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_clearfix.scss */\n  .modal-footer::after {\n    content: \"\";\n    display: table;\n    clear: both; }\n\n/* line 109, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_modal.scss */\n.modal-scrollbar-measure {\n  position: absolute;\n  top: -9999px;\n  width: 50px;\n  height: 50px;\n  overflow: scroll; }\n\n@media (min-width: 576px) {\n  /* line 120, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_modal.scss */\n  .modal-dialog {\n    max-width: 600px;\n    margin: 30px auto; }\n  /* line 129, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_modal.scss */\n  .modal-sm {\n    max-width: 300px; } }\n\n@media (min-width: 992px) {\n  /* line 133, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_modal.scss */\n  .modal-lg {\n    max-width: 900px; } }\n\n/* line 2, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_tooltip.scss */\n.tooltip {\n  position: absolute;\n  z-index: 1070;\n  display: block;\n  font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif;\n  font-style: normal;\n  font-weight: normal;\n  letter-spacing: normal;\n  line-break: auto;\n  line-height: 1.5;\n  text-align: left;\n  text-align: start;\n  text-decoration: none;\n  text-shadow: none;\n  text-transform: none;\n  white-space: normal;\n  word-break: normal;\n  word-spacing: normal;\n  font-size: 0.875rem;\n  word-wrap: break-word;\n  opacity: 0; }\n  /* line 14, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_tooltip.scss */\n  .tooltip.in {\n    opacity: 0.9; }\n  /* line 16, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_tooltip.scss */\n  .tooltip.tooltip-top, .tooltip.bs-tether-element-attached-bottom {\n    padding: 5px 0;\n    margin-top: -3px; }\n    /* line 21, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_tooltip.scss */\n    .tooltip.tooltip-top .tooltip-inner::before, .tooltip.bs-tether-element-attached-bottom .tooltip-inner::before {\n      bottom: 0;\n      left: 50%;\n      margin-left: -5px;\n      content: \"\";\n      border-width: 5px 5px 0;\n      border-top-color: #000; }\n  /* line 30, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_tooltip.scss */\n  .tooltip.tooltip-right, .tooltip.bs-tether-element-attached-left {\n    padding: 0 5px;\n    margin-left: 3px; }\n    /* line 35, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_tooltip.scss */\n    .tooltip.tooltip-right .tooltip-inner::before, .tooltip.bs-tether-element-attached-left .tooltip-inner::before {\n      top: 50%;\n      left: 0;\n      margin-top: -5px;\n      content: \"\";\n      border-width: 5px 5px 5px 0;\n      border-right-color: #000; }\n  /* line 44, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_tooltip.scss */\n  .tooltip.tooltip-bottom, .tooltip.bs-tether-element-attached-top {\n    padding: 5px 0;\n    margin-top: 3px; }\n    /* line 49, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_tooltip.scss */\n    .tooltip.tooltip-bottom .tooltip-inner::before, .tooltip.bs-tether-element-attached-top .tooltip-inner::before {\n      top: 0;\n      left: 50%;\n      margin-left: -5px;\n      content: \"\";\n      border-width: 0 5px 5px;\n      border-bottom-color: #000; }\n  /* line 58, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_tooltip.scss */\n  .tooltip.tooltip-left, .tooltip.bs-tether-element-attached-right {\n    padding: 0 5px;\n    margin-left: -3px; }\n    /* line 63, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_tooltip.scss */\n    .tooltip.tooltip-left .tooltip-inner::before, .tooltip.bs-tether-element-attached-right .tooltip-inner::before {\n      top: 50%;\n      right: 0;\n      margin-top: -5px;\n      content: \"\";\n      border-width: 5px 0 5px 5px;\n      border-left-color: #000; }\n\n/* line 75, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_tooltip.scss */\n.tooltip-inner {\n  max-width: 200px;\n  padding: 3px 8px;\n  color: #fff;\n  text-align: center;\n  background-color: #000;\n  border-radius: 0.25rem; }\n  /* line 83, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_tooltip.scss */\n  .tooltip-inner::before {\n    position: absolute;\n    width: 0;\n    height: 0;\n    border-color: transparent;\n    border-style: solid; }\n\n/* line 1, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_popover.scss */\n.popover {\n  position: absolute;\n  top: 0;\n  left: 0;\n  z-index: 1060;\n  display: block;\n  max-width: 276px;\n  padding: 1px;\n  font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif;\n  font-style: normal;\n  font-weight: normal;\n  letter-spacing: normal;\n  line-break: auto;\n  line-height: 1.5;\n  text-align: left;\n  text-align: start;\n  text-decoration: none;\n  text-shadow: none;\n  text-transform: none;\n  white-space: normal;\n  word-break: normal;\n  word-spacing: normal;\n  font-size: 0.875rem;\n  word-wrap: break-word;\n  background-color: #fff;\n  background-clip: padding-box;\n  border: 1px solid rgba(0, 0, 0, 0.2);\n  border-radius: 0.3rem; }\n  /* line 24, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_popover.scss */\n  .popover.popover-top, .popover.bs-tether-element-attached-bottom {\n    margin-top: -10px; }\n    /* line 28, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_popover.scss */\n    .popover.popover-top::before, .popover.popover-top::after, .popover.bs-tether-element-attached-bottom::before, .popover.bs-tether-element-attached-bottom::after {\n      left: 50%;\n      border-bottom-width: 0; }\n    /* line 34, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_popover.scss */\n    .popover.popover-top::before, .popover.bs-tether-element-attached-bottom::before {\n      bottom: -11px;\n      margin-left: -11px;\n      border-top-color: rgba(0, 0, 0, 0.25); }\n    /* line 40, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_popover.scss */\n    .popover.popover-top::after, .popover.bs-tether-element-attached-bottom::after {\n      bottom: -10px;\n      margin-left: -10px;\n      border-top-color: #fff; }\n  /* line 47, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_popover.scss */\n  .popover.popover-right, .popover.bs-tether-element-attached-left {\n    margin-left: 10px; }\n    /* line 51, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_popover.scss */\n    .popover.popover-right::before, .popover.popover-right::after, .popover.bs-tether-element-attached-left::before, .popover.bs-tether-element-attached-left::after {\n      top: 50%;\n      border-left-width: 0; }\n    /* line 57, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_popover.scss */\n    .popover.popover-right::before, .popover.bs-tether-element-attached-left::before {\n      left: -11px;\n      margin-top: -11px;\n      border-right-color: rgba(0, 0, 0, 0.25); }\n    /* line 63, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_popover.scss */\n    .popover.popover-right::after, .popover.bs-tether-element-attached-left::after {\n      left: -10px;\n      margin-top: -10px;\n      border-right-color: #fff; }\n  /* line 70, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_popover.scss */\n  .popover.popover-bottom, .popover.bs-tether-element-attached-top {\n    margin-top: 10px; }\n    /* line 74, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_popover.scss */\n    .popover.popover-bottom::before, .popover.popover-bottom::after, .popover.bs-tether-element-attached-top::before, .popover.bs-tether-element-attached-top::after {\n      left: 50%;\n      border-top-width: 0; }\n    /* line 80, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_popover.scss */\n    .popover.popover-bottom::before, .popover.bs-tether-element-attached-top::before {\n      top: -11px;\n      margin-left: -11px;\n      border-bottom-color: rgba(0, 0, 0, 0.25); }\n    /* line 86, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_popover.scss */\n    .popover.popover-bottom::after, .popover.bs-tether-element-attached-top::after {\n      top: -10px;\n      margin-left: -10px;\n      border-bottom-color: #f7f7f7; }\n    /* line 93, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_popover.scss */\n    .popover.popover-bottom .popover-title::before, .popover.bs-tether-element-attached-top .popover-title::before {\n      position: absolute;\n      top: 0;\n      left: 50%;\n      display: block;\n      width: 20px;\n      margin-left: -10px;\n      content: \"\";\n      border-bottom: 1px solid #f7f7f7; }\n  /* line 105, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_popover.scss */\n  .popover.popover-left, .popover.bs-tether-element-attached-right {\n    margin-left: -10px; }\n    /* line 109, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_popover.scss */\n    .popover.popover-left::before, .popover.popover-left::after, .popover.bs-tether-element-attached-right::before, .popover.bs-tether-element-attached-right::after {\n      top: 50%;\n      border-right-width: 0; }\n    /* line 115, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_popover.scss */\n    .popover.popover-left::before, .popover.bs-tether-element-attached-right::before {\n      right: -11px;\n      margin-top: -11px;\n      border-left-color: rgba(0, 0, 0, 0.25); }\n    /* line 121, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_popover.scss */\n    .popover.popover-left::after, .popover.bs-tether-element-attached-right::after {\n      right: -10px;\n      margin-top: -10px;\n      border-left-color: #fff; }\n\n/* line 131, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_popover.scss */\n.popover-title {\n  padding: 8px 14px;\n  margin: 0;\n  font-size: 1rem;\n  background-color: #f7f7f7;\n  border-bottom: 1px solid #ebebeb;\n  border-radius: 0.2375rem 0.2375rem 0 0; }\n  /* line 140, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_popover.scss */\n  .popover-title:empty {\n    display: none; }\n\n/* line 145, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_popover.scss */\n.popover-content {\n  padding: 9px 14px; }\n\n/* line 154, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_popover.scss */\n.popover::before,\n.popover::after {\n  position: absolute;\n  display: block;\n  width: 0;\n  height: 0;\n  border-color: transparent;\n  border-style: solid; }\n\n/* line 164, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_popover.scss */\n.popover::before {\n  content: \"\";\n  border-width: 11px; }\n\n/* line 168, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_popover.scss */\n.popover::after {\n  content: \"\";\n  border-width: 10px; }\n\n/* line 2, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_carousel.scss */\n.carousel {\n  position: relative; }\n\n/* line 6, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_carousel.scss */\n.carousel-inner {\n  position: relative;\n  width: 100%;\n  overflow: hidden; }\n  /* line 11, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_carousel.scss */\n  .carousel-inner > .carousel-item {\n    position: relative;\n    display: none;\n    transition: .6s ease-in-out left; }\n    /* line 17, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_carousel.scss */\n    .carousel-inner > .carousel-item > img,\n    .carousel-inner > .carousel-item > a > img {\n      line-height: 1; }\n    @media all and (transform-3d), (-webkit-transform-3d) {\n      /* line 11, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_carousel.scss */\n      .carousel-inner > .carousel-item {\n        transition: transform .6s ease-in-out;\n        backface-visibility: hidden;\n        perspective: 1000px; }\n        /* line 29, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_carousel.scss */\n        .carousel-inner > .carousel-item.next, .carousel-inner > .carousel-item.active.right {\n          left: 0;\n          transform: translate3d(100%, 0, 0); }\n        /* line 34, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_carousel.scss */\n        .carousel-inner > .carousel-item.prev, .carousel-inner > .carousel-item.active.left {\n          left: 0;\n          transform: translate3d(-100%, 0, 0); }\n        /* line 39, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_carousel.scss */\n        .carousel-inner > .carousel-item.next.left, .carousel-inner > .carousel-item.prev.right, .carousel-inner > .carousel-item.active {\n          left: 0;\n          transform: translate3d(0, 0, 0); } }\n  /* line 48, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_carousel.scss */\n  .carousel-inner > .active,\n  .carousel-inner > .next,\n  .carousel-inner > .prev {\n    display: block; }\n  /* line 54, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_carousel.scss */\n  .carousel-inner > .active {\n    left: 0; }\n  /* line 58, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_carousel.scss */\n  .carousel-inner > .next,\n  .carousel-inner > .prev {\n    position: absolute;\n    top: 0;\n    width: 100%; }\n  /* line 65, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_carousel.scss */\n  .carousel-inner > .next {\n    left: 100%; }\n  /* line 68, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_carousel.scss */\n  .carousel-inner > .prev {\n    left: -100%; }\n  /* line 71, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_carousel.scss */\n  .carousel-inner > .next.left,\n  .carousel-inner > .prev.right {\n    left: 0; }\n  /* line 76, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_carousel.scss */\n  .carousel-inner > .active.left {\n    left: -100%; }\n  /* line 79, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_carousel.scss */\n  .carousel-inner > .active.right {\n    left: 100%; }\n\n/* line 89, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_carousel.scss */\n.carousel-control {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  width: 15%;\n  font-size: 20px;\n  color: #fff;\n  text-align: center;\n  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);\n  opacity: 0.5; }\n  /* line 104, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_carousel.scss */\n  .carousel-control.left {\n    background-image: linear-gradient(to right, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.0001) 100%);\n    background-repeat: repeat-x;\n    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#80000000', endColorstr='#00000000', GradientType=1); }\n  /* line 107, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_carousel.scss */\n  .carousel-control.right {\n    right: 0;\n    left: auto;\n    background-image: linear-gradient(to right, rgba(0, 0, 0, 0.0001) 0%, rgba(0, 0, 0, 0.5) 100%);\n    background-repeat: repeat-x;\n    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#00000000', endColorstr='#80000000', GradientType=1); }\n  /* line 21, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_hover.scss */\n  .carousel-control:focus, .carousel-control:hover {\n    color: #fff;\n    text-decoration: none;\n    outline: 0;\n    opacity: .9; }\n  /* line 122, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_carousel.scss */\n  .carousel-control .icon-prev,\n  .carousel-control .icon-next {\n    position: absolute;\n    top: 50%;\n    z-index: 5;\n    display: inline-block;\n    width: 20px;\n    height: 20px;\n    margin-top: -10px;\n    font-family: serif;\n    line-height: 1; }\n  /* line 134, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_carousel.scss */\n  .carousel-control .icon-prev {\n    left: 50%;\n    margin-left: -10px; }\n  /* line 138, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_carousel.scss */\n  .carousel-control .icon-next {\n    right: 50%;\n    margin-right: -10px; }\n  /* line 144, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_carousel.scss */\n  .carousel-control .icon-prev::before {\n    content: \"\\2039\"; }\n  /* line 149, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_carousel.scss */\n  .carousel-control .icon-next::before {\n    content: \"\\203a\"; }\n\n/* line 161, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_carousel.scss */\n.carousel-indicators {\n  position: absolute;\n  bottom: 10px;\n  left: 50%;\n  z-index: 15;\n  width: 60%;\n  padding-left: 0;\n  margin-left: -30%;\n  text-align: center;\n  list-style: none; }\n  /* line 172, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_carousel.scss */\n  .carousel-indicators li {\n    display: inline-block;\n    width: 10px;\n    height: 10px;\n    margin: 1px;\n    text-indent: -999px;\n    cursor: pointer;\n    background-color: transparent;\n    border: 1px solid #fff;\n    border-radius: 10px; }\n  /* line 189, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_carousel.scss */\n  .carousel-indicators .active {\n    width: 12px;\n    height: 12px;\n    margin: 0;\n    background-color: #fff; }\n\n/* line 202, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_carousel.scss */\n.carousel-caption {\n  position: absolute;\n  right: 15%;\n  bottom: 20px;\n  left: 15%;\n  z-index: 10;\n  padding-top: 20px;\n  padding-bottom: 20px;\n  color: #fff;\n  text-align: center;\n  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6); }\n  /* line 214, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_carousel.scss */\n  .carousel-caption .btn {\n    text-shadow: none; }\n\n@media (min-width: 576px) {\n  /* line 227, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_carousel.scss */\n  .carousel-control .icon-prev,\n  .carousel-control .icon-next {\n    width: 30px;\n    height: 30px;\n    margin-top: -15px;\n    font-size: 30px; }\n  /* line 234, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_carousel.scss */\n  .carousel-control .icon-prev {\n    margin-left: -15px; }\n  /* line 237, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_carousel.scss */\n  .carousel-control .icon-next {\n    margin-right: -15px; }\n  /* line 243, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_carousel.scss */\n  .carousel-caption {\n    right: 20%;\n    left: 20%;\n    padding-bottom: 30px; }\n  /* line 250, /home/daniel/dev/clicker/node_modules/bootstrap/scss/_carousel.scss */\n  .carousel-indicators {\n    bottom: 20px; } }\n\n/* line 1, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_align.scss */\n.align-baseline {\n  vertical-align: baseline !important; }\n\n/* line 2, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_align.scss */\n.align-top {\n  vertical-align: top !important; }\n\n/* line 3, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_align.scss */\n.align-middle {\n  vertical-align: middle !important; }\n\n/* line 4, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_align.scss */\n.align-bottom {\n  vertical-align: bottom !important; }\n\n/* line 5, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_align.scss */\n.align-text-bottom {\n  vertical-align: text-bottom !important; }\n\n/* line 6, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_align.scss */\n.align-text-top {\n  vertical-align: text-top !important; }\n\n/* line 5, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_background.scss */\n.bg-faded {\n  background-color: #f7f7f9; }\n\n/* line 4, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_background-variant.scss */\n.bg-primary {\n  background-color: #0275d8 !important; }\n\n/* line 21, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_hover.scss */\na.bg-primary:focus, a.bg-primary:hover {\n  background-color: #025aa5 !important; }\n\n/* line 4, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_background-variant.scss */\n.bg-success {\n  background-color: #5cb85c !important; }\n\n/* line 21, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_hover.scss */\na.bg-success:focus, a.bg-success:hover {\n  background-color: #449d44 !important; }\n\n/* line 4, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_background-variant.scss */\n.bg-info {\n  background-color: #5bc0de !important; }\n\n/* line 21, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_hover.scss */\na.bg-info:focus, a.bg-info:hover {\n  background-color: #31b0d5 !important; }\n\n/* line 4, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_background-variant.scss */\n.bg-warning {\n  background-color: #f0ad4e !important; }\n\n/* line 21, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_hover.scss */\na.bg-warning:focus, a.bg-warning:hover {\n  background-color: #ec971f !important; }\n\n/* line 4, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_background-variant.scss */\n.bg-danger {\n  background-color: #d9534f !important; }\n\n/* line 21, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_hover.scss */\na.bg-danger:focus, a.bg-danger:hover {\n  background-color: #c9302c !important; }\n\n/* line 4, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_background-variant.scss */\n.bg-inverse {\n  background-color: #373a3c !important; }\n\n/* line 21, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_hover.scss */\na.bg-inverse:focus, a.bg-inverse:hover {\n  background-color: #1f2021 !important; }\n\n/* line 12, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_borders.scss */\n.rounded {\n  border-radius: 0.25rem; }\n\n/* line 15, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_borders.scss */\n.rounded-top {\n  border-top-right-radius: 0.25rem;\n  border-top-left-radius: 0.25rem; }\n\n/* line 18, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_borders.scss */\n.rounded-right {\n  border-bottom-right-radius: 0.25rem;\n  border-top-right-radius: 0.25rem; }\n\n/* line 21, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_borders.scss */\n.rounded-bottom {\n  border-bottom-right-radius: 0.25rem;\n  border-bottom-left-radius: 0.25rem; }\n\n/* line 24, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_borders.scss */\n.rounded-left {\n  border-bottom-left-radius: 0.25rem;\n  border-top-left-radius: 0.25rem; }\n\n/* line 28, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_borders.scss */\n.rounded-circle {\n  border-radius: 50%; }\n\n/* line 2, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_clearfix.scss */\n.clearfix::after {\n  content: \"\";\n  display: table;\n  clear: both; }\n\n/* line 5, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_display.scss */\n.d-block {\n  display: block !important; }\n\n/* line 8, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_display.scss */\n.d-inline-block {\n  display: inline-block !important; }\n\n/* line 11, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_display.scss */\n.d-inline {\n  display: inline !important; }\n\n/* line 3, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_float.scss */\n.float-xs-left {\n  float: left !important; }\n\n/* line 6, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_float.scss */\n.float-xs-right {\n  float: right !important; }\n\n/* line 9, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_float.scss */\n.float-xs-none {\n  float: none !important; }\n\n@media (min-width: 576px) {\n  /* line 3, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_float.scss */\n  .float-sm-left {\n    float: left !important; }\n  /* line 6, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_float.scss */\n  .float-sm-right {\n    float: right !important; }\n  /* line 9, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_float.scss */\n  .float-sm-none {\n    float: none !important; } }\n\n@media (min-width: 768px) {\n  /* line 3, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_float.scss */\n  .float-md-left {\n    float: left !important; }\n  /* line 6, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_float.scss */\n  .float-md-right {\n    float: right !important; }\n  /* line 9, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_float.scss */\n  .float-md-none {\n    float: none !important; } }\n\n@media (min-width: 992px) {\n  /* line 3, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_float.scss */\n  .float-lg-left {\n    float: left !important; }\n  /* line 6, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_float.scss */\n  .float-lg-right {\n    float: right !important; }\n  /* line 9, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_float.scss */\n  .float-lg-none {\n    float: none !important; } }\n\n@media (min-width: 1200px) {\n  /* line 3, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_float.scss */\n  .float-xl-left {\n    float: left !important; }\n  /* line 6, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_float.scss */\n  .float-xl-right {\n    float: right !important; }\n  /* line 9, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_float.scss */\n  .float-xl-none {\n    float: none !important; } }\n\n/* line 5, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_screenreaders.scss */\n.sr-only {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  padding: 0;\n  margin: -1px;\n  overflow: hidden;\n  clip: rect(0, 0, 0, 0);\n  border: 0; }\n\n/* line 23, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_screen-reader.scss */\n.sr-only-focusable:active, .sr-only-focusable:focus {\n  position: static;\n  width: auto;\n  height: auto;\n  margin: 0;\n  overflow: visible;\n  clip: auto; }\n\n/* line 3, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_spacing.scss */\n.w-100 {\n  width: 100% !important; }\n\n/* line 4, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_spacing.scss */\n.h-100 {\n  height: 100% !important; }\n\n/* line 8, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_spacing.scss */\n.mx-auto {\n  margin-right: auto !important;\n  margin-left: auto !important; }\n\n/* line 18, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_spacing.scss */\n.m-0 {\n  margin: 0 0 !important; }\n\n/* line 19, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_spacing.scss */\n.mt-0 {\n  margin-top: 0 !important; }\n\n/* line 20, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_spacing.scss */\n.mr-0 {\n  margin-right: 0 !important; }\n\n/* line 21, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_spacing.scss */\n.mb-0 {\n  margin-bottom: 0 !important; }\n\n/* line 22, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_spacing.scss */\n.ml-0 {\n  margin-left: 0 !important; }\n\n/* line 25, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_spacing.scss */\n.mx-0 {\n  margin-right: 0 !important;\n  margin-left: 0 !important; }\n\n/* line 29, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_spacing.scss */\n.my-0 {\n  margin-top: 0 !important;\n  margin-bottom: 0 !important; }\n\n/* line 18, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_spacing.scss */\n.m-1 {\n  margin: 1rem 1rem !important; }\n\n/* line 19, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_spacing.scss */\n.mt-1 {\n  margin-top: 1rem !important; }\n\n/* line 20, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_spacing.scss */\n.mr-1 {\n  margin-right: 1rem !important; }\n\n/* line 21, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_spacing.scss */\n.mb-1 {\n  margin-bottom: 1rem !important; }\n\n/* line 22, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_spacing.scss */\n.ml-1 {\n  margin-left: 1rem !important; }\n\n/* line 25, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_spacing.scss */\n.mx-1 {\n  margin-right: 1rem !important;\n  margin-left: 1rem !important; }\n\n/* line 29, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_spacing.scss */\n.my-1 {\n  margin-top: 1rem !important;\n  margin-bottom: 1rem !important; }\n\n/* line 18, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_spacing.scss */\n.m-2 {\n  margin: 1.5rem 1.5rem !important; }\n\n/* line 19, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_spacing.scss */\n.mt-2 {\n  margin-top: 1.5rem !important; }\n\n/* line 20, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_spacing.scss */\n.mr-2 {\n  margin-right: 1.5rem !important; }\n\n/* line 21, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_spacing.scss */\n.mb-2 {\n  margin-bottom: 1.5rem !important; }\n\n/* line 22, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_spacing.scss */\n.ml-2 {\n  margin-left: 1.5rem !important; }\n\n/* line 25, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_spacing.scss */\n.mx-2 {\n  margin-right: 1.5rem !important;\n  margin-left: 1.5rem !important; }\n\n/* line 29, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_spacing.scss */\n.my-2 {\n  margin-top: 1.5rem !important;\n  margin-bottom: 1.5rem !important; }\n\n/* line 18, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_spacing.scss */\n.m-3 {\n  margin: 3rem 3rem !important; }\n\n/* line 19, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_spacing.scss */\n.mt-3 {\n  margin-top: 3rem !important; }\n\n/* line 20, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_spacing.scss */\n.mr-3 {\n  margin-right: 3rem !important; }\n\n/* line 21, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_spacing.scss */\n.mb-3 {\n  margin-bottom: 3rem !important; }\n\n/* line 22, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_spacing.scss */\n.ml-3 {\n  margin-left: 3rem !important; }\n\n/* line 25, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_spacing.scss */\n.mx-3 {\n  margin-right: 3rem !important;\n  margin-left: 3rem !important; }\n\n/* line 29, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_spacing.scss */\n.my-3 {\n  margin-top: 3rem !important;\n  margin-bottom: 3rem !important; }\n\n/* line 18, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_spacing.scss */\n.p-0 {\n  padding: 0 0 !important; }\n\n/* line 19, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_spacing.scss */\n.pt-0 {\n  padding-top: 0 !important; }\n\n/* line 20, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_spacing.scss */\n.pr-0 {\n  padding-right: 0 !important; }\n\n/* line 21, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_spacing.scss */\n.pb-0 {\n  padding-bottom: 0 !important; }\n\n/* line 22, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_spacing.scss */\n.pl-0 {\n  padding-left: 0 !important; }\n\n/* line 25, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_spacing.scss */\n.px-0 {\n  padding-right: 0 !important;\n  padding-left: 0 !important; }\n\n/* line 29, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_spacing.scss */\n.py-0 {\n  padding-top: 0 !important;\n  padding-bottom: 0 !important; }\n\n/* line 18, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_spacing.scss */\n.p-1 {\n  padding: 1rem 1rem !important; }\n\n/* line 19, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_spacing.scss */\n.pt-1 {\n  padding-top: 1rem !important; }\n\n/* line 20, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_spacing.scss */\n.pr-1 {\n  padding-right: 1rem !important; }\n\n/* line 21, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_spacing.scss */\n.pb-1 {\n  padding-bottom: 1rem !important; }\n\n/* line 22, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_spacing.scss */\n.pl-1 {\n  padding-left: 1rem !important; }\n\n/* line 25, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_spacing.scss */\n.px-1 {\n  padding-right: 1rem !important;\n  padding-left: 1rem !important; }\n\n/* line 29, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_spacing.scss */\n.py-1 {\n  padding-top: 1rem !important;\n  padding-bottom: 1rem !important; }\n\n/* line 18, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_spacing.scss */\n.p-2 {\n  padding: 1.5rem 1.5rem !important; }\n\n/* line 19, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_spacing.scss */\n.pt-2 {\n  padding-top: 1.5rem !important; }\n\n/* line 20, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_spacing.scss */\n.pr-2 {\n  padding-right: 1.5rem !important; }\n\n/* line 21, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_spacing.scss */\n.pb-2 {\n  padding-bottom: 1.5rem !important; }\n\n/* line 22, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_spacing.scss */\n.pl-2 {\n  padding-left: 1.5rem !important; }\n\n/* line 25, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_spacing.scss */\n.px-2 {\n  padding-right: 1.5rem !important;\n  padding-left: 1.5rem !important; }\n\n/* line 29, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_spacing.scss */\n.py-2 {\n  padding-top: 1.5rem !important;\n  padding-bottom: 1.5rem !important; }\n\n/* line 18, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_spacing.scss */\n.p-3 {\n  padding: 3rem 3rem !important; }\n\n/* line 19, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_spacing.scss */\n.pt-3 {\n  padding-top: 3rem !important; }\n\n/* line 20, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_spacing.scss */\n.pr-3 {\n  padding-right: 3rem !important; }\n\n/* line 21, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_spacing.scss */\n.pb-3 {\n  padding-bottom: 3rem !important; }\n\n/* line 22, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_spacing.scss */\n.pl-3 {\n  padding-left: 3rem !important; }\n\n/* line 25, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_spacing.scss */\n.px-3 {\n  padding-right: 3rem !important;\n  padding-left: 3rem !important; }\n\n/* line 29, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_spacing.scss */\n.py-3 {\n  padding-top: 3rem !important;\n  padding-bottom: 3rem !important; }\n\n/* line 38, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_spacing.scss */\n.pos-f-t {\n  position: fixed;\n  top: 0;\n  right: 0;\n  left: 0;\n  z-index: 1030; }\n\n/* line 7, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_text.scss */\n.text-justify {\n  text-align: justify !important; }\n\n/* line 8, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_text.scss */\n.text-nowrap {\n  white-space: nowrap !important; }\n\n/* line 9, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_text.scss */\n.text-truncate {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap; }\n\n/* line 15, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_text.scss */\n.text-xs-left {\n  text-align: left !important; }\n\n/* line 16, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_text.scss */\n.text-xs-right {\n  text-align: right !important; }\n\n/* line 17, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_text.scss */\n.text-xs-center {\n  text-align: center !important; }\n\n@media (min-width: 576px) {\n  /* line 15, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_text.scss */\n  .text-sm-left {\n    text-align: left !important; }\n  /* line 16, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_text.scss */\n  .text-sm-right {\n    text-align: right !important; }\n  /* line 17, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_text.scss */\n  .text-sm-center {\n    text-align: center !important; } }\n\n@media (min-width: 768px) {\n  /* line 15, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_text.scss */\n  .text-md-left {\n    text-align: left !important; }\n  /* line 16, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_text.scss */\n  .text-md-right {\n    text-align: right !important; }\n  /* line 17, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_text.scss */\n  .text-md-center {\n    text-align: center !important; } }\n\n@media (min-width: 992px) {\n  /* line 15, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_text.scss */\n  .text-lg-left {\n    text-align: left !important; }\n  /* line 16, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_text.scss */\n  .text-lg-right {\n    text-align: right !important; }\n  /* line 17, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_text.scss */\n  .text-lg-center {\n    text-align: center !important; } }\n\n@media (min-width: 1200px) {\n  /* line 15, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_text.scss */\n  .text-xl-left {\n    text-align: left !important; }\n  /* line 16, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_text.scss */\n  .text-xl-right {\n    text-align: right !important; }\n  /* line 17, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_text.scss */\n  .text-xl-center {\n    text-align: center !important; } }\n\n/* line 23, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_text.scss */\n.text-lowercase {\n  text-transform: lowercase !important; }\n\n/* line 24, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_text.scss */\n.text-uppercase {\n  text-transform: uppercase !important; }\n\n/* line 25, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_text.scss */\n.text-capitalize {\n  text-transform: capitalize !important; }\n\n/* line 29, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_text.scss */\n.font-weight-normal {\n  font-weight: normal; }\n\n/* line 30, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_text.scss */\n.font-weight-bold {\n  font-weight: bold; }\n\n/* line 31, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_text.scss */\n.font-italic {\n  font-style: italic; }\n\n/* line 35, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_text.scss */\n.text-white {\n  color: #fff !important; }\n\n/* line 4, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_text-emphasis.scss */\n.text-muted {\n  color: #818a91 !important; }\n\n/* line 21, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_hover.scss */\na.text-muted:focus, a.text-muted:hover {\n  color: #687077 !important; }\n\n/* line 4, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_text-emphasis.scss */\n.text-primary {\n  color: #0275d8 !important; }\n\n/* line 21, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_hover.scss */\na.text-primary:focus, a.text-primary:hover {\n  color: #025aa5 !important; }\n\n/* line 4, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_text-emphasis.scss */\n.text-success {\n  color: #5cb85c !important; }\n\n/* line 21, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_hover.scss */\na.text-success:focus, a.text-success:hover {\n  color: #449d44 !important; }\n\n/* line 4, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_text-emphasis.scss */\n.text-info {\n  color: #5bc0de !important; }\n\n/* line 21, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_hover.scss */\na.text-info:focus, a.text-info:hover {\n  color: #31b0d5 !important; }\n\n/* line 4, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_text-emphasis.scss */\n.text-warning {\n  color: #f0ad4e !important; }\n\n/* line 21, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_hover.scss */\na.text-warning:focus, a.text-warning:hover {\n  color: #ec971f !important; }\n\n/* line 4, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_text-emphasis.scss */\n.text-danger {\n  color: #d9534f !important; }\n\n/* line 21, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_hover.scss */\na.text-danger:focus, a.text-danger:hover {\n  color: #c9302c !important; }\n\n/* line 4, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_text-emphasis.scss */\n.text-gray-dark {\n  color: #373a3c !important; }\n\n/* line 21, /home/daniel/dev/clicker/node_modules/bootstrap/scss/mixins/_hover.scss */\na.text-gray-dark:focus, a.text-gray-dark:hover {\n  color: #1f2021 !important; }\n\n/* line 57, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_text.scss */\n.text-hide {\n  font: 0/0 a;\n  color: transparent;\n  text-shadow: none;\n  background-color: transparent;\n  border: 0; }\n\n/* line 5, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_visibility.scss */\n.invisible {\n  visibility: hidden !important; }\n\n/* line 12, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_visibility.scss */\n.hidden-xs-up {\n  display: none !important; }\n\n@media (max-width: 575px) {\n  /* line 17, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_visibility.scss */\n  .hidden-xs-down {\n    display: none !important; } }\n\n@media (min-width: 576px) {\n  /* line 12, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_visibility.scss */\n  .hidden-sm-up {\n    display: none !important; } }\n\n@media (max-width: 767px) {\n  /* line 17, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_visibility.scss */\n  .hidden-sm-down {\n    display: none !important; } }\n\n@media (min-width: 768px) {\n  /* line 12, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_visibility.scss */\n  .hidden-md-up {\n    display: none !important; } }\n\n@media (max-width: 991px) {\n  /* line 17, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_visibility.scss */\n  .hidden-md-down {\n    display: none !important; } }\n\n@media (min-width: 992px) {\n  /* line 12, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_visibility.scss */\n  .hidden-lg-up {\n    display: none !important; } }\n\n@media (max-width: 1199px) {\n  /* line 17, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_visibility.scss */\n  .hidden-lg-down {\n    display: none !important; } }\n\n@media (min-width: 1200px) {\n  /* line 12, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_visibility.scss */\n  .hidden-xl-up {\n    display: none !important; } }\n\n/* line 17, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_visibility.scss */\n.hidden-xl-down {\n  display: none !important; }\n\n/* line 29, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_visibility.scss */\n.visible-print-block {\n  display: none !important; }\n  @media print {\n    /* line 29, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_visibility.scss */\n    .visible-print-block {\n      display: block !important; } }\n\n/* line 36, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_visibility.scss */\n.visible-print-inline {\n  display: none !important; }\n  @media print {\n    /* line 36, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_visibility.scss */\n    .visible-print-inline {\n      display: inline !important; } }\n\n/* line 43, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_visibility.scss */\n.visible-print-inline-block {\n  display: none !important; }\n  @media print {\n    /* line 43, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_visibility.scss */\n    .visible-print-inline-block {\n      display: inline-block !important; } }\n\n@media print {\n  /* line 51, /home/daniel/dev/clicker/node_modules/bootstrap/scss/utilities/_visibility.scss */\n  .hidden-print {\n    display: none !important; } }\n\n/* line 35, stdin */\n.mainContent {\n  margin-top: 65px; }\n\n/* line 39, stdin */\n.navbar {\n  transition: background-color 2s linear; }\n\n/* line 43, stdin */\n.navbar.navbar-dark .navbar-text {\n  color: #eceeef; }\n\n/* line 47, stdin */\n.energyPlate {\n  width: 200px;\n  max-width: 100%;\n  height: 200px;\n  line-height: 200px;\n  text-align: center;\n  margin: 0 auto 1em auto;\n  border: 1px solid #999;\n  cursor: pointer;\n  background-color: #CCC; }\n\n/* line 60, stdin */\n.noselect {\n  -webkit-touch-callout: none;\n  -webkit-user-select: none;\n  -khtml-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none; }")
;(function(){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _vuex = require('vuex');

var _inventory = require('./inventory.vue');

var _inventory2 = _interopRequireDefault(_inventory);

var _battery = require('./battery.vue');

var _battery2 = _interopRequireDefault(_battery);

var _crafting = require('./crafting.vue');

var _crafting2 = _interopRequireDefault(_crafting);

var _watch = require('./watch.vue');

var _watch2 = _interopRequireDefault(_watch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {

    components: {
        Inventory: _inventory2.default,
        Battery: _battery2.default,
        Crafting: _crafting2.default,
        Watch: _watch2.default
    },

    computed: {
        night: function night() {
            return this.$store.state.time < 60 * 8 || this.$store.state.time >= 60 * 20;
        },
        navClasses: function navClasses() {
            return {
                navbar: true,
                'navbar-fixed-top': true,
                'navbar-dark': this.night,
                'bg-inverse': this.night,
                'bg-faded': !this.night
            };
        }
    },

    methods: _extends({}, (0, _vuex.mapMutations)(['BATTERY_CHARGE']))
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;return _vm._h('div',[_vm._h('nav',{class:_vm.navClasses},[_vm._h('div',{staticClass:"navbar-text float-xs-right"},[_vm._h('watch')])])," ",_vm._h('div',{staticClass:"container-fluid mainContent"},[_vm._h('div',{staticClass:"row"},[_vm._h('div',{staticClass:"col-md-3"},[_vm._h('div',{staticClass:"energyPlate noselect",on:{"click":function($event){$event.stopPropagation();_vm.BATTERY_CHARGE($event)}}},["Charge"])])," ",_vm._h('div',{staticClass:"col-md-6"},[_vm._h('crafting')])," ",_vm._h('div',{staticClass:"col-md-3"},[_vm._h('battery',{staticStyle:{"margin-bottom":"1em"}})," ",_vm._h('div',{staticClass:"card"},[_vm._m(0)," ",_vm._h('div',{staticClass:"card-block"},[_vm._h('inventory')])])])])])])}
__vue__options__.staticRenderFns = [function render () {var _vm=this;return _vm._h('div',{staticClass:"card-header"},["\n                        Inventory\n                    "])}]
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  module.hot.dispose(__vueify_style_dispose__)
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-1", __vue__options__)
  } else {
    hotAPI.rerender("data-v-1", __vue__options__)
  }
})()}

},{"./battery.vue":15,"./crafting.vue":16,"./inventory.vue":17,"./watch.vue":19,"vue":4,"vue-hot-reload-api":3,"vueify/lib/insert-css":5,"vuex":6}],19:[function(require,module,exports){
;(function(){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    computed: {
        formattedTime: function formattedTime() {
            return (0, _moment2.default)('2016-01-01').startOf('day').minutes(this.$store.state.time).format('HH:mm');
        }
    }
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;return _vm._h('div',["\n    "+_vm._s(_vm.formattedTime)+"\n"])}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-5", __vue__options__)
  } else {
    hotAPI.rerender("data-v-5", __vue__options__)
  }
})()}

},{"moment":1,"vue":4,"vue-hot-reload-api":3}]},{},[7])


//# sourceMappingURL=main.js.map
