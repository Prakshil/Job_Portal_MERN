import React from "react";
import style from "./Dashboard.module.css";
const Dashboard = () => {
  return (
    <>
      <div className={style.dashboard}>
        <div className={style.sidebar}>1</div>
        <div className={style.content}>2</div>
      </div>
    </>
  );
};

export default Dashboard;
