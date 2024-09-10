import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import env from "dotenv";

const app = express();
const port = 4000;
env.config();

const db = new pg.Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PW,
    port: process.env.PG_PORT,
});

db.connect();

async function getGuessedCountries() {
    let countries = [];
    const result = await db.query("SELECT country FROM guessed_countries");
    result.rows.forEach((country) => {
        countries.push(country.country);
    });
    return countries;
}

async function getTotalCountries() {
    const result = await db.query("SELECT country_name FROM countries");
    return result.rows.length;
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("../frontend/public"));

app.get("/api", async (req, res) => {
    const countries = await getGuessedCountries();
    const total = await getTotalCountries();

    res.send({ 
        countries: countries,
        guessed: countries.length,
        total: total
    });
});

app.post("/submit", async (req, res) => {
    try {
        const result = await db.query(
            "SELECT country_code FROM countries WHERE LOWER(country_name) = LOWER($1) OR LOWER(country_name) LIKE '%' || LOWER($1) || '%' ORDER BY LENGTH(country_name)",
            [req.body.country]
        );
        const country = result.rows[0].country_code;
        try {
            await db.query("INSERT INTO guessed_countries (country) VALUES ($1)", [country]);
            res.redirect("/");
        } catch (err) {
            console.log(err);
            const countries = await getGuessedCountries();
            const total = await getTotalCountries();
            res.send({
                countries: countries,
                guessed: countries.length,
                total: total,
                error: "dupe"
            });
        }
    } catch (err) {
        console.log(err);
        const countries = await getGuessedCountries();
        const total = await getTotalCountries();
        res.send({
            countries: countries,
            guessed: countries.length,
            total: total,
            error: "dne"
        });
    }
});

app.post("/reset", async (req, res) => {
    await db.query("TRUNCATE guessed_countries");
    res.redirect("/");
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});