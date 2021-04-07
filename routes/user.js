const router = require("express").Router(); // api를 router를 이용하여 작성한다. 
const verify = require('../auth/verify-token'); // token  검사 
const {registerValidation, userUpdateValidation} = require('../validation/user.validation'); // validation
const bcrypt = require('bcryptjs'); // 암호화 
let  User  = require('../model/user.model'); // users model


/****************************************************************************************************
 *  API : 사용자 리스트 (Promise를 이용 )
 * --------------------------------------------------------------------------------------------------
 *  Description : 
 *  등록된 사용자 전체 목록을 보여준다.
 ****************************************************************************************************/
router.get('/', (req, res) => {
    User.find()
    .then( users =>  res.json(users))
    .catch( err => res.status(400).json( 'error: '  + err ));
});

/****************************************************************************************************
 *  API : 사용자 상세 정보
 * --------------------------------------------------------------------------------------------------
 *  Description : 
 *  사용자 상세 정보를 보여준다.
 ****************************************************************************************************/
router.get('/:id', async (req, res) => {

    console.log("id is a " + req.params.id);
    
    const userExist = await User.findOne({ _id :  req.params.id });
 
    console.log(userExist);
 
     try {
         res.json(userExist); // 등록된 문서 아이디
 
     } catch (err) {
         res.status(400).send(err);
     }
});


/****************************************************************************************************
 *  API : 사용자 등록 (async, await를 이용 )
 * --------------------------------------------------------------------------------------------------
 *  Description : 
 *  신규 사용자를 등록한다.
 ****************************************************************************************************/
router.post('/add', async (req, res) => {
    // 유효성 검사
    const { error } = registerValidation(req.body);
    if(error)  return res.status(400).send(error.details[0].message);

    // 기 등록된 계정 정보가 있는지 확인
    const emailExist = await User.findOne({email : req.body.email});
    console.log("cheking user exist.." + emailExist);
    if(emailExist) res.status(400).send('Email already exists');

    // 비밀번호 암호화 처리 
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password , salt);

    // regist a new user
    const user = new User({ // 몽고 디비에 저장하기 위해 스키마에 값을 바인딩 한다.
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword // 암호화된 값으로 변경 
    });
    
    try {
        // write code to connect to db
        console.log("waiting saveUser");
        const savedUser = await user.save(); //값 저장

        res.send({user : user._id}); // 등록된 문서 아이디 반환(고유값)

        console.log("ended registers")
    } catch (err) {
        res.status(400).send(err);
    }
});

/****************************************************************************************************
 *  API : 사용자 변경
 * --------------------------------------------------------------------------------------------------
 *  Description : 
 *      사용자 정보를 변경한다. 
 *      - name, email 정보만 변경
 ****************************************************************************************************/
router.put('/:id', async (req, res) => {

    
    // 유효성 검사
    console.log(req.params);
    console.log(req.body);
    const { error } = userUpdateValidation(req.body);
    if(error)  return res.status(400).send(error.details[0].message);
    
    // db에서 값 검색
    const idExist = await User.findOne({_id : req.params.id });

    console.log('found user');
    console.log(idExist);


    // 값 변경
    idExist.name = req.body.name;
    idExist.email = req.body.email;

    
    try {
        // write code to connect to db
        console.log("waiting saveUser");
        const savedUser = await User.updateOne(
            { _id : req.params.id},  // key
            idExist                  // 변경 document
        );
 
        res.send(savedUser); // 처리 결과 전송
 
        console.log("ended updating");
    } catch (err) {
        console.log('error : ' + err.message);
        res.status(400).send(err);
    }
    
});

/****************************************************************************************************
 *  API : 사용자 삭제
 * --------------------------------------------------------------------------------------------------
 *  Description : 
 *      사용자를 삭제 한다.
 ****************************************************************************************************/
router.delete('/:id', async (req, res) => {
    console.log("id is a " + req.params.id);
    const userExist = await User.deleteOne({ _id :  req.params.id });
    console.log('deleted counts = '+userExist.deletedCount);
     try {
         res.json(userExist); // 등록된 문서 아이디
 
     } catch (err) {
         res.status(400).send(err);
     }
});

module.exports = router;