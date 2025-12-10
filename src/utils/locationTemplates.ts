// Bulk upload templates for location data

export type LocationType = 'state' | 'district' | 'block' | 'panchayat' | 'village' | 'pincode';

interface TemplateConfig {
  headers: string[];
  sampleData: string[][];
  filename: string;
}

const templates: Record<LocationType, TemplateConfig> = {
  state: {
    headers: ['State Code', 'State Name', 'Is Active (Yes/No)'],
    sampleData: [
      ['MH', 'Maharashtra', 'Yes'],
      ['KA', 'Karnataka', 'Yes'],
      ['TN', 'Tamil Nadu', 'Yes'],
      ['GJ', 'Gujarat', 'Yes'],
      ['RJ', 'Rajasthan', 'No'],
    ],
    filename: 'state_bulk_upload_template.csv',
  },
  district: {
    headers: ['State Code', 'State Name', 'District Code', 'District Name', 'Is Active (Yes/No)'],
    sampleData: [
      ['MH', 'Maharashtra', 'MUM', 'Mumbai', 'Yes'],
      ['MH', 'Maharashtra', 'PUN', 'Pune', 'Yes'],
      ['MH', 'Maharashtra', 'NAG', 'Nagpur', 'Yes'],
      ['KA', 'Karnataka', 'BLR', 'Bangalore Urban', 'Yes'],
      ['KA', 'Karnataka', 'MYS', 'Mysore', 'No'],
    ],
    filename: 'district_bulk_upload_template.csv',
  },
  block: {
    headers: ['State Code', 'State Name', 'District Code', 'District Name', 'Block Code', 'Block Name', 'Is Active (Yes/No)'],
    sampleData: [
      ['MH', 'Maharashtra', 'MUM', 'Mumbai', 'AND', 'Andheri', 'Yes'],
      ['MH', 'Maharashtra', 'MUM', 'Mumbai', 'BAN', 'Bandra', 'Yes'],
      ['MH', 'Maharashtra', 'MUM', 'Mumbai', 'KUR', 'Kurla', 'Yes'],
      ['MH', 'Maharashtra', 'PUN', 'Pune', 'HAV', 'Haveli', 'Yes'],
      ['MH', 'Maharashtra', 'PUN', 'Pune', 'MUL', 'Mulshi', 'No'],
    ],
    filename: 'block_bulk_upload_template.csv',
  },
  panchayat: {
    headers: ['State Code', 'State Name', 'District Code', 'District Name', 'Block Code', 'Block Name', 'Panchayat Code', 'Panchayat Name', 'Is Active (Yes/No)'],
    sampleData: [
      ['MH', 'Maharashtra', 'MUM', 'Mumbai', 'AND', 'Andheri', 'VER', 'Versova Gram Panchayat', 'Yes'],
      ['MH', 'Maharashtra', 'MUM', 'Mumbai', 'AND', 'Andheri', 'MAR', 'Marol Gram Panchayat', 'Yes'],
      ['MH', 'Maharashtra', 'PUN', 'Pune', 'HAV', 'Haveli', 'URU', 'Uruli Kanchan GP', 'Yes'],
      ['MH', 'Maharashtra', 'PUN', 'Pune', 'HAV', 'Haveli', 'LON', 'Loni Kalbhor GP', 'Yes'],
      ['KA', 'Karnataka', 'BLR', 'Bangalore Urban', 'YEL', 'Yelahanka', 'JKR', 'Jakkur GP', 'No'],
    ],
    filename: 'panchayat_bulk_upload_template.csv',
  },
  village: {
    headers: ['Panchayat Code', 'Panchayat Name', 'Village Code', 'Village Name', 'Pincode', 'Is Active (Yes/No)'],
    sampleData: [
      ['VER', 'Versova Gram Panchayat', 'VER01', 'Versova Village', '400061', 'Yes'],
      ['VER', 'Versova Gram Panchayat', 'VER02', 'Oshiwara Village', '400053', 'Yes'],
      ['MAR', 'Marol Gram Panchayat', 'MAR01', 'Marol Gaon', '400059', 'Yes'],
      ['URU', 'Uruli Kanchan GP', 'URU01', 'Uruli Village', '412202', 'Yes'],
      ['LON', 'Loni Kalbhor GP', 'LON01', 'Loni Kalbhor', '412201', 'No'],
    ],
    filename: 'village_bulk_upload_template.csv',
  },
  pincode: {
    headers: ['State Code', 'State Name', 'District Code', 'District Name', 'Pincode', 'Area Name', 'Is Active (Yes/No)'],
    sampleData: [
      ['MH', 'Maharashtra', 'MUM', 'Mumbai', '400001', 'Fort', 'Yes'],
      ['MH', 'Maharashtra', 'MUM', 'Mumbai', '400053', 'Andheri West', 'Yes'],
      ['MH', 'Maharashtra', 'MUM', 'Mumbai', '400059', 'Marol', 'Yes'],
      ['MH', 'Maharashtra', 'PUN', 'Pune', '411001', 'Shivajinagar', 'Yes'],
      ['KA', 'Karnataka', 'BLR', 'Bangalore Urban', '560001', 'MG Road', 'No'],
    ],
    filename: 'pincode_bulk_upload_template.csv',
  },
};

export const getLocationTemplate = (locationType: LocationType): TemplateConfig => {
  return templates[locationType];
};

export const downloadLocationTemplate = (locationType: LocationType): void => {
  const template = templates[locationType];
  
  // Create CSV content
  const csvContent = [
    template.headers.join(','),
    ...template.sampleData.map(row => row.map(cell => `"${cell}"`).join(',')),
  ].join('\n');
  
  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', template.filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const getLocationTypeName = (locationType: LocationType): string => {
  return locationType.charAt(0).toUpperCase() + locationType.slice(1);
};
