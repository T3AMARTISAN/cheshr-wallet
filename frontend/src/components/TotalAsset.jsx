const TotalAsset = () => {
  return (
    <div className="bg-neutral-500  py-3 h-[240px]  whitespace-pre">
      <ul className="text-neutral-50 font-light m-6 text-2xl">
        <li>February 29, 2024</li>
        <li>$100</li>
      </ul>
      <ul className="flex justify-between px-6">
        <li className="py-2 w-1/3 text-center rounded-md bg-red-200">Send</li>
        <li className="py-2 w-1/3 text-center  rounded-md bg-red-200">
          Receive
        </li>
      </ul>
    </div>
  );
};

export default TotalAsset;
