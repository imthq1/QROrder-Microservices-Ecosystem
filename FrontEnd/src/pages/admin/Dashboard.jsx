import Layout from "../../components/Admin/layout/Layout";
import StatCard from "../../components/Admin/dashboard/StatCard";
import IncomeChart from "../../components/Admin/dashboard/IncomeChart";
import DailySellingChart from "../../components/Admin/dashboard/DailySellingChart";
import BestDishes from "../../components/Admin/dashboard/BestDishes";
import "../../styles/dashboard.css";

const Dashboard = () => {
  return (
    <div className="dashboard-grid">
      <StatCard />
      <IncomeChart />
      <DailySellingChart />
      <BestDishes />
    </div>
  );
};

export default Dashboard;
