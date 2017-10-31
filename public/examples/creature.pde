// Global Constants //<>//
// BODY
int atome = 0;
int serpent = 1;
int duo = 2;
int cristal = 3;
int crystal = 3;

// HAND
int losange = 0;
int cercle = 1;
int pyramide = 2;
int piramide = pyramide;
int etoile = 3;

//ARM SIZE
float bosse = 0;
int patte = 1;
int antenne = 2;
int tentacule = 3;

//ARM AMOUNT
int humain = 2;
int alien = 3;
int insecte = 6;
int poulpe = 8;

//COLOR PALETTES
int eau = 60;
int exotique = 1;
int foret = 25;
int nuit = 75;
int soleil = 14;
int gris = 0;

//TETE
int cyclope = 1;
int horrible = 8;

//Global Constants end

Creature macreature;

void setup() {
  stroke(0);
  strokeWeight(4);

  frameRate(30);

  colorMode(HSB, 100, 100, 100, 100);

  ellipseMode(CENTER);
  rectMode(CENTER);
  macreature =
    nouvelleCreature(atome)
    .yeux(1)
    .nombredebras(insecte)
    .tailledebras(patte)
    .main(etoile)
    .couleurs(89)
    ;
}

void draw() {
  background(0, 0);

  macreature.anime()
  macreature.draw();
}

public Creature nouvelleCreature(int corps) {
  switch(corps) {
    case atome:
      return new Atome();
    case serpent:
      return new Serpent();
    case duo:
      return new Duo();
    case crystal:
      return new Crystal();
    default:
      console.error("corps inconnu : " + corps);
  }
}

abstract class Creature {
  //MOVE
  PVector loc; // Position
  PVector vel; // Velocity
  PVector acc; // Acceleration
  PVector target; // Target

  //PARAMETERS
  int m; // hand
  float tb; // Arm size
  int nbb; // Arms count
  int tt; // Tete

  //GLOBALS
  float basespeed; //Base speed
  float usermass; // Coeff mass defined by user
  float coeffsize; //Overall size of Creatures
  float theta; // Heading angle vector
  float widthedge; //Width edge to repell creatures
  float heightedge; // Height edge to repell creatures
  float strokeW; //strokeWeight based on display size


  //ARMS
  Child[] arms;
  Attach att;
  PVector[] epaule;

  //HEAD
  PVector visage;
  PVector[] oeil;

  //COLORS
  color coFull;
  color coFullS;
  color coFullB;
  color coHalf;
  color coLow;
  color coWhite;

  public abstract float animeCorps(float mass,float finalspeed, PVector dir);
  public abstract Creature drawCorps();

  //CREATURE CLASS STARTS HERE
  Creature() {

    //VARIABLES INIT
    int shortestDimention = min(width, height);
    strokeW = shortestDimention/200;
    coeffsize = shortestDimention/13.5;
    basespeed = shortestDimention/100;

    strokeWeight(strokeW);

    // Init edges with coeffsize
    widthedge = width-coeffsize;
    heightedge = height-coeffsize;

    //Random location starting point
    loc = new PVector(
        random(coeffsize, widthedge),
        random(coeffsize, heightedge)
        );

    //Velocity and acceleration initialization
    vel = new PVector(0, 0);
    acc = new PVector(0, 0);

    //Random first target
    target = new PVector(
        random(coeffsize, widthedge),
        random(coeffsize, heightedge)
        );

    poids(0);
    nombredebras(humain);
    tailledebras(patte);
    couleurs(gris);
    main(cercle);
    yeux(cyclope);
  }

  public Creature poids(float um_){
    usermass = um_;
    return this;
  }

  public Creature tailledebras(float tb_) {
    tb = tb_;
    return this;
  }

  public Creature nombredebras(int nbb_) {
    nbb = nbb_;

    //ATTACH FOR ARMS
    epaule = new PVector[nbb];
    arms = new Child[nbb];
    for (int i = 0; i < nbb; i++) {
      epaule[i] = new PVector(0, 0);
      arms[i] = new Child(width, height);
    }
    return this;
  }

