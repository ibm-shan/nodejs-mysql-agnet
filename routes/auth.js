const router = require("express").Router(); // api를 router를 이용하여 작성한다. 
const Auth = require('../model/auth.model'); // 정의한 몽고디비 스키마 import, 위치에 주의 한다. 
const { registerValidation, loginValidation } = require('../validation/user.validation'); // joi를 이용한 validation  function 
const bcrypt = require('bcryptjs'); // 암호화 
const jwt = require('jsonwebtoken'); // jwt 



/**
 * API : 계정 등록하기
 * Description : 
 *   신규 사용자를 등록하는 기능을 한다. 
 *     - 사용자로부터 입력 받은 값에 대하여 유효성 체크
 *     - 비밀번호 암호화 처리
 *     - 사용자 중복 체크
 */
router.post('/register', async (req, res) => {
    console.log("register");

    // 유효성 검사
    const { error } = registerValidation(req.body);
    if(error)  return res.status(400).send(error.details[0].message);

    // 기 등록된 계정 정보가 있는지 확인
    const emailExist = await Auth.findOne({email : req.body.email});
    console.log("cheking user exist.." + emailExist);
    if(emailExist) res.status(400).send('Email already exists');

    // 비밀번호 암호화 처리 
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password , salt);
    

    // regist a new user
    const user = new Auth({ // 몽고 디비에 저장하기 위해 스키마에 값을 바인딩 한다.
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword // 암호화된 값으로 변경 
    });
    console.log("name : " + user.name);
    console.log("email : " + user.email);

    try {
        // write code to connect to db
        console.log("waiting saveUser");
        const savedUser = await user.save(); //값 저장

        // return result
        // res.send(savedUser); // 결과값 리턴

        res.send({user : user._id}); // 등록된 문서 아이디 반환(고유값)


        console.log("ended registers")
        // res.send('test'); 
    } catch (err) {
        res.status(400).send(err);
    }
});


/**
 * API : 로그인
 * Description : 
 *   로그인 처리를 진행한다.
 *     - 사용자로부터 입력 받은 값에 대하여 유효성 체크
 *     - 비밀번호 암호화 처리
 *     - 사용자 중복 체크
 */
router.post('/login', async (req, res) => {
        // 유효성 검사
        const { error } = loginValidation(req.body);
        if(error)  return res.status(400).send(error.details[0].message);

        // 기 등록된 계정 정보가 있는지 확인
        const userExist = await Auth.findOne({email : req.body.email});
        if(!userExist) res.status(400).send('Email is not found');
    
        // 암호화 비교 
        const comparePass = await bcrypt.compare(req.body.password, userExist.password);
        if(!comparePass) return res.status(400).send('Invalid password');

        // jwt 토큰 생성
        const token = jwt.sign({_id : userExist._id}, process.env.TOKEN_SEC_KEY); 
        res.header('auth-token', token).send(token);
        // login 성공
        // res.send('Success Login!'); 
        

});

module.exports = router;
