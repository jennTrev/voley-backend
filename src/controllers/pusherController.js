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
    const { deviceId, command } = req.body;

    if (!deviceId || !command) {
      return res.status(400).json({ error: "Faltan parámetros" });
    }

    // 🔹 Enviamos el comando al canal privado del dispositivo
    await pusher.trigger(`private-device-${deviceId}`, "command", {
      command: command,
      from: "server"
    });

    res.json({ success: true, message: `Comando '${command}' enviado al dispositivo ${deviceId}` });
  } catch (error) {
    console.error("Error enviando comando:", error);
    res.status(500).json({ error: "Error enviando comando" });
  }
};