(function (package) {
    if (typeof exports === 'object')
        package(require('S'), require('htmlliterals-runtime')); // CommonJS
    else if (typeof define === 'function')
        define(['S', 'htmlliterals-runtime'], package); // AMD
    else package(S, htmlliterals); // globals
})(function (S, htmlliterals) {

    htmlliterals.Shell.prototype.directive = function directive(name, values) {
        var fn = directives[name];

        if (typeof fn !== 'function')
            throw new Error("No directive registered with name: " + name);

        S(function () { values(fn(this.node)); });

        return this;
    };

    htmlliterals.Shell.prototype.property = function property(setter) {
        S(function () { setter(this.node); });

        return this;
    };

    htmlliterals.directives.signal = function (node) {
        var signal = null,
            tag = node.nodeName,
            type = node.type && node.type.toUpperCase(),
            handler =
                tag === 'INPUT'         ? (
                    type === 'TEXT'     ? valueSignal    :
                    type === 'RADIO'    ? radioSignal    :
                    type === 'CHECKBOX' ? checkboxSignal :
                    null) :
                tag === 'TEXTAREA'      ? valueSignal    :
                tag === 'SELECT'        ? valueSignal    :
                null;

        if (!handler)
            throw new Error("@signal can only be applied to a form control element, \n"
                + "such as <input/>, <textarea/> or <select/>.  Element ``" + node + "'' is \n"
                + "not a recognized control.  Perhaps you applied it to the wrong node?");

        return handler;

        function valueSignal() {
            var event = null;

            return function valueSignal(_event, _signal) {
                if (arguments.length < 2) _signal = _event, _event = 'change';
                setSignal(_signal);

                K(function () {
                    node.value = signal();
                });

                if (_event !== event) {
                    if (event) lib.removeEventListener(node, event, valueListener);
                    lib.addEventListener(node, _event, valueListener);
                    event = _event;
                }
            };

            function valueListener() {
                var cur = K.peek(signal),
                    update = node.value;
                if (cur.toString() !== update) signal(update);
                return true;
            }
        }

        function checkboxSignal() {
            var on = true,
                off = false;

            lib.addEventListener(node, "change", function checkboxListener() {
                signal(node.checked ? on : off);
                return true;
            });

            return function checkboxSignal(_signal, _on, _off) {
                setSignal(_signal);

                on = _on === undefined ? true : _on;
                off = _off === undefined ? (on === true ? false : null) : _off;

                K(function () {
                    node.checked = (signal() === on);
                });
            };
        }

        function radioSignal(values) {
            var on = true;

            lib.addEventListener(node, "change", function radioListener() {
                if (node.checked) signal(on);
                return true;
            });

            return function radioSignal(_signal, _on) {
                setSignal(_signal);

                on = _on === undefined ? true : _on;

                K(function () {
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
    };

});
