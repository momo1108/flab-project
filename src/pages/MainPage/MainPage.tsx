import { HeroSection } from './sections/HeroSection';
import { PopularMoviesSection } from './sections/PopularMoviesSection';
import { GenreSections } from './sections/GenreSections';
import { Top20Section } from './sections/Top20Section';
import { ArtistsSection } from './sections/ArtistsSection';
import styles from './MainPage.module.css';
import SectionWrapper from '@/components/SectionWrapper';

const MainPage: React.FC = () => {
  return (
    <main className={styles.mainPage}>
      <SectionWrapper>
        <HeroSection />
      </SectionWrapper>
      <SectionWrapper>
        <PopularMoviesSection />
      </SectionWrapper>
      <SectionWrapper>
        <GenreSections />
      </SectionWrapper>
      <SectionWrapper>
        <Top20Section />
      </SectionWrapper>
      <SectionWrapper>
        <ArtistsSection />
      </SectionWrapper>
    </main>
  );
};

export default MainPage;
