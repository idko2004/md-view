const settingsMenu = document.getElementById('settingsMenu');

function showSettings(show)
{
	settingsMenu.hidden = !show;
}

//
//	CHANGE FONT
//
document.getElementById('changeFontBtn').addEventListener('click', () =>
{
	const menu = document.getElementById('changeFontMenu');
	menu.hidden = !menu.hidden;

	showSettings(false);
});

let docfontbtn = document.getElementsByClassName('docfontbtn');
let codefontbtn = document.getElementsByClassName('codefontbtn');

//Añadir events listeners a los botones para elegir las fuentes
for(let i = 0; i < docfontbtn.length; i++)
{
	docfontbtn[i].addEventListener('click', (event) =>
	{
		const font = event.target.getAttribute('ftn')
		setDocumentFont(font);

		localStorage.setItem('docfont', font);
	});
}

for(let i = 0; i < codefontbtn.length; i++)
{
	codefontbtn[i].addEventListener('click', (event) =>
	{
		const font = event.target.getAttribute('ftn')
		setCodeFont(font);

		localStorage.setItem('codefont', font);
	});
}

//cargar fuente automáticamente
setDocumentFont(localStorage.getItem('docfont'));
setCodeFont(localStorage.getItem('codefont'));

function setDocumentFont(font)
{
	if(font == null) return;
	const root = document.getElementsByTagName("html")[0];

	let fontName;
	if(font === 'default') fontName = 'serif';
	else fontName = `"${font}"`;

	root.style.setProperty('--document-font', fontName);

	console.log('Document font set', fontName);
}

function setCodeFont(font)
{
	if(font == null) return;
	const root = document.getElementsByTagName("html")[0];

	let fontName;
	if(font === 'default') fontName = 'monospace';
	else fontName = `"${font}"`;

	root.style.setProperty('--code-font', fontName);

	console.log('Code font set', fontName);
}

//
//	DOCUMENT SETTINGS
//

document.getElementById('documentSettingsBtn').addEventListener('click', () =>
{
	document.getElementById('documentSettingsMenu').hidden = false;
	showSettings(false);
});
