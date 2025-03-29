import { CategoryItem } from "@/interfaces/CategoryItem";
import { useState } from "react";
import SearchableDropdown from "../components/SearchableDropdown"; // Import the SearchableDropdown component

interface WelcomeProps {
  categories: Record<string, CategoryItem[]>;
  onStarted: () => void;
  onCategoryChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function Welcome({ onStarted, categories, onCategoryChange }: WelcomeProps) {
  const [started, setStarted] = useState(false);

  const handleCategorySelect = (cat: string) => {
    onCategoryChange({ target: { value: cat } } as React.ChangeEvent<HTMLSelectElement>);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-8">
      {!started ? (
        <>
          <h1 className="text-5xl font-extrabold mb-6 text-center text-green-500 max-sm:text-[36px]">Welcome to Hangeul Book</h1>
          <h2 className="text-2xl mb-6 text-center text-gray-300">Practice Hangeul Anytime, Anywhere!</h2>
          <p className="text-lg mb-8 text-center text-gray-400 leading-relaxed">
            Learn Hangeul easily with Hangeul Book. Whether you&apos;re at home, commuting, or taking a break, our app helps you practice and review your Korean language skills anytime, anywhere. Stay consistent and improve effortlessly with our simple and effective learning tools!
          </p>
          <button
            onClick={() => setStarted(true)}
            className="bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-bold shadow-lg hover:bg-green-500 hover:shadow-xl transition-all duration-300"
          >
            Get Started 🚀
          </button>
        </>
      ) : (
        <div className="w-full max-w-2xl">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
            <h2 className="text-3xl font-bold mb-4 text-center text-green-400 max-sm:text-[24px]">Read This Carefully</h2>
            <ul className="space-y-4 text-gray-300">
              <li>
                <span className="font-semibold text-white">Image Identification (II):</span> Identify the object in the given image and provide a brief description.
              </li>
              <li>
                <span className="font-semibold text-white">Word Identification (WI):</span> Recognize the given word and provide its definition or usage in a sentence.
              </li>
              <li>
                <span className="font-semibold text-white">Question and Answer (QA):</span> Read the question carefully and provide the most appropriate answer.
              </li>
            </ul>
          </div>
          <div className="flex flex-col gap-6 items-center">
            <strong className="text-xl font-semibold text-gray-200">Begin an Exciting Activity</strong>
            <SearchableDropdown
              options={categories}
              placeholder="Search or select an activity..."
              onSelect={handleCategorySelect}
            />
            <button
              onClick={onStarted}
              className="bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-bold shadow-lg hover:bg-green-500 hover:shadow-xl transition-all duration-300"
            >
              Start
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
