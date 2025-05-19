import { ConfigEnvironment } from "~/config/env";
import app from "./app";

const PORT = ConfigEnvironment.PORT;

app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
