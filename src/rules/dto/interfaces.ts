import { NumberComparisonFunctions, StringComparisonFunctions } from './enum';

export interface StringCondition {
  comparisonFunction: StringComparisonFunctions;
  value: string;
  isNegative: boolean;
}

export interface NumberCondition {
  comparisonFunction: NumberComparisonFunctions;
  value: number;
  isNegative: boolean;
}
