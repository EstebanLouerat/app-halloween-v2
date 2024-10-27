import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { DbdSetting } from "@/pages/api/settings";
import {
  NotificationStatus,
  useNotification,
} from "@/contexts/NotificationContext";
import {
  clearGeneratorFromLocalStorage,
  clearTimerFromLocalStorage,
} from "@/utils/localStorage";
import { DbdGenerator } from "@/pages/api/generators";

const Settings: React.FC<DbdGenerator> = (generator) => {
  const router = useRouter();
  const settings = generator.settings as DbdSetting;

  const [timerDuration, setTimerDuration] = useState<string>(
    settings.timerDuration?.toString() || ""
  );
  const [killerTimerDuration, setKillerTimerDuration] = useState<string>(
    settings.killerTimerDuration?.toString() || ""
  );
  const [killerCooldown, setKillerCooldown] = useState<string>(
    settings.killerCooldown?.toString() || ""
  );
  const [playerTimerRate, setPlayerTimerRate] = useState<string[]>(
    settings.playerTimerRate.map((rate) => rate.toString())
  );

  const { showNotification } = useNotification();

  const changePlayerTimerRate = (value: string, index: number) => {
    const newValues = [...playerTimerRate];
    newValues[index] = value;
    setPlayerTimerRate(newValues);
  };

  const handleSave = () => {
    axios
      .put("/api/settings", {
        id: settings.id,
        timerDuration: parseFloat(timerDuration) || 0,
        killerTimerDuration: parseFloat(killerTimerDuration) || 0,
        killerCooldown: parseFloat(killerCooldown) || 0,
        playerTimerRate: playerTimerRate.map((rate) => parseFloat(rate) || 0),
      })
      .then(() => {
        showNotification(
          "Settings updated successfully!",
          NotificationStatus.SUCCESS
        );
        router.back();
      })
      .catch((error) => {
        console.error("Error updating settings:", error);
        alert("Failed to update settings.");
      });
  };

  const handleBackToMenu = () => {
    axios
      .put("/api/generators", {
        id: generator.id,
        isActif: false,
      })
      .then(() => {
        showNotification(
          "Generator updated successfully!",
          NotificationStatus.SUCCESS
        );
        clearGeneratorFromLocalStorage();
        clearTimerFromLocalStorage();
        router.push("/g");
      })
      .catch((error) => {
        console.error("Error updating generator:", error);
      });
  };

  return (
    <div
      className="w-screen h-screen relative flex flex-col items-center bg-gray-900 p-6 text-white"
      style={{ backgroundColor: "var(--color-grey-900-transparent)" }}
    >
      <button
        className="absolute top-4 left-4 p-2 rounded bg-gray-700 hover:bg-gray-600 transition duration-300"
        onClick={() => router.back()}
      >
        ← Back
      </button>
      <button
        className="absolute top-4 right-4 p-2 rounded bg-red-700 hover:bg-red-600 transition duration-300"
        onClick={() => handleBackToMenu()}
      >
        Changer de Générateur
      </button>
      <h1 className="text-4xl font-bold mt-16 mb-8">Settings</h1>

      <div className="w-full max-w-lg space-y-6">
        <div className="flex flex-col">
          <label className="mb-2 text-lg">Timer Duration (seconds):</label>
          <input
            type="number"
            className="p-2 rounded bg-gray-800 text-white focus:outline-none focus:ring focus:ring-blue-500"
            value={timerDuration}
            onChange={(e) => setTimerDuration(e.target.value || "")}
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-2 text-lg">
            Killer Timer Duration (seconds):
          </label>
          <input
            type="number"
            className="p-2 rounded bg-gray-800 text-white focus:outline-none focus:ring focus:ring-blue-500"
            value={killerTimerDuration}
            onChange={(e) => setKillerTimerDuration(e.target.value || "")}
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-2 text-lg">Killer Cooldown (seconds):</label>
          <input
            type="number"
            className="p-2 rounded bg-gray-800 text-white focus:outline-none focus:ring focus:ring-blue-500"
            value={killerCooldown}
            onChange={(e) => setKillerCooldown(e.target.value || "")}
          />
        </div>

        <div className="flex flex-col space-y-4">
          <label className="mb-2 text-lg">Player Timer Rate:</label>
          {playerTimerRate.map((rate, index) => (
            <input
              key={index}
              type="number"
              className="p-2 rounded bg-gray-800 text-white focus:outline-none focus:ring focus:ring-blue-500"
              value={rate}
              onChange={(e) => changePlayerTimerRate(e.target.value, index)}
            />
          ))}
        </div>

        <button
          className="w-full py-3 mt-6 rounded bg-blue-600 hover:bg-blue-500 transition duration-300"
          onClick={handleSave}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default Settings;
