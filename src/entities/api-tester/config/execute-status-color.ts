/**
 * Get status code color for UI
 */
export function getExecuteStatusColor(status: number): string {
  if (status >= 200 && status < 300) {
    return '#10b981'; // Green - success
  } else if (status >= 300 && status < 400) {
    return '#3b82f6'; // Blue - redirect
  } else if (status >= 400 && status < 500) {
    return '#f59e0b'; // Amber - client error
  } else if (status >= 500) {
    return '#ef4444'; // Red - server error
  }
  return '#6b7280'; // Gray - unknown
}
