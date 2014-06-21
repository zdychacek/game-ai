import Vector2D from './common/Vector2D';
import Transformation from './common/Transformation';
import GDI from './common/GDI';
import MovingEntity from './MovingEntity';
import SteeringBehavior from './SteeringBehavior';

/**
 * This class implements moving entity with steering behaviour.
 */
class Vehicle extends MovingEntity {
  /**
   * .ctor
   */
  constructor ({
    vPosition,
    vVelocity,
    world,
    rotation,
    mass,
    maxForce,
    maxSpeed,
    maxTurnRate,
    scale
  }) {
    super({
      vPosition,
      vVelocity,
      vHeading: new Vector2D(Math.sin(rotation), -Math.cos(rotation)),
      vScale: new Vector2D(scale, scale),
      radius: scale,
      maxSpeed,
      mass,
      maxTurnRate,
      maxForce
    });

    // a pointer to the world data. So a vehicle can access any obstacle, path, wall or agent data
    this._world = world;
    // this vector represents the average of the vehicle's heading vector smoothed over the last few frames
    this._vSmoothedHeading = new Vector2D(0, 0);
    // when true, smoothing is active
    this._smoothingOn = false;
    // keeps a track of the most recent update time (some of the steering behaviors make use of this - see Wander)
    this._timeElapsed = 0;
    // buffer for the vehicle shape
    this._vecVehicleVB = [];

    this._initializeBuffer();

    // set up the steering behavior class
    this._steering = new SteeringBehavior(this);

    // set up the smoother
    //this._headingSmoother = new SmootherV2(Prm.NumSamplesForSmoothing, new Vector2D(0, 0));
  }

  /**
   * Creates vehicle shape.
   */
  _initializeBuffer () {
    const numVehicleVerts = 3;

    var vehicle = [
      new Vector2D(-1, 0.6),
      new Vector2D(1, 0),
      new Vector2D(-1, -0.6)
    ];

    // setup the vertex buffers and calculate the bounding radius
    for (var vtx = 0; vtx < numVehicleVerts; vtx++) {
      this._vecVehicleVB.push(vehicle[vtx]);
    }
  }

  update (dt) {
    //update the time elapsed
    this._timeElapsed = dt;

    // keep a record of its old position so we can update its cell later in this method
    var oldPos = this.pos;

    // calculate the combined force from each steering behavior in the vehicle's list
    var steeringForce = this._steering.calculate();

    // Acceleration = Force / Mass
    var acceleration = Vector2D.div(steeringForce, this.mass);

    // update velocity
    this._vVelocity.add(Vector2D.mul(acceleration, dt));

    // make sure vehicle does not exceed maximum velocity
    this._vVelocity.truncate(this.maxSpeed);

    // update the position
    this._vPosition.add(Vector2D.mul(this._vVelocity, dt));

    // update the heading if the vehicle has a non zero velocity
    if (this._vVelocity.lengthSq > 0.00000001) {
        this._vHeading = Vector2D.vec2DNormalize(this._vVelocity);
        this._vSide = this._vHeading.perp;
    }

    // EnforceNonPenetrationConstraint(this, World()->Agents());

    // treat the screen as a toroid
    Vector2D.wrapAround(this._vPosition, this._world.cxClient, this._world.cyClient);

    /**update the vehicle's current cell if space partitioning is turned on
    if (Steering().isSpacePartitioningOn()) {
        World().CellSpace().UpdateEntity(this, OldPos);
    }

    if (isSmoothingOn()) {
        m_vSmoothedHeading = m_pHeadingSmoother.Update(Heading());
    }**/
  }

  render (ctx) {
    // trasnform local space to world space
    var vecVehicleVBTrans =
      Transformation.worldTransform(
        this._vecVehicleVB,
        this.pos,
        this.heading,
        this.side,
        this.scale
      );

    // render vehicle shape
    GDI.closedShape(ctx, vecVehicleVBTrans);
  }
}

export default Vehicle;
