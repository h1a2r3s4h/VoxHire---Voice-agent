import React from "react";
import WelcomeContainer from "./_components/WelcomeContainer";
import CreateOptions from "./_components/CreateOptions";

import LatestInterviewsList from "./_components/LatestInterviewsList";

const Dashboard = () => {
  return (
    <div>
      {/* <WelcomeContainer /> */}
      <h2 className="my-3 font-bold text-3xl bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">Dashboard</h2>
      <CreateOptions/>

      <LatestInterviewsList/>
    </div>
  );
};

export default Dashboard;
