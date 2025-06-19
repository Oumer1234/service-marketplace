import * as React from "react";

interface TimePickerInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  className?: string;
}

export const TimePickerInput: React.FC<TimePickerInputProps> = ({
  value,
  onChange,
  label,
  className,
}) => {
  const [hour, setHour] = React.useState("");
  const [minute, setMinute] = React.useState("");
  const [ampm, setAmpm] = React.useState("AM");

  React.useEffect(() => {
    if (value) {
      const [h, m] = value.split(":");
      const hourNum = parseInt(h || "0", 10);
      const ampmVal = hourNum >= 12 ? "PM" : "AM";
      let hour12 = hourNum % 12;
      if (hour12 === 0) hour12 = 12;
      setHour(hour12.toString().padStart(2, "0"));
      setMinute(m || "00");
      setAmpm(ampmVal);
    }
  }, [value]);

  const handleHourChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newHour = e.target.value;
    setHour(newHour);
    let hourNum = parseInt(newHour, 10);
    if (ampm === "PM" && hourNum !== 12) hourNum += 12;
    if (ampm === "AM" && hourNum === 12) hourNum = 0;
    onChange(`${hourNum.toString().padStart(2, "0")}:${minute || "00"}`);
  };
  const handleMinuteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMinute(e.target.value);
    let hourNum = parseInt(hour, 10);
    if (ampm === "PM" && hourNum !== 12) hourNum += 12;
    if (ampm === "AM" && hourNum === 12) hourNum = 0;
    onChange(`${hourNum.toString().padStart(2, "0")}:${e.target.value}`);
  };
  const handleAmpmChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newAmpm = e.target.value;
    setAmpm(newAmpm);
    let hourNum = parseInt(hour, 10);
    if (newAmpm === "PM" && hourNum !== 12) hourNum += 12;
    if (newAmpm === "AM" && hourNum === 12) hourNum = 0;
    onChange(`${hourNum.toString().padStart(2, "0")}:${minute || "00"}`);
  };

  return (
    <div className={className}>
      {label && <label className="block mb-1 font-medium">{label}</label>}
      <div className="flex gap-2 items-center">
        <select
          className="border rounded px-2 py-1 focus:ring-2 focus:ring-primary"
          value={hour}
          onChange={handleHourChange}
        >
          <option value="">HH</option>
          {[...Array(12)].map((_, i) => {
            const val = (i + 1).toString().padStart(2, "0");
            return (
              <option key={val} value={val}>
                {val}
              </option>
            );
          })}
        </select>
        <span>:</span>
        <select
          className="border rounded px-2 py-1 focus:ring-2 focus:ring-primary"
          value={minute}
          onChange={handleMinuteChange}
        >
          <option value="">MM</option>
          {[0, 15, 30, 45].map((m) => (
            <option key={m} value={m.toString().padStart(2, "0")}>
              {m.toString().padStart(2, "0")}
            </option>
          ))}
        </select>
        <select
          className="border rounded px-2 py-1 focus:ring-2 focus:ring-primary"
          value={ampm}
          onChange={handleAmpmChange}
        >
          <option value="AM">AM</option>
          <option value="PM">PM</option>
        </select>
      </div>
    </div>
  );
};
