(() => {
    let sources = [
        'images/-s.png',
        'images/0s.png',
        'images/1s.png',
        'images/2s.png',
        'images/3s.png',
        'images/4s.png',
        'images/5s.png',
        'images/6s.png',
        'images/7s.png',
        'images/8s.png',
        'images/9s.png',
        'images/1.png',
        'images/2.png',
        'images/3.png',
        'images/4.png',
        'images/5.png',
        'images/6.png',
        'images/7.png',
        'images/8.png',
        'images/bomb.png',
        'images/bombRed.png',
        'images/empty.png',
        'images/flag.png',
        'images/tile.png',
        'images/wall.png',
        'images/wall2.png',
        'images/background.png'
    ];
    for (let i in sources) {
        let image = document.createElement('img');
        image.src = sources[i]
    }
})();

let rows, columns, bombs, clicks, cleared_tiles, flags = 0;

let bomb_list, tiles, number_list, safe_area, flag_list = [];

let time_interval;

let face = document.getElementById('face');
let gamespace = document.getElementById('gamespace');


function init() {
    rows = 19;
    columns = 30;
    bombs = 99;
    flags = bombs;

    clicks = 0;
    cleared_tiles = 0;

    bomb_list = [];
    tiles = [];
    number_list = [];
    safe_area = [];
    flag_list = [];

    number_list.length = rows * columns;

    gamespace.innerHTML = '';
    face.className = 'faceUp';

    document.getElementById('time0').className = 'noneSeconds';
    document.getElementById('time1').className = 'noneSeconds';
    document.getElementById('time2').className = 'noneSeconds';

    clearInterval(time_interval);

    updateFlag();

    generateField();

    addListeners();
}

let adjacent_tiles = [[-1, -1], [0, -1], [+1, -1],
    [-1, 0], [+1, 0],
    [-1, +1], [0, +1], [+1, +1]];

function addListeners() {
    gamespace.oncontextmenu = function () {
        return false;
    };

    gamespace.addEventListener('mousedown', face.className = 'faceOoo');
    gamespace.addEventListener('mouseup', face.className = 'faceUp');

    face.addEventListener('mousedown', faceDown);
    face.addEventListener('mouseup', face.className = 'faceUp')
}

function faceDown() {
    face.className = 'faceDown';
    init()
}

function generateField() {
    for (let y = 0; y < rows; y++) {
        let row = document.createElement('div');
        row.className = 'row';
        row.id = 'row';
        gamespace.appendChild(row);

        for (let x = 0; x < columns; x++) {

            let tile = document.createElement('img');
            tile.src = 'images/tile.png';
            tile.id = x + '_' + y;

            tiles.push(tile.id);

            document.getElementById('row').appendChild(tile);

            document.getElementById(tile.id).addEventListener('click', click);

            document.getElementById(tile.id).addEventListener('contextmenu', flag)

        }
        row.id = ''
    }
    updateFlag()
}

function generateMines(id) {
    for (let z = 0; z < bombs; z++) {
        let bombId = Math.floor(Math.random() * (columns - 1)) + '_' + Math.floor(Math.random() * (rows - 1));

        // If a bomb has the ID as another bomb, regenerate that bomb
        bombId = bombId.toString();
        for (let i in bomb_list) {
            while (bomb_list[i] === bombId) {
                bombId = (Math.floor(Math.random() * (columns - 1)) + '_' + (Math.floor(Math.random() * (rows - 1))))
            }
        }
        bomb_list.push(bombId)
    }

    // If a bomb falls within the safe_area area, regenerate all bombs
    for (let c in bomb_list) {
        for (let f in safe_area) {
            if (bomb_list[c] === safe_area[f]) {
                generateMines(id);
                return null
            }
        }
    }

    // For each bomb, add a value to the tiles around it
    for (let z in bomb_list) {
        addValue(bomb_list[z]);
        document.getElementById(bomb_list[z]).classList.add('bomb')
    }
}

function addValue(id) {
    //For each adjacent tile add a value to the corresponding array position
    for (let i in adjacent_tiles) {
        let x = id.toString().split('_');
        x[0] = parseInt(x[0]) + parseInt(adjacent_tiles[i][0]);
        x[1] = parseInt(x[1]) + parseInt(adjacent_tiles[i][1]);
        if (x[0] >= 0 && x[0] < columns && x[1] >= 0 && x[1] < rows) {
            //(x) + ((columns - 1) * y)
            number_list[(x[0]) + ((columns) * x[1])] += 1;
            x = x.join('_');
            document.getElementById(x).classList.add('nearby')
        }
    }
}

// Listeners

