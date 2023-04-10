export enum colors {
  red = "#e0282e",
  blue = "#5a54f9",
  green = "#00b96b",
  yellow = "#f2bd27",
}

export interface Event {
  id: string;
  title: string;
  allDay?: boolean;
  start: Date;
  end: Date;
  backgroundColor: colors;
}
