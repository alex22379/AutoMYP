import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

function departmentNameInput() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [departmentName, setDepartmentName] = useState(
    searchParams.get("departmentName") || undefined,
  );

  useEffect(() => {
    if (departmentName) {
      searchParams.set("departmentName", departmentName!);
      setSearchParams(searchParams, { replace: true });
    }
  }, [departmentName]);

  return (
    <div>
      <input
        type="text"
        className="input w-full"
        placeholder="Afdeling/varehus"
        value={departmentName}
        onChange={(e) => setDepartmentName(e.target.value)}
      />
    </div>
  );
}

export default departmentNameInput;
