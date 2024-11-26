import React from 'react';

const DATABASE_DATE = process.env.DATABASE_DATE || 'default_date_database';
const DATABASE_WITH_FRIENDS = process.env.DATABASE_WITH_FRIENDS || 'default_friends_database';

interface ToggleButtonProps {
  selected: string;
  options: string[];
  onSelect: (selected: string) => void;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({ selected, options, onSelect }) => {
  return (
    <div>
      {options.map((option, index) => (
        <button
          key={index}
          onClick={() => onSelect(option)}
          className={`px-4 py-2 rounded ${
            selected === option ? 'bg-gray-700 text-white' : 'bg-gray-300 text-gray-700'
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

export default ToggleButton;
