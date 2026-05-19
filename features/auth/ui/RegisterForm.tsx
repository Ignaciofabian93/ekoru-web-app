"use client";
import MainButton from "@/components/Button/MainButton";
import Input from "@/components/Input/Input";
import Select from "@/components/Select/Select";
import { useTranslation } from "@/i18n/context";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

const SELLER_TYPE_OPTIONS = [
  { label: "Persona", value: "PERSON" },
  { label: "Startup", value: "STARTUP" },
  { label: "Empresa", value: "COMPANY" },
];

export function RegisterForm() {
  const { t } = useTranslation("auth");
  const [sellerType, setSellerType] = useState("PERSON");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError(t("passwordMismatch"));
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Select
        label="Tipo de cuenta"
        value={sellerType}
        onChange={(v) => setSellerType(String(v))}
        options={SELLER_TYPE_OPTIONS}
        searchEnabled={false}
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          name="firstName"
          label={t("firstName")}
          placeholder="Nombre"
          value={firstName}
          onChangeText={(e) => setFirstName(e)}
          autoComplete="given-name"
          required
        />
        <Input
          name="lastName"
          label={t("lastName")}
          placeholder="Apellido"
          value={lastName}
          onChangeText={(e) => setLastName(e)}
          autoComplete="family-name"
          required
        />
      </div>
      <Input
        name="email"
        label={t("email")}
        placeholder="you@example.com"
        type="email"
        value={email}
        onChangeText={(e) => setEmail(e)}
        autoComplete="email"
        required
      />
      <Input
        name="password"
        label={t("password")}
        placeholder="••••••••"
        type="password"
        value={password}
        onChangeText={(e) => setPassword(e)}
        autoComplete="new-password"
        required
      />
      <Input
        name="confirmPassword"
        label={t("confirmPassword")}
        placeholder="••••••••"
        type="password"
        value={confirmPassword}
        onChangeText={(e) => setConfirmPassword(e)}
        hasError={!!error}
        errorMessage={error}
        autoComplete="new-password"
        required
      />
      <MainButton
        text={t("register")}
        type="submit"
        loading={loading}
        rightIcon={ArrowRight}
        fullWidth
        size="lg"
      />
    </form>
  );
}
