# Chibi v3.0.8

#### A tiny JavaScript micro-library

Think it's OK to serve up 30KB over 3G just to manipulate a couple of DOM elements? Of course you don't because that's an asshat move and you're no asshat. You'll probably instead use a couple of lines of vanilla JavaScript, perhaps a little CSS `:active` with transitions, all while riding a unicorn bareback through a double rainbow, no hands.

Working on something a wee bit more complex? Unlike fat, grown-up frameworks and libraries, Chibi focuses on just the essentials, melted down and mixed with optimisation rainbows to create a really light micro-library that allows you to do awesome things, asshatory free.

### The sweet, juicy bits

* Chibi is really tiny: 7KB minified, 3KB gzipped, small enough to stick inline on single page web apps, saving an extra HTTP request.
* Supports modern desktop and mobile browsers including Chrome, Firefox, Internet Explorer, Opera and Safari (see Browser Support below).
* Even supports creaky old browsers like IE6, I don't know why you would do this.
* No animation cruft, instead use CSS transitions like a nice person.
* In modern browsers, Chibi typically executes DOM manipulation 20% to 50% faster than grown-up libraries.

### The lumpy, chewy bits

* Chibi's polyfill for `document.querySelectorAll()` is limited to browser CSS support and is not as fast as some dedicated selector engines. This means no `input[type=text]` or `p:nth-child(even)` selectors with IE6. Fortunately modern browser don't need this polyfill.
* Ancient browsers that support neither `document.querySelectorAll()` nor `window.getComputedStyle` can bugger off.

**Version 3 is a major update with many breaking changes. If it's difficult to embrace change, version 1 is still available [here](https://github.com/kylebarrow/chibi/tree/1.1.5).**

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

### Installation

