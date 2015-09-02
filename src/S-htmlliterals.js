(function (package) {
    if (typeof exports === 'object')
        package(require('S'), require('htmlliterals-runtime')); // CommonJS
    else if (typeof define === 'function')
        define(['S', 'htmlliterals-runtime'], package); // AMD
    else package(S, Html); // globals
})(function (S, Html) {
    "use strict";

    Html.prototype.mixin = function mixin(fn) {
        var node = this.node,
            state;

        //var logFn = function() {
        //    var args = Array.prototype.slice.call(arguments);
        //    console.log("[@" + name + "(" + args.join(", ") + ")]");
        //    fn.apply(undefined, args);
        //};

        S(function mixin() {
            //values(logFn);
            state = fn()(node, state);
        });
        
        return this;
    };

    Html.prototype.property = function property(setter) {
        var node = this.node;

        //var logSetter = function (node) {
        //    var msg = setter.toString().substr(18); // remove "function () { __."
        //    msg = msg.substr(0, msg.length - 3); // remove "; }"
        //    console.log("[@" + node.nodeName + msg + "]");
        //    setter(node);
        //};

        S(function property() {
            //logSetter(node);
            setter(node);
        });

        return this;
    };

    Html.cleanup = function cleanup(node, fn) {
        S.cleanup(fn);
    };
    
    Html.data = function(signal, arg1, arg2) {
        return function (node) {
            var tag = node.nodeName,
                type = node.type && node.type.toUpperCase(),
                handler =
                    tag === 'INPUT'         ? (
                        type === 'TEXT'                 ? valueData       :
                        type === 'RADIO'                ? radioData       :
                        type === 'CHECKBOX'             ? checkboxData    :
                        null) :
                    tag === 'TEXTAREA'                  ? valueData       :
                    tag === 'SELECT'                    ? valueData       :
                    Html.domlib.isContentEditable(node) ? textContentData :
                    null;
    
            if (!handler)
                throw new Error("@data can only be applied to a form control element, \n"
                    + "such as <input/>, <textarea/> or <select/>, or to an element with "
                    + "'contentEditable' set.  Element ``" + tag + "'' is \n"
                    + "not such an element.  Perhaps you applied it to the wrong node?");
    
            return handler();
    
            function valueData() {
                var event = arg1 || 'change';

                S(function updateValue() {
                    node.value = signal();
                });

                Html.domlib.addEventListener(node, event, valueListener);
                S.cleanup(function () { Html.domlib.removeEventListener(node, event, valueListener); });

                function valueListener() {
                    var cur = S.peek(signal),
                        update = node.value;
                    if (cur.toString() !== update) signal(update);
                    return true;
                }
            }
    
            function checkboxData() {
                var on = arg1 === undefined ? true : arg1,
                    off = arg2 === undefined ? (on === true ? false : null) : arg2;

                S(function updateCheckbox() {
                    node.checked = (signal() === on);
                });

                Html.domlib.addEventListener(node, "change", checkboxListener);
                S.cleanup(function () { Html.domlib.removeEventListener(node, "change", checkboxListener); });

                function checkboxListener() {
                    signal(node.checked ? on : off);
                    return true;
                }
            }
    
            function radioData() {
                var on = arg1 === undefined ? true : arg1;

                S(function updateRadio() {
                    node.checked = (signal() === on);
                });

                Html.domlib.addEventListener(node, "change", radioListener);
                S.cleanup(function () { Html.domlib.removeEventListener(node, "change", radioListener); });

                function radioListener() {
                    if (node.checked) signal(on);
                    return true;
                }
            }
            
            function textContentData() {
                var event = arg1 || 'input';

                S(function updateTextContent() {
                    node.textContent = signal();
                });

                Html.domlib.addEventListener(node, event, textContentListener);
                S.cleanup(function () { Html.domlib.removeEventListener(node, event, textContentListener); });

                function textContentListener() {
                    var cur = S.peek(signal),
                        update = node.textContent;
                    if (cur.toString() !== update) signal(update);
                    return true;
                }
            }
        };
    };
});
