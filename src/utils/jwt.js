import jwt from "jsonwebtoken"


export const SECRET_CODE = "a3asdkiiropxoi65464";

export const generateJWT = (user) => {
        const token = jwt.sign({user}, SECRET_CODE, { expiresIn: "30m"})
        return token;
};

export const cookieExtractor = req => {
        let token = null;
        if (req && req.cookies) {
                token = req.cookies["cookieToken"]
        }
        return token
};