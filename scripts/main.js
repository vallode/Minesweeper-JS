// Main script

const rows = 19
const columns = 30
const bombs = 99

var flags = bombs

var clearedTiles = 0

var firstClick = true

var bombList = []
var tileList = []
var flagList = []
var safe = []

var numberList = new Array((rows * columns))
    numberList.fill(0)

// Adjacent tiles

var cord = [[-1, -1], [0, -1], [+1, -1],
            [-1,  0],          [+1, 0],
            [-1, +1], [0, +1], [+1, +1]]

// Add listeners

function addListeners() {
    document.getElementById('gamespace').oncontextmenu = function() { return false; }
    document.getElementById('gamespace').addEventListener('mousedown', faceOoo )
    document.getElementById('gamespace').addEventListener('mouseup', faceUp )
    document.getElementById('face').addEventListener('mousedown', faceDown )
    document.getElementById('face').addEventListener('mouseup', faceUp )
}

//Generate the tile field
function generateField() {
    addListeners()
    //Iterate through rows
    for (y = 0; y < rows; y++){

        row = document.createElement('div')
        row.className = 'row'
        row.id = 'row'
        document.getElementById('gamespace').appendChild(row)

        for (x = 0; x < columns; x++) {

            tile = document.createElement('img')
            tile.src = '/images/tile.png'
            tile.id = x + '_' + y

            tileList.push(tile.id)

            document.getElementById('row').appendChild(tile)

            //Reveal
            document.getElementById(tile.id).addEventListener('click', click)

            //Flag
            document.getElementById(tile.id).addEventListener('contextmenu', flag)

        }
        //Reset the row ID to stop tile generator targeting the first row everytime
        row.id = ''
    }
    updateFlag()
}

function generateMines(id) {
    bombList = []
    for (z = 0; z < bombs; z++) {
        bombId = Math.floor(Math.random() * (columns -1)) + '_' + Math.floor(Math.random() * (rows - 1))

        // If a bomb has the ID as another bomb, regenerate that bomb
        bombId = bombId.toString()
        for (i in bombList) {
            while (bombList[i] == bombId) {
                bombId = (Math.floor(Math.random() * (columns - 1)) + '_' + (Math.floor(Math.random() * (rows - 1))))
            }
        }
        bombList.push(bombId)
    }

    // If a bomb falls within the safe area, regenerate all bombs
    for (c in bombList) {
        for (f in safe) {
            if (bombList[c] === safe[f]) {
                generateMines(id)
                return null
            }
        }
    }

    // For each bomb, add a value to the tiles around it
    for (z in bombList){
        addValue(bombList[z])
        document.getElementById(bombList[z]).classList.add('bomb') // Temp identifier
    }
}

function addValue(id) {
    //For each adjacent tile add a value to the corresponding array position
    for (i in cord) {
        x = id.toString().split('_')
        x[0] = parseInt(x[0]) + parseInt(cord[i][0])
        x[1] = parseInt(x[1]) + parseInt(cord[i][1])
        if (x[0] >= 0 && x[0] < columns && x[1] >= 0 && x[1] < rows) {
            //(x) + ((columns - 1) * y)
            numberList[(x[0]) + ((columns) * x[1])] += 1
            x = x.join('_')
            document.getElementById(x).classList.add('nearby') // Temp identifier
        }
    }
}

// Listeners

function click(event) {
    if (firstClick == true) {
        safe.push(event.target.id)
        for (i in cord) {
            x = event.target.id.toString().split('_')
            x[0] = parseInt(x[0]) + parseInt(cord[i][0])
            x[1] = parseInt(x[1]) + parseInt(cord[i][1])
            if (x[0] >= 0 && x[0] < columns && x[1] >= 0 && x[1] < rows) {
                x = x.join('_')
                safe.push(x)
            }
        }

        generateMines(event.target.id)

        reveal(event.target.id)

        timeStart()

        firstClick = false
    }else {
        reveal(event.target.id)

        checkWin(event.target.id)
    }
}

