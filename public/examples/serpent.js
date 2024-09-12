class Serpent {
    constructor() {
        this.loc = createVector(random(width), random(height));
        this.vel = createVector(5, 5);
        this.anneaux = [];
        this.maCouleur = color(0);
    }

    avance(vitesseMax, taille) {
        let acc = createVector(random(-1, 1), random(-1, 1));
        acc.normalize();

        this.vel.add(acc);
        this.vel.limit(vitesseMax);

        this.loc.add(this.vel);

        this.anneaux.push(createVector(this.loc.x, this.loc.y));
        if (this.anneaux.length > taille) {
            this.anneaux.shift();
        }
    }

    dessineToi() {
        beginShape();
        stroke(this.maCouleur);
        noFill(); // This creates a hollow shape, similar to fill(0, 0, 0, 0) in Processing.

        for (let i = 0; i < this.anneaux.length; i++) {
            let a = this.anneaux[i];
            curveVertex(a.x, a.y);
        }
        endShape();
    }

    rebondis() {
        if (this.loc.x > width || this.loc.x < 0) {
            if (this.loc.x > width) {
                this.loc.x = width;
            } else if (this.loc.x < 0) {
                this.loc.x = 0;
            }
            this.vel.x *= -1;
        }

        if (this.loc.y > height || this.loc.y < 0) {
            if (this.loc.y > height) {
                this.loc.y = height;
            } else if (this.loc.y < 0) {
                this.loc.y = 0;
            }
            this.vel.y *= -1;
        }
    }

    changeTaCouleur(rouge, vert, bleu) {
        this.maCouleur = color(rouge, vert, bleu);
    }
}

let monSerpent;

function setup() {
    createCanvas(windowWidth, windowHeight);
    stroke(0);
    strokeWeight(4);

    monSerpent = new Serpent();
}

function draw() {
    clear(); // Remove this for trailing effect.

    monSerpent.changeTaCouleur(0, 0, 0);
    monSerpent.avance(10, 10);
    monSerpent.rebondis();
    monSerpent.dessineToi();
}