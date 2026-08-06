"use client";
import { Button } from "@/components/Primitives/Button";
import { Input } from "@/components/Primitives/Inputs";
import { Select } from "@/components/Primitives/Select";
import { TextArea } from "@/components/Primitives/TextArea";
import { useTranslation } from "@/i18n/context";
import { Building2, Globe2, MapPin, Phone, Save, Tags, UserRound } from "lucide-react";
import { useEditProfile } from "../hooks/useEditProfile";
import { NAMESPACE } from "../i18n";
import { BusinessLocations } from "./BusinessLocations";
import { SectionCard } from "./SectionCard";
import { TagSelector } from "./TagSelector";

export function EditProfileForm() {
  const { t } = useTranslation(NAMESPACE);
  const {
    isBusiness,
    form,
    setField,
    businessTags,
    tagsLoading,
    toggleTag,
    maxTags,
    countries,
    regions,
    cities,
    counties,
    phoneCodes,
    setCountry,
    setRegion,
    setCity,
    setCounty,
    loading,
    handleSave,
  } = useEditProfile();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSave();
  };

  return (
    <form onSubmit={onSubmit} className="flex w-full flex-col gap-5">
      {/* Personal / business identity */}
      <SectionCard
        icon={isBusiness ? Building2 : UserRound}
        title={t("editProfile.personal.title")}
        subtitle={t("editProfile.personal.subtitle")}
      >
        <div className="flex flex-col gap-5">
          {isBusiness ? (
            <>
              <Input
                label={t("editProfile.personal.businessName")}
                placeholder={t("editProfile.personal.businessNamePlaceholder")}
                value={form.businessName}
                onChangeText={(v) => setField("businessName", v)}
              />
              <TextArea
                label={t("editProfile.personal.description")}
                placeholder={t("editProfile.personal.descriptionPlaceholder")}
                value={form.description}
                onChangeText={(v) => setField("description", v)}
                rows={4}
                maxLength={500}
              />
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Input
                  label={t("editProfile.personal.firstName")}
                  placeholder={t("editProfile.personal.firstNamePlaceholder")}
                  value={form.firstName}
                  onChangeText={(v) => setField("firstName", v)}
                />
                <Input
                  label={t("editProfile.personal.lastName")}
                  placeholder={t("editProfile.personal.lastNamePlaceholder")}
                  value={form.lastName}
                  onChangeText={(v) => setField("lastName", v)}
                />
              </div>
              <Input
                label={t("editProfile.personal.displayName")}
                placeholder={t("editProfile.personal.displayNamePlaceholder")}
                value={form.displayName}
                onChangeText={(v) => setField("displayName", v)}
              />
              <TextArea
                label={t("editProfile.personal.bio")}
                placeholder={t("editProfile.personal.bioPlaceholder")}
                value={form.bio}
                onChangeText={(v) => setField("bio", v)}
                rows={4}
                maxLength={300}
              />
            </>
          )}
        </div>
      </SectionCard>

      {/* Business tags — only businesses describe themselves with eco tags */}
      {isBusiness && (
        <SectionCard
          icon={Tags}
          title={t("editProfile.tags.title")}
          subtitle={t("editProfile.tags.subtitle")}
          headerRight={
            <span className="shrink-0 rounded-full bg-primary-light/20 px-2.5 py-1 text-xs font-semibold text-primary">
              {form.tags.length}/{maxTags}
            </span>
          }
        >
          <TagSelector
            options={businessTags}
            selected={form.tags}
            onToggle={toggleTag}
            max={maxTags}
            loading={tagsLoading}
            getLabel={(tag) => tag.label ?? t(`editProfile.tags.options.${tag.id}`)}
          />
        </SectionCard>
      )}

      {/* Contact */}
      <SectionCard
        icon={Phone}
        title={t("editProfile.contact.title")}
        subtitle={t("editProfile.contact.subtitle")}
      >
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[160px_1fr]">
            <Select
              label={t("editProfile.contact.areaCode")}
              value={form.phoneDial}
              onChange={(v) => setField("phoneDial", String(v))}
              options={phoneCodes.map((c) => ({
                value: c.dial,
                label: `${c.flag} +${c.dial}`,
              }))}
              placeholder="+"
              size="md"
            />
            <Input
              label={t("editProfile.contact.phone")}
              placeholder={t("editProfile.contact.phonePlaceholder")}
              value={form.phoneLocal}
              onChangeText={(v) => setField("phoneLocal", v.replace(/[^\d\s]/g, ""))}
              leftIcon={Phone}
              type="text"
            />
          </div>
          <Input
            label={t("editProfile.contact.website")}
            placeholder={t("editProfile.contact.websitePlaceholder")}
            value={form.website}
            onChangeText={(v) => setField("website", v)}
            leftIcon={Globe2}
          />
        </div>
      </SectionCard>

      {/* Location */}
      <SectionCard
        icon={MapPin}
        title={t("editProfile.location.title")}
        subtitle={t("editProfile.location.subtitle")}
      >
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Select
              label={t("editProfile.location.country")}
              placeholder={t("editProfile.location.countryPlaceholder")}
              value={form.countryId ?? ""}
              onChange={(v) => setCountry(Number(v))}
              options={countries.map((c) => ({ value: c.id, label: c.country }))}
            />
            <Select
              label={t("editProfile.location.region")}
              placeholder={t("editProfile.location.regionPlaceholder")}
              value={form.regionId ?? ""}
              onChange={(v) => setRegion(Number(v))}
              options={regions.map((r) => ({ value: r.id, label: r.region }))}
              disabled={form.countryId === null}
            />
            <Select
              label={t("editProfile.location.city")}
              placeholder={t("editProfile.location.cityPlaceholder")}
              value={form.cityId ?? ""}
              onChange={(v) => setCity(Number(v))}
              options={cities.map((c) => ({ value: c.id, label: c.city }))}
              disabled={form.regionId === null}
            />
            <Select
              label={t("editProfile.location.county")}
              placeholder={t("editProfile.location.countyPlaceholder")}
              value={form.countyId ?? ""}
              onChange={(v) => setCounty(Number(v))}
              options={counties.map((c) => ({ value: c.id, label: c.county }))}
              disabled={form.cityId === null}
            />
          </div>
          <Input
            label={t("editProfile.location.address")}
            placeholder={t("editProfile.location.addressPlaceholder")}
            value={form.address}
            onChangeText={(v) => setField("address", v)}
            leftIcon={MapPin}
          />
        </div>
      </SectionCard>

      {/* Business locations — additional branches/warehouses (business only).
          The single address above stays the primary contact address. */}
      {isBusiness && <BusinessLocations />}

      <div className="w-full max-w-6xl mt-12 mx-auto">
        <Button
          text={loading ? t("editProfile.actions.saving") : t("editProfile.actions.save")}
          leftIcon={Save}
          loading={loading}
          type="submit"
          size="md"
          fullWidth
        />
      </div>
    </form>
  );
}
