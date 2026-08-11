import { gql } from "@apollo/client";

/** Years the signed-in seller has any recorded impact in, newest first. */
export const MY_IMPACT_YEARS = gql`
  query MyImpactYears {
    myImpactYears
  }
`;

export const MY_IMPACT_YEAR = gql`
  query MyImpactYear($year: Int, $language: Language) {
    myImpactYear(year: $year, topItems: 5, language: $language) {
      year
      totalCo2SavingsKG
      totalWaterSavingsLT
      totalItems
      salesCount
      exchangesCount
      co2Messages
      waterMessages
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
