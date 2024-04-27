const textNodeTypes =
{
	normal: 0,
	codeblock: 1,
	comment: 2,
	title: 3,
	image: 4,
	list: 5
}

const lastTextNode =
{
	e: undefined,
	type: textNodeTypes.normal
}

let lastTitleContainer = [];//A cada título creamos un contenedor para el contenido de ese título con la esperanza de que así salga mejor al imprimir

let margin = 0;

function startMarkdownizing(file)
{
	const viewer = document.getElementById('viewer');

	const fileSplit = file.split('\n');

	let line;

	for(let i = 0; i < fileSplit.length; i++)
	{
		if(lastTextNode.type !== textNodeTypes.codeblock) margin = 0;

		line = fileSplit[i];
		console.log(line);

		checkLine(line);
	}

	searchInline();
}

function checkLine(line)
{
	if(lastTextNode.type === textNodeTypes.codeblock) //Si hay un bloque de código, ignorar todo y solo añadir el texto al bloque de código hasta que este se cierre
	{
		if(margin > 0)
		{
			for(let i = 0; i < margin; i++)
			{
				line = line.slice(4);
			}
		}

		if(line.startsWith('```'))
		{
			searchForCodeblocks();
		}
		else normalText(line + '\n');
		return false;
	}
	else if(lastTextNode.type === textNodeTypes.title)
	{
		lastTextNode.e = undefined;
		lastTextNode.type = textNodeTypes.normal;
	}

	if(line === '')
	{
		lastTextNode.e = undefined;
		lastTextNode.type = textNodeTypes.normal;
	}
	else if(line.startsWith("#"))
	{
		searchForTitles(line);
	}
	else if(line.startsWith(">"))
	{
		searchForComments(line);
	}
	else if(line.startsWith('!'))
	{
		searchForImages(line);
	}
	else if(line.startsWith('- '))
	{
		searchForLists(line);
	}
	else if(line.startsWith('```'))
	{
		searchForCodeblocks();
	}
	else if(line.startsWith('    '))
	{
		console.log('<4 espacios>');
		margin++;
		checkLine(line.slice(4));
	}
	else if(line.startsWith(String.fromCharCode(9)))
	{
		console.log('<tab>');
		margin++;
		checkLine(line.replace(String.fromCharCode(9), ''));
	}
	else
	{
		normalText(line);
	}
}

function searchForTitles(line)
{
	const lineSplit = line.split(" ");

	const firstWord = lineSplit[0];

	let i = 0;
	while(i < firstWord.length)
	{
		if(firstWord[i] === "#") i++;
		else break;
	}

	if(i < 0 || i > 6) //No es un título válido
	{
		normalText(line);
		return;
	}

	if(line[i] !== ' ')
	{
		normalText(line);
		return;
	}

	line = line.slice(i + 1);

	const title = addToDocument(`h${i}`, line);

	lastTextNode.e = title;
	lastTextNode.type = textNodeTypes.title;

	setNewTitleContainer(title, i);
}

function searchForCodeblocks()
{
	if(lastTextNode.type !== textNodeTypes.codeblock)
	{
		lastTextNode.type = textNodeTypes.codeblock;
		lastTextNode.e = addToDocument('p', null);
		lastTextNode.e.classList.add('codeblock');
	}
	else
	{
		lastTextNode.e = undefined;
		lastTextNode.type = textNodeTypes.normal;
	}
	
}

function searchForImages(line)
{
	let leftBracket = line.indexOf('[');
	if(leftBracket === -1)
	{
		normalText(line);
		return;
	}

	let rightBracket = line.indexOf(']');
	if(rightBracket === -1)
	{
		normalText(line);
		return;
	}

	let altText = line.slice(leftBracket + 1, rightBracket);
	let theRest = line.slice(rightBracket);

	let leftParenthesis = theRest.indexOf('(');
	if(leftParenthesis === -1)
	{
		normalText(line);
		return;
	}

	let rightParenthesis = theRest.indexOf(')');
	if(rightParenthesis === -1)
	{
		normalText(line);
		return;
	}

	let url = theRest.slice(leftParenthesis + 1, rightParenthesis);

	console.log('--image', {altText, url, indexes:{'[': leftBracket, ']': rightBracket, '(': leftParenthesis, ')': rightParenthesis}});

	closeLastTitleContainer();

	const img = document.createElement('img');
	img.setAttribute('src', url);
	img.setAttribute('alt', altText);
	img.setAttribute('title', altText);

	const footnote = document.createElement('div');
	footnote.classList.add('imgFootnote');
	footnote.classList.add('txt');
	footnote.innerText = altText;

	const imgContainer = document.createElement('div');
	imgContainer.classList.add('imgContainer');
	imgContainer.appendChild(img);
	imgContainer.appendChild(footnote);

	lastTextNode.e = imgContainer;
	lastTextNode.type = textNodeTypes.image;

	viewer.appendChild(imgContainer);
}

