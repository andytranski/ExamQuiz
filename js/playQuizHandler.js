$(document).ready(() => {
        //Load quiz object and initialize table
        const chosenQuiz = SDK.Storage.load("chosenQuiz");
        var $optionTableBody = $("#optionTableBody");

        //Display the quiz information
        $(".page-header").html(`<h1 align="center">${chosenQuiz.quizTitle}</h1>`);
        $(".description").html(`<h2 align="center">${chosenQuiz.quizDescription}</h2>`);

        //Listener on play button
        $("#playQuizButton").click(() => {
            window.location.href = "playquiz.html";
        });

        loadQuestions();


        //Function to load questions on first load
        function loadQuestions() {
            //SDK request to load questions
            SDK.loadQuestions((err, loadedQuestions) => {
                //Verify that array isn't empty
                if (loadedQuestions === undefined) {
                    $("#playQuizButton").html('Return').click(() => {
                        window.location.href = "quizview.html"
                    });
                    $(".page-header").html(`<h1 align="center">Empty quiz</h1>`);
                    $(".description").html(`<h2 align="center">Oh no! No questions were found</h2>`);
                } else {
                    //Save the question titles as array
                    let questionTitle = [];
                    for (var i = 0; i < loadedQuestions.length; i++) {
                        questionTitle.push(loadedQuestions[i].question);
                    }
                    //Method for shuffling the array in random order
                    const titles = shuffle(questionTitle);

                    //Call function with loaded questions and question titles as parameters
                    updateQuestions(loadedQuestions, titles)
                }
            });

        }

        var correct = 0;
        var titleCounter = 0;

        function updateQuestions(loadedQuestions, titles) {
            //Load question title on index "titleCounter"
            var currentQuestion = titles[titleCounter]

            //When no more questions are found in array system will return "undefined"
            if (currentQuestion === undefined) {
                //Calculate points as percent
                var percent = Math.floor((correct / loadedQuestions.length) * 100);

                //Set the modal with current scores
                $('#scoreModal').removeData("modal").modal({backdrop: 'static', keyboard: false})
                $(".modal-title").html(`<h1 align="center">Your score</h1>`);
                $(".modal-body").html(`<h3 align="center">Well done!</h3><h2 align="center">The quiz had ${loadedQuestions.length} questions</h2>
                <h2 align="center">You had ${correct} correct answers</h2>
                <h2 align="center">Answer rate: ${percent}%</h2>`);
                $('#scoreModal').modal('show');

                //Listener on quiz view button
                $("#quizViewButton").click(() => {
                    window.location.href = "quizview.html";
                });

                //Listener on play again button
                $("#playAgainButton").click(() => {
                    window.location.href = "startquiz.html";
                });

                //Listener on button to see correct answers
                $("#correctViewButton").click(() => {
                    window.location.href = "correctview.html";
                });

                //If more questions are found in array
            } else {
                //Set the new questions as title
                $(".modal-title").html(`<h2>${currentQuestion}</h2>`);

                //For-loop to get the id of the current question
                for (var k = 0; k < loadedQuestions.length; k++) {
                    if (currentQuestion === loadedQuestions[k].question) {
                        var questionId = loadedQuestions[k].questionId;
                    }
                }
                //SDK request to load options with question id as parameter
                SDK.loadOptions(questionId, (err, loadedOptions) => {

                    //Shuffle the displayed options
                    let shuffledOptions = loadedOptions = shuffle(loadedOptions);

                    //For-each loaded options add new table row with option as button
                    $.each(shuffledOptions, function (key, val) {
                        if(loadedOptions[key].option) {
                            var tr = '<tr>';
                            tr += '<td> <button class="btn btn-primary" type="button" id="' + loadedOptions[key].optionId + '"> ' + loadedOptions[key].option + '</button></td>';
                            tr += '</tr>';
                            //Append rows to the table
                            $optionTableBody.append(tr);
                            clickListener(loadedOptions, loadedQuestions, titles)
                        }
                    });
                });
            }
        }

        //Listener on chosen option
        function clickListener(loadedOptions, loadedQuestions, titles) {
            //Unbind buttons to make it impossible to change answer
            $(".btn-primary").unbind().click(function () {
                //Save the id on the button
                var clickedBtn = $(this)
                var btnId = this.id;

                //For-loop to get find the specific option
                for (var z = 0; z < loadedOptions.length; z++) {
                    if (loadedOptions[z].optionId === parseInt(btnId)) {
                        //Decide whether or not the answer is correct
                        var isCorrect = loadedOptions[z].isCorrect;

                        //Wrong answer
                        if (isCorrect === 0) {
                            $(".btn-primary").unbind();
                            clickedBtn.toggleClass('btn-primary btn-danger');

                            //Correct answer
                        } else if (isCorrect === 1) {
                            $(".btn-primary").unbind();
                            clickedBtn.toggleClass('btn-primary btn-success');
                            correct++;
                        }

                        //Listener on next button
                        $("#nextButton").unbind().click(() => {
                            //Empty the table and update question
                            $optionTableBody.empty();
                            titleCounter++;
                            updateQuestions(loadedQuestions, titles);
                        });
                    }

                }
            });
            //Listener on dismiss button
            $("#dismissButton").click(() => {
                window.location.href = "quizview.html";
            });
        };

        //Function to shuffle array in random order
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



