import { CustomCurrencyPipe } from "../../shared/utils/pipes/custom-currency-pipe.pipe";

export function createMessageType(minAmount: number, maxAmount: number): { MIN_WARNING: string, MAX_WARNING: string } {
  const MIN_WARNING = `*Minimum of ${new CustomCurrencyPipe().transform(minAmount)} per allocation allowed`;
  const MAX_WARNING = `*Maximum of ${new CustomCurrencyPipe().transform(maxAmount)} per allocation allowed`;
  
  return {  MIN_WARNING, MAX_WARNING };
}
