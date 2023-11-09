import { BasketProvider } from "../BasketProvider";
import Menu from "../Menu";
import NavBar from "../NavBar";

const MenuPage = () => {
  return (
  <BasketProvider>
    <NavBar></NavBar>
    <Menu></Menu>
  </BasketProvider>
  )
}

export default MenuPage