function setup() {
    createCanvas(600, 400);
    noLoop(); // Stops draw from continuously executing
}

function draw() {
    clear();
    noStroke();

    // EARS
    fill(0, 0, 0);
    ellipse(200, 100, 100, 85);
    ellipse(400, 100, 100, 85);

    // HEAD
    fill(0, 0, 0);
    ellipse(300, 200, 240, 240);

    // MOUTH
    fill(255, 255, 255);
    ellipse(300, 250, 110, 15);

    // CHEEKS
    let teinteDeRouge = abs(sin(millis() / 1000.0)) * 255;
    fill(teinteDeRouge, 90, 90, 127);
    ellipse(220, 240, 26, 25);
    ellipse(380, 240, 26, 25);

    // WHITE EYES
    fill(255, 255, 255);
    ellipse(250, 170, 50, 85);
    ellipse(350, 170, 50, 85);

    // PUPILS EYES
    translate(0, abs(sin(millis() / 2000.0)) * 40);
    fill(0, 0, 0);
    ellipse(250, 170, 20, 20);
    ellipse(350, 170, 20, 20);
}