function flag(event) {
    if (document.getElementById(event.target.id).classList.contains('display')) {
        return null
    }
    for (i in flagList) {
        if (flagList[i] == event.target.id ) {
            flagList.splice(i, 1)
            flags++
            document.getElementById(event.target.id).src = '/images/tile.png'
            updateFlag()
            return null
        }
    }
    flagList.push(event.target.id)
    document.getElementById(event.target.id).src = '/images/flag.png'
    flags--
    updateFlag()
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
        if (x[0] >= 0 && x[0] < columns && x[1] >= 0 && x[1] < rows) {
            x = x.join('_')
            if (!document.getElementById(x).classList.contains('display') &&
                !document.getElementById(x).classList.contains('bomb')) {
                    reveal(x)
            }
        }
    }
}

function checkWin() {
    if (clearedTiles == (tileList.length - bombList.length)) {
        win()
        return null
    }
}

function win() {
    for (i in bombList) {
        document.getElementById(bombList[i]).src = '/images/flag.png'
    }
    document.getElementById('face').src = '/images/faceWin.png'
}

function loss(id) {
    clearInterval(timeInterval)
    for (i in bombList) {
        document.getElementById(bombList[i]).src = '/images/bomb.png'
    }
    document.getElementById(id).src = '/images/bombRed.png'
    document.getElementById('face').src = '/images/faceLoss.png'
    document.getElementById('gamespace').removeEventListener('mousedown', faceOoo )
    document.getElementById('gamespace').removeEventListener('mouseup', faceUp )

    for (i in tileList) {
        document.getElementById(tileList[i]).removeEventListener('click', click)
        document.getElementById(tileList[i]).removeEventListener('contextmenu', flag)
    }
}

function returnImage(id) {
    x = id.toString().split('_')
    x[0] = parseInt(x[0])
    x[1] = parseInt(x[1])
    if ((numberList[((x[0]) + (x[1] * (columns)))]) > 0) {
        imgSrc = '/images/' + (numberList[((x[0]) + (x[1] * (columns)))]) + '.png'
    }else {
        imgSrc = '/images/empty.png'
    }

    return imgSrc
}

function faceDown() {
    document.getElementById('face').src = '/images/faceDown.png'
    reset()
}
function faceUp() {
    document.getElementById('face').src = '/images/face.png'
}
function faceOoo() {
    document.getElementById('face').src = '/images/faceOoo.png'
}

function reset() {
    firstClick = true;

    bombList = []
    tileList = []
    clearedTiles = 0
    flags = bombs

    numberList = []
    numberList.length = rows * columns
    numberList.fill(0)

    safe = []
    flagList = []

    document.getElementById('gamespace').innerHTML = ''

    clearInterval(timeInterval)
    document.getElementById('time0').src = '/images/-s.png'
    document.getElementById('time1').src = '/images/-s.png'
    document.getElementById('time2').src = '/images/-s.png'

    updateFlag()

    generateField()
}

function updateFlag() {
    flags = flags.toString()

    switch (flags[flags.length - 3]) {
        case undefined:
            document.getElementById('flags0').src = '/images/0s.png'
            break
        default:
            document.getElementById('flags0').src = '/images/' + flags[flags.length - 3] + 's.png'
    }
    switch (flags[flags.length - 2]) {
        case undefined:
            document.getElementById('flags1').src = '/images/0s.png'
            break
        default:
            document.getElementById('flags1').src = '/images/' + flags[flags.length - 2] + 's.png'
    }
    switch (flags[flags.length - 1]) {
        case undefined:
            document.getElementById('flags2').src = '/images/0s.png'
            break
        default:
            document.getElementById('flags2').src = '/images/' + flags[flags.length - 1] + 's.png'
    }
}

function timeStart() {
    document.getElementById('time0').src = '/images/0s.png'
    document.getElementById('time1').src = '/images/0s.png'
    document.getElementById('time2').src = '/images/0s.png'
    time = 1

    timeInterval = setInterval(function() {
        time = time.toString()

        switch (time[time.length - 3]) {
            case undefined:
                break
            default:
                document.getElementById('time0').src = '/images/' + time[time.length - 3] + 's.png'
        }
        switch (time[time.length - 2]) {
            case undefined:
                break
            default:
                document.getElementById('time1').src = '/images/' + time[time.length - 2] + 's.png'
        }
        switch (time[time.length - 1]) {
            case undefined:
                break
            default:
                document.getElementById('time2').src = '/images/' + time[time.length - 1] + 's.png'
        }

        time++
    }, 1000)
}

document.addEventListener("DOMContentLoaded", generateField())