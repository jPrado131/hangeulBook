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
import { ArrowRightCircle, Eye, EyeOff } from "@deemlol/next-icons";
import Cookies from "js-cookie"; // Import js-cookie for cookie handling

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
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [loading, setLoading] = useState(false); // State for the line loader

  const NumberOfChoices = 4;
  const EnableReverse = true;
  const EnableNextBtn = false;
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
  }, []);

    const currentDate = new Date();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Ensure two-digit month
    const yearLastTwoDigits = currentDate.getFullYear() % 100;
    const expectedPassword = `pass${month}${yearLastTwoDigits}`;

    console.log("Expected password:", expectedPassword);

  const handleLogin = () => {


    if (username === "user" && password === expectedPassword) {
      setIsLoggedIn(true);
      Cookies.set("isLoggedIn", "true", { expires: CookiesExpiration });
    } else {
      alert("Invalid credentials. Please try again.");
    }
  };

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
     
      setLoadingDuration(2000)
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

      if(!EnableNextBtn){
        setTimeout(() => {
          setTransition(true);
          setTimeout(() => {
            setCurrentQuestion((prev) => (prev + 1) % data.length);
            setSelectedAnswer(null);
            setIsCorrect(null);
            setViewKreading(false)  
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
    setLoadingDuration(3000); // Reset loading duration for the next question
    setProgress(0); // Reset progress
    setLoading(true); // Start the loader
    setTimeout(() => {
      setCurrentQuestion((prev) => (prev + 1) % data.length);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setViewKreading(false);
      setLoading(false); // Stop the loader
    }, 500);
  }

  const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      handleLogin();
    }
  };

  if (isLoggedIn === null) {
    // Show a loading state while cookies are being checked
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div
        className="flex items-center justify-center min-h-screen bg-black text-white p-8"
        onKeyPress={handleKeyPress} // Add keypress listener
      >
        <div className="w-full max-w-md  bg-transparent rounded-lg shadow-lg p-6">
          <div className="flex flex-col items-center mb-6">
            <Image
              src="/logo-white.png" // Replace with your logo path
              alt="Hangeul Book Logo"
              width={150}
              height={150}
              className="mb-4"
            />
            <h1 className="text-3xl font-bold text-center">Welcome to Hangeul Book</h1>
            <p className="text-gray-400 text-center mt-2">
              Please log in to continue your learning journey.
            </p>
          </div>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mb-4 px-4 py-2 rounded-md text-white w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mb-4 px-4 py-2 rounded-md text-white w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[10px] text-sm text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={24}  /> : <Eye size={24} />}
            </button>
          </div>
          <button
            onClick={handleLogin}
            className="w-full bg-green-600 text-white px-4 py-2 rounded-md font-bold hover:bg-green-500 transition"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-8">
        <h1 className="text-4xl font-bold mb-4 text-">Welcome to Hangeul Book</h1>
        <h2 className="text-2xl mb-6 text-center">Practice Hangeul Anytime, Anywhere!</h2>
        <p className="text-lg mb-4 text-center">
          Master Hangeul effortlessly with our intuitive learning tool. Whether you&apos;re on the go or sitting down to study, Hangeul Book helps you review and reinforce your Korean language skills anytime, anywhere.
        </p>
        <h3 className="text-xl font-semibold mb-2 text-center">What is Hangeul?</h3>
        <p className="text-lg mb-6 text-center">
          Hangeul (한글) is the Korean writing system, created in the 15th century by King Sejong the Great. It is known for its scientific design and simplicity, making it one of the easiest scripts to learn. With just 24 basic letters, you can start reading and writing Korean quickly!
        </p>
        <button
          onClick={handleStart}
          className="bg-green-500 text-white px-6 py-3 rounded-md text-lg font-bold hover:bg-green-400"
        >
          Get Started 🚀
        </button>
      </div>
    );
  }

  return (
    <div className={`grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-black`}>
      
      <div className="fixed w-full top-0 left-0 z-50 h-[10px] bg-black">      
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
          <div key={data[currentQuestion].id} className={`flex flex-col gap-4 items-center transition-opacity duration-500 ${transition ? 'opacity-0' : 'opacity-100'} mt-[4vw]`}>
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
