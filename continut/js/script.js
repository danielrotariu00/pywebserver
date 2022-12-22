    var row_nr;

    function loadData() {
        setInterval(reloadDate, 1000);
        reloadDate();
        document.getElementById("URL").innerHTML = "<b>URL</b>: " + window.location;
        if (navigator.geolocation) {
            window.navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            document.getElementById("locatie").innerHTML = "Locatie indisponibila."
        }

        var os = "Not known";
        if (navigator.appVersion.indexOf("Win") != -1) 
          os = "Windows OS";
        if (navigator.appVersion.indexOf("Mac") != -1) 
          os = "MacOS";
        if (navigator.appVersion.indexOf("X11") != -1) 
          os = "UNIX OS";
        if (navigator.appVersion.indexOf("Linux") != -1) 
          os = "Linux OS";


        let userAgent = navigator.userAgent;
        let browserName;
         
        if(userAgent.match(/chrome|chromium|crios/i)){
            browserName = "Chrome";
          }else if(userAgent.match(/firefox|fxios/i)){
            browserName = "Firefox";
          }  else if(userAgent.match(/safari/i)){
            browserName = "Safari";
          }else if(userAgent.match(/opr\//i)){
            browserName = "Opera";
          } else if(userAgent.match(/edg/i)){
            browserName = "Edge";
          }else{
            browserName="No browser detection";
          }
        
        
        document.getElementById("user_agent").innerHTML = "<b>Browser si Sistem de Operare</b>:" + browserName+", "+os;

        canvasDrawer();
        row_nr = document.getElementById("section_3_table").rows.length + 1;
    
    }
    
    function showPosition(position) {
        document.getElementById("locatie").innerHTML = "<b>Locatie:</b><br>Latitudine: " + position.coords.latitude +
            "<br>Longitudine: " + position.coords.longitude;
    }
    
    function reloadDate() {
        let doc = document.getElementById("data");
        if ( doc != null)
            doc.innerHTML = "<b>Ora si data</b>: " + (new Date());
    }
    
    function canvasDrawer() {
        let clickPhase = 0;
        const canvas = document.getElementById("myCanvas");
        const context = canvas.getContext("2d");
        canvas.width = 800;
        canvas.height = 600;
        let x;
        let y;
        canvas.addEventListener("click", (e) => {
            let x2;
            let y2;
            if (clickPhase === 0) {
                x = e.offsetX;
                y = e.offsetY;
                ++clickPhase;
            } else {
                x2 = e.offsetX;
                y2 = e.offsetY;
    
                context.beginPath();
                context.strokeStyle = document.getElementById("border_color").value;
                context.fillStyle = document.getElementById("fill_color").value;
                context.strokeRect(x, y, x2 - x, y2 - y);
                context.fillRect(x, y, x2 - x, y2 - y);
                context.stroke();
                clickPhase = 0;
            }
        })
    }
    
    function addRow() {
        let color = document.getElementById("cell_color").value
        let index = document.getElementById("index").value
        let table = document.getElementById("section_3_table")
    
        const row = table.insertRow(index);
        for (let i = 0; i < row_nr; i++) {
            let cell = row.insertCell(0);
            cell.style.background = color;
        }
    }
    
    function addColumn() {
        let color = document.getElementById("cell_color").value
        let index = document.getElementById("index").value
        let table = document.getElementById("section_3_table")
    
        let cell;
        for (let i = 0; i < table.rows.length; ++i) {
            cell = table.rows[i].insertCell(index);
            cell.style.background = color;
        }
        row_nr += 1;
    }
    
    function schimbaContinut(numeResursa, jsFisier, jsFunctie) {
        let req = new XMLHttpRequest();
    
        req.onreadystatechange =
            function () {
                if (req.readyState === 4 && req.status === 200) {
                    document.getElementById("continut").innerHTML = req.responseText;
                    if (jsFisier) {
                        var elementScript = document.createElement('script');
                        elementScript.onload = function () {
                            if (jsFunctie) {
                                window[jsFunctie]();
                            }
                        };
                        elementScript.src = jsFisier;
                        document.head.appendChild(elementScript);
                    } else {
                        if (jsFunctie) {
                            window[jsFunctie]();
                        }
                    }
                }
            }
    
          req.open('GET', numeResursa + '.html', true);
          req.send();
    }