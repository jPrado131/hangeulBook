import { CategoryItem } from "./CategoryItem";

export interface SideMenuProps {
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
