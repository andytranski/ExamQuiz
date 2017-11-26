$(document).ready(() => {

    //Listener on login button
    $("#loginButton").click(() => {
        //Save user input as let
        let username = $("#inputUsername").val();
        let password = $("#inputPassword").val();

        //Verify that input isn't empty
        if (!username || !password) {
            alert("no input");
        } else {
            //SDK request to log in
            SDK.login(username, password, (err, token) => {
                if (err && err.xhr.status == 401) {
                    $(".form-group").addClass("Client fail");
                }
                else if (err) {
                    console.log("Error");
                    //Verify that a token is created
                } else if (SDK.Storage.load("Token") === null) {
                    $("#inputPassword").val('');
                }
                else {
                    //SDK request to load current user
                    SDK.loadCurrentUser((err, data) => {
                        if (err && err.xhr.status == 401) {
                            $(".form-group").addClass("Client fail");
                        } else {
                            //Clarify user object type
                            let myUser = JSON.parse(data)
                            let currentUser = myUser.currentUser;
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
    //Listener on sign up button
    $("#signUpButton").click(() => {
        window.location.href = "signup.html";
    });
});