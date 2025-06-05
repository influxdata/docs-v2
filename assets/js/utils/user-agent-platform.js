/**
 * Platform detection utility functions
 * Provides methods for detecting user's operating system
 */

/**
 * Detects user's operating system using modern techniques
 * Falls back to userAgent parsing when newer APIs aren't available
 * @returns {string} Operating system identifier ("osx", "win", "linux", or "other")
 */
export function getPlatform() {
  // Try to use modern User-Agent Client Hints API first (Chrome 89+, Edge 89+)
  if (navigator.userAgentData && navigator.userAgentData.platform) {
    const platform = navigator.userAgentData.platform.toLowerCase();
    
    if (platform.includes('mac')) return 'osx';
    if (platform.includes('win')) return 'win';
    if (platform.includes('linux')) return 'linux';
  }
  
  // Fall back to userAgent string parsing
  const userAgent = navigator.userAgent.toLowerCase();
  
  if (userAgent.includes('mac') || userAgent.includes('iphone') || userAgent.includes('ipad')) return 'osx';
  if (userAgent.includes('win')) return 'win';
  if (userAgent.includes('linux') || userAgent.includes('android')) return 'linux';
  
  return 'other';
}