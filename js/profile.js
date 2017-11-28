$(document).ready(() => {
    //Load current user object with id
    const currentUser = SDK.currentUser();
    const userId = currentUser.userId;

    //Display username on header
    $(".page-header").html(`<h1>${currentUser.username}</h1>`);

    //Display username and logout button on menu
    $(".navbar-right").html(`
        <li><a href="profile.html" id="user-link">${currentUser.username}</a></li>
        <li><a href="#" id="logout-link">Log out</a></li>
    `);

    //Listener on log out button
    $("#logout-link").click(() => {
        SDK.logOut(userId, (err, data) => {
            if (err && err.xhr.status == 401) {
                $(".form-group").addClass("has-error");
            } else {
                //Clear the local storage upon log out
                window.location.href = "login.html";
                SDK.Storage.remove("User")
                SDK.Storage.remove("token")
            }
        })
    });
});

