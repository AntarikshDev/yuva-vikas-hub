// Bulk upload templates for location data - Unified format with State Code only

export type LocationType = 'state' | 'district' | 'block' | 'panchayat' | 'village' | 'pincode';

interface TemplateConfig {
  headers: string[];
  sampleData: string[][];
  filename: string;
}

// All location types use the same unified template format
const unifiedTemplate: TemplateConfig = {
  headers: ['Sr No', 'State Code', 'State', 'District', 'Block', 'Panchayat Name', 'Village Name', 'Pincode'],
  sampleData: [
    ['1', 'JH', 'Jharkhand', 'Bokaro', 'Bermo', 'Armo', 'Armo', '123456'],
    ['2', 'JH', 'Jharkhand', 'Bokaro', 'Bermo', 'Baidhkaro East', 'Baidkaro', '123456'],
    ['3', 'JH', 'Jharkhand', 'Bokaro', 'Bermo', 'Baidhkaro West', 'Baidkaro Ansh', '123456'],
    ['4', 'JH', 'Jharkhand', 'Bokaro', 'Bermo', 'Bermo East', 'Bermo', '123456'],
    ['5', 'JH', 'Jharkhand', 'Bokaro', 'Bermo', 'Bermo South', 'Bermo Ansh', '123456'],
    ['6', 'JH', 'Jharkhand', 'Bokaro', 'Bermo', 'Bermo West', 'Bermo Ansh', '123456'],
    ['7', 'JH', 'Jharkhand', 'Bokaro', 'Bermo', 'Bodiya North', 'Bodia', '123456'],
    ['8', 'JH', 'Jharkhand', 'Bokaro', 'Bermo', 'Bodiya South', 'Bodia Ansh', '123456'],
    ['9', 'JH', 'Jharkhand', 'Bokaro', 'Bermo', 'Armo', 'Gandke', '123456'],
    ['10', 'JH', 'Jharkhand', 'Bokaro', 'Bermo', 'Govindpur A', 'Gobindpur', '123456'],
  ],
  filename: 'location_bulk_upload_template.csv',
};

export const getLocationTemplate = (locationType: LocationType): TemplateConfig => {
  return unifiedTemplate;
};

export const downloadLocationTemplate = (locationType: LocationType): void => {
  const template = unifiedTemplate;
  
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
