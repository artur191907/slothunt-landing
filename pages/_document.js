import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="ru">
      <Head>
        <meta charSet="UTF-8" />
        <meta name="description" content="SlotHunt — автоматический отлов слотов перераспределения остатков на Wildberries 24/7. Бот-снайпер ловит коэффициенты ×0 пока вы спите." />
        <meta name="keywords" content="Wildberries, WB, слоты, перераспределение, остатки, бот, автоматизация, селлер" />
        <meta property="og:title" content="SlotHunt — охота за слотами Wildberries" />
        <meta property="og:description" content="Автоматический отлов слотов перераспределения остатков 24/7" />
        <meta property="og:type" content="website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
