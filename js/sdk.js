const SDK = {
    serverURL: "http://localhost:8080/api",
    request: (options, callback) => {

        let headers = {};
        if (options.headers) {
            Object.keys(options.headers).forEach((h) => {
                headers[h] = (typeof options.headers[h] === 'object') ? JSON.stringify(options.headers[h]) : options.headers[h];
            });
        }

        $.ajax({
            url: SDK.serverURL + options.url,
            method: options.method,
            headers: headers,
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(options.data),
            success: (data, status, xhr) => {
                callback(null, data, status, xhr);
            },
            error: (xhr, status, errorThrown) => {
                callback({xhr: xhr, status: status, error: errorThrown});
            }
        });
    },

    login: (username, password, callback) => {
        SDK.request({
            data: {
                username: username,
                password: password
            },
            url: "/user/login",
            method: "POST"
        }, (err, token) => {

            if (err) return callback(err);
            SDK.Storage.persist("Token", token);

            callback(null, token);
        });
    },


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

    loadCurrentUser: (cb) => {
        SDK.request({
            method: "GET",
            url: "/user/myuser",
            headers: {authorization: SDK.Storage.load("Token")}
        }, (err, user) => {
            if(err) return cb(err);
            SDK.Storage.persist("User", user.currentUser);

            cb(null, user.currentUser)
        });
    },

    currentUser: () => {
        return SDK.Storage.load("User");
    },

    Storage: {
        prefix: "DøkQuizSDK",
        persist: (key, value) => {
            window.localStorage.setItem(SDK.Storage.prefix + key, (typeof value === 'object') ? JSON.stringify(value) : value)
        },
        load: (key) => {
            const val = window.localStorage.getItem(SDK.Storage.prefix + key);
            try {
                return JSON.parse(val);
            }
            catch (e) {
                return val;
            }
        },
    }
};
