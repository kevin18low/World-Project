import React, {useState, useEffect} from "react";
import Map from "./Map";
import Sidebar from "./Sidebar";
import Header from "./Header";

function App() {
    const [data, setData] = useState([{}]);

    useEffect(() => {
        fetch("/api").then(
            response => response.json()
        ).then(
            data => setData(data)
        )
    }, [])

    useEffect(() => {
        if (data && data.countries) {
            data.countries.forEach((code) => {
                const element = document.getElementById(code);
                if (element) {
                    element.style.fill = "#769AFF";
                }
            });
        }
    }, [data]);

    return (
        <div id="main-container" className="container">
            <Header guesses={data.guessed} total={data.total} error={data.error} />
            <Map />
            <Sidebar />
        </div>
    )
};

export default App;