import { FC, SetStateAction } from "react";
import { useState, useEffect } from "react";
import {
  DatePicker,
  TimePicker,
  Input,
  Switch,
  Form,
  Radio,
  Button,
  Modal,
  Space,
  Badge,
} from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import dayjs from "dayjs";
import { colors, Event } from "./interEnum";
import { v4 as uuidv4 } from "uuid";

interface EditCreateEventProps {
  setEvents: (events: SetStateAction<Event[]>) => void;
  events: Event[];
  eventClicked: Event | null;
  isEditModalOpen: boolean;
  setIsEditModalOpen: (isEditModalOpen: boolean) => void;
  newEvent: boolean;
  setNewEvent: (newEvent: boolean) => void;
}

const EditCreateEvent: FC<EditCreateEventProps> = ({
  setEvents,
  events,
  eventClicked,
  isEditModalOpen,
  setIsEditModalOpen,
  newEvent,
}) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [name, setName] = useState<string>("");
  const [allDay, setAllDay] = useState<boolean>(false);
  const [color, setColor] = useState<colors | null>(null);
  const [eventId, setEventId] = useState<string>("");

  //if existing event set states to eventClicked values//
  useEffect(() => {
    if (eventClicked) {
      setStartDate(eventClicked.start);
      setStartTime(eventClicked.start);
      !eventClicked.end
        ? setEndDate(eventClicked.start)
        : setEndDate(eventClicked.end);
      !eventClicked.end
        ? setEndTime(eventClicked.start)
        : setEndTime(eventClicked.end);
      setName(eventClicked.title);
      setColor(eventClicked.backgroundColor);
      setAllDay(eventClicked.allDay!);
      setEventId(eventClicked.id);
    }
  }, [eventClicked]);

  //if new event set states to null//
  useEffect(() => {
    if (newEvent) {
      setStartDate(null);
      setStartTime(null);
      setEndDate(null);
      setEndTime(null);
      setName("");
      setColor(null);
      setAllDay(false);
      setEventId("");
    }
  }, [newEvent]);

  //handle color change//
  const handleColorChange = (e: colors) => {
    setColor(e);
  };

  //handle submit//
  const handleSubmit = () => {
    if (!startDate || !endDate || !name || !color) return;
    let startDateTime, endDateTime;

    //check if allDay is true transfer dayjs to date//
    if (allDay) {
      startDateTime = dayjs(startDate).startOf("day").toDate();
      endDateTime = dayjs(endDate).endOf("day").toDate();
    } else {
      if (!startTime || !endTime) return;
      startDateTime = dayjs(startDate)
        .set("hour", startTime.getHours())
        .set("minute", startTime.getMinutes())
        .toDate();
      endDateTime = dayjs(endDate)
        .set("hour", endTime.getHours())
        .set("minute", endTime.getMinutes())
        .toDate();
    }

    //check if event start is before end//
    if (dayjs(startDateTime).isAfter(dayjs(endDateTime))) {
      Modal.error({
        title: "Error",
        content: "Start time must be before end time",
      });
      return;
    }

    //create new event object//
    const newEventData = {
      id: newEvent ? uuidv4() : eventId,
      title: name,
      allDay: allDay,
      start: startDateTime,
      end: endDateTime,
      backgroundColor: color,
    };

    //if new event add to events array and return//
    if (newEvent) {
      setEvents([...events, newEventData]);
      localStorage.setItem("events", JSON.stringify([...events, newEvent]));
      setIsEditModalOpen(false);
      return;
    }

    //edit event in events array//
    const newEvents = events.map((event) => {
      if (event.id === eventId) {
        return newEventData;
      }
      return event;
    });
    setEvents(newEvents);

    //set local storage//
    localStorage.setItem("events", JSON.stringify(newEvents));
    setIsEditModalOpen(false);
  };

  //delete confirm modal//
  const showDeleteConfirm = () => {
    Modal.confirm({
      title: "Are you sure delete this task?",
      icon: <ExclamationCircleFilled />,
      content: "Some descriptions",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        handleDeleteEvent();
      },
    });
  };

  //delete event//
  const handleDeleteEvent = () => {
    const newEvents = events.filter((event) => event.id !== eventId);
    setEvents(newEvents);
    localStorage.setItem("events", JSON.stringify(newEvents));
    setIsEditModalOpen(false);
  };

  return (
    <Modal
      title="Event detail"
      open={isEditModalOpen}
      onOk={handleSubmit}
      onCancel={() => setIsEditModalOpen(false)}
      footer={[]}
      destroyOnClose={true}
    >
      <Form
        layout="horizontal"
        labelCol={{ span: 4 }}
        requiredMark={false}
        preserve={false}
        className="create-event-form"
        //if new event set initial values//
        {...(!newEvent && {
          initialValues: {
            name: name,
            allDay: allDay,
            start_date: dayjs(startDate),
            start_time: dayjs(startTime),
            end_date: dayjs(endDate),
            end_time: dayjs(endDate),
            color: eventClicked?.backgroundColor,
          },
        })}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please input event name!" }]}
        >
          <Input onChange={(e) => setName(e.target.value)} />
        </Form.Item>
        <Form.Item label="All day" name="allDay">
          <Switch onChange={(checked) => setAllDay(checked)} checked={allDay} />
        </Form.Item>
        <Form.Item label="Start">
          <Space.Compact className="date-time-wrapper">
            <Form.Item
              name="start_date"
              rules={[{ required: true, message: "Please select start date!" }]}
              noStyle
            >
              <DatePicker
                onChange={(date) => setStartDate(date?.toDate() ?? null)}
                value={startDate ? dayjs(startDate) : undefined}
                className="date-picker"
                inputReadOnly={true}
              />
            </Form.Item>
            {!allDay && (
              <Form.Item
                name="start_time"
                noStyle
                rules={[
                  { required: true, message: "Please select start time!" },
                ]}
              >
                <TimePicker
                  onChange={(time) => setStartTime(time?.toDate() ?? null)}
                  value={startTime ? dayjs(startTime) : undefined}
                  format={"HH:mm"}
                  className="time-picker"
                  inputReadOnly={true}
                />
              </Form.Item>
            )}
          </Space.Compact>
        </Form.Item>
        <Form.Item label="End">
          <Space.Compact className="date-time-wrapper">
            <Form.Item
              name="end_date"
              rules={[{ required: true, message: "Please select end date!" }]}
              noStyle
            >
              <DatePicker
                onChange={(date) => setEndDate(date?.toDate() ?? null)}
                value={endDate ? dayjs(endDate) : undefined}
                className="date-picker"
                inputReadOnly={true}
                //disable dates before start date//
                disabledDate={(current) =>
                  current && current < dayjs(startDate).startOf("day")
                }
              />
            </Form.Item>
            {!allDay && (
              <Form.Item
                name="end_time"
                noStyle
                rules={[{ required: true, message: "Please select end time!" }]}
              >
                <TimePicker
                  onChange={(time) => setEndTime(time?.toDate() ?? null)}
                  value={endTime ? dayjs(endTime) : undefined}
                  format={"HH:mm"}
                  className="time-picker"
                  inputReadOnly={true}
                />
              </Form.Item>
            )}
          </Space.Compact>
        </Form.Item>
        <Form.Item
          name="color"
          label="Color"
          rules={[{ required: true, message: "Please pick an item!" }]}
        >
          <Radio.Group
            onChange={(e) => handleColorChange(e.target.value)}
            value={color}
          >
            <Radio.Button value={colors.blue}>
              <Badge color="blue" text="Blue" />
            </Radio.Button>
            <Radio.Button value={colors.red}>
              <Badge color="red" text="Red" />
            </Radio.Button>
            <Radio.Button value={colors.green}>
              <Badge color="green" text="Green" />
            </Radio.Button>
            <Radio.Button value={colors.yellow}>
              <Badge color="yellow" text="Yellow" />
            </Radio.Button>
          </Radio.Group>
        </Form.Item>
        {!newEvent ? (
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              onClick={handleSubmit}
              className="submit-btn"
            >
              Save changes
            </Button>
            <Button
              type="primary"
              danger
              onClick={showDeleteConfirm}
              className="submit-btn"
            >
              Delete event
            </Button>
          </Form.Item>
        ) : (
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              onClick={handleSubmit}
              className="submit-btn"
            >
              Create event
            </Button>
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default EditCreateEvent;
