$(document).ready(() => {
    const chosenQuiz = SDK.Storage.load("chosenQuiz");

    $(".page-header").html(`<h1 align="center">${chosenQuiz.quizTitle}</h1>`);

    $(".description").html(`<h2 align="center">${chosenQuiz.quizDescription}</h2>`);



});