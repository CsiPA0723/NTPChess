const names = ["rook", "knight", "queen", "king", "knight", "rook"];
var figures = new Map();
var turn = "white";

function onLoad() {
    tableCreate();
}

function tableCreate() {
    let whOrBl = false;
    var body = document.getElementById("chessTable");
    var tbl = document.createElement('table');
    tbl.id = "table";
    var tbdy = document.createElement('tbody');
    for (let i = 0; i < 10; i++) {
        var tr = document.createElement('tr');
        for (let j = 0; j < 6; j++) {
            var td = document.createElement('td');
            td.style.backgroundColor = `${whOrBl ? "rgb(255, 242, 230)": "rgb(255, 206, 171)"}`;
            td.id = `td(${j}_${i})`;
            td.style.backgroundSize = "100%";
            td.style.backgroundRepeat = "no-repeat";
            td.onclick = function() {onClick(this.id)};
            if(i == 0 || i == 9) {
                if(i == 0){
                    td.style.backgroundImage = `url("./BlackCMs/black_${names[j]}.png")`;
                } else {
                    td.style.backgroundImage = `url("./WhiteCMs/white_${names[j]}.png")`;
                }
                figures.set(td.id, createFigureObj(td.id, names[j], i == 0 ? "black" : "white", j, i, 2, td.style.backgroundImage));
            } else if (i == 1 || i == 8) {
                if(i == 1) {
                    td.style.backgroundImage = `url("./BlackCMs/black_pawn.png")`;
                } else {
                    td.style.backgroundImage = `url("./WhiteCMs/white_pawn.png")`;
                }
                figures.set(td.id, createFigureObj(td.id, "pawn", i == 1 ? "black" : "white", j, i, 2, td.style.backgroundImage));
            }
            tr.appendChild(td);
            whOrBl = !whOrBl;
        }
        whOrBl = !whOrBl;
        tbdy.appendChild(tr);
    }
    tbl.appendChild(tbdy);
    body.appendChild(tbl);
}

async function onClick(id) {
    alert("onClick");
    check(id);
    var figure = figures.get(id);
    var selectedfigure = findIn(figures, "selected", true);
    if(selectedfigure) {
        check(selectedfigure.id);
        await unselection(selectedfigure.id);
    }

    if((figure || !selectedfigure) && turn == figure.race) selection(id);
    else if(selectedfigure && (!figure || figure.race != selectedfigure.race)) {
        move(selectedfigure.id, id);
    }
}

function selection(id) {
    alert("selection");
    var figure = figures.get(id);
    figure.selected = true;
    var table = document.getElementById("table");
    if(figure.name == "pawn") {
        if(figure.pos.y == 1 || figure.pos.y == 8) {
            if(figure.pos.y == 1 && figure.race == "black") {
                for(var i = figure.pos.y; i < figure.pos.y + 3; i++) {
                    var cell = table.rows[i].cells[figure.pos.x];
                    cell.style.backgroundColor = "lightblue";
                }
            } else if(figure.pos.y == 8 && figure.race == "white") {
                for(var i = figure.pos.y; i > figure.pos.y - 3; i--) {
                    var cell = table.rows[i].cells[figure.pos.x];
                    cell.style.backgroundColor = "lightblue";
                }
            }
        } else {
            if(figure.race == "black") {
                for(var i = figure.pos.y - 1; i < figure.pos.y + 2; i++) {
                    var cell = table.rows[i].cells[figure.pos.x];
                    cell.style.backgroundColor = "lightblue";
                }
            } else if(figure.race == "white") {
                for(var i = figure.pos.y + 1; i > figure.pos.y - 2; i--) {
                    var cell = table.rows[i].cells[figure.pos.x];
                    cell.style.backgroundColor = "lightblue";
                }
            }
        }
    }
}

function unselection(id) {
    alert("unselection");
    var figure = figures.get(id);
    figure.selected = false;
    let whOrBl = false;
    var table = document.getElementById("table");
    for (let i = 0; i < 10; i++) {
        var row = table.rows[i];
        for (let j = 0; j < 6; j++) {
            var cell = row.cells[j];
            cell.style.backgroundColor = `${whOrBl ? "rgb(255, 242, 230)": "rgb(255, 206, 171)"}`;
            whOrBl = !whOrBl;
        }
        whOrBl = !whOrBl;
    }
}

function move(frId, toId) {
    alert("move");
    var frFigure = figures.get(frId);
    var pos = toId.slice(3, toId.length - 1).split("_");

    var toFigure = createFigureObj(toId, frFigure.name, frFigure.race, pos[0], pos[1], frFigure.point, frFigure.picture);
    figures.delete(frId);
    figures.set(toId, toFigure);
    document.getElementById(frId).style.backgroundImage = "";
    document.getElementById(toId).style.backgroundImage = toFigure.picture;
    check(toId);
    if(figure.race == "white") {
        turn = "black";
    } else {
        turn = "white";
    }
}

function createFigureObj(id, name, race, x, y, point, picture) {
    var figure = {
        id: id,
        name: name,
        race: race,
        pos: {
            x: x,
            y: y
        },
        point: point,
        picture: picture,
        selected: false,
        killable: false,
        movable: false
    };
    return figure;
}

function findIn(map, find, value) {
    let key;
    let firstFound = false;
    map.forEach((v, k) => {
        if(v[`${find}`] == value && !firstFound) {
            key = k;
            firstFound = true;
        }
    })
    if(key) return map.get(key);
    return false;
}

function check(id) {
    if(figures.get(id)) {
        alert(
            `id: ${id}
            name: ${figures.get(id).name}
            race: ${figures.get(id).race}
            pos: {
                x: ${figures.get(id).pos.x}
                y: ${figures.get(id).pos.y}
            }
            point: ${figures.get(id).point}
            picture: ${figures.get(id).picture}`
        );
    } else {
        alert("Empty field, id: " + id);
    }
}