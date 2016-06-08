// setting multiscreen variables
// usage: http://www.paysage.xyz/playground/test#w=1000&h=500&x=500&y=250 to render the lower right part of the virtual canvas
var area = {};
var width = externals.canvas.width;
var height = externals.canvas.height;
// end multiscreen variables

float duree = 5000;

color[] journee = {
  color(11, 74, 150), //NUIT
  color(245, 152, 59), //LEVER
  color(31, 167, 255), //JOUR
  color(255, 31, 102)  //COUCHER
};

void setup() {
  background(0);
  noStroke();

  ellipseMode(CENTER);
}

void draw() {
  // multiscreen management
  window.location.hash
    .slice(1).split('&').forEach(
        function(pair){var keyValue=pair.split('='); area[keyValue[0]]=keyValue[1];});

  width = area.w || externals.canvas.width;
  height = area.h || externals.canvas.height;

  translate(-area.x || 0,-area.y || 0);
  // end multiscreen management

  int t = millis();

  int i = Math.round(-0.5+t/(duree*2)) % journee.length;
  bool degrade = t%(2*duree) > duree;

  color skyColor;
  if (degrade) {
    int j = (i+1)%journee.length;
    float pourc = (t % duree)/duree;
    skyColor = lerpColor(journee[i], journee[j], pourc);
  } else {
    skyColor = journee[i];
  }

  sky(skyColor);
  float course = -map(t, 0, duree, 0, PI/4)+(PI*1.5);
  sunmoon(course);
}

void sunmoon(float course) {
  PVector sun = new PVector(0, 0);
  PVector moon = new PVector(0, 0);
  PVector centre = new PVector(width/2, height/2);
  float rayon = width/2;

  //SUN

  fill(255, 40);

  sun.x = centre.x + rayon*-cos(course);
  sun.y = centre.y + rayon*-sin(course);

  moon.x = centre.x + rayon*cos(course);
  moon.y = centre.y + rayon*sin(course);

  ellipse(sun.x, sun.y, width*0.75, width*0.75);
  ellipse(moon.x, moon.y, width*0.25, width*0.25);
}

void sky(color c) {
  fill(c);
  rect(0, 0, width, height);
}
