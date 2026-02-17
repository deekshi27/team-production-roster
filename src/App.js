import React, { useEffect, useState } from "react";
import "./App.css";

/* ================= SHIFTS ================= */

const shiftDetails = {
  "Shift 1": {
    label: "04:30 AM – 12:30 PM",
    Week_Off: "Monday & Tuesday",
    schedule: {
      Monday: "Week_Off",
      Tuesday: "Week_Off",
      Wednesday: "04:30 AM – 12:30 PM",
      Thursday: "04:30 AM – 12:30 PM",
      Friday: "04:30 AM – 12:30 PM",
      Saturday: "04:30 AM – 12:30 PM",
      Sunday: "04:30 AM – 12:30 PM",
    },
  },
  "Shift 2": {
    label: "12:30 PM – 08:30 PM",
    Week_Off: "Thursday & Friday",
    schedule: {
      Monday: "12:30 PM – 08:30 PM",
      Tuesday: "12:30 PM – 08:30 PM",
      Wednesday: "12:30 PM – 08:30 PM",
      Thursday: "Week_Off",
      Friday: "Week_Off",
      Saturday: "12:30 PM – 08:30 PM",
      Sunday: "12:30 PM – 08:30 PM",
    },
  },
  "Shift 3": {
    label:
      "Mon–Tue: 04:30 AM – 12:30 PM | Wed–Fri: 12:30 PM – 08:30 PM",
    Week_Off: "Saturday & Sunday",
    schedule: {
      Monday: "04:30 AM – 12:30 PM",
      Tuesday: "04:30 AM – 12:30 PM",
      Wednesday: "12:30 PM – 08:30 PM",
      Thursday: "12:30 PM – 08:30 PM",
      Friday: "12:30 PM – 08:30 PM",
      Saturday: "Week_Off",
      Sunday: "Week_Off",
    },
  },
  "Shift 4": {
    label: "08:30 AM – 04:30 PM",
    Week_Off: "Saturday & Sunday",
    schedule: {
      Monday: "08:30 AM – 04:30 PM",
      Tuesday: "08:30 AM – 04:30 PM",
      Wednesday: "08:30 AM – 04:30 PM",
      Thursday: "08:30 AM – 04:30 PM",
      Friday: "08:30 AM – 04:30 PM",
      Saturday: "Week_Off",
      Sunday: "Week_Off",
    },
  },
  "Shift 5": {
    label: "08:30 PM – 04:30 AM",
    Week_Off: "Thursday & Friday",
    schedule: {
      Monday: "08:30 PM – 04:30 AM",
      Tuesday: "08:30 PM – 04:30 AM",
      Wednesday: "08:30 PM – 04:30 AM",
      Thursday: "Week_Off",
      Friday: "Week_Off",
      Saturday: "08:30 PM – 04:30 AM",
      Sunday: "08:30 PM – 04:30 AM",
    },
  },

  /* ✅ NEW SHIFT 6 */
  "Shift 6": {
    label: "06:30 PM – 02:30 AM",
    Week_Off: "Saturday & Sunday",
    schedule: {
      Monday: "06:30 PM – 02:30 AM",
      Tuesday: "06:30 PM – 02:30 AM",
      Wednesday: "06:30 PM – 02:30 AM",
      Thursday: "06:30 PM – 02:30 AM",
      Friday: "06:30 PM – 02:30 AM",
      Saturday: "Week_Off",
      Sunday: "Week_Off",
    },
  },
};

const timingOptions = [
  "04:30 AM – 12:30 PM",
  "12:30 PM – 08:30 PM",
  "08:30 AM – 04:30 PM",
  "06:30 PM – 02:30 AM", // ✅ Shift 6 timing
  "08:30 PM – 04:30 AM",
];

/* ================= DATE HELPERS ================= */

