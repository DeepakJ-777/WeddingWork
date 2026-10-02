import { app } from "./app.js";
import * as dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`💍 Wedding Invitation API running on http://localhost:${PORT}`);
  console.log(`👉 Health check: http://localhost:${PORT}/api/health`);
  console.log(`👉 Public demo: http://localhost:${PORT}/api/public/weddings/rahul-ananya`);
});
