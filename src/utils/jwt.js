import jwt from "jsonwebtoken"

export const SECRET_CODE = "a3asdkiiropxoi65464";

const generateJWT = (user) => {
    return new Promise ((reject, resolve) => {
        jwt.sign({user}, SECRET_CODE, { expiresIn: "30m"}, (err, token) => {
            if(err) {
                console.log(err);
                reject("can not generated Token");
            }
            resolve(token);
        });
    });
}

export default generateJWT