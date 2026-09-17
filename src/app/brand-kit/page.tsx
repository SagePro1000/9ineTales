import type { Metadata } from "next";
import { BrandGuide } from "@/components/brand/brand-guide";
import {
  SiteHeader,
  SiteFooter,
  PreviewBar,
  SkipLink,
} from "@/components/site-shell";
export const metadata: Metadata = { title: "Brand kit / 01" };
export default function BrandKitPage() {
  return (
    <div className="kit-body">
      <SkipLink />
      <PreviewBar mode="brand" />
      <SiteHeader mode="brand" />
      <BrandGuide />
      <SiteFooter mode="brand" />
    </div>
  );
}
