const BackButton = () => {
  return (
    <div className="sticky flex flex-row gap-2 px-4 translate-x-10 -translate-y-8 dm-sans-body active:text-purple-100 hover:text-purple-300">
      <img src="./images/back-icon.svg" />
      <p className="text-purple-100">Back</p>
    </div>
  );
};

export default BackButton;
