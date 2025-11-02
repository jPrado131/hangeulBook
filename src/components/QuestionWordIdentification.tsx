import React from 'react';
import AnswerOptions from './AnswerOptions';

interface QuestionWordIdentificationProps {
  randomNumbers: number[];
  currentQuestion: number;
  data: {
    id: number;
    kword: string;
    kreading: string;
    eword: string;
    question: string;
    answer: string;
    question_en: string;
    answer_en: string;
    image: string;
  }[];
  selectedAnswer: number | null;
  isCorrect: boolean | null;
  isReverse: boolean;
  viewKreading: boolean;
  enableReverse: boolean; // Add enableReverse prop
  onReverseChange: (checked: boolean) => void; // Add handler for reverse toggle
  checkAnswer: (selected: number, correct: number) => void;
}

const QuestionWordIdentification: React.FC<QuestionWordIdentificationProps> = ({
  randomNumbers,
  currentQuestion,
  data,
  selectedAnswer,
  isCorrect,
  isReverse,
  viewKreading,
  enableReverse,
  onReverseChange,
  checkAnswer,
}) => {
  return (
    <div
      key={data[currentQuestion].id}
      className={`flex flex-col gap-4 items-center transition-opacity duration-50 mt-5 max-sm:w-full`}
    > 
      <p className=' text-white'><span className="font-semibold text-white">Instruction:</span> Translate the {isReverse ? "english": "korean"} word to {isReverse ? "korean": "english"}.</p>
      <div className="flex flex-col gap-4 items-center max-sm:w-full">
        <a
          className={`text-[12vw] md:text-[60px] text-center sm:text-left ${
            isCorrect === true ? 'text-green-500' : 'text-white'
          } leading-normal`}
          title={data[currentQuestion].kreading}
        >
          {isReverse ? data[currentQuestion].eword : data[currentQuestion].kword}
        </a>

        {viewKreading && !isReverse && (
          <a
            className={`text-[4vw] lg:text-[28px] max-sm:text-[18px] capitalize text-center sm:text-left ${
              isCorrect === true ? 'text-green-500' : 'text-yellow-500'
            }`}
          >
            {data[currentQuestion].kreading}
          </a>
        )}

        <AnswerOptions
          randomNumbers={randomNumbers}
          currentQuestion={currentQuestion}
          data={data}
          selectedAnswer={selectedAnswer}
          isCorrect={isCorrect}
          isReverse={isReverse}
          isQuestionAnswer={false}
          isImageIdentification={false}
          checkAnswer={checkAnswer}
        />
      </div>

      {enableReverse && (
        <div className="flex flex-row gap-2 items-center">
          <input
            type="checkbox"
            id="reverse"
            checked={isReverse}
            onChange={(e) => onReverseChange(e.target.checked)}
            className="w-4 h-4"
          />
          <label htmlFor="reverse" className="text-white">
            Reverse Word and Answers
          </label>
        </div>
      )}
    </div>
  );
};

export default QuestionWordIdentification;
