import React, { useState, useEffect } from 'react';
import { Difficulty, QuestionBank, Question } from '../types';

interface SettingsModalProps {
  currentDifficulty: Difficulty;
  currentBank: QuestionBank;
  availableDifficulties: Difficulty[];
  availableBanks: QuestionBank[];
  onSave: (difficulty: Difficulty, bank: QuestionBank) => void;
  onClose: () => void;
}

// Interface for the new JSON input structure
interface CustomQuestionFormat {
    id: number | string;
    question: string;
    options: string[];
    correctAnswer: string;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  currentDifficulty,
  currentBank,
  availableDifficulties,
  availableBanks,
  onSave,
  onClose,
}) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>(currentDifficulty);
  const [selectedBank, setSelectedBank] = useState<QuestionBank>(currentBank);
  const [localAvailableBanks, setLocalAvailableBanks] = useState<QuestionBank[]>(availableBanks);
  const [customJson, setCustomJson] = useState('');
  const [jsonFeedback, setJsonFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    // If the currently selected bank is a custom one, make sure it's in the list
    if (!availableBanks.some(b => b.name === currentBank.name)) {
        setLocalAvailableBanks([...availableBanks, currentBank]);
    } else {
        setLocalAvailableBanks(availableBanks);
    }
  }, [availableBanks, currentBank]);


  const handleSave = () => {
    onSave(selectedDifficulty, selectedBank);
  };

  const handleBankChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const bankName = event.target.value;
    const newBank = localAvailableBanks.find(b => b.name === bankName);
    if (newBank) {
        setSelectedBank(newBank);
    }
  };
  
  const validateCustomJson = (data: any): data is CustomQuestionFormat[] => {
    if (!Array.isArray(data)) return false;
    return data.every(q => 
        (typeof q.id === 'number' || typeof q.id === 'string') &&
        typeof q.question === 'string' &&
        Array.isArray(q.options) &&
        q.options.length === 4 &&
        q.options.every((opt: any) => typeof opt === 'string') &&
        typeof q.correctAnswer === 'string' &&
        q.options.includes(q.correctAnswer) // Important: Check if the answer is in the options
    );
  }

  const handleLoadJson = () => {
    setJsonFeedback(null);
    if (!customJson.trim()) {
        setJsonFeedback({ type: 'error', message: 'Vui lòng nhập dữ liệu JSON.' });
        return;
    }

    try {
        const data = JSON.parse(customJson);
        if (validateCustomJson(data)) {
            // Transform the custom format to the app's internal Question format
            const transformedQuestions: Question[] = data.map(customQ => {
                const correctIndex = customQ.options.findIndex(opt => opt === customQ.correctAnswer);
                return {
                    questionText: customQ.question,
                    options: customQ.options,
                    correctAnswerIndex: correctIndex,
                };
            });

            const newBank: QuestionBank = {
                name: "Bộ câu hỏi Tùy chỉnh",
                questions: transformedQuestions
            };

            // Remove old custom bank if it exists, then add the new one
            setLocalAvailableBanks(prev => [...prev.filter(b => b.name !== newBank.name), newBank]);
            setSelectedBank(newBank);
            setJsonFeedback({ type: 'success', message: `Tải thành công ${data.length} câu hỏi!` });
        } else {
            setJsonFeedback({ type: 'error', message: 'Dữ liệu không đúng định dạng. Vui lòng kiểm tra lại.' });
        }
    } catch (error) {
        setJsonFeedback({ type: 'error', message: 'Lỗi phân tích JSON. Vui lòng kiểm tra cú pháp.' });
    }
  }

  const jsonExample = `[
  {
    "id": 12345,
    "question": "Câu hỏi của bạn ở đây?",
    "options": ["Đáp án A", "Đáp án B", "Đáp án C", "Đáp án D"],
    "correctAnswer": "Đáp án A"
  }
]`

  return (
    <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center z-30 p-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-2xl text-left border-2 border-gray-600 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">Cài đặt</h2>
            <button onClick={onClose} className="text-3xl hover:text-red-500">&times;</button>
        </div>

        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Độ khó</label>
          <div className="flex gap-2">
            {availableDifficulties.map(diff => (
              <button
                key={diff.name}
                onClick={() => setSelectedDifficulty(diff)}
                className={`flex-1 p-3 text-lg rounded-lg transition-colors duration-200 ${
                  selectedDifficulty.name === diff.name
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                {diff.name}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2" htmlFor="question-bank">Bộ câu hỏi</label>
          <select
            id="question-bank"
            value={selectedBank.name}
            onChange={handleBankChange}
            className="w-full p-3 bg-gray-700 text-white rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {localAvailableBanks.map(bank => (
              <option key={bank.name} value={bank.name}>
                {bank.name}
              </option>
            ))}
          </select>
        </div>

        <div className="border-t border-gray-600 pt-6">
             <label className="block text-xl font-semibold mb-2" htmlFor="custom-json">Thêm bộ câu hỏi tùy chỉnh (JSON)</label>
             <p className="text-sm text-gray-400 mb-2">Dán một mảng các câu hỏi theo định dạng ví dụ bên dưới.</p>
             <textarea 
                id="custom-json"
                value={customJson}
                onChange={(e) => setCustomJson(e.target.value)}
                className="w-full h-32 p-2 bg-gray-900 text-white rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Dán JSON của bạn vào đây..."
            />
            <div className="mt-2">
                <button onClick={handleLoadJson} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-lg font-bold rounded-lg">
                    Tải câu hỏi
                </button>
                {jsonFeedback && (
                    <span className={`ml-4 text-lg font-semibold ${jsonFeedback.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                        {jsonFeedback.message}
                    </span>
                )}
            </div>
             <details className="mt-2 text-sm">
                <summary className="cursor-pointer text-gray-400 hover:text-white">Xem định dạng ví dụ</summary>
                <pre className="mt-2 p-3 bg-gray-900 text-green-300 rounded-md text-xs whitespace-pre-wrap">
                    <code>{jsonExample}</code>
                </pre>
            </details>
        </div>


        <div className="flex justify-end mt-8 border-t border-gray-600 pt-6">
            <button 
                onClick={handleSave}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-xl font-bold rounded-lg"
            >
                Lưu & Chơi lại
            </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
