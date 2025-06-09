// import { Resend } from 'resend';
// import dotenv from 'dotenv'
// dotenv.config()

// if(!process.env.RESEND_API){
//     console.log("Provide RESEND_API in side the .env file")
// }

// const resend = new Resend(process.env.RESEND_API);

// const sendEmail = async({name,sendTo,subject,html})=>{
//     try{
//         const { data, error } = await resend.emails.send({
//             from: 'Farm To Spoon <onboarding@resend.dev>',
//             to:'wije99rd@gmail.com',
//             subject: subject,
//             html: html,
//           });

//           if(error){
//             return console.error({error})
//           }

//           return data
//     }catch (error){
//         console.log(error)
//     }
// }
//  export default sendEmail




 // import { Resend } from 'resend';
// import dotenv from 'dotenv'
// dotenv.config()

// if(!process.env.RESEND_API){
//     console.log("Provide RESEND_API in side the .env file")
// }

// const resend = new Resend(process.env.RESEND_API);

// const sendEmail = async({name,sendTo,subject,html})=>{
//     try{
//         const { data, error } = await resend.emails.send({
//             from: 'Farm To Spoon <onboarding@resend.dev>',
//             to:'wije99rd@gmail.com',
//             subject: subject,
//             html: html,
//           });

//           if(error){
//             return console.error({error})
//           }

//           return data
//     }catch (error){
//         console.log(error)
//     }
// }
//  export default sendEmail

import { Resend } from 'resend';
import dotenv from 'dotenv';
dotenv.config();

if (!process.env.RESEND_API) {
  console.error(" Provide RESEND_API inside the .env file");
  process.exit(1);
}

if (!process.env.DEFAULT_EMAIL_TO) {
  console.error("Provide DEFAULT_EMAIL_TO inside the .env file");
  process.exit(1);
}

const resend = new Resend(process.env.RESEND_API);

const sendEmail = async ({ name, sendTo, subject, html }) => {
  try {
    // Use sendTo param if provided, else fallback to DEFAULT_EMAIL_TO from .env
    const recipient = sendTo || process.env.DEFAULT_EMAIL_TO;

    const { data, error } = await resend.emails.send({
      from: 'Farm To Spoon <onboarding@resend.dev>',   
      to: recipient,   
      subject,
      html,
    });

    if (error) {
      console.error("Email sending error:", error);
      return null;
    }
 
    return data;
  } catch (error) {
    console.error("❌ Unexpected error:", error);
    return null;
  }
};

export default sendEmail;
