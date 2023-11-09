import { useBasket } from './BasketProvider'
import pizza from './images/pizza.jpg'
import menu from './json/menu.json'
import basket from './json/basket.json'
function Menu(){
  return(
    <div >
      <Filter/>
    <div className='flex flex-wrap items-center justify-center'>
      {menu.map( (product) =>
          <Product product={product} key={product.id}/>
      )}

      
     
    </div>

    </div>
  )
}


const Filter = () => {
  return (
    <div className='flex self-center items-center justify-center'>
      <FilterItem item={{img: pizza, alt: '', name: 'pizza'}}/>
      <FilterItem item={{img: 'img', alt: '', name: 'not pizza'}}/>
      <FilterItem item={{img: 'img', alt: '', name: 'not pizza'}}/>
      </div>
  )
}

const FilterItem = (props) => {
  return (
    <button className='flex flex-col self-center justify-self-center m-2 justify-center text-center items-center'>
      <img className='h-12 w-12 justify-self-center' src={props.item.img} alt={props.item.alt}></img>
      <div className='justify-self-center'>{props.item.name}</div>
    </button>
  )
}

const Product = (props) => {
  const { basketCounter, setBasketCounter } = useBasket();

  const addToBasket = () => {
    setBasketCounter(basketCounter + 1);
    basket.push(props.product)
  };
  return (
    <div className='font-medium flex relative items-center content-center flex-col justify-center m-2 h-60 w-60 border'>
      <img src={pizza} className='h-3/6 w-4/6 fa' alt='pizza'></img>
        <p className='self-center'>{props.product.name}</p>
        <p className='self-center'>{props.product.price}</p>
      <button className='border-2 self-center hover:bg-slate-300' onClick={addToBasket} >add to basket</button>
    </div>
  )

}

export default Menu;