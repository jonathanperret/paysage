// See also : http://itunes.com/app/Number32

Creature c;

void setup() {
  noStroke();

  c = new Type1(int(random(255)), 0x55);
  c.position = new JVector(width/2,height/2);
}

void draw() {
  background(0,0);
  fill(0);

  c.think();

  c.draw();
}


static int rotl(int x, int n) {
  return ((x << n) | ((x >>> (8-n)) & 0xff)) & 0xff;
}


class JVector {
  public float x, y;

  JVector(float x, float y) {
    this.x = x;
    this.y = y;
  }

  void add(JVector v) {
    this.x += v.x;
    this.y += v.y;
  }

  void mult(float f) {
    this.x *= f;
    this.y *= f;
  }

  float mag() {
    return sqrt(this.x * this.x + this.y * this.y);
  }
}

class Creature {
  public int mwidth;
  public int mheight;
  public int[] bitmasks;
  public float skale;
  public float angle;
  public JVector position;
  public JVector speed;

  Creature(int mwidth, int mheight, int[] bitmasks) {
    this.skale = 10;

    this.mwidth = mwidth;
    this.mheight = mheight;

    this.angle = 0;

    this.position = new JVector(0, 0);

    this.speed = new JVector(0, 0);

    this.bitmasks = bitmasks;
  }

  void think() {
    if(this.speed.mag() < 0.1) {
      this.speed = new JVector(random(-10,10),random(-10,10));

      if((this.position.x < 150 &&  this.speed.x < 0)
        || (this.position.x > width - 150 && this.speed.x > 0)
        )
        this.speed.x *= -1;

      if((this.position.y < 150 && this.speed.y < 0)
        || (this.position.y > height - 150 && this.speed.y > 0)
        )
        this.speed.y *= -1;
    }

    this.position.add(this.speed);
    this.speed.mult(0.95);
    this.angle += 0.02 * this.speed.x;
  }

  void draw() {
    pushMatrix();
    translate(this.position.x, this.position.y);
    scale(this.skale);
    rotate(this.angle);
    for(int y=0; y<mheight; y++)
      for(int x=0; x<mwidth; x++) {
        int bits = this.bitmasks[y*mwidth + x];
        pushMatrix();
        translate(1 + 2*x - mwidth, 1 + 2*y - mheight);
        drawAtom(bits);
        popMatrix();
      }
    popMatrix();
  }
}

class Type1 extends Creature {
  Type1(int a, int b) {
    super(3, 3, new int[] {
      a,0,rotl(a,6), 0,b,0, rotl(a,2),0,rotl(a,4)
    }
    );
  }
}

void drawAtom(int bits) {
    if(0 != (bits & 1)) triangle(0.029289335,0.07071072,0.029289335,0.97071064,0.92928934,0.97071064);
    if(0 != (bits & 2)) triangle(0.07071072,0.029289335,0.97071064,0.92928934,0.97071064,0.029289335);
    if(0 != (bits & 4)) triangle(0.07071072,-0.029289335,0.97071064,-0.029289335,0.97071064,-0.92928934);
    if(0 != (bits & 8)) triangle(0.029289335,-0.07071072,0.92928934,-0.97071064,0.029289335,-0.97071064);
    if(0 != (bits & 16)) triangle(-0.029289335,-0.07071072,-0.029289335,-0.97071064,-0.92928934,-0.97071064);
    if(0 != (bits & 32)) triangle(-0.07071072,-0.029289335,-0.97071064,-0.92928934,-0.97071064,-0.029289335);
    if(0 != (bits & 64)) triangle(-0.07071072,0.029289335,-0.97071064,0.029289335,-0.97071064,0.92928934);
    if(0 != (bits & 128)) triangle(-0.029289335,0.07071072,-0.92928934,0.97071064,-0.029289335,0.97071064);
}