function searchForLists(line)
{
	const li = addToDocument('li', line.slice(2));

	const symbols =
	['disc', 'circle', 'square', 'disclosure-closed', '"- "'];

	li.style.setProperty('list-style-type', symbols[margin]); //Elegir un símbolo para la cosa que va en frente de la lista, se usa el margen para saber que símbolo usar.

	li.style.marginLeft = `${(margin * 2) + 2}em`; //Para que haya un margen extra de 2 em en las listas siempre, de esta forma, si se quiere continuar el texto en otro párrafo, al hacer tab queda alineado con el párrafo siguiente, esto sobreescribe el margen puesto en addToDocument

	lastTextNode.e = li;
	lastTextNode.type = textNodeTypes.list;
}

function searchForComments(line)
{
	let text = line.slice(2);
	if(text === '') return;

	let container;

	if(lastTextNode.type == textNodeTypes.comment) //Seguir con el comentario anterior
	{
		container = lastTextNode.e.parentElement;
	}
	else //Crear un comentario nuevo
	{
		container = document.createElement('div');
		container.classList.add('comment-container');
		viewer.appendChild(container);
	}

	closeLastTitleContainer();

	const comment = document.createElement('p');
	comment.classList.add('comment');
	comment.classList.add('txt');
	comment.innerText = text;

	lastTextNode.e = comment;
	lastTextNode.type = textNodeTypes.comment;

	container.appendChild(comment);
}

function normalText(line)
{
	if(lastTextNode.e === undefined)
	{
		lastTextNode.e = addToDocument('p', line);
		lastTextNode.type = textNodeTypes.normal;
	}
	else
	{
		lastTextNode.e.innerText += line;
	}
}

function addToDocument(element, content)
{
	const e = document.createElement(element);
	e.classList.add('txt');
	
	if(content) e.innerText = content;
	
	if(margin > 0) e.style.marginLeft = `${margin*2}em`;
	
	//Si son un título ignorar title container ya que debería hacerse justo después de esto
	if(element.startsWith('h')) viewer.appendChild(e);
	else getLastTitleContainer().appendChild(e);

	return e;
}

function setNewTitleContainer(titleElement, hLevel)
{
	const section = document.createElement('div');
	section.classList.add('titleContainer');
	viewer.appendChild(section);

	titleElement.before(section);
	section.appendChild(titleElement);

	hLevel--;
	lastTitleContainer[hLevel] = section;

	//Eliminar todos los títulos que son más pequeños que este
	//Por ejemplo: si había un h3 y se añade un h4, el h4 va a estar "adentro" del h3
	//Pero si había un h3 y se añade un h2, dejar de seguir a los títulos inferiores a este.
	for(let i = hLevel + 1; i < lastTitleContainer.length; i++)
	{
		lastTitleContainer[i] = undefined;
	}

	//Hacerle hijo de su título superior, si es que hay
	if(lastTitleContainer[hLevel - 1] !== undefined)
	{
		lastTitleContainer[hLevel - 1].appendChild(section);
	}

	console.log(`--Title container de nivel ${hLevel} creado--`, titleElement, section);
}

function getLastTitleContainer()
{
	for(let i = lastTitleContainer.length - 1; i >= 0; i--)
	{
		if(lastTitleContainer[i] !== undefined)
		{
			console.log('lastTitleContainer', lastTitleContainer[i]);
			return lastTitleContainer[i];
		}
	}

	//Si no hay ningún title container
	const section = document.createElement('div');
	section.classList.add('titleContainer');
	viewer.appendChild(section);
	lastTitleContainer[lastTitleContainer.length] = section;
	console.log('--Title container por defecto creado--', section);
	return section;
}

