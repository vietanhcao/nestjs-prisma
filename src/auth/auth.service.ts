import { Injectable } from '@nestjs/common';

@Injectable({})
export class AuthService {
  doSomething() {
    console.log('Auth Service');
  }
}
