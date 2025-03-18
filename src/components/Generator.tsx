import { ChangeEvent, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { toPng, toBlob } from "html-to-image";

import {
  getBilagFromFile,
  getDatePeriodString,
  getSalesmenMypStats,
} from "@/myp";

function generator() {
  const [searchParams] = useSearchParams();
  const tableRef = useRef<HTMLTableElement>(null);

  const handleDownload = () => {
    if (tableRef.current === null) return;

    toPng(tableRef.current, { cacheBust: true })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = "myp-status-skema.png";
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleCopy = () => {
    if (tableRef.current === null) return;

    toBlob(tableRef.current, { cacheBust: true })
      .then((blob) => {
        navigator.clipboard.write([
          new ClipboardItem({
            [blob!.type]: blob!,
          }),
        ]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  interface SalesmanMypStats {
    [key: string]: {
      name: string;
      hitrate: number;
      "3": number;
      "2": number;
      "1": number;
      "0": number;
      total: number;
    };
  }
  const [salesmenMypStats, setSalesmenMypStats] = useState<SalesmanMypStats>(
    {},
  );
  const [datePeriodString, setDatePeriodString] = useState("");

  const handleMypFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0];
    const encoding = "windows-1252";
    if (file) {
      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target && typeof e.target.result === "string") {
          const bilagArr = getBilagFromFile(e.target.result);
          setSalesmenMypStats(getSalesmenMypStats(bilagArr));
          setDatePeriodString(getDatePeriodString(bilagArr));
        }
      };

      reader.readAsText(file, encoding);
    } else setSalesmenMypStats({});
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
      {/*

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
      </div>
			*/}
      {Object.entries(salesmenMypStats).length > 0 && (
        <>
          <div className="overflow-auto shadow-lg">
            <table
              className="myp-table | text-white border-3 overflow-hidden rounded bg-gray-400"
              ref={tableRef}
            >
              <thead className="text-white">
                <tr className="!bg-power-gray-400">
                  <th colSpan={8}>
                    <div className="flex w-full flex-col">
                      <span className="w-full text-xl font-black">
                        MYPOWER-STATUS
                      </span>
                      <span className="w-full text-sm font-medium italic">
                        {searchParams.get("departmentName") ??
                          "<Afdeling/varehus>"}
                      </span>
                      <span className="w-full text-sm font-medium italic">
                        {datePeriodString}
                      </span>
                    </div>
                  </th>
                </tr>
                <tr className="bg-power-400 uppercase">
                  <th>Sælgerkode</th>
                  <th>Navn</th>
                  <th>Hitrate</th>
                  <th className="italic">"MyPOWER"</th>
                  <th className="italic">"IM"</th>
                  <th className="italic">"Er MYP"</th>
                  <th className="italic">Ikke spurgt</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(salesmenMypStats).map((salesman) => (
                  <tr key={salesman}>
                    <td className="text-gray-500">{salesman}</td>
                    <td className="!font-[600]">
                      {salesmenMypStats[salesman].name}
                    </td>
                    <td
                      className={`text-center !font-[600] ${salesmenMypStats[salesman].hitrate >= 0.8 ? "text-green-600" : salesmenMypStats[salesman].hitrate >= 0.5 ? "text-yellow-500" : "text-red-600"}`}
                    >
                      {(salesmenMypStats[salesman].hitrate * 100).toFixed(1)}%
                    </td>
                    <td className="text-center italic">
                      {salesmenMypStats[salesman]["3"] ?? 0}
                    </td>
                    <td className="text-center italic">
                      {salesmenMypStats[salesman]["2"] ?? 0}
                    </td>
                    <td className="text-center italic">
                      {salesmenMypStats[salesman]["1"] ?? 0}
                    </td>
                    <td className="text-center italic">
                      {salesmenMypStats[salesman]["0"] ?? 0}
                    </td>
                    <td className="text-right text-gray-500">
                      {salesmenMypStats[salesman].total}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex gap-3">
            {" "}
            <button className="button" onClick={handleDownload}>
              Download skema
            </button>
            <button className="button" onClick={handleCopy}>
              Kopiér skema
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default generator;
