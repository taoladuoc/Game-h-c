import React from 'react';
import { PLAYER_HEIGHT, PLAYER_WIDTH, PLAYER_LEFT_POSITION } from '../constants';

interface PlayerProps {
  playerY: number;
}

const Player: React.FC<PlayerProps> = ({ playerY }) => {
  return (
    <div
      className="absolute flex items-center justify-center"
      style={{
        left: `${PLAYER_LEFT_POSITION}px`,
        bottom: `${playerY}px`,
        width: `${PLAYER_WIDTH}px`,
        height: `${PLAYER_HEIGHT}px`,
        fontSize: `${PLAYER_HEIGHT * 0.9}px`,
        lineHeight: 1,
        transform: 'scaleX(-1)',
      }}
    >
      🤺
    </div>
  );
};

export default Player;