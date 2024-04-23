import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import { useEffect, useState } from "react";
import DashBoardService from "../services/dashboard-service";

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [healthObjectivePercentages, setHealthObjectivePercentages] = useState(
    []
  );
  const fetchFirstDashBoardData = async () => {
    setIsLoading(true);
    const res =
      await DashBoardService.viewPercentageOfHealthObjectivesSelectedByUser();
    setHealthObjectivePercentages(res.data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchFirstDashBoardData();
  }, []);

  // Calculate total number of users
  const totalUsers = healthObjectivePercentages.reduce(
    (total, obj) => total + obj.numberOfUsers,
    0
  );

  return (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
      </div>
      <div className="dashboard-container">
        <div className="first-dashboard">
          <h2>Percentage of health objectives selected by users</h2>
          <div className="first-dashboard-view">
            <PieChart
              series={[
                {
                  arcLabel: (item) => `${item.value}%`,
                  arcLabelMinAngle: 55,
                  cx: 150,
                  data: healthObjectivePercentages.map((obj, index) => ({
                    id: index,
                    value: (obj.numberOfUsers / totalUsers) * 100,
                    label: obj.objectiveName,
                  })),
                },
              ]}
              sx={{
                [`& .${pieArcLabelClasses.root}`]: {
                  fill: "white",
                  fontWeight: "bold",
                },
              }}
              width={500}
              height={300}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
