import { ReactNode } from "react";
import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";

interface AppLayoutProps {
  children: ReactNode;
  title?: string;
  showBack?: boolean;
  requireAuth?: boolean;
}

export const AppLayout = ({
  children,
  title,
  showBack = false,
  requireAuth = true,
}: AppLayoutProps) => {
  const { user } = useAuth();

  // Kullanıcı giriş yapmamışsa ve kimlik doğrulama gerekiyorsa login sayfasına yönlendir
  if (requireAuth && !user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Üst başlık */}
      {title && (
        <header className="sticky top-0 z-10 bg-white shadow-sm">
          <div className="flex items-center h-14 px-4">
            {showBack && (
              <button onClick={() => window.history.back()} className="mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            <h1 className="text-lg font-semibold">{title}</h1>
          </div>
        </header>
      )}
      <main className="flex-1 p-4 pb-20 overflow-auto">{children}</main>
    </div>
  );
};
