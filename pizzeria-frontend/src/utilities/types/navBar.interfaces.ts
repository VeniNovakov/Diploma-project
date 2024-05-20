import { MouseEventHandler } from "react";

export interface NavItemProps {
  children: string;
  href: string;
  basket?: NavBasket
  function?: MouseEventHandler<HTMLButtonElement>
};

interface NavBasket{
  icon: string;
  name: string;
  counter: number;
}