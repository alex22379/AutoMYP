import saelgere from "./saelgere.json";

export function getMypText(bilagArr) {
  const mypText = [
    ...bilagArr.map((bilag) => Object.values(bilag).join("	")),
  ].join("\n");
  return mypText;
}

export function getMypData(data) {
  const dataSplit = data.split(
    "----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------\r\n",
  );
  dataSplit.pop(); // Remove last empty element

  const bilagArr = [];
  for (let bilag of dataSplit) {
    const meta = getBilagMeta(bilag);

    if (
      meta.saelger.includes("NPCC") ||
      meta.total < 0 ||
      (meta.retur && meta.total <= 0) ||
      (meta.email && meta.email.split("@")[1]) === "power.dk"
    )
      continue;

    bilagArr.push(meta);
  }

  return bilagArr;
}

export function getBilagMeta(bilag) {
  const lines = bilag.split("\n");

  // Bilagsnr.
  const kvittering = lines[0].split("KONTANT ")[1].replaceAll("\r", "");

  // Sælger
  let saelger = undefined;
  if (bilag.includes("Operatør"))
    saelger = bilag
      .split("Operatør ")
      .pop()
      .split("|")
      .shift()
      .replaceAll(" ", "");
  else {
    saelger = lines[3].split("Sælger..: ")[1].replaceAll("\r", "");

    const regex = /\d{6,}/;
    if (regex.test(saelger)) saelger = saelger.match(regex).shift();
    saelger = saelgere[saelger] ?? saelger;
  }

  // Telefon
  const telefon = lines[4].includes("Telefon.: ")
    ? lines[4].split("Telefon.: ")[1].replaceAll("\r", "").replaceAll("+45", "")
    : undefined;

  // Email
  const email = lines[5].includes("E-mail kunde: ")
    ? lines[5].split("E-mail kunde: ")[1].replaceAll("\r", "")
    : undefined;

  // Total
  let total;
  for (let line of lines) {
    if (line.includes("TOTAL ") && line.includes("DKK ")) {
      total = line
        .split("  DKK ")[1]
        .replaceAll("\r", "")
        .replaceAll(" ", "")
        .replaceAll(".", "")
        .replaceAll(",", ".");
      total = Number(total);
      break;
    }
  }

  // MYP
  // 0 = Ikke spurgt, 1 = Er MYP, 2 = IM, 3 = MYPOWER, 4 = IGNORER MYP
  let myp;
  if (bilag.includes("Kunden ønsker at blive MyPOWER")) myp = 3;
  else if (bilag.includes("ØNSKER IKKE AT BLIVE MYPOWER")) myp = 2;
  else if (
    bilag.toLowerCase().includes(" er myp") ||
    bilag.toLowerCase().includes(" er medl") ||
    bilag.toLowerCase().includes(" allerede medl") ||
    bilag.toLowerCase().includes(" allerede myp") ||
    bilag.toLowerCase().includes(" amp") ||
    bilag.toLowerCase().includes(" medlem") ||
    bilag.toLowerCase().includes("medlem myp") ||
    bilag.toLowerCase().includes("mypower") ||
    bilag.includes("MYPOWER-RABAT")
  )
    myp = 1;
  else if (
    bilag.toLowerCase().includes(" ignmyp") ||
    bilag.toLowerCase().includes(" erhverv")
  )
    myp = 4;
  else myp = 0;

  // Retur
  const retur = bilag.includes(" -1 ");

  const meta = {
    bilag: kvittering,
    saelger: saelger,
    telefon: telefon,
    email: email,
    total: total,
    myp: myp,
    retur: retur,
  };

  return meta;
}
