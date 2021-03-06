var polyfill = (function () {

    "use strict";

    // Incomplete polyfill - does everything we need it to, but not everything
    // that Object.assign() does.
    var assign = Object.assign || function (source) {

        Array.prototype.slice.call(arguments, 1).forEach(function (arg) {

            if (arg !== null && arg !== undefined) {

                Object.keys(arg).forEach(function (key) {
                    source[key] = arg[key];
                });

            }

        });

        return source;

    };

    /**
     * Polyfills one or more objects with the property/properties defined.
     *
     * @global
     * @param  {Object|Array.<Object>} objects
     *         Either the object to polyfill or an array of objects.
     * @param  {Object|String} properties
     *         Either the name of the property or an object of names to values.
     * @param  {?} [value]
     *         The value of the property to polyfill if name is a string.
     * @param  {Object} [settings={}]
     *         Optional additional settings for the property being defined.
     * @param  {Boolean} [force=false]
     *         Optional flag to force the polyfill. If ommitted, the polyfill is
     *         only applied if the original object does not have the property.
     *
     * @example <caption>Polyfilling a property</caption>
     * polyfill(Number, "isNaN", function (value) {
     *     return value !== value;
     * });
     *
     * @example <caption>Polyfilling multiple objects</caption>
     * polyfill([
     *     Array.prototype,
     *     String.prototype
     * ], "includes", function (search) { // .length = 1
     *     return this.indexOf.apply(this, arguments) > -1;
     * });
     *
     * @example <caption>Polyfilling multiple properties</caption>
     * polyfill(String.prototype, {
     *     startsWith: function (search) { // .length = 1
     *         return this.indexOf.apply(this, arguments) === 0;
     *     },
     *     endsWith: function (search) { // .length = 1
     *         var lengthArg = arguments[1];
     *         var length = (lengthArg === undefined || lengthArg > this.length)
     *             ? this.length
     *             : lengthArg;
     *         return this.substring(length - search.length, length) === search;
     *     }
     * });
     *
     * @example <caption>Polyfilling a read-only property</caption>
     * polyfill(Number, "EPSILON", Math.pow(2, -52), polyfill.readOnly);
     *
     * @example <caption>Polyfilling multiple read-only properties</caption>
     * polyfill(Number, {
     *     MAX_SAFE_INTEGER: Math.pow(2, 53) - 1,
     *     MIN_SAFE_INTEGER: -(Math.pow(2, 53) - 1)
     * }, polyfill.readOnly);
     *
     * @example <caption>Forcing a polyfill to be applied</caption>
     * var subString = String.prototype.subString;
     * polyfill(String.prototype, "substr", function (start, length) {
     *     var normalised = start;
     *     if (start < 0) {
     *         normalised = Math.max(this.length + start, 0);
     *     }
     *     return subString.call(this, normalised, length);
     * }, null, (''.substr && '0b'.substr(-1) !== 'b'));
     * // https://github.com/es-shims/es5-shim/blob/master/es5-shim.js#L1933
     */
    function polyfill(objects, properties, value, settings, force) {

        var name;

        if (!Array.isArray(objects) || objects === Array.prototype) {
            objects = [objects];
        }

        if (typeof properties === "string") {

            name = properties;
            properties = {};
            properties[name] = value;

        } else {

            force = settings;
            settings = value;

        }

        objects.forEach(function (object) {

            Object.keys(properties).forEach(function (key) {

                var val = properties[key];

                if (force || typeof object[key] !== typeof val) {

                    Object.defineProperty(
                        object,
                        key,
                        assign(
                            { value: val },
                            polyfill.defaults,
                            settings
                        )
                    );

                }

            });

        });

    }

    /**
     * Default settings for the applied property. They can be overridden with
     * the "settings" parameter.
     * @type {Object}
     */
    polyfill.defaults = Object.freeze({
        configurable: true,
        enumerable: false,
        writable: true
    });

    /**
     * Settings that will make a property read-only.
     * @type {Object}
     */
    polyfill.readOnly = Object.freeze({
        configurable: false,
        writable: false
    });

    return polyfill;

}());
