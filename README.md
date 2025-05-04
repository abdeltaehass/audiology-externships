## Table of Contents

- [Enhance Audiology Externship Website](https://github.com/abdeltaehass/audiology-externships?tab=readme-ov-file#enhance-audiology-externship-website)
- [Team Members](https://github.com/abdeltaehass/audiology-externships?tab=readme-ov-file#team-members)
- [Synopsis](https://github.com/abdeltaehass/audiology-externships?tab=readme-ov-file#synopsis)
- [Features](https://github.com/abdeltaehass/audiology-externships?tab=readme-ov-file#features)
- [Deployment](https://github.com/abdeltaehass/audiology-externships?tab=readme-ov-file#deployment)
- [Testing](https://github.com/abdeltaehass/audiology-externships?tab=readme-ov-file#testing)
- [Tech Stack](https://github.com/abdeltaehass/audiology-externships?tab=readme-ov-file#tech-stack)
- [Learn More](https://github.com/abdeltaehass/audiology-externships?tab=readme-ov-file#learn-more)

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
- **Survey Management**: Timestamped survey submissions, admin approval workflows, and database integration.
- **Payment System**: Secure payment account setup and management.
- **Admin Portal**: Tools for administrators to manage surveys and customize the site.
- Advanced search functionality for records.
- Code-free customization tools for the website.

---

## Deployment

- On the top of this page, locate the green "Code" button and clone the repository with the following command in the VSCode terminal:

    ```git clone https://github.com/abdeltaehass/audiology-externships```

- Afterwards, type into the terminal ```cd audiology-externships```

  Within the terminal make sure to type the following commands and install to properly run the site:

    ```npm install```

    ```npx next -v I got Next.js v14.2.24```

    ```npm install zustand@4```

- Afterwards, use the command celow to create a production build of the app:

    ```npm run build```


- To run the site, use the command below, the messages in the terminal indicate the progression of loading up the website locally:

    ```npm run dev```

- For deployment on the left side where NPM Scripts is, click on **deploy** to successfully deploy the site.



---

## Testing

Testing is performed with Vitest. All of the essential dependecies have already been installed and properly configured. What you will need to begin testing is the following:

1. Install Vitest with ```npm install -D vitest```

2. To test every file under the 'Tests' folder, run the following command: 
    ```npm test```

    To test specific files, run the following command:
    ```npm test filename.test.tsx```

From here the tests to be performed should take approximately 5 - 10 seconds to complete.

---

## Tech Stack

- **Front end**: React, Redux, Tailwind, Next.js, MUI, HTML
- **Back end**: Firebase, Firestore
- **APIs**: Firebase database / Firestore database, PayPal

---

## Learn More

- [Learn more about React](https://react.dev/)
- [Learn more about Typescript](https://www.typescriptlang.org/)
- [Learn more about Firebase](https://firebase.google.com/docs)
- [Learn more about Vitest](https://vitest.dev/guide/)
