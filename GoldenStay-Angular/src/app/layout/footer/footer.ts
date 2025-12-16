import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="footer">
      <p>&copy; 2025 GoldenStay. All rights reserved.</p>
      <div class="socials">
        <span>Instagram</span> | <span>Facebook</span>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background-color: #2c3e50;
      color: #ecf0f1;
      text-align: center;
      padding: 2rem;
      margin-top: auto;
    }
    .socials { margin-top: 10px; font-size: 0.9rem; color: #d4af37; cursor: pointer; }
  `]
})
export class Footer {}
