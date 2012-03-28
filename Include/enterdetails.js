function loadSelectImages() {
	var strFieldName = "";
	var intCount = 1;
	var elem = document.getElementById("Form1").elements;

	for (var i = 0; i < elem.length; i++) {
		strFieldName = "" + elem[i].name + "";

		if (strFieldName.match("pdfs_id")) {
			if (elem[i].value !== "") {
				ShowThumb(elem[i], intCount);
				intCount++;
			}
		}
	}
}

function RefreshProof() {
	$("#spnLiveProof").html("<img src='images/process.gif' style='width: 20px;' />");
	$("#btnPreview").hide();

	$.post("ShowProofAJAX.asp?type=refreshproof&ran=" + Math.random(), $("#Form1").serialize(), function(data, textStatus, jqXHR) {
		$("#spnLiveProof").empty();
		$("#btnPreview").show();

		var proofs = jqXHR.responseText.split("<!--split-->");

		$("#spnPDFProof").html(proofs[0]);

		if (proofs.length > 1) {
			$("#spnFrontProof").html(proofs[1]);

			if (proofs.length > 2) {
				$("#spnBackProof").html(proofs[2]);
			}
		}
	});
}

$(function() {
    var blnValidateLoad;
	loadSelectImages();
	blnValidateLoad = validateLoad();

	if (document.getElementById('btnPreview') != undefined) {
		RefreshProof();
	}

	$("#spnFrontProof img").removeAttr("width");

	$("#btnPreview").on("click", function() {
		return RefreshProof();
	});

	$("#btnCancel").on("click", function(event) {
		event.preventDefault();

		window.history.back();
	});
});