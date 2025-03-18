import { ChangeEvent, useState } from "react";

import { FaCopy } from "react-icons/fa";
import { getBilagFromFile, getMypFormattedText } from "@/myp";

function generator() {
  const [mypText, setMypText] = useState("");

  const selectMypText = () => {
    const textarea = document.getElementById(
      "myp-data-text",
    ) as HTMLTextAreaElement;
    textarea.select();
  };

  const copyMypText = () => {
    selectMypText();
    document.execCommand("copy");
  };

  const handleMypFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0];
    const encoding = "windows-1252";
    if (file) {
      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target && typeof e.target.result === "string") {
          setMypText(getMypFormattedText(getBilagFromFile(e.target.result)));
        }
      };

      reader.readAsText(file, encoding);
    } else setMypText("");
  };

  return (
    <div className="space-y-3">
      <div>
        <input
          type="file"
          accept=".txt"
          onChange={handleMypFile}
          id="myp-data-file"
          className="file:button text-white file:mr-2"
        />
      </div>
      <div>
        <div className="max-w-225 group relative">
          <textarea
            onClick={selectMypText}
            id="myp-data-text"
            className="field-sizing-content peer min-h-48 w-full rounded border-2 border-gray-400 bg-gray-200 px-2 py-1 text-gray-700 shadow-md"
            readOnly
            value={mypText}
          />
          <button
            onClick={copyMypText}
            id="myp-data-ctc"
            className="leading text-power absolute right-2 top-2 hidden aspect-square cursor-pointer focus:scale-[0.9] group-hover:inline peer-focus:inline"
          >
            <FaCopy />
          </button>
        </div>
      </div>
    </div>
  );
}

export default generator;
