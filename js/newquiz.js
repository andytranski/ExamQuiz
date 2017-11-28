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

    SDK.loadCourses((err, courses) => {
        if (err && err.xhr.status == 401) {
            $(".form-group").addClass("Client fail");
        } else {
            var option = "";

            SDK.Storage.persist("Courses", courses)

            for (var i = 0; i < courses.length; i++) {
                option += '<option value="' + courses[i].courseTitle + '">' + courses[i].courseTitle + '</option>';
            }
            $("#sell").append(option);

        }
    });

    $("#addQuizButton").click(() => {
        const createdBy = currentUser.username;
        const quizTitle = $("#quizTitle").val();
        const quizDescription = $("#quizDescription").val();
        const chosenCourse = $("#sell").val();
        const allCourses = SDK.Storage.load("Courses")
        const questionCount = 0;

        if (quizTitle) {
            for (var i = 0; i < allCourses.length; i++) {
                if (chosenCourse === allCourses[i].courseTitle) {
                    courseId = allCourses[i].courseId;
                    SDK.Storage.persist("chosenCourse", allCourses[i])
                }
            }

            SDK.createQuiz(createdBy, questionCount, quizTitle, quizDescription, courseId, (err, newQuiz) => {
                if (err && err.xhr.status == 400) {
                    $(".form-group").addClass("Client fail");
                }
                else if (err) {
                    console.log("Error")
                } else {
                    $("#quizTitle").val('');
                    $("#quizDescription").val('');
                    $("#sell").val($("#sell option:first").val());

                    $('#questionModal').modal('show');
                    var i = 1;
                    $(".modal-title").html(`<h1>Question ${i}</h1>`);
                    SDK.Storage.persist()

                    var questionCounter = 0;
                    $("#addQuestionButton").click(() => {
                        questionCounter++;
                        const createdQuestion = $("#question").val();
                        const questionToQuizId = newQuiz.quizId;

                        SDK.createQuestion(createdQuestion, questionToQuizId, (err, newQuestion) => {
                            if (err && err.xhr.status == 400) {
                                $(".form-group").addClass("Client fail");
                            }
                            else if (err) {
                                console.log("Error")
                            } else {
                                $("#question").val("");

                                $(".modal-title").html(`<h1>Question ${++i}</h1>`);
                                $(".question-added").html(`<h4 id="text">Question added</h4>`);

                                const optionToQuestionId = newQuestion.questionId;
                                const correct = $("#correct").val();
                                const wrong1 = $("#wrong1").val();
                                const wrong2 = $("#wrong2").val();
                                const wrong3 = $("#wrong3").val();

                                var isCorrect = 1;
                                SDK.createOption(correct, optionToQuestionId, isCorrect, (err, data) => {
                                    if (err && err.xhr.status == 400) {
                                        $(".form-group").addClass("Client fail");
                                    }
                                    else if (err) {
                                        console.log("Error")
                                    } else {
                                        $("#correct").val("")

                                        var isCorrect = 0;
                                        SDK.createOption(wrong1, optionToQuestionId, isCorrect, (err, data) => {
                                            if (err && err.xhr.status == 400) {
                                                $(".form-group").addClass("Client fail");
                                            }
                                            else if (err) {
                                                console.log("Error")
                                            } else {
                                                $("#wrong1").val("");

                                                SDK.createOption(wrong2, optionToQuestionId, isCorrect, (err, data) => {
                                                    if (err && err.xhr.status == 400) {
                                                        $(".form-group").addClass("Client fail");
                                                    }
                                                    else if (err) {
                                                        console.log("Error")
                                                    } else {
                                                        $("#wrong2").val("");

                                                        SDK.createOption(wrong3, optionToQuestionId, isCorrect, (err, data) => {
                                                            if (err && err.xhr.status == 400) {
                                                                $(".form-group").addClass("Client fail");
                                                            }
                                                            else if (err) {
                                                                console.log("Error")
                                                            } else {
                                                                $("#wrong3").val("");

                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    });
                }
                $("#saveChangesButton").click(() => {
                    SDK.updateQuestionCount(questionCounter, newQuiz.quizId, (err, data) => {
                        window.location.href = "quizview.html";
                    });

                });
            });
        }
    });
});
