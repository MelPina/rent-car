-- CreateTable
CREATE TABLE "Vehiculo" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "noChasis" TEXT NOT NULL,
    "noMotor" TEXT NOT NULL,
    "noPlaca" TEXT NOT NULL,
    "tpVehiculoId" TEXT NOT NULL,
    "marcaId" TEXT NOT NULL,
    "modeloId" TEXT NOT NULL,
    "tpCombustibleId" TEXT NOT NULL,
    "estado" BOOLEAN NOT NULL,
    "photo" TEXT NOT NULL,

    CONSTRAINT "Vehiculo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TipoVehiculo" (
    "id" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "estado" BOOLEAN NOT NULL,

    CONSTRAINT "TipoVehiculo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Marca" (
    "id" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "estado" BOOLEAN NOT NULL,

    CONSTRAINT "Marca_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Modelo" (
    "id" TEXT NOT NULL,
    "idMarca" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "estado" BOOLEAN NOT NULL,

    CONSTRAINT "Modelo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TipoCombustible" (
    "id" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "estado" BOOLEAN NOT NULL,

    CONSTRAINT "TipoCombustible_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cliente" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "cedula" TEXT NOT NULL,
    "noTarjetaCr" TEXT NOT NULL,
    "limiteCredito" DOUBLE PRECISION NOT NULL,
    "tipoPersona" TEXT NOT NULL,
    "estado" BOOLEAN NOT NULL,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Empleado" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "cedula" TEXT NOT NULL,
    "tandaLabor" TEXT NOT NULL,
    "porcientoComision" DOUBLE PRECISION NOT NULL,
    "fechaIngreso" TIMESTAMP(3) NOT NULL,
    "estado" BOOLEAN NOT NULL,

    CONSTRAINT "Empleado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inspeccion" (
    "id" TEXT NOT NULL,
    "vehiculoId" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "tieneRalladuras" BOOLEAN NOT NULL,
    "cantidadCombustible" TEXT NOT NULL,
    "tieneGomaRespuesta" BOOLEAN NOT NULL,
    "tieneGato" BOOLEAN NOT NULL,
    "tieneRoturasCristal" BOOLEAN NOT NULL,
    "estadoGomas" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "empleadoId" TEXT NOT NULL,
    "estado" BOOLEAN NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Inspeccion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RentaDevolucion" (
    "id" TEXT NOT NULL,
    "empleadoId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "vehiculoId" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "fechaRenta" TIMESTAMP(3) NOT NULL,
    "fechaDevolucion" TIMESTAMP(3) NOT NULL,
    "montoPorDia" DOUBLE PRECISION NOT NULL,
    "cantidadDias" INTEGER NOT NULL,
    "comentario" TEXT NOT NULL,
    "estado" BOOLEAN NOT NULL,

    CONSTRAINT "RentaDevolucion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Vehiculo_tpVehiculoId_idx" ON "Vehiculo"("tpVehiculoId");

-- CreateIndex
CREATE INDEX "Vehiculo_marcaId_idx" ON "Vehiculo"("marcaId");

-- CreateIndex
CREATE INDEX "Vehiculo_modeloId_idx" ON "Vehiculo"("modeloId");

-- CreateIndex
CREATE INDEX "Vehiculo_tpCombustibleId_idx" ON "Vehiculo"("tpCombustibleId");

-- CreateIndex
CREATE INDEX "Modelo_idMarca_idx" ON "Modelo"("idMarca");

-- CreateIndex
CREATE INDEX "Inspeccion_vehiculoId_idx" ON "Inspeccion"("vehiculoId");

-- CreateIndex
CREATE INDEX "Inspeccion_clienteId_idx" ON "Inspeccion"("clienteId");

-- CreateIndex
CREATE INDEX "Inspeccion_empleadoId_idx" ON "Inspeccion"("empleadoId");

-- CreateIndex
CREATE INDEX "Inspeccion_userId_idx" ON "Inspeccion"("userId");

-- CreateIndex
CREATE INDEX "RentaDevolucion_empleadoId_idx" ON "RentaDevolucion"("empleadoId");

-- CreateIndex
CREATE INDEX "RentaDevolucion_vehiculoId_idx" ON "RentaDevolucion"("vehiculoId");

-- CreateIndex
CREATE INDEX "RentaDevolucion_clienteId_idx" ON "RentaDevolucion"("clienteId");

-- CreateIndex
CREATE INDEX "RentaDevolucion_userId_idx" ON "RentaDevolucion"("userId");
