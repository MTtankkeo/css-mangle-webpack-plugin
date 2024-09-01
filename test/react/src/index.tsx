// import { useState } from "react";
// import { createRoot } from "react-dom/client";

import "./index.css";

function Root() {
    return (
        <div id="hello-world1" className="hello-world2 hello-world1">hello world</div>
    )
}

Root();

const value1 = document.getElementById("hello-world1");
const value2 = document.getElementsByClassName("hello-world2");

// createRoot(document.body).render(<Root />);