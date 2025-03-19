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
```

Replace the placeholder values with your actual ImageKit, NeonDB, Upstash, and Resend credentials. You can obtain these credentials by signing up on the [MongoDB](https://www.mongodb.com/), [Cloudnary](https://console.cloudinary.com/), and [Nodemailer](https://www.nodemailer.com/).

**Running the Project**

```bash
npm run dev
```

Open [http://localhost:8000](http://localhost:8000) in your browser to view the project.
