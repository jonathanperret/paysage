void setup() {
  size(600,600);

  background(0,0);
  noStroke();
  fill(240,0,0,20);
}

void draw() {
  background(255,0);
  ellipse(150,200+200*sin(millis()/100.0),150,200);
}

