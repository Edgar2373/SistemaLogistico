import DashboardHeader from "../../components/dashboard/DashboardHeader";
import MetricsSection from "../../components/dashboard/MetricsSection";
import WeeklyChart from "../../components/dashboard/WeeklyChart";
import QuickAccess from "../../components/dashboard/QuickAccess";
import RecentOrdersTable from "../../components/dashboard/RecentOrdersTable";

function DashboardAdmin() {
  return (
    <>
      <DashboardHeader />
      <MetricsSection />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <WeeklyChart />
        <QuickAccess />
      </div>
      <RecentOrdersTable />
    </>
  );
}

export default DashboardAdmin;