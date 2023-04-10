import { FC } from "react";
import { Modal, List, Avatar } from "antd";
import { Event } from "./interEnum";

interface moreEventsProps {
  isMoreModalOpen: boolean;
  setIsMoreModalOpen: (isMoreModalOpen: boolean) => void;
  moreEvents: Event[];
  setMoreEvents: (moreEvents: Event[]) => void;
  moreDate: Date | null;
  handleEventClick: (event: any) => void;
}

const MoreEvents: FC<moreEventsProps> = ({
  isMoreModalOpen,
  setIsMoreModalOpen,
  moreEvents,
  setMoreEvents,
  moreDate,
  handleEventClick,
}) => {
  return (
    <Modal
      title={moreDate?.toDateString()}
      open={isMoreModalOpen}
      onCancel={() => {
        setIsMoreModalOpen(false);
        setMoreEvents([]);
      }}
      footer={[]}
      destroyOnClose={true}
    >
      <List itemLayout="horizontal">
        {moreEvents.map((event) => {
          return (
            <List.Item
              key={event.id}
              actions={[<a onClick={() => handleEventClick(event)}>Edit</a>]}
            >
              <List.Item.Meta
                avatar={
                  <Avatar style={{ background: event.backgroundColor }} />
                }
                title={event.title}
                description={
                  event.allDay
                    ? "All day"
                    : event.start.toLocaleTimeString("it-IT", {
                        hour: "2-digit",
                        minute: "2-digit",
                      }) +
                      " - " +
                      event.end.toLocaleTimeString("it-IT", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                }
              />
            </List.Item>
          );
        })}
      </List>
    </Modal>
  );
};

export default MoreEvents;
