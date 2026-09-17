import type { Tables } from "@/integrations/supabase/types";

export type Product = Tables<"products">;
export type BusinessSettings = Tables<"business_settings">;

export const categories = ["Collection A", "Collection B", "Collection C", "General"];

export const placeholderImage = "/images/product-placeholder.svg";

export const formatPrice = (price: number) => `QAR ${price.toFixed(2)}`;

export const whatsappHref = (number: string, productName: string) => {
  const digits = number.replace(/[^\d]/g, "");
  return digits ? `https://wa.me/${digits}?text=${encodeURIComponent(`Hi, I'm interested in ${productName}.`)}` : "#contact";
};