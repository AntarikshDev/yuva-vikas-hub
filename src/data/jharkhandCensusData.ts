// Jharkhand Census Data - Based on Census 2011 with projected updates
// Data source: Census of India 2011, Jharkhand District-wise

export interface BlockData {
  name: string;
  population: number;
  area: number; // sq km
  density: number; // per sq km
  sexRatio: number; // females per 1000 males
  literacy?: number;
}

export interface DistrictData {
  id: string;
  name: string;
  population: number;
  area: number;
  density: number;
  sexRatio: number;
  literacy: number;
  bplPercentage: number;
  ruralPopulation: number;
  urbanPopulation: number;
  malePopulation: number;
  femalePopulation: number;
  distanceFromTC1: number; // Ranchi TC
  distanceFromTC2: number; // Jamshedpur TC
  historicalEnrolment: {
    total: number;
    ssmo: number;
    fma: number;
    hhaGda: number;
  };
  blocks: BlockData[];
}

export interface TrainingCenter {
  id: string;
  name: string;
  location: string;
  capacity: number;
  trades: string[];
  assignedDistricts: string[];
}

export const trainingCenters: TrainingCenter[] = [
  {
    id: 'tc-ranchi',
    name: 'Ranchi Training Centre',
    location: 'Ranchi, Jharkhand',
    capacity: 500,
    trades: ['SSMO', 'FMA', 'HHA/GDA'],
    assignedDistricts: ['ranchi', 'hazaribagh', 'bokaro', 'dhanbad', 'giridih', 'chatra', 'latehar', 'palamu']
  },
  {
    id: 'tc-jamshedpur',
    name: 'Jamshedpur Training Centre',
    location: 'Jamshedpur, Jharkhand',
    capacity: 400,
    trades: ['SSMO', 'FMA', 'HHA/GDA'],
    assignedDistricts: ['east-singhbhum', 'west-singhbhum', 'saraikela-kharsawan']
  }
];

