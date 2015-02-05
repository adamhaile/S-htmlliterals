(function (package) {
    if (typeof exports === 'object')
        package(require('S'), require('htmlliterals-runtime')); // CommonJS
    else if (typeof define === 'function')
        define(['S', 'htmlliterals-runtime'], package); // AMD
    else package(S, htmlliterals); // globals
})(function (S, htmlliterals) {

    htmlliterals.Shell.runDirective = function runDirective(fn, node, values) {
        fn = fn(node);

        //var logFn = function() {
        //    var args = Array.prototype.slice.call(arguments);
        //    console.log("[@" + name + "(" + args.join(", ") + ")]");
        //    fn.apply(undefined, args);
        //};

        S(function updateDirective() {
            //values(logFn);
            values(fn);
        });
    };

    htmlliterals.Shell.cleanup = function cleanup(node, fn) {
        S.cleanup(fn);
    };

    htmlliterals.Shell.prototype.property = function property(setter) {
        var node = this.node;

        //var logSetter = function (node) {
        //    var msg = setter.toString().substr(18); // remove "function () { __."
        //    msg = msg.substr(0, msg.length - 3); // remove "; }"
        //    console.log("[@" + node.nodeName + msg + "]");
        //    setter(node);
        //};

        S(function updateProperty() {
            //logSetter(node);
            setter(node);
        });

        return this;
    };

    htmlliterals.Shell.addDirective('data', function (node) {
        var signal = null,
            tag = node.nodeName,
            type = node.type && node.type.toUpperCase(),
            handler =
                tag === 'INPUT'         ? (
                    type === 'TEXT'     ? valueData    :
                    type === 'RADIO'    ? radioData    :
                    type === 'CHECKBOX' ? checkboxData :
                    null) :
                tag === 'TEXTAREA'      ? valueData    :
                tag === 'SELECT'        ? valueData    :
                null;

        if (!handler)
            throw new Error("@signal can only be applied to a form control element, \n"
                + "such as <input/>, <textarea/> or <select/>.  Element ``" + node + "'' is \n"
                + "not a recognized control.  Perhaps you applied it to the wrong node?");

        return handler();

        function valueData() {
            return function valueData(event, signal) {
                if (arguments.length < 2) signal = event, event = 'change';

                S(function updateValue() {
                    node.value = signal();
                });

                htmlliterals.domlib.addEventListener(node, event, valueListener);
                S.cleanup(function () { htmlliterals.domlib.removeEventListener(node, event, valueListener); });

                function valueListener() {
                    var cur = S.peek(signal),
                        update = node.value;
                    if (cur.toString() !== update) signal(update);
                    return true;
                }
            };
        }

        function checkboxData() {
            return function checkboxData(signal, on, off) {
                on = on === undefined ? true : on;
                off = off === undefined ? (on === true ? false : null) : off;

                S(function updateCheckbox() {
                    node.checked = (signal() === on);
                });

                htmlliterals.domlib.addEventListener(node, "change", checkboxListener);
                S.cleanup(function () { htmlliterals.domlib.removeEventListener(node, "change", checkboxListener); });

                function checkboxListener() {
                    signal(node.checked ? on : off);
                    return true;
                }
            };
        }

        function radioData() {
            return function radioData(signal, on) {
                on = on === undefined ? true : on;

                S(function updateRadio() {
                    node.checked = (signal() === on);
                });

                htmlliterals.domlib.addEventListener(node, "change", radioListener);
                S.cleanup(function () { htmlliterals.domlib.removeEventListener(node, "change", radioListener); });

                function radioListener() {
                    if (node.checked) signal(on);
                    return true;
                }
            };
        }
    });
});
