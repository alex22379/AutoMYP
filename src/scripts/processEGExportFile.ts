import config from "@/config";

let salesmen: { [key: string]: string } = {};

export enum MYPStatus {
  NOT_ASKED = 0,
  ALREADY_MYP = 1,
  IM = 2,
  MYPOWER = 3,
  NOT_RELEVANT = 4,
}

type MYPStats = {
  [key in MYPStatus]: number;
};

interface SalesmanMYPStats extends MYPStats {
  salesman: string;
  name: string | undefined;
  mypDiscount: number;
  totalBilag: () => number;
  hitrate: () => number;
}

interface BilagMeta {
  bilag: string;
  salesman: string | undefined;
  timestamp: number;
  phone: string | undefined;
  email: string | undefined;
  totalAmount: number;
  retur: boolean;
  mypStatus: MYPStatus;
  mypDiscount: boolean;
}

export type SalesmenMYPStats = Set<SalesmanMYPStats>;
type BilagSet = Set<BilagMeta>;

function processEGExportFile(
  egExportFile: File,
): Promise<[SalesmenMYPStats, string] | undefined> {
  return new Promise((resolve, reject) => {
    if (egExportFile) {
      const query = window.location.search;
      const params = new URLSearchParams(query);
      salesmen = JSON.parse(params.get("salesmen") || "{}");

      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target && typeof e.target.result === "string") {
          const bilagSet = getBilagSet(e.target.result);
          const salesmenMYPStats = getSalesmenMYPStats(bilagSet);
          const datePeriod = getDatePeriodFromBilagSet(bilagSet);
          resolve([salesmenMYPStats, datePeriod]);
        }
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsText(egExportFile, config.EG_EXPORT_FILE_ENCODING);
    } else resolve(undefined);
  });
}

export default processEGExportFile;

export function getDatePeriodFromBilagSet(bilagSet: BilagSet): string {
  let lowest = Number.MAX_SAFE_INTEGER;
  let highest = Number.MIN_SAFE_INTEGER;

  for (let bilag of bilagSet) {
    const timestamp = bilag.timestamp;

    if (timestamp < lowest) lowest = timestamp;
    if (timestamp > highest) highest = timestamp;
  }

  const lowestDate = new Date(lowest);
  const highestDate = new Date(highest);
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  };
  if (
    lowestDate.getFullYear() === highestDate.getFullYear() &&
    lowestDate.getMonth() === highestDate.getMonth() &&
    lowestDate.getDate() === highestDate.getDate()
  )
    return `${highestDate.toLocaleDateString("da-DK", options)}`;
  else
    return `${lowestDate.toLocaleDateString("da-DK", options)} - ${highestDate.toLocaleDateString("da-DK", options)}`;
}

function getSalesmenMYPStats(bilagSet: BilagSet): SalesmenMYPStats {
  const stats: { [key: string]: SalesmanMYPStats } = {};

  for (let bilag of bilagSet) {
    const salesman = bilag.salesman;

    if (!salesman) continue;

    if (!stats[salesman]) {
      stats[salesman] = {
        salesman: salesman,
        name:
          Object.entries(salesmen).find(([k, v]) => v === salesman)?.[0] ??
          undefined,
        [MYPStatus.NOT_ASKED]: 0,
        [MYPStatus.ALREADY_MYP]: 0,
        [MYPStatus.IM]: 0,
        [MYPStatus.MYPOWER]: 0,
        [MYPStatus.NOT_RELEVANT]: 0,
        mypDiscount: 0,
        totalBilag: function () {
          return (
            this[MYPStatus.ALREADY_MYP] +
            this[MYPStatus.IM] +
            this[MYPStatus.MYPOWER] +
            this[MYPStatus.NOT_ASKED]
          );
        },
        hitrate: function () {
          return (
            (this[MYPStatus.ALREADY_MYP] +
              this[MYPStatus.IM] * config.IM_WEIGHT +
              this[MYPStatus.MYPOWER]) /
            this.totalBilag()
          );
        },
      };
    }

    stats[salesman][bilag.mypStatus] += 1;
    if (bilag.mypDiscount) stats[salesman].mypDiscount += 1;
  }

  const salesmenMYPStatsSet: SalesmenMYPStats = new Set(
    Object.values(stats).filter((stats) => stats.name),
  );
  return salesmenMYPStatsSet;
}

