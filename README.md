# BookAppointment
 A React-Django-rest SPA for Hospital Appointment Mangement.  
 Utmost basic app:
 1. Login
 2. Booking appointments as a patient
 3. Checking Appointments as the hospital staff.
   
 I have NOT included registration in the Frontend, Although it can be easily done through django-admin site.  
 
 It accounts for the busy schedule of the hospitals, they can add an appointment to remove some particular time frame as a break.  
 It works well with multiple hospitals and patients, as I've tried to keep the backend code efficient and fast.  
 
 #### Backend
 It uses Django-Rest-Framework as Backend. API browser is also installed.  
 Debug Mode is kept ON as I created this project for learning purposes and not for production.  
 Functional Views has been used instead of class based ones.  
 
 #### Frontend
 React is used for the frontend.  
 It is a Single Page App.  
 Material UI is used throughout the App for faster development.  
 I've used Functional Components and State Hooks instead for Class based ones for a change.  
 
 ## Starting servers
 ### Django rest API (Backend):
 1. I've included conda-env and pip made requirement files as reqConda.txt and reqPip.txt one can use for the python requirements.
 2. After installing the requirements, Travel to the root directory in project, use `python manage.py runserver` to start the server.
 
 ### React App(Frontend):
 1. Install npm
 2. Go to the /frontend directory.
 3. Use `npm start` to start the server.

## To Access Admin-Site:
Create a superuser:
1. Go to the root directory
2. Use `django-admin createsuperuser`
3. Type in name, email and password as required.

## To Register Patient/Hospital:
1. Login to the admin-site if not changed then it will be http://127.0.0.1:8000/admin/
2. Go to the user model
3. Create a User model ( Only email and password is necessary)
4. Go to Patient/Hospital model
5. Register the information using the User object created in step 3.

Once registered, One can interact using the react server.  
Default : http://127.0.0.1:3000

##### NOTE: IF YOU CHANGE DJANGO API SERVER OR PORT YOU NEED TO CHANGE THE SAME AT /frontend/.env
