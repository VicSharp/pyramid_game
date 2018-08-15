class Domino {
    constructor(first, second, dom) {
        if (first > second) {
            let tmp = first;
            first = second;
            second = tmp;
        }

        this.firstSegment = first;
        this.secondSegment = second;
        this.dom = dom;

        first != null && second != null ? this.dom.src = "img/domino/" + first + "-" + second + ".jpg"
            : this.dom.src = "img/domino/reverse_side.jpg";
    }
}

function buildPiramid() {
    let piramid = [];

    renderPiramid(piramid);
    fillMainRows(piramid);

    return piramid;
}

function renderPiramid(piramid) {
    for (let i = 0; i < 7; i++) {
        piramid[i] = [];
        let wrappers = document.getElementsByClassName('wrapper');

        for (let j = 0; j <= i; j++) {
            piramid[i][j] = new Domino(null, null, wrappers[i].appendChild(document.createElement('img')));
        }
    }
}

function generateDomino(piramidElementDom) {
    let random = () => Math.floor(Math.random() * 7);
    let domino = new Domino(random(), random(), piramidElementDom);

    domino.dom.className += ' domino';

    return domino;
}

function fillMainRows(piramid) {
    piramid[0][0] = generateDomino(piramid[0][0].dom);

    for (let i = 0; i < piramid[6].length; i++) {
        insertDomino(piramid, 6, i);
    }
}

function insertDomino(piramid, rowIndex, colIndex) {
    let domino = generateDomino(piramid[rowIndex][colIndex].dom);

    while (existDomino(piramid, domino))
        domino = generateDomino(piramid[rowIndex][colIndex].dom);

    piramid[rowIndex][colIndex] = domino;
}

function existDomino(piramid, domino) {
    for (let i = 0; i < piramid.length; i++) {
        for (let j = 0; j < piramid[i].length; j++)
            if (piramid[i][j].firstSegment === domino.firstSegment && piramid[i][j].secondSegment === domino.secondSegment) {
                return true;
            }
    }
    return false;
}

function findDomino(piramid, domElement) {
    for (let i = 0; i < piramid.length; i++) {
        for (let j = 0; j < piramid[i].length; j++) {
            if (domElement.src == piramid[i][j].dom.src)
                return {
                    element: piramid[i][j],
                    row: i,
                    column: j
                };
        }
    }

    return null;
}

let piramid = buildPiramid();

class Pair {
    constructor() {
        this.reset();
    }

    reset() {
        this.count = this.sum = 0;
        this.domino = [];
    }

    selectDomino(domino) {
        this.domino.push(domino);
        this.count++;

        domino.dom.style.opacity == 1.0 || domino.dom.style.opacity == "" ? domino.dom.style.opacity = 0.5 : domino.dom.style.opacity = 1.0;

        if (this.count == 2) {
            this.sum = this.domino[0].firstSegment + this.domino[0].secondSegment + this.domino[1].firstSegment + this.domino[1].secondSegment;
            this.domino[0].dom.opacity = this.domino[1].dom.opacity = 1.0;

            if (this.sum == 12) {
                this.domino[0].dom.style.visibility = this.domino[1].dom.style.visibility = 'hidden';

                let firstDomino = findDomino(piramid, this.domino[0].dom);
                let secondDomino = findDomino(piramid, this.domino[1].dom);
                openedUp(piramid, firstDomino.row);
                openedUp(piramid, secondDomino.row);
                pairCount++;
            }
            else
                this.domino[0].dom.style.opacity = this.domino[1].dom.style.opacity = 1.0;

            this.reset();
        }
    }
}

function openedUp(piramid, row) {
    if (row == 0) {
        piramid[1][0] = insertDomino(piramid, 1, 0);
        piramid[1][1] = insertDomino(piramid, 1, 1);
    }

    if (0 < row && row < piramid.length) {
        if (piramid[row][0].dom.style.visibility == 'hidden')
            piramid[row + 1][0] = insertDomino(piramid, row + 1, 0);

        for (let i = 1; i < piramid[row + 1].length - 1; i++) {
            if (piramid[row][i].dom.style.visibility == 'hidden' && piramid[row][i + 1].dom.style.visibility == 'hidden') {
                piramid[row + 1][i] = insertDomino(piramid, row + 1, i);
            }
        }

        if (piramid[row][piramid[row].length - 1].dom.style.visibility == 'hidden')
            piramid[row + 1][piramid[row].length] = insertDomino(piramid, row + 1, piramid[row].length);
    }
}

let pair = new Pair();
let pairCount = 0;

function play(event) {
    let target = event.target;

    while (target != this) {
        if (target.tagName == 'IMG') {
            let domino = findDomino(piramid, target).element;

            if (domino.firstSegment !== null)
                pair.selectDomino(domino);

            return;
        }

        target = target.parentNode;
    }
}

board.onclick = play;