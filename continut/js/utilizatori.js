function verifica() {
    let req = new XMLHttpRequest();

    req.onreadystatechange =
        function () {
            let json_file;
            let flag = false;
            if (req.readyState === 4 && req.status === 200) {
                json_file = JSON.parse(req.responseText);
                json_file.forEach(json => {
                    if (json.utilizator === document.getElementById('nume').value && json.parola === document.getElementById('parola').value) {
                        flag = true;
                    }
                })

                if (flag === true) {
                    document.getElementById('verifica').style.color = "green";
                    document.getElementById('verifica').innerHTML = "Nume si parola corecte."
                } else {
                    document.getElementById('verifica').style.color = "red";
                    document.getElementById('verifica').innerHTML = "Nume si parola incorecte."
                }
            }
        }

    req.open('GET', 'resurse/utilizatori.json', true);
    req.send();
}