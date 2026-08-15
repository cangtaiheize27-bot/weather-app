import './globals.css';

export const metadata = {
  title: '天気予報アプリ',
  description: 'OpenWeatherMap と連携した天気予報アプリ（現在地・都市検索・5日間予報対応）',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
