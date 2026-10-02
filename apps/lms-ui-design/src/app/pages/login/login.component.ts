import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  template: `
    <div class="bg-[#F9F8F4] flex flex-col items-center justify-center p-16 relative w-full min-h-screen">
      <div class="absolute left-[100px] size-[600px] top-[100px] pointer-events-none">
        <img alt="" class="block size-full" src="/assets/5afa6.svg" />
      </div>
      <div class="absolute left-[800px] size-[500px] top-[400px] pointer-events-none">
        <img alt="" class="block size-full" src="/assets/3111e.svg" />
      </div>

      <div class="bg-white border border-[#E7E4DB] drop-shadow-[0px_20px_20px_rgba(15,23,42,0.05)] flex flex-col gap-8 items-start p-12 relative rounded-[20px] w-[480px]">
        <div class="flex flex-col gap-4 items-center w-full">
          <div class="bg-[#007044] flex items-center justify-center rounded-xl size-12">
            <img alt="Herbalife" class="block size-6 brightness-0 invert" src="/assets/herbalife-symbol.svg" />
          </div>
          <div class="flex flex-col gap-1.5 items-center text-center w-full">
            <p class="font-extrabold text-[#101921] text-2xl leading-normal">Herbalife Lookup Management System</p>
            <p class="font-normal text-[#837976] text-sm leading-normal">Lookup &amp; Value Set Management System</p>
          </div>
        </div>

        <div class="flex flex-col gap-5 items-start w-full">
          <div class="flex flex-col gap-2 items-start w-full">
            <p class="font-semibold text-[#837976] text-[13px] leading-normal">Enterprise Email Address</p>
            <div class="bg-white border border-[#E7E4DB] flex gap-2.5 items-center p-3 rounded-lg w-full">
              <img alt="" class="block size-[18px] shrink-0" src="/assets/91806.svg" />
              <p class="flex-1 font-normal text-[#101921] text-sm leading-normal">admin&#64;oracleHerbalife.internal</p>
            </div>
          </div>

          <div class="flex flex-col gap-2 items-start w-full">
            <div class="flex items-center justify-between w-full text-[13px] leading-normal">
              <p class="font-semibold text-[#837976]">Password</p>
              <p class="font-medium text-[#007044] cursor-pointer">Forgot password?</p>
            </div>
            <div class="bg-white border border-[#E7E4DB] flex gap-2.5 items-center p-3 rounded-lg w-full">
              <img alt="" class="block size-[18px] shrink-0" src="/assets/8eb19.svg" />
              <p class="flex-1 font-normal text-[#101921] text-sm leading-normal">&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;</p>
              <img alt="" class="block size-[18px] shrink-0" src="/assets/79640.svg" />
            </div>
          </div>

          <div class="flex gap-2 items-center w-full">
            <div class="bg-[#F9F8F4] border-2 border-[#007044] flex items-center justify-center rounded size-[18px]">
              <img alt="" class="block size-3" src="/assets/2be58.svg" />
            </div>
            <p class="font-normal text-[#837976] text-[13px] leading-normal">Remember this enterprise workstation</p>
          </div>
        </div>

        <div class="flex flex-col gap-4 items-center w-full">
          <button
            (click)="signIn()"
            class="bg-[#007044] flex items-center justify-center p-3.5 rounded-lg w-full cursor-pointer hover:bg-[#163E35] transition-colors"
          >
            <p class="font-semibold text-white text-sm leading-normal">Sign In with SSO</p>
          </button>

          <div class="flex gap-3 items-center w-full">
            <div class="flex-1 border-t border-[#E7E4DB]"></div>
            <p class="font-normal text-[#309C46] text-xs leading-normal">OR CONTINUE WITH</p>
            <div class="flex-1 border-t border-[#E7E4DB]"></div>
          </div>

          <button
            (click)="signIn()"
            class="border border-[#E7E4DB] flex gap-2.5 items-center justify-center p-3 rounded-lg w-full cursor-pointer hover:bg-[#F9F8F4] transition-colors"
          >
            <img alt="" class="block size-[18px]" src="/assets/df106.svg" />
            <p class="font-semibold text-[#101921] text-sm leading-normal">Authenticate via OAuth2 / IAM</p>
          </button>
        </div>

        <p class="font-normal text-[#309C46] text-[11px] leading-normal text-center w-full">
          Authorized access only. All lookup activities are audited under Oracle security policy SEC-0994.
        </p>
      </div>
    </div>
  `,
})
export class LoginComponent {
  private router = inject(Router);

  signIn() {
    this.router.navigate(['/dashboard']);
  }
}
