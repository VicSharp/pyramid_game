let dominoTest = document.getElementById('dominoTest');
let pyramid = document.getElementsByClassName('wrapper');

function renderPyramid() {
    let newElement = null;

    for (let i = 0; i < pyramid.length; i++)
        for (let j = 0; j <= i; j++) {
            newElement = document.createElement('img');
            newElement.src = "img/domino/reverse_side.jpg";
            pyramid[i].appendChild(newElement);
        }
}

renderPyramid();

function createDomino() {
    let random = () => Math.floor(Math.random() * 7);
    let firstSegment = random(), secondSegment = random();
    let segments = firstSegment > secondSegment ? [secondSegment, firstSegment] : [firstSegment, secondSegment];
    let domino = segments[0] + "-" + segments[1] + ".jpg";

    dominoTest.src = "img/domino/" + domino;
    dominoTest.classList.add('domino');
}

function findDomino(pyramid, domino) {
    for (let i = 0; i < pyramid.length; i++) {
        for (let j = 0; j < pyramid[i].children.length; j++) {
            if (pyramid[i].children[j].src.search(domino) !== -1) {
                return {
                    domElement: pyramid[i].children[j],
                    row: i,
                    column: j,
                    firstSegment: Number(pyramid[i].children[j].src.match(/\d(?=-)/)[0]),
                    secondSegment: Number(pyramid[i].children[j].src.match(/\d(?=.jpg)/)[0]),
                };
            }
        }
    }

    return null;
}

function insertDomino(pyramid, row, column) {
    createDomino();

    while (findDomino(pyramid, dominoTest.src))
        createDomino(pyramid, row, column);

    pyramid[row].children[column].src = dominoTest.src;
    pyramid[row].children[column].classList = dominoTest.classList;
}

function initializationPyramid() {
    insertDomino(pyramid, 0, 0);

    for (let i = 0; i < pyramid[6].children.length; i++) {
        insertDomino(pyramid, 6, i);
    }
}

initializationPyramid();

//----------------------------------------------------------------------------------------------------------------------
function Game() {
    let count = 0;
    let currentPair = [];

    this.selectDomino = function (pyramid, domino) {
        if (domino.src.search('reverse_side') == -1) {
            domino.style.opacity = 0.6;
            currentPair.push(domino);
            calculationAmountDominoes();
        }
    };

    function calculationAmountDominoes() {
        if (currentPair.length == 2) {
            let firstDomino = findDomino(pyramid, currentPair[0].src),
                secondDomino = findDomino(pyramid, currentPair[1].src),
                sum = firstDomino.firstSegment + firstDomino.secondSegment + secondDomino.firstSegment + secondDomino.secondSegment;

            if (sum == 12 && firstDomino.domElement.src != secondDomino.domElement.src) {
                count++;
                firstDomino.domElement.style.visibility = secondDomino.domElement.style.visibility = 'hidden';
                flipTop(pyramid, firstDomino.row, firstDomino.column);
                flipTop(pyramid, secondDomino.row, secondDomino.column);
                flipBottom(pyramid, firstDomino.row, firstDomino.column);
                flipBottom(pyramid, secondDomino.row, secondDomino.column);
            }

            resetCurrentPair();
        }
    }

    function resetCurrentPair() {
        for (let i = 0; i < currentPair.length; i++)
            currentPair[i].style.opacity = 1.0;

        currentPair = [];
    }

    function flipTop(pyramid, row, column) {
        if (row != 6) {
            if (column == 0)
                insertDomino(pyramid, row + 1, column);

            if (column == pyramid[row].children.length - 1)
                insertDomino(pyramid, row + 1, column + 1);

            for (let i = 1; i < pyramid[row + 1].children.length - 1; i++)
                if (pyramid[row].children[i - 1].style.visibility == 'hidden' && pyramid[row].children[i].style.visibility == 'hidden')
                    insertDomino(pyramid, row + 1, i);
        }
    }

    function flipBottom(pyramid, row, column) {
        if (row != 0) {
            if (column != pyramid[row].children.length - 1)
                if (pyramid[row].children[column + 1].style.visibility == 'hidden')
                    insertDomino(pyramid, row - 1, column);

            if (column != 0)
                if (pyramid[row].children[column - 1].style.visibility == 'hidden')
                    insertDomino(pyramid, row - 1, column - 1)
        }
    }
}

let game = new Game();

function play(event) {
    let target = event.target;

    while (target != this) {
        if (target.tagName == 'IMG') {
            game.selectDomino(pyramid, target);

            return;
        }

        target = target.parentNode;
    }
}

//----------------------------------------------------------------------------------------------------------------------
board.onclick = play;