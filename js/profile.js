$(document).ready(() => {
    const currentUser = SDK.currentUser();

    $(".page-header").html(`<h1>Hi, ${currentUser.username}</h1>`);

    $("#logoutButton").click(() => {
        const userId = currentUser.userId;
        SDK.logOut(userId, (err, data) => {
            if(err && err.xhr.status === 401) {
                $(".form-group").addClass("has-error");
            } else {
               window.location.href = "login.html";
                SDK.Storage.remove("User")
                SDK.Storage.remove("Token")
            }
        });
    });

});

