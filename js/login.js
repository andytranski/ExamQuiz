$(document).ready(() => {
    $("#loginButton").click(() => {

        const username = $("#inputUsername").val();
        const password = $("#inputPassword").val();

        if (!username || !password) {
            document.getElementById("error").innerHTML = "Information missing";
        } else {
            SDK.login(username, password, (err, data) => {
                if (err && err.xhr.status == 401) {
                    $(".form-group").addClass("Client fail");
                    document.getElementById("error").innerHTML = "Wrong username or password";
                }
                else if (err) {
                    console.log("Error")
                } else {
                    SDK.loadCurrentUser((err, user) => {
                        window.location.href = "profile.html";
                    });

                }
            });
        }

    });

    $("#signUpButton").click(() => {
        window.location.href = "signup.html";
    });
});