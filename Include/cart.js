function stopRKey(evt) {
	var evt = (evt) ? evt : ((event) ? event : null);
	var node = (evt.target) ? evt.target : ((evt.srcElement) ? evt.srcElement : null);
	if ((evt.keyCode == 13) && (node.type != "textarea")) {
		return false;
	}
}

document.onkeypress = stopRKey;

function ValidData() {
	var blnOk;

	blnOk = hasAddress();

	if (blnOk) {
		blnOk = hasBillingAddress();
	}
	return blnOk;
}

function ValidFreeAddress() {
	if ((document.Form1.Address1.value + document.Form1.Address2.value + document.Form1.Address3.value + document.Form1.Suburb.value + document.Form1.State.value + document.Form1.PostCode.value) == '') {
		return true;
	} else {
		if (document.Form1.Country.value == "IE") {
			if (((document.Form1.Address1.value + document.Form1.Address2.value + document.Form1.Address3.value) == '') || (document.Form1.Suburb.value == '') || (document.Form1.State.value == '')) {
				alert('Please enter a value for ' + document.getElementById("captionstreet").innerHTML.replace("&nbsp;", " ") + ', ' + document.getElementById("captionsuburb").innerHTML + ' and ' + document.getElementById("captionstate").innerHTML);
				return false;
			} else {
				return true
			}
		} else {
			if (((document.Form1.Address1.value + document.Form1.Address2.value + document.Form1.Address3.value) == '') || (document.Form1.Suburb.value == '') || (document.Form1.State.value == '') || (document.Form1.PostCode.value == '')) {
				alert('Please enter a value for ' + document.getElementById("captionstreet").innerHTML.replace("&nbsp;", " ") + ', ' + document.getElementById("captionsuburb").innerHTML + ', ' + document.getElementById("captionstate").innerHTML + ' and ' + document.getElementById("captionpostcode").innerHTML);
				return false;
			} else {
				return true
			}
		}
	}
}

function ValidFreeBillAddress() {
	if ((document.Form1.BillingAddress1.value + document.Form1.BillingAddress2.value + document.Form1.BillingAddress3.value + document.Form1.BillingSuburb.value + document.Form1.BillingState.value + document.Form1.BillingPostCode.value) == '') {
		return true;
	} else {
		if (((document.Form1.BillingAddress1.value + document.Form1.BillingAddress2.value + document.Form1.BillingAddress3.value) == '') || (document.Form1.BillingSuburb.value == '') || (document.Form1.BillingState.value == '') || (document.Form1.BillingPostCode.value == '')) {
			alert('Please enter a value for Billing ' + document.getElementById("captionstreet").innerHTML.replace("&nbsp;", " ") + ', ' + document.getElementById("captionsuburb").innerHTML + ', ' + document.getElementById("captionstate").innerHTML + ' and ' + document.getElementById("captionpostcode").innerHTML);
			return false;
		} else {
			return true;
		}
	}
}

function HasFreeAddress() {
	return (document.Form1.Address1.value + document.Form1.Address2.value + document.Form1.Address3.value + document.Form1.Suburb.value + document.Form1.State.value + document.Form1.PostCode.value != '');
}

function HasFreeBillAddress() {
	if (document.Form1.BillingAddress1 != "") {
		return (document.Form1.BillingAddress1.value + document.Form1.BillingAddress2.value + document.Form1.BillingAddress3.value + document.Form1.BillingSuburb.value + document.Form1.BillingState.value + document.Form1.BillingPostCode.value != '');
	}
}

function HasStatAddress() {
	return (document.Form1.DelAddrStat.checked);
}

function HasDefAddress() {
	return (document.Form1.DeliveryAddress.value != '');
}

function HasDefBillAddress() {
	if (document.Form1.BillingAddress1 != '') {
		return (document.Form1.BillingAddress.value != '');
	}
}

