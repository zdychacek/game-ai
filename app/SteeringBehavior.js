import Vector2D from './common/Vector2D';
import Transformation from './common/Transformation';
import Params from './Params';
import Utils from './common/Utils';

// the radius of the constraining circle for the wander behavior
const wanderRad = 1.2;

// distance the wander circle is projected in front of the agent
const wanderDist = 2;

// the maximum amount of displacement along the circle each frame
const wanderJitterPerSec = 80;

// used in path following
const waypointSeekDist = 20;

/**
 * Steering behaviour class.
 */
class SteeringBehavior {
  /**
   * .ctor
   */
  constructor (agent) {
    // a pointer to the owner of this instance
    this._vehicle = agent;

    // the steering force created by the combined effect of all the selected behaviors
    this._vSteeringForce = new Vector2D(0, 0);

    // binary flags to indicate whether or not a behavior should be active
    this._flags = 0;

    // length of the 'detectithison box' utilized in obstacle avoidance
    this._DBoxLength = Params.minDetectionBoxLength;

    // how far the agent can 'see'
    this._viewDistance = Params.viewDistance;

    // pointer to any current path
    this._path = null;

    // the length of the 'feeler/s' used in wall detection
    this._wallDetectionFeelerLength = Params.wallDetectionFeelerLength;

    // the current posititon on the wander circle the agent is attempting to steer towards
    this._vWanderTarget = null;

    // a vertex buffer to contain the feelers rqd for wall avoidance
    this._feelers = null;
    this._decelaration = Deceleration.Normal;

    // these can be used to keep track of friends, pursuers, or prey
    this._targetAgent1 = null;
    this._targetAgent2 = null;

    // the current target
    this._vTarget = new Vector2D(0, 0);

    // used in path following
    this._waypointSeekDist = 20;

    // distance the wander circle is projected in front of the agent
    this._wanderDistance = wanderDist;

    // the maximum amount of displacement along the circle each frame
    this._wanderJitter = wanderJitterPerSec;

    // the radius of the constraining circle for the wander behavior
    this._wanderRadius = wanderRad;

    // the distance (squared) a vehicle has to be from a path waypoint before it starts seeking to the next waypoint
    this._waypointSeekDistSq = this._waypointSeekDist * this._waypointSeekDist;

    // any offset used for formations or offset pursuit
    this._vOffset = null;

    // is cell space partitioning to be used or not?
    this._cellSpaceOn = false;

    // what type of method is used to sum any active behavior
    this._summingMethod = SummingMethod.WeightedAverage;

    // multipliers. These can be adjusted to effect strength of the appropriate behavior. Useful to get flocking the way you require for example.
    this._weightCohesion = Params.cohesionWeight;
    this._weightAlignment = Params.alignmentWeight;
    this._weightSeparation = Params.separationWeight;
    this._weightObstacleAvoidance = Params.obstacleAvoidanceWeight;
    this._weightWander = Params.wanderWeight * 200;;
    this._weightWallAvoidance = Params.wallAvoidanceWeight;
    this._weightSeek = Params.seekWeight;
    this._weightFlee = Params.fleeWeight;
    this._weightArrive = Params.arriveWeight;
    this._weightPursuit = Params.pursuitWeight;
    this._weightOffsetPursuit = Params.offsetPursuitWeight;
    this._weightInterpose = Params.interposeWeight;
    this._weightHide = Params.hideWeight;
    this._weightEvade = Params.evadeWeight;
    this._weightFollowPath = Params.followPathWeight;

    // stuff for the wander behavior
    var theta = Math.random() * Math.PI * 2;

    // create a vector to a target position on the wander circle
    this._vWanderTarget = new Vector2D(this._wanderRadius * Math.cos(theta), this._wanderRadius * Math.sin(theta));

    // TODO
    // create a Path
    /*this._path = new Path();
    this._path.loopOn();*/
  }

