$(document).ready(() => {
    //Load current user object with id
    const currentUser = SDK.currentUser();
    const userId = currentUser.userId;

    //Display logout button on menu


    if (currentUser.type === 1) {
        $("#tabs").html(" <li><a href=\"newquiz.html\">New quiz</a></li>\n" +
            "                    <li><a href=\"courseview.html\">All quiz</a></li>");

        $(".navbar-right").html(`
        <li><a href="#" id="logout-link">Log out</a></li>
    `);
    } else if (currentUser.type === 2) {

        $("#tabs").html("<li><a href=\"courseview.html\">All quiz</a></li>");

        $(".navbar-right").html(`
        <li><a href="profile.html" id="user-link">${currentUser.username}</a></li>
        <li><a href="#" id="logout-link">Log out</a></li>
    `);
    }

    //SDK request to load courses
    SDK.loadCourses((err, courses) => {
        //Save course list div as a constant
        const $courseList = $("#courseList");
        if (err) throw err;

        /*
        For every course object in the array a panel
        will be added to the course list. The panel
        consist of course title and button.
         */
        courses.forEach(course => {
            const courseHtml = `
        <div class="col-lg-4 book-container">
            <div class="panel panel-default">
                <div class="panel-heading">
                <!-- Use course title as header inside panel -->
                    <h3 class="panel-title">${course.courseTitle}</h3>
                </div>
                <div class="panel-body">
                    <div class="col-lg-4">
                    </div>
                <div class="col-lg-8">
                      <dl>
                      <!-- Set the information about the course -->
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
                        <div class="col-lg-8 text-right" style="height: 46px;">
                        <!-- Create button inside panel with course id reference --> 
                            <button class="btn btn-primary course-button" data-course-id="${course.courseId}">Go to</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
            $courseList.append(courseHtml);
        });

        //Listener on course button
        $('.course-button').on('click', function () {
            /*
            Refer to the exact button clicked and save id.
            Use find attribute to locate the id and save the
            chosen course object with same id.
             */
            const thisCourseId = $(this).data("course-id");
            const course = courses.find(c => c.courseId === thisCourseId);
            SDK.Storage.persist("chosenCourse", course)
            window.location.href = "quizview.html";


        });

    });
    //Listener on logout button
    $("#logout-link").click(() => {
        SDK.logOut(userId, (err, data) => {
            if (err && err.xhr.status == 401) {
                $(".form-group").addClass("has-error");
            } else {
                //Clear the local storage upon log out
                window.location.href = "login.html";
                SDK.Storage.remove("User")
                SDK.Storage.remove("Token")
                SDK.Storage.remove("chosenCourse")
                SDK.Storage.remove("chosenQuiz")
                SDK.Storage.remove("Courses")
            }
        })
    });

});