import { useBasket } from './BasketProvider';
import shoppingCart from './images/shopping-cart.png'
import { Link } from 'react-router-dom';

function NavBar(){
  const {basketCounter} = useBasket();

  return(
    <div className=" flex-start flex flex-row items-center justify-center bg-amber-200 h-full ">
      <NavItem href='/menu'>
        Menu
      </NavItem>
      <NavItem href='/basket' basket={{ icon: shoppingCart, name: "shoppingCart", counter: basketCounter}}>
        Basket
      </NavItem>
    </div>
  )
}

function NavItem(props){

  return (
    <div className=' flex h-full pl-12 m-0'>
    <Link to={props.href} className='font-serif font-medium border-2 hover:bg-amber-300 '>
        {props.basket ? (
          <div className='relative'>
            <img className='bg-transparent  max-h-12 max-w-12 m-0' src={props.basket.icon} alt={props.basket.name}/>
            <div className=" absolute top-0 -right-1 h-4 w-4 bg-red-600 rounded-full">
              <div className=' text-slate-100 relative -top-1 right-0'>{props.basket.counter}</div>
              </div>
          </div>
        ) : (
        props.children
      )} </Link>
    </div>
  )
}

export default NavBar;