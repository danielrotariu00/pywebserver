onmessage = function(e) {
    console.log('Worker: Am primit mesajul: '+ e.data);
    console.log('Worker: Trimit raspunsul.');
    postMessage("add-row");
  }