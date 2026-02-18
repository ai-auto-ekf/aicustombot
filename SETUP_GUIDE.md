# Google Sheets & Email Automation Setup Guide

This guide will walk you through setting up a free Google Sheet to:
1.  **Save Leads**: Automatically save every form submission to a spreadsheet.
2.  **Notify You**: Send an email to `info@aicustombot.net` when a new lead arrives.
3.  **Auto-Reply**: Send a welcome email to the person who contacted you.

---

## Step 1: Create the Google Sheet

1.  Go to [sheets.new](https://sheets.new) to create a new Google Sheet.
2.  Name the spreadsheet **"AI Custom Bot Leads"**.
3.  Rename the first tab (at the bottom) from `Sheet1` to **`Leads`** (This matches the script code).

---

## Step 2: Open the Script Editor

1.  In your Google Sheet, click on **Extensions** in the top menu.
2.  Select **Apps Script**.
3.  A new tab will open with a code editor.

---

## Step 3: Add the Automation Code

1.  Delete any code currently in the editor (usually `function myFunction() {...}`).
2.  **Copy and paste the entire code block below** into the editor:

```javascript
function doPost(e) {
  try {
    // 1. Parse the incoming JSON data
    var data = JSON.parse(e.postData.contents);
    
    // 2. Get the active spreadsheet and sheet
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Leads");
    
    // If "Leads" sheet doesn't exist, create it and add headers
    if (!sheet) {
      sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet("Leads");
      sheet.appendRow(["Timestamp", "Name", "Email", "Phone", "Company", "Service", "Budget", "Message", "Source"]);
    }
    
    // 3. Append the data to the sheet
    sheet.appendRow([
      new Date(),
      data.name,
      data.email,
      data.phone,
      data.company,
      data.service,
      data.budget,
      data.message,
      data.source || 'website'
    ]);
    
    // 4. Send Notification Email to You (The Business Owner)
    // Add multiple emails separated by commas
    var ownerEmail = "info@aicustombot.net, ehabkhedrfathy@gmail.com"; 
    var subject = "New Lead: " + data.name;
    var body = "You have a new lead from your website:\n\n" +
               "Name: " + data.name + "\n" +
               "Email: " + data.email + "\n" +
               "Phone: " + data.phone + "\n" +
               "Service: " + data.service + "\n" +
               "Budget: " + data.budget + "\n" +
               "Message: " + data.message + "\n\n" +
               "This lead has been saved to your Google Sheet.";
               
    MailApp.sendEmail(ownerEmail, subject, body);
    
    // 5. Send Welcome Email to the Lead
    var leadSubject = "We received your request | AI Custom Bot";
    var leadBody = "Hi " + data.name + ",\n\n" +
                   "Thanks for reaching out to AI Custom Bot. We have received your request regarding " + data.service + ".\n\n" +
                   "One of our team members will review your details and get back to you shortly (usually within 24 hours).\n\n" +
                   "In the meantime, feel free to check out our pricing page for more details on our packages.\n\n" +
                   "Best regards,\n" +
                   "The AI Custom Bot Team\n" +
                   "www.aicustombot.net";
                   
    try {
      // Use the advanced options to set the "from" address (alias)
      // Note: "hello@aicustombot.net" MUST be added as an alias in the Gmail account running this script.
      GmailApp.sendEmail(data.email, leadSubject, leadBody, {
        from: "hello@aicustombot.net",
        name: "AI Custom Bot"
      });
    } catch (emailError) {
      // Fallback if alias is not configured or GmailApp fails
      console.log("Failed to send with alias, trying default: " + emailError.toString());
      MailApp.sendEmail(data.email, leadSubject, leadBody);
    }
    
    // 6. Return success response
    return ContentService.createTextOutput(JSON.stringify({ "result": "success" }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ "result": "error", "error": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

3.  Click the **Save** icon (floppy disk) or press `Cmd + S` (Mac).

---

## Important Note on Aliases
To send emails *from* `hello@aicustombot.net`, you **must** have that email address added as a "Send mail as" alias in the Gmail account where you are running this script.
1.  Go to Gmail Settings > Accounts and Import > "Send mail as".
2.  Ensure `hello@aicustombot.net` is listed there.

---

## Step 4: Deploy (or Update) the Web App

### If this is your FIRST time deploying:
Follow the original instructions below.

### If you are UPDATING the script:
1.  Click **Deploy** -> **Manage deployments**.
2.  Click the **Edit** (pencil icon) next to your existing deployment.
3.  **Version**: Select **New version** from the dropdown. This is critical!
4.  Click **Deploy**.
5.  **Done!** Your existing URL will remain valid. You do **not** need to change the code on your website.

---

## (First Time Only) Deployment Steps

1.  Click the blue **Deploy** button at the top right -> **New deployment**.
2.  Click the **gear icon** ⚙️ next to "Select type" and choose **Web app**.
3.  Fill in these details exactly:
    - **Description**: `Contact Form v1`
    - **Execute as**: `Me (your email address)`
    - **Who has access**: `Anyone` **(IMPORTANT: Must be "Anyone" or it won't work)**
4.  Click **Deploy**.
5.  **Authorize Access**:
    - A popup will ask for permission. Click **Review permissions**.
    - Select your Google account.
    - If you see a "Google hasn't verified this app" screen:
        - Click **Advanced**.
        - Click **Go to Form Handler (unsafe)** (It is safe, it's your own code).
    - Click **Allow**.
6.  **Copy the Web App URL**:
    - You will see a long URL starting with `https://script.google.com/macros/s/...`.
    - **Click Copy**.


---

## Step 5: Link the Script to your Website

1.  Go back to your website code.
2.  Open the file **`scripts.js`**.
3.  Scroll to the top (Line 11), look for this section:

    ```javascript
    // ------------------------------------------------------------------
    // CONFIGURATION: PASTE YOUR GOOGLE APPS SCRIPT WEB APP URL BELOW
    // ------------------------------------------------------------------
    const SCRIPT_URL = 'PASTE_YOUR_WEB_APP_URL_HERE'; 
    ```

4.  **Delete** `'PASTE_YOUR_WEB_APP_URL_HERE'` and **Paste** your Web App URL inside the quotes.
    
    *Example:*
    ```javascript
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz12345ABCDE.../exec';
    ```

5.  Save the file.

---

## Step 6: Test It!

1.  Open your website's **Contact Us** page (`contact.html`) in your browser.
2.  Fill out the form with a test name and email.
3.  Click **Submit**.
    - The button should say "Sending...".
    - Then "Message Sent!".
4.  **Check your Google Sheet**: You should see a new row with the data.
5.  **Check your Email**: You should receive a notification, and the test email address should receive a welcome email.

**You're all set!** Your form is now fully automated.
