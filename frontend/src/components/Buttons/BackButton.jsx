const BackButton = () => {
  return (
    <div className="sticky flex flex-row gap-2 px-4 translate-x-10 -translate-y-8 dm-sans-body active:bg-lime-200 hover:bg-[#9effae58]">
      <img src="./images/back-icon.svg" />
      <p className="text-purple-50">Back</p>
    </div>
  );
};

export default BackButton;
