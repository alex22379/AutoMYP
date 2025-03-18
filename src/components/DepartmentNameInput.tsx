import { useState } from "react";

function departmentNameInput() {
  const [departmentName, setDepartmentName] = useState("");

  return (
    <section>
      <input
        type="text"
        className="input"
        placeholder="Afdeling/varehus"
        value={departmentName}
        onChange={(e) => setDepartmentName(e.target.value)}
      />
    </section>
  );
}

export default departmentNameInput;
