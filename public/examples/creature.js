// Global Constants
// BODY
const atome = 0;
const serpent = 1;
const duo = 2;
const cristal = 3;
const crystal = 3;

// HAND
const losange = 0;
const cercle = 1;
const pyramide = 2;
const piramide = pyramide;
const etoile = 3;

// ARM SIZE
let bosse = 0;
let patte = 1;
let antenne = 2;
let tentacule = 3;

// ARM AMOUNT
let humain = 2;
let alien = 3;
let insecte = 6;
let poulpe = 8;

// COLOR PALETTES
let eau = 60;
let exotique = 1;
let foret = 25;
let nuit = 75;
let soleil = 14;
let gris = 0;

// TETE
let cyclope = 1;
let horrible = 8;

let macreature;

function setup() {
    createCanvas(windowWidth, windowHeight);
    stroke(0);
    strokeWeight(4);
    frameRate(30);

    colorMode(HSB, 100, 100, 100, 100);
    ellipseMode(CENTER);
    rectMode(CENTER);

    macreature = nouvelleCreature(atome)
        .yeux(1)
        .nombredebras(insecte)
        .tailledebras(patte)
        .formemain(etoile)
        .couleurs(89);
}

function draw() {
    clear();

    macreature.anime().draw();
}

function nouvelleCreature(corps) {
    switch (corps) {
        case atome:
            return new Atome();
        case serpent:
            return new Serpent();
        case duo:
            return new Duo();
        case crystal:
            return new Crystal();
        default:
            console.log('corps inconnu : ' + corps);
            return null;
    }
}

class Creature {
    constructor() {
        this.shortestDimention = min(width, height);
        this.strokeW = this.shortestDimention / 200;
        this.coeffsize = this.shortestDimention / 13.5;
        this.basespeed = this.shortestDimention / 100;

        strokeWeight(this.strokeW);

        this.widthedge = width - this.coeffsize;
        this.heightedge = height - this.coeffsize;

        this.loc = createVector(
            random(this.coeffsize, this.widthedge),
            random(this.coeffsize, this.heightedge)
        );
        this.vel = createVector(0, 0);
        this.acc = createVector(0, 0);

        this.target = createVector(
            random(this.coeffsize, this.widthedge),
            random(this.coeffsize, this.heightedge)
        );

        this.poids(0);
        this.nombredebras(humain);
        this.tailledebras(patte);
        this.couleurs(gris);
        this.formemain(cercle);
        this.yeux(cyclope);
    }

    poids(um_) {
        this.usermass = um_;
        return this;
    }

    tailledebras(tb_) {
        this.tb = tb_;
        return this;
    }

    nombredebras(nbb_) {
        this.nbb = nbb_;
        this.epaule = Array(this.nbb);
        this.arms = Array(this.nbb);

        for (let i = 0; i < this.nbb; i++) {
            this.epaule[i] = createVector(0, 0);
            this.arms[i] = new Child(width, height);
        }
        return this;
    }

    formemain(m_) {
        this.m = m_;
        return this;
    }

    couleurs(hue) {
        this.coFull = color(hue, 85, 80, 90);
        this.coFullS = color(hue, 100, 80, 90);
        this.coFullB = color(hue, 100, 40, 100);
        this.coHalf = color(hue, 55, 100, 75);
        this.coLow = color(hue, 30, 100, 90);
        this.coWhite = color(hue, 14, 100, 75);
        return this;
    }

    couleur(co_) {
        return this.couleurs(co_);
    }

    yeux(te_) {
        this.tt = te_;
        this.oeil = Array(this.tt);
        for (let k = 0; k < this.tt; k++) {
            let angleoeil = random(TWO_PI);
            this.oeil[k] = createVector(
                cos(angleoeil) * this.coeffsize / 4,
                sin(angleoeil) * this.coeffsize / 4
            );
        }
        return this;
    }

    anime() {
        let mass = 1 + this.tb / 30 - this.nbb / 30 + this.usermass / 2;
        let finalspeed = this.basespeed * mass;
        this.theta = this.vel.heading();

        let dir = p5.Vector.sub(this.target, this.loc);

        let maxforce = this.animeCorps(mass, finalspeed, dir);

        let steering = p5.Vector.sub(dir, this.vel);
        steering.limit(maxforce);
        this.applyForce(steering, mass);

        this.vel.add(this.acc);
        this.vel.limit(finalspeed);
        this.loc.add(this.vel);
        this.acc.mult(0);

        this.rebondis(finalspeed, mass);

        let armLength = this.tb * (this.coeffsize * this.coeffsize) / 80;
        for (let i = 0; i < this.nbb; i++) {
            this.att = new Attach(this.epaule[i].x, this.epaule[i].y, int(armLength));
            this.att.connect(this.arms[i]);
            this.att.constrainLength(this.arms[i], armLength, armLength, 0.69);
            this.arms[i].update();
        }
        return this;
    }

