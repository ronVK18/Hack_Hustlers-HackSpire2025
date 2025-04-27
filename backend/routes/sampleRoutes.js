const express = require('express');
const axios = require('axios');
const nodemailer = require("nodemailer");

const router = express.Router();
// POST /predict-wait-time
router.post('/predict-wait-time', async (req, res) => {
    try {
      const { current_queue_length, staff_count, historical_throughput, is_holiday, weather_condition } = req.body;
    console.log('Received data:', req.body);
      // Forward the body to the external prediction API
      const { data } = await axios.post('https://queue-3-vvk0.onrender.com/predict', {
        current_queue_length,
        staff_count,
        historical_throughput,
        is_holiday,
        weather_condition,
      });
  
      // Extract only the predicted_wait_time_minutes
      const predictedWaitTime = data.predicted_wait_time_minutes;
  
      // Send it back to frontend
      console.log('Predicted wait time:', predictedWaitTime);
      res.json({ predicted_wait_time_minutes: predictedWaitTime });

  
    } catch (error) {
      console.error('Error predicting wait time:', error.message);
      res.status(500).json({ error: 'Failed to predict wait time' });
    }
  });
  



  router.post('/detect-people', async (req, res) => {
    try {
      const { imageUrl } = req.body;
      
      if (!imageUrl) {
        return res.status(400).json({ error: 'Image URL is required' });
      }
      
      const response = await axios({
        method: "POST",
        url: "https://serverless.roboflow.com/crowd-density-ou3ne/1",
        params: {
          api_key: "PVWbuiBzu29tvnwwSi4s",
          image: imageUrl
        }
      });
      
      // Extract the number of people detected
      const detections = response.data.predictions || [];
      const peopleCount = detections.length;
      
      return res.json({ peopleCount });
      
    } catch (error) {
      console.error('Error detecting people:', error);
      return res.status(500).json({ error: 'Failed to detect people' });
    }
  });




  router.post('/check-bottleneck', async (req, res) => {
    try {
      const queueInfo = req.body; // receive data from frontend
     console.log('Received queue info:', queueInfo);

     const requestBody = {
        queue_length: queueInfo.queueLength,
        arrival_rate: queueInfo.arrivalRate,
        departure_rate: queueInfo.departureRate,
        time_of_day: queueInfo.timeOfDay
      };
      
      const response = await fetch("https://bottleneck.onrender.com/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
  
      const result = await response.json(); // get result from external API
     console.log('Bottleneck prediction result:', result);
      return res.json(result); // send result back to frontend
    } catch (error) {
      console.error('Error contacting bottleneck API:', error);
      return res.status(500).json({ error: 'Failed to check bottleneck' });
    }
  });




  const transporter = nodemailer.createTransport({
    service: "Gmail", // Change to your SMTP service (e.g., Yahoo, Outlook)
    auth: {
      user: "drcoder389@gmail.com", // Sender's email address
      pass: "vmam tqmr pkei ekqb", // Sender's email password or App Password
    },
  });


  router.post('/sendemail', async (req, res) => {
    try {
      const recipientEmail = "shubhambera2004@gmail.com";
      const message = req.body;
      
      // Format the time difference for display
    //   const timeDifference = message.timeDifference || 0;
    //   const isDelayed = timeDifference > 0;
    //   const statusText = isDelayed 
    //     ? `Delayed by ${timeDifference} minutes` 
    //     : timeDifference < 0 
    //       ? `Earlier by ${Math.abs(timeDifference)} minutes` 
    //       : 'On time';
      
      const statusColor =  '#4caf50' ;
      
      // Modern HTML email template
      const emailHtml = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Appointment Status Update</title>
    <style>
      /* Base styles */
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        line-height: 1.6;
        color: #333;
        background-color: #f9f9f9;
        margin: 0;
        padding: 0;
      }
      
      /* Container */
      .email-container {
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }
      
      /* Header */
      .header {
        background-color: #2c3e50;
        color: #ffffff;
        padding: 20px;
        text-align: center;
      }
      
      .header h1 {
        margin: 0;
        font-size: 24px;
        font-weight: 600;
      }
      
      /* Status banner */
      .status-banner {
        background-color: ${statusColor};
        color: white;
        padding: 15px;
        text-align: center;
        font-size: 18px;
        font-weight: bold;
      }
      
      /* Content */
      .content {
        padding: 30px;
      }
      
      .appointment-time {
        text-align: center;
        margin-bottom: 30px;
      }
      
      .time-badge {
        display: inline-block;
        font-size: 24px;
        font-weight: bold;
        color: ${statusColor};
        border: 2px solid ${statusColor};
        border-radius: 50px;
        padding: 10px 25px;
        margin-top: 10px;
      }
      
      .factors-heading {
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 15px;
        color: #2c3e50;
        border-bottom: 1px solid #eaeaea;
        padding-bottom: 10px;
      }
      
      .factors-list {
        background-color: #f8f9fa;
        border-radius: 6px;
        padding: 20px;
        margin-bottom: 25px;
      }
      
      .factor-item {
        display: flex;
        align-items: flex-start;
        margin-bottom: 12px;
      }
      
      .factor-item:last-child {
        margin-bottom: 0;
      }
      
      .bullet {
        color: #3498db;
        margin-right: 10px;
        font-weight: bold;
      }
      
      .note {
        background-color: #e8f4fd;
        border-left: 4px solid #3498db;
        padding: 15px;
        margin-top: 20px;
        border-radius: 0 6px 6px 0;
      }
      
      .note p {
        margin: 0;
        color: #2980b9;
      }
      
      /* Footer */
      .footer {
        background-color: #f8f9fa;
        color: #7f8c8d;
        text-align: center;
        padding: 15px;
        font-size: 12px;
        border-top: 1px solid #eaeaea;
      }
      
      .button {
        display: inline-block;
        background-color: #3498db;
        color: white;
        text-decoration: none;
        padding: 12px 25px;
        border-radius: 4px;
        font-weight: 600;
        margin-top: 15px;
      }
      
      @media only screen and (max-width: 600px) {
        .content {
          padding: 20px;
        }
        
        .header h1 {
          font-size: 20px;
        }
        
        .time-badge {
          font-size: 20px;
          padding: 8px 20px;
        }
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="header">
        <h1>Appointment Status Update</h1>
      </div>
      
      <div class="status-banner">
        ${message}
      </div>
      
      <div class="content">
        <div class="appointment-time">
          <p>Your appointment has been updated:</p>
          <div class="time-badge">${message }</div>
        </div>
        
        <h2 class="factors-heading">Factors Affecting Your Appointment</h2>
        
        <div class="factors-list">
          ${message.messageString.split('•').filter(item => item.trim()).map(item => `
            <div class="factor-item">
              <span class="bullet">•</span>
              <span>${item.trim()}</span>
            </div>
          `).join('')}
        </div>
        
       
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="#" class="button">Manage Appointment</a>
        </div>
      </div>
      
      <div class="footer">
        <p>This is an automated notification. Please do not reply to this email.</p>
        <p>&copy; ${new Date().getFullYear()} Your Clinic Name. All rights reserved.</p>
      </div>
    </div>
  </body>
  </html>
      `;
      
      // Keep a plain text version as fallback
      const plainText = `
  Appointment Status Update
  ------------------------
  ${message}
  
  If you need to reschedule, please contact us.
  
  This is an automated notification. Please do not reply to this email.
  © ${new Date().getFullYear()} Your Clinic Name. All rights reserved.
      `;
      
      const mailOptions = {
        from: "drcoder389@gmail.com",
        to: recipientEmail,
        subject: `Appointment Update: ${statusText}`,
        text: plainText,
        html: emailHtml
      };
      
      await transporter.sendMail(mailOptions);
      return res.status(200).json({ message: "Appointment update email sent successfully." });
    } catch (error) {
      console.error("Error sending email:", error.message);
      return res.status(500).json({ message: "Failed to send email.", error: error.message });
    }
  });
  
  // Example of how to call this endpoint from the frontend
  /*
  fetch('/api/sendemail', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messageString: `• Crowd level: 3.5/5
      • Abandonment rate: 8 minutes
      • Equipment recovery time: 15 minutes
      • Staff availability: 4/5
      • System bottleneck: No`,
      timeDifference: -10 // negative means earlier, positive means delayed
    })
  })
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
  */
  


  router.post('/xyz', async (req, res) => {
    try {
      console.log('Received request at /xyz:', req.body);
      
      // Forward the request to the prediction service
      const response = await axios.post('http://localhost:8000/predict_route', req.body, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Response from prediction service:', response.data);
      
      // Send the response back to the client
      res.status(200).json(response.data);
    } catch (error) {
      console.error('Error forwarding request:', error.message);
      
      // Handle different types of errors
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        res.status(error.response.status).json({
          error: 'Error from prediction service',
          details: error.response.data
        });
      } else if (error.request) {
        // The request was made but no response was received
        res.status(503).json({
          error: 'Prediction service unavailable',
          details: 'Could not connect to the prediction service at localhost:8000'
        });
      } else {
        // Something happened in setting up the request
        res.status(500).json({
          error: 'Internal server error',
          details: error.message
        });
      }
    }
  });


  module.exports = router;