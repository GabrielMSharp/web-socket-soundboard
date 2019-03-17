import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ClientComponent implements OnInit {
  ableToShake: boolean = false;

  soundboardSounds = [
    {
      key: 'yas',
      icon: '💅',
      name: 'Sass',
      count: 8,
      timestamp: new Date().getTime(),
      msLimit: 2500,
      enabled: true,
      active: false
    },
    {
      key: 'party',
      icon: '🎉',
      name: 'Celebration',
      count: 4,
      timestamp: new Date().getTime(),
      msLimit: 2500,
      enabled: true,
      active: false
    },
    {
      key: 'wow',
      icon: '🙌',
      name: 'Wow!',
      count: 8,
      timestamp: new Date().getTime(),
      msLimit: 1000,
      enabled: true,
      active: false
    },
    {
      key: 'dog',
      icon: '🐶',
      name: 'Doggo',
      count: 8,
      timestamp: new Date().getTime(),
      msLimit: 500,
      enabled: true,
      active: false
    }
  ];

  clapSound = this.soundboardSounds.find(s => s.key === 'clap');

  constructor(private socket: Socket) { }

  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  enabled(sound): boolean {
    const now = new Date().getTime();
    return now - sound.timestamp > sound.msLimit;
  }

  trigger(sound: any): void {
    if (!sound.enabled) {
      return;
    }
    sound.enabled = false;
    sound.timestamp = new Date().getTime();
    const n = this.getRandomInt(sound.count || 1);
    this.socket.emit('message', `${sound.key}-${n}`);
  }

  ngOnInit(): void {

    this.shakeDetect();

    let lastTouchEnd = 0;
    document.addEventListener('touchend', (event) => {
      const now = (new Date()).getTime();
      if (now - lastTouchEnd <= 300) {
        event.preventDefault();
      }
      lastTouchEnd = now;
    }, false);

    window.addEventListener('touchmove', this, {passive: false});
    window.addEventListener('touchstart', this, { passive: false });

    this.checkEnabled();

    this.socket.on('reply', (data) => {
      const activeSound = this.soundboardSounds.find(sound => {
        return data.indexOf(sound.key) !== -1;
      });
      if (activeSound) {
        activeSound.active = true;
        setTimeout(() => {
          activeSound.active = false;
        }, 1000);
      }
    });

  }

  checkEnabled(): void {
    setTimeout(() => {
      this.soundboardSounds.forEach(sound => {
        sound.enabled = this.enabled(sound);
      });
      this.checkEnabled();
    }, 1000);
  }

  handleEvent(event): void {
    if (event.scale > 1) {
      event.preventDefault();
    }
    if (event.touches.length > 1) {
      event.preventDefault();
    }

  }

  // See this awesome blog post: http://www.jeffreyharrell.com/blog/2010/11/creating-a-shake-event-in-mobile-safari/

  shakeDetect(): void {
    if (typeof window['DeviceMotionEvent'] !== 'undefined') {

      this.ableToShake = true;
      // Shake sensitivity (a lower number is more)
      const sensitivity = 20;

      // Position variables
      let x1 = 0;
      let y1 = 0;
      let z1 = 0;
      let x2 = 0;
      let y2 = 0;
      let z2 = 0;

      // Listen to motion events and update the position
      window.addEventListener('devicemotion', (e) => {
          x1 = e.accelerationIncludingGravity.x;
          y1 = e.accelerationIncludingGravity.y;
          z1 = e.accelerationIncludingGravity.z;
      }, false);

      // Periodically check the position and fire
      // if the change is greater than the sensitivity
      setInterval(() => {
          const change = Math.abs(x1 - x2 + y1 - y2 + z1 - z2);

          if (change > sensitivity) {
            this.trigger({
              key: 'clap',
              icon: '👏',
              name: 'Single Clap',
              count: 10,
              timestamp: new Date().getTime(),
              msLimit: 0,
              enabled: true
            });
          }

          // Update new position
          x2 = x1;
          y2 = y1;
          z2 = z1;
      }, 150);
    }
  }

}
