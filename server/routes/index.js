const express = require("express");
const axios = require("axios");
const router = express.Router();


/**
 * POST /api/auth, 파트너 인증 API
 * 1. 파트너 인증을 위한 토큰 발급은 결제요청(취소) 전 필수로 진행
 * 2. 토큰의 유효기간인 10분이 지나면 요청이 거부되니 유의해주세요.
 * 3. (운영) 파트너 인증 토큰발급 요청시에는 등록한 IP(White IP)와의 통신만 허용합니다.
 */
router.post('/auth', async (req, res) => {
    try {
        const authParams = {
            service_id: process.env.SERVICE_ID,     // 파트너 ID
            service_key: process.env.SERVICE_KEY,   // 파트너 인증키
            code: "as12345678"                      // 파트너용 토큰 확인 코드
        }

        /*
         * 파트너 인증 HTTP URL
         * TEST : https://demo-api.payple.kr/gpay/oauth/1.0/token
         * REAL : https://api.payple.kr/gpay/oauth/1.0/token
         */
        const {data} = await axios.post('https://demo-api.payple.kr/gpay/oauth/1.0/token', authParams, {
            headers: {
                'content-type': 'application/json',
                'Cache-Control': 'no-cache'
            }
        });
        res.status(200).json(data);
    } catch (e) {
        console.error(e);
        res.status(400).send(e.message);
    }
});


// POST /api/result, Server 결제결과 수신
router.post('/result', (req, res) => {
    console.log('결제결과수신: ', req.body);
    const responseData = {
        type: req.body.type,                              // 요청종류 [결제: PAYMENT | 취소: CANCEL]
        result: req.body.result,                          // 응답 코드
        message: req.body.message,                        // 응답 메시지
        resultUrl: req.body.resultUrl,                    // 결제결과 반환(Return) URL
        api_id: req.body.api_id,                          // 결제 요청 고유키
        api_date: req.body.api_date,                      // 결제 시간 (페이플 서버기준: GMT +9)
        service_oid: req.body.service_oid,                // 주문번호
        comments: req.body.comments,                      // 상품명
        pay_type: req.body.pay_type,                      // 결제수단
        card_number: req.body.card_number,                // 카드번호 (일부 마스킹 처리)
        totalAmount: req.body.totalAmount,                // 결제 요청금액
        currency: req.body.currency,                      // 통화
        firstName: req.body.firstName,                    // 카드소유주 이름
        lastName: req.body.lastName,                      // 카드소유주 성
        address1: req.body.address1,                      // 도로명
        locality: req.body.locality,                      // 시/구/군
        administrativeArea: req.body.administrativeArea,  // 국가
        postalCode: req.body.postalCode,                  // 도/시 (국가가 미국(US), 혹은 캐나다(CA)인 경우에는 선택한 도/시 코드가 반환됩니다.)
        country: req.body.country,                        // 우편번호
        email: req.body.email,                            // 이메일 주소
        phoneNumber: req.body.phoneNumber,                // 휴대전화 번호
        billing_key: req.body.billing_key,                // 빌링키 (카드정보를 암호화 한 키 값)
        submitTimeUtc: req.body.submitTimeUtc             // 결제 시간
    }

    // Client Page(ReactJS)로 결과전송
    res.status(301).redirect(process.env.CLIENT_HOSTNAME+ '/result?' + encodeURIComponent(JSON.stringify(responseData)));
})