function getBilagSet(egExport: string, qualifyMYP = true): BilagSet {
  const bilagSet: BilagSet = new Set();

  const allBilag = egExport.split(
    "----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------\r\n",
  );
  allBilag.pop(); // Remove last empty element

  for (let bilag of allBilag) {
    try {
      const meta = getBilagMeta(bilag);
      if (
        qualifyMYP &&
        (!meta.salesman ||
          meta.totalAmount < 0 ||
          (meta.retur && meta.totalAmount <= 0) ||
          (meta.email && meta.email.split("@")[1]) === "power.dk")
      )
        continue;
      bilagSet.add(meta);
    } catch (e) {
      console.error(e);
    }
  }

  return bilagSet;
}

function getBilagMeta(bilag: string): BilagMeta {
  if (bilag == null || bilag == undefined) {
    throw new Error("bilag cannot be null nor undefined");
  }

  const lines = bilag.split("\n");

  // Bilag
  const bilagId = lines[0].split("KONTANT ")[1].replaceAll("\r", "");

  // Sælger
  const salesman = (): string => {
    if (bilag.includes("Operatør"))
      return bilag
        .split("Operatør ")
        .pop()!
        .split("|")
        .shift()!
        .replaceAll(" ", "");
    else {
      const salesmanLine = lines[3].split("Sælger..: ")[1].replaceAll("\r", "");

      const regex = /\d{2}[A-Za-z0-9]{4}/;
      if (regex.test(salesmanLine)) return salesmanLine.match(regex)!.shift()!;
      else return salesmen[salesmanLine] ?? undefined;
    }
  };

  // Phone
  const phone = lines[4].includes("Telefon.: ")
    ? lines[4].split("Telefon.: ")[1].replaceAll("\r", "").replaceAll("+45", "")
    : undefined;

  // Email
  const email = lines[5].includes("E-mail kunde: ")
    ? lines[5].split("E-mail kunde: ")[1].replaceAll("\r", "")
    : undefined;

  // Total Amount
  const totalAmount = (): number | undefined => {
    for (let line of lines) {
      if (line.includes("TOTAL ") && line.includes("DKK ")) {
        return Number(
          line
            .split("  DKK ")[1]
            .replaceAll("\r", "")
            .replaceAll(" ", "")
            .replaceAll(".", "")
            .replaceAll(",", "."),
        );
      }
    }
    return undefined;
  };

  // MYPStatus
  // 0 = NOT_ASKED, 1 = ALREADY_MYP, 2 = IM, 3 = MYPOWER, 4 = NOT_RELEVANT
  const mypStatus = (): MYPStatus => {
    if (bilag.includes(config.MYPOWER_CODE) && phone) return MYPStatus.MYPOWER;
    else if (bilag.includes(config.IM_CODE)) return MYPStatus.IM;
    else if (
      config.ALREADY_MYP_CODES.find((code: string) =>
        bilag.toLowerCase().includes(code),
      ) &&
      phone
    )
      return MYPStatus.ALREADY_MYP;
    else if (
      config.NOT_RELEVANT_CODES.find((code: string) =>
        bilag.toLowerCase().includes(code),
      )
    )
      return MYPStatus.NOT_RELEVANT;
    return MYPStatus.NOT_ASKED;
  };

  // Retur
  const retur = bilag.includes(" -1 ");

  // Dato
  const regex = /\d{2}\.\d{2}\.\d{2}/;
  const dateStr = lines[2].match(regex)!.shift()!;
  const [day, month, year] = dateStr.split(".").map(Number);
  const date = new Date(year + 2000, month - 1, day);

  // MYP-RABAT
  const mypDiscount = bilag.includes(config.MYP_DISCOUNT_CODE);

  const meta: BilagMeta = {
    bilag: bilagId,
    salesman: salesman(),
    phone: phone,
    email: email,
    totalAmount: totalAmount()!,
    mypStatus: mypStatus(),
    retur: retur,
    timestamp: date.getTime(),
    mypDiscount: mypDiscount,
  };

  return meta;
}
