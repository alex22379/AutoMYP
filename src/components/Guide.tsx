function guide() {
  return (
    <article className="space-y-3">
      <div className="text-gray-400">
        <p className="text-sm font-bold">På hjemmesiden:</p>
        <ol className="ml-6 list-decimal text-xs">
          <li>
            <p>Angiv navn på varehus/afdeling, f.eks. "POWER Haderslev"</p>
          </li>
          <li>
            <p>
              Tilføj samtlige sælgere til listen{" "}
              <i>
                (navnet skal stå præcist som i Elguide - også inkl. "." efter
                initial)
              </i>
            </p>
          </li>
        </ol>
        <p className="mt-2 text-sm font-bold">I Elguide:</p>
        <ol className="ml-6 list-decimal text-xs">
          <li>
            <p>Åben menu 170</p>
          </li>
          <li>
            <p>
              Vælg menupunkt 2, <i>Bilagsliste/-kopi</i>
            </p>
          </li>
          <li>
            <p>Indtast nu dine parametrer og den ønskede periode</p>
          </li>
          <li>
            <p>
              I den næste menu vælges <i>"Privatkunder"</i>
            </p>
          </li>
          <li>
            <p>
              Herefter <i>"Kontantbilag"</i>
            </p>
          </li>
          <li>
            <p>
              Tryk nu <code>F12</code> og vælg <i>"Eksport"</i>
            </p>
          </li>
        </ol>
        <p className="mt-2 text-sm font-bold">Vend tilbage til hjemmesiden:</p>
        <ol className="ml-6 list-decimal text-xs">
          <li>
            <p>Upload den eksporterede fil fra Elguide</p>
          </li>
          <li>
            <p>Værsgo'</p>
          </li>
        </ol>
      </div>
      <div className="text-power flex flex-col text-sm">
        <a href="/myp.txt" download="myp.txt">
          Download Elguide-testfil <i>(fiktiv data)</i>
        </a>
        <p className="text-xs">
          (Kontrollér at filen er enkodet i "Windows-1252" med
          linjeslutningssekvens "CRLF")
        </p>
      </div>
    </article>
  );
}

export default guide;
