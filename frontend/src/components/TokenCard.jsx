const TokenCard = ({ ticker }) => {
  return (
    <div className="flex bg-purple-400  mx-6   items-center mb-6">
      <div className="h-12 w-12 rounded-full bg-red-400 text-center"></div>
      <div className="grow flex justify-between bg-green-100 text-lg">
        <div>
          <div>24.0379</div>
          <div className="text-xs text-gray-800 ">{ticker}</div>
        </div>

        <div>
          <div>$24.02</div>
          <div className="text-xs text-gray-800 ">@1405.3</div>
        </div>
      </div>
    </div>
  );
};

export default TokenCard;
