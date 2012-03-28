$(function() {
	SetOptions();
	if (document.Form1.selectBack != null) {
		ShowThumb(document.Form1.selectBack, false)
	};

	checkOrderDetails();

	$("#btnBack").on("click", function(event) {
		event.preventDefault();

		window.history.back();
	});
});