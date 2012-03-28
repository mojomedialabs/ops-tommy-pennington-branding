function isWhitespace(str) {
	return str.trim().length === 0;
}

/*if (String.prototype.isWhitespace === undefined) {
    String.prototype.isWhitespace = function() {
        return this.trim().length === 0;
    }
}*/

function getUrlParams() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf("?") + 1).split("&");

    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }

    return vars;
}

function showAlertMessage(alertMessageTitle, alertMessageBody, alertMessageClass) {
	$("#alert-message-title").empty();

	$("#alert-message-title").append(alertMessageTitle);

	$("#alert-message-body").empty();

	$("#alert-message-body").append(alertMessageBody);

	$("#alert-message").removeClass();

	$("#alert-message").addClass(alertMessageClass);

	$("#alert-message").stop().show().css({ opacity: 1.0 }).fadeTo(4000, 0.0);
}

$.fn.forceInteger = function() {
	return this.each(function() {
		$(this).keydown(function(event) {
			var key = event.which || event.keyCode;

			if (!(!event.shiftKey && !event.altKey && !event.ctrlKey &&
				//numbers
				((key >= 48 && key <= 57) ||
				//numeric keypad
				(key >= 96 && key <= 105) ||
				//backspace, tab, and enter
				key === 8 || key === 9 || key === 13 ||
				//home and end
				key === 35 || key === 36 ||
				//left and right arrows
				key === 37 || key === 39 ||
				//delete and insert
				key === 46 || key === 45))) {
				event.preventDefault();
			}
		});
	});
};

$(function() {
	$("a.new-window").on("click", function(event) {
		event.preventDefault();

		var height = 300;
		var width = 450;

		if ($(this).data("height")) {
			height = $(this).data("height");
		}

		if ($(this).data("width")) {
			width = $(this).data("width");
		}

		var left = (screen.width / 2) - (width / 2);
		var top = (screen.height / 2) - (height / 2);

		var resizable = "no";

		if ($(this).data("resizable")) {
			resizable = $(this).data("resizable");
		}

		var newWindow = window.open($(this).attr("href"), $(this).attr("title"), "left=" + left + ",top=" + top + ",height=" + height + ",width=" + width + ",menubar=no,toolbar=no,location=no,personalbar=no,status=no,resizable=" + resizable + ",scrollbars=no");

		newWindow.focus();
	});

	$(".show-alert-message").on("mouseover", function(event) {
		showAlertMessage($(this).data("alert-message-title"), $(this).data("alert-message-body"), $(this).data("alert-message-class"));
	});

	$("#alert-message").on("mouseover", function(event) {
		$(this).stop().css({ opacity: 1.0 });
	});

	$("#alert-message").on("mouseout", function(event) {
		$(this).fadeTo(2000, 0.0);
	});
});