//Dejar de usar el lastTitleContainer en caso de que haya otro elemento que quiera tener un container, como un comentario o una imagen
function closeLastTitleContainer()
{
	lastTitleContainer = [];
}



function searchInline()
{
	console.log('--BUSCANDO DENTRO DE LAS LÍNEAS--');
	const textblocks = document.getElementsByClassName('txt');

	for(let i = 0; i < textblocks.length; i++)
	{
		if(textblocks[i].classList.contains('codeblock')) continue;

		while(searchBoldInline(textblocks[i]));
		while(searchItalicInline(textblocks[i]));
		while(searchCodeblockInline(textblocks[i]));
		while(searchLinksInline(textblocks[i]));
	}
}

function searchBoldInline(element)
{
	let text = element.innerHTML;

	let start = text.indexOf('**');
	if(start === -1) return false;

	let startText = text.slice(0, start);

	let theRest = text.slice(start + 2);
	let end = theRest.indexOf('**');
	
	if(end === -1)
	{
		console.log('bold (Sin cerrar):', theRest);
		element.innerHTML = `${startText}<b>${theRest}</b>`;
		return false;
	}

	let boldText = theRest.slice(0, end);
	let endText = theRest.slice(end + 2);

	console.log('bold:', boldText);

	element.innerHTML = `${startText}<b>${boldText}</b>${endText}`;

	return true;
}

function searchItalicInline(element)
{
	let text = element.innerHTML;

	let start = text.indexOf('*');
	if(start === -1) return false;

	let startText = text.slice(0, start);

	let theRest = text.slice(start + 1);
	let end = theRest.indexOf('*');
	
	if(end === -1)
	{
		console.log('italic (Sin cerrar):', theRest);
		element.innerHTML = `${startText}<i>${theRest}</i>`;
		return false;
	}

	let italicText = theRest.slice(0, end);
	let endText = theRest.slice(end + 1);

	console.log('italic:', italicText);

	element.innerHTML = `${startText}<i>${italicText}</i>${endText}`;

	return true;
}

function searchCodeblockInline(element)
{
	let text = element.innerHTML;

	let start = text.indexOf('`');
	if(start === -1) return false;

	let startText = text.slice(0, start);

	let theRest = text.slice(start + 1);
	let end = theRest.indexOf('`');
	
	if(end === -1)
	{
		console.log('minicodeblock (Sin cerrar):', theRest);
		element.innerHTML = `${startText}<span class="minicodeblock">${theRest}</span>`;
		return false;
	}

	let codeText = theRest.slice(0, end);
	let endText = theRest.slice(end + 1);

	console.log('minicodeblock:', codeText);

	element.innerHTML = `${startText}<span class="minicodeblock">${codeText}</span>${endText}`;

	return true;
}

function searchLinksInline(element)
{
	let text = element.innerHTML;

	let indexLeftBracket = text.indexOf('[');
	if(indexLeftBracket === -1) return false;

	let indexRightBracket = text.indexOf(']');
	if(indexRightBracket === -1) return false;

	let indexLeftParenthesis = text.indexOf('(');
	if(indexLeftParenthesis === -1) return false;

	let indexRightParenthesis = text.indexOf(')');
	if(indexRightParenthesis === -1) return false;

	//Si está al revés
	if(indexLeftBracket > indexLeftParenthesis) return false; //( [
	if(indexRightBracket > indexRightParenthesis) return false; // ) ]
	if(indexLeftBracket > indexRightBracket) return false; // ][
	if(indexLeftParenthesis > indexRightParenthesis) return false; // )(

	//Get everything before the left bracket
	let before = text.slice(0, indexLeftBracket);

	//Get the text
	let name = text.slice(indexLeftBracket + 1, indexRightBracket);

	//Get the url
	let url = text.slice(indexLeftParenthesis + 1, indexRightParenthesis);

	//get everything after the right bracket
	let after = text.slice(indexRightParenthesis + 1);

	console.log('link:', {before, name, url, after, element});

	element.innerHTML = `${before}<a target="_blank" href="${url}">${name}</a>${after}`;

	return true;
}
