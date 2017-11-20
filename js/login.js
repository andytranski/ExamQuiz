$(document).ready(() => {
    $("#loginButton").click(() => {

        let username = $("#inputUsername").val();
        let password = $("#inputPassword").val();

        if (!username || !password) {
            document.getElementById("error").innerHTML = "Information missing";
        } else {
            SDK.login(username, password, (err, data) => {
                if (err && err.xhr.status == 401) {
                    $(".form-group").addClass("Client fail");
                    document.getElementById("error").innerHTML = "Wrong username or password";
                }
                else if (err) {
                    console.log("Error");
                } else if (SDK.Storage.load("Token") === null) {
                    $("#inputPassword").val('');
                    document.getElementById("error").innerHTML = "No user found";
                }
                else {
                    SDK.loadCurrentUser((err, data) => {
                        if (err && err.xhr.status == 401) {
                            $(".form-group").addClass("Client fail");
                            document.getElementById("error").innerHTML = "Wrong username or password";
                        } else {
                            var myUser = JSON.parse(data)
                            var currentUser = myUser.currentUser;
                            if(currentUser.type === 1) {
                                window.location.href = "courseview.html";
                            } else {
                                window.location.href ="profile.html"
                            }

                        }

                    });

                }
            });
        }

    });

    $("#signUpButton").click(() => {
        window.location.href = "signup.html";
    });
});