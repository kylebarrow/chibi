/*
Chibi v0.1, Copyright (C) 2012 Kyle Barrow

This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation; either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program; if not, see <http://www.gnu.org/licenses>.
 */
(function () {

	var nodes = [],
		domready = false,
		domtimer = false,
		domfn = [],
		framedContent = false,
		d = document,
		w = window;

	// Check DOM ready

	if(d.addEventListener) {
		// Standards
		d.addEventListener('DOMContentLoaded', function(){domready=true;}, false);
		w.addEventListener('load',function(){domready=true;}, false);
	}
	else if(d.attachEvent) {
		// IE
		d.attachEvent('onreadystatechange',function(){domready=true;});
		// IE < 9
		w.attachEvent('onload',function(){domready=true;});
	}
	else
	{
		// Anything else
		w.onload = function(){domready=true;};
	}

	// Handle any function calls on ready state
	var fireReady = function()
	{
		if(domready)
		{
			if(domtimer)
			{
				clearTimeout(domtimer);
			}

			for (var i=0; i < domfn.length; i++)
			{
				domfn[i]();
			}

			domfn = [];

		}
		else
		{
			domtimer = setTimeout(fireReady,0);
		}
	};

	// Utility functions

	// Loop through node array
	var nodeLoop = function(fn)
	{
		// Good idea to walk up the DOM
		for (var i=nodes.length-1; i >= 0; i--)
		{
			fn.call(this, nodes[i]);
		}
	};

	// Get computed style
	var computeStyle = function(elm, property)
	{
		// IE, everything else or null
		return (elm.currentStyle) ? elm.currentStyle[property]  : (w.getComputedStyle)? w.getComputedStyle(elm,null).getPropertyValue(property) : null;

	};

	// Returns URI encoded query string pair
	var queryPair = function(name, value)
	{
		return encodeURIComponent(name).replace(/%20/g, '+') + '=' + encodeURIComponent(value).replace(/%20/g, '+');
	};

	// Get nodes
	var getNodes = function(selector)
	{
		// Clear nodes
		nodes = [];

		if(selector)
		{

			/*
			This CSS selector engine is very light but limited to browser CSS support. This suits my needs when combined with the basic find(pseudo) but if you want to use a fuller featured engine like Qwery, Sizzle et al, just return their resulting node list to the nodes array.
			*/

			// Element node, would prefer to use (selector instanceof HTMLElement) but no IE support
			if(selector.nodeType && selector.nodeType === 1)
			{
				nodes = [selector]; // return element as node list
			}
			// JSON, document object or node list, would prefer to use (selector instanceof NodeList) but no IE support
			else if(typeof selector === 'object' || typeof selector.length === 'number' && typeof selector.item === 'function')
			{
				nodes = selector;
			}
			else if(typeof selector === 'string')
			{
				// IE < 8
				if(!d.querySelectorAll)
				{
					// Polyfill querySelectorAll
					d.querySelectorAll = function(selector){

						nodes = [];

						var style, head, tmpnodes;

						style = d.createElement('STYLE');
						style.type = 'text/css';


						if(style.styleSheet)
						{
							style.styleSheet.cssText = selector + ' {a:b}';

							if(d.getElementsByTagName('head').length === 0)
							{
								head = d.createElement('head');
								d.getElementsByTagName('html')[0].appendChild(head);
							}

							d.getElementsByTagName('head')[0].appendChild(style);

							tmpnodes = d.getElementsByTagName('*');

							for (var i=0; i < tmpnodes.length; i++)
							{
								(computeStyle(tmpnodes[i],'a') === 'b') ? nodes.push(tmpnodes[i]) : 0;
							}

							d.getElementsByTagName('head')[0].removeChild(style);
						}

						return nodes;
					};
				}

				nodes = d.querySelectorAll(selector);
			}
		}
	};

	// Set CSS, important to wrap in try to prevent error firing on unsupported value
	var setCss = function(elm,property,value)
	{
		try {
			elm.style[property] = value;
			// Successfully set property for element, set match to true
			return true;
		}
		catch(e) {
			// Unsuccessfully set property for element, set match to false
			return false;
		}
	};

	// Handle standard function returns
	var returnValues = function(values)
	{
		values = values.reverse();

		// Return string for singles
		(values.length === 1) ? values = values[0] : 0;

		return values;

	};

	// Serialize form & JSON values
	var serializeData = function(obj)
	{
		var querystring = '', elm;

		if(obj.constructor === Object) // Serialize JSON data
		{
			for(elm in obj) {

				if(obj[elm].constructor === Array)
				{
					for (var i=0; i < obj[elm].length; i++)
					{
						querystring += '&' + queryPair(elm, obj[elm][i]);
					}

				}
				else
				{
					querystring += '&' + queryPair(elm, obj[elm]);
				}

			}

		}
		else // Serialize form data
		{
			// Single XHR of more then one form is too edgy so only get first form found
			obj = (obj.length > 0) ? obj[0] : obj;

			if(obj.nodeName === 'FORM')
			{
				querystring = '';

				for (var i=0; i < obj.elements.length; i++)
				{
					elm = obj.elements[i];

					if(!elm.disabled)
					{
						switch (elm.type) {
							// Ignore buttons, unsupported XHR 1 form fields
							case 'button':
							case 'image':
							case 'file':
							case 'submit':
							case 'reset':
							break;

							case 'select-one':
								(elm.length > 0)? querystring += '&' + queryPair(elm.name, elm.value) : 0;
							break;

							case 'select-multiple':
								for (var j=0; j < elm.length; j++)
								{
									(elm[j].selected) ? querystring += '&' + queryPair(elm.name, elm[j].value) : 0;
								}
							break;

							case 'checkbox':
							case 'radio':
								(elm.checked) ? querystring += '&' + queryPair(elm.name, elm.value) : 0;
							break;

							default:
								querystring += '&' + queryPair(elm.name, elm.value);
						}

					}
				}
			}

		}

		// Remove first &
		(querystring.length > 0) ? querystring = querystring.substring(1) : 0;

		return querystring;

	};


	var $ = function(selector){

		getNodes(selector);

		// Public functions

		return {
			// Check DOM ready
			ready : function(fn)
			{
				if(fn)
				{
					domfn.push(fn);
					fireReady();
				}
			},
			// Find elements
			find : function(pseudo)
			{
				if(pseudo)
				{
					var temp = [];

					switch(pseudo)
					{
						case 'first':
							(nodes.length > 0) ? nodes = [nodes[0]] : 0; // Wishing shift() had wider support
						break;

						case 'last':
							(nodes.length > 0) ? nodes = [nodes[nodes.length-1]] : 0; // Wishing pop() had wider support
						break;

						case 'odd':
							for (var i=0; i < nodes.length; i+=2)
							{
								temp.push(nodes[i]);
							}
							nodes = temp;
						break;

						case 'even':
							for (var i=1; i < nodes.length; i+=2)
							{
								temp.push(nodes[i]);
							}
							nodes = temp;
						break;
					}
				}

				return nodes;
			},
			// Hide and element
			hide: function() {
				nodeLoop(function(elm){
					elm.style.display = 'none';
				});
			},
			// Show an element
			show: function() {
				nodeLoop(function(elm){
					elm.style.display = '';

					// For elements still hidden by style block
					(computeStyle(elm, 'display') === 'none') ? elm.style.display = 'block' : 0;
				});
			},
			// Toggle the display of an element
			toggle: function() {
				nodeLoop(function(elm){

					// computeStyle instead of style.display == 'none' catches elements that are hidden via style block
					if(computeStyle(elm,'display') === 'none')
					{
						elm.style.display = '';

						// For elements still hidden by style block
						(computeStyle(elm,'display') === 'none') ? elm.style.display = 'block' : 0;
					}
					else
					{
						elm.style.display = 'none';
					}

				});
			},
			// Remove an element
			remove: function()
			{
				var removed = nodes.length;

				nodeLoop(function(elm){
					elm.parentNode.removeChild(elm);
				});
			},
			// Get/Set CSS
			css: function(property,value){

				var values = [];

				nodeLoop(function(elm){
					(value)? setCss(elm,property,value) : (elm.style[property])? values.push(elm.style[property]) : values.push(null);
				});

				// Get CSS property: return values
				if(values.length > 0)
				{
					values = values.reverse();

					// Return string for singles
					(values.length === 1) ? values = values[0] : 0;

					return values;
				}
			},
			// Get/Set innerHTML optionally before/after
			html : function(value,location)
			{
				var values = [], tmpnodes, tmpnode;

				nodeLoop(function(elm){

					if(location)
					{
						// insertAdjacentHTML support is a bit flaky, so use this instead
						// Convert string to node
						tmpnodes = document.createElement('div');
						tmpnodes.innerHTML = value;

						while ((tmpnode = tmpnodes.lastChild)) {
							(location === 'before') ? elm.parentNode.insertBefore(tmpnode,elm) : elm.parentNode.insertBefore(tmpnode,elm.nextSibling);
						}

					}
					else
					{
						(value) ? elm.innerHTML = value : values.push(elm.innerHTML);
					}
				});

				if(values.length > 0) {
					return returnValues(values);
				}
			},
			// Get/Set HTML attributes
			attr : function(name, value)
			{
				var values = [];

				nodeLoop(function(elm){
					if(name)
					{
						switch(name)
						{
							// IE < 9 doesn't handle style or class via get/setAttribute so switch, cssText returns prettier CSS anyway
							case 'style':
								(value)? elm.style.cssText = value : elm.style.cssText? values.push(elm.style.cssText) : values.push(null);
							break;

							case 'class':
								(value)? elm.className = value : elm.className? values.push(elm.className) : values.push(null);
							break;

							default:
								(value)? elm.setAttribute(name,value) : elm.getAttribute(name)?  values.push(elm.getAttribute(name)) : values.push(null);
						}
					}
				});

				if(values.length > 0) {
					return returnValues(values);
				}

			},
			// Get/Set form element values
			val : function(replacement)
			{
				var radiogroup = [], values = [];

				if(typeof replacement !== 'undefined' && typeof replacement !== 'object')
				{
					replacement = [replacement];
				}

				nodeLoop(function(elm){
					if(replacement)
					{
						switch(elm.nodeName)
						{
							case 'SELECT':
								for (var i=0; i < elm.length; i++)
								{
									for (var j=0; j < replacement.length; j++)
									{
										elm[i].selected = '';

										if(elm[i].value === replacement[j])
										{
											elm[i].selected = 'selected';
											break;
										}
									}
								}
							break;

							case 'INPUT':
								switch(elm.type)
								{
									case 'checkbox':
									case 'radio':
										elm.checked = '';

										for (var i=0; i < replacement.length; i++)
										{
											if(elm.value === replacement[i])
											{
												elm.checked = 'checked';
												break;
											}
										}

									break;

									default: elm.value = replacement[0];
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
						switch(elm.nodeName)
						{
							case 'SELECT':

								var active = values.length;

								values.push([]);

								for (var i=0; i < elm.length; i++)
								{
									(elm[i].selected) ? values[active].push(elm[i].value) : 0;
								}

								switch(values[active].length)
								{
									case 0:
										values[active] = null;
									break;

									case 1:
										values[active] = values[active][0];
									break;
								}

							break;

							case 'INPUT':

								switch(elm.type)
								{
									case 'checkbox':
										(elm.checked) ? values.push(elm.value) : values.push(null);
									break;

									case 'radio':

										var grouped = false;

										for (var i=0; i < radiogroup.length; i++)
										{
											if(radiogroup[i][0] === elm.name)
											{
												(elm.checked) ? values[radiogroup[i][1]] = elm.value : 0;

												grouped = true;
											}
										}

										if(!grouped)
										{
											radiogroup.push([elm.name,values.length]);

											(elm.checked) ? values.push(elm.value) : values.push(null);
										}

									break;

									default: values.push(elm.value);
								}

							break;

							case 'TEXTAREA':
							case 'BUTTON':
								values.push(elm.value);
							break;
						}

					}

				});

				if(values.length > 0) {
					return returnValues(values);
				}
			},
			// Basic XHR 1, no file support. Shakes fist at IE
			ajax : function(url,method,callback,nocache)
			{
				var xhr, method = method.toUpperCase(), query = serializeData(nodes), timestamp = '_ts='+(+new Date());

				if(w.XMLHttpRequest) {
					xhr = new XMLHttpRequest();
				}
				else if(w.ActiveXObject) {
					xhr = new ActiveXObject('Microsoft.XMLHTTP'); // IE < 9
				}

				if(xhr)
				{
					method = method.toUpperCase();

					url = (nocache) ? (method === 'POST')? url + '?' + timestamp : url + '?' + query +  '&'+ timestamp : (method === 'POST')? url :  url + '?' + query;

					xhr.open(method, url, true);

					(method === 'POST')? xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded') : 0;

					xhr.send(query);

					xhr.onreadystatechange = function() {
						if(xhr.readyState === 4 && xhr.status === 200) {
							try
							{
								callback(xhr.responseText);
							}
							catch(e) {}
						}
					};
				}
			}

		};
	};

	w.$ = $;

}());

