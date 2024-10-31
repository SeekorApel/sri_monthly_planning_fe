export class ProductCurring{
    itemCuring: string;
    totalCurringM0: number;
    totalCurringM1: number;
    totalCurringM2: number;
    constructor(itemCuring: string) {
        this.itemCuring = itemCuring;
        this.totalCurringM0 = 0;
        this.totalCurringM1 = 0;
        this.totalCurringM2 = 0;
    }
}