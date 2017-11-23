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
        const $courseList = $("#courseList");

        var courses = JSON.parse(course);
        $(".page-header").html(`<h1>Course</h1>`);

        courses.forEach(course => {
            const courseHtml = `
        <div class="col-lg-4 book-container">
            <div class="panel panel-default">
                <div class="panel-heading">
                    <h3 class="panel-title">${course.courseTitle}</h3>
                </div>
                <div class="panel-body">
                    <div class="col-lg-4">
                    </div>
                <div class="col-lg-8">
                      <dl>
                        <dt>Course</dt>
                        <dd>${course.courseTitle}</dd>
                        <dt>Course ID</dt>
                        <dd>${course.courseId}</dd>
                      </dl>
                    </div>
                </div>
                <div class="panel-footer">
                    <div class="row">
                        <div class="col-lg-4 price-label">
                        </div>
                        <div class="col-lg-8 text-right">
                            <button class="btn btn-primary course-button" data-course-id="${course.courseId}">Go to</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
            $courseList.append(courseHtml);

        });

        $('.course-button').on('click', function () {
            const thisCourseId = $(this).data("course-id");
            const course = courses.find(c => c.courseId === thisCourseId);
            SDK.Storage.persist("chosenCourse", course)
            window.location.href = "quizview.html";

        });


    });

});