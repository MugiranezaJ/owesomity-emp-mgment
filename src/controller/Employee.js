import { sendMail } from "../helper/sendMail";
import db from "../models";
import ApplicationError from "../utils/applicationError";
import BadRequestError from "../utils/BadRequestError";
import NotFoundError from "../utils/notFoundErorror";

const EmployeeObj = db.employees;
export class Employee {
    
    // Update an Employee
    static updateEmployee = (req, res) => {
        EmployeeObj.update(req.body, {where:{id:req.params.id}})
          .then(data => {
              if(data[0]){
                  res.status(200).json({message:"Record updated successfully."});
              }else{
                  throw new NotFoundError("No record assocciated with the provided id.");
              }
          })
          .catch(error => {
            if(error.parent.code == 'ER_DUP_ENTRY'){
              res.status(400).json({message:error.parent.sqlMessage})
            }else{
              next(error);
            }
          });
    };

    // Create an Employee
    static createEmployee = (req, res, next) => {
      try{
        const employee = {
          name: req.body.name,
          national_id: req.body.national_id,
          code: req.body.code,
          phone_number: req.body.phone_number,
          email: req.body.email,
          date_of_birth: req.body.date_of_birth,
          status: req.body.status,
          position: req.body.position,
          created_date: req.body.created_date
        };
      
        EmployeeObj.create(employee)
          .then(data => {
            const message = "Welcome " +req.body.name+ ", You have joined SomeCompany inc.";
            sendMail(req.body.email, "Welcome", message).then( () =>{
              res.status(200).json(data);
            }).catch (err => {
              throw new ApplicationError("There was error while trying o send an email.");
            })
            
          })
          .catch(error => {
            if(error.parent.code == 'ER_DUP_ENTRY'){
              res.status(400).json({message:error.parent.sqlMessage})
            }else{
              next(error);
            }
            
            // throw new ApplicationError(err.message || "Some error occurred while creating the Employee.");
          });
        }catch(error){
          next(error)
        }
      };

    // Suspend an Employee
    static suspendEmployee = (req, res) => {
        EmployeeObj.update({"status":"INACTIVE"}, {where:{id:req.params.id}})
          .then(data => {
              if(data[0]){
                  res.status(200).json({message:"Employee suspended."});
              }else{
                  throw new NotFoundError("No employee assocciated with the provided id.");
              }
          })
          .catch(err => {
            throw new ApplicationError(err.message || "Some error occurred while Updating the Employee.");
          });
    };

    // Activate an Employee
    static activateEmployee = (req, res) => {
        EmployeeObj.update({"status":"ACTIVE"}, {where:{id:req.params.id}})
          .then(data => {
              if(data[0]){
                  res.status(200).json({message:"Employee activated."});
              }else{
                  throw new NotFoundError("No employee assocciated with the provided id.");
              }
          })
          .catch(err => {
            throw new ApplicationError(err.message || "Some error occurred while Updating the Employee.");
          });
    };

    // Activate an Employee
    static deleteEmployee = (req, res) => {
        EmployeeObj.destroy({where:{id:req.params.id}})
          .then(data => {
              
              if(data){
                  res.status(200).json({message:"Employee deleted successfully."});
              }else{
                  throw new NotFoundError("No employee assocciated with the provided id.");
              }
          })
          .catch(err => {
            throw new ApplicationError(err.message || "Some error occurred while Updating the Employee.");
          });
    };

    // serch an employee
    static searchEmployee = async (req, res, next) => {
      try{
        const  type = req.params.type;
        var data = {};
        switch(type){
          case 'byname':
            data = req.body.name ? {name:req.body.name} : {error:"name"};
            break;
          case 'bycode':
            data = req.body.code ? {code:req.body.code} : {error: "code"};
            break;
          case 'byposition':
            data = req.body.position ? {position:req.body.position} : {error:"position"};
            break;
          case 'byemail':
            data = req.body.email ? {email:req.body.email} : {error:"email"};
            break;
          case 'byphone':
            data = req.body.phone_number ? {phone_number:req.body.phone_number} : {eroor:"phone_number"};
            break;
          default:
            // returns all employees
            data = {};
        }
        if(data.error) throw new BadRequestError(data.error + " parameter is needed");
        const result = await EmployeeObj.findAll({where: data, attributes:{exclude:['password']}});
        if(!result[0]) throw new ApplicationError("No Record found", 404);
        res.status(200).json(result);
      }catch(err){
        next(err);
      }
    }
}