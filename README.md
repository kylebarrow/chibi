# Chibi v0.2#

#### A tiny JavaScript micro-framework ####

Documentation is still a work in progress...

### $().ready(handler) ###
*Fires handler when the DOM is ready.*

	$().ready(function(){
		// Do awesome
	});

or perhaps

	function foo() {
		// Do awesome
	}

	$().ready(foo);

### $().loaded(handler) ###
*Fires handler when the page is loaded.*

	function foo() {
		// Do awesome
	}

	$().loaded(foo);

### $(selector).find(*filter*) ###
*Finds the selector. Returns the node element, an array of node elements or false. Optionally filter by first, last, odd or even.*

	<!DOCTYPE html>
	<html>
	<head>
	<script src="chibi-min.js"></script>
	</head>
	<body>
	<p>Blah de blah</p>
	<p>Blah blah</p>
	<p>Blah</p>
	<script>
		$('p').find(); // returns all paragraph elements, as there is more than one paragraph element, this is an array of paragraph elements
		$('p').find('first'); // returns the first paragraph element
		$('p').find('last'); // returns the third paragraph element
		$('p').find('odd'); // returns an array with the first and third paragraph elements
		$('p').find('even'); // returns the second paragraph element
		$('.foo').find(); // returns false;
	</script>
	</body>
	</html>

### $(selector).hide() ###
*Hides the selector.*

	<!DOCTYPE html>
	<html>
	<head>
	<script src="chibi-min.js"></script>
	</head>
	<body>
	<p>Blah de blah</p>
	<p>Blah blah</p>
	<p>Blah</p>
	<script>
		$('p').hide(); // hides all paragraph elements
	</script>
	</body>
	</html>

### $(selector).show() ###
*Shows the selector.*

	<!DOCTYPE html>
	<html>
	<head>
	<style>
	p {display:none}
	</style>
	<script src="chibi-min.js"></script>
	</head>
	<body>
	<p>Blah de blah</p>
	<p>Blah blah</p>
	<p>Blah</p>
	<script>
		$('p').show(); // shows all paragraph elements
	</script>
	</body>
	</html>

### $(selector).toggle() ###
*Toggles visibility of the selector.*

	<!DOCTYPE html>
	<html>
	<head>
	<script src="chibi-min.js"></script>
	</head>
	<body>
	<p>Blah de blah</p>
	<p style="display:none">Blah blah</p>
	<p>Blah</p>
	<script>
		$('p').toggle(); // shows the second paragraph element, hides the first and third paragraph elements
	</script>
	</body>
	</html>

### $(selector).remove() ###
*Removes the selector.*

	<!DOCTYPE html>
	<html>
	<head>
	<script src="chibi-min.js"></script>
	</head>
	<body>
	<p>Blah de blah</p>
	<p>Blah blah</p>
	<p>Blah</p>
	<script>
		$('p').remove(); // removes all the paragraph elements
	</script>
	</body>
	</html>

### $(selector).css(property,*value*) ###
*Gets or optionally sets the CSS property for the selector.*

	<!DOCTYPE html>
	<html>
	<head>
	<style>
	.bold {font-weight:900}
	</style>
	<script src="chibi-min.js"></script>
	</head>
	<body>
	<p>Blah de blah</p>
	<p class="bold">Blah blah</p>
	<p>Blah</p>
	<script>
		$('p').css('font-weight'); // returns the "font-weight" on all paragraph elements, as there is more than one paragraph element, an array ['normal','900','normal']
		$('p').css('color:red'); // sets all paragraph elements color to red
	</script>
	</body>
	</html>

### $(selector).cls(*class*,*replace/add/remove*) ###
*Gets or optionally sets the class for a selector.*

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
	<h1 class="mono">BLAH</h1>
	<p>Blah de blah</p>
	<p class="mono">Blah blah</p>
	<p>Blah</p>
	<script>
		$('h1').cls(); // returns the classes set on all H1 elements, as there is only one, a string "mono"
		$('p').cls(); // returns an classes set on all paragraph elements, as there is more than one paragraph element, an array ['','mono','']
		$('p').cls('red bold'); // sets the class to "red" and "bold" for all paragraph elements, replacing any existing classes
		$('p').cls('red bold','replace'); // also sets the class to "red" and "bold" for all paragraph elements, replacing any existing classes
		$('p').cls('mono','add'); // adds the "mono" class from all paragraph elements
		$('p').cls('bold','remove'); // removes the "bold" class from all paragraph elements
	</script>
	</body>
	</html>

### $(selector).html(*html*,*before/after*) ###
*Gets or optionally sets the HTML for a selector. Optionally inserts HTML before or after the element.*

	<!DOCTYPE html>
	<html>
	<head>
	<script src="chibi-min.js"></script>
	</head>
	<body>
	<p>Blah de blah</p>
	<p>Blah blah</p>
	<p>Blah</p>
	<script>
		$('p').html(); // returns an inner HTML of all paragraph elements, as there is more than one paragraph element, an array ['Blah de blah','Blah blah','Blah'
		$('p').html('<i>Na ni na</i>'); // Sets the inner HTML of all paragraph elements to "<i>Na ni na</i>"
		$('p').html('<p>Na ni na</p>','after'); Inserts "<p>Na ni na</p>" after all paragraph elements
		$('p').html('<p>Na ni na</p>','before'); Inserts "<p>Na ni na</p>" before all paragraph elements
	</script>
	</body>
	</html>

### $(selector).attr(property,*value*) ###
*Gets or optionally sets the property for a selector.*

	<!DOCTYPE html>
	<html>
	<head>
	<script src="chibi-min.js"></script>
	</head>
	<body>
	<p><a href="http://en.wiktionary.org/wiki/blah">Blah de blah</a></p>
	<p>Blah blah</p>
	<p>Blah</p>
	<script>
		$('a').attr('href'); // returns the "href" property for all link elements, as there is only one, a string "http://en.wiktionary.org/wiki/blah"
		$('a').attr('target','_blank'); // sets the "target" property for all link elements to "_blank"
	</script>
	</body>
	</html>

### $(selector).val(*replacement*) ###
*Gets or optionally sets the value of a form element selector.*

	<!DOCTYPE html>
	<html>
	<head>
	<script src="chibi-min.js"></script>
	</head>
	<body>
	<form>
	<input type="text" value="Blah de blah">
	</form>
	<script>
		$('input').val(); // returns the value for all input elements, as there is only one, a string "Blah de blah"
		$('input').val('Blah'); // sets the value for all input elements to "Blah"
	</script>
	</body>
	</html>

### $(selector).ajax(url,*method*,*callback*,*nocache*) ###
*Gets or optionally sets the value of a form element selector.*

	<!DOCTYPE html>
	<html>
	<head>
	<script src="chibi-min.js"></script>
	</head>
	<body>
	<form>
	<input type="text" value="Blah de blah" name="text">
	</form>
	<script>
		$('form').ajax('ajax.html'); // XHR all form data using "GET" to "ajax.html"
		$({'text':'Blah de blah'}).ajax('ajax.html'); // XHR the JSON using "GET" to "ajax.html"
		$('form').ajax('ajax.html',"POST",function(data){alert(data)},true); // XHR all form data using "POST" to "ajax.html", alerts results and adds a cache busting time stamp
	</script>
	</body>
	</html>
