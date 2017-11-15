$(document).ready(() => {

    SDK.loadCourses((err, course) => {
        if (err) throw err;

        var course = JSON.parse(course);

        var $courseTableBody = $("#courseTableBody");
        course.forEach((course, i) => {
            $courseTableBody.append(
                "<tr>" +
                "<td>" + course.courseTitle + "</td>" +
                "</tr>");
        });
    });
});