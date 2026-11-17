import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useRegister } from "./useRegister";

const state = vi.hoisted(() => ({
  registerPerson: vi.fn(),
  registerBusiness: vi.fn(),
  toastError: vi.fn(),
  replace: vi.fn(),
  termsVersion: 3 as number | null,
}));

vi.mock("next/navigation", () => ({ useParams: () => ({ lang: "es" }) }));
vi.mock("@/hooks/useNavigation", () => ({
  useNavigation: () => ({ replace: state.replace }),
}));
vi.mock("@/hooks/useToast", () => ({
  useToast: () => ({ error: state.toastError, success: vi.fn() }),
}));
vi.mock("@/i18n/context", () => ({ useTranslation: () => ({ t: (k: string) => k }) }));
vi.mock("@apollo/client/react", () => ({
  useQuery: () => ({
    data: { currentTerms: state.termsVersion ? { version: state.termsVersion } : null },
  }),
  useMutation: (doc: { definitions: { name?: { value: string } }[] }) => [
    doc.definitions[0]?.name?.value === "RegisterBusiness"
      ? state.registerBusiness
      : state.registerPerson,
    { loading: false },
  ],
}));

function fill(result: { current: ReturnType<typeof useRegister> }) {
  act(() => {
    result.current.setFirstName("Ana");
    result.current.setLastName("Pérez");
    result.current.setEmail("ana@example.com");
    result.current.setPassword("password123");
    result.current.setConfirmPassword("password123");
  });
}

describe("useRegister: terms (LEG-1)", () => {
  beforeEach(() => {
    state.registerPerson.mockReset().mockResolvedValue({});
    state.registerBusiness.mockReset().mockResolvedValue({});
    state.toastError.mockReset();
    state.termsVersion = 3;
  });

  it("doesn't sign up without the terms ticked", async () => {
    const { result } = renderHook(() => useRegister());
    fill(result);
    await act(async () => {
      expect(await result.current.handleRegister()).toBe(false);
    });
    expect(state.registerPerson).not.toHaveBeenCalled();
    expect(state.toastError).toHaveBeenCalledWith("feedback.termsRequired");
  });

  it("sends the version in force with the sign-up", async () => {
    const { result } = renderHook(() => useRegister());
    fill(result);
    act(() => result.current.setTermsAccepted(true));
    await act(async () => {
      await result.current.handleRegister();
    });
    expect(state.registerPerson).toHaveBeenCalledWith({
      variables: {
        input: expect.objectContaining({
          email: "ana@example.com",
          acceptedTermsVersion: 3,
        }) as unknown,
        language: "ES",
      },
    });
  });

  it("sends a business's version too", async () => {
    const { result } = renderHook(() => useRegister());
    fill(result);
    act(() => {
      result.current.handleSellerType("COMPANY");
      result.current.setBusinessName("Tienda");
      result.current.setTermsAccepted(true);
    });
    await act(async () => {
      await result.current.handleRegister();
    });
    expect(state.registerBusiness).toHaveBeenCalledWith({
      variables: {
        input: expect.objectContaining({ acceptedTermsVersion: 3 }) as unknown,
        language: "ES",
      },
    });
  });
});
