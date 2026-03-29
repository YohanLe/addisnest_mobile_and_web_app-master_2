import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DatePickerInput = ({ onDateChange, initialDate, placeholder = "Select date" }) => {
  const [startDate, setStartDate] = useState(initialDate || new Date());

  const handleChange = (date) => {
    setStartDate(date);
    if (onDateChange) {
      onDateChange(date);
    }
  };

  return (
    <div className="date-picker-container">
      <DatePicker
        selected={startDate}
        onChange={handleChange}
        dateFormat="MM/dd/yyyy"
        className="form-control"
        placeholderText={placeholder}
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
      />
      <span className="calendar-icon">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M6 8.25H4.5V9.75H6V8.25ZM9.75 8.25H8.25V9.75H9.75V8.25ZM13.5 8.25H12V9.75H13.5V8.25ZM15.75 1.5H15V0H13.5V1.5H4.5V0H3V1.5H2.25C1.425 1.5 0.75 2.175 0.75 3V16.5C0.75 17.325 1.425 18 2.25 18H15.75C16.575 18 17.25 17.325 17.25 16.5V3C17.25 2.175 16.575 1.5 15.75 1.5ZM15.75 16.5H2.25V6H15.75V16.5ZM15.75 4.5H2.25V3H15.75V4.5ZM6 12H4.5V13.5H6V12ZM9.75 12H8.25V13.5H9.75V12ZM13.5 12H12V13.5H13.5V12Z"
            fill="#777E90"
          />
        </svg>
      </span>
    </div>
  );
};

export default DatePickerInput;
