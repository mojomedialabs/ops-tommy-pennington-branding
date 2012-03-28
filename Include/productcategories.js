function HasSelected(ctrlRadio, strCaption) {
	var blnOK = false;

	if (ctrlRadio.length != null) {
		for (var i = 0; i < ctrlRadio.length; i++) {
			if (ctrlRadio[i].checked) {
				if (document.getElementById("totalqty" + ctrlRadio[i].value) != null) {
					if (!String(document.getElementById("totalqty" + ctrlRadio[i].value).value).match(/^\d+$/)) {
						showAlertMessage("Error!", "Please enter a numeric quantity!", "error");
						document.getElementById("totalqty" + ctrlRadio[i].value).focus();
						return false;
					}
				}
				blnOK = true;
				if (!CheckExtraFields(ctrlRadio[i].value)) return false;

				if (document.getElementById("qty" + ctrlRadio[i].value) != null) {
					if (!String(document.getElementById("qty" + ctrlRadio[i].value).value).match(/^\d+$/)) {
						showAlertMessage("Error!", "Please enter a numeric quantity!", "error");
						document.getElementById("qty" + ctrlRadio[i].value).focus();
						return false;
					}
				}
				blnOK = true;
				if (!CheckExtraFields(ctrlRadio[i].value)) return false;
			}
		}
		if (blnOK) return true;
	} else if (ctrlRadio.checked) {
		return CheckExtraFields(ctrlRadio.value);
	}
	showAlertMessage("Error!", "Please select a " + strCaption, "error");
	return false;
}

function CheckExtraFields(ProductId) {
	return true;
}

function FillBox(strCurBox, intArrayIndex) {
	var aryArraysCur = eval('aryArrays' + intArrayIndex);
	var aryBoxesCur = eval('aryBoxes' + intArrayIndex);
	var aryBoxValuesCur = eval('aryBoxValues' + intArrayIndex);

	for (var i = 0; i < aryArraysCur.length; i++) {
		if (aryArraysCur[i] == strCurBox) {
			aryBoxValuesCur[i] = document.Form1.elements[aryBoxesCur[i]].value;
			for (var j = i + 1; j < aryArraysCur.length; j++) {
				SetupBox(document.Form1.elements[aryBoxesCur[j]], eval(aryArraysCur[j]), j, intArrayIndex);
			}

			break;
		}
	}

	for (var i = 0; i < aryBoxesCur.length; i++) {
		aryBoxValuesCur[i] = document.Form1.elements[aryBoxesCur[i]].value;
	}

	GetCost(aryProductIds[intArrayIndex - 1], intArrayIndex);
}

function GetCost(strProduct, intArrayIndex) {
	if (document.getElementById('qty' + strProduct) != null) {
		var aryCosting = eval('aryProductCost' + strProduct);
		var aryUrgentCosting = eval('aryProductUrgentCost' + strProduct);
		var cboCurrent = document.getElementById('qty' + strProduct);
		var intIndex = -1;
		var i = 0;
		var strCost2 = 0;
		var strCost = 0;
		var strUrgentCost = 0;
		var checkUrgent = document.getElementById('urgent' + strProduct);

		if (cboCurrent[1].value != '0') {
			for (i = 0; i < aryCosting.length; i = i + 2) {
				if (aryCosting[i] == cboCurrent[cboCurrent.selectedIndex].value) {
					intIndex = i;
				}
			}
		} else {
			for (var i = 0; i < document.Form1.elements.length; i++) {
				if (document.Form1.elements[i].type == "checkbox") {
					if (document.Form1.elements[i].value == strProduct) {
						document.Form1.elements[i].style.display = "none";
					}
				}
			}
		}

		if (intIndex >= 0) {
			strCost = aryCosting[intIndex + 1];
			if (checkUrgent != null) {
				if (document.Form1.elements['urgent' + strProduct].value != '') {
					if (document.Form1.elements['urgent' + strProduct].checked) strUrgentCost = aryUrgentCosting[intIndex + 1];
				}
			}
			if (strCost == '') strCost = 0;
			if (strUrgentCost == '') strUrgentCost = 0;
		}

		if (intArrayIndex > 0) {
			var aryCur = eval('aryBoxValues' + intArrayIndex)
			var aryCur2;
			for (i = 0; i < aryCur.length; i++) {
				if (aryCur[i] != '') {
					aryCur2 = eval(eval('aryArrays' + intArrayIndex)[i]);
					for (var j = 0; j < aryCur2.length; j++) {
						if (aryCur2[j][0] == aryCur[i]) {
							switch (aryCur2[j][6]) {
							case 'total':
								strCost2 = strCost2 + (parseFloat(aryCur2[j][5]) * cboCurrent[cboCurrent.selectedIndex].text);
								break;
							case 'units':
								strCost2 = strCost2 + (parseFloat(aryCur2[j][5]) * cboCurrent[cboCurrent.selectedIndex].value);
								break;
							default:
								strCost2 = strCost2 + parseFloat(aryCur2[j][5]);
							}
							break;
						}
					}
				}
			}
		}

		strCost = strCost + strCost2 + strUrgentCost;
		if (strCost == 0) {
			strCost = ''
		} else {
			strCost = CurrencyFormatted(strCost)
		};
		if (strCost != '') {
			strCost = '<br>$' + strCost;
			eval(document.getElementById("templatecost" + strProduct)).innerHTML = strCost;
		}

		if (cboCurrent[cboCurrent.selectedIndex].value == "") {
			document.Form1.elements['template' + strProduct].checked = false;
		} else {
			document.Form1.elements['template' + strProduct].checked = true;
		}
	}
}

