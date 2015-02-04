(function (package) {
    if (typeof exports === 'object')
        package(require('S'), require('htmlliterals-runtime')); // CommonJS
    else if (typeof define === 'function')
        define(['S', 'htmlliterals-runtime'], package); // AMD
    else package(S, htmlliterals); // globals
})(function (S, htmlliterals) {

    htmlliterals.Shell.execDirective = function directive(fn, node, values) {
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
            var event = null;

            return function valueData(_event, _signal) {
                if (arguments.length < 2) _signal = _event, _event = 'change';
                setSignal(_signal);

                S(function updateValue() {
                    node.value = signal();
                });

                if (_event !== event) {
                    if (event) htmlliterals.domlib.removeEventListener(node, event, valueListener);
                    htmlliterals.domlib.addEventListener(node, _event, valueListener);
                    event = _event;
                }
            };

            function valueListener() {
                var cur = S.peek(signal),
                    update = node.value;
                if (cur.toString() !== update) signal(update);
                return true;
            }
        }

        function checkboxData() {
            var on = true,
                off = false;

            htmlliterals.domlib.addEventListener(node, "change", function checkboxListener() {
                signal(node.checked ? on : off);
                return true;
            });

            return function checkboxData(_signal, _on, _off) {
                setSignal(_signal);

                on = _on === undefined ? true : _on;
                off = _off === undefined ? (on === true ? false : null) : _off;

                S(function updateCheckbox() {
                    node.checked = (signal() === on);
                });
            };
        }

        function radioData() {
            var on = true;

            htmlliterals.domlib.addEventListener(node, "change", function radioListener() {
                if (node.checked) signal(on);
                return true;
            });

            return function radioData(_signal, _on) {
                setSignal(_signal);

                on = _on === undefined ? true : _on;

                S(function updateRadio() {
                    node.checked = (signal() === on);
                });
            };
        }

        function setSignal(s) {
            if (typeof s !== 'function')
                throw new Error("@signal must receive a function for two-way binding.  \n"
                    + "Perhaps you mistakenly dereferenced it with '()'?");
            signal = s;
        }
    });

});
