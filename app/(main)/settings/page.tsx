import { getUserSettings } from "@/app/actions/settings";
import { SettingsClient } from "./settings-client";

export default async function SettingsPage() {
  const settings = await getUserSettings();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <SettingsClient
          email={settings.email ?? ""}
          readingGoal={settings.twenty_six_reading_goal}
        />
      </div>
    </div>
  );
}
