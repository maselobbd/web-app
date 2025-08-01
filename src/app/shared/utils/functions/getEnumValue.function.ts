import { DocumentStatus } from "../../enums/documentStatus";

export function getEnumValue(key: string) {
    return Object.values(DocumentStatus).find((status) => status === key)!;
  }