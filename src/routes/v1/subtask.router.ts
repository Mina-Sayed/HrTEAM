import {Router} from "express"
import { addSubTask, deleteSubTask, getAllSubTasks, getSubTaskById, updateSubTask } from "../../controllers/subtask/subtask.controller";
import { validator } from "../../middlewares/validate";
import { subTaskValidation } from "../../validators/subTask.validator";
const router:Router=Router()
router.route('/:task')
.get(getAllSubTasks)
.post(validator(subTaskValidation,'post'),addSubTask)
router.route('/:id')
.get(getSubTaskById)
.put(validator(subTaskValidation,'put'),updateSubTask)
.delete(deleteSubTask)
export default router;