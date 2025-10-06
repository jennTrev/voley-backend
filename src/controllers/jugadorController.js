// controllers/JugadorController.js
import { Jugador, Cuenta } from "../models/index.js";

// 📌 Función para calcular la edad a partir de la fecha de nacimiento
const calcularEdad = (fechaNacimiento) => {
  const hoy = new Date();
  const fechaNac = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - fechaNac.getFullYear();
  const mes = hoy.getMonth() - fechaNac.getMonth();
  if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
    edad--;
  }
  return edad;
};

// 📌 Crear jugador
export const crearJugador = async (req, res) => {
  try {
    const {
      nombres,
      apellidos,
      carrera,
      posicion_principal,
      fecha_nacimiento,
      altura,
      anos_experiencia_voley,
      correo_institucional,
      numero_celular,
      cuentaId,
      imagen, // opcional
    } = req.body;

    // Validar fecha de nacimiento
    if (!fecha_nacimiento || isNaN(Date.parse(fecha_nacimiento))) {
      return res.status(400).json({
        success: false,
        message: "La fecha de nacimiento no es válida",
      });
    }

    const hoy = new Date();
    const fechaNac = new Date(fecha_nacimiento);
    if (fechaNac > hoy) {
      return res.status(400).json({
        success: false,
        message: "La fecha de nacimiento no puede ser futura",
      });
    }

    // Calcular edad y validar rango
    const edad = calcularEdad(fecha_nacimiento);
    if (edad < 16 || edad > 35) {
      return res.status(400).json({
        success: false,
        message: "La edad debe estar entre 16 y 35 años",
      });
    }

    // Crear jugador
    const nuevoJugador = await Jugador.create({
      nombres,
      apellidos,
      carrera,
      posicion_principal,
      fecha_nacimiento,
      altura,
      anos_experiencia_voley,
      correo_institucional,
      numero_celular,
      cuentaId,
      imagen: imagen || null,
    });

    res.status(201).json({
      success: true,
      message: "Jugador creado exitosamente",
      data: {
        ...nuevoJugador.toJSON(),
        edad,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};

// 📌 Obtener todos los jugadores
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
    });

    const jugadoresConEdad = jugadores.map((j) => ({
      ...j.toJSON(),
      edad: calcularEdad(j.fecha_nacimiento),
    }));

    res.json({
      success: true,
      data: jugadoresConEdad,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};

// 📌 Obtener un jugador por ID
export const obtenerJugador = async (req, res) => {
  try {
    const { id } = req.params;

    const jugador = await Jugador.findOne({
      where: { id },
      include: [
        {
          model: Cuenta,
          as: "cuenta",
          where: { activo: true },
        },
      ],
    });

    if (!jugador) {
      return res.status(404).json({
        success: false,
        message: "Jugador no encontrado",
      });
    }

    if (req.usuario.rol === "jugador" && jugador.cuentaId !== req.usuario.id) {
      return res.status(403).json({
        success: false,
        message: "No tienes permisos para ver esta información",
      });
    }

    res.json({
      success: true,
      data: {
        ...jugador.toJSON(),
        edad: calcularEdad(jugador.fecha_nacimiento),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};

// 📌 Actualizar jugador
export const actualizarJugador = async (req, res) => {
  try {
    const { id } = req.params;

    const jugador = await Jugador.findOne({
      where: { id },
      include: [
        {
          model: Cuenta,
          as: "cuenta",
          where: { activo: true },
        },
      ],
    });

    if (!jugador) {
      return res.status(404).json({
        success: false,
        message: "Jugador no encontrado",
      });
    }

    if (req.usuario.rol === "jugador" && jugador.cuentaId !== req.usuario.id) {
      return res.status(403).json({
        success: false,
        message: "No tienes permisos para actualizar esta información",
      });
    }

    if (req.body.fecha_nacimiento) {
      if (isNaN(Date.parse(req.body.fecha_nacimiento))) {
        return res.status(400).json({
          success: false,
          message: "La fecha de nacimiento no es válida",
        });
      }
      const nuevaEdad = calcularEdad(req.body.fecha_nacimiento);
      if (nuevaEdad < 16 || nuevaEdad > 35) {
        return res.status(400).json({
          success: false,
          message: "La edad debe estar entre 16 y 35 años",
        });
      }
    }

    // Permitir cambiar imagen
    const { imagen, ...otros } = req.body;
    await jugador.update({ ...otros, imagen: imagen !== undefined ? imagen : jugador.imagen });

    res.json({
      success: true,
      message: "Jugador actualizado exitosamente",
      data: {
        ...jugador.toJSON(),
        edad: calcularEdad(jugador.fecha_nacimiento),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};
