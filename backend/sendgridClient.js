const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY); // Ensure the SendGrid API key is correctly set in your .env file

const sendEmail = async (puppy) => {
  const msg = {
    to: process.env.RECEIVER_EMAIL, // Use the email from the environment variable
    from: process.env.SENDGRID_FROM_EMAIL, // Use the sender email from the environment variable
    subject: 'New Puppy Added!',
    html: `<strong>${puppy.name}</strong>, ${puppy.age_est} years old, ${puppy.breed} has just been added to the system!`
  };

  sgMail
  .send(msg)
  .then(() => {
    console.log('Email sent')
  })
  .catch((error) => {
    console.error(error)
  })
};

module.exports = sendEmail;