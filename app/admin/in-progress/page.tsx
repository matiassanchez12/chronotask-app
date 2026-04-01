import { fetchInProgressData } from "./components/fetch-in-progress-data";
import { InProgressLayout } from "./components/in-progress-layout";
import { InProgressContent } from "./components/in-progress-content";

export default async function InProgressPage() {
  const data = await fetchInProgressData();

  return (
    <InProgressLayout>
      <InProgressContent data={data} />
    </InProgressLayout>
  );
}
