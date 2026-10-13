import { describe, expect, it } from "vitest";
import type { BusinessProfile, PersonProfile, Seller } from "@/types/user";
import { getSellerName, resolveSellerKind } from "./sellerDisplay";

const seller = (over: Partial<Seller>) =>
  ({ id: "s1", email: null, sellerType: "PERSON", ...over }) as Seller;
const person = (over: Partial<PersonProfile>) =>
  ({ __typename: "PersonProfile", id: "p1", firstName: "Ana", ...over }) as PersonProfile;
const business = (over: Partial<BusinessProfile>) =>
  ({
    __typename: "BusinessProfile",
    id: "b1",
    businessName: "Verde",
    ...over,
  }) as BusinessProfile;

describe("getSellerName", () => {
  it("prefers a person's display name, then their full name", () => {
    expect(getSellerName(seller({ profile: person({ displayName: "anita" }) }))).toBe(
      "anita",
    );
    expect(getSellerName(seller({ profile: person({ lastName: "Rojas" }) }))).toBe(
      "Ana Rojas",
    );
  });

  it("uses the business name for a business", () => {
    expect(getSellerName(seller({ profile: business({}) }))).toBe("Verde");
  });

  it("falls back to the email, or nothing when the API hides it (USR-10)", () => {
    expect(getSellerName(seller({ email: "ana@mail.cl" }))).toBe("ana@mail.cl");
    expect(getSellerName(seller({}))).toBe("");
  });
});

describe("resolveSellerKind", () => {
  it("treats startups and companies as businesses", () => {
    expect(resolveSellerKind("STARTUP")).toBe("business");
    expect(resolveSellerKind("COMPANY")).toBe("business");
  });

  it("treats people, and an unknown type, as marketplace sellers", () => {
    expect(resolveSellerKind("PERSON")).toBe("marketplace");
    expect(resolveSellerKind(undefined)).toBe("marketplace");
  });
});
