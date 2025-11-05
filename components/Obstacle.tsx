import React from 'react';
import { ObstacleType } from '../types';
import { GROUND_HEIGHT } from '../constants';

interface ObstacleProps {
  obstacle: ObstacleType;
}

const Obstacle: React.FC<ObstacleProps> = ({ obstacle }) => {
  return (
    <div
      className="absolute flex items-center justify-center"
      style={{
        left: `${obstacle.x}px`,
        bottom: `${GROUND_HEIGHT}px`,
        width: `${obstacle.width}px`,
        height: `${obstacle.height}px`,
        fontSize: `${obstacle.height * 0.9}px`,
        lineHeight: 1,
      }}
    >
      {obstacle.icon}
    </div>
  );
};

export default Obstacle;