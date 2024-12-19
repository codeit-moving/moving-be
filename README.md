# 무빙

---

# **👥 moving-BE**

팀 협업 [노션 링크] : [https://bubble-city-3ac.notion.site](https://www.notion.so/1469702f08878035a353e93642fe2232?pvs=21)

---

## **👨‍👩‍👧 팀원 구성**

탁우현 [개인 Github 링크: https://github.com/WooHyunTak] 

안재민 [개인 Github 링크: ]

강범준 [개인 Github 링크: https://github.com/kangbeomjoon]

---

## **📚 프로젝트 소개**

- 소개: 이사 소비자와 이사 전문가 매칭 서비스
    
    > 이사 시장에서는 무분별한 가격 책정과 무책임한 서비스 등으로 인해 정보의 투명성 및 신뢰도가 낮은 문제가 존재합니다. 이러한 문제를 해결하기 위해, 소비자가 원하는 서비스와 주거 정보를 입력하면 이사 전문가들이 견적을 제공하고 사용자가 이를 바탕으로 이사 전문가를 선정할 수 있는 매칭 서비스를 제작합니다. 이를 통해 소비자는 견적과 이사 전문가의 이전 고객들로부터의 후기를 확인하며 신뢰할 수 있는 전문가를 선택할 수 있고, 소비자와 이사 전문가 간의 간편한 매칭이 가능합니다.
    > 
- 프로젝트 기간: 2024.11.25 ~ 2025.01.14

---

## **⚙ 기술 스택**

- Backend: Express.js, PrismaORM
- Server : Nginx, PM2, Git Actions
- Database: PostgreSQL
- 공통 Tool: Git & Github, Discord, Notion

---

## **📌 백엔드 팀원별 구현 기능 상세**

### **탁우현**
<details>
<summary>이사요청</summary>
</br>

<details>
<summary>이사요청 보내기</summary>

- 기능 개요: 이 기능은 사용자가 기사로부터 견적서를 받기전에 새로운 이사정보를 등록할 수 있다.
- 구현 내용:
    - end-point : `POST /moving-request`
    - request-body :
    
    ```json
    {
      "service": "number", // 1, 2, 3
        "movingDate" : "date", //이사하는 날
        "pickupAddress" : "string", // 출발지
        "dropOffAddress" : "string", // 출발지
    }
    ```
    
    - Response:
        - `201 Create`: 사용자 정보 전달
            
            ```json
             {
                "id" : "Number";
                "service" : "Number";
                "movingDate" : "Date";
                "pickupAddress" : "string";
                "dropOffAddress" : "string";
             }
            
            ```
            
        - `400 Bad Request`: 유효성 검사 실패
            
            ```json
            {
                "path": "/movingRequest",
                "method": "POST",
                "message": "Bad Request";,
                "data": {
                    "message": 
                        "이사 서비스 타입이 올바르지 않습니다."
                        "이사 날짜가 올바르지 않습니다.",
                        "이사 출발지가 올바르지 않습니다.",
                        "이사 도착지가 올바르지 않습니다.",
                },
                "date": "2024-10-11T06:38:15.804Z"
            }
            
            ```
</details>
<details>
<summary>기사페이지 기준 이사요청 목록 조회</summary>

- 기능 개요: 이 기능은 기사가 본인의 지정요청과 견적을 보낼수 있는 이사요청 목록을 조회 한다.
- 구현 내용:
    - end-point : `GET /moving-request/by-mover`
    - request-query :
    
    ```json
    
      "limit": "number"
      "isDesignated": "boolean"
      "cursor": "number"
      "keyword" : "string" // 이사요청과 관계가 있는 기사의 닉네임, 한 줄, 상세 설명을 포함한다.
      "smallMove" : "boolean"
      "houseMove" : "boolean"
      "officeMove" : "boolean"
      "orderBy" : "stirng" // recent, movingDate 
      "isQuoted" : "boolean"
      
        //예시
      "?limit=5&cursor=3&isCompleted=ture"
    ```
    
    - Response:
        - `200 OK`: 리스트 조회
            
            ```json
            {
                "nextCursor": "",
                "hasNext": false,
                "serviceCounts": {
                    "smallMove": 1,
                    "houseMove": 0,
                    "officeMove": 0
                },
                "requestCounts": {
                    "total": 1,
                    "designated": 0
                },
                "list": [
                    {
                        "id": 10,
                        "service": 1,
                        "movingDate": "2024-12-20T00:00:00.000Z",
                        "pickupAddress": "출발지",
                        "dropOffAddress": "도착지",
                        "requestDate": "2024-12-17T11:35:23.718Z",
                        "isConfirmed": false,
                        "name": "김기사",
                        "isDesignated": false
                    }
                ]
            }
            ```
            
        - `404 Not Found`: 조건의 맞는 이사 요청 목록이 없음
            
            ```json
            {
                "path": "/moving-requests/by-mover",
                "method": "GET",
                "message": "Not Found";,
                "data": {
                    "message": "조건의 맞는 이사요청 목록이 없습니다."
                },
                "date": "2024-10-11T06:38:15.804Z"
            }
            ```
</details>
<details>
<summary>고객페이지 기준 이사요청 목록 조회</summary>

- 기능 개요: 이 기능은 고객이 본인의 이사요청 목록을 조회 한다.
- 구현 내용:
    - end-point : `GET /moving-request/by-mover`
    - request-query :
    
    ```json
    
      "**pageSize**": "number"
      "**pageNum**": "boolean"
      
        //예시
      "?**pageSize**=5&**pageNum**=3"
    ```
    
    - Response:
        - `200 OK`: 리스트 조회
            
            ```json
            {
                "currentPage": 1,
                "pageSize": 10,
                "totalPage": 1,
                "totalCount": 1,
                "list": [
                    {
                        "id": 8,
                        "service": 1,
                        "movingDate": "2024-12-12T00:00:00.000Z",
                        "pickupAddress": "출발지",
                        "dropOffAddress": "도착지",
                        "name": "김철수",
                        "requestDate": "2024-12-10T17:55:22.589Z",
                        "isConfirmed": false
                    }
                    ...
                ]
            }
            
            ```
            
        - `404 Not Found`: 조건의 맞는 이사 요청 목록이 없음
            
            ```json
            {
                "path": "/moving-requests/by-customer",
                "method": "GET",
                "message": "Not Found";,
                "data": {
                    "message": "조건의 맞는 이사요청 목록이 없습니다."
                },
                "date": "2024-10-11T06:38:15.804Z"
            }
            ```
</details>                
<details>
<summary>이사요청의 전달된 견적서 조회</summary>

- 기능 개요: 이 기능은 해당 Id의 이사요청의 전달된 견적서를 조회 한다.
- 구현 내용:
    - end-point : `GET /moving-request/:id/quotes`
    - request-query :
    
    ```json
      ":id": "number" // 이사요청 ID
        "isCompleted" : "boolean"
    ```
    
    - Response:
        - `200 OK`: 리스트 조회
            
            ```json
            {
                "id" : "number"; // 이사요청 ID
                "list": [
                        {
                            "id" : "number";
                            "cost": "number";
                            "comment": "string";
                            "service": "number";
                            "isConfirmed": "boolean";
                            "mover" : {
                                    "id" : "number",
                                        "imageUrl" : "string",
                                        "nickname" : "string",
                                        "career" : "number",
                                "isDesignated" : "boolean",
                                "isFavorite" : "boolean",
                                "reviewCount" : "number",
                                "favoriteCount" : "number",
                                "confirmCount" : "number",
                                "rating" : {
                                        "1" : "number",
                                        "2" : "number",
                                        "3" : "number",
                                        "4" : "number",
                                        "5" : "number",
                                        "average" : "number",
                                        "totalCount" : "number",
                                        "totalSum" : "number"
                                } 
                        },
                        ...
                ] 
            }
            ```
            
        - `404 Not Found`: 견적서 목록이 없음
            
            ```json
            {
                "path": "/moving-request/:id/quotes",
                "method": "GET",
                "message": "Not Found";,
                "data": {
                    "message": "견적서 목록이 없습니다."
                },
                "date": "2024-10-11T06:38:15.804Z"
            }
            ```
</details>                
<details>
<summary>고객 페이지 기준 고객의 활성 이사요청의 전달된 대기중 견적서 조회</summary>
    
- 기능 개요: 이 기능은 로그인한 사용자의 활성 이사요청의 대기중인 견적서 목록을 조회한다.
- 구현 내용:
    - end-point : `GET /moving-request/pending-quotes`
    - Response:
        - `200 OK`: 리스트 조회
            
            ```json
            {
                "totalCount": 1,
                "list": [
                    {
                        "id": 10,
                        "cost": 200000,
                        "comment": "20만원",
                        "isConfirmed": false,
                        "movingRequest": {
                            "service": 2,
                            "movingDate": "2024-12-15T00:00:00.000Z",
                            "pickupAddress": "출발!",
                            "dropOffAddress": "도착!",
                            "requestDate": "2024-12-13T15:08:51.290Z",
                            "isConfirmed": false,
                            "status": "PENDING"
                        },
                        "mover": {
                            "id": 1,
                            "nickname": "하늘하늘기사",
                            "imageUrl": null,
                            "career": 5,
                            "introduction": "고객님을 위한 안전하고 빠른 이사를 제공합니다.",
                            "services": [
                                1,
                                2
                            ],
                            "name": "김하늘",
                            "isDesignated": false,
                            "isFavorite": true,
                            "reviewCount": 0,
                            "favoriteCount": 1,
                            "confirmCount": 1,
                            "rating": {
                                "1": 0,
                                "2": 0,
                                "3": 0,
                                "4": 0,
                                "5": 0,
                                "totalCount": 0,
                                "totalSum": 0,
                                "average": 0
                            }
                        }
                    }
                ]
            }
            ```
            
        - `404 Not Found`: 견적서 목록이 없음
            
            ```json
            {
                "path": "/moving-request/:id/quotes",
                "method": "GET",
                "message": "Not Found";,
                "data": {
                    "message": "견적서 목록이 없습니다."
                },
                "date": "2024-10-11T06:38:15.804Z"
            }
            ```
</details>
<details>
<summary>고객 페이지 기준 고객의 활성 이사요청의 기사 지정하기</summary>
    
- 기능 개요: 이 기능은 로그인한 사용자의 활성 이사요청의 기사 지정
- 구현 내용:
    - end-point : `POST /moving-request/id:/designated`
    - request-query :
        
        ```json
          ":id": "number" // 이사요청 ID
            "moverId" : "number"
            
            //예시
            "moving-requests/6/designated?moverId=4"
        
        ```
        
    - Response:
        - `200 OK`: 기사 지정 완료
            
            ```json
            {
                "message": "지정 요청 완료",
                "designateRemain": 1 // 활성중인 이사요청의 남은 지정수
            }
            ```
            
        - `400 Bad Rquest`: 활성중인 이사요청이 없음
            
            ```json
            {
                "path": "/moving-request/:id/designated",
                "method": "POST",
                "message": "Bad Request";,
                "data": {
                    "message": "일반 견적 요청을 먼저 진행해 주세요."
                },
                "date": "2024-10-11T06:38:15.804Z"
            }
            ```
            
        - `400 Bad Rquest`: 지정가능 카운트 초과
            
            ```json
            {
                "path": "/moving-request/:id/designated",
                "method": "POST",
                "message": "Bad Request";,
                "data": {
                    "message": "지정 요청 가능한 인원이 초과되었습니다. (최대 3명)"
                },
                "date": "2024-10-11T06:38:15.804Z"
            }
            ```
</details>
<details>
<summary>고객 페이지 기준 고객의 활성 이사요청의 기사 지정취소</summary>
    
- 기능 개요: 이 기능은 로그인한 사용자의 활성 이사요청의 기사 지정 취
- 구현 내용:
    - end-point : `DELETE /moving-request/:id/designated`
    - request-query :
        
        ```json
          ":id": "number" // 이사요청 ID
            "moverId" : "number"
            
            //예시
            "moving-requests/6/designated?moverId=4"
        ```
        
    - Response:
        - `200 OK`: 기사 지정 취소 완료
            
            ```json
            {
                "message": "지정 요청 취소",
                "designateRemain": 1 // 활성중인 이사요청의 남은 지정수
            }
            ```
</details>
</details>

<details>
<summary>기사</summary>
<br>

<details>
<summary>기사 목록 조회</summary>
    
- 기능 개요: 이 기능은 등록된 기사 목록 조회를 한다.
- 구현 내용:
    - end-point : `GET /mover`
    - request-query :
        
        ```json
             
          "nextCursorId" = "number";
          "order" = "string"; // review, career, confirm, rating
          "limit" = "number";
            "keyword" = "string";
          "region" = "number";
          "service" = "number";
          "isFavorite" = "boolean";
          
            //예시
          "?order=rating&limit=4&nextCursorId=4"
        
        ```
        
    - Response:
        - `200 OK`: 리스트 전
            
            ```json
            {
                "nextCursor": "",
                "hasNext": false,
                "list": [
                    {
                        "id": 5,
                        "imageUrl": null,
                        "services": [
                            1,
                            2,
                            3
                        ],
                        "nickname": "김기사",
                        "name": "김영수"
                        "career": 2,
                        "regions": [
                            82031,
                            82032
                        ],
                        "introduction": "잘 하겠습니다",
                        "isDesignated": false,
                        "isFavorite": true,
                        "reviewCount": 0,
                        "favoriteCount": 1,
                        "confirmCount": 0,
                        "rating": {
                            "1": 0,
                            "2": 0,
                            "3": 0,
                            "4": 0,
                            "5": 0,
                            "totalCount": 0,
                            "totalSum": 0,
                            "average": 0
                        }
                    }
                    ...
                ]
            }
            ```
            
        - `404 Not Found`: 조건의 맞는 이사 요청 목록이 없음
            
            ```json
            {
                "path": "/movers",
                "method": "GET",
                "message": "Not Found";,
                "data": {
                    "message": "조건에 맞는 기사 목록이 없습니다."
                },
                "date": "2024-10-11T06:38:15.804Z"
            }
            ```
</details>
<details>
<summary>기사 상세 조회</summary>

- 기능 개요: 기사 상세 정보 조회
- 구현 내용:
    - end-point : `GET /moving/:id`
    - request-query :
    
    ```json
      ":id": "number" // 기사 ID
    ```
    
    - Response:
        - `200 OK`: 리스트 조회
            
            ```json
            {
                "id": 3,
                "imageUrl": null,
                "services": [
                    1
                ],
                "nickname": "김기사",
                "name": "김영수",
                "career": 3,
                "regions": [
                    82041,
                    82062
                ],
                "introduction": "정확하고 안전한 이사, 믿고 맡겨주세요.",
                "isDesignated": true,
                "isFavorite": true,
                "reviewCount": 0,
                "favoriteCount": 1,
                "confirmCount": 0,
                "rating": {
                    "1": 0,
                    "2": 0,
                    "3": 0,
                    "4": 0,
                    "5": 0,
                    "totalCount": 0,
                    "totalSum": 0,
                    "average": null
                }
            }
            ```
            
        - `404 Not Found`: 견적서 목록이 없음
            
            ```json
            {
                "path": "/movers/:id",
                "method": "GET",
                "message": "Not Found";,
                "data": {
                    "message": "기사 정보를 찾을 수 없습니다."
                },
                "date": "2024-10-11T06:38:15.804Z"
            }
            ```
</details>
<details>
<summary>기사의 프로필 조회</summary>
    
- 기능 개요: 이 기능은 로그인한 기사의 프로필 조회
- 구현 내용:
    - end-point : `GET /my-profile`
    - Response:
        - `200 OK`: 리스트 조회
            
            ```json
            {
                "id": 3,
                "imageUrl": null,
                "services": [
                    1
                ],
                "nickname": "김기사",
                "name" : "김영수"
                "career": 3,
                "regions": [
                    82041,
                    82062
                ],
                "introduction": "정확하고 안전한 이사, 믿고 맡겨주세요.",
                "isDesignated": true,
                "isFavorite": true,
                "reviewCount": 0,
                "favoriteCount": 1,
                "confirmCount": 0,
                "rating": {
                    "1": 0,
                    "2": 0,
                    "3": 0,
                    "4": 0,
                    "5": 0,
                    "totalCount": 0,
                    "totalSum": 0,
                    "average": null
                }
            }
            ```
            
        - `404 Not Found`: 조건의 맞는 이사 요청 목록이 없음
            
            ```json
            {
                "path": "/my-profile",
                "method": "GET",
                "message": "Not Found";,
                "data": {
                    "message": "기사 정보를 찾을 수 없습니다."
                },
                "date": "2024-10-11T06:38:15.804Z"
            }
            ```
</details>
<details>
<summary>기사 찜하기</summary>

- 기능 개요: 이 기능은 로그인한 사용자가 해당 기사를 찜한다
- 구현 내용:
    - end-point : `GET /:id/favorite`
    - request-query :
    
    ```json
      ":id" : "number" //기사 ID
      "favorite": "boolean" // true 오면 찜 or false로 보내면 찜 취소
      
      //예시
      "movers/5/favorite?favorite=false"
    ```
    
    - Response:
        - `200 OK`: 리스트 조회
            
            ```json
            {
                "isFavorite" : "boolean";
                "id": "number"; // 찜한 기사 ID
            }
            ```
            
        - `404 Not Found`: 견적서 목록이 없음
            
            ```json
            {
                "path": "/movers/:id/favorite",
                "method": "POST",
                "message": "Not Found";,
                "data": {
                    "message": "기사 정보를 찾을 수 없습니다."
                },
                "date": "2024-10-11T06:38:15.804Z"
            }
            ```
</details>
</details>

<details>
    <summary>견적</summary>
<br>
<details>
    <summary>고객페이지 견적서 상세 조회</summary>

- 기능 개요: 고객페이지 기준의 견적서 상세 조회
- 구현 내용:
    - end-point : `GET /quotes/:id`
    - request-query :
        
        ```json
         ":id" : "number" //견적 ID  
        ```
        
    - Response:
        - `200 OK`: 리스트 전
            
            ```json
            {
                "id": 9,
                "cost": 150000,
                "comment": "15만원",
                "movingRequest": {
                    "service": 1,
                    "movingDate": "2024-12-12T00:00:00.000Z",
                    "pickupAddress": "출발지",
                    "dropOffAddress": "도착지",
                    "requestDate": "2024-12-10T17:55:22.589Z",
                    "isConfirmed": true,
                    "status": "COMPLETED"
                },
                "isConfirmed": true,
                "mover": {
                    "id": 1,
                    "nickname": "하늘하늘기사",
                    "imageUrl": null,
                    "introduction": "고객님을 위한 안전하고 빠른 이사를 제공합니다.",
                    "services": [
                        1,
                        2
                    ],
                    "regions": [
                        82031,
                        82032
                    ],
                    "career": 5,
                    "name": "김하늘",
                    "isDesignated": false,
                    "isFavorite": true,
                    "reviewCount": 0,
                    "favoriteCount": 1,
                    "confirmCount": 1,
                    "rating": {
                        "1": 0,
                        "2": 0,
                        "3": 0,
                        "4": 0,
                        "5": 0,
                        "totalCount": 0,
                        "totalSum": 0,
                        "average": 0
                    }
                }
            }
            ```
            
        - `404 Not Found`: 해당 id의 견적서를 찾지 못 함
            
            ```json
            {
                "path": "/quotes/:id",
                "method": "GET",
                "message": "Not Found";,
                "data": {
                    "message": "견적서를 찾을 수 없습니다."
                },
                "date": "2024-10-11T06:38:15.804Z"
            }
            ```
</details>
</details>

<details>
    <summary>확정 견적</summary>
<br>
<details>
    <summary>고객페이지 견적서 확정하기</summary>
    
- 기능 개요: 고객페이지 기준의 전달받은 견적서 확정
- 구현 내용:
    - end-point : `POST /confirmed-quotes/:id`
    - request-query :
        
        ```json
         ":id" : "number" //견적서 ID  
        ```
        
    - Response:
        - `200 OK`:
            
            ```json
            {
                    "message": "견적서 확정 완료",
                "data" : {
                         "id": "number", //확정 견적 테이블의 Id
                         "movingRequest" : "number", //이사요청 Id
                         "quoteId" : "number", //견적서 Id
                         "moverId" : "number", //기사 Id
            }
            ```
            
        - `404 Not Found`: 사용자의 이사요청을 찾지 못 함
            
            ```json
            {
                "path": "/confirmed-quotes/:id",
                "method": "POST",
                "message": "Not Found";,
                "data": {
                    "message": "활성중인 이사요청이 없습니다."
                },
                "date": "2024-10-11T06:38:15.804Z"
            }
            ```
            
        - `404 Not Found`: 해당 id의 견적서를 찾지 못 함
            
            ```json
            {
                "path": "/confirmed-quotes/:id",
                "method": "POST",
                "message": "Not Found";,
                "data": {
                    "message": "견적서를 찾을 수 없습니다."
                },
                "date": "2024-10-11T06:38:15.804Z"
            }
            ```
</details>
</details>

---

## 📁 파일 구조

```
├─ data
│  ├─ customer.ts
│  ├─ mock
│  ├─ mover.ts
│  ├─ movingRequest.ts
│  ├─ region.ts
│  ├─ seed.ts
│  ├─ service.ts
│  └─ user.ts
├─ nodemon.json
├─ package-lock.json
├─ package.json
├─ prisma
│  ├─ ERD.md
│  ├─ migrations
│  │  ├─ 20241127014347_init
│  │  │  └─ migration.sql
│  └─ schema.prisma
├─ src
│  ├─ app.ts
│  ├─ config
│  │  └─ cookie.config.ts
│  ├─ controllers
│  │  ├─ authController.ts
│  │  ├─ moverController.ts
│  │  ├─ movingRequestController.ts
│  │  ├─ oauthController.ts
│  │  ├─ quoteController.ts
│  │  ├─ regionController.ts
│  │  └─ serviceController.ts
│  ├─ env.ts
│  ├─ middlewares
│  │  ├─ errorHandler.ts
│  │  ├─ passport.ts
│  │  └─ validations
│  │     └─ movingRequest.ts
│  ├─ repositorys
│  │  ├─ authRepository.ts
│  │  ├─ moverRepository.ts
│  │  ├─ movingRequestRepository.ts
│  │  ├─ quoteRepository.ts
│  │  ├─ regionRepository.ts
│  │  └─ serviceRepository.ts
│  ├─ services
│  │  ├─ authService.ts
│  │  ├─ moverService.ts
│  │  ├─ movingRequestService.ts
│  │  ├─ oauthService.ts
│  │  ├─ quoteService.ts
│  │  ├─ regionService.ts
│  │  └─ serviceService.ts
│  ├─ typings
│  │  └─ env.d.ts
│  └─ utils
│     ├─ asyncHandler.ts
│     ├─ checkBoolean.ts
│     ├─ interfaces
│     │  ├─ customError.ts
│     │  ├─ mover
│     │  │  └─ ratingResult.ts
│     │  └─ movingRequest
│     │     └─ movingRequest.ts
│     ├─ mover
│     │  ├─ getRatingsByMover.ts
│     │  └─ processMoverData.ts
│     ├─ prismaClient.ts
│     ├─ quote
│     │  └─ processQuoteData.ts
│     └─ token.utils.ts
└─ tsconfig.json

```
