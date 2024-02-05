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
		align: localStorage.getItem('align')
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
}

//cargar cosas automáticamente
setDocumentFont(loadSavedSettings().docfont);
setCodeFont(loadSavedSettings().codefont);
setTextIndentBySavedSetting();
setFontSizeBySavedSetting();
setTextAlignBySavedSetting();

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
