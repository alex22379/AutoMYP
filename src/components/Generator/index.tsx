import { ChangeEvent, useState, useRef } from "react";

import { toPng, toBlob } from "html-to-image";

import processEGExportFile, {
  SalesmenMYPStats,
} from "@/scripts/processEGExportFile";
import MYPDataTable from "./MYPDataTable";

function generator() {
  // File input

  const [salesmenMYPStats, setSalesmenMYPStats] = useState<
    SalesmenMYPStats | undefined
  >(undefined);
  const [datePeriodString, setDatePeriodString] = useState("");

  const handleMypFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const egExportFile = e.target.files![0];
    const result = await processEGExportFile(egExportFile);

    if (result) {
      const [salesmenMYPStats, datePeriod] = result;
      setSalesmenMYPStats(salesmenMYPStats);
      setDatePeriodString(datePeriod);
    } else {
      setSalesmenMYPStats(undefined);
      setDatePeriodString("");
    }
  };

  // Buttons

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
      {salesmenMYPStats && (
        <>
          <MYPDataTable
            salesmenMYPStats={salesmenMYPStats}
            datePeriodString={datePeriodString}
            tableRef={tableRef}
          />

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
