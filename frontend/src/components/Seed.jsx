import { useState } from "react";
import { GrRevert } from "react-icons/gr";

const Seed = ({ onPhraseComplete }) => {
  // 시드구문 배열 (12단어, 상황에 따라 24단어 필요할 수도)
  const [words, setWords] = useState(Array(12).fill(""));

  // 단어의 입력값이 달라질 경우, 변경값 저장
  const handleWordChange = (index, word) => {
    const newWords = [...words];
    newWords[index] = word;
    setWords(newWords);

    // 시드구문의 12 단어가 채워지면 스트링으로 부모 컴포넌트로 다시 보내기
    if (newWords.every((word) => word.length > 0)) {
      onPhraseComplete(newWords.join(" "));
    }
  };

  const resetWords = () => {
    setWords(Array(12).fill(""));
    onPhraseComplete(""); // 부모 컴포넌트에서 시드구문 초기화하기
  };

  const handlePaste = (event) => {
    // 기존 붙여넣기 동작 방지
    event.preventDefault();
    // 클립보드에서 붙여놓은 데이터 가져오기
    const pasteText = event.clipboardData.getData("text");
    // 스트링의 빈칸 기준으로 단어를 분리하고, 첫 12 단어 가져오기
    const pasteWords = pasteText.trim().split(/\s+/).slice(0, 12);

    // 12 단어가 확인되면 상태변수에 저장하기
    if (pasteWords.length === 12) {
      setWords(pasteWords);
      onPhraseComplete(pasteWords.join(" "));
    } else {
      // 12단어가 아닌 경우, 에러 메시지 띄우기
      console.error("The pasted seed phrase does not have exactly 12 words.");
    }
  };

  return (
    <>
      <div className="flex flex-wrap justify-center items-center gap-1 mx-auto">
        {words.map((word, index) => (
          <div
            key={index}
            className={`flex flex-row items-center justify-center ${
              index >= 6 ? "" : ""
            }`}
          >
            <input
              className="inputbox w-32 rounded-none"
              type="text"
              value={word}
              placeholder={index + 1}
              onChange={(e) => handleWordChange(index, e.target.value)}
              onPaste={index === 0 ? handlePaste : null}
            />
          </div>
        ))}
      </div>
      <button
        onClick={resetWords}
        className="flex flex-row justify-center items-center gap-2 pt-1 ml-auto mr-7 text-rose-300 rounded hover:text-rose-600"
      >
        <GrRevert />
        <div>Reset</div>
      </button>
    </>
  );
};

export default Seed;
