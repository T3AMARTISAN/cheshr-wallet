# 🔮 CHESHR WALLET 소개
<p align="center">
<img width="600" alt="image" src="https://github.com/yurright/team3---------/blob/master/cheshrLogo.png">
</p>

체셔는 **Defi 투자자에 특화된 지갑**으로 크롬익스텐션과 모바일 화면에 최적화된 웹사이트를 지원합니다. 

체셔 월렛을 사용하면, 송금, 토큰 잔고 확인 등 기본 지갑 기능과 함께 투자한 LP 풀의 포지션 가치, fee APY, 포지션 in range 여부 등의 정보를 한 눈에 확인할 수 있습니다. 디파이 투자자는 체셔 월렛을 통해 각 디파이 풀의 현황을 한 눈에 파악하고, 링크로 바로 해당 플랫폼에 접속해 포지션을 조정할 수 있어 급변하는 디파이 시장에 유연하게 대처할 수 있습니다. 

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
<p align="center">
<img width="180" alt="image" src="https://github.com/yurright/team3---------/blob/master/cheshrFirstPage.png"> | 
<img width="180" alt="image" src="https://github.com/yurright/team3---------/blob/master/cheshrMakeNewWallet.png"> | 
<img width="180" alt="image" src="https://github.com/yurright/team3---------/blob/master/cheshrRevealNewAddress.png"> | 
<img width="180" alt="image" src="https://github.com/yurright/team3---------/blob/master/cheshr-confirm-new-wallet.jpg">
  </p>

+ **Make Address** 버튼을 누르면 랜덤으로 새로운 지갑을 생성할 수 있습니다.
  + 새로운 지갑을 생성하면 생성한 지갑 주소와 시드문구, 프라이빗 키를 확인하고 복사할 수 있습니다. 
+ **Mount Address** 버튼을 누르면 기존에 사용하시던 지갑을 새로 연결할 수 있습니다.
  + 시드문구 혹은 프라이빗 키를 입력해서 기존 지갑을 연결할 수 있습니다.
    
## 2. 지갑 잠금 및 로그인
<p align="center">
<img width="180" alt="image" src="https://github.com/yurright/team3---------/blob/master/cheshrLogin.png">
  </p>

+ **비밀번호**를 설정하여 지갑을 안 사용할 때에는 잠그고, 사용할 때 다시 로그인할 수 있습니다.
+ **Wallet Reset** 버튼을 사용하면 저장된 지갑을 지울 수 있습니다. 

## 3. 지갑 송금
<p align="center">
<img width="180" alt="image" src="https://github.com/yurright/team3---------/blob/master/cheshrFeed.png"> |
<img width="180" alt="image" src="https://github.com/yurright/team3---------/blob/master/cheshrSend.png">
  </p>

+ 원하는 네트워크를 선택한 후 **Send** 버튼을 누르면 송금 화면으로 넘어갑니다. 
+ 송금할 지갑 주소, 토큰 종류, 수량을 선택하여 전송하면 됩니다. 

## 4. 토큰 잔액 조회
<p align="center">
<img width="180" alt="image" src="https://github.com/yurright/team3---------/blob/master/cheshrTokens.png">
  </p>

+ 지갑에서 보유한 모든 이더리움, 폴리곤, 아비트럼, 옵티미즘 등 evm 계열의 코인 및 토큰 잔고를 확인할 수 있습니다.
+ 위의 대시보드에는 각 네트워크별 모든 토큰의 잔고를 합한 자산가치를 달러($)로 확인할 수 있습니다. 

## 5. DeFi 유동성 풀 포지션 조회
<p align="center">
<img width="180" alt="image" src="https://github.com/yurright/team3---------/blob/master/cheshrFeed.png"> | 
<img width="180" alt="image" src="https://github.com/yurright/team3---------/blob/master/cheshrDefiUniswapv3.png"> | 
<img width="180" alt="image" src="https://github.com/yurright/team3---------/blob/master/cheshrDefiApyMontlyToggle.png">
    </p>