function CheckMe(strProduct) {
	if (document.Form1.elements['totalqty' + strProduct].value > 0) {
		document.Form1.elements['template' + strProduct].checked = true;
	} else {
		document.Form1.elements['template' + strProduct].checked = false;
	}
}

function CurrencyFormatted(strCost) {
	var minus = '';
	var i = parseFloat(strCost);

	if (isNaN(i)) i = 0.00;
	if (i < 0) minus = '-';
	i = Math.abs(i);
	i = parseInt((i + .005) * 100);
	i = (i / 100);
	s = new String(i);
	if (s.indexOf('.') < 0) s += '.00';
	if (s.indexOf('.') == (s.length - 2)) s += '0';
	s = minus + s;
	return s;
}

function SetupBoxes() {
	var aryArraysCur;
	var aryBoxesCur;

	for (var i = 1; i <= aryProductIds.length; i++) {
		aryArraysCur = eval('aryArrays' + i);
		aryBoxesCur = eval('aryBoxes' + i);
		for (var j = 0; j < aryBoxesCur.length; j++) {
			SetupBox(document.getElementById(aryBoxesCur[j]), eval(aryArraysCur[j]), j, i);
		}
	}

	for (var i = 0; i < aryAllProductIds.length; i++) {
		GetCost(aryAllProductIds[i], 0);
	}
}

function SetupBox(cboCur, aryOp, intIndex, intArrayIndex) {
	var aryCur;
	var aryCur2;
	var aryCur3;
	var aryCurBoxValues;
	var cboCur;
	var blnAddIt = true;

	aryCurBoxValues = eval('aryBoxValues' + intArrayIndex);

	while (cboCur.length > 0) cboCur.remove(0);

	cboCur[cboCur.length] = new Option('', '');

	for (var i = 0; i < aryOp.length; i++) {
		aryCur = aryOp[i];

		for (var j = 0; j < aryCur.length; j = j + 7) {
			if (aryCur[j + 2] == true) {
				blnAddIt = true;
			} else {
				aryCur2 = eval('aryLink' + aryCur[j]);
				for (var k = 0; k < aryCur2.length; k++) {
					aryCur3 = aryCur2[k];
					blnAddIt = true;
					for (var l = 0; l < aryCur3.length; l++) {
						blnAddIt = InArray(aryCur3[l], aryCurBoxValues);
						if (blnAddIt == false) break;
					}

					if (blnAddIt) break;
				}
			}
			if (blnAddIt) {
				cboCur[cboCur.length] = new Option(aryCur[j + 1], aryCur[j]);
				if (aryCurBoxValues[intIndex] == aryCur[j]) cboCur.selectedIndex = cboCur.length - 1;
			}
		}
	}
	return true;
}

function InArray(strItem, aryCurBoxValues) {
	for (var i = 0; i < aryCurBoxValues.length; i++) {
		if (strItem == aryCurBoxValues[i]) return true;
	}
	return false;
}

function isEmpty(strCurrent) {
	return ((strCurrent == null) || (strCurrent.length == 0));
}

