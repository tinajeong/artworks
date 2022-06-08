# Today's Artwork

> 오늘의 미술작품을 큐레이팅해주는 페이지입니다.

- [설치 및 실행](#설치-및-실행)
- [설계](#설계)
- [사용 기술](#사용-기술)
- [트러블 슈팅](#트러블슈팅)

---

## 설치 및 실행

`npm start`
프로젝트 루트 폴더에서 실행합니다.

## 설계

> 메인 화면에는 오늘의 작품이 보이고, 최근목록페이지로 이동하면 최근 4일간의 작품이 보입니다. 최근 작품 중 하나를 클릭하면 메인화면과 동일한 구성의 화면이 보입니다.

![메인](./public/page1.png)

<!-- ![최근미술작품](./public/page2.png) -->

### 사용하는 API : [메트로폴리탄 미술관 API](https://metmuseum.github.io/)

> 미술작품의 id 기준으로 데이터를 불러오며, 올해의 날짜는 하나의 id와 매핑됩니다.

## 사용 기술

- React
- Tailwindcss
- CRA
- Typescript
- react-query

## 트러블슈팅

### 해싱

#### **초기 해싱 아이디어**

- 미술작품은 최대값이 871891인 object id를 가진다.
- 1년 동안에는 unique hash 값을 가지도록 하자.
- 오늘의 날짜를 토대로 6자리 hash 값을 뽑아내자.

#### **초기 아이디어의 문제점**

- object id가 6자리가 아닌 미술작품은 절대 나오지 않는다.
- object id는 연속함수가 아니다. 즉, 뽑아낸 hash값이 object id중에 없을 수도 있다.
- 설명, 정보가 부실한 작품이 나올 수도 있다.
  - 퍼블릭 도메인이 아니라면 이미지를 제공하지 못할수도 있다. 즉, 유명한 작품이어도 이미지가 나오지 않는 사진이 있다!(isPublicDomain,hasImages 속성으로 필터링 가능)
  - The API (RESTful web service in JSON format) gives access to all of The Met’s Open Access data and to corresponding high resolution images (JPEG format) that are in the public domain.(https://www.metmuseum.org/art/collection/search/437133)

#### **api의 추가 문제점**

- query string과 다른 항목 하나 조합만 허용하고, 조건 2개이상의 검색을 허용하지 않는다.

#### **대안**

- 랜덤함수를 통해 404 뜨면 재탐색해서 불러오는 방식으로 처리한다. -> 그렇게 되면 오늘의 작품이라기보단 사이트에 접속할 때마다 결과가 달라진다.
- 날짜별로 적절한 object id를 필터링해두고 curation하는 방식으로 변경한다. -> 노가다이긴 하지만 괜찮은 미술작품을 필터링할 수 있다.

#### **장기 대안**

- DB에 valid artwork의 집합을 만들어두고 그 안에서 랜덤성을 가지게 하기
