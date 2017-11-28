$(document).ready(() => {
    //Load current user object with id
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

    $(".page-header").html(`<h1 align="center">Correct answers</h1>`);

    const $optionTableBodyCorrect = $("#optionTableBodyCorrect");
    var i = 0;
    SDK.loadQuestions((err, loadedQuestions) => {
        while (i < loadedQuestions.length) {
            var question = loadedQuestions[i].question;
            loadOptions(question);

            function loadOptions(question) {
                SDK.loadOptions(loadedQuestions[i].questionId, (err, options) => {
                    $optionTableBodyCorrect.append(`<br><br><div class="title-container"><h3 class="modal-title">${question}</h3></div>`);

                    for (var z = 0; z < options.length; z++) {
                        if (options[z].isCorrect === 0) {
                            $optionTableBodyCorrect.append(`<br><td> <button class="btn btn-primary" type="button" id="' + loadedOptions[key].optionId + '">${options[z].option}</button></td>`);
                        } else {
                            $optionTableBodyCorrect.append(`<br><td> <button class="btn btn-success" type="button" id="' + loadedOptions[key].optionId + '">${options[z].option}</button></td>`);
                        }
                    }
                });
                i++;
            }
        }
    });

});



