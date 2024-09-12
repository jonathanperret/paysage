let c;

function setup() {
    createCanvas(600, 400);
    noStroke();

    c = new Type1(int(random(255)), 0x55);
    c.position = new JVector(width / 2, height / 2);
}

function draw() {
    clear();
    fill(0);

    c.think();
    c.draw();
}

function rotl(x, n) {
    return ((x << n) | ((x >>> (8 - n)) & 0xff)) & 0xff;
}

class JVector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(v) {
        this.x += v.x;
        this.y += v.y;
    }

    mult(f) {
        this.x *= f;
        this.y *= f;
    }

    mag() {
        return sqrt(this.x * this.x + this.y * this.y);
    }
}

class Creature {
    constructor(mwidth, mheight, bitmasks) {
        this.skale = 10;
        this.mwidth = mwidth;
        this.mheight = mheight;
        this.angle = 0;
        this.position = new JVector(0, 0);
        this.speed = new JVector(0, 0);
        this.bitmasks = bitmasks;
    }

    think() {
        if (this.speed.mag() < 0.1) {
            this.speed = new JVector(random(-10, 10), random(-10, 10));

            if ((this.position.x < 150 && this.speed.x < 0) || (this.position.x > width - 150 && this.speed.x > 0)) {
                this.speed.x *= -1;
            }

            if ((this.position.y < 150 && this.speed.y < 0) || (this.position.y > height - 150 && this.speed.y > 0)) {
                this.speed.y *= -1;
            }
        }

        this.position.add(this.speed);
        this.speed.mult(0.95);
        this.angle += 0.02 * this.speed.x;
    }

    draw() {
        push();
        translate(this.position.x, this.position.y);
        scale(this.skale);
        rotate(this.angle);
        for (let y = 0; y < this.mheight; y++)
            for (let x = 0; x < this.mwidth; x++) {
                let bits = this.bitmasks[y * this.mwidth + x];
                push();
                translate(1 + 2 * x - this.mwidth, 1 + 2 * y - this.mheight);
                drawAtom(bits);
                pop();
            }
        pop();
    }
}

class Type1 extends Creature {
    constructor(a, b) {
        super(3, 3, [a, 0, rotl(a, 6), 0, b, 0, rotl(a, 2), 0, rotl(a, 4)]);
    }
}

function drawAtom(bits) {
    if (0 != (bits & 1)) triangle(0.029, 0.07, 0.029, 0.97, 0.929, 0.97);
    if (0 != (bits & 2)) triangle(0.07, 0.029, 0.97, 0.929, 0.97, 0.029);
    if (0 != (bits & 4)) triangle(0.07, -0.029, 0.97, -0.029, 0.97, -0.929);
    if (0 != (bits & 8)) triangle(0.029, -0.07, 0.929, -0.97, 0.029, -0.97);
    if (0 != (bits & 16)) triangle(-0.029, -0.07, -0.029, -0.97, -0.929, -0.97);
    if (0 != (bits & 32)) triangle(-0.07, -0.029, -0.97, -0.929, -0.97, -0.029);
    if (0 != (bits & 64)) triangle(-0.07, 0.029, -0.97, 0.029, -0.97, 0.929);
    if (0 != (bits & 128)) triangle(-0.029, 0.07, -0.929, 0.97, -0.029, 0.97);
}