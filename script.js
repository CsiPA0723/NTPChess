const information = `A megjelenítésben legyenek megkülönböztetve a két játékos bábui (más színű szöveg). Még több pontért szövegek helyett képek jelöljék a bábukat.
A sakk játék szabályaihoz képest itt lesz egy pár eltérés:
A tábla nem 8x8 méretű, hanem 6 oszlopból és 10 sorból áll.
Nincs Huszár a játékban, egyébként kezdetben a felállás a hagyományos sakkal egyezik meg.
Nincsen sakk, sem matt, a Király is csak egy leüthető figura, mint a többi.
A Gyalog léphet visszafelé is, továbbra is csak egy mezőt, viszont ütni nem tud hátra, csak előre.
A Bástyának, Futónak, és Vezérnek a lépése maximum 4 mező távolságra korlátozott.
Az ellenfél alapvonalát elérő gyalog nem alakul át semmivé, hanem úgy marad.
Az a játékos nyer, aki először szedi le az ellenfele minden bábuját.
Egy figurára kattintva a játék jelezze ki, hogy a figura mely mezőkre léphet, figyelembe véve a lépés szabályait.
Minden figurához legyen pont érték rendelve: Gyalog 1, Futó 2, Király 2, Bástya 3, Vezér 5. Minden játékoshoz látszódjon egy pontszám, hogy az ellenfétől összesen mennyi pont értékben szedett le figurát.
Legyen egy körszámláló a játékban. A játék indításakor az oldal kérje be a körök számát. Ha ennyi kör alatt senki sem nyer, a játszma akkor is érjen véget, és az oldal hirdessen győztest a leütött figurák pontjai alapján.`;

const figureOrder = [
    {
        name: "rook",
        point: 3
    },
    {
        name: "bishop",
        point: 2
    },
    {
        name: "queen",
        point: 5
    },
    {
        name: "king",
        point: 2
    },
    {
        name: "bishop",
        point: 2
    },
    {
        name: "rook",
        point: 5
    }
];

const MAX_TILE_REACH = 4;
const WIDTH = figureOrder.length;
const HEIGTH = 10;
var DEBUG = false;
var figures = new Map();
var tiles = new Map();

var started = false;
var ended = false;

var turn = "white";
var maxTurn = 20;
var nTurn = 1;

var main;
var timeCounter;
var time = 0;

var whitePoints = 0;
var blackPoints = 0;

function onLoad() {
    tableCreate();
    document.getElementById("table-grid").style.backgroundColor = "rgba(0, 0, 0, 0.2)";
    document.getElementById("information").innerHTML = information;
    changeTexts();

    document.getElementById("nTurn").innerHTML = "Starting";

    main = setInterval(Main, 250);
}

function onClick(id) {
    if(!started || ended) return;
    if(DEBUG) console.log("onClick");
    if(DEBUG) debug(id);
    var figure = figures.get(id);
    var selectedfigure = findIn(figures, "selected", true);

    if((figure || !selectedfigure) && figure && turn == figure.race) {
        if(selectedfigure) unselection(selectedfigure.id);
        selection(id);
    } else if(selectedfigure && (!figure || figure.race != selectedfigure.race)) {
        move(selectedfigure.id, id);
    }
}

