export const ROBOT_ASSET_SRC = "/assets/solar-robot.png";

/**
 * How the hero renders the rover.
 *
 * "procedural" draws a stylised 3D rig (RobotRig.tsx) and never touches the
 * filesystem. "image" restores the original photographic path, which reads
 * ROBOT_ASSET_SRC and uses ROBOT_HEAD_VIEWPORT below for the clipped head
 * overlay. Switching modes must not require rewriting the hero.
 *
 * The asset referenced by ROBOT_ASSET_SRC has never existed in this repo, so
 * "procedural" is the only working mode.
 */
export const ROBOT_MODEL_MODE = "procedural" as const;
export type RobotModelMode = typeof ROBOT_MODEL_MODE;

/**
 * Head viewport, expressed as percentages of the robot image box.
 * The crop rectangle is where the PTZ camera head sits in your image;
 * tune these four numbers when you drop in the real asset.
 */
export const ROBOT_HEAD_VIEWPORT = {
  x: 46,
  y: 6,
  w: 22,
  h: 20,
  // Pivot below the crop, at the neck/mast joint.
  originX: 50,
  originY: 128,
} as const;
