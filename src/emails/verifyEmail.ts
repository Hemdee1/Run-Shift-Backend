const verifyEmailTemplate = ({
  firstName,
  link,
}: {
  firstName: string;
  link: string;
}) => {
  // 007ee6

  return `
  <body style="background-color:#f6f9fc;padding:10px 0">
    <table align="center" role="presentation" cellSpacing="0" cellPadding="0" border="0" width="100%" style="max-width:37.5em;background-color:#ffffff;border:1px solid #f0f0f0;padding:45px">
      <tr style="width:100%">
          <table align="center" border="0" cellPadding="0" cellSpacing="0" role="presentation" width="100%">
            <tbody>
              <tr>
                <td>
                  <p style="font-size:16px;line-height:26px;margin:16px 0;font-family:&#x27;Open Sans&#x27;, &#x27;HelveticaNeue-Light&#x27;, &#x27;Helvetica Neue Light&#x27;, &#x27;Helvetica Neue&#x27;, Helvetica, Arial, &#x27;Lucida Grande&#x27;, sans-serif;font-weight:300;color:#404040">Hi ${firstName},</p>
                  <p style="font-size:16px;line-height:26px;margin:16px 0;font-family:&#x27;Open Sans&#x27;, &#x27;HelveticaNeue-Light&#x27;, &#x27;Helvetica Neue Light&#x27;, &#x27;Helvetica Neue&#x27;, Helvetica, Arial, &#x27;Lucida Grande&#x27;, sans-serif;font-weight:300;color:#404040">Thank you for registering with us! To complete the sign-up process and enjoy our services, please verify your email address by clicking the button below:</p><a href=${link} target="_blank" style="background-color:#FFF0E4;border-radius:4px;color:#000;font-family:&#x27;Open Sans&#x27;, &#x27;Helvetica Neue&#x27;, Arial;font-size:15px;text-decoration:none;text-align:center;display:inline-block;width:210px;padding:0px 0px;line-height:100%;max-width:100%"><span><!--[if mso]><i style="letter-spacing: undefinedpx;mso-font-width:-100%;mso-text-raise:0" hidden>&nbsp;</i><![endif]--></span><span style="background-color:#FFF0E4;border-radius:4px;color:#000;font-family:&#x27;Open Sans&#x27;, &#x27;Helvetica Neue&#x27;, Arial;font-size:15px;text-decoration:none;text-align:center;display:inline-block;width:210px;padding:14px 7px;max-width:100%;line-height:120%;text-transform:none;mso-padding-alt:0px;mso-text-raise:0">Verify email</span><span><!--[if mso]><i style="letter-spacing: undefinedpx;mso-font-width:-100%" hidden>&nbsp;</i><![endif]--></span></a>
                  <p style="font-size:16px;line-height:26px;margin:16px 0;font-family:&#x27;Open Sans&#x27;, &#x27;HelveticaNeue-Light&#x27;, &#x27;Helvetica Neue Light&#x27;, &#x27;Helvetica Neue&#x27;, Helvetica, Arial, &#x27;Lucida Grande&#x27;, sans-serif;font-weight:300;color:#404040">This step ensures the security of your account and allows us to keep you updated with important information.</p>
                  <p style="font-size:16px;line-height:26px;margin:16px 0;font-family:&#x27;Open Sans&#x27;, &#x27;HelveticaNeue-Light&#x27;, &#x27;Helvetica Neue Light&#x27;, &#x27;Helvetica Neue&#x27;, Helvetica, Arial, &#x27;Lucida Grande&#x27;, sans-serif;font-weight:300;color:#404040">Note: The link will expire in the next 15 minutes.</p>
                  <p style="font-size:16px;line-height:26px;margin:16px 0;font-family:&#x27;Open Sans&#x27;, &#x27;HelveticaNeue-Light&#x27;, &#x27;Helvetica Neue Light&#x27;, &#x27;Helvetica Neue&#x27;, Helvetica, Arial, &#x27;Lucida Grande&#x27;, sans-serif;font-weight:300;color:#404040">Best regards,</p>
                  <p style="font-size:16px;line-height:26px;margin:16px 0;font-family:&#x27;Open Sans&#x27;, &#x27;HelveticaNeue-Light&#x27;, &#x27;Helvetica Neue Light&#x27;, &#x27;Helvetica Neue&#x27;, Helvetica, Arial, &#x27;Lucida Grande&#x27;, sans-serif;font-weight:300;color:#404040">Run Shift Team</p>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </table>
  </body>
  `;
};

export default verifyEmailTemplate;
