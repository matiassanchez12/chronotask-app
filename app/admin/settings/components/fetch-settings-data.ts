import { getUserSettings } from "@/app/actions";

export type SettingsData = Awaited<ReturnType<typeof getUserSettings>>;

export async function fetchSettingsData() {
  return await getUserSettings();
}
