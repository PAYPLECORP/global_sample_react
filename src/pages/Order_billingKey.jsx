import React from "react";
import {useLocation} from "react-router";
import $ from "jquery";
import axios from "axios";


function OrderBillingKey() {

    const location = useLocation();
    const orderParams = location.state.orderParams;

    let api_id = '';

    const billKeyReq = () => {
        $('#payBillingKey').on('click', async function () {
            if (window.confirm("빌링키 결제요청을 전송합니다. 진행하시겠습니까?")) {

                // 버튼 중복클릭 방지
                $('#payBillingKey').unbind('click');

                axios.post('/api/payBillkey', {
                    service_oid: orderParams.service_oid,               // [선택] 주문번호
                    comments: orderParams.comments,                     // [필수] 상품명
                    billing_key: orderParams.billing_key,               // [필수] 빌링키 (카드정보를 암호화 한 키 값)
                    securityCode: orderParams.securityCode,             // [필수] 카드 CVC/CVV 번호
                    totalAmount: orderParams.totalAmount,               // [필수] 결제 요청금액
                    currency: orderParams.currency,                     // [필수] 통화
                    firstName: orderParams.firstName,                   // [선택] 카드소유주 이름 (보내지 않을 경우, 최초 결제시 입력한 카드소유주 이름으로 결제요청이 됩니다.)
                    lastName: orderParams.lastName,                     // [선택] 카드소유주 성 (보내지 않을 경우, 최초 결제시 입력한 카드소유주 성으로 결제요청이 됩니다.)
                    email: orderParams.email,                           // [선택] 이메일 주소  (보내지 않을 경우, 최초 결제시 입력한 이메일 주소로 결제요청이 됩니다.)
                    phoneNumber: orderParams.phoneNumber,               // [선택] 휴대전화 번호  (보내지 않을 경우, 최초 결제시 입력한 휴대전화 번호로 결제요청이 됩니다.)
                    resultUrl: orderParams.resultUrl                    // [선택] 해당 파라미터(resultUrl)는 별도의 기능은 하지 않으나, 파트너사에서 빌링키 결제 성공시 리다이렉트 하는 등 활용할 수 있는 파라미터입니다.
                }).then(({data}) => {
                    $('#billingOrderBody').css('display', 'none');
                    $('#payResTable').css('display', 'none');
                    $('#responseBody').css('display', 'block');
                    $('#billingTable').css('display', 'block');

                    if (data.result === 'A0000') {
                        alert(data.message);
                        api_id = data.api_id;   // 결제 요청 고유키
                        $('#payConfirmCancel').css('display', 'inline');

                    } else {
                        if (data.message) {
                            alert(data.message);
                        } else {
                            alert('빌링키 결제 요청 실패');
                        }
                    }
                    let table_data = "";
                    for (let iterKey in data) {
                        table_data += '<tr><td>' + iterKey + '</td><td>' + data[iterKey] + '</td><tr>';
                    }

                    $('#billingResult').append(table_data);
                }).catch(err => {
                    console.error(err);
                });
            }
        });
    }

    const cancelReq = () => {
        if (window.confirm("승인취소요청을 전송합니다. 진행하시겠습니까?")) {
            // 버튼 중복클릭 방지
            $('#payConfirmCancel').unbind('click');

            axios.post('/api/cancel', {
                comments: orderParams.comments,             // [필수] 상품명
                service_oid: orderParams.service_oid,       // [필수] 주문번호
                pay_id: api_id,                             // [필수] 취소할 결제건의 api_id
                totalAmount: orderParams.totalAmount,       // [필수] 결제 취소 요청금액
                currency: orderParams.currency,             // [필수] 통화 (취소할 결제건의 통화로 보내야합니다)
                resultUrl: ""                               // [선택] 파트너사에서 취소 성공시 리다이렉트 하는 등 활용할 수 있는 파라미터입니다.
            }).then(({data}) => {
                if (data.result === 'A0000') {
                    alert(data.message);
                    $('#payConfirmCancel').css('display', 'none');
                } else {
                    if (data.message) alert(data.message)
                    else alert('승인취소 요청 실패');
                }

                let table_data = "";
                for (let iterKey in data) {
                    table_data += '<tr><td>' + iterKey + '</td><td>' + data[iterKey] + '</td><tr>';
                }

                $('#payRefundResult').append(table_data);
            }).catch(err => {
                console.error(err);
            });
        }

    }


    return (
        <>
            <div className="device__layout w-600" id="billingOrderBody" style={{display: 'block'}}>
                <div className="line_setter">
                    <h4 className="tit__device mb-32">
                        <img className="logo_in_text__md" src="/images/logo_full.svg" alt=""/>
                        <b>해외결제 API - 빌링키 결제</b>
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
                                <td>빌링키</td>
                                <td>{orderParams.billing_key}</td>
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
                        <button className="btn cl_main btn_rounded btn_md" type="button" id="payBillingKey"
                                onClick={billKeyReq}>빌링키 결제하기
                        </button>
                    </div>
                </div>
            </div>

            <div className="device__layout w-600" id="responseBody" style={{display: 'none'}}>
                <div className="line_setter">
                    <h4 className="tit__device mb-32">
                        <img className="logo_in_text__md" src="/images/logo_full.svg" alt=""/>
                        해외결제 결과
                    </h4>
                    <br/><br/>
                    <div id="billingTable" style={{display: 'none'}}>
                        <b>Billing Key Response (빌링키 결제 결과)</b><br/><br/>
                        <div className="table-outter">
                            <table className="model-01" id='billingResult'>
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
                            </table>
                        </div>
                        <div className="btn_box has_space align_center">
                            <button className="btn cl_main btn_rounded btn_md" type="button" id="payConfirmCancel"
                                    onClick={cancelReq}
                                    style={{display: 'none'}}>
                                결제승인취소
                            </button>
                        </div>
                    </div>
                    <b>Response (취소 결과)</b><br/><br/>
                    <div className="table-outter">
                        <table className="model-01" id="payRefundResult">
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
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}

export default OrderBillingKey;
