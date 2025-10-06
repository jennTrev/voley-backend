// controllers/EntrenadorController.js
import { Entrenador, Cuenta } from "../models/index.js";

// Obtener todos los entrenadores activos con su cuenta
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
    });

    res.json({
      success: true,
      data: entrenadores,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};

// Obtener un entrenador por ID con su cuenta
export const obtenerEntrenador = async (req, res) => {
  try {
    const { id } = req.params;

    const entrenador = await Entrenador.findOne({
      where: { id },
      include: [
        {
          model: Cuenta,
          as: "cuenta",
          where: { activo: true },
        },
      ],
    });

    if (!entrenador) {
      return res.status(404).json({
        success: false,
        message: "Entrenador no encontrado",
      });
    }

    res.json({
      success: true,
      data: entrenador,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};

// Crear entrenador (imagen opcional)
export const crearEntrenador = async (req, res) => {
  try {
    const { nombres, apellidos, fecha_nacimiento, anos_experiencia_voley, numero_celular, correo_electronico, cuentaId, imagen } = req.body;

    const nuevo = await Entrenador.create({
      nombres,
      apellidos,
      fecha_nacimiento,
      anos_experiencia_voley,
      numero_celular,
      correo_electronico,
      cuentaId,
      imagen: imagen || null
    });

    res.status(201).json({
      success: true,
      message: "Entrenador creado exitosamente",
      data: nuevo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};

// Actualizar entrenador (incluye cambio de imagen)
export const actualizarEntrenador = async (req, res) => {
  try {
    const { id } = req.params;
    const { imagen, ...rest } = req.body;

    const entrenador = await Entrenador.findOne({
      where: { id },
      include: [
        {
          model: Cuenta,
          as: "cuenta",
          where: { activo: true },
        },
      ],
    });

    if (!entrenador) {
      return res.status(404).json({
        success: false,
        message: "Entrenador no encontrado",
      });
    }

    await entrenador.update({
      ...rest,
      imagen: imagen !== undefined ? imagen : entrenador.imagen
    });

    res.json({
      success: true,
      message: "Entrenador actualizado exitosamente",
      data: entrenador,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};

// Eliminar entrenador (soft delete de la cuenta)
export const eliminarEntrenador = async (req, res) => {
  try {
    const { id } = req.params;

    const entrenador = await Entrenador.findOne({
      where: { id },
      include: [
        {
          model: Cuenta,
          as: "cuenta",
        },
      ],
    });

    if (!entrenador) {
      return res.status(404).json({
        success: false,
        message: "Entrenador no encontrado",
      });
    }

    await entrenador.cuenta.update({ activo: false });

    res.json({
      success: true,
      message: "Entrenador eliminado exitosamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};
