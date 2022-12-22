function loadCompanies(){
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function() {

        var i;
        var xmlDoc = this.responseXML;
        var table="<table class=\"tabel\"><tr><th>Nume</th><th>Abreviere</th><th>Cotatie</th><th>Infiintare</th><th>Sediu</th><th>Venit</th><th>Nr. Angajati</th></tr>";
        var companii = xmlDoc.getElementsByTagName("companie");
        for (i = 0; i <companii.length; i++) {
            table += "<tr><td>" +
            companii[i].getElementsByTagName("nume")[0].childNodes[0].nodeValue +
            "</td><td>" +
            companii[i].getElementsByTagName("abreviere")[0].childNodes[0].nodeValue +
            "</td><td>" +
            companii[i].getElementsByTagName("cotatie")[0].childNodes[0].nodeValue +
            "</td><td>" +
            companii[i].getElementsByTagName("informatii")[0].getElementsByTagName("infiintare")[0].childNodes[0].nodeValue +
            "</td><td>" +
            companii[i].getElementsByTagName("informatii")[0].getElementsByTagName("sediu")[0].childNodes[0].nodeValue +
            "</td><td>" +
            companii[i].getElementsByTagName("informatii")[0].getElementsByTagName("venit")[0].childNodes[0].nodeValue +
            "</td><td>" +
            companii[i].getElementsByTagName("informatii")[0].getElementsByTagName("angajati")[0].childNodes[0].nodeValue +
            "</td></tr>";
        }
        table += "</table>"
        document.getElementById("continut").innerHTML = "<h2>Companii principale</h2>" + table;
      }
    xhttp.open("GET", "resurse/companii.xml", true);
    xhttp.send();
}