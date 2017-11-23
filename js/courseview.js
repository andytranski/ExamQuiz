$(document).ready(() => {
    const currentUser = SDK.currentUser();
    const userId = currentUser.userId;

    $(".navbar-right").html(`
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
    /*

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
*/

    SDK.loadCourses((err, course) => {
        const $courseList = $("#courseList");
        if (err) throw err;
        var courses = JSON.parse(course);
        console.log(courses);

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
                            <button class="btn btn-primary purchase-button">Go to</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
            $courseList.append(courseHtml);

        });
        $('button.btn').on('click', function () {
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