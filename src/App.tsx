import { FC } from "react";
import Calendar from "./components/Calendar";
import "antd/dist/reset.css";

import "./App.css";

const App: FC = () => {
  return (
    <div>
      <Calendar />
    </div>
  );
};

export default App;
