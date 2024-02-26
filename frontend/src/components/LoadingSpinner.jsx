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
      <div className="animate-pulse">Loading...</div>
      <div className="spinner"></div>
    </div>
  );
};

export default LoadingSpinner;
