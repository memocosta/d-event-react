import React, { useEffect, useState } from "react";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import moment from "moment";
import { Checkbox, Form } from "semantic-ui-react";

const DateTimeShared = ({
  title,
  subTitle,
  data,
  setTimeDate,
  ongoing,
  status,
  value,
  from,
  to
}) => {
  const [disabled, setDisabled] = useState(false);
  const [startDate, setStartDate] = useState(moment().format());
  const [startTime, setStartTime] = useState(moment().format());
  const [endDate, setEndDate] = useState(moment().format());
  const [endTime, setEndTime] = useState(moment().format());

  useEffect(() => {
    let isMounted = true;
    if (!isMounted) return;
    setStartDate(from);
        setEndDate(to);
        setStartTime(from);
        setEndTime(to);
    if (data) {
      if (data.startDate !== "" && data.endDate !== "") {
        

      }

      if (data.ongoing) {
        setDisabled(true);
      } else {
        setDisabled(false);
      }
    }

    return () => {
      isMounted = false;
    };
  }, [data]);

  const handleToggle = (e, { checked }) => {
    if (checked) {
      ongoing(checked);
      setDisabled((prev) => !prev);
    } else {
      ongoing(checked);
      setDisabled((prev) => !prev);
    }
  };
  const handleOnChangeDate = (value, type) => {
    switch (type) {
      case "startDate":
        const format = moment(value).format("YYYY-MM-DD");
        const timeFormat = moment(startTime).format("HH:mm");
        const date = moment(format + " " + timeFormat + ":00");
        setStartDate(date.format());
        setTimeDate({ date: date.format(), type: "start" });
        return;
      case "endDate":
        const dateFormat = moment(value).format("YYYY-MM-DD");
        const endTimeDateFormat = moment(endTime).format("HH:mm");
        const endDateD = moment(dateFormat + " " + endTimeDateFormat + ":00");
        setEndDate(endDateD.format());
        setTimeDate({ date: endDateD.format(), type: "end" });
        return;
      case "startTime":
        const startDateFormat = moment(startDate).format("YYYY-MM-DD");
        const startTimeFormat = moment(value).format("HH:mm");
        const startTimeData = moment(
          startDateFormat + " " + startTimeFormat + ":00"
        );
        setStartTime(startTimeData.format());
        setTimeDate({ date: startTimeData.format(), type: "start" });
        return;
      case "endTime":
        const endDateFormat = moment(endDate).format("YYYY-MM-DD");
        const endTimeFormat = moment(value).format("HH:mm");
        const endTimeData = moment(endDateFormat + " " + endTimeFormat + ":00");
        setEndTime(endTimeData.format());
        setTimeDate({ date: endTimeData.format(), type: "end" });

        return;
      default:
        break;
    }
  };
  return (
    <>
      <Form.Group>
        <Form.Field width="5">
          <div style={{ marginTop: "10px" }}>
            <p style={{ color: "#5abdbf", fontWeight: "bold" }}>{title}</p>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <p style={{ color: "#c5c7de" }}>{subTitle}</p>
              <Checkbox
                id="validityToggle"
                checked={value}
                toggle
                onChange={handleToggle}
              />
            </div>
          </div>
        </Form.Field>
      </Form.Group>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Form.Group widths="equal">
          <Form.Field>
            <KeyboardDatePicker
              clearable
              format="MM/dd/yyyy"
              label="Start Date"
              placeholder="MM/DD/YYYY"
              minDate={new Date()}
              id="date-picker-inline"
              disabled={value}
              value={startDate}
              onChange={(date) => handleOnChangeDate(date, "startDate")}
            />
          </Form.Field>
          <Form.Field>
            <KeyboardTimePicker
              clearable
              placeholder="hh:mm"
              label="Start Time"
              id="startTime"
              disabled={value}
              value={startTime}
              onChange={(date) => handleOnChangeDate(date, "startTime")}
            />
          </Form.Field>
        </Form.Group>
        <Form.Group widths="equal">
          <Form.Field>
            <KeyboardDatePicker
              label="End Date"
              disabled={value}
              placeholder="MM/DD/YYYY"
              minDate={new Date()}
              format="MM/dd/yyyy"
              id="date-picker-inline"
              value={endDate}
              onChange={(date) => handleOnChangeDate(date, "endDate")}
            />
          </Form.Field>
          <Form.Field>
            <KeyboardTimePicker
              clearable
              placeholder="hh:mm"
              label="End Time"
              id="startTime"
              disabled={value}
              value={endTime}
              onChange={(date) => handleOnChangeDate(date, "endTime")}
            />
          </Form.Field>
        </Form.Group>
      </MuiPickersUtilsProvider>
    </>
  );
};

export default DateTimeShared;
