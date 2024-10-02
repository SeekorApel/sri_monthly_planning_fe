export class ParsingDate {
  // Method untuk memparsing date menjadi format "24 September 2024"
  static parseFullDate(inputDate: string): string {
    const date = new Date(inputDate);

    const day = date.getDate();
    const month = date.toLocaleString('id-ID', { month: 'long' });
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
  }

  // Method untuk memparsing date menjadi format "September 2024"
  static parseMonthYear(inputDate: string): string {
    const date = new Date(inputDate);

    const month = date.toLocaleString('id-ID', { month: 'long' });
    const year = date.getFullYear();

    return `${month} ${year}`;
  }
}
