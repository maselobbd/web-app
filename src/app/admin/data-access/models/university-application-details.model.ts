import { groupedDetails } from "./grouped-details.model";

export interface UniversityApplicationDetails {
    universityName: string;
    universityId: number;
    groupedByStatus: groupedDetails[];
}