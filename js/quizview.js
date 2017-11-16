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
            var tr = '<tr>';
            tr += '<td>' + quiz[key].createdBy + '</td>';
            tr += '<td>' + quiz[key].quizTitle + '</td>';
            tr += '<td>' + quiz[key].quizDescription + '</td>';
            tr += '<td>' + quiz[key].questionCount + '</td>';
            tr += '<td><button class="quizButton btn btn-primary pull-left" data-key="' + (key) + '">Questions</button></td>';
            tr += '<td><button class="deleteButton btn btn-warning pull-left" data-key="' + (key) + '"><span class="glyphicon glyphicon-trash"></span> </button></td>';
            tr += '</tr>';
            key + 1;
            $quizTableBody.append(tr);
        });

        $('button.quizButton').on('click', function () {
            var name = $(this).closest("tr").find("td:eq(1)").text();

            for (var i = 0; i < quiz.length; i++) {
                if (name === quiz[i].quizTitle) {
                    SDK.Storage.persist("chosenQuiz", quiz[i]);
                    SDK.loadQuestions((err, question) => {
                        if (err) throw err;
                        const questions = JSON.parse(question)
                        console.log(questions)

                        $('#quizModal').removeData("modal").modal({backdrop: 'static', keyboard: false})
                        $('#quizModal').modal('show');

                        var $questionTableBody = $("#questionTableBody");
                        $.each(questions, function (key, val) {
                            var tr = '<tr>';
                            tr += '<td >' + questions[key].question + '</td>';
                            tr += '</tr>';
                            $questionTableBody.append(tr);

                        });
                        $("#dismissButton").on("click", () => {
                            $questionTableBody.empty();
                        });
                    })
                }
            }
        });

        $("button.deleteButton").on('click', function () {
            var name = $(this).closest("tr").find("td:eq(1)").text();
            console.log(name)
            for (var i = 0; i < quiz.length; i++) {
                if (name === quiz[i].quizTitle) {
                    SDK.Storage.persist("chosenQuiz", quiz[i]);
                    SDK.deleteQuiz((err, data) => {
                        location.reload();
                    });
                }
            }

        });
    });


});

