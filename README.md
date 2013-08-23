Quickstart: Google+ Sign-In for server-side apps
===
This is a Node.js port of the existing php Quickstart guide found at:
[Google+ Sign-In for server-side apps](https://developers.google.com/+/web/signin/server-side-flow)

Install and run it with:

```
    git clone https://github.com/alfonsodev/gplus-quickstart-nodejs.git
    cd gplus-quickstart-nodejs/
    npm install
    export DEBUG=$DEBUG,google*
    node app.js
```
The export DEBUG is optional, but it will show you all debugging messages.

The image below shows the 7 steps that this sample app makes: 
---
![Server side flow Google Sig-in](https://developers.google.com/+/images/server_side_code_flow.png "Server side flow for Google Sig-in")
