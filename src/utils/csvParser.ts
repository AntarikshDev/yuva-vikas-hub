// CSV Parser Utility for District Adoption Plan

export interface ParseResult<T> {
  success: boolean;
  data: T[];
  errors: string[];
}

// Parse CSV string into array of objects
export const parseCSV = <T>(csvString: string, requiredColumns: string[]): ParseResult<T> => {
  const lines = csvString.trim().split('\n');
  const errors: string[] = [];
  
  if (lines.length < 2) {
    return { success: false, data: [], errors: ['File is empty or has no data rows'] };
  }

  // Parse header
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  
  // Validate required columns
  const missingColumns = requiredColumns.filter(col => 
    !headers.some(h => h.toLowerCase() === col.toLowerCase())
  );
  
  if (missingColumns.length > 0) {
    return { 
      success: false, 
      data: [], 
      errors: [`Missing required columns: ${missingColumns.join(', ')}`] 
    };
  }

  // Parse data rows
  const data: T[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Handle quoted values with commas
    const values: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (const char of line) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    
    if (values.length !== headers.length) {
      errors.push(`Row ${i + 1}: Column count mismatch (expected ${headers.length}, got ${values.length})`);
      continue;
    }

    const row: Record<string, any> = {};
    headers.forEach((header, index) => {
      const value = values[index].replace(/"/g, '');
      // Try to parse as number
      const numValue = parseFloat(value);
      row[header] = isNaN(numValue) ? value : numValue;
    });
    
    data.push(row as T);
  }

  return { 
    success: errors.length === 0, 
    data, 
    errors 
  };
};

// Validate enrolment data
export const validateEnrolmentData = (data: any[]): string[] => {
  const errors: string[] = [];
  
  data.forEach((row, i) => {
    if (!row.District || typeof row.District !== 'string') {
      errors.push(`Row ${i + 2}: District name is required`);
    }
    if (typeof row.Total !== 'number' || row.Total < 0) {
      errors.push(`Row ${i + 2}: Total must be a positive number`);
    }
    if (typeof row.SSMO !== 'number' || row.SSMO < 0) {
      errors.push(`Row ${i + 2}: SSMO must be a positive number`);
    }
    if (typeof row.FMA !== 'number' || row.FMA < 0) {
      errors.push(`Row ${i + 2}: FMA must be a positive number`);
    }
    if (typeof row.HHA_GDA !== 'number' || row.HHA_GDA < 0) {
      errors.push(`Row ${i + 2}: HHA_GDA must be a positive number`);
    }
  });
  
  return errors;
};

// Validate density data
export const validateDensityData = (data: any[]): string[] => {
  const errors: string[] = [];
  
  data.forEach((row, i) => {
    if (!row.District || typeof row.District !== 'string') {
      errors.push(`Row ${i + 2}: District name is required`);
    }
    if (typeof row.Population !== 'number' || row.Population <= 0) {
      errors.push(`Row ${i + 2}: Population must be a positive number`);
    }
    if (typeof row.Area_SqKm !== 'number' || row.Area_SqKm <= 0) {
      errors.push(`Row ${i + 2}: Area must be a positive number`);
    }
  });
  
  return errors;
};

// Validate distance data
export const validateDistanceData = (data: any[]): string[] => {
  const errors: string[] = [];
  
  data.forEach((row, i) => {
    if (!row.District || typeof row.District !== 'string') {
      errors.push(`Row ${i + 2}: District name is required`);
    }
    if (typeof row.TC1_Distance_Km !== 'number' || row.TC1_Distance_Km < 0) {
      errors.push(`Row ${i + 2}: TC1 Distance must be a positive number`);
    }
    if (typeof row.TC2_Distance_Km !== 'number' || row.TC2_Distance_Km < 0) {
      errors.push(`Row ${i + 2}: TC2 Distance must be a positive number`);
    }
  });
  
  return errors;
};

// Read file as text
export const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};
