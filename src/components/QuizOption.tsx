import React from 'react';

interface QuizOptionProps {
  option: string;
  onSelect: () => void;
  disabled: boolean;
  index: number;
  feedback: { correct: boolean; selected: string } | null;
}

const QuizOption: React.FC<QuizOptionProps> = ({ option, onSelect, disabled, index, feedback }) => {
  const isSelected = feedback?.selected === option;
  const isCorrect = feedback?.correct && isSelected;
  const isIncorrect = !feedback?.correct && isSelected;

  return (
    <button
      className={`w-full p-3 border rounded mb-2 ${isCorrect ? 'bg-green-200' : isIncorrect ? 'bg-red-200' : 'hover:bg-gray-100'}`}
      onClick={onSelect}
      disabled={disabled}
    >
      {String.fromCharCode(65 + index)}. {option}
    </button>
  );
};

export default QuizOption;
