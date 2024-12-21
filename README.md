Frontend Pages:
Home page / Done
Login page /login 
Register page /register

Protected URLs
Upload page /upload
User profile /user/[userid]
--Upload, replace, bulkdelete, upload button which leads to /upload

Feature | Type | Route | Access
------------ | ------------- | ------------- | -------------
Get all users | GET | http://localhost:3000/api/users/ | Public
Get a specific user | GET | http://localhost:3000/api/users/:id | Public
Register a new user | POST | http://localhost:3000/api/users/register | Protected
Update a user | PUT | http://localhost:3000/api/users/:id | Protected
Login User | POST | http://localhost:3000/api/auth/login | Public
Validate Token | POST | http://localhost:3000/api/auth/validateToken | Public
Track Usage | POST | http://localhost:4000/api/usage/track | Protected
Get total usage data for the day | GET | http://localhost:4000/api/usage/total | Protected
Upload file | POST | http://localhost:8080/api/storage/upload | Protected
Get file by name | GET | http://localhost:8080/api/storage/get/{name} | Protected
Delete file by name | DELETE | http://localhost:8080/api/storage/delete/{name} | Protected




proxy server: localhost:8000

for example, localhost:3000 hosts an api service. 
