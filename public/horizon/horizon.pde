// setting multiscreen variables
// usage: http://www.paysage.xyz/playground/test#w=1000&h=500&x=500&y=250 to render the lower right part of the virtual canvas
var width=externals.canvas.width ; 
var height=externals.canvas.height ;   
var area = {};
// end multiscreen variables



float duree = 5000;

color[] journee = {
  color(11, 74, 150), //NUIT 
  color(245, 152, 59), //LEVER
  color(31, 167, 255), //JOUR
  color(255, 31, 102)  //COUCHER
};

color result;
float pourc = 0;
int i = 0;
int j = i+1;

float course = 0;
boolean degrade = false;
float current = 0;

float rayon;
PVector sun, moon, centre;

void setup() {
  background(0);
  noStroke();

  ellipseMode(CENTER);

  sun = new PVector(0, 0);
  moon = new PVector(0, 0);
  centre = new PVector(width/3, height);
  rayon = width/2;
  course = 0;
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
  
  course = -map(millis(), 0, duree, 0, PI/4)+(PI*1.5);

  if (millis() > current+duree) {
    if (degrade) {
      if (i < journee.length-2) {
        i++;
        j = i+1;
      } else if(i<journee.length-1) {
        i++;
        j = 0;
      } else {
        i = 0;
        j = i+1;
      }
      degrade = false;
    } else { 
      degrade = true;
    }
    current = millis();
  }

  if (degrade) {
    pourc = map(millis(), current, current+duree, 0, 1);
    result = lerpColor(journee[i], journee[j], pourc);
  } else {
    result = journee[i];
  }

  sky(result);
  sunmoon();
}

void sunmoon() {
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