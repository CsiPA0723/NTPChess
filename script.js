function onLoad() {
    tableCreate();
}

function tableCreate() {
    let index = 0;
    var body = document.getElementById("chessTable");
    var tbl = document.createElement('table');
    var tbdy = document.createElement('tbody');
    for (let i = 0; i < 10; i++) {
        var tr = document.createElement('tr');
        for (let j = 0; j < 6; j++) {
            var td = document.createElement('td');
            td.appendChild(document.createTextNode(`${index + 1}`));
            td.id = `td${index}`;
            tr.appendChild(td);
            index++;
        }
        tbdy.appendChild(tr);
    }
    tbl.appendChild(tbdy);
    body.appendChild(tbl);
}