  public Creature main(int m_) {
    m = m_;
    return this;
  }

  public Creature couleurs(int red) {
    //COLORS
    coFull = color(red, 85, 80, 90);
    coFullS = color(red, 100, 80, 90);
    coFullB = color(red, 100, 40, 100);
    coHalf = color(red, 55, 100, 75);
    coLow = color(red, 30, 100, 90);
    coWhite = color(red, 14, 100, 75);
    return this;
  }

  public Creature couleur(int co_) {
    return couleurs(co_);
  }

  public Creature yeux(int te_) {
    tt = te_;

    oeil = new PVector[tt];
    for (int k = 0; k < tt; k++) {
      float angleoeil = random(TWO_PI);
      oeil[k] = new PVector(cos(angleoeil)*coeffsize/4, sin(angleoeil)*coeffsize/4);
    }

    return this;
  }

  public Creature anime() {
    float mass = 1 + tb/30 - float(nbb/30) + usermass/2;
    float finalspeed = basespeed*mass;

    theta = vel.heading();

    // Direction
    PVector dir = PVector.sub(target, loc);

    //Max force when applying on main velocity to avoid weird moves
    float maxforce = animeCorps(mass, finalspeed, dir);

    //TARGET FOR TEST PURPOSE
    //stroke(0, 100, 100);
    //point(target.x, target.y);

    PVector stearing = PVector.sub(dir, vel);
    stearing.limit(maxforce);
    applyForce(stearing, mass);

    vel.add(acc);
    vel.limit(finalspeed);
    loc.add(vel);
    acc.mult(0);

    rebondis(finalspeed, mass);

    // annime les bras
    float armLength = tb*((coeffsize*coeffsize)/80);
    for (int ii = 0; ii < nbb; ii++) {
      att = new Attach(epaule[ii].x, epaule[ii].y, int(armLength));
      att.connect(arms[ii]);
      att.constrainLength(arms[ii], armLength, armLength, 0.69);
      arms[ii].update();
    }
    return this;
  }

  public Creature rebondis(float finalspeed, float mass_) {
    PVector nogo;
    PVector out = null;
    if (loc.x < coeffsize) {
      out = new PVector(finalspeed, vel.y);
    }
    else if (loc.x > width-coeffsize) {
      out = new PVector(-finalspeed, vel.y);
    }

    if (loc.y < coeffsize) {
      out = new PVector(vel.x, finalspeed);
    }
    else if(loc.y > height-coeffsize) {
      out = new PVector(vel.x, -finalspeed);
    }

    if(out != null){
      out.normalize();
      out.mult(finalspeed);
      nogo = PVector.sub(out, vel);
      float maxf = 1;
      nogo.limit(maxf);
      applyForce(nogo, mass_);
    }

    return this;
  }

  void applyForce(PVector force, float mass_) {
    acc.add(PVector.div(force, mass_));
  }

  void drawTete() {
    float eyesize = coeffsize/6;
    if(tt>6){
      eyesize = coeffsize/tt;
    }

    pushMatrix();
    translate(visage.x, visage.y);
    rotate((noise(frameCount*0.01)*TWO_PI));
    fill(coWhite);
    strokeWeight(strokeW/1.5);
    ellipse(0, 0, coeffsize/2, coeffsize/2);
    fill(coFullB);
    noStroke();

    for (int k = 0; k < tt; k++) {
      //strokeWeight(strokeW/2/tt);
      ellipse(oeil[k].x, oeil[k].y, eyesize, eyesize);
    }
    popMatrix();
    return this;
  }

  void drawBras() {
    for (int ii = 0; ii < nbb; ii++) {
      strokeWeight(strokeW/2);
      stroke(coHalf);
      line(epaule[ii].x, epaule[ii].y, arms[ii].loca.x, arms[ii].loca.y);
    }
    return this;
  }

