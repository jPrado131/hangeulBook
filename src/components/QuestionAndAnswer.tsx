import React from 'react';
import AnswerOptions from './AnswerOptions';

interface QuestionAndAnswerProps {
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
  viewKreading: boolean;
  checkAnswer: (selected: number, correct: number) => void;
}

const QuestionAndAnswer: React.FC<QuestionAndAnswerProps> = ({
  randomNumbers,
  currentQuestion,
  data,
  selectedAnswer,
  isCorrect,
  viewKreading,
  checkAnswer,
}) => {
  return (
    <div
      key={data[currentQuestion].id}
      className={`flex flex-col gap-4 items-center transition-opacity duration-500 max-sm:w-full`}
    >
      <div className="flex flex-col gap-4 items-center max-sm:w-full">

          <div
            className={`text-[6vw] lg:text-[42px] max-sm:text-[7vw] text-center sm:text-left ${
              isCorrect === true ? 'text-green-500' : 'text-white'
            } leading-normal`}
          >
            {data[currentQuestion]?.question}
          </div>
       

        {viewKreading && (
          <a
            className={`text-[4vw] lg:text-[28px] text-center max-sm:text-[18px] capitalize sm:text-left ${
              isCorrect === true ? 'text-green-500' : 'text-yellow-500'
            }`}
          >
            {data[currentQuestion].question_en }
          </a>
        )}

        <AnswerOptions
          randomNumbers={randomNumbers}
          currentQuestion={currentQuestion}
          data={data}
          selectedAnswer={selectedAnswer}
          isCorrect={isCorrect}
          isReverse={false}
          isQuestionAnswer={true}
          isImageIdentification={false}
          checkAnswer={checkAnswer}
        />
      </div>
    </div>
  );
};

export default QuestionAndAnswer;
