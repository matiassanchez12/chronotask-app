import { fetchSettingsData } from "./components/fetch-settings-data";
import { SettingsLayout } from "./components/settings-layout";
import { SettingsContent } from "./components/settings-content";

export default async function SettingsPage() {
  const data = await fetchSettingsData();

  return (
    <SettingsLayout>
      <SettingsContent initialData={data} />
    </SettingsLayout>
  );
}
