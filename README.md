# Chibi v1.0.9

#### A tiny JavaScript micro-framework

Think it's OK to serve up 30KB of framework over 3G just to manipulate a couple of DOM elements? Of course you don't because that's an asshat move and you're no asshat. You'll probably instead use a couple of lines of vanilla JavaScript, perhaps a little CSS `:active` with transitions, all while riding a unicorn bareback through a double rainbow, no hands.

Working on something a wee bit more complex? Unlike fat, grown-up frameworks, Chibi focuses on just the essentials, melted down and mixed with optimization rainbows to create a really light micro-framework that allows you to do awesome things, asshatory free.

### The sweet, juicy bits

* Chibi is really tiny: 6KB minified, 2KB gzipped, small enough to stick inline on single page web apps, saving an extra HTTP request.
* Supports modern desktop and mobile browsers including Chrome, Firefox, Internet Explorer, Opera and Safari (see Browser Support below).
* Even supports creaky old browsers like IE6.
* No animation cruft, instead use CSS transitions like a nice person.
* In modern browsers, Chibi typically executes DOM manipulation 20% to 50% faster than grown-up frameworks.

### The lumpy, chewy bits

* Chibi's polyfill for `document.querySelectorAll()` is limited to browser CSS support and is not as fast as some dedicated selector engines. This means no `input[type=text]` or `p:nth-child(even)` selectors with IE6. Fortunately modern browser don't need this polyfill.
* Ancient browsers that support neither `document.querySelectorAll()` nor `window.getComputedStyle` can bugger off.

### Browser Support

Chibi has been tested with and supports the following browsers:

* Android Browser 2.1 or higher
* Blackberry Browser 6 or higher
* Chrome
* Chrome Android
* Firefox 3.5 or higher
* Firefox Mobile
* Internet Explorer 6 or higher
* Internet Explorer Mobile 9 or higher
* Opera 10 or higher
* Opera Mini
* Opera Mobile 10 or higher
* Safari 3.2 or higher
* Safari Mobile 3.2 or higher
* Symbian^3 Browser or higher

Chibi should also work with any other browser that supports `document.querySelectorAll()`.
### Using Chibi

Chibi syntax is similar to that pioneered by jQuery: `$(selector).method()`. It intentionally uses the same `$` namespace as jQuery because micro-frameworks and grown-up frameworks should never mix.

Chibi's supports standard CSS selectors but you can also pass in DOM elements directly:

##### CSS selector

```js
$("p") // Returns an array of all paragraph elements
$("p").hide() // Hides all paragraphs
$("#foo").show() // Shows element with id equal to "foo"
$(".foo").hide() // Hides elements with "foo" CSS class
```

##### A DOM element selector, pointless

```js
$(document.getElementsByTagName('p')).hide() // Hides all paragraphs
```

##### A more interesting DOM element selector

```js
$($('p').find('odd')).hide() // Hides odd paragraphs
```

### Methods

#### $().ready(handler)
*Fires handler when the DOM is ready.*

Use to fire a function when the DOM is ready. Including a selector makes no sense for this method, don't do it.

```js
$().ready(function(){
	// Do awesome
});
```
or perhaps

```js
function foo() {
	// Do awesome
}

$().ready(foo);
```

#### $().loaded(handler)
*Fires handler when the page is loaded.*

Use to fire a function when the page is loaded. Including a selector makes no sense for this method, don't do it.

```js
function foo() {
	// Do awesome
}

$().loaded(foo);
```

#### $(selector).find(filter)
*Finds the selector and optionally filter by first, last, odd or even.*

**find** will return either a single DOM element (only one matching DOM element found), array of DOM elements (more than one matching DOM element found), or false (no matching DOM element found).

**find** can optionally filter results by first, last, odd and even, useful when working with crappy browsers like IE6 with weak CSS pseudo support.

```html
<!DOCTYPE html>
<html>
<head>
<script src="chibi-min.js"></script>
</head>
<body>
<p>Foo</p>
<p>Bar</p>
<p>Foo</p>
<p>Bar</p>
<script>
    $('p').find(); // returns all paragraph elements, as there is more than one paragraph element, this is an array of paragraph elements
    $('p').find('first'); // returns the first paragraph element
    $('p').find('last'); // returns the fourth paragraph element
    $('p').find('odd'); // returns an array of odd paragraph elements
    $('p').find('even'); // returns an array of even paragraph elements
    $('.foo').find(); // returns false;
</script>
</body>
</html>
```

#### $(selector).loop(function)
*Executes a function on the selector*

**loop** passes each selector DOM element to the specified function.

