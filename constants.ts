import { Question, Difficulty, QuestionBank } from './types';

export const QUESTION_BANK_GENERAL_VI: Question[] = [
  {
    questionText: "Đâu là thủ đô của Việt Nam?",
    options: ["TP. Hồ Chí Minh", "Đà Nẵng", "Hải Phòng", "Hà Nội"],
    correctAnswerIndex: 3,
  },
  {
    questionText: "Hành tinh nào được mệnh danh là 'Hành tinh Đỏ'?",
    options: ["Sao Thủy", "Sao Hỏa", "Sao Mộc", "Sao Kim"],
    correctAnswerIndex: 1,
  },
  {
    questionText: "Loài động vật có vú lớn nhất thế giới là gì?",
    options: ["Voi", "Cá voi xanh", "Hươu cao cổ", "Cá mập trắng"],
    correctAnswerIndex: 1,
  },
  {
    questionText: "Ai là tác giả của 'Truyện Kiều'?",
    options: ["Hồ Xuân Hương", "Nguyễn Du", "Bà Huyện Thanh Quan", "Nguyễn Bỉnh Khiêm"],
    correctAnswerIndex: 1,
  },
  {
    questionText: "Công thức hóa học của nước là gì?",
    options: ["O2", "CO2", "H2O", "NaCl"],
    correctAnswerIndex: 2,
  },
  {
    questionText: "Trên Trái Đất có bao nhiêu châu lục?",
    options: ["5", "6", "7", "8"],
    correctAnswerIndex: 2,
  },
  {
    questionText: "Ngọn núi cao nhất thế giới là ngọn núi nào?",
    options: ["K2", "Kangchenjunga", "Lhotse", "Everest"],
    correctAnswerIndex: 3,
  },
  {
    questionText: "Thành phố nào của Ý nổi tiếng với các con kênh?",
    options: ["Rome", "Florence", "Venice", "Milan"],
    correctAnswerIndex: 2,
  },
  {
    questionText: "Quốc gia nào có diện tích lớn nhất thế giới?",
    options: ["Canada", "Trung Quốc", "Hoa Kỳ", "Nga"],
    correctAnswerIndex: 3,
  },
  {
    questionText: "Kết quả của phép tính 15 x 15 là bao nhiêu?",
    options: ["215", "225", "235", "245"],
    correctAnswerIndex: 1,
  },
];

export const QUESTION_BANK_SCIENCE_VI: Question[] = [
    {
        questionText: "Lực hấp dẫn được nhà khoa học nào phát hiện ra?",
        options: ["Albert Einstein", "Galileo Galilei", "Isaac Newton", "Nikola Tesla"],
        correctAnswerIndex: 2,
    },
    {
        questionText: "Khí nào cần thiết cho sự sống của thực vật (quang hợp)?",
        options: ["Oxy (O2)", "Nitơ (N2)", "Carbon Dioxide (CO2)", "Hydro (H2)"],
        correctAnswerIndex: 2,
    },
    {
        questionText: "Hệ mặt trời của chúng ta có bao nhiêu hành tinh?",
        options: ["7", "8", "9", "10"],
        correctAnswerIndex: 1,
    },
    {
        questionText: "Đơn vị cơ bản của sự sống là gì?",
        options: ["Tế bào", "Phân tử", "Nguyên tử", "Mô"],
        correctAnswerIndex: 0,
    },
    {
        questionText: "Kim loại nào ở trạng thái lỏng ở nhiệt độ phòng?",
        options: ["Sắt", "Vàng", "Nhôm", "Thủy ngân"],
        correctAnswerIndex: 3,
    },
    {
        questionText: "Âm thanh truyền đi nhanh nhất trong môi trường nào?",
        options: ["Chân không", "Không khí", "Nước", "Chất rắn"],
        correctAnswerIndex: 3,
    },
    {
        questionText: "Lớp nào của khí quyển Trái Đất bảo vệ chúng ta khỏi bức xạ tia cực tím?",
        options: ["Tầng đối lưu", "Tầng bình lưu (Ozone)", "Tầng trung lưu", "Tầng nhiệt"],
        correctAnswerIndex: 1,
    },
    {
        questionText: "DNA là viết tắt của từ gì?",
        options: ["Axit Deoxyribonucleic", "Axit Ribonucleic", "Axit Deinonucleic", "Axit Double Nucleic"],
        correctAnswerIndex: 0,
    },
    {
        questionText: "Nhiệt độ sôi của nước ở áp suất tiêu chuẩn là bao nhiêu?",
        options: ["90°C", "100°C", "110°C", "120°C"],
        correctAnswerIndex: 1,
    },
    {
        questionText: "Hành tinh nào gần Mặt Trời nhất?",
        options: ["Sao Kim", "Trái Đất", "Sao Thủy", "Sao Hỏa"],
        correctAnswerIndex: 2,
    }
];

export const ALL_QUESTION_BANKS: QuestionBank[] = [
    { name: "Kiến thức chung", questions: QUESTION_BANK_GENERAL_VI },
    { name: "Khoa học & Tự nhiên", questions: QUESTION_BANK_SCIENCE_VI },
];

export const DIFFICULTY_LEVELS: Difficulty[] = [
    { name: "Dễ", initialSpeed: 6, maxSpeed: 12, speedIncreaseAmount: 0.4 },
    { name: "Trung bình", initialSpeed: 8, maxSpeed: 18, speedIncreaseAmount: 0.6 },
    { name: "Khó", initialSpeed: 10, maxSpeed: 25, speedIncreaseAmount: 1.0 },
];


export const OBSTACLE_ICONS = ['🐲', '👹', '🦖', '🐺', '🦂', '🐍'];

// Game Physics and Dimensions
export const GRAVITY = -0.8;
export const JUMP_FORCE = 18;
export const PLAYER_LEFT_POSITION = 60;
export const PLAYER_WIDTH = 50;
export const PLAYER_HEIGHT = 60;
export const GROUND_HEIGHT = 40;
export const SPEED_INCREASE_INTERVAL = 500; // Increase speed every 500 points
export const OBSTACLE_MIN_WIDTH = 40;
export const OBSTACLE_MAX_WIDTH = 60;
export const OBSTACLE_MIN_HEIGHT = 50;
export const OBSTACLE_MAX_HEIGHT = 80;
export const OBSTACLE_SPAWN_RATE = 80; // Lower is more frequent--- START OF FILE App.tsx ---