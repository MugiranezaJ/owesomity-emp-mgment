import Express from "express";
import { Employee } from "../controller/Employee";
import { Manager } from "../controller/Manager";
import { checkAuthentication } from "../middlewares/Authentication";
import { createEmployeeValidation, createManagerValidation, resetPasswordValidation } from "../middlewares/validation";

var router = Express.Router();
router.post("/create", checkAuthentication, createEmployeeValidation, Employee.createEmployee);
router.patch("/update/:id", checkAuthentication, Employee.updateEmployee);
router.patch("/suspend/:id", checkAuthentication, Employee.suspendEmployee);
router.patch("/activate/:id", checkAuthentication, Employee.activateEmployee);
router.delete("/delete/:id", checkAuthentication, Employee.deleteEmployee);
router.get("/search/:type", checkAuthentication, Employee.searchEmployee);
router.get("/search", checkAuthentication, Employee.searchEmployee);

router.post("/manager/signup", createManagerValidation, Manager.signup);
router.post("/manager/logout", Manager.logout);
router.get("/manager/verify/:token", Manager.verifyUser);
router.post("/manager/login/", Manager.login);
router.post("/manager/password-reset", resetPasswordValidation, Manager.resetPassword);
router.get("/manager/change-password/:token", Manager.changePassword);

export default router