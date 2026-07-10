# Colecciones

## negocios

{
    id,
    nombre,
    fechaCreacion
}

## usuarios

{
    uid,
    nombre,
    email,
    rol,
    activo,
    negocioId
}

## productos

{
    id,
    nombre,
    precio,
    negocioId
}

## pedidos

{
    id,
    negocioId,
    productos,
    observaciones,
    metodoPago,
    total,
    estado,
    fecha
}

## gastos

{
    id,
    descripcion,
    monto,
    fecha,
    negocioId
}