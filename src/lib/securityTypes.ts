export interface SecuritySettings {
  dashboardScreenshotProtection: boolean;
  productScreenshotProtection: boolean;
  antiScreenRecordingBlur: boolean;
  blockRightClickAndDrag: boolean;
  watermarkOverlay: boolean;
}

export const DEFAULT_SECURITY_SETTINGS: SecuritySettings = {
  dashboardScreenshotProtection: false,
  productScreenshotProtection: true,
  antiScreenRecordingBlur: true,
  blockRightClickAndDrag: true,
  watermarkOverlay: true,
};
