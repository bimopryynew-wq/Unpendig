
import { Component, ChangeDetectionStrategy, signal, computed, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

type FoodPreference = 'Tanpa Preferensi' | 'Vegetarian' | 'Alergi Kacang';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  // --- Wedding Details ---
  whatsAppNumber = "6285642245331";
  brideName = "Adinda Larasati";
  groomName = "Bima Perkasa";
  weddingDate = new Date("2026-02-25T10:00:00");
  akadNikahMapUrl = "https://www.google.com/maps/search/?api=1&query=Masjid+Istiqlal+Jakarta";
  resepsiMapUrl = "https://www.google.com/maps/search/?api=1&query=Hotel+Indonesia+Kempinski+Jakarta";
  instagramFilterUrl = "https://www.instagram.com/ar/1234567890/"; // Placeholder URL

  // --- Page Navigation ---
  currentSection = signal(0);
  totalSections = 10;
  progress = computed(() => ((this.currentSection() + 1) / this.totalSections) * 100);
  isDarkBackground = computed(() => {
    const darkSections = [0, 9]; // Hero and Closing sections
    return darkSections.includes(this.currentSection());
  });

  // --- Countdown Logic ---
  private timerId: any;
  countdown = signal<Countdown>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // --- RSVP Form ---
  rsvpName = signal('');
  rsvpStatus = signal<'Hadir' | 'Tidak Hadir'>('Hadir');
  rsvpCount = signal(1);
  rsvpReason = signal('');
  rsvpFoodPreference = signal<FoodPreference>('Tanpa Preferensi');
  
  whatsappMessage = computed(() => {
    const status = this.rsvpStatus();
    const name = this.rsvpName().trim() || 'Tamu';

    if (status === 'Hadir') {
      return `Halo, saya ${name} ingin mengonfirmasi kehadiran di pernikahan Anda.\n\nJumlah yang akan hadir: ${this.rsvpCount()} orang.\nPreferensi Makanan: ${this.rsvpFoodPreference()}.\n\nTerima kasih!`;
    } 
    
    let message = `Halo, saya ${name} mohon maaf belum bisa hadir di pernikahan Anda.`;
    if (this.rsvpReason().trim()) {
      message += `\n\nAlasan: ${this.rsvpReason()}`;
    }
    message += `\n\nDoa terbaik untuk kedua mempelai.`;
    return message;
  });
  
  whatsappLink = computed(() => `https://api.whatsapp.com/send?phone=${this.whatsAppNumber}&text=${encodeURIComponent(this.whatsappMessage())}`);

  // --- Song Request ---
  songTitle = signal('');
  songArtist = signal('');
  songRequestWhatsappMessage = computed(() => {
    return `Permintaan Lagu untuk Pernikahan ${this.groomName} & ${this.brideName}:\n\nLagu: ${this.songTitle()}\nArtis: ${this.songArtist()}`;
  });
  songRequestWhatsappLink = computed(() => `https://api.whatsapp.com/send?phone=${this.whatsAppNumber}&text=${encodeURIComponent(this.songRequestWhatsappMessage())}`);

  // --- Guestbook ---
  guestbookName = signal('');
  guestbookMessage = signal('');
  guestbookWhatsappMessage = computed(() => {
    return `Pesan & Doa untuk Pernikahan ${this.groomName} & ${this.brideName}:\n\nDari: ${this.guestbookName()}\n\nPesan:\n${this.guestbookMessage()}`;
  });
  guestbookWhatsappLink = computed(() => `https://api.whatsapp.com/send?phone=${this.whatsAppNumber}&text=${encodeURIComponent(this.guestbookWhatsappMessage())}`);

  // --- Digital Gift ---
  bankRequestWhatsappLink = computed(() => {
    const message = `Halo, saya ingin meminta informasi nomor rekening untuk hadiah pernikahan ${this.groomName} & ${this.brideName}. Terima kasih.`;
    return `https://api.whatsapp.com/send?phone=${this.whatsAppNumber}&text=${encodeURIComponent(message)}`;
  });

  ewalletRequestWhatsappLink = computed(() => {
    const message = `Halo, saya ingin meminta QR Code E-Wallet untuk hadiah pernikahan ${this.groomName} & ${this.brideName}. Terima kasih.`;
    return `https://api.whatsapp.com/send?phone=${this.whatsAppNumber}&text=${encodeURIComponent(message)}`;
  });

  // --- Background Music ---
  @ViewChild('backgroundMusic') backgroundMusic!: ElementRef<HTMLAudioElement>;
  isMusicPlaying = signal(false);

  ngOnInit() {
    this.updateCountdown();
    this.timerId = setInterval(() => this.updateCountdown(), 1000);
  }

  ngAfterViewInit() {
    // Attempt to play music, handling browser autoplay restrictions
    const audio = this.backgroundMusic.nativeElement;
    audio.play().then(() => {
      this.isMusicPlaying.set(true);
    }).catch(() => {
      // Autoplay was prevented. The user must interact to start it.
      this.isMusicPlaying.set(false);
    });
  }

  ngOnDestroy() {
    clearInterval(this.timerId);
  }
  
  nextSection() {
    if (this.currentSection() < this.totalSections - 1) {
      this.currentSection.update(i => i + 1);
    }
  }

  previousSection() {
    if (this.currentSection() > 0) {
      this.currentSection.update(i => i - 1);
    }
  }

  toggleMusic() {
    const audio = this.backgroundMusic.nativeElement;
    if (this.isMusicPlaying()) {
      audio.pause();
      this.isMusicPlaying.set(false);
    } else {
      audio.play();
      this.isMusicPlaying.set(true);
    }
  }

  private updateCountdown() {
    const now = new Date().getTime();
    const distance = this.weddingDate.getTime() - now;

    if (distance < 0) {
      this.countdown.set({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      clearInterval(this.timerId);
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    this.countdown.set({ days, hours, minutes, seconds });
  }
  
  getCalendarLink(): string {
    const startTime = this.weddingDate.toISOString().replace(/-|:|\.\d\d\d/g, "");
    const endTimeDate = new Date(this.weddingDate);
    endTimeDate.setHours(endTimeDate.getHours() + 4); // Assume 4 hour event
    const endTime = endTimeDate.toISOString().replace(/-|:|\.\d\d\d/g, "");

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "BEGIN:VEVENT",
      `URL:${document.location.href}`,
      `DTSTART:${startTime}`,
      `DTEND:${endTime}`,
      `SUMMARY:Pernikahan ${this.brideName} & ${this.groomName}`,
      "DESCRIPTION:Jangan lupa untuk menghadiri hari bahagia kami!",
      "LOCATION:The Grand Ballroom, Jakarta",
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\n");

    return `data:text/calendar;charset=utf8,${encodeURIComponent(icsContent)}`;
  }
}