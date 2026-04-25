import './styles.css';
import DogImage from './assets/1.jpg';
import { useEffect } from 'react';
import Button from './Button';

interface AppProps {
  message?: string;
}

const App: React.FC<AppProps> = ({ message = 'Hello' }) => {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') {
      return;
    }

    fetch('/google').then(console.log);
  }, []);

  return (
    <div className="app-container">
      <h1>{message}, Webpack with React and TypeScript!</h1>
      <img src={DogImage} alt="예시 이미지" />
      <Button>테스트용5</Button>
    </div>
  );
};

export default App;
