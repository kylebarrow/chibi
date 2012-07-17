# Chibi v0.2

#### A tiny JavaScript micro-framework

Think it's OK to serve up 30KB of framework over 3G just to manipulate a couple of DOM elements? Of course you don't because that's an asshat move and you're no asshat. You'll probably instead use a couple of lines of vanilla JavaScript, perhaps a little CSS `:active` with transitions, all while riding a unicorn bareback through a double rainbow, no hands.

Because you understand we are all born with a finite number of keystrokes, you've probably created snippets in your favorite text editor of your most used vanilla JavaScript. Chibi takes some of my snippets, melts them down and mixes  them with optimization rainbows to create a really light micro-framework.

### The sweet, juicy bits ###
* Chibi is really tiny: 5KB minified, 2KB gzipped, small enough to stick inline on single page web apps, saving an extra HTTP request.
* Supports modern desktop and mobile browsers including Chrome, Internet Explorer, Firefox, Opera and Safari.
* Supports creaky old browsers like IE7. Chibi may also support IE6 but this hasn't been tested and I really don't care.
* No animation cruft, instead use CSS transitions like a nice person.
* In modern browsers, Chibi typically executes DOM manipulation 20% to 50% faster than grown-up frameworks.

### The lumpy, chewy bits
* Chibi's polyfill for `document.querySelectorAll()` is limited to browser CSS support and is not as fast of some dedicated selector engines. This means no `input[type=text]` or `p:nth-child(even)` selectors with IE7. Fortunately modern browser don't need this polyfill.
* Ancient browsers that support neither `document.querySelectorAll()` nor `window.getComputedStyle` can bugger off.

### Using Chibi

Chibi syntax is similar to that pioneered by jQuery: `$(selector).method()`. It intentionally uses the same `$` namespace as jQuery because micro-frameworks and grown-up frameworks should never mix.

Chibi's supports standard CSS selectors but you can also pass in DOM elements directly:

##### CSS selector

```js
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

#### $(selector).find(*filter*)
*Finds the selector and optionally filter by first, last, odd or even.*

**find** will return either a single DOM element (only one matching DOM element found), array of DOM elements (more than one matching DOM element found), or false (no matching DOM element found).

**find** can optionally filter results by first, last, odd and even, useful when working with crappy browsers like IE7 with weak CSS pseudo support.

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

#### $(selector).css(property,*value*)
*Gets or optionally sets the CSS property for the selector.*

**css** with no *value* will return either a CSS property string (only one matching DOM element found) or array of CSS property strings (more than one matching DOM element found).

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
	$('p').css('color:red'); // sets all paragraph elements color to red
</script>
</body>
</html>
```

#### $(selector).cls(*class*,*replace/add/remove*)
*Gets or optionally sets the class for a selector.*

**cls** with no arguments will return either a class string (only one matching DOM element found) or array of class strings (more than one matching DOM element found).

If only the *class* argument is specified, the default action is to replace any DOM element class with this class.

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
	$('p').cls(); // returns classes set on all paragraph elements, as there is more than one paragraph element, an array ['','mono']
	$('p').cls('red bold'); // sets the class to "red" and "bold" to all paragraph elements, replacing any existing classes
	$('p').cls('red bold','replace'); // also sets the class to "red" and "bold" to all paragraph elements, replacing any existing classes
	$('p').cls('mono','add'); // adds the "mono" class to all paragraph elements
	$('p').cls('bold','remove'); // removes the "bold" class from all paragraph elements
</script>
</body>
</html>
```

#### $(selector).html(*html*,*before/after*)
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

#### $(selector).attr(property,*value*)
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
<p><a href="http://en.wikipedia.org/wiki/Foobar">Foo</p>
<p>Bar</p>
<script>
	$('a').attr('href'); // returns the "href" property for all link elements, as there is only one, a string "http://en.wikipedia.org/wiki/Foobar"
	$('a').attr('target','_blank'); // sets the "target" property for all link elements to "_blank"
</script>
</body>
</html>
```

#### $(selector).val(*value*)
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

#### $(selector).ajax(url,*method*,*callback*,*nocache*)
*Sends an AJAX request, optionally firing a callback with the XHR `responseText` on success*

**ajax** uses the GET method if none is specified. When *nocache* is true, a `_ts` time stamp is added to the URL to prevent caching, yes, I'm looking at you Android Browser.

**ajax** supports JSON as a selector ({'name','value'}), useful for when you want to send data without using form field DOM elements.

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
	$('form').ajax('ajax.html'); // XHR all form data using "GET" to "ajax.html"
	$({'text':'Foo Bar'}).ajax('ajax.html'); // XHR the JSON using "GET" to "ajax.html"
	$('form').ajax('ajax.html',"POST",function(data){alert(data)},true); // XHR all form data using "POST" to "ajax.html", alerts results on success, adds a cache busting time stamp
</script>
</body>
</html>
```
##### FIN