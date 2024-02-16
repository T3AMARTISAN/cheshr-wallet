const ToggleButton = ({ isToggled, setIsToggled }) => {
  const toggleClass = isToggled ? "bg-purple-300" : "bg-teal-200";
  const knobClass = isToggled ? "translate-x-14" : "translate-x-0";

  return (
    <div className="m-4 flex flex-row gap-4 justify-center">
      <div>Seed Phrase</div>
      <button
        className={`w-20 h-6 flex items-center ${toggleClass} rounded-full p-1 cursor-pointer`}
        onClick={() => setIsToggled(!isToggled)}
      >
        <div
          className={`bg-white w-4 h-4 rounded-full shadow-md transform ${knobClass} transition-transform`}
        />
      </button>
      <div>Private Key</div>
    </div>
  );
};

export default ToggleButton;
