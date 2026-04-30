import './styles/index.css';
import ReactDOM from 'react-dom/client';
import App from './App';

let rootElement = document.getElementById('root');
if (!rootElement) {
  rootElement = document.createElement('div');
  rootElement.id = 'root';
  document.body.appendChild(rootElement);
}
const root = ReactDOM.createRoot(rootElement);

root.render(<App />);
