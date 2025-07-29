import { Jugador, Cuenta } from "../models/index.js"

export const obtenerJugadores = async (req, res) => {
  try {
    const jugadores = await Jugador.findAll({
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
      data: jugadores,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    })
  }
}

export const obtenerJugador = async (req, res) => {
  try {
    const { id } = req.params

    const jugador = await Jugador.findOne({
      where: { id },
      include: [
        {
          model: Cuenta,
          as: "cuenta",
          where: { activo: true },
        },
      ],
    })

    if (!jugador) {
      return res.status(404).json({
        success: false,
        message: "Jugador no encontrado",
      })
    }

    // Verificar permisos: jugadores solo pueden ver su propia información
    if (req.usuario.rol === "jugador" && jugador.cuentaId !== req.usuario.id) {
      return res.status(403).json({
        success: false,
        message: "No tienes permisos para ver esta información",
      })
    }

    res.json({
      success: true,
      data: jugador,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    })
  }
}

export const actualizarJugador = async (req, res) => {
  try {
    const { id } = req.params

    const jugador = await Jugador.findOne({
      where: { id },
      include: [
        {
          model: Cuenta,
          as: "cuenta",
          where: { activo: true },
        },
      ],
    })

    if (!jugador) {
      return res.status(404).json({
        success: false,
        message: "Jugador no encontrado",
      })
    }

    // Verificar permisos: jugadores solo pueden actualizar su propia información
    if (req.usuario.rol === "jugador" && jugador.cuentaId !== req.usuario.id) {
      return res.status(403).json({
        success: false,
        message: "No tienes permisos para actualizar esta información",
      })
    }

    await jugador.update(req.body)

    res.json({
      success: true,
      message: "Jugador actualizado exitosamente",
      data: jugador,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    })
  }
}
