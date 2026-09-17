import { Link } from "@tanstack/react-router";
import { ArrowRight, Instagram, Mail, MapPin, Phone, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/products/product-card";
import { supabase } from "@/integrations/supabase/client";
import type { BusinessSettings, Product } from "@/lib/catalog";
import { resolveProductImageUrls } from "@/lib/catalog.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Your Business — Curated Products" },
      { name: "description", content: "Discover a considered collection from Your Business." },
      { property: "og:title", content: "Your Business — Curated Products" },
      { property: "og:description", content: "Discover a considered collection from Your Business." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    const load = async () => {
      const [{ data: productsData }, { data: settingsData }] = await Promise.all([
        supabase.from("products").select("*").eq("available", true).eq("featured", true).order("sort_order"),
        supabase.from("business_settings").select("*").eq("id", "default").maybeSingle(),
      ]);
      const nextProducts = productsData ?? [];
      setProducts(nextProducts);
      setSettings(settingsData);
      const paths = [...nextProducts.map((product) => product.image_url ?? ""), settingsData?.logo_url ?? ""].filter(Boolean);
      if (paths.length) setImageUrls(await resolveProductImageUrls({ data: { paths } }));
    };
    void load();
    const channel = supabase.channel("home-catalog").on("postgres_changes", { event: "*", schema: "public", table: "products" }, load).on("postgres_changes", { event: "*", schema: "public", table: "business_settings" }, load).subscribe();
    return () => { void supabase.removeChannel(channel); };
  }, []);

  const business = settings?.business_name || "Your Business";

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="relative overflow-hidden border-b border-border bg-secondary/50">
        <div className="mx-auto max-w-7xl px-6 pb-20 pt-6 lg:px-10 lg:pb-28">
          <header className="flex items-center justify-between">
            <Link to="/" className="font-display text-xl font-semibold tracking-tight">{business}</Link>
            <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
              <Link to="/products" className="transition-colors hover:text-foreground">Collection</Link>
              <a href="#about" className="transition-colors hover:text-foreground">About</a>
              <a href="#contact" className="transition-colors hover:text-foreground">Contact</a>
            </nav>
            <Button asChild className="hidden md:inline-flex"><Link to="/products">Explore collection <ArrowRight size={16} /></Link></Button>
          </header>
          <div className="grid items-end gap-12 pt-24 lg:grid-cols-[1.05fr_.95fr] lg:pt-32">
            <div className="max-w-2xl">
              <p className="mb-6 text-xs font-semibold uppercase tracking-[0.25em] text-primary">Thoughtfully selected</p>
              <h1 className="font-display text-6xl font-semibold leading-[0.95] tracking-[-0.03em] sm:text-8xl">Objects with a point of view.</h1>
              <p className="mt-8 max-w-lg text-lg leading-8 text-muted-foreground">{settings?.business_description || "A considered collection of pieces chosen for the way they make everyday life feel."}</p>
              <div className="mt-10 flex flex-wrap gap-3"><Button asChild size="lg"><Link to="/products">View products <ArrowRight size={17} /></Link></Button><a href="#about" className="inline-flex min-h-11 items-center px-4 text-sm font-semibold text-muted-foreground hover:text-foreground">Our story</a></div>
            </div>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-muted lg:ml-auto lg:w-[min(100%,34rem)]">
              <img src={imageUrls[products[0]?.image_url ?? ""] || "/images/product-placeholder.svg"} alt="Featured product" className="h-full w-full object-cover" />
              <div className="absolute bottom-5 left-5 rounded-full bg-background/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em]">New perspective</div>
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
        <div className="flex items-end justify-between gap-6"><div><p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">The edit</p><h2 className="mt-4 font-display text-4xl font-semibold tracking-tight sm:text-5xl">Featured products</h2></div><Link to="/products" className="hidden items-center gap-2 text-sm font-semibold md:flex">View all <ArrowRight size={16} /></Link></div>
        <div className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">{products.length ? products.slice(0, 3).map((product) => <ProductCard key={product.id} product={product} imageUrl={imageUrls[product.image_url ?? ""]} whatsappNumber={settings?.whatsapp_number ?? ""} />) : <p className="text-muted-foreground">Our featured collection is being prepared.</p>}</div>
      </section>
      <section id="about" className="border-y border-border bg-accent/30"><div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[.8fr_1.2fr] lg:px-10 lg:py-28"><div><p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">The philosophy</p><h2 className="mt-4 font-display text-4xl font-semibold tracking-tight">Less, but better.</h2></div><p className="max-w-2xl text-2xl leading-relaxed text-muted-foreground">{settings?.business_description || "We believe the best things earn their place. Every item in our collection is selected with care, made to be used, and chosen to stay with you."}</p></div></section>
      <footer id="contact" className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-[1fr_auto] lg:px-10"><div><p className="font-display text-2xl font-semibold">{business}</p><p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">{settings?.service_areas || "Serving Qatar and Dubai."}</p></div><div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2"><a href={settings?.phone_number ? `tel:${settings.phone_number}` : "#"} className="flex items-center gap-2 hover:text-foreground"><Phone size={15} /> {settings?.phone_number || "Phone coming soon"}</a><a href={settings?.email ? `mailto:${settings.email}` : "#"} className="flex items-center gap-2 hover:text-foreground"><Mail size={15} /> {settings?.email || "Email coming soon"}</a><span className="flex items-center gap-2"><MapPin size={15} /> {settings?.service_areas || "Qatar / Dubai"}</span><a href={settings?.instagram_url || "#"} className="flex items-center gap-2 hover:text-foreground"><Instagram size={15} /> Instagram</a></div></footer>
    </main>
  );
}