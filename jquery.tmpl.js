/*
 * jQuery Templating Plugin
 *   NOTE: Created for demonstration purposes.
 * Copyright 2010, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 */
(function(jQuery){
	// Override the DOM manipulation function
	var oldManip = jQuery.fn.domManip,
	    safe_var = "(function(){try{return $1;}catch(err){if(err.name==='ReferenceError'||err.name==='TypeError'){return undefined;}throw err;}}.call(this))";
	
	jQuery.fn.extend({
		render: function( data ) {
			return this.map(function(i, tmpl){
				return jQuery.render( tmpl, data );
			});
		},
		
		// This will allow us to do: .append( "template", dataObject )
		domManip: function( args ) {
			// This appears to be a bug in the appendTo, etc. implementation
			// it should be doing .call() instead of .apply(). See #6227
			if ( args.length > 1 && args[0].nodeType ) {
				arguments[0] = [ jQuery.makeArray(args) ];
			}

			if ( args.length === 2 && typeof args[0] === "string" && typeof args[1] !== "string" ) {
				arguments[0] = [ jQuery.render( args[0], args[1] ) ];
			}
			
			return oldManip.apply( this, arguments );
		}
	});
	
	jQuery.extend({
		render: function( tmpl, data ) {
			var fn;
			
			// Use a pre-defined template, if available
			if ( jQuery.templates[ tmpl ] ) {
				fn = jQuery.templates[ tmpl ];
				
			// We're pulling from a script node
			} else if ( tmpl.nodeType ) {
				var node = tmpl, elemData = jQuery.data( node );
				fn = elemData.tmpl || jQuery.tmpl( node.innerHTML );
			}

			fn = fn || jQuery.tmpl( tmpl );
			
			// We assume that if the template string is being passed directly
			// in the user doesn't want it cached. They can stick it in
			// jQuery.templates to cache it.

			if ( jQuery.isArray( data ) ) {
				return jQuery.map( data, function( data, i ) {
					return $( fn.call( data, jQuery, data, i ) ).get();
				});

			} else {
				return $( fn.call( data, jQuery, data, 0 ) ).get();
			}
		},
		
		// You can stick pre-built template functions here
		templates: {},

		/*
		 * For example, someone could do:
		 *   jQuery.templates.foo = jQuery.tmpl("some long templating string");
		 *   $("#test").append("foo", data);
		 */

		tmplcmd: {
			"comment": {
				prefix: "/*",
				suffix: "*/"
			},
			"each": {
				_default: [ null, "$i" ],
				prefix: "jQuery.each($1,function($2){with(this){",
				suffix: "}});"
			},
			"if": {
        prefix: "if(" + safe_var + "){",
				suffix: "}"
			},
			"ifdef": {
				prefix: "if( typeof(" + safe_var + ") !== 'undefined' ){",
				suffix: "}"
			},
			"ifndef": {
				prefix: "if( typeof(" + safe_var + ") === 'undefined' ){",
				suffix: "}"
			},
			"else": {
				prefix: "}else{"
			},
			"html": {
				prefix: "_.push(typeof " + safe_var + "==='function'?" + safe_var + ".call(this):" + safe_var + ");"
			},
			"=": {
				_default: [ "this" ],
				prefix: "_.push($.encode(typeof " + safe_var + "==='function'?" + safe_var + ".call(this):" + safe_var + "));"
			}
		},

		encode: function( text ) {
			return text != null ? document.createTextNode( text.toString() ).nodeValue : "";
		},

		tmpl: function(str, data, i) {
			// Generate a reusable function that will serve as a template
			// generator (and which will be cached).
			var fn = new Function("jQuery","$data","$i",
				"var $=jQuery,_=[];_.data=$data;_.index=$i||0;" +

				// Introduce the data as local variables using with(){}
				"with($data){_.push('" +

				// Convert the template into pure JavaScript
				str
					.replace(/([\\'])/g, "\\$1")
					.replace(/[\r\t\n]/g, " ")
					.replace(/\${([^}]*)}/g, "{{= $1}}")
					.replace(/{{\s*(\/?)(\w+|.)(?:\((.*?)\))?(?: (.*?))?\s*}}/g, function(all, slash, type, fnargs, args) {
						var tmpl = jQuery.tmplcmd[ type ];

						if ( !tmpl ) {
							throw "Template not found: " + type;
						}

						var def = tmpl._default || [];

						return "');" + tmpl[slash ? "suffix" : "prefix"]
							.split("$1").join(args || def[0])
							.split("$2").join(fnargs || def[1]) + "_.push('";
					})
				+ "');}return _.join('');");

			// Provide some basic currying to the user
			return data ? jQuery( fn.call( this, jQuery, data, i ) ).get() : fn;
		}
	});
})(jQuery);