    rebondis(finalspeed, mass_) {
        let newVel = null;
        if (this.loc.x < this.coeffsize) {
            newVel = createVector(finalspeed, this.vel.y);
        } else if (this.loc.x > width - this.coeffsize) {
            newVel = createVector(-finalspeed, this.vel.y);
        }

        if (this.loc.y < this.coeffsize) {
            newVel = createVector(this.vel.x, finalspeed);
        } else if (this.loc.y > height - this.coeffsize) {
            newVel = createVector(this.vel.x, -finalspeed);
        }

        if (newVel != null) {
            newVel.normalize();
            newVel.mult(finalspeed);
            let dV = p5.Vector.sub(newVel, this.vel);
            let maxf = 1;
            dV.limit(maxf);
            this.applyForce(dV, mass_);
        }

        return this;
    }

    applyForce(dv, mass_) {
        this.acc.add(p5.Vector.div(dv, mass_));
    }

    drawTete() {
        let eyesize = this.coeffsize / 6;
        if (this.tt > 6) {
            eyesize = this.coeffsize / this.tt;
        }

        push();
        translate(this.visage.x, this.visage.y);
        rotate(noise(frameCount * 0.01) * TWO_PI);
        fill(this.coWhite);
        strokeWeight(this.strokeW / 1.5);
        ellipse(0, 0, this.coeffsize / 2, this.coeffsize / 2);
        fill(this.coFullB);
        noStroke();

        for (let k = 0; k < this.tt; k++) {
            ellipse(this.oeil[k].x, this.oeil[k].y, eyesize, eyesize);
        }
        pop();
        return this;
    }

    drawBras() {
        for (let i = 0; i < this.nbb; i++) {
            strokeWeight(this.strokeW / 2);
            stroke(this.coHalf);
            line(this.epaule[i].x, this.epaule[i].y, this.arms[i].loca.x, this.arms[i].loca.y);
        }
        return this;
    }

    drawMain() {
        let handsize = this.coeffsize / 5;
        strokeWeight(this.strokeW / 2);
        stroke(this.coFull);
        fill(this.coWhite);
        for (let i = 0; i < this.nbb; i++) {
            switch (this.m) {
                case losange:
                    push();
                    translate(this.arms[i].loca.x, this.arms[i].loca.y);
                    rotate(PI / 4);
                    rect(0, 0, handsize, handsize);
                    pop();
                    break;
                case cercle:
                    ellipse(this.arms[i].loca.x, this.arms[i].loca.y, handsize, handsize);
                    break;
                case pyramide:
                    beginShape();
                    let anglet = TWO_PI / 3;
                    for (let iii = 0; iii < 3; iii++) {
                        vertex(
                            handsize / 1.5 * sin(anglet * iii) + this.arms[i].loca.x,
                            handsize / 1.5 * cos(anglet * iii) + this.arms[i].loca.y
                        );
                    }
                    endShape(CLOSE);
                    break;
                case etoile:
                    let anglee = TWO_PI / 5;
                    for (let iii = 0; iii < 5; iii++) {
                        line(
                            this.arms[i].loca.x, this.arms[i].loca.y,
                            handsize / 1.5 * sin(anglee * iii) + this.arms[i].loca.x,
                            handsize / 1.5 * cos(anglee * iii) + this.arms[i].loca.y
                        );
                    }
                    break;
            }
        }
        return this;
    }

    draw() {
        strokeWeight(this.strokeW);
        stroke(this.coFullS);
        fill(this.coHalf);

        this.drawCorps().drawTete().drawBras().drawMain();
    }
}

class Atome extends Creature {
    constructor() {
        super();
    }

    animeCorps(mass, finalspeed, dir) {
        let dd = dir.mag();
        dir.normalize();

        if (dd < this.coeffsize * 2) {
            let ralenti = map(dd, 0, this.coeffsize * 2, 0, finalspeed);
            dir.mult(ralenti);
        } else {
            dir.mult(finalspeed);
        }

        if (dd <= this.coeffsize / 10) {
            this.target = createVector(
                random(this.coeffsize, this.widthedge),
                random(this.coeffsize, this.heightedge)
            );
        }

        let angle = TWO_PI / this.nbb;
        for (let i = 0; i < this.nbb; i++) {
            this.epaule[i] = createVector(
                this.coeffsize / 2 * sin(angle * i) + this.loc.x,
                this.coeffsize / 2 * cos(angle * i) + this.loc.y
            );
            let vtmp = createVector(1, 1);
            let thetaa = -angle * i + PI / 4;
            vtmp.rotate(thetaa);
            vtmp.normalize();
            vtmp.mult(1.1);
            this.arms[i].acce.add(vtmp);
        }

        this.visage = createVector(this.loc.x, this.loc.y);
        return 1;
    }