  wanderOn () {
    this._flags |= BehaviorType.Wander;
  }

  wanderOff () {
    if (this._on(BehaviorType.Wander)) {
      this._flags ^= BehaviorType.Wander;
    }
  }

  // Tests if a specific bit of this._flags is set
  _on (behaviorType) {
      return (this._flags & behaviorType) == behaviorType;
  }

  /**
   * Calculates how much of its max steering force the
   * vehicle has left to apply and then applies that amount of the
   * force to add.
   */
  _acumulateForce (runningTot, forceToAdd) {
      // calculate how much steering force the vehicle has used so far
      var magnitudeSoFar = runningTot.length;

      // calculate how much steering force remains to be used by this vehicle
      var magnitudeRemaining = this._vehicle.maxForce - magnitudeSoFar;

      // return false if there is no more force left to use
      if (magnitudeRemaining <= 0) {
          return false;
      }

      // calculate the magnitude of the force we want to add
      var magnitudeToAdd = forceToAdd.length;

      // if the magnitude of the sum of forceToAdd and the running total
      // does not exceed the maximum force available to this vehicle, just
      // add together. Otherwise add as much of the forceToAdd vector is
      // possible without going over the max.
      if (magnitudeToAdd < magnitudeRemaining) {
          runningTot.add(forceToAdd);
      }
      else {
          // add it to the steering force
          runningTot.add(Vector2D.mul(Vector2D.vec2DNormalize(forceToAdd), magnitudeRemaining));
      }

      return true;
  }

  /**
   * Creates the antenna utilized by WallAvoidance
   */
  _createFeelers () {
      this._feelers = [];

      // feeler pointing straight in front
      this._feelers.push(
        Vector2D.add(
          this._vehicle.pos,
          Vector2D.mul(
            this._vehicle.heading,
            this._wallDetectionFeelerLength
          )
        )
      );

      // feeler to left
      var vTemp = new Vector2D(this._vehicle.heading);
      Transformation.vec2DRotateAroundOrigin(vTemp, Math.PI / 2 * 3.5);

      this._feelers.push(
        Vector2D.add(
          this._vehicle.pos,
          Vector2D.mul(
            vTemp,
            this._wallDetectionFeelerLength / 2
          )
        )
      );

      // feeler to right
      vTemp = new Vector2D(this._vehicle.heading);
      Transformation.vec2DRotateAroundOrigin(vTemp, Math.PI / 2 * 0.5);

      this._feelers.push(
        Vector2D.add(
          this._vehicle.pos,
          Vector2D.mul(
            vTemp,
            this._wallDetectionFeelerLength / 2.0
          )
        )
      );
  }

  /* Given a target, this behavior returns a steering force which will
   * direct the agent towards the target
   */
  _seek (vTargetPos) {
    var vDesiredVelocity = Vector2D.mul(
      Vector2D.vec2DNormalize(
        Vector2D.sub(vTargetPos, this._vehicle.pos)
      ),
      this._vehicle.maxSpeed
    );

    return Vector2D.sub(vDesiredVelocity, this._vehicle.velocity);
  }

  /**
   * This behavior makes the agent wander about randomly
   */
  _wander () {
    // this behavior is dependent on the update rate, so this line must be included when using time independent framerate.
    var jitterThisTimeSlice = this._wanderJitter * this._vehicle.timeElapsed;

    // first, add a small random vector to the target's position
    this._vWanderTarget.add(
      new Vector2D(Utils.randomClamped() * jitterThisTimeSlice, Utils.randomClamped() * jitterThisTimeSlice)
    );

    // reproject this new vector back on to a unit circle
    this._vWanderTarget.normalize();

    // increase the length of the vector to the same as the radius of the wander circle
    this._vWanderTarget.mul(this._wanderRadius);

    // move the target into a position wanderDist in front of the agent
    var target = Vector2D.add(
      this._vWanderTarget, new Vector2D(this._wanderDistance, 0)
    );

    // project the target into world space
    target =
      Transformation.pointToWorldSpace(
          target,
          this._vehicle.heading,
          this._vehicle.side,
          this._vehicle.pos
      );

    // and steer towards it
    return Vector2D.sub(target, this._vehicle.pos);
  }

