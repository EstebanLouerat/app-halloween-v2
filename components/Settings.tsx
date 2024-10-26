import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { DbdSetting } from "@/pages/api/settings";
import { useNotification } from "@/contexts/NotificationContext";

const Settings: React.FC<DbdSetting> = (settings) => {
  const router = useRouter();
  const [timerDuration, setTimerDuration] = useState<number>(
    settings.timerDuration
  );
  const [killerTimerDuration, setKillerTimerDuration] = useState<number>(
    settings.killerTimerDuration
  );
  const [killerCooldown, setKillerCooldown] = useState<number>(
    settings.killerCooldown
  );
  const [playerTimerRate, setPlayerTimerRate] = useState<number[]>(
    settings.playerTimerRate
  );

  const { showNotification } = useNotification();

  const changePlayerTimerRate = (value: string, index: number) => {
    const newValues = [...playerTimerRate];
    newValues[index] = parseFloat(value);
    setPlayerTimerRate(newValues);
  };

  useEffect(() => {
    console.log(timerDuration);
  }, [timerDuration, killerCooldown, killerTimerDuration, playerTimerRate]);

  const handleSave = () => {
    axios
      .put("/api/settings", {
        id: settings.id,
        timerDuration,
        killerTimerDuration,
        killerCooldown,
        playerTimerRate,
      })
      .then(() => {
        showNotification("Settings updated successfully!");
        router.back();
      })
      .catch((error) => {
        console.error("Error updating settings:", error);
        alert("Failed to update settings.");
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
      <h1 className="text-4xl font-bold mt-16 mb-8">Settings</h1>

      <div className="w-full max-w-lg space-y-6">
        <div className="flex flex-col">
          <label className="mb-2 text-lg">Timer Duration (seconds):</label>
          <input
            type="number"
            className="p-2 rounded bg-gray-800 text-white focus:outline-none focus:ring focus:ring-blue-500"
            value={timerDuration}
            onChange={(e) => setTimerDuration(Number(e.target.value))}
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
            onChange={(e) => setKillerTimerDuration(Number(e.target.value))}
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-2 text-lg">Killer Cooldown (seconds):</label>
          <input
            type="number"
            className="p-2 rounded bg-gray-800 text-white focus:outline-none focus:ring focus:ring-blue-500"
            value={killerCooldown}
            onChange={(e) => setKillerCooldown(Number(e.target.value))}
          />
        </div>

        <div className="flex flex-col space-y-4">
          <label className="mb-2 text-lg">Player Timer Rate:</label>
          {playerTimerRate.map((rate, index) => (
            <input
              key={index}
              type="number"
              className="p-2 rounded bg-gray-800 text-white focus:outline-none focus:ring focus:ring-blue-500"
              value={rate ?? 0}
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
