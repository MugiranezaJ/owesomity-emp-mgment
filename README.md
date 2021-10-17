# owesomity-emp-mgment
A restful Api system to manage employees. An Owesomity backend challenge.

## Installation
bellow are steps to install the app:

``` bash
git clone [add project .git url]
```

after clonning the app into locaal machine, open the terminal from within the project dirctory  and run:
``` bash
npm install
```
this helps to install the  dependencies


### Setting environment variables(.env)
In your environment variables, you have to set the following variables:
```
SENDER_EMAIL=
EMAIL_PASSWORD=
TOKEN_SECRET=
SALT=
```
After setting variables, you can run the app.

To run the app in development:
``` bash
npm run start:dev
```
For ES5 compatibility run:
``` bash
npm run build
```
this comverts the app into ES5

To run the app for production run:
``` bash
npm run start
```
this command transforms the app into  ES5 and the run it for production.

## Making requests
 For making requests you can refer to the provided postman [documentation]() 

## what have been done so far:


- Documented with ``Postman``
- (phone number must be a Rwandan number, and email should be validated).
- The national id must be 16 numbers.
- Only 18 year old employees are allowed to be registered.
- National Id, Email, Code and phone number are unique.
- The system throws exception on error.
- Application is properly logged.
- All sensitive data are put in  ``env variables``
- Writen README 

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
