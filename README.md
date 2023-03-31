<!--suppress ALL -->
<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456

[circleci-url]: https://circleci.com/gh/nestjs/nest

# Nestjs Server Template

<p align="center">
    <a href="https://github.com/SeogyuGim/nestjs-server-template/issues"><img alt="GitHub issues" src="https://img.shields.io/github/issues/SeogyuGim/nestjs-server-template?style=for-the-badge"></a>
    <a href="https://github.com/SeogyuGim/nestjs-server-template/network"><img alt="GitHub forks" src="https://img.shields.io/github/forks/SeogyuGim/nestjs-server-template?style=for-the-badge"></a>
    <a href="https://github.com/SeogyuGim/nestjs-server-template/stargazers"><img alt="GitHub stars" src="https://img.shields.io/github/stars/SeogyuGim/nestjs-server-template?style=for-the-badge"></a><br/>
    <a href="https://hits.seeyoufarm.com"><img src="https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fgithub.com%2Fmetaverse2-dev%2Fcoin-market-engine&count_bg=%2379C83D&title_bg=%23555555&icon=&icon_color=%23E7E7E7&title=hits&edge_flat=false" alt='hit url'/></a>
</p>

<p align='center'>
    <img src="https://img.shields.io/badge/Node-v18.13.0-2C8EBB?style=for-the-badge&logo=node.js&logoColor=green" alt='Node'/>
    <img src="https://img.shields.io/badge/Typescript-v4.9.4-2C8EBB?style=for-the-badge&logoColor=blue&logo=typescript" alt='TypeScript'/>
    <img src="https://img.shields.io/badge/pnpm-v7.26.1-2C8EBB?style=for-the-badge&logo=pnpm&logoColor=blue" alt='PNPM'/>
    <img src="https://img.shields.io/badge/nestjs-v9.1.6-2C8EBB?style=for-the-badge&logoColor=red&logo=nestjs" alt='nestjs'/>
    <img src="https://img.shields.io/badge/mocha-v10.2.0-2C8EBB?style=for-the-badge&logoColor=red&logo=mocha" alt='mocha'/>
    <img src="https://img.shields.io/badge/chai-v4.3.7-2C8EBB?style=for-the-badge&logoColor=red&logo=chai" alt='chai'/>
    <br />
</p>

## Project Configuration

- Edit files in `./src/config/env`

## How to test

- `~/<project-root>  $ pnpm test`

## Notice

- Using zod to validate data, including DTOs, Request & Response Data, ...etc

# FLOW

## 주문 등록 요청

- front -> socket -> grpc -> 체결엔진

## 주문 취소 요청

- front -> socket -> grpc -> 체결엔진

## 주문 등록 거부

- redis -> subscribe -> socket -> front

## 주문 취소 거부

- redis -> subscribe -> socket -> front

# GIT Convention

## Commit message type

- `build` : 빌드 오류 및 경고 수정
- `chore`,
- `ci` : aws pipeline 관련
- `docs` : 문서 수정 (README or eslint 등등)
- `feat` : 새로운 기능 추가
- `fix` : 버그 수정
- `perf` : 함수 시간복잡도 개선
- `refactor` : 코드 리펙토링
- `revert` : revert 커밋
- `style` : 문법 및 들여쓰기 수정 (코드 변경이 없는 경우)
- `test` : 테스트 코드 관련
- `dependency` : 의존성 업데이트 관련


