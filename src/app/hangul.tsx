const hangulLetters = [
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

export default function Hangul() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-white">
      <h1 className="text-vw-36 font-bold mb-4 max-md:text-vw-17">Hangul Letters</h1>
      <table className="text-vw-20 table-auto border-collapse border border-gray-400 w-full max-md:text-vw-12">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Letter</th>
            <th className="border border-gray-300 px-4 py-2">Name</th>
            <th className="border border-gray-300 px-4 py-2">Sound</th>
          </tr>
        </thead>
        <tbody>
          {hangulLetters.map((letter, index) => (
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
