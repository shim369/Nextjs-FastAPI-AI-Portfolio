import ChatPanel from "@/components/chrome/ChatPanel";
import CommandPalette from "@/components/chrome/CommandPalette";
import Footer from "@/components/chrome/Footer";
import Rail from "@/components/chrome/Rail";
import SkipLink from "@/components/chrome/SkipLink";
import TopBar from "@/components/chrome/TopBar";
import Architecture from "@/components/sections/Architecture";
import Blog from "@/components/sections/Blog";
import Contact from "@/components/sections/Contact";
import Hero from "@/components/sections/Hero";
import Jamstack from "@/components/sections/Jamstack";
import Skills from "@/components/sections/Skills";
import Works from "@/components/sections/Works";
import KasureFilter from "@/components/svg/KasureFilter";
import { ChatProvider } from "@/lib/chat-ui";
import { PaletteProvider } from "@/lib/palette";

// ブログ欄（microCMS）を ISR で更新する間隔（秒）。lib/microcms.ts の BLOG_REVALIDATE_SECONDS と揃える
export const revalidate = 60;

export default function Page() {
  return (
    <ChatProvider>
      <PaletteProvider>
        <SkipLink />
        <KasureFilter />
        <Rail />
        <TopBar />
        <main id="main" tabIndex={-1}>
          <Hero />
          <Skills />
          <Works />
          <Jamstack />
          <Blog />
          <Architecture />
          <Contact />
        </main>
        <Footer />
        <ChatPanel />
        <CommandPalette />
      </PaletteProvider>
    </ChatProvider>
  );
}
