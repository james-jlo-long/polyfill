(function (polyfill) {

    "use strict";

    polyfill(Object, {

        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/values
        values: function (object) {

            return Object.keys(object).map(function (key) {
                return object[key];
            });

        },

        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries
        entries: function (object) {

            return Object.keys(object).map(function (key) {
                return [key, object[key]];
            });

        }

    });

    polyfill(Number, {
        EPSILON: Math.pow(2, -52),
        MAX_SAFE_INTEGER: Math.pow(2, 53) - 1,
        MIN_SAFE_INTEGER: -(Math.pow(2, 53) - 1)
    }, polyfill.readOnly);

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from

    function isCallable(func) {

        return (
            typeof func === "function"
            || Object.prototype.toString.call(func) === "[object Function]"
        );

    }

    function toInteger(value) {

        var number = Number(value);

        return isNaN(number)
            ? 0
            : (number === 0 || !isFinite(number))
                ? number
                : (
                    (
                        number > 0
                            ? 1
                            : -1
                    ) * Math.floor(Math.abs(number))
                );

    }

    function toLength(value) {
        return Math.min(Math.max(toInteger(value), 0), Number.MAX_SAFE_INTEGER);
    }

    polyfill(Array, "from", function (arrayLike) {

        if (arrayLike === null || arrayLike === undefined) {

            throw new TypeError(
                "Array.from requires an array-like object - not null or " +
                "undefined"
            );

        }

        var Context = this;
        var items = Object(arrayLike);
        var map = arguments.length > 1
            ? arguments[1]
            : undefined;
        var mapContext;
        var length = toLength(items.length);
        var arr;
        var i = 0;
        var item;

        if (map !== undefined) {

            if (!isCallable(map)) {

                throw new TypeError(
                    "Array.from: when provided, the second argument must be " +
                    "a function"
                );

            }

            if (arguments.length > 2) {
                mapContext = arguments[2];
            }

        }

        arr = isCallable(Context)
            ? Object(new Context(length))
            : new Array(length);

        while (i < length) {

            item = items[i];

            arr[i] = map
                ? mapContext === undefined
                    ? map(item, i)
                    : map.call(mapContext, item, i)
                : item;

            i += 1;

        }

        arr.length = length;

        return arr;

    });

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes
    polyfill([
        String.prototype,
        Array.prototype
    ], {

        includes: function (search) { // .length = 1
            return this.indexOf.apply(this, arguments) > -1;
        }

    });

    polyfill(String.prototype, {

        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith
        startsWith: function (search) { // .length = 1
            return this.indexOf.apply(this, arguments) === 0;
        },

        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith
        endsWith: function (search) { // .length = 1

            var lengthArg = arguments[1];
            var length = (lengthArg === undefined || lengthArg > this.length)
                ? this.length
                : lengthArg;

            return this.substring(length - search.length, length) === search;

        }

    });

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isNaN
    polyfill(Number, "isNaN", function (value) {
        return value !== value;
    });

    function findIndex(array, handler, context) {

        var index = -1;

        if (typeof handler !== "function") {

            throw new TypeError(
                Object.prototype.toString.call(handler) + " is not a function"
            );

        }

        Array.prototype.every.call(array, function (item, i, arr) {

            if (handler.call(context, item, i, arr)) {
                index = i;
            }

            return index < 0;

        });

        return index;

    }

    polyfillAll(Array.prototype, {

        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex
        findIndex: function (handler) { // .length = 1
            return findIndex(this, handler, arguments[1]);
        },

        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
        find: function (handler) { // .length = 1
            return this[findIndex(this, handler, arguments[1])];
        }

    });

}(window.polyfill));
