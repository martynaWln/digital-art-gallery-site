import React, { useState } from "react";
import { FaSort } from "react-icons/fa";

const SortButton = ({ onSort, onClearSort }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState("Sort by");

  const handleSort = (option) => {
    setSelectedSort(option);
    onSort(option);
    setIsOpen(false);
  };

  const handleClearSort = () => {
    setSelectedSort("Sort by"); 
    onClearSort();              
    setIsOpen(false);
  };
  
  

  return (
    <div className="relative inline-block text-left">
      {/* Przycisk sortowania */}
      <button
        className="sort bg-gray-300 px-4 py-2 rounded flex items-center gap-2 text-black"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FaSort />
        {selectedSort}
      </button>

      {/* Dropdown sortowania */}
      {isOpen && (
        <div className="absolute left-2.5 mt-0 w-56 bg-white border rounded shadow-xl z-10">
          <ul className="py-2 text-black">
            <li
              className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
              onClick={() => handleSort("Title A-Z")}
            >
              Title (A-Z)
            </li>
            <li
              className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
              onClick={() => handleSort("Title Z-A")}
            >
              Title (Z-A)
            </li>
            <li
              className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
              onClick={() => handleSort("By Institution")}
            >
              By Institution Name (A-Z)
            </li>

            {/* Separator */}
            <hr className="my-1" />

            {/* Clear Sort */}
            <li
              className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
              onClick={handleClearSort}
            >
              Clear Sort
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default SortButton;
