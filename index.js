function Context(initFn) {
	this.root = this.head = [];
	if (initFn) {
		initFn(this);
	}
}

Context.prototype._setHead = function(head) {
	var oldHead = this.head;
	this.head = head;
	return oldHead;
};

Context.prototype._pushTag = function(tag) {
	this.head.push(tag);
};

Context.prototype.tag = function tag(tagName, selector, attributes, contentFn) {

	// no attributes?
	if (type(attributes) === 'string' || type(attributes) === 'function') {
		contentFn = attributes;
		attributes = null;
	}

	// no selector, or it doesn't look like selector
	if (type(selector) !== 'string' || (selector[0] !== '.' && selector[0] !== '#')) {

		if (type(selector) === 'object') {
			attributes = selector;
		} else if (type(selector) === 'function') {
			contentFn = selector;
			attributes = null;
		}
		selector = null;

	}

	var open = '<' + tagName,
		close = '</' + tagName + '>',
		contents = [];
	selector = selector ? this._selector(selector) : null;
	attributes = attributes ? this._attrs(attributes) : null;
	if (selector) {
		open += ' ' + selector;
	}
	if (attributes) {
		open += ' ' + attributes;
	}
	open += '>';

	this._pushTag([open, contents, close]);

	var oldHead;
	if (contentFn) {
		oldHead = this._setHead(contents);
		if (type(contentFn) === 'function') {
			contentFn();
		} else {
			contents.push(contentFn);
		}
		this._setHead(oldHead);
	}
};

Context.prototype._attrs = function attrs(attrs) {
	var k, strs = [];
	for (k in attrs) {
		strs.push(k + '="' + attrs[k] + '"');
	}
	return strs.join(' ');
};

Context.prototype._selector = function(selector) {
	var matched = selector.match(/([\.#][^\.#]*)/g);
	if (!matched) {
		return '';
	}
	var i, id, mti, classes, cls = [];
	for (i = 0; i < matched.length; i++) {
		mti = matched[i];
		if (mti[0] === '#') {
			id = mti.slice(1);
		} else if (mti[0] === '.') {
			cls.push(mti.slice(1));
		}
	}
	if (id) {
		id = 'id="' + id + '"';
	}
	if (cls.length) {
		classes = 'class="' + cls.join(' ') + '"';
	}
	return (id + ' ' || '') + (classes || '');
};

Context.prototype.toHtml = function() {
	function bakeNode(node) {
		var i,
			cnt,
			result = [];
		if (type(node) === 'array') {
			result.push(node[0]);
			cnt = node[1];
			for (i = 0; i < cnt.length; i++) {
				result.push(bakeNode(cnt[i]));
			}
			result.push(node[2]);
		} else if (type(node) === 'string') {
			result.push(node);
		}
		return result.join('');
	}
	return bakeNode(this.root[0]);
};

// n-times repeat
Context.prototype.times = function(n, fn) {
	var i;
	for (i = 0; i < n; i++) {
		fn(i);
	}
};

Context.prototype.txt = function() {
	var text = txt.apply(this, arguments);
	this._pushTag(text);
};

// Text placeholders
function txt() {
	var args = [].slice.call(arguments),
		data = {};
	if (typeof args[args.length - 1] !== 'string') {
		data = args.pop();
	}
	var k, str = args.join('');
	for (k in data) {
		str = str.replace(new RegExp('%(\s*?)' + k + '(\s*?)%', 'g'), data[k]);
	}
	return str;
}

// Types
var i,
	class2type = {},
	toString = class2type.toString,
	types = "Boolean Number String Function Array Date RegExp Object Error".split(" ");
for (i = 0; i < types.length; i++) {
	class2type["[object " + types[i] + "]"] = types[i].toLowerCase();
}

function type(obj) {
	if (obj == null) {
		return obj + "";
	}
	return typeof obj === "object" || typeof obj === "function" ? class2type[toString.call(obj)] || "object" : typeof obj;
}

// Tags
// So no need for .tag method, just use _.div, or _.button tag-methods instead
(function() {

	var inputs = ('text password checkbox radio button submit reset file hidden image datetime datetime-local ' +
		'date month time week number range email url search tel color').split(' ');

	var tags = ('a button command abbr address area article aside audio b base bdi bdo blockquote ' +
		'body br canvas caption cite code col colgroup datalist dd del details dfn div dl ' +
		'dt em embed fieldset figcaption figure footer form h1 h2 h3 h4 h5 h6 head header ' +
		'hgroup hr html i iframe img ins kbd keygen label legend li link map mark menu meta ' +
		'meter nav noscript object ol optgroup option output p param pre progress q rp rt ruby ' +
		's samp script section select small source span strong style sub summary sup table tbody ' +
		'td textarea tfoot th thead time title tr track u ul var video wbr ' +
		'text password checkbox radio button submit reset file hidden image datetime datetime-local ' +
		'date month time week number range email url search tel color').split(' ');

	var i;
	for (i = 0; i < tags.length; i++) {
		Context.prototype[tags[i]] = (function(tagName) {
			return function() {
				var args = [].slice.call(arguments);
				args.unshift(tagName);
				return this.tag.apply(this, args);
			}
		})(tags[i])
	}

	// Is an "input" type, with type = inputType in arguments actually, so handle it
	for (i = 0; i < inputs.length; i++) {
		Context.prototype[inputs[i]] = (function(inputName) {
			return function() {
				var args = [].slice.call(arguments);
				if (type(args[0]) !== 'object') {
					args.unshift({});
				}
				args[0].type = inputName;
				args.unshift('input');
				return this.tag.apply(this, args);
			}
		})(inputs[i])
	}
})();
module.exports = Context;
