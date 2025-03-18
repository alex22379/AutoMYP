import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import { FaTimes } from "react-icons/fa";

function salesmenInput() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [salesmen, setSalesmen] = useState<{ [key: string]: string }>(
    JSON.parse(searchParams.get("salesmen") || "{}"),
  );

  useEffect(() => {
    if (Object.entries(salesmen).length > 0)
      searchParams.set("salesmen", JSON.stringify(salesmen));
    else searchParams.delete("salesmen");
    setSearchParams(searchParams, { replace: true });
  }, [salesmen]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const code = formData.get("code") as string;
    setSalesmen((prevSalesmen) => ({
      ...prevSalesmen,
      [name]: code.toUpperCase(),
    }));
    e.currentTarget.reset();
  }

  return (
    <div className="space-y-3">
      <form onSubmit={(e) => handleSubmit(e)} className="space-y-2">
        <div className="flex w-full gap-2">
          <input
            type="text"
            className="input flex-1"
            name="name"
            required
            placeholder="Navn ifølge Elguide"
          />
          <input
            type="text"
            className="input flex-1"
            name="code"
            required
            placeholder="Sælgerkode"
          />
        </div>
        <button type="submit" className="button w-full">
          Tilføj sælger
        </button>
      </form>
      <table className="salesmen-table | border-3 w-full border-collapse overflow-hidden rounded bg-gray-400">
        <tbody>
          {Object.entries(salesmen).map(([name, code]) => (
            <tr className="flex font-medium" key={code}>
              <td className="border-1 flex-1 border-dashed border-gray-400 px-2">
                {name}
              </td>
              <td className="border-1 flex-1 border-dashed border-gray-400 px-2">
                {code}
              </td>
              <td className="border-1 grid place-items-center border-dashed border-gray-400">
                <button
                  className="px-0.75 aspect-square cursor-pointer text-red-400 active:scale-90"
                  onClick={() =>
                    setSalesmen((prevSalesmen) => {
                      const { [name]: _, ...newSalesmen } = prevSalesmen;
                      return newSalesmen;
                    })
                  }
                >
                  <FaTimes />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default salesmenInput;
