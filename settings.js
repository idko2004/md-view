const settingsMenu = document.getElementById('settingsMenu');

function showSettings(show)
{
	settingsMenu.hidden = !show;
}

let settingsState;

function loadSavedSettings()
{
	if(settingsState === undefined) settingsState =
	{
		docfont: localStorage.getItem('docfont'),
		codefont: localStorage.getItem('codefont'),
		textIndent: localStorage.getItem('indent'),
		fontSize: localStorage.getItem('size'),
		customTextIndent: localStorage.getItem('indent-custom'),
		customFontSize: localStorage.getItem('size-custom'),
		align: localStorage.getItem('align'),
		theme: localStorage.getItem('theme')
	}

	return settingsState;
}

function saveSettings()
{
	localStorage.setItem('docfont', settingsState.docfont);
	localStorage.setItem('codefont', settingsState.codefont);
	localStorage.setItem('indent', settingsState.textIndent);
	localStorage.setItem('size', settingsState.fontSize);
	localStorage.setItem('indent-custom', settingsState.customTextIndent);
	localStorage.setItem('size-custom', settingsState.customFontSize);
	localStorage.setItem('align', settingsState.align);
	localStorage.setItem('theme', settingsState.theme);
}

//cargar cosas automáticamente
function setThingsAutomatically()
{
	setDocumentFont(loadSavedSettings().docfont);
	setCodeFont(loadSavedSettings().codefont);
	setTextIndentBySavedSetting();
	setFontSizeBySavedSetting();
	setTextAlignBySavedSetting();
	setTheme(loadSavedSettings().theme);
}

//
//	CHANGE FONT
//
document.getElementById('changeFontBtn').addEventListener('click', () =>
{
	showSettings(false);

	updateChangeFontMenu();

	const menu = document.getElementById('changeFontMenu');
	menu.hidden = !menu.hidden;
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

		loadSavedSettings().docfont = font;
		saveSettings();

		updateChangeFontMenu();
	});
}

for(let i = 0; i < codefontbtn.length; i++)
{
	codefontbtn[i].addEventListener('click', (event) =>
	{
		const font = event.target.getAttribute('ftn')
		setCodeFont(font);

		loadSavedSettings().codefont = font;
		saveSettings();

		updateChangeFontMenu();
	});
}

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

function updateChangeFontMenu()
{
	const currentDocfont = loadSavedSettings().docfont;
	const currentCodefont = loadSavedSettings().codefont;
	
	for(let i = 0; i < docfontbtn.length; i++)
	{
		docfontbtn[i].classList.remove('underline');
		if(docfontbtn[i].getAttribute('ftn') === currentDocfont)
		{
			docfontbtn[i].classList.add('underline');
		}
	}

	for(let i = 0; i < codefontbtn.length; i++)
	{
		codefontbtn[i].classList.remove('underline');
		if(codefontbtn[i].getAttribute('ftn') === currentCodefont)
		{
			codefontbtn[i].classList.add('underline');
		}
	}
}

//
//	DOCUMENT SETTINGS
//

document.getElementById('documentSettingsBtn').addEventListener('click', () =>
{
	showSettings(false);
	updateDocumentSettingsMenu();
	document.getElementById('documentSettingsMenu').hidden = false;
});

function setTextIndentSetting(state)
{
	const settings = loadSavedSettings();

	settings.textIndent = state.toString();

	saveSettings();
	setTextIndentBySavedSetting();
	updateDocumentSettingsMenu();
}

function setCustomTextIndentSetting()
{
	let value = document.getElementById('docCustomIndent').value;

	value = Number(value);
	if(isNaN(value)) return;

	if(value <= 0) return;

	const settings = loadSavedSettings();

	settings.customTextIndent = value.toString();

	saveSettings();
	setTextIndentBySavedSetting();
	console.log('Custom text indent set', value);
	updateDocumentSettingsMenu();
}

function setTextIndentBySavedSetting()
{
	switch(loadSavedSettings().textIndent)
	{
		default:
		case "0": actuallySetTextIndent(null); break;
		case "1": actuallySetTextIndent(25); break;
		case "2": actuallySetTextIndent(loadSavedSettings().customTextIndent); break;
	}
}

function actuallySetTextIndent(value)
{
	const root = document.getElementsByTagName("html")[0];

	if(value === null) value = "0";
	else
	{
		value = Number(value);
		value = `${value}px`;
	}

	root.style.setProperty('--indent', value);

	console.log('Indent set', value);
}

