import DepartmentNameInput from "@/components/Configuration/DepartmentNameInput";
import SalesmenInput from "@/components/Configuration/SalesmenInput";

const Configuration = () => {
  return (
    <div className="max-w-125 space-y-3">
      <DepartmentNameInput />
      <SalesmenInput />
    </div>
  );
};

export default Configuration;
