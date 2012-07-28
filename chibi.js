/*Chibi v0.9, Copyright (C) 2012 Kyle Barrow

This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation; either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program; if not, see <http://www.gnu.org/licenses>.*/
(function() {
	'use strict';

	var readyfn = [],
		loadedfn = [],
		domready = false,
		pageloaded = false,
		d = document,
		w = window;

	// Fire any function calls on ready event
	function fireReady() {
		domready = true;

		for (var i = 0; i < readyfn.length; i++) {
			readyfn[i]();
		}
		readyfn = [];
	}

	// Fire any function calls on loaded event
	function fireLoaded() {
		pageloaded = true;

		// For browsers with no DOM loaded support
		if (!domready) {
			fireReady();
		}

		for (var i = 0; i < loadedfn.length; i++) {
			loadedfn[i]();
		}
		loadedfn = [];
	}

	// Check DOM ready, page loaded
	if (d.addEventListener) {
		// Standards
		d.addEventListener('DOMContentLoaded', fireReady, false);
		w.addEventListener('load', fireLoaded, false);
	}
	else if (d.attachEvent) {
		// IE
		d.attachEvent('onreadystatechange', fireReady);
		// IE < 9
		w.attachEvent('onload', fireLoaded);
	}
	else {
		// Anything else
		w.onload = fireLoaded;
	}

	// Utility functions

	// Loop through node array
	function nodeLoop(fn,nodes) {
		// Good idea to walk up the DOM
		var i = nodes.length;

		while (i--) {
			fn(nodes[i]);
		}
	}


	// Convert to camel case
	function cssCamel(property) {
		return property.replace(/-\w/g, function(result){return result.charAt(1).toUpperCase();});
	}

	// Get computed style
	function computeStyle(elm, property) {
		// IE, everything else or null
		return (elm.currentStyle) ? elm.currentStyle[cssCamel(property)] : (w.getComputedStyle) ? w.getComputedStyle(elm, null).getPropertyValue(property) : null;

	}

	// Returns URI encoded query string pair
	function queryPair(name, value) {
		return encodeURIComponent(name).replace(/%20/g, '+') + '=' + encodeURIComponent(value).replace(/%20/g, '+');
	}

	// Get nodes
	function getNodes(selector) {

		var nodelist = [], nodes = [], json = false;

		if (selector) {

			// Element node, would prefer to use (selector instanceof HTMLElement) but no IE support
			if (selector.nodeType && selector.nodeType === 1) {
				nodelist = [selector]; // return element as node list
			}
			// JSON, document object or node list, would prefer to use (selector instanceof NodeList) but no IE support
			else if (typeof selector === 'object' || (typeof selector.length === 'number' && typeof selector.item === 'function')) {
				json = true;
				nodelist = selector;
			}
			else if (typeof selector === 'string') {

				// A very light querySelectorAll polyfill for IE < 8. It suits my needs but is restricted to IE CSS support, is no speed demon, and does leave older mobile browsers in the cold (that support neither querySelectorAll nor currentStyle/getComputedStyle). If you want to use a fuller featured selector engine like Qwery, Sizzle et al, just return results to the nodes array: nodes = altselectorengine(selector)

				// IE < 8
				if (!d.querySelectorAll) {
					// Polyfill querySelectorAll
					d.querySelectorAll = function(selector) {

						var style, head = d.getElementsByTagName('head')[0], allnodes, selectednodes = [];

						style = d.createElement('STYLE');
						style.type = 'text/css';

						if (style.styleSheet) {
							style.styleSheet.cssText = selector + ' {a:b}';

							head.appendChild(style);

							allnodes = d.getElementsByTagName('*');

							for (var i = 0; i < allnodes.length; i++) {
								(computeStyle(allnodes[i], 'a') === 'b') ? selectednodes.push(allnodes[i]) : 0;
							}

							head.removeChild(style);
						}

						return selectednodes;
					};
				}

				nodelist = d.querySelectorAll(selector);
			}
		}

		if(json) {
			nodes = nodelist;
		}
		else {
			// Convert node list to array so results have full access to array methods
			// Array.prototype.slice.call not supported in IE < 9 and often slower than loop anyway
			for (var i = 0; i < nodelist.length; i++) {
				nodes[i] = nodelist[i];
			}
		}

		return nodes;
	}

	// Set CSS, important to wrap in try to prevent error thown on unsupported property
	function setCss(elm, property, value) {
		try {
			elm.style[cssCamel(property)] = value;
		}
		catch (e) {}
	}

	// Show CSS
	function showCss(elm) {
		elm.style.display = '';

		// For elements still hidden by style block
		(computeStyle(elm, 'display') === 'none') ? elm.style.display = 'block' : 0;
	}

	// Handle standard method value returns
	function returnValues(values) {
		values = values.reverse();

		// Return string for singles
		(values.length === 1) ? values = values[0] : 0;

		return values;
	}

	// Serialize form & JSON values
	function serializeData(nodes) {
		var querystring = '',
			subelm;

		if (nodes.constructor === Object) { // Serialize JSON data
			for (subelm in nodes) {
				if (nodes.hasOwnProperty(subelm)) {
					if (nodes[subelm].constructor === Array) {
						for (var i = 0; i < nodes[subelm].length; i++) {
							querystring += '&' + queryPair(subelm, nodes[subelm][i]);
						}
					}
					else {
						querystring += '&' + queryPair(subelm, nodes[subelm]);
					}
				}
			}

		}
		else { // Serialize node data

			nodeLoop(function(elm) {
				if (elm.nodeName === 'FORM') {
					for (var i = 0; i < elm.elements.length; i++) {
						subelm = elm.elements[i];

						if (!subelm.disabled) {
							switch (subelm.type) {
								// Ignore buttons, unsupported XHR 1 form fields
								case 'button':
								case 'image':
								case 'file':
								case 'submit':
								case 'reset':
								break;

								case 'select-one':
									(subelm.length > 0) ? querystring += '&' + queryPair(subelm.name, subelm.value) : 0;
								break;

								case 'select-multiple':
									for (var j = 0; j < subelm.length; j++) {
										(subelm[j].selected) ? querystring += '&' + queryPair(subelm.name, subelm[j].value) : 0;
									}
								break;

								case 'checkbox':
								case 'radio':
									(subelm.checked) ? querystring += '&' + queryPair(subelm.name, subelm.value) : 0;
								break;
								// Everything else including shinny new HTML5 input types
								default:
									querystring += '&' + queryPair(subelm.name, subelm.value);
							}
						}
					}
				}
			},nodes);
		}
		// Tidy up first &
		return (querystring.length > 0) ? querystring.substring(1) : '';
	}

	function chibi(selector) {

		var nodes = getNodes(selector);

		// Public functions
		return {
			// Fire on DOM ready
			ready: function(fn) {
				if (fn) {
					(domready) ? fn() : readyfn.push(fn);
				}
			},
			// Fire on page loaded
			loaded: function(fn) {
				if (fn) {
					(pageloaded) ? fn() : loadedfn.push(fn);
				}
			},
			// Executes a function on nodes
			loop: function(fn) {
				if (typeof fn === "function") {
					nodeLoop(function(elm) {
						fn(elm);
					},nodes);
				}
			},
			// Find nodes
			find: function(filter) {
				if (filter) {
					var temp = [];

					switch (filter) {
						case 'first':
							(nodes.length > 0) ? nodes = [nodes.shift()] : 0;
						break;

						case 'last':
							(nodes.length > 0) ? nodes = [nodes.pop()] : 0;
						break;

						case 'odd':
						case 'even':
							for (var i = (filter === "odd") ? 0 : 1; i < nodes.length; i += 2) {
								temp.push(nodes[i]);
							}
							nodes = temp;
						break;
					}
				}

				return (nodes.length > 0)? (nodes.length === 1)? nodes[0]: nodes: false;
			},
			// Hide node
			hide: function() {
				nodeLoop(function(elm) {
					elm.style.display = 'none';
				},nodes);
			},
			// Show node
			show: function() {
				nodeLoop(function(elm) {
					showCss(elm);
				},nodes);
			},
			// Toggle node display
			toggle: function() {
				nodeLoop(function(elm) {

					// computeStyle instead of style.display == 'none' catches elements that are hidden via style block
					if (computeStyle(elm, 'display') === 'none') {
						showCss(elm);
					}
					else {
						elm.style.display = 'none';
					}

				},nodes);
			},
			// Remove node
			remove: function() {
				var removed = nodes.length;

				nodeLoop(function(elm) {
					// Catch error in unlikely case elm has been removed
					try {
						elm.parentNode.removeChild(elm);
					}
					catch (e) {}
				},nodes);

				// Clear nodes after remove
				nodes = [];
			},
			// Get/Set CSS
			css: function(property, value) {

				var values = [];

				nodeLoop(function(elm) {
					(value) ? setCss(elm, property, value) : (elm.style[cssCamel(property)]) ? values.push(elm.style[cssCamel(property)]) : (computeStyle(elm,property))? values.push(computeStyle(elm,property)) : values.push(null);
				},nodes);

				// Get CSS property: return values
				if (values.length > 0) {
					return returnValues(values);
				}
			},
			// Get/Set/Add/Remove class
			cls: function(classes, action) {
				var values = [], classarray, classname, search, has;

				if (classes) {
					// Trim any whitespace
					classarray = classes.split(' ');
					action = action || 'replace';
				}

				nodeLoop(function(elm) {

					classname = elm.className;

					if (classes) {
						switch (action) {
							case 'add':
								elm.className = classname + " " + classes;
							break;

							case 'replace':
								elm.className = classes;
							break;

							case 'has':
							case 'toggle':
							case 'remove':
								has = true;

								for (var i = 0; i < classarray.length; i++) {

									search = new RegExp('\\b'+classarray[i]+'\\b', 'g');

									if (action === "has") {
										if (!classname.match(search)) {
											has = false;
											break;
										}
									}
									else if (action === "toggle") {
										elm.className = (elm.className.match(search))? elm.className.replace(search, '') : elm.className + " " + classarray[i];
									}
									else { // replace
										elm.className = elm.className.replace(search, '');
									}

								}

								(action === "has")? values.push(has) : 0;

							break;
						}
					}
					else
					{
						values.push(classname);
					}
				},nodes);

				if (values.length > 0) {
					return returnValues(values);
				}

			},
			// Get/Set innerHTML optionally before/after
			html: function(value, location) {
				var values = [],
					tmpnodes, tmpnode;

				nodeLoop(function(elm) {

					if (location) {
						// No insertAdjacentHTML support for FF < 8 and IE doesn't allow insertAdjacentHTML table manipulation, so use this instead
						// Convert string to node. We can't innerHTML on a document fragment
						tmpnodes = d.createElement('div');
						tmpnodes.innerHTML = value;

						while ((tmpnode = tmpnodes.lastChild)) {
							// Catch error in unlikely case elm has been removed
							try {
								if (location === 'before') {
									elm.parentNode.insertBefore(tmpnode, elm);
								}
								else if (location === 'after') {
									elm.parentNode.insertBefore(tmpnode, elm.nextSibling);
								}
							}
							catch (e) {break;}
						}
					}
					else {
						(value) ? elm.innerHTML = value : values.push(elm.innerHTML);
					}
				},nodes);

				if (values.length > 0) {
					return returnValues(values);
				}
			},
			// Get/Set HTML attributes
			attr: function(name, value) {
				var values = [];

				nodeLoop(function(elm) {
					if (name) {
						name = name.toLowerCase();

						switch (name) {
							// IE < 9 doesn't allow style or class via get/setAttribute so switch. cssText returns prettier CSS anyway
							case 'style':
								(value) ? elm.style.cssText = value : elm.style.cssText ? values.push(elm.style.cssText) : values.push(null);
							break;

							case 'class':
								(value) ? elm.className = value : elm.className ? values.push(elm.className) : values.push(null);
							break;

							default:
								(value) ? elm.setAttribute(name, value) : elm.getAttribute(name) ? values.push(elm.getAttribute(name)) : values.push(null);
						}
					}
				},nodes);

				if (values.length > 0) {
					return returnValues(values);
				}

			},
			// Get/Set form element values
			val: function(replacement) {
				var radiogroup = [],
					values = [];

				if (typeof replacement !== 'undefined' && typeof replacement !== 'object') {
					replacement = [replacement];
				}

				nodeLoop(function(elm) {

					if (replacement) {
						switch (elm.nodeName) {
							case 'SELECT':
								for (var i = 0; i < elm.length; i++) {
									// Multiple select
									for (var j = 0; j < replacement.length; j++) {
										elm[i].selected = '';

										if (elm[i].value === replacement[j]) {
											elm[i].selected = 'selected';
											break;
										}
									}
								}
							break;

							case 'INPUT':
								switch (elm.type) {
									case 'checkbox':
									case 'radio':
										elm.checked = '';

										for (var i = 0; i < replacement.length; i++) {
											if (elm.value === replacement[i]) {
												elm.checked = 'checked';
												break;
											}
										}

									break;
									default:
										elm.value = replacement[0];
								}

							break;

							case 'TEXTAREA':
							case 'BUTTON':
								elm.value = replacement[0];
							break;
						}

					}
					else
					{
						switch (elm.nodeName) {
							case 'SELECT':

								var active = values.length;

								values.push([]);

								for (var i = 0; i < elm.length; i++) {
									(elm[i].selected) ? values[active].push(elm[i].value) : 0;
								}

								switch (values[active].length) {
									case 0:
										values[active] = null;
									break;

									case 1:
										values[active] = values[active][0];
									break;
								}

							break;

							case 'INPUT':
								switch (elm.type) {
									case 'checkbox':
										(elm.checked) ? values.push(elm.value) : values.push(null);
									break;

									case 'radio':

										var grouped = false;

										for (var i = 0; i < radiogroup.length; i++) {
											if (radiogroup[i][0] === elm.name) {
												(elm.checked) ? values[radiogroup[i][1]] = elm.value : 0;

												grouped = true;
											}
										}

										if (!grouped) {
											radiogroup.push([elm.name, values.length]);

											(elm.checked) ? values.push(elm.value) : values.push(null);
										}

									break;
									// Everything else including shinny new HTML5 input types
									default:
										values.push(elm.value);
								}

							break;

							case 'TEXTAREA':
							case 'BUTTON':
								values.push(elm.value);
							break;
						}

					}

				},nodes);

				if (values.length > 0) {
					return returnValues(values);
				}
			},
			// Event handler
			on: function(event,fn,clear) {

				(selector === w || selector === d)? nodes = [selector]: 0;

				nodeLoop(function(elm) {
					if (d.addEventListener) {
						(clear)? elm.removeEventListener(event, fn, false) : elm.addEventListener(event, fn, false);
					}
					else if (d.attachEvent) {
						(clear)? elm.detachEvent('on'+event, fn) : elm.attachEvent('on'+event, fn);
					}
				},nodes);
			},
			// Basic XHR 1, no file support. Shakes fist at IE
			ajax: function(url, method, callback, nocache) {
				var xhr,
					method = method || 'GET',
					query = serializeData(nodes),
					querystart = (url.indexOf('?') === -1) ? '?' : '&',
					timestamp = '_ts=' + (+new Date());

				if (w.XMLHttpRequest) {
					xhr = new XMLHttpRequest();
				}
				else if (w.ActiveXObject) {
					xhr = new ActiveXObject('Microsoft.XMLHTTP'); // IE < 9
				}

				if (xhr) {
					method = method.toUpperCase();

					(method === 'GET') ? url += querystart + query : 0;
					(nocache) ? (method === 'POST') ? url += querystart + timestamp : url += '&' + timestamp : 0;

					// Douglas Crockford: "Synchronous programming is disrespectful and should not be employed in applications which are used by people"
					xhr.open(method, url, true);

					(method === 'POST') ? xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded') : 0;

					xhr.send(query);

					xhr.onreadystatechange = function() {
						if (xhr.readyState === 4 && xhr.status === 200) {
							if(callback)
							{
								try {
									callback(xhr.responseText);
								}
								catch (e) {}
							}
						}
					};
				}
			}
		};
	}

	// Set Chibi's global namespace here
	w.$ = chibi;

}());