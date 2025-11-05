import React, { useState, useEffect, useRef, useCallback } from 'react';
import Player from './components/Player';
import Obstacle from './components/Obstacle';
import QuestionModal from './components/QuestionModal';
import SettingsModal from './components/SettingsModal';
import { GameState, ObstacleType, Question, Difficulty, QuestionBank } from './types';
import { 
  ALL_QUESTION_BANKS,
  DIFFICULTY_LEVELS,
  GROUND_HEIGHT, 
  PLAYER_HEIGHT, 
  PLAYER_WIDTH, 
  PLAYER_LEFT_POSITION,
  JUMP_FORCE,
  GRAVITY,
  SPEED_INCREASE_INTERVAL,
  OBSTACLE_SPAWN_RATE,
  OBSTACLE_MIN_WIDTH,
  OBSTACLE_MAX_WIDTH,
  OBSTACLE_MIN_HEIGHT,
  OBSTACLE_MAX_HEIGHT,
  OBSTACLE_ICONS
} from './constants';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('start');
  const [playerY, setPlayerY] = useState(GROUND_HEIGHT);
  const [playerVelocityY, setPlayerVelocityY] = useState(0);
  const [obstacles, setObstacles] = useState<ObstacleType[]>([]);
  const [answeredQuestionIndices, setAnsweredQuestionIndices] = useState<Set<number>>(new Set());
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [collidedObstacleId, setCollidedObstacleId] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [gameSpeed, setGameSpeed] = useState(DIFFICULTY_LEVELS[0].initialSpeed);
  
  // Settings State
  const [difficulty, setDifficulty] = useState<Difficulty>(DIFFICULTY_LEVELS[0]);
  const [questionBank, setQuestionBank] = useState<QuestionBank>(ALL_QUESTION_BANKS[0]);
  const [showSettings, setShowSettings] = useState(false);


  const gameLoopRef = useRef<number>();
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const obstacleTimerRef = useRef<number>(0);

  const resetGame = useCallback(() => {
    setPlayerY(GROUND_HEIGHT);
    setPlayerVelocityY(0);
    setObstacles([]);
    setAnsweredQuestionIndices(new Set());
    setCurrentQuestion(null);
    setCollidedObstacleId(null);
    setGameState('start');
    setScore(0);
    setGameSpeed(difficulty.initialSpeed);
    obstacleTimerRef.current = 0;
  }, [difficulty]);

  const startGame = () => {
    // Reset with current settings before starting
    setPlayerY(GROUND_HEIGHT);
    setPlayerVelocityY(0);
    setObstacles([]);
    setAnsweredQuestionIndices(new Set());
    setCurrentQuestion(null);
    setCollidedObstacleId(null);
    setScore(0);
    setGameSpeed(difficulty.initialSpeed);
    obstacleTimerRef.current = 0;
    setGameState('playing');
  };
  
  const handleJump = useCallback(() => {
    if (gameState === 'playing' && playerY === GROUND_HEIGHT) {
      setPlayerVelocityY(JUMP_FORCE);
    }
  }, [gameState, playerY]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (gameState === 'playing') {
          handleJump();
        }
      }
    };
    
    const handleScreenInteraction = () => {
       if (gameState === 'playing') {
          handleJump();
        }
    }

    window.addEventListener('keydown', handleKeyPress);
    window.addEventListener('mousedown', handleScreenInteraction);
    window.addEventListener('touchstart', handleScreenInteraction);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('mousedown', handleScreenInteraction);
      window.removeEventListener('touchstart', handleScreenInteraction);
    };
  }, [handleJump, gameState]);
  
  const handleCollision = useCallback((obstacle: ObstacleType) => {
    setGameState('paused');
    setCollidedObstacleId(obstacle.id);

    const unansweredIndices = questionBank.questions
      .map((_, index) => index)
      .filter(index => !answeredQuestionIndices.has(index));

    if (unansweredIndices.length > 0) {
      const randomIndex = unansweredIndices[Math.floor(Math.random() * unansweredIndices.length)];
      setCurrentQuestion(questionBank.questions[randomIndex]);
    } else {
      setGameState('finished');
    }
  }, [answeredQuestionIndices, questionBank]);
  
  const gameLoop = useCallback(() => {
    if (gameState !== 'playing' || !gameContainerRef.current) {
        return;
    }

    const gameWidth = gameContainerRef.current.offsetWidth;

    // Player physics
    let nextVelocity = playerVelocityY + GRAVITY;
    let nextY = playerY + nextVelocity;

    if (nextY < GROUND_HEIGHT) {
      nextY = GROUND_HEIGHT;
      nextVelocity = 0;
    }
    setPlayerY(nextY);
    setPlayerVelocityY(nextVelocity);


    // Obstacle management
    obstacleTimerRef.current++;
    setObstacles(prevObstacles => {
        const movedObstacles = prevObstacles
          .map(o => ({ ...o, x: o.x - gameSpeed }))
          .filter(o => o.x > -o.width);

        if (obstacleTimerRef.current > OBSTACLE_SPAWN_RATE && Math.random() > 0.5) {
            obstacleTimerRef.current = 0;
            const newObstacle: ObstacleType = {
                id: Date.now(),
                x: gameWidth,
                width: Math.floor(Math.random() * (OBSTACLE_MAX_WIDTH - OBSTACLE_MIN_WIDTH + 1)) + OBSTACLE_MIN_WIDTH,
                height: Math.floor(Math.random() * (OBSTACLE_MAX_HEIGHT - OBSTACLE_MIN_HEIGHT + 1)) + OBSTACLE_MIN_HEIGHT,
                icon: OBSTACLE_ICONS[Math.floor(Math.random() * OBSTACLE_ICONS.length)],
            };
            return [...movedObstacles, newObstacle];
        }
        return movedObstacles;
    });
    
    // Score and Speed
    setScore(prevScore => {
        const newScore = prevScore + 1;
        if (newScore > 0 && newScore % SPEED_INCREASE_INTERVAL === 0) {
            setGameSpeed(prevSpeed => Math.min(prevSpeed + difficulty.speedIncreaseAmount, difficulty.maxSpeed));
        }
        return newScore;
    });


    // Collision detection
    const playerRect = { x: PLAYER_LEFT_POSITION, y: playerY, width: PLAYER_WIDTH, height: PLAYER_HEIGHT };
    setObstacles(currentObstacles => {
      for (const obstacle of currentObstacles) {
          const obstacleRect = { x: obstacle.x, y: GROUND_HEIGHT, width: obstacle.width, height: obstacle.height };
          if (
              playerRect.x < obstacleRect.x + obstacleRect.width &&
              playerRect.x + playerRect.width > obstacleRect.x &&
              playerRect.y + playerRect.height > obstacleRect.y &&
              playerRect.y < obstacleRect.y + obstacleRect.height
          ) {
              handleCollision(obstacle);
              break; 
          }
      }
      return currentObstacles;
    });

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [gameState, playerVelocityY, playerY, gameSpeed, handleCollision, difficulty]);

  useEffect(() => {
    if (gameState === 'playing') {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
    return () => {
      if(gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [gameState, gameLoop]);
  
  const resumeGame = useCallback(() => {
    if (currentQuestion) {
      const questionIndex = questionBank.questions.findIndex(q => q.questionText === currentQuestion.questionText);
      setAnsweredQuestionIndices(prev => new Set(prev).add(questionIndex));
    }
    setObstacles(prev => prev.filter(o => o.id !== collidedObstacleId));
    setCurrentQuestion(null);
    setCollidedObstacleId(null);

    if (answeredQuestionIndices.size + 1 >= questionBank.questions.length) {
        setGameState('finished');
    } else {
        setGameState('playing');
    }
  }, [collidedObstacleId, currentQuestion, answeredQuestionIndices, questionBank]);

  const handleSaveSettings = (newDifficulty: Difficulty, newQuestionBank: QuestionBank) => {
    setDifficulty(newDifficulty);
    setQuestionBank(newQuestionBank);
    setShowSettings(false);
    resetGame(); // Reset game state to apply new settings
  };
  
  return (
    <div className="bg-gray-800 text-white w-screen h-screen flex flex-col items-center justify-center font-mono overflow-hidden">
      <div className="absolute top-4 left-4 text-2xl z-10">Điểm: {score}</div>
       <div className="absolute top-4 right-4 text-xl z-10 text-center">
         Tốc độ: {gameSpeed.toFixed(1)} <br/> 
         Câu hỏi: {answeredQuestionIndices.size} / {questionBank.questions.length}
       </div>
      
      <div ref={gameContainerRef} className="relative w-full h-full max-w-6xl max-h-[700px] bg-sky-800 border-4 border-gray-500 overflow-hidden">
         <div className="absolute bottom-0 left-0 w-full bg-green-800" style={{ height: `${GROUND_HEIGHT}px` }} />
         <img src="https://dangkyhoc.com/logo.png" alt="Logo" className="absolute w-16 h-16 object-contain opacity-50" style={{ bottom: `${GROUND_HEIGHT + 5}px`, left: '10px' }} />


        {gameState !== 'start' && <Player playerY={playerY} />}
        {obstacles.map(obstacle => (
          <Obstacle key={obstacle.id} obstacle={obstacle} />
        ))}
        
        {gameState === 'start' && !showSettings && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center z-20 text-center p-4">
            <img src="https://dangkyhoc.com/logo.png" alt="Logo" className="w-32 h-32 mb-4 object-contain" />
            <h1 className="text-5xl font-bold mb-4">Hiệp Sĩ Vượt Ải</h1>
            <p className="text-xl mb-8">Nhấn phím CÁCH (Space) hoặc chạm màn hình để nhảy.<br/>Va vào quái vật để trả lời câu hỏi!</p>
            <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={startGame} className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-2xl rounded-lg animate-pulse">
                Bắt đầu
                </button>
                <button onClick={() => setShowSettings(true)} className="px-8 py-4 bg-gray-600 hover:bg-gray-700 text-2xl rounded-lg">
                Cài đặt
                </button>
            </div>
             <div className="mt-8 text-lg">
                <p>Độ khó: <span className="font-bold text-yellow-400">{difficulty.name}</span></p>
                <p>Bộ câu hỏi: <span className="font-bold text-yellow-400">{questionBank.name}</span></p>
            </div>
            <div className="mt-8 border-t border-gray-500 pt-6 w-full max-w-lg">
                <h3 className="text-xl text-yellow-300 font-semibold mb-4">Mời tham gia nhóm Zalo</h3>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a href="https://zalo.me/g/tncmdq530" target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-lg rounded-lg">
                        🎬 Nhóm tạo Video từ SGK
                    </a>
                    <a href="https://zalo.me/g/uditpr888" target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-lg rounded-lg">
                        📚 Nhóm nhận học liệu
                    </a>
                </div>
            </div>
            <div className="absolute bottom-4 text-gray-400 text-sm">
                Tác giả: Nguyễn Thành Được
            </div>
          </div>
        )}

        {gameState === 'finished' && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center z-20 text-center p-4">
            <h1 className="text-5xl font-bold mb-4 text-yellow-400">Chúc Mừng!</h1>
            <p className="text-2xl mb-8">Bạn đã trả lời tất cả các câu hỏi.</p>
             <p className="text-xl mb-8">Điểm cuối cùng: {score}</p>
            <button onClick={resetGame} className="px-8 py-4 bg-green-600 hover:bg-green-700 text-2xl rounded-lg">
              Chơi lại
            </button>
          </div>
        )}

        {gameState === 'paused' && currentQuestion && (
          <QuestionModal question={currentQuestion} onAnswerChosen={resumeGame} />
        )}

        {showSettings && (
            <SettingsModal 
                currentDifficulty={difficulty}
                currentBank={questionBank}
                availableDifficulties={DIFFICULTY_LEVELS}
                availableBanks={ALL_QUESTION_BANKS}
                onSave={handleSaveSettings}
                onClose={() => setShowSettings(false)}
            />
        )}
      </div>
    </div>
  );
};

export default App;