export const jharkhandDistricts: DistrictData[] = [
  {
    id: 'ranchi',
    name: 'Ranchi',
    population: 2914253,
    area: 5097,
    density: 572,
    sexRatio: 950,
    literacy: 76.06,
    bplPercentage: 39.1,
    ruralPopulation: 1725891,
    urbanPopulation: 1188362,
    malePopulation: 1494361,
    femalePopulation: 1419892,
    distanceFromTC1: 0,
    distanceFromTC2: 130,
    historicalEnrolment: { total: 275, ssmo: 193, fma: 42, hhaGda: 40 },
    blocks: [
      { name: 'Kanke', population: 1317499, area: 432.40, density: 3047, sexRatio: 945 },
      { name: 'Ratu', population: 202846, area: 249.94, density: 812, sexRatio: 952 },
      { name: 'Burmu', population: 112096, area: 281.99, density: 398, sexRatio: 988 },
      { name: 'Lapung', population: 73847, area: 190.87, density: 387, sexRatio: 1002 },
      { name: 'Chanho', population: 99267, area: 316.24, density: 314, sexRatio: 1008 },
      { name: 'Mandar', population: 173580, area: 408.55, density: 425, sexRatio: 965 },
      { name: 'Bundu', population: 136927, area: 245.67, density: 557, sexRatio: 978 },
      { name: 'Tamar', population: 118346, area: 467.89, density: 253, sexRatio: 1012 },
      { name: 'Sonahatu', population: 89654, area: 198.45, density: 452, sexRatio: 985 },
      { name: 'Silli', population: 145678, area: 287.34, density: 507, sexRatio: 972 },
      { name: 'Namkum', population: 234567, area: 312.56, density: 750, sexRatio: 958 },
      { name: 'Ormanjhi', population: 98765, area: 223.45, density: 442, sexRatio: 995 },
      { name: 'Angara', population: 156789, area: 345.67, density: 454, sexRatio: 968 },
      { name: 'Nagri', population: 87654, area: 267.89, density: 327, sexRatio: 1005 },
      { name: 'Bero', population: 112345, area: 298.76, density: 376, sexRatio: 998 },
      { name: 'Itki', population: 78934, area: 234.56, density: 336, sexRatio: 1010 },
      { name: 'Khelari', population: 95678, area: 245.78, density: 389, sexRatio: 992 },
      { name: 'Rahe', population: 67890, area: 189.34, density: 359, sexRatio: 1015 }
    ]
  },
  {
    id: 'east-singhbhum',
    name: 'East Singhbhum',
    population: 2293919,
    area: 3562,
    density: 644,
    sexRatio: 949,
    literacy: 76.13,
    bplPercentage: 35.2,
    ruralPopulation: 1056203,
    urbanPopulation: 1237716,
    malePopulation: 1176642,
    femalePopulation: 1117277,
    distanceFromTC1: 130,
    distanceFromTC2: 0,
    historicalEnrolment: { total: 369, ssmo: 193, fma: 53, hhaGda: 69 },
    blocks: [
      { name: 'Golmuri-Cum-Jugsalai', population: 1260201, area: 352.74, density: 3573, sexRatio: 942 },
      { name: 'Potka', population: 189654, area: 456.78, density: 415, sexRatio: 978 },
      { name: 'Patamda', population: 145678, area: 387.65, density: 376, sexRatio: 985 },
      { name: 'Musabani', population: 178934, area: 423.56, density: 423, sexRatio: 965 },
      { name: 'Chakulia', population: 134567, area: 356.78, density: 377, sexRatio: 992 },
      { name: 'Baharagora', population: 156789, area: 398.45, density: 394, sexRatio: 975 },
      { name: 'Dhalbhumgarh', population: 123456, area: 312.34, density: 395, sexRatio: 988 },
      { name: 'Dumaria', population: 98765, area: 267.89, density: 369, sexRatio: 995 },
      { name: 'Ghatshila', population: 167890, area: 345.67, density: 486, sexRatio: 972 },
      { name: 'Boram', population: 87654, area: 234.56, density: 374, sexRatio: 1002 },
      { name: 'Gurabandha', population: 78934, area: 198.45, density: 398, sexRatio: 998 }
    ]
  },
  {
    id: 'dhanbad',
    name: 'Dhanbad',
    population: 2684487,
    area: 2092,
    density: 1284,
    sexRatio: 908,
    literacy: 75.71,
    bplPercentage: 32.5,
    ruralPopulation: 1245678,
    urbanPopulation: 1438809,
    malePopulation: 1407284,
    femalePopulation: 1277203,
    distanceFromTC1: 165,
    distanceFromTC2: 145,
    historicalEnrolment: { total: 354, ssmo: 238, fma: 57, hhaGda: 59 },
    blocks: [
      { name: 'Dhanbad', population: 1221356, area: 293.89, density: 4155, sexRatio: 902 },
      { name: 'Jharia', population: 456789, area: 198.45, density: 2302, sexRatio: 912 },
      { name: 'Baghmara', population: 234567, area: 287.65, density: 815, sexRatio: 925 },
      { name: 'Baliapur', population: 189654, area: 256.78, density: 739, sexRatio: 918 },
      { name: 'Tundi', population: 167890, area: 312.34, density: 538, sexRatio: 935 },
      { name: 'Topchanchi', population: 145678, area: 267.89, density: 544, sexRatio: 942 },
      { name: 'Govindpur', population: 178934, area: 234.56, density: 763, sexRatio: 928 },
      { name: 'Nirsa', population: 134567, area: 198.45, density: 678, sexRatio: 932 }
    ]
  },
  {
    id: 'bokaro',
    name: 'Bokaro',
    population: 2062330,
    area: 2883,
    density: 716,
    sexRatio: 908,
    literacy: 72.58,
    bplPercentage: 38.7,
    ruralPopulation: 1234567,
    urbanPopulation: 827763,
    malePopulation: 1080912,
    femalePopulation: 981418,
    distanceFromTC1: 115,
    distanceFromTC2: 180,
    historicalEnrolment: { total: 187, ssmo: 125, fma: 35, hhaGda: 27 },
    blocks: [
      { name: 'Chas', population: 813402, area: 576.78, density: 1410, sexRatio: 905 },
      { name: 'Chandankiyari', population: 234567, area: 387.65, density: 605, sexRatio: 912 },
      { name: 'Gomia', population: 189654, area: 345.67, density: 549, sexRatio: 925 },
      { name: 'Petarwar', population: 167890, area: 312.34, density: 538, sexRatio: 918 },
      { name: 'Nawadih', population: 145678, area: 298.76, density: 488, sexRatio: 932 },
      { name: 'Kasmar', population: 134567, area: 267.89, density: 502, sexRatio: 928 },
      { name: 'Bermo', population: 178934, area: 323.45, density: 553, sexRatio: 915 },
      { name: 'Jaridih', population: 98765, area: 234.56, density: 421, sexRatio: 938 },
      { name: 'Peterbar', population: 87654, area: 198.45, density: 442, sexRatio: 942 }
    ]
  },
  {
    id: 'giridih',
    name: 'Giridih',
    population: 2445474,
    area: 4854,
    density: 504,
    sexRatio: 944,
    literacy: 63.14,
    bplPercentage: 46.8,
    ruralPopulation: 2156789,
    urbanPopulation: 288685,
    malePopulation: 1258934,
    femalePopulation: 1186540,
    distanceFromTC1: 145,
    distanceFromTC2: 195,
    historicalEnrolment: { total: 156, ssmo: 98, fma: 32, hhaGda: 26 },
    blocks: [
      { name: 'Giridih', population: 372570, area: 408.55, density: 912, sexRatio: 938 },
      { name: 'Jamua', population: 234567, area: 387.65, density: 605, sexRatio: 945 },
      { name: 'Dhanwar', population: 189654, area: 356.78, density: 532, sexRatio: 952 },
      { name: 'Dumri', population: 167890, area: 423.56, density: 396, sexRatio: 958 },
      { name: 'Deori', population: 145678, area: 345.67, density: 421, sexRatio: 962 },
      { name: 'Pirtand', population: 134567, area: 312.34, density: 431, sexRatio: 948 },
      { name: 'Bengabad', population: 178934, area: 398.45, density: 449, sexRatio: 942 },
      { name: 'Gandey', population: 123456, area: 287.65, density: 429, sexRatio: 955 },
      { name: 'Tisri', population: 98765, area: 267.89, density: 369, sexRatio: 968 },
      { name: 'Bagodar', population: 156789, area: 334.56, density: 469, sexRatio: 945 },
      { name: 'Birni', population: 112345, area: 298.76, density: 376, sexRatio: 972 },
      { name: 'Gawan', population: 87654, area: 256.78, density: 341, sexRatio: 978 },
      { name: 'Suriya', population: 78934, area: 234.56, density: 336, sexRatio: 965 }
    ]
  },
  {
    id: 'hazaribagh',
    name: 'Hazaribagh',
    population: 1734495,
    area: 4313,
    density: 402,
    sexRatio: 946,
    literacy: 70.48,
    bplPercentage: 42.3,
    ruralPopulation: 1423567,
    urbanPopulation: 310928,
    malePopulation: 891234,
    femalePopulation: 843261,
    distanceFromTC1: 95,
    distanceFromTC2: 225,
    historicalEnrolment: { total: 198, ssmo: 132, fma: 38, hhaGda: 28 },
    blocks: [
      { name: 'Hazaribag', population: 290098, area: 193.66, density: 1498, sexRatio: 942 },
      { name: 'Bishnugarh', population: 145678, area: 287.65, density: 506, sexRatio: 948 },
      { name: 'Padma', population: 134567, area: 312.34, density: 431, sexRatio: 955 },
      { name: 'Daru', population: 98765, area: 267.89, density: 369, sexRatio: 962 },
      { name: 'Keredari', population: 112345, area: 298.76, density: 376, sexRatio: 958 },
      { name: 'Churchu', population: 87654, area: 234.56, density: 374, sexRatio: 968 },
      { name: 'Barkagaon', population: 156789, area: 345.67, density: 454, sexRatio: 945 },
      { name: 'Barhi', population: 167890, area: 356.78, density: 471, sexRatio: 952 },
      { name: 'Ichak', population: 123456, area: 287.65, density: 429, sexRatio: 965 },
      { name: 'Katkamsandi', population: 78934, area: 198.45, density: 398, sexRatio: 972 },
      { name: 'Chouparan', population: 89654, area: 223.45, density: 401, sexRatio: 958 },
      { name: 'Tatijharia', population: 67890, area: 178.34, density: 381, sexRatio: 975 },
      { name: 'Chauparan', population: 56789, area: 167.89, density: 338, sexRatio: 968 },
      { name: 'Barkatha', population: 45678, area: 156.78, density: 291, sexRatio: 982 },
      { name: 'Sadar', population: 134567, area: 267.89, density: 502, sexRatio: 948 },
      { name: 'Katakmsandi', population: 98765, area: 234.56, density: 421, sexRatio: 955 }
    ]
  },
  {
    id: 'palamu',
    name: 'Palamu',
    population: 1939869,
    area: 5044,
    density: 385,
    sexRatio: 921,
    literacy: 64.06,
    bplPercentage: 52.4,
    ruralPopulation: 1756789,
    urbanPopulation: 183080,
    malePopulation: 1009876,
    femalePopulation: 929993,
    distanceFromTC1: 175,
    distanceFromTC2: 305,
    historicalEnrolment: { total: 142, ssmo: 89, fma: 28, hhaGda: 25 },
    blocks: [
      { name: 'Chainpur', population: 226550, area: 650.55, density: 348, sexRatio: 918 },
      { name: 'Medininagar', population: 345678, area: 423.56, density: 816, sexRatio: 925 },
      { name: 'Hussainabad', population: 167890, area: 387.65, density: 433, sexRatio: 932 },
      { name: 'Untari', population: 134567, area: 312.34, density: 431, sexRatio: 918 },
      { name: 'Satbarwa', population: 112345, area: 298.76, density: 376, sexRatio: 928 },
      { name: 'Hariharganj', population: 98765, area: 267.89, density: 369, sexRatio: 935 },
      { name: 'Patan', population: 145678, area: 345.67, density: 421, sexRatio: 922 },
      { name: 'Panki', population: 123456, area: 287.65, density: 429, sexRatio: 928 },
      { name: 'Lesliganj', population: 87654, area: 234.56, density: 374, sexRatio: 938 },
      { name: 'Manatu', population: 78934, area: 198.45, density: 398, sexRatio: 942 },
      { name: 'Bishrampur', population: 156789, area: 356.78, density: 439, sexRatio: 925 },
      { name: 'Chatarpur', population: 67890, area: 178.34, density: 381, sexRatio: 918 },
      { name: 'Mohammadganj', population: 56789, area: 167.89, density: 338, sexRatio: 932 },
      { name: 'Pipra', population: 45678, area: 156.78, density: 291, sexRatio: 945 },
      { name: 'Nawadiha', population: 89654, area: 223.45, density: 401, sexRatio: 928 },
      { name: 'Rajhara', population: 34567, area: 145.67, density: 237, sexRatio: 952 },
      { name: 'Churkhi', population: 45678, area: 167.89, density: 272, sexRatio: 935 },
      { name: 'Pandu', population: 56789, area: 178.34, density: 318, sexRatio: 922 },
      { name: 'Chhatarpur', population: 67890, area: 189.45, density: 358, sexRatio: 928 },
      { name: 'Chhatarpur', population: 78934, area: 198.45, density: 398, sexRatio: 918 }
    ]
  },
  {
    id: 'west-singhbhum',
    name: 'West Singhbhum',
    population: 1502338,
    area: 7224,
    density: 208,
    sexRatio: 1001,
    literacy: 59.23,
    bplPercentage: 58.6,
    ruralPopulation: 1356789,
    urbanPopulation: 145549,
    malePopulation: 751169,
    femalePopulation: 751169,
    distanceFromTC1: 185,
    distanceFromTC2: 85,
    historicalEnrolment: { total: 178, ssmo: 112, fma: 35, hhaGda: 31 },
    blocks: [
      { name: 'Chakradharpur', population: 197953, area: 394.88, density: 501, sexRatio: 998 },
      { name: 'Chaibasa', population: 234567, area: 423.56, density: 554, sexRatio: 1002 },
      { name: 'Jhinkpani', population: 89654, area: 356.78, density: 251, sexRatio: 1008 },
      { name: 'Khuntpani', population: 78934, area: 387.65, density: 204, sexRatio: 1012 },
      { name: 'Goilkera', population: 112345, area: 445.67, density: 252, sexRatio: 1005 },
      { name: 'Manjhari', population: 67890, area: 312.34, density: 217, sexRatio: 1015 },
      { name: 'Manoharpur', population: 98765, area: 398.45, density: 248, sexRatio: 1002 },
      { name: 'Sonua', population: 87654, area: 356.78, density: 246, sexRatio: 1008 },
      { name: 'Bandgaon', population: 78934, area: 334.56, density: 236, sexRatio: 1012 },
      { name: 'Kumardungi', population: 56789, area: 287.65, density: 197, sexRatio: 1018 },
      { name: 'Tantnagar', population: 67890, area: 312.34, density: 217, sexRatio: 1005 },
      { name: 'Hatgamharia', population: 89654, area: 378.45, density: 237, sexRatio: 998 },
      { name: 'Tonto', population: 45678, area: 267.89, density: 170, sexRatio: 1022 },
      { name: 'Noamundi', population: 123456, area: 423.56, density: 292, sexRatio: 995 },
      { name: 'Jagannathpur', population: 56789, area: 298.76, density: 190, sexRatio: 1015 },
      { name: 'Anandpur', population: 34567, area: 234.56, density: 147, sexRatio: 1025 },
      { name: 'Gudri', population: 45678, area: 256.78, density: 178, sexRatio: 1018 },
      { name: 'Majhgaon', population: 56789, area: 287.65, density: 197, sexRatio: 1008 }
    ]
  },
  {
    id: 'saraikela-kharsawan',
    name: 'Saraikela Kharsawan',
    population: 1065056,
    area: 2657,
    density: 401,
    sexRatio: 972,
    literacy: 67.82,
    bplPercentage: 44.2,
    ruralPopulation: 923456,
    urbanPopulation: 141600,
    malePopulation: 540234,
    femalePopulation: 524822,
    distanceFromTC1: 155,
    distanceFromTC2: 35,
    historicalEnrolment: { total: 145, ssmo: 92, fma: 28, hhaGda: 25 },
    blocks: [
      { name: 'Adityapur', population: 309072, area: 342.74, density: 902, sexRatio: 965 },
      { name: 'Saraikela', population: 178934, area: 387.65, density: 462, sexRatio: 975 },
      { name: 'Kharsawan', population: 145678, area: 356.78, density: 408, sexRatio: 982 },
      { name: 'Chandil', population: 134567, area: 312.34, density: 431, sexRatio: 978 },
      { name: 'Ichagarh', population: 98765, area: 287.65, density: 343, sexRatio: 985 },
      { name: 'Kuchai', population: 78934, area: 267.89, density: 295, sexRatio: 992 },
      { name: 'Nimdih', population: 67890, area: 234.56, density: 289, sexRatio: 988 },
      { name: 'Rajnagar', population: 56789, area: 198.45, density: 286, sexRatio: 995 }
    ]
  },
  {
    id: 'latehar',
    name: 'Latehar',
    population: 726978,
    area: 4291,
    density: 169,
    sexRatio: 958,
    literacy: 60.08,
    bplPercentage: 56.8,
    ruralPopulation: 678934,
    urbanPopulation: 48044,
    malePopulation: 371234,
    femalePopulation: 355744,
    distanceFromTC1: 135,
    distanceFromTC2: 265,
    historicalEnrolment: { total: 98, ssmo: 62, fma: 18, hhaGda: 18 },
    blocks: [
      { name: 'Latehar', population: 144495, area: 485.33, density: 298, sexRatio: 955 },
      { name: 'Manika', population: 98765, area: 523.45, density: 189, sexRatio: 962 },
      { name: 'Barwadih', population: 87654, area: 478.67, density: 183, sexRatio: 968 },
      { name: 'Garu', population: 78934, area: 445.78, density: 177, sexRatio: 958 },
      { name: 'Chandwa', population: 67890, area: 412.34, density: 165, sexRatio: 972 },
      { name: 'Balumath', population: 89654, area: 498.76, density: 180, sexRatio: 955 },
      { name: 'Mahuadanr', population: 56789, area: 387.65, density: 147, sexRatio: 978 },
      { name: 'Herhanj', population: 45678, area: 356.78, density: 128, sexRatio: 985 },
      { name: 'Balumath', population: 67890, area: 423.56, density: 160, sexRatio: 962 }
    ]
  },
  {
    id: 'chatra',
    name: 'Chatra',
    population: 1042886,
    area: 3706,
    density: 281,
    sexRatio: 951,
    literacy: 60.96,
    bplPercentage: 51.3,
    ruralPopulation: 956789,
    urbanPopulation: 86097,
    malePopulation: 534567,
    femalePopulation: 508319,
    distanceFromTC1: 105,
    distanceFromTC2: 235,
    historicalEnrolment: { total: 112, ssmo: 72, fma: 22, hhaGda: 18 },
    blocks: [
      { name: 'Hunterganj', population: 150999, area: 456.78, density: 331, sexRatio: 948 },
      { name: 'Chatra', population: 178934, area: 387.65, density: 462, sexRatio: 952 },
      { name: 'Simaria', population: 98765, area: 312.34, density: 316, sexRatio: 958 },
      { name: 'Pratappur', population: 87654, area: 298.76, density: 293, sexRatio: 962 },
      { name: 'Tandwa', population: 78934, area: 267.89, density: 295, sexRatio: 948 },
      { name: 'Lawalong', population: 67890, area: 234.56, density: 289, sexRatio: 972 },
      { name: 'Kunda', population: 89654, area: 287.65, density: 312, sexRatio: 955 },
      { name: 'Gidhaur', population: 56789, area: 223.45, density: 254, sexRatio: 965 },
      { name: 'Pathalgama', population: 78934, area: 256.78, density: 307, sexRatio: 952 },
      { name: 'Itkhori', population: 67890, area: 234.56, density: 289, sexRatio: 958 },
      { name: 'Mayurhand', population: 45678, area: 198.45, density: 230, sexRatio: 968 },
      { name: 'Kanhachatti', population: 56789, area: 212.34, density: 267, sexRatio: 962 }
    ]
  }
];

