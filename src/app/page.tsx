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
import { ArrowRightCircle, Menu, XCircle } from "@deemlol/next-icons";
import Cookies from "js-cookie"; // Import js-cookie for cookie handling
import { useRouter } from "next/navigation"; // Import Next.js router

interface CategoryItem {
  id: number;
  kword: string;
  kreading: string;
  eword: string;
  image: string;
  question: string;
  question_en: string;
  answer: string;
  answer_en: string;
}



const categories: Record<string, CategoryItem[]> = {
  "fruits-and-vegitables": dataFruitsAndVegitables.map((item) => ({ ...item, question: "", question_en: "", answer: "", answer_en: "" })),
  "animals": dataAnimals.map((item) => ({ ...item, question: "", question_en: "", answer: "", answer_en: "" })),
  "foods": dataFoods.map((item) => ({ ...item, question: "", question_en: "", answer: "", answer_en: "" })),
  "numbers": dataNumbers.map((item) => ({ ...item, question: "", question_en: "", answer: "", answer_en: "" })),
  "sino_numbers": dataSinoNumbers.map((item) => ({ ...item, question: "", question_en: "", answer: "", answer_en: "" })),
  "time": dataTime.map((item) => ({ ...item, question: "", question_en: "", answer: "", answer_en: "" })),
  "weather-seasons": dataWeather.map((item) => ({ ...item, question: "", question_en: "", answer: "", answer_en: "" })),
  "tools": dataTools.map((item) => ({ ...item, question: "", question_en: "", answer: "", answer_en: "" })),
  "occupations": dataOccupations.map((item) => ({ ...item, question: "", question_en: "", answer: "", answer_en: "" })),
  "family": dataFamily.map((item) => ({ ...item, question: "", question_en: "", answer: "", answer_en: "" })),
  "verbs": dataVerbs.map((item) => ({ ...item, question: "", question_en: "", answer: "", answer_en: "" })),
  "adjectives": dataAdjectives.map((item) => ({ ...item, question: "", question_en: "", answer: "", answer_en: "" })),
  "things": dataThings.map((item) => ({ ...item, question: "", question_en: "", answer: "", answer_en: "" })),
  "places": dataPlaces.map((item) => ({ ...item, question: "", question_en: "", answer: "", answer_en: "" })),
  "colors": dataColors.map((item) => ({ ...item, question: "", question_en: "", answer: "", answer_en: "" })),
  "shapes": dataShapes.map((item) => ({ ...item, question: "", question_en: "", answer: "", answer_en: "" })), 
  "body-parts": dataBodyParts.map((item) => ({ ...item, question: "", question_en: "", answer: "", answer_en: "" })),
  "clothes": dataClothes.map((item) => ({ ...item, question: "", question_en: "", answer: "", answer_en: "" })),
  "transport": dataTransport.map((item) => ({ ...item, question: "", question_en: "", answer: "", answer_en: "" })),
  "directions": dataDirections.map((item) => ({ ...item, question: "", question_en: "", answer: "", answer_en: "" })),
  "sports": dataSports.map((item) => ({ ...item, question: "", question_en: "", answer: "", answer_en: "" })),
  "taste": dataTaste.map((item) => ({ ...item, question: "", question_en: "", answer: "", answer_en: "" })),
  "feelings": dataFeelings.map((item) => ({ ...item, question: "", question_en: "", answer: "", answer_en: "" })),
  "random": [...dataFruitsAndVegitables, ...dataAnimals, ...dataFoods].map((item) => ({ ...item, question: "", question_en: "", answer: "", answer_en: "" })),
  "question-answer" : dataSimpleQuestions.map((item) => ({ ...item, image: "", kword: "", eword : "", kreading: "" })),
  "image_identification" : dataSports.map((item) => ({ ...item, question: "", question_en: "", answer: "", answer_en: "" }))
};