function CheckEntry(ctrlCur, strCaption, blnRequired, strLength, strType, strErrorMessage) {
	var strTempMsg = strErrorMessage;

	if ((isWhitespace(document.Form1.elements[ctrlCur].value)) && blnRequired) {
		if (strTempMsg != '') {
			alert(strTempMsg);
		} else {
			alert('You must enter a value for ' + strCaption);
		}
		document.Form1.elements[ctrlCur].focus();
		return false;
	}

	if (strLength != '') {
		var intLen = parseInt(strLength);

		if (intLen != 0) {
			if ((document.Form1.elements[ctrlCur].value.length != intLen) && (strType == 'exactly')) {
				if ((blnRequired == false) && (document.Form1.elements[ctrlCur].value.length == 0)) return true;
				if (strErrorMessage == '') {
					strTempMsg = 'Please enter ' + strLength + ' characters for ' + strCaption
				}
				alert(strTempMsg);

				return false;
			}

			if ((document.Form1.elements[ctrlCur].value.length < intLen) && (strType == 'at least')) {
				if ((blnRequired == false) && (document.Form1.elements[ctrlCur].value.length == 0)) return true;
				if (strErrorMessage == '') {
					strTempMsg = 'Please enter at least ' + strLength + ' characters for ' + strCaption
				}
				alert(strTempMsg);

				return false;
			}

			if ((document.Form1.elements[ctrlCur].value.length > intLen) && (strType == 'at most')) {
				if ((blnRequired == false) && (document.Form1.elements[ctrlCur].value.length == 0)) return true;
				if (strErrorMessage == '') {
					strTempMsg = 'Please enter at most ' + strLength + ' characters for ' + strCaption + '\n(You have entered ' + document.Form1.elements[ctrlCur].value.length + ' characters)'
				}
				alert(strTempMsg);

				return false;
			}
		}
	}

	return true;
}

function download(objThis, strTId) {
	window.location = 'DownloadProduct.asp?downloadpdf=1&tid=' + strTId;
}

function functionOnLoad() {
	return SetupBoxes();
}

$(function() {
	var minimumQuantity = $(".product-minimum-quantity");

	if ($(".product-minimum-quantity").length > 0) {
		minimumQuantity = minimumQuantity.text().trim();

		if (minimumQuantity.length !== 0) {
			if (minimumQuantity.indexOf(": ") !== -1) {
				minimumQuantity = parseInt(minimumQuantity.substr(minimumQuantity.indexOf(": ") + 2));

				if (isNaN(minimumQuantity)) {
					minimumQuantity = 1;
				}
			} else {
				minimumQuantity = 1;
			}
		} else {
			minimumQuantity = 1;
		}
	} else {
	    minimumQuantity = 1;
	}

	$(".product-thumbnail img").removeAttr("width");

	$(".product-actions input[type='checkbox']").attr("checked", true);

	if (($(".product").length !== 0) || ($(".template-product").length !== 0)) {
		$("#product-categories").remove();
	}

	$("#favorites img").remove();

	if ($(".extras-headers").text() !== "") {
		$(".product-quantity input[type='text']").attr("disabled", true);

		var extraFieldHeaders = $(".extras-headers").text().split(";");

		$(".product-extras input[type='text']").each(function(index) {
			$(this).wrap("<div class='product-extra-field' />");

			$(this).before("<label for='" + $(this).attr("name") + "'>" + extraFieldHeaders[index] + "</label>");
		});

		$(".product-extra-field input[type='text']").forceInteger();

		$(".product-extra-field input[type='text']").keyup(function() {
			var totalQuantity = 0;

			$(".product-extra-field input[type='text']").each(function() {
				var quantity = parseInt($(this).val());

				if (isNaN(quantity)) {
					quantity = 0;
				}

				totalQuantity += quantity;
			});

			$(".product-quantity input[type='text']").val(totalQuantity.toString());
		});
	}

	if (getUrlParams()["itemsadded"] === "1") {
		showAlertMessage("", "You have added " + $(".product-name h1").text().trim() + " to your cart. View <a href='cart.asp'>your cart</a> to review.", "success");
	}

	$("Form1").on("submit", function(event) {
		$(".product-quantity input[type='text']").attr("disabled", false);

		return HasSelected(document.Form1.elements['template'], 'Product');
	});

	var validator = new FormValidator("Form1",
		[{
			name: $(".product-quantity input[type='text']").attr("name"),
			display: "Quantity",
			rules: "required|callback_valid_quantity"
		}],
		function(errors, event) {
			if (errors.length > 0) {
				showAlertMessage("Error!", errors.join("<br />"), "error");

				if (event && event.preventDefault) {
					event.preventDefault();
				} else if (event) {
					event.returnValue = false;
				}
			}
		}
	);

	validator.registerCallback("valid_quantity", function(value) {
		var quantity = parseInt($(".product-quantity input[type='text']").val());

		return (($(".product-quantity input[type='text']").val() !== "") && (quantity >= minimumQuantity));
	}).setMessage("valid_quantity", "You must order at least " + minimumQuantity.toString() + " of this product.");
});