//https://github.com/michaelruppe/art/blob/master/solar-system-p5/sketch.js


// gravtiational force = G * m1 * m2 / r^2


// define global constants-
const G_const = 10; // found via trial and error, not the legitimate G value (6.67*(10**-11))

// define global variables
let sun;
let maxPlanets;
let Planets = [];


// define classes for different celestial bodies
class AstronomicalBody {
  constructor( pos=createVector(width/2,height/2), mass=20, vel=createVector(0,0) ) { // like __init__ in python
    // console.log(mass, pos, vel);
    this.pos = pos;
    this.mass = mass;
    this.r = this.mass; // for now radius is just same as mass - also makes sense
    this.vel = vel;
  }

  show() { // method displaying the circle
    // stroke(0,100); // stroke(gray, [alpha])
    fill(255); // white circle
    noStroke(); // Disables drawing the stroke (outline)
    ellipse(this.pos.x, this.pos.y, this.r, this.r); // ellipse(x, y, w, [h])
  }

}



function setup() {


}

function draw(){
  background(0);// decides canvas colour

  translate(width/2, height/2) // everything from now on will be relative to center of screen, rather than top left (0,0)
  sun.show()
  planet.show()
}


