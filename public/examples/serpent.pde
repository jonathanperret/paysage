class Creature {
  PVector loc;
  PVector vel;
  PVector acc; 
  float topspeed;
  int rad;
  boolean once;
  ArrayList serpent = new ArrayList();
  int maxSerpent = 10;
  float noiseSeed = 0.1;

  Creature() {
    loc = new PVector(random(width), random(height));
    vel = new PVector();
    //acc = new PVector(-0.001, 0.01);
    topspeed = 5;
    rad = 10;
  }

  void avance(String move, float v) { //UPDATE
    if (!once) {
      vel = new PVector(random(-v, v), random(-v, v));
      once = true;
    }

    if (move == "toutdroit") {
      //acc.normalize();
    } else if (move == "serpent") {
      acc = new PVector(noise(frameCount*noiseSeed)*width, noise(1+frameCount*noiseSeed)*height);
      acc.normalize();
      vel.add(acc);
    } else if (move == "touslessens") {
      acc = new PVector(random(-1, 1), random(-1, 1));
      acc.normalize();
      vel.add(acc);
    }


    vel.limit(v);
    loc.add(vel);

    serpent.add(new PVector(loc.x, loc.y));
    if (serpent.size() > maxSerpent) {
      serpent.remove(0);
    }

  } 

  void alaforme(String forme) { //DISPLAY
    if (forme == "boule") {
      ellipse(loc.x, loc.y, rad, rad);
    } else if (forme == "carre") {
      rect(loc.x, loc.y, rad, rad);
    } else if (forme == "serpent") {
      beginShape();
      for (int i = 0; i <= serpent.size()-1; i++) {
        PVector a = (PVector) serpent.get(i);
        curveVertex(a.x, a.y);
      }
      endShape();
    } else if (forme == "pieuvre") {
    }
  }

  void teletransporte() {

    if (loc.x > width) {
      loc.x = 0;
    } else if (loc.x < 0) {
      loc.x = width;
    }

    if (loc.y > height) {
      loc.y = 0;
    } else if (loc.y < 0) {
      loc.y = height;
    }
  }

  void rebondis() {
    if ((loc.x > width) || (loc.x < 0)) {
      if (loc.x > width) { 
        loc.x = width;
      } else if (loc.x < 0) { 
        loc.x = 0;
      }
      vel.x = vel.x * -1;
    }
    if ((loc.y > height) || (loc.y < 0)) {
      if (loc.y > height) { 
        loc.y = height;
      } else if (loc.y < 0) { 
        loc.y = 0;
      }
      vel.y = vel.y * -1;
    }
  }
}

Creature maCreature;

void setup() {
  background(255, 255, 255,0);
  stroke(0);
  strokeWeight(4);

  rectMode(CENTER);

  maCreature = new Creature();
 
}

void draw() {

  background(255, 255, 255, 0);
  maCreature.alaforme("serpent");
  maCreature.avance("touslessens", 10);
  maCreature.rebondis();
}
