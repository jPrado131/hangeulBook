"use client"
import { useState, useEffect } from "react";
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
import dataDirections from "../data/directions.json";
import dataSports from "../data/sports.json";
import dataTaste from "../data/taste.json";
import dataFeelings from "../data/feelings.json";
import dataSimpleQuestions from "../data/simple-questions.json";
import dataPeoplePronouns from "../data/people_pronouns.json"; // Import people_pronouns.json
import dataProhibition from "../data/prohibition.json"; // Uncomment and provide the correct path if needed
import Modal from "../components/Modal"; // Import the Modal component
import Hangeul from "./hangeul"; // Import the Hangul component
import { ArrowRightCircle, Menu } from "@deemlol/next-icons";
import Cookies from "js-cookie"; // Import js-cookie for cookie handling
import Welcome from "./welcome";
import QuestionImageIdentification from "../components/QuestionImageIdentification";
import QuestionWordIdentification from "@/components/QuestionWordIdentification";
import QuestionAndAnswer from "@/components/QuestionAndAnswer";
import { shuffleArray, getRandomNumber } from "@/utils/helpers"; // Import reusable functions
import SideMenu from "../components/SideMenu"; // Import the SideMenu component
import { CategoryItem } from "@/interfaces/CategoryItem";
import Login from "../components/Login"; // Import the Login component

const categories: Record<string, CategoryItem[]> = {
  "wi_fruits-vegitables": dataFruitsAndVegitables.map((item) => ({ ...item, question: "", question_en: "", answer: "", answer_en: "" })),
  "wi_animals": dataAnimals.map((item) => ({ ...item, question: "", question_en: "", answer: "", answer_en: "" })),
  "wi_foods": dataFoods.map((item) => ({ ...item, question: "", question_en: "", answer: "", answer_en: "" })),
  "wi_numbers": dataNumbers.map((item) => ({ ...item, question: "", question_en: "", answer: "", answer_en: "" })),
  "wi_sino_numbers": dataSinoNumbers.map((item) => ({ ...item, question: "", question_en: "", answer: "", answer_en: "" })),
  "wi_time": dataTime.map((item) => ({ ...item, question: "", question_en: "", answer: "", answer_en: "" })),
  "wi_weather-seasons": dataWeather.map((item) => ({ ...item, question: "", question_en: "", answer: "", answer_en: "" })),
  "wi_tools": dataTools.map((item) => ({ ...item, question: "", question_en: "", answer: "", answer_en: "" })),
  "wi_occupations": dataOccupations.map((item) => ({ ...item, question: "", question_en: "", answer: "", answer_en: "" })),
  "wi_family": dataFamily.map((item) => ({ ...item, question: "", question_en: "", answer: "", answer_en: "" })),
  "wi_verbs": dataVerbs.map((item) => ({ ...item, question: "", question_en: "", answer: "", answer_en: "" })),
  "wi_adjectives": dataAdjectives.map((item) => ({ ...item, question: "", question_en: "", answer: "", answer_en: "" })),
  "wi_things": dataThings.map((item) => ({ ...item, question: "", question_en: "", answer: "", answer_en: "" })),
  "wi_places": dataPlaces.map((item) => ({ ...item, question: "", question_en: "", answer: "", answer_en: "" })),
  "wi_colors": dataColors.map((item) => ({ ...item, question: "", question_en: "", answer: "", answer_en: "" })),
  "wi_shapes": dataShapes.map((item) => ({ ...item, question: "", question_en: "", answer: "", answer_en: "" })), 
  "wi_body-parts": dataBodyParts.map((item) => ({ ...item, question: "", question_en: "", answer: "", answer_en: "" })),
  "wi_clothes": dataClothes.map((item) => ({ ...item, question: "", question_en: "", answer: "", answer_en: "" })),
  "wi_transport": dataTransport.map((item) => ({ ...item, question: "", question_en: "", answer: "", answer_en: "" })),
  "wi_directions": dataDirections.map((item) => ({ ...item, question: "", question_en: "", answer: "", answer_en: "" })),
  "wi_sports": dataSports.map((item) => ({ ...item, question: "", question_en: "", answer: "", answer_en: "" })),
  "ii_sports": dataSports.map((item) => ({ ...item, question: "", question_en: "", answer: "", answer_en: "" })),
  "wi_taste": dataTaste.map((item) => ({ ...item, question: "", question_en: "", answer: "", answer_en: "" })),
  "wi_feelings": dataFeelings.map((item) => ({ ...item, question: "", question_en: "", answer: "", answer_en: "" })),
  "wi_people_pronouns": dataPeoplePronouns.map((item) => ({ ...item, question: "", question_en: "", answer: "", answer_en: "" })), // Add word identification for pronouns
  "wi_prohibition": dataProhibition.map((item) => ({ ...item, question: "", question_en: "", answer: "", answer_en: "" })),
  "ii_prohibition": dataProhibition.map((item) => ({ ...item, question: "", question_en: "", answer: "", answer_en: "" })),
  "wi_random": [...dataFruitsAndVegitables, ...dataAnimals, ...dataFoods].map((item) => ({ ...item, question: "", question_en: "", answer: "", answer_en: "" })),
  "qa_question-answer" : dataSimpleQuestions.map((item) => ({ ...item, image: "", kword: "", eword : "", kreading: "" })),
};


