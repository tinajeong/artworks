export function getTodaysDateStr() {
  const today = new Date();
  return (
    String(today.getFullYear()) +
    String(today.getMonth()).padStart(2, "0") +
    String(today.getDate()).padStart(2, "0")
  );
}