  void drawMain() {
    float handsize = coeffsize/5;
    strokeWeight(strokeW/2);
    stroke(coFull);
    fill(coWhite);
    for (int ii = 0; ii < nbb; ii++) {
      switch(m) {
        case losange:
          pushMatrix();
          translate(arms[ii].loca.x, arms[ii].loca.y);
          rotate(PI/4);
          rect(0, 0, handsize, handsize);
          popMatrix();
          break;
        case cercle:
          ellipse(arms[ii].loca.x, arms[ii].loca.y, handsize, handsize);
          break;
        case pyramide:
          beginShape();
          float anglet=TWO_PI/3;
          for (int iii=0; iii<3; iii++)
          {
            vertex(handsize/1.5*sin(anglet*iii)+arms[ii].loca.x, handsize/1.5*cos(anglet*iii)+arms[ii].loca.y);
          }
          endShape(CLOSE);
          break;
        case etoile:
          float anglee=TWO_PI/5;
          for (int iii=0; iii<5; iii++)
          {
            line(arms[ii].loca.x, arms[ii].loca.y, handsize/1.5*sin(anglee*iii)+arms[ii].loca.x, handsize/1.5*cos(anglee*iii)+arms[ii].loca.y);
          }
          break;
      }
    }
    return this;
  }

  void draw() {
    if (frameCount%360 == 0) {
      console.log(frameRate);
    }

    strokeWeight(strokeW);
    stroke(coFullS);
    fill(coHalf);

    this
      .drawCorps()
      .drawTete()
      .drawBras()
      .drawMain();
  }
}

class Atome extends Creature {
  public Atome() {
    super();
  }

  public float animeCorps(float mass, float finalspeed, PVector dir) {
    float dd = dir.mag();
    dir.normalize();

    //if we arrive, just slow down
    if (dd < coeffsize*2) {
      float ralenti = map(dd, 0, coeffsize*2, 0, finalspeed);
      dir.mult(ralenti);
    } else {
      dir.mult(finalspeed);
    }

    //Search for a new target when approach is done
    if (dd <= coeffsize/10) {
      target = new PVector(
          random(coeffsize, widthedge),
          random(coeffsize, heightedge)
          );
      //ellipse(target.x, target.y, 100, 100);
    }

    //Get coordinates for arms attach
    float angle=TWO_PI/nbb;
    for (int iii=0; iii<nbb; iii++)
    {
      epaule[iii] = new PVector(coeffsize/2*sin(angle*iii)+loc.x, coeffsize/2*cos(angle*iii)+loc.y);
      PVector vtmp = new PVector(1, 1);
      float thetaa = (-angle*iii)+PI/4;
      vtmp.rotate(thetaa);
      vtmp.normalize();
      vtmp.mult(1.1);
      arms[iii].acce.add(vtmp);
    }

    //Get face coordinates
    visage = new PVector(loc.x, loc.y);
    //The maxforce to steer
    float maxforce = 1;
    return maxforce;
  }

  public Creature drawCorps() {
    //Draw the body
    ellipse(loc.x, loc.y, coeffsize, coeffsize);
    return this;
  }
}

class Duo extends Creature {
  public Duo() {
    super();
  }

  public float animeCorps(float mass, float finalspeed, PVector dir) {
    float du = dir.mag();

    float r = 40;
    float amp = 12;
    PVector oscillate = new PVector(r*cos(TWO_PI * frameCount/amp), r*sin(TWO_PI * frameCount/amp));

    if (du < coeffsize*2) {
      dir.normalize();
      float ralenti = map(du, 0, coeffsize*2, 0, finalspeed);  
      dir.mult(ralenti);
    } else {
      //console.log(dir);
      dir.add(oscillate);
      dir.normalize();
      dir.mult(finalspeed);
    }

    if (du <= coeffsize/2) {
      target = new PVector(
          random(coeffsize, widthedge), 
          random(coeffsize, heightedge)
          );
      //ellipse(target.x, target.y, 100, 100);
    }

    float thetad = -theta;
    float radd = coeffsize*0.8;

    for (int jj=0; jj<nbb; jj++)
    {
      float xl = lerp(radd*sin(thetad+(13*PI)/12)+loc.x, radd*sin(thetad+(23*PI)/12)+loc.x, (1/(nbb+1))*(jj+1));
      float yl = lerp(radd*cos(thetad+(13*PI)/12)+loc.y, radd*cos(thetad+(23*PI)/12)+loc.y, (1/(nbb+1))*(jj+1));
      epaule[jj] = new PVector(xl, yl);
    }

    //Get face coordinates
    visage = new PVector(loc.x, loc.y);

    float maxforce = 0.15;
    return maxforce;
  }

