export function generateRoomCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

export function getMonthWindow(date = new Date()) {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 1);
  return { start, end };
}
