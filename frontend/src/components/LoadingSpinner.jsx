const LoadingSpinner = () => {
  return (
    <div
      className="flex flex-col"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "50vh",
      }}
    >
      <div className="text-purple-50 animate-pulse mb-2 ">Loading...</div>
      <div className="spinner"></div>
    </div>
  );
};

export default LoadingSpinner;