  public Creature drawCorps() {
    float thetad = -theta;
    float radd = coeffsize*0.8;
    beginShape();
    line(
        radd*sin(thetad+(11*PI)/12)+loc.x,
        radd*cos(thetad+(11*PI)/12)+loc.y,
        radd*sin(thetad+(PI)/12)+loc.x,
        radd*cos(thetad+(PI)/12)+loc.y
        );
    line(
        radd*sin(thetad+(13*PI)/12)+loc.x,
        radd*cos(thetad+(13*PI)/12)+loc.y,
        radd*sin(thetad+(23*PI)/12)+loc.x,
        radd*cos(thetad+(23*PI)/12)+loc.y
        );
    endShape(CLOSE);

    return this;
  }
}

class Crystal extends Creature {
  public Crystal() {
    super();
  }

  public float animeCorps(float mass, float finalspeed, PVector dir) {
    strokeCap(ROUND);
    float ddd = dir.mag();
    dir.normalize();
    if (ddd < coeffsize*2) {
      target = new PVector(
          random(coeffsize, widthedge), 
          random(coeffsize, heightedge)
          );
      //rect(target.x, target.y, 100, 100);
    }
    dir.mult(finalspeed);


    float thetac = -theta;
    float rad = coeffsize*0.8;

    for (int jj=0; jj<nbb; jj++)
    {
      float xl = lerp(rad*sin(thetac+TWO_PI/3)+loc.x, rad*sin(thetac+(3*PI)/2)+loc.x, (1/(nbb+1))*(jj+1));
      float yl = lerp(rad*cos(thetac+TWO_PI/3)+loc.y, rad*cos(thetac+(3*PI)/2)+loc.y, (1/(nbb+1))*(jj+1));
      epaule[jj] = new PVector(xl, yl);
      PVector vtmp = new PVector(0, 0);
      vtmp = arms[jj].loca.get();
      float thetaa = -thetac-PI/2;
      vtmp.rotate(thetaa);
      vtmp.normalize();
      vtmp.mult(1);
      arms[jj].acce.add(vtmp);
    }

    //Get face coordinates
    visage = new PVector(rad*0.7*sin(thetac+PI/4)+loc.x, rad*0.7*cos(thetac+PI/4)+loc.y);
    float maxforce = 0.3;
    return maxforce;
  }

  public Creature drawCorps() {
    strokeCap(ROUND);

    float thetac = -theta;
    float rad = coeffsize*0.8;
    beginShape();
    vertex(rad*sin(thetac+TWO_PI/3)+loc.x, rad*cos(thetac+TWO_PI/3)+loc.y);
    vertex(rad*sin(thetac+PI/4)+loc.x, rad*cos(thetac+PI/4)+loc.y);
    vertex((0.75*rad)*sin(thetac+(10*PI)/6)+loc.x, (0.75*rad)*cos(thetac+(10*PI)/6)+loc.y);
    vertex(rad*sin(thetac+(3*PI)/2)+loc.x, rad*cos(thetac+(3*PI)/2)+loc.y);
    endShape(CLOSE);
    return this;
  }
}

class Serpent extends Creature {

  //SNAKE
  int sizeSnake;
  Child[] snake;
  Attach anc;

  public Serpent() {
    super();
  }

  public Creature nombredebras(int nbb_) {
    super.nombredebras(nbb_);

    //sizeSnake = int((3+nbb)/2);
    sizeSnake = nbb+1;
    snake = new Child[sizeSnake];
    for (int i = 0; i < sizeSnake; i++) {
      snake[i] = new Child(loc.x+(i*2), loc.y+(i*2));
    }
    return this;
  }

