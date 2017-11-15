$(document).ready(() => {

    SDK.loadCourses((err, course) => {
        if (err) throw err;

        var course = JSON.parse(course);

        var $courseTableBody = $("#courseTableBody");

        $.each(course, function (key, val) {
            var tr = '<tr>';
            tr += '<td>' + course[key].courseTitle + '</td>';
            tr += '<td><button class="courseButton" data-key="' + (key + 1) + '">Choose course</button></td>';
            tr += '</tr>';
            $courseTableBody.append(tr);
        });

        $('button.courseButton').on('click', function () {
            var name = $(this).closest("tr").find("td:eq(0)").text();
            window.location.href = "quizview.html";

            for (var i = 0; i < course.length; i++) {
                if (name === course[i].courseTitle) {
                    SDK.Storage.persist("chosenCourse", course[i])
                }
            }

        });


    });

    SDK.loadQuizzes((err, quiz) => {
        if(err) throw err;

        var quiz = JSON.parse(quiz);

        var $quizTableBody = $("#quizTableBody");

        $.each(quiz, function (key, val) {
            var tr = '<tr>';
            tr += '<td>' + quiz[key].createdBy + '</td>';
            tr += '<td>' + quiz[key].quizTitle + '</td>';
            tr += '<td>' + quiz[key].quizDescription + '</td>';
            tr += '<td>' + quiz[key].courseId + '</td>';
            tr += '<td>' + quiz[key].questionCount + '</td>';
            tr += '</tr>';
            $quizTableBody.append(tr);
        });
    })

});