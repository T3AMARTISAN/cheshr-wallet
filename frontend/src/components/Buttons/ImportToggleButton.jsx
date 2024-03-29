const ImportToggleButton = ({ isToggled, setIsToggled }) => {
  const toggleClass = isToggled ? "bg-purple-200" : "bg-[#69467A]";
  const knobClass = isToggled ? "translate-x-14" : "translate-x-0";

  return (
    <div className="text-purple-100 my-2 mx-auto flex flex-row gap-4 justify-center items-center leading-5 dm-sans">
      <div>Token</div>
      <button
        className={`w-20 h-6 flex items-center ${toggleClass} rounded-full p-1 cursor-pointer`}
        onClick={() => setIsToggled(!isToggled)}
      >
        <div
          className={`bg-white w-4 h-4 rounded-full shadow-md transform ${knobClass} transition-transform`}
        />
      </button>
      <div className="whitespace-pre-line text-center text-purple-100">{`Liquidity
      Pool`}</div>
    </div>
  );
};

export default ImportToggleButton;
