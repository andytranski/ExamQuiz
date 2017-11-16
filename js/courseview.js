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

    SDK.loadCourses((err, course) => {
        if (err) throw err;

        var course = JSON.parse(course);
        $(".page-header").html(`<h1>Course</h1>`);
        //SDK.Storage.remove("chosenCourse");

        var $courseTableBody = $("#courseTableBody");

        $.each(course, function (key, val) {
            var tr = '<tr>';
            tr += '<td >' + course[key].courseTitle + '</td>';
            tr += '<td> <button class="courseButton btn btn-primary pull-left" data-key="' + (key + 1) + '">View quiz</button></td>';
            tr += '</tr>';
            $courseTableBody.append(tr);
        });

        $('button.courseButton').on('click', function () {
            var name = $(this).closest("tr").find("td:eq(0)").text();
            window.location.href = "quizview.html";

            for (var i = 0; i < course.length; i++) {
                if (name === course[i].courseTitle) {
                    SDK.Storage.persist("chosenCourse", course[i])
                }
            }

        });


    });

});