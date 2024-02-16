import { useState } from "react";

const Seed = ({ onPhraseComplete }) => {
  // State to hold the array of words.
  const [words, setWords] = useState(Array(12).fill(""));

  // Handle input change for each word.
  const handleWordChange = (index, word) => {
    const newWords = [...words];
    newWords[index] = word;
    setWords(newWords);

    // If all words are filled, pass the seed phrase back to the parent component.
    if (newWords.every((word) => word.length > 0)) {
      onPhraseComplete(newWords.join(" "));
    }
  };

  const handlePaste = (event) => {
    // Prevent the default paste behavior
    event.preventDefault();
    // Get the pasted text from the clipboard
    const pasteText = event.clipboardData.getData("text");
    // Split the text by spaces and take the first 12 elements
    const pasteWords = pasteText.split(/\s+/).slice(0, 12);

    // If there are exactly 12 words, set them to the state
    if (pasteWords.length === 12) {
      setWords(pasteWords);
      onPhraseComplete(pasteWords.join(" "));
    } else {
      // Handle the error case where there are not exactly 12 words
      console.error("The pasted seed phrase does not have exactly 12 words.");
    }
  };

  const resetWords = () => {
    setWords(Array(12).fill(""));
    onPhraseComplete(""); // Optionally reset the phrase in the parent component
  };

  return (
    <>
      <div className="flex flex-wrap justify-center gap-1">
        {words.map((word, index) => (
          <div
            key={index}
            className={`flex flex-row items-center ${index >= 6 ? "" : ""}`}
          >
            <input
              className="border border-gray-300 rounded px-2 py-1"
              type="text"
              value={word}
              placeholder={index + 1}
              onChange={(e) => handleWordChange(index, e.target.value)}
              onPaste={index === 0 ? handlePaste : null}
            />
          </div>
        ))}
      </div>
      <div className="text-center mt-4">
        <button
          onClick={resetWords}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none"
        >
          Reset
        </button>
      </div>
    </>
  );
};

export default Seed;
