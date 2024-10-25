import { DbdGenerator } from "@/pages/api/generators";
import axios from "axios";
import confetti from "canvas-confetti";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { SlSettings } from "react-icons/sl";

const Main: React.FC<DbdGenerator> = (generator) => {
  const router = useRouter();

  const settings = generator.settings;

  console.log(generator);

  // Generator's data
  const [name, setName] = useState(generator.name);
  const [settingsName, setSettingsName] = useState(generator.settingsName);
  const [timeLeft, setTimeLeft] = useState(generator.timeLeft);

  // Setting's data
  const [killerCooldown, setKillerCooldown] = useState(
    settings?.killerCooldown || 20
  );
  const [killerTimerDuration, setKillerTimerDuration] = useState(
    settings?.killerTimerDuration || 5
  );
  const [timerDuration, setTimerDuration] = useState(
    settings?.timerDuration || 90
  );
  const [playerTimerRate, setPlayerTimerRate] = useState(
    settings?.playerTimerRate || [1, 1, 1.5, 2, 2.5]
  );

  const [count, setCount] = useState(timeLeft);
  const [killerCount, setKillerCount] = useState(killerTimerDuration);
  const [cooldownCount, setCooldownCount] = useState(killerCooldown);
  const [activePlayers, setActivePlayers] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [isKillerActive, setIsKillerActive] = useState(false);
  const [isKillerCooldown, setIsKillerCooldown] = useState(false);
  const [genActif, setGenActif] = useState(0);
  const [totalGen, setTotalGen] = useState(0);

  const intervalRef = useRef<number | null>(null);
  const killerIntervalRef = useRef<number | null>(null);

  // useEffect(() => {
  //   axios.get<Generator[]>("/api/generators").then((response) => {
  //     let actif = 0;
  //     response.data.forEach((d: Generator) => {
  //       if (d.timeLeft === 0) {
  //         actif += 1;
  //       }

  //       // setSettingsName(d.settingsName);
  //       // setName(d.name);
  //       // setTimeLeft(d.timeLeft);

  //       // setTimerDuration(d.);
  //       // setPlayerTimerRate();
  //       // setKillerCooldown();
  //       // setKillerTimerDuration();
  //     });

  //     // console.log(response.data);
  //     setGenActif(actif);
  //     setTotalGen(response.data.length);
  //   });

  //   axios.get<Setting[]>("/api/generators").then((response) => {
  //     setTimerDuration(d.);
  //     setPlayerTimerRate();
  //     setKillerCooldown();
  //     setKillerTimerDuration();
  //   });
  // }, []);

  const calculateInterval = () => {
    if (isKillerActive) return killerTimerDuration * 1000;
    if (isKillerCooldown) return killerCooldown * 1000;
    if (activePlayers === 0) return null;
    const timeForPlayers = timerDuration / playerTimerRate[activePlayers];
    return (timeForPlayers * 1000) / 60;
  };

  const showConfetti = () => {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) =>
      Math.random() * (max - min) + min;

    const interval = window.setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
  };

  const getProgress = () => {
    return Math.round(((timerDuration - count) / timerDuration) * 100);
  };

  const updateTimer = () => {
    setCount((prevCount) => {
      if (prevCount <= 0) {
        setIsTimerRunning(false);
        showConfetti();
        return timerDuration;
      }
      return prevCount - 1;
    });
  };

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    if (!isTimerRunning) return;

    if (activePlayers > 0) {
      const interval = calculateInterval();
      if (interval) {
        intervalRef.current = window.setInterval(updateTimer, interval);
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [activePlayers, isTimerRunning]);

  useEffect(() => {
    if (isKillerActive) {
      killerIntervalRef.current = window.setInterval(() => {
        setKillerCount((prev) => {
          if (prev <= 1) {
            handleKillerBonus();
            setIsKillerActive(false);
            setIsKillerCooldown(true);
            setKillerCount(killerTimerDuration);
            return killerTimerDuration;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (killerIntervalRef.current) clearInterval(killerIntervalRef.current);
    };
  }, [isKillerActive]);

  useEffect(() => {
    if (isKillerCooldown) {
      const cooldownInterval = window.setInterval(() => {
        setCooldownCount((prev) => {
          if (prev <= 1) {
            setIsKillerCooldown(false);
            setCooldownCount(killerCooldown);
            clearInterval(cooldownInterval);
            return killerCooldown;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(cooldownInterval);
    }
  }, [isKillerCooldown]);

  const handleKillerBonus = () => {
    setCount((prevCount) => {
      const bonus = Math.floor(timerDuration * 0.2); // 20% de 90s = 18s
      return Math.min(prevCount + bonus, timerDuration);
    });
  };

  const handleMouseDown = () => setActivePlayers((prev) => prev + 1);
  const handleMouseUp = () => setActivePlayers((prev) => Math.max(prev - 1, 0));
  const handleKillerMouseDown = () => setIsKillerActive(true);
  const handleKillerMouseUp = () => setIsKillerActive(false);

  const buttonProps = {
    onMouseDown: handleMouseDown,
    onMouseUp: handleMouseUp,
    onMouseLeave: handleMouseUp,
    onTouchStart: handleMouseDown,
    onTouchEnd: handleMouseUp,
    disabled: !isTimerRunning || isKillerActive,
  };

  const killerButtonProps = {
    onMouseDown: handleKillerMouseDown,
    onMouseUp: handleKillerMouseUp,
    onMouseLeave: handleKillerMouseUp,
    onTouchStart: handleKillerMouseDown,
    onTouchEnd: handleKillerMouseUp,
    disabled: !isTimerRunning || isKillerCooldown || activePlayers > 0,
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const getTimerIcon = () => {
    if (isKillerActive) return "💀";
    const icons = ["🕐🚶‍♂️", "🕑🏃‍♂️", "🕒🏇", "🕓🏎️"];
    return icons[Math.min(activePlayers, icons.length) - 1] || "⏳";
  };

  // return (
  //   <>
  //     <h1>Main</h1>
  //     <h2>
  //       Le nombre de générateur réparé est de <span>{genActif}</span>/{totalGen}
  //     </h2>
  //   </>
  // );
  return (
    <div
      className="relative flex flex-col justify-center items-center w-screen h-screen overflow-hidden px-4"
      style={{ backgroundColor: "var(--color-grey-900-transparent)"}}
    >
      <button
        className="absolute top-2 left-2 bg-gray-200 p-2 rounded hover:bg-gray-300 transition duration-300"
        onClick={() => router.push("/settings")}
      >
        <SlSettings color="black" size={"20px"} />
      </button>
      <div
        className={`text-center w-full max-w-md ${
          !isTimerRunning ? "bg-red-100" : ""
        }`}
      >
        <button
          className="bg-black text-white p-3 rounded mb-4 w-full h-[20svh]"
          {...killerButtonProps}
        >
          Killer
        </button>
        {isKillerActive ? (
          <p>💀 Hold for: {formatTime(killerCount)}</p>
        ) : (
          isKillerCooldown && (
            <p className="text-red-500">
              💀 Cooldown: {formatTime(cooldownCount)}
            </p>
          )
        )}
        <div className="mt-8">
          <h2 className="text-2xl mb-4">Hold your button!</h2>
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 h-[50svh]">
            <button className="bg-red-500 p-4 rounded" {...buttonProps}>
              Player 1
            </button>
            <button className="bg-blue-500 p-4 rounded" {...buttonProps}>
              Player 2
            </button>
            <button className="bg-green-500 p-4 rounded" {...buttonProps}>
              Player 3
            </button>
            <button className="bg-yellow-500 p-4 rounded" {...buttonProps}>
              Player 4
            </button>
          </div>
          <p className="mt-4">
            {getTimerIcon()} {formatTime(count)}
            <progress
              className="w-full h-2 mt-2"
              value={getProgress()}
              max="100"
            />
            <span className="block mt-2">{getProgress()}%</span>
          </p>
        </div>
      </div>
      {!isTimerRunning && (
        <div className="absolute inset-0 bg-green-700 bg-opacity-70 flex justify-center items-center text-white text-4xl">
          Finish
        </div>
      )}
    </div>
  );
};

export default Main;