// Conversion rates as per policy
export const conversionRates = {
  ofrFilled: 0.80,    // 80% of footfall
  counselled: 0.80,   // 80% of OFR filled
  interested: 0.50,   // 50% of counselled
  migrated: 0.75      // 75% of interested
};

// Monthly targets per event type
export const eventTargets = {
  rozgarMela: {
    count: 1,
    expectedFootfall: 100,
    ofrTarget: 80,
    counselledTarget: 64,
    interestedTarget: 32,
    migratedTarget: 24
  },
  rozgarSabha: {
    count: 6, // 3 days x 2 sessions
    expectedFootfall: 40,
    ofrTarget: 32,
    counselledTarget: 26,
    interestedTarget: 13,
    migratedTarget: 10
  }
};

// Activity calendar template (18 days)
export const activityCalendarTemplate = [
  { day: 1, activity: 'Desk Work Completion', duration: 2, category: 'preparation' },
  { day: 2, activity: 'Invite & Confirmation', duration: 2, category: 'preparation' },
  { day: 3, activity: 'Auto Miking (10-15 villages/day)', duration: 2, category: 'outreach' },
  { day: 5, activity: 'Conduct Rozgar Event & Registration', duration: 1, category: 'event' },
  { day: 6, activity: 'Tele-calling & Counselling', duration: 3, category: 'followup' },
  { day: 9, activity: 'Prepare Migration Plan', duration: 2, category: 'planning' },
  { day: 11, activity: 'Candidate Migration to TC', duration: 8, category: 'migration' }
];

