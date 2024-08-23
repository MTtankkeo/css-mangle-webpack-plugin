import { useState } from "react";
import "./index.css";
import { createRoot } from "react-dom/client";

function Root() {
    const [state, setState] = useState(true);

    return (
        <div>hello world</div>
    )
}

// createRoot(document.body).render(<Root />);