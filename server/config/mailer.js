const {Resend}=require('resend');

const resend=new Resend(process.env.RESEND_API_KEY);

const sendEmail=async({to,subject,html})=>{
    const { data, error } = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: to,
    subject: subject,
    html: mailType[html] || html,
  });
    if(error){
        return error;
    }
  return data;
};

const mailType={
    "schema-change":"<p>The schema for your project has changed.</p>",
    "welcome":"<h1>Welcome to Dbify!</h1><p>We're excited to have you on board. Get started by creating your first project and connecting your database.</p>",
    "password-reset":"<p>Click <a href=''>here</a> to reset your password.</p>",
    "verification":"<p>Click <a href=''>here</a> to verify your email address.</p>",
    "project-deletion":"<p>Your project has been deleted successfully.</p>",
    "signup":"<h1>Welcome to Dbify!</h1><p>We're excited to have you on board. Get started by creating your first project and connecting your database.</p>",
    "ddos-attack":"<h1>Alert: Potential DDoS Attack Detected</h1><p>We have detected unusual activity on your account that may indicate a Distributed Denial of Service (DDoS) attack. Please review your account activity and take necessary precautions.</p>",
    "account-suspension":"<h1>Account Suspension Notice</h1><p>Your account has been temporarily suspended due to suspicious activity. Please contact our support team to resolve this issue and restore access to your account.</p>",
    "subscription-expiry":"<h1>Subscription Expiry Notice</h1><p>Your subscription is set to expire soon. To continue enjoying our services without interruption, please renew your subscription at your earliest convenience.</p>",
    "payment-failure":"<h1>Payment Failure Notification</h1><p>We were unable to process your recent payment. Please update your payment information to avoid any disruption to your services.</p>",
}


module.exports={sendEmail};