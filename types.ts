export interface Question {
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
}

export interface ObstacleType {
  id: number;
  x: number;
  width: number;
  height: number;
  icon: string;
}

export type GameState = 'start' | 'playing' | 'paused' | 'finished';

export interface Difficulty {
  name: string;
  initialSpeed: number;
  maxSpeed: number;
  speedIncreaseAmount: number;
}

export interface QuestionBank {
    name: string;
    questions: Question[];
}
