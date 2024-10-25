// components/Layout.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);

  return (
    <div className="relative">
      {children}
      {loading && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="animate-spin w-12 h-12 border-4 border-t-transparent border-white rounded-full"></div>
        </div>
      )}
    </div>
  );
};

export default Layout;
