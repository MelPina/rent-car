import { CardMarca } from "../CardMarca";
import { MarcasListProps } from "./ListMarcas.types";


export function ListMarcas(props: MarcasListProps) {
    const { marcas } = props;

    return (

        <div className="grid grid-cols-2 gap-6 my-4 lg:grid-cols-4">
            {marcas.map((marca) => (
                <CardMarca marca={marca} key={marca.id}/>
            ))}
        </div>
    );
}