  /**
   * Calculates the accumulated steering force according to the method set in this._summingMethod
   */
  calculate () {
    // reset the steering force
    this._vSteeringForce.zero();

    // use space partitioning to calculate the neighbours of this vehicle if switched on. If not, use the standard tagging system
    if (this.isSpacePartitioningOn) {
      // tag neighbors if any of the following 3 group behaviors are switched on
      if (this._on(BehaviorType.Separation) || this._on(BehaviorType.Allignment) || this._on(BehaviorType.Cohesion)) {
        this._vehicle.world.tagVehiclesWithinViewRange(this._vehicle, this._viewDistance);
      }
    }
    else {
      // calculate neighbours in cell-space if any of the following 3 group behaviors are switched on
      if (this._on(BehaviorType.Separation) || this._on(BehaviorType.Allignment) || this._on(BehaviorType.Cohesion)) {
        // TODO:
        //this._vehicle.world.CellSpace().calculateNeighbors(this._vehicle.pos, this._viewDistance);
      }
    }

    switch (this._summingMethod) {
      case SummingMethod.WeightedAverage:
        this._vSteeringForce = this._calculateWeightedSum();
        break;

      case SummingMethod.Prioritized:
        this._vSteeringForce = this._calculatePrioritized();
        break;

      case SummingMethod.Dithered:
        this._vSteeringForce = this._calculateDithered();
        break;

      default:
        this._vSteeringForce = new Vector2D(0, 0);
    }

    return this._vSteeringForce;
  }

