import mypLogo from "@/assets/myp-logo.png";

import Configuration from "./components/Configuration";
import Generator from "./components/Generator";
import Guide from "@/components/Guide";
import Section from "@/components/ui/Section";

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
            <Section title="Generator">
              <Generator />
            </Section>

            <Section title="Opsætning">
              <Configuration />
              <p className="font-mono text-sm text-white">
                [TIP: Når du laver ændringer, så gem linket på ny - selve
                opsætningen er gemt i linket]
              </p>
            </Section>

            <Section title="Guide">
              <Guide />
            </Section>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