function setCustomFontSizeSetting()
{
	let value = document.getElementById('docCustomFontSize').value;

	value = Number(value);
	if(isNaN(value)) return;

	if(value <= 0) return;

	const settings = loadSavedSettings();

	settings.customFontSize = value.toString();

	saveSettings();
	setFontSizeBySavedSetting();
	console.log('Custom font size set', value);
	updateDocumentSettingsMenu();
}

function setFontSizeSetting(state)
{
	const settings = loadSavedSettings();

	settings.fontSize = state.toString();

	saveSettings();
	setFontSizeBySavedSetting();
	updateDocumentSettingsMenu();
}

function setFontSizeBySavedSetting()
{
	switch(loadSavedSettings().fontSize)
	{
		default:
		case "0": actuallySetFontSize(null); break;
		case "1": actuallySetFontSize(loadSavedSettings().customFontSize); break;
	}
}

function actuallySetFontSize(value)
{
	const root = document.getElementsByTagName("html")[0];

	if(value === null) value = "1rem";
	else
	{
		value = Number(value);
		value = `${value}px`;
	}

	root.style.setProperty('--font-size', value);

	console.log('Font size set', value);
}

function setTextAlignSetting(state)
{
	const settings = loadSavedSettings();

	settings.align = state.toString();

	saveSettings();
	setTextAlignBySavedSetting();
	updateDocumentSettingsMenu();
}

function setTextAlignBySavedSetting()
{
	switch(loadSavedSettings().align)
	{
		default:
		case "0": actuallySetTextAlign('left'); break;
		case "1": actuallySetTextAlign('center'); break;
		case "2": actuallySetTextAlign('right'); break;
		case "3": actuallySetTextAlign('justify'); break;
	}
}

function actuallySetTextAlign(value)
{
	const root = document.getElementsByTagName("html")[0];

	if(value === null) return;

	root.style.setProperty('text-align', value);

	console.log('Text align set', value);
}


function updateDocumentSettingsMenu()
{
	const settings = loadSavedSettings();

	console.log(settings);

	if(settings.textIndent === null) settings.textIndent = "0";
	if(settings.fontSize === null) settings.fontSize = "0";
	if(settings.customTextIndent === null) settings.customTextIndent = "25";
	if(settings.customFontSize === null) settings.customFontSize = "14";
	if(settings.align === null) settings.align = "0";

	//Esconder o mostrar propiedades "custom"
	if(settings.textIndent === "2")
	{
		document.getElementById('docCustomIndent').value = settings.customTextIndent;
		document.getElementById('docCustomIndentContainer').hidden = false;
	}
	else document.getElementById('docCustomIndentContainer').hidden = true;

	if(settings.fontSize === "1")
	{
		document.getElementById('docCustomFontSize').value = settings.customFontSize;
		document.getElementById('docCustomFontSizeContainer').hidden = false;
	}
	else document.getElementById('docCustomFontSizeContainer').hidden = true;

	//Seleccionar los radio buttons correctos
	switch(settings.textIndent)
	{
		default:
		case "0": document.getElementById('docTextIndent-No').checked = true; break;
		case "1": document.getElementById('docTextIndent-Some').checked = true; break;
		case "2": document.getElementById('docTextIndent-Custom').checked = true; break;
	}

	switch(settings.fontSize)
	{
		default:
		case "0": document.getElementById('docFontSize-Default').checked = true; break;
		case "1": document.getElementById('docFontSize-Custom').checked = true; break;
	}

	switch(settings.align)
	{
		default:
		case "0": document.getElementById('docAlign-Left').checked = true; break;
		case "1": document.getElementById('docAlign-Center').checked = true; break;
		case "2": document.getElementById('docAlign-Right').checked = true; break;
		case "3": document.getElementById('docAlign-Justified').checked = true; break;
	}
}

//
//	CHANGE COLORTHEME
//

