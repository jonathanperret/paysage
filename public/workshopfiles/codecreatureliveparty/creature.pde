// Global Variables //<>//
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

float loop;

//Global Variables end

class Creature {
  //MOVE
  PVector loc; // Position
  PVector vel; // Velocity
  PVector acc; // Acceleration
  PVector target; // Cible
  PVector dir; // Direction
  PVector st; // Steering

  //PARAMETERS
  int c; // body
  int m; // hand
  float tb; // Arm size
  int nbb; // Arms count
  color co; // Colors
  int tt; // Tete

  //GLOBALS
  float basespeed; //Base speed
  float finalspeed; // Final speed once multiplied by Creature's mass 
  float mass; // Mass - influenced by arms count and length
  float usermass; // Coeff mass defined by user
  float coeffsize; //Overall size of Creatures
  float theta; // Heading angle vector
  float maxforce; //Max force when applying on main velocity to avoid weird moves
  float widthedge; //Width edge to repell creatures
  float heightedge; // Height edge to repell creatures
  float strokeW; //strokeWeight based on display size

  //INIT BOOLEANS
  boolean once; //once variable boolean

  //SNAKE
  int sizeSnake;
  Child[] snake;
  float segment;
  Attach anc;

  //ARMS
  Child[] arms;
  Attach att;
  PVector[] epaule;
  float tbl; //TB LENGTH COMPUTED FROM TB VARIABLE

  //WANDER
  float wandertheta;
  PVector vtmp;

  //HEAD
  PVector visage;
  PVector[] oeil;
  float[] angleoeil; 

  //COLORS
  color coFull;
  color coFullS;
  color coFullB;
  color coHalf;
  color coLow;
  color coWhite;

  //TMPS
  float tbtmp;
  float nbbtmp;

  //CREATURE CLASS STARTS HERE
  Creature() {
    nbb = humain;
    tb = patte;
    co = int(gris);
    m = cercle;
    tt = cyclope;

    //TMPS
    tbtmp = 0;
    nbbtmp = 0;

    //VARIABLES INIT
    if (width > height) {
      strokeW = height/200;
      coeffsize = height/13.5;
      basespeed = height/100;
    } else {
      strokeW = width/200;
      coeffsize = width/13.5;
      basespeed = width/100;
    }
    strokeWeight(strokeW);

    //INIT MASS AND FORCE MAX
    mass = 1; 
    usermass = 0;
    maxforce = 0.5;

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

    //Direction and steering initialization
    dir = new PVector(0, 0);
    st  = new PVector(0, 0);

    // INIT ONCE BOOLEANS
    once = false;
  }

  //LET'S MAKE SURE THAT WE READ THE CODE OF THE USER BEFORE TRYING TO RENDER ANYTHING (To avoid arrays out of bounds for example)
  boolean updated() { 
    if (loop < 2) {

      //DEFAULTS
      //armsize influence on coeffspeed / the larger arms = the more speed
      if (tbtmp != tb) {
        mass += tb/30;
      }
      tbtmp = tb;

      //arm count influence on coeffspeed / the more arms = the less speed
      if (nbbtmp != nbb) {
        mass -= float(nbb/30);
      }
      nbbtmp = nbb;
      //Finalspeed initialization - default one with mass = 1 
      
      if(usermass > 0 && usermasstmp != usermass){
        mass += usermass/2;
      }
      usermasstmp = usermass;

      finalspeed = basespeed*mass;

      //UPDATE ARM SIZE
      tbl = tb*((coeffsize*coeffsize)/80);

      //temporary vector to get the right angle for arms
      vtmp = new PVector(0, 0);

      //Face vector init
      visage = new PVector(0, 0);
      //Eyes init
      oeil = new PVector[tt];
      angleoeil = new float[tt];
      for (int k = 0; k < tt; k++) {
        angleoeil[k] = random(TWO_PI);
        oeil[k] = new PVector(cos(angleoeil[k])*coeffsize/4, sin(angleoeil[k])*coeffsize/4);
      }

      //SNAKE UPDATE
      //sizeSnake = int((3+nbb)/2);
      sizeSnake = nbb+1;
      snake = new Child[sizeSnake];
      segment = (coeffsize*3)/sizeSnake;
      for (int i = 0; i < sizeSnake; i++) {
        snake[i] = new Child(loc.x+(i*2), loc.y+(i*2));
      }
      anc = new Attach(loc.x, loc.y, int(segment/1.1));

      //ATTACH FOR ARMS
      epaule = new PVector[nbb];
      arms = new Child[nbb];
      for (int i = 0; i < nbb; i++) {
        epaule[i] = new PVector(0, 0);
        arms[i] = new Child(width, height);
      }

      //COLORS
      coFull = color(co, 85, 80, 90);
      coFullS = color(co, 100, 80, 90);
      coFullB = color(co, 100, 40, 100);
      coHalf = color(co, 55, 100, 75);
      coLow = color(co, 30, 100, 90);
      coWhite = color(co, 14, 100, 75);
      return false;
    } else { 
      return true;
    }
  }

