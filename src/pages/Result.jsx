import React from "react";
import {useLocation, useNavigate} from "react-router";
import $ from "jquery";
import axios from "axios";


function Result() {
    const location = useLocation();
    const navigate = useNavigate();
    const orderParams = JSON.parse(decodeURIComponent(location.search.substring(1)));

    if (!location.search) navigate("/order");

    const cancelReq = async () => {
        if (window.confirm("승인취소요청을 전송합니다. 진행하시겠습니까?")) {
            // 버튼 중복클릭 방지
            $('#payConfirmCancel').unbind('click');

            axios.post('/api/cancel', {
                comments: orderParams.comments,                             // [필수] 상품명
                service_oid: orderParams.service_oid,                       // [필수] 주문번호
                pay_id: orderParams.api_id,                                 // [필수] 취소할 결제건의 api_id
                totalAmount: orderParams.totalAmount,                       // [필수] 결제 취소 요청금액
                currency: orderParams.currency,                             // [필수] 통화 (취소할 결제건의 통화로 보내야합니다)
                resultUrl: process.env.SERVER_HOSTNAME + "/api/result"      // [선택] 파트너사에서 취소 성공시 리다이렉트 하는 등 활용할 수 있는 파라미터입니다.
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
        <div className="device__layout w-600" id="responseBody">
            <div className="line_setter">
                <h4 className="tit__device mb-32">
                    <img className="logo_in_text__md" src="/images/logo_full.svg" alt=""/>
                    <b>해외결제 API - 결제결과</b>
                </h4>
                <br/><br/>
                <div id="payResTable">
                    <b>Response (일반결제 결과)</b><br/><br/>
                    <div className="table-outter" id="payResult">
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
                                <td>type</td>
                                <td>{orderParams.type}</td>
                            </tr>
                            <tr>
                                <td>result</td>
                                <td>{orderParams.result}</td>
                            </tr>
                            <tr>
                                <td>message</td>
                                <td>{orderParams.message}</td>
                            </tr>
                            <tr>
                                <td>resultUrl</td>
                                <td>{orderParams.resultUrl}</td>
                            </tr>
                            <tr>
                                <td>api_id</td>
                                <td>{orderParams.api_id}</td>
                            </tr>
                            <tr>
                                <td>api_date</td>
                                <td>{orderParams.api_date}</td>
                            </tr>
                            <tr>
                                <td>service_oid</td>
                                <td>{orderParams.service_oid}</td>
                            </tr>
                            <tr>
                                <td>comments</td>
                                <td>{orderParams.comments}</td>
                            </tr>
                            <tr>
                                <td>pay_type</td>
                                <td>{orderParams.pay_type}</td>
                            </tr>
                            <tr>
                                <td>card_number</td>
                                <td>{orderParams.card_number}</td>
                            </tr>
                            <tr>
                                <td>totalAmount</td>
                                <td>{orderParams.totalAmount}</td>
                            </tr>
                            <tr>
                                <td>currency</td>
                                <td>{orderParams.currency}</td>
                            </tr>
                            <tr>
                                <td>firstName</td>
                                <td>{orderParams.firstName}</td>
                            </tr>
                            <tr>
                                <td>lastName</td>
                                <td>{orderParams.lastName}</td>
                            </tr>
                            <tr>
                                <td>email</td>
                                <td>{orderParams.email}</td>
                            </tr>
                            <tr>
                                <td>phoneNumber</td>
                                <td>{orderParams.phoneNumber}</td>
                            </tr>
                            <tr>
                                <td>billing_key</td>
                                <td>{orderParams.billing_key}</td>
                            </tr>
                            <tr>
                                <td>submitTimeUtc</td>
                                <td>{orderParams.submitTimeUtc}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="btn_box has_space align_center">
                        <button className="btn cl_main btn_rounded btn_md" type="button" id="payConfirmCancel"
                                onClick={cancelReq}
                                style={{display: orderParams.result === 'A0000' ? 'inline' : 'none'}}>
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
    );
}

export default Result;
