"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ScreenHeader from "@/components/ScreenHeader";
import Reveal, { Eyebrow } from "@/components/Reveal";
import { fetchShop, SHOP_JF_COLLECTION_URL, SHOP_URL, type ShopData, type ShopProduct } from "@/lib/shop";
import { ArrowRight, Heart, Sparkle } from "@/components/icons";

/**
 * The Jesus Festival Shop — live products from thykingdom.shop, fully branded
 * in-app. Tapping any product opens its page on the store, where Shopify
 * handles cart and checkout; the app never touches payment.
 */
export default function ShopScreen() {
  // undefined = loading · null = store unreachable
  const [data, setData] = useState<ShopData | null | undefined>(undefined);

  const load = () => {
    setData(undefined);
    fetchShop().then(setData);
  };
  useEffect(load, []);

  return (
    <div className="px-4 pb-6">
      <ScreenHeader
        eyebrow="Wear the message"
        title="Festival Shop"
        subtitle="Official Jesus Festival apparel from our Kingdom Shop — every order helps fuel the mission."
        icon={<Sparkle width={22} height={22} />}
      />

      {data === undefined ? (
        <div className="mx-auto grid max-w-md grid-cols-2 gap-3">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <div className="aspect-square animate-pulse rounded-xl bg-white/10" />
              <div className="mt-3 h-3.5 w-3/4 animate-pulse rounded bg-white/10" />
              <div className="mt-2 h-3 w-1/3 animate-pulse rounded bg-white/10" />
            </div>
          ))}
        </div>
      ) : data === null ? (
        <div className="mx-auto max-w-md py-8 text-center">
          <p className="text-sm text-white/60">Couldn&apos;t reach the shop — check your connection.</p>
          <div className="mt-4 flex justify-center gap-2.5">
            <button onClick={load} className="rounded-xl bg-white/10 px-5 py-2.5 text-sm font-bold text-white active:scale-95">
              Try again
            </button>
            <a
              href={SHOP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-gold/40 bg-gold/10 px-5 py-2.5 text-sm font-bold text-gold-400 active:scale-95"
            >
              Open ThyKingdom.Shop ↗
            </a>
          </div>
        </div>
      ) : (
        <>
          {/* Featured: the Jesus Festival collection */}
          {data.festival.length > 0 && (
            <section className="mx-auto max-w-md">
              <Reveal className="mb-3">
                <div className="flex items-center gap-2 text-gold-400">
                  <Sparkle width={17} height={17} />
                  <h2 className="font-display text-lg font-bold text-white">The Jesus Festival Collection</h2>
                </div>
              </Reveal>
              <div className="space-y-3">
                {data.festival.map((p, i) => (
                  <Reveal key={p.id} delay={Math.min(i * 0.06, 0.3)}>
                    <ProductCard p={p} featured />
                  </Reveal>
                ))}
              </div>
              <Reveal delay={0.15}>
                <a
                  href={SHOP_JF_COLLECTION_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 flex items-center justify-center gap-1.5 rounded-xl border border-gold/40 bg-gold/10 py-3 text-sm font-bold text-gold-400 active:scale-[0.98]"
                >
                  See the whole collection <ArrowRight width={15} height={15} />
                </a>
              </Reveal>
            </section>
          )}

          {/* Fresh from the wider Kingdom Shop */}
          {data.fresh.length > 0 && (
            <section className="mx-auto mt-10 max-w-md">
              <Reveal className="mb-3 text-center">
                <Eyebrow>Fresh from the Kingdom Shop</Eyebrow>
                <p className="mx-auto mt-2 max-w-xs text-[13px] text-white/55">
                  New drops from ThyKingdom.Shop — bold designs that start conversations.
                </p>
              </Reveal>
              <div className="grid grid-cols-2 gap-3">
                {data.fresh.map((p, i) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.04, 0.35) }}
                  >
                    <ProductCard p={p} />
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* Why it matters + full store CTA */}
          <section className="mx-auto mt-10 max-w-md">
            <Reveal>
              <div className="rounded-3xl border border-gold/25 bg-gradient-to-br from-gold/10 via-purple-900/15 to-transparent p-5">
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-gold-400">
                  <Heart width={14} height={14} /> More than merch
                </div>
                <p className="mt-2.5 text-[14px] leading-relaxed text-white/75">
                  Every piece is designed to open a conversation — and every order sows back into the
                  Kingdom work behind this festival. Wear it, and be ready when someone asks.
                </p>
                <a
                  href={SHOP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gold-400 to-gold-600 py-3 font-display text-sm font-bold text-navy-950 shadow-glow active:scale-[0.98]"
                >
                  Browse all of ThyKingdom.Shop <ArrowRight width={15} height={15} />
                </a>
                <p className="mt-2.5 text-center text-[11px] text-white/40">
                  Secure checkout on ThyKingdom.Shop · part of Thy Kingdom Network
                </p>
              </div>
            </Reveal>
          </section>
        </>
      )}
    </div>
  );
}

function ProductCard({ p, featured = false }: { p: ShopProduct; featured?: boolean }) {
  return (
    <a
      href={p.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group block overflow-hidden rounded-2xl border transition active:scale-[0.99] ${
        featured
          ? "border-gold/40 bg-gradient-to-br from-gold/10 to-transparent"
          : "border-white/10 bg-white/[0.04]"
      }`}
    >
      <div className={`overflow-hidden bg-white/5 ${featured ? "aspect-[4/3]" : "aspect-square"}`}>
        {p.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={p.image}
            alt={p.imageAlt}
            // Featured products are above the fold — lazy-loading them just
            // delays the screen's main content.
            loading={featured ? "eager" : "lazy"}
            decoding="async"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.04]"
          />
        )}
      </div>
      <div className={featured ? "p-4" : "p-3"}>
        <h3 className={`font-display font-bold leading-snug text-white ${featured ? "text-[16px]" : "line-clamp-2 text-[13px]"}`}>
          {p.title}
        </h3>
        <div className="mt-1.5 flex items-baseline gap-2">
          <span className={`font-display font-extrabold text-gold-400 ${featured ? "text-[17px]" : "text-[14px]"}`}>{p.price}</span>
          {p.compareAt && <span className="text-[11.5px] text-white/40 line-through">{p.compareAt}</span>}
        </div>
        <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-gold-400/90">
          Shop on ThyKingdom.Shop <ArrowRight width={11} height={11} />
        </span>
      </div>
    </a>
  );
}