Grab it from [here](https://github.com/kylebarrow/chibi/) or

```shell
npm install chibijs
```

### Using Chibi

Chibi syntax is similar to that pioneered by jQuery: `$(selector).method()`. It intentionally uses the same `$` namespace as jQuery because micro-libraries and grown-up libraries should never mix.

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
$($('p')[0]).hide() // Hides first paragraph
```

### Methods

Chibi supports method chaining `$(selector).method().anothermethod().evenmoremethods()` of any method not returning a value (string, boolean, etc.).

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

#### $(selector).each(function)
*Executes a function on each matching element*

**each** passes each matching element to the specified function.

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

    $('p').each(foo); // Executes the foo function (sets the element style color to red) on all paragraph elements
    
    // An alternative way to achieve the above
    $('p').each(function(elm) {
		$(elm).css('color','red');  
    })
    
    
</script>
</body>
</html>
```

#### $(selector).first()
*Finds the first matching element.*

**first** will return an array containing the first matching element, useful when working with crappy browsers like IE6 with weak CSS pseudo support, especially when combined with method chaining.

#### $(selector).last()
*Finds the last matching element.*

**last** will return an array containing the last matching element.

#### $(selector).odd()
*Finds matching odd elements.*

**odd** will return an array containing matching odd elements.

#### $(selector).even()
*Finds matching even elements.*

**even** will return an array containing matching even elements.


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
    $('p').first(); // returns an array containing the first paragraph element
    $('p').last(); // returns an array containing the fourth paragraph element
    $('p').odd(); // returns an array of odd paragraph elements
    $('p').even(); // returns an array of even paragraph elements
</script>
</body>
</html>
```

#### $(selector).hide()
*Hides matching elements.*

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
*Shows matching elements.*

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
*Toggles visibility of matching elements.*

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
*Removes matching elements from the DOM tree.*

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
*Gets or optionally sets the CSS property for matching elements.*

**css** with no *value* will return the CSS property string of the first matching element found. **css** will return the computed property value if the property isn't explicitly set which can vary between browsers. For example, an element with no explicit font weight will return 'normal' in Opera and Webkit browsers but '400' in Firefox and Internet Explorer browsers.

*value* will set the value of the CSS property for all matching elements.

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
	$('p').css('font-weight'); // returns the "font-weight" of the first paragraph element
	$('p').css('color','red'); // sets all paragraph elements color to red
</script>
</body>
</html>
```

#### $(selector).getClass()
*Gets class for first matching element found.*

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
<div class="red">Foo</div>
<div class="mono">Bar</div>
<p >Foo</p>
<p class="mono">Bar</p>
<script>
	$('div').getClass(); // returns 'red', the class of the first div element
	$('p').getClass(); // returns undefined as the first paragraph element has no class set
</script>
</body>
</html>
```

#### $(selector).setClass(class)
*Sets the class of all matching elements replacing any existing element class with this class.*

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
	$('p').setClass('red bold'); // sets the class to "red" and "bold" for all paragraph elements
</script>
</body>
</html>
```

#### $(selector).addClass(class)
*Adds a class to all matching elements.*

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
	$('p').addClass('mono'); // adds the "mono" class to all paragraph elements
</script>
</body>
</html>
```

#### $(selector).removeClass(class)
*Removes class from all matching elements.*

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
	$('p').removeClass('mono'); // removes the "mono" class from all paragraph elements
</script>
</body>
</html>
```

#### $(selector).toggleClass(class)
*Toggles class for matching elements.*

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
	$('p').toggleClass('mono'); // toggles the mono class on all paragraph elements
</script>
</body>
</html>
```

#### $(selector).hasClass(class)
*Returns true if first matching element found includes the class.*

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
<div class="red">Foo</div>
<div class="mono">Bar</div>
<p>Foo</p>
<p class="mono">Bar</p>
<script>
	$('div').cls('red'); // returns true as the first div element includes the 'red' class
	$('p').cls('mono'); // returns undefined as the first paragraph element doesn't include the 'mono' class
</script>
</body>
</html>
```

#### $(selector).html(html)
*Gets or optionally sets the inner HTML of matching elements.*

**html** with no arguments will return the HTML string of the first matching element found.

If the *html* argument is specified, this will replace the inner HTML of all matching elements.

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
	$('p').html(); // returns an inner HTML "Foo" of the first paragraph element
	$('p').html('<i>Foobar</i>'); // Sets the inner HTML of all paragraph elements to "<i>Foobar</i>"
</script>
</body>
</html>
```

#### $(selector).htmlBefore(value)
*Inserts html before all matching elements.*

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
	$('p').htmlBefore('<i>Foobar</i>'); // Inserts "<i>Foobar</i>" before all paragraph elements
</script>
</body>
</html>
```

#### $(selector).htmlAfter(value)
*Inserts html after all matching elements.*

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
	$('p').htmlAfter('<i>Foobar</i>'); // Inserts "<i>Foobar</i>" after all paragraph elements
</script>
</body>
</html>
```

#### $(selector).htmlAppend(value)
*Inserts html after all matching elements inner elements.*

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
	$('p').htmlAppend('<i>Foobar</i>'); // Inserts "<i>Foobar</i>" after all paragraph child elements
</script>
</body>
</html>
```

#### $(selector).htmlPrepend(value)
*Inserts html before all matching elements inner elements.*

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
	$('p').htmlPrepend('<i>Foobar</i>'); // Inserts "<i>Foobar</i>" before all paragraph child elements
</script>
</body>
</html>
```

#### $(selector).attr(property, value)
*Gets or optionally sets the property for all matching elements.*

**attr** with no value argument will return the property string of the first matching element found.

*value* will set the value of the property for all matching elements.

```html
<!DOCTYPE html>
<html>
<head>
<script src="chibi-min.js"></script>
</head>
<body>
<p><a href="http://en.wikipedia.org/wiki/Foobar">Foobar</a></p>
<script>
	$('a').attr('href'); // returns the "href" property value "http://en.wikipedia.org/wiki/Foobar" of the first link element
	$('a').attr('target','_blank'); // sets the "target" property for all link elements to "_blank"
</script>
</body>
</html>
```

#### $(selector).data(key, value)
*Gets or optionally sets the data key value for all matching elements.*

**data** with no *value* argument will return the data key value of the first matching element found.

*value* will set the value of the data key for all matching elements.

```html
<!DOCTYPE html>
<html>
<head>
<script src="chibi-min.js"></script>
</head>
<body>
<p data-test="foo"></p>
<p data-test="bar"></p>
<script>
	$('p').data('test'); // returns "foo" for data key "test" of first paragraph element found
	$('p').data('test','foobar'); // sets the date key "test" value to "foobar" on all matching paragraph elements
</script>
</body>
</html>
```

#### $(selector).val(value)
*Gets or optionally sets the value of matching form elements.*

**val** with no arguments will return the value string of the first matching form element found. For select lists, Chibi will return the selected option value string, if any. For select lists with multiple selects, Chibi will return an array of selected option value strings, if any.

*value* will set the value of matching form field elements. For select lists, this will select the option matching this value. For select lists with multiple selects, passing an array of values will select all options in the select list matching these values.


```html
<!DOCTYPE html>
<html>
<head>
<script src="chibi-min.js"></script>
</head>
<body>
<form>
<input type="text" value="Foobar" name="text">
<select multiple="multiple">
	<option value="foo">Foo</option>
	<option value="bar" selected="selected">Bar</option>
</select>
</form>
<script>
	$('input').val(); // returns "Foobar"
	$('input').val('Foo Bar'); // sets the value for all input elements to "Foo Bar"
	$('select').val(); // returns "bar", the selected option value 
	$('select').val('foo'); // selects the option matching "foo"
	$('select').val(['foo','bar']); // selects the options matching "foo" or "bar" values
</script>
</body>
</html>
```

#### $(selector).checked(boolean)
*Gets or optionally sets checked status of checkbox or radio elements.*

**checked** with no arguments will return the checked boolean of the first matching element found.

*boolean* will set the checked status of matching checkbox or radio elements.

```html
<!DOCTYPE html>
<html>
<head>
<script src="chibi-min.js"></script>
</head>
<body>
<form>
<input type="checkbox" value="Foobar" name="chk">
</form>
<script>
	$('input').checked(true); // checks the checkbox
	$('input').checked(); // returns true
	$('input').checked(false); // unchecks the checkbox
	$('input').checked(); // returns false
</script>
</body>
</html>
```

#### $(selector).on(event, listener)
*Adds an event listener to all matching elements.*

**on** adds an event listener to all matching elements. There is no need to use the HTML event format ('on' + event) as Chibi will automatically prefix the event as required. **on** also supports passing `window` and `document` as the selector.

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
</script>
</body>
</html>
```

#### $(selector).off(event, listener)
*Removed an event listener from all matching elements.*

**off** removed an event listener from all matching elements. There is no need to use the HTML event format ('off' + event) as Chibi will automatically prefix the event as required. **off** also supports passing `window` and `document` as the selector.

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

	$('p').on('click',foo); // adds the 'foo' click event listener to all paragraph elements
	$('p').off('click',foo); // removes the 'foo' click event listener from all paragraph elements
</script>
</body>
</html>
```

#### $(selector).get(url, callback, nocache, nojsonp)
*Sends a GET AJAX request, optionally firing a callback with the XHR `responseText` and `status`. Alias of $(selector).ajax with GET method*

When *nocache* is true, a `_ts` time stamp is added to the URL to prevent caching, yes, I'm looking at you Android Browser and iOS 6.

**get** supports JSON as a selector ({name:value}), useful for when you want to send data without using form elements.

For cross-domain requests, **get** uses JSONP by default but this is overridden when *nojsonp* is true. JSONP requests will apply any *callback* to `callback=?` or similar in the **get** url.

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
	$('form').get('ajax.html');

	// XHR the JSON using "GET" to "ajax.html"
	$({text:'Foo Bar'}).get('ajax.html');

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
	$().get('https://api.github.com/users/kylebarrow/repos?sort=created&direction=asc&callback=?',function(data,status){
		// Do awesome
	});

	// JSONP with JSON query
	$({sort: "created", direction: "asc", callback: "?"}).get('https://api.github.com/users/kylebarrow/repos',function(data,status){
		// Do awesome
	});
</script>
</body>
</html>
```

#### $(selector).post(url, callback, nocache)
*Sends a POST AJAX request, optionally firing a callback with the XHR `responseText` and `status`. Alias of $(selector).ajax with POST method*

When *nocache* is true, a `_ts` time stamp is added to the URL to prevent caching.

**post** supports JSON as a selector ({name:value}), useful for when you want to send data without using form elements.

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
	// XHR the JSON using "POST" to "ajax.html"
	$({text:'Foo Bar'}).post('ajax.html');	
	
	// XHR all form data using "POST" to "ajax.html", returns responseText and status, adds a cache busting time stamp
	$('form').post('ajax.html',function(data,status){
		// Do awesome
	},true);
</script>
</body>
</html>
```

#### $(selector).ajax(url, method, callback, nocache, nojsonp)
*Sends an AJAX request, optionally firing a callback with the XHR `responseText` and `status`*

**ajax** uses the GET method if none is specified. When *nocache* is true, a `_ts` time stamp is added to the URL to prevent caching.

**ajax** supports JSON as a selector ({name:value}), useful for when you want to send data without using form elements.

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

### Modify, build, contribute

```shell
npm install
gulp
```

##### FIN
