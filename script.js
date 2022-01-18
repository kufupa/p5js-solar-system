// gravtiational force equation: F = G * m1 * m2 / r^2
// initial velocity for circular orbit equation: v0 = sqrt(G*sunMass/r)

// define global constants
const G_const = 100; // found via trial and error, not the legitimate G value (6.67*(10**-11))
// increase g value to speed up the orbit
const orbitChance = 0.5; // probablity of it orbiting anticlockwise () - between 0-1
const ELLIPTICAL_SF = 0.2; // value between 0-1, increasing it makes orbit more elliptical - affects initial velocity
const sunMass = 150;

// define global variables
let sun;
let planets=[];
let minPlanets = 4;
let maxPlanets = 40;

// define class for general celestial bodies
class AstronomicalBody {

  constructor( pos=createVector(0,0), mass=20, vel=createVector(0,0) ) { // defaults to center of screen with no velocity
    // console.log(mass, pos, vel);
    this.pos = pos;
    this.mass = mass;
    this.r = this.mass; // for now radius is just same as mass - also makes sense
    this.vel = vel;
  }

  show() { // method displaying the circle
    // stroke(0,100); // stroke(gray, [alpha])
    // fill((255,255,0)); // make sun yellow
    // fill((random(255),random(255),random(255))); // make planets random colour
    fill(255); // white circle
    noStroke(); // Disables drawing the stroke (outline)
    ellipse(this.pos.x, this.pos.y, this.r, this.r); // ellipse(x, y, w, [h])
  }

  move() { // update position on screen
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
  }


  attract(sun) {
    let r = dist(sun.pos.x, sun.pos.y, this.pos.x, this.pos.y);// Distance between sun and planet
    let force = (sun.pos.copy()).sub(this.pos); // Creates vector that points from the planet to the sun - represents the direction of the force of attraction
    force.setMag( (G_const * this.mass * sun.mass)/(r ** 2) ); // Calculates the magnitude of the force using official gravity equation F= G*m1*m2/(r^2)
    
    // now we accelerate (change the velocity) of the planet due to the force
    this.vel.x += force.x / this.mass; // Newton's 2nd Law, F=ma
    this.vel.y += force.y / this.mass; // affects 2d components of velocity
  }

}

function spawnPlanets(maxPlanets){ // generate the planets to be shown
  let planets = [];
  for (let i=0; i<maxPlanets; i++) { // create maxPlanets number of planets
    let planetMass = random(15,30) | 0; // local variable

    let planetAngle = random(TWO_PI); // angle that planet will spawn at relative to sun - in radians
    let planetDisplacement = random(sun.r*1.2, min(width/2,height/2)); // magnitude of spawn distance, between sun and edge of screen 
    let planetPos = createVector(planetDisplacement * cos(planetAngle), planetDisplacement * sin(planetAngle));



    // Find direction of orbit and set velocity
    let planetVel = planetPos.copy().normalize(); // copy pos so velocity acts directly away from sun - then normalise it (make it a unit vector)
    // so overall current velocity acts in opposite direction to gravity 
    // we will now rotate it 90 degrees in order to achieve perfect circular motion - where gravity is perpendicular to velocity

    if (random(1) < orbitChance) { // if value is less than {OrbitChance} const
        planetVel.rotate(-HALF_PI); // orbit anticlockwise
    } // Chance due to const - i.e 0.5 = 50%
    else {planetVel.rotate(HALF_PI);} // Otherwise oribit clockwise
    planetVel.mult( // Change magnitude of initial velocity so that it orbits sun perfectly
        sqrt( 
            (G_const*sun.mass)/(planetDisplacement) // ^- using equation v0 = sqrt(G*sunMass/r)
        )
    );  // https://en.wikipedia.org/wiki/Orbital_speed#:~:text=In%20gravitationally%20bound%20systems%2C%20the,speed%20relative%20to%20the%20center - found equation here
    
    planetVel.mult( random( 1-ELLIPTICAL_SF, 1+ELLIPTICAL_SF) ); // make orbit elliptical, by increasing / decreasing vecloity very slightly - dependent on the ellipitical scale factor constant

    let planet = new AstronomicalBody(planetPos, planetMass, planetVel);
    planets.push(planet);


  } 
  return planets;
}

function setup() {

  frameRate(30); // 30 FPS limiter to stop webpage from crashing
  createCanvas(windowWidth,windowHeight);

  sun = new AstronomicalBody(createVector(0,0), sunMass, createVector(0,0));

  // generate integer for max number of planets to be displayed
  // "| 0" - bitwise or operator can be used to truncate floating point figures - works for positives as well as negatives
  maxPlanets = random(minPlanets,maxPlanets) | 0; // random(max) - from 0 to max (but not including) 
  
  planets = spawnPlanets(maxPlanets);

}



function draw(){
  background(0); // decides canvas colour
  translate(width/2, height/2); // everything from now on will be relative to center of screen, rather than top left (0,0)

  sun.show();

  for (let i=0; i < maxPlanets; i++) { // Applies gravtiational force to all Planets
    planets[i].attract(sun); // accelerate planet (due to gravitational attraction to sun) - changes its velocity
    planets[i].move(); // update its position (displacement) - separate method so that we can later add more bodies i.e black holes 
    planets[i].show(); // finally display planet
  }

}
