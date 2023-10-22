import React from "react";
import { Button } from "@chakra-ui/react";

interface Item {
  id: number;
  name: string;
  isFinished: boolean;
  idBd: any;
  createdAt: string;
}

type ListItems = Item[];

interface ButtonIconProps {
  item: Item;
  isFinished: boolean;
  onChangeFn: (item: Item) => void;
}

export const ButtonIcon = ({
  item,
  isFinished,
  onChangeFn,
}: ButtonIconProps) => {
  return (
    <Button
      colorScheme="green"
      onClick={() => onChangeFn(item)}
    />
  );
};
