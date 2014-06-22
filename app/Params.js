var Params = {
  numAgents: 300,
  numObstacles: 7,
  minObstacleRadius: 10,
  maxObstacleRadius: 30,
  // number of horizontal cells used for spatial partitioning
  numCellsX: 7,
  // number of vertical cells used for spatial partitioning
  numCellsY: 7,
  // how many samples the smoother will use to average a value
  numSamplesForSmoothing: 10,
  // this is used to multiply the steering force AND all the multipliers found in SteeringBehavior
  steeringForceTweaker: 200,
  steeringForce: 2,
  maxSpeed: 150,
  vehicleMass: 1,
  vehicleScale: 15,
  // use these values to tweak the amount that each steering force contributes to the total steering force
  separationWeight: 1,
  alignmentWeight: 1,
  cohesionWeight: 2,
  obstacleAvoidanceWeight: 10,
  wallAvoidanceWeight: 10,
  wanderWeight: 1,
  seekWeight: 1,
  fleeWeight: 1,
  arriveWeight: 1,
  pursuitWeight: 1,
  offsetPursuitWeight: 1,
  interposeWeight: 1,
  hideWeight: 1,
  evadeWeight: 0.01,
  followPathWeight: 0.05,
  // how close a neighbour must be before an agent perceives it (considers it to be within its neighborhood)
  viewDistance: 50,
  maxTurnRatePerSecond: Math.PI,
  // used in obstacle avoidance
  minDetectionBoxLength: 40,
  // used in wall avoidance
  wallDetectionFeelerLength: 40,
  // these are the probabilities that a steering behavior will be used
  // when the Prioritized Dither calculate method is used to sum
  // combined behaviors
  prWallAvoidance: 0.5,
  prObstacleAvoidance: 0.5,
  prSeparation: 0.2,
  prAlignment: 0.3,
  prCohesion: 0.6,
  prWander: 0.8,
  prSeek: 0.8,
  prFlee: 0.6,
  prEvade: 1.0,
  prHide: 0.8,
  prArrive: 0.5
};

export default Params;
