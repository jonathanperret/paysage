class Serpent {
  PVector loc;
  PVector vel;
  ArrayList anneaux = new ArrayList();
  color maCouleur;

  Serpent() {
    loc = new PVector(random(width), random(height));
    vel = new PVector(5, 5);
  }

  void avance(float vitesseMax, float taille) {
    PVector acc = new PVector(random(-1, 1), random(-1, 1));
    acc.normalize();

    vel.add(acc);
    vel.limit(vitesseMax);

    loc.add(vel);

    anneaux.add(new PVector(loc.x, loc.y));
    if (anneaux.size() > taille) {
      anneaux.remove(0);
    }
  }

  void dessineToi() {

    beginShape();

    stroke(maCouleur);
    fill(0, 0, 0, 0); // en changeant le remplissage, des choses amusantes peuvent se dessiner

    for (int i = 0; i <= anneaux.size()-1; i++) {
      PVector a = (PVector) anneaux.get(i);
      curveVertex(a.x, a.y);
    }
    endShape();
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

  void changeTaCouleur(float rouge, float vert, float bleu) {
    this.maCouleur = color(rouge, vert, bleu);
  }
}

Serpent monSerpent;

void setup() {
  stroke(0);
  strokeWeight(4);

  monSerpent = new Serpent();
}

void draw() {
  background(255, 0); // essayez de l'enlever pour garder la trace du chemin du serpent

  monSerpent.changeTaCouleur(0, 0, 0);
  monSerpent.avance(10, 10);
  monSerpent.rebondis();
  monSerpent.dessineToi();
}