    drawCorps() {
        ellipse(this.loc.x, this.loc.y, this.coeffsize, this.coeffsize);
        return this;
    }
}

class Duo extends Creature {
    constructor() {
        super();
    }

    animeCorps(mass, finalspeed, dir) {
        let du = dir.mag();
        let r = 40;
        let amp = 12;
        let oscillate = createVector(r * cos(TWO_PI * frameCount / amp), r * sin(TWO_PI * frameCount / amp));

        if (du < this.coeffsize * 2) {
            dir.normalize();
            let ralenti = map(du, 0, this.coeffsize * 2, 0, finalspeed);
            dir.mult(ralenti);
        } else {
            dir.add(oscillate);
            dir.normalize();
            dir.mult(finalspeed);
        }

        if (du <= this.coeffsize / 2) {
            this.target = createVector(random(this.coeffsize, this.widthedge), random(this.coeffsize, this.heightedge));
        }

        let thetad = -this.theta;
        let radd = this.coeffsize * 0.8;

        for (let jj = 0; jj < this.nbb; jj++) {
            let xl = lerp(
                radd * sin(thetad + (13 * PI) / 12) + this.loc.x,
                radd * sin(thetad + (23 * PI) / 12) + this.loc.x,
                (1.0 / (this.nbb + 1)) * (jj + 1)
            );
            let yl = lerp(
                radd * cos(thetad + (13 * PI) / 12) + this.loc.y,
                radd * cos(thetad + (23 * PI) / 12) + this.loc.y,
                (1.0 / (this.nbb + 1)) * (jj + 1)
            );
            this.epaule[jj] = createVector(xl, yl);
        }

        this.visage = createVector(this.loc.x, this.loc.y);
        return 0.15;
    }

    drawCorps() {
        let thetad = -this.theta;
        let radd = this.coeffsize * 0.8;

        strokeCap(SQUARE);
        line(radd * sin(thetad + (11 * PI) / 12) + this.loc.x, radd * cos(thetad + (11 * PI) / 12) + this.loc.y,
            radd * sin(thetad + (PI) / 12) + this.loc.x, radd * cos(thetad + (PI) / 12) + this.loc.y);

        line(radd * sin(thetad + (13 * PI) / 12) + this.loc.x, radd * cos(thetad + (13 * PI) / 12) + this.loc.y,
            radd * sin(thetad + (23 * PI) / 12) + this.loc.x, radd * cos(thetad + (23 * PI) / 12) + this.loc.y);

        return this;
    }
}

class Serpent extends Creature {
    constructor() {
        super();
    }

    nombredebras(nbb_) {
        super.nombredebras(nbb_);

        this.sizeSnake = this.nbb + 1;
        this.epaule = Array(this.sizeSnake);
        this.snake = Array(this.sizeSnake);

        for (let i = 0; i < this.sizeSnake; i++) {
            this.snake[i] = new Child(this.loc.x + (i * 2), this.loc.y + (i * 2));
        }
        return this;
    }

    animeCorps(mass, finalspeed, dir) {
        let dddd = dir.mag();
        dir.normalize();

        if (dddd < this.coeffsize * 6) {
            this.target = createVector(random(0, width), random(0, height));
        }
        dir.mult(finalspeed);

        let segment = (this.coeffsize * 3) / this.sizeSnake;

        for (let j = 0; j < this.sizeSnake; j++) {
            let anc;
            if (j == 0) {
                anc = new Attach(this.loc.x, this.loc.y, int(segment / 1.1));
            } else {
                anc = new Attach(this.snake[j - 1].loca.x, this.snake[j - 1].loca.y, int(segment));
            }
            anc.connect(this.snake[j]);
            anc.constrainLength(this.snake[j], segment * 1.01, segment * 1.02, 0.69);
            this.snake[j].applyForce(this.snake[j].acce);
            this.snake[j].update();

            this.epaule[j] = createVector(this.snake[j].loca.x, this.snake[j].loca.y);
            let vtmp = this.vel.copy();
            let theta2 = vtmp.heading();
            vtmp.rotate(theta2);
            if (j % 2 == 0) {
                vtmp.rotate(PI / 2);
            } else {
                vtmp.rotate(-PI / 2);
            }
            vtmp.normalize();
            vtmp.mult(1);
            if (j < this.sizeSnake - 1) {
                this.arms[j].acce.add(vtmp);
            }
        }

        this.visage = createVector(this.loc.x, this.loc.y);
        return 0.1;
    }

