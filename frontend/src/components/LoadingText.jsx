import { useState, useEffect } from "react";

const LoadingText = () => {
  const fullText = "Calculating...";
  const [text, setText] = useState("");

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setText((prev) => prev + fullText[index]);
      index++;
      if (index === fullText.length) {
        clearInterval(interval);
      }
    }, 150); // Adjust the speed of typing here

    return () => clearInterval(interval);
  }, []);

  return <div className="loading-container">{text}</div>;
};

export default LoadingText;
