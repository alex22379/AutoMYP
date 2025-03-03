import { ChangeEvent, useState } from "react";
import mypLogo from "./assets/myp-logo.png";
import { FaCopy } from "react-icons/fa";

import { getMypData, getMypText } from "./myp";

function App() {
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
          setMypText(getMypText(getMypData(e.target.result)));
        }
      };

      reader.readAsText(file, encoding);
    } else setMypText("");
  };

  return (
    <>
      <main className="flow-4 flex min-h-dvh flex-col bg-power-gray p-9">
        <img src={mypLogo} alt="MyPOWER logo" className="h-auto w-96" />
        <div>
          <input
            type="file"
            accept=".txt"
            onChange={handleMypFile}
            id="myp-data-file"
            className="text-white file:cursor-pointer file:rounded file:border-2 file:border-gray-400 file:bg-gray-200 file:px-2.5 file:py-1 file:font-semibold file:text-power file:shadow-md"
          />
        </div>
        <div>
          <div className="group relative w-full md:w-[60%]">
            <textarea
              onClick={selectMypText}
              id="myp-data-text"
              className="peer field-sizing-content min-h-48 w-full rounded border-2 border-gray-400 bg-gray-200 px-2 py-1 text-gray-700 shadow-md outline-power"
              readOnly
              value={mypText}
            />
            <button
              onClick={copyMypText}
              id="myp-data-ctc"
              className="leading absolute top-2 right-2 hidden aspect-square cursor-pointer text-power group-hover:inline peer-focus:inline focus:scale-[0.9]"
            >
              <FaCopy />
            </button>
          </div>
        </div>
        <div className="text-gray-400">
          <p className="text-sm font-bold">I Elguide:</p>
          <ol className="ml-6 list-decimal text-xs">
            <li>
              <p>Åben menu 170</p>
            </li>
            <li>
              <p>
                Vælg menupunkt 2, <i>Bilagsliste/-kopi</i>
              </p>
            </li>
            <li>
              <p>Indtast nu dine parametrer og den ønskede periode</p>
            </li>
            <li>
              <p>
                I den næste menu vælges <i>"Privatkunder"</i>
              </p>
            </li>
            <li>
              <p>
                Herefter <i>"Kontantbilag"</i>
              </p>
            </li>
            <li>
              <p>
                Tryk nu <code>F12</code> og vælg <i>"Eksport"</i>
              </p>
            </li>
          </ol>
          <p className="mt-2 text-sm font-bold">
            Vend tilbage til denne hjemmeside:
          </p>
          <ol className="ml-6 list-decimal text-xs">
            <li>
              <p>Upload den eksportede fil fra Elguide</p>
            </li>
            <li>
              <p>
                Kopier teksten og indsæt den i Excel-skemaet under fanen{" "}
                <i>"myp-data"</i> i celle <code>A1</code>
              </p>
            </li>
          </ol>
        </div>
        <div className="flex flex-col text-sm text-power">
          <a href="/myp.txt" download="myp.txt">
            Download Elguide-testfil <i>(fiktiv data)</i>
          </a>
          <a href="/AutoMYP-skema.xlsx" download="AutoMYP-skema.xlsx">
            Download Excel-skabelon
          </a>
        </div>
        <div>
          <a
            href="https://alexandersandholdt.dk"
            target="_blank"
            className="text-xs leading-0 text-[#17285E] hover:underline"
          >
            Made by Alexander Sandholdt
          </a>
        </div>
      </main>
    </>
  );
}

export default App;
