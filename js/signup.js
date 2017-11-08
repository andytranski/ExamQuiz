$(document).ready(() => {
    $("#cancelButton").click(() => {
        window.location.href = "login.html"
    });

    $("#addUserButton").click(() => {

        const newUsername = $("#newUsername").val();
        const newPassword = $("#newPassword").val();

        if(!newUsername || !newPassword) {
            document.getElementById("emptyError").innerHTML = "Information missing";
        } else {
            SDK.signup(newUsername, newPassword, (err, data) => {
                if (err && err.xhr.status == 400) {
                    $(".form-group").addClass("Client fail");
                }
                else if (err) {
                    console.log("Error")
                } else {
                    console.log("New user");
                }
            });
        }
    });
});