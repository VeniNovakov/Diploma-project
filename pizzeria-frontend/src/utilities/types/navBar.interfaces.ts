export interface NavItemProps {
  children:string;
  href:string;
  basket?: NavBasket
};

interface NavBasket{
  icon: string;
  name: string;
  counter: number;
}