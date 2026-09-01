import React from "react";
import WelcomeContainer from "./_components/WelcomeContainer";
import CreateOptions from "./_components/CreateOptions";
import LatestInterviewsList from "./_components/LatestInterviewsList";

const Dashboard = () => {
  return (
    <div className="p-6 md:p-8 space-y-8 bg-black text-zinc-100 min-h-screen">
      <WelcomeContainer />

      <div>
        <h2 className="text-xl font-bold text-white tracking-tight mb-4">
          Quick Actions
        </h2>
        <CreateOptions />
      </div>

      <LatestInterviewsList />
    </div>
  );
};

export default Dashboard;
