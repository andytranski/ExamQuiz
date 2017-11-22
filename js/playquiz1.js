$(document).ready(() => {
        var titleCounter = 0;
        //Gemmer valgte quiz i en konstant
        const chosenQuiz = SDK.Storage.load("chosenQuiz");
        var $optionTableBody = $("#optionTableBody");

        //Sætter titel og beskrivelse
        $(".page-header").html(`<h1 align="center">${chosenQuiz.quizTitle}</h1>`);
        $(".description").html(`<h2 align="center">${chosenQuiz.quizDescription}</h2>`);

        //Listener på play-knap
        $("#playQuizButton").click(() => {
            window.location.href = "playquiz.html";
        });

        loadQuestions();


        //Hente question og returnere id
        function loadQuestions() {
            SDK.loadQuestions((err, questions) => {
                if (questions === undefined) {
                    $("#playQuizButton").html('Return').click(() => {
                        window.location.href = "quizview.html"
                    });

                    $(".page-header").html(`<h1 align="center">Empty quiz</h1>`);
                    $(".description").html(`<h2 align="center">Oh no! No questions were found</h2>`);

                } else {
                    var loadedQuestions = JSON.parse(questions);
                    console.log(loadedQuestions)
                    //Nyt tomt array
                    questionTitle = [];

                    for (var i = 0; i < loadedQuestions.length; i++) {
                        questionTitle.push(loadedQuestions[i].question);
                    }
                    //Blander titlerne tilfældigt
                    const titles = shuffle(questionTitle);

                    updateQuestions(loadedQuestions, titles)
                }
            });

        }

        var correct = 0;

        function updateQuestions(loadedQuestions, titles) {
            //Tager titlecounter indeks på titel
            var currentQuestion = titles[titleCounter]

            //Når quizzen slutter
            if (currentQuestion === undefined) {
                var procent = Math.floor((correct / loadedQuestions.length) * 100);
                $('#scoreModal').removeData("modal").modal({backdrop: 'static', keyboard: false})
                $(".modal-title").html(`<h1 align="center">Your score</h1>`);
                $(".modal-body").html(`<h3 align="center">Well done!</h3><h2 align="center">The quiz had ${loadedQuestions.length} questions</h2>
                <h2 align="center">You had ${correct} correct answers</h2>
                <h2 align="center">Answer rate: ${procent}%</h2>`);
                $('#scoreModal').modal('show');
                $("#quizViewButton").click(() => {
                    window.location.href = "quizview.html";
                });
                $("#playAgainButton").click(() => {
                    window.location.href = "startquiz.html";
                });

                //Hvis der er flere spørgsmål
            } else {
                var length = loadedQuestions.length;
                //Anvender titlen som overskrift
                $(".modal-title").html(`<h2>${currentQuestion}</h2>`);

                //Henter id på valgte spørgsmål
                for (var k = 0; k < length; k++) {
                    if (currentQuestion === loadedQuestions[k].question) {
                        questionId = loadedQuestions[k].questionId;
                    }
                }
                SDK.loadOptions(questionId, (err, options) => {
                    var loadedOptions = JSON.parse(options);

                    $.each(loadedOptions, function (key, val) {
                        var tr = '<tr>';
                        tr += '<td> <button class="btn btn-primary" type="button" id="' + loadedOptions[key].optionId + '"> ' + loadedOptions[key].option + '</button></td>';
                        tr += '</tr>';
                        $optionTableBody.append(tr);
                        clickListener(loadedOptions, loadedQuestions, titles)
                    });
                });
            }
        }

        //Lytte til et click event
        function clickListener(loadedOptions, loadedQuestions, titles) {
            $(".btn-primary").unbind().click(function () {
                var clickedBtn = $(this)
                var btnId = this.id;
                for (var z = 0; z < loadedOptions.length; z++) {
                    if (loadedOptions[z].optionId === parseInt(btnId)) {
                        console.log(loadedOptions[z].optionId);
                        var isCorrect = loadedOptions[z].isCorrect;
                        if (isCorrect === 0) {
                            $(".btn-primary").unbind();
                            clickedBtn.toggleClass('btn-primary btn-danger');
                        } else if (isCorrect === 1) {
                            $(".btn-primary").unbind();
                            clickedBtn.toggleClass('btn-primary btn-success');
                            correct++;
                        }
                        $("#nextButton").unbind().click(() => {
                            $optionTableBody.empty();
                            titleCounter++;
                            updateQuestions(loadedQuestions, titles);
                        });
                    }

                }
            });
            $("#dismissButton").click(() => {
                    window.location.href = "quizview.html";
            });
        };

        //Bland array for at randomatisere
        function shuffle(array) {
            var currentIndex = array.length, temporaryValue, randomIndex;

            // While there remain elements to shuffle...
            while (0 !== currentIndex) {

                // Pick a remaining element...
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;

                // And swap it with the current element.
                temporaryValue = array[currentIndex];
                array[currentIndex] = array[randomIndex];
                array[randomIndex] = temporaryValue;
            }

            return array;
        }

    }
);



