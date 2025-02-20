import React from 'react'
import Image from 'next/image'

export default function PageDashboard() {
  return (
    <div>
    <div className="flex justify-between">
    <h2 className="text-2xl font-bold">Listado de Vehículos</h2>
    </div>
    <p>
      <br></br>
    </p>
    {/* <p>Listado de Vehículos</p> */}
    <section>
      <div className="flex flex-wrap -m-4">
        {[1, 2, 3, 4].map((car) => (
          <div key={car} className="p-4 md:w-1/2 lg:w-1/3">
            <div className="h-full border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden">
            <Image
            className="lg:h-48 md:h-36 w-full object-cover object-center"
            src={`https://www.autoo.com.br/fotos/2023/6/1280_960/byd_dolphin_2024_1_29062023_75040_1280_960.jpg`}
            alt={`Car ${car}`}
            width={150}
            height={150}
          />
              <div className="p-6">
          <h1 className="title-font text-lg font-medium text-gray-900 mb-3">Car {car}</h1>
          <p className="leading-relaxed mb-3">Descripción del vehículo {car}.</p>
          <div className="flex items-center flex-wrap ">
            <button className="text-indigo-500 inline-flex items-center md:mb-2 lg:mb-0">Rentar</button>
          </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
    </div>
  );
}
