const SDK = {
    //URL for the server
    serverURL: "http://localhost:8080/api",

    //SDK request
    request: (options, callback) => {
        let headers = {};
        if (options.headers) {
            Object.keys(options.headers).forEach((h) => {
                headers[h] = (typeof options.headers[h] === 'object') ? JSON.stringify(options.headers[h]) : options.headers[h];
            });
        }

        //Asynchronous call to server
        $.ajax({
            url: SDK.serverURL + options.url,
            method: options.method,
            headers: headers,
            contentType: "application/json",
            dataType: "json",
            //Encrypt the data sent to server
            data: JSON.stringify(SDK.encrypt(JSON.stringify(options.data))),
            success: (data, status, xhr) => {
                //Decrypt the data received from server
                callback(null, JSON.parse(SDK.decrypt(data)), status, xhr);
            },
            error: (xhr, status, errorThrown) => {
                callback({xhr: xhr, status: status, error: errorThrown});
            }
        });
    },

    //Login request
    login: (username, password, callback) => {
        SDK.request({
            data: {
                username: username,
                password: password
            },
            url: "/user/login",
            method: "POST"
        }, (err, data) => {

            if (err) return callback(err);

            //Persist the token used for headers
            SDK.Storage.persist("Token", data);

            callback(null, data);
        });
    },

    //Signup request
    signup: (newUsername, newPassword, callback) => {
        SDK.request({
            data: {
                username: newUsername,
                password: newPassword
            },
            url: "/user/signup",
            method: "POST"
        }, (err, data) => {
            if (err) return callback(err);

            callback(null, data);
        });
    },

    //Load current user request
    loadCurrentUser: (callback) => {
        SDK.request({
            method: "GET",
            url: "/user/myuser",
            //Use header for authorization
            headers: {
                authorization: SDK.Storage.load("Token"),
            },
        }, (err, user) => {
            if (err) return callback(err);
            //Persist the user returned
            SDK.Storage.persist("User", user);
            callback(null, user);
        });
    },

    //Method for returning current user
    currentUser: () => {
        const loadedUser = SDK.Storage.load("User");
        return loadedUser.currentUser;
    },

    //Request for log out
    logOut: (userId, callback) => {
        SDK.request({
            method: "POST",
            url: "/user/logout",
            data: userId,
        }, (err, data) => {
            if (err) return callback(err);

            callback(null, data);
        });

    },

    //Request for loading courses
    loadCourses: (callback) => {
        SDK.request({
            method: "GET",
            url: "/course",
            headers: {
                authorization: SDK.Storage.load("Token"),
            },
        }, (err, course) => {
            if (err) return callback(err);
            callback(null, course)

        });
    },

    //Request for creating quiz
    createQuiz: (createdBy, questionCount, quizTitle, quizDescription, courseId, callback) => {
        SDK.request({
            data: {
                createdBy: createdBy,
                questionCount: questionCount,
                quizTitle: quizTitle,
                quizDescription: quizDescription,
                courseId: courseId
            },
            url: "/quiz",
            method: "POST",
            headers: {
                authorization: SDK.Storage.load("Token"),
            }
        }, (err, data) => {
            if (err) return callback(err);

            callback(null, data);
        })
    },

    //Request for updating question count
    updateQuestionCount: (questionCounter, quizId, callback) => {
        SDK.request({
            data: questionCounter,
            url: "/quiz/" + quizId,
            method: "POST",
            headers: {
                authorization: SDK.Storage.load("Token"),
            }
        }, (err, data) => {
            if (err) return callback(err);

            callback(null, data);
        })
    },

    //Request for loading quizzes
    loadQuizzes: (callback) => {
        //Load the course id from local storage
        const chosenCourse = SDK.Storage.load("chosenCourse");
        const courseId = chosenCourse.courseId;
        SDK.request({
            method: "GET",
            url: "/quiz/" + courseId,
            headers: {
                authorization: SDK.Storage.load("Token")
            },
        }, (err, quiz) => {
            if (err) return callback(err);
            callback(null, quiz)
        });
    },

    //Request for deleting quiz
    deleteQuiz: (callback) => {
        //Load the quiz id
        const chosenQuiz = SDK.Storage.load("chosenQuiz")
        const quizId = chosenQuiz.quizId;
        SDK.request({
            method: "DELETE",
            url: "/quiz/" + quizId,
            headers: {
                authorization: SDK.Storage.load("Token")
            },
        }, (err, data) => {
            if (err) return callback(err);
            console.log(data);
            callback(null, data)
        });

    },

    //Request for loading questions
    loadQuestions: (callback) => {
        //Load quizId
        const chosenQuiz = SDK.Storage.load("chosenQuiz");
        const quizId = chosenQuiz.quizId;
        SDK.request({
            method: "GET",
            url: "/question/" + quizId,
            headers: {
                authorization: SDK.Storage.load("Token")
            },
        }, (err, question) => {
            if (err) return callback(err);
            callback(null, question)
        });
    },

    //Request for creating question
    createQuestion: (question, questionToQuizId, callback) => {
        SDK.request({
            data: {
                question: question,
                questionToQuizId: questionToQuizId
            },
            url: "/question",
            method: "POST",
            headers: {
                authorization: SDK.Storage.load("Token"),
            }
        }, (err, data) => {
            if (err) return callback(err);

            callback(null, data);
        })
    },

    //Request for creating option
    createOption: (option, optionToQuestionId, isCorrect, callback) => {
        SDK.request({
            data: {
                option: option,
                optionToQuestionId: optionToQuestionId,
                isCorrect: isCorrect
            },
            url: "/option",
            method: "POST",
            headers: {
                authorization: SDK.Storage.load("Token"),
            }
        }, (err, data) => {
            if (err) return callback(err);
            callback(null, data);
        })
    },

    //Request for creating option
    loadOptions: (questionId, callback) => {
        SDK.request({
            method: "GET",
            url: "/option/" + questionId,
            headers: {
                authorization: SDK.Storage.load("Token")
            },
        }, (err, options) => {
            if (err) return callback(err);
            callback(null, options)
        });
    },


    //Local storage function
    Storage:
        {
            prefix: "DøkQuizSDK",
            //Method for saving to local storage
            persist:
                (key, value) => {
                    window.localStorage.setItem(SDK.Storage.prefix + key, (typeof value === 'object') ? JSON.stringify(value) : value)
                },
            //Method for loading in local storage
            load:
                (key) => {
                    const val = window.localStorage.getItem(SDK.Storage.prefix + key);
                    try {
                        return JSON.parse(val);
                    }
                    catch (e) {
                        return val;
                    }
                },
            //Method for removing element in local storage
            remove:
                (key) => {
                    window.localStorage.removeItem(SDK.Storage.prefix + key);
                }

        }
    ,

    //Method for encrypting data to the server
    encrypt: (encrypt) => {
        if (encrypt !== undefined && encrypt.length !== 0) {
            //Encrypt key
            const key = ['L', 'Y', 'N'];
            let isEncrypted = "";
            for (let i = 0; i < encrypt.length; i++) {
                isEncrypted += (String.fromCharCode((encrypt.charAt(i)).charCodeAt(0) ^ (key[i % key.length]).charCodeAt(0)))
            }
            return isEncrypted;
        } else {
            return encrypt;
        }
    },

    //Method for decrypting data from the server
    decrypt:
        (decrypt) => {
            if (decrypt !== undefined && decrypt.length !== 0) {
                //Decrypt key
                const key = ['L', 'Y', 'N'];
                let isDecrypted = "";
                for (let i = 0; i < decrypt.length; i++) {
                    isDecrypted += (String.fromCharCode((decrypt.charAt(i)).charCodeAt(0) ^ (key[i % key.length]).charCodeAt(0)))
                }
                return isDecrypted;
            } else {
                return decrypt;
            }
        },
};
