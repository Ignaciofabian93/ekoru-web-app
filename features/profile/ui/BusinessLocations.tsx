"use client";
import { Button } from "@/components/Primitives/Button";
import { Input } from "@/components/Primitives/Inputs";
import { Select } from "@/components/Primitives/Select";
import { useTranslation } from "@/i18n/context";
import { Building2, MapPin, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { useBusinessAddresses } from "../hooks/useBusinessAddresses";
import { NAMESPACE } from "../i18n";
import { SectionCard } from "@/components/Patterns/SectionCard";

export function BusinessLocations() {
  const { t } = useTranslation(NAMESPACE);
  const {
    addresses,
    editing,
    startAdd,
    startEdit,
    cancel,
    setField,
    countries,
    regions,
    cities,
    counties,
    setCountry,
    setRegion,
    setCity,
    setCounty,
    save,
    remove,
    setPrimary,
    saving,
  } = useBusinessAddresses();

  return (
    <SectionCard
      icon={Building2}
      title={t("editProfile.locations.title")}
      subtitle={t("editProfile.locations.subtitle")}
      headerRight={
        editing ? undefined : (
          <Button
            text={t("editProfile.locations.add")}
            leftIcon={Plus}
            variant="outline"
            size="sm"
            onClick={startAdd}
          />
        )
      }
    >
      {!editing ? (
        addresses.length === 0 ? (
          <p className="text-sm text-foreground-secondary">
            {t("editProfile.locations.empty")}
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {addresses.map((a) => (
              <li
                key={a.id}
                className="flex items-start justify-between gap-3 rounded-xl border border-border-light p-4"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">
                      {a.label || a.address}
                    </span>
                    {a.isPrimary && (
                      <span className="rounded-full bg-primary-light/20 px-2 py-0.5 text-xs font-semibold text-primary">
                        {t("editProfile.locations.primary")}
                      </span>
                    )}
                  </div>
                  {a.label && (
                    <p className="truncate text-sm text-foreground-secondary">
                      {a.address}
                    </p>
                  )}
                  <p className="text-xs text-foreground-tertiary">
                    {[a.county?.county, a.city?.city, a.region?.region, a.country?.country]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  {!a.isPrimary && (
                    <button
                      type="button"
                      onClick={() => setPrimary(a.id)}
                      title={t("editProfile.locations.setPrimary")}
                      className="rounded-lg p-2 text-foreground-tertiary hover:bg-surface-hover hover:text-primary"
                    >
                      <Star size={16} />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => startEdit(a)}
                    title={t("editProfile.locations.edit")}
                    className="rounded-lg p-2 text-foreground-tertiary hover:bg-surface-hover hover:text-foreground"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(a.id)}
                    title={t("editProfile.locations.delete")}
                    className="rounded-lg p-2 text-foreground-tertiary hover:bg-danger/10 hover:text-danger"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )
      ) : (
        <div className="flex flex-col gap-5">
          <Input
            label={t("editProfile.locations.label")}
            placeholder={t("editProfile.locations.labelPlaceholder")}
            value={editing.label}
            onChangeText={(v) => setField("label", v)}
          />
          <Input
            label={t("editProfile.location.address")}
            placeholder={t("editProfile.location.addressPlaceholder")}
            value={editing.address}
            onChangeText={(v) => setField("address", v)}
            leftIcon={MapPin}
          />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Select
              label={t("editProfile.location.country")}
              placeholder={t("editProfile.location.countryPlaceholder")}
              value={editing.countryId ?? ""}
              onChange={(v) => setCountry(Number(v))}
              options={countries.map((c) => ({ value: c.id, label: c.country }))}
            />
            <Select
              label={t("editProfile.location.region")}
              placeholder={t("editProfile.location.regionPlaceholder")}
              value={editing.regionId ?? ""}
              onChange={(v) => setRegion(Number(v))}
              options={regions.map((r) => ({ value: r.id, label: r.region }))}
              disabled={editing.countryId === null}
            />
            <Select
              label={t("editProfile.location.city")}
              placeholder={t("editProfile.location.cityPlaceholder")}
              value={editing.cityId ?? ""}
              onChange={(v) => setCity(Number(v))}
              options={cities.map((c) => ({ value: c.id, label: c.city }))}
              disabled={editing.regionId === null}
            />
            <Select
              label={t("editProfile.location.county")}
              placeholder={t("editProfile.location.countyPlaceholder")}
              value={editing.countyId ?? ""}
              onChange={(v) => setCounty(Number(v))}
              options={counties.map((c) => ({ value: c.id, label: c.county }))}
              disabled={editing.cityId === null}
            />
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Input
              label={t("editProfile.locations.zipCode")}
              placeholder={t("editProfile.locations.zipCodePlaceholder")}
              value={editing.zipCode}
              onChangeText={(v) => setField("zipCode", v)}
            />
            <Input
              label={t("editProfile.locations.phone")}
              placeholder={t("editProfile.locations.phonePlaceholder")}
              value={editing.phone}
              onChangeText={(v) => setField("phone", v)}
            />
          </div>
          <Input
            label={t("editProfile.locations.reference")}
            placeholder={t("editProfile.locations.referencePlaceholder")}
            value={editing.reference}
            onChangeText={(v) => setField("reference", v)}
          />
          <label className="flex items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={editing.isPrimary}
              onChange={(e) => setField("isPrimary", e.target.checked)}
              className="h-4 w-4 rounded border-border"
            />
            {t("editProfile.locations.makePrimary")}
          </label>
          <div className="flex gap-3">
            <Button
              text={t("editProfile.locations.save")}
              onClick={save}
              loading={saving}
              size="md"
            />
            <Button
              text={t("editProfile.locations.cancel")}
              onClick={cancel}
              variant="outline"
              size="md"
            />
          </div>
        </div>
      )}
    </SectionCard>
  );
}
