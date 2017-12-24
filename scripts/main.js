let rows, columns, bombs, clicks, cleared_tiles, flags = 0;

let bomb_list, tiles, number_list, safe_area, flag_list = [];

let time_interval;

let face = document.getElementById('face');
let gamespace = document.getElementById('gamespace');


function init() {
    rows = document.getElementById('rows').value;
    columns = document.getElementById('columns').value;
    bombs = document.getElementById('bombs').value;
    flags = bombs;

    clicks = 0;
    cleared_tiles = 0;

    bomb_list = [];
    tiles = [];
    number_list = [];
    safe_area = [];
    flag_list = [];

    number_list.length = rows * columns;
    number_list.fill(0);

    gamespace.innerHTML = '';
    face.className = 'faceUp';

    document.getElementById('time0').setAttribute('time', '-');
    document.getElementById('time1').setAttribute('time', '-');
    document.getElementById('time2').setAttribute('time', '-');

    clearInterval(time_interval);

    update_flags();

    generateField();

    addListeners();
}

let adjacent_tiles = [
[-1, -1],  [0, -1],    [+1, -1],
[-1, 0],               [+1, 0],
[-1, +1],  [0, +1],    [+1, +1]
];

function addListeners() {
    console.log('adding list');

    gamespace.addEventListener('mousedown', change_face);
    gamespace.addEventListener('mouseup', change_face);
    gamespace.addEventListener('contextmenu', function (e) { e.preventDefault() });

    face.addEventListener('mousedown', faceDown);
    face.addEventListener('mouseup', () => { face.className = 'faceUp' });

}

function change_face(event) {
    if (event.type === 'mousedown' && event.button === 0) {
        face.className = 'faceOoo';
    } else {
        face.className = 'faceUp';
    }
}

function faceDown() {
    face.className = 'faceDown';
    init()
}

function generateField() {
    console.log('Generating field')
    for (let y = 0; y < rows; y++) {
        let row = document.createElement('div');
        row.className = 'row';
        row.id = 'row';
        gamespace.appendChild(row);

        for (let x = 0; x < columns; x++) {

            let tile = document.createElement('div');
            tile.className = 'tile';
            tile.id = x + '_' + y;

            tiles.push(tile.id);

            document.getElementById('row').appendChild(tile);

            document.getElementById(tile.id).addEventListener('click', click);

            document.getElementById(tile.id).addEventListener('contextmenu', flag)

        }
        row.id = ''
    }
    update_flags()
}

function random_mine() {
    return Math.floor(Math.random() * (columns)) + '_' + Math.floor(Math.random() * (rows));
}

function generate_mines(id) {
    console.log('Generating mines');

    for (let x = 0; x < bombs; x++) {
        console.log(`Generating mine ${x}`);
        let bomb_id = random_mine();

        for (let y = 0; y < bomb_list.length; y++) {
            while (bomb_list[y] === bomb_id.toString()) {
                console.log(`Regenerating duplicate mine ${bomb_list[y]}`);
                bomb_id = random_mine()
            }
        }
        bomb_list.push(bomb_id)
    }

    for (let x = 0; x < bomb_list.length; x++) {
        for (let y = 0; y < safe_area.length; y++) {
            while (bomb_list[x] === safe_area[y]) {
                console.log(`Regenerating mine ${bomb_list[x]}`);
                bomb_list[x] = random_mine()
            }
        }
    }

    for (let x = 0; x < bomb_list.length; x++) {
        addValue(bomb_list[x]);
        document.getElementById(bomb_list[x]).classList.add('bomb')
    }
}

function addValue(id) {
    for (let x = 0; x < adjacent_tiles.length; x++) {
        let i = id.toString().split('_');

        i[0] = parseInt(i[0]) + parseInt(adjacent_tiles[x][0]);
        i[1] = parseInt(i[1]) + parseInt(adjacent_tiles[x][1]);

        if (i[0] >= 0 && i[0] < columns && i[1] >= 0 && i[1] < rows) {
            number_list[(i[0]) + ((columns) * i[1])] += 1;
            console.log(number_list[(i[0]) + ((columns) * i[1])]);
            i = i.join('_');
            document.getElementById(i).classList.add('nearby')
        }
    }
}

function click(event) {
    if (clicks === 0) {
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

        generate_mines(event.target.id);

        reveal(event.target.id);

        start_time();
    } else {
        reveal(event.target.id);

        checkWin(event.target.id)
    }
    clicks++
}

function flag(event) {
    if (document.getElementById(event.target.id).classList.contains('display')) {
        return null
    }
    for (let i in flag_list) {
        if (flag_list[i] === event.target.id) {
            flag_list.splice(i, 1);
            flags++;
            document.getElementById(event.target.id).classList.toggle('flag');
            update_flags();
            return null
        }
    }
    if (flags <= 0) {
        return null
    }
    flag_list.push(event.target.id);
    document.getElementById(event.target.id).classList.toggle('flag');
    flags--;
    update_flags()
}

function reveal(id) {
    if (document.getElementById(id).classList.contains('display')) {
        return null
    }

    for (let flag in flag_list) {
        if (flag_list[flag] === id) {
            return null
        }
    }

    for (let bomb in bomb_list) {
        if (bomb_list[bomb] === id) {
            loss(id);
            return null
        }
    }

    document.getElementById(id).classList.add('display');
    document.getElementById(id).setAttribute('nearby', return_nearby(id));
    cleared_tiles++;

    //check for empty squares
    //if square is blank empty it
    //if square has no number empty the squares around it

    if (document.getElementById(id).classList.contains('nearby')) {
        document.getElementById(id).setAttribute('nearby', return_nearby(id));
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
        document.getElementById(bomb_list[i]).className = 'flag';
    }
    face.className = 'faceWin';
}

function loss(id) {
    clearInterval(time_interval);
    for (let x = 0; x < bomb_list.length; x++) {
        document.getElementById(bomb_list[x]).className = 'bomb-reveal';
    }
    document.getElementById(id).className = 'bomb-reveal-red';

    face.className = 'faceLoss';
    gamespace.removeEventListener('mousedown', change_face);
    gamespace.removeEventListener('mouseup', change_face);

    for (let x = 0; x < tiles.length; x++) {
        document.getElementById(tiles[x]).removeEventListener('click', click);
        document.getElementById(tiles[x]).removeEventListener('contextmenu', flag);
    }
}

function return_nearby(id) {
    let x = id.toString().split('_');
    let nearby;
    x[0] = parseInt(x[0]);
    x[1] = parseInt(x[1]);

    if ((number_list[((x[0]) + (x[1] * (columns)))]) > 0) {
        nearby = number_list[((x[0]) + (x[1] * (columns)))]
    } else {
        nearby = 'none'
    }

    return nearby
}

function update_flags() {
    flags = '00' + flags.toString();

    document.getElementById('flags2').setAttribute('time', flags[flags.length - 1]);
    document.getElementById('flags1').setAttribute('time', flags[flags.length - 2]);
    document.getElementById('flags0').setAttribute('time', flags[flags.length - 3]);
}

function start_time() {
    let time = 1;
    time_interval = setInterval( () => {
        time = '00' + time.toString();

        document.getElementById('time2').setAttribute('time', time[time.length - 1]);
        document.getElementById('time1').setAttribute('time', time[time.length - 2]);
        document.getElementById('time0').setAttribute('time', time[time.length - 3]);

        time++
    }, 1000)
}

document.addEventListener('DOMContentLoaded', init);