import React from 'react';
import { motion } from 'framer-motion';

const Dice3D = ({ value = 1, isRolling = false }) => {
  // Preset rotation transforms for 3D faces (1 to 6)
  const faceRotations = {
    1: { rotateX: 0, rotateY: 0 },
    2: { rotateX: 0, rotateY: -180 },
    3: { rotateX: 0, rotateY: 90 },
    4: { rotateX: 0, rotateY: -90 },
    5: { rotateX: 90, rotateY: 0 },
    6: { rotateX: -90, rotateY: 0 }
  };

  const targetRotation = faceRotations[value] || faceRotations[1];

  return (
    <div className="dice-scene flex items-center justify-center p-8">
      <motion.div
        className="dice-cube"
        animate={
          isRolling
            ? {
                rotateX: [0, 720, 1440, 1800 + targetRotation.rotateX],
                rotateY: [0, 1080, 2160, 2520 + targetRotation.rotateY],
                scale: [1, 1.25, 0.9, 1]
              }
            : {
                rotateX: targetRotation.rotateX,
                rotateY: targetRotation.rotateY
              }
        }
        transition={
          isRolling
            ? { duration: 1.6, ease: [0.25, 1, 0.5, 1] }
            : { duration: 0.5 }
        }
      >
        {/* Face 1 */}
        <div className="dice-face face-1">
          <div className="pip"></div>
        </div>

        {/* Face 2 */}
        <div className="dice-face face-2 flex flex-col justify-between p-4">
          <div className="self-start pip"></div>
          <div className="self-end pip"></div>
        </div>

        {/* Face 3 */}
        <div className="dice-face face-3 flex justify-between p-4">
          <div className="self-start pip"></div>
          <div className="self-center pip"></div>
          <div className="self-end pip"></div>
        </div>

        {/* Face 4 */}
        <div className="dice-face face-4 grid grid-cols-2 gap-4 p-4">
          <div className="pip"></div>
          <div className="pip"></div>
          <div className="pip"></div>
          <div className="pip"></div>
        </div>

        {/* Face 5 */}
        <div className="dice-face face-5 grid grid-cols-3 gap-2 p-4 items-center">
          <div className="pip col-span-1 justify-self-start"></div>
          <div className="col-span-1"></div>
          <div className="pip col-span-1 justify-self-end"></div>
          <div className="col-span-1"></div>
          <div className="pip col-span-1 justify-self-center"></div>
          <div className="col-span-1"></div>
          <div className="pip col-span-1 justify-self-start"></div>
          <div className="col-span-1"></div>
          <div className="pip col-span-1 justify-self-end"></div>
        </div>

        {/* Face 6 */}
        <div className="dice-face face-6 grid grid-cols-2 gap-3 p-4">
          <div className="pip"></div>
          <div className="pip"></div>
          <div className="pip"></div>
          <div className="pip"></div>
          <div className="pip"></div>
          <div className="pip"></div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dice3D;
