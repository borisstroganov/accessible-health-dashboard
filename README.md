# Accessible Health Dashboard: Online Speech Therapy Platform
Author: Boris Stroganov - k20040031 (boris.stroganov@kcl.ac.uk / stroganovb@gmail.com)
## Abstract
Technology is rapidly advancing and access to technology is increasing. Medical staff shortage means that waiting times for speech therapy appointments are extremely long and private alternatives are not always an affordable option for everyone. However, commonly available technology can serve as an alternative or at least a supplement to standard speech therapy practices. This project sets out to design and implement an Online Speech Therapy platform for patients to practice independently and track their progress along the way as well as for therapists to assist their patients by providing them with speech therapy assignments and feedback. A user research evaluation was conducted to get feedback on the developed solution through independent application walk-throughs. 

## Building and Running Instructions
Download the zip file containing the full source code and extract the folder.
Open two terminal windows and navigate to the root folder extracted from the zip file.

To run the front-end of the application

In the first window execute:
```
cd client
npm install
npm run dev
```
To run the back-end of the application

In the second terminal window execute:
```
cd server
npm install
npm run dev
```

To run automatic tests with coverage
```
cd server
npm test -- --coverage
```

