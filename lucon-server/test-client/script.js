window.onload = function () {
    const messages = document.querySelector('#messages');
    const wsButton = document.querySelector('#wsButton');
    const wsSendButton = document.querySelector('#wsSendButton');
    const logout = document.querySelector('#logout');
    const login = document.querySelector('#login');
    const register = document.querySelector('#register');

    console.log(login);

    function showMessage(message) {
        messages.textContent += `\n${message}`;
        messages.scrollTop = messages.scrollHeight;
    }

    function handleResponse(response) {
        return response.ok
            ? response.json().then((data) => JSON.stringify(data, null, 2))
            : Promise.reject(new Error('Unexpected response'));
    }

    register.onclick = function () {
        const payload = {
            uname: document.querySelector('#uname').value,
            pass: document.querySelector('#pass').value,
            confPass: document.querySelector('#confPass').value
        };
        fetch('/register', {
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            credentials: 'same-origin',
            body: JSON.stringify(payload)
        })
            .then(handleResponse)
            .then(showMessage)
            .catch(function (err) {
                showMessage(err.message);
            });
    };

    login.onclick = function () {
        fetch('/login', { method: 'POST', credentials: 'same-origin' })
            .then(handleResponse)
            .then(showMessage)
            .catch(function (err) {
                showMessage(err.message);
            });
    };

    logout.onclick = function () {
        fetch('/logout', { method: 'DELETE', credentials: 'same-origin' })
            .then(handleResponse)
            .then(showMessage)
            .catch(function (err) {
                showMessage(err.message);
            });
    };

    let ws;

    wsButton.onclick = function () {
        if (ws) {
            ws.onerror = ws.onopen = ws.onclose = null;
            ws.close();
        }

        ws = new WebSocket(`ws://${location.host}`);
        ws.onerror = function () {
            showMessage('WebSocket error');
        };
        ws.onopen = function () {
            showMessage('WebSocket connection established');
        };
        ws.onclose = function () {
            showMessage('WebSocket connection closed');
            ws = null;
        };
    };

    wsSendButton.onclick = function () {
        if (!ws) {
            showMessage('No WebSocket connection');
            return;
        }

        ws.send('Hello World!');
        showMessage('Sent "Hello World!"');
    };
};
