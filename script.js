const names = ["rook", "bishop", "queen", "king", "bishop", "rook"];
const points = [3, 2, 5, 2, 2, 3];
var figures = new Map();
var tiles = new Map();
var turn = "white";

function onLoad() {
    tableCreate();
}

async function onClick(id) {
    //alert("onClick");
    //check(id);
    var figure = figures.get(id);
    var selectedfigure = findIn(figures, "selected", true);

    if((figure || !selectedfigure) && turn == figure.race) {
        if(selectedfigure) unselection(selectedfigure.id);
        selection(id);
    } else if(selectedfigure && (!figure || figure.race != selectedfigure.race)) {
        await move(selectedfigure.id, id);
    }
    
}

function selection(id) {
    //alert("selection");
    var figure = figures.get(id);
    figure.selected = true;
    var table = document.getElementById("table");
    if(figure.name == "pawn") {
        if(figure.race == "black") {
            for(var i = figure.pos.y - 1; i < figure.pos.y + 3; i++) {
                var row = table.rows[i];
                if(!row) continue;
                for(var j = figure.pos.x - 1; j < figure.pos.x + 2; j++) {
                    var cell = row.cells[j];
                    if(!cell) continue;
                    //alert(`j: ${j} i: ${i}`);
                    var tile = tiles.get(cell.id);
    
                    if(figure.pos.y != 1 && i > figure.pos.y + 1) continue;
                    if(tile.figure) {
                        if(figure.pos.y == 1 && i > figure.pos.y + 1) continue;
                        if(i != figure.pos.y && j == figure.pos.x) continue;
                        if(i < figure.pos.y + 1 && (j > figure.pos.x || j < figure.pos.x)) continue;
                        if(tile.figure.race != figure.race) {
                            cell.style.backgroundColor = "rgb(200, 0, 0)";
                            changeTile(tile, true, cell.style.backgroundColor);
                        }
                        continue;
                    }
    
                    if((j < figure.pos.x ) || (j > figure.pos.x)) continue;
    
                    cell.style.backgroundColor = "lightblue";
                    changeTile(tile, true, cell.style.backgroundColor);
                }
            }
        } else {
            for(var i = figure.pos.y + 1; i > figure.pos.y - 3; i--) {
                var row = table.rows[i];
                if(!row) continue;
                for(var j = figure.pos.x - 1; j < figure.pos.x + 2; j++) {
                    var cell = row.cells[j];
                    if(!cell) continue;
                    //alert(`j: ${j} i: ${i}`);
                    var tile = tiles.get(cell.id); 
                    if(figure.pos.y != 8 && i < figure.pos.y - 1) continue;
                    if(tile.figure) {
                        if(figure.pos.y == 8 && i < figure.pos.y - 1) continue;
                        if(i != figure.pos.y && j == figure.pos.x) continue;
                        if(i > figure.pos.y - 1 && (j > figure.pos.x || j < figure.pos.x)) continue;
                        if(tile.figure.race != figure.race) {
                            cell.style.backgroundColor = "rgb(200, 0, 0)";
                            changeTile(tile, true, cell.style.backgroundColor);
                        }
                        continue;
                    }

                    if((j < figure.pos.x ) || (j > figure.pos.x)) continue;

                    cell.style.backgroundColor = "lightblue";
                    changeTile(tile, true, cell.style.backgroundColor);
                }
            }
        }
        
    } else if(figure.name == "bishop") {
        
    } else if(figure.name == "king") {
        for(var i = figure.pos.y - 1; i < figure.pos.y + 2; i++) {
            var row = table.rows[i];
            if(!row) continue;
            for(var j = figure.pos.x - 1; j < figure.pos.x + 2; j++) {
                var cell = row.cells[j];
                if(!cell) continue;
                //alert(`j: ${j} i: ${i}`);
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
        
    } else if(figure.name == "rook") {
        var up = false;
        var left = false;
        var right = false;
        var down = false;
        for(var i = figure.pos.y + 4; i > figure.pos.y - 5; i--) {
            var row = table.rows[i];
            if(!row) continue;
            for(var j = figure.pos.x - 4; j < figure.pos.x + 5; j++) {
                var cell = row.cells[j];
                if(!cell) continue;
                var tile = tiles.get(cell.id);

                if(i != figure.pos.y && j != figure.pos.x) continue;
                if(i < figure.pos.y && up) continue;
                if(j > figure.pos.x && right) continue;
                //if(i > figure.pos.y && down) continue;
                //alert(`j: ${j} i: ${i}`);
                if(tile.figure) {
                    if(tile.figure.race != figure.race) {
                        cell.style.backgroundColor = "rgb(200, 0, 0)";
                        changeTile(tile, true, cell.style.backgroundColor);
                    }
                    //---Up
                    if(tile.figure.pos.y < figure.pos.y) {
                        for(var k = tile.figure.pos.y; k > figure.pos.y - 5; k--) {
                            //alert(`x: ${figure.pos.x}k: ${k}`);
                            var row = table.rows[k];
                            if(!row) continue;
                            var cell = row.cells[figure.pos.x];
                            if(!cell) continue;
                            var uTile = tiles.get(cell.id);
                            if(cell.style.backgroundColor == "lightblue") {
                                cell.style.backgroundColor = uTile.originalColor;
                                changeTile(uTile, false, cell.style.backgroundColor);
                            }
                            changeTile(uTile, false);
                        }
                        up = true;
                    }
                    //---Left
                    if(tile.figure.pos.x < figure.pos.x) {
                        for(var k = figure.pos.x; k > tile.figure.pos.x - figure.pos.x; k--) {
                            //alert(`k: ${k} y: ${figure.pos.y}`);
                            var row = table.rows[figure.pos.y];
                            if(!row) continue;
                            var cell = row.cells[k];
                            if(!cell) continue;
                            var uTile = tiles.get(cell.id);
                            if(cell.style.backgroundColor == "lightblue" || left) {
                                cell.style.backgroundColor = uTile.originalColor;
                                changeTile(uTile, false, cell.style.backgroundColor);
                            }

                            if(cell.style.backgroundColor == "rgb(200, 0, 0)" && k > figure.pos.x - 2) {
                                left = true;
                            }
                            changeTile(uTile, false);

                        }
                    }
                    //---Rigth
                    if(tile.figure.pos.x > figure.pos.x) {
                        for(var k = tile.figure.pos.x; k < figure.pos.x + 5; k++) {
                            //alert(`k: ${k} y: ${figure.pos.y}`);
                            var row = table.rows[figure.pos.y];
                            if(!row) continue;
                            var cell = row.cells[k];
                            if(!cell) continue;
                            var uTile = tiles.get(cell.id);

                            if(cell.style.backgroundColor == "lightblue" || right) {
                                cell.style.backgroundColor = uTile.originalColor;
                                changeTile(uTile, false, cell.style.backgroundColor);
                            }

                            if(cell.style.backgroundColor == "rgb(200, 0, 0)" && k < figure.pos.x + 5) {
                                right = true;
                            }
                            changeTile(uTile, false);
                        }
                    }
                    //---Down
                    if(tile.figure.pos.y > figure.pos.y) {
                        for(var k = figure.pos.y; k < figure.pos.y + 5; k++) {
                            //alert(`x: ${figure.pos.x}k: ${k}`);
                            var row = table.rows[k];
                            if(!row) continue;
                            var cell = row.cells[figure.pos.x];
                            if(!cell) continue;
                            var uTile = tiles.get(cell.id);

                            if(cell.style.backgroundColor == "lightblue"|| down) {
                                cell.style.backgroundColor = uTile.originalColor;
                                changeTile(uTile, false, cell.style.backgroundColor);
                            }

                            if(cell.style.backgroundColor == "rgb(200, 0, 0)" && tile.figure.pos.y - 1 < k) {
                                down = true;
                            }
                            changeTile(uTile, false);
                        }
                    }
                    continue;
                }

                cell.style.backgroundColor = "lightblue";
                changeTile(tile, true, cell.style.backgroundColor);
            }
        }
    }
}

function unselection(id) {
    //alert("unselection");
    var figure = figures.get(id);
    figure.selected = false;
    var table = document.getElementById("table");
    for (let i = 0; i < 10; i++) {
        var row = table.rows[i];
        for (let j = 0; j < 6; j++) {
            var cell = row.cells[j];
            var tile = tiles.get(cell.id);
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
    //alert("move");
    var tile = tiles.get(toId);
    if(!tile.movable) return;

    var frFigure = figures.get(frId);
    var toFigure = figures.get(toId);
    var pos = toId.slice(3, toId.length - 1).split("_");

    var toFigure = createFigureObj(toId, frFigure.name, frFigure.race, parseInt(pos[0], 10), parseInt(pos[1], 10), frFigure.point, frFigure.picture);
    figures.delete(frId);
    figures.set(toId, toFigure);
    document.getElementById(frId).style.backgroundImage = "";
    document.getElementById(toId).style.backgroundImage = toFigure.picture;
    tiles.get(frId).figure = null;
    tile.figure = toFigure;
    //check(toId);
    if(turn == "white") {
        turn = "black";
    } else {
        turn = "white";
    }
    
    unselection(toId);
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
            td.innerHTML = `${j} ${i}`;
            td.style.color = "rgb(100, 200, 200)";
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
                figures.set(td.id, createFigureObj(td.id, names[j], i == 0 ? "black" : "white", j, i, points[j], td.style.backgroundImage));
            } else if (i == 1 || i == 8) {
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

function check(id) {
    if(figures.get(id)) {
        alert(
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
        alert(
            `TILE
            id: ${id}
            figure: ${tiles.get(id).figure}
            color: ${tiles.get(id).color}
            originalColor ${tiles.get(id).originalColor}
            movable: ${tiles.get(id).movable}`
        );
    } else {
        alert(
            `TILE
            id: ${id}
            figure: ${tiles.get(id).figure}
            color: ${tiles.get(id).color}
            originalColor ${tiles.get(id).originalColor}
            movable: ${tiles.get(id).movable}`
        );
    }
}