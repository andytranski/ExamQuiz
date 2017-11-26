$(document).ready(() => {
    //Hide bootstrap alert
    $(".alert").hide();

    $("#addUserButton").click(() => {
            //Save user input as let
            let newUsername = $("#newUsername").val();
            let newPassword = $("#newPassword").val();
            let newPasswordVerifier = $("#newPasswordVerify").val();

            //Verify that input isn't empty
            if (!newUsername || !newPassword || !newPasswordVerifier) {
                //Toggle the alert. Alert fade away after time
                $(".alert").show();
                $(".alert").fadeTo(2000, 100).slideUp(500, function () {
                    $(".alert").alert('close');
                });
            } else {
                //Verify that password matches
                if (newPassword.valueOf() === newPasswordVerifier.valueOf()) {
                    SDK.signup(newUsername, newPassword, (err, user) => {
                        if (err && err.xhr.status == 400) {
                            $(".form-group").addClass("Client fail");
                        }
                        else if (err) {
                            console.log("Error")
                        } else {
                            //Alert the user created
                            window.alert(newUsername + "\t" + "Sign up successful")
                            window.location.href = "login.html"

                        }
                    });
                } else {
                    //Clear the password inputs and toggle alert
                    $("#newPassword").val('');
                    $("#newPasswordVerify").val('');
                    $(".alert").show();
                    $(".alert").fadeTo(2000, 500).slideUp(500, function () {
                        $(".alert").alert('close');
                    });

                }

            }
        }
    );
    //Lisetener on cancel button
    $("#cancelButton").click(() => {
        window.location.href = "login.html"
    });
});