  public Creature corps(int c_) { //decide here global moves / speed pattern / body shape
    if (frameCount%360 == 0) {
      console.log(frameRate);
    }

    c = c_;
    finalspeed = basespeed*mass;
    if (updated()) {
      strokeWeight(strokeW);
      stroke(coFullS);
      fill(coHalf);

      float theta = vel.heading();
      dir = PVector.sub(target, loc);

      switch(c) {

      case 0: //ATOME
        //The maxforce to steer
        maxforce = 1;
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

        //Draw the body
        ellipse(loc.x, loc.y, coeffsize, coeffsize);

        //Get coordinates for arms attach
        float angle=TWO_PI/nbb;
        for (int iii=0; iii<nbb; iii++)
        {
          epaule[iii] = new PVector(coeffsize/2*sin(angle*iii)+loc.x, coeffsize/2*cos(angle*iii)+loc.y);
          vtmp = new PVector(1, 1);
          float thetaa = (-angle*iii)+PI/4;
          vtmp.rotate(thetaa);
          vtmp.normalize();
          vtmp.mult(1.1);
          arms[iii].acce.add(vtmp);
        } 

        //Get face coordinates
        visage = new PVector(loc.x, loc.y);

        break;

      case 1: //SERPENT
        maxforce = 0.1;
        noFill();
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

        beginShape();
        curveVertex(loc.x, loc.y);
        curveVertex(loc.x, loc.y);
        for (int j = 0; j < sizeSnake; j++) {

          if (j == 0) {
            anc = new Attach(loc.x, loc.y, int(segment/1.1));
          } else {
            anc = new Attach(snake[j-1].loca.x, snake[j-1].loca.y, int(segment));
          }
          anc.connect(snake[j]);
          anc.constrainLength(snake[j], segment*1.01, segment*1.02, 0.69);
          snake[j].applyForce(snake[j].acce);
          snake[j].update();

          curveVertex(snake[j].loca.x, snake[j].loca.y);
          epaule[j] = new PVector(snake[j].loca.x, snake[j].loca.y);
          vtmp = new PVector(0, 0);
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
        curveVertex(snake[sizeSnake-1].loca.x, snake[sizeSnake-1].loca.y);
        endShape();

        //Get face coordinates
        visage = new PVector(loc.x, loc.y);

        break;

      case 2: //DUO
        maxforce = 0.15;
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

        for (int jj=0; jj<nbb; jj++)
        {
          float xl = lerp(radd*sin(thetad+(13*PI)/12)+loc.x, radd*sin(thetad+(23*PI)/12)+loc.x, (1/(nbb+1))*(jj+1));
          float yl = lerp(radd*cos(thetad+(13*PI)/12)+loc.y, radd*cos(thetad+(23*PI)/12)+loc.y, (1/(nbb+1))*(jj+1));
          epaule[jj] = new PVector(xl, yl);
        }

        //Get face coordinates
        visage = new PVector(loc.x, loc.y);

        break;
      case 3: //CRISTAL
        strokeCap(ROUND);
        maxforce = 0.3;
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
        beginShape();
        vertex(rad*sin(thetac+TWO_PI/3)+loc.x, rad*cos(thetac+TWO_PI/3)+loc.y);
        vertex(rad*sin(thetac+PI/4)+loc.x, rad*cos(thetac+PI/4)+loc.y);
        vertex((0.75*rad)*sin(thetac+(10*PI)/6)+loc.x, (0.75*rad)*cos(thetac+(10*PI)/6)+loc.y);
        vertex(rad*sin(thetac+(3*PI)/2)+loc.x, rad*cos(thetac+(3*PI)/2)+loc.y);
        endShape(CLOSE);

        for (int jj=0; jj<nbb; jj++)
        {
          float xl = lerp(rad*sin(thetac+TWO_PI/3)+loc.x, rad*sin(thetac+(3*PI)/2)+loc.x, (1/(nbb+1))*(jj+1));
          float yl = lerp(rad*cos(thetac+TWO_PI/3)+loc.y, rad*cos(thetac+(3*PI)/2)+loc.y, (1/(nbb+1))*(jj+1));
          epaule[jj] = new PVector(xl, yl);
          vtmp = new PVector(0, 0);
          vtmp = arms[jj].loca.get();
          float thetaa = -thetac-PI/2;
          vtmp.rotate(thetaa);
          vtmp.normalize();
          vtmp.mult(1);
          arms[jj].acce.add(vtmp);
        }

        //Get face coordinates
        visage = new PVector(rad*0.7*sin(thetac+PI/4)+loc.x, rad*0.7*cos(thetac+PI/4)+loc.y);

        break;
      }

      //TARGET FOR TEST PURPOSE
      //stroke(0, 100, 100);
      //point(target.x, target.y);

      st = PVector.sub(dir, vel); 
      st.limit(maxforce);

      applyForce(st);
      vel.add(acc);
      vel.limit(finalspeed);
      loc.add(vel);
      acc.mult(0);

      rebondis();
    }
    return this;
  }

  // ARMSIZE
  public Creature tailledebras(float tb_) {
    tb = tb_;
    if (updated()) {
    }
    return this;
  }

  //ARMS COUNT
  public Creature nombredebras(int nbb_) {
    nbb = nbb_;
    if (updated()) {
      for (int ii = 0; ii < nbb; ii++) {
        att = new Attach(epaule[ii].x, epaule[ii].y, int(tbl));
        att.connect(arms[ii]);
        att.constrainLength(arms[ii], tbl, tbl, 0.69);
        arms[ii].update();
        strokeWeight(strokeW/2);
        stroke(coHalf);
        line(epaule[ii].x, epaule[ii].y, arms[ii].loca.x, arms[ii].loca.y);
      }
    }  
    return this;
  }

  public Creature main(int m_) {
    m = m_;
    float handsize = coeffsize/5; 
    if (updated()) {
      
      strokeWeight(strokeW/2);
      stroke(coFull);
      fill(coWhite);
      for (int ii = 0; ii < nbb; ii++) {
        switch(m) {
        case 0:
          pushMatrix();
          translate(arms[ii].loca.x, arms[ii].loca.y);
          rotate(PI/4);
          rect(0, 0, handsize, handsize);
          popMatrix();
          break;
        case 1:
          ellipse(arms[ii].loca.x, arms[ii].loca.y, handsize, handsize);
          break;
        case 2:
          beginShape();
          float anglet=TWO_PI/3;
          for (int iii=0; iii<3; iii++)
          {
            vertex(handsize/1.5*sin(anglet*iii)+arms[ii].loca.x, handsize/1.5*cos(anglet*iii)+arms[ii].loca.y);
          }
          endShape(CLOSE);
          break;
        case 3:
          float anglee=TWO_PI/5;
          for (int iii=0; iii<5; iii++)
          {
            line(arms[ii].loca.x, arms[ii].loca.y, handsize/1.5*sin(anglee*iii)+arms[ii].loca.x, handsize/1.5*cos(anglee*iii)+arms[ii].loca.y);
          }
          break;
        }
      }
    }
    return this;
  }

  public Creature couleurs(int co_) {
    co = co_;
    if (updated()) {
    }
    return this;
  }
  
  public Creature couleur(int co_) {
    return couleurs(co_);
  }

  public Creature yeux(int te_) {
    tt = te_;
    float eyesize = coeffsize/6;
    if(tt>6){
      eyesize = coeffsize/tt;
    }

    if (updated()) {
      pushMatrix();
      translate(visage.x, visage.y);
      rotate((noise(frameCount*0.01)*TWO_PI));
      fill(0, 0, 100);
      strokeWeight(strokeW/1.5);
      ellipse(0, 0, coeffsize/2, coeffsize/2);
      fill(coFullB);
      noStroke();

      for (int k = 0; k < tt; k++) {
        //strokeWeight(strokeW/2/tt);

        ellipse(oeil[k].x, oeil[k].y, eyesize, eyesize);
      }
      popMatrix();
    }
    return this;
  }

  public Creature poids(float um_){
    usermass = um_; 

    return this;
  }

  public Creature rebondis() {
    PVector nogo;
    PVector out = null;
    
    //REPULSIVE WALLS
    /*stroke(0, 100, 100);
    noFill();
    rect(width/2, height/2, widthedge, heightedge);*/
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
      applyForce(nogo);
    }

    return this;
  }

  void applyForce(PVector force) {
    PVector f = PVector.div(force, mass);
    acc.add(f);
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
  float masse = 10;
  float fric = 0.99;

  Child(float x, float y) {
    loca = new PVector(x, y);
    velo = new PVector();
    acce = new PVector();
  }

  // Standard Euler integration
  void update() { 
    velo.add(acce);
    velo.mult(fric);
    loca.add(velo);
    acce.mult(0);
  }

  void applyForce(PVector force) {
    PVector f = force.get();
    f.div(masse);
    acce.add(f);
  }
}

Creature macreature;

void setup() {
  //size(800, 600);
  size(window.innerWidth, window.innerHeight);
  stroke(0);
  strokeWeight(4);

  frameRate(30);

  colorMode(HSB, 100, 100, 100, 100);

  ellipseMode(CENTER);
  rectMode(CENTER);
  macreature = new Creature();
}

void draw() {
  background(0, 0, 100, 0);

//kids code here;

  loop++;
}