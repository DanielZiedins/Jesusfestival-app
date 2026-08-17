"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { track } from "@vercel/analytics";
import ScreenHeader from "@/components/ScreenHeader";
import Reveal, { Eyebrow } from "@/components/Reveal";
import { fetchShop, SHOP_JF_COLLECTION_URL, SHOP_URL, type ShopData, type ShopProduct } from "@/lib/shop";
import { ArrowRight, Check, Heart, Share, Sparkle } from "@/components/icons";

function recordShop(name: string, properties: Record<string, string | number> = {}) {
  try {
    track(name, { source: "jesusfestival.app", ...properties });
  } catch {
    // The Shopify handoff must work even when analytics is unavailable.
  }
}

export default function ShopScreen({ initialData }: { initialData?: ShopData }) {
  const [data, setData] = useState<ShopData | null | undefined>(initialData);
  const [reloadKey, setReloadKey] = useState(0);
  const [shareState, setShareState] = useState<"idle" | "done" | "error">("idle");

  useEffect(() => {
    recordShop("festival_shop_viewed");
  }, []);

  useEffect(() => {
    if (initialData && reloadKey === 0) return;
    const controller = new AbortController();
    fetchShop(controller.signal)
      .then(setData)
      .catch((error: unknown) => {
        if (!(error instanceof DOMException && error.name === "AbortError")) setData(null);
      });
    return () => controller.abort();
  }, [initialData, reloadKey]);

  const shareCollection = async () => {
    const shareData = {
      title: "Jesus Festival Shop",
      text: "Wear the message — explore the official Jesus Festival collection.",
      url: SHOP_JF_COLLECTION_URL,
    };
    try {
      if (navigator.share) await navigator.share(shareData);
      else await navigator.clipboard.writeText(SHOP_JF_COLLECTION_URL);
      setShareState("done");
      recordShop("festival_shop_shared");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setShareState("error");
    }
  };

  const featuredProduct = data?.festival[0];
  const collectionProducts = data?.festival.slice(1) ?? [];

  return (
    <div className="px-4 pb-6">
      <ScreenHeader
        eyebrow="Wear the message"
        title="Festival Shop"
        subtitle="Official Jesus Festival apparel from our Kingdom Shop — every order helps fuel the mission."
        icon={<Sparkle width={22} height={22} />}
      />

      <div className="mx-auto -mt-2 mb-5 grid max-w-md grid-cols-3 gap-2" aria-label="Shop information">
        <ShopFact value="Live" label="Inventory" />
        <ShopFact value="CAD" label="Pricing" />
        <ShopFact value="Secure" label="Checkout" />
      </div>

      {data === undefined ? (
        <div className="mx-auto grid max-w-md grid-cols-2 gap-3" role="status" aria-label="Loading the Festival Shop">
          {[0, 1, 2, 3].map((index) => (
            <div key={index} className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <div className="aspect-square animate-pulse rounded-xl bg-white/10" />
              <div className="mt-3 h-3.5 w-3/4 animate-pulse rounded bg-white/10" />
              <div className="mt-2 h-3 w-1/3 animate-pulse rounded bg-white/10" />
            </div>
          ))}
          <span className="sr-only">Loading live products from ThyKingdom.Shop</span>
        </div>
      ) : data === null ? (
        <div className="mx-auto max-w-md rounded-3xl border border-white/10 bg-white/[0.04] px-5 py-8 text-center" role="alert">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-gold/10 text-gold-400">
            <Sparkle width={22} height={22} />
          </div>
          <h2 className="mt-4 font-display text-xl font-bold text-white">The shop is taking a moment</h2>
          <p className="mt-2 text-sm leading-relaxed text-white/60">
            We couldn&apos;t refresh the in-app shelf, but the full collection is still available securely on Shopify.
          </p>
          <div className="mt-5 grid grid-cols-2 gap-2.5">
            <button
              onClick={() => {
                setData(undefined);
                setReloadKey((key) => key + 1);
              }}
              className="rounded-xl bg-white/10 px-4 py-3 text-sm font-bold text-white transition active:scale-95"
            >
              Try again
            </button>
            <a
              href={SHOP_JF_COLLECTION_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => recordShop("festival_collection_opened", { location: "recovery" })}
              className="rounded-xl border border-gold/40 bg-gold/10 px-4 py-3 text-sm font-bold text-gold-400 transition active:scale-95"
            >
              Open shop ↗
            </a>
          </div>
        </div>
      ) : (
        <>
          {featuredProduct && (
            <section className="mx-auto max-w-md" aria-labelledby="festival-collection-heading">
              <Reveal className="mb-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2 text-gold-400">
                    <Sparkle width={17} height={17} className="shrink-0" />
                    <h2 id="festival-collection-heading" className="truncate font-display text-lg font-bold text-white">
                      Jesus Festival Collection
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={shareCollection}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-bold text-white/70 transition hover:bg-white/10 active:scale-95"
                    aria-label="Share the Jesus Festival collection"
                  >
                    {shareState === "done" ? <Check width={13} height={13} /> : <Share width={13} height={13} />}
                    {shareState === "done" ? "Shared" : shareState === "error" ? "Copy failed" : "Share"}
                  </button>
                </div>
              </Reveal>

              <Reveal>
                <ProductCard product={featuredProduct} featured priority />
              </Reveal>

              {collectionProducts.length > 0 && (
                <div className="mt-3 grid grid-cols-2 gap-3">
                  {collectionProducts.map((product, index) => (
                    <Reveal key={product.id} delay={Math.min(index * 0.06, 0.24)}>
                      <ProductCard product={product} />
                    </Reveal>
                  ))}
                </div>
              )}

              <Reveal delay={0.15}>
                <a
                  href={SHOP_JF_COLLECTION_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => recordShop("festival_collection_opened", { location: "collection" })}
                  className="mt-3 flex items-center justify-center gap-1.5 rounded-xl border border-gold/40 bg-gold/10 py-3 text-sm font-bold text-gold-400 transition hover:bg-gold/15 active:scale-[0.98]"
                >
                  Explore every size &amp; colour <ArrowRight width={15} height={15} />
                </a>
              </Reveal>
              <p className="mt-2 text-center text-[10.5px] text-white/55">Live availability · secure checkout handled by Shopify</p>
            </section>
          )}

          {data.fresh.length > 0 && (
            <section className="mx-auto mt-10 max-w-md" aria-labelledby="new-drops-heading">
              <Reveal className="mb-3 text-center">
                <Eyebrow>Fresh from the Kingdom Shop</Eyebrow>
                <h2 id="new-drops-heading" className="sr-only">New drops from ThyKingdom.Shop</h2>
                <p className="mx-auto mt-2 max-w-xs text-[13px] text-white/55">
                  More bold designs made to start Kingdom conversations.
                </p>
              </Reveal>
              <div className="grid grid-cols-2 gap-3">
                {data.fresh.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(index * 0.04, 0.35) }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          <section className="mx-auto mt-10 max-w-md">
            <Reveal>
              <div className="relative overflow-hidden rounded-3xl border border-gold/25 bg-gradient-to-br from-gold/10 via-purple-900/15 to-transparent p-5">
                <div className="pointer-events-none absolute -right-12 -top-16 h-40 w-40 rounded-full bg-gold/10 blur-3xl" />
                <div className="relative flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-gold-400">
                  <Heart width={14} height={14} /> More than merch
                </div>
                <p className="relative mt-2.5 text-[14px] leading-relaxed text-white/75">
                  Every piece is designed to open a conversation — and every order sows back into the Kingdom work behind this festival.
                  Wear it, and be ready when someone asks.
                </p>
                <a
                  href={`${SHOP_URL}?utm_source=jesusfestival.app&utm_medium=app&utm_campaign=festival_shop`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => recordShop("kingdom_shop_opened", { location: "shop_footer" })}
                  className="relative mt-4 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gold-400 to-gold-600 py-3 font-display text-sm font-bold text-navy-950 shadow-glow transition hover:brightness-105 active:scale-[0.98]"
                >
                  Browse the full Kingdom Shop <ArrowRight width={15} height={15} />
                </a>
                <p className="relative mt-2.5 text-center text-[11px] text-white/55">
                  Prices in CAD · secure Shopify checkout · opens in a new tab
                </p>
              </div>
            </Reveal>
          </section>
        </>
      )}
    </div>
  );
}

function ShopFact({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.035] px-2 py-2.5 text-center">
      <span className="block font-display text-[11px] font-extrabold uppercase tracking-[0.08em] text-gold-400">{value}</span>
      <span className="mt-0.5 block text-[9.5px] text-white/55">{label}</span>
    </div>
  );
}

function ProductCard({ product, featured = false, priority = false }: { product: ShopProduct; featured?: boolean; priority?: boolean }) {
  const badge = !product.available ? "Sold out" : product.onSale ? "Sale" : product.isNew ? "New" : null;
  const detail = [
    product.colorCount > 1 ? `${product.colorCount} colours` : null,
    product.availableVariants > 1 ? `${product.availableVariants} options` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <a
      href={product.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => recordShop("shop_product_opened", { product: product.title, featured: featured ? 1 : 0 })}
      aria-label={`${product.title}, ${product.price}${product.priceVaries ? " and up" : ""}. Opens on ThyKingdom.Shop.`}
      className={`group block h-full overflow-hidden rounded-2xl border transition duration-300 hover:-translate-y-0.5 hover:border-gold/50 active:scale-[0.99] ${
        featured
          ? "border-gold/40 bg-gradient-to-br from-gold/10 to-transparent shadow-[0_18px_60px_rgba(212,175,55,0.08)]"
          : "border-white/10 bg-white/[0.04]"
      }`}
    >
      <div className={`relative overflow-hidden bg-white/5 ${featured ? "aspect-[4/3]" : "aspect-square"}`}>
        {product.image && (
          <Image
            src={product.image}
            alt={product.imageAlt}
            fill
            priority={priority}
            sizes={featured ? "(max-width: 512px) calc(100vw - 32px), 480px" : "(max-width: 512px) calc(50vw - 22px), 230px"}
            className="object-cover transition duration-500 group-hover:scale-[1.035]"
          />
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/35 to-transparent" />
        {badge && (
          <span className={`absolute left-2.5 top-2.5 rounded-full px-2.5 py-1 text-[9.5px] font-extrabold uppercase tracking-[0.12em] backdrop-blur ${
            product.available ? "bg-gold-400 text-navy-950" : "bg-ink/80 text-white/70"
          }`}>
            {badge}
          </span>
        )}
      </div>
      <div className={featured ? "p-4" : "p-3"}>
        <h3 className={`font-display font-bold leading-snug text-white ${featured ? "text-[17px]" : "line-clamp-2 text-[13px]"}`}>
          {product.title}
        </h3>
        <div className="mt-1.5 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <span className={`font-display font-extrabold text-gold-400 ${featured ? "text-[18px]" : "text-[14px]"}`}>
            {product.priceVaries ? "From " : ""}{product.price}
          </span>
          {product.compareAt && <span className="text-[11.5px] text-white/55 line-through">{product.compareAt}</span>}
          <span className="text-[9.5px] font-semibold text-white/50">CAD</span>
        </div>
        {detail && <p className="mt-1 text-[10.5px] text-white/55">{detail}</p>}
        <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-gold-400/90">
          {product.available ? "Choose your options" : "View product"} <ArrowRight width={11} height={11} />
        </span>
      </div>
    </a>
  );
}
