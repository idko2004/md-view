document.getElementById('printBtn').addEventListener('click', () =>
{
	hideNonPrintableElements(true);
	viewer.classList.remove('limit-width');
	print();
	hideNonPrintableElements(false);
	viewer.classList.add('limit-width');
});

function hideNonPrintableElements(hide)
{
	document.getElementsByClassName('header')[0].hidden = hide;
}
