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


    SDK.loadQuizzes((err, quiz) => {
        if (err) throw err;
        const course = SDK.Storage.load("chosenCourse")
        var quiz = JSON.parse(quiz);
        $(".page-header").html(`<h1>${course.courseTitle}</h1>`);

        var $quizTableBody = $("#quizTableBody");

        $("#quizTableBody")


        $.each(quiz, function (key, val) {
            console.log(quiz[key].quizDescription)
            console.log(quiz[key].quizTitle)
            var tr = '<tr>';
            tr += '<td>' + quiz[key].createdBy + '</td>';
            tr += '<td>' + quiz[key].quizTitle + '</td>';
            tr += '<td>' + quiz[key].quizDescription + '</td>';
            tr += '<td>' + quiz[key].questionCount + '</td>';
            tr += '<td><button class="courseButton btn btn-primary pull-left" data-key="' + (key + 1) + '">Questions</button></td>';
            tr += '</tr>';
            $quizTableBody.append(tr);
        });

        $('button.courseButton').on('click', function () {
            var name = $(this).closest("tr").find("td:eq(0)").text();
            console.log(name)
        });


    });
});