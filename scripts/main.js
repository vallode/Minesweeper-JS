/* Pre-load some assets */

function preload(url) {
    image = new Image()
    image.src = url
}

preload("images/tile.png")
preload("images/empty.png")
preload("images/wallSide.png")
preload("images/1.png")
preload("images/2.png")
preload("images/3.png")
preload("images/4.png")
preload("images/5.png")
preload("images/6.png")
preload("images/7.png")
preload("images/8.png")
document.getElementById('gamespace').oncontextmenu = function() {return false;}
document.getElementById('gamespace').addEventListener('mousedown', function() { faceOoo('face') })
document.getElementById('gamespace').addEventListener('mouseup', function() { faceUp('face') })
document.getElementById('face').addEventListener('mousedown', function() { faceDown(this.id) })
document.getElementById('face').addEventListener('mouseup', function() { faceUp(this.id) })

function init() {
    generateField()
}

var rows = 9
var columns = 9

var bombs = 10

var firstClick = true;

var bombList = []
var tileList = []
var clearedTiles = 0

var numberList = []
    numberList.length = 256
    numberList.fill(0)
var safe = []
var flagList = []

var cord = [ [-1, -1], [0, -1], [+1, -1],
             [-1,  0],          [+1, 0],
             [-1, +1], [0, +1], [+1, +1] ]

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

            document.getElementById(tile.id).addEventListener("click", function() { click(this.id) })
            document.getElementById(tile.id).addEventListener("contextmenu", function() { flag(this.id) })

        }
        row.id = ''
    }

}

function generateMines(id) {
    console.log("gen")
    bombList = []
    for (z = 0; z < bombs; z++) {
        x = Math.floor(Math.random() * columns)
        y = Math.floor(Math.random() * rows)
        bombId = x + '_' + y

        /* if bombid == any of the 8 blocks regen it */
        bombId = bombId.toString()
        for (i in bombList) {
            while (bombList[i] == bombId) {
                console.log("regened duplicate mine")
                bombId = (Math.floor(Math.random() * columns)) + '_' + (Math.floor(Math.random() * rows))
            }
        }
        bombList.push(bombId)
        // add some sort of bomb identifier
    }

    //compare bombList to safe
    for (c in bombList) {
        for (f in safe) {
            if (bombList[c] === safe[f]) {
                generateMines(id)
                return
            }
        }
    }
    for (z in bombList){

        addValue(bombList[z])
        document.getElementById(bombList[z]).classList.add('bomb')
    }
}

function addValue(id) {
    for (i in cord) {
        x = id.toString().split('_')
        x[0] = parseInt(x[0]) + parseInt(cord[i][0])
        x[1] = parseInt(x[1]) + parseInt(cord[i][1])
        if (x[0] >= 0 && x[0] <= (columns - 1) && x[1] >= 0 && x[1] <= (rows - 1)) {

            numberList[(x[0]) + (x[1]*16)] += 1
            //(x) + (16 * y)
            x = x.join('_')
            document.getElementById(x).classList.add('nearby') //add value
        }
    }
}

function click(id) {
    console.log("click")
    if (firstClick == true) {
        safe.push(id)
        for (i in cord) {
            x = id.toString().split('_')
            x[0] = parseInt(x[0]) + parseInt(cord[i][0])
            x[1] = parseInt(x[1]) + parseInt(cord[i][1])
            if (x[0] >= 0 && x[0] <= (columns - 1) && x[1] >= 0 && x[1] <= (rows - 1)) {
                x = x.join('_')
                safe.push(x)
            }
        }

        generateMines(id)

        reveal(id)

        firstClick = false
    }else {
        reveal(id)
        checkWin(id)
    }
}

function flag(id) {
    console.log("Flag")
    if (document.getElementById(id).classList.contains('display')) {
        return null
    }
    for (i in flagList) {
        if (flagList[i] == id ) {
            flagList.splice(i)
            document.getElementById(id).src = 'images/tile.png'
            console.log("Splice Flag")
            return null
        }
    }
    document.getElementById(id).src = 'images/flag.png'
    flagList.push(id)
    console.log("Flag End")
}

function reveal(id) {
    for (i in flagList) {
        if (flagList[i] == id) {
            return null
        }
    }

    for (i in bombList) {
        if (bombList[i] == id) {
            loss(id)
            return null
        }
    }

    if (document.getElementById(id).classList.contains('display')) {
        return null
    }
    document.getElementById(id).classList.add('display')
    document.getElementById(id).src = returnImage(id)
    clearedTiles++
    console.log(clearedTiles)
    console.log(tileList.length - bombList.length)

    //check for empty squares
    //if square is blank empty it
    //if square has no number empty the squares around it

    if (document.getElementById(id).classList.contains('nearby')) {
        document.getElementById(id).src = returnImage(id)
        return null
    }

    for (i in cord) {
        x = id.toString().split('_')
        x[0] = parseInt(x[0]) + parseInt(cord[i][0])
        x[1] = parseInt(x[1]) + parseInt(cord[i][1])
        if (x[0] >= 0 && x[0] <= (columns - 1) && x[1] >= 0 && x[1] <= (rows - 1)) {
            x = x.join('_')
            if (!document.getElementById(x).classList.contains('display') &&
                !document.getElementById(x).classList.contains('bomb')) {
                    reveal(x)
            }
        }
    }
}

function checkWin(id) {
    if (clearedTiles == (tileList.length - bombList.length)) {
        win()
        return null
    }
}

function win() {
    for (i in bombList) {
        document.getElementById(bombList[i]).src = 'images/flag.png'
    }
    document.getElementById('face').src = 'images/faceWin.png'
}

function loss(id) {
    for (i in bombList) {
        document.getElementById(bombList[i]).src = 'images/bomb2.png'
    }
    document.getElementById(id).src = 'images/bomb.png'
    document.getElementById('face').src = 'images/faceLoss.png'

    document.getElementById('gamespace').addEventListener('mousedown', function() { return null })
}

function returnImage(id) {
    x = id.toString().split('_')
    x[0] = parseInt(x[0])
    x[1] = parseInt(x[1])
    switch (numberList[((x[0]) + (x[1]*16))]) {
        case 1:
            imgSrc = 'images/1.png'
            break
        case 2:
            imgSrc = 'images/2.png'
            break
        case 3:
            imgSrc = 'images/3.png'
            break
        case 4:
            imgSrc = 'images/4.png'
            break
        case 5:
            imgSrc = 'images/5.png'
            break
        case 6:
            imgSrc = 'images/6.png'
            break
        case 7:
            imgSrc = 'images/7.png'
            break
        case 8:
            imgSrc = 'images/8.png'
            break
        default:
            imgSrc = 'images/empty.png'
    }
    return imgSrc
}

function faceDown(id) {
    document.getElementById(id).src = 'images/faceDown.png'
    reset()
}
function faceUp(id) {
    document.getElementById(id).src = 'images/face.png'
}
function faceOoo(id) {
    document.getElementById(id).src = 'images/faceOoo.png'
}

function reset() {
    firstClick = true;

    bombList = []
    tileList = []
    clearedTiles = 0

    numberList = []
    numberList.length = 256
    numberList.fill(0)

    safe = []
    flagList = []

    document.getElementById('gamespace').innerHTML = ''

    generateField()
}

time = 0

setInterval(function() {
    time++

    
    console.log(time.toString())
}, 1000)

document.addEventListener("DOMContentLoaded", generateField())