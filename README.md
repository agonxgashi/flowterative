# flowterative
**Built by Developers for Developers.**

*Note: This project is under heavy construction. As such, the API may change dramatically between major releases and documentation is lacking.*

[]()
---
Whether you’re maintaining a personal todo list, planning your holidays with some friends, or working in a team on your next revolutionary idea, Kanban boards are an unbeatable tool to keep your things organized. They give you a visual overview of the current state of your project, and make you productive by allowing you to focus on the few items that matter the most.


## How to run the project:
First thing you have to do is to create a file with necessary configurations to connect with database. Do do this, navigate to ``./server/config`` folder and create a file named ``dbConfig.json``. On this file paste below values:

```json
  {
      "MongoConStr": "<<your_connection_string_here>>"
  }
```

Replace `<<your_connection_string_here>>` with your connection string for mongo database and you should be good to continue.

You need to perform below steps to start the appliaction:
  - Go to /client directory and install packages using ```npm isntall```
  - Build Angular app using ```ng build``` command
  - Return on the main directory to install back-end packages ```npm install```
  - Run server using command ```node index.js```

## Contribute
  - If you have discovered a bug or have a feature suggestion, feel free to create an issue on Github.
  - If you'd like to make some changes yourself, see the following:
    - Fork this repository to your own GitHub account and then clone it to your local device
    - Install packages and run this project on your local device

> Note: Currently I'm not accepting PR!

## Authors
Flowterative is a project by : [@agonxgashi](https://t.me/agonxgashi)
