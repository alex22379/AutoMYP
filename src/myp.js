export function getMypFormattedText(bilagArr) {
  const mypText = [
    ...bilagArr.map((bilag) => Object.values(bilag).join("	")),
  ].join("\n");
  return mypText;
}

export function getBilagFromFile(file, qualify = true) {
  const fileSplit = file.split(
    "----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------\r\n",
  );
  fileSplit.pop(); // Remove last empty element

  const query = window.location.search;
  const params = new URLSearchParams(query);
  const salesmen = JSON.parse(params.get("salesmen") || "{}");
  console.log("salesmen", salesmen);

  const bilagArr = [];
  for (let bilag of fileSplit) {
    const meta = extractBilagMeta(bilag, salesmen);
    if (qualify && !isBilagQualified(meta)) continue;
    bilagArr.push(meta);
  }
  return bilagArr;
}

export function isBilagQualified(meta) {
  if (
    meta.salesman.includes("NPCC") ||
    meta.total < 0 ||
    (meta.retur && meta.total <= 0) ||
    (meta.email && meta.email.split("@")[1]) === "power.dk"
  )
    return false;
  return true;
}

export function extractBilagMeta(bilag, salesmen) {
  const lines = bilag.split("\n");

  // Bilagsnr.
  const kvittering = lines[0].split("KONTANT ")[1].replaceAll("\r", "");

  // Sælger
  let salesman = undefined;
  if (bilag.includes("Operatør"))
    salesman = bilag
      .split("Operatør ")
      .pop()
      .split("|")
      .shift()
      .replaceAll(" ", "");
  else {
    salesman = lines[3].split("Sælger..: ")[1].replaceAll("\r", "");

    const regex = /\d{6,}/;
    if (regex.test(salesman)) salesman = salesman.match(regex).shift();
    salesman = salesmen[salesman] ?? salesman;
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
  if (bilag.includes("Kunden ønsker at blive MyPOWER") && telefon) myp = 3;
  else if (bilag.includes("ØNSKER IKKE AT BLIVE MYPOWER")) myp = 2;
  else if (
    (bilag.toLowerCase().includes(" er myp") ||
      bilag.toLowerCase().includes(" er medl") ||
      bilag.toLowerCase().includes(" allerede medl") ||
      bilag.toLowerCase().includes(" allerede myp") ||
      bilag.toLowerCase().includes(" amp") ||
      bilag.toLowerCase().includes(" medlem") ||
      bilag.toLowerCase().includes("medlem myp") ||
      bilag.toLowerCase().includes("mypower") ||
      bilag.includes("MYPOWER-RABAT")) &&
    telefon
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

  // Dato
  const regex = /\d{2}\.\d{2}\.\d{2}/;
  const dateStr = lines[2].match(regex).shift();
  const [day, month, year] = dateStr.split(".").map(Number);
  const date = new Date(year + 2000, month - 1, day);

  const meta = {
    bilag: kvittering,
    salesman: salesman,
    telefon: telefon,
    email: email,
    total: total,
    myp: myp,
    retur: retur,
    timestamp: date.getTime(),
  };

  return meta;
}
