import { ManageLayout } from "./components/manage-layout";
import { ManageContent } from "./components/manage-content";
import { fetchManageData, ManageSearchParams } from "./components/fetch-manage-data";

export default async function ManagePage({
  searchParams,
}: {
  searchParams: Promise<ManageSearchParams>;
}) {
  const params = await searchParams;
  const data = await fetchManageData(params);

  return (
    <ManageLayout>
      <ManageContent data={data} />
    </ManageLayout>
  );
}
