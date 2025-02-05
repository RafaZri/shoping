import { SearchProvider } from '../contexts/SearchContext';

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <SearchProvider>
          {children}
        </SearchProvider>
      </body>
    </html>
  );
}