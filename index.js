import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "world",
    password: "**",
    port: 5432
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

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
    const countries = await getGuessedCountries();
    console.log(countries);
    res.render("index.ejs", {
        countries: countries
    });
});

app.post("/submit", async (req, res) => {
    const result = await db.query(
        "SELECT country_code FROM countries WHERE country_name LIKE '%' || $1 || '%'",
        [req.body.country]
    );
    const country = result.rows[0].country_code;
    await db.query("INSERT INTO guessed_countries (country) VALUES ($1)", [country]);
    res.redirect("/");
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})