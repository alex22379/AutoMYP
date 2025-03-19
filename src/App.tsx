import mypLogo from "@/assets/myp-logo.png";

import DepartmentNameInput from "@/components/DepartmentNameInput.tsx";
import SalesmenInput from "@/components/SalesmenInput.tsx";
import Generator from "./components/Generator";
import Guide from "@/components/Guide";

import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <div className="bg-power-gray grid min-h-dvh place-items-center p-10">
        <div className="w-300 space-y-8">
          <header className="grid place-items-center">
            <h1>
              <img src={mypLogo} alt="MyPOWER logo" className="h-auto w-96" />{" "}
              <span className="sr-only">MyPOWER-status generator</span>
            </h1>
            <div>
              <a
                href="https://alexandersandholdt.dk"
                target="_blank"
                className="leading-0 text-xs text-blue-600 hover:underline"
              >
                Udviklet af Alexander Sandholdt
              </a>
            </div>
          </header>

          <main className="space-y-8">
            <section className="space-y-4">
              <h2 className="text-power font-mono text-2xl font-bold uppercase">
                Generator
              </h2>
              <Generator />
            </section>

            <section className="space-y-4">
              <h2 className="text-power font-mono text-2xl font-bold uppercase">
                Opsætning
              </h2>
              <div className="max-w-125 space-y-3">
                <DepartmentNameInput />
                <SalesmenInput />
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-power font-mono text-2xl font-bold uppercase">
                Guide
              </h2>
              <Guide />
            </section>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
