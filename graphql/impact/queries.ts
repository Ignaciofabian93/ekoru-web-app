import { gql } from "@apollo/client";

/** Years the signed-in seller has any recorded impact in, newest first. */
export const MY_IMPACT_YEARS = gql`
  query MyImpactYears {
    myImpactYears
  }
`;

/**
 * `topItems` is a required argument, and the record carries no translatable
 * text — category and product names are stored as they stood when each deal
 * completed — so this operation takes no language.
 */
export const MY_IMPACT_YEAR = gql`
  query MyImpactYear($year: Int) {
    myImpactYear(year: $year, topItems: 5) {
      year
      totalCo2SavingsKG
      totalWaterSavingsLT
      totalItems
      salesCount
      exchangesCount
      byCategory {
        productCategoryId
        categoryName
        itemCount
        co2SavingsKG
        waterSavingsLT
      }
      topItems {
        productId
        productName
        kind
        role
        co2SavingsKG
        waterSavingsLT
        occurredAt
      }
    }
  }
`;
