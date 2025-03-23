"use client"
import { useState, useEffect, useCallback } from "react";
import confetti from "canvas-confetti";
import Image from "next/image";
import dataAnimals from "../data/animals.json";
import dataFoods from "../data/food.json";
import dataFruitsAndVegitables from "../data/fruits-and-vegitables.json";
import dataNumbers from "../data/numbers.json";
import dataSinoNumbers from "../data/sino_numbers.json";
import dataWeather from "../data/weather.json";
import dataTools from "../data/tools.json";
import dataOccupations from "../data/occupations.json";
import dataTime from "../data/time.json";
import dataFamily from "../data/family.json";
import dataVerbs from "../data/verbs.json";
import dataAdjectives from "../data/adjectives.json";
import dataThings from "../data/things.json";
import dataPlaces from "../data/places.json";
import dataColors from "../data/colors.json";
import dataShapes from "../data/shapes.json";
import dataBodyParts from "../data/body-parts.json";
import dataClothes from "../data/clothes.json";
import dataTransport from "../data/transport.json";
import dataDirections from "../data/directions.json";
import dataSports from "../data/sports.json";
import dataTaste from "../data/taste.json";
import dataFeelings from "../data/feelings.json";
import dataSimpleQuestions from "../data/simple-questions.json";
import Modal from "../components/Modal"; // Import the Modal component
import Hangul from "./hangul"; // Import the Hangul component
import AnswerOptions from "../components/AnswerOptions"; // Import the AnswerOptions component
import { ArrowRightCircle } from "@deemlol/next-icons";


const fixJsonProperty = (json: any) => { 
  return json.map((item: any) => {
    return {
      ...item,
      image: item.image || "",
      question: item.question || "",
      answer: item.answer || "",
      question_en: item.question_en || "",
      answer_en: item.answer_en || "" 
    }
  });
}

const categories: Record<string, { 
  id: number; kword: string; kreading: string; eword: string; image: string | "";
  question: string; answer: string; question_en: string; answer_en: string;
 }[]> = {
  "fruits-and-vegitables": fixJsonProperty(dataFruitsAndVegitables),
  "animals": fixJsonProperty(dataAnimals),
  "foods": fixJsonProperty(dataFoods),
  "numbers": fixJsonProperty(dataNumbers),
  "sino_numbers": fixJsonProperty(dataSinoNumbers),
  "time": fixJsonProperty(dataTime),
  "weather-seasons": fixJsonProperty(dataWeather),
  "tools": fixJsonProperty(dataTools),
  "occupations": fixJsonProperty(dataOccupations),
  "family": fixJsonProperty(dataFamily),
  "verbs": fixJsonProperty(dataVerbs),
  "adjectives": fixJsonProperty(dataAdjectives),
  "things": fixJsonProperty(dataThings),
  "places": fixJsonProperty(dataPlaces),
  "colors": fixJsonProperty(dataColors),
  "shapes": fixJsonProperty(dataShapes), 
  "body-parts": fixJsonProperty(dataBodyParts),
  "clothes": fixJsonProperty(dataClothes),
  "transport": fixJsonProperty(dataTransport),
  "directions": fixJsonProperty(dataDirections),
  "sports": fixJsonProperty(dataSports),
  "taste": fixJsonProperty(dataTaste),
  "feelings": fixJsonProperty(dataFeelings),
  "random": fixJsonProperty([...dataFruitsAndVegitables, ...dataAnimals, ...dataFoods]),
  "question-answer" : dataSimpleQuestions.map(item => ({
    ...item,
    kword: "",
    kreading: "",
    eword:"",
    image: ""
  })),
  "image_identification" : fixJsonProperty(dataSports)
};


