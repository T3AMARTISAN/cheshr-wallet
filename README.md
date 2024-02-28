# 🔮 CHESHR WALLET 소개
<img width="240" alt="image" src="https://github.com/yurright/team3---------/blob/master/cheshrFirstPage.png">
체셔는 **Defi 투자자 맞춤형 지갑**으로 크롬익스텐션과 웹애플리케이션을 지원합니다.

# 🛠 개발 기간
+ 2023.12.29(월) ~ 2024.02.28(수)
+ 아이디어톤 진행 2024.01.15
+ 해커톤 2024.02.28
+ 발표평가 2024.02.29

# 👩‍💻👨‍💻 개발자 소개
+ **강신혜:** PM, 지갑생성 기능, 지갑연동 기능, UI 디자인, 크롬 익스텐션
+ **박지환:** evm 네트워크 변경, Token 잔고 표시, 보유 NFT 표시, 거래내역 표시, 송금 기능
+ **허유라:** 프론트엔드 컴포넌트화, Uniswap V2, V3, Uniswap evm 네트워크 추가, Lp 풀의 수수료율 표시
+ **심재원:** 기획 및 디자인

# 💻📱 사용 방법
+ **url:** TBD
+ **chrome extension:** TBD

# 🔐💎 주요 기능

## 1. 지갑 생성
<img width="180" alt="image" src="https://github.com/yurright/team3---------/blob/master/cheshrFirstPage.png"> | 
<img width="180" alt="image" src="https://github.com/yurright/team3---------/blob/master/cheshrMakeNewWallet.png"> | 
<img width="180" alt="image" src="https://github.com/yurright/team3---------/blob/master/cheshrRevealNewAddress.png"> | 
<img width="180" alt="image" src="https://github.com/yurright/team3---------/blob/master/cheshr-confirm-new-wallet.jpg">
+ **Make Address** 버튼을 누르면 랜덤으로 새로운 지갑을 생성할 수 있습니다.
  + 새로운 지갑을 생성하면 생성한 지갑 주소와 시드문구, 프라이빗 키를 확인하고 복사할 수 있습니다. 
+ **Mount Address** 버튼을 누르면 기존에 사용하시던 지갑을 새로 연결할 수 있습니다.
  + 시드문구 혹은 프라이빗 키를 입력해서 기존 지갑을 연결할 수 있습니다.
    
## 2. 지갑 잠금 및 로그인
<img width="180" alt="image" src="https://github.com/yurright/team3---------/blob/master/cheshrLogin.png">
+ 비밀번호를 설정하여 지갑을 안 사용할 때에는 잠그고, 사용할 때 다시 로그인할 수 있습니다.

## 3. 지갑 송금
<img width="180" alt="image" src="https://github.com/yurright/team3---------/blob/master/cheshrSend.png">
+ 원하는 주소로 토큰을 전송할 수 있습니다. 

## 4. 토큰 잔액 조회
<img width="180" alt="image" src="https://github.com/yurright/team3---------/blob/master/cheshrTokens.png">
+ 지갑에서 보유한 모든 이더리움, 폴리곤, 아비트럼, 옵티미즘 등 evm 계열의 토큰 잔고를 확인할 수 있습니다. 

## 5. DeFi 유동성 풀 포지션 조회
<img width="180" alt="image" src="https://github.com/yurright/team3---------/blob/master/cheshrFeed.png"> | 
<img width="180" alt="image" src="https://github.com/yurright/team3---------/blob/master/cheshrDefiUniswapv3.png"> | 
<img width="180" alt="image" src="https://github.com/yurright/team3---------/blob/master/cheshrDefiApyMontlyToggle.png"> 
+ LP풀에 제공한 유동성에 대한 정보를 확인할 수 있습니다.
+ 현재 Uniswap V2, Uniswap V3를 지원하고 있습니다.
+ 각 풀에서 발생하는 토큰의 수수료율을 연 APR로 환산하여 볼 수 있으며, 토글을 통해 월, 주, 일 단위로 확인할 수 있습니다.
+ FEE_APR(Annual percentage rate) = (24시간 스왑 거래량 * fee_rate * 365) / TVL * 100
+ Uniswap V3의 경우, 현재 나의 포지션이 in range 인지, out of range인지 확인할 수 있습니다.

## 6. 보유 NFT 조회
<img width="180" alt="image" src="https://github.com/yurright/team3---------/blob/master/cheshrNfts.png"> 
+ 지갑이 보유한 모든 NFT도 NFT 탭에서 확인할 수 있습니다.
+ 이미지를 클릭하면 해당 NFT의 OpenSea 링크를 방문할 수 있습니다. 

## 7. 거래내역 조회
<img width="180" alt="image" src="https://github.com/yurright/team3---------/blob/master/cheshrLogs.png"> 
+ 지갑에서 발생한 거래 기록을 확인할 수 있습니다. 

## 8. 네트워크 변경 기능
<img width="180" alt="image" src="https://github.com/yurright/team3---------/blob/master/cheshrNetworkChange.png"> 
+ **Mainnet**: Ethereum, Polygon, Optimism, Arbitrum 지원

+ **Testnet**: Sepolia, Goerli 지원

# PROJECT WIP

<img width="240" alt="image" src="https://github.com/T3AMARTISAN/dex-wallet/assets/122417190/05fb31de-c3f3-44c7-8701-5e30a65a2af0">
