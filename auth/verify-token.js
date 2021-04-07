const jwt = require('jsonwebtoken');


module.exports =   function (req, res, next){
    const token = req.header('auth-token');
    if(!token) return res.status(401).send('Access Denied');

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SEC_KEY);  // 사용자 정보를 객체로 반환함
        console.log('token user information : ');
        console.log(verified);
        req.user = verified; // 요청 객체에  user 객체로 사용자 정보를 추가함
        next();  // 처리가 완료되면 다음 메소드로 진행 함
    } catch (error) {
        res.status(400).send('Invalid Token');
    }

};

