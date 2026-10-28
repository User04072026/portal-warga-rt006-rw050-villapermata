/**
 * Server-only integration starter for Microsoft Graph.
 * Do not import this module into a client component.
 * Configure app registration, permissions, workbook IDs, token flow, and sync logic before use.
 */
export function getMicrosoftGraphConfig() {
  const required = [
    "MICROSOFT_TENANT_ID",
    "MICROSOFT_CLIENT_ID",
    "MICROSOFT_CLIENT_SECRET",
    "EXCEL_DRIVE_ID",
    "EXCEL_ITEM_ID",
  ] as const;

  const missing = required.filter((key) => !process.env[key]);
  return { configured: missing.length === 0, missing };
}

export async function getWorkbookStatus() {
  const config = getMicrosoftGraphConfig();
  if (!config.configured) {
    return { ok: false as const, status: "not_configured", missing: config.missing };
  }

  // TODO: Implement OAuth token acquisition and Graph workbook API calls on the server.
  // Add retries, idempotency, conflict detection, audit logging, and scheduled sync.
  return {
    ok: false as const,
    status: "implementation_required",
    message: "Kredensial terdeteksi, tetapi alur Graph API belum diimplementasikan atau diuji.",
  };
}
