"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const thotController_1 = require("../controllers/thotController");
const router = (0, express_1.Router)();
router.route('/')
    .get(thotController_1.getThoughts)
    .post(thotController_1.createThought);
router.route('/:id')
    .get(thotController_1.getThoughtById)
    .put(thotController_1.updateThought)
    .delete(thotController_1.deleteThought);
router.route('/:thoughtId/reactions')
    .post(thotController_1.addReaction);
router.route('/:thoughtId/reactions/:reactionId')
    .delete(thotController_1.removeReaction);
exports.default = router;
