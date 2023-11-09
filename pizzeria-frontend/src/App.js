import './App.css';
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import LandingPage from './pages/landingPage';
import MenuPage from './pages/MenuPage';
import { BasketProvider } from './BasketProvider';
import Auth from './pages/authPage';

function App() {

    return (
      <BasketProvider>
        <BrowserRouter>   
          <Routes>     
            <Route path="/">
              <Route index element={<LandingPage />} />
              <Route path="menu" element={<MenuPage />} />
              <Route path='auth' element={<Auth/>}/>
            </Route>
          </Routes>
        </BrowserRouter>
      </BasketProvider>
    );

}

export default App;
