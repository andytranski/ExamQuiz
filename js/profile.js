$(document).ready(() => {

    const currentUser = SDK.current();

    $(".page-header").html(`<h1>Hi, ${currentUser}</h1>`);

    window.alert(currentUser)

    SDK.current((err) => {

    })


});