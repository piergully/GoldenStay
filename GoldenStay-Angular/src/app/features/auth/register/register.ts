import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink], // Importiamo ReactiveFormsModule
  template: `
    <div class="auth-container">
      <h2>Crea un account</h2>
      <p class="subtitle">Unisciti a GoldenStay per prenotare soggiorni da sogno.</p>

      <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">

        <div class="form-group">
          <label>Nome Completo</label>
          <input type="text" formControlName="name" placeholder="Mario Rossi">
          @if (registerForm.get('name')?.touched && registerForm.get('name')?.invalid) {
            <small class="error">Il nome è obbligatorio</small>
          }
        </div>

        <div class="form-group">
          <label>Email</label>
          <input type="email" formControlName="email" placeholder="nome@esempio.com">
          @if (registerForm.get('email')?.touched && registerForm.get('email')?.invalid) {
            <small class="error">Inserisci un'email valida</small>
          }
        </div>

        <div class="form-group">
          <label>Password</label>
          <input type="password" formControlName="password" placeholder="******">
          @if (registerForm.get('password')?.touched && registerForm.get('password')?.invalid) {
            <small class="error">Minimo 6 caratteri</small>
          }
        </div>

        <div class="form-group">
          <label>Conferma Password</label>
          <input type="password" formControlName="confirmPassword" placeholder="******">
        </div>

        @if (registerForm.hasError('passwordMismatch') && registerForm.get('confirmPassword')?.touched) {
          <small class="error-box">Le password non coincidono!</small>
        }

        <button type="submit" [disabled]="registerForm.invalid">
          Registrati
        </button>

      </form>

      <p class="footer-text">Hai già un account? <a routerLink="/login">Accedi qui</a></p>
    </div>
  `,
  styles: [`
    .auth-container { max-width: 450px; margin: 50px auto; padding: 40px; background: white; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); text-align: center; }
    h2 { margin-bottom: 10px; color: #2c3e50; }
    .subtitle { color: #888; margin-bottom: 30px; font-size: 0.95rem; }
    .form-group { text-align: left; margin-bottom: 20px; }
    label { display: block; margin-bottom: 8px; font-weight: bold; color: #2c3e50; font-size: 0.9rem; }
    input { width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 1rem; box-sizing: border-box; transition: 0.3s; }
    input:focus { border-color: #d4af37; outline: none; }

    /* Errori */
    .error { color: #e74c3c; font-size: 0.8rem; margin-top: 5px; display: block; }
    .error-box { color: #e74c3c; background: #fadbd8; padding: 10px; border-radius: 4px; display: block; margin-bottom: 15px; font-weight: bold; font-size: 0.9rem; }

    button { width: 100%; padding: 14px; background: #d4af37; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 1rem; transition: 0.3s; }
    button:hover { background: #b39028; }
    button:disabled { background: #eee; color: #aaa; cursor: not-allowed; }

    .footer-text { margin-top: 20px; font-size: 0.9rem; }
    a { color: #2c3e50; text-decoration: none; font-weight: bold; }
  `]
})
export class Register {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  // Creiamo il form con validatori
  registerForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required]
  }, { validators: this.passwordMatchValidator }); // Aggiungiamo il validatore personalizzato

  // Validatore personalizzato per controllare se pass e confirmPass sono uguali
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const { name, email, password } = this.registerForm.value;
      // Chiamiamo il service per registrare l'utente
      this.authService.register(name, email, password);
    }
  }
}
