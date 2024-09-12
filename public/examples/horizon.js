let area = {};
let duree = 5000;
let journee = [
    color(11, 74, 150),  // NUIT
    color(245, 152, 59), // LEVER
    color(31, 167, 255), // JOUR
    color(255, 31, 102)  // COUCHER
];

function setup() {
    createCanvas(windowWidth, windowHeight);
    noStroke();
    ellipseMode(CENTER);
}

function draw() {
    // Multiscreen management
    let hashParams = window.location.hash.slice(1).split('&');
    hashParams.forEach(pair => {
        let keyValue = pair.split('=');
        area[keyValue[0]] = parseInt(keyValue[1]);
    });

    let w = area.w || windowWidth;
    let h = area.h || windowHeight;
    let x = area.x || 0;
    let y = area.y || 0;

    translate(-x, -y);
    resizeCanvas(w, h);  // Resizes canvas based on screen area

    let t = millis();
    let i = Math.round(-0.5 + t / (duree * 2)) % journee.length;
    let degrade = t % (2 * duree) > duree;

    let skyColor;
    if (degrade) {
        let j = (i + 1) % journee.length;
        let pourc = (t % duree) / duree;
        skyColor = lerpColor(journee[i], journee[j], pourc);
    } else {
        skyColor = journee[i];
    }

    sky(skyColor);
    let course = -map(t, 0, duree, 0, PI / 4) + (PI * 1.5);
    sunmoon(course, w, h);
}

function sunmoon(course, w, h) {
    let sun = createVector(0, 0);
    let moon = createVector(0, 0);
    let centre = createVector(w / 2, h / 2);
    let rayon = w / 2;

    // SUN
    fill(255, 40);
    sun.x = centre.x + rayon * -cos(course);
    sun.y = centre.y + rayon * -sin(course);

    moon.x = centre.x + rayon * cos(course);
    moon.y = centre.y + rayon * sin(course);

    ellipse(sun.x, sun.y, w * 0.75, w * 0.75);
    ellipse(moon.x, moon.y, w * 0.25, w * 0.25);
}

function sky(c) {
    background(c, 240);
}