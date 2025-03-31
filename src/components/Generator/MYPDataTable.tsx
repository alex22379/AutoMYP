import { MYPStatus, SalesmenMYPStats } from "@/scripts/processEGExportFile";
import { FC } from "react";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import config from "@/config";

type props = {
  salesmenMYPStats: SalesmenMYPStats;
  datePeriodString: string;
  tableRef: React.RefObject<HTMLTableElement | null>;
};

const MYPDataTable: FC<props> = ({
  salesmenMYPStats,
  datePeriodString,
  tableRef,
}) => {
  const [searchParams] = useSearchParams();

  function sortTable(
    n: number,
    forceDir: "asc" | "desc" | undefined = undefined,
  ) {
    let rows,
      switching,
      i,
      x,
      y,
      shouldSwitch,
      dir,
      switchcount = 0;
    const table = tableRef.current!;
    switching = true;
    // Set the sorting direction to ascending:
    dir = forceDir ?? "desc";
    /* Make a loop that will continue until
		no switching has been done: */
    while (switching) {
      // Start by saying: no switching is done:
      switching = false;
      rows = table.rows;
      /* Loop through all table rows (except the
			first, which contains table headers): */
      for (i = 2; i < rows.length - 1; i++) {
        // Start by saying there should be no switching:
        shouldSwitch = false;
        /* Get the two elements you want to compare,
				one from current row and one from the next: */
        x = rows[i].getElementsByTagName("TD")[n];
        y = rows[i + 1].getElementsByTagName("TD")[n];
        /* Check if the two rows should switch place,
				based on the direction, asc or desc: */
        if (dir == "asc") {
          if (
            (x.getAttribute("data-sort-value") ?? Number(x.innerHTML)) >
            (y.getAttribute("data-sort-value") ?? Number(y.innerHTML))
          ) {
            // If so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        } else if (dir == "desc") {
          if (
            (x.getAttribute("data-sort-value") ?? Number(x.innerHTML)) <
            (y.getAttribute("data-sort-value") ?? Number(y.innerHTML))
          ) {
            // If so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        }
      }
      if (shouldSwitch) {
        /* If a switch has been marked, make the switch
				and mark that a switch has been done: */
        rows[i].parentNode!.insertBefore(rows[i + 1], rows[i]);
        switching = true;
        // Each time a switch is done, increase this count by 1:
        switchcount++;
      } else {
        /* If no switching has been done AND the direction is "asc",
				set the direction to "desc" and run the while loop again. */
        if (!forceDir && switchcount == 0 && dir == "desc") {
          dir = "asc";
          switching = true;
        }
      }
    }
  }

  useEffect(() => {
    sortTable(2, "desc");
  }, [tableRef.current]);

  return (
    <table
      className="myp-table | text-white border-3 border-collapse overflow-hidden rounded bg-gray-400 shadow-lg"
      ref={tableRef}
    >
      <thead className="text-white">
        <tr className="!bg-power-gray-400">
          <th colSpan={9}>
            <div className="flex w-full flex-col">
              <span className="w-full text-xl font-black">MYPOWER-STATUS</span>
              <span className="w-full text-sm font-medium italic">
                {searchParams.get("departmentName") ?? "<Afdeling/varehus>"}
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
          <th className="cursor-pointer" onClick={() => sortTable(2)}>
            Hitrate
          </th>
          <th className="cursor-pointer italic" onClick={() => sortTable(3)}>
            <div className="flex flex-col">
              <span>"MyPOWER"</span>
              <span className="font-mono text-xs normal-case not-italic text-green-500 shadow-black drop-shadow-md">
                1 point
              </span>
            </div>
          </th>
          <th className="cursor-pointer italic" onClick={() => sortTable(4)}>
            <div className="flex flex-col">
              <span>"IM"</span>
              <span className="font-mono text-xs normal-case not-italic text-yellow-400 shadow-black drop-shadow-md">
                {config.IM_WEIGHT.toLocaleString(config.LOCALE)} point
              </span>
            </div>
          </th>
          <th className="cursor-pointer italic" onClick={() => sortTable(5)}>
            <div className="flex flex-col">
              <span>"Er MYP"</span>
              <span className="font-mono text-xs normal-case not-italic text-green-500 shadow-black drop-shadow-md">
                1 point
              </span>
            </div>
          </th>
          <th className="cursor-pointer italic" onClick={() => sortTable(6)}>
            <div className="flex flex-col">
              <span>Ikke spurgt</span>
              <span className="font-mono text-xs normal-case not-italic text-red-700 shadow-black drop-shadow-md">
                0 point
              </span>
            </div>
          </th>
          <th className="cursor-pointer" onClick={() => sortTable(7)}>
            Total
          </th>
          <th
            className="cursor-pointer !bg-yellow-500 italic"
            onClick={() => sortTable(8)}
          >
            MYP-rabat
          </th>
        </tr>
      </thead>
      <tbody>
        {Array.from(salesmenMYPStats).map((stats) => {
          const hitrate = stats.hitrate();

          return (
            <tr key={stats.salesman}>
              <td className="text-gray-500">{stats.salesman}</td>
              <td className="!font-[600]">{stats.name}</td>
              <td
                className={`text-center !font-[600] ${hitrate >= 0.8 ? "text-green-600" : hitrate >= 0.5 ? "text-yellow-500" : "text-red-600"}`}
                data-sort-value={hitrate}
              >
                {(hitrate * 100).toFixed(1)}%
              </td>
              {[
                MYPStatus.MYPOWER,
                MYPStatus.IM,
                MYPStatus.ALREADY_MYP,
                MYPStatus.NOT_ASKED,
              ].map((status) => (
                <td key={status} className="text-center italic">
                  {stats[status]}
                </td>
              ))}
              <td className="text-right text-gray-500">{stats.totalBilag()}</td>
              <td className="text-right text-gray-700">{stats.mypDiscount}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default MYPDataTable;
