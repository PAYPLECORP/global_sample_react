import React, {useState} from "react";
import {useNavigate} from "react-router";

function Order() {
    const navigate = useNavigate();
    const [simpleShortStatus, setSimpleShortStatus] = useState(false);
    const [orderParams] = useState({
            isSimpleShort: '',
            billing_key: '',
            securityCode: '',
            isDirect: 'N',
            service_oid: createOid(),
            comments: 'Payple global payments',
            totalAmount: '1.00',
            currency: 'USD',
            lastName: 'Inc',
            firstName: 'Payple',
            phoneNumber: '01012345678',
            email: 'test@payple.kr',
            country: 'KR',
            address1: '14, Teheran-ro 34-gil, Gangnam-gu',
            locality: 'Seoul',
            administrativeArea: '',
            postalCode: '06220'
        }
    )

    const handleFormChange = (e) => orderParams[e.target.name] = e.target.value;

    const handleSubmit = () => {
        const navigatePath = orderParams['isSimpleShort'] === 'Y' && orderParams['billing_key'] ? '/order_billingKey' : '/order_confirm';
        navigate(navigatePath, {
            state: {orderParams}
        })
    }

    return (
        <div className="device__layout w-600">
            <div className="line_setter">
                <form id="orderForm" name="orderForm">
                    <h4 className="tit__device">
                        <img className="logo_in_text__md" src="/images/logo_full.svg" alt=""/>
                        <b>해외결제 API</b>
                    </h4>
                    {/*결제창 관련 파라미터 */}
                    <div className="tit--by-page">
                        <h3 className="tit_component">결제창 설정</h3>
                        <div className="icon">
                            <img src="/images/icon--arrow-up.svg" alt="" className="res"/>
                        </div>
                    </div>
                    <div className="ctn--by-page">
                        <div className="form_box has_border w240 form-box-index">
                            <div className="tit__form_box">항목</div>
                            <div className="tit__form_box">요청변수</div>
                            <div className="ctn__form_box fsz_10">값</div>
                        </div>
                        <div className="form_box has_border w240">
                            <div className="tit__form_box fcl_txt fw_bd">빌링키 결제</div>
                            <div className="tit__form_box fsz_08">
                                <div>isSimpleShort</div>
                            </div>
                            <div className="ctn__form_box">
                                <div className="select">
                                    <select id="isSimpleShort" name="isSimpleShort"
                                            defaultValue={orderParams['isSimpleShort']} onChange={(e) => {
                                        handleFormChange(e)
                                        setSimpleShortStatus(e.target.value === 'Y')
                                    }}>
                                        <option value="">일반결제</option>
                                        <option value="Y">간편 빌링키 결제 (결제자 정보 입력안함)</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="form_box has_border w240" id="inputBillingKey"
                             style={{display: simpleShortStatus ? 'block' : 'none'}}>
                            <div className="tit__form_box fcl_txt fw_bd">빌링키</div>
                            <div className="tit__form_box fsz_08">billing_key</div>
                            <div className="ctn__form_box">
                                <div className="input">
                                    <input className="ipt" type="text" id="billing_key" name="billing_key"
                                           defaultValue={orderParams['billing_key']} onChange={handleFormChange}/>
                                </div>
                            </div>
                            <div className="tit__form_box fcl_txt fw_bd">CVC/CVV</div>
                            <div className="tit__form_box fsz_08">securityCode</div>
                            <div className="ctn__form_box">
                                <div className="input">
                                    <input className="ipt" type="text" id="securityCode" name="securityCode"
                                           defaultValue={orderParams['securityCode']} onChange={handleFormChange}
                                           maxLength="3"/>
                                </div>
                            </div>
                        </div>
                        <div className="form_box has_border w240">
                            <div className="tit__form_box fcl_txt fw_bd">결제창 호출 방식</div>
                            <div className="tit__form_box fsz_08">
                                <div>isDirect</div>
                            </div>
                            <div className="ctn__form_box">
                                <div className="select">
                                    <select name="isDirect" defaultValue={orderParams['isDirect']} onChange={handleFormChange}>
                                        <option value="N">팝업</option>
                                        <option value="Y">다이렉트</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="tit--by-page">
                        <h3 className="tit_component">결제정보 설정</h3>
                        <div className="icon">
                            <img src="/images/icon--arrow-up.svg" alt="" className="res"/>
                        </div>
                    </div>
                    <div className="ctn--by-page">
                        <div className="form_box has_border w240 form-box-index">
                            <div className="tit__form_box">항목</div>
                            <div className="tit__form_box">요청변수</div>
                            <div className="ctn__form_box fsz_10">값</div>
                        </div>
                        <div className="form_box has_border w240">
                            <div className="tit__form_box fcl_txt fw_bd">주문번호</div>
                            <div className="tit__form_box fsz_08">service_oid</div>
                            <div className="ctn__form_box">
                                <div className="input">
                                    <input className="ipt" type="text" name="service_oid"
                                           defaultValue={orderParams['service_oid']} onChange={handleFormChange}/>
                                </div>
                            </div>
                        </div>
                        <div className="form_box has_border w240">
                            <div className="tit__form_box fcl_txt fw_bd">상품명</div>
                            <div className="tit__form_box fsz_08">comments</div>
                            <div className="ctn__form_box">
                                <div className="input">
                                    <input className="ipt" type="text" name="comments"
                                           defaultValue={orderParams['comments']} onChange={handleFormChange}/>
                                </div>
                            </div>
                        </div>
                        <div className="form_box has_border w240">
                            <div className="tit__form_box fcl_txt fw_bd">결제금액</div>
                            <div className="tit__form_box fsz_08">totalAmount</div>
                            <div className="ctn__form_box">
                                <div className="input">
                                    <input className="ipt" type="text" id="totalAmount" name="totalAmount"
                                           defaultValue={orderParams['totalAmount']} onChange={handleFormChange}/>
                                </div>
                            </div>
                        </div>
                        <div className="form_box has_border w240">
                            <div className="tit__form_box fcl_txt fw_bd">결제통화</div>
                            <div className="tit__form_box fsz_08">currency</div>
                            <div className="ctn__form_box">
                                <div className="input">
                                    <input className="ipt" type="text" id="currency" name="currency"
                                           defaultValue={orderParams['currency']} onChange={handleFormChange}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="form_box has_border w240">
                            <div className="tit__form_box fcl_txt fw_bd">결제고객 성</div>
                            <div className="tit__form_box fsz_08">lastName</div>
                            <div className="ctn__form_box">
                                <div className="input">
                                    <input className="ipt" type="text" name="lastName"
                                           defaultValue={orderParams['lastName']} onChange={handleFormChange}/>
                                </div>
                            </div>
                        </div>
                        <div className="form_box has_border w240">
                            <div className="tit__form_box fcl_txt fw_bd">결제고객 이름</div>
                            <div className="tit__form_box fsz_08">firstName</div>
                            <div className="ctn__form_box">
                                <div className="input">
                                    <input className="ipt" type="text" name="firstName"
                                           defaultValue={orderParams['firstName']} onChange={handleFormChange}/>
                                </div>
                            </div>
                        </div>
                        <div className="form_box has_border w240">
                            <div className="tit__form_box fcl_txt fw_bd">결제고객<br/>휴대전화번호</div>
                            <div className="tit__form_box fsz_08">phoneNumber</div>
                            <div className="ctn__form_box">
                                <div className="input">
                                    <input className="ipt" type="text" name="phoneNumber"
                                           defaultValue={orderParams['phoneNumber']} onChange={handleFormChange}/>
                                </div>
                            </div>
                        </div>
                        <div className="form_box has_border w240">
                            <div className="tit__form_box fcl_txt fw_bd">결제고객 이메일</div>
                            <div className="tit__form_box fsz_08">email</div>
                            <div className="ctn__form_box">
                                <div className="input">
                                    <input className="ipt" type="text" name="email"
                                           defaultValue={orderParams['email']} onChange={handleFormChange}/>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*청구지 관련 파라미터*/}
                    <div className="tit--by-page">
                        <h3 className="tit_component">청구지 설정</h3>
                        <div className="icon">
                            <img src="/images/icon--arrow-up.svg" alt="" className="res"/>
                        </div>
                    </div>
                    <div className="ctn--by-page">
                        <div className="form_box has_border w240 form-box-index">
                            <div className="tit__form_box">항목</div>
                            <div className="tit__form_box">요청변수</div>
                            <div className="ctn__form_box fsz_10">값</div>
                        </div>
                        <div className="form_box has_border w240">
                            <div className="tit__form_box fcl_txt fw_bd">국가</div>
                            <div className="tit__form_box fsz_08">country</div>
                            <div className="ctn__form_box">
                                <div className="input">
                                    <input className="ipt" type="text" name="country"
                                           defaultValue={orderParams['country']} onChange={handleFormChange}/>
                                </div>
                            </div>
                        </div>
                        <div className="form_box has_border w240">
                            <div className="tit__form_box fcl_txt fw_bd">도로명</div>
                            <div className="tit__form_box fsz_08">address1</div>
                            <div className="ctn__form_box">
                                <div className="input">
                                    <input className="ipt" type="text" name="address1"
                                           defaultValue={orderParams['address1']} onChange={handleFormChange}/>
                                </div>
                            </div>
                        </div>
                        <div className="form_box has_border w240">
                            <div className="tit__form_box fcl_txt fw_bd">시/군/구</div>
                            <div className="tit__form_box fsz_08">locality</div>
                            <div className="ctn__form_box">
                                <div className="input">
                                    <input className="ipt" type="text" name="locality"
                                           defaultValue={orderParams['locality']} onChange={handleFormChange}/>
                                </div>
                            </div>
                        </div>
                        <div className="form_box has_border w240">
                            <div className="tit__form_box fcl_txt fw_bd">도/시</div>
                            <div className="tit__form_box fsz_08">administrativeArea</div>
                            <div className="ctn__form_box">
                                <div className="input">
                                    <input className="ipt" type="text" name="administrativeArea"
                                           defaultValue={orderParams['administrativeArea']}
                                           placeholder="미국, 캐나다 도시코드 : 예) NY" onChange={handleFormChange}/>
                                </div>
                            </div>
                        </div>
                        <div className="form_box has_border w240">
                            <div className="tit__form_box fcl_txt fw_bd">우편번호</div>
                            <div className="tit__form_box fsz_08">postalCode</div>
                            <div className="ctn__form_box">
                                <div className="input">
                                    <input className="ipt" type="text" name="postalCode"
                                           defaultValue={orderParams['postalCode']} onChange={handleFormChange}/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="btn_box has_space align_center">
                        <button className="btn cl_main btn_rounded btn_md" type="button" id="orderSubmit"
                                onClick={handleSubmit}>다음단계
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

/* Oid 생성 함수
 * 리턴 예시: PaypleGpayTest-202208011659339808756
 */
const createOid = () => {
    const now_date = new Date();
    let now_year = now_date.getFullYear()
    let now_month = now_date.getMonth() + 1
    now_month = (now_month < 10) ? '0' + now_month : now_month
    let now_day = now_date.getDate()
    now_day = (now_day < 10) ? '0' + now_day : now_day
    const datetime = now_date.getTime();
    return 'PaypleGpayTest-' + now_year + now_month + now_day + datetime;
};

export default Order;
