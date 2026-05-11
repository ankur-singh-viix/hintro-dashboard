import '@/styles/globals.css';
import { UserProvider } from '@/lib/UserContext';

export const metadata = {
  title:       'Hintro Dashboard',
  description: 'Your AI-powered call assistant dashboard',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
