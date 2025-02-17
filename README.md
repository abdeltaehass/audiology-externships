## Table of Contents

- [Enhance Audiology Externship Website](https://github.com/legnajaneth/8Bits-1Byte-Senior-Project?tab=readme-ov-file#enhance-audiology-externship-website)
- [Team Members](https://github.com/legnajaneth/8Bits-1Byte-Senior-Project?tab=readme-ov-file#team-members)
- [Synopsis](https://github.com/legnajaneth/8Bits-1Byte-Senior-Project?tab=readme-ov-file#synopsis)
- [Features](https://github.com/legnajaneth/8Bits-1Byte-Senior-Project?tab=readme-ov-file#features)
- [Deployment](https://github.com/legnajaneth/8Bits-1Byte-Senior-Project?tab=readme-ov-file#deployment)
- [Testing](https://github.com/legnajaneth/8Bits-1Byte-Senior-Project?tab=readme-ov-file#testing)
- [Tech Stack](https://github.com/legnajaneth/8Bits-1Byte-Senior-Project?tab=readme-ov-file#tech-stack)
- [Timeline & Milestones](https://github.com/legnajaneth/8Bits-1Byte-Senior-Project?tab=readme-ov-file#timeline--milestones)
- [Learn More](https://github.com/legnajaneth/8Bits-1Byte-Senior-Project?tab=readme-ov-file#learn-more)

---

# Enhance Audiology Externship Website

![Screenshot 2024-11-20 at 8 31 52 AM](https://github.com/user-attachments/assets/698a896c-6b19-4682-9729-e86ef20f18c5)

---

## Team Members

Meet **Team 8 Bits 1 Byte**:
| Name | Email Address |
|----------------------|----------------------------------|
| Abdel R. Taeha | abdeltaehass@gmail.com |
| Juan Carrera Bravo | juancarrera20011231@gmail.com |
| Legna Saca Archuleta | legnareyna@gmail.com |
| Antonio Carrera | carreraantonioc@gmail.com |
| Steven Ngo | ngosteven27@gmail.com |
| Alejandro Madera | amadera2003@gmail.com |
| Dylan Dumitru | dylanddumitru@gmail.com |
| Matthew Bernardino | matthewbjunio@gmail.com |

---

## Synopsis

The **Enhance Audiology Externship Website** is an innovative platform designed to assist audiology students across the country in finding externship opportunities. It allows students to complete surveys, access detailed externship information, and manage accounts with ease. Developed by **Team 8 Bits 1 Byte** at California State University, Sacramento, this project combines user-friendly design and powerful backend functionalities.

Our goal is to make easier for audiology students to find relevant externships for their needs, while the admin has easy access to various site functions to ensure a smooth process. We aim to make the site easy to use, and useful for those visiting.

![Screenshot 2024-11-20 at 8 34 44 AM](https://github.com/user-attachments/assets/1dc05631-48de-4b2a-a6bf-5956aa27b9ba)

---

## Features

### Core Features

- **Account Management**: Sign up, login, and manage personal details.
- **Push Notifications**: Alerts for survey submissions and admin approvals.
- **Survey Management**: Timestamped survey submissions, admin approval workflows, and database integration.
- **Payment System**: Secure payment account setup and management.
- **Admin Portal**: Tools for administrators to manage surveys and customize the site.

### Optional Features (Future Scope)

- Advanced search functionality for records.
- Code-free customization tools for the website.

---

## Deployment

**Note: To be rewritten**

**Prerequisites**

- Ensure both **Node.js** and npm are installed on your machine
- Ensure **Git** is installed on your machine
- Install your preferred IDE (VSCode, Eclipse, etc.). _VSCode recommended for Installation steps_.
- Clone project repository from Github

**Getting Started: Will rewrite soon**

- Navigate to the main project repository on Github and retrieve the project HTTPS URL. This can be done by locating and clicking the green button labeled "Code". Copy the HTTPS URL to your clipboard.
- Once having installed VSCode or your preferred IDE, open the application and open a Gitbash terminal.
- On your IDE's CLI, there will be two commands that must be typed to have a successful run. Begin by typing `git clone` into the terminal, followed by pasting HTTPS URL linked copied to your clipboard - `git clone [HTTPS URL Link]`. After pasting the link, proceed by pressing the 'Enter' key.
- You will see the following output in the terminal, indicating that the repository has been successfully cloned.
- **Placeholder for screenshot**
- Continue by opening a new folder in VSCode / preferred IDE, and navigate to the "8Bits-1Byte-Senior-Project" folder created inside of the directory the previous `git clone` command was run in.
- In VSCode / your preferred IDE, open a new Gitbash command line in order to run a new command to install the necessary scripts needed to run the application. The command is `npm install react-scripts`, and may take approximately a few minutes to fully process.
- Additionally, be sure to provide the following command into the terminal to install an additional dependency - `npm install axios`
- There are two files provided with the delivery of this project, a folder titled "firebase" and a file name "clientID.json". Both of these files must be placed in the "/src" folder of the project.
- Proceed to run the following command in order to create a production build of the React app - `npm run build`
- Upon a successful compilation of the project files, the command line will provide output indicating the 'build' folder is ready to be deployed.
- In order to host the React app on Firebase, provide the following command into the CLI which will bring up a prompt for logging into Firebase - `firebase login`
- Once logged into Firebase, provide this command to commence initializing the project - `firebase init`
- For the first prompt, enter "Y" into the terminal to continue with the initialization process.
- Using the spacebar, select "Realtime Database" and "Hosting" out of the list of features.
- You will be provided more options for the next prompt, select "Use an existing project"
- It is advised to use the recommended directory for the Firebase project. In order to use it, press the "Enter" key at the next prompt.
- Press the "Enter" key again to use the recommended file for the database security system rules.
- On the next prompt, type the keyword `build` into the terminal to set the folder created by the production build of the React app as the public directory.
- To configure the project as a single page app, proceed by entering "y" into the terminal.
- It is advised to **NOT** set up automatic builds and deployments with Github for this project. To proceed with this setting, enter "N" into the terminal.
- Type "n" into the terminal once more in order to prevent the initializer from overwriting the "index.html" in the "build" folder.
- Upon answering all of the previous prompts, the CLI will display that the project has been successfully initialized.
- **Placeholder for screenshot**
- To deploy the project, provide the following command - `firebase deploy`

---

## Testing

Testing will be performed iteratively during development. Placeholder for the following:

- **Unit Testing**: Focus on critical components such as survey submissions and payment workflows.
- **Integration Testing**: Ensuring seamless interaction between modules.
- **User Acceptance Testing (UAT)**: Validating functionalities meet user needs.

---

## Tech Stack

- **Front end**: React, Redux, Tailwind, Next.js, MUI, HTML
- **Back end**: Firebase, Firestore
- **APIs**: Firebase database / Firestore database, PayPal

---

## Timeline & Milestones

Using **JIRA** for task tracking, here are the key milestones for our project:

| Date        | Milestone                        | Status         |
| ----------- | -------------------------------- | -------------- |
| **09/2024** | Initial Project Charter Approval | ✅ Completed   |
| **10/2024** | Functional Requirements Document | ✅ Completed   |
| **11/2024** | Basic Survey Submission Feature  | 🔄 In Progress |
| **01/2025** | Payment System Implementation    | 🔄 In Progress |
| **03/2025** | Admin Portal with Full Features  | ⬜ Upcoming    |
| **05/2025** | Final Product Delivery           | ⬜ Upcoming    |

---

## Learn More

- [Learn more about React](https://react.dev/)
- [Learn more about Firebase](https://firebase.google.com/docs)
