import { Outlet } from 'react-router';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import styles from './MainLayout.module.css';

export const MainLayout = () => {
  return (
    <>
      <Header />
      <main className={styles.mainContent}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};
