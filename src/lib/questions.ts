export interface Question {
  question_text: string;
  options: string[];
  correct_index: number;
}

export const DEFAULT_QUESTIONS: Question[] = [
  {
    question_text: "탕수육은?",
    options: ["부먹", "찍먹", "반반", "안 먹음"],
    correct_index: 0,
  },
  {
    question_text: "치킨을 시킨다면?",
    options: ["후라이드", "양념", "반반", "간장"],
    correct_index: 0,
  },
  {
    question_text: "주말 아침에 일어나는 시간은?",
    options: ["6시 이전", "7~9시", "10~11시", "12시 이후"],
    correct_index: 2,
  },
  {
    question_text: "여행 스타일은?",
    options: ["계획파", "즉흥파", "반반", "여행 안 좋아함"],
    correct_index: 0,
  },
  {
    question_text: "스트레스 해소법은?",
    options: ["운동", "수면", "맛있는 거 먹기", "혼자만의 시간"],
    correct_index: 2,
  },
  {
    question_text: "좋아하는 계절은?",
    options: ["봄", "여름", "가을", "겨울"],
    correct_index: 2,
  },
  {
    question_text: "성격 유형은?",
    options: ["외향형(E)", "내향형(I)", "상황에 따라 다름", "모름"],
    correct_index: 0,
  },
  {
    question_text: "선호하는 연락 방식은?",
    options: ["카카오톡", "전화", "문자", "직접 만남"],
    correct_index: 0,
  },
  {
    question_text: "음식을 먹을 때?",
    options: ["천천히 꼼꼼히", "빠르게", "상황에 따라", "가리는 게 많음"],
    correct_index: 0,
  },
  {
    question_text: "취침 전 하는 일은?",
    options: ["스마트폰", "독서", "음악 듣기", "바로 수면"],
    correct_index: 0,
  },
];
