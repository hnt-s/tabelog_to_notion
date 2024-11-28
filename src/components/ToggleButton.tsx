interface ToggleButtonProps {
  selectedDatabase: string;
  onToggle: (database: string) => void;
}

export default function ToggleButton({ selectedDatabase, onToggle }: ToggleButtonProps) {
  return (
    <div>
      <button
        onClick={() => onToggle('DATABASE_DATE')}  // 'DATABASE_DATE' を選択
        className={`px-4 py-2 rounded ${
          selectedDatabase === 'DATABASE_DATE'
            ? 'bg-gray-700 text-white'
            : 'bg-gray-300 text-gray-700'
        }`}
      >
        デートにおすすめ
      </button>
      <button
        onClick={() => onToggle('DATABASE_WITH_FRIENDS')}  // 'DATABASE_WITH_FRIENDS' を選択
        className={`px-4 py-2 rounded ${
          selectedDatabase === 'DATABASE_WITH_FRIENDS'
            ? 'bg-gray-700 text-white'
            : 'bg-gray-300 text-gray-700'
        }`}
      >
        みんなで行きたい！
      </button>
    </div>
  );
}
