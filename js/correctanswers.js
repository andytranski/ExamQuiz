$(document).ready(() => {
    //Load current user object with id
    const currentUser = SDK.currentUser();
    const userId = currentUser.userId;


    //Display logout  and profile button on menu
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

    //Set the page header
    $(".page-header").html(`<h1 align="center">Correct answers</h1>`);

    //Initialize the table
    const $optionTableBodyCorrect = $("#optionTableBodyCorrect");
    var i = 0;

    //SDK request to load questions
    SDK.loadQuestions((err, loadedQuestions) => {
        //Loop while counter is less than the length of question array
        while (i < loadedQuestions.length) {
            //Save the question on index i
            var question = loadedQuestions[i].question;

            //Load options function with question parameter
            loadOptions(question);

            function loadOptions(question) {
                //Load options on the specific question id
                SDK.loadOptions(loadedQuestions[i].questionId, (err, options) => {
                    //Append question on modal title
                    $optionTableBodyCorrect.append(`<br><br><div class="title-container"><h3 class="modal-title">${question}</h3></div>`);

                    //For-loop to find options related to question
                    for (var z = 0; z < options.length; z++) {
                        //Differentiate between correct or not
                        if (options[z].isCorrect === 0) {
                            //Append button to the table
                            $optionTableBodyCorrect.append(`<br><td> <button class="btn btn-primary" type="button" id="' + loadedOptions[key].optionId + '">${options[z].option}</button></td>`);
                        } else {
                            $optionTableBodyCorrect.append(`<br><td> <button class="btn btn-success" type="button" id="' + loadedOptions[key].optionId + '">${options[z].option}</button></td>`);
                        }
                    }
                });
                //Counter
                i++;
            }
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



