type FilterableRate = {
  status: "pending" | "verified" | "rejected" | "expired";
};

type FilterableProduct = {
  bank: { slug: string };
  variants: Array<{
    minTermMonth: number | null;
    rates: FilterableRate[];
  }>;
};

export function filterCompareProducts<T extends FilterableProduct>({
  products,
  bank,
  term,
  status
}: {
  products: T[];
  bank?: string;
  term?: string;
  status?: string;
}) {
  return products.filter((product) => {
    const bankPass = !bank || product.bank.slug === bank;
    const termPass =
      !term ||
      product.variants.some((variant) => String(variant.minTermMonth ?? "") === term);
    const statusPass =
      !status ||
      product.variants.some((variant) => variant.rates.some((rate) => rate.status === status));

    return bankPass && termPass && statusPass;
  });
}
