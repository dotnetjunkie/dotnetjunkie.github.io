function runAfterHead(template_dir)
{
	var i = document.URL.indexOf('?');
	if (i > -1 && document.URL.substring(i+1, document.URL.length).indexOf('print=') > -1) {
		nl = document.getElementsByTagName("head");

		if (typeof(ns) != 'undefined' && ns != null) {
			le = document.createElement('link');
			le.setAttribute('href', template_dir + 'print.css');
			le.setAttribute('rel', 'stylesheet');
			le.setAttribute('type', 'text/css');
			le.setAttribute('media', 'screen');
			nl[0].appendChild(le);	
		} else {
			document.write('<link rel="stylesheet" href="' + template_dir + 
				'print.css" type="text/css" media="screen" />');
		}
	}
}

function runAfterBody(template_dir)
{
	try
	{
		var codeHighlighter = new CSharpCodeHighlighter();
		codeHighlighter.AddRegExReplacement(/\[\.\.\.\]/g,
			"<img src='" + template_dir + "images/codecollapsed.gif' alt='[collapsed code]' border='0' />");
		codeHighlighter.ProcessTags('pre', 'csharp', 'customTypes', 'customValueTypes');
		
		codeHighlighter = new MSILCodeHighlighter();
		codeHighlighter.ProcessTags('pre', 'msil', 'customTypes');
		
		codeHighlighter = new X86CodeHighlighter();
		codeHighlighter.ProcessTags('pre', 'x86', 'customTypes');
	}
	catch (e) { }

	var i = document.URL.indexOf('?');
	if (i > -1 && document.URL.substring(i+1, document.URL.length).indexOf('print=') > -1) {
		try { buildLinkPrinterTables(); }
		catch (e) { }
	}

	try
	{
		if (document.URL.indexOf('tabs') == -1)
			replaceTabsWithSpacesInPreTags();
	}
	catch (e) { }
}

function StringSplit(str, splitChar, maxLength)
{ 
	var array = str.split(splitChar);
	
	var output = "";
	var startPos = 0;
	for (var i = 0; i < array.length; i++)
	{
		if ((output.length - startPos + array[i].length) > maxLength) {
			startPos += output.length;
			output += " ";
		}
		output += (output != "" ? splitChar : "") + array[i];
	}
	
	return output;
}

function buildLinkPrinterTables()
{
	var linkDiv = document.getElementById('listOfLinks');

	var linkPrinterClass = "linkPrinterTable";
	
	// Write table header
	var table;
	var tr;
	var td0, td1, td2;
	
	table = document.createElement('table');
	table.className = linkPrinterClass;
	
	linkDiv.appendChild(table);
	
	tr = document.createElement('tr');
	tr.className = linkPrinterClass;
	td0 = document.createElement('th');
	td0.className = linkPrinterClass;
	td1 = document.createElement('th');
	td1.className = linkPrinterClass;
	td2 = document.createElement('th');
	td2.className = linkPrinterClass;
	
	table.appendChild(tr);
	tr.appendChild(td0);
	tr.appendChild(td1);
	tr.appendChild(td2);

	td0.innerHTML = "";
	td1.innerHTML = "Title";
	td2.innerHTML = "Reference";

	var linksDictionary = new Object;	

	var aNodes = document.getElementById('entry_body').getElementsByTagName('a');

	var index = 1;
	
	for (var j = 0; j < aNodes.length; j++)
	{
		var a = aNodes[j];
		
		var href = a.href + "";
		
		if (href.length > 0 && 
			(href.indexOf('http://') > -1 || a.href.indexOf('https://') > -1) && 
			href.indexOf('mailto:') == -1 && 
			linksDictionary[href] == null)
		{
			linksDictionary[href] = href;
			
			// Add indexer to link
			var linkIndexer = document.createElement('span');
			linkIndexer.innerHTML = ' [' + index + ']';
			a.appendChild(linkIndexer);
				
			tr = document.createElement('tr');
			tr.className = linkPrinterClass;
			
			td0 = document.createElement('td');
			td0.className = linkPrinterClass;
			td1 = document.createElement('td');
			td1.className = linkPrinterClass;
			td2 = document.createElement('td');
			td2.className = linkPrinterClass;
			
			table.appendChild(tr);

			tr.appendChild(td0);
			tr.appendChild(td1);
			tr.appendChild(td2);
			
			td0.innerHTML = index;
			td1.innerHTML = a.title == "" ? a.text : a.title;
			td2.innerHTML = StringSplit(href, '/', 100);
			
			index++;		
		}
	}
}