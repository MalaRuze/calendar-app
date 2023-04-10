import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayjs from "dayjs";
import updateLocale from "dayjs/plugin/updateLocale";
import MoreEvents from "./MoreEvents";
import EditCreateEvent from "./EditCreateEvent";
import { colors, Event } from "./interEnum";

//set week start on Monday//
dayjs.extend(updateLocale);
dayjs.updateLocale("en", {
  weekStart: 1,
});

const Calendar = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [eventClicked, setEventClicked] = useState<Event | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isMoreModalOpen, setIsMoreModalOpen] = useState<boolean>(false);
  const [moreEvents, setMoreEvents] = useState<Event[]>([]);
  const [moreDate, setMoreDate] = useState<Date | null>(null);
  const [width, setWidth] = useState(window.innerWidth);
  const [newEvent, setNewEvent] = useState<boolean>(false);

  //load events from local storage//
  useEffect(() => {
    const storedEvents = localStorage.getItem("events");
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents));
    }
  }, []);

  //handle window resize//
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  //handle event click//
  const handleEventClick = (event: any) => {
    setNewEvent(false);
    setEventClicked({
      id: event.id,
      allDay: event.allDay,
      title: event.title,
      start: event.start!,
      end: event.end!,
      backgroundColor: event.backgroundColor as colors,
    });
    setIsEditModalOpen(true);
    setIsMoreModalOpen(false);
    setMoreEvents([]);
  };

  //handle more events click//
  const handleMoreClick = (info: any) => {
    const moreEvents = info.allSegs.map((seg: any) => seg.event);
    const moreDate = info.date;
    setMoreDate(moreDate);
    setMoreEvents(moreEvents);
    setIsMoreModalOpen(true);
  };

  //handle add event click//
  const handleAddEventCLick = () => {
    setNewEvent(true);
    setIsEditModalOpen(true);
  };

  return (
    <div className="calendar-wrapper">
      <EditCreateEvent
        events={events}
        setEvents={setEvents}
        eventClicked={eventClicked}
        isEditModalOpen={isEditModalOpen}
        setIsEditModalOpen={setIsEditModalOpen}
        newEvent={newEvent}
        setNewEvent={setNewEvent}
      />
      <MoreEvents
        isMoreModalOpen={isMoreModalOpen}
        setIsMoreModalOpen={setIsMoreModalOpen}
        moreEvents={moreEvents}
        setMoreEvents={setMoreEvents}
        moreDate={moreDate}
        handleEventClick={handleEventClick}
      />
      <FullCalendar
        plugins={[timeGridPlugin, dayGridPlugin]}
        initialView="dayGridMonth"
        firstDay={1}
        height="100%"
        events={events}
        dayMaxEventRows={3}
        eventMaxStack={1}
        displayEventTime={false}
        //add custom button for adding event//
        customButtons={{
          myCustomButton: {
            text: "add event",
            click: () => {
              handleAddEventCLick();
            },
          },
        }}
        //check if screen is less then 600px and set header and footer accordingly//
        headerToolbar={
          width < 625
            ? {
                left: "title",
                center: "",
                right: "prev,today,next",
              }
            : {
                left: "title",
                center: "",
                right:
                  "prev,today,next dayGridMonth,timeGridWeek myCustomButton",
              }
        }
        footerToolbar={
          width < 625 && {
            left: "dayGridMonth,timeGridWeek",
            right: "myCustomButton",
          }
        }
        //set time format for header and slot//
        eventTimeFormat={{
          hour: "numeric",
          minute: "2-digit",
          meridiem: false,
        }}
        dayHeaderFormat={{ weekday: "short" }}
        slotLabelFormat={{
          hour: "numeric",
          minute: "2-digit",
          meridiem: false,
          hour12: false,
        }}
        //handle event and more link click//
        eventClick={(info) => {
          handleEventClick(info.event);
        }}
        moreLinkClick={(arg) => {
          handleMoreClick(arg);
        }}
      />
    </div>
  );
};

export default Calendar;
