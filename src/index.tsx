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

console.log('API_URL:', process.env.API_URL);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('APP_PHASE:', process.env.APP_PHASE);