/*
function getTabbedMYPData(bilagArr) {
  const mypText = [
    ...bilagArr.map((bilag) => Object.values(bilag).join("	")),
  ].join("\n");
  return mypText;
}

setMypText(getMypFormattedText(getBilagFromFile(e.target.result)));

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
import { FaCopy } from "react-icons/fa";
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
</div>;

*/
