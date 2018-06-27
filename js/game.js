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

function buildpiramid() {
    let piramid = [];

    renderPiramid(piramid);

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

    return new Domino(random(), random(), piramidElementDom);
}

function fillMainRows(piramid) {
    piramid[0][0] = generateDomino(piramid[0][0].dom);

    let domino = generateDomino(piramid[6][0].dom);

    for (let i = 0; i < piramid[6].length; i++) {
        while (existDomino(piramid, domino))
            domino = generateDomino(piramid[6][i].dom);

        piramid[6][i] = domino;
    }
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

let piramid = buildpiramid();

fillMainRows(piramid);

console.log(piramid);