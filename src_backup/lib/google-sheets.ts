// src/lib/google-sheets.ts

const SHEET_API_URL = process.env.NEXT_PUBLIC_SHEETS_WEB_APP_URL || '';

export async function fetchSheetData() {
  try {
    const response = await fetch(SHEET_API_URL);
    if (!response.ok) {
      throw new Error('Gagal mengambil data dari Google Sheets');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching Google Sheets:', error);
    return null;
  }
}