```html
<!DOCTYPE html>
<html>
<head>
<script src="chibi-min.js"></script>
</head>
<body>
<p>Foo</p>
<p>Bar</p>
<script>
	function foo(elm) {
		elm.style.color = "red";
	}

    $('p').loop(foo); // Executes the foo function (sets the element style color to red) on all paragraph elements
</script>
</body>
</html>
```

#### $(selector).hide()
*Hides the selector.*

```html
<!DOCTYPE html>
<html>
<head>
<script src="chibi-min.js"></script>
</head>
<body>
<p>Foo</p>
<p>Bar</p>
<script>
	$('p').hide(); // hides all paragraph elements
</script>
</body>
</html>
```

#### $(selector).show()
*Shows the selector.*

```html
<!DOCTYPE html>
<html>
<head>
<style>
p {display:none}
</style>
<script src="chibi-min.js"></script>
</head>
<body>
<p>Foo</p>
<p>Bar</p>
<script>
	$('p').show(); // shows all paragraph elements
</script>
</body>
</html>
```

#### $(selector).toggle()
*Toggles visibility of the selector.*

```html
<!DOCTYPE html>
<html>
<head>
<script src="chibi-min.js"></script>
</head>
<body>
<p>Foo</p>
<p style="display:none">Bar</p>
<script>
	$('p').toggle(); // shows the second paragraph element, hides the first paragraph element
</script>
</body>
</html>
```

#### $(selector).remove()
*Removes the selector from the DOM tree.*

```html
<!DOCTYPE html>
<html>
<head>
<script src="chibi-min.js"></script>
</head>
<body>
<p>Foo</p>
<p>Bar</p>
<script>
	$('p').remove(); // removes all the paragraph elements from the DOM tree
</script>
</body>
</html>
```

#### $(selector).css(property, value)
*Gets or optionally sets the CSS property for the selector.*

**css** with no *value* will return either a CSS property string (only one matching DOM element found) or array of CSS property strings (more than one matching DOM element found). **css** will return the computed property value if the property isn't explicitly set which can vary between browsers. For example, an element with no explicit font weight will return 'normal' in Opera and Webkit browsers but '400' in Firefox and Internet Explorer browsers.

*value* will set the value of the CSS property for all matching DOM elements.

```html
<!DOCTYPE html>
<html>
<head>
<style>
.bold {font-weight:900}
</style>
<script src="chibi-min.js"></script>
</head>
<body>
<p>Foo</p>
<p class="bold">Bar</p>
<script>
	$('p').css('font-weight'); // returns the "font-weight" on all paragraph elements, as there is more than one paragraph element, an array ['normal','900']
	$('p').css('color','red'); // sets all paragraph elements color to red
</script>
</body>
</html>
```

#### $(selector).cls(class, replace/add/remove/toggle/has)
*Gets or optionally sets the class for a selector.*

**cls** with no arguments will return either a class string (only one matching DOM element found) or array of class strings (more than one matching DOM element found).

If only the *class* argument is specified, the default action is to replace any DOM element class with this class. If the *has* action is specified, Chibi returns true if the selector includes the *class*.

```html
<!DOCTYPE html>
<html>
<head>
<style>
.bold {font-weight:900}
.red {color:red}
.mono {font-family:monospace}
</style>
<script src="chibi-min.js"></script>
</head>
<body>
<p>Foo</p>
<p class="mono">Bar</p>
<script>
	$('p').cls(); // returns classes set on all paragraph elements, as there is more than one paragraph element, an array ['', 'mono']
	$('p').cls('mono','has'); // returns true if the paragraph element includes the 'mono' class, as there is more than one paragraph element, an array [false, true]
	$('p').cls('mono','toggle'); // toggles the mono class on all paragraph elements
	$('p').cls('red bold'); // sets the class to "red" and "bold" to all paragraph elements, replacing any existing classes
	$('p').cls('red bold','replace'); // also sets the class to "red" and "bold" to all paragraph elements, replacing any existing classes
	$('p').cls('mono','add'); // adds the "mono" class to all paragraph elements
	$('p').cls('bold','remove'); // removes the "bold" class from all paragraph elements
</script>
</body>
</html>
```

#### $(selector).html(html, before/after)
*Gets or optionally sets the inner HTML for a selector. Optionally inserts HTML before or after the element.*

**html** with no arguments will return either an HTML string (only one matching DOM element found) or array of HTML strings (more than one matching DOM element found).

If only the *html* argument is specified, this will replace the inner HTML of the DOM element. Optionally *before* inserts *html* before the DOM element and *after* inserts *html* after the DOM element