function selection(id) {
    if(DEBUG) console.log("selection");
    var figure = figures.get(id);
    figure.selected = true;
    var table = document.getElementById("table");
    if(figure.name == "pawn") {
        var upOrDown = true;
        var upDblMov = 2;
        var downDblMov = 2;

        if(figure.race == "black") {
            upOrDown = false;
            if(figure.pos.y == 1) downDblMov = 3;
        } else if(figure.race == "white") {
            upOrDown = true;
            if(figure.pos.y == HEIGTH - 2) upDblMov = 3;
        }

        var posY;
        if(upOrDown) posY = figure.pos.y - 1;
        else posY = figure.pos.y + 1;
        var row = table.rows[posY];
        if(row) {
            var rightCell = row.cells[figure.pos.x + 1];
            var leftCell = row.cells[figure.pos.x - 1];
            if(rightCell) {
                var tile = tiles.get(rightCell.id);
    
                if(tile.figure && tile.figure.race != figure.race) {
                    rightCell.style.backgroundColor = "rgb(200, 0, 0)";
                    changeTile(tile, true, rightCell.style.backgroundColor);
                }
            }
            if(leftCell) {
                var tile = tiles.get(leftCell.id);
    
                if(tile.figure && tile.figure.race != figure.race) {
                    leftCell.style.backgroundColor = "rgb(200, 0, 0)";
                    changeTile(tile, true, leftCell.style.backgroundColor);
                }
            }
        }

        //--DOWN
        for(var y = 1; y < downDblMov; y++) {
            if(figure.pos.y + y > HEIGTH - 1) break;
            var cell = table.rows[figure.pos.y + y].cells[figure.pos.x];
            var tile = tiles.get(cell.id);

            if(tile.figure) break;
            else {
                cell.style.backgroundColor = "lightblue";
                changeTile(tile, true, cell.style.backgroundColor);
            }
        }
        //--UP
        for(var y = 1; y < upDblMov; y++) {
            if(figure.pos.y - y < 0) break;
            var cell = table.rows[figure.pos.y - y].cells[figure.pos.x];
            var tile = tiles.get(cell.id);

            if(tile.figure) break;
            else {
                cell.style.backgroundColor = "lightblue";
                changeTile(tile, true, cell.style.backgroundColor);
            }
        }
    } else if(figure.name == "bishop") {
        //--LEFT-UP
        for(var x = 1; x < 5; x++) {
            if(figure.pos.x - x < 0 || figure.pos.y - x < 0) break;
            var cell = table.rows[figure.pos.y - x].cells[figure.pos.x - x];
            var tile = tiles.get(cell.id);

            if(checkTile(cell, tile, figure)) break;
        }
        //--RIGHT-UP
        for(var x = 1; x < 5; x++) {
            if(figure.pos.x + x > WIDTH - 1 || figure.pos.y - x < 0) break;
            var cell = table.rows[figure.pos.y - x].cells[figure.pos.x + x];
            var tile = tiles.get(cell.id);

            if(checkTile(cell, tile, figure)) break;
        }
        //--LEFT-DOWN
        for(var y = 1; y < 5; y++) {
            if(figure.pos.y + y > HEIGTH - 1 || figure.pos.x - y < 0) break;
            var cell = table.rows[figure.pos.y + y].cells[figure.pos.x - y];
            var tile = tiles.get(cell.id);

            if(checkTile(cell, tile, figure)) break;
        }
        //--RIGHT-DOWN
        for(var y = 1; y < 5; y++) {
            if(figure.pos.y + y > HEIGTH - 1 || figure.pos.x + y > WIDTH - 1) break;
            var cell = table.rows[figure.pos.y + y].cells[figure.pos.x + y];
            var tile = tiles.get(cell.id);

            if(checkTile(cell, tile, figure)) break;
        }
    } else if(figure.name == "king") {
        for(var i = figure.pos.y - 1; i < figure.pos.y + 2; i++) {
            var row = table.rows[i];
            if(!row) continue;
            for(var j = figure.pos.x - 1; j < figure.pos.x + 2; j++) {
                var cell = row.cells[j];
                if(!cell) continue;
                if(DEBUG) console.log(`j: ${j} i: ${i}`);
                var tile = tiles.get(cell.id);

                if(tile.figure) {
                    if(tile.figure.race != figure.race) {
                        cell.style.backgroundColor = "rgb(200, 0, 0)";
                        changeTile(tile, true, cell.style.backgroundColor);
                    }
                    continue;
                }

                cell.style.backgroundColor = "lightblue";
                changeTile(tile, true, cell.style.backgroundColor);
            }
        }
    } else if(figure.name == "queen") {
        //--LEFT-UP
        for(var x = 1; x < 5; x++) {
            if(figure.pos.x - x < 0 || figure.pos.y - x < 0) break;
            var cell = table.rows[figure.pos.y - x].cells[figure.pos.x - x];
            var tile = tiles.get(cell.id);

            if(checkTile(cell, tile, figure)) break;
        }
        //--RIGHT-UP
        for(var x = 1; x < 5; x++) {
            if(figure.pos.x + x > WIDTH - 1 || figure.pos.y - x < 0) break;
            var cell = table.rows[figure.pos.y - x].cells[figure.pos.x + x];
            var tile = tiles.get(cell.id);

            if(checkTile(cell, tile, figure)) break;
        }
        //--LEFT-DOWN
        for(var y = 1; y < 5; y++) {
            if(figure.pos.y + y > HEIGTH - 1 || figure.pos.x - y < 0) break;
            var cell = table.rows[figure.pos.y + y].cells[figure.pos.x - y];
            var tile = tiles.get(cell.id);

            if(checkTile(cell, tile, figure)) break;
        }
        //--RIGHT-DOWN
        for(var y = 1; y < 5; y++) {
            if(figure.pos.y + y > HEIGTH - 1 || figure.pos.x + y > WIDTH - 1) break;
            var cell = table.rows[figure.pos.y + y].cells[figure.pos.x + y];
            var tile = tiles.get(cell.id);

            if(checkTile(cell, tile, figure)) break;
        }
        //--RIGHT
        for(var x = 1; x < 5; x++) {
            if(figure.pos.x + x > WIDTH - 1) break;
            var cell = table.rows[figure.pos.y].cells[figure.pos.x + x];
            var tile = tiles.get(cell.id);

            if(checkTile(cell, tile, figure)) break;
        }
        //--LEFT
        for(var x = 1; x < 5; x++) {
            if(figure.pos.x - x < 0) break;
            var cell = table.rows[figure.pos.y].cells[figure.pos.x - x];
            var tile = tiles.get(cell.id);

            if(checkTile(cell, tile, figure)) break;
        }
        //--DOWN
        for(var y = 1; y < 5; y++) {
            if(figure.pos.y + y > HEIGTH - 1) break;
            var cell = table.rows[figure.pos.y + y].cells[figure.pos.x];
            var tile = tiles.get(cell.id);

            if(checkTile(cell, tile, figure)) break;
        }
        //--UP
        for(var y = 1; y < 5; y++) {
            if(figure.pos.y - y < 0) break;
            var cell = table.rows[figure.pos.y - y].cells[figure.pos.x];
            var tile = tiles.get(cell.id);

            if(checkTile(cell, tile, figure)) break;
        }
    } else if(figure.name == "rook") {
        //--RIGHT
        for(var x = 1; x < 5; x++) {
            if(figure.pos.x + x > WIDTH - 1) break;
            var cell = table.rows[figure.pos.y].cells[figure.pos.x + x];
            var tile = tiles.get(cell.id);

            if(checkTile(cell, tile, figure)) break;
        }
        //--LEFT
        for(var x = 1; x < 5; x++) {
            if(figure.pos.x - x < 0) break;
            var cell = table.rows[figure.pos.y].cells[figure.pos.x - x];
            var tile = tiles.get(cell.id);

            if(checkTile(cell, tile, figure)) break;
        }
        //--DOWN
        for(var y = 1; y < 5; y++) {
            if(figure.pos.y + y > HEIGTH - 1) break;
            var cell = table.rows[figure.pos.y + y].cells[figure.pos.x];
            var tile = tiles.get(cell.id);

            if(checkTile(cell, tile, figure)) break;
        }
        //--UP
        for(var y = 1; y < 5; y++) {
            if(figure.pos.y - y < 0) break;
            var cell = table.rows[figure.pos.y - y].cells[figure.pos.x];
            var tile = tiles.get(cell.id);

            if(checkTile(cell, tile, figure)) break;
        }
    }
}

