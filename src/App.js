import React, { useState, useEffect } from "react";
import "./App.css";

/* ================= SHIFTS ================= */

const shiftDetails = {
  "Shift 1": {
    label: "04:30 AM – 12:30 PM",
    off: ["Monday", "Tuesday"],
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
    off: ["Thursday", "Friday"],
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
    off: ["Saturday", "Sunday"],
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
    off: ["Saturday", "Sunday"],
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
    off: ["Thursday", "Friday"],
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
  "Shift 6": {
    label: "06:30 PM – 02:30 AM",
    off: ["Saturday", "Sunday"],
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

const overrideOptions = [
  "",
  "LEAVE",
  "04:30 AM – 12:30 PM",
  "12:30 PM – 08:30 PM",
  "08:30 AM – 04:30 PM",
  "08:30 PM – 04:30 AM",
  "06:30 PM – 02:30 AM",
];

/* ================= HELPERS ================= */

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

const formatKey = (date) => date.toISOString().split("T")[0];

const getDatesBetween = (start, end) => {
  const dates = [];
  const cur = new Date(start);
  while (cur <= end) {
    dates.push(new Date(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return dates;
};

/* ================= APP ================= */

export default function App() {
  const [employees, setEmployees] = useState(
    JSON.parse(localStorage.getItem("roster")) || []
  );
  const [name, setName] = useState("");
  const [shift, setShift] = useState("Shift 1");
  const [month, setMonth] = useState("2026-02");

  useEffect(() => {
    localStorage.setItem("roster", JSON.stringify(employees));
  }, [employees]);

  const addEmployee = () => {
    if (!name.trim()) return;
    setEmployees([
      ...employees,
      { name, shift, overrides: {} },
    ]);
    setName("");
  };

  const removeEmployee = (index) => {
    const copy = [...employees];
    copy.splice(index, 1);
    setEmployees(copy);
  };

  const updateOverride = (eIdx, key, value) => {
    const copy = [...employees];
    if (!value) delete copy[eIdx].overrides[key];
    else copy[eIdx].overrides[key] = value;
    setEmployees(copy);
  };

  const [year, m] = month.split("-").map(Number);
  const start = getSecondSunday(year, m - 1);
  const nextStart = getSecondSunday(
    new Date(year, m, 1).getFullYear(),
    new Date(year, m, 1).getMonth()
  );
  const end = new Date(nextStart);
  end.setDate(end.getDate() - 1);
  const days = getDatesBetween(start, end);

  return (
    <div className="app">
      <div className="app-header">
        TEAM PRODUCTION SUPPORT ROSTER
      </div>

      <div className="shift-details">
        <h3>Shift Details</h3>
        {Object.entries(shiftDetails).map(([k, v]) => (
          <div key={k} className="shift-line">
            <strong>{k}</strong> — {v.label} (Off: {v.off.join(" & ")})
          </div>
        ))}
      </div>

      <div className="controls">
        <input
          placeholder="Employee name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <select value={shift} onChange={(e) => setShift(e.target.value)}>
          {Object.keys(shiftDetails).map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <button onClick={addEmployee}>Add</button>
        <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} />
      </div>

      {employees.map((emp, eIdx) => (
        <div className="employee-card" key={eIdx}>
          <div className="employee-header">
            <h3>{emp.name}</h3>
            <button
              className="delete-assignment"
              onClick={() => removeEmployee(eIdx)}
            >
              Delete Assignment
            </button>
          </div>

          <p>
            <strong>Rotation Period:</strong>{" "}
            {start.toDateString()} → {end.toDateString()}
          </p>

          <div className="rotation-grid">
            {days.map((d) => {
              const weekday = d.toLocaleDateString("en-US", { weekday: "long" });
              const key = formatKey(d);
              const override = emp.overrides[key];
              const base = shiftDetails[emp.shift].schedule[weekday];
              const text = override || base;

              return (
                <div
                  key={key}
                  className={`day-card ${
                    text === "Week_Off" || text === "LEAVE"
                      ? "day-off"
                      : "day-working"
                  }`}
                >
                  <strong>{d.toDateString()}</strong>
                  <div>{text}</div>
                  <div className="day-select">
                    <select
                      value={override || ""}
                      onChange={(e) =>
                        updateOverride(eIdx, key, e.target.value)
                      }
                    >
                      <option value="">Default</option>
                      {overrideOptions
                        .filter(Boolean)
                        .map((o) => (
                          <option key={o}>{o}</option>
                        ))}
                    </select>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
