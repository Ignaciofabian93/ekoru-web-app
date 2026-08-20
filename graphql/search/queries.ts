import { gql } from "@apollo/client";

export const SEARCH = gql`
  query Search($input: SearchInput!, $language: Language!, $country: String!) {
    search(input: $input, language: $language, country: $country) {
      searchId
      query
      processingTimeMs
      suggestions
      correctedQuery
      items {
        id
        type
        name
        description
        price
        offerPrice
        hasOffer
        images
        category
        subcategory
        rating
        reviewCount
        sellerId
        sellerName
        tags
        relevanceScore
        highlightedName
        highlightedDescription
        product {
          id
          name
          description
          color
          images
          brand
          price
          productCategoryId
          badges
          interests
          condition
          conditionDescription
          isActive
          isExchangeable
          sellerId
          viewCount
          likesCount
          createdAt
          updatedAt
          deletedAt
          reservedUntil
          soldAt
          soldVia
          isLiked
          productCategory {
            id
            departmentCategoryId
            averageWeight
            size
            weightUnit
            translation {
              id
              productCategoryId
              language
              name
              slug
              keywords
              href
              metaTitle
              metaDescription
              metaKeywords
            }
            departmentCategory {
              id
              departmentId
              translation {
                id
                departmentCategoryId
                language
                name
                slug
                href
                metaTitle
                metaDescription
                metaKeywords
              }
              department {
                id
                isActive
                sortOrder
                translation {
                  id
                  departmentId
                  language
                  name
                  slug
                  href
                  metaTitle
                  metaDescription
                  metaKeywords
                }
              }
            }
          }
          seller {
            id
            email
            sellerType
            isActive
            isVerified
            address
            profile {
              ... on PersonProfile {
                id
                sellerId
                firstName
                lastName
                displayName
                profileImage
              }
            }
            country {
              id
              country
              code
            }
            region {
              id
              region
              countryId
            }
            city {
              id
              city
              regionId
            }
            county {
              id
              county
              cityId
            }
          }
          environmentalImpact {
            totalCo2SavingsKG
            totalWaterSavingsLT
            materialBreakdown {
              materialType
              materialTypeLabel
              quantity
              unit
              co2SavingsKG
              waterSavingsLT
            }
          }
        }
        seller {
          id
          email
          sellerType
          isVerified
          address
          profile {
            ... on BusinessProfile {
              id
              sellerId
              businessName
              description
              logo
              businessType
              legalBusinessName
              shippingPolicy
              businessHours
            }
            ... on PersonProfile {
              id
              sellerId
              firstName
              lastName
              displayName
              bio
              profileImage
            }
          }
          country {
            id
            country
            code
          }
          region {
            id
            region
            countryId
          }
          city {
            id
            city
            regionId
          }
          county {
            id
            county
            cityId
          }
        }
        service {
          id
          name
          description
          sellerId
          subcategoryId
          pricingType
          basePrice
          priceRange
          duration
          isActive
          images
          tags
          createdAt
          updatedAt
          deletedAt
          availabilitySchedule
          isCurrentlyAvailable
          maxConcurrentBookings
          advanceBookingDays
          serviceRadius
          serviceLocations
          isRemoteService
          averageRating
          reviewCount
          viewCount
          isLiked
          displayImage
          seller {
            id
            email
            sellerType
            isVerified
            address
            website
            profile {
              ... on BusinessProfile {
                id
                sellerId
                businessName
                description
                logo
                businessType
                legalBusinessName
                shippingPolicy
                businessHours
              }
            }
            country {
              id
              country
              code
            }
            region {
              id
              region
              countryId
            }
            city {
              id
              city
              regionId
            }
            county {
              id
              county
              cityId
            }
          }
          serviceCategory {
            id
            serviceCategoryId
            isActive
            sortOrder
            subCategory
            serviceCount
            href
            translation {
              id
              serviceSubCategoryId
              language
              subCategory
              slug
              href
              metaTitle
              metaDescription
              metaKeywords
            }
          }
        }
        storeProduct {
          id
          name
          description
          stock
          barcode
          sku
          price
          hasOffer
          offerPrice
          sellerId
          images
          isActive
          badges
          color
          brand
          averageRating
          reviewsNumber
          likesCount
          saleCount
          viewCount
          materialComposition
          recycledContent
          weight
          weightUnit
          length
          width
          height
          dimensionUnit
          lowStockThreshold
          isLowStock
          tags
          metaTitle
          metaDescription
          warranty
          warrantyDuration
          features
          createdAt
          updatedAt
          deletedAt
          isLiked
          materials {
            id
            materialTypeId
            materialType
            label
            percentage
          }
          environmentalImpact {
            totalCo2SavingsKG
            totalWaterSavingsLT
            materialBreakdown {
              materialType
              materialTypeLabel
              quantity
              unit
              co2SavingsKG
              waterSavingsLT
            }
          }
          seller {
            id
            email
            sellerType
            isVerified
            address
            website
            profile {
              ... on BusinessProfile {
                id
                sellerId
                businessName
                description
                logo
                businessType
                legalBusinessName
                shippingPolicy
                businessHours
              }
            }
            country {
              id
              country
              code
            }
            region {
              id
              region
              countryId
            }
            city {
              id
              city
              regionId
            }
            county {
              id
              county
              cityId
            }
          }
          storeSubCategory {
            id
            storeCategoryId
            averageWeight
            size
            weightUnit
            translation {
              id
              storeSubCategoryId
              language
              name
              slug
              keywords
              href
              metaTitle
              metaDescription
            }
            storeCategory {
              id
              isActive
              sortOrder
              translation {
                id
                storeCategoryId
                language
                name
                slug
                href
                metaTitle
                metaDescription
                metaKeywords
              }
            }
          }
        }
      }
      facets {
        types {
          name
          count
        }
        tags {
          name
          count
        }
        priceRanges {
          name
          count
        }
        categories {
          name
          count
        }
      }
      pageInfo {
        currentPage
        pageSize
        totalItems
        totalPages
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;
