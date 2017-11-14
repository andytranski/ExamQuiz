$(document).ready(() => {

    const currentUser = SDK.currentUser();
    const userId = currentUser.userId;

    $(".navbar-right").html(`
        <li><a href="profile.html" id="user-link">${currentUser.username}</a></li>
        <li><a href="#" id="logout-link">Log out</a></li>
    `);

    $("#logout-link").click(() => {
        SDK.logOut(userId, (err, data) => {
            if (err && err.xhr.status == 401) {
                $(".form-group").addClass("has-error");
            } else {
                window.location.href = "login.html";
                SDK.Storage.remove("User")
                SDK.Storage.remove("token")
            }
        })
    });

    SDK.loadCourses((err, courses) => {
        if (err && err.xhr.status == 401) {
            $(".form-group").addClass("Client fail");
        } else {
            var courses = JSON.parse(courses);


            for (var key in courses) {
                if (!courses.hasOwnProperty(key)) {
                } else {
                    var val = courses[key];
                        $(".radioButtons").html(`<label><input type="radio" name="optradio" class="Option1">${val.courseTitle}</label>`)

                }
            }

        }
    });


});
