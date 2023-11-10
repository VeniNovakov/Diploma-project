import { useBasket } from './providers/BasketCounterProvider'
import pizza from './images/pizza.jpg'
import menu from './json/menu.json'
import React, { useState } from 'react'
import {ProductType, BasketItem} from './types'
import Cookies from 'js-cookie'
import { ProductProps } from './types'
const Menu = () => {
  const [items, setItems] = useState<BasketItem[]>([]);

  return(
    <div >
      <Filter/>
    <div className='flex flex-wrap items-center justify-center'>
      {menu.map( (product) =>
          <Product items={{basket:items, setItems:setItems}} product={product} key={product.id}/>
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

const FilterItem = (props:any) => {
  return (
    <button className='flex flex-col self-center justify-self-center m-2 justify-center text-center items-center'>
      <img className='h-12 w-12 justify-self-center' src={props.item.img} alt={props.item.alt}></img>
      <div className='justify-self-center'>{props.item.name}</div>
    </button>
  )
}

const Product = (props:ProductProps) => {
  const { basketCounter, setBasketCounter } = useBasket();


  const updateBasket = (product: ProductType) =>{
    setBasketCounter(basketCounter + 1);

    const newBasketObj:BasketItem = {product: product, amount: 1}

    if( props.items.basket.length === 0){
      props.items.setItems([...props.items.basket, newBasketObj]);
      Cookies.set('basket', JSON.stringify(newBasketObj))
      return
    }

    const updatedList:BasketItem[] = props.items.basket.map((item:BasketItem) => {
      if(item.product.id === product.id){
        const updatedItem = {
          ...item,
          amount: item.amount+1
        };
        return updatedItem;
      }else{
        return item;
      }
  })
  
  props.items.setItems(updatedList)
  console.log(props.items);

  updatedList === props.items.basket ? props.items.setItems([...updatedList, newBasketObj]):props.items.setItems(updatedList);

  Cookies.set('basket', JSON.stringify(props.items.basket))
 
  }


  return (
    <div className='font-medium flex relative items-center content-center flex-col justify-center m-2 h-60 w-60 border'>
      <img src={pizza} className='h-3/6 w-4/6 fa' alt='pizza'></img>
        <p className='self-center'>{props.product.name}</p>
        <p className='self-center'>{props.product.price}</p>
      <button className='border-2 self-center hover:bg-slate-300' onClick={() => updateBasket(props.product)} >add to basket</button>
    </div>
  )

}

export default Menu;