//Pre-load assets for smooth images
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
	]
	for (i in sources) {
		image = document.createElement('img')
		image.src = sources[i]
	}
})()

// Adjacent tiles

var cord = [[-1, -1], [0, -1], [+1, -1],
			[-1,  0],          [+1, 0],
			[-1, +1], [0, +1], [+1, +1]]

// Global list

var objects = {
	face: document.getElementById('face'),
	gamespace: document.getElementById('gamespace')
}

// Add listeners

function addListeners() {
	objects.gamespace.oncontextmenu = function() { return false; }

	objects.gamespace.addEventListener('mousedown', faceOoo )
	objects.gamespace.addEventListener('mouseup', faceUp )

	objects.face.addEventListener('mousedown', faceDown )
	objects.face.addEventListener('mouseup', faceUp )
}

function faceDown() {
	objects.face.className = 'faceDown'
	initiateVariables()
}

function faceUp() {
	objects.face.className = 'faceUp'
}

function faceOoo() {
	objects.face.className = 'faceOoo'
}

//Generate the tile field
function generateField() {
	//Iterate through rows
	for (y = 0; y < rows; y++){

		let row = document.createElement('div')
		row.className = 'row'
		row.id = 'row'
		objects.gamespace.appendChild(row)

		for (x = 0; x < columns; x++) {

			let tile = document.createElement('img')
			tile.src = 'images/tile.png'
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
			document.getElementById(event.target.id).src = 'images/tile.png'
			updateFlag()
			return null
		}
	}
	flagList.push(event.target.id)
	document.getElementById(event.target.id).src = 'images/flag.png'
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
		document.getElementById(bombList[i]).src = 'images/flag.png'
	}
	objects.face.src = 'images/faceWin.png'
}

function loss(id) {
	clearInterval(secondInterval)
	for (i in bombList) {
		document.getElementById(bombList[i]).src = 'images/bomb.png'
	}
	document.getElementById(id).src = 'images/bombRed.png'

	objects.face.src = 'images/faceLoss.png'
	objects.gamespace.removeEventListener('mousedown', faceOoo )
	objects.gamespace.removeEventListener('mouseup', faceUp )

	for (i in tileList) {
		document.getElementById(tileList[i]).removeEventListener('click', click)
		document.getElementById(tileList[i]).removeEventListener('contextmenu', flag)
	}
}

function returnImage(id) {
	let x = id.toString().split('_')
		x[0] = parseInt(x[0])
		x[1] = parseInt(x[1])

	if ((numberList[((x[0]) + (x[1] * (columns)))]) > 0) {
		imgSrc = 'images/' + (numberList[((x[0]) + (x[1] * (columns)))]) + '.png'
	}else {
		imgSrc = 'images/empty.png'
	}

	return imgSrc
}

function updateFlag() {
	flags = flags.toString()

	switch (flags[flags.length - 3]) {
		case undefined:
			document.getElementById('flags0').src = 'images/0s.png'
			break
		default:
			document.getElementById('flags0').src = 'images/' + flags[flags.length - 3] + 's.png'
	}
	switch (flags[flags.length - 2]) {
		case undefined:
			document.getElementById('flags1').src = 'images/0s.png'
			break
		default:
			document.getElementById('flags1').src = 'images/' + flags[flags.length - 2] + 's.png'
	}
	switch (flags[flags.length - 1]) {
		case undefined:
			document.getElementById('flags2').src = 'images/0s.png'
			break
		default:
			document.getElementById('flags2').src = 'images/' + flags[flags.length - 1] + 's.png'
	}
}

function timeStart() {
	document.getElementById('time0').src = 'images/0s.png'
	document.getElementById('time1').src = 'images/0s.png'
	document.getElementById('time2').src = 'images/0s.png'
	time = 1

	secondInterval = setInterval( () => {
		time = time.toString()

		switch (time[time.length - 3]) {
			case undefined:
				break
			default:
				document.getElementById('time0').src = 'images/' + time[time.length - 3] + 's.png'
		}
		switch (time[time.length - 2]) {
			case undefined:
				break
			default:
				document.getElementById('time1').src = 'images/' + time[time.length - 2] + 's.png'
		}
		switch (time[time.length - 1]) {
			case undefined:
				break
			default:
				document.getElementById('time2').src = 'images/' + time[time.length - 1] + 's.png'
		}

		time++
	}, 1000)
}

function initiateVariables() {
	rows = 19
	columns = 30
	bombs = 99

	firstClick = true

	bombList = []
	tileList = []
	numberList = []
	safe = []
	flagList = []

	clearedTiles = 0
	flags = bombs

	numberList.length = rows * columns
	numberList.fill(0)

	objects.gamespace.innerHTML = ''
	document.getElementById('time0').className = 'noneSeconds'
	document.getElementById('time1').className = 'noneSeconds'
	document.getElementById('time2').className = 'noneSeconds'

	try {
		clearInterval(secondInterval)
	}
	catch (err) {}

	updateFlag()

	generateField()

	addListeners()
}

document.addEventListener("DOMContentLoaded", initiateVariables())