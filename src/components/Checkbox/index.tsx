import React from "react";
import { Checkbox } from "@chakra-ui/react";

interface Item {
  id: number;
  name: string;
  isFinished: boolean;
  idBd: any;
  createdAt: string;
}

interface CheckboxComponentProps {
  item: Item;
  isFinished: boolean;
  onChangeFn: (item: Item) => void;
}

export const CheckboxComponent = ({
  item,
  isFinished,
  onChangeFn,
}: CheckboxComponentProps) => {
  return (
    <Checkbox
      isChecked={isFinished}
      colorScheme="green"
      onChange={() => onChangeFn(item)}
    />
  );
};