function unselection(id) {
    if(DEBUG) console.log("unselection");
    var figure = figures.get(id);
    figure.selected = false;
    var table = document.getElementById("table");
    for (let i = 0; i < 10; i++) {
        var row = table.rows[i];
        for (let j = 0; j < 6; j++) {
            var cell = row.cells[j];
            var tile = tiles.get(cell.id);
            if(DEBUG) cell.innerHTML = `${j} ${i}`;
            else cell.innerHTML = "";
            if(DEBUG) cell.style.color = "rgb(100, 200, 200)";
            else cell.style.color = "";
            if(tile.color != "green") {
                cell.style.backgroundColor = tile.originalColor;
                changeTile(tile, false, cell.style.backgroundColor);
            } else {
                changeTile(tile, false);
            }
        }
    }
}

function move(frId, toId) {
    if(DEBUG) console.log("move");
    var tile = tiles.get(toId);
    if(!tile.movable) return;

    var frFigure = figures.get(frId);
    var toFigure = figures.get(toId);
    var pos = toId.slice(3, toId.length - 1).split("_");

    if(turn == "white") {
        if(toFigure && toFigure.race != turn) {
            whitePoints += toFigure.point;
        }
        turn = "black";
    } else {
        if(toFigure && toFigure.race != turn) {
            blackPoints += toFigure.point;
        }
        turn = "white";

        nTurn++;

        if(maxTurn < nTurn) ended = true;
    }

    var nToFigure = createFigureObj(toId, frFigure.name, frFigure.race, parseInt(pos[0], 10), parseInt(pos[1], 10), frFigure.point, frFigure.picture);
    figures.delete(frId);
    figures.set(toId, nToFigure);
    document.getElementById(frId).style.backgroundImage = "";
    document.getElementById(toId).style.backgroundImage = nToFigure.picture;
    tiles.get(frId).figure = null;
    tile.figure = nToFigure;
    if(DEBUG) debug(toId);

    
    unselection(toId);

    if(!ended) changeTexts();
}