  public float animeCorps(float mass, float finalspeed, PVector dir) {

    float dddd = dir.mag();
    dir.normalize();
    if (dddd < coeffsize*6) {
      target = new PVector(
          random(0, width),
          random(0, height)
          );
      //rect(target.x, target.y, 100, 100);
    }
    dir.mult(finalspeed);

    float segment = (coeffsize*3)/sizeSnake;

    for (int j = 0; j < sizeSnake; j++) {

      Attach anc;
      if (j == 0) {
        anc = new Attach(loc.x, loc.y, int(segment/1.1));
      } else {
        anc = new Attach(snake[j-1].loca.x, snake[j-1].loca.y, int(segment));
      }
      anc.connect(snake[j]);
      anc.constrainLength(snake[j], segment*1.01, segment*1.02, 0.69);
      snake[j].applyForce(snake[j].acce);
      snake[j].update();

      epaule[j] = new PVector(snake[j].loca.x, snake[j].loca.y);
      PVector vtmp = new PVector(0, 0);
      vtmp = vel.get();
      float theta2 = vtmp.heading();
      vtmp.rotate(theta2);
      if (j%2==0) {
        vtmp.rotate(PI/2);
      } else {
        vtmp.rotate(-PI/2);
      }
      vtmp.normalize();
      vtmp.mult(1);
      if (j < sizeSnake-1) {
        arms[j].acce.add(vtmp);
      }
    }

    //Get face coordinates
    visage = new PVector(loc.x, loc.y);

    float maxforce = 0.1;
    return maxforce;
  }

  public Creature drawCorps() {

    noFill();

    beginShape();
    curveVertex(loc.x, loc.y);
    curveVertex(loc.x, loc.y);
    for (int j = 0; j < sizeSnake; j++) {
      curveVertex(snake[j].loca.x, snake[j].loca.y);
    }
    curveVertex(snake[sizeSnake-1].loca.x, snake[sizeSnake-1].loca.y);
    endShape();

    return this;
  }
}

// THANKS Daniel Shiffman for his Spring class - https://github.com/shiffman/The-Nature-of-Code-Examples/blob/master/chp03_oscillation/NOC_3_11_spring/Spring.pde
class Attach {
  PVector anchor;
  PVector ext; // extremity

  float len; // Length
  //  float k = 1; // Spring constant

  Attach(float x, float y, int l) {
    anchor = new PVector(x, y);
    len = l;
  }

  void connect(Child c) {
    PVector force = PVector.sub(c.loca, anchor);
    //float d = force.mag();

    // Calculate force according to Hooke's Law
    // F = k * stretch
    force.normalize();
    //force.mult(-1 * k * stretch);
    force.mult(-1 * len);
    c.applyForce(force);
  }

  // Constrain the distance between bob and anchor between min and max
  void constrainLength(Child c, float minlen, float maxlen, float inert) {
    PVector dir = PVector.sub(c.loca, anchor);
    float d = dir.mag();
    // Is it too short?
    if (d < minlen) {
      dir.normalize();
      dir.mult(minlen);
      // Reset location and stop from moving (not realistic physics)
      c.loca = PVector.add(anchor, dir);
      c.velo.mult(inert);
      // Is it too long?
    } else if (d > maxlen) {
      dir.normalize();
      dir.mult(maxlen+(d-maxlen)/2);
      // Reset location and stop from moving (not realistic physics)
      c.loca = PVector.add(anchor, dir);
      c.velo.mult(inert);
    }
  }
}

class Child {
  PVector loca;
  PVector velo;
  PVector acce;
  const MASSE = 10;
  const FRIC = 0.99;

  Child(float x, float y) {
    loca = new PVector(x, y);
    velo = new PVector();
    acce = new PVector();
  }

  // Standard Euler integration
  void update() {
    velo.add(acce);
    velo.mult(FRIC);
    loca.add(velo);
    acce.mult(0);
  }

  void applyForce(PVector force) {
    PVector f = force.get();
    f.div(MASSE);
    acce.add(f);
  }
}

