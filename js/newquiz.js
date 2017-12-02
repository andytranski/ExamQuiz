$(document).ready(() => {

    //Load current user object with id
    const currentUser = SDK.currentUser();
    const userId = currentUser.userId;

    //Display logout button on menu
    $(".navbar-right").html(`
        <li><a href="#" id="logout-link">Log out</a></li>
    `);

    //SDK request to load courses
    SDK.loadCourses((err, courses) => {
        if (err && err.xhr.status == 401) {
            $(".form-group").addClass("Client fail");
        } else {
            //Empty option array
            var option = "";

            //Persist the specific course
            SDK.Storage.persist("Courses", courses)

            //For-loop to add course titles into array
            for (var i = 0; i < courses.length; i++) {
                option += '<option value="' + courses[i].courseTitle + '">' + courses[i].courseTitle + '</option>';
            }
            //Append the option array into selector
            $("#sell").append(option);

        }
    });
    //Listener on add quiz button
    $("#addQuizButton").click(() => {
        //Save information as constants
        const createdBy = currentUser.username;
        const quizTitle = $("#quizTitle").val();
        const quizDescription = $("#quizDescription").val();
        const chosenCourse = $("#sell").val();
        const allCourses = SDK.Storage.load("Courses")
        const questionCount = 0;

        //Verify that quiz title isn't empty
        if (quizTitle) {
            //For-loop to find chosen course
            for (var i = 0; i < allCourses.length; i++) {
                if (chosenCourse === allCourses[i].courseTitle) {
                    var courseId = allCourses[i].courseId;
                    SDK.Storage.persist("chosenCourse", allCourses[i])
                }
            }
            //SDK request to create quiz
            SDK.createQuiz(createdBy, questionCount, quizTitle, quizDescription, courseId, (err, newQuiz) => {
                if (err && err.xhr.status == 400) {
                    $(".form-group").addClass("Client fail");
                }
                else if (err) {
                    console.log("Error")
                } else {
                    //Reset input fields
                    $("#quizTitle").val('');
                    $("#quizDescription").val('');
                    $("#sell").val($("#sell option:first").val());

                    //Show question modal
                    $('#questionModal').modal('show');

                    //Set modal title as question number
                    var i = 1;
                    $(".modal-title").html(`<h1>Question ${i}</h1>`);

                    //Listener on add question button
                    var questionCounter = 0;
                    $("#addQuestionButton").click(() => {
                        /*
                        For every time the button has been clicked
                        the counter is counted up. This is used
                        to find out how mange question has been
                        added to the specific quiz.
                         */
                        questionCounter++;
                        //Save information as constants
                        const createdQuestion = $("#question").val();
                        const questionToQuizId = newQuiz.quizId;

                        //SDK request to create question
                        SDK.createQuestion(createdQuestion, questionToQuizId, (err, newQuestion) => {
                            if (err && err.xhr.status == 400) {
                                $(".form-group").addClass("Client fail");
                            }
                            else if (err) {
                                console.log("Error")
                            } else {
                                //Reset input fields
                                $("#question").val("");

                                //Set modal title
                                $(".modal-title").html(`<h1>Question ${++i}</h1>`);
                                $(".question-added").html(`<h4 id="text">Question added</h4>`);

                                //Save information to use for option
                                const optionToQuestionId = newQuestion.questionId;
                                const correct = $("#correct").val();
                                const wrong1 = $("#wrong1").val();
                                const wrong2 = $("#wrong2").val();
                                const wrong3 = $("#wrong3").val();

                                /*
                                SDK request to create options. The first request
                                is for the correct answer. The last three are for
                                the wrong options. The code is basically the
                                same but with different values. All the fields
                                are reset after the button is clicked.
                                 */
                                var isCorrect = 1;
                                SDK.createOption(correct, optionToQuestionId, isCorrect, (err, data) => {
                                    if (err && err.xhr.status == 400) {
                                        $(".form-group").addClass("Client fail");
                                    }
                                    else if (err) {
                                        console.log("Error")
                                    } else {
                                        //Reset input fields
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
                //Listener on save changes button
                $("#saveChangesButton").click(() => {
                    /*
                    SDK request to update question
                    count based on how many times the add
                    question button has been clicked.
                     */
                    SDK.updateQuestionCount(questionCounter, newQuiz.quizId, (err, data) => {
                        window.location.href = "quizview.html";
                    });

                });
            });
        }
    });
    //Listener on log out button
    $("#logout-link").click(() => {
        SDK.logOut(userId, (err, data) => {
            if (err && err.xhr.status == 401) {
                $(".form-group").addClass("has-error");
            } else {
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
