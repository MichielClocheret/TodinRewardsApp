import { Wallet } from "@/app/API/wallet";

export const parseNumericValue = (
  value: string | number | null | undefined,
) => {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  const sanitizedValue = value.trim().replace(/\s+/g, "");

  if (!sanitizedValue) {
    return null;
  }

  const lastComma = sanitizedValue.lastIndexOf(",");
  const lastDot = sanitizedValue.lastIndexOf(".");
  const decimalSeparatorIndex = Math.max(lastComma, lastDot);

  if (decimalSeparatorIndex === -1) {
    const integerOnly = sanitizedValue.replace(/[^0-9-]/g, "");
    const parsedInteger = Number(integerOnly);
    return Number.isFinite(parsedInteger) ? parsedInteger : null;
  }

  const integerPart = sanitizedValue
    .slice(0, decimalSeparatorIndex)
    .replace(/[^0-9-]/g, "");
  const decimalPart = sanitizedValue
    .slice(decimalSeparatorIndex + 1)
    .replace(/[^0-9]/g, "");
  const normalizedValue = `${integerPart}.${decimalPart}`;
  const parsedValue = Number(normalizedValue);

  return Number.isFinite(parsedValue) ? parsedValue : null;
};

export const formatNumber = (
  value: string | number | null | undefined,
  minimumFractionDigits: number,
  maximumFractionDigits: number,
) => {
  const parsedValue = parseNumericValue(value);

  if (parsedValue === null) {
    return "0,00";
  }

  return new Intl.NumberFormat("nl-BE", {
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(parsedValue);
};

export const sortWallets = (wallets: Wallet[]) =>
  [...wallets].sort((a, b) => {
    if (a.is_preferred !== b.is_preferred) {
      return a.is_preferred ? -1 : 1;
    }

    const aValue = parseNumericValue(a.value) ?? Number.NEGATIVE_INFINITY;
    const bValue = parseNumericValue(b.value) ?? Number.NEGATIVE_INFINITY;

    if (aValue !== bValue) {
      return bValue - aValue;
    }

    return a.asset_name.localeCompare(b.asset_name);
  });
