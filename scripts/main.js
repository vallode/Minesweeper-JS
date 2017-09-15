
/* Pre-load some assets */

function preload(url) {
    image = new Image()
    image.src = url
}

preload("images/tile.png")
preload()

/* Initialize */

var rows = 9
var columns = 9
var bombs = 10

var gameState = false;

var bombList = []

function generateField() {

    for (x = 0; x < rows; x++){
        row = document.createElement('div')
        row.className = 'row'
        row.id = 'row'
        document.getElementById('gamespace').appendChild(row)

        for (y = 0; y < columns; y++) {
            tile = document.createElement('img')
            tile.src = 'images/tile.png'
            document.getElementById('row').appendChild(tile)

            tile.id = x + '_' + y

            tile.onclick = function() { click(this.id) }

        }
        row.id = ''
    }

}

function mines(id) {
    for (z = 0; z < bombs; z++) {
        x = Math.floor(Math.random() * rows)
        y = Math.floor(Math.random() * columns)
        bombId = x + '_' + y

        while (bombId == id) {
            x = Math.floor(Math.random() * rows)
            y = Math.floor(Math.random() * columns)
            bombId = x + '_' + y
            console.log("regen clicked")
        }
        while (bombId == adjecency(id, 0)) {
            x = Math.floor(Math.random() * rows)
            y = Math.floor(Math.random() * columns)
            bombId = x + '_' + y
            console.log("regen around")
        }
        while (bombId == adjecency(id, 1)) {
            x = Math.floor(Math.random() * rows)
            y = Math.floor(Math.random() * columns)
            bombId = x + '_' + y
            console.log("regen around")
        }
        while (bombId == adjecency(id, 2)) {
            x = Math.floor(Math.random() * rows)
            y = Math.floor(Math.random() * columns)
            bombId = x + '_' + y
            console.log("regen around")
        }
        while (bombId == adjecency(id, 3)) {
            x = Math.floor(Math.random() * rows)
            y = Math.floor(Math.random() * columns)
            bombId = x + '_' + y
            console.log("regen around")
        }

        /* if bombid == any of the 8 blocks regen it */
        for (i = 0; cord.length > i; i++) {
            g = id.toString().split('_')
            g[0] = parseInt(g[0]) + parseInt(cord[i][0])
            g[1] = parseInt(g[1]) + parseInt(cord[i][1])
            if (g[0] >= 0 && g[0] <= 8 && g[1] >= 0 && g[1] <= 8) {
                g = g.join('_')
                while (bombId == g) {
                    x = Math.floor(Math.random() * rows)
                    y = Math.floor(Math.random() * columns)
                    bombId = x + '_' + y
                    console.log("regen around")
                }
            }
        }
        bombId = bombId.toString()
        bombList.push(bombId)
        document.getElementById(bombId).classList.add('ss') //bomb
    }
}

/* Click logic */

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

function click(id) {
    if (gameState != true) {
        gameState = true

        mines(id) //populate

        reveal(id)
    }

    document.getElementById(id).classList.add('display')
    for (y = 0; y < bombList.length; y++) {
        if (bombList[y] == id){
            document.getElementById('gamespace').innerHTML = "GAME OVER"
            return null
        }
    }

    reveal(id)
}

function adjecency(id, i) {
    g = id.toString().split('_')
    g[0] = parseInt(g[0]) + parseInt(cord[i][0])
    g[1] = parseInt(g[1]) + parseInt(cord[i][1])
    if (g[0] >= 0 && g[0] <= 8 && g[1] >= 0 && g[1] <= 8) {
        g = g.join('_')
        return g
    }
}   
function reveal(id) {
    document.getElementById(id).classList.add('display')
    
    /* for each block around it, check if that block is also not a mine and zero and reveal it*/
    for (i = 0; adjecent.length > i; i++) {
        x = id.toString().split('_')
        x[0] = parseInt(x[0]) + parseInt(adjecent[i][0])
        x[1] = parseInt(x[1]) + parseInt(adjecent[i][1])
        if (x[0] >= 0 && x[0] <= 8 && x[1] >= 0 && x[1] <= 8) {
            x = x.join('_')
            for (y = 0; y < bombList.length; y++) {
                if (bombList[y] == x) {
                    document.getElementById(bombId).classList.add('sss') //dont reveal
                    return null
                }
            }
            document.getElementById(x).classList.add('display')
        }
    }
}





document.addEventListener("DOMContentLoaded", generateField())