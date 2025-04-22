const MAQAM_TYPES = {
  RAST: 'ראסט',
  BYAT: 'ביאת',
  SABA: 'צבא',
  NAWA: 'נאווה',
  HIJAZ: 'חיג׳אז',
  MAHUR: 'מאהור',
  AJAM: 'עג׳ם',
  SIGA: 'סיגא',
  HUSENY: 'חוסייני',
  NAWAND: 'נהאוונד'
};

const PARASHA_MAQAM_MAP = {
  "Bereshit": "RAST",
  "Noach": "BYAT",
  "Lech-Lecha": "SABA",
  "Vayera": "NAWA",
  "Chayei Sara": "HIJAZ",
  "Toldot": "MAHUR",
  "Vayetzei": "AJAM",
  "Vayishlach": "BYAT",
  "Vayeshev": "NAWA",
  "Miketz": "SIGA",
  "Vayigash": "BYAT",
  "Vayechi": "HIJAZ",
  "Shemot": "BYAT",
  "Vaera": "NAWA",
  "Bo": "SIGA",
  "Beshalach": "AJAM",
  "Yitro": "HUSENY",
  "Mishpatim": "SABA",
  "Terumah": "BYAT",
  "Tetzaveh": "SIGA",
  "Ki Tisa": "HIJAZ",
  "Vayakhel": "HUSENY",
  "Pekudei": "NAWA",
  "Vayikra": "RAST",
  "Tzav": "NAWA",
  "Shmini": "HUSENY",
  "Tazria": "SABA",
  "Tazria-Metzora": "SABA",
  "Metzora": "SABA",
  "Achrei Mot": "HIJAZ",
  "Kedoshim": "SABA",
  "Emor": "SIGA",
  "Behar": "NAWA",
  "Bechukotai": "BYAT",
  "Bamidbar": "BYAT",
  "Nasso": "BYAT",
  "Beha'alotcha": "SIGA",
  "Sh'lach": "NAWAND",
  "Korach": "HUSENY",
  "Chukat": "RAST",
  "Balak": "BYAT",
  "Pinchas": "SABA",
  "Matot": "NAWA",
  "Masei": "SABA",
  "Devarim": "HIJAZ",
  "Vaetchanan": "HUSENY",
  "Eikev": "SIGA",
  "Re'eh": "RAST",
  "Shoftim": "AJAM",
  "Ki Teitzei": "SABA",
  "Ki Tavo": "SIGA",
  "Nitzavim": "NAWA",
  "Vayeilech": "RAST",
  "Ha'Azinu": "HUSENY",
  "Vezot Haberakhah": "AJAM",
  "Sukkot": "AJAM",
};

export function getMaqamForParasha(parashaName) {
  const maqamType = PARASHA_MAQAM_MAP[parashaName];
  return maqamType ? MAQAM_TYPES[maqamType] : null;
}

export function extractParashaName(events) {
  if (!events || !Array.isArray(events)) return null;
  
  const parashaEvent = events.find(event => event.startsWith('Parashat '));
  if (!parashaEvent) return null;
  
  return parashaEvent.replace('Parashat ', '');
} 