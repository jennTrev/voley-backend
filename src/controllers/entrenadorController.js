import { Entrenador, Cuenta } from "../models/index.js"

export const obtenerEntrenadores = async (req, res) => {
  try {
    const entrenadores = await Entrenador.findAll({
      include: [
        {
          model: Cuenta,
          as: "cuenta",
          where: { activo: true },
        },
      ],
    })

    res.json({
      success: true,
      data: entrenadores,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    })
  }
}

export const obtenerEntrenador = async (req, res) => {
  try {
    const { id } = req.params

    const entrenador = await Entrenador.findOne({
      where: { id },
      include: [
        {
          model: Cuenta,
          as: "cuenta",
          where: { activo: true },
        },
      ],
    })

    if (!entrenador) {
      return res.status(404).json({
        success: false,
        message: "Entrenador no encontrado",
      })
    }

    res.json({
      success: true,
      data: entrenador,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    })
  }
}

export const crearEntrenador = async (req, res) => {
  try {
    const entrenador = await Entrenador.create(req.body)

    res.status(201).json({
      success: true,
      message: "Entrenador creado exitosamente",
      data: entrenador,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    })
  }
}

export const actualizarEntrenador = async (req, res) => {
  try {
    const { id } = req.params

    const entrenador = await Entrenador.findOne({
      where: { id },
      include: [
        {
          model: Cuenta,
          as: "cuenta",
          where: { activo: true },
        },
      ],
    })

    if (!entrenador) {
      return res.status(404).json({
        success: false,
        message: "Entrenador no encontrado",
      })
    }

    await entrenador.update(req.body)

    res.json({
      success: true,
      message: "Entrenador actualizado exitosamente",
      data: entrenador,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    })
  }
}

export const eliminarEntrenador = async (req, res) => {
  try {
    const { id } = req.params

    const entrenador = await Entrenador.findOne({
      where: { id },
      include: [
        {
          model: Cuenta,
          as: "cuenta",
        },
      ],
    })

    if (!entrenador) {
      return res.status(404).json({
        success: false,
        message: "Entrenador no encontrado",
      })
    }

    // Soft delete en la cuenta
    await entrenador.cuenta.update({ activo: false })

    res.json({
      success: true,
      message: "Entrenador eliminado exitosamente",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    })
  }
}
