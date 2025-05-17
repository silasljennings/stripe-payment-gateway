## Stripe Payment Gateway

A simple **Stripe payment gateway** integration with **ngrok** for local development. This project walks you through setting up a Stripe API Server that is ready to deploy and be consumed by your client.

This file will walk you through setup, local development and testing, and service deployment.

### Installation & Setup

In order to run this application locally you will need to do the following:
1. Create a Stipe account and paste your TEST secret key in the env.local file for the variable STRIPE_SECRET_KEY
2. Run the following ngrok command to install ngrok
   ```bash 
   brew install ngrok
   ```
   If you haven't created an ngrok account, you will need to click the link returned from the installation command and do so.
3. After you have installed ngrok and created an account, copy your account auth token in your ngrok dashboard online.
4. Once your auth token is copied, paste the token on the "authtoken" property in the ngrok.yml and run 
5. You are now ready to start the server and run the application. We have not setup a Stripe webhook endpoint yet to monitor stripe events, but we will do that in the next step.
    ```bash
    npm install
   ```
   ```bash
   npm start
   ```
6. The server should now be running at http://localhost:3005 and ngrok should have created your public endpoint. You can check this by going to the endpoints page in your ngrok dashboard. This will be the URL you will copy to create your Stripe webhook endpoint.
7. After copying the URL, navigate to your stripe test account and create your webhook endpoint. You will first be selecting the events you wish to see. Then paste the ngrok URL you copied into the URL field for the webhook configuration and save the endpoint.
8. Last but not least, copy your webhook secret key in the stripe console and paste it into the .env.local file for the STRIPE_WEBHOOK_SECRET.

### Testing & Development
To test the results of calling the stripe api, navigate to the "rest" folder and cycle through each http file and execute the requests. On request success, you can see the results in the http console, the logging in the terminal, and the webhook event payload being triggered in the stripe webhook logs will be visible in the terminal.

It is important to note that if you do not subscribe to the particular event being executed, then the event will not show up in the stripe webhook event logs. It is also important to not that if you have to restart the application, you will need to go back to your ngrok dashboard and copy the url to the Stripe webhook endpoint as you did in step 6 & 7 of installation & setup. 


