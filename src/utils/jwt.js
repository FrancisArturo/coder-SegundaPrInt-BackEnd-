import jwt from "jsonwebtoken"

export const SECRET_CODE = "a3asdkiiropxoi65464";

export const generateJWT = (user) => {
        const token = jwt.sign({user}, SECRET_CODE, { expiresIn: "30m"})
        return token;
    };

