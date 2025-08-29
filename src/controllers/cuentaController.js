import { Cuenta, Jugador, Entrenador, Tecnico } from "../models/index.js"
import { sequelize } from "../config/database.js"

export const obtenerCuentas = async (req, res) => {
  try {
    const cuentas = await Cuenta.findAll({
      where: { activo: true },
      include: [
        { model: Jugador, as: "jugador" },
        { model: Entrenador, as: "entrenador" },
        { model: Tecnico, as: "tecnico" },
      ],
    })

    res.json({
      success: true,
      data: cuentas,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    })
  }
}
export const obtenerCuenta = async (req, res) => {
  try {
    const { id } = req.params

    const cuenta = await Cuenta.findOne({
      where: { id, activo: true },
      include: [
        { model: Jugador, as: "jugador" },
        { model: Entrenador, as: "entrenador" },
        { model: Tecnico, as: "tecnico" },
      ],
    })

    if (!cuenta) {
      return res.status(404).json({
        success: false,
        message: "Cuenta no encontrada",
      })
    }

    res.json({
      success: true,
      data: cuenta,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    })
  }
}


export const crearCuenta = async (req, res) => {
  const transaction = await sequelize.transaction()

  try {
    const { usuario, contraseña, rol, ...datosPersonales } = req.body

    // Crear cuenta
    const cuenta = await Cuenta.create(
      {
        usuario,
        contraseña,
        rol,
      },
      { transaction },
    )

    // Crear registro específico según el rol
    let registro
    switch (rol) {
      case "jugador":
        registro = await Jugador.create(
          {
            ...datosPersonales,
            cuentaId: cuenta.id,
          },
          { transaction },
        )
        break
      case "entrenador":
        registro = await Entrenador.create(
          {
            ...datosPersonales,
            cuentaId: cuenta.id,
          },
          { transaction },
        )
        break
      case "tecnico":
        registro = await Tecnico.create(
          {
            ...datosPersonales,
            cuentaId: cuenta.id,
          },
          { transaction },
        )
        break
    }

    await transaction.commit()

    res.status(201).json({
      success: true,
      message: "Cuenta creada exitosamente",
      data: { cuenta: cuenta.toJSON(), [rol]: registro },
    })
  } catch (error) {
    await transaction.rollback()
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    })
  }
}

export const actualizarCuenta = async (req, res) => {
  const transaction = await sequelize.transaction()

  try {
    const { id } = req.params
    const { usuario, contraseña, rol, ...datosPersonales } = req.body

    const cuenta = await Cuenta.findByPk(id)
    if (!cuenta || !cuenta.activo) {
      return res.status(404).json({
        success: false,
        message: "Cuenta no encontrada",
      })
    }

    // Actualizar cuenta
    await cuenta.update(
      {
        usuario: usuario || cuenta.usuario,
        contraseña: contraseña || cuenta.contraseña,
        rol: rol || cuenta.rol,
      },
      { transaction },
    )

    // Actualizar datos personales según el rol
    const modeloMap = {
      jugador: Jugador,
      entrenador: Entrenador,
      tecnico: Tecnico,
    }

    const Modelo = modeloMap[cuenta.rol]
    if (Modelo && Object.keys(datosPersonales).length > 0) {
      await Modelo.update(datosPersonales, {
        where: { cuentaId: cuenta.id },
        transaction,
      })
    }

    await transaction.commit()

    res.json({
      success: true,
      message: "Cuenta actualizada exitosamente",
    })
  } catch (error) {
    await transaction.rollback()
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    })
  }
}

export const eliminarCuenta = async (req, res) => {
  try {
    const { id } = req.params

    const cuenta = await Cuenta.findByPk(id)
    if (!cuenta) {
      return res.status(404).json({
        success: false,
        message: "Cuenta no encontrada",
      })
    }

    await cuenta.update({ activo: false })

    res.json({
      success: true,
      message: "Cuenta eliminada exitosamente",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    })
  }
}
export const obtenerPerfil = async (req, res) => {
  try {
    const { id } = req.params;

    const cuenta = await Cuenta.findOne({
      where: { id, activo: true },
      attributes: { exclude: ["contraseña"] }, // Excluir la contraseña
      include: [
        { model: Jugador, as: "jugador" },
        { model: Entrenador, as: "entrenador" },
        { model: Tecnico, as: "tecnico" },
      ],
    });

    if (!cuenta) {
      return res.status(404).json({
        success: false,
        message: "Cuenta no encontrada",
      });
    }

    res.json({
      success: true,
      data: cuenta,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};
