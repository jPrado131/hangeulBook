import { useState } from "react";

const hangulConsonants = [
  { letter: "ㄱ", name: "Giyeok", sound: "g/k" },
  { letter: "ㄴ", name: "Nieun", sound: "n" },
  { letter: "ㄷ", name: "Digeut", sound: "d/t" },
  { letter: "ㄹ", name: "Rieul", sound: "r/l" },
  { letter: "ㅁ", name: "Mieum", sound: "m" },
  { letter: "ㅂ", name: "Bieup", sound: "b/p" },
  { letter: "ㅅ", name: "Siot", sound: "s" },
  { letter: "ㅇ", name: "Ieung", sound: "ng" },
  { letter: "ㅈ", name: "Jieut", sound: "j/ch" },
  { letter: "ㅊ", name: "Chieut", sound: "ch" },
  { letter: "ㅋ", name: "Kieuk", sound: "k" },
  { letter: "ㅌ", name: "Tieut", sound: "t" },
  { letter: "ㅍ", name: "Pieup", sound: "p" },
  { letter: "ㅎ", name: "Hieut", sound: "h" },
];

const hangulVowels = [
  { letter: "ㅏ", name: "A", sound: "a" },
  { letter: "ㅑ", name: "Ya", sound: "ya" },
  { letter: "ㅓ", name: "Eo", sound: "eo" },
  { letter: "ㅕ", name: "Yeo", sound: "yeo" },
  { letter: "ㅗ", name: "O", sound: "o" },
  { letter: "ㅛ", name: "Yo", sound: "yo" },
  { letter: "ㅜ", name: "U", sound: "u" },
  { letter: "ㅠ", name: "Yu", sound: "yu" },
  { letter: "ㅡ", name: "Eu", sound: "eu" },
  { letter: "ㅣ", name: "I", sound: "i" },
  { letter: "ㅐ", name: "Ae", sound: "ae" },
  { letter: "ㅒ", name: "Yae", sound: "yae" },
  { letter: "ㅔ", name: "E", sound: "e" },
  { letter: "ㅖ", name: "Ye", sound: "ye" },
];

const hangulDoubleConsonants = [
  { letter: "ㄲ", name: "Ssang Giyeok", sound: "kk" },
  { letter: "ㄸ", name: "Ssang Digeut", sound: "tt" },
  { letter: "ㅃ", name: "Ssang Bieup", sound: "pp" },
  { letter: "ㅆ", name: "Ssang Siot", sound: "ss" },
  { letter: "ㅉ", name: "Ssang Jieut", sound: "jj" },
];

export default function Hangul() {
  const [activeTab, setActiveTab] = useState<"consonants" | "vowels" | "doubleConsonants">("consonants");

  const letters =
    activeTab === "consonants"
      ? hangulConsonants
      : activeTab === "vowels"
      ? hangulVowels
      : hangulDoubleConsonants;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center md:p-8 max-sm:px-4 max-sm:pt-8 text-white">
      <h1 className="text-vw-36 font-bold mb-4 max-md:text-vw-17">Hangeul Letters</h1>
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab("consonants")}
          className={`px-4 py-2 rounded-md ${
            activeTab === "consonants" ? "bg-green-500" : "bg-gray-700"
          }`}
        >
          Consonants
        </button>
        <button
          onClick={() => setActiveTab("doubleConsonants")}
          className={`px-4 py-2 rounded-md ${
            activeTab === "doubleConsonants" ? "bg-green-500" : "bg-gray-700"
          }`}
        >
          Double
        </button>
        <button
          onClick={() => setActiveTab("vowels")}
          className={`px-4 py-2 rounded-md ${
            activeTab === "vowels" ? "bg-green-500" : "bg-gray-700"
          }`}
        >
          Vowels
        </button>
      </div>
      <table className="text-vw-20 table-auto border-collapse border border-gray-400 w-full max-md:text-vw-12">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Letter</th>
            <th className="border border-gray-300 px-4 py-2">Name</th>
            <th className="border border-gray-300 px-4 py-2">Sound</th>
          </tr>
        </thead>
        <tbody>
          {letters.map((letter, index) => (
            <tr key={index}>
              <td className="border border-gray-300 px-4 py-2 text-center">{letter.letter}</td>
              <td className="border border-gray-300 px-4 py-2">{letter.name}</td>
              <td className="border border-gray-300 px-4 py-2">{letter.sound}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
