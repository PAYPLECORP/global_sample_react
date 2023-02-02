import React, {useState} from "react";
import {useLocation, useNavigate} from "react-router";
import axios from "axios";

function OrderConfirm() {
    // 뒤로가기 버튼 클릭 이벤트 발생시 결제창 화면 닫음
    window.onpopstate = (e) => {
        if (e) {
            window.MainBodyAction('close');
        }
    }

    const location = useLocation();
    const navigate = useNavigate();
    const orderParams = location.state.orderParams ?? null;
    const [isCallGpay, setIsCallGpay] = useState(false);

    if (!orderParams) navigate("/order");

    const handlePaymentReq = () => {
        // 버튼 중복클릭 방지
        setIsCallGpay(true);

        /**
         * 결제요청 파라미터
         * 결제요청 파라미터 중 필수가 아닌 선택 파라미터를 보내시면 결제창에 미리 해당 값을 입력하는 기능을 수행합니다.
         * 고객이 입력해야하는 필드값을 줄어들게 하는 효과가 있습니다.
         * (단, 결제창에 필드값만 해당 - service_oid , isDirect 제외)
         */
        let obj = {};
        obj.service_id = "demo";                                    // [필수] 파트너 ID
        obj.service_oid = orderParams.service_oid;                  // [선택] 주문번호(미지정하는 경우 페이플에서 임의로 지정)
        obj.comments = orderParams.comments;                        // [필수] 상품명
        obj.totalAmount = orderParams.totalAmount;                  // [필수] 결제 요청금액
        obj.currency = orderParams.currency;                        // [필수] 통화
        obj.firstName = orderParams.firstName;                      // [선택] 카드소유주 이름
        obj.lastName = orderParams.lastName;                        // [선택] 카드소유주 성
        obj.email = orderParams.email;                              // [선택] 이메일 주소
        obj.resultUrl = "http://localhost:3001/api/result";         // [필수] 결제결과 반환(Return) URL
        obj.isDirect = orderParams.isDirect;                        // [선택] 결제창 호출 다이렉트 여부 ("" | "Y")

        axios.post('/api/auth').then(res => {
            console.log(res.data)
            /*
             *  테스트 결제인 경우에만 필수로 보내는 파라미터(payCls)
             *  payCls는 파트너 인증 토큰발급 응답값으로 반환되는 값이며,
             *  테스트 결제시에만 필요합니다.
             */
            obj.payCls = res.data.payCls;               // 파트너 인증 토큰발급 응답값으로 오는 payCls 그대로 전송
            obj.Authorization = res.data.access_token;  // 발급받은 Access Token (파트너 인증 토큰발급 응답값 중 access_token)

            console.log("결제창 호출 파라미터: ", obj);
            window.paypleGpayPaymentRequest(obj);
        }).catch(err => {
            setIsCallGpay(false);
            console.error(err);
        });
    }

    return (
        <div className="device__layout w-600">
            <div className="line_setter">
                <h4 className="tit__device mb-32">
                    <img className="logo_in_text__md" src="/images/logo_full.svg" alt=""/>
                    <b> 해외결제 API - 결제창 호출</b>
                </h4>
                <div className="table-outter">
                    <table className="model-01">
                        <colgroup>
                            <col style={{width: '50%'}}/>
                            <col style={{width: '50%'}}/>
                        </colgroup>
                        <thead>
                        <tr>
                            <th>파라미터 항목</th>
                            <th>파라미터 값</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>주문번호</td>
                            <td>{orderParams.service_oid}</td>
                        </tr>
                        <tr>
                            <td>결제고객 이름</td>
                            <td>{orderParams.lastName} {orderParams.firstName}</td>
                        </tr>
                        <tr>
                            <td>결제고객 이메일</td>
                            <td>{orderParams.email}</td>
                        </tr>
                        <tr>
                            <td>상품명</td>
                            <td>{orderParams.comments}</td>
                        </tr>
                        <tr>
                            <td>결제금액</td>
                            <td>{orderParams.currency} {orderParams.totalAmount}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div className="btn_box has_space align_center">
                    <div>
                        결제창 호출방식 : {orderParams.isDirect}
                    </div>
                    <button className="btn cl_main btn_rounded btn_md" type="button" id="gpayOrderFormSubmit"
                            onClick={handlePaymentReq} disabled={isCallGpay}>해외결제하기
                    </button>
                </div>
            </div>
        </div>
    );
}

export default OrderConfirm;