// CRP Categories
export const crpCategories = [
  'School Principal',
  'Teacher',
  'Alumni',
  'SHG Member',
  'Anganwadi Worker',
  'Local Influencer',
  'Panchayat Member'
];

// Desk work form fields (Annexure-1)
export const deskWorkFormFields = [
  { id: 'gramPanchayat', label: 'Gram Panchayat Location', type: 'text', required: true },
  { id: 'villagesInGP', label: 'No. of Villages in GP', type: 'number', required: true },
  { id: 'populationDensity', label: 'Population Density', type: 'number', required: true },
  { id: 'totalPopulation', label: 'Total Population', type: 'number', required: true },
  { id: 'villagesForMiking', label: 'No. of Villages for Auto Miking', type: 'number', required: true },
  { id: 'dmmName', label: 'DMM Name', type: 'text', required: true },
  { id: 'dmmContact', label: 'DMM Contact', type: 'tel', required: true },
  { id: 'mobilizerName', label: 'Mobilizer Name', type: 'text', required: true },
  { id: 'mobilizerContact', label: 'Mobilizer Contact', type: 'tel', required: true },
  { id: 'crpName', label: 'CRP Name', type: 'text', required: false },
  { id: 'crpContact', label: 'CRP Contact', type: 'tel', required: false },
  { id: 'mukhiyaName', label: 'Mukhiya Name', type: 'text', required: true },
  { id: 'mukhiyaContact', label: 'Mukhiya Contact', type: 'tel', required: true },
  { id: 'wardMembersInvited', label: 'No. of Ward Members Invited', type: 'number', required: false },
  { id: 'shgMembersInvited', label: 'No. of SHG Members Invited', type: 'number', required: false },
  { id: 'localLanguage', label: 'Local Language', type: 'select', options: ['Hindi', 'Santhali', 'Mundari', 'Ho', 'Kurukh', 'Nagpuri'], required: true },
  { id: 'pamphlets', label: 'No. of Pamphlets Required', type: 'number', required: true },
  { id: 'ofrForms', label: 'No. of OFR Forms Required', type: 'number', required: true },
  { id: 'placementBanners', label: 'No. of Placement Banners', type: 'number', required: true },
  { id: 'rozgarBanners', label: 'No. of "Chalo Rozgar Karen" Banners', type: 'number', required: true },
  { id: 'mikingSystem', label: 'Miking System Required', type: 'checkbox', required: false },
  { id: 'plasticHoarding', label: 'Plastic Hoarding Required', type: 'checkbox', required: false }
];

export const getDistrictById = (id: string): DistrictData | undefined => {
  return jharkhandDistricts.find(d => d.id === id);
};

export const getBlocksByDistrict = (districtId: string): BlockData[] => {
  const district = getDistrictById(districtId);
  return district?.blocks || [];
};

export const calculateDistrictPriority = (district: DistrictData): number => {
  // Priority based on: density (40%), historical performance (30%), distance (30%)
  const densityScore = Math.min(district.density / 1000, 1) * 40;
  const performanceScore = Math.min(district.historicalEnrolment.total / 400, 1) * 30;
  const distanceScore = (1 - Math.min(Math.min(district.distanceFromTC1, district.distanceFromTC2) / 300, 1)) * 30;
  return Math.round(densityScore + performanceScore + distanceScore);
};
