import React from 'react';
import Image from 'next/image';
import AnswerOptions from './AnswerOptions';

interface QuestionImageIdentificationProps {
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
  checkAnswer: (selected: number, correct: number) => void;
}

const QuestionImageIdentification: React.FC<QuestionImageIdentificationProps> = ({
  randomNumbers,
  currentQuestion,
  data,
  selectedAnswer,
  isCorrect,
  checkAnswer,
}) => {
  return (
    <div
      key={data[currentQuestion].id}
      className={`flex flex-col gap-4 items-center transition-opacity duration-500 max-sm:w-full`}
    >
      <div className="flex flex-col gap-4 items-center max-sm:w-full">

          <div
            className={`flex flex-col items-center border-transparent overflow-hidden max-w-[350px] ${
              isCorrect === true ? 'border-green-500' : ''
            }`}
          >
            <Image
              className="w-full max-sm:max-h-[250px]"
              src={data[currentQuestion]?.image}
              alt={data[currentQuestion].eword}
              width={350}
              height={350}
              placeholder="blur"
              blurDataURL="/images/placeholder.png"
            />
          </div>
       
        <AnswerOptions
          randomNumbers={randomNumbers}
          currentQuestion={currentQuestion}
          data={data}
          selectedAnswer={selectedAnswer}
          isCorrect={isCorrect}
          isReverse={false}
          isQuestionAnswer={false}
          isImageIdentification={true}
          checkAnswer={checkAnswer}
        />
      </div>
    </div>
  );
};

export default QuestionImageIdentification;
