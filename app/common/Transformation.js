import C2DMatrix from './C2DMatrix';
import Vector2D from './Vector2D';

class Transformation {
/*
 * Given an array of 2D vectors, a position, orientation and scale,
 * this function transforms the 2D vectors into the object's world space.
 */
  static worldTransform (points, vPos, vForward, vSide, vScale) {
    // copy the original vertices into the buffer about to be transformed
    var points = Vector2D.cloneVectors(points);

    // create a transformation matrix
    var matTransform = new C2DMatrix();

    // scale
    if (vScale && (vScale.x != 1 || vScale.y != 1)) {
        matTransform.scale(vScale.x, vScale.y);
    }

    // rotate
    matTransform.rotate(vForward, vSide);

    // and translate
    matTransform.translate(vPos.x, vPos.y);

    // now transform the object's vertices
    matTransform.transformVector2Ds(points);

    return points;
  }

  /**
   * Transforms a point from the agent's local space into world space.
   */
  static pointToWorldSpace (vPoint, vAgentHeading, vAgentSide, vAgentPosition) {
    // make a copy of the point
    var transPoint = new Vector2D(point);

    // create a transformation matrix
    var matTransform = new C2DMatrix();

    // rotate
    matTransform.rotate(vAgentHeading, vAgentSide);

    // and translate
    matTransform.translate(vAgentPosition.x, vAgentPosition.y);

    // now transform the vertices
    matTransform.transformVector2Ds(transPoint);

    return transPoint;
  }

  /**
   * Transforms a vector from the agent's local space into world space.
   */
  static vectorToWorldSpace (vec, vAgentHeading, vAgentSide) {
    // make a copy of the point
    var transVec = new Vector2D(vec);

    // create a transformation matrix
    var matTransform = new C2DMatrix();

    //rotate
    matTransform.rotate(vAgentHeading, vAgentSide);

    //now transform the vertices
    matTransform.transformVector2Ds(transVec);

    return transVec;
  }

  static pointToLocalSpace (vPoint, vAgentHeading, vAgentSide, vAgentPosition) {
    // make a copy of the point
    var transPoint = new Vector2D(point);

    // create a transformation matrix
    var matTransform = new C2DMatrix();

    var tx = -vAgentPosition.dot(vAgentHeading);
    var ty = -vAgentPosition.dot(vAgentSide);

    // create the transformation matrix
    matTransform._11(vAgentHeading.x); matTransform._12(vAgentSide.x);
    matTransform._21(vAgentHeading.y); matTransform._22(vAgentSide.y);
    matTransform._31(tx);              matTransform._32(ty);

    // now transform the vertices
    matTransform.transformVector2Ds(transPoint);

    return transPoint;
  }

  static vectorToLocalSpace (vec, vAgentHeading, vAgentSide) {
    // make a copy of the point
    var transPoint = new Vector2D(vec);

    // create a transformation matrix
    var matTransform = new C2DMatrix();

    // create the transformation matrix
    matTransform._11(vAgentHeading.x);   matTransform._12(vAgentSide.x);
    matTransform._21(vAgentHeading.y);   matTransform._22(vAgentSide.y);

    // now transform the vertices
    matTransform.transformVector2Ds(transPoint);

    return transPoint;
  }

  /**
   * Rotates a vector ang rads around the origin.
   */
  static vec2DRotateAroundOrigin (v, ang) {
    // create a transformation matrix
    var mat = new C2DMatrix();

    // rotate
    mat.rotate(ang);

    // now transform the object's vertices
    mat.transformVector2D(v);
  }

  /*
  * Given an origin, a facing direction, a 'field of view' describing the
  * limit of the outer whiskers, a whisker length and the number of whiskers
  * this method returns a vector containing the end positions of a series
  * of whiskers radiating away from the origin and with equal distance between
  * them. (like the spokes of a wheel clipped to a specific segment size)
  */
  static createWhiskers (numWhiskers, whiskerLength, fov, vFacing, vOrigin) {
    // this is the magnitude of the angle separating each whisker
    var sectorSize = fov / (numWhiskers - 1);
    var whiskers = [];
    var angle = -fov * 0.5;
    var temp = new Vector2D(vFacing);

    for (var w = 0; w < numWhiskers; w++) {
        //create the whisker extending outwards at this angle
        this.vec2DRotateAroundOrigin(temp, angle);
        whiskers.push(Vector2D.add(vOrigin, Vector2D.mul(temp, whiskerLength)));

        angle += sectorSize;
    }

    return whiskers;
  }
}

export default Transformation;
