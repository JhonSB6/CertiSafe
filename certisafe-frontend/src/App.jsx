import { BrowserRouter, Routes, Route } from "react-router-dom";
import Inicio from "./pages/Inicio";
import RestablecerContrasena from "./components/RestablecerContrasena";
import "./App.css";

function App() {

    return (
        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={<Inicio />}
                />

                <Route
                    path="/restablecer-contrasena"
                    element={<RestablecerContrasena />}
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;