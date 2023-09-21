### Các bước cần làm để chạy dự án NestJS

#### 1. Cài đặt thư viện với câu lệnh: npm i

#### 2. Chạy dự án với câu lệnh: npm run dev

=================

### #.19 ENV Variables

#### 1. Sử dụng .dotenv

```bash
npm i dotenv@16.0.3
```

Tạo file .env ở level root và truy cập 1 biến, chúng ta sử dụng cú pháp: `process.env.VARIABLE_NAME`

Với NestJS thì sử dụng cách này vẩn hoạt động tốt, tuy nhiên với một dự án lớn hơn với các tiêu chí:

-   Cần nhiều file .env để sử dụng cho các môi trường các nhau

Ví dụ:

-   Môi trường test: .env.test
-   Môi trường development: .env.dev
-   ...

Vì vậy thì NestJS đã support cho chúng ta giải pháp `Nest provides the @nestjs/config package out-of-the box`

#### 2. Config service

Tài liệu tham khảo:

> https://docs.nestjs.com/techniques/configuration

> https://github.com/nestjsx/nestjs-config/issues/19

Cài đặt thư viện:

```bash
npm i --save-exact @nestjs/config@2.3.1
yarn add @nestjs/config@2.3.1
```

Về bản chất thì `Config service` cũng sử dụng thư viện `dotenv`, tuy nhiên NestJS đã giúp chúng ta xử lý tầng trên hỗ trợ cho chúng ta giải quyết các vấn đê trên (Sử dụng được nhiều file .env, validate env)

#### 3. Sử dụng

-   Sử dụng với Dependecy Injection (với các Service)

> https://docs.nestjs.com/techniques/configuration#using-the-configservice

```ts
    constructor(
        private readonly configService: ConfigService, // Khai báo config service ở constructor (Dependecy Injection)
    ) {}

    console.log(this.configService.get('AUTHOR')); // Lấy giá trị của .env bằng phương thức `configService.get("NAME_VARIABLE")`
```

-   Sử dụng ở main.ts

> https://docs.nestjs.com/techniques/configuration#using-in-the-maints

```ts
const configService = app.get(ConfigService);
const port = configService.get('PORT');
```

-   Sử dụng ở .module.ts

> https://docs.nestjs.com/techniques/mongodb#async-configuration