function checkTile(cell, tile, figure) {
    if(tile.figure) {
        if(tile.figure.race != figure.race) {
            cell.style.backgroundColor = "rgb(200, 0, 0)";
            changeTile(tile, true, cell.style.backgroundColor);
        }
        return true;
    }

    cell.style.backgroundColor = "lightblue";
    changeTile(tile, true, cell.style.backgroundColor);
    return false;
}

function tableCreate() {
    let whOrBl = false;
    var body = document.getElementById("chessTable");
    var tbl = document.createElement('table');
    tbl.id = "table";
    var tbdy = document.createElement('tbody');
    for (let i = 0; i < HEIGTH; i++) {
        var tr = document.createElement('tr');
        for (let j = 0; j < WIDTH; j++) {
            var td = document.createElement('td');
            if(DEBUG) td.innerHTML = `${j} ${i}`;
            if(DEBUG) td.style.color = "rgb(100, 200, 200)";
            td.style.backgroundColor = `${whOrBl ? "rgb(242, 210, 147)": "rgb(130, 68, 24)"}`;
            td.id = `td(${j}_${i})`;
            td.style.backgroundSize = "100%";
            td.style.backgroundRepeat = "no-repeat";
            td.onclick = function() {onClick(this.id)};
            if(i == 0 || i == HEIGTH - 1) {
                if(i == 0){
                    td.style.backgroundImage = `url("./BlackCMs/black_${figureOrder[j].name}.png")`;
                } else {
                    td.style.backgroundImage = `url("./WhiteCMs/white_${figureOrder[j].name}.png")`;
                }
                figures.set(td.id, createFigureObj(td.id, figureOrder[j].name, i == 0 ? "black" : "white", j, i, figureOrder[j].point, td.style.backgroundImage));
            } else if (i == 1 || i == HEIGTH - 2) {
                if(i == 1) {
                    td.style.backgroundImage = `url("./BlackCMs/black_pawn.png")`;
                } else {
                    td.style.backgroundImage = `url("./WhiteCMs/white_pawn.png")`;
                }
                figures.set(td.id, createFigureObj(td.id, "pawn", i == 1 ? "black" : "white", j, i, 1, td.style.backgroundImage));
            }
            tiles.set(td.id, createTileObj(td.id, figures.get(td.id) || null, td.style.backgroundColor));
            tr.appendChild(td);
            whOrBl = !whOrBl;
        }
        whOrBl = !whOrBl;
        tbdy.appendChild(tr);
    }
    tbl.appendChild(tbdy);
    body.appendChild(tbl);
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
        killed: false,
    };
    return figure;
}

function createTileObj(id, figure, color) {
    var tile = {
        id: id,
        figure: figure,
        color: color,
        originalColor: color,
        movable: false
    };
    return tile;
}

