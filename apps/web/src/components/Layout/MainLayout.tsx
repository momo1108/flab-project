import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import styles from './MainLayout.module.css';
import { useEffect, useState } from 'react';
import { PageLoadingFallback } from '../PageLoadingFallback/PageLoadingFallback';

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  return (
    <div className={styles.mainLayout}>
      <Header />
      <main className={styles.mainContent}>
        {isMounted ? children : <PageLoadingFallback msg="페이지를 불러오는 중입니다..." />}
      </main>
      <Footer />
    </div>
  );
};
