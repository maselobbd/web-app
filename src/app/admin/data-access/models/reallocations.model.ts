export interface ReallocationsModel {
    university?: string | null, 
    entities: string;
    to: string;
    from: string;
    fromNewAllocation: number;
    fromOldAllocation: number;
    toNewAllocation: number;
    toOldAllocation: number;
    moneyReallocated: number;
}