  /**
   * This simply sums up all the active behaviors X their weights and truncates the result to the max available steering force before returning
   */
  _calculateWeightedSum () {
    if (this._on(BehaviorType.WallAvoidance)) {
      this._vSteeringForce.add(
        Vector2D.mul(
          this._wallAvoidance(this._vehicle.world.walls),
          this._weightWallAvoidance
        )
      );
    }

    if (this._on(BehaviorType.ObstacleAvoidance)) {
      this._vSteeringForce.add(
        Vector2D.mul(
          this._obstacleAvoidance(this._vehicle.world.obstacles),
          this._weightObstacleAvoidance
        )
      );
    }

    if (this._on(BehaviorType.Evade)) {
      assert(this._targetAgent1, 'Evade target not assigned');

      this._vSteeringForce.add(
        Vector2D.mul(
          this._evade(this._targetAgent1),
          this.weightEvade
        )
      );
    }

    // these next three can be combined for flocking behavior (wander is also a good behavior to add into this mix)
    if (!this.isSpacePartitioningOn) {
      if (this._on(BehaviorType.Separation)) {
        this._vSteeringForce.add(
          Vector2D.mul(
            this._separation(this._vehicle.world.agents),
            this._weightSeparation
          )
        );
      }

      if (this._on(BehaviorType.Allignment)) {
        this._vSteeringForce.add(
          Vector2D.mul(
            this._alignment(this._vehicle.world.agents),
            this._weightAlignment
          )
        );
      }

      if (this._on(BehaviorType.Cohesion)) {
        this._vSteeringForce.add(
          Vector2D.mul(
            this._cohesion(this._vehicle.world.agents),
            this._weightCohesion
          )
        );
      }
    }
    else {
      if (this._on(BehaviorType.Separation)) {
        this._vSteeringForce.add(
          Vector2D.mul(
            this._separationPlus(this._vehicle.world.agents),
            this._weightSeparation
          )
        );
      }

      if (this._on(BehaviorType.Allignment)) {
        this._vSteeringForce.add(
          Vector2D.mul(
            this._alignmentPlus(this._vehicle.world.agents),
            this._weightAlignment
          )
        );
      }

      if (this._on(BehaviorType.Cohesion)) {
        this._vSteeringForce.add(
          Vector2D.mul(
            this._cohesionPlus(this._vehicle.world.agents),
            this._weightCohesion
          )
        );
      }
    }

    if (this._on(BehaviorType.Wander)) {
      this._vSteeringForce.add(
        Vector2D.mul(
          this._wander(),
          this._weightWander
        )
      );
    }

    if (this._on(BehaviorType.Seek)) {
      this._vSteeringForce.add(
        Vector2D.mul(
          this._seek(this._vehicle.world.crosshair),
          this._weightSeek
        )
      );
    }

    if (this._on(BehaviorType.Flee)) {
      this._vSteeringForce.add(
        Vector2D.mul(
          this._flee(this._vehicle.world.crosshair),
          this._weightFlee
        )
      );
    }

    if (this._on(BehaviorType.Arrive)) {
      this._vSteeringForce.add(
        Vector2D.mul(
          this._arrive(this._vehicle.world.crosshair, this._decelaration),
          this._weightArrive
        )
      );
    }

    if (this._on(BehaviorType.Pursuit)) {
      assert(this._targetAgent1, 'Pursuit target not assigned');

      this._vSteeringForce.add(
        Vector2D.mul(
          this._pursuit(this._targetAgent1),
          this._weightPursuit
        )
      );
    }

    if (this._on(BehaviorType.OffsetPursuit)) {
      assert(this._targetAgent1, 'Pursuit target not assigned');
      assert(!this._vOffset.isZero, 'No offset assigned');

      this._vSteeringForce.add(
        Vector2D.mul(
          this._offsetPursuit(this._targetAgent1, this._vOffset),
          this._weightOffsetPursuit
        )
      );
    }

    if (this._on(BehaviorType.Interpose)) {
      assert(this._targetAgent1 && this._targetAgent2, 'Interpose agents not assigned');

      this._vSteeringForce.add(
        Vector2D.mul(
          this._interpose(this._targetAgent1, this._targetAgent2),
          this._weightInterpose
        )
      );
    }

    if (this._on(BehaviorType.Hide)) {
      assert(this._targetAgent1, 'Hide target not assigned');

      this._vSteeringForce.add(
        Vector2D.mul(
          this._hide(this._targetAgent1, this._vehicle.world.obstacles),
          this._weightHide
        )
      );
    }

    if (this._on(BehaviorType.FollowPath)) {
      this._vSteeringForce.add(
        Vector2D.mul(
          this._followPath(),
          this._weightFollowPath
        )
      );
    }

    this._vSteeringForce.truncate(this._vehicle.maxForce);

    return this._vSteeringForce;
  }

  get isSpacePartitioningOn () {
    return this._cellSpaceOn;
  }

  set summingMethod (method) {
    this._summingMethod = method;
  }
}

// enums
var SummingMethod = SteeringBehavior.SummingMethod = {
  WeightedAverage: 0,
  Prioritized: 1,
  Dithered: 2
};

var Deceleration = SteeringBehavior.Deceleration = {
  Fast: 1,
  Normal: 2,
  Slow: 3
};

var BehaviorType = SteeringBehavior.BehaviorType = {
  None: 0x00000,
  Seek: 0x00002,
  Flee: 0x00004,
  Arrive: 0x00008,
  Wander: 0x00010,
  Cohesion: 0x00020,
  Separation: 0x00040,
  Allignment: 0x00080,
  ObstacleAvoidance: 0x00100,
  WallAvoidance: 0x00200,
  FollowPath: 0x00400,
  Pursuit: 0x00800,
  Evade: 0x01000,
  Interpose: 0x02000,
  Hide: 0x04000,
  Flock: 0x08000,
  OffsetPursuit: 0x10000
};

export default SteeringBehavior;
