import { documentType } from "../../../university-dashboard/enums/DocumentTypes";

export function checkCategory(expensetype: string) : documentType {
    switch (expensetype.toLowerCase()) {
      case 'tuition':
        return documentType.TUITION;
      case 'accommodation':
        return documentType.ACCOMMODATION;
      case 'meals':
        return documentType.MEALS;
      case 'contract':
        return documentType.CONTRACT
      default:
        return documentType.OTHER;
    }
  }