function changeTile(tile, movable, color, figure) {
    if(tile) {
        if(movable) tile.color = color;
        if(color) tile.movable = movable;
        if(figure) tile.figure = figure;
    } 
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

function debug(id) {
    if(figures.get(id)) {
        if(DEBUG) console.log(
            `FIGURE
            id: ${id}
            name: ${figures.get(id).name}
            race: ${figures.get(id).race}
            pos: {
                x: ${figures.get(id).pos.x}
                y: ${figures.get(id).pos.y}
            }
            point: ${figures.get(id).point}
            picture: ${figures.get(id).picture}
            selected: ${figures.get(id).selected}
            killed: ${figures.get(id).killed}`
        );
        if(DEBUG) console.log(
            `TILE
            id: ${id}
            figure: ${tiles.get(id).figure}
            color: ${tiles.get(id).color}
            originalColor ${tiles.get(id).originalColor}
            movable: ${tiles.get(id).movable}`
        );
    } else {
        if(DEBUG) console.log(
            `TILE
            id: ${id}
            figure: ${tiles.get(id).figure}
            color: ${tiles.get(id).color}
            originalColor ${tiles.get(id).originalColor}
            movable: ${tiles.get(id).movable}`
        );
    }
}

function onDebug() {
    DEBUG = !DEBUG;
    document.getElementById("debug-button").innerText = `DEBUG ${DEBUG ? "ON" : "OFF"}`;
}

function onSubmit() {
    if(ended) reset();
    maxTurn = document.getElementById("turn-input").value;
    if(maxTurn < nTurn) maxTurn = nTurn;
    document.getElementById("turns").innerHTML = `Turn: ${nTurn} / ${maxTurn}`;
    started = true;
    document.getElementById("turn-input").setAttribute("readonly", true);
    document.getElementById("turn-input-button").setAttribute("disabled", true);
    document.getElementById("table-grid").style.backgroundColor = "";
    document.getElementById("nTurn").innerHTML = turn;

    timeCounter = setInterval(TimeCounter, 1000)
}

function changeTexts() {
    document.getElementById("turns").innerHTML = `Turn: ${nTurn} / ${maxTurn}`;

    document.getElementById("bPoints").innerHTML = "" + blackPoints;
    document.getElementById("nTurn").innerHTML = turn;
    document.getElementById("wPoints").innerHTML = "" + whitePoints;
}

function reset() {
    document.getElementById("timer").innerHTML = "00:00:00";
    time = 0;
    figures = new Map();
    tiles = new Map();

    started = false;
    ended = false;

    turn = "white";
    maxTurn = 20;
    nTurn = 1;

    whitePoints = 0;
    blackPoints = 0;

    document.getElementById("table").remove();
    tableCreate();

    main = setInterval(Main, 250);
    timeCounter = setInterval(TimeCounter, 1000);

    changeTexts();

    document.getElementById("nTurn").innerHTML = "Starting";
}

function Main() {
    if(ended) {
        document.getElementById("table-grid").style.backgroundColor = "rgba(0, 0, 0, 0.2)";

        if(whitePoints > blackPoints) {
            document.getElementById("turns").innerHTML += "<br>Winner: White";
        } else if(whitePoints < blackPoints) {
            document.getElementById("turns").innerHTML += "<br>Winner: Black";
        } else {
            document.getElementById("turns").innerHTML += "<br>Draw";
        }
        document.getElementById("nTurn").innerHTML = "Ended";
        document.getElementById("turn-input").removeAttribute("readonly");
        document.getElementById("turn-input-button").removeAttribute("disabled");

        clearInterval(main);
        clearInterval(timeCounter);

        delete main;
        delete timeCounter;
    }
}

function TimeCounter() {
    ++time;
    var hour = pad(Math.floor(time / 3600));
    var minute = pad(Math.floor((time - hour * 3600) / 60));
    var seconds = pad(time - (hour * 3600 + minute * 60));

    document.getElementById("timer").innerHTML = hour + ":" + minute + ":" + seconds;
}

function pad(val) {
    var valString = val + "";
    if (valString.length < 2) {
        return "0" + valString;
    } else {
        return valString;
    }
} 