import React, {useState} from "react";

function Header({guesses, total, guessData, setData, resetTimer, currentMode}) {
    const [guess, setGuess] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();

        const res = await fetch("/submit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ country: guess })
        });

        const data = await res.json();

        const oldCountries = guessData.countries || [];
        const newCountries = data.countries || [];
        if (currentMode === "hotstreak" && newCountries.length > oldCountries.length) {
            resetTimer();
        }

        setData(data);
        setGuess("");
    }

    async function handleReset() {
        const res = await fetch("/reset", { method: "POST" });
        const data = await res.json();
        setData(data);
        resetTimer();
    }

    return (
        <div id="header">
            <h1>You've named {guesses} out of {total} countries so far!</h1>

            <div id="forms">
                <form id="user-guess" onSubmit={handleSubmit}>
                    <input
                        id="country-guess"
                        type="text"
                        size="50"
                        value={guess}
                        onChange={e => setGuess(e.target.value)}
                        autoComplete="off"
                        autoFocus
                        placeholder="Enter a country name"
                    />
                    <button type="submit">Submit</button>
                </form>

                <button id="restart" onClick={handleReset}>
                    Restart
                </button>
            </div>
        </div>
    )
};

export default Header;