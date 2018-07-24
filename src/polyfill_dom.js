(function (polyfill) {

    "use strict";

    // https://developer.mozilla.org/en-US/docs/Web/API/NodeList/forEach
    polyfill(NodeList.prototype, "forEach", function (handler) { // .length = 1
        Array.prototype.forEach.apply(this, arguments);
    });

    // https://developer.mozilla.org/en-US/docs/Web/API/Element/matches
    polyfill(
        Element.prototype,
        "matches",
        (
            Element.prototype.matchesSelector
            || Element.prototype.msMatchesSelector
            || Element.prototype.webkitMatchesSelector
            || Element.prototype.mozMatchesSelector
            || Element.prototype.oMatchesSelector
            || function (selector) {

                var doc = this.document || this.ownerDocument;
                var elements = doc.querySelectorAll(selector);
                var isMatch = false;
                var il = elements.length;

                while (il) {

                    il -= 1;

                    if (elements[il] === this) {

                        isMatch = true;
                        break;

                    }

                }

                return isMatch;

            }
        )
    );

    /**
     * Converts the given arguments into a DocumentFragment. If any of the given
     * arguments is not a Node, the argument is converted into a string and
     * wrapped in a TextNode.
     *
     * @private
     * @param   {Array|Object} args
     *          Array (or array-like collection) of items to add to a fragment.
     * @return  {DocumentFragment}
     *          DocumentFragment containing the children.
     */
    function addToFrag(args) {

        var frag = document.createDocumentFragment();

        Array.prototype.forEach.call(args, function (arg) {

            frag.appendChild(
                arg instanceof Node
                    ? arg
                    : document.createTextNode(String(arg))
            );

        });

        return frag;

    };

    polyfill(
        [
            Element.prototype,
            Document.prototype,
            DocumentFragment.prototype
        ],
        {

            // https://developer.mozilla.org/en-US/docs/Web/API/ParentNode/append
            append: function () {
                this.appendChild(addToFrag(arguments));
            },

            // https://developer.mozilla.org/en-US/docs/Web/API/ParentNode/prepend
            prepend: function () {
                this.insertBefore(addToFrag(arguments), this.firstChild);
            }

        }
    );

    // https://developer.mozilla.org/en-US/docs/Web/API/Element/closest
    polyfill(Element.prototype, "closest", function (selector) {

        var element = this;
        var closest = null;

        if (document.documentElement.contains(element)) {

            do {

                if (element.matches(selector)) {

                    closest = element;
                    break;

                }

                element = element.parentElement || element.parentNode;

            } while (element !== null);

        }

        return closest;

    });

    polyfill(
        [
            Element.prototype,
            CharacterData.prototype,
            DocumentType.prototype
        ],
        {

            // https://developer.mozilla.org/en-US/docs/Web/API/ChildNode/before
            before: function () {

                var parentNode = this.parentNode;

                if (parentNode) {
                    parentNode.insertBefore(addToFrag(arguments), this);
                }

            },

            // https://developer.mozilla.org/en-US/docs/Web/API/ChildNode/after
            after: function () {

                var parentNode = this.parentNode;
                var nextSibling = this.nextSibling;

                if (parentNode) {
                    parentNode.insertBefore(addToFrag(arguments), nextSibling);
                }

            },

            // https://developer.mozilla.org/en-US/docs/Web/API/ChildNode/remove
            remove: function () {

                var parentNode = this.parentNode;

                if (parentNode) {
                    parentNode.removeChild(this);
                }

            },

            // https://developer.mozilla.org/en-US/docs/Web/API/ChildNode/replaceWith
            replaceWith: function () {

                this.before.apply(this, arguments);
                this.remove();

            }

        }
    );

}(window.polyfill));
