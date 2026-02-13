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
};

const timingOptions = [
  "04:30 AM – 12:30 PM",
  "12:30 PM – 08:30 PM",
  "08:30 AM – 04:30 PM",
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

const dateKey = (d) => d.toISOString().split("T")[0];

/* ================= APP ================= */

function App() {
  const [employeeName, setEmployeeName] = useState("");
  const [baseShift, setBaseShift] = useState("Shift 1");
  const [rotationMonth, setRotationMonth] = useState("2026-02");

  const [employees, setEmployees] = useState(() => {
    const saved = localStorage.getItem("roster_employees");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("roster_employees", JSON.stringify(employees));
  }, [employees]);

  const addEmployee = () => {
    if (!employeeName.trim()) return;
    setEmployees([
      ...employees,
      {
        id: Date.now(),
        name: employeeName,
        shift: baseShift,
        overrides: {},
      },
    ]);
    setEmployeeName("");
  };

  const deleteAssignment = (id) => {
    setEmployees(employees.filter((e) => e.id !== id));
  };

  const updateOverride = (empId, key, value) => {
    setEmployees(
      employees.map((e) =>
        e.id === empId
          ? {
              ...e,
              overrides: {
                ...e.overrides,
                [key]: value || undefined,
              },
            }
          : e
      )
    );
  };

  const [year, month] = rotationMonth.split("-").map(Number);
  const start = getSecondSunday(year, month - 1);
  const nextMonth = new Date(year, month, 1);
  const end = new Date(getSecondSunday(nextMonth.getFullYear(), nextMonth.getMonth()));
  end.setDate(end.getDate() - 1);
  const dates = generateDatesBetween(start, end);

  return (
    <div className="app">
      <header className="header">TEAM PRODUCTION SUPPORT ROSTER</header>

      <section className="shift-details">
        <h3>Shift Details</h3>
        {Object.entries(shiftDetails).map(([k, v]) => (
          <div key={k}>
            <strong>{k}</strong> — {v.label} (Off: {v.off.join(" & ")})
          </div>
        ))}
      </section>

      <section className="controls">
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
        <button onClick={addEmployee}>Add</button>
        <input type="month" value={rotationMonth} onChange={(e) => setRotationMonth(e.target.value)} />
      </section>

      {employees.map((emp) => (
        <section className="employee-card" key={emp.id}>
          <div className="employee-header">
            <h3>{emp.name}</h3>
            <button className="delete-btn" onClick={() => deleteAssignment(emp.id)}>
              Delete Assignment
            </button>
          </div>

          <p className="period">
            Rotation Period: {start.toDateString()} → {end.toDateString()}
          </p>

          <div className="calendar">
            {dates.map((d) => {
              const weekday = d.toLocaleDateString("en-US", { weekday: "long" });
              const key = dateKey(d);
              const override = emp.overrides[key];
              const base = shiftDetails[emp.shift].schedule[weekday];
              const text = override || base;

              return (
                <div
                  key={key}
                  className={`day ${text === "Week_Off" ? "off" : ""}`}
                >
                  <strong>{d.toDateString()}</strong>
                  <div>{text}</div>

                  <select
                    className="day-select"
                    value={override || ""}
                    onChange={(e) =>
                      updateOverride(emp.id, key, e.target.value)
                    }
                  >
                    <option value="">Default</option>
                    <option value="Week_Off">Leave</option>
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
        </section>
      ))}
    </div>
  );
}

export default App;
