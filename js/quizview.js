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

    if (currentUser.type === 1) {
        $("#tabs").html(" <li><a href=\"newquiz.html\">New quiz</a></li>\n" +
            "                    <li><a href=\"courseview.html\">All quiz</a></li>");

        SDK.loadQuizzes((err, quiz) => {
            if (err) throw err;
            const course = SDK.Storage.load("chosenCourse")
            var quizzes = JSON.parse(quiz);
            $(".page-header").html(`<h1>${course.courseTitle}</h1>`);

            var $quizList = $("#quizList");

            quizzes.forEach(quiz => {
                const quizHtml = `
        <div class="col-lg-4 quiz-container">
            <div class="panel panel-default">
                <div class="panel-heading">
                    <h3 class="panel-title">${quiz.quizTitle}</h3>
                </div>
                <div class="panel-body">
                    <div class="col-lg-4">
                    </div>
                    <div class="col-lg-8">
                      <dl>
                        <dt>Quiz</dt>
                        <dd>${quiz.quizTitle}</dd>
                        <dt>Quiz ID</dt>
                        <dd>${quiz.quizId}</dd>
                        <dt>Created By</dt>
                        <dd>${quiz.createdBy}</dd>
                         <dt>Questions</dt>
                        <dd>${quiz.questionCount}</dd>
                      </dl>
                    </div>
                </div>
                <div class="panel-footer">
                    <div class="row">
                        <div class="col-lg-4"></div>
                        <div class="col-lg-8 text-right">
                            <button class="btn btn-primary quiz-button" data-quiz-id="${quiz.quizId}">Choose</button>
                            <button class="btn btn-danger delete-button" data-quiz-id="${quiz.quizId}"><span class="glyphicon glyphicon-trash"></span> </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;

                $quizList.append(quizHtml);
            });

            $('.quiz-button').on('click', function () {
                const thisQuizId = $(this).data("quiz-id");
                const quiz = quizzes.find(q => q.quizId === thisQuizId);

                SDK.Storage.persist("chosenQuiz", quiz);
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
            });
            $('.delete-button').on('click', function () {
                console.log("Hey")
                const thisQuizId = $(this).data("quiz-id");
                const quiz = quizzes.find(q => q.quizId === thisQuizId);

                SDK.Storage.persist("chosenQuiz", quiz);
                SDK.deleteQuiz((err, data) => {
                    location.reload();
                });


            });
        });
    } else {
        SDK.loadQuizzes((err, quiz) => {
            $("#tabs").html("<li><a href=\"usercourseview.html\">All quiz</a></li>");

            if (err) throw err;

            const course = SDK.Storage.load("chosenCourse")
            var quizzes = JSON.parse(quiz);
            $(".page-header").html(`<h1>${course.courseTitle}</h1>`);

            var $quizList = $("#quizList");

            quizzes.forEach(quiz => {
                const quizHtml = `
        <div class="col-lg-4 quiz-container">
            <div class="panel panel-default">
                <div class="panel-heading">
                    <h3 class="panel-title">${quiz.quizTitle}</h3>
                </div>
                <div class="panel-body">
                    <div class="col-lg-4">
                    </div>
                    <div class="col-lg-8">
                      <dl>
                        <dt>Quiz</dt>
                        <dd>${quiz.quizTitle}</dd>
                        <dt>Created By</dt>
                        <dd>${quiz.createdBy}</dd>

                         <dt>Questions</dt>
                        <dd>${quiz.questionCount}</dd>
                      </dl>
                    </div>
                </div>
                <div class="panel-footer">
                    <div class="row">
                        <div class="col-lg-4"></div>
                        <div class="col-lg-8 text-right">
                            <button class="btn btn-primary quiz-button" data-quiz-id="${quiz.quizId}">Choose</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;

                $quizList.append(quizHtml);
            });

            $('.quiz-button').on('click', function () {
                const thisQuizId = $(this).data("quiz-id");
                const quiz = quizzes.find(q => q.quizId === thisQuizId);
                SDK.Storage.persist("chosenQuiz", quiz);
                window.location.href = "startquiz.html";
            });

        });
    }


});

