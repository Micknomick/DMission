export const metadata = {
  title: "Dmission",
  description: "Authentication pages for My App",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="h-screen flex flex-col items-center">
        {/* 認証ページ専用のヘッダー */}
        <header className="bg-blue-500 text-white w-full p-4 text-center">
          <h1>Auth Header</h1>
        </header>
        <main className="flex-grow w-full max-w-md">{children}</main>
        {/* 認証ページ専用のフッター */}
        <footer className="bg-blue-500 text-white w-full p-4 text-center">
          <p>Auth Footer</p>
        </footer>
      </body>
    </html>
  );
}