+ LP풀에 제공한 유동성에 대한 정보를 확인할 수 있습니다.
+  현재 Uniswap V2, Uniswap V3(Ethereum/Polygon/Optimism)를 지원하고 있습니다.
+ 각각의 포지션 별 공급한 유동성 지분과 그의 달러 가치가 표시됩니다.
+ 각 풀에서 발생하는 토큰의 수수료를 연 APR로 환산하여 볼 수 있으며, 토글을 통해 월, 주, 일 단위로 확인할 수 있습니다.
+ FEE_APR(Annual percentage rate) = (24시간 스왑 거래량 * fee_rate * 365) / TVL * 100 로 계산하고 있습니다.
+ Uniswap V3의 경우, 현재 나의 포지션이 in range 인지, out of range인지 확인할 수 있습니다.
+ tokenID 옆의 링크 버튼을 누르면 해당 포지션의 nft 정보를 보여주는 유니스왑 페이지로 이동할 수 있습니다.
+ Pair Amount 옆의 info 버튼을 누르면 해당 풀의 정보를 보여주는 유니스왑 페이지로 이동할 수 있습니다. 

## 6. 보유 NFT 조회
<p align="center">
<img width="180" alt="image" src="https://github.com/yurright/team3---------/blob/master/cheshrNfts.png"> 
    </p>

+ 지갑이 보유한 모든 NFT도 NFT 탭에서 확인할 수 있습니다.
+ 이미지를 클릭하면 해당 NFT의 OpenSea 링크를 방문할 수 있습니다. 

## 7. 거래내역 조회
<p align="center">
<img width="180" alt="image" src="https://github.com/yurright/team3---------/blob/master/cheshrLogs.png"> 
    </p>

+ 지갑에서 발생한 거래 기록을 확인할 수 있습니다. 

## 8. 네트워크 변경 기능
<p align="center">
<img width="180" alt="image" src="https://github.com/yurright/team3---------/blob/master/cheshrNetworkChange.png"> 
  </p>

+ **Mainnet**:Ethereum, Polygon, Optimism, Arbitrum 지원
+ **Testnet**: Sepolia, Goerli 지원
+ 네트워크를 변경하여 해당 네트워크의 토큰 잔고, 디파이 풀, NFT, 거래 내역 등의 정보를 확인할 수 있습니다. 

## 버전

+ 현재 배포된 버전은 2024년 02월 29일 기준으로 업데이트된 1.0.0 버전입니다.

-------

# 🔮 Introducing CHESHR WALLET
<p align="center">
<img width="600" alt="image" src="https://github.com/yurright/team3---------/blob/master/cheshrLogo.png">
</p>

CHESHR is a **wallet specialized for DeFi investors**, supporting an optimized website for both Chrome extension and mobile screens.

With the CHESHR Wallet, users can perform basic wallet functions such as transfers and checking token balances, as well as view at a glance information about the value of positions in invested LP pools, fee APY, and whether positions are in range or not. DeFi investors can quickly grasp the status of each DeFi pool through the CHESHR Wallet and adjust their positions by directly accessing the platform via link, allowing them to flexibly respond to the rapidly changing DeFi market.

# 🛠 Development Period
+ December 29, 2023 (Monday) to February 28, 2024 (Wednesday)
+ Ideathon held on January 15, 2024
+ Hackathon on February 28, 2024
+ Presentation and evaluation on February 29, 2024

# 👩‍💻👨‍💻 Developer Introduction
+ **Shinhye Kang:** PM, Wallet creation and integration features, UI design, Chrome extension
+ **Jihwan Park:** EVM network switching, Token balance display, Owned NFT display, Transaction history display, Transfer function
+ **Yura Heo:** Frontend componentization, Uniswap V2, V3, Addition of Uniswap EVM networks, Display of fee rates for LP pools
+ **Jaewon Shim:** Planning and design

# 💻📱 How to Use
+ **url:** TBD
+ **chrome extension:** TBD

# 🔐💎 Key Features