const colorthemes =
{
	0: //Colorful
	{
		bgColor: 'fff',
		textColor: '000',
		h1Color: '62a0ea',
		h2Color: '57e389',
		h3Color: 'c061cb',
		h4Color: 'ffa348',
		h5Color: 'ed333b',
		h6Color: 'b5835a',
		codeBg: 'c9dffc',
		commentColor: '77767b'
	},

	1: //Colorful dark
	{
		bgColor: '000',
		textColor: 'fafafa',
		h1Color: '62a0ea',
		h2Color: '57e389',
		h3Color: 'c061cb',
		h4Color: 'ffa348',
		h5Color: 'ed333b',
		h6Color: 'b5835a',
		codeBg: '063169',
		commentColor: 'c1c1c3'
	},

	2: //Colorful but not so dark
	{
		bgColor: '241f31',
		textColor: 'fff',
		h1Color: '62a0ea',
		h2Color: '57e389',
		h3Color: 'c061cb',
		h4Color: 'ffa348',
		h5Color: 'ed333b',
		h6Color: 'b5835a',
		codeBg: '063169',
		commentColor: 'c1c1c3'
	},

	3: //Colorful warm
	{
		bgColor: 'fffbf6',//'fff5e8',
		textColor: '000',
		h1Color: '62a0ea',
		h2Color: '57e389',
		h3Color: 'c061cb',
		h4Color: 'ffa348',
		h5Color: 'ed333b',
		h6Color: 'b5835a',
		codeBg: 'c9dffc',
		commentColor: '77767b'
	},

	4: //Colorful warmer
	{
		bgColor: 'fff5e8',
		textColor: '000',
		h1Color: '62a0ea',
		h2Color: '57e389',
		h3Color: 'c061cb',
		h4Color: 'ffa348',
		h5Color: 'ed333b',
		h6Color: 'b5835a',
		codeBg: 'c9dffc',
		commentColor: '77767b'
	},

	5: //No named blueish palette
	{
		bgColor: 'eff5fd',
		textColor: '000',
		h1Color: '99c1f1',
		h2Color: '99aff0',
		h3Color: 'a699f0',
		h4Color: 'db99f0',
		h5Color: 'ed333b',
		h6Color: 'f099c0',
		codeBg: 'f0c999',
		commentColor: '1c71d8'
	},

	6: //Constant blue, light
	{
		bgColor: 'fff',
		textColor: '000',
		h1Color: '3584e4',
		h2Color: '3584e4',
		h3Color: '3584e4',
		h4Color: '3584e4',
		h5Color: '3584e4',
		h6Color: '3584e4',
		codeBg: 'f6f5f4',
		commentColor: '77767b'
	},

	7: //Variable blue, light
	{
		bgColor: 'fff',
		textColor: '000',
		h1Color: '99c1f1',
		h2Color: '62a0ea',
		h3Color: '3584e4',
		h4Color: '1c71d8',
		h5Color: '1a5fb4',
		h6Color: '175bb1',
		codeBg: 'c9dffc',
		commentColor: '77767b'
	},

	8: //Weird
	{
		bgColor: 'f7f2fc',
		textColor: '000',
		h1Color: 'd13389',
		h2Color: '7a33d1',
		h3Color: '336ad1',
		h4Color: '33c9d1',
		h5Color: '336ad1',
		h6Color: '33d17a',
		codeBg: 'adedca',
		commentColor: '7a33d1'
	}
}

document.getElementById('changeColorthemeBtn').addEventListener('click', () =>
{
	showSettings(false);
	document.getElementById('colorthemeMenu').hidden = false;
});

//Añadir events listeners a los botones para cambiar los temas
const themebtn = document.getElementsByClassName('themebtn');

for(let i = 0; i < themebtn.length; i++)
{
	themebtn[i].addEventListener('click', (e) =>
	{
		const theme = event.target.getAttribute('theme')
		setTheme(theme);

		loadSavedSettings().theme = theme;
		saveSettings();

		updateChangeColorthemeMenu();
	});
}

function setTheme(i)
{
	if(i == null) return;
	const root = document.getElementsByTagName("html")[0];

	const theme = colorthemes[i];
	if(theme === undefined)
	{
		console.error(`${i} no contiene un tema válido`);
		return;
	}

	root.style.setProperty('--bg-color', `#${theme.bgColor}`);
	root.style.setProperty('--text-color', `#${theme.textColor}`);
	root.style.setProperty('--h1-color', `#${theme.h1Color}`);
	root.style.setProperty('--h2-color', `#${theme.h2Color}`);
	root.style.setProperty('--h3-color', `#${theme.h3Color}`);
	root.style.setProperty('--h4-color', `#${theme.h4Color}`);
	root.style.setProperty('--h5-color', `#${theme.h5Color}`);
	root.style.setProperty('--h6-color', `#${theme.h6Color}`);
	root.style.setProperty('--code-bg', `#${theme.codeBg}`);
	root.style.setProperty('--comment-color', `#${theme.commentColor}`);

	console.log('Colortheme set', i);
}

function updateChangeColorthemeMenu()
{
	const currentTheme = loadSavedSettings().theme;

	for(let i = 0; i < themebtn.length; i++)
	{
		themebtn[i].classList.remove('underline');
		if(themebtn[i].getAttribute('theme') === currentTheme)
		{
			themebtn[i].classList.add('underline');
		}
	}
}

setThingsAutomatically();

