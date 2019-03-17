import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-server',
  templateUrl: './server.component.html',
  styleUrls: ['./server.component.scss']
})
export class ServerComponent implements OnInit {
  messages: string[] = [];


  constructor(private socket: Socket) { }


  ngOnInit() {

    this.socket.on('reply', (data) => {
      const audio = new Audio(`/assets/sounds/${data}.mp3`);
      audio.play();
      this.messages.push(data);
    });
  }

}
