import React, { useState, useEffect } from 'react';
import { Question } from '../types';

interface QuestionModalProps {
  question: Question;
  onAnswerChosen: () => void;
}

const QuestionModal: React.FC<QuestionModalProps> = ({ question, onAnswerChosen }) => {
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string>('');

  useEffect(() => {
    // Reset state when question changes
    setSelectedAnswerIndex(null);
    setFeedback('');
  }, [question]);

  const handleAnswerClick = (index: number) => {
    if (selectedAnswerIndex !== null) return; // Prevent changing answer

    setSelectedAnswerIndex(index);
    const isCorrect = index === question.correctAnswerIndex;
    setFeedback(isCorrect ? 'Chính xác!' : 'Sai rồi!');

    setTimeout(() => {
      onAnswerChosen();
    }, 1500); // Wait 1.5 seconds before closing the modal
  };
  
  const getButtonClass = (index: number) => {
    if (selectedAnswerIndex === null) {
      return 'bg-indigo-600 hover:bg-indigo-700';
    }
    if (index === question.correctAnswerIndex) {
      return 'bg-green-600'; // Always show correct answer in green
    }
    if (index === selectedAnswerIndex) {
      return 'bg-red-600'; // Show selected incorrect answer in red
    }
    return 'bg-gray-600 opacity-50'; // Dim other incorrect answers
  };

  return (
    <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center z-20 p-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-2xl text-center border-2 border-gray-600">
        <h2 className="text-3xl font-bold mb-6">{question.questionText}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerClick(index)}
              disabled={selectedAnswerIndex !== null}
              className={`p-4 text-xl rounded-lg transition-colors duration-300 ${getButtonClass(index)}`}
            >
              {option}
            </button>
          ))}
        </div>
        {feedback && (
          <p className={`mt-6 text-3xl font-bold ${feedback === 'Chính xác!' ? 'text-green-400' : 'text-red-400'}`}>
            {feedback}
          </p>
        )}
      </div>
    </div>
  );
};

export default QuestionModal;