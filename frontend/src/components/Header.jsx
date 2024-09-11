import React from "react";

function Header(props) {
    return (
        <div id="header">
            <h1>You've named {props.guesses} out of {props.total} countries so far!</h1>
            <div id="forms">
                <form id="user-guess" action="/submit" method="POST">
                    <input id="country-guess" type="text" size="50" name="country" autoComplete="off" autoFocus placeholder="Enter a country name"></input>
                    <button id="submit-guess">Submit</button>
                </form>
                <form action="/reset" method="POST">
                    <button id="restart">Restart</button>
                </form>
            </div>
        </div>
    )
};

export default Header;