```html
<!DOCTYPE html>
<html>
<head>
<script src="chibi-min.js"></script>
</head>
<body>
<p>Foo</p>
<p>Bar</p>
<script>
	$('p').html(); // returns an inner HTML of all paragraph elements, as there is more than one paragraph element, an array ['Foo','Bar']
	$('p').html('<i>Foobar</i>'); // Sets the inner HTML of all paragraph elements to "<i>Foobar</i>"
	$('p').html('<p>Foobar</p>','after'); // Inserts "<p>Foobar</p>" after all paragraph elements
	$('p').html('<p>Foobar</p>','before'); // Inserts "<p>Foobar</p>" before all paragraph elements
</script>
</body>
</html>
```

#### $(selector).attr(property, value)
*Gets or optionally sets the property for a selector.*

**attr** with no arguments will return either a property string (only one matching DOM element found) or array of property strings (more than one matching DOM element found).

*value* will set the value of the property for all matching DOM elements.

```html
<!DOCTYPE html>
<html>
<head>
<script src="chibi-min.js"></script>
</head>
<body>
<p><a href="http://en.wikipedia.org/wiki/Foobar">Foobar</a></p>
<script>
	$('a').attr('href'); // returns the "href" property for all link elements, as there is only one, a string "http://en.wikipedia.org/wiki/Foobar"
	$('a').attr('target','_blank'); // sets the "target" property for all link elements to "_blank"
</script>
</body>
</html>
```

#### $(selector).val(value)
*Gets or optionally sets the value of a form element selector.*

**val** with no arguments will return either a value string (only one matching form field DOM element found) or array of value strings (more than one matching form field DOM element found).

*value* will set the value of the matching form field DOM elements.


```html
<!DOCTYPE html>
<html>
<head>
<script src="chibi-min.js"></script>
</head>
<body>
<form>
<input type="text" value="Foobar" name="text">
</form>
<script>
	$('input').val(); // returns the value for all input elements, as there is only one, a string "Foobar"
	$('input').val('Foo Bar'); // sets the value for all input elements to "Foo Bar"
</script>
</body>
</html>
```

#### $(selector).on(event, listener, clear)
*Adds an event listener to the selector, optionally clears the event listener.*

**on** adds an event listener to the selector. There is no need to use the HTML event format ('on' + event) as Chibi will automatically prefix the event as required. **on** also supports passing `window` and `document` as the selector.

```html
<!DOCTYPE html>
<html>
<head>
<script src="chibi-min.js"></script>
</head>
<body>
<p>Foo</p>
<p>Bar</p>
<script>
	function foo() {
		// Do awesome
	}

	$('p').on('click',foo); // adds the 'foo' click event listener to all paragraphs
	$('p').on('click',foo,true); // removes the 'foo' click event listener from all paragraphs
</script>
</body>
</html>
```

#### $(selector).ajax(url, method, callback, nocache, nojsonp)
*Sends an AJAX request, optionally firing a callback with the XHR `responseText` and `status`*

**ajax** uses the GET method if none is specified. When *nocache* is true, a `_ts` time stamp is added to the URL to prevent caching, yes, I'm looking at you Android Browser and iOS 6.

**ajax** supports JSON as a selector ({name:value}), useful for when you want to send data without using form field DOM elements.

For cross-domain requests, **ajax** uses JSONP by default but this is overridden when *nojsonp* is true. JSONP requests will apply any *callback* to `callback=?` or similar in the **ajax** url. The *method* is obviously always `GET` for JSONP requests.

```html
<!DOCTYPE html>
<html>
<head>
<script src="chibi-min.js"></script>
</head>
<body>
<form>
<input type="text" value="Foobar" name="text">
</form>
<script>
	// XHR all form data using "GET" to "ajax.html"
	$('form').ajax('ajax.html');

	// XHR the JSON using "GET" to "ajax.html"
	$({text:'Foo Bar'}).ajax('ajax.html');

	// XHR all form data using "POST" to "ajax.html", returns responseText and status, adds a cache busting time stamp
	$('form').ajax('ajax.html',"POST",function(data,status){
		// Do awesome
	},true);
</script>
</body>
</html>
```
```html
<!DOCTYPE html>
<html>
<head>
<script src="chibi-min.js"></script>
</head>
<body>
<script>
	// JSONP
	$().ajax('https://api.github.com/users/kylebarrow/repos?sort=created&direction=asc&callback=?','GET',function(data,status){
		// Do awesome
	});

	// JSONP with JSON query
	$({sort: "created", direction: "asc", callback: "?"}).ajax('https://api.github.com/users/kylebarrow/repos','GET',function(data,status){
		// Do awesome
	});
</script>
</body>
</html>
```

##### FIN