/* Pre-load some assets */

function preload(url) {
    image = new Image()
    image.src = url
}

preload("images/tile.png")

function init() {
    generateField()
}

var rows = 9
var columns = 9
var bombs = 10

var firstClick = true;

var bombList = []
var tileList = []
var safe = []

var cord = [[-1, 1],
            [0, -1],
            [1, -1],
            [-1, 0],
            [1, 0],
            [-1, -1],
            [0, 1],
            [1, 1]]

var adjecent = [[-1, 0],
                [1, 0],
                [0, -1],
                [0, 1]]

function generateField() {

    for (y = 0; y < rows; y++){
        row = document.createElement('div')
        row.className = 'row'
        row.id = 'row'
        document.getElementById('gamespace').appendChild(row)

        for (x = 0; x < columns; x++) {
            tile = document.createElement('img')
            tile.src = 'images/tile.png'
            document.getElementById('row').appendChild(tile)

            tile.id = x + '_' + y
            tileList.push(tile.id)

            tile.onclick = function() { click(this.id) }

        }
        row.id = ''
    }

}

function generateMines(id) {
    console.log("gen")
    bombList = []
    for (z = 0; z < bombs; z++) {
        x = Math.floor(Math.random() * rows)
        y = Math.floor(Math.random() * columns)
        bombId = x + '_' + y

        /* if bombid == any of the 8 blocks regen it */
        bombId = bombId.toString()
        bombList.push(bombId)
        // add some sort of bomb identifier
    }

    //compare bombList to safe
    for (c in bombList) {
        for (f in safe) {
            if (bombList[c] === safe[f]) {
                generateMines(id)
            }
        }
    }

    for (c in bombList){
        addValue(bombList[c])
        document.getElementById(bombList[c]).classList.add('display')
    }
    console.log(bombList)
    console.log(tileList)
    console.log(safe)
}

function addValue(id) {
    for (i in cord) {
        x = id.toString().split('_')
        x[0] = parseInt(x[0]) + parseInt(cord[i][0])
        x[1] = parseInt(x[1]) + parseInt(cord[i][1])
        if (x[0] >= 0 && x[0] <= 8 && x[1] >= 0 && x[1] <= 8) {
            x = x.join('_')
            document.getElementById(x).classList.add('nearby') //add value
        }
    }
}

function click(id) {
    console.log("click")
    if (firstClick == true) {
        firstClick = false

        safe.push(id)
        for (i in cord) {
            x = id.toString().split('_')
            x[0] = parseInt(x[0]) + parseInt(cord[i][0])
            x[1] = parseInt(x[1]) + parseInt(cord[i][1])
            if (x[0] >= 0 && x[0] <= 8 && x[1] >= 0 && x[1] <= 8) {
                x = x.join('_')
                safe.push(x)
            }
        }

        generateMines(id)

        reveal(id)
    }else {
        reveal(id)
    }
}

function reveal(id) {
    document.getElementById(id).classList.add('display')

    //check for empty squares
    for (i in adjecent) {
        x = id.toString().split('_')
        x[0] = parseInt(x[0]) + parseInt(adjecent[i][0])
        x[1] = parseInt(x[1]) + parseInt(adjecent[i][1])
        if (x[0] >= 0 && x[0] <= 8 && x[1] >= 0 && x[1] <= 8) {
            x = x.join('_')
            console.log(x)
            if (!document.getElementById(x).classList.contains('display') && !document.getElementById(x).classList.contains('nearby')) {
                reveal(x)
            }
        }
    }
}

document.addEventListener("DOMContentLoaded", generateField())