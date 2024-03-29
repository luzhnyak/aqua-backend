const nodemailer = require("nodemailer");
const path = require("path");
const pug = require("pug");
const { convert } = require("html-to-text");

const { serverConfig } = require("../../configs");
const i18next = require("../../locales/config");

class Email {
  constructor(user, url, language = "en") {
    this.to = user.email;
    this.name = user.name ? user.name : "User";
    this.url = url;
    this.from = serverConfig.metaEmailUser;
    this.language = language;
    console.log(language);
  }

  _initTransport() {
    return nodemailer.createTransport({
      host: "smtp.meta.ua",
      port: 465,
      auth: {
        user: serverConfig.metaEmailUser,
        pass: serverConfig.metaEmailPass,
      },
    });
  }

  async _send(template, subject) {
    const html = pug.renderFile(
      path.join(__dirname, "..", "..", "views", "email", `${template}.pug`),
      {
        name: this.name,
        url: this.url,
        subject,
        t: (key) => i18next.t(key, { lng: this.language }),
      }
    );

    const emailConfig = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: convert(html),
    };

    await this._initTransport().sendMail(emailConfig);
  }

  async sendHello() {
    await this._send("verify", "Verify your email");
  }

  async forgotPass() {
    await this._send("forgotPass", "Reset password for WaterApp");
  }
}

module.exports = Email;