export default function Home() {
  const router = useRouter(); // Initialize router
  const [isSlideMenuOpen, setIsSlideMenuOpen] = useState(false); // State for slide menu
  const [category, setCategory] = useState<string>("image_identification");
  const [data, setData] = useState<CategoryItem[]>(categories[category] || []);
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
  const [isImageIdentification, setIsImageIdentification] = useState<boolean>(true);
  const [started, setStarted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null); // Use `null` to indicate loading state
  const [loading, setLoading] = useState(false); // State for the line loader

  const NumberOfChoices = 4;
  const EnableReverse = true;
  const EnableNextBtn = true;
  const CookiesExpiration = 7;
  const [progress, setProgress] = useState(0);
  const [loadingDuration, setLoadingDuration] = useState(3000);
  
  useEffect(() => {
    if (loadingDuration) {
      const interval = 100; // Update every 100ms
      const step = (100 / (loadingDuration - 500)) * interval; // Calculate progress increase per step

      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev + step >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + step;
        });
      }, interval);

      return () => clearInterval(progressInterval);
    }
  }, [loadingDuration, progress]); // Include `loadingDuration` in the dependency array

  useEffect(() => {
    const loggedIn = Cookies.get("isLoggedIn") === "true";
    const isStarted = Cookies.get("isStarted") === "true";
    setIsLoggedIn(loggedIn);
    setStarted(isStarted);

    if (!loggedIn) {
      router.push("/login"); // Redirect to login page if not logged in
    }
  }, [router]);

  useEffect(() => {
    const savedCategory = Cookies.get("currentCategory");
    if (savedCategory && categories[savedCategory]) {
      setCategory(savedCategory);
      setData(shuffleArray(categories[savedCategory]));

      if(savedCategory === "question-answer") {
        setIsQuestionAnswer(true);
        setIsReverse(false);
      }else if(savedCategory === "image_identification") {
        setIsImageIdentification(true);
      }else {
        setIsQuestionAnswer(false);
        setIsImageIdentification(false);
      }
    }
  }, []);

  const handleStart = () => {
    setStarted(true);
    Cookies.set("isStarted", "true", { expires: CookiesExpiration });
  };

  useEffect(() => {
    if (isLoggedIn) {
      setCorrectSound(new Audio("/sounds/correct.mp3"));
      setWrongSound(new Audio("/sounds/wrong.mp3"));
    }
  }, [isLoggedIn]);

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
      setLoading(true);
      setLoadingDuration(2000);
      setProgress(0);
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

      if (!EnableNextBtn) {
        setTimeout(() => {
          setTransition(true);
          setTimeout(() => {
            setCurrentQuestion((prev) => {
              const nextQuestion = (prev + 1) % data.length;
              if (nextQuestion === 0) {
                setCountWrongAnswers(0); // Reset wrong answers when restarting
              }
              return nextQuestion;
            });
            setSelectedAnswer(null);
            setIsCorrect(null);
            setViewKreading(false);
            setTransition(false);
            setLoading(false);
            setProgress(0);
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
    
    Cookies.set("currentCategory", newCategory, { expires: CookiesExpiration }); // Save category to cookie

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
    setLoadingDuration(500); // Reset loading duration for the next question
    setLoading(true); // Start the loader
    setTimeout(() => {
      setCurrentQuestion((prev) => {
        const nextQuestion = (prev + 1) % data.length;
        if (nextQuestion === 0) {
          setCountWrongAnswers(0); // Reset wrong answers when restarting
        }
        return nextQuestion;
      });
      setSelectedAnswer(null);
      setIsCorrect(null);
      setViewKreading(false);
      setLoading(false); // Stop the loader
      setProgress(0);
    }, 500);
  }

  const toggleSlideMenu = () => {
    setIsSlideMenuOpen((prev) => !prev);
  };

  const closeSlideMenu = () => {
    setIsSlideMenuOpen(false);
  };

  if (isLoggedIn === null) {
    // Show a loading state while cookies are being checked
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <p>Loading...</p>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-8">
        <h1 className="text-4xl font-bold mb-4 text-center">Welcome to Hangeul Book</h1>
        <h2 className="text-2xl mb-6 text-center">Practice Hangeul Anytime, Anywhere!</h2>
        <p className="text-lg mb-6 text-center">
        Learn Hangeul easily with Hangeul Book. Whether you&apos;re at home, commuting, or taking a break, our app helps you practice and review your Korean language skills anytime, anywhere. Stay consistent and improve effortlessly with our simple and effective learning tools!
        </p>
        <button
          onClick={handleStart}
          className="bg-green-700 text-gray-200 px-6 py-3 rounded-md text-lg font-bold hover:bg-green-500 hover:animate-none animate-pulse"
        >
          Get Started 🚀
        </button>
      </div>
    );
  }

  return (
    <div className={`grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 max-md:gap-4 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-black`}>
      
      <div className="fixed w-full top-0 left-0 z-50 h-[5px] bg-black">      
       {loading && (
          <div
          style={{
            width: `${progress}%`,
            height: "100%",
            transition: "width 0.2s linear",
          }}
          className="bg-green-500"
        />)}
      </div>
      
      {/* Overlay */}
      {isSlideMenuOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-[9998]"
          onClick={closeSlideMenu} // Close menu when overlay is clicked
        ></div>
      )}

      {/* Slide Menu */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white shadow-lg transform ${
          isSlideMenuOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 z-[9999]`}
      >
        <button
          onClick={closeSlideMenu}
          className="absolute top-0 right-0 text-white p-4 rounded-md"
        >
          <XCircle size={24} />
        </button>
        <div className="p-4 py-[40px]">
          <ul className="space-y-2">

            <li className="px-2 py-3">
              <a onClick={() => setIsModalOpenHangul(true)} className="hover:underline cursor-pointer">
                Hangul
              </a>
            </li>
            <li className="px-2 py-3">
            <div className="flex flex-col gap-4 items-center">
              <strong className="text-left block w-full">Category: </strong>
              <select
                className="text-black capitalize px-4 py-2 rounded-md border border-gray-300 bg-white w-full"
                value={category}
                onChange={handleCategoryChange}
              >
                {Object.keys(categories).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.replace("-", " & ").replace("_", " ")} ({categories[cat]?.length || 0})
                  </option>
                ))}
              </select>
            </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Slide Menu Toggle Button */}
      <button
        onClick={toggleSlideMenu}
        className="fixed top-4 left-4 bg-gray-700 text-white px-4 py-2 rounded-md z-50"
      >
        <Menu size={24} />
      </button>

      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">

        <div className="fixed top-0 left-0 right-0 z-10 p-4 shadow-md items-center justify-center bg-black">
          <div className="flex flex-row gap-4 items-center justify-end">
            <div className="flex flex-row gap-4 items-center justify-center">
              <span className="flex text-white self-start">
                { category === "question-answer" ? "Question & Answer" : category === "image_identification" ? "Identify The Photo" : "Translate The Word" }
              </span>
              <span className="flex text-white self-end">{currentQuestion+1} / {data.length}</span>
            </div>
          </div>
          <div className="flex flex-row justify-end items-center">
            {!viewKreading && !isReverse && !isImageIdentification && (
              <a onClick={()=> setViewKreading(true)} className="text-yellow-100 text-vw-12 border rounded-md p-2 self-start animate-pulse mr-2 capitalize font-bold">hint</a>
            )}
            <span className="text-white py-2">Wrong Answers: {countWrongAnswers}</span>
          </div>
        </div>
      
        {currentQuestion < data.length && (
          <div key={data[currentQuestion].id} className={`flex flex-col gap-4 items-center transition-opacity duration-500 ${transition ? 'opacity-0' : 'opacity-100'} mt-[4vw]`}>
            <div className="flex flex-col gap-4 items-center">
              
              {isQuestionAnswer ? (
                <div className={`text-[6vw] lg:text-[42px] max-sm:text-[7vw] text-center sm:text-left ${isCorrect === true ? 'text-green-500' : 'text-white'} leading-normal mt-[4vw]`}
                > {data[currentQuestion]?.question}</div>
              ) : isImageIdentification ?  (
                <div className={`flex flex-col items-center border-transparent overflow-hidden max-w-[350px] ${isCorrect === true ? ' border-green-500' : ""}`}>
                  <Image className="w-full max-h-[250px]" src={data[currentQuestion]?.image} alt={data[currentQuestion].eword} width={350} height={350} placeholder="blur" blurDataURL="/images/placeholder.png" />
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

        {/* 
        QUIZ FINISHED MESSAGE
        {EnableNextBtn && currentQuestion === data.length && (
          <div className="flex flex-row gap-4 items-center">
            <span className="text-white">You have completed the quiz!</span>
            <a onClick={() => setCurrentQuestion(0)} className="text-white bg-transparent border p-2 rounded-md block">Restart</a>
          </div>
        )}  */}
        
        {EnableNextBtn && isCorrect &&(
          <div className="fixed bottom-0 left-0 right-0 flex flex-row gap-4 items-center justify-between w-full shadow-md bg-black border-t text-green-500">
            <a onClick={() => handleNextQuestion()} className="flex flex-row justify-center items-center text-green-500 hover:text-green-400 animate-pulse text-vw-26 bg-transparent p-4 cursor-pointer w-full"><span className="mr-2">Next</span> <ArrowRightCircle  size={32} className="justify-self-end" /></a>
          </div>
        )}
        <Modal isOpen={isModalOpenHangul} onClose={() => setIsModalOpenHangul(false)}>
          <Hangul />
        </Modal>
      </main>
    </div>
  );

}
