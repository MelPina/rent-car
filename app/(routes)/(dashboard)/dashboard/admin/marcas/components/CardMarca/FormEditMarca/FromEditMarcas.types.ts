import { Marca } from "@prisma/client";
import { Dispatch, SetStateAction } from "react";

export type FormEditMarcaProps = {
  marcasData: Marca;
  setOpenDialog: Dispatch<SetStateAction<boolean>>;
};