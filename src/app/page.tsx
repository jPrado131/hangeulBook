"use client"
import { useState, useEffect, useCallback } from "react";
import confetti from "canvas-confetti";
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
import Modal from "../components/Modal"; // Import the Modal component
import Hangul from "./hangul"; // Import the Hangul component
import AnswerOptions from "../components/AnswerOptions"; // Import the AnswerOptions component

const categories: Record<string, { id: number; kword: string; kreading: string; eword: string }[]> = {
  "fruits-and-vegitables": dataFruitsAndVegitables,
  "animals": dataAnimals,
  "foods": dataFoods,
  "numbers": dataNumbers,
  "sino_numbers": dataSinoNumbers,
  "time": dataTime,
  "weather-seasons": dataWeather,
  "tools": dataTools,
  "occupations": dataOccupations,
  "family": dataFamily,
  "verbs": dataVerbs,
  "adjectives": dataAdjectives,
  "things": dataThings,
  "places": dataPlaces,
  "colors": dataColors,
  "shapes": dataShapes,
  "body-parts": dataBodyParts,
  "clothes": dataClothes,
  "transport": dataTransport,
  "random": [...dataFruitsAndVegitables, ...dataAnimals, ...dataFoods],
};

export default function Home() {
  const [category, setCategory] = useState<string>("fruits-and-vegitables");
  const [data, setData] = useState<{ id: number; kword: string; kreading: string; eword: string }[]>(categories[category]);
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
  const NumberOfChoices = 4;

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
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

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
    setData(shuffleArray(categories[newCategory]));
    setCurrentQuestion(0);
    setCountWrongAnswers(0);
  };

  const handleReverseChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsReverse(event.target.checked);
  };

  return (
    <div className={`grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-black`}>
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        
        <div className="fixed top-0 left-0 right-0 z-10 p-4 shadow-md items-center justify-center bg-black">
          <div className="flex flex-row gap-4 items-center justify-center max-md:flex-col max-md:gap-2">
            <div className="flex flex-row gap-4 items-center">
              <strong className="max-md:hidden">Category: </strong>
              <select
                className="text-black capitalize px-4 py-2 rounded-md border border-gray-300 bg-white max-md:w-[80vw]"
                value={category}
                onChange={handleCategoryChange}
              >
                {Object.keys(categories).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.replace("-", " & ").replace("_", " ")} ({categories[cat].length})
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-row gap-4 items-center">
              <span className="text-white">{currentQuestion+1} / {data.length}</span>
              <a className="text-white bg-transparent border p-2 rounded-md block ml-1" onClick={() => setIsModalOpenHangul(true)}>Hangul</a>
            </div>
          </div>
        </div>
      
        {currentQuestion < data.length && (
          <div key={data[currentQuestion].id} className={`flex flex-col gap-4 items-center transition-opacity duration-500 ${transition ? 'opacity-0' : 'opacity-100'} mt-vw-20`}>
            <div className="flex flex-col gap-4 items-center">
              <a className={`text-[16vw] max-lg:text-[20vw] max-md:text-[18vw] text-center sm:text-left ${isCorrect === true ? 'text-green-500' : 'text-white'} leading-[16vw] mt-[4vw]`}
              title={data[currentQuestion].kreading}> {isReverse ? data[currentQuestion].eword : data[currentQuestion].kword}</a>
              
              {viewKreading && !isReverse && (
                <a className={`text-[4vw] text-center sm:text-left ${isCorrect === true ? 'text-green-500' : 'text-yellow-500'}`} 
                >{data[currentQuestion].kreading}</a>
              )}

              <AnswerOptions
                randomNumbers={randomNumbers[currentQuestion]}
                currentQuestion={currentQuestion}
                data={data}
                selectedAnswer={selectedAnswer}
                isCorrect={isCorrect}
                isReverse={isReverse}
                checkAnswer={checkAnswer}
                
              />
            </div>
          </div>
        )}

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

        <div className="flex flex-row justify-center items-center">
          {!viewKreading && !isReverse && (
            <a onClick={()=> setViewKreading(true)} className="text-yellow-100 text-vw-12 border rounded-md p-2 self-start animate-pulse mr-2 capitalize font-bold">hint</a>
          )}
          <span className="text-white">Wrong Answers: {countWrongAnswers}</span>
        </div>

        <Modal isOpen={isModalOpenHangul} onClose={() => setIsModalOpenHangul(false)}>
          <Hangul />
        </Modal>
      </main>
    </div>
  );
}
