import { HeroSection } from './sections/HeroSection';
import { PopularMoviesSection } from './sections/PopularMoviesSection';
import { GenreSections } from './sections/GenreSections';
import { Top20Section } from './sections/Top20Section';
import { ArtistsSection } from './sections/ArtistsSection';
import styles from './MainPage.module.css';

const MainPage: React.FC = () => {
  return (
    <main className={styles.mainPage}>
      <HeroSection />
      <PopularMoviesSection />
      <GenreSections />
      <Top20Section />
      <ArtistsSection />
    </main>
  );
};

export default MainPage;
