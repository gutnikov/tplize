# tplize

> A ~2kb lib for quickly prototyping templated content.
> Despite there is a variety of awesome libs like handlebars or jade, this one gives you a quick `prototyping` solution with some of its advantages:

* no setup, precompiling templates to functions etc - what you write is already a function
* it was designed the way a templating functions stay quite readable
* what you write is still a plain javascript code, so put any logic ( but be carefull )
* get ide-hints, debug what you write, etc

## Quick example

```javascript
function employeList( _, data ){

	_.div('#employe-list.styled-list',function(){

		_.h1('Peopleware:');

		_.each( data.people, function(ind, person){

			_.div('.person-record', {'data-person-id': person.id}, fullName(person) );

		});

		_.button('#add-new-person', '+ Add new');

	});

	function fullName( person ){
		return function(){
			_.txt('%surname%, %name%', person );
		}
	}

}	
```
