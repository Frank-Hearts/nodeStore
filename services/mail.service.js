const fs = require('fs');
const path = require('path');
const transporter = require("../config/mail.config");

const {GMAIL_USER, APP_NAME} = process.env;

exports.sendVerificationEmail = async(to, fullName, code) => {
    const templatePath = path.join(__dirname, "..", "template","verification.html");
    let html = fs.readFileSync(templatePath, "utf-8");

    html = html
        .replace("{{fullName}}", fullName)
        .replace("{{code}}", code)
        .replace("{{year}}", new Date().getFullYear());

    const mailOptions = {
        from: `${APP_NAME} <${GMAIL_USER}>`,
        to,
        date: new Date(),
        subject: "Verify Your Email",
        html,
    }

    return transporter.sendMail(mailOptions)
}

exports.sendPasswordResetEmail = async(to, fullName, token) => {
    const templatePath = path.join(__dirname, "..", "template","passwordReset.html");
    let html = fs.readFileSync(templatePath, "utf-8");

    const resetLink = `https://spellahub.com/about-us?&email=${to}`;
    html = html
        .replace("{{fullName}}", fullName)
        .replace("{{code}}", token)
        .replace("{{resetLink}}", resetLink)
        .replace("{{year}}", new Date().getFullYear());
    
    const mailOptions = {
        from: `${APP_NAME} <${GMAIL_USER}>`,
        to,
        date: new Date(),
        subject: "Reset Password Request 🔐",
        html,
    }
    return transporter.sendMail(mailOptions)
}
exports.sendAccountDeletionEmail = async(to, fullName, token) => {
    const templatePath = path.join(__dirname, "..", "template","accountDeletion.html");
    let html = fs.readFileSync(templatePath, "utf-8");

    const splitFullName = fullName.split(" ");
    const firstName = splitFullName[0];
    html = html
        .replace("{{fullName}}", firstName)
        .replace("{{code}}", token)
        .replace("{{year}}", new Date().getFullYear());
    
    const mailOptions = {
        from: `${APP_NAME} <${GMAIL_USER}>`,
        to,
        date: new Date(),
        subject: "Account Deletion Request 🗑️",
        html,
    }
    return transporter.sendMail(mailOptions)
}