export default function Home() {
  const [category, setCategory] = useState<string>("fruits-and-vegitables");
  const [data, setData] = useState<{ id: number; kword: string; kreading: string; eword: string; image: string | "", question: string, answer: string, question_en: string, answer_en: string}[]>(categories[category] || []);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [randomNumbers, setRandomNumbers] = useState<number[][]>([]);
  const [correctSound, setCorrectSound] = useState<HTMLAudioElement | null>(null);
  const [wrongSound, setWrongSound] = useState<HTMLAudioElement | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [transition, setTransition] = useState<boolean>(false);
  const [isModalOpenHangul, setIsModalOpenHangul] = useState<boolean>(false);
  const [countWrongAnswers, setCountWrongAnswers] = useState<number>(0);
  const [viewKreading, setViewKreading] = useState<boolean>(false);
  const [isReverse, setIsReverse] = useState<boolean>(false);
  const [isQuestionAnswer, setIsQuestionAnswer] = useState<boolean>(false);
  const [isImageIdentification, setIsImageIdentification] = useState<boolean>(false);
  const NumberOfChoices = 4;
  const EnableReverse = true;
  const EnableNextBtn = false;

  useEffect(() => {
    setCorrectSound(new Audio("/sounds/correct.mp3"));
    setWrongSound(new Audio("/sounds/wrong.mp3"));
  }, []);

  useEffect(() => {
    if (isModalOpenHangul) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isModalOpenHangul]);

  const shuffleArray = <T,>(array: T[]): T[] => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    };

  const getRandomNumber = useCallback((exclude: number, max: number): number[] => {
    const randomNumbers = [exclude];
    while (randomNumbers.length < max + 1) {
      const randomNumber = Math.floor(Math.random() * data.length);
      if (!randomNumbers.includes(randomNumber) && randomNumber !== exclude) {
        randomNumbers.push(randomNumber);
      }
    }
    return shuffleArray(randomNumbers);
  }, [data]);

  useEffect(() => {
    const numbers = data.map((_, index) => getRandomNumber(index, NumberOfChoices-1));
    setRandomNumbers(numbers);
  }, [currentQuestion, data, getRandomNumber]);

  const checkAnswer = (selected: number, correct: number) => {
    
    setSelectedAnswer(selected);
    if (selected === correct) {
      setIsCorrect(true);
      if (correctSound) {
        correctSound.currentTime = 0;
      }
      correctSound?.play();
      setViewKreading(true); 
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      if(!EnableNextBtn){
        setTimeout(() => {
          setTransition(true);
          setTimeout(() => {
            setCurrentQuestion((prev) => (prev + 1) % data.length);
            setSelectedAnswer(null);
            setIsCorrect(null);
            setViewKreading(false)  
            setTransition(false);
          }, 500);
        }, 2000);
      }

    } else {
      setIsCorrect(false);
      setCountWrongAnswers((prev) => prev + 1);
      if (wrongSound) {
        wrongSound.currentTime = 0;
      }
      wrongSound?.play();
      console.log("wrong");
    }
  };

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = event.target.value;
    setCategory(newCategory);
    setData(shuffleArray(categories[newCategory] || []));
    setCurrentQuestion(0);
    setCountWrongAnswers(0);
    setViewKreading(false);  
    setIsQuestionAnswer(false);
    setIsImageIdentification(false);
    
    if(EnableNextBtn){
      setSelectedAnswer(null);
      setIsCorrect(null);
      setTransition(false);
    }  

    if(newCategory === "question-answer") {
      setIsQuestionAnswer(true);
      setIsReverse(false);
    }else if(newCategory === "image_identification") {
      setIsImageIdentification(true);
    }
    
  };

  const handleReverseChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsReverse(event.target.checked);
  };

  const handleNextQuestion = () => {
    setTransition(true);
    setTimeout(() => {
      setCurrentQuestion((prev) => (prev + 1) % data.length);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setViewKreading(false)  
      setTransition(false);
    }, 500);
  }

  return (
    <div className={`grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-black`}>
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        
        <div className="fixed top-0 left-0 right-0 z-10 p-4 shadow-md items-center justify-center bg-black">
          <div className="flex flex-row gap-4 items-center justify-center max-md:flex-col max-md:gap-2">
            <div className="flex flex-row gap-4 items-center">
              <strong className="max-md:hidden">Category: </strong>
              <select
                className="text-black capitalize px-4 py-2 rounded-md border border-gray-300 bg-white"
                value={category}
                onChange={handleCategoryChange}
              >
                {Object.keys(categories).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.replace("-", " & ").replace("_", " ")} ({categories[cat]?.length || 0})
                  </option>
                ))}
              </select>
              <a className="text-gray-300 bg-transparent border p-2 rounded-md block ml-1 hover:text-white" onClick={() => setIsModalOpenHangul(true)}>Hangul</a>
            </div>
            <div className="flex flex-row gap-4 items-center max-md:w-full justify-center">
              <span className="flex text-white self-start">
                { category === "question-answer" ? "Question & Answer" : category === "image_identification" ? "Identify The Photo" : "Translate The Word" }
              </span>
              <span className="flex text-white self-end">{currentQuestion+1} / {data.length}</span>
            </div>
          </div>
        </div>
      
        {currentQuestion < data.length && (
          <div key={data[currentQuestion].id} className={`flex flex-col gap-4 items-center transition-opacity duration-500 ${transition ? 'opacity-0' : 'opacity-100'} mt-vw-20`}>
            <div className="flex flex-col gap-4 items-center">
              
              {isQuestionAnswer ? (
                <div className={`text-[6vw] lg:text-[42px] max-sm:text-[7vw] text-center sm:text-left ${isCorrect === true ? 'text-green-500' : 'text-white'} leading-normal mt-[4vw]`}
                > {data[currentQuestion]?.question}</div>
              ) : isImageIdentification ?  (
                <div className={`flex flex-col items-center border-transparent overflow-hidden max-w-[350px] ${isCorrect === true ? ' border-green-500' : ""}`}>
                  <Image className="w-full max-h-[350px]" src={data[currentQuestion]?.image} alt={data[currentQuestion].eword} width={350} height={350} placeholder="blur" blurDataURL="/images/placeholder.png" />
                </div>
              )
              : ( 
                <a className={`text-[12vw] md:text-[60px] text-center sm:text-left ${isCorrect === true ? 'text-green-500' : 'text-white'} leading-normal`}
                title={data[currentQuestion].kreading}> {isReverse ? data[currentQuestion].eword : data[currentQuestion].kword}</a>      
              )}

              {viewKreading && !isReverse && !isImageIdentification &&(
                <a className={`text-[4vw] lg:text-[28px] text-center sm:text-left ${isCorrect === true ? 'text-green-500' : 'text-yellow-500'}`} 
                >{isQuestionAnswer ? data[currentQuestion].question_en : data[currentQuestion].kreading}</a>
              )}

              <AnswerOptions
                randomNumbers={randomNumbers[currentQuestion]}
                currentQuestion={currentQuestion}
                data={data}
                selectedAnswer={selectedAnswer}
                isCorrect={isCorrect}
                isReverse={isReverse}
                isQuestionAnswer={isQuestionAnswer}
                isImageIdentification={isImageIdentification}
                checkAnswer={checkAnswer}
                
              />
            </div>
          </div>
        )}

        {EnableReverse && !isQuestionAnswer && !isImageIdentification &&(
          <div className="flex flex-row gap-2 items-center">
            <input
              type="checkbox"
              id="reverse"
              checked={isReverse}
              onChange={handleReverseChange}
              className="w-4 h-4"
            />
            <label htmlFor="reverse" className="text-white">Reverse Questions and Answers</label>
          </div>
        )}

        <div className="flex flex-row justify-center items-center">
          {!viewKreading && !isReverse && !isImageIdentification && (
            <a onClick={()=> setViewKreading(true)} className="text-yellow-100 text-vw-12 border rounded-md p-2 self-start animate-pulse mr-2 capitalize font-bold">hint</a>
          )}
          <span className="text-white">Wrong Answers: {countWrongAnswers}</span>
        </div>

        {/* 
        QUIZ FINISHED MESSAGE
        {EnableNextBtn && currentQuestion === data.length && (
          <div className="flex flex-row gap-4 items-center">
            <span className="text-white">You have completed the quiz!</span>
            <a onClick={() => setCurrentQuestion(0)} className="text-white bg-transparent border p-2 rounded-md block">Restart</a>
          </div>
        )}  */}
        
        {EnableNextBtn && isCorrect &&(
          <div className="flex flex-row gap-4 items-center">
            <a onClick={() => handleNextQuestion()} className="flex flex-row justify-center items-center text-green-500 hover:text-green-400  text-vw-26 bg-transparent border px-4 py-2 rounded-md cursor-pointer"><span className="mr-2">Next</span> <ArrowRightCircle  size={32} /></a>
          </div>
        )}
        <Modal isOpen={isModalOpenHangul} onClose={() => setIsModalOpenHangul(false)}>
          <Hangul />
        </Modal>
      </main>
    </div>
  );
}
