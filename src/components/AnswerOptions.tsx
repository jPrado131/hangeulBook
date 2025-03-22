import React from 'react';

interface AnswerOptionsProps {
  randomNumbers: number[];
  currentQuestion: number;
  data: { id: number; kword: string; kreading: string; eword: string }[];
  selectedAnswer: number | null;
  isCorrect: boolean | null;
  isReverse: boolean | null;
  isQuestionAnswer: boolean | null;
  isImageIdentification: boolean | null;
  checkAnswer: (selected: number, correct: number) => void;
}

const AnswerOptions: React.FC<AnswerOptionsProps> = ({ randomNumbers, currentQuestion, data, selectedAnswer, isCorrect, isReverse,isQuestionAnswer, isImageIdentification, checkAnswer }) => {
  return (
    <div className="relative p-2">
      {isCorrect === true ? (<div className="bg-transparent opacity-25 absolute top-0 left-0 right-0 h-full w-full"></div>) : null}
      <div className="flex flex-row gap-4 items-center max-md:flex-col max-md:gap-2">
        {randomNumbers?.map((randomNumber: number, idx: number) => (
          randomNumber < data.length && (
            <div
              key={idx}
              className={`flex flex-col gap-2 items-center cursor-pointer p-4 rounded-md border
                ${
                  selectedAnswer === randomNumber
                    ? randomNumber === currentQuestion
                      ? " border-green-500 text-green-500"
                      : " border-red-500 text-red-500" 
                    : " border-gray-300 text-yellow-200"
                } max-md:w-[80vw]`}
              onClick={() => checkAnswer(randomNumber, currentQuestion)}
            >
              <span className="text-vw-16 capitalize">{isQuestionAnswer ? data[randomNumber].eword : isReverse || isImageIdentification ? data[randomNumber].kword : data[randomNumber].eword}</span>
            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default AnswerOptions;
