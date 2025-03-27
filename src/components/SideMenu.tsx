import React from "react";
import { ArrowRightCircle, XCircle } from "@deemlol/next-icons";

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

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  category: string;
  categories: Record<string, CategoryItem[]>;
  onCategoryChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  isNextButtonEnabled: boolean;
  toggleNextButton: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isSoundEnabled: boolean;
  toggleSound: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onOpenHangulModal: () => void;
}

const SideMenu: React.FC<SideMenuProps> = ({
  isOpen,
  onClose,
  category,
  categories,
  onCategoryChange,
  isNextButtonEnabled,
  toggleNextButton,
  isSoundEnabled,
  toggleSound,
  onOpenHangulModal,
}) => {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-[9998] cursor-pointer"
          onClick={onClose} // Close menu when overlay is clicked
        ></div>
      )}

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white hover:text-gray-300 shadow-lg transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 z-[9999]`}
      >
        <button
          onClick={onClose}
          className="absolute top-0 right-0 text-white hover:text-gray-300 p-4 rounded-md cursor-pointer"
        >
          <XCircle size={24} />
        </button>
        <div className="p-2 py-[40px]">
          <ul className="space-y-2">
            <li className="px-2 py-3">
              <div className="flex flex-col gap-4 items-center">
                <strong className="text-left block w-full">Category: </strong>
                <select
                  className="text-black capitalize px-1 py-2 rounded-md border border-gray-300 bg-white w-full"
                  value={category}
                  onChange={onCategoryChange}
                >
                  {Object.keys(categories).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.replace("-", " & ").replace("_", " ")} ({categories[cat]?.length || 0})
                    </option>
                  ))}
                </select>
              </div>
            </li>
            <li className="px-2 py-3">
              <div className="flex flex-row gap-2 items-center">
                <input
                  type="checkbox"
                  id="toggleNextButton"
                  checked={isNextButtonEnabled}
                  onChange={toggleNextButton}
                  className="w-4 h-4"
                />
                <label htmlFor="toggleNextButton" className="text-white">
                  Enable Next Button
                </label>
              </div>
            </li>
            <li className="px-2 py-3">
              <div className="flex flex-row gap-2 items-center">
                <input
                  type="checkbox"
                  id="toggleSound"
                  checked={isSoundEnabled}
                  onChange={toggleSound}
                  className="w-4 h-4"
                />
                <label htmlFor="toggleSound" className="text-white">
                  Enable Sound
                </label>
              </div>
            </li>
            <li className="mt-[100px] px-2 py-3">
              <a
                onClick={onOpenHangulModal}
                className="cursor-pointer border font-bold rounded-md p-2 flex justify-between  w-full bg-white hover:bg-gray-100 text-black text-center"
              >
                View Hangeul <ArrowRightCircle size={24} />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default SideMenu;
