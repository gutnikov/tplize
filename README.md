# tplize

> A ~2kb lib for quickly prototyping templated content.
> Despite there is a variety of awesome libs like handlebars or jade, this one gives you a quick `prototyping` solution with some of its advantages:

* no setup, precompiling templates to functions - what you write is already a function
* it was designed the way a templating functions stay quite readable
* what you write is still a plain javascript code, so put any logic ( but be carefull )
* get ide-hints, debug what you write, etc

## Quick example

```javascript
// A templating function get`s a context parameter first
// Any data agruments can be passed either ( see Tplize.toHtml call below )
function employeList( _, data ) {

	_.div( "#employe-list.styled-list", function() {

		_.h1( "Peopleware:" );

		_.each( data.people, function( ind, person ) {

			_.div( ".person-record", { "data-person-id": person.id }, fullName( person ) );

		} );

		_.button( "#add-new-person", "+ Add new" );

	} );

	function fullName( person ) {
		return function() {
			_.txt( "%surname%, %name%", person );
		};
	}

}

// And then to get a result:
var data = {
	people: [
		{ id: 112, name: "Bob", surname: "Odenkirk" },
		{ id: 155, name: "Chuck", surname: "Palahniuk" },
		{ id: 3151, name: "Brendan", surname: "Eich" }
	]
};
var html = Tplize.toHtml( employeList, data );
```
