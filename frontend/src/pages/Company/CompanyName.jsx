import { useEffect, useState } from "react";

export default function CompanyName() {
const [companyName, setCompanyName] = useState("");
useEffect(() => {
  const data = JSON.parse(localStorage.getItem("company"));
  if (data && data.companyName) {
    setCompanyName(data.companyName);
  }
}, []);

  return (
    <span className="font-semibold text-gray-800 text-sm">
      {companyName || "Company"}
    </span>
  );
}