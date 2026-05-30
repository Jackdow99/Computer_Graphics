# 배경이 바뀌는 룸 투어
> **React, Three.js, React Three Fiber(R3F)**를 활용하여 구현한 인터랙티브 3D 가상 방 투어 시뮬레이션입니다. 방 안의 창문을 통해 우주, 바다, 숲속, 마법 공방 등 완전히 다른 차원의 세계(Multi-Verse)를 실시간으로 탐색할 수 있습니다.

---

## 프로젝트 설명

### 기획 목표
본 프로젝트는 고정된 실내 공간 프레임과 창밖의 가변적인 외부 3D 환경을 결합하여, 사용자에게 색다른 시각적 몰입감을 주는 인터랙티브 웹 콘텐츠를 개발하는 것을 목표로 합니다. 최적화된 컴포넌트 설계와 물리적 거리감 연출을 통해 R3F의 다채로운 3D 그래픽 기법을 실험하고 구현했습니다.

### ✨ 주요 기능
* **창문 너머의 4가지 테마 스위칭:** `Space(스페이스바)` 키를 누를 때마다 창밖의 세상이 실시간으로 전환됩니다.
  1. **태양계 우주 (`space`):** 공전 궤도를 도는 6개의 행성과 스스로 회전하는 태양, 밤하늘의 무수한 별빛 연출
  2. **심해 바다 (`ocean`):** 파동(Sine wave)을 그리며 무리 지어 헤엄치는 물고기 떼와 몽환적인 바닷속 안개 및 스파클 효과
  3. **평화로운 숲속 (`forest`):** 나풀거리는 나비의 날갯짓 애니메이션, 잔잔한 연못과 주위를 둘러싼 로우폴리 숲
  4. **신비로운 연금술 공방 (`workshop`):** 창문 코앞까지 바짝 밀착된 마법 책상, 무작위로 기울어진 책들이 꽂힌 책장, 위아래로 둥둥 떠다니는 크리스탈 오브제
* **정교한 실내 가구 및 광원 디자인:** 소파, 원형 테이블, 서랍장 등을 R3F 기본 Geometry 조합만으로 제작하였으며, 방 천장 중앙에 `pointLight`를 배치해 아늑한 그림자와 조명을 연출했습니다.
* **사용자 인터랙션 제어:** `OrbitControls`를 통해 마우스 드래그로 방 안을 자유롭게 회전하며 둘러볼 수 있으며, 시야가 방 밖으로 이탈하지 않도록 회전 제한값 및 줌 거리를 최적화했습니다.

---

## 🛠️ 기술 스택

* **Frontend:** React (v18+)
* **3D Rendering:** Three.js, React Three Fiber (`@react-three/fiber`), Drei (`@react-three/drei`)
* **Build Tool:** Vite

---

## 💻 설치 & 실행 방법

### 1. 저장소 클론 (또는 다운로드)
cd YOUR_REPOSITORY_NAME
### 2. 의존성 패키지 설치
npm install
### 3. 로컬 개발 서버 실행
npm run dev

## 🕹️ 사용 방법

| 입력 장치 | 조작 방식 | 기능 설명 |
| :--- | :--- | :--- |
| **마우스 (Mouse)** | **클릭 후 드래그** | 방 안의 시점을 자유롭게 회전 (360도 탐색) |
| | **휠 스크롤** | 화면 확대 및 축소 (Zoom In / Out) <br>※ *방 내부 시각 유지를 위해 제한값이 설정되어 있습니다.* |
| **키보드 (Keyboard)** | **Spacebar (스페이스바)** | 창밖의 테마(차원)를 실시간으로 전환 <br>*(우주 ➡️ 바다 ➡️ 숲속 ➡️ 연금술 공방)* |

##📸 실행 이미지
<img width="1898" height="899" alt="방1" src="https://github.com/user-attachments/assets/3a9bdd7f-7111-44e5-be4c-1f03f61cd074" />  
<img width="1899" height="907" alt="방2" src="https://github.com/user-attachments/assets/f1f8a323-7095-4941-8649-1ae9a63ade91" />
<img width="1896" height="899" alt="방4" src="https://github.com/user-attachments/assets/0bc38de1-ddc0-4ea7-9c16-0a28afa8e2b4" />  
<img width="1897" height="899" alt="방3" src="https://github.com/user-attachments/assets/8f9b9356-f720-4687-a1c1-f6970dfc26f8" />
<img width="1896" height="900" alt="태양계" src="https://github.com/user-attachments/assets/cdb222f7-23f1-4c5a-b075-62d5eb9ac68c" /> 
<img width="1894" height="897" alt="바다" src="https://github.com/user-attachments/assets/19ec7ba6-e8c3-490a-964e-164c8e9d5bc2" />
<img width="1899" height="899" alt="숲" src="https://github.com/user-attachments/assets/258029e8-50e7-4353-94c5-a1876ebd6832" />  
<img width="1885" height="905" alt="연금술" src="https://github.com/user-attachments/assets/003fe739-f842-41a3-b9a2-a2736043ef33" />

## 👥 팀원 및 역할

### 주현아(팀장)
* **공간 프레임 구축:** 내부 인테리어(`SolidRoom`) 프레임 설계 및 가구 에셋(소파, 테이블 등) 배치
* **태양계 우주 테마 구현:** 삼각함수 기반의 행성 공전·자전 메커니즘 및 궤도 라인 시각화
* **평화로운 숲속 테마 구현:** 로우폴리 숲 환경 조성 및 베지에 곡선 기반의 나비 날갯짓 연출

### 박수현
* **심해 바다 테마 구현:** `ExtrudeGeometry` 활용 물고기 모델링 및 파동 함수 기반 군집 주행 알고리즘 제어
* **연금술 공방 테마 구현:** 크리스탈 부유 효과 연출 및 무작위 도서 배치 알고리즘을 통한 책장 구현
