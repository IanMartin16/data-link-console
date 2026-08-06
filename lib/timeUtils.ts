export function getDuration(start?: string | null, end?: string | null) {
  if (!start || !end) return null;

  const ms = new Date(end).getTime() - new Date(start).getTime();

  if (ms <= 0) return null;

  const seconds = ms / 1000;

  if (seconds < 60) {
    return `${seconds.toFixed(2)}s`;
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);

  return `${minutes}m ${remainingSeconds}s`;
  }

  export function getProcessingTime(job: any) {
    return getDuration(job.started_at, job.completed_at);
  }

  export function getTotalTime(job: any) {
    return getDuration(job.created_at, job.completed_at);
  }