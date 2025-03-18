import { useState } from "react";

import { FaTimes } from "react-icons/fa";

function salesmenInput() {
  const [salesmen, setSalesmen] = useState<{ [key: string]: string }>({
    Alexander: "826583",
    Jonas: "826584",
  });

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

  let i = 0;

  return (
    <section className="max-w-120 space-y-2">
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
      <table className="salesmen-table | bg-power-400 border-3 w-full border-collapse overflow-hidden rounded">
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
    </section>
  );
}

export default salesmenInput;
