import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

const Settings = () => {
  const router = useRouter();
  const [timerDuration, setTimerDuration] = useState<number>();
  const [killerTimerDuration, setKillerTimerDuration] = useState<number>();
  const [killerCooldown, setKillerCooldown] = useState<number>();
  const [playerTimerRate, setPlayerTimerRate] = useState<number[]>([]);

  useEffect(() => {
    axios.get("/api/settings").then((response) => {
      const data = response.data;
      setTimerDuration(data.timerDuration);
      setKillerTimerDuration(data.killerTimerDuration);
      setKillerCooldown(data.killerCooldown);
      setPlayerTimerRate(data.playerTimerRate);
    });
  }, []);

  const changePlayerTimerRate = (value: string, index: number) => {
    const newValues = playerTimerRate;
    newValues[index] = parseFloat(value);
    setPlayerTimerRate(newValues);
  };

  const handleSave = () => {
    axios
      .put("/api/settings", {
        timerDuration,
        killerTimerDuration,
        killerCooldown,
        playerTimerRate,
      })
      .then(() => {
        alert("Settings updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating settings:", error);
        alert("Failed to update settings.");
      });
  };

  return (
    <div className="settings-container">
      <button className="back-button" onClick={() => router.push("/")}>
        ← Back
      </button>
      <h1>Settings</h1>
      <label>
        Timer Duration (seconds):
        <input
          type="number"
          defaultValue={timerDuration}
          onChange={(e) => setTimerDuration(Number(e.target.value))}
        />
      </label>
      <label>
        Killer Timer Duration (seconds):
        <input
          type="number"
          defaultValue={killerTimerDuration}
          onChange={(e) => setKillerTimerDuration(Number(e.target.value))}
        />
      </label>
      <label>
        Killer Cooldown (seconds):
        <input
          type="number"
          defaultValue={killerCooldown}
          onChange={(e) => setKillerCooldown(Number(e.target.value))}
        />
      </label>
      <label>
        Player Timer Rate:
        {playerTimerRate.map((item, index) => (
          <input
            key={index}
            type="number"
            defaultValue={item ?? 0}
            onChange={(e) => changePlayerTimerRate(e.target.value, index)}
          />
        ))}
        {/* <input
            type="text"
            value={playerTimerRate ? playerTimerRate.join(",") : ""}
            onChange={(e) =>
              setPlayerTimerRate(e.target.value.split(",").map(Number))
            }
          /> */}
      </label>
      <button className="save-btn" onClick={handleSave}>
        Save
      </button>
    </div>
  );
};

export default Settings;
