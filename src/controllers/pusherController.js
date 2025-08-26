// controllers/espController.js
import Pusher from "pusher";

const pusher = new Pusher({
  appId: "1978430",
  key: "4f85ef5c792df94cebc9",
  secret: "351840445857a008668f",
  cluster: "us2",
  useTLS: true,
});

export const sendCommand = async (req, res) => {
  try {
    const { comando, deviceId, userId } = req.body;

    if (!comando) {
      return res.status(400).json({ message: "El comando es requerido" });
    }

    if (!deviceId) {
      return res.status(400).json({ message: "El deviceId es requerido" });
    }

    const channel = `esp-${deviceId}`;
    await pusher.trigger(channel, "command", {
      message: comando,
      userId: userId || "sistema",
      timestamp: new Date().toISOString(),
    });

    console.log(
      `Comando enviado a ESP-${deviceId}: ${comando} por usuario ID: ${userId || "sistema"}`
    );

    return res.json({
      success: true,
      message: `Comando "${comando}" enviado exitosamente a ESP-${deviceId}`,
    });
  } catch (error) {
    console.error("Error al enviar comando a ESP32:", error);
    return res.status(500).json({
      success: false,
      message: "Error al enviar comando a ESP32",
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
};
//ss