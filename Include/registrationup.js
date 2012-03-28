$(function() {
	var validator = new FormValidator("Form1",
		[{
			name: "FName",
			display: "First Name",
			rules: "required|max_length[20]"
		}, {
			name: "SName",
			display: "Last Name",
			rules: "required|max_length[20]"
		}, {
			name: "Phone",
			display: "Phone Number",
			rules: "required|callback_valid_phone"
		}, {
			name: "Fax",
			display: "Fax Number",
			rules: "callback_valid_phone"
		}, {
			name: "Password",
			display: "Password",
			rules: "required|max_length[50]"
		}, {
			name: "ConfirmPassword",
			display: "Password confirmation",
			rules: "required|matches[Password]"
		}, {
			name: "Email",
			display: "Email Address",
			rules: "required|valid_email|max_length[100]"
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

	validator.registerCallback("valid_phone", function(value) {
		return /^((([0-9]{1})*[- .(]*([0-9]{3})[- .)]*[0-9]{3}[- .]*[0-9]{4})+)*$/.test(value);
	}).setMessage("valid_phone", "The Phone Number field must be a valid phone number.");
});