    drawCorps() {
        noFill();
        beginShape();
        curveVertex(this.loc.x, this.loc.y);
        curveVertex(this.loc.x, this.loc.y);
        for (let j = 0; j < this.sizeSnake; j++) {
            curveVertex(this.snake[j].loca.x, this.snake[j].loca.y);
        }
        curveVertex(this.snake[this.sizeSnake - 1].loca.x, this.snake[this.sizeSnake - 1].loca.y);
        endShape();
        return this;
    }
}

class Crystal extends Creature {
    constructor() {
        super();
    }

    animeCorps(mass, finalspeed, dir) {
        strokeCap(ROUND);
        let ddd = dir.mag();
        dir.normalize();
        if (ddd < this.coeffsize * 2) {
            this.target = createVector(random(this.coeffsize, this.widthedge), random(this.coeffsize, this.heightedge));
        }
        dir.mult(finalspeed);

        let thetac = -this.theta;
        let rad = this.coeffsize * 0.8;

        for (let jj = 0; jj < this.nbb; jj++) {
            let xl = lerp(rad * sin(thetac + TWO_PI / 3) + this.loc.x, rad * sin(thetac + (3 * PI) / 2) + this.loc.x,
                (1.0 / (this.nbb + 1)) * (jj + 1));
            let yl = lerp(rad * cos(thetac + TWO_PI / 3) + this.loc.y, rad * cos(thetac + (3 * PI) / 2) + this.loc.y,
                (1.0 / (this.nbb + 1)) * (jj + 1));
            this.epaule[jj] = createVector(xl, yl);
            let vtmp = this.arms[jj].loca.copy();
            let thetaa = -thetac - PI / 2;
            vtmp.rotate(thetaa);
            vtmp.normalize();
            vtmp.mult(1);
            this.arms[jj].acce.add(vtmp);
        }

        this.visage = createVector(rad * 0.7 * sin(thetac + PI / 4) + this.loc.x, rad * 0.7 * cos(thetac + PI / 4) + this.loc.y);
        return 0.3;
    }

    drawCorps() {
        strokeCap(ROUND);

        let thetac = -this.theta;
        let rad = this.coeffsize * 0.8;
        beginShape();
        vertex(rad * sin(thetac + TWO_PI / 3) + this.loc.x, rad * cos(thetac + TWO_PI / 3) + this.loc.y);
        vertex(rad * sin(thetac + PI / 4) + this.loc.x, rad * cos(thetac + PI / 4) + this.loc.y);
        vertex((0.75 * rad) * sin(thetac + (10 * PI) / 6) + this.loc.x, (0.75 * rad) * cos(thetac + (10 * PI) / 6) + this.loc.y);
        vertex(rad * sin(thetac + (3 * PI) / 2) + this.loc.x, rad * cos(thetac + (3 * PI) / 2) + this.loc.y);
        endShape(CLOSE);
        return this;
    }
}

class Child {
    constructor(x, y) {
        this.loca = createVector(x, y); // Position of the child/arm
        this.velo = createVector(); // Velocity of the child/arm
        this.acce = createVector(); // Acceleration of the child/arm
        this.MASSE = 10;
        this.FRIC = 0.99; // Friction coefficient
    }

    // Standard Euler integration
    update() {
        this.velo.add(this.acce);
        this.velo.mult(this.FRIC);
        this.loca.add(this.velo);
        this.acce.mult(0); // Reset acceleration
    }

    applyForce(force) {
        let f = force.copy();
        f.div(this.MASSE); // Apply the force based on the mass
        this.acce.add(f);
    }
}

class Attach {
    constructor(x, y, l) {
        this.anchor = createVector(x, y); // Anchor point
        this.len = l; // Length of the "spring" attachment
    }

    connect(child) {
        let force = p5.Vector.sub(child.loca, this.anchor);
        force.normalize();
        force.mult(-1 * this.len);
        child.applyForce(force);
    }

    // Constrain the distance between bob and anchor within min and max range
    constrainLength(child, minlen, maxlen, inert) {
        let dir = p5.Vector.sub(child.loca, this.anchor);
        let d = dir.mag();

        // Is it too short?
        if (d < minlen) {
            dir.normalize();
            dir.mult(minlen);
            child.loca = p5.Vector.add(this.anchor, dir);
            child.velo.mult(inert); // Reduce velocity
        }
        // Is it too long?
        else if (d > maxlen) {
            dir.normalize();
            dir.mult(maxlen + (d - maxlen) / 2);
            child.loca = p5.Vector.add(this.anchor, dir);
            child.velo.mult(inert); // Reduce velocity
        }
    }
}