// POST /api/payBillkey, 빌링키 결제 API
router.post('/payBillkey', async (req, res) => {
    try {
        // 빌링키 결제요청전 파트너 인증
        const {data} = await axios.post(process.env.SERVER_HOSTNAME + '/api/auth');
        const accessToken = data.access_token;
        const payData = {
            service_id: process.env.SERVICE_ID,                     // [필수] 파트너 ID
            service_oid: req.body.service_oid,                      // [선택] 주문번호
            comments: req.body.comments,                            // [필수] 상품명
            billing_key: req.body.billing_key,                      // [필수] 빌링키 (카드정보를 암호화 한 키 값)
            securityCode: req.body.securityCode,                    // [필수] 카드 CVC/CVV 번호
            totalAmount: req.body.totalAmount,                      // [필수] 결제 요청금액
            currency: req.body.currency,                            // [필수] 통화
            firstName: req.body.firstName,                          // [선택] 카드소유주 이름 (보내지 않을 경우, 최초 결제시 입력한 카드소유주 이름으로 결제요청이 됩니다.)
            lastName: req.body.lastName,                            // [선택] 카드소유주 성 (보내지 않을 경우, 최초 결제시 입력한 카드소유주 성으로 결제요청이 됩니다.)
            country: req.body.country,                              // [선택] 국가 (보내지 않을 경우, 최초 결제시 입력한 국가로 결제요청이 됩니다.)
            administrativeArea: req.body.administrativeArea,        // [선택] 도/시 (보내지 않을 경우, 최초 결제시 입력한 도/시로 결제요청이 됩니다.)
            locality: req.body.locality,                            // [선택] 시/구/군 (보내지 않을 경우, 최초 결제시 입력한 시/구/군으로 결제요청이 됩니다.)
            address1: req.body.address1,                            // [선택] 도로명  (보내지 않을 경우, 최초 결제시 입력한 도로명으로 결제요청이 됩니다.)
            postalCode: req.body.postalCode,                        // [선택] 우편번호  (보내지 않을 경우, 최초 결제시 입력한 우편번호로 결제요청이 됩니다.)
            email: req.body.email,                                  // [선택] 이메일 주소  (보내지 않을 경우, 최초 결제시 입력한 이메일 주소로 결제요청이 됩니다.)
            phoneNumber: req.body.phoneNumber,                      // [선택] 휴대전화 번호  (보내지 않을 경우, 최초 결제시 입력한 휴대전화 번호로 결제요청이 됩니다.)
            resultUrl: req.body.resultUrl                           // [선택] 해당 파라미터(resultUrl)는 별도의 기능은 하지 않으나, 파트너사에서 빌링키 결제 성공시 리다이렉트 하는 등 활용할 수 있는 파라미터입니다.
        }

        /*
         * 빌링키 결제 Request HTTP URL
         * TEST : https://demo-api.payple.kr/gpay/billingKey
         * REAL : https://api.payple.kr/gpay/billingKey
         */
        const result = await axios.post('https://demo-api.payple.kr/gpay/billingKey', payData, {
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'
            }
        });
        console.log("빌링키 결제 API 결과", result.data);
        res.status(200).json(result.data);
    } catch (e) {
        console.error(e);
        res.status(400).send(e.message);
    }
})

// POST /api/cancel, 결제취소 API
router.post('/cancel', async (req, res) => {
    try {
        // 결제취소전 파트너 인증
        const {data} = await axios.post(process.env.SERVER_HOSTNAME + '/api/auth');
        const accessToken = data.access_token;

        const cancelData = {
            service_id: process.env.SERVICE_ID,                 // [필수] 파트너 ID
            comments: req.body.comments,                        // [필수] 상품명
            service_oid: req.body.service_oid,                  // [필수] 주문번호
            pay_id: req.body.pay_id,                            // [필수] 취소할 결제건의 api_id
            totalAmount: req.body.totalAmount,                  // [필수] 결제 취소 요청금액
            currency: req.body.currency,                        // [필수] 통화 (취소할 결제건의 통화로 보내야합니다)
            resultUrl: "http://localhost:3001/api/result"       // [선택] 파트너사에서 취소 성공시 리다이렉트 하는 등 활용할 수 있는 파라미터입니다.
        }

        /*
         * 결제취소 Request HTTP URL
         * TEST : https://demo-api.payple.kr/gpay/cancel
         * REAL : https://api.payple.kr/gpay/cancel
         */
        const result = await axios.post('https://demo-api.payple.kr/gpay/cancel', cancelData, {
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'
            }
        });
        console.log("결제취소 API 결과", result.data);
        res.status(200).json(result.data);
    } catch (e) {
        console.error(e);
        res.status(400).send(e.message);
    }
})

module.exports = router;