function AddToCarts() {
	var strURL = "";
	var strOrders = "";
	var strDelim = "";

	if (document.Form1.chkOrder.length > 1) {
		for (i = 0; i < document.Form1.chkOrder.length; i++) {
			if (document.Form1.chkOrder[i].checked == true) {
				strOrders = strOrders + strDelim + document.Form1.chkOrder[i].value;
				strDelim = ",";
			}
		}
	} else {
		if (document.Form1.chkOrder.checked == true) {
			strOrders = strOrders + document.Form1.chkOrder.value;
		}
	}

	strURL = "AdminCopyOrders.asp?OrderIds=" + strOrders + "&cc={CC}";
	window.location = strURL;
}

$(function() {
	$("Form1").on("submit", function() {
		return ValidData();
	});

	$("#checkall").on("click", function() {
		$(this).closest("form").find("input[type='checkbox']").attr("checked", $(this).is(":checked"));
	});

	$("#checkdispatchprofile").on("click", function() {
		var dispatchProfileId = $(this).attr("data-dispatch-profile-id");

		$("input[type='checkbox']").each(function(index) {
			if ($(this).attr("size") === dispatchProfileId) {
				$(this).attr("checked", !$(this).is(":checked"));
			}
		});
	});

	$(".remove-item").on("click", function(event) {
		event.preventDefault();

		if (!$("#confirm-remove-item").is(":visible")) {
			$("#btnsave").data("order-id", $(this).data("order-id"));
			$("#btnsave").data("cc", $(this).data("cc"));

			$("#btnaddtocarts").data("order-id", $(this).data("order-id"));
			$("#btnaddtocarts").data("cc", $(this).data("cc"));

			$("#confirm-remove-item").show();

			$("#confirm-remove-item").offset({ top: $(this).offset().top - 50, left: $(this).offset().left - 100 });
		}
	});

	$("#close-confirm-remove-item").on("click", function(event) {
		event.preventDefault();

		$("#confirm-remove-item").hide();
	});

	$("#btnsave").on("click", function(event) {
		event.preventDefault();

		window.location = "Cart.asp?save=" + $(this).data("order-id") + "&cc=" + $(this).data("cc");
	});

	$("#btnaddtocarts").on("click", function(event) {
		event.preventDefault();

		window.location = "Cart.asp?remove=" + $(this).data("order-id") + "&cc=" + $(this).data("cc");
	});

	$("#applypromotion").on("click", function(event) {
		event.preventDefault();

		var promoCode = $("#promocode").val();
		var costCentre = $("#applypromotion").data("cc");

		if (promoCode !== "") {
			$("#applypromotion").attr("disabled", true);
			$("#applypromotion").val("Checking...");

			$.get("Promotions.asp?check=1&code=" + promoCode + "&cc=" + costCentre + "&ran=" + Math.random(), function(data, textStatus, jqXHR) {
				if (jqXHR.readyState === 4) {
					$("#applypromotion").attr("disabled", false);
					$("#applypromotion").val("Apply");

					if (jqXHR.responseText === "") {
						if ($("#promocode").val() === "") {
							$("#promotion").empty();
						} else {
							showAlertMessage("", "Promotion [" + promoCode + "] not found!", "error");
						}

						$("#promocode").val("");
					} else {
						window.location = "Promotions.asp?code=" + jqXHR.responseText + "&cc=" + costCentre;
					}
				}
			});
		}
	});

	$("#btncontinueshopping").on("click", function(event) {
		event.preventDefault();

		window.location = "cIndex.asp";
	});

	$("#btnaddtoothercarts").on("click", function(event) {
		event.preventDefault();

		var orders = "";

		$("#Form1 input[type='checkbox'][name='chkOrder']").each(function(index) {
			if (($this).is(":checked")) {
				orders += $(this).val() + ",";
			}
		});

		if (orders.length > 0 && orders[orders.length - 1] === ",") {
			orders = orders.substring(0, orders.length - 1);
		}

		window.location = "AdminCopyOrders.asp?OrderIds=" + orders + "&cc=" + $(this).data("cc");
	});

	$("#btnCheckout").on("click", function(event) {
		var orders = "";

		$("#Form1 input[type='checkbox'][name='chkOrder']").each(function(index) {
			if ($(this).is(":checked")) {
				orders += $(this).val() + ",";
			}
		});

		if (orders.length > 0 && orders[orders.length - 1] === ",") {
			orders = orders.substring(0, orders.length - 1);
		}

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