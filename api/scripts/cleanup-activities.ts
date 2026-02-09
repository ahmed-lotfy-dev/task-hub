/**
 * Activity Cleanup Script
 * 
 * This script hard-deletes activities that were soft-deleted more than 30 days ago.
 * Run this as a scheduled job (e.g., daily via cron or systemd timer)
 * 
 * Usage:
 *   bun run scripts/cleanup-activities.ts
 * 
 * Or with Docker:
 *   docker compose exec api bun run scripts/cleanup-activities.ts
 */

import { ActivityService } from "../src/services/activity.service";

async function cleanupActivities() {
  console.log("[Cleanup] Starting activity cleanup...");
  console.log(`[Cleanup] Current time: ${new Date().toISOString()}`);

  try {
    const result = await ActivityService.cleanupOldDeletedActivities();
    
    console.log(`[Cleanup] Successfully deleted ${result.deletedCount} old activities`);
    
    if (result.deletedCount > 0) {
      console.log(`[Cleanup] Deleted activity IDs: ${result.deletedIds.join(", ")}`);
    }
    
    console.log("[Cleanup] Cleanup completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("[Cleanup] Error during cleanup:", error);
    process.exit(1);
  }
}

// Run if executed directly
if (import.meta.main) {
  cleanupActivities();
}
