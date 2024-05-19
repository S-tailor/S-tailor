# Porting Manual - Service Docker

노션 링크

[https://iamjam.notion.site/Porting-Guide-Emo-Bank-cac38af24268445789c2d09887c6e9a9?pvs=4](https://www.notion.so/Porting-Guide-Emo-Bank-e4686f46dbab434b90692f0817fc77cc?pvs=21)

edit. B107 김재민

# Docker 설치

---

- 구버전 삭제

  ```bash
  for pkg in docker.io docker-doc docker-compose docker-compose-v2 podman-docker containerd runc; do sudo apt-get remove $pkg; done
  ```

- apt 저장소 설정

  - package index update하고 필요 package 설치
    ```bash
    sudo apt-get update
    ```
    ```bash
    sudo apt-get install ca-certificates curl
    ```

- Docker 공식 GPG key 추가 (docker image 배포 파일이 신뢰있는지 확인을 위해)
  ```bash
  sudo install -m 0755 -d /etc/apt/keyrings
  ```
  ```bash
  sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
  ```
  ```bash
  sudo chmod a+r /etc/apt/keyrings/docker.asc
  ```
  ```bash
  echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
    $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
    sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
  ```
- Docker engine 설치
  ```bash
  sudo apt-get update
  ```
  ```bash
  sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
  ```
- Docker가 잘 설치되었는지 hello world 찍어보기
  ```bash
  sudo docker run hello-world
  ```
  ![Untitled](<img - Service Docker Manual/Untitled.png>)
- Docker Compose 잘 설치되었는지 확인
  ```bash
  apt list --installed | grep docker-compose
  ```
  ![Untitled](<img - Service Docker Manual/Untitled 1.png>)
  ![Untitled](<img - Service Docker Manual/Untitled 2.png>)
- 참고
  [https://docs.docker.com/engine/install/ubuntu/](https://docs.docker.com/engine/install/ubuntu/)
  [Install Docker Engine on Ubuntu](https://docs.docker.com/engine/install/ubuntu/)

      [https://tyoon9781.tistory.com/entry/docker-tutorial](https://tyoon9781.tistory.com/entry/docker-tutorial)

      [Docker - Tutorial](https://tyoon9781.tistory.com/entry/docker-tutorial)

      [https://docs.docker.com/compose/install/linux/#install-using-the-repository](https://docs.docker.com/compose/install/linux/#install-using-the-repository)

      [Install the Compose plugin](https://docs.docker.com/compose/install/linux/#install-using-the-repository)

      [https://tyoon9781.tistory.com/entry/docker-compose-tutorial](https://tyoon9781.tistory.com/entry/docker-compose-tutorial)

      [Docker Compose - tutorial](https://tyoon9781.tistory.com/entry/docker-compose-tutorial)

# 프로젝트 설정 (+ SSL 설정)

---

- 프로젝트 Git Pull
  ```jsx
  git clone https://lab.ssafy.com/s10-final/S10P31B107.git
  ```
- domain 입력 ( emo-bank.store → 사용하고자 하는 도메인 )
  ```bash
  vi ./init-letsencrypt.sh
  ```
  ```bash
  vi ./nginx/default.donf
  ```
  ```bash
  chmod +x ./init-letsencrypt.sh
  ```
- ssl 적용

  ```bash
  sudo docker compose build
  ```

  ```bash
  sudo docker compose up -d
  ```

  ```bash
  sudo ./init-letsencrypt.sh
  ```

  ![Untitled](<img - Service Docker Manual/Untitled 3.png>)

- **Trouble Shooting**
    <aside>
    💡 Error: docker-compose is not installed.
    
    </aside>
    
    - docker-compose 경로 확인
        
        ```bash
        sudo find / -name docker-compose
        ```
        
        ![Untitled](<img - Service Docker Manual/Untitled 4.png>)
        
    - 심볼릭 링크 연결
        
        ```bash
        sudo ln -s /usr/libexec/docker/cli-plugins/docker-compose /usr/bin/docker-compose
        ```
        
        ![Untitled](<img - Service Docker Manual/Untitled 5.png>)

- 참고
  [Nginx and Let’s Encrypt with Docker in Less Than 5 Minutes](https://pentacent.medium.com/nginx-and-lets-encrypt-with-docker-in-less-than-5-minutes-b4b8a60d3a71)

**EOF**
