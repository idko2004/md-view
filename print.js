document.getElementById('printBtn').addEventListener('click', () =>
{
	hideNonPrintableElements(true);
	print();
	hideNonPrintableElements(false);
});

function hideNonPrintableElements(hide)
{
	document.getElementsByClassName('header')[0].hidden = hide;
}
