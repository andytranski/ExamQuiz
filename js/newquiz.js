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
            var courses = JSON.parse(courses);
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
        const questionCount = 10;

        for (var i = 0; i < allCourses.length; i++) {
            if (chosenCourse === allCourses[i].courseTitle) {
                courseId = allCourses[i].courseId;
            }
        }

        SDK.createQuiz(createdBy, questionCount, quizTitle, quizDescription, courseId, (err, data) => {
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
                var newQuiz = JSON.parse(data);

                $("#addQuestionButton").click(() => {
                    const createdQuestion = $("#question").val();
                    const questionToQuizId = newQuiz.quizId;

                    SDK.createQuestion(createdQuestion, questionToQuizId, (err, data) => {
                        if (err && err.xhr.status == 400) {
                            $(".form-group").addClass("Client fail");
                        }
                        else if (err) {
                            console.log("Error")
                        } else {
                            $("#question").val("");

                            $(".modal-title").html(`<h1>Question ${++i}</h1>`);
                            $(".question-added").html(`<h4 id="text">Question added</h4>`);


                            const newQuestion = JSON.parse(data);
                            const optionToQuestionId = newQuestion.questionId;
                            const correct = $("#correct").val();
                            console.log(correct);
                            const wrong1 = $("#wrong1").val();
                            console.log(wrong1);
                            const wrong2 = $("#wrong2").val();
                            console.log(wrong2);
                            const wrong3 = $("#wrong3").val();
                            console.log(wrong3);

                            var isCorrect = 1;

                            SDK.createOption(correct, optionToQuestionId, isCorrect, (err, data) => {
                                if (err && err.xhr.status == 400) {
                                    $(".form-group").addClass("Client fail");
                                }
                                else if (err) {
                                    console.log("Error")
                                } else {
                                    $("#correct").val("")

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
                $("#saveChangesButton").click(() => {
                    window.location.href = "courseview.html"

                });
            };

        });


    });
});
