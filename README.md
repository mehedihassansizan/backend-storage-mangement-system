<div align="center">
  <div>
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Nodejs"/>
    <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="Mongodb"/>
    <img src="https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white" alt="Cloudinary"/>
    <img src="https://img.shields.io/badge/Nodemailer-FFCC00?style=for-the-badge&logo=gmail&logoColor=white" alt="Nodmailer"/>
    <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express js"/>
  </div>

  <h3 align="center">A storage Management System </h3>
</div>

## 📋 <a name="table">Table of Contents</a>

1. 🤖 [Introduction](#introduction)
2. ⚙️ [Tech Stack](#tech-stack)
3. 🔋 [Features](#features)
4. 🤸 [Quick Start](#quick-start)
5. 🔗 [Postman](#postman)

## <a name="introduction">🤖 Introduction</a>

The Storage Management System is a web application built with Node.js, Express.js, and MongoDB to help users efficiently manage and organize their digital files, folders, and notes. This system allows users to upload, organize, search, and delete files, folders, and notes with a clean and intuitive interface.The project follows the MVC (Model-View-Controller) design pattern for clean code structure, separating logic into models, views, and controllers.

## <a name="tech-stack">⚙️ Tech Stack</a>

- Backend: Node.js, Express.js
- Database: MongoDB
- Storage: Cloudinary for file uploads and storage
- Authentication: JWT (JSON Web Tokens)
- Middleware: Multer for file upload handling
- Resend
- API Testing: Postman for API testing

## <a name="features">🔋 Features</a>

### Features of the Storage Management System Backend Project

👉 **User Authentication**:Secure login and registration system using JWT for authentication and session management.

👉 **File Management**: Users can upload, store, and manage different types of files (images, documents, PDFs, etc.) with support for Cloud storage integration via Cloudinary.

👉 **Folder Management**: Organize files and notes into folders, supporting drag-and-drop functionality for easy folder structure management.

👉 **Notes**: Users can create, edit, and store notes, keeping them organized alongside files and folders.

👉 **Favorites**: Mark files, folders, or notes as favorites for quick access and better organization.

👉 **Copy/Paste**: Users can copy and paste files, folders, and notes to different locations within the system, ensuring smooth workflow.

👉 **Deletion or update**: user can delete or update file, folder name, notes(name, content)

## <a name="quick-start">🤸 Quick Start</a>

Follow these steps to set up the project locally on your machine.

**Prerequisites**

Make sure you have the following installed on your machine:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en)
- [npm](https://www.npmjs.com/) (Node Package Manager)

**Cloning the Repository**

```bash
git clone https://github.com/mehedihassansizan/backend-storage-mangement-system.git
cd backend-storage-mangement-system
```

**Installation**

Install the project dependencies using npm:

```bash
npm install
```

**Set Up Environment Variables**

Create a new file named `.env` in the root of your project and add the following content:

```env
CORS_ORIGIN=
PORT=
MONGODB_URL=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
ACCESS_TOKEN_SECRET=
ACCESS_TOKEN_EXPIRY=
REFRESH_TOKEN_SECRET=
REFRESH_TOKEN_EXPIRY=
EMAIL_PASS=
EMAIL_USER=
SESSION_SECRET=
```

Replace the placeholder values with your actual Cloudinary, nodemailer, or MongoDB. You can obtain these credentials by signing up on the [MongoDB](https://www.mongodb.com/), [cloudinary](https://console.cloudinary.com/), and [Nodemailer](https://www.nodemailer.com/).

**Running the Project**

```bash
npm run dev
```

Open [http://localhost:8000](http://localhost:8000) in your browser to view the project.

## <a name="postman">🤸 Postman Documentation</a>

[https://documenter.getpostman.com/view/38027234/2sAYkGJyjP]
