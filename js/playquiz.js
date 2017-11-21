$(document).ready(() => {
    var counter = 0;
    var array;
    var questionss;

    const chosenQuiz = SDK.Storage.load("chosenQuiz");
    $(".page-header").html(`<h1 align="center">${chosenQuiz.quizTitle}</h1>`);
    $(".description").html(`<h2 align="center">${chosenQuiz.quizDescription}</h2>`);

    $("#playQuizButton").click(() => {
        window.location.href = "playquiz.html";

    });

    $("#nextButton").click(() => {
        window.location.href = "playquiz.html";
    });


    let questionTitles;

    SDK.loadQuestions((err, question) => {
        //Laver question om til JSON
        const questions = JSON.parse(question);

        //Ny array kun med question titler
        questionTitles = [];
        for (var i = 0; i < questions.length; i++) {
            questionTitles.push(questions[i].question);
        }
        array = questionTitles.length;
        //Blander array
        shuffle(questionTitles);
        var chosenTitle = questionTitles[counter];

        //Anvender titlen som overskrift
        $(".modal-title").html(`<h2>${chosenTitle}</h2>`);

        //Henter id på valgte spørgsmål
        for (var i = 0; i < questions.length; i++) {
            if (chosenTitle === questions[i].question) {
                var questionId = questions[i].questionId;
            }
        }

        SDK.loadOptions(questionId, (err, options) => {
            //Henter spørgsmålets valgmuligheder
            var allOptions = JSON.parse(options);

            //Gemmer options ned i tabel
            var $optionTableBody = $("#optionTableBody");
            $.each(allOptions, function (key, val) {
                var tr = '<tr>';
                tr += '<td> <button class="btn btn-primary" type="button" id="' + allOptions[key].optionId + '"> ' + allOptions[key].option + '</button></td>';
                tr += '</tr>';
                $optionTableBody.append(tr);
            });

            //Listener til hvilken knap der bliver aktiveret
            $optionTableBody.delegate(".btn", "click", function () {
                var clickedBtn = $(this);
                var btnId = this.id;

                for (var i = 0; i < allOptions.length; i++) {
                    if (allOptions[i].optionId === parseInt(btnId)) {
                        var isCorrect = allOptions[i].isCorrect;
                        if (isCorrect === 0) {
                            clickedBtn.toggleClass('btn-primary btn-danger');
                            counter++;
                            $optionTableBody.empty();
                            chosenTitle = questionTitles[counter];
                            $(".modal-title").html(`<h2>${chosenTitle}</h2>`);
                        } else if (isCorrect === 1) {
                            clickedBtn.toggleClass('btn-primary btn-success');
                        }

                    }
                }

            });

        });

    });

    //Metode til at blande arrays
    function shuffle(a) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
    }
});