function click(event) {
    if (firstClick === true) {
        safe_area.push(event.target.id);
        for (let i in adjacent_tiles) {
            let x = event.target.id.toString().split('_');
            x[0] = parseInt(x[0]) + parseInt(adjacent_tiles[i][0]);
            x[1] = parseInt(x[1]) + parseInt(adjacent_tiles[i][1]);
            if (x[0] >= 0 && x[0] < columns && x[1] >= 0 && x[1] < rows) {
                x = x.join('_');
                safe_area.push(x)
            }
        }

        generateMines(event.target.id);

        reveal(event.target.id);

        timeStart();

        firstClick = false
    } else {
        reveal(event.target.id);

        checkWin(event.target.id)
    }
}

function flag(event) {
    if (document.getElementById(event.target.id).classList.contains('display')) {
        return null
    }
    for (let i in flag_list) {
        if (flag_list[i] === event.target.id) {
            flag_list.splice(i, 1);
            flags++;
            document.getElementById(event.target.id).src = 'images/tile.png'
            updateFlag();
            return null
        }
    }
    flag_list.push(event.target.id)
    document.getElementById(event.target.id).src = 'images/flag.png'
    flags--;
    updateFlag()
}

function reveal(id) {
    for (let i in flag_list) {
        if (flag_list[i] === id) {
            return null
        }
    }

    for (let i in bomb_list) {
        if (bomb_list[i] === id) {
            loss(id);
            return null
        }
    }

    if (document.getElementById(id).classList.contains('display')) {
        return null
    }
    document.getElementById(id).classList.add('display');
    document.getElementById(id).src = returnImage(id);
    cleared_tiles++;

    //check for empty squares
    //if square is blank empty it
    //if square has no number empty the squares around it

    if (document.getElementById(id).classList.contains('nearby')) {
        document.getElementById(id).src = returnImage(id);
        return null
    }

    for (let i in adjacent_tiles) {
        let x = id.toString().split('_');
        x[0] = parseInt(x[0]) + parseInt(adjacent_tiles[i][0]);
        x[1] = parseInt(x[1]) + parseInt(adjacent_tiles[i][1]);
        if (x[0] >= 0 && x[0] < columns && x[1] >= 0 && x[1] < rows) {
            x = x.join('_');
            if (!document.getElementById(x).classList.contains('display') &&
                !document.getElementById(x).classList.contains('bomb')) {
                reveal(x)
            }
        }
    }
}

function checkWin() {
    if (cleared_tiles === (tiles.length - bomb_list.length)) {
        win();
        return null
    }
}

function win() {
    for (let i in bomb_list) {
        document.getElementById(bomb_list[i]).src = 'images/flag.png'
    }
    face.src = 'images/faceWin.png'
}

function loss(id) {
    clearInterval(time_interval);
    for (let i in bomb_list) {
        document.getElementById(bomb_list[i]).src = 'images/bomb.png'
    }
    document.getElementById(id).src = 'images/bombRed.png';

    face.className = 'faceLoss';
    gamespace.removeEventListener('mousedown', faceOoo);
    gamespace.removeEventListener('mouseup', faceUp);

    for (let i in tiles) {
        document.getElementById(tiles[i]).removeEventListener('click', click)
        document.getElementById(tiles[i]).removeEventListener('contextmenu', flag)
    }
}

function returnImage(id) {
    let x = id.toString().split('_');
    let imgSrc = '';
    x[0] = parseInt(x[0]);
    x[1] = parseInt(x[1]);

    if ((number_list[((x[0]) + (x[1] * (columns)))]) > 0) {
        imgSrc = 'images/' + (number_list[((x[0]) + (x[1] * (columns)))]) + '.png'
    } else {
        imgSrc = 'images/empty.png'
    }

    return imgSrc
}

function updateFlag() {
    flags = flags.toString();

    switch (flags[flags.length - 3]) {
        case undefined:
            document.getElementById('flags0').src = 'images/0s.png';
            break;
        default:
            document.getElementById('flags0').src = 'images/' + flags[flags.length - 3] + 's.png'
    }
    switch (flags[flags.length - 2]) {
        case undefined:
            document.getElementById('flags1').src = 'images/0s.png';
            break;
        default:
            document.getElementById('flags1').src = 'images/' + flags[flags.length - 2] + 's.png'
    }
    switch (flags[flags.length - 1]) {
        case undefined:
            document.getElementById('flags2').src = 'images/0s.png';
            break;
        default:
            document.getElementById('flags2').src = 'images/' + flags[flags.length - 1] + 's.png'
    }
}

function timeStart() {
    let time = 1;
    time_interval = setInterval( () => {
        time = '00' + time.toString();

        document.getElementById('time2').src = 'images/' + time[time.length - 1] + 's.png';
        document.getElementById('time1').src = 'images/' + time[time.length - 2] + 's.png';
        document.getElementById('time0').src = 'images/' + time[time.length - 3] + 's.png';

        time++
    }, 1000)
}

document.addEventListener('DOMContentLoaded', init);