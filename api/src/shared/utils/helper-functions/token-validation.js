const jwt = require("jsonwebtoken");
const jwksClient = require("jwks-rsa");

const signedInDetails = (decodedDetails) => {
  const {
    extension_Rank,
    given_name,
    emails,
    oid,
    extension_Contactnumber,
    extension_role,
    extension_University,
    extension_Faculty
  } = decodedDetails;
  return {
    verified: !!(given_name && emails[0] && oid),
    rank: extension_Rank,
    givenName: given_name,
    email: emails[0],
    userId: oid,
    role: extension_role,
    contact: extension_Contactnumber,
    university:extension_University,
    faculty:extension_Faculty
  };
};
async function tokenValidation(token) {
  if (!token) {
    return {
      verified: false,
    };
  }

  const aud = process.env.B2C_App_ID;
  const client = jwksClient({
    jwksUri: process.env.jwksUri,
    cache: true,
  });

  const kid = jwt.decode(token, { complete: true })?.header.kid;

  try {
    const key = await new Promise((resolve, reject) => {
      client.getSigningKey(kid, (err, key) => {
        if (err) {
          reject(err);
        } else {
          resolve(key);
        }
      });
    });

    const signingKey = key.publicKey || key.rsaPublicKey;

    const decoded = await new Promise((resolve, reject) => {
      jwt.verify(token, signingKey, { audience: aud }, (err, decoded) => {
        if (err) {
          reject(err);
        } else {
          resolve(decoded);
        }
      });
    });
    return signedInDetails(decoded);
  } catch (err) {
    return {
      verified: false,
    };
  }
}

module.exports = { tokenValidation };
