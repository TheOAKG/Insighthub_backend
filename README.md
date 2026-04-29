# Insight Hub

## Project Description
Insight Hub is a web-based platform designed to showcase and manage student research projects. It provides a centralized hub for students to submit their projects, view others' work, and interact with the research community. The platform is built with modern web technologies to ensure a seamless and user-friendly experience.

## Features
- **User Authentication**: Secure login and registration system for users.
- **Project Submission**: Students can submit their research projects with details such as title, abstract, and department.
- **Project Browsing**: Users can browse through a list of submitted projects and view detailed information.
- **Comments and Interaction**: Users can comment on projects to provide feedback or ask questions.
- **Bookmarking**: Users can bookmark projects for future reference.

## Technologies Used
- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL
- **Other Tools**: 
  - `pg` library for database interaction
  - `dotenv` for environment variable management
  - `cors` for handling cross-origin requests

## File Structure
```
INSIGHT HUB/
├── auth.html          # Login and registration page
├── db.js              # Database connection setup
├── details.html       # Project details page
├── details.js         # JavaScript for project details functionality
├── index.html         # Homepage
├── package.json       # Node.js dependencies and scripts
├── README.md          # Project documentation
├── script.js          # Main JavaScript file for frontend logic
├── server.js          # Backend server setup
├── style.css          # Stylesheet for the application
├── submit.html        # Project submission page
```

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   ```
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Set Up Environment Variables**:
   - Create a `.env` file in the root directory with the following variables:
     ```env
     DB_USER=<your-database-username>
     DB_HOST=<your-database-host>
     DB_NAME=<your-database-name>
     DB_PASSWORD=<your-database-password>
     DB_PORT=<your-database-port>
     ```
4. **Start the Server**:
   ```bash
   npm start
   ```
5. **Access the Application**:
   - Open your browser and navigate to `http://localhost:5000`.

## Future Enhancements
- Add advanced search and filtering options for projects.
- Implement user profiles with project history.
- Enable file uploads for project reports and supplementary materials.
- Add an admin panel for managing users and projects.

## Contributors
- **Your Name**: Developer

## License
This project is licensed under the MIT License.