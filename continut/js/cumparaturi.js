function adaugaTranzactie(where) {
    class TranzactieBase {
        constructor(numeCompanie, numarActiuni) {
        this.numeCompanie = numeCompanie;
        this.numarActiuni = numarActiuni;
        }
    }

    var numeCompanie = document.getElementById("numeCompanie").value
    var numarActiuni = document.getElementById("numarActiuni").value

    document.getElementById("numeCompanie").value = ""
    document.getElementById("numarActiuni").value = ""

    if(where == "localStorage")
    {
        class TranzactieLocal extends TranzactieBase {
            constructor(id, numeCompanie, numarActiuni) {
              super(numeCompanie, numarActiuni);
              this.id = id;
            }
        }

        let listaTranzactii = JSON.parse(localStorage.getItem('listaTranzactii'))

        if(listaTranzactii === null){
            listaTranzactii = [];
        }

        let id = listaTranzactii.length

        let tranzactie = new TranzactieLocal(id, numeCompanie, numarActiuni);

        listaTranzactii.push(tranzactie);
        localStorage.setItem('listaTranzactii', JSON.stringify(listaTranzactii));

        console.log("Am adaugat: " + tranzactie.id +" "+ tranzactie.numeCompanie+" "+tranzactie.numarActiuni);
        console.log(localStorage.getItem('listaTranzactii'));
    }

    if(where == "indexedDB")
    {   
        class TranzactieDB extends TranzactieBase {
            constructor(id, numeCompanie, numarActiuni) {
              super(numeCompanie, numarActiuni);
              this.id = id;
            }
        }

        var db;
        var request = window.indexedDB.open("tranzactiiDB", 1);
        var max_id=0;
         
        request.onerror = function(event) {
            console.log("error: ");
        };
         
         request.onsuccess = function(event) {
            db = event.target.result;
            console.log("success: "+ db);

            var objectStore = db.transaction("tranzactie").objectStore("tranzactie");

            objectStore.openCursor().onsuccess = function(event) {
               var cursor = event.target.result;
               if (cursor) {
                  max_id = cursor.key
                  cursor.continue();
               }
               else {

                let tranzactie = new TranzactieDB(max_id+1, numeCompanie, numarActiuni);
                var request = db.transaction(["tranzactie"], "readwrite")
                .objectStore("tranzactie")
                .add({ id: tranzactie.id, numeCompanie: tranzactie.numeCompanie, numarActiuni: tranzactie.numarActiuni });
                
                request.onsuccess = function(event) {
                    console.log("succes");
                };
                
                request.onerror = function(event) {
                    console.log("eroare");
                }
              }
            };
         };
         
         request.onupgradeneeded = function(event) {
            var db = event.target.result;
            var objectStore = db.createObjectStore("tranzactie", {keyPath: "id"});
        }
    }


    //worker
    var myWorker = new Worker('js/worker.js');

    console.log('Main script: Trimit mesajul la worker: ');
    myWorker.postMessage("add");

    myWorker.onmessage = function(e) {
        let result = e.data;
        console.log('Main script: Am primit mesajul de la worker: ' + result);

        if(result=="add-row")
        {
            loadTables();
        }
    }
}

function loadTables(){
    loadTableLocalStorage();
    loadTableIndexedDB();
}

function loadTableLocalStorage()
{
    let listaTranzactii = JSON.parse(localStorage.getItem('listaTranzactii'))

    if(listaTranzactii === null){
        listaTranzactii = [];
    }

    var table_content="<tr><th>ID</th><th>Nume Companie</th><th>Numar Actiuni</th></tr>";
    for (i = 0; i < listaTranzactii.length; i++) {
        table_content +="<tr><td>" + listaTranzactii[i].id + "</td><td>" + 
                        listaTranzactii[i].numeCompanie + "</td><td>" + 
                        listaTranzactii[i].numarActiuni + "</td></tr>"
    }
    document.getElementById("tabel_cumparaturi_localstorage").innerHTML = table_content;
}

function loadTableIndexedDB()
{
    var db;
    var request = window.indexedDB.open("tranzactiiDB", 1);
         
    request.onerror = function(event) {
        console.log("error: ");
    };
        
    request.onsuccess = function(event) {
    db = event.target.result;
    console.log("success: "+ db);

    var table_content="<tr><th>ID</th><th>Nume Companie</th><th>Numar Actiuni</th></tr>";
    var objectStore = db.transaction("tranzactie").objectStore("tranzactie");
    objectStore.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {
            table_content +="<tr><td>" + cursor.value.id + "</td><td>" + 
                            cursor.value.numeCompanie + "</td><td>" + 
                            cursor.value.numarActiuni + "</td></tr>"
            cursor.continue();
        }
        else {
            document.getElementById("tabel_cumparaturi_indexeddb").innerHTML = table_content;
        }
    };
    };
}