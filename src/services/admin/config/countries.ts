export type CountryConfig = {
  code: string; // ISO code
  name: string;
  currency: { code: string; symbol: string; locale: string };
  phone: { prefix: string; local: number; example: string; format?: string };
  locale: string;
  tax?: null | number;
  departments?: string[];
};

export const COUNTRY_CONFIGS: Record<string, CountryConfig> = {
  Bolivia: {
    code: "BO",
    name: "Bolivia",
    currency: { code: "BOB", symbol: "Bs", locale: "es-BO" },
    phone: {
      prefix: "591",
      local: 8,
      example: "59112345678",
      format: "XXXX XXXX",
    },
    locale: "es-BO",
    tax: null,
    departments: [
      "La Paz",
      "Cochabamba",
      "Santa Cruz",
      "Oruro",
      "Potosí",
      "Tarija",
      "Chuquisaca",
      "Beni",
      "Pando",
    ],
  },
  Honduras: {
    code: "HN",
    name: "Honduras",
    currency: { code: "HNL", symbol: "L.", locale: "es-HN" },
    phone: {
      prefix: "504",
      local: 8,
      example: "50412345678",
      format: "XXXX XXXX",
    },
    locale: "es-HN",
    tax: null,
    departments: [
      "Atlántida",
      "Colón",
      "Comayagua",
      "Copán",
      "Cortés",
      "Choluteca",
      "El Paraíso",
      "Francisco Morazán",
      "Gracias a Dios",
      "Intibucá",
      "Islas de la Bahía",
      "La Paz",
      "Lempira",
      "Ocotepeque",
      "Olancho",
      "Santa Bárbara",
      "Valle",
      "Yoro",
    ],
  },
  Guatemala: {
    code: "GT",
    name: "Guatemala",
    currency: { code: "GTQ", symbol: "Q", locale: "es-GT" },
    phone: {
      prefix: "502",
      local: 8,
      example: "50212345678",
      format: "XXXX XXXX",
    },
    locale: "es-GT",
    tax: null,
    departments: [
      "Alta Verapaz",
      "Baja Verapaz",
      "Chimaltenango",
      "Chiquimula",
      "El Progreso",
      "Escuintla",
      "Guatemala",
      "Huehuetenango",
      "Izabal",
      "Jalapa",
      "Jutiapa",
      "Petén",
      "Quetzaltenango",
      "Quiché",
      "Retalhuleu",
      "Sacatepéquez",
      "San Marcos",
      "Santa Rosa",
      "Sololá",
      "Suchitepéquez",
      "Totonicapán",
      "Zacapa",
    ],
  },
  Nicaragua: {
    code: "NI",
    name: "Nicaragua",
    currency: { code: "NIO", symbol: "C$", locale: "es-NI" },
    phone: {
      prefix: "505",
      local: 8,
      example: "50512345678",
      format: "XXXX XXXX",
    },
    locale: "es-NI",
    tax: null,
    departments: [
      "Boaco",
      "Carazo",
      "Chinandega",
      "Chontales",
      "Estelí",
      "Granada",
      "Jinotega",
      "León",
      "Madriz",
      "Managua",
      "Masaya",
      "Matagalpa",
      "Nueva Segovia",
      "Rivas",
      "Río San Juan",
    ],
  },
  Perú: {
    code: "PE",
    name: "Perú",
    currency: { code: "PEN", symbol: "S/", locale: "es-PE" },
    phone: { prefix: "51", local: 9, example: "51123456789" },
    locale: "es-PE",
    tax: null,
    departments: [
      "Amazonas",
      "Áncash",
      "Apurímac",
      "Arequipa",
      "Ayacucho",
      "Cajamarca",
      "Callao",
      "Cusco",
      "Huancavelica",
      "Huánuco",
      "Ica",
      "Junín",
      "La Libertad",
      "Lambayeque",
      "Lima",
      "Loreto",
      "Madre de Dios",
      "Moquegua",
      "Pasco",
      "Piura",
      "Puno",
      "San Martín",
      "Tacna",
      "Tumbes",
      "Ucayali",
    ],
  },
  Ecuador: {
    code: "EC",
    name: "Ecuador",
    currency: { code: "USD", symbol: "$", locale: "es-EC" },
    phone: { prefix: "593", local: 9, example: "593912345678" },
    locale: "es-EC",
    tax: null,
    departments: [
      "Azuay",
      "Bolívar",
      "Cañar",
      "Carchi",
      "Chimborazo",
      "Cotopaxi",
      "El Oro",
      "Esmeraldas",
      "Galápagos",
      "Guayas",
      "Imbabura",
      "Loja",
      "Los Ríos",
      "Manabí",
      "Morona Santiago",
      "Napo",
      "Orellana",
      "Pastaza",
      "Pichincha",
      "Santa Elena",
      "Santo Domingo de los Tsáchilas",
      "Sucumbíos",
      "Tungurahua",
    ],
  },
};

export function getCountryConfigByName(name?: string) {
  if (!name) return undefined;
  // normalize common variants
  const normalized = name
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
  return (
    Object.values(COUNTRY_CONFIGS).find(
      (c) =>
        c.name
          .normalize("NFD")
          .replace(/\p{Diacritic}/gu, "")
          .toLowerCase() === normalized
    ) ||
    Object.values(COUNTRY_CONFIGS).find((c) =>
      normalized.includes(c.name.toLowerCase())
    )
  );
}
