function doPost(e) {
  try {
    // 1. Parse the incoming JSON data
    // The fetch request from the website sends data as a JSON string in the post body
    var data = JSON.parse(e.postData.contents);
    
    // 2. Get the active spreadsheet and sheet
    // Ensure you have a sheet named "Leads" or change the name below
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
    // We must return a key 'result' set to 'success' for the frontend to know it worked
    return ContentService.createTextOutput(JSON.stringify({ "result": "success" }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Return error response
    return ContentService.createTextOutput(JSON.stringify({ "result": "error", "error": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