## 1. Wallet Creation
<p align="center">
<img width="180" alt="image" src="https://github.com/yurright/team3---------/blob/master/cheshrFirstPage.png"> | 
<img width="180" alt="image" src="https://github.com/yurright/team3---------/blob/master/cheshrMakeNewWallet.png"> | 
<img width="180" alt="image" src="https://github.com/yurright/team3---------/blob/master/cheshrRevealNewAddress.png"> | 
<img width="180" alt="image" src="https://github.com/yurright/team3---------/blob/master/cheshr-confirm-new-wallet.jpg">
</p>

+ Clicking the **Make Address** button allows you to randomly generate a new wallet.
  + Upon creating a new wallet, you can check, copy, and save the newly created wallet address, seed phrase, and private key.
+ Pressing the **Mount Address** button enables you to connect to an existing wallet.
  + You can connect an existing wallet by entering a seed phrase or private key.
    
## 2. Wallet Lock and Login
<p align="center">
<img width="180" alt="image" src="https://github.com/yurright/team3---------/blob/master/cheshrLogin.png">
</p>

+ Set a **password** to lock the wallet when not in use, and login again when needed.
+ The **Wallet Reset** button allows you to erase the stored wallet.

## 3. Wallet Transfer
<p align="center">
<img width="180" alt="image" src="https://github.com/yurright/team3---------/blob/master/cheshrFeed.png"> |
<img width="180" alt="image" src="https://github.com/yurright/team3---------/blob/master/cheshrSend.png">
</p>

+ After selecting the desired network, press the **Send** button to proceed to the transfer screen.
+ You can transfer by selecting the wallet address, token type, and amount.

## 4. Token Balance Inquiry
<p align="center">
<img width="180" alt="image" src="https://github.com/yurright/team3---------/blob/master/cheshrTokens.png">
</p>

+ You can check the balance of all Ethereum, Polygon, Arbitrum, Optimism, and other EVM-based coins and tokens held in your wallet.
+ The dashboard displays the total asset value of all tokens across networks in dollars ($).

## 5. DeFi Liquidity Pool Position Inquiry
<p align="center">
<img width="180" alt="image" src="https://github.com/yurright/team3---------/blob/master/cheshrFeed.png"> | 
<img width="180" alt="image" src="https://github.com/yurright/team3---------/blob/master/cheshrDefiUniswapv3.png"> | 
<img width="180" alt="image" src="https://github.com/yurright/team3---------/blob/master/cheshrDefiApyMontlyToggle.png">
</p>

+ You can view information about the liquidity provided to LP pools.
+ Currently supports Uniswap V2, Uniswap V3 (Ethereum/Polygon/Optimism).
+ Displays the dollar value of the liquidity share supplied to each position.
+ You can view the token fees generated by each pool converted into an annual APR, with toggles to view by month, week, or day.
+ FEE_APR (Annual Percentage Rate) is calculated as \((24-hour swap volume * fee rate * 365) / TVL * 100\).
+ For Uniswap V3, you can check whether your position is currently in range or out of range.
+ Clicking the link button next to the tokenID takes you to the Uniswap page displaying NFT information for that position.
+ Clicking the info button next to Pair Amount takes you to the Uniswap page showing information about that pool.

## 6. Owned NFT Inquiry
<p align="center">
<img width="180" alt="image" src="https://github.com/yurright/team3---------/blob/master/cheshrNfts.png"> 
</p>

+ You can check all NFTs owned by the wallet in the NFT tab.
+ Clicking on an image will take you to the OpenSea link for that NFT.

## 7. Transaction History Inquiry
<p align="center">
<img width="180" alt="image" src="https://github.com/yurright/team3---------/blob/master/cheshrLogs.png"> 
</p>

+ You can check the transaction records made with the wallet.

## 8. Network Switching Feature
<p align="center">
<img width="180" alt="image" src="https://github.com/yurright/team3---------/blob/master/cheshrNetworkChange.png"> 
</p>

+ **Mainnet:** Supports Ethereum, Polygon, Optimism, Arbitrum
+ **Testnet:** Supports Sepolia, Goerli
+ Change networks to check information such as token balances, DeFi pools, NFTs, and transaction history for that network.

## Version

+ The current deployed version is 1.0.0, updated as of February 29, 2024.
