// District Template Generator - Generates CSV templates from Jharkhand data
import { jharkhandDistricts, trainingCenters, DistrictData } from '@/data/jharkhandCensusData';

export interface DistrictAnalysisData {
  enrolment: EnrolmentData[];
  tradeWise: TradeWiseData[];
  density: DensityData[];
  distance: DistanceData[];
  blocks: BlockData[];
}

export interface EnrolmentData {
  district: string;
  total: number;
  ssmo: number;
  fma: number;
  hhaGda: number;
}

export interface TradeWiseData {
  district: string;
  trade: string;
  count: number;
}

export interface DensityData {
  district: string;
  population: number;
  area: number;
  density: number;
  literacy: number;
  bplPercentage: number;
}

export interface DistanceData {
  district: string;
  tc1Name: string;
  tc1Distance: number;
  tc2Name: string;
  tc2Distance: number;
}

export interface BlockData {
  district: string;
  block: string;
  population: number;
  area: number;
  density: number;
  sexRatio: number;
}

// Generate CSV content from data
const generateCSV = (headers: string[], rows: string[][]): string => {
  const headerLine = headers.join(',');
  const dataLines = rows.map(row => row.map(cell => `"${cell}"`).join(','));
  return [headerLine, ...dataLines].join('\n');
};

// Generate Enrolment Template
export const generateEnrolmentTemplate = (): string => {
  const headers = ['District', 'Total', 'SSMO', 'FMA', 'HHA_GDA'];
  const rows = jharkhandDistricts.map(d => [
    d.name,
    d.historicalEnrolment.total.toString(),
    d.historicalEnrolment.ssmo.toString(),
    d.historicalEnrolment.fma.toString(),
    d.historicalEnrolment.hhaGda.toString()
  ]);
  return generateCSV(headers, rows);
};

// Generate Density Template
export const generateDensityTemplate = (): string => {
  const headers = ['District', 'Population', 'Area_SqKm', 'Density', 'Literacy_Percent', 'BPL_Percent'];
  const rows = jharkhandDistricts.map(d => [
    d.name,
    d.population.toString(),
    d.area.toString(),
    d.density.toString(),
    d.literacy.toString(),
    d.bplPercentage.toString()
  ]);
  return generateCSV(headers, rows);
};

// Generate Distance Template
export const generateDistanceTemplate = (): string => {
  const headers = ['District', 'TC1_Name', 'TC1_Distance_Km', 'TC2_Name', 'TC2_Distance_Km'];
  const rows = jharkhandDistricts.map(d => [
    d.name,
    trainingCenters[0].name,
    d.distanceFromTC1.toString(),
    trainingCenters[1].name,
    d.distanceFromTC2.toString()
  ]);
  return generateCSV(headers, rows);
};

// Generate Block Data Template
export const generateBlockTemplate = (): string => {
  const headers = ['District', 'Block', 'Population', 'Area_SqKm', 'Density', 'Sex_Ratio'];
  const rows: string[][] = [];
  
  jharkhandDistricts.forEach(district => {
    district.blocks.forEach(block => {
      rows.push([
        district.name,
        block.name,
        block.population.toString(),
        block.area.toString(),
        block.density.toString(),
        block.sexRatio.toString()
      ]);
    });
  });
  
  return generateCSV(headers, rows);
};

// Generate Trade-wise Template
export const generateTradeWiseTemplate = (): string => {
  const headers = ['District', 'SSMO', 'FMA', 'HHA_GDA'];
  const rows = jharkhandDistricts.map(d => [
    d.name,
    d.historicalEnrolment.ssmo.toString(),
    d.historicalEnrolment.fma.toString(),
    d.historicalEnrolment.hhaGda.toString()
  ]);
  return generateCSV(headers, rows);
};

// Download CSV file
export const downloadTemplate = (type: 'enrolment' | 'density' | 'distance' | 'blocks' | 'tradewise' | 'all'): void => {
  const download = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  switch (type) {
    case 'enrolment':
      download(generateEnrolmentTemplate(), 'district_enrolment_template.csv');
      break;
    case 'density':
      download(generateDensityTemplate(), 'district_density_template.csv');
      break;
    case 'distance':
      download(generateDistanceTemplate(), 'district_distance_template.csv');
      break;
    case 'blocks':
      download(generateBlockTemplate(), 'district_blocks_template.csv');
      break;
    case 'tradewise':
      download(generateTradeWiseTemplate(), 'district_tradewise_template.csv');
      break;
    case 'all':
      // Download all templates
      download(generateEnrolmentTemplate(), 'district_enrolment_template.csv');
      setTimeout(() => download(generateDensityTemplate(), 'district_density_template.csv'), 100);
      setTimeout(() => download(generateDistanceTemplate(), 'district_distance_template.csv'), 200);
      setTimeout(() => download(generateBlockTemplate(), 'district_blocks_template.csv'), 300);
      break;
  }
};

// Get Jharkhand mock data as DistrictAnalysisData
export const getJharkhandMockData = (): DistrictAnalysisData => {
  return {
    enrolment: jharkhandDistricts.map(d => ({
      district: d.name,
      total: d.historicalEnrolment.total,
      ssmo: d.historicalEnrolment.ssmo,
      fma: d.historicalEnrolment.fma,
      hhaGda: d.historicalEnrolment.hhaGda
    })),
    tradeWise: jharkhandDistricts.flatMap(d => [
      { district: d.name, trade: 'SSMO', count: d.historicalEnrolment.ssmo },
      { district: d.name, trade: 'FMA', count: d.historicalEnrolment.fma },
      { district: d.name, trade: 'HHA/GDA', count: d.historicalEnrolment.hhaGda }
    ]),
    density: jharkhandDistricts.map(d => ({
      district: d.name,
      population: d.population,
      area: d.area,
      density: d.density,
      literacy: d.literacy,
      bplPercentage: d.bplPercentage
    })),
    distance: jharkhandDistricts.map(d => ({
      district: d.name,
      tc1Name: trainingCenters[0].name,
      tc1Distance: d.distanceFromTC1,
      tc2Name: trainingCenters[1].name,
      tc2Distance: d.distanceFromTC2
    })),
    blocks: jharkhandDistricts.flatMap(d => 
      d.blocks.map(b => ({
        district: d.name,
        block: b.name,
        population: b.population,
        area: b.area,
        density: b.density,
        sexRatio: b.sexRatio
      }))
    )
  };
};