export default function Home() {
  const [isSlideMenuOpen, setIsSlideMenuOpen] = useState(false); // State for slide menu
  const [category, setCategory] = useState<string>("image_identification");
  const [activityType, setActivityType] = useState<string>("");
  const [data, setData] = useState<CategoryItem[]>(categories[category] || []);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [randomNumbers, setRandomNumbers] = useState<number[][]>([]);
  const [correctSound, setCorrectSound] = useState<HTMLAudioElement | null>(null);
  const [wrongSound, setWrongSound] = useState<HTMLAudioElement | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isModalOpenHangul, setIsModalOpenHangul] = useState<boolean>(false);
  const [countWrongAnswers, setCountWrongAnswers] = useState<number>(0);
  const [viewKreading, setViewKreading] = useState<boolean>(false);
  const [isReverse, setIsReverse] = useState<boolean>(false);
  const [isImageIdentification, setIsImageIdentification] = useState<boolean>(true);
  const [started, setStarted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null); // Use `null` to indicate loading state
  const [loading, setLoading] = useState(false); // State for the line loader
  const [isNextButtonEnabled, setIsNextButtonEnabled] = useState(() => {
    const savedState = Cookies.get("isNextButtonEnabled");
    return savedState === "true"; // Retrieve initial state from cookie
  });
  const [isSoundEnabled, setIsSoundEnabled] = useState(() => {
    const savedState = Cookies.get("isSoundEnabled");
    return savedState !== undefined ? savedState === "true" : true; // Default to true if no cookie is found
  });

  const NumberOfChoices = 4;
  const EnableReverse = true;
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

  useEffect(() => {
    const savedCategory = Cookies.get("currentCategory");   
    if (savedCategory && categories[savedCategory]) {
      const savedCategoryType = savedCategory.split('_')[0];
      setCategory(savedCategory);
      setActivityType(savedCategoryType);
      setData(shuffleArray(categories[savedCategory]));

      

      if(savedCategoryType === "qa") {
        setIsReverse(false);
      }else if(savedCategoryType === "ii") {
        setIsImageIdentification(true);
      }else {
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

  useEffect(() => {
    const numbers = data.map((_, index) =>
      getRandomNumber(index, NumberOfChoices - 1, data.length)
    );
    setRandomNumbers(numbers);
  }, [currentQuestion, data]);

  const playSound = (sound: HTMLAudioElement | null) => {
    if (isSoundEnabled && sound) {
      sound.currentTime = 0;
      sound.play();
    }
  };

  const checkAnswer = (selected: number, correct: number) => {
    setSelectedAnswer(selected);
    if (selected === correct) {
      setIsCorrect(true);
      setLoading(true);
      setLoadingDuration(2000);
      setProgress(0);
      playSound(correctSound);
      setViewKreading(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      if (!isNextButtonEnabled) {
        setTimeout(() => {
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
            setLoading(false);
            setProgress(0);
          }, 500);
        }, 2000);
      }
    } else {
      setIsCorrect(false);
      setCountWrongAnswers((prev) => prev + 1);
      playSound(wrongSound);
    }
  };

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = event.target.value;
    const savedCategoryType = newCategory.split('_')[0];
    setCategory(newCategory);
    setActivityType(savedCategoryType);
    setData(shuffleArray(categories[newCategory] || []));
    setCurrentQuestion(0);
    setCountWrongAnswers(0);
    setViewKreading(false);  
    setIsImageIdentification(false);
    
    Cookies.set("currentCategory", newCategory, { expires: CookiesExpiration }); // Save category to cookie

    if(isNextButtonEnabled){
      setSelectedAnswer(null);
      setIsCorrect(null);
    } 
    
    if(savedCategoryType === "qa") {
      setIsReverse(false);
    }else if(savedCategoryType === "ii") {
      setIsImageIdentification(true);
    }else {
      setIsImageIdentification(false);
    }
    
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

  const toggleNextButton = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isEnabled = event.target.checked;
    setIsNextButtonEnabled(isEnabled);
    Cookies.set("isNextButtonEnabled", isEnabled.toString(), { expires: CookiesExpiration }); // Save state to cookie
  };

  const toggleSound = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isEnabled = event.target.checked;
    setIsSoundEnabled(isEnabled);
    Cookies.set("isSoundEnabled", isEnabled.toString(), { expires: CookiesExpiration }); // Save state to cookie
  };

  useEffect(() => {
    const savedState = Cookies.get("isNextButtonEnabled");
    if (savedState !== undefined) {
      setIsNextButtonEnabled(savedState === "true");
    }
  }, []);

  useEffect(() => {
    const savedState = Cookies.get("isSoundEnabled");
    if (savedState !== undefined) {
      setIsSoundEnabled(savedState === "true");
    }
  }, []);


  {/* Page Display Loading */}
  if (isLoggedIn === null) {
    // Show a loading state while cookies are being checked
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <p>Loading...</p>
      </div>
    );
  }

  {/* Page Display Login */}
  if (isLoggedIn === null || !isLoggedIn) {
    return <Login />;
  }

  {/* Page Display Welcome */}
  if (!started) {
    return (
      <Welcome onStarted={handleStart} onCategoryChange={handleCategoryChange} categories={categories} />
    );
  }
  
  {/* Page Display Main */}
  return (
    <div className={`grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen px-4 font-[family-name:var(--font-geist-sans)] bg-black`}>
      
      {/* Page Loader */}
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
      
      {/* Side Menu */}
      <SideMenu
        isOpen={isSlideMenuOpen}
        onClose={closeSlideMenu}
        category={category}
        categories={categories}
        onCategoryChange={handleCategoryChange}
        isNextButtonEnabled={isNextButtonEnabled}
        toggleNextButton={toggleNextButton}
        isSoundEnabled={isSoundEnabled}
        toggleSound={toggleSound}
        onOpenHangulModal={() => setIsModalOpenHangul(true)}
      />

      {/* Slide Menu Toggle Button */}
      <button
        onClick={toggleSlideMenu}
        className="fixed top-4 left-4 bg-gray-700 text-white px-4 py-2 rounded-md z-50 cursor-pointer"
      >
        <Menu size={24} />
      </button>
        
      {/* Main Content */}
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start max-sm:w-full">

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
          activityType === "ii" ? 
            <QuestionImageIdentification
              randomNumbers={randomNumbers[currentQuestion]}
              currentQuestion={currentQuestion}
              data={data}
              selectedAnswer={selectedAnswer}
              isCorrect={isCorrect}
              checkAnswer={checkAnswer}
            />
          : activityType === "qa" ?
            <QuestionAndAnswer
              randomNumbers={randomNumbers[currentQuestion]}
              currentQuestion={currentQuestion}
              data={data}
              selectedAnswer={selectedAnswer}
              isCorrect={isCorrect}
              viewKreading={viewKreading}
              checkAnswer={checkAnswer}
            />    
          :<QuestionWordIdentification
            randomNumbers={randomNumbers[currentQuestion]}
            currentQuestion={currentQuestion}
            data={data}
            selectedAnswer={selectedAnswer}
            isCorrect={isCorrect}
            isReverse={isReverse}
            viewKreading={viewKreading}
            enableReverse={EnableReverse}
            onReverseChange={setIsReverse}
            checkAnswer={checkAnswer}
          />
        )}
        
        {isNextButtonEnabled && isCorrect &&(
          <div className="fixed bottom-0 left-0 right-0 flex flex-row gap-4 items-center justify-between w-full shadow-md bg-black border-t text-green-500">
            <a onClick={() => handleNextQuestion()} className="flex flex-row justify-center items-center text-green-500 hover:text-green-400 animate-pulse text-vw-26 bg-transparent p-4 cursor-pointer w-full"><span className="mr-2">Next</span> <ArrowRightCircle  size={32} className="justify-self-end" /></a>
          </div>
        )}
        <Modal isOpen={isModalOpenHangul} onClose={() => setIsModalOpenHangul(false)}>
          <Hangeul />
        </Modal>
      </main>
    </div>
  );

}
