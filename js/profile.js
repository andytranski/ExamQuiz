$(document).ready(() => {

    SDK.loadMenu();

    const currentUser = SDK.currentUser();

    $(".username-display").html(`<a>${currentUser.username}</a>`);

    $(".page-header").html(`<h1>Hi, ${currentUser.username}</h1>`);

});


