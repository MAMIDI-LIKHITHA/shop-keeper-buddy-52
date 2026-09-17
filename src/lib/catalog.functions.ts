import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const imagePathsSchema = z.object({ paths: z.array(z.string().trim().max(500)).max(100) });

export const resolveProductImageUrls = createServerFn({ method: "POST" })
  .inputValidator((input) => imagePathsSchema.parse(input))
  .handler(async ({ data }) => {
    const paths = data.paths.filter((path) => path.length > 0 && !path.startsWith("http"));
    if (paths.length === 0) return {} as Record<string, string>;

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: signed, error } = await supabaseAdmin.storage
      .from("product-images")
      .createSignedUrls(paths, 60 * 60);

    if (error) throw new Error("Unable to load product images");
    return Object.fromEntries(
      signed.flatMap((item, index) => item.signedUrl ? [[paths[index] ?? "", item.signedUrl] as const] : []),
    );
  });