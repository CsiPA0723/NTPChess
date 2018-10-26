function onLoad() {
    tableCreate();
}

function tableCreate() {
    let whOrBl = false;
    let index = 0;
    var body = document.getElementById("chessTable");
    var tbl = document.createElement('table');
    var tbdy = document.createElement('tbody');
    for (let i = 0; i < 10; i++) {
        var tr = document.createElement('tr');
        for (let j = 0; j < 6; j++) {
            var td = document.createElement('td');
            td.style.backgroundColor = `${whOrBl ? "rgb(255, 242, 230)": "rgb(255, 206, 171)"}`;
            td.id = `td${index}`;
            td.style.backgroundImage = `url("./BlackCMs/black_king.png")`;
            tr.appendChild(td);
            index++;
            whOrBl = !whOrBl;
        }
        whOrBl = !whOrBl;
        tbdy.appendChild(tr);
    }
    tbl.appendChild(tbdy);
    body.appendChild(tbl);
}

function onClick(obj) {

}

function swap(frObj, toObj) {

}