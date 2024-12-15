Project Goal:
Develop a web-based short video streaming application using Platform as a Service (PaaS) and deploy it on Google Cloud Platform (GCP) as a Software as a Service (SaaS) solution. The application will allow end-users to upload, replace, browse, and bulk-delete short videos, following a microservices architecture for flexibility, scalability, and ease of maintenance.
 
Features and Microservices:
1.	User Account Management:
o	Implement a dedicated microservice (UserAccMgmtServ) for managing user authentication, identity, and account-related operations.
o	Utilize either relational databases (e.g., MySQL, PostgreSQL) or NoSQL databases (e.g., MongoDB).
o	Expose APIs for seamless integration, enabling other microservices to interact via HTTP request/response.
2.	Storage Management:
o	Develop a microservice (StorageMgmtServ) to allocate 50MB of cloud storage per user for video uploads.
o	Implement functionality to: 
	Alert users when 80% of storage is consumed.
	Restrict uploads once 100% storage is utilized until space is freed.
o	Provide an API for managing storage interactions.
3.	Usage Monitoring:
o	Create a microservice (UsageMntrServ) to track and log data volume usage (e.g., uploads and deletions).
o	Set a daily bandwidth threshold (e.g., 100MB/day) and alert users when it is exceeded. The users should not be able to upload any new content after the maximum daily bandwidth is consumed.
o	Expose an API to facilitate usage tracking and alerts.
4.	Video Presentation:
o	Build a front-end microservice (ViewGeneratorServ) for a responsive and visually appealing user interface.
o	Use HTML, CSS, and modern client-side libraries (e.g., JavaScript, jQuery) to play videos.
o	Fetch and display data from backend microservices via APIs.
5.	Additional Microservices:
o	Controller Service: To manage interactions and coordination between microservices.
o	Model Service: To encapsulate business logic and ensure separation of concerns.
o	Design and implement other microservices as required for the application’s functionality and efficiency.
6.	Load Testing:
o	Perform load testing to evaluate the application’s performance under high concurrency.
o	Use tools like Apache JMeter or Locust to simulate user activity, generate performance graphs, and analyze results.
o	Document the findings in the final report.
7.	Logging:
o	Set up a dedicated Logging Service to monitor user actions, system events, and errors.
o	Ensure logs are stored and maintained systematically for debugging and analytics.
