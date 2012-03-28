function stopRKey(evt) {
	var evt = (evt) ? evt : ((event) ? event : null);
	var node = (evt.target) ? evt.target : ((evt.srcElement) ? evt.srcElement : null);
	if ((evt.keyCode == 13) && (node.type != "textarea")) {
		return false;
	}
}
document.onkeypress = stopRKey;

function CalculateBudget() {
	var currencySymbol = $("#currency-symbol").text().trim();
	var dblTotal = parseFloat($("#total").text().replace(currencySymbol, "").replace(",", "").trim());
	var dblBalance = parseFloat($("#available-balance").text().replace(currencySymbol, "").replace(",", "").trim());
	var dblFinal = dblBalance - dblTotal;
	var allowanceTime = $("#allowance-time").text().trim();

	if (dblFinal <= 0.0) {
		$("#btnFinal").hide();

		$("#spanbalance").html("This exceeds your " + allowanceTime + " Allowance by " + currencySymbol + Math.abs(dblFinal).toFixed(2));
	} else {
		$("#btnFinal").show();
	}

	$("#budgetallowance").show();
	$("#budgetcurrent").show();
	$("#budgetavailable").show();
}

$(function() {
	if (document.getElementById('EIFGroupNameList').value !== "") {
		EIFGroupClicked("");
	}

	var invoiceOnly = $("#invoice-only").text().trim();

	if (invoiceOnly !== "") {
		TogglePONumber(invoiceOnly);
	}

	$("tr.Hide").remove();

	TogglePONumber();

	CalculateBudget();

	UpdateFreight();

	$("#btnBack").on("click"), function(event) {
		event.preventDefault();

		window.location("cart.asp");
	}

	$("#btnFinal").on("click", function(event) {
		var orders = $("#order-ids").text().trim();

		$.get("CheckLiveStockAjax.asp?Orders=" + orders + "&ran=" + Math.random(), function(data, textStatus, jqXHR) {
			if (jqXHR.responseText !== "OK") {
				if (jqXHR.responseText === "NOKCap") {
					showAlertMessage("", "Your order quantity limit has been reached. You will be taken back to the shopping cart to review your order.", "error");
				} else {
					showAlertMessage("", "There is currently not enough stock to fulfill your order. You will be taken back to the shopping cart to review your order.", "error");
				}

				event.preventDefault();
			}
		});
	});

	$("#Form1").on("submit", function(event) {
		return ValidData();
	});


});