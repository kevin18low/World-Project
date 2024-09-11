import React, {useState, useEffect} from "react";

function Sidebar() {
    const [gamemode, setGamemode] = useState("");
    const [time, setTime] = useState(10);
    const [startTimer, setStartTimer] = useState(() => {
        const savedState = localStorage.getItem('timeStarted');
        return savedState === 'true';
    });

    useEffect(() => {
        if (!startTimer) return;

        const interval = setInterval(() => {
            setTime(prevTime => {
                if (prevTime === 0) {
                  resetCountries();
                  clearInterval(interval);
                  localStorage.setItem('timeStarted', 'false');
                  setTime("Game Over!");
                  return 0;
                } else {
                  return prevTime - 1;
                }
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [startTimer]);

    function handleStart() {
        setStartTimer(true);
        localStorage.setItem('timeStarted', 'true');
    }

    function stopTimer() {
        setStartTimer(false);
        localStorage.setItem('timeStarted', 'false');
        setTime(10);
    }

    function resetCountries() {
        fetch("/reset", {
            method: "POST"
        });
        setTimeout(() => {
            window.location.href = "/";
        }, 3000);
    }

    function handleGamemode(event) {
        const name = event.target.name;
        const classic = "In Classic mode, you have unlimited time! Test your knowledge of the world in a stress free environment.";
        const streak = "In Hotstreak, you have 10 seconds for each guess. Guessing a country correctly resets the timer and gives you another 10 seconds. See if you can handle the pressure!";
        if (name === "classic") {
            setGamemode(classic);
        } else if (name === "hotstreak") {
            setGamemode(streak);
        };
        const info = document.getElementById("info")
        info.classList.toggle("hidden");
        setTimeout(() => {
            info.classList.toggle("hidden");
        }, 10000);
    }

    return (
        <div id="sidebar">
            <button id="classic-button" name="classic" className="gamemode" onClick={handleGamemode}>Classic</button>
            <button id="hotstreak-button" name="hotstreak" className="gamemode" onClick={handleGamemode}>HotStreak</button>  
            <button id="streak-start-button" onClick={handleStart}>Play HotStreak</button>
            <h3 id="timer">{time}</h3>
            <button id="stop-button" onClick={stopTimer}>Stop Streak</button>
            <h3 id="info" className="hidden">{gamemode}</h3>
        </div>
    )
};

export default Sidebar;