const msg = document.getElementById('msg');

document.getElementById('filechooser').onchange = (e) =>
{
	msg.innerText = 'Doing things, please wait...';
	hideNonPrintableElements(false);
	document.getElementById('filechooser-container').hidden = true;
	readFile(e.target.files[0]);
}

function readFile(file)
{
	const reader = new FileReader();
	reader.readAsText(file, 'UTF-8');

	reader.onload = (readerEvent) =>
	{
		let md = readerEvent.target.result;
		//console.log(md);

		startMarkdownizing(md);
		msg.hidden = true;
	}
}

const dropzone = document.getElementById('dropzone');

dropzone.addEventListener('drop', (e) =>
{
	e.preventDefault();
	msg.innerText = 'Doing things, please wait...';
	hideNonPrintableElements(false);
	document.getElementById('filechooser-container').hidden = true;
	
	let files = e.dataTransfer.files;
	console.log(files);
	readFile(files[0]);
});

dropzone.addEventListener('dragover', (e) =>
{
	e.preventDefault();
});

dropzone.addEventListener('dragenter', (e) =>
{
	e.target.classList.add('drag');
	console.log(e.target);
});

dropzone.addEventListener('dragleave', (e) =>
{
	e.target.classList.remove('drag');
});

hideNonPrintableElements(true);