const getSecondSunday = (year, month) => {
  let count = 0;
  for (let d = 1; d <= 31; d++) {
    const date = new Date(year, month, d);
    if (date.getMonth() !== month) break;
    if (date.getDay() === 0) {
      count++;
      if (count === 2) return date;
    }
  }
};

const generateDatesBetween = (start, end) => {
  const dates = [];
  let current = new Date(start);
  while (current <= end) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
};

const formatKey = (date) => date.toISOString().split("T")[0];

/* ================= APP ================= */

function App() {
  const [employeeName, setEmployeeName] = useState("");
  const [baseShift, setBaseShift] = useState("Shift 1");
  const [rotationMonth, setRotationMonth] = useState("2026-02");
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("roster-data");
    if (saved) setEmployees(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("roster-data", JSON.stringify(employees));
  }, [employees]);

  const addEmployee = () => {
    if (!employeeName.trim()) return;
    setEmployees([
      ...employees,
      { name: employeeName, shift: baseShift, overrides: {} },
    ]);
    setEmployeeName("");
  };

  const removeEmployee = (index) => {
    const updated = [...employees];
    updated.splice(index, 1);
    setEmployees(updated);
  };

  const updateOverride = (empIndex, dateKey, value) => {
    const updated = [...employees];
    if (!value) delete updated[empIndex].overrides[dateKey];
    else updated[empIndex].overrides[dateKey] = value;
    setEmployees(updated);
  };

  const [year, month] = rotationMonth.split("-").map(Number);
  const cycleStart = getSecondSunday(year, month - 1);
  const nextMonth = new Date(year, month, 1);
  const nextCycleStart = getSecondSunday(
    nextMonth.getFullYear(),
    nextMonth.getMonth()
  );
  const cycleEnd = new Date(nextCycleStart);
  cycleEnd.setDate(cycleEnd.getDate() - 1);

  const rotationDates = generateDatesBetween(cycleStart, cycleEnd);

  return (
    <div className="app">
      <header className="header">TEAM PRODUCTION SUPPORT ROSTER</header>

      <div className="shift-box">
        <h3>Shift Details</h3>
        {Object.entries(shiftDetails).map(([k, v]) => (
          <div key={k}>
            <strong>{k}</strong> — {v.label} (Off: {v.Week_Off})
          </div>
        ))}
      </div>

      <div className="controls">
        <input
          placeholder="Employee name"
          value={employeeName}
          onChange={(e) => setEmployeeName(e.target.value)}
        />
        <select value={baseShift} onChange={(e) => setBaseShift(e.target.value)}>
          {Object.keys(shiftDetails).map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <button className="add-btn" onClick={addEmployee}>
          Add
        </button>
        <input
          type="month"
          value={rotationMonth}
          onChange={(e) => setRotationMonth(e.target.value)}
        />
      </div>

      {employees.map((emp, empIndex) => (
        <div key={empIndex} className="employee-card">
          <div className="emp-header">
            <h3>{emp.name}</h3>
            <button
              className="delete-btn"
              onClick={() => removeEmployee(empIndex)}
            >
              Delete Assignment
            </button>
          </div>

          <p className="rotation">
            Rotation Period: {cycleStart.toDateString()} →{" "}
            {cycleEnd.toDateString()}
          </p>

          <div className="calendar">
            {rotationDates.map((d) => {
              const weekday = d.toLocaleDateString("en-US", {
                weekday: "long",
              });
              const key = formatKey(d);
              const override = emp.overrides[key];
              const base =
                shiftDetails[emp.shift].schedule[weekday];

              const display = override || base;

              return (
                <div
                  key={key}
                  className={`day ${
                    display === "Week_Off" ? "off" : "work"
                  }`}
                >
                  <strong>{d.toDateString()}</strong>
                  <div>{display}</div>
                  <select
                    value={override || ""}
                    onChange={(e) =>
                      updateOverride(empIndex, key, e.target.value)
                    }
                  >
                    <option value="">Default</option>
                    <option value="LEAVE">Leave</option>
                    {timingOptions.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;
