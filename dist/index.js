"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const thoughtRoutes_1 = __importDefault(require("./routes/thoughtRoutes"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
app.use(express_1.default.json());
app.use('/api/users', userRoutes_1.default);
app.use('/api/thoughts', thoughtRoutes_1.default);
app.get('/', (req, res) => {
    res.send('Welcome to the Social Network API!');
});
// Connect to MongoDB
mongoose_1.default.connect('mongodb://127.0.0.1:27017/SNetwork')
    .then(() => {
    console.log('[MongoDB] Connected!');
    app.listen(PORT, () => console.log(`[Server] Listening on http://localhost:${PORT}`));
})
    .catch((err) => console.error('[MongoDB] Connection error:', err));
