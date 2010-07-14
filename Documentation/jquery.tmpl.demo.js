$(document).ready(function(){
	
	var data = [
		{
			command: 'each',
			syntax: '{{each [object] as [indexName], [itemName]}}\n  ...\n{{/each}}',
			desc: 'Iterates over the properties of the specified [object], or the items in a specified [object] as an array, providing an index (named by [indexName]) and an item (named by [itemName]).',
			data: '{values: [1, 2, 3]}',
			template: '  <span>Values: {{ each values as i, item }}${item} {{ /each }}</span>'
		},
		{
			command: 'if',
			syntax: '{{if [condition]}}\n  ...\n{{/if}}',
			desc: 'Creates a conditional construct, the contents of which will be evaluated if [condition] is true.',
			data: '{value: 10}',
			template: '  <span>Is value greater than zero? {{ if value > 0 }}Value is greater than zero!{{ /if }}</span>'
		},
		{
			command: 'ifdef',
			syntax: '{{ifdef [object]}}\n  ...\n{{/ifdef}}',
			desc: 'Creates a conditional construct, the contents of which will be evaluated if the specified [object] is defined. (!== undefined)',
			data: '{value: 10}',
			template: '  <span>{{ ifdef value }} ${value} {{ /ifdef }}</span>'
		},
		{
			command: 'ifndef',
			syntax: '{{ifndef [object]}}\n  ...\n{{/ifndef}}',
			desc: 'Creates a conditional construct, the contents of which will be evaluated if the specified [object] is not defined. (=== undefined)',
			data: '{foo: \'bar\'}',
			template: '  <span>Is value defined? {{ ifndef value }}Nosir{{ /ifndef }}</span>'
		},
		{
			command: 'else',
			syntax: '{{if|ifdef|ifndef [condition]}}\n  ...\n{{/if|ifdef|ifndef}}',
			desc: 'Provides an else construct for the conditional commands if, ifdef, and ifndef. The contents of this construct will be evaluated if the conditional command does not evaluate.',
			data: '{value: 0}',
			template: '  <span>Is value greater than zero? {{ if value > 0 }}Yessir!{{ else }}Nosir{{ /if }}</span>'
		},
		{
			command: 'with',
			syntax: '{{ with [object] }}\n  ...\n{{ /with }}',
			desc: '<p style="color: red;">Currently Non-Functional</p>Provides functionality identical to the javascript with(){} construct.',
			data: '{foo: {bar: "<b>foobar!</b>"} }',
			template: '  <span>{{ with foo }}${bar}{{ /with }}</span>'
		},
		{
			command: 'include',
			syntax: '$.templates[[templateName]] = $.tmpl("[template]");\n{{ include [templateName] }}',
			desc: 'Includes another template, by name, into the current template.',
			data: '{foo: {bar: "<b>foobar!</b>"} }',
			template: '  <span>{{ include "myTemplate" }}</span>',
			evaljs: '$.templates["myTemplate"] = $.tmpl("{{html foo.bar}}")'
		},
		{
			command: 'html',
			syntax: '{{html [string] }}',
			desc: 'Allows for variables containing raw html to be rendered to the page unencoded.',
			data: '{foo: {bar: "<b>foobar!</b>"} }',
			template: '  <span>{{html foo.bar }}</span>'
		},
		{
			command: 'equals',
			label: '= (equals)',
			syntax: '{{= [expression] }}',
			desc: 'Allows for evaluation of javascript within the construct.',
			data: '{foo: {bar: "foobar!"} }',
			template: '  <span>{{= "[\'" + foo.bar + "\']" }}</span>'
		}
	];
	
	$('#template-nav')
		.render(data)
		.appendTo('#output-nav');
	
	$('#template')
		.render(data)
		.appendTo('#output');
		
	$('li .output').each(function(index, e){
		
		if(!data[index].data){
			return;
		}
		
		if(data[index].evaljs){
			eval('(' + data[index].evaljs + ')');
		}
		
		var e = $(this),
			templateData = eval('(' + data[index].data + ')'),
			template = data[index].template.trim(),
			render = $('<script type="text/html">' + template + '</script>').render(templateData);
		
		render.appendTo(e);
	
	});

});