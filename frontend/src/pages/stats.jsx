import { useQuery } from "@tanstack/react-query";
import { getStats } from "../api/admin";
import Loader from "../components/loader";
import { Card, CardBody, CardHeader, Divider } from "@nextui-org/react";

const Stats = () => {
  const { data: stats, isPending } = useQuery({
    queryFn: getStats,
    queryKey: ["stats"],
  });

  if (isPending) {
    return <Loader />;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Statistics Dashboard</h1>
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Object.entries(stats).map(([title, value]) => (
          <div key={title}>
            <StatCard title={title} value={value} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stats;

const mappings = {
  studentCount: "Student Count",
  companyCount: "Company Count",
  jobCount: "Job Count",
  applicationCount: "Application Count",
  placedCount: "Placed Count",
  placementRate: "Placement Rate",
};

const StatCard = ({ title, value }) => (
  <Card>
    <CardHeader className="font-bold text-large">{mappings[title]}</CardHeader>
    <Divider />
    <CardBody>
      <p className="text-2xl font-semibold">{value}</p>
    </CardBody>
  </Card>
);
