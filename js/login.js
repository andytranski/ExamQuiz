$(document).ready(() => {
    $("#loginButton").click(() => {

        const username = $("#inputUsername").val();
        const password = $("#inputPassword").val();

        SDK.login(username, password, (err, data) => {
            if(err && err.xhr.status == 401) {
                $(".form-group").addClass("Client fail");
                document.getElementById("error").innerHTML = "Wrong username or password";
            }
            else if(err) {
                console.log("Error")
            } else {
                console.log("hej")
                window.location.href ="test.html";
            }
        });

    });
});