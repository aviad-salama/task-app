import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes';

function App() {
  return (
    <BrowserRouter> {/* Main context provider for the entire app */}
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;