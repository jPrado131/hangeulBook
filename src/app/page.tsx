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
          setTransition(false);
        }, 500);
      }, 1500);
    } else {
      setIsCorrect(false);
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
  };

  return (
    <div className={`grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]`}>
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        
        <div className="fixed top-0 left-0 right-0 z-10 p-4 shadow-md items-center justify-center">
          <div className="flex flex-row gap-4 items-center justify-center">
            <strong>Category: </strong>
            <select
              className="text-black capitalize px-4 py-2 rounded-md border border-gray-300 bg-white"
              value={category}
              onChange={handleCategoryChange}
            >
              {Object.keys(categories).map((cat) => (
                <option key={cat} value={cat}>
                  {cat.replace("-", " & ").replace("_", " ")} ({categories[cat].length})
                </option>
              ))}
            </select>
            <span>{currentQuestion+1} / {data.length}</span>
            <a className="text-white bg-transparent border p-2 rounded-md block ml-1" onClick={() => setIsModalOpenHangul(true)}>Hangul</a>
          </div>
        </div>
        
        {currentQuestion < data.length && (
          <div key={data[currentQuestion].id} className={`flex flex-col gap-4 items-center transition-opacity duration-500 ${transition ? 'opacity-0' : 'opacity-100'}`}>
            <div className="flex flex-col gap-4 items-center">
              <a className={`text-[20vh] text-center sm:text-left ${isCorrect === true ? 'text-green-500' : 'text-white'}`} 
              title={data[currentQuestion].kreading}>{data[currentQuestion].kword}</a>
              
              <div className="relative">
                {isCorrect === true ? (<div className=" bg-transparent opacity-25 absolute top-0 left-0 right-0 h-full w-full"></div>): null}
                
                <div className="flex flex-row gap-4 items-center">
                  {randomNumbers[currentQuestion]?.map((randomNumber: number, idx: number) => (
                    randomNumber < data.length && (
                      <div
                        key={idx}
                        className={`flex flex-col gap-2 items-center cursor-pointer p-4 rounded-md border 
                          ${
                            selectedAnswer === randomNumber
                              ? randomNumber === currentQuestion
                                ? "border-green-500 text-green-500"
                                : "border-red-500 text-red-500" 
                              : "border-gray-300 text-gray-300"
                          }`}
                        onClick={() => checkAnswer(randomNumber, currentQuestion)}
                      >
                        <span className="text-vw-16 capitalize">{data[randomNumber].eword}</span>
                      </div>
                    )
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <Modal isOpen={isModalOpenHangul} onClose={() => setIsModalOpenHangul(false)}>
          <Hangul />
        </Modal>
      </